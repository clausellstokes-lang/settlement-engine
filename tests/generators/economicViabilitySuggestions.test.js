/**
 * tests/generators/economicViabilitySuggestions.test.js — Cohesion Wave 7 pins
 * (viability suggestion junk data).
 *
 * The probe found 'Incomplete chain' suggestions listing EVERY absent catalog
 * institution (~100 for a thorp, including 'Slave market'). Two data bugs:
 *   1. a null chain.resource fuzzy-matched EVERY nearby resource
 *      (`includes(''.slice(0,8))` is `includes('')` — true for everything),
 *      pulling resource-less chains (slave trade, organised crime, …) into
 *      every resource's processor union;
 *   2. the missing list was never filtered to processors the settlement could
 *      actually GENERATE at its tier (assembleInstitutions' availability
 *      model: the tier's own catalog section, entries gated by minTier).
 *
 * Pins: a thorp's grain-chain suggestion lists only thorp-reachable
 * processors, never slave markets; suggestions cap at 3 names; an institution
 * the activation gate already counts as a live processor is never suggested
 * as missing.
 */

import { describe, expect, it } from 'vitest';

import { generateEconomicViability } from '../../src/generators/economicGenerator.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { TIER_ORDER } from '../../src/data/constants.js';

const mkSettlement = (tier, instNames, config = {}) => ({
  population: tier === 'thorp' ? 40 : 2500,
  tier,
  config: { tradeRouteAccess: 'road', ...config },
  institutions: instNames.map(name => ({ name })),
  economicState: {},
});

// The availability model assembleInstitutions uses: the tier's own catalog
// section (metropolis merges city), entries gated by their own minTier.
const namesAvailableAtTier = (tier) => {
  const sections = tier === 'metropolis'
    ? [institutionalCatalog.city || {}, institutionalCatalog.metropolis || {}]
    : [institutionalCatalog[tier] || {}];
  const tierIdx = TIER_ORDER.indexOf(tier);
  return sections.flatMap(section =>
    Object.values(section).flatMap(group =>
      Object.entries(group)
        .filter(([, spec]) => tierIdx >= TIER_ORDER.indexOf(spec?.minTier || 'thorp'))
        .map(([name]) => name.toLowerCase()),
    ),
  );
};

// Same fuzzy matcher as the chain-activation gate.
const reachableAt = (tier, processor) =>
  namesAvailableAtTier(tier).some(n => n.includes(String(processor).toLowerCase().slice(0, 12)));

const namesIn = (suggestion) => {
  const m = suggestion.description.match(/missing (.*) for the full chain|Add (.*) to unlock/);
  const list = (m && (m[1] || m[2])) || '';
  return list.split(/, | or /).map(s => s.trim()).filter(Boolean);
};

const chainSuggestions = (viability) =>
  (viability.suggestions || []).filter(s => s.category === 'Resource Chain');

describe('a thorp with grain fields', () => {
  it('suggests only thorp-reachable processors — never slave markets, never a catalog dump', () => {
    // 'Mill' alone is processing grain (the activation gate matches it), so
    // the grain chain reads incomplete only by tier-reachable gaps.
    const v = generateEconomicViability(
      mkSettlement('thorp', ['Subsistence farming', 'Mill']),
      'plains',
      ['Grain fields'],
    );
    for (const suggestion of chainSuggestions(v)) {
      const names = namesIn(suggestion);
      expect(names.length).toBeLessThanOrEqual(3);
      for (const name of names) {
        expect(/slave/i.test(name), `suggested '${name}'`).toBe(false);
        expect(reachableAt('thorp', name), `'${name}' is not thorp-reachable`).toBe(true);
      }
    }
  });

  it('treats "Access to external mill" as a live grain processor — no junk gap', () => {
    // The thorp catalog's own grain coverage. The activation matcher counts
    // it for the chain's 'Mill' processor; the suggestion must not contradict
    // the gate by reporting Mill missing.
    const v = generateEconomicViability(
      mkSettlement('thorp', ['Subsistence farming', 'Access to external mill']),
      'plains',
      ['Grain fields'],
    );
    const grain = chainSuggestions(v).filter(s => /Grain fields/.test(s.title));
    expect(grain).toEqual([]);
  });
});

describe('a town processing grain', () => {
  it('caps the incomplete-chain gap at 3 town-reachable processors with real chain outputs', () => {
    const v = generateEconomicViability(mkSettlement('town', ['Mill']), 'plains', ['Grain fields']);
    const grain = chainSuggestions(v).find(s => s.title === 'Incomplete chain: Grain fields');
    expect(grain).toBeTruthy();
    const names = namesIn(grain);
    expect(names.length).toBeGreaterThan(0);
    expect(names.length).toBeLessThanOrEqual(3);
    for (const name of names) {
      expect(/slave/i.test(name)).toBe(false);
      expect(reachableAt('town', name), `'${name}' is not town-reachable`).toBe(true);
    }
    // The impact line names the chains' real outputs, not the dead
    // 'finished goods' fallback the flattened union used to force.
    expect(grain.impact).not.toContain('(finished goods)');
  });

  it('resource-less chains (slave trade, organised crime) never join a resource union', () => {
    // Before the fix, `includes('')` matched every null-resource chain into
    // every resource's suggestions — this sweeps the whole suggestion set.
    const v = generateEconomicViability(
      mkSettlement('town', ['Mill', 'Shepherd']),
      'plains',
      ['Grain fields', 'Grazing land', 'Iron ore deposits', 'Stone quarry'],
    );
    const text = JSON.stringify(chainSuggestions(v));
    expect(text).not.toMatch(/slave market/i);
    expect(text).not.toMatch(/street gang/i);
    expect(text).not.toMatch(/thieves/i);
    expect(text).not.toMatch(/workhouse/i);
  });
});
