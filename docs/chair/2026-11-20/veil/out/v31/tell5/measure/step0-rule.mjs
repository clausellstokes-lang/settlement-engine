// R3-TELL-5 unit (ii): what the positive-account rule leaves on each hidden-house page of step 0 (the page's own served types
// stand in for the attribution, an approximation said in the hand-back), and every tag seen.
import { readFileSync } from 'node:fs';
const TAG = { '(street gang)': ['Street gang activity'], '(smuggling)': ['Smuggling'], '(arcane underground)': ['Magical crime', 'Arcane black market'],
  '(state apparatus)': ['State predation'], '(criminal governance)': ['Criminal governance'], '(religious fraud)': ['Religious fraud'], '(commercial crime)': ['Commercial crime'] };
const births = [0, 1, 2, 3].flatMap((s) => JSON.parse(readFileSync(`${process.argv[2]}/step0-shard${s}.json`, 'utf8')).births).filter((b) => b.hidden.length);
const left = new Map(); const gone = new Map(); let pages = 0; let nonEmpty = 0; const towns = new Set();
for (const b of births) for (const [k, p] of Object.entries(b.pages)) {
  if (!k.startsWith('twin:') || !p.svc.length) continue; pages += 1;
  const types = new Set(Array.isArray(p.types) ? p.types : []);
  const kept = p.svc.filter((r) => { const [, inst, served] = r.split('|'); return served === '1' || (TAG[inst] || []).some((t) => types.has(t)); });
  for (const r of p.svc) { const m = kept.includes(r) ? left : gone; const t = r.split('|')[2] === '1' ? '<served house>' : r.split('|')[1]; m.set(t, (m.get(t) || 0) + 1); }
  if (kept.length) { nonEmpty += 1; towns.add(`${b.seed}:${kept.join(',')}`); }
}
console.log(`hidden-house twin pages serving criminal services: ${pages}; after the rule non-empty: ${nonEmpty}`);
console.log('kept by tag:', JSON.stringify([...left])); console.log('withheld by tag:', JSON.stringify([...gone]));
for (const t of [...towns].sort()) console.log(`  KEPT ${t}`);
