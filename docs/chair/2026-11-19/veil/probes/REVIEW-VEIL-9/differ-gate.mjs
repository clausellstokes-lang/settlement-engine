// REVIEW-VEIL-9 — THE CLEARANCE GATE OVER THE DIFFER (the chair's standard, 2026-11-19 07:01): every path the differ
// finds IN THE CLASS (any veil, any shape) must be (i) in the builder's registry with its rule (recompose or withhold),
// or (ii) ruled DIFFUSE (VR8: the overall safety band and the roster's general composition), or (iii) RNG-ONLY (VR13:
// the history drawn again). Zero unregistered paths, else exit 1.
//   node differ-gate.mjs <registry.json> <rulings.json> <differ shard.json>...
//   registry.json: [{ "path": "<regex over the differ's normalised path>", "rule": "withhold|recompose", "by": "<writer>" }]
//   rulings.json:  { "diffuse": ["<regex>", ...], "rng": ["<regex>", ...] }
import { readFileSync } from 'node:fs';
const [regF, rulF, ...files] = process.argv.slice(2);
const reg = JSON.parse(readFileSync(regF, 'utf8')).map((r) => ({ ...r, re: new RegExp(r.path) }));
const rul = JSON.parse(readFileSync(rulF, 'utf8')); const diffuse = (rul.diffuse || []).map((x) => new RegExp(x)); const rng = (rul.rng || []).map((x) => new RegExp(x));
const rows = {};
for (const f of files) { const x = JSON.parse(readFileSync(f, 'utf8')); for (const r of x.rows) { const a = rows[r.path] = rows[r.path] || { B: {}, C: {}, ex: {} };
  for (const [v, n] of Object.entries(r.B)) a.B[v] = (a.B[v] || 0) + n; for (const [v, n] of Object.entries(r.C)) a.C[v] = (a.C[v] || 0) + n; for (const [k, e] of Object.entries(r.ex)) a.ex[k] = a.ex[k] || e; } }
const out = { registered: 0, diffuse: 0, rng: 0, unregistered: [] };
for (const [p, a] of Object.entries(rows)) {
  const inClass = Object.keys(a.B).some((v) => (a.B[v] || 0) >= 2 && (a.C[v] || 0) * 3 <= a.B[v]); if (!inClass) continue;
  if (reg.some((r) => r.re.test(p))) out.registered += 1; else if (diffuse.some((re) => re.test(p))) out.diffuse += 1; else if (rng.some((re) => re.test(p))) out.rng += 1;
  else out.unregistered.push(`${p} | B ${JSON.stringify(a.B)} | C ${JSON.stringify(a.C)} | ${String(Object.values(a.ex)[0]).slice(0, 220)}`); }
console.log(`registered ${out.registered} | diffuse ${out.diffuse} | rng-only ${out.rng} | UNREGISTERED ${out.unregistered.length}`); for (const u of out.unregistered) console.log(`  ${u}`);
process.exit(out.unregistered.length ? 1 : 0);
