/** probeRoofBill.mjs — WHERE THE ROOF LAW'S OPS GO, per leaf, before any lever is chosen. */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const { buildLeaf, CORPUS } = await import(join(HERE, 'leaf.mjs'));
const { roofDetailFor, breadthOf } = await import(join(HERE, '../../src/domain/townMap/fabric/shapeCode.js'));
const { widestAxis } = await import(join(HERE, '../../src/domain/townMap/fabric/fabricGeometry.js'));

console.log(['leaf', 'parcels', 'gate0', 'ridgeOnly', 'full', 'ridges', 'hips', 'planes', 'chim', 'TOTAL', 'forms'].join('\t'));
const tot = {};
for (const spec of CORPUS) {
  const { fabric } = buildLeaf(spec.key, { shapeCode: true });
  const frontage = fabric.web.plotFrontage;
  const inkDetail = Math.round(Math.max(0.3, Math.min(0.8, frontage * 0.055)) * 100) / 100;
  const lodKeys = (fabric.lod && fabric.lod.mergedKeys) || new Set();
  let g0 = 0, g1 = 0, g2 = 0, ridges = 0, hips = 0, planes = 0, chim = 0;
  const forms = {};
  for (const p of fabric.parcels) {
    if (lodKeys.has(p.key) || p.derelict) continue;
    const w = widestAxis(p.polygon);
    const d = roofDetailFor(w.len / frontage, breadthOf(p.polygon), inkDetail);
    if (d === 0) { g0++; continue; }
    const form = fabric.shapeCode.roofForm[p.key] || 'gable';
    forms[form] = (forms[form] || 0) + 1;
    ridges++;
    if (d === 1) { g1++; continue; }
    g2++;
    if (form === 'hip') hips += 4;
    else if (form === 'crossGable' || form === 'leanTo' || form === 'catSlide') hips += 1;
    planes++;
    if (p.wealth === 'wealthy' || p.wealth === 'opulent') chim++;
  }
  const T = ridges + hips + planes + chim;
  tot[spec.key] = T;
  console.log([spec.key, fabric.parcels.length, g0, g1, g2, ridges, hips, planes, chim, T,
    Object.keys(forms).sort().map((k) => `${k} ${forms[k]}`).join(' ')].join('\t'));
}
