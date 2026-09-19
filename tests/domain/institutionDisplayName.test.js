/**
 * institutionDisplayName.test.js — the institution LABEL SEAM's own behaviour
 * (ODQ §934.13, the parish-church re-ruling).
 *
 * The seam is the whole of what §934.13 authorised: the catalogue KEY stays the
 * identifier every matcher, every golden and every saved world already spell, and
 * ONE read-time mapping renders the setting-neutral label. So the properties worth
 * pinning here are the ones that make that ruling true rather than merely intended:
 *
 *   1. THE FAMILY MAPS — all five keys, including the thorp/hamlet SERVICE.
 *   2. EVERYTHING ELSE PASSES THROUGH — an ordinary institution, and above all a
 *      USER'S CUSTOM institution, is never reworded by a seam installed globally.
 *   3. SAVED WORLDS ARE COVERED BY CONSTRUCTION — a settlement persisted before
 *      this car still carries 'Parish church' in its institution objects, and
 *      renders the new label with no migration and no version bump.
 *   4. THE FAMILY ENUMERATION CANNOT FALL BEHIND THE CATALOGUE — re-derived from
 *      `institutionalCatalog` here, so a NEW scale variant reds this file instead
 *      of shipping the old word.
 *
 * ⛔ The catalogue is imported by the TEST, never by the seam: `vite.config` routes
 * `src/data/*` into the eager first-paint chunk, and the seam is called from every
 * tab. See the module's docblock.
 */

import { describe, test, expect } from 'vitest';
import {
  institutionDisplayName,
  INSTITUTION_DISPLAY_NAMES,
} from '../../src/domain/display/institutionDisplayName.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';

/** Every distinct institution/service KEY the estate can hand the seam. */
function everyCatalogueKey() {
  const keys = new Set();
  for (const byCategory of Object.values(institutionalCatalog || {})) {
    for (const byName of Object.values(byCategory || {})) {
      for (const name of Object.keys(byName || {})) keys.add(name);
    }
  }
  for (const name of Object.keys(INSTITUTION_SERVICES || {})) keys.add(name);
  return keys;
}

/**
 * THE FAMILY PREDICATE, STATED AS A RULE RATHER THAN A LIST. A key is in the
 * parish-church family when it names a parish AND a church. 'Parish burial
 * grounds' matches the first and not the second, which is exactly why it is out:
 * §934.13 ruled the house-of-worship label, and a burial ground is not one.
 */
const isParishChurchKey = (key) => /parish/i.test(key) && /church/i.test(key);

describe('institutionDisplayName — the parish-church family', () => {
  test('every mapped key renders its setting-neutral label', () => {
    expect(institutionDisplayName('Parish church')).toBe('House of worship');
    expect(institutionDisplayName('Parish churches (2-5)')).toBe('Houses of worship (2-5)');
    expect(institutionDisplayName('Parish churches (10-30)')).toBe('Houses of worship (10-30)');
    expect(institutionDisplayName('Parish churches (50-100+)')).toBe('Houses of worship (50-100+)');
    expect(institutionDisplayName('Access to parish church')).toBe('Access to a house of worship');
  });

  test('no mapped label still says "parish" or "church"', () => {
    for (const label of Object.values(INSTITUTION_DISPLAY_NAMES)) {
      expect(label).not.toMatch(/parish|church/i); // anchored: the map is asserted non-empty right below, and its keys are pinned to the catalogue, so an emptied map cannot make this loop vacuous
    }
    expect(Object.keys(INSTITUTION_DISPLAY_NAMES).length).toBeGreaterThan(0);
  });

  test('the scale variants keep their count band, so the roster still reads honestly', () => {
    // The band is the FACT ('2-5' churches is not the same settlement as '50-100+');
    // only the setting-specific word is replaced.
    expect(institutionDisplayName('Parish churches (2-5)')).toContain('(2-5)');
    expect(institutionDisplayName('Parish churches (10-30)')).toContain('(10-30)');
    expect(institutionDisplayName('Parish churches (50-100+)')).toContain('(50-100+)');
  });
});

describe('institutionDisplayName — pass-through', () => {
  test('an unmapped institution is returned unchanged', () => {
    expect(institutionDisplayName('Blacksmith')).toBe('Blacksmith');
    expect(institutionDisplayName('Wayside shrine')).toBe('Wayside shrine');
  });

  test("a USER'S custom institution is never reworded", () => {
    // The seam is installed at sites that render arbitrary institutions, the user's
    // own content among them. Rewording a name a DM authored would be a defect of a
    // different and worse kind than the one this car cures.
    const custom = { name: 'The Parish of Unending Bells', source: 'custom' };
    expect(institutionDisplayName(custom)).toBe('The Parish of Unending Bells');
  });

  test('"Parish burial grounds" is NOT mapped — it is not a house of worship', () => {
    // §934.13 ruled the parish-CHURCH family. The burial ground is an adjacent
    // finding reported to the chair, deliberately deferred — documented, not a bug
    // to re-find. If it is later ruled, this expectation is the line that changes.
    expect(institutionDisplayName('Parish burial grounds')).toBe('Parish burial grounds');
  });

  test('nothing in, nothing out — no "undefined" ever reaches a page', () => {
    expect(institutionDisplayName(null)).toBe('');
    expect(institutionDisplayName(undefined)).toBe('');
    expect(institutionDisplayName('')).toBe('');
    expect(institutionDisplayName({})).toBe('');
    expect(institutionDisplayName(42)).toBe('');
  });
});

describe('institutionDisplayName — the shapes the estate actually hands it', () => {
  test('an institution object resolves by .name, a slice row by .label', () => {
    expect(institutionDisplayName({ name: 'Parish church', category: 'Religious' }))
      .toBe('House of worship');
    expect(institutionDisplayName({ label: 'Parish church' })).toBe('House of worship');
  });

  test('case drift is tolerated, as it is in identityForInstitution', () => {
    expect(institutionDisplayName('parish church')).toBe('House of worship');
    expect(institutionDisplayName('PARISH CHURCH')).toBe('House of worship');
  });

  test('A SAVED WORLD carries the old spelling and renders the new label', () => {
    // The persisted shape, verbatim: `assembleInstitutions` stores the catalogue KEY
    // as `name`, so every world generated before this car has 'Parish church' inside
    // it forever. The seam maps at READ time — no migration, no backfill, no bump.
    const savedWorld = {
      name: 'Aldwick',
      tier: 'village',
      institutions: [
        { name: 'Parish church', category: 'Religious', source: 'generated', status: 'healthy' },
        { name: 'Blacksmith', category: 'Crafts', source: 'generated', status: 'healthy' },
      ],
    };
    const rendered = savedWorld.institutions.map(institutionDisplayName);
    expect(rendered).toEqual(['House of worship', 'Blacksmith']);
    // The PERSISTED object is untouched: the seam reads, it does not migrate.
    expect(savedWorld.institutions[0].name).toBe('Parish church');
  });
});

describe('institutionDisplayName — the enumeration is pinned to the catalogue', () => {
  test('every parish-church key in the catalogue is mapped', () => {
    const family = [...everyCatalogueKey()].filter(isParishChurchKey).sort();
    const mapped = Object.keys(INSTITUTION_DISPLAY_NAMES).sort();
    // A NEW scale variant added to the catalogue lands here as an unmapped key and
    // reds THIS file, instead of shipping 'Parish churches (100-200)' to a reader.
    expect(family).toEqual(mapped);
  });

  test('the family is exactly the five keys the census found', () => {
    const family = [...everyCatalogueKey()].filter(isParishChurchKey);
    expect(family).toHaveLength(5);
  });

  test('every mapped key is a REAL catalogue key — no orphan mappings', () => {
    const keys = everyCatalogueKey();
    for (const key of Object.keys(INSTITUTION_DISPLAY_NAMES)) {
      expect(keys.has(key)).toBe(true);
    }
  });

  test('no display label collides with an existing catalogue name', () => {
    const keys = everyCatalogueKey();
    for (const label of Object.values(INSTITUTION_DISPLAY_NAMES)) {
      // A label that IS another institution's name would make two different
      // institutions print the same word on one roster.
      expect(keys.has(label)).toBe(false);
    }
  });
});
