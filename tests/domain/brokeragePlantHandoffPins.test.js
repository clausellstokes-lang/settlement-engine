/**
 * brokeragePlantHandoffPins.test.js — IN-0a, THE HANDOFF (docs/DESIGN_FP_ARCH_IN.md §4 IN-0a;
 * docs/DESIGN_FP_INFORMATION.md §5 IN-0a + SEAM CONTRACT ONE).
 *
 * THE CENTRAL CLAIM, and it is EXECUTED end to end rather than asserted: a plant commissioned
 * by the REAL rotation producer, carried through the REAL apply lane and the REAL pulse-history
 * compactor, is READ BACK a week later by the statecraft head and folded into the disinfo ledger
 * by the REAL lie writer. Three stages, no shortcut fixture at any of them — the
 * fixture-mirrors-deriver hazard is exactly a fixture hand-built to the shape the reader wants,
 * which proves the reader can read its own imagination and nothing else. Every envelope in this
 * file that reaches the fold came out of `evaluateBrokerageServiceRules` and went through
 * `applyWorldPulseOutcomes` and `compactOutcomeForHistory` on the way.
 *
 * The pins:
 *   1. THE THREE-STAGE WRITER/READER — producer -> apply lane -> history -> fold, and the
 *      folded record's own numbers show the week that passed (seeded now, commissioned then).
 *   2. THE HANDOFF MUTANT — sever the collection and stage 3 REDS (the pin can fail).
 *   3. THE CONSUME-ONCE DOUBLE GUARD — the same record carries on exactly one tick, never the
 *      tick it applied on and never the tick after that.
 *   4. THE CORROBORATED MARK — a plant whose audience already reckons the truth DIES at the
 *      fold, on a SEEDED non-empty ledger (a vacuous empty-ledger assertion proves nothing).
 *   5. THE TAKE — `plant_took` mints one-shot for a bought story still standing a week on, and
 *      is SILENT for a court's own bluff and for a mark who never crossed.
 *   6. THE SPENT MARKET — a discredited market's plant is believed STRICTLY LESS, by a margin,
 *      and yet a fresh plant can still outweigh a stale honest prior (both halves, or the
 *      asymmetry that is the drama reads as a bug).
 *   7. BOTH VALIDATOR DOORS — the transport window is pinned at each of the two guards
 *      INDIVIDUALLY (a defence-in-depth pair can only be proven one door at a time).
 *   8. DORMANCY — either information flag dark and the carry is empty, the fold is untouched,
 *      and the world is byte-identical; captured against the ONE_REGEN preset spread too.
 *   9. THE AUDIENCE — the DM town page mounts the plants, the player projection is EMPTY while
 *      they live, and a source scan proves every `projectPlants` call site names its audience.
 *  10. LIFECYCLE — a folded record JSON-round-trips and survives a ledger rebuild unchanged.
 *  11. REGISTRATION — `plant_took` is phrased, routed, significance-classed, and classifies
 *      `knowledge` on its OWN vocabulary rather than through the bare `news` token.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  BROKERAGE_PLANT_CANDIDATE_TYPE,
  PLANT_TOOK_KIND,
  appliedPlantEnvelopesAt,
  plantExposureReasons,
  plantTookEntry,
} from '../../src/domain/worldPulse/brokeragePlantHandoff.js';
import {
  PLANT_HANDOFF_LAG_TICKS,
  commissionedPlantAt,
} from '../../src/domain/worldPulse/disinformationPlant.js';
import {
  BROKERAGE_ACTS,
  evaluateBrokerageServiceRules,
} from '../../src/domain/worldPulse/brokerageServicesRules.js';
import { attachEnvoyPictureTarget } from '../../src/domain/worldPulse/brokerageServicesPlant.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { compactOutcomeForHistory } from '../../src/domain/worldPulse/pulseHelpers.js';
import { advanceInformationStatecraft } from '../../src/domain/worldPulse/informationStatecraft.js';
import { GOVERNING_SEAT_KEY, reconcileBelief } from '../../src/domain/worldPulse/beliefMap.js';
import { standingPlantsAgainst } from '../../src/domain/briefs/composers.js';
import { WHAT_PHRASES, whatPhrase } from '../../src/domain/display/settlementRumors.js';
import { SECTION_OF, HERALD_SECTIONS } from '../../src/domain/realm/heraldRouting.js';
import { SIGNIFICANCE_CLASSES } from '../../src/domain/worldPulse/bandFamilies.js';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NOW = '2026-01-01T00:00:00.000Z';

const MARKET = Object.freeze({
  name: 'Whisper market', tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
});
const FACTIONS = Object.freeze([
  { name: 'The Grey Council', category: 'government', power: 60, isGoverning: true },
  { name: 'Ashwater Syndicate', category: 'criminal', power: 40 },
  { name: 'Coin Guild', category: 'merchant', power: 30 },
]);

/** @param {string} id @param {readonly unknown[]} institutions */
function itemOf(id, institutions) {
  return {
    id,
    settlement: {
      name: id, tier: 'city', institutions: [...institutions],
      factions: FACTIONS.map((f) => ({ ...f })),
      powerStructure: { factions: FACTIONS.map((f) => ({ ...f })) },
    },
  };
}
const A = itemOf('aaa', [MARKET]);
const B = { id: 'bbb', settlement: { name: 'bbb', institutions: [] } };
const C = { id: 'ccc', settlement: { name: 'ccc', institutions: [] } };

const LIT_RULES = Object.freeze({
  infoMode: 'unreliable', infoStatecraftEnabled: true, informationBrokeragesEnabled: true,
});
/** Statecraft lit, the BROKERAGE flag absent — the dark half of IN-0a's gate composition. */
const DARK_RULES = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true });
/** The ONE_REGEN preset override spread, which ships LIT in real configs (arch §1b R3). */
const ONE_REGEN_SPREAD = Object.freeze({
  distancePricedNewsEnabled: true, reframeEnabled: true, provenanceLedgerEnabled: true,
  urbanFabricEnabled: true, npcGrowthEnabled: true, spatialConsequenceEnabled: true,
  npcLadderEnabled: true, traditionsEnabled: true, roadsEnabled: true,
});

/** @param {number} band @param {string} label */
const belief = (band, label) => ({
  readiness: 0.1, strengthBand: band, allianceLabel: label,
  faithLabel: 'secular', confidence01: 0.2, lastUpdateTick: 0,
});

/** @param {Record<string, unknown>} rules @param {Record<string, unknown>} [cccBelief] */
function worldOf(rules, cccBelief = belief(2, 'neutral')) {
  return {
    tick: 0, spatialCanonVersion: 1, simulationRules: { ...rules }, relationshipStates: {},
    factionStates: Object.fromEntries(
      ['the_grey_council', 'ashwater_syndicate', 'coin_guild'].map((n) => [`aaa:${n}`, {
        factionId: `aaa:${n}`, settlementId: 'aaa', name: n,
        archetype: 'criminal', momentum: 0.9, exhaustion: 0.1, controlledInstitutions: [],
      }]),
    ),
    spatialLedgers: {
      beliefMaps: {
        aaa: { [GOVERNING_SEAT_KEY]: { bbb: belief(2, 'hostile') } },
        ccc: { [GOVERNING_SEAT_KEY]: { bbb: { ...cccBelief } } },
      },
    },
  };
}
const snapshotOf = (rules, cccBelief) => ({
  settlements: [A, B, C],
  byId: new Map([['aaa', A], ['bbb', B], ['ccc', C]]),
  worldState: worldOf(rules, cccBelief),
  regionalGraph: { edges: [{ from: 'aaa', to: 'bbb', type: 'hostile', relationshipType: 'hostile' }] },
});

/** STAGE 1 — the REAL rotation producer. Returns the first tick that mints a plant. */
function produceRealPlantCandidate(rules, cccBelief) {
  for (let tick = 0; tick < 12; tick += 1) {
    for (const candidate of evaluateBrokerageServiceRules(snapshotOf(rules, cccBelief), null, { tick })) {
      if (candidate.candidateType === BROKERAGE_PLANT_CANDIDATE_TYPE) return { candidate, tick };
    }
  }
  return { candidate: null, tick: null };
}

/** STAGE 2 — the REAL apply lane, then the REAL pulse-history compactor. */
function appliedPulseRecord(candidate, tick, rules, cccBelief) {
  const applied = applyWorldPulseOutcomes({
    snapshot: snapshotOf(rules, cccBelief),
    worldState: { ...worldOf(rules, cccBelief), tick },
    regionalGraph: { edges: [] },
    wizardNews: { currentTick: tick, entries: [] },
    settlementMap: new Map(),
    outcomes: [candidate],
    tick,
    now: NOW,
    simulationRules: rules,
  });
  const row = applied.autoApplied.find((o) => o.candidateType === BROKERAGE_PLANT_CANDIDATE_TYPE);
  return { applied, record: { tick, selectedOutcomes: [compactOutcomeForHistory(row)] } };
}

/** STAGE 3 — the REAL fold, a week later, through the head's own consume read. */
function foldNextTick(rules, pulseRecord, tick, cccBelief) {
  const world = { ...worldOf(rules, cccBelief), tick: tick + 1, pulseHistory: [pulseRecord] };
  return advanceInformationStatecraft({
    snapshot: snapshotOf(rules, cccBelief),
    worldState: world,
    graph: { edges: [] },
    rng: null,
    tick: tick + 1,
    now: NOW,
    strengthOf: () => 0.4,
    alignmentOf: () => ({ malice01: 0, lawfulness01: 1 }),
    nameFor: (/** @type {string} */ id) => id,
  });
}

/** The whole road, one call. */
function driveHandoff(rules, cccBelief) {
  const { candidate, tick } = produceRealPlantCandidate(rules, cccBelief);
  if (!candidate) return { candidate: null, tick: null, record: null, folded: null };
  const { record } = appliedPulseRecord(candidate, tick, rules, cccBelief);
  return { candidate, tick, record, folded: foldNextTick(rules, record, tick, cccBelief) };
}

const disinfoOf = (result) => (result?.worldState?.spatialLedgers?.disinfo) || {};

describe('IN-0a — the three-stage writer/reader road', () => {
  test('a REAL commission travels producer -> apply lane -> pulse record -> the REAL fold', () => {
    const { candidate, tick, record, folded } = driveHandoff(LIT_RULES);

    // STAGE 1 — the producer really produced one, and the envelope is really in it.
    expect(candidate).toBeTruthy();
    expect(BROKERAGE_ACTS).toContain(BROKERAGE_PLANT_CANDIDATE_TYPE);
    expect(candidate.metadata.plant.receipt.commissionedAtTick).toBe(tick);

    // STAGE 2 — the apply lane and the history compactor both kept it.
    const carriedRow = record.selectedOutcomes[0];
    expect(carriedRow.candidateType).toBe(BROKERAGE_PLANT_CANDIDATE_TYPE);
    expect(JSON.stringify(carriedRow.metadata.plant))
      .toBe(JSON.stringify(candidate.metadata.plant));

    // STAGE 3 — the fold. The head read the record itself; nothing was handed to it.
    const keys = Object.keys(disinfoOf(folded));
    expect(keys).toEqual([`plant:aaa:ccc:bbb`]);
    const folded0 = disinfoOf(folded)[keys[0]];

    // THE WEEK THAT PASSED IS VISIBLE IN THE RECORD, which is the whole reason the carry
    // re-stamps the seed side and never the receipt: paid then, told now.
    expect(folded0.seededTick).toBe(tick + PLANT_HANDOFF_LAG_TICKS);
    expect(folded0.commission.receipt.commissionedAtTick).toBe(tick);
    expect(folded0.lineageId).toBe(`disinfo:aaa:ccc:${tick + PLANT_HANDOFF_LAG_TICKS}`);

    // And the belief it bought actually landed in the mark's seat at the asserted band.
    const seat = folded.worldState.spatialLedgers.beliefMaps.ccc[GOVERNING_SEAT_KEY];
    expect(seat.bbb.strengthBand).toBe(folded0.assertedBand);
    expect(seat.bbb.lastUpdateTick).toBe(tick + PLANT_HANDOFF_LAG_TICKS);
  });

  test('THE HANDOFF MUTANT — sever the collection and the fold pin REDS', () => {
    const { record, tick } = driveHandoff(LIT_RULES);
    // The mutant: the pulse record still holds the applied act, but its envelope is gone —
    // exactly what a severed `metadata.plant` read would leave behind. If the fold still
    // produced a ledger key here, the pin above would be proving something else.
    const severed = {
      tick: record.tick,
      selectedOutcomes: [{ ...record.selectedOutcomes[0], metadata: { settlementId: 'aaa' } }],
    };
    expect(Object.keys(disinfoOf(foldNextTick(LIT_RULES, severed, tick)))).toEqual([]);
    // The positive control on the SAME mutant shape: restore the envelope, get the key back.
    expect(Object.keys(disinfoOf(foldNextTick(LIT_RULES, record, tick)))).toEqual(['plant:aaa:ccc:bbb']);
  });

  test('THE CONSUME-ONCE DOUBLE GUARD — one tick of carriage, never two, never zero', () => {
    const { record, tick } = driveHandoff(LIT_RULES);
    const worldAt = (/** @type {number} */ at) => ({
      ...worldOf(LIT_RULES), tick: at, pulseHistory: [record],
    });
    // The tick it applied on: not travelled yet.
    expect(appliedPlantEnvelopesAt(worldAt(tick), tick)).toEqual([]);
    // Exactly one week later: carried.
    expect(appliedPlantEnvelopesAt(worldAt(tick + 1), tick + 1)).toHaveLength(1);
    // Two weeks later: dropped, never re-carried (the D-3 exact-age idiom, not a lower bound).
    expect(appliedPlantEnvelopesAt(worldAt(tick + 2), tick + 2)).toEqual([]);
  });

  test('the carry is codepoint-ordered, deduped, and drops a stale target', () => {
    const { record, tick } = driveHandoff(LIT_RULES);
    const envelope = record.selectedOutcomes[0].metadata.plant;
    const doubled = {
      tick: record.tick,
      selectedOutcomes: [
        record.selectedOutcomes[0],
        // The same commission twice, the second wearing a target from a tick since past.
        {
          ...record.selectedOutcomes[0],
          metadata: {
            ...record.selectedOutcomes[0].metadata,
            plant: { ...envelope, target: { kind: 'envoy_picture' } },
          },
        },
      ],
    };
    const carried = appliedPlantEnvelopesAt(
      { ...worldOf(LIT_RULES), tick: tick + 1, pulseHistory: [doubled] }, tick + 1,
    );
    expect(carried).toHaveLength(1);
    expect(Object.keys(carried[0]).sort()).toEqual(['key', 'override', 'receipt', 'record']);
  });
});

describe('IN-0a — the counterforces, on seeded ground', () => {
  test('THE CORROBORATED MARK — good sourcing kills the bought lie, and charges the seller', () => {
    // ⚠ DOC-VS-CODE, MEASURED AND REPORTED, NOT SILENTLY RECONCILED. Both
    // docs/DESIGN_FP_INFORMATION.md §5 IN-0a and the arch doc say the corroborated mark's
    // plant "DIES AT THE FOLD". The BUILT writer has no such arm: `processLies` section (2)
    // folds a validated envelope unconditionally, and the contradiction comparator is
    // section (1), which runs on the NEXT pass. So the resistance is real and the drama is
    // intact — it is ONE TICK LATER than the sentence claims. Live code outranks the table;
    // the divergence is escalated in the wave's ledger row rather than patched away here,
    // and this pin measures what the estate actually does.
    const { folded, tick, record } = driveHandoff(LIT_RULES, belief(0, 'neutral'));
    expect(record.selectedOutcomes.length).toBe(1);   // the state under test was NOT empty
    const asserted = record.selectedOutcomes[0].metadata.plant.record.assertedBand;
    expect(asserted).toBe(record.selectedOutcomes[0].metadata.plant.record.trueBand + 2);
    const seeded = disinfoOf(folded);
    expect(Object.keys(seeded)).toEqual(['plant:aaa:ccc:bbb']);   // SEEDED, size 1

    // The mark's own corroborated sources re-anchor its reckoning back off the assertion —
    // the belief advance a real pulse runs before this mover. Now the lie meets them.
    const world = {
      ...folded.worldState,
      tick: tick + 2,
      spatialLedgers: {
        ...folded.worldState.spatialLedgers,
        beliefMaps: {
          ...folded.worldState.spatialLedgers.beliefMaps,
          ccc: { [GOVERNING_SEAT_KEY]: { bbb: belief(0, 'neutral') } },
        },
      },
    };
    const answered = advanceInformationStatecraft({
      snapshot: snapshotOf(LIT_RULES), worldState: world, graph: { edges: [] }, rng: null,
      tick: tick + 2, now: NOW, strengthOf: () => 0.4,
      alignmentOf: () => ({ malice01: 0, lawfulness01: 1 }), nameFor: (id) => id,
    });
    // It is gone from the ledger, and the seller wore it: the exposure beat fired and it
    // NAMES THE MARKET, which is the reason the commission rides in the record at all.
    expect(Object.keys(disinfoOf(answered))).toEqual([]);
    const exposed = answered.newsEntries.filter((e) => e.kind === 'infowar_lie_exposed');
    expect(exposed).toHaveLength(1);
    expect(exposed[0].reasons.some((r) => r.includes('Whisper market'))).toBe(true);

    // THE ANCHOR that stops the disappearance above reading as "plants never survive":
    // a mark whose reckoning sits ON the planted band keeps carrying it another week.
    const held = advanceInformationStatecraft({
      snapshot: snapshotOf(LIT_RULES), worldState: { ...folded.worldState, tick: tick + 2 },
      graph: { edges: [] }, rng: null, tick: tick + 2, now: NOW, strengthOf: () => 0.4,
      alignmentOf: () => ({ malice01: 0, lawfulness01: 1 }), nameFor: (id) => id,
    });
    expect(Object.keys(disinfoOf(held))).toEqual(['plant:aaa:ccc:bbb']);
  });

  test('THE SPENT MARKET — a discredited seller is believed strictly less, and yet freshness still bites', () => {
    // WEIGHT_FLOOR is 0.35: a spent name is a DISCOUNT, not silence. Both halves are pinned
    // here because pinning only the first reads as "a discredited market cannot lie", which
    // is not the physics and would quietly delete the drama.
    const reportOf = (/** @type {number} */ hop, /** @type {number} */ age, /** @type {string} */ from) => ({
      sourceId: from, hopCount: hop, ageTicks: age, independentSources: 1,
      completeness01: 1, accuracy01: 1, score: 60, sortKey: `t:${from}`,
    });
    const prior = { readiness: 0.3, strengthBand: 1, allianceLabel: 'neutral', confidence01: 0.5, lastUpdateTick: 0 };
    const truth = { readiness: 0.3, strengthBand: 4, allianceLabel: 'neutral', confidence01: 1, lastUpdateTick: 10 };
    const heardFrom = (/** @type {number} */ weight) => reconcileBelief({
      prior, groundTruth: truth, reports: [reportOf(0, 0, 'market')], now: 10,
      credibilityOf: () => weight,
    });
    const trusted = heardFrom(1.15);
    const spent = heardFrom(0.35);
    // STRICTLY LESS movement toward the telling from a market whose name is spent...
    expect(spent.strengthBand).toBeLessThan(trusted.strengthBand);
    // ...and yet the telling still MOVED the court. WEIGHT_FLOOR 0.35 is a discount, not
    // silence: pinning only the first half would read as "a discredited market cannot lie".
    expect(spent.strengthBand).toBeGreaterThan(prior.strengthBand);

    // THE SIBLING: a FRESH, low-hop telling from the discredited market still outweighs a
    // STALE, high-hop honest one. The asymmetry is the drama, not a bug.
    const freshLie = reportOf(0, 0, 'burnt');
    const staleTruth = reportOf(4, 9, 'honest');
    const contested = reconcileBelief({
      prior, groundTruth: truth, reports: [freshLie, staleTruth], now: 10,
      credibilityOf: (/** @type {string} */ id) => (id === 'burnt' ? 0.35 : 1.0),
    });
    const staleOnly = reconcileBelief({
      prior, groundTruth: truth, reports: [staleTruth], now: 10, credibilityOf: () => 1.0,
    });
    expect(contested.confidence01).toBeGreaterThan(staleOnly.confidence01);
  });
});

describe('IN-0a — the take, and the market named at the collapse', () => {
  test('plant_took mints ONE-SHOT for a bought story still standing a week on', () => {
    const { record, tick } = driveHandoff(LIT_RULES);
    const envelope = record.selectedOutcomes[0].metadata.plant;
    const folded = commissionedPlantAt({
      ...envelope,
      record: {
        ...envelope.record,
        seededTick: tick + 1,
        lineageId: `disinfo:aaa:ccc:${tick + 1}`,
      },
      override: { ...envelope.override, lastUpdateTick: tick + 1 },
    }, tick + 1);
    expect(folded).toBeTruthy();
    const asserted = folded.record.assertedBand;
    const at = (/** @type {number} */ t, /** @type {number} */ band) => plantTookEntry({
      record: folded.record, currentBand: band, tick: t, nameFor: (id) => id,
    });
    // The one tick it fires: a week old, and the mark's reckoning is the asserted band.
    expect(at(tick + 2, asserted)).toBeTruthy();
    expect(at(tick + 2, asserted).kind).toBe(PLANT_TOOK_KIND);
    expect(at(tick + 2, asserted).significance).toBe('routine');
    // The negatives, each moving exactly one thing: too early, too late, never crossed.
    expect(at(tick + 1, asserted)).toBeNull();
    expect(at(tick + 3, asserted)).toBeNull();
    expect(at(tick + 2, asserted - 2)).toBeNull();
    // And a court's OWN bluff — same shape, no commission — is silent.
    const ownBluff = { ...folded.record };
    delete ownBluff.commission;
    expect(plantTookEntry({ record: ownBluff, currentBand: asserted, tick: tick + 2, nameFor: (id) => id }))
      .toBeNull();
  });

  test('the exposure beat NAMES THE MARKET for a bought lie and is silent for a court\'s own', () => {
    const { record, tick } = driveHandoff(LIT_RULES);
    const envelope = record.selectedOutcomes[0].metadata.plant;
    const folded = commissionedPlantAt({
      ...envelope,
      record: { ...envelope.record, seededTick: tick + 1, lineageId: `disinfo:aaa:ccc:${tick + 1}` },
      override: { ...envelope.override, lastUpdateTick: tick + 1 },
    }, tick + 1);
    const lines = plantExposureReasons(folded.record, (/** @type {string} */ id) => id);
    expect(lines.length).toBe(2);
    expect(lines[0]).toContain('Whisper market');
    expect(lines[1]).toContain(envelope.receipt.patronId);
    // A court's own bluff adds NOTHING, so the built beat is byte-identical for it.
    const ownBluff = { ...folded.record };
    delete ownBluff.commission;
    expect(plantExposureReasons(ownBluff, (id) => id)).toEqual([]);
    expect(plantExposureReasons(null, null)).toEqual([]);
  });
});

describe('IN-0a — both validator doors, one at a time', () => {
  /** @param {number} seeded @param {number} commissioned */
  function envelopeWithLag(seeded, commissioned) {
    const { record, tick } = driveHandoff(LIT_RULES);
    const envelope = record.selectedOutcomes[0].metadata.plant;
    void tick;
    return {
      ...envelope,
      record: { ...envelope.record, seededTick: seeded, lineageId: `disinfo:aaa:ccc:${seeded}` },
      override: { ...envelope.override, lastUpdateTick: seeded },
      receipt: { ...envelope.receipt, commissionedAtTick: commissioned },
    };
  }

  test('DOOR ONE — commissionedPlantAt accepts exactly the transport window', () => {
    expect(commissionedPlantAt(envelopeWithLag(9, 9), 9)).toBeTruthy();        // same tick
    expect(commissionedPlantAt(envelopeWithLag(9, 8), 9)).toBeTruthy();        // one week
    expect(commissionedPlantAt(envelopeWithLag(9, 7), 9)).toBeNull();          // two: stale
    expect(commissionedPlantAt(envelopeWithLag(9, 10), 9)).toBeNull();         // paid AFTER told
    // The FRESHNESS law is untouched and still the strongest guard here.
    expect(commissionedPlantAt(envelopeWithLag(9, 8), 10)).toBeNull();
  });

  test('DOOR TWO — attachEnvoyPictureTarget\'s twin guard holds the SAME window', () => {
    // Two guards over one job can only be proven JOINTLY: this door never runs the first
    // one, so an amendment to one and not the other would target what can never fold.
    const target = (/** @type {Record<string, unknown>} */ env) => ({
      kind: 'envoy_picture', errandId: 'e1', npcId: 'n1', pictureId: 'p1', episodeKey: 'k1',
      subjectId: 'bbb', field: 'strengthBand',
      direction: env.receipt.intent === 'inflate' ? 'rise' : 'fall',
      commissionerId: env.receipt.patronId, purpose: 'intercepted_envoy_appraisal',
    });
    const same = envelopeWithLag(9, 9);
    const lagged = envelopeWithLag(9, 8);
    const stale = envelopeWithLag(9, 7);
    expect(attachEnvoyPictureTarget(same, target(same))).toBeTruthy();
    expect(attachEnvoyPictureTarget(lagged, target(lagged))).toBeTruthy();
    expect(attachEnvoyPictureTarget(stale, target(stale))).toBeNull();
  });
});

describe('IN-0a — dormancy', () => {
  test('the BROKERAGE flag dark: no carry, no fold, and the world is byte-identical', () => {
    // The record is built LIT (a world that once had a market), then read by a DARK world —
    // so the fence tests the GATE, not the absence of data. An absent-data fence is vacuous.
    const { record, tick } = driveHandoff(LIT_RULES);
    expect(record).toBeTruthy();
    const darkWorld = { ...worldOf(DARK_RULES), tick: tick + 1, pulseHistory: [record] };
    expect(appliedPlantEnvelopesAt(darkWorld, tick + 1)).toEqual([]);

    const before = JSON.stringify(darkWorld);
    const folded = foldNextTick(DARK_RULES, record, tick);
    expect(Object.keys(disinfoOf(folded))).toEqual([]);
    expect(folded.newsEntries).toEqual([]);
    expect(JSON.stringify(darkWorld)).toBe(before);

    // THE LIT-MUTANT CONTROL: the identical record under the identical world, one flag added.
    expect(appliedPlantEnvelopesAt({ ...darkWorld, simulationRules: { ...LIT_RULES } }, tick + 1))
      .toHaveLength(1);
  });

  test('dark under the ONE_REGEN preset spread too (the reachable-lit config)', () => {
    const { record, tick } = driveHandoff(LIT_RULES);
    const oneRegenDark = {
      ...worldOf({ ...DARK_RULES, ...ONE_REGEN_SPREAD }), tick: tick + 1, pulseHistory: [record],
    };
    expect(appliedPlantEnvelopesAt(oneRegenDark, tick + 1)).toEqual([]);
    expect(appliedPlantEnvelopesAt(
      { ...oneRegenDark, simulationRules: { ...LIT_RULES, ...ONE_REGEN_SPREAD } }, tick + 1,
    )).toHaveLength(1);
  });

  test('an omniscient world never carries (the gate composition, not just the flag)', () => {
    const { record, tick } = driveHandoff(LIT_RULES);
    const omniscient = {
      ...worldOf({ ...LIT_RULES, infoMode: 'omniscient' }), tick: tick + 1, pulseHistory: [record],
    };
    expect(appliedPlantEnvelopesAt(omniscient, tick + 1)).toEqual([]);
  });
});

describe('IN-0a — the dossier mount and its audience', () => {
  test('the DM town page carries the standing plants; the player projection is EMPTY', () => {
    const { folded } = driveHandoff(LIT_RULES);
    const world = folded.worldState;
    const dm = standingPlantsAgainst(world, 'bbb', 'dm', 3);
    expect(dm).toHaveLength(1);        // the town LIED ABOUT finds the lie on its own page
    expect(standingPlantsAgainst(world, 'ccc', 'dm', 3)).toHaveLength(1);  // and the mark's court
    expect(standingPlantsAgainst(world, 'zzz', 'dm', 3)).toEqual([]);      // and nobody else's

    // THE AUDIENCE LAW: a live plant is invisible to a player. Not redacted — absent.
    expect(standingPlantsAgainst(world, 'bbb', 'player', 3)).toEqual([]);
    expect(standingPlantsAgainst(world, 'ccc', 'player', 3)).toEqual([]);

    // The anchor that keeps the two assertions above from both passing vacuously: once the
    // lie has collapsed (aged past its shelf life) the player projection DOES carry it.
    expect(standingPlantsAgainst(world, 'bbb', 'player', 400)).toHaveLength(1);
  });

  test('SOURCE SCAN — every projectPlants call site names its audience explicitly', () => {
    // `projectPlants` is fail-OPEN on its default (J-INF-17, deliberately not flipped), so
    // an omitted parameter is a silent DM-truth leak rather than an error. This scan is the
    // enforcement; the guard-the-guard control below proves the scan can actually bite.
    /** @type {string[]} */
    const files = [];
    (function walk(/** @type {string} */ dir) {
      for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.(js|jsx)$/.test(entry)) files.push(full);
      }
    })(join(ROOT, 'src'));

    /** @type {string[]} */
    const offenders = [];
    let callSites = 0;
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const line of text.split('\n')) {
        if (!/\bprojectPlants\s*\(/.test(line)) continue;
        if (/export function projectPlants/.test(line)) continue;
        callSites += 1;
        // The call may pass its options on the SAME line or open an object that names
        // `audience` within the next few; read the tail of the file from the call instead.
        const from = text.indexOf(line);
        if (!/audience/.test(text.slice(from, from + 400))) offenders.push(`${relative(ROOT, file)}: ${line.trim()}`);
      }
    }
    expect(callSites).toBeGreaterThan(0);   // the scan found something to judge
    expect(offenders).toEqual([]);
    // GUARD THE GUARD: the same predicate against a call that omits the parameter.
    const omitted = 'const rows = projectPlants(records);';
    expect(/\bprojectPlants\s*\(/.test(omitted) && !/audience/.test(omitted)).toBe(true);
  });
});

describe('IN-0a — lifecycle and registration', () => {
  test('a folded record JSON-round-trips and survives a ledger rebuild unchanged', () => {
    const { folded } = driveHandoff(LIT_RULES);
    const ledger = disinfoOf(folded);
    const roundTripped = JSON.parse(JSON.stringify(ledger));
    expect(roundTripped).toEqual(ledger);
    // THE PROMISE's regen clause: a rebuild that re-derives spatialLedgers from the
    // persisted world must not ghost a live plant's DM-truth trace. Rebuilt here through the
    // same serialize/restore path a regen uses, key for key and byte for byte.
    const rebuilt = JSON.parse(JSON.stringify({ ...folded.worldState })).spatialLedgers.disinfo;
    expect(JSON.stringify(rebuilt)).toBe(JSON.stringify(ledger));
    expect(Object.keys(rebuilt)[0].startsWith('plant:')).toBe(true);
    expect(rebuilt[Object.keys(rebuilt)[0]].commission.receipt.marketName).toBe('Whisper market');
  });

  test('REGISTRATION COMPLETE for plant_took — phrased, routed, classed, and earned', () => {
    // WHAT_PHRASES: a townsperson must not say the raw slug.
    expect(WHAT_PHRASES[PLANT_TOOK_KIND]).toBeTruthy();
    expect(whatPhrase(PLANT_TOOK_KIND)).toBe(WHAT_PHRASES[PLANT_TOOK_KIND]);
    expect(whatPhrase(PLANT_TOOK_KIND)).not.toContain('_');
    // heraldRouting: an EXPLICIT desk of the frozen vocabulary, filed with its own siblings.
    // Asserting membership alone would pass on the catch-all, i.e. on no registration at all.
    expect(HERALD_SECTIONS).toContain(SECTION_OF(PLANT_TOOK_KIND));
    expect(SECTION_OF(PLANT_TOOK_KIND)).toBe(SECTION_OF('infowar_lie_exposed'));
    expect(SECTION_OF(PLANT_TOOK_KIND)).not.toBe(SECTION_OF('a_kind_nobody_registered'));
    // SP-6a: a CLASS ASSIGNMENT into the spine's significance family, never a minted scale.
    const entry = plantTookEntry({
      record: {
        liarId: 'aaa', audienceId: 'ccc', subjectId: 'bbb', assertedBand: 4, seededTick: 5,
        commission: { receipt: { marketName: 'Whisper market', patronId: 'p', hostId: 'aaa' } },
      },
      currentBand: 4, tick: 6, nameFor: (id) => id,
    });
    expect(SIGNIFICANCE_CLASSES).toContain(entry.significance);
    // THE CONTAMINATION LAW: it must classify `knowledge` on its OWN vocabulary, not through
    // the bare `news` token in a wizard-news id. The id below deliberately carries no `news`.
    expect(moverFamilyOf({ kind: PLANT_TOOK_KIND, id: `x.6.${PLANT_TOOK_KIND}.aaa.ccc` }))
      .toBe('knowledge');
    // The control that keeps the assertion honest: an unregistered sibling earns nothing.
    expect(moverFamilyOf({ kind: 'quarry_took', id: 'x.6.quarry_took.aaa.ccc' })).not.toBe('knowledge');
  });
});
