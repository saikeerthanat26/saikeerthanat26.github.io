export type Document={id:string;title:string;text:string};
export type Result=Document&{score:number;contributions:{term:string;score:number}[]};
const stop=new Set('a an the is are was were be been to of in on for by and or with how what do does we i it this that from as can our your'.split(' '));
export const tokenize=(text:string)=>(text.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(t=>!stop.has(t));
export function parseCorpus(text:string):Document[]{return text.trim().split(/\n\s*\n/).filter(Boolean).slice(0,50).map((block,i)=>{const lines=block.trim().split('\n');return{id:'D'+(i+1),title:lines.shift()!,text:lines.join(' ')||block};});}
export function rank(query:string,docs:Document[],b=.75,k1=1.2):Result[]{const terms=[...new Set(tokenize(query))],tokens=docs.map(d=>tokenize(d.title+' '+d.text)),N=docs.length;if(!N||!terms.length)return[];const avg=tokens.reduce((s,t)=>s+t.length,0)/N||1;return docs.map((d,i)=>{const contributions=terms.flatMap(term=>{const tf=tokens[i].filter(t=>t===term).length;if(!tf)return[];const df=tokens.filter(t=>t.includes(term)).length,idf=Math.log(1+(N-df+.5)/(df+.5));return[{term,score:idf*tf*(k1+1)/(tf+k1*(1-b+b*tokens[i].length/avg))}];});return{...d,score:contributions.reduce((s,t)=>s+t.score,0),contributions};}).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));}
export function evaluate(results:Result[],relevant:Set<string>,k:number){const hits=results.slice(0,k).filter(r=>relevant.has(r.id)).length,first=results.slice(0,k).findIndex(r=>relevant.has(r.id));return{precision:hits/k,recall:relevant.size?hits/relevant.size:0,reciprocalRank:first<0?0:1/(first+1),hits};}
export const initialCorpus=`Tool access policy
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
