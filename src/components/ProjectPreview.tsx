import type { PreviewKind } from "../data/portfolio";
import { CloudRain, Mic, Search, Sparkles, Sun, Timer } from "lucide-react";

const accentMap = {
  lime: { text: "text-lime", bg: "bg-lime", soft: "bg-lime/10", border: "border-lime/25", from: "from-lime/25" },
  mint: { text: "text-mint", bg: "bg-mint", soft: "bg-mint/10", border: "border-mint/25", from: "from-mint/25" },
  cyan: { text: "text-cyan", bg: "bg-cyan", soft: "bg-cyan/10", border: "border-cyan/25", from: "from-cyan/25" },
  amber: { text: "text-amber-300", bg: "bg-amber-300", soft: "bg-amber-300/10", border: "border-amber-300/25", from: "from-amber-300/25" },
  rose: { text: "text-rose-300", bg: "bg-rose-300", soft: "bg-rose-300/10", border: "border-rose-300/25", from: "from-rose-300/25" }
};

export default function ProjectPreview({
  kind,
  accent = "lime",
  className = "",
  image
}: {
  kind: PreviewKind;
  accent?: keyof typeof accentMap;
  className?: string;
  image?: string;
}) {
  const color = accentMap[accent];

  if (image) {
    return (
      <div className={`group/preview relative overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}>
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover object-top transition duration-700 group-hover/preview:scale-[1.025]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
        <span className="absolute bottom-2.5 left-2.5 rounded-md border border-white/10 bg-black/55 px-2 py-1 font-mono text-[7px] tracking-[0.12em] text-white/45 backdrop-blur">
          LIVE PREVIEW
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#090e0c] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.025] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-lime/60" />
        <span className="ml-2 rounded-md bg-black/30 px-2 py-0.5 font-mono text-[7px] text-white/25">
          vibe.tools/{kind === "portfolio" ? "" : kind}
        </span>
      </div>

      <div className={`relative h-[172px] overflow-hidden p-3 ${color.soft}`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative h-full">
          {kind === "portfolio" && <PortfolioMock color={color} />}
          {kind === "todo" && <TodoMock color={color} />}
          {kind === "notes" && <NotesMock color={color} />}
          {kind === "pomodoro" && <PomodoroMock color={color} />}
          {kind === "weather" && <WeatherMock color={color} />}
        </div>
      </div>
    </div>
  );
}

function PortfolioMock({ color }: { color: (typeof accentMap)[keyof typeof accentMap] }) {
  return (
    <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-3">
      <div className="flex flex-col justify-center">
        <div className={`mb-2 h-1.5 w-16 rounded-full ${color.bg} opacity-70`} />
        <div className="h-4 w-[92%] rounded-md bg-white/80" />
        <div className={`mt-1 h-4 w-[76%] rounded-md ${color.bg} opacity-80`} />
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-[88%] rounded-full bg-white/15" />
          <div className="h-1.5 w-[62%] rounded-full bg-white/10" />
        </div>
        <div className="mt-4 flex gap-1.5">
          <span className={`h-5 w-14 rounded-full ${color.bg}`} />
          <span className="h-5 w-12 rounded-full border border-white/15" />
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <div className={`absolute h-24 w-24 rounded-full ${color.bg} opacity-10 blur-xl`} />
        <div className="relative w-full rounded-xl border border-white/10 bg-black/30 p-2.5">
          <div className={`h-12 w-full rounded-lg ${color.bg} opacity-20`} />
          <div className="mt-2 h-1.5 w-14 rounded-full bg-white/55" />
          <div className="mt-1 h-1 w-20 rounded-full bg-white/15" />
          <div className="mt-3 flex gap-1">
            <span className="h-3 w-7 rounded bg-white/10" />
            <span className="h-3 w-7 rounded bg-white/10" />
            <span className="h-3 w-7 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TodoMock({ color }: { color: (typeof accentMap)[keyof typeof accentMap] }) {
  return (
    <div className="grid h-full grid-cols-[62px_1fr] gap-2.5">
      <div className="rounded-lg border border-white/10 bg-black/25 p-2">
        <div className={`h-1.5 w-8 rounded-full ${color.bg} opacity-80`} />
        <div className="mt-3 space-y-2">
          {[80, 65, 72, 50].map((width, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? color.bg : "bg-white/20"}`} />
              <span className="h-1 rounded-full bg-white/15" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="h-2 w-16 rounded-full bg-white/65" />
            <div className="mt-1 h-1 w-10 rounded-full bg-white/20" />
          </div>
          <span className={`rounded-md px-1.5 py-1 text-[6px] ${color.soft} ${color.text}`}>+ 新任务</span>
        </div>
        <div className="space-y-1.5">
          {[
            { title: "完成 PRD 文档", color: "bg-lime/60", done: true },
            { title: "实现筛选逻辑", color: "bg-mint/60", done: false },
            { title: "补充移动端样式", color: "bg-cyan/60", done: false }
          ].map((task) => (
            <div key={task.title} className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-black/25 px-2 py-1.5">
              <span className={`grid h-3 w-3 place-items-center rounded-[3px] border ${task.done ? "border-lime bg-lime text-black" : "border-white/20"}`}>
                {task.done && <span className="text-[6px]">✓</span>}
              </span>
              <span className={`text-[7px] ${task.done ? "text-white/30 line-through" : "text-white/65"}`}>{task.title}</span>
              <span className={`ml-auto h-1.5 w-1.5 rounded-full ${task.color}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesMock({ color }: { color: (typeof accentMap)[keyof typeof accentMap] }) {
  return (
    <div className="grid h-full grid-cols-[68px_1fr] gap-2.5">
      <div className="rounded-lg border border-white/10 bg-black/25 p-2">
        <div className="flex items-center justify-between">
          <span className="h-1.5 w-8 rounded-full bg-white/50" />
          <span className={`grid h-3 w-3 place-items-center rounded ${color.soft} ${color.text}`}>+</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {["欢迎使用", "React 清单", "API 笔记"].map((title, index) => (
            <div key={title} className={`rounded px-1.5 py-1 text-[6px] ${index === 0 ? `${color.soft} ${color.text}` : "text-white/35"}`}>
              {title}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-black/25 p-2">
          <div className="mb-2 h-1.5 w-12 rounded-full bg-white/55" />
          <div className="space-y-1.5">
            <div className="h-1 w-full rounded-full bg-white/15" />
            <div className="h-1 w-[80%] rounded-full bg-white/15" />
            <div className={`h-1 w-[62%] rounded-full ${color.bg} opacity-60`} />
            <div className="h-1 w-[72%] rounded-full bg-white/15" />
            <div className="mt-2 rounded bg-black/40 p-1.5">
              <div className="h-1 w-[65%] rounded-full bg-cyan/50" />
              <div className="mt-1 h-1 w-[45%] rounded-full bg-lime/40" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
          <div className={`mb-2 h-1.5 w-14 rounded-full ${color.bg} opacity-80`} />
          <div className="space-y-1.5">
            <div className="h-1 w-full rounded-full bg-white/25" />
            <div className="h-1 w-[82%] rounded-full bg-white/15" />
            <div className="h-1 w-[70%] rounded-full bg-white/15" />
            <div className="my-2 border-t border-white/10" />
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-lime/60" />
              <div className="h-1 w-[70%] rounded-full bg-white/15" />
            </div>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan/60" />
              <div className="h-1 w-[55%] rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PomodoroMock({ color }: { color: (typeof accentMap)[keyof typeof accentMap] }) {
  return (
    <div className="flex h-full items-center justify-center gap-5">
      <div className="relative grid h-28 w-28 place-items-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="314"
            strokeDashoffset="86"
            className={color.text}
          />
        </svg>
        <div className="text-center">
          <div className="font-mono text-xl font-medium text-white">18:42</div>
          <div className="mt-1 text-[6px] uppercase tracking-[0.18em] text-white/35">focus session</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex gap-1">
          <span className={`rounded px-1.5 py-1 text-[6px] ${color.soft} ${color.text}`}>专注</span>
          <span className="rounded px-1.5 py-1 text-[6px] text-white/25">休息</span>
        </div>
        <div className="flex items-center gap-1 text-[7px] text-white/40">
          <Timer className="h-3 w-3" /> 已完成 3 个番茄
        </div>
        <div className="flex gap-1">
          <span className={`h-5 w-14 rounded-full ${color.bg}`} />
          <span className="h-5 w-10 rounded-full border border-white/15" />
        </div>
      </div>
    </div>
  );
}

function WeatherMock({ color }: { color: (typeof accentMap)[keyof typeof accentMap] }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[6px] text-white/30">
          <Search className="h-2.5 w-2.5" /> 搜索城市
        </div>
        <Mic className="h-3 w-3 text-white/25" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[7px] text-white/35">武汉 · 中国</div>
          <div className="mt-1 flex items-end gap-1">
            <span className="font-display text-4xl font-medium leading-none text-white">24°</span>
            <span className={`mb-1 text-[7px] ${color.text}`}>晴间多云</span>
          </div>
          <div className="mt-1 flex gap-2 text-[6px] text-white/30">
            <span>湿度 62%</span>
            <span>风速 12 km/h</span>
          </div>
        </div>
        <Sun className={`h-12 w-12 ${color.text} opacity-80`} />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {[22, 20, 18, 21, 23].map((temp, index) => (
          <div key={index} className="rounded-md border border-white/[0.06] bg-black/25 px-1.5 py-1 text-center">
            <div className="text-[5px] text-white/30">{["一", "二", "三", "四", "五"][index]}</div>
            <div className="mt-1 flex justify-center">
              {index === 2 ? <CloudRain className="h-3 w-3 text-cyan/70" /> : <Sun className="h-3 w-3 text-amber-300/70" />}
            </div>
            <div className="mt-0.5 text-[6px] text-white/55">{temp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
