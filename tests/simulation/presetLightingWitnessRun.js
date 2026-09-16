/**
 * presetLightingWitnessRun.js — THE SINGLE WRITER of the preset lighting witness
 * measurement (LGT-P14-WITNESS).
 *
 * WHY A HELPER AND NOT THE SUITE. The recorded manifest
 * (tests/fixtures/preset-lighting-witness-golden.json) and the assertions in
 * presetLightingWitness.test.js must be produced by ONE piece of code. A generator
 * that duplicates the suite's composition drifts from it silently, and the first
 * symptom of that drift is a golden re-recorded against a world the suite never
 * ran. So the composition lives here, the suite imports it, and the manifest is
 * re-recorded by hand from this module's own output.
 *
 * ⛔ THIS FILE IS NOT A `*.test.js`. That is deliberate and it is measured: the
 * lighting census walk, the test ratchet's file count and both EP walkers filter on
 * `\.test\.(js|jsx)$`, so a helper moves none of those figures. The suite beside it
 * pays them.
 *
 * WHAT IS MEASURED, AND WHY EACH CHOICE IS THE ONE A CUSTOMER SEES
 *
 *   THE BIRTH. Every world is born through `createNewCampaignWorldState(campaign,
 *   presetId)` — the exact expression `buildNewCampaign` evaluates
 *   (src/store/campaignImportedCreation.js). Never `SIMULATION_RULE_PRESETS[id].rules`:
 *   that object is not what a birth receives (a preset's `rules` names a PROFILE key,
 *   which fires the normalizer's materialize branch, so a resolved birth carries seven
 *   keys the raw default does not). A fixture born any other way measures a world no
 *   customer receives.
 *
 *   THE `__birth_default__` ROW passes NO preset id, so it resolves
 *   `NEW_CAMPAIGN_SIMULATION_PRESET_ID` through `newCampaignSimulationRules()` — it is
 *   the row that moves the day the shipped default is lit, and moves again the day it
 *   is silently re-darkened. It is the whole reason this instrument exists.
 *
 *   THE 52-TICK WINDOW is DRIVEN, not assumed. One `interval: 'one_year'` advance runs
 *   52 interior one-week kernel ticks; the count is observed through
 *   `onTickObservation` and returned so the suite can assert it. An arm that assumed 52
 *   and hashed twelve ticks would be a false control that looks exactly like a real one.
 *   `INTERVAL_WEEKS.one_year` is returned beside it so the estate's own year grain is
 *   asserted rather than trusted.
 *
 *   THE FIXTURE IS HAND-BUILT, NOT GENERATED. Two settlements, written out below. A
 *   fixture composed through `generateSettlementPipeline` would couple this witness to
 *   the generator estate, and every generator-golden move (the prose car moves 525 of
 *   525 rows) would move this manifest too — which is how a witness gets re-recorded
 *   reflexively until it witnesses nothing. This instrument answers one question: does
 *   the world a NEW CAMPAIGN receives still respond to its preset the way it did when
 *   the row was cut? A hand-built realm answers it with no second cause.
 *
 *   DETERMINISM, EVERY DOOR NAMED AND SHUT:
 *     `now`           PINNED. `simulateCampaignWorldInterval` throws in test when it is
 *                     null, precisely because an unpinned interval forfeits reproducibility.
 *     `rngSeed`       the BORN world's own (`world-pulse:<campaign id>`), and the campaign
 *                     id is pinned per row. Not overwritten — the seed a birth mints is
 *                     part of what is being witnessed.
 *     `advanceEpoch`  null while `advanceEpochEnabled` is dark, which is every row today.
 *                     If a preset ever lights it, src/domain/clock.js THROWS on a lit
 *                     world with no threaded epoch, so a pinned per-row nonce is threaded
 *                     instead and `advanceEpochLit` records the transition on the row.
 *     no `Date`, no `Math.random`, no filesystem, no clock.
 *
 * HASHING is `sha256(JSON.stringify(value))`, the estate's idiom. It is BYTE identity,
 * so a key-ORDER change moves a hash without changing meaning. That is the cost of a
 * byte golden and it is accepted here rather than hidden behind a canonicalizer: a
 * moved serialization order is a real change to what a save file contains.
 */
import { createHash } from 'node:crypto';

import { ensureRegionalGraph, ensureWizardNewsFeed } from '../../src/domain/region/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { createNewCampaignWorldState, INTERVAL_WEEKS } from '../../src/domain/worldPulse/worldState.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';

/** The pinned wall clock. Every timestamp in a witnessed world descends from this. */
export const WITNESS_NOW = '2026-04-04T00:00:00.000Z';

/** The interval this witness drives, and the tick count it must observe. */
export const WITNESS_INTERVAL = 'one_year';
export const WITNESS_TICKS = 52;

/** The identity of the row born with NO preset id — the one that reads the birth constant. */
export const BIRTH_DEFAULT_ROW = '__birth_default__';

const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * One settlement of the witnessed realm. Plain data: no generator, no store, no clock.
 *
 * @param {string} id
 * @param {string} name
 * @param {string} terrainType
 * @param {number} population
 * @param {string} tier
 */
function witnessTown(id, name, terrainType, population, tier) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: {
      name,
      tier,
      population,
      config: { tradeRouteAccess: 'road', terrainType },
      institutions: [
        { name: 'Granary', status: 'active' },
        { name: 'Garrison', status: 'active' },
      ],
      economicState: {
        primaryExports: ['Grain'],
        primaryImports: ['Iron'],
        foodSecurity: {
          dailyNeed: population * 2,
          dailyProduction: population * 2,
          surplusPct: 6,
          deficitPct: 0,
          storageMonths: 1.4,
          importDependency: 0.12,
          resilienceScore: 55,
        },
      },
      powerStructure: {
        publicLegitimacy: { score: 54, label: 'Accepted' },
        factions: [
          { id: `${id}.f1`, name: 'The Guild', category: 'economic', influence: 40 },
          { id: `${id}.f2`, name: 'The Watch', category: 'martial', influence: 30 },
        ],
        conflicts: [],
      },
      npcs: [
        { id: `${id}.n1`, name: 'Aldra', role: 'reeve', plotHooks: [] },
        { id: `${id}.n2`, name: 'Bern', role: 'merchant', plotHooks: [] },
      ],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

/** The two-settlement realm, rebuilt per row so no row inherits another's mutations. */
function witnessRealm() {
  return [
    witnessTown('harrowfen', 'Harrowfen', 'plains', 1800, 'town'),
    witnessTown('stonereach', 'Stonereach', 'mountain', 900, 'village'),
  ];
}

/**
 * The roster this witness covers: the birth-default row first, then every live preset.
 * Read from the registry at runtime — a preset added or retired changes this list, and
 * the suite asserts the manifest's roster against it so coverage can never silently lapse.
 *
 * @returns {string[]}
 */
export function witnessRoster() {
  return [BIRTH_DEFAULT_ROW, ...Object.keys(SIMULATION_RULE_PRESETS)];
}

/**
 * Measure one row: birth the world, drive one year, hash what came out.
 *
 * @param {string} rowId a preset id, or BIRTH_DEFAULT_ROW for the birth-constant row.
 */
export async function measureWitnessRow(rowId) {
  const isDefaultRow = rowId === BIRTH_DEFAULT_ROW;
  const campaignId = `preset-lighting-witness-${rowId}`;
  const saves = witnessRealm();
  // The REAL birth. The default row passes no id and therefore resolves
  // NEW_CAMPAIGN_SIMULATION_PRESET_ID; every other row forces its own preset.
  const worldState = isDefaultRow
    ? createNewCampaignWorldState({ id: campaignId, name: 'Preset Lighting Witness' })
    : createNewCampaignWorldState({ id: campaignId, name: 'Preset Lighting Witness' }, rowId);
  const rules = worldState.simulationRules;
  const advanceEpochLit = rules?.advanceEpochEnabled === true;
  const campaign = {
    id: campaignId,
    name: 'Preset Lighting Witness',
    settlementIds: saves.map((save) => save.id),
    worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [{
        id: 'edge.harrowfen.stonereach',
        from: 'harrowfen',
        to: 'stonereach',
        relationshipType: 'trade_partner',
      }],
    }, { now: WITNESS_NOW }),
    wizardNews: ensureWizardNewsFeed(undefined, { now: WITNESS_NOW }),
  };

  let observedTicks = 0;
  const result = await simulateCampaignWorldInterval({
    campaign,
    saves,
    interval: WITNESS_INTERVAL,
    commit: true,
    now: WITNESS_NOW,
    autoResolve: true,
    advanceEpoch: advanceEpochLit ? `preset-lighting-witness::${rowId}::advance:1` : null,
    onTickObservation: () => { observedTicks += 1; },
  });

  return {
    row: rowId,
    resolvesBirthConstant: isDefaultRow,
    ruleKeyCount: Object.keys(rules).length,
    litFlagCount: Object.values(rules).filter((value) => value === true).length,
    darkFlagCount: Object.values(rules).filter((value) => value === false).length,
    advanceEpochLit,
    rulesSha256: sha256(rules),
    bornWorldSha256: sha256(worldState),
    observedTicks,
    status: result?.status ?? null,
    worldStateSha256: sha256(result?.worldState ?? null),
    wizardNewsSha256: sha256(result?.wizardNews ?? null),
    settlementUpdatesSha256: sha256(result?.settlementUpdates ?? null),
    regionalGraphSha256: sha256(result?.regionalGraph ?? null),
  };
}

/**
 * Measure every row in roster order. Sequential on purpose: the rows share no state,
 * but a parallel drive would interleave nothing useful and would make a failure's
 * ordering unreadable.
 *
 * @returns {Promise<Array<Awaited<ReturnType<typeof measureWitnessRow>>>>}
 */
export async function measureWitness() {
  const rows = [];
  for (const rowId of witnessRoster()) {
    rows.push(await measureWitnessRow(rowId));
  }
  return rows;
}

/** The estate's own year grain, so the suite asserts the window rather than trusting it. */
export function yearGrainWeeks() {
  return INTERVAL_WEEKS?.one_year ?? null;
}
