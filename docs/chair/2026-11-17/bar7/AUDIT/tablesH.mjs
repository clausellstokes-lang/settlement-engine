// BAR7-AUDIT-H · the hand-back's count table from runH.mjs outputs (one JSON a population).
//   node docs/chair/2026-11-17/bar7/AUDIT/tablesH.mjs <label>=<out.json> [<label>=<out.json> ...]
// Prints one markdown row a rule: per population "towns / instances / distinct lines", then for the LAST population the
// split by cause (born short in a calm town · short in a crisis town · a crisis mark) and what the seam in flight holds.
import fs from 'node:fs';
const pops = process.argv.slice(2).map((a) => { const [label, f] = a.split('='); return { label, xs: JSON.parse(fs.readFileSync(f, 'utf8')) }; });
if (!pops.length) { console.error('usage: tablesH.mjs <label>=<out.json> ...'); process.exit(2); }
const CRISES = ['under_siege', 'famine', 'plague_onset', 'wartime', 'occupied'];
const calm = (x) => !x.crises.some((c) => CRISES.includes(c));
const t = (xs) => `${new Set(xs.map((x) => x.town)).size} / ${xs.length} / ${new Set(xs.map((x) => x.form)).size}`;
const rules = [...new Set(pops.flatMap((p) => p.xs.map((x) => x.rule)))].sort();
const last = pops[pops.length - 1];
console.log(`| rule | ${pops.map((p) => `${p.label} (towns / inst / lines)`).join(' | ')} | ${last.label}: born-calm · short-in-crisis · crisis | ${last.label}: held by the seam |`);
console.log(`|---|${pops.map(() => '---').join('|')}|---|---|`);
for (const r of rules) {
  const L = last.xs.filter((x) => x.rule === r);
  const split = [L.filter((x) => x.cause === 'short' && calm(x)).length, L.filter((x) => x.cause === 'short' && !calm(x)).length, L.filter((x) => x.cause === 'crisis' || x.cause === 'mixed').length];
  const calmOther = L.filter((x) => x.cause === 'calm').length; // 8i.surplus in a calm town: no mark at all
  const held = L.filter((x) => x.heldBy); const hk = [...new Set(held.map((x) => x.heldBy))].join(', ');
  console.log(`| ${r} | ${pops.map((p) => t(p.xs.filter((x) => x.rule === r))).join(' | ')} | ${split.join(' · ')}${calmOther ? ` (+${calmOther} unmarked, calm)` : ''} | ${held.length}${hk ? ` (${hk})` : ''} |`);
}
const main = (xs) => xs.filter((x) => !/\.mild$/.test(x.rule));
console.log(`| ALL but .mild | ${pops.map((p) => t(main(p.xs))).join(' | ')} | | |`);
console.log(`| ALL but .mild and 8h | ${pops.map((p) => t(main(p.xs).filter((x) => !x.rule.startsWith('8h')))).join(' | ')} | | |`);
