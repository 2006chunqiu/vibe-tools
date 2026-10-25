import type { ReactNode } from "react";

export default function PageHeader({
  index,
  kicker,
  title,
  description,
  icon,
  accent = "text-lime",
  actions
}: {
  index: string;
  kicker: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="shell pb-10 pt-12 sm:pt-16">
      <div className="flex flex-col justify-between gap-8 border-b border-white/[0.07] pb-9 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-lime/60">{index}</span>
            <span className="h-px w-8 bg-white/15" />
            <span className="label">{kicker}</span>
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.05em] text-white">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">{description}</p>
          {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        <div className={`hidden h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] ${accent} lg:grid`}>
          {icon}
        </div>
      </div>
    </header>
  );
}
