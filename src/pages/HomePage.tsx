import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CloudSun,
  Code2,
  Github,
  Layers,
  Mail,
  MapPin,
  PenLine,
  Sparkles,
  Timer,
  ListTodo
} from "lucide-react";
import avatar from "../assets/avatar.svg";
import ProjectPreview from "../components/ProjectPreview";
import { profile, projects, skills, workflow } from "../data/portfolio";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HomePage() {
  return (
    <div>
      <section className="shell relative pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/[0.06] px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-lime" />
              <span className="font-mono text-[9px] tracking-[0.16em] text-lime/80">VIBE CODING / PERSONAL TOOLKIT</span>
            </div>

            <h1 className="mt-7 max-w-2xl font-display text-[clamp(2.5rem,5.4vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.055em] text-white">
              把想法，
              <br />
              做成<span className="gradient-text">能用的工具</span>。
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-white/45 sm:text-[15px]">
              这里收录了 Vibe Coding 个人工具开发的 5 个完整实战：作品集、进阶待办、Markdown 笔记、番茄钟和天气查询。
              从 PRD 到上线，每一个都能真正使用。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => scrollToId("projects")} className="btn-primary">
                探索 5 个工具 <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scrollToId("about")} className="btn-secondary">
                关于我 <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-white/[0.08] pt-6 sm:grid-cols-4">
              <Stat value="05" label="实战项目" />
              <Stat value="05" label="开发步骤" />
              <Stat value="100%" label="响应式" />
              <Stat value="0" label="后端依赖" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -inset-8 rounded-full bg-lime/10 blur-[60px]" />
            <div className="absolute -inset-2 rounded-[2.4rem] border border-white/[0.05] [transform:rotate(3deg)]" />
            <div className="card relative overflow-hidden border-white/15 bg-[#0b110e]/95 p-6 shadow-glow sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] tracking-[0.16em] text-white/30">CREATOR / 2026</span>
                <span className="flex items-center gap-1.5 rounded-full border border-lime/25 bg-lime/10 px-2.5 py-1 text-[8px] text-lime">
                  <span className="h-1 w-1 rounded-full bg-lime" /> OPEN TO BUILD
                </span>
              </div>

              <div className="relative mx-auto mt-7 h-44 w-44">
                <div className="absolute inset-0 rounded-full border border-dashed border-lime/25" />
                <div className="absolute inset-2 overflow-hidden rounded-full border border-white/15 bg-lime">
                  <img src={avatar} alt="王乐的插画头像" className="h-full w-full object-cover" />
                </div>
                <span className="absolute -right-2 bottom-2 grid h-11 w-11 rotate-6 place-items-center rounded-full border border-[#0b110e] bg-lime text-xs font-bold text-[#0b120d]">
                  WL
                </span>
              </div>

              <div className="mt-5 text-center">
                <h2 className="font-display text-2xl font-medium tracking-wide text-white">{profile.name}</h2>
                <p className="mt-1 text-[11px] text-white/40">{profile.role}</p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                {profile.focus.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 font-mono text-[8px] text-white/25">
                <span>BUILD / LEARN / SHIP</span>
                <span className="text-white/45">05 TOOLS</span>
              </div>
            </div>

            <div className="absolute -left-5 top-24 hidden animate-float rounded-xl border border-white/15 bg-white/[0.09] px-3 py-2 shadow-card backdrop-blur-xl sm:block">
              <div className="font-mono text-[7px] tracking-[0.14em] text-white/35">STACK</div>
              <div className="mt-0.5 text-[10px] text-white/75">React + TypeScript</div>
            </div>
            <div className="absolute -right-3 bottom-24 hidden animate-float rounded-xl border border-white/15 bg-white/[0.09] px-3 py-2 shadow-card backdrop-blur-xl [animation-delay:-3s] sm:block">
              <div className="font-mono text-[7px] tracking-[0.14em] text-white/35">STATUS</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" /> 5/5 已完成
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-white/[0.06] py-5 text-[10px] text-white/30">
          <span className="font-mono uppercase tracking-[0.18em]">BUILT WITH</span>
          {["React 18", "TypeScript", "Tailwind CSS", "Zustand", "react-markdown", "Open-Meteo"].map((tech) => (
            <span key={tech} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-lime/60" />
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section id="about" className="shell scroll-mt-24 py-20 sm:py-28">
        <SectionHeading index="01" label="ABOUT" title="一个正在学习，也正在交付的人。" />
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="card relative overflow-hidden p-7 sm:p-9">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime/10 blur-3xl" />
            <div className="relative">
              <p className="max-w-2xl text-base leading-8 text-white/65">
                我是王乐，武汉理工大学数字经济专业大二学生。这个网站是《数智编程技术基础及应用》课程中
                “个人工具开发”的完整实践：从需求分析、PRD、技术设计，到组件实现、数据持久化和 API 调用，
                五个项目都可以真正打开使用。
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <InfoItem icon={<MapPin className="h-4 w-4" />} label="城市" value="武汉 · 中国" />
                <InfoItem icon={<Layers className="h-4 w-4" />} label="学校" value="武汉理工大学" />
                <InfoItem icon={<Code2 className="h-4 w-4" />} label="专业" value="数字经济 · 大二" />
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.name} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
                    <span className="text-[11px] text-white/75">{skill.name}</span>
                    <span className="ml-2 font-mono text-[8px] text-white/25">{skill.note}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card flex flex-col justify-between overflow-hidden p-7 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-lime">
                <Sparkles className="h-4 w-4" />
                <span className="font-mono text-[9px] tracking-[0.18em]">CURRENTLY BUILDING</span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium leading-snug text-white">
                用工具解决
                <br />
                自己的真实问题。
              </h3>
              <p className="mt-4 text-xs leading-6 text-white/40">
                课程作业不是终点。每个项目都保留了 LocalStorage、API 或通知能力，后续可以继续扩展成真正日常使用的工具。
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[10px] text-white/30">
              <span className="font-mono">2026 / SEMESTER 02</span>
              <span className="flex items-center gap-1.5 text-lime/70">
                <CheckCircle2 className="h-3.5 w-3.5" /> 全部可运行
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="shell scroll-mt-24 py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading index="02" label="PROJECTS" title="五个项目，五种能力。" />
          <p className="max-w-xs text-xs leading-6 text-white/35 sm:text-right">
            每个项目都可以直接打开体验。数据保存在本地，天气数据来自公开 API。
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={project.route}
              className={`group card relative overflow-hidden p-4 transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055] ${
                project.id === "portfolio" ? "md:col-span-2" : ""
              }`}
            >
              <div className={project.id === "portfolio" ? "grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-center" : ""}>
                <ProjectPreview
                  kind={project.preview}
                  accent={project.accent}
                  image={project.image}
                  className={project.id === "portfolio" ? "h-full min-h-[230px]" : "h-[210px]"}
                />
                <div className={project.id === "portfolio" ? "md:pr-5" : "px-1 pb-2 pt-4"}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[9px] tracking-[0.16em] text-white/25">
                      {project.index} / {project.subtitle}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-lime/20 bg-lime/[0.06] px-2 py-1 text-[8px] text-lime/75">
                      <span className="h-1 w-1 rounded-full bg-lime" /> {project.status}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-white/40">{project.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {project.tech.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-lime/80 transition group-hover:gap-2.5">
                    打开项目 <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell py-20 sm:py-28">
        <SectionHeading index="03" label="PROCESS" title="Vibe Coding 五步法。" />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {workflow.map((step, index) => (
            <div key={step.index} className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <span className="font-mono text-[9px] text-lime/60">{step.index}</span>
              <h3 className="mt-5 text-sm font-medium text-white/85">{step.title}</h3>
              <p className="mt-2 text-[11px] leading-6 text-white/35">{step.description}</p>
              {index < workflow.length - 1 && (
                <ArrowRight className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-white/15 xl:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="shell py-20 sm:py-28">
        <div className="card relative overflow-hidden border-lime/15 bg-gradient-to-br from-lime/[0.1] via-white/[0.03] to-cyan/[0.05] p-8 sm:p-12">
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-lime/15 blur-[90px]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="label">04 / CONTACT</span>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4vw,3.4rem)] font-medium leading-tight tracking-[-0.045em] text-white">
                一起把想法，
                <br />
                做成<span className="gradient-text">能用的东西</span>。
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/40">
                如果你也在学习前端、AI 或 Vibe Coding，欢迎交流。也欢迎直接打开上面的工具，留下一段使用反馈。
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a href={`mailto:${profile.email}`} className="btn-primary">
                <Mail className="h-4 w-4" /> 发邮件
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </div>
          <div className="relative mt-10 flex flex-wrap items-center gap-5 border-t border-white/[0.08] pt-5 text-[10px] text-white/35">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> {profile.email}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> 武汉 · 中国
            </span>
            <span className="ml-auto hidden items-center gap-1.5 sm:flex">
              <CloudSun className="h-3 w-3 text-cyan/60" /> 5 个工具 · 全部可运行
            </span>
          </div>
        </div>
      </section>

      <div className="shell pb-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickTool to="/todo" icon={<ListTodo className="h-4 w-4" />} title="待办事项" note="任务、筛选、统计" />
          <QuickTool to="/notes" icon={<PenLine className="h-4 w-4" />} title="Markdown" note="实时预览、代码高亮" />
          <QuickTool to="/pomodoro" icon={<Timer className="h-4 w-4" />} title="番茄钟" note="专注、通知、统计" />
          <QuickTool to="/weather" icon={<CloudSun className="h-4 w-4" />} title="天气" note="搜索、定位、收藏" />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-medium text-white/90">{value}</div>
      <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/30">{label}</div>
    </div>
  );
}

function SectionHeading({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] text-lime/60">{index}</span>
        <span className="h-px w-8 bg-white/15" />
        <span className="label">{label}</span>
      </div>
      <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,4vw,3.1rem)] font-medium leading-tight tracking-[-0.045em] text-white">
        {title}
      </h2>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-3.5">
      <div className="flex items-center gap-2 text-white/30">
        {icon}
        <span className="font-mono text-[8px] uppercase tracking-[0.14em]">{label}</span>
      </div>
      <div className="mt-2 text-[11px] text-white/75">{value}</div>
    </div>
  );
}

function QuickTool({ to, icon, title, note }: { to: string; icon: ReactNode; title: string; note: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-lime/20 hover:bg-lime/[0.04]"
    >
      <span className="icon-box transition group-hover:border-lime/25 group-hover:bg-lime/10">{icon}</span>
      <span>
        <span className="block text-xs text-white/75">{title}</span>
        <span className="mt-0.5 block font-mono text-[8px] text-white/25">{note}</span>
      </span>
      <ArrowUpRight className="ml-auto h-4 w-4 text-white/20 transition group-hover:text-lime" />
    </Link>
  );
}
