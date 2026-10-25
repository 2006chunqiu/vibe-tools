import { addDays, format } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "low" | "medium" | "high";
export type TodoCategory = "学习" | "生活" | "项目" | "其他";

export type Todo = {
  id: string;
  title: string;
  description: string;
  category: TodoCategory;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
};

export type TodoInput = Omit<Todo, "id" | "createdAt" | "completed">;

type TodoState = {
  todos: Todo[];
  addTodo: (input: TodoInput) => void;
  updateTodo: (id: string, patch: TodoInput) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
};

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const today = () => format(new Date(), "yyyy-MM-dd");

export const seedTodos: Todo[] = [
  {
    id: "seed-1",
    title: "完成个人工具开发课程作业",
    description: "把 5 个示例都跑通，检查响应式和 LocalStorage 持久化。",
    category: "学习",
    priority: "high",
    dueDate: today(),
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-2",
    title: "复习 SQL 查询语句",
    description: "重点看多表连接、聚合函数和子查询，完成 10 道练习题。",
    category: "学习",
    priority: "medium",
    dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-3",
    title: "整理 Markdown 笔记模板",
    description: "把课堂笔记整理成可复用的模板，加入代码块和任务列表。",
    category: "项目",
    priority: "low",
    dueDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-4",
    title: "晚上跑步 30 分钟",
    description: "轻量运动，保持精力。",
    category: "生活",
    priority: "medium",
    dueDate: today(),
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-5",
    title: "给作品集补充项目截图",
    description: "把 5 个工具的界面截图放进项目卡片。",
    category: "项目",
    priority: "high",
    dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: seedTodos,
      addTodo: (input) =>
        set((state) => ({
          todos: [
            {
              ...input,
              id: makeId(),
              completed: false,
              createdAt: new Date().toISOString()
            },
            ...state.todos
          ]
        })),
      updateTodo: (id, patch) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, ...patch } : todo))
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        })),
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed)
        }))
    }),
    { name: "vibe-tools-todos-v1" }
  )
);
