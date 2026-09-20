import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { NAV_WORD, WORD_ROWS, BAND_H, UNDERLINE_ROW, PLAQUE_ROWS, PLAQUE_PAD } from './src/components/nav/arrowGeometry.js';
import { legacy } from './src/design/tokens.js';

const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/nav-contrast';
mkdirSync(OUT, { recursive: true });
const { data, info } = await sharp('public/brand/arrow/arrow-strip.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const at = (d, x, y) => (y * W + x) * 4;
const luma = (p) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
const ch = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lumOf = (r, g, b) => 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
const K = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const pct = (v, p) => { const s = [...v].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const ROW_MEDIAN = Array.from({ length: BAND_H + 2 }, (_, y) => { const v = []; for (let x = 520; x < 1620; x += 1) v.push(luma(data.subarray(at(data, x, y), at(data, x, y) + 4))); return pct(v, 0.5); });
const T = 0.55;
const PARCH = hexRgb(legacy.PARCH_100), INKC = hexRgb(legacy.INK);
const P = (x, y) => data.subarray(at(data, x, y), at(data, x, y) + 4);

const ROW0 = 14, ROW1 = 64, PAD = 12;
const variants = ['as-painted', 'ink-to-black', 'parch-slip'];
const table = [];

for (const [id, span] of Object.entries(NAV_WORD)) {
  const x0 = span.x0 - PAD, x1 = span.x1 + PAD, w = x1 - x0, h = ROW1 - ROW0;
  const isInk = (x, y) => luma(P(x, y)) < T * ROW_MEDIAN[y];
  // local ground per row inside the word span
  const groundRow = Array.from({ length: BAND_H + 2 }, (_, y) => {
    if (y < ROW0 || y >= ROW1) return null;
    const g = []; for (let x = span.x0; x < span.x1; x += 1) if (!isInk(x, y)) g.push(luma(P(x, y)));
    return g.length ? pct(g, 0.5) : null;
  });
  const bufs = {};
  for (const v of variants) {
    const out = Buffer.alloc(w * h * 4);
    for (let y = ROW0; y < ROW1; y += 1) for (let x = x0; x < x1; x += 1) {
      const p = P(x, y); const o = ((y - ROW0) * w + (x - x0)) * 4;
      let [r, g, b, a] = [p[0], p[1], p[2], p[3]];
      const inWord = x >= span.x0 - PLAQUE_PAD && x < span.x1 + PLAQUE_PAD;
      const gr = groundRow[y];
      const cover = gr && inWord ? Math.max(0, Math.min(1, (gr - luma(p)) / Math.max(1, gr * 0.85))) : 0;
      if (v === 'ink-to-black' && inWord && isInk(x, y)) { r = Math.round(r * (1 - cover)); g = Math.round(g * (1 - cover)); b = Math.round(b * (1 - cover)); }
      if (v === 'parch-slip' && inWord && y >= 17 && y < 52) {
        r = Math.round(PARCH[0] * (1 - cover) + INKC[0] * cover);
        g = Math.round(PARCH[1] * (1 - cover) + INKC[1] * cover);
        b = Math.round(PARCH[2] * (1 - cover) + INKC[2] * cover);
        a = 255;
      }
      out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = a;
    }
    bufs[v] = out;
    // measure this variant on its own pixels
    const ink = [], grd = [];
    for (let y = WORD_ROWS.top; y < WORD_ROWS.bottom; y += 1) for (let x = span.x0; x < span.x1; x += 1) {
      const o = ((y - ROW0) * w + (x - x0)) * 4;
      const L = lumOf(out[o], out[o + 1], out[o + 2]);
      (isInk(x, y) ? ink : grd).push(L);
    }
    table.push([id, v, K(pct(ink, 0.5), pct(grd, 0.5))]);
    for (const [scale, tag] of [[2, '2x'], [6, '6x']]) {
      await sharp(out, { raw: { width: w, height: h, channels: 4 } })
        .resize(w * scale, h * scale, { kernel: 'nearest' })
        .png().toFile(`${OUT}/${id}__${v}__${tag}.png`);
    }
  }
  // side-by-side contact strip at 6x
  const strip = Buffer.alloc(w * 3 * h * 4);
  variants.forEach((v, i) => {
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
      const s = (y * w + x) * 4, d = (y * w * 3 + i * w + x) * 4;
      for (let c = 0; c < 4; c += 1) strip[d + c] = bufs[v][s + c];
    }
  });
  await sharp(strip, { raw: { width: w * 3, height: h, channels: 4 } })
    .resize(w * 3 * 6, h * 6, { kernel: 'nearest' }).png().toFile(`${OUT}/${id}__COMPARE__6x.png`);
}
console.log('label                | as-painted | ink->black | parch-slip');
for (const id of Object.keys(NAV_WORD)) {
  const r = (v) => table.find((t) => t[0] === id && t[1] === v)[2].toFixed(2).padStart(10);
  console.log(`${id.padEnd(20)} | ${r('as-painted')} | ${r('ink-to-black')} | ${r('parch-slip')}`);
}
console.log(`\ncrops -> ${OUT}`);
