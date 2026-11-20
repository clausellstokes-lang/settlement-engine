#!/usr/bin/env node
/**
 * door/tools/visitor-plan.mjs — SAME-2 brief D part 3: writes THE VISITOR'S PLAN for
 * `node scripts/sameness-census.mjs --measure --plan=<file>`: 150 a size, seeds `visitor-<size>-<i>`, each config the birth
 * of a visitor who touches no setting as `measure-lit.mjs :: visitorJob` builds it at ce3a4e9f6 (DEFAULT_CONFIG and the
 * size, the four toggle bags empty, `_randomizePriorities: true`); the renderer adds the store's content runtime at rest.
 * Usage: node docs/chair/2026-11-20/content/same/door/tools/visitor-plan.mjs <out.json> [n=150]
 */
import { writeFileSync } from 'node:fs';
import { DEFAULT_CONFIG } from '../../../../../../../src/store/configSlice.js';
import { SIZES } from '../../../../../../../scripts/sameness-census.mjs';

const [out, n = '150'] = process.argv.slice(2);
const plan = SIZES.flatMap((size) => Array.from({ length: Number(n) }, (_, i) => ({
  seed: `visitor-${size}-${i}`, size,
  config: { ...DEFAULT_CONFIG, settType: size, _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {}, _randomizePriorities: true },
})));
writeFileSync(out, `${JSON.stringify(plan)}\n`);
console.log(`visitor plan: ${plan.length} rows -> ${out}`);
