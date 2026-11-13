// cold-merged.json -> the cold list in markdown: counts, the stage marks, every HIGH and MED row (LOW counted, in the .json)
import fs from 'node:fs';
const rows=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const out=[];
const T=['a-tip','ab-base','b-tip','c-tip','c-base']; const sev=['HIGH','MED','LOW'];
const c=(f)=>rows.filter(f).length;
out.push('| tree | HIGH | MED | LOW |','|---|---|---|---|'); for(const t of T) out.push(`| ${t} | ${sev.map(v=>c(r=>r.severity===v&&r.at[t])).join(' | ')} |`);
out.push(`| (not placed on any of the five pages by script) | ${sev.map(v=>c(r=>r.severity===v&&!Object.values(r.at).some(Boolean))).join(' | ')} |`,'');
out.push('| stage | prints at the tip and NOT at the base: H / M / L | prints at the base and NOT at the tip: H / M / L |','|---|---|---|');
for(const s of ['A','B','C']) out.push(`| ${s} | ${sev.map(v=>c(r=>r.severity===v&&r.newAtTip.includes(s))).join(' / ')} | ${sev.map(v=>c(r=>r.severity===v&&r.goneAtTip.includes(s))).join(' / ')} |`);
out.push('','Where each row prints: a = A tip (2f114a4c9), 0 = A/B base (e969a75b7), b = B tip (80b960171), c = C tip (d79ea4c70), 9 = C base (4534ea5e3); `NEW@X` = at X\'s tip and not its base; `GONE@X` = at X\'s base and not its tip.','');
const mech=new Map(); for(const r of rows.filter(r=>r.severity!=='LOW')) mech.set(r.mechanism?.split(':')[0], (mech.get(r.mechanism?.split(':')[0])||0)+1);
out.push('HIGH and MEDIUM by mechanism: '+[...mech].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v}`).join(' · '),'');
const esc=(s)=>String(s??'').replace(/\|/g,'\\|').replace(/\n/g,' ');
for(const v of ['HIGH','MED']){ out.push(`## ${v}`,'','| # | town | tab | sentence | the fact it contradicts | mechanism | source | prints | stage |','|---|---|---|---|---|---|---|---|---|');
  for(const r of rows.filter(r=>r.severity===v)){ const pr=[['a-tip','a'],['ab-base','0'],['b-tip','b'],['c-tip','c'],['c-base','9']].map(([t,k])=>r.at[t]?k:'·').join('');
    const st=[...r.newAtTip.map(x=>'NEW@'+x),...r.goneAtTip.map(x=>'GONE@'+x)].join(' ');
    out.push(`| ${r.n} | ${r.town.replace(/^rr2s-/,'')} | ${esc(r.tab)} | ${esc(r.sentence).slice(0,260)} | ${esc(r.fact).slice(0,220)} | ${esc(r.mechanism)} | ${esc(r.source).slice(0,60)} | ${pr} | ${st} |`); }
  out.push(''); }
fs.writeFileSync(process.argv[3], out.join('\n')); console.log('ok', rows.length);
