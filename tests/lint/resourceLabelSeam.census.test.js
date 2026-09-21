/**
 * resourceLabelSeam.census.test.js — HABITAT REMOVAL FOR THE RAW RESOURCE KEY
 * (ODQ §934.22 item 2, the second browser pass).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────────────
 * The Economics tab's Trade Profile printed this, in one row, on one settlement:
 *
 *   camel_herds · hot_springs_mineral · mountain_timber · clay · spices ·
 *   Quality iron fittings · Salt
 *
 * Every one of those comes from ONE persisted field — `resourceAnalysis.imports.critical`,
 * built by `buildViabilityReport` out of `terrain.mustImport` and `RESOURCE_CHAINS[*]
 * .rawResource`. Some entries are authored phrases, some are bare lower-case commodity
 * words, and some are raw `RESOURCE_DATA` keys. Nothing fails when a key leaks: it is a
 * display detail, so no golden moves and no type complains, and the defect is visible only
 * to a reader who happens to open that tab on that terrain.
 *
 * That is a habitat, not an incident. This walker removes it.
 *
 * ── WHAT IS ASSERTED ─────────────────────────────────────────────────────────────────
 *   1. TOTALITY — the seam's inline table is re-derived from `src/data/resourceData.js` and
 *      must match it EXACTLY, both ways. The seam does not import the catalogue (its
 *      docblock says why: the PDF worker's byte budget), so this arm is the only thing
 *      standing between a duplicated table and silent drift.
 *   2. NO RAW KEY REACHES A READER — every value of every resource-shaped list on a driven
 *      corpus is projected through the seam, and none may come back as a machine token. With
 *      a CONTROL on the same corpus proving the unprojected values DO carry them, so the arm
 *      cannot go vacuously green the day the generator stops emitting keys.
 *   3. THE INSTALLATION HOLDS — every threaded file still imports and calls the seam, and
 *      the two readers this lane could not edit are named with the line each one owes.
 *   4. THE SEAM DOES WHAT IT CLAIMS — a key becomes its catalogue label, a spaced spelling
 *      of a key resolves to the same label, an authored phrase keeps its words, and
 *      everything leaves in ONE case.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import {
  RESOURCE_DISPLAY_LABELS,
  resourceDisplayName,
} from '../../src/domain/display/resourceDisplayName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SEAM_MODULE = 'resourceDisplayName';

/** The files the §934.22 census threaded, and what each one prints. */
const THREADED = Object.freeze({
  'src/pdf/sections/ResourcesProduction.jsx': 'the terrain ADVANTAGES and CRITICALS tags',
  'src/pdf/sections/Overview.jsx': "the Geography chapter's advantages, criticals and nearby lists",
  'src/foundry/journalPages.js': "the VTT journal's Exports and Imports rows",
  // ODQ §934.22 item 2 — threaded by lane 25 (the two rows this file used to carry as OWED).
  'src/components/new/tabs/EconomicsTab.jsx': 'the Imports pills on the Trade Profile',
  'src/pdf/sections/EconomicsTrade.jsx': 'the EXPORTS and IMPORTS bullet lists',
});


/** A machine token: what no reader may ever be shown. */
const MACHINE_TOKEN = /^[a-z_]+$/;

/** Configs chosen to light the terrains whose `mustImport` lists carry the raw keys. */
const CASES = Object.freeze([
  { settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road', monsterThreat: 'frontier' },
  { settType: 'city', culture: 'mediterranean', terrainOverride: 'desert', tradeRouteAccess: 'crossroads', monsterThreat: 'safe' },
  { settType: 'village', culture: 'germanic', terrainOverride: 'coastal', tradeRouteAccess: 'port', monsterThreat: 'civilized' },
  { settType: 'metropolis', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'safe' },
]);

/** Every reader-facing resource-shaped string one settlement carries. */
function readerValues(s) {
  const ra = s?.resourceAnalysis;
  const eco = s?.economicState;
  const criticals = ra && !Array.isArray(ra.imports) ? (ra.imports?.critical || []) : [];
  return [
    ...criticals,
    ...(ra?.terrainAdvantages || []),
    ...(s?.config?.nearbyResources || []),
    ...(eco?.primaryImports || []),
    ...(eco?.primaryExports || []),
  ].filter((v) => typeof v === 'string' && v !== '');
}

const settlements = CASES.map((cfg, i) => generateSettlementPipeline(
  cfg, null, { seed: `resource-seam-${i}`, customContent: {} },
));

describe('the resource label seam — the table cannot fall behind the catalogue', () => {
  test('every RESOURCE_DATA key has a row, with the catalogue\'s own label', () => {
    const missing = [];
    for (const [key, spec] of Object.entries(RESOURCE_DATA)) {
      if (!Object.hasOwn(RESOURCE_DISPLAY_LABELS, key)) {
        missing.push(`${key}: no row (catalogue says "${spec.label}")`);
      } else if (RESOURCE_DISPLAY_LABELS[key] !== spec.label) {
        missing.push(`${key}: row says "${RESOURCE_DISPLAY_LABELS[key]}", catalogue says "${spec.label}"`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('and no row names a key the catalogue has dropped', () => {
    const extra = Object.keys(RESOURCE_DISPLAY_LABELS).filter((k) => !Object.hasOwn(RESOURCE_DATA, k));
    expect(extra).toEqual([]);
  });

  test('the table is not silently emptying', () => {
    // anchored: the count is the catalogue's own, read in this same test, so the pair cannot
    // both shrink to zero and still agree.
    expect(Object.keys(RESOURCE_DISPLAY_LABELS)).toHaveLength(Object.keys(RESOURCE_DATA).length);
    expect(Object.keys(RESOURCE_DATA).length).toBeGreaterThanOrEqual(33);
  });
});

describe('the resource label seam — no machine token reaches a reader', () => {
  test('every resource-shaped value leaves the seam as a word', () => {
    const offenders = new Set();
    for (const s of settlements) {
      for (const v of readerValues(s)) {
        const shown = resourceDisplayName(v);
        if (MACHINE_TOKEN.test(shown)) offenders.add(`${v} ⇒ ${shown}`);
        // A bare lower-case opening is the SAME defect one step less obvious ("iron ore"
        // beside "Quality iron fittings"), and it is what the owner actually quoted.
        if (/^[a-z]/.test(shown)) offenders.add(`${v} ⇒ ${shown} (starts lower case)`);
      }
    }
    expect([...offenders]).toEqual([]);
  });

  test('CONTROL: the UNPROJECTED values really do carry machine tokens on this corpus', () => {
    // ⛔ WITHOUT THIS the arm above would pass just as happily on a corpus that never emits a
    // key at all, which is the vacuous-green failure this estate has been bitten by before.
    const raw = settlements.flatMap(readerValues);
    expect(raw.filter((v) => MACHINE_TOKEN.test(v)).length,
      'the corpus stopped emitting raw keys — re-choose the CASES before trusting the arm above')
      .toBeGreaterThan(0);
    expect(raw.length).toBeGreaterThan(20);
  });
});

describe('the resource label seam — the installation holds', () => {
  for (const [file, what] of Object.entries(THREADED)) {
    test(`${file} still renders ${what} through the seam`, () => {
      const lines = readFileSync(join(ROOT, file), 'utf8').split('\n');
      const imports = lines.filter((l) => /^import\b/.test(l.trim()) && l.includes(SEAM_MODULE));
      expect(imports.length, `${file} imports the seam`).toBe(1);
      const uses = lines.filter((l) => !/^import\b/.test(l.trim()) && l.includes(SEAM_MODULE));
      expect(uses.length, `${file} uses the seam`).toBeGreaterThan(0);
    });
  }

  /**
   * ODQ §934.22 item 2 — THE DEBT IS PAID, SO THE ROWS CAME OUT AND THE ARM TURNED OVER.
   * This test used to assert that neither file had the seam yet, because both belonged to
   * lane 25 and a lane that edits a file it does not own is how two lanes overwrite each
   * other. Lane 25 threaded both, so the two rows moved into THREADED above (which asserts
   * the import AND a use) and what is left here is the half that map cannot see: the seam
   * resolves the PRINTED label while the MATCH — the sort, the necessity and terrain tests,
   * the custom-endpoint ownership read — still runs on the RAW persisted string. That split
   * is the whole design, and a cure that resolved the label before the match would have
   * broken `availableResourceSatisfies` silently.
   */
  test('the two readers lane 25 owed resolve the LABEL and still match on the RAW value', () => {
    const tab = readFileSync(join(ROOT, 'src/components/new/tabs/EconomicsTab.jsx'), 'utf8');
    // The ownership read and the terrain test take `imp`; only the printed pill takes the seam.
    expect(tab).toContain("tradeLabelOwnership(eco,'imports',imp)");
    expect(tab).toContain('const impLabel=resourceDisplayName(imp);');
    // The exclusion below measures the SPLIT, not an empty file: the two `toContain` lines
    // above read this same payload and would red first if the list stopped rendering.
    // anchored: `const impLabel=resourceDisplayName(imp);` is pinned PRESENT on this same source one line above
    expect(tab).not.toContain("tradeLabelOwnership(eco,'imports',impLabel)");

    const pdf = readFileSync(join(ROOT, 'src/pdf/sections/EconomicsTrade.jsx'), 'utf8');
    expect(pdf).toContain('const ownership = tradeLabelOwnership(economy, direction, item);');
    expect(pdf).toContain('const shown = label(resourceDisplayName(item));');
    // anchored: both of the lines above are asserted PRESENT on this same payload.
    expect(pdf).not.toContain('tradeLabelOwnership(economy, direction, shown)');
  });
});

describe('the resource label seam — it does what it claims', () => {
  test('a catalogue key becomes its label, in one case', () => {
    expect(resourceDisplayName('camel_herds')).toBe('Camel herds');
    expect(resourceDisplayName('hot_springs_mineral')).toBe('Mineral hot springs');
    expect(resourceDisplayName('mountain_timber')).toBe('Mountain timber');
    expect(resourceDisplayName('desert_salt')).toBe('Salt pans');
  });

  test('a SPACED spelling of a key resolves to the same label, which is why the space rule exists', () => {
    // One generated town's critical list carried both spellings at once.
    expect(resourceDisplayName('glass_sand')).toBe('Fine glass sand');
    expect(resourceDisplayName('glass sand')).toBe('Fine glass sand');
  });

  test('a bare commodity word becomes a word, and an authored phrase keeps its own', () => {
    expect(resourceDisplayName('clay')).toBe('Clay');
    expect(resourceDisplayName('spices')).toBe('Spices');
    expect(resourceDisplayName('iron ore')).toBe('Iron ore');
    expect(resourceDisplayName('Quality iron fittings')).toBe('Quality iron fittings');
    expect(resourceDisplayName('Bulk grain and flour')).toBe('Bulk grain and flour');
  });

  test('nothing is coerced: a non-string, an empty string and whitespace all read as nothing', () => {
    expect(resourceDisplayName(null)).toBe('');
    expect(resourceDisplayName(undefined)).toBe('');
    expect(resourceDisplayName(42)).toBe('');
    expect(resourceDisplayName('')).toBe('');
    expect(resourceDisplayName('   ')).toBe('');
  });

  test('it is idempotent, so a doubly-threaded call site cannot re-spell a label', () => {
    for (const v of ['camel_herds', 'clay', 'Quality iron fittings', 'glass sand']) {
      expect(resourceDisplayName(resourceDisplayName(v))).toBe(resourceDisplayName(v));
    }
  });
});
