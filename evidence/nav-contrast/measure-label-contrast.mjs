import sharp from 'sharp';
import { NAV_WORD, WORD_ROWS, BAND_H } from './src/components/nav/arrowGeometry.js';
const { data, info } = await sharp('public/brand/arrow/arrow-strip.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const P = (x, y) => data.subarray((y * W + x) * 4, (y * W + x) * 4 + 4);
const luma = (p) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
const ch = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (p) => 0.2126 * ch(p[0]) + 0.7152 * ch(p[1]) + 0.0722 * ch(p[2]);
const K = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const pct = (v, p) => { const s = [...v].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const ROW_MEDIAN = Array.from({ length: BAND_H + 2 }, (_, y) => { const v = []; for (let x = 520; x < 1620; x += 1) v.push(luma(P(x, y))); return pct(v, 0.5); });
const T = 0.55, MIN_INK = 3;
console.log('ROW-MATCHED instrument: ground pooled ONLY over rows that actually carry >=3 ink pixels.');
console.log('label                | inked rows | ink p50 | ground p50 | NOW    | CEILING (ink=pure black)');
const summary = [];
for (const [id, span] of Object.entries(NAV_WORD)) {
  const isInk = (x, y) => luma(P(x, y)) < T * ROW_MEDIAN[y];
  const inked = [];
  for (let y = WORD_ROWS.top; y < WORD_ROWS.bottom; y += 1) {
    let n = 0; for (let x = span.x0; x < span.x1; x += 1) if (isInk(x, y)) n += 1;
    if (n >= MIN_INK) inked.push(y);
  }
  const ink = [], grd = [];
  for (const y of inked) for (let x = span.x0; x < span.x1; x += 1) (isInk(x, y) ? ink : grd).push(lum(P(x, y)));
  const i = pct(ink, 0.5), g = pct(grd, 0.5);
  summary.push([id, K(i, g), 20 * g + 1]);
  console.log(`${id.padEnd(20)} | ${String(inked[0]).padStart(3)}..${String(inked[inked.length-1]).padEnd(3)} (${String(inked.length).padStart(2)}) | ${i.toFixed(4)}  | ${g.toFixed(4)}     | ${K(i, g).toFixed(2).padStart(6)} | ${(20 * g + 1).toFixed(2)}`);
}
const ceils = summary.map((s) => s[2]);
console.log(`\nVERDICT: highest ceiling across the six = ${Math.max(...ceils).toFixed(2)}:1 ; AA bar = 4.5:1 ; labels whose ceiling clears AA = ${ceils.filter((c) => c >= 4.5).length}/6`);
