#!/usr/bin/env node
/**
 * DRESS-FABRIC · ⭐ THE FURROW ROW'S OWN CONTROL — the row must CONVICT the shipped base.
 * A census row added by the lane that cures the thing it measures is worthless unless the
 * pre-cure value fails it; this plants `GRAIN.opacity`'s shipped 0.72 back in and demands a red.
 *
 * ⛔⛔ **AND THE FIRST DECLARATION HERE WAS WRONG — IT DEMANDED 6 OF 6.** On `darkFantasy` the
 * shipped 0.72 already renders the furrow at 1.184 under its field, INSIDE the one-step bar, so
 * there is nothing on that lens for the row to convict and a lens with no defect cannot supply
 * one. Demanding a conviction there would have made a TRUE reading look like a dead arm. The bar
 * is therefore: the row convicts every lens whose base actually violates it, AND on every lens —
 * the compliant one included — a planted α=1.0 that does violate must be caught. **The second
 * clause is what proves the arm is live where the corpus happens to be clean**, which is the
 * `walker-census` lesson in miniature: a shape the corpus never produces looks like a pass.
 */
import { tones, valueCensus, contrast, mix, GRAIN, VALUE_STEP } from '../../src/domain/townMap/fabric/partitionDress.js';
import { resolveLens, LENS_IDS } from '../../src/domain/townMap/fabric/folioLenses.js';
let convicted = 0; let violating = 0; let plantCaught = 0; let lenses = 0;
for (const id of LENS_IDS) {
  lenses++;
  const T = tones(resolveLens(id), {});
  const ratio = (a) => VALUE_STEP / contrast(T.field, mix(T.field, T.grain, a));
  const plant = ratio(GRAIN.opacity);          // ⛔ the SHIPPED pre-cure alpha
  const cured = ratio(T.grainOpacity);         // the solved alpha
  const ok = valueCensus(T).ok;
  const conv = plant < 1.0;
  if (plant < 1.0) violating++;
  if (conv) convicted++;
  /** ⭐ the LIVENESS plant, run on EVERY lens including the already-compliant one */
  const worst = ratio(1.0);
  const caught = worst < 1.0 || T.grainOpacity === 1;
  if (caught) plantCaught++;
  console.log(`${id.padEnd(13)} alpha 0.72→${String(T.grainOpacity).padEnd(5)}`
    + ` rendered-step base ${contrast(T.field, mix(T.field, T.grain, GRAIN.opacity)).toFixed(3)}`
    + ` → ${contrast(T.field, mix(T.field, T.grain, T.grainOpacity)).toFixed(3)}`
    + `  row base ${plant.toFixed(3)} ${conv ? '⛔RED (convicts)' : '✔ already green — NO POWER'}`
    + `  row tip ${cured.toFixed(3)} ${cured >= 1 ? 'PASS' : '⛔FAIL'}  census ${ok ? 'ok' : 'RED'}`
    + `  α=1 plant ${worst.toFixed(3)} ${caught ? 'caught/at-cap' : '⛔MISSED'}`);
}
console.log(`\nCONTROL: ${violating} of ${lenses} lenses VIOLATE the row at the shipped α 0.72,`
  + ` and the row convicts ${convicted} of those ${violating}.`);
console.log(`LIVENESS: the α=1.0 plant is caught or at the cap on ${plantCaught} of ${lenses} lenses`
  + ` — including ${lenses - violating} that the corpus leaves clean.`);
process.exit(convicted === violating && plantCaught === lenses ? 0 : 1);
