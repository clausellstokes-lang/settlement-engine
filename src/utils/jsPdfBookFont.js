/**
 * jsPdfBookFont.js — THE EMBEDDED FACE the two jsPDF books draw with.
 *
 * The campaign book and the World Book used to paint with jsPDF's standard-14
 * Helvetica, which is bounded by an encoder table rather than by a font. That is
 * why `tests/data/namingDataCharset.test.js` could count 41 shipped pool names the
 * two paid books could not print — `Đorđević` reached the page as "or evi" — while
 * the dossier, which embeds eight faces, printed all of them correctly.
 *
 * ⭐ WHY LORA, AND WHY THREE FACES. Lora is the serif the dossier already renders
 * (`src/pdf/theme.js` sets `fontFamily: 'Lora'` on body, section and cover type), so
 * the three PDF surfaces become one product rather than a book that looks like the
 * web app. Three, not four: neither painter ever calls bold-italic.
 *
 * ⭐ IT COSTS NOTHING AT FIRST PAINT. These exact .ttf files already ship in
 * public/fonts and are already served; `index.html` preloads only woff2, and
 * `src/index.css` references only woff2, so nothing here adds an asset, a preload,
 * a stylesheet byte or an eager edge. The bytes are fetched on the export path,
 * strictly downstream of the dynamic import in CampaignFolder.jsx that
 * tests/build/vendorPdfLazy.test.js already enforces.
 *
 * ⚠ THE ROSTER MAY NOT LIVE UNDER src/pdf/. tests/lint/writerReach.walker.test.js
 * asserts `toEqual([])` over every src/pdf/ file in the campaign-pdf and world-book
 * closures — "a jsPDF surface must not pull in the @react-pdf tree". src/utils/ is
 * the correct home, and this module deliberately imports nothing.
 *
 * ⛔ BOOK_DRAWABLE_RANGES IS NOT A TASTE LIST — it is a MEASUREMENT of these three
 * files, and `tests/pdf/fontRegistrationParity.test.js` re-measures it by loading
 * the .ttf bytes through jsPDF's own cmap reader and refusing any drift. Every
 * codepoint here has a real glyph in ALL THREE faces (glyph id != 0 in each), which
 * is the only property that matters: jsPDF picks the face at paint time.
 *
 * ⛔ AND WHY A MISSING GLYPH IS NOT A HARMLESS BOX. Under Identity-H, jsPDF's
 * `utf8TextFunction` (jspdf.es.js:22047-22067) drops any codepoint >= U+0100 that
 * the face cannot draw — silently, leaving no mark — and KEEPS one below U+0100,
 * where `pdfEscape16`'s `t == "0"` guard (jspdf.es.js:21855) then RETURNS EARLY and
 * TRUNCATES THE REST OF THE TEXT RUN. For this roster there are exactly 65 such
 * sub-U+0100 truncators (C0, DEL, C1 and U+00AD SOFT HYPHEN). sanitizeJsPdfText
 * removes all 65 by admitting only what is declared here, which is why the pass and
 * this module are one act: an embedded face behind a pass that still erased above
 * U+00FF would cure nothing, and a widened pass in front of no face would truncate.
 */

/** The jsPDF font family name both painters select. */
export const BOOK_FAMILY = 'BookFace';

/**
 * The roster, in the order jsPDF registers it. `url` is the Vite public path the
 * product fetches; `file` is the VFS key AND the on-disk basename under
 * public/fonts, so a Node harness can resolve one from the other.
 */
export const BOOK_FACES = Object.freeze([
  Object.freeze({ file: 'Lora-Regular.ttf', url: '/fonts/Lora-Regular.ttf?v=2', style: 'normal' }),
  Object.freeze({ file: 'Lora-Bold.ttf', url: '/fonts/Lora-Bold.ttf?v=2', style: 'bold' }),
  Object.freeze({ file: 'Lora-Italic.ttf', url: '/fonts/Lora-Italic.ttf?v=2', style: 'italic' }),
]);

/**
 * Every codepoint ALL THREE faces can actually draw, as hex ranges — 778 of them,
 * measured through jsPDF's own loaded cmap rather than through fontkit, because
 * fontkit reports the format-4 sentinel U+FFFF as covered and jsPDF maps it to
 * glyph 0. Regenerate by failing fontRegistrationParity.test.js; it prints the
 * replacement string in its own message.
 */
export const BOOK_DRAWABLE_RANGES = 'D 20-7E A0-AC AE-137 139-17F 18F 192 1A0-1A1 1AF-1B0 1B7 1CD-1CE 1D3-1D4 1E4-1E9 1EE-1EF 1FE-1FF 218-21B 21E-21F 237 259 292 2BB-2BC 2C6-2C7 2C9 2D8-2DD 300-304 306-30C 312 31B 323 326-328 335-336 393-394 3A0 3A9 3BC 3C0 400-45F 462-463 46A-46D 472-475 48A-4FF 510-513 51A-51D 524-529 52E-52F 1C81 1C85 1E80-1E85 1E9E 1EA0-1EF9 2010 2013-2014 2018-201A 201C-201E 2020-2022 2026 2030 2032-2033 2039-203A 2044 2052 2074 20AC 20AE 20B4 20B8 20BA 20BD 2113 2116 2122 2126 212A-212B 212E 2202 2206 220F 2211-2212 2215 2219-221A 221E 222B 2248 2260 2264-2265 25CA 27E8-27E9 EFFD FB01-FB02';

let drawableSet = null;

/** The decoded set, built once. Deliberately not shared with the charset domain: this module imports nothing, so the painters' closure stays free of the content tree. */
function drawable() {
  if (drawableSet) return drawableSet;
  const set = new Set();
  for (const token of BOOK_DRAWABLE_RANGES.split(' ')) {
    const dash = token.indexOf('-');
    const lo = Number.parseInt(dash === -1 ? token : token.slice(0, dash), 16);
    const hi = dash === -1 ? lo : Number.parseInt(token.slice(dash + 1), 16);
    for (let cp = lo; cp <= hi; cp += 1) set.add(cp);
  }
  drawableSet = set;
  return set;
}

/**
 * Can the embedded roster draw this codepoint?
 * @param {number} codePoint
 * @returns {boolean}
 */
export function bookDrawable(codePoint) {
  return drawable().has(codePoint);
}

/** The roster's drawable set, as a Set of codepoints (for instruments). @returns {Set<number>} */
export function bookDrawableCodepoints() {
  return new Set(drawable());
}

/**
 * Fetch one face's bytes from the public path. THE ONLY environment-bound step in
 * this module, and the reason `registerBookFont` takes it as a parameter: Node has
 * no origin to resolve `/fonts/…` against, so a harness passes its own reader (see
 * tests/helpers/bookFaceLoader.js) exactly as the react-pdf byte-render tests pass
 * on-disk paths to Font.register.
 * @param {{ url: string, file: string }} face
 * @returns {Promise<Uint8Array>}
 */
async function fetchFace(face) {
  const response = await fetch(face.url);
  if (!response.ok) throw new Error(`book face ${face.file} failed to load: HTTP ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

const B64_CHUNK = 0x8000;

/** Bytes to base64, chunked — a 129 KB face blows the argument limit in one spread. */
function toBase64(bytes) {
  if (typeof btoa === 'function') {
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += B64_CHUNK) {
      binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + B64_CHUNK));
    }
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}

/**
 * Register the roster on a jsPDF document, so `doc.setFont(BOOK_FAMILY, style)`
 * draws with an embedded face. jsPDF defaults `addFont`'s encoding to Identity-H
 * (jspdf.es.js:4997), and subsets to the glyphs the document actually paints on
 * emit (jspdf.es.js:21896) — so three 129 KB faces cost ~41 KB on the artifact,
 * not 393 KB.
 *
 * Throws rather than falling back to Helvetica: a silent fallback would print the
 * mangled names again with nothing to say so, and both product call sites
 * (CampaignFolder.jsx handleExportPdf / handleWorldBook) already surface a thrown
 * message to the user.
 *
 * @param {import('jspdf').jsPDF} doc
 * @param {(face: { url: string, file: string, style: string }) => Promise<Uint8Array>} [loadFace]
 * @returns {Promise<string>} the registered family name
 */
export async function registerBookFont(doc, loadFace = fetchFace) {
  const loaded = await Promise.all(BOOK_FACES.map((face) => loadFace(face)));
  BOOK_FACES.forEach((face, index) => {
    doc.addFileToVFS(face.file, toBase64(loaded[index]));
    doc.addFont(face.file, BOOK_FAMILY, face.style);
  });
  return BOOK_FAMILY;
}
