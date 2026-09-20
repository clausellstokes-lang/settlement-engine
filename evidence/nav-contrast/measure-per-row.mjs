import sharp from 'sharp';
import { NAV_WORD, WORD_ROWS, BAND_H, UNDERLINE_ROW, PLAQUE_ROWS } from './src/components/nav/arrowGeometry.js';
import { legacy } from './src/design/tokens.js';
const { data, info } = await sharp('public/brand/arrow/arrow-strip.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const px = (x, y) => { const i = (y * W + x) * 4; return data.subarray(i, i + 4); };
const luma = (p) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
const ch = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (p) => 0.2126 * ch(p[0]) + 0.7152 * ch(p[1]) + 0.0722 * ch(p[2]);
const K = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const pct = (v, p) => { const s = [...v].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const ROW_MEDIAN = Array.from({ length: BAND_H + 2 }, (_, y) => { const v = []; for (let x = 520; x < 1620; x += 1) v.push(luma(px(x, y))); return pct(v, 0.5); });
const T = 0.55;
const PARCH = lum(hexRgb(legacy.PARCH_100));

console.log('=== 1. IS THE INK ALREADY BLACK? darkest core pixels, per label (8-bit RGB) ===');
for (const [id, span] of Object.entries(NAV_WORD)) {
  const inks = [];
  for (let y = WORD_ROWS.top; y < WORD_ROWS.bottom; y += 1) for (let x = span.x0; x < span.x1; x += 1) {
    const p = px(x, y); if (luma(p) < T * ROW_MEDIAN[y]) inks.push([lum(p), [p[0], p[1], p[2]]]);
  }
  inks.sort((a, b) => a[0] - b[0]);
  const p50 = inks[Math.floor(inks.length / 2)];
  console.log(`  ${id.padEnd(20)} darkest rgb(${inks[0][1].join(',')}) L=${inks[0][0].toFixed(4)} | median rgb(${p50[1].join(',')}) L=${p50[0].toFixed(4)} | headroom to black: ${(p50[0]).toFixed(4)} luminance`);
}
console.log('\n=== 2. PER-ROW ACTUAL RATIO (core ink p50 vs local ground p50), rows 19..49 ===');
console.log('row |' + Object.keys(NAV_WORD).map((i) => i.slice(0, 6).padStart(7)).join(' |'));
for (let y = WORD_ROWS.top; y < WORD_ROWS.bottom; y += 1) {
  const cells = Object.values(NAV_WORD).map((span) => {
    const ink = [], gr = [];
    for (let x = span.x0; x < span.x1; x += 1) { const p = px(x, y); (luma(p) < T * ROW_MEDIAN[y] ? ink : gr).push(lum(p)); }
    if (!ink.length || gr.length < 4) return '     - ';
    const v = K(pct(ink, 0.5), pct(gr, 0.5));
    return (v >= 4.5 ? ' ' : '*') + v.toFixed(2).padStart(6);
  });
  console.log(String(y).padStart(3) + ' |' + cells.join(' |'));
}
console.log('  (* = below AA 4.5:1)');
console.log('\n=== 3. THE PLAQUE ===');
console.log(`  lettering rows [${WORD_ROWS.top}, ${WORD_ROWS.bottom}) ; plaque rows [${UNDERLINE_ROW}, ${UNDERLINE_ROW + PLAQUE_ROWS}) -> overlap: ${Math.max(0, Math.min(WORD_ROWS.bottom, UNDERLINE_ROW + PLAQUE_ROWS) - Math.max(WORD_ROWS.top, UNDERLINE_ROW))} rows`);
for (const [id, span] of Object.entries(NAV_WORD)) {
  const ink = [];
  for (let y = WORD_ROWS.top; y < WORD_ROWS.bottom; y += 1) for (let x = span.x0; x < span.x1; x += 1) { const p = px(x, y); if (luma(p) < T * ROW_MEDIAN[y]) ink.push(lum(p)); }
  console.log(`  ${id.padEnd(20)} ink p50 vs PARCH_100 slip = ${K(pct(ink, 0.5), PARCH).toFixed(2)}:1   (hypothetical: the plaque is NOT behind the glyphs)`);
}
