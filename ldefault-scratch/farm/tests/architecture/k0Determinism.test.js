/**
 * k0Determinism.test.js -- K-0 SPIKE: the byte-determinism proof + PNG encoder validity.
 *
 * The whole spike exists to answer whether a PROMISE-keeping (byte-deterministic) CPU renderer
 * can reach the reference bar, so byte-reproducibility is the non-negotiable property. These pins
 * prove a double render is byte-identical (PNG + SVG), that the tone LUT is a well-formed transfer
 * curve, and that the in-repo PNG encoder emits a structurally valid, deterministic PNG.
 */
import { describe, it, expect } from 'vitest';
import { renderSpike } from '../../src/domain/townMap/arch/spike.js';
import { encodePng } from '../../src/domain/townMap/arch/png.js';
import { TONE_LUT, tone } from '../../src/domain/townMap/arch/rationalTables.js';

/** bytes-equal. @param {Uint8Array} a @param {Uint8Array} b */
const eq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

describe('the spike renders byte-identically twice', () => {
  const a = renderSpike({ width: 240, height: 240, ss: 1 });
  const b = renderSpike({ width: 240, height: 240, ss: 1 });

  it('PNG bytes are identical', () => {
    expect(eq(a.pngBytes, b.pngBytes)).toBe(true);
    expect(a.pngBytes.length).toBeGreaterThan(0);
  });

  it('engraving SVG is identical', () => {
    expect(a.engravingSvg).toBe(b.engravingSvg);
  });

  it('plate SVG (png data-uri + linework) is identical', () => {
    expect(a.plateSvg).toBe(b.plateSvg);
  });
});

describe('the tone LUT is a well-formed transfer curve', () => {
  it('is monotonic non-decreasing and anchored 0..255', () => {
    expect(TONE_LUT[0]).toBe(0);
    expect(TONE_LUT[TONE_LUT.length - 1]).toBe(255);
    for (let i = 1; i < TONE_LUT.length; i++) expect(TONE_LUT[i]).toBeGreaterThanOrEqual(TONE_LUT[i - 1]);
  });

  it('tone() clamps and interpolates within [0,255]', () => {
    expect(tone(-1)).toBe(0);
    expect(tone(0)).toBe(0);
    expect(tone(1)).toBe(255);
    expect(tone(2)).toBe(255);
    const mid = tone(0.5);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(255);
  });
});

describe('the PNG encoder emits a valid, deterministic PNG', () => {
  it('has the PNG signature and correct IHDR dimensions', () => {
    const rgb = new Uint8Array(4 * 3); // 2x2 red-ish
    for (let i = 0; i < rgb.length; i += 3) { rgb[i] = 200; rgb[i + 1] = 40; rgb[i + 2] = 30; }
    const png = encodePng(2, 2, rgb);
    expect([...png.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    // IHDR chunk data starts at offset 16: width(4 BE) then height(4 BE)
    const w = (png[16] << 24) | (png[17] << 16) | (png[18] << 8) | png[19];
    const h = (png[20] << 24) | (png[21] << 16) | (png[22] << 8) | png[23];
    expect(w).toBe(2);
    expect(h).toBe(2);
    expect(png[24]).toBe(8); // bit depth
    expect(png[25]).toBe(2); // color type RGB
  });

  it('ends with an IEND chunk and encodes deterministically', () => {
    const rgb = new Uint8Array(3 * 3 * 3);
    for (let i = 0; i < rgb.length; i++) rgb[i] = (i * 37) & 0xff;
    const p1 = encodePng(3, 3, rgb);
    const p2 = encodePng(3, 3, rgb);
    expect(eq(p1, p2)).toBe(true);
    const tail = String.fromCharCode(...p1.slice(p1.length - 8, p1.length - 4));
    expect(tail).toBe('IEND');
  });
});
