/**
 * tests/helpers/jsPdfPaintedText.js — read the VISIBLE TEXT a jsPDF artifact painted.
 *
 * The jsPDF lane (generateCampaignPDF / generateWorldBook) is fire-and-download: the
 * painters call doc.save(), and jsPDF's save is an OWN instance property defined in
 * its constructor, so it cannot be stubbed from outside — the node build writes a real
 * file to cwd. The receipt is therefore the artifact itself: inflate its content
 * streams and read the drawn text.
 *
 * This is a CONTENT assertion surface, never a byte-identity one (generateWorldBook.js's
 * header states the doctrine: never compare painter bytes across the two engines). It
 * exists so the campaign-PDF pins that must prove what a page does or does not SAY
 * share one reader instead of forking a copy per test file.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its
 * suites in every importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

/**
 * The visible text a jsPDF document painted, from its inflated content streams.
 * Uncompressed streams are read verbatim, so the reader works whether or not the
 * painter passed `compress: true`.
 * @param {string} pdfPath path to a saved .pdf
 * @returns {string} the concatenated content streams (latin1)
 */
export function paintedText(pdfPath) {
  const raw = readFileSync(pdfPath).toString('latin1');
  let out = '';
  let idx = 0;
  while ((idx = raw.indexOf('stream', idx)) !== -1) {
    let start = idx + 'stream'.length;
    while (raw[start] === '\r' || raw[start] === '\n') start += 1;
    const end = raw.indexOf('endstream', start);
    if (end === -1) break;
    const chunk = Buffer.from(raw.slice(start, end), 'latin1');
    try { out += inflateSync(chunk).toString('latin1'); } catch { out += chunk.toString('latin1'); }
    idx = end + 'endstream'.length;
  }
  return out;
}

export default paintedText;
