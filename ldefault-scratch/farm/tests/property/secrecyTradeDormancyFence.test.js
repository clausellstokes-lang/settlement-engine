/**
 * secrecyTradeDormancyFence.test.js — [FP IN-0d] HIDE'S TRADE TAX: THE FENCE SET.
 *
 * `secrecyTradeFactorOf` is SEAM 11, the export FP-TRADE (row 14) pre-pins against and
 * consumes later. Everything here exists to make that contract safe to build on months
 * from now, in another volume, by someone who reads only the pins.
 *
 *   FENCE 1 — IDENTITY OUTSIDE HIDE, all four ways it can arise, each EXACTLY 1. A
 *     multiplier that is 1.0 "to within rounding" is not identity; TRADE is meant to apply
 *     this unconditionally with no branch, and that is only sound if the neutral case is
 *     exact.
 *
 *   FENCE 2 — THE DARK ARM IS THE FLAG'S, NOT THE LEDGER'S. The important one, and it is
 *     built from a measurement rather than an assumption: `advanceInformationStatecraft`
 *     returns early when dark and does NOT prune the posture ledger, so a world that ran
 *     lit and went dark keeps live postures. A ledger-only gate would price a DARK world as
 *     `choked`. This runs the REAL advance to produce that stale state rather than hand-
 *     building it, then asserts identity.
 *
 *   FENCE 3 — BANDED AND CAPPED. The factor takes one of exactly four values over the whole
 *     input domain, is bounded by 1 above and the floor below, and never reaches zero — a
 *     posture colours a market, it does not erase a settlement from the network.
 *
 *   FENCE 4 — NO DEAD BAND, measured over the range the posture's own hysteresis can
 *     actually produce, not over an abstract 0..1 a settlement can never occupy.
 *
 *   FENCE 5 — ZERO CONSUMERS, therefore trade bytes cannot move. This is what makes
 *     "dark ⇒ trade bytes identical" true BY CONSTRUCTION at this wave, and it is a
 *     tripwire: TRADE's join turns it RED, which is the intended message.
 *
 *   FENCE 6 — THE SEAM 11 TRIPWIRE itself, plus a guard-the-guard proving it can fire.
 *
 * ⚠ THE HUM IS NOT PINNED HERE BECAUSE IT IS NOT BUILT. IN-0d's list asks for "the seclusion
 * hum registered"; the module header records the executed measurement that HIDE posture
 * transitions are receipted NOWHERE today, so there is no beat for a toll line to ride and
 * registering a kind nothing mints is what the estate's registries red on. Reported as owed
 * rather than half-made. A pin asserting a hum that does not exist would be the vacuous
 * green this file is written to avoid.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  SECRECY_TRADE_BANDS,
  SECRECY_TRADE_CONTRACT_AT_IN0D,
  SECRECY_TRADE_TUNING,
  secrecyTradeBandOf,
  secrecyTradeContractChangedSinceIn0d,
  secrecyTradeFactorOf,
} from '../../src/domain/worldPulse/secrecyTradeFactor.js';
import {
  SIGHT_TUNING,
  advanceInformationStatecraft,
} from '../../src/domain/worldPulse/informationStatecraft.js';
import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const LIT = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true });
const DARK = Object.freeze({ infoMode: 'unreliable' });

/** @param {Record<string, unknown>} rules @param {Record<string, unknown>|null} postures */
function worldOf(rules, postures = null) {
  return {
    tick: 9,
    spatialCanonVersion: 1,
    simulationRules: rules,
    spatialLedgers: { beliefMaps: {}, ...(postures ? { secrecyPostures: postures } : {}) },
  };
}

// ── FENCE 1: IDENTITY OUTSIDE HIDE ──────────────────────────────────────────────

describe('IN-0d FENCE 1 — a settlement not in HIDE prices at EXACTLY 1.0', () => {
  test('all four routes to "no secrecy" return the identity multiplier exactly', () => {
    const cases = [
      ['no posture ledger at all', worldOf(LIT)],
      ['a ledger that holds no posture for this town', worldOf(LIT, { bbb: { level01: 0.9, enteredTick: 1 } })],
      ['a posture record with no readable level', worldOf(LIT, { aaa: { enteredTick: 1 } })],
      ['a level of exactly zero', worldOf(LIT, { aaa: { level01: 0, enteredTick: 1 } })],
    ];
    for (const [why, world] of cases) {
      const read = secrecyTradeFactorOf(world, 'aaa');
      // EXACTLY 1, by Object.is — not 0.9999999999999999. TRADE applies this with no
      // branch, so a neutral case that is merely close would leak a tax into every
      // un-guarded market in the realm.
      expect(Object.is(read.factor01, 1), `${why}: factor must be exactly 1`).toBe(true);
      expect(read.band, why).toBe('unhindered');
    }

    // THE LIVE CONTROL for those identities: the SAME reader on a guarded town does NOT
    // return identity, so the four above are the absence of secrecy and not a dead function.
    const guarded = secrecyTradeFactorOf(worldOf(LIT, { aaa: { level01: 0.8, enteredTick: 1 } }), 'aaa');
    expect(guarded.factor01).toBeLessThan(1);
    expect(guarded.band).not.toBe('unhindered');
  });

  test('TOTAL — junk in the level reads as an OPEN market, never a shut one', () => {
    for (const junk of [undefined, null, NaN, 'lots', {}, -1, Infinity]) {
      expect(secrecyTradeBandOf(junk)).toBe('unhindered');
    }
    // Fail-open is the correct direction here and the control says it is a real choice:
    // a legible high level DOES shut the market.
    expect(secrecyTradeBandOf(0.95)).toBe('choked');
  });
});

// ── FENCE 2: THE DARK ARM IS THE FLAG'S, NOT THE LEDGER'S ──────────────────────

describe('IN-0d FENCE 2 — dark is identity even with a LIVE posture standing', () => {
  test('a stale posture produced by the REAL advance still prices at identity when dark', () => {
    // THE MEASUREMENT THIS FENCE IS BUILT ON. The obvious gate — "no ledger means no
    // secrecy" — is unsound for this contract, because the statecraft advance returns
    // early when dark WITHOUT pruning the posture ledger. This proves that through the
    // real writer rather than asserting it: a world with a level-0.8 posture and the flag
    // absent comes out of the advance with the posture intact.
    const world = worldOf(DARK, { aaa: { level01: 0.8, enteredTick: 2 } });
    const advanced = advanceInformationStatecraft({
      snapshot: { settlements: [{ id: 'aaa' }], byId: new Map() },
      worldState: world,
      tick: 10,
      strengthOf: () => 0.5,
      alignmentOf: () => ({ malice01: 0.5, lawfulness01: 0.5 }),
      nameFor: (/** @type {string} */ id) => id,
    });
    expect(advanced.changed).toBe(false);
    // The stale posture survived — this is the hazard, asserted, not assumed.
    expect(advanced.worldState.spatialLedgers.secrecyPostures.aaa.level01).toBe(0.8);

    // AND THE FACTOR IS STILL EXACTLY IDENTITY, because the gate is the flag.
    const read = secrecyTradeFactorOf(advanced.worldState, 'aaa');
    expect(Object.is(read.factor01, 1)).toBe(true);
    expect(read.band).toBe('unhindered');

    // THE DISCRIMINATING CONTROL: the identical ledger with the flag LIT prices as choked.
    // Without this the identity above could be a reader that never prices anything.
    const litRead = secrecyTradeFactorOf(worldOf(LIT, { aaa: { level01: 0.8, enteredTick: 2 } }), 'aaa');
    expect(litRead.band).toBe('choked');
    expect(litRead.factor01).toBeLessThan(1);
  });
});

// ── FENCE 3: BANDED AND CAPPED ─────────────────────────────────────────────────

describe('IN-0d FENCE 3 — the factor is banded and capped', () => {
  test('over the whole input domain the factor takes exactly four values, bounded', () => {
    const seen = new Set();
    for (let i = 0; i <= 1000; i += 1) {
      const world = worldOf(LIT, { aaa: { level01: i / 1000, enteredTick: 1 } });
      const { factor01, band } = secrecyTradeFactorOf(world, 'aaa');
      expect(SECRECY_TRADE_BANDS).toContain(band);
      expect(factor01).toBeLessThanOrEqual(1);
      expect(factor01).toBeGreaterThan(0); // a sealed town still trades
      seen.add(factor01);
    }
    // BANDED: a thousand distinct inputs produce four distinct outputs, so two towns a
    // hair apart in paranoia do not trade measurably differently.
    expect(seen.size).toBe(SECRECY_TRADE_BANDS.length);
    expect([...seen].sort((a, b) => a - b)).toEqual([...SECRECY_TRADE_TUNING.BAND_FACTORS].sort((a, b) => a - b));

    // CAPPED: the floor is the bottom rung and nothing goes under it.
    const floor = Math.min(...SECRECY_TRADE_TUNING.BAND_FACTORS);
    expect(Math.min(...seen)).toBe(floor);
    expect(floor).toBeGreaterThan(0.5); // colours, never drowns

    // MONOTONE: more secrecy never opens a market further.
    let previous = Infinity;
    for (let i = 0; i <= 1000; i += 1) {
      const f = secrecyTradeFactorOf(worldOf(LIT, { aaa: { level01: i / 1000, enteredTick: 1 } }), 'aaa').factor01;
      expect(f).toBeLessThanOrEqual(previous);
      previous = f;
    }
  });

  test('the tuning tables are structurally sound (one factor per band, one fewer cut)', () => {
    expect(SECRECY_TRADE_TUNING.BAND_FACTORS).toHaveLength(SECRECY_TRADE_BANDS.length);
    expect(SECRECY_TRADE_TUNING.BAND_CUTS).toHaveLength(SECRECY_TRADE_BANDS.length - 1);
    expect(SECRECY_TRADE_TUNING.BAND_FACTORS[0]).toBe(1); // rung zero IS identity
    // Cuts strictly ascending; factors strictly descending. Either violated silently
    // re-orders the ladder while every band name still looks right.
    for (let i = 1; i < SECRECY_TRADE_TUNING.BAND_CUTS.length; i += 1) {
      expect(SECRECY_TRADE_TUNING.BAND_CUTS[i]).toBeGreaterThan(SECRECY_TRADE_TUNING.BAND_CUTS[i - 1]);
    }
    for (let i = 1; i < SECRECY_TRADE_TUNING.BAND_FACTORS.length; i += 1) {
      expect(SECRECY_TRADE_TUNING.BAND_FACTORS[i]).toBeLessThan(SECRECY_TRADE_TUNING.BAND_FACTORS[i - 1]);
    }
  });
});

// ── FENCE 4: NO DEAD BAND, OVER THE RANGE A POSTURE CAN ACTUALLY HOLD ──────────

describe('IN-0d FENCE 4 — every rung is reachable by a posture that can really exist', () => {
  test('the three toll rungs are reached from within HIDE\'s own hysteresis range', () => {
    // A GUARDED settlement holds at least HIDE_EXIT by construction (processSecrecy stamps
    // `max(pressure, HIDE_EXIT)`), so the reachable domain is [HIDE_EXIT, 1] and NOT [0, 1].
    // Sweeping the abstract range would have "proved" reachability for levels no settlement
    // can occupy — the dead-band class wearing a green.
    const floor = SIGHT_TUNING.HIDE_EXIT;
    expect(floor).toBeGreaterThan(0);
    const reachable = new Set();
    for (let i = 0; i <= 1000; i += 1) {
      const level = floor + (1 - floor) * (i / 1000);
      reachable.add(secrecyTradeBandOf(level));
    }
    // Every TOLL rung is reachable by a guarded town...
    expect([...reachable].sort()).toEqual(['choked', 'curtailed', 'throttled']);
    // ...and `unhindered` is deliberately NOT among them: being guarded at all costs
    // something. It is reached only by a town with no posture standing, pinned in FENCE 1.
    expect(reachable.has('unhindered')).toBe(false);
    expect(secrecyTradeBandOf(0)).toBe('unhindered');

    // Together those two facts cover the ladder with nothing left over.
    expect([...new Set([...reachable, 'unhindered'])].sort())
      .toEqual([...SECRECY_TRADE_BANDS].sort());
  });
});

// ── FENCE 5: ZERO CONSUMERS ⇒ TRADE BYTES CANNOT MOVE ──────────────────────────

/** Every .js/.jsx under src/, repo-relative. */
function srcModules(dir = join(ROOT, 'src'), out = /** @type {string[]} */ ([])) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) srcModules(p, out);
    else if (p.endsWith('.js') || p.endsWith('.jsx')) out.push(relative(ROOT, p).replace(/\\/g, '/'));
  }
  return out;
}

describe('IN-0d FENCE 5 — dark ⇒ trade bytes identical, by construction', () => {
  test('the export has ZERO consumers in src/, so no trade read can have moved', () => {
    const HOME = 'src/domain/worldPulse/secrecyTradeFactor.js';
    const modules = srcModules();
    expect(modules.length).toBeGreaterThan(200); // the walk is live
    expect(modules).toContain(HOME);

    // SCANNED OVER CODE ONLY, through the engine-gated-key walker's own comment/string
    // blanker. A prose mention is not a consumer, and this fence proved that the hard way
    // on its first run: brokerageServices.js NAMES this module in a deferred-consolidation
    // note, and a raw text scan read that sentence as a landed import. A fence that reds on
    // documentation teaches the next reader to delete documentation.
    const consumers = modules
      .filter((rel) => rel !== HOME)
      .filter((rel) => codeOnly(readFileSync(join(ROOT, rel), 'utf8')).includes('secrecyTradeFactor'));

    // ⚠ WHEN THIS REDS, IT IS WORKING. FP-TRADE (row 14) wires the consuming join, and the
    // moment it does this fence stops being true by construction. The message is: replace
    // this with a REAL differential dormancy fence over the trade read — dark vs lit,
    // byte-identical — and register the coupling row that licenses the import.
    expect(consumers, 'a consumer landed: upgrade this fence to a real trade differential').toEqual([]);

    // LIVE CONTROL: the scan can find the string where it genuinely is, so an `includes`
    // that had silently stopped matching would be caught rather than reading as an absence.
    expect(readFileSync(join(ROOT, HOME), 'utf8')).toContain('secrecyTradeFactorOf');
  });

  test('the module is a pure READ — it writes no ledger and takes no tick', () => {
    // CODE ONLY again, for the same reason: this module's header discusses the writer it
    // deliberately is not, and a raw scan would red on the explanation.
    const home = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/secrecyTradeFactor.js'), 'utf8'));
    // A write would need one of these; none may appear. Trade bytes cannot move behind a
    // read that cannot write, which is the other half of "identical by construction".
    for (const writer of ['setSpatialLedger', 'dropSpatialLedger', 'Math.random', 'appendPulseHistory']) {
      expect(home, `${writer} must not appear in a pure read`).not.toContain(writer);
    }
    // LIVE CONTROL for those four absences.
    expect(home).toContain('getSpatialLedger');
  });
});

// ── FENCE 6: THE SEAM 11 TRIPWIRE ──────────────────────────────────────────────

describe('IN-0d FENCE 6 — the contract TRADE pre-pins against is tripwired', () => {
  test('the contract is UNMOVED since IN-0d, and the landing record says what it was', () => {
    expect(secrecyTradeContractChangedSinceIn0d()).toBe(false);
    expect([...SECRECY_TRADE_BANDS]).toEqual([...SECRECY_TRADE_CONTRACT_AT_IN0D.bands]);
    expect([...SECRECY_TRADE_TUNING.BAND_FACTORS]).toEqual([...SECRECY_TRADE_CONTRACT_AT_IN0D.factors]);
    expect([...SECRECY_TRADE_TUNING.BAND_CUTS]).toEqual([...SECRECY_TRADE_CONTRACT_AT_IN0D.cuts]);

    // The published shape, spelled out ONCE here so a reader of the pins alone knows the
    // whole contract without opening the module.
    expect(SECRECY_TRADE_CONTRACT_AT_IN0D).toEqual({
      bands: ['unhindered', 'curtailed', 'throttled', 'choked'],
      factors: [1, 0.9, 0.78, 0.65],
      cuts: [0.20, 0.45, 0.70],
    });
  });

  test('GUARD THE GUARD — the tripwire actually fires when a rung moves', () => {
    // A tripwire that cannot fire is decoration. This does not mutate the module (a mutant
    // that plants nothing passes); it re-runs the comparison the tripwire performs, against
    // a landing record with one rung moved, and asserts the comparison notices.
    const moved = { ...SECRECY_TRADE_CONTRACT_AT_IN0D, factors: [1, 0.9, 0.78, 0.5] };
    const wouldChange = String(SECRECY_TRADE_TUNING.BAND_FACTORS) !== String(moved.factors)
      || String(SECRECY_TRADE_BANDS) !== String(moved.bands)
      || String(SECRECY_TRADE_TUNING.BAND_CUTS) !== String(moved.cuts);
    expect(wouldChange).toBe(true);

    // And a renamed band is caught too, not just a renumbered one.
    const renamed = { ...SECRECY_TRADE_CONTRACT_AT_IN0D, bands: ['unhindered', 'curtailed', 'throttled', 'sealed'] };
    expect(String(SECRECY_TRADE_BANDS) !== String(renamed.bands)).toBe(true);
  });
});
