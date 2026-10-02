/**
 * fontCmap.test.js — EM-D2's arms over `src/pdf/lib/fontCoverage.js`, the cmap
 * reader that tells a DM which characters the printed dossier cannot draw.
 *
 * ⛔ THE BASENAME CARRIES NO INVARIANT WORD, AND THAT IS THE NAME'S JOB. `NAME_PATTERN`
 * in tests/lint/mutationCoverage.shared.mjs enrols any test file whose basename holds
 * `coverage` (or census/scan/walker/parity/golden/...) into the mutation-coverage
 * spine, which then owes a register row in scripts/mutation-coverage-manifest.json.
 * This file is a UNIT BATTERY over one module, not an enumerated-invariant walker, so
 * the honest cure is the one that module's own header points at -- `prefer fixing the
 * name over widening the pattern`. The SUBJECT keeps its name; the test drops the word.
 *
 * ⭐ WRITTEN AND RUN BEFORE THE MODULE EXISTED. With the module absent this file cannot
 * collect, so no arm here was ever green before its subject was built; the gate batch
 * re-proves it by PLANT-AND-RESTORE and quotes the count line.
 *
 * ⛔ THE READER IS CHECKED AGAINST A SECOND IMPLEMENTATION, NOT AGAINST ITSELF. A cmap
 * parser tested only by its own expectations agrees with its own bugs. `fontkit@2.0.4`
 * is in the tree as a dependency of @react-pdf/font and @react-pdf/pdfkit -- inside the
 * lazy PDF chunk, which is exactly why the product may not import it and why a TEST
 * may: a test is not bundled. `buildCoveredCodepoints` in fontGlyphCoverage.test.js
 * already reads the same eight faces through it, so the oracle is the estate's own.
 *
 * ⛔ AND THE ONE DISAGREEMENT IS PINNED IN BOTH DIRECTIONS. fontkit's `characterSet`
 * reports U+FFFF for all eight faces because a format-4 subtable must END with a
 * 0xFFFF..0xFFFF segment; in every one of ours that segment resolves to glyph 0, so the
 * module excludes it. The arm below asserts the symmetric difference IS exactly
 * {U+FFFF} rather than asserting a count, so a real divergence could not hide inside a
 * number that happened to match.
 *
 * ⚠ SYNTHETIC BYTES ARE DECLARED AND EXECUTED. No face this product ships carries a
 * format-12 subtable (measured: all eight are format 4 under platform 0/3 and 3/1), so
 * that arm assembles a minimal sfnt byte by byte and drives the real exported reader
 * over it. The assembler is proven by reading its own format field back before the
 * assertion that depends on it, so a mis-assembled buffer reds as a broken FIXTURE
 * rather than as a broken reader.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, expect, it } from 'vitest';
import * as fontkit from 'fontkit';

import {
  EMBEDDED_FACES,
  FONT_URL_PREFIX,
  coverageOf,
  familyCoverage,
  fetchFace,
  loadFamilyCoverage,
  readCoveredCodePoints,
} from '../../src/pdf/lib/fontCoverage.js';

// fontkit 2.x is ESM-with-named-exports (no default); the same namespace grab
// fontGlyphCoverage.test.js uses, for the same resolution reason.
const create = fontkit.create || fontkit.default?.create;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONT_DIR = join(ROOT, 'public', 'fonts');

const faceBytes = (file) => new Uint8Array(readFileSync(join(FONT_DIR, file)));
const ALL_FACES = [...EMBEDDED_FACES.Lora, ...EMBEDDED_FACES.Nunito];

/** The family sets, built once through the module's own intersection rule. */
const familyOf = (family) => familyCoverage(
  family,
  EMBEDDED_FACES[family].map((file) => ({ file, bytes: faceBytes(file) })),
);
const LORA = familyOf('Lora');
const NUNITO = familyOf('Nunito');

const hex = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
const sortedHex = (cps) => [...cps].sort((a, b) => a - b).map(hex);

/** Code points named by number so this file carries no pasted glyph to mis-encode. */
const CP = {
  A: 0x41,
  a_macron: 0x0101,      // Latin Extended-A, covered by BOTH families (measured)
  ij_ligature: 0x0133,   // Latin Extended-A, LORA only (measured)
  a_double_grave: 0x0200, // Latin Extended-B, NUNITO only (measured)
  arrow_right: 0x2192,   // covered by NEITHER -- the estate's own tofu story
  warning: 0x26a0,       // covered by NEITHER
  grinning: 0x1f600,     // astral, covered by NEITHER
  terminator: 0xffff,    // the structural format-4 end segment
};

/**
 * A minimal sfnt carrying ONE cmap subtable in format 12, assembled here because no
 * shipped face has one. Three groups, and the third maps to glyph 0 so the reader's
 * .notdef rule is exercised on this format too.
 */
function syntheticFormat12Face() {
  const GROUPS = [
    { start: CP.A, end: CP.A + 2, startGlyph: 1 },
    { start: CP.grinning, end: CP.grinning + 1, startGlyph: 5 },
    { start: CP.arrow_right, end: CP.arrow_right, startGlyph: 0 },
  ];
  const subtableLength = 16 + GROUPS.length * 12;
  const cmapLength = 4 + 8 + subtableLength;
  const bytes = new Uint8Array(12 + 16 + cmapLength);
  const view = new DataView(bytes.buffer);

  view.setUint32(0, 0x00010000);           // sfntVersion
  view.setUint16(4, 1);                    // numTables
  view.setUint32(12, 0x636d6170);          // tag 'cmap'
  view.setUint32(20, 28);                  // table offset
  view.setUint32(24, cmapLength);          // table length

  view.setUint16(28 + 0, 0);               // cmap version
  view.setUint16(28 + 2, 1);               // one encoding record
  view.setUint16(28 + 4, 3);               // platform 3
  view.setUint16(28 + 6, 10);              // encoding 10 (full Unicode)
  view.setUint32(28 + 8, 12);              // subtable offset, from the cmap start

  const sub = 28 + 12;
  view.setUint16(sub + 0, 12);             // format
  view.setUint32(sub + 4, subtableLength); // length
  view.setUint32(sub + 12, GROUPS.length);
  GROUPS.forEach((group, i) => {
    const at = sub + 16 + i * 12;
    view.setUint32(at, group.start);
    view.setUint32(at + 4, group.end);
    view.setUint32(at + 8, group.startGlyph);
  });
  return { bytes, subtableOffset: sub, view };
}

describe('EM-D2: the embedded faces coverage reader', () => {
  it('C1: the eight declared faces ARE the eight TTFs public/fonts ships, and every one reads', () => {
    // ⛔ READ FROM DISK, NEVER RESTATED. The module restates the eight file names so it
    // can import nothing from src/pdf/theme.js; THIS is what keeps the restatement
    // honest -- a face added, renamed or dropped under public/fonts reds here.
    const shipped = readdirSync(FONT_DIR).filter((file) => file.endsWith('.ttf')).sort();
    expect([...ALL_FACES].sort()).toEqual(shipped);
    expect(shipped.length).toBe(8);

    // Every declared file is really on disk and really parses: the sizes below are the
    // liveness control for every arm that follows, because an unreadable face would
    // otherwise present as "this family covers nothing".
    const sizes = ALL_FACES.map((file) => readCoveredCodePoints(faceBytes(file)).size);
    expect(sizes.filter((size) => size > 500).length).toBe(8);
    expect(FONT_URL_PREFIX).toBe('/fonts/');
  });

  it('C2: the reader agrees with fontkit on every face, and differs by exactly the structural U+FFFF', () => {
    const rows = ALL_FACES.map((file) => {
      const bytes = faceBytes(file);
      const mine = readCoveredCodePoints(bytes);
      const theirs = new Set(create(bytes).characterSet);
      return {
        file,
        onlyMine: sortedHex([...mine].filter((cp) => !theirs.has(cp))),
        onlyFontkit: sortedHex([...theirs].filter((cp) => !mine.has(cp))),
        sizeDelta: theirs.size - mine.size,
      };
    });
    // The ORACLE IS LIVE: fontkit really did read these files and really did find
    // thousands of code points, so the equalities below are not two empty sets agreeing.
    const oracleSizes = ALL_FACES.map((file) => new Set(create(faceBytes(file)).characterSet).size);
    expect(oracleSizes.filter((size) => size > 500).length).toBe(8);

    expect(rows.map((row) => row.onlyMine)).toEqual(ALL_FACES.map(() => []));
    expect(rows.map((row) => row.onlyFontkit)).toEqual(ALL_FACES.map(() => [hex(CP.terminator)]));
    expect(rows.map((row) => row.sizeDelta)).toEqual(ALL_FACES.map(() => 1));
  });

  it('C3: a family set is the INTERSECTION over its faces, and the two families genuinely differ', () => {
    expect(LORA.family).toBe('Lora');
    expect(LORA.faces).toEqual([...EMBEDDED_FACES.Lora]);
    expect(NUNITO.faces).toEqual([...EMBEDDED_FACES.Nunito]);

    // The intersection is computed, never assumed: it can never exceed any one face.
    const perFace = EMBEDDED_FACES.Lora.map((file) => readCoveredCodePoints(faceBytes(file)).size);
    expect(perFace.filter((size) => size >= LORA.covered.size).length).toBe(4);

    // ⛔ A NARROWED FAMILY IS A NARROWED SET. Hand the builder one REAL face and one
    // synthetic face that draws only 'A'..'C', and the family collapses to that -- which
    // is the property a four-face intersection rests on, proven rather than asserted.
    const { bytes } = syntheticFormat12Face();
    const narrowed = familyCoverage('Lora', [
      { file: 'Lora-Regular.ttf', bytes: faceBytes('Lora-Regular.ttf') },
      { file: 'synthetic.ttf', bytes },
    ]);
    expect(sortedHex(narrowed.covered)).toEqual([hex(CP.A), hex(CP.A + 1), hex(CP.A + 2)]);

    // The measured per-family divergence: each family draws a Latin-Extended letter the
    // other cannot, so a "covered" answer is a fact about ONE family, never about text.
    const rows = [
      { cp: CP.a_macron, lora: LORA.covered.has(CP.a_macron), nunito: NUNITO.covered.has(CP.a_macron) },
      { cp: CP.ij_ligature, lora: LORA.covered.has(CP.ij_ligature), nunito: NUNITO.covered.has(CP.ij_ligature) },
      { cp: CP.a_double_grave, lora: LORA.covered.has(CP.a_double_grave), nunito: NUNITO.covered.has(CP.a_double_grave) },
      { cp: CP.arrow_right, lora: LORA.covered.has(CP.arrow_right), nunito: NUNITO.covered.has(CP.arrow_right) },
      { cp: CP.grinning, lora: LORA.covered.has(CP.grinning), nunito: NUNITO.covered.has(CP.grinning) },
      { cp: CP.terminator, lora: LORA.covered.has(CP.terminator), nunito: NUNITO.covered.has(CP.terminator) },
    ];
    expect(rows).toEqual([
      { cp: CP.a_macron, lora: true, nunito: true },
      { cp: CP.ij_ligature, lora: true, nunito: false },
      { cp: CP.a_double_grave, lora: false, nunito: true },
      { cp: CP.arrow_right, lora: false, nunito: false },
      { cp: CP.grinning, lora: false, nunito: false },
      { cp: CP.terminator, lora: false, nunito: false },
    ]);
  });

  it('C4: a format-12 subtable is read, over a SYNTHETIC face assembled byte by byte', () => {
    const { bytes, subtableOffset, view } = syntheticFormat12Face();
    // THE FIXTURE PROVES ITSELF FIRST: if the assembler is wrong, this reds as a broken
    // fixture instead of convicting the reader below.
    expect(view.getUint16(subtableOffset)).toBe(12);
    expect(view.getUint32(subtableOffset + 12)).toBe(3);

    const covered = readCoveredCodePoints(bytes);
    expect(sortedHex(covered)).toEqual([
      hex(CP.A), hex(CP.A + 1), hex(CP.A + 2),
      hex(CP.grinning), hex(CP.grinning + 1),
    ]);
    // Group three maps to glyph 0, so the .notdef rule holds in format 12 as well.
    expect(covered.has(CP.arrow_right)).toBe(false);
  });

  it('C5: coverageOf reports every uncovered OCCURRENCE with its UTF-16 index, in the text order', () => {
    const text = `${String.fromCodePoint(CP.a_macron)}b${String.fromCodePoint(CP.grinning)}c${String.fromCodePoint(CP.arrow_right)}${String.fromCodePoint(CP.arrow_right)}`;
    const result = coverageOf(text, LORA);
    expect(result.family).toBe('Lora');
    expect(result.uncovered).toEqual([
      { char: String.fromCodePoint(CP.grinning), codePoint: CP.grinning, index: 2 },
      { char: String.fromCodePoint(CP.arrow_right), codePoint: CP.arrow_right, index: 5 },
      { char: String.fromCodePoint(CP.arrow_right), codePoint: CP.arrow_right, index: 6 },
    ]);
    // The astral character occupies TWO UTF-16 units, so the index after it skips one --
    // which is the whole reason the index is reported rather than recomputed by a caller.
    expect(result.uncovered.map((entry) => text.slice(entry.index, entry.index + entry.char.length)))
      .toEqual(result.uncovered.map((entry) => entry.char));
    // Deterministic and pure: the same call twice, and the text is returned to nobody.
    expect(coverageOf(text, LORA)).toEqual(result);
    expect(text.length).toBe(7);
  });

  it('C6: a fully covered text reports nothing, so the report measures the text and not the call', () => {
    const plain = 'A quiet reeve, twice over.';
    expect(coverageOf(plain, LORA).uncovered).toEqual([]);
    expect(coverageOf(plain, NUNITO).uncovered).toEqual([]);
    // ...and the very same call over a text with one bad character is not empty, which is
    // what makes the two empties above a measurement rather than a mount.
    const spoiled = `${plain}${String.fromCodePoint(CP.warning)}`;
    expect(coverageOf(spoiled, LORA).uncovered.map((entry) => entry.codePoint)).toEqual([CP.warning]);
  });

  it('C7: coverageOf FAILS OPEN: with no coverage loaded it reports nothing rather than everything', () => {
    const text = String.fromCodePoint(CP.grinning);
    const rows = [null, undefined, {}, { family: 'Lora', covered: new Set() }]
      .map((family) => coverageOf(text, family).uncovered);
    expect(rows).toEqual([[], [], [], []]);
    // The same text against a REAL family is not empty, so the four above are the
    // fail-open rule and not a text that had nothing wrong with it.
    expect(coverageOf(text, LORA).uncovered.length).toBe(1);
    // A non-string reads as empty text rather than throwing into a render.
    expect(coverageOf(undefined, LORA).uncovered).toEqual([]);
  });

  it('C8: loadFamilyCoverage reads ON DEMAND through the INJECTED reader, once per face', async () => {
    const asked = [];
    const loaded = await loadFamilyCoverage('Nunito', async (file) => {
      asked.push(file);
      return faceBytes(file);
    });
    expect(asked).toEqual([...EMBEDDED_FACES.Nunito]);
    expect(loaded.covered.size).toBe(NUNITO.covered.size);
    expect(loaded.family).toBe('Nunito');

    const refusals = [];
    await loadFamilyCoverage('Helvetica', async () => faceBytes('Lora-Regular.ttf'))
      .catch((error) => refusals.push(String(error.message)));
    await loadFamilyCoverage('Lora', null).catch((error) => refusals.push(String(error.message)));
    expect(refusals.map((message) => message.startsWith('fontCoverage:'))).toEqual([true, true]);
    expect(refusals.length).toBe(2);
  });

  it('C9: fetchFace asks for the SERVED path and refuses a response that is not ok', async () => {
    const asked = [];
    const original = globalThis.fetch;
    globalThis.fetch = async (url) => {
      asked.push(url);
      return {
        ok: !url.endsWith('Lora-Bold.ttf'),
        arrayBuffer: async () => faceBytes('Lora-Regular.ttf').buffer,
      };
    };
    try {
      const bytes = await fetchFace('Lora-Regular.ttf');
      const refused = [];
      await fetchFace('Lora-Bold.ttf').catch((error) => refused.push(String(error.message)));
      expect(asked).toEqual(['/fonts/Lora-Regular.ttf', '/fonts/Lora-Bold.ttf']);
      expect(bytes instanceof Uint8Array).toBe(true);
      expect(readCoveredCodePoints(bytes).size).toBe(readCoveredCodePoints(faceBytes('Lora-Regular.ttf')).size);
      expect(refused.map((message) => message.includes('Lora-Bold.ttf'))).toEqual([true]);
    } finally {
      globalThis.fetch = original;
    }
  });

  it('C10: a face that cannot be read THROWS, so a failed read never reads as a broken alphabet', () => {
    const thrown = [];
    for (const bad of [new Uint8Array(0), new Uint8Array([1, 2, 3, 4]), 'Lora-Regular.ttf']) {
      try {
        readCoveredCodePoints(/** @type {never} */ (bad));
        thrown.push('no throw');
      } catch (error) {
        thrown.push(String(error.message).startsWith('fontCoverage:') ? 'refused' : 'wrong error');
      }
    }
    expect(thrown).toEqual(['refused', 'refused', 'refused']);
    // The same call over a REAL face does not throw, so the three refusals above convict
    // the bytes rather than the reader.
    expect(readCoveredCodePoints(faceBytes('Lora-Regular.ttf')).size > 0).toBe(true);
  });

  it('C11: the reason this reader was WRITTEN stays true: the estate declares no font parser of its own', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const declared = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    const PARSERS = ['fontkit', 'opentype.js', 'fonteditor-core', 'ttf2woff2', 'fontverter'];
    const isParser = (names) => names.filter((name) => PARSERS.includes(name)).sort();

    // The filter is LIVE: driven over a manifest that does declare one, it finds it.
    expect(isParser([...declared, 'opentype.js'])).toEqual(['opentype.js']);
    expect(isParser(declared)).toEqual([]);

    // And the parser that IS in the tree reaches it only through the lazy PDF stack, so
    // importing it from src/ would drag that chunk into the editor's closure.
    const font = JSON.parse(readFileSync(join(ROOT, 'node_modules/@react-pdf/font/package.json'), 'utf8'));
    expect(typeof font.dependencies.fontkit).toBe('string');
  });
});
