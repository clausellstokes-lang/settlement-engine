/**
 * tests/build/arrowHeaderAssets.test.js: THE PAINTED ARROW'S PIXELS.
 *
 * The owner's orders (2026-09-16): the header is "some copy/cut/cropped/pasted version of
 * this arrow", the owner's own painting, and "the top of the wooden shaft (not the top
 * feather) is where the page starts". Two files ship under public/brand/arrow: the levelled
 * strip (2133x182) and a plain-wood filler tile (372x70, the chair's 2026-09-17 re-cut) cut
 * from the same painting.
 *
 * src/components/nav/arrowGeometry.js states where the painting's parts are. Those numbers
 * are only as good as the pixels under them, so this file decodes the SHIPPED files and
 * re-measures every table the geometry uses. A re-cut of the art therefore reds here (the
 * sha256 pins first, then the measurements) instead of shipping a hit region on a binding,
 * a cut through a painted word or a contrast claim nobody re-checked.
 *
 * Pinned, all from the decoded files:
 *   (a) the files: names, canvas sizes, byte ceilings, sha256, chunk layout; each is the cut
 *       kit's WebP byte-for-byte plus the provenance credit the committed injector writes
 *       (strip the XMP chunk and the kit's bytes come back; re-inject and the shipped bytes
 *       come back), so the coded pixels were never re-encoded;
 *   (b) the page starts on wood: row 0 is opaque across ROW0_OPAQUE and the shaft band is
 *       opaque; the hang and barb constants end exactly where the alpha ends;
 *   (c) bindings are cord and no painted-word region or the plate carries cord;
 *   (d) every cut has FE columns of plain wood on both sides, every wood run is plain and
 *       maximal, and each word's ink lies inside its NAV_WORD extent (with a CONTROL showing
 *       the ink detector fires on a word);
 *   (e) the filler tiles seamlessly, is opaque through the shaft and matches its lighting, and
 *       SLOT_TONE re-measures on the shipped pixels (so the toned slots match the wood beside
 *       each cut);
 *   (f) the slip field is clear of the plate's engraving and rivets;
 *   (g) contrast riders on real wood pixels, including the NEGATIVE ones that decide the
 *       header's focus and current-page marks: INK clears 3:1 on the upper band only,
 *       PARCH_100 on the lower band only, neither on rows 24 to 36, and the house bronze
 *       focus colour does not clear 3:1 on wood at all;
 *   (h) the feather: nothing hangs below the band left of the barb outside the feather's
 *       columns, nothing opaque crosses the feather layer's right edge, and the rows the
 *       feather shares with the always-drawn hang are opaque but for two named ends.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { injectFile, webpCanvas, webpChunks } from '../../scripts/inject-ai-provenance.mjs';
import {
  ARROW_FILLER_SRC, ARROW_STRIP_SRC, BAND_H, BARB_HANG_H, BINDINGS, COMPACT_JOIN, CUTS, FE,
  FEATHER_FROM, FEATHER_X1, FILLER_H, FILLER_W, GLOW_PAD, HANG_H, LOGO_PLATE, NAV_HIT, NAV_WORD,
  PLATE, PLATE_RIVETS, ROW0_OPAQUE, SLIP, SLOT_TONE, SEAM_BAND_TO, SEAM_HANG_FROM, STRIP_H,
  STRIP_W, UNDERLINE_ROW, WOOD_RUNS, WORD_ROWS,
} from '../../src/components/nav/arrowGeometry.js';
import { legacy } from '../../src/design/tokens.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const register = JSON.parse(readFileSync(join(ROOT, 'scripts', 'ai-media-provenance.json'), 'utf8'));
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const rel = (src) => `public${src}`;

const STRIP_REL = rel(ARROW_STRIP_SRC);
const FILLER_REL = rel(ARROW_FILLER_SRC);

/** Decode a shipped file to straight RGBA. */
async function decode(relPath) {
  const { data, info } = await sharp(join(ROOT, relPath)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
const strip = await decode(STRIP_REL);
const filler = await decode(FILLER_REL);
const px = (img, x, y) => { const i = (y * img.w + x) * 4; return img.data.subarray(i, i + 4); };
const alpha = (img, x, y) => px(img, x, y)[3];

/** Rec. 709 luma of an sRGB pixel, 0..255: the ink detector's scale. */
const luma = (p) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
/** WCAG relative luminance. */
const channel = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (p) => 0.2126 * channel(p[0]) + 0.7152 * channel(p[1]) + 0.0722 * channel(p[2]);
const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
};

/** Each shaft row's median luma across the shaft [520, 1620): the lighting the ink test is relative to. */
const ROW_MEDIAN = Array.from({ length: BAND_H + 2 }, (_, y) => {
  const values = [];
  for (let x = 520; x < 1620; x += 1) values.push(luma(px(strip, x, y)));
  return percentile(values, 0.5);
});
/** Dark shaft pixels (under half the row's median) in rows [4, 63) of a column. */
const darkCount = (x) => {
  let n = 0;
  for (let y = 4; y < 63; y += 1) if (luma(px(strip, x, y)) < 0.5 * ROW_MEDIAN[y]) n += 1;
  return n;
};
/** Crimson cord pixels (blue above green, red well above green) in rows [4, 63) of a column. */
const cordCount = (x) => {
  let n = 0;
  for (let y = 4; y < 63; y += 1) {
    const [r, g, b] = px(strip, x, y);
    if (b > g + 4 && r > 1.6 * g + 10) n += 1;
  }
  return n;
};
/** A plain-wood column: no cord pixel, at most one dark grain fleck. */
const plain = (x) => darkCount(x) <= 1 && cordCount(x) === 0;
/** A lettering column: three or more pixels under 0.55 of the row median in rows [14, 61). */
const lettered = (x) => {
  let n = 0;
  for (let y = 14; y < 61; y += 1) if (luma(px(strip, x, y)) < 0.55 * ROW_MEDIAN[y]) n += 1;
  return n >= 3;
};
const columns = (span) => Array.from({ length: span.x1 - span.x0 }, (_, i) => span.x0 + i);
const WOOD_COLUMNS = WOOD_RUNS.flatMap(columns);

/** A WebP with its XMP chunk removed and the VP8X XMP flag cleared: the pre-credit file. */
function withoutXmp(buf) {
  const chunk = (type, payload) => {
    const head = Buffer.alloc(8);
    head.write(type, 0, 'latin1');
    head.writeUInt32LE(payload.length, 4);
    return Buffer.concat([head, payload, payload.length % 2 ? Buffer.from([0]) : Buffer.alloc(0)]);
  };
  const body = Buffer.concat(webpChunks(buf).filter((c) => c.type !== 'XMP ').map((c) => {
    if (c.type !== 'VP8X') return chunk(c.type, c.payload);
    const flags = Buffer.from(c.payload);
    flags[0] &= ~0x04;
    return chunk('VP8X', flags);
  }));
  const riff = Buffer.alloc(12);
  riff.write('RIFF', 0, 'latin1');
  riff.writeUInt32LE(body.length + 4, 4);
  riff.write('WEBP', 8, 'latin1');
  return Buffer.concat([riff, body]);
}

const FILES = {
  [STRIP_REL]: {
    size: [STRIP_W, STRIP_H],
    bytes: 70230,
    ceiling: 70500,
    sha256: '427f9d98fb9a714c443f074b233ab9ec9cf494e2bd6f096b67d2691c08502dd2',
    kitSha256: 'e2f7dc00d11a83af2618a553ff013782dcef28b8fc2b5aa0761f108756544dbf',
    restored: '2026-09-16',
  },
  // The chair's re-cut (2026-09-17): the kit's arrow-filler-v3.q90.webp (6,366 B) plus the
  // credit. Its ceiling moved with the file (5,200 for the 5,024 B first cut), by that ruling.
  [FILLER_REL]: {
    size: [FILLER_W, FILLER_H],
    bytes: 8246,
    ceiling: 8246,
    sha256: '43ddc3bf581170c7e501accc0e6392f58923c313957cc3e4936203a86a13d85d',
    kitSha256: 'fb8659db9d8a2c3c8bebe3048c6ec14763ac8e4c2324a3cdb1c2c748f1f7d536',
    restored: '2026-09-17',
  },
};

describe('(a) the two shipped files', () => {
  it('exist at the URLs the geometry names, at their canvas sizes, under their byte ceilings', async () => {
    expect(Object.keys(FILES)).toEqual(['public/brand/arrow/arrow-strip.webp', 'public/brand/arrow/arrow-filler.webp']);
    for (const [path, want] of Object.entries(FILES)) {
      expect(existsSync(join(ROOT, path)), path).toBe(true);
      const size = statSync(join(ROOT, path)).size;
      expect(size, `${path} bytes`).toBe(want.bytes);
      expect(size).toBeLessThanOrEqual(want.ceiling);
      const meta = await sharp(join(ROOT, path)).metadata();
      expect([meta.format, meta.width, meta.height, meta.hasAlpha], path).toEqual(['webp', ...want.size, true]);
      const canvas = webpCanvas(webpChunks(readFileSync(join(ROOT, path))));
      expect([canvas.width, canvas.height], path).toEqual(want.size);
    }
    expect([strip.w, strip.h, filler.w, filler.h]).toEqual([STRIP_W, STRIP_H, FILLER_W, FILLER_H]);
  });

  it('are pinned by sha256, so a re-cut forces this whole file to be re-measured', () => {
    for (const [path, want] of Object.entries(FILES)) {
      expect(sha256(readFileSync(join(ROOT, path))), path).toBe(want.sha256);
    }
  });

  it("are the cut kit's WebPs byte for byte plus the committed injector's credit, never re-encoded", () => {
    for (const [path, want] of Object.entries(FILES)) {
      const shipped = readFileSync(join(ROOT, path));
      expect(webpChunks(shipped).map((c) => c.type), path).toEqual(['VP8X', 'ALPH', 'VP8 ', 'XMP ']);
      const kit = withoutXmp(shipped);
      expect(sha256(kit), `${path}: stripping the credit does not give back the kit's file`).toBe(want.kitSha256);
      const row = register.assets[path];
      expect([row.markers, row.agent, row.restored], path).toEqual(['present', 'OpenAI', want.restored]);
      const rebuilt = injectFile(path, { ...row, markers: 'absent' }, kit);
      expect(rebuilt.equals(shipped), `${path} is not the injector's output over the kit's file`).toBe(true);
    }
  });

  it('CONTROL: the round trip convicts a file whose coded image changed', () => {
    const shipped = readFileSync(join(ROOT, STRIP_REL));
    const mutated = Buffer.from(shipped);
    const vp8 = webpChunks(mutated).find((c) => c.type === 'VP8 ');
    vp8.payload[Math.floor(vp8.payload.length / 2)] ^= 0xff;
    expect(sha256(withoutXmp(mutated))).not.toBe(FILES[STRIP_REL].kitSha256);
    expect(sha256(withoutXmp(shipped))).toBe(FILES[STRIP_REL].kitSha256);
  });
});

describe('(b) the page starts on wood, and the overhang ends where the constants say', () => {
  it('row 0 is opaque across ROW0_OPAQUE, and each run is maximal', () => {
    const failures = [];
    for (const run of ROW0_OPAQUE) {
      for (const x of columns(run)) if (alpha(strip, x, 0) < 250) failures.push(`row 0 x ${x}: alpha ${alpha(strip, x, 0)}`);
      if (alpha(strip, run.x0 - 1, 0) >= 250) failures.push(`run ${run.x0} extends left`);
      if (run.x1 < STRIP_W && alpha(strip, run.x1, 0) >= 250) failures.push(`run ${run.x1} extends right`);
    }
    expect(failures).toEqual([]);
    // The painted notch between the socket and the arrowhead's upper barb is see-through.
    expect(columns({ x0: 1962, x1: 1978 }).map((x) => alpha(strip, x, 0))).toEqual(Array(16).fill(0));
  });

  it('the shaft band is opaque from the nock to the arrowhead', () => {
    let min = 255;
    for (let y = 0; y < 64; y += 1) for (let x = 100; x < 1947; x += 1) min = Math.min(min, alpha(strip, x, y));
    expect(min).toBeGreaterThanOrEqual(250);
  });

  it('the two layers\' overlap rows are opaque everywhere but the nock\'s tip, the socket notch and the arrowhead\'s point', () => {
    // Both layers paint these rows; anywhere a pixel is translucent the overlap would draw it
    // twice. The exceptions are a few anti-aliased pixels at the three ends of the shaft.
    const EXCEPT = [[0, 47], [1947, 1989], [2047, STRIP_W]];
    const excepted = (x) => EXCEPT.some(([a, b]) => x >= a && x < b);
    const translucent = [];
    for (let y = SEAM_HANG_FROM; y < SEAM_BAND_TO; y += 1) {
      for (let x = 0; x < STRIP_W; x += 1) if (!excepted(x) && alpha(strip, x, y) < 250) translucent.push(`${x},${y}`);
    }
    expect(translucent).toEqual([]);
    // CONTROL: the shaft's anti-aliased lower edge begins on the next rows, where an overlap would
    // double-draw it across the whole arrow; the same scan convicts them.
    let edge = 0;
    for (let x = 0; x < STRIP_W; x += 1) if (!excepted(x) && alpha(strip, x, 65) < 250) edge += 1;
    expect(edge).toBeGreaterThan(500);
  });

  it('the feather ends at the last hang row, the barb at the last barb row, and nothing is cut off below', () => {
    const lastRow = (x0, x1) => {
      for (let y = STRIP_H - 1; y >= 0; y -= 1) for (let x = x0; x < x1; x += 1) if (alpha(strip, x, y) >= 8) return y;
      return -1;
    };
    expect(lastRow(0, 1100)).toBe(BAND_H + HANG_H - 1);
    expect(lastRow(1880, STRIP_W)).toBe(BAND_H + BARB_HANG_H - 1);
    // Between the feather and the barb only the shaft's own lower edge hangs below the band.
    expect(lastRow(1100, 1880)).toBeLessThan(BAND_H + 6);
    expect(lastRow(0, STRIP_W)).toBe(BAND_H + HANG_H - 1);
  });
});

describe('(c) bindings are cord; words and the plate are not', () => {
  it('every binding is mostly cord columns with dark edges, and no painted-word region or the plate carries cord', () => {
    const failures = [];
    BINDINGS.forEach((b, i) => {
      const heavy = columns(b).filter((x) => cordCount(x) >= 3).length;
      if (heavy < 0.6 * (b.x1 - b.x0)) failures.push(`binding ${i}: ${heavy} cord columns of ${b.x1 - b.x0}`);
      if (darkCount(b.x0) < 4 || darkCount(b.x1 - 1) < 4) failures.push(`binding ${i}: soft edge`);
      if (i < BINDINGS.length - 1 && (darkCount(b.x0 - 1) >= 4 || darkCount(b.x1) >= 4)) failures.push(`binding ${i}: extends`);
    });
    for (const [id, hit] of [...Object.entries(NAV_HIT), ['plate', PLATE]]) {
      const cord = columns(hit).filter((x) => cordCount(x) >= 3);
      if (cord.length) failures.push(`${id}: cord columns ${cord.slice(0, 5).join(',')}`);
    }
    expect(failures).toEqual([]);
  });

  it('CONTROL: the cord detector fires on a binding and stays quiet on wood', () => {
    expect(cordCount(525)).toBeGreaterThanOrEqual(3);
    expect(cordCount(558)).toBe(0);
  });
});

describe('(d) cuts, wood runs and words', () => {
  it('every cut, and the compact join, has FE columns of plain wood on both sides', () => {
    const failures = [];
    for (const x of [...CUTS.map((c) => c.x), COMPACT_JOIN.left, COMPACT_JOIN.right]) {
      for (let c = x - FE; c < x + FE; c += 1) if (!plain(c)) failures.push(`cut ${x}: column ${c} is not plain wood`);
    }
    expect(failures).toEqual([]);
  });

  it('every wood run is plain and maximal', () => {
    const failures = [];
    for (const run of WOOD_RUNS) {
      for (const x of columns(run)) if (!plain(x)) failures.push(`run ${run.x0}: column ${x}`);
      if (plain(run.x0 - 1) || plain(run.x1)) failures.push(`run ${run.x0}..${run.x1} is not maximal`);
    }
    expect(failures).toEqual([]);
  });

  it("each word's lettering lies inside its NAV_WORD extent, and the extent is tight", () => {
    const failures = [];
    for (const [id, hit] of Object.entries(NAV_HIT)) {
      const word = NAV_WORD[id];
      const inked = columns({ x0: hit.x0 + 6, x1: hit.x1 - 6 }).filter(lettered);
      if (inked[0] !== word.x0 || inked[inked.length - 1] !== word.x1 - 1) {
        failures.push(`${id}: lettering spans ${inked[0]}..${inked[inked.length - 1] + 1}, table says ${word.x0}..${word.x1}`);
      }
      // Lettering rows: caps and descenders only, never on the underline rows.
      let top = STRIP_H, bottom = -1;
      for (const x of columns(word)) {
        for (let y = 14; y < 61; y += 1) {
          if (luma(px(strip, x, y)) < 0.45 * ROW_MEDIAN[y]) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
        }
      }
      if (top < WORD_ROWS.top || bottom >= WORD_ROWS.bottom) failures.push(`${id}: lettering rows ${top}..${bottom}`);
      for (const x of columns(word)) {
        for (let y = UNDERLINE_ROW - 1; y < UNDERLINE_ROW + 3; y += 1) {
          if (luma(px(strip, x, y)) < 0.45 * ROW_MEDIAN[y]) failures.push(`${id}: ink on underline row ${y} at ${x}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('CONTROL: the lettering detector fires inside a word and stays quiet on the wood beside it', () => {
    expect(lettered(600)).toBe(true);
    expect(plain(600)).toBe(false);
    expect(lettered(558)).toBe(false);
  });
});

describe('(e) the filler tile', () => {
  const step = (a, b) => {
    let sum = 0;
    for (let y = 0; y < 66; y += 1) {
      const p = px(filler, a, y);
      const q = px(filler, b, y);
      sum += Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]);
    }
    return sum / (66 * 3);
  };
  const inner = Array.from({ length: FILLER_W - 1 }, (_, x) => step(x, x + 1));

  it('repeats seamlessly: its wrap seam is no rougher than the roughest step of its own grain', () => {
    // Measured on the shipped re-cut: wrap 4.34 against the grain's p95 3.61, p99 4.23 and
    // maximum 4.77. The kit's PNG master wraps at 3.30 (its p95 3.24); the q90 encode
    // roughened the one seam, and the grain's own range is the bar it still meets.
    expect(step(FILLER_W - 1, 0)).toBeLessThanOrEqual(Math.max(...inner));
  });

  it('CONTROL: the seam test convicts a tile that wraps onto the wrong column', () => {
    // Every mis-wrap sampled from column 20 to 340 in steps of 20 measured 4.94 or rougher.
    const worst = Math.max(...inner);
    const miswraps = Array.from({ length: 17 }, (_, i) => step(FILLER_W - 1, 20 + 20 * i));
    expect(miswraps.filter((v) => v <= worst)).toEqual([]);
  });

  it("is opaque through the shaft, and its lower edge fades like the painting's own plain wood", () => {
    let min = 255;
    for (let y = 1; y < 63; y += 1) for (let x = 0; x < FILLER_W; x += 1) min = Math.min(min, alpha(filler, x, y));
    expect(min).toBe(255);
    // The anti-aliased edge, rows 63 to 69: row-mean alpha within 20 of the wood runs' (measured at most 17).
    const gaps = [];
    for (let y = 63; y < FILLER_H; y += 1) {
      let tile = 0;
      for (let x = 0; x < FILLER_W; x += 1) tile += alpha(filler, x, y) / FILLER_W;
      let wood = 0;
      for (const x of WOOD_COLUMNS) wood += alpha(strip, x, y) / WOOD_COLUMNS.length;
      gaps.push(Math.abs(tile - wood));
    }
    expect(gaps).toHaveLength(7);
    expect(Math.max(...gaps)).toBeLessThanOrEqual(20);
  });

  it("matches the painting's plain wood row by row (mean colour within 9 per channel; measured 7.46)", () => {
    let worst = 0;
    for (let y = 0; y < 63; y += 1) {
      const wood = [0, 0, 0];
      const tile = [0, 0, 0];
      for (const x of WOOD_COLUMNS) { const p = px(strip, x, y); for (let c = 0; c < 3; c += 1) wood[c] += p[c] / WOOD_COLUMNS.length; }
      for (let x = 0; x < FILLER_W; x += 1) { const p = px(filler, x, y); for (let c = 0; c < 3; c += 1) tile[c] += p[c] / FILLER_W; }
      worst = Math.max(worst, ...wood.map((v, c) => Math.abs(v - tile[c])));
    }
    expect(worst).toBeLessThanOrEqual(9);
  });

  it('has no bright stripe: its column brightness stays within a 6-level band (measured 110.9 to 116.6)', () => {
    const means = Array.from({ length: FILLER_W }, (_, x) => {
      let sum = 0;
      for (let y = 6; y < 60; y += 1) sum += luma(px(filler, x, y));
      return sum / 54;
    });
    expect(Math.max(...means) - Math.min(...means)).toBeLessThanOrEqual(6);
  });

  it('SLOT_TONE re-measures on the shipped pixels to within 0.02, for every cut and the compact join', () => {
    // The painted plain wood's mean luma (rows 6 to 59, across the wood run that holds the
    // cut) over the filler's median luma, in BT.601 luma: the scale under which the chair's
    // table reproduces (worst 0.014; Rec. 709 luma reproduces it within 0.024).
    const luma601 = (p) => 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
    const tile = [];
    for (let x = 0; x < FILLER_W; x += 1) for (let y = 6; y < 60; y += 1) tile.push(luma601(px(filler, x, y)));
    const sorted = [...tile].sort((a, b) => a - b);
    const median = (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
    const cuts = [...CUTS.map((c) => c.x), COMPACT_JOIN.left, COMPACT_JOIN.right];
    expect(Object.keys(SLOT_TONE).map(Number).sort((a, b) => a - b)).toEqual([...new Set(cuts)].sort((a, b) => a - b));
    const failures = [];
    for (const x of cuts) {
      const run = WOOD_RUNS.find((r) => r.x0 <= x && x < r.x1);
      let sum = 0;
      let n = 0;
      for (const col of columns(run)) for (let y = 6; y < 60; y += 1) { sum += luma601(px(strip, col, y)); n += 1; }
      const measured = sum / n / median;
      if (Math.abs(measured - SLOT_TONE[x]) > 0.02) failures.push(`cut ${x}: table ${SLOT_TONE[x]}, measured ${measured.toFixed(3)}`);
    }
    expect(failures).toEqual([]);
    // The table darkens toward the arrowhead the way the painting does.
    expect(SLOT_TONE[1596]).toBeLessThan(SLOT_TONE[1516]);
    expect(SLOT_TONE[1516]).toBeLessThan(SLOT_TONE[558]);
  });
});

describe('(f) the slip field', () => {
  it('carries no engraved line and no rivet, while both rivets are really there', () => {
    let slipMin = 255;
    for (let y = SLIP.y0; y < SLIP.y1; y += 1) for (let x = SLIP.x0; x < SLIP.x1; x += 1) slipMin = Math.min(slipMin, luma(px(strip, x, y)));
    expect(slipMin).toBeGreaterThanOrEqual(51);
    const rivetMins = PLATE_RIVETS.map((r) => {
      let m = 255;
      for (let y = r.y0; y < r.y1; y += 1) for (let x = r.x0; x < r.x1; x += 1) m = Math.min(m, luma(px(strip, x, y)));
      return m < 51;
    });
    expect(rivetMins).toEqual([true, true]);
  });
});

describe('(f2) the hover glow boxes sit on the plates and words, clear of the cord', () => {
  it('the logo plate lies between the nock\'s binding and binding 1, and each word\'s glow clears its bindings', () => {
    const cordRuns = [];
    let start = -1;
    for (let x = 0; x <= 560; x += 1) {
      const heavy = x < 560 && cordCount(x) >= 3;
      if (heavy && start < 0) start = x;
      if (!heavy && start >= 0) { cordRuns.push([start, x]); start = -1; }
    }
    // The nock's binding, the plate's red wax seal (inside the plate) and binding 1 (two runs).
    expect(cordRuns).toEqual([[79, 118], [368, 407], [514, 536], [537, 544]]);
    expect(LOGO_PLATE.x0).toBeGreaterThanOrEqual(118);
    expect(LOGO_PLATE.x1).toBeLessThanOrEqual(BINDINGS[0].x0);
    const failures = [];
    for (const [id, word] of Object.entries(NAV_WORD)) {
      const cord = columns({ x0: word.x0 - GLOW_PAD, x1: word.x1 + GLOW_PAD }).filter((x) => cordCount(x) >= 3);
      if (cord.length) failures.push(`${id}: cord at ${cord.slice(0, 3).join(',')}`);
    }
    expect(failures).toEqual([]);
  });
});

describe('(g) contrast on real wood pixels', () => {
  const INK = lum(hexRgb(legacy.INK));
  const PARCH_100 = lum(hexRgb(legacy.PARCH_100));
  const BRONZE = lum(hexRgb('#a0762a')); // a11y.css --sf-focus, the house ring
  /** Per band row: [INK against the darkest 1% of plain wood, PARCH_100 against the lightest 1%]. */
  const rows = Array.from({ length: BAND_H }, (_, y) => {
    const values = WOOD_COLUMNS.map((x) => lum(px(strip, x, y)));
    return [contrast(INK, percentile(values, 0.01)), contrast(PARCH_100, percentile(values, 0.99))];
  });
  const rowsWhere = (pick) => rows.map((r, y) => (pick(r) ? y : -1)).filter((y) => y >= 0);

  it('INK clears 3:1 on the upper band, rows 4 to 23, and nowhere below row 23', () => {
    expect(legacy.INK).toBe('#1B1408');
    expect(rowsWhere(([ink]) => ink >= 3)).toEqual(Array.from({ length: 20 }, (_, i) => 4 + i));
  });

  it('PARCH_100 clears 3:1 on the lower band, rows 37 to 66, and nowhere above row 37', () => {
    expect(legacy.PARCH_100).toBe('#F4EAD0');
    expect(rowsWhere(([, parch]) => parch >= 3)).toEqual(Array.from({ length: 30 }, (_, i) => 37 + i));
  });

  it('NEGATIVE: on rows 24 to 36 neither clears 3:1, so a one-colour mark cannot span the band; the INK and PARCH_100 pair does (15:1 against each other)', () => {
    expect(rowsWhere(([ink, parch]) => ink < 3 && parch < 3)).toEqual([0, 1, 2, 3, ...Array.from({ length: 13 }, (_, i) => 24 + i), 67]);
    expect(contrast(INK, PARCH_100)).toBeGreaterThan(15);
  });

  it('the underline rows under every word take PARCH_100 at 8:1 or more and refuse INK', () => {
    const failures = [];
    for (const [id, word] of Object.entries(NAV_WORD)) {
      const values = [];
      for (let y = UNDERLINE_ROW; y < UNDERLINE_ROW + 2; y += 1) for (const x of columns(word)) values.push(lum(px(strip, x, y)));
      const parch = contrast(PARCH_100, percentile(values, 0.99));
      const ink = contrast(INK, percentile(values, 0.01));
      if (parch < 8 || ink >= 1.5) failures.push(`${id}: PARCH_100 ${parch.toFixed(2)}, INK ${ink.toFixed(2)}`);
    }
    expect(failures).toEqual([]);
  });

  it('NEGATIVE: the house bronze focus colour does not reach 3:1 against the median wood of the band', () => {
    const values = [];
    for (let y = 0; y < BAND_H; y += 1) for (const x of WOOD_COLUMNS) values.push(lum(px(strip, x, y)));
    expect(contrast(BRONZE, percentile(values, 0.5))).toBeLessThan(3);
  });
});

describe('(h) the feather, which hides on scroll', () => {
  it('below row 73, everything left of the barb hangs inside the feather\'s columns', () => {
    const outside = [];
    for (let y = 74; y < STRIP_H; y += 1) for (let x = FEATHER_X1; x < BINDINGS[7].x0; x += 1) if (alpha(strip, x, y) >= 8) outside.push(`${x},${y}`);
    expect(outside).toEqual([]);
    // Presence control: the feather itself really hangs there, down to the last hang row.
    let feather = 0;
    for (let y = 74; y < STRIP_H; y += 1) for (let x = 0; x < FEATHER_X1; x += 1) if (alpha(strip, x, y) >= 8) feather += 1;
    expect(feather).toBeGreaterThan(20000);
  });

  it('nothing opaque crosses the feather layer\'s right edge below the band, so the butt join there shows no seam', () => {
    let max = 0;
    for (let y = BAND_H; y < STRIP_H; y += 1) for (let x = FEATHER_X1 - 5; x < FEATHER_X1 + 5; x += 1) max = Math.max(max, alpha(strip, x, y));
    expect(max).toBeLessThanOrEqual(12);
  });

  it('the rows the feather shares with the hang are opaque but for the nock\'s end and the feather\'s tip', () => {
    // Both layers draw these rows while the page is at the top (the feather fades in across the
    // first of them and is whole for the rest), so only a translucent pixel could darken, and
    // those sit at the two named ends.
    const EXCEPT = [[0, 80], [455, FEATHER_X1]];
    const translucent = [];
    for (let y = FEATHER_FROM; y < BAND_H; y += 1) {
      for (let x = 0; x < FEATHER_X1; x += 1) {
        if (!EXCEPT.some(([a, b]) => x >= a && x < b) && alpha(strip, x, y) < 250) translucent.push(`${x},${y}`);
      }
    }
    expect(translucent).toEqual([]);
    expect(FEATHER_FROM).toBeGreaterThanOrEqual(SEAM_HANG_FROM);
  });
});
