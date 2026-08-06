/**
 * espionageMission.test.js — ES-1: the covert mission's casting law, its mint validation,
 * its persistence round-trip and its veil.
 *
 * THREE THINGS THIS FILE REFUSES TO DO, because each is a recorded way a pin ships
 * vacuous in this estate:
 *
 *   1. IT NEVER ASSERTS AN ABSENCE ON AN EMPTY HARNESS. The veil pins below are driven by
 *      a SEEDED covert errand — a real minted row carrying a real mission — and compare it
 *      against a real honest embassy. An absence asserted over a row with no mission
 *      passes with the whole feature deleted.
 *   2. IT NEVER PROVES A ROUND-TRIP IN MEMORY. Every persistence claim goes through
 *      `JSON.parse(JSON.stringify(...))` before it is re-normalized, because an in-memory
 *      probe cannot tell a shared reference from a copy — the recorded alias trap, whose
 *      sharpest edge is that `factions[].members[]` ARE `npcs[]` objects.
 *   3. IT NEVER PROVES A REFUSAL BY ITS BOOLEAN. Every mint refusal is asserted BY REASON,
 *      because `ok: false` is one bit shared by nine different wrongs and a validation that
 *      collapsed them all into one would pass a boolean pin unchanged.
 */
import { describe, expect, test } from 'vitest';

import {
  COVERT_MISSION_VOCABULARY,
  castCovertOperative,
  covertDrawWeight,
  mintCovertMission,
} from '../../src/domain/worldPulse/espionage/espionageMissions.js';
import { espionageActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import { covertFaceFor, covertMissionRefusal } from '../../src/domain/worldPulse/errandMint.js';
import { castableRoster, envoyCandidate } from '../../src/domain/worldPulse/envoyCasting.js';
import {
  ENVOY_COVERT_DEMANDS,
  ENVOY_COVERT_FACES,
  ENVOY_COVERT_LEG_REFS,
  ENVOY_COVERT_PRODUCTS,
  ENVOY_PURPOSE_CLASSES,
  ERRAND_CONSUMERS,
  MAX_COVERT_ITINERARY_STOPS,
  PURPOSE_CLASS_BY_PURPOSE,
  declaredPurposeClassOf,
  purposeClassOf,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import {
  normalizeCovertMission,
  normalizeEnvoyErrands,
  normalizeErrand,
} from '../../src/domain/worldPulse/envoyErrandRecords.js';
import { projectErrandPurpose } from '../../src/domain/worldPulse/envoyErrandProjection.js';
import { ROADS_TUNING } from '../../src/domain/roads/state.js';
import { DEMAND_BANDS, ESPIONAGE_TUNING } from '../../src/domain/worldPulse/espionage/espionageMath.js';
import {
  ENVOY_REQUIRED_RULES,
  mintEnvoyErrand,
  normalizeEnvoyPeaceOffer,
} from '../../src/domain/worldPulse/envoyErrand.js';

const WAR_RULES = Object.freeze(Object.fromEntries(ENVOY_REQUIRED_RULES.map((k) => [k, true])));

/** A world with the spine and the espionage layer BOTH lit, plus the war flags a row needs. */
function litWorld(extra = {}) {
  return {
    tick: 10,
    spatialCanonVersion: 1,
    simulationRules: {
      ...WAR_RULES,
      infoMode: 'unreliable',
      errandSpineEnabled: true,
      espionageEnabled: true,
    },
    relationshipStates: { untouched: { relationshipType: 'hostile' } },
    ...extra,
  };
}

function mission(patch = {}) {
  return {
    demand: 'confirm',
    itinerary: [{ face: 'declared', settlementId: 'irontown', stayTicks: 2 }],
    product: 'confirm',
    subjectId: 'irontown',
    ...patch,
  };
}

const SNAPSHOT = Object.freeze({
  storesBand: 'thin',
  strengthBand: 'ready',
  moraleExhaustionBand: 'present',
  foundingCauseStatus: 'live',
  believedRatioBand: 'matched',
});

function peaceOffer({ from = 'ashford', to = 'irontown' } = {}) {
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

const ROUTE_PLAN = Object.freeze({
  legs: [{ fromId: 'ashford', toId: 'irontown', departTick: 10, arrivalTick: 12 }],
  expectedReturnTick: 20,
  routeRef: { id: 'road.north', name: 'North Road' },
});

/** Mint one real ROW — the seeded fixture every veil pin below is driven by. */
function mintRow(worldState, { covert = null } = {}) {
  const outcome = peaceOffer();
  return mintEnvoyErrand({
    worldState,
    outcome,
    acceptance: acceptedRuling(outcome),
    npcId: 'npc.reeve',
    npcName: 'Reeve Mara',
    snapshot: SNAPSHOT,
    purpose: 'sue',
    ...(covert ? { purposeClass: 'covert', covert } : {}),
    routePlan: { ...ROUTE_PLAN },
    tick: 10,
  });
}

function settlementWith(npcs) {
  return {
    id: 'ashford',
    name: 'Ashford',
    npcs,
    powerStructure: { factions: [{ faction: 'crown', power: 60 }] },
  };
}

describe('ES-1 vocabulary — one mint, closed, ordered, and shared with the arithmetic', () => {
  test('the four closed sets are frozen, codepoint-ordered and exactly the charter members', () => {
    expect([...ENVOY_COVERT_PRODUCTS]).toEqual(['acquire', 'confirm', 'refute']);
    expect([...ENVOY_COVERT_DEMANDS]).toEqual(['certain', 'confirm', 'corroborate']);
    expect([...ENVOY_COVERT_FACES]).toEqual(['covert', 'declared']);
    for (const set of [ENVOY_COVERT_PRODUCTS, ENVOY_COVERT_DEMANDS, ENVOY_COVERT_FACES,
      ENVOY_COVERT_LEG_REFS]) {
      expect(Object.isFrozen(set)).toBe(true);
      expect([...set].sort()).toEqual([...set]);
    }
  });

  test('⟨F5⟩ the legRefs set is the SIX, and pullBand is refused BY ABSENCE', () => {
    expect([...ENVOY_COVERT_LEG_REFS]).toEqual([
      'exports', 'readiness', 'routePositionBand', 'storesBand', 'strength', 'tierBand',
    ]);
    // The dead-band law, stated as a negative: SP-B's conditionsBands carries a FOURTH
    // key, and no espionage product can fill it, so admitting it would mint a vocabulary
    // member nobody could ever satisfy. This is the whole content of ⟨F5⟩ and it reds if
    // a later lane "completes" the set for symmetry.
    // anchored: the six members are asserted by exact list two lines above, so this
    // absence is a statement about a PROVEN-POPULATED set and not about an empty one.
    expect(ENVOY_COVERT_LEG_REFS).not.toContain('pullBand'); // anchored: the six members are asserted by exact list two lines above, so the set is proven populated
    expect(normalizeCovertMission(mission({
      product: 'acquire', legRefs: ['tierBand', 'pullBand'],
    })).reason).toBe('invalid_leg_refs');
  });

  test('the arithmetic BORROWS the row vocabulary rather than authoring a second copy', () => {
    // Same frozen array, not a deep-equal twin: a copy could drift a rung and both files
    // would keep passing their own tests.
    expect(DEMAND_BANDS).toBe(ENVOY_COVERT_DEMANDS);
    expect(ESPIONAGE_TUNING.MAX_ITINERARY_STOPS).toBe(MAX_COVERT_ITINERARY_STOPS);
    expect(MAX_COVERT_ITINERARY_STOPS).toBe(3);
    // ...and the tuning's demand floors are TOTAL over that one vocabulary.
    expect(Object.keys(ESPIONAGE_TUNING.DEMAND_FLOOR01).sort()).toEqual([...ENVOY_COVERT_DEMANDS]);
    // The mission head re-exports the same identities, so a consumer reading the layer's
    // vocabulary reads the row's own words.
    expect(COVERT_MISSION_VOCABULARY.demands).toBe(ENVOY_COVERT_DEMANDS);
    expect(COVERT_MISSION_VOCABULARY.products).toBe(ENVOY_COVERT_PRODUCTS);
    expect(COVERT_MISSION_VOCABULARY.legRefs).toBe(ENVOY_COVERT_LEG_REFS);
    expect(COVERT_MISSION_VOCABULARY.maxStops).toBe(MAX_COVERT_ITINERARY_STOPS);
  });

  test('ES-1 is REGISTERED as a spine consumer, and IN-4 keeps its own unbuilt pre-pin', () => {
    const rows = ERRAND_CONSUMERS.filter((row) => row.purposeClass === 'covert');
    expect(rows.map((row) => [row.consumer, row.wave, row.built])).toEqual([
      ['covert missions', 'ES-1', true],
      ['couriers', 'IN-4', false],
    ]);
    expect(rows[0].module).toBe('src/domain/worldPulse/espionage/espionageMissions.js');
    expect(ENVOY_PURPOSE_CLASSES).toContain('covert');
  });
});

describe('ES-1 the sub-record normalizer — one validation, two answers, total on garbage', () => {
  test('a lawful mission normalizes, sorts its legRefs, and drops nothing it was given', () => {
    const read = normalizeCovertMission(mission({
      product: 'acquire', legRefs: ['tierBand', 'exports'],
    }));
    expect(read.reason).toBe('covert');
    expect(read.covert).toEqual({
      demand: 'confirm',
      itinerary: [{ face: 'declared', settlementId: 'irontown', stayTicks: 2 }],
      legRefs: ['exports', 'tierBand'],
      product: 'acquire',
      subjectId: 'irontown',
    });
  });

  test('EVERY refusal is named, and each one is reachable by its own single defect', () => {
    const cases = [
      ['absent', undefined],
      ['absent', null],
      ['invalid_covert_keys', {}],
      // ⏱ RE-AIMED AT ES-3 (2026-08-06). These two rows read `standoff` and `gathered`,
      // which ES-3 TAUGHT the key set in the commit that first wrote them — which is what
      // the tripwire below demanded of it. The rows now aim at a key nobody has minted, so
      // the guard still measures the KEY SET rather than two particular words, and the two
      // taught keys have their own reasons three rows down.
      ['invalid_covert_keys', mission({ escort: true })],
      ['invalid_covert_keys', mission({ tap: 'beliefs' })],
      ['invalid_itinerary', mission({ itinerary: [] })],
      ['invalid_itinerary', mission({ itinerary: 'irontown' })],
      ['invalid_itinerary', mission({ itinerary: [{ face: 'sideways', settlementId: 'a', stayTicks: 1 }] })],
      ['invalid_itinerary', mission({ itinerary: [{ face: 'covert', settlementId: '', stayTicks: 1 }] })],
      ['invalid_itinerary', mission({ itinerary: [{ face: 'covert', settlementId: 'a', stayTicks: -1 }] })],
      ['invalid_itinerary', mission({ itinerary: [{ face: 'covert', settlementId: 'a', stayTicks: 1, extra: 1 }] })],
      ['invalid_itinerary', mission({
        itinerary: [
          { face: 'covert', settlementId: 'a', stayTicks: 1 },
          { face: 'covert', settlementId: 'a', stayTicks: 1 },
        ],
      })],
      ['itinerary_too_long', mission({
        itinerary: ['a', 'b', 'c', 'd'].map((id) => ({ face: 'covert', settlementId: id, stayTicks: 1 })),
      })],
      ['invalid_product', mission({ product: 'assassinate' })],
      ['invalid_demand', mission({ demand: 'absolutely' })],
      ['invalid_subject', mission({ subjectId: '' })],
      ['invalid_leg_refs', mission({ product: 'acquire', legRefs: [] })],
      ['invalid_leg_refs', mission({ product: 'acquire', legRefs: ['tierBand', 'tierBand'] })],
      ['invalid_leg_refs', mission({ legRefs: ['tierBand'] })],
      // ES-3's two taught keys, each with its OWN reason. A shared `invalid_covert_keys`
      // would have told a writer only that something was wrong with a record it had just
      // built correctly except for one field.
      ['invalid_gathered', mission({ gathered: [] })],
      ['invalid_gathered', mission({ gathered: 'beliefs' })],
      ['invalid_gathered', mission({
        gathered: [{ accuracyCap01: 0.5, atTick: 4, subjectId: 'irontown', tap: 'hearsay' }],
      })],
      ['invalid_gathered', mission({
        gathered: [{ accuracyCap01: 1.5, atTick: 4, subjectId: 'irontown', tap: 'beliefs' }],
      })],
      ['invalid_gathered', mission({
        gathered: [{
          accuracyCap01: 0.5, atTick: 4, subjectId: 'irontown', tap: 'beliefs', sentHome: false,
        }],
      })],
      ['invalid_standoff', mission({ standoff: false })],
      ['invalid_standoff', mission({ standoff: 1 })],
    ];
    for (const [reason, cargo] of cases) {
      const read = normalizeCovertMission(cargo);
      expect(read.reason, JSON.stringify(cargo)).toBe(reason);
      expect(read.covert, JSON.stringify(cargo)).toBeNull();
    }
    // NON-VACUITY: every reason above is DISTINCT, so the table measures a discriminating
    // validation rather than one that collapses every wrong into a single word.
    expect(new Set(cases.map(([reason]) => reason)).size).toBe(10);
  });

  test('total on garbage: no shape throws, and none of them produces a record', () => {
    for (const raw of [0, 1, '', 'covert', true, [], [mission()], () => mission(), Symbol('x')]) {
      expect(() => normalizeCovertMission(raw)).not.toThrow();
      expect(normalizeCovertMission(raw).covert).toBeNull();
    }
  });

  test('⚠ THE UNKNOWN-KEY TRIPWIRE: an unminted key is REFUSED, never silently trimmed', () => {
    // The ghost-write class, foreclosed. If a wave's amender writes a field without
    // teaching COVERT_KEYS in the same commit, the round-trip below reds loudly instead of
    // erasing the field on the next persist while both halves look correct alone. ES-3 is
    // the wave that PAID this: `standoff` and `gathered` are gone from the list below and
    // present in the acceptance pin under it.
    for (const key of ['tap', 'escort', 'legs', 'anythingElse']) {
      expect(normalizeCovertMission({ ...mission(), [key]: 1 }).reason).toBe('invalid_covert_keys');
    }
    // ...and the SAME cargo without the unknown key is accepted, so the guard above is a
    // measurement of the key set rather than a rejection of everything.
    expect(normalizeCovertMission(mission()).reason).toBe('covert');
  });

  test('ES-3: the two taught keys ROUND-TRIP, and the gradient keeps its authored ORDER', () => {
    // The acceptance half of the tripwire above. A gradient is an APPEND LOG and its order
    // is the only fact its fields do not carry, so the normalizer must preserve it — a
    // sorted round-trip would pass a key-set pin while destroying the record's meaning.
    const gathered = [
      { accuracyCap01: 0.75, atTick: 9, subjectId: 'irontown', tap: 'performance' },
      { accuracyCap01: 0.4, atTick: 4, subjectId: 'irontown', tap: 'beliefs', sentHome: true },
      { accuracyCap01: 1, atTick: 12, subjectId: 'irontown', tap: 'delta' },
    ];
    const read = normalizeCovertMission(mission({ gathered, standoff: true }));
    expect(read.reason).toBe('covert');
    expect(read.covert).toEqual({
      demand: 'confirm',
      gathered,
      itinerary: [{ face: 'declared', settlementId: 'irontown', stayTicks: 2 }],
      product: 'confirm',
      standoff: true,
      subjectId: 'irontown',
    });
    // BYTE-STABLE, and measured as bytes rather than as deep equality: the second pass over
    // the first pass's OWN output must serialize identically, which is what a save file
    // reloaded twice actually does.
    expect(JSON.stringify(normalizeCovertMission(read.covert).covert))
      .toBe(JSON.stringify(read.covert));
    // The DTO's own backstop: 3 stops x (1 minted stay + 6 rooted re-samples) = 21, and one
    // more than that is refused. The bound is derived, so this asserts the derivation too.
    const partial = { accuracyCap01: 0.5, atTick: 1, subjectId: 'irontown', tap: 'beliefs' };
    expect(normalizeCovertMission(mission({
      gathered: Array.from({ length: 21 }, () => ({ ...partial })),
    })).reason).toBe('covert');
    expect(normalizeCovertMission(mission({
      gathered: Array.from({ length: 22 }, () => ({ ...partial })),
    })).reason).toBe('invalid_gathered');
  });
});

describe('ES-1 the mint — named refusals, and a face a covert row cannot go without', () => {
  const args = {
    routePlan: { ...ROUTE_PLAN }, fromId: 'ashford', toId: 'irontown', notBeforeTick: 10,
  };

  test('DARK refuses at the espionage head before the spine is ever asked', () => {
    for (const rules of [
      {},
      { errandSpineEnabled: true },
      { errandSpineEnabled: true, espionageEnabled: false },
      { espionageEnabled: true },
      { errandSpineEnabled: true, espionageEnabled: 'true' },
    ]) {
      const world = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable', ...rules } };
      expect(espionageActive(world)).toBe(false);
      expect(mintCovertMission({ worldState: world, purpose: 'sue', covert: mission(), ...args }))
        .toEqual({ ok: false, fields: {}, plan: null, reason: 'dark' });
    }
  });

  test('LIT mints the mission, and the row wears a DERIVED face', () => {
    const out = mintCovertMission({
      worldState: litWorld(), purpose: 'sue', covert: mission(), ...args,
    });
    expect(out.reason).toBe('spine');
    expect(out.ok).toBe(true);
    expect(out.fields).toEqual({
      purposeClass: 'covert',
      covert: {
        demand: 'confirm',
        itinerary: [{ face: 'declared', settlementId: 'irontown', stayTicks: 2 }],
        product: 'confirm',
        subjectId: 'irontown',
      },
      declaredPurpose: 'diplomatic',
      truePurpose: 'covert',
    });
    // The face is what a player will be told, and it is NOT the truth.
    expect(declaredPurposeClassOf(out.fields)).toBe('diplomatic');
    expect(purposeClassOf(out.fields)).toBe('covert');
  });

  test('every mint refusal reaches the caller BY NAME, through the spine head', () => {
    const world = litWorld();
    const refuse = (patch, cargo) => mintCovertMission({
      worldState: world, purpose: 'sue', covert: cargo, ...args, ...patch,
    }).reason;
    expect(refuse({}, mission({
      itinerary: ['a', 'b', 'c', 'd'].map((id) => ({ face: 'covert', settlementId: id, stayTicks: 1 })),
    }))).toBe('itinerary_too_long');
    expect(refuse({}, mission({ product: 'assassinate' }))).toBe('invalid_product');
    expect(refuse({}, mission({ demand: 'absolutely' }))).toBe('invalid_demand');
    expect(refuse({}, mission({ subjectId: '' }))).toBe('invalid_subject');
    expect(refuse({}, mission({ product: 'acquire', legRefs: ['pullBand'] }))).toBe('invalid_leg_refs');
    expect(refuse({}, mission({ escort: true }))).toBe('invalid_covert_keys');
    // ES-3's two taught keys refuse BY THEIR OWN NAME at the mint too — the persist side
    // heals a malformed sub-record to absent, and the mint side must say what was wrong.
    expect(refuse({}, mission({ standoff: false }))).toBe('invalid_standoff');
    expect(refuse({}, mission({ gathered: [] }))).toBe('invalid_gathered');
    // R-ES1-1 made loud: no war purpose underneath means no face to wear, and a faceless
    // covert row is a veil leak rather than a merely incomplete one.
    expect(refuse({ purpose: '' }, mission())).toBe('covert_face_required');
    // And the plan is still priced FIRST, so an unpriceable journey refuses identically
    // whatever the covert cargo says.
    expect(refuse({ routePlan: { legs: [] } }, mission())).toBe('invalid_route_plan');
  });

  test('covert cargo on a NON-covert class is refused, and the reason names the class', () => {
    // The direct read of the spine door, because `mintCovertMission` always writes
    // `covert` as the class and could never reach this arm on its own.
    expect(covertMissionRefusal({ purpose: 'sue', covert: mission() })).toBe('covert_class_required');
    expect(covertMissionRefusal({ purpose: 'sue', purposeClass: 'commercial', covert: mission() }))
      .toBe('covert_class_required');
    // An unlawful class WORD is deferential — the class check owns that refusal.
    expect(covertMissionRefusal({ purpose: 'sue', purposeClass: 'piracy', covert: mission() })).toBe('');
    // No cargo, no opinion.
    expect(covertMissionRefusal({ purpose: 'sue', purposeClass: 'commercial' })).toBe('');
  });

  test('the face derivation prefers the caller and falls back to the purpose', () => {
    expect(covertFaceFor('sue', null)).toBe('diplomatic');
    expect(covertFaceFor('sue', 'commercial')).toBe('commercial');
    expect(covertFaceFor('', null)).toBe('');
    expect(covertFaceFor('smuggle', null)).toBe('');
    // A covert face is not a face. This is the door that makes `covert_face_required`
    // reachable from a caller who supplied one.
    expect(covertFaceFor('sue', 'covert')).toBe('');
    expect(covertFaceFor('sue', 'piracy')).toBe('');
  });
});

describe('ES-1 casting — two opposite laws over one roster, and one availability predicate', () => {
  const ROSTER = Object.freeze([
    { id: 'n.pillar', name: 'Lady Estin', role: 'ruler', importance: 'pillar', faction: 'crown' },
    { id: 'n.key', name: 'Chancellor Vok', role: 'chancellor', importance: 'key', faction: 'crown' },
    { id: 'n.minor', name: 'Tam the Carter', role: 'carter', importance: 'minor', faction: 'crown' },
  ]);

  test('the draw weight is the ROADS law, imported and inverse — not a second curve', () => {
    expect(covertDrawWeight(0)).toBeCloseTo(ROADS_TUNING.DRAW_WEIGHT_BASE, 10);
    expect(covertDrawWeight(1)).toBeCloseTo(ROADS_TUNING.DRAW_WEIGHT_BASE - 1, 10);
    // MONOTONE DECREASING in importance — the whole content of "importance-INVERSE".
    const weights = [0, 0.4, 0.7, 1].map(covertDrawWeight);
    expect(weights).toEqual([...weights].sort((a, b) => b - a));
    expect(new Set(weights).size).toBe(4);
    // Floored rather than zeroed: the most notable person stays DRAWABLE, because a court
    // with nobody else must send whoever it has.
    expect(covertDrawWeight(99)).toBeGreaterThan(0);
  });

  test('THE OPPOSITION, measured: the two laws pick DIFFERENT people from one roster', () => {
    const world = litWorld();
    const settlement = settlementWith(ROSTER);
    const diplomatic = envoyCandidate(world, 'ashford', settlement);
    const covert = castCovertOperative({ worldState: world, settlementId: 'ashford', settlement });
    expect(diplomatic.identity.name).toBe('Lady Estin');
    expect(covert.identity.name).toBe('Tam the Carter');
    expect(covert.reason).toBe('cast');
    // The claim stated as the design states it: the realm's face is its most notable, its
    // spies its least. A merge of the two laws reds here rather than in a soak.
    expect(covert.identity.name).not.toBe(diplomatic.identity.name);
    expect(covert.notoriety01).toBeLessThan(
      castCovertOperative({
        worldState: world, settlementId: 'ashford', settlement: settlementWith([ROSTER[0]]),
      }).notoriety01,
    );
  });

  test('the diplomatic floor and its absence are BOTH live', () => {
    const world = litWorld();
    const minorsOnly = settlementWith([ROSTER[2]]);
    // A roster of nobodies has NO diplomatic candidate — the >= 0.4 floor, still binding.
    expect(envoyCandidate(world, 'ashford', minorsOnly)).toBeNull();
    // ...and it casts a spy perfectly well, which is the floor's absence proven live
    // rather than declared. One fixture, two laws, opposite answers.
    expect(castCovertOperative({
      worldState: world, settlementId: 'ashford', settlement: minorsOnly,
    }).identity.name).toBe('Tam the Carter');
  });

  test('THE DISPATCH-REFUSAL SEAM is ONE predicate, and it refuses BOTH laws together', () => {
    const world = litWorld();
    const busy = [
      { ...ROSTER[2], status: 'imprisoned' },
      { ...ROSTER[1], whereabouts: { state: 'travelling' } },
      { ...ROSTER[0], status: 'dead' },
    ];
    const settlement = settlementWith(busy);
    // castableRoster is the one home; both draws read it, so this emptiness IS both
    // refusals.
    expect(castableRoster(world, 'ashford', settlement)).toEqual([]);
    expect(envoyCandidate(world, 'ashford', settlement)).toBeNull();
    const out = castCovertOperative({ worldState: world, settlementId: 'ashford', settlement });
    expect(out.reason).toBe('no_castable_person');
    expect(out.operative).toBeNull();
    // NON-VACUITY: the same three people, unencumbered, are all castable — so the
    // emptiness above measures the refusal and not a broken roster read.
    expect(castableRoster(world, 'ashford', settlementWith(ROSTER))).toHaveLength(3);
  });

  test('VETTING is a real refusal routed through the ONE reader, and both arms are live', () => {
    const world = litWorld();
    const settlement = settlementWith(ROSTER);
    // A CAREFUL seat that finds a close foreign tie on everyone casts NOBODY, and says so
    // with a reason distinct from having no people at all.
    const refused = castCovertOperative({
      worldState: world,
      settlementId: 'ashford',
      settlement,
      quality: 'careful',
      volunteerBandsFor: () => ({ foreignTieBand: 'close' }),
    });
    expect(refused.reason).toBe('vetting_refused');
    expect(refused.operative).toBeNull();
    // A HURRIED seat does not look, and takes the first person the draw offers — the arm
    // the double-agent design depends on existing.
    const hurried = castCovertOperative({
      worldState: world,
      settlementId: 'ashford',
      settlement,
      quality: 'hurried',
      volunteerBandsFor: () => ({ foreignTieBand: 'close', loyaltyBand: 'suspect' }),
    });
    expect(hurried.reason).toBe('cast');
    expect(hurried.vetting).toEqual({
      accepted: true, quality: 'hurried', basis: 'no_time_to_look', reason: 'vetted',
    });
    // A careful seat that refuses only SOME candidates walks down the draw to the next.
    const walked = castCovertOperative({
      worldState: world,
      settlementId: 'ashford',
      settlement,
      quality: 'careful',
      volunteerBandsFor: (identity) => (identity.name === 'Tam the Carter'
        ? { loyaltyBand: 'suspect' }
        : {}),
    });
    expect(walked.reason).toBe('cast');
    expect(walked.identity.name).toBe('Chancellor Vok');
    expect(walked.vetting.basis).toBe('nothing_found');
  });

  test('casting is DARK-refused and origin-checked before it reads a roster', () => {
    const dark = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable' } };
    expect(castCovertOperative({
      worldState: dark, settlementId: 'ashford', settlement: settlementWith(ROSTER),
    }).reason).toBe('dark');
    expect(castCovertOperative({
      worldState: litWorld(), settlementId: '', settlement: settlementWith(ROSTER),
    }).reason).toBe('invalid_origin');
  });

  test('the draw is DETERMINISTIC over roster order — replay casts the same operative', () => {
    const world = litWorld();
    const forward = castCovertOperative({
      worldState: world, settlementId: 'ashford', settlement: settlementWith(ROSTER),
    });
    const reversed = castCovertOperative({
      worldState: world, settlementId: 'ashford', settlement: settlementWith([...ROSTER].reverse()),
    });
    expect(reversed.identity).toEqual(forward.identity);
    // Two people of EQUAL importance tie-break on identity by codepoint, never on the
    // order a roster array happened to hold them in.
    const twins = [
      { id: 'n.b', name: 'Bell', role: 'carter', importance: 'minor', faction: 'crown' },
      { id: 'n.a', name: 'Ansel', role: 'carter', importance: 'minor', faction: 'crown' },
    ];
    expect(castCovertOperative({
      worldState: world, settlementId: 'ashford', settlement: settlementWith(twins),
    }).identity.rosterId).toBe('n.a');
    expect(castCovertOperative({
      worldState: world, settlementId: 'ashford', settlement: settlementWith([...twins].reverse()),
    }).identity.rosterId).toBe('n.a');
  });
});

describe('ES-1 lifecycle — create, read, persist, regenerate, undo, import, veil', () => {
  test('CREATE: the one ledger writer carries the mission onto a real row', () => {
    const out = mintRow(litWorld(), { covert: mission() });
    expect(out.reason).toBe('minted');
    expect(out.errand.purposeClass).toBe('covert');
    expect(out.errand.covert.product).toBe('confirm');
    expect(out.errand.declaredPurpose).toBe('diplomatic');
  });

  test('PERSIST + IMPORT: the sub-record survives REAL serialization, detached', () => {
    const minted = mintRow(litWorld(), { covert: mission({ product: 'acquire', legRefs: ['tierBand'] }) });
    const rows = minted.worldState.envoyErrands;
    // THE ALIAS TRAP: through real JSON, so a shared reference cannot masquerade as a copy.
    const roundTripped = normalizeEnvoyErrands(JSON.parse(JSON.stringify(rows)));
    expect(roundTripped).toEqual(rows);
    expect(roundTripped[0].covert).toEqual(minted.errand.covert);
    expect(roundTripped[0].covert).not.toBe(minted.errand.covert);
    // IDEMPOTENT: a second pass through the DTO changes nothing, so a save/load cycle is
    // byte-stable rather than merely lossless once.
    expect(normalizeEnvoyErrands(JSON.parse(JSON.stringify(roundTripped)))).toEqual(rows);
    // Mutating the detached copy cannot reach the ledger.
    roundTripped[0].covert.itinerary[0].settlementId = 'elsewhere';
    expect(minted.errand.covert.itinerary[0].settlementId).toBe('irontown');
  });

  test('IMPORT HEALS: a forged sub-record degrades the mission, never the traveller', () => {
    const minted = mintRow(litWorld(), { covert: mission() });
    const forged = JSON.parse(JSON.stringify(minted.errand));
    forged.covert = { itinerary: 'nonsense' };
    const healed = normalizeErrand(forged);
    // The row SURVIVES — §1's rule. A covert mission with corrupt cargo becomes an
    // ordinary errand of its declared class rather than nulling a person off the road.
    expect(healed).not.toBeNull();
    expect(healed.covert).toBeUndefined();
    expect(healed.id).toBe(minted.errand.id);
    expect(healed.purposeClass).toBe('covert');
  });

  test('REPAIR R1 — THE VEIL SURVIVES AN IMPORT THAT STRIPS THE FACE, on the PERSIST path', () => {
    // ⚠⚠ THE PIN THE WAVE'S OWN VEIL TEST STRUCTURALLY COULD NOT SEE. That test drives
    // MINT-produced rows, and the mint DERIVES a face for every covert row it writes, so
    // no row it can construct is ever faceless. The leak lived on the other lifecycle
    // path: a lawful covert row, serialized, re-imported with its cover story deleted.
    // Executed at ES-1's commit dda24851 this returned `purposeClass: "covert"` to the
    // PLAYER arm. The forgery is the one `normalizeCovertMission`'s header names.
    const minted = mintRow(litWorld(), { covert: mission() });
    // anchored: the seed really is a covert row wearing a face, so the deletion below
    // removes something that was actually there rather than asserting over an empty row.
    expect(minted.errand.purposeClass).toBe('covert');
    expect(minted.errand.declaredPurpose).toBe('diplomatic');
    expect(minted.errand.truePurpose).toBe('covert');
    const forged = JSON.parse(JSON.stringify(minted.errand));
    delete forged.declaredPurpose;
    delete forged.truePurpose;
    expect(forged.purposeClass).toBe('covert'); // the forgery keeps the CLASS and drops the FACE
    const healed = normalizeErrand(forged);
    // THE TRAVELLER SURVIVES, AND SO DOES ITS HISTORY. The persist seam does NOT strip the
    // class — repair SP-D-R5 refused that, and the SP-D-R4 doors depend on it — so the row
    // is still, in the ledger, exactly the covert mission it always was.
    expect(healed).not.toBeNull();
    expect(healed.id).toBe(minted.errand.id);
    expect(healed.purposeClass).toBe('covert');
    expect(healed.covert).toEqual(minted.errand.covert);
    expect(purposeClassOf(healed)).toBe('covert');
    // THE READER IS WHERE THE VEIL HOLDS — the assertion that reds without the repair.
    expect(declaredPurposeClassOf(healed)).toBe('diplomatic');
    expect(projectErrandPurpose(healed, {})).toEqual({
      errandId: minted.errand.id, purposeClass: 'diplomatic',
    });
    // ...and the faceless row is INDISTINGUISHABLE from an honest embassy to a player,
    // which is the property, not merely "some word other than covert".
    const honest = mintRow(litWorld()).errand;
    expect(projectErrandPurpose(healed, {}).purposeClass)
      .toBe(projectErrandPurpose(honest, {}).purposeClass);
    expect(Object.keys(projectErrandPurpose(healed, {})).sort())
      .toEqual(Object.keys(projectErrandPurpose(honest, {})).sort());
    // The DM arm still sees everything, so the veil above is a DECISION and not an
    // emptied payload — the recorded empty-harness vacuity class, refused.
    const dm = projectErrandPurpose(healed, { includeCovert: true });
    expect(dm.purposeClass).toBe('covert');
    expect(dm.covert.subjectId).toBe('irontown');
  });

  test('REPAIR R1 — the SAME leak reached from INSIDE, through an SP-D-R4 door', () => {
    // The import forgery is not the only way to a faceless covert row. DOOR 1 drops a pair
    // built on an out-of-vocabulary word, and what it leaves behind is the identical state.
    // A repair pinned only against the forged row would miss this entrance entirely.
    const minted = mintRow(litWorld(), { covert: mission() });
    const healed = normalizeErrand({ ...minted.errand, declaredPurpose: 'piracy' });
    expect(healed.purposeClass).toBe('covert'); // anchored: DOOR 1 kept the class, dropped the pair
    expect(healed.declaredPurpose).toBeUndefined();
    expect(projectErrandPurpose(healed, {}).purposeClass).toBe('diplomatic');
    // And a row whose written FACE names the secret is not wearing a face at all.
    const selfNaming = normalizeErrand({
      ...minted.errand, declaredPurpose: 'covert', truePurpose: 'covert',
    });
    expect(selfNaming.purposeClass).toBe('covert'); // anchored: the row really resolves covert
    expect(declaredPurposeClassOf(selfNaming)).toBe('diplomatic');
    expect(projectErrandPurpose(selfNaming, {}).purposeClass).toBe('diplomatic');
  });

  test('REPAIR R1 — the SELF-NAMING FACE door, pinned on a RAW row because nothing else can reach it', () => {
    // ⚠ THIS DOOR NEEDS ITS OWN ROW AND A ROW THE PERSIST SEAM NEVER PRODUCES. The guard
    // `declared !== 'covert'` was planted-and-deleted at this repair (mutant M2) and the
    // whole battery stayed GREEN at 31/31, because the assertion above routes through
    // `normalizeErrand`, and `errandSpineBlock` DROPS a redundant pair — so the normalized
    // row arrives at the reader with no `declaredPurpose` at all and exercises a different
    // door. `declaredPurposeClassOf` is exported, typed `unknown`, and documented total, so
    // the door is real defense against an un-normalized row; it is pinned here DIRECTLY, on
    // raw input, per the estate's rule that two guards over one job cannot be pinned jointly.
    const raw = { purpose: 'sue', purposeClass: 'covert', declaredPurpose: 'covert' };
    // anchored: the raw row really does resolve to the secret class, so this measures the
    // guard rather than an object the function was never going to say the word about.
    expect(purposeClassOf(raw)).toBe('covert');
    expect(declaredPurposeClassOf(raw)).toBe('diplomatic');
    // A LAWFUL face on the same shape still wins — the door rejects one word, not the arm.
    expect(declaredPurposeClassOf({ ...raw, declaredPurpose: 'commercial' })).toBe('commercial');
  });

  test('REPAIR R1 — the veil narrows NOTHING for the five honest classes', () => {
    // The guard must not become a general downgrade: every non-secret class still reads
    // back exactly as written, so the repair is a veil and not a lossy filter.
    for (const purposeClass of ENVOY_PURPOSE_CLASSES.filter((c) => c !== 'covert')) {
      expect(declaredPurposeClassOf({ purpose: 'sue', purposeClass })).toBe(purposeClass);
      expect(declaredPurposeClassOf({ purpose: 'sue', declaredPurpose: purposeClass }))
        .toBe(purposeClass);
    }
    // A plain war errand with no spine cargo at all is untouched by any of it.
    expect(declaredPurposeClassOf({ purpose: 'sue' })).toBe('diplomatic');
  });

  test('REPAIR R1 TOTALITY — no PURPOSE derives the covert class, so a written class is the only door', () => {
    // The chokepoint heal drops `purposeClass` to send a faceless row back to its DERIVED
    // class. That is only a cure while no purpose DERIVES `covert`; a future purpose that
    // did would resolve covert with nothing to drop, and would re-open the hole from the
    // other side. This reds in that wave rather than in a player's inspector.
    const derived = Object.values(PURPOSE_CLASS_BY_PURPOSE);
    expect(derived.length).toBeGreaterThan(0); // anchored: the map is non-empty, so this is a measurement
    expect(derived).not.toContain('covert');
    expect(new Set(derived)).toEqual(new Set(['diplomatic']));
  });

  test('A COVERT BLOCK ON A NON-COVERT ROW IS DROPPED at the persist side', () => {
    const minted = mintRow(litWorld());
    const forged = JSON.parse(JSON.stringify(minted.errand));
    forged.covert = mission();
    // A perfectly WELL-FORMED mission attached to a diplomatic errand is still cargo on
    // the wrong journey. The class law lives in one place and this is it.
    expect(normalizeErrand(forged).covert).toBeUndefined();
    expect(normalizeCovertMission(forged.covert).reason).toBe('covert');
  });

  test('LEGACY BYTE-IDENTITY: a row with no mission is untouched by any of this', () => {
    const plain = mintRow(litWorld());
    const before = JSON.stringify(plain.errand);
    expect(JSON.stringify(normalizeErrand(JSON.parse(before)))).toBe(before);
    // anchored: the round-trip equality on the line above proves `before` is a real
    // serialized errand, so this absence measures the row rather than an empty string.
    expect(before).not.toContain('covert'); // anchored: the round-trip equality above proves `before` is a real serialized errand
  });

  test('THE VEIL: two seeded rows, one honest and one lying, look IDENTICAL to a player', () => {
    // Driven by REAL rows rather than an empty harness: an absence asserted over a row
    // that never carried a mission would pass with the whole feature deleted.
    const honest = mintRow(litWorld()).errand;
    const spy = mintRow(litWorld(), { covert: mission({ itinerary: [
      { face: 'declared', settlementId: 'irontown', stayTicks: 2 },
      { face: 'covert', settlementId: 'westmarch', stayTicks: 3 },
    ] }) }).errand;
    expect(spy.covert.itinerary).toHaveLength(2);
    const player = (row) => projectErrandPurpose(row, {});
    expect(player(spy)).toEqual(player(honest));
    expect(player(spy)).toEqual({ errandId: spy.id, purposeClass: 'diplomatic' });
    // Not merely the same VALUES — the same KEYS, because the presence of a key IS the
    // tell that a secret exists.
    expect(Object.keys(player(spy)).sort()).toEqual(Object.keys(player(honest)).sort());
    // anchored: the two assertions above prove the player payload is a real two-key
    // object equal to the honest embassy's, and the DM assertions below prove the SAME
    // seeded row really carries both words — so these absences are a veil measurement.
    expect(JSON.stringify(player(spy))).not.toContain('westmarch'); // anchored: the DM assertions below prove this same seeded row carries the word
    expect(JSON.stringify(player(spy))).not.toContain('covert'); // anchored: the DM assertions below prove this same seeded row carries the word
    // The DM sees all of it, so the veil above is a decision and not an empty payload.
    const dm = projectErrandPurpose(spy, { includeCovert: true });
    expect(dm.purposeClass).toBe('covert');
    expect(dm.covert.itinerary[1].settlementId).toBe('westmarch');
    expect(dm.declaredPurpose).toBe('diplomatic');
    // ...and the DM's copy is DETACHED: holding it cannot reach the row.
    expect(dm.covert).not.toBe(spy.covert);
    dm.covert.itinerary.length = 0;
    expect(spy.covert.itinerary).toHaveLength(2);
    // The honest embassy's DM view carries no mission at all — the other half of the pair.
    expect(projectErrandPurpose(honest, { includeCovert: true }).covert).toBeUndefined();
  });

  test('THE CONCURRENCY CAP AND DOUBLE-TRAVEL refuse a spy exactly as they refuse an envoy', () => {
    // Not re-spelled in the espionage layer, so the proof is that the WRITER's refusals
    // still fire on a covert mint. A court cannot flood the roads with operatives.
    const world = litWorld();
    const first = mintRow(world, { covert: mission() });
    expect(first.reason).toBe('minted');
    const again = mintRow(first.worldState, { covert: mission() });
    expect(again.reason).toBe('duplicate_episode');
    const second = { ...peaceOffer({ to: 'westmarch' }), id: 'peace.offer.2' };
    const sameNpcElsewhere = mintEnvoyErrand({
      worldState: first.worldState,
      outcome: second,
      acceptance: acceptedRuling(second),
      npcId: 'npc.reeve',
      snapshot: SNAPSHOT,
      purpose: 'sue',
      purposeClass: 'covert',
      covert: mission({ subjectId: 'westmarch' }),
      routePlan: { legs: [{ fromId: 'ashford', toId: 'westmarch', departTick: 10, arrivalTick: 12 }], expectedReturnTick: 20, routeRef: { id: 'road.west' } },
      tick: 10,
    });
    expect(sameNpcElsewhere.reason).toBe('npc_in_transit');
  });
});
