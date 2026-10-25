import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type NotesState = {
  notes: Note[];
  activeId: string | null;
  createNote: () => string;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "content">>) => void;
  deleteNote: (id: string) => void;
  setActive: (id: string) => void;
};

const now = new Date().toISOString();
const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const welcome = `# 欢迎使用 Markdown Studio

这是一个支持 **实时预览** 和 **代码高亮** 的轻量笔记应用。

## 它能做什么

- 左侧管理笔记，右侧编辑与实时预览
- 支持 GitHub Flavored Markdown
- 代码块自动语法高亮
- 自动保存到浏览器 LocalStorage

> 试试点击右上角的“新建笔记”，写下你的第一条内容。

## 代码示例

\`\`\`ts
type Note = {
  id: string;
  title: string;
  content: string;
};

const note: Note = {
  id: "1",
  title: "Hello Vibe",
  content: "# 从想法到产品"
};
\`\`\`

## 快捷操作

| 快捷键 | 功能 |
| --- | --- |
| Tab | 插入两个空格 |
| Ctrl / Cmd + B | 加粗选中文字 |
| Ctrl / Cmd + Enter | 快速新建笔记 |

祝你写得开心。
`;

const reactChecklist = `# React 学习清单

- [x] 组件与 Props
- [x] useState / useEffect
- [x] 受控表单
- [ ] 自定义 Hooks
- [ ] 性能优化
- [ ] 单元测试

## 下一步

1. 把 5 个工具拆成可复用组件
2. 给番茄钟加上长休息
3. 把天气收藏同步到云端
`;

const apiNote = `# API 设计小记

天气查询使用的是 [Open-Meteo](https://open-meteo.com/) 的公开接口，不需要 API Key。

\`\`\`js
const url = new URL("https://api.open-meteo.com/v1/forecast");
url.searchParams.set("latitude", "30.59");
url.searchParams.set("longitude", "114.30");
url.searchParams.set("current", "temperature_2m,weather_code");
\`\`\`

要点：

- 先做输入校验
- 处理 loading / error / empty 状态
- 对请求结果做类型定义
- 把网络逻辑封装到独立模块
`;

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: "note-welcome",
          title: "欢迎使用 Markdown Studio",
          content: welcome,
          createdAt: now,
          updatedAt: now
        },
        {
          id: "note-react",
          title: "React 学习清单",
          content: reactChecklist,
          createdAt: now,
          updatedAt: now
        },
        {
          id: "note-api",
          title: "API 设计小记",
          content: apiNote,
          createdAt: now,
          updatedAt: now
        }
      ],
      activeId: "note-welcome",
      createNote: () => {
        const id = makeId();
        const timestamp = new Date().toISOString();
        set((state) => ({
          notes: [
            {
              id,
              title: "未命名笔记",
              content: "# 未命名笔记\n\n开始写点什么吧…",
              createdAt: timestamp,
              updatedAt: timestamp
            },
            ...state.notes
          ],
          activeId: id
        }));
        return id;
      },
      updateNote: (id, patch) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note
          )
        })),
      deleteNote: (id) => {
        const nextNotes = get().notes.filter((note) => note.id !== id);
        set({
          notes: nextNotes,
          activeId: get().activeId === id ? nextNotes[0]?.id ?? null : get().activeId
        });
      },
      setActive: (id) => set({ activeId: id })
    }),
    { name: "vibe-tools-notes-v1" }
  )
);
