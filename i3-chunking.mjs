/**
 * i3-chunking.mjs — REG-I0 · INSTRUMENT 3 · TIER-CONDITIONED CHUNKING.
 *
 * THE QUESTION (§6's legibility leg, "chunking — wall + 5–9 wards legible"): a plan is read by
 * being BROKEN INTO PARTS first and inspected second. The eye holds a handful of regions at
 * once; a map with three parts is a diagram and a map with thirty is wallpaper. The wall is the
 * strongest chunk boundary there is, which is why §571.1 puts it first: *"a wall should END the
 * districts it encloses."*
 *
 * ═══ THE MEASURE ═══
 *      legibleWards = | { district regions with area ≥ AREA_FLOOR } |
 *      chunks       = legibleWards + (wallPresent ? 1 : 0)
 *
 *   DENOMINATOR, named: `fabric.umbrella.partition` — the district regions the §232 partition
 *   published for this leaf. `legibleWards` is a COUNT drawn from that population, and the
 *   population size is reported beside it on every row, so "6 legible" is always readable as
 *   "6 of 8 regions".
 *
 *   AREA_FLOOR = 5,000 sq view units — 0.5% of the 1000×1000 folio frame. A region smaller than
 *   that is a patch, not a quarter: at the 200px thumbnail the squint test uses it is about
 *   2 px on a side. ⚠ CHAIR'S NUMBER, VETOABLE, and stated rather than buried so the REG-0
 *   judging round can move it with one edit.
 *
 * ═══ THE BAND — TIER-CONDITIONED, WHICH IS THE WHOLE POINT ═══
 *      band = [ min(totalRegions, 5) , 9 ]
 *
 *   The upper bound is Miller's ceiling and does not move: nine parts is the most a reader holds.
 *   The LOWER bound is conditioned, because a thorp with two districts has two districts —
 *   that is the truth of the place, not a legibility defect, and a fixed floor of 5 would
 *   convict every small tier for being small. L-REG-15 (village-first) makes this explicit:
 *   small tiers are first-class judging targets, not the city's failed sibling. So the floor
 *   asks only that the wards the settlement HAS are legible, never that it have more.
 *
 * ⚠ THE WALL IS REPORTED, NOT REQUIRED. An unwalled town is lawful (`year-018` is the corpus's
 * own case — the circuit was raised in year 49), so a wall requirement would convict correct
 * history. `wallPresent` rides every row as data and adds its chunk when it is there.
 *
 * CONTROLS (--controls):
 *   POSITIVE  every corpus leaf, per tier
 *   NEGATIVE  --inflate=30 — thirty synthetic regions above the floor. MUST fail high (> 9).
 *   NEGATIVE  --dust — every region shrunk below AREA_FLOOR. MUST fail low, and the failure must
 *             read as "0 legible of N regions" rather than as an absent measurement.
 *   BOUNDARY  a single-region leaf must PASS on band [1,9] — the tier conditioning working. An
 *             instrument that failed a thorp here would be measuring tier, not legibility.
 *
 * Usage: node i3-chunking.mjs --wt=<worktree> [--leaves=ALL] [--json=]
 *        node i3-chunking.mjs --wt=<worktree> --controls
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { absArea, r2, verdict } from './lib/geom.mjs';

export const AREA_FLOOR = 5000;          // sq view units — 0.5% of the folio frame
export const CHUNK_MAX = 9;              // Miller's ceiling
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';

export function chunking(fabric, { partition = null, areaFloor = AREA_FLOOR } = {}) {
  const regions = partition || (fabric.umbrella && fabric.umbrella.partition) || [];
  const withArea = regions.map((r) => ({
    districtId: r.districtId, wallSide: r.wallSide || null,
    area: r2(Number.isFinite(r.area) ? r.area : (r.polygon ? absArea(r.polygon) : 0)),
  }));
  const legible = withArea.filter((r) => r.area >= areaFloor);
  const wallPresent = ((fabric.walls || []).length > 0);
  const lo = Math.min(regions.length, 5);
  const pass = legible.length >= lo && legible.length <= CHUNK_MAX;
  return {
    tier: fabric.meta.tier, extentTier: fabric.meta.extentTier, population: fabric.meta.population,
    wallPresent, rings: (fabric.walls || []).length,
    totalRegions: regions.length, areaFloor,
    legibleWards: legible.length, chunks: legible.length + (wallPresent ? 1 : 0),
    band: [lo, CHUNK_MAX], bandSource: `[min(totalRegions=${regions.length}, 5), ${CHUNK_MAX}]`,
    pass,
    verdictRow: verdict('chunking.legibleWards', legible.length,
      `${regions.length} district regions in fabric.umbrella.partition, area floor ${areaFloor} sq units`,
      `${lo}..${CHUNK_MAX}`, pass, { wallPresent, chunks: legible.length + (wallPresent ? 1 : 0) }),
    regions: withArea.sort((a, b) => b.area - a.area),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const wt = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0/w3f-tree');
  const { buildOne, CORPUS } = await import(pathToFileURL(join(wt, 'harness/exemplars.mjs')).href);
  const json = arg('json', null);
  if (process.argv.includes('--controls')) {
    const { fabric } = buildOne(CORPUS.find((s) => s.key === 'city'));
    const P = chunking(fabric);
    process.stdout.write(`P  real city      legible=${P.legibleWards}/${P.totalRegions} band=${JSON.stringify(P.band)} chunks=${P.chunks} wall=${P.wallPresent} → ${P.pass ? 'PASS' : 'FAIL'}\n`);
    for (const r of P.regions) process.stdout.write(`     ${String(r.area).padStart(9)}  ${r.area >= P.areaFloor ? 'legible' : 'DUST   '}  ${r.districtId}\n`);

    const big = fabric.umbrella.partition[0];
    const inflated = Array.from({ length: 30 }, (_, i) => ({ districtId: `CONTROL.inflated.${i}`, area: 20000, polygon: big.polygon }));
    const N1 = chunking(fabric, { partition: inflated });
    process.stdout.write(`N1 30 regions    legible=${N1.legibleWards}/${N1.totalRegions} band=${JSON.stringify(N1.band)} → ${N1.pass ? 'PASS' : 'FAIL'}\n`);

    const dust = fabric.umbrella.partition.map((r) => ({ ...r, area: 12 }));
    const N2 = chunking(fabric, { partition: dust });
    process.stdout.write(`N2 all dust      legible=${N2.legibleWards}/${N2.totalRegions} band=${JSON.stringify(N2.band)} → ${N2.pass ? 'PASS' : 'FAIL'}\n`);

    const one = [{ districtId: 'CONTROL.single', area: 40000, polygon: big.polygon }];
    const B = chunking(fabric, { partition: one });
    process.stdout.write(`B  one region    legible=${B.legibleWards}/${B.totalRegions} band=${JSON.stringify(B.band)} → ${B.pass ? 'PASS' : 'FAIL'}  (tier conditioning: a thorp is not convicted for being small)\n`);

    const live = [
      ['the real city sits in band', P.pass === true],
      ['thirty regions fail HIGH', N1.pass === false && N1.legibleWards > CHUNK_MAX],
      ['all-dust fails LOW and still reports its denominator', N2.pass === false && N2.legibleWards === 0 && N2.totalRegions > 0],
      ['a single-region leaf PASSES on band [1,9]', B.pass === true && B.band[0] === 1],
    ];
    process.stdout.write('\n── LIVENESS\n');
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i3-controls.json`, JSON.stringify({ P, N1, N2, B, liveness: live }, null, 2));
    process.stdout.write(`\nI3_CONTROLS ${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    const keys = arg('leaves', 'ALL') === 'ALL' ? CORPUS.map((s) => s.key) : arg('leaves').split(',');
    const rows = [];
    process.stdout.write(`  ${'leaf'.padEnd(12)} ${'tier'.padEnd(11)} wall  legible/regions  band     chunks  verdict\n`);
    for (const k of keys) {
      const spec = CORPUS.find((s) => s.key === k);
      if (!spec) continue;
      const { fabric } = buildOne(spec);
      const c = chunking(fabric);
      rows.push({ leaf: k, ...c });
      process.stdout.write(`  ${k.padEnd(12)} ${String(c.tier).padEnd(11)} ${String(c.wallPresent).padEnd(5)} ${`${c.legibleWards}/${c.totalRegions}`.padEnd(16)} ${JSON.stringify(c.band).padEnd(8)} ${String(c.chunks).padEnd(7)} ${c.pass ? 'PASS' : 'FAIL'}\n`);
    }
    const passing = rows.filter((r) => r.pass).length;
    process.stdout.write(`\nCHUNKING: ${passing} of ${rows.length} leaves inside their tier-conditioned band\n`);
    if (json) writeFileSync(json, JSON.stringify({ rows, passing, total: rows.length }, null, 2));
    process.stdout.write('I3_DONE\n');
  }
}
