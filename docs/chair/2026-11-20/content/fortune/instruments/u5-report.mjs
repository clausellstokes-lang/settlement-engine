// FORTUNE U5 instrument: the tables of the proposal, from `u5-measure.mjs` runs (each the same seeds).
//   node u5-report.mjs usual  <ruled-derivation.jsonl>                  the safety ladder's usual range by size (p10..p90)
//   node u5-report.mjs search <ruled.jsonl> [more.jsonl ...]            the record's candidate merits and conditions, rate by size (calm)
//   node u5-report.mjs tables <today.jsonl> <ruled.jsonl> <u5.jsonl>    standing by size (calm and crisis-born), FS4, reasons, the contest's figures
//   node u5-report.mjs twenty <today.jsonl> <ruled.jsonl> <u5.jsonl>    twenty calm towns as plain lines
import { readFileSync } from 'node:fs';
import { RULER_TROUBLE } from './u5-rule.mjs';

const load = (f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const LAB = ['Legitimacy Crisis', 'Contested', 'Tolerated', 'Approved', 'Endorsed'];
const LADDER = ['Dangerous', 'Unsafe', 'Moderate', 'Safe', 'Very Safe'];
const pct = (n, d) => (d ? Math.round((100 * n) / d) : 0);
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const MAJOR = (s) => s === 'major' || s === 'catastrophic';
const VICE = ['price', 'slippery', 'hard'];
const weathered = (r, pred) => r.events.filter((e) => pred(e) && !r.tensions.some((t) => t.type === e.tpl) && !r.notes.some((n) => n.name === e.name && n.rel === 'unresolved'));
export const TROUBLE = (r) => r.tensions.some((t) => RULER_TROUBLE.includes(t.type) || t.namesSeat) || ['corrupted', 'capture'].includes(r.capture);
// every candidate the search read, a pure read of the born record (the `u5-measure.mjs` line)
const CANDIDATES = {
  'principled ruler (dominant trait in the straight family, no vice)': (r) => r.ruler?.famDominant === 'straight' && !VICE.includes(r.ruler?.famFlaw),
  'principled ruler, any flaw (the chair\'s reading)': (r) => r.ruler?.famDominant === 'straight',
  'kindly ruler (dominant trait in the warm family, no vice)': (r) => r.ruler?.famDominant === 'warm' && !VICE.includes(r.ruler?.famFlaw),
  'ruler with no flaw at all': (r) => !r.ruler?.flaw,
  'weathered catastrophe within 60 years (no trouble of its kind today, none "never put right")': (r) => weathered(r, (e) => e.sev === 'catastrophic' && e.yearsAgo <= 60).length > 0,
  'weathered catastrophe within 40 years': (r) => weathered(r, (e) => e.sev === 'catastrophic' && e.yearsAgo <= 40).length > 0,
  'weathered catastrophe within 100 years': (r) => weathered(r, (e) => e.sev === 'catastrophic' && e.yearsAgo <= 100).length > 0,
  'weathered catastrophe, any age': (r) => weathered(r, (e) => e.sev === 'catastrophic').length > 0,
  'weathered hardship major or worse, any age (the chair\'s reading)': (r) => weathered(r, (e) => MAJOR(e.sev)).length > 0,
  'a legacy line "hit hard, and it has since recovered"': (r) => r.notes.some((n) => n.rel === 'recovery'),
  'a legacy line "the way it is ruled was settled then" (political drift)': (r) => r.notes.some((n) => n.type === 'political' && n.rel === 'drift'),
  'founded "through sustained effort and reliable governance"': (r) => r.founding.overcoming === 'through sustained effort and reliable governance',
  'a siege in the history (siegeNarrative)': (r) => r.siege,
  'every relation of the seat calm (none tense or competitive)': (r) => r.rels.length > 0 && r.rels.every((x) => !['tense', 'competitive', 'hostile', 'rival'].includes(x.type)),
  'faith and seat ALLIED (a relation of type allied)': (r) => r.rels.some((x) => x.cat === 'religious' && x.type === 'allied'),
  'previousGovernments present': (r) => r.previousGovernments !== 'absent' && r.previousGovernments !== 0,
  'a neighbour relationship recorded': (r) => !!r.neighbour,
};
const CONDITIONS = {
  'CONDITION: no trouble of today concerns the ruler, no capture (U5\'s)': (r) => !TROUBLE(r),
  '  of which: no tension of the ruler\'s kinds or naming the seat': (r) => !r.tensions.some((t) => RULER_TROUBLE.includes(t.type) || t.namesSeat),
  '  of which: capture rung not corrupted or capture': (r) => !['corrupted', 'capture'].includes(r.capture),
  'rejected condition: also no HIGH conflict naming the seat': (r) => !TROUBLE(r) && !r.conflicts.some((c) => c.seat && c.intensity === 'high'),
};
const bySize = (rows, fn) => SIZES.map((s) => { const g = rows.filter((r) => r.size === s); return `${pct(g.filter(fn).length, g.length)}%`.padStart(7); }).join('');
const head = (w) => ''.padEnd(w) + SIZES.map((s) => s.slice(0, 6).padStart(7)).join('');

const [, , mode, ...files] = process.argv;
if (mode === 'usual') {
  const R = load(files[0]);
  console.log('SAFETY: each size\'s usual range of the calm ladder (p10..p90 of the band index; towns whose label is on the ladder)');
  console.log(`ladder: ${LADDER.map((l, i) => `${i} ${l}`).join(', ')}`);
  for (const arm of [['calm', (r) => r.calm], ['every town on the ladder', () => true]]) {
    console.log(`\n${arm[0]}:`);
    for (const s of SIZES) {
      const g = R.filter((r) => r.size === s && arm[1](r) && LADDER.includes(r.safety)).map((r) => LADDER.indexOf(r.safety));
      const tally = LADDER.map((l, i) => `${l} ${g.filter((x) => x === i).length}`).join(', ');
      console.log(`${s.padEnd(11)} n ${String(g.length).padStart(3)}  p10 ${q(g, 0.1)} p90 ${q(g, 0.9)}  [${LADDER[q(g, 0.1)]} .. ${LADDER[q(g, 0.9)]}]  (${tally})`);
    }
  }
} else if (mode === 'search') {
  for (const f of files) {
    const calm = load(f).filter((r) => r.calm);
    console.log(`\n${f.replace(/.*\//, '')}: calm towns by size: ${SIZES.map((s) => `${s} ${calm.filter((r) => r.size === s).length}`).join(', ')}`);
    console.log(`ruler found (rank 1 of the governing power): ${calm.filter((r) => r.ruler).length} of ${calm.length}`);
    console.log(head(96));
    for (const [k, fn] of Object.entries({ ...CANDIDATES, ...CONDITIONS })) console.log(k.slice(0, 95).padEnd(96) + bySize(calm, fn));
    console.log('the seat\'s relations by the other power\'s category/type (calm, all sizes): ' + Object.entries(calm.flatMap((r) => r.rels.map((x) => `${x.cat}/${x.type}`)).reduce((m, k) => ({ ...m, [k]: (m[k] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(', '));
  }
} else if (mode === 'tables') {
  const [A, B, C] = files.map(load);
  if (![B, C].every((X) => X.length === A.length && X.every((r, i) => r.seed === A[i].seed))) throw new Error('the runs are not the same seeds');
  for (const [arm, sel] of [['BORN UNDER NO CRISIS', (r) => r.calm], ['BORN UNDER A CRISIS', (r) => !r.calm]]) {
    console.log(`\n=== ${arm}: standing, ${LAB.join(' / ')} (% of the size's towns in the arm, each run's own arm)`);
    console.log(`${'size'.padEnd(11)}${'today'.padStart(22)}${'ruled'.padStart(22)}${'with U5'.padStart(22)}   n (today, ruled, U5)`);
    for (const s of SIZES) {
      const row = [A, B, C].map((X) => { const g = X.filter((r) => r.size === s && sel(r)); return [LAB.map((l) => pct(g.filter((r) => r.legit.label === l).length, g.length)).join('/'), g.length]; });
      console.log(`${s.padEnd(11)}${row.map(([t]) => t.padStart(22)).join('')}   ${row.map(([, n]) => n).join(', ')}`);
    }
  }
  console.log('\n=== FS4: the Legitimacy Crisis share, ruled -> with U5 (must not rise at any size), and the towns whose score FELL');
  for (const s of SIZES) {
    const parts = [['calm', (r) => r.calm], ['crisis-born', (r) => !r.calm]].map(([n, sel]) => {
      const b = B.filter((r) => r.size === s && sel(r)); const c = C.filter((r) => r.size === s && sel(r));
      const lb = b.filter((r) => r.legit.label === LAB[0]).length; const lc = c.filter((r) => r.legit.label === LAB[0]).length;
      return `${n} ${lb} -> ${lc} ${lc > lb ? 'ROSE' : 'held'}`;
    });
    const fell = C.filter((r, i) => r.size === s && r.legit.score < B[i].legit.score).length;
    console.log(`${s.padEnd(11)}${parts.join(' | ')} | score fell in ${fell} towns (calm or not)`);
  }
  const endorsedC = C.filter((r) => r.calm && r.legit.label === 'Endorsed');
  const reasonsOf = (r) => (r.legit.merits?.length ?? 0) + Object.entries(r.legit.breakdown || {}).filter(([k, v]) => k !== 'merits' && v > 0).length;
  console.log(`\n=== REASONS: calm towns Endorsed with U5: ${endorsedC.length}; by reasons count: ${Object.entries(endorsedC.reduce((m, r) => ({ ...m, [reasonsOf(r)]: (m[reasonsOf(r)] || 0) + 1 }), {})).map(([k, c]) => `${k} reasons ${c}`).join(', ')}; fewer than two: ${endorsedC.filter((r) => reasonsOf(r) < 2).length}`);
  console.log('Endorsed with U5 (calm), by what carried it: ' + Object.entries(endorsedC.reduce((m, r) => { const k = [...(r.legit.merits || []), ...Object.entries(r.legit.breakdown).filter(([k2, v]) => k2 !== 'merits' && v > 0).map(([k2, v]) => `${k2}${v}`)].join('+'); return { ...m, [k]: (m[k] || 0) + 1 }; }, {})).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join('; '));
  console.log('\n=== MERITS COUNTED with U5 (calm; a merit counts only at Tolerated or better with no trouble of the ruler), share of the size\'s calm towns');
  console.log(head(30));
  for (const m of ['principled', 'kindly', 'weathered', 'founding']) if (C.some((r) => r.legit.merits?.includes(m))) console.log(m.padEnd(30) + bySize(C.filter((r) => r.calm), (r) => r.legit.merits?.includes(m)));
  console.log('any merit'.padEnd(30) + bySize(C.filter((r) => r.calm), (r) => r.legit.merits?.length > 0));
  console.log('two merits'.padEnd(30) + bySize(C.filter((r) => r.calm), (r) => r.legit.merits?.length > 1));
  console.log('\n=== THE CONTEST\'S FIGURES: today -> ruled -> with U5');
  for (const [arm, sel] of [['calm', (r) => r.calm], ['crisis-born', (r) => !r.calm]]) {
    console.log(`${arm}: the incumbent protected (rulingPowerCoup.js :: coupContenders().incumbent.gated) | capture rung equilibrium or worse | corrupted or capture | below 45 | score mean`);
    for (const s of SIZES) {
      const f = (X, fn) => { const g = X.filter((r) => r.size === s && sel(r)); return `${pct(g.filter(fn).length, g.length)}%`; };
      const m = (X) => { const g = X.filter((r) => r.size === s && sel(r)); return (g.reduce((x, r) => x + r.legit.score, 0) / (g.length || 1)).toFixed(1); };
      const tri = (fn) => [A, B, C].map((X) => f(X, fn)).join(' -> ');
      console.log(`  ${s.padEnd(11)} protected ${tri((r) => r.gated === true).padEnd(20)} | eq+ ${tri((r) => ['equilibrium', 'corrupted', 'capture'].includes(r.capture)).padEnd(17)} | corr+ ${tri((r) => ['corrupted', 'capture'].includes(r.capture)).padEnd(15)} | <45 ${tri((r) => r.legit.score < 45).padEnd(17)} | ${[A, B, C].map(m).join(' -> ')}`);
    }
  }
  const moved = B.filter((r, i) => r.calm !== C[i].calm || r.ruler?.dominant !== C[i].ruler?.dominant || JSON.stringify(r.events) !== JSON.stringify(C[i].events)).length;
  console.log(`\nTHE BIRTH UNDER U5 vs THE RULED BIRTH: towns whose crisis, ruler's trait or history differ: ${moved} of ${B.length}; towns whose capture rung differs: ${B.filter((r, i) => r.capture !== C[i].capture).length}; whose band differs: ${B.filter((r, i) => r.legit.label !== C[i].legit.label).length}`);
} else if (mode === 'twenty') {
  const [A, B, C] = files.map(load);
  const picks = [];
  for (const s of SIZES) {
    const calm = C.map((r, i) => [r, i]).filter(([r]) => r.size === s && r.calm);
    const withMerit = calm.filter(([r]) => r.legit.merits?.length); const without = calm.filter(([r]) => !r.legit.merits?.length);
    picks.push(...withMerit.slice(0, 2).map(([, i]) => i), ...without.slice(0, 1).map(([, i]) => i));
  }
  const endorsed = C.map((r, i) => [r, i]).filter(([r, i]) => r.calm && r.legit.label === 'Endorsed' && !picks.includes(i)).map(([, i]) => i);
  picks.push(...endorsed.slice(0, 20 - picks.length));
  for (const i of picks.slice(0, 20)) {
    const [a, b, c] = [A[i], B[i], C[i]];
    const why = [];
    if (c.legit.merits?.length) why.push(`merits: ${c.legit.merits.join(', ')}`); else why.push('no merit counted');
    if (TROUBLE(c)) why.push(`ruler's trouble today (${c.tensions.filter((t) => RULER_TROUBLE.includes(t.type) || t.namesSeat).map((t) => t.type).join(', ') || c.capture})`);
    if (c.ruler) why.push(`ruler ${c.ruler.role}: ${c.ruler.dominant ?? 'no dominant trait'}${c.ruler.flaw ? `, flaw ${c.ruler.flaw}` : ''}`);
    const cat = c.events.filter((e) => e.sev === 'catastrophic').map((e) => `${e.name} ${e.yearsAgo}y`);
    if (cat.length) why.push(`catastrophes: ${cat.join(', ')}`);
    why.push(`terms ${Object.entries(c.legit.breakdown).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    console.log(`${c.name} (${c.size}, ${c.seed}): ${a.legit.label} ${a.legit.score} / ${b.legit.label} ${b.legit.score} / ${c.legit.label} ${c.legit.score}. Decides: ${why.join('; ')}.`);
  }
} else if (mode === 'shared') {
  // what a shared page (publicSafe.js :: toPublicSafe) carries of each fact a merit or the condition reads
  for (const f of files) {
    const R = load(f).filter((r) => r.shared);
    const withMerit = R.filter((r) => r.legit.merits?.length);
    console.log(`\n${f.replace(/.*\//, '')}: ${R.length} towns probed; ${withMerit.length} with a merit counted`);
    for (const k of ['ruler', 'rulerTraits', 'events', 'tensions', 'notes', 'capture', 'breakdown']) {
      console.log(`  ${k.padEnd(12)} carried in ${pct(R.filter((r) => r.shared[k]).length, R.length)}% of towns; in ${pct(withMerit.filter((r) => r.shared[k]).length, withMerit.length)}% of the towns with a merit`);
    }
    const lost = withMerit.filter((r) => (r.legit.merits.includes('principled') && !r.shared.rulerTraits) || (r.legit.merits.includes('weathered') && !(r.shared.events && r.shared.tensions)));
    console.log(`  towns whose shared page would OMIT a counted merit's reason: ${lost.length}`);
  }
} else throw new Error('usage: node u5-report.mjs <usual|search|tables|twenty|shared> <files...>');
