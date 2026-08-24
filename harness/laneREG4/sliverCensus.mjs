/**
 * harness/laneREG4/sliverCensus.mjs — ⭐⭐ THE SLIVER CENSUS (charter Amendment A7):
 * *"a sliver census (armed corpus, zero sub-minimum drawn buildings, with a planted-sliver
 * liveness control)"*.
 *
 * THE SUBJECT IS THE **DRAWN INK**, not the fabric. `applyMinFootprint` publishes a verdict per
 * body; the census reconstructs exactly what reaches the page —
 *     keep  → the body's own polygon      clamp → the replacement (scaled up to the floor)
 *     fuse  → nothing (its ink is inside its host's new hull)      drop → nothing
 * — and measures the short axis and area of every survivor against the same floors the law used.
 *
 * ⛔ A ZERO IS WHAT A DEAD INSTRUMENT RETURNS. Two controls, and the first is the stronger:
 *   C1 · THE LAW DISARMED. The sealed corpus is real geometry with a real defect; the census MUST
 *        come back positive on it. (i10's A3 control is the precedent: a synthetic plant proves
 *        the predicate fires, a genuine pre-cure input proves it fires on the thing it is for.)
 *   C2 · A PLANTED SLIVER, injected into the DRAWN set after the law has run — a body class that
 *        forgot to ask the chokepoint. The census must red by exactly one.
 *
 * Usage: node harness/laneREG4/sliverCensus.mjs [--leaves=ALL] [--floor=F-A|F-B|F-C] [--controls]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/exemplars.mjs'));
const MFm = await import(join(ROOT, 'src/domain/townMap/fabric/minFootprint.js'));
const { absArea } = await import(join(ROOT, 'src/domain/townMap/fabric/fabricGeometry.js'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const only = arg('leaves', 'ALL');
const floor = arg('floor', MFm.PROVISIONAL_FLOOR);
const list = only === 'ALL' ? CORPUS : CORPUS.filter((c) => only.split(',').includes(c.key));

/** The ink that reaches the page, given a fabric and (optionally) a verdict table. */
function drawnInk(fabric, table) {
  const bodies = MFm.minFootprintBodies({
    drawn: {
      parcels: fabric.parcels,
      huts: (fabric.shanty && fabric.shanty.huts) || [],
      faubourgBuildings: (fabric.faubourgs && fabric.faubourgs.buildings) || [],
      faubourgLeanTos: (fabric.faubourgs && fabric.faubourgs.leanTos) || [],
    },
    lod: fabric.lod, seatedAll: fabric.landmarks,
    habitation: { dwellings: fabric.habitation || [] }, keepers: { dwellings: [] },
  });
  if (!table) return bodies;
  /** @type {Array<any>} */ const out = [];
  for (const b of bodies) {
    const v = table.verdicts[b.key];
    if (v === 'fuse' || v === 'drop') continue;
    out.push({ ...b, poly: table.replace[b.key] || b.poly });
  }
  return out;
}

function censusOf(bodies, floors) {
  let sub = 0; const worst = [];
  for (const b of bodies) {
    const s = MFm.shortAxisOf(b.poly), ar = absArea(b.poly);
    if (s < floors.minShort || ar < floors.minArea) { sub++; worst.push(`${b.key}(s=${s.toFixed(2)},a=${ar.toFixed(2)})`); }
  }
  return { tested: bodies.length, sub, worst: worst.slice(0, 3) };
}

const rows = [];
let armedSub = 0, armedTested = 0, baseSub = 0, baseTested = 0;
for (const spec of list) {
  const armed = buildOne(spec, { minFootprint: true, footprintFloor: floor }).fabric;
  const floors = armed.minFootprint.floors;
  const A = censusOf(drawnInk(armed, armed.minFootprint), floors);
  const B = censusOf(drawnInk(buildOne(spec, {}).fabric, null), floors);   // C1 · the law disarmed
  armedSub += A.sub; armedTested += A.tested; baseSub += B.sub; baseTested += B.tested;
  rows.push({
    leaf: spec.key, tier: armed.meta.tier,
    minShort: Math.round(floors.minShort * 1000) / 1000, minArea: Math.round(floors.minArea * 1000) / 1000,
    drawn: A.tested, subARMED: A.sub, subBASE: `${B.sub}/${B.tested}`,
    fused: armed.minFootprint.counts.fused, clamped: armed.minFootprint.counts.clamped, dropped: armed.minFootprint.counts.dropped,
  });
}
const cols = Object.keys(rows[0]);
const w = {}; for (const c of cols) w[c] = Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length));
const line = (v) => cols.map((c, i) => String(v[i] ?? '').padEnd(w[c])).join(' | ');
process.stdout.write(`FLOOR CANDIDATE: ${floor} — ${MFm.FLOOR_CANDIDATES[floor].source}\n\n`);
process.stdout.write(`${line(cols)}\n${cols.map((c) => '-'.repeat(w[c])).join('-+-')}\n`);
for (const r of rows) process.stdout.write(`${line(cols.map((c) => r[c]))}\n`);
process.stdout.write(`\nSLIVER CENSUS · ARMED  = ${armedSub} of ${armedTested} drawn bodies are sub-minimum  → ${armedSub === 0 ? 'ZERO' : '⛔ NON-ZERO'}\n`);
process.stdout.write(`CONTROL C1 · DISARMED  = ${baseSub} of ${baseTested} — the sealed corpus, real geometry with a real defect; MUST be positive → ${baseSub > 0 ? 'POSITIVE (the census counts)' : '⛔ DEAD INSTRUMENT'}\n`);

if (process.argv.includes('--controls')) {
  process.stdout.write('\nCONTROL C2 · A PLANTED SLIVER, injected into the DRAWN set after the law ran\n');
  for (const spec of list.slice(0, 4)) {
    const armed = buildOne(spec, { minFootprint: true, footprintFloor: floor }).fabric;
    const floors = armed.minFootprint.floors;
    const ink = drawnInk(armed, armed.minFootprint);
    const before = censusOf(ink, floors).sub;
    const s = floors.minShort * 0.4, L = floors.minShort * 1.2;
    const planted = { key: 'CONTROL.planted_sliver', kind: 'parcel', poly: [[0, 0], [L, 0], [L, s], [0, s]] };
    const after = censusOf(ink.concat([planted]), floors);
    process.stdout.write(`  ${spec.key.padEnd(11)} before=${before}  after=${after.sub}  Δ=${after.sub - before}`
      + `  caught=${after.worst.some((t) => t.startsWith('CONTROL.planted_sliver')) ? 'YES' : '⛔ NO'}\n`);
  }
}
