import { Bot, Users, ListChecks, Lightbulb, Gem, Instagram, Workflow, Brain, BarChart3, Settings, type LucideIcon } from "lucide-react";

export type ModuleId = "assistant" | "agents" | "tasks" | "ideas" | "gallery" | "instagram" | "automation" | "memory" | "analytics" | "settings";

export interface NexusModule {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  ready: boolean;
  /** position of the floating node on the field, in % */
  node?: { x: number; y: number; ax: number; ay: number };
}

// ax/ay = anchor point inside the neural mass the fiber connects to (%)
export const MODULES: NexusModule[] = [
  { id: "assistant", label: "دستیار هوشمند", icon: Bot, ready: true },
  { id: "agents", label: "عامل‌ها", icon: Users, ready: false, node: { x: 14, y: 22, ax: 33, ay: 38 } },
  { id: "tasks", label: "وظایف", icon: ListChecks, ready: true, node: { x: 40, y: 10, ax: 44, ay: 30 } },
  { id: "ideas", label: "ایده‌های محتوا", icon: Lightbulb, ready: true, node: { x: 69, y: 17, ax: 55, ay: 34 } },
  { id: "gallery", label: "گالری طلا یوسفی", icon: Gem, ready: false, node: { x: 10, y: 60, ax: 30, ay: 54 } },
  { id: "instagram", label: "اینستاگرام", icon: Instagram, ready: false, node: { x: 74, y: 55, ax: 57, ay: 52 } },
  { id: "automation", label: "خودکارسازی", icon: Workflow, ready: false, node: { x: 24, y: 80, ax: 38, ay: 62 } },
  { id: "memory", label: "حافظه", icon: Brain, ready: true, node: { x: 62, y: 78, ax: 50, ay: 60 } },
  { id: "analytics", label: "تحلیل و گزارش", icon: BarChart3, ready: false },
  { id: "settings", label: "تنظیمات", icon: Settings, ready: false },
];

export const getModule = (id: ModuleId) => MODULES.find((m) => m.id === id)!;

// Clearly labeled mock data
export const MOCK_TASKS = [
  { t: "بازبینی متن پست معرفی کالکشن پاییزه", done: false },
  { t: "تهیه فهرست هشتگ‌های هفته", done: true },
  { t: "پیش‌نویس پاسخ به پیام‌های مشتریان", done: false },
];
export const MOCK_IDEAS = ["ریلز پشت‌صحنه ساخت گردنبند", "راهنمای انتخاب انگشتر بر اساس فرم دست", "داستان یک قطعه: از طرح تا ویترین"];
export const MOCK_MEMORY = ["لحن برند: گرم، رسمی، کوتاه", "رنگ‌های غالب پست‌ها: طلایی و کرم", "زمان ترجیحی انتشار: عصرها"];