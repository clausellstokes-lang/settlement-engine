// RUN — compute every deliverable over corpus.json and emit report.json + report.md fragments.
// Usage: node run.mjs <DIR> <OUT-prefix>
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { measure, mineTics } from './metrics.mjs';
import { REGISTERS } from './registers.mjs';

const S = process.argv[2];
const P = process.argv[3];
const corpus = JSON.parse(readFileSync(path.join(S, 'corpus.json'), 'utf8'));
const bible = JSON.parse(readFileSync(path.join(S, 'bible.json'), 'utf8'));

const NAMES = {
  R1: 'dossier-native STATE', R2: 'dossier-native CAUSAL JOIN', R3: 'Herald receipt pools',
  R4: 'Herald causal grammar + molds', R4b: 'Herald disclosure + lifecycle', R5: 'Herald crier voice',
  R6: 'NPC cause-conjunction ladder', R7: 'institution/service gazetteer', R8: 'world-data prose',
  R9: 'chrome copy registry', R10: 'compendium docent', R11: 'event composer / realm verbs',
  R12: 'treaty / war-status documents', R14: 'generators prose tables', R15: 'src long tail',
  R16: 'JSX + PDF chrome', R17: 'legacy rumor SUBJECT PHRASES', R18: 'inline in-function prose',
  'A-U': 'annex rows UNWIRED', 'A-W': 'annex rows wired (control)',
};
const ORDER = ['R1', 'R2', 'R3', 'R4', 'R4b', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R14', 'R15', 'R16', 'R17', 'R18', 'A-U', 'A-W'];
const UNIT = Object.fromEntries(ORDER.map((id) => [id, (REGISTERS.find((R) => R.id === id) || {}).unit || 'sentence']));

const byReg = {};
for (const r of corpus) (byReg[r.register] ||= []).push(r);

const M = {};
for (const id of ORDER) if (byReg[id]) M[id] = measure(byReg[id]);
M.BIBLE = bible.exemplar.metrics;

// ── (b) house tics, mined per register ──────────────────────────────────────
const tics = {};
for (const id of ORDER) {
  if (!byReg[id]) continue;
  const others = corpus.filter((r) => r.register !== id && r.register !== 'A-W' && r.register !== 'A-U');
  tics[id] = mineTics(byReg[id], byReg[id].concat(others), { minCount: 4, minPools: 3, top: 10 });
}

// ── (a) the metric table ────────────────────────────────────────────────────
const ROWS = [
  ['N variants (deduped)', (m) => m.variants],
  ['files', (m) => m.files],
  ['unit', (m, id) => UNIT[id] || 'sentence'],
  ['segments', (m) => m.segments],
  ['segments / variant', (m) => m.segmentsPerVariant],
  ['terminal-stop share', (m) => m.terminalStopShare],
  ['slot-bearing share', (m) => m.slotBearingShare],
  ['1-segment share', (m) => m.oneSegment],
  ['2-segment share', (m) => m.twoSegments],
  ['3+-segment share', (m) => m.threePlusSegments],
  ['words/segment mean', (m) => m.wps.mean],
  ['words/segment sd', (m) => m.wps.sd],
  ['words/segment p10', (m) => m.wps.p10],
  ['words/segment p50', (m) => m.wps.p50],
  ['words/segment p90', (m) => m.wps.p90],
  ['share segments < 8 words', (m) => m.wps.under8],
  ['share segments > 30 words', (m) => m.wps.over30],
  ['antithesis SHAPE rate', (m) => m.shapesRate.antithesisShape],
  ['"rather than" rate', (m) => m.shapesRate.ratherThan],
  ['gloss tail ", which" rate', (m) => m.shapesRate.glossTail],
  ['2nd-sentence summary rate', (m) => m.shapesRate.secondSentSummary],
  ['triad-list rate', (m) => m.shapesRate.triadList],
  ['doubled-adjective rate', (m) => m.shapesRate.doubledAdj],
  ['participial-opener rate', (m) => m.shapesRate.participialOpener],
  ['"There/It is" opener rate', (m) => m.shapesRate.thereIsOpener],
  ['semicolon rate', (m) => m.shapesRate.semicolon],
  ['colon rate', (m) => m.shapesRate.colon],
  ['question rate', (m) => m.shapesRate.question],
  ['parenthesis rate', (m) => m.shapesRate.parenthesis],
  ['abstract-noun closer rate', (m) => m.shapesRate.abstractCloser],
  ['pronoun closer rate', (m) => m.shapesRate.pronounCloser],
  ['adverbs / segment', (m) => m.shapesRate.adverbsPerSegment],
  ['em dashes (count)', (m) => m.bibleHardRules.emDash],
  ['exclamations (count)', (m) => m.bibleHardRules.exclamation],
  ['emphasis-caps rate', (m) => m.bibleHardRules.emphasisCapsRate],
  ['digits-in-prose rate', (m) => m.bibleHardRules.digitsRate],
  ['contraction rate', (m) => m.bibleHardRules.contractionRate],
  ['"the PCs" (count)', (m) => m.bibleHardRules.thePCs],
  ['AI lexical tells / variant (raw)', (m) => m.tellsRate],
  ['AI tells / variant EXOGENOUS', (m) => m.tellsExogenousRate],
  ['Juzek&Ward forms (count, raw)', (m) => m.juzekTotal],
  ['Juzek&Ward forms EXOGENOUS (count)', (m) => m.juzekExogenous],
  ['rationed pet words / variant', (m) => m.petRate],
  ['pools with 2+ variants', (m) => m.pools.poolsWith2Plus],
  ['mean pool size', (m) => m.pools.meanPoolSize],
  ['pools uniform in segment count', (m) => m.pools.sameSegmentCountShare],
  ['pools w/ repeated 2-word opener', (m) => m.pools.repeatedTwoWordOpenerShare],
  ['mean within-pool word sd', (m) => m.pools.meanWithinPoolWordSd],
];

const cols = ORDER.filter((id) => M[id]).concat(['BIBLE']);
const table = [['metric', ...cols.map((c) => `${c} (n=${M[c].variants})`)]];
for (const [label, f] of ROWS) {
  table.push([label, ...cols.map((c) => { const v = f(M[c], c); return v === null || v === undefined ? '' : String(v); })]);
}

// ── (d) outliers: > 2x (or < 0.5x) the corpus median across the register columns ─
const MEDIAN_COLS = ORDER.filter((id) => M[id] && id !== 'A-W');
const SIZE = new Set(['N variants (deduped)', 'files', 'segments', 'pools with 2+ variants', 'Juzek&Ward forms (count, raw)', 'Juzek&Ward forms EXOGENOUS (count)', 'em dashes (count)', 'exclamations (count)', '"the PCs" (count)']);
const NUMERIC = ROWS.filter(([l]) => l !== 'unit' && !SIZE.has(l));
const outliers = [];
for (const [label, f] of NUMERIC) {
  const vals = MEDIAN_COLS.map((c) => ({ c, v: Number(f(M[c], c)) })).filter((x) => Number.isFinite(x.v));
  if (vals.length < 5) continue;
  const sorted = [...vals].map((x) => x.v).sort((a, b) => a - b);
  const med = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  for (const { c, v } of vals) {
    if (med > 0 && v > 2 * med) outliers.push({ metric: label, register: c, value: v, median: med, ratio: +(v / med).toFixed(2), dir: 'high' });
    else if (med > 0 && v < med / 2) outliers.push({ metric: label, register: c, value: v, median: med, ratio: +(v / med).toFixed(2), dir: 'low' });
    else if (med === 0 && v > 0) outliers.push({ metric: label, register: c, value: v, median: 0, ratio: Infinity, dir: 'high-vs-zero-median' });
  }
}

// ── (c) bible distance ──────────────────────────────────────────────────────
// AXIS A — mechanical compliance with §3's hard rules (the bible's own enforceable line).
const compliance = {};
for (const id of MEDIAN_COLS) {
  const b = M[id].bibleHardRules;
  compliance[id] = {
    emDashRate: b.emDashRate, exclamationRate: b.exclamationRate, emphasisCapsRate: b.emphasisCapsRate,
    digitsRate: b.digitsRate, thePCs: b.thePCs,
    // one number: the summed rate of the four zero-tolerance mechanical breaches
    breachRate: +(b.emDashRate + b.exclamationRate + b.emphasisCapsRate + b.digitsRate).toFixed(4),
  };
}
// AXIS B — style distance to the bible's exemplar fingerprint on comparable rate metrics,
// z-scored against the spread of the register columns themselves.
const STYLE = [
  ['words/segment mean', (m) => m.wps.mean], ['words/segment sd', (m) => m.wps.sd],
  ['share segments < 8 words', (m) => m.wps.under8], ['share segments > 30 words', (m) => m.wps.over30],
  ['segments / variant', (m) => m.segmentsPerVariant],
  ['antithesis SHAPE rate', (m) => m.shapesRate.antithesisShape],
  ['gloss tail rate', (m) => m.shapesRate.glossTail],
  ['2nd-sentence summary rate', (m) => m.shapesRate.secondSentSummary],
  ['semicolon rate', (m) => m.shapesRate.semicolon],
  ['colon rate', (m) => m.shapesRate.colon],
  ['parenthesis rate', (m) => m.shapesRate.parenthesis],
  ['abstract-noun closer rate', (m) => m.shapesRate.abstractCloser],
  ['adverbs / segment', (m) => m.shapesRate.adverbsPerSegment],
  ['participial-opener rate', (m) => m.shapesRate.participialOpener],
  ['triad-list rate', (m) => m.shapesRate.triadList],
  ['rationed pet words / variant', (m) => m.petRate],
  ['AI tells / variant EXOGENOUS', (m) => m.tellsExogenousRate],
];
const styleDist = {};
const perMetricZ = {};
for (const [label, f] of STYLE) {
  const vals = MEDIAN_COLS.map((c) => Number(f(M[c])));
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length) || 1;
  const bz = (Number(f(M.BIBLE)) - mean) / sd;
  perMetricZ[label] = { mean: +mean.toFixed(3), sd: +sd.toFixed(3), bibleZ: +bz.toFixed(2) };
  MEDIAN_COLS.forEach((c, i) => {
    const z = (vals[i] - mean) / sd;
    (styleDist[c] ||= { sum: 0, k: 0, per: {} });
    styleDist[c].per[label] = +(z - bz).toFixed(2);
    styleDist[c].sum += Math.abs(z - bz);
    styleDist[c].k++;
  });
}
const styleRank = MEDIAN_COLS.map((c) => ({ register: c, meanAbsZDistance: +(styleDist[c].sum / styleDist[c].k).toFixed(3), per: styleDist[c].per }))
  .sort((a, b) => a.meanAbsZDistance - b.meanAbsZDistance);
const complianceRank = MEDIAN_COLS.map((c) => ({ register: c, ...compliance[c] })).sort((a, b) => a.breachRate - b.breachRate);
// combined: mean of the two ranks
const rankOf = (arr, c) => arr.findIndex((x) => x.register === c) + 1;
const combined = MEDIAN_COLS.map((c) => ({
  register: c, name: NAMES[c], n: M[c].variants,
  styleRank: rankOf(styleRank, c), complianceRank: rankOf(complianceRank, c),
  styleDistance: styleRank.find((x) => x.register === c).meanAbsZDistance,
  breachRate: compliance[c].breachRate,
  combined: +((rankOf(styleRank, c) + rankOf(complianceRank, c)) / 2).toFixed(1),
})).sort((a, b) => a.combined - b.combined);

const report = { generatedFrom: 'probe-all', names: NAMES, units: UNIT, table, metrics: M, tics, outliers, bible: { perMetricZ, styleRank, complianceRank, combined, exemplarN: bible.exemplar.n, exemplarSources: bible.exemplar.bySource } };
writeFileSync(P + '.json', JSON.stringify(report, null, 1));

// markdown table
const md = [];
md.push('| ' + table[0].join(' | ') + ' |');
md.push('|' + table[0].map(() => '---').join('|') + '|');
for (const r of table.slice(1)) md.push('| ' + r.join(' | ') + ' |');
writeFileSync(P + '.table.md', md.join('\n') + '\n');

console.log('cols:', cols.join(' '));
console.log('outliers:', outliers.length);
console.log('--- most bible-like (combined rank) ---');
for (const c of combined.slice(0, 5)) console.log(' ', c.register.padEnd(4), String(c.n).padStart(5), 'style', String(c.styleDistance).padStart(6), 'breach', String(c.breachRate).padStart(7), 'comb', c.combined, ' ', c.name);
console.log('--- least bible-like ---');
for (const c of combined.slice(-5)) console.log(' ', c.register.padEnd(4), String(c.n).padStart(5), 'style', String(c.styleDistance).padStart(6), 'breach', String(c.breachRate).padStart(7), 'comb', c.combined, ' ', c.name);
