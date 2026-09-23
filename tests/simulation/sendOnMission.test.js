/**
 * sendOnMission.test.js — EM-E7 acceptance cases E7-1 to E7-14 (wave 3; design §15, §17 and
 * §19 ruling 8; the chair's judgments 265 and 270).
 *
 * THE CLAIM, IN ONE BREATH. "Send on a mission" is a DIRECTION over `MISSION_KINDS`, not a
 * pin: a DM names the mission and the subject, the estate's own casting and deliberation
 * procedure resolves it at the tick, and every door that already refuses an endogenous
 * mission refuses a directed one in the same word. The CATCH is the pin — one registered
 * fork, `stayDetectionRoll` (HBF-05) — and it is consulted in `chooseOrPinFork`'s shape with
 * the fork's own two words. No `NpcStatus` value is minted for any of it: the errand record
 * carries where the traveller is standing, and `pardon` — already built — is §15's return
 * from exile.
 *
 * ⭐ THE VOCABULARIES ARE READ FROM THE MODULES THAT OWN THEM, NEVER TRANSCRIBED. Every
 * mission kind below comes from `MISSION_KINDS`, every covert facet from
 * `COVERT_MISSION_VOCABULARY`, and both catch words from `STAY_DETECTION_OUTCOMES`. A suite
 * that spelled them would pass on a vocabulary that had moved underneath it, which is the
 * failure design §19 ruling 1 exists to prevent (FINITE-SEMANTICS).
 *
 * ⛔ WHAT THIS SUITE DOES NOT CLAIM, STATED SO NOBODY READS IT AS COVERAGE.
 *   • The SITE CONSULT is not wired here, and that is MEASURED rather than skipped (case
 *     E7-6 proves the composition end to end instead). `chooseOrPinFork` lives in
 *     `src/domain/edit/directives.js`; `espionageGauntlet.js` sits inside the pulse worker's
 *     closure through `envoyPulse.js`, so importing the consult would pull the director's
 *     leaf and the decree registry into that closure for a three-line read, and a byte rise
 *     is the owner's. EM-E4 recorded the identical refusal for `decreeHook.js` one member
 *     earlier. The stage takes the WORD the consult yields; the one line that yields it is
 *     the fork-site member's.
 *   • `missionDispatcher.js` and `operationGrammar.js` are DARK by their own suites' pins
 *     (zero `src/` importers, and one respectively), so nothing here wires a production
 *     caller; the direction verbs are read exactly as those suites read the module.
 *   • HBF-05's registry ROW still carries `actionVocabulary: null`. Case E7-10 pins that on
 *     purpose: the row is EM-E0's file, and ruling 1's own order is that the vocabulary must
 *     be an EXPORT before a row may name it. This member lands the export.
 *
 * ⚠ ONE FIXTURE IS COPIED RATHER THAN SHARED, and it is named: the covert errand built in
 * `seeded()` is the fixture of `tests/property/espionageGauntletDormancyFence.test.js`,
 * whose own FENCE 3 measures that it is really dwelling at tick 13. Copying it keeps this
 * suite's proof independent of a helper another member owns; the two are expected to agree
 * and case E7-9 re-measures the dwell from this file's own run.
 *
 * Proof shape copied from `tests/simulation/pinFork.test.js` (EM-E4): straight-line literal
 * `it`s under ONE literal `describe`, its own `vitest` import.
 *
 * @enforced-by this test
 */
import { describe, expect, it } from 'vitest';

import {
  COVERT_MISSION_VOCABULARY,
  castCovertOperative,
  covertMissionFacetsOf,
} from '../../src/domain/worldPulse/espionage/espionageMissions.js';
import {
  STAY_DETECTION_FORK_ID,
  STAY_DETECTION_OUTCOMES,
  advanceEspionageGauntlet,
  covertDwellRead,
  stayDetectionRoll,
} from '../../src/domain/worldPulse/espionage/espionageGauntlet.js';
import {
  DISPATCH_CAP_PER_PRINCIPAL_PER_TICK,
  SEND_ON_MISSION_TYPE,
  directedMissionDemands,
  dispatchDirectedMissions,
  sendOnMissionOf,
} from '../../src/domain/worldPulse/operations/missionDispatcher.js';
import {
  DISPATCHABLE_MISSION_KINDS,
  MISSION_KINDS,
} from '../../src/domain/worldPulse/operations/operationGrammar.js';
import { chooseOrPinFork, forkPinsFor } from '../../src/domain/edit/directives.js';
import { HABIT_FORK_REGISTRY } from '../../src/domain/worldPulse/habitForkRegistry.js';
import { NPC_STATUS_VALUES } from '../../src/domain/entities/npcs.js';
import { DM_VERBS, pardonNpc } from '../../src/domain/worldPulse/npcDmVerbs.js';
import { addExclusionEdge, graduateNpc, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import {
  ENVOY_REQUIRED_RULES,
  envoyErrandsOf,
  mintEnvoyErrand,
  normalizeEnvoyPeaceOffer,
} from '../../src/domain/worldPulse/envoyErrand.js';

// ── THE DIRECTION FIXTURES ───────────────────────────────────────────────────────────────

/** One `send-on-mission` op, in the shape a registry entry carries it. */
function direction(kind, subjectId) {
  return { op: { type: SEND_ON_MISSION_TYPE, payload: { kind, subjectId } } };
}

/** The dispatch arguments a lit court supplies, with the deliberation road able to run. */
const COURT = Object.freeze({
  principalId: 'court.ashford',
  tick: 13,
  targeting: 'all_courts',
  frequency01: 0.5,
  castable: true,
  openOperations: [],
});

// ── THE ESPIONAGE FIXTURE (see the header's copied-fixture note) ─────────────────────────

const WAR_RULES = Object.freeze(Object.fromEntries(ENVOY_REQUIRED_RULES.map((k) => [k, true])));

function world(rules = {}) {
  return {
    tick: 10,
    spatialCanonVersion: 1,
    simulationRules: {
      ...WAR_RULES, infoMode: 'unreliable', errandSpineEnabled: true, ...rules,
    },
    relationshipStates: { untouched: { relationshipType: 'hostile' } },
  };
}

const SNAPSHOT_BANDS = Object.freeze({
  storesBand: 'thin',
  strengthBand: 'ready',
  moraleExhaustionBand: 'present',
  foundingCauseStatus: 'live',
  believedRatioBand: 'matched',
});

function peaceOffer(from = 'ashford', to = 'irontown') {
  const relationshipKey = `${from}::${to}`;
  return {
    id: 'peace.offer.1',
    generatedAtTick: 10,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleId: 'settlement_strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: from,
    severity: 0.91,
    reasons: ['Engine prose does not ride with the envoy.'],
    relationshipKey,
    relationshipPatch: {
      proposedRelationshipType: 'neutral', trajectory: 'transitioning', privateScalar: 0.75,
    },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey,
      fromType: 'hostile',
      toType: 'neutral',
      peaceOffer: true,
      offererId: from,
      targetId: to,
      peaceFrontOwnerId: from,
      peaceFrontSinceTick: 4,
      reason: 'Engine prose is deliberately excluded.',
    },
  };
}

function acceptedRuling(outcome) {
  const offer = normalizeEnvoyPeaceOffer(outcome);
  const { offererId, targetId } = offer.proposalPayload;
  return {
    accepted: true,
    offererId,
    targetId,
    receipt: {
      id: `decision.${offererId}.${targetId}`,
      kind: 'war_peace_acceptance_read',
      tick: 10,
      offerId: offer.id,
      offererId,
      targetId,
      decision: 'accept',
      actualAction: 'peace',
      decidingTerm: 'cost_to_continue',
      bands: {
        cause: 'present', cost_to_continue: 'pressing', cost_to_stop: 'present', momentum: 'quiet',
      },
      reason: 'Both courts accept the carried peace.',
    },
    offererRead: {
      id: `termination.${offererId}.${targetId}`,
      kind: 'war_termination_read',
      tick: 10,
      attackerId: offererId,
      targetId,
      settlementIds: [offererId, targetId],
      booksDirection: 'peace',
      booksInterest: 'realm',
    },
    termination: {
      receipt: {
        id: `termination.${targetId}.${offererId}`,
        kind: 'war_termination_read',
        tick: 10,
        attackerId: targetId,
        targetId: offererId,
        settlementIds: [targetId, offererId],
        booksDirection: 'peace',
        booksInterest: 'realm',
      },
    },
    inheritedDemand: null,
    coalitionPeaceExpenditures: [],
  };
}

const SNAPSHOT = Object.freeze({
  settlements: [
    {
      id: 'ashford', name: 'Ashford', crimeRate: 'moderate', safety: 'guarded', wealth: 'moderate', population: 4000,
    },
    {
      id: 'westmarch',
      name: 'Westmarch',
      crimeRate: 'rampant',
      safety: 'lawless',
      wealth: 'poor',
      population: 2500,
      activeConditions: [{ id: 'c1' }, { id: 'c2' }],
    },
  ],
});
const GRAPH = Object.freeze({
  edges: [{ from: 'ashford', to: 'westmarch', relationshipType: 'hostile' }],
});

function seeded(rules) {
  const outcome = peaceOffer();
  return mintEnvoyErrand({
    worldState: world(rules),
    outcome,
    acceptance: acceptedRuling(outcome),
    npcId: 'npc.reeve',
    npcName: 'Reeve Mara',
    snapshot: SNAPSHOT_BANDS,
    purpose: 'sue',
    purposeClass: 'covert',
    covert: {
      demand: 'confirm',
      product: 'confirm',
      subjectId: 'irontown',
      itinerary: [
        { face: 'covert', settlementId: 'westmarch', stayTicks: 2 },
        { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
      ],
    },
    routePlan: {
      legs: [
        { fromId: 'ashford', toId: 'westmarch', departTick: 10, arrivalTick: 12 },
        { fromId: 'westmarch', toId: 'irontown', departTick: 20, arrivalTick: 22 },
      ],
      expectedReturnTick: 40,
      routeRef: { id: 'road.north', name: 'North Road' },
    },
    tick: 10,
  }).worldState;
}

/** The lit, hostile, dwelling world every catch case drives, at the tick FENCE 3 measured. */
const DWELL_TICK = 13;
function gauntlet(pinnedCatch) {
  return advanceEspionageGauntlet({
    worldState: seeded({ espionageEnabled: true }),
    tick: DWELL_TICK,
    snapshot: SNAPSHOT,
    regionalGraph: GRAPH,
    ...(pinnedCatch === undefined ? {} : { pinnedCatch }),
  });
}

/** The roll's fields that are the WORLD's own reading and may never move under a pin. */
function odds(row) {
  return { catch01: row.catch01, roll01: row.roll01, key: row.key ?? row.rollKey, ramp: row.ramp };
}

// ── THE §15 PARDON FIXTURE (copied from tests/domain/npcDmVerbs.test.js) ──────────────────

/** A live world with one graduated roamer out of Kelder, banished from it. */
function banished() {
  const g = graduateNpc({
    worldState: { simulationRules: { npcConsequencesEnabled: true }, tick: 20 },
    settlementSeed: 'seed-kelder',
    settlementId: 'sav_kelder',
    rosterIdentity: { rosterId: 'npc_3', name: 'Maera Voss', role: 'harbourmaster' },
    tick: 4,
    verdictCause: 'banished',
    reputation: { notorietyBand: 'notorious', edictMark: 'banishment_edict', scandalClass: 'venality' },
    dmTruth: { compromiseSource: 'rival_power' },
  });
  const shut = addExclusionEdge(g.worldState, g.wnpcId, {
    settlementId: 'sav_kelder', kind: 'banishment_edict', untilTick: 60,
  });
  return { worldState: shut.worldState, wnpcId: g.wnpcId };
}

describe('EM-E7 — missions: a direction over MISSION_KINDS, a pin on the catch', () => {
  it('E7-1 every mission kind the catalog carries stages as a direction, and nothing else does', () => {
    // ALL SEVEN, from the catalog itself — staging is not qualification (see E7-2).
    expect(MISSION_KINDS.length).toBeGreaterThan(0);
    for (const kind of MISSION_KINDS) {
      expect(sendOnMissionOf(direction(kind, 'irontown'))).toEqual({ kind, subjectId: 'irontown' });
    }
    // A bare op-bearing bag reads alike, so a decree and an op are one reader's input.
    expect(sendOnMissionOf({ type: SEND_ON_MISSION_TYPE, payload: { kind: MISSION_KINDS[0], subjectId: 'x' } }))
      .toEqual({ kind: MISSION_KINDS[0], subjectId: 'x' });
    // TOTAL ON GARBAGE, every refusal separately reachable and none of them a throw.
    expect(sendOnMissionOf(null)).toBe(null);
    expect(sendOnMissionOf([direction(MISSION_KINDS[0], 'x')])).toBe(null);
    expect(sendOnMissionOf({ op: { type: 'pin-fork', payload: { kind: MISSION_KINDS[0], subjectId: 'x' } } })).toBe(null);
    expect(sendOnMissionOf(direction('polish_the_silver', 'irontown'))).toBe(null);
    expect(sendOnMissionOf(direction(MISSION_KINDS[0], ''))).toBe(null);
    expect(sendOnMissionOf({ op: { type: SEND_ON_MISSION_TYPE } })).toBe(null);
  });

  it('E7-2 the tick resolves a direction through the estate own procedure, doors and words unchanged', () => {
    const out = dispatchDirectedMissions({
      ...COURT,
      directions: MISSION_KINDS.map((kind) => direction(kind, `subject.${kind}`)),
      cap: MISSION_KINDS.length,
    });
    // The qualification law's own door refuses the kinds whose receipt family the census
    // could not reach, in the door's own word — this member adds no second rule.
    const unqualified = MISSION_KINDS.filter((k) => !DISPATCHABLE_MISSION_KINDS.includes(k));
    expect(unqualified.length).toBeGreaterThan(0);
    expect(out.refusals.filter((r) => r.reason === 'kind_unqualified').length).toBe(unqualified.length);
    // And every QUALIFIED kind becomes a candidate of the existing grammar, as a PROPOSAL:
    // ES-7's refusal honoured one rung up (a direction proposes; it never applies).
    expect(out.candidates.length).toBe(DISPATCHABLE_MISSION_KINDS.length);
    expect([...new Set(out.candidates.map((c) => c.applyMode))]).toEqual(['proposal']);
    expect(out.candidates.map((c) => c.metadata.kind).sort())
      .toEqual([...DISPATCHABLE_MISSION_KINDS].sort());
    expect(out.considered).toBe(DISPATCHABLE_MISSION_KINDS.length + unqualified.length);
  });

  it('E7-3 the per-principal cap and the doctrine door bind a directed mission exactly as an endogenous one', () => {
    const many = DISPATCHABLE_MISSION_KINDS.map((kind) => direction(kind, `subject.${kind}`));
    const capped = dispatchDirectedMissions({ ...COURT, directions: many });
    expect(capped.candidates.length).toBe(DISPATCH_CAP_PER_PRINCIPAL_PER_TICK);
    expect(capped.refusals.filter((r) => r.reason === 'over_cap').length)
      .toBe(many.length - DISPATCH_CAP_PER_PRINCIPAL_PER_TICK);
    // FAIL-CLOSED TOWARD THE DOCTRINE: a court that cannot establish a standing sends nobody
    // under a targeting narrower than `all_courts`, and the injected read is what supplies it.
    const strict = dispatchDirectedMissions({ ...COURT, targeting: 'foes_only', directions: many });
    expect(strict.candidates).toEqual([]);
    expect([...new Set(strict.refusals.map((r) => r.reason))]).toEqual(['doctrine_excludes']);
    const withStanding = dispatchDirectedMissions({
      ...COURT, targeting: 'foes_only', directions: many, standingFor: () => 'foe',
    });
    expect(withStanding.candidates.length).toBe(DISPATCH_CAP_PER_PRINCIPAL_PER_TICK);
  });

  it('E7-4 the cut is STAY-deterministic: the same directions in any order yield the same candidates', () => {
    const rows = DISPATCHABLE_MISSION_KINDS.map((kind) => direction(kind, `subject.${kind}`));
    const forward = dispatchDirectedMissions({ ...COURT, directions: rows });
    const reversed = dispatchDirectedMissions({ ...COURT, directions: [...rows].reverse() });
    // HBF-35 is STAY-DETERMINISTIC PERMANENTLY: the roll is an unweighted tiebreak over an
    // order the module canonicalises first, so input order cannot move the cut.
    expect(reversed.candidates.map((c) => c.id)).toEqual(forward.candidates.map((c) => c.id));
    expect(reversed.candidates.map((c) => c.metadata.rank01))
      .toEqual(forward.candidates.map((c) => c.metadata.rank01));
    // The demand id is derived from (kind, subject) and never minted, so a replay reproduces it.
    expect(directedMissionDemands(rows).map((d) => d.demandId))
      .toEqual(directedMissionDemands([...rows].reverse()).map((d) => d.demandId).reverse());
  });

  it('E7-5 the direction carries no urgency and no invented confidence, because both are the world own', () => {
    const [demand] = directedMissionDemands([direction(DISPATCHABLE_MISSION_KINDS[0], 'irontown')]);
    // Urgency FORCES `act_now`, which is a refusal to dispatch: a seal that could set it
    // would be a seal whose only effect is to cancel itself.
    expect(demand.urgent).toBe(false);
    expect(demand.dispatched).toBe(false);
    // anchored: the two fields above are read off the same demand, so this absence measures
    // the shape rather than a reader that stopped working.
    expect(Object.hasOwn(demand, 'decidingConfidence01')).toBe(false);
    expect(demand.subjectStanding).toBe('');
    expect(directedMissionDemands('not an array')).toEqual([]);
    expect(directedMissionDemands([null, direction('nope', 'x'), direction(MISSION_KINDS[0], 'x')]).length).toBe(1);
  });

  it('E7-6 a person card mission reads its four covert facets from the layer own vocabulary', () => {
    const lawful = covertMissionFacetsOf({
      demand: COVERT_MISSION_VOCABULARY.demands[0],
      face: COVERT_MISSION_VOCABULARY.faces[0],
      product: COVERT_MISSION_VOCABULARY.products[0],
      tap: COVERT_MISSION_VOCABULARY.taps[0],
    });
    expect(lawful).toEqual({
      demand: COVERT_MISSION_VOCABULARY.demands[0],
      face: COVERT_MISSION_VOCABULARY.faces[0],
      product: COVERT_MISSION_VOCABULARY.products[0],
      tap: COVERT_MISSION_VOCABULARY.taps[0],
      unlawful: [],
    });
    // A word this vocabulary does not carry is ABSENT AND NAMED — never guessed, and never
    // conflated with the DM having said nothing at all.
    const bad = covertMissionFacetsOf({ demand: 'whisper', tap: COVERT_MISSION_VOCABULARY.taps[1] });
    expect(bad.demand).toBe('');
    expect(bad.unlawful).toEqual(['demand']);
    expect(bad.tap).toBe(COVERT_MISSION_VOCABULARY.taps[1]);
    expect(covertMissionFacetsOf(null)).toEqual({
      demand: '', face: '', product: '', tap: '', unlawful: [],
    });
    // The words are the errand DTO's own, so a directed mission can only name what a save
    // will accept on the way back out.
    expect(COVERT_MISSION_VOCABULARY.taps.length).toBeGreaterThan(0);
  });

  it('E7-7 the catch is a pin resolved in chooseOrPinFork shape over the fork own two words', () => {
    const words = Object.keys(STAY_DETECTION_OUTCOMES);
    const catalogue = { [STAY_DETECTION_FORK_ID]: words };
    // THE WHOLE COMPOSITION, end to end: a staged directive, EM-E4's bag, EM-E4's consult.
    const pins = forkPinsFor(
      [{ op: { type: 'pin-fork', payload: { forkId: STAY_DETECTION_FORK_ID, outcome: 'caught' } } }],
      catalogue,
    );
    expect(pins).toEqual({ [STAY_DETECTION_FORK_ID]: 'caught' });
    const held = chooseOrPinFork(pins, STAY_DETECTION_FORK_ID, () => '');
    expect(held).toBe('caught');
    // A word outside the fork's vocabulary never reaches the bag at all (ruling 1).
    expect(forkPinsFor(
      [{ op: { type: 'pin-fork', payload: { forkId: STAY_DETECTION_FORK_ID, outcome: 'escaped' } } }],
      catalogue,
    )).toEqual({});
    // And the consult over an empty bag falls through to the draw, which is the site's read.
    expect(chooseOrPinFork({}, STAY_DETECTION_FORK_ID, () => '')).toBe('');
  });

  it('E7-8 the fork draw is CONSUMED under the pin: only the verdict moves, and the row names the hand', () => {
    const args = {
      errandId: 'errand.1',
      dwell: { stopIndex: 1, intervalIdx: 2 },
      factors: { hostRung: 3, securityEff01: 0.2, orderBand: 'strained', stops: 1, intervalIdx: 2 },
    };
    const rolled = stayDetectionRoll(args);
    const caught = stayDetectionRoll({ ...args, pinnedOutcome: 'caught' });
    const uncaught = stayDetectionRoll({ ...args, pinnedOutcome: 'uncaught' });
    // §19 ruling 4: a verdict pinned WITHOUT its roll would leave the odds describing a draw
    // that never happened, so every world-own field is byte-identical across all three.
    expect(odds(caught)).toEqual(odds(rolled));
    expect(odds(uncaught)).toEqual(odds(rolled));
    expect(caught.caught).toBe(STAY_DETECTION_OUTCOMES.caught);
    expect(uncaught.caught).toBe(STAY_DETECTION_OUTCOMES.uncaught);
    // THE HAND IS ON THE ROW THE PIN MOVED AND ON NO OTHER.
    expect(caught.pinnedOutcome).toBe('caught');
    expect(uncaught.pinnedOutcome).toBe('uncaught');
    // anchored: the two `pinnedOutcome` reads above are off the same shape, so an absent key
    // here measures the unpinned path rather than a reader that stopped working.
    expect(Object.hasOwn(rolled, 'pinnedOutcome')).toBe(false);
  });

  it('E7-9 a word this fork does not type leaves the roll byte-identical to a world with no editor', () => {
    const args = { errandId: 'errand.2', dwell: { stopIndex: 2, intervalIdx: 1 }, factors: { hostRung: 3 } };
    const plain = stayDetectionRoll(args);
    for (const junk of ['escaped', '', '   ', 'CAUGHT', true, null, 0, { outcome: 'caught' }]) {
      expect(stayDetectionRoll({ ...args, pinnedOutcome: junk })).toEqual(plain);
    }
    // A POSITIVE CONTROL on the detector: a word the fork DOES type is not identical, so the
    // equality above is a measurement rather than a parameter nobody reads.
    expect(stayDetectionRoll({ ...args, pinnedOutcome: 'uncaught' })).not.toEqual(plain);
  });

  it('E7-10 the stage honours the pin over a real dwelling errand, and the odds stay the world own', () => {
    const plain = gauntlet(undefined).detections;
    expect(plain.length).toBe(1);
    const caught = gauntlet('caught').detections;
    const uncaught = gauntlet('uncaught').detections;
    expect(caught[0].caught).toBe(true);
    expect(uncaught[0].caught).toBe(false);
    expect(odds(caught[0])).toEqual(odds(plain[0]));
    expect(odds(uncaught[0])).toEqual(odds(plain[0]));
    expect(caught[0].pinnedOutcome).toBe('caught');
    // anchored: the line above reads the key off a pinned row of this same run, so its
    // absence on the unpinned row measures the row rather than a broken accessor.
    expect(Object.hasOwn(plain[0], 'pinnedOutcome')).toBe(false);
    // THE CUSTODY STOP-REPORT IS UNTOUCHED: a pinned capture is no more persisted than a
    // rolled one, because the errand DTO's blocker is not a thing a decree may lift.
    expect(caught[0].custodyWritten).toBe(false);
    expect(caught[0].custodyBlockedReason).toBe('encounter_required_by_errand_dto');
  });

  it('E7-11 the espionage dormancy fence is unmoved: a pin cannot wake a dark layer', () => {
    const dark = advanceEspionageGauntlet({
      worldState: seeded({ espionageEnabled: false }),
      tick: DWELL_TICK,
      snapshot: SNAPSHOT,
      regionalGraph: GRAPH,
      pinnedCatch: 'caught',
    });
    expect(dark.detections).toEqual([]);
    expect(dark.skipped).toEqual([]);
    // anchored: the same call lit returns one detection in E7-10, so the empty arrays above
    // measure the gate rather than a fixture that stopped dwelling.
    expect(gauntlet('caught').detections.length).toBe(1);
    // And a pin over a world with no covert row is inert for the second, structural reason.
    expect(advanceEspionageGauntlet({
      worldState: world({ espionageEnabled: true }),
      tick: DWELL_TICK,
      snapshot: SNAPSHOT,
      regionalGraph: GRAPH,
      pinnedCatch: 'caught',
    }).detections).toEqual([]);
  });

  it('E7-12 no NpcStatus value is minted: the errand record carries where the traveller stands', () => {
    // THE SEVEN, unchanged — and no word of this member's three vocabularies is among them.
    expect([...NPC_STATUS_VALUES].sort())
      .toEqual(['active', 'dead', 'exiled', 'jailed', 'missing', 'removed', 'retired']);
    const missionWords = [
      ...MISSION_KINDS,
      ...Object.keys(STAY_DETECTION_OUTCOMES),
      ...COVERT_MISSION_VOCABULARY.demands,
      ...COVERT_MISSION_VOCABULARY.faces,
      ...COVERT_MISSION_VOCABULARY.products,
      ...COVERT_MISSION_VOCABULARY.taps,
    ];
    expect(missionWords.filter((word) => NPC_STATUS_VALUES.includes(word))).toEqual([]);
    // THE POSITION IS THE ERRAND'S OWN, read from the row and one tick and from nothing else.
    const state = seeded({ espionageEnabled: true });
    const [errand] = envoyErrandsOf(state);
    const dwell = covertDwellRead({ errand, tick: DWELL_TICK });
    expect(dwell.dwelling).toBe(true);
    expect(dwell.settlementId).toBe('westmarch');
    expect(dwell.stopIndex).toBe(1);
    // anchored: the dwell above is a live read of this very row, so the absent status key
    // measures the record rather than an errand that was never built.
    expect(Object.hasOwn(errand, 'status')).toBe(false);
    expect(errand.npcId).toBe('npc.reeve');
  });

  it('E7-13 pardon is §15 return from exile, and it is already built', () => {
    expect(DM_VERBS).toEqual(['assign', 'kill', 'pardon']);
    const { worldState, wnpcId } = banished();
    expect(npcLedgerOf(worldState).exclusions[wnpcId])
      .toEqual([{ settlementId: 'sav_kelder', kind: 'banishment_edict', untilTick: 60 }]);
    const pardoned = pardonNpc({ worldState, wnpcId, tick: 22, settlementName: 'Kelder' });
    expect(pardoned.changed).toBe(true);
    expect(pardoned.verb).toBe('pardon');
    expect(pardoned.receipt.doorsOpened).toEqual(['sav_kelder']);
    // THE EXILE IS RETURNED: the edict that shut the door is gone, and the act is a LEDGER
    // act, which is exactly why §15's return needs no `NpcStatus` write and gets none.
    expect(npcLedgerOf(pardoned.worldState).exclusions[wnpcId]).toBeUndefined();
    expect(pardoned.receipt.tick).toBe(22);
  });

  it('E7-14 the catch vocabulary is an EXPORT of the draw own module, which is the order ruling 1 asks', () => {
    const row = HABIT_FORK_REGISTRY.find((entry) => entry.forkId === STAY_DETECTION_FORK_ID);
    expect(row.symbol).toBe('stayDetectionRoll');
    expect(row.module).toBe('src/domain/worldPulse/espionage/espionageGauntlet');
    // ⛔ THE ROW STILL CARRIES NULL, AND THIS PIN IS THE MEASUREMENT HANDED ON. EM-E0's law
    // is that a vocabulary is declared only where the DRAW'S OWN MODULE exports one, and
    // HBF-44's closeOwed spells the order: the export first, the row after. This member
    // landed the export; moving the row is EM-E0's file and EM-E0b's act.
    expect(row.actionVocabulary).toBe(null);
    // The export itself is total, frozen, and maps each word to the verdict it implies —
    // EM-E4's SIEGE_VERDICT_BANDS shape, so a herald shows the word and the stage reads the
    // boolean without a second rule deriving either from the other.
    expect(Object.isFrozen(STAY_DETECTION_OUTCOMES)).toBe(true);
    expect(Object.keys(STAY_DETECTION_OUTCOMES).sort()).toEqual(['caught', 'uncaught']);
    expect(Object.values(STAY_DETECTION_OUTCOMES).sort()).toEqual([false, true]);
    // A castable roster is what a direction still needs at the tick, and the casting law is
    // the covert one — importance-INVERSE, deterministic, the same person on every replay.
    const settlement = {
      id: 'ashford',
      npcs: [
        {
          id: 'npc_1', name: 'Reeve Mara', role: 'harbourmaster', importance: 'pillar',
        },
        {
          id: 'npc_2', name: 'Tam the Quiet', role: 'porter', importance: 'minor',
        },
      ],
    };
    const cast = castCovertOperative({
      worldState: world({ espionageEnabled: true }), settlementId: 'ashford', settlement,
    });
    expect(cast.reason).toBe('cast');
    expect(cast.identity.name).toBe('Tam the Quiet');
    expect(castCovertOperative({
      worldState: world({ espionageEnabled: true }), settlementId: 'ashford', settlement,
    }).identity.name).toBe(cast.identity.name);
  });
});
