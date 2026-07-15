/**
 * @vitest-environment node
 *
 * R8 — full-document PDF byte-render smoke test.
 *
 * The rest of the PDF suite stops at the element tree; notableNpcsByteRender covers
 * ONE chapter's bytes. This renders the WHOLE SettlementPDF (every chapter, cover
 * → appendix) to real PDF bytes, so the entire pagination / layout pipeline — the
 * place "no test renders bytes" (review R8) left unverified — is exercised end to
 * end against real generated settlements. It caught nothing to fix at authoring;
 * its job is to red a future change that produces a settlement shape the renderer
 * can't paginate (a layout NaN / coordinate overflow / unsplittable block).
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import React from 'react';
import { describe, test, expect } from 'vitest';
import { Font, renderToBuffer } from '@react-pdf/renderer';

// Register the on-disk TTFs BEFORE the PDF module (which imports theme.js and its
// Vite-URL font registration) loads — first-registered source wins, and fontkit
// can't open the `/fonts/…?v=2` URLs in Node. (Same shim as notableNpcsByteRender.)
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

const countPages = (buf) => (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

describe('SettlementPDF renders the whole document to real PDF bytes (R8)', () => {
  test.each([
    ['metropolis', 'mediterranean', 'coastal', 'port'],
    ['village', 'germanic', 'grassland', 'road'],
    ['thorp', 'norse', 'tundra', 'none'],
  ])('a %s settlement paginates to a valid multi-page PDF', async (settType, culture, terrain, tradeRouteAccess) => {
    // Dynamic import so the font re-registration above lands before theme.js runs.
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { normalizeSettlement } = await import('../../src/domain/normalizeSettlement.js');
    const { SettlementPDF } = await import('../../src/pdf/SettlementPDF.jsx');

    const settlement = normalizeSettlement(
      generateSettlementPipeline({ settType, culture, terrain, tradeRouteAccess }, null, { seed: `r8-${settType}`, customContent: {} }),
    );
    const buf = await renderToBuffer(React.createElement(SettlementPDF, { settlement }));

    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
    // A full dossier is inherently multi-chapter → multi-page; 1 page would mean a
    // catastrophic layout collapse. This confirms the pagination pipeline ran.
    expect(countPages(buf)).toBeGreaterThanOrEqual(2);
    expect(buf.length).toBeGreaterThan(5000);
  }, 30000);
});
