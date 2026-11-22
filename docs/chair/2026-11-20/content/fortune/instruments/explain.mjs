// FORTUNE-1 instrument: towns before and after as plain lines, each with the facts of its record that decide.
//   node explain.mjs <before.jsonl> <after.jsonl> <twenty|large> [tag]
// `twenty`: per size the first calm town and the first born under a crisis, then the eight largest standing movers.
// `large`: every calm city and metropolis the new rule reads Poor or worse, or Contested or worse (FS4's sample).
import { readFileSync } from 'node:fs';
const load = (f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const [A, B] = [load(process.argv[2]), load(process.argv[3])];
const mode = process.argv[4] ?? 'twenty'; const tag = process.argv[5] ?? '';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const EXPECT = { thorp: 3, hamlet: 5, village: 8, town: 20, city: 42, metropolis: 53 }; // the proposal's measured medians (ratio rule: thin below x0.75, deep from x1.3)
const DEF_ORDER = ['Undefended', 'Vulnerable', 'Lightly Defended', 'Defensible', 'Well-Defended', 'Fortress'];
const DEF_USUAL = { thorp: [1, 1], hamlet: [0, 1], village: [0, 1], town: [2, 3], city: [4, 5], metropolis: [4, 5] };
const facts = (b) => {
  const p = b.printed || {}; const f = [];
  f.push(`${b.route} (${p.routeBase})`);
  f.push(`threat ${b.threat ?? '?'} (${p.threat})`);
  if (p.eco) f.push(`economy dial ${b.dials?.economy} (${p.eco >= 0 ? '+' : ''}${p.eco.toFixed(2)})`);
  const e = EXPECT[b.size];
  f.push(`trades ${p.econInst} against an expected ${e} (thin below ${+(e * 0.75).toFixed(2)}, deep from ${+(e * 1.3).toFixed(2)}: ${p.depth > 0 ? '+1 deep' : p.depth < 0 ? '-1 thin' : '0'})`);
  if (p.food) f.push(`food ${p.foodLabel} (${p.food})`);
  if (p.mil) f.push(`military dial ${b.dials?.military} (${p.mil})`);
  if (b.econOut >= 70) f.push(`economy output ${Math.round(b.econOut)} (+1 step)`); else if (b.econOut < 15) f.push(`economy output ${Math.round(b.econOut)} (-1 step)`);
  if (b.crime >= 65) f.push(`crime ${Math.round(b.crime)} (-1 step)`);
  if (b.stress.length) f.push(`CRISIS ${b.stress.join('+')}`);
  f.push(`safety ${b.safety} (${b.legit.breakdown?.safety})`);
  const di = DEF_ORDER.indexOf(b.defense.label); const [ul, uh] = DEF_USUAL[b.size];
  f.push(`defence ${b.defense.label} against usual ${DEF_ORDER[ul]}${uh !== ul ? `-${DEF_ORDER[uh]}` : ''} (${b.legit.breakdown?.defense})`);
  return f.join('; ');
};
const line = (a, b) => `${b.name} (${b.size}, ${b.seed}${b.calm ? ', calm' : ''}): fortune ${a.prosperity} -> ${b.prosperity}; standing ${a.legit.label} ${a.legit.score} -> ${b.legit.label} ${b.legit.score}. Decides: ${facts(b)}.`;
let picks = [];
if (mode === 'twenty') {
  for (const s of SIZES) { const i = A.findIndex((r) => r.size === s && r.calm); const j = A.findIndex((r) => r.size === s && !r.calm); picks.push(i, j); }
  const movers = A.map((r, i) => [i, Math.abs(B[i].legit.score - r.legit.score)]).filter(([i]) => !picks.includes(i)).sort((x, y) => y[1] - x[1]).slice(0, 8).map(([i]) => i);
  picks = [...picks, ...movers];
} else {
  picks = B.map((b, i) => [b, i]).filter(([b, i]) => A[i].calm && ['city', 'metropolis'].includes(b.size) && (['Struggling', 'Subsistence', 'Poor'].includes(b.prosperity) || b.legit.score < 45)).map(([, i]) => i);
}
for (const i of picks) console.log(`${tag}${line(A[i], B[i])}`);
if (mode === 'large') console.log(`${tag}(${picks.length} calm cities and metropolises of ${B.filter((b, i) => A[i].calm && ['city', 'metropolis'].includes(b.size)).length})`);
