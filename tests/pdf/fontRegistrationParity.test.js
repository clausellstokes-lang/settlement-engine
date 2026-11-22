import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';
import { jsPDF } from 'jspdf';

import { NAMING_DATA } from '../../src/data/namingData.js';

import { BOOK_DRAWABLE_RANGES, BOOK_FACES, BOOK_FAMILY, bookDrawableCodepoints } from '../../src/utils/jsPdfBookFont.js';

/**
 * Font-registration parity (audit finding: the byte-render tests re-register fonts
 * from on-disk paths because fontkit can't open the Vite `/fonts/…?v=2` URLs, so they
 * don't exercise the production font-resolution path — and could silently drift).
 *
 * The two paths necessarily differ in HOW they name the font (Vite URL vs on-disk
 * path), so full unification isn't possible. What CAN drift is the SET of fonts: if
 * theme.js registers a family/weight the byte-render harness doesn't (or renames a
 * file), the byte-render tests would validate a document rendered with a different or
 * missing font than production, with a green suite. This pins that the font FILES are
 * identical across production, both byte-render harnesses, and the on-disk assets.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// Production registers `/fonts/Name.ttf?v=N`; the byte-render harnesses register
// `join(FONT_DIR, 'Name.ttf')`. Both reduce to the bare `Name.ttf` file set.
const fontFilesIn = (src) =>
  new Set([...src.matchAll(/([A-Za-z0-9-]+\.ttf)/g)].map((m) => m[1]));

describe('PDF font registration is in lockstep across prod / test / disk', () => {
  const prod = fontFilesIn(read('src/pdf/theme.js'));
  const harnesses = {
    'fullDocByteRender': fontFilesIn(read('tests/pdf/fullDocByteRender.test.js')),
    'notableNpcsByteRender': fontFilesIn(read('tests/pdf/notableNpcsByteRender.test.js')),
  };

  test('production theme.js actually registers fonts (not vacuous)', () => {
    expect(prod.size).toBeGreaterThanOrEqual(4);
  });

  test.each(Object.entries(harnesses))('%s registers exactly the production font-file set', (name, set) => {
    expect([...set].sort(), `${name} font set drifted from theme.js`).toEqual([...prod].sort());
  });

  test('every registered font file exists in public/fonts/', () => {
    for (const file of prod) {
      expect(existsSync(join(root, 'public/fonts', file)), `missing font asset: public/fonts/${file}`).toBe(true);
    }
  });
});

/**
 * ── THE jsPDF ROSTER, AND THE GUARD THAT KEEPS ITS DECLARED SET HONEST ───────
 *
 * The two jsPDF books embed three of the eight faces theme.js registers, and
 * src/utils/jsPdfBookFont.js declares — as a literal — the 778 codepoints all
 * three can draw. That literal is the sanitiser's authority: sanitizeJsPdfText
 * keeps a character iff BOOK_DRAWABLE_RANGES admits it, and the charset compiler
 * then derives the paid books' bounded set from the FONT FILES. So if the literal
 * ever drifted from the .ttf bytes, the pass would admit a codepoint jsPDF cannot
 * draw — and under Identity-H that is not a tofu box: a codepoint below U+0100
 * with no glyph makes pdfEscape16 return early and TRUNCATE THE REST OF THE RUN.
 *
 * This block re-measures the literal against the actual files, through jsPDF's own
 * loaded cmap, and prints the replacement string in its own failure message so a
 * deliberate font swap is a copy-paste cure rather than a puzzle.
 */
describe('the embedded book roster is a subset of the dossier faces, and its declared set is measured', () => {
  const prodFiles = fontFilesIn(read('src/pdf/theme.js'));

  test('every book face is one of the faces theme.js already registers', () => {
    // The three PDF surfaces stay ONE product: the book roster may narrow the
    // dossier's, never introduce a face the dossier does not ship.
    expect(BOOK_FACES.length).toBe(3);
    for (const face of BOOK_FACES) {
      expect(prodFiles, `book face ${face.file} is not registered by theme.js`).toContain(face.file);
      expect(existsSync(join(root, 'public/fonts', face.file))).toBe(true);
    }
    // No bold-italic: neither painter ever selects it (grep-verified at build).
    expect(BOOK_FACES.map((f) => f.style).sort()).toEqual(['bold', 'italic', 'normal']);
  });

  test('the roster registers on a real jsPDF document under Identity-H', () => {
    const doc = new jsPDF();
    for (const face of BOOK_FACES) {
      doc.addFileToVFS(face.file, readFileSync(join(root, 'public/fonts', face.file)).toString('base64'));
      doc.addFont(face.file, BOOK_FAMILY, face.style);
    }
    for (const face of BOOK_FACES) {
      doc.setFont(BOOK_FAMILY, face.style);
      // jsPDF defaults addFont's encoding to Identity-H (jspdf.es.js:4997); that
      // default is what makes the 778-codepoint reach possible at all, so it is
      // pinned rather than assumed.
      expect(doc.getFont(BOOK_FAMILY, face.style).encoding).toBe('Identity-H');
    }
  });

  test('BOOK_DRAWABLE_RANGES equals what the three files can actually draw', () => {
    const doc = new jsPDF();
    let live = null;
    for (const face of BOOK_FACES) {
      doc.addFileToVFS(face.file, readFileSync(join(root, 'public/fonts', face.file)).toString('base64'));
      doc.addFont(face.file, BOOK_FAMILY, face.style);
      doc.setFont(BOOK_FAMILY, face.style);
      const { metadata } = doc.getFont(BOOK_FAMILY, face.style);
      // glyph id 0 is .notdef — in the cmap, not drawable. fontkit reports the
      // format-4 sentinel U+FFFF as covered and would read 779 here.
      const set = new Set(Object.keys(metadata.cmap.unicode.codeMap)
        .map(Number).filter((cp) => metadata.characterToGlyph(cp) !== 0));
      live = live === null ? set : new Set([...live].filter((cp) => set.has(cp)));
    }
    // Non-vacuity: a reader that returned nothing would make the equality trivial.
    expect(live.size).toBeGreaterThan(700);
    const hex = (cp) => cp.toString(16).toUpperCase();
    const sorted = [...live].sort((a, b) => a - b);
    const out = [];
    let start = null;
    let prev = null;
    for (const cp of sorted) {
      if (start === null) { start = cp; prev = cp; continue; }
      if (cp === prev + 1) { prev = cp; continue; }
      out.push(start === prev ? hex(start) : `${hex(start)}-${hex(prev)}`);
      start = cp; prev = cp;
    }
    if (start !== null) out.push(start === prev ? hex(start) : `${hex(start)}-${hex(prev)}`);
    expect(
      BOOK_DRAWABLE_RANGES,
      'the declared roster set drifted from the .ttf files. Replace BOOK_DRAWABLE_RANGES '
      + `in src/utils/jsPdfBookFont.js with:\n${out.join(' ')}`,
    ).toBe(out.join(' '));
    expect(bookDrawableCodepoints()).toEqual(live);
  });

  test('the roster can draw every codepoint the shipped name pools use', () => {
    // The register in tests/data/namingDataCharset.test.js counts this from the
    // generated table; this arm asks the FILES directly, so the two cannot agree
    // on a wrong answer. It is the arm that reds if a pool gains a name the
    // embedded roster cannot print.
    const drawable = bookDrawableCodepoints();
    const offenders = new Map();
    const walk = (node) => {
      if (typeof node === 'string') {
        for (const ch of node) {
          const cp = ch.codePointAt(0);
          if (!drawable.has(cp) && !'\t\n\r'.includes(ch)) offenders.set(cp, node);
        }
        return;
      }
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (node && typeof node === 'object') for (const value of Object.values(node)) walk(value);
    };
    walk(NAMING_DATA);
    expect(
      [...offenders.entries()].map(([cp, ex]) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')} in ${ex}`),
      'a shipped pool name carries a codepoint the embedded book roster cannot draw',
    ).toEqual([]);
  });
});
