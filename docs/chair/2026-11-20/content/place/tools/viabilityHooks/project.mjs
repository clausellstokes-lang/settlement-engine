// PLACE-1 · viabilityHooks MEASURE, section E: the candidate composer (composer.mjs) on measure.mjs's 600 births,
// masked as the chair's census masks. Adapted from ../entrepotNote/project.mjs.
//   node project.mjs <repo> <rows.json> > out/project.txt
//   node project.mjs <repo> <rows.json> terrain > out/project-noterrain.txt   (the rows needing `terrain` dropped)
//   node project.mjs <repo> <rows.json> ironPeace > out/project-noiron.txt    (the gap pool alone)
import fs from 'node:fs';
const [, , L, ROWS, dropArg = ''] = process.argv;
const drop = dropArg ? dropArg.split(',') : [];
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { hashKey } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { compose, MODERATE_GAP, IRON_PEACE } = await import('./composer.mjs');
const rows = JSON.parse(fs.readFileSync(ROWS, 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const k = { fnv1a32, hashKey };
const out = (s = '') => console.log(s);
const all = [...MODERATE_GAP, ...IRON_PEACE];
out(`DROPPED ATOMS: ${drop.join(', ') || 'none'}`);
out(`MASK: candidate rows hold no digit: ${all.every((x) => !/\d/.test(x.text))}; the hook-truth words (the town / villagers / starv / famine / banditry / magic / watch / walls / soldiers) in no row: ${all.every((x) => !/\b(?:the|this) town\b|villagers?|starv|famine|banditry|magic|\bwatch|walls?\b|soldiers?/i.test(x.text))}`);
const how = new Map();
for (const r of rows) for (const h of r.hooks) { const x = compose(k, r, h, drop); how.set(x.how, (how.get(x.how) || 0) + 1); }
out(`DRAW: ${[...how.entries()].map(([a, b]) => `${a} ${b}`).join(', ')} (hooks of 600 births)`);
out();
/** @param {any[]} rs @param {(r:any,h:any)=>string} textOf */
function top(rs, textOf) {
  const m = new Map(); let holders = 0;
  for (const r of rs) { const s = new Set(r.hooks.map((h) => textOf(r, h))); if (s.size) holders++; for (const x of s) m.set(x, (m.get(x) || 0) + 1); }
  return { holders, sorted: [...m.entries()].sort((a, b) => b[1] - a[1]) };
}
const before = (r, h) => h.masked;
const after = (r, h) => compose(k, r, h, drop).text;
out('TOP SHARE BY SIZE: places of 100 holding the commonest hook, BEFORE -> AFTER (of the size\'s holders)');
let worst = { size: null, n: -1 };
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size);
  const b = top(rs, before), a = top(rs, after);
  const bn = b.sorted[0]?.[1] ?? 0, an = a.sorted[0]?.[1] ?? 0;
  if (an > worst.n) worst = { size, n: an };
  out(`${size.padEnd(10)} ${String(bn).padStart(3)} -> ${String(an).padStart(3)}   (holders ${b.holders}; distinct ${b.sorted.length} -> ${a.sorted.length})   after top: "${(a.sorted[0]?.[0] || '').slice(0, 80)}"`);
}
out();
out(`WORST AFTER: ${worst.size} ${worst.n}/100. Its ten commonest after-sentences:`);
for (const [s, n] of top(rows.filter((r) => r.size === worst.size), after).sorted.slice(0, 10)) out(`  ${String(n).padStart(3)}  ${s}`);
out();
for (const [name, pool, tpl] of [['MODERATE_GAP', MODERATE_GAP, ['S1t.moderateGapTwin']], ['IRON_PEACE', IRON_PEACE, ['I2.price', 'I3.carts', 'I4.toll']]]) {
  out(`${name}: rows used over the 600 (of ${pool.length})`);
  const m = new Map();
  for (const r of rows) for (const h of r.hooks) if (tpl.includes(h.template)) { const x = compose(k, r, h, drop).id; m.set(x, (m.get(x) || 0) + 1); }
  out(`  ${[...m.entries()].sort((a, b) => b[1] - a[1]).map(([a, b]) => `${a} ${b}`).join(', ')}`);
  out(`  never used: ${pool.map((p) => p.id).filter((id) => !m.has(id)).join(', ') || 'none'}`);
}
out();
out('UNCHANGED: category, severity and the hook count (the summary\'s "N plot hooks available") are not read or written.');
