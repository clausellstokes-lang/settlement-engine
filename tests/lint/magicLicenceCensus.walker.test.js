/**
 * magicLicenceCensus.walker.test.js — MF-CH2a, THE MAGIC LICENCE (declaration half).
 *
 * WHAT THE CAR IS. Six code paths decided whether an institution needs magic, and five of
 * them decided it by the SHELF the author filed the row on — `category === 'Magic'`,
 * `cat === 'exotic'` — or by a bare substring of its NAME. A shelf is a display bucket; it
 * cannot tell a chemical trade from a summoning circle, and it filed `Great library`
 * (authored `tags: ['education']`) beside `Planar embassy`. R-INST-5 §Σ.3 answered with a
 * DECLARED per-entry field in the four tokens `getMagicLevel` already emits, and this walker
 * is the guard on the declaration half: the field exists on every row that needs one, means
 * one thing, and is spelled from ONE vocabulary.
 *
 * ⚠ THIS CAR CHANGES NO GENERATED ROSTER, AND ARM A7 IS THAT CLAIM AS A TEST. The gates are
 * MF-CH2b's business. Measured over the golden master's own grid × the five magic cases —
 * 504 × 5 = 2,520 settlements — MF-CH2a moves ZERO rosters and 657 record hashes, and the
 * 657 are the `magicLicense` key itself being spread onto the record by `assembleInstitutions`
 * (ODQ §503.2's second law). That is a DECLARED golden re-record, not a behaviour change.
 *
 * ⚠ THE 28-ROW TABLE BELOW IS EXACT ON PURPOSE. A new Magic or Exotic row that arrives
 * without a licence, or with a licence nobody ruled, reds A1 — which is the point: an arcane
 * institution's magic dependence is an authoring decision, and the estate has just spent a
 * train proving that inferring it from a bucket is how a library became a spellbook.
 *
 * @enforced-by this test file
 */
import { describe, it, expect } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import {
  MAGIC_LICENCE_LEVELS,
  getMagicLevel,
  magicLicenceAtLeast,
  normaliseMagicLicence,
} from '../../src/data/constants.js';
import {
  institutionCatalogArcaneTag,
  institutionCatalogMagicLicence,
  conflictingMagicLicenceCatalogNames,
  isArcaneInstitution,
  licensedCatalogInstitutionNames,
} from '../../src/domain/arcaneInstitutionIdentity.js';
import { ARCANE_IDENTITY } from '../../src/domain/arcaneIdentity.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';

/** Every catalog row as the generator shapes it: `{ category, name, ...entry }`. */
function catalogRows() {
  const rows = [];
  for (const [tier, shelves] of Object.entries(institutionalCatalog)) {
    for (const [category, insts] of Object.entries(shelves)) {
      for (const [name, def] of Object.entries(insts)) {
        rows.push({ tier, category, name, def });
      }
    }
  }
  return rows;
}

const ROWS = catalogRows();
const SHELF_ROWS = ROWS.filter(r => r.category === 'Magic' || r.category === 'Exotic');

/**
 * THE DECLARED LICENCE TABLE — R-INST-5 §Σ.3's verdict table restricted to the rows that sit
 * on a gated shelf. R-INST-5 records 32 verdicts; four of them (`Adventurers' charter hall`
 * at town, `Charlatan fortune tellers`, `Beast trainers`, `Multiple adventurers' guilds`) sit
 * on the Adventuring shelf, which no magic gate reads, so they carry a verdict but no field.
 * 32 − 4 = 28, and the four excluded verdicts are all NONE, which is why the distribution
 * below reads 7/5/4/12 against the dossier's own 11/5/4/12.
 */
const DECLARED_LICENCES = Object.freeze({
  "hamlet|Magic|Traveling hedge wizard": 'low',
  "hamlet|Magic|Adventurers' charter hall": 'none',
  "village|Magic|Hedge wizard": 'low',
  "village|Magic|Druid Circle": 'low',
  "village|Magic|Adventurers' charter hall": 'none',
  "village|Magic|Healer (divine, 1st level)": 'low',
  "town|Magic|Wizard's tower": 'medium',
  "town|Magic|Elder Grove Council": 'low',
  "town|Magic|Alchemist shop": 'none',
  "town|Magic|Warden's Lodge": 'none',
  "town|Magic|Teleportation circle": 'high',
  "city|Magic|Wizard's tower": 'medium',
  "city|Magic|Mages' guild": 'medium',
  "city|Magic|Alchemist quarter": 'none',
  "city|Magic|Enchanter's shop": 'high',
  "city|Magic|Scroll scribe": 'medium',
  "city|Magic|Teleportation circle": 'high',
  "city|Exotic|Planar traders": 'high',
  "city|Exotic|Dragon resident": 'none',
  "city|Exotic|Golem workforce": 'high',
  "city|Exotic|Undead labor": 'high',
  "city|Exotic|Dream parlors (high magic)": 'high',
  "city|Exotic|Airship docking (high magic)": 'high',
  "city|Exotic|Message network (high magic)": 'high',
  "metropolis|Magic|Academy of magic": 'high',
  "metropolis|Magic|Mages' district": 'high',
  "metropolis|Magic|Great library": 'none',
  "metropolis|Magic|Planar embassy": 'high',
});

/**
 * THE ROWS WHERE THE DECLARED LICENCE OUTRANKS THE AUTHORED TAG, and the direction each one
 * moves. R-BLD-5 ruled the tag authoritative; a licence is the same authored semantics at four
 * rungs instead of one bit, so where both exist the licence answers. A NEW row joining this set
 * is a real decision and comes back here for it.
 *
 * ⭐ FOUR → ONE on 2026-08-24 (TE-CH-5, ODQ §541), and the shrink is the POINT of that car, not
 * a weakening of this arm. Three of the four rows were `magicLicense: 'none'` rows carrying a
 * literal `arcane` tag, and this walker was built to make that divergence impossible to ship
 * quietly. TE-CH-5 removed the divergence AT THE DATA rather than ordering it by a rule: those
 * three rows dropped the redundant `arcane` tag (`Alchemist shop` → ['alchemy'],
 * `Alchemist quarter` → ['alchemy'], `Warden's Lodge` → ['military']), so tag and licence now
 * AGREE on them and there is nothing left for a precedence rule to arbitrate. The tag reader
 * was NOT routed through the licence — see A8.
 *
 * ⚠ THE ONE SURVIVOR MOVES THE OTHER WAY and is NOT discharged. `Healer (divine, 1st level)`
 * is tagged mundane (`['divine','healing']`) and licensed `low`, so the licence pulls it ONTO
 * the arcane side — meaning a magic-free world can hold no divine healer. That is a live
 * deity-doctrine question ("faith is culture, never theological") and it is deliberately left
 * standing here for the car that owns it.
 */
const LICENCE_OVERRIDES_TAG = Object.freeze({
  'Healer (divine, 1st level)': { tag: 'mundane', licence: 'low', arcane: true },
});

describe('MF-CH2a — the magic licence is declared, single-vocabulary and inert on the roster', () => {
  it('A0 (non-vacuity floor) — the name index reproduces the catalog field on every row', () => {
    // A1..A5 all read the index rather than the file. If the index were empty or wrongly
    // keyed, those arms would pass over nothing. This arm holds the index live against the
    // raw catalog bytes on all 311 rows before any other arm trusts it.
    const fromFile = new Map();
    for (const { name, def } of ROWS) {
      const licence = normaliseMagicLicence(def.magicLicense);
      if (licence !== null) fromFile.set(name.trim().toLowerCase(), licence);
    }
    expect(fromFile.size).toBeGreaterThan(0);
    expect([...fromFile.keys()].sort()).toEqual([...licensedCatalogInstitutionNames()].sort());
    for (const [key, licence] of fromFile) {
      expect(institutionCatalogMagicLicence(key), key).toBe(licence);
    }
    // and a name the catalog has never heard of resolves to null rather than to a default
    expect(institutionCatalogMagicLicence('Bob’s Reasonably Priced Portals')).toBeNull();
    expect(institutionCatalogMagicLicence('')).toBeNull();
    expect(institutionCatalogMagicLicence(null)).toBeNull();
  });

  it('A1 — every Magic/Exotic row declares a licence in the four tokens, and no other row does', () => {
    const actual = {};
    for (const { tier, category, name, def } of ROWS) {
      if (!('magicLicense' in def)) continue;
      actual[`${tier}|${category}|${name}`] = def.magicLicense;
    }
    expect(actual).toEqual(DECLARED_LICENCES);
    expect(SHELF_ROWS.length).toBe(28);
    for (const { tier, category, name, def } of SHELF_ROWS) {
      expect(MAGIC_LICENCE_LEVELS, `${tier}/${category}/${name}`)
        .toContain(def.magicLicense);
    }
  });

  it('A2 — the distribution is R-INST-5 §Σ.3 restricted to the shelves, and the arithmetic closes', () => {
    // ⚠ COUNTED OFF THE CATALOG, NEVER OFF THE TABLE ABOVE. Counting the frozen table would
    // be a list compared with itself — the pin-vacuity shape this estate has been bitten by
    // — and would pass on a catalog whose values had all moved.
    const dist = { none: 0, low: 0, medium: 0, high: 0 };
    for (const { def } of ROWS) {
      const licence = normaliseMagicLicence(def.magicLicense);
      if (licence !== null) dist[licence] += 1;
    }
    expect(dist).toEqual({ none: 7, low: 5, medium: 4, high: 12 });
    expect(dist.none + dist.low + dist.medium + dist.high).toBe(SHELF_ROWS.length);
    // the dossier's whole-table figure, minus the four Adventuring hand-offs it also ruled NONE
    expect(dist.none + 4).toBe(11);
  });

  it('A3 — the licence is keyed by NAME, and every repeated name agrees across its tiers', () => {
    expect(conflictingMagicLicenceCatalogNames()).toEqual([]);
    // The three names the Magic/Exotic shelves repeat. Keying by name is only safe because
    // these agree, so the agreement is pinned rather than assumed.
    expect(institutionCatalogMagicLicence("Adventurers' charter hall")).toBe('none');
    expect(institutionCatalogMagicLicence("Wizard's tower")).toBe('medium');
    expect(institutionCatalogMagicLicence('Teleportation circle')).toBe('high');
    // DECLARED CONSEQUENCE of name-keying: the town/Adventuring `Adventurers' charter hall`
    // carries no field of its own and still resolves, because two Magic-shelf rows share its
    // name. R-INST-5 row 12 rules that row NONE as well, so the inherited answer is the
    // dossier's answer; it is written down here so no successor reads it as an accident.
    const townHall = ROWS.find(r => r.tier === 'town' && r.category === 'Adventuring'
      && r.name === "Adventurers' charter hall");
    expect(townHall).toBeTruthy();
    expect('magicLicense' in townHall.def).toBe(false);
    expect(institutionCatalogMagicLicence(townHall.name)).toBe('none');
  });

  it('A4 — magicLicenceAtLeast is total and pure over the ladder, and silence is never permission', () => {
    expect(MAGIC_LICENCE_LEVELS).toEqual(['none', 'low', 'medium', 'high']);
    for (let i = 0; i < MAGIC_LICENCE_LEVELS.length; i += 1) {
      for (let j = 0; j < MAGIC_LICENCE_LEVELS.length; j += 1) {
        expect(
          magicLicenceAtLeast(MAGIC_LICENCE_LEVELS[i], MAGIC_LICENCE_LEVELS[j]),
          `${MAGIC_LICENCE_LEVELS[i]} >= ${MAGIC_LICENCE_LEVELS[j]}`,
        ).toBe(i >= j);
      }
    }
    // An absent or unknown licence answers FALSE on both sides — a gate may not read "I do
    // not know" as "yes", and it may not read it as "no" either, which is why every gate
    // branches on `licence !== null` before it asks the ladder anything.
    for (const bad of [null, undefined, '', 'extreme', 'arcane', 'none ish', 3, {}, [], NaN]) {
      expect(magicLicenceAtLeast(bad, 'none'), String(bad)).toBe(false);
      expect(magicLicenceAtLeast('high', bad), String(bad)).toBe(false);
      expect(normaliseMagicLicence(bad), String(bad)).toBeNull();
    }
    // TOLERANT ON SHAPE, STRICT ON VOCABULARY — the same contract normTags/normName use in
    // this estate. Case and surrounding space are authoring noise and are absorbed; a token
    // outside the ladder is not noise and is refused above.
    for (const [written, token] of [['none', 'none'], ['NONE', 'none'], ['High', 'high'],
      ['  medium  ', 'medium'], ['LoW', 'low']]) {
      expect(normaliseMagicLicence(written), written).toBe(token);
    }
    expect(() => magicLicenceAtLeast(null, null)).not.toThrow();
  });

  it('A5 — the licence outranks the tag on EXACTLY one row, and it is the divine healer', () => {
    const observed = {};
    for (const { category, name, def } of ROWS) {
      const licence = institutionCatalogMagicLicence(name);
      if (licence === null) continue;
      const tag = institutionCatalogArcaneTag(name);
      const arcane = isArcaneInstitution(name, category);
      if (arcane === (tag === ARCANE_IDENTITY.ARCANE)) continue;
      observed[name] = { tag, licence, arcane };
      void def;
    }
    expect(observed).toEqual(LICENCE_OVERRIDES_TAG);
  });

  it('A6 — getMagicLevel and the licence ladder are ONE vocabulary, spelled once', () => {
    const emitted = new Set();
    for (let priority = 0; priority <= 100; priority += 1) emitted.add(getMagicLevel(priority));
    expect([...emitted].sort()).toEqual([...MAGIC_LICENCE_LEVELS].sort());
    // and every emitted world level is a legal licence floor, which is what lets a gate ask
    // "is this entry licensed for THIS world" with one comparison
    for (const level of emitted) expect(normaliseMagicLicence(level)).toBe(level);
  });

  it('A7 — THE NEGATIVE CLAIM: the world law still strikes all 28 at magicExists:false', () => {
    // MF-CH2a declares the licence and routes `isArcaneInstitution` through it. It does NOT
    // touch the world law, which still reads the SHELF off the record every call site spreads
    // onto it — so a dead-magic world is decided exactly as it was, and no roster moves.
    // MF-CH2b deliberately flips this arm; until then it is what makes this car inert.
    const law = createGenerationWorldLaw(
      { magicExists: false, priorityMagic: 0, tradeRouteAccess: 'port', terrainType: 'coastal' },
      { tradeRoute: 'port', terrainType: 'coastal' },
    );
    expect(law.magicEnabled).toBe(false);
    expect(law.supportsMaritime()).toBe(true);
    const allowed = SHELF_ROWS.filter(
      r => law.allowsInstitution({ category: r.category, name: r.name, ...r.def }),
    );
    expect(allowed.map(r => `${r.tier}/${r.category}/${r.name}`)).toEqual([]);
    // non-vacuity: the same law says YES to a mundane row, so the empty list above is a
    // verdict and not a predicate that answers false to everything
    expect(law.allowsInstitution({ category: 'Defense', name: 'Citizen militia' })).toBe(true);
  });

  it('A8 — the customContent seam is untouched: the TAG surface still answers from the TAG', () => {
    // customContent.js classifies USER-authored names through institutionCatalogArcaneTag.
    // A player's name is not a catalog row and the licence has no standing over it, so that
    // reader deliberately keeps the tag. If a future edit routes the tag surface through the
    // licence, these rows move and this arm says so.
    //
    // ⭐ THE THREE ALCHEMY/WARDEN ROWS NOW ANSWER MUNDANE — and the reason matters, because it
    // is the opposite of the failure this arm watches for. The reader was NOT re-routed; the
    // DATA changed. TE-CH-5 (ODQ §541) deleted the redundant `arcane` tag from three rows the
    // estate had already licensed `none`, and moved `alchemy` out of ARCANE_INST_TAGS into the
    // sibling TRADE_INST_TAGS because alchemy is a chemical trade and not a magic-dependence
    // claim. So this surface still answers strictly from the tag — the tag simply no longer
    // says arcane on a mundane row. A licence-routed reader would ALSO have moved
    // `Healer (divine, 1st level)` to ARCANE; it is still MUNDANE below, which is the control
    // that tells the two causes apart.
    expect(institutionCatalogArcaneTag('Alchemist shop')).toBe(ARCANE_IDENTITY.MUNDANE);
    expect(institutionCatalogArcaneTag("Warden's Lodge")).toBe(ARCANE_IDENTITY.MUNDANE);
    expect(institutionCatalogArcaneTag('Alchemist quarter')).toBe(ARCANE_IDENTITY.MUNDANE);
    expect(institutionCatalogArcaneTag('Healer (divine, 1st level)')).toBe(ARCANE_IDENTITY.MUNDANE);
    expect(institutionCatalogArcaneTag('Great library')).toBe(ARCANE_IDENTITY.MUNDANE);
    // ANCHOR: the reader still ANSWERS ARCANE for rows whose tag genuinely says so, so the
    // three MUNDANE verdicts above are a data change and not a classifier that stopped
    // classifying.
    expect(institutionCatalogArcaneTag("Enchanter's shop")).toBe(ARCANE_IDENTITY.ARCANE);
    expect(institutionCatalogArcaneTag('Planar embassy')).toBe(ARCANE_IDENTITY.ARCANE);
    expect(institutionCatalogArcaneTag('Wholly Invented Emporium')).toBe(ARCANE_IDENTITY.UNKNOWN);
  });
});
