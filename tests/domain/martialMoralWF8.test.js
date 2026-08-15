import { describe, it, expect } from 'vitest';
import {
  MORAL_INSTITUTION_LEANS, WAR_SUPPLY_CHAINS, institutionMoralLean, institutionMartialLean,
  settlementMoralConductLean, isWarSupplyResource, isStandingInstitution,
} from '../../src/domain/worldPulse/moralMartialLean.js';
import {
  warFooting01, engagement01, stepReadiness, stepExperience, rustMagnitude,
  readinessOf, experienceOf, rustOf, readinessMobilizationMult, firstTickAttritionMult,
  attritionDecayMult, effectiveStatMult, readinessValueTilt, readinessUpkeepDrag,
  readinessConductLean, settlementMartialConductLean, advanceMartialReadiness,
  MARTIAL_READINESS_TUNING,
} from '../../src/domain/worldPulse/martialReadiness.js';
import {
  moralViabilityPressure, martialViabilityPressure, stepAbolitionViability,
  martialEmergenceTilt, evaluateMoralInstitutionPressure, MORAL_PRESSURE_TUNING,
} from '../../src/domain/worldPulse/moralInstitutionPressure.js';
import { fidelityFactor, FIDELITY_TUNING } from '../../src/domain/worldPulse/fidelityNoise.js';
import { rulerLens } from '../../src/domain/worldPulse/religionLegitimacy.js';
import { applyInstitutionLifecycleOutcome } from '../../src/domain/worldPulse/institutionLifecycle.js';

const GOOD_LAWFUL = { name: 'The Lawgiver', alignmentAxis: 'good', lawAxis: 'lawful' };
const EVIL_LAWFUL = { name: 'The Iron Ledger', alignmentAxis: 'evil', lawAxis: 'lawful' };
const EVIL_CHAOTIC = { name: 'The Red Maw', alignmentAxis: 'evil', lawAxis: 'chaotic' };
const GOOD_CHAOTIC = { name: 'The Wanderer', alignmentAxis: 'good', lawAxis: 'chaotic' };

const slaveMarket = { name: 'Slave market', status: 'active' };
const fightingPit = { name: 'Fighting pits', status: 'active' };
const gambling = { name: 'Gambling hall', status: 'active' };
const almshouse = { name: 'Almshouse', status: 'active' };
const garrison = { name: 'Garrison', status: 'active' };

// ── 1. MORAL LEAN TABLE — the owner's derivation cases ─────────────────────────
describe('W-F8 moral lean table', () => {
  it('codes cruelty (+evil) and disorder (+chaos) signed leans', () => {
    expect(institutionMoralLean(slaveMarket)).toEqual({ cruelty: 0.9, disorder: -0.4 }); // ordered exploitation ⇒ LE
    expect(institutionMoralLean(fightingPit).cruelty).toBeGreaterThan(0);
    expect(institutionMoralLean(fightingPit).disorder).toBeGreaterThan(0);                // bloody + rowdy ⇒ CE
    expect(institutionMoralLean(gambling).disorder).toBeGreaterThan(0.4);                 // vice ⇒ chaotic
    expect(institutionMoralLean(almshouse).cruelty).toBeLessThan(0);                      // mercy ⇒ good
    expect(institutionMoralLean(garrison)).toBeNull();                                    // martial ≠ morally coded
    expect(institutionMoralLean({ name: 'Tavern' })).toBeNull();
  });

  it('does not derive moral or martial mechanics from current custom presentation names', () => {
    const custom = name => ({
      name,
      status: 'active',
      source: 'custom',
      isCustom: true,
      customDefinitionCategory: 'institutions',
      customDefinitionId: `definition:institutions:${name}`,
    });

    expect(institutionMoralLean(custom('Slave market'))).toBeNull();
    expect(institutionMartialLean(custom('Garrison'))).toBeNull();
    expect(settlementMoralConductLean({
      institutions: [custom('Slave market')],
    })).toEqual({ cruelty: 0, disorder: 0 });
  });

  it('the abolition/retention geometry produces the owner cases (no special-casing)', () => {
    const bleed = 0.6;
    // CG abolishes the slave market (+cruelty) but tolerates the gambling house (+disorder)
    expect(moralViabilityPressure(slaveMarket, GOOD_CHAOTIC, bleed, bleed)).toBeGreaterThan(0);   // abolish
    expect(moralViabilityPressure(gambling, GOOD_CHAOTIC, bleed, bleed)).toBeLessThanOrEqual(0);  // keep
    // LE runs the market and shutters the rowdy pit (its disorder)
    expect(moralViabilityPressure(slaveMarket, EVIL_LAWFUL, bleed, bleed)).toBeLessThanOrEqual(0); // keep
    expect(moralViabilityPressure(fightingPit, EVIL_LAWFUL, bleed, bleed)).toBeGreaterThan(0);     // shutter (law axis)
    // LG raises orderly charity, abolishes cruelty; CE keeps what bleeds
    expect(moralViabilityPressure(slaveMarket, GOOD_LAWFUL, bleed, bleed)).toBeGreaterThan(0);     // abolish
    expect(moralViabilityPressure(fightingPit, EVIL_CHAOTIC, bleed, bleed)).toBeLessThanOrEqual(0); // CE keeps
  });

  it('neutrality: neutral patron / zero bleed ⇒ pressure 0 (byte-identical)', () => {
    expect(moralViabilityPressure(slaveMarket, { alignmentAxis: 'neutral', lawAxis: 'neutral' }, 0.6, 0.6)).toBe(0);
    expect(moralViabilityPressure(slaveMarket, GOOD_LAWFUL, 0, 0)).toBe(0);
    expect(moralViabilityPressure({ name: 'Tavern' }, GOOD_LAWFUL, 0.6, 0.6)).toBe(0);
  });

  it('settlementMoralConductLean averages standing morally-coded institutions; ignores remnants', () => {
    const lean = settlementMoralConductLean({ institutions: [slaveMarket, almshouse, garrison] });
    expect(lean.cruelty).toBeCloseTo((0.9 + -0.7) / 2, 5);   // garrison excluded (not morally coded)
    expect(settlementMoralConductLean({ institutions: [{ ...slaveMarket, status: 'remnant' }] })).toEqual({ cruelty: 0, disorder: 0 });
    expect(settlementMoralConductLean({ institutions: [] })).toEqual({ cruelty: 0, disorder: 0 });
  });

  it('WAR_SUPPLY_CHAINS names the seeded war-supply resources', () => {
    for (const r of ['iron_ore', 'coal', 'weapons', 'leather', 'horses', 'timber', 'stone_quarry']) {
      expect(isWarSupplyResource(r)).toBe(true);
    }
    expect(isWarSupplyResource('wheat')).toBe(false);
    expect(isWarSupplyResource('silk')).toBe(false);
    expect(WAR_SUPPLY_CHAINS).toBeInstanceOf(RegExp);
    expect(MORAL_INSTITUTION_LEANS.length).toBeGreaterThan(5);
  });
});

// ── 2. MARTIAL READINESS — asymmetric hysteresis (the ratchet) ─────────────────
describe('W-F8 martial readiness ratchet', () => {
  it('war footing weights structural (exhaustion/occupation) over transient posture', () => {
    const brief = warFooting01({ mobilized: true });                 // one-tick mobilization
    const sustained = warFooting01({ exhaustion: 1 });               // a long deployment scar
    expect(sustained).toBeGreaterThan(brief);
    expect(warFooting01({ occupied: true })).toBeGreaterThan(brief);
    expect(warFooting01({})).toBe(0);
  });

  it('spikes fast under war, decays slow in peace (years-scale erosion, W-C1 item 4)', () => {
    // Spike: a few sustained war ticks climb readiness quickly.
    let r = 0;
    for (let i = 0; i < 4; i++) r = stepReadiness(r, 0.9, {});
    expect(r).toBeGreaterThan(0.5);
    // Decay (week tick): peacetime erosion is a YEARS-scale arc — DOWN_DECAY 0.002 ⇒
    // half-life ~346 wk ≈ 6.7 yr — NOT the old months-scale (~17 wk / ~4 mo). Halving a
    // garrison's edge takes years, not a season.
    let d = r; let half = 0;
    while (d > r / 2 && half < 2000) { d = stepReadiness(d, 0, {}); half++; }
    expect(half).toBeGreaterThan(52);    // more than a YEAR to halve (52 wk) — years scale, not seasons
    expect(half).toBeGreaterThan(250);
    expect(half).toBeLessThan(450);      // ~346 wk ≈ 6.7 yr band
    // Full demilitarization (readiness → the drop threshold) is a DECADES-scale arc.
    let e = r; let full = 0;
    while (e > 0.005 && full < 10000) { e = stepReadiness(e, 0, {}); full++; }
    expect(full).toBeGreaterThan(520);   // > a decade (52 wk × 10) to fully rust away
  });

  it('peacelike patron accelerates the peace dividend; warlike holds the edge', () => {
    const start = 0.8;
    const peacelike = stepReadiness(start, 0, { temperSign: -1, megaphoneBleed: 0.6 });
    const neutral = stepReadiness(start, 0, { temperSign: 0, megaphoneBleed: 0.6 });
    const warlike = stepReadiness(start, 0, { temperSign: 1, megaphoneBleed: 0.6 });
    expect(peacelike).toBeLessThan(neutral);   // decays faster
    expect(warlike).toBeGreaterThan(neutral);  // holds
  });

  it('readiness and experience are INDEPENDENT axes (both cases expressible)', () => {
    // ready-but-rusty: heavy past war, then a long peace.
    let R = 0; let E = 0;
    for (let i = 0; i < 6; i++) { R = stepReadiness(R, 0.9, {}); E = stepExperience(E, 1); }
    for (let i = 0; i < 10; i++) { R = stepReadiness(R, 0, {}); E = stepExperience(E, 0); }
    expect(R).toBeGreaterThan(0.4);            // readiness persists (slow decay)
    expect(E).toBeLessThan(0.2);               // experience faded (fast decay) ⇒ RUSTY
    // threadbare-but-sharp: light recent skirmishing from cold.
    let R2 = 0; let E2 = 0;
    for (let i = 0; i < 3; i++) { R2 = stepReadiness(R2, warFooting01({ mobilized: true }), {}); E2 = stepExperience(E2, engagement01({ deployed: true })); }
    expect(E2).toBeGreaterThan(0.5);           // sharp
    expect(E2 - R2).toBeGreaterThan(0.15);     // and comparatively threadbare
  });
});

// ── 3. STRATEGIC RUST — the second fidelity term ───────────────────────────────
describe('W-F8 strategic rust', () => {
  it('rust magnitude is the capped inverse of experience (degraded, never random)', () => {
    expect(rustMagnitude(0)).toBeCloseTo(MARTIAL_READINESS_TUNING.RUST_MAX_ERROR, 5);
    expect(rustMagnitude(1)).toBe(0);
    expect(rustMagnitude(0.9)).toBe(0);        // seasoned veterans ≈ 0
    expect(rustMagnitude(0.2)).toBeGreaterThan(rustMagnitude(0.6));
    expect(rustMagnitude(0)).toBeLessThanOrEqual(FIDELITY_TUNING.TOTAL_MAX);
  });

  it('rust adds error even at chaosPull 0 (lawful realm blunders its first war); rust 0 ⇒ byte-identical', () => {
    const rng = { fork: () => ({ random: () => 0.9 }) };
    const args = { rng, site: 'war_initiation', tick: 3, cid: 's1', decisionKey: 'own' };
    // Lawful patron ⇒ chaosPull 0. With rust 0, factor is exactly 1 (no rng, byte-identical).
    expect(fidelityFactor({ ...args, chaosPull: 0, rust: 0 })).toBe(1);
    // With rust > 0, it errs even though chaos is 0 — the 1914 problem.
    expect(fidelityFactor({ ...args, chaosPull: 0, rust: 0.3 })).not.toBe(1);
  });

  it('experience never CURES the chaos term (independent floors, summed then capped)', () => {
    const rng = { fork: () => ({ random: () => 1 }) };
    const args = { rng, site: 'war_initiation', tick: 3, cid: 's1', decisionKey: 'own' };
    const chaosOnly = fidelityFactor({ ...args, chaosPull: 1, rust: 0 }) - 1;
    const chaosPlusRust = fidelityFactor({ ...args, chaosPull: 1, rust: 0.3 }) - 1;
    expect(chaosPlusRust).toBeGreaterThanOrEqual(chaosOnly);   // rust only ADDS, never subtracts
    expect(chaosPlusRust).toBeLessThanOrEqual(FIDELITY_TUNING.TOTAL_MAX + 1e-9);
  });
});

// ── 4. NEUTRALITY — no record ⇒ identity everywhere (byte-identical) ───────────
describe('W-F8 neutrality theorem (no martial record ⇒ identity)', () => {
  const bare = { config: {} };
  it('every readiness reader returns the identity with no projected record', () => {
    expect(readinessOf(bare)).toBe(0);
    expect(experienceOf(bare)).toBe(1);          // ⇒ rust 0
    expect(rustOf(bare)).toBe(0);
    expect(readinessMobilizationMult(bare)).toBe(1);
    expect(readinessValueTilt(bare)).toBe(1);
    expect(readinessUpkeepDrag(bare)).toBe(1);
    expect(settlementMartialConductLean(bare)).toBe(0);
    expect(firstTickAttritionMult(0)).toBe(1);
    expect(attritionDecayMult(0)).toBe(1);
    expect(effectiveStatMult(0)).toBe(1);
    expect(rulerLens({}).moralLean).toEqual({ cruelty: 0, disorder: 0 });
    expect(rulerLens({}).martialLean).toBe(0);
  });

  it('the brakes have the correct sign', () => {
    const militarized = { config: { faithProfile: { martial: { readiness01: 0.8, footing: 0 } } } };
    expect(readinessUpkeepDrag(militarized)).toBeLessThan(1);   // brake 1: upkeep drag in peace
    expect(readinessMobilizationMult(militarized)).toBeGreaterThan(1);
    expect(firstTickAttritionMult(0.8)).toBeLessThan(1);        // gentler opening
    expect(attritionDecayMult(0.8)).toBeLessThan(1);            // slower decay
    expect(effectiveStatMult(0.8)).toBeGreaterThan(1);          // higher effective stats
    expect(readinessConductLean(0.8)).toBeGreaterThan(0);       // brake 3: warlike conduct lean
    // at war (footing 1) the upkeep drag fades — the garrison earns its keep.
    const atWar = { config: { faithProfile: { martial: { readiness01: 0.8, footing: 1 } } } };
    expect(readinessUpkeepDrag(atWar)).toBe(1);
  });
});

// ── 5. ENDOGENEITY — the standing building is drift made brick ─────────────────
describe('W-F8 endogeneity closure (moral institutions + readiness feed conduct)', () => {
  it('rulerLens carries the endogenous moral + martial leans', () => {
    const lens = rulerLens({ institutions: [slaveMarket], config: { faithProfile: { martial: { readiness01: 0.6, footing: 0 } } } });
    expect(lens.moralLean.cruelty).toBeGreaterThan(0);    // a standing slave market = cruel conduct
    expect(lens.martialLean).toBeGreaterThan(0);          // a war machine = warlike conduct
  });
});

// ── 6. VIABILITY INTEGRATOR + LIFECYCLE (arcs, not insta-demolition) ───────────
describe('W-F8 institution viability lifecycle', () => {
  it('the integrator is CLAMPED per tick (an arc): no single tick can abolish', () => {
    let v = 0;
    v = stepAbolitionViability(v, 1);   // maximal pressure
    expect(v).toBeLessThanOrEqual(MORAL_PRESSURE_TUNING.MAX_STEP + 1e-9);
    expect(v).toBeLessThan(MORAL_PRESSURE_TUNING.ABOLITION_FLOOR);   // one tick never crosses the floor
    // a reversal relaxes it.
    const relaxed = stepAbolitionViability(v, -1);
    expect(relaxed).toBeLessThan(v);
  });

  it('martial emergence tilt lifts martial gaps in a militarized town, 1 at readiness 0', () => {
    expect(martialEmergenceTilt(0)).toBe(1);
    expect(martialEmergenceTilt(0.8)).toBeGreaterThan(1);
    expect(institutionMartialLean(garrison)).not.toBeNull();
  });

  const snapshotWith = (settlement, id = 's1') => ({ settlements: [{ id, name: id, settlement }] });

  it('no patron ⇒ NO candidates (byte-identical without faith)', () => {
    const s = { institutions: [slaveMarket], config: {} };
    const out = evaluateMoralInstitutionPressure({ tick: 1, simulationRules: {} }, snapshotWith(s));
    expect(out.candidates).toEqual([]);
  });

  it('a cruel institution under a devout good patron accrues an ARC to abolition (cause-chained)', () => {
    const settlement = {
      institutions: [slaveMarket],
      config: {
        primaryDeitySnapshot: GOOD_LAWFUL,
        // a devout town: strong moral/law bleed drives the megaphone.
        faithProfile: { piety: { localMult: 1.6, realmMult: 1, composite: 1.6, moralMult: 1.6, dampener: { megaphoneLaw: 1 } } },
      },
    };
    let worldState = { tick: 0, simulationRules: {}, settlementTickStates: {} };
    let fired = null;
    for (let t = 0; t < 40 && !fired; t++) {
      const out = evaluateMoralInstitutionPressure({ ...worldState, tick: t }, snapshotWith(settlement), { tick: t });
      worldState = out.worldState;
      if (out.candidates.length) fired = out.candidates[0];
    }
    expect(fired).toBeTruthy();
    expect(fired.institutionPatch.action).toBe('abolish');
    expect(fired.ruleId).toBe('institution_moral_abolition');
    // the legibility law: the cause chain names the patron leading the abolition.
    expect(fired.reasons.join(' ')).toMatch(/Lawgiver/);
    // and it takes MANY ticks (an arc, not a decree).
    expect(worldState.settlementTickStates.s1.moralViability).toBeTruthy();
  });

  it("the 'abolish' apply path tears down a morally-coded institution (bypassing the criminal gate) but never a required one", () => {
    const outcome = { id: 'o1', institutionPatch: { action: 'abolish', name: 'Slave market', fate: 'abolished', reason: 'x' } };
    const after = applyInstitutionLifecycleOutcome({ institutions: [{ ...slaveMarket, category: 'criminal_economy' }] }, outcome);
    expect(after.institutions[0].status).toBe('remnant');
    expect(after.institutions[0]._worldPulseMorallyAbolished).toBe(true);
    // a required institution is NEVER abolished.
    const req = applyInstitutionLifecycleOutcome({ institutions: [{ ...slaveMarket, required: true }] }, outcome);
    expect(req.institutions[0].status).toBe('active');
    // a non-morally-coded institution is not touched by this path.
    const tav = applyInstitutionLifecycleOutcome({ institutions: [{ name: 'Tavern', status: 'active' }] }, { id: 'o', institutionPatch: { action: 'abolish', name: 'Tavern' } });
    expect(tav.institutions[0].status).toBe('active');
  });
});

// ── 7. advanceMartialReadiness (the kernel driver) — faith gate + war experience ─
describe('W-F8 advanceMartialReadiness driver', () => {
  it('no religionStates ⇒ null (deity-free byte-identical)', () => {
    expect(advanceMartialReadiness({ snapshot: {}, worldState: {}, religionStates: null, pietyByCid: null, priorMartial: null }).martialByCid).toBeNull();
  });

  it('materializes readiness for a mobilized faith settlement, drops it in deep peace', () => {
    const religionStates = { s1: { patronRef: 'd', deities: { d: { snapshot: EVIL_CHAOTIC } } } };
    const snapshot = { byId: new Map([['s1', { settlement: { config: { primaryDeitySnapshot: EVIL_CHAOTIC } } }]]) };
    // tick with the settlement mobilized + exhausted ⇒ readiness materializes.
    const warWS = { warPosture: { s1: { state: 'mobilized' } }, warExhaustion: { s1: 0.5 }, deployments: {}, occupations: {} };
    const out = advanceMartialReadiness({ snapshot, worldState: warWS, religionStates, pietyByCid: {}, priorMartial: null });
    expect(out.martialByCid).toBeTruthy();
    expect(out.martialByCid.s1.readiness01).toBeGreaterThan(0);
    expect(out.martialByCid.s1.causes.length).toBeGreaterThan(0);
    // in deep peace from 0, nothing materializes (byte-neutral).
    const peaceWS = { warPosture: {}, warExhaustion: {}, deployments: {}, occupations: {} };
    const peace = advanceMartialReadiness({ snapshot, worldState: peaceWS, religionStates, pietyByCid: {}, priorMartial: null });
    expect(peace.martialByCid).toBeNull();
  });
});
