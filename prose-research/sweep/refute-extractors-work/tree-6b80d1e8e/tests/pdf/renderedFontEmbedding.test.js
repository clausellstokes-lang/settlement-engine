/**
 * @vitest-environment node
 *
 * renderedFontEmbedding.test.js — THE RENDER-LEVEL ARM. Every text run in a real
 * rendered dossier is drawn with an EMBEDDED font.
 *
 * ⛔ WHY A SOURCE SCAN CANNOT DO THIS JOB, AND WHY THE ESTATE BELIEVED OTHERWISE
 * FOR SO LONG. Two source scans guard the PDF today — sectionGlyphTofu.test.js
 * and fontGlyphCoverage.test.js — and BOTH ARE CORRECT AND BOTH ARE CLEAN: 0
 * offenders across the 23 files of src/pdf/sections. That is evidence the guard
 * works and NO EVIDENCE AT ALL ABOUT THE PRODUCT, because:
 *   - they read 23 of the 49 .js/.jsx files under src/pdf/, and
 *   - a source scan can only see a LITERAL. It cannot see a string this codebase
 *     COMPOSES at render time, or one that arrives from generated data, or from
 *     user-authored custom content.
 * The single uncovered codepoint that actually shipped — for the entire life of
 * this defect — was composed at render time by src/pdf/lib/format.js's noLig(),
 * from a literal in a file neither scan reads. It survived a source scan, a font
 * re-cut, a deleted render test and a phantom-cure pass. This file is the arm
 * that can see it.
 *
 * ⛔ AND THE FAILURE MODE IS NOT A TOFU BOX — that misconception is why nobody
 * looked. @react-pdf 4.5.1 does NOT draw an uncovered codepoint as the font's
 * `.notdef` (the eight embedded faces all carry a real drawn box outline, so the
 * belief was reasonable). Before layout it runs a font-substitution pass and
 * re-routes the character to a NON-EMBEDDED base-14 `/Helvetica /Type1
 * /WinAnsiEncoding`, then encodes it by LOW-BYTE TRUNCATION. Measured:
 *   影 U+5F71 -> 0x71 -> "q"     街 U+8857 -> 0x57 -> "W"
 *   م  U+0645 -> 0x45 -> "E"     → U+2192 -> 0x92 -> "’"
 *   ⚠  U+26A0 -> 0xa0 -> nbsp, INVISIBLE
 * A box announces itself. A `q` inside a settlement's name does not — and the
 * substituted run's advance comes from metrics the real face does not share, so
 * it OVERPRINTS ITS NEIGHBOUR and damages a character that was covered. For a
 * product promising "this exact world is permanently yours", that is the promise
 * failing quietly on the paid surface.
 *
 * ⭐ ASSERT ON RUNS, NOT ON DECLARED FONT OBJECTS. A dossier can legitimately
 * DECLARE `/Helvetica` in a page's resource dictionary while never drawing a
 * single glyph with it (measured: metropolis and thorp both do, with zero show
 * operations referencing it). Counting declared /BaseFont entries would red on a
 * clean document. The question this file asks is the one that reaches a reader:
 * does any text-showing operator run under a non-embedded font.
 *
 * ⚠ A FONT IS EMBEDDED IFF ITS FontDescriptor CARRIES A FontFile — and the
 * FontDescriptor is a SEPARATE INDIRECT OBJECT. Testing the Font object itself
 * for /FontFile reports every real subset face as non-embedded (the first cut of
 * this instrument did exactly that, and "found" 2,998 violations in a clean
 * render). Resolve the reference.
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import zlib from 'node:zlib';
import fs from 'node:fs';
import React from 'react';
import { beforeAll, describe, test, expect } from 'vitest';
import * as fontkit from 'fontkit';
import { Font, renderToBuffer } from '@react-pdf/renderer';

// Register the on-disk TTFs BEFORE the PDF module (which imports theme.js and its
// Vite-URL font registration) loads — first-registered source wins, and fontkit
// can't open the `/fonts/…?v=2` URLs in Node. (Same shim as fullDocByteRender.)
const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../public/fonts');
Font.register({
  family: 'Lora',
  fonts: [
    { src: join(FONT_DIR, 'Lora-Regular.ttf'), fontWeight: 400 },
    { src: join(FONT_DIR, 'Lora-Bold.ttf'), fontWeight: 700 },
    { src: join(FONT_DIR, 'Lora-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: join(FONT_DIR, 'Lora-BoldItalic.ttf'), fontWeight: 700, fontStyle: 'italic' },
  ],
});
Font.register({
  family: 'Nunito',
  fonts: [
    { src: join(FONT_DIR, 'Nunito-Regular.ttf'), fontWeight: 400 },
    { src: join(FONT_DIR, 'Nunito-Bold.ttf'), fontWeight: 700 },
    { src: join(FONT_DIR, 'Nunito-ExtraBold.ttf'), fontWeight: 800 },
    { src: join(FONT_DIR, 'Nunito-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
  ],
});

// ── The embedded covered set (intersection across every face) ────────────────
// Copied from fontGlyphCoverage.test.js:50-60 — a glyph is only safe if EVERY
// weight/style can draw it, since @react-pdf picks the face at render time.
const create = fontkit.create || fontkit.default?.create;
function buildCoveredCodepoints() {
  const ttfs = fs.readdirSync(FONT_DIR).filter((f) => f.toLowerCase().endsWith('.ttf'));
  let covered = null;
  for (const file of ttfs) {
    const set = new Set(create(fs.readFileSync(join(FONT_DIR, file))).characterSet);
    covered = covered === null ? set : new Set([...covered].filter((cp) => set.has(cp)));
  }
  return covered;
}

// ── PDF structure ────────────────────────────────────────────────────────────
function indexObjects(latin1) {
  const raw = {};
  const objRe = /(\d+)\s+0\s+obj([\s\S]*?)endobj/g;
  let m;
  while ((m = objRe.exec(latin1))) raw[m[1]] = m[2];
  return raw;
}

/** Embedded iff a FontFile is reachable through FontDescriptor/DescendantFonts. */
function descriptorEmbedded(raw, body, depth = 0) {
  if (depth > 3) return false;
  if (/\/FontFile\d?\s/.test(body)) return true;
  for (const r of body.matchAll(/\/(?:FontDescriptor|DescendantFonts)\s*\[?\s*(\d+)\s+0\s+R/g)) {
    if (raw[r[1]] && descriptorEmbedded(raw, raw[r[1]], depth + 1)) return true;
  }
  return false;
}

function inflateStreams(latin1) {
  const out = [];
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(latin1))) {
    const start = m.index + m[0].length;
    const end = latin1.indexOf('endstream', start);
    if (end < 0) continue;
    try { out.push(zlib.inflateSync(Buffer.from(latin1.slice(start, end), 'latin1')).toString('latin1')); }
    catch { /* not a Flate stream (font file, image) */ }
  }
  return out;
}

/**
 * Every text-showing operation in the document, tagged with the font it runs
 * under. Tracks the `/Fx <size> Tf` selector through each content stream.
 */
function textRuns(buf) {
  const latin1 = buf.toString('latin1');
  const raw = indexObjects(latin1);
  const fonts = {};
  for (const [num, body] of Object.entries(raw)) {
    const bf = /\/BaseFont\s*\/([A-Za-z0-9+\-,._]+)/.exec(body);
    if (bf) fonts[num] = { base: bf[1], embedded: descriptorEmbedded(raw, body) };
  }
  const alias = {};
  for (const res of latin1.matchAll(/\/Font\s*<<([^>]*)>>/g)) {
    for (const pair of res[1].matchAll(/\/(F\d+)\s+(\d+)\s+0\s+R/g)) {
      if (fonts[pair[2]]) alias[pair[1]] = fonts[pair[2]];
    }
  }
  const runs = [];
  const tok = /\/(F\d+)\s+[\d.]+\s+Tf|\(((?:\\.|[^()\\])*)\)\s*Tj|\[((?:\\.|[^\]\\])*)\]\s*TJ/g;
  for (const stream of inflateStreams(latin1)) {
    let cur = null;
    let t;
    while ((t = tok.exec(stream))) {
      if (t[1]) { cur = alias[t[1]] ?? { base: `UNMAPPED:${t[1]}`, embedded: false }; continue; }
      runs.push({ font: cur, payload: t[2] !== undefined ? t[2] : t[3] });
    }
    tok.lastIndex = 0;
  }
  return { runs, declaredFonts: Object.values(alias).map((f) => f.base) };
}

// Element-tree text leaves. Copied from traditionsSection.test.jsx:16-25.
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') {
      try { return collectText(node.type(node.props), out); } catch { return out; }
    }
    return collectText(node.props?.children, out);
  }
  return out;
}

const toHex = (cp) => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');

// One world, not three: a full byte render costs ~2-6s and this arm joins the
// build gate. The metropolis is the richest tier (40 pages, every chapter lit),
// so it exercises the most render-time composition per second spent.
const WORLD = { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' };

describe('a rendered dossier draws every text run with an embedded font', () => {
  let buf;
  let tree;

  test('renders a real multi-page dossier (the arm is not vacuous)', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { normalizeSettlement } = await import('../../src/domain/normalizeSettlement.js');
    const { SettlementPDF } = await import('../../src/pdf/SettlementPDF.jsx');
    const settlement = normalizeSettlement(
      generateSettlementPipeline(WORLD, null, { seed: 'glyph-a', customContent: {} }),
    );
    tree = collectText(React.createElement(SettlementPDF, { settlement })).join('');
    buf = await renderToBuffer(React.createElement(SettlementPDF, { settlement }));
    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
    // Non-vacuity, both halves: real pages AND real text runs to inspect. An
    // instrument that inspects nothing passes everything.
    expect((buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length).toBeGreaterThan(10);
    expect(textRuns(buf).runs.length).toBeGreaterThan(500);
  }, 120000);

  test('NO text run is drawn with a non-embedded font', () => {
    const { runs } = textRuns(buf);
    const bad = runs.filter((r) => !r.font?.embedded);
    const summary = [...new Set(bad.map((r) => r.font?.base))].join(', ');
    // ⛔ If this reds, the product is shipping substituted characters. Do not
    // ratchet it to the observed count — find the codepoint and remove it. The
    // failing payload bytes below are the truncated low bytes; decode them
    // against WinAnsi to see the letter a customer actually printed.
    expect(
      bad.length,
      `${bad.length} text run(s) drawn with NON-EMBEDDED font(s): ${summary}. ` +
      `First payloads: ${bad.slice(0, 5).map((r) => JSON.stringify(r.payload.slice(0, 40))).join(' ')}`,
    ).toBe(0);
  });

  test('every codepoint in the rendered element tree is ASCII or embedded-covered', () => {
    const covered = buildCoveredCodepoints();
    expect(covered.size).toBeGreaterThan(500); // the intersection is real
    const offenders = new Map();
    for (const ch of tree) {
      const cp = ch.codePointAt(0);
      if (cp < 128 || covered.has(cp)) continue;
      offenders.set(cp, (offenders.get(cp) ?? 0) + 1);
    }
    // This is the arm that sees a codepoint arriving from DATA — a generated
    // name, an engine vocabulary, or user-authored custom content — which no
    // source scan can reach. It runs on the element tree rather than the bytes
    // because by the time a glyph is encoded, the substitution has already
    // discarded the original codepoint.
    expect(
      [...offenders.entries()].map(([cp, n]) => `${toHex(cp)} ×${n}`),
      'uncovered codepoint(s) reached the rendered dossier',
    ).toEqual([]);
  });
});

/**
 * ── THE jsPDF ARM ────────────────────────────────────────────────────────────
 *
 * ⭐ THE NEGATIVE CONTROL THIS TREE DID NOT HAVE. exoticUnicodeRender.test.js
 * recorded the gap in prose — "there is NO campaignPdfSanitize.test.js — no test
 * asserts that fold" — so nothing would have gone red when the two jsPDF books
 * changed what they print. This block is that arm, and it was written and run
 * RED before the cure existed: against the pre-cure tree it failed twice over,
 * once because the painter drew with a non-embedded standard-14 Helvetica and
 * once because the text pass had already replaced every diacritic with a space.
 *
 * ⚠ THE PROBE NAMES ARE SHIPPED POOL ENTRIES, NOT HAND-TYPED EXOTICA. Each is a
 * real member of src/data/namingData.js (Babić = slavic.surnames[60], Đorđević =
 * [62], Kovačević = [68], Čupić = [82], Uroš = slavic.maleNames[86], Snežana =
 * slavic.femaleNames[85], Khān = arabic.settlementPrefixes[26]), which is what
 * makes this a product defect rather than a synthetic one — the register in
 * tests/data/namingDataCharset.test.js counts 41 instances of exactly these.
 *
 * ⛔ AND THE FAILURE MODE UNDER Identity-H IS NOT A TOFU BOX EITHER — it is worse
 * than the react-pdf substitution above, because it is SILENT IN TWO DIFFERENT
 * WAYS. jsPDF's utf8TextFunction pre-filters each character against the loaded
 * face's cmap (jspdf.es.js:22047-22067):
 *   - a codepoint >= U+0100 with no glyph is DROPPED from the run, leaving no
 *     mark at all — "BEFORE影AFTER" paints as "BEFOREAFTER";
 *   - a codepoint < U+0100 with no glyph is KEPT and handed to pdfEscape16,
 *     where `characterToGlyph` returns 0 and the `t == "0"` guard at
 *     jspdf.es.js:21855 RETURNS EARLY — TRUNCATING THE REST OF THE RUN.
 *     "SOFT­HYPHEN" paints as "SOFT". Measured, both directions.
 * For the Lora-3 roster there are exactly 65 such sub-U+0100 truncators (C0, DEL,
 * C1, and U+00AD), and the text pass removes all 65 — which is why the pass and
 * the embed are one act and not two.
 */
const BOOK_PROBES = ['Babić', 'Đorđević', 'Kovačević', 'Uroš', 'Snežana', 'Čupić', 'Khān', 'Hadžić'];

/** jsPDF's Identity-H show operators are HEX strings, not literal `(...)` runs. */
function jsPdfShowRuns(latin1) {
  const raw = indexObjects(latin1);
  const fonts = {};
  for (const [num, body] of Object.entries(raw)) {
    const bf = /\/BaseFont\s*\/([A-Za-z0-9+\-,._]+)/.exec(body);
    if (bf) fonts[num] = { base: bf[1], embedded: descriptorEmbedded(raw, body) };
  }
  const alias = {};
  for (const res of latin1.matchAll(/\/Font\s*<<([\s\S]*?)>>/g)) {
    for (const pair of res[1].matchAll(/\/([A-Za-z0-9]+)\s+(\d+)\s+0\s+R/g)) {
      if (fonts[pair[2]]) alias[pair[1]] = fonts[pair[2]];
    }
  }
  const runs = [];
  const tok = /\/([A-Za-z0-9]+)\s+[\d.]+\s+Tf|<([0-9a-fA-F]*)>\s*Tj|\(((?:\\.|[^()\\])*)\)\s*Tj/g;
  for (const stream of inflateStreams(latin1)) {
    let cur = null;
    let t;
    while ((t = tok.exec(stream))) {
      if (t[1] !== undefined) { cur = alias[t[1]] ?? { base: `UNMAPPED:${t[1]}`, embedded: false }; continue; }
      const payload = t[2] !== undefined ? t[2] : t[3];
      if (payload === '') continue;
      runs.push({ font: cur, hex: t[2] !== undefined, payload });
    }
    tok.lastIndex = 0;
  }
  return runs;
}

describe('a rendered campaign book draws every text run with an embedded font', () => {
  const FILE = 'campaign-embedded-face.pdf';
  let latin1;
  let painted;

  beforeAll(async () => {
    const { generateCampaignPDF } = await import('../../src/utils/generateCampaignPDF.js');
    const { paintedText } = await import('../helpers/jsPdfPaintedText.js');
    const { loadBookFace } = await import('../helpers/bookFaceLoader.js');
    const saves = BOOK_PROBES.map((name, index) => ({
      id: `probe-${index}`,
      name,
      settlement: { name, tier: 'town', population: 1200 + index, npcs: [], neighbourNetwork: [] },
    }));
    try {
      // `await` is correct whether or not the painter is async: awaiting a
      // non-promise is a no-op, and a forgotten await here would read the file
      // before it exists rather than passing silently.
      await generateCampaignPDF(
        { id: 'embed-1', name: 'Embedded Face', settlementIds: saves.map((s) => s.id) },
        saves,
        { now: 'Cyfrin 1, 2026', loadFace: loadBookFace },
      );
      latin1 = fs.readFileSync(FILE).toString('latin1');
      painted = paintedText(FILE);
    } finally {
      fs.rmSync(FILE, { force: true });
    }
  }, 60000);

  test('paints a real multi-page book with real show operators (the arm is not vacuous)', () => {
    expect(latin1.slice(0, 5)).toBe('%PDF-');
    expect((latin1.match(/\/Type\s*\/Page[^s]/g) || []).length).toBeGreaterThan(2);
    const runs = jsPdfShowRuns(latin1);
    expect(runs.length).toBeGreaterThan(100);
    // Both halves: the runs exist AND they are the 2-byte glyph-id form, which is
    // what proves the document went through Identity-H rather than WinAnsi.
    expect(runs.filter((r) => r.hex).length).toBeGreaterThan(100);
  });

  test('NO text run is drawn with a non-embedded font', () => {
    const bad = jsPdfShowRuns(latin1).filter((r) => !r.font?.embedded);
    const summary = [...new Set(bad.map((r) => r.font?.base))].join(', ');
    // ⛔ Do not ratchet this to the observed count. jsPDF declares all fourteen
    // standard faces in every page's resource dictionary whether or not they are
    // used, so a DECLARATION is not a defect — a RUN is.
    expect(
      bad.length,
      `${bad.length} run(s) drawn with NON-EMBEDDED font(s): ${summary}. `
      + `First payloads: ${bad.slice(0, 5).map((r) => JSON.stringify(r.payload.slice(0, 40))).join(' ')}`,
    ).toBe(0);
  });

  test('every shipped pool name ROUND-TRIPS through the ToUnicode CMap onto the page', () => {
    // ⭐ THE ARM THAT MEASURES THE READER RATHER THAN THE SANITISER. Asking
    // sanitizeJsPdfText what it returned proves the sanitiser; only decoding the
    // painted glyph ids back through the document's own ToUnicode CMap proves
    // that the letter a customer prints is the letter the pool holds.
    const missing = BOOK_PROBES.filter((name) => !painted.includes(name));
    expect(missing, `the book did not paint ${missing.join(' ')}`).toEqual([]);
  });

  test('the decoded reader still CONVICTS — a name nobody painted is absent', () => {
    // Non-vacuity for the arm above: a decoder that returned every string would
    // pass it forever. Anchored on a probe asserted present in the same document.
    expect(painted).toContain('Đorđević');
    expect(painted).not.toContain('Ravenspire Was Never Bound'); // anchored: 'Đorđević' asserted present on the line above, so this document demonstrably decoded
  });

  test('the mangling the register counts is GONE: no probe paints as its stripped form', () => {
    // The pre-cure spellings, from the shipped pass: Babić -> "Babi",
    // Đorđević -> "or evi", Kovačević -> "Kova evi", Čupić -> "upi",
    // Khān -> "Kh n", Hadžić -> "Had i". Each is what the paid page used to say.
    for (const stripped of ['Kova evi', 'Had i', 'Kh n', 'or evi']) {
      expect(painted, `the book still paints the stripped form ${JSON.stringify(stripped)}`)
        .not.toContain(stripped); // anchored: every BOOK_PROBES name is asserted present two tests above, so the book demonstrably painted these rows
    }
  });
});
