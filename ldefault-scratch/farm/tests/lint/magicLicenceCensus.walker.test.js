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
 * ── MF-CH6 — THE FAITH WORDS LEAVE, AND THE KEYWORD LIST WAS NEVER WHAT DECIDED (ODQ §541.8) ──
 * ODQ §541.8 recorded a shipped deity-doctrine violation: `ARCANE_INST_KW` carried
 * `'druid circle'`, `'elder grove council'`, `'elder grove'`, `'healer (divine'`,
 * `'divine healer'` and `'wandering healer'`, so the engine asserted that divine healing is
 * a species of magic. THE DEITY DOCTRINE is constitutional here — faith is CULTURE, never
 * theology — and the words are gone. But the measurement that mattered was the SECOND one:
 *
 *   at `magicExists:false` the world law strikes all 28 licensed rows, and THE KEYWORD LIST
 *   ALONE DECIDES EXACTLY ONE OF THEM (`Dragon resident`). Every other row — the two druid
 *   rows among them — is over-determined: struck two, three or four ways over by the `Magic`
 *   SHELF inside `carriesExplicitMagicMetadata`, by an `arcane` TAG, by this keyword list and
 *   by the declared licence itself. Deleting a keyword from an over-determined gate frees
 *   nothing, and A7 below is that fact as a test.
 *
 * So this car cures the two halves it CAN cure completely, and pins the rest as a measured
 * gap rather than a half-flipped gate:
 *   · THE FREE-TEXT HALF, which is the only half the six words ever decided alone — two of
 *     them (`'divine healer'`, `'wandering healer'`) matched NO catalog row at all, so the
 *     only names they ever struck were the ones a player typed.
 *   · THE DECLARATION, at the data: `Druid Circle` and `Elder Grove Council` drop the
 *     redundant `arcane` tag beside their `religious` one and re-licence `low` → `none`.
 *
 * ⚠ `Healer (divine, 1st level)` IS DELIBERATELY HELD AT `low`, AND THE PREMISE IS REFUTED
 * FOR THAT ROW. Executed against the estate's own prose detector,
 * `textAssertsFunctionalMagic('Basic healing spells. A closed wound costs 10 in gold.')` is TRUE: the
 * entry as authored is a first-level SPELLCASTER filed under faith, not a cultural healer
 * wrongly convicted. The doctrine gap it exposes is real but it is a CONTENT gap — the
 * catalog holds no cultural divine healer for a magic-free world to keep — and filling it is
 * new content, not a licence flip. A5 keeps its one override for exactly that reason.
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
import { arcaneInstitutionNameFallback } from '../../src/domain/arcaneInstitutionIdentity.js';
import { ARCANE_INST_KW, ARCANE_INST_TAGS, filterServicesForMagic } from '../../src/domain/magicFilter.js';
// DEITY-LIVE-CHECK: A13 reads the estate's ONE "does this text claim magic works?" predicate
// directly, so the arm cannot drift from the thing the world law actually asks.
import { textAssertsFunctionalMagic } from '../../src/domain/magicAssertionText.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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
 * below read 7/5/4/12 against the dossier's own 11/5/4/12 when the field was declared.
 *
 * ⭐ IT NOW READS 9/3/4/12. TE-CH-6 moved TWO rows from `low` to `none` — `Druid Circle` and
 * `Elder Grove Council`, the deity-doctrine pair — and moved nothing else. The dossier ruled
 * both `low`; it was answering how MAGICAL the entry reads, and the field asks something
 * narrower, whether the entry can stand at all in a world without functioning magic. A circle
 * of druids who "regulate the seasons, mediate disputes with wild creatures, and know which
 * streams run clean" can. See DEITY_DOCTRINE_RELICENSED.
 */
const DECLARED_LICENCES = Object.freeze({
  "hamlet|Magic|Traveling hedge wizard": 'low',
  "hamlet|Magic|Adventurers' charter hall": 'none',
  "village|Magic|Hedge wizard": 'low',
  "village|Magic|Druid Circle": 'none',
  "village|Magic|Adventurers' charter hall": 'none',
  "village|Magic|Healer (divine, 1st level)": 'low',
  "town|Magic|Wizard's tower": 'medium',
  "town|Magic|Elder Grove Council": 'none',
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
 *
 * ⭐ TE-CH-6 OWNED IT AND LEFT IT STANDING ANYWAY, WHICH IS A VERDICT AND NOT A DEFERRAL.
 * The row's own authored prose asserts functional magic — the estate's shared detector says
 * `textAssertsFunctionalMagic('Basic healing spells. A closed wound costs 10 in gold.') === true` — so
 * the entry is a first-level SPELLCASTER filed on a faith shelf. The licence is honest about
 * it and dropping it to `none` would put a healing spellcaster in a world with no spells.
 * The doctrine gap is that the catalog holds no CULTURAL divine healer at all; that is a
 * content gap and a new row, not a value in this table. Recorded in ODQ, not swallowed here.
 */
const LICENCE_OVERRIDES_TAG = Object.freeze({
  'Healer (divine, 1st level)': { tag: 'mundane', licence: 'low', arcane: true },
});

/**
 * THE TWO ROWS THE DEITY DOCTRINE RE-LICENSED (TE-CH-6, ODQ §541.8). Named as data so A2's
 * distribution attributes its own movement, and so a successor reading `none` on a druid
 * circle finds the reason beside the value instead of in a commit message.
 */
const DEITY_DOCTRINE_RELICENSED = Object.freeze(['Druid Circle', 'Elder Grove Council']);

/**
 * The six words that left `ARCANE_INST_KW` with them. A magic-dependence list is no place for
 * faith: every reader of it is deciding whether a candidate may stand in a MAGIC-FREE world,
 * so a faith word there does not mis-label an institution, it DELETES that faith from every
 * such world. Two of the six matched no catalog row at all, so the only names they ever
 * decided were the ones a player typed.
 */
const FAITH_WORDS_REMOVED = Object.freeze([
  'druid circle', 'elder grove council', 'elder grove',
  'healer (divine', 'divine healer', 'wandering healer',
]);

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
    expect(dist).toEqual({ none: 9, low: 3, medium: 4, high: 12 });
    expect(dist.none + dist.low + dist.medium + dist.high).toBe(SHELF_ROWS.length);
    // 7 → 9 and 5 → 3 on 2026-08-24 (TE-CH-6, ODQ §541.8). ATTRIBUTED, not absorbed: exactly
    // these two rows moved, each is named, and the arm reds if a third joins them quietly.
    expect(DEITY_DOCTRINE_RELICENSED.length).toBe(2);
    for (const name of DEITY_DOCTRINE_RELICENSED) {
      expect(institutionCatalogMagicLicence(name), name).toBe('none');
    }
    // The dossier's own whole-table figure stays reachable, which is what keeps this arm a
    // cross-check against R-INST-5 rather than a number copied back off the catalog: add its
    // four Adventuring hand-offs, subtract the rows the estate overruled it on.
    expect(dist.none + 4 - DEITY_DOCTRINE_RELICENSED.length).toBe(11);
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
    // ⭐ AND THE ARM STILL HOLDS AFTER TE-CH-6 REMOVED SIX KEYWORDS, which is the finding that
    // car exists to record: the empty list above is NOT held up by the keyword list. Each row
    // is struck by the SHELF or the TAG as well, so the list decides exactly one of the 28 on
    // its own. A successor who plans to free a row by editing the vocabulary should read this.
    const decidedByKeywordAlone = SHELF_ROWS.filter((r) => {
      const entity = { category: r.category, name: r.name, ...r.def };
      return !law.allowsInstitution(entity)
        && law.allowsInstitution({ ...entity, name: 'Zzz Placeholder' });
    });
    expect(decidedByKeywordAlone.map(r => r.name)).toEqual(['Dragon resident']);
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
    // TE-CH-6's own data change, on the same surface and for the same reason: the two druid
    // rows dropped a redundant `arcane` tag beside their `religious` one, so the TAG reader
    // answers MUNDANE without ever being routed through the licence.
    expect(institutionCatalogArcaneTag('Druid Circle')).toBe(ARCANE_IDENTITY.MUNDANE);
    expect(institutionCatalogArcaneTag('Elder Grove Council')).toBe(ARCANE_IDENTITY.MUNDANE);
  });

  // ── TE-CH-6 · THE FAITH WORDS (ODQ §541.8) ────────────────────────────────────────────

  it('A9 — the magic-dependence vocabulary names no faith, and free text is where that bites', () => {
    // A magic-dependence list answers "can this stand in a world without magic?", and every
    // reader of it deletes what it names from such a world. Faith is culture here, so no faith
    // word belongs in it — and after TE-CH-6 routed nothing through a new rule, THIS is the
    // surface where the removal is live: names the catalog does not know.
    for (const word of FAITH_WORDS_REMOVED) {
      // ANCHORED, not bare: `'wizard'` is a sibling member of the same list, reached through
      // the same import, so an ARCANE_INST_KW that was renamed, emptied or re-shaped fails the
      // anchor instead of passing the exclusion. Absence alone would outlive the regression.
      expectAbsentWithAnchor(ARCANE_INST_KW, word, 'wizard', `faith word: ${word}`);
      expect(ARCANE_INST_KW.some(kw => word.includes(kw)), `${word} via a shorter member`)
        .toBe(false);
    }
    for (const authored of ['Wandering healer', 'Divine healer of the pass',
      'Druid circle of the north', 'Elder grove council']) {
      expect(arcaneInstitutionNameFallback(authored), `fallback: ${authored}`).toBe(false);
      expect(filterServicesForMagic({ [authored]: { x: 1 } }, { magicExists: false }),
        `services: ${authored}`).toEqual({ [authored]: { x: 1 } });
    }
    // NON-VACUITY, both surfaces: the vocabulary still convicts what it was authored for, so
    // the verdicts above are a membership change and not a classifier that stopped answering.
    for (const authored of ['Wizard tower of Zzz', 'The Teleportation circle', 'Golem foundry']) {
      expect(arcaneInstitutionNameFallback(authored), `fallback: ${authored}`).toBe(true);
      expect(filterServicesForMagic({ [authored]: { x: 1 } }, { magicExists: false }),
        `services: ${authored}`).toEqual({});
    }
  });

  it('A10 — THE MEASURED GAP: the declaration is read by ONE gate of four, and the shelf still decides', () => {
    // The car this walker guards declared the licence and wired it into `isArcaneInstitution`.
    // Three gates never learned it, and TE-CH-6 measured what that costs rather than flipping
    // them: freeing the rows in the gates alone puts `Magic`-shelf institutions into magic-free
    // worlds, and the shipped `world_law_magic` coherence receipt convicts the record's own
    // taxonomy fields — 264 of 504 magic-free settlements, against 0 today. The remaining cure
    // is therefore the gates AND the receipt's vocabulary AND two rows of authored prose, which
    // is a train and not this car. This arm is that gap, pinned, so it cannot be mistaken for
    // an oversight and cannot be "fixed" halfway without a red.
    const law = createGenerationWorldLaw({ magicExists: false, priorityMagic: 0 }, {});
    for (const name of DEITY_DOCTRINE_RELICENSED) {
      const row = ROWS.find(r => r.name === name);
      const entity = { category: row.category, name: row.name, ...row.def };
      // the DECLARATION is now honest on all three of its own readers …
      expect(normaliseMagicLicence(row.def.magicLicense), `${name}: licence`).toBe('none');
      expect(institutionCatalogArcaneTag(name), `${name}: tag`).toBe(ARCANE_IDENTITY.MUNDANE);
      expect(isArcaneInstitution(entity, row.category), `${name}: identity`).toBe(false);
      // … and the world law still strikes it, on the SHELF, with the keyword gone.
      expect(law.allowsInstitution(entity), `${name}: world law still strikes`).toBe(false);
      expect(law.allowsInstitution({ ...entity, category: 'Religious' }),
        `${name}: and the shelf is what does it`).toBe(true);
    }
    // THE CONTROL THAT MAKES THE GAP ATTRIBUTABLE: move the shelf on a genuinely
    // magic-dependent row and it is STILL struck, by its tag. The line above is the shelf
    // deciding, not a predicate that answers whatever it is handed last.
    const tower = ROWS.find(r => r.tier === 'city' && r.name === "Wizard's tower");
    expect(law.allowsInstitution({
      category: 'Religious', name: tower.name, ...tower.def,
    })).toBe(false);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // DEITY-LIVE-CHECK (ODQ §708.6 / §765.2) — the hole the residue charter named was
  // "a new UNLICENSED divine row leaks today", and these two arms close it at the
  // LICENCE axis rather than by making faith a species of magic.
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Catalog tags that name a SUPERNATURAL PRACTICE — a thing the row claims actually
   * happens — as opposed to the faith-CULTURE tags beside them (`religious`,
   * `monastery`, `healing`). A row carrying one is making a claim the world law has to
   * be able to answer, and the field invented to answer it is `magicLicense`.
   * ⛔ This is NOT `ARCANE_INST_TAGS` and must never be merged into it: that list means
   * "cannot exist without magic", and a divine institution can. See
   * `arcaneInstitutionVocabulary.js`'s DEITY-LIVE-CHECK block.
   */
  const SUPERNATURAL_PRACTICE_TAGS = ['divine'];

  it('A11 — a row claiming a supernatural PRACTICE declares a licence, whatever its shelf', () => {
    // A1 above holds the SHELF axis: every Magic/Exotic row declares. This arm holds the
    // TAG axis, which A1 cannot see — a `Religious`-shelf row tagged `divine` and left
    // unlicensed reaches the world law with nothing to read, and that is exactly the
    // "new unlicensed divine row" the residue charter named.
    const tagged = ROWS.filter(r => SUPERNATURAL_PRACTICE_TAGS
      .some(tag => (Array.isArray(r.def.tags) ? r.def.tags : []).includes(tag)));
    // NON-VACUITY FIRST: the catalog really does carry such a row today, so an empty
    // undeclared list below means "all declared" rather than "the filter found nothing".
    expect(tagged.map(r => `${r.tier}|${r.category}|${r.name}`))
      .toEqual(['village|Magic|Healer (divine, 1st level)']);
    const undeclared = tagged
      .filter(r => normaliseMagicLicence(r.def.magicLicense) === null)
      .map(r => `${r.tier}|${r.category}|${r.name}`);
    expect(undeclared,
      'a catalog row claims a supernatural practice in its tags and declares no magicLicense, '
      + 'so the world law has nothing to read for it. Declare one of the four tokens — do NOT '
      + 'add the tag to ARCANE_INST_TAGS, which would delete every divine institution from '
      + 'every magic-free world.').toEqual([]);
    // THE POSITIVE CONTROL, driven rather than described: a synthetic unlicensed divine row
    // IS caught by the same predicate, so the empty list above is the guard holding.
    const planted = [...tagged, {
      tier: 'town', category: 'Religious', name: 'Oracle of the Deep',
      def: { tags: ['divine', 'religious'], desc: 'Reads the future.' },
    }];
    expect(planted
      .filter(r => normaliseMagicLicence(r.def.magicLicense) === null)
      .map(r => r.name)).toEqual(['Oracle of the Deep']);
  });

  it('A12 — THE DOCTRINE PIN: `divine` is not a magic-dependence tag, and this is where that is said', () => {
    // ⛔ THE RULING, PINNED SO A LATER LANE CANNOT QUIETLY REVERSE IT. ARCANE_INST_TAGS
    // means "cannot exist without magic"; `carriesExplicitMagicMetadata` reads it for
    // CUSTOM entities, roles and services, so a `divine` member would delete a player's own
    // divine-tagged temple from their own magic-free world. Faith is CULTURE, never
    // theology — the same ruling TE-CH-6 applied to ARCANE_INST_KW's six faith words.
    expectAbsentWithAnchor([...ARCANE_INST_TAGS], 'divine', 'arcane',
      'the deity doctrine: a divine institution is culture, not a magic dependence');
    // AND THE MEASUREMENT THAT MAKES THE REFUSAL FREE RATHER THAN MERELY PRINCIPLED: the
    // one divine row is licensed, so the licence branch answers first and the tag is never
    // consulted for it. Adding the tag would have moved zero catalog rows.
    const healer = ROWS.find(r => r.name === 'Healer (divine, 1st level)');
    expect(normaliseMagicLicence(healer.def.magicLicense)).toBe('low');
    expect(isArcaneInstitution(
      { category: healer.category, name: healer.name, ...healer.def }, healer.category,
    )).toBe(true);
    // …and a divine TEMPLE with no licence is NOT arcane, which is the whole point.
    expect(isArcaneInstitution(
      { category: 'Religious', name: 'Temple of the Morning Bell', tags: ['divine', 'religious'] },
      'Religious',
    )).toBe(false);
  });

  it('A13 — the assertion vocabulary catches the divine CLAIM and spares the divine CUSTOM', () => {
    // §708.6's leak, quoted from the shipped data rather than from the ruling: these
    // sentences assert that a supernatural effect FUNCTIONS, and a magic-free world must
    // not make them. Each was measured escaping the arcane-only pattern before this car.
    for (const claim of [
      'More advanced divine healing from senior clerics.',
      'Basic divine healing. Closes cuts, reduces fever, eases pain.',
      'Treat common illnesses through divine intervention.',
      'Remove contamination from food and water through divine blessing.',
      'Resurrection services Raise dead. Expensive, not guaranteed',
      'Wounds closed and sickness lifted by magic. Slower than divine.',
      'Induce prophetic dream states. Visions are real but not always interpretable.',
    ]) expect(textAssertsFunctionalMagic(claim), claim).toBe(true);
    // AND THE OTHER POLARITY, which is the doctrine and is the reason the tokens are
    // phrases: every one of these is faith as CULTURE and survives untouched. Without this
    // half the arm above would be satisfied by a blunt `divine` token that empties every
    // mundane world of its churches.
    for (const custom of [
      'Legal protection on holy ground',
      'Blessings for crops, livestock, safe journeys.',
      'A brief blessing for travelers on the road. Costs nothing; donations welcomed.',
      'Daily prayers, blessings, and religious counsel.',
      'Accommodate and process pilgrims. Relics, blessings, and indulgences.',
      'Church legal proceedings for matters within clerical jurisdiction.',
      'Access to venerated relics and shrines for pilgrims.',
      'Crucifixes, reliquaries, saints’ images.',
      // The village Graveyard desc, re-quoted from the shipped data when the burial
      // ladder's last legacy rung was rewritten (E-RES-5). The control is kept POINTED
      // AT WHAT SHIPS: the terse predecessor was withdrawn from the catalog in the same
      // act, so leaving it here would have guarded a string no world can any longer draw.
      "Consecrated ground beside the church, on the parish's own plot, with a resident priest to close it. The rite keeps to the day of the death rather than waiting on a clergyman who comes through, and the parish has begun keeping the names in the same book as the baptisms. The ground nearest the church wall is spoken for generations ahead, and everyone here can say who holds it.",
      'Dramatic but meaningless predictions. Occasionally accidentally accurate.',
      'A claimed miracle or relic drew pilgrims in numbers the settlement was never built to hold',
      'The faith lends the ruler a measure of divine mandate.',
    ]) expect(textAssertsFunctionalMagic(custom), custom).toBe(false);
    // THE CHARLATAN ROWS, which are the sharpest control in the estate: they are AUTHORED
    // mundane and they survive `stripNegatedMagic` with the word `divination` intact, so a
    // bare `divination` token would have convicted two rows written to prove magic is not
    // needed. This is why `divination` and `miracle` are not members.
    expect(textAssertsFunctionalMagic(
      "'Divination' with no magic in it, worked by Deception. 1-5 in gold.")).toBe(false);
    expect(textAssertsFunctionalMagic(
      "Non-magical 'divination' using Deception. 1-5 in gold.")).toBe(false);
  });
});
