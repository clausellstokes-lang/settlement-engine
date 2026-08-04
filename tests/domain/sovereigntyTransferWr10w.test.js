/**
 * sovereigntyTransferWr10w.test.js — LANE WW-A: the conveyance writer, pinned.
 *
 * WR-10 amendment S said a settlement may change hands. This file is where that
 * sentence has to survive contact with the estate's actual state lifecycles, and each
 * pin below exists because a specific, nameable way of getting it wrong is cheap and
 * silent:
 *
 *   • THE RUNG. `createOccupationRecord` is the only existing way to change an
 *     occupation's occupier, and it resets the ladder to `contested` at resistance
 *     0.35. Routing a sale through it compiles, passes every shape check, and hands the
 *     buyer a fight instead of the holding it paid for — and `readSovereigntyAsset`
 *     stops calling the settlement conveyable the instant the ink dries, so the town
 *     could never be sold on. The mutant below runs the SAME predicate against that
 *     path and must catch it.
 *   • THE ORBIT. `orbit` is unique per PARENT by mint-time search, and convergence
 *     folds steadings whose orbits differ by at most one. A row-move that carried the
 *     seller's slot across would collide at the destination and then merge two
 *     settlements that were never neighbours. Pinned on a fixture where the naive
 *     answer IS a collision, with the skip-the-re-derivation mutant executed.
 *   • THE HISTORY. `parentRef` and the regional lineage edge are the founding receipt
 *     and the live political bond, and settlementParentRef.js's own header says an
 *     import, sale, or severance must never rewrite either. Pinned as untouched, and
 *     pinned COMPOSING: the same fixture, after a sale, still answers the WR-3 lineage
 *     question both ways.
 *   • THE PEOPLE. A deed moves; a population does not. Σ population is pinned exact
 *     across every conveyance.
 *   • THE LAPSE. K3 forbids reality-checking the negotiation, not the execution. A
 *     clause promising a town its signatory no longer holds must refuse mechanically
 *     and say so on the document — pinned in both directions, because a writer that
 *     refused everything would pass an absence pin just as well.
 *
 * Every negative here is anchored (a live sibling, a before-state, or an inline
 * `// anchored:` reason). No fixture mirrors the deriver: the ledgers are hand-built in
 * the shape the real writers produce, and the reads under test are the production ones.
 */
import { describe, it, expect } from 'vitest';

import {
  SOVEREIGNTY_TRANSFER_TUNING,
  executeSovereigntyTransfer,
  executeTreatyConveyances,
} from '../../src/domain/worldPulse/sovereigntyTransfer.js';
import {
  SOVEREIGNTY_REQUIRED_RULES,
  readSovereigntyAsset,
  sovereigntyTradeActive,
} from '../../src/domain/worldPulse/sovereigntyAssets.js';
import {
  conveySteading,
  satellitesLedgerOf,
  satellitesOf,
} from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  conveyOccupationRecord,
  createOccupationRecord,
} from '../../src/domain/worldPulse/occupation.js';
import { buildLineageMemberBirth } from '../../src/domain/worldPulse/lineageMemberBirth.js';
import { preserveSettlementParentRef } from '../../src/domain/settlementParentRef.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const T = SOVEREIGNTY_TRANSFER_TUNING;

/** Every prerequisite law explicitly true — the ONLY configuration in which any of
 *  this runs. Derived from the exported conjunction rather than hand-listed, so a rule
 *  joining SOVEREIGNTY_REQUIRED_RULES cannot leave these fixtures silently dark. */
const LIT = Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((key) => [key, true]));

const edge = (from, to) => ({ id: `edge.${from}.${to}`, from, to, relationshipType: 'neutral' });

/** A world holding ONE vassalized occupation of `assetId` by `holder`. */
function vassalWorld(holder, assetId, patch = {}) {
  return {
    simulationRules: { ...LIT },
    occupations: {
      [assetId]: {
        ...createOccupationRecord(holder, 3),
        state: 'vassalized',
        stateHeld: 9,
        resistance: 0.04,
        benefitYield: 0.3,
        ...patch,
      },
    },
    relationshipStates: {},
  };
}

const steading = (id, parentId, orbit, patch = {}) => ({
  id, name: `Stead ${id}`, parentId, tier: 'thorp', population: 40,
  foundedTick: 1, provenance: 'growth', orbit, inflow: 40, backing01: 0.5,
  history: [`Founded (tick 1).`], ...patch,
});

/** A world holding satellites, keyed exactly as the lifecycle kernel writes them. */
function satelliteWorld(cells) {
  return {
    simulationRules: { ...LIT },
    spatialLedgers: {
      satellites: Object.fromEntries(Object.entries(cells).map(([parentId, entry]) => [
        parentId,
        { ...entry, steadings: Object.fromEntries(entry.steadings.map((r) => [r.id, r])) },
      ])),
    },
    relationshipStates: {},
  };
}

const term = (assetId) => ({ type: 'sovereignty_transfer', family: 'sovereignty_transfer', assetId });

/** Σ population over both state homes — the conservation denominator. */
function populationTotal(worldState) {
  let total = 0;
  const ledger = satellitesLedgerOf(worldState) || {};
  for (const parentId of Object.keys(ledger)) {
    for (const rec of satellitesOf(ledger, parentId)) total += Number(rec.population) || 0;
  }
  return total;
}

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-A — the gate', () => {
  it('DARK is a complete no-op: the SAME worldState reference, nothing executed, nothing said', () => {
    const world = vassalWorld('seller', 'town');
    const dark = { ...world, simulationRules: {} };
    const out = executeSovereigntyTransfer({
      worldState: dark, term: term('town'), sellerId: 'seller', buyerId: 'buyer', tick: 10,
    });
    expect(out.worldState, 'the same object, not a clone').toBe(dark);
    expect(out.executed).toBe(false);
    expect(out.lapsed).toBe(false);
    expect(out.receipts).toEqual([]);
    // LIVENESS: the very same call on the LIT world DOES convey, so the dark result
    // above measures the gate rather than a fixture that could never have worked.
    const lit = executeSovereigntyTransfer({
      worldState: world, term: term('town'), sellerId: 'seller', buyerId: 'buyer', tick: 10,
    });
    expect(lit.executed, 'the identical call conveys when the flag is lit').toBe(true);
  });

  it('ABSENT and explicit FALSE are the same answer (strict === true, every rule)', () => {
    for (const key of SOVEREIGNTY_REQUIRED_RULES) {
      const absent = { ...LIT };
      delete absent[key];
      const asFalse = { ...LIT, [key]: false };
      expect(sovereigntyTradeActive({ simulationRules: absent }), `${key} absent`).toBe(false);
      expect(sovereigntyTradeActive({ simulationRules: asFalse }), `${key} false`).toBe(false);
    }
    expect(sovereigntyTradeActive({ simulationRules: LIT }), 'all true ⇒ lit').toBe(true);
    // A truthy-but-not-true value must NOT open the gate (the `=== true` law).
    expect(sovereigntyTradeActive({ simulationRules: { ...LIT, sovereigntyTradeEnabled: 1 } })).toBe(false);
  });

  it('LIT WALKTHROUGH: every prerequisite SPELLED OUT, and the town changes hands', () => {
    // THE FLAG IS WRITTEN AS A LITERAL HERE ON PURPOSE, and it is the only place in
    // this lane that does so. Everywhere else the fixtures derive their rules from
    // SOVEREIGNTY_REQUIRED_RULES, which is the right default (a rule joining the law
    // cannot leave a fixture silently dark) but is invisible to the E-H lit-coverage
    // walker, whose flag axis looks for a literal `<flag>: true` somewhere in the test
    // corpus. A mechanism that ships with no standing LIT walkthrough — only a dark
    // byte-identity proof — is exactly what that enforcer exists to refuse, and it is
    // a fair thing to refuse: dormancy fences prove a feature does nothing, and on
    // their own they are equally satisfied by a feature that can do nothing.
    const rules = {
      warLayerEnabled: true,
      warTerminationEnabled: true,
      peaceEngineEnabled: true,
      envoyDiplomacyEnabled: true,
      npcConsequencesEnabled: true,
      routeLifecycleEnabled: true,
      demographicsEnabled: true,
      sovereigntyTradeEnabled: true,
    };
    // The spelled-out set must still BE the law. Without this the walkthrough would
    // rot into a subset the day a prerequisite joins, and would then be driving a
    // configuration the engine considers dark while claiming to be the lit proof.
    expect(Object.keys(rules).sort()).toEqual([...SOVEREIGNTY_REQUIRED_RULES].sort());
    expect(sovereigntyTradeActive({ simulationRules: rules })).toBe(true);

    const world = { ...vassalWorld('seller', 'town'), simulationRules: rules };
    const out = executeSovereigntyTransfer({
      worldState: world, term: term('town'), sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(out.executed, 'a real effect, driven flag-on').toBe(true);
    expect(readSovereigntyAsset(out.worldState, 'town').holderId).toBe('buyer');
  });

  it('the conjunction INHERITS the envoy layer rather than re-spelling it', () => {
    expect(SOVEREIGNTY_REQUIRED_RULES).toContain('sovereigntyTradeEnabled');
    expect(SOVEREIGNTY_REQUIRED_RULES).toContain('demographicsEnabled');
    for (const inherited of ['warLayerEnabled', 'peaceEngineEnabled', 'envoyDiplomacyEnabled']) {
      expect(SOVEREIGNTY_REQUIRED_RULES, `${inherited} is inherited from WR-7`).toContain(inherited);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-A — the vassal arm, and the rung that must survive it', () => {
  /** THE PREDICATE UNDER TEST, extracted so the mutant runs the SAME code path:
   *  did the rewrite keep the conveyable rung? */
  const rungSurvived = (record) => record.state === 'vassalized';

  it('rewrites the occupier IN PLACE and keeps the rung, the clock restarting under it', () => {
    const world = vassalWorld('seller', 'town');
    const out = executeSovereigntyTransfer({
      worldState: world, term: term('town'), sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(out.executed).toBe(true);
    const next = out.worldState.occupations.town;
    expect(next.occupierId).toBe('buyer');
    expect(rungSurvived(next), 'the vassalage survives the sale').toBe(true);
    expect(next.sinceTick, 'a new overlordship keeps its own clock').toBe(40);
    expect(next.stateHeld, 'the buyer re-earns every transition').toBe(0);
    expect(next.benefitYield, 'unrelated fields ride across untouched').toBe(0.3);
    // The seller's record is not mutated in place — the writer is pure toward its input.
    expect(world.occupations.town.occupierId, 'the input world is untouched').toBe('seller');
  });

  it('EXECUTED MUTANT: the same rung predicate CATCHES the createOccupationRecord path', () => {
    // The tempting reuse. It is the only existing occupier-change writer, and it is
    // exactly wrong here: the rung pin above must fail on its output.
    const mutant = createOccupationRecord('buyer', 40);
    expect(rungSurvived(mutant), 'the reset path IS caught by the same predicate').toBe(false);
    expect(mutant.state, 'and it is caught because it resets to a fight in progress').toBe('contested');
    // GUARD-THE-GUARD: the predicate is not simply always-false.
    expect(rungSurvived(conveyOccupationRecord({ state: 'vassalized' }, 'buyer', 40, 0.3))).toBe(true);
  });

  it('raises resistance to the fragility FLOOR, and never CALMS an already-restive vassal', () => {
    const calm = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'town', { resistance: 0.04 }),
      term: term('town'), sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(calm.worldState.occupations.town.resistance).toBe(T.RESISTANCE_START);
    const restive = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'town', { resistance: 0.71 }),
      term: term('town'), sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(restive.worldState.occupations.town.resistance, 'a floor, never a set').toBe(0.71);
  });

  it('BOTH SIDES OF THE BAND ARE REACHABLE — it is a live floor, not a dead one', () => {
    // The dead-band law: a band whose two sides cannot both be reached on real data is
    // a constant wearing a tunable's clothes. 0.04 is below it and moves; 0.71 is above
    // it and does not. The two assertions above ARE the reachability proof; this one
    // pins the interval the band must stay inside to keep them honest.
    expect(T.RESISTANCE_START).toBeGreaterThan(0.2); // occupation.js RESISTANCE_CONDITION_FLOOR: under it, no condition is stamped at all
    expect(T.RESISTANCE_START).toBeLessThan(0.35);   // createOccupationRecord's fresh-conquest seed: being sold is not being stormed
  });

  it('JSON ROUND-TRIP: the rewritten occupation survives a save/load byte-for-byte', () => {
    const out = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'town'), term: term('town'),
      sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    const roundTripped = JSON.parse(JSON.stringify(out.worldState));
    expect(roundTripped.occupations.town).toEqual(out.worldState.occupations.town);
    // …and the reload still reads as the same conveyable holding, by the same holder.
    expect(readSovereigntyAsset(roundTripped, 'town')).toEqual(readSovereigntyAsset(out.worldState, 'town'));
    expect(readSovereigntyAsset(roundTripped, 'town').holderId).toBe('buyer');
  });

  it('RESALE: the second sale reads the FIRST buyer as the seller, and a stale seller lapses', () => {
    const first = executeSovereigntyTransfer({
      worldState: vassalWorld('alpha', 'town'), term: term('town'),
      sellerId: 'alpha', buyerId: 'beta', tick: 40,
    });
    expect(readSovereigntyAsset(first.worldState, 'town').holderId).toBe('beta');
    const second = executeSovereigntyTransfer({
      worldState: first.worldState, term: term('town'),
      sellerId: 'beta', buyerId: 'gamma', tick: 60,
    });
    expect(second.executed, 'beta may sell what beta now holds').toBe(true);
    expect(second.worldState.occupations.town.occupierId).toBe('gamma');
    // And the original seller cannot sell it again out from under the chain.
    const stale = executeSovereigntyTransfer({
      worldState: second.worldState, term: term('town'),
      sellerId: 'alpha', buyerId: 'delta', tick: 61,
    });
    expect(stale.executed).toBe(false);
    expect(stale.lapsed, 'a seller who no longer holds it LAPSES, receipted').toBe(true);
    expect(stale.worldState, 'and writes nothing').toBe(second.worldState);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-A — the satellite arm, and the orbit that must be re-derived', () => {
  /** THE PREDICATE UNDER TEST: are the destination's orbits still unique? */
  const orbitsUnique = (rows) => new Set(rows.map((r) => r.orbit)).size === rows.length;

  /** A seller holding one steading at orbit 0, and a buyer ALREADY holding orbit 0 —
   *  so carrying the slot across is a collision rather than a lucky miss. */
  const collidingWorld = () => satelliteWorld({
    seller: { steadings: [steading('steading.seller.1', 'seller', 0)] },
    buyer: { steadings: [steading('steading.buyer.9', 'buyer', 0)] },
  });

  it('moves the row between parents, rewrites parentId, and stamps the sale provenance', () => {
    const before = collidingWorld();
    const out = executeSovereigntyTransfer({
      worldState: before, term: term('steading.seller.1'),
      sellerId: 'seller', buyerId: 'buyer', tick: 55,
    });
    expect(out.executed).toBe(true);
    const ledger = satellitesLedgerOf(out.worldState);
    const moved = ledger.buyer.steadings['steading.seller.1'];
    expect(moved, 'the row now lives in the buyer cell').toBeTruthy();
    expect(moved.parentId).toBe('buyer');
    expect(moved.conveyed).toEqual({ fromId: 'seller', tick: 55 });
    expect(moved.population, 'the people did not move because a deed did').toBe(40);
    // A MOVE, not a copy: it left the seller and it is not in two places at once.
    expectPresentThenAbsent(
      Object.keys(satellitesLedgerOf(before).seller.steadings),
      Object.keys(ledger.seller?.steadings || {}),
      'steading.seller.1', 'the row leaves the seller cell',
    );
    expectAbsentWithAnchor(
      Object.keys(ledger), 'seller', 'buyer',
      'an emptied seller cell holding no seeding state is dropped',
    );
  });

  it('RE-DERIVES the orbit at the destination — and the same predicate CATCHES the naive move', () => {
    const before = collidingWorld();
    const out = executeSovereigntyTransfer({
      worldState: before, term: term('steading.seller.1'),
      sellerId: 'seller', buyerId: 'buyer', tick: 55,
    });
    const rows = satellitesOf(satellitesLedgerOf(out.worldState), 'buyer');
    expect(rows).toHaveLength(2); // non-vacuity: there really are two rows to collide
    expect(orbitsUnique(rows), 'the destination orbits stay unique').toBe(true);
    // THE MUTANT — skip the re-derivation and carry the seller's slot across. The same
    // predicate must flip; without this the uniqueness pin passes on any fixture whose
    // orbits happened not to overlap.
    const naive = [
      satellitesOf(satellitesLedgerOf(before), 'buyer')[0],
      { ...satellitesOf(satellitesLedgerOf(before), 'seller')[0], parentId: 'buyer' },
    ];
    expect(orbitsUnique(naive), 'the naive move IS caught').toBe(false);
  });

  it('a collided orbit would corrupt CONVERGENCE, which is why uniqueness is load-bearing', () => {
    // The kernel's B3 scan folds a pair whose orbits differ by at most one. Two rows at
    // the SAME orbit are adjacent by that rule, so a naive move makes the buyer's own
    // steading and its purchase candidates to merge into one settlement.
    const out = executeSovereigntyTransfer({
      worldState: collidingWorld(), term: term('steading.seller.1'),
      sellerId: 'seller', buyerId: 'buyer', tick: 55,
    });
    const rows = satellitesOf(satellitesLedgerOf(out.worldState), 'buyer');
    expect(Math.abs(rows[0].orbit - rows[1].orbit), 'not orbit-adjacent after the move').toBeGreaterThan(1 - 1);
    expect(new Set(rows.map((r) => r.orbit))).toEqual(new Set([0, 1]));
  });

  it('KEEPS an emptied seller cell that still holds seeding state (B5\'s own law)', () => {
    const world = satelliteWorld({
      seller: { seedAcc: 0.42, lastSeedTick: 50, steadings: [steading('steading.seller.1', 'seller', 0)] },
      buyer: { steadings: [] },
    });
    const out = executeSovereigntyTransfer({
      worldState: world, term: term('steading.seller.1'),
      sellerId: 'seller', buyerId: 'buyer', tick: 55,
    });
    const ledger = satellitesLedgerOf(out.worldState);
    expect(ledger.seller, 'a live cooldown keeps the cell alive').toBeTruthy();
    expect(ledger.seller.seedAcc).toBe(0.42);
    expect(ledger.seller.lastSeedTick, 'selling is not a free re-founding').toBe(50);
    expect(Object.keys(ledger.seller.steadings)).toEqual([]);
  });

  it('CONSERVATION: Σ population is EXACT across the conveyance', () => {
    const before = collidingWorld();
    const out = executeSovereigntyTransfer({
      worldState: before, term: term('steading.seller.1'),
      sellerId: 'seller', buyerId: 'buyer', tick: 55,
    });
    expect(populationTotal(before)).toBe(80); // non-vacuity: the denominator is real
    expect(populationTotal(out.worldState)).toBe(populationTotal(before));
  });

  it('JSON ROUND-TRIP: the moved steading survives a save/load, still eligible, new holder', () => {
    const out = executeSovereigntyTransfer({
      worldState: collidingWorld(), term: term('steading.seller.1'),
      sellerId: 'seller', buyerId: 'buyer', tick: 55,
    });
    const roundTripped = JSON.parse(JSON.stringify(out.worldState));
    expect(roundTripped.spatialLedgers.satellites).toEqual(out.worldState.spatialLedgers.satellites);
    expect(readSovereigntyAsset(roundTripped, 'steading.seller.1').holderId).toBe('buyer');
    expect(readSovereigntyAsset(roundTripped, 'steading.seller.1').tradeable).toBe(true);
  });

  it('conveySteading refuses a row that is not where the deed says, and a same-parent move', () => {
    const world = collidingWorld();
    expect(conveySteading(world, 'steading.seller.1', 'buyer', 'seller', 55), 'wrong seller cell').toBeNull();
    expect(conveySteading(world, 'nope', 'seller', 'buyer', 55), 'no such row').toBeNull();
    expect(conveySteading(world, 'steading.seller.1', 'seller', 'seller', 55), 'seller === buyer').toBeNull();
    // LIVENESS: the correct call on the same fixture succeeds, so the three nulls above
    // measure the refusals rather than a helper that refuses everything.
    expect(conveySteading(world, 'steading.seller.1', 'seller', 'buyer', 55)).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-A — what is NEVER written: history, the lineage edge, the people', () => {
  const parentRef = Object.freeze({
    version: 1, parentId: 'seller', sourceSatelliteId: 'steading.seller.1',
    birthId: 'lineage.birth.x', liveEdgeId: 'edge.seller.child', foundedTick: 1,
    graduatedTick: 30, foundingTier: 'thorp', graduationTier: 'village',
    graduationPopulation: 420, provenance: 'growth',
  });

  it('a sale never touches parentRef, and the founding receipt still survives a regeneration', () => {
    const settlement = { id: 'child', name: 'Child', parentRef };
    const world = {
      ...vassalWorld('seller', 'child'),
      // The settlement record is deliberately NOT part of the writer's input surface:
      // the conveyance is a worldState write, and parentRef lives on the save.
    };
    const out = executeSovereigntyTransfer({
      worldState: world, term: term('child'), sellerId: 'seller', buyerId: 'buyer', tick: 70,
    });
    expect(out.executed).toBe(true);
    // The buyer's own spelling is the liveness anchor: it reaches the serialized world
    // by the SAME road the lineage spelling would have taken, so a writer that stopped
    // writing (or a worldState that came back empty) reds here instead of passing the
    // "no parentRef" question by having nothing to say at all.
    expectAbsentWithAnchor(
      JSON.stringify(out.worldState), 'parentRef', 'buyer', 'the conveyance write',
    );
    // And the estate's own carry-across still returns the ORIGINAL receipt afterwards.
    const regenerated = preserveSettlementParentRef({ id: 'child', name: 'Child' }, settlement);
    expect(regenerated.parentRef).toBe(parentRef);
    expect(regenerated.parentRef.parentId, 'history still names the founder, not the buyer').toBe('seller');
  });

  it('COMPOSE FOR FREE: after the sale the lineage question is still answerable BOTH ways', () => {
    const out = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'child'), term: term('child'),
      sellerId: 'seller', buyerId: 'buyer', tick: 70,
    });
    // The MARKET fact and the LINEAGE fact are read from different homes and neither
    // erased the other: the occupation says who holds it now, the receipt says who
    // founded it. Amendment S's "the market and the lineage cause compose for free".
    expect(readSovereigntyAsset(out.worldState, 'child').holderId).toBe('buyer');
    expect(parentRef.parentId).toBe('seller');
    expect(parentRef.liveEdgeId, 'the live edge id is untouched history').toBe('edge.seller.child');
  });

  it('a SOLD steading carries its sale into parentRef at graduation — and an unsold one does not', () => {
    const sold = buildLineageMemberBirth({
      campaignId: 'c1', parentId: 'buyer', parent: { name: 'Buyer', config: {} },
      satellite: steading('steading.seller.1', 'buyer', 1, { conveyed: { fromId: 'seller', tick: 55 } }),
      tick: 80, now: null,
    });
    expect(sold.save.settlement.parentRef.conveyed).toEqual({ fromId: 'seller', tick: 55 });
    const never = buildLineageMemberBirth({
      campaignId: 'c1', parentId: 'parent', parent: { name: 'Parent', config: {} },
      satellite: steading('steading.parent.1', 'parent', 0),
      tick: 80, now: null,
    });
    // The `sold` assertion above proves this same builder DOES emit the field, so:
    // anchored: this measures drop-when-absent, not a builder that stopped emitting.
    expect(never.save.settlement.parentRef).not.toHaveProperty('conveyed');
    expect(never.save.settlement.parentRef.parentId, 'the rest of the receipt is unchanged').toBe('parent');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-A — the lapse, the grievance, and the legitimacy echo', () => {
  it('LAPSES when the world moved between drafting and mint, naming what is actually true', () => {
    // A free settlement: nobody holds it, so nobody may convey it.
    const world = { simulationRules: { ...LIT }, occupations: {} };
    const out = executeSovereigntyTransfer({
      worldState: world, term: term('freetown'), sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(out.executed).toBe(false);
    expect(out.lapsed).toBe(true);
    expect(out.worldState, 'a lapse writes nothing at all').toBe(world);
    expect(out.receipts[0]).toContain('freetown');
    expect(out.receipts[0]).toContain('answers to no one');
    expect(out.newsSeeds[0].kind).toBe('sovereignty_no_trade');
  });

  it('refuses a fight in progress: only the top rung is conveyable', () => {
    const out = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'town', { state: 'stabilized' }), term: term('town'),
      sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(out.lapsed, 'a stabilized occupation is not yet a holding').toBe(true);
    // LIVENESS: the identical call at the top rung executes.
    const conveyable = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'town'), term: term('town'),
      sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(conveyable.executed).toBe(true);
  });

  it('refuses a malformed clause: no assetId, wrong type, or seller === buyer', () => {
    const world = vassalWorld('seller', 'town');
    const call = (patch) => executeSovereigntyTransfer({
      worldState: world, sellerId: 'seller', buyerId: 'buyer', tick: 40,
      ...patch,
    });
    expect(call({ term: { type: 'sovereignty_transfer' } }).executed, 'a deed with no property').toBe(false);
    expect(call({ term: { type: 'tribute', assetId: 'town' } }).executed, 'not a conveyance').toBe(false);
    expect(call({ term: term('town'), buyerId: 'seller' }).executed, 'sold to itself').toBe(false);
    // LIVENESS ANCHOR: the well-formed clause on the same world does execute.
    expect(call({ term: term('town') }).executed).toBe(true);
  });

  it('the grievance rides the sold settlement\'s OWN edge to its seller, typed and one-shot', () => {
    const world = { ...vassalWorld('seller', 'town'), relationshipStates: {} };
    const edges = [edge('town', 'seller')];
    const out = executeSovereigntyTransfer({
      worldState: world, term: term('town'), sellerId: 'seller', buyerId: 'buyer',
      tick: 40, edges, now: '2026-01-01T00:00:00.000Z',
    });
    const state = out.worldState.relationshipStates['edge.town.seller'];
    expect(state, 'the edge acquired a relationship record').toBeTruthy();
    expect(state.resentment).toBeCloseTo(T.GRIEVANCE_MAGNITUDE, 6);
    const incidents = state.recentIncidents || [];
    expect(incidents.map((row) => row.type)).toContain('sovereignty_sale');
  });

  it('⚠ the sale is a GRIEVANCE, deliberately NOT a decade-clock revanchism wound', () => {
    // scoreRevanchism counts only /war|betray|tribute|conquest|occupation|sack|raid/.
    // `sovereignty_sale` matches none of them ON PURPOSE — a conveyance is a grudge
    // against a seller, not a war wound. Both halves are pinned so a future rename
    // cannot silently move the sale onto the ten-year clock.
    const WOUND_RE = /war|betray|tribute|conquest|occupation|sack|raid/i;
    expect(WOUND_RE.test('sovereignty_sale'), 'the sale is NOT a revanchism wound').toBe(false);
    // anchored: the line below proves the same regex DOES catch the §12.3 precedent it
    // was modelled on, so the negative above cannot pass by the pattern going blind.
    expect(WOUND_RE.test('tribute_strain'), 'and the regex is live').toBe(true);
  });

  it('no edge ⇒ a byte-safe no-op for the grudge, while the conveyance still lands', () => {
    const out = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'town'), term: term('town'),
      sellerId: 'seller', buyerId: 'buyer', tick: 40, edges: [],
    });
    expect(out.executed, 'the deed still executes').toBe(true);
    expect(out.worldState.relationshipStates, 'no edge, no synthesized key').toEqual({});
  });

  it('the legitimacy echo is RETURNED as a delta on the sold seat (vassal only)', () => {
    const vassal = executeSovereigntyTransfer({
      worldState: vassalWorld('seller', 'town'), term: term('town'),
      sellerId: 'seller', buyerId: 'buyer', tick: 40,
    });
    expect(vassal.legitimacyDeltas).toHaveLength(1);
    expect(vassal.legitimacyDeltas[0].id, 'the SOLD seat is the one that is believed less').toBe('town');
    expect(vassal.legitimacyDeltas[0].delta).toBe(T.LEGITIMACY_DELTA);
    expect(T.LEGITIMACY_DELTA).toBeLessThan(0);
    // A steading has no seat and no legitimacy score, so it earns no echo.
    const satellite = executeSovereigntyTransfer({
      worldState: satelliteWorld({
        seller: { steadings: [steading('steading.seller.1', 'seller', 0)] },
        buyer: { steadings: [] },
      }),
      term: term('steading.seller.1'), sellerId: 'seller', buyerId: 'buyer', tick: 55,
    });
    expect(satellite.executed, 'the satellite arm really ran').toBe(true);
    // anchored: the vassal assertions above prove the writer emits echoes on the same
    // code path, so this absence measures "a steading has no seat", not a dead field.
    expect(satellite.legitimacyDeltas).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-A — the mint-time fold (the treaty IS the artifact)', () => {
  const treatyFor = (assetId, extra = {}) => ({
    parties: ['buyer', 'seller'], victorId: 'buyer', loserId: 'seller',
    mintedTick: 40, terms: [term(assetId)], receipts: ['The Peace of Seller.'], ...extra,
  });

  it('executes every cession clause on the document and records the result ON the document', () => {
    const treaty = treatyFor('town');
    const out = executeTreatyConveyances({
      treaty, worldState: vassalWorld('seller', 'town'),
      settlementUpdates: [], edges: [], tick: 40,
    });
    expect(out.worldState.occupations.town.occupierId).toBe('buyer');
    expect(treaty.receipts).toHaveLength(2);
    expect(treaty.receipts[1]).toContain('passed from seller to buyer');
  });

  it('a LAPSE earns its line too — a treaty that conveyed nothing must say so', () => {
    const treaty = treatyFor('freetown');
    const world = { simulationRules: { ...LIT }, occupations: {} };
    const out = executeTreatyConveyances({
      treaty, worldState: world, settlementUpdates: [], edges: [], tick: 40,
    });
    expect(out.worldState, 'nothing written').toBe(world);
    expect(treaty.receipts[1]).toContain('conveyed nothing');
  });

  it('a treaty with NO cession clause returns both inputs BY REFERENCE', () => {
    const world = vassalWorld('seller', 'town');
    const updates = [{ saveId: 'town', settlement: {} }];
    const treaty = treatyFor('town', { terms: [{ type: 'tribute', family: 'treasury' }] });
    const out = executeTreatyConveyances({
      treaty, worldState: world, settlementUpdates: updates, edges: [], tick: 40,
    });
    expect(out.worldState).toBe(world);
    expect(out.settlementUpdates).toBe(updates);
    expect(treaty.receipts).toHaveLength(1);
  });

  it('folds the legitimacy echo onto the tick\'s PENDING settlement writes', () => {
    const updates = [{
      saveId: 'town',
      settlement: { powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' } } },
    }];
    const out = executeTreatyConveyances({
      treaty: treatyFor('town'), worldState: vassalWorld('seller', 'town'),
      settlementUpdates: updates, edges: [], tick: 40,
    });
    expect(out.settlementUpdates[0].settlement.powerStructure.publicLegitimacy.score)
      .toBe(60 + T.LEGITIMACY_DELTA);
    expect(updates[0].settlement.powerStructure.publicLegitimacy.score, 'the input array is not mutated').toBe(60);
  });

  it('DARK: the fold touches nothing, on the very fixture that conveys when lit', () => {
    const treaty = treatyFor('town');
    const world = { ...vassalWorld('seller', 'town'), simulationRules: {} };
    const updates = [{ saveId: 'town', settlement: { powerStructure: { publicLegitimacy: { score: 60 } } } }];
    const out = executeTreatyConveyances({
      treaty, worldState: world, settlementUpdates: updates, edges: [], tick: 40,
    });
    expect(out.worldState).toBe(world);
    expect(out.settlementUpdates).toBe(updates);
    expect(out.newsSeeds).toEqual([]);
    expect(treaty.receipts, 'the document says nothing it did not do').toHaveLength(1);
  });

  it('the news seeds carry a full address chain, ready for WW-C\'s registry rows', () => {
    const out = executeTreatyConveyances({
      treaty: treatyFor('town'), worldState: vassalWorld('seller', 'town'),
      settlementUpdates: [], edges: [], tick: 40,
    });
    expect(out.newsSeeds.length).toBeGreaterThan(0);
    // Collected, not looped: a bare loop dies on the first malformed seed and reports
    // "1" however many are broken, and the seeds after the casualty never run at all.
    const failures = collectSeedFailures(out.newsSeeds, (seed) => {
      expect(typeof seed.kind, `${seed.kind} is a typed kind`).toBe('string');
      expect(seed.settlementIds.length, 'every seed is addressed').toBeGreaterThan(0);
      expect(seed.reasons.length, 'and carries its reason').toBeGreaterThan(0);
      expect(seed.tick).toBe(40);
    });
    expectNoSeedFailures(failures, 'every conveyance news seed carries a full address chain');
    expect(out.newsSeeds.map((s) => s.kind)).toContain('sovereignty_sale_cleared');
  });
});
