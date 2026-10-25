import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type Task = { id:string; title:string; description:string; project_key:string; status:'open'|'in_progress'|'completed'|'cancelled'; priority_score:number; importance:number; urgency:number; due_at:string|null; created_at:string; updated_at:string; completed_at:string|null };
type Idea = { id:string; title:string; concept:string; objective:string; status:string };
type AuditEvent = { id:string|number; entity_type:string; entity_id:string; action:'created'|'updated'|'status_changed'|string; actor:string; source:string; before_data:Record<string,unknown>|null; after_data:Record<string,unknown>; occurred_at:string };
type Page = 'home'|'tasks'|'ideas'|'assistant'|'feedback'|'connections'|'memory'|'settings'|'analytics';
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
function NeuralMap({online,onNavigate}:{online:boolean;onNavigate:(page:Page)=>void}) {
 const nodes = [
  {title:'عامل‌ها',sub:'هماهنگی دستیارها',tone:'violet',pos:'n1',icon:'♧',page:'assistant' as Page,active:false},
  {title:'وظایف',sub:'برنامه و پیگیری',tone:'teal',pos:'n2',icon:'☷',page:'tasks' as Page,active:true},
  {title:'ایده‌های محتوا',sub:'سناریو و تقویم',tone:'cyan',pos:'n3',icon:'✧',page:'ideas' as Page,active:true},
  {title:'گالری طلا یوسفی',sub:'مدیریت کسب‌وکار',tone:'amber',pos:'n4',icon:'◇',page:'connections' as Page,active:false},
  {title:'اینستاگرام',sub:'محتوا و انتشار',tone:'pink',pos:'n5',icon:'◎',page:'ideas' as Page,active:false},
  {title:'خودکارسازی',sub:'گردش‌کارهای n8n',tone:'blue',pos:'n6',icon:'⌘',page:'connections' as Page,active:false},
  {title:'حافظه',sub:'دانش و سوابق',tone:'cyan',pos:'n7',icon:'≋',page:'memory' as Page,active:false},
  {title:'تحلیل و گزارش',sub:'عملکرد و آمار',tone:'violet',pos:'n8',icon:'⌁',page:'analytics' as Page,active:false}
 ];
 const fibers = [
  'M500 280 C438 244 410 193 355 164 S278 127 214 93',
  'M500 280 C495 222 500 165 500 92 S500 63 500 39',
  'M500 280 C562 243 594 196 653 162 S730 124 790 91',
  'M500 280 C424 280 348 280 267 280 S184 280 112 280',
  'M500 280 C580 280 655 280 736 280 S815 280 888 280',
  'M500 280 C434 322 407 369 348 405 S274 444 214 472',
  'M500 280 C502 345 500 397 500 453 S500 491 500 520',
  'M500 280 C564 321 597 368 653 402 S730 444 790 472'
 ];
 const branches = [
  'M356 164 C335 148 335 126 314 111','M355 164 C379 145 381 122 402 108',
  'M500 154 C477 136 471 118 457 105','M500 154 C521 134 531 115 546 101',
  'M654 162 C630 142 625 120 609 107','M654 162 C679 143 691 124 713 113',
  'M267 280 C244 258 220 256 197 244','M267 280 C242 300 221 309 195 315',
  'M736 280 C760 258 783 252 807 239','M736 280 C759 300 786 309 811 319',
  'M348 405 C323 387 300 385 277 370','M348 405 C326 428 304 440 281 445',
  'M500 453 C478 433 473 414 459 399','M500 453 C521 433 530 414 545 400',
  'M653 402 C630 383 610 381 589 366','M653 402 C675 423 697 438 721 445'
 ];
 return <section className="neural-section" aria-label="هسته عصبی نکسوس">
  <div className="neural-map">
   <div className="neural-topline"><span className="eyebrow">PERSONAL INTELLIGENCE SYSTEM</span><span className="neural-status"><i className={online?'connected':''}/>{online?'هسته محلی فعال':'در انتظار اتصال'}</span></div>
   <svg className="neural-wires" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
     <radialGradient id="nexusAura"><stop offset="0" stopColor="#a6f4ff" stopOpacity=".16"/><stop offset=".45" stopColor="#258dbb" stopOpacity=".08"/><stop offset="1" stopColor="#07101d" stopOpacity="0"/></radialGradient>
     <linearGradient id="fiberGlow"><stop offset="0" stopColor="#245e8a" stopOpacity=".05"/><stop offset=".5" stopColor="#75dce9" stopOpacity=".72"/><stop offset="1" stopColor="#4c83d7" stopOpacity=".1"/></linearGradient>
     <filter id="softGlow"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>
    <circle cx="500" cy="280" r="245" fill="url(#nexusAura)"/>
    {fibers.map((d,i)=><g key={'f'+i}><path d={d} className="fiber-under"/><path d={d} className={'fiber fiber-'+i}/><path d={d} className={'fiber-signal signal-'+i}/></g>)}
    {branches.map((d,i)=><g key={'b'+i}><path d={d} className="branch"/><circle cx={[314,402,457,546,609,713,197,195,807,811,277,281,459,545,589,721][i]} cy={[111,108,105,101,107,113,244,315,239,319,370,445,399,400,366,445][i]} r="2" className="synapse"/></g>)}
    {Array.from({length:90},(_,i)=><circle key={'p'+i} cx={35+(i*137)%930} cy={18+(i*83)%520} r={i%7===0?1.5:.7} className="dust"/>)}
   </svg>
   <div className="neural-core" aria-label="هسته عصبی نکسوس">
    <svg className="core-neural-field" viewBox="0 0 420 300" aria-hidden="true">
     <defs>
      <radialGradient id="coreFieldGlow"><stop offset="0" stopColor="#163f79" stopOpacity=".12"/><stop offset=".7" stopColor="#102b58" stopOpacity=".05"/><stop offset="1" stopColor="#07101d" stopOpacity="0"/></radialGradient>
      <filter id="coreFiberGlow"><feGaussianBlur stdDeviation="2.6"/></filter>
     </defs>
     {Array.from({length:86},(_,i)=>{const angle=(i*137.508)*Math.PI/180;const reach=95+((i*47)%105);const sx=210+Math.cos(angle)*7;const sy=150+Math.sin(angle)*6;const ex=210+Math.cos(angle)*reach*1.85;const ey=150+Math.sin(angle)*reach*1.25;const bend=((i*29)%56)-28;const mx=210+Math.cos(angle+.22)*reach*.58;const my=150+Math.sin(angle+.22)*reach*.56;const d=`M ${sx} ${sy} C ${mx+bend} ${my-bend*.35}, ${mx-bend*.4} ${my+bend}, ${ex} ${ey}`;return <g key={'axon'+i}><path d={d} className={'core-axon axon-'+(i%4)}/><path d={d} className="core-axon-signal"/>{[.42,.67].map((t,j)=>{const bx=sx+(ex-sx)*t+Math.sin(i+j)*9;const by=sy+(ey-sy)*t+Math.cos(i-j)*8;const side=j===0?-1:1;return <path key={j} d={`M ${bx} ${by} C ${bx+Math.cos(angle+side*.8)*13} ${by+Math.sin(angle+side*.8)*13}, ${bx+Math.cos(angle+side*1.1)*25} ${by+Math.sin(angle+side*1.1)*20}, ${bx+Math.cos(angle+side*1.2)*39} ${by+Math.sin(angle+side*1.2)*27}`} className={'core-axon axon-'+((i+j+1)%4)}/>})}</g>})}
     {Array.from({length:112},(_,i)=>{const angle=i*2.39996;const radius=12+((i*37)%135);return <circle key={'core-synapse'+i} cx={210+Math.cos(angle)*radius*1.4} cy={150+Math.sin(angle)*radius} r={i%8===0?1.8:.75} className="core-synapse"/>})}
    </svg>
    <div className="core-title"><span className="core-mark">✳</span><b>NEXUS</b><small>NEURAL CORE</small><span className={online?'core-dot':'core-dot offline'}/></div>
   </div>
   {nodes.map(n=><button type="button" className={'neural-node '+n.pos+' '+n.tone} key={n.pos} onClick={()=>onNavigate(n.page)} aria-label={'ورود به '+n.title}>
    <span className="node-orb"><span className="node-icon">{n.icon}</span><i className="node-halo"/></span><b>{n.title}</b><small>{n.sub}</small><span className={'node-state '+(n.active?'node-active':'node-planned')}><i/>{n.active?(online?'متصل به هسته':'ماژول محلی'):'در حال توسعه'}</span>
   </button>)}
   <div className="neural-bottomline"><span>LOCAL-FIRST · PRIVATE BY DESIGN</span><span>۸ مسیر · ۲ ماژول متصل</span></div>
  </div>
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
 const pageTitles:Record<Page,string>={home:'هسته عصبی نکسوس',tasks:'مدیریت وظایف',ideas:'ایده‌های محتوا',assistant:'دستیار هوشمند',feedback:'بازخوردها',connections:'ارتباطات و اتصال‌ها',memory:'حافظه نکسوس',settings:'تنظیمات سیستم',analytics:'تحلیل و گزارش'};
 const heading=page==='home'?'صبح بخیر، آماده‌ای؟':pageTitles[page];
 const pageDescription:Record<Page,string>={home:'',tasks:'کارها را ثبت کن و روند پیشرفت را مدیریت کن.',ideas:'ایده‌ها را ثبت و برای بررسی آماده کن؛ انتشار خودکار فعال نیست.',assistant:'فضای گفت‌وگو با دستیار هوشمند در مراحل بعدی تکمیل می‌شود.',feedback:'بازخوردها و یادگیری از نتایج در این بخش قرار می‌گیرد.',connections:'اتصال سرویس‌ها و ابزارها از این بخش مدیریت خواهد شد.',memory:'مدیریت حافظه و اطلاعات ذخیره‌شده نکسوس در این بخش قرار می‌گیرد.',settings:'تنظیمات و کنترل‌های امنیتی نکسوس در این بخش قرار می‌گیرد.',analytics:'گزارش‌ها و تحلیل عملکرد در این بخش قرار می‌گیرد.'};
 return <div className={'shell '+(page==='home'?'shell-home':'')}>
  <aside className="sidebar"><div className="brand"><div className="brand-mark"><Glyph>✳</Glyph></div><div><b>NEXUS</b><small>PERSONAL INTELLIGENCE</small></div></div>
   <p className="side-label">فضای کاری</p><nav>
    <button className={page==='home'?'nav active':'nav'} onClick={()=>setPage('home')}><Glyph>⌂</Glyph> نمای کلی</button>
    <button className={page==='tasks'?'nav active':'nav'} onClick={()=>setPage('tasks')}><Glyph>✓</Glyph> مدیریت وظایف <span className="nav-count">{counts.open+counts.progress}</span></button>
    <button className={page==='ideas'?'nav active':'nav'} onClick={()=>setPage('ideas')}><Glyph>✧</Glyph> ایده‌های محتوا <span className="nav-count">{counts.drafts}</span></button>
   </nav><div className="side-bottom"><div className="avatar">N</div><div><b>دستیار شخصی</b><small>نسخه محلی · آزمایشی</small></div><i className={online?'dot online':'dot'}/></div>
  </aside>
  <main className="main"><header className="topbar"><div>نکسوس <span className="muted">/</span> {pageTitles[page]}</div><div className="top-right"><span className={online?'connection online':'connection'}><i/> {online?'اتصال محلی برقرار':'در انتظار اتصال'}</span><button className="icon-btn" onClick={()=>void refresh()} title="بروزرسانی">↻</button></div></header>
   <section className="welcome"><div><div className="eyebrow">— پنل کنترل شخصی شما</div><h1>{heading}</h1><p>{pageDescription[page]}</p></div><div className="orbit"><div>✳</div></div></section>
   {error&&<div className="alert"><b>خطا</b><span>{error}</span><button onClick={()=>void refresh()}>تلاش مجدد</button></div>}{notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="بستن پیام">×</button></div>}
   {page==='home'&&<NeuralMap online={online} onNavigate={setPage}/>}
   {(page==='tasks'||page==='ideas')&&<>
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
   </section>
   </>}
   {(['assistant','feedback','connections','memory','settings','analytics'] as Page[]).includes(page)&&<section className="module-placeholder"><div className="module-symbol">✳</div><h1>{pageTitles[page]}</h1><p>{pageDescription[page]}</p><span>این بخش هنوز به قابلیت واقعی متصل نشده است.</span><button className="primary" onClick={()=>setPage('home')}>بازگشت به هسته عصبی</button></section>}
   <footer className="footer"><span>NEXUS / دستیار شخصی شما</span><span>{loading?'در حال همگام‌سازی…':'نسخه آزمایشی محلی'}</span></footer>
  </main>
 </div>
}