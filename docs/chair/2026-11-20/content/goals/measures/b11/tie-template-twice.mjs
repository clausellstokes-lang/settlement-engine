// GOALS-4 builder 11, item 8 (c): THE PLACES THAT PRINT ONE TIE TEMPLATE TWICE, by size and by archetype.
// Usage: node tie-template-twice.mjs <tree> [n=150] [out]
//   <tree>  a repository tree (an archive copy with node_modules symlinked, or a checkout)
//   n       towns per size (seeds hxd-<size>-<i>, i < n, as goals-final.mjs); out: also write the table there
// A tie's template is its (archetypeKey, line index) — `proseVariant` less REVERSED_TIE — so names are masked by
// construction: two ties print one template where they print one index of one archetype. A PLACE counts once per size
// where any template prints twice or more; once per archetype where a template of that archetype does. `repeats` is the
// sum over places of k-1 per template held k times.
// With a fourth argument (a path), it also writes THE BOTH-EXHAUSTED LIST (addendum A2, for the depth lane): by archetype and
// size, the places where an archetype printed one template twice and the repeat ties. Under TIES-HOLD a repeat is printed
// only where the pool AND the reserve hold no line the tie may take (every line taken, or refused by its trust clause or
// its declarations), so at the cure's tip each row counts the places where both were exhausted for that archetype.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [, , L, nA = '150', out = '', listOut = ''] = process.argv;
if (!L) { console.error('usage: node tie-template-twice.mjs <tree> [n=150] [out]'); process.exit(2); }
const t0 = Date.now();
const imp = (p) => import(pathToFileURL(path.join(L, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { SIZES } = await imp('tests/components/pageCensusWalk.shared.mjs');
await loadGenerationLawPayloads();
const REV = 1 << 16;
const bySize = new Map(); const byArch = new Map(); const byArchSize = new Map(); let ties = 0;
for (const size of SIZES) {
  const R = { towns: 0, ties: 0, places: 0, repeats: 0 }; bySize.set(size, R);
  for (let i = 0; i < +nA; i++) {
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
    R.towns++;
    const m = new Map();
    for (const r of t.relationships || []) {
      if (typeof r.proseVariant !== 'number') continue;
      R.ties++; ties++;
      const k = `${r.archetypeKey}#${r.proseVariant >= REV ? r.proseVariant - REV : r.proseVariant}`;
      m.set(k, (m.get(k) || 0) + 1);
    }
    const archs = new Set();
    for (const [k, n] of m) if (n > 1) {
      R.repeats += n - 1; const a = k.split('#')[0]; archs.add(a);
      const cell = byArchSize.get(`${a}\t${size}`) || { places: new Set(), repeats: 0 }; cell.places.add(i); cell.repeats += n - 1; byArchSize.set(`${a}\t${size}`, cell);
    }
    if (archs.size) R.places++;
    for (const a of archs) byArch.set(a, (byArch.get(a) || 0) + 1);
  }
}
const lines = [`ties: ${ties}; elapsed ${((Date.now() - t0) / 1000).toFixed(1)}s; tree ${L}; ${nA}/size`,
  'size'.padEnd(12) + ['towns', 'ties', 'places', 'repeats'].map((c) => c.padStart(9)).join('')];
const tot = { towns: 0, ties: 0, places: 0, repeats: 0 };
for (const [s, R] of bySize) { lines.push(s.padEnd(12) + [R.towns, R.ties, R.places, R.repeats].map((v) => String(v).padStart(9)).join('')); for (const c of Object.keys(tot)) tot[c] += R[c]; }
lines.push('TOTAL'.padEnd(12) + [tot.towns, tot.ties, tot.places, tot.repeats].map((v) => String(v).padStart(9)).join(''));
lines.push('places by archetype (a place counts once per archetype with a template printed twice):');
for (const [a, n] of [...byArch].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))) lines.push(`  ${a.padEnd(24)}${String(n).padStart(6)}`);
const text = lines.join('\n') + '\n';
process.stdout.write(text); if (out) fs.writeFileSync(out, text);
if (listOut) {
  const rows = [`# both-exhausted list: tree ${L}; ${nA}/size; archetype, size, places, repeat ties`, 'archetype\tsize\tplaces\trepeats'];
  const order = new Map(SIZES.map((sz, j) => [sz, j]));
  for (const [k, c] of [...byArchSize].sort((x, y) => x[0].split('\t')[0].localeCompare(y[0].split('\t')[0]) || order.get(x[0].split('\t')[1]) - order.get(y[0].split('\t')[1]))) rows.push(`${k}\t${c.places.size}\t${c.repeats}`);
  fs.writeFileSync(listOut, rows.join('\n') + '\n');
}
