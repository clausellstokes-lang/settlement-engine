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
 * ⛔⛔ WHY THIS READER DECODES, AND WHY LOOSENING ITS CALLERS WOULD HAVE BEEN THE
 * WRONG CURE. Until the two books embedded a font they painted with standard-14
 * Helvetica, whose show operators are literal `(Grimhold besieges Ashford.) Tj` runs
 * — so reading the inflated streams as latin1 was enough. Under Identity-H the
 * operand is a HEX STRING OF 2-BYTE GLYPH IDS: `<001F00420049…> Tj`. Measured on a
 * real embedded artifact, the same document yields 416 bytes of hex Tj operands and
 * ZERO bytes of plain ones, and a raw latin1 read finds NEITHER "Grimhold besieges
 * Ashford." NOR "Babić".
 *
 * That blinds ELEVEN assertions across exportDateSeam.test.js and
 * realmExportFaithSeam.test.js — six of them load-bearing paid-surface pins, four of
 * them anchored negatives whose anchor would vanish with them. They red CORRECTLY,
 * and the tempting repair is to relax each `toContain` until it passes, at which
 * point two content-seam suites assert nothing and nobody knows. So the reader gained
 * the decode instead, in the same act as the embed, and every caller kept its
 * assertion verbatim.
 *
 * ⭐ HOW IT DECODES, AND WHY PER-FONT. Each embedded face carries its own
 * `/ToUnicode` CMap (jsPDF builds it glyph-by-glyph as it paints — jspdf.es.js:21847)
 * mapping ITS OWN glyph ids back to codepoints. The three Lora faces have different
 * glyph orders (844 / 845 / 838 glyphs), so a single merged map would decode the
 * wrong letters. The reader therefore tracks the `/Fn <size> Tf` selector through
 * each content stream and decodes each run with that font's own map, exactly as
 * renderedFontEmbedding.test.js tracks it to attribute runs to fonts.
 *
 * ⚠ NON-VACUITY IS PROVED BY A CONTROL, NOT ASSERTED. A decoder that returned every
 * string would make every caller vacuous, so the property is pinned in
 * renderedFontEmbedding.test.js: the same reader over the same document must NOT
 * find a string nobody painted, and the pre-embed helvetica control fails 12 of 13
 * probes that the embedded artifact passes.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its
 * suites in every importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

/** Inflate the stream that starts at `start`; uncompressed streams are read verbatim. */
function readStreamAt(raw, start) {
  const end = raw.indexOf('endstream', start);
  if (end === -1) return null;
  const chunk = Buffer.from(raw.slice(start, end), 'latin1');
  let text;
  try { text = inflateSync(chunk).toString('latin1'); } catch { text = chunk.toString('latin1'); }
  return { text, end };
}

/** The first inflatable stream belonging to indirect object `objNum`. */
function streamOfObject(raw, objNum) {
  const re = new RegExp(`(?:^|[^0-9])${objNum} 0 obj`, 'g');
  let match;
  while ((match = re.exec(raw))) {
    const streamAt = raw.indexOf('stream', match.index);
    const objEnd = raw.indexOf('endobj', match.index);
    if (streamAt === -1 || (objEnd !== -1 && streamAt > objEnd)) continue;
    let start = streamAt + 'stream'.length;
    while (raw[start] === '\r' || raw[start] === '\n') start += 1;
    const got = readStreamAt(raw, start);
    if (got) return got.text;
  }
  return null;
}

/** `/Fn` → that font's glyph-id → text map, for every font declaring a /ToUnicode. */
function toUnicodeByAlias(raw) {
  const byObject = {};
  for (const obj of raw.matchAll(/(\d+) 0 obj\s*(<<[\s\S]*?)endobj/g)) {
    const ref = /\/ToUnicode\s+(\d+)\s+0\s+R/.exec(obj[2]);
    if (!ref) continue;
    const cmap = streamOfObject(raw, ref[1]);
    if (!cmap) continue;
    const map = new Map();
    // `<glyph><utf16be>` pairs from the bfchar blocks jsPDF emits (jspdf.es.js:21873).
    for (const pair of cmap.matchAll(/<([0-9a-fA-F]{4})>\s*<([0-9a-fA-F]{4,})>/g)) {
      const units = pair[2].match(/.{4}/g) || [];
      map.set(Number.parseInt(pair[1], 16), String.fromCharCode(...units.map((u) => Number.parseInt(u, 16))));
    }
    byObject[obj[1]] = map;
  }
  const alias = {};
  for (const res of raw.matchAll(/\/Font\s*<<([\s\S]*?)>>/g)) {
    for (const pair of res[1].matchAll(/\/([A-Za-z0-9]+)\s+(\d+)\s+0\s+R/g)) {
      if (byObject[pair[2]]) alias[pair[1]] = byObject[pair[2]];
    }
  }
  return alias;
}

/**
 * Rewrite every hex show-operand in one content stream into the text it draws,
 * tracking the active font so each run decodes through its OWN CMap. A run under a
 * font with no /ToUnicode (a standard-14 face, whose operands are literal text
 * already) is left exactly as it was, so a mixed document reads correctly.
 */
function decodeRuns(stream, alias) {
  let current = null;
  return stream.replace(/\/([A-Za-z0-9]+)\s+[\d.]+\s+Tf|<([0-9a-fA-F]+)>/g, (whole, selector, hex) => {
    if (selector !== undefined) { current = alias[selector] ?? null; return whole; }
    if (!current) return whole;
    return `(${(hex.match(/.{4}/g) || []).map((id) => current.get(Number.parseInt(id, 16)) ?? '').join('')})`;
  });
}

/**
 * The visible text a jsPDF document painted, from its inflated content streams.
 * Uncompressed streams are read verbatim, so the reader works whether or not the
 * painter passed `compress: true`; Identity-H glyph runs are decoded back through
 * the document's own /ToUnicode CMaps, so the caller reads letters rather than
 * glyph ids.
 * @param {string} pdfPath path to a saved .pdf
 * @returns {string} the concatenated content streams, with glyph runs decoded
 */
export function paintedText(pdfPath) {
  const raw = readFileSync(pdfPath).toString('latin1');
  const alias = toUnicodeByAlias(raw);
  let out = '';
  let idx = 0;
  while ((idx = raw.indexOf('stream', idx)) !== -1) {
    let start = idx + 'stream'.length;
    while (raw[start] === '\r' || raw[start] === '\n') start += 1;
    const got = readStreamAt(raw, start);
    if (!got) break;
    out += decodeRuns(got.text, alias);
    idx = got.end + 'endstream'.length;
  }
  return out;
}

export default paintedText;
