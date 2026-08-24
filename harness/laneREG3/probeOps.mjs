/**
 * probeOps.mjs — THE §217 TABLE, and beside it the two units that actually cost: DOM NODES and
 * MILLISECONDS. A primitive-count ratchet is a proxy; the proxy and the cost are reported together
 * so a raise can be judged rather than granted.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const { CORPUS, buildOne } = await import(join(HERE, 'leaf.mjs'));
const { renderFolio, OP_CEILING_BY_TIER } = await import(join(HERE, '../renderFolio.mjs'));

const arms = [['BASE', {}], ['SHAPES', { shapeCode: true }], ['RAMPART', { rampart: true }], ['BOTH', { shapeCode: true, rampart: true }]];
const rows = [];
for (const spec of CORPUS) {
  const r = { key: spec.key };
  for (const [name, opts] of arms) {
    const { fabric } = buildOne(spec, opts);
    const t0 = process.hrtime.bigint();
    const out = renderFolio(fabric, { lens: 'parchment' });
    const t1 = process.hrtime.bigint();
    r.tier = fabric.meta.tier;
    r[name] = { prim: out.primitiveCount, els: out.elementCount, ms: Number(t1 - t0) / 1e6, kb: out.svg.length / 1024 };
  }
  rows.push(r);
}
console.log(['leaf', 'tier', 'ceil', 'BASE', 'SHAPES', 'RAMPART', 'BOTH', 'over(BOTH)', 'els B→S', 'kB B→S', 'ms BOTH'].join('\t'));
const need = {};
for (const r of rows) {
  const c = OP_CEILING_BY_TIER[r.tier] || 4600;
  const signed = { town: 5400, city: 6800 }[r.tier] || c;
  need[r.tier] = Math.max(need[r.tier] || 0, r.BOTH.prim);
  console.log([r.key, r.tier, signed, r.BASE.prim, r.SHAPES.prim, r.RAMPART.prim, r.BOTH.prim,
    r.BOTH.prim - signed, `${r.BASE.els}→${r.SHAPES.els}`, `${r.BASE.kb.toFixed(0)}→${r.SHAPES.kb.toFixed(0)}`,
    r.BOTH.ms.toFixed(1)].join('\t'));
}
console.log('\nPER-TIER MAXIMUM, BOTH ARMS ARMED (the figure a raise would be set from):');
for (const t of Object.keys(need).sort()) {
  const signed = { town: 5400, city: 6800 }[t] || OP_CEILING_BY_TIER[t];
  console.log(`  ${t.padEnd(12)} max ${String(need[t]).padStart(6)}  signed ${String(signed).padStart(6)}  → next hundred above: ${Math.ceil(need[t] / 100) * 100}`);
}
