/**
 * harness/laneREG5/quayCrops.mjs — the QUAY JUDGING CROPS (chair addendum §636.2).
 *
 * ⭐ THE BOX IS CHOSEN BY A RULE WRITTEN BEFORE ANYTHING WAS RENDERED (the kit's `ruleBox`,
 * REG-2/REG-4 precedent): **the crop is centred on the quay's own anchor and framed at 5× the
 * leaf's plot frontage** — wide enough to hold the shed, its apron and the water it answers to,
 * and chosen without looking at any of the three arms.
 *
 * Three arms from the SAME box, so a reader compares a picture with a picture:
 *   BASE   unarmed — the quay as the seal draws it
 *   QUAY   `--quay` — the geometric exemption alone
 *   VQUAY  `--quay --vquay` — the exemption plus the V-QUAY dress
 *
 * Usage: node harness/laneREG5/quayCrops.mjs [--leaf=fjord] [--out=<dir>]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
const { renderFolio } = await import(join(ROOT, 'harness/renderFolio.mjs'));
const { ruleBox, quicklook } = await import(join(ROOT, 'harness/instruments/crops.mjs'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const OUT = arg('out', join(ROOT, 'out', 'reg5-quay-crops'));
mkdirSync(OUT, { recursive: true });

const ARMS = [
  ['BASE', {}],
  ['QUAY', { waterfrontExemption: true }],
  ['VQUAY', { waterfrontExemption: true, quayRegister: true }],
];

for (const leafKey of (arg('leaf', 'fjord,town,city')).split(',')) {
  const spec = CORPUS.find((c) => c.key === leafKey);
  if (!spec) continue;
  // the RULE, applied to the armed build so a quay the base erased is still framed
  const probe = buildOne(spec, { waterfrontExemption: true }).fabric;
  const quay = (probe.landmarks || []).find((lm) => lm && lm.archetype === 'port');
  if (!quay) { process.stdout.write(`   ${leafKey}: no quay — skipped\n`); continue; }
  const rb = ruleBox('the quay\'s own anchor, framed at 5× the leaf\'s plot frontage',
    { x: quay.x, y: quay.y }, Math.max(60, probe.meta.plotFrontage * 5),
    { anchorKey: quay.anchorKey, frontage: probe.meta.plotFrontage });
  for (const [tag, opts] of ARMS) {
    const built = buildOne(spec, opts);
    const svg = renderFolio(built.fabric, built.model || built.m || {}, { lens: 'parchment' }).svg
      || renderFolio(built.fabric, built.model, { lens: 'parchment' });
    const body = typeof svg === 'string' ? svg : String(svg);
    const cropped = body.replace(/viewBox="[^"]*"/, `viewBox="${rb.box}"`);
    const f = join(OUT, `${leafKey}-${tag}.svg`);
    writeFileSync(f, cropped);
    const ql = quicklook(f, OUT);
    process.stdout.write(`   ${leafKey.padEnd(8)} ${tag.padEnd(6)} box ${rb.box.padEnd(20)} ${ql.verdict}\n`);
  }
  process.stdout.write(`   ↳ RULE: ${rb.rule} (${JSON.stringify(rb.why)})\n`);
}
