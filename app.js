(() => {
'use strict';
const T=window.ElveraText;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const ease = t => {t=clamp(t);return t*t*(3-2*t)};
const between=(p,a,b)=>ease((p-a)/(b-a));
const journey=$('#journey'), stage=$('#stage'), scenes=$$('.scene');
const sceneBounds=[[0,.32],[.302,.456],[.44,.636],[.62,.758],[.74,.888],[.872,1.02]];
const chapterStarts=[0,.25,.36,.50,.65,.765,.925];
const chapterNames=T.chapters;
const chapterIds=['arrival','threshold','hall','sanctuary','ritual','detail','plan'];
let p=0, raf=0, reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches, planManual=false, planRise=0, selectedRoom='', activeObject='bed', wholeRoom=false;
let previousFocus=null, lastScene=-1, lastPlan=-1;
const sink=$('#scene-ritual');
function scrollToProgress(value, behavior){window.scrollTo({top:journey.offsetTop + value*(journey.offsetHeight-innerHeight),behavior:behavior==='auto'?'instant':(behavior || (reduced?'instant':'smooth'))});}
function closeMenu(){const wasOpen=!$('#chapters').hidden;$('#chapters').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label',T.menuOpen);document.body.classList.remove('menu-open');if(wasOpen && previousFocus) previousFocus.focus({preventScroll:true});}
$('.menu-toggle').addEventListener('click',()=>{const open=$('#chapters').hidden;if(open){previousFocus=document.activeElement;$('#chapters').hidden=false;$('.menu-toggle').setAttribute('aria-expanded','true');$('.menu-toggle').setAttribute('aria-label',T.menuClose);document.body.classList.add('menu-open');$('#chapters a').focus();}else closeMenu();});
document.addEventListener('keydown',event=>{if($('#chapters').hidden)return;if(event.key==='Escape')closeMenu();if(event.key==='Tab'){const links=[$('.menu-toggle'),...$$('#chapters a')];const i=links.indexOf(document.activeElement);if(event.shiftKey&&i===0){event.preventDefault();links[links.length-1].focus();}else if(!event.shiftKey&&i===links.length-1){event.preventDefault();links[0].focus();}}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',event=>{const target=$(a.getAttribute('href'));if(!target)return;if(target.dataset.progress!==undefined){event.preventDefault();closeMenu();scrollToProgress(Number(target.dataset.progress));history.replaceState(null,'',a.getAttribute('href'));}else closeMenu();}));
$('.scroll-cue').addEventListener('click',()=>{const next=chapterStarts.find(v=>v>p+.025);if(next!==undefined)scrollToProgress(next);else $('#readable').scrollIntoView({behavior:reduced?'auto':'smooth'});});
function applyMotion(){document.documentElement.style.scrollBehavior=reduced?'auto':'smooth';document.body.classList.toggle('reduced',reduced);$('#motion-toggle').setAttribute('aria-pressed',String(reduced));$('#motion-toggle').textContent=reduced?T.motionFull:T.motionReduced;document.dispatchEvent(new Event('elvera:motion'));requestTick();}
$('#motion-toggle').addEventListener('click',()=>{const oldP=p;reduced=!reduced;applyMotion();scrollToProgress(oldP,'auto');});
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{reduced=e.matches;applyMotion();});
function selectObject(kind){activeObject=kind;$$('[data-object]').forEach(button=>{button.classList.toggle('active',button.dataset.object===kind);if(button.hasAttribute('aria-pressed'))button.setAttribute('aria-pressed',String(button.dataset.object===kind));});const phone=innerWidth<=700;$('.room-focus').style.maskImage=kind==='lamp'?`radial-gradient(ellipse ${phone?'42% 37% at 77% 58%':'28% 44% at 71.5% 53%'},#000 42%,transparent 100%)`:`radial-gradient(ellipse ${phone?'62% 43% at 49% 69%':'42% 48% at 44% 67%'},#000 47%,transparent 100%)`;$('#sanctuary-description').textContent=kind==='lamp'?T.lampDescription:T.bedDescription;$('#material-text').textContent=kind==='lamp'?T.lampNote:T.bedNote;}
$$('[data-object]').forEach(b=>b.addEventListener('click',()=>selectObject(b.dataset.object)));
$('.focus-toggle').addEventListener('click',()=>{wholeRoom=!wholeRoom;sink.classList.toggle('whole',wholeRoom);$('.focus-toggle').innerHTML=(wholeRoom?T.focusBasin:T.wholeRoom)+' <span aria-hidden="true">↗</span>';});
// A continuous vertical ornament, progressively inked in the direction of travel.
const ornamentTraces=$('#ornament-traces');
let ornamentMarkup='';
function trace(d,start,duration,width=2.2){return `<path class="ornament-trace" d="${d}" pathLength="1" data-start="${start}" data-duration="${duration}" stroke-width="${width}" stroke-dasharray="1" stroke-dashoffset="1"/>`;}
ornamentMarkup+=trace('M210 18V1414',0,1,1.6);
ornamentMarkup+=trace('M210 20C183 53 191 79 210 92C229 79 237 53 210 20Z',0,.075,2.3);
for(let i=0;i<7;i++){
 const y=145+i*184, start=(y-75)/1440;
 for(const side of [-1,1]){
  const x=n=>210+side*n;
  ornamentMarkup+=trace(`M210 ${y+75}C${x(14)} ${y+36} ${x(81)} ${y+35} ${x(94)} ${y-1}C${x(112)} ${y-50} ${x(47)} ${y-69} ${x(38)} ${y-27}C${x(32)} ${y} ${x(67)} ${y+2} ${x(65)} ${y-20}C${x(63)} ${y-35} ${x(46)} ${y-28} ${x(51)} ${y-16}`,start,.105,2.6);
  ornamentMarkup+=trace(`M210 ${y+38}C${x(20)} ${y+7} ${x(45)} ${y-3} ${x(34)} ${y-48}C${x(9)} ${y-32} ${x(6)} ${y+7} 210 ${y+38}M210 ${y+38}C${x(17)} ${y+13} ${x(24)} ${y-15} ${x(34)} ${y-48}`,start+.01,.09,1.9);
  ornamentMarkup+=trace(`M${x(79)} ${y+27}C${x(105)} ${y+6} ${x(127)} ${y+18} ${x(127)} ${y+42}C${x(126)} ${y+62} ${x(102)} ${y+63} ${x(101)} ${y+47}C${x(100)} ${y+37} ${x(115)} ${y+35} ${x(115)} ${y+46}`,start+.045,.09,1.9);
  ornamentMarkup+=trace(`M210 ${y+84}C${x(28)} ${y+56} ${x(42)} ${y+67} ${x(48)} ${y+90}C${x(25)} ${y+94} ${x(11)} ${y+92} 210 ${y+84}`,start+.075,.065,1.8);
 }
 ornamentMarkup+=trace(`M210 ${y+98}C190 ${y+115} 194 ${y+134} 210 ${y+143}C226 ${y+134} 230 ${y+115} 210 ${y+98}Z`,start+.085,.075,2.2);
}
ornamentMarkup+=trace('M210 1374C187 1394 193 1415 210 1427C227 1415 233 1394 210 1374Z',.92,.08,2.6);
ornamentTraces.innerHTML=ornamentMarkup;
const drawnPaths=$$('.ornament-trace');
function drawOrnament(progress){
 const amount=reduced?1:clamp(progress);
 for(const path of drawnPaths){const local=ease((amount-Number(path.dataset.start))/Number(path.dataset.duration));path.style.strokeDashoffset=String(1-local);path.style.opacity=local>.001?'1':'0';}
 const mobile=innerWidth<=700;
 const wrap=$('.ornament-wrap');
 const travel=Math.max(0,wrap.offsetHeight-innerHeight*(mobile?.28:.64));
 const track=reduced?(mobile?.49:.32):(mobile?between(amount,.2,1):amount);
 wrap.style.transform=`translate3d(${mobile?(T.ar?1:-1)*innerWidth*.27*between(track,.25,.72):0}px,${-travel*track}px,0)`;
 const copy=$('#scene-detail .scene-copy');copy.style.opacity=String(mobile&&!reduced?1-between(amount,.19,.38):1);
}
// Source-image roofline. Projected with the palace camera to occlude birds behind it.
const palaceSkyEdge=[[0,799],[80,778],[80,740],[169,740],[169,620],[239,596],[284,591],[284,568],[341,568],[341,497],[357,477],[375,567],[396,566],[396,482],[413,478],[413,439],[447,440],[449,463],[575,486],[579,563],[603,564],[607,503],[612,480],[627,563],[660,560],[660,494],[675,483],[675,448],[713,417],[771,389],[830,377],[835,361],[842,377],[908,394],[971,425],[997,453],[998,488],[1015,494],[1015,563],[1039,564],[1045,490],[1054,475],[1062,564],[1091,567],[1091,488],[1216,463],[1218,439],[1250,439],[1252,476],[1300,482],[1300,566],[1318,568],[1322,487],[1331,477],[1340,568],[1388,591],[1435,596],[1504,620],[1504,740],[1590,740],[1594,780],[1672,799]];
function maskBirdDepth(scale,offset,coverHeight,width){
 const coverWidth=coverHeight*1672/941;
 const points=[[0,0],[1672,0],...palaceSkyEdge.slice().reverse()];
 $('.sky-birds').style.clipPath='polygon('+points.map(([x,y])=>`${(width/2+(x/1672-.5)*coverWidth*scale).toFixed(2)}px ${(innerHeight/2+(y/941-.5)*coverHeight*scale+offset).toFixed(2)}px`).join(',')+')';
}
const roomCopy=T.ar?window.ElveraPalace.roomCopyAr:window.ElveraPalace.roomCopy;
const defaultRoomCopy=T.ar?window.ElveraPalace.defaultCopyAr:window.ElveraPalace.defaultCopy;
function drawPlan(t){
 t=clamp(t);$('#plan-drawing').innerHTML=window.ElveraPalace.render(t,selectedRoom,T.ar?'ar':'en');
 $('#rise').value=String(Math.round(t*100));$('#rise-value').textContent=T.percent(Math.round(t*100));
 $$('[data-view]').forEach(b=>{const active=Number(b.dataset.view)===(t<.5?0:1);b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});lastPlan=t;
}
let planAnimation=0;function animatePlan(target){cancelAnimationFrame(planAnimation);planManual=true;if(reduced){planRise=target;drawPlan(planRise);return;}const from=planRise,start=performance.now();function frame(now){let q=clamp((now-start)/1000);planRise=from+(target-from)*ease(q);drawPlan(planRise);if(q<1)planAnimation=requestAnimationFrame(frame);}planAnimation=requestAnimationFrame(frame);}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>animatePlan(Number(b.dataset.view))));$('#rise').addEventListener('input',e=>{cancelAnimationFrame(planAnimation);planManual=true;planRise=Number(e.target.value)/100;drawPlan(planRise);});
$$('[data-room]').forEach(b=>b.addEventListener('click',()=>{selectedRoom=selectedRoom===b.dataset.room?'':b.dataset.room;$$('[data-room]').forEach(button=>{button.classList.toggle('active',button.dataset.room===selectedRoom);button.setAttribute('aria-pressed',String(button.dataset.room===selectedRoom));});$('#room-description').textContent=roomCopy[selectedRoom]||defaultRoomCopy;drawPlan(planRise);}));
function update(){raf=0;p=clamp((scrollY-journey.offsetTop)/(journey.offsetHeight-innerHeight));const width=innerWidth;
let sceneIndex=p<.311?0:p<.448?1:p<.628?2:p<.749?3:p<.880?4:5;document.body.classList.toggle('plan-active',sceneIndex===5);
for(let i=0;i<scenes.length;i++){const [start,end]=sceneBounds[i];let opacity=reduced?(i===sceneIndex?1:0):(i===0?1:between(p,start,start+.024))*(i===5?1:1-between(p,end-.024,end));scenes[i].style.opacity=String(opacity);scenes[i].classList.toggle('active',opacity>.01);scenes[i].inert=i!==sceneIndex;scenes[i].setAttribute('aria-hidden',String(i!==sceneIndex));}
const cloudPart=between(p,.002,.095),introGone=reduced?(p>=.025?1:0):between(p,.025,.105);
const uiReveal=reduced?(p>=.025?1:0):between(p,.038,.079);
const detailUiReveal=reduced?uiReveal:between(p,.088,.125);
const intro=$('.intro-clouds');intro.style.opacity=String(1-introGone);intro.style.visibility=introGone>=1?'hidden':'visible';intro.setAttribute('aria-hidden',String(introGone>.9));
intro.style.background=p<.002?'#e8e4df':'transparent';
$('.intro-cloud-base').style.opacity=String(reduced?1:1-between(p,.009,.055));
$('.intro-cloud-base').style.transform=`scale(${1+cloudPart*.36}) translateY(${cloudPart*9}%)`;
$('.intro-cloud-left').style.transform=`translate(${-cloudPart*62}%,${cloudPart*16}%) scale(${1+cloudPart*.16})`;
$('.intro-cloud-right').style.transform=`translate(${cloudPart*62}%,${cloudPart*21}%) scale(${1+cloudPart*.2})`;
const header=$('.site-header');header.style.opacity=String(uiReveal);header.style.transform=`translateY(${-14*(1-uiReveal)}px)`;header.style.pointerEvents=uiReveal>.8?'auto':'none';header.inert=uiReveal<.8;header.setAttribute('aria-hidden',String(uiReveal<.8));
$('.palace-photo').setAttribute('aria-hidden',String(introGone<.1));
$('.bottom-meta').style.opacity=String(detailUiReveal);$('.bottom-meta').inert=detailUiReveal<.8;$('.bottom-meta').setAttribute('aria-hidden',String(detailUiReveal<.8));
$('.chapter-caption').style.opacity=String(innerWidth<=700&&sceneIndex===5?0:detailUiReveal);$('.chapter-caption').setAttribute('aria-hidden',String(detailUiReveal<.8));$('.progress-track').style.opacity=String(detailUiReveal);
// Match the central portal in both photographs before blending plates.
// Wide portal: (836,631); detailed portal: (836,577), source size 1672 × 941.
const zoom=between(p,.105,.205),entry=between(p,.255,.32);
const emergence=between(p,.012,.104),dolly=1+between(p,.205,.32)*.45;
const coverHeight=Math.max(innerHeight,width/(1672/941));
const wideScale=(1+zoom*1.72)*dolly;
const portalAlignment=((577/941-.5)-(631/941-.5)*2.72)*coverHeight*zoom*dolly;
const rise=innerHeight*.29*(1-emergence);
$('.palace-photo').style.transform=reduced?'none':`translate3d(0,${rise+portalAlignment}px,0) scale(${wideScale})`;
$('.palace-photo').style.filter='saturate(.86)';
const closeReveal=reduced?(p>=.19?1:0):between(p,.20,.232);
const close=$('.palace-close');close.style.opacity=String(closeReveal);close.setAttribute('aria-hidden',String(closeReveal<.1));
close.style.transform=reduced?'none':`scale(${dolly})`;
const birds=$('.sky-birds'),birdsVisible=between(p,.04,.075)*(1-between(p,.15,.20));
birds.style.opacity=String(reduced?0:birdsVisible);birds.classList.toggle('birds-visible',!reduced&&birdsVisible>.01&&sceneIndex===0);
if(birdsVisible>.001&&!reduced){
 maskBirdDepth(wideScale,rise+portalAlignment,coverHeight,width);
 const titleTop=$('.hero-copy').offsetTop+20*(1-between(p,.053,.096))-45*between(p,.128,.152);
 birds.style.maskImage=`linear-gradient(to bottom,#000 0,#000 ${Math.max(0,titleTop-22)}px,transparent ${Math.max(0,titleTop-10)}px,transparent 100%)`;
}
close.style.filter=`saturate(.86) brightness(${1-entry*.13})`;
const hallProgress=between(p,.302,.456);
$('.hall-photo').style.transform=reduced?'none':`scale(${1+hallProgress*.055})`;
$('.floor-lettering').style.opacity=String(reduced?1:between(p,.321,.353)*(1-between(p,.421,.448)));
const heroReveal=reduced?(p>=.025&&p<.15?1:0):between(p,.053,.096)*(1-between(p,.128,.152));$('.hero-copy').style.opacity=String(heroReveal);$('.hero-copy').style.transform=`translateY(${20*(1-between(p,.053,.096))-45*between(p,.128,.152)}px)`;$('.hero-copy').setAttribute('aria-hidden',String(heroReveal<.1));
const approachReveal=reduced?(p>=.15&&p<.19?1:0):between(p,.153,.173)*(1-between(p,.195,.218));$('.approach-copy').style.opacity=String(approachReveal);$('.approach-copy').style.transform=`translateY(${24*(1-between(p,.153,.173))}px)`;$('.approach-copy').setAttribute('aria-hidden',String(approachReveal<.1));
const thresholdReveal=reduced?(p>=.19?1:0):between(p,.228,.25)*(1-between(p,.275,.302));$('.threshold-copy').style.opacity=String(thresholdReveal);$('.threshold-copy').setAttribute('aria-hidden',String(thresholdReveal<.1));
const frame=$('.window-frame');frame.style.opacity=String(between(p,.263,.284)*(1-between(p,.332,.35)));frame.style.transform=`translate(-50%,-50%) scale(${.55+entry*18})`;frame.style.top='50%';
$('.cloud-one').style.transform=`translate(${-zoom*60}%,${zoom*50}%) scale(${1+zoom})`;$('.cloud-two').style.transform=`translate(${zoom*55}%,${zoom*40}%) scale(${1+zoom})`;$('.cloud-three').style.transform=`translateY(${-zoom*150}%)`;
$('.cloud-one').style.opacity=String(1-between(p,.07,.22));$('.cloud-two').style.opacity=String(.7*(1-between(p,.08,.22)));
if(!reduced){const roomScale=1.035+between(p,.44,.636)*.045;$$('.room-photo').forEach(img=>img.style.transform=`scale(${roomScale})`);const basinScale=1.035+between(p,.62,.758)*.055;$$('.sink-photo').forEach(img=>img.style.transform=`scale(${basinScale})`);}
drawOrnament(clamp((p-.738)/.137));
let chapter=p<.228?0:p<.311?1:p<.448?2:p<.628?3:p<.749?4:p<.880?5:6;$('#chapter-number').textContent=T.number(String(chapter+1).padStart(2,'0'));$('#chapter-name').textContent=chapterNames[chapter];$('.language-toggle').href=(T.ar?'en.html':'index.html')+(p>.015?'#'+chapterIds[chapter]:'');$('#progress').style.width=(p*100)+'%';document.body.classList.toggle('light-ui',sceneIndex===2||sceneIndex===3);$('.scroll-cue').style.opacity=String(sceneIndex===5?0:detailUiReveal);$('.scroll-cue').style.pointerEvents=sceneIndex===5||detailUiReveal<.8?'none':'auto';$('.scroll-cue').inert=sceneIndex===5||detailUiReveal<.8;$('.scroll-cue').setAttribute('aria-hidden',String(sceneIndex===5||detailUiReveal<.8));$('#scroll-label').textContent=p<.14?T.scroll:T.continue;
if(!planManual){planRise=reduced?1:between(p,.902,.985);if(Math.abs(planRise-lastPlan)>.002||lastPlan===-1)drawPlan(planRise);}
if(scrollY>journey.offsetHeight-innerHeight*.5){document.body.classList.remove('light-ui');$('.site-header').style.background='#eee8dce8';}else $('.site-header').style.background='transparent';
lastScene=sceneIndex;
}
function requestTick(){if(!raf)raf=requestAnimationFrame(update);}
window.addEventListener('scroll',requestTick,{passive:true});window.addEventListener('resize',()=>{selectObject(activeObject);requestTick();},{passive:true});
applyMotion();selectObject('bed');drawPlan(0);update();
window.addEventListener('load',()=>{const hash=location.hash;if(hash&&$(hash)?.dataset.progress!==undefined)scrollToProgress(Number($(hash).dataset.progress),'auto');requestTick();});
})();
