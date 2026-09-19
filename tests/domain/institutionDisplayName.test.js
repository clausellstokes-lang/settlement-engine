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
 * THE RULE, AND WHY IT WIDENED. The first cut matched /parish/ AND /church/ so that
 * 'Parish burial grounds' stayed OUT by rule rather than by omission — a burial ground
 * is not a house of worship, and naming it was not the lane's call. The chair ruled it
 * ('Burial grounds'), so the predicate is now the whole word: NO CATALOGUE KEY
 * CONTAINING 'parish' MAY REACH A READER. That is a stronger pin than the one it
 * replaces, and it is the one a new variant of ANY shape now trips.
 */
const isParishKey = (key) => /parish/i.test(key);

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

  test('"Parish burial grounds" reads "Burial grounds" — the chair\'s ruling', () => {
    // Reported by the first cut as an adjacent finding and ruled since. The sibling
    // rungs are NOT touched: only the one carrying the setting-specific word moves.
    expect(institutionDisplayName('Parish burial grounds')).toBe('Burial grounds');
    expect(institutionDisplayName('Burial ground')).toBe('Burial ground');
    expect(institutionDisplayName('Burial grounds and charnel house'))
      .toBe('Burial grounds and charnel house');
    expect(institutionDisplayName('Graveyard')).toBe('Graveyard');
    expect(institutionDisplayName('Cemetery network')).toBe('Cemetery network');
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
  test('an institution object resolves by .name alone; a label-only object is not an institution', () => {
    expect(institutionDisplayName({ name: 'Parish church', category: 'Religious' }))
      .toBe('House of worship');
    // No writer in the estate produces `label` on an institution (the observed-shape ratchet
    // convicted the fallback), and both PDF callers hand the seam the institution itself — so
    // a label-only object renders nothing rather than being read through a dead key.
    expect(institutionDisplayName({ label: 'Parish church' })).toBe('');
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
  test('every parish key in the catalogue is mapped', () => {
    const family = [...everyCatalogueKey()].filter(isParishKey).sort();
    const mapped = Object.keys(INSTITUTION_DISPLAY_NAMES).sort();
    // A NEW scale variant added to the catalogue lands here as an unmapped key and
    // reds THIS file, instead of shipping 'Parish churches (100-200)' to a reader.
    expect(family).toEqual(mapped);
  });

  test('the family is exactly the six keys the census found', () => {
    const family = [...everyCatalogueKey()].filter(isParishKey);
    expect(family).toHaveLength(6);
  });

  test('"Burial grounds" cannot meet "Burial ground" in one settlement', () => {
    // The two labels are one letter apart, so the arm that makes the mapping safe is
    // the LADDER: the catalogue gives each tier exactly one burial rung, and these two
    // sit on different tiers. Re-derived from the catalogue, not asserted here — a
    // future catalogue that put both in one tier reds this and the label is re-thought.
    const tiersHolding = (name) => Object.entries(institutionalCatalog)
      .filter(([, byCategory]) => Object.values(byCategory || {})
        .some((byName) => byName && Object.prototype.hasOwnProperty.call(byName, name)))
      .map(([tier]) => tier);
    const singular = tiersHolding('Burial ground');
    const parish = tiersHolding('Parish burial grounds');
    expect(singular.length).toBeGreaterThan(0);
    expect(parish.length).toBeGreaterThan(0);
    expect(singular.filter((t) => parish.includes(t))).toEqual([]);
  });

  test('every mapped key is a REAL catalogue key — no orphan mappings', () => {
    const keys = everyCatalogueKey();
    for (const key of Object.keys(INSTITUTION_DISPLAY_NAMES)) {
      expect(keys.has(key)).toBe(true);
    }
  });

  test('no display label collides with an existing catalogue name', () => {
    // 'Burial grounds' (plural) must not BE another entry; 'Burial ground' is a
    // different string and is proved un-meetable by the ladder arm above.
    const keys = everyCatalogueKey();
    for (const label of Object.values(INSTITUTION_DISPLAY_NAMES)) {
      // A label that IS another institution's name would make two different
      // institutions print the same word on one roster.
      expect(keys.has(label)).toBe(false);
    }
  });
});
