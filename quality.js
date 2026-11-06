(() => {
'use strict';
const section=document.querySelector('.quality-section');if(!section)return;
const items=[...section.querySelectorAll('.quality-item')],buttons=[...section.querySelectorAll('[data-quality-go]')];
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n)};
let frame=0,active=-1;
const reduced=()=>document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches;
function update(){
 frame=0;const simple=reduced()||innerHeight<580;section.classList.toggle('quality-static',simple);
 const rect=section.getBoundingClientRect(),travel=Math.max(1,section.offsetHeight-innerHeight),progress=clamp(-rect.top/travel);
 const step=progress*2.6,index=Math.min(2,Math.floor(Math.max(0,step-.05)));
 section.classList.add('quality-ready');
 items.forEach((item,i)=>{
  const reveal=i===0?1:ease((step-i+.18)/.45);
  const card=item.querySelector('.quality-card');
  card.style.setProperty('--card-y',`${(1-reveal)*114}%`);card.style.setProperty('--card-r',`${i===0?-5:i===1?3.5:-1.5}deg`);
  card.style.setProperty('--card-s',String(1-Math.min(2,Math.max(0,step-i))*.025));
  item.classList.toggle('quality-current',simple||i===index);item.querySelector('.quality-copy').inert=!simple&&i!==index;
  item.querySelector('.quality-copy').setAttribute('aria-hidden',String(!simple&&i!==index));
  card.style.visibility=simple||reveal>.001?'visible':'hidden';
 });
 if(active!==index){buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));active=index;}
 section.querySelector('.quality-prev').disabled=index===0;section.querySelector('.quality-next').disabled=index===2;
 const inAlbum=rect.top<innerHeight*.3&&rect.bottom>innerHeight*.3;
 document.body.classList.toggle('quality-active',inAlbum);
 if(inAlbum){const toggle=document.querySelector('.language-toggle');toggle.href=(document.documentElement.lang.startsWith('ar')?'en.html':'index.html')+'#quality';}
}
function tick(){if(!frame)frame=requestAnimationFrame(update);}
function go(i){i=clamp(i,0,2);const y=section.offsetTop+((i===0?0:i+.3)/2.6)*(section.offsetHeight-innerHeight);scrollTo({top:y,behavior:reduced()?'instant':'smooth'});}
buttons.forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.qualityGo))));
section.querySelector('.quality-prev').addEventListener('click',()=>go(active-1));section.querySelector('.quality-next').addEventListener('click',()=>go(active+1));
window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick,{passive:true});
document.addEventListener('elvera:motion',tick);window.addEventListener('load',tick);update();
})();
