import homeShot from "../assets/projects/home.webp";
import notesShot from "../assets/projects/notes.webp";
import pomodoroShot from "../assets/projects/pomodoro.webp";
import todoShot from "../assets/projects/todo.webp";
import weatherShot from "../assets/projects/weather.webp";

export type PreviewKind = "portfolio" | "todo" | "notes" | "pomodoro" | "weather";

export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  tech: string[];
  accent: "lime" | "mint" | "cyan" | "amber" | "rose";
  preview: PreviewKind;
  status: string;
  image?: string;
};

export const projects: Project[] = [
  {
    id: "portfolio",
    index: "01",
    title: "个人作品集网站",
    subtitle: "PERSONAL PORTFOLIO",
    description: "深色主题、响应式布局、流畅滚动的个人作品集首页，把 5 个实战项目集中展示。",
    route: "/",
    tech: ["React", "TypeScript", "Tailwind"],
    accent: "lime",
    preview: "portfolio",
    status: "已上线",
    image: homeShot
  },
  {
    id: "todo",
    index: "02",
    title: "待办事项 · 进阶版",
    subtitle: "TASK FLOW",
    description: "支持描述、截止日期、优先级和分类的待办管理，带多条件筛选、搜索、编辑与完成率统计。",
    route: "/todo",
    tech: ["Zustand", "date-fns", "LocalStorage"],
    accent: "mint",
    preview: "todo",
    status: "可交互",
    image: todoShot
  },
  {
    id: "notes",
    index: "03",
    title: "Markdown 笔记",
    subtitle: "MARKDOWN STUDIO",
    description: "笔记列表、实时双栏预览、GFM 语法与代码高亮，支持搜索、自动保存和快捷编辑。",
    route: "/notes",
    tech: ["react-markdown", "Prism", "LocalStorage"],
    accent: "cyan",
    preview: "notes",
    status: "可交互",
    image: notesShot
  },
  {
    id: "pomodoro",
    index: "04",
    title: "番茄钟计时器",
    subtitle: "FOCUS TIMER",
    description: "25 / 5 分钟专注循环，自定义时长、通知、提示音和今日 / 本周专注统计。",
    route: "/pomodoro",
    tech: ["Notification API", "Web Audio", "LocalStorage"],
    accent: "amber",
    preview: "pomodoro",
    status: "可交互",
    image: pomodoroShot
  },
  {
    id: "weather",
    index: "05",
    title: "天气查询应用",
    subtitle: "WEATHER NOW",
    description: "城市搜索、浏览器定位、当前天气与 7 日预报，支持收藏常用城市和错误提示。",
    route: "/weather",
    tech: ["Open-Meteo API", "Geolocation", "LocalStorage"],
    accent: "rose",
    preview: "weather",
    status: "可交互",
    image: weatherShot
  }
];

export const skills = [
  { name: "React", note: "组件与 Hooks" },
  { name: "TypeScript", note: "类型安全" },
  { name: "Tailwind CSS", note: "响应式设计" },
  { name: "Zustand", note: "全局状态" },
  { name: "REST API", note: "异步与错误处理" },
  { name: "LocalStorage", note: "本地数据持久化" }
];

export const workflow = [
  {
    index: "01",
    title: "需求研究",
    description: "先看同类产品，记录设计风格、核心功能和真实使用场景。"
  },
  {
    index: "02",
    title: "写 PRD",
    description: "把核心功能、设计要求和边界写清楚，避免开发过程中反复漂移。"
  },
  {
    index: "03",
    title: "技术设计",
    description: "确定技术栈、数据结构、项目结构和关键交互，再开始写代码。"
  },
  {
    index: "04",
    title: "AGENTS / 开发规范",
    description: "把风格、组件复用、可访问性和性能要求写成可执行的规则。"
  },
  {
    index: "05",
    title: "开发与部署",
    description: "按模块逐步实现、实时预览、修复问题，最终构建并部署上线。"
  }
];

export const profile = {
  name: "王乐",
  role: "数字经济专业 · 大二在读",
  school: "武汉理工大学",
  email: "3402990356@qq.com",
  github: "https://github.com/2006chunqiu/-",
  bio: "武汉理工大学数字经济专业大二学生。正在学习 SQL 数据库、人工智能技术及应用和数智编程，习惯用 Vibe Coding 把想法快速做成能用的工具。",
  focus: ["React", "TypeScript", "数据思维"]
};
