/**
 * tests/domain/personaSlicerFactionRoster.test.js — THE FACTION-KEY PIN (persona slicer).
 *
 * buildPersonaSlice's `faction` facet carries the home settlement's ROSTER. An earlier cut
 * read the display name as `f?.name`:
 *
 *   roster: (home?.powerStructure?.factions || home?.factions || [])
 *             .map((f) => (typeof f === 'string' ? f : f?.name)).filter(Boolean).slice(0, 8)
 *
 * Real `powerStructure.factions` records carry the display name in `.faction` and carry NO
 * `.name` at all — confirmed by an executed generateSettlementPipeline probe over 361 records
 * across all six tiers (keys: faction, modifier, power, desc, isGoverning, category, rawPower,
 * powerLabel, modifiers, legitimacyCrisis, crisisNote; zero exceptions). So `.name` was
 * undefined on every record, `.filter(Boolean)` dropped them all, and the roster was ALWAYS
 * `[]`. It failed SILENTLY: an empty roster is indistinguishable from a settlement that
 * genuinely has no factions, so every persona built from this slice would speak as though its
 * settlement had no politics at all.
 *
 * Same defect class as the npcLadder faction key (composite 25749ae5 / dc0b6e2b) and the
 * ChroniclePanel snapshot rows (tests/ui/chronicleSnapshotShape.test.jsx). Same cure: route
 * through the canonical accessor `rulingPower.nameOf` (`.faction || .name`) rather than
 * hand-rolling a fourth spelling of it.
 *
 * WHY THE `typeof f === 'string'` ARM SURVIVES THE FIX: nameOf reads PROPERTIES, so it returns
 * '' for a bare string and `.filter(Boolean)` would silently drop it. The arm is load-bearing,
 * not vestigial, and is pinned below.
 *
 * THREE SHAPES REACH THIS LINE — the reason the canonical accessor is the right cure rather
 * than a per-arm special case:
 *   1. `powerStructure.factions`     — generator records, `.faction`.
 *   2. a settlement's TOP-LEVEL `.factions` — a genuinely DIFFERENT record type: the NPC
 *      grouping list (keys [name, members, dominantCategory, powerFactionName,
 *      powerFactionCat, powerFactionPower, powerFactionFallback]), which legitimately
 *      carries `.name`. Present on 60 of 60 probed settlements.
 *   3. a NEIGHBOUR's top-level `.factions` — powerStructure-SHAPED records (`.faction`),
 *      per neighbourGenerator.js:180 and its :200 comment.
 * nameOf reads `.faction || .name` and therefore serves all three.
 *
 * WHY THE REAL PIPELINE, AND WHY EXPECTATIONS ARE DERIVED NOT HARD-CODED: the pre-existing
 * suite fixture (tests/domain/personaSlicer.test.js) declares
 * `powerStructure: { factions: [{ name: 'The Guildhall' }] }` — a `.name`-shaped record no
 * generator makes. That fixture is exactly what hid this bug, the same way `.name`-shaped
 * fixtures hid it in the ladder lane. So the shape assertions here run against REAL
 * generateSettlementPipeline settlements. But generation is NOT a pure function of its config
 * — repeated calls with identical input yield different settlements (names, counts, and which
 * optional collections populate all vary), so every expectation is DERIVED from the same
 * object being sliced. Hard-coding a seed or a name here would pin nothing and flake in CI.
 */

import { describe, it, expect } from 'vitest';
import { buildPersonaSlice } from '../../src/domain/ai/personaSlicer.js';
import { nameOf } from '../../src/domain/rulingPower.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

/** The roster the slicer builds for `settlement` spoken as itself. */
function rosterFor(settlement) {
  const slice = buildPersonaSlice({ entity: settlement, entityClass: 'settlement', settlement });
  const f = slice.facets.find((x) => x.manifestKey === 'faction');
  expect(f, 'the faction facet must always be emitted (manifest parity)').toBeTruthy();
  return f.data.roster;
}

describe('THE FACTION-KEY BUG: the persona roster reads the canonical .faction field', () => {
  it('GUARDS THE PREMISE — real powerStructure factions carry .faction and NOT .name', () => {
    // If the generator ever renames this field, this test says so FIRST, instead of the
    // roster silently going empty again.
    let checked = 0;
    for (const tier of TIERS) {
      const s = generateSettlementPipeline({ tier });
      for (const f of s.powerStructure.factions || []) {
        expect(typeof f.faction).toBe('string');
        expect(f.faction.length).toBeGreaterThan(0);
        expect(f.name).toBeUndefined();
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('THE REGRESSION: a real settlement yields a NON-EMPTY roster of its real faction names', () => {
    const s = generateSettlementPipeline({ tier: 'city' });
    const factions = s.powerStructure.factions;
    expect(factions.length).toBeGreaterThan(1);

    const roster = rosterFor(s);

    // Pre-fix this was `[]` on every settlement at every tier. That is the whole bug.
    expect(roster.length).toBeGreaterThan(0);
    // Derived from the very object sliced — stable under the generator's randomness.
    expect(roster).toEqual(factions.slice(0, 8).map((f) => f.faction));
    for (const entry of roster) expect(typeof entry).toBe('string');
  });

  it('holds at EVERY tier — the empty roster was universal, so the pin must be too', () => {
    for (const tier of TIERS) {
      const s = generateSettlementPipeline({ tier });
      const factions = s.powerStructure.factions || [];
      // Every tier probed carries factions; assert that premise rather than skipping past it.
      expect(factions.length, `tier ${tier} generated no factions`).toBeGreaterThan(0);
      expect(rosterFor(s)).toEqual(factions.slice(0, 8).map((f) => f.faction));
    }
  });

  it('routes through rulingPower.nameOf — not a fourth hand-rolled accessor', () => {
    // Binds the roster to the canonical accessor by construction: whatever nameOf returns for
    // the record is what the roster must carry. A future reorder of nameOf's arms that this
    // call site did not follow shows up here.
    const s = generateSettlementPipeline({ tier: 'metropolis' });
    expect(rosterFor(s)).toEqual(
      s.powerStructure.factions.slice(0, 8).map((f) => nameOf(f)).filter(Boolean),
    );
  });
});

describe('the accessor serves all three shapes that reach this line', () => {
  it('SHAPE 1 — powerStructure.factions (`.faction`) wins over the top-level list', () => {
    // The `||` short-circuits, and a real settlement carries BOTH keys (top-level `.factions`
    // was present on 60 of 60 probed settlements), so this precedence is live on every real
    // settlement — not a hypothetical. The roster must describe the POWER structure, never the
    // NPC grouping list that happens to sit at `.factions`.
    const roster = rosterFor({
      id: 's1',
      powerStructure: { factions: [{ faction: 'The Guildhall', power: 40 }] },
      factions: [{ name: 'Millers', members: ['n1'] }],
    });
    expect(roster).toEqual(['The Guildhall']);
    expect(roster).not.toContain('Millers');
  });

  it('SHAPE 2 — a real settlement top-level `.factions` is the NPC grouping list, keyed .name', () => {
    // Guards the premise that these are genuinely a different record type, so nobody
    // "consistency-fixes" this fallback onto `.faction` and empties it.
    const s = generateSettlementPipeline({ tier: 'city' });
    expect(Array.isArray(s.factions)).toBe(true);
    expect(s.factions.length).toBeGreaterThan(0);
    for (const g of s.factions) {
      expect(typeof g.name).toBe('string');
      expect(g.faction).toBeUndefined();
    }
    // Reached only when powerStructure carries none — then the grouping names are the roster.
    const roster = rosterFor({ id: 's2', powerStructure: {}, factions: s.factions });
    expect(roster).toEqual(s.factions.slice(0, 8).map((g) => g.name));
    expect(roster.length).toBeGreaterThan(0);
  });

  it('SHAPE 3 — a neighbour top-level `.factions` is powerStructure-SHAPED (`.faction`)', () => {
    // neighbourGenerator.js:180 fills a neighbour's top-level `.factions` from powerStructure
    // factions (see its :200 comment). Same key as shape 1 in the slot of shape 2 — the case a
    // per-arm special case (`.faction` here, `.name` there) would silently drop.
    expect(rosterFor({ id: 's3', factions: [{ faction: 'Harbour Watch', power: 30 }] }))
      .toEqual(['Harbour Watch']);
  });

  it('THE STRING ARM IS LOAD-BEARING — nameOf returns "" for a bare string', () => {
    // Pinned because the arm looks vestigial next to nameOf and is the obvious thing to delete
    // in a cleanup. nameOf reads properties, so dropping the arm sends every string through it,
    // yields '', and `.filter(Boolean)` empties the roster — re-creating this exact bug.
    expect(nameOf('The Guildhall')).toBe('');
    expect(rosterFor({ id: 's4', powerStructure: { factions: ['The Guildhall', 'The Watch'] } }))
      .toEqual(['The Guildhall', 'The Watch']);
    // and mixed string/record lists both resolve
    expect(rosterFor({
      id: 's5',
      powerStructure: { factions: ['Bare String', { faction: 'Recorded' }, { name: 'Legacy' }] },
    })).toEqual(['Bare String', 'Recorded', 'Legacy']);
  });

  it('.faction WINS over .name — the precedence that binds this to rulingPower.nameOf', () => {
    // A record carrying BOTH must name the faction the same way every other surface does, or
    // the persona and the Power tab disagree about who a faction is.
    expect(rosterFor({ id: 's6', powerStructure: { factions: [{ faction: 'Alpha', name: 'Beta' }] } }))
      .toEqual(['Alpha']);
  });
});

describe('the roster contract survives the degenerate shapes', () => {
  it('caps at 8 and drops unnameable records without collapsing the rest', () => {
    const many = Array.from({ length: 12 }, (_, i) => ({ faction: `F${i}` }));
    expect(rosterFor({ id: 's7', powerStructure: { factions: many } }))
      .toEqual(['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7']);

    // A nameless record is dropped (filter(Boolean)) — but must not take its neighbours with
    // it. Pre-fix EVERY record looked like this one.
    expect(rosterFor({
      id: 's8',
      powerStructure: { factions: [{ faction: 'Kept' }, { power: 10 }, null, { faction: 'Also kept' }] },
    })).toEqual(['Kept', 'Also kept']);
  });

  it('a settlement with no factions anywhere still yields [] and never throws', () => {
    // The muted-facet contract: a dormant read degrades, never gaps. This is also the reading
    // the bug was indistinguishable from — pinned so the two stay distinguishable.
    expect(rosterFor({ id: 's9' })).toEqual([]);
    expect(rosterFor({ id: 's10', powerStructure: { factions: [] }, factions: [] })).toEqual([]);
  });
});
