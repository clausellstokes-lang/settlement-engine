import { readFileSync } from 'node:fs';
const st=JSON.parse(readFileSync('sweep/state-dnd.json','utf8'));
const kept=JSON.parse(readFileSync('sweep/kept-dnd.json','utf8'));
const partial=JSON.parse(readFileSync('sweep/partial-dnd.json','utf8'));
const host=u=>{try{return new URL(u).host.replace(/^www\./,'')}catch(e){return '?'}};
const tw=s=>String(s||'').replace(/\s+/g,' ');
const norm=s=>tw(s).toLowerCase().replace(/[‘’“”"']/g,'').replace(/[^a-z0-9 ]/g,'').trim();
console.log('=== Oak of Honor key collision in gazetteers found file');
const keyOf=(c)=>(String(c.source||'')+'|'+String(c.feature||'')+'|'+String(c.claim||'').slice(0,60)).toLowerCase();
const g=JSON.parse(readFileSync('sweep/found-dnd-place-5e-gazetteers.json','utf8')); const seen=new Map();
for(const c of g.claims){const k=keyOf(c); if(seen.has(k)){console.log(' DUP KEY:\n  A:',tw(seen.get(k).claim),'| Q:',tw(seen.get(k).quote),'\n  B:',tw(c.claim),'| Q:',tw(c.quote));} else seen.set(k,c);}
console.log('=== identical-trueWording groups among kept rows');
const groups={}; for(const r of kept){const n=norm(r.verdict.trueWording); if(n.length<12) continue; (groups[n]=groups[n]||[]).push(r.index);}
const gs=Object.entries(groups).filter(([k,v])=>v.length>1); console.log('groups:',gs.length,'rows:',gs.reduce((a,[k,v])=>a+v.length,0)); for(const [k,v] of gs) console.log(' ',v.join('/'),'|',k.slice(0,60));
console.log('=== kept distinct URLs, hosts');
const urls=new Set(kept.map(r=>r.url)); console.log('urls',urls.size,'hosts',new Set(kept.map(r=>host(r.url))).size);
const hc={}; for(const r of kept){const h=host(r.url); hc[h]=(hc[h]||0)+1;} const top=Object.entries(hc).sort((a,b)=>b[1]-a[1]);
console.log('all hosts:',top.map(x=>x.join('=')).join(', '));
const official=new Set(['cyborgsandmages.wordpress.com','media.dndbeyond.com','dndbeyond.com','archive.wizards.com','wizards.com','media.wizards.com','adventurersleague.wordpress.com','adventurersleague.files.wordpress.com','paizo.com','dmsguild.com','dnd.wizards.com','dndadventurersleague.org','theadventurerleagues.com']);
const academic=new Set(['analoggamestudies.org','journals.uu.se','academia.edu','direct.mit.edu','arxiv.org','tandfonline.com','eprints.whiterose.ac.uk','aclanthology.org','books.google.com','liverpooluniversitypress.blog','sfrareview.org']);
let off=0,acad=0,wiki=0,comm=0; const commHosts={};
for(const r of kept){const h=host(r.url); const u=r.url||''; if(official.has(h)||(h==='web.archive.org'&&/wizards\.com|dmsguild\.com|dndadventurersleague/.test(u))||h==='textual.ru'){off++;} else if(academic.has(h)) acad++; else if(h==='en.wikipedia.org') wiki++; else {comm++; commHosts[h]=(commHosts[h]||0)+1;}}
console.log('classes: official',off,'academic',acad,'wikipedia',wiki,'community/press',comm,'total',kept.length);
console.log('community hosts:',Object.entries(commHosts).sort((a,b)=>b[1]-a[1]).map(x=>x.join('=')).join(', '));
console.log('web.archive.org kept urls:',[...new Set(kept.filter(r=>host(r.url)==='web.archive.org').map(r=>r.url.replace(/^https?:\/\/web\.archive\.org\/web\/\d+(id_)?\//,'')))].join(' | '));
console.log('textual.ru rows:',kept.filter(r=>host(r.url)==='textual.ru').map(r=>r.index).join(','));
console.log('fullSentence kept:',kept.filter(r=>r.fullSentence).length,'partial:',partial.length,'fullSentence partial:',partial.filter(r=>r.fullSentence).length);
console.log('partial from regrade r6/r10/r12:',partial.filter(r=>r.verdict.fromFile.includes('regrade-r6')).length,partial.filter(r=>r.verdict.fromFile.includes('regrade-r10')).length,partial.filter(r=>r.verdict.fromFile.includes('regrade-r12')).length);
// place-lawful-primaries doc list
const lp=kept.filter(r=>r.index>=1153); console.log('lawful kept docs:',[...new Set(lp.map(r=>r.url))].length, [...new Set(lp.map(r=>host(r.url)))].join(','));
// dead-host appendix rows still kept?
const app=[157,158,159,160,161,162,164,165,168,169,170,171,172,217,218,219,220,221,400,401,402,403,510,511,512,513,514,515,516,517,518,854,855,860]; console.log('appendix rows not kept:', app.filter(i=>!kept.some(r=>r.index===i)).join(',')||'none');
