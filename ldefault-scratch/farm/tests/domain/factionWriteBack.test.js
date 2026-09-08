/**
 * tests/domain/factionWriteBack.test.js — Wave 7 #2 pins.
 *
 * The dossier stops lying: world-pulse faction outcomes (capture rung,
 * momentum, rivalries, institution control) are projected back onto
 * settlement.powerStructure.factions, which until now stayed
 * generation-frozen for the whole campaign.
 *
 * Discipline (same as the R3 neighbourNetwork write-back): identity no-op
 * when nothing moved, per-entry provenance stamp (updatedByPulse tick), and
 * quiet/empty live state never materialized as field noise.
 */

import { describe, it, expect } from 'vitest';
import {
  projectFactionStatesOntoSettlement,
  factionMomentumBand,
} from '../../src/domain/worldPulse/factionCompetition.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

function rosterSettlement() {
  return {
    name: 'Projection Town',
    tier: 'town',
    population: 1500,
    institutions: [{ name: 'Market square' }],
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Tolerated' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 70, isGoverning: true },
        { faction: 'Temple Wardens', category: 'religious', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

function liveStates({ momentum = 0, captureState = 'none', rivals = [], controlled = [], suppressed = [] } = {}) {
  return {
    'a:merchant_league': {
      factionId: 'a:merchant_league',
      settlementId: 'a',
      name: 'Merchant League',
      archetype: 'merchant',
      governmentPreference: 'merchant_charter',
      powerBases: ['wealth', 'trade_connectivity', 'debt'],
      lawPreferences: ['contract_priority', 'tariff_control', 'debt_enforcement'],
      internalSeats: { leader_champion: null, lieutenant_operator: null, agent_protege: null },
      legitimacyClaim: 0.3,
      riskTolerance: 0.4,
      momentum,
      exhaustion: 0,
      captureState,
      rivals,
      controlledInstitutions: controlled,
      suppressedInstitutions: suppressed,
      lastActedTick: null,
      recentAction: null,
    },
    'a:temple_wardens': {
      factionId: 'a:temple_wardens',
      settlementId: 'a',
      name: 'Temple Wardens',
      archetype: 'religious',
      governmentPreference: 'temple_authority',
      powerBases: ['religious_authority', 'healing_capacity', 'moral_legitimacy'],
      lawPreferences: ['temple_privilege', 'moral_codes', 'tithe_rights'],
      internalSeats: { leader_champion: null, lieutenant_operator: null, agent_protege: null },
      legitimacyClaim: 0.3,
      riskTolerance: 0.3,
      momentum: 0,
      exhaustion: 0,
      captureState: 'none',
      rivals: [],
      controlledInstitutions: [],
      suppressedInstitutions: [],
      lastActedTick: null,
      recentAction: null,
    },
  };
}

describe('factionMomentumBand', () => {
  it('maps the relaxing scalar to stable qualitative bands', () => {
    expect(factionMomentumBand(0)).toBe('quiet');
    expect(factionMomentumBand(0.2)).toBe('stirring');
    expect(factionMomentumBand(0.4)).toBe('mobilized');
    expect(factionMomentumBand(0.8)).toBe('surging');
    expect(factionMomentumBand(undefined)).toBe('quiet');
  });
});

describe('projectFactionStatesOntoSettlement', () => {
  it('projects live capture/momentum/rivals/institutions with provenance', () => {
    const settlement = rosterSettlement();
    const states = liveStates({
      momentum: 0.6,
      captureState: 'corrupted',
      rivals: ['a:temple_wardens'],
      controlled: ['market_square'],
      suppressed: ['shrine'],
    });
    const next = projectFactionStatesOntoSettlement(settlement, states, 'a', { tick: 7 });
    expect(next).not.toBe(settlement);
    const merchant = next.powerStructure.factions.find(f => f.faction === 'Merchant League');
    expect(merchant.captureState).toBe('corrupted');
    expect(merchant.momentumBand).toBe('surging');
    expect(merchant.rivals).toEqual(['Temple Wardens']); // ids resolved to names
    expect(merchant.controlledInstitutions).toEqual(['market_square']);
    expect(merchant.suppressedInstitutions).toEqual(['shrine']);
    expect(merchant.updatedByPulse).toBe(7);
    // The roster is the live POWER source — projection never touches power.
    expect(merchant.power).toBe(70);
    // The quiet faction was not stamped.
    const temple = next.powerStructure.factions.find(f => f.faction === 'Temple Wardens');
    expect(temple).toBe(settlement.powerStructure.factions[1]);
  });

  it('is an identity no-op when nothing moved (same reference back)', () => {
    const settlement = rosterSettlement();
    const states = liveStates(); // all quiet
    expect(projectFactionStatesOntoSettlement(settlement, states, 'a', { tick: 3 })).toBe(settlement);

    // And once a change has been projected, re-projecting the SAME live state
    // returns the projected settlement untouched (no provenance churn).
    const moved = liveStates({ momentum: 0.6, captureState: 'corrupted', rivals: ['a:temple_wardens'] });
    const projected = projectFactionStatesOntoSettlement(settlement, moved, 'a', { tick: 7 });
    expect(projectFactionStatesOntoSettlement(projected, moved, 'a', { tick: 8 })).toBe(projected);
    expect(projected.powerStructure.factions[0].updatedByPulse).toBe(7);
  });

  it('does not materialize quiet/empty live state as field noise', () => {
    const settlement = rosterSettlement();
    const states = liveStates();
    const next = projectFactionStatesOntoSettlement(settlement, states, 'a', { tick: 1 });
    expect(next).toBe(settlement);
    expect('captureState' in settlement.powerStructure.factions[0]).toBe(false);
    expect('momentumBand' in settlement.powerStructure.factions[0]).toBe(false);
    expect('rivals' in settlement.powerStructure.factions[0]).toBe(false);
  });

  it('updates a previously projected field back toward quiet (wind-down is visible)', () => {
    const settlement = rosterSettlement();
    settlement.powerStructure.factions[0] = {
      ...settlement.powerStructure.factions[0],
      captureState: 'corrupted',
      momentumBand: 'surging',
      updatedByPulse: 7,
    };
    const next = projectFactionStatesOntoSettlement(settlement, liveStates(), 'a', { tick: 12 });
    const merchant = next.powerStructure.factions[0];
    expect(merchant.captureState).toBe('none');
    expect(merchant.momentumBand).toBe('quiet');
    expect(merchant.updatedByPulse).toBe(12);
  });
});

describe('advanceCampaignWorld — pulse write-back integration', () => {
  it('a pulse projects the live faction state into settlementUpdates with provenance', () => {
    const saves = [{
      id: 'a',
      name: 'Projection Town',
      phase: 'canon',
      settlement: rosterSettlement(),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    const campaign = {
      id: 'writeback',
      name: 'Write-back Region',
      settlementIds: ['a'],
      worldState: {
        rngSeed: 'writeback-seed',
        tick: 0,
        stressors: [],
        factionStates: liveStates({
          momentum: 0.8,
          captureState: 'corrupted',
          rivals: ['a:temple_wardens'],
          controlled: ['market_square'],
        }),
      },
      regionalGraph: ensureRegionalGraph({ channels: [] }),
      wizardNews: { currentTick: 0, entries: [] },
    };

    const result = advanceCampaignWorld({
      campaign,
      saves,
      interval: 'one_month',
      now: '2026-06-11T00:00:00.000Z',
    });

    const update = result.settlementUpdates.find(u => String(u.saveId) === 'a');
    expect(update).toBeTruthy();
    const merchant = update.settlement.powerStructure.factions.find(f => f.faction === 'Merchant League');
    // The roster mirrors the LIVE state the pulse ended on — whatever this
    // tick's relaxation/recovery rolls left it at.
    const live = result.worldState.factionStates['a:merchant_league'];
    expect(merchant.captureState).toBe(live.captureState || 'none');
    expect(merchant.momentumBand).toBe(factionMomentumBand(live.momentum));
    expect(merchant.rivals).toEqual(['Temple Wardens']);
    expect(merchant.controlledInstitutions).toEqual(['market_square']);
    expect(merchant.updatedByPulse).toBe(result.worldState.tick);
    // Power stays the roster's own (possibly guild-floored) value, never a
    // projection artifact.
    expect(Number.isFinite(merchant.power)).toBe(true);
  });
});
