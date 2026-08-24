/**
 * harness/laneREG4/probeMarket.mjs — exercise the market register against the UNARMED fabric,
 * before any wiring. Reports the shape selection, the mouth census, the inscription invariant
 * and the B13 band per void.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/exemplars.mjs'));
const MR = await import(join(ROOT, 'src/domain/townMap/fabric/marketRegister.js'));
const { pointInPolygon, absArea } = await import(join(ROOT, 'src/domain/townMap/fabric/fabricGeometry.js'));

const only = (process.argv.find((a) => a.startsWith('--leaves=')) || '').slice(9);
const list = only && only !== 'ALL' ? CORPUS.filter((c) => only.split(',').includes(c.key)) : CORPUS;

const rows = [];
let inscriptionFail = 0, inscriptionTested = 0;
for (const spec of list) {
  const { fabric } = buildOne(spec, {});
  const m = fabric.meta;
  const reg = MR.deriveMarketRegister({
    squares: fabric.web.squares, channels: fabric.channels, tier: m.tier,
    seedKey: `${m.seed}|marketRegister`, frontage: m.plotFrontage,
    hasWater: !!(fabric.water && fabric.water.kind && fabric.water.kind !== 'none'),
    lawfulness: (fabric.stateMarks || {}).lawfulness,
    prosperityRank: m.prosperityRank, droveRoad: false,
    stateBodies: (fabric.stateMarks || {}).bodies || [],
    organisms: fabric.organisms,
  });
  for (const v of reg.voids) {
    // ⭐ THE INSCRIPTION INVARIANT, asserted vertex by vertex rather than trusted.
    let out = 0;
    for (const p of v.polygon) { inscriptionTested++; if (!pointInPolygon(p[0], p[1], v.blob)) { out++; inscriptionFail++; } }
    rows.push({
      leaf: spec.key, tier: m.tier, void: v.key.replace('square.', ''), kind: v.kind, role: v.role,
      mouths: v.mouths.length, ranks: [...new Set(v.mouths.map((x) => x.rank))].join(','),
      shape: v.shape, band: v.band.join('-'), target: v.fixtureTarget, fixtures: v.fixtures.length,
      kinds: [...new Set(v.fixtures.map((f) => f.kind))].join(','),
      areaBlob: Math.round(v.areaBlob), areaReg: Math.round(v.areaRegister),
      keep: `${Math.round((100 * v.areaRegister) / v.areaBlob)}%`,
      vertsOutsideBlob: out,
    });
  }
  if (reg.fossils.length) {
    rows.push({ leaf: spec.key, tier: m.tier, void: `FOSSILS(${reg.fossils.length})`, kind: 'middleRow', role: '-', mouths: '', ranks: '', shape: '', band: '', target: '', fixtures: '', kinds: (reg.fossils[0].cite || '').slice(0, 46), areaBlob: Math.round(reg.fossils.reduce((s, f) => s + f.area, 0)), areaReg: '', keep: '', vertsOutsideBlob: '' });
  }
}
const cols = Object.keys(rows[0]);
const w = {};
for (const c of cols) w[c] = Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length));
const line = (v) => cols.map((c, i) => String(v[i] ?? '').padEnd(w[c])).join(' | ');
process.stdout.write(`${line(cols)}\n${cols.map((c) => '-'.repeat(w[c])).join('-+-')}\n`);
for (const r of rows) process.stdout.write(`${line(cols.map((c) => r[c]))}\n`);
process.stdout.write(`\nINSCRIPTION: ${inscriptionFail} of ${inscriptionTested} register vertices fall OUTSIDE their reserved blob (must be 0)\n`);
