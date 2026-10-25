# Vibe Tools · 个人工具开发

《数智编程技术基础及应用》课程「个人工具开发」5 个示例的完整实现。一个 React + TypeScript + Vite + Tailwind CSS 单页应用，包含作品集首页和 4 个可交互工具。

## 在线预览

**GitHub Pages（长期）：** https://2006chunqiu.github.io/vibe-tools/

**GitHub 仓库：** https://github.com/2006chunqiu/vibe-tools

**BrewPage 备用预览：** https://vibe-tools-x48dwxp9-qnu1lssdcq.brewpage.app/（有效期至 2026-11-24，页面带平台小徽标）

GitHub 仓库已配置 GitHub Actions，推送到 `main` 会自动构建并更新 Pages。

## 五个示例的完成情况

| PDF 示例 | 实现 | 路由 | 关键能力 |
| --- | --- | --- | --- |
| 01 个人作品集网站 | ✅ | `/` | 头像、简介、技能、5 个项目截图、联系方式、响应式 |
| 02 待办事项（进阶版） | ✅ | `/todo` | 描述、日期、优先级、分类、筛选、搜索、编辑、统计、持久化 |
| 03 Markdown 笔记应用 | ✅ | `/notes` | 列表、实时预览、GFM、代码高亮、搜索、删除、自动保存 |
| 04 番茄钟计时器 | ✅ | `/pomodoro` | 25/5 计时、自定义时长、通知、提示音、今日/本周统计 |
| 05 天气查询应用 | ✅ | `/weather` | 城市搜索、定位、当前天气、7 日预报、收藏、错误处理 |

同时完成了 PDF 中要求的开发文档：

- [PRD.md](PRD.md)：5 个项目需求与验收标准
- [TECH_DESIGN.md](TECH_DESIGN.md)：技术栈、目录、数据模型、关键实现
- [AGENTS.md](AGENTS.md)：开发规范、设计规范与检查清单

## 快速开始

要求 Node.js 22.13+（pnpm 11 的运行要求；本地也可使用更新的 Node 版本）。

```bash
cd personal-tools
pnpm install
pnpm dev
```

打开终端输出的本地地址（默认 http://localhost:5173）。

生产构建：

```bash
pnpm build
pnpm preview
```

构建产物在 `dist/`。

## 路由

使用 `HashRouter`，静态托管不需要服务端重写：

```text
/#/
/#/todo
/#/notes
/#/pomodoro
/#/weather
```

## 功能细节

### 待办事项

- 数据模型：`id / title / description / category / priority / dueDate / completed / createdAt`
- 支持新增、编辑、删除、完成状态切换
- 状态、分类、优先级三条件组合筛选
- 标题和描述模糊搜索
- 完成率、今日到期、逾期提示
- Zustand `persist` 自动写入 LocalStorage

### Markdown 笔记

- 三栏工作区：笔记列表、编辑器、实时预览
- 新建、切换、删除、标题搜索
- GFM 表格、任务列表、引用和代码块
- PrismLight 语法高亮（JavaScript / TypeScript / Python / Java / SQL 等）
- 自动保存、字符统计、更新时间
- Tab 插入空格，Ctrl/Cmd + B 加粗，Ctrl/Cmd + Enter 新建
- 移动端「编辑 / 预览」切换

### 番茄钟

- 专注 25、短休息 5、长休息 15，均可调整
- 开始、暂停、重置、跳过
- 每 4 个番茄自动进入长休息
- 使用结束时间戳计算，切换标签页不会漂移
- Notification API 通知、Web Audio 提示音
- 今日 / 本周 / 累计专注统计
- 设置和记录持久化

### 天气

- 使用 [Open-Meteo](https://open-meteo.com/) 公开 API，**不需要 API Key**
- 城市地理编码、当前天气、未来 7 天预报
- 浏览器 Geolocation 定位
- 收藏城市、快速查询、删除收藏
- 加载骨架、城市不存在、网络错误、定位拒绝提示
- 收藏和最近城市保存在 LocalStorage

> PDF 允许使用其他天气数据源，因此这里选择无需 Key 的 Open-Meteo，避免把 API Key 写进前端。若改用 OpenWeatherMap，请通过 `.env.local` 提供 Key，并不要把 `.env.local` 提交到 Git。

## 技术栈

- React 18 + TypeScript 5
- Vite 6
- Tailwind CSS 3
- React Router 6（HashRouter）
- Zustand 5 + persist
- date-fns 4
- react-markdown 9 + remark-gfm
- react-syntax-highlighter 15（PrismLight）
- lucide-react
- Open-Meteo API
- Notification API / Web Audio API

## 项目结构

```text
personal-tools/
├─ PRD.md
├─ TECH_DESIGN.md
├─ AGENTS.md
├─ src/
│  ├─ assets/
│  │  ├─ avatar.svg
│  │  ├─ fonts/
│  │  └─ projects/        # 5 张 WebP 项目截图
│  ├─ components/
│  ├─ data/portfolio.ts
│  ├─ lib/weather.ts
│  ├─ pages/
│  ├─ store/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ public/favicon.svg
├─ index.html
├─ tailwind.config.js
├─ vite.config.ts
└─ vercel.json
```

## 性能与可访问性

- 作品集首页为首屏；4 个工具页使用 `React.lazy` 按路由加载
- Markdown 高亮使用 PrismLight 并限制语言包
- 项目截图压缩为 WebP（1200 × 750）
- 表单控件有 label 或 aria-label
- 弹窗支持 Escape 关闭，焦点自动落在标题输入框
- 错误信息使用可读文本和颜色双重提示
- 支持 `prefers-reduced-motion`
- 所有页面在 320 / 390 / 768 / 1024 / 1440px 下无横向溢出

## 部署

### Vercel（PDF 推荐）

1. 把 `personal-tools` 推送到 GitHub。
2. 在 Vercel 导入仓库，Framework Preset 会自动识别 Vite。
3. Build Command：`npm run build`；Output Directory：`dist`。
4. 部署完成后获得 `*.vercel.app` 地址。

`vercel.json` 已包含构建配置。

### 任意静态托管

```bash
pnpm build
```

把 `dist/` 上传到 Netlify、Cloudflare Pages、GitHub Pages、Nginx 或对象存储即可。HashRouter 不依赖服务器路由。

## 数据说明

所有数据都保存在浏览器 LocalStorage：

- 待办：`vibe-tools-todos-v1`
- 笔记：`vibe-tools-notes-v1`
- 番茄钟：`vibe-tools-pomodoro-v1`
- 天气收藏：`vibe-tools-weather-favorites-v1`
- 最近城市：`vibe-tools-weather-last-v1`

清理浏览器数据会同时清空这些内容，不会上传到服务器。
