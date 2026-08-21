/**
 * domain/townMap/fabric/organismFields.js — THE OVERLAP LAW and THE RESIDENTIAL MATRIX
 * (§5.0c.5c/.5d, §161e.1/.3).
 *
 * ⭐⭐ THE OVERLAP LAW: "district organisms are INFLUENCE FIELDS, not exclusive polygons
 * — they can and should overlap. Where fields overlap, character MIXES: the frontier
 * streets carry both trades, and parcels sample their character from the strongest local
 * fields."
 *
 * ⭐⭐ ERA-LEGAL MIXING, and this is the load-bearing constraint. §9.2 FORBIDS GRADIENTS.
 * A blended wash is the obvious way to render a mixture and it is illegal here — and it
 * would be wrong even if it were legal, because a real street does not fade from one
 * trade to another. It ALTERNATES. So overlap renders by PARCEL-GRAIN DITHERING: each
 * parcel individually takes a FLAT character from the fields over its own centroid, and
 * the mixing shows in the salt-and-pepper of adjacent parcels — exactly how a real
 * street mixes shops. The mechanism is more truthful than the illegal one it replaces.
 *
 * ⭐⭐ THE RESIDENTIAL MATRIX (§161e.1): "housing is not a district — it is the
 * settlement's connective tissue, spread throughout." The matrix is a FLOOR under every
 * field, everywhere inside the umbrella. District character is a LAYER on the matrix,
 * never a replacement for it: every quarter keeps houses among its specialty (rooms over
 * the shops, cottages between the yards), and A DISTRICT WITH NO DWELLINGS IN IT IS A
 * RENDERING BUG, NOT A ZONE. The matrix is what guarantees that, structurally, rather
 * than by remembering to add houses.
 *
 * ⭐ THE LEGIBILITY GUARD (§5.0c.5d): ward labels name the locally DOMINANT field only —
 * the glance layer never labels an overlap — and the TRUTH LAYER keeps every district's
 * own anchor and click region distinct beneath the paint, so overlap never blurs the
 * data. That second half is J-TC29-2's DOMINANT-FIELD PARTITION, computed here and
 * consumed by ./umbrella.js.
 *
 * PURITY: pure functions of the organisms. No draws — the field is geometry, and its
 * per-parcel expression is hashed at the parcel, not streamed here.
 */

import { hashUnit } from './fabricRng.js';
import { VIEW } from './substrate.js';

/** Point-to-polyline distance, local so this module has no import cycle with the geometry
 * core (which documents a convexity invariant these ribbons do not obey). */
function distToPolylineLocal(px, py, line) {
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const ax = line[i][0], ay = line[i][1], bx = line[i + 1][0], by = line[i + 1][1];
    const dx = bx - ax, dy = by - ay;
    const d2 = dx * dx + dy * dy;
    let t = d2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / d2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const qx = ax + dx * t, qy = ay + dy * t;
    const d = Math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
    if (d < best) best = d;
  }
  return best;
}

/**
 * THE MATRIX FLOOR — the residential field's strength everywhere inside a settlement.
 * §42/§43 VALUE, PROPOSED-WITH-RATIONALE: it must be low enough that a strong specialist
 * quarter reads AS that quarter (the market frontage is not half houses), and high enough
 * that no district can ever be dwelling-free. 0.34 puts the matrix above a weak
 * organism's tail and below any organism's core.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const MATRIX_FLOOR = 0.34;

/**
 * FIELD FALLOFF exponent. §42/§43 VALUE, DERIVED from what an influence field means: a
 * quarter's character is nearly uniform through its own body and fades over its last
 * third. A linear falloff makes every quarter a smear; a hard edge makes it a polygon,
 * which is the thing this law exists to stop being. The squared-cosine-like shape below
 * (1 − t²)² is the cheapest curve with a flat top and a soft tail, in IEEE ops only.
 */
export const FIELD_FALLOFF_POWER = 2;

/** How far past its own reach an organism's field still carries, as a multiple. The
 * OVERLAP band lives entirely in this margin — set it to 1 and no two fields ever meet,
 * which would make §161e.3 untestable. */
export const FIELD_HALO = 1.35;

/**
 * The strength of ONE organism's field at a point, 0..1. Distance is measured to the
 * NEAREST LOBE rather than to the anchor, so an organism that grew along a road carries
 * its character down the road — which is what ribbon development means.
 * @param {import('./organisms.js').Organism} org @param {number} x @param {number} y
 * @returns {number}
 */
export function fieldAt(org, x, y) {
  let best = Infinity;
  for (const lobe of org.lobes) {
    const dx = x - lobe.x, dy = y - lobe.y;
    const d = Math.sqrt(dx * dx + dy * dy) - lobe.r;
    if (d < best) best = d;
  }
  const halo = org.reach * (FIELD_HALO - 1);
  if (best <= 0) return org.weight;                      // inside a lobe: full strength
  if (best >= halo) return 0;
  const t = best / halo;
  const fall = 1 - t * t;
  // ⚠ SPELLED AS A MULTIPLY, NOT `Math.pow`. `Math.pow` is not correctly rounded, so its
  // last-ULP result is not guaranteed identical across platforms — the same hazard the
  // trig ban exists for. FIELD_FALLOFF_POWER is 2 and stays 2; changing it means
  // changing this expression, deliberately, rather than a constant silently reaching a
  // non-deterministic function.
  return org.weight * fall * fall;
}

/**
 * @typedef {Object} FieldSample
 * @property {number} total       summed field strength including the matrix floor
 * @property {number} dominant    index of the strongest organism, or −1 for pure matrix
 * @property {number} dominantStrength
 * @property {number} runnerUp    index of the second strongest, or −1
 * @property {number} runnerUpStrength
 * @property {boolean} overlapped is this point genuinely contested?
 */

/**
 * Sample every field at a point. Returns the dominant AND the runner-up, because the
 * runner-up is what makes a frontier a frontier: the dither reads both.
 * @param {import('./organisms.js').Organism[]} orgs @param {number} x @param {number} y
 * @returns {FieldSample}
 */
export function sampleFields(orgs, x, y) {
  let total = MATRIX_FLOOR;
  let dominant = -1, dominantStrength = MATRIX_FLOOR;
  let runnerUp = -1, runnerUpStrength = 0;
  for (let i = 0; i < orgs.length; i++) {
    const v = fieldAt(orgs[i], x, y);
    if (v <= 0) continue;
    total += v;
    if (v > dominantStrength) {
      runnerUp = dominant; runnerUpStrength = dominantStrength;
      dominant = i; dominantStrength = v;
    } else if (v > runnerUpStrength) {
      runnerUp = i; runnerUpStrength = v;
    }
  }
  // CONTESTED means the runner-up is within reach of the leader. The threshold is
  // generous (70%) because a frontier that is one parcel wide reads as a mistake; real
  // mixed frontages run for a street or two.
  const overlapped = runnerUp >= 0 && runnerUpStrength >= dominantStrength * 0.70;
  return { total, dominant, dominantStrength, runnerUp, runnerUpStrength, overlapped };
}

/**
 * ⭐ PARCEL-GRAIN DITHERING (§161e.3, era-legal). Given a parcel's own lineage key and
 * the fields over its centroid, choose ONE FLAT character for the whole parcel.
 *
 * The choice is a HASH OF THE PARCEL'S OWN KEY against the field ratio — not a stream
 * draw. That matters twice over: it keeps the inertia law (a parcel's character does not
 * move when a neighbouring parcel appears or disappears), and it makes the salt-and-
 * pepper STABLE, so the same street mixes the same way in every year that has it.
 *
 * @param {string} parcelKey
 * @param {FieldSample} sample
 * @param {import('./organisms.js').Organism[]} orgs
 * @returns {{ organism: import('./organisms.js').Organism|null, character: string, matrix: boolean }}
 */
export function ditherCharacter(parcelKey, sample, orgs) {
  if (sample.dominant < 0) return { organism: null, character: 'residential', matrix: true };
  const lead = orgs[sample.dominant];
  if (!sample.overlapped) {
    // Even inside a strong field the MATRIX still shows: a share of parcels are plain
    // dwellings, because every quarter has people living in it (§161e.1). The share is
    // the matrix floor's share of the local total, so a weak quarter is mostly houses
    // and a strong one is mostly its trade — which is exactly right.
    const matrixShare = MATRIX_FLOOR / sample.total;
    if (hashUnit(`${parcelKey}|matrix`) < matrixShare) {
      return { organism: lead, character: 'residential', matrix: true };
    }
    return { organism: lead, character: lead.category, matrix: false };
  }
  // CONTESTED: pick between the two by their strength ratio. Adjacent parcels with
  // different keys land on different sides, and the frontier renders as the alternating
  // shopfronts a real mixed street has.
  const runner = orgs[sample.runnerUp];
  const share = sample.dominantStrength / (sample.dominantStrength + sample.runnerUpStrength);
  const roll = hashUnit(`${parcelKey}|dither`);
  const chosen = roll < share ? lead : runner;
  const matrixShare = MATRIX_FLOOR / sample.total;
  if (hashUnit(`${parcelKey}|matrix`) < matrixShare) {
    return { organism: chosen, character: 'residential', matrix: true };
  }
  return { organism: chosen, character: chosen.category, matrix: false };
}

/**
 * @typedef {Object} PartitionGrid
 * @property {number} n
 * @property {number} cell
 * @property {Int16Array} owner    dominant organism index per cell, −1 outside
 * @property {Float64Array} total  summed field strength per cell
 * @property {Uint8Array} inside   1 where the umbrella covers the cell
 * @property {Uint8Array} contested 1 where two fields are within reach of each other
 */

/**
 * THE DOMINANT-FIELD PARTITION (J-TC29-2) — computed on a grid.
 *
 * ⛔ WHY A PARTITION AT ALL, WHEN THE LAW SAYS FIELDS OVERLAP. Because the TRUTH LAYER
 * cannot. `SettlementMapPane` renders `data-town-district={d.id}` on each district's
 * polygon and five landed UI suites hit-test those elements. Overlapping click regions
 * are ambiguous hit regions — topmost wins, and two districts' tooltips become
 * order-dependent. So: the PAINT samples the overlapping fields; the TRUTH LAYER sees a
 * partition where every cell belongs to its single strongest field, DISJOINT BY
 * CONSTRUCTION. This is the same rule §5.0c.5d already states for ward labels ("the
 * locally DOMINANT field only"), extended from labels to hit regions — one rule, two
 * consumers, no second concept.
 *
 * @param {import('./organisms.js').Organism[]} orgs
 * @param {number} gridN
 * @param {number} insideThreshold   summed strength above which the umbrella covers a cell
 * @returns {PartitionGrid}
 */
export function buildPartition(orgs, gridN, insideThreshold, bridges, commons, inWater) {
  // Precompute each connective ribbon's bounding box, grown by its own width — see the
  // reject inside the cell loop for why this is required rather than merely faster.
  const boxed = (bridges || []).map((br) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of br.line) {
      if (p[0] < x0) x0 = p[0];
      if (p[1] < y0) y0 = p[1];
      if (p[0] > x1) x1 = p[0];
      if (p[1] > y1) y1 = p[1];
    }
    return { line: br.line, width: br.width, x0: x0 - br.width, y0: y0 - br.width, x1: x1 + br.width, y1: y1 + br.width };
  });
  const cell = VIEW / gridN;
  const owner = new Int16Array(gridN * gridN).fill(-1);
  const total = new Float64Array(gridN * gridN);
  const inside = new Uint8Array(gridN * gridN);
  const contested = new Uint8Array(gridN * gridN);

  // ⭐⭐ THE CORE CLAIM (§161e.1, and it is a REPAIR of a real rendering bug).
  //
  // The dominant-field partition hands each cell to the STRONGEST field over it, which is
  // right almost everywhere and catastrophic in one case: a SMALL quarter sitting inside a
  // LARGE neighbour's body is out-scored on every cell it occupies, owns nothing, and the
  // parcel packer — which culls any plot whose centroid the partition awarded to someone
  // else — builds it NOTHING AT ALL. MEASURED at this base: `org.district.religious_quarter`
  // in the city exemplar came back with 0 parcels and 0 dwellings, which §161e.1 names in
  // terms as "a rendering bug, not a zone". It is also a truth bug, because the district is
  // real, its click region is real, and the map showed no district there.
  //
  // ⚠ IT SURFACED ONLY AFTER THE REACH GREW. While every organism was divided by √N the
  // reaches were small and comparable and no field could swallow another whole; restoring
  // the §5 extent made the largest quarter nearly twice the smallest. ⭐ THE CLASS: a
  // winner-takes-all rule is safe exactly while the contestants are the same size, so
  // correcting a SCALE can expose a latent defect in a RANKING that never moved.
  //
  // The cure states what was always true: THE GROUND UNDER A QUARTER'S OWN CORE BELONGS TO
  // THAT QUARTER, whatever a neighbour's halo says about it. Ties inside overlapping cores
  // go to the SMALLER claim, because the specific beats the general — a parish precinct
  // inside a great merchant quarter is still the parish's.
  const cores = orgs.map((o) => ({
    x: o.lobes && o.lobes.length ? o.lobes[0].x : o.anchor.x,
    y: o.lobes && o.lobes.length ? o.lobes[0].y : o.anchor.y,
    r: o.lobes && o.lobes.length ? o.lobes[0].r : o.reach * 0.34,
    reach: o.reach,
  }));

  for (let j = 0; j < gridN; j++) {
    for (let i = 0; i < gridN; i++) {
      const x = (i + 0.5) * cell, y = (j + 0.5) * cell;
      const k = j * gridN + i;
      // The umbrella test uses the ORGANISM FIELDS ONLY — the matrix floor is what fills
      // a settlement, not what defines its edge, so it is excluded here. Including it
      // would make the umbrella the whole frame.
      let sum = 0, bestI = -1, best = 0, second = 0;
      for (let o = 0; o < orgs.length; o++) {
        const v = fieldAt(orgs[o], x, y);
        if (v <= 0) continue;
        sum += v;
        if (v > best) { second = best; best = v; bestI = o; }
        else if (v > second) second = v;
      }
      total[k] = sum;
      let isInside = sum >= insideThreshold;
      // ⭐⭐ THE CONNECTIVE MATRIX (§161e.1), and it is what MAKES the interior greens.
      // Housing is not a district — it is the tissue the quarters grow within and over,
      // and in a real town it runs ALONG THE STREETS THAT JOIN THE QUARTERS before it
      // fills the ground between them. Without this term the umbrella is the bare union of
      // the organism fields: the quarters sit apart, every gap between them opens outward,
      // and NOTHING is ever enclosed — so §5.0c.3's breathing holes cannot exist at any
      // tier. With it, the ribbons of houses along the connecting lanes close the ring, and
      // the ground the quarters have NOT yet reached becomes an enclosed green: the
      // commons, the paddock, the garden plots. The green is a real absence, not a
      // decoration — it is exactly the land the town has not built on yet.
      if (!isInside && boxed.length) {
        // ⚠ THE BOUNDING-BOX REJECT IS LOAD-BEARING, NOT AN OPTIMIZATION. §181.3a's quarter
        // lanes BEND — they are walked over the substrate and smoothed, so each carries ~90
        // points where MF-B2's ruled segment carried two. MEASURED without this test: a city
        // leaf's build went from 1.2 s to 6.2 s and the village pin timed out, because the
        // partition evaluates every bridge against every one of 16,384 cells. The reject is
        // EXACT — a point outside a polyline's bbox grown by the ribbon width cannot be
        // within the ribbon — so the partition's bytes are untouched.
        for (const br of boxed) {
          if (x < br.x0 || x > br.x1 || y < br.y0 || y > br.y1) continue;
          if (distToPolylineLocal(x, y, br.line) <= br.width) { isInside = true; break; }
        }
      }
      // ⛔⛔ AND THE SEA OVERRIDES EVERYTHING, WHICH IT WAS NEVER ASKED TO DO. §5.-1.4 is
      // flat: "randomness proposes; terrain disposes" — yet the partition tested the
      // organism fields, the connective ribbons and the commons, and never the WATER. A
      // quarter whose anchor sat near a shore therefore accreted straight out across it,
      // and the umbrella traced round a settlement part of which was open sea.
      // MEASURED on the coastal city exemplar: `org.district.religious_quarter` owned 327
      // partition cells of which **260 were in the water**. Every plot on them died on the
      // forbidden-ground test, the quarter rendered with no dwellings at all, and §161e.1's
      // proof went red — a defect that had been latent since MF-B1 and that only surfaced
      // when §181.3a's lanes and §16.4's larger green took the last dry cells.
      // ⭐ THE CLASS: a mask assembled from several claims is only as true as its most
      // permissive member, and the member nobody asked is the one that lets the sea in.
      if (isInside && inWater && inWater(x, y)) isInside = false;

      // ⭐⭐ THE COMMONS ARE CARVED OUT LAST, AND THEY OVERRIDE EVERYTHING ABOVE (§5.0c.3).
      // This is the single line that turns a reserved claim into a drawn green: the cell is
      // not part of the built-up settlement whatever the fields and the connective ribbons
      // say about it, so the boundary trace finds a boundary there. Whether that boundary
      // is a HOLE or a BAY is not decided here and is not asserted anywhere — the trace's
      // own winding decides, which is what keeps the mechanism honest.
      if (isInside && commons && commons.length) {
        for (const c of commons) {
          const dx = x - c.x, dy = y - c.y;
          if (dx * dx + dy * dy < c.r * c.r) { isInside = false; break; }
        }
      }
      if (isInside) {
        inside[k] = 1;
        owner[k] = bestI;
        if (second >= best * 0.70) contested[k] = 1;
        // THE CORE CLAIM overrides the field ranking — see the note above. Disjointness is
        // preserved because exactly one owner is written per cell.
        let claim = -1, claimReach = Infinity;
        for (let o = 0; o < cores.length; o++) {
          const c = cores[o];
          const dx = x - c.x, dy = y - c.y;
          if (dx * dx + dy * dy > c.r * c.r) continue;
          if (c.reach < claimReach) { claimReach = c.reach; claim = o; }
        }
        if (claim >= 0) { owner[k] = claim; contested[k] = 0; }
      }
    }
  }
  return { n: gridN, cell, owner, total, inside, contested };
}

/** The partition owner at a view-space point, or −1. */
export function ownerAt(part, x, y) {
  let i = Math.floor(x / part.cell), j = Math.floor(y / part.cell);
  if (i < 0 || j < 0 || i >= part.n || j >= part.n) return -1;
  return part.owner[j * part.n + i];
}

/** Is a point inside the umbrella? */
export function insideUmbrella(part, x, y) {
  let i = Math.floor(x / part.cell), j = Math.floor(y / part.cell);
  if (i < 0 || j < 0 || i >= part.n || j >= part.n) return false;
  return part.inside[j * part.n + i] === 1;
}

/**
 * THE DWELLING GUARANTEE (§161e.1, made structural). Every organism must own at least
 * one parcel whose character is residential. This function reports the count per
 * organism so the member's pin can assert it — and so a planted dwelling-free organism
 * reds rather than passing quietly.
 * @param {Array<{ organismKey: string|null, character: string }>} parcels
 * @param {import('./organisms.js').Organism[]} orgs
 * @returns {Map<string, number>}
 */
export function dwellingCensus(parcels, orgs) {
  /** @type {Map<string, number>} */ const census = new Map();
  for (const o of orgs) census.set(o.key, 0);
  for (const p of parcels) {
    if (p.character !== 'residential' || !p.organismKey) continue;
    census.set(p.organismKey, (census.get(p.organismKey) || 0) + 1);
  }
  return census;
}
