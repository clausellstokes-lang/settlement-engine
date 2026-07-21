/**
 * discourseParity.test.js — TRANCHE 3c ENFORCER (b): THE LIT NARRATIVE-PARITY VARIANT.
 *
 * The complement to tests/simulation/narrativeParity.test.js. That walker proves the
 * cause-walk's DISCONNECTED-LIST rendering narrates one story across every reader
 * surface (flag OFF). This variant lights the discourse kernel over the SAME kind of
 * everything-on decade and proves its CONNECTED PROSE keeps the anti-LLM guarantee:
 *
 *   (b1) CLAIMS-PARITY — every realized clause's recorded content is byte-for-byte a
 *        recorded receipt headline (or an exported honest fallback). Zero unrecorded
 *        claims: the discourse layer connects the receipts, it never invents one.
 *   (b2) DIRECTION AGREEMENT — a clause and the chronicle resolve the same receipt id
 *        to the same headline. The prose can never say "won" where the record says
 *        "lost".
 *   (b3) COMPOSITION — clause.text is exactly connective + ' ' + recorded; the only
 *        authored text is a finite-lexicon connective (or a tickCalendarLabel opener).
 *   (b4) THE FLAG-ON SPELL-BREAK CENSUS — the AUTHORED connective tissue introduces
 *        ZERO spell-breaks (the frozen spellBreakCensus baseline is measured flag-OFF
 *        and stays UNCHANGED; this asserts the discourse layer adds none of its own,
 *        rather than shifting that baseline). Recorded headlines carry the baseline's
 *        own debt and are not this gate's concern.
 *
 * The kernel is display-only and sim-neutral, so lighting discourseProseEnabled does
 * not perturb the drive; the recorder (provenanceLedgerEnabled) supplies the DAG.
 *
 * E-A: on the enforcement spine (basename "parity"); manifest entry documents why a
 * planted PRODUCT mutation is covered elsewhere (rationale ref discourse-parity-variant).
 */
import { describe, expect, test } from 'vitest';
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { nodesFromRecord } from '../../src/domain/display/chronicleGraph.js';
import { buildCauseWalk, REDACTED_HOP } from '../../src/domain/display/causeWalk.js';
import { realizeCauseWalk, ALL_CONNECTIVES, CONNECTIVE_LEXICON, realizationCandidateId } from '../../src/domain/display/discourseKernel.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd', 'e'];
const TICKS = 30;                 // one_month ticks — a rich-enough recorded DAG, cheaply
const SEED = 'discourse-parity-seed';

// Everything-on ceiling + the recorder lit test-locally + the discourse flag lit
// (display-only; sim-neutral — the provenanceDormancyGolden idiom).
const RULES = Object.freeze({
  ...SIMULATION_RULE_PRESETS.full_simulation.rules,
  provenanceLedgerEnabled: true,
  discourseProseEnabled: true,
});

/** honest fallbacks a clause may legitimately carry (not embellishment). */
const FALLBACKS = new Set([REDACTED_HOP, 'an earlier cause', 'World pulse outcome', 'World pulse impact']);
/** a connective is a finite lexicon entry, a tickCalendarLabel opener, an anticipatory
 *  opener (opener + register, the elision-rule-2 joining rule), or empty. */
const OPENER = /^In the (spring|summer|autumn|winter) of year \d+:$/;
const ANTIC_OPENER = /^In the (spring|summer|autumn|winter) of year \d+, (Forewarned:|Against what was coming:|In its shadow:)$/;
const legalConnective = (c) => c === '' || ALL_CONNECTIVES.has(c) || OPENER.test(c) || ANTIC_OPENER.test(c);
/** the spellBreakCensus detectors (replicated), applied to the AUTHORED tissue only. */
const DETECTORS = [
  ['rawId', () => /\b[a-z0-9]+(?:[._][a-z0-9]+){2,}\b/gi],
  ['tickSpeak', () => /\btick\s+\d+/gi],
  ['camelKey', () => /\b[a-z]+(?:[A-Z][a-zA-Z0-9]*)+\b/g],
  ['jsonFragment', () => /\{\s*"|\[object Object\]|"\s*:\s*"/g],
  ['softwareVoice', () => /\b(?:undefined|NaN|null|TypeError|ReferenceError)\b/g],
];

const deity = (/** @type {string} */ ref, /** @type {string} */ name, /** @type {string} */ align, /** @type {string} */ law, /** @type {string} */ rank) =>
  ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = { lg: deity('custom:as_dawn', 'Dawnfather', 'good', 'lawful', 'major'), ce: deity('custom:as_maw', 'The Maw', 'evil', 'chaotic', 'major') };

function spatialDigest() {
  const pack = makeGridPack({ cols: 8, rows: 6 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

/** @param {string} name @param {{ _deityRef: string }} patron @param {{ exports?: string[], imports?: string[], patch?: Record<string, unknown> }} [opts] */
function st(name, patron, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35, primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 26, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 68 },
        { faction: 'Temple Wardens', category: 'religious', power: 57 },
        { faction: 'City Guard', category: 'military', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key', category: 'civic', personality: { dominant: 'stern' } },
      { id: `factor_${name}`, name: `Factor ${name}`, importance: 'key', category: 'economy', personality: { dominant: 'bold' } },
    ],
    activeConditions: [],
    ...patch,
  };
}
const save = (/** @type {string} */ id, /** @type {string} */ name, /** @type {{ _deityRef: string }} */ patron, /** @type {Parameters<typeof st>[2]} */ opts) =>
  ({ id, name, phase: 'canon', settlement: st(name, patron, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const ch = (/** @type {string} */ to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });

function makeSaves() {
  return IDS.map((id, i) => (i === 0
    ? save(id, 'Ashford', D.lg, { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.85 }] } })
    : save(id, `S${id.toUpperCase()}`, i % 2 ? D.ce : D.lg, { imports: [GRAIN], ...(i < 3 ? { patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.78 }] } } : {}) })));
}

function makeCampaign(seed) {
  return {
    id: 'discourse-parity', name: 'Discourse Parity', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, calendar: { elapsedWeeks: 4 }, canonizedAt: NOW,
      simulationRules: { ...RULES },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.92, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 2 },
        { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.74, affectedSettlementIds: ['c'], age: 1 },
      ],
      spatialCanonVersion: 1, spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        ...IDS.slice(1).map((to) => ({ id: `e.a.${to}`, from: 'a', to, relationshipType: 'trade_partner' })),
        { id: 'e.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        { id: 'e.c.d', from: 'c', to: 'd', relationshipType: 'hostile' },
      ],
      channels: IDS.slice(1).map(ch),
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** Drive TICKS one_month pulses (the arc-soak idiom). */
function drive(seed) {
  let campaign = makeCampaign(seed);
  let saves = makeSaves();
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
  }
  return campaign;
}

const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);
const hashOf = (/** @type {unknown} */ v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

/** Realize every recorded root and measure the parity facts. */
function measure(campaign) {
  const worldState = campaign.worldState;
  const seedId = worldState.rngSeed;
  // recorded truth set (headlines) + nodeId -> headline (the direction-agreement map)
  const recordedHeadlines = new Set();
  const headlineById = new Map();
  for (const record of worldState.pulseHistory || []) {
    for (const node of nodesFromRecord(record)) {
      recordedHeadlines.add(node.headline);
      if (!headlineById.has(node.nodeId)) headlineById.set(node.nodeId, node.headline);
    }
  }
  const ledger = worldState?.spatialLedgers?.provenance && typeof worldState.spatialLedgers.provenance === 'object'
    ? worldState.spatialLedgers.provenance : {};
  const roots = Object.keys(ledger).sort(byStr);

  const provenance = ledger;
  const hasAnticipatory = (c) => CONNECTIVE_LEXICON.anticipatory.some((a) => c.connective.includes(a));

  let walksWithHops = 0;
  let clauseCount = 0;
  let elidedPredictions = 0;   // (a) elision fired
  let anticipatoryClauses = 0; // (b) register used
  const unbacked = [];        // (b1)
  const contradictions = [];  // (b2)
  const compositionBreaks = [];  // (b3)
  const illegalConnectives = []; // (b3)
  const connectiveBreaks = [];   // (b4)
  const unlicensedAntic = [];    // (b) anticipatory-license
  const projection = [];
  const samples = [];
  const connectiveKinds = new Set();

  for (const rootId of roots) {
    const walk = buildCauseWalk({ worldState, rootId, seesSecrets: true });
    if (walk.chain.length > 0) walksWithHops += 1;
    const out = realizeCauseWalk(walk, { seedId, provenance });
    if (out.clauses.length >= 2 && samples.length < 3 && walk.chain.length >= 2) samples.push(out.text);
    const outIds = new Set(out.clauses.map((c) => c.receiptKey));
    // (a) count elided predictions: a candidate node in the walk, absent from the
    // output, whose realization IS in the output (typed, not string-matched).
    for (const id of [String(walk.rootId), ...walk.chain.map((h) => String(h.id))]) {
      if (!outIds.has(id) && id.startsWith('candidate.') && [...outIds].some((oid) => realizationCandidateId(oid) === id)) elidedPredictions += 1;
    }
    for (const c of out.clauses) {
      clauseCount += 1;
      projection.push(`${rootId}|${c.receiptKey}|${c.connective}|${c.recorded}`);
      connectiveKinds.add(c.relation);
      // (b1) claims-parity
      if (!recordedHeadlines.has(c.recorded) && !FALLBACKS.has(c.recorded)) unbacked.push(`${rootId} <- ${c.receiptKey}: ${c.recorded}`);
      // (b2) direction agreement
      const chron = headlineById.get(c.receiptKey);
      if (chron != null && chron !== c.recorded && c.recorded !== REDACTED_HOP) contradictions.push(`${c.receiptKey}: prose "${c.recorded}" vs chronicle "${chron}"`);
      // (b3) composition + legal connective
      const expected = c.connective ? `${c.connective} ${c.recorded}` : c.recorded;
      if (c.text !== expected) compositionBreaks.push(`${c.receiptKey}: "${c.text}"`);
      if (!legalConnective(c.connective)) illegalConnectives.push(`${c.receiptKey}: "${c.connective}"`);
      // (b4) the authored connective introduces no spell-break
      for (const [name, mk] of DETECTORS) {
        const hits = c.connective.match(mk());
        if (hits && hits.length) connectiveBreaks.push(`${name} in "${c.connective}"`);
      }
      // (b) anticipatory-license: the register may ONLY ride a clause licensed by a
      // typed prediction parent (relation flagged + anticipatedBy a candidate id).
      if (hasAnticipatory(c) || c.relation === 'anticipatory') {
        anticipatoryClauses += 1;
        if (!(hasAnticipatory(c) && c.relation === 'anticipatory' && String(c.anticipatedBy || '').startsWith('candidate.'))) {
          unlicensedAntic.push(`${c.receiptKey}: "${c.connective}" antic=${c.anticipatedBy}`);
        }
      }
    }
  }
  return {
    counts: { roots: roots.length, walksWithHops, clauseCount, relations: connectiveKinds.size, elidedPredictions, anticipatoryClauses },
    violations: { unbacked, contradictions, compositionBreaks, illegalConnectives, connectiveBreaks, unlicensedAntic },
    projectionHash: hashOf(projection.sort(byStr)),
    samples,
  };
}

const run = measure(drive(SEED));

describe(`3c (b) THE LIT NARRATIVE-PARITY VARIANT — connected prose keeps the anti-LLM guarantee`, () => {
  test('diagnostics (printed so the architect can re-check the band and read sample prose)', () => {
    console.log('[discourse-parity] %o', run.counts);
    run.samples.forEach((s, i) => console.log('[discourse-parity] sample %d: %s', i + 1, s));
    for (const [k, list] of Object.entries(run.violations)) if (list.length) console.log('[discourse-parity] %s (%d): %o', k, list.length, list.slice(0, 5));
    expect(true).toBe(true);
  }, 120_000);

  test('anti-vacuity: the drive produced a real recorded DAG the realizer connected, and prediction elision actually fired', () => {
    expect(run.counts.roots).toBeGreaterThanOrEqual(20);
    expect(run.counts.walksWithHops).toBeGreaterThanOrEqual(5);
    expect(run.counts.clauseCount).toBeGreaterThanOrEqual(30);
    // the owner amendment is exercised on real data, not just synthetic fixtures.
    expect(run.counts.elidedPredictions).toBeGreaterThanOrEqual(5);
  }, 120_000);

  test('(a/b) ELISION stays honest: every anticipatory clause is licensed by a typed prediction (omission is selection, not invention)', () => {
    expect(run.violations.unlicensedAntic).toEqual([]);
  }, 120_000);

  test('(b1) CLAIMS-PARITY: every realized clause traces to a recorded receipt (zero unrecorded claims)', () => {
    expect(run.violations.unbacked).toEqual([]);
  }, 120_000);

  test('(b2) DIRECTION AGREEMENT: prose and chronicle resolve each receipt id identically (zero contradictions)', () => {
    expect(run.violations.contradictions).toEqual([]);
  }, 120_000);

  test('(b3) COMPOSITION: text is exactly connective + recorded, connective from the finite lexicon', () => {
    expect(run.violations.compositionBreaks).toEqual([]);
    expect(run.violations.illegalConnectives).toEqual([]);
  }, 120_000);

  test('(b4) FLAG-ON SPELL-BREAK CENSUS: the authored connective tissue introduces zero spell-breaks', () => {
    expect(run.violations.connectiveBreaks).toEqual([]);
  }, 120_000);

  test('DETERMINISM: an identical seeded drive realizes the identical projection', () => {
    const again = measure(drive(SEED));
    expect(again.projectionHash).toBe(run.projectionHash);
  }, 120_000);
});
