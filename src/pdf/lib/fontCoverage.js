/**
 * fontCoverage.js — WHAT THE EMBEDDED FACES CAN ACTUALLY DRAW (EM-D2's remainder).
 *
 * The dossier PDF embeds eight static TTFs, four Lora and four Nunito, registered by
 * `Font.register` in src/pdf/theme.js and shipped under public/fonts/. A DM's free text
 * goes into that document verbatim, so a character none of those faces carries does not
 * print as a tofu box: @react-pdf substitutes a NON-EMBEDDED base-14 Helvetica and
 * truncates to the low byte, and the customer prints a plausible WRONG LETTER. The
 * story, and the eight faces as the ground truth, are `buildCoveredCodepoints` in
 * tests/pdf/fontGlyphCoverage.test.js, which guards the estate's OWN literals. This
 * module is the same question asked of text the estate never wrote.
 *
 * ⛔ THIS MODULE REPORTS. IT NEVER CLAMPS, STRIPS, SUBSTITUTES OR REWRITES. FreeField's
 * own header law is THE LIMIT IS REPORTED, NEVER SILENT, and a coverage check that
 * quietly ate a character would be the silent half of exactly that defect. Every export
 * here answers a question; not one of them returns an edited string.
 *
 * ⛔ IT IMPORTS NOTHING. Not @react-pdf, not src/pdf/theme.js, not a node builtin, not a
 * package. Two reasons, and both are load-bearing:
 *   • THE PDF CHUNK IS LAZY AND BUDGETED. `editorTrain` in tests/build/vendorPdfLazy.test.js
 *     prices the settlement editor against `EAGER_FIRST_PAINT_MODULES` (vite.config.js),
 *     and one import of theme.js would drag `Font.register`, and therefore the whole
 *     vendor-pdf stack, behind whatever reached here. The eight FILE NAMES below are
 *     restated deliberately: a name is cheap, an edge is not. `fontRegistrationParity`
 *     in tests/pdf/fontRegistrationParity.test.js already pins the registration; the
 *     test beside this module pins these names against public/fonts/ itself, so the
 *     restatement cannot drift unnoticed.
 *   • THE ESTATE'S ONLY cmap PARSER IS INSIDE THAT CHUNK. Measured 2026-09-23 on the
 *     slot's node_modules: `fontkit@2.0.4` is the single TTF reader the tree ships and
 *     it is a dependency of @react-pdf/font and @react-pdf/pdfkit ALONE -- it is not a
 *     declared dependency of this product and it is not in the editor's closure. So the
 *     reader below is written rather than imported. It stays test-checked AGAINST
 *     fontkit, which is free in a test because a test is not bundled.
 *
 * THE BYTES ARE READ ON DEMAND AND BY AN INJECTED READER. `loadFamilyCoverage` takes the
 * reader as an argument -- `fetchFace` in a browser, node's fs under test -- so nothing
 * here reaches for a global, nothing is fetched at import time, and the pure half of the
 * module (`readCoveredCodePoints`, `familyCoverage`, `coverageOf`) is testable with no
 * I/O at all.
 *
 * A FACE COVERS A CHARACTER ONLY IF EVERY FACE OF ITS FAMILY DOES. @react-pdf picks the
 * face from fontWeight/fontStyle at render time, so a glyph the regular carries and the
 * bold italic does not is a glyph that prints wrong in one of the four. The family set
 * is therefore the INTERSECTION across its faces, which is `buildCoveredCodepoints`'s
 * own rule.
 *
 * ⛔ NOTHING MOUNTS THIS YET. FreeField takes the report through an injected prop and
 * never imports this module, because importing it is precisely the edge the chunk law
 * forbids; the editor door that wires the two is not this member's file. With this leaf
 * landed the product renders not one pixel differently.
 */

/**
 * The eight embedded faces by family, exactly as `Font.register` names them in
 * src/pdf/theme.js. The `?v=2` cache-buster that registration carries is a BROWSER
 * CACHE concern and is not part of a file name, so it is absent here.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const EMBEDDED_FACES = Object.freeze({
  Lora: Object.freeze([
    'Lora-Regular.ttf',
    'Lora-Bold.ttf',
    'Lora-Italic.ttf',
    'Lora-BoldItalic.ttf',
  ]),
  Nunito: Object.freeze([
    'Nunito-Regular.ttf',
    'Nunito-Bold.ttf',
    'Nunito-ExtraBold.ttf',
    'Nunito-Italic.ttf',
  ]),
});

/** Where the faces are served from, the same public path the registration uses. */
export const FONT_URL_PREFIX = '/fonts/';

/**
 * ⛔ U+FFFF IS NOT A COVERED CHARACTER, AND THIS IS THE ONE PLACE THIS READER AND
 * fontkit DISAGREE. A format-4 subtable is REQUIRED to end with a segment whose
 * startCode and endCode are both 0xFFFF; in all eight shipped faces that segment
 * carries idDelta 1, so 0xFFFF maps to glyph 0 -- the .notdef -- and is not drawable.
 * fontkit's `characterSet` enumerates the segment anyway and so reports one code point
 * more per face. U+FFFF is a Unicode NONCHARACTER that no DM can type, the terminator
 * is structural rather than a glyph, and a reader that agreed here would have to agree
 * by copying a bug. The test beside this module pins the divergence at exactly this one
 * code point, in both directions, so a REAL disagreement could never hide inside it.
 */
const NONCHARACTER_TERMINATOR = 0xffff;

/** A glyph id of 0 is .notdef: the cmap knows the character and cannot draw it. */
const NOTDEF = 0;

/**
 * @typedef {object} FamilyCoverage
 * @property {string} family the registered family name, e.g. 'Lora'
 * @property {readonly string[]} faces the face file names the set was built from
 * @property {Set<number>} covered every code point EVERY one of those faces can draw
 */

/**
 * @typedef {object} UncoveredCharacter
 * @property {string} char the character itself, one full code point
 * @property {number} codePoint its code point
 * @property {number} index its UTF-16 offset in the text it came from, so a caller can
 *   slice the original string without re-scanning it. An astral character occupies two
 *   UTF-16 units, so indices are not consecutive when one appears.
 */

const TAG_CMAP = 0x636d6170;

/** A four-byte table tag read as one big-endian number, so the compare is exact. */
function tagAt(view, offset) {
  return view.getUint32(offset);
}

/**
 * The offset of the `cmap` table in an sfnt, or -1 when the font carries none.
 * @param {DataView} view
 * @returns {number}
 */
function cmapTableOffset(view) {
  if (view.byteLength < 12) return -1;
  const numTables = view.getUint16(4);
  for (let i = 0; i < numTables; i += 1) {
    const record = 12 + i * 16;
    if (record + 16 > view.byteLength) return -1;
    if (tagAt(view, record) === TAG_CMAP) return view.getUint32(record + 8);
  }
  return -1;
}

/**
 * Every code point a format-4 (Unicode BMP) subtable maps to a real glyph.
 * @param {DataView} view
 * @param {number} offset the subtable's own offset
 * @param {Set<number>} into
 */
function readFormat4(view, offset, into) {
  const segCountX2 = view.getUint16(offset + 6);
  const segCount = segCountX2 / 2;
  const endCodes = offset + 14;
  const startCodes = endCodes + segCountX2 + 2;
  const idDeltas = startCodes + segCountX2;
  const idRangeOffsets = idDeltas + segCountX2;
  if (idRangeOffsets + segCountX2 > view.byteLength) return;

  for (let seg = 0; seg < segCount; seg += 1) {
    const end = view.getUint16(endCodes + seg * 2);
    const start = view.getUint16(startCodes + seg * 2);
    if (start > end) continue;
    const delta = view.getInt16(idDeltas + seg * 2);
    const rangeOffset = view.getUint16(idRangeOffsets + seg * 2);
    for (let cp = start; cp <= end; cp += 1) {
      if (cp === NONCHARACTER_TERMINATOR) continue;
      let glyph;
      if (rangeOffset === 0) {
        glyph = (cp + delta) & 0xffff;
      } else {
        // The spec's own pointer arithmetic: the offset is measured FROM the
        // idRangeOffset slot itself, which is why the slot address is added back in.
        const at = idRangeOffsets + seg * 2 + rangeOffset + (cp - start) * 2;
        if (at + 2 > view.byteLength) continue;
        glyph = view.getUint16(at);
        if (glyph !== NOTDEF) glyph = (glyph + delta) & 0xffff;
      }
      if (glyph !== NOTDEF) into.add(cp);
    }
  }
}

/**
 * Every code point a format-12 (segmented, full Unicode) subtable maps to a real glyph.
 * ⚠ NO FACE THIS PRODUCT SHIPS CARRIES ONE -- measured 2026-09-23, all eight are
 * format 4 at platform 0/3 -- so this arm exists for the day a face is re-cut with
 * astral coverage, and the test beside this module drives it over a SYNTHETIC subtable
 * rather than letting it sit as an unexecuted branch.
 * @param {DataView} view
 * @param {number} offset
 * @param {Set<number>} into
 */
function readFormat12(view, offset, into) {
  if (offset + 16 > view.byteLength) return;
  const groupCount = view.getUint32(offset + 12);
  for (let group = 0; group < groupCount; group += 1) {
    const at = offset + 16 + group * 12;
    if (at + 12 > view.byteLength) return;
    const start = view.getUint32(at);
    const end = view.getUint32(at + 4);
    const startGlyph = view.getUint32(at + 8);
    if (start > end) continue;
    for (let cp = start; cp <= end; cp += 1) {
      if (cp === NONCHARACTER_TERMINATOR) continue;
      if (startGlyph + (cp - start) !== NOTDEF) into.add(cp);
    }
  }
}

/**
 * THE READER. Every code point one face can draw, read from its `cmap` table.
 *
 * Both Unicode subtable formats the estate can meet are honoured, and EVERY subtable is
 * read rather than one chosen: a face carries the same map twice under two platform ids
 * (0/3 and 3/1 in all eight of ours) and the union of equal maps is that map.
 *
 * @param {Uint8Array} bytes one TTF, whole
 * @returns {Set<number>} the covered code points; EMPTY only for a font with no
 *   Unicode cmap at all, which is a font this product cannot use.
 * @throws {Error} when the bytes are not a readable sfnt -- a caller must never mistake
 *   a failed read for "this text is fine", nor for "every character is broken".
 */
export function readCoveredCodePoints(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error('fontCoverage: expected the face as a Uint8Array of TTF bytes');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const cmap = cmapTableOffset(view);
  if (cmap < 0 || cmap + 4 > view.byteLength) {
    throw new Error('fontCoverage: the face carries no readable cmap table');
  }
  const covered = new Set();
  const subtables = view.getUint16(cmap + 2);
  for (let i = 0; i < subtables; i += 1) {
    const record = cmap + 4 + i * 8;
    if (record + 8 > view.byteLength) break;
    const offset = cmap + view.getUint32(record + 4);
    if (offset + 2 > view.byteLength) continue;
    const format = view.getUint16(offset);
    if (format === 4) readFormat4(view, offset, covered);
    else if (format === 12) readFormat12(view, offset, covered);
  }
  return covered;
}

/**
 * The family's own covered set: the INTERSECTION across its faces, because @react-pdf
 * picks the face at render time and a character is only safe when every face has it.
 *
 * @param {string} family the registered family name
 * @param {ReadonlyArray<{ file: string, bytes: Uint8Array }>} faces
 * @returns {FamilyCoverage}
 */
export function familyCoverage(family, faces) {
  if (!Array.isArray(faces) || faces.length === 0) {
    throw new Error('fontCoverage: a family needs at least one face to be measured');
  }
  /** @type {Set<number>|null} */
  let covered = null;
  for (const face of faces) {
    const own = readCoveredCodePoints(face.bytes);
    if (covered === null) covered = own;
    else covered = new Set([...covered].filter((cp) => own.has(cp)));
  }
  return {
    family,
    faces: faces.map((face) => face.file),
    covered: covered === null ? new Set() : covered,
  };
}

/**
 * ON DEMAND: read one family's faces through an INJECTED reader and measure them.
 *
 * The reader is the only I/O in this module and it is never reached for: pass
 * `fetchFace` in a browser, a thin wrapper over node's fs under test. Nothing is cached
 * here -- a cache is state, state is a lifecycle, and the caller that decides WHEN to
 * load is the one that should decide how long to keep the answer.
 *
 * @param {string} family one of EMBEDDED_FACES' keys
 * @param {(file: string) => Promise<Uint8Array>} readFace
 * @returns {Promise<FamilyCoverage>}
 */
export async function loadFamilyCoverage(family, readFace) {
  const files = EMBEDDED_FACES[family];
  if (!files) throw new Error(`fontCoverage: no embedded family named ${family}`);
  if (typeof readFace !== 'function') {
    throw new Error('fontCoverage: loadFamilyCoverage needs a reader for the face bytes');
  }
  const faces = [];
  for (const file of files) {
    faces.push({ file, bytes: await readFace(file) });
  }
  return familyCoverage(family, faces);
}

/**
 * The browser's reader: the served face, fetched on demand. The ONE impure export, kept
 * separate so every other line of this module is a function of its arguments.
 * @param {string} file a face file name from EMBEDDED_FACES
 * @returns {Promise<Uint8Array>}
 */
export async function fetchFace(file) {
  const response = await fetch(`${FONT_URL_PREFIX}${file}`);
  if (!response.ok) throw new Error(`fontCoverage: could not read ${file}`);
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * THE ANSWER A FIELD ASKS: which characters of this text will not print.
 *
 * Pure, deterministic and total. The result is in the text's OWN order, one entry per
 * occurrence, never sorted and never deduplicated -- a caller that wants the distinct
 * characters can take them, and a caller that wants to point at the third one needs the
 * third one to still be there.
 *
 * ⛔ IT FAILS OPEN, AND DELIBERATELY. Handed no coverage -- the faces have not loaded
 * yet, or the read threw -- it reports NOTHING uncovered rather than everything. The
 * alternative slanders a DM's perfectly good text the moment a font request is slow,
 * which would teach every user to ignore the note. An unmeasured field is silent; a
 * measured one tells the truth.
 *
 * @param {string} text the DM's own text, returned to nobody and altered in no way
 * @param {FamilyCoverage|null|undefined} family
 * @returns {{ family: string|null, uncovered: UncoveredCharacter[] }}
 */
export function coverageOf(text, family) {
  const source = typeof text === 'string' ? text : '';
  const covered = family && family.covered instanceof Set ? family.covered : null;
  const name = family && typeof family.family === 'string' ? family.family : null;
  if (covered === null || covered.size === 0) return { family: name, uncovered: [] };

  /** @type {UncoveredCharacter[]} */
  const uncovered = [];
  let index = 0;
  // A string iterator yields whole code points, so an astral character arrives once
  // rather than as two lone surrogates neither of which any font claims.
  for (const char of source) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (!covered.has(codePoint)) uncovered.push({ char, codePoint, index });
    index += char.length;
  }
  return { family: name, uncovered };
}
