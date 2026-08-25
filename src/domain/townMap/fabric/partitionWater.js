/**
 * domain/townMap/fabric/partitionWater.js — ⭐⭐⭐ SPINE-2 · DESIGN_SPINE **§3e** · **THE WATER
 * BECOMES GROUND OF ITS OWN: BANKS AS EDGES, THE BODY AS A FACE, CROSSINGS AS TYPED EDGES.**
 *
 * §3e in its own words: *"banks from the profile; **crossings as typed edges** — bridge at the
 * admissible narrows with the 75° kink law (§648), ford at the wide reach, ferry where the corridor
 * demands and no deck is earned; quays as water-edge pieces with moored sub-pieces (the §635.4
 * exemption becomes unnecessary — a moored piece is a lawful face, not a refused body)."*
 *
 * ⭐⭐⭐ **WHAT CHANGES AT SPINE-2, IN ONE SENTENCE.** At SPINE-1 the watercourse was a REFUSAL
 * MASK — a predicate that said no. Here it is GROUND: a `WATER` face bounded by `BANK` edges, so
 * §1's *"no WAY edge spans WATER"* stops being a test the constructor must remember to run and
 * becomes true the way planarity is true — **a chord cut inside one face cannot reach across a
 * face that is not it**. The mask stays anyway (it also answers for marsh wetness beyond the drawn
 * channel, which is `sub.wet`'s business and not the channel's), and the census still measures the
 * zero, because a zero nobody measures is a claim.
 *
 * ⛔⛔ **ONE WATER TRUTH, AND THAT IS WHY THIS FILE IMPORTS `waterMode.js` INSTEAD OF MEASURING.**
 * §2 makes the §648 width profile *"the single authority for banks"*. `stationAt` is the estate's
 * one walk from a point to *(distance, LOCAL width)* — the same call `isInWater`, `widthAt` and
 * `deriveBridges` make. Re-deriving a taper here would be a SECOND water truth, which is exactly
 * the TE-WSEAM defect class (two surfaces both answering *"is this water"* with 2.63 % agreement)
 * arriving in a new file. The import costs a declared, FORWARD manifest edge `S4>S8`; a local
 * spelling would have cost the invariant.
 * ⚠ WHERE THE PROFILE IS NOT ARMED (`options.riverProfile` is REG-BRIDGE's own dormant flag, and
 * it is OFF on all eighteen corpus leaves) `stationAt` returns the NOMINAL width — one code path,
 * one authority, whether or not the taper exists. The banks a profiled leaf draws are the same
 * banks read through the same call.
 *
 * ⛔ **TWO CONSTANTS ARE SPELLED LOCALLY AND PINNED EQUAL BY TEST, AND THE REASON IS THE WALKER.**
 * `DECK_LAW.kinkMaxTan` and `FORD_LAW.wideBand` live in `waterWorks.js`, which the stage manifest
 * puts on **S17** — downstream of this node. An import would be the one BACKWARD edge arm 6
 * forbids. So they are re-spelled here with their derivations quoted and pinned equal by
 * `tests/domain/townMapPartitionWater.test.js`, which is the J-GROWA-2 / J-SPINE1-2 move this
 * estate has taken twice before for exactly this law.
 *
 * PURITY: pure. No Date, no Math.random, no rng — every decision here is read off the site or the
 * ledger, and the file opens no stream.
 */

import { CROSSING_BUDGET, stationAt } from './waterMode.js';
import {
  cutFaceByChain, faceArea, faceCentroid, faceRing, liveFaces, mintPiece, splitFaceChain, vertexAt,
} from './partitionArrangement.js';

/** ⭐ THE CLOSED CROSSING VOCABULARY (§651 verbatim). A fourth kind cannot appear silently. */
export const CROSSING_KINDS = Object.freeze(['bridge', 'ford', 'ferry']);

/**
 * ⭐⭐ **THE BANK LAW.** How the two banks are read off the channel.
 *
 *  extendRadii    how far past its last station a bank chain runs, in extent radii.
 *                 ⛔ IT IS 2.5 BY ARITHMETIC, NOT BY FEEL. `cutFaceByChain` needs a point OUTSIDE
 *                 the face at each end, and stations are kept only within 1.25 R of the centre, so
 *                 a 2.5 R step from any of them lands at least 1.25 R out — outside the extent in
 *                 every direction. At 0.6 R it did NOT: the city's shore ENDS INSIDE its extent
 *                 (last station 448 units from a 590-unit centre), so the tail extension stayed
 *                 inside the disc and its points were inserted as BANK 55 and 62 units from the
 *                 drawn shore — a bank hanging in open country, which the agreement arm convicted.
 *    stationWidths  the spacing of bank stations, in LOCAL widths. It is 1.0 because
 *                 `RIVER_PROFILE.window` is 1.5 — the profile is itself smoothed over 1.5 widths,
 *                 so sampling finer than one width records nothing the profile is entitled to say
 *                 and sampling coarser throws away a taper the profile DID measure.
 *  coastStationWidths  ⛔ **ZERO — A COAST'S BANK IS THE DRAWN SHORE, VERTEX FOR VERTEX.** A river's
 *                 bank is an OFFSET of its centreline, so sampling it at one width costs only the
 *                 sagitta of the offset. A coast's bank IS the line, so any sampling stride at all
 *                 replaces the shore with its own chords — and the ground between a chord and the
 *                 shore it cut the corner off is ground the partition calls dry and the drawn map
 *                 calls sea. MEASURED at one width: a gate-road on the city put a way vertex
 *                 **3.43 units seaward** of a 5.0-unit half-band. At zero the bank and the shore
 *                 are the same polyline and the question cannot arise.
 *  coastReach     how far past the extent the seaward return path of a COAST's water polygon runs,
 *                 as a multiple of the extent radius. A shore is a bank with only ONE side, so the
 *                 body is closed well outside the settled ground and the closure is never inserted.
 *  minStations    below this a channel has not enough presence inside the extent to be cut as
 *                 ground; it stays a refusal mask and the count says so.
 * ⚠ PROPOSED; rides the chair's signature and the owner's tuning re-signature.
 */
export const BANK_LAW = Object.freeze({
  stationWidths: 1.0,
  coastStationWidths: 0,
  coastReach: 1.6,
  minStations: 6,
  extendRadii: 2.5,
});

/**
 * ⭐⭐⭐ **THE CROSSING LAW.** Every figure is QUOTED from a law that already exists, and the two
 * that could not be imported carry their source in the comment beside them.
 *
 *  popFloor     `CROSSING_BUDGET.popFloor`, IMPORTED (S4 is upstream). *"A bridge is a public work.
 *               Below town scale the settlement is a ford or a ferry, not a bridge town."*
 *  kinkMaxDeg   ⛔ **75°, and it is `DECK_LAW.kinkMaxTan = 3.73` STATED AS THE ANGLE IT IS.** The
 *               tangent spelling is safe there because the approach is compared inside one
 *               quadrant; stated as an angle it is safe everywhere, and `atan(3.73) = 74.998°`.
 *               L-REG-31's own words for why it is 75 and not 35: *"the approach road kinks at the
 *               bridgehead; the deck is never skewed to save the road a bend"* — a kink budget that
 *               traded squareness for a road's convenience would invert the law it implements. The
 *               only thing this clause may refuse is a road DOUBLING BACK on itself.
 *  wideBand     ⛔ `FORD_LAW.wideBand = 0.97`, the quantile of the local-width distribution at or
 *               above which a reach counts as WIDE. A ford is shallow BECAUSE it is wide; siting
 *               one at a narrows would be siting a bridge and calling it a ford.
 *  apartWidths  `deriveBridges`' own spacing rule (`apart = max(rel.width * 1.6, frontage * 3)`),
 *               carried as the first half; the road half is applied against `roadWidth` below.
 *  maxPerLeaf   a refusal, not a dial: a settlement that appears to earn a fifth crossing has a
 *               siting bug, and the census should see the cap rather than the fifth deck.
 * ⚠ PROPOSED; rides the tuning signature. The two re-spelled values are PINNED EQUAL BY TEST.
 */
export const CROSSING_LAW = Object.freeze({
  popFloor: CROSSING_BUDGET.popFloor,
  kinkMaxDeg: 75,
  wideBand: 0.97,
  apartWidths: 1.6,
  apartRoads: 3,
  maxPerLeaf: 4,
});

/**
 * ⭐⭐ **THE QUAY LAW.** A quay is a piece of the water's own ground given to the settlement.
 *  runStations   how many bank stations one quay spans — its frontage, in stations.
 *  reachWidths   how far a moored piece projects into the channel, as a fraction of LOCAL width.
 *                It is a THIRD because a berth that took half the channel would be a weir.
 *  maxPerLeaf    the register band `V_QUAY_BAND` is 2–5 fixtures per DRAWN quay; the number of
 *                quays is a property of the waterfront, and four is where a page stops reading them
 *                as separate works.
 * ⚠ PROPOSED; rides the tuning signature.
 */
export const QUAY_LAW = Object.freeze({
  runStations: 3,
  reachWidths: 0.33,
  maxPerLeaf: 4,
});

const DEG = 180 / Math.PI;

/** Even-odd point-in-ring in world units — the same predicate `raiseWrap` uses for its band. */
export function inWaterRing(ring, p) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1])
      && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * ⭐⭐⭐ **THE BANK STATIONS — WHERE THE GROUND MEETS THE WATER, READ FROM THE PROFILE.**
 * One station per `BANK_LAW.stationWidths` of LOCAL width along the drawn channel. Each carries
 * its own width (from `stationAt`, the one authority), its tangent, and its two bank points.
 *
 * ⚠ THE TANGENT IS READ OVER A WINDOW, NOT FROM ONE SEGMENT. A meandered channel's consecutive
 * vertices are a few tenths of a unit apart; the segment normal there is polyline sampling noise
 * wearing a bank's clothes, and offsetting by half a width along it produces a bank that crosses
 * itself. The window is the profile's own (`RIVER_PROFILE.window` = 1.5 local widths), so the bank
 * and the taper are read at one scale.
 *
 * @param {{line:Array<number[]>, width:number, widthProfile?:any, kind?:string, bankSide?:number}} water
 * @param {{cx:number, cy:number, radius:number}} extent
 * @returns {Array<{i:number, at:number[], w:number, n:number[], t:number[], left:number[], right:number[]}>}
 */
export function bankStations(water, extent) {
  const line = water && water.line;
  if (!Array.isArray(line) || line.length < 4) return [];
  const coast = water.kind === 'coast';
  const side = Number.isFinite(water.bankSide) ? (water.bankSide < 0 ? -1 : 1) : 1;
  const reach = extent.radius * BANK_LAW.coastReach;
  const picked = [];
  let acc = Infinity;                       // force a station at the first vertex
  for (let i = 0; i < line.length; i++) {
    if (i > 0) acc += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    const st = stationAt(water, line[i][0], line[i][1]);
    const w = Math.max(st.w, 1e-6);
    const stride = coast ? BANK_LAW.coastStationWidths : BANK_LAW.stationWidths;
    if (acc < w * stride && i > 0 && i < line.length - 1) continue;
    acc = 0;
    picked.push({ i, at: [line[i][0], line[i][1]], w });
  }
  // ⛔⛔⛔ **THE STATION POSITIONS STAY **ON** THE DRAWN CHANNEL, AND ONLY THE TANGENT FIELD IS
  // SMOOTHED. THIS IS THE ONE-WATER-TRUTH INVARIANT, AND THE FIRST SPELLING BROKE IT.**
  // Smoothing the CENTRELINE (three 1-2-1 passes, `RIVER_PROFILE.smooth`'s own count) does cure the
  // fold — and it moves the bank off the river. MEASURED on the town: bank vertices sat between
  // **0.280 and 17.153 units** from the drawn channel against a nominal half-width of **8.36** —
  // 0.03× to 2.05× of where a bank belongs, because a smoothed line cuts the corner off every
  // hairpin and its offsets go with it. That is a SECOND WATER TRUTH, which is precisely the
  // TE-WSEAM defect class (two surfaces answering *"is this water"* at 2.63 % agreement) rebuilt
  // inside this car. Anchoring every bank point at ±w/2 from its OWN raw station makes the
  // agreement exact BY CONSTRUCTION, and `censusWater`'s bank-agreement arm measures it anyway.
  //
  // The fold the smoothing was there to cure is a property of the NORMAL, not of the position, so
  // the normal is what gets smoothed: three 1-2-1 passes over the unit tangents, renormalised. A
  // bank still cannot survive a bend tighter than its own half-width, and the fold bar below drops
  // those stations rather than drawing a bank that has turned inside out.
  const tang = [];
  for (let k = 0; k < picked.length; k++) {
    const w = picked[k].w;
    const win = w * 1.5;
    let a = k; let b = k; let back = 0; let fwd = 0;
    while (a > 0 && back < win) { back += Math.hypot(picked[a].at[0] - picked[a - 1].at[0], picked[a].at[1] - picked[a - 1].at[1]); a--; }
    while (b < picked.length - 1 && fwd < win) { fwd += Math.hypot(picked[b].at[0] - picked[b + 1].at[0], picked[b].at[1] - picked[b + 1].at[1]); b++; }
    let tx = picked[b].at[0] - picked[a].at[0]; let ty = picked[b].at[1] - picked[a].at[1];
    const tl = Math.hypot(tx, ty);
    tang.push(tl > 1e-9 ? [tx / tl, ty / tl] : null);
  }
  for (let pass = 0; pass < BANK_SMOOTH_PASSES; pass++) {
    const src = tang.map((t) => (t ? t.slice() : null));
    for (let k = 1; k + 1 < tang.length; k++) {
      const p = src[k - 1]; const q = src[k]; const r = src[k + 1];
      if (!p || !q || !r) continue;
      // ⚠ THE NEIGHBOURS ARE ALIGNED TO `q` BEFORE AVERAGING. A tangent read over a window on a
      //   hairpin can arrive pointing BACKWARDS, and averaging a vector with its own reverse
      //   cancels to zero — a bank normal of nothing, which is how a whole stretch loses its side.
      const sp = (p[0] * q[0] + p[1] * q[1]) < 0 ? -1 : 1;
      const sr = (r[0] * q[0] + r[1] * q[1]) < 0 ? -1 : 1;
      const ax = sp * p[0] + 2 * q[0] + sr * r[0];
      const ay = sp * p[1] + 2 * q[1] + sr * r[1];
      const al = Math.hypot(ax, ay);
      if (al > 1e-9) tang[k] = [ax / al, ay / al];
    }
  }
  const out = [];
  for (let k = 0; k < picked.length; k++) {
    const { i, w } = picked[k];
    const at = picked[k].at;
    if (!tang[k]) continue;
    const tx = tang[k][0]; const ty = tang[k][1];
    const nx = -ty; const ny = tx;
    // ⭐ A COAST'S BANK IS THE SHORE ITSELF AND ITS WATER HAS ONLY ONE SIDE (waterMode's own
    //   ruling: *"the shore is an EDGE, not a division"*). A river has two banks at ±w/2.
    const left = coast ? at.slice() : [at[0] + nx * w * 0.5, at[1] + ny * w * 0.5];
    const right = coast
      ? [at[0] - nx * side * reach, at[1] - ny * side * reach]
      : [at[0] - nx * w * 0.5, at[1] - ny * w * 0.5];
    out.push({ i, at, w, n: [nx, ny], t: [tx, ty], left, right });
  }
  // ⛔ **AND THE FOLD BAR BESIDE THE SMOOTHING, because smoothing is a reduction and not a
  // guarantee.** A station whose local radius of curvature is under its own half-width offsets to a
  // bank that has turned inside out; it is DROPPED rather than drawn, and the drop is a station the
  // bank simply does not have — the channel is still there, its bank is read at the next station
  // the geometry can honestly carry.
  const kept = [out[0]];
  for (let k = 1; k + 1 < out.length; k++) {
    const p = out[k - 1]; const q = out[k]; const r = out[k + 1];
    const turn = Math.abs(Math.atan2(r.t[1], r.t[0]) - Math.atan2(p.t[1], p.t[0]));
    const folded = Math.min(turn, Math.PI * 2 - turn);
    const step = Math.hypot(r.at[0] - p.at[0], r.at[1] - p.at[1]);
    if (folded > 1e-6 && step / folded < q.w * 0.5) continue;
    kept.push(q);
  }
  if (out.length > 1) kept.push(out[out.length - 1]);
  return kept;
}

/** ⭐ `RIVER_PROFILE.smooth`'s own count, applied to POSITION. Pinned equal by test. */
export const BANK_SMOOTH_PASSES = 3;

/**
 * ⭐⭐ A BANK POLYLINE, EXTENDED PAST THE EXTENT AT BOTH ENDS so the cut genuinely crosses the
 * ground it divides. `cutFaceByChain` requires a point outside the face on each side — a chain that
 * stopped at the rim would be an island, and an island is what the substrate cannot hold.
 */
function bankChain(stations, which, extent) {
  const grow = extent.radius * BANK_LAW.extendRadii;
  const first = stations[0]; const last = stations[stations.length - 1];
  const head = [first[which][0] - first.t[0] * grow, first[which][1] - first.t[1] * grow];
  const tail = [last[which][0] + last.t[0] * grow, last[which][1] + last.t[1] * grow];
  return [head, ...stations.map((s) => s[which].slice()), tail];
}

/**
 * ⭐⭐ THE WATER POLYGON — published for the census and the view, NOT used to cut. Left bank
 * forward, right bank back; it is the shape a reader means by "the river", and `censusWater` asks
 * of it *"is any WAY face inside this"*.
 */
export function waterRing(stations, extent) {
  if (stations.length < 2) return null;
  const grow = extent.radius * BANK_LAW.extendRadii;
  const first = stations[0]; const last = stations[stations.length - 1];
  const ring = [[first.left[0] - first.t[0] * grow, first.left[1] - first.t[1] * grow]];
  for (const s of stations) ring.push(s.left.slice());
  ring.push([last.left[0] + last.t[0] * grow, last.left[1] + last.t[1] * grow]);
  ring.push([last.right[0] + last.t[0] * grow, last.right[1] + last.t[1] * grow]);
  for (let k = stations.length - 1; k >= 0; k--) ring.push(stations[k].right.slice());
  ring.push([first.right[0] - first.t[0] * grow, first.right[1] - first.t[1] * grow]);
  return ring;
}

/**
 * ⭐⭐⭐ **CUT THE WATERCOURSE INTO THE PARTITION.** One `insertRing` of the water polygon, then
 * every face inside it becomes `WATER`. ⚠ IT RUNS AT THE FOUNDING, BEFORE ONE WAY IS LAID — the
 * river is older than the town, and cutting it first is what makes every later construction act a
 * chord inside ONE bank's ground rather than something that has to remember not to cross.
 *
 * @param {any} state the constructor's state (arrangement, input, stamp, counters)
 * @param {any} ep    the epoch record the cut is stamped into
 */
export function cutWatercourse(state, ep) {
  const { arr, input } = state;
  const water = input.water;
  const out = {
    stations: 0, faces: [], bankEdges: 0, refused: 0, retyped: 0, breaks: 0, kind: null,
  };
  if (!water || !water.line || water.line.length < 4) {
    out.reason = 'no watercourse on this leaf: no bank, no water face, no crossing';
    return out;
  }
  const stations = bankStations(water, input.extent);
  // ⚠ ONLY THE STATIONS THAT REACH THE SETTLED GROUND. A channel that passes a hundred units
  //   outside the extent has no bank to give the partition, and cutting one would put edges in
  //   ground that is not the settlement's.
  const near = stations.filter((s) => Math.hypot(s.at[0] - input.extent.cx, s.at[1] - input.extent.cy)
    <= input.extent.radius * 1.25);
  if (near.length < BANK_LAW.minStations) {
    out.reason = `the channel reaches the extent at ${near.length} station(s), under the`
      + ` ${BANK_LAW.minStations}-station floor: it stays a refusal mask`;
    return out;
  }
  const ring = waterRing(near, input.extent);
  if (!ring) { out.reason = 'the water polygon collapsed'; return out; }
  const kind = water.kind || 'river';
  out.kind = kind;
  out.stations = near.length;

  // ⭐⭐⭐ **THE CUT IS `cutWay`'s SHAPE WITH A MEANDER FOR A KERB.** Two bank chains for a river,
  //    ONE for a coast — because *"the shore is an EDGE, not a division"* is `waterMode`'s own
  //    ruling and a sea has only one bank. Each chain divides the ground it crosses; the middle is
  //    the body. There is no ring insertion and no island: see `cutFaceByChain`'s header for the
  //    two refusals a ring formulation earns instead.
  // ⚠ THE PROBE IS THE STATION NEAREST THE **CENTRE**, NOT THE MIDDLE OF THE LIST. On the fjord the
  //   coast only clips a corner of the extent, so the list's midpoint sits outside the settled
  //   ground and the whole cut refused with *"the channel midpoint is not on the settled ground"* —
  //   a leaf with a real shore reporting no water at all.
  let probe = near[0]; let pd = Infinity;
  for (const s of near) {
    const d = Math.hypot(s.at[0] - input.extent.cx, s.at[1] - input.extent.cy);
    if (d < pd) { pd = d; probe = s; }
  }
  const host0 = locateFaceAt(arr, probe.at);
  if (host0 < 0) { out.reason = 'the channel midpoint is not on the settled ground'; return out; }

  const spec = (side) => ({
    type: 'BANK', key: `bank.${side}`, frontier: false,
    attrs: { water: true, kind, bank: side },
  });
  const first = cutFaceByChain(arr, host0, bankChain(near, 'left', input.extent), spec('left'));
  if (!first) { out.refused++; out.reason = 'the first bank chain could not be cut'; return out; }
  out.bankEdges += first.edges.length;
  out.clipped = first.clipped;
  markChainFrontier(arr, first.edges);

  let body;
  if (kind === 'coast') {
    // ⭐ A COAST'S WATER IS THE SEAWARD HALF. The probe steps off the shore by a road width toward
    //   `-bankSide`, which is `deriveWaterMode`'s own sign for "the side the town is NOT on".
    const side = Number.isFinite(water.bankSide) ? (water.bankSide < 0 ? -1 : 1) : 1;
    const step = (input.roadWidth || 5) * 2;
    const seaward = [probe.at[0] - probe.n[0] * side * step, probe.at[1] - probe.n[1] * side * step];
    body = first.faces.find((f) => pointInFace(arr, f, seaward));
  } else {
    const target = first.faces.find((f) => pointInFace(arr, f, probe.at));
    if (target === undefined) { out.refused++; out.reason = 'the right bank left both faces'; return out; }
    const second = cutFaceByChain(arr, target, bankChain(near, 'right', input.extent), spec('right'));
    if (!second) { out.refused++; out.reason = 'the second bank chain could not be cut'; return out; }
    out.bankEdges += second.edges.length;
    out.clipped += second.clipped;
    markChainFrontier(arr, second.edges);
    body = second.faces.find((f) => pointInFace(arr, f, probe.at));
  }
  if (body === undefined) { out.refused++; out.reason = 'the water body could not be identified'; return out; }

  arr.faces[body].cls = 'WATER';
  arr.faces[body].attrs = { ...arr.faces[body].attrs, water: true, waterKind: kind };
  out.faces.push(body);
  state.stamp(`water.${body}`, 'FOUNDING', ep,
    `the ${kind} the site carries, cut as ground at the founding — its banks read from the §648`
    + ' width profile through `stationAt`, the one authority');

  state.waterRing = ring;
  state.waterStations = near;
  out.reason = `${out.faces.length} water face(s) bounded by ${out.bankEdges} bank edge(s) over`
    + ` ${near.length} station(s) of a ${kind}; ${out.clipped || 0} station(s) clipped outside the`
    + ` extent, ${out.refused} cut refusal(s)`;
  return out;
}

/**
 * ⭐⭐⭐ **THE CHAIN'S TWO END EDGES ARE THE WATER'S FRONTIER, NOT ITS BANK — AND §1 ALREADY HAS THE
 * WORD FOR THEM.** *"FRONTIER vertices/edges mark where the next epoch may add pieces."* A bank
 * chain must reach past the extent for `cutFaceByChain` to have anything to cut, so its first and
 * last edges run from the channel's last real station out to the rim. That stretch is where the
 * water LEAVES THE MAP; it is not ground meeting water and it has no business being measured as a
 * bank.
 * ⛔ MEASURED, and it is why this is a marking rather than a census exemption: on the city's shore
 * those two edges were SPLIT by later construction acts, and each split minted a vertex 55 and 62
 * units from the drawn shore — a bank hanging in open country that the agreement arm rightly
 * convicted. Marking the EDGE lets `splitEdge`'s own `if (e.frontier)` propagation carry the flag
 * to every split point it will ever make, so the fix holds for acts that have not happened yet.
 */
function markChainFrontier(arr, edges) {
  if (!edges || !edges.length) return;
  for (const eid of [edges[0], edges[edges.length - 1]]) {
    const e = arr.edges[eid];
    if (!e) continue;
    e.frontier = true;
    e.attrs = { ...e.attrs, frontierTail: true };
    const h = arr.halfEdges[e.he];
    arr.verts[h.origin].frontier = true;
    arr.verts[arr.halfEdges[h.twin].origin].frontier = true;
  }
}

/** Locate the smallest live face containing a world point. */
function locateFaceAt(arr, p) {
  let best = -1; let bestA = Infinity;
  for (const f of liveFaces(arr)) {
    if (!pointInFace(arr, f.id, p)) continue;
    const a = faceArea(arr, f.id);
    if (a < bestA) { bestA = a; best = f.id; }
  }
  return best;
}

/** The bank vertex ids a station resolved to, or null when the insertion refused that station. */
function stationVertices(arr, s) {
  const vl = vertexAt(arr, s.left[0], s.left[1]);
  const vr = vertexAt(arr, s.right[0], s.right[1]);
  return (vl >= 0 && vr >= 0) ? [vl, vr] : null;
}

/** The bearing of the nearest WAY face to a point, in degrees, or null. */
function approachBearing(state, p) {
  let best = null; let bd = Infinity;
  for (const w of state.wayIndex) {
    const d = Math.hypot(w.at[0] - p[0], w.at[1] - p[1]);
    if (d < bd) { bd = d; best = w.bearing; }
  }
  return best;
}

/** The unsigned kink between two bearings, folded into 0..90 — a road has no direction. */
function kinkDeg(a, b) {
  let d = Math.abs(((a - b) % 180) + 180) % 180;
  if (d > 90) d = 180 - d;
  return d;
}

/**
 * ⭐⭐⭐ **§3e's CROSSINGS, AS TYPED EDGES.** A crossing is a chord across the WATER face joining
 * two BANK nodes — which is §1's sentence taken literally (*"a typed edge joining two bank
 * nodes"*), and it means a crossing SPLITS the water the way every other act splits its ground.
 * There is no deck object, no stroke and no exemption: the census can ask *"does every CROSSING
 * edge join two bank nodes"* and the answer is structural.
 *
 * THE THREE KINDS, EACH EARNED BY A DIFFERENT THING (§3e):
 *   BRIDGE — the admissible NARROWS, gated by `CROSSING_BUDGET.popFloor` and the 75° kink law.
 *   FORD   — the WIDE reach (`FORD_LAW.wideBand`), which is where a river is shallow.
 *   FERRY  — a corridor demands a crossing and NO DECK IS EARNED. It is the residual by design,
 *            and it is what a settlement below the bridge floor on a deep reach actually has.
 */
export function mintCrossings(state, ep, population) {
  const { arr, input } = state;
  const made = [];
  const stations = state.waterStations || [];
  if (!stations.length) return made;
  const rw = input.roadWidth || 5;
  const apart = Math.max(input.water.width * CROSSING_LAW.apartWidths, rw * CROSSING_LAW.apartRoads);
  // ⚠ A COAST HAS NO FAR BANK. Crossing a shore is not a crossing, it is a pier — that is the
  //   QUAY's business below, and minting a "bridge" over the sea would be the census's own lie.
  if ((input.water.kind || 'river') !== 'river') return made;

  // the candidate stations: both bank vertices present, and the midpoint genuinely in water
  const cands = [];
  for (const s of stations) {
    const vs = stationVertices(arr, s);
    if (!vs) continue;
    const mid = [(s.left[0] + s.right[0]) / 2, (s.left[1] + s.right[1]) / 2];
    const host = liveFaces(arr).find((f) => f.cls === 'WATER'
      && pointInFace(arr, f.id, mid));
    if (!host) continue;
    cands.push({ s, vL: vs[0], vR: vs[1], face: host.id, mid, w: s.w });
  }
  if (!cands.length) return made;

  const widths = cands.map((c) => c.w).sort((a, b) => a - b);
  const wideBar = widths[Math.min(widths.length - 1, Math.floor(CROSSING_LAW.wideBand * widths.length))];

  /** Is the approach at both bankheads inside the kink budget? */
  const kinkOk = (c) => {
    const chord = Math.atan2(c.s.right[1] - c.s.left[1], c.s.right[0] - c.s.left[0]) * DEG;
    for (const p of [c.s.left, c.s.right]) {
      const b = approachBearing(state, p);
      if (b === null) return false;
      if (kinkDeg(b, chord) > CROSSING_LAW.kinkMaxDeg) return false;
    }
    return true;
  };

  const ranked = [];
  // BRIDGE — narrowest first, and only where the settlement can pay for a public work.
  if (population >= CROSSING_LAW.popFloor) {
    for (const c of cands.slice().sort((a, b) => a.w - b.w || a.s.i - b.s.i)) {
      if (kinkOk(c)) ranked.push({ ...c, kind: 'bridge', why: `the admissible narrows (local width ${c.w.toFixed(2)}) with an approach inside the ${CROSSING_LAW.kinkMaxDeg}° kink budget, and ${population} souls against the ${CROSSING_LAW.popFloor}-soul public-works floor` });
    }
  }
  // FORD — the wide reach, which is where the water is shallow enough to walk.
  for (const c of cands.slice().sort((a, b) => b.w - a.w || a.s.i - b.s.i)) {
    if (c.w >= wideBar) ranked.push({ ...c, kind: 'ford', why: `the wide reach (local width ${c.w.toFixed(2)} at or above the ${CROSSING_LAW.wideBand} width quantile ${wideBar.toFixed(2)}) — a ford is shallow because it is wide` });
  }
  // FERRY — the corridor demands a crossing and no deck was earned. The residual, by design.
  for (const c of cands.slice().sort((a, b) => a.s.i - b.s.i)) {
    if (approachBearing(state, c.s.left) !== null && approachBearing(state, c.s.right) !== null) {
      ranked.push({ ...c, kind: 'ferry', why: 'a corridor reaches both banks and no deck is earned here — the ferry is what the settlement actually has' });
    }
  }

  // ⛔⛔ **A SETTLEMENT BELOW THE PUBLIC-WORKS FLOOR HAS ***ONE*** CROSSING, AND THAT CAP IS WHAT
  // LEAVES ROOM FOR THE BRIDGE IT HAS NOT EARNED YET.**
  // MEASURED before this line: the `crossing` leaf — the one exemplar whose own water relationship
  // reads *"EARNED a crossing: 3502 souls on a crossroads route at a bridgeable reach — the bridge
  // is the reason the town is here"* — came out with **four fords and no bridge**. The cause is
  // ORDER, not siting: `mintCrossings` is asked every epoch, the founding epoch's population is far
  // under `popFloor`, and four fords filled `maxPerLeaf` before the settlement was ever large
  // enough for the bridge branch to run. A ford is what a place HAS until it can build a bridge;
  // spending the whole crossing budget on fords at the founding writes a history backwards.
  const budgetNow = population >= CROSSING_LAW.popFloor ? CROSSING_LAW.maxPerLeaf : 1;
  for (const c of ranked) {
    if (state.crossings.length + made.length >= budgetNow) break;
    if (made.length >= CROSSING_LAW.maxPerLeaf) break;
    if (made.some((m) => Math.hypot(m.at[0] - c.mid[0], m.at[1] - c.mid[1]) < apart)) continue;
    const face = arr.faces[c.face];
    if (!face || !face.alive || face.cls !== 'WATER') continue;
    const res = splitFaceChain(arr, c.face, c.vL, c.vR, [], {
      type: 'CROSSING', rank: null, key: `cross.${made.length}`,
      attrs: { crossingKind: c.kind, station: c.s.i, localWidth: c.w },
    });
    if (!res.ok) { state.crossingRefusals = (state.crossingRefusals || 0) + 1; continue; }
    // ⚠ THE TWO HALVES ARE BOTH STILL WATER. A crossing divides the body it spans; it does not
    //   drain it. Re-classing either half would make the water face count depend on how many
    //   bridges a town happened to earn.
    for (const f of res.faces) {
      arr.faces[f].cls = 'WATER';
      arr.faces[f].attrs = { ...arr.faces[f].attrs, water: true };
    }
    const rec = Object.freeze({
      kind: c.kind,
      at: Object.freeze(c.mid.slice()),
      station: c.s.i,
      localWidth: c.w,
      edges: Object.freeze(res.edges.slice()),
      bankNodes: Object.freeze([c.vL, c.vR]),
      epoch: state.epoch,
      year: ep ? ep.year : state.lastYear,
      reason: c.why,
    });
    made.push(rec);
    state.stamp(`crossing.${state.crossings.length + made.length - 1}`,
      state.wraps.length ? 'INFILL' : 'FOUNDING', ep, `a ${c.kind} at ${c.why}`);
  }
  return made;
}

/** Is a world point inside face `fid`? Ring test in world units. */
function pointInFace(arr, fid, p) {
  return inWaterRing(faceRing(arr, fid), p);
}

/**
 * ⭐⭐⭐ **§3e's QUAYS — AND THE §635.4 EXEMPTION BECOMES UNNECESSARY, WHICH IS THE WHOLE POINT.**
 * §3e: *"quays as water-edge pieces with moored sub-pieces (the §635.4 exemption becomes
 * unnecessary — a moored piece is a lawful face, not a refused body)."*
 *
 * A quay is cut like everything else: a chord inside the WATER face, from one bank node to another
 * a few stations along, bowed out into the channel by `QUAY_LAW.reachWidths` of the LOCAL width.
 * The half against the bank becomes a `PLOT` face carrying `moored: true` — a piece of tenure whose
 * ground happens to be over water. It needs no exemption because nothing refuses it: the ground law
 * that eats a pier is a predicate about DRAWN BODIES, and a face is not a body. It is counted in
 * the identity bijection exactly like every other plot, because it IS one.
 *
 * ⚠ IT IS SITED WHERE THE SETTLEMENT ALREADY TOUCHES THE WATER, never where a port ought to be:
 * the stations whose landward bank abuts a PLOT or WAY face. A quay minted at an empty reach would
 * be a work with nobody to use it.
 */
export function mintQuays(state, ep) {
  const { arr, input } = state;
  const made = [];
  const stations = state.waterStations || [];
  if (stations.length < QUAY_LAW.runStations + 1) return made;
  const side = Number.isFinite(input.water.bankSide) ? (input.water.bankSide < 0 ? -1 : 1) : 1;
  // ⭐⭐ **THE BUILT-GROUND ROSTER IS WALKED ONCE PER CALL, NOT ONCE PER PROBE — AND THE FIRST
  // SPELLING COST THE FJORD A SECOND.** `built()` originally ran `liveFaces(arr).find(...)` on every
  // ask: four asks per candidate run, fourteen runs, every epoch of the fold, over a face list that
  // reaches 2,500. MEASURED: the fjord's constructor went **2,759 ms at the seal to 3,640 ms**, and
  // this hoist is where the difference lives. It is still O(F) once, which is the honest price of
  // asking a question about all the ground.
  const reach = (input.roadWidth || 5) * 3;
  const builtAt = [];
  for (const x of liveFaces(arr)) {
    if (x.cls !== 'PLOT' && x.cls !== 'WAY' && x.cls !== 'VOID') continue;
    builtAt.push(faceCentroid(arr, x.id));
  }
  const built = (p) => {
    for (const c of builtAt) {
      if (Math.abs(c[0] - p[0]) > reach || Math.abs(c[1] - p[1]) > reach) continue;
      if (Math.hypot(c[0] - p[0], c[1] - p[1]) <= reach) return true;
    }
    return false;
  };
  // ⚠ THE CAP IS CUMULATIVE ACROSS THE FOLD, NOT PER EPOCH. `mintQuays` is asked every epoch, so a
  //   local-only cap lets each of twenty epochs mint four more — measured at 6 on the highwater leaf
  //   before this line, against a stated maximum of 4.
  for (let k = 0; k + QUAY_LAW.runStations < stations.length; k += QUAY_LAW.runStations * 2) {
    if (state.quays.length + made.length >= QUAY_LAW.maxPerLeaf) break;
    const a = stations[k]; const b = stations[k + QUAY_LAW.runStations];
    // ⭐ THE LANDWARD BANK. A coast's water is on `-bankSide`, so its quay hangs off `left`
    //   (the shore); a river's quay takes whichever bank the settlement has actually reached.
    const pick = (input.water.kind === 'coast') ? 'left'
      : (built(a.left) ? 'left' : (built(a.right) ? 'right' : null));
    if (!pick) continue;
    if (!built(a[pick]) || !built(b[pick])) continue;
    const vA = vertexAt(arr, a[pick][0], a[pick][1]);
    const vB = vertexAt(arr, b[pick][0], b[pick][1]);
    if (vA < 0 || vB < 0 || vA === vB) continue;
    const host = liveFaces(arr).find((f) => f.cls === 'WATER'
      && pointInFace(arr, f.id, [(a.at[0] + b.at[0]) / 2, (a.at[1] + b.at[1]) / 2]));
    if (!host) continue;
    // ⭐ THE BOW RUNS **INTO THE WATER**, and which way that is depends on the bank, not on a
    //   convention: a river's LEFT bank sits at +n·w/2 so its water is at −n; the RIGHT bank is the
    //   mirror; a coast's shore has water at −n·bankSide, which is the same sentence with one bank.
    const dir = (input.water.kind === 'coast') ? -side : (pick === 'left' ? -1 : 1);
    const bow = [];
    for (let j = k; j <= k + QUAY_LAW.runStations; j++) {
      const s = stations[j];
      const reach = s.w * QUAY_LAW.reachWidths;
      bow.push([s[pick][0] + s.n[0] * dir * reach, s[pick][1] + s.n[1] * dir * reach]);
    }
    const hostArea = faceArea(arr, host.id);
    const res = splitFaceChain(arr, host.id, vA, vB, bow.slice(1, -1), {
      type: 'BOUND', key: `quay.${state.quays.length + made.length}`, attrs: { quay: true },
    });
    if (!res.ok) { state.quayRefusals = (state.quayRefusals || 0) + 1; continue; }
    // ⛔⛔ **THE MOORED HALF IS FOUND BY A PROBE INSIDE IT, NOT BY THE NEARER CENTROID — AND THE
    // CENTROID SPELLING TOOK THE WHOLE RIVER.** Measured on the `crossing` leaf: the quay's own
    // face came back as the ENTIRE water body (`bank.left.19` through `33` all bounding one moored
    // piece), because on a bend the big face's centroid sits closer to the bank station than the
    // strip's does. The probe is the midpoint between the bank and the bow at the run's middle
    // station — a point that is inside the strip by construction, which is exactly how `cutWay`
    // identifies its carriageway and for exactly this reason.
    const mid = Math.floor(QUAY_LAW.runStations / 2);
    const sMid = stations[k + mid];
    const probe = [(sMid[pick][0] + sMid.n[0] * dir * sMid.w * QUAY_LAW.reachWidths * 0.5),
      (sMid[pick][1] + sMid.n[1] * dir * sMid.w * QUAY_LAW.reachWidths * 0.5)];
    const fid = res.faces.find((f) => pointInFace(arr, f, probe));
    if (fid === undefined) { state.quayRefusals = (state.quayRefusals || 0) + 1; continue; }
    // ⚠ AND AN AREA BAR BESIDE IT, because a probe can be right for the wrong reason. A quay that
    // takes more than a quarter of the body it moors on is not a quay, it is a mistake with a
    // plausible shape — refused and counted rather than drawn.
    if (faceArea(arr, fid) > hostArea * 0.25) {
      state.quayRefusals = (state.quayRefusals || 0) + 1;
      arr.faces[fid].cls = 'WATER';
      arr.faces[fid].attrs = { ...arr.faces[fid].attrs, water: true };
      continue;
    }
    arr.faces[fid].cls = 'PLOT';
    arr.faces[fid].attrs = {
      ...arr.faces[fid].attrs, moored: true, quay: `q${made.length}`, water: false,
      run: `q${made.length}`, block: `qb${made.length}`,
    };
    const blockPiece = mintPiece(arr, 'BLOCK', -1, state.rootWard, { quay: `q${made.length}` });
    const pid = mintPiece(arr, 'PLOT', fid, blockPiece, { moored: true, quay: `q${made.length}` });
    state.plots++;
    state.stamp(`plot.${pid}`, state.wraps.length ? 'INFILL' : 'FOUNDING', ep,
      `a moored quay piece on the ${input.water.kind || 'river'}'s ${pick} bank — a lawful face over`
      + ' water, which is why §635.4 needs no exemption for it');
    // the other half stays water
    for (const f of res.faces) {
      if (f === fid) continue;
      arr.faces[f].cls = 'WATER';
      arr.faces[f].attrs = { ...arr.faces[f].attrs, water: true };
    }
    made.push(Object.freeze({
      key: `q${made.length}`,
      piece: pid,
      face: fid,
      bank: pick,
      stations: [a.i, b.i],
      area: faceArea(arr, fid),
      epoch: state.epoch,
      reason: `a quay of ${QUAY_LAW.runStations} station(s) on the ${pick} bank, reaching`
        + ` ${QUAY_LAW.reachWidths} of the local width into the channel`,
    }));
  }
  return made;
}
