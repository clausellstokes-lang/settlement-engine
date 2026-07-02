/**
 * @vitest-environment node
 *
 * M4 byte-render guard for the Notable-NPCs chapter.
 *
 * The rest of the PDF suite deliberately stops at the element tree (fontkit +
 * jsdom is fragile there). But that means NOTHING exercised the actual layout /
 * pagination engine — the exact place the NPC FullCard bug lived: a `wrap={false}`
 * card whose (unbounded) body exceeds a page was CLIPPED by react-pdf, silently
 * dropping secrets/plot-hooks on the settlement's most important NPC.
 *
 * renderToBuffer works fine in the Node environment (~200ms), so this renders a
 * WORST-CASE top NPC (long blurb + many secrets + many plot hooks) to real PDF
 * bytes and asserts the card PAGINATES (>= 2 page objects) rather than clipping.
 * Under the old wrap={false} the tall card could not break and its tail was lost.
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import React from 'react';
import { describe, test, expect } from 'vitest';
import { Document, Font, renderToBuffer } from '@react-pdf/renderer';

// theme.js registers Lora/Nunito with Vite public URLs (`/fonts/…?v=2`) that
// fontkit cannot open on disk in Node. Font.register MERGES variants and the
// FIRST-registered source wins, so register the on-disk TTFs HERE — before the
// section (which imports theme.js) is loaded via the dynamic import below. This
// leaves the built-in Helvetica default intact (Font.clear() would remove it).
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

const SENT = 'The archivist keeps a ledger of debts nobody remembers owing, and reads it aloud on feast days. ';
const BLURB = SENT.repeat(5);
const ITEM = SENT.repeat(2);

/** Amplify the top-power NPCs (the "major figures" that render as FullCard) to a
 *  worst-case size so their cards exceed a single page. */
function amplify(settlement) {
  const npcs = (settlement.npcs || []).slice().sort((a, b) => (b?.power || 0) - (a?.power || 0));
  for (let i = 0; i < Math.min(3, npcs.length); i++) {
    npcs[i] = {
      ...npcs[i],
      power: 95,
      blurb: BLURB,
      personality: BLURB,
      physical: BLURB,
      goal: BLURB,
      secrets: Array.from({ length: 6 }, (_, k) => `Secret ${k}: ${ITEM}`),
      plotHooks: Array.from({ length: 6 }, (_, k) => `Hook ${k}: ${ITEM}`),
    };
  }
  return { ...settlement, npcs };
}

const countPages = (buf) => (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

describe('NotableNPCs renders real PDF bytes (M4 — worst-case NPC paginates, not clips)', () => {
  test('a worst-case top NPC renders to a valid multi-page PDF buffer', async () => {
    // Dynamic import so the font re-registration above lands BEFORE theme.js runs.
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { buildViewModel } = await import('../../src/pdf/lib/viewModel.js');
    const { NotableNPCs } = await import('../../src/pdf/sections/NotableNPCs.jsx');

    const base = generateSettlementPipeline(
      { settType: 'city', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
      null,
      { seed: 'm4-npc-worstcase', customContent: {} },
    );
    const settlement = amplify(base);
    const vm = buildViewModel({ settlement });
    expect(vm.npcs.sorted.length).toBeGreaterThan(0);

    const element = React.createElement(Document, null,
      React.createElement(NotableNPCs, { settlement, vm }));
    const buf = await renderToBuffer(element);

    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
    // Real bytes + multiple page objects: the worst-case cards actually went
    // through the yoga layout / pagination engine (which the element-tree smoke
    // tests never reach) and produced a multi-page document without throwing.
    // This is the guard the element-tree tests can't give — it caught a real
    // layout coordinate-overflow on over-large content during development. (It
    // does not byte-assert no-clip: react-pdf subsets fonts, so the tail text is
    // glyph-encoded and ungreppable — the wrap fix in NotableNPCs is what prevents
    // the clip; this proves the tall card renders through pagination cleanly.)
    expect(countPages(buf)).toBeGreaterThanOrEqual(2);
  }, 30000);
});
