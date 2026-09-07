/**
 * magicRegimeModel.test.js — W-K slice K2, the ladder and THE ONE GATE
 * (docs/DESIGN_MAGIC_ECONOMY.md §3a, §4, §11, §12).
 *
 * The claims §12 asks the regime half to prove, each pinned here with the
 * anti-vacuity anchor that makes it non-trivial:
 *
 *   THE LADDER IS NOT A SECOND ECONOMY   the two lower thresholds are pinned EQUAL to
 *       institutionLifecycle's own declining/prosperous numbers, so a tuning pass that
 *       moves one and not the other reds here instead of silently splitting the
 *       estate's reading of a poor town in two.
 *   HYSTERESIS, BOTH HALVES              the dead band kills jitter and the dwell kills
 *       a rapid genuine swing. Pinned separately, because a fixture that only
 *       oscillates inside the band would pass against a build with no dwell at all.
 *   THE ONE GATE IS MONOTONE             and CONTINUOUS across a fresh crossing, so the
 *       exploitation-ordering envelope has a formula-level statement under it.
 *   DROP-WHEN-EMPTY                      a world at the base regime stores nothing, which
 *       is the byte-identity half of dormancy.
 *   DORMANCY                             flag absent means the world comes back BY
 *       REFERENCE and no ledger key is ever written.
 */
import { describe, it, expect } from 'vitest';
import {
  BASE_MAGIC_REGIME,
  MAGIC_REGIMES,
  MAGIC_REGIME_LEDGER,
  MAGIC_REGIME_TUNING,
  auditMagicRegimeLedger,
  isMagicRegimeRecordEmpty,
  magicExploitationGate,
  readMagicRegimeLedger,
  readMagicRegimeRecord,
  regimeEconomyReading,
  regimeEconomySpan,
  regimeForEconomy,
  regimeRank,
  resolveMagicRegime,
  writeMagicRegimeLedger,
} from '../../src/domain/worldPulse/magicRegimeModel.js';
import { INSTITUTION_LIFECYCLE_TUNING, economyHealthScore } from '../../src/domain/worldPulse/institutionLifecycle.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

describe('the closed regime ladder (§3a, law 7)', () => {
  it('is exactly the four words the design names, in ladder order', () => {
    expect([...MAGIC_REGIMES]).toEqual(['subsistence', 'funded', 'patronized', 'industrial']);
    expect(BASE_MAGIC_REGIME).toBe('subsistence');
  });

  it('ranks by ladder position and folds an unknown word to the FLOOR, not to -1', () => {
    expect(MAGIC_REGIMES.map(regimeRank)).toEqual([0, 1, 2, 3]);
    // A negative rank would poison every comparison in the wave; the floor is the
    // safe degradation and it is deliberate.
    expect(regimeRank('industrialised')).toBe(0);
    expect(regimeRank('')).toBe(0);
  });

  it('every threshold pair has promotion STRICTLY above demotion (law 4)', () => {
    for (const regime of MAGIC_REGIMES.slice(1)) {
      const pair = MAGIC_REGIME_TUNING.thresholds[regime];
      expect(pair.enter, `${regime} enter must exceed leave`).toBeGreaterThan(pair.leave);
    }
  });

  it('the bands tile 0..1 exactly and in ladder order, which is what makes the gate monotone', () => {
    let previousCeiling = 0;
    for (const regime of MAGIC_REGIMES) {
      const band = MAGIC_REGIME_TUNING.bands[regime];
      expect(band.floor, `${regime} band must start where the one below ended`).toBe(previousCeiling);
      expect(band.ceiling).toBeGreaterThan(band.floor);
      previousCeiling = band.ceiling;
    }
    expect(previousCeiling).toBe(1);
  });
});

describe('the ladder is not a second economy reading', () => {
  // THE ANCHOR THAT MAKES THIS NON-VACUOUS: it reads the lifecycle's live constants
  // rather than restating the numbers, so it can only pass while both lanes agree.
  it('funded.enter IS institutionLifecycle.thresholds.declining, to the digit', () => {
    expect(MAGIC_REGIME_TUNING.thresholds.funded.enter)
      .toBe(INSTITUTION_LIFECYCLE_TUNING.thresholds.declining);
  });

  it('patronized.enter IS institutionLifecycle.thresholds.prosperous, to the digit', () => {
    expect(MAGIC_REGIME_TUNING.thresholds.patronized.enter)
      .toBe(INSTITUTION_LIFECYCLE_TUNING.thresholds.prosperous);
  });

  it('the economy reading delegates to economyHealthScore rather than deriving a sibling', () => {
    const scores = { trade_connectivity: 80, labor_capacity: 60, infrastructure_condition: 40, food_security: 20 };
    expect(regimeEconomyReading({ id: 's1', causal: { scores } }))
      .toBe(economyHealthScore(scores));
  });

  it('an unread economy is NEUTRAL, not destitute: it lands in funded, not subsistence', () => {
    // economyHealthScore defaults each missing score to 50, so a snapshot row with no
    // causal block reads 0.5. Pinned because grading an unmeasured town as poor would
    // shell its institutions for a reason that was never observed.
    expect(regimeEconomyReading({ id: 's1' })).toBe(0.5);
    expect(regimeForEconomy(regimeEconomyReading({ id: 's1' }))).toBe('funded');
  });
});

describe('hysteresis, both halves (law 4)', () => {
  const at = (regime, sinceTick) => ({ regime, sinceTick });

  it('the DEAD BAND: an economy oscillating inside it produces ZERO crossings', () => {
    const { funded } = MAGIC_REGIME_TUNING.thresholds;
    const inside = (funded.enter + funded.leave) / 2;
    let prior = at('funded', 0);
    const crossings = [];
    for (let tick = 1; tick <= 40; tick++) {
      // Oscillate strictly inside the dead band, well past any dwell.
      const economy01 = tick % 2 === 0 ? inside + 0.02 : inside - 0.02;
      const next = resolveMagicRegime({ prior, economy01, tick });
      if (next.changed) crossings.push({ tick, ...next });
      prior = { regime: next.regime, sinceTick: next.sinceTick };
    }
    expect(crossings).toEqual([]);
    // ANCHOR: the same fixture MUST cross once the swing leaves the band, or the
    // green above would be proving that resolveMagicRegime never crosses at all.
    const escaped = resolveMagicRegime({ prior, economy01: funded.leave - 0.01, tick: 99 });
    expect(escaped.changed).toBe(true);
    expect(escaped.direction).toBe('demoted');
  });

  it('the DWELL: a swing that DOES leave the band still cannot flap tick by tick', () => {
    const { funded } = MAGIC_REGIME_TUNING.thresholds;
    let prior = at('funded', 0);
    let crossings = 0;
    for (let tick = 1; tick <= 40; tick++) {
      // A genuine swing across the whole dead band on every single tick.
      const economy01 = tick % 2 === 0 ? funded.enter + 0.05 : funded.leave - 0.05;
      const next = resolveMagicRegime({ prior, economy01, tick });
      if (next.changed) crossings += 1;
      prior = { regime: next.regime, sinceTick: next.sinceTick };
    }
    // ⚠ THE BOUND IS AN INDEPENDENT LITERAL, NOT `40 / minDwellTicks`.
    // It was written that way first, and the negative control caught it: an
    // expectation computed from the very constant it guards is VACUOUS, because
    // setting minDwellTicks to 0 makes the bound Infinity and the assertion passes
    // against the exact regression it exists to catch (the self-referential pin
    // class). 20 states the LAW instead: fewer than one crossing per tick over a
    // fixture that swings on every tick. Without any dwell this fixture crosses on
    // roughly every other tick and blows straight past it.
    expect(crossings).toBeGreaterThan(0);
    expect(crossings).toBeLessThanOrEqual(20);
    // ...and the constant that delivers the law is guarded separately, so a tuning
    // pass that quietly zeroes the dwell reds here rather than going unnoticed.
    expect(MAGIC_REGIME_TUNING.minDwellTicks).toBeGreaterThanOrEqual(2);
  });

  it('reports blockedByDwell only when a crossing was actually wanted', () => {
    const { funded } = MAGIC_REGIME_TUNING.thresholds;
    const wanted = resolveMagicRegime({ prior: at('funded', 10), economy01: funded.leave - 0.1, tick: 11 });
    expect(wanted).toMatchObject({ changed: false, blockedByDwell: true, regime: 'funded' });
    const still = resolveMagicRegime({ prior: at('funded', 10), economy01: funded.enter + 0.01, tick: 11 });
    expect(still).toMatchObject({ changed: false, blockedByDwell: false });
  });

  it('promotes ONE RUNG at a time, never leaping the ladder', () => {
    const leap = resolveMagicRegime({ prior: at('subsistence', 0), economy01: 1, tick: 50 });
    expect(leap.regime).toBe('funded');
    expect(leap.direction).toBe('promoted');
  });

  it('a settlement with NO history is never dwell-blocked on its first crossing', () => {
    const first = resolveMagicRegime({ prior: null, economy01: 0.5, tick: 0 });
    expect(first).toMatchObject({ changed: true, regime: 'funded', blockedByDwell: false });
  });
});

describe('THE ONE GATE FORMULA (law 3, §4)', () => {
  it('is MONOTONE NON-DECREASING in the economy for a settlement entering fresh', () => {
    const readings = [];
    for (let step = 0; step <= 200; step++) {
      const economy01 = step / 200;
      readings.push(magicExploitationGate({ regime: regimeForEconomy(economy01), economy01 }));
    }
    const drops = readings.filter((value, i) => i > 0 && value < readings[i - 1] - 1e-12);
    expect(drops, 'the fresh-entry gate must never fall as the economy rises').toEqual([]);
  });

  it('is CONTINUOUS across every fresh crossing: each band is entered exactly where the one below leaves off', () => {
    for (const regime of MAGIC_REGIMES.slice(1)) {
      const enter = MAGIC_REGIME_TUNING.thresholds[regime].enter;
      const justBelow = magicExploitationGate({
        regime: regimeForEconomy(enter - 1e-6), economy01: enter - 1e-6,
      });
      const atEntry = magicExploitationGate({ regime, economy01: enter });
      expect(Math.abs(atEntry - justBelow), `${regime} entry must be continuous`).toBeLessThan(1e-4);
    }
  });

  it('grades CONTINUOUSLY inside a regime rather than stepping (law 4 banded gradation)', () => {
    const span = regimeEconomySpan('patronized');
    const low = magicExploitationGate({ regime: 'patronized', economy01: span.from });
    const mid = magicExploitationGate({ regime: 'patronized', economy01: (span.from + span.to) / 2 });
    const high = magicExploitationGate({ regime: 'patronized', economy01: span.to });
    expect(low).toBeLessThan(mid);
    expect(mid).toBeLessThan(high);
    expect(low).toBe(MAGIC_REGIME_TUNING.bands.patronized.floor);
    expect(high).toBe(MAGIC_REGIME_TUNING.bands.patronized.ceiling);
  });

  it('a held regime the economy could no longer newly enter reads at the BOTTOM of its band, not out of it', () => {
    // The honest rendering of a place living on a richer decade's reputation.
    const stuck = magicExploitationGate({ regime: 'industrial', economy01: 0.78 });
    expect(stuck).toBe(MAGIC_REGIME_TUNING.bands.industrial.floor);
    expect(stuck).toBeGreaterThan(magicExploitationGate({ regime: 'patronized', economy01: 0.78 }));
  });

  it('never reads a tier, a party state or a clock: the same inputs answer the same number', () => {
    const first = magicExploitationGate({ regime: 'funded', economy01: 0.5 });
    const second = magicExploitationGate({ regime: 'funded', economy01: 0.5 });
    expect(first).toBe(second);
    expect(magicExploitationGate({})).toBe(0);
  });

  it('folds an unknown regime word to the base band rather than answering NaN', () => {
    expect(magicExploitationGate({ regime: 'gilded', economy01: 1 }))
      .toBe(magicExploitationGate({ regime: BASE_MAGIC_REGIME, economy01: 1 }));
  });
});

describe('the ledger: drop-when-empty and the no-record base regime', () => {
  const world = () => ({ simulationRules: { magicEconomyEnabled: true } });

  it('a settlement at the BASE regime with an expired dwell stores NOTHING', () => {
    const dwell = MAGIC_REGIME_TUNING.minDwellTicks;
    expect(isMagicRegimeRecordEmpty({ regime: 'subsistence', sinceTick: 5 }, 5 + dwell)).toBe(true);
    // ...but it is kept while the dwell is still owed, or it could re-promote at once.
    expect(isMagicRegimeRecordEmpty({ regime: 'subsistence', sinceTick: 5 }, 5 + dwell - 1)).toBe(false);
    // A non-base regime is kept however long it has held: it is not an absence.
    expect(isMagicRegimeRecordEmpty({ regime: 'industrial', sinceTick: 0 }, 9999)).toBe(false);
  });

  it('a base-regime record at tick 0 is NEVER kept: it means never-crossed, not just-fell', () => {
    // A demotion needs a prior record and no settlement has one at tick 0, so a base
    // record with sinceTick 0 cannot be the result of a fall. Treating it as one is
    // what made an all-subsistence world grow a permanent ledger entry per settlement
    // and lose the non-obvious zero (caught by the dormancy pin in the lifecycle suite).
    expect(isMagicRegimeRecordEmpty({ regime: 'subsistence', sinceTick: 0 }, 0)).toBe(true);
    expect(isMagicRegimeRecordEmpty({ regime: 'subsistence', sinceTick: 0 }, 1)).toBe(true);
    // ANCHOR: a base record from a REAL fall at the same tick distance IS kept, so the
    // trues above measure the never-crossed case and not a predicate stuck on true.
    expect(isMagicRegimeRecordEmpty({ regime: 'subsistence', sinceTick: 1 }, 1)).toBe(false);
  });

  it('a settlement that never crossed is stamped sinceTick 0, not the current tick', () => {
    // The bug this pins: stamping `now` made a never-crossed settlement look freshly
    // arrived on every advance, so its record sat permanently inside the dwell window
    // and could never be dropped.
    expect(resolveMagicRegime({ prior: null, economy01: 0.1, tick: 500 }))
      .toMatchObject({ regime: 'subsistence', sinceTick: 0, changed: false });
  });

  it('an all-base world drops the whole key, so it is byte-identical to a world that never had one', () => {
    const before = world();
    const after = writeMagicRegimeLedger(before, { s1: { regime: 'subsistence', sinceTick: 0 } }, 99);
    expect(readMagicRegimeLedger(after)).toBeNull();
    expect(JSON.stringify(after)).toBe(JSON.stringify(world()));
  });

  it('writes and reads back a real record, sorted, with only the durable half', () => {
    const written = writeMagicRegimeLedger(
      world(),
      { s2: { regime: 'industrial', sinceTick: 7, stale: 'x' }, s1: { regime: 'funded', sinceTick: 3 } },
      9,
    );
    const ledger = readMagicRegimeLedger(written);
    expect(Object.keys(ledger)).toEqual(['s1', 's2']);
    expect(ledger.s2).toEqual({ regime: 'industrial', sinceTick: 7 });
    // ANCHOR: `s2` proves the ledger is live and correctly keyed; `stale` is the one
    // thing correctly kept out, so this negative cannot go vacuous.
    expectAbsentWithAnchor(Object.keys(ledger.s2), 'stale', 'regime');
    expect(readMagicRegimeRecord(written, 's1')).toEqual({ regime: 'funded', sinceTick: 3 });
    expect(readMagicRegimeRecord(written, 'nobody')).toBeNull();
  });

  it('a rebuilt ledger serializes byte-identically to a persisted one (JSON round trip)', () => {
    const written = writeMagicRegimeLedger(world(), { b: { regime: 'funded', sinceTick: 2 }, a: { regime: 'patronized', sinceTick: 1 } }, 9);
    const revived = JSON.parse(JSON.stringify(written));
    const rewritten = writeMagicRegimeLedger(revived, readMagicRegimeLedger(revived), 9);
    expect(JSON.stringify(rewritten)).toBe(JSON.stringify(written));
  });

  it('reads defensively off a world that never had the layer', () => {
    expect(readMagicRegimeLedger(null)).toBeNull();
    expect(readMagicRegimeLedger({})).toBeNull();
    expect(readMagicRegimeRecord({}, 's1')).toBeNull();
  });

  it('the ledger key constant is the literal the spatialLedgers coverage walker resolves', () => {
    expect(MAGIC_REGIME_LEDGER).toBe('magicRegime');
  });
});

describe('the vocabulary audit (a ledger that arrived from disk)', () => {
  it('reports a regime word outside the closed ladder rather than silently grading it as the base', () => {
    const dirty = auditMagicRegimeLedger({ s1: { regime: 'gilded', sinceTick: 0 } });
    expect(dirty.ok).toBe(false);
    expect(dirty.invalid[0]).toMatchObject({ cid: 's1', reason: 'regime is outside the closed ladder' });
    // ANCHOR: a clean ledger of the SAME SHAPE audits clean, so the red above is
    // about the word and not about the audit rejecting everything.
    expect(auditMagicRegimeLedger({ s1: { regime: 'funded', sinceTick: 0 } }).ok).toBe(true);
  });

  it('an empty or absent ledger audits clean', () => {
    expect(auditMagicRegimeLedger(null).ok).toBe(true);
    expect(auditMagicRegimeLedger({}).ok).toBe(true);
  });
});
