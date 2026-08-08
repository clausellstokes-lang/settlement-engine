/**
 * generosityReactions.test.js — THE REACTION LEDGER battery (E1a; design §3, law 2).
 * Covers: the widow's-mite gratitude (§3.1), the obligation sub-ledger fold + prune +
 * DORMANCY (drop-when-empty ⇒ byte-identical), the predatory-weight mint (scenario 3),
 * fog-mediated forgiveness + refusal damage (§3.2/§3.3), the typed incidents (§2.1), the
 * §G named-tie CLAMP, and the moral-hazard buffer decay + recovery (scenario 10).
 *
 * @enforcement-walker The obligation-fold census ranges over the open worldPulse
 * source tree. If it fails, further folds must remain visible rather than being
 * absorbed by the per-test failure census.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  REACTION_TUNING, RELIEF_INCIDENT_KINDS,
  gratitudeDeposit, giverMarginSacrifice,
  obligationKey, obligationMintMagnitude, foldObligations, hasLiveObligation,
  fogForgiveness, refusalDamage, reliefIncident, tieContribution, bufferDisciplineStep,
  creditMaturityResolution, lendAppetiteStep, lendAppetiteOf,
} from '../../src/domain/spatial/generosityReactions.js';
import { setSpatialLedger, dropSpatialLedger, getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { advanceObligationDecay } from '../../src/domain/worldPulse/obligationDecay.js';

describe('the widow\'s mite (§3.1) — gratitude ∝ need × the giver\'s sacrifice', () => {
  it('the same need binds TIGHTER when the gift cost the giver more (the poor friend)', () => {
    const poorFriend = gratitudeDeposit({ needRelieved01: 0.6, giverMarginSacrifice01: 0.9 });
    const richDump = gratitudeDeposit({ needRelieved01: 0.6, giverMarginSacrifice01: 0.05 });
    expect(poorFriend).toBeGreaterThan(richDump);
  });
  it('a gift through a named TIE binds faster (§G.1)', () => {
    const viaTie = gratitudeDeposit({ needRelieved01: 0.5, giverMarginSacrifice01: 0.5, throughTie: true });
    const direct = gratitudeDeposit({ needRelieved01: 0.5, giverMarginSacrifice01: 0.5, throughTie: false });
    expect(viaTie).toBeGreaterThan(direct);
  });
  it('zero need ⇒ zero gratitude; the result is bounded [0,1]', () => {
    expect(gratitudeDeposit({ needRelieved01: 0, giverMarginSacrifice01: 1 })).toBe(0);
    expect(gratitudeDeposit({ needRelieved01: 1, giverMarginSacrifice01: 1, throughTie: true })).toBeLessThanOrEqual(1);
  });
  it('giverMarginSacrifice: giving from a THIN reserve — or in a lean SEASON — is a larger sacrifice (scenario 8)', () => {
    const thin = giverMarginSacrifice({ magnitudeFraction01: 0.3, giverHeadroom01: 0.15 });
    const fat = giverMarginSacrifice({ magnitudeFraction01: 0.3, giverHeadroom01: 0.95 });
    expect(thin).toBeGreaterThan(fat);
    const autumn = giverMarginSacrifice({ magnitudeFraction01: 0.3, giverHeadroom01: 0.5, seasonalScarcity01: 0.9 });
    const spring = giverMarginSacrifice({ magnitudeFraction01: 0.3, giverHeadroom01: 0.5, seasonalScarcity01: 0.0 });
    expect(autumn).toBeGreaterThan(spring);
  });
});

describe('the obligation sub-ledger (§3.1) — fold, deepen, repay, prune', () => {
  it('a mint records an obligation; a second relief DEEPENS the one record (≤1 per pair+kind)', () => {
    const t1 = foldObligations(null, { mints: [{ from: 'b', to: 'a', kind: 'grain_relief', magnitude: 0.3 }], now: 1 });
    const key = obligationKey('b', 'a', 'grain_relief');
    expect(t1 && t1[key].magnitude).toBeCloseTo(0.3, 5);
    const t2 = foldObligations(t1, { mints: [{ from: 'b', to: 'a', kind: 'grain_relief', magnitude: 0.4 }], now: 2 });
    // deepened (minus one tick of decay), still ONE record, original mintTick kept.
    expect(Object.keys(t2 || {}).length).toBe(1);
    expect(t2 && t2[key].magnitude).toBeGreaterThan(0.6);
    expect(t2 && t2[key].mintTick).toBe(1);
  });
  it('a repayment consumes the obligation; a fully-repaid record PRUNES to null (dormant)', () => {
    const minted = foldObligations(null, { mints: [{ from: 'b', to: 'a', kind: 'grain_relief', magnitude: 0.5 }], now: 1 });
    const repaid = foldObligations(minted, { repayments: [{ from: 'b', to: 'a', kind: 'grain_relief', amount: 1 }], now: 2 });
    expect(repaid).toBeNull(); // drained ⇒ the caller drops the sub-ledger ⇒ byte-identical-dormant
  });
  it('SS2-F8: a same-tick FULL-REPAY of a matured credit + a fresh RE-LOAN to the same pair keeps the NEW loan', () => {
    // The credit-maturity resolution pushes a repayment {amount:1} (full clear) while a same-tick
    // GIVE_AS_CREDIT verdict mints a new loan to the SAME (debtor, creditor, 'credit') key. Mints
    // ran BEFORE repayments, so the mint deepened the dead record and the {amount:1} zeroed the SUM
    // → the fresh loan vanished (grain moved, debt gone, its future maturity/casus-belli lost).
    // Repayments now consume FIRST + drop the drained record, so the re-loan lands as a NEW debt.
    const key = obligationKey('b', 'a', 'credit');
    const prior = { [key]: { from: 'b', to: 'a', kind: 'credit', magnitude: 1, mintTick: 0, lastTick: 0 } };
    const next = foldObligations(prior, {
      mints: [{ from: 'b', to: 'a', kind: 'credit', magnitude: 0.5, mintTick: 13, lastTick: 13 }],
      repayments: [{ from: 'b', to: 'a', kind: 'credit', amount: 1 }],
      now: 13,
    });
    expect(next).not.toBeNull();
    expect(next && next[key]).toBeTruthy();               // the fresh loan SURVIVED (not erased)
    expect(next && next[key].magnitude).toBeGreaterThan(0);
    expect(next && next[key].mintTick).toBe(13);          // a NEW obligation — not the dead one's mintTick 0
  });
  it('slow decay drains an untended obligation to null over time (the flood-year lingers, then fades)', () => {
    let led = foldObligations(null, { mints: [{ from: 'b', to: 'a', kind: 'grain_relief', magnitude: 0.2 }], now: 0 });
    let ticks = 0;
    while (led && ticks < 5000) { led = foldObligations(led, { now: ++ticks }); }
    expect(led).toBeNull();
    expect(ticks).toBeGreaterThan(5); // it does LINGER (slow decay), not vanish next tick
  });
  it('pulseKernel unconditionally schedules exactly one tuned 0.02 decay per tick', () => {
    const key = obligationKey('b', 'a', 'grain_relief');
    const prior = {
      [key]: {
        from: 'b',
        to: 'a',
        kind: 'grain_relief',
        magnitude: 0.5,
        mintTick: 1,
        lastTick: 1,
      },
    };
    const worldState = setSpatialLedger({ tick: 2 }, 'obligations', prior);
    const decayed = advanceObligationDecay(worldState, 2);

    expect(getSpatialLedger(decayed, 'obligations')[key].magnitude).toBe(0.49);
    expect(advanceObligationDecay({ tick: 2 }, 2)).toEqual({ tick: 2 });
  });

  it('every other runtime obligation fold is mutation-only (decayPerTick:0)', () => {
    const root = fileURLToPath(new URL('../../src/domain/worldPulse/', import.meta.url));
    const files = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const path = `${dir}/${name}`;
        if (statSync(path).isDirectory()) walk(path);
        else if (name.endsWith('.js')) files.push(path);
      }
    };
    walk(root);

    const calls = files.flatMap(path => [...readFileSync(path, 'utf8')
      .matchAll(/foldObligations\([\s\S]*?\);/g)]
      .map(match => ({ path, source: match[0] })));
    const callInventory = {};
    for (const row of calls) {
      const file = row.path.slice(root.length + 1);
      callInventory[file] = (callInventory[file] || 0) + 1;
    }
    const RUNTIME_FOLD_INVENTORY = Object.freeze({
      'assizeKernel.js': 1,
      'convergence.js': 1,
      'generosityKernel.js': 1,
      'obligationDecay.js': 1,
      'upswingKernel.js': 1,
      'warCoalitionSettlement.js': 2,
    });
    const decayOwners = calls.filter(row => !row.source.includes('decayPerTick: 0'));

    // Exact by file in both directions: a new fold reds, a removed/moved fold asks
    // this inventory to bank the win, and the two coalition folds are dispositioned
    // explicitly instead of hiding behind a total of seven.
    expect(callInventory).toEqual(RUNTIME_FOLD_INVENTORY);
    expect(decayOwners).toHaveLength(1);
    expect(decayOwners[0].path.endsWith('/obligationDecay.js')).toBe(true);
    expect(decayOwners[0].source).toContain('REACTION_TUNING.OBLIGATION_DECAY');
    const pulseSource = readFileSync(`${root}/pulseKernel.js`, 'utf8');
    expect(pulseSource.match(/advanceObligationDecay\(/g)).toHaveLength(1);
  });
  it('DORMANCY: an empty fold + dropSpatialLedger is byte-identical to a world that never had the ledger', () => {
    const base = { tick: 3, calendar: {}, foo: 1 };
    // Mint then fully repay ⇒ fold returns null ⇒ drop the sub-ledger.
    const minted = foldObligations(null, { mints: [{ from: 'b', to: 'a', kind: 'grain_relief', magnitude: 0.5 }], now: 1 });
    const withLedger = setSpatialLedger(base, 'obligations', minted);
    expect(getSpatialLedger(withLedger, 'obligations')).toBeTruthy();
    const drained = foldObligations(minted, { repayments: [{ from: 'b', to: 'a', kind: 'grain_relief', amount: 1 }], now: 2 });
    expect(drained).toBeNull();
    const dropped = dropSpatialLedger(withLedger, 'obligations');
    // Byte-identical to the original (no spatialLedgers key at all).
    expect(JSON.stringify(dropped)).toBe(JSON.stringify(base));
  });
  it('hasLiveObligation feeds the §0.1 gate (either direction)', () => {
    const led = foldObligations(null, { mints: [{ from: 'b', to: 'a', kind: 'grain_relief', magnitude: 0.4 }], now: 1 });
    expect(hasLiveObligation(led, 'a', 'b')).toBe(true);
    expect(hasLiveObligation(led, 'b', 'a')).toBe(true);
    expect(hasLiveObligation(led, 'a', 'z')).toBe(false);
    expect(hasLiveObligation(null, 'a', 'b')).toBe(false);
  });
  it('the predatory mint (scenario 3): a leverage-minded lender records the debt HEAVIER than face', () => {
    expect(obligationMintMagnitude({ baseMagnitude01: 0.5, leverageIntent01: 1 }))
      .toBeGreaterThan(obligationMintMagnitude({ baseMagnitude01: 0.5, leverageIntent01: 0 }));
  });
});

describe('fog-mediated forgiveness (§3.3) + refusal damage (§3.2)', () => {
  it('a refusal is FORGIVEN when the refused party believes the giver had nothing (hunger + army)', () => {
    const forgiven = fogForgiveness({ believedGiverScarcity01: 0.9, believedGiverMilitaryLoad01: 0.8 });
    const betrayed = fogForgiveness({ believedGiverScarcity01: 0.0, believedGiverMilitaryLoad01: 0.0 });
    expect(forgiven).toBeGreaterThan(betrayed);
    expect(betrayed).toBe(0); // believed fat behind full walls ⇒ no forgiveness
  });
  it('refusal damage: the SAME refusal wounds far more when believed unjust than when forgiven', () => {
    const desperate = 0.9;
    const believedUnjust = refusalDamage({ refusedDesperation01: desperate, forgiveness01: fogForgiveness({}) });
    const believedFair = refusalDamage({ refusedDesperation01: desperate, forgiveness01: fogForgiveness({ believedGiverScarcity01: 1, believedGiverMilitaryLoad01: 1 }) });
    expect(believedUnjust).toBeGreaterThan(believedFair);
  });
  it('a refused VASSAL reads an extra legitimacy breach of the patron duty (§3.2)', () => {
    const vassal = refusalDamage({ refusedDesperation01: 0.7, forgiveness01: 0.2, vassalBreach: true });
    const ally = refusalDamage({ refusedDesperation01: 0.7, forgiveness01: 0.2, vassalBreach: false });
    expect(vassal).toBeGreaterThan(ally);
  });
});

describe('typed incidents (§2.1) — the relationshipMemory rows', () => {
  it('builds a scored incident row for each valid relief kind; rejects unknown kinds', () => {
    for (const kind of RELIEF_INCIDENT_KINDS) {
      const row = reliefIncident({ kind, tick: 5, magnitude01: 0.6 });
      expect(row && row.type).toBe(kind);
      expect(row && row.severity).toBeCloseTo(0.6, 5);
      expect(row && row.tick).toBe(5);
    }
    expect(reliefIncident({ kind: 'not_a_kind', tick: 1, magnitude01: 0.5 })).toBeNull();
  });
  it('tags people-held by default; seat-held only when asked (cohesion §F.6 generational memory)', () => {
    expect(reliefIncident({ kind: 'relief_given', tick: 1, magnitude01: 0.5 }).holder).toBe('people_held');
    expect(reliefIncident({ kind: 'relief_given', tick: 1, magnitude01: 0.5, holder: 'seat_held' }).holder).toBe('seat_held');
  });
});

describe('§G named-tie CLAMP — a dense web matters; one friendship never overturns strategy', () => {
  it('the total tie influence is capped (house clamp) — a dense positive web saturates at the cap', () => {
    const one = tieContribution([{ gratitude01: 0.9 }]);
    const many = tieContribution([{ gratitude01: 0.9 }, { gratitude01: 0.9 }, { gratitude01: 0.9 }, { gratitude01: 0.9 }, { gratitude01: 0.9 }]);
    expect(many.contribution).toBeGreaterThan(one.contribution);
    expect(many.contribution).toBeLessThanOrEqual(REACTION_TUNING.TIE_INFLUENCE_CAP + 1e-9);
    expect(many.capped).toBe(true);
  });
  it('strained ties pull negative, still bounded by the cap', () => {
    const strained = tieContribution([{ strain01: 0.9 }, { strain01: 0.9 }]);
    expect(strained.contribution).toBeLessThan(0);
    expect(strained.contribution).toBeGreaterThanOrEqual(-REACTION_TUNING.TIE_INFLUENCE_CAP - 1e-9);
  });
});

describe('moral-hazard buffer discipline (§2.2 / scenario 10) — decay then recovery', () => {
  it('repeated relief DECAYS the receiver\'s granary discipline (bounded by the floor)', () => {
    let rec = null;
    const seen = [];
    for (let t = 0; t < 8; t++) { rec = bufferDisciplineStep(rec, { reliefThisTick: true, now: t }); seen.push(rec.discipline); }
    // Monotone non-increasing while aid flows; never below the floor.
    expect(seen[seen.length - 1]).toBeLessThan(seen[0]);
    expect(seen[seen.length - 1]).toBeGreaterThanOrEqual(REACTION_TUNING.BUFFER_FLOOR);
  });
  it('when aid STOPS, discipline RECOVERS and the record prunes to null (dormant)', () => {
    let rec = { discipline: REACTION_TUNING.BUFFER_FLOOR, lastTick: 0 };
    let t = 1;
    while (rec && t < 100) { rec = bufferDisciplineStep(rec, { reliefThisTick: false, now: t++ }); }
    expect(rec).toBeNull(); // fully recovered ⇒ prune ⇒ byte-identical-dormant
  });
});

describe('credit maturity (§3.4) — repayment vs default, LOADED by solvency/malice (§H)', () => {
  const credit = (mintTick, extra) => ({ from: 'b', to: 'a', kind: 'credit', magnitude: 0.5, mintTick, lastTick: mintTick, ...extra });
  const T = REACTION_TUNING;

  it('a GIFT obligation (grain_relief) never matures — only credit does', () => {
    const gift = { from: 'b', to: 'a', kind: 'grain_relief', magnitude: 0.5, mintTick: 0, lastTick: 0 };
    expect(creditMaturityResolution({ obligation: gift, now: 999, debtorSolvency01: 1, debtorMalice01: 0 })).toBe('pending');
  });
  it('a credit BEFORE its term is pending; AT/after the term it resolves', () => {
    expect(creditMaturityResolution({ obligation: credit(0), now: T.CREDIT_TERM - 1, debtorSolvency01: 1, debtorMalice01: 0 })).toBe('pending');
    expect(creditMaturityResolution({ obligation: credit(0), now: T.CREDIT_TERM, debtorSolvency01: 1, debtorMalice01: 0 })).toBe('repaid');
  });
  it('a solvent, non-malicious debtor REPAYS', () => {
    expect(creditMaturityResolution({ obligation: credit(0), now: T.CREDIT_TERM + 2, debtorSolvency01: 0.9, debtorMalice01: 0.1 })).toBe('repaid');
  });
  it('an INSOLVENT debtor DEFAULTS (can\'t pay)', () => {
    expect(creditMaturityResolution({ obligation: credit(0), now: T.CREDIT_TERM + 2, debtorSolvency01: 0.1, debtorMalice01: 0.1 })).toBe('defaulted');
  });
  it('a MALICIOUS debtor DEFAULTS even when solvent (won\'t pay)', () => {
    expect(creditMaturityResolution({ obligation: credit(0), now: T.CREDIT_TERM + 2, debtorSolvency01: 1, debtorMalice01: 0.9 })).toBe('defaulted');
  });
});

describe('the lender\'s appetite-to-lend (§3.4, merchantAppetite pattern) — hardened hearts', () => {
  const T = REACTION_TUNING;
  it('a default DECAYS appetite (bounded by the floor); it never fully stops', () => {
    let rec = null;
    const seen = [];
    for (let t = 0; t < 8; t++) { rec = lendAppetiteStep(rec, { defaultedThisTick: true, now: t }); seen.push(rec.appetite); }
    expect(seen[0]).toBeLessThan(1);                                    // first default already bit
    expect(seen[seen.length - 1]).toBeGreaterThanOrEqual(T.LEND_APPETITE_FLOOR);
  });
  it('without a default appetite RECOVERS toward full and prunes to null (dormant)', () => {
    let rec = { appetite: T.LEND_APPETITE_FLOOR, lastTick: 0 };
    let t = 1;
    while (rec && t < 100) { rec = lendAppetiteStep(rec, { defaultedThisTick: false, now: t++ }); }
    expect(rec).toBeNull(); // fully recovered ⇒ prune ⇒ byte-identical-dormant
  });
  it('lendAppetiteOf reads the level, or 1 (unburned baseline) when absent', () => {
    expect(lendAppetiteOf(null, 'a')).toBe(1);
    expect(lendAppetiteOf({}, 'a')).toBe(1);
    expect(lendAppetiteOf({ a: { appetite: 0.5, lastTick: 3 } }, 'a')).toBe(0.5);
    expect(lendAppetiteOf({ a: { appetite: 0.5, lastTick: 3 } }, 'b')).toBe(1);
  });
});
