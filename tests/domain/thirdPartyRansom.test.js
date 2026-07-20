import { describe, it, expect } from 'vitest';
import {
  thirdPartyRansomActive, THIRD_PARTY_RANSOM_TUNING,
  hasRefusingTrait, hasAcceptingTrait, payerRefuseProbability, payerCompromiseProbability,
  resolveThirdPartyRansom, persistThirdPartyLedgers,
} from '../../src/domain/roads/thirdPartyRansom.js';
import { CORRUPTIBLE_FLAWS } from '../../src/domain/corruption.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const FLAWS = CORRUPTIBLE_FLAWS;

/** A minimal captive npc. */
function captive({ dominant = '', flaw = '' } = {}) {
  return { name: 'Cap', personality: { dominant, flaw }, importance: 'notable' };
}

/** A worldState with a ladder ledger for friend detection + obligations. */
function ws({ ladder = {}, obligations = {}, rules = { thirdPartyRansomEnabled: true } } = {}) {
  return { simulationRules: rules, spatialLedgers: { npcLadder: ladder, obligations } };
}

describe('D-5 thirdPartyRansomActive (the virtual flag)', () => {
  it('reads === true defensively; absent ⇒ dark', () => {
    expect(thirdPartyRansomActive(ws())).toBe(true);
    expect(thirdPartyRansomActive({ simulationRules: {} })).toBe(false);
    expect(thirdPartyRansomActive(null)).toBe(false);
    expect(thirdPartyRansomActive({ simulationRules: { thirdPartyRansomEnabled: 'yes' } })).toBe(false);
  });
});

describe('D-5 trait reads', () => {
  it('refusing traits: proud/loyal/principled/zealous/pious', () => {
    expect(hasRefusingTrait(captive({ dominant: 'proud' }))).toBe(true);
    expect(hasRefusingTrait(captive({ flaw: 'zealous' }))).toBe(true);
    expect(hasRefusingTrait(captive({ dominant: 'pragmatic' }))).toBe(false);
  });
  it('accepting traits: pragmatic/ambitious/opportunistic OR a corruptible flaw', () => {
    expect(hasAcceptingTrait(captive({ dominant: 'pragmatic' }), FLAWS)).toBe(true);
    expect(hasAcceptingTrait(captive({ flaw: 'greedy' }), FLAWS)).toBe(true); // greedy ∈ CORRUPTIBLE_FLAWS
    expect(hasAcceptingTrait(captive({ dominant: 'proud' }), FLAWS)).toBe(false);
  });
});

describe('D-5 payerRefuseProbability (§9)', () => {
  const base = { servedFraction: 0, corruptibleFlaws: FLAWS };
  it("a friend's coin is rarely refused; a rival's often", () => {
    const friend = payerRefuseProbability({ ...base, motive: 'friendship', npc: captive() });
    const lever = payerRefuseProbability({ ...base, motive: 'leverage', npc: captive() });
    expect(friend).toBeLessThan(lever);
    expect(friend).toBeCloseTo(0.05, 5); // 0.02 base clamped up to REFUSE_MIN
  });
  it('a proud captive refuses a leverage coin far more', () => {
    const proud = payerRefuseProbability({ ...base, motive: 'leverage', npc: captive({ dominant: 'proud' }) });
    const pragmatic = payerRefuseProbability({ ...base, motive: 'leverage', npc: captive({ dominant: 'pragmatic' }) });
    expect(proud).toBeGreaterThan(pragmatic);
    expect(proud).toBeCloseTo(0.85, 5); // 0.55 + 0.30
  });
  it('a long chain (servedFraction) humbles — refusal drops', () => {
    const fresh = payerRefuseProbability({ ...base, motive: 'succor_unbonded', npc: captive({ dominant: 'proud' }) });
    const long = payerRefuseProbability({ motive: 'succor_unbonded', npc: captive({ dominant: 'proud' }), servedFraction: 1, corruptibleFlaws: FLAWS });
    expect(long).toBeLessThan(fresh);
  });
});

describe('D-5 payerCompromiseProbability (§9 outcome fork)', () => {
  it('leverage + corruptible flaw + accepting trait is the widest doorway (clamped 0.5)', () => {
    const p = payerCompromiseProbability({ motive: 'leverage', npc: captive({ flaw: 'greedy' }), acceptedViaTrait: true, corruptibleFlaws: FLAWS });
    expect(p).toBeCloseTo(0.5, 5); // 0.18 × 1.6 × 1.6 × 1.4 = 0.645 → clamp 0.5
  });
  it("a friend's ransom binds by gratitude — compromise is low even for the flawed", () => {
    const friend = payerCompromiseProbability({ motive: 'friendship', npc: captive({ flaw: 'greedy' }), acceptedViaTrait: true, corruptibleFlaws: FLAWS });
    expect(friend).toBeLessThanOrEqual(0.15 + 1e-9); // 0.18 × 1.6 × 0.3 × 1.4 ≈ 0.121
  });
  it('a zealous/principled captive resists (flawFactor 0.4)', () => {
    const zealous = payerCompromiseProbability({ motive: 'succor_unbonded', npc: captive({ dominant: 'zealous' }), acceptedViaTrait: false, corruptibleFlaws: FLAWS });
    expect(zealous).toBeCloseTo(0.18 * 0.4 * 1.0 * 1.0, 5);
  });
});

const graphAlly = { edges: [{ from: 'home', to: 'payer', relationshipType: 'ally' }] };
const graphRival = { edges: [{ from: 'home', to: 'payer', relationshipType: 'rival' }] };
const settlements = {
  home: { id: 'home' },
  payer: { id: 'payer', powerStructure: { factions: [{ isGoverning: true, archetype: 'militarist_expansion' }] } },
};
const ransomRec = { id: 'ransom.r1', homeId: 'home', captorId: 'captor', npcKey: 'home::cap::0', willConvert: false };

function resolveArgs(overrides = {}) {
  return {
    ransom: ransomRec, captiveNpc: captive(), w: 0.4, servedFraction: 0.5,
    graph: graphAlly, worldState: ws(), settlementOf: (id) => settlements[id],
    candidateIds: ['home', 'payer', 'captor'], rngSeed: 'seed', memoryWeaveLit: false,
    corruptibleFlaws: FLAWS, ...overrides,
  };
}

describe('D-5 resolveThirdPartyRansom (§9 the checkpoint)', () => {
  it('an ally payer is found ⇒ succor_ally, resolves debt or refused (never compromised for a flaw-neutral)', () => {
    const d = resolveThirdPartyRansom(resolveArgs());
    expect(d.payerId).toBe('payer');
    expect(d.payerMotive).toBe('succor_ally');
    expect(['debt', 'refused']).toContain(d.action);
  });

  it('no qualifying payer ⇒ action none', () => {
    const d = resolveThirdPartyRansom(resolveArgs({ graph: { edges: [{ from: 'home', to: 'payer', relationshipType: 'neutral' }] } }));
    expect(d.action).toBe('none');
    expect(d.payerId).toBeNull();
  });

  it('the captor gate: a payer at war with the captor cannot deal', () => {
    const graphWar = { edges: [{ from: 'home', to: 'payer', relationshipType: 'ally' }], channels: [{ type: 'war_front', status: 'confirmed', from: 'payer', to: 'captor' }] };
    const d = resolveThirdPartyRansom(resolveArgs({ graph: graphWar }));
    // payer is at open war with captor ⇒ skipped ⇒ no candidate.
    expect(d.action).toBe('none');
  });

  it('a predatory rival is a LEVERAGE payer', () => {
    const d = resolveThirdPartyRansom(resolveArgs({ graph: graphRival, captiveNpc: captive({ flaw: 'greedy' }) }));
    expect(d.payerMotive).toBe('leverage');
    expect(['debt', 'compromised', 'refused']).toContain(d.action);
  });

  it('captor precedence: a latched captor leash forces DEBT (never compromised)', () => {
    // a flawed captive who would otherwise risk compromise, but willConvert already latched.
    const d = resolveThirdPartyRansom(resolveArgs({
      ransom: { ...ransomRec, willConvert: true }, graph: graphRival, captiveNpc: captive({ flaw: 'greedy' }),
    }));
    if (d.action !== 'refused') expect(d.action).toBe('debt');
  });

  it('a friend payer (memoryWeave) forms a gratitude bond target and biases to debt', () => {
    const ladder = { payer: { npcs: { 'payer::gov::0': { bonds: { 'home::cap::0': { sev: 0.6, week: 1, kind: 'friendship' } } } } } };
    const d = resolveThirdPartyRansom(resolveArgs({
      worldState: ws({ ladder }), memoryWeaveLit: true, captiveNpc: captive({ flaw: 'greedy' }),
    }));
    expect(d.payerMotive).toBe('friendship');
    if (d.action !== 'refused') {
      expect(d.action).toBe('debt'); // gratitude motive mult 0.3 keeps compromise ≤0.12; the seeded roll lands debt
      expect(d.gratitudeBond).toEqual({ targetNpcKey: 'payer::gov::0', targetSid: 'payer', sev: THIRD_PARTY_RANSOM_TUNING.GRATITUDE_BOND_SEV });
    }
  });

  it('the DEBT outcome reports the obligation magnitude scaled by importance', () => {
    // force a debt via an ally, flaw-neutral captive.
    const d = resolveThirdPartyRansom(resolveArgs({ w: 1.0 }));
    if (d.action === 'debt') {
      expect(d.obligationMag).toBeCloseTo(0.5, 5); // OBLIGATION_SCALE 0.5 × 1.0
      expect(d.predatory).toBe(false);
    }
  });
});

describe('D-5 persistThirdPartyLedgers (deposit ledgers, drop-when-empty)', () => {
  it('no deposits ⇒ byte-identical (worldState unchanged, changed=false)', () => {
    const w0 = ws();
    const { worldState, changed } = persistThirdPartyLedgers(w0, { ransomSettlements: [], bondEvents: [] }, 10);
    expect(changed).toBe(false);
    expect(worldState).toBe(w0);
  });

  it('a debt deposit lands in roadsRansomSettlements; a bond deposit in roadsBondEvents', () => {
    const w0 = ws();
    const { worldState, changed } = persistThirdPartyLedgers(w0, {
      ransomSettlements: [{ homeId: 'home', payerId: 'payer', magnitude: 0.3, predatory: false }],
      bondEvents: [{ homeId: 'home', captiveNpcKey: 'home::cap::0', targetNpcKey: 'payer::gov::0', targetSid: 'payer', sev: 0.5 }],
    }, 10);
    expect(changed).toBe(true);
    const settle = getSpatialLedger(worldState, 'roadsRansomSettlements');
    expect(settle['home|payer|10']).toEqual({ homeId: 'home', payerId: 'payer', magnitude: 0.3, predatory: false, week: 10 });
    const bonds = getSpatialLedger(worldState, 'roadsBondEvents');
    expect(bonds['home|home::cap::0|payer|payer::gov::0|10']).toMatchObject({ targetSid: 'payer', sev: 0.5, week: 10 });
  });

  it('prior deposits are dropped (consume-once): a tick with no new deposits clears the ledger', () => {
    const w0 = { simulationRules: { thirdPartyRansomEnabled: true }, spatialLedgers: { roadsRansomSettlements: { 'home|payer|9': { homeId: 'home', payerId: 'payer', magnitude: 0.3, week: 9 } } } };
    const { worldState, changed } = persistThirdPartyLedgers(w0, { ransomSettlements: [], bondEvents: [] }, 10);
    expect(changed).toBe(true);
    expect(getSpatialLedger(worldState, 'roadsRansomSettlements')).toBeUndefined();
  });
});
