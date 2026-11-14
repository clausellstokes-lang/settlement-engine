import fs from 'node:fs';
const D='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps/';
const rows=fs.readFileSync('faith.tsv','utf8').trim().split('\n').map(l=>l.split('\t'));
const PAT=[['quietShrine',/shrines answer to no named god/],['quietNone',/No single creed holds sway, and no god is named here/],['siege',/the siege keeps its people from the next village/],['walk',/its people walk to the next village’s parish church/],['realweight',/Real political weight rests/],['voice',/A voice in .*affairs belongs/]];
const t={}; let n=0; const mism=[];
for(const r of rows){ const f=D+r[0]+'.txt'; if(!fs.existsSync(f)) continue; n++; const txt=fs.readFileSync(f,'utf8'); const lines=txt.split('\n');
 let sec=''; const where={}; for(const l of lines){ if(l.startsWith('== ')){sec=l;continue;} for(const [k,re] of PAT) if(re.test(l)) (where[k]=where[k]||new Set()).add(sec); }
 for(const [k,re] of PAT){ const exp=re.test(r[10]); const got=!!where[k]; const key=`${k} exp=${exp} got=${got} ${got?[...where[k]].join(','):''}`; t[key]=(t[key]||0)+1; if(exp!==got && mism.length<8) mism.push([r[0],k,exp,got]); } }
console.log(n); for(const [k,v] of Object.entries(t).sort()) if(!/exp=false got=false/.test(k)) console.log(v,k); console.log(mism);
