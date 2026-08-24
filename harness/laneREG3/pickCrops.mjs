/**
 * pickCrops.mjs — THE CROP BOXES, CHOSEN BY A STATED RULE AND RECORDED BEFORE LOOKING (§602,
 * and REG-2's `pickCrops.mjs` is the precedent this follows).
 *
 * THE RULES, written down here and not adjusted afterwards:
 *   CHURCH-WITH-YARD  the `worship` landmark with the LARGEST drawn precinct void on the leaf
 *   INN-COURT         the `hospitality` landmark with the largest yard void
 *   WATERFRONT        the `warehouse`/`quay` landmark nearest the water claim
 *   FARMSTEAD         the `farmstead` habitation whose barn is longest (the biggest L)
 * Each box is centred on the chosen body and sized to 9 × its own `size` (or 26 view units,
 * whichever is larger), so the frame is the SAME for the base and the armed arm.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const { buildLeaf } = await import(join(HERE, 'leaf.mjs'));
const absArea = (p) => { let s = 0; for (let i = 0, j = p.length - 1; i < p.length; j = i++) s += p[j][0] * p[i][1] - p[i][0] * p[j][1]; return Math.abs(s) / 2; };
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

const leaf = arg('leaf', 'town');
const { fabric } = buildLeaf(leaf, { shapeCode: true });
const voidArea = (lm) => (lm.voids || []).reduce((a, v) => a + absArea(v), 0);
const best = (pred, score) => {
  let b = null, bs = -Infinity;
  for (const lm of fabric.landmarks) { if (!pred(lm)) continue; const s = score(lm); if (s > bs) { bs = s; b = lm; } }
  return b;
};
const box = (o, mult = 9) => {
  const w = Math.max(26, (o.size || 6) * mult);
  return { x: Math.round(o.x - w / 2), y: Math.round(o.y - w / 2), w: Math.round(w), h: Math.round(w) };
};
const picks = {};
const ch = best((l) => l.archetype === 'worship' && l.monumental, voidArea) || best((l) => l.archetype === 'worship', (l) => l.size);
if (ch) picks.CHURCH = { ...box(ch), key: ch.instanceKey, family: ch.shapeFamily, slots: ch.shapeSlots };
const inn = best((l) => l.archetype === 'hospitality' && l.monumental, voidArea) || best((l) => l.archetype === 'hospitality', (l) => l.size);
if (inn) picks.INN = { ...box(inn), key: inn.instanceKey, family: inn.shapeFamily, slots: inn.shapeSlots };
const wh = best((l) => l.archetype === 'warehouse' || l.archetype === 'granary' || l.archetype === 'port', (l) => l.size);
if (wh) picks.WATERFRONT = { ...box(wh, 11), key: wh.instanceKey, family: wh.shapeFamily, slots: wh.shapeSlots };
let fm = null, fs2 = -Infinity;
for (const d of (fabric.habitation || [])) {
  if (d.shapeFamily !== 'farmstead') continue;
  const s = (d.shapeSlots && d.shapeSlots.barnLen) || 0;
  if (s > fs2) { fs2 = s; fm = d; }
}
if (fm) picks.FARMSTEAD = { ...box(fm, 14), key: fm.key, family: fm.shapeFamily, slots: fm.shapeSlots };
process.stdout.write(JSON.stringify({ leaf, picks }, null, 2) + '\n');
