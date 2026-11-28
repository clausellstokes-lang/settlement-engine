import fs from 'node:fs';
const rows=fs.readFileSync(process.argv[2],'utf8').trim().split('\n').map(JSON.parse);
const NOBODY=/walls and nobody|nobody on them|meet nobody on them|walls and nobody to put on them|long stretches in good repair with nobody/;
const NOFORCE=/has no line and no force/; const THREAT=/would take real effort to threaten|does not spend much time thinking about being attacked/;
const ALLBUT=/is all but undefended\. Nothing in the/; const NORAID=/could not hold off a raid/;
const C={}; const add=(k,seed)=>{(C[k]=C[k]||[]).push(seed);};
for(const r of rows){ const f=r.forces; const force=f.garrison||f.watch||f.militia||f.mercenary; const crisis=r.seed.split('-')[1];
  if(NOBODY.test(r.inv.s||'')&&force) add('A nobody-on-walls with a force',r.seed);
  if(NOBODY.test(r.inv.s||'')&&r.bands.mil==='STRONG') add('A1 nobody beside Strong invasion',r.seed);
  if(NOFORCE.test(r.inv.s||'')&&force) add('B no-line-no-force with a force',r.seed);
  if(THREAT.test(r.post.s||'')&&/under_siege|wartime/.test(crisis)) add('D untroubled posture under siege/war',r.seed);
  if(ALLBUT.test(r.post.s||'')&&f.walls&&force) add('E all-but-undefended beside walls and force',r.seed);
  if(NORAID.test(r.post.s||'')&&r.bands.mil==='STRONG') add('F could-not-hold-off-a-raid beside Strong invasion',r.seed);
  if(r.badge==='Defensible'&&/could not hold off a raid|could not survive a serious attack|all but undefended/.test(r.post.s||'')) add('K Defensible beside cannot-hold',r.seed);
  if(/perimeter has nobody on it/.test(r.post.s||'')&&force) add('W posture WEAK v2 "perimeter has nobody" with a force',r.seed);
  if(r.ecoRow.want&&!r.ecoRow.s) add('L3 economic row: a band, no sentence',r.seed);
  if(!r.ecoRow.want) add('(economic row: no key)',r.seed);
}
for(const k of Object.keys(C).sort()) console.log(String(C[k].length).padStart(4),k,'e.g.',C[k].slice(0,4).join(' '));
