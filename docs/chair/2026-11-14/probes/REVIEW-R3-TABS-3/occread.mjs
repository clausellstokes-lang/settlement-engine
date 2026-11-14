// occread.mjs: each silenced posture line with the Military status block printed on the same base page, and the bar band
import fs from 'node:fs';
const F=new Map(fs.readFileSync('facts2.jsonl','utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const rows=fs.readFileSync('pagediff.tsv','utf8').trim().split('\n').map(l=>l.split('\t')).filter(r=>r[0]==='GONE');
const out=[];
for(const [,seed,k] of rows){ const line=k.split(' :: ').slice(1).join(' :: '); if(line==='Gates (if walled)') continue;
  const t=fs.readFileSync(`${process.argv[2]}/${seed}.txt`,'utf8'); const i=t.indexOf('== Systems/Defense =='); const d=t.slice(i).split('\n');
  const a=d.indexOf('Military status'), b=d.indexOf('Threat Assessment'); const ms=d.slice(a+1,b).join(' / ');
  const f=F.get(seed); out.push([seed,f.name,f.tier,f.pop,f.stress.join('+'),f.mil,'badge='+d[2],line,ms].join('\t')); }
fs.writeFileSync('occread.tsv',out.join('\n')+'\n'); console.log(out.length);
