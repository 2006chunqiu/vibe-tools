import { readFile, readdir, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const workspaceRoot = path.resolve(projectRoot, "..");
const tokenPath = path.join(workspaceRoot, ".deploy", "github-token-vibe.json");
const outputPath = path.join(workspaceRoot, ".deploy", "github-vibe.json");
const owner = process.env.GITHUB_OWNER || "2006chunqiu";
const repo = process.env.GITHUB_REPO || "vibe-tools";
const apiBase = "https://api.github.com";
const excludedDirs = new Set([
  ".git",
  ".deploy",
  "node_modules",
  "dist",
  "release",
  "qa",
  ".cache",
  ".pnpm-home",
  ".pnpm-store",
  ".tmp"
]);
const excludedFiles = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);

let token = process.env.GITHUB_TOKEN || "";
if (!token) {
  try {
    token = JSON.parse(await readFile(tokenPath, "utf8")).access_token || "";
  } catch {
    token = "";
  }
}
if (!token) throw new Error("GitHub token missing. Set GITHUB_TOKEN or create .deploy/github-token-vibe.json.");

const headers = {
  Authorization: "Bearer " + token,
  Accept: "application/vnd.github+json",
  "User-Agent": "vibe-tools-deploy",
  "X-GitHub-Api-Version": "2022-11-28",
  "Content-Type": "application/json"
};

async function api(method, endpoint, body) {
  const response = await fetch(apiBase + endpoint, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!response.ok) {
    const error = new Error(`${method} ${endpoint} -> ${response.status}: ${text.slice(0, 700)}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function walk(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && excludedDirs.has(entry.name)) continue;
    if (entry.isFile() && excludedFiles.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute, base)));
    } else if (entry.isFile()) {
      files.push({
        absolute,
        relative: path.relative(base, absolute).split(path.sep).join("/")
      });
    }
  }

  return files.sort((a, b) => a.relative.localeCompare(b.relative));
}

async function waitForRun(commitSha) {
  const started = Date.now();
  let dispatched = false;

  while (Date.now() - started < 8 * 60 * 1000) {
    const runs = await api("GET", `/repos/${owner}/${repo}/actions/runs?per_page=20`);
    const candidates = runs.workflow_runs.filter((run) => run.head_sha === commitSha);
    const success = candidates.find((run) => run.status === "completed" && run.conclusion === "success");
    if (success) return success;

    const active = candidates.filter((run) => run.status !== "completed");
    if (active.length) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue;
    }

    if (!dispatched) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const refreshed = await api("GET", `/repos/${owner}/${repo}/actions/runs?per_page=20`);
      const hasRun = refreshed.workflow_runs.some((run) => run.head_sha === commitSha);
      if (!hasRun) {
        await api("POST", `/repos/${owner}/${repo}/actions/workflows/deploy-pages.yml/dispatches`, { ref: "main" });
        console.log("Workflow dispatch requested.");
      }
      dispatched = true;
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue;
    }

    const failed = candidates.find(
      (run) => run.status === "completed" && run.conclusion && run.conclusion !== "success"
    );
    if (failed) return failed;

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error("Timed out waiting for GitHub Pages workflow");
}

async function waitForPages(url) {
  const started = Date.now();
  while (Date.now() - started < 5 * 60 * 1000) {
    try {
      const response = await fetch(`${url}?v=${Date.now()}`, {
        headers: { "User-Agent": "vibe-tools-verifier" },
        cache: "no-store"
      });
      const text = await response.text();
      if (response.ok && text.includes("Vibe Tools")) return true;
      console.log(`Pages check: HTTP ${response.status}`);
    } catch (error) {
      console.log("Pages check pending: " + error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  return false;
}

async function main() {
  const user = await api("GET", "/user");
  console.log("Authenticated as:", user.login);

  let repoInfo;
  try {
    repoInfo = await api("GET", `/repos/${owner}/${repo}`);
  } catch (error) {
    if (error.status !== 404) throw error;
    repoInfo = await api("POST", "/user/repos", {
      name: repo,
      description: "Vibe Tools · 个人工具开发：作品集、待办、Markdown 笔记、番茄钟、天气",
      homepage: `https://${owner}.github.io/${repo}/`,
      private: false,
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      auto_init: false
    });
    console.log("Repository created:", repoInfo.full_name);
  }

  try {
    const pages = await api("GET", `/repos/${owner}/${repo}/pages`);
    console.log("Pages already enabled:", pages.html_url || "");
  } catch (error) {
    if (error.status === 404) {
      const pages = await api("POST", `/repos/${owner}/${repo}/pages`, { build_type: "workflow" });
      console.log("Pages enabled:", pages.html_url || "");
    } else {
      throw error;
    }
  }

  let baseCommit;
  let baseTree;
  try {
    const ref = await api("GET", `/repos/${owner}/${repo}/git/ref/heads/main`);
    baseCommit = await api("GET", `/repos/${owner}/${repo}/git/commits/${ref.object.sha}`);
    baseTree = baseCommit.tree.sha;
  } catch (error) {
    if (error.status !== 404 && error.status !== 409) throw error;
    const initialized = await api("PUT", `/repos/${owner}/${repo}/contents/README.md`, {
      message: "chore: initialize repository",
      content: Buffer.from("# Vibe Tools\n\n正在部署个人工具开发项目。\n", "utf8").toString("base64"),
      branch: "main"
    });
    const ref = await api("GET", `/repos/${owner}/${repo}/git/ref/heads/main`);
    baseCommit = await api("GET", `/repos/${owner}/${repo}/git/commits/${ref.object.sha}`);
    baseTree = baseCommit.tree.sha;
    console.log("Repository initialized:", initialized.commit.sha.slice(0, 7));
  }

  const files = await walk(projectRoot);
  console.log(`Uploading ${files.length} source files...`);
  const treeEntries = [];

  for (const file of files) {
    const content = await readFile(file.absolute);
    const blob = await api("POST", `/repos/${owner}/${repo}/git/blobs`, {
      content: content.toString("base64"),
      encoding: "base64"
    });
    treeEntries.push({
      path: file.relative,
      mode: "100644",
      type: "blob",
      sha: blob.sha
    });
  }

  const tree = await api("POST", `/repos/${owner}/${repo}/git/trees`, {
    base_tree: baseTree,
    tree: treeEntries
  });

  const commit = await api("POST", `/repos/${owner}/${repo}/git/commits`, {
    message: "feat: 完成 Vibe Tools 五合一个人工具",
    tree: tree.sha,
    parents: [baseCommit.sha]
  });

  await api("PATCH", `/repos/${owner}/${repo}/git/refs/heads/main`, {
    sha: commit.sha,
    force: false
  });
  console.log("Pushed source commit:", commit.sha.slice(0, 7));

  const run = await waitForRun(commit.sha);
  console.log("Workflow:", run.status, run.conclusion || "", run.html_url || "");
  if (run.conclusion !== "success") throw new Error("GitHub Actions deployment failed: " + (run.html_url || ""));

  const pagesUrl = `https://${owner}.github.io/${repo}/`;
  const live = await waitForPages(pagesUrl);
  const record = {
    owner,
    repo,
    repoUrl: `https://github.com/${owner}/${repo}`,
    pagesUrl,
    commit: commit.sha,
    workflowRun: run.html_url || null,
    workflowConclusion: run.conclusion,
    verified: live,
    deployedAt: new Date().toISOString()
  };
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(record, null, 2) + "\n");

  console.log("");
  console.log("GitHub repository:", record.repoUrl);
  console.log("Public site    :", record.pagesUrl);
  console.log("Verified       :", live ? "yes" : "not yet (Pages may still be building)");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
