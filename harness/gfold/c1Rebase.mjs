#!/usr/bin/env node
/**
 * GFOLD · ⭐⭐⭐ **THE C1 EVIDENCE ROW, RE-BASED** (ODQ §655.3's deferred ruling, GROW-A §2.6).
 *
 * C1 cites *"intramural holdings FALL 1,414→883 between year 100 and the present while the suburb
 * rises 64→536"* as evidence the engine grows OUTWARD past a STANDING circuit. GROW-A convicted the
 * MAGNITUDE, not the direction: the two leaves that body count is taken across carry **two
 * different circuits** — the stamped vintage has no `year` field, `deriveEpochs` reads it as
 * undated and takes the "ONE circuit on today's fabric" branch — so most of the fall is the epoch
 * ladder collapsing, not the town emptying.
 *
 * THIS FILE MEASURES BOTH INSTRUMENTS, SIDE BY SIDE, IN ONE RUN:
 *   ARM A · THE OLD ONE — the LEGACY fabric (`parcels`/`lod.masses`/`faubourgs`) against
 *           `wallCircuit`'s walled epoch bodies, on the `year-100` leaf and the `town` leaf. This
 *           is the instrument that produced C1's row, and it is re-run here rather than quoted.
 *           It also prints each leaf's circuit ENCLOSED AREA, which is the two-circuit fact
 *           itself: one settlement, one seed, one vintage year — two walls of different size.
 *   ARM B · THE NEW ONE — the partition's own DATED circuit, frozen by the ledger's circuit event
 *           and re-read at EVERY rung of ONE settlement's ledger walk. One circuit per vintage,
 *           across all years, on one settlement — which is what §2.6 said the re-basing needed.
 *
 * Usage: node harness/gfold/c1Rebase.mjs
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { faceCentroid, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { centroid, absArea } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { pointIn } from '../../src/domain/townMap/fabric/epochAxis.js';

function urbanGrowth(f) {
  const out = [];
  const merged = (f.lod && f.lod.mergedKeys) || new Set();
  const has = (m, k) => (m instanceof Set ? m.has(k) : !!(m && m[k]));
  for (const p of f.parcels) {
    if (has(merged, p.key)) continue;
    if (p.polygon && p.polygon.length >= 3) out.push({ poly: p.polygon, count: 1 });
    if (p.backHouse && p.backHouse.length >= 3) out.push({ poly: p.backHouse, count: 1 });
  }
  for (const m of ((f.lod && f.lod.masses) || [])) if (m.polygon && m.polygon.length >= 3) out.push({ poly: m.polygon, count: m.count || 1 });
  for (const h of ((f.shanty && f.shanty.huts) || [])) if (h.polygon && h.polygon.length >= 3) out.push({ poly: h.polygon, count: 1 });
  for (const b of ((f.faubourgs && f.faubourgs.buildings) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ poly: b.polygon, count: 1 });
  for (const b of ((f.faubourgs && f.faubourgs.leanTos) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ poly: b.polygon, count: 1 });
  return out;
}

console.log('══ ARM A · THE OLD INSTRUMENT — the legacy fabric against wallCircuit, TWO LEAVES ══\n');
console.log('leaf        intramural  extramural  share  walled epochs  enclosed area');
const armA = {};
for (const key of ['year-100', 'town']) {
  const spec = CORPUS.find((s) => s.key === key);
  const f = buildOne(spec, {}).fabric;
  const node = f.wallCircuit;
  const walled = (node.epochs || []).filter((e) => e.walled && e.body);
  let inW = 0; let outW = 0;
  for (const b of urbanGrowth(f)) {
    const c = centroid(b.poly);
    (walled.some((e) => pointIn(e.body, c[0], c[1])) ? (inW += b.count) : (outW += b.count));
  }
  const ep = walled[walled.length - 1];
  const area = ep && ep.body && ep.body.length >= 3 ? Math.abs(absArea(ep.body)) : 0;
  armA[key] = { inW, outW, area, walledEpochs: walled.length };
  console.log(`${key.padEnd(11)}${String(inW).padStart(10)}${String(outW).padStart(12)}`
    + `${(outW / Math.max(1, inW + outW)).toFixed(3).padStart(8)}`
    + `${String(armA[key].walledEpochs).padStart(15)}`
    + `${area.toFixed(0).padStart(15)}`);
}
const r = armA['year-100'].area / Math.max(1, armA.town.area);
console.log(`\n⛔ TWO CIRCUITS, ONE SETTLEMENT: the year-100 leaf's wall encloses ${r.toFixed(2)}× the`
  + ' present leaf\'s. A body count taken across them is not a differential.');
console.log(`   intramural ${armA['year-100'].inW} → ${armA.town.inW}`
  + ` · extramural ${armA['year-100'].outW} → ${armA.town.outW}`);

console.log('\n══ ARM B · THE NEW INSTRUMENT — ONE frozen circuit, read at every rung of ONE ledger ══');
function inRing(ring, p) {
  let ins = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
for (const key of ['town', 'year-100']) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const eps = input.ledger.epochs;
  console.log(`\nLEAF ${key} — ${eps.length} ledger epochs`);
  console.log('  year   pop   frozenR  enclosed(inner)  intramural  extramural  typed  share');
  let first = null; let last = null;
  for (let k = 1; k <= eps.length; k++) {
    const P = buildSettledPartition({ ...input, epochCap: k });
    if (!P.wraps.length) continue;
    const wrap = P.wraps[P.wraps.length - 1];
    const arr = P.arrangement;
    let intra = 0; let extra = 0;
    for (const f of liveFaces(arr)) {
      if (f.cls !== 'PLOT') continue;
      const c = faceCentroid(arr, f.id);
      if (inRing(wrap.inner, c)) intra++;
      if (!inRing(wrap.outer, c)) extra++;
    }
    const typed = P.emissions.reduce((s, e) => s + e.plots, 0);
    const encl = Math.abs(absArea(wrap.inner.map((p) => [p[0], p[1]])));
    const row = { year: eps[k - 1].year, pop: eps[k - 1].population, R: wrap.frozenRadius, encl, intra, extra, typed };
    if (!first) first = row;
    last = row;
    console.log(`${String(row.year).padStart(6)}${String(row.pop).padStart(7)}${row.R.toFixed(2).padStart(10)}`
      + `${encl.toFixed(0).padStart(17)}${String(intra).padStart(12)}${String(extra).padStart(12)}`
      + `${String(typed).padStart(7)}${(extra / Math.max(1, intra + extra)).toFixed(3).padStart(7)}`);
  }
  const dIn = last.intra - first.intra; const dOut = last.extra - first.extra;
  console.log(`  → under ONE standing circuit, year ${first.year} → ${last.year}:`
    + ` intramural ${first.intra} → ${last.intra} (${dIn >= 0 ? '+' : ''}${dIn}),`
    + ` extramural ${first.extra} → ${last.extra} (${dOut >= 0 ? '+' : ''}${dOut});`
    + ` the extramural SHARE OF GROWTH is ${(dOut / Math.max(1, dIn + dOut) * 100).toFixed(1)} %,`
    + ` and ${last.typed} of the ${last.extra} extramural plots are typed acts`);
}
