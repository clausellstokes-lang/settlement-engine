/**
 * underwaysInstitutionParity.test.js — [D6 THE UNDERWAYS] (Track-G2 catalog half).
 *
 * The underground-network institution ("the underways") is a first-class catalog
 * institution with FULL parity. This pin locks every catalog-side seam the design
 * (docs/DESIGN_SIM_DEPTH_R2.md D6) requires, so a future edit cannot silently
 * de-integrate it:
 *   - catalog entry present at village+ (village/town/city; metropolis via merge)
 *     with governed tags, the criminal priority category, and declared facets;
 *   - id `underground_network` (kernel-slugified from the name, collision-checked);
 *   - facetOf resolves clandestine + subterranean (declared), custom clandestine
 *     content COUNTS the same (facet law), and an absent facet stays null;
 *   - a services menu, an authored identity one-liner, mountain/hills excavation
 *     modifier rows (single-match), and the flood-suppression forbiddenResources.
 *
 * The ENGINE couplings (smuggle/siege/corruption/escape/organic-founding) ride the
 * separate W-R2-DEPTH wave and are NOT asserted here.
 */
import { describe, it, expect } from 'vitest';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { INSTITUTION_IDENTITY } from '../../src/domain/display/institutionVocabulary.js';
import { TERRAIN_DATA } from '../../src/data/geographyData.js';
import { facetOf } from '../../src/domain/spatial/cohesionWeave.js';

const NAME = 'Underground network';
const entryAt = (tier) => institutionalCatalog[tier]?.Criminal?.[NAME];

describe('[D6 THE UNDERWAYS] catalog + generation parity', () => {
  it('is a village+ Criminal catalog entry (village/town/city; metropolis inherits city)', () => {
    for (const tier of ['village', 'town', 'city']) {
      expect(entryAt(tier), `${NAME} missing at ${tier}`).toBeTruthy();
    }
    // NOT at the sub-village tiers (excavation needs labour)
    expect(entryAt('thorp')).toBeFalsy();
    expect(entryAt('hamlet')).toBeFalsy();
  });

  it('carries governed tags, the criminal category, and the design facets', () => {
    const e = entryAt('city');
    expect(e.tags).toEqual(expect.arrayContaining(['criminal', 'smuggling', 'underground']));
    expect(e.priorityCategory).toBe('criminal');
    expect(e.facets).toEqual({ clandestine: 'clandestine', subterranean: 'subterranean' });
  });

  it('resolves to the design id underground_network (kernel-slugified, collision-checked)', () => {
    expect(catalogIdForName(NAME)).toBe('underground_network');
  });

  it('resolves clandestine + subterranean through the facetOf chokepoint', () => {
    const inst = entryAt('city');
    expect(facetOf({ name: NAME, ...inst }, 'clandestine')).toBe('clandestine');
    expect(facetOf({ name: NAME, ...inst }, 'subterranean')).toBe('subterranean');
  });

  it('facet-law parity: a CUSTOM clandestine institution counts, an absent facet stays null', () => {
    expect(facetOf({ name: "Smugglers' warren", facets: { clandestine: 'clandestine' } }, 'clandestine')).toBe('clandestine');
    expect(facetOf({ name: 'Travellers inn' }, 'clandestine')).toBeNull(); // byte-identical for non-facet institutions
  });

  it('is suppressed to impossible atop marsh/floodplain (tunnels flood)', () => {
    const e = entryAt('city');
    expect(e.forbiddenResources).toEqual(expect.arrayContaining(['marshlands', 'fertile_floodplain']));
  });

  it('has a service menu (discreet passage / untaxed storage / no-questions transport)', () => {
    const svc = INSTITUTION_SERVICES[NAME];
    expect(svc).toBeTruthy();
    expect(Object.keys(svc).length).toBeGreaterThanOrEqual(3);
  });

  it('has an authored identity one-liner', () => {
    expect(typeof INSTITUTION_IDENTITY[NAME]).toBe('string');
    expect(INSTITUTION_IDENTITY[NAME].length).toBeGreaterThan(20);
  });

  it('has mountain + hills excavation-affinity modifier rows that single-match', () => {
    for (const terrain of ['mountain', 'hills']) {
      const rows = (TERRAIN_DATA[terrain].institutionModifiers || []).filter((m) => m.name);
      const matched = rows.filter((m) => NAME.toLowerCase().includes(m.name.toLowerCase()));
      expect(matched.map((m) => m.name), `${terrain} excavation row`).toContain(NAME);
      // single-match: the underways name matches EXACTLY one named row per terrain (double-stack lesson)
      expect(matched.length, `${terrain} double-match`).toBe(1);
    }
  });
});
