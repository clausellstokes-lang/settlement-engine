#!/usr/bin/env node
/**
 * harness/laneREGF0/legendAgreement.mjs — ⭐ REG-F0 · **THE DRESS PAGE'S KEY vs ITS INK.**
 *
 * A byproduct of the sweep, handed on rather than kept: `partitionDress.js` exports `DRESS_LEGEND`,
 * a 46-row roster that teaches one mark per group. L-REG-34's legend-agreement census has two
 * halves — *every legend row locatable* and *every glyph taught* — and the sweep already holds the
 * measured emitting set, so both halves cost one comparison.
 *
 * ⚠ IT IS A MEASUREMENT, NOT A GATE. Whether a row teaching an undrawn mark is a defect or a
 * correctly-scoped forward declaration is DRESS-1's ruling and REG-9's, not this lane's. This
 * reports which rows they are.
 *
 * ⚠ THE LENS CAVEAT IS LOAD-BEARING: `dress-accessible` emits only on the ACCESSIBLE lens, so on a
 * parchment sweep it is lens-scoped absence, not an unteachable row. It is separated out below
 * rather than counted with the others — a census that lumped them would over-report by one.
 *
 * Usage: REG_FABRIC_OPTS='<arms>' node harness/laneREGF0/legendAgreement.mjs [--lens=parchment]
 */
import { CORPUS } from '../exemplars.mjs';
import { DRESS_LEGEND } from '../../src/domain/townMap/fabric/partitionDress.js';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { scanGroups } from './svgGroups.mjs';
import { assertArm } from './armGuard.mjs';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const lens = arg('lens', 'parchment');
assertArm(true);

const emitting = new Set();
for (const spec of CORPUS) {
  for (const g of scanGroups(dressLeaf(spec.key, lens).svg).groups) if (g.marks > 0) emitting.add(g.path);
  process.stdout.write('.');
}
process.stdout.write('\n');

const rows = DRESS_LEGEND.map((r) => r.group);
const LENS_SCOPED = new Set(['dress-accessible']);
const taughtButDark = rows.filter((g) => !emitting.has(g) && !LENS_SCOPED.has(g));
const lensScoped = rows.filter((g) => !emitting.has(g) && LENS_SCOPED.has(g));
const drawnButUntaught = [...emitting].filter((g) => g.startsWith('dress-') && !rows.includes(g));

console.log(`\n══ L-REG-34 · LEGEND AGREEMENT on the ${lens} lens, ${CORPUS.length} leaves ══`);
console.log(`  DRESS_LEGEND rows            : ${rows.length}`);
console.log(`  groups emitting on ≥1 leaf   : ${[...emitting].filter((g) => g.startsWith('dress-')).length}`);
console.log(`  ⭐ every glyph taught?        : ${drawnButUntaught.length === 0 ? 'YES — 0 drawn groups lack a legend row' : '⛔ ' + drawnButUntaught.join(', ')}`);
console.log(`  ⚠ rows teaching an UNDRAWN mark: ${taughtButDark.length}${taughtButDark.length ? ' — ' + taughtButDark.join(', ') : ''}`);
console.log(`  (lens-scoped, not counted)   : ${lensScoped.join(', ') || '(none)'}`);
console.log(`\n  → half one (every glyph taught) is GREEN; half two owes a ruling on ${taughtButDark.length} row(s).`);
