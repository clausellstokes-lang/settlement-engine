/**
 * faceRegistry.walker.test.js — THE FACES IN THE REGISTRY (the people car, PEOPLE-1 CAST, 2026-11-07).
 *
 * The owner's charter (ODQ §934.105): "for every appropriate institution, we generate one NPC … just
 * one person per institution. They act as the face." PEOPLE-0 measured the catalogue's 180 families
 * into 144 FACE · 27 JUDGMENT · 9 NO FACE (docs/chair/2026-11-07/PEOPLE-INVENTORY-2026-11-07.md §1,
 * the table docs/chair/2026-11-07/people-0/faces.mjs); the chair ruled the 27 by five ordered rules
 * (R-P1, docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §1). This walker pins the registry mark
 * that promotes that table into src/data/institutionalCatalog.js beside the fabric and the rarity:
 * every family declares a face; every fabric row has none; the counts; the 27 as ruled; and the
 * mark never rides onto a row or a save.
 *
 * THE TRUE FIGURES (measured at this walker's birth, naming them because the brief's own guess —
 * "146 face · 2 seat · 32 null" — miscounted the keepers): by FAMILY 156 face (144 + the two
 * weight-3 houses + the ten keepers) · 2 seat · 22 null (9 no-face + 13 ground); by catalog ROW
 * (519 rows over six tiers) 440 face · 4 seat · 75 null, the fabric's fourteen rows among the null (the
 * one row above the family figures is 'District markets (5-10)', weight 3: rule (b) before rule (d)).
 */
import { describe, expect, it } from 'vitest';
import {
  FACE_SEAT, INSTITUTION_FAMILIES, familyNamesByTier, faceOfInstitution, faceOfRow, faceRows,
  fabricRows, institutionalCatalog, isFabricRow, isNoPowerInstitution,
} from '../../src/data/institutionalCatalog.js';
import { backingRowFor } from '../../src/data/institutionBacking.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The 27 judgment families as the chair ruled them (R-P1 b–e), keyed by the family's name. */
const RULED = Object.freeze({
  // (b) weight 3 is a face, always
  'International trade center': 'the exchange master',
  'Underground city': 'the undercity boss',
  // (c) the seat's building
  'City hall': FACE_SEAT,
  'Palace/government complex': FACE_SEAT,
  // (d) GROUND — no single keeper
  'Weekly market': null, 'Multiple market squares': null, 'Major annual fairs': null, 'Fish market': null,
  "Fisher's landing": null, "Furrier's district": null, 'Luxury goods quarter': null, 'Warehouse district': null,
  'Stable district': null, 'Dungeon delving supply district': null, 'Docks/port facilities': null,
  "Sage's quarter": null, 'Red light district': null,
  // (e) one keeper, a face at PEOPLE-0's proposed title
  'Listening post': 'the watcher', 'Wayside shrine': 'the shrine-keeper', 'Teleportation circle': 'the circle-keeper',
  'Rookery': 'the rookery boss', 'Golem workforce': 'the golem-master', 'Undead labor': 'the necromancer-overseer',
  'Message network (high magic)': 'the message-master',
  'Village musician': 'the musician', 'Charlatan fortune tellers': 'the fortune teller', 'Dragon resident': 'the dragon',
});
const NO_POWER = Object.freeze(['Village musician', 'Charlatan fortune tellers', 'Dragon resident']);
const FAMILY_FIGURES = Object.freeze({ face: 156, seat: 2, none: 22 });
const ROW_FIGURES = Object.freeze({ rows: 519, face: 440, seat: 4, none: 75 });
/**
 * THE ONE ROW WHERE RULE (b) TAKES FROM RULE (d): the Weekly market family is ground, but its
 * metropolis row 'District markets (5-10)' carries X-45 weight 3, and the rules are ordered — a
 * weight-3 house is a face, always, before the ground rule is reached. Measured at this walker's
 * birth (the chair's count of 13 ground families was by family weight, where this row's is a
 * tier override); recorded in docs/PEOPLE_1_CAST_2026-11-07.md.
 */
const ROW_OVERRIDES = Object.freeze({ 'metropolis/District markets (5-10)': 'the market warden' });

const familyKey = (fam) => fam.shared?.name || familyNamesByTier(fam)[0].name;
const classOf = (face) => (face === null ? 'none' : face === FACE_SEAT ? 'seat' : 'face');

describe('the people car — the faces in the registry (R-P1)', () => {
  it('every family declares a face: a title of the form "the …", the seat word, or null', () => {
    const tally = { face: 0, seat: 0, none: 0 };
    for (const fam of INSTITUTION_FAMILIES) {
      expect(Object.hasOwn(fam.shared, 'face'), `${familyKey(fam)} declares no face`).toBe(true);
      const face = fam.shared.face;
      if (face !== null && face !== FACE_SEAT) expect(face, familyKey(fam)).toMatch(/^the \S/);
      tally[classOf(face)] += 1;
    }
    expect(INSTITUTION_FAMILIES.length).toBe(180);
    expect(tally).toEqual(FAMILY_FIGURES);
  });

  it('every catalog row resolves, and the row figures are the measured ones', () => {
    const rows = faceRows();
    const tally = { rows: rows.length, face: 0, seat: 0, none: 0 };
    for (const { tier, name, face } of rows) {
      expect(face === null || typeof face === 'string', `${tier} / ${name}`).toBe(true);
      expect(faceOfRow(tier, name)).toBe(face);
      tally[classOf(face)] += 1;
    }
    expect(tally).toEqual(ROW_FIGURES);
    expect(faceOfRow('thorp', 'No such house')).toBeUndefined();
  });

  it('a FABRIC tier row has no face whatever its family says (R-P1 a)', () => {
    const fabric = fabricRows();
    expect(fabric.length).toBe(14);
    for (const { tier, name } of fabric) {
      expect(isFabricRow(tier, name)).toBe(true);
      expect(faceOfRow(tier, name), `${tier} / ${name}`).toBeNull();
      expect(faceOfInstitution({ name })).toBeNull();
    }
    // the same families' houses keep their faces: the mill at a village, the church at a town
    expect(faceOfRow('village', 'Mill')).toBe('the miller');
    expect(faceOfRow('town', 'Parish churches (2-5)')).toBe('the priest');
  });

  it('the 27 judgment families resolve exactly as the chair ruled (R-P1 b–e)', () => {
    const byKey = new Map(INSTITUTION_FAMILIES.map((fam) => [familyKey(fam), fam]));
    expect(Object.keys(RULED).length).toBe(27);
    for (const [key, face] of Object.entries(RULED)) {
      const fam = byKey.get(key);
      expect(fam, `${key} is not a family`).toBeDefined();
      expect(fam.shared.face, key).toBe(face);
      for (const { tier, name } of familyNamesByTier(fam)) {
        expect(faceOfRow(tier, name), `${tier} / ${name}`).toBe(ROW_OVERRIDES[`${tier}/${name}`] ?? face);
      }
    }
    expect(backingRowFor('District markets (5-10)')?.weight, 'the override row is weight 3').toBe(3);
    expect(backingRowFor('Weekly market')?.weight, 'the family is not').toBe(1);
  });

  it('the seat word is on the two government buildings and nowhere else', () => {
    const seats = INSTITUTION_FAMILIES.filter((fam) => fam.shared.face === FACE_SEAT).map(familyKey);
    expect(seats).toEqual(['City hall', 'Palace/government complex']);
    expect(faceRows().filter((r) => r.face === FACE_SEAT).map((r) => `${r.tier}/${r.name}`))
      .toEqual(['town/Town hall', 'city/City hall', 'metropolis/City hall', 'metropolis/Palace/government complex']);
  });

  it('a weight-3 row of a ruled family is a face or the seat, always (R-P1 b); the nine NO FACE verdicts stand', () => {
    // R-P1's five ordered rules decide the 27 JUDGMENT families; PEOPLE-0's 144 FACE and 9 NO FACE
    // verdicts stand as proposed. So (b) binds every weight-3 row of a ruled family — including the
    // Weekly market's metropolis row — and NOT the walls (the Palisade family, a NO FACE verdict,
    // weight 3 at city and metropolis by tier override): a wall has no keeper.
    let weightThree = 0;
    const faceless = [];
    for (const fam of INSTITUTION_FAMILIES) {
      const ruled = Object.hasOwn(RULED, familyKey(fam));
      for (const { tier, name } of familyNamesByTier(fam)) {
        if (isFabricRow(tier, name) || (backingRowFor(name)?.weight ?? 0) < 3) continue;
        weightThree += 1;
        if (ruled) expect(faceOfRow(tier, name), `${tier} / ${name} is weight 3 and faceless`).not.toBeNull();
        else if (faceOfRow(tier, name) === null) faceless.push(`${tier}/${name}`);
      }
    }
    expect(weightThree, 'the weight-3 rows are counted').toBeGreaterThan(20);
    expect(faceless, 'the standing NO FACE verdicts at weight 3: the walls, and only the walls')
      .toEqual(['city/City walls and gates', 'metropolis/Massive walls and fortifications']);
  });

  it('the three weight-0 persons are faces in NO power, and only they (R-P1 e)', () => {
    const flagged = INSTITUTION_FAMILIES.filter((fam) => fam.shared.noPower === true).map(familyKey);
    expect(flagged).toEqual(NO_POWER);
    for (const name of NO_POWER) {
      expect(isNoPowerInstitution({ name })).toBe(true);
      expect(backingRowFor(name)?.weight, `${name} carries X-45 weight 0`).toBe(0);
      expect(faceOfInstitution({ name })).toBe(RULED[name]);
    }
    expectAbsentWithAnchor(faceRows().filter((r) => r.noPower).map((r) => r.name), 'Citadel', 'Dragon resident');
    expect(isNoPowerInstitution({ name: 'Citadel' })).toBe(false);
  });

  it('reads a roster row by name; a custom house of the same name is never a face', () => {
    expect(faceOfInstitution({ name: 'Citadel', source: 'generated' })).toBe('the castellan');
    expect(faceOfInstitution({ name: 'Citadel', isCustom: true })).toBeNull();
    expect(faceOfInstitution({ name: 'Citadel', source: 'custom' })).toBeNull();
    expect(faceOfInstitution({ name: 'City hall' })).toBe(FACE_SEAT);
    expect(faceOfInstitution({ name: 'Weekly market' })).toBeNull();
    expect(faceOfInstitution({ name: 'A house the catalogue never placed' })).toBeNull();
    expect(faceOfInstitution(null)).toBeNull();
  });

  it('never rides onto a catalog row (so never onto a roster row or a save) — the mark is dark at this commit', () => {
    let rows = 0;
    for (const block of Object.values(institutionalCatalog)) {
      for (const group of Object.values(block)) {
        for (const row of Object.values(group)) {
          rows += 1;
          expect(Object.hasOwn(row, 'face')).toBe(false);
          expect(Object.hasOwn(row, 'noPower')).toBe(false);
        }
      }
    }
    expect(rows).toBe(ROW_FIGURES.rows);
  });
});
