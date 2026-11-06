(()=>{
'use strict';
const intro=document.querySelector('#project'),section=document.querySelector('#project-view'),stage=section?.querySelector('.project-view-stage');if(!section)return;
const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n)};
let raf=0;
function update(){raf=0;const reduced=document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion:reduce)').matches;
 const simple=reduced||innerHeight<500;section.classList.toggle('project-static',simple);
 const rect=section.getBoundingClientRect(),p=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight)),q=simple?0:ease(p/.82),phone=innerWidth<=700;
 section.style.setProperty('--expand',String(q));
 section.style.setProperty('--card-width',`${(phone?84:44)+(phone?16:56)*q}%`);
 section.style.setProperty('--card-height',`${(phone?42:52)+(phone?58:48)*q}%`);
 section.style.setProperty('--card-x',`${(phone?50:70)+(phone?0:-20)*q}%`);
 section.style.setProperty('--card-y',`${(phone?61:53)+(phone?-11:-3)*q}%`);
 section.style.setProperty('--heading-opacity',String(simple?1:1-ease(p/.38)));
 section.style.setProperty('--caption-opacity',String(simple?1:ease((p-.2)/.36)));
 const visible=scrollY>=intro.offsetTop-100&&scrollY<document.querySelector('#journey').offsetTop-100;
 document.body.classList.toggle('project-active',visible);
 if(visible){const lang=document.querySelector('.language-toggle'),hash=scrollY<section.offsetTop?'project':scrollY<section.offsetTop+section.offsetHeight?'project-view':'interior-studies';lang.href=(document.documentElement.lang.startsWith('ar')?'en.html':'index.html')+'#'+hash;}
 if(rect.top<innerHeight*2&&rect.bottom>0)section.querySelector('img').loading='eager';
}
function tick(){if(!raf)raf=requestAnimationFrame(update);}
addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick,{passive:true});addEventListener('load',tick);document.addEventListener('elvera:motion',tick);update();
})();
