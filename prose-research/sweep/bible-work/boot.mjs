import { readFileSync } from 'node:fs'; import path from 'node:path';
const P = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/probe-all';
const { measure } = await import(path.join(P, 'metrics.mjs'));
const W = process.argv[2];
const B = JSON.parse(readFileSync(path.join(W, 'bible.json'), 'utf8'));
const R = JSON.parse(readFileSync(path.join(W, 'report.json'), 'utf8')); const M = R.metrics;
const STYLE = [['words/segment mean',(m)=>m.wps.mean],['words/segment sd',(m)=>m.wps.sd],['share segments < 8 words',(m)=>m.wps.under8],['share segments > 30 words',(m)=>m.wps.over30],['segments / variant',(m)=>m.segmentsPerVariant],['antithesis SHAPE rate',(m)=>m.shapesRate.antithesisShape],['gloss tail rate',(m)=>m.shapesRate.glossTail],['2nd-sentence summary rate',(m)=>m.shapesRate.secondSentSummary],['semicolon rate',(m)=>m.shapesRate.semicolon],['colon rate',(m)=>m.shapesRate.colon],['parenthesis rate',(m)=>m.shapesRate.parenthesis],['abstract-noun closer rate',(m)=>m.shapesRate.abstractCloser],['adverbs / segment',(m)=>m.shapesRate.adverbsPerSegment],['participial-opener rate',(m)=>m.shapesRate.participialOpener],['triad-list rate',(m)=>m.shapesRate.triadList],['rationed pet words / variant',(m)=>m.petRate],['AI tells / variant EXOGENOUS',(m)=>m.tellsExogenousRate]];
const COLS = Object.keys(M).filter((c) => c !== 'BIBLE' && c !== 'A-W');
console.log('=== how many of the 17 metrics rest on <=1 observation in the n=67 exemplar set? ===');
let zeros = 0, ones = 0;
for (const [l, f] of STYLE) { const v = Number(f(M.BIBLE)); const approxObs = Math.round(v * 67);
  if (v === 0) { zeros++; console.log('   EXACT ZERO :', l); } else if (approxObs <= 1) { ones++; console.log('   ~1 of 67   :', l, v); } }
console.log(`   -> ${zeros} exact zeros + ${ones} single-observation rates = ${zeros + ones} of 17`);
const rank = (bm) => { const d = {};
  for (const [l, f] of STYLE) { const vals = COLS.map((c) => Number(f(M[c])));
    const mu = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mu) ** 2, 0) / vals.length) || 1;
    const bz = (Number(f(bm)) - mu) / sd;
    COLS.forEach((c, i) => { (d[c] ||= 0); d[c] += Math.abs((vals[i] - mu) / sd - bz); }); }
  return COLS.map((c) => ({ c, d: d[c] / STYLE.length })).sort((a, b) => a.d - b.d).map((x) => x.c); };
const rows = B.exemplar.rows;
let s = 12345; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const top = {}, bot = {};
const N = 400;
for (let k = 0; k < N; k++) {
  const samp = Array.from({ length: rows.length }, () => rows[Math.floor(rnd() * rows.length)]);
  const o = rank(measure(samp));
  for (const c of o.slice(0, 3)) top[c] = (top[c] || 0) + 1;
  for (const c of o.slice(-3)) bot[c] = (bot[c] || 0) + 1;
}
console.log(`\n=== BOOTSTRAP over the 67 exemplars (${N} resamples): P(register in the published TOP 3) ===`);
for (const [c, n] of Object.entries(top).sort((a, b) => b[1] - a[1])) console.log('   ', c.padEnd(5), (100 * n / N).toFixed(1) + '%');
console.log(`=== P(register in the BOTTOM 3) ===`);
for (const [c, n] of Object.entries(bot).sort((a, b) => b[1] - a[1])) console.log('   ', c.padEnd(5), (100 * n / N).toFixed(1) + '%');
