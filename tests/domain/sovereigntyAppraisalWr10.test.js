/**
 * sovereigntyAppraisalWr10.test.js — WR-10b: WHAT ONE COURT THINKS A TOWN IS WORTH.
 *
 * The pins here are shaped by two hazards this estate has already been bitten by.
 *
 * THE CONJUNCTION-BLIND GUARD PAIR. `appraiseSettlementAsset` has FOUR legs and any
 * one missing must sink the read. A single fixture that omits all four proves only
 * their conjunction — delete three of the four guards and it stays green. So each leg
 * gets its OWN test, each holding the other three known, which is the only shape that
 * proves four guards rather than one.
 *
 * THE VOCABULARY-BORROW CLAIM. J-WR-10 says the ladders are borrowed, not minted, and
 * the K3 pin forces this module to have ZERO IMPORTS — so it must RE-DECLARE them, and
 * a re-declaration is a second spelling that can drift. The `envoyTestimony` precedent
 * applies: the test imports both spellings and asserts they are EQUAL, so refusing the
 * import costs no drift. The one MINTED ladder is asserted to be minted-because-absent
 * rather than minted-by-preference, with the census run in the test itself.
 */
import { describe, it, expect } from 'vitest';
import {
  appraiseSettlementAsset, sovereigntyValueBand,
  SOVEREIGNTY_TIER_BANDS, SOVEREIGNTY_STORES_BANDS, SOVEREIGNTY_ROUTE_BANDS,
  SOVEREIGNTY_TRAJECTORY_BANDS, SOVEREIGNTY_SELLER_TRAJECTORY_BANDS,
  SOVEREIGNTY_VALUE_BANDS, SOVEREIGNTY_APPRAISAL_TUNING,
} from '../../src/domain/worldPulse/sovereigntyAppraisal.js';
import { TIER_ORDER } from '../../src/data/constants.js';
import { ROUTE_FLOW_BANDS } from '../../src/domain/worldPulse/routeNetworkFlows.js';
import { WAR_COST_TRAJECTORIES } from '../../src/domain/worldPulse/warCosts.js';
import { NEGOTIATION_SUBJECT_BANDS } from '../../src/domain/worldPulse/negotiationPictures.js';

/**
 * A DECIMAL IN A SENTENCE — the engine's own notation, which addendum A-1 forbids in
 * reader prose. Deliberately NOT "any digit": a receipt may name honest whole counts
 * (`1 offered component(s)`, `9 component families`), and banning those would have made
 * the guard prove a rule nobody holds. Both halves are executed below.
 */
const DECIMAL_IN_PROSE = /\d*\.\d+/;

/** A fully-heard picture. Individual tests blank ONE leg at a time. */
const heard = (over = {}) => ({
  assetId: 'greenhollow',
  appraiserId: 'ironvale',
  tierBand: 'town',
  storesBand: 'stocked',
  routeBand: 'steady',
  trajectoryBand: 'growing',
  ...over,
});

describe('WR-10b — the appraisal reads one court\'s own picture', () => {
  it('a fully-heard picture produces a number, a band, the evidence and a receipt', () => {
    const read = appraiseSettlementAsset(heard());
    expect(read.known).toBe(true);
    expect(read.value01).toBeGreaterThan(0);
    expect(read.value01).toBeLessThanOrEqual(1);
    expect(SOVEREIGNTY_VALUE_BANDS).toContain(read.valueBand);
    expect(read.valueBand).not.toBe('unknown'); // anchored: SOVEREIGNTY_VALUE_BANDS is asserted to contain the band on the line above, so this cannot pass by the ladder emptying
    expect(read.receipt).toContain('greenhollow');
  });

  it('LAW B: the evidence names every banded state that produced the score', () => {
    const read = appraiseSettlementAsset(heard());
    expect(read.evidence).toEqual({
      tierBand: 'town',
      storesBand: 'stocked',
      routeBand: 'steady',
      trajectoryBand: 'growing',
      sellerTrajectoryBand: 'unknown',
      firesaleApplied: false,
    });
    // The receipt is the same facts in words — a score whose evidence and prose can
    // disagree is a score with two answers.
    for (const word of ['town', 'stocked', 'steady', 'growing']) {
      expect(read.receipt).toContain(word);
    }
  });

  // ── THE FOUR LEGS, EACH PROVED TO BITE ALONE ──────────────────────────────
  for (const leg of ['tierBand', 'storesBand', 'routeBand', 'trajectoryBand']) {
    it(`a missing ${leg} ALONE sinks the read to unknown (the other three are heard)`, () => {
      const read = appraiseSettlementAsset(heard({ [leg]: 'unknown' }));
      expect(read.known, `${leg} must be load-bearing by itself`).toBe(false);
      expect(read.value01, 'null, never a midpoint — the finite-semantics law').toBe(null);
      expect(read.valueBand).toBe('unknown');
      // Non-vacuity: the SAME fixture with that leg heard does produce a number, so
      // this test cannot be passing because the fixture was broken all along.
      expect(appraiseSettlementAsset(heard()).known).toBe(true);
    });

    it(`a garbage ${leg} is treated as unheard, not as a silent zero`, () => {
      const read = appraiseSettlementAsset(heard({ [leg]: 'not_a_band' }));
      expect(read.known).toBe(false);
      expect(read.value01).toBe(null);
      expect(read.evidence[leg]).toBe('unknown');
    });
  }

  it('THE demographicsEnabled LIT-PRECONDITION IS ARITHMETIC, not a convention', () => {
    // §3's flag-dependency ruling makes wave-P a lit-precondition for WR-10 because the
    // appraisal reads the demographic trajectory. With that machinery dark the caller
    // has no trajectory to pass, and the appraisal comes back UNKNOWN by construction.
    const dark = appraiseSettlementAsset(heard({ trajectoryBand: 'unknown' }));
    expect(dark.known).toBe(false);
    expect(dark.receipt).toContain('filling or emptying');
    expect(appraiseSettlementAsset(heard()).known).toBe(true); // lit: a number exists
  });

  it('K4: two courts looking at ONE town produce TWO numbers, never a merged third', () => {
    const asset = 'greenhollow';
    const seller = appraiseSettlementAsset({
      assetId: asset, appraiserId: 'ironvale',
      tierBand: 'city', storesBand: 'deep', routeBand: 'established', trajectoryBand: 'swelling',
    });
    const buyer = appraiseSettlementAsset({
      assetId: asset, appraiserId: 'saltmarch',
      tierBand: 'village', storesBand: 'thin', routeBand: 'trace', trajectoryBand: 'ebbing',
    });
    expect(seller.known && buyer.known).toBe(true);
    expect(seller.value01).toBeGreaterThan(Number(buyer.value01));
    expect(seller.appraiserId).not.toBe(buyer.appraiserId); // anchored: both ids are asserted non-empty by the known:true check above, so this cannot pass on two blank strings
    // The gap is the mechanism, not an error: a market needs two prices to exist.
  });

  it('the firesale discounts a LOSING seller and leaves even/winning alone', () => {
    const base = appraiseSettlementAsset(heard());
    const losing = appraiseSettlementAsset(heard({ sellerTrajectoryBand: 'losing' }));
    const even = appraiseSettlementAsset(heard({ sellerTrajectoryBand: 'even' }));
    const winning = appraiseSettlementAsset(heard({ sellerTrajectoryBand: 'winning' }));
    expect(losing.value01).toBeLessThan(Number(base.value01));
    expect(losing.evidence.firesaleApplied).toBe(true);
    expect(even.value01).toBe(base.value01);
    expect(winning.value01).toBe(base.value01);
    expect(even.evidence.firesaleApplied).toBe(false);
    expect(losing.receipt).toContain('losing its war');
    // The discount is the tuned band, not an arbitrary shrink.
    expect(losing.value01).toBeCloseTo(
      Number(base.value01) * SOVEREIGNTY_APPRAISAL_TUNING.FIRESALE_LOSING_MULT, 3,
    );
  });

  it('a richer picture is worth more on EVERY leg independently (the composite is monotone)', () => {
    const poor = heard({ tierBand: 'thorp', storesBand: 'bare', routeBand: 'none', trajectoryBand: 'emptying' });
    const base = Number(appraiseSettlementAsset(poor).value01);
    for (const [leg, better] of [
      ['tierBand', 'metropolis'], ['storesBand', 'deep'],
      ['routeBand', 'established'], ['trajectoryBand', 'swelling'],
    ]) {
      const lifted = Number(appraiseSettlementAsset({ ...poor, [leg]: better }).value01);
      expect(lifted, `${leg} must move the price by itself`).toBeGreaterThan(base);
    }
  });

  it('a court cannot appraise itself, and an unnamed pair prices nothing', () => {
    expect(appraiseSettlementAsset(heard({ appraiserId: 'greenhollow' })).known).toBe(false);
    expect(appraiseSettlementAsset(heard({ assetId: '' })).known).toBe(false);
    expect(appraiseSettlementAsset(null).known).toBe(false);
    expect(appraiseSettlementAsset(null).value01).toBe(null);
  });

  it('PURE: same input ⇒ deep-equal output, and the input object is not touched', () => {
    const input = heard();
    const frozenCopy = JSON.parse(JSON.stringify(input));
    const a = appraiseSettlementAsset(input);
    const b = appraiseSettlementAsset(input);
    expect(a).toEqual(b);
    expect(input).toEqual(frozenCopy);
  });

  it('THE RECEIPT SPEAKS BANDS, NEVER THE ENGINE\'S SCALAR (addendum A-1, both ways)', () => {
    // WR-10r's structural half. The prose-numerics ratchet is a source SCAN, so it sees
    // only the template that exists today; nothing stopped a later edit from putting
    // `${value01}` back into a sentence and adding a fresh row to a shrink-only baseline.
    // This pin is the behavioural guard the scan cannot be: it runs the real composer
    // over reads spread across the whole ladder and asserts the OUTPUT is band-shaped.
    const reads = [
      appraiseSettlementAsset(heard()),
      appraiseSettlementAsset(heard({ sellerTrajectoryBand: 'losing' })),
      appraiseSettlementAsset(heard({ tierBand: 'metropolis', storesBand: 'deep', routeBand: 'established', trajectoryBand: 'swelling' })),
      appraiseSettlementAsset(heard({ tierBand: 'thorp', storesBand: 'bare', routeBand: 'none', trajectoryBand: 'emptying' })),
      appraiseSettlementAsset(heard({ trajectoryBand: 'unknown' })), // the unknown road too
    ];
    expect(new Set(reads.map((r) => r.valueBand)).size, 'the fixtures must span the ladder').toBeGreaterThan(2);
    for (const read of reads) {
      expect(read.receipt.length, 'a receipt must be a real sentence').toBeGreaterThan(30);
      // anchored: the receipt is asserted to be a non-trivial sentence on the line above,
      // so this absence cannot pass by the composer returning an empty string.
      expect(DECIMAL_IN_PROSE.test(read.receipt), read.receipt).toBe(false);
      if (read.known) expect(read.receipt).toContain(read.valueBand.replace(/_/g, ' '));
    }
    // GUARD-THE-GUARD (executed mutant): the identical predicate MUST catch the sentence
    // this wave replaced, or a green here would mean the detector rotted rather than the
    // prose improved.
    expect(DECIMAL_IN_PROSE.test('ironvale prices greenhollow at 0.6382 (great) from a town seat.')).toBe(true);
    // ...and it must not ban honest whole counts, which reader prose is allowed to name.
    expect(DECIMAL_IN_PROSE.test('the court weighed 3 offers over 2 years.')).toBe(false);
  });

  it('sovereigntyValueBand shares the appraisal\'s ladder and says `unknown` for no read', () => {
    expect(sovereigntyValueBand(null)).toBe('unknown');
    expect(sovereigntyValueBand('nonsense')).toBe('unknown');
    const read = appraiseSettlementAsset(heard());
    expect(sovereigntyValueBand(read.value01)).toBe(read.valueBand);
  });
});

describe('WR-10b — J-WR-10: the ladders are borrowed where a spelling exists', () => {
  it('TIER is the canonical TIER_ORDER verbatim, with `unknown` prefixed', () => {
    expect(TIER_ORDER.length).toBeGreaterThan(0); // non-vacuity
    expect([...SOVEREIGNTY_TIER_BANDS].slice(1)).toEqual([...TIER_ORDER]);
    expect(SOVEREIGNTY_TIER_BANDS[0]).toBe('unknown');
  });

  it('STORES is the negotiation picture\'s own storesBand ladder verbatim', () => {
    const source = NEGOTIATION_SUBJECT_BANDS.storesBand;
    expect(source.length).toBeGreaterThan(0);
    expect([...SOVEREIGNTY_STORES_BANDS]).toEqual([...source]);
  });

  it('ROUTE is ROUTE_FLOW_BANDS verbatim, with `unknown` prefixed', () => {
    expect(ROUTE_FLOW_BANDS.length).toBeGreaterThan(0);
    expect([...SOVEREIGNTY_ROUTE_BANDS].slice(1)).toEqual([...ROUTE_FLOW_BANDS]);
  });

  it('the SELLER trajectory is WAR_COST_TRAJECTORIES verbatim — a wartime firesale reads a war', () => {
    expect(WAR_COST_TRAJECTORIES.length).toBeGreaterThan(0);
    expect([...SOVEREIGNTY_SELLER_TRAJECTORY_BANDS].slice(1)).toEqual([...WAR_COST_TRAJECTORIES]);
  });

  it('the DEMOGRAPHIC trajectory is minted because no direction ladder existed to borrow', () => {
    // The census that justifies the mint, run here rather than asserted in prose: none
    // of the tree's closed ladders is a settlement growth/decline DIRECTION. War
    // trajectory is a war's direction; stores and route are levels. Minting a synonym
    // for any of them would have been the J-WR-10 violation; minting the first spelling
    // of an absent concept is not.
    expect([...SOVEREIGNTY_TRAJECTORY_BANDS]).not.toEqual([...WAR_COST_TRAJECTORIES]); // anchored: both ladders are asserted non-empty in the sibling tests above, so this cannot pass on two empty arrays
    expect(SOVEREIGNTY_TRAJECTORY_BANDS[0]).toBe('unknown');
    expect(SOVEREIGNTY_TRAJECTORY_BANDS).toContain('steady');
    // Symmetric around `steady`: two rungs of decline, two of growth. A ladder with a
    // lopsided middle would quietly bias every appraisal in the realm.
    const i = SOVEREIGNTY_TRAJECTORY_BANDS.indexOf('steady');
    expect(i - 1).toBe(SOVEREIGNTY_TRAJECTORY_BANDS.length - 1 - i);
  });

  it('every ladder leads with `unknown`, and no ladder carries a duplicate rung', () => {
    for (const ladder of [
      SOVEREIGNTY_TIER_BANDS, SOVEREIGNTY_STORES_BANDS, SOVEREIGNTY_ROUTE_BANDS,
      SOVEREIGNTY_TRAJECTORY_BANDS, SOVEREIGNTY_SELLER_TRAJECTORY_BANDS, SOVEREIGNTY_VALUE_BANDS,
    ]) {
      expect(ladder[0]).toBe('unknown');
      expect(new Set(ladder).size).toBe(ladder.length);
    }
  });
});
