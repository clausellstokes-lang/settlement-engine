// REVIEW-POWERS-4 redclass4.mjs — node redclass4.mjs <tip.json> <base.json> <line.json> : the named files' red titles at the
// tip, classed CARRIED (red at the stage's base too), LINE (red at the line's tip), or TIP ONLY; a file absent from a tree is said.
import fs from 'node:fs';
const [tp, bp, lp] = process.argv.slice(2); const L = {};
for (const [t, p] of [['tip', tp], ['base', bp], ['line', lp]]) { const j = JSON.parse(fs.readFileSync(p, 'utf8')); L[t] = { red: {}, files: new Set() };
  for (const r of j.testResults) { const f = r.name.replace(/.*?\/(tests\/)/, '$1'); L[t].files.add(f);
    for (const a of r.assertionResults) if (a.status === 'failed') L[t].red[`${f} :: ${a.fullName.slice(0, 100)}`] = 1;
    if (r.status === 'failed' && !r.assertionResults.some((a) => a.status === 'failed')) L[t].red[`${f} :: (the file failed to run)`] = 1; } }
const tip = Object.keys(L.tip.red); console.log('red titles: tip', tip.length, 'base', Object.keys(L.base.red).length, 'line', Object.keys(L.line.red).length);
const cls = {}; for (const k of tip) { const f = k.split(' :: ')[0];
  const c = L.base.red[k] ? 'CARRIED (red at the base 96a6ced46)' : L.line.red[k] ? 'THE LINE\'S (red at 976db5b19, green or absent at the base)' : `TIP ONLY${L.base.files.has(f) ? '' : ' (file absent at the base)'}${L.line.files.has(f) ? '' : ' (file absent on the line)'}`; (cls[c] ||= []).push(k); }
for (const [c, ks] of Object.entries(cls).sort()) { console.log(`## ${c}: ${ks.length}`); for (const k of ks) console.log('   ' + k.slice(0, 180)); }
const gone = Object.keys(L.base.red).filter((k) => !L.tip.red[k]); console.log(`## red at the base, green at the tip: ${gone.length}`); for (const k of gone) console.log('   ' + k.slice(0, 160));
