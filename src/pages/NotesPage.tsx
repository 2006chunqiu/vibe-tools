import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import { format } from "date-fns";
import {
  Clock3,
  Eye,
  FileText,
  Hash,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  Trash2
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useNotesStore } from "../store/notesStore";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("markup", markup);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const language = /language-(\w+)/.exec(className || "")?.[1];
    const value = String(children).replace(/\n$/, "");
    if (language) {
      return (
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.78rem"
          }}
        >
          {value}
        </SyntaxHighlighter>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
};

export default function NotesPage() {
  const { notes, activeId, createNote, updateNote, deleteNote, setActive } = useNotesStore();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeNote = notes.find((note) => note.id === activeId) ?? notes[0] ?? null;

  useEffect(() => {
    if (!activeNote && notes.length) setActive(notes[0].id);
  }, [activeNote, notes, setActive]);

  useEffect(() => {
    setView("edit");
  }, [activeId]);

  const filteredNotes = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return notes;
    return notes.filter((note) => note.title.toLowerCase().includes(keyword));
  }, [notes, query]);

  const create = () => {
    createNote();
    setView("edit");
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const remove = (id: string) => {
    if (window.confirm("确定删除这条笔记吗？删除后无法恢复。")) deleteNote(id);
  };

  const updateContent = (content: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, { content });
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = activeNote?.content ?? "";

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      const selected = content.slice(start, end);
      const next = `${content.slice(0, start)}**${selected || "加粗文字"}**${content.slice(end)}`;
      updateContent(next);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2 + (selected || "加粗文字").length);
      });
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      create();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const next = `${content.slice(0, start)}  ${content.slice(end)}`;
      updateContent(next);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      });
    }
  };

  return (
    <div>
      <PageHeader
        index="03"
        kicker="PROJECT / MARKDOWN NOTES"
        title="Markdown 笔记，实时预览。"
        description="左侧管理笔记，右侧编辑与预览。支持 GFM、代码高亮、搜索、自动保存和快捷键，数据保存在浏览器。"
        icon={<PencilLine className="h-7 w-7" />}
        actions={
          <button type="button" onClick={create} className="btn-primary">
            <Plus className="h-4 w-4" /> 新建笔记
          </button>
        }
      />

      <div className="shell">
        <div className="card overflow-hidden">
          <div className="grid min-h-[680px] lg:grid-cols-[270px_minmax(0,1fr)]">
            <aside className="border-b border-white/[0.07] bg-black/15 p-4 lg:border-b-0 lg:border-r">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="field py-2.5 pl-9 text-xs"
                  placeholder="搜索笔记标题…"
                  aria-label="搜索笔记"
                />
              </div>

              <div className="mt-4 flex items-center justify-between px-1">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                  NOTES / {filteredNotes.length}
                </span>
                <button type="button" onClick={create} className="text-lime/70 transition hover:text-lime" aria-label="新建笔记">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="scroll-thin mt-2 max-h-[220px] space-y-1 overflow-y-auto lg:max-h-[560px]">
                {filteredNotes.length === 0 ? (
                  <p className="px-2 py-8 text-center text-[10px] leading-5 text-white/25">没有找到匹配的笔记</p>
                ) : (
                  filteredNotes.map((note) => {
                    const active = note.id === activeNote?.id;
                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => setActive(note.id)}
                        className={`group w-full rounded-xl border px-3 py-3 text-left transition ${
                          active
                            ? "border-lime/20 bg-lime/[0.07]"
                            : "border-transparent hover:border-white/[0.07] hover:bg-white/[0.035]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`truncate text-[11px] ${active ? "text-white" : "text-white/65"}`}>{note.title}</span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.stopPropagation();
                              remove(note.id);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.stopPropagation();
                                remove(note.id);
                              }
                            }}
                            className="opacity-0 transition hover:text-rose-300 group-hover:opacity-100"
                            aria-label={`删除笔记：${note.title}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-white/25">
                          {note.content.replace(/[#>*`\-\n]/g, " ").trim().slice(0, 56) || "空白笔记"}
                        </p>
                        <span className="mt-2 block font-mono text-[7px] text-white/20">
                          {format(new Date(note.updatedAt), "M月d日 HH:mm")}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="mt-4 border-t border-white/[0.07] pt-3">
                <p className="flex items-center gap-1.5 text-[9px] text-white/20">
                  <Sparkles className="h-3 w-3 text-lime/40" />
                  自动保存 · LocalStorage
                </p>
              </div>
            </aside>

            {activeNote ? (
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan/60" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                      {view === "edit" ? "EDITING" : "PREVIEW"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1 xl:hidden">
                    <button
                      type="button"
                      onClick={() => setView("edit")}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[9px] ${
                        view === "edit" ? "bg-white text-[#0b120d]" : "text-white/35"
                      }`}
                    >
                      <PencilLine className="h-3 w-3" /> 编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("preview")}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[9px] ${
                        view === "preview" ? "bg-white text-[#0b120d]" : "text-white/35"
                      }`}
                    >
                      <Eye className="h-3 w-3" /> 预览
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] text-white/25">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" /> {activeNote.content.length} 字符
                    </span>
                    <span className="hidden items-center gap-1 sm:flex">
                      <Clock3 className="h-3 w-3" /> {format(new Date(activeNote.updatedAt), "HH:mm")}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(activeNote.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-white/25 transition hover:bg-rose-400/10 hover:text-rose-300"
                      aria-label="删除当前笔记"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid min-h-[620px] xl:grid-cols-2">
                  <section className={`min-w-0 border-b border-white/[0.07] xl:border-b-0 xl:border-r ${view === "edit" ? "block" : "hidden"} xl:block`}>
                    <div className="border-b border-white/[0.05] px-5 py-4">
                      <input
                        value={activeNote.title}
                        onChange={(event) => updateNote(activeNote.id, { title: event.target.value })}
                        className="w-full border-0 bg-transparent text-xl font-medium tracking-tight text-white outline-none placeholder:text-white/20"
                        placeholder="笔记标题…"
                        aria-label="笔记标题"
                      />
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={activeNote.content}
                      onChange={(event) => updateContent(event.target.value)}
                      onKeyDown={handleEditorKeyDown}
                      spellCheck={false}
                      className="scroll-thin h-[530px] w-full resize-none border-0 bg-transparent p-5 font-mono text-[12px] leading-7 text-white/65 outline-none placeholder:text-white/20"
                      placeholder="用 Markdown 写下你的想法…"
                      aria-label="Markdown 编辑器"
                    />
                    <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.05] px-5 py-3 font-mono text-[8px] text-white/20">
                      <span>TAB / 2 SPACES</span>
                      <span>⌘/CTRL + B / BOLD</span>
                      <span>⌘/CTRL + ENTER / NEW NOTE</span>
                    </div>
                  </section>

                  <section className={`min-w-0 bg-white/[0.015] ${view === "preview" ? "block" : "hidden"} xl:block`}>
                    <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
                      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-cyan/50">LIVE PREVIEW</span>
                      <span className="flex items-center gap-1.5 text-[8px] text-lime/50">
                        <span className="h-1 w-1 animate-pulse-soft rounded-full bg-lime" /> 实时同步
                      </span>
                    </div>
                    <div className="markdown scroll-thin h-[530px] overflow-y-auto p-5">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {activeNote.content}
                      </ReactMarkdown>
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/25">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-sm text-white/65">还没有笔记</h3>
                <p className="mt-2 text-[11px] text-white/30">新建一条，开始记录你的想法。</p>
                <button type="button" onClick={create} className="btn-primary mt-5">
                  <Plus className="h-4 w-4" /> 新建笔记
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-[10px] text-white/25">支持 GFM 表格、任务列表、代码块和自动保存。数据仅保存在当前浏览器。</p>
      </div>
    </div>
  );
}
