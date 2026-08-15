/**
 * magicBufferModel.test.js — W-K slice K3 THE DISASTER BUFFER, the arithmetic pins
 * (binding law docs/DESIGN_MAGIC_ECONOMY.md §5, constitutional law 5).
 *
 * Every claim §5 makes about the buffer is a claim about the SHAPE of one expression,
 * so this file exercises that expression directly and composes the gate through K2's
 * real `magicExploitationGate` rather than a hand-typed number. A pin that fed itself
 * a convenient gate would be proving its own arithmetic against its own assumption.
 *
 * THE SEVEN CLAIMS, and where each lands:
 *   1. THE GATING ASYMMETRY  high-magic/poor mitigates like mundane/poor, and does NOT
 *      at the top. Two-sided on purpose (see the pin's own note).
 *   2. THE ORDERING ENVELOPE mitigation rises with each axis and damage falls with it,
 *      across the whole magic by economy grid.
 *   3. THE CEILING HOLDS     the cap binds, and no corner of the grid nullifies a
 *      disaster.
 *   4. THE SECOND-SHOCK WINDOW  a drawn buffer mitigates measurably less, and the
 *      window is longer than the calamity cooldown for the poor.
 *   5. CONSERVATION          what is saved is billed, exactly, to named stocks.
 *   6. AFFORDABILITY         nothing is mitigated that cannot be paid for.
 *   7. THE SHAPES            the terms are genuinely banded, and repair acceleration
 *      is literally the mitigation shape times a constant.
 *
 * Reachability of the grid's corners in REAL generated worlds, dormancy, and the
 * calamity-kernel wiring are the integration file's job
 * (tests/domain/magicBufferIntegration.test.js).
 */
import { describe, it, expect } from 'vitest';
import {
  MAGIC_BUFFER_TUNING, bandOf, economyTerm, magicTerm, mitigationDemand01,
  convertStrike, reliefUnitsFor, payableUnits, billRelief, affordableRelief,
  recoverCharge01, fullRechargeYears, repairAcceleration01,
  bufferReceiptLine, bufferShortfallLine, EXPLOITATION_GATE_CONTRACT,
} from '../../src/domain/worldPulse/magicBufferModel.js';
import { magicExploitationGate, regimeForEconomy } from '../../src/domain/worldPulse/magicRegimeModel.js';
import { CALAMITY_TUNING } from '../../src/domain/spatial/calamity.js';
import { PHI_CONJUGATE } from '../../src/domain/lowDiscrepancy.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const T = MAGIC_BUFFER_TUNING;

/**
 * THE GATE, COMPOSED THE WAY THE WORLD COMPOSES IT: the economy picks a regime, and
 * K2's one formula turns the pair into a gate. Nothing in this file invents a gate
 * value, so if K2 re-tunes its ladder these pins re-measure against the new one rather
 * than silently going stale.
 */
const gateAt = (economy01) => magicExploitationGate({ regime: regimeForEconomy(economy01), economy01 });

/** The full §5 mitigation for a settlement at these axes, with a rested reserve. */
const mitigationAt = (economy01, magic01, charge01 = 1) => mitigationDemand01({
  economy01, magic01, gate01: gateAt(economy01), charge01,
});

// A poor place and a rich one, and a mundane place and an arcane one. The economy
// values sit well inside their regimes rather than on a threshold, so the pins measure
// the shape and not a boundary rounding.
const POOR = 0.10;
const RICH = 0.95;
const MUNDANE = 0.02;
const ARCANE = 0.95;

/** A strike big enough for the institution term to have somewhere to round to. */
const BIG_STRIKE = Object.freeze({ institutions: 4, deaths: 400, exodus: 600 });
/** Stocks deep enough that affordability never binds, so a pin measures the formula. */
const DEEP_STOCKS = Object.freeze({ storesMonths: 99, charge01: 1 });

describe('K3 the disaster buffer: the arithmetic §5 requires', () => {
  it('1. THE GATING ASYMMETRY: magic buys almost nothing while poor, and a great deal while rich', () => {
    const gapPoor = Math.abs(mitigationAt(POOR, ARCANE) - mitigationAt(POOR, MUNDANE));
    const gapRich = Math.abs(mitigationAt(RICH, ARCANE) - mitigationAt(RICH, MUNDANE));

    // THE ANCHOR, and this pin is worthless without it. `gapPoor` being near zero is
    // ALSO what a dead magic term looks like, so the near-zero reading only means
    // "the gate suppressed it" once the magic term is proven live on its own.
    // anchored: the magic term is demonstrably non-constant, so gapPoor measures gating rather than a broken term
    expect(magicTerm(ARCANE)).toBeGreaterThan(magicTerm(MUNDANE));
    expect(gateAt(POOR)).toBeLessThan(gateAt(RICH));

    // The amendment's central claim: a high-magic pauper mitigates approximately like a
    // mundane pauper. Approximately, not exactly, because the base regime's gate floor
    // is not zero: a subsistence settlement can still light a candle.
    expect(gapPoor).toBeLessThanOrEqual(0.02);
    // And the other half, which is what makes it an ASYMMETRY rather than a claim that
    // magic never matters: at the top of the ladder the same magic is worth an order of
    // magnitude more.
    expect(gapRich).toBeGreaterThanOrEqual(0.15);
    expect(gapRich).toBeGreaterThan(gapPoor * 8);
  });

  it('2. THE ORDERING ENVELOPE: mitigation rises with each axis, and damage falls with it', () => {
    const axis = [0, 0.2, 0.4, 0.6, 0.8, 1];
    /** @type {Array<{ kind: string, fixed: number, series: number[] }>} */
    const cases = [];
    for (const magic01 of axis) {
      cases.push({
        kind: 'economy', fixed: magic01,
        series: axis.map((economy01) => mitigationAt(economy01, magic01)),
      });
    }
    for (const economy01 of axis) {
      cases.push({
        kind: 'magic', fixed: economy01,
        series: axis.map((magic01) => mitigationAt(economy01, magic01)),
      });
    }
    const failures = collectSeedFailures(cases, (probe) => {
      for (let i = 1; i < probe.series.length; i += 1) {
        expect(
          probe.series[i],
          `mitigation fell as ${probe.kind} rose (other axis fixed at ${probe.fixed})`,
        ).toBeGreaterThanOrEqual(probe.series[i - 1]);
      }
    });
    expectNoSeedFailures(failures, 'mitigation is monotone in both axes of the magic by economy grid');

    // The envelope is about DAMAGE, not about the coefficient, so read it through the
    // conversion as well: what the world actually loses falls as the axes rise.
    const damageAt = (economy01, magic01) => {
      const relief = affordableRelief({
        axes: { economy01, magic01, gate01: gateAt(economy01), charge01: 1 },
        loss: BIG_STRIKE, stocks: DEEP_STOCKS,
      });
      return (BIG_STRIKE.deaths - relief.conversion.deathsAvoided)
        + (BIG_STRIKE.exodus - relief.conversion.exodusAvoided);
    };
    const damageFailures = collectSeedFailures(axis, (magic01) => {
      const series = axis.map((economy01) => damageAt(economy01, magic01));
      for (let i = 1; i < series.length; i += 1) {
        expect(series[i], `damage rose as the economy rose (magic ${magic01})`)
          .toBeLessThanOrEqual(series[i - 1]);
      }
    });
    expectNoSeedFailures(damageFailures, 'surviving damage is monotone non-increasing across the grid');

    // The envelope must not be FLAT, or monotonicity would hold vacuously.
    expect(damageAt(RICH, ARCANE)).toBeLessThan(damageAt(POOR, MUNDANE));
  });

  it('3. THE CEILING HOLDS: the cap binds, and no wealth nullifies a disaster', () => {
    // THE OVERHANG is what makes the ceiling a real cap rather than an unreachable
    // decoration: the two terms deliberately sum past it, so the summit is CLIPPED.
    expect(T.ECONOMY_TERM_MAX + T.MAGIC_TERM_MAX).toBeGreaterThan(T.MITIGATION_CEILING);
    expect(mitigationDemand01({ economy01: 1, magic01: 1, gate01: 1, charge01: 1 }))
      .toBe(T.MITIGATION_CEILING);
    expect(T.MITIGATION_CEILING).toBeLessThan(1);

    // At the extreme corner of the grid, with stocks deep enough to buy everything the
    // ceiling allows, the strike STILL fells institutions and STILL kills people.
    const corner = affordableRelief({
      axes: { economy01: 1, magic01: 1, gate01: 1, charge01: 1 },
      loss: BIG_STRIKE, stocks: DEEP_STOCKS,
    });
    expect(corner.rationed).toBe(false);
    expect(corner.conversion.institutionsSpared).toBeLessThan(BIG_STRIKE.institutions);
    expect(corner.conversion.deathsAvoided).toBeLessThan(BIG_STRIKE.deaths);
    expect(corner.conversion.exodusAvoided).toBeLessThan(BIG_STRIKE.exodus);

    // And the tail of small numbers: a one-institution strike is never bought off,
    // because the institution term floors.
    const single = affordableRelief({
      axes: { economy01: 1, magic01: 1, gate01: 1, charge01: 1 },
      loss: { institutions: 1, deaths: 40, exodus: 60 }, stocks: DEEP_STOCKS,
    });
    expect(single.conversion.institutionsSpared).toBe(0);
  });

  it('4. THE SECOND-SHOCK WINDOW: a drawn buffer mitigates less, and poverty holds the window open', () => {
    const axes = { economy01: RICH, magic01: ARCANE, gate01: gateAt(RICH) };
    const rested = affordableRelief({
      axes: { ...axes, charge01: 1 }, loss: BIG_STRIKE, stocks: { storesMonths: 99, charge01: 1 },
    });
    const drawn = affordableRelief({
      axes: { ...axes, charge01: 0.3 }, loss: BIG_STRIKE, stocks: { storesMonths: 99, charge01: 0.3 },
    });
    expect(drawn.mitigation01).toBeLessThan(rested.mitigation01);
    expect(drawn.reliefUnits).toBeLessThan(rested.reliefUnits);

    // THE WINDOW IS A POVERTY WINDOW, and that is the design's intent expressed as a
    // relation between two tuning tables rather than as a comment. The calamity
    // cooldown is how long a settlement is spared the dice; the recharge dwell is how
    // long its wards stay spent. Where the second exceeds the first, a second shock can
    // legitimately land on an empty reserve.
    const cooldown = CALAMITY_TUNING.COOLDOWN_YEARS;
    expect(fullRechargeYears(0)).toBeGreaterThan(cooldown);
    expect(fullRechargeYears(1)).toBeLessThan(cooldown);
    expect(recoverCharge01({ charge01: 0, economy01: 0, years: cooldown })).toBeLessThan(1);
    expect(recoverCharge01({ charge01: 0, economy01: 1, years: cooldown })).toBe(1);

    // The dwell is BANDED, not continuous, which is what §5 asks for.
    expect(recoverCharge01({ charge01: 0, economy01: 0.05, years: 1 }))
      .toBe(recoverCharge01({ charge01: 0, economy01: 0.15, years: 1 }));
    expect(recoverCharge01({ charge01: 0, economy01: 0.05, years: 1 }))
      .toBeLessThan(recoverCharge01({ charge01: 0, economy01: 0.95, years: 1 }));
  });

  it('5. CONSERVATION: every point of relief is billed exactly to the named stocks', () => {
    // A low-discrepancy sweep over the whole input space, using the house Weyl
    // constant, so the family covers the corners and the interior without a random
    // seed and without an arithmetic stride that could alias against the band edges.
    /** @type {Array<{ axes: Record<string, number>, loss: Record<string, number>, stocks: Record<string, number> }>} */
    const family = [];
    let a = 0.11; let b = 0.37; let c = 0.73; let d = 0.19; let e = 0.61;
    for (let i = 0; i < 96; i += 1) {
      a = (a + PHI_CONJUGATE) % 1;
      b = (b + PHI_CONJUGATE * 2) % 1;
      c = (c + PHI_CONJUGATE * 3) % 1;
      d = (d + PHI_CONJUGATE * 5) % 1;
      e = (e + PHI_CONJUGATE * 7) % 1;
      family.push({
        axes: { economy01: a, magic01: b, gate01: gateAt(a), charge01: c },
        loss: {
          institutions: Math.round(d * 6),
          deaths: Math.round(e * 900),
          exodus: Math.round(((d + e) % 1) * 1200),
        },
        stocks: { storesMonths: ((c + d) % 1) * 8, charge01: c },
      });
    }
    const failures = collectSeedFailures(family, (probe) => {
      const relief = affordableRelief(probe);
      const billed = Number(
        (relief.payment.storesUnits + relief.payment.wardUnits).toFixed(3),
      );
      // THE SUM IS HONEST: what the buffer saved, it spent.
      expect(billed, 'the two billed shares do not sum to the settled relief').toBe(relief.reliefUnits);
      // And it never spends what the settlement does not have.
      expect(relief.reliefUnits).toBeLessThanOrEqual(relief.capacityUnits);
      expect(relief.payment.chargeDrawn01).toBeLessThanOrEqual(probe.stocks.charge01 + 1e-9);
      expect(relief.payment.storesMonthsDrawn).toBeLessThanOrEqual(probe.stocks.storesMonths + 1e-9);
      // Relief and payment rise and fall together: a zero bill means zero relief.
      expect(relief.reliefUnits > 0).toBe(
        relief.payment.storesMonthsDrawn > 0 || relief.payment.chargeDrawn01 > 0,
      );
    });
    expectNoSeedFailures(failures, 'every settled relief is billed exactly to the named stocks');

    // The family must actually contain relief, or the identity above holds over 96
    // zeroes and proves nothing.
    const withRelief = family.filter((probe) => affordableRelief(probe).reliefUnits > 0);
    expect(withRelief.length).toBeGreaterThan(family.length / 4);

    // THE GRANARY IS BILLED FIRST (the receipt's own order).
    const shallow = affordableRelief({
      axes: { economy01: RICH, magic01: ARCANE, gate01: gateAt(RICH), charge01: 1 },
      loss: BIG_STRIKE, stocks: { storesMonths: 0.25, charge01: 1 },
    });
    expect(shallow.payment.storesMonthsDrawn).toBeGreaterThan(0);
    expect(shallow.payment.wardUnits).toBeGreaterThan(0);
    expect(billRelief({ reliefUnits: 1, stocks: { storesMonths: 99, charge01: 1 } }).wardUnits).toBe(0);
  });

  it('6. AFFORDABILITY: nothing is mitigated that cannot be paid for', () => {
    const richAxes = { economy01: RICH, magic01: ARCANE, gate01: gateAt(RICH), charge01: 1 };

    // A SPENT RESERVE suppresses the demand itself, and nothing is rationed because
    // nothing was ever on offer. The distinction matters: this is the second-shock
    // window biting, not affordability, and a receipt that blamed the granary here
    // would be telling the DM the wrong story about why the wards failed.
    const spent = affordableRelief({
      axes: { ...richAxes, charge01: 0 }, loss: BIG_STRIKE,
      stocks: { storesMonths: 0, charge01: 0 },
    });
    expect(spent.demand01).toBe(0);
    expect(spent.mitigation01).toBe(0);
    expect(spent.reliefUnits).toBe(0);
    expect(spent.rationed).toBe(false);
    expect(bufferReceiptLine(spent)).toBeNull();
    expect(bufferShortfallLine(spent)).toBeNull();

    // RATIONING NEEDS A CATASTROPHE, and measuring that was worth the trouble. The
    // reserve funds roughly twelve relief units at full charge, and a four-institution,
    // thousand-person strike costs about five, so a town-scale disaster is NEVER
    // rationed however empty its granary. Only a metropolis-scale loss outruns the
    // stocks, which is the honest shape: the buffer holds for ordinary disasters and
    // visibly fails for extraordinary ones.
    const CATASTROPHE = { institutions: 4, deaths: 9000, exodus: 12000 };

    // A full reserve with no granary behind it buys a great deal and still runs out,
    // and the demand it could not meet is reported rather than quietly dropped.
    const thin = affordableRelief({
      axes: richAxes, loss: CATASTROPHE, stocks: { storesMonths: 0, charge01: 1 },
    });
    expect(thin.rationed).toBe(true);
    expect(thin.mitigation01).toBeLessThan(thin.demand01);
    expect(thin.reliefUnits).toBeGreaterThan(0);
    expect(bufferShortfallLine(thin)).toContain('stopped where the coin stopped');
    expect(bufferReceiptLine(thin)).toContain('reserve paid for it alone');

    // Empty granary AND a reserve already spent down to a trace by an earlier disaster,
    // struck again at metropolis scale: the settlement can buy no relief whatsoever.
    // This is law 5 at its hardest edge and it is the state the second-shock window is
    // FOR, so the line the DM reads names both empty stocks rather than blaming one.
    const broke = affordableRelief({
      axes: { ...richAxes, charge01: 0.0005 }, loss: CATASTROPHE,
      stocks: { storesMonths: 0, charge01: 0.0005 },
    });
    // The COEFFICIENT is not asserted to be exactly zero, and the difference is the
    // point: the descent stops at the largest rung whose bill is affordable, which here
    // is a mitigation so small that it converts nothing at all. A settlement can hold a
    // non-zero mitigation and still save nobody, and that is the honest reading rather
    // than a rounding artefact to be tidied away.
    expect(broke.reliefUnits).toBe(0);
    expect(broke.conversion).toEqual({ institutionsSpared: 0, deathsAvoided: 0, exodusAvoided: 0 });
    expect(broke.rationed).toBe(true);
    expect(broke.mitigation01).toBeLessThan(broke.demand01);
    expect(bufferReceiptLine(broke)).toBeNull();
    expect(bufferShortfallLine(broke)).toContain('no stores to spend');

    // Deep stocks are not rationed at all, which anchors the flag: `rationed` reports a
    // real condition rather than being always true.
    const flush = affordableRelief({ axes: richAxes, loss: BIG_STRIKE, stocks: DEEP_STOCKS });
    expect(flush.rationed).toBe(false);
    expect(flush.mitigation01).toBe(flush.demand01);
    expect(bufferReceiptLine(flush)).toContain('granaries paid');
  });

  it('7. THE SHAPES: the terms are banded, and repair is literally the mitigation shape', () => {
    // BANDED, not continuous: the rung values are exactly the closed set, and a move
    // inside one rung moves nothing.
    const rungs = new Set([0, 0.1, 0.24, 0.3, 0.49, 0.6, 0.79, 0.9, 1].map(bandOf));
    expect([...rungs].sort((x, y) => x - y)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    expect(economyTerm(0.81)).toBe(economyTerm(0.99));
    expect(economyTerm(0.81)).toBeGreaterThan(economyTerm(0.5));
    expect(magicTerm(1)).toBe(T.MAGIC_TERM_MAX);
    expect(economyTerm(1)).toBe(T.ECONOMY_TERM_MAX);

    // REPAIR FOLLOWS THE SAME SHAPE (§5), as an identity rather than a resemblance.
    const failures = collectSeedFailures([0, 0.3, 0.55, 0.8, 1], (magic01) => {
      const axes = { economy01: RICH, magic01, gate01: gateAt(RICH), charge01: 0.6 };
      expect(repairAcceleration01(axes))
        .toBe(Number((mitigationDemand01(axes) * T.REPAIR_SHAPE_MULTIPLE).toFixed(3)));
    });
    expectNoSeedFailures(failures, 'repair acceleration is the mitigation shape times the tuned multiple');

    // The conversion and the pricing are total over degenerate input rather than
    // throwing: a disaster resolver must never be the thing that fails.
    expect(convertStrike({ mitigation01: 0.5, loss: { institutions: 0, deaths: 0, exodus: 0 } }))
      .toEqual({ institutionsSpared: 0, deathsAvoided: 0, exodusAvoided: 0 });
    expect(reliefUnitsFor({ institutionsSpared: 2, deathsAvoided: 50, exodusAvoided: 50 })).toBe(3);
    expect(payableUnits({ storesMonths: 0, charge01: 0 })).toBe(0);
  });

  it('states the gate contract it consumes, and derives no gate of its own', () => {
    expect(EXPLOITATION_GATE_CONTRACT.owner).toBe('K2');
    expect(EXPLOITATION_GATE_CONTRACT.absent).toBe(0);
    expect(EXPLOITATION_GATE_CONTRACT.min).toBe(0);
    expect(EXPLOITATION_GATE_CONTRACT.max).toBe(1);
    // A gate of zero leaves the economy term standing alone, which is the design's own
    // reading of a settlement with no exploitable regime.
    expect(mitigationDemand01({ economy01: RICH, magic01: ARCANE, gate01: 0, charge01: 1 }))
      .toBe(economyTerm(RICH));
  });
});
