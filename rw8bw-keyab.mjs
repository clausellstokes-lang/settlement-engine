/**
 * REWRITE car 8b-W — THE A/B KEY-IDENTITY HARNESS (lane instrument, never committed).
 *
 * The SEAM car 3h harness, re-aimed at the FIVE key functions this car tables:
 *   DS-DEF-1  posturePoolKey(readinessScore)
 *   DS-DEF-3  publicOrderPoolKey(safetyLabel) · firstSurveyPoolKey(safetyLabel)
 *   DS-DEF-4  criminalCapturePoolKey(captureState)
 *   DS-DEF-6  supplyLogisticsPoolKey(granary, port, tradeAccess)
 *
 * Snapshots, for every town of the RATE corpus (768) and every row of the DRIFT corpus
 * (525 configurations x 2 audiences = 1,050): the key functions' INPUTS as the four desk
 * entry points derive them, the KEYS returned, and a digest of the WHOLE return of each of
 * the four desk entry points. Plus an EXHAUSTIVE sweep of the five functions' own input
 * domains, which is a total proof the corpora can only sample.
 *
 *   node rw8bw-keyab.mjs <out.json>
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const LANE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW';

const { rateGrid } = await import(`${LANE}/scripts/prose-rate-corpus.mjs`);
const { generateSettlementPipeline } = await import(`${LANE}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus, keyOf } = await import(`${LANE}/tests/helpers/goldenMasterCorpus.js`);
const desk = await import(`${LANE}/src/domain/display/stateProse/defenseStateProse.js`);

const sha = (t) => createHash('sha256').update(String(t)).digest('hex');
/** `civicFlag`, module-private in the desk: a GENUINE boolean, never coerced. */
const civic = (v) => v === true;

/** The five keys, derived the way the four desk entry points derive them. */
function keysOf(s) {
  const compound = s?.economicState?.compound?.inst || {};
  const label = s?.economicState?.safetyProfile?.safetyLabel;
  const readiness = s?.defenseProfile?.readiness?.score;
  const capture = s?.powerStructure?.criminalCaptureState;
  const access = s?.config?.tradeRouteAccess;
  return {
    inputs: [
      typeof readiness === 'number' ? readiness : String(readiness),
      String(label), String(capture), String(access),
      civic(compound.hasGranary), civic(compound.hasPort),
    ],
    keys: [
      desk.posturePoolKey(readiness),
      desk.publicOrderPoolKey(label),
      desk.firstSurveyPoolKey(label),
      desk.criminalCapturePoolKey(capture),
      desk.supplyLogisticsPoolKey(civic(compound.hasGranary), civic(compound.hasPort), access),
    ],
  };
}

/** A digest of the four desk entry points this car touches, at one audience. */
function deskDigest(s, options) {
  return sha(JSON.stringify([
    desk.defensePostureProse(s, options),
    desk.defenseStateProse(s, options),
    desk.defenseCriminalProse(s, null, options),
    desk.defenseCriminalProse(s, 'organized', options),
    desk.defenseSupportingProse(s, options),
  ]));
}

// ── THE EXHAUSTIVE DOMAIN SWEEP ─────────────────────────────────────────────────────
const SCORES = [-1e9, -1, -0.5, 0, 19, 19.9, 20, 39, 39.9, 40, 64, 64.9, 65, 99, 100, 1e9,
  NaN, Infinity, -Infinity, '50', null, undefined, true, {}];
/**
 * Every safety label the producer writes, every corpus POOL KEY of DS-DEF-3 (the inputs a
 * corpus-roster guard behaves differently on), and junk.
 */
const LABELS = [
  'Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Dangerous',
  'Controlled — Authoritarian', 'Dangerous — Criminal Governance',
  'Tense — Active Siege', 'Desperate — Famine Conditions',
  'Controlled — Occupation Curfew + Famine Conditions',
  'Strained – Plague', // an EN dash: the compound detector reads both
  'COMPOUND override (a crisis stress has rewritten the label)',
  'First-Survey qualification (the reading is a first look)',
  ' Very Safe ', 'very safe', 'VERY SAFE', 'Saf', 'Safest', '', '   ',
  null, undefined, 0, false, true, 42, [], {}, ['Safe'],
];
const CAPTURES = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture',
  'capture capture', 'None', ' none ', 'nonsense', '', null, undefined, 0, false, true, 42, [], {}];
const ACCESS = ['road', 'port', 'isolated', 'Port', ' port ', 'river', '', null, undefined,
  0, false, true, 42, [], {}];
const FLAGS = [true, false, 0, 1, '', 'x', null, undefined, NaN, [], {}];

function exhaustive() {
  const rows = [];
  for (const n of SCORES) rows.push(`posture|${String(n)}|${desk.posturePoolKey(n)}`);
  for (const l of LABELS) {
    rows.push(`publicOrder|${String(l)}|${desk.publicOrderPoolKey(l)}`);
    rows.push(`firstSurvey|${String(l)}|${desk.firstSurveyPoolKey(l)}`);
  }
  for (const c of CAPTURES) rows.push(`capture|${String(c)}|${desk.criminalCapturePoolKey(c)}`);
  for (const g of FLAGS) {
    for (const p of FLAGS) {
      for (const a of ACCESS) {
        rows.push(`supply|${String(g)}|${String(p)}|${String(a)}|${desk.supplyLogisticsPoolKey(g, p, a)}`);
      }
    }
  }
  return rows;
}

// ── THE TWO CORPORA ─────────────────────────────────────────────────────────────────
function rateRows() {
  const out = [];
  const labels = new Map();
  let threw = 0;
  for (const spec of rateGrid()) {
    let s;
    try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { threw += 1; continue; }
    const seed = String(s._seed ?? s.id ?? spec.seed);
    const { inputs, keys } = keysOf(s);
    const label = String(s?.economicState?.safetyProfile?.safetyLabel);
    labels.set(label, (labels.get(label) || 0) + 1);
    out.push([`rate-${spec.cell}-${spec.seedIndex}`, inputs.map(String).join('|'), keys.map(String).join('|'),
      deskDigest(s, { seed, audience: 'dm' })]);
  }
  return { rows: out, threw, labels: [...labels].sort((a, b) => b[1] - a[1]) };
}

function driftRows() {
  const out = [];
  let threw = 0;
  for (const config of goldenCorpus()) {
    const { _seed: seedIn, ...cfg } = config;
    let s;
    try { s = generateSettlementPipeline(cfg, null, { seed: seedIn, customContent: {} }); } catch { threw += 1; continue; }
    const seed = String(s._seed ?? s.id ?? seedIn);
    const { inputs, keys } = keysOf(s);
    for (const audience of ['dm', 'player']) {
      out.push([`${keyOf(config)}::${audience}`, inputs.map(String).join('|'), keys.map(String).join('|'),
        deskDigest(s, { seed, audience })]);
    }
  }
  return { rows: out, threw };
}

const started = Date.now();
const ex = exhaustive();
const rate = rateRows();
const drift = driftRows();
const payload = {
  exhaustive: ex,
  exhaustiveRows: ex.length,
  rate: rate.rows,
  rateTowns: rate.rows.length,
  rateThrew: rate.threw,
  rateLabels: rate.labels,
  drift: drift.rows,
  driftRows: drift.rows.length,
  driftThrew: drift.threw,
  seconds: Math.round((Date.now() - started) / 1000),
};
writeFileSync(process.argv[2], `${JSON.stringify(payload, null, 1)}\n`);
console.log(`[key-ab] exhaustive ${ex.length} · RATE towns ${rate.rows.length} (threw ${rate.threw})`
  + ` · DRIFT rows ${drift.rows.length} (threw ${drift.threw}) · ${payload.seconds}s`);
console.log(`[key-ab] exhaustive sha ${sha(ex.join('\n')).slice(0, 16)}`);
console.log(`[key-ab] RATE keys sha ${sha(rate.rows.map((r) => `${r[0]}|${r[2]}`).join('\n')).slice(0, 16)}`);
console.log(`[key-ab] DRIFT keys sha ${sha(drift.rows.map((r) => `${r[0]}|${r[2]}`).join('\n')).slice(0, 16)}`);
console.log(`[key-ab] RATE desk-output sha ${sha(rate.rows.map((r) => `${r[0]}|${r[3]}`).join('\n')).slice(0, 16)}`);
console.log(`[key-ab] DRIFT desk-output sha ${sha(drift.rows.map((r) => `${r[0]}|${r[3]}`).join('\n')).slice(0, 16)}`);
console.log(`[key-ab] RATE distinct safetyLabels ${rate.labels.length}: ${rate.labels.slice(0, 12).map(([l, n]) => `${l}(${n})`).join(' · ')}`);
