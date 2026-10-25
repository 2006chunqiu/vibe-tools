import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Filter,
  ListTodo,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  X
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import PageHeader from "../components/PageHeader";
import {
  useTodoStore,
  type Priority,
  type Todo,
  type TodoCategory,
  type TodoInput
} from "../store/todoStore";

const categories: TodoCategory[] = ["学习", "生活", "项目", "其他"];
const priorities: Priority[] = ["high", "medium", "low"];

const priorityMeta: Record<Priority, { label: string; className: string; dot: string; weight: number }> = {
  high: { label: "高优先级", className: "border-rose-400/25 bg-rose-400/[0.08] text-rose-300", dot: "bg-rose-400", weight: 3 },
  medium: { label: "中优先级", className: "border-amber-300/25 bg-amber-300/[0.08] text-amber-300", dot: "bg-amber-300", weight: 2 },
  low: { label: "低优先级", className: "border-cyan/25 bg-cyan/[0.08] text-cyan", dot: "bg-cyan", weight: 1 }
};

const categoryMeta: Record<TodoCategory, string> = {
  学习: "border-lime/25 bg-lime/[0.08] text-lime/80",
  生活: "border-mint/25 bg-mint/[0.08] text-mint",
  项目: "border-cyan/25 bg-cyan/[0.08] text-cyan",
  其他: "border-white/15 bg-white/[0.05] text-white/55"
};

const emptyForm: TodoInput = {
  title: "",
  description: "",
  category: "学习",
  priority: "medium",
  dueDate: format(new Date(), "yyyy-MM-dd")
};

export default function TodoPage() {
  const { todos, addTodo, updateTodo, toggleTodo, deleteTodo, clearCompleted } = useTodoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "completed">("all");
  const [category, setCategory] = useState<"all" | TodoCategory>("all");
  const [priority, setPriority] = useState<"all" | Priority>("all");
  const [editing, setEditing] = useState<Todo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const completed = todos.filter((todo) => todo.completed).length;
  const pending = todos.length - completed;
  const completionRate = todos.length ? Math.round((completed / todos.length) * 100) : 0;
  const dueToday = todos.filter(
    (todo) => !todo.completed && isToday(new Date(`${todo.dueDate}T23:59:59`))
  ).length;
  const overdue = todos.filter(
    (todo) =>
      !todo.completed &&
      isPast(new Date(`${todo.dueDate}T23:59:59`)) &&
      !isToday(new Date(`${todo.dueDate}T23:59:59`))
  ).length;

  const filteredTodos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return todos
      .filter((todo) => {
        if (status === "active" && todo.completed) return false;
        if (status === "completed" && !todo.completed) return false;
        if (category !== "all" && todo.category !== category) return false;
        if (priority !== "all" && todo.priority !== priority) return false;
        if (
          normalizedQuery &&
          !todo.title.toLowerCase().includes(normalizedQuery) &&
          !todo.description.toLowerCase().includes(normalizedQuery)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
        if (a.priority !== b.priority) return priorityMeta[b.priority].weight - priorityMeta[a.priority].weight;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [todos, query, status, category, priority]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (todo: Todo) => {
    setEditing(todo);
    setModalOpen(true);
  };

  const submitTodo = (input: TodoInput) => {
    if (editing) updateTodo(editing.id, input);
    else addTodo(input);
    setModalOpen(false);
    setEditing(null);
  };

  const hasFilters = query.trim() !== "" || status !== "all" || category !== "all" || priority !== "all";

  return (
    <div>
      <PageHeader
        index="02"
        kicker="PROJECT / ADVANCED TODO"
        title="待办事项，进阶版。"
        description="标题、描述、截止日期、优先级、分类，配合多条件筛选、模糊搜索和完成率统计。数据保存在本地浏览器，刷新不丢失。"
        icon={<ListTodo className="h-7 w-7" />}
        actions={
          <>
            <button type="button" onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" /> 新建待办
            </button>
            {completed > 0 && (
              <button type="button" onClick={clearCompleted} className="btn-secondary">
                <Trash2 className="h-4 w-4" /> 清除已完成
              </button>
            )}
          </>
        }
      />

      <div className="shell">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<Target className="h-4 w-4" />} label="全部任务" value={String(todos.length)} hint={`${pending} 个进行中`} />
          <Metric
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="完成率"
            value={`${completionRate}%`}
            hint={`${completed} 个已完成`}
            accent="text-mint"
          />
          <Metric
            icon={<CalendarDays className="h-4 w-4" />}
            label="今天到期"
            value={String(dueToday)}
            hint={overdue ? `${overdue} 个已逾期` : "没有逾期任务"}
            accent={overdue ? "text-rose-300" : "text-cyan"}
          />
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="label">PROGRESS</span>
              <Sparkles className="h-4 w-4 text-lime/60" />
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-3xl font-medium text-white">{pending}</span>
              <span className="pb-1 text-[10px] text-white/35">待完成</span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime to-mint transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card mt-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field pl-10"
                placeholder="搜索标题或描述…"
                aria-label="搜索待办"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
                {(
                  [
                    ["all", "全部"],
                    ["active", "进行中"],
                    ["completed", "已完成"]
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    className={`rounded-full px-3 py-1.5 text-[10px] transition ${
                      status === value ? "bg-white text-[#0b120d]" : "text-white/40 hover:text-white/75"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] text-white/40">
                <Filter className="h-3 w-3" />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as "all" | TodoCategory)}
                  className="bg-transparent text-white/65 outline-none"
                  aria-label="按分类筛选"
                >
                  <option value="all" className="bg-[#111815]">
                    全部分类
                  </option>
                  {categories.map((item) => (
                    <option key={item} value={item} className="bg-[#111815]">
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] text-white/40">
                <span className={`h-1.5 w-1.5 rounded-full ${priority === "all" ? "bg-white/25" : priorityMeta[priority].dot}`} />
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as "all" | Priority)}
                  className="bg-transparent text-white/65 outline-none"
                  aria-label="按优先级筛选"
                >
                  <option value="all" className="bg-[#111815]">
                    全部优先级
                  </option>
                  {priorities.map((item) => (
                    <option key={item} value={item} className="bg-[#111815]">
                      {priorityMeta[item].label}
                    </option>
                  ))}
                </select>
              </label>

              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                    setCategory("all");
                    setPriority("all");
                  }}
                  className="flex items-center gap-1 rounded-full px-2.5 py-2 text-[10px] text-white/35 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-3 w-3" /> 重置
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card mt-4 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              <span className="text-xs text-white/70">任务列表</span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-white/35">
                {filteredTodos.length}
              </span>
            </div>
            <span className="font-mono text-[8px] text-white/25">LOCAL STORAGE · AUTO SAVE</span>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/25">
                <ListTodo className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-sm text-white/70">{hasFilters ? "没有符合条件的任务" : "还没有待办事项"}</h3>
              <p className="mt-2 max-w-xs text-[11px] leading-6 text-white/30">
                {hasFilters ? "试试调整筛选条件，或者重置搜索。" : "把第一件要做的事写下来，从一个小任务开始。"}
              </p>
              {!hasFilters && (
                <button type="button" onClick={openCreate} className="btn-secondary mt-5">
                  <Plus className="h-4 w-4" /> 新建第一项
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {filteredTodos.map((todo) => (
                <TodoRow
                  key={todo.id}
                  todo={todo}
                  onToggle={() => toggleTodo(todo.id)}
                  onEdit={() => openEdit(todo)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              ))}
            </ul>
          )}
        </div>

        <p className="mt-4 flex items-center gap-2 text-[10px] text-white/25">
          <Check className="h-3 w-3 text-lime/50" />
          支持多条件组合筛选；所有数据仅保存在当前浏览器，不会上传服务器。
        </p>
      </div>

      {modalOpen && (
        <TodoModal
          initial={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={submitTodo}
        />
      )}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
  accent = "text-lime"
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <span className={accent}>{icon}</span>
      </div>
      <div className="mt-4 font-display text-3xl font-medium tracking-tight text-white">{value}</div>
      <p className="mt-1 text-[10px] text-white/30">{hint}</p>
    </div>
  );
}

function TodoRow({
  todo,
  onToggle,
  onEdit,
  onDelete
}: {
  todo: Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const due = new Date(`${todo.dueDate}T23:59:59`);
  const overdue = !todo.completed && isPast(due) && !isToday(due);
  const dueLabel = isToday(due) ? "今天" : format(due, "M月d日");
  const priority = priorityMeta[todo.priority];

  return (
    <li className={`group px-5 py-4 transition hover:bg-white/[0.025] ${todo.completed ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={onToggle}
          className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border transition ${
            todo.completed
              ? "border-lime bg-lime text-[#0b120d]"
              : "border-white/20 bg-black/20 text-transparent hover:border-lime/60 hover:bg-lime/10"
          }`}
          aria-label={todo.completed ? "标记为未完成" : "标记为已完成"}
          aria-pressed={todo.completed}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className={`text-sm font-medium ${todo.completed ? "text-white/35 line-through" : "text-white/85"}`}>
              {todo.title}
            </h3>
            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={onEdit}
                className="grid h-7 w-7 place-items-center rounded-lg text-white/30 transition hover:bg-white/[0.06] hover:text-lime"
                aria-label="编辑待办"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="grid h-7 w-7 place-items-center rounded-lg text-white/30 transition hover:bg-rose-400/10 hover:text-rose-300"
                aria-label="删除待办"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {todo.description && <p className="mt-1 text-[11px] leading-6 text-white/35">{todo.description}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[9px] ${categoryMeta[todo.category]}`}>{todo.category}</span>
            <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] ${priority.className}`}>
              <span className={`h-1 w-1 rounded-full ${priority.dot}`} /> {priority.label}
            </span>
            <span
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] ${
                overdue ? "border-rose-400/25 bg-rose-400/[0.08] text-rose-300" : "border-white/10 bg-white/[0.03] text-white/35"
              }`}
            >
              {overdue ? <AlertTriangle className="h-2.5 w-2.5" /> : <CalendarDays className="h-2.5 w-2.5" />}
              {overdue ? "已逾期 · " : ""}
              {dueLabel}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

function TodoModal({
  initial,
  onClose,
  onSave
}: {
  initial: Todo | null;
  onClose: () => void;
  onSave: (input: TodoInput) => void;
}) {
  const [form, setForm] = useState<TodoInput>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          category: initial.category,
          priority: initial.priority,
          dueDate: initial.dueDate
        }
      : emptyForm
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("请填写任务标题。");
      return;
    }
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#0c1210] shadow-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
          <div>
            <span className="label">{initial ? "EDIT TASK" : "NEW TASK"}</span>
            <h2 id="todo-modal-title" className="mt-1 text-lg font-medium text-white">
              {initial ? "编辑待办" : "新建待办"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-white/35 hover:bg-white/[0.06] hover:text-white" aria-label="关闭">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <div>
            <label htmlFor="todo-title" className="field-label">
              标题 <span className="text-rose-300/60">*</span>
            </label>
            <input
              id="todo-title"
              autoFocus
              value={form.title}
              onChange={(event) => {
                setForm({ ...form, title: event.target.value });
                setError("");
              }}
              className="field"
              placeholder="例如：完成课程项目验收"
              maxLength={80}
            />
            {error && <p className="mt-2 text-[10px] text-rose-300">{error}</p>}
          </div>

          <div>
            <label htmlFor="todo-description" className="field-label">
              描述 <span className="normal-case tracking-normal text-white/20">可选</span>
            </label>
            <textarea
              id="todo-description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="field min-h-[88px] resize-none"
              placeholder="补充任务背景、验收标准或备注…"
              maxLength={240}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="todo-category" className="field-label">
                分类
              </label>
              <select
                id="todo-category"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value as TodoCategory })}
                className="field"
              >
                {categories.map((item) => (
                  <option key={item} value={item} className="bg-[#111815]">
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="todo-due" className="field-label">
                截止日期
              </label>
              <input
                id="todo-due"
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                className="field"
              />
            </div>
          </div>

          <div>
            <span className="field-label">优先级</span>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((item) => {
                const meta = priorityMeta[item];
                const active = form.priority === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setForm({ ...form, priority: item })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[10px] transition ${
                      active ? meta.className : "border-white/10 bg-black/20 text-white/35 hover:border-white/20"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" className="btn-primary">
              {initial ? "保存修改" : "创建任务"} <Check className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
