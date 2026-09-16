import {readFile,mkdir,writeFile} from 'node:fs/promises';
const routes=['work','systems','experience','contact','work/clinical-intelligence','work/financial-knowledge','work/search-relevance'];
const html=await readFile('dist/index.html','utf8');
for(const path of routes){await mkdir('dist/'+path,{recursive:true});await writeFile('dist/'+path+'/index.html',html);}
await writeFile('dist/404.html',html);await writeFile('dist/.nojekyll','');
const origin='https://saikeerthanat26.github.io';await writeFile('dist/sitemap.xml','<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['',...routes].map(r=>'<url><loc>'+origin+'/'+r+(r?'/':'')+'</loc></url>').join('')+'</urlset>');
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
