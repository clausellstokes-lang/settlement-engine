import fs from 'node:fs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-tip/';
const t={}; let n=0, files=0; const tiers={};
for(const f of fs.readdirSync(S).filter(x=>x.endsWith('.pdf-canon_dossier.txt'))){ files++; const L=fs.readFileSync(S+f,'utf8').split('\n');
 for(let i=2;i<L.length;i++){ if(L[i-2]==='Influence' && L[i+1]==='Personality' || (L[i-2]==='Influence' && /·| of /.test(L[i]))){ n++; const h=L[i].split(' · ')[0]; if(/\(|\d|undefined|_|NaN/.test(L[i])) t[L[i].replace(/ · .*/,'')]=(t[L[i].replace(/ · .*/,'')]||0)+1; } } }
console.log({files,n}); console.log(Object.entries(t).sort((a,b)=>b[1]-a[1]).slice(0,20));
