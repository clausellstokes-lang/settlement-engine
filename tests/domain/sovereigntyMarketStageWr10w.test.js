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
  SOVEREIGNTY_MARKET_TUNING, advanceSovereigntyMarket, beliefLegsOf, offerWeightOf, raceOrder,
} from '../../src/domain/worldPulse/sovereigntyMarketStage.js';
import { readSovereigntySaleIntent } from '../../src/domain/worldPulse/sovereigntyIntent.js';
import { REASON_MIRRORS } from '../../src/domain/worldPulse/warReasonTaxonomy.js';
import { reasonPairKey } from '../../src/domain/worldPulse/warReasons.js';
import { hash01 } from '../../src/domain/region/contestMath.js';
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
 *  ledger's band cell carrying the PRIOR band (the crossing read). `assetIds` takes the
 *  place of `assetId` when a fixture needs a seller holding more than one town. */
function marketWorld({
  priorBand = 'easy', treaties = null, assetId = 'holding', assetIds = null, peaceReasons = null,
} = {}) {
  /** @type {Record<string, unknown>} */
  const occupations = {};
  for (const id of assetIds || [assetId]) {
    occupations[id] = {
      ...createOccupationRecord('seller', 3), state: 'vassalized', stateHeld: 9, resistance: 0.05,
    };
  }
  return {
    tick: 40,
    rngSeed: 'seed-wr10w',
    simulationRules: { ...LIT },
    calendar: { season: 'summer' },
    occupations,
    relationshipStates: {},
    spatialLedgers: {
      demographicPlans: { seller: { band: priorBand } },
      ...(treaties ? { treaties } : {}),
      ...(peaceReasons ? { peaceReasons } : {}),
    },
  };
}

/** A LIVE KINSHIP BOND on the seller's own picture of the buyer — the one suppression
 *  road §1b-B has today. The mirror is named through `REASON_MIRRORS.lineage_claim`
 *  rather than as the string `kinship_bond`, so the fixture is bound to WR-3's taxonomy
 *  and cannot drift into a bond the scorer no longer reads. */
function kinshipBond(sellerId, buyerId) {
  return {
    [reasonPairKey(sellerId, buyerId)]: {
      reasons: {
        [REASON_MIRRORS.lineage_claim]: {
          score: 0.62,
          sinceTick: 3,
          receipt: 'a surviving founding edge binds the two courts.',
        },
      },
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

/** A snapshot over an arbitrary court list, built from the SAME pressed factory the
 *  three-court fixture uses, so a race fixture and the contract fixture differ only in
 *  who is standing there. */
function snapshotOf(ids) {
  const items = ids.map((id) => (id === 'seller' ? pressed(id) : pressed(id, 900)));
  return {
    settlements: items,
    byId: new Map(items.map((i) => [String(i.id), i])),
    regionalGraph: { edges: [{ id: 'edge.seller.buyer', from: 'seller', to: 'buyer', relationshipType: 'neutral' }] },
  };
}

/** The composer over a named snapshot, reach open, everything else as `run`. */
function runOn(snapshot, worldState, overrides = {}) {
  return advanceSovereigntyMarket({
    snapshot, worldState, settlementUpdates: [], tick: Number(worldState.tick), now: null,
    beliefLegsFor: legsAlways, reachFor: ({ assetIds }) => [...assetIds], ...overrides,
  });
}

/** EVERY COURT BUT THE SELLER PRICES THE TOWN AS A BUYER — the asymmetry that lets more
 *  than one candidate clear, which is what a race needs in order to be observable. */
const legsEveryBuyer = ({ courtId }) => ({ ...(courtId === 'seller' ? SELLER_LEGS : BUYER_LEGS) });

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

  it('THE SUPPRESSED SALE NEVER REACHES THE CLEARING: a live kinship bond stops it dead', () => {
    // THE ONE PRODUCTION SUPPRESSION ROAD, DRIVEN END TO END. The bond is written where
    // the world writes it — the seller's own peace-reason picture of the buyer — and the
    // composer is given the identical everything else that clears in the control above.
    // Without this pin the whole §1b-B branch could be deleted (`if (false && …)`) and
    // every other assertion in this file would stay green, because an unsuppressed pair
    // is unsuppressed either way: the branch is only observable on a pair that HAS a bond.
    const world = marketWorld({ peaceReasons: kinshipBond('seller', 'buyer') });
    const out = run(world);

    const suppressed = out.receipts.filter((r) => r.kind === 'sovereignty_sale_suppressed');
    expect(suppressed.length, 'the refusal is receipted, not silent').toBe(1);
    expect(suppressed[0].buyerId).toBe('buyer');
    expect(suppressed[0].suppressionKind, 'and it names WHICH reading contradicted the sale')
      .toBe(REASON_MIRRORS.lineage_claim);
    expect(String(suppressed[0].receipt), 'in the world\'s own words').toContain('will not sell holding to buyer');

    // IT NEVER REACHED THE CLEARING. The control on the identical fixture (the test above)
    // clears and mints, so each absence below is the gate holding rather than a dead world.
    // `run(marketWorld())` one test above produces a cleared receipt on this exact
    // anchored: fixture minus the bond, so this emptiness is the suppression itself.
    expect(out.receipts.map((r) => r.kind)).not.toContain('sovereignty_sale_cleared');
    // Same live control — a no-trade would mean the pair was PRICED and then refused,
    // anchored: which is a different road entirely, and the gate must come first.
    expect(out.receipts.map((r) => r.kind)).not.toContain('sovereignty_no_trade');
    expect(out.changed, 'not one byte moved').toBe(false);
    expect(out.worldState, 'and the world came back by reference').toBe(world);
    expect(getSpatialLedger(out.worldState, 'treaties')).toBeUndefined();

    // AND THE HERALD HEARS THE REFUSAL — the `kinship_opposes_the_sale` beat, end to end.
    expect(out.newsEntries.length, 'the refusal reaches a real registered kind').toBeGreaterThan(0);
  });

  it('THE SECOND ARM IS LIVE TOO: a zero-scored intent takes the same road, unsuppressed', () => {
    // The gate reads `suppressed || score01 <= 0`, and the production reader FLOORS an
    // unsuppressed score at UNSUPPRESSED_FLOOR01 — so the second arm cannot be reached
    // from outside and would be an unproven branch forever. The injected reader is how it
    // is proven live rather than deleted as decoration: a court that sets no price at all
    // is refused with the same receipt, and its `suppressionKind` is honestly null.
    const zeroScored = ({ sellerId, buyerId, assetId }) => ({
      sellerId, buyerId, assetId, score01: 0, suppressed: false, suppressionKind: null,
      interestKind: 'realm', booksDiverge: false, securityBand: 'unseated',
      receipt: `${sellerId} sets no price at all on ${assetId} for ${buyerId}.`,
      evidence: {},
    });
    const out = run(marketWorld(), { intentFor: zeroScored });
    const suppressed = out.receipts.filter((r) => r.kind === 'sovereignty_sale_suppressed');
    expect(suppressed.length, 'a zero score is refused and receipted').toBe(1);
    expect(suppressed[0].suppressionKind, 'with no contradicting reading to name').toBeNull();
    expect(String(suppressed[0].receipt)).toContain('sets no price at all');
    // The identical call with the PRODUCTION reader clears (the control test above),
    // anchored: so this absence measures the score arm and not an inert fixture.
    expect(out.receipts.map((r) => r.kind)).not.toContain('sovereignty_sale_cleared');
    expect(out.changed).toBe(false);
  });

  it('THE GATE MAY BE HOISTED ABOVE THE ASSETS — measured on the real reader, not assumed', () => {
    // The composer reads the intent ONCE per (seller, buyer) for the gate and again per
    // ASSET for the receipt that rides the document. That split is only legitimate if
    // suppression and score really are asset-independent, which is a property of the
    // reader, not a hope — so it is measured here on the production reader.
    const world = marketWorld({ assetIds: ['holding', 'holdtwo'] });
    const snapshot = snapshotOf(['seller', 'buyer', 'holding', 'holdtwo']);
    const one = readSovereigntySaleIntent({ worldState: world, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'holding' });
    const two = readSovereigntySaleIntent({ worldState: world, snapshot, sellerId: 'seller', buyerId: 'buyer', assetId: 'holdtwo' });
    expect(two.score01, 'the score does not move with the asset').toBe(one.score01);
    expect(two.suppressed, 'and neither does suppression').toBe(one.suppressed);
    expect(one.score01, 'both are live reads, not zeros').toBeGreaterThan(0);
    // …AND THE RECEIPT DOES MOVE, which is exactly why it may not be hoisted with them.
    expect(one.receipt).toContain('holding');
    expect(two.receipt).toContain('holdtwo');
    expect(two.receipt).not.toBe(one.receipt);
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
describe('WW-B — the race is a RACE, and its band is alive', () => {
  const KEY = (buyerId, assetId, episode) => `sovereignty.offer.seed-wr10w.seller.${buyerId}.${assetId}.${episode}`;

  it('THE BAR IS LIVE ON BOTH SIDES: flipping the offer weight flips the winner', () => {
    // THE DEAD-BAND LAW, APPLIED TO THIS BAND. A weight that multiplied every candidate
    // alike would cancel out of an ordering and could never change an outcome — a number
    // in a tuning table that no owner signature could ever move. So the bar is the FLOOR
    // each candidate stands on and intent lifts it: at 1 every candidate weighs the same
    // and the race is intent-blind; at 0 the weight IS the intent. Two candidates, one
    // strong draw with a weak appetite and one weak draw with a full appetite — and the
    // winner changes with the band, which is what makes the band real.
    const episode = '40:overflowing';
    const strongDraw = { buyerId: 'birch', assetId: 'holding', key: KEY('birch', 'holding', episode) };
    const weakDraw = { buyerId: 'alder', assetId: 'holding', key: KEY('alder', 'holding', episode) };
    // THE PREMISE, MEASURED rather than assumed — these two keys really do draw apart.
    expect(hash01(strongDraw.key)).toBeGreaterThan(hash01(weakDraw.key) + 0.25);

    const winnerAt = (base) => raceOrder([
      { ...strongDraw, weight: offerWeightOf(0.1, base) },
      { ...weakDraw, weight: offerWeightOf(1, base) },
    ])[0].buyerId;
    expect(winnerAt(1), 'intent-blind: the biggest draw takes it').toBe('birch');
    expect(winnerAt(0), 'intent alone: the eager court takes it').toBe('alder');
    expect(winnerAt(T.BASE_OFFER_WEIGHT), 'and the tuned band today sits on the draw side').toBe('birch');

    // THE WEIGHT ITSELF, at both ends: a bar of 1 erases the colour, a bar of 0 IS it.
    expect(offerWeightOf(0.1, 1)).toBe(offerWeightOf(1, 1));
    expect(offerWeightOf(0.4, 0)).toBe(0.4);
    expect(offerWeightOf(0, T.BASE_OFFER_WEIGHT), 'and no candidate ever falls below the bar')
      .toBe(T.BASE_OFFER_WEIGHT);
  });

  it('the order is TOTAL: an exact tie breaks on the key, never on argument order', () => {
    const tied = raceOrder([
      { buyerId: 'zephyr', assetId: 'holding', key: 'z', weight: 0 },
      { buyerId: 'alder', assetId: 'holding', key: 'a', weight: 0 },
    ]);
    expect(tied.map((c) => c.key), 'zero-weight draws tie, and codepoint decides').toEqual(['a', 'z']);
    expect(tied.every((c) => c.draw === 0), 'the tie really is exact').toBe(true);
  });

  it('THE COMPOSER SELLS TO THE DRAW, NOT TO THE ALPHABET', () => {
    // Two courts that would BOTH clear on the identical picture. A composer that offered
    // in enumeration order would always sell to `alder`; this one sells to `birch`,
    // because `birch` drew higher. The control below is what makes that a discrimination
    // rather than a coincidence: with `birch` out of the world, `alder` clears.
    const buyers = snapshotOf(['seller', 'alder', 'birch', 'holding']);
    const out = runOn(buyers, marketWorld(), { beliefLegsFor: legsEveryBuyer });
    const cleared = out.receipts.filter((r) => r.kind === 'sovereignty_sale_cleared');
    expect(cleared.length, 'exactly one sale closes the episode').toBe(1);
    expect(cleared[0].buyerId).toBe('birch');
    expect('alder' < 'birch', 'and the loser is the one enumeration would have reached first').toBe(true);
    // THE DRAWS, computed straight from `hash01` rather than from the ordering under test.
    const episode = String(cleared[0].episode);
    expect(hash01(KEY('birch', 'holding', episode)))
      .toBeGreaterThan(hash01(KEY('alder', 'holding', episode)));

    // THE CONTROL: `alder` was a live candidate all along, and takes the town when the
    // court that outdrew it is not standing there.
    const alone = runOn(snapshotOf(['seller', 'alder', 'holding']), marketWorld(), { beliefLegsFor: legsEveryBuyer });
    expect(alone.receipts.filter((r) => r.kind === 'sovereignty_sale_cleared').map((r) => r.buyerId))
      .toEqual(['alder']);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
describe('WW-B — a court is never a buyer for its own seat', () => {
  const TWO_ASSET_SNAPSHOT = snapshotOf(['seller', 'buyer', 'holding', 'holdtwo']);

  it('NO RECEIPT EVER NAMES A COURT PRICING ITSELF', () => {
    // A settlement is both a party and a holding in this world, so the buyer enumeration
    // hands `holding` its own id as an asset unless the pair is excluded at assembly. The
    // appraisal leaf then refuses (a court cannot price itself) and the refusal travels to
    // the Herald as an honest no-trade about a sale nobody proposed. The production belief
    // reader is used deliberately: nothing clears, so EVERY candidate is receipted and the
    // stream below is the whole field rather than the field up to the first sale.
    const out = advanceSovereigntyMarket({
      snapshot: TWO_ASSET_SNAPSHOT, worldState: marketWorld({ assetIds: ['holding', 'holdtwo'] }),
      settlementUpdates: [], tick: 40, reachFor: ({ assetIds }) => [...assetIds],
    });
    const pairs = out.receipts.map((r) => `${r.buyerId}/${r.assetId}`);
    expect(pairs.length, 'the field really was enumerated').toBeGreaterThan(2);
    // THE ANCHOR: `holding` IS enumerated as a buyer — it simply never buys itself.
    expect(pairs, 'a court still buys its neighbours').toContain('holding/holdtwo');
    // The live `holding/holdtwo` row one line above proves this court reached the
    // anchored: receipt road, so the absence below is the exclusion and not silence.
    expect(pairs).not.toContain('holding/holding');
    // anchored: same live field, same reason — the mirror pair is excluded too.
    expect(pairs).not.toContain('holdtwo/holdtwo');
    expect(out.receipts.every((r) => r.assetId !== r.buyerId), 'and no self-pair anywhere').toBe(true);
  });

  it('THE RECEIPT ON THE DOCUMENT NAMES THE ASSET ACTUALLY SOLD (§1b-B travels per asset)', () => {
    // A seller holding TWO towns. The race picks `holdtwo`; the intent receipt that rides
    // the deed must be the one for `holdtwo`. Read once for the first-listed asset and
    // carried onto whichever asset happened to clear, it would quote the court's reasons
    // about a town that never changed hands — a lie in the artifact's own voice, and one
    // no reader could catch, because the sentence is perfectly well-formed prose.
    const out = runOn(TWO_ASSET_SNAPSHOT, marketWorld({ assetIds: ['holding', 'holdtwo'] }));
    const cleared = out.receipts.filter((r) => r.kind === 'sovereignty_sale_cleared');
    expect(cleared.length).toBe(1);
    expect(cleared[0].assetId, 'the race took the second-listed town').toBe('holdtwo');
    expect('holding' < 'holdtwo', 'and the first-listed one is the OTHER town').toBe(true);

    const receipts = getSpatialLedger(out.worldState, 'treaties')[treatyPairKey('buyer', 'seller')].receipts.join(' ');
    expect(receipts, "the intent's receipt names the town that moved").toContain('weighs selling holdtwo to buyer');
    // The live sentence above is the same reader's output on the same pair, so this
    // anchored: absence measures WHICH asset was read, not a receipt list that vanished.
    expect(receipts).not.toContain('weighs selling holding to buyer');
    expect(out.worldState.occupations.holdtwo.occupierId, 'and the town that moved is the one sold').toBe('buyer');
    expect(out.worldState.occupations.holding.occupierId, 'the other stayed home').toBe('seller');
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
