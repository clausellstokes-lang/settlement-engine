// plant.mjs <tree> <plants.json> <testlist> <out>: for each plant, apply the exact replacement (must occur once), run the stage's test files, restore; record the red files
import fs from 'node:fs'; import { execSync } from 'node:child_process';
const [tree, pf, tl, out] = process.argv.slice(2); const P=JSON.parse(fs.readFileSync(pf)); const tests=fs.readFileSync(tl,'utf8').trim();
const res=[];
for(const [id,file,oldS,newS] of P){ const f=tree+'/'+file; const orig=fs.readFileSync(f,'utf8'); const n=orig.split(oldS).length-1;
  if(n!==1){ res.push(`${id}\tPLANT NOT APPLIED (occurs ${n})`); continue; }
  fs.writeFileSync(f, orig.replace(oldS,newS)); let log='';
  try{ log=execSync(`npx vitest run ${tests} 2>&1`,{cwd:tree,encoding:'utf8',maxBuffer:1<<28}); }catch(e){ log=String(e.stdout||'')+String(e.stderr||''); }
  fs.writeFileSync(f, orig);
  const red=[...new Set([...log.matchAll(/FAIL\s+(\S+\.test\.js)/g)].map(m=>m[1]))]; const sum=(log.match(/Tests\s+.*\n/)||[''])[0].trim();
  res.push(`${id}\t${red.length?'RED':'GREEN (guard does not catch)'}\t${sum}\t${red.join(' ')}`); fs.writeFileSync(out,res.join('\n')+'\n'); }
console.log(res.join('\n'));
