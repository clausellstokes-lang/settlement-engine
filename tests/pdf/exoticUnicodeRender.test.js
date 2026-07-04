/**
 * @vitest-environment node
 *
 * Exotic-unicode render guard for the react-pdf export path.
 *
 * `safe()` (src/pdf/lib/format.js) only defuses the Lora f-ligatures — it does
 * NOT transliterate or strip non-Latin scripts. That is deliberate: the Lora
 * subset simply has no glyph for CJK / Arabic / emoji, so those code points
 * render as "tofu" (a missing-glyph box). The contract this test pins is that
 * unrenderable glyphs TOFU rather than CRASH: react-pdf's layout/pagination must
 * still produce a valid PDF when an NPC's name, blurb, and secrets are full of
 * CJK, RTL Arabic, emoji, and smart punctuation.
 *
 * (The campaign PDF, by contrast, uses jsPDF/Helvetica and folds these to ASCII
 * placeholders — see campaignPdfSanitize.test.js. This file is the react-pdf
 * counterpart: no fold, glyphs tofu, but the document is still well-formed.)
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

describe('react-pdf path tofus (not crashes) on exotic unicode', () => {
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
    // must emit a well-formed PDF (the tofu boxes are a visual fallback, not a
    // structural failure).
    const buf = await renderToBuffer(element);
    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
    expect(buf.length).toBeGreaterThan(1000);
  }, 30000);

  test('the smart-punctuation "fortified" is still ligature-defused (safe() ran)', async () => {
    const { safe } = await import('../../src/pdf/lib/format.js');
    // safe() leaves the CJK/emoji code points untouched (they tofu at render),
    // but the fi in "fortified" is still split by a ZWNJ.
    expect(safe(SMART)).toContain(`fortif‌ied`);
    // Non-Latin code points survive the pass verbatim (no strip / no fold).
    expect(safe(CJK)).toContain('龍');
    expect(safe(ARABIC)).toContain('مدينة');
  });
});
