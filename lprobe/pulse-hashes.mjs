#!/usr/bin/env node
/**
 * pulse-hashes.mjs — OUTPUT (g): THE 52-TICK PULSE HASHES, ONE PER PRESET.
 *
 * usage: node --import ./env-shim.mjs pulse-hashes.mjs --tree <TREE> --out <FILE.json>
 *                [--preset <id>] [--settlements 2] [--seed lprobe-pulse] [--dry]
 *
 * ⭐ THE 52 IS MEASURED, NOT ASSUMED — AND THAT IS THE WHOLE POINT OF THE ARM.
 * `52` is the estate's year grain in two independent places: `OBSERVED_YEAR_TICKS = 52`
 * (`scripts/audit/behavioral-observation.mjs:102`) and the realm-scale worker assertion
 * `progressMessages === 52 && lastProgress.ticksDone === 52`
 * (`scripts/audit/realm-scale-certification.mjs:345`). Interior ticks always run at
 * one_week granularity (`advanceInterval.js:379`) and `INTERVAL_WEEKS` carries the table.
 * So this probe drives ONE `interval: 'one_year'` advance and COUNTS the ticks through
 * `onTickObservation`. If the count is not exactly 52 it REFUSES and reports the number it
 * saw. An arm that assumed 52 and hashed 12 ticks would be a false control that looks
 * exactly like a real one.
 *
 * DETERMINISM — the three ambience doors, all shut, all named:
 *   `now`          PINNED. `simulateCampaignWorldInterval` throws in test when `now == null`
 *                  precisely because an unpinned interval forfeits reproducibility.
 *   `advanceEpoch` taken from the tree's OWN `soakAdvanceEpoch` (`scripts/audit/soakRules.mjs`),
 *                  which returns the flag-gated `soak::<seed>::advance:<year>` term for a LIT
 *                  world and `null` for every dark one. Not re-derived here — the estate's
 *                  own rationale for that shape is 40 lines long and lives in that file.
 *   seeds          every settlement seed is `<seed>-<i>`; no `Date`, no `Math.random`.
 *
 * THE FIXTURE. Composed the way `scripts/lib/observed-shape-corpus.mjs:785-830` composes
 * its own — `generateSettlementPipeline` -> saves -> `makeGridPack`/`placeSettlements` ->
 * `buildSpatialDigest` -> `ensureRegionalGraph`. That committed idiom is used rather than a
 * new one so this probe mints no fixture shape of its own. `whole-world-soak.mjs`'s richer
 * `buildFixture` is deliberately NOT imported: that file RUNS A SOAK ON IMPORT.
 *
 * THE RULES come from the REAL birth path, exactly as `birth-fixtures.mjs` takes them —
 * `buildNewCampaign` then `prepareRulesUpdate`. Never `SIMULATION_RULE_PRESETS[id].rules`
 * as the answer.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

const TREE = flag('tree');
const OUT = flag('out');
const ONLY = flag('preset');
const SETTLEMENTS = Math.max(1, Number(flag('settlements', 2)));
const SEED = String(flag('seed', 'lprobe-pulse'));
const DRY = has('dry');

const EXPECTED_TICKS = 52;
const PINNED_NOW = '2026-07-12T00:00:00.000Z';

if (!TREE || !OUT) {
  console.error('usage: node --import ./env-shim.mjs pulse-hashes.mjs --tree <TREE> --out <FILE.json>'
    + ' [--preset <id>] [--settlements N] [--seed S] [--dry]');
  process.exit(2);
}
const tree = resolve(TREE);
const out = resolve(OUT);

if (DRY) {
  console.log(JSON.stringify({
    dry: true,
    tree,
    out,
    preset: ONLY ?? '(every id in SIMULATION_RULE_PRESETS)',
    settlements: SETTLEMENTS,
    seed: SEED,
    pinnedNow: PINNED_NOW,
    expectedTicks: EXPECTED_TICKS,
    drives: "simulateCampaignWorldInterval({ interval: 'one_year', commit: true, autoResolve: true, now: PINNED, advanceEpoch: soakAdvanceEpoch(...) })",
    refusesWhen: `the counted ticks != ${EXPECTED_TICKS}, or the interval returns status 'paused'`,
    writes: [out],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const load = (rel) => import(pathToFileURL(join(tree, rel)).href);

let m;
try {
  const [gen, pulse, region, spatial, fixtures, birth, rules, profile, soak, ws] = await Promise.all([
    load('src/generators/generateSettlementPipeline.js'),
    load('src/domain/worldPulse/advanceInterval.js'),
    load('src/domain/region/index.js'),
    load('src/domain/spatial/index.js'),
    load('tests/fixtures/spatialPackFixtures.js'),
    load('src/store/campaignImportedCreation.js'),
    load('src/domain/worldPulse/simulationRules.js'),
    load('src/domain/worldPulse/simulationProfile.js'),
    load('scripts/audit/soakRules.mjs'),
    load('src/domain/worldPulse/worldState.js'),
  ]);
  m = { gen, pulse, region, spatial, fixtures, birth, rules, profile, soak, ws };
} catch (error) {
  console.error(`pulse-hashes: could not load the real pulse path from ${tree}:\n${error?.stack ?? String(error)}`);
  process.exit(1);
}

const { generateSettlementPipeline } = m.gen;
const { simulateCampaignWorldInterval } = m.pulse;
const { ensureRegionalGraph, ensureWizardNewsFeed } = m.region;
const { buildSpatialDigest } = m.spatial;
const { makeGridPack, placeSettlements } = m.fixtures;
const { buildNewCampaign } = m.birth;
const { SIMULATION_RULE_PRESETS } = m.rules;
const { prepareRulesUpdate } = m.profile;
const { soakAdvanceEpoch } = m.soak;
const { INTERVAL_WEEKS } = m.ws;

// The tree's own week table must agree with the arm's expectation, or the arm is measuring
// a different year than the estate's instruments are. Checked, never assumed.
const tableWeeks = INTERVAL_WEEKS?.one_year;
if (tableWeeks !== EXPECTED_TICKS) {
  console.error(`pulse-hashes: the tree's INTERVAL_WEEKS.one_year is ${tableWeeks}, not ${EXPECTED_TICKS}.`
    + ' The year grain has moved and this arm\'s name would be a lie. REFUSING.');
  process.exit(3);
}

const ids = ONLY ? [ONLY] : Object.keys(SIMULATION_RULE_PRESETS);
if (ONLY && !SIMULATION_RULE_PRESETS[ONLY]) {
  console.error(`pulse-hashes: no preset '${ONLY}'. Known: ${Object.keys(SIMULATION_RULE_PRESETS).join(', ')}`);
  process.exit(2);
}
if (!ids.length) {
  console.error('pulse-hashes: the preset roster is EMPTY — refusing to write a vacuous hash set.');
  process.exit(1);
}

/** The corpus builder's own fixture composition, 1:1. */
function buildFixture() {
  const generated = [];
  for (let i = 0; i < SETTLEMENTS; i += 1) {
    generated.push(generateSettlementPipeline(
      { settType: 'village', tier: 'village', culture: 'germanic' },
      null,
      { seed: `${SEED}-${String(i).padStart(3, '0')}`, customContent: {} },
    ));
  }
  const idsOf = generated.map((_, i) => `lp${String(i).padStart(3, '0')}`);
  const saves = generated.map((settlement, i) => ({
    id: idsOf[i],
    name: `Probe ${i}`,
    phase: 'canon',
    settlement,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  const pack = makeGridPack({ cols: 10, rows: 8 });
  const placed = placeSettlements(pack, idsOf.length);
  const spatialDigest = buildSpatialDigest({
    pack,
    placements: placed.map((p, i) => ({ id: idsOf[i], cellId: p.cellId })),
  });
  const edges = [];
  const channels = [];
  for (let i = 1; i < idsOf.length; i += 1) {
    const relationshipType = i % 3 === 0 ? 'rival' : 'trade_partner';
    edges.push({ id: `edge.${idsOf[0]}.${idsOf[i]}`, from: idsOf[0], to: idsOf[i], relationshipType });
    if (relationshipType === 'trade_partner') {
      channels.push({ from: idsOf[0], to: idsOf[i], type: 'trade_route', status: 'confirmed', strength: 0.6 });
    }
  }
  return { idsOf, saves, spatialDigest, regionalGraph: ensureRegionalGraph({ edges, channels }, { now: PINNED_NOW }) };
}

const rowsOut = [];
const refusals = [];
for (const id of ids) {
  const state = { activeContentEnvironment: null, customContent: {} };
  const born = buildNewCampaign(state, `L-PROBE pulse ${id}`);
  const prepared = prepareRulesUpdate(born.worldState, SIMULATION_RULE_PRESETS[id].rules, born.wizardNews, PINNED_NOW);
  const fixture = buildFixture();
  const campaign = {
    ...born,
    id: `lprobe-${id}`,
    settlementIds: [...fixture.idsOf],
    worldState: {
      ...prepared.nextWorldState,
      rngSeed: `${SEED}::${id}`,
      tick: 1,
      calendar: { elapsedWeeks: 0, year: 1 },
      spatialCanonVersion: 1,
      spatialDigest: fixture.spatialDigest,
      stressors: [],
    },
    regionalGraph: fixture.regionalGraph,
    wizardNews: prepared.nextWizardNews ?? born.wizardNews ?? ensureWizardNewsFeed(undefined, { now: PINNED_NOW }),
  };

  let ticks = 0;
  const advanceEpoch = soakAdvanceEpoch({
    simulationRules: campaign.worldState.simulationRules,
    seed: `${SEED}::${id}`,
    year: 1,
  });
  let result;
  const t0 = Date.now();
  try {
    result = await simulateCampaignWorldInterval({
      campaign,
      saves: fixture.saves,
      interval: 'one_year',
      commit: true,
      now: PINNED_NOW,
      autoResolve: true,
      advanceEpoch,
      onTickObservation: () => { ticks += 1; },
    });
  } catch (error) {
    refusals.push({ presetId: id, why: `the interval THREW: ${error instanceof Error ? error.message : String(error)}` });
    console.error(`  ${id.padEnd(22)} THREW: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }
  const ms = Date.now() - t0;
  if (result?.status === 'paused') {
    refusals.push({ presetId: id, why: "the interval returned status 'paused' under autoResolve:true — orchestrator contract broken" });
  }
  if (ticks !== EXPECTED_TICKS) {
    refusals.push({ presetId: id, observedTicks: ticks, why: `counted ${ticks} ticks, not ${EXPECTED_TICKS} — this is NOT a 52-tick hash` });
  }
  rowsOut.push({
    presetId: id,
    observedTicks: ticks,
    ticksAreFiftyTwo: ticks === EXPECTED_TICKS,
    advanceEpoch,
    epochLit: advanceEpoch !== null,
    status: result?.status ?? null,
    ms,
    resultHash: sha256(result),
    worldStateHash: sha256(result?.worldState ?? null),
    regionalGraphHash: sha256(result?.regionalGraph ?? null),
    wizardNewsHash: sha256(result?.wizardNews ?? null),
    endTick: result?.worldState?.tick ?? null,
    endWeeks: result?.worldState?.calendar?.elapsedWeeks ?? null,
  });
  console.log(`  ${id.padEnd(22)} ticks=${ticks} epoch=${advanceEpoch ? 'lit' : 'dark'}`
    + ` weeks=${result?.worldState?.calendar?.elapsedWeeks} ${ms}ms hash=${sha256(result).slice(0, 12)}`);
}

// DISCRIMINATION, PRINTED EVEN ON A PASS — a collapsed driver that returns one hash for
// every preset passes "nonzero" and proves nothing.
const distinct = new Set(rowsOut.map((r) => r.resultHash)).size;

const payload = {
  instrument: 'lprobe/pulse-hashes.mjs',
  output: '(g) the 52-tick pulse hashes, one per preset',
  tree,
  takenAt: new Date().toISOString(),
  seed: SEED,
  settlements: SETTLEMENTS,
  pinnedNow: PINNED_NOW,
  expectedTicks: EXPECTED_TICKS,
  intervalWeeksOneYear: tableWeeks,
  distinctResultHashes: `${distinct} / ${rowsOut.length}`,
  refusals,
  rows: rowsOut,
};
payload.digest = sha256(rowsOut.map((r) => `${r.presetId}:${r.resultHash}`).join('\n'));

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
const back = JSON.parse(readFileSync(out, 'utf8'));
if (back.digest !== payload.digest) {
  console.error('pulse-hashes: the written file does not read back to its own digest.');
  process.exit(1);
}
console.log(`pulse-hashes OK  presets=${back.rows.length} distinct=${back.distinctResultHashes}`
  + ` refusals=${back.refusals.length} digest=${back.digest.slice(0, 12)} -> ${out}`);
process.exit(back.refusals.length ? 1 : 0);
