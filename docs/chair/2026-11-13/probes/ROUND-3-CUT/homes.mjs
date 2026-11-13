// ROUND-3-CUT class (c): two homes that disagree. For each HIGH/MED line at the line's tip whose mechanism is "two homes
// that disagree": its writer (writers.json), and the OTHER home: the page line quoted in the reader's fact, found by
// git grep -F at the line tip (its longest name-free run). node homes.mjs <tree> <cut.json> <out.json>
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [TREE,cf,out]=process.argv.slice(2); const R=JSON.parse(fs.readFileSync(cf,'utf8')).filter(r=>r.mechanism==='two homes that disagree'&&r.at.line);
const grep=(t)=>{ try{ return execFileSync('git',['-C',TREE,'grep','-l','-F','-i',t,'--','src'],{encoding:'utf8'}).trim().split('\n').filter(f=>f&&!/test|__tests__/.test(f)); }catch{ return []; } };
const res=[]; for(const r of R){ const q=[...r.fact.matchAll(/['"“‘]([^'"”’]{14,})['"”’]/g)].map(m=>m[1]); let other='',run='';
  for(const s of q){ const parts=s.replace(/[\d,.]+%?/g,'\u0001').split(/\u0001|\b[A-Z][a-z]+(?:[ -][A-Z][a-z]+)+\b/).map(t=>t.trim()).filter(t=>t.length>=14).sort((a,b)=>b.length-a.length);
    for(const p of parts){ let t=p; let h=grep(t); while(!h.length&&t.length>20){ t=t.slice(0,Math.floor(t.length*0.7)).trim(); h=grep(t);} if(h.length){ other=h.filter(f=>f!==r.writer?.file)[0]||h[0]; run=t; break; } } if(other) break; }
  res.push({n:r.n,severity:r.severity,tab:r.tab,town:r.town,sentence:r.sentence,fact:r.fact,home:r.writer?.file||'',otherHome:other,otherRun:run,status:r.status}); }
fs.writeFileSync(out,JSON.stringify(res,null,1));
const pairs={}; for(const x of res){ const k=`${x.home||'?'}  ⟷  ${x.otherHome||'(other home not found by grep)'}`; (pairs[k]||=[]).push(x); }
console.log('lines',res.length,'HIGH',res.filter(x=>x.severity==='HIGH').length,'MED',res.filter(x=>x.severity==='MED').length,'other home found',res.filter(x=>x.otherHome).length);
for(const [k,v] of Object.entries(pairs).sort((a,b)=>b[1].length-a[1].length).slice(0,40)) console.log(String(v.length).padStart(3),k);
