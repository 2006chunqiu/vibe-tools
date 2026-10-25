import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";

const links = [
  { to: "/", label: "作品集", end: true },
  { to: "/todo", label: "待办事项" },
  { to: "/notes", label: "Markdown" },
  { to: "/pomodoro", label: "番茄钟" },
  { to: "/weather", label: "天气" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink/75 backdrop-blur-2xl">
      <div className="shell flex h-[72px] items-center justify-between gap-5">
        <Link to="/" className="group flex items-center gap-3" aria-label="Vibe Tools 首页">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-lime/30 bg-lime/10 text-lime">
            <Sparkles className="h-5 w-5" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-wide text-white">VIBE TOOLS</span>
            <span className="block font-mono text-[8px] tracking-[0.22em] text-white/35">PERSONAL LAB / 2026</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-xs transition ${
                  isActive ? "bg-lime text-[#0b120d]" : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="mailto:3402990356@qq.com"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/65 transition hover:border-lime/40 hover:text-lime sm:inline-flex"
          >
            联系我
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 lg:hidden"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] bg-ink/95 px-5 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-md gap-1" aria-label="移动端导航">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm ${
                    isActive ? "bg-lime text-[#0b120d]" : "text-white/65 hover:bg-white/[0.05]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
