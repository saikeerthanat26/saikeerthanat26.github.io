import {Link} from 'react-router-dom';
import {motion} from 'motion/react';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import projects from '../data/projects.json';
import {Tags} from './UI';
export type Project=typeof projects[number];
export default function ProjectCard({project:p,index}:{project:Project;index:number}){return <motion.div layout initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.96}} transition={{duration:.3}}><Link className="project-card" to={'/work/'+p.slug}><div className={'card-visual visual-'+index}><span className="kicker">0{index+1} / {p.industry.toUpperCase()}</span><div className="mini-flow"><span>{p.flow[0]}</span><i>↓</i><span>{p.flow[2]}</span><i>↓</i><span>{p.flow.at(-1)}</span></div><div className="visual-result"><b>{p.metric}</b><span>{p.outcome}</span></div></div><div className="card-copy"><div className="eyebrow">{p.company}<ArrowUpRight size={16}/></div><h3>{p.short}</h3><p>{p.desc}</p><Tags items={p.stack.slice(0,3)}/><span className="read-link">Explore case study<ArrowRight size={16}/></span></div></Link></motion.div>}
