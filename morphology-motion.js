
(() => {
 'use strict';
 const host = document.querySelector('[data-morphology-scene]');
 if (!host) return;
 const canvas = host.querySelector('canvas');
 const toggle = document.querySelector('.motion-toggle');
 const hero=host.closest('.hero');
 const panels=Array.from(hero.querySelectorAll('[data-story-panel]'));
 const chapters=Array.from(hero.querySelectorAll('[data-story-chapter]'));
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let chapter=-1,chooseChapter=i=>setChapter(i);
 function setChapter(next){
  if(chapter===next)return;
  chapter=next;
  panels.forEach((panel,i)=>{panel.classList.toggle('is-active',i===chapter);panel.setAttribute('aria-hidden',String(i!==chapter));panel.inert=i!==chapter;});
  chapters.forEach((button,i)=>{if(i===chapter)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
 }
 function updateHeader(){
  const header=document.querySelector('header').getBoundingClientRect().height;
  document.body.classList.toggle('story-past-hero',hero.getBoundingClientRect().bottom<=header+1);
 }
 chapters.forEach((button,i)=>button.addEventListener('click',()=>chooseChapter(i)));
 window.addEventListener('scroll',updateHeader,{passive:true});
 window.addEventListener('resize',updateHeader);
 setChapter(0);updateHeader();
 const T = window.THREE;
 if (!T || !window.createMorphologyWorld) { if(toggle)toggle.hidden=true; return; }
 let renderer;
 try {
  renderer = new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.92;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 } catch (error) { if(toggle)toggle.hidden=true; return; }
 const world = window.createMorphologyWorld(T);
 const faces=[];
 for(let i=0;i<6;i++){
  const c=document.createElement('canvas');c.width=c.height=256;
  const ctx=c.getContext('2d');
  const g=ctx.createLinearGradient(0,0,256,256);
  g.addColorStop(0,'#f5f1e9');g.addColorStop(.37,'#68645e');g.addColorStop(.68,'#ddd8ce');g.addColorStop(1,'#34322f');
  ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
  ctx.fillStyle=i%2?'#ffffff':'#f9f4e9';ctx.fillRect(i%2?24:80,0,i%2?92:58,256);
  ctx.fillStyle='#1c1b19';ctx.fillRect(191,0,42,256);faces.push(c);
 }
 const cube=new T.CubeTexture(faces);cube.colorSpace=T.SRGBColorSpace;cube.needsUpdate=true;
 let envTarget;
 try {
  const pmrem=new T.PMREMGenerator(renderer);
  envTarget=pmrem.fromCubemap(cube);world.scene.environment=envTarget.texture;pmrem.dispose();cube.dispose();
 } catch(error) {world.scene.environment=cube;}
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 let paused=reduced.matches,visible=true,contextLost=false,frame=0,elapsed=0,last=null,lastPaint=-100;
 // Nine seconds per chapter, including a two-second transition to the next.
 // The third composition blends directly back into the first, without rewinding.
 const chapterDuration=9000;
 let storyTime=0,weights=[1,0,0],manual=null;
 let tiltX=0,tiltY=0,targetX=0,targetY=0;
 function render(){
  if(manual){
   const blend=T.MathUtils.smoothstep(elapsed-manual.start,0,900);
   weights=manual.from.map((n,i)=>n*(1-blend)+(i===manual.target?blend:0));
   if(blend>=1)manual=null;
  }else{
   const phase=storyTime/chapterDuration%3;
   const current=Math.floor(phase),next=(current+1)%3;
   const blend=T.MathUtils.smoothstep(phase-current,7/9,1);
   weights=[0,0,0];weights[current]=1-blend;weights[next]=blend;
   setChapter(blend<.5?current:next);
  }
  world.update(elapsed,chapter*.5,weights);
  tiltX+=(targetX-tiltX)*.07;tiltY+=(targetY-tiltY)*.07;
  world.scene.rotation.x=tiltX;world.scene.rotation.y=tiltY;
  renderer.render(world.scene,world.camera);
 }
 chooseChapter=i=>{
  manual=paused||reduced.matches?null:{from:weights.slice(),target:i,start:elapsed};
  storyTime=i*chapterDuration;
  setChapter(i);
  if(!contextLost)render();
 };
 function resize(){
  const rect=host.getBoundingClientRect();
  renderer.shadowMap.enabled=rect.width>760;
  renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);
  world.resize(rect.width,rect.height,window.innerWidth<=760);
  updateHeader();
  render();
 }
 function tick(time){
  frame=0;
  if(paused||!visible||document.hidden||contextLost){last=null;return;}
  if(last!==null){const delta=Math.min(80,time-last);elapsed+=delta;storyTime+=delta;}
  last=time;
  if(time-lastPaint>=1000/30){render();lastPaint=time;}
  frame=window.requestAnimationFrame(tick);
 }
 function refresh(){
  const active=!paused&&visible&&!document.hidden&&!contextLost;
  document.body.classList.toggle('hero-motion-running',active);
  if(active&&!frame){last=null;lastPaint=-100;frame=window.requestAnimationFrame(tick);}
  if(!active&&frame){window.cancelAnimationFrame(frame);frame=0;last=null;}
 }
 function updateToggle(){
  document.body.classList.toggle('motion-paused',paused);
  if(toggle){
   toggle.setAttribute('aria-pressed',String(paused));
   toggle.innerHTML=paused
    ?'Resume motion <span><i class="ui-icon ui-play" aria-hidden="true"></i></span>'
    :'Pause motion <span><i class="ui-icon ui-pause" aria-hidden="true"></i></span>';
  }
  refresh();
 }
 if(toggle)toggle.addEventListener('click',()=>{paused=!paused;updateToggle();});
 reduced.addEventListener('change',()=>{
  paused=reduced.matches;
  if(paused){manual=null;storyTime=chapter*chapterDuration;if(!contextLost)render();}
  updateToggle();
 });
 document.addEventListener('visibilitychange',refresh);
 hero.addEventListener('pointermove',e=>{
  if(paused||!fine.matches)return;
  const r=hero.getBoundingClientRect();
  targetX=((e.clientY-r.top)/r.height-.5)*.032;
  targetY=((e.clientX-r.left)/r.width-.5)*.042;
 });
 hero.addEventListener('pointerleave',()=>{targetX=targetY=0;});
 canvas.addEventListener('webglcontextlost',e=>{
  e.preventDefault();contextLost=true;host.dataset.webglReady='false';
  if(toggle)toggle.hidden=true;refresh();
 });
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(host);
 else window.addEventListener('resize',resize);
 if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;refresh();
 },{threshold:.01}).observe(host);
 try {resize();host.dataset.webglReady='true';updateToggle();}
 catch(error){contextLost=true;host.dataset.webglReady='false';if(toggle)toggle.hidden=true;refresh();}
})();

