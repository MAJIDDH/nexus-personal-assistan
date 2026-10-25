import { useRef, useState, type FormEvent } from "react";
import { Send, Sparkles, X, Construction } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES, MOCK_IDEAS, MOCK_MEMORY, MOCK_TASKS, getModule, type ModuleId } from "@/lib/modules";

export function NavRail({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  return (
    <nav aria-label="ناوبری اصلی" className="glass z-20 flex w-[68px] shrink-0 flex-col items-center gap-1 border-y-0 border-s-0 py-4">
      <div className="mb-4 font-display text-[11px] font-semibold tracking-[0.3em] text-primary text-glow">NX</div>
      {MODULES.map((m) => {
        const Icon = m.icon;
        const on = active === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            aria-current={on ? "page" : undefined}
            className={cn(
              "group relative grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              on && "bg-accent text-primary shadow-glow",
              m.id === "settings" && "mt-auto",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="pointer-events-none absolute start-12 z-30 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" dir="rtl">
              {m.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function TopBar() {
  return (
    <header className="relative z-20 flex h-12 shrink-0 items-center justify-between px-3 md:px-6">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display text-lg font-semibold tracking-[0.3em] md:tracking-[0.45em] text-foreground text-glow">NEXUS</h1>
        <span className="hidden text-xs md:inline text-muted-foreground" dir="rtl">دستیار شخصی هوشمند</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground" dir="rtl">
        <span className="rounded-full border border-warn/40 whitespace-nowrap px-2.5 py-0.5 text-warn">نسخه نمایشی · داده‌ها ساختگی</span>
        <span className="hidden md:inline">اتصال واقعی: ندارد</span>
      </div>
    </header>
  );
}

function List({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">{title} · داده نمونه</p>
      {items.map((t) => (
        <div key={t} className="rounded-lg bg-secondary px-3 py-2 text-sm">{t}</div>
      ))}
    </div>
  );
}

export function ContextPanel({ active, onClose }: { active: ModuleId; onClose: () => void }) {
  const m = getModule(active);
  const Icon = m.icon;
  return (
    <aside dir="rtl" aria-label={m.label} className={cn("glass absolute inset-x-3 top-14 z-20 md:inset-x-auto md:right-5 md:top-16 md:w-[300px] rounded-xl p-5 animate-in fade-in slide-in-from-left-2", m.id === "assistant" && "max-md:hidden")}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-primary"><Icon className="h-4 w-4" /></span>
          <h2 className="text-sm font-semibold">{m.label}</h2>
        </div>
        {active !== "assistant" && (
          <button onClick={onClose} aria-label="بستن" className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="h-4 w-4" /></button>
        )}
      </div>
      {!m.ready ? (
        <div className="rounded-lg border border-dashed border-warn/40 p-4 text-center">
          <Construction className="mx-auto mb-2 h-5 w-5 text-warn" />
          <p className="text-sm text-warn">در حال توسعه</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">این بخش هنوز ساخته نشده و به هیچ سرویسی متصل نیست.</p>
        </div>
      ) : active === "tasks" ? (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">وظایف امروز · داده نمونه</p>
          {MOCK_TASKS.map((t) => (
            <label key={t.t} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
              <input type="checkbox" defaultChecked={t.done} className="accent-primary" />
              <span className={cn(t.done && "text-muted-foreground line-through")}>{t.t}</span>
            </label>
          ))}
        </div>
      ) : active === "ideas" ? (
        <List items={MOCK_IDEAS} title="پیشنهادها" />
      ) : active === "memory" ? (
        <List items={MOCK_MEMORY} title="یادداشت‌های ذخیره‌شده" />
      ) : (
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>سلام! من نکسوس هستم. یک گره را روی شبکه انتخاب کنید یا در کادر پایین بنویسید.</p>
          <p className="text-xs">پاسخ‌ها در این نسخه نمایشی و از پیش تعیین‌شده‌اند.</p>
        </div>
      )}
    </aside>
  );
}

interface Msg { role: "user" | "demo"; text: string }
const replies = [
  "این یک پاسخ نمایشی است؛ هنوز هیچ مدل هوش مصنوعی متصل نشده است.",
  "درخواست شما ثبت شد (فقط در این صفحه). در نسخه واقعی، اینجا پاسخ دستیار نمایش داده می‌شود.",
  "پاسخ نمونه: پیشنهاد می‌کنم ابتدا وظایف امروز را مرور کنید.",
];

export function CommandBar() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const n = useRef(0);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMsgs((m): Msg[] => [...m, { role: "user" as const, text: t }, { role: "demo" as const, text: replies[n.current++ % replies.length] ?? "" }].slice(-4));
    setText("");
  };
  return (
    <div dir="rtl" className="absolute inset-x-0 bottom-5 z-20 mx-auto w-[min(640px,calc(100%-2rem))] space-y-2">
      {msgs.length > 0 && (
        <div className="space-y-1.5" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={cn("glass w-fit max-w-[85%] rounded-xl px-3 py-2 text-sm", m.role === "user" ? "ms-auto" : "me-auto")}>
              {m.role === "demo" && <span className="mb-0.5 block text-[10px] text-warn">پاسخ نمایشی</span>}
              {m.text}
            </div>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="glass flex items-center gap-2 rounded-2xl p-1.5 ps-4 focus-within:shadow-glow">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="با نکسوس صحبت کن…"
          aria-label="فرمان یا پیام"
          className="h-9 flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <button type="submit" aria-label="ارسال" className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40" disabled={!text.trim()}>
          <Send className="h-4 w-4 -scale-x-100" />
        </button>
      </form>
    </div>
  );
}