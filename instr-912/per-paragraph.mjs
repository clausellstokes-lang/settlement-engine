// per-paragraph.mjs — THE OWED REFINEMENT (SITTING §I's declared limit): the three numbers
// re-measured PER PARAGRAPH rather than per register, using the repo's own fingerprint (which
// is byte-parity with the kit tool, proved separately).
import { readFileSync, existsSync } from 'node:fs';
import { fingerprint, scoreAgainstBands, bandsFrom, RATE_METRICS } from '../laneINSTR/src/domain/prose/proseFingerprint.js';
const K = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/primary';
const LEAF = ['dnd-flavor','dnd-rules-srd52','dnd-rules','leguin-fiction','leguin-nonfiction-spoken','leguin-nonfiction-written','martin-chronicle','martin-narrative','tolkien-plain','tolkien-elevated'];
const at = (o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);
const registerMetrics = {};
const rawFor = {};
for (const l of LEAF) {
  const d = JSON.parse(readFileSync(`${K}/${l}.fingerprint.json`,'utf8'));
  const m = {}; for (const k of RATE_METRICS) m[k] = at(d,k);
  registerMetrics[l] = m;
  const files = d.files.map(p=>`${K}/raw/${p.split('/').pop()}`).filter(existsSync);
  rawFor[l] = files;
}
const have = LEAF.filter(l=>rawFor[l].length);
console.log(`ten leaf registers; raw text present for ${have.length}: ${have.join(', ')}`);
console.log(`ABSENT (the fingerprints' own \`files\` point at a scratchpad that no longer exists): ${LEAF.filter(l=>!rawFor[l].length).join(', ')}\n`);
// register-level leave-one-out, as the sitting measured it — reproduced first
const rows=[];
for (const l of LEAF) {
  const bands = bandsFrom(registerMetrics, l);
  const { scored, exceeded } = scoreAgainstBands(registerMetrics[l], bands);
  const depths = exceeded.map(e=>e.depth).sort((a,b)=>a-b);
  rows.push({l, n: exceeded.length, scored: scored.length, max: depths.at(-1)||0, med: depths.length? depths[Math.floor(depths.length/2)]:0});
}
console.log('REGISTER LEVEL (leave-one-out over the ten) — the sitting\'s own measurement, reproduced:');
for (const r of rows.sort((a,b)=>b.n-a.n)) console.log(`  ${r.l.padEnd(28)} ${String(r.n).padStart(2)} of ${r.scored}  max depth ${r.max.toFixed(2)}  median ${r.med.toFixed(2)}`);
const ns = rows.map(r=>r.n).sort((a,b)=>a-b);
const alldepths = rows.map(r=>r.max).sort((a,b)=>a-b);
console.log(`  → exceeded per record: min ${ns[0]} · median ${ns[Math.floor(ns.length/2)]} · max ${ns.at(-1)} of 21`);
console.log(`  → records at ZERO: ${ns.filter(x=>x===0).length} of ${ns.length}`);
console.log(`  → max depth: median ${alldepths[Math.floor(alldepths.length/2)].toFixed(2)}, max ${alldepths.at(-1).toFixed(2)}\n`);
// PER PARAGRAPH
console.log('PER PARAGRAPH (each paragraph scored against the band formed by the other NINE registers):');
const allShares=[]; const allDepths=[];
for (const l of have) {
  const text = rawFor[l].map(f=>readFileSync(f,'utf8')).join('\n');
  const paras = text.split(/\n\s*\n/).map(p=>p.replace(/\s+/g,' ').trim()).filter(p=>p.length>20);
  const bands = bandsFrom(registerMetrics, l);
  const counts=[]; const depths=[];
  let tooSmall=0;
  for (const p of paras) {
    const fp = fingerprint([p]);
    if (fp.sentences < 3) { tooSmall++; continue; }
    const { scored, exceeded } = scoreAgainstBands(fp.metrics, bands);
    if (!scored.length) continue;
    counts.push({n: exceeded.length, scored: scored.length});
    for (const e of exceeded) depths.push(e.depth);
  }
  const shares = counts.map(c=>c.n/c.scored).sort((a,b)=>a-b);
  const ds = depths.sort((a,b)=>a-b);
  allShares.push(...shares); allDepths.push(...ds);
  const q=(a,p)=>a.length? a[Math.min(a.length-1,Math.floor(p*a.length))] : 0;
  console.log(`  ${l.padEnd(28)} paragraphs scored ${counts.length} (skipped ${tooSmall} under 3 sentences)`);
  console.log(`      exceeded share: min ${(shares[0]*100).toFixed(0)}% · median ${(q(shares,.5)*100).toFixed(0)}% · p90 ${(q(shares,.9)*100).toFixed(0)}% · max ${(shares.at(-1)*100).toFixed(0)}%`);
  console.log(`      depth: median ${q(ds,.5).toFixed(2)} · p90 ${q(ds,.9).toFixed(2)} · max ${ds.at(-1).toFixed(2)} band-widths`);
  console.log(`      paragraphs at ZERO exceedance: ${shares.filter(x=>x===0).length} of ${shares.length} (${(shares.filter(x=>x===0).length/shares.length*100).toFixed(0)}%)`);
}
allShares.sort((a,b)=>a-b); allDepths.sort((a,b)=>a-b);
const q=(a,p)=>a[Math.min(a.length-1,Math.floor(p*a.length))];
console.log(`\n  ACROSS THE THREE: ${allShares.length} paragraphs`);
console.log(`    exceeded share: median ${(q(allShares,.5)*100).toFixed(0)}% · p90 ${(q(allShares,.9)*100).toFixed(0)}%   [the chair's BUDGET is 33%, expected 17%]`);
console.log(`    depth: median ${q(allDepths,.5).toFixed(2)} · p90 ${q(allDepths,.9).toFixed(2)}   [the chair's DEPTH is 0.5]`);
console.log(`    paragraphs at ZERO: ${allShares.filter(x=>x===0).length} of ${allShares.length} (${(allShares.filter(x=>x===0).length/allShares.length*100).toFixed(0)}%)   [the chair's PERFECTION CEILING says no human record sits at zero]`);
