// removed.mjs <strdiff.jsonl> <base births.gz> <path regex> <base text regex> <fact expr over s,base,tip>
import fs from 'node:fs'; import zlib from 'node:zlib';
const [df, bf, pr, tr, expr] = process.argv.slice(2); const PR=new RegExp(pr), TR=new RegExp(tr); const F=new Function('s','base','tip',`return (${expr});`);
const rows=fs.readFileSync(df,'utf8').trim().split('\n').map(JSON.parse).filter(r=>PR.test(r.path)&&TR.test(r.base||''));
const need=new Set(rows.map(r=>r.seed)); const S=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(bf)).toString().split('\n')){ if(!l) continue; const i=l.indexOf('","s"'); const seed=l.slice(9,i); if(need.has(seed)) S.set(seed, JSON.parse(l).s); }
console.log('removed rows', rows.length, 'towns', need.size); const step=Math.max(1,Math.floor(rows.length/30));
const tally={}; for(const r of rows){ const v=String(F(S.get(r.seed),r.base,r.tip)); const k=v.split('|')[0].trim(); tally[k]=(tally[k]||0)+1; } console.log('verdict tally (all removed):', JSON.stringify(tally));
for(let i=0;i<30&&i*step<rows.length;i++){ const r=rows[i*step]; console.log(`${i+1}. ${r.seed} | ${String(r.base).slice(0,120)} || NOW ${String(r.tip).slice(0,110)} || ${F(S.get(r.seed),r.base,r.tip)}`); }
