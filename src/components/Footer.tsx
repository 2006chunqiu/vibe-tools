import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Mail, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06]">
      <div className="shell py-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-lime/25 bg-lime/10 text-lime">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-white">VIBE TOOLS</span>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-6 text-white/35">
              五个从需求、设计到实现的完整个人工具。用 Vibe Coding 把想法做成真正能用的产品。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="btn-ghost">
              作品集
            </Link>
            <Link to="/todo" className="btn-ghost">
              待办
            </Link>
            <Link to="/notes" className="btn-ghost">
              笔记
            </Link>
            <Link to="/pomodoro" className="btn-ghost">
              番茄钟
            </Link>
            <Link to="/weather" className="btn-ghost">
              天气
            </Link>
          </div>
        </div>

        <div className="mt-9 flex flex-col justify-between gap-4 border-t border-white/[0.06] pt-5 text-[10px] text-white/30 sm:flex-row sm:items-center">
          <p>© 2026 王乐 · Vibe Tools. Built with React, TypeScript & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <a className="flex items-center gap-1.5 transition hover:text-lime" href="mailto:3402990356@qq.com">
              <Mail className="h-3 w-3" /> 邮箱
            </a>
            <a
              className="flex items-center gap-1.5 transition hover:text-lime"
              href="https://github.com/2006chunqiu/-"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-3 w-3" /> GitHub
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 transition hover:text-lime"
              aria-label="回到顶部"
            >
              回到顶部 <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
