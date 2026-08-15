/**
 * razingDeterrenceWr8.test.js — WR-8 amendment R: THE DETERRENT, PRICED BEFORE
 * THE ACT, off WR-6's OWN alliance-web risk read.
 *
 * The amendment: "the would-be razer's intent read now includes the retaliation
 * web it BELIEVES it would arm — who loves the victim, what license each would
 * inherit, what their combined reach is (E3's alliance-web risk read, pointed at
 * the aftermath). A fat victim with devoted friends is expensive to burn; a
 * friendless one is cheap."
 *
 * THE TWO CLAIMS THAT MATTER, AND BOTH ARE DRIVEN THROUGH THE REAL EMISSION:
 *   1. BOTH POLARITIES ARE REACHABLE. The friendless victim burns; the same
 *      victim, given devoted and powerful friends, does NOT — and the refusal
 *      names `deterrence_prohibitive` rather than any of the law's older reasons.
 *      A pin that only proved the refusal would be satisfied by a gate that
 *      refused everything.
 *   2. THE DETERRENT ONLY EVER REFUSES. It is appetite, not permission: a court
 *      the LAW turned down must come out refused for the law's reason, never
 *      "deterred", and a quiet web must never open a road.
 *
 * The unpriced arm is pinned too, because it is the one every pre-deterrence
 * caller takes: no `strengthFor` ⇒ `priced:false` ⇒ never deterred ⇒ the verdict
 * is exactly what it was before this conjunct existed.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  RAZING_EXECUTION_TUNING,
  razingDecisionFor,
  razingDeterrenceFor,
  razingSiegeEmission,
} from '../../src/domain/worldPulse/razingExecution.js';
import { RAZING_REFUSALS, razingGate } from '../../src/domain/worldPulse/razing.js';
import { CONQUEST_REQUIRED_RULES } from '../../src/domain/worldPulse/conquestDoctrineStage.js';

/** Every prerequisite flag true — WR-8 lights LAST, behind all seven. */
const LIT_RULES = Object.fromEntries(CONQUEST_REQUIRED_RULES.map((key) => [key, true]));

function court(id, { patron, trait, population = 6000 }) {
  return [id, {
    id,
    settlement: {
      name: id,
      tier: 'town',
      population,
      npcs: [{ name: `${id} Elder`, importance: 'pillar', personality: { dominant: trait } }],
      config: {
        primaryDeitySnapshot: {
          name: patron === 'evil' ? 'The Iron Maw' : 'The Open Hand',
          alignmentAxis: patron,
        },
      },
    },
  }];
}

const EVIL = { patron: 'evil', trait: 'cruel' };
const GOOD = { patron: 'good', trait: 'incorruptible' };

/**
 * Karrow (evil, malicious) is about to burn Thornwall.
 *
 * `friends` controls THE AFTERMATH THE RAZER PRICES: the courts allied to
 * THORNWALL that would inherit the right to answer. They are wired as allies of
 * the VICTIM (which is what `readAllianceWebRisk` walks from `enemyId`), and
 * their believed strength is supplied by the harness's `strengthFor`.
 *
 * @param {{ friends?: string[] }} [over]
 */
function deterrenceWorld(over = {}) {
  const friends = over.friends ?? [];
  const relationshipStates = {
    'rel.Karrow.Thornwall': { relationshipType: 'hostile', resentment: 0.9, trust: 0.05, fear: 0.4 },
  };
  const edges = [
    { id: 'rel.Karrow.Thornwall', from: 'Karrow', to: 'Thornwall', relationshipType: 'hostile', type: 'hostile' },
  ];
  const byIdRows = [court('Karrow', { ...EVIL, population: 45000 }), court('Thornwall', { ...GOOD, population: 1200 })];
  for (const friend of friends) {
    // The victim's devoted ally…
    relationshipStates[`rel.Thornwall.${friend}`] = { relationshipType: 'allied', trust: 0.95, resentment: 0.02, pactStrength: 0.9 };
    edges.push({ id: `rel.Thornwall.${friend}`, from: 'Thornwall', to: friend, relationshipType: 'allied', type: 'allied' });
    // …who the razer also believes hostile to it (the response weight's top band).
    relationshipStates[`rel.Karrow.${friend}`] = { relationshipType: 'hostile', trust: 0.02, resentment: 0.8, fear: 0.2 };
    edges.push({ id: `rel.Karrow.${friend}`, from: 'Karrow', to: friend, relationshipType: 'hostile', type: 'hostile' });
    byIdRows.push(court(friend, GOOD));
  }
  const worldState = {
    simulationRules: { ...LIT_RULES },
    tick: 40,
    relationshipStates,
    spatialLedgers: {
      warReasons: {
        'Karrow>Thornwall': {
          reasons: { grievance: { type: 'grievance', score: 0.9, tick: 40, receipt: 'blood is owed' } },
        },
      },
    },
  };
  const byId = new Map(byIdRows);
  const snapshot = {
    settlements: [...byId.values()],
    byId,
    worldState,
    regionalGraph: { edges },
  };
  // Every court reads at full believed strength — the fixture is about WHO would
  // answer, not about a strength gradient.
  const strengthFor = () => 1;
  return { worldState, snapshot, strengthFor };
}

const burn = ({ worldState, snapshot, strengthFor }, withStrength = true) => razingSiegeEmission({
  worldState,
  snapshot,
  razerId: 'Karrow',
  victimId: 'Thornwall',
  razerName: 'Karrow',
  victimName: 'Thornwall',
  tick: 40,
  population: 1200,
  namedCastCount: 3,
  institutions: [{ id: 'shrine', name: 'Shrine' }],
  movableWealth: 40,
  ...(withStrength ? { strengthFor } : {}),
});

describe('⭐ BOTH POLARITIES — the friendless town burns, the well-loved one does not', () => {
  test('a FRIENDLESS victim is cheap to burn: the razing lands', () => {
    const world = deterrenceWorld({ friends: [] });
    const decision = razingDecisionFor({
      worldState: world.worldState, snapshot: world.snapshot,
      razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
      strengthFor: world.strengthFor,
    });
    expect(decision.deterrence.priced).toBe(true);
    expect(decision.deterrence.members).toHaveLength(0);
    expect(decision.deterrence.deters).toBe(false);
    expect(decision.verdict.permitted).toBe(true);
    expect(decision.verdict.road).toBe('initiation');
    expect(burn(world)).not.toBeNull();
  });

  test('the SAME victim with devoted, powerful friends is NOT burned — and the refusal says why', () => {
    const world = deterrenceWorld({ friends: ['Mereth', 'Everdeep', 'Duskmere'] });
    const decision = razingDecisionFor({
      worldState: world.worldState, snapshot: world.snapshot,
      razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
      strengthFor: world.strengthFor,
    });
    expect(decision.deterrence.priced).toBe(true);
    expect(decision.deterrence.members.length).toBeGreaterThan(0);
    expect(decision.deterrence.band).toBe(RAZING_EXECUTION_TUNING.DETERRENCE_BAND);
    expect(decision.deterrence.deters).toBe(true);

    expect(decision.verdict.permitted).toBe(false);
    expect(decision.verdict.refusal).toBe('deterrence_prohibitive');
    // The receipt names the road DECLINED, not a road never reached.
    expect(decision.verdict.receipt).toContain('initiation');
    expect(decision.verdict.receipt).toContain('still stands');
    // …and nothing at all is emitted: no outcome, no patch, no sack.
    expect(burn(world)).toBeNull();
  });

  test('the ONLY difference between the two worlds is the victim\'s friends', () => {
    // Anti-vacuity: the deterred world must still clear every OTHER conjunct, or
    // the refusal above could be measuring an accidentally-broken fixture.
    const world = deterrenceWorld({ friends: ['Mereth', 'Everdeep', 'Duskmere'] });
    const undeterred = razingDecisionFor({
      worldState: world.worldState, snapshot: world.snapshot,
      razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
      // No strengthFor ⇒ the deterrent is not priced ⇒ the law's own answer.
    });
    expect(undeterred.extremity.extreme).toBe(true);
    expect(undeterred.alignmentBand).toBe('malicious');
    expect(undeterred.verdict.permitted).toBe(true);
    expect(undeterred.verdict.road).toBe('initiation');
  });
});

describe('the deterrent only ever refuses — it is appetite, never permission', () => {
  test('a law-refused court is refused for the LAW\'s reason, never "deterred"', () => {
    // Not extreme: the deterrent must not relabel this refusal even when it fires.
    const verdict = razingGate({
      siegeWon: true,
      extremity: { extreme: false, receipt: 'the quarrel is merely bad.' },
      alignmentBand: 'malicious',
      deterred: true,
      deterrenceReceipt: 'a great many friends',
    });
    expect(verdict.refusal).toBe('not_extreme');
    // …and a court that never won a siege is told THAT, not that it flinched.
    expect(razingGate({ siegeWon: false, deterred: true }).refusal).toBe('no_siege');
    // …and a good court with no license is refused by alignment, not by fear.
    expect(razingGate({
      siegeWon: true,
      extremity: { extreme: true },
      alignmentBand: 'benevolent',
      licenseHeld: false,
      deterred: true,
    }).refusal).toBe('alignment_forbids_initiation');
  });

  test('a quiet web NEVER opens a road the law closed', () => {
    const permitted = razingGate({
      siegeWon: true, extremity: { extreme: true }, alignmentBand: 'benevolent',
      licenseHeld: false, deterred: false,
    });
    expect(permitted.permitted).toBe(false);
    expect(permitted.refusal).toBe('alignment_forbids_initiation');
  });

  test('the vengeance road is deterrable too, and names its own road', () => {
    const verdict = razingGate({
      siegeWon: true, extremity: { extreme: true }, alignmentBand: 'benevolent',
      licenseHeld: true, deterred: true, deterrenceReceipt: 'too many friends',
    });
    expect(verdict.refusal).toBe('deterrence_prohibitive');
    expect(verdict.receipt).toContain('vengeance');
  });

  test('the refusal word is a registered member of the closed vocabulary', () => {
    expect(RAZING_REFUSALS).toContain('deterrence_prohibitive');
    expect(new Set(RAZING_REFUSALS).size).toBe(RAZING_REFUSALS.length);
  });
});

describe('⚠️ the UNPRICED arm — an absent strength read is admitted, never faked', () => {
  test('no strengthFor ⇒ priced:false, band `unpriced`, and never deterred', () => {
    const world = deterrenceWorld({ friends: ['Mereth', 'Everdeep', 'Duskmere'] });
    const read = razingDeterrenceFor({
      worldState: world.worldState, snapshot: world.snapshot,
      razerId: 'Karrow', victimId: 'Thornwall',
    });
    expect(read.priced).toBe(false);
    expect(read.band).toBe('unpriced');
    expect(read.deters).toBe(false);
    expect(read.members).toEqual([]);
    // ⚠️ THE POINT: `unpriced` is NOT `quiet`. A fabricated all-clear would be
    // indistinguishable from a real one at every consumer downstream.
    expect(read.band).not.toBe('quiet');
    // …and the emission still lands, exactly as it did before this conjunct.
    expect(burn(world, false)).not.toBeNull();
  });

  test('a dark world prices nothing and carries a null deterrence read', () => {
    const decision = razingDecisionFor({
      worldState: {}, snapshot: {}, razerId: 'Karrow', victimId: 'Thornwall', tick: 40, siegeWon: true,
    });
    expect(decision.active).toBe(false);
    expect(decision.deterrence).toBeNull();
  });

  test('a self-razing and an empty pair price nothing', () => {
    for (const args of [
      { razerId: 'Karrow', victimId: 'Karrow', strengthFor: () => 1 },
      { razerId: '', victimId: 'Thornwall', strengthFor: () => 1 },
      { razerId: 'Karrow', victimId: '', strengthFor: () => 1 },
    ]) {
      expect(razingDeterrenceFor({ worldState: {}, snapshot: {}, ...args }).priced).toBe(false);
    }
  });
});
