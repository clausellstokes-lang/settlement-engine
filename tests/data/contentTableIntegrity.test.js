/**
 * contentTableIntegrity.test.js — B10-data review fixes.
 *
 * Pins the referential-integrity and consistency invariants for the content
 * tables that the reviewed findings repaired, so they can't silently re-rot:
 *
 *   1. EVENT_TYPE_NAMES ⇄ HISTORICAL_EVENTS_DATA are in sync both directions:
 *      every event-template `type` has a thematic name (no template falls back
 *      to the generic 'The Event'), and EVENT_TYPE_NAMES carries no orphan key
 *      that no template can ever look up (e.g. the old `exile_return`).
 *   2. NAMING_DATA arrays contain no duplicate string entries (duplicates
 *      double-weight a value in uniform random picks and signal copy-paste drift).
 *   3. Every required:true institution declares an explicit baseChance, so a
 *      future change that routes it through getBaseChance can't produce NaN.
 *   4. geographyData's institution-tag vocabulary is single-sourced from the
 *      canonical entityTags.TAG (no third private copy, no non-canonical keys).
 *   5. NPC_RELATIONSHIP_DYNAMICS is the canonical export and STRESS_ECONOMIC_EFFECTS
 *      remains a same-object alias (legacy importers keep working).
 */
import { describe, expect, test } from 'vitest';
import { EVENT_TYPE_NAMES, HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { NAMING_DATA } from '../../src/data/namingData.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { TAG } from '../../src/data/entityTags.js';
import {
  NPC_RELATIONSHIP_DYNAMICS,
  STRESS_ECONOMIC_EFFECTS,
} from '../../src/data/npcData.js';

describe('EVENT_TYPE_NAMES ⇄ HISTORICAL_EVENTS_DATA', () => {
  const templateTypes = new Set(
    HISTORICAL_EVENTS_DATA.map((e) => e.type).filter(Boolean),
  );

  test('every event-template type has a thematic name (no generic "The Event")', () => {
    // historyGenerator renders `EVENT_TYPE_NAMES[template.type] || 'The Event'`,
    // and no template carries its own `name`, so a missing key = a generic title.
    const missing = [...templateTypes].filter((t) => !EVENT_TYPE_NAMES[t]);
    expect(missing).toEqual([]);
  });

  test('crime_wave specifically resolves to a thematic name', () => {
    expect(templateTypes.has('crime_wave')).toBe(true);
    expect(EVENT_TYPE_NAMES.crime_wave).toBe('The Crime Wave');
  });

  test('EVENT_TYPE_NAMES has no orphan keys that no template can look up', () => {
    // exile_return was dead vocabulary: it is a category/theme key elsewhere,
    // never a HISTORICAL_EVENTS_DATA template `type`, so the lookup never hit it.
    const orphans = Object.keys(EVENT_TYPE_NAMES).filter(
      (k) => !templateTypes.has(k),
    );
    expect(orphans).toEqual([]);
    expect('exile_return' in EVENT_TYPE_NAMES).toBe(false);
  });
});

describe('NAMING_DATA arrays have no duplicate entries', () => {
  /** @type {Array<[string, string[]]>} */
  const stringArrays = [];
  const collect = (obj, path) => {
    for (const [k, v] of Object.entries(obj)) {
      const p = path ? `${path}.${k}` : k;
      if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
        stringArrays.push([p, v]);
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        collect(v, p);
      }
    }
  };
  collect(NAMING_DATA, '');

  test('no string array contains a duplicate value', () => {
    const offenders = stringArrays
      .filter(([, arr]) => new Set(arr).size !== arr.length)
      .map(([path, arr]) => {
        const seen = new Set();
        const dups = arr.filter((x) => (seen.has(x) ? true : (seen.add(x), false)));
        return `${path}: ${[...new Set(dups)].join(', ')}`;
      });
    expect(offenders).toEqual([]);
  });

  test('slavic.settlementSuffixes is de-duped (the worst copy-paste offender)', () => {
    const arr = NAMING_DATA.slavic.settlementSuffixes;
    expect(new Set(arr).size).toBe(arr.length);
  });
});

describe('required institutions declare an explicit baseChance', () => {
  const requiredEntries = [];
  const walk = (obj, name) => {
    if (Array.isArray(obj)) {
      obj.forEach((o) => walk(o, name));
      return;
    }
    if (obj && typeof obj === 'object') {
      if (obj.required === true) requiredEntries.push([name, obj]);
      for (const [k, v] of Object.entries(obj)) {
        const childName =
          v && typeof v === 'object' && !Array.isArray(v) &&
          (v.required !== undefined || v.desc !== undefined)
            ? k
            : name;
        walk(v, childName);
      }
    }
  };
  walk(institutionalCatalog, '');

  test('catalog actually has required institutions to check', () => {
    expect(requiredEntries.length).toBeGreaterThan(0);
  });

  test('every required institution has a numeric baseChance (no NaN risk)', () => {
    const missing = requiredEntries
      .filter(([, e]) => typeof e.baseChance !== 'number' || Number.isNaN(e.baseChance))
      .map(([name]) => name);
    expect(missing).toEqual([]);
  });
});

describe('geographyData tag vocabulary is single-sourced', () => {
  test('every tag emitted by TERRAIN_DATA is a canonical TAG value', async () => {
    const { TERRAIN_DATA } = await import('../../src/data/geographyData.js');
    const canonical = new Set(Object.values(TAG));
    const emitted = new Set();
    for (const terrain of Object.values(TERRAIN_DATA)) {
      for (const list of Object.values(terrain)) {
        if (!Array.isArray(list)) continue;
        for (const entry of list) {
          if (entry && typeof entry === 'object' && Array.isArray(entry.tags)) {
            entry.tags.forEach((t) => emitted.add(t));
          }
        }
      }
    }
    const nonCanonical = [...emitted].filter((t) => !canonical.has(t));
    expect(nonCanonical).toEqual([]);
    // The dead KNOWLEDGE/ENTERTAINMENT keys never existed in canonical TAG.
    expect(canonical.has('knowledge')).toBe(false);
    expect(canonical.has('entertainment')).toBe(false);
  });
});

describe('NPC relationship dynamics export', () => {
  test('STRESS_ECONOMIC_EFFECTS is a same-object alias of NPC_RELATIONSHIP_DYNAMICS', () => {
    expect(STRESS_ECONOMIC_EFFECTS).toBe(NPC_RELATIONSHIP_DYNAMICS);
  });

  test('canonical export carries the relationship archetypes', () => {
    expect(NPC_RELATIONSHIP_DYNAMICS.econ_crim_blur).toBeTruthy();
    expect(Object.keys(NPC_RELATIONSHIP_DYNAMICS).length).toBeGreaterThan(0);
  });
});
