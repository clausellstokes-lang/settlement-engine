/**
 * faceRegistry.walker.test.js — THE FACES IN THE REGISTRY (the people car, PEOPLE-1 CAST, 2026-11-07;
 * step 1, re-pinned at step 1b to THE REVISED FACE CENSUS).
 *
 * The owner's charter (ODQ §934.105): "for every appropriate institution, we generate one NPC … just
 * one person per institution. They act as the face." The owner's correction of 2026-11-07 (quoted
 * in docs/chair/2026-11-07/PEOPLE-FACE-CENSUS-2026-11-07.md on the integration branch): "think of the
 * substance of each institution holistically … Slave markets as a whole institution would get a
 * representative … Town or larger level inns give the DM a reasonable NPC". THE TEST (the owner's):
 * taken as a whole, does the institution have someone who runs it or stands for it, so the DM has a
 * face the players can meet? That census SUPERSEDES PEOPLE-RULINGS R-P1's ordered rules and
 * withdraws the weight-3 precedence (a metropolis's 'District markets (5-10)' is a market, NONE).
 *
 * This walker pins the registry mark that carries the census in src/data/institutionalCatalog.js
 * beside the fabric and the rarity: every family declares a face; every fabric row has none; the
 * NONE list and the seat word as the census lists them; the per-tier-row titles where the row's
 * kind changes; the counts; and the mark never rides onto a row or a save.
 *
 * THE TRUE FIGURES (measured at step 1b): by FAMILY 164 face · 2 seat · 14 null; by catalog ROW
 * (519 rows over six tiers) 458 face · 4 seat · 57 null (the fabric's fourteen, the three row-level
 * NONEs — the thorp Household levy, the village Parish church — and the wholly-NONE families' rows
 * among them); 36 per-tier-row overrides; 184 distinct titles.
 */
import { describe, expect, it } from 'vitest';
import {
  FACE_SEAT, INSTITUTION_FAMILIES, familyNamesByTier, faceOfInstitution, faceOfRow, faceRows,
  fabricRows, institutionalCatalog, isFabricRow, isNoPowerInstitution,
} from '../../src/data/institutionalCatalog.js';
import { backingRowFor } from '../../src/data/institutionBacking.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The census's NONE families (13, wholly, after the owner's fish-market amendment), by the family's name. */
const NONE_FAMILIES = Object.freeze([
  'Subsistence farming', 'Common grazing land', 'Communal root cellar',
  'Weekly market', 'Multiple market squares', 'Major annual fairs',
  'Burial ground', 'Dwellings (1-8)', 'Water source', 'Sewage system', 'Palisade or earthworks', 'Gates (if walled)',
  'Wayside shrine',
]);
/** The census's row-level NONEs inside FACE families (the fabric rows aside). */
const NONE_ROWS = Object.freeze([['thorp', 'Household levy']]);
/** The seat's two buildings. */
const SEAT_FAMILIES = Object.freeze(['City hall', 'Palace/government complex']);
/** The per-tier-row titles where the row's kind changes (a sample of the 36; the rest are the senior forms). */
const ROW_TITLES = Object.freeze({
  'town/Taverns (5-20)': 'the tavern keeper', 'hamlet/Alehouse': 'the alewife',
  'village/Waystation': 'the waystation keeper', "town/Caravaneer's post": "the post's master", "city/Caravan masters' exchange": "the exchange's steward",
  'hamlet/Stable yard': 'the stable keeper', 'town/Stable district': 'the stable master',
  'city/City granaries': 'the master of granaries', 'town/Town granary': 'the granary reeve',
  'village/Blacksmith': 'the smith', 'town/Blacksmiths (3-10)': 'the master smith',
  'village/Carpenter': 'the carpenter', 'city/Carpenters (5-15)': 'the master carpenter',
  'town/Parish churches (2-5)': 'the dean', 'city/Multiple monasteries': 'the senior abbot', "metropolis/Hospital network": "the hospital's master",
  "town/Lord's appointee": "the lord's appointee", 'city/Noble governor': 'the governor',
  'village/Village reeve': 'the reeve', 'town/Town council': 'the first councillor', 'city/City administration': 'the chief administrator',
  'city/Multiple courthouses': 'the chief magistrate', 'metropolis/Massive prison': 'the prison warden',
  'hamlet/Citizen militia': 'the militia captain', 'town/Town watch': 'the watch captain', 'city/Professional city watch': 'the watch commander',
  'hamlet/Traveling hedge wizard': 'the hedge wizard', 'town/Wizard\'s tower': 'the wizard',
  "city/Multiple adventurers' guilds": 'the senior charter master', 'city/Smuggling network': "the network's head",
  'town/Traveling performers': 'the troupe leader', 'village/Village musician': 'the musician',
  'metropolis/District markets (5-10)': null, 'hamlet/Wayside inn': 'the innkeeper', 'town/Slave market': 'the slaver',
  'city/Luxury goods quarter': 'the luxury merchant', "city/Furrier's district": 'the master furrier', 'town/Docks/port facilities': 'the wharfinger',
  'town/Merchant warehouses': 'the warehouse factor', 'city/Dungeon delving supply district': 'the outfitter', "city/Sage's quarter": 'the sage',
  'thorp/Fishing community': 'the boat-headman', 'town/Street gang': 'the gang boss', 'town/Free company hall': 'the company captain',
});
const NO_POWER = Object.freeze(['Village musician', 'Charlatan fortune tellers', 'Dragon resident']);
const FAMILY_FIGURES = Object.freeze({ face: 165, seat: 2, none: 13 });
const ROW_FIGURES = Object.freeze({ rows: 519, face: 463, seat: 4, none: 52 });
const OVERRIDES = 36;
const DISTINCT_TITLES = 185;

const familyKey = (fam) => fam.shared?.name || familyNamesByTier(fam)[0].name;
const classOf = (face) => (face === null ? 'none' : face === FACE_SEAT ? 'seat' : 'face');

describe('the people car — the faces in the registry (the revised census)', () => {
  it('every family declares a face: a title of the form "the …", the seat word, or null', () => {
    const tally = { face: 0, seat: 0, none: 0 };
    let overrides = 0;
    for (const fam of INSTITUTION_FAMILIES) {
      expect(Object.hasOwn(fam.shared, 'face'), `${familyKey(fam)} declares no face`).toBe(true);
      const face = fam.shared.face;
      if (face !== null && face !== FACE_SEAT) expect(face, familyKey(fam)).toMatch(/^the \S/);
      tally[classOf(face)] += 1;
      for (const entry of Object.values(fam.at)) if (Object.hasOwn(entry, 'face')) overrides += 1;
    }
    expect(INSTITUTION_FAMILIES.length).toBe(180);
    expect(tally).toEqual(FAMILY_FIGURES);
    expect(overrides, 'the per-tier-row overrides').toBe(OVERRIDES);
  });

  it('every catalog row resolves, and the row figures are the measured ones', () => {
    const rows = faceRows();
    const tally = { rows: rows.length, face: 0, seat: 0, none: 0 };
    const titles = new Set();
    for (const { tier, name, face } of rows) {
      expect(face === null || typeof face === 'string', `${tier} / ${name}`).toBe(true);
      expect(faceOfRow(tier, name)).toBe(face);
      tally[classOf(face)] += 1;
      if (face && face !== FACE_SEAT) titles.add(face);
    }
    expect(tally).toEqual(ROW_FIGURES);
    expect(titles.size, 'distinct titles').toBe(DISTINCT_TITLES);
    expect(faceOfRow('thorp', 'No such house')).toBeUndefined();
  });

  it('a FABRIC tier row has no face whatever its family says (X-46 car 3)', () => {
    const fabric = fabricRows();
    expect(fabric.length).toBe(14);
    for (const { tier, name } of fabric) {
      expect(isFabricRow(tier, name)).toBe(true);
      expect(faceOfRow(tier, name), `${tier} / ${name}`).toBeNull();
      expect(faceOfInstitution({ name })).toBeNull();
    }
    // the same families' houses keep their faces: the mill at a village, the dean at a town
    expect(faceOfRow('village', 'Mill')).toBe('the miller');
    expect(faceOfRow('town', 'Parish churches (2-5)')).toBe('the dean');
  });

  it('the NONE list is the census\'s: fourteen families wholly, and the levy and the village church rows', () => {
    const byKey = new Map(INSTITUTION_FAMILIES.map((fam) => [familyKey(fam), fam]));
    for (const key of NONE_FAMILIES) {
      const fam = byKey.get(key);
      expect(fam, `${key} is not a family`).toBeDefined();
      expect(fam.shared.face, key).toBeNull();
      for (const { tier, name } of familyNamesByTier(fam)) expect(faceOfRow(tier, name), `${tier} / ${name}`).toBeNull();
    }
    for (const [tier, name] of NONE_ROWS) expect(faceOfRow(tier, name), `${tier} / ${name}`).toBeNull();
    // and nothing else is null that is not fabric
    const nulls = faceRows().filter((r) => r.face === null && !isFabricRow(r.tier, r.name));
    const noneKeys = new Set(NONE_FAMILIES);
    const stray = nulls.filter((r) => !NONE_ROWS.some(([t, n]) => t === r.tier && n === r.name)
      && !noneKeys.has(familyKeyOfName(r.name)));
    expect(stray.map((r) => `${r.tier}/${r.name}`), 'no other row is faceless').toEqual([]);
    expect(nulls.length).toBe(ROW_FIGURES.none - 14); // 14 fabric rows resolve null and are not census NONEs
  });

  it('the seat word is on the two government buildings and nowhere else', () => {
    const seats = INSTITUTION_FAMILIES.filter((fam) => fam.shared.face === FACE_SEAT).map(familyKey);
    expect(seats).toEqual(SEAT_FAMILIES);
    expect(faceRows().filter((r) => r.face === FACE_SEAT).map((r) => `${r.tier}/${r.name}`))
      .toEqual(['town/Town hall', 'city/City hall', 'metropolis/City hall', 'metropolis/Palace/government complex']);
  });

  it('the per-tier-row titles are the census\'s where the row\'s kind changes; the weight-3 precedence is withdrawn', () => {
    for (const [row, title] of Object.entries(ROW_TITLES)) {
      const [tier, ...rest] = row.split('/');
      expect(faceOfRow(tier, rest.join('/')), row).toBe(title);
    }
    expect(backingRowFor('District markets (5-10)')?.weight, 'the metropolis market is weight 3 and a market').toBe(3);
  });

  it('the three weight-0 persons are faces in NO power, and only they', () => {
    const flagged = INSTITUTION_FAMILIES.filter((fam) => fam.shared.noPower === true).map(familyKey);
    expect(flagged).toEqual(NO_POWER);
    for (const name of ['Village musician', 'Traveling performers', 'Charlatan fortune tellers', 'Dragon resident']) {
      expect(isNoPowerInstitution({ name })).toBe(true);
      expect(backingRowFor(name)?.weight, `${name} carries X-45 weight 0`).toBe(0);
      expect(faceOfInstitution({ name })).toMatch(/^the /);
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
    expect(faceOfInstitution({ name: 'Slave market' })).toBe('the slaver');
    expect(faceOfInstitution({ name: 'A house the catalogue never placed' })).toBeNull();
    expect(faceOfInstitution(null)).toBeNull();
  });

  it('never rides onto a catalog row (so never onto a roster row or a save)', () => {
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

/** The family key of a tier name (the walker's own read of the registry). */
function familyKeyOfName(name) {
  for (const fam of INSTITUTION_FAMILIES) if (familyNamesByTier(fam).some((n) => n.name === name)) return familyKey(fam);
  return null;
}
