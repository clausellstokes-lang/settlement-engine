/**
 * @vitest-environment jsdom
 *
 * chronicleSnapshotShape.test.jsx — THE SNAPSHOT-SHAPE PIN (ChroniclePanel full-entry modal).
 *
 * A chronicle entry's `aiSettlement` is NOT an AI-authored object. generate-narrative
 * deep-clones the GENERATOR settlement (`aiClone = deepClone(settlement)`) and its
 * per-section extract/apply pairs refine TEXT IN PLACE — apply() writes `desc` / `summary`
 * / `issue` back onto records the generator already made, and mints no keys. So the
 * snapshot this modal renders carries GENERATOR key spellings (each confirmed by an
 * executed generateSettlementPipeline probe):
 *
 *   powerStructure.factions   [faction, power, desc, category, rawPower, powerLabel]
 *   powerStructure.conflicts  [parties, issue, stakes, intensity, desc, plotHooks]
 *   institutions              [category, name, desc, tags, ...]
 *   npcs                      [id, name, role, goal, secret, ...]   ← goal.short is the blurb
 *   stress                    [type, label, icon, colour, summary, crisisHook, ...]
 *                             — and is a SINGLE OBJECT, not an array (see below)
 *
 * An earlier cut read `.name` / `.description` across all five rows — spellings NO
 * generator record carries. Every faction rendered "Unnamed: ", institutions / NPCs /
 * stressors rendered a bare label with an EMPTY blurb, and conflicts fell through the
 * `|| JSON.stringify(c)` tail and dumped raw JSON at the reader. The Stressors row had a
 * SECOND defect underneath the key one: `settlement.stress` is a single object, so
 * renderList's `Array.isArray` guard dropped that row outright and correcting its key
 * spelling alone would have been cosmetic. Same defect class as the
 * npcLadder faction-key bug (composite 25749ae5 / dc0b6e2b); same cure — rulingPower.nameOf
 * (`.faction || .name`) for the name, real key first with the legacy `.description`
 * spelling kept as a tail fallback for the blurb.
 *
 * WHY THE REAL PIPELINE, AND WHY EXPECTATIONS ARE DERIVED NOT HARD-CODED: a hand-shaped
 * fixture is exactly what hid this bug, so the shape assertions run against a REAL
 * generateSettlementPipeline settlement. But generation is NOT a pure function of its
 * config — repeated calls with identical input yield different settlements (names, counts,
 * and which optional collections populate all vary; an executed probe found `stress` absent
 * in 30 of 40 generations and ~1 in 11 NPCs lacking `goal.short`). So every expectation is
 * DERIVED from the same object being rendered, and collections that are optional in
 * practice are asserted only when present. Hard-coding a seed here would pin nothing and
 * flake in CI.
 *
 * Counter-pin: identityMarkers and frictionPoints are AI-authored WHOLESALE (apply() mints
 * plain strings / `{who, what}`), so their accessors were already correct — pinned so a
 * future "consistency" sweep doesn't 'fix' them onto generator spellings they never carry.
 */

import { afterEach, describe, test, expect } from 'vitest';
import { cleanup, render, fireEvent, within } from '@testing-library/react';
import ChroniclePanel from '../../src/components/ChroniclePanel.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

function openModal(aiSettlement) {
  const entry = {
    id: 'c1',
    reason: 'initial',
    mode: 'full',
    createdAt: '2026-07-19T12:00:00.000Z',
    thesis: 'A thesis.',
    aiSettlement,
    aiDailyLife: null,
  };
  const utils = render(<ChroniclePanel entries={[entry]} />);
  fireEvent.click(utils.getByRole('button', { name: /Narrative Chronicles/i }));
  fireEvent.click(utils.getByRole('button', { name: /Read full/i }));
  return within(utils.getByRole('dialog'));
}

// The <li> texts under the section whose heading is `heading` ([] when the row is absent).
function rowsUnder(dialog, heading) {
  const found = dialog.queryAllByText(heading, { selector: 'div' });
  if (!found.length) return [];
  const list = found[0].parentElement.querySelector('ul');
  if (!list) return [];
  return Array.from(list.querySelectorAll('li')).map((li) => li.textContent);
}

describe('THE SNAPSHOT-SHAPE BUG: real generator records render their real fields', () => {
  test('a REAL settlement carries generator spellings, not .name/.description', () => {
    // Guards the premise of every assertion below. If the generator ever renames these,
    // this test says so first, instead of the UI silently going blank again.
    const s = generateSettlementPipeline({ tier: 'city' });

    expect(s.powerStructure.factions.length).toBeGreaterThan(1);
    for (const f of s.powerStructure.factions) {
      expect(typeof f.faction).toBe('string');
      expect(f.faction.length).toBeGreaterThan(0);
      expect(f.name).toBeUndefined();
      expect(f.description).toBeUndefined();
    }

    expect(s.institutions.length).toBeGreaterThan(0);
    expect(s.institutions[0].description).toBeUndefined();
    expect(typeof s.institutions[0].desc).toBe('string');

    expect(s.npcs.length).toBeGreaterThan(0);
    for (const n of s.npcs) expect(n.description).toBeUndefined();

    for (const c of s.powerStructure.conflicts || []) {
      expect(c.description).toBeUndefined();
      expect(typeof c.desc).toBe('string');
    }
  });

  test('FACTIONS render their real name and desc — never "Unnamed", never a bare label', () => {
    const s = generateSettlementPipeline({ tier: 'city' });
    const rows = rowsUnder(openModal(s), 'Factions');
    const factions = s.powerStructure.factions;

    expect(rows.length).toBe(factions.length);
    expect(rows.length).toBeGreaterThan(1);
    factions.forEach((f, i) => {
      // Derived from the very object rendered — stable under the generator's randomness.
      expect(rows[i]).toBe(f.desc ? `${f.faction}: ${f.desc}` : f.faction);
      expect(rows[i]).toContain(f.faction);
    });
    // The pre-fix rendering, asserted directly so a regression names itself.
    for (const row of rows) expect(row).not.toMatch(/^Unnamed/);
  });

  test('CONFLICTS render prose, never a raw JSON dump', () => {
    // Conflicts are optional in generated output; find a settlement that has some.
    let s = null;
    for (let i = 0; i < 12 && !s; i++) {
      const cand = generateSettlementPipeline({ tier: 'city' });
      if ((cand.powerStructure.conflicts || []).length) s = cand;
    }
    expect(s, 'no settlement with conflicts in 12 attempts').not.toBeNull();

    const rows = rowsUnder(openModal(s), 'Conflicts');
    const conflicts = s.powerStructure.conflicts;
    expect(rows.length).toBe(conflicts.length);
    conflicts.forEach((c, i) => {
      expect(rows[i]).toBe(c.desc);
    });
    // Pre-fix this row fell through `|| JSON.stringify(c)` and showed the reader
    // `{"parties":[...],"issue":...}`. No row may contain serialized-object syntax.
    for (const row of rows) {
      expect(row).not.toMatch(/^\{/);
      expect(row).not.toContain('"parties"');
      expect(row).not.toContain('plotHooks');
    }
  });

  test('INSTITUTIONS and NPCS render their real blurb, and never a dangling colon', () => {
    const s = generateSettlementPipeline({ tier: 'city' });
    const dialog = openModal(s);

    const insts = rowsUnder(dialog, 'Institutions');
    expect(insts.length).toBe(s.institutions.length);
    expect(insts.length).toBeGreaterThan(0);
    s.institutions.forEach((it, i) => {
      expect(insts[i]).toBe(it.desc ? `${it.name}: ${it.desc}` : it.name);
    });

    const npcs = rowsUnder(dialog, 'NPCs');
    expect(npcs.length).toBe(s.npcs.length);
    expect(npcs.length).toBeGreaterThan(0);
    s.npcs.forEach((n, i) => {
      const label = n.role ? `${n.name} (${n.role})` : n.name;
      const blurb = n.goal?.short || n.secret?.what || '';
      expect(npcs[i]).toBe(blurb ? `${label}: ${blurb}` : label);
    });

    // `s.npcs` mixes two record kinds: full NPCs (goal/secret) and STRUCTURAL
    // office-holders (npcStructure.js — `generatedAs`, no blurb field of any sort).
    // Pre-fix EVERY row ended at a colon; post-fix none may, whichever kind it is.
    for (const row of [...insts, ...npcs]) expect(row).not.toMatch(/:\s*$/);

    // And the structural kind, when present, renders as a bare name — not "Name (Role): ".
    const structural = s.npcs.filter((n) => !n.goal?.short && !n.secret?.what);
    for (const n of structural) {
      expect(npcs).toContain(n.role ? `${n.name} (${n.role})` : n.name);
    }
  });

  test('STRESSORS: settlement.stress is a SINGLE OBJECT and must still render', () => {
    // THE ARRAYNESS HALF OF THIS BUG. `settlement.stress` is never an array — an executed
    // probe over 40 generations found 0 arrays, 10 plain objects, 30 absent. renderList
    // guards `if (!Array.isArray(arr) || !arr.length) return null`, so pre-fix the row was
    // DROPPED ENTIRELY on real data and correcting only its key spelling was cosmetic.
    // Find a real settlement that carries stress and assert the row actually renders.
    let s = null;
    for (let i = 0; i < 40 && !s; i++) {
      const cand = generateSettlementPipeline({ tier: ['village', 'town', 'city', 'metropolis'][i % 4] });
      if (cand.stress) s = cand;
    }
    expect(s, 'no settlement carrying stress in 40 attempts').not.toBeNull();
    // Guard the premise: if the generator ever starts emitting an array here, this says so.
    expect(Array.isArray(s.stress)).toBe(false);
    expect(typeof s.stress).toBe('object');

    const rows = rowsUnder(openModal(s), 'Stressors');
    expect(rows.length).toBe(1);
    expect(rows[0]).toBe(s.stress.summary ? `${s.stress.label}: ${s.stress.summary}` : s.stress.label);
    expect(rows[0]).not.toMatch(/:\s*$/);
  });

  test('STRESSORS: an array-shaped stress field still renders (both shapes served)', () => {
    const dialog = openModal({
      thesis: 'T',
      stress: [{
        type: 'insurgency',
        label: 'Insurgency',
        summary: 'A powerful faction has decided the government is illegitimate.',
        crisisHook: 'The governing faction cannot admit it publicly.',
      }],
    });
    expect(rowsUnder(dialog, 'Stressors')).toEqual([
      'Insurgency: A powerful faction has decided the government is illegitimate.',
    ]);
  });
});

describe('the accessors serve BOTH shapes — legacy .name/.description still renders', () => {
  test('fixture-shaped records keep working (the fallback tail is load-bearing)', () => {
    const dialog = openModal({
      thesis: 'T',
      institutions:  [{ name: 'Old Mill', description: 'A mill.' }],
      npcs:          [{ name: 'Ana', role: 'Smith', description: 'A smith.' }],
      powerStructure: {
        factions:  [{ name: 'The Reeves', description: 'They reeve.' }],
        conflicts: [{ description: 'A quarrel.' }],
      },
      stress: [{ label: 'Famine', description: 'No grain.' }],
    });

    expect(rowsUnder(dialog, 'Institutions')).toEqual(['Old Mill: A mill.']);
    expect(rowsUnder(dialog, 'NPCs')).toEqual(['Ana (Smith): A smith.']);
    expect(rowsUnder(dialog, 'Factions')).toEqual(['The Reeves: They reeve.']);
    expect(rowsUnder(dialog, 'Conflicts')).toEqual(['A quarrel.']);
    expect(rowsUnder(dialog, 'Stressors')).toEqual(['Famine: No grain.']);
  });

  test('.faction WINS over .name — the precedence that binds this row to rulingPower.nameOf', () => {
    // nameOf reads `.faction || .name`. A record carrying BOTH must render the same name
    // here as everywhere else in the app, or the chronicle and the Power tab disagree
    // about who a faction is.
    const dialog = openModal({
      thesis: 'T',
      powerStructure: { factions: [{ faction: 'Alpha', name: 'Beta', desc: 'D' }] },
    });
    expect(rowsUnder(dialog, 'Factions')).toEqual(['Alpha: D']);
  });

  test('.desc WINS over .description, .summary over .description, goal.short over secret.what', () => {
    const dialog = openModal({
      thesis: 'T',
      institutions: [{ name: 'I', desc: 'real', description: 'legacy' }],
      stress:       [{ label: 'S', summary: 'real', description: 'legacy' }],
      npcs:         [{ name: 'N', role: 'R', goal: { short: 'wants' }, secret: { what: 'hides' } }],
      powerStructure: { factions: [{ faction: 'F', desc: 'real', description: 'legacy' }] },
    });
    expect(rowsUnder(dialog, 'Institutions')).toEqual(['I: real']);
    expect(rowsUnder(dialog, 'Stressors')).toEqual(['S: real']);
    expect(rowsUnder(dialog, 'NPCs')).toEqual(['N (R): wants']);
    expect(rowsUnder(dialog, 'Factions')).toEqual(['F: real']);
  });

  test('an NPC with only a secret falls back to it; one with neither renders bare', () => {
    const dialog = openModal({
      thesis: 'T',
      npcs: [
        { name: 'Bo', role: 'Fence', secret: { what: 'launders coin.' } },
        { name: 'The Lord Mayor', role: 'Lord Mayor', generatedAs: 'structural' },
        { name: 'Solo' },
      ],
    });
    expect(rowsUnder(dialog, 'NPCs')).toEqual([
      'Bo (Fence): launders coin.',
      'The Lord Mayor (Lord Mayor)',
      'Solo',
    ]);
  });
});

describe('counter-pin: the AI-authored rows were already correct', () => {
  test('identityMarkers (plain strings) and frictionPoints ({who, what}) keep their own shape', () => {
    // These two are minted WHOLESALE by generate-narrative's apply() — the only collections
    // in this modal that are genuinely AI-shaped rather than generator-shaped. Nothing here
    // should ever be "corrected" onto .desc / .faction spellings.
    const dialog = openModal({
      thesis: 'T',
      identityMarkers: ['The bell that never rings.', 'Salt crust on every doorframe.'],
      frictionPoints:  [{ who: 'Ana and Bo', what: 'argue over the well.' }],
    });
    expect(rowsUnder(dialog, 'Identity Markers')).toEqual([
      'The bell that never rings.',
      'Salt crust on every doorframe.',
    ]);
    expect(rowsUnder(dialog, 'Friction Points')).toEqual(['Ana and Bo - argue over the well.']);
  });
});
