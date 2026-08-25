#!/usr/bin/env node
/**
 * harness/laneDRESS1/wallAll.mjs — ⛔ **PA.10's WATCH ROW, RE-MEASURED ON THE NEW INK.**
 *
 * PA.10 puts the `wall:all` row in DRESS-1's exits and orders it re-measured FIRST, *"because
 * this wave re-inks the whole circuit"*. `wall:all` is arm 2 of instrument **i5** (ROLE-PAIR
 * CONTRAST): the WCAG contrast ratio between the mean measured sRGB of the WALL role and the mean
 * of the whole plate, floored at **3.00** (`i5-role-contrast.mjs:57`, a chair's number, vetoable).
 *
 * ⭐⭐ **THE ROLES ARE KNOWN A PRIORI HERE, WHICH IS THE ONE HONEST ADVANTAGE OF MEASURING YOUR OWN
 * INK.** i5 infers the wall population with `lib/classify.mjs`, and REG-4 already paid for that
 * inference being blind to a new `<g id>` (*"the classifier was never told"*, J-REG4-7). This
 * measures the SAME QUANTITY with the wall population taken from the dress's own group roster, so
 * there is no classifier to be stale. i5's method is otherwise reproduced exactly: the MASK comes
 * from the SVG, the COLOUR comes from the PNG.
 *
 * ⛔⛔ **AND IT CARRIES A CORRECTION TO THE FIGURE PA.10 QUOTES.** PA.10 reads *"the headroom was
 * 4.27 against a 3.00 floor"*. 4.27 is not headroom: it is the town's ARMED MEASURED RATIO
 * (`regI1-i5contrast.log`: town base 7.7536 → armed **4.2681**; CARINST city 4.2663). The
 * headroom over 3.00 is **1.27**, which is what `laneREGI1-receipt.md` §2.2 itself says
 * (*"headroom 4.75 → 1.27"*). The quoted figure overstates the remaining room by **3.4×**.
 *
 * Usage: node harness/laneDRESS1/wallAll.mjs [--leaves=town,city] [--px=1100] [--json=<path>]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { dressLeaf } from './renderPage.mjs';
import { shootBounded } from '../instruments/crops.mjs';
import { luminance } from '../../src/domain/townMap/fabric/folioLenses.js';

export const WALL_ALL_FLOOR = 3.00;
/** The dress groups that ARE the circuit — i5's `wall` role, named rather than inferred. */
export const WALL_GROUPS = Object.freeze(['dress-band', 'dress-coursing', 'dress-comb',
  'dress-towers', 'dress-gates', 'dress-ditch', 'dress-stairs', 'dress-relict']);

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const leaves = (arg('leaves', 'town,city,metropolis,polycentric,year-100')).split(',');
const px = Number(arg('px', '1100'));
const dir = join(tmpdir(), 'dress1-wallall');
mkdirSync(dir, { recursive: true });

/** Replace every group NOT in `keep` with nothing, and paint the kept ones solid black on white. */
function maskOf(svg, keep) {
  const head = svg.slice(0, svg.indexOf('>') + 1);
  const groups = svg.match(/<g id="[^"]+">[\s\S]*?<\/g>/g) || [];
  const kept = groups.filter((g) => keep.includes((g.match(/^<g id="([^"]+)"/) || [])[1]))
    .map((g) => g.replace(/fill="[^"]*"/g, 'fill="#000000"').replace(/stroke="[^"]*"/g, 'stroke="#000000"'));
  const vb = (head.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 1000 1000';
  const [x, y, w, h] = vb.split(/\s+/).map(Number);
  return `${head}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff"/>${kept.join('')}</svg>`;
}

const sharp = (await import('sharp')).default;
async function rgb(p) {
  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const hex = (r, g, b) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const wcag = (a, b) => {
  const la = luminance(a); const lb = luminance(b);
  return la > lb ? (la + 0.05) / (lb + 0.05) : (lb + 0.05) / (la + 0.05);
};

const rows = [];
for (const key of leaves) {
  const r = dressLeaf(key, 'parchment');
  const svgP = join(dir, `${key}.svg`);
  const maskP = join(dir, `${key}-wallmask.svg`);
  writeFileSync(svgP, r.svg);
  writeFileSync(maskP, maskOf(r.svg, WALL_GROUPS));
  const a = shootBounded(svgP, join(dir, `${key}.png`), px, 20000, 90000);
  const b = shootBounded(maskP, join(dir, `${key}-wallmask.png`), px, 4000, 90000);
  if (!a.ok || !b.ok) { console.log(`${key.padEnd(12)} ⛔ SHOOT FAILED  ${a.verdict} | ${b.verdict}`); continue; }
  const plate = await rgb(join(dir, `${key}.png`));
  const mask = await rgb(join(dir, `${key}-wallmask.png`));
  let wN = 0; const wS = [0, 0, 0];
  let aN = 0; const aS = [0, 0, 0];
  const n = Math.min(plate.w * plate.h, mask.w * mask.h);
  for (let i = 0; i < n; i++) {
    const pi = i * plate.ch; const mi = i * mask.ch;
    aN++; for (let c = 0; c < 3; c++) aS[c] += plate.data[pi + c];
    // a mask pixel is WALL when it is materially darker than the white ground
    if (mask.data[mi] < 128) { wN++; for (let c = 0; c < 3; c++) wS[c] += plate.data[pi + c]; }
  }
  if (!wN) {
    console.log(`${key.padEnd(12)} n/a — this leaf draws no circuit (unwalled)`);
    rows.push({ key, wallAll: null, note: 'unwalled' });
    continue;
  }
  const wHex = hex(wS[0] / wN, wS[1] / wN, wS[2] / wN);
  const aHex = hex(aS[0] / aN, aS[1] / aN, aS[2] / aN);
  const ratio = wcag(wHex, aHex);
  const pass = ratio >= WALL_ALL_FLOOR;
  rows.push({
    key, wallAll: Math.round(ratio * 1e4) / 1e4, floor: WALL_ALL_FLOOR,
    headroom: Math.round((ratio - WALL_ALL_FLOOR) * 1e4) / 1e4,
    wallPx: wN, allPx: aN, wallRGB: wHex, allRGB: aHex, pass,
  });
  console.log(`${key.padEnd(12)} wall:all ${ratio.toFixed(4)}  floor ${WALL_ALL_FLOOR.toFixed(2)}`
    + `  headroom ${(ratio - WALL_ALL_FLOOR).toFixed(4)}  ${pass ? 'PASS' : '⛔ FAIL'}`
    + `   wall ${wHex} (${wN} px) vs all ${aHex} (${aN} px)`);
}

const red = rows.filter((r) => r.wallAll != null && !r.pass).length;
console.log(`\nWALL_ALL ${red ? `⛔ ${red} leaf/leaves BELOW the ${WALL_ALL_FLOOR} floor` : `all measured leaves clear the ${WALL_ALL_FLOOR} floor`}`);
console.log('⚠ PA.10 CORRECTION: "headroom 4.27" is the town\'s ARMED MEASURED RATIO (4.2681), not a'
  + ' margin. Headroom over 3.00 was 1.27 — laneREGI1-receipt §2.2\'s own words. The quoted figure'
  + ' overstates the remaining room by 3.4×.');
const j = arg('json', '');
if (j) writeFileSync(j, JSON.stringify(rows, null, 1));
process.exitCode = red ? 1 : 0;
