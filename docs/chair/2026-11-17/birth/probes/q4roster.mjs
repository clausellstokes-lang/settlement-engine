// BIRTH-AUDIT Q4 · R3: what the gate at the draw removes and what stands in its place. Per town of two corpora of the same
// seeds: the houses lost and gained (by name), the four gated kinds lost, and whether the rest of the roster moved too.
//   node docs/chair/2026-11-17/birth/probes/q4roster.mjs <base.gz> <rule.gz>
import fs from 'node:fs'; import zlib from 'node:zlib';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const [fb, ft] = process.argv.slice(2); const B = load(fb), T = load(ft);
const GATED = new Set(['Stone quarry', 'Charcoal burner', 'Dairy farmer', 'Salt works']);
const names = (s) => (s.institutions || []).map((i) => i.name);
let lostGated = 0, townsLostGated = 0, townsOnlyGated = 0, townsOther = 0; const lost = {}, gained = {};
for (const [seed, sb] of B) { const st = T.get(seed); if (!st) continue;
  const a = names(sb), b = names(st); const L = a.filter((x) => !b.includes(x)), G = b.filter((x) => !a.includes(x));
  const lg = L.filter((x) => GATED.has(x)); if (lg.length) { townsLostGated++; lostGated += lg.length; }
  const other = [...L.filter((x) => !GATED.has(x)), ...G];
  if (lg.length && !other.length) townsOnlyGated++; if (other.length) townsOther++;
  for (const x of L) lost[x] = (lost[x] || 0) + 1; for (const x of G) gained[x] = (gained[x] || 0) + 1; }
console.log(`towns ${B.size} · towns losing a gated source house ${townsLostGated} (houses ${lostGated}) · of them nothing else in the roster moved ${townsOnlyGated} · towns whose roster moved beyond the gated houses ${townsOther}`);
const top = (o) => Object.entries(o).sort((x, y) => y[1] - x[1]).slice(0, 12).map(([k, v]) => `${k} ${v}`).join('; ');
console.log('lost:', top(lost)); console.log('gained:', top(gained));
