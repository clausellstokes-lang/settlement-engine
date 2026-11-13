// ROUND-3-CUT step 4: for each writer's file (and the words' file where the writer prints words from elsewhere), the
// lanes that change it against their own merge base with the line (holders.json from `git diff --name-only $(git
// merge-base origin/lane/integration-2026-11-07 <tip>) <tip>`). node holders.mjs <holders.json> <writers.json>
import fs from 'node:fs';
const H=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const W=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const who=(f)=>Object.entries(H).filter(([k,v])=>v.files.includes(f)).map(([k])=>k);
for(const x of W){ const w=x.writer||{}; x.holders=w.file?who(w.file):[]; const words=String(w.words||'').split(/[;,]\s*/).map(s=>s.trim().split(' ')[0]).filter(s=>/^src\//.test(s)); x.wordsHolders=Object.fromEntries(words.map(f=>[f,who(f)])); }
fs.writeFileSync(process.argv[3],JSON.stringify(W,null,1));
const files={}; for(const x of W){ const f=x.writer?.file||'(none)'; (files[f]||={n:0,h:0,m:0,holders:x.holders}); files[f].n++; files[f][x.severity==='HIGH'?'h':'m']++; }
for(const [f,v] of Object.entries(files).sort((a,b)=>b[1].n-a[1].n).slice(0,45)) console.log(String(v.h).padStart(3),String(v.m).padStart(4),' ',f.padEnd(62),v.holders.join(',')||'-');
