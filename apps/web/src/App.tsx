import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type Task = { id:string; title:string; description:string; project_key:string; status:'open'|'in_progress'|'completed'|'cancelled'; priority_score:number };
type Idea = { id:string; title:string; concept:string; objective:string; status:string };
type Page = 'home'|'tasks'|'ideas';
const statusFa:Record<string,string>={open:'باز',in_progress:'در حال انجام',completed:'انجام‌شده',cancelled:'لغوشده',draft:'پیش‌نویس',in_review:'در انتظار بررسی',approved:'تأییدشده',archived:'بایگانی'};
const projectFa:Record<string,string>={personal:'شخصی',nexus:'نکسوس',golddyousefi:'گالری طلا یوسفی','bache-mahal':'پروژه قدیمی'};
const objectiveFa:Record<string,string>={grow_followers:'رشد فالوور واقعی',increase_sales:'افزایش فروش',increase_engagement:'افزایش تعامل',educate:'آموزش مخاطب'};
async function api<T>(url:string, options?:RequestInit):Promise<T>{
 const r=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options?.headers}});
 if(!r.ok){let msg='خطا در ارتباط با سرویس';try{const b=await r.json();msg=b.message??msg}catch{}throw new Error(Array.isArray(msg)?msg.join('، '):msg)}
 return r.json() as Promise<T>;
}
function Glyph({children}:{children:string}){return <span className="glyph" aria-hidden="true">{children}</span>}
export default function App(){
 const [page,setPage]=useState<Page>('home'),[tasks,setTasks]=useState<Task[]>([]),[ideas,setIdeas]=useState<Idea[]>([]);
 const [online,setOnline]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState('');
 const [taskForm,setTaskForm]=useState(false),[ideaForm,setIdeaForm]=useState(false);
 const [title,setTitle]=useState(''),[description,setDescription]=useState(''),[project,setProject]=useState('golddyousefi');
 const [ideaTitle,setIdeaTitle]=useState(''),[concept,setConcept]=useState(''),[objective,setObjective]=useState('grow_followers');
 const refresh=useCallback(async()=>{setLoading(true);setError('');try{const [t,i]=await Promise.all([api<Task[]>('/api/tasks'),api<Idea[]>('/api/content-ideas')]);setTasks(t);setIdeas(i);setOnline(true)}catch(e){setOnline(false);setError(e instanceof Error?e.message:'ارتباط برقرار نشد')}finally{setLoading(false)}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 const counts=useMemo(()=>({open:tasks.filter(x=>x.status==='open').length,progress:tasks.filter(x=>x.status==='in_progress').length,done:tasks.filter(x=>x.status==='completed').length,drafts:ideas.filter(x=>x.status==='draft').length}),[tasks,ideas]);
 async function submitTask(e:FormEvent){e.preventDefault();try{await api('/api/tasks',{method:'POST',body:JSON.stringify({title,description,project_key:project,importance:3,urgency:3,due_at:null})});setTitle('');setDescription('');setTaskForm(false);await refresh()}catch(x){setError(x instanceof Error?x.message:'ثبت وظیفه ناموفق بود')}}
 async function submitIdea(e:FormEvent){e.preventDefault();try{await api('/api/content-ideas',{method:'POST',body:JSON.stringify({title:ideaTitle,concept,objective})});setIdeaTitle('');setConcept('');setIdeaForm(false);await refresh()}catch(x){setError(x instanceof Error?x.message:'ثبت ایده ناموفق بود')}}
 async function transition(t:Task){const status=t.status==='open'?'in_progress':'completed';try{await api('/api/tasks/'+t.id+'/status',{method:'POST',body:JSON.stringify({status})});await refresh()}catch(x){setError(x instanceof Error?x.message:'تغییر وضعیت ناموفق بود')}}
 async function review(i:Idea){try{await api('/api/content-ideas/'+i.id+'/submit-for-review',{method:'POST'});await refresh()}catch(x){setError(x instanceof Error?x.message:'ارسال برای بررسی ناموفق بود')}}
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
   {error&&<div className="alert"><b>خطا</b><span>{error}</span><button onClick={()=>void refresh()}>تلاش مجدد</button></div>}
   <section className="stats">
    <article className="stat"><div>وظایف باز <span className="stat-icon purple">◷</span></div><strong>{counts.open.toLocaleString('fa-IR')}</strong><small>نیازمند اقدام</small></article>
    <article className="stat"><div>در حال انجام <span className="stat-icon blue">↗</span></div><strong>{counts.progress.toLocaleString('fa-IR')}</strong><small>در جریان کار</small></article>
    <article className="stat"><div>تکمیل‌شده <span className="stat-icon green">✓</span></div><strong>{counts.done.toLocaleString('fa-IR')}</strong><small>وظایف به پایان رسیده</small></article>
    <article className="stat"><div>پیش‌نویس ایده‌ها <span className="stat-icon amber">✧</span></div><strong>{counts.drafts.toLocaleString('fa-IR')}</strong><small>آماده تکمیل و بررسی</small></article>
   </section>
   <section className="columns">
    <article className="panel"><div className="panel-head"><div><h2>وظایف اولویت‌دار</h2><p>مرتب‌شده بر اساس اولویت</p></div><button className="link" onClick={()=>setPage('tasks')}>مشاهده همه ↗</button></div>
     {page==='tasks'&&<div className="add-line"><button className="primary" onClick={()=>setTaskForm(v=>!v)}>＋ وظیفه جدید</button></div>}
     {taskForm&&<form className="form" onSubmit={submitTask}><label>عنوان وظیفه<input required maxLength={200} value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثلاً بررسی سناریوی ریلز"/></label><label>توضیحات<textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={5000}/></label><label>پروژه<select value={project} onChange={e=>setProject(e.target.value)}><option value="golddyousefi">گالری طلا یوسفی</option><option value="nexus">نکسوس</option><option value="personal">شخصی</option></select></label><div className="form-actions"><button type="button" className="secondary" onClick={()=>setTaskForm(false)}>انصراف</button><button className="primary">ذخیره وظیفه</button></div></form>}
     <div className="rows">{taskRows.length===0?<div className="empty"><span>✓</span><b>هنوز وظیفه‌ای ثبت نشده</b><small>برای شروع، یک وظیفه جدید بساز.</small>{page!=='tasks'&&<button className="link" onClick={()=>{setPage('tasks');setTaskForm(true)}}>ساخت اولین وظیفه ↗</button>}</div>:taskRows.map(t=><div className="task-row" key={t.id}><button className={t.status==='completed'?'check checked':'check'} disabled={t.status==='completed'||t.status==='cancelled'} onClick={()=>void transition(t)} title="تغییر وضعیت">✓</button><div className="task-text"><b>{t.title}</b><small>{projectFa[t.project_key]??t.project_key} · {statusFa[t.status]}</small></div><span className={t.priority_score>=15?'priority high':'priority'}>{t.priority_score>=15?'اولویت بالا':'عادی'}</span></div>)}</div>
    </article>
    <article className="panel"><div className="panel-head"><div><h2>ایده‌های محتوا</h2><p>برای برنامه‌ریزی و رشد پیج</p></div><button className="link" onClick={()=>setPage('ideas')}>مشاهده همه ↗</button></div>
     {page==='ideas'&&<div className="add-line"><button className="primary" onClick={()=>setIdeaForm(v=>!v)}>＋ ایده جدید</button></div>}
     {ideaForm&&<form className="form" onSubmit={submitIdea}><label>عنوان ایده<input required maxLength={160} value={ideaTitle} onChange={e=>setIdeaTitle(e.target.value)} placeholder="عنوان ایده محتوا"/></label><label>شرح ایده<textarea required maxLength={5000} value={concept} onChange={e=>setConcept(e.target.value)} placeholder="سناریو یا توضیح ایده"/></label><label>هدف محتوا<select value={objective} onChange={e=>setObjective(e.target.value)}><option value="grow_followers">رشد فالوور واقعی</option><option value="increase_sales">افزایش فروش</option><option value="increase_engagement">افزایش تعامل</option><option value="educate">آموزش مخاطب</option></select></label><div className="form-actions"><button type="button" className="secondary" onClick={()=>setIdeaForm(false)}>انصراف</button><button className="primary">ثبت پیش‌نویس</button></div></form>}
     <div className="idea-rows">{ideaRows.length===0?<div className="empty"><span>✧</span><b>هنوز ایده‌ای ثبت نشده</b><small>ایده‌ها را اینجا مدیریت کن.</small>{page!=='ideas'&&<button className="link" onClick={()=>{setPage('ideas');setIdeaForm(true)}}>ثبت ایده جدید ↗</button>}</div>:ideaRows.map((i,n)=><div className="idea-row" key={i.id}><div className={'idea-no no-'+n%3}>{String(n+1).padStart(2,'0')}</div><div className="idea-text"><b>{i.title}</b><p>{i.concept}</p><div><span className="tag">{objectiveFa[i.objective]??i.objective}</span><small>{statusFa[i.status]??i.status}</small></div></div>{i.status==='draft'&&<button className="review" title="ارسال برای بررسی" onClick={()=>void review(i)}>↗</button>}</div>)}</div>
     <div className="panel-foot"><span>● ذخیره‌شده در دیتابیس محلی</span><span className="local-tag">بدون انتشار خودکار</span></div>
    </article>
   </section><footer className="footer"><span>NEXUS / دستیار شخصی شما</span><span>{loading?'در حال همگام‌سازی…':'نسخه آزمایشی محلی'}</span></footer>
  </main>
 </div>
}