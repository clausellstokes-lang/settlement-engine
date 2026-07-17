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

describe('TownMapDocument — single-map PDF export', () => {
  test('renders a valid, non-trivial one-page PDF under a lens', async () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'pdf-map' });
    const buf = await renderToBuffer(React.createElement(TownMapDocument, { settlement: s, style: 'parchment' }));
    expect(buf.length).toBeGreaterThan(1000);
    expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
  });

  test('honors the current lens: parchment vs VTT emit different bytes', async () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'pdf-lens' });
    const parch = await renderToBuffer(React.createElement(TownMapDocument, { settlement: s, style: 'parchment' }));
    const vtt = await renderToBuffer(React.createElement(TownMapDocument, { settlement: s, style: 'vtt' }));
    expect(Buffer.compare(parch, vtt)).not.toBe(0);
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
});
