import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ArrowUpRight,Pause,Play,RotateCcw,ChevronLeft,ChevronRight} from 'lucide-react';
import projects from '../data/projects.json';
import {useReducedMotion} from '../hooks/useReducedMotion';
const colors=['#82f4d0','#b3a1ff','#ffc185'];
export default function ProjectWorld(){
 const host=useRef<HTMLDivElement>(null),selected=useRef(0),reset=useRef(()=>{});const [active,setActive]=useState(0),[paused,setPaused]=useState(false),[failed,setFailed]=useState(false);const reduced=useReducedMotion(),still=useRef(false);still.current=paused||reduced;selected.current=active;
 useEffect(()=>{
 const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch{setFailed(true);return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x070a10,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;el.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Three-dimensional project sculptures. Drag to orbit. Use the project buttons to select a case study.');
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x070a10,.035);const camera=new THREE.PerspectiveCamera(38,1,.1,90);camera.position.set(0,2.6,14);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableZoom=false;controls.enablePan=false;controls.enableDamping=true;controls.minPolarAngle=.6;controls.maxPolarAngle=2;controls.target.set(0,.2,0);controls.autoRotateSpeed=.3;
 scene.add(new THREE.HemisphereLight(0xcceaff,0x191528,3));const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(3,5,7);scene.add(key);const rim=new THREE.PointLight(0x8c72ff,70);rim.position.set(-4,1,-2);scene.add(rim);
 const world=new THREE.Group();scene.add(world);const sculptures:THREE.Group[]=[],pickable:THREE.Object3D[]=[];const resources:{dispose:()=>void}[]=[];
 function mesh(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D){resources.push(g,m);const o=new THREE.Mesh(g,m);parent.add(o);return o;}
 const material=(color:string)=>new THREE.MeshStandardMaterial({color,metalness:.65,roughness:.23,emissive:color,emissiveIntensity:.12});
 for(let index=0;index<3;index++){
 const group=new THREE.Group();world.add(group);sculptures.push(group);group.userData.index=index;
 const base=mesh(new THREE.CylinderGeometry(2.05,2.2,.12,64),new THREE.MeshStandardMaterial({color:0x192330,metalness:.8,roughness:.35}),group);base.position.y=-2;
 const ring=mesh(new THREE.TorusGeometry(2.08,.018,8,100),new THREE.MeshBasicMaterial({color:colors[index]}),group);ring.rotation.x=Math.PI/2;ring.position.y=-1.92;
 if(index===0){
 for(let i=0;i<3;i++){const torus=mesh(new THREE.TorusGeometry(1.35,.11,16,96),material(colors[index]),group);torus.rotation.set(i*Math.PI/3,i*Math.PI/3,.4);}
 const core=mesh(new THREE.IcosahedronGeometry(.62,1),material('#e5fff4'),group);core.rotation.z=.3;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const node=mesh(new THREE.SphereGeometry(.10,12,12),material(colors[index]),group);node.position.set(Math.cos(a)*1.8,Math.sin(a)*1.4,Math.sin(a*2)*.65);}
 }else if(index===1){
 for(let i=0;i<5;i++){const cube=mesh(new THREE.BoxGeometry(1.95,.24,1.95),material(colors[index]),group);cube.position.y=(i-2)*.5;cube.rotation.y=i*.28;const edges=new THREE.EdgesGeometry(cube.geometry),mat=new THREE.LineBasicMaterial({color:0xe7dcff});resources.push(edges,mat);cube.add(new THREE.LineSegments(edges,mat));}
 }else{
 for(let i=0;i<7;i++){const arc=mesh(new THREE.TorusGeometry(.45+i*.18,.055,12,80,Math.PI*1.65),material(colors[index]),group);arc.position.z=(i-3)*.17;arc.rotation.z=i*.5;}
 const core=mesh(new THREE.SphereGeometry(.27,24,24),material('#fff0da'),group);core.position.z=.8;
 }
 group.traverse(o=>{if(o instanceof THREE.Mesh){o.userData.index=index;pickable.push(o);}});
 }
 const dust=new THREE.BufferGeometry(),positions=[];for(let i=0;i<350;i++){const a=i*2.39996;positions.push(Math.cos(a)*(4+i%17),Math.sin(i*7.1)*8,Math.sin(a)*(4+i%13)-5);}dust.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));const dustMat=new THREE.PointsMaterial({color:0x99b9d5,size:.026,transparent:true,opacity:.5});resources.push(dust,dustMat);scene.add(new THREE.Points(dust,dustMat));
 let width=1;const resize=new ResizeObserver(()=>{width=el.clientWidth;renderer.setSize(width,el.clientHeight);camera.aspect=width/el.clientHeight;camera.position.z=width<650?18:14;camera.updateProjectionMatrix();});resize.observe(el);
 let visible=true;const intersection=new IntersectionObserver(e=>visible=e[0].isIntersecting);intersection.observe(el);let frame=0,time=0;const clock=new THREE.Clock();
 function render(){frame=requestAnimationFrame(render);const dt=Math.min(clock.getDelta(),.05);if(!visible||document.hidden)return;if(!still.current)time+=dt;controls.autoRotate=!still.current;controls.update();sculptures.forEach((g,i)=>{let offset=(i-selected.current+3)%3;if(offset===2)offset=-1;const x=offset*(width<650?4:4.9),z=offset===0?1:-3;const amount=still.current?1:1-Math.exp(-dt*5);g.position.x=THREE.MathUtils.lerp(g.position.x,x,amount);g.position.z=THREE.MathUtils.lerp(g.position.z,z,amount);g.position.y=Math.sin(time*.65+i)*.12;g.rotation.y=time*.14+i*.4;const s=offset===0?1:.67;g.scale.lerp(new THREE.Vector3(s,s,s),amount);});renderer.render(scene,camera);}render();
 let down={x:0,y:0};const start=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY}};const pick=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const rect=el.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(pickable)[0];if(hit)setActive(hit.object.userData.index);};
 const lost=(e:Event)=>{e.preventDefault();setFailed(true)};renderer.domElement.addEventListener('pointerdown',start);renderer.domElement.addEventListener('pointerup',pick);renderer.domElement.addEventListener('webglcontextlost',lost);reset.current=()=>{camera.position.set(0,2.6,width<650?18:14);controls.target.set(0,.2,0);controls.update()};
 return()=>{cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();controls.dispose();resources.forEach(x=>x.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 const project=projects[active];return <section className="project-world" style={{'--world-accent':colors[active]} as React.CSSProperties} aria-label="Interactive project gallery"><div className="world-intro"><span className="kicker">SAI KEERTHANA / SENIOR AI ENGINEER</span><h1>Intelligence.<br/><em>With dimension.</em></h1><p>Ten years turning complex data into systems people can use.</p><Link to="/contact" className="world-contact">Let’s build something <ArrowUpRight size={16}/></Link></div><div className="world-canvas" ref={host} hidden={failed}/>{failed&&<div className="world-unavailable">Explore the projects using the selector below.<br/>3D is unavailable on this device.</div>}<div className="world-toolbar"><span>{failed?'PROJECT GALLERY':'DRAG TO ORBIT · SELECT TO EXPLORE'}</span><button onClick={()=>setPaused(p=>!p)} aria-label={reduced?'Motion disabled by device preference':paused?'Resume motion':'Pause motion'} disabled={reduced}>{paused||reduced?<Play size={15}/>:<Pause size={15}/>}</button><button onClick={()=>reset.current()} aria-label="Reset camera"><RotateCcw size={15}/></button></div><div className="world-detail" aria-live="polite" key={active}><span className="kicker">0{active+1} / {project.industry}</span><h2>{project.company}</h2><p>{project.short}</p><div className="world-result"><strong>+{project.metric}</strong><span>{project.outcome}<small>Résumé-reported outcome</small></span></div><Link className="button primary" to={'/work/'+project.slug}>Inside the project <ArrowUpRight size={16}/></Link></div><div className="world-switcher"><button className="world-arrow" aria-label="Previous project" onClick={()=>setActive((active+2)%3)}><ChevronLeft size={20}/></button>{projects.map((p,i)=><button className="world-tab" key={p.slug} onClick={()=>setActive(i)} aria-pressed={i===active}><span>0{i+1}</span><b>{p.company}</b><small>{p.industry}</small></button>)}<button className="world-arrow" aria-label="Next project" onClick={()=>setActive((active+1)%3)}><ChevronRight size={20}/></button></div><div className="world-caption">Interactive sculptures represent project themes.</div></section>
}
