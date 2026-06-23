import { describe, expect, test } from 'vitest';

import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// Byte-identity gate for the per-settlement derivation cache added to
// buildWorldSnapshot. advanceCampaignWorld rebuilds the snapshot up to ~9x per
// tick; the cache memoizes the settlement-only derivations (causal / system /
// activeConditions) on the settlement object IDENTITY. Because settlements are
// immutable within a tick (copy-on-write ⇒ a changed settlement is a NEW ref),
// the cache must:
//   (1) produce BYTE-IDENTICAL (deep-equal) snapshot output across rebuilds,
//   (2) HIT for an UNCHANGED settlement (same ref ⇒ reused derived objects),
//   (3) MISS for a MUTATED settlement (new ref ⇒ freshly derived objects that
//       reflect the change — never stale).

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: patch.institutions || [],
    economicState: {
      prosperity: patch.prosperity || 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function campaignFor(saves, extra = {}) {
  return {
    id: 'snapshot-cache-fixture',
    name: 'Snapshot Cache Fixture',
    settlementIds: saves.map(s => s.id),
    worldState: { rngSeed: 'snap-seed', tick: 7, simulationRules: {} },
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
    ...extra,
  };
}

function fixtureSaves() {
  return [
    save('alpha', 'Alphaton', { exports: ['Grain'], imports: ['Iron Ore'] }),
    save('beta', 'Betaburg', { exports: ['Iron Ore'], imports: ['Grain'], legitimacy: 40 }),
    save('gamma', 'Gammahold', {
      tier: 'city',
      population: 50000,
      activeConditions: [{ archetype: 'famine', severity: 70 }],
    }),
  ];
}

describe('buildWorldSnapshot — per-settlement derivation cache', () => {
  test('two rebuilds on the same inputs are deep-equal (byte-identical content)', () => {
    const saves = fixtureSaves();
    const campaign = campaignFor(saves);

    const a = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const b = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });

    // Whole-snapshot deep equality is the byte-identity oracle.
    expect(b.settlements).toEqual(a.settlements);
    expect(b.settlements.map(s => s.causal)).toEqual(a.settlements.map(s => s.causal));
    expect(b.settlements.map(s => s.system)).toEqual(a.settlements.map(s => s.system));
    expect(b.settlements.map(s => s.activeConditions)).toEqual(a.settlements.map(s => s.activeConditions));
  });

  test('cache HIT: an unchanged settlement reuses the SAME derived object references across rebuilds', () => {
    const saves = fixtureSaves();
    const campaign = campaignFor(saves);

    const a = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const b = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });

    for (let i = 0; i < a.settlements.length; i += 1) {
      // Same settlement ref ⇒ memoized ⇒ identical object references.
      expect(b.settlements[i].causal).toBe(a.settlements[i].causal);
      expect(b.settlements[i].system).toBe(a.settlements[i].system);
      expect(b.settlements[i].activeConditions).toBe(a.settlements[i].activeConditions);
    }
  });

  test('cache MISS: a mutated settlement (new ref) yields freshly derived, non-stale objects', () => {
    const saves = fixtureSaves();
    const campaign = campaignFor(saves);

    const before = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const betaBefore = before.byId.get('beta');

    // Copy-on-write: a "changed" settlement is a NEW object reference, exactly as
    // the worldPulse pipeline produces between rebuilds. Flip legitimacy hard so
    // a settlement-only derivation (law_order / resilience etc.) must move.
    const mutatedSaves = saves.map(s => (s.id !== 'beta'
      ? s
      : {
        ...s,
        settlement: {
          ...s.settlement,
          powerStructure: {
            ...s.settlement.powerStructure,
            publicLegitimacy: { score: 95, label: 'Beloved' },
          },
        },
      }));
    const mutatedCampaign = campaignFor(mutatedSaves);

    const after = buildWorldSnapshot({ campaign: mutatedCampaign, saves: mutatedSaves, worldState: mutatedCampaign.worldState });
    const betaAfter = after.byId.get('beta');

    // New settlement ref ⇒ cache MISS ⇒ a distinct derived object…
    expect(betaAfter.causal).not.toBe(betaBefore.causal);
    // …whose content reflects the mutation (not the stale pre-mutation value).
    expect(betaAfter.causal.scores.law_order).not.toBe(betaBefore.causal.scores.law_order);

    // The UNCHANGED settlements still HIT the cache (same refs preserved).
    expect(after.byId.get('alpha').causal).toBe(before.byId.get('alpha').causal);
    expect(after.byId.get('gamma').causal).toBe(before.byId.get('gamma').causal);

    // And a fresh build from the ORIGINAL (unmutated) saves recomputes the
    // pre-mutation values exactly — i.e. the cache never poisoned them.
    const reground = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    expect(reground.byId.get('beta').causal).toEqual(betaBefore.causal);
  });

  test('a null/sparse settlement is handled and cached without throwing', () => {
    const saves = [
      save('full', 'Fulltown'),
      // A canon save whose settlement is null — exercises the non-object guard.
      { id: 'empty', name: 'Emptyplace', phase: 'canon', settlement: null },
    ];
    const campaign = campaignFor(saves);

    const a = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const b = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });

    const emptyA = a.byId.get('empty');
    expect(emptyA.activeConditions).toEqual([]);
    // A null settlement does NOT throw — deriveCausalState/deriveSystemState
    // both return tolerant defaults — so causal is the neutral-band default and
    // system is the four-dimension default object (not null). This documents
    // that the cache preserves the original try/catch semantics exactly: the
    // system=null fallback fires only on a genuine THROW, which null doesn't.
    expect(emptyA.causal).toBeTruthy();
    expect(emptyA.system).toBeTruthy();
    // Null settlements are not memoized but must stay deep-equal across rebuilds.
    expect(b.settlements).toEqual(a.settlements);
  });
});
