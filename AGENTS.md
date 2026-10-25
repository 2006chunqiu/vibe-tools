# AGENTS.md · Vibe Tools 开发规范

## 项目概述

使用 React 18 + TypeScript + Vite + Tailwind CSS 构建的 5 合一个人工具应用。包含个人作品集、进阶待办、Markdown 笔记、番茄钟和天气查询。

## 开发规范

- 使用函数式组件 + Hooks
- TypeScript strict，不引入 `any`（除非有明确边界和注释）
- 样式优先使用 Tailwind CSS；复用的视觉规则放进 `src/index.css` 的 `@layer components`
- 组件按职责拆分：`components/` 放共享组件，`pages/` 放路由页面，`store/` 放状态，`lib/` 放纯逻辑和 API
- 每个交互元素都要有可读文本或 `aria-label`
- 表单控件必须有 `<label>` 或 `aria-label`
- 不做没有必要的依赖引入
- 不在代码中写入 API Key、token 或其他私密信息
- 所有用户数据默认保存在浏览器 LocalStorage

## 设计要求

- 深色主题：背景 `#070a09`，卡片半透明并带细边框
- 强调色使用青柠绿 `#c9f36c` → 薄荷 `#7ef0c1` → 青色 `#7ce7f4` 渐变
- 统一圆角：卡片 24–32px，控件 10–14px
- 大标题使用 `font-display`，正文使用 `font-sans`
- 页面要有足够的留白，不要堆叠过多边框和阴影
- 动效轻微：悬浮上移、淡入、进度条过渡
- 移动端优先考虑单栏和可点区域
- 所有页面在 320 / 390 / 768 / 1024 / 1440px 下不能横向溢出

## 路由与状态

- 使用 `HashRouter`，确保静态托管不需要服务端 fallback
- 工具页使用 `React.lazy` 按需加载
- 待办、笔记、番茄钟使用 Zustand + persist
- 天气使用局部 state + LocalStorage 保存收藏和最近城市
- LocalStorage key 统一使用 `vibe-tools-*` 前缀

## 代码质量检查

提交前执行：

```bash
npm run build
npm run preview
```

手动检查：

1. 首页 5 个项目卡片都能打开对应路由
2. 待办：新增、编辑、完成、删除、筛选、搜索、刷新后数据仍在
3. 笔记：新建、切换、删除、实时预览、代码高亮、刷新后数据仍在
4. 番茄钟：开始、暂停、重置、模式切换、统计、通知权限提示
5. 天气：默认城市、搜索、定位、收藏、删除收藏、错误提示
6. 手机宽度下菜单、卡片、表单和弹窗都可用
7. 浏览器控制台没有运行时错误

## 更新原则

- 先改 `src/data/portfolio.ts` 中的项目元数据，再改页面
- 新增工具时沿用现有页面壳、PageHeader 和卡片风格
- 修改数据模型时同步更新 PRD / TECH_DESIGN
- 不要把 `node_modules`、`dist`、`.tmp`、`.cache` 提交到仓库
