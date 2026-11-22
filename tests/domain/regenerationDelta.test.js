/**
 * tests/domain/regenerationDelta.test.js — Tier 5.1 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveRegenerationDelta,
  regenerationDeltaSize,
  newEntitiesByType,
} from '../../src/domain/regenerationDelta.js';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

function fixture() {
  return {
    name: 'Greycairn',
    tier: 'town',
    population: 2000,
    institutions: [
      { id: 'institution.granary', name: 'Granary' },
      { id: 'institution.market',  name: 'Market' },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.council', name: 'Council', faction: 'Council', power: 35 },
      ],
    },
    economicState: { activeChains: [] },
    activeConditions: [],
  };
}

/**
 * ⭐ THE ENVELOPE, EXACTLY, IN ORDER (EM-B2b re-pins it at TWELVE). The eleven that were here
 * before are unmoved in NAME and in ORDER and `dmFields` is appended after `summary`; asserting
 * the whole key list rather than eleven separate `toHaveProperty` calls is what makes a key
 * SILENTLY renamed or re-ordered red here instead of somewhere downstream.
 */
const ENVELOPE_KEYS = Object.freeze([
  'directEffects', 'rippleEffects', 'capacityShifts', 'dailyLifeShifts', 'preservedCanon',
  'brokenDependencies', 'newEntities', 'removedEntities', 'newOpportunities', 'newRisks',
  'summary', 'dmFields',
]);

describe('deriveRegenerationDelta()', () => {
  it('returns canonical envelope shape', () => {
    const d = deriveRegenerationDelta(fixture(), fixture());
    expect(d).toHaveProperty('directEffects');
    expect(d).toHaveProperty('rippleEffects');
    expect(d).toHaveProperty('capacityShifts');
    expect(d).toHaveProperty('dailyLifeShifts');
    expect(d).toHaveProperty('preservedCanon');
    expect(d).toHaveProperty('brokenDependencies');
    expect(d).toHaveProperty('newEntities');
    expect(d).toHaveProperty('removedEntities');
    expect(d).toHaveProperty('newOpportunities');
    expect(d).toHaveProperty('newRisks');
    expect(d).toHaveProperty('summary');
    expect(d).toHaveProperty('dmFields');

    // TWELVE, in order, on BOTH branches, and the twelfth is empty when no layer is present.
    expect(Object.keys(d), 'the real return carries the twelve in order').toEqual([...ENVELOPE_KEYS]);
    const nullish = deriveRegenerationDelta(null, fixture());
    expect(Object.keys(nullish), 'the nullish branch carries the SAME twelve, in the same order')
      .toEqual([...ENVELOPE_KEYS]);
    expect(nullish.dmFields, 'an absent snapshot reports no DM field at all')
      .toEqual({ roots: [], worldFacts: [] });
    expect(d.dmFields, 'a snapshot with no dmLayer reports no DM field at all')
      .toEqual({ roots: [], worldFacts: [] });
  });

  it('A6: dmFields partitions the layer\'s roots BY PROVENANCE, names the engine key, and does not enter the size', () => {
    const before = { ...fixture(), config: { terrainOverride: 'plains', culture: 'germanic' } };
    // ⛔ THE INERT BAG IS NON-EMPTY AND IS READ BY NOBODY. If the section were built from
    // `worldFacts` instead of from `roots` it would report THESE two keys, which no writer in the
    // estate ever puts there — that is the lie this arm exists to refuse.
    const after = {
      ...before,
      dmLayer: {
        roots: {
          'institution:Granary:name': 'The Granary of Probes',
          'institution:Market:name': 'The Market of Probes',
          // The root key is OPAQUE to this reader, so the two world facts are given entity ids
          // that INVERT the configKey order: by key, terrain sorts before culture; by configKey,
          // 'culture' sorts before 'terrainOverride'. Without the sort the arm below reds.
          'worldFact:alpha:terrain': 'coastal',
          'worldFact:zulu:culture': 'norse',
        },
        worldFacts: { terrainOverride: 'desert', culture: 'latin' },
        minted: {},
        phantoms: {},
      },
    };
    const d = deriveRegenerationDelta(before, after, { declarationsFor });

    expect(d.dmFields.roots, 'every non-world-fact root is named with the DM\'s value and the '
      + 'engine\'s own, read at the declaration\'s outputKey').toEqual([
      {
        key: 'institution:Granary:name',
        cardShape: 'institution',
        entityId: 'Granary',
        field: 'name',
        dmValue: 'The Granary of Probes',
        engineValue: 'Granary',
      },
      {
        key: 'institution:Market:name',
        cardShape: 'institution',
        entityId: 'Market',
        field: 'name',
        dmValue: 'The Market of Probes',
        engineValue: 'Market',
      },
    ]);
    expect(d.dmFields.worldFacts, 'a world fact is named by the key the ENGINE reads, never by '
      + 'the field name and never by the outputKey leaf').toEqual([
      { configKey: 'culture', dmValue: 'norse', engineValue: 'germanic' },
      { configKey: 'terrainOverride', dmValue: 'coastal', engineValue: 'plains' },
    ]);
    // ⛔ THE INERT BAG'S OWN VALUES APPEAR NOWHERE: it holds 'desert' and 'latin', and the section
    // is populated from `roots` and from nothing else. The population is pinned live on the line
    // below before the absence is asserted, so a section that had drifted away entirely could not
    // make this absence true.
    const reported = d.dmFields.worldFacts.map((row) => row.dmValue);
    expect(reported.length, 'the world-fact section is live, or the absence below is vacuous').toBe(2);
    expect(reported.filter((value) => value === 'desert' || value === 'latin'),
      'a value that exists ONLY in the inert bag is reported by nobody').toEqual([]);

    // BOTH ARRAYS ASCII-ASCENDING ON THEIR FIRST FIELD.
    const rootKeys = d.dmFields.roots.map((row) => row.key);
    const configKeys = d.dmFields.worldFacts.map((row) => row.configKey);
    expect(rootKeys).toEqual([...rootKeys].sort());
    expect(configKeys, 'the world facts are sorted on configKey, not on the root key that carried '
      + 'them: the two orders are INVERTED in this fixture').toEqual([...configKeys].sort());

    // THE ELEVEN ARE UNMOVED AND THE TWELFTH DOES NOT ENTER THE SIZE.
    expect(Object.keys(d)).toEqual([...ENVELOPE_KEYS]);
    const withoutLayer = deriveRegenerationDelta(before, { ...after, dmLayer: undefined }, { declarationsFor });
    for (const key of ENVELOPE_KEYS.filter((name) => name !== 'dmFields')) {
      expect(d[key], `the eleventh-and-earlier key '${key}' is untouched by dmFields`).toEqual(withoutLayer[key]);
    }
    expect(regenerationDeltaSize(d), 'a DM\'s own field is not a change the world made')
      .toBe(regenerationDeltaSize(withoutLayer));
  });

  it('identical snapshots produce empty deltas + "no changes" summary', () => {
    const s = fixture();
    const d = deriveRegenerationDelta(s, s);
    expect(d.directEffects).toEqual([]);
    expect(d.rippleEffects).toEqual([]);
    expect(d.newEntities).toEqual([]);
    expect(d.removedEntities).toEqual([]);
    expect(d.summary[0]).toMatch(/no structural changes/i);
  });

  it('returns empty envelope for nullish input', () => {
    const d = deriveRegenerationDelta(null, fixture());
    expect(d.directEffects).toEqual([]);
    expect(d.summary).toEqual([]);
  });

  it('detects removed institution', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: before.institutions.filter(i => i.id !== 'institution.granary'),
    };
    const d = deriveRegenerationDelta(before, after);
    expect(d.removedEntities.some(e => e.id === 'institution.granary')).toBe(true);
    expect(d.brokenDependencies).toContain('institution.granary');
  });

  it('detects added institution', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: [...before.institutions, { id: 'institution.temple', name: 'Temple of Light' }],
    };
    const d = deriveRegenerationDelta(before, after);
    expect(d.newEntities.some(e => e.id === 'institution.temple')).toBe(true);
  });

  it('classifies new threats as newRisks', () => {
    const before = fixture();
    const after = { ...before, config: { monsterThreat: 'plagued' } };
    const d = deriveRegenerationDelta(before, after);
    expect(d.newRisks.some(e => e.type === 'threat')).toBe(true);
  });

  it('legitimacy drop registers in rippleEffects', () => {
    const before = fixture();
    const after = {
      ...before,
      powerStructure: {
        ...before.powerStructure,
        publicLegitimacy: { score: 25, label: 'Legitimacy Crisis' },
      },
    };
    const d = deriveRegenerationDelta(before, after);
    expect(d.rippleEffects.some(r => r.variable === 'public_legitimacy')).toBe(true);
  });

  it('preservedCanon includes entities present in both', () => {
    const before = fixture();
    const after = fixture();
    const d = deriveRegenerationDelta(before, after);
    expect(d.preservedCanon.some(e => e.id === 'institution.granary')).toBe(true);
  });

  it('does not mutate either snapshot', () => {
    const before = fixture();
    const after = fixture();
    const beforeStr = JSON.stringify(before);
    const afterStr = JSON.stringify(after);
    deriveRegenerationDelta(before, after);
    expect(JSON.stringify(before)).toBe(beforeStr);
    expect(JSON.stringify(after)).toBe(afterStr);
  });
});

describe('regenerationDeltaSize()', () => {
  it('counts changes across all layers', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: [...before.institutions, { id: 'institution.temple', name: 'Temple' }],
    };
    const d = deriveRegenerationDelta(before, after);
    expect(regenerationDeltaSize(d)).toBeGreaterThan(0);
  });

  it('returns 0 for nullish delta', () => {
    expect(regenerationDeltaSize(null)).toBe(0);
  });
});

describe('newEntitiesByType()', () => {
  it('groups new entities by type', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: [...before.institutions, { id: 'institution.temple', name: 'Temple' }],
      config: { monsterThreat: 'plagued' },
    };
    const d = deriveRegenerationDelta(before, after);
    const grouped = newEntitiesByType(d);
    expect(grouped).toHaveProperty('institution');
    expect(grouped.institution.length).toBeGreaterThan(0);
  });
});

describe('real-settlement smoke', () => {
  it('runs over two real settlements (different seeds)', () => {
    const a = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'regen-A', customContent: {} },
    );
    const b = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'regen-B', customContent: {} },
    );
    const d = deriveRegenerationDelta(a, b);
    expect(d).toBeTruthy();
    expect(Array.isArray(d.summary)).toBe(true);
  });
});
