import { describe, expect, test } from 'vitest';

import {
  RULING_POWER_CAUSES,
  coupContenders,
  governingFactionOf,
  governmentLabelFor,
  resolveCoupVerdict,
  transferRulingPower,
} from '../../src/domain/rulingPower.js';
import { coupVerdictOutcomes } from '../../src/domain/worldPulse/coup.js';
import { STRESSOR_CATALOG, evaluateStressorRules } from '../../src/domain/worldPulse/stressors.js';
import { STRESSOR_COUNTERFORCES, STRESSOR_SYNERGIES } from '../../src/domain/worldPulse/stressorDynamics.js';
import { STRESSOR_SPAWN_GATES } from '../../src/domain/worldPulse/stressorGates.js';

// Deterministic rng stub: returns the queued values in order, then repeats
// the last one. Lets a test choose which side of pHold the roll lands on.
function rngOf(...values) {
  let i = 0;
  return { random: () => values[Math.min(i++, values.length - 1)] };
}

function settlementFixture(overrides = {}) {
  return {
    name: 'Oakmere',
    tier: 'town',
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: { score: 22, label: 'Legitimacy Crisis', govMultiplier: 0.6, crimMultiplier: 1.3 },
      factions: [
        { faction: 'Town Council', power: 24, category: 'government', isGoverning: true },
        { faction: 'The Garrison', power: 30, category: 'military' },
        { faction: 'Merchant Guilds', power: 26, category: 'economy' },
        { faction: 'Temple of the Flame', power: 18, category: 'religious' },
        { faction: 'Thieves Guild', power: 40, category: 'criminal' },
      ],
      factionRelationships: [
        { pair: ['Town Council', 'The Garrison'], type: 'tense', direction: 'stable', narrative: 'old friction' },
      ],
    },
    ...overrides,
  };
}

describe('coupContenders', () => {
  test('fields the top-3 non-criminal, non-governing factions by coerced weight', () => {
    const { challengers, incumbent } = coupContenders(settlementFixture());
    expect(challengers.map(c => c.name)).toEqual(['The Garrison', 'Merchant Guilds', 'Temple of the Flame']);
    // Criminal faction has the HIGHEST raw power (40) and still never appears.
    expect(challengers.some(c => c.name === 'Thieves Guild')).toBe(false);
    // Military coercion factor: 30 × 1.25 = 37.5.
    expect(challengers[0].weight).toBe(37.5);
    // Incumbent amplification: 24 × 0.6 (crisis multiplier) = 14.4 — below the
    // weakest challenger (18), so the seat's case is not even heard.
    expect(incumbent.amplifiedWeight).toBeCloseTo(14.4, 5);
    expect(incumbent.gated).toBe(false);
  });

  test('legitimacy repair re-admits the incumbent to the field (the party lever)', () => {
    const s = settlementFixture();
    // The party shored the ruler up: Tolerated legitimacy, ×1.0 multiplier.
    s.powerStructure.publicLegitimacy = { score: 50, label: 'Tolerated', govMultiplier: 1.0, crimMultiplier: 1.0 };
    const { incumbent } = coupContenders(s);
    // 24 × 1.0 = 24 >= weakest challenger weight (18) → back in the top 3.
    expect(incumbent.gated).toBe(true);
  });

  test('a thin field always admits the incumbent', () => {
    const s = settlementFixture();
    s.powerStructure.factions = s.powerStructure.factions.filter(
      f => f.isGoverning || f.faction === 'The Garrison',
    );
    expect(coupContenders(s).incumbent.gated).toBe(true);
  });
});

describe('resolveCoupVerdict', () => {
  test('an ungated incumbent falls near-certainly; winner sampled by weight', () => {
    const verdict = resolveCoupVerdict({
      settlement: settlementFixture(),
      rng: rngOf(0.5, 0.0), // 0.5 > pHold 0.08 → falls; 0.0 → heaviest challenger wins
      severity: 0.7,
      rulingAuthorityScore: 20,
    });
    expect(verdict.holds).toBe(false);
    expect(verdict.pHold).toBe(0.08);
    expect(verdict.winner.name).toBe('The Garrison');
    expect(verdict.winner.archetype).toBe('military');
  });

  test('a gated incumbent can hold the seat', () => {
    const s = settlementFixture();
    s.powerStructure.publicLegitimacy = { score: 50, label: 'Tolerated', govMultiplier: 1.0, crimMultiplier: 1.0 };
    const verdict = resolveCoupVerdict({
      settlement: s,
      rng: rngOf(0.01),
      severity: 0.5,
      rulingAuthorityScore: 55,
    });
    expect(verdict.holds).toBe(true);
    expect(verdict.pHold).toBeGreaterThan(0.1);
    expect(verdict.winner).toBeNull();
  });

  test('no challengers → the plot collapses on its own', () => {
    const s = settlementFixture();
    s.powerStructure.factions = s.powerStructure.factions.filter(f => f.isGoverning || f.category === 'criminal');
    const verdict = resolveCoupVerdict({ settlement: s, rng: rngOf(0.99), severity: 0.9 });
    expect(verdict.holds).toBe(true);
    expect(verdict.pHold).toBe(1);
  });
});

describe('transferRulingPower', () => {
  test('reshapes the governing seat to the winner-archetype government type', () => {
    const { settlement, transfer, error } = transferRulingPower(
      settlementFixture(), 'The Garrison', { cause: 'coup', tick: 7, losers: ['Merchant Guilds'] },
    );
    expect(error).toBeNull();
    expect(transfer.fromGovernment).toBe('Town Council');
    expect(transfer.toGovernment).toBe('Military Council'); // town tier, military preference
    expect(transfer.authorityArchetype).toBe('military');

    const ps = settlement.powerStructure;
    expect(ps.governingName).toBe('Military Council');
    expect(ps.government).toBe('Military Council');
    expect(ps.previousGovernments).toEqual([{ label: 'Town Council', cause: 'coup', tick: 7 }]);

    const seat = governingFactionOf(settlement);
    expect(seat.faction).toBe('Military Council');
    expect(seat.isGoverning).toBe(true);
    // The authoritative power ascends behind the seat.
    const garrison = ps.factions.find(f => f.faction === 'The Garrison');
    expect(garrison.power).toBe(36);
    expect(garrison.modifiers).toContain('ascendant');
    // Old-label relationships re-keyed; the new edges exist.
    expect(ps.factionRelationships.some(r => r.pair.includes('Town Council'))).toBe(false);
    expect(ps.factionRelationships.some(r =>
      r.pair.includes('Military Council') && r.pair.includes('The Garrison') && r.type === 'symbiotic')).toBe(true);
    expect(ps.factionRelationships.some(r =>
      r.pair.includes('Merchant Guilds') && r.type === 'competitive')).toBe(true);
  });

  test('legitimacy reseeds by cause — deposing a hated ruler starts warmer', () => {
    // Old score 22 (hated): coup seed = 38 + (50-22)*0.25 = 45 → Tolerated.
    const hated = transferRulingPower(settlementFixture(), 'The Garrison', { cause: 'coup' });
    expect(hated.settlement.powerStructure.publicLegitimacy.score).toBe(45);
    expect(hated.settlement.powerStructure.publicLegitimacy.label).toBe('Tolerated');
    expect(hated.settlement.powerStructure.publicLegitimacy.govMultiplier).toBe(1.0);

    // A merely-contested ruler (40): 38 + 2.5 = 40.5 → 41, Contested.
    const s = settlementFixture();
    s.powerStructure.publicLegitimacy = { score: 40, label: 'Contested', govMultiplier: 0.8, crimMultiplier: 1.15 };
    const contested = transferRulingPower(s, 'The Garrison', { cause: 'coup' });
    expect(contested.settlement.powerStructure.publicLegitimacy.label).toBe('Contested');

    // An election starts warmer than any coup can.
    const elected = transferRulingPower(settlementFixture(), 'Merchant Guilds', { cause: 'election' });
    expect(elected.settlement.powerStructure.publicLegitimacy.score).toBeGreaterThanOrEqual(45);
  });

  test('errors are explicit and non-destructive', () => {
    const base = settlementFixture();
    expect(transferRulingPower(base, 'No Such Faction', {}).error).toBe('faction_not_found');
    expect(transferRulingPower(base, 'Town Council', {}).error).toBe('already_governing');
    const headless = settlementFixture();
    headless.powerStructure.factions = headless.powerStructure.factions.map(f => ({ ...f, isGoverning: false }));
    headless.powerStructure.governingName = null;
    expect(transferRulingPower(headless, 'The Garrison', {}).error).toBe('no_governing_faction');
  });

  test('the DM can install criminal rule by event (the coup never offers it)', () => {
    const { transfer, error } = transferRulingPower(settlementFixture(), 'Thieves Guild', { cause: 'coup' });
    expect(error).toBeNull();
    expect(transfer.toGovernment).toBe('Corrupt City Council');
  });

  test('government labels band by tier', () => {
    expect(governmentLabelFor('military', 'hamlet')).toBe('Militia Command');
    expect(governmentLabelFor('military', 'town')).toBe('Military Council');
    expect(governmentLabelFor('military', 'metropolis')).toBe('Grand Military Council');
    expect(governmentLabelFor('religious', 'city')).toBe('High Theocratic Council');
  });

  test('exposes the full cause vocabulary', () => {
    expect(RULING_POWER_CAUSES).toEqual(['coup', 'election', 'succession', 'conquest', 'appointment']);
  });
});

describe('coup_detat catalog integration', () => {
  test('coup_detat is registered across catalog, counterforces, and synergies', () => {
    expect(STRESSOR_CATALOG.coup_detat).toBeTruthy();
    expect(STRESSOR_CATALOG.coup_detat.durationPolicy).toBe('episodic');
    expect(STRESSOR_CATALOG.coup_detat.spreadChannels).toEqual([]);
    // The gate moved with the catalog-wide generalization: every type's
    // birth gate now lives in stressorGates.js (the coup was the prototype).
    expect(typeof STRESSOR_SPAWN_GATES.coup_detat).toBe('function');
    expect(STRESSOR_SPAWN_GATES.coup_detat.requiresSnapshot).toBe(true);
    expect(STRESSOR_COUNTERFORCES.coup_detat).toBeTruthy();
    expect(STRESSOR_SYNERGIES.coup_detat.succession_void).toBeTruthy();
    expect(STRESSOR_SYNERGIES.political_fracture.coup_detat).toBeTruthy();
    expect(STRESSOR_SYNERGIES.rebellion.coup_detat).toBeTruthy();
  });

  test('the spawn gate blocks healthy seats, occupations, and challenger-less courts', () => {
    const pressure = {
      settlementId: 'oakmere', settlementName: 'Oakmere',
      kind: 'legitimacy', label: 'Legitimacy pressure', score: 0.9, reasons: ['test'],
    };
    const snapshotFor = (settlement, stressors = []) => ({
      worldState: { tick: 3, stressors },
      regionalGraph: { channels: [] },
      byId: new Map([['oakmere', { settlement, causal: { scores: { ruling_authority: 20 } } }]]),
    });
    const birthsCoup = (snapshot) =>
      evaluateStressorRules(snapshot, { get: () => null }, { tick: 4, pressures: [pressure] })
        .some(c => c.candidateType === 'stressor_birth_coup_detat');

    // Coup-ready: legitimacy crisis, weak authority, real challengers.
    expect(birthsCoup(snapshotFor(settlementFixture()))).toBe(true);

    // Tolerated legitimacy → nobody moves.
    const healthy = settlementFixture();
    healthy.powerStructure.publicLegitimacy = { score: 52, label: 'Tolerated', govMultiplier: 1.0 };
    expect(birthsCoup(snapshotFor(healthy))).toBe(false);

    // Occupation already governs at spearpoint.
    expect(birthsCoup(snapshotFor(settlementFixture(), [{
      id: 'world_stressor.occupation.oakmere', type: 'occupation', status: 'active',
      severity: 0.7, affectedSettlementIds: ['oakmere'],
    }]))).toBe(false);

    // No non-criminal challenger with real power.
    const lonely = settlementFixture();
    lonely.powerStructure.factions = lonely.powerStructure.factions.filter(
      f => f.isGoverning || f.category === 'criminal',
    );
    expect(birthsCoup(snapshotFor(lonely))).toBe(false);
  });
});

describe('coupVerdictOutcomes', () => {
  const resolvedCoup = (overrides = {}) => ({
    id: 'world_stressor.coup_detat.oakmere',
    type: 'coup_detat',
    label: "Coup d'état",
    status: 'resolved',
    severity: 0.4,
    peakSeverity: 0.7,
    originSettlementId: 'oakmere',
    affectedSettlementIds: ['oakmere'],
    originContext: { variant: 'barracks_coup' },
    ...overrides,
  });
  const snapshotFor = (settlement, save = {}) => ({
    byId: new Map([['oakmere', {
      name: settlement.name, settlement, save,
      causal: { scores: { ruling_authority: 20 } },
    }]]),
  });

  test('a fallen seat emits a power_transfer outcome with the verdict condition', () => {
    const outcomes = coupVerdictOutcomes({
      resolved: [resolvedCoup()],
      snapshot: snapshotFor(settlementFixture()),
      rng: rngOf(0.5, 0.0),
      tick: 9,
    });
    expect(outcomes).toHaveLength(1);
    const out = outcomes[0];
    expect(out.type).toBe('power_transfer');
    expect(out.candidateType).toBe('coup_succeeded');
    expect(out.applyMode).toBe('auto');
    expect(out.powerTransfer).toMatchObject({
      toPowerName: 'The Garrison', cause: 'coup', tick: 9, losers: ['Merchant Guilds', 'Temple of the Flame'],
    });
    expect(out.condition.archetype).toBe('government_overthrown');
    expect(out.metadata.verdict.holds).toBe(false);
  });

  test('a locked governing faction downgrades the transfer to a proposal', () => {
    const outcomes = coupVerdictOutcomes({
      resolved: [resolvedCoup()],
      snapshot: snapshotFor(settlementFixture(), { campaignState: { locks: { factions: ['faction.town_council'] } } }),
      rng: rngOf(0.5, 0.0),
      tick: 9,
    });
    expect(outcomes[0].applyMode).toBe('proposal');
  });

  test('a held seat emits coup_suppressed; party resolutions skip the verdict', () => {
    const s = settlementFixture();
    s.powerStructure.publicLegitimacy = { score: 50, label: 'Tolerated', govMultiplier: 1.0, crimMultiplier: 1.0 };
    const held = coupVerdictOutcomes({
      resolved: [resolvedCoup()],
      snapshot: snapshotFor(s),
      rng: rngOf(0.01),
      tick: 9,
    });
    expect(held[0].type).toBe('condition');
    expect(held[0].condition.archetype).toBe('coup_suppressed');

    const partyEnded = coupVerdictOutcomes({
      resolved: [resolvedCoup({ resolutionReason: 'Resolved by party action' })],
      snapshot: snapshotFor(s),
      rng: rngOf(0.5),
      tick: 9,
    });
    expect(partyEnded).toHaveLength(0);
  });
});
