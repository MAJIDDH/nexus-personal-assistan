import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Task = { id:string; title:string; description:string; project_key:string; status:'open'|'in_progress'|'completed'|'cancelled'; priority_score:number; importance:number; urgency:number; due_at:string|null; created_at:string; updated_at:string; completed_at:string|null };
type Idea = { id:string; title:string; concept:string; objective:string; status:string };
type AuditEvent = { id:string|number; entity_type:string; entity_id:string; action:'created'|'updated'|'status_changed'|string; actor:string; source:string; before_data:Record<string,unknown>|null; after_data:Record<string,unknown>; occurred_at:string };
type Page = 'home'|'tasks'|'ideas';
type IdeaParts = { premise:string; script:string; caption:string };
const ideaMarker='--- NEXUS CONTENT DRAFT V1 ---';
function unpackIdeaConcept(value:string):IdeaParts{if(!value.startsWith(ideaMarker))return {premise:value,script:'',caption:''};const read=(name:string)=>{const marker='--- '+name+' ---\n';const start=value.indexOf(marker);if(start<0)return '';const from=start+marker.length;const next=value.indexOf('\n--- ',from);return value.slice(from,next<0?undefined:next).trim()};return {premise:read('IDEA'),script:read('SCRIPT'),caption:read('CAPTION')}}
function packIdeaConcept(premise:string,script:string,caption:string):string{if(!script.trim()&&!caption.trim())return premise.trim();return `${ideaMarker}\n--- IDEA ---\n${premise.trim()}\n--- SCRIPT ---\n${script.trim()}\n--- CAPTION ---\n${caption.trim()}`}
function ideaSummary(value:string):string{return unpackIdeaConcept(value).premise}
function missingIdeaParts(title:string,parts:IdeaParts):string[]{return [!title.trim()?'عنوان ایده':null,!parts.premise.trim()?'شرح ایده':null,!parts.script.trim()?'سناریو و متن اجرا':null,!parts.caption.trim()?'کپشن':null].filter((part):part is string=>Boolean(part))}
const statusFa:Record<string,string>={open:'باز',in_progress:'در حال انجام',completed:'انجام‌شده',cancelled:'لغوشده',draft:'پیش‌نویس',in_review:'در انتظار بررسی',approved:'تأییدشده',archived:'بایگانی'};
const projectFa:Record<string,string>={personal:'شخصی',nexus:'نکسوس',golddyousefi:'گالری طلا یوسفی','bache-mahal':'پروژه قدیمی'};
const objectiveFa:Record<string,string>={grow_followers:'رشد فالوور واقعی',increase_sales:'افزایش فروش',increase_engagement:'افزایش تعامل',educate:'آموزش مخاطب'};
const auditActionFa:Record<string,string>={created:'ایجاد وظیفه',updated:'ویرایش وظیفه',status_changed:'تغییر وضعیت'};
const auditFieldFa:Record<string,string>={title:'عنوان',status:'وضعیت',importance:'اهمیت',urgency:'فوریت',priority_score:'امتیاز اولویت',due_at:'مهلت انجام',description:'توضیحات',project_key:'پروژه'};
function auditValue(key:string,value:unknown):string{if(value===null||value===undefined||value==='')return 'ندارد';if(key==='status')return statusFa[String(value)]??String(value);if(key==='project_key')return projectFa[String(value)]??String(value);if(key==='due_at')return new Date(String(value)).toLocaleString('fa-IR');if(typeof value==='boolean')return value?'بله':'خیر';return String(value)}
async function api<T>(url:string, options?:RequestInit):Promise<T>{
 const r=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options?.headers}});
 if(!r.ok){let msg='خطا در ارتباط با سرویس';try{const b=await r.json();msg=b.message??msg}catch{}throw new Error(Array.isArray(msg)?msg.join('، '):msg)}
 return r.json() as Promise<T>;
}
function Glyph({children}:{children:string}){return <span className="glyph" aria-hidden="true">{children}</span>}
import { useEffect, useRef } from "react";

type Pt = [number, number];
interface Fiber { pts: Pt[]; w: number; hue: number; light: number }

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Palette: cyan / turquoise / electric-blue with rare violet-magenta accents
function pickHue(r: () => number) {
  const v = r();
  if (v < 0.07) return 290 + r() * 30;
  if (v < 0.25) return 210 + r() * 15;
  return 178 + r() * 22;
}

function generate(w: number, h: number) {
  const r = mulberry32(11);
  const portrait = h > w;
  const s = Math.min(w, h) * (portrait ? 1.05 : 1);
  // Compact, asymmetric sculpture biased left of centre (clears the right panel)
  const cx = w * (portrait ? 0.55 : 0.42), cy = h * 0.47;
  const sx = portrait ? 1.15 : 1.45, sy = portrait ? 1.65 : 0.95;
  // A few soma-like hubs; main axon trunks radiate unevenly from them
  const hubs = [
    { x: -0.1, y: -0.02, trunks: 7 },
    { x: 0.13, y: 0.05, trunks: 6 },
    { x: -0.02, y: -0.14, trunks: 4 },
    { x: -0.24, y: 0.1, trunks: 4 },
    { x: 0.27, y: -0.08, trunks: 3 },
  ].map((c) => ({ ...c, x: cx + c.x * s * sx, y: cy + c.y * s * sy }));
  const clusters = hubs.map((c) => ({ x: c.x, y: c.y, rx: s * 0.22 * sx, ry: s * 0.2 * sy }));
  const bound = { x: cx, y: cy, rx: s * 0.4 * sx, ry: s * 0.3 * sy };

  const fibers: Fiber[] = [];
  const synapses: { x: number; y: number; r: number; hue: number }[] = [];
  const gauss = () => (r() + r() + r() - 1.5) / 1.5;
  const unit = s / 800;

  const grow = (x: number, y: number, a: number, wd: number, life: number, depth: number, hue: number) => {
    const pts: Pt[] = [[x, y]];
    let curv = (r() - 0.5) * 0.03;
    const step = (3 + r() * 1.5) * Math.max(0.6, unit);
    for (let i = 0; i < life; i++) {
      curv += (r() - 0.5) * 0.014;
      curv *= 0.93;
      a += curv;
      // soft envelope keeps the sculpture compact
      const dx = (x - bound.x) / bound.rx, dy = (y - bound.y) / bound.ry;
      const d = Math.hypot(dx, dy);
      // irregular lobed envelope: fibers taper off at the edge instead of curling back
      const ang = Math.atan2(dy, dx);
      const lim = 0.85 + 0.22 * Math.sin(3 * ang + 1.3) + 0.14 * Math.sin(5 * ang + 0.4);
      if (d > lim) break;
      if (d > lim * 0.8) {
        let diff = Math.atan2(bound.y - y, bound.x - x) - a;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        a += diff * 0.012;
      }
      x += Math.cos(a) * step; y += Math.sin(a) * step;
      pts.push([x, y]);
      const bp = depth === 0 ? 0.08 : depth === 1 ? 0.06 : 0.04;
      if (depth < 3 && i > 6 && r() < bp) {
        const side = r() < 0.5 ? -1 : 1;
        if (r() < 0.35) synapses.push({ x, y, r: (0.7 + r() * 1.1) * (depth === 0 ? 1.3 : 1), hue });
        grow(x, y, a + side * (0.3 + r() * 0.6), wd * (0.45 + r() * 0.15), (life - i) * (0.4 + r() * 0.35), depth + 1, r() < 0.05 ? pickHue(r) : hue);
      }
    }
    synapses.push({ x, y, r: 0.6 + r() * 0.6, hue });
    fibers.push({ pts, w: wd, hue, light: (hue > 280 ? 40 : 50) + r() * 16 + (depth === 0 ? 6 : 0) });
  };

  for (const c of hubs) {
    const base = r() * Math.PI * 2;
    for (let i = 0; i < c.trunks; i++) {
      const a = base + (i / c.trunks) * Math.PI * 2 + (r() - 0.5) * 0.9;
      const hue = r() < 0.06 ? 295 + r() * 20 : 180 + r() * 30;
      grow(c.x + gauss() * 6, c.y + gauss() * 6, a, 1.1 + r() * r() * 1.6, 38 + r() * 55, 0, hue);
    }
    synapses.push({ x: c.x, y: c.y, r: 1.8, hue: 190 });
  }
  // A handful of faint free wisps for depth
  for (let i = 0; i < 16; i++) {
    const c = hubs[Math.floor(r() * hubs.length)]!;
    grow(c.x + gauss() * bound.rx * 0.5, c.y + gauss() * bound.ry * 0.5, r() * Math.PI * 2, 0.35 + r() * 0.3, 40 + r() * 60, 2, pickHue(r));
  }
  const dust = Array.from({ length: 140 }, () => ({
    x: bound.x + gauss() * bound.rx * 1.3, y: bound.y + gauss() * bound.ry * 1.4, r: r() * 0.7 + 0.2, p: r() * Math.PI * 2, hue: pickHue(r),
  }));
  return { fibers, synapses, dust, clusters };
}

function strokeFiber(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i]![0] + pts[i + 1]![0]) / 2, my = (pts[i]![1] + pts[i + 1]![1]) / 2;
    ctx.quadraticCurveTo(pts[i]![0], pts[i]![1], mx, my);
  }
  ctx.stroke();
}

export function NeuralField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, data: ReturnType<typeof generate>, stat: HTMLCanvasElement, W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pulses: { f: number; t: number; v: number }[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      data = generate(W, H);
      stat = document.createElement("canvas");
      stat.width = W * dpr; stat.height = H * dpr;
      const s = stat.getContext("2d")!;
      s.scale(dpr, dpr);
      // faint asymmetric haze
      for (const c of data.clusters) {
        const g = s.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.rx * 1.3);
        g.addColorStop(0, "hsla(195,90%,40%,0.035)");
        g.addColorStop(1, "hsla(220,80%,20%,0)");
        s.fillStyle = g;
        s.fillRect(0, 0, W, H);
      }
      s.globalCompositeOperation = "lighter";
      s.lineCap = "round";
      for (const f of data.fibers) {
        s.strokeStyle = `hsla(${f.hue},95%,${f.light}%,0.05)`;
        s.lineWidth = f.w * 3.2;
        strokeFiber(s, f.pts);
      }
      for (const f of data.fibers) {
        s.strokeStyle = `hsla(${f.hue},95%,${f.light}%,${0.32 + Math.min(f.w, 2.5) * 0.18})`;
        s.lineWidth = f.w * 0.75;
        strokeFiber(s, f.pts);
      }
      for (const n of data.synapses) {
        const g = s.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
        g.addColorStop(0, `hsla(${n.hue},100%,82%,0.6)`);
        g.addColorStop(1, `hsla(${n.hue},100%,60%,0)`);
        s.fillStyle = g;
        s.fillRect(n.x - n.r * 3, n.y - n.r * 3, n.r * 6, n.r * 8);
      }
      const long = data.fibers.map((f, i) => ({ i, l: f.pts.length })).filter((x) => x.l > 30);
      pulses = Array.from({ length: reduce ? 0 : 18 }, () => {
        const f = long[Math.floor(Math.random() * long.length)]!.i;
        return { f, t: Math.random() * data.fibers[f]!.pts.length, v: 0.4 + Math.random() * 0.9 };
      });
      draw(0);
    };

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(stat, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      for (const d of data.dust) {
        const a = reduce ? 0.5 : 0.08 + 0.18 * Math.sin(time * 0.0012 + d.p);
        ctx.fillStyle = `hsla(${d.hue},100%,80%,${a})`;
        ctx.fillRect(d.x, d.y, d.r, d.r);
      }
      ctx.lineCap = "round";
      for (const p of pulses) {
        const pts = data.fibers[p.f]!.pts;
        p.t += p.v * 0.6;
        if (p.t >= pts.length) {
          p.f = Math.floor(Math.random() * data.fibers.length);
          p.t = 0;
          continue;
        }
        const i = Math.floor(p.t), tail = Math.max(0, i - 14);
        const hue = data.fibers[p.f]!.hue;
        ctx.beginPath();
        ctx.moveTo(pts[tail]![0], pts[tail]![1]);
        for (let k = tail + 1; k <= i; k++) ctx.lineTo(pts[k]![0], pts[k]![1]);
        const g = ctx.createLinearGradient(pts[tail]![0], pts[tail]![1], pts[i]![0], pts[i]![1]);
        g.addColorStop(0, `hsla(${hue},100%,70%,0)`);
        g.addColorStop(1, `hsla(${hue},100%,85%,0.55)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.fillStyle = `hsla(${hue},100%,90%,0.6)`;
        ctx.fillRect(pts[i]![0] - 1, pts[i]![1] - 1, 2, 2);
      }
      ctx.globalCompositeOperation = "source-over";
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    build();
    let to: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(to);
      to = setTimeout(() => { cancelAnimationFrame(raf); build(); }, 150);
    });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); clearTimeout(to); };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

function NeuralMap({online}:{online:boolean}) {
 const nodes = [
  {title:'ایده‌های محتوا',sub:'تحلیل و برنامه‌ریزی',tone:'cyan',pos:'n1',icon:'✧'},
  {title:'دستیار هوشمند',sub:'گفت‌وگو و راهنمایی',tone:'violet',pos:'n2',icon:'✳'},
  {title:'مدیریت وظایف',sub:'اولویت‌بندی و پیگیری',tone:'teal',pos:'n3',icon:'✓'},
  {title:'بازخوردها',sub:'بهبود مستمر',tone:'pink',pos:'n4',icon:'◌'},
  {title:'ارتباطات',sub:'ابزارها و اتصال‌ها',tone:'amber',pos:'n5',icon:'◎'},
  {title:'حافظه',sub:'سوابق و دانش',tone:'cyan',pos:'n6',icon:'▤'},
  {title:'تنظیمات سیستم',sub:'پیکربندی و امنیت',tone:'blue',pos:'n7',icon:'⚙'},
  {title:'تحلیل و گزارش',sub:'آمار و روندها',tone:'violet',pos:'n8',icon:'▥'}
 ];
 return <section className="neural-section">
  <div className="neural-heading"><div><span className="eyebrow">هسته مرکزی نکسوس</span><h2>یک هسته، چندین قابلیت</h2><p>جریان نور میان هسته و ماژول‌های نکسوس</p></div><span className={online?'neural-live live':'neural-live'}><i/>{online?'هسته فعال':'در انتظار اتصال'}</span></div>
  <div className="neural-map">
   <NeuralField className="neural-canvas" />
   <svg className="neural-wires" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
    <defs><radialGradient id="coreGlow"><stop offset="0" stopColor="#53d9ff" stopOpacity=".32"/><stop offset="1" stopColor="#2765ff" stopOpacity="0"/></radialGradient></defs>
    <circle cx="500" cy="280" r="165" fill="url(#coreGlow)"/>
    {['M500 280 C410 220 320 135 190 90','M500 280 C500 200 500 130 500 55','M500 280 C600 210 700 140 810 95','M500 280 C400 280 270 280 140 280','M500 280 C620 280 740 280 860 280','M500 280 C410 360 320 430 200 470','M500 280 C500 360 500 430 500 505','M500 280 C610 360 710 420 810 465'].map((d,i)=><g key={d}><path d={d} className={'wire wire-'+i}/><path d={d} className={'pulse pulse-'+i}/></g>)}
    {Array.from({length:45},(_,i)=><circle key={i} cx={50+(i*173)%900} cy={30+(i*97)%500} r={i%5===0?1.8:1} className={'star star-'+(i%4)}/>)}
   </svg>
   <div className="neural-core"><div className="core-rings"/><div className="core-mark">✳</div><b>NEXUS</b><small>NEURAL CORE</small><i className={online?'core-dot':'core-dot offline'}/></div>
   {nodes.map(n=><article className={'neural-node '+n.pos+' '+n.tone} key={n.pos}><div className="node-icon">{n.icon}</div><b>{n.title}</b><small>{n.sub}</small><span className="node-state"><i/>{online?'آماده':'محلی'}</span></article>)}
  </div>
  <div className="neural-caption">● این نمای گرافیکی به‌تدریج با قابلیت‌های واقعی نکسوس یکپارچه می‌شود</div>
 </section>;
}

export default function App(){
 const [page,setPage]=useState<Page>('home'),[tasks,setTasks]=useState<Task[]>([]),[ideas,setIdeas]=useState<Idea[]>([]);
 const [online,setOnline]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [taskForm,setTaskForm]=useState(false),[ideaForm,setIdeaForm]=useState(false),[editingTask,setEditingTask]=useState<Task|null>(null),[editingIdea,setEditingIdea]=useState<Idea|null>(null);
 const [selectedTask,setSelectedTask]=useState<Task|null>(null),[auditEvents,setAuditEvents]=useState<AuditEvent[]>([]),[auditLoading,setAuditLoading]=useState(false);
 const [title,setTitle]=useState(''),[description,setDescription]=useState(''),[project,setProject]=useState('golddyousefi'),[importance,setImportance]=useState('3'),[urgency,setUrgency]=useState('3'),[dueAt,setDueAt]=useState('');
 const [ideaTitle,setIdeaTitle]=useState(''),[concept,setConcept]=useState(''),[ideaScript,setIdeaScript]=useState(''),[ideaCaption,setIdeaCaption]=useState(''),[objective,setObjective]=useState('grow_followers');
 const refresh=useCallback(async()=>{setLoading(true);setError('');try{const [t,i]=await Promise.all([api<Task[]>('/api/tasks'),api<Idea[]>('/api/content-ideas')]);setTasks(t);setIdeas(i);setOnline(true)}catch(e){setOnline(false);setError(e instanceof Error?e.message:'ارتباط برقرار نشد')}finally{setLoading(false)}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 const counts=useMemo(()=>({open:tasks.filter(x=>x.status==='open').length,progress:tasks.filter(x=>x.status==='in_progress').length,done:tasks.filter(x=>x.status==='completed').length,drafts:ideas.filter(x=>x.status==='draft').length}),[tasks,ideas]);
 async function submitTask(e:FormEvent){e.preventDefault();try{await api('/api/tasks',{method:'POST',body:JSON.stringify({title,description,project_key:project,importance:Number(importance),urgency:Number(urgency),due_at:dueAt?new Date(dueAt).toISOString():null})});setTitle('');setDescription('');setTaskForm(false);setImportance('3');setUrgency('3');setDueAt('');await refresh()}catch(x){setError(x instanceof Error?x.message:'ثبت وظیفه ناموفق بود')}}
 async function openTaskDetails(t:Task){setSelectedTask(t);setAuditEvents([]);setAuditLoading(true);try{const events=await api<AuditEvent[]>('/api/audit-events?entity_type=task&entity_id='+encodeURIComponent(t.id)+'&limit=20');setAuditEvents(events)}catch(x){setError(x instanceof Error?x.message:'بارگذاری تاریخچه وظیفه ناموفق بود')}finally{setAuditLoading(false)}}
 function beginEdit(t:Task){setSelectedTask(null);setEditingTask(t);setTitle(t.title);setDescription(t.description??'');setProject(t.project_key);setImportance(String(t.importance??3));setUrgency(String(t.urgency??3));setDueAt(t.due_at?new Date(new Date(t.due_at).getTime()-new Date(t.due_at).getTimezoneOffset()*60000).toISOString().slice(0,16):'');setTaskForm(false)}
 async function saveEdit(e:FormEvent){e.preventDefault();if(!editingTask)return;try{await api('/api/tasks/'+editingTask.id,{method:'PATCH',body:JSON.stringify({title,description,project_key:project,importance:Number(importance),urgency:Number(urgency),due_at:dueAt?new Date(dueAt).toISOString():null})});setEditingTask(null);setTitle('');setDescription('');setDueAt('');await refresh()}catch(x){setError(x instanceof Error?x.message:'ویرایش وظیفه ناموفق بود')}}
 async function submitIdea(e:FormEvent){e.preventDefault();const fullConcept=packIdeaConcept(concept,ideaScript,ideaCaption);if(fullConcept.length>5000){setError('مجموع شرح ایده، سناریو و کپشن نباید بیشتر از ۵۰۰۰ نویسه باشد.');return}try{await api('/api/content-ideas',{method:'POST',body:JSON.stringify({title:ideaTitle,concept:fullConcept,objective})});setIdeaTitle('');setConcept('');setIdeaScript('');setIdeaCaption('');setIdeaForm(false);await refresh()}catch(x){setError(x instanceof Error?x.message:'ثبت ایده ناموفق بود')}}
 function beginIdeaEdit(i:Idea){const parts=unpackIdeaConcept(i.concept);setEditingIdea(i);setIdeaTitle(i.title);setConcept(parts.premise);setIdeaScript(parts.script);setIdeaCaption(parts.caption);setObjective(i.objective);setIdeaForm(false)}
 async function saveIdeaEdit(e:FormEvent){e.preventDefault();if(!editingIdea)return;const fullConcept=packIdeaConcept(concept,ideaScript,ideaCaption);if(fullConcept.length>5000){setError('مجموع شرح ایده، سناریو و کپشن نباید بیشتر از ۵۰۰۰ نویسه باشد.');return}try{await api('/api/content-ideas/'+editingIdea.id,{method:'PATCH',body:JSON.stringify({title:ideaTitle,concept:fullConcept,objective})});setEditingIdea(null);setIdeaTitle('');setConcept('');setIdeaScript('');setIdeaCaption('');await refresh()}catch(x){setError(x instanceof Error?x.message:'ویرایش ایده ناموفق بود')}}
 async function transition(t:Task){const status=t.status==='open'?'in_progress':'completed';try{await api('/api/tasks/'+t.id+'/status',{method:'POST',body:JSON.stringify({status})});await refresh()}catch(x){setError(x instanceof Error?x.message:'تغییر وضعیت ناموفق بود')}}
 async function review(i:Idea){
  const missing=missingIdeaParts(i.title,unpackIdeaConcept(i.concept));
  if(missing.length){
   setError('برای ارسال «'+i.title+'» به بررسی، این بخش‌ها را کامل کن: '+missing.join('، ')+'.');
   beginIdeaEdit(i);
   setPage('ideas');
   return;
  }
  setError('');
  try{
   await api('/api/content-ideas/'+i.id+'/submit-for-review',{method:'POST'});
   setNotice('پیش‌نویس برای بررسی ارسال شد. این کار به معنی تأیید انتشار نیست؛ قیمت‌ها و ادعاهای حساس همچنان نیازمند تأیید هستند.');
   await refresh();
  }catch(x){setNotice('');setError(x instanceof Error?x.message:'ارسال برای بررسی ناموفق بود')}
 }
 async function sendFeedback(t:Task,rating:'useful'|'not_useful'|'needs_adjustment'){try{await api('/api/feedback',{method:'POST',body:JSON.stringify({task_id:t.id,rating})});setError('');setNotice('بازخورد شما ذخیره شد.');}catch(x){setNotice('');setError(x instanceof Error?x.message:'ثبت بازخورد ناموفق بود')}}
 const taskRows=page==='home'?tasks.slice(0,5):tasks, ideaRows=page==='home'?ideas.slice(0,3):ideas;
 const heading=page==='home'?'صبح بخیر، آماده‌ای؟':page==='tasks'?'مدیریت وظایف':'ایده‌های محتوا';
 return <div className="shell">
  <aside className="sidebar"><div className="brand"><div className="brand-mark"><Glyph>✳</Glyph></div><div><b>NEXUS</b><small>PERSONAL INTELLIGENCE</small></div></div>
   <p className="side-label">فضای کاری</p><nav>
    <button className={page==='home'?'nav active':'nav'} onClick={()=>setPage('home')}><Glyph>⌂</Glyph> نمای کلی</button>
    <button className={page==='tasks'?'nav active':'nav'} onClick={()=>setPage('tasks')}><Glyph>✓</Glyph> مدیریت وظایف <span className="nav-count">{counts.open+counts.progress}</span></button>
    <button className={page==='ideas'?'nav active':'nav'} onClick={()=>setPage('ideas')}><Glyph>✧</Glyph> ایده‌های محتوا <span className="nav-count">{counts.drafts}</span></button>
   </nav><div className="side-bottom"><div className="avatar">N</div><div><b>دستیار شخصی</b><small>نسخه محلی · آزمایشی</small></div><i className={online?'dot online':'dot'}/></div>
  </aside>
  <main className="main"><header className="topbar"><div>نکسوس <span className="muted">/</span> {page==='home'?'نمای کلی':page==='tasks'?'مدیریت وظایف':'ایده‌های محتوا'}</div><div className="top-right"><span className={online?'connection online':'connection'}><i/> {online?'اتصال محلی برقرار':'در انتظار اتصال'}</span><button className="icon-btn" onClick={()=>void refresh()} title="بروزرسانی">↻</button></div></header>
   <section className="welcome"><div><div className="eyebrow">— پنل کنترل شخصی شما</div><h1>{heading}</h1><p>{page==='home'?'تمرکز امروزت را مشخص کن؛ بقیه مسیر را قدم‌به‌قدم جلو می‌بریم.':page==='tasks'?'کارها را ثبت کن و روند پیشرفت را مدیریت کن.':'ایده‌ها را ثبت و برای بررسی آماده کن؛ انتشار خودکار فعال نیست.'}</p></div><div className="orbit"><div>✳</div></div></section>
   {error&&<div className="alert"><b>خطا</b><span>{error}</span><button onClick={()=>void refresh()}>تلاش مجدد</button></div>}{notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="بستن پیام">×</button></div>}
   <NeuralMap online={online}/>
   <section className="stats">
    <article className="stat"><div>وظایف باز <span className="stat-icon purple">◷</span></div><strong>{counts.open.toLocaleString('fa-IR')}</strong><small>نیازمند اقدام</small></article>
    <article className="stat"><div>در حال انجام <span className="stat-icon blue">↗</span></div><strong>{counts.progress.toLocaleString('fa-IR')}</strong><small>در جریان کار</small></article>
    <article className="stat"><div>تکمیل‌شده <span className="stat-icon green">✓</span></div><strong>{counts.done.toLocaleString('fa-IR')}</strong><small>وظایف به پایان رسیده</small></article>
    <article className="stat"><div>پیش‌نویس ایده‌ها <span className="stat-icon amber">✧</span></div><strong>{counts.drafts.toLocaleString('fa-IR')}</strong><small>آماده تکمیل و بررسی</small></article>
   </section>
   <section className="columns">
    <article className="panel"><div className="panel-head"><div><h2>وظایف اولویت‌دار</h2><p>مرتب‌شده بر اساس اولویت</p></div><button className="link" onClick={()=>setPage('tasks')}>مشاهده همه ↗</button></div>
     {page==='tasks'&&<div className="add-line"><button className="primary" onClick={()=>setTaskForm(v=>!v)}>＋ وظیفه جدید</button></div>}
     {(taskForm||editingTask)&&<form className="form" onSubmit={editingTask?saveEdit:submitTask}><label>عنوان وظیفه<input required maxLength={200} value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثلاً بررسی سناریوی ریلز"/></label><label>توضیحات<textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={5000}/></label><label>پروژه<select value={project} onChange={e=>setProject(e.target.value)}><option value="golddyousefi">گالری طلا یوسفی</option><option value="nexus">نکسوس</option><option value="personal">شخصی</option></select></label><div className="task-form-grid"><label>اهمیت<select value={importance} onChange={e=>setImportance(e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} از ۵</option>)}</select></label><label>فوریت<select value={urgency} onChange={e=>setUrgency(e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} از ۵</option>)}</select></label></div><label>مهلت انجام<input type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)}/></label><div className="form-actions"><button type="button" className="secondary" onClick={()=>{setTaskForm(false);setEditingTask(null)}}>انصراف</button><button className="primary">{editingTask?'ذخیره تغییرات':'ذخیره وظیفه'}</button></div></form>}
     <div className="rows">{taskRows.length===0?<div className="empty"><span>✓</span><b>هنوز وظیفه‌ای ثبت نشده</b><small>برای شروع، یک وظیفه جدید بساز.</small>{page!=='tasks'&&<button className="link" onClick={()=>{setPage('tasks');setTaskForm(true)}}>ساخت اولین وظیفه ↗</button>}</div>:taskRows.map(t=><div className="task-row" key={t.id}><button className={t.status==='completed'?'check checked':'check'} disabled={t.status==='completed'||t.status==='cancelled'} onClick={()=>void transition(t)} title="تغییر وضعیت">✓</button><div className="task-text"><b>{t.title}</b><small>{projectFa[t.project_key]??t.project_key} · {statusFa[t.status]}{t.due_at?' · مهلت '+new Date(t.due_at).toLocaleString('fa-IR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):''}</small></div><button type="button" className="task-edit" title="جزئیات و تاریخچه" aria-label={'جزئیات وظیفه '+t.title} onClick={()=>void openTaskDetails(t)}>ⓘ</button>{(t.status==='open'||t.status==='in_progress')&&<button type="button" className="task-edit" title="ویرایش وظیفه" onClick={()=>beginEdit(t)}>✎</button>}<span className={t.priority_score>=15?'priority high':'priority'}>{t.priority_score>=15?'اولویت بالا':'عادی'}</span><div className="task-feedback" aria-label="بازخورد درباره وظیفه"><button type="button" title="مفید بود" onClick={()=>void sendFeedback(t,'useful')}>👍</button><button type="button" title="مفید نبود" onClick={()=>void sendFeedback(t,'not_useful')}>👎</button><button type="button" title="نیاز به اصلاح دارد" onClick={()=>void sendFeedback(t,'needs_adjustment')}>↺</button></div></div>)}</div>{selectedTask&&<section className="task-details" aria-live="polite"><div className="task-details-head"><div><h3>جزئیات وظیفه</h3><b>{selectedTask.title}</b></div><button type="button" className="secondary" onClick={()=>{setSelectedTask(null);setAuditEvents([])}}>بستن</button></div><p>{selectedTask.description||'بدون توضیحات'}</p><div className="task-detail-grid"><span>پروژه<strong>{projectFa[selectedTask.project_key]??selectedTask.project_key}</strong></span><span>وضعیت<strong>{statusFa[selectedTask.status]??selectedTask.status}</strong></span><span>اهمیت<strong>{selectedTask.importance} از ۵</strong></span><span>فوریت<strong>{selectedTask.urgency} از ۵</strong></span><span>امتیاز اولویت<strong>{selectedTask.priority_score}</strong></span><span>مهلت<strong>{selectedTask.due_at?new Date(selectedTask.due_at).toLocaleString('fa-IR'):'تعیین نشده'}</strong></span><span>ایجاد<strong>{new Date(selectedTask.created_at).toLocaleString('fa-IR')}</strong></span><span>آخرین تغییر<strong>{new Date(selectedTask.updated_at).toLocaleString('fa-IR')}</strong></span></div><div className="audit-title"><h4>تاریخچه تغییرات</h4><small>آخرین ۲۰ رویداد ثبت‌شده</small></div>{auditLoading?<p className="audit-empty">در حال بارگذاری تاریخچه…</p>:auditEvents.length===0?<p className="audit-empty">رویدادی برای نمایش وجود ندارد.</p>:<ol className="audit-list">{auditEvents.map(ev=><li key={String(ev.id)}><span className="audit-dot"/><div className="audit-content"><b>{auditActionFa[ev.action]??ev.action}</b><time>{new Date(ev.occurred_at).toLocaleString('fa-IR')}</time><p>{Object.entries(auditFieldFa).filter(([key])=>Object.prototype.hasOwnProperty.call(ev.after_data,key)&&['status','title','importance','urgency','priority_score','due_at','project_key'].includes(key)).slice(0,5).map(([key,label])=>label+'؛ '+auditValue(key,ev.after_data[key])).join(' · ')}</p></div></li>)}</ol>}</section>}
    </article>
    <article className="panel"><div className="panel-head"><div><h2>ایده‌های محتوا</h2><p>برای برنامه‌ریزی و رشد پیج</p></div><button className="link" onClick={()=>setPage('ideas')}>مشاهده همه ↗</button></div>
     {page==='ideas'&&<div className="add-line"><button className="primary" onClick={()=>setIdeaForm(v=>!v)}>＋ ایده جدید</button></div>}
     {(ideaForm||editingIdea)&&<form className="form" onSubmit={editingIdea?saveIdeaEdit:submitIdea}><label>عنوان ایده<input required maxLength={160} value={ideaTitle} onChange={e=>setIdeaTitle(e.target.value)} placeholder="عنوان ایده محتوا"/></label><label>ایده و زاویه محتوا<textarea required maxLength={5000} value={concept} onChange={e=>setConcept(e.target.value)} placeholder="موضوع اصلی، مخاطب و دلیل جذابیت ایده"/></label><label>سناریو و متن اجرا<textarea maxLength={5000} value={ideaScript} onChange={e=>setIdeaScript(e.target.value)} placeholder="قلاب شروع، ترتیب نماها، متن گفتار و دعوت به اقدام"/></label><label>کپشن پیشنهادی<textarea maxLength={3000} value={ideaCaption} onChange={e=>setIdeaCaption(e.target.value)} placeholder="کپشن، دعوت به تعامل و هشتگ‌های پیشنهادی"/></label><label>هدف محتوا<select value={objective} onChange={e=>setObjective(e.target.value)}><option value="grow_followers">رشد فالوور واقعی</option><option value="increase_sales">افزایش فروش</option><option value="increase_engagement">افزایش تعامل</option><option value="educate">آموزش مخاطب</option></select></label><p className="idea-safety-note">یادآوری پیش از انتشار: وزن، عیار، قیمت، اجرت، تخفیف و هر ادعای حساس را با اطلاعات تأییدشده تطبیق بده. آمار یا مشخصات محصول را حدس نزن.</p><div className="form-actions"><button type="button" className="secondary" onClick={()=>{setIdeaForm(false);setEditingIdea(null)}}>انصراف</button><button className="primary">{editingIdea?'ذخیره تغییرات':'ثبت پیش‌نویس'}</button></div></form>}
     <div className="idea-rows">{ideaRows.length===0?<div className="empty"><span>✧</span><b>هنوز ایده‌ای ثبت نشده</b><small>ایده‌ها را اینجا مدیریت کن.</small>{page!=='ideas'&&<button className="link" onClick={()=>{setPage('ideas');setIdeaForm(true)}}>ثبت ایده جدید ↗</button>}</div>:ideaRows.map((i,n)=><div className="idea-row" key={i.id}><div className={'idea-no no-'+n%3}>{String(n+1).padStart(2,'0')}</div><div className="idea-text"><b>{i.title}</b><p>{ideaSummary(i.concept)}</p>{unpackIdeaConcept(i.concept).script&&<div className="idea-extra"><b>سناریو</b><p>{unpackIdeaConcept(i.concept).script}</p></div>}{unpackIdeaConcept(i.concept).caption&&<div className="idea-extra"><b>کپشن</b><p>{unpackIdeaConcept(i.concept).caption}</p></div>}<div className="idea-meta"><span className="tag">{objectiveFa[i.objective]??i.objective}</span><small className={'idea-status status-'+i.status}>{statusFa[i.status]??i.status}</small></div><div className="idea-pipeline" aria-label="مراحل آماده‌سازی محتوا"><span className={ideaSummary(i.concept).trim()?'idea-step complete':'idea-step'}>ایده</span><span className={unpackIdeaConcept(i.concept).script.trim()?'idea-step complete':'idea-step'}>سناریو</span><span className={unpackIdeaConcept(i.concept).caption.trim()?'idea-step complete':'idea-step'}>کپشن</span><span className={i.status==='in_review'?'idea-step complete':'idea-step'}>بررسی</span></div>{i.status==='draft'&&<div className={missingIdeaParts(i.title,unpackIdeaConcept(i.concept)).length?'idea-readiness incomplete':'idea-readiness ready'} role="status">{missingIdeaParts(i.title,unpackIdeaConcept(i.concept)).length?'باقی‌مانده برای بررسی: '+missingIdeaParts(i.title,unpackIdeaConcept(i.concept)).join('، '):'پیش‌نویس کامل است و می‌تواند برای بررسی ارسال شود.'}</div>}</div>{i.status==='draft'&&<div className="idea-actions"><button className="task-edit" title="ویرایش پیش‌نویس" onClick={()=>beginIdeaEdit(i)}>✎</button><button className="review" title="ارسال برای بررسی" onClick={()=>void review(i)}>↗</button></div>}</div>)}</div>
     <div className="panel-foot"><span>● ذخیره‌شده در دیتابیس محلی</span><span className="local-tag">بدون انتشار خودکار</span></div>
    </article>
   </section><footer className="footer"><span>NEXUS / دستیار شخصی شما</span><span>{loading?'در حال همگام‌سازی…':'نسخه آزمایشی محلی'}</span></footer>
  </main>
 </div>
}