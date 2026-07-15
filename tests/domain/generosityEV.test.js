/**
 * generosityEV.test.js — THE GENEROSITY KERNEL battery (E1a; design
 * DESIGN_GENEROSITY_ENGINE.md §2). Covers: the §0.1 gate (sparse by construction),
 * the GIVE/WITHHOLD terms, the four verdict tiers, THE CANONICAL famine/army/margin
 * example as a NAMED pin (both halves — REFUSE, then the war-strategic flip to
 * GIVE_PARTIAL), the hard reserve-floor invariant, the hysteresis latch, the loaded-dice
 * primitives (§H), the instrument catalog + the §2.4 warning-gift sacrifice pricing, the
 * dormancy gate, and anti-vacuity (the machinery MOVES when lit).
 */
import { describe, it, expect } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  GENEROSITY_TUNING, VERDICTS, GENEROSITY_INSTRUMENTS,
  qualifiesForGenerosity, bondTerm, historyTerm, conscienceTerm, strategyTerm, faithTerm,
  ownMarginTerm, commitmentLoadTerm, routeRiskTerm, domesticReactionTerm, dependencyTerm,
  generosityEV, generosityReceipt, triageAllocation,
  generosityForkKey, loadedDraw, shouldInitiateAsk, warningSacrifice, constructiveFlowsActive,
} from '../../src/domain/spatial/generosityEV.js';

// A comfortable, deep-reserve, peacetime giver (the baseline every scenario perturbs).
const RICH_MARGIN = { reserveAboveFloor01: 0.9, granaryTrend01: 0.7, seasonalOutlook01: 0.8 };
const NO_COMMIT = { deployedArmies: 0, mobilization01: 0, warDrain01: 0 };

describe('generosity gate (§0.1) — sparse by construction (law 1)', () => {
  it('a qualifying bond above the floor opens the gate', () => {
    expect(qualifiesForGenerosity({ bond: { kind: 'allied', strength01: 0.6 } })).toBe(true);
    expect(qualifiesForGenerosity({ bond: { kind: 'trade_partner', strength01: 0.4 } })).toBe(true);
    expect(qualifiesForGenerosity({ bond: { kind: 'vassal', strength01: 0.5 } })).toBe(true);
  });
  it('a cold stranger with no bond/obligation/conscience is NEVER asked', () => {
    expect(qualifiesForGenerosity({ bond: { kind: 'neutral', strength01: 0.9 } })).toBe(false);
    expect(qualifiesForGenerosity({ bond: { kind: 'allied', strength01: 0.05 } })).toBe(false);
    expect(qualifiesForGenerosity({})).toBe(false);
  });
  it('a live obligation OR the conscience exception opens the gate without a bond', () => {
    expect(qualifiesForGenerosity({ hasObligation: true })).toBe(true);
    expect(qualifiesForGenerosity({ conscienceException: true })).toBe(true);
  });
});

describe('GIVE-side terms (§2.1) — bounded, monotone, betrayal-killed', () => {
  it('bondTerm rises with strength and rewards ally/vassal kinds over bare trade', () => {
    expect(bondTerm(null)).toBe(0);
    expect(bondTerm({ kind: 'allied', strength01: 0.9 })).toBeGreaterThan(bondTerm({ kind: 'trade_partner', strength01: 0.9 }));
    expect(bondTerm({ kind: 'allied', strength01: 0.9 })).toBeGreaterThan(bondTerm({ kind: 'allied', strength01: 0.2 }));
  });
  it('historyTerm: a betrayal ZEROS the give-side (killswitch)', () => {
    expect(historyTerm({ betrayal: true }).betrayalKill).toBe(true);
    expect(historyTerm({ reliefReceived01: 0.8 }).value01).toBeGreaterThan(0);
    expect(historyTerm({ reliefReceived01: 0.2, reliefRefusedByThem01: 0.8 }).value01)
      .toBeLessThan(historyTerm({ reliefReceived01: 0.2 }).value01 + 0.0001);
  });
  it('conscienceTerm scales the receiver need by the giver goodness/lawfulness', () => {
    expect(conscienceTerm({ good01: 1, lawful01: 1, need01: 1 })).toBeGreaterThan(conscienceTerm({ good01: 0.1, lawful01: 0.1, need01: 1 }));
    expect(conscienceTerm({ good01: 1, lawful01: 1, need01: 0 })).toBe(0);
  });
  it('strategyTerm exposes the war-strategic + leverage sub-reads', () => {
    const s = strategyTerm({ warStrategic01: 0.8, supplyDependency01: 0.5, leverage01: 0.9 });
    expect(s.warStrategic01).toBe(0.8);
    expect(s.leverage01).toBe(0.9);
    expect(s.value01).toBeGreaterThan(0);
  });
  it('faithTerm rewards temple mediation + shared faith', () => {
    expect(faithTerm({ templeMediated: true, sharedFaith01: 0.8 })).toBeGreaterThan(faithTerm({ sharedFaith01: 0.8 }));
  });
});

describe('WITHHOLD-side terms (§2.2) — the risk assessment', () => {
  it('ownMarginTerm: a thin, falling, autumn reserve is near-prohibitive; a deep surplus is cheap', () => {
    const thin = ownMarginTerm({ reserveAboveFloor01: 0.05, granaryTrend01: 0.2, seasonalOutlook01: 0.1 });
    const fat = ownMarginTerm({ reserveAboveFloor01: 0.95, granaryTrend01: 0.9, seasonalOutlook01: 0.9 });
    expect(thin).toBeGreaterThan(0.8);
    expect(fat).toBeLessThan(0.15);
  });
  it('commitmentLoadTerm: a deployed army is a heavy standing claim on the granary', () => {
    expect(commitmentLoadTerm({ deployedArmies: 0 })).toBe(0);
    expect(commitmentLoadTerm({ deployedArmies: 2 })).toBeGreaterThan(commitmentLoadTerm({ deployedArmies: 1 }));
  });
  it('domesticReactionTerm: hungry ⇒ a legitimacy COST; comfortable ⇒ a small reputation LIFT', () => {
    expect(domesticReactionTerm({ ownScarcity01: 0.9 })).toBeGreaterThan(0);
    expect(domesticReactionTerm({ ownScarcity01: 0 })).toBeLessThan(0); // the granary-city lift
  });
  it('dependencyTerm: chronic asks are discounted ("the third famine in five years")', () => {
    expect(dependencyTerm(1)).toBe(0);
    expect(dependencyTerm(3)).toBeGreaterThan(dependencyTerm(2));
  });
  it('routeRiskTerm reads belief (dormant worldState ⇒ ground truth); a hostile gate seizure feeds the enemy', () => {
    const ws = { simulationRules: {} };
    const safe = routeRiskTerm({ giverId: 'a', receiverId: 'b', worldState: ws, groundTruthStressor: {} });
    const besieged = routeRiskTerm({ giverId: 'a', receiverId: 'b', worldState: ws, groundTruthStressor: { besieged: true } });
    const seized = routeRiskTerm({ giverId: 'a', receiverId: 'b', worldState: ws, groundTruthStressor: {}, hostileGateOnRoute: true });
    expect(safe).toBe(0);
    expect(besieged).toBeGreaterThan(0.9);
    expect(seized).toBeGreaterThan(0);
  });
});

describe('verdict tiers (§2.3)', () => {
  const base = {
    giverId: 'thornwall', receiverId: 'marchmont', now: 10,
    bond: { kind: 'allied', strength01: 0.8 }, margin: RICH_MARGIN, commitment: NO_COMMIT,
    conscience: { good01: 0.7, lawful01: 0.7, need01: 0.8 }, askFraction01: 0.4,
  };
  it('a strong bond + deep reserve + peace ⇒ GIVE_FULL', () => {
    const v = generosityEV(base);
    expect(v.verdict).toBe(VERDICTS.GIVE_FULL);
    expect(v.magnitudeFraction).toBeGreaterThanOrEqual(GENEROSITY_TUNING.FULL_AT);
  });
  it('a leverage-minded giver turns a gift into CREDIT (§2.1 / scenario 3: evil gives to indebt)', () => {
    const v = generosityEV({ ...base, strategy: { leverage01: 0.9 }, lensMod: { leverage: 1.2 } });
    expect(v.verdict).toBe(VERDICTS.GIVE_AS_CREDIT);
    expect(v.receipt).toMatch(/loan|debt/i);
  });
  it('a thin reserve that can only spare a sliver ⇒ GIVE_PARTIAL ("a tenth of what was asked")', () => {
    const v = generosityEV({
      ...base, margin: { reserveAboveFloor01: 0.3, granaryTrend01: 0.5, seasonalOutlook01: 0.5 }, askFraction01: 1,
    });
    expect(v.verdict).toBe(VERDICTS.GIVE_PARTIAL);
    expect(v.magnitudeFraction).toBeLessThan(GENEROSITY_TUNING.FULL_AT);
    expect(v.magnitudeFraction).toBeGreaterThan(0);
  });
});

describe('THE CANONICAL PIN (scenario 1) — ally famine + deployed army + razor margin', () => {
  // The owner's canonical case, verbatim intent: an ally starves, the giver holds a
  // deployed army and sits a razor above its own hunger line ⇒ WITHHOLD — UNLESS a
  // strategic read (their pass shields the giver's flank) flips the ledger.
  const razor = {
    giverId: 'thornwall', receiverId: 'marchmont', now: 20,
    bond: { kind: 'allied', strength01: 0.7 },
    conscience: { good01: 0.6, lawful01: 0.6, need01: 0.95 }, // the ally is desperate
    margin: { reserveAboveFloor01: 0.08, granaryTrend01: 0.2, seasonalOutlook01: 0.2 }, // a razor above hunger
    commitment: { deployedArmies: 3, mobilization01: 0.7, warDrain01: 0.6 },            // an army afield
    askFraction01: 1,
  };

  it('HALF A — no strategic read ⇒ REFUSE ("the army at the front eats first")', () => {
    const v = generosityEV({ ...razor, strategy: { warStrategic01: 0 } });
    expect(v.verdict).toBe(VERDICTS.REFUSE);
    expect(v.magnitudeFraction).toBe(0);
    // The withhold side clearly dominates.
    expect(v.withholdScore).toBeGreaterThan(v.giveScore);
    expect(v.receipt).toMatch(/army at the front eats first|razor|road to/i);
  });

  it('HALF B — the ally garrisons the pass that shields the flank ⇒ FLIP to GIVE_PARTIAL', () => {
    const v = generosityEV({ ...razor, strategy: { warStrategic01: 0.85 } });
    expect([VERDICTS.GIVE_PARTIAL, VERDICTS.GIVE_FULL]).toContain(v.verdict);
    expect(v.verdict).not.toBe(VERDICTS.REFUSE);
    expect(v.strategicOverride).toBe(true);
    expect(v.magnitudeFraction).toBeGreaterThan(0);
    expect(v.receipt).toMatch(/shields|flank|defense spending/i);
  });

  it('the commitment-dominant receipt names the army (loaded dice = receipts, §H)', () => {
    const r = generosityReceipt({
      verdict: VERDICTS.REFUSE, giverId: 'thornwall', receiverId: 'marchmont',
      terms: { bond: 0.3, history: 0, conscience: 0.2, strategy: 0, faith: 0, margin: 0.4, commitment: 0.6, route: 0.1, domestic: 0.1, dependency: 0 },
      strategicOverride: false, leverageIntent: 0,
    });
    expect(r).toMatch(/army at the front eats first/i);
  });
});

describe('the hard reserve-floor invariant (§2.2) — never crossed', () => {
  it('a razor reserve with NO strategic override cannot spend below the floor ⇒ REFUSE', () => {
    const v = generosityEV({
      giverId: 'a', receiverId: 'b', now: 1, bond: { kind: 'allied', strength01: 0.9 },
      conscience: { good01: 1, lawful01: 1, need01: 1 },
      margin: { reserveAboveFloor01: 0.01, granaryTrend01: 0.05, seasonalOutlook01: 0.05 },
      commitment: NO_COMMIT, askFraction01: 1, strategy: { warStrategic01: 0 },
    });
    expect(v.verdict).toBe(VERDICTS.REFUSE);
    expect(v.floorForbids).toBe(true);
  });
  it('PROPERTY: the reserve consumed never exceeds the headroom above the floor (no override)', () => {
    for (let i = 0; i < 300; i++) {
      const rng = createPRNG(`floor-prop-${i}`).fork('x');
      const margin = { reserveAboveFloor01: rng.random(), granaryTrend01: rng.random(), seasonalOutlook01: rng.random() };
      const ask = 0.1 + rng.random() * 0.9;
      const v = generosityEV({
        giverId: 'a', receiverId: 'b', now: i,
        bond: { kind: 'allied', strength01: rng.random() },
        conscience: { good01: rng.random(), lawful01: rng.random(), need01: rng.random() },
        margin, commitment: { deployedArmies: Math.floor(rng.random() * 3) }, askFraction01: ask,
        strategy: { warStrategic01: 0 }, // no override ⇒ the raw reserve floor holds
      });
      expect(v.magnitudeFraction).toBeGreaterThanOrEqual(0);
      expect(v.magnitudeFraction).toBeLessThanOrEqual(1);
      // The reserve actually consumed = (fraction of the ask granted) × (ask as a share of
      // reserve). It must never exceed the HARD headroom above the reserve floor
      // (reserveAboveFloor01) — the floor is never crossed (no override in this battery).
      const reserveConsumed = v.magnitudeFraction * ask;
      expect(reserveConsumed).toBeLessThanOrEqual(margin.reserveAboveFloor01 + 1e-4);
    }
  });
});

describe('hysteresis (§2.3) — aid does not flip-flop', () => {
  it('a borderline pair holds its prior REFUSING posture until the exit + dwell are met', () => {
    // Set inputs to sit in the deadband (netWithhold between EXIT and ENTER).
    const borderline = {
      giverId: 'a', receiverId: 'b', now: 100,
      bond: { kind: 'trade_partner', strength01: 0.4 },
      conscience: { good01: 0.5, lawful01: 0.5, need01: 0.5 },
      margin: { reserveAboveFloor01: 0.5, granaryTrend01: 0.5, seasonalOutlook01: 0.5 },
      commitment: { deployedArmies: 1 }, askFraction01: 0.5,
    };
    const priorWillingness = { phase: 'refusing', sinceTick: 99, lastTick: 99 };
    const held = generosityEV({ ...borderline, priorWillingness });
    // Still within dwell (100 - 99 < 4) ⇒ the refusing posture persists.
    expect(held.willingness && held.willingness.phase).toBe('refusing');
  });
});

describe('TRIAGE (§2.2 / scenario 4) — two claimants, one granary', () => {
  const claimants = [
    { id: 'alpha', giveScore01: 0.8, need01: 0.9 },
    { id: 'bravo', giveScore01: 0.5, need01: 0.7 },
  ];
  it('a PRAGMATIC giver feeds the buffer state (top-ranked) whole; a LAWFUL giver splits', () => {
    const pragmatic = triageAllocation({ claimants, budget01: 0.9, lawfulness01: 0.05 });
    const lawful = triageAllocation({ claimants, budget01: 0.9, lawfulness01: 0.95 });
    // Pragmatic concentrates on alpha (higher rank); lawful spreads more to bravo.
    expect(pragmatic.allocations.alpha).toBeGreaterThan(pragmatic.allocations.bravo);
    expect(lawful.allocations.bravo).toBeGreaterThan(pragmatic.allocations.bravo);
  });
  it("the runner-up's slight is SMALLER when the constraint is publicly believed (fog applies to triage)", () => {
    const priv = triageAllocation({ claimants, budget01: 0.4, lawfulness01: 0.05, constraintPubliclyBelieved: false });
    const publicC = triageAllocation({ claimants, budget01: 0.4, lawfulness01: 0.05, constraintPubliclyBelieved: true });
    const bravoPriv = priv.slights.bravo || 0;
    const bravoPublic = publicC.slights.bravo || 0;
    expect(bravoPublic).toBeLessThan(bravoPriv);
  });
});

describe('the loaded-dice primitives (§H)', () => {
  it('generosityForkKey is a stable composite over (giver, receiver, kind, tick)', () => {
    expect(generosityForkKey('a', 'b', 'grain_relief', 7)).toBe('generosity:a:b:grain_relief:7');
  });
  it('loadedDraw samples the SITUATION-weighted distribution deterministically', () => {
    const rng = createPRNG('draw-seed');
    // A dominant weight is picked far more often than a tiny one; same seed ⇒ same pick.
    const counts = [0, 0, 0];
    for (let i = 0; i < 300; i++) {
      counts[loadedDraw(createPRNG(`d${i}`), `k${i}`, [10, 1, 1])] += 1;
    }
    expect(counts[0]).toBeGreaterThan(counts[1] + counts[2]); // loaded toward index 0
    // Determinism: same rng+key+weights ⇒ same index.
    expect(loadedDraw(rng, 'same', [1, 2, 3])).toBe(loadedDraw(createPRNG('draw-seed'), 'same', [1, 2, 3]));
    // A degenerate all-zero weight vector falls back to index 0 (the legal flat case).
    expect(loadedDraw(rng, 'z', [0, 0, 0])).toBe(0);
  });
  it('shouldInitiateAsk is monotone in pressure and deterministic per key', () => {
    // Over many keys, higher pressure fires at least as often (loaded rarity gate).
    let lowFires = 0;
    let highFires = 0;
    for (let i = 0; i < 400; i++) {
      if (shouldInitiateAsk(createPRNG(`ask${i}`), `k${i}`, 0.1)) lowFires += 1;
      if (shouldInitiateAsk(createPRNG(`ask${i}`), `k${i}`, 0.9)) highFires += 1;
    }
    expect(highFires).toBeGreaterThan(lowFires);
    // Determinism.
    expect(shouldInitiateAsk(createPRNG('s'), 'k', 0.5)).toBe(shouldInitiateAsk(createPRNG('s'), 'k', 0.5));
  });
});

describe('the instrument catalog (§4) + the warning-gift sacrifice price (statecraft §2.4)', () => {
  it('grain_relief + warning are LIVE this wave; purchase/credit/refuge are registered but deferred', () => {
    expect(GENEROSITY_INSTRUMENTS.grain_relief.live).toBe(true);
    expect(GENEROSITY_INSTRUMENTS.warning.live).toBe(true);
    expect(GENEROSITY_INSTRUMENTS.purchase.live).toBe(false);
    expect(GENEROSITY_INSTRUMENTS.refuge.live).toBe(false);
  });
  it("warningSacrifice prices the COST of the telling, not the value received", () => {
    expect(warningSacrifice({ strategicAdvantageSpent01: 0.9, eyesExposed01: 0.8 }))
      .toBeGreaterThan(warningSacrifice({ strategicAdvantageSpent01: 0.1, eyesExposed01: 0 }));
    expect(warningSacrifice({})).toBe(0);
  });
});

describe('dormancy gate (§6) — a virtual, defensively-read flag', () => {
  it('absent ⇒ dormant (byte-identical, no serialized default); explicit true ⇒ lit', () => {
    expect(constructiveFlowsActive(undefined)).toBe(false);
    expect(constructiveFlowsActive({})).toBe(false);
    expect(constructiveFlowsActive({ simulationRules: {} })).toBe(false);
    expect(constructiveFlowsActive({ simulationRules: { constructiveFlowsEnabled: true } })).toBe(true);
  });
});

describe('anti-vacuity — the machinery MOVES when lit', () => {
  it('different situations yield materially different verdicts (never a constant)', () => {
    const verdicts = new Set();
    // A comfortable strong-bond giver → FULL.
    verdicts.add(generosityEV({ giverId: 'a', receiverId: 'b', now: 1, bond: { kind: 'allied', strength01: 0.9 }, conscience: { good01: 0.8, lawful01: 0.8, need01: 0.9 }, margin: RICH_MARGIN, commitment: NO_COMMIT, askFraction01: 0.3 }).verdict);
    // A razor giver with an army → REFUSE.
    verdicts.add(generosityEV({ giverId: 'a', receiverId: 'b', now: 1, bond: { kind: 'allied', strength01: 0.5 }, margin: { reserveAboveFloor01: 0.05, granaryTrend01: 0.1, seasonalOutlook01: 0.1 }, commitment: { deployedArmies: 3 }, askFraction01: 1, strategy: { warStrategic01: 0 } }).verdict);
    // A leverage-minded lender → CREDIT.
    verdicts.add(generosityEV({ giverId: 'a', receiverId: 'b', now: 1, bond: { kind: 'trade_partner', strength01: 0.6 }, margin: RICH_MARGIN, commitment: NO_COMMIT, strategy: { leverage01: 0.95 }, lensMod: { leverage: 1.3 }, askFraction01: 0.4 }).verdict);
    // A thin-but-willing giver → PARTIAL.
    verdicts.add(generosityEV({ giverId: 'a', receiverId: 'b', now: 1, bond: { kind: 'allied', strength01: 0.7 }, conscience: { good01: 0.7, lawful01: 0.7, need01: 0.8 }, margin: { reserveAboveFloor01: 0.3, granaryTrend01: 0.5, seasonalOutlook01: 0.5 }, commitment: NO_COMMIT, askFraction01: 1 }).verdict);
    expect(verdicts.size).toBeGreaterThanOrEqual(3);
  });
});
