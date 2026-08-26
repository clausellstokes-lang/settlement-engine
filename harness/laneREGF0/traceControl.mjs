#!/usr/bin/env node
/**
 * harness/laneREGF0/traceControl.mjs — ⛔ THE CONTROL THE ATTRIBUTION RUN IS GATED ON.
 *
 * A traced twin that draws a DIFFERENT page attributes the wrong drawing (§714.1's own lesson,
 * where only a control caught it). This asserts the twin is BYTE-IDENTICAL to `renderFolio` on
 * every leaf, on both arms — and it plants a NEGATIVE control (a deliberately corrupted twin)
 * so a comparison that cannot fail is not mistaken for a pass.
 */
import { CORPUS } from '../exemplars.mjs';
import { renderFolio } from '../renderFolio.mjs';
import { buildTrace } from './makeTrace.mjs';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { FABRIC_ARMS, assertArm, ARM_ENV } from './armGuard.mjs';
import { createHash } from 'node:crypto';

/** ⭐ the twin is REGENERATED, never read from disk stale — see makeTrace.mjs. */
buildTrace();
const { renderFolio: traced, __T, __resetTrace } = await import('./folioTrace.mjs');

const sha = (s) => createHash('sha1').update(s).digest('hex').slice(0, 12);
const armed = !process.argv.includes('--dormant');

const ARM_STATE = assertArm(armed);
console.log(`ARM GUARD · ${ARM_STATE.armed ? 'FULL (probe: marketRegister live, ' + ARM_STATE.parcels + ' parcels on town)' : 'DORMANT (probe: no marketRegister, ' + ARM_STATE.parcels + ' parcels on town)'}`);

let same = 0, diff = 0;
const rows = [];
for (const spec of CORPUS) {
  const r = dressLeaf(spec.key, 'parchment');
  const a = renderFolio(r.fabric, { lens: 'parchment', words: armed });
  __resetTrace();
  const b = traced(r.fabric, { lens: 'parchment', words: armed });
  const ok = a.svg === b.svg && a.elementCount === b.elementCount && a.primitiveCount === b.primitiveCount;
  if (ok) same++; else diff++;
  rows.push({ key: spec.key, ok, shaA: sha(a.svg), shaB: sha(b.svg), traceEvents: __T.length });
  console.log(`${spec.key.padEnd(12)} ${ok ? 'IDENTICAL' : '⛔ DIFFERS '}`
    + ` folio ${sha(a.svg)}  traced ${sha(b.svg)}  els ${a.elementCount}/${b.elementCount}`
    + `  prims ${a.primitiveCount}/${b.primitiveCount}  traceEvents ${__T.length}`);
}
console.log(`\n${same}/${CORPUS.length} identical, ${diff} differ  (arm: ${armed ? 'FULL' : 'dormant'})`);

/* ── THE NEGATIVE CONTROL: a comparison that cannot fail proves nothing (§9 law 4). ───────── */
{
  const r = dressLeaf('town', 'parchment');
  const a = renderFolio(r.fabric, { lens: 'parchment', words: armed });
  const b = traced(r.fabric, { lens: 'parchment', words: armed });
  const corrupted = b.svg.replace('<svg', '<svg data-planted="1"');
  const caught = a.svg !== corrupted;
  console.log(`PLANTED CONTROL · one attribute injected into the twin's SVG -> `
    + `${caught ? 'CAUGHT (the comparison can fail)' : '⛔ NOT CAUGHT — the instrument is dead'}`);
  if (!caught) process.exit(2);
}
process.exit(diff === 0 ? 0 : 1);
