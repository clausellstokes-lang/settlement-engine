/** probeAnchors.mjs — WHY THE ANCHORS LOSE TO THEIR DECOYS: the top-4 by drawn area, typed. */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const { buildLeaf, CORPUS } = await import(join(HERE, 'leaf.mjs'));
const absArea = (p) => { let s = 0; for (let i = 0, j = p.length - 1; i < p.length; j = i++) s += p[j][0] * p[i][1] - p[i][0] * p[j][1]; return Math.abs(s) / 2; };
const only = (process.argv.find((a) => a.startsWith('--leaves=')) || '').slice(9);
const keys = only ? only.split(',') : CORPUS.map((c) => c.key);
console.log(['leaf', 'rank', 'area', 'monum', 'promin', 'archetype', 'rung', 'size', 'instanceKey'].join('\t'));
const tally = { top4Monumental: 0, top4Total: 0 };
for (const k of keys) {
  const { fabric } = buildLeaf(k, process.argv.includes("--shapes") ? { shapeCode: true } : {});
  const masses = [];
  for (const lm of fabric.landmarks) for (const s of (lm.solids || [])) {
    if (!s || s.length < 3) continue;
    masses.push({ a: absArea(s), lm });
  }
  masses.sort((x, y) => y.a - x.a);
  masses.slice(0, 4).forEach((m, i) => {
    tally.top4Total++; if (m.lm.monumental) tally.top4Monumental++;
    console.log([k, i + 1, m.a.toFixed(1), m.lm.monumental, m.lm.prominent, m.lm.archetype, m.lm.rung, m.lm.size.toFixed(2), m.lm.instanceKey].join('\t'));
  });
  // and the biggest MONUMENTAL mass, for contrast
  const bm = masses.find((m) => m.lm.monumental);
  if (bm) console.log([k, 'topMonum', bm.a.toFixed(1), true, bm.lm.prominent, bm.lm.archetype, bm.lm.rung, bm.lm.size.toFixed(2), bm.lm.instanceKey].join('\t'));
}
console.log(`\nTOP-4 SLOTS HELD BY A MONUMENTAL: ${tally.top4Monumental} of ${tally.top4Total}`);
