/**
 * readerCorpus.mjs — THE READER CORPUS: compose, advance, render, manifest.
 *
 * THE DEFECT THIS EXISTS TO MAKE IMPOSSIBLE. The exhaustive review is a READER protocol:
 * a panel is seated against the documents a customer actually receives, and every answer
 * must cite one. Without a corpus, "the panel read the world" means each seat read whatever
 * it could reach — a different world per seat, unreproducible, and unfalsifiable. Two seats
 * disagreeing would be indistinguishable from two seats reading different bytes.
 *
 * SO THE CORPUS IS A BIT CLAIM. Every campaign is composed from a frozen roster row, advanced
 * by the soak's own loop seam for seam, rendered into a fixed document set, and hashed into a
 * manifest a second process must reproduce exactly. `--verify` is the instrument's proof of
 * its own determinism: two lanes reading "the same campaign" are provably reading the same
 * bytes, and a volatile field is caught by the runner rather than by a reader's puzzlement.
 *
 * WHY THE COMPOSER IS RE-STATED HERE RATHER THAN IMPORTED. `whole-world-soak.mjs`'s
 * `buildFixture` is module-private, and that file runs a soak ON IMPORT, so importing it to
 * reach the builder would execute a thirty-year world. It is also inside
 * `REALM_SCALE_SOURCE_PATHS`, so exporting the builder would move the certification
 * `sourceFingerprint` and break `soakScriptSeams.test.js`'s pins. The composer below is
 * therefore a deliberate RE-SPELLING, and a re-spelling that drifts produces a corpus the
 * whole review phase then rests on — which is why `rr-control-w0` exists and why the
 * manifest test pins its year-1 composite against the soak's own published hash. The
 * re-spelling is not trusted; it is CONVICTED by an equality.
 *
 * WHAT IS COPIED, TERM FOR TERM, FROM THE SOAK (addresses measured at this tip, not
 * transcribed from the design — three of the design's own addresses had drifted):
 *   - `REGION_ARCHETYPES` and `SEQ_IDS`            `whole-world-soak.mjs:232-238`
 *   - the four historical edges and three channels `whole-world-soak.mjs:303-320`
 *   - `ensureRegionalGraph({edges, channels}, {now})` and `wizardNews {currentTick:0, entries:[]}`
 *   - `composeSoakRules({ preset, seasons: 'preset', overlay })`  `soakRules.mjs:160`
 *   - the yearly advance, its `advanceEpoch` term, its threading and its fold of
 *     `settlementUpdates`                          `whole-world-soak.mjs:413-485`
 *   - the composite `sha256(JSON.stringify({worldState, regionalGraph, settlements}))` in
 *     THAT key order                               `whole-world-soak.mjs:480-484`
 *   - `NOW = '2026-07-12T00:00:00.000Z'`           `whole-world-soak.mjs:172`
 *
 * WHAT IS DELIBERATELY NOT COPIED: the soak's spatial canon. `buildWholeWorldSoakSpatialCanon`
 * is imported rather than re-spelled, because it is an exported pure function and a
 * re-spelling of IT would be a fork with none of the control campaign's protection.
 *
 * PER-YEAR CAPTURE IS MANDATORY, NOT A NICETY. `wizardNews.MAX_ENTRIES` is 240 and the
 * measured first year alone mints ~429 raw rows, so the year-30 feed is under 2 % of what the
 * world authored. A producer that reads the FINAL feed instead of the per-year capture is
 * silently reading a two-percent sample and would report a world nobody lived in. Every
 * year's raw entries are captured through `onTickObservation` and the `news` document is the
 * UNION, not the tail.
 *
 * PURITY. No wall clock, no `Math.random`, no ambience: `now` is the pinned soak instant and
 * `runId` is a DIRECTORY NAME ONLY — it never enters a hashed document, because a manifest
 * whose hashes moved with the run id could never verify anything.
 *
 * ZERO `src/` BYTES. Everything here is a reader of the engine, never a writer into it.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import {
  DEFAULT_SIMULATION_PRESET_ID,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildWholeWorldSoakSpatialCanon } from '../audit/whole-world-soak-spatial-fixture.mjs';
import { composeSoakRules, soakAdvanceEpoch } from '../audit/soakRules.mjs';
import { foldDecades } from '../audit/soakInvariants.mjs';
import { measureAddressChain } from '../audit/behavioral-observation.mjs';
import { configFromGoldenKey } from '../lib/golden-corpus-key.mjs';
import { tuningRegisterFingerprint } from '../lib/tuning-inventory.mjs';

/** The soak's pinned instant. One `now` for the whole corpus. */
export const READER_NOW = '2026-07-12T00:00:00.000Z';

/** The soak's four archetypes, term for term (`whole-world-soak.mjs:204-209`). */
export const REGION_ARCHETYPES = Object.freeze([
  Object.freeze({ settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'crossroads' }),
  Object.freeze({ settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' }),
  Object.freeze({ settType: 'town', culture: 'celtic', terrain: 'coastal', tradeRouteAccess: 'port' }),
  Object.freeze({ settType: 'village', culture: 'norse', terrain: 'mountains', tradeRouteAccess: 'road' }),
]);

/** The soak's four ids (`whole-world-soak.mjs:210`). Member 0 is the golden seat. */
export const REGION_IDS = Object.freeze(['soak-a', 'soak-b', 'soak-c', 'soak-d']);

/**
 * THE LAUNCH POSTURE, READ RATHER THAN COPIED. The DEFAULT preset comes FIRST because it is
 * the world the customer is HANDED: every new campaign and instant world starts on it, and a
 * roster that read three world-alive presets and never the default would review a world most
 * customers never choose. `launchPostureIsDark` pins the membership so a preset rename cannot
 * silently empty the roster.
 */
export const LAUNCH_POSTURE_PRESETS = Object.freeze([
  DEFAULT_SIMULATION_PRESET_ID,
  'dramatic_campaign',
  'living_realm',
  'full_simulation',
]);

/**
 * THE LIT-PREVIEW OVERLAY — the FOUR-key form, as ruled.
 *
 * ⚠ A MEASURED GAP THIS MODULE MUST NOT CLOSE ON ITS OWN WORD. The espionage gate is a
 * THREE-part conjunction (`espionageGate.js`): it needs `beliefsActive` AND
 * `errandSpineEnabled === true` AND `espionageEnabled === true`. This overlay therefore
 * cannot light OPERATIONS, and a probe measured the layer writing nothing over thirty years
 * even with the whole conjunction lit. That is an OPEN OWNER ROW, not a lane's to decide:
 * adding `errandSpineEnabled` here would answer the owner's question by editing a literal.
 * The key stays, the gap is named, and Q-OPS-1/Q-OPS-2 score `dark_by_flag` on BOTH postures
 * until the owner rules.
 *
 * ⛔ `characterDriftEnabled` IS DELIBERATELY ABSENT, AND THE REASON WRITTEN HERE WAS FALSE —
 * CORRECTED 2026-09-05 BY LANE L-CHAIR-901. It read "no gate anywhere reads it, so setting
 * it is a no-op that reads as intent." A gate DOES read it. Measured at this tip:
 * `characterDriftActive` in `src/domain/npc/characterDrift.js` reads
 * `simulationRules[CHARACTER_DRIFT_FLAG_KEY] === true` strictly, and it is CALLED at four
 * live src sites — `characterDrift.js` (`applyAxisDrift`, `applyGraduatedAxisDrift`) and
 * `npc/livedExperienceFunnel.js` twice. This matters here more than anywhere: this is the
 * OWNER'S WALK corpus, and a reason a reader can check against the tree in ten seconds is
 * the only kind this file may carry.
 *
 * ⭐ THE KEY STILL STAYS OUT, FOR THE TRUE REASON, WHICH IS ONE LAYER FURTHER IN. The drift
 * layer is dark by having NO PRODUCTION ENTRY POINT, not by having no gate: nothing in a
 * pulse or a store path reaches those four sites, which the estate already records at
 * `npc/characterReadModel.js` — "Today no caller runs foldLivedExperience". So setting the
 * key really would change nothing in this corpus, and it would still read as intent — but
 * the day a caller lands, the key becomes live and this paragraph must be re-derived rather
 * than trusted. That is a dependency on a MEASUREMENT, which the old sentence hid by
 * claiming a fact about the gate that was never true.
 */
export const PREVIEW_OVERLAY = Object.freeze({
  warMemoryEnabled: true,
  espionageEnabled: true,
  demographicsEnabled: true,
  neutralNeighborsEnabled: true,
});

/**
 * THE ROSTER — a frozen literal of eleven campaigns the owner widens by adding keys.
 *
 * Six golden rows, ONE PER TIER, under the DEFAULT preset (tiers are the axis along which
 * every rubric system's density changes: a thorp has no ladder, a metropolis has three
 * factions). Two fresh regions under the world-alive presets. Two preview twins of them. One
 * control, which is the soak's own fixture and is the no-fork pin.
 *
 * `goldenKey` names the settlement that takes the region's MEMBER 0 seat; the other three
 * members are the soak's archetypes 1-3, so every campaign has the neighbours that three of
 * the six rubric systems need in order to be answerable at all.
 *
 * `living_realm` is unread at eleven, and that is a stated hole rather than an oversight: it
 * is the first widening the owner is offered.
 */
export const READER_CORPUS_ROSTER = Object.freeze([
  Object.freeze({ campaignId: 'rr-golden-thorp', posture: 'launch', preset: DEFAULT_SIMULATION_PRESET_ID, goldenKey: 'thorp|norse|hills|road|civilized|golden-master-v3', seed: 'rr-golden-thorp', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-golden-hamlet', posture: 'launch', preset: DEFAULT_SIMULATION_PRESET_ID, goldenKey: 'hamlet|celtic|forest|isolated|civilized|golden-master-v3', seed: 'rr-golden-hamlet', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-golden-village', posture: 'launch', preset: DEFAULT_SIMULATION_PRESET_ID, goldenKey: 'village|germanic|coastal|port|civilized|golden-master-v3', seed: 'rr-golden-village', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-golden-town', posture: 'launch', preset: DEFAULT_SIMULATION_PRESET_ID, goldenKey: 'town|slavic|desert|road|civilized|golden-master-v3', seed: 'rr-golden-town', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-golden-city', posture: 'launch', preset: DEFAULT_SIMULATION_PRESET_ID, goldenKey: 'city|arabic|coastal|port|civilized|golden-master-v3', seed: 'rr-golden-city', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-golden-metropolis', posture: 'launch', preset: DEFAULT_SIMULATION_PRESET_ID, goldenKey: 'metropolis|mediterranean|coastal|port|civilized|golden-master-v3', seed: 'rr-golden-metropolis', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-fresh-full', posture: 'launch', preset: 'full_simulation', goldenKey: null, seed: 'rr-fresh-full', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-fresh-dramatic', posture: 'launch', preset: 'dramatic_campaign', goldenKey: null, seed: 'rr-fresh-dramatic', overlay: null, years: 30 }),
  Object.freeze({ campaignId: 'rr-preview-full', posture: 'preview', preset: 'full_simulation', goldenKey: null, seed: 'rr-fresh-full', overlay: 'PREVIEW_OVERLAY', years: 30 }),
  Object.freeze({ campaignId: 'rr-preview-dramatic', posture: 'preview', preset: 'dramatic_campaign', goldenKey: null, seed: 'rr-fresh-dramatic', overlay: 'PREVIEW_OVERLAY', years: 30 }),
  // ⛔ THE CONTROL CARRIES THE SOAK'S OWN ENGINE IDENTITY, AND THAT IS NOT COSMETIC.
  // MEASURED: the campaign ID REACHES THE WORLD. Composed with `id: 'rr-control-w0'` the
  // year-1 composite is 96663bc6…; composed with `id: 'whole-world-soak'` and nothing else
  // changed it is 2409ea4e… — the soak's own published hash, to the byte. So a control
  // wearing its own name is not a control at all: it forks from the thing it exists to
  // prove equality with, and the fork looks exactly like composer drift.
  Object.freeze({ campaignId: 'rr-control-w0', engineCampaignId: 'whole-world-soak', engineCampaignName: 'Whole-World Soak Realm', posture: 'launch', preset: 'full_simulation', goldenKey: null, seed: 'w0-soak', overlay: null, years: 30 }),
]);

/** The control campaign — the no-fork pin. Its year-1 composite must equal the soak's. */
export const CONTROL_CAMPAIGN_ID = 'rr-control-w0';

/** The decade marks the raw world is dumped at. */
export const WORLD_DUMP_YEARS = Object.freeze([10, 20, 30]);

/** The documents whose citation kind is RECORD by prefix, mirrored from the rubric. */
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

/** A stable JSON rendering. Key order is the object's own insertion order, as the soak's is. */
const stableJson = (value) => JSON.stringify(value, null, 2);

/**
 * The overlay a roster row actually applies. Named rather than inlined so a row carries a
 * NAME the manifest can print, not an anonymous object a reader cannot check.
 * @param {{ overlay: string | null }} row
 * @returns {Record<string, unknown>}
 */
export function overlayForRow(row) {
  if (row?.overlay === 'PREVIEW_OVERLAY') return { ...PREVIEW_OVERLAY };
  if (row?.overlay == null) return {};
  throw new Error(`reader roster row names an unknown overlay: ${row.overlay}`);
}

/**
 * The four member configs of a roster row's region. Member 0 is the golden row when the row
 * names one, and the soak's archetype 0 otherwise; members 1-3 are always the soak's
 * archetypes 1-3, so every region keeps the neighbour structure the rubric needs.
 *
 * @param {Record<string, any>} row
 * @returns {{ id: string, config: Record<string, unknown>, fromGoldenKey: boolean }[]}
 */
export function configFromRow(row) {
  const members = REGION_ARCHETYPES.map((archetype, index) => ({
    id: REGION_IDS[index],
    config: { ...archetype },
    fromGoldenKey: false,
  }));
  if (row?.goldenKey) {
    // The golden key round-trips losslessly, and its `_seed` is the GOLDEN corpus's seed,
    // not this campaign's: it is destructured out exactly as the golden test does, because
    // the member's seed is the region's (`${seed}-0`) and threading the golden seed here
    // would generate a settlement no roster row names.
    const config = configFromGoldenKey(row.goldenKey);
    delete config._seed;
    members[0] = { id: REGION_IDS[0], config, fromGoldenKey: true };
  }
  return members;
}

/**
 * Compose one reader region — the soak's fixture, re-spelled, parameterised by the roster row.
 *
 * @param {Record<string, any>} row
 * @param {{ now?: string }} [options]
 * @returns {{ campaign: Record<string, any>, saves: Record<string, any>[] }}
 */
export function composeReaderRegion(row, { now = READER_NOW } = {}) {
  const preset = SIMULATION_RULE_PRESETS[row?.preset];
  if (!preset) throw new Error(`reader roster row ${row?.campaignId} names an unknown preset: ${row?.preset}`);

  const seed = String(row.seed);
  const saves = configFromRow(row).map(({ id, config }, index) => {
    // Options are the THIRD argument — the second is importedNeighbour and fail-closes on an
    // options bag. Copied from the soak rather than invented.
    const settlement = generateSettlementPipeline(config, null, { seed: `${seed}-${index}`, customContent: {} });
    return {
      id,
      name: settlement.name || id,
      phase: 'canon',
      settlement,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    };
  });

  const firstExport = (save) => {
    const list = save.settlement?.economicState?.primaryExports || [];
    const label = typeof list[0] === 'string' ? list[0] : list[0]?.label;
    return label ? [{ id: String(label).toLowerCase().replace(/[^a-z0-9]+/g, '_'), label }] : [];
  };
  const channel = (from, to) => ({
    type: 'trade_dependency',
    from: from.id,
    to: to.id,
    status: 'confirmed',
    strength: 0.55,
    goods: firstExport(from),
  });

  const edges = [
    { id: 'edge.soak-a.soak-b', from: 'soak-a', to: 'soak-b', relationshipType: 'trade_partner' },
    { id: 'edge.soak-b.soak-c', from: 'soak-b', to: 'soak-c', relationshipType: 'rival' },
    { id: 'edge.soak-a.soak-c', from: 'soak-a', to: 'soak-c', relationshipType: 'neutral' },
    { id: 'edge.soak-c.soak-d', from: 'soak-c', to: 'soak-d', relationshipType: 'trade_partner' },
  ];
  const channels = [channel(saves[0], saves[1]), channel(saves[2], saves[1]), channel(saves[1], saves[3])];

  // ⛔ THE OVERLAY APPLIES INTO `fullRules`, ABOVE the `darkRules` derivation — the soak
  // charter's highest-risk law, honoured by going through `composeSoakRules` rather than
  // spreading the overlay here.
  const { fullRules } = composeSoakRules({
    preset: preset.rules,
    seasons: 'preset',
    overlay: overlayForRow(row),
  });

  const campaign = {
    // ⚠ THE ENGINE CAMPAIGN ID IS AN INPUT TO THE WORLD, NOT A LABEL. Two regions built from
    // the same seed and the same rules produce DIFFERENT worlds if their campaign ids differ —
    // measured, not surmised. `engineCampaignId` therefore exists so the control can wear the
    // soak's identity while keeping its own roster name; every other row lets the two coincide.
    id: row.engineCampaignId ?? row.campaignId,
    name: row.engineCampaignName ?? `Reader Corpus — ${row.campaignId}`,
    settlementIds: saves.map((s) => s.id),
    regionalGraph: ensureRegionalGraph({ edges, channels }, { now }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: seed,
      tick: 0,
      canonizedAt: now,
      ...buildWholeWorldSoakSpatialCanon(saves, { enabled: true }),
      simulationRules: fullRules,
      stressors: [],
    },
  };
  return { campaign, saves };
}

/**
 * The chronicle at one year. Loaded lazily and cached so the advance keeps a light top-level
 * import graph, and returns null rather than throwing: a chronicle the read model cannot build
 * is a legitimate state of a young world, and the reader must be able to tell that apart from
 * a year the runner never captured.
 * @param {unknown} worldState
 * @returns {unknown}
 */
function latestChronicleOf(worldState) {
  try {
    if (!chronicleReader) return null;
    return chronicleReader(worldState) ?? null;
  } catch {
    return null;
  }
}

/** @type {((worldState: unknown) => unknown) | null} */
let chronicleReader = null;

/** Install the chronicle read model before an advance. Called by `advanceReaderCampaign`. */
async function ensureChronicleReader() {
  if (chronicleReader) return;
  const mod = await import('../../src/domain/display/chronicleReadModel.js');
  chronicleReader = mod.latestChronicle;
}

/**
 * THE TWO ADVANCE REFUSALS, EXTRACTED SO THEY CAN BE PROVED WITHOUT BREAKING THE ENGINE.
 *
 * They lived inline until the manifest suite tried to plant a paused year and could not: the
 * orchestrator tolerates a null rules object and advances anyway, so the only way to reach the
 * pause branch through the real engine is a fault nobody knows how to summon on demand. An
 * untestable guard is a guard nobody knows still works, and this one stands between the corpus
 * and a document set rendered for a world the engine refused to advance.
 *
 * @param {{ result: any, campaignId: unknown, year: number }} input
 */
export function refuseAdvanceResult({ result, campaignId, year }) {
  if (result?.status === 'paused') {
    throw new Error(`[reader-corpus:${campaignId}] year ${year} PAUSED under autoResolve:true — orchestrator contract broken`);
  }
}

/**
 * The soak's fail-fast, inherited deliberately: a NaN rendered into a document is a defect a
 * reader would report as a world fact, and the runner must die on it rather than publish it.
 * @param {{ composite: unknown, campaignId: unknown, year: number }} input
 */
export function refuseNonFiniteWorld({ composite, campaignId, year }) {
  const bad = nonFiniteIn(composite);
  if (bad.length) {
    throw new Error(`[reader-corpus:${campaignId}] non-finite numbers at year ${year}:\n  ${bad.slice(0, 12).join('\n  ')}`);
  }
}

/**
 * Advance a composed region by the soak's own yearly loop, capturing every year.
 *
 * A PAUSED year THROWS rather than being worked around: the orchestrator's contract under
 * `autoResolve: true` is that it never pauses, and a runner that quietly resumed would render
 * documents for a world the engine refused to advance.
 *
 * @param {{ campaign: any, saves: any[], years: number, seed: string, now?: string, onYear?: Function }} input
 * @returns {Promise<{ campaign: any, saves: any[], yearly: any[] }>}
 */
export async function advanceReaderCampaign({ campaign, saves, years, seed, now = READER_NOW, onYear = null }) {
  await ensureChronicleReader();
  let runningCampaign = campaign;
  let runningSaves = saves;
  const yearly = [];

  for (let year = 1; year <= years; year += 1) {
    const rawWizardNewsById = new Map();
    const advanceEpoch = soakAdvanceEpoch({
      simulationRules: runningCampaign?.worldState?.simulationRules,
      seed,
      year,
    });
    const result = await simulateCampaignWorldInterval({
      campaign: runningCampaign,
      saves: runningSaves,
      interval: 'one_year',
      commit: true,
      now,
      autoResolve: true,
      advanceEpoch,
      onTickObservation: ({ rawWizardNewsEntries }) => {
        for (const entry of rawWizardNewsEntries || []) {
          if (!entry || typeof entry !== 'object' || !entry.id) continue;
          rawWizardNewsById.set(String(entry.id), entry);
        }
      },
    });
    refuseAdvanceResult({ result, campaignId: campaign?.id, year });

    runningCampaign = {
      ...runningCampaign,
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      wizardNews: result.wizardNews,
    };
    if (Array.isArray(result.settlementUpdates) && result.settlementUpdates.length) {
      const byId = new Map(result.settlementUpdates.map((u) => [String(u.saveId), u.settlement]));
      runningSaves = runningSaves.map((s) => (byId.has(String(s.id)) ? { ...s, settlement: byId.get(String(s.id)) } : s));
    }

    const composite = {
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      settlements: runningSaves.map((s) => s.settlement),
    };
    refuseNonFiniteWorld({ composite, campaignId: campaign?.id, year });

    const rawEntries = [...rawWizardNewsById.values()];
    const capture = {
      year,
      tick: result.worldState?.tick ?? null,
      worldHash: sha256(JSON.stringify(composite)),
      rawWizardNewsEntries: rawEntries,
      selected: Array.isArray(result.selected) ? result.selected : [],
      majors: Array.isArray(result.majors) ? result.majors : [],
      resolvedStressors: Array.isArray(result.resolvedStressors) ? result.resolvedStressors : [],
      addressChain: measureAddressChain(rawEntries),
      eventTypeCounts: eventTypeCountsOf(result),
      // ⛔ THE CHRONICLE IS CAPTURED EVERY YEAR; THE RAW WORLD ONLY AT THE DECADE MARKS.
      // These two must NOT share a field, and they did until this was caught: the chronicle
      // producer read `worldStateAtYear`, which is deliberately null except at years 10/20/30
      // to keep thirty full worlds out of memory — so 27 of 30 chronicle years rendered as
      // `null` and every chronology question in the rubric was unanswerable on a document that
      // hashed perfectly and looked complete.
      chronicleAtYear: latestChronicleOf(result.worldState),
      worldStateAtYear: WORLD_DUMP_YEARS.includes(year) ? result.worldState : null,
      wizardNewsAtYear: result.wizardNews,
      simulationRulesAtYear: result.worldState?.simulationRules ?? null,
    };
    yearly.push(capture);
    if (typeof onYear === 'function') onYear(capture);
  }

  return { campaign: runningCampaign, saves: runningSaves, yearly };
}

/**
 * The year's event-type counts, for the liveness fold. Read off the composed year result the
 * orchestrator already returns — no engine surface changes and no persisted state.
 * @param {Record<string, any>} result
 * @returns {Record<string, number>}
 */
function eventTypeCountsOf(result) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const item of (Array.isArray(result?.selected) ? result.selected : [])) {
    const type = String(item?.type ?? item?.event?.type ?? 'unknown');
    counts[type] = (counts[type] || 0) + 1;
  }
  return counts;
}

/**
 * Every path holding a non-finite number. The soak fails fast on these and so does this: a
 * NaN rendered into a document is a defect the reader would report as a world fact.
 * @param {unknown} root
 * @returns {string[]}
 */
export function nonFiniteIn(root) {
  const bad = [];
  const seen = new WeakSet();
  const walk = (node, path) => {
    if (node == null) return;
    if (typeof node === 'number') {
      if (!Number.isFinite(node)) bad.push(`${path} = ${node}`);
      return;
    }
    if (typeof node !== 'object') return;
    if (seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i += 1) walk(node[i], `${path}[${i}]`);
      return;
    }
    for (const key of Object.keys(node)) walk(node[key], `${path}.${key}`);
  };
  walk(root, '$');
  return bad;
}

/**
 * Is the launch posture dark — i.e. does the roster fail to carry the world the customer is
 * handed? Both directions, because a roster that lost the default preset would review three
 * worlds most customers never choose, and a roster that named a preset the table does not
 * carry would compose nothing at all.
 *
 * @param {Record<string, any>} presets
 * @param {string} defaultPresetId
 * @returns {{ ok: boolean, missing: string[], unknown: string[], carriesDefault: boolean }}
 */
export function launchPostureIsDark(presets = SIMULATION_RULE_PRESETS, defaultPresetId = DEFAULT_SIMULATION_PRESET_ID) {
  const table = presets && typeof presets === 'object' ? presets : {};
  const unknown = LAUNCH_POSTURE_PRESETS.filter((id) => !(id in table));
  const carriesDefault = LAUNCH_POSTURE_PRESETS.includes(defaultPresetId);
  const rosterPresets = new Set(READER_CORPUS_ROSTER.map((row) => row.preset));
  const missing = LAUNCH_POSTURE_PRESETS.filter((id) => !rosterPresets.has(id));
  return { ok: unknown.length === 0 && carriesDefault, missing, unknown, carriesDefault };
}

// ── THE DOCUMENT PRODUCERS ───────────────────────────────────────────────────
// Each returns `{ format, body }` where `body` is a string or a Buffer. The renderer hashes
// the body and writes it; NOTHING here reads a clock, a random source or the run id.
//
// The engine modules are imported LAZILY, once per render, for two reasons that are about
// correctness rather than speed: the PDF renderer and the three tab surfaces are JSX and
// must travel through the SSR transformer, and the roster/pin arms of the test suite must be
// able to load this module without dragging @react-pdf's font machinery into a unit test.

let producerModules = null;

/**
 * Load the engine read-models the producers call. Cached per process.
 * @returns {Promise<Record<string, any>>}
 */
async function loadProducers() {
  if (producerModules) return producerModules;
  const [
    heraldFeed, chronicleReadModel, chronicle, chroniclersLetter, realmEntityWeb, newsBody,
    viewModel, normalize, systemState, worldBook, campaignPdf, faithPanel, pantheonDepth,
    deityEffects, warStatus, powerStrata, ladderRead, npcInteriorityRead,
  ] = await Promise.all([
    import('../../src/components/map/heraldFeed.js'),
    import('../../src/domain/display/chronicleReadModel.js'),
    import('../../src/domain/worldPulse/chronicle.js'),
    import('../../src/domain/display/chroniclersLetter.js'),
    import('../../src/domain/dossier/realmEntityWeb.js'),
    import('../../src/domain/display/newsBody.js'),
    import('../../src/pdf/lib/viewModel.js'),
    import('../../src/domain/normalizeSettlement.js'),
    import('../../src/domain/state/deriveSystemState.js'),
    import('../../src/utils/generateWorldBook.js'),
    import('../../src/utils/generateCampaignPDF.js'),
    import('../../src/components/settlement/faithPanelModel.js'),
    import('../../src/domain/display/pantheonDepth.js'),
    import('../../src/domain/display/deityEffects.js'),
    import('../../src/domain/display/warStatus.js'),
    import('../../src/domain/dossier/powerStrata.js'),
    import('../../src/domain/townMap/ladderRead.js'),
    import('../../src/domain/display/npcInteriorityRead.js'),
  ]);
  producerModules = {
    heraldFeed, chronicleReadModel, chronicle, chroniclersLetter, realmEntityWeb, newsBody,
    viewModel, normalize, systemState, worldBook, campaignPdf, faithPanel, pantheonDepth,
    deityEffects, warStatus, powerStrata, ladderRead, npcInteriorityRead,
  };
  return producerModules;
}

/** Anything that throws inside one producer is RECORDED, never swallowed and never fatal. */
function guarded(id, fn) {
  try {
    return { id, ...fn() };
  } catch (error) {
    return { id, format: 'json', body: stableJson({ producerError: String(error?.message ?? error) }), producerError: true };
  }
}

/** The same, for a producer that awaits. */
async function guardedAsync(id, fn) {
  try {
    return { id, ...(await fn()) };
  } catch (error) {
    return { id, format: 'json', body: stableJson({ producerError: String(error?.message ?? error) }), producerError: true };
  }
}

/**
 * Render every document of one advanced campaign.
 *
 * `tabRenderer` is INJECTED rather than imported. The three tab surfaces need React DOM and a
 * stubbed store, and the store is reachable only through a resolver alias the CLI installs;
 * making it a parameter keeps this module loadable in a plain unit test and — more
 * importantly — means a run with no tab renderer RECORDS the absence rather than silently
 * shipping a corpus three surfaces short.
 *
 * @param {{ campaign: any, saves: any[], yearly: any[], outDir: string | null, tabRenderer?: Function | null, entitlements?: string[] }} input
 * @returns {Promise<Record<string, any>>}
 */
export async function renderReaderDocuments({
  campaign, saves, yearly, outDir = null, tabRenderer = null, entitlements = ['dm', 'free'],
}) {
  const P = await loadProducers();
  const worldState = campaign?.worldState ?? {};
  const regionalGraph = campaign?.regionalGraph ?? {};
  const wizardNews = campaign?.wizardNews ?? { currentTick: 0, entries: [] };
  const docs = [];

  // ── news: the UNION of every year's raw entries, joined to the entity web. Reading the
  //    final feed instead would read the last 240 of roughly twelve thousand authored rows.
  docs.push(guarded('news', () => {
    const web = P.realmEntityWeb.buildRealmEntityWeb(saves);
    const rows = [];
    for (const capture of yearly) {
      for (const entry of capture.rawWizardNewsEntries) {
        rows.push({
          year: capture.year,
          tick: entry.tick ?? capture.tick,
          id: String(entry.id),
          type: entry.type ?? null,
          settlementIds: entry.settlementIds ?? [],
          subject: web.resolveSubject({
            npcId: entry.npcIds?.[0] ?? entry.npcId ?? null,
            factionId: entry.factionIds?.[0] ?? entry.factionId ?? null,
            settlementId: entry.settlementIds?.[0] ?? entry.settlementId ?? null,
          }),
          body: P.newsBody.newsBodyText(entry),
          summary: P.newsBody.newsReaderSummary(entry),
          reasons: P.newsBody.newsReasonPhrases(entry),
          survivesToYear30: false,
        });
      }
    }
    // `shown_then_retired` is computable rather than opinionated: an entry the year-30 feed
    // still carries survived retention; one it dropped is invisible to the customer who
    // opens the campaign at year 30, whatever year it was minted in.
    const finalIds = new Set((wizardNews.entries || []).map((e) => String(e?.id)));
    for (const item of rows) item.survivesToYear30 = finalIds.has(item.id);
    rows.sort((a, b) => (a.year - b.year) || (Number(a.tick) - Number(b.tick)) || a.id.localeCompare(b.id));
    return { format: 'jsonl', body: rows.map((r) => JSON.stringify(r)).join('\n') };
  }));

  docs.push(guarded('herald', () => ({
    format: 'json',
    body: stableJson(P.heraldFeed.buildHeraldFeed(campaign, { lens: 'campaign' })),
  })));

  docs.push(guarded('chronicle-advance', () => ({
    format: 'json',
    body: stableJson(yearly.map((capture) => ({
      year: capture.year,
      chronicle: capture.chronicleAtYear ?? null,
    }))),
  })));

  docs.push(guarded('chronicle-grounding', () => ({
    format: 'json',
    body: stableJson(P.chronicle.buildChronicleGrounding({
      wizardNews, worldState, snapshot: null, regionalGraph, lookback: 52,
    })),
  })));

  // ── the chronicler's letter, per year. A letter is what the DM is handed; reading only the
  //    last one would score a thirty-year world on its final page.
  for (const capture of yearly) {
    const label = `letter-y${String(capture.year).padStart(2, '0')}`;
    docs.push(guarded(label, () => ({
      format: 'text',
      body: P.chroniclersLetter.letterToPlainText(P.chroniclersLetter.composeChroniclersLetter({
        wizardNews: capture.wizardNewsAtYear,
        lastReadTick: 0,
        simulationRules: capture.simulationRulesAtYear,
        audience: 'dm',
      })),
    })));
  }

  // ── the dossier: view model at both entitlements, a flat text projection of it, and the
  //    rendered bytes. The view model IS what the PDF prints under the parity contract; the
  //    bytes still prove the render.
  for (const save of saves) {
    const normalized = P.normalize.normalizeSettlement(save.settlement);
    const derived = P.systemState.deriveSystemState(normalized);
    for (const entitlement of entitlements) {
      const suffix = entitlement === 'dm' ? '' : `.${entitlement}`;
      docs.push(guarded(`dossier-${save.id}${suffix}.vm`, () => ({
        format: 'json',
        entitlement,
        body: stableJson(P.viewModel.buildViewModel({
          settlement: normalized,
          systemState: derived,
          eventLog: save.campaignState?.eventLog ?? [],
          phase: 'canon',
          campaign: entitlement === 'dm' ? campaign : null,
        })),
      })));
    }
    // ⟦A54 L4⟧ a reader must read prose AS PROSE to judge its register, so the view model
    // also gets a flat text projection beside the JSON.
    docs.push(guarded(`dossier-${save.id}.text`, () => ({
      format: 'text',
      body: flattenProse(P.viewModel.buildViewModel({
        settlement: normalized, systemState: derived, phase: 'canon', campaign,
      })).join('\n'),
    })));
  }

  docs.push(guarded('worldbook.dm', () => ({
    format: 'json',
    body: stableJson(P.worldBook.collectWorldBook(campaign, saves, { mode: 'dm', faithUnlocked: true })),
  })));
  // ⚠ `mode` IS THE ONLY TERM THAT VARIES BETWEEN THE TWO WORLD BOOKS, deliberately. An
  // earlier spelling also dropped `faithUnlocked` on the player book, which would have left a
  // reader unable to say whether a difference came from the MODE or from the ENTITLEMENT. The
  // entitlement axis has its own home — the dossier renders at free and at dm — so it is held
  // fixed here and one question is asked at a time.
  docs.push(guarded('worldbook.player', () => ({
    format: 'json',
    body: stableJson(P.worldBook.collectWorldBook(campaign, saves, { mode: 'player', faithUnlocked: true })),
  })));
  docs.push(guarded('campaign-pdf', () => ({
    format: 'json',
    body: stableJson(P.campaignPdf.collectRealmSummary(campaign, saves, { faithUnlocked: true })),
  })));

  // ── the RECORD dumps. A locator into one resolves by file read whether or not any tab
  //    paints the field — which is exactly why `shown` may never rest on one alone.
  for (const save of saves) {
    const settlement = save.settlement;
    docs.push(guarded(`faith-${save.id}`, () => {
      const patron = settlement?.config?.primaryDeitySnapshot ?? null;
      return {
        format: 'json',
        body: stableJson({
          panel: P.faithPanel.faithPanelModel(settlement),
          standings: P.pantheonDepth.pantheonStandings(worldState),
          depth: P.pantheonDepth.pantheonDepthModel({ worldState, regionalGraph, carrierDeity: patron }),
          effects: patron ? P.deityEffects.describeDeityEffects(patron) : null,
        }),
      };
    }));
    docs.push(guarded(`war-${save.id}`, () => ({
      format: 'json',
      body: stableJson({
        status: P.warStatus.settlementWarStatus({ settlementId: save.id, worldState, regionalGraph }),
        exhaustion: P.warStatus.settlementWarExhaustion({ settlementId: save.id, worldState }),
        sieges: P.warStatus.liveSieges({ worldState, regionalGraph }),
        tradeWars: P.warStatus.liveTradeWars({ worldState, regionalGraph }),
        dispositions: P.warStatus.dispositionStandings(worldState),
        exhaustionStandings: P.warStatus.warExhaustionStandings(worldState, null),
      }),
    })));
    docs.push(guarded(`power-${save.id}`, () => {
      // ⚠ `ladderFactionsOf` returns a RECORD keyed by factionId, not an array — a `.map`
      // here threw on the first run and would have hidden the whole DENSITY record behind a
      // producer error, which is precisely how a rubric question silently becomes unanswerable.
      const factions = P.ladderRead.ladderFactionsOf(settlement) || {};
      return {
        format: 'json',
        body: stableJson({
          rulingChain: P.powerStrata.rulingChainOf(settlement),
          strata: P.powerStrata.derivePowerStrata(settlement),
          ladder: Object.keys(factions).map((factionId) => ({
            factionId,
            rungs: P.ladderRead.ladderRungsOf(settlement, factionId),
            instability: P.ladderRead.ladderInstabilityOf(settlement, factionId),
          })),
        }),
      };
    }));
    docs.push(guarded(`npc-${save.id}`, () => {
      const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
      const top = [...npcs]
        .sort((a, b) => (Number(b?.influence) || 0) - (Number(a?.influence) || 0))
        .slice(0, 8);
      return {
        format: 'json',
        body: stableJson(top.map((npc) => ({
          nid: npc?.nid ?? npc?.id ?? npc?.name ?? null,
          // What the dossier card SHOWS, beside what the record HOLDS. The pair is the
          // point: an interiority the customer never sees is not the same fact.
          asDossierShows: P.npcInteriorityRead.npcInteriority({ npc }),
          asRecordHolds: P.npcInteriorityRead.npcInteriority({
            npc, worldState, nid: npc?.nid ?? npc?.id ?? null, tick: worldState?.tick ?? 0, includeGroundTruth: true,
          }),
        }))),
      };
    }));
  }

  for (const year of WORLD_DUMP_YEARS) {
    const capture = yearly.find((c) => c.year === year);
    if (!capture?.worldStateAtYear) continue;
    docs.push(guarded(`world-y${year}`, () => ({
      format: 'json', body: stableJson(capture.worldStateAtYear),
    })));
  }

  // ── the dossier BYTES. Lazy, because @react-pdf's font machinery is expensive and only
  //    this leg needs it.
  const pdfDocs = await renderDossierPdfs({ saves, campaign, P });
  docs.push(...pdfDocs);

  // ── the three tab SURFACES, if a renderer was injected.
  if (typeof tabRenderer === 'function') {
    for (const save of saves) {
      const rendered = await guardedAsync(`tab-${save.id}`, async () => ({
        format: 'json', body: stableJson(await tabRenderer({ save, campaign, saves })),
      }));
      docs.push(rendered);
    }
  } else {
    docs.push({
      id: 'tabs',
      format: 'json',
      body: stableJson({
        rendered: false,
        reason: 'no tabRenderer injected: the faith/war/power tab surfaces were NOT read by this run',
      }),
      notRendered: true,
    });
  }

  /** @type {Record<string, any>} */
  const receipts = {};
  for (const doc of docs) {
    const buffer = Buffer.isBuffer(doc.body) ? doc.body : Buffer.from(String(doc.body), 'utf-8');
    const receipt = {
      sha256: sha256(buffer),
      bytes: buffer.length,
      format: doc.format,
    };
    if (doc.entitlement) receipt.entitlement = doc.entitlement;
    if (doc.pages != null) receipt.pages = doc.pages;
    if (doc.format === 'text' || doc.format === 'jsonl') {
      receipt.lines = buffer.length === 0 ? 0 : String(doc.body).split('\n').length;
    }
    if (doc.producerError) receipt.producerError = true;
    if (doc.notRendered) receipt.notRendered = true;
    receipts[doc.id] = receipt;
    if (outDir) {
      const path = join(outDir, `${doc.id}.${extensionFor(doc.format)}`);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, buffer);
    }
  }
  return receipts;
}

const extensionFor = (format) => ({ json: 'json', jsonl: 'jsonl', text: 'txt', pdf: 'pdf' }[format] || 'txt');

/**
 * The dossier PDFs. Fonts are re-registered from disk exactly as the render test does:
 * `theme.js` registers Lora/Nunito with BROWSER url sources, and in node fontkit tries to
 * open that literal path and fails with ENOENT. `register()` appends and `resolve()` returns
 * the FIRST match, so the source lists must be emptied before re-registering or the browser
 * paths win.
 * @returns {Promise<any[]>}
 */
/**
 * ⛔ THE SECOND PIN THAT MAKES THE DOSSIER A BIT CLAIM. The lockfile's @react-pdf/pdfkit (5.1.1)
 * salts every embedded font subset with SIX RANDOM UPPERCASE LETTERS drawn from `Math.random()`
 * (`/FontName /QHKWUQ+Nunito-Regular`), and the salt reaches the font descriptor, the base-font
 * names, the subset's own name table and the ToUnicode map, so two renders of one world differ
 * in three compressed font streams per font and nowhere else. Measured 2026-09-16: on the CI
 * runner all four dossiers, then on a lockfile-faithful scratch worktree — equal byte lengths,
 * first difference at the tag, then in objects 193/200/204 (the FontFile2 and two small
 * streams). No local pair had ever drifted because the box's drifted node_modules carries
 * pdfkit 0.20.1, which derives the tag from the font's id instead.
 *
 * `Math.random` is the library's only entropy on this path (pdfkit's CreationDate is pinned by
 * READER_NOW above, and the /ID pair derives from it), so the corpus renderer swaps it for a
 * seeded generator for exactly the awaited render and restores it after. The seed is the
 * save's id, so the same document always draws the same salts; the product's own PDF export is
 * untouched. Nothing else runs in this process between the swap and the restore: the renderer
 * awaits the one render, and vitest runs a file's tests in sequence in their own worker.
 * @template T
 * @param {string} seed
 * @param {() => Promise<T>} render
 * @returns {Promise<T>}
 */
async function withPinnedEntropy(seed, render) {
  const original = Math.random;
  let state = 0x9e3779b9;
  for (const ch of String(seed)) state = (Math.imul(state ^ ch.charCodeAt(0), 0x01000193) >>> 0) || 1;
  // mulberry32: small, well-mixed, and enough for six letters per font.
  Math.random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  try {
    return await render();
  } finally {
    Math.random = original;
  }
}

/**
 * ⛔ THE THIRD PIN. With the clock and the entropy pinned, two renders of one world still
 * differed on the lockfile's @react-pdf/pdfkit (5.1.1): every object's bytes were identical,
 * but the FONT objects were written in a different ORDER, because that pdfkit finalises each
 * embedded font through a stream (`subset.encodeStream()` piped into the font file) and emits
 * the objects as the stream events land, so the order follows I/O timing. Only the cross-
 * reference table then differs (it records each object's offset). Measured 2026-09-16 on a
 * lockfile-faithful worktree: 220 objects, one body differing (the xref), the order diverging
 * from object 193 on. The box's pdfkit 0.20.1 encodes subsets synchronously and never showed it.
 *
 * A PDF's objects are position-independent apart from the cross-reference table, so the
 * corpus renderer re-emits them in ascending object number and rebuilds the table: the header,
 * every object body and the trailer dictionary are copied byte for byte; only the order, the
 * xref offsets and `startxref` change. The result has the same length and the same multiset of
 * objects, asserted below. The product's own export is untouched — this is the corpus
 * renderer's pin, like READER_NOW and withPinnedEntropy above it.
 * @param {Buffer} body
 * @returns {Buffer}
 */
export function canonicalObjectOrder(body) {
  const text = body.toString('latin1');
  const startxrefAt = text.lastIndexOf('startxref');
  if (startxrefAt < 0) throw new Error('canonicalObjectOrder: no startxref');
  const xrefAt = Number(text.slice(startxrefAt + 'startxref'.length).match(/\d+/)[0]);
  if (text.slice(xrefAt, xrefAt + 4) !== 'xref') throw new Error('canonicalObjectOrder: startxref does not point at xref');
  const trailerAt = text.indexOf('trailer', xrefAt);
  const trailerDict = text.slice(trailerAt + 'trailer'.length, startxrefAt).replace(/^\s+|\s+$/g, '');
  // The table pdfkit writes is one section, `0 N` then N twenty-byte entries.
  const table = text.slice(xrefAt, trailerAt);
  const head = table.match(/^xref\r?\n(\d+) (\d+)\r?\n/);
  if (!head || Number(head[1]) !== 0) throw new Error('canonicalObjectOrder: unexpected xref section');
  const count = Number(head[2]);
  const entries = table.slice(head[0].length).match(/\d{10} \d{5} [nf]/g) || [];
  if (entries.length !== count) throw new Error(`canonicalObjectOrder: ${entries.length} xref entries for ${count} objects`);
  const offsets = entries.map((e) => ({ at: Number(e.slice(0, 10)), inUse: e.endsWith('n') }));
  const objects = [];
  for (let num = 1; num < count; num += 1) {
    const { at, inUse } = offsets[num];
    if (!inUse) continue;
    const header = text.slice(at, at + 40).match(/^(\d+) 0 obj\r?\n/);
    if (!header || Number(header[1]) !== num) throw new Error(`canonicalObjectOrder: object ${num} is not at its xref offset`);
    let end;
    const streamAt = text.indexOf('stream', at);
    const endobjAt = text.indexOf('endobj', at);
    if (streamAt >= 0 && streamAt < endobjAt) {
      const dict = text.slice(at, streamAt);
      const length = dict.match(/\/Length (\d+)/);
      if (!length) throw new Error(`canonicalObjectOrder: object ${num} has a stream without a direct /Length`);
      const dataAt = streamAt + 'stream'.length + (text[streamAt + 6] === '\r' ? 2 : 1);
      end = text.indexOf('endobj', dataAt + Number(length[1]));
    } else {
      end = endobjAt;
    }
    if (end < 0) throw new Error(`canonicalObjectOrder: object ${num} has no endobj`);
    end += 'endobj'.length;
    while (text[end] === '\r' || text[end] === '\n') end += 1;
    objects.push({ num, bytes: text.slice(at, end) });
  }
  const firstObjectAt = Math.min(...objects.map((o) => offsets[o.num].at));
  const header = text.slice(0, firstObjectAt);
  objects.sort((x, y) => x.num - y.num);
  let out = header;
  const newOffsets = new Array(count).fill(null);
  for (const o of objects) { newOffsets[o.num] = out.length; out += o.bytes; }
  const newXrefAt = out.length;
  const pad = (n, width) => String(n).padStart(width, '0');
  out += `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let num = 1; num < count; num += 1) {
    out += newOffsets[num] == null ? `${pad(offsets[num].at, 10)} 00000 f \n` : `${pad(newOffsets[num], 10)} 00000 n \n`;
  }
  out += `trailer\n${trailerDict}\nstartxref\n${newXrefAt}\n%%EOF\n`;
  const result = Buffer.from(out, 'latin1');
  if (result.length !== body.length) {
    throw new Error(`canonicalObjectOrder: length moved ${body.length} -> ${result.length}`);
  }
  return result;
}

async function renderDossierPdfs({ saves, campaign, P }) {
  const out = [];
  /** @type {any} */
  let react;
  /** @type {any} */
  let pdf;
  try {
    // ⚠ react and @react-pdf must be imported NORMALLY. Routing CJS through the SSR
    // transformer throws ERR_AMBIGUOUS_MODULE_SYNTAX, and a second React instance would make
    // the render invalid even where it did not throw.
    [react, pdf] = await Promise.all([import('react'), import('@react-pdf/renderer')]);
    registerPdfFonts(pdf.Font);
  } catch (error) {
    return [{
      id: 'dossier-pdf', format: 'json', producerError: true,
      body: stableJson({ producerError: `PDF renderer unavailable: ${String(error?.message ?? error)}` }),
    }];
  }
  const { SettlementPDF } = await import('../../src/pdf/SettlementPDF.jsx');

  for (const save of saves) {
    const normalized = P.normalize.normalizeSettlement(save.settlement);
    const derived = P.systemState.deriveSystemState(normalized);
    const doc = await guardedAsync(`dossier-${save.id}.pdf`, async () => {
      const buffer = await withPinnedEntropy(save.id, () => pdf.renderToBuffer(react.default.createElement(SettlementPDF, {
        settlement: normalized,
        systemState: derived,
        eventLog: save.campaignState?.eventLog ?? [],
        phase: 'canon',
        variant: 'canon_dossier',
        campaign,
        faithUnlocked: true,
        isFounder: true,
        isAnonymous: true,
        // ⛔ THE PIN THAT MAKES THE DOSSIER A BIT CLAIM AT ALL. Without it pdfkit stamps a
        // wall-clock `/CreationDate` (measured in the bytes as `D:20260903192215`) and derives
        // the `/ID` pair from it, so two renders of the SAME world differ and `--verify` over a
        // `.pdf` hash could never pass. The prop already exists and its own docblock names it
        // the document's CreationDate, so the pin costs zero `src/` bytes.
        creationDate: READER_NOW,
      })));
      const body = canonicalObjectOrder(Buffer.from(buffer));
      return { format: 'pdf', body, pages: countPdfPages(body) };
    });
    out.push(doc);
  }
  return out;
}


let fontsRegistered = false;
/** @param {any} Font */
function registerPdfFonts(Font) {
  if (fontsRegistered) return;
  const root = new URL('../../', import.meta.url);
  const font = (name) => new URL(`public/fonts/${name}`, root).pathname;
  const registered = Font.getRegisteredFonts();
  if (registered.Lora) registered.Lora.sources = [];
  if (registered.Nunito) registered.Nunito.sources = [];
  Font.register({
    family: 'Lora',
    fonts: [
      { src: font('Lora-Regular.ttf'), fontWeight: 400 },
      { src: font('Lora-Bold.ttf'), fontWeight: 700 },
      { src: font('Lora-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
      { src: font('Lora-BoldItalic.ttf'), fontWeight: 700, fontStyle: 'italic' },
    ],
  });
  Font.register({
    family: 'Nunito',
    fonts: [
      { src: font('Nunito-Regular.ttf'), fontWeight: 400 },
      { src: font('Nunito-Bold.ttf'), fontWeight: 700 },
      { src: font('Nunito-ExtraBold.ttf'), fontWeight: 800 },
      { src: font('Nunito-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
    ],
  });
  fontsRegistered = true;
}

/**
 * Page objects in a rendered PDF. `/Type /Page` but not `/Type /Pages` (the page-tree node) —
 * the same dependency-free structural read the render test uses.
 * @param {Buffer} buffer
 * @returns {number}
 */
export function countPdfPages(buffer) {
  const body = Buffer.from(buffer).toString('latin1');
  return (body.match(/\/Type\s*\/Page(?!s)/g) || []).length;
}

/**
 * Every prose string reachable in a view model, in document order. A reader judges register
 * on prose, and prose buried in a JSON tree reads as data rather than as writing.
 * @param {unknown} node
 * @param {string[]} [into]
 * @returns {string[]}
 */
export function flattenProse(node, into = []) {
  if (typeof node === 'string') {
    // A sentence, not a token: a bare id or enum member is data and would drown the prose.
    if (node.trim().length >= 12 && /\s/.test(node.trim())) into.push(node.trim());
    return into;
  }
  if (Array.isArray(node)) {
    for (const item of node) flattenProse(item, into);
    return into;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) flattenProse(node[key], into);
  }
  return into;
}

/**
 * The manifest — the corpus's bit claim.
 *
 * ⛔ `runId` IS A DIRECTORY NAME ONLY and never enters a hashed document; a manifest whose
 * hashes moved with the run id could never verify anything. It is carried here, beside the
 * hashes, precisely so the exclusion is visible rather than assumed.
 *
 * @param {{ runId: string, sourceSha: string, campaigns: any[], tuning?: any }} input
 * @returns {Record<string, any>}
 */
export function readerCorpusManifest({ runId, sourceSha, campaigns, tuning = null }) {
  return {
    schema: 'reader-corpus/1',
    runId: String(runId),
    sourceSha: String(sourceSha || 'unknown'),
    now: READER_NOW,
    // §1.5: fail-closed. Every value is DRAFT to a reader unless the register says signed.
    tuning: tuning || readerTuningBlock(),
    posture: {
      launch: {
        presets: [...LAUNCH_POSTURE_PRESETS],
        defaultPresetId: DEFAULT_SIMULATION_PRESET_ID,
      },
      preview: { overlay: { ...PREVIEW_OVERLAY } },
    },
    campaigns: campaigns.map((entry) => ({
      campaignId: entry.campaignId,
      posture: entry.posture,
      preset: entry.preset,
      goldenKey: entry.goldenKey ?? null,
      seed: entry.seed,
      years: entry.years,
      yearlyWorldHashes: entry.yearlyWorldHashes,
      addressChain: entry.addressChain,
      liveness: entry.liveness,
      documents: entry.documents,
    })),
  };
}

/**
 * The manifest's tuning block, READ from the register rather than declared.
 *
 * WHY A READER NEEDS THIS AT ALL. Every number a document prints is either a value the owner
 * has SIGNED or one that is still draft, and a panel scoring a band word as wrong when the
 * band is unsigned is reporting a decision nobody has made yet. So the corpus carries the
 * register's own fingerprint and the reader brief reads DRAFT or SIGNED from it.
 *
 * ⛔ FAIL CLOSED, IN BOTH DIRECTIONS. No register on disk reads `'unregistered'`, never
 * `'signed'`; a register at signature version 0 reads `'draft'`. The one state this must never
 * invent is the owner's approval — the whole tuning desk rests on nobody being able to spell
 * `signed` except the owner's own signing act.
 *
 * ⚠ THE LABEL LIVES HERE AND IN A SIDE-CAR HEADER ONLY — never inside a SURFACE document's
 * bytes. A `TUNING:` line inside a dossier PDF, the campaign PDF or a World Book would change
 * the CUSTOMER's document, so the corpus would stop proving the customer's document, and every
 * hash would flip at the signing for a reason that has nothing to do with the world.
 *
 * @param {string} [root]
 * @returns {{ state: string, signatureVersion: number, fingerprint: any }}
 */
export function readerTuningBlock(root = new URL('../../', import.meta.url).pathname) {
  try {
    const fingerprint = tuningRegisterFingerprint(root);
    if (!fingerprint?.declaredSha256) {
      return { state: 'unregistered', signatureVersion: 0, fingerprint: fingerprint ?? null };
    }
    const version = Number(fingerprint.signatureVersion ?? 0);
    return { state: version > 0 ? 'signed' : 'draft', signatureVersion: version, fingerprint };
  } catch {
    return { state: 'unregistered', signatureVersion: 0, fingerprint: null };
  }
}

/**
 * The liveness fold, BY IMPORT of the soak's own `foldDecades` — never a second spelling of a
 * rule the soak already owns.
 * @param {{ yearly: any[], settlements: number }} input
 * @returns {any[]}
 */
export function readerLiveness({ yearly, settlements }) {
  return foldDecades({
    yearlyEventTypeCounts: yearly.map((c) => c.eventTypeCounts),
    yearlyHashes: yearly.map((c) => c.worldHash),
    yearlyMajorCounts: yearly.map((c) => (Array.isArray(c.majors) ? c.majors.length : 0)),
    settlements,
  });
}

/**
 * Render one roster row end to end: compose, advance, render, and return its manifest entry.
 *
 * @param {{ row: any, outDir: string | null, tabRenderer?: Function | null, years?: number | null, onYear?: Function | null }} input
 * @returns {Promise<Record<string, any>>}
 */
export async function renderReaderCampaign({ row, outDir = null, tabRenderer = null, years = null, onYear = null }) {
  const yearCount = Math.max(1, Number(years ?? row.years));
  const { campaign, saves } = composeReaderRegion(row);
  const advanced = await advanceReaderCampaign({
    campaign, saves, years: yearCount, seed: String(row.seed), onYear,
  });
  const documents = await renderReaderDocuments({
    campaign: advanced.campaign,
    saves: advanced.saves,
    yearly: advanced.yearly,
    outDir,
    tabRenderer,
  });
  return {
    campaignId: row.campaignId,
    posture: row.posture,
    preset: row.preset,
    goldenKey: row.goldenKey ?? null,
    seed: row.seed,
    years: yearCount,
    yearlyWorldHashes: advanced.yearly.map((c) => c.worldHash),
    addressChain: advanced.yearly.map((c) => ({
      year: c.year,
      rows: c.addressChain?.rows ?? null,
      fullyAddressedRateMilli: c.addressChain?.fullyAddressedRateMilli ?? null,
      // ⚠ THE HEADLINE RATE IS NOT THE ADDRESS LAW'S SCORE. `fullyAddressed` requires only
      // depth >= 1 plus an action and a reason — a THREE-part claim. The NAMED ACTOR lives at
      // depth 2 and above, so this histogram, not the rate, is what answers Q-ADR-1.
      depthHistogram: c.addressChain?.depthHistogram ?? null,
    })),
    liveness: readerLiveness({ yearly: advanced.yearly, settlements: advanced.saves.length }),
    documents,
  };
}
