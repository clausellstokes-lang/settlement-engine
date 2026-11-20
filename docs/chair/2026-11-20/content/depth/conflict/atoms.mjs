// atoms.mjs <rows.jsonl> — per size: share of the 100 places where each vocabulary atom holds (site facts with config = what
// the power step can read: the roster's names, the tier and the config; [final] where the final record answers otherwise),
// and the same shares inside each branch (GRAZING+FIELD ROTATION, LEVIES).
import { readFileSync } from 'node:fs';
import { rungOf } from './rungs.mjs';
const rows = readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const branch = (r) => { const k = rungOf(r.rc); return /GRAZING|FIELD ROTATION/.test(k) ? 'G' : /LEVIES/.test(k) ? 'L' : null; };
const atoms = Object.keys(rows[0].siteCfg); const nx = Object.keys(rows[0].nameRx);
const pct = (n, d) => d ? String(Math.round(100 * n / d)).padStart(3) : '  -';
for (const [label, pick] of [['ALL 100', () => true], ['GRAZING+FIELD branch', (r) => branch(r) === 'G'], ['LEVIES branch', (r) => branch(r) === 'L']]) {
  const g = Object.fromEntries(SIZES.map((s) => [s, rows.filter((r) => r.size === s && pick(r))]));
  console.log(`\n### ${label}: n = ${SIZES.map((s) => `${s} ${g[s].length}`).join(', ')}  (percent of the group; site=power-step facts w/ config; |final if differs by >5)`);
  console.log('atom'.padEnd(26) + SIZES.map((s) => s.slice(0, 5).padStart(10)).join(''));
  for (const a of atoms) {
    const cells = SIZES.map((s) => { const G = g[s]; const site = G.filter((r) => r.siteCfg[a] === true).length, fin = G.filter((r) => r.final[a] === true).length, un = G.filter((r) => r.siteCfg[a] === null).length;
      const c = un === G.length && G.length ? '   ?' : pct(site, G.length); return (Math.abs(site - fin) > 0.05 * G.length ? `${c}|${pct(fin, G.length).trim()}` : c).padStart(10); });
    if (cells.every((c) => c.trim() === '0' || c.trim() === '-')) continue;
    console.log(a.padEnd(26) + cells.join(''));
  }
  for (const a of nx) console.log(a.padEnd(26) + SIZES.map((s) => pct(g[s].filter((r) => r.nameRx[a]).length, g[s].length).padStart(10)).join(''));
}
