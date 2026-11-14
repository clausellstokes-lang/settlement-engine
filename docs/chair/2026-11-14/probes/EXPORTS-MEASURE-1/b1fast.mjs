// node b1fast.mjs <corpus> <treeA> <treeB>: the five readiness sentences of every town by each tree's buildThreatAssessment; prints
// how many towns' rows differ, the lines that change (distinct, counted), and the clergy line's towns by roster.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, A, B] = process.argv.slice(2);
const fa = (await import(A + '/src/domain/display/defenseDisplay.js')).deriveDefenseReadiness;
const fb = (await import(B + '/src/domain/display/defenseDisplay.js')).deriveDefenseReadiness;
let diff = 0; const moved = {}; const towns = new Set();
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const a = fa(s), b = fb(s); let d = false;
  a.forEach((row, i) => { if (row.assess !== b[i].assess) { d = true; const k = `${s.tier}: ${row.assess.slice(0,60)} => ${b[i].assess.slice(0,60)}`; moved[k] = (moved[k] || 0) + 1; } });
  if (d) { diff++; towns.add(seed); } }
console.log('towns whose readiness rows change:', diff);
for (const [k, n] of Object.entries(moved).sort((x, y) => y[1] - x[1]).slice(0, 12)) console.log(n, k);
fs.writeFileSync(process.env.OUTF || '/dev/null', JSON.stringify([...towns]));
