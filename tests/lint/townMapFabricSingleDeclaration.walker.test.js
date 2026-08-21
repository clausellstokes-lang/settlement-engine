/**
 * townMapFabricSingleDeclaration.walker.test.js — THE FABRIC SINGLE-DECLARATION LAW
 * (D3a, MF-T2A; the ODQ §310.3(7) source scan).
 *
 * ODQ §310.3(7) ordered a source scan "refusing same-name/different-contract exports" as the
 * next map wave's first act, after two same-named `clipHalfPlane` exports with OPPOSITE
 * half-plane conventions were found in the sealed sandbox tip — one keeping (p−q)·n ≥ 0, the
 * other keeping (p−o)·n ≤ 0. The port is about to pour 54 sandbox modules into
 * src/domain/townMap/fabric/, so this law closes that habitat BEFORE the sweep rather than
 * patching it after: any name declared in two files reds here, on arrival.
 *
 * THE RULE, and why it is the honest proxy: a mechanical scan cannot compare CONTRACTS. Two
 * DECLARATIONS of one identifier inside this directory are two implementations, which is two
 * contracts until someone proves otherwise. A re-export (`export { X } from './y.js'`) is NOT a
 * declaration and never fires — that is one implementation at two addresses, which is lawful and
 * is in fact the cure this walker points at.
 *
 * VICTORY ASSERTION, NOT A BASELINE: the population is EXACTLY ZERO today (0 duplicated names of
 * 94 across 18 files, measured at f20b9faa). There is deliberately no allow-list, exemption map,
 * baseline file or skip door — a door would be a place to bank the first offender.
 *
 * KNOWN BOUNDARY, pinned in both directions by the boundary case below rather than assumed: this
 * is a TEXT scan, so a column-zero `export const` sitting inside a template literal or a block
 * comment DOES contribute a declaration. An extra text match can only ADD an identifier to the
 * map and never remove one, so this scan can over-convict loudly and can never under-convict
 * silently. A false red is a stop a human reads; a false green would be a duplicate that landed.
 *
 * E-A: its removing power is proven by scripts/mutation-sweep.sh (label
 * "town-map/fabric duplicate export declaration" — a planted second declaration of
 * CURRENT_MAP_TRADITION_ID in dcelEmbedding.js must red this).
 *
 * TO COMPLY when this reds: give the two implementations DISTINCT names. If you meant one
 * implementation reachable at two addresses, re-export it (`export { X } from './y.js'`) instead
 * of declaring it twice.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FABRIC_DIR = 'src/domain/townMap/fabric';

/** A top-level `export` binding ONE identifier. Line-anchored: an indented export is not valid
 * at module top level, so the anchor is exact rather than approximate. */
const DECLARATION_RE = /^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm;

/** @param {string} source @returns {string[]} every identifier this source DECLARES and exports */
function declarationsOf(source) {
  const names = [];
  for (const match of source.matchAll(DECLARATION_RE)) names.push(match[1]);
  return names.sort();
}

/**
 * @param {Array<[string, string]>} sourcesByFile file label -> source text
 * @returns {Array<{name: string, files: string[]}>} names declared in two or more files
 */
function duplicatesOf(sourcesByFile) {
  /** @type {Map<string, Set<string>>} */
  const byName = new Map();
  for (const [file, source] of sourcesByFile) {
    for (const name of declarationsOf(source)) {
      if (!byName.has(name)) byName.set(name, new Set());
      /** @type {Set<string>} */ (byName.get(name)).add(file);
    }
  }
  return [...byName.entries()]
    .filter(([, files]) => files.size > 1)
    .map(([name, files]) => ({ name, files: [...files].sort() }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));
}

const TO_COMPLY = 'give the two implementations distinct names; a re-export'
  + ' (`export { X } from \'./y.js\'`) is the lawful way to have ONE implementation at two addresses';

const FABRIC_FILES = readdirSync(join(ROOT, FABRIC_DIR)).filter((f) => f.endsWith('.js')).sort();
const FABRIC_SOURCES = /** @type {Array<[string, string]>} */ (
  FABRIC_FILES.map((f) => [f, readFileSync(join(ROOT, FABRIC_DIR, f), 'utf8')])
);
const FABRIC_NAMES = new Set(FABRIC_SOURCES.flatMap(([, source]) => declarationsOf(source)));

describe('fabric single-declaration law (the ODQ 310.3(7) source scan)', () => {
  test('guard-the-guard: the fabric enumeration and the declaration scan are not vacuous', () => {
    // A2. The fabric ships 18 modules and 94 distinct exported names today. If the directory
    // emptied, the scan root rotted, or DECLARATION_RE silently stopped matching, the law below
    // would pass on nothing — so the floors are asserted FIRST, and they tighten toward reality.
    expect(FABRIC_FILES.length).toBeGreaterThanOrEqual(18);
    expect(FABRIC_NAMES.size).toBeGreaterThanOrEqual(94);
  });

  test('THE LAW: no exported name is declared in two files under the fabric directory', () => {
    // A1. The victory assertion. Exactly zero today, and any future member reds on arrival.
    const duplicates = duplicatesOf(FABRIC_SOURCES);
    expect(
      duplicates,
      `\nExported name(s) DECLARED in more than one file under ${FABRIC_DIR}/. Two declarations of`
      + ` one name are two implementations, which is two contracts — the exact defect ODQ 310.3(7)`
      + ` ordered closed after two clipHalfPlane exports were found with opposite conventions.`
      + ` For each: ${TO_COMPLY}:\n${duplicates.map((d) => `${d.name}  <-  ${d.files.join(', ')}`).join('\n')}\n`,
    ).toEqual([]);
  });

  test('counterforce: one name declared in two files is convicted, and both files are named', () => {
    // A3. The removing power, executed rather than argued. Without this arm the law above could
    // pass because duplicatesOf never returns anything at all.
    const convicted = duplicatesOf([
      ['alpha.js', 'export const sharedName = 1;\nexport function other() {}\n'],
      ['beta.js', 'export function sharedName() {}\n'],
    ]);
    expect(convicted).toEqual([{ name: 'sharedName', files: ['alpha.js', 'beta.js'] }]);
    expect(TO_COMPLY).toContain('distinct names');
  });

  test('boundary: re-exports never fire, and the text scan over-convicts rather than under-convicts', () => {
    // A4, BOTH directions. A re-export, a star re-export, an export default and an INDENTED
    // export contribute no declaration — so a lawful one-implementation-two-addresses cure can
    // never be punished by the law that recommends it.
    const lawful = "export { X } from './a.js';\nexport * from './b.js';\n"
      + 'export default function f() {}\nfunction outer() {\n  export const nested = 1;\n}\n';
    expect(declarationsOf(lawful)).toEqual([]);
    expect(duplicatesOf([['one.js', lawful], ['two.js', lawful]])).toEqual([]);
    // …AND the recorded limitation, asserted as a POSITIVE so it can never be discovered as a
    // surprise. A COLUMN-ZERO export inside a template literal or a block comment DOES contribute.
    // That direction only ADDS identifiers, so the law over-convicts loudly and never passes a
    // real duplicate in silence. Measured before this pin was written, not reasoned about.
    expect(declarationsOf('const doc = `\nexport const fromTemplate = 1;\n`;\n')).toEqual(['fromTemplate']);
    expect(declarationsOf('/*\nexport const fromBlockComment = 2;\n*/\n')).toEqual(['fromBlockComment']);
  });

  test('the named regression: two clipHalfPlane declarations with opposite conventions are caught', () => {
    // A5, THE PACKET'S POINT. Written as a FIXTURE, never as a scan of the sealed sandbox tip:
    // that tree is not in this repository and must not be reachable from a test. The two
    // signatures are the ones ODQ 310.3(7) named — groundLaw keeping (p-q).n >= 0 and
    // fabricGeometry keeping (p-o).n <= 0, complementary half-planes under one name.
    const convicted = duplicatesOf([
      ['groundLaw.js', 'export function clipHalfPlane(poly, qx, qy, nx, ny) {\n  return poly;\n}\n'],
      ['fabricGeometry.js', 'export function clipHalfPlane(poly, ox, oy, nx, ny) {\n  return poly;\n}\n'],
    ]);
    expect(convicted).toEqual([{ name: 'clipHalfPlane', files: ['fabricGeometry.js', 'groundLaw.js'] }]);
    expect(convicted[0].files).toContain('groundLaw.js');
    expect(convicted[0].files).toContain('fabricGeometry.js');
  });
});
