import { describe, it, expect } from 'vitest';
import { computeGuildStrengthBy, applyGuildToSettlement } from '../../src/domain/worldPulse/thievesGuild.js';
import { GUILD_TUNING } from '../../src/domain/corruption.js';

describe('computeGuildStrengthBy — Phase 3', () => {
  it('accrues strength only from CAPTURED factions, joined to snapshot power', () => {
    const ws = { factionStates: {
      f1: { settlementId: 's1', name: 'Thieves Guild', archetype: 'criminal', captureState: 'capture' },
      f2: { settlementId: 's1', name: 'City Watch', archetype: 'military', captureState: 'corrupted' },
      f3: { settlementId: 's1', name: 'Merchants', archetype: 'merchant', captureState: 'none' }, // not captured
    } };
    const snap = { settlements: [{ id: 's1', settlement: { powerStructure: { factions: [
      { name: 'Thieves Guild', power: 60 }, { name: 'City Watch', power: 40 }, { name: 'Merchants', power: 30 },
    ] } } }] };
    const map = computeGuildStrengthBy(ws, snap);
    expect(map.get('s1')).toBeGreaterThan(0);
    expect(map.has('s2')).toBe(false);
  });

  it('returns empty when nothing is captured', () => {
    const ws = { factionStates: { f1: { settlementId: 's1', captureState: 'none' } } };
    expect(computeGuildStrengthBy(ws, { settlements: [] }).size).toBe(0);
  });
});

describe('applyGuildToSettlement — Phase 3', () => {
  it('floors the criminal faction power, hard-caps its legitimacy, leaves others alone', () => {
    const s = { powerStructure: { factions: [
      { name: "Thieves' Guild", power: 20, legitimacy: 50 },
      { name: 'City Watch', power: 70, legitimacy: 80 },
    ] } };
    const next = applyGuildToSettlement(s, 1); // max strength
    const guild = next.powerStructure.factions.find((f) => /Thieves/.test(f.name));
    const watch = next.powerStructure.factions.find((f) => /Watch/.test(f.name));
    expect(guild.power).toBeGreaterThanOrEqual(GUILD_TUNING.powerFloorBase + GUILD_TUNING.powerFloorRange - 0.01); // floored to ~85
    expect(guild.legitimacy).toBeLessThanOrEqual(GUILD_TUNING.legitimacyCap); // never legitimate
    expect(watch.power).toBe(70); // non-criminal untouched
    expect(next.thievesGuildStrength).toBe(1);
  });

  it('never lowers an already-high criminal power (floor only)', () => {
    const s = { powerStructure: { factions: [{ name: 'The Underworld', power: 95, legitimacy: 10 }] } };
    const next = applyGuildToSettlement(s, 0.5); // floor 30 + 0.5*55 = 57.5 < 95
    expect(next.powerStructure.factions[0].power).toBe(95);
  });
});
