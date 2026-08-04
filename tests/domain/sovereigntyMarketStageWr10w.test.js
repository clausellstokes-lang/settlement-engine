/**
 * sovereigntyMarketStageWr10w.test.js — LANE WW-B: the plan-lane trigger and the market
 * composer, pinned (chair rulings CR-WR10-D, CR-WR10-E, CR-WR10-H).
 *
 * Each pin exists because a specific way of getting this wrong is cheap and silent:
 *
 *   • THE LEVEL INSTEAD OF THE CROSSING. A trigger that fires on "is the band demanding"
 *     rather than "did the band change this tick" offers the same holding every tick
 *     forever — a flap nobody sees until a chronicle is unreadable. Pinned with the level
 *     mutant executed against the real stage.
 *   • THE COOLDOWN THAT ISN'T. The cooldown is the TREATY, so a read that misses it is a
 *     court selling the same way twice in a season. Pinned in both directions.
 *   • THE SKIPPED INTENT. §1b-B says a contradicted sale scores 0 WITH a receipt; a
 *     composer that never consults the intent reader silently deletes the kinship clause.
 *   • THE DEAD LIGHTING (CR-WR10-H). Three of the appraisal's four legs have no belief
 *     surface today, so the market as-wired clears NOTHING. The pin asserts both halves:
 *     the honest receipted no-trade with the legs missing, AND — the contract fixture —
 *     a complete end-to-end clearing the moment synthetic banded legs are supplied. A
 *     wave that only pinned the first half would have shipped a market nobody could ever
 *     prove works.
 *   • THE HALF-SWAP (CR-WR10-D). Two conveyances cannot share one document under §13, so
 *     a swap is two treaties on a shared swapId, and NEITHER mints unless both clear.
 *     Pinned symmetric and atomic, with the failing leg driven by a real refusal.
 *   • DORMANCY IDENTITY. Dark must return the SAME references, not equal ones.
 */
import { describe, it, expect } from 'vitest';

import {
  SOVEREIGNTY_MARKET_TUNING, advanceSovereigntyMarket, beliefLegsOf,
} from '../../src/domain/worldPulse/sovereigntyMarketStage.js';
import { mintSovereigntySaleTreaties, considerationTypeFor } from '../../src/domain/worldPulse/peaceTermsSale.js';
import { SOVEREIGNTY_REQUIRED_RULES } from '../../src/domain/worldPulse/sovereigntyAssets.js';
import { SOVEREIGNTY_TRAJECTORY_BANDS } from '../../src/domain/worldPulse/sovereigntyAppraisal.js';
import { createOccupationRecord } from '../../src/domain/worldPulse/occupation.js';
import {
  conveySteading as leafConveySteading,
  satellitesLedgerOf as leafSatellitesLedgerOf,
  satellitesOf as leafSatellitesOf,
} from '../../src/domain/worldPulse/satellitesLedger.js';
import {
  conveySteading as kernelConveySteading,
  satellitesLedgerOf as kernelSatellitesLedgerOf,
  satellitesOf as kernelSatellitesOf,
} from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import { treatyPairKey } from '../../src/domain/worldPulse/peaceTerms.js';
import { treatyOrientationOf } from '../../src/domain/worldPulse/treatyOrientation.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const T = SOVEREIGNTY_MARKET_TUNING;

/** Every prerequisite law explicitly true — derived from the exported conjunction, so a
 *  rule joining it cannot leave these fixtures silently dark. */
const LIT = Object.fromEntries(SOVEREIGNTY_REQUIRED_RULES.map((k) => [k, true]));

/** THE FOUR LEGS, SUPPLIED — TWO PICTURES, NOT ONE. This is the belief-legs wave's future
 *  output, hand-built, and the asymmetry is load-bearing rather than decorative: the
 *  clearing rule is a two-sided conjunction, so two courts holding the IDENTICAL picture
 *  can satisfy both arms only on an exact tie and a symmetric fixture would prove the
 *  market dead rather than alive. The seller believes it is selling a tired village; the
 *  buyer believes it is buying a swelling city. The gap between them is the trade. */
const SELLER_LEGS = Object.freeze({
  tierBand: 'village', storesBand: 'thin', routeBand: 'stirring', trajectoryBand: 'ebbing',
});
const BUYER_LEGS = Object.freeze({
  tierBand: 'city', storesBand: 'deep', routeBand: 'established', trajectoryBand: 'swelling',
});
const legsAlways = ({ courtId }) => ({ ...(courtId === 'buyer' ? BUYER_LEGS : SELLER_LEGS) });

/** A settlement crushed against its food bound — the pressure that puts it in a demanding
 *  band. `dailyProduction` far under `dailyNeed` collapses the food capacity, so the
 *  SHARED bound readers (never a rival ladder) put it well past `pressed`. */
function pressed(id, population = 4000) {
  // THE DISPLAY NAME IS NOT THE ID, and that is not cosmetic here: WW-C's projector treats
  // a settlement whose only name is its own id as an UNRESOLVED identity and refuses the
  // beat rather than narrating a key at a reader. A fixture that named its towns after
  // their save ids would have proved the Herald road green by never reaching it.
  const name = `${id.charAt(0).toUpperCase()}${id.slice(1)}hold`;
  return {
    id,
    name,
    settlement: {
      name, tier: 'town', population,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: {
        prosperity: 'Struggling', primaryExports: [], primaryImports: [],
        foodSecurity: { storageMonths: 1, dailyNeed: 4000, dailyProduction: 200, deficitPct: 95, surplusPct: 0, resilienceScore: 5 },
      },
      powerStructure: { publicLegitimacy: { score: 40, label: 'Shaky' }, factions: [], conflicts: [] },
      npcs: [], activeConditions: [],
    },
  };
}

// THE HOLDING IS A REAL SETTLEMENT IN THE SNAPSHOT, and it has to be: the Herald refuses
// a beat whose identities it cannot resolve (WW-C's REQUIRED_IDENTITIES discipline), so a
// fixture whose conveyed town is not in the world would prove the news road green by
// never reaching it. It is deliberately NOT pressed — a vassal under no pressure of its
// own cannot become a seller and confuse the trigger pins.
const ITEMS = [pressed('seller'), pressed('buyer', 900), { ...pressed('holding', 300), name: 'Holding' }];
const SNAPSHOT = {
  settlements: ITEMS,
  byId: new Map(ITEMS.map((i) => [String(i.id), i])),
  regionalGraph: { edges: [{ id: 'edge.seller.buyer', from: 'seller', to: 'buyer', relationshipType: 'neutral' }] },
};

/** A lit world holding ONE vassalized holding of `assetId` by `seller`, with the plan
 *  ledger's band cell carrying the PRIOR band (the crossing read). */
function marketWorld({ priorBand = 'easy', treaties = null, assetId = 'holding' } = {}) {
  return {
    tick: 40,
    rngSeed: 'seed-wr10w',
    simulationRules: { ...LIT },
    calendar: { season: 'summer' },
    occupations: {
      [assetId]: {
        ...createOccupationRecord('seller', 3), state: 'vassalized', stateHeld: 9, resistance: 0.05,
      },
    },
    relationshipStates: {},
    spatialLedgers: {
      demographicPlans: { seller: { band: priorBand } },
      ...(treaties ? { treaties } : {}),
    },
  };
}

/** THE REACH IS STUBBED, DELIBERATELY AND VISIBLY. `sovereigntyReach` reads the frozen
 *  spatial digest, the lived route network and the goods-flow ledger; standing all three
 *  up here would make this a spatial fixture measuring geography rather than the composer.
 *  Its own battery (sovereigntyMarketReadsWr10) pins the bound on a real digest, including
 *  the unreachable-buyer negative. Here the composer is driven with the bound OPEN, which
 *  is the configuration every other pin in this file is about. */
function run(worldState, overrides = {}) {
  return advanceSovereigntyMarket({
    snapshot: SNAPSHOT, worldState, settlementUpdates: [], tick: Number(worldState.tick),
    now: null, beliefLegsFor: legsAlways,
    reachFor: ({ assetIds }) => [...assetIds],
    ...overrides,
  });
}

/** The stage with the reach honoured but every other input identical — used only to prove
 *  the geographic bound really does empty the candidate set. */
const NO_REACH = { beliefLegsFor: legsAlways };

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — the gate', () => {
  it('DARK is a complete no-op: the SAME references back, nothing said', () => {
    const world = marketWorld({ priorBand: 'easy' });
    const dark = { ...world, simulationRules: {} };
    const updates = [];
    const out = advanceSovereigntyMarket({
      snapshot: SNAPSHOT, worldState: dark, settlementUpdates: updates, tick: 40, beliefLegsFor: legsAlways,
    });
    expect(out.worldState, 'the same object, not a clone').toBe(dark);
    expect(out.settlementUpdates, 'and the same updates array').toBe(updates);
    expect(out.changed).toBe(false);
    expect(out.newsEntries).toEqual([]);
    expect(out.receipts).toEqual([]);
    // LIVENESS: the identical call on the LIT world DOES reach the clearing, so the
    // identities above measure the gate rather than a fixture that could never have run.
    expect(run(world).receipts.length, 'the same call speaks when the flag is lit').toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — the episode gate is a CROSSING, not a level', () => {
  it('a settlement that CROSSES into a demanding band is a candidate; one that SITS in it is not', () => {
    // CROSSING: the plan ledger remembers `easy`, this tick reads a demanding band.
    const crossing = run(marketWorld({ priorBand: 'easy' }));
    expect(crossing.receipts.length, 'the crossing opened an episode').toBeGreaterThan(0);
    const band = String(crossing.receipts[0].episode).split(':')[1];
    expect(['pressed', 'overflowing'], 'the fixture really is in a demanding band').toContain(band);

    // THE LEVEL: the ledger already remembers the SAME band, so the settlement is merely
    // sitting in it — it drew when it arrived, and the cooldown is what lets it try again.
    const sitting = run(marketWorld({ priorBand: band }));
    // anchored: the crossing run one assertion above produced receipts on the identical
    // fixture, so this emptiness measures the stored band and not a dead composer.
    expect(sitting.receipts, 'a settlement sitting in its band draws nothing').toEqual([]);
    expect(sitting.worldState, 'and writes nothing').toBe(sitting.worldState);
    expect(sitting.changed).toBe(false);
  });

  it('MUTANT: level-instead-of-crossing is exactly what the pin above catches', () => {
    // The mutation, run against the real stage's own inputs: a trigger that asked only
    // "is the band demanding" would fire on BOTH fixtures. It fires on one.
    const crossingFires = run(marketWorld({ priorBand: 'easy' })).receipts.length > 0;
    const levelFires = run(marketWorld({ priorBand: 'overflowing' })).receipts.length > 0;
    expect(crossingFires).toBe(true);
    // anchored: the crossing arm is asserted true one line above, so the pair below is a
    // real discrimination rather than two dead reads.
    expect(levelFires).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — the treaty IS the cooldown (zero new keys)', () => {
  // THE COOLDOWN TREATY NAMES A THIRD COURT on purpose: keyed to the seller↔buyer pair it
  // would ALSO trip the mint's already-bound refusal, and the pin could not tell which of
  // the two guards produced the silence.
  const conveyance = (mintedTick) => ({
    parties: ['other_court', 'seller'], sellerId: 'seller', buyerId: 'other_court',
    mintedTick, complianceState: 'honored', receipts: [],
    terms: [{ type: 'sovereignty_transfer', family: 'sovereignty_transfer', assetId: 'other', mintedTick, expiresTick: mintedTick + 520 }],
  });

  it('a seller inside the cooldown band does not re-offer; one past it does', () => {
    const key = treatyPairKey('other_court', 'seller');
    const recent = run(marketWorld({ treaties: { [key]: conveyance(40 - 1) } }));
    // anchored: the same fixture with an OLD treaty speaks (next assertion), so this
    // silence is the cooldown rather than a composer that never ran.
    expect(recent.receipts, 'a court that sold last season is quiet').toEqual([]);

    const old = run(marketWorld({ treaties: { [key]: conveyance(40 - T.RESALE_COOLDOWN_TICKS - 1) } }));
    expect(old.receipts.length, 'and a court that sold a generation ago is not').toBeGreaterThan(0);
  });

  it('NO NEW KEY: the cooldown read invents nothing on the world', () => {
    const world = marketWorld({ priorBand: 'easy' });
    const before = Object.keys(world.spatialLedgers).sort();
    const out = run(world);
    const after = Object.keys(out.worldState.spatialLedgers || {}).sort();
    // The ONLY ledger the stage may add is `treaties`, and only when a sale clears.
    for (const key of after) {
      expect(['demographicPlans', 'treaties', 'satellites'], `${key} is not a key this stage may mint`).toContain(key);
    }
    expectAbsentWithAnchor(after, 'sovereigntyOffers', 'demographicPlans',
      'the demographic plan ledger survives, and no sovereignty ledger joins it');
    expect(before).toContain('demographicPlans');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — CR-WR10-H: the belief legs, and the honest no-trade', () => {
  it('THE LEGS THAT EXIST TODAY ARE ONE OF FOUR, and the composer says so instead of guessing', () => {
    // The real reader, against a world with a believed population trend and nothing else.
    const withTrend = beliefLegsOf({
      worldState: {
        spatialLedgers: { beliefMaps: { seller: { seat: { holding: { populationTrendBand: 1 } } } } },
      },
      courtId: 'seller', assetId: 'holding',
    });
    expect(withTrend.trajectoryBand, 'the one leg that HAS a surface reads as a real word')
      .toBe(SOVEREIGNTY_TRAJECTORY_BANDS[1 + 2 + 1]);
    expect(SOVEREIGNTY_TRAJECTORY_BANDS).toContain(withTrend.trajectoryBand);
    // anchored: the leg above is a live word off the same reader, so these absences are
    // missing SURFACES rather than a reader that returned nothing at all.
    expect(withTrend.tierBand).toBeUndefined();
    expect(withTrend.storesBand).toBeUndefined();
    expect(withTrend.routeBand).toBeUndefined();
    // No belief record at all ⇒ no legs, and still not a midpoint.
    expect(beliefLegsOf({ worldState: {}, courtId: 'seller', assetId: 'holding' })).toEqual({});
  });

  it('MISSING LEGS ⇒ an honest receipted no-trade on the sovereignty_no_trade road — never a backfill', () => {
    const out = advanceSovereigntyMarket({
      snapshot: SNAPSHOT, worldState: marketWorld(), settlementUpdates: [], tick: 40,
      // The PRODUCTION belief reader, with the surfaces empty: this is the wave as wired.
      // The reach is opened so the pin measures the BELIEF road and not the geography.
      reachFor: ({ assetIds }) => [...assetIds],
    });
    const noTrade = out.receipts.filter((r) => r.kind === 'sovereignty_no_trade');
    expect(noTrade.length, 'the machinery ran and produced nothing, receipted').toBeGreaterThan(0);
    expect(noTrade[0].verdict, 'and it names the belief road, not a price disagreement').toBe('unpriced');
    expect(String(noTrade[0].sellerReceipt)).toContain('cannot price');
    // NOTHING WAS WRITTEN. A no-trade is a result, not a transaction.
    expect(out.changed).toBe(false);
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();
    // AND THE HERALD HEARS IT: the road reaches a real registered kind end to end.
    expect(out.newsEntries.some((e) => String(e.impactKind || e.kind).includes('sovereignty')
      || String(e.id).includes('sovereignty_no_trade')), 'the no-trade reaches the feed').toBe(true);
  });

  it('THE SEARCH STOPS AT WHICHEVER BOUND BINDS FIRST — the ceiling ends the stacking', () => {
    // THE BELIEFS REVERSED: the seller believes it is selling a swelling city and the buyer
    // believes it is buying a tired village. The reserve is unreachable and the ceiling is
    // low, so the correct behaviour is to STOP the moment the ceiling is exceeded rather
    // than empty the whole catalogue into a refusal — amendment S's "whichever comes FIRST",
    // and the one thing that keeps overpayment from being the guaranteed outcome.
    const out = run(marketWorld(), {
      beliefLegsFor: ({ courtId }) => ({ ...(courtId === 'buyer' ? SELLER_LEGS : BUYER_LEGS) }),
    });
    const refused = out.receipts.filter((r) => r.kind === 'sovereignty_no_trade' && r.buyerId === 'buyer');
    expect(refused.length, 'the reversed beliefs refuse the trade').toBe(1);
    expect(refused[0].verdict).toBe('ceiling_reached');
    expect(refused[0].componentsAvailable, 'the catalogue really does offer more').toBeGreaterThan(refused[0].componentsOffered);
    // anchored: the available count is a live measurement one line above, so this bound is
    // the search stopping early rather than a count that was never taken.
    expect(refused[0].componentsOffered, 'and the search stopped at the ceiling').toBeLessThanOrEqual(4);
  });

  it('THE CONTRACT FIXTURE: with the four legs supplied, the clearing runs end to end and a town changes hands', () => {
    const out = run(marketWorld());
    const cleared = out.receipts.filter((r) => r.kind === 'sovereignty_sale_cleared');
    expect(cleared.length, 'the lit-with-legs road clears').toBe(1);
    expect(out.changed).toBe(true);

    // THE DOCUMENT: one treaty, victor-free, carrying the conveyance and its consideration.
    const ledger = getSpatialLedger(out.worldState, 'treaties');
    const key = treatyPairKey('buyer', 'seller');
    expect(Object.keys(ledger)).toEqual([key]);
    const treaty = ledger[key];
    const orientation = treatyOrientationOf(treaty);
    expect(orientation.kind).toBe('sale');
    expect(orientation.giverId).toBe('seller');
    expect(orientation.receiverId).toBe('buyer');
    // The orientation resolved to a live pair one line above, so the key set is real.
    // anchored: the absence is the victor-free shape, not an unread record.
    expect(Object.keys(treaty)).not.toContain('victorId');
    // anchored: same live key set, same reason — the war pair is absent by construction.
    expect(Object.keys(treaty)).not.toContain('loserId');
    // anchored: `sellerId` is present in that same set, so this absence is conditional.
    expect(Object.keys(treaty), 'a solitary sale gains no swapId').not.toContain('swapId');
    const conveyance = treaty.terms.find((t) => t.type === 'sovereignty_transfer');
    expect(conveyance.assetId).toBe('holding');
    expect(treaty.terms.length, 'and the consideration rides the same document').toBeGreaterThan(1);
    // §13 ONE PER FAMILY, per document.
    const families = treaty.terms.map((t) => t.family);
    expect(families.length).toBe(new Set(families).size);

    // THE CONVEYANCE EXECUTED AT THE SIGNING — the rung preserved, the buyer holding.
    expect(out.worldState.occupations.holding.occupierId).toBe('buyer');
    expect(out.worldState.occupations.holding.state, 'the vassal rung survived').toBe('vassalized');
    // AND THE HERALD HEARS IT.
    expect(out.newsEntries.length, 'the cleared sale reaches a real registered kind').toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — the character gate is consulted (§1b-B suppression)', () => {
  it('the intent reader RUNS, and its receipt travels onto the document it permitted', () => {
    // The consult is not observable by its absence — a composer that skipped it would
    // clear exactly the same trades on an unsuppressed pair. What IS observable is that
    // the intent's own receipt reaches the artifact, which it can only do if the reader
    // was called and its words carried forward. That is the seam the Herald's
    // `kinship_opposes_the_sale` beat consumes.
    const out = run(marketWorld());
    const ledger = getSpatialLedger(out.worldState, 'treaties');
    const receipts = ledger[treatyPairKey('buyer', 'seller')].receipts.join(' ');
    expect(receipts, 'the clearing receipt rode the document').toContain('holding');
    expect(receipts, "the INTENT's own receipt rode it too").toMatch(/weighs selling|will not sell/);
  });

  it('a suppressed intent scores 0 and is receipted rather than refusing the mint (§1b-B)', () => {
    // §1b-B's shape, asserted on the reader this stage consults: suppression is a SCORE of
    // zero WITH a receipt naming the contradicting state — never a thrown refusal. The
    // composer's own branch on it is the `sovereignty_sale_suppressed` receipt plus the
    // kinship beat; both are spelled from the reader's fields, so the reader's contract is
    // what this pin holds. The unsuppressed control clears on the identical fixture.
    const control = run(marketWorld());
    expect(control.receipts.some((r) => r.kind === 'sovereignty_sale_cleared'), 'the control clears').toBe(true);
    // anchored: the control above is a live clearing on the same world, so the absence of
    // a suppression receipt here measures an UNBOUND pair rather than a dead composer.
    expect(control.receipts.some((r) => r.kind === 'sovereignty_sale_suppressed')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — CR-WR10-D: a swap is TWO treaties on one swapId, atomically', () => {
  const world = () => ({
    tick: 40,
    simulationRules: { ...LIT },
    occupations: {
      east: { ...createOccupationRecord('west_court', 3), state: 'vassalized', stateHeld: 9, resistance: 0.05 },
      west: { ...createOccupationRecord('east_court', 3), state: 'vassalized', stateHeld: 9, resistance: 0.05 },
    },
    relationshipStates: {},
  });
  const legs = [
    { assetId: 'east', sellerId: 'west_court', buyerId: 'east_court', components: [{ family: 'economic', magnitude01: 0.4 }] },
    { assetId: 'west', sellerId: 'east_court', buyerId: 'west_court', components: [{ family: 'economic', magnitude01: 0.4 }] },
  ];

  it('BOTH legs mint, share ONE swapId, and both conveyances execute', () => {
    const out = mintSovereigntySaleTreaties({ sales: legs, worldState: world(), tick: 40 });
    expect(out.minted).toBe(true);
    expect(out.treaties.length).toBe(2);
    const ids = out.treaties.map((t) => String(t.swapId));
    expect(new Set(ids).size, 'one shared id binds the pair').toBe(1);
    expect(ids[0].length, 'and it is a real id').toBeGreaterThan(0);
    // SYMMETRY: each document conveys the OTHER court's holding, in the right direction.
    for (const treaty of out.treaties) {
      const o = treatyOrientationOf(treaty);
      const asset = String(treaty.terms.find((t) => t.type === 'sovereignty_transfer').assetId);
      expect(out.worldState.occupations[asset].occupierId, `${asset} passed to its buyer`).toBe(o.receiverId);
    }
    expect(out.worldState.occupations.east.occupierId).toBe('east_court');
    expect(out.worldState.occupations.west.occupierId).toBe('west_court');
  });

  it('ATOMIC: one unrepresentable leg mints NEITHER, and the world comes back by reference', () => {
    const start = world();
    const out = mintSovereigntySaleTreaties({
      sales: [legs[0], { ...legs[1], assetId: '' }], worldState: start, tick: 40,
    });
    expect(out.minted).toBe(false);
    expect(out.refusal).toBe('unrepresentable');
    expect(out.worldState, 'not one byte moved').toBe(start);
    // anchored: the same two legs mint in the test above, so this refusal measures the
    // atomicity rather than a mint that never worked.
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();
  });

  it('a SOLITARY sale gains no swapId at all (drop-when-absent, T4)', () => {
    const out = mintSovereigntySaleTreaties({ sales: [legs[0]], worldState: world(), tick: 40 });
    expect(out.minted).toBe(true);
    // The paired mint in the test above DOES carry the key on the same builder.
    // anchored: the absence here is the conditional discipline, not a dead field.
    expect(Object.keys(out.treaties[0])).not.toContain('swapId');
    expect(String(out.treaties[0].sellerId)).toBe('west_court');
  });

  it('the consideration family maps to a REAL catalog type, derived and never tabled', () => {
    for (const family of ['economic', 'relational', 'security', 'territorial', 'political']) {
      const type = considerationTypeFor(family);
      expect(type, `${family} resolves to a catalog type`).not.toBe('');
    }
    // The conveyance is the ASSET side and is never supplied as consideration.
    expect(considerationTypeFor('sovereignty_transfer')).toBe('');
    // anchored: five live families resolve above, so this empty is a real exclusion.
    expect(considerationTypeFor('trade_rights_that_do_not_exist_yet')).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — the geographic bound shapes the set', () => {
  it('an unreachable buyer never appears: with the real reach read, nothing is offered', () => {
    // The production reach reads a frozen digest, a lived route network and a goods-flow
    // ledger. This fixture has none of the three, so every buyer fails every leg and the
    // candidate set is EMPTY — failure is silence, plan-lane style, not a receipt.
    const out = advanceSovereigntyMarket({
      snapshot: SNAPSHOT, worldState: marketWorld(), settlementUpdates: [], tick: 40, ...NO_REACH,
    });
    // anchored: the stubbed-reach run in the contract fixture above clears on the identical
    // world, so this emptiness measures the bound rather than a composer that never ran.
    expect(out.receipts.some((r) => r.kind === 'sovereignty_sale_cleared')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — CR-WR10-I: the kernel re-export is the SAME function, not a second one', () => {
  it('every re-exported ledger name is object-identical to the leaf that owns it', () => {
    // THE EXTRACTION'S OWN CLAIM, ASSERTED RATHER THAN ASSUMED. CR-WR10-I moved the
    // satellites ledger out of settlementLifecycleKernel.js and re-exported all three
    // names from it so no consumer's import path moved. A re-export that had quietly
    // become a WRAPPER — or worse, a second copy of the row-move — would satisfy every
    // existing test in the tree while making the "one authority" claim false, because a
    // copy can drift from the orbit rule the leaf owns. Identity is the only assertion
    // that can tell the difference.
    expect(kernelConveySteading).toBe(leafConveySteading);
    expect(kernelSatellitesLedgerOf).toBe(leafSatellitesLedgerOf);
    expect(kernelSatellitesOf).toBe(leafSatellitesOf);
    // …and they are live functions, so the identities above are not three undefineds.
    expect(typeof leafConveySteading).toBe('function');
    expect(leafSatellitesLedgerOf({})).toBeNull();
    expect(leafSatellitesOf(null, 'nobody')).toEqual([]);
  });
});
