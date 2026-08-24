/**
 * magicShelfGateCensus.walker.test.js — MF-CH2b, THE MAGIC LICENCE (gate half).
 *
 * MF-CH2a declared a `magicLicense` on every Magic/Exotic catalog row. This car makes the
 * five gates that decided magic-dependence READ it, and the walker's job is to keep them
 * from ever reading a display bucket again.
 *
 * THE FIVE SHELF-READING GATES, measured at this base rather than taken from the charter:
 *   P1  src/generators/institutionProbability.js  the magic multiplier   `cat.includes('magic')`
 *   P3  src/generators/institutionProbability.js  the exotic scaler      `cat.includes('magic') || cat === 'exotic'`
 *   P4  src/domain/arcaneInstitutionIdentity.js   the world-fact gate    `bucket === 'magic'`   (routed in MF-CH2a)
 *   P5  src/generators/generationContext.js       THE WORLD LAW          `semanticCategory === 'magic'`
 *   UI  src/domain/magicFilter.js                 the institutional grid `c === 'magic' || c === 'exotic'`
 * `hiMagicInsts` (institutionProbability) is NOT one of them — it is a NAME list, and this
 * car touches it only to remove G7's goods vocabulary and its two dead keywords.
 *
 * ⚠ P5 READS THE SHELF AT ITS LIVE CALL SHAPE, which is stronger than the charter's reading.
 * Every `allowsInstitution` call site — assembleInstitutions.js:268/410/484, cascadeGenerator
 * .js:180, cascadePass, coherenceRepairPass, factionCorrelationPass — spreads `category` onto
 * the record it hands over, so `carriesExplicitMagicMetadata` read the SHELF and not only the
 * 26 rows the unanchored keyword scan named.
 *
 * ⚠ THE FALLBACKS SURVIVE AND ARE COUNTED. A shelf is still the right answer for an entity the
 * catalog has never heard of: a player who files their own institution under `Magic` has
 * declared something. Arm B2 requires every surviving shelf comparison in the four gate files
 * to carry the exact marker `@non-catalog-fallback MF-CH2`, pins the per-file counts, and
 * proves the scanner can see an unmarked one. Arm B1 then proves BEHAVIOURALLY that no such
 * fallback can decide a CATALOG row: all 311 rows answer identically on their own shelf and on
 * a neutral one, across all five gates.
 *
 * @enforced-by this test file
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { getBaseChance } from '../../src/generators/institutionProbability.js';
import {
  filterCatalogForMagic,
  filterGoodsForMagic,
} from '../../src/domain/magicFilter.js';
import { isArcaneInstitution } from '../../src/domain/arcaneInstitutionIdentity.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => fs.readFileSync(path.join(REPO, p), 'utf8');

/** A shelf no magic gate has ever named, used as the control bucket for arm B1. */
const NEUTRAL_SHELF = 'Infrastructure';
const MAGIC_DIALS = [0, 20, 50, 80, 100];

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

const DEAD = { magicExists: false, priorityMagic: 0 };
const deadLaw = createGenerationWorldLaw(
  { ...DEAD, tradeRouteAccess: 'port', terrainType: 'coastal' },
  { tradeRoute: 'port', terrainType: 'coastal' },
);

/** `getBaseChance` across the magic dial, normalised so any shelf-CONSTANT factor cancels. */
function magicSensitivity(category, name, tier) {
  const raw = MAGIC_DIALS.map(priorityMagic => getBaseChance(
    0.01, category, name,
    { tier, settType: tier, priorityMagic, priorityEconomy: 50, priorityMilitary: 50,
      priorityReligion: 50, priorityCriminal: 50, monsterThreat: 'civilized',
      tradeRouteAccess: 'road' },
    null, {},
  ));
  const pivot = raw[MAGIC_DIALS.indexOf(50)];
  if (!pivot) return raw.map(v => (v === 0 ? 'zero' : 'nonzero-over-zero-pivot'));
  return raw.map(v => Number((v / pivot).toFixed(9)));
}

/** The UI grid's verdict for one row presented on a given shelf. */
function uiHides(category, name, def) {
  const kept = filterCatalogForMagic({ [category]: { [name]: def } }, DEAD);
  return !(kept[category] && kept[category][name]);
}

describe('MF-CH2b — the five magic gates read the declared licence, never the shelf', () => {
  it('B1 — SHELF-INDEPENDENCE: all 311 rows answer the same on their shelf and on a neutral one', () => {
    const disagreements = [];
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
    }
    expect(disagreements).toEqual([]);
    expect(ROWS.length).toBe(311);
    // NON-VACUITY: the probe must be able to SEE a shelf-decided row. A synthetic row with no
    // licence, no arcane tag and no arcane keyword is shelf-decided by construction, and the
    // same four probes report it.
    const ghost = { required: false, baseChance: 0.5, desc: '', tags: ['civic'] };
    const shelfDecided = [
      isArcaneInstitution('Quiet Reading Room', 'Magic')
        !== isArcaneInstitution('Quiet Reading Room', NEUTRAL_SHELF),
      deadLaw.allowsInstitution({ category: 'Magic', name: 'Quiet Reading Room', ...ghost })
        !== deadLaw.allowsInstitution({ category: NEUTRAL_SHELF, name: 'Quiet Reading Room', ...ghost }),
      uiHides('Magic', 'Quiet Reading Room', ghost) !== uiHides(NEUTRAL_SHELF, 'Quiet Reading Room', ghost),
      JSON.stringify(magicSensitivity('Magic', 'Quiet Reading Room', 'city'))
        !== JSON.stringify(magicSensitivity(NEUTRAL_SHELF, 'Quiet Reading Room', 'city')),
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
    // POSITIVE CONTROL — the scanner finds an unmarked shelf read when one exists. Run over a
    // synthetic buffer rather than the tree, so the control cannot leave a mutant behind.
    const planted = [
      "  if (cat === 'magic') return true;",
      "  if (c === 'exotic') return true; // " + MARKER,
      "      tag === 'magic'",
    ];
    const found = planted.filter(l => isShelfTest(l));
    expect(found.length).toBe(2);                                  // the tag read is NOT a shelf read
    expect(found.filter(l => !l.includes(MARKER)).length).toBe(1); // and the unmarked one is seen
  });

  it('B3 — G3: the mundane chemical trade is reachable at priorityMagic 20, where it was zero', () => {
    const chance = (category, name, tier, priorityMagic) => getBaseChance(
      0.3, category, name,
      { tier, settType: tier, priorityMagic, priorityEconomy: 50, priorityMilitary: 50,
        priorityReligion: 50, priorityCriminal: 50, monsterThreat: 'civilized',
        tradeRouteAccess: 'road' },
      null, {},
    );
    // both rows are licensed `none` — R-INST-5 family B: an alchemist's shop is a chemical
    // trade with a real building program, not a wizard's workshop
    expect(chance('Magic', 'Alchemist shop', 'town', 20)).toBeGreaterThan(0);
    expect(chance('Magic', 'Alchemist quarter', 'city', 20)).toBeGreaterThan(0);
    // and it does not move with the dial at all any more, at any tier
    for (const [name, tier] of [['Alchemist shop', 'town'], ['Alchemist quarter', 'city']]) {
      const values = MAGIC_DIALS.map(pm => chance('Magic', name, tier, pm));
      expect(new Set(values).size, `${name} still rides the magic dial`).toBe(1);
    }
    // NON-VACUITY: a row that SHOULD ride the dial still does
    const enchanter = MAGIC_DIALS.map(pm => chance('Magic', "Enchanter's shop", 'city', pm));
    expect(new Set(enchanter).size).toBeGreaterThan(1);
  });

  it('B4 — G4: ONE read, TWO surfaces — the grid and the world law agree row by row', () => {
    const disagreements = [];
    for (const [tier, shelves] of Object.entries(institutionalCatalog)) {
      const kept = filterCatalogForMagic(shelves, DEAD);
      for (const [category, insts] of Object.entries(shelves)) {
        for (const [name, def] of Object.entries(insts)) {
          const offered = Boolean(kept[category] && kept[category][name]);
          const allowed = deadLaw.allowsInstitution({ category, name, ...def });
          if (offered !== allowed) disagreements.push(`${tier}/${category}/${name}`);
        }
      }
    }
    // The five survivors are CONTENT-PROFILE denials, not magic: the world law refuses them
    // for a reason the magic grid has never had an opinion about. Naming them is what makes
    // the arm a measurement rather than a tolerance.
    expect(disagreements).toEqual([
      'town/Economy/Slave market',
      'city/Economy/Slave market',
      'city/Economy/Slave market district',
      'city/Criminal/Kidnapping ring',
      'city/Criminal/Human trafficking network',
    ]);
    // and the row the divergence was found on is now present on BOTH surfaces
    const hamlet = institutionalCatalog.hamlet.Magic["Adventurers' charter hall"];
    expect(deadLaw.allowsInstitution({ category: 'Magic', name: "Adventurers' charter hall", ...hamlet })).toBe(true);
    expect(uiHides('Magic', "Adventurers' charter hall", hamlet)).toBe(false);
  });

  it('B5 — G5: a repository of books is not multiplied by the magic dial', () => {
    const values = MAGIC_DIALS.map(priorityMagic => getBaseChance(
      0.4, 'Magic', 'Great library',
      { tier: 'metropolis', settType: 'metropolis', priorityMagic, priorityEconomy: 50,
        priorityMilitary: 50, priorityReligion: 50, priorityCriminal: 50,
        monsterThreat: 'civilized', tradeRouteAccess: 'road' },
      null, {},
    ));
    expect(new Set(values).size).toBe(1);
    expect(values[0]).toBeGreaterThan(0);
    // it also survives a dead-magic world now, on both surfaces
    const row = institutionalCatalog.metropolis.Magic['Great library'];
    expect(isArcaneInstitution('Great library', 'Magic')).toBe(false);
    expect(deadLaw.allowsInstitution({ category: 'Magic', name: 'Great library', ...row })).toBe(true);
    expect(uiHides('Magic', 'Great library', row)).toBe(false);
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
    // the three that left, and WHY: two matched no catalog name at all, and the third is a
    // member of magicFilter's ARCANE_GOODS — a goods vocabulary inside an institution gate.
    // The absence is ANCHORED on a keyword that must still be there, so the assertion cannot
    // pass by the list having drifted away entirely (tests/helpers/anchoredNegatives.js).
    for (const dead of ['magical banking', 'enchanting quarter', 'magic item consignment']) {
      expectAbsentWithAnchor(keywords, dead, 'teleportation', `hiMagicInsts :: ${dead}`);
      const hits = ROWS.filter(r => r.name.toLowerCase().includes(dead));
      expect(hits.map(r => r.name), `${dead} was not dead after all`).toEqual([]);
    }
    // and the goods gate still owns it
    expect(filterGoodsForMagic(['Magic item consignment', 'Grain'], DEAD)).toEqual(['Grain']);
  });

  it('B7 — the NON-CATALOG fallback is live at every gate, unchanged', () => {
    // Nothing here is a catalog name, so every gate must answer exactly as it did before.
    const custom = { name: 'Conclave of the Veil', category: 'Magic', tags: ['civic'] };
    expect(isArcaneInstitution('Conclave of the Veil', 'Magic')).toBe(true);        // shelf fallback
    expect(deadLaw.allowsInstitution(custom)).toBe(false);                          // P5 shelf fallback
    expect(uiHides('Magic', 'Bespoke Sigil Works', { tags: [] })).toBe(true);       // UI shelf fallback
    // the keyword fallback, on a shelf that says nothing
    expect(deadLaw.allowsInstitution({ category: 'Crafts', name: 'Backstreet wizard' })).toBe(false);
    expect(uiHides('Crafts', 'Backstreet wizard', { tags: [] })).toBe(true);
    // and a plainly mundane invented row is still allowed
    expect(deadLaw.allowsInstitution({ category: 'Crafts', name: 'Bob’s Cooperage' })).toBe(true);
    expect(uiHides('Crafts', 'Bob’s Cooperage', { tags: [] })).toBe(false);
  });

  it('B7b — THE SIXTH SURFACE: a bucket name is not a claim, but a sentence still is', () => {
    // Found by execution at this build, not by the charter. `generationCoherence.js` walks
    // EVERY string in a finished settlement — including its TAXONOMY fields — and asks
    // `allowsMagicClaim` about each. `textAssertsFunctionalMagic` is a PROSE detector, so the
    // bare strings 'Magic', 'arcane' and 'magic' read as claims, and the moment a magic-free
    // world lawfully keeps a Magic-shelf row its own certification convicted it of claiming
    // magic — for the name of the shelf it is filed on. Three of five mundane members failed
    // that certification before this predicate landed.
    for (const token of ['Magic', 'magic', 'magical', 'arcane', 'planar', 'enchanting',
      'alchemy', '  ARCANE  ']) {
      expect(deadLaw.allowsMagicClaim(token), token).toBe(true);
    }
    // POSITIVE CONTROL — a SENTENCE still convicts, in the same dead-magic world, so this is a
    // narrowing to bare classification tokens and not a hole in the certification.
    for (const prose of [
      'A resident wizard sells cantrips to travellers.',
      'The arcane wards are renewed each spring.',
      'Teleportation circles link the quarter to the capital.',
      'magic works here',
    ]) {
      expect(deadLaw.allowsMagicClaim(prose), prose).toBe(false);
    }
    // and a magical world is unaffected in both directions
    const liveLaw = createGenerationWorldLaw(
      { magicExists: true, priorityMagic: 50, tradeRouteAccess: 'port', terrainType: 'coastal' },
      { tradeRoute: 'port', terrainType: 'coastal' },
    );
    expect(liveLaw.allowsMagicClaim('The arcane wards are renewed each spring.')).toBe(true);
  });

  it('B8 — NON_MAGIC_EXOTICS is gone, and both of its members behave identically', () => {
    // the CODE is gone; the packet's own explanation of why it is gone is prose and stays
    const executable = read('src/generators/institutionProbability.js')
      .split('\n')
      .filter(line => !/^\s*(?:\/\/|\*|\/\*)/.test(line));
    expect(executable.filter(l => l.includes('NON_MAGIC_EXOTICS'))).toEqual([]);
    // `Dragon resident` no longer needs an exemption: it declares `magicLicense: 'none'`
    const dragon = institutionalCatalog.city.Exotic['Dragon resident'];
    const dial = pm => getBaseChance(
      0.1, 'Exotic', 'Dragon resident',
      { tier: 'city', settType: 'city', priorityMagic: pm, priorityEconomy: 50,
        priorityMilitary: 50, priorityReligion: 50, priorityCriminal: 50,
        monsterThreat: 'civilized', tradeRouteAccess: 'road' },
      null, {},
    );
    expect(new Set(MAGIC_DIALS.map(dial)).size).toBe(1);
    expect(dragon.magicLicense).toBe('none');
    // and the exemption's OTHER member was inert all along — `Underground city` sits on the
    // metropolis Criminal shelf, where the test it exempted from never fired
    expect(Object.keys(institutionalCatalog.metropolis.Criminal)).toContain('Underground city');
    expect(institutionalCatalog.metropolis.Exotic?.['Underground city']).toBeUndefined();
  });
});
