
(function (root, factory) {
 if (typeof module === 'object' && module.exports) module.exports = factory;
 else root.createMorphologyWorld = factory;
})(typeof window !== 'undefined' ? window : this, function (T) {
 'use strict';
 const scene = new T.Scene();
 scene.fog = new T.FogExp2(0xf7f8fa, 0.012);
 const camera = new T.OrthographicCamera(-10,10,5,-5,0.1,80);
 camera.position.set(0,8,14); camera.lookAt(0,0,0); camera.updateMatrixWorld();
 scene.add(new T.HemisphereLight(0xfffcf5,0x38332f,1.25));
 const key = new T.DirectionalLight(0xffffff,4.0);key.position.set(-4,10,7);key.castShadow=true;
 key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:.1,far:42});key.shadow.bias=-.00045;key.shadow.normalBias=.022;scene.add(key);
 const rim = new T.DirectionalLight(0xffe9c8,2.0);rim.position.set(7,4,-5);scene.add(rim);
 const fill = new T.DirectionalLight(0xffffff,.85);fill.position.set(-7,2,-5);scene.add(fill);
 const travelingLight=new T.PointLight(0xffba57,3.4,11,2);scene.add(travelingLight);
 const grainData=new Uint8Array(256*256*4);let seed=4093;
 for(let i=0;i<256*256;i++){seed=(seed*1664525+1013904223)>>>0;const v=190+(seed>>>28)*3;grainData.set([v,v,v,255],i*4);}
 const grain=new T.DataTexture(grainData,256,256);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(3,3);grain.needsUpdate=true;
 const shadeData=new Uint8Array(64*64*4);
 for(let y=0;y<64;y++)for(let x=0;x<64;x++){const d=Math.hypot((x-31.5)/31.5,(y-31.5)/31.5);const alpha=Math.pow(Math.max(0,1-d),2)*105;shadeData.set([28,24,21,alpha],(y*64+x)*4);}
 const contactTexture=new T.DataTexture(shadeData,64,64);contactTexture.needsUpdate=true;
 const materials = {
  silicon:new T.MeshPhysicalMaterial({color:0x626367,metalness:.54,roughness:.39,clearcoat:.12,clearcoatRoughness:.35,bumpMap:grain,bumpScale:.0035,envMapIntensity:.72}),
  membrane:new T.MeshPhysicalMaterial({color:0x828386,metalness:.50,roughness:.38,clearcoat:.14,side:T.DoubleSide,bumpMap:grain,bumpScale:.002,envMapIntensity:.72}),
  dark:new T.MeshStandardMaterial({color:0x303134,metalness:.48,roughness:.40}),
  gold:new T.MeshPhysicalMaterial({color:0xedb935,metalness:.85,roughness:.21,clearcoat:.35}),
  ceramic:new T.MeshPhysicalMaterial({color:0xcd6726,metalness:.30,roughness:.28,clearcoat:.45}),
  polymer:new T.MeshPhysicalMaterial({color:0xc6bba5,metalness:.10,roughness:.28,clearcoat:.7,side:T.DoubleSide}),
  tissue:new T.MeshPhysicalMaterial({color:0xd9a099,metalness:0,roughness:.48,transparent:true,opacity:.64}),
  fluid:new T.MeshPhysicalMaterial({color:0x50b9a7,metalness:.02,roughness:.10,transparent:true,opacity:.63,clearcoat:.8}),
  bio:new T.MeshPhysicalMaterial({color:0x30a580,metalness:.12,roughness:.25,clearcoat:.5}),
  violet:new T.MeshPhysicalMaterial({color:0x6854ae,metalness:.10,roughness:.24,clearcoat:.45}),
  coral:new T.MeshPhysicalMaterial({color:0xd7536f,metalness:.10,roughness:.26,clearcoat:.4}),
  shadow:new T.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false,toneMapped:false,opacity:.55})
 };
 function mesh(geometry,mat,parent){const m=new T.Mesh(geometry,mat);m.castShadow=!mat.transparent;m.receiveShadow=true;if(parent)parent.add(m);return m;}
 function box(w,h,d,mat,parent){
  if(w<.28||d<.28)return mesh(new T.BoxGeometry(w,h,d),mat,parent);
  const bevel=Math.min(.028,h*.23),shape=rounded(w-bevel*2,d-bevel*2,Math.min(.12,w*.14,d*.14));
  const g=new T.ExtrudeGeometry(shape,{depth:Math.max(.005,h-bevel*2),bevelEnabled:true,bevelSegments:3,bevelSize:bevel,bevelThickness:bevel,curveSegments:8});
  g.translate(0,0,-(h-bevel*2)/2);g.rotateX(-Math.PI/2);return mesh(g,mat,parent);
 }
 function slab(w,d,parent,mat=materials.silicon){
  const m=box(w,.18,d,mat,parent);m.position.y=-.13;
  const contact=mesh(new T.PlaneGeometry(w*1.30,d*1.30),materials.shadow,parent);contact.rotation.x=-Math.PI/2;contact.position.y=-.235;contact.castShadow=false;contact.receiveShadow=false;
  return m;
 }
 function surface(w,d,nx,nz,parent,mat) {
  const geo=new T.PlaneGeometry(w,d,nx,nz);geo.rotateX(-Math.PI/2);
  const base=new Float32Array(geo.attributes.position.array);
  const m=mesh(geo,mat,parent);
  return {mesh:m,geo,base};
 }
 function deform(surf,fn){
  const a=surf.geo.attributes.position;
  for(let i=0;i<a.count;i++){
   const x=surf.base[i*3],y=surf.base[i*3+1],z=surf.base[i*3+2];
   a.setXYZ(i,x,y+fn(x,z),z);
  }
  a.needsUpdate=true;surf.geo.computeVertexNormals();
 }
 function rounded(w,h,r){
  const s=new T.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
 }
 const objects=[];
 function object(kind,baseScale,desktop,mobile){
  const anchor=new T.Group(),body=new T.Group();anchor.add(body);scene.add(anchor);
  const entry={kind,anchor,body,baseScale,desktop,mobile};objects.push(entry);return entry;
 }
 const evolution=object('evolution',1.14,[.74,.52],[.48,.47]);
 slab(3.65,2.75,evolution.body,materials.dark);
 const hill=surface(3.6,2.7,36,28,evolution.body,materials.membrane);

 function sectionBlock(w,h,depth,holes,mat,parent){
  const shape=rounded(w,h,.10);
  holes.forEach(q=>{const outline=rounded(q[2],q[3],Math.min(q[2],q[3])*.47).getPoints(48);const path=new T.Path();outline.forEach((v,i)=>{if(i)path.lineTo(v.x+q[0],v.y+q[1]);else path.moveTo(v.x+q[0],v.y+q[1]);});path.closePath();shape.holes.push(path);});
  const geometry=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.018,bevelThickness:.018,curveSegments:12});
  geometry.translate(0,0,-depth/2);return mesh(geometry,mat,parent);
 }
 const evolutionStates=[];
 for(let n=0;n<4;n++){
  const holes=[];
  if(n<2)for(let i=0;i<12;i++)holes.push([-1.49+i*.27,0,n===0?.11:.18,n===0?.55:.46]);
  if(n===2)for(let i=0;i<5;i++)holes.push([-1.25+i*.625,0,.52,.34]);
  if(n===3)holes.push([0,0,3.12,.25]);
  const material=materials.silicon.clone();
  const block=sectionBlock(3.65,.76,2.55,holes,material,evolution.body);block.position.y=.23;evolutionStates.push(block);
 }
 hill.mesh.position.y=.615;
 const seeds=[];
 for(let r=0;r<3;r++)for(let c=0;c<5;c++){
  const m=box(.38,.045,.32,materials.silicon,evolution.body);
  m.position.set(-1.42+c*.67,.65,-.88+r*.76);seeds.push(m);
 }
 // Local thermal shading: only the central evolving silicon structure heats up.
 const thermalUniforms={uAnneal:{value:0},uAnnealTint:{value:new T.Color(0xff6418)}};
 const thermalTargets=[];
 evolution.body.traverse(o=>{
  if(!o.isMesh||o.material===materials.shadow)return;
  const mat=o.material.clone();o.material=mat;
  const offset={value:o.position.y};
  mat.onBeforeCompile=shader=>{
   Object.assign(shader.uniforms,thermalUniforms,{uThermalOffset:offset});
   shader.vertexShader='uniform float uThermalOffset; varying float vThermalHeight;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvThermalHeight=transformed.y+uThermalOffset;');
   shader.fragmentShader='uniform float uAnneal; uniform vec3 uAnnealTint; varying float vThermalHeight;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat thermalTop=smoothstep(-0.20,0.72,vThermalHeight);\ndiffuseColor.rgb=mix(diffuseColor.rgb,uAnnealTint,uAnneal*(0.20+0.56*thermalTop));');
   shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=uAnnealTint*pow(uAnneal,1.6)*(0.10+1.5*thermalTop);');
  };
  mat.customProgramCacheKey=()=> 'central-anneal-v1';
  thermalTargets.push({mesh:o,material:mat});
 });
 // Feathered light texture, shared by the laser focus and the soft rising heat haze.
 const glowPixels=new Uint8Array(64*64*4);
 for(let y=0;y<64;y++)for(let x=0;x<64;x++){
  const d=Math.hypot((x-31.5)/31.5,(y-31.5)/31.5),a=Math.max(0,Math.exp(-d*d*5)-Math.exp(-5));
  glowPixels.set([255,255,255,Math.round(a*255)],(y*64+x)*4);
 }
 const glowTexture=new T.DataTexture(glowPixels,64,64);glowTexture.needsUpdate=true;
 function glowSprite(parent,color){
  const m=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));parent.add(m);return m;
 }
 const heatPlumes=[];
 for(let i=0;i<7;i++){const sprite=glowSprite(evolution.body,0xffa143);heatPlumes.push(sprite);}
 const heatRimPoints=rounded(3.66,2.76,.10).getPoints(64).map(v=>new T.Vector3(v.x,.66,v.y));
 const heatRim=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(heatRimPoints,true),160,.012,5,true),new T.MeshBasicMaterial({color:0xffa332,transparent:true,opacity:0,depthWrite:false,toneMapped:false}),evolution.body);heatRim.castShadow=false;
 const annealLight=new T.PointLight(0xff8b32,0,4.2,2);annealLight.position.set(0,1.05,0);evolution.body.add(annealLight);
 const thermal={uniforms:thermalUniforms,targets:thermalTargets,plumes:heatPlumes,rim:heatRim,light:annealLight};
 const pillars=object('pillars',.86,[.87,.27],[.78,.22]);
 slab(3.1,2.65,pillars.body);
 const profile=[];for(let i=0;i<=32;i++)profile.push(new T.Vector2(.14,i/32));
 const pillarGeo=new T.LatheGeometry(profile,20);
 const pillarBase=new Float32Array(pillarGeo.attributes.position.array);
 const pillarField=new T.InstancedMesh(pillarGeo,materials.silicon,30);pillars.body.add(pillarField);
 pillarField.instanceMatrix.setUsage(T.DynamicDrawUsage);pillarField.frustumCulled=false;pillarField.castShadow=pillarField.receiveShadow=true;
 // Two converging, softly feathered beams follow the top of one moving pillar.
 const laserGroup=new T.Group();pillars.body.add(laserGroup);
 const laserBeams=[];
 const laserVertex=`varying vec2 vBeamUv; void main(){vBeamUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
 const laserFragment=`uniform vec3 uTint; uniform float uPower;
 void main(){gl_FragColor=vec4(uTint,uPower*.96);}`;
 for(const [color,offset] of [[0xff3030,[-2.25,3.5,-.55]],[0x25e568,[-1.18,3.7,-.15]]]){
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([-.022,0,0,.022,0,0,-.270,1,0,.270,1,0],3));
  geo.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,0,1,1,1],2));geo.setIndex([0,1,2,2,1,3]);
  const material=new T.ShaderMaterial({uniforms:{uTint:{value:new T.Color(color)},uPower:{value:0}},vertexShader:laserVertex,fragmentShader:laserFragment,side:T.DoubleSide,transparent:true,depthWrite:false,blending:T.NormalBlending,toneMapped:false});
  const beam=mesh(geo,material,laserGroup);beam.frustumCulled=false;beam.castShadow=beam.receiveShadow=false;laserBeams.push({mesh:beam,offset:new T.Vector3(...offset)});
 }
 const laserFocus=glowSprite(laserGroup,0xffffd6),laserHalo=glowSprite(laserGroup,0xe8edaf);
 const laserCore=mesh(new T.SphereGeometry(.030,16,12),new T.MeshBasicMaterial({color:0xfff5ce,transparent:true,opacity:0,toneMapped:false}),laserGroup);laserCore.castShadow=false;
 const laserLight=new T.PointLight(0xf2edc5,0,2.2,2);laserGroup.add(laserLight);
 const laser={group:laserGroup,beams:laserBeams,focus:laserFocus,halo:laserHalo,core:laserCore,light:laserLight,power:0};
 const laserMatrix=new T.Matrix4(),laserBasis=new T.Matrix4(),laserTip=new T.Vector3(),laserCamera=new T.Vector3(),laserDirection=new T.Vector3(),laserRight=new T.Vector3(),laserNormal=new T.Vector3();
 const particles=object('particles',.98,[.57,.32],[.23,.24]);
 // The upper-left array retains soft reflections, slightly more matte than the upper-right pillars.
 const matteSilicon=materials.silicon.clone();
 matteSilicon.roughness=.47;matteSilicon.clearcoat=.10;matteSilicon.envMapIntensity=.66;
 slab(2.45,2.0,particles.body,matteSilicon);
 const particleField=new T.InstancedMesh(new T.SphereGeometry(.205,32,24),matteSilicon,20);particles.body.add(particleField);
 particleField.instanceMatrix.setUsage(T.DynamicDrawUsage);particleField.frustumCulled=false;particleField.castShadow=particleField.receiveShadow=true;
 const pedestalField=new T.InstancedMesh(new T.CylinderGeometry(.042,.115,1,16),matteSilicon,20);
 pedestalField.instanceMatrix.setUsage(T.DynamicDrawUsage);pedestalField.frustumCulled=false;pedestalField.castShadow=pedestalField.receiveShadow=true;particles.body.add(pedestalField);

 const perforation=object('holes',.75,[.89,.80],[.79,.73]);
 slab(2.9,2.3,perforation.body,materials.dark);
 const shape=rounded(2.85,2.1,.13);
 for(let r=0;r<4;r++)for(let c=0;c<6;c++){
  const h=new T.Path();h.absarc(-1.04+c*.415,-.66+r*.44,.115,0,Math.PI*2,true);shape.holes.push(h);
 }
 const holeGeo=new T.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.018,bevelThickness:.018,curveSegments:14});holeGeo.rotateX(-Math.PI/2);
 const holeMesh=mesh(holeGeo,materials.membrane,perforation.body);holeMesh.position.y=.53;
 const holeBase=new Float32Array(holeGeo.attributes.position.array);
 for(const x of [-1.25,1.25])for(const z of [-.88,.88]){const m=box(.12,.53,.12,materials.silicon,perforation.body);m.position.set(x,.22,z);}
 const cavity=object('cavities',.86,[.64,.77],[.33,.78]);
 slab(2.65,2.0,cavity.body,materials.dark);
 const layers=[0,1,2].map(i=>surface(2.55,1.9,18,14,cavity.body,i===2?materials.membrane:materials.silicon));
 const supports=[];
 for(const x of [-1.12,1.12])for(const z of [-.79,.79]){const m=box(.13,1,.13,materials.silicon,cavity.body);m.position.set(x,.4,z);supports.push(m);}

 layers.forEach(s=>s.mesh.visible=false);supports.forEach(m=>m.visible=false);
 // Rounded cutaway exposes the buried cavities without turning the scene into a block diagram.
 const cavityBlocks=[];
 for(let count=1;count<=4;count++){
  const group=new T.Group();group.userData.cavityCount=count;cavity.body.add(group);
  const height=1.35,plate=.14,gap=(height-plate*(count+1))/count;
  for(let j=0;j<=count;j++){
   const disc=mesh(new T.CylinderGeometry(1.16,1.16,plate,80),j===count?materials.membrane:materials.silicon,group);disc.position.y=-.04+plate/2+j*(plate+gap);
  }
  const start=-Math.PI/2+.88,end=Math.PI*1.5-.88;
  for(let j=0;j<count;j++){
   const ring=new T.Shape();ring.absarc(0,0,1.16,start,end,false);ring.lineTo(Math.cos(end)*.94,Math.sin(end)*.94);ring.absarc(0,0,.94,end,start,true);ring.closePath();
   const geo=new T.ExtrudeGeometry(ring,{depth:gap+.012,steps:1,bevelEnabled:true,bevelSegments:2,bevelThickness:.012,bevelSize:.012,curveSegments:40});geo.rotateX(-Math.PI/2);
   const wall=mesh(geo,materials.silicon,group);wall.position.y=-.04+plate+j*(plate+gap);
  }
  cavityBlocks.push(group);
 }
 const piezoAssembly=new T.Group();cavity.body.add(piezoAssembly);
 // Layered piezoelectric active film and warm metallic electrode.
 mesh(new T.CylinderGeometry(.70,.70,.040,64),materials.gold,piezoAssembly);
 const film=mesh(new T.CylinderGeometry(.56,.56,.025,64),materials.ceramic,piezoAssembly);film.position.y=.032;
 const top=mesh(new T.CylinderGeometry(.41,.41,.018,64),materials.gold,piezoAssembly);top.position.y=.053;
 const electrodeRing=mesh(new T.TorusGeometry(.61,.018,8,64),materials.dark,piezoAssembly);electrodeRing.rotation.x=-Math.PI/2;electrodeRing.position.y=.033;
 for(const x of [-1.03,1.03]){const pad=box(.22,.018,.56,materials.gold,piezoAssembly);pad.position.set(x,0,0);}
 function pulseSet(parent,downward=false){
  const waves=[];
  for(let i=0;i<4;i++){
   const mat=new T.MeshBasicMaterial({color:i%2?0xf8bb62:0x71c8e6,transparent:true,opacity:0,depthWrite:false,toneMapped:false});
   const line=mesh(new T.TorusGeometry(1,.010,6,80),mat,parent);line.rotation.x=-Math.PI/2;line.castShadow=line.receiveShadow=false;
   const halo=mesh(new T.TorusGeometry(1,.040,6,80),mat.clone(),line);halo.material.opacity=0;halo.material.blending=T.AdditiveBlending;halo.castShadow=halo.receiveShadow=false;
   waves.push({line,halo,returning:i%2===1,downward});
  }
  return waves;
 }
 const acousticWaves=pulseSet(cavity.body);
 const resonator=object('devices',.78,[.94,.53],[.82,.48]);
 slab(2.7,1.85,resonator.body,materials.dark);
 const shuttle=new T.Group();resonator.body.add(shuttle);shuttle.position.y=.32;
 const mass=box(.8,.12,.62,materials.silicon,shuttle);mass.position.y=.05;
 for(let i=0;i<8;i++){
  const x=-.76+i*.21;
  const moving=box(.085,.10,.48,materials.silicon,shuttle);moving.position.set(x,.04,.46);
  const fixed=box(.085,.10,.48,materials.silicon,resonator.body);fixed.position.set(x+.105,.36,.64);
 }
 for(const x of [-1.13,1.13]){
  const pad=box(.30,.035,.3,materials.gold,resonator.body);pad.position.set(x,.01,-.55);
  const beam=box(.52,.055,.065,materials.silicon,shuttle);beam.position.set(x*.7,.035,-.05);
 }

 const droplet=mesh(new T.SphereGeometry(.29,24,16),materials.fluid,shuttle);droplet.position.set(0,.28,-.04);droplet.scale.set(1,.65,.82);
 const samples=[];
 for(let i=0;i<7;i++){
  const mat=[materials.bio,materials.violet,materials.coral,materials.gold][i%4];
  const sample=mesh(new T.SphereGeometry(.055+(i%3)*.013,12,10),mat,shuttle);samples.push(sample);
 }
 const receptors=[];
 for(let i=0;i<3;i++){
  const receptor=new T.Group();shuttle.add(receptor);receptor.position.set(-.24+i*.24,.16,-.13);
  for(const side of [-1,1]){const arm=mesh(new T.CylinderGeometry(.021,.021,.20,10),i%2?materials.violet:materials.bio,receptor);arm.position.set(side*.052,.12,0);arm.rotation.z=-side*.53;}
  const stem=mesh(new T.CylinderGeometry(.024,.024,.13,10),materials.violet,receptor);stem.position.y=.025;receptors.push(receptor);
 }
 const ghost=object('flexible',.84,[.38,.80],[.18,.58]);

 const ghostSurface=surface(3.0,1.65,30,18,ghost.body,materials.polymer);
 const flexElements=[];
 for(let r=0;r<2;r++)for(let c=0;c<5;c++){
  const element=new T.Group();ghost.body.add(element);
  box(.40,.018,.44,materials.gold,element);
  const active=box(.35,.035,.39,materials.ceramic,element);active.position.y=.020;
  const pad=box(.29,.012,.32,materials.gold,element);pad.position.y=.047;
  flexElements.push({element,x:-1.18+c*.59,z:-.43+r*.86});
 }
 const tissue=mesh(new T.SphereGeometry(1,28,18),materials.tissue,ghost.body);tissue.scale.set(1.55,.31,.79);tissue.position.y=-.66;
 const vesselCurve=new T.CatmullRomCurve3([new T.Vector3(-1.3,-.61,-.1),new T.Vector3(-.4,-.57,.13),new T.Vector3(.5,-.61,-.05),new T.Vector3(1.3,-.65,.1)]);
 const vessel=mesh(new T.TubeGeometry(vesselCurve,30,.043,8,false),new T.MeshStandardMaterial({color:0xad697a,roughness:.55,transparent:true,opacity:.7}),ghost.body);
 const medicalWaves=pulseSet(ghost.body,true);
 // Temporal continuity replaces physical connector lines.
 const ribbons=[];
 let width=1200,height=620,mobile=false,viewHeight=9.7;
 const right=new T.Vector3(),up=new T.Vector3(),forward=new T.Vector3();
 const dummy=new T.Object3D();
 function place(entry,t,index){
  const target=mobile?entry.mobile:entry.desktop;
  const drift=.008;
  const flow=t*.18-index*.24;
  const sx=target[0]+Math.sin(t*.18)*.014+Math.sin(flow)*drift;
  const sy=target[1]+Math.cos(t*.18)*.012+Math.cos(flow)*drift;
  const w=viewHeight*width/height;
  entry.anchor.position.copy(right).multiplyScalar((sx-.5)*w).addScaledVector(up,(.5-sy)*viewHeight).addScaledVector(forward,index*.035);
  entry.body.rotation.y=Math.sin(t*.18-index*.24)*.16 + (index%2?.12:-.12);
  entry.body.rotation.z=Math.sin(t*.18-index*.24)*.025;
  const phase=t/18*Math.PI*2;
  const chapter=entry.kind==='evolution'?0:entry.kind==='devices'||entry.kind==='cavities'||entry.kind==='flexible'?2:1;
  const focus=.5+.5*Math.cos(phase-chapter*Math.PI*2/3);
  const scale=entry.baseScale*(mobile?.80:1)*(.81+.35*focus);
  entry.body.scale.setScalar(scale);
  entry.anchor.visible=true;
 }
 function update(ms){
  const t=ms*.001;
  for(let i=0;i<objects.length;i++)place(objects[i],t,i);
  const morphology=.5-.5*Math.cos(t*.36);
  const pillarMorph=.5-.5*Math.cos(t*.36-.38);
  const particleMorph=.5-.5*Math.cos(t*.36-.75);
  const stageValue=morphology*3;
  const heat=T.MathUtils.smoothstep(morphology,.04,.97);
  thermalUniforms.uAnneal.value=heat;
  heatRim.material.opacity=heat*.78;annealLight.intensity=heat*heat*2.3;
  heatPlumes.forEach((sprite,i)=>{
   const rise=(t*.19+i*.137)%1;
   sprite.position.set(-1.40+i*.46+.07*Math.sin(t*1.1+i),.78+rise*.82,-.65+(i%3)*.58);
   sprite.scale.set(.26+rise*.22,.40+rise*.45,1);
   sprite.material.opacity=heat*.14*Math.sin(rise*Math.PI);
  });

  evolutionStates.forEach((m,i)=>{m.visible=i===Math.min(3,Math.round(stageValue));});
  deform(hill,(x,z)=>{
   const bumps=Math.pow(Math.cos(x*2.8+t*.18)*Math.cos(z*3.4),2);
   return .015+morphology*(.025+.15*bumps)+.018*Math.sin(x*1.7+z+t*.32);
  });
  seeds.forEach((m,i)=>{m.scale.y=.3+1.9*(1-morphology);m.position.y=.655+Math.sin(i*.7)*.008;});

  const pp=pillarGeo.attributes.position;
  for(let i=0;i<pp.count;i++){
   const u=pillarBase[i*3+1],angle=Math.atan2(pillarBase[i*3],pillarBase[i*3+2]);
   const cap=Math.sqrt(Math.max(0,1-Math.pow(Math.max(0,(u-.84)/.16),2)));
   const original=.14*cap;
   const blend=Math.min(1,Math.max(0,(u-.42)/.14));const smooth=blend*blend*(3-2*blend);
   const bulb=.27*Math.sqrt(Math.max(0,1-Math.pow((u-.73)/.27,2)));
   const foot=.055+.20*Math.exp(-u/.055);
   const evolved=foot*(1-smooth)+bulb*smooth;
   const radius=original*(1-pillarMorph)+evolved*pillarMorph;
   pp.setXYZ(i,Math.sin(angle)*radius,u*(1+.12*pillarMorph),Math.cos(angle)*radius);
  }
  pp.needsUpdate=true;pillarGeo.computeVertexNormals();
  let index=0;
  for(let r=0;r<5;r++)for(let c=0;c<6;c++){
   const h=.78+c*.065+.12*Math.sin(t*.55+r*.5+c*.37);
   dummy.position.set((-2.5+c)*(.47-.04*pillarMorph),-.045,(-2+r)*(.47-.04*pillarMorph));
   dummy.rotation.set(0,0,0);dummy.scale.set(1,h,1);dummy.updateMatrix();pillarField.setMatrixAt(index++,dummy.matrix);
  }
  pillarField.instanceMatrix.needsUpdate=true;
  const growth=Math.sin(t*.36-.38);
  laser.power=T.MathUtils.smoothstep(growth,.12,.65);
  laserGroup.visible=laser.power>.002;
  pillarField.getMatrixAt(15,laserMatrix);
  laserTip.set(0,1+.12*pillarMorph,0).applyMatrix4(laserMatrix);laserTip.y+=.012;
  pillars.body.updateWorldMatrix(true,false);laserCamera.copy(camera.position);pillars.body.worldToLocal(laserCamera);
  laserBeams.forEach((beam,i)=>{
   laserDirection.copy(beam.offset).normalize();
   laserRight.crossVectors(laserDirection,laserNormal.subVectors(laserCamera,laserTip)).normalize();
   laserNormal.crossVectors(laserRight,laserDirection).normalize();laserBasis.makeBasis(laserRight,laserDirection,laserNormal);
   beam.mesh.position.copy(laserTip);beam.mesh.quaternion.setFromRotationMatrix(laserBasis);beam.mesh.scale.set(1,beam.offset.length(),1);
   beam.mesh.material.uniforms.uPower.value=laser.power*(i===0?.94:.78);
  });
  laserFocus.position.copy(laserTip);laserFocus.scale.setScalar(.30+.06*Math.sin(t*2));laserFocus.material.opacity=laser.power*.96;
  laserHalo.position.copy(laserTip);laserHalo.scale.setScalar(.68);laserHalo.material.opacity=laser.power*.40;
  laserCore.position.copy(laserTip);laserCore.material.opacity=laser.power;
  laserLight.position.copy(laserTip).add(new T.Vector3(0,.08,0));laserLight.intensity=laser.power*3.0;

  index=0;
  for(let r=0;r<4;r++)for(let c=0;c<5;c++){
   const breath=.5+.5*Math.sin(t*.5+r*.6+c*.4);
   const radius=.84+.20*breath,aspect=.75+c*.15,stem=.10+.18*particleMorph;
   const px=(-2+c)*(.47-.055*particleMorph),pz=(-1.5+r)*(.47-.055*particleMorph);
   dummy.position.set(px,stem+.205*aspect,pz);dummy.scale.set(radius,aspect,radius);dummy.rotation.set(0,0,0);dummy.updateMatrix();particleField.setMatrixAt(index,dummy.matrix);
   dummy.position.set(px,stem*.5-.025,pz);dummy.scale.set(1,stem,1);dummy.updateMatrix();pedestalField.setMatrixAt(index++,dummy.matrix);
  }
  particleField.instanceMatrix.needsUpdate=true;pedestalField.instanceMatrix.needsUpdate=true;
  const hp=holeGeo.attributes.position;
  for(let i=0;i<hp.count;i++){
   let x=holeBase[i*3],y=holeBase[i*3+1],z=holeBase[i*3+2];
   const cx=-1.04+Math.round((x+1.04)/.415)*.415,cz=-.66+Math.round((z+.66)/.44)*.44;
   const dx=x-cx,dz=z-cz,dist=Math.hypot(dx,dz);
   if(dist<.145&&cx>=-1.05&&cx<=1.05&&cz>=-.67&&cz<=.67){const close=1-.76*morphology*Math.max(0,Math.min(1,y/.10));x=cx+dx*close;z=cz+dz*close;}
   hp.setXYZ(i,x,y+.035*Math.sin(t*1.5+x*1.8)*Math.cos(z*1.3),z);
  }
  hp.needsUpdate=true;holeGeo.computeVertexNormals();
  const gap=.23+.10*(.5+.5*Math.sin(t*.65));
  layers.forEach((layer,i)=>{layer.mesh.position.y=.02+i*gap;deform(layer,(x,z)=>i===0?0:.025*Math.sin(t*(i+1)*.9+x)*Math.cos(z*1.2));});
  supports.forEach(m=>{m.scale.y=2*gap+.12;m.position.y=gap-.01;});

  const layerCount=1+Math.min(3,Math.floor(morphology*4));
  cavityBlocks.forEach((m,i)=>{m.visible=i===layerCount-1;});
  piezoAssembly.position.y=1.335+.016*Math.sin(t*2.4);
  const bend=(x,z)=>.03+.22*Math.cos(x*.9+t*.35)+.035*Math.sin(z*2+t*.5);
  deform(ghostSurface,bend);
  flexElements.forEach(({element,x,z})=>{element.position.set(x,bend(x,z)+.045,z);element.rotation.z=Math.atan(-.22*.9*Math.sin(x*.9+t*.35));});
  [...acousticWaves,...medicalWaves].forEach((wave,i)=>{
   const phase=(t*.35+i*.24)%1;
   const progress=wave.returning?1-phase:phase;
   wave.line.position.y=wave.downward?.05-progress*.72:1.48+progress*.95;
   const r=(wave.downward?.24:.34)+progress*(wave.downward?.75:.55);
   wave.line.scale.set(r,r*.7,1);
   wave.line.material.opacity=Math.sin(phase*Math.PI)*(wave.returning?.45:.65);
   wave.halo.material.opacity=wave.line.material.opacity*.13;
  });
  const loading=.5-.5*Math.cos(t*.45);
  shuttle.position.x=.11*Math.sin(t*(2.7-.75*loading));
  droplet.scale.set(.78+.14*loading,.55+.18*loading,.72+.12*loading);
  samples.forEach((sample,i)=>{
   const settle=Math.max(0,Math.min(1,loading*1.6-i*.09)),angle=i*2.4;
   sample.position.set(Math.cos(angle)*(.18+.12*(1-settle)),.17+(1-settle)*(.6+i*.04),Math.sin(angle)*.20);
   sample.scale.setScalar(.65+.35*settle);
  });
  scene.updateMatrixWorld(true);
  const sweep=.5+.5*Math.sin(t*.18-.4);
  travelingLight.position.copy(right).multiplyScalar((.53+sweep*.40-.5)*viewHeight*width/height).addScaledVector(up,(.5-(.32+sweep*.40))*viewHeight);travelingLight.position.y+=1.4;
  return Math.floor((t%18)/6);
 }
 function resize(w,h,compact=false){
  width=Math.max(1,w);height=Math.max(1,h);mobile=compact||width/height<1.15;
  viewHeight=mobile?10.7:9.7;
  const viewWidth=viewHeight*width/height;
  camera.left=-viewWidth/2;camera.right=viewWidth/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;
  camera.updateProjectionMatrix();camera.updateMatrixWorld();
  right.set(1,0,0).applyQuaternion(camera.quaternion);up.set(0,1,0).applyQuaternion(camera.quaternion);forward.set(0,0,1).applyQuaternion(camera.quaternion);
 }
 resize(width,height);update(0);
 return {scene,camera,objects,materials,resize,update,inspect:{hill,pillarField,particleField,layers,shuttle,holeGeo,pillarGeo,pedestalField,evolutionStates,cavityBlocks,piezoAssembly,flexElements,ghostSurface,tissue,vessel,acousticWaves,medicalWaves,samples,droplet,ribbons,receptors,laser,thermal}};
});

