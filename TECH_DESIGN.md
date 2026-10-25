# Vibe Tools 技术设计

## 1. 技术栈

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- React Router 6（HashRouter）
- Zustand 5
- date-fns 4
- react-markdown 9 + remark-gfm
- react-syntax-highlighter 15（PrismLight，按语言注册）
- lucide-react
- LocalStorage
- Open-Meteo API（天气，无需 Key）
- Notification API / Web Audio API

## 2. 架构

```text
src/
  assets/
    avatar.svg
    fonts/
    projects/          # 5 张 WebP 项目截图
  components/
    Footer.tsx
    Layout.tsx
    Navbar.tsx
    PageHeader.tsx
    ProjectPreview.tsx
  data/
    portfolio.ts       # 项目、技能、五步流程、个人信息
  lib/
    weather.ts         # 地理编码、天气 API、天气代码映射
  pages/
    HomePage.tsx       # 个人作品集
    TodoPage.tsx       # 待办进阶版
    NotesPage.tsx      # Markdown 笔记
    PomodoroPage.tsx   # 番茄钟
    WeatherPage.tsx    # 天气查询
  store/
    todoStore.ts
    notesStore.ts
    pomodoroStore.ts
  App.tsx
  main.tsx
  index.css
```

工具页面通过 `React.lazy` 按路由加载。Markdown 高亮只使用 `PrismLight` 并注册有限语言，避免把全部 Prism 语言打进首屏。

## 3. 路由与部署

使用 `HashRouter`：

```text
/#/
/#/todo
/#/notes
/#/pomodoro
/#/weather
```

HashRouter 让站点可以放在 GitHub Pages 子路径、BrewPage 或任意静态服务器，无需服务端 fallback。`vite.config.ts` 使用 `base: "./"`，构建资源使用相对路径。

## 4. 数据模型

### Todo

```ts
type Priority = "low" | "medium" | "high";
type TodoCategory = "学习" | "生活" | "项目" | "其他";

type Todo = {
  id: string;
  title: string;
  description: string;
  category: TodoCategory;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
};
```

### Note

```ts
type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
```

### Pomodoro

```ts
type PomodoroMode = "focus" | "short" | "long";

type PomodoroSettings = {
  focus: number;
  short: number;
  long: number;
  sound: boolean;
};

type FocusSession = {
  id: string;
  completedAt: string;
  minutes: number;
};
```

### Weather

```ts
type WeatherBundle = {
  location: GeoLocation;
  current: CurrentWeather;
  daily: DailyWeather[];
  timezone: string;
  updatedAt: string;
};
```

## 5. 状态与持久化

| Store | 方式 | LocalStorage key |
| --- | --- | --- |
| Todo | Zustand + persist | `vibe-tools-todos-v1` |
| Notes | Zustand + persist | `vibe-tools-notes-v1` |
| Pomodoro | Zustand + persist | `vibe-tools-pomodoro-v1` |
| Weather 收藏 | `useState` + effect | `vibe-tools-weather-favorites-v1` |
| Weather 最近城市 | 写入 effect | `vibe-tools-weather-last-v1` |

Zustand 的 persist middleware 负责自动序列化，页面刷新后恢复。初始示例数据只在没有本地存储时生效。

## 6. 关键实现

### 待办筛选

`useMemo` 中按状态、分类、优先级、关键词依次过滤，再按未完成优先、优先级、截止日期排序。

### Markdown 实时预览

编辑器内容直接进入 Zustand，`ReactMarkdown` 订阅同一份状态，因此每次输入都会重新渲染预览。自定义 `code` renderer 在有语言标记时使用 `SyntaxHighlighter`，否则输出行内 `code`。

### 番茄钟准确性

开始计时时保存 `endAt = Date.now() + remaining * 1000`，每 250ms 用 `endAt - Date.now()` 计算剩余时间。浏览器切换到后台或定时器延迟时不会累计漂移。

### 天气 API

- 地理编码：`https://geocoding-api.open-meteo.com/v1/search`
- 预报：`https://api.open-meteo.com/v1/forecast`
- 当前字段：`temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m`
- 日预报：`weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`
- `timezone=auto`，`forecast_days=7`
- WMO weather code 映射为中文标签和 Lucide 图标
- 无 API Key，避免把密钥写进前端

## 7. 样式系统

- 背景：`#070a09`
- 卡片：`rgba(255,255,255,0.035)` + `border-white/10` + `backdrop-blur`
- 强调色：`#c9f36c` → `#7ef0c1` → `#7ce7f4` 渐变
- 统一圆角：`rounded-2xl` / `rounded-3xl`
- 字体：Space Grotesk（本地 woff2）+ 系统中文字体
- 响应式断点：`sm` / `md` / `lg` / `xl`

## 8. 性能

- 页面级 `React.lazy`
- 项目截图使用 WebP（1200 × 750）
- 图片 `loading="lazy"`
- PrismLight 只注册 java/javascript/typescript/tsx/jsx/python/bash/json/markup/css/sql
- 字体本地托管，无外部 CDN
- 生产构建开启 Vite 默认压缩

## 9. 安全与隐私

- 天气使用无需密钥的公开 API
- 不收集用户数据
- 待办、笔记、番茄记录和天气收藏只写 LocalStorage
- 用户输入通过 React 文本节点渲染，不使用 `dangerouslySetInnerHTML`
- 无后端，无跨域凭据

## 10. 构建与部署

```bash
pnpm install
pnpm build
pnpm preview
```

输出目录为 `dist/`，可部署到 Vercel、Netlify、Cloudflare Pages、GitHub Pages 或任意静态服务器。
