/**
 * @vitest-environment node
 *
 * townMapDocument.smoke.test.js — the SINGLE-MAP PDF export (MAP EXPORTS).
 *
 * A standalone one-page town-map PDF (src/pdf/TownMapDocument.jsx). Pins:
 *   • it renders to a valid, non-trivial PDF under a lens (no throw);
 *   • it honors the current lens — parchment vs VTT emit different bytes (the VTT
 *     grid + palette change the plate);
 *   • a map-less settlement still emits a valid (short note) PDF, never a corrupt
 *     zero-page document;
 *   • it maps draw ops through the SHARED renderTownMapOp exported from the plate
 *     (one op→primitive mapping, no drift).
 *
 * The plate uses default Helvetica (react-pdf built-in) for its caption, so no
 * Font.register is needed — this stays a self-contained doc. Byte-level lens
 * determinism is pinned at the SVG / draw-list layer (tests/lib/townMapExport.js,
 * tests/domain/townMapDraw.js); here we only confirm the PDF consumes it.
 */
import React from 'react';
import { describe, test, expect } from 'vitest';
import { renderToBuffer } from '@react-pdf/renderer';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';
import { TownMapDocument } from '../../src/pdf/TownMapDocument.jsx';
import { renderTownMapOp } from '../../src/pdf/sections/TownMapPlate.jsx';

// Deterministic element-tree color collector. react-pdf's renderToBuffer embeds a
// non-reproducible timestamp, so a full-buffer Buffer.compare across two renders is
// VACUOUS (always !== 0) and proves nothing about the lens plumbing (the IT-4 discipline).
// We assert on the SYNCHRONOUS element tree TownMapDocument builds instead: walk it and
// collect every fill/stroke/backgroundColor string.
const collectColors = (node, out = new Set()) => {
  if (Array.isArray(node)) { node.forEach((n) => collectColors(n, out)); return out; }
  if (!node || typeof node !== 'object') return out;
  const p = node.props || {};
  for (const v of [p.fill, p.stroke, p.backgroundColor, p.style?.backgroundColor]) if (typeof v === 'string') out.add(v);
  if (p.children != null) collectColors(p.children, out);
  return out;
};
const colorsUnder = (settlement, style) => collectColors(TownMapDocument({ settlement, style }));

describe('TownMapDocument — single-map PDF export', () => {
  test('renders a valid, non-trivial one-page PDF under a lens', async () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'pdf-map' });
    const buf = await renderToBuffer(React.createElement(TownMapDocument, { settlement: s, style: 'parchment' }));
    expect(buf.length).toBeGreaterThan(1000);
    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
  });

  test('honors the current lens: parchment vs VTT build different plates (element tree, not bytes)', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'pdf-lens' });
    // The VTT grid + palette change the plate, so the two lenses paint a different color
    // set. Assert on the DETERMINISTIC element tree, never renderToBuffer bytes (a byte
    // compare is vacuous — react-pdf embeds a non-reproducible timestamp, so it is always
    // != 0 whether or not the lens plumbing actually works).
    const parch = [...colorsUnder(s, 'parchment')].sort().join(',');
    const vtt = [...colorsUnder(s, 'vtt')].sort().join(',');
    expect(parch.length).toBeGreaterThan(0);
    expect(parch).not.toBe(vtt);
  });

  test('a map-less settlement still emits a valid PDF, never a corrupt one', async () => {
    const buf = await renderToBuffer(React.createElement(TownMapDocument, {
      settlement: { institutions: [], spatialLayout: { quarters: [] } },
    }));
    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
  });

  test('maps ops through the SHARED renderTownMapOp exported from the plate', () => {
    expect(typeof renderTownMapOp).toBe('function');
    const el = renderTownMapOp({ t: 'circle', cx: 10, cy: 10, r: 4, fill: '#123456' }, 0);
    expect(el).toBeTruthy();
    expect(el.key).toBe('op-0');
  });

  // THE SKIN REGISTRY (IT-4) — the standalone PDF is the fourth WORN surface (done-when #4). A
  // settlement carrying a saved bespoke skin (blob-resident, selected) resolves through
  // resolveActiveStyle, so the plate's draw ops + plate background wear the skin. The proof reads
  // the DETERMINISTIC element tree TownMapDocument builds (react-pdf's renderToBuffer embeds a
  // non-reproducible timestamp, so full-buffer comparison would be unsound); a still-valid PDF is
  // pinned by the smoke render above.
  test('a persisted bespoke skin is WORN on the standalone PDF plate (element tree; flips back)', async () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'pdf-skin' });
    const { validateBespokeStyle } = await import('../../src/design/townMapStyleWall.js');
    const { addBespokeStyle } = await import('../../src/domain/townMap/bespokeStyles.js');
    const SKIN_WATER = '#00e5ff'; // a hue that appears in NO base lens ⇒ a legible worn-marker
    const { style } = validateBespokeStyle({ label: 'Skin', background: '#0a0a12', palette: { water: SKIN_WATER } }, { id: 'neon-noir', label: 'Skin' });
    const worn = { ...s, mapEdits: { styleLens: 'neon-noir', bespokeStyles: addBespokeStyle({}, 'neon-noir', style) } };

    // Collect every fill/stroke/backgroundColor string in the built element tree (no react-pdf
    // renderer needed — TownMapDocument inlines the resolved ops + plate background synchronously).
    const colors = (settlement, styleProp) => {
      const out = new Set();
      const walk = (node) => {
        if (Array.isArray(node)) { node.forEach(walk); return; }
        if (!node || typeof node !== 'object') return;
        const p = node.props || {};
        for (const v of [p.fill, p.stroke, p.backgroundColor, p.style?.backgroundColor]) if (typeof v === 'string') out.add(v);
        if (p.children != null) walk(p.children);
      };
      walk(TownMapDocument({ settlement, style: styleProp }));
      return out;
    };

    expect(colors(worn).has(SKIN_WATER)).toBe(true);                 // the skin is WORN (persisted lens)
    expect(colors(worn, 'parchment').has(SKIN_WATER)).toBe(false);   // an explicit base override collapses off it
    // flip the SELECTION back to parchment (collection preserved) ⇒ the skin color is gone; parchment worn.
    const flipped = { ...worn, mapEdits: { ...worn.mapEdits, styleLens: 'parchment' } };
    expect(colors(flipped).has(SKIN_WATER)).toBe(false);
  });
});
