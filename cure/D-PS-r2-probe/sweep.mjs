// D-PS-r2 probe: replay THE CURED border read on the landed position law and the landed hop classifiers.
// (1) the SWEEP: every intermediate node j with prior index p < j <= current index c is judged in the tick
//     it is entered (PS-r2-4's cure) — count intermediate nodes never judged (expected 0);
// (2) the MODALITY of each judged node's inbound hop (land | sea | teleport) and of its outbound hop — a node
//     entered by sea and left by sea is a waypoint at sea (no passage, R2b PS-r2-2), entered by sea and left
//     otherwise a LANDING at its harbour, entered by teleport an ARRIVAL at its circle (PS-r2-2's cure);
// (3) the HOLD CLAMP with integer clocks: for a hold before node j, the largest integer-clock position whose
//     rounded index is <= j-1 — count holds whose clamped index lands BELOW j-1 (the coarse case, span < hops).
// Usage: node sweep.mjs <master worktree>
const M = process.argv[2];
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { planMarch, armyRecordOf, stepArmyPosition } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const { teleportAdjacency } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { classifyLegModes } = await import(`${M}/src/domain/roads/seaRoads.js`);
const F = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);

const idxOf = (pos, n) => Math.min(n - 1, Math.round(pos * (n - 1)));

function modes(digest, path) {
  const land = classifyLegModes(digest, path);
  const tele = teleportAdjacency(digest);
  return land.map((m, i) => (tele.get(String(path[i]))?.has(String(path[i + 1])) ? 'teleport' : m));
}

function scan(name, input, season = null) {
  const digest = buildSpatialDigest(input);
  const ids = (digest.settlements || input.placements || []).map((s) => String(s.id ?? s));
  const out = { name, season, marches: 0, intermediateNodes: 0, judged: 0, unjudged: 0,
    byInbound: { land: 0, sea: 0, teleport: 0 }, seaWaypoints: 0, landings: 0, arrivalsByTeleport: 0,
    holdsTried: 0, clampBelowPrev: 0, clampAtOrigin: 0, examplesCoarse: [] };
  for (const o of ids) for (const d of ids) {
    if (o === d) continue;
    const plan = planMarch(digest, {}, o, d, 0.5, null, 0, season); if (!plan) continue;
    out.marches++;
    const p = plan.path; const n = p.length;
    const hop = modes(digest, p);
    const judged = new Set();
    let rec = armyRecordOf({ armyId: o, originId: o, destId: d, path: p, departTick: plan.departTick, arrivalTick: plan.arrivalTick });
    let prevIdx = 0;
    for (let t = 0; t <= plan.arrivalTick; t++) {
      rec = stepArmyPosition(rec, t);
      const c = idxOf(rec.position01, n);
      for (let j = prevIdx + 1; j <= c; j++) if (j >= 1 && j <= n - 2) judged.add(j);
      prevIdx = Math.max(prevIdx, c);
    }
    for (let j = 1; j <= n - 2; j++) {
      out.intermediateNodes++;
      if (judged.has(j)) out.judged++; else out.unjudged++;
      const inb = hop[j - 1]; const outb = hop[j];
      out.byInbound[inb]++;
      if (inb === 'sea' && outb === 'sea') out.seaWaypoints++;
      else if (inb === 'sea') out.landings++;
      else if (inb === 'teleport') out.arrivalsByTeleport++;
      // (3) the clamp before node j: span s = arrival - depart; m = ceil(s*(j-0.5)/(n-1)) - 1 (>= 0)
      const s = plan.arrivalTick - plan.departTick;
      const m = Math.max(0, Math.ceil((s * (j - 0.5)) / (n - 1)) - 1);
      const clampIdx = idxOf(s <= 0 ? 1 : m / s, n);
      out.holdsTried++;
      if (clampIdx < j - 1) { out.clampBelowPrev++; if (out.examplesCoarse.length < 2) out.examplesCoarse.push({ o, d, hops: n - 1, weeks: s, holdBefore: j, clampIdx }); }
      if (clampIdx === 0 && j - 1 > 0) out.clampAtOrigin++;
    }
  }
  return out;
}

const grid = F.makeGridPack({ cols: 24, rows: 18 });
const ports = F.makeGridPack({ cols: 24, rows: 18 });
const coast = F.makePortCoastPack(8);
const portInput = { pack: ports, placements: F.placePortSettlements(ports, { nCoastal: 3, nRiver: 2, nInland: 3 }), seaLanes: true, seasonalRoads: true };
console.log(JSON.stringify([
  scan('grid-24x18-12', { pack: grid, placements: F.placeSettlements(grid, 12) }),
  scan('ports-24x18 (sea+seasons)', portInput),
  scan('ports-24x18 (sea+seasons)', portInput, 'winter'),
  scan('portCoast-8 (sea)', { ...coast, seaLanes: true, seasonalRoads: true }),
], null, 1));
