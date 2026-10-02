/**
 * magicShelfGateCensus.walker.test.js — MF-CH2B, THE MAGIC LICENCE (gate half).
 *
 * MF-CH2A declared a `magicLicense` on the catalog rows that need one. This car makes the
 * gates that decided magic-dependence READ it, and this walker's job is to keep them from
 * ever deciding a catalog row by its display bucket again.
 *
 * THE SHELF-READING GATES:
 *   P1  src/generators/institutionProbability.js  the magic multiplier   `cat.includes('magic')`
 *   P3  src/generators/institutionProbability.js  the exotic scaler      `cat.includes('magic') || cat === 'exotic'`
 *   P4  src/domain/arcaneInstitutionIdentity.js   the world-fact gate    `bucket === 'magic'`   (routed in MF-CH2A)
 *   P5  src/generators/generationContext.js       THE WORLD LAW          `semanticCategory === 'magic'`
 *   UI  src/domain/magicFilter.js                 the institutional grid `c === 'magic' || c === 'exotic'`
 * `hiMagicInsts` (P2) is NOT one of them — it is a NAME list, and this car touches it only to
 * remove G7's goods vocabulary and its two dead keywords (B6).
 *
 * ⚠ P5 READS THE SHELF AT ITS LIVE CALL SHAPE. Every `allowsInstitution` call site spreads
 * `category` onto the record it hands over, so `carriesExplicitMagicMetadata` read the SHELF,
 * not only the names the keyword scan matched. B1 and B4 therefore build records exactly that
 * way: `{ category, name, ...def }`.
 *
 * ⚠ THE FALLBACKS SURVIVE AND ARE COUNTED. A shelf is still the right answer for an entity the
 * catalog has never heard of: a player who files their own institution under `Magic` has
 * declared something. B2 requires every surviving shelf comparison in the four gate files to
 * carry the exact marker `@non-catalog-fallback MF-CH2`, pins the per-file counts, and proves
 * the scanner can see an unmarked one. B1 then proves BEHAVIOURALLY that no such fallback can
 * decide a CATALOG row, and B7 that each fallback still answers for everything else.
 *
 * ⛔ ROBUST TO THE CATALOG MOVING UNDER IT. Every arm keys a row on its NAME and its declared
 * LICENCE, never on the shelf or tier it is filed under today, and every "all N rows" figure
 * is DERIVED from the catalog at run time. A row that moves shelf or tier, a tier that gains a
 * cumulative copy of a row, or a row count that changes does not red this walker; a row whose
 * LICENCE changes, or a gate that starts reading the shelf again, does.
 *
 * @enforced-by this test file
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { TIER_ORDER, normaliseMagicLicence } from '../../src/data/constants.js';
import { getBaseChance } from '../../src/generators/institutionProbability.js';
import {
  ARCANE_INST_TAGS,
  filterCatalogForMagic,
  filterGoodsForMagic,
} from '../../src/domain/magicFilter.js';
import {
  catalogInstitutionNames,
  institutionCatalogMagicLicence,
  isArcaneInstitution,
} from '../../src/domain/arcaneInstitutionIdentity.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { buildGenerationCoherenceReceipt } from '../../src/generators/generationCoherence.js';
import { textAssertsFunctionalMagic } from '../../src/domain/magicAssertionText.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => fs.readFileSync(path.join(REPO, p), 'utf8');

/** A shelf no magic gate has ever named, used as the control bucket for arm B1. */
const NEUTRAL_SHELF = 'Infrastructure';
const MAGIC_DIALS = [0, 20, 50, 80, 100];

/** Every catalog row as the generator shapes it, whatever tier and shelf it sits on. */
function catalogRows() {
  const rows = [];
  for (const [tier, shelves] of Object.entries(institutionalCatalog)) {
    for (const [category, insts] of Object.entries(shelves)) {
      for (const [name, def] of Object.entries(insts)) rows.push({ tier, category, name, def });
    }
  }
  return rows;
}
const ROWS = catalogRows();

/** Every row carrying `name`, wherever the catalog files it. Never empty, or the arm is moot. */
function rowsNamed(name) {
  const hits = ROWS.filter(r => r.name === name);
  expect(hits.length, `the catalog no longer carries a row named ${name}`).toBeGreaterThan(0);
  return hits;
}

const normName = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');

const DEAD = { magicExists: false, priorityMagic: 0 };
// Port + coastal so the maritime denial cannot contaminate any reading below.
const deadLaw = createGenerationWorldLaw(
  { ...DEAD, tradeRouteAccess: 'port', terrainType: 'coastal' },
  { tradeRoute: 'port', terrainType: 'coastal' },
);
// The same world with magic working: anything IT refuses is refused for a non-magic reason.
const liveLaw = createGenerationWorldLaw(
  { magicExists: true, priorityMagic: 50, tradeRouteAccess: 'port', terrainType: 'coastal' },
  { tradeRoute: 'port', terrainType: 'coastal' },
);

/** A neutral config for `getBaseChance` at one tier and one magic dial. */
const configAt = (tier, priorityMagic) => ({
  tier, settType: tier, priorityMagic, priorityEconomy: 50, priorityMilitary: 50,
  priorityReligion: 50, priorityCriminal: 50, monsterThreat: 'civilized',
  tradeRouteAccess: 'road',
});

/** `getBaseChance` across the magic dial at a fixed base. */
const dialVector = (category, name, tier, base = 0.01) => MAGIC_DIALS.map(
  priorityMagic => getBaseChance(base, category, name, configAt(tier, priorityMagic), null, {}),
);

/** The dial vector normalised by its own pm50 value, so any shelf-CONSTANT factor cancels. */
function magicSensitivity(category, name, tier) {
  const raw = dialVector(category, name, tier);
  const pivot = raw[MAGIC_DIALS.indexOf(50)];
  if (!pivot) return raw.map(v => (v === 0 ? 'zero' : 'nonzero-over-zero-pivot'));
  return raw.map(v => Number((v / pivot).toFixed(9)));
}

const ridesTheDial = (category, name, tier) => new Set(dialVector(category, name, tier)).size > 1;

/** The UI grid's verdict for one row presented on a given shelf. */
function uiHides(category, name, def) {
  const kept = filterCatalogForMagic({ [category]: { [name]: def } }, DEAD);
  return !(kept[category] && kept[category][name]);
}

describe('MF-CH2B — the magic gates read the declared licence, never the shelf', () => {
  it('B1 — SHELF-INDEPENDENCE: every catalog row answers the same on its shelf and on a neutral one', () => {
    const disagreements = [];
    let probed = 0;
    for (const { tier, category, name, def } of ROWS) {
      const realRec = { category, name, ...def };
      const neutralRec = { category: NEUTRAL_SHELF, name, ...def };
      const probes = {
        'P4 isArcaneInstitution': [
          isArcaneInstitution(name, category), isArcaneInstitution(name, NEUTRAL_SHELF)],
        'P5 allowsInstitution': [
          deadLaw.allowsInstitution(realRec), deadLaw.allowsInstitution(neutralRec)],
        'UI filterCatalogForMagic': [
          uiHides(category, name, def), uiHides(NEUTRAL_SHELF, name, def)],
        'P1/P3 magic sensitivity': [
          JSON.stringify(magicSensitivity(category, name, tier)),
          JSON.stringify(magicSensitivity(NEUTRAL_SHELF, name, tier))],
      };
      for (const [gate, [a, b]] of Object.entries(probes)) {
        if (a !== b) disagreements.push(`${tier}/${category}/${name} :: ${gate} :: ${a} vs ${b}`);
      }
      probed += 1;
    }
    expect(disagreements).toEqual([]);
    // THE DENOMINATOR, DERIVED TWICE AND NEVER TYPED: the raw walk above and the identity
    // adapter's own index must agree on how many distinct names the catalog holds, so the
    // arm covers the whole catalog however many rows it has today.
    expect(probed).toBe(ROWS.length);
    expect(ROWS.length).toBeGreaterThan(0);
    expect(new Set(ROWS.map(r => normName(r.name))).size).toBe(catalogInstitutionNames().length);
    // NON-VACUITY: the probes must be able to SEE a shelf-decided row. A synthetic row with no
    // licence, no arcane tag and no arcane keyword is shelf-decided by construction, and the
    // same four probes report it.
    const ghostName = 'Quiet Reading Room';
    expect(institutionCatalogMagicLicence(ghostName)).toBeNull();
    const ghost = { required: false, baseChance: 0.5, desc: '', tags: ['civic'] };
    const shelfDecided = [
      isArcaneInstitution(ghostName, 'Magic') !== isArcaneInstitution(ghostName, NEUTRAL_SHELF),
      deadLaw.allowsInstitution({ category: 'Magic', name: ghostName, ...ghost })
        !== deadLaw.allowsInstitution({ category: NEUTRAL_SHELF, name: ghostName, ...ghost }),
      uiHides('Magic', ghostName, ghost) !== uiHides(NEUTRAL_SHELF, ghostName, ghost),
      JSON.stringify(magicSensitivity('Magic', ghostName, 'city'))
        !== JSON.stringify(magicSensitivity(NEUTRAL_SHELF, ghostName, 'city')),
    ];
    expect(shelfDecided).toEqual([true, true, true, true]);
  });

  it('B2 — every surviving shelf comparison in a gate file declares itself a non-catalog fallback', () => {
    const GATE_FILES = {
      'src/generators/institutionProbability.js': 2,
      'src/domain/arcaneInstitutionIdentity.js': 1,
      'src/generators/generationContext.js': 2,
      'src/domain/magicFilter.js': 1,
    };
    // A SHELF comparison is a BUCKET-valued identifier tested against 'magic' or 'exotic'.
    // The bucket half matters: `tag === 'magic'` is an AUTHORED TAG read, which R-BLD-5 rules
    // legitimate and this car never touched, and a scan that cannot tell the two apart would
    // fail on code it has no opinion about.
    const SHELF_IDENT = /\b(?:cat|c|bucket|category|semanticCategory)\b/;
    const SHELF_LITERAL = /(?:===?\s*'(?:magic|exotic)'|\.includes\('(?:magic|exotic)'\))/;
    const isShelfTest = (code) => SHELF_IDENT.test(code) && SHELF_LITERAL.test(code);
    const MARKER = '@non-catalog-fallback MF-CH2';
    const counts = {};
    const unmarked = [];
    for (const file of Object.keys(GATE_FILES)) {
      let n = 0;
      read(file).split('\n').forEach((line, i) => {
        // a comment ABOUT the pattern is prose, not a gate; only executable lines count
        const code = line.replace(/^\s*(?:\/\/|\*).*$/, '');
        if (!isShelfTest(code)) return;
        n += 1;
        if (!line.includes(MARKER)) unmarked.push(`${file}:${i + 1}: ${line.trim()}`);
      });
      counts[file] = n;
    }
    expect(unmarked).toEqual([]);
    expect(counts).toEqual(GATE_FILES);
    // POSITIVE CONTROL — the scanner finds an unmarked shelf read when one exists, and does not
    // mistake an authored-tag read for one. Run over a synthetic buffer rather than the tree,
    // so the control cannot leave a mutant behind.
    const planted = [
      "  if (cat === 'magic') return true;",
      "  if (c === 'exotic') return true; // " + MARKER,
      "      tag === 'magic'",
    ];
    const found = planted.filter(l => isShelfTest(l));
    expect(found).toEqual([planted[0], planted[1]]);                 // the tag read is NOT a shelf read
    expect(found.filter(l => !l.includes(MARKER))).toEqual([planted[0]]); // and the unmarked one is seen
  });

  it('B3 — G3: the mundane chemical trade no longer rides the magic dial, at any tier', () => {
    for (const name of ['Alchemist shop', 'Alchemist quarter']) {
      for (const { tier, category } of rowsNamed(name)) {
        // R-INST-5 family B: an alchemist's shop is a chemical trade with a real building
        // programme, not a wizard's workshop — the licence is the authored statement of that.
        expect(institutionCatalogMagicLicence(name), `${name}: licence`).toBe('none');
        // reachable at priorityMagic 20, where the shelf used to scale it toward nothing
        expect(getBaseChance(0.3, category, name, configAt(tier, 20), null, {}),
          `${tier}/${category}/${name} at pm20`).toBeGreaterThan(0);
        // and dial-invariant on its own shelf at EVERY tier, not only the one it is filed at
        for (const anyTier of TIER_ORDER) {
          expect(ridesTheDial(category, name, anyTier), `${name} rides the dial at ${anyTier}`)
            .toBe(false);
        }
      }
    }
    // NON-VACUITY: a row that SHOULD ride the dial still does, on the same probe
    for (const { tier, category } of rowsNamed("Enchanter's shop")) {
      expect(institutionCatalogMagicLicence("Enchanter's shop")).toBe('high');
      expect(ridesTheDial(category, "Enchanter's shop", tier)).toBe(true);
    }
  });

  it('B4 — G4: ONE read, TWO surfaces — the grid and the world law agree row by row', () => {
    const magicDisagreements = [];
    const contentDenials = [];
    let rowsSeen = 0;
    for (const [tier, shelves] of Object.entries(institutionalCatalog)) {
      const kept = filterCatalogForMagic(shelves, DEAD);
      for (const [category, insts] of Object.entries(shelves)) {
        for (const [name, def] of Object.entries(insts)) {
          rowsSeen += 1;
          const rec = { category, name, ...def };
          const offered = Boolean(kept[category] && kept[category][name]);
          const allowed = deadLaw.allowsInstitution(rec);
          if (offered === allowed) continue;
          // A row the MAGIC-LIVE law also refuses is refused for a reason the magic grid has
          // never had an opinion about (the content profile). Anything else is a real split.
          if (!liveLaw.allowsInstitution(rec) && offered && !allowed) {
            contentDenials.push(name);
          } else {
            magicDisagreements.push(`${tier}/${category}/${name} UI=${offered} LAW=${allowed}`);
          }
        }
      }
    }
    expect(rowsSeen).toBe(ROWS.length);
    expect(magicDisagreements).toEqual([]);
    // The survivors are CONTENT-PROFILE denials, named by NAME so a row changing tier or shelf
    // does not move the arm. Naming them is what makes this a measurement, not a tolerance.
    expect([...new Set(contentDenials)].sort()).toEqual([
      'Human trafficking network', 'Kidnapping ring', 'Slave market', 'Slave market district',
    ]);
    // THE MOVEMENT, DERIVED: over every row that declares a licence, BOTH surfaces now admit
    // exactly the rows licensed `none` in a dead-magic world, and refuse every other one —
    // the shelf is never consulted, so this holds wherever the rows are filed.
    const licensed = ROWS.filter(r => normaliseMagicLicence(r.def.magicLicense) !== null);
    const noneRows = licensed.filter(r => normaliseMagicLicence(r.def.magicLicense) === 'none');
    expect(noneRows.length).toBeGreaterThan(0);
    expect(licensed.length).toBeGreaterThan(noneRows.length);
    for (const r of licensed) {
      const expected = normaliseMagicLicence(r.def.magicLicense) === 'none';
      const where = `${r.tier}/${r.category}/${r.name}`;
      expect(deadLaw.allowsInstitution({ category: r.category, name: r.name, ...r.def }),
        `${where}: world law`).toBe(expected);
      expect(!uiHides(r.category, r.name, r.def), `${where}: grid`).toBe(expected);
    }
    // and the row the charter's divergence was reached for is present on BOTH surfaces,
    // on every shelf and at every tier the catalog files it
    for (const r of rowsNamed("Adventurers' charter hall")) {
      expect(deadLaw.allowsInstitution({ category: r.category, name: r.name, ...r.def })).toBe(true);
      expect(uiHides(r.category, r.name, r.def)).toBe(false);
    }
  });

  it('B5 — G5: a repository of books is not multiplied by the magic dial, and survives a dead world', () => {
    const name = 'Great library';
    expect(institutionCatalogMagicLicence(name)).toBe('none');
    expect(isArcaneInstitution(name)).toBe(false);
    for (const r of rowsNamed(name)) {
      const values = dialVector(r.category, name, r.tier, 0.4);
      expect(new Set(values).size, `${r.tier}/${r.category}: rides the dial`).toBe(1);
      expect(values[0]).toBeGreaterThan(0);
      expect(isArcaneInstitution(name, r.category)).toBe(false);
      expect(deadLaw.allowsInstitution({ category: r.category, name, ...r.def })).toBe(true);
      expect(uiHides(r.category, name, r.def)).toBe(false);
    }
  });

  it('B6 — G7: the goods vocabulary leaves the institution gate and no verdict moves', () => {
    const source = read('src/generators/institutionProbability.js');
    const list = /const hiMagicInsts = \[([\s\S]*?)\];/.exec(source);
    expect(list).toBeTruthy();
    const keywords = [...list[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
    expect(keywords).toEqual([
      'airship', 'golem', 'undead labor', 'dream parlor',
      'message network', 'planar', 'teleportation', 'high magic',
    ]);
    // the three that left, and WHY: none matches any catalog NAME (re-proved against the live
    // catalog, never a typed denominator), and the third is a member of magicFilter's
    // ARCANE_GOODS — a goods vocabulary inside an institution gate. The absence is ANCHORED on
    // a keyword that must still be there, so it cannot pass by the list drifting away entirely.
    for (const removed of ['magical banking', 'enchanting quarter', 'magic item consignment']) {
      expectAbsentWithAnchor(keywords, removed, 'teleportation', `hiMagicInsts :: ${removed}`);
      const hits = ROWS.filter(r => r.name.toLowerCase().includes(removed));
      expect(hits.map(r => r.name), `${removed} was not dead after all`).toEqual([]);
    }
    // and the goods gate still owns it, in both directions
    expect(filterGoodsForMagic(['Magic item consignment', 'Grain'], DEAD)).toEqual(['Grain']);
    expect(filterGoodsForMagic(['Magic item consignment', 'Grain'], { magicExists: true, priorityMagic: 50 }))
      .toEqual(['Magic item consignment', 'Grain']);
  });

  it('B7 — the NON-CATALOG fallback is live at every gate', () => {
    // Nothing here is a catalog name, so every gate must answer from the shelf/tag/keyword
    // tests it always used.
    for (const invented of ['Conclave of the Veil', 'Backstreet wizard', 'Bob’s Cooperage']) {
      expect(institutionCatalogMagicLicence(invented), invented).toBeNull();
    }
    // A custom entity on the Magic shelf — the author's own declaration
    const custom = { name: 'Conclave of the Veil', category: 'Magic', tags: ['civic'] };
    expect(isArcaneInstitution('Conclave of the Veil', 'Magic')).toBe(true);       // P4 shelf
    expect(deadLaw.allowsInstitution(custom)).toBe(false);                         // P5 shelf
    expect(uiHides('Magic', 'Conclave of the Veil', { tags: [] })).toBe(true);      // UI shelf
    expect(ridesTheDial('Magic', 'Conclave of the Veil', 'city')).toBe(true);       // P1 shelf
    expect(ridesTheDial(NEUTRAL_SHELF, 'Conclave of the Veil', 'city')).toBe(false);
    // P3 shelf fallback: an invented Exotic row still takes the exotic scaler at the top of
    // the dial, where the same name on a neutral shelf does not
    expect(JSON.stringify(magicSensitivity('Exotic', 'Conclave of the Veil', 'city')))
      .not.toBe(JSON.stringify(magicSensitivity(NEUTRAL_SHELF, 'Conclave of the Veil', 'city')));
    // the keyword fallback, on a shelf that says nothing
    expect(deadLaw.allowsInstitution({ category: 'Crafts', name: 'Backstreet wizard' })).toBe(false);
    expect(uiHides('Crafts', 'Backstreet wizard', { tags: [] })).toBe(true);
    expect(ridesTheDial('Crafts', 'Backstreet wizard', 'city')).toBe(true);
    // and a plainly mundane invented row is allowed everywhere and rides nothing
    expect(deadLaw.allowsInstitution({ category: 'Crafts', name: 'Bob’s Cooperage' })).toBe(true);
    expect(uiHides('Crafts', 'Bob’s Cooperage', { tags: [] })).toBe(false);
    expect(ridesTheDial('Crafts', 'Bob’s Cooperage', 'city')).toBe(false);
    // ⚠ THE LICENCE HAS NO STANDING OVER A PLAYER'S OWN ENTITY. A CUSTOM record that happens to
    // share a licence-`none` catalog NAME is still decided by what its author filed it as.
    expect(institutionCatalogMagicLicence('Great library')).toBe('none');
    expect(deadLaw.allowsInstitution({ source: 'custom', name: 'Great library', category: 'Magic' }))
      .toBe(false);
    expect(deadLaw.allowsInstitution({ source: 'custom', name: 'Great library', category: 'Education' }))
      .toBe(true);
  });

  it('B7b — THE SIXTH SURFACE: a bucket name is not a magic claim, but a sentence still is', () => {
    // `generationCoherence.js` asks `allowsMagicClaim` about EVERY generated string in a
    // finished settlement, including its taxonomy fields. `textAssertsFunctionalMagic` is a
    // PROSE detector, so without the cure a magic-free world that lawfully keeps a Magic-shelf
    // row (P5 above) would have its own `world_law_magic` certification convict it for the
    // NAME OF THE SHELF. DERIVED from the same list the cure derives from, never re-typed.
    const BARE = ['magic', 'magical', ...ARCANE_INST_TAGS];
    const CASED = BARE.flatMap(t => [t, t.charAt(0).toUpperCase() + t.slice(1), `  ${t.toUpperCase()}  `]);
    expect(CASED.filter(t => !deadLaw.allowsMagicClaim(t))).toEqual([]);
    // NON-VACUITY: the prose detector DOES read these tokens as claims, so the line above is
    // the narrowing holding and not a detector that never fired
    expect(['Magic', 'arcane', 'magic'].filter(t => textAssertsFunctionalMagic(t)))
      .toEqual(['Magic', 'arcane', 'magic']);
    // POSITIVE CONTROL — a SENTENCE, or any text that merely CONTAINS a token, still convicts
    // in the same dead-magic world: a narrowing, not a hole in the certification
    const PROSE = [
      'The wizard sells scrolls of teleportation to anyone with coin.',
      'Arcane wards hold the tower together.',
      'A planar rift opened beneath the market square.',
      'Enchanting is taught at the academy of magic.',
      'magic shop', 'magical services', 'Magic item consignment',
    ];
    expect(PROSE.filter(p => deadLaw.allowsMagicClaim(p))).toEqual([]);
    // and a magical world is unaffected in both directions
    expect([...CASED, ...PROSE].filter(p => !liveLaw.allowsMagicClaim(p))).toEqual([]);
    // RECEIPT LEVEL: a magic-free settlement carrying Magic-shelf taxonomy certifies clean, and
    // the same record plus one magic SENTENCE still fails
    const settlement = (extra) => ({
      tier: 'town',
      config: { tradeRouteAccess: 'road', terrainType: 'plains', ...DEAD },
      institutions: [{
        name: "Adventurers' charter hall", category: 'Magic', priorityCategory: 'magic',
        tags: ['arcane'], ...extra,
      }],
      npcs: [], history: {}, structuralViolations: [],
    });
    const check = (s) => buildGenerationCoherenceReceipt(s).checks
      .find(c => c.id === 'world_law_magic');
    expect(check(settlement({}))).toMatchObject({ status: 'pass', findings: [] });
    expect(check(settlement({ desc: 'A wizard keeps the roster and renews the wards each spring.' })))
      .toMatchObject({ status: 'fail' });
  });

  it('B8 — the name-exemption list for exotics is gone, and both of its members behave', () => {
    // the CODE is gone; prose explaining why it is gone may stay
    const executable = read('src/generators/institutionProbability.js')
      .split('\n')
      .filter(line => !/^\s*(?:\/\/|\*|\/\*)/.test(line));
    expect(executable.filter(l => /NON_MAGIC_EXOTICS|'dragon resident'|'underground city'/.test(l)))
      .toEqual([]);
    // `Dragon resident` needs no exemption: it declares `none`, so the licence keeps it off the
    // exotic scaler and off the magic multiplier wherever it is filed
    expect(institutionCatalogMagicLicence('Dragon resident')).toBe('none');
    for (const r of rowsNamed('Dragon resident')) {
      expect(ridesTheDial(r.category, r.name, r.tier), `${r.tier}/${r.category}`).toBe(false);
    }
    // and the exemption's OTHER member was inert all along: no catalog row of that name sits on
    // a shelf the exotic scaler ever read, so the test it was exempted from never fired
    const shelves = rowsNamed('Underground city').map(r => r.category);
    expect(shelves.filter(s => s === 'Magic' || s === 'Exotic')).toEqual([]);
    expect(institutionCatalogMagicLicence('Underground city')).toBeNull();
    for (const r of rowsNamed('Underground city')) {
      expect(ridesTheDial(r.category, r.name, r.tier), `${r.tier}/${r.category}`).toBe(false);
    }
  });
});
