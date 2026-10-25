import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { isToday, isWithinInterval, parseISO, startOfWeek, endOfWeek } from "date-fns";
import {
  Bell,
  BellOff,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SkipForward,
  Target,
  Timer,
  Volume2,
  VolumeX
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { usePomodoroStore, type PomodoroMode } from "../store/pomodoroStore";

const modeMeta: Record<
  PomodoroMode,
  { label: string; sub: string; color: string; ring: string; description: string }
> = {
  focus: {
    label: "专注",
    sub: "FOCUS",
    color: "text-amber-300",
    ring: "#fcd34d",
    description: "一次只做一件事"
  },
  short: {
    label: "短休息",
    sub: "SHORT BREAK",
    color: "text-cyan",
    ring: "#7ce7f4",
    description: "站起来，喝口水"
  },
  long: {
    label: "长休息",
    sub: "LONG BREAK",
    color: "text-mint",
    ring: "#7ef0c1",
    description: "让大脑真正放松一下"
  }
};

const CIRCUMFERENCE = 2 * Math.PI * 112;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  return new AudioContextClass();
}

export default function PomodoroPage() {
  const { sessions, settings, addSession, updateSettings, clearSessions } = usePomodoroStore();
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [remaining, setRemaining] = useState(settings.focus * 60);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );
  const endAtRef = useRef<number | null>(null);
  const completingRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);

  const duration = settings[mode] * 60;
  const progress = duration > 0 ? remaining / duration : 0;
  const offset = CIRCUMFERENCE * (1 - progress);
  const focusCount = sessions.length;
  const roundProgress = focusCount % 4 === 0 && focusCount > 0 ? 4 : focusCount % 4;

  const todayCount = sessions.filter((session) => isToday(parseISO(session.completedAt))).length;
  const weekInterval = {
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 })
  };
  const weekCount = sessions.filter((session) =>
    isWithinInterval(parseISO(session.completedAt), weekInterval)
  ).length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.minutes, 0);

  useEffect(() => {
    if (!running) setRemaining(settings[mode] * 60);
  }, [mode, settings.focus, settings.short, settings.long]);

  const prepareAudio = useCallback(() => {
    if (!settings.sound) return;
    if (!audioRef.current) audioRef.current = getAudioContext();
    if (audioRef.current?.state === "suspended") void audioRef.current.resume();
  }, [settings.sound]);

  const playChime = useCallback(() => {
    if (!settings.sound) return;
    const context = audioRef.current ?? getAudioContext();
    if (!context) return;
    audioRef.current = context;
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.14, now + index * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.14 + 0.48);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * 0.14);
      oscillator.stop(now + index * 0.14 + 0.52);
    });
  }, [settings.sound]);

  const notify = useCallback(
    (title: string, body: string) => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      try {
        new Notification(title, { body, icon: "./favicon.svg" });
      } catch {
        // Some browsers block notifications outside a user gesture; the in-app notice still works.
      }
    },
    []
  );

  const completeSession = useCallback(() => {
    playChime();
    if (mode === "focus") {
      addSession(settings.focus);
      const nextMode: PomodoroMode = (focusCount + 1) % 4 === 0 ? "long" : "short";
      notify("番茄钟", "时间到了，该休息了！");
      setMode(nextMode);
      setRemaining(settings[nextMode] * 60);
      setNotice(`完成一个番茄，进入${modeMeta[nextMode].label}。`);
    } else {
      notify("番茄钟", "休息结束，继续专注吧！");
      setMode("focus");
      setRemaining(settings.focus * 60);
      setNotice("休息结束，开始下一轮专注。");
    }
    completingRef.current = false;
  }, [addSession, focusCount, mode, notify, playChime, settings]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (!endAtRef.current) return;
      const next = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(next);
      if (next <= 0) {
        window.clearInterval(timer);
        setRunning(false);
        if (!completingRef.current) {
          completingRef.current = true;
          completeSession();
        }
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [running, completeSession]);

  useEffect(() => {
    document.title = running ? `${formatTime(remaining)} · ${modeMeta[mode].label} | Vibe Tools` : "番茄钟 · Vibe Tools";
    return () => {
      document.title = "Vibe Tools · 个人工具开发";
    };
  }, [running, remaining, mode]);

  const start = () => {
    if (remaining <= 0) {
      setRemaining(duration);
      endAtRef.current = Date.now() + duration * 1000;
    } else {
      endAtRef.current = Date.now() + remaining * 1000;
    }
    completingRef.current = false;
    setNotice("");
    prepareAudio();
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission().then(setPermission);
    }
    setRunning(true);
  };

  const pause = () => {
    setRunning(false);
    endAtRef.current = null;
  };

  const reset = () => {
    setRunning(false);
    endAtRef.current = null;
    completingRef.current = false;
    setRemaining(settings[mode] * 60);
    setNotice("");
  };

  const switchMode = (nextMode: PomodoroMode) => {
    setRunning(false);
    endAtRef.current = null;
    completingRef.current = false;
    setMode(nextMode);
    setRemaining(settings[nextMode] * 60);
    setNotice("");
  };

  const requestNotifications = () => {
    if (!("Notification" in window)) return;
    void Notification.requestPermission().then(setPermission);
  };

  return (
    <div>
      <PageHeader
        index="04"
        kicker="PROJECT / FOCUS TIMER"
        title="专注，一次只做一件事。"
        description="默认 25 分钟专注、5 分钟短休息，每 4 个番茄进入长休息。支持自定义时长、浏览器通知、提示音和专注统计。"
        icon={<Timer className="h-7 w-7" />}
        accent="text-amber-300"
      />

      <div className="shell">
        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="card relative overflow-hidden p-5 sm:p-8">
            <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-amber-300/10 blur-[90px]" />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
                  {(Object.keys(modeMeta) as PomodoroMode[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => switchMode(item)}
                      className={`rounded-full px-3 py-1.5 text-[10px] transition ${
                        mode === item ? "bg-white text-[#0b120d]" : "text-white/35 hover:text-white/70"
                      }`}
                    >
                      {modeMeta[item].label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        index < roundProgress ? "bg-amber-300" : "bg-white/15"
                      }`}
                    />
                  ))}
                  <span className="ml-1 font-mono text-[8px] text-white/25">4 个番茄 = 长休息</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <div className="relative grid h-[268px] w-[268px] place-items-center sm:h-[300px] sm:w-[300px]">
                  <div className="absolute inset-5 rounded-full border border-white/[0.04]" />
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 260 260" aria-hidden="true">
                    <circle cx="130" cy="130" r="112" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                    <circle
                      cx="130"
                      cy="130"
                      r="112"
                      fill="none"
                      stroke={modeMeta[mode].ring}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={offset}
                      className="transition-[stroke-dashoffset] duration-300 ease-linear"
                    />
                  </svg>
                  <div className="relative text-center">
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">
                      {modeMeta[mode].sub}
                    </span>
                    <div className="mt-2 font-display text-[64px] font-medium leading-none tracking-[-0.06em] text-white sm:text-[76px]">
                      {formatTime(remaining)}
                    </div>
                    <p className={`mt-3 text-[11px] ${modeMeta[mode].color}`}>{modeMeta[mode].description}</p>
                    <p className="mt-2 font-mono text-[8px] text-white/20">
                      {running ? "IN PROGRESS" : remaining === duration ? "READY" : "PAUSED"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex items-center gap-2">
                  <button type="button" onClick={reset} className="btn-secondary h-12 w-12 !p-0" aria-label="重置计时器">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={running ? pause : start} className="btn-primary h-14 min-w-[148px] !px-7 text-sm">
                    {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    {running ? "暂停" : remaining === duration ? "开始专注" : "继续"}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode(mode === "focus" ? "short" : "focus")}
                    className="btn-secondary h-12 w-12 !p-0"
                    aria-label="跳过当前阶段"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 min-h-[20px] text-center" aria-live="polite">
                  {notice ? (
                    <p className="flex items-center justify-center gap-1.5 text-[10px] text-lime/70">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {notice}
                    </p>
                  ) : (
                    <p className="text-[9px] text-white/20">开始后页面标题也会显示剩余时间</p>
                  )}
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-5">
                <div>
                  <div className="font-mono text-[8px] text-white/25">今天</div>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="font-display text-2xl text-white">{todayCount}</span>
                    <span className="pb-1 text-[9px] text-white/30">个番茄</span>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-white/25">本周</div>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="font-display text-2xl text-white">{weekCount}</span>
                    <span className="pb-1 text-[9px] text-white/30">个番茄</span>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-white/25">累计专注</div>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="font-display text-2xl text-white">{totalMinutes}</span>
                    <span className="pb-1 text-[9px] text-white/30">分钟</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="label">TODAY'S FOCUS</span>
                  <h2 className="mt-2 text-lg font-medium text-white">今天的专注节奏</h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                  <Flame className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="relative grid h-16 w-16 place-items-center rounded-full border border-white/10">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <circle
                      cx="32"
                      cy="32"
                      r="27"
                      fill="none"
                      stroke="#fcd34d"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 27}
                      strokeDashoffset={(2 * Math.PI * 27 * (1 - Math.min(todayCount / 4, 1))).toFixed(1)}
                    />
                  </svg>
                  <span className="text-sm font-medium text-white">{todayCount}/4</span>
                </div>
                <div>
                  <p className="text-xs text-white/65">{todayCount === 0 ? "从第一个番茄开始。" : "保持这个节奏，很棒。"}</p>
                  <p className="mt-1 text-[10px] leading-5 text-white/30">每完成 4 个番茄，自动进入长休息。</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Target className="h-3 w-3" />
                    <span className="font-mono text-[8px]">总计</span>
                  </div>
                  <div className="mt-1 text-sm text-white/75">{focusCount} 个番茄</div>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                  <div className="flex items-center gap-1.5 text-white/30">
                    <CalendarDays className="h-3 w-3" />
                    <span className="font-mono text-[8px]">本周</span>
                  </div>
                  <div className="mt-1 text-sm text-white/75">{weekCount} 个番茄</div>
                </div>
              </div>

              {sessions.length > 0 && (
                <button
                  type="button"
                  onClick={clearSessions}
                  className="mt-4 text-[9px] text-white/20 transition hover:text-rose-300"
                >
                  清空统计数据
                </button>
              )}
            </div>

            <div className="card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="label">SETTINGS</span>
                  <h2 className="mt-2 text-lg font-medium text-white">计时设置</h2>
                </div>
                <Settings2 className="h-4 w-4 text-white/25" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <DurationInput
                  label="专注"
                  value={settings.focus}
                  disabled={running}
                  onChange={(value) => updateSettings({ focus: value })}
                />
                <DurationInput
                  label="短休息"
                  value={settings.short}
                  disabled={running}
                  onChange={(value) => updateSettings({ short: value })}
                />
                <DurationInput
                  label="长休息"
                  value={settings.long}
                  disabled={running}
                  onChange={(value) => updateSettings({ long: value })}
                />
              </div>

              <button
                type="button"
                onClick={() => updateSettings({ sound: !settings.sound })}
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-black/20 px-3 py-3 text-left transition hover:border-white/15"
              >
                <span className="flex items-center gap-2 text-[11px] text-white/55">
                  {settings.sound ? <Volume2 className="h-4 w-4 text-lime/70" /> : <VolumeX className="h-4 w-4 text-white/25" />}
                  结束提示音
                </span>
                <span className={`h-5 w-9 rounded-full p-0.5 transition ${settings.sound ? "bg-lime" : "bg-white/15"}`}>
                  <span className={`block h-4 w-4 rounded-full bg-[#0b120d] transition ${settings.sound ? "translate-x-4" : ""}`} />
                </span>
              </button>

              <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 p-3.5">
                <div className="flex items-start gap-2.5">
                  {permission === "granted" ? (
                    <Bell className="mt-0.5 h-4 w-4 flex-none text-lime/70" />
                  ) : (
                    <BellOff className="mt-0.5 h-4 w-4 flex-none text-white/25" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-white/55">
                      {permission === "unsupported"
                        ? "当前浏览器不支持系统通知，仍可使用页面内提醒。"
                        : permission === "granted"
                          ? "系统通知已开启，倒计时结束会提醒你。"
                          : permission === "denied"
                            ? "通知权限被拒绝，可以在浏览器设置中重新开启。"
                            : "开启系统通知，切换标签页后也能收到提醒。"}
                    </p>
                    {permission === "default" && (
                      <button type="button" onClick={requestNotifications} className="mt-2 text-[9px] text-lime/70 underline underline-offset-2">
                        开启通知
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-[8px] text-white/20">
                <Coffee className="h-3 w-3" /> 数据保存在本地浏览器，统计不会上传服务器。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Hint icon={<Timer className="h-4 w-4" />} title="不漂移" text="使用结束时间戳计算剩余时间，切换标签页也不会走慢。" />
          <Hint icon={<Bell className="h-4 w-4" />} title="会提醒" text="支持 Notification API 和 Web Audio 提示音。" />
          <Hint icon={<Flame className="h-4 w-4" />} title="有记录" text="今日、本周和累计专注分钟数自动保存在本地。" />
        </div>
      </div>
    </div>
  );
}

function DurationInput({
  label,
  value,
  disabled,
  onChange
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-xl border border-white/[0.08] bg-black/20 p-2.5">
      <span className="block font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">{label}</span>
      <div className="mt-1 flex items-baseline gap-1">
        <input
          type="number"
          min={1}
          max={90}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(Math.max(1, Math.min(90, Number(event.target.value) || 1)))}
          className="w-full bg-transparent font-display text-lg text-white/85 outline-none disabled:opacity-40"
          aria-label={`${label}时长（分钟）`}
        />
        <span className="text-[8px] text-white/25">min</span>
      </div>
    </label>
  );
}

function Hint({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-amber-300/70">
        {icon}
      </span>
      <div>
        <div className="text-[11px] text-white/65">{title}</div>
        <p className="mt-1 text-[9px] leading-5 text-white/25">{text}</p>
      </div>
    </div>
  );
}
