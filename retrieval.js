/* A dependency-free, inspectable BM25 search implementation.
 * All content stays in browser memory. No model/API call occurs.
 * BM25: sum IDF(t) * tf(t,d)*(k1+1)/(tf(t,d)+k1*(1-b+b*len(d)/avgLen)).
 */
(function(root){
 'use strict';
 const stop=new Set('a an the is are was were be been to of in on for by and or with how what do does we i it this that from as can our your'.split(' '));
 const tokenize=text=>(text.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(x=>!stop.has(x));
 function parseCorpus(text){return text.trim().split(/\n\s*\n/).filter(Boolean).slice(0,50).map((block,i)=>{const lines=block.trim().split('\n');return{id:'D'+(i+1),title:lines.shift(),text:lines.join(' ')||block};});}
 function rank(query,docs,b=.75,k1=1.2){
  const terms=[...new Set(tokenize(query))],tokens=docs.map(d=>tokenize(d.title+' '+d.text)),N=docs.length;
  if(!N||!terms.length)return[];
  const avg=tokens.reduce((s,t)=>s+t.length,0)/N||1;
  const df=Object.fromEntries(terms.map(t=>[t,tokens.filter(a=>a.includes(t)).length]));
  return docs.map((doc,i)=>{let score=0;const contributions=[];for(const term of terms){const tf=tokens[i].filter(t=>t===term).length;if(!tf)continue;const idf=Math.log(1+(N-df[term]+.5)/(df[term]+.5));const value=idf*tf*(k1+1)/(tf+k1*(1-b+b*tokens[i].length/avg));score+=value;contributions.push({term,score:value});}return{...doc,score,contributions};}).filter(d=>d.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 }
 function metrics(results,relevant,k){const hits=results.slice(0,k).filter(r=>relevant.has(r.id)).length;const first=results.slice(0,k).findIndex(r=>relevant.has(r.id));return{precision:hits/k,recall:relevant.size?hits/relevant.size:null,reciprocalRank:first<0?0:1/(first+1),hits};}
 const api={tokenize,parseCorpus,rank,metrics};if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(typeof document==='undefined'||!document.getElementById('search-form'))return;
 const get=id=>document.getElementById(id),esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const initial=`Tool access policy
Tools require an explicit allowlist and validated arguments. Check permissions before execution. Record tool calls for audit and review. Reject unauthorized tool requests.

Release evaluation checklist
Evaluate groundedness, retrieval relevance, and task completion before a release. Compare results against a baseline. Review failed evaluation cases and document a rollback plan.

Production monitoring guide
Monitor latency, errors, token usage, and data drift. Investigate quality regressions using traces. Rollback a release when quality or reliability drops below agreed thresholds.

Search quality guide
Measure retrieval with relevance labels. Precision measures how many returned results are relevant. Recall measures how much relevant evidence was retrieved. Reciprocal rank rewards placing the first relevant result near the top.

Data ingestion guide
Validate schemas and preserve source metadata during ingestion. Clean duplicate records and track document updates. Access permissions apply to documents before retrieval.

Human review guide
Route uncertain outputs for human review. A response needs supporting evidence. When evidence is missing, explain the gap instead of inventing an answer.`;
 let docs=[],results=[],relevant=new Set(),lastReport=null;
 get('corpus').value=initial;
 function highlight(text,terms){return text.split(/([a-zA-Z0-9]+)/).map(t=>terms.has(t.toLowerCase())?'<mark>'+esc(t)+'</mark>':esc(t)).join('');}
 function evaluate(){const el=get('evaluation-results');if(!relevant.size){el.innerHTML='<p>Select at least one relevant document to calculate evaluation metrics.</p>';return;}const k=Number(get('top-k').value),m=metrics(results,relevant,k);el.innerHTML=[['Precision@'+k,m.precision],['Recall@'+k,m.recall],['Reciprocal rank@'+k,m.reciprocalRank]].map(([name,v])=>'<div><b>'+v.toFixed(2)+'</b><span>'+name+'</span></div>').join('');const p=document.createElement('p');p.className='fine';p.textContent=m.hits+' relevant hits in '+Math.min(k,results.length)+' returned results. Precision uses K as its denominator; missing slots count as misses.';el.appendChild(p);}
 function index(){docs=parseCorpus(get('corpus').value);relevant.clear();const el=get('relevance-labels');el.replaceChildren();docs.forEach(d=>{const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.value=d.id;input.addEventListener('change',()=>{input.checked?relevant.add(d.id):relevant.delete(d.id);evaluate();});label.appendChild(input);label.appendChild(document.createTextNode(d.id+' / '+d.title));el.appendChild(label);});}
 function search(){const query=get('search-query').value,b=Number(get('length-b').value),k=Number(get('top-k').value);const start=performance.now();results=rank(query,docs,b);const elapsed=performance.now()-start;const top=results.slice(0,k);get('search-status').textContent=top.length+' / '+docs.length+' docs · '+elapsed.toFixed(2)+' ms';const container=get('retrieval-results');container.replaceChildren();const terms=new Set(tokenize(query));if(!top.length){const p=document.createElement('p');p.className='empty-search';p.textContent=docs.length?'No matching evidence. Try different terms or add a document that contains the information.':'The knowledge base is empty. Add a document to begin.';container.appendChild(p);}top.forEach((r,i)=>{const article=document.createElement('article');article.className='retrieved-card';article.innerHTML='<div class="result-top"><span>#'+(i+1)+' / '+r.id+'</span><b>'+r.score.toFixed(3)+' BM25</b></div><h3>'+highlight(r.title,terms)+'</h3><p>'+highlight(r.text,terms)+'</p><details><summary>Why this result?</summary><p>'+r.contributions.map(c=>esc(c.term)+': '+c.score.toFixed(3)).join(' · ')+'</p></details>';container.appendChild(article);});lastReport={query,method:'BM25 keyword search',b,k1:1.2,k,documents:docs,results:top,elapsedMs:elapsed};get('top-k-value').textContent=k;get('length-b-value').textContent=b.toFixed(2);evaluate();}
 get('search-form').addEventListener('submit',e=>{e.preventDefault();search();});
 ['top-k','length-b'].forEach(id=>get(id).addEventListener('input',search));
 let timer;get('corpus').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{index();search();},250);});
 get('reset-corpus').addEventListener('click',()=>{clearTimeout(timer);get('corpus').value=initial;index();search();});
 document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{get('search-query').value=b.dataset.query;search();}));
 get('download-results').addEventListener('click',()=>{if(!lastReport)return;const data={...lastReport,relevantDocumentIds:[...relevant],evaluation:relevant.size?metrics(results,relevant,Number(get('top-k').value)):null};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='retrieval-experiment.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 index();search();
})(typeof globalThis!=='undefined'?globalThis:this);
