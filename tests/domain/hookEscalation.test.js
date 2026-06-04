/**
 * tests/domain/hookEscalation.test.js — Structured hooks + escalation clocks.
 *
 * The Tier 4.10 layer is the first one to compose across three of the
 * structural foundations we've built (supply chains, factions,
 * legitimacy). These tests pin both the per-hook derivation contract
 * AND the cross-system clock triggers.
 */

import { describe, it, expect } from 'vitest';
import {
  collectAllHooks,
  deriveHookOrigin,
  deriveStructuredHook,
  deriveAllStructuredHooks,
  deriveEscalationClocks,
  structuredHookOriginBreakdown,
} from '../../src/domain/hookEscalation.js';

// ── Sample settlements ──────────────────────────────────────────────────

function settlementWithHooks() {
  return {
    name: 'Greycairn',
    plotHooks: [
      'The reeve is suspected of taking bribes.',
      { category: 'Survival', hook: 'Bandits target food caravans on the southern road.', severity: 'high' },
    ],
    economicViability: {
      plotHooks: [
        { category: 'Trade Monopoly', hook: 'A single merchant guild controls grain imports.', severity: 'high' },
      ],
    },
    defenseProfile: {
      plotHooks: [
        { category: 'Banditry', hook: 'A bandit company raided the toll on the south road last week.', severity: 'medium' },
      ],
    },
    history: {
      events: [
        { name: 'The Red Fever', plotHooks: ['Bodies were buried in the lower fields; the families still won\'t plant there.'] },
      ],
    },
  };
}

function settlementWithDisruptedFoodChain() {
  return {
    name: 'Greycairn',
    economicState: {
      activeChains: [
        {
          needKey: 'food_security',
          chainId: 'grain',
          label: 'Grain → flour',
          status: 'impaired',
          processingInstitutions: ['Watermill'],
          resource: 'grain_fields',
          dependency: { institution: 'Royal Mill', resource: 'grain', severity: 'critical' },
        },
      ],
    },
  };
}

function settlementWithContestedLegitimacy() {
  return {
    name: 'Greycairn',
    powerStructure: {
      governingName: 'Mayor and Council',
      publicLegitimacy: { score: 35, label: 'Contested' },
      factions: [{ faction: 'Mayor and Council', power: 30 }],
    },
  };
}

// ── collectAllHooks ─────────────────────────────────────────────────────

describe('collectAllHooks()', () => {
  it('aggregates hooks from every documented surface', () => {
    const hooks = collectAllHooks(settlementWithHooks());
    // 2 from plotHooks, 1 from economicViability, 1 from defenseProfile,
    // 1 from history events = 5 total.
    expect(hooks.length).toBe(5);
    const sources = new Set(hooks.map(h => h.source));
    expect(sources.has('aggregate')).toBe(true);
    expect(sources.has('economic')).toBe(true);
    expect(sources.has('defense')).toBe(true);
    expect(sources.has('history')).toBe(true);
  });

  it('returns [] on empty / nullish input', () => {
    expect(collectAllHooks(null)).toEqual([]);
    expect(collectAllHooks(undefined)).toEqual([]);
    expect(collectAllHooks({})).toEqual([]);
  });
});

// ── deriveHookOrigin ────────────────────────────────────────────────────

describe('deriveHookOrigin()', () => {
  it.each([
    ['Flour prices have tripled.',                                       'chain'],
    ['The merchant guild and the temple are at each other.',             'factionConflict'],
    ['The hospital is closed for repairs.',                              'institution'],
    ['The reeve has not been seen in three days.',                       'npc'],
    ['Bandits target food caravans on the southern road.',               'external'],
    ['Public unrest is growing in the lower district.',                  'pressure'],
  ])('"%s" → %s', (text, expected) => {
    expect(deriveHookOrigin(text)).toBe(expected);
  });

  it('returns "other" for unrecognized text', () => {
    expect(deriveHookOrigin('The sky is unusually blue today.')).toBe('other');
  });

  it('returns "other" for empty / nullish text', () => {
    expect(deriveHookOrigin('')).toBe('other');
    expect(deriveHookOrigin(null)).toBe('other');
    expect(deriveHookOrigin(undefined)).toBe('other');
  });
});

// ── deriveStructuredHook ────────────────────────────────────────────────

describe('deriveStructuredHook()', () => {
  it('produces a full canonical hook from a bare string', () => {
    const out = deriveStructuredHook('Flour prices have tripled.');
    expect(out.id).toMatch(/^hook\./);
    expect(out.text).toBe('Flour prices have tripled.');
    expect(out.origin).toBe('chain');
    expect(out.severity).toBe('medium');
    expect(out.ifIgnored.length).toBeGreaterThan(0);
    expect(out.possibleResolutions.length).toBeGreaterThan(0);
  });

  it('honors a wrapped {source, raw} envelope from collectAllHooks', () => {
    const out = deriveStructuredHook({
      source: 'economic',
      raw: { category: 'Trade Monopoly', hook: 'A single merchant guild controls grain imports.', severity: 'high' },
    });
    expect(out.source).toBe('economic');
    expect(out.severity).toBe('high');
    expect(out.category).toBe('Trade Monopoly');
  });

  it('preserves eventName when the hook came from a history event', () => {
    const out = deriveStructuredHook({
      source: 'history',
      raw: 'Bodies were buried in the lower fields.',
      eventName: 'The Red Fever',
    });
    expect(out.eventName).toBe('The Red Fever');
  });

  it('falls back to origin=other when text is unrecognized', () => {
    const out = deriveStructuredHook('Nothing notable has happened in years.');
    expect(out.origin).toBe('other');
    expect(out.ifIgnored.length).toBeGreaterThan(0);
  });

  it('returns null for nullish / empty input', () => {
    expect(deriveStructuredHook(null)).toBeNull();
    expect(deriveStructuredHook({})).toBeNull();
    expect(deriveStructuredHook('')).toBeNull();
    expect(deriveStructuredHook({ raw: '' })).toBeNull();
  });

  it('does not mutate the input', () => {
    const input = { raw: 'Flour prices have tripled.', source: 'economic' };
    const before = JSON.stringify(input);
    deriveStructuredHook(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('ifIgnored and possibleResolutions are fresh clones (mutating return does not pollute template)', () => {
    const a = deriveStructuredHook('Flour prices have tripled.');
    a.ifIgnored.push('mutate me');
    const b = deriveStructuredHook('Flour prices have tripled.');
    expect(b.ifIgnored).not.toContain('mutate me');
  });
});

// ── deriveAllStructuredHooks ───────────────────────────────────────────

describe('deriveAllStructuredHooks()', () => {
  it('produces structured hooks from every surface', () => {
    const hooks = deriveAllStructuredHooks(settlementWithHooks());
    expect(hooks.length).toBe(5);
    for (const h of hooks) {
      expect(typeof h.text).toBe('string');
      expect(h.text.length).toBeGreaterThan(0);
      expect(typeof h.origin).toBe('string');
    }
  });

  it('skips entries that derive to null', () => {
    // History event with an empty plotHooks array should produce zero
    // structured hooks (not crash).
    const s = {
      history: { events: [{ name: 'Quiet century', plotHooks: ['', null, undefined, 'Real hook'] }] },
    };
    const hooks = deriveAllStructuredHooks(s);
    expect(hooks.length).toBe(1);
    expect(hooks[0].text).toBe('Real hook');
  });
});

// ── deriveEscalationClocks ─────────────────────────────────────────────

describe('deriveEscalationClocks()', () => {
  it('returns no clocks for a stable settlement', () => {
    const s = {
      economicState: {
        activeChains: [{
          needKey: 'food_security', chainId: 'grain', label: 'Grain → flour',
          status: 'operational',  // canonical: stable
          processingInstitutions: ['Mill'], resource: 'grain_fields',
        }],
      },
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 70, label: 'Approved' },
        factions: [{ faction: 'Town Council', power: 30 }],
      },
    };
    expect(deriveEscalationClocks(s)).toEqual([]);
  });

  it('emits a Bread Riot Clock when food chain is disrupted', () => {
    const clocks = deriveEscalationClocks(settlementWithDisruptedFoodChain());
    const bread = clocks.find(c => c.label === 'Bread Riot Clock');
    expect(bread).toBeTruthy();
    expect(bread.stages.length).toBe(6);
    // The controller token gets substituted.
    expect(bread.stages.some(s => s.includes('Royal Mill'))).toBe(true);
    expect(bread.triggerSource).toBe('supply_chain');
    expect(bread.triggerTargetId).toBe('chain.food_security.grain');
  });

  it('emits a Legitimacy Crisis Clock when the governing faction is Contested', () => {
    const clocks = deriveEscalationClocks(settlementWithContestedLegitimacy());
    const crisis = clocks.find(c => c.label === 'Legitimacy Crisis Clock');
    expect(crisis).toBeTruthy();
    expect(crisis.stages.length).toBe(6);
    // governing token substitution
    expect(crisis.stages.some(s => s.includes('Mayor and Council'))).toBe(true);
  });

  it('emits a Faction Split Clock when two top factions are close in power and different archetypes', () => {
    const clocks = deriveEscalationClocks({
      powerStructure: {
        publicLegitimacy: { score: 65, label: 'Approved' },
        governingName: 'Mayor and Council',
        factions: [
          { faction: 'Mayor and Council',  power: 35 },
          { faction: 'Merchant Guilds',    power: 30 },
        ],
      },
    });
    const split = clocks.find(c => c.label === 'Faction Split Clock');
    expect(split).toBeTruthy();
  });

  it('does NOT emit a Faction Split Clock when archetypes are the same', () => {
    const clocks = deriveEscalationClocks({
      powerStructure: {
        publicLegitimacy: { score: 65, label: 'Approved' },
        governingName: 'Town Council',
        factions: [
          { faction: 'Town Council',  power: 35 },
          { faction: 'Other Council', power: 32 },
        ],
      },
    });
    const split = clocks.find(c => c.label === 'Faction Split Clock');
    expect(split).toBeFalsy();
  });

  it('returns [] for nullish settlement', () => {
    expect(deriveEscalationClocks(null)).toEqual([]);
    expect(deriveEscalationClocks(undefined)).toEqual([]);
  });
});

// ── structuredHookOriginBreakdown ──────────────────────────────────────

describe('structuredHookOriginBreakdown()', () => {
  it('counts hooks by canonical origin', () => {
    const breakdown = structuredHookOriginBreakdown(settlementWithHooks());
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    expect(total).toBe(5);
    // At minimum we expect npc + chain + external classifications.
    expect(breakdown.npc).toBeGreaterThan(0);
    expect(breakdown.chain).toBeGreaterThan(0);
    expect(breakdown.external).toBeGreaterThan(0);
  });
});
