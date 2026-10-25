(() => {
 const header = document.querySelector('header');
 const menuButton = document.querySelector('.nav-toggle');
 const mainNav = document.getElementById('main-nav');
 const narrowScreen = window.matchMedia('(max-width: 1100px)');
 if (header && menuButton && mainNav) {
   const setMenu = open => { header.classList.toggle('menu-open', open); menuButton.setAttribute('aria-expanded', String(open)); };
   header.classList.add('nav-ready');
   menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
   mainNav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
   document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); menuButton.focus(); } });
   document.addEventListener('click', e => { if (!header.contains(e.target)) setMenu(false); });
   narrowScreen.addEventListener('change', () => setMenu(false));
 }

 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused = reduced.matches;
 const toggle = document.querySelector('.motion-toggle');
 const ns = 'http://www.w3.org/2000/svg';
 const group = document.querySelector('#membrane-planes');
 const paths = [];
 const node = (tag, attrs, parent=group) => { const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));parent.append(el);return el; };
 // An abstract semiconductor landscape: patterned wafer, sculpted surfaces, and microstructures.
 const project=(u,v,z)=>[320+(u-v)*4.2,365+(u+v)*1.95-z];
 const line=(points)=>points.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ');
 let wafer=[];for(let i=0;i<=100;i++){let a=i/100*Math.PI*2;wafer.push(project(Math.cos(a)*43,Math.sin(a)*43,-52));}
 node('path',{d:line(wafer)+'Z',fill:'#D5DEE7','fill-opacity':'.65',stroke:'#345B85','stroke-opacity':'.4','stroke-width':'.8'});
 for(let u=-32;u<=32;u+=8){let len=Math.sqrt(38*38-u*u);node('path',{d:line([project(u,-len,-51),project(u,len,-51)]),fill:'none',stroke:'#345B85','stroke-opacity':'.19','stroke-width':'.6'});node('path',{d:line([project(-len,u,-51),project(len,u,-51)]),fill:'none',stroke:'#345B85','stroke-opacity':'.19','stroke-width':'.6'});}
 for (let u=-20;u<=20;u+=10) for(let v=-20;v<=20;v+=10){if(u*u+v*v>650)continue;let h=16+28*Math.exp(-(u*u+v*v)/220);let a=project(u-2,v-2,-50),b=project(u+2,v-2,-50),c=project(u+2,v+2,-50),d=project(u-2,v+2,-50),t=[a,b,c,d].map(p=>[p[0],p[1]-h]);node('path',{d:line([a,b,t[1],t[0],a])+'Z',fill:'#5B7B9E','fill-opacity':'.45',stroke:'#345B85','stroke-width':'.5','stroke-opacity':'.45'});node('path',{d:line([b,c,t[2],t[1],b])+'Z',fill:'#345B85','fill-opacity':'.6',stroke:'#345B85','stroke-width':'.5','stroke-opacity':'.45'});node('path',{d:line([...t,t[0]])+'Z',fill:'#8DA6BF','fill-opacity':'.15',stroke:'#345B85','stroke-width':'.7','stroke-opacity':'.65'});}
 for(let orientation=0;orientation<2;orientation++) for(let i=-28;i<=28;i+=2){let p=node('path',{fill:'none',stroke:orientation?'#738AA4':'#345B85','stroke-width':i%8===0?'.95':'.55','stroke-opacity':orientation?'.48':'.76'});paths.push({el:p,i,orientation});}
 const draw=(t)=>{paths.forEach(({el,i,orientation})=>{const points=[];for(let j=-28;j<=28;j+=1){let u=orientation?j:i,v=orientation?i:j;let r=Math.sqrt(u*u+v*v);let z=95+60*Math.exp(-r*r/550)*Math.cos(r*.13-t*.00035)+9*Math.sin(u*.16+v*.11+t*.00018);points.push(project(u,v,z));}el.setAttribute('d',line(points));});};
 draw(0);let last=0;const animate=t=>{if(!paused && !document.hidden && t-last>40){draw(t);last=t;}requestAnimationFrame(animate);};requestAnimationFrame(animate);
 const setToggle=()=>{document.body.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.innerHTML=paused?'Resume motion <span><i class="ui-icon ui-play" aria-hidden="true"></i></span>':'Pause motion <span><i class="ui-icon ui-pause" aria-hidden="true"></i></span>';};setToggle();toggle.addEventListener('click',()=>{paused=!paused;setToggle();});reduced.addEventListener('change',()=>{paused=reduced.matches;setToggle();});
 if('IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));const navObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}})},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(s=>navObserver.observe(s));}
})();
