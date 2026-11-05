(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const ease = t => {t=clamp(t);return t*t*(3-2*t)};
const between=(p,a,b)=>ease((p-a)/(b-a));
const journey=$('#journey'), stage=$('#stage'), scenes=$$('.scene');
const sceneBounds=[[0,.35],[.335,.59],[.575,.74],[.725,.87],[.855,1.02]];
const chapterStarts=[0,.26,.40,.60,.76,.91];
const chapterNames=['The arrival','The threshold','The sanctuary','The ritual','The detail','The perspective'];
let p=0, raf=0, reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches, planManual=false, planRise=0, selectedRoom='', activeObject='bed', wholeRoom=false;
let previousFocus=null, lastScene=-1, lastPlan=-1;
const sink=$('#scene-ritual');
function scrollToProgress(value, behavior){window.scrollTo({top:journey.offsetTop + value*(journey.offsetHeight-innerHeight),behavior:behavior==='auto'?'instant':(behavior || (reduced?'instant':'smooth'))});}
function closeMenu(){const wasOpen=!$('#chapters').hidden;$('#chapters').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');if(wasOpen && previousFocus) previousFocus.focus({preventScroll:true});}
$('.menu-toggle').addEventListener('click',()=>{const open=$('#chapters').hidden;if(open){previousFocus=document.activeElement;$('#chapters').hidden=false;$('.menu-toggle').setAttribute('aria-expanded','true');document.body.classList.add('menu-open');$('#chapters a').focus();}else closeMenu();});
document.addEventListener('keydown',event=>{if($('#chapters').hidden)return;if(event.key==='Escape')closeMenu();if(event.key==='Tab'){const links=[$('.menu-toggle'),...$$('#chapters a')];const i=links.indexOf(document.activeElement);if(event.shiftKey&&i===0){event.preventDefault();links[links.length-1].focus();}else if(!event.shiftKey&&i===links.length-1){event.preventDefault();links[0].focus();}}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',event=>{const target=$(a.getAttribute('href'));if(!target)return;if(target.dataset.progress!==undefined){event.preventDefault();closeMenu();scrollToProgress(Number(target.dataset.progress));history.replaceState(null,'',a.getAttribute('href'));}else closeMenu();}));
$('.scroll-cue').addEventListener('click',()=>{const next=chapterStarts.find(v=>v>p+.025);if(next!==undefined)scrollToProgress(next);else $('#readable').scrollIntoView({behavior:reduced?'auto':'smooth'});});
function applyMotion(){document.documentElement.style.scrollBehavior=reduced?'auto':'smooth';document.body.classList.toggle('reduced',reduced);$('#motion-toggle').setAttribute('aria-pressed',String(reduced));$('#motion-toggle').textContent=reduced?'Full experience':'Reduce motion';requestTick();}
$('#motion-toggle').addEventListener('click',()=>{const oldP=p;reduced=!reduced;applyMotion();scrollToProgress(oldP,'auto');});
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{reduced=e.matches;applyMotion();});
function selectObject(kind){activeObject=kind;$$('[data-object]').forEach(button=>{button.classList.toggle('active',button.dataset.object===kind);if(button.hasAttribute('aria-pressed'))button.setAttribute('aria-pressed',String(button.dataset.object===kind));});const phone=innerWidth<=700;$('.room-focus').style.maskImage=kind==='lamp'?`radial-gradient(ellipse ${phone?'42% 37% at 77% 58%':'28% 44% at 71.5% 53%'},#000 42%,transparent 100%)`:`radial-gradient(ellipse ${phone?'62% 43% at 49% 69%':'42% 48% at 44% 67%'},#000 47%,transparent 100%)`;$('#sanctuary-description').textContent=kind==='lamp'?'A warm glow, held in a sculptural form. Light that softens the edges of the day.':'A softer rhythm. Sculpted forms, quiet textures, and space to simply be.';$('#material-text').textContent=kind==='lamp'?'A quieter kind of brilliance.':'Form made for stillness.';}
$$('[data-object]').forEach(b=>b.addEventListener('click',()=>selectObject(b.dataset.object)));
$('.focus-toggle').addEventListener('click',()=>{wholeRoom=!wholeRoom;sink.classList.toggle('whole',wholeRoom);$('.focus-toggle').setAttribute('aria-pressed',String(!wholeRoom));$('.focus-toggle').innerHTML=wholeRoom?'Focus on the basin <span>↗</span>':'View the whole room <span>↗</span>';});
const leaves=$('#ornament-leaves');let foliage='';for(let side of [-1,1])for(let i=0;i<5;i++)foliage+=`<g transform="translate(${side===-1?111:489} ${325+i*64}) scale(${side===-1?1:-1} 1)"><use href="#curl"/><use href="#leaf" transform="translate(0 64) scale(.62)"/></g>`;leaves.innerHTML=foliage;
const rooms=[{id:'bedroom',name:'BEDROOM',x:12,z:12,w:255,d:220,color:'#d7cbb8'},{id:'salon',name:'SALON',x:282,z:12,w:306,d:220,color:'#e1d6c4'},{id:'bath',name:'BATH',x:12,z:247,w:192,d:161,color:'#d6d0bf'},{id:'gallery',name:'GALLERY',x:219,z:247,w:369,d:80,color:'#e9deca'},{id:'terrace',name:'TERRACE',x:219,z:342,w:369,d:66,color:'#c5c9b6'}];
const roomCopy={bedroom:'The bedroom: a quiet retreat beside the central salon.',salon:'The salon: the generous heart of the residence.',bath:'The bath: a secluded space for everyday rituals.',terrace:'The terrace: a threshold between architecture and open air.'};
const walls=[[0,0,600,0],[0,0,0,420],[600,0,600,420],[0,420,600,420],[274,0,274,150],[274,200,274,240],[0,240,145,240],[190,240,600,240],[212,240,212,290],[212,332,212,420],[212,335,365,335],[430,335,600,335]];
function pt(x,z,h,t){let a=x-300,b=z-210;let isoX=(a*.866-b*.5)*1.08,isoY=(a*.5+b*.866)*.56-h;return [450+a*.98*(1-t)+isoX*t,327+b*.98*(1-t)+isoY*t];}
function points(coords,t){return coords.map(c=>pt(c[0],c[1],c[2]||0,t).map(v=>v.toFixed(1)).join(',')).join(' ');}
function polygon(coords,t,fill,stroke='#92856e',width=.65,extra=''){return `<polygon points="${points(coords,t)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;}
function box(x,z,w,d,h,t,color){let a=[[x,z,0],[x+w,z,0],[x+w,z+d,0],[x,z+d,0]],out='';if(t>.01){out+=polygon([[x,z+d,0],[x+w,z+d,0],[x+w,z+d,h],[x,z+d,h]],t,'#b4a58b');out+=polygon([[x+w,z,0],[x+w,z+d,0],[x+w,z+d,h],[x+w,z,h]],t,'#a99a80');}out+=polygon(a.map(q=>[q[0],q[1],h]),t,color);return out;}
function drawPlan(t){t=clamp(t);let out='<title id="plan-title">Interactive conceptual residence plan</title><desc id="plan-description">Illustrative bedroom, salon, bath, gallery and terrace. Not to scale.</desc><defs><filter id="plan-shadow"><feGaussianBlur stdDeviation="10"/></filter><pattern id="tile" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#fff" stroke-opacity=".23" stroke-width="1"/></pattern></defs>';
out+=polygon([[0,0,-15],[600,0,-15],[600,420,-15],[0,420,-15]],t,'#82745c30','none',0,'filter="url(#plan-shadow)"');
out+=box(-9,-9,618,438,0,t,'#f5f0e5');
for(const r of rooms){out+=polygon([[r.x,r.z,1],[r.x+r.w,r.z,1],[r.x+r.w,r.z+r.d,1],[r.x,r.z+r.d,1]],t,selectedRoom===r.id?'#b99b67':r.color,'#fff9',.7);out+=polygon([[r.x,r.z,2],[r.x+r.w,r.z,2],[r.x+r.w,r.z+r.d,2],[r.x,r.z+r.d,2]],t,'url(#tile)','none');}
// Architectural furniture volumes: bed, bedside plinths, salon seating, bath, and terrace planting.
out+=box(68,55,136,146,16,t,'#f1e9d7');out+=box(64,49,144,15,35,t,'#c4b398');out+=box(74,63,57,31,21,t,'#fcf8ed');out+=box(141,63,57,31,21,t,'#fcf8ed');out+=box(70,157,132,43,19,t,'#c0ad8e');out+=box(30,60,25,33,20,t,'#bca77d');out+=box(216,60,25,33,20,t,'#bca77d');
out+=box(339,55,190,42,23,t,'#f2ecdf');out+=box(339,52,190,9,37,t,'#d7c6aa');out+=box(339,141,52,58,24,t,'#f2ecdf');out+=box(487,141,52,58,24,t,'#f2ecdf');out+=box(408,125,60,53,14,t,'#bfa57a');
out+=box(28,263,48,126,14,t,'#f2ede2');out+=box(34,270,36,110,17,t,'#c4baa8');out+=box(125,260,63,35,25,t,'#c1ae8d');out+=box(135,264,38,22,27,t,'#efe8d8');
out+=box(253,363,95,21,16,t,'#ece8dc');out+=box(459,360,90,28,15,t,'#ece8dc');
for(const x of [237,569]){const [cx,cy]=pt(x,393,17,t);out+=`<ellipse cx="${cx}" cy="${cy}" rx="14" ry="${14-t*6}" fill="#8b9573" stroke="#697756" stroke-width="1"/>`;}
const h=t*64;for(const [x1,z1,x2,z2] of walls){if(t>.01){out+=polygon([[x1,z1,0],[x2,z2,0],[x2,z2,h],[x1,z1,h]],t,z1===z2?'#d1c2a9':'#b9a98e','#9c8c71',.7);}const a=pt(x1,z1,h,t),b=pt(x2,z2,h,t);out+=`<path d="M${a.join(' ')}L${b.join(' ')}" fill="none" stroke="#f9f5e9" stroke-width="7"/><path d="M${a.join(' ')}L${b.join(' ')}" fill="none" stroke="#87775b" stroke-width=".7"/>`;}
if(t<.65)for(const r of rooms){const [x,y]=pt(r.x+r.w/2,r.z+r.d-13,0,t);out+=`<text x="${x}" y="${y}" text-anchor="middle" fill="#6a5b42" opacity="${1-t}" font-size="8" font-family="Arial, sans-serif" letter-spacing="1.3">${r.name}</text>`;}
const [nx,ny]=pt(640,30,0,t);out+=`<g transform="translate(${nx} ${ny})" stroke="#8a7a60" fill="none"><path d="M0 25V-10M-4-2L0-10 4-2" stroke-width=".8"/><text x="0" y="-18" text-anchor="middle" fill="#8a7a60" stroke="none" font-size="8" font-family="Arial">N</text></g>`;
$('#plan-drawing').innerHTML=out;$('#rise').value=String(Math.round(t*100));$('#rise-value').textContent=Math.round(t*100)+'%';$$('[data-view]').forEach(b=>{const active=Number(b.dataset.view)===(t<.5?0:1);b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});lastPlan=t;}
let planAnimation=0;function animatePlan(target){cancelAnimationFrame(planAnimation);planManual=true;if(reduced){planRise=target;drawPlan(planRise);return;}const from=planRise,start=performance.now();function frame(now){let q=clamp((now-start)/1000);planRise=from+(target-from)*ease(q);drawPlan(planRise);if(q<1)planAnimation=requestAnimationFrame(frame);}planAnimation=requestAnimationFrame(frame);}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>animatePlan(Number(b.dataset.view))));$('#rise').addEventListener('input',e=>{cancelAnimationFrame(planAnimation);planManual=true;planRise=Number(e.target.value)/100;drawPlan(planRise);});
$$('[data-room]').forEach(b=>b.addEventListener('click',()=>{selectedRoom=selectedRoom===b.dataset.room?'':b.dataset.room;$$('[data-room]').forEach(button=>{button.classList.toggle('active',button.dataset.room===selectedRoom);button.setAttribute('aria-pressed',String(button.dataset.room===selectedRoom));});$('#room-description').textContent=roomCopy[selectedRoom]||'Select a space to explore its relationship to the whole.';drawPlan(planRise);}));
function update(){raf=0;p=clamp((scrollY-journey.offsetTop)/(journey.offsetHeight-innerHeight));const width=innerWidth;
let sceneIndex=p<.342?0:p<.582?1:p<.732?2:p<.862?3:4;document.body.classList.toggle('plan-active',sceneIndex===4);
for(let i=0;i<scenes.length;i++){const [start,end]=sceneBounds[i];let opacity=reduced?(i===sceneIndex?1:0):(i===0?1:between(p,start,start+.024))*(i===4?1:1-between(p,end-.024,end));scenes[i].style.opacity=String(opacity);scenes[i].classList.toggle('active',opacity>.01);scenes[i].inert=i!==sceneIndex;scenes[i].setAttribute('aria-hidden',String(i!==sceneIndex));}
const zoom=between(p,.018,.305),entry=between(p,.276,.35);
$('.palace-photo').style.transform=reduced?'none':`translateY(${-17*between(p,.12,.295)}vh) scale(${1+zoom*6.2+entry*3})`;
$('.palace-photo').style.filter=`saturate(.75) brightness(${1-entry*.45})`;
$('.hero-copy').style.opacity=String(reduced?(p<.18?1:0):1-between(p,.035,.12));$('.hero-copy').style.transform=`translateY(${-80*between(p,.015,.12)}px)`;
$('.approach-copy').style.opacity=String(reduced?0:between(p,.095,.14)*(1-between(p,.20,.245)));$('.approach-copy').style.transform=`translateY(${24*(1-between(p,.1,.17))}px)`;
$('.threshold-copy').style.opacity=String(reduced?(p>=.18?1:0):between(p,.23,.26)*(1-between(p,.29,.325)));
const frame=$('.window-frame');frame.style.opacity=String(between(p,.263,.284)*(1-between(p,.332,.35)));frame.style.transform=`translate(-50%,-50%) scale(${.55+entry*18})`;frame.style.top='50%';
$('.cloud-one').style.transform=`translate(${-zoom*60}%,${zoom*50}%) scale(${1+zoom})`;$('.cloud-two').style.transform=`translate(${zoom*55}%,${zoom*40}%) scale(${1+zoom})`;$('.cloud-three').style.transform=`translateY(${-zoom*150}%)`;
$('.cloud-one').style.opacity=String(1-between(p,.07,.22));$('.cloud-two').style.opacity=String(.7*(1-between(p,.08,.22)));
if(!reduced){const roomScale=1.035+between(p,.35,.57)*.045;$$('.room-photo').forEach(img=>img.style.transform=`scale(${roomScale})`);const basinScale=1.035+between(p,.59,.73)*.055;$$('.sink-photo').forEach(img=>img.style.transform=`scale(${basinScale})`);$('.ornament-wrap').style.transform=`translateY(${35*(1-between(p,.73,.86))}px) scale(${.93+between(p,.73,.86)*.17})`;}
let chapter=p<.23?0:p<.342?1:p<.582?2:p<.732?3:p<.862?4:5;$('#chapter-number').textContent=String(chapter+1).padStart(2,'0');$('#chapter-name').textContent=chapterNames[chapter];$('#progress').style.width=(p*100)+'%';document.body.classList.toggle('light-ui',sceneIndex===1||sceneIndex===2||(!reduced&&p>.26&&p<.342));$('.scroll-cue').style.opacity=sceneIndex===4?'0':'1';$('.scroll-cue').style.pointerEvents=sceneIndex===4?'none':'auto';$('#scroll-label').textContent=p<.08?'Scroll to discover':'Continue the journey';
if(!planManual){planRise=reduced?1:between(p,.89,.985);if(Math.abs(planRise-lastPlan)>.002||lastPlan===-1)drawPlan(planRise);}
if(scrollY>journey.offsetHeight-innerHeight*.5){document.body.classList.remove('light-ui');$('.site-header').style.background='#eee8dce8';}else $('.site-header').style.background='transparent';
lastScene=sceneIndex;
}
function requestTick(){if(!raf)raf=requestAnimationFrame(update);}
window.addEventListener('scroll',requestTick,{passive:true});window.addEventListener('resize',()=>{selectObject(activeObject);requestTick();},{passive:true});
applyMotion();selectObject('bed');drawPlan(0);update();
window.addEventListener('load',()=>{const hash=location.hash;if(hash&&$(hash)?.dataset.progress!==undefined)scrollToProgress(Number($(hash).dataset.progress),'auto');requestTick();});
})();
