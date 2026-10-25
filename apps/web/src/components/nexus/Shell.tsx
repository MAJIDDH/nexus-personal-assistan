import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, Sparkles, X, Construction, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES, getModule, type ModuleId } from "@/lib/modules";

type Task = { id: string; title: string; description: string; project_key: string; status: "open" | "in_progress" | "completed" | "cancelled"; priority_score: number; due_at: string | null };
type Idea = { id: string; title: string; concept: string; objective: string; status: string };
type ApiState = "checking" | "connected" | "offline";

export function NavRail({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  return (
    <nav aria-label="ناوبری اصلی" className="glass z-20 flex w-[68px] shrink-0 flex-col items-center gap-1 border-y-0 border-s-0 py-4">
      <div className="mb-4 font-display text-[11px] font-semibold tracking-[0.3em] text-primary text-glow">NX</div>
      {MODULES.map((m) => {
        const Icon = m.icon; const on = active === m.id;
        return <button key={m.id} type="button" onClick={() => onSelect(m.id)} aria-current={on ? "page" : undefined}
          className={cn("group relative grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", on && "bg-accent text-primary shadow-glow", m.id === "settings" && "mt-auto")}>
          <Icon className="h-[18px] w-[18px]" />
          <span className="pointer-events-none absolute start-12 z-30 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" dir="rtl">{m.label}</span>
        </button>;
      })}
    </nav>
  );
}

export function TopBar() {
  const [api, setApi] = useState<ApiState>("checking");
  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const response = await fetch("/api/health/ready");
        if (!response.ok) throw new Error("API unavailable");
        const result = await response.json();
        if (alive) setApi(result.status === "ready" && result.dependencies?.database === "ok" ? "connected" : "offline");
      } catch { if (alive) setApi("offline"); }
    };
    void check();
    const id = window.setInterval(check, 15000);
    return () => { alive = false; window.clearInterval(id); };
  }, []);
  const label = api === "connected" ? "API و پایگاه داده متصل" : api === "checking" ? "در حال بررسی اتصال" : "اتصال برقرار نیست";
  return <header className="relative z-20 flex h-12 shrink-0 items-center justify-between px-3 md:px-6">
    <div className="flex items-baseline gap-3"><h1 className="font-display text-lg font-semibold tracking-[0.3em] md:tracking-[0.45em] text-foreground text-glow">NEXUS</h1><span className="hidden text-xs md:inline text-muted-foreground" dir="rtl">دستیار شخصی هوشمند</span></div>
    <div className="flex items-center gap-3 text-xs text-muted-foreground" dir="rtl">
      <span className={cn("rounded-full border whitespace-nowrap px-2.5 py-0.5", api === "connected" ? "border-primary/40 text-primary" : "border-warn/40 text-warn")}>{label}</span>
    </div>
  </header>;
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="rounded-lg border border-warn/30 p-3 text-xs leading-6 text-muted-foreground"><p>{message}</p><button onClick={onRetry} className="mt-2 inline-flex items-center gap-1 text-primary"><RefreshCw className="h-3 w-3" /> تلاش دوباره</button></div>;
}

export function ContextPanel({ active, onClose }: { active: ModuleId; onClose: () => void }) {
  const m = getModule(active); const Icon = m.icon;
  const [tasks, setTasks] = useState<Task[]>([]); const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaConcept, setIdeaConcept] = useState("");
  const [ideaObjective, setIdeaObjective] = useState("grow_followers");
  const [savingIdea, setSavingIdea] = useState(false);
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editConcept, setEditConcept] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskImportance, setTaskImportance] = useState(3);
  const [taskUrgency, setTaskUrgency] = useState(3);
  const [savingTask, setSavingTask] = useState(false);
  useEffect(() => {
    if (active !== "tasks" && active !== "ideas") return;
    const controller = new AbortController(); setLoading(true); setError("");
    const endpoint = active === "tasks" ? "/api/tasks?project=golddyousefi" : "/api/content-ideas";
    fetch(endpoint, { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("درخواست به API ناموفق بود."); return response.json(); })
      .then((data: Task[] | Idea[]) => { if (active === "tasks") setTasks(data as Task[]); else setIdeas(data as Idea[]); })
      .catch(err => { if (err.name !== "AbortError") setError("دریافت اطلاعات ممکن نشد؛ بررسی کن API نکسوس اجرا باشد."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [active, reload]);

  const createTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    setSavingTask(true); setError("");
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskTitle.trim(), description: taskDescription.trim(), project_key: "golddyousefi", importance: taskImportance, urgency: taskUrgency }),
      });
      if (!response.ok) throw new Error("Task create failed");
      const created: Task = await response.json();
      setTasks(old => [created, ...old]);
      setTaskTitle(""); setTaskDescription(""); setTaskImportance(3); setTaskUrgency(3);
    } catch {
      setError("ذخیرهٔ وظیفه انجام نشد؛ اتصال API را بررسی کن و دوباره تلاش کن.");
    } finally { setSavingTask(false); }
  };

  const createIdea = async (event: FormEvent) => {
    event.preventDefault();
    if (!ideaTitle.trim() || !ideaConcept.trim()) return;
    setSavingIdea(true); setError("");
    try {
      const response = await fetch("/api/content-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: ideaTitle.trim(), concept: ideaConcept.trim(), objective: ideaObjective }),
      });
      if (!response.ok) throw new Error("Idea create failed");
      const created: Idea = await response.json();
      setIdeas(old => [created, ...old]);
      setIdeaTitle(""); setIdeaConcept(""); setIdeaObjective("grow_followers");
    } catch {
      setError("ذخیرهٔ ایده انجام نشد؛ اتصال API را بررسی کن و دوباره تلاش کن.");
    } finally { setSavingIdea(false); }
  };

  const saveIdeaEdit = async (idea: Idea) => {
    if (!editTitle.trim() || !editConcept.trim()) return;
    setError("");
    try {
      const response = await fetch(`/api/content-ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), concept: editConcept.trim() }),
      });
      if (!response.ok) throw new Error("Idea update failed");
      const updated: Idea = await response.json();
      setIdeas(old => old.map(item => item.id === updated.id ? updated : item));
      setEditingIdeaId(null);
    } catch {
      setError("ویرایش ذخیره نشد؛ فقط پیش‌نویس‌ها قابل ویرایش هستند.");
    }
  };

  const submitIdeaForReview = async (idea: Idea) => {
    setError("");
    try {
      const response = await fetch(`/api/content-ideas/${idea.id}/submit-for-review`, { method: "POST" });
      if (!response.ok) throw new Error("Idea review submission failed");
      const updated: Idea = await response.json();
      setIdeas(old => old.map(item => item.id === updated.id ? updated : item));
    } catch {
      setError("ارسال برای بررسی انجام نشد؛ احتمالاً ایده دیگر در وضعیت پیش‌نویس نیست.");
    }
  };

  const changeTaskStatus = async (task: Task, checked: boolean) => {
    const status = checked ? "completed" : "open";
    try {
      const response = await fetch(`/api/tasks/${task.id}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error("Task status update failed");
      const updated: Task = await response.json();
      setTasks(old => old.map(item => item.id === updated.id ? updated : item));
    } catch { setError("تغییر وضعیت ذخیره نشد. ممکن است وضعیت فعلی وظیفه اجازهٔ این تغییر را ندهد."); }
  };

  return <aside dir="rtl" aria-label={m.label} className={cn("glass absolute inset-x-3 top-14 z-20 md:inset-x-auto md:right-5 md:top-16 md:w-[300px] rounded-xl p-5 animate-in fade-in slide-in-from-left-2", m.id === "assistant" && "max-md:hidden")}>
    <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-primary"><Icon className="h-4 w-4" /></span><h2 className="text-sm font-semibold">{m.label}</h2></div>
      {active !== "assistant" && <button onClick={onClose} aria-label="بستن" className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="h-4 w-4" /></button>}
    </div>
    {!m.ready ? <div className="rounded-lg border border-dashed border-warn/40 p-4 text-center"><Construction className="mx-auto mb-2 h-5 w-5 text-warn" /><p className="text-sm text-warn">در حال توسعه</p><p className="mt-1 text-xs leading-6 text-muted-foreground">این بخش هنوز ساخته نشده و به هیچ سرویسی متصل نیست.</p></div>
    : active === "tasks" ? <div className="max-h-[70vh] space-y-3 overflow-y-auto pe-1">
      <form onSubmit={createTask} className="space-y-2 rounded-lg border border-border/70 p-3">
        <p className="text-xs font-medium">وظیفهٔ جدید · گالری طلا یوسفی</p>
        <label className="block text-xs text-muted-foreground">عنوان وظیفه
          <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} maxLength={200} required placeholder="مثلاً آماده‌کردن سناریوی ریل" className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" />
        </label>
        <label className="block text-xs text-muted-foreground">توضیحات (اختیاری)
          <textarea value={taskDescription} onChange={e => setTaskDescription(e.target.value)} maxLength={5000} rows={2} placeholder="جزئیات انجام کار…" className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm text-foreground" />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-xs text-muted-foreground">اهمیت: {taskImportance}/5
            <input type="range" min={1} max={5} value={taskImportance} onChange={e => setTaskImportance(Number(e.target.value))} className="mt-2 block w-full accent-primary" />
          </label>
          <label className="block text-xs text-muted-foreground">فوریت: {taskUrgency}/5
            <input type="range" min={1} max={5} value={taskUrgency} onChange={e => setTaskUrgency(Number(e.target.value))} className="mt-2 block w-full accent-primary" />
          </label>
        </div>
        <button type="submit" disabled={savingTask || !taskTitle.trim()} className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">{savingTask ? "در حال ذخیره…" : "ثبت وظیفه"}</button>
      </form>
      <div className="flex items-center justify-between"><p className="text-[11px] text-muted-foreground">وظایف واقعی · گالری طلا یوسفی</p><button onClick={() => setReload(v => v + 1)} aria-label="بارگذاری مجدد" className="text-muted-foreground"><RefreshCw className="h-3 w-3" /></button></div>
      <div className="flex items-center justify-between"><p className="text-[11px] text-muted-foreground">وظایف واقعی · گالری طلا یوسفی</p><button onClick={() => setReload(v => v + 1)} aria-label="بارگذاری مجدد" className="text-muted-foreground"><RefreshCw className="h-3 w-3" /></button></div>
      {loading && <p className="text-xs text-muted-foreground">در حال بارگذاری…</p>}{error && <LoadError message={error} onRetry={() => setReload(v => v + 1)} />}
      {!loading && !error && tasks.length === 0 && <p className="rounded-lg bg-secondary px-3 py-3 text-xs text-muted-foreground">وظیفه‌ای برای این پروژه ثبت نشده است.</p>}
      {tasks.map(task => <label key={task.id} className="flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-sm"><input type="checkbox" checked={task.status === "completed"} disabled={task.status === "cancelled" || task.status === "completed"} onChange={e => void changeTaskStatus(task, e.target.checked)} className="mt-1 accent-primary" /><span className={cn(task.status === "completed" && "text-muted-foreground line-through")}><span className="block">{task.title}</span><span className="mt-1 block text-[10px] text-muted-foreground">اولویت {task.priority_score} · {task.status === "in_progress" ? "در حال انجام" : task.status === "completed" ? "تکمیل‌شده" : task.status === "cancelled" ? "لغوشده" : "باز"}</span></span></label>)}
    </div>
    : active === "ideas" ? <div className="max-h-[70vh] space-y-3 overflow-y-auto pe-1">
      <p className="text-[11px] text-muted-foreground">ایده‌های محتوا · ذخیره‌شده در پایگاه داده</p>
      <form onSubmit={createIdea} className="space-y-2 rounded-lg border border-border/70 p-3">
        <label className="block text-xs text-muted-foreground">عنوان ایده
          <input value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)} maxLength={160} required placeholder="مثلاً معرفی زنجیرهای جدید" className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" />
        </label>
        <label className="block text-xs text-muted-foreground">سناریو یا توضیح
          <textarea value={ideaConcept} onChange={e => setIdeaConcept(e.target.value)} maxLength={5000} required rows={3} placeholder="ایدهٔ ویدیو، پیام اصلی و نحوهٔ اجرا…" className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm text-foreground" />
        </label>
        <label className="block text-xs text-muted-foreground">هدف
          <select value={ideaObjective} onChange={e => setIdeaObjective(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground">
            <option value="grow_followers">رشد دنبال‌کننده</option>
            <option value="increase_sales">افزایش فروش</option>
            <option value="increase_engagement">افزایش تعامل</option>
            <option value="educate">آموزش مخاطب</option>
          </select>
        </label>
        <button type="submit" disabled={savingIdea || !ideaTitle.trim() || !ideaConcept.trim()} className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">{savingIdea ? "در حال ذخیره…" : "ذخیرهٔ پیش‌نویس"}</button>
      </form>
      {loading && <p className="text-xs text-muted-foreground">در حال بارگذاری…</p>}
      {error && <LoadError message={error} onRetry={() => setReload(v => v + 1)} />}
      {!loading && !error && ideas.length === 0 && <p className="rounded-lg bg-secondary px-3 py-3 text-xs text-muted-foreground">هنوز ایده‌ای ثبت نشده است.</p>}
      {ideas.map(idea => <div key={idea.id} className="space-y-2 rounded-lg bg-secondary px-3 py-3">
        {editingIdeaId === idea.id ? <div className="space-y-2">
          <input value={editTitle} onChange={e => setEditTitle(e.target.value)} maxLength={160} aria-label="عنوان ویرایش‌شده" className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" />
          <textarea value={editConcept} onChange={e => setEditConcept(e.target.value)} maxLength={5000} rows={3} aria-label="توضیح ویرایش‌شده" className="w-full rounded-md border border-border bg-background p-2 text-sm text-foreground" />
          <div className="flex gap-2"><button type="button" onClick={() => void saveIdeaEdit(idea)} className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">ذخیره</button><button type="button" onClick={() => setEditingIdeaId(null)} className="rounded-md border border-border px-3 py-1.5 text-xs">انصراف</button></div>
        </div> : <><p className="text-sm font-medium">{idea.title}</p><p className="whitespace-pre-wrap text-xs leading-5 text-muted-foreground">{idea.concept}</p><p className="text-[10px] text-muted-foreground">{idea.status === "draft" ? "پیش‌نویس" : idea.status === "in_review" ? "در انتظار بررسی" : idea.status === "approved" ? "تأییدشده" : "بایگانی‌شده"}</p>
          {idea.status === "draft" && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setEditingIdeaId(idea.id); setEditTitle(idea.title); setEditConcept(idea.concept); }} className="rounded-md border border-border px-2 py-1 text-[11px]">ویرایش</button><button type="button" onClick={() => void submitIdeaForReview(idea)} className="rounded-md border border-primary/40 px-2 py-1 text-[11px] text-primary">ارسال برای بررسی</button></div>}
        </>}
      </div>)}
    </div>
    : active === "memory" ? <div className="space-y-3 text-sm leading-7 text-muted-foreground"><p>حافظهٔ قابل مدیریت در مرحلهٔ بعدی پیاده‌سازی می‌شود.</p><p className="text-xs">اطلاعات نمونه به‌عنوان حافظهٔ واقعی نمایش داده نمی‌شود.</p></div>
    : <div className="space-y-3 text-sm leading-7 text-muted-foreground"><p>سلام! من نکسوس هستم. یک گره را روی شبکه انتخاب کنید یا در کادر پایین بنویسید.</p><p className="text-xs">گفت‌وگوی هوشمند هنوز به مدل AI متصل نشده است.</p></div>}
  </aside>;
}

interface Msg { role: "user" | "demo"; text: string }
const replies = ["این یک پاسخ نمایشی است؛ هنوز هیچ مدل هوش مصنوعی متصل نشده است.", "پیامت فقط در این صفحه ثبت شد؛ اتصال به دستیار هوشمند هنوز انجام نشده است.", "برای پاسخ واقعی، باید سرویس مدل هوش مصنوعی متصل شود."];

export function CommandBar() {
  const [msgs, setMsgs] = useState<Msg[]>([]); const [text, setText] = useState(""); const n = useRef(0);
  const submit = (e: FormEvent) => { e.preventDefault(); const t = text.trim(); if (!t) return; setMsgs((m) => { const next: Msg[] = [...m, { role: "user", text: t }, { role: "demo", text: replies[n.current++ % replies.length] ?? "" }]; return next.slice(-4); }); setText(""); };
  return <div dir="rtl" className="absolute inset-x-0 bottom-5 z-20 mx-auto w-[min(640px,calc(100%-2rem))] space-y-2">
    {msgs.length > 0 && <div className="space-y-1.5" aria-live="polite">{msgs.map((m, i) => <div key={i} className={cn("glass w-fit max-w-[85%] rounded-xl px-3 py-2 text-sm", m.role === "user" ? "ms-auto" : "me-auto")}>{m.role === "demo" && <span className="mb-0.5 block text-[10px] text-warn">پاسخ نمایشی</span>}{m.text}</div>)}</div>}
    <form onSubmit={submit} className="glass flex items-center gap-2 rounded-2xl p-1.5 ps-4 focus-within:shadow-glow"><Sparkles className="h-4 w-4 shrink-0 text-primary" /><input value={text} onChange={e => setText(e.target.value)} placeholder="با نکسوس صحبت کن…" aria-label="فرمان یا پیام" className="h-9 flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none" /><button type="submit" aria-label="ارسال" className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40" disabled={!text.trim()}><Send className="h-4 w-4 -scale-x-100" /></button></form>
  </div>;
}
