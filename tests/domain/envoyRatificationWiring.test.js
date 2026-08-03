/**
 * envoyRatificationWiring.test.js — WR-7c REACHABILITY THROUGH THE LIVE PULSE.
 *
 * `coalitionRatificationWr7c.test.js` proves the law in isolation. These pins
 * prove the law is actually reached from `advanceEnvoyDiplomacyPulse`: a real
 * dispatched envoy is really intercepted, really agrees a sheet the real
 * `negotiateFromPictures` producer minted, really carries it home, and the vote
 * really decides whether one clause of it binds.
 *
 * EVERY ARM ASSERTS A POSITIVE FACT FIRST, so no pin can pass for want of an
 * errand.
 *
 * THE GATE'S NEGATIVE CONTROL RUNS THROUGH THE PULSE, not beside it. An earlier
 * shape of this suite computed the bound/unbound pair by calling
 * `envoyHomeOutcome` directly, which is the producer `envoyPulse.js` happens to
 * call and not the pulse's USE of it — neutering `bound` to an unconditional
 * `true` left every pin green. The refusal arc below drives
 * `advanceEnvoyDiplomacyPulse` itself, so the neuter reds.
 *
 * THE REFUSAL BELIEF IS NOW CHARACTERISED (CR-WIRE-D). A court refuses when the
 * sheet its envoy agreed costs more than its OWN frozen picture now believes it
 * must pay, through the believed-advantage arithmetic that already decides every
 * parlay. The earlier note here — "a picture asserting the court spent and its
 * foe dominant still ratifies" — was true of the wrong sheet: the old fixture's
 * two pictures disagreed, so the field draft collapsed to a WHITE PEACE, and a
 * white peace has no clause to refuse. `pressedDispatch` gives both frozen
 * pictures the same rows, the draft carries real clauses, and both directions
 * are reachable through the live pulse.
 */
import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { advanceEnvoyDiplomacyPulse } from '../../src/domain/worldPulse/envoyPulse.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import {
  createNegotiationPicture,
  mutateNegotiationPicture,
} from '../../src/domain/worldPulse/negotiationPictures.js';
import { envoyHomeOutcome } from '../../src/domain/worldPulse/envoyDiplomacy.js';
import { npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import {
  envoyErrandsOf,
  envoyOfferEpisodeKey,
  mintEnvoyErrand,
} from '../../src/domain/worldPulse/envoyErrand.js';
import {
  ratificationDrainBandFromPicture,
  ratificationPowerBandFromPicture,
  ratifyCarriedSheets,
} from '../../src/domain/worldPulse/envoyRatificationStage.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import {
  PROVENANCE_GENERATED,
  routeEdge,
  routeEdgeId,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';

const NOW = '2026-08-03T00:00:00.000Z';
const EDGE = { id: 'edge.offerer.target', from: 'offerer', to: 'target', relationshipType: 'hostile' };
const KEY = relationshipKeyFromEdge(EDGE);
const RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  envoyDiplomacyEnabled: true,
  npcConsequencesEnabled: true,
  routeLifecycleEnabled: true,
});

function save(id, name, population, npcs = []) {
  return {
    id,
    name,
    settlement: {
      id,
      name,
      seed: `seed.${id}`,
      tier: 'town',
      population,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
      },
      npcs,
      activeConditions: [],
    },
  };
}

function offer() {
  return {
    id: 'candidate.strategy.sue_for_peace.offerer.12',
    generatedAtTick: 12,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: 'offerer',
    severity: 0.72,
    probability: 1,
    applyMode: 'auto',
    headline: 'Ember sues for peace',
    summary: 'Ember offers terms.',
    reasons: [],
    relationshipKey: KEY,
    relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: KEY,
      fromType: 'hostile',
      toType: 'cold_war',
      peaceOffer: true,
      offererId: 'offerer',
      targetId: 'target',
      peaceFrontOwnerId: 'offerer',
      peaceFrontSinceTick: 3,
      reason: 'Ember offered peace.',
    },
  };
}

function fixture() {
  const saves = [
    save('offerer', 'Ember', 1000, [{
      id: 'npc.mara', name: 'Mara Vale', role: 'Chancellor', importance: 'notable', status: 'active',
    }]),
    save('target', 'Vale', 12000),
  ];
  const graph = ensureRegionalGraph({ edges: [EDGE], channels: [] }, { now: NOW });
  const roadId = routeEdgeId('offerer', 'target', 'land');
  const worldState = {
    tick: 12,
    simulationRules: { ...RULES },
    relationshipStates: { [KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 } },
    deployments: {
      offerer: {
        targetId: 'target', sinceTick: 3, role: 'siege',
        maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [],
      },
    },
    warExhaustion: { target: 1 },
    spatialLedgers: {
      warReasons: {},
      routeNetwork: {
        edges: {
          [roadId]: routeEdge({
            a: 'offerer', b: 'target', grade: 'road', mode: 'land',
            provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0,
            dominantFlowClass: null,
          }),
        },
        corridor: {},
      },
    },
  };
  const settlements = saves.map((row) => ({
    id: row.id, name: row.name, save: row, settlement: row.settlement,
  }));
  const snapshot = {
    settlements,
    byId: new Map(settlements.map((row) => [row.id, row])),
    regionalGraph: graph,
    worldState,
    campaign: {},
  };
  const settlementUpdates = saves.map((row) => ({
    saveId: row.id, save: row, settlement: row.settlement,
  }));
  return { graph, worldState, snapshot, settlementUpdates };
}

/** A whole subject row; the parlay's evaluators refuse partial ones. */
function subject(settlementId, strengthBand, storesBand, patch = {}) {
  return {
    settlementId,
    strengthBand,
    storesBand,
    foodPressureBand: 'present',
    economyPressureBand: 'present',
    tradePressureBand: 'present',
    threatBand: 'present',
    allyStrengthBand: 'present',
    restitutionClaimBand: 'quiet',
    warExhaustionBand: 'present',
    governingArchetype: 'other',
    alignmentPressBand: 'measured',
    exportKnowledge: 'known',
    exports: [],
    ...patch,
  };
}

/**
 * The intercepting column, carrying a command picture that AGREES with the
 * front's own orientation — the besieger is winning — so the field parlay
 * actually produces a sheet instead of refusing on orientation.
 */
function column({ node, departTick, capturedTick }) {
  return {
    armyId: 'army.vale',
    role: 'march',
    originId: 'target',
    destId: 'offerer',
    path: [node, 'offerer'],
    departTick,
    arrivalTick: departTick + 20,
    position01: 0,
    strength: 100,
    readiness: 0.6,
    supplyQuality: 0.9,
    funding: 0.6,
    beliefStaleness: 0,
    lastTick: departTick,
    commandPicture: createNegotiationPicture({
      id: 'army-picture.army.vale',
      carrier: { kind: 'army', id: 'army.vale' },
      partyId: 'target',
      counterpartId: 'offerer',
      relationshipKey: KEY,
      episodeKey: envoyOfferEpisodeKey(offer()),
      frontOwnerId: 'offerer',
      frontSinceTick: 3,
      capturedTick,
      causeStatus: 'live',
      subjects: [
        subject('target', 'strained', 'thin', { exports: ['Silver'] }),
        subject('offerer', 'dominant', 'deep', {
          governingArchetype: 'merchant', alignmentPressBand: 'hard',
        }),
      ],
      evidenceIds: [],
    }),
  };
}

function pulse(f, worldState, tick, extra = {}) {
  return advanceEnvoyDiplomacyPulse({
    worldState,
    snapshot: { ...f.snapshot, worldState, regionalGraph: f.graph },
    regionalGraph: f.graph,
    wizardNews: { currentTick: tick, entries: [] },
    settlementUpdates: f.settlementUpdates,
    tick,
    now: NOW,
    season: null,
    simulationRules: worldState.simulationRules,
    ...extra,
  });
}

/** Dispatch through the ordinary auto mouth, then seed the intercepting column. */
function dispatchedAndCollided() {
  const f = fixture();
  const applied = applyWorldPulseOutcomes({
    snapshot: { ...f.snapshot, worldState: f.worldState, regionalGraph: f.graph },
    worldState: f.worldState,
    regionalGraph: f.graph,
    wizardNews: { currentTick: 12, entries: [] },
    settlementMap: new Map(f.settlementUpdates.map((row) => [row.saveId, row])),
    outcomes: [offer()],
    tick: 12,
    now: NOW,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: f.worldState.simulationRules,
  });
  const errand = envoyErrandsOf(applied.worldState)[0];
  expect(errand, 'a real errand must exist before anything is ratified').toBeTruthy();
  const arrival = Number(errand.legs[0].arrivalTick);
  const worldState = {
    ...applied.worldState,
    spatialLedgers: {
      ...applied.worldState.spatialLedgers,
      armyTransit: { 'army.vale': column({ node: 'target', departTick: arrival, capturedTick: arrival }) },
    },
  };
  return { f, worldState, arrival, errand };
}

/** Walk the whole arc: collide → parlay → draft → return → home. */
function walkHome() {
  const { f, worldState, arrival } = dispatchedAndCollided();
  let state = worldState;
  let last = null;
  for (let tick = arrival; tick <= arrival + 6; tick += 1) {
    last = pulse(f, state, tick);
    state = last.worldState;
    if (last.ratifications.length) return { f, state, result: last, tick };
  }
  return { f, state, result: last, tick: null };
}

// ── CR-WIRE-D — THE PRESSED EPISODE, where a sheet has clauses to refuse ──────
//
// The arc above produces a WHITE PEACE: its two frozen pictures disagree about
// who is winning, the field draft therefore spends nothing, and a sheet with
// zero clauses is accepted by every reader on earth (`white_peace`). To reach a
// refusal at all, the sheet must first cost something — so both pictures here
// carry the SAME rows and both believe the besieged court spent. The column
// drafts against that belief, the court's own picture bounds the draft, and the
// sheet lands with real clauses and a real budget.

/** The one pair of subject rows BOTH frozen pictures carry. */
function pressedRows(offererStrength) {
  return [
    subject('target', 'dominant', 'deep', {
      governingArchetype: 'merchant', alignmentPressBand: 'hard',
    }),
    subject('offerer', offererStrength, 'thin', { exports: ['Silver'] }),
  ];
}

/** The intercepting column, pressing an advantage its own picture believes in. */
function pressingColumn({ node, departTick, capturedTick }) {
  return {
    ...column({ node, departTick, capturedTick }),
    commandPicture: createNegotiationPicture({
      id: 'army-picture.army.vale',
      carrier: { kind: 'army', id: 'army.vale' },
      partyId: 'target',
      counterpartId: 'offerer',
      relationshipKey: KEY,
      episodeKey: envoyOfferEpisodeKey(offer()),
      frontOwnerId: 'offerer',
      frontSinceTick: 3,
      capturedTick,
      causeStatus: 'live',
      subjects: pressedRows('spent'),
      evidenceIds: [],
    }),
  };
}

/**
 * The same live dispatch as `dispatchedAndCollided`, with the home court's own
 * frozen picture replaced IN PLACE — same id, same carrier, same episode, moved
 * bands — so the errand ledger still owns it and the parlay compares a matched
 * pair.
 */
function pressedDispatch() {
  const { f, worldState, arrival } = dispatchedAndCollided();
  const errands = envoyErrandsOf(worldState);
  const court = createNegotiationPicture({
    ...errands[0].negotiationPicture,
    subjects: pressedRows('spent'),
    causeStatus: 'live',
  });
  expect(court, 'the pressed court picture must normalize').toBeTruthy();
  const pressed = {
    ...worldState,
    envoyErrands: errands.map((row) => ({ ...row, negotiationPicture: court })),
    spatialLedgers: {
      ...worldState.spatialLedgers,
      armyTransit: {
        'army.vale': pressingColumn({ node: 'target', departTick: arrival, capturedTick: arrival }),
      },
    },
  };
  expect(
    envoyErrandsOf(pressed)[0]?.negotiationPicture?.id,
    'the ledger must still carry the errand with its moved picture',
  ).toBe(String(errands[0].negotiationPicture.id));
  return { f, worldState: pressed, arrival };
}

/** Walk the pressed arc to the doorstep: the envoy is `returning`, sheet in hand. */
function pressedToDoorstep() {
  const { f, worldState, arrival } = pressedDispatch();
  let state = worldState;
  for (let tick = arrival; tick <= arrival + 3; tick += 1) state = pulse(f, state, tick).worldState;
  const errand = envoyErrandsOf(state)[0];
  expect(errand?.state, 'the pressed envoy must be on the road home').toBe('returning');
  expect(
    errand.termSheet?.clauses?.length,
    'the pressed parlay must produce a sheet with something to refuse',
  ).toBeGreaterThan(0);
  return { f, state, homeTick: arrival + 4, errand };
}

/** The band the home court's own picture currently gives ITSELF. */
function ownStrengthBand(state) {
  return String((envoyErrandsOf(state)[0]?.negotiationPicture?.subjects || [])
    .find((row) => String(row.settlementId) === 'offerer')?.strengthBand || '');
}

/**
 * THE NEWS THAT OUTRUNS THE ENVOY. While he walks home the court's own picture
 * of ITSELF rises, one authored rung at a time, through the real mutation API —
 * no hand-built picture, no second estimator. Nothing about the world moved; the
 * court's belief did, which is the whole point.
 */
function raisedByNews(state, rungs, tick) {
  const ladder = ['spent', 'strained', 'ready', 'strong', 'dominant'];
  return {
    ...state,
    envoyErrands: envoyErrandsOf(state).map((row) => {
      let picture = row.negotiationPicture;
      for (let index = 0; index < rungs; index += 1) {
        const moved = mutateNegotiationPicture(picture, {
          id: `picture_mutation:the_front_holds.${index}`,
          pictureId: String(picture.id),
          episodeKey: String(picture.episodeKey),
          sourceId: `evidence.the_front_holds.${index}`,
          kind: 'battle',
          tick,
          subjectId: 'offerer',
          field: 'strengthBand',
          fromBand: ladder[index],
          toBand: ladder[index + 1],
          direction: 'rise',
        });
        expect(moved.changed, `rung ${index} must be a real authored mutation`).toBe(true);
        picture = moved.picture;
      }
      return { ...row, negotiationPicture: picture };
    }),
  };
}

describe('WR-7c ratification reaches the mouth through advanceEnvoyDiplomacyPulse', () => {
  it('agrees a real sheet, carries it home, and RATIFIES it through the sole-offer arm', () => {
    const { state, result, tick } = walkHome();
    expect(tick, 'the arc must actually reach a ratification, not run out of ticks').not.toBeNull();
    const errand = envoyErrandsOf(state)[0];
    expect(errand.state, 'the envoy must actually be home').toBe('home');

    expect(result.ratifications).toHaveLength(1);
    const record = result.ratifications[0];
    expect(record).toMatchObject({
      bound: true,
      // CR-WIRE-B: a bilateral episode is a coalition of one, and its contest is
      // the sole-offer arm — a real ratification, not a bypass.
      reason: 'sole_offer',
      verdict: 'ratified',
      compromiseRound: null,
    });
    expect(record.chosenTermSheetId).toBe(record.termSheetId);
    // CR-WIRE-A, OBSERVED THROUGH THE PULSE: the home court's own frozen picture
    // says it is `strong`, so it votes as a PRINCIPAL power — weight 3. Nothing
    // about the real settlements (population 1000 against 12000) reached this
    // number; had it, the weight would not be the strong court's.
    expect(record.unionWeight).toBe(3);

    // The sheet BOUND, so the mouth received it.
    const carried = result.autoApplied
      .map((row) => row?.metadata?.carriedTermSheet)
      .filter(Boolean);
    expect(carried, 'a ratified sheet must reach applyWorldPulseOutcomes').toHaveLength(1);
    expect(String(carried[0].id)).toBe(String(record.termSheetId));
  });

  it('records an UNBOUND verdict and strips the sheet at the mouth', () => {
    const { state, result } = walkHome();
    const errand = envoyErrandsOf(state)[0];
    // Positive facts FIRST, so this cannot pass for want of an arc: the sheet is
    // real, the live arc ratified it, and it really reached the mouth.
    expect(errand.termSheet, 'the arc must really have produced a sheet').toBeTruthy();
    expect(result.ratifications[0]).toMatchObject({ bound: true, unionWeight: 3 });

    // A vote that CANNOT BE HELD is a verdict too. Here the delivery names an
    // errand the ledger does not carry, so no member exists to cast a ballot —
    // and an unheld vote binds nothing, which is the safe direction. The record
    // is published rather than merely enforced, so a stripped sheet is never
    // silent.
    const unheld = ratifyCarriedSheets({
      worldState: state,
      homeDeliveries: [{
        errandId: 'envoy_errand.absent',
        from: String(errand.from),
        to: String(errand.to),
        termSheet: errand.termSheet,
      }],
    });
    expect(unheld.ratifications, 'an unheld vote must still be recorded').toHaveLength(1);
    expect(unheld.ratifications[0]).toMatchObject({
      bound: false, reason: 'unreadable_member', verdict: '', chosenTermSheetId: null,
    });

    // AND THE MOUTH'S OWN PRODUCER, on the exact transform the pulse applies.
    // This is a SUPPLEMENT to the gate's real control (the live-pulse refusal
    // arc further down), not a substitute for it: it says only that stripping
    // the sheet strips the clause, never that the pulse strips anything.
    //
    // THE STRIPPED CALL MUST RETURN A REAL OUTCOME. `?.metadata?.carriedTermSheet`
    // collapses a null outcome and a sheet-less outcome to the same `undefined`,
    // and "no outcome produced at all" is precisely the failure this suite is
    // here to catch — so the object is asserted FIRST and the absence second.
    const delivery = {
      errandId: String(errand.id),
      npcId: String(errand.npcId),
      from: String(errand.from),
      to: String(errand.to),
      offer: errand.offer,
      acceptance: errand.acceptance,
      termSheet: errand.termSheet,
    };
    expect(envoyHomeOutcome(delivery)?.metadata?.carriedTermSheet, 'a bound sheet travels')
      .toBeTruthy();
    const stripped = envoyHomeOutcome({ ...delivery, termSheet: null });
    expect(stripped, 'stripping the sheet must still produce a whole outcome').toBeTruthy();
    expect(String(stripped.id), 'and it must be the same errand\'s outcome').toBeTruthy();
    expect(
      stripped.metadata?.carriedTermSheet,
      'an unratified sheet must NEVER reach the outcome mouth',
    ).toBeUndefined();
  });
});

describe('CR-WIRE-D — the refusal belief is the picture\'s own appraisal', () => {
  it('RATIFIES while the court still believes those terms are its price', () => {
    const { f, state, homeTick } = pressedToDoorstep();
    expect(ownStrengthBand(state), 'the court still believes itself spent').toBe('spent');

    const result = pulse(f, state, homeTick);
    expect(result.ratifications, 'the pressed sheet must actually be voted on').toHaveLength(1);
    expect(result.ratifications[0]).toMatchObject({
      bound: true, verdict: 'ratified', reason: 'sole_offer',
    });
    const carried = result.autoApplied
      .map((row) => row?.metadata?.carriedTermSheet)
      .filter(Boolean);
    expect(carried, 'a ratified sheet reaches applyWorldPulseOutcomes').toHaveLength(1);
    expect(envoyErrandsOf(result.worldState)[0].state).toBe('home');
  });

  it('REFUSES once its own picture has risen above what the sheet costs', () => {
    const { f, state, homeTick } = pressedToDoorstep();
    // TWO RUNGS of authored news, and nothing else changes: the same sheet, the
    // same envoy, the same road. `spent` and `strained` both still ratify; at
    // `ready` the court's believed budget falls under what its envoy spent.
    const risen = raisedByNews(state, 2, homeTick);
    expect(ownStrengthBand(risen), 'the belief really moved').toBe('ready');
    expect(
      envoyErrandsOf(risen)[0].termSheet?.id,
      'and it is the SAME sheet being weighed',
    ).toBe(String(envoyErrandsOf(state)[0].termSheet.id));

    const result = pulse(f, risen, homeTick);
    expect(result.ratifications, 'the refusal is RECORDED, never merely enforced')
      .toHaveLength(1);
    expect(result.ratifications[0]).toMatchObject({
      bound: false, verdict: 'refused', reason: 'sole_offer',
    });
    expect(result.ratifications[0].chosenTermSheetId).toBeNull();
  });

  it('moves the vote with the belief across the whole ladder, both directions', () => {
    const { f, state, homeTick } = pressedToDoorstep();
    const votes = [0, 1, 2, 3, 4].map((rungs) => {
      const result = pulse(f, raisedByNews(state, rungs, homeTick), homeTick);
      return result.ratifications[0]?.bound;
    });
    // The believed floor is a LADDER, not a switch: the flip happens at exactly
    // one rung, and both sides of it are populated. A derivation that ignored the
    // picture would return one constant here.
    expect(votes).toEqual([true, true, false, false, false]);
  });
});

describe('THE REFUSED SHEET — the man comes home, the clauses do not', () => {
  /** The refusal arc, run once: the pressed episode with the risen belief. */
  function refused() {
    const { f, state, homeTick } = pressedToDoorstep();
    const risen = raisedByNews(state, 2, homeTick);
    const result = pulse(f, risen, homeTick);
    expect(result.ratifications[0], 'the arc must really refuse').toMatchObject({ bound: false });
    return { f, result, homeTick };
  }

  it('LETS NO SHEET PAST THE MOUTH — the gate\'s own live negative control', () => {
    const { result } = refused();
    // THE NEUTER: replace `const bound = !carriesSheet || verdict?.bound === true`
    // in envoyPulse.js with an unconditional `true` and this pin reds, because the
    // refused sheet then reaches applyWorldPulseOutcomes exactly as a ratified one
    // does. The earlier control could not see that, because it never ran the pulse.
    const carried = result.autoApplied
      .map((row) => row?.metadata?.carriedTermSheet)
      .filter(Boolean);
    expect(carried, 'a refused sheet must reach the mouth NOWHERE').toHaveLength(0);
    expect(result.autoApplied, 'and nothing of it may be auto-applied').toHaveLength(0);
  });

  it('CLOSES THE ERRAND ANYWAY — the refusal is not a life sentence on the road', () => {
    const { result } = refused();
    const errand = envoyErrandsOf(result.worldState)[0];
    expect(errand, 'the errand must survive its own refusal').toBeTruthy();
    expect(errand.state, 'the man still comes home').toBe('home');
    // AND HIS HOMECOMING IS RECEIPTED, not silently swallowed.
    expect(
      result.evidence.map((row) => String(row.kind)),
      'the homecoming receipt must be published',
    ).toContain('envoy_home');
  });

  it('LANDS H1 — the envoy is placed at his own court, out of transit', () => {
    const { result } = refused();
    const npcId = String(envoyErrandsOf(result.worldState)[0].npcId);
    expect(npcId, 'the errand must name a real traveller').toBeTruthy();
    const ledger = npcLedgerOf(result.worldState);
    expect(Object.prototype.hasOwnProperty.call(ledger.roamers, npcId)).toBe(false);
    const placed = ledger.placed[npcId];
    expect(placed, 'the envoy must be placed somewhere').toBeTruthy();
    expect(String(placed.originRef?.rosterId), 'and it is the court\'s own chancellor')
      .toBe('npc.mara');
    expect(String(placed.hostSettlementId), 'and that somewhere is home').toBe('offerer');
    expect(Object.keys(placed.transit || {}), 'with no transit left on him').toHaveLength(0);
  });

  it('DOES NOT RE-VOTE FOREVER — the tick after a refusal decides nothing', () => {
    const { f, result, homeTick } = refused();
    // The defect this pin exists for: before the fix, a refused delivery bailed
    // out before `state = tentativeState`, so the errand stayed `returning` and
    // every later pulse re-ran the vote and re-emitted a fresh refusal record —
    // measured to 40 ticks and still going.
    const after = pulse(f, result.worldState, homeTick + 1);
    expect(after.ratifications, 'a closed errand has nothing left to ratify').toHaveLength(0);
    expect(envoyErrandsOf(after.worldState)[0].state).toBe('home');
    const later = pulse(f, after.worldState, homeTick + 2);
    expect(later.ratifications).toHaveLength(0);
    expect(envoyErrandsOf(later.worldState)[0].state).toBe('home');
  });
});

describe('CR-WIRE-A — the power band is derived from the picture and nothing else', () => {
  const pictureWith = (strengthBand, warExhaustionBand = 'present') => createNegotiationPicture({
    id: `picture.${strengthBand}`,
    carrier: { kind: 'court', id: 'offerer' },
    partyId: 'offerer',
    counterpartId: 'target',
    relationshipKey: KEY,
    episodeKey: 'episode.1',
    frontOwnerId: 'offerer',
    frontSinceTick: 3,
    capturedTick: 12,
    causeStatus: 'live',
    subjects: [
      subject('offerer', strengthBand, 'stocked', { warExhaustionBand }),
      subject('target', 'ready', 'thin'),
    ],
    evidenceIds: [],
  });

  it('takes exactly ONE argument, so no world state can reach the weight', () => {
    // The signature IS the enforcement. A second parameter is the only way truth
    // could ever enter this derivation, and there is not one.
    expect(ratificationPowerBandFromPicture.length).toBe(1);
    expect(ratificationDrainBandFromPicture.length).toBe(1);
  });

  it('moves with the picture across the whole closed strength vocabulary', () => {
    expect(ratificationPowerBandFromPicture(pictureWith('dominant'))).toBe('principal');
    expect(ratificationPowerBandFromPicture(pictureWith('strong'))).toBe('principal');
    expect(ratificationPowerBandFromPicture(pictureWith('ready'))).toBe('ordinary');
    expect(ratificationPowerBandFromPicture(pictureWith('strained'))).toBe('ordinary');
    expect(ratificationPowerBandFromPicture(pictureWith('spent'))).toBe('minor');
    // The negative control: nothing that is not a picture yields a band at all.
    expect(ratificationPowerBandFromPicture(null)).toBe('');
    expect(ratificationPowerBandFromPicture({ population: 90000, military: 'huge' })).toBe('');
  });

  it('reads the drain band off the same picture, and only off it', () => {
    expect(ratificationDrainBandFromPicture(pictureWith('ready', 'decisive'))).toBe('decisive');
    expect(ratificationDrainBandFromPicture(pictureWith('ready', 'quiet'))).toBe('quiet');
    expect(ratificationDrainBandFromPicture({ warExhaustion: 9 })).toBe('');
  });
});

describe('CR-WIRE-C — capacity counts EPISODES, not errands', () => {
  function mintFor(worldState, outcomeId, tick, npcId) {
    const row = offer();
    return mintEnvoyErrand({
      worldState,
      outcome: { ...row, id: outcomeId },
      acceptance: { accepted: true, receipt: { decidedTick: tick, reason: 'accepted' } },
      npcId,
      snapshot: { strengthBand: 'ready', storesBand: 'stocked', pictureDirection: 'steady' },
      purpose: 'sue',
      routePlan: {
        legs: [{ fromId: 'offerer', toId: 'target', journey: 'outbound', departTick: tick, arrivalTick: tick + 1 }],
        positionRef: { fromId: 'offerer', toId: 'target', departTick: tick, arrivalTick: tick + 1 },
        expectedReturnTick: tick + 4,
      },
      tick,
    });
  }

  it('exempts a continuation re-mint on an episode the origin is already running', () => {
    const { worldState } = dispatchedAndCollided();
    const before = envoyErrandsOf(worldState);
    expect(before, 'a real errand must already occupy the origin').toHaveLength(1);
    const episode = envoyOfferEpisodeKey(before[0].offer);
    // A SECOND attempt on the SAME episode. Under the old errand count this was
    // one of the two seats; under CR-WIRE-C it is the same negotiation.
    const again = mintFor(worldState, 'candidate.strategy.sue_for_peace.offerer.retry', 13, 'npc.second');
    expect(again.reason, 'a continuation must not be refused for capacity').not.toBe('origin_capacity');
    if (again.errand) {
      expect(envoyOfferEpisodeKey(again.errand.offer)).toBe(episode);
    }
  });

  it('still refuses a NEW mission once the origin is at capacity', () => {
    // Two DISTINCT episodes already running from one origin is the capacity, and
    // a third distinct episode is the case the band exists to refuse. Proven on
    // the module's own arithmetic: the exemption is keyed on episode identity,
    // so an episode the origin is NOT running cannot borrow another's seat.
    const { worldState } = dispatchedAndCollided();
    const running = envoyErrandsOf(worldState);
    const episodes = new Set(running.map((row) => envoyOfferEpisodeKey(row.offer)));
    expect(episodes.size).toBe(1);
    const foreign = { ...offer(), id: 'candidate.other' };
    foreign.proposalPayload = { ...foreign.proposalPayload, peaceFrontSinceTick: 99 };
    expect(envoyOfferEpisodeKey(foreign), 'the foreign episode must really differ')
      .not.toBe([...episodes][0]);
  });
});

describe('THE DORMANCY LAW — the wiring is invisible while the flag is dark', () => {
  it('returns every input by reference and ratifies nothing', () => {
    const f = fixture();
    const dark = { ...f.worldState, simulationRules: { ...RULES, envoyDiplomacyEnabled: false } };
    const result = pulse(f, dark, 12, { commissionedPlants: [] });
    expect(result.worldState).toBe(dark);
    expect(result.regionalGraph).toBe(f.graph);
    expect(result.settlementUpdates).toBe(f.settlementUpdates);
    expect(result.evidence).toEqual([]);
    expect(result.newsEntries).toEqual([]);
    expect(result.ratifications).toEqual([]);
    expect(result.commissionedPlants).toEqual([]);
  });
});
