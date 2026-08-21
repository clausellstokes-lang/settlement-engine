/**
 * domain/townMap/fabric/builtUmbrella.js — ⭐⭐⭐ THE INVERSION (§181.2b, ONE LEVEL UP).
 *
 * MF-B3 closed its receipt with the largest remaining aesthetic distance named and the
 * mechanism written out: *"the UMBRELLA IS BIGGER THAN THE BLOCKS — the §5 footprint band
 * sizes the settlement's outline, the organisms' rank runs fill only part of it, and every
 * gap between them becomes street by the grid's own rhythm. The correction is to derive the
 * umbrella from the BLOCK RUNS the way §181.2b derived the extent from the roofs — the same
 * direction-of-derivation cure, one level up."* This module is that cure.
 *
 * ⭐⭐ THE DIRECTION OF DERIVATION, STATED ONCE. §5.0c.3 says "the town outline is the
 * UMBRELLA: the union of the district organisms." That is TRUE and it is a statement about
 * WHICH GROUND THE TOWN MAY OCCUPY — the organisms' influence fields are the settlement's
 * claim. It is not a statement about which ground the town DID occupy. The drawn outline is
 * the second thing: a reader looking at a plan sees where the houses stop. Between the two
 * lies every cell the terrain refused, the culls skipped, the packer could not fit a plot
 * into — and MF-B3 painted all of it as town.
 *
 * So the two are BOTH kept and they are ordered:
 *   • the GROWTH umbrella (organismFields → umbrella.js) bounds what may be built. Every
 *     stage that must run before the fabric exists reads it, because it is the only outline
 *     that exists yet.
 *   • the BUILT umbrella (this module) is what the leaf DRAWS. It is derived from the rank
 *     runs the packer actually cut, and it is a SUBSET of the growth umbrella by
 *     construction — the town can only ever have built inside its own claim.
 *
 * ⭐⭐⭐ THE MECHANISM IS A MORPHOLOGICAL CLOSING AT THE WIDTH OF THE TOWN'S OWN STREETS, and
 * that single sentence is the whole derivation:
 *
 *     **a gap a street wide is INSIDE the town; a gap wider than any street is a GREEN.**
 *
 * That is not a smoothing convenience — it is the definition a surveyor would have used.
 * The ground between two facing ranks of houses is the street, and the street is part of the
 * town; the paddock the town grew around is not built, and it renders as the common ground
 * it is. One structuring element decides both, so the two answers can never disagree, and
 * the interior greens §5.0c.3 asks for fall out of the same operation that closes the
 * streets rather than being reserved by a second mechanism that could contradict it.
 *
 * ⚠ AND THE EDGE MARGIN IS THE BACK FENCE, NOT A FUDGE. A town's drawn edge sits a little
 * beyond its last facade, because the last plot has a yard behind it and a hedge behind
 * that. The dilation after the closing is that depth, expressed in the settlement's own
 * module like every other length here.
 *
 * PURITY: pure. No Date, no Math.random, no runtime trig, no ambient rng. The disc
 * structuring elements are integer offset lists, so the operation is isotropic AND exact —
 * no chamfer approximation and no floating-point distance transform to drift across
 * machines (the cross-machine ULP law).
 */

import { buildUmbrella } from './umbrella.js';
import { pointInPolygon, ringIndex } from './fabricGeometry.js';
import { ringCentroid, shrinkAbout } from './epochAxis.js';

/**
 * The closing radius, as a multiple of the widest ordinary interior street.
 *
 * §42/§43 VALUE, DERIVED RATHER THAN CHOSEN: 1.0 means "exactly one street". A value below
 * 1 would leave the town's own carriageways OUTSIDE its outline — the settlement drawn as a
 * scatter of disconnected blocks, which is the opposite defect. A value much above 1 starts
 * swallowing the greens the same operation is supposed to leave open, and at 1.6 the
 * interior greens vanished entirely on the corpus (measured). The high street is wider than
 * `organism` and is deliberately NOT the element: a settlement is not obliged to close over
 * its own through-route, and the two towns in this corpus whose high street runs off-centre
 * read better with the road visibly entering the fabric.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const CLOSE_STREETS = 1.0;

/**
 * How far beyond the last facade the drawn edge sits, in plot frontages — the yard and the
 * hedge behind the edge plot. §42/§43 VALUE, READ OFF THE FABRIC: a plot's depth runs
 * 1.3–2.35 frontages and roughly half of it is yard, so 0.85 is the back of the last plot.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const EDGE_MARGIN = 0.85;

/**
 * A green must be a real place — a garden, a paddock, a churchyard. Below this it is the
 * arithmetic residue of a closing rather than a piece of ground, and drawing it puts a
 * shoal of pale specks through the fabric.
 * ⚠ Absolute view units, never cell-relative — the same lesson umbrella.js records: an area
 * spelled in cells silently changes meaning when the trace resolution changes.
 */
export const MIN_BUILT_GREEN = 900;

/**
 * The circuit's own closing radius, in plot frontages — how deep a notch in the fabric a
 * wall would rather cut across than walk into. §42/§43 VALUE, ARGUED FROM COST: walling a
 * notch of depth d adds about 2d of curtain to save the ground inside it, so the break-even
 * is where the notch is worth two of its own depths in wall. Six frontages is a couple of
 * block runs — the scale at which a real circuit visibly cuts a chord (every surviving
 * medieval circuit does this somewhere). ⚠ UNSOAKED; rides the tuning signature.
 */
export const WALL_CLOSE_FRONTAGES = 6;

/** Integer disc offsets of radius r cells — the structuring element, built once per call. */
function disc(r) {
  /** @type {Array<[number, number]>} */ const out = [];
  const rr = r * r;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= rr) out.push([dx, dy]);
  }
  return out;
}

/** Dilate a binary mask by a disc. */
function dilate(mask, n, off) {
  const out = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      if (mask[j * n + i] !== 1) continue;
      for (const [dx, dy] of off) {
        const x = i + dx, y = j + dy;
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        out[y * n + x] = 1;
      }
    }
  }
  return out;
}

/** Erode a binary mask by a disc. A cell survives when every disc offset is set — and a
 *  disc offset that falls OFF the grid counts as set, so the frame edge never erodes the
 *  fabric of a town that legitimately runs off its own leaf (a port, a ribbon suburb). */
function erode(mask, n, off) {
  const out = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      let all = true;
      for (const [dx, dy] of off) {
        const x = i + dx, y = j + dy;
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        if (mask[y * n + x] !== 1) { all = false; break; }
      }
      if (all) out[j * n + i] = 1;
    }
  }
  return out;
}

/** Stamp every cell whose centre falls inside `poly`, bbox-guarded. */
function stampPolygon(mask, n, cell, poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  const i0 = Math.max(0, Math.floor(x0 / cell)), i1 = Math.min(n - 1, Math.floor(x1 / cell));
  const j0 = Math.max(0, Math.floor(y0 / cell)), j1 = Math.min(n - 1, Math.floor(y1 / cell));
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      if (mask[j * n + i] === 1) continue;
      if (pointInPolygon((i + 0.5) * cell, (j + 0.5) * cell, poly)) mask[j * n + i] = 1;
    }
  }
}

/** Stamp a disc. */
function stampDisc(mask, n, cell, cx, cy, r) {
  const i0 = Math.max(0, Math.floor((cx - r) / cell)), i1 = Math.min(n - 1, Math.floor((cx + r) / cell));
  const j0 = Math.max(0, Math.floor((cy - r) / cell)), j1 = Math.min(n - 1, Math.floor((cy + r) / cell));
  const rr = r * r;
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const dx = (i + 0.5) * cell - cx, dy = (j + 0.5) * cell - cy;
      if (dx * dx + dy * dy <= rr) mask[j * n + i] = 1;
    }
  }
}

/**
 * Derive the BUILT umbrella from the fabric the packer cut.
 *
 * @param {Object} args
 * @param {import('./organismFields.js').PartitionGrid} args.part   the growth partition
 * @param {import('./organisms.js').Organism[]} args.orgs
 * @param {Array<{ polygon:Array<[number,number]> }>} args.blocks   the rank runs
 * @param {Array<{ x:number, y:number, r:number }>} [args.compounds]
 * @param {Array<{ center:[number,number], radius:number }>} [args.squares]
 * @param {Array<any>} [args.landmarks]
 * @param {number} args.frontage
 * @param {{ organism:number }} args.widths
 * @param {string} args.key
 * @returns {{ umbrella:any, part:any, reason:string, growthCells:number, builtCells:number }}
 */
export function deriveBuiltUmbrella(args) {
  const { part, orgs, blocks, frontage, widths, key } = args;
  const n = part.n, cell = part.cell;
  const mask = new Uint8Array(n * n);

  // ── 1 · THE FABRIC ITSELF. The BLOCK, not the parcel: a rank run is the plots AND their
  //       yards, and a yard is inside the town by anyone's reading.
  for (const b of blocks) stampPolygon(mask, n, cell, b.polygon);

  // ── 2 · THE GROUND THE TOWN RESERVED FOR ITSELF. A market place is the most urban thing
  //       on the leaf and carries no block at all; a cathedral close is town whether or not
  //       a burgage was cut in it. Omitting either would punch the settlement's own heart
  //       out of its own outline — measured on the first spelling, which drew the city with
  //       a hole where its market was.
  for (const sq of (args.squares || [])) stampDisc(mask, n, cell, sq.center[0], sq.center[1], sq.radius);
  for (const c of (args.compounds || [])) stampDisc(mask, n, cell, c.x, c.y, c.r);
  for (const lm of (args.landmarks || [])) {
    if (lm && Number.isFinite(lm.x) && Number.isFinite(lm.size)) {
      stampDisc(mask, n, cell, lm.x, lm.y, Math.max(lm.size, frontage * 0.5));
    }
  }

  let builtCells = 0;
  for (let k = 0; k < mask.length; k++) builtCells += mask[k];

  // ── 3 · THE CLOSING AT THE WIDTH OF THE TOWN'S OWN STREETS.
  const closeR = Math.max(1, Math.round((widths.organism * CLOSE_STREETS) / cell));
  const closeOff = disc(closeR);
  const closed = erode(dilate(mask, n, closeOff), n, closeOff);

  // ── 4 · THE BACK FENCE.
  const edgeR = Math.max(1, Math.round((frontage * EDGE_MARGIN) / cell));
  const grown = dilate(closed, n, disc(edgeR));

  // ── 5 · THE CLAIM BOUNDS THE DRAWING. A town cannot have built where its own organisms
  //       never reached, so the built outline is intersected with the growth umbrella —
  //       which also makes the change MONOTONE and therefore provable: the built umbrella is
  //       a subset of the growth umbrella on every leaf, at every tier, forever.
  const inside = new Uint8Array(n * n);
  const contested = new Uint8Array(n * n);
  // ⛔⛔ THE OWNER MAP IS MASKED TOO, AND THE FIRST SPELLING FORGOT IT — a defect this lane
  // created and then caught, worth recording because it is a whole class.
  // A PartitionGrid is FOUR parallel arrays describing ONE shape. Masking `inside` and
  // handing back the ORIGINAL `owner` produces a structure whose arrays describe two
  // different settlements, and every consumer that asks its question of the wrong array
  // gets the old answer with no error anywhere. `ownerAt(part, x, y) >= 0` is exactly that
  // consumer, and it is how `seatInstitutions` decides §161c ring legality — so the
  // ordinary institutions kept seating against the CLAIM after the drawing had contracted.
  // MEASURED on the riverside town: eleven INTRAMURAL institutions — bakers, blacksmiths,
  // the cobbler's guild, four craft guilds — seated outside the drawn town on flat, empty,
  // perfectly buildable ground (slopes 0.03–0.12), each rendering as a building in a field.
  // ⭐ THE CLASS: WHEN A DERIVED STRUCTURE CARRIES SEVERAL PARALLEL ARRAYS, NARROWING ONE OF
  // THEM IS NOT NARROWING THE STRUCTURE — and the array nobody re-derived is the one that
  // keeps answering for the shape you replaced.
  const owner = new Int16Array(n * n).fill(-1);
  let growthCells = 0, keptCells = 0;
  for (let k = 0; k < inside.length; k++) {
    if (part.inside[k] === 1) growthCells++;
    if (grown[k] === 1 && part.inside[k] === 1) {
      inside[k] = 1;
      keptCells++;
      contested[k] = part.contested[k];
      owner[k] = part.owner[k];
    }
  }

  const built = { n, cell, inside, owner, contested };
  const umbrella = buildUmbrella(built, orgs, { key, minGreenArea: MIN_BUILT_GREEN });

  // ── 6 · ⭐⭐ THE CIRCUIT BODY — §161m.1's CIRCUIT ECONOMY, WHICH IS NOT THE SAME OUTLINE.
  //
  // ⛔ THE DEFECT THE INVERSION CREATED, AND IT IS AN HONEST ONE. `traceWalls` resamples the
  // umbrella's largest component by arc length. While the umbrella was the organisms' slack
  // blob that was fine; derived from the block runs it has real bays between the quarters,
  // and the wall dutifully walked INTO every one of them — a circuit wandering through the
  // middle of its own town, in the heaviest ink on the page.
  //
  // ⭐ AND THE CURE IS THE CHARTER'S OWN SENTENCE READ PROPERLY: "every meter cost a
  // fortune, so the wall hugs the fabric tight WITH A BANDED WORKING MARGIN." A circuit that
  // follows a notch is LONGER than one that cuts across it, so walling the notch is the one
  // thing circuit economy forbids. **A WALL DOES NOT GO ROUND A NOTCH NARROWER THAN IT
  // WOULD COST TO WALL** — which is the same morphological closing again, at the radius the
  // wall's own economics set instead of the street's.
  const wallR = Math.max(closeR + 1, Math.round((frontage * WALL_CLOSE_FRONTAGES) / cell));
  const circuitMask = erode(dilate(mask, n, disc(wallR)), n, disc(wallR));
  const circuitTrace = buildUmbrella(
    { n, cell, inside: circuitMask, owner, contested },
    [], { key: `${key}|circuit`, minGreenArea: 1e9 },
  );
  const circuitRing = circuitTrace.components[0] || umbrella.components[0] || null;

  return {
    umbrella,
    circuitRing,
    // ⭐⭐ MF-ARCH-2 · THE RAW BUILT MASK AND THE WALL'S OWN CLOSING RADIUS ARE PUBLISHED, so an
    // EPOCH can be closed from the same cells at the same radius rather than from a scaled copy
    // of the finished outline (ODQ §240 — see epochCircuitRing below).
    bodyMask: mask,
    wallCloseR: wallR,
    part: built,
    growthCells,
    builtCells,
    keptCells,
    reason: `built umbrella from ${blocks.length} rank runs, closed at ${closeR} cells`
      + ` (${Math.round(widths.organism * CLOSE_STREETS)} units — one ordinary street) and grown`
      + ` ${edgeR} cells to the back of the edge plots; ${keptCells} of ${growthCells} growth cells kept`
      + ` (${Math.round((1000 * keptCells) / Math.max(1, growthCells)) / 10}%)`,
  };
}

/**
 * ⭐⭐⭐ MF-ARCH-2 · THE CIRCUIT BODY OF ONE EPOCH (owner law ODQ §240).
 *
 * ⛔ WHAT THIS REPLACES, AND WHY THE REPLACEMENT IS THE POINT. An older ring used to be drawn by
 * SHRINKING TODAY'S OUTLINE about its own centroid — so the old core came out as a miniature of
 * the modern silhouette, sharing its every bay and lobe. That is a concentric decoration, which
 * is the §157 defect `walls.js` names in its own comment about a different arm; two rings drawn
 * that way tell the reader nothing except that somebody scaled a polygon.
 *
 * ⭐ THE EPOCH'S BODY IS THE FABRIC INSIDE ITS OWN EXTENT, CLOSED AT THE WALL'S OWN ECONOMICS.
 * The same cells the built umbrella was made from are cut at the epoch's extent and closed at
 * the same `WALL_CLOSE_FRONTAGES` radius, so the old circuit has its OWN shape — its own
 * notches cut across, its own bays kept — and the two vintages read as two different towns
 * rather than as nested copies of one. §240.3's vintage triad falls out of this for free.
 *
 * ⚠ THE EXTENT CUTS CELLS, NOT WHOLE BODIES, and that is deliberate: a block run straddling the
 * epoch boundary is exactly the block a wall was driven through, and the closing then decides
 * whether the circuit walks round it or cuts the chord — which is the wall's own economics
 * answering the question rather than a tie-break rule.
 *
 * @param {Object} a
 * @returns {Array<[number,number]>|null}
 */
export function epochCircuitRing(a) {
  const { part, bodyMask, wallCloseR, extent, ring, key } = a;
  if (!ring) return null;
  if (extent >= 1) return ring;
  const n = part.n, cell = part.cell;
  const shrunk = shrinkAbout(ring, ringCentroid(ring), extent);
  const m = new Uint8Array(n * n);
  // ⭐ MF-PERF1 · `ringIndex` IS THE SAME PARITY FROM THE SAME ARITHMETIC ON A PROVABLY
  // SUFFICIENT SUBSET OF EDGES (see its header) — no tolerance, no quantization, no changed
  // answer. The scan is up to 128² cells against a traced ring of hundreds of vertices and it
  // runs once per walled epoch per leaf; it profiled at 3.6 % of the whole build.
  const inShrunk = ringIndex([shrunk]);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = j * n + i;
      if (bodyMask[k] !== 1) continue;
      if (inShrunk.contains((i + 0.5) * cell, (j + 0.5) * cell)) m[k] = 1;
    }
  }
  const off = disc(wallCloseR);
  const closed = erode(dilate(m, n, off), n, off);
  const trace = buildUmbrella(
    { n, cell, inside: closed, owner: part.owner, contested: part.contested },
    [], { key, minGreenArea: 1e9 },
  );
  return trace.components[0] || null;
}

/**
 * ⭐⭐⭐ THE VOIDS ARE EDGED BY FACADES (chair mandate, MF-B4) — "the green/square edged by
 * facades, not floating fabric."
 *
 * ⛔ WHAT WAS WRONG, and it is subtle enough to survive three lanes. A square is derived as
 * a blob of chosen radius and the forbidden predicate refuses plots within `radius × 1.04`,
 * so the nearest facade stands a little OUTSIDE the drawn square and a rind of urban wash
 * runs all the way round it. The reader sees a pale shape lying ON the town rather than a
 * ROOM the buildings make — which is the whole difference between a market place and a gap.
 * Every real square on every reference plate is bounded by the fronts that face it: the
 * buildings are the walls of the room.
 *
 * ⭐ THE CURE IS TO LET THE BUILDINGS SAY WHERE THE SQUARE ENDS. Each vertex is marched
 * outward along its own ray from the square's centre until it meets a facade — so the drawn
 * boundary lands ON the fronts, and the square's shape becomes a fact about the fabric round
 * it instead of a seeded blob. The march is CAPPED (a ray that escapes down a street would
 * otherwise run to the edge of the town): the cap is where a square stops being a square and
 * becomes the street leaving it, and the short spurs that survive at the street mouths are
 * exactly what a real market place looks like where its roads run in.
 *
 * ⚠ THE MARCH ONLY EVER GROWS the void, into ground the packer had already refused — so it
 * cannot take a plot, and no parcel needs re-cutting. That is what lets it run after the
 * pack instead of forcing another composition-order stage.
 *
 * @param {Object} args
 * @returns {{ voids:Array<any>, moved:number, reason:string }}
 */
export function faceTheVoids(args) {
  const { voids, parcels, landmarks, frontage } = args;
  const cap = args.capFrontages == null ? 1.7 : args.capFrontages;
  const N = 256, cell = 1000 / N;
  const built = new Uint8Array(N * N);
  for (const p of (parcels || [])) {
    stampPolygon(built, N, cell, p.polygon);
    if (p.backHouse) stampPolygon(built, N, cell, p.backHouse);
  }
  for (const lm of (landmarks || [])) {
    if (Number.isFinite(lm.x) && Number.isFinite(lm.size)) stampDisc(built, N, cell, lm.x, lm.y, lm.size);
  }
  const isBuilt = (x, y) => {
    const i = Math.floor(x / cell), j = Math.floor(y / cell);
    if (i < 0 || j < 0 || i >= N || j >= N) return true;      // off the leaf stops a march
    return built[j * N + i] === 1;
  };
  let moved = 0;
  const out = (voids || []).map((v) => {
    const poly = v.polygon;
    if (!poly || poly.length < 4) return v;
    const cx = v.center ? v.center[0] : poly.reduce((a, p) => a + p[0], 0) / poly.length;
    const cy = v.center ? v.center[1] : poly.reduce((a, p) => a + p[1], 0) / poly.length;
    const step = Math.max(1.0, frontage * 0.18);
    let any = false;
    const grown = poly.map((p) => {
      const dx = p[0] - cx, dy = p[1] - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= 0) return p;
      const ux = dx / d, uy = dy / d;
      const limit = frontage * cap;
      let t = 0;
      while (t + step <= limit) {
        const nx = p[0] + ux * (t + step), ny = p[1] + uy * (t + step);
        if (isBuilt(nx, ny)) break;
        t += step;
      }
      if (t > 0) any = true;
      return /** @type {[number,number]} */ ([p[0] + ux * t, p[1] + uy * t]);
    });
    if (any) moved++;
    // ⭐⭐⭐ ⟦SW-1e⟧ **THE FIELDS THIS RE-DERIVATION INVALIDATES ARE RE-DERIVED, AND THE ONE IT
    //    DOES NOT ARE CARRIED WITH THE REASON** — SW-1's manifest rule (laneMFD1-receipt §8.4):
    //    every field of a new version declares itself RE-DERIVED, CARRIED (with the stated reason
    //    it is independent of what changed) or STALE-BY-DECLARATION.
    //
    // ⛔⛔ THE DEFECT, MEASURED AT MF-D1: **22 of 22 published squares carried a radius SMALLER
    //    than their own drawn polygon's reach — worst 3.337× (thorp `square.heart`, 19.78 against
    //    66.01).** This function re-derived `polygon` and carried `center`/`radius` forward
    //    untouched, so every consumer that asked a square how far it reached got the answer for a
    //    shape that no longer existed: `webConnectivity` decides which channels FRONT a void by
    //    `radius + width*0.75`, and `leafCensus` prints the market-void figure off the same
    //    number. ⭐ THE CLASS: **a partial re-derivation leaves the fields it did not re-derive
    //    describing the version it replaced**, and nothing reds because both fields are present
    //    and finite.
    //
    //    `center`  CARRIED — and the reason is structural, not convenience: the march runs along
    //              rays FROM THIS EXACT POINT, so the centre is a construction INPUT to the grown
    //              polygon rather than a summary of it. Re-deriving it would move the origin of
    //              the very rays that produced the shape.
    //    `radius`  RE-DERIVED — it is the void's reach, and the reach is what just changed. The
    //              nominal mint radius was already short of the polygon by `organicBlob`'s own
    //              roughness (±17%) BEFORE any facing, so this cures the mint case too.
    // ⚠ ONLY WHERE THE CALLER HANDED US ONE. The greens arrive as bare `{polygon}` and must not
    //   grow a field they never had — a version that ADDS keys is a different drift.
    const next = { ...v, polygon: grown, faced: any };
    if (Number.isFinite(v.radius) && v.center) {
      let reach = 0;
      for (const p of grown) {
        const d = Math.sqrt((p[0] - cx) * (p[0] - cx) + (p[1] - cy) * (p[1] - cy));
        if (d > reach) reach = d;
      }
      next.radius = reach;
      next.nominalRadius = v.radius;    // what the blob was seeded from, kept so the delta is auditable
    }
    return next;
  });
  return {
    voids: out,
    moved,
    reason: `${moved} of ${(voids || []).length} voids grown out to the facades that front them`
      + ` (capped at ${cap} frontages, so a ray down a street stops where the square does);`
      + ' each faced void re-derives its own reach, and carries its centre because the march ran'
      + ' from it',
  };
}
