#!/usr/bin/env node
/**
 * harness/laneDRESS1/precisionControl.mjs — ⛔⛔ **THE BYTE CURE'S OWN CONTROL.**
 *
 * The dress writes coordinates at ONE decimal (`PAGE_QUANTUM_DECIMALS`) because the metropolis
 * measured **839,019 B against its signed 830,000 B ceiling** at two decimals. The claim that
 * accompanies that cure is *"no drawing change"* — and "invisible" is a claim about PIXELS, so it
 * is settled with pixels, not with arithmetic about page scale.
 *
 * The control renders the SAME leaf at both precisions, rasterises both at the instrument's own
 * 2,200 px, and reports the per-channel maximum and mean absolute difference. ⭐ AND IT CARRIES A
 * LIVENESS PLANT: a THIRD render at a deliberately coarse quantum (whole units) must move the
 * pixels, or the comparator is dead and its zero means nothing.
 *
 * Usage: node harness/laneDRESS1/precisionControl.mjs [--leaf=town] [--px=2200]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { dressLeaf } from './renderPage.mjs';
import { shootBounded } from '../instruments/crops.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaf = arg('leaf', 'town');
const px = Number(arg('px', '2200'));
const dir = join(tmpdir(), 'dress1-precision');
mkdirSync(dir, { recursive: true });

// ⛔ **THE FIRST SPELLING OF THIS CONTROL WAS A NO-OP AND SAID SO.** It re-rounded the already
//   1-decimal OUTPUT to 2 decimals and reported `707981 → 707981, −0 B`. A control that produces
//   the same artifact twice measures nothing. Each arm now RENDERS AT ITS OWN PRECISION.
const variants = [
  ['q1', 1, 'the shipped page quantum (1 decimal)'],
  ['q2', 2, 'two decimals — what the first render wrote, and what busted the ceiling'],
  ['q0', 0, 'whole units — the LIVENESS PLANT; it MUST move pixels'],
].map(([k, d, why]) => [k, dressLeaf(leaf, 'parchment', { decimals: d }).svg, why]);

const shots = [];
for (const [k, svg, why] of variants) {
  const p = join(dir, `${leaf}-${k}.svg`);
  writeFileSync(p, svg);
  const png = join(dir, `${leaf}-${k}.png`);
  const s = shootBounded(p, png, px, 40000, 90000);
  shots.push({ k, why, bytes: Buffer.byteLength(svg, 'utf8'), png, shot: s });
  console.log(`${k}  svg ${String(Buffer.byteLength(svg, 'utf8')).padStart(7)} B  ${s.verdict}  — ${why}`);
}

const sharp = (await import('sharp')).default;
async function raw(p) {
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  return { data, info };
}
async function diff(a, b) {
  const A = await raw(a); const B = await raw(b);
  if (A.data.length !== B.data.length) return { max: 255, mean: 255, note: 'different raster sizes' };
  let max = 0; let sum = 0;
  for (let i = 0; i < A.data.length; i++) {
    const d = Math.abs(A.data[i] - B.data[i]);
    if (d > max) max = d;
    sum += d;
  }
  return { max, mean: sum / A.data.length, px: A.info.width * A.info.height };
}

const q1 = shots[0].png; const q2 = shots[1].png; const q0 = shots[2].png;
const cure = await diff(q1, q2);
const plant = await diff(q1, q0);
console.log(`\nCURE   q1 vs q2 : maxΔ ${cure.max}  meanΔ ${cure.mean.toFixed(5)}  over ${cure.px} px`);
console.log(`PLANT  q1 vs q0 : maxΔ ${plant.max}  meanΔ ${plant.mean.toFixed(5)}   (must be > 0)`);
const bytesSaved = shots[1].bytes - shots[0].bytes;
console.log(`BYTES  ${shots[1].bytes} → ${shots[0].bytes}  (−${bytesSaved}, −${(100 * bytesSaved / shots[1].bytes).toFixed(2)} %)`);
const live = plant.max > cure.max;
console.log(live
  ? `PRECISION_CONTROL LIVE — the comparator moves on a coarser quantum (${plant.max} > ${cure.max})`
  : '⛔ PRECISION_CONTROL DEAD — the plant did not move the pixels; this zero proves nothing');
process.exitCode = live ? 0 : 1;
