/**
 * harness/laneBRIDGE/bridgeCrops.mjs — ⭐ THE CORPUS LEG: BEFORE/AFTER crops of a re-sited deck
 * with its kinked approach, and of a drawn ford.
 *
 * ⭐⭐ THE RULE IS WRITTEN BEFORE ANYTHING IS RENDERED (the kit's own law — a crop chosen after
 * looking is a crop chosen to flatter), and it travels beside every box:
 *   DECK  · the deck whose displacement between the unarmed and armed arms is the LARGEST on
 *           the leaf. The largest move is the one a reader can check; a small one is a claim.
 *   FORD  · the FIRST drawn ford in key order on the leaf. No selection on appearance at all.
 * Both boxes are 190 map units, centred on the rule's own point, and the BEFORE box is the same
 * box as the AFTER — a crop pair whose frames differ is two pictures, not a comparison.
 *
 * Tier: `quicklook` (§634.2 — the ITERATION tier). ⚠ NOTED AS SUCH: these are for judging shape,
 * not for an exit leg, and an exit leg owes headless Chrome.
 *
 * Usage: node harness/laneBRIDGE/bridgeCrops.mjs --out=<dir> [--leaf=town,crossing]
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { buildLeaf } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
const { renderFolio } = await import(join(ROOT, 'harness/renderFolio.mjs'));
const { ruleBox, quicklook } = await import(join(ROOT, 'harness/instruments/crops.mjs'));

const outArg = process.argv.find((a) => a.startsWith('--out='));
const OUT = outArg ? outArg.slice(6) : join(ROOT, 'out', 'laneBRIDGE');
const leafArg = process.argv.find((a) => a.startsWith('--leaf='));
const LEAVES = leafArg ? leafArg.slice(7).split(',') : ['town', 'crossing', 'highwater'];
mkdirSync(OUT, { recursive: true });

const ARM = { riverProfile: true, deckLaw: true, fordRegister: true };
const SIZE = 190;

/** re-frame a whole-leaf SVG onto a crop box — the viewBox is the only thing that moves */
function crop(svg, boxStr) {
  return svg.replace(/viewBox="[^"]*"/, `viewBox="${boxStr}"`);
}

const sheet = [];
for (const leaf of LEAVES) {
  const base = buildLeaf(leaf, {}).fabric;
  const arm = buildLeaf(leaf, ARM).fabric;
  const svgBase = renderFolio(base, { lens: 'parchment' }).svg;
  const svgArm = renderFolio(arm, { lens: 'parchment' }).svg;

  // ── THE DECK RULE
  const byKey = new Map(base.bridges.map((b) => [b.key, b]));
  let pick = null, best = -1;
  for (const b of arm.bridges) {
    const o = byKey.get(b.key);
    if (!o) continue;
    const d = Math.hypot(b.x - o.x, b.y - o.y);
    if (d > best) { best = d; pick = b; }
  }
  if (pick) {
    const rb = ruleBox('the deck whose displacement between the unarmed and armed arms is the LARGEST on this leaf',
      { x: pick.x, y: pick.y }, SIZE, { key: pick.key, movedUnits: +best.toFixed(2), sited: !!pick.sited });
    for (const [tag, svg] of [['BEFORE', svgBase], ['AFTER', svgArm]]) {
      const f = join(OUT, `CROP-${leaf}-DECK-${tag}.svg`);
      writeFileSync(f, crop(svg, rb.box));
      const q = quicklook(f, OUT);
      sheet.push(`${leaf} DECK ${tag}  box[${rb.box}]  ${q.verdict}  rule: ${rb.rule}  why: ${JSON.stringify(rb.why)}`);
    }
  } else {
    sheet.push(`${leaf} DECK — RULE UNSATISFIED: no deck present on both arms`);
  }

  // ── THE FORD RULE
  const fords = (arm.fordRegister && arm.fordRegister.fords) || [];
  if (fords.length) {
    const fd = fords[0];
    const rb = ruleBox('the FIRST drawn ford in key order on this leaf', { x: fd.x, y: fd.y }, SIZE,
      { key: fd.key, span: +fd.span.toFixed(2), wet: +(fd.wet || 0).toFixed(2), reSited: !!fd.moved });
    for (const [tag, svg] of [['BEFORE', svgBase], ['AFTER', svgArm]]) {
      const f = join(OUT, `CROP-${leaf}-FORD-${tag}.svg`);
      writeFileSync(f, crop(svg, rb.box));
      const q = quicklook(f, OUT);
      sheet.push(`${leaf} FORD ${tag}  box[${rb.box}]  ${q.verdict}  rule: ${rb.rule}  why: ${JSON.stringify(rb.why)}`);
    }
  } else {
    sheet.push(`${leaf} FORD — RULE UNSATISFIED: no ford is DRAWN on this leaf (every record already carries a deck)`);
  }
}
const sheetPath = join(OUT, 'SHEET.txt');
writeFileSync(sheetPath, `${sheet.join('\n')}\n`);
process.stdout.write(`${sheet.join('\n')}\n\n→ ${sheetPath}\n`);
void readFileSync;
