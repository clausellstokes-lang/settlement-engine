/**
 * livingWorldSignals.test.js — the pure living-world signal MODEL behind the
 * Library card pips (UX overhaul Phase 3).
 *
 * Pins the sacred SELF-GATING invariant: a peaceful, non-campaign, deity-free
 * settlement yields `hasLiveWorld === false` (so the row renders nothing and the
 * card looks exactly as today), while a war / deity / campaign settlement lights
 * up. Also pins the health pip + "needs attention" derivation and the aggression
 * dead-band gate.
 */

import { describe, it, expect } from 'vitest';
import {
  settlementSignals,
  healthPip,
  needsAttention,
  faithPip,
  aggressionChip,
} from '../../src/components/settlements/livingWorldSignals.js';

// A plausibly-peaceful, deity-free town with a stable economy.
const peacefulTown = {
  id: 's-peace',
  name: 'Greenhollow',
  tier: 'town',
  economicState: { prosperity: 'Comfortable' },
  config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
  powerStructure: { factions: [{ faction: 'Town Council', power: 100 }] },
};

const warlikeDeity = {
  name: 'Karthok',
  alignmentAxis: 'evil',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  _deityRef: 'deity:Karthok',
};

describe('settlementSignals — self-gating', () => {
  it('peaceful, non-campaign, deity-free → hasLiveWorld is false (byte-identical card)', () => {
    const model = settlementSignals({
      settlement: peacefulTown,
      settlementId: 's-peace',
      worldState: null,
      regionalGraph: null,
    });
    expect(model.hasLiveWorld).toBe(false);
    expect(model.war).toBeNull();
    expect(model.faith).toBeNull();
    expect(model.warWeary).toBeNull();
    expect(model.standing).toBeNull();
    // Even if aggressiveness diverged, it is suppressed when the row is closed.
    expect(model.aggression).toBeNull();
  });

  it('an assigned deity alone opens the row (faith pip present)', () => {
    const model = settlementSignals({
      settlement: { ...peacefulTown, config: { ...peacefulTown.config, primaryDeitySnapshot: warlikeDeity } },
      settlementId: 's-peace',
      worldState: null,
    });
    expect(model.hasLiveWorld).toBe(true);
    expect(model.faith?.name).toBe('Karthok');
    expect(model.faith?.rank).toBe('major');
  });

  it('live war status (besieged) opens the row', () => {
    const worldState = {
      deployments: { 's-enemy': { targetId: 's-peace', sinceTick: 2, role: 'siege' } },
    };
    const model = settlementSignals({
      settlement: peacefulTown,
      settlementId: 's-peace',
      worldState,
      regionalGraph: null,
      nameFor: (id) => (id === 's-enemy' ? 'Ironhold' : String(id)),
    });
    expect(model.hasLiveWorld).toBe(true);
    expect(model.war?.besiegedBy).toContain('s-enemy');
    expect(model.names.besiegedBy).toContain('Ironhold');
  });

  it('a war-exhaustion scar opens the row (war-weary pip)', () => {
    const worldState = { warExhaustion: { 's-peace': 0.5 } };
    const model = settlementSignals({ settlement: peacefulTown, settlementId: 's-peace', worldState });
    expect(model.hasLiveWorld).toBe(true);
    expect(model.warWeary?.band).toBe('war-weary');
  });

  it('a disposition W/L record opens the row', () => {
    const worldState = { dispositionStats: { 's-peace': { wins: 3, losses: 1, score: 2 } } };
    const model = settlementSignals({ settlement: peacefulTown, settlementId: 's-peace', worldState });
    expect(model.hasLiveWorld).toBe(true);
    expect(model.standing).toEqual({ id: 's-peace', wins: 3, losses: 1, score: 2 });
  });

  it('occupation WITHOUT an active siege still marks war.occupied (front torn down by conquest)', () => {
    // Conquest deletes the siege front, so settlementWarStatus goes null — but the
    // occupation ledger persists across ticks. The Occupied pip must survive that.
    const worldState = {
      deployments: {},                              // no live front
      occupations: { 's-peace': { occupierId: 's-enemy' } },
    };
    const model = settlementSignals({
      settlement: peacefulTown,
      settlementId: 's-peace',
      worldState,
      nameFor: (id) => (id === 's-enemy' ? 'Ironhold' : String(id)),
    });
    expect(model.hasLiveWorld).toBe(true);
    expect(model.war?.occupied).toBe(true);
    expect(model.war?.besiegedBy).toEqual([]);      // not currently besieged
  });

  it('a peaceful campaign settlement with no occupation stays off (byte-identical)', () => {
    const worldState = { deployments: {}, occupations: {} };
    const model = settlementSignals({ settlement: peacefulTown, settlementId: 's-peace', worldState });
    expect(model.war).toBeNull();
  });
});

describe('faithPip — alignment color + rank', () => {
  it('reads alignmentAxis / rankAxis (never legacy tier/alignment)', () => {
    expect(faithPip({ config: { primaryDeitySnapshot: warlikeDeity } })).toMatchObject({
      name: 'Karthok', rank: 'major', color: '#8b1a1a',
    });
  });
  it('null for a deity-free settlement', () => {
    expect(faithPip(peacefulTown)).toBeNull();
  });
});

describe('aggressionChip — dead-band gate', () => {
  it('exactly 1.0 (the byte-identity anchor) yields no chip', () => {
    expect(aggressionChip(1.0)).toBeNull();
  });
  it('inside the even-handed dead-band yields no chip', () => {
    expect(aggressionChip(1.0)).toBeNull();
    expect(aggressionChip(0.99)).toBeNull();
  });
  it('belligerent / pacifist ends produce a chip', () => {
    expect(aggressionChip(1.3)?.label).toBe('Belligerent');
    expect(aggressionChip(0.7)?.label).toBe('Pacifist');
  });
});

describe('healthPip + needsAttention', () => {
  it('derives a band from the settlement (always available, like ReadSystemStateBar)', () => {
    const pip = healthPip(peacefulTown);
    expect(pip).not.toBeNull();
    expect(['Stable', 'Strained', 'Vulnerable', 'Critical']).toContain(pip.band);
    expect(typeof pip.severity).toBe('number');
  });

  it('a high-threat, depleted, conflict-ridden settlement needs attention', () => {
    const crisis = {
      id: 's-crisis',
      config: { monsterThreat: 'plagued', nearbyResourcesState: { iron: 'depleted', timber: 'depleted' }, tradeRouteAccess: 'isolated' },
      economicState: { prosperity: 'Struggling' },
      powerStructure: { factions: [{}, {}, {}, {}, {}], conflicts: [{}, {}, {}] },
      stressors: [{ type: 'siege' }, { type: 'famine' }, { type: 'plague' }],
    };
    expect(needsAttention(crisis)).toBe(true);
  });

  it('null settlement → no pip, not needing attention', () => {
    expect(healthPip(null)).toBeNull();
    expect(needsAttention(null)).toBe(false);
  });
});
