import type {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
export function Tags({items}:{items:string[]}){return <div className="tags">{items.map((x,i)=><span key={x+i}>{x}</span>)}</div>}
export function PageHero({eyebrow,title,children}:{eyebrow:string;title:ReactNode;children?:ReactNode}){return <section className="page-hero"><span className="kicker">{eyebrow}</span><motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.45}}>{title}</motion.h1>{children}</section>}
export function CTA(){return <section className="cta"><div><span className="kicker">NEXT CONVERSATION</span><h2>What are you<br/>trying to solve?</h2></div><div><p>Let’s connect the business problem, the right architecture, and a practical path to production.</p><Link className="button light" to="/contact">Start a conversation <ArrowUpRight size={16}/></Link></div></section>}
export function SectionHeading({eyebrow,title,children}:{eyebrow:string;title:ReactNode;children?:ReactNode}){return <div className="section-head"><div><span className="kicker">{eyebrow}</span><h2>{title}</h2></div>{children}</div>}
