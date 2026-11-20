// FORTUNE-1 instrument: what the rule moves, before and after, by size, born under no crisis and under one (FS6).
//   node compare.mjs <before.jsonl> <after.jsonl>
import { readFileSync } from 'node:fs';
const load = (f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const [A, B] = [load(process.argv[2]), load(process.argv[3])];
if (A.length !== B.length || A.some((r, i) => r.seed !== B[i].seed)) throw new Error('the two runs are not the same seeds');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '-');
const stab = (s) => String(s).replace(/\s*\(.*$/, '').replace(/[;—].*$/, '').trim();
const FIELDS = [
  ['FORTUNE (economicState.prosperity, the printed label)', (r) => r.prosperity, ['Struggling', 'Subsistence', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy']],
  ['STANDING (publicLegitimacy.label)', (r) => r.legit.label, ['Legitimacy Crisis', 'Contested', 'Tolerated', 'Approved', 'Endorsed']],
  ['DEFENCE (defenseProfile.readiness.label)', (r) => r.defense.label, ['Undefended', 'Vulnerable', 'Lightly Defended', 'Defensible', 'Well-Defended', 'Fortress']],
  ['STABILITY (powerStructure.stability, its first word)', (r) => stab(r.stability), null],
  ['CRIMINAL CAPTURE RUNG (powerStructure.criminalCaptureState)', (r) => r.capture ?? 'absent', ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture', 'absent']],
];
for (const arm of [['BORN UNDER NO CRISIS', (r) => r.calm], ['BORN UNDER A CRISIS', (r) => !r.calm]]) {
  console.log(`\n=============== ${arm[0]} ===============`);
  for (const [title, get, order] of FIELDS) {
    const keys = order ?? [...new Set([...A, ...B].filter(arm[1]).map(get))].sort();
    const present = keys.filter((k) => A.some((r) => arm[1](r) && get(r) === k) || B.some((r) => arm[1](r) && get(r) === k));
    console.log(`\n${title}: before -> after, share of the size's towns in the arm`);
    console.log(['size (n)'.padEnd(16), ...present.map((k) => k.slice(0, 17).padStart(18))].join(''));
    for (const s of SIZES) {
      const a = A.filter((r) => r.size === s && arm[1](r)); const b = B.filter((r, i) => r.size === s && arm[1](A[i]));
      console.log([`${s} (${a.length})`.padEnd(16), ...present.map((k) => `${pct(a.filter((r) => get(r) === k).length, a.length)} -> ${pct(b.filter((r) => get(r) === k).length, b.length)}`.padStart(18))].join(''));
    }
  }
  console.log('\nWHAT OTHER LANES READ: standing below 45 (the session sheet\'s weight); the incumbent protected in a contest (rulingPowerCoup.js :: coupContenders().incumbent.gated); the score\'s mean');
  for (const s of SIZES) {
    const a = A.filter((r) => r.size === s && arm[1](r)); const b = B.filter((r, i) => r.size === s && arm[1](A[i]));
    const m = (g) => (g.reduce((x, r) => x + r.legit.score, 0) / (g.length || 1)).toFixed(1);
    const bd = (g, k) => (g.reduce((x, r) => x + (r.legit.breakdown?.[k] ?? 0), 0) / (g.length || 1)).toFixed(1);
    console.log(`${`${s} (${a.length})`.padEnd(16)} below 45: ${pct(a.filter((r) => r.legit.score < 45).length, a.length)} -> ${pct(b.filter((r) => r.legit.score < 45).length, b.length)} | protected: ${pct(a.filter((r) => r.gated === true).length, a.length)} -> ${pct(b.filter((r) => r.gated === true).length, b.length)} | score mean ${m(a)} -> ${m(b)} | prosperity term ${bd(a, 'prosperity')} -> ${bd(b, 'prosperity')} | defence term ${bd(a, 'defense')} -> ${bd(b, 'defense')} | safety ${bd(a, 'safety')} -> ${bd(b, 'safety')} | food ${bd(a, 'food')} -> ${bd(b, 'food')}`);
  }
}
const moved = A.filter((r, i) => r.calm !== B[i].calm || JSON.stringify(r.stress) !== JSON.stringify(B[i].stress)).length;
console.log(`\nTHE CRISIS DRAW: towns whose crisis differs between the runs: ${moved} of ${A.length} (the share of calm towns is ${pct(A.filter((r) => r.calm).length, A.length)} -> ${pct(B.filter((r) => r.calm).length, B.length)})`);
