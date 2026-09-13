/**
 * SEAM car 3h — THE A/B KEY-IDENTITY HARNESS (lane instrument, never committed).
 *
 * Snapshots, for every town of the RATE corpus (768) and every row of the DRIFT corpus
 * (525 configurations x 2 audiences = 1,050):
 *   - the five DS-DEF-2 key-function INPUTS, derived exactly as `defenseThreatProse` derives
 *     them (the same `standingDefenseForces` projection and the same `civicFlag` strictness);
 *   - the five KEYS the desk returns;
 *   - a digest of the WHOLE `defenseThreatProse` return, which is the stronger claim.
 *
 * Plus an EXHAUSTIVE sweep of the five key functions' own input domains, which is a total
 * proof the corpora can only sample.
 *
 *   node seam3h-keyab.mjs <out.json>
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const LANE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM';

const { rateGrid } = await import(`${LANE}/scripts/prose-rate-corpus.mjs`);
const { generateSettlementPipeline } = await import(`${LANE}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus, keyOf } = await import(`${LANE}/tests/helpers/goldenMasterCorpus.js`);
const { standingDefenseForces } = await import(`${LANE}/src/domain/institutions/defenseInstitutionBuckets.js`);
const desk = await import(`${LANE}/src/domain/display/stateProse/defenseStateProse.js`);

const sha = (t) => createHash('sha256').update(String(t)).digest('hex');
/** `civicFlag`, module-private in the desk: a GENUINE boolean, never coerced. */
const civic = (v) => v === true;

/** The five keys, derived the way `defenseThreatProse` derives them. */
function keysOf(s) {
  const dp = s?.defenseProfile || {};
  const compound = s?.economicState?.compound?.inst || {};
  const forces = standingDefenseForces(s);
  const walls = forces.walls.present;
  const garrison = forces.garrison.present;
  const militia = forces.militia.present;
  return {
    inputs: [
      String(s?.config?.monsterThreat), walls, garrison, militia,
      civic(compound.hasCourtSystem), civic(compound.hasPrison),
      typeof dp.scores?.economic === 'number' ? dp.scores.economic : null,
      civic(compound.hasGranary), civic(compound.hasHospital), civic(compound.hasChurch),
    ],
    keys: [
      desk.beastsRowPoolKey(s?.config?.monsterThreat, walls, garrison || militia),
      desk.invasionRowPoolKey(walls, garrison, militia),
      desk.internalRowPoolKey(civic(compound.hasCourtSystem), civic(compound.hasPrison)),
      desk.economicRowPoolKey(dp.scores?.economic),
      desk.disasterRowPoolKey(civic(compound.hasGranary), civic(compound.hasHospital), civic(compound.hasChurch)),
    ],
  };
}

// ── THE EXHAUSTIVE DOMAIN SWEEP ─────────────────────────────────────────────────────
const THREATS = ['heartland', 'frontier', 'plagued', 'civilized', 'random_threat', 'Heartland',
  ' frontier ', 'low', 'nonsense', '', null, undefined, 0, false, true, 42];
const FLAGS = [true, false, 0, 1, '', 'x', null, undefined, NaN, [], {}];
const SCORES = [-1e9, -1, -0.5, 0, 19, 19.9, 20, 39, 39.9, 40, 64, 64.9, 65, 99, 100, 1e9,
  NaN, Infinity, -Infinity, '50', null, undefined, true, {}];

function exhaustive() {
  const rows = [];
  for (const t of THREATS) for (const p of FLAGS) for (const f of FLAGS) {
    rows.push(`beasts|${String(t)}|${String(p)}|${String(f)}|${desk.beastsRowPoolKey(t, p, f)}`);
  }
  for (const a of FLAGS) for (const b of FLAGS) for (const c of FLAGS) {
    rows.push(`invasion|${String(a)}|${String(b)}|${String(c)}|${desk.invasionRowPoolKey(a, b, c)}`);
    rows.push(`disaster|${String(a)}|${String(b)}|${String(c)}|${desk.disasterRowPoolKey(a, b, c)}`);
  }
  for (const a of FLAGS) for (const b of FLAGS) {
    rows.push(`internal|${String(a)}|${String(b)}|${desk.internalRowPoolKey(a, b)}`);
  }
  for (const n of SCORES) rows.push(`economic|${String(n)}|${desk.economicRowPoolKey(n)}`);
  return rows;
}

// ── THE TWO CORPORA ─────────────────────────────────────────────────────────────────
function rateRows() {
  const out = [];
  let threw = 0;
  for (const spec of rateGrid()) {
    let s;
    try { s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { threw += 1; continue; }
    const seed = String(s._seed ?? s.id ?? spec.seed);
    const { inputs, keys } = keysOf(s);
    out.push([`rate-${spec.cell}-${spec.seedIndex}`, inputs.map(String).join('|'), keys.map(String).join('|'),
      sha(JSON.stringify(desk.defenseThreatProse(s, { seed, audience: 'dm' })))]);
  }
  return { rows: out, threw };
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
        sha(JSON.stringify(desk.defenseThreatProse(s, { seed, audience })))]);
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
