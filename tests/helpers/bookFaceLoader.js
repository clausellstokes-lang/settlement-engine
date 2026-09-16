/**
 * tests/helpers/bookFaceLoader.js — read an embedded book face from disk.
 *
 * The two jsPDF painters fetch `/fonts/Lora-*.ttf?v=2` from the origin. Node has no
 * origin to resolve a root-relative URL against, so every Node harness that paints
 * a real book passes this reader as `opts.loadFace`. It is the same shape the
 * react-pdf byte-render tests already use — renderedFontEmbedding.test.js and
 * exoticUnicodeRender.test.js re-register the faces from public/fonts because
 * "fontkit can't open the Vite `/fonts/…?v=2` URLs in Node".
 *
 * ⚠ THE SEAM IS NOT OPTIONAL AND ITS ABSENCE IS LOUD. registerBookFont throws when
 * the load fails rather than falling back to Helvetica, so a harness that forgets
 * this reader fails with a font error instead of quietly painting the mangled
 * pre-cure names that tests/data/namingDataCharset.test.js exists to count.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its
 * suites in every importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../public/fonts');

/**
 * @param {{ file: string }} face one entry of BOOK_FACES; `file` is both the jsPDF
 *   VFS key and the on-disk basename under public/fonts.
 * @returns {Uint8Array}
 */
export function loadBookFace(face) {
  return new Uint8Array(readFileSync(join(FONT_DIR, face.file)));
}

export default loadBookFace;
