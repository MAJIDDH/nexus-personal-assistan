import { useState } from "react";
import { cn } from "@/lib/utils";
import { MODULES, type ModuleId } from "@/lib/modules";

export function ModuleNodes({ active, onOpen }: { active: ModuleId; onOpen: (id: ModuleId) => void }) {
  const [hover, setHover] = useState<ModuleId | null>(null);
  const nodes = MODULES.filter((m) => m.node);

  return (
    <div className="absolute inset-0">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {nodes.map((m) => {
          const n = m.node!;
          const on = hover === m.id || active === m.id;
          const mx = (n.x + n.ax) / 2 + (n.y - n.ay) * 0.25;
          const my = (n.y + n.ay) / 2 - (n.x - n.ax) * 0.25;
          const d = `M${n.x} ${n.y} Q${mx} ${my} ${n.ax} ${n.ay}`;
          return (
            <g key={m.id}>
              <path d={d} fill="none" vectorEffect="non-scaling-stroke" className={cn("stroke-glow transition-all duration-300", on ? "opacity-70" : "opacity-35")} strokeWidth={on ? 1.8 : 1} />
              <path d={d} fill="none" vectorEffect="non-scaling-stroke" className={cn("fiber-flow stroke-glow transition-opacity", on ? "opacity-100" : "opacity-60")} strokeWidth={1.4} />
            </g>
          );
        })}
      </svg>
      {nodes.map((m) => {
        const n = m.node!;
        const on = hover === m.id || active === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onOpen(m.id)}
            onMouseEnter={() => setHover(m.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(m.id)}
            onBlur={() => setHover(null)}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
            aria-label={`باز کردن ${m.label}${m.ready ? "" : " (در حال توسعه)"}`}
          >
            <span className={cn(
              "glass flex items-center gap-2 rounded-full py-1.5 pe-3.5 ps-1.5 text-xs transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ring",
              on ? "shadow-glow border-primary/60 text-foreground" : "text-muted-foreground",
            )}>
              <span className={cn("grid h-7 w-7 place-items-center rounded-full bg-accent transition-colors", on && "bg-primary text-primary-foreground")}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span dir="rtl" className="whitespace-nowrap">{m.label}</span>
              {!m.ready && <span className="h-1.5 w-1.5 rounded-full bg-warn" />}
            </span>
            <span
              role="tooltip"
              dir="rtl"
              className={cn(
                "glass pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] text-muted-foreground transition-opacity duration-200",
                on ? "opacity-100" : "opacity-0",
              )}
            >
              {m.ready ? "نمای نمایشی · داده نمونه" : "در حال توسعه"}
            </span>
          </button>
        );
      })}
    </div>
  );
}