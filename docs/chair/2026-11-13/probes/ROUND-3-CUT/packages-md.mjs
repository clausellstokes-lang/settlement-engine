// ROUND-3-CUT step 6: the packages as markdown, for one severity. node packages-md.mjs <cut.json> HIGH|MED
import fs from 'node:fs';
const [cf,SEV]=process.argv.slice(2); const R=JSON.parse(fs.readFileSync(cf,'utf8'));
const P={}; for(const r of R) if(r.package) (P[r.package]||=[]).push(r);
const keyed=Object.entries(P).filter(([k,v])=>v.some(r=>r.severity===SEV)).sort((a,b)=>b[1].filter(r=>r.severity===SEV).length-a[1].filter(r=>r.severity===SEV).length);
const short=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
let o=''; let i=0;
for(const [k,v] of keyed){ i++; const s=v.filter(r=>r.severity===SEV); const h=v.filter(r=>r.severity==='HIGH').length, m=v.filter(r=>r.severity==='MED').length;
  const W={}; for(const r of s){ const w=r.writer?`${r.writer.file} :: ${r.writer.fn||'(file level)'}`:'untraced'; (W[w]||=[]).push(r); }
  const mech={}; for(const r of s) mech[r.mechanism]=(mech[r.mechanism]||0)+1;
  const st={}; for(const r of s) st[r.status]=(st[r.status]||0)+1;
  const r2=[...new Set(s.filter(r=>r.round2).map(r=>`#${r.round2.n} (${r.round2.status})`))];
  o+=`\n### ${SEV==='HIGH'?'H':'M'}${i}. ${k} — ${s.length} ${SEV} (the package holds ${h} HIGH, ${m} MED in all)\n`;
  const hold=[...new Set(s.flatMap(r=>r.holders))], ownH=[...new Set(s.flatMap(r=>r.ownHolders||r.holders))];
  o+=`- **Holders of the writers' files:** ${hold.join(', ')||'none'}${hold.length>1||ownH.join()!==hold.join()?` (with commits of their own: ${ownH.join(', ')||'none'})`:''}\n`;
  o+=`- **Lines:** ${s.map(r=>'#'+r.n).join(' ')}\n- **Status at the line's tip:** ${Object.entries(st).map(([a,b])=>`${a} ${b}`).join('; ')}\n`;
  o+=`- **Mechanism:** ${Object.entries(mech).sort((a,b)=>b[1]-a[1]).map(([a,b])=>`${a} ${b}`).join('; ')}\n- **Writers (${Object.keys(W).length}):**\n`;
  for(const [w,rs] of Object.entries(W).sort((a,b)=>b[1].length-a[1].length)) o+=`  - \`${w}\` — ${rs.length}: ${rs.map(r=>'#'+r.n).join(' ')}\n`;
  if(r2.length) o+=`- **Round two (same writer, same mechanism):** ${r2.length} of its lines: ${short(r2.join(', '),400)}\n`;
  o+=`- **Examples:**\n`; const ex=[]; const seenW=new Set(); for(const r of s){ const w=r.writer?.file+r.writer?.fn; if(!seenW.has(w)){ seenW.add(w); ex.push(r);} if(ex.length===3) break; } for(const r of s){ if(ex.length>=3) break; if(!ex.includes(r)) ex.push(r); }
  for(const r of ex) o+=`  - #${r.n}, ${r.town}, ${r.tab}: "${short(r.sentence,160)}" — against: ${short(r.fact,230)}\n`; }
process.stdout.write(o);
