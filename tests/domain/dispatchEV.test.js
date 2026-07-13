/**
 * dispatchEV.test.js — Phase 5.5 mover M6c: THE DISPATCH EV — GREED vs DANGER.
 *
 * The pure EV engine's proof. Gates pinned here:
 *   - PER-STRESSOR danger shapes: SIEGE ≈ near-absolute; an EXTRACTIVE occupier
 *     DAMPENS (never severs) — the M11a plug-in seam (stressorDanger);
 *   - THE DETERRENT READS BELIEF: a STALE siege belief deters a caravan from a town
 *     that has since RECOVERED; an UNHEARD danger (no belief) does NOT deter;
 *   - DYNAMIC APPETITE: rises on a risky paid-off run, falls on a loss, decays to a
 *     merchant/alignment BASELINE, stays BOUNDED, and prunes at baseline;
 *   - THE DECISION: premium beats danger ⇒ dispatch; danger beats premium ⇒ refuse;
 *     PEACEFUL (danger 0) ⇒ always dispatch (the M6a byte-identity guarantee);
 *   - HYSTERESIS: willingness does NOT flip-flop on jitter (enter/exit + dwell);
 *   - the vassal-tribute must-go OVERRIDE.
 */
import { describe, it, expect } from 'vitest';
import {
  DISPATCH_TUNING, OCCUPATION_DANGER,
  occupationDangerTerm, stressorDanger, dangerFromReadiness,
  believedDestinationDanger, needPremium, merchantBaseline,
  appetiteOf, stepAppetite, emboldenedReceipt, dispatchDecision,
} from '../../src/domain/spatial/dispatchEV.js';

const T = DISPATCH_TUNING;

// A worldState with a single 'seat' belief record P → C (the governing coalition's).
const withBelief = (rec, infoMode = 'perfect_delayed') => ({
  spatialCanonVersion: 1,
  simulationRules: { commodityFlowEnabled: true, infoMode },
  spatialLedgers: { beliefMaps: { P: { seat: { C: rec } } } },
});

describe('M6c — per-stressor ground-truth danger (siege near-absolute; extractive dampens)', () => {
  it('siege is near-absolute; occupation is a dampened confiscation risk', () => {
    expect(stressorDanger({ besieged: true })).toBe(T.DANGER_SIEGE);
    expect(stressorDanger({ besieged: true })).toBeGreaterThan(0.9);
    // An EXTRACTIVE occupier DAMPENS — it deters far less than a siege, never severs.
    const extractive = stressorDanger({ occupationState: 'extractive' });
    expect(extractive).toBe(OCCUPATION_DANGER.extractive);
    expect(extractive).toBeGreaterThan(0);                       // never severs (dampens)
    expect(extractive).toBeLessThan(stressorDanger({ besieged: true })); // dampened vs siege
    // The occupation ladder: a contested conquest is more dangerous than a settled vassal.
    expect(occupationDangerTerm('contested')).toBeGreaterThan(occupationDangerTerm('extractive'));
    expect(occupationDangerTerm('extractive')).toBeGreaterThan(occupationDangerTerm('vassalized'));
    // The worst stressor dominates; no stressor ⇒ 0.
    expect(stressorDanger({ besieged: true, occupationState: 'extractive' })).toBe(T.DANGER_SIEGE);
    expect(stressorDanger({})).toBe(0);
    expect(occupationDangerTerm(null)).toBe(0);
  });

  it('dangerFromReadiness: an alert town reads safe; full deployment reads maximal', () => {
    expect(dangerFromReadiness(0)).toBe(0);
    expect(dangerFromReadiness(T.READINESS_IDLE)).toBe(0);       // merely alert ⇒ not dangerous
    expect(dangerFromReadiness(1)).toBe(1);                      // deployed / besieged ⇒ maximal
    expect(dangerFromReadiness(0.65)).toBeCloseTo(0.5, 5);
  });
});

describe('M6c — THE DETERRENT reads BELIEF, never ground truth', () => {
  it('dormant / omniscient ⇒ ground truth (byte-exact fallback)', () => {
    // No marker ⇒ belief() is truth ⇒ the origin acts on the real stressor.
    expect(believedDestinationDanger('P', 'C', null, { besieged: true })).toBe(T.DANGER_SIEGE);
    const omni = { spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient' } };
    expect(believedDestinationDanger('P', 'C', omni, { besieged: true })).toBe(T.DANGER_SIEGE);
  });

  it('a STALE siege belief DETERS a caravan from a town that has since RECOVERED', () => {
    // The origin believes C besieged (high readiness, still confident) — but the ground
    // truth is SAFE (no siege). The deterrent reads the STALE BELIEF, not the recovery.
    const staleSiege = withBelief({ readiness: 1, strengthBand: 3, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 0 });
    const danger = believedDestinationDanger('P', 'C', staleSiege, { besieged: false }); // truth: recovered
    expect(danger).toBeCloseTo(0.9, 5);                          // deters on the stale rumor
    expect(danger).toBeGreaterThan(T.RISKY_DANGER_FLOOR);
  });

  it('an UNHEARD danger does NOT deter (source unknown ⇒ slips through)', () => {
    // Beliefs are LIVE but the origin holds NO belief about C, yet C is really besieged.
    // The origin never got word ⇒ deterrent 0 ⇒ the caravan walks in.
    const noBelief = { spatialCanonVersion: 1, simulationRules: { commodityFlowEnabled: true, infoMode: 'perfect_delayed' }, spatialLedgers: { beliefMaps: { P: { seat: {} } } } };
    expect(believedDestinationDanger('P', 'C', noBelief, { besieged: true })).toBe(0);
  });

  it('a believed-safe town with a fresh occupation reads the dampened occupation floor', () => {
    // The origin believes C calm (low readiness) but C is extractively occupied — the
    // persistent, public occupation is a mild floor (dampened), the siege-rumor channel 0.
    const calmBelief = withBelief({ readiness: 0, strengthBand: 2, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.8, lastUpdateTick: 0 });
    const danger = believedDestinationDanger('P', 'C', calmBelief, { occupationState: 'extractive' });
    expect(danger).toBe(OCCUPATION_DANGER.extractive);           // dampened, never severed
  });

  it('a faded belief (low confidence) deters less than a confident one', () => {
    const faded = withBelief({ readiness: 1, strengthBand: 3, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.2, lastUpdateTick: 0 });
    const confident = withBelief({ readiness: 1, strengthBand: 3, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 0 });
    expect(believedDestinationDanger('P', 'C', faded, { besieged: false }))
      .toBeLessThan(believedDestinationDanger('P', 'C', confident, { besieged: false }));
  });
});

describe('M6c — the need-premium (attraction; no numeric prices)', () => {
  it('rises as the stockpile empties; 0 at/above target', () => {
    expect(needPremium(8, 8)).toBe(0);
    expect(needPremium(0, 8)).toBe(1);                           // deep shortage ⇒ max premium
    expect(needPremium(4, 8)).toBeCloseTo(0.5, 5);
    expect(needPremium(12, 8)).toBe(0);                          // surplus ⇒ no premium
  });
});

describe('M6c — the dynamic appetite (baseline, rise/fall/decay, bounds, prune)', () => {
  it('baseline: a strong merchant guild raises it; a lawful town lowers it; bounded', () => {
    const strong = merchantBaseline({ merchantStrength01: 1, lawfulness01: 0.5 });
    const lawful = merchantBaseline({ merchantStrength01: 0, lawfulness01: 1 });
    const neutral = merchantBaseline({});
    expect(strong).toBeGreaterThan(neutral);
    expect(lawful).toBeLessThan(neutral);
    // A lawless strong-merchant town saturates at the ceiling; every baseline is bounded.
    expect(merchantBaseline({ merchantStrength01: 1, lawfulness01: 0 })).toBeLessThanOrEqual(T.APPETITE_CEIL);
    expect(lawful).toBeGreaterThanOrEqual(T.APPETITE_FLOOR);
  });

  it('appetiteOf reads the stored level, or the baseline when absent', () => {
    expect(appetiteOf(null, 'P', 1.2)).toBe(1.2);               // no ledger ⇒ baseline
    expect(appetiteOf({ P: { level: 1.7, lastTick: 3 } }, 'P', 1.0)).toBe(1.7);
    expect(appetiteOf({ P: { level: 1.7 } }, 'Q', 0.9)).toBe(0.9); // unknown origin ⇒ baseline
  });

  it('RISES on a risky paid-off run, FALLS on a loss (loss aversion), DECAYS to baseline', () => {
    const emboldened = stepAppetite(null, { baseline: 1.0, paid: 1, now: 1 });
    expect(emboldened.level).toBeGreaterThan(1.0);              // a risky delivery emboldens
    const cowed = stepAppetite({ level: 1.5, lastTick: 0 }, { baseline: 1.0, lost: 1, now: 1 });
    expect(cowed.level).toBeLessThan(1.5);                       // a loss cows
    // Loss aversion: a loss moves more than a win (LOSS > GAIN).
    const up = stepAppetite({ level: 1.0, lastTick: 0 }, { baseline: 1.0, paid: 1, now: 1 }).level;
    const down = stepAppetite({ level: 1.0, lastTick: 0 }, { baseline: 1.0, lost: 1, now: 1 }).level;
    expect(1.0 - down).toBeGreaterThan(up - 1.0);
    // DECAY: with no events an elevated scalar drifts back toward baseline.
    const decaying = stepAppetite({ level: 1.8, lastTick: 0 }, { baseline: 1.0, now: 1 });
    expect(decaying.level).toBeLessThan(1.8);
    expect(decaying.level).toBeGreaterThan(1.0);
  });

  it('stays BOUNDED [FLOOR, CEIL] under repeated shocks', () => {
    let rec = { level: 1.0, lastTick: 0 };
    for (let i = 0; i < 40; i++) rec = stepAppetite(rec, { baseline: 1.0, paid: 5, now: i + 1 }) || rec;
    expect(rec.level).toBeLessThanOrEqual(T.APPETITE_CEIL);
    let low = { level: 1.0, lastTick: 0 };
    for (let i = 0; i < 40; i++) low = stepAppetite(low, { baseline: 1.0, lost: 5, now: i + 1 }) || low;
    expect(low.level).toBeGreaterThanOrEqual(T.APPETITE_FLOOR);
  });

  it('PRUNES a scalar settled within EPS of its baseline (sparse ledger)', () => {
    expect(stepAppetite({ level: 1.005, lastTick: 0 }, { baseline: 1.0, now: 1 })).toBeNull();
    // A fresh event never prunes even at baseline.
    expect(stepAppetite({ level: 1.0, lastTick: 0 }, { baseline: 1.0, paid: 1, now: 1 })).not.toBeNull();
  });

  it('the emboldened receipt names the destination run', () => {
    expect(emboldenedReceipt('Ashford')).toContain('Ashford');
    expect(emboldenedReceipt('Ashford')).toMatch(/emboldened/i);
  });
});

describe('M6c — the dispatch decision (EV + the hysteresis)', () => {
  const decide = (over) => ({ short: true, now: 0, priorWillingness: null, caution: 1, appetite: 1, ...over });

  it('premium beats danger ⇒ DISPATCH; danger beats premium ⇒ REFUSE', () => {
    const go = dispatchDecision(decide({ needPremium: 0.9, believedDanger: 0.8 }));
    expect(go.dispatch).toBe(true);
    expect(go.refuse).toBe(false);
    const no = dispatchDecision(decide({ needPremium: 0.4, believedDanger: 0.9 }));
    expect(no.dispatch).toBe(false);
    expect(no.refuse).toBe(true);
    expect(no.believedDanger).toBeCloseTo(0.9, 5);               // the M7 signal magnitude
  });

  it('PEACEFUL (danger 0) always dispatches when short — the M6a byte-identity guarantee', () => {
    // Even a barely-short link with the smallest premium dispatches when danger is 0.
    const d = dispatchDecision(decide({ needPremium: 0.01, believedDanger: 0 }));
    expect(d.dispatch).toBe(true);
    expect(d.refuse).toBe(false);
    expect(d.willingness).toBeNull();                            // willing ⇒ no ledger record
  });

  it('BLOCKADE-RUNNER: a deep shortage + a bold merchant runs even a siege', () => {
    // needPremium 1 (cut-off town) × appetite 2 (emboldened) beats a siege 0.95 × caution 1.
    const run = dispatchDecision(decide({ needPremium: 1, appetite: T.APPETITE_CEIL, believedDanger: T.DANGER_SIEGE }));
    expect(run.dispatch).toBe(true);
  });

  it('a bold (low-caution) origin runs danger a lawful one refuses (the ONE caution read)', () => {
    const args = { needPremium: 0.5, appetite: 1, believedDanger: 0.8 };
    const lawful = dispatchDecision(decide({ ...args, caution: 1 }));      // reads danger true
    const bold = dispatchDecision(decide({ ...args, caution: 0.2 }));      // under-weights danger
    expect(lawful.refuse).toBe(true);
    expect(bold.refuse).toBe(false);
  });

  it('HYSTERESIS: willingness does not flip-flop on jitter (enter/exit + dwell)', () => {
    // netDanger = danger·caution − premium·appetite. Enter refusing only above ENTER;
    // once refusing, a dip into the deadband does NOT resume until EXIT is cleared AND dwell.
    const enter = dispatchDecision(decide({ needPremium: 0.5, believedDanger: 0.72, now: 0 })); // net 0.22 > ENTER
    expect(enter.refuse).toBe(true);
    const refusing = enter.willingness;
    // A jitter DOWN into the deadband one tick later — still refusing (no flip-flop).
    const jitterHold = dispatchDecision(decide({ needPremium: 0.5, believedDanger: 0.6, now: 1, priorWillingness: refusing })); // net 0.1 ∈ deadband
    expect(jitterHold.refuse).toBe(true);
    // Below EXIT but the dwell has not elapsed — STILL refusing.
    const dwellHold = dispatchDecision(decide({ needPremium: 0.5, believedDanger: 0.5, now: 2, priorWillingness: refusing })); // net 0 < EXIT, dwell 2 < 4
    expect(dwellHold.refuse).toBe(true);
    // Below EXIT AND past the dwell — RESUMES willing (prunes the record).
    const resume = dispatchDecision(decide({ needPremium: 0.5, believedDanger: 0.5, now: T.REFUSE_DWELL, priorWillingness: { phase: 'refusing', sinceTick: 0, lastTick: 0 } }));
    expect(resume.refuse).toBe(false);
    expect(resume.dispatch).toBe(true);
    expect(resume.willingness).toBeNull();
    // A WILLING link jittering inside the deadband never enters refusing.
    const stayWilling = dispatchDecision(decide({ needPremium: 0.5, believedDanger: 0.6, now: 0, priorWillingness: null })); // net 0.1 < ENTER
    expect(stayWilling.refuse).toBe(false);
  });

  it('OVERRIDE: vassal tribute must-go dispatches regardless of the EV', () => {
    const coerced = dispatchDecision(decide({ needPremium: 0.1, believedDanger: T.DANGER_SIEGE, override: 'must-go' }));
    expect(coerced.dispatch).toBe(true);
    expect(coerced.override).toBe('must-go');
    // Ally relief likewise sends into danger.
    const relief = dispatchDecision(decide({ needPremium: 0.1, believedDanger: T.DANGER_SIEGE, override: 'relief' }));
    expect(relief.dispatch).toBe(true);
  });
});
