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
    // Full-suite contention measured this real byte render at 30,013 ms. Keep the
    // complete coverage and give the loaded case roughly 2x measured headroom.
  }, 60_000);
});

/**
 * SAME WORLD, SAME BYTES. A dossier's only non-reproducible content used to be its
 * cover date, and the World Book made that injectable long ago (opts.now). The
 * document's METADATA was never pinned at all: react-pdf defaults `creationDate` to
 * `new Date()` (react-pdf.js:151) and writes it into the info dict as `CreationDate`
 * (:174), so two exports of ONE unchanged settlement differed in bytes no matter
 * what the caller did — there was no seam to hold still. Measured at base, the info
 * dict carried a live wall clock: `(D:20260901203247Z)`. That defeats any byte-level
 * golden over the paid artifact, and it means a buyer re-exporting an untouched
 * settlement gets a different file.
 *
 * `producer` is pinned in the same block. react-pdf's default is the bare string
 * 'react-pdf' (:150) — measured at base as the literal `(react-pdf)` in the info
 * dict — so the paid artifact named the RENDERER where `creator` named the product.
 * The pinned value names both, truthfully, and takes a dependency-owned string out
 * of a paid artifact's metadata.
 *
 * ⚠ THE ASSERTIONS ARE DELIBERATELY ANCHORED ON MEASURED LITERALS. The info dict
 * addresses its strings INDIRECTLY (`/Producer 84 0 R`), so a pattern written
 * against `/Producer (…)` matches nothing and passes vacuously in both directions —
 * a false-green. Every arm below asserts on a string value measured in the real
 * artifact. The dates are far from any wall clock, so a pass cannot be a coincidence
 * of the current year, and pdfkit writes them in UTC (`Z`), so no timezone can move
 * the digits asserted here.
 */
describe('the dossier is byte-reproducible when its date seam is held (R8b)', () => {
  const FIXED = new Date('1987-06-05T12:00:00Z');

  async function renderFixed(extra = {}) {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { normalizeSettlement } = await import('../../src/domain/normalizeSettlement.js');
    const { SettlementPDF } = await import('../../src/pdf/SettlementPDF.jsx');
    const settlement = normalizeSettlement(
      generateSettlementPipeline({ settType: 'village', culture: 'germanic' }, null, { seed: 'r8b-seam', customContent: {} }),
    );
    return renderToBuffer(React.createElement(SettlementPDF, {
      settlement, now: 'Cyfrin 1, 2026', creationDate: FIXED, ...extra,
    }));
  }

  test('the injected creationDate reaches the document info dict', async () => {
    const buf = await renderFixed();
    expect(buf.toString('latin1')).toContain('D:19870605');
  }, 60_000);

  test('the producer names the product, not the renderer', async () => {
    const text = (await renderFixed()).toString('latin1');
    // Measured at base: exactly one `(react-pdf)` literal — the Producer value.
    expect(text).not.toContain('(react-pdf)'); // anchored: 'SettlementForge' asserted present on the next line — the info dict rendered and names the product
    expect(text).toContain('SettlementForge');
  }, 60_000);

  /**
   * ⛔ MEASURED, AND THE STRONGER CLAIM IS FALSE: a dossier is NOT byte-identical
   * across two renders even with every seam held, and the seam cannot make it so.
   * Two residual channels live inside the VENDORED renderer, both measured here:
   *   1. the font SUBSET TAG — pdfkit/fontkit mints a fresh random six-letter
   *      prefix per render (`/NQPGAH+Nunito-Regular` vs `/RUGWAM+Nunito-Regular`;
   *      7 distinct tags in one document), and
   *   2. font object EMISSION ORDER — the same font landed as object 153 in one
   *      render and 142 in the other, so object numbering diverges wholesale.
   * Neither is reachable from a prop. Byte-exact goldens over the dossier are
   * therefore impossible until the renderer's font layer is controlled — recorded
   * here rather than left for the next lane to re-discover.
   *
   * What the seam DOES make reproducible is the document's IDENTITY metadata, and
   * that is what this pins: pdfkit derives the file `/ID` from the info dict, so an
   * unpinned CreationDate gave every export a different `/ID`. Measured at the tip,
   * two renders under one seam now agree exactly.
   */
  test('the document identity (/ID) is stable across renders under one seam', async () => {
    const idOf = (buf) => (buf.toString('latin1').match(/\/ID\s*\[[^\]]*\]/) || [])[0];
    const [a, b] = [await renderFixed(), await renderFixed()];
    const [ia, ib] = [idOf(a), idOf(b)];
    // anchored: an /ID was actually found, so equality below is not two undefineds.
    expect(ia).toMatch(/^\/ID \[</);
    expect(ib).toBe(ia);
  }, 120_000);

  test('a different creationDate genuinely changes the bytes (the seam is load-bearing)', async () => {
    const a = await renderFixed();
    const b = await renderFixed({ creationDate: new Date('1991-03-14T12:00:00Z') });
    // Anchored on the second date actually landing, so this cannot pass merely
    // because a wall clock advanced between the two renders.
    expect(b.toString('latin1')).toContain('D:19910314');
    expect(Buffer.compare(a, b)).not.toBe(0);
  }, 120_000);
});
