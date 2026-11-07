// @vitest-environment node
/**
 * pageChromeFixedLeading.test.jsx — LANDING-7 lane C (2026-11-06): a long chapter must not
 * hand the renderer an absurd number through the FIXED page chrome.
 *
 * THE DEFECT. The metropolis dossier stopped rendering ("unsupported number:
 * -6.375194864464012e+21", pdfkit :: moveTo under @react-pdf/render :: clipBorderTop). The
 * number was the fixed footer of src/pdf/primitives/PageChrome.jsx :: PageChrome — its
 * border-top drawn at `top = -height` where the footer's height had grown to 6.4e21 on the
 * eleventh page of the Institutions chapter. The footer's two texts carried
 * `type.caption`'s UNITLESS lineHeight (1.35). @react-pdf/layout 4.6.1 re-resolves a page's
 * already-resolved styles on every relayout (relayoutPage → resolvePageStyles, run several
 * times per page split), and a resolved lineHeight is a bare number, so each relayout
 * multiplies it by the fontSize again: 10.8 on page 1, 3.5e5 on page 2, then ×64 a page —
 * 8^24 × 1.35 = 6.4e21 on page 11. A fixed node is carried to EVERY page, so its leading
 * compounds without bound; any single PageChrome chapter of eleven pages or more could not
 * print (the metropolis Institutions chapter: 98 cards, 12 pages).
 *
 * THE DOOR. A fixed text in the chrome carries NO lineHeight (nothing to re-multiply), so
 * its box is the same on page 30 as on page 1. This test renders the chrome around a body
 * long enough to paginate thirty pages and asserts (1) the document renders, (2) every
 * number in every laid-out box is finite and within ten page-heights, (3) the footer's
 * box height is the same on every page. Red at the parent with the -6.4e21-class error.
 *
 * The layout is read through @react-pdf/layout (a dependency of @react-pdf/renderer, read
 * here only as the test's instrument, the fontCmap.test.js precedent for fontkit) on the
 * container `pdf()` returns — the same tree renderToBuffer hands the painter.
 */
import { test, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToBuffer, pdf, Font, Document, View } from '@react-pdf/renderer';
import layoutDocument from '@react-pdf/layout';
import { PageChrome } from '../../src/pdf/primitives/PageChrome.jsx';

// Node font shim (the fullPdf.render.test.jsx idiom): theme.js registers browser URLs.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FONT = (name) => path.join(REPO_ROOT, 'public', 'fonts', name);
const registered = Font.getRegisteredFonts();
if (registered.Lora) registered.Lora.sources = [];
if (registered.Nunito) registered.Nunito.sources = [];
Font.register({
  family: 'Lora',
  fonts: [
    { src: FONT('Lora-Regular.ttf'), fontWeight: 400 },
    { src: FONT('Lora-Bold.ttf'), fontWeight: 700 },
    { src: FONT('Lora-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: FONT('Lora-BoldItalic.ttf'), fontWeight: 700, fontStyle: 'italic' },
  ],
});
Font.register({
  family: 'Nunito',
  fonts: [
    { src: FONT('Nunito-Regular.ttf'), fontWeight: 400 },
    { src: FONT('Nunito-Bold.ttf'), fontWeight: 700 },
    { src: FONT('Nunito-ExtraBold.ttf'), fontWeight: 800 },
    { src: FONT('Nunito-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
  ],
});

const PAGES = 30;
// Ten unbreakable 80pt blocks a page (A4 body ≈ 740pt) ⇒ about PAGES pages of one chapter.
const chapter = () => React.createElement(Document, null,
  React.createElement(PageChrome, { settlement: { name: 'Longhold' } },
    ...Array.from({ length: PAGES * 9 }, (_, i) => React.createElement(View, {
      key: `b-${i}`, wrap: false, style: { height: 80, borderTop: '0.5pt solid #000000' },
    }))));

test('a thirty-page PageChrome chapter lays out with every box number finite and bounded, and the fixed footer the same height on every page', async () => {
  const layout = await layoutDocument(pdf(chapter()).container.document, Font);
  const pages = layout.children;
  expect(pages.length).toBeGreaterThanOrEqual(PAGES);
  const pageHeight = pages[0].box.height;
  const BOUND = 10 * pageHeight;
  const bad = [];
  const walk = (node, where) => {
    for (const [k, v] of Object.entries(node.box || {})) {
      if (typeof v === 'number' && !(Number.isFinite(v) && Math.abs(v) <= BOUND)) bad.push(`${where} ${node.type}.box.${k}=${v}`);
    }
    (node.children || []).forEach((c, i) => walk(c, `${where}/${i}`));
  };
  pages.forEach((p, i) => walk(p, `page ${i + 1}`));
  expect(bad.slice(0, 5), `${bad.length} box numbers out of bounds (±${BOUND})`).toEqual([]);

  // The fixed footer is the page's LAST child (PageChrome :: footer, absolute, bottom 24).
  const footerHeights = pages.map((p) => p.children[p.children.length - 1].box.height);
  expect(new Set(footerHeights).size, `footer heights: ${footerHeights.slice(0, 4).join(', ')} …`).toBe(1);
}, 120000);

test('the same thirty-page chapter renders to PDF bytes (the painter takes every number)', async () => {
  const buf = await renderToBuffer(chapter());
  expect(Buffer.from(buf).toString('latin1', 0, 5)).toBe('%PDF-');
}, 120000);
