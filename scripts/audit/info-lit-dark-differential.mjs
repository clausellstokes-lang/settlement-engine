/**
 * info-lit-dark-differential.mjs — THE LIT/DARK DIFFERENTIAL INSTRUMENT (FP IN-6 U4;
 * DESIGN_FP_INFORMATION.md §5 IN-6 "The lit/dark differential instrument"; DESIGN_FP_ARCH_IN.md
 * S20; the certification row that asks for it by name, subsystemRowsRegen.js
 * distancePricedNewsEnabled: "What would close the gap is a PAIRED run ... two soaks on one seed,
 * one with the flag lit and one dark").
 *
 * WHAT IT ANSWERS. For one rule key at a time: the same seed, the same composed realm, advanced
 * twice by the reader corpus's own yearly loop, once with the key DARK (absent) and once LIT
 * (strictly true). Which receipts differ, by kind; in which year the worlds first part; how the
 * belief-divergence series moves; and, when the twins never part, WHICH ARM holds the key dark.
 * Dormancy bytes prove deadness; this proves life, or names what is withholding it.
 *
 * THE TWINS ARE EARNED, NOT ASSUMED. Each twin is composed by its own composeReaderRegion call, and
 * the instrument records the tick-0 composite of both with the key itself set aside: identical, or
 * the run says so and every later difference is void. A difference after tick 0 is therefore the
 * key's, because nothing else differs.
 *
 * THE ARM TABLE QUOTES LIT-2 (findings/LIT-2-REPORT.md, the FP kit, 2026-09-24) and EXECUTES it:
 * every arm carries a predicate read off the lit twin's world, so a stale quotation cannot stand.
 * An arm that claims to hold a key dark while the twins part is reported ARM_TABLE_REFUTED.
 *
 * VERDICTS (one per key):
 *   ALIVE              the twins part: the receipts that differ are listed by kind.
 *   HELD_DARK          the twins never part and at least one arm holds the key (named).
 *   LIT_QUIET          the twins never part and no arm holds it: the key could act, the world did
 *                      not give it an occasion in the window.
 *   TWINS_NOT_IDENTICAL the tick-0 composites differ: no difference is attributable to the key.
 *   ARM_TABLE_REFUTED  the twins part although an arm claims to hold the key: the table is stale.
 *
 * IT WRITES A FILE, NEVER THE CONSOLE (`--out` is required). Pure reader of the engine: no src
 * byte, no clock, no randomness of its own (the engine's streams are seeded by the row).
 *
 * USAGE: node scripts/audit/info-lit-dark-differential.mjs --out <file.json>
 *          [--row rr-fresh-dramatic] [--years 20] [--keys k1,k2] [--release k3,k4]
 *   --release lights extra keys in BOTH twins (the control that opens a holding arm, LIT-2's
 *   "forced the statecraft head on with two non-FP keys").
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

import { READER_CORPUS_ROSTER, advanceReaderCampaign, composeReaderRegion } from '../review/readerCorpus.mjs';
import { observeBeliefDivergence } from './behavioral-observation.mjs';
import { compareStoryMixDistributions } from './story-mix-divergence.mjs';
import { beliefsActive } from '../../src/domain/worldPulse/beliefMap.js';
import { infoStatecraftActive } from '../../src/domain/worldPulse/informationStatecraft.js';
import { readRouteNetwork, routeLifecycleActive } from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';

export const INFO_LIT_DARK_INSTRUMENT = 'info_lit_dark_differential_v1';

/** The information program's four flags (DESIGN_FP_ARCH_IN.md §2), codepoint-sorted. */
export const INFO_FLAG_KEYS = Object.freeze([
  'counterIntelEnabled',
  'infoLureEnabled',
  'reputationRaceEnabled',
  'secondOrderBeliefEnabled',
]);

/** The default realm: the reader corpus's dramatic row, where LIT-2 measured the head held dark. */
export const DEFAULT_ROW_ID = 'rr-fresh-dramatic';
export const DEFAULT_YEARS = 20;

export const INFO_LIT_DARK_VERDICTS = Object.freeze([
  'ALIVE',
  'ARM_TABLE_REFUTED',
  'HELD_DARK',
  'LIT_QUIET',
  'TWINS_NOT_IDENTICAL',
]);

/** @param {unknown} ws @returns {boolean} the belief gate's two halves hold */
const beliefsLive = (ws) => beliefsActive(/** @type {any} */ (ws));

/** The belief gate, shared by the lure and the counter-game. */
const BELIEF_GATE_ARM = Object.freeze({
  arm: 'beliefMap.js :: beliefsActive',
  holder: 'a spatialCanonVersion marker AND an infoMode other than omniscient',
  holds: (/** @type {unknown} */ ws) => !beliefsLive(ws),
  lit2: 'byte-identical to dark in realistic_regional (infoMode omniscient), among the presets LIT-2 ran',
});

/** The statecraft head, which carries the lure's and the counter-game's seams. */
const STATECRAFT_HEAD_ARM = Object.freeze({
  arm: 'pulseKernel.js :: simulateCampaignWorldPulse behind informationStatecraft.js :: infoStatecraftActive',
  holder: 'infoStatecraftEnabled (not an FP key; lit in no preset)',
  holds: (/** @type {unknown} */ ws) => !infoStatecraftActive(/** @type {any} */ (ws)),
  lit2: 'the statecraft head, pulseKernel.js :: simulateCampaignWorldPulse behind informationStatecraft.js :: infoStatecraftActive (infoStatecraftEnabled, not FP\'s, lit nowhere)',
});

/**
 * THE ARM TABLE: key to the arms that can hold it dark, each EXECUTED against the lit twin's world.
 * `notes` quote LIT-2's table where its text names a seam with no caller (not a holding arm: the
 * key still acts through its other seams once the head is open).
 * @type {Readonly<Record<string, ReadonlyArray<{ arm: string, holder: string, holds: (ws: unknown) => boolean, lit2: string }>>>}
 */
export const INFO_FLAG_HOLDING_ARMS = Object.freeze({
  counterIntelEnabled: Object.freeze([BELIEF_GATE_ARM, STATECRAFT_HEAD_ARM]),
  infoLureEnabled: Object.freeze([BELIEF_GATE_ARM, STATECRAFT_HEAD_ARM]),
  reputationRaceEnabled: Object.freeze([
    Object.freeze({
      arm: 'routeNetworkConsumersRace.js :: storyArrivalTicks behind routeNetworkLedger.js :: routeLifecycleActive',
      holder: 'routeLifecycleEnabled (the owner\'s key; dark in every preset)',
      holds: (/** @type {unknown} */ ws) => !routeLifecycleActive(/** @type {any} */ (ws)),
      lit2: 'routeNetworkConsumersRace.js :: storyArrivalTicks answers arrives:false unless routeNetworkLedger.js :: routeLifecycleActive holds (the owner\'s key, dark everywhere)',
    }),
    Object.freeze({
      arm: 'routeNetworkGenesis.js :: ensureGenesisRouteNetwork (no caller; FPQ-44)',
      holder: 'no route network on the world',
      holds: (/** @type {unknown} */ ws) => !readRouteNetwork(/** @type {any} */ (ws)),
      lit2: 'routeNetworkGenesis.js :: ensureGenesisRouteNetwork has no caller ... the story reached 0 of 12 pairs',
    }),
  ]),
  secondOrderBeliefEnabled: Object.freeze([
    Object.freeze({
      arm: 'secondOrderBelief.js :: secondOrderBeliefActive, read only by display/neighbourMirror.js (a render-time read model)',
      holder: 'no pulse stage reads the key: the mirror writes nothing, so no receipt can differ',
      holds: () => true,
      lit2: 'not in LIT-2 (the mirror is IN-1\'s, outside that unit\'s five keys); measured at IN-6 U4',
    }),
  ]),
});

/** @type {Readonly<Record<string, ReadonlyArray<string>>>} LIT-2's no-caller seams, quoted. */
export const INFO_FLAG_LIT2_NOTES = Object.freeze({
  counterIntelEnabled: Object.freeze([
    'the same head carries both seams (suspicion.js :: secrecyInAnswer, claimDoubtOf)',
    'counterIntelSweep.js :: resolveSweep has no caller (U123)',
    'WatchPanel.jsx and HousesBlock.jsx are unmounted',
  ]),
  infoLureEnabled: Object.freeze(['infoLure.js :: lureCommission has no caller']),
  reputationRaceEnabled: Object.freeze([
    'reputationRaceConsumer.js :: reputationRaceEntries skips any arrival whose story does not arrive, so the person and together legs never speak alone (J-INF-5)',
  ]),
  secondOrderBeliefEnabled: Object.freeze([]),
});

const sha256 = (/** @type {string} */ text) => createHash('sha256').update(text).digest('hex');

/** @param {Record<string, unknown>} rules @param {string} key */
function withoutKey(rules, key) {
  const next = { ...rules };
  delete next[key];
  return next;
}

/**
 * The composite the corpus hashes (worldState, regionalGraph, settlements; that key order), with the
 * measured key set aside from the rules, so two worlds that differ ONLY in the key hash equal. The
 * corpus's own capture hash keeps the rules whole, so it parts on the key itself and cannot serve.
 * @param {{ worldState: any, regionalGraph: unknown, saves: ReadonlyArray<any> }} world @param {string} key
 */
export function partHash({ worldState, regionalGraph, saves }, key) {
  const ws = { ...worldState, simulationRules: withoutKey(worldState?.simulationRules || {}, key) };
  return sha256(JSON.stringify({ worldState: ws, regionalGraph, settlements: saves.map((s) => s.settlement) }));
}

/** The tick-0 composite of a composed twin, the key set aside. @param {{ campaign: any, saves: any[] }} twin @param {string} key */
export function tickZeroHash(twin, key) {
  return partHash({ worldState: twin.campaign.worldState, regionalGraph: twin.campaign.regionalGraph, saves: twin.saves }, key);
}

/**
 * Compose one twin: the row's realm, the key DARK (deleted) or LIT (strictly true), the released
 * keys lit in both. Each call composes from scratch, so the tick-0 identity is a measurement.
 * @param {{ row: any, key: string, lit: boolean, release?: ReadonlyArray<string> }} input
 */
export function composeTwin({ row, key, lit, release = [] }) {
  const { campaign, saves } = composeReaderRegion(row);
  const presetRules = campaign.worldState.simulationRules || {};
  /** @type {Record<string, unknown>} */
  const rules = withoutKey(presetRules, key);
  for (const extra of release) rules[extra] = true;
  if (lit) rules[key] = true;
  return {
    campaign: { ...campaign, worldState: { ...campaign.worldState, simulationRules: rules } },
    saves,
    presetHadKey: Object.prototype.hasOwnProperty.call(presetRules, key),
  };
}

/** The receipt kind a news entry carries: its impact kind when it has one, else its kind. */
export function receiptKindOf(/** @type {any} */ entry) {
  if (typeof entry?.impactKind === 'string' && entry.impactKind) return entry.impactKind;
  return typeof entry?.kind === 'string' && entry.kind ? entry.kind : 'unknown';
}

/** @param {ReadonlyArray<any>} yearly @returns {Map<string, number>} */
function newsKindCounts(yearly) {
  const counts = new Map();
  for (const year of yearly) {
    for (const entry of Array.isArray(year?.rawWizardNewsEntries) ? year.rawWizardNewsEntries : []) {
      const kind = receiptKindOf(entry);
      counts.set(kind, (counts.get(kind) || 0) + 1);
    }
  }
  return counts;
}

/**
 * THE RECEIPTS THAT DIFFER, BY KIND: every kind whose count differs between the twins, codepoint
 * order, with both counts. Two identical feeds answer [].
 * @param {ReadonlyArray<any>} darkYearly @param {ReadonlyArray<any>} litYearly
 * @returns {Array<{ kind: string, dark: number, lit: number }>}
 */
export function newsByKindDiff(darkYearly, litYearly) {
  const dark = newsKindCounts(darkYearly);
  const lit = newsKindCounts(litYearly);
  return [...new Set([...dark.keys(), ...lit.keys()])]
    .sort(compareCodepoint)
    .map((kind) => ({ kind, dark: dark.get(kind) || 0, lit: lit.get(kind) || 0 }))
    .filter((row) => row.dark !== row.lit);
}

/**
 * The arms that hold `key` dark on this world, named (empty when none holds). A key with no table
 * row answers [] (the instrument then grades it ALIVE or LIT_QUIET on the receipts alone).
 * @param {string} key @param {unknown} worldState
 * @returns {Array<{ arm: string, holder: string, lit2: string }>}
 */
export function heldDarkBy(key, worldState) {
  return (INFO_FLAG_HOLDING_ARMS[key] || [])
    .filter((row) => row.holds(worldState))
    .map(({ arm, holder, lit2 }) => ({ arm, holder, lit2 }));
}

/**
 * @param {{ tickZeroIdentical: boolean, differs: boolean, heldBy: ReadonlyArray<unknown> }} input
 * @returns {string}
 */
export function verdictOf({ tickZeroIdentical, differs, heldBy }) {
  if (!tickZeroIdentical) return 'TWINS_NOT_IDENTICAL';
  if (differs) return heldBy.length ? 'ARM_TABLE_REFUTED' : 'ALIVE';
  return heldBy.length ? 'HELD_DARK' : 'LIT_QUIET';
}

/**
 * Advance one twin by the corpus's own yearly loop, keeping per year the world hash (the key set
 * aside), the receipts and the belief-divergence reading (observeBeliefDivergence over the live
 * year end the corpus hands its onYear hook).
 * @param {{ campaign: any, saves: any[] }} twin @param {{ years: number, seed: string, key: string }} options
 */
export async function advanceTwin(twin, { years, seed, key }) {
  /** @type {Array<{ year: number, worldHash: string, divergence01: number | null }>} */
  const series = [];
  const out = await advanceReaderCampaign({
    campaign: twin.campaign,
    saves: twin.saves,
    years,
    seed,
    onYear: (/** @type {any} */ capture, /** @type {any} */ live) => {
      if (!live) throw new Error('info-lit-dark: the reader corpus did not hand onYear its live year end');
      const divergence = observeBeliefDivergence({
        result: { worldState: live.worldState, regionalGraph: live.regionalGraph },
        afterSaves: live.saves,
      });
      series.push({ year: capture.year, worldHash: partHash(live, key), divergence01: divergence.divergence01 });
    },
  });
  return { yearly: out.yearly, series };
}

/**
 * Measure one key on one row: the twins, their tick-0 identity, the differential and the verdict.
 * `darkCache` lets a multi-key run advance one dark realm once per distinct dark rule set.
 * @param {{ row: any, key: string, years: number, release?: ReadonlyArray<string>, darkCache?: Map<string, any> }} input
 */
export async function measureKey({ row, key, years, release = [], darkCache = new Map() }) {
  const dark = composeTwin({ row, key, lit: false, release });
  const lit = composeTwin({ row, key, lit: true, release });
  const darkHash = tickZeroHash(dark, key);
  const litHash = tickZeroHash(lit, key);
  const seed = String(row.seed);
  // The dark realm carries no measured key, so its key-aside hash is the same for every key whose
  // dark rules match: one dark advance serves them all (the cache is keyed by those rules).
  const darkKey = sha256(JSON.stringify(dark.campaign.worldState.simulationRules));
  if (!darkCache.has(darkKey)) darkCache.set(darkKey, await advanceTwin(dark, { years, seed, key }));
  const darkRun = darkCache.get(darkKey);
  const litRun = await advanceTwin(lit, { years, seed, key });
  const partedYears = litRun.series.filter((y, i) => y.worldHash !== darkRun.series[i]?.worldHash).map((y) => y.year);
  const newsByKind = newsByKindDiff(darkRun.yearly, litRun.yearly);
  const differs = partedYears.length > 0 || newsByKind.length > 0;
  const heldBy = heldDarkBy(key, lit.campaign.worldState);
  const mix = compareStoryMixDistributions(darkRun.yearly, litRun.yearly);
  return {
    key,
    presetHadKey: dark.presetHadKey,
    tickZero: { identical: darkHash === litHash, darkHash, litHash },
    verdict: verdictOf({ tickZeroIdentical: darkHash === litHash, differs, heldBy }),
    heldDarkBy: heldBy,
    lit2Notes: INFO_FLAG_LIT2_NOTES[key] || [],
    firstPartedYear: partedYears.length ? partedYears[0] : null,
    yearsParted: partedYears.length,
    newsTotals: {
      dark: darkRun.yearly.reduce((n, y) => n + (y.rawWizardNewsEntries?.length || 0), 0),
      lit: litRun.yearly.reduce((n, y) => n + (y.rawWizardNewsEntries?.length || 0), 0),
    },
    newsByKind,
    storyMix: {
      totalVariationDistance: mix.totalVariationDistance,
      shiftedEventEquivalents: mix.shiftedEventEquivalents,
      executable: mix.executable,
    },
    divergenceSeries: litRun.series.map((y, i) => ({
      year: y.year,
      dark: darkRun.series[i]?.divergence01 ?? null,
      lit: y.divergence01,
    })),
  };
}

/**
 * The whole receipt for one row: every key measured, in the order given.
 * @param {{ rowId?: string, years?: number, keys?: ReadonlyArray<string>, release?: ReadonlyArray<string> }} [input]
 */
export async function measureInfoLitDark({ rowId = DEFAULT_ROW_ID, years = DEFAULT_YEARS, keys = INFO_FLAG_KEYS, release = [] } = {}) {
  const row = READER_CORPUS_ROSTER.find((r) => r.campaignId === rowId);
  if (!row) throw new Error(`info-lit-dark: no reader corpus row named ${rowId}`);
  const darkCache = new Map();
  const results = [];
  for (const key of keys) results.push(await measureKey({ row, key, years, release, darkCache }));
  return {
    instrument: INFO_LIT_DARK_INSTRUMENT,
    row: row.campaignId,
    preset: row.preset,
    seed: String(row.seed),
    years,
    release: [...release],
    keys: results,
  };
}

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) { args[argv[i].slice(2)] = argv[i + 1]; i += 1; }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.out) throw new Error('info-lit-dark: --out <file.json> is required (the instrument writes a file, never the console)');
  const list = (/** @type {string | undefined} */ v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);
  const receipt = await measureInfoLitDark({
    rowId: args.row || DEFAULT_ROW_ID,
    years: args.years ? Number(args.years) : DEFAULT_YEARS,
    keys: args.keys ? list(args.keys) : INFO_FLAG_KEYS,
    release: list(args.release),
  });
  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, `${JSON.stringify(receipt, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error?.stack || error}\n`);
    process.exitCode = 1;
  });
}
