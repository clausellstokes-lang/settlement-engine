/**
 * @vitest-environment node
 *
 * Exotic-unicode render guard for the react-pdf export path.
 *
 * `safe()` (src/pdf/lib/format.js) is now IDENTITY and does NOT transliterate or
 * strip non-Latin scripts — the embedded faces simply have no glyph for CJK /
 * Arabic / emoji. ⛔ CORRECTED 2026-09-01: those code points do NOT render as
 * "tofu" (a missing-glyph box). react-pdf substitutes a NON-EMBEDDED Helvetica
 * and truncates to the low byte — 影 prints "q", 街 "W", م "E". The contract
 * pinned here is ONLY that they do not CRASH: layout/pagination still produce a
 * valid PDF. ⚠ NOT that they render right — renderedFontEmbedding.test.js convicts them.
 *
 * (The two jsPDF books, by contrast, EMBED Lora Regular/Bold/Italic and fold what
 * that roster cannot draw to a space in sanitizeJsPdfText — src/utils/jsPdfText.js,
 * NOT generateCampaignPDF.js:83-89, which this note cited for two revisions after
 * the pass was hoisted out of it. ⭐ CORRECTED AGAIN: the fold IS asserted now.
 * tests/pdf/renderedFontEmbedding.test.js emits a real campaign book and decodes
 * its painted glyph ids back through the document's own ToUnicode CMap, so CJK and
 * emoji are proved absent and the eight shipped diacritic names proved present.
 * That arm was written and run RED before the cure existed. This file is the
 * react-pdf side, whose faces still have no glyph for CJK / Arabic / emoji.)
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import React from 'react';
import { describe, test, expect } from 'vitest';
import { Document, Font, renderToBuffer } from '@react-pdf/renderer';

// Register the on-disk TTFs before theme.js loads (first-registered wins, and
// fontkit can't open the Vite `/fonts/…?v=2` URLs in Node). Same shim as the
// other byte-render tests.
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

// A grab-bag of scripts the Lora subset can't render, plus smart punctuation
// (which safe() leaves intact — Lora DOES carry curly quotes / en dashes).
const CJK    = '影の街 · 龍の書庫 · 静かな鐘';           // Japanese/Chinese
const ARABIC = 'مدينة الظلال والرمال';                    // Arabic (RTL)
const EMOJI  = 'The Gilded 🗡️ Coin 🏰 Guild 🔥';         // emoji + ZWJ sequences
const SMART  = '“The fortified keep” — its ledgers… don’t balance.'; // smart punct + ligature

describe('react-pdf path substitutes (does not crash) on exotic unicode', () => {
  test('CJK / Arabic / emoji / smart-punctuation NPCs render to a valid PDF', async () => {
    const { NotableNPCs } = await import('../../src/pdf/sections/NotableNPCs.jsx');

    // Hand-built vm (no generator needed): three NPCs whose every prose field is
    // full of unrenderable glyphs. Exercises FullCard (major), CompactCard
    // (notable), and OtherNameRow (other) tiers plus the secret/relationship paths.
    const npcs = [
      {
        id: 'npc.1', name: CJK, title: ARABIC, power: 9,
        blurb: `${EMOJI} ${SMART}`,
        personality: CJK, appearance: ARABIC, motivation: EMOJI,
        secrets: [`${ARABIC} ${SMART}`, CJK],
        relationships: [{ with: CJK, type: ARABIC, description: EMOJI }],
        factionLabel: ARABIC,
      },
      {
        id: 'npc.2', name: `${EMOJI}`, title: CJK, power: 5,
        motivation: ARABIC,
        plotHooks: [`${CJK} ${SMART}`],
        factionLabel: CJK,
      },
      { id: 'npc.3', name: ARABIC, title: EMOJI, power: 2, factionLabel: CJK },
    ];
    const vm = { npcs: { sorted: npcs, all: npcs }, entityIndex: null };

    const element = React.createElement(Document, null,
      React.createElement(NotableNPCs, { settlement: {}, vm }));

    // The contract: renderToBuffer must NOT throw on unrenderable glyphs, and it
    // must emit a well-formed PDF (the substituted letters are a visual defect,
    // not a structural failure — this arm pins only that it stays well-formed).
    const buf = await renderToBuffer(element);
    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
    expect(buf.length).toBeGreaterThan(1000);
  }, 30000);

  test('safe() is transparent — every script survives it verbatim', async () => {
    const { safe } = await import('../../src/pdf/lib/format.js');
    // ⚠ Was `expect(safe(SMART)).toContain('fortif<ZWNJ>ied')` until 2026-09-01:
    // safe() used to split the "fi" with a zero-width non-joiner. U+200C is
    // covered by NO embedded face, so that joiner was itself the thing forcing a
    // non-embedded font. safe() now mutates nothing at all.
    expect(safe(SMART)).toBe(SMART);
    // Non-Latin code points survive the pass verbatim (no strip / no fold).
    expect(safe(CJK)).toContain('龍');
    expect(safe(ARABIC)).toContain('مدينة');
  });
});
