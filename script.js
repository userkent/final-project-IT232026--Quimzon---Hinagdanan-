const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let S={theme:'system',size:16,lang:'All',name:'Learner',hist:[],done:[]};
try{Object.assign(S,JSON.parse(localStorage.getItem('cdknow')||'{}'))}catch(e){}
S.done=S.done.filter(x=>typeof x==='string');
const save=()=>{try{localStorage.setItem('cdknow',JSON.stringify(S))}catch(e){}};
function apply(){const r=document.documentElement;S.theme==='system'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',S.theme);r.style.fontSize=S.size+'px'}
const log=(type,txt)=>{S.hist.unshift({t:Date.now(),type,txt});S.hist=S.hist.slice(0,40);save()};
const LANGS=['JavaScript','Python','HTML','CSS'],LV=['Beginner','Intermediate'];
const LIB=[
['JavaScript','Beginner','Variables: let and const','Use const for values that never change and let for values that do.','const school = "CDKNOW";\nlet score = 0;\nscore = score + 10;'],
['JavaScript','Beginner','Arrow functions','A short way to write a function.','const double = n => n * 2;\nconsole.log(double(4)); // 8'],
['JavaScript','Intermediate','Array.map()','Builds a new array by changing every item.','[1,2,3].map(n => n * n);\n// [1, 4, 9]'],
['Python','Beginner','Lists and loops','Store many values and visit each one.','fruits = ["apple", "mango"]\nfor f in fruits:\n    print(f)'],
['Python','Beginner','Functions with def','Group code you want to reuse.','def greet(name):\n    return "Hi, " + name'],
['Python','Intermediate','Dictionaries','Store data as key and value pairs.','user = {"name": "Kent", "age": 20}\nprint(user["name"])'],
['HTML','Beginner','Semantic layout','Use tags that describe the content.','<header>...</header>\n<main>...</main>\n<footer>...</footer>'],
['HTML','Intermediate','Forms','Collect input from the user.','<form>\n  <label>Email <input type="email"></label>\n  <button>Send</button>\n</form>'],
['CSS','Beginner','Flexbox','Line up items in a row or column.','.row {\n  display: flex;\n  gap: 1rem;\n}'],
['CSS','Intermediate','Grid','Make two-dimensional layouts.','.cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}']];
const CH=[
{id:'js1',lang:'JavaScript',lv:'Beginner',t:'Add two numbers',d:'Write a function add(a, b) that returns the sum of a and b.',s:'function add(a, b) {\n  // your code here\n}',sol:'function add(a, b) {\n  return a + b;\n}',fn:'add',tests:[[[2,3],5],[[-1,1],0],[[10,5],15]]},
{id:'js2',lang:'JavaScript',lv:'Beginner',t:'Even or odd',d:'Write isEven(n) that returns true when n is even and false when it is odd.',s:'function isEven(n) {\n  \n}',sol:'function isEven(n) {\n  return n % 2 === 0;\n}',fn:'isEven',tests:[[[4],true],[[7],false],[[0],true]]},
{id:'js3',lang:'JavaScript',lv:'Intermediate',t:'Reverse a string',d:'Write reverse(text) that returns the text backwards.',s:'function reverse(text) {\n  \n}',sol:'function reverse(text) {\n  return text.split("").reverse().join("");\n}',fn:'reverse',tests:[[['code'],'edoc'],[['a'],'a']]},
{id:'js4',lang:'JavaScript',lv:'Intermediate',t:'Sum of an array',d:'Write sumArray(nums) that returns the total of all numbers in the array.',s:'function sumArray(nums) {\n  \n}',sol:'function sumArray(nums) {\n  return nums.reduce((t, n) => t + n, 0);\n}',fn:'sumArray',tests:[[[[1,2,3]],6],[[[]],0]]},
{id:'py1',lang:'Python',lv:'Beginner',t:'Say hello',d:'Print exactly: Hello, CDKNOW',s:'# write your code below\n',sol:'print("Hello, CDKNOW")',pat:[[/print\s*\(\s*["']Hello, CDKNOW["']\s*\)/,'Use print() with the text Hello, CDKNOW']]},
{id:'py2',lang:'Python',lv:'Intermediate',t:'Square a number',d:'Define a function square(n) that returns n multiplied by itself.',s:'def square(n):\n    \n',sol:'def square(n):\n    return n * n',pat:[[/def\s+square\s*\(\s*n\s*\)\s*:/,'Define def square(n):'],[/return\s+(n\s*\*\s*n|n\s*\*\*\s*2)/,'Return n * n']]},
{id:'html1',lang:'HTML',lv:'Beginner',t:'Heading and link',d:'Add an h1 heading with text, and an a link that has an href.',s:'<!-- Add a heading and a link -->\n',sol:'<h1>Hello CDKNOW</h1>\n<a href="https://example.com">Visit</a>',pv:1,pat:[[/<h1[^>]*>[^<]+<\/h1>/i,'Add an <h1> heading with text'],[/<a\s[^>]*href=["'][^"']+["']/i,'Add an <a> link with an href']]},
{id:'css1',lang:'CSS',lv:'Beginner',t:'Style a box',d:'Style the .box with a background color, padding and rounded corners.',s:'<style>\n.box {\n  \n}\n</style>\n<div class="box">I am a box</div>',sol:'<style>\n.box {\n  background: gold;\n  padding: 20px;\n  border-radius: 12px;\n}\n</style>\n<div class="box">I am a box</div>',pv:1,pat:[[/\.box\s*\{[^}]*background/i,'Set a background'],[/\.box\s*\{[^}]*padding/i,'Set padding'],[/\.box\s*\{[^}]*border-radius/i,'Set border-radius']]},
{id:'pjs',lang:'JavaScript',lv:'Free play',t:'JavaScript playground',d:'Experiment freely. Use console.log() to see output.',s:'console.log("Hello, CDKNOW!");\n\nfor (let i = 1; i <= 3; i++) {\n  console.log("Count: " + i);\n}',free:1},
{id:'phtml',lang:'HTML',lv:'Free play',t:'HTML and CSS playground',d:'Experiment freely. Press Run to update the live preview.',s:'<h1>My playground</h1>\n<p>Edit me and press Run.</p>\n<style>\n  h1 { color: royalblue; }\n</style>',free:1,pv:1}];
const QB=[
['JavaScript','Beginner','Which symbol starts a single-line comment in JavaScript?',['//','#','<!--','**'],0],
['JavaScript','Beginner','What does console.log() do?',['Prints to the console','Saves a file','Creates a variable','Reloads the page'],0],
['JavaScript','Intermediate','What does [1,2,3].length return?',['2','3','4','undefined'],1],
['JavaScript','Intermediate','Which method turns a JSON string into an object?',['JSON.parse()','JSON.stringify()','Object.new()','String.json()'],0],
['Python','Beginner','How do you start a comment in Python?',['//','#','/*','--'],1],
['Python','Beginner','Which of these is a Python list?',['{1, 2}','(1, 2)','[1, 2]','<1, 2>'],2],
['Python','Intermediate','What does len("code") return?',['3','4','5','Error'],1],
['Python','Intermediate','Which keyword handles errors?',['catch','except','rescue','handle'],1],
['HTML','Beginner','Which tag creates a link?',['<link>','<a>','<href>','<url>'],1],
['HTML','Beginner','Which tag holds the main page title shown in the browser tab?',['<h1>','<head>','<title>','<top>'],2],
['HTML','Intermediate','Which attribute gives an image alternative text?',['title','alt','src','name'],1],
['HTML','Intermediate','Which tag is best for site navigation links?',['<nav>','<menu>','<div>','<section>'],0],
['CSS','Beginner','Which property sets the background color?',['bgcolor','background-color','color-bg','fill'],1],
['CSS','Beginner','Which selector targets a class named card?',['#card','card','.card','*card'],2],
['CSS','Intermediate','What does position: sticky do?',['Fixes the element forever','Sticks it while scrolling in its container','Hides it','Floats it right'],1],
['CSS','Intermediate','Which unit is relative to the root font size?',['px','em','rem','pt'],2]];
let P=null,PC={},Q=null,QS={lang:'JavaScript',level:'Beginner'},LF={q:'',lang:S.lang,lv:'All'};
const chips=(arr,cur,key)=>arr.map(v=>`<button class="chip${v===cur?' on':''}" data-act="${key}" data-v="${v}" aria-pressed="${v===cur}">${v}</button>`).join('');
const ago=t=>new Date(t).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});

const V={
home(){const q=S.hist.filter(h=>h.type==='Quiz').length;return`
<section class="hero"><div><h1>Learn it. Try it. <span class="hl">Know it.</span></h1>
<p>One place to read coding references, solve short exercises and take quizzes in JavaScript, Python, HTML and CSS. No sign-up needed.</p>
<div class="cta"><a class="btn p" href="#library">Start learning</a><a class="btn" href="#quiz">Take a quiz</a></div></div>
<div class="win" aria-hidden="true"><div class="tb"><i></i><i></i><i></i><span>hello.js</span></div><pre id="type"></pre></div></section>
<div class="stats"><div class="card"><strong>${LIB.length}</strong><span>reference guides</span></div><div class="card"><strong>${CH.length}</strong><span>coding challenges</span></div><div class="card"><strong>${QB.length}</strong><span>quiz questions</span></div><div class="card"><strong>${q}</strong><span>quizzes you finished</span></div></div>
<h2>What you can do here</h2><div class="grid">
<a class="card feat" href="#library"><span class="ico">📚</span><h3>Coding Library</h3><p>Short guides with working examples.</p></a>
<a class="card feat" href="#practice"><span class="ico">✍️</span><h3>Coding Area</h3><p>Write real code, run it and check your answer.</p></a>
<a class="card feat" href="#quiz"><span class="ico">🎯</span><h3>Quizzes</h3><p>Pick a language and difficulty level.</p></a>
<a class="card feat" href="#profile"><span class="ico">📈</span><h3>Your progress</h3><p>See your scores and activity history.</p></a></div>`},
library(){const l=LIB.filter(x=>(LF.lang==='All'||x[0]===LF.lang)&&(LF.lv==='All'||x[1]===LF.lv)&&(x[2]+x[3]+x[0]).toLowerCase().includes(LF.q.toLowerCase()));
return`<h2>Coding Library</h2><div class="tools"><input type="search" id="q" placeholder="Search topics, e.g. loops" value="${esc(LF.q)}" aria-label="Search library"><select id="lv" aria-label="Level">${['All',...LV].map(v=>`<option${v===LF.lv?' selected':''}>${v}</option>`).join('')}</select></div>
<div class="tools">${chips(['All',...LANGS],LF.lang,'lib')}</div><div class="grid" id="libres">${libCards(l)}</div>`},
practice(){const l=CH.filter(c=>S.lang==='All'||c.lang===S.lang);if(!l.find(x=>x.id===P))P=l[0].id;const c=CH.find(x=>x.id===P),code=PC[c.id]??c.s;
return`<h2>Practice Coding Area</h2><p style="color:var(--mute)">Write code, run it, then check your answer. Solved ${CH.filter(x=>S.done.includes(x.id)).length} of ${CH.length}.</p><div class="tools">${chips(['All',...LANGS],S.lang,'plang')}</div>
<div class="lab"><div class="clist">${l.map(x=>`<button class="ci${x.id===P?' on':''}" data-act="pick" data-v="${x.id}"><b>${esc(x.t)}</b>${S.done.includes(x.id)?' ✓':''}<br><span class="tag l">${x.lang}</span><span class="tag">${x.lv}</span></button>`).join('')}</div>
<div class="card"><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p><textarea class="ed" id="ed" spellcheck="false" aria-label="Code editor">${esc(code)}</textarea>
<small style="color:var(--mute)">Tab inserts spaces. Press Esc, then Tab, to leave the editor.</small>
<div class="row" style="margin-top:.8rem"><button class="btn p s" data-act="run">▶ Run</button>${c.free?'':'<button class="btn s" data-act="check">Check answer</button><button class="btn s" data-act="sol">Show solution</button>'}<button class="btn s" data-act="rst">Reset</button></div>
${c.pv?`<iframe class="prev" id="pv" sandbox="" title="Live preview" srcdoc="${esc(code)}"></iframe>`:''}<pre class="out" id="out" role="status">Output appears here.</pre></div></div>`},
quiz(){if(!Q)return`<h2>Quiz</h2><div class="card" style="max-width:560px"><h3>Language</h3><div class="tools">${chips(LANGS,QS.lang,'ql')}</div><h3>Difficulty</h3><div class="tools">${chips(LV,QS.level,'qv')}</div><button class="btn p" data-act="qstart">Start quiz</button></div>`;
if(Q.i>=Q.list.length){const pct=Math.round(Q.score/Q.list.length*100);return`<div class="card" style="max-width:560px;text-align:center"><p>${Q.lang} · ${Q.level}</p><div class="big">${pct}%</div><p>You got ${Q.score} of ${Q.list.length} correct. ${pct>=80?'Great work!':pct>=50?'Good start, review the library and try again.':'Read the library guides, then retry.'}</p><div class="row" style="justify-content:center"><button class="btn p" data-act="qstart">Try again</button><button class="btn" data-act="qnew">Change quiz</button></div></div>`}
const q=Q.list[Q.i];return`<h2>${Q.lang} quiz <span class="tag">${Q.level}</span></h2><div class="card" style="max-width:640px"><small>Question ${Q.i+1} of ${Q.list.length}</small><div class="prog"><div style="width:${Q.i/Q.list.length*100}%"></div></div><h3>${esc(q[2])}</h3>
${q[3].map((o,k)=>`<button class="opt" data-act="ans" data-v="${k}">${esc(o)}</button>`).join('')}<p class="fb" id="qf" role="status"></p></div>`},
profile(){const qs=S.hist.filter(h=>h.type==='Quiz');return`<h2>Profile</h2><div class="card" style="margin-bottom:1rem"><label for="nm">Display name</label><div class="row"><input type="text" id="nm" value="${esc(S.name)}" maxlength="24"><button class="btn s" data-act="name">Save</button></div></div>
<div class="stats"><div class="card"><strong>${qs.length}</strong><span>quizzes taken</span></div><div class="card"><strong>${qs.length?Math.max(...qs.map(h=>h.pct))+'%':'–'}</strong><span>best score</span></div><div class="card"><strong>${CH.filter(x=>S.done.includes(x.id)).length}/${CH.length}</strong><span>challenges solved</span></div></div>
<h3>Activity history</h3><div class="card">${S.hist.length?`<ul class="h">${S.hist.map(h=>`<li><span><span class="tag l">${h.type}</span> ${esc(h.txt)}</span><small>${ago(h.t)}</small></li>`).join('')}</ul>`:'<p class="empty">Nothing yet. Try a <a href="#quiz">quiz</a> or a <a href="#practice">practice exercise</a>.</p>'}</div>`},
settings(){return`<h2>Settings</h2><div class="card" style="max-width:640px">
<div class="set"><span>Theme</span><div class="tools" style="margin:0">${['system','light','dark'].map(v=>`<button class="chip${S.theme===v?' on':''}" data-act="theme" data-v="${v}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div></div>
<div class="set"><span>Text size</span><div class="tools" style="margin:0">${[[14,'Small'],[16,'Medium'],[19,'Large']].map(([n,t])=>`<button class="chip${S.size===n?' on':''}" data-act="size" data-v="${n}">${t}</button>`).join('')}</div></div>
<div class="set"><label for="fl">Favorite language</label><select id="fl">${['All',...LANGS].map(v=>`<option${v===S.lang?' selected':''}>${v}</option>`).join('')}</select></div>
<div class="set"><span>Reset all progress and settings</span><button class="btn s" data-act="reset">Reset</button></div></div>`}};
function libCards(l){return l.length?l.map(x=>`<details class="card"><summary>${x[2]}<br><span class="tag l">${x[0]}</span><span class="tag">${x[1]}</span></summary><p>${x[3]}</p><pre class="c">${esc(x[4])}</pre></details>`).join(''):'<p class="empty">No topics match. Try a different word or clear the filters.</p>'}

const keep=()=>{const e=$('#ed');if(e&&P)PC[P]=e.value};
const out=(t,ok)=>{const o=$('#out');o.textContent=t;o.className='out'+(ok===true?' ok':ok===false?' bad':'')};
function execJS(code,extra=''){const logs=[],con={log:(...a)=>logs.push(a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' '))};
try{return{logs,err:null,ret:new Function('console',code+extra)(con)}}catch(e){return{logs,err:e.message,ret:null}}}
function runCode(){const c=CH.find(x=>x.id===P),code=$('#ed').value;keep();
if(c.pv){$('#pv').srcdoc=code;out('Preview updated.');return}
if(c.lang==='Python'){out('Python can’t run in the browser here. Press Check answer to see if your code meets the task.');return}
const r=execJS(code);out(r.logs.join('\n')+(r.err?'\nError: '+r.err:'')||'Ran with no output. Use console.log() to print something.',r.err?false:null)}
function checkCode(){const c=CH.find(x=>x.id===P),code=$('#ed').value;keep();let ok=false,msg='';
if(c.tests){const r=execJS(code,`\n;return typeof ${c.fn}==="function"?${c.fn}:null`);
if(r.err)msg='Error: '+r.err;else if(!r.ret)msg='Define a function named '+c.fn+'.';
else{const res=c.tests.map(([a,e])=>{try{const g=r.ret(...a);return{ok:JSON.stringify(g)===JSON.stringify(e),a,e,g}}catch(x){return{ok:false,a,e,g:x.message}}});ok=res.every(x=>x.ok);
msg=res.map(x=>(x.ok?'✓ ':'✗ ')+c.fn+'('+x.a.map(v=>JSON.stringify(v)).join(', ')+') should give '+JSON.stringify(x.e)+(x.ok?'':', got '+JSON.stringify(x.g))).join('\n')}}
else{ok=c.pat.every(p=>p[0].test(code));msg=c.pat.map(p=>(p[0].test(code)?'✓ ':'✗ ')+p[1]).join('\n')}
if(c.pv)$('#pv').srcdoc=code;
if(ok){msg+='\n\nSolved! 🎉';if(!S.done.includes(c.id)){S.done.push(c.id);log('Practice','Solved: '+c.t);save()}}else msg+='\n\nNot there yet. Fix the ✗ items and check again.';
out(msg,ok)}
let tm;function typer(){const el=$('#type');if(!el)return;const t='// Welcome to CDKNOW\nconst goal = "learn to code";\n\nfunction study(topic) {\n  return `Practice ${topic}`;\n}\n\nconsole.log(study(goal));';
if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=t;return}
let i=0;clearInterval(tm);tm=setInterval(()=>{if(!document.body.contains(el)){clearInterval(tm);return}el.innerHTML=esc(t.slice(0,++i))+'<span class="cur"></span>';if(i>=t.length)clearInterval(tm)},45)}
function route(){const p=(location.hash||'#home').slice(1),n=V[p]?p:'home';const a=$('#app');a.className='view';a.innerHTML=V[n]();void a.offsetWidth;
document.querySelectorAll('#nav a').forEach(x=>{const on=x.getAttribute('href')==='#'+n;x.classList.toggle('on',on);on?x.setAttribute('aria-current','page'):x.removeAttribute('aria-current')});
if(n==='home')typer();scrollTo(0,0)}
function draw(){const a=$('#app'),n=(location.hash||'#home').slice(1);a.innerHTML=V[V[n]?n:'home']()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const v=b.dataset.v,k=b.dataset.act;
if(k==='lib'){LF.lang=v;draw()}
else if(k==='plang'){keep();S.lang=v;save();draw()}
else if(k==='pick'){keep();P=v;draw()}
else if(k==='rst'){PC[P]=CH.find(x=>x.id===P).s;draw()}
else if(k==='sol'){$('#ed').value=CH.find(x=>x.id===P).sol;keep();out('Solution loaded. Read it and try to explain each line.')}
else if(k==='run')runCode()
else if(k==='check')checkCode()
else if(k==='ql'){QS.lang=v;draw()}else if(k==='qv'){QS.level=v;draw()}
else if(k==='qstart'){let l=QB.filter(q=>q[0]===(Q?Q.lang:QS.lang)&&q[1]===(Q?Q.level:QS.level));const lang=Q?Q.lang:QS.lang,level=Q?Q.level:QS.level;Q={lang,level,list:[...l].sort(()=>Math.random()-.5),i:0,score:0};draw()}
else if(k==='qnew'){Q=null;draw()}
else if(k==='ans'){const q=Q.list[Q.i],c=q[4],btns=[...document.querySelectorAll('.opt')];btns.forEach((o,j)=>{o.disabled=true;if(j===c)o.classList.add('ok')});
const f=$('#qf');if(+v===c){Q.score++;f.className='fb ok';f.textContent='Correct!'}else{btns[+v].classList.add('bad');f.className='fb bad';f.textContent='Not quite. The right answer is highlighted.'}
f.insertAdjacentHTML('afterend','<button class="btn p s" id="nx" style="margin-top:.8rem">'+(Q.i+1>=Q.list.length?'See result':'Next question')+'</button>');$('#nx').focus()}
else if(k==='name'){S.name=$('#nm').value.trim()||'Learner';save();b.textContent='Saved ✓'}
else if(k==='theme'){S.theme=v;save();apply();draw()}else if(k==='size'){S.size=+v;save();apply();draw()}
else if(k==='reset'){if(confirm('Reset all progress and settings?')){S={theme:'system',size:16,lang:'All',name:'Learner',hist:[],done:[]};LF.lang='All';try{localStorage.removeItem('cdknow')}catch(e){}apply();draw()}}});
document.addEventListener('click',e=>{if(e.target.id==='nx'){Q.i++;if(Q.i>=Q.list.length){const pct=Math.round(Q.score/Q.list.length*100);log('Quiz',`${Q.lang} (${Q.level}): ${Q.score}/${Q.list.length}`);S.hist[0].pct=pct;save()}draw()}});
document.addEventListener('input',e=>{if(e.target.id==='q'){LF.q=e.target.value;$('#libres').innerHTML=libCards(LIB.filter(x=>(LF.lang==='All'||x[0]===LF.lang)&&(LF.lv==='All'||x[1]===LF.lv)&&(x[2]+x[3]+x[0]).toLowerCase().includes(LF.q.toLowerCase())))}});
document.addEventListener('change',e=>{if(e.target.id==='lv'){LF.lv=e.target.value;draw()}if(e.target.id==='fl'){S.lang=e.target.value;LF.lang=S.lang;save()}});
document.addEventListener('keydown',e=>{if(e.target.id!=='ed')return;const t=e.target;if(e.key==='Escape')t.dataset.free='1';else if(e.key==='Tab'&&!e.shiftKey&&!t.dataset.free){e.preventDefault();t.setRangeText('  ',t.selectionStart,t.selectionEnd,'end')}});
document.addEventListener('focusout',e=>{if(e.target.id==='ed')delete e.target.dataset.free});
addEventListener('hashchange',route);apply();route();