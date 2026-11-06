/**
 * A RELATIONSHIP DOES NOT OUTLIVE A TRIM (lane RUNG1B-F4 unit 2, 2026-11-04;
 * docs/F4_CRIME_SIGNAL_2026-11-04.md §1, cause i).
 *
 * `applyDensityLaw.js :: resizeSeats` trims the power roster to the tier's band and returned
 * `{ ...powerStructure, factions }`, so every `factionRelationships` row written before the trim
 * (its pair, its narrative, its dmNote) outlived the seat it names: 782 of 1,000 soak places kept
 * a row for a trimmed faction, 69 for a trimmed criminal faction (soak1k-4's Thieves' Guild:
 * "Ask: which specific officials have arrangements with Thieves' Guild?" on a roster with no
 * guild). The rows naming a removed seat now go with it, at the trim, in one place
 * (`pruneToRoster`). A row naming a seat that was never trimmed (a DM's own faction included) is
 * kept, and a structure the trim did not touch is returned by reference.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { pruneToRoster } from '../../src/generators/density/applyDensityLaw.js';

const namesOf = (s) => new Set((s.powerStructure?.factions || []).map((f) => f.faction ?? f.name));

describe('the trim takes its relationships with it', () => {
  beforeAll(async () => { await ensureLaws(); });

  it("soak1k-4: no relationship row names the trimmed Thieves' Guild", () => {
    const { settlement } = birth(4);
    const roster = namesOf(settlement);
    expect(roster.has("Thieves' Guild")).toBe(false);
    const rows = settlement.powerStructure.factionRelationships || [];
    expect(rows.filter((row) => row.pair.includes("Thieves' Guild"))).toEqual([]);
    expect(rows.length).toBeGreaterThan(0);
    expect(JSON.stringify(rows)).not.toMatch(/Thieves' Guild/); // anchored: the line above proves the relationship rows are live
    // every surviving row joins two seats on the final roster
    expect(rows.filter((row) => row.pair.some((name) => !roster.has(name)))).toEqual([]);
  });

  it('keeps every row that names no removed seat, a DM faction off the roster included', () => {
    const structure = {
      factions: [{ faction: 'Elder Council' }, { faction: 'Merchant Guilds' }],
      factionRelationships: [
        { pair: ['Elder Council', 'Merchant Guilds'], narrative: 'kept' },
        { pair: ['Elder Council', "Thieves' Guild"], narrative: 'goes with the guild' },
        { pair: ['Elder Council', 'The Lantern Society'], narrative: 'a DM row, kept' },
      ],
    };
    const pruned = pruneToRoster(structure, new Set(["Thieves' Guild"]));
    expect(pruned.factionRelationships.map((row) => row.narrative)).toEqual(['kept', 'a DM row, kept']);
    expect(pruned.factions).toBe(structure.factions);
    expect(structure.factionRelationships).toHaveLength(3); // the input is not written
  });

  it('a structure the trim did not touch is returned by reference', () => {
    const structure = { factions: [{ faction: 'Elder Council' }], factionRelationships: [{ pair: ['Elder Council', 'Merchant Guilds'] }] };
    expect(pruneToRoster(structure, new Set())).toBe(structure);
    expect(pruneToRoster(structure, new Set(["Thieves' Guild"]))).toBe(structure);
  });
});
