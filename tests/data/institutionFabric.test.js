/**
 * X-46 car 3 — THE FABRIC (docs/DESIGN_X46_SCALE_TRAIN.md §4): the rows that are the place rather
 * than a house with a power behind it. A registry key like the row guards, never on a row or a
 * save; the institution budget does not count them; X-45 backing already files them at weight 0.
 */
import { describe, expect, it } from 'vitest';
import {
  institutionalCatalog, fabricRows, isFabricRow, isFabricInstitution,
} from '../../src/data/institutionalCatalog.js';
import { backingRowFor } from '../../src/data/institutionBacking.js';

// The rule (the chair's ruling, 2026-11-04, option C): a row is FABRIC when it is the place's
// baseline — no power behind it (X-45 weight 0), no service a DM would visit, no seat. Applied
// to every tier block it adds Access to external mill (thorp, hamlet) to the first twelve; the
// farming and burial rows stay houses (they back powers at weight 1 and carry services), and so
// do the weight-0 rows a DM would visit (the hedge wizard, the musician, the performers, the
// fortune tellers, the dragon).
// Re-keyed by identity 2026-11-04 (rung-1 pins, unit 1): x46-2 renamed the Dwellings and Housing
// rows to the owner's household column (4ecd7f3: "Dwellings (4-16)" → "(1-8)", "(17-80)" → "(5-25)",
// "(80-180)" → "(15-100)"; 175320e: "Housing (180-1000 structures)" → "(75-650 households)", the
// city and metropolis likewise). Same fourteen rows, same tiers; only their names moved.
const FABRIC = [
  ['thorp', 'Access to external mill'], ['thorp', 'Access to parish church'], ['thorp', 'Dwellings (1-8)'], ['thorp', 'Water source'],
  ['hamlet', 'Access to external mill'], ['hamlet', 'Access to parish church'], ['hamlet', 'Dwellings (5-25)'], ['hamlet', 'Water source'],
  ['village', 'Dwellings (15-100)'], ['village', 'Multiple water sources'],
  ['town', 'Housing (75-650 households)'], ['town', 'Multiple water sources'],
  ['city', 'Housing (500-4000 households)'],
  ['metropolis', 'Housing (3500+ households)'],
];

describe('X-46 car 3 — the fabric', () => {
  it('tags exactly the Dwellings family, the well-level water source, the church access and the external mill', () => {
    expect(fabricRows().map(({ tier, name }) => [tier, name])).toEqual(FABRIC);
    for (const [tier, name] of FABRIC) expect(isFabricRow(tier, name)).toBe(true);
  });

  it('leaves the same families\' houses untagged (a church, an aqueduct)', () => {
    for (const [tier, name] of [['village', 'Parish church'], ['town', 'Parish churches (2-5)'], ['city', 'Aqueduct or water system'], ['metropolis', 'Advanced water infrastructure'], ['thorp', 'Burial ground']]) {
      expect(isFabricRow(tier, name)).toBe(false);
    }
  });

  it('never rides onto a catalog row (so never onto a roster row or a save)', () => {
    for (const block of Object.values(institutionalCatalog)) {
      for (const group of Object.values(block)) {
        for (const row of Object.values(group)) expect(Object.hasOwn(row, 'fabric')).toBe(false);
      }
    }
  });

  it('reads a roster row by name, and a custom house of the same name is never fabric', () => {
    expect(isFabricInstitution({ name: 'Water source', source: 'required' })).toBe(true);
    expect(isFabricInstitution({ name: 'Water source', isCustom: true })).toBe(false);
    expect(isFabricInstitution({ name: 'Water source', source: 'custom' })).toBe(false);
    expect(isFabricInstitution({ name: 'Parish church' })).toBe(false);
    expect(isFabricInstitution(null)).toBe(false);
  });

  it('X-45 already files every fabric row with no power (backing weight 0)', () => {
    for (const [, name] of FABRIC) expect(backingRowFor(name)?.weight, name).toBe(0);
  });
});
