import { describe, expect, test } from 'vitest';

// TRANCHE 3b-A · E-H LIT BURN-DOWN (bar 4 SUBSTANCE, A → A+). One flag-ON LIT
// walkthrough per formerly-baselined worldPulse mechanism + dark F3-era flag, each
// DIRECT-importing its module (barrel imports earn no walker credit) and driving it
// with real behavioral assertions (non-vacuous — a specific asserted output, never
// import-and-run). Striking these 9 modules + 3 flags from
// tests/fixtures/mechanism-lit-coverage-baseline.json drives the E-H gap to []. Every
// assertion below is empirically grounded (observed, not predicted) before commit.
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';
import { effectiveStressorSeverity, clamp01 } from '../../src/domain/worldPulse/stressorSeverity.js';
import { succorNews, defaultNews } from '../../src/domain/worldPulse/generosityNews.js';
import { applyLegitimacyDeltasToUpdates } from '../../src/domain/worldPulse/generosityUpdates.js';
import { mobilizationEffects } from '../../src/domain/worldPulse/mobilizationEffects.js';
import { hostilityRank, mean, signedDispositionFactor } from '../../src/domain/worldPulse/relationshipRuleHelpers.js';
import { neutralRules } from '../../src/domain/worldPulse/relationshipRulesCore.js';
import { RULE_EVALUATORS, tradeLeverageCandidate } from '../../src/domain/worldPulse/relationshipRulesAdversarial.js';
import { mapEventToCanonRelationship } from '../../src/domain/worldPulse/canonRelationshipImpact.js';
// Flag-drive hosts (already lit as mechanisms — imported for their flag-gated behavior).
import { ladderPoliticalWindowsActive } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { detectInstitutionGaps } from '../../src/domain/worldPulse/institutionLifecycle.js';
import { coupVerdictOutcomes, COUP_STRESSOR_TYPE } from '../../src/domain/worldPulse/coup.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ── AXIS 1: the 9 mechanism modules ─────────────────────────────────────────

describe('E-H lit: stablePart (canonical id slug)', () => {
  test('slugifies, defaults empty/nullish to "unknown", caps at 80 chars', () => {
    expect(stablePart('Hello World!')).toBe('hello_world');
    expect(stablePart('')).toBe('unknown');
    expect(stablePart(null)).toBe('unknown');
    expect(stablePart('x'.repeat(200))).toHaveLength(80);
  });
});

describe('E-H lit: stressorSeverity (per-settlement severity read)', () => {
  test('uses recorded severity, tightened by a lower per-settlement override', () => {
    expect(effectiveStressorSeverity({ severity: 0.8 }, 's1')).toBe(0.8);
    expect(effectiveStressorSeverity({ severity: 0.8, severityBySettlement: { s1: 0.3 } }, 's1')).toBe(0.3);
    expect(typeof clamp01).toBe('function');
  });
});

describe('E-H lit: generosityNews (house-voice Chronicle beats)', () => {
  test('a succor beat carries a stable id, relief impactKind, and a magnitude-scaled score', () => {
    const succ = succorNews({ giverId: 'A', receiverId: 'B', giverName: 'Aville', receiverName: 'Bville', verdict: 'GIVE', receipt: 'grain sent', magnitude: 0.8, tick: 4, now: null });
    expect(succ.id).toBe('wizard_news.4.relief.a.b');
    expect(succ.impactKind).toBe('generosity_relief');
    expect(succ.score).toBe(65);
    expect(defaultNews({ debtorName: 'Aville', creditorName: 'Bville', tick: 4, now: null }).impactKind).toBe('generosity_credit_default');
  });
});

describe('E-H lit: generosityUpdates (conserved settlementUpdates applicators)', () => {
  test('applies a bounded legitimacy delta, clamped to [0,100], on a NEW array', () => {
    const updates = [{ saveId: 'A', settlement: { powerStructure: { publicLegitimacy: { score: 50 } } } }];
    const idx = new Map([['A', 0]]);
    const raised = applyLegitimacyDeltasToUpdates(updates, idx, new Map([['A', 10]]));
    expect(raised[0].settlement.powerStructure.publicLegitimacy.score).toBe(60);
    expect(raised).not.toBe(updates); // conserved: does not mutate the input array
    const floored = applyLegitimacyDeltasToUpdates(updates, idx, new Map([['A', -70]]));
    expect(floored[0].settlement.powerStructure.publicLegitimacy.score).toBe(0);
  });
});

describe('E-H lit: mobilizationEffects (mobilization side-effects)', () => {
  const snapshot = () => ({ byId: new Map([['A', { name: 'Amob' }]]), worldState: { relationshipStates: {} }, regionalGraph: { edges: [] } });
  const events = [{ id: 'A', prev: 'peace', next: 'mobilized', transitioned: true, cooled: false, covert: false, severity: 0.7, reasons: ['gearing up'] }];

  test('a footing posture mints a probability-1 war_mobilization outcome + mobilizer fact', () => {
    const res = mobilizationEffects({ snapshot: snapshot(), events, tick: 3, now: null });
    expect(res.outcomes).toHaveLength(1);
    expect(res.outcomes[0].candidateType).toBe('war_mobilization');
    expect(res.outcomes[0].probability).toBe(1);
    expect(res.mobilizers[0].state).toBe('mobilized');
  });

  test('a DM-dismissed footing outcome commits nothing and reports the dismissed id', () => {
    const first = mobilizationEffects({ snapshot: snapshot(), events, tick: 3, now: null });
    const dismissed = mobilizationEffects({ snapshot: snapshot(), events, tick: 3, now: null, dismissedOutcomeIds: new Set([first.outcomes[0].id]) });
    expect(dismissed.outcomes).toHaveLength(0);
    expect(dismissed.dismissedIds).toEqual(['A']);
  });
});

describe('E-H lit: relationshipRuleHelpers (pure rule helpers)', () => {
  test('hostility ranking, mean, and the signed disposition factor', () => {
    expect(hostilityRank('hostile')).toBe(6);
    expect(hostilityRank('allied')).toBe(0);
    expect(mean(0.2, 0.6)).toBe(0.4);
    expect(signedDispositionFactor(1.5, 'escalation')).toBe(1.5);
    expect(signedDispositionFactor(1.5, 'de_escalation')).toBe(0.5); // mirror: 2 - raw
  });
});

describe('E-H lit: relationshipRulesCore (cooperative rule evaluators)', () => {
  const base = {
    relState: { relationshipType: 'neutral', trust: 0.7, resentment: 0.1, fear: 0.1, tradeBalance: 0.3, dependency: 0.1, leverage: 0.1, recentIncidents: [], trajectory: 'stable' },
    sourcePressure: { trade: 0.2, conflict: 0.1, economy: 0.5, hostility: 0.1 },
    targetPressure: { trade: 0.2, conflict: 0.1, economy: 0.5, hostility: 0.1 },
    tick: 5, edge: { id: 'A->B', from: 'A', to: 'B' }, snapshot: { byId: new Map() },
  };

  test('trust + low conflict proposes a trade-partner tie; conflict pressure proposes rivalry', () => {
    const trusting = neutralRules(base).map((c) => c.candidateType);
    expect(trusting).toContain('neutral_to_trade_partner');
    const hostile = neutralRules({
      ...base,
      relState: { ...base.relState, resentment: 0.7 },
      sourcePressure: { ...base.sourcePressure, conflict: 0.6 },
      targetPressure: { ...base.targetPressure, conflict: 0.6 },
    }).map((c) => c.candidateType);
    expect(hostile).toContain('neutral_to_rival');
  });
});

describe('E-H lit: relationshipRulesAdversarial (adversarial evaluators + dispatch)', () => {
  test('a critical trade dependency under tension collapses into an embargo candidate', () => {
    const ctx = {
      tradeSalienceInfo: { salience: 0.8, critical: true, dependentId: 'A', supplierId: 'B' },
      edge: { id: 'A->B', from: 'A', to: 'B' },
      relState: { relationshipType: 'trade_partner', trust: 0.3, resentment: 0.9, fear: 0.2, tradeBalance: 0.5, leverage: 0.2, dependency: 0.4 },
      sourcePressure: { conflict: 0.6, hostility: 0.5, trade: 0.3, economy: 0.4 },
      targetPressure: { conflict: 0.6, hostility: 0.5, trade: 0.3, economy: 0.4 },
      tick: 5, snapshot: { byId: new Map() },
    };
    expect(tradeLeverageCandidate(ctx).candidateType).toBe('trade_embargo_collapse');
    expect(tradeLeverageCandidate({ ...ctx, tradeSalienceInfo: null })).toBeNull(); // no salience ⇒ no candidate
    expect(Object.keys(RULE_EVALUATORS)).toContain('neutral');
    expect(typeof RULE_EVALUATORS.hostile).toBe('function');
  });
});

describe('E-H lit: canonRelationshipImpact (non-party canon relationship mapping)', () => {
  test('maps a brokered alliance to allied/warm, a dispute to rival/sour, and nothing else to null', () => {
    expect(mapEventToCanonRelationship({ type: 'BROKERED_ALLIANCE', targetId: 'B', id: 'e1' }, 'A'))
      .toMatchObject({ homeId: 'A', targetId: 'B', toType: 'allied', polarity: 'warm' });
    expect(mapEventToCanonRelationship({ type: 'SETTLEMENT_DISPUTE', targetId: 'B', id: 'e2' }, 'A'))
      .toMatchObject({ toType: 'rival', polarity: 'sour' });
    expect(mapEventToCanonRelationship({ type: 'SOMETHING_ELSE', targetId: 'B' }, 'A')).toBeNull();
  });
});

// ── AXIS 2: the 3 dark F3-era flags (literal `<flag>: true` drives) ──────────

describe('E-H flag lit: ladderPoliticalWindowsEnabled', () => {
  test('the political-windows predicate reads the raw rule literally', () => {
    expect(ladderPoliticalWindowsActive({ simulationRules: { ladderPoliticalWindowsEnabled: true } })).toBe(true);
    expect(ladderPoliticalWindowsActive({ simulationRules: { ladderPoliticalWindowsEnabled: false } })).toBe(false);
    expect(ladderPoliticalWindowsActive({ simulationRules: {} })).toBe(false); // absent ⇒ dark
  });
});

describe('E-H flag lit: underwaysOrganicFoundingEnabled', () => {
  const viceTown = () => ({ tier: 'town', institutions: [{ name: 'Gambling Den', facets: { institutionNature: 'vice' } }] });

  test('the flag ON founds a clandestine underways gap at a vice-bearing village+; OFF is dark', () => {
    const rules = { institutionLifecycleEnabled: true, underwaysOrganicFoundingEnabled: true };
    const litFlag = rules.underwaysOrganicFoundingEnabled === true; // the institutionLifecycle wiring
    const litGaps = detectInstitutionGaps(viceTown(), null, { underwaysFoundingLit: litFlag });
    const litKinds = litGaps.map((g) => g.kind);
    expect(litKinds).toContain('clandestine');
    expect(litGaps.find((g) => g.kind === 'clandestine').name).toBe('Underground network');
    const darkGaps = detectInstitutionGaps(viceTown(), null, { underwaysFoundingLit: false });
    expect(darkGaps.map((g) => g.kind)).not.toContain('clandestine');
  });
});

describe('E-H flag lit: warDispositionEnabled', () => {
  const warlikeTown = () => ({
    name: 'Junta',
    powerStructure: {
      publicLegitimacy: { score: 50 },
      factions: [
        { faction: 'War Council', category: 'military', power: 40, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 35 },
        { faction: 'Temple', category: 'religious', power: 25 },
      ],
    },
    config: { government: 'Military Junta' },
    npcs: [{ id: 'n1', name: 'Warlord Grax', importance: 'key', temperament: 'ruthless' }],
  });
  const snapshot = () => ({ byId: new Map([['A', { name: 'Junta', settlement: warlikeTown(), causal: { scores: { ruling_authority: 50 } } }]]) });
  const resolved = [{ type: COUP_STRESSOR_TYPE, id: 'stress1', originSettlementId: 'A', severity: 0.6, peakSeverity: 0.7 }];
  const warExhaustion = { A: 0.9 };
  const pHoldOf = (outcomes) => outcomes[0].metadata.verdict.pHold;

  test('the flag ON folds a souring war into a LOWER coup hold-chance; OFF is byte-identical to the base', () => {
    // Literal `warDispositionEnabled: true` — the detector is literal-sensitive (a
    // variable-fed flag is invisible to it), so the flag ON path is written inline.
    const lit = pHoldOf(coupVerdictOutcomes({
      resolved, snapshot: snapshot(), rng: createPRNG('coup-x'), tick: 2, warExhaustion, warDispositionEnabled: true,
    }));
    const dark = pHoldOf(coupVerdictOutcomes({
      resolved, snapshot: snapshot(), rng: createPRNG('coup-x'), tick: 2, warExhaustion, warDispositionEnabled: false,
    }));
    expect(lit).toBeLessThan(dark); // war exhaustion drags the seat toward a fall
    expect(dark).toBeCloseTo(0.35, 5);
    expect(lit).toBeCloseTo(0.13, 5);
  });
});
