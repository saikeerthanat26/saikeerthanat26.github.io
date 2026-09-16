'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const menu=$('.menu-toggle');
if(menu)menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#nav').classList.toggle('open',open);menu.textContent=open?'Close −':'Menu +';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu){menu.setAttribute('aria-expanded','false');$('#nav').classList.remove('open');menu.textContent='Menu +';}});
// The 3D view is a projection of a reference architecture, not a client system.
const scenes=$$('.scene');
scenes.forEach(scene=>{
 const stack=$('.stack3d',scene);let z=-25,x=55,down=false,originX=0,originY=0,baseZ=z,baseX=x;
 const apply=()=>{stack.style.transform=`rotateX(${x}deg) rotateZ(${z}deg)`;const range=$('#rotation');if(range)range.value=String(Math.round(z));};
 scene.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;down=true;originX=e.clientX;originY=e.clientY;baseZ=z;baseX=x;scene.setPointerCapture(e.pointerId);});
 scene.addEventListener('pointermove',e=>{if(!down)return;z=Math.max(-60,Math.min(60,baseZ+(e.clientX-originX)*.3));x=Math.max(25,Math.min(70,baseX-(e.clientY-originY)*.15));apply();});
 const finish=()=>{down=false;};scene.addEventListener('pointerup',finish);scene.addEventListener('pointercancel',finish);
 scene.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')z=Math.max(-60,z-5);if(e.key==='ArrowRight')z=Math.min(60,z+5);if(e.key==='ArrowUp')x=Math.min(70,x+5);if(e.key==='ArrowDown')x=Math.max(25,x-5);if(e.key==='Home'){z=-25;x=55;}apply();});
 $('.reset-scene',scene.parentElement).addEventListener('click',()=>{z=-25;x=55;apply();});
 const range=$('#rotation');if(range)range.addEventListener('input',()=>{z=Number(range.value);apply();});
});
const perspectives={
 client:['BUSINESS VALUE & DELIVERY','Can you take this into production?','Explore experience connecting enterprise data, AI workflows, evaluation, and cloud operations. See the business outcomes and discuss the constraints of your use case.','/contact/','Explore how we can work together ↗'],
 technical:['ARCHITECTURE & ENGINEERING JUDGMENT','How do the design choices hold up?','Inspect architecture layers and case-study tradeoffs. Explore retrieval, tool boundaries, evaluation, cloud delivery, and the operational concerns behind each system.','/systems/','Explore the systems lab ↗'],
 recruiter:['EXPERIENCE & ROLE ALIGNMENT','Where does your experience fit?','Review six enterprise engagements, a complete technology inventory, and the progression from data engineering to production GenAI. Review the experience page with your hiring team.','/experience/','Review experience and technical skills ↗']
};
$$('[data-perspective]').forEach(b=>b.addEventListener('click',()=>{const d=perspectives[b.dataset.perspective];$$('[data-perspective]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const el=$('#perspective-content');el.innerHTML=`<span class="eyebrow">${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p><a class="text-link" href="${d[3]}">${d[4]}</a>`;}));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{let count=0;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('[data-industry]').forEach(card=>{const shown=b.dataset.filter==='All'||card.dataset.industry===b.dataset.filter;card.hidden=!shown;if(shown)count++;});$('#filter-count').textContent=`${count} case ${count===1?'study':'studies'}`;}));
const layers={
 '4':['DATA FOUNDATION','Make enterprise data usable.','Ingest and validate source data, preserve useful metadata, and make access boundaries explicit before content reaches retrieval or tools.','APIs · HL7 / FHIR · S3 · ETL pipelines','What needs to be reliable'],
 '3':['RETRIEVAL & EVIDENCE','Find the context that matters.','Use chunking, semantic and lexical retrieval, metadata filters, and reranking to assemble relevant evidence. Evaluate retrieval separately from answer fluency.','Recall · Relevance · Metadata boundaries · Freshness','What I inspect'],
 '2':['MODEL & RESPONSE','Ground the response in context.','Assemble prompts and evidence for model inference, then validate the response. An explicit insufficient-evidence outcome is useful when sources cannot support an answer.','Context quality · Citations · Faithfulness · Token budget','What I evaluate'],
 '1':['AGENT ORCHESTRATION','Give actions a clear boundary.','Coordinate state, routes, tools, and workflow handoffs. Validate arguments and permissions before execution, and make failures observable.','LangGraph · Tool calling · MCP · State management','What needs control'],
 '0':['QUALITY & OPERATIONS','Confidence is an engineering task.','Golden datasets, regression comparisons, expert review, and production traces help distinguish a compelling demo from a dependable workflow.','Groundedness · Task completion · Tool behavior · Latency · Token usage','What I look for']
};
$$('[data-layer]').forEach(b=>b.addEventListener('click',()=>{const d=layers[b.dataset.layer];$$('[data-layer]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('.plane').forEach(p=>p.classList.toggle('selected',p.classList.contains('p'+b.dataset.layer)));$('#layer-detail').innerHTML=`<span class="eyebrow">${d[0]}</span><h2>${d[1]}</h2><p>${d[2]}</p><h4>${d[4]}</h4><p>${d[3]}</p>`;}));
const search=$('#skill-search');if(search)search.addEventListener('input',()=>{const q=search.value.toLowerCase().trim();let count=0;$$('.skill').forEach(d=>{const match=d.textContent.toLowerCase().includes(q);d.hidden=!match;d.open=Boolean(q)&&match;if(match)count++;});$('#skill-count').textContent=`${count} matching skill ${count===1?'category':'categories'}`;$('#no-skills').hidden=count!==0;});
const form=$('#brief-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const subject=String(data.get('need'))+' — '+String(data.get('company')||data.get('name'));const body=`Hi Sai,\n\n${data.get('message')}\n\nName: ${data.get('name')}\nCompany: ${data.get('company')||'Not provided'}\nInterest: ${data.get('need')}\n\nBest regards,\n${data.get('name')}`;window.location.href='mailto:saikeerthanat.2614@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);$('#brief-status').textContent='Your email draft is ready to open. If your email app did not launch, use the email address alongside this form. No message has been sent.';});
