/**
 * auspice.test.js — V-16 THE AUSPICE: the omen, not the promise.
 *
 * The load-bearing pin is ZERO-TRACE: reading the auspices advances a THROWAWAY
 * clone and must leave the real campaign worldState byte-identical. Plus:
 * DETERMINISM (same world ⇒ same omen), and the significance tiering.
 */
import { describe, it, expect } from 'vitest';
import { readAuspices, composeOmen } from '../../src/domain/worldPulse/auspice.js';

function fixture(name) {
  return {
    id: name.toLowerCase(), name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { primaryImports: [], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [{ faction: 'Council', category: 'governance', power: 60 }],
      conflicts: [],
    },
    npcs: [], activeConditions: [],
  };
}
function save(id) {
  return {
    id, name: id, tier: 'town', settlement: fixture(id), seed: `${id}-seed`,
    campaignState: { phase: 'canon', eventLog: [], systemState: null, canonizedAt: '2026-01-01T00:00:00.000Z' },
  };
}
function campaignOf(pendingEvents = []) {
  return {
    id: 'camp-a', name: 'Realm', settlementIds: ['ashford', 'brookmere'],
    regionalGraph: { edges: [], channels: [], queuedImpacts: [] },
    wizardNews: { currentTick: 0, entries: [] },
    worldState: { rngSeed: 'auspice-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z', pendingEvents },
  };
}
const SAVES = () => [save('ashford'), save('brookmere')];
const NOW = '2026-02-01T00:00:00.000Z';
const queuedSiege = (saveId) => ({
  queueId: `pe_${saveId}_siege`, saveId, queuedAt: '2026-01-15T00:00:00.000Z',
  event: { id: 'ev-siege', type: 'APPLY_STRESSOR', targetId: 'under_siege', payload: { stressorType: 'under_siege', label: 'Under Siege', severity: 0.8 }, cause: 'player_action' },
});

describe('V-16 THE AUSPICE', () => {
  it('ZERO-TRACE: the real campaign worldState is byte-identical before and after reading the auspices', async () => {
    const campaign = campaignOf([queuedSiege('ashford')]);
    const saves = SAVES();
    const beforeWorld = JSON.stringify(campaign.worldState);
    const beforeSaves = JSON.stringify(saves);

    await readAuspices({ campaign, saves, interval: 'one_season', now: NOW });

    // The load-bearing pin: not one byte of the real world moved.
    expect(JSON.stringify(campaign.worldState)).toBe(beforeWorld);
    expect(JSON.stringify(saves)).toBe(beforeSaves);
  });

  it('DETERMINISTIC: same world + span ⇒ the identical omen, forever', async () => {
    const a = await readAuspices({ campaign: campaignOf([queuedSiege('ashford')]), saves: SAVES(), interval: 'one_season', now: NOW });
    const b = await readAuspices({ campaign: campaignOf([queuedSiege('ashford')]), saves: SAVES(), interval: 'one_season', now: NOW });
    expect(a).toEqual(b);
  });

  it('tiers the omen by the engine news significance (major vs notable) + crossroads', () => {
    const run = {
      result: {
        wizardNews: { entries: [
          { tick: 1, headline: 'A siege tightens', kind: 'siege', scope: 'local', significance: 'major', settlementIds: ['ashford'] },
          { tick: 2, headline: 'A quiet market day', kind: 'trade', scope: 'regional', significance: 'notable', settlementIds: ['brookmere'] },
        ] },
        majors: [{ tick: 3, headline: 'The council would await your word', outcome: {} }],
      },
    };
    const omen = composeOmen(run);
    expect(omen.counts).toEqual({ major: 1, notable: 1, crossroads: 1 });
    expect(omen.major[0].headline).toBe('A siege tightens');
    expect(omen.notable[0].headline).toBe('A quiet market day');
    expect(omen.crossroads[0].headline).toMatch(/await your word/i);
  });

  it('composeOmen is total on an empty / malformed run', () => {
    expect(composeOmen(null).counts).toEqual({ major: 0, notable: 0, crossroads: 0 });
    expect(composeOmen({ result: {} }).counts).toEqual({ major: 0, notable: 0, crossroads: 0 });
  });
});
