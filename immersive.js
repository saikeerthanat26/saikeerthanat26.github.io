/* Interactive 3D point-cloud visualization of the portfolio's skill areas. */
(()=>{
const hero=document.querySelector('.home-hero');if(!hero)return;
const wrap=document.querySelector('.scene-wrap');if(!wrap)return;
wrap.innerHTML='<div class="scene-label"><span class="kicker">EXPLORE THE ENGINEERING</span><button class="orbit-motion">Pause motion</button></div><canvas class="orbit-canvas" aria-label="Rotatable 3D skill network. Drag to rotate. Use the links below for each subject."></canvas><div class="orbit-caption"><span>Drag to rotate · Select a capability</span><b id="orbit-topic">Enterprise AI</b></div><div class="orbit-links"><a href="/work/clinical-intelligence/">Agentic AI</a><a href="/systems/#workflow">Retrieval</a><a href="/work/financial-knowledge/">Cloud</a><a href="/experience/#skills">Evaluation</a></div>';
const canvas=wrap.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx){canvas.hidden=true;return;}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let moving=!reduced.matches,angle=.2,tilt=.2,drag=false,lastX=0,lastY=0,moved=false,visible=true,points=[],width=0,height=0,lastTime=0;
const labels=['AGENTS','RETRIEVAL','PYTHON','CLOUD','EVALUATION','GOVERNANCE'];
const nodes=Array.from({length:70},(_,i)=>{const y=1-i/69*2,r=Math.sqrt(1-y*y),a=i*2.399963;return{x:Math.cos(a)*r,y,z:Math.sin(a)*r,label:i<6?labels[i]:null};});
// Spread the major capability nodes around the sphere.
nodes.forEach(n=>n.label=null);
[3,14,27,39,53,64].forEach((idx,i)=>{nodes[idx].label=labels[i];});
function size(){width=canvas.clientWidth;height=canvas.clientHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);}
new ResizeObserver(size).observe(canvas);
function draw(time){const dt=Math.min((time-lastTime)/1000||0,.05);lastTime=time;if(moving&&!drag&&visible&&!document.hidden)angle+=dt*.13;if(visible&&!document.hidden){ctx.clearRect(0,0,width,height);const radius=Math.min(width*.32,height*.36);points=nodes.map(n=>{const x=n.x*Math.cos(angle)+n.z*Math.sin(angle),z=-n.x*Math.sin(angle)+n.z*Math.cos(angle),y=n.y*Math.cos(tilt)-z*Math.sin(tilt),zz=n.y*Math.sin(tilt)+z*Math.cos(tilt),scale=3/(3-zz);return{x:width/2+x*radius*scale,y:height/2+y*radius*scale,z:zz,scale,label:n.label};});
for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];if(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.49){const p=points[i],q=points[j];ctx.strokeStyle='rgba(98,153,255,'+(.12+(p.z+q.z+2)*.045)+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
points.slice().sort((a,b)=>a.z-b.z).forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,(p.label?4:1.8)*p.scale,0,Math.PI*2);ctx.fillStyle=p.label?'#96fff0':'rgba(144,173,255,'+(.35+(p.z+1)*.3)+')';ctx.shadowBlur=p.label?14:0;ctx.shadowColor='#4be7d3';ctx.fill();ctx.shadowBlur=0;if(p.label){ctx.font='600 11px monospace';ctx.fillStyle='#dae9ff';ctx.fillText(p.label,p.x+10,p.y+4);}});
}requestAnimationFrame(draw);}
const motion=wrap.querySelector('.orbit-motion');function status(){motion.textContent=moving?'Pause motion':'Play motion';motion.setAttribute('aria-pressed',String(moving));}status();motion.onclick=()=>{moving=!moving;status();};reduced.addEventListener('change',e=>{moving=!e.matches;status();});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);
canvas.addEventListener('pointerdown',e=>{drag=true;moved=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(drag){const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;angle+=dx*.006;tilt=Math.max(-1,Math.min(1,tilt+dy*.004));lastX=e.clientX;lastY=e.clientY;}});canvas.addEventListener('pointerup',e=>{drag=false;if(!moved){const r=canvas.getBoundingClientRect();const p=points.filter(p=>p.label).sort((a,b)=>Math.hypot(a.x-e.clientX+r.left,a.y-e.clientY+r.top)-Math.hypot(b.x-e.clientX+r.left,b.y-e.clientY+r.top))[0];if(p)wrap.querySelector('#orbit-topic').textContent=p.label;}});canvas.addEventListener('pointercancel',()=>drag=false);requestAnimationFrame(draw);
})();
