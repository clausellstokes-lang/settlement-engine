/**
 * spellBreakCensus.test.js — THE SPELL-BREAK CENSUS GATE (idx10; bar 18).
 *
 * The reader-facing loop must never break the spell: no raw engine ids in prose, no
 * bare `tick N` clock-speak, no JSON fragments, no camelCase engine keys, no
 * software-voice tokens inside a world surface. This is the STANDING whole-loop
 * census: it drives a real everything-on fixture world, composes the key
 * reader-facing surfaces DOM-free through their canonical domain read-models, scans
 * every prose-bearing string with the spell-break detectors, and pins the result as
 * a SHRINK-ONLY ratchet — green at today's measured break counts, red the moment a
 * surface gains a NEW break, and tightened (baseline lowered) as breaks are fixed.
 *
 * SCOPE COORDINATION: the wave-3 E1 walker owns composer-OUTPUT token-leak checks;
 * this census owns the broader in-character surface set (letter, chronicle,
 * advance-report read-model, decrees, dossier view-model, road-scene briefs, the
 * cause-walk). Shrink-only budgets mean E1 fixes can only make this gate greener.
 *
 * CLARITY CLAUSE (per the program charter): mandated plainness on money/settings/
 * safety surfaces is NOT a spell-break — those surfaces are excluded by
 * construction here (none of the censused composers renders them).
 *
 * WHAT COUNTS (the detectors, each a fresh regex per string):
 *   rawId         — a dotted/underscored structural id chain (≥2 separators)
 *   tickSpeak     — `tick N` in prose (the world has a calendar; the clock is
 *                   engine-speak)
 *   camelKey      — an intercapped engine key leaking into prose
 *   jsonFragment  — object-literal / [object Object] artifacts
 *   softwareVoice — undefined/NaN/null/Error-class tokens in a world surface
 *
 * WHAT IS SCANNED: every STRING VALUE of the composed view-models, EXCEPT values
 * under structural-by-contract keys (ids, refs, enum discriminants the panels map
 * through label tables — see STRUCTURAL_KEYS) and the raw receipt subtrees the
 * chronicle model carries verbatim for drill-down (`receipt`, `raw`). Those are
 * machine payload by contract, not prose; the panels never print them directly.
 *
 * BASELINE HONESTY: every number in BASELINE below was MEASURED on this exact
 * fixture (seed 'spell-census-seed', 30 one_month ticks). The known standing
 * breaks it freezes (burn-down list):
 *   · letter.tickSpeak ×1 — the span line prints raw ticks: "(the record from
 *     tick 0 through 31)" (letterToPlainText)
 *   · letter.camelKey ×37 — the R-16 'world deepened' section prints raw
 *     simulationRules flag keys (warLayerEnabled, …) as prose bullets, ONE PER
 *     LIT FLAG — so this cell deliberately moves with the preset's flag count: a
 *     future full_simulation flag reds it by +1, which is a REAL new leak
 *     instance, not a false positive
 *   · chronicle.rawId ×32 / decrees.rawId ×3 — deputy-diary and decree-cone
 *     `reasons` prose embeds raw condition archetypes ("active condition:
 *     regional_criminal_pressure, regional_route_disruption"). BOTH cells read
 *     the SAME pressureModel.js `active condition: ${…join}` reason (raw
 *     archetype ids stored on the recorded outcome, surfaced verbatim by
 *     deputysDiary AND the decree cone) — so decrees.rawId cannot fall without
 *     also shifting chronicle.rawId. The single cure (humanize the archetypes at
 *     the source) is bundled into the owner's ONE REGEN (tranche 4); until then
 *     BOTH cells stay pinned. (Proven: humanizing pressureModel drops rawId in
 *     both surfaces together.)
 *   · chronicle.camelKey — CURED (was ×3): the embargo/lever reason no longer
 *     leaks the raw relationshipPatch keys ("resentment/tradeBalance"); the M9a
 *     lever line now humanizes them ("resentment/trade balance") via
 *     humanizeToken (settlementStrategy.js). Cell lowered 3 → 0.
 * Fix the surface, watch the cell fall to zero, then LOWER the cell to lock the
 * win. Never raise a cell — a new break is a defect, not a budget line.
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { composeChroniclersLetter, letterToPlainText } from '../../src/domain/display/chroniclersLetter.js';
import { latestChronicle, chronicleHistory } from '../../src/domain/display/chronicleReadModel.js';
import { advanceEntries } from '../../src/domain/display/chronicleGraph.js';
import { decreesForAdvance } from '../../src/domain/display/decreeTracker.js';
import { deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { composeRoadSceneBrief, composeRoadScenePlayerBrief } from '../../src/domain/briefs/roadScene.js';
import { buildCauseWalk } from '../../src/domain/display/causeWalk.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { gen } from '../simulation/simHelpers.js';

const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd'];
const TICKS = 30; // 2.5 years of monthly advances — enough news/chronicle to census
const SEED = 'spell-census-seed';

// Everything-on + the recorder lit test-locally (so the cause-walk surface renders
// over a real recorded ledger) — the emergentArcSoak idiom; no shipped default moves.
const RULES = Object.freeze({
  ...SIMULATION_RULE_PRESETS.full_simulation.rules,
  provenanceLedgerEnabled: true,
});

const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:sc_dawn', 'Dawnfather', 'good', 'lawful', 'major'),
  ce: deity('custom:sc_maw', 'The Maw', 'evil', 'chaotic', 'major'),
};

function spatialDigest() {
  const pack = makeGridPack({ cols: 10, rows: 8 });
  const placed = placeSettlements(pack, IDS.length);
  const placements = placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function st(name, patron, { exports = [], imports = [] } = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
    },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 38, label: 'Contested' },
      factions: [
        { faction: 'Temple Wardens', category: 'religious', power: 58 },
        { faction: 'Merchant League', category: 'economy', power: 55 },
        { faction: 'City Watch', category: 'military', power: 44 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}
const save = (id, name, patron, opts) => ({ id, name, phase: 'canon', settlement: st(name, patron, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const ch = (to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });

function makeCampaignAndSaves(seed) {
  const saves = [
    save('a', 'Ashford', D.lg, { exports: [GRAIN] }),
    save('b', 'Briarwatch', D.ce, { imports: [GRAIN] }),
    save('c', 'Crownhold', D.lg, { imports: [GRAIN] }),
    save('d', 'Deepmoor', D.ce, { imports: [GRAIN] }),
  ];
  const campaign = {
    id: 'spell-census', name: 'Spell Census', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, calendar: { elapsedWeeks: 4 },
      simulationRules: { ...RULES },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 },
      ],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'hostile' },
        { id: 'edge.a.d', from: 'a', to: 'd', relationshipType: 'ally' },
      ],
      channels: [ch('b'), ch('c'), ch('d')],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive TICKS one_month pulses, threading world/graph/news/saves (the smoke idiom). */
function drive(seed) {
  let { campaign, saves } = makeCampaignAndSaves(seed);
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
  }
  return { campaign, saves };
}

// ── The string walker ────────────────────────────────────────────────────────

/** Structural-by-contract keys: machine identity/enum fields the panels resolve
 *  through label tables (never printed as prose). Values under these keys — and
 *  everything under `receipt`/`raw` subtrees — are excluded from the census. */
const STRUCTURAL_KEYS = new Set([
  'id', 'ids', 'nodeId', 'rootId', 'saveId', 'settlementIds', 'memberIds', 'threadIds',
  'threadId', 'keys', 'cone', 'entityKeys', 'sourceEventId', 'causedBy', 'parents',
  'decreeId', 'npcKey', 'key', 'impactIds', 'channelIds', 'crossLinks', 'kind',
  'dramaClass', 'impactKind', 'channelType', 'scope', 'significance', 'spanLabel',
  'altitudes', 'source', 'sources', 'audience', 'phase', 'status', 'state', 'tags',
  'category', 'tier', 'archetype', 'terrain', 'season', 'purposeKind',
]);
/** Raw receipt payload subtrees the read-models carry verbatim for drill-down —
 *  machine payload by the same contract as `receipt`/`raw` (panels resolve them
 *  through display atoms, never print them). */
const SKIP_SUBTREES = new Set(['receipt', 'raw', 'receipts']);

/** Collect every censused string of a composed view-model. Deterministic order.
 *  @param {unknown} value @param {string[]} out @param {string} keyName */
function collectStrings(value, out, keyName = '') {
  if (typeof value === 'string') {
    if (!STRUCTURAL_KEYS.has(keyName) && value.trim() !== '') out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectStrings(v, out, keyName);
    return;
  }
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value).sort()) {
      if (SKIP_SUBTREES.has(k) || STRUCTURAL_KEYS.has(k)) continue;
      collectStrings(/** @type {Record<string, unknown>} */ (value)[k], out, k);
    }
  }
}

// ── The detectors (fresh regex per call — the errorCopyBaseline idiom) ───────
const DETECTORS = Object.freeze([
  ['rawId', () => /\b[a-z0-9]+(?:[._][a-z0-9]+){2,}\b/gi],
  ['tickSpeak', () => /\btick\s+\d+/gi],
  ['camelKey', () => /\b[a-z]+(?:[A-Z][a-zA-Z0-9]*)+\b/g],
  ['jsonFragment', () => /\{\s*"|\[object Object\]|"\s*:\s*"/g],
  ['softwareVoice', () => /\b(?:undefined|NaN|null|TypeError|ReferenceError)\b/g],
]);

/** Census one surface: per-detector occurrence counts over its strings.
 *  @param {string[]} strings @returns {Record<string, number>} */
function census(strings) {
  /** @type {Record<string, number>} */
  const counts = {};
  /** @type {Record<string, string[]>} */
  const samples = {};
  for (const [name, mk] of DETECTORS) {
    counts[name] = 0;
    samples[name] = [];
    for (const s of strings) {
      const m = s.match(mk());
      if (m) {
        counts[name] += m.length;
        if (samples[name].length < 5) samples[name].push(`${JSON.stringify(m.slice(0, 3))} in ${JSON.stringify(s.slice(0, 110))}`);
      }
    }
  }
  return { counts, samples };
}

// ── Compose the surfaces over the driven world ───────────────────────────────
const run = drive(SEED);
const worldState = run.campaign.worldState || {};
const provenance = worldState.spatialLedgers?.provenance || {};

/** letter — flagsSeen [] lights the R-16 'deepened' section deliberately: after a
 *  regen a real reader sees it, so the census must scan it. */
const letter = composeChroniclersLetter({
  wizardNews: run.campaign.wizardNews, lastReadTick: 0,
  simulationRules: worldState.simulationRules, flagsSeen: [],
});
const letterStrings = [letterToPlainText(letter)];

/** chronicle — the full scrollback read-model (the panel + advance-report data). */
const chronicleStrings = [];
collectStrings(latestChronicle(worldState), chronicleStrings);
for (const c of chronicleHistory(worldState)) collectStrings(c, chronicleStrings);

/** decrees — the advance-report's decree tracker over the latest advances. */
const decreeStrings = [];
for (const entry of advanceEntries(worldState).slice(0, 5)) {
  collectStrings(decreesForAdvance(entry, provenance), decreeStrings);
}

/** dossier — the view-model over every driven settlement PLUS one REAL pipeline
 *  settlement (the faction-key lesson: fixtures hide what real data leaks). */
const dossierStrings = [];
for (const s of run.saves) collectStrings(deriveDossierViewModel(s.settlement), dossierStrings);
const genSettlement = gen({ settType: 'town', terrainOverride: 'plains', tradeRouteAccess: 'road', priorityEconomy: 30, magicExists: true }, 'spell-census-dossier-1');
collectStrings(deriveDossierViewModel(genSettlement), dossierStrings);

/** road scene — DM + player briefs across the realm. */
const settlementsArg = run.saves.map((s) => ({ id: s.id, name: s.settlement?.name, settlement: s.settlement }));
const roadStrings = [];
collectStrings(composeRoadSceneBrief({ originId: 'a', destId: 'd', worldState, settlements: settlementsArg, regionalGraph: run.campaign.regionalGraph, tick: worldState.tick }), roadStrings);
collectStrings(composeRoadScenePlayerBrief({ originId: 'a', destId: 'd', worldState, settlements: settlementsArg, regionalGraph: run.campaign.regionalGraph, tick: worldState.tick }), roadStrings);

/** cause walk — the V-4 "trace the causes" surface over a recorded receipt. */
const causeWalkStrings = [];
{
  const firstChild = Object.keys(provenance).sort()[0];
  if (firstChild) {
    collectStrings(buildCauseWalk({ worldState, rootId: firstChild, seesSecrets: false }), causeWalkStrings);
    collectStrings(buildCauseWalk({ worldState, rootId: firstChild, seesSecrets: true }), causeWalkStrings);
  }
}

const SURFACES = Object.freeze({
  letter: letterStrings,
  chronicle: chronicleStrings,
  decrees: decreeStrings,
  dossier: dossierStrings,
  roadScene: roadStrings,
  causeWalk: causeWalkStrings,
});

// ── THE SHRINK-ONLY BASELINE (measured; see the header's burn-down list) ─────
const BASELINE = Object.freeze({
  letter: { rawId: 0, tickSpeak: 1, camelKey: 37, jsonFragment: 0, softwareVoice: 0 },
  chronicle: { rawId: 32, tickSpeak: 0, camelKey: 0, jsonFragment: 0, softwareVoice: 0 },
  decrees: { rawId: 3, tickSpeak: 0, camelKey: 0, jsonFragment: 0, softwareVoice: 0 },
  dossier: { rawId: 0, tickSpeak: 0, camelKey: 0, jsonFragment: 0, softwareVoice: 0 },
  roadScene: { rawId: 0, tickSpeak: 0, camelKey: 0, jsonFragment: 0, softwareVoice: 0 },
  causeWalk: { rawId: 0, tickSpeak: 0, camelKey: 0, jsonFragment: 0, softwareVoice: 0 },
});

describe('THE SPELL-BREAK CENSUS — reader surfaces stay in character (shrink-only ratchet)', () => {
  test('diagnostics (printed so the burn-down list can be re-checked)', () => {
    for (const [surface, strings] of Object.entries(SURFACES)) {
      const { counts } = census(strings);
      console.log('[spell-census] %s: strings=%d counts=%s', surface, strings.length, JSON.stringify(counts));
    }
    expect(true).toBe(true);
  }, 120_000);

  test('anti-vacuity: every surface actually rendered content to scan', () => {
    expect(SURFACES.letter.length).toBeGreaterThanOrEqual(1);
    expect(SURFACES.chronicle.length).toBeGreaterThan(50);
    expect(SURFACES.dossier.length).toBeGreaterThan(20);
    expect(SURFACES.roadScene.length).toBeGreaterThanOrEqual(3);
    expect(SURFACES.causeWalk.length).toBeGreaterThanOrEqual(3);
  }, 120_000);

  test('anti-vacuity: each detector fires on a seeded control break', () => {
    const control = [
      'the ledger world_stressor.famine.a spoke',       // rawId
      'it happened at tick 42 of the run',              // tickSpeak
      'the warLayerEnabled flag flipped',               // camelKey
      'payload { "k": "v" } leaked and [object Object]', // jsonFragment
      'value was undefined and then NaN',               // softwareVoice
    ];
    const { counts } = census(control);
    for (const [name] of DETECTORS) {
      expect(counts[name], `detector ${name} fires on its control`).toBeGreaterThan(0);
    }
  }, 120_000);

  test('the ratchet: no surface exceeds its measured spell-break baseline (shrink-only)', () => {
    for (const [surface, strings] of Object.entries(SURFACES)) {
      const { counts } = census(strings);
      const base = BASELINE[/** @type {keyof typeof BASELINE} */ (surface)];
      for (const [detector, count] of Object.entries(counts)) {
        expect(count, `${surface}.${detector} must stay ≤ its baseline (a NEW spell-break appeared — fix it, do not raise the cell)`).toBeLessThanOrEqual(base[/** @type {keyof typeof base} */ (detector)]);
      }
    }
  }, 120_000);
});
