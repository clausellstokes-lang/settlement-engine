/**
 * i16-perrole.mjs — REG-D · **THE PER-ROLE PLANTED CONTROL PA.5 REQUIRES.**
 *
 * PA.5: *"Every re-record on partition SVG is GATED on per-role planted controls (each moving
 * exactly one role) before any baseline is believed — the vacuous-mask class pre-killed."*
 * So each decline group is removed from the tip plate ON ITS OWN and the plate re-shot. Three
 * things fall out of one run and none of them can be got from an aggregate:
 *   · every group MUST move the raster, or it is drawn and unseeable (this arc's third-sighted class);
 *   · the deltas must be DISJOINT enough to sum near the aggregate, or two groups are painting
 *     the same pixels — the ink-on-ink class;
 *   · a group whose removal moves NOTHING is a mask that was never live.
 *
 * Usage: node i16-perrole.mjs --tip=<file.svg> [--px=1400]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPNG, lumAt } from './lib/png.mjs';
import { shoot, DECLINE_GROUPS, DELTA_FLOOR } from './i16-decline-visibility.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const tip = arg('tip', '');
const px = Number(arg('px', '1400'));
const dir = join(HERE, 'out', 'i16-perrole');
mkdirSync(dir, { recursive: true });
const src = readFileSync(tip, 'utf8');
const key = basename(tip).replace(/\.svg$/, '');

shoot(tip, join(dir, `${key}-full.png`), px);
const FULL = readPNG(join(dir, `${key}-full.png`));
const pagePx = FULL.w * FULL.h;
console.log(`plate ${key} at ${FULL.w}x${FULL.h} = ${pagePx} px`);
let sum8 = 0;
for (const gid of DECLINE_GROUPS) {
  const re = new RegExp(`<g id="${gid}">[\\s\\S]*?</g>`);
  if (!re.test(src)) { console.log(`${gid.padEnd(22)} NOT EMITTED on this plate`); continue; }
  const cut = src.replace(re, '');
  const f = join(dir, `${key}-no-${gid}.svg`);
  writeFileSync(f, cut);
  shoot(f, join(dir, `${key}-no-${gid}.png`), px);
  const B = readPNG(join(dir, `${key}-no-${gid}.png`));
  let n = 0; let n8 = 0; let s = 0; let mx = 0;
  for (let i = 0; i < pagePx; i++) {
    const d = Math.abs(lumAt(FULL, i) - lumAt(B, i));
    if (d > 0) n++;
    if (d >= DELTA_FLOOR) n8++;
    s += d; if (d > mx) mx = d;
  }
  sum8 += n8;
  console.log(`${gid.padEnd(22)} moves ${(100 * n / pagePx).toFixed(4)} % of the plate,`
    + ` perceptibly ${(100 * n8 / pagePx).toFixed(4)} %, meanΔ ${(s / pagePx).toFixed(4)}, maxΔ ${mx.toFixed(1)}`
    + `  ${n8 > 0 ? 'LIVE' : '⛔ DEAD — drawn and unseeable'}`);
}
console.log(`Σ per-role perceptible = ${(100 * sum8 / pagePx).toFixed(4)} % of the plate`);
