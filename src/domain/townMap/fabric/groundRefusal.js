/**
 * domain/townMap/fabric/groundRefusal.js — ⭐⭐⭐ §5 W1 EXIT 2 · THE `buildable` REFUSAL MASK.
 *
 * §5's own sentence for this wave: **"Land refuses to be built on: fabric stops at the crag,
 * thins on the slope, avoids the marsh."** This module is the ONE HOME of that refusal, and
 * everything that used to have its own opinion about it now asks here.
 *
 * ⛔⛔ WHAT WAS THERE, MEASURED: **SIX PRIVATE SPELLINGS OF ONE RULE, ALL IN THE WRONG UNIT.**
 *
 *   parcels.js  `slope > 0.80 && wet > 0.62`   ×3 (the plot walk, the probe, the infill)
 *   parcels.js  `slope > 0.72 && wet > 0.66`      (the §10.A3 shanty)
 *   commons.js  `slope > 0.52 && wet > 0.55`      (COMMONS_GROUND)
 *   fields.js   `slope·(relief/0.30) > 0.66`      (TILLAGE.terraceMax — the only one that
 *                                                  had noticed the unit problem at all)
 *
 * ⭐⭐ AND THE UNIT IS THE REAL DEFECT, NOT THE DUPLICATION. `sub.slope` is normalized to
 * **each leaf's own steepest cell** (`buildSubstrate`), so `slope > 0.80` means "steeper than
 * 80% of the steepest thing HERE" — a different real grade on every leaf. MEASURED on this
 * corpus, in the comparable unit (`slope × slopeLocalMax`):
 *
 *     thorp    localMax 0.01170  ⇒  `slope > 0.80` refuses ground at grade 0.0094
 *     mountain localMax 0.08737  ⇒  `slope > 0.80` refuses ground at grade 0.0699
 *
 * **The same line of code refuses ground 7.5× gentler on the flattest leaf in the corpus than
 * on the steepest — and on the thorp it refuses ground GENTLER THAN THE MOUNTAIN'S MEDIAN
 * (0.0161).** ⭐ THE CLASS, and it is `laneMFW1SUB-receipt.md` §9's standing hazard arriving
 * with a body count: **A THRESHOLD STATED IN A PER-PLACE-NORMALIZED UNIT IS NOT A THRESHOLD;
 * IT IS A QUANTILE WEARING A GRADE'S NAME**, and it makes a pancake refuse its own flattest
 * ground while a mountain accepts a cliff.
 *
 * ⭐⭐⭐ THE UNIT, STATED ONCE. `height` is `unit(0.5 + (h−0.5)·relief·1.6)` — its numeric
 * range IS the leaf's relief, so a mountain's height field genuinely spans more than a
 * plains' and `slope × slopeLocalMax` (the raw central-difference gradient, before the
 * per-leaf divide) is comparable ACROSS leaves. That is the unit every threshold here is
 * stated in, and `absoluteGrade()` is the only way to obtain it.
 *
 * ⚠ THE WET ARM NEEDS NO SUCH CONVERSION AND THE ASYMMETRY IS THE POINT. `sub.wet` is an
 * absolute 0..1 formula (flow + bias + trapping − height damping), NOT normalized to the
 * leaf. So the wet clause can take the DRAWING's own marsh line verbatim — `relief.js` draws
 * a marsh tick at exactly `REFUSAL.standingWater` — while the slope clause cannot. **The law
 * and the picture agree on water by construction and had to be MEASURED into agreement on
 * slope.** That asymmetry is why this module exists rather than a constant.
 *
 * ⭐ DERIVED, NEVER STORED (§161 LAYER ZERO). Nothing here is persisted and nothing enters an
 * identity hash: the mask is a reading of the substrate the substrate can always re-take.
 * Perturb the substrate seed and it moves; hold it and it is byte-identical.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare, no Math.pow.
 */

import { sampleAt, VIEW } from './substrate.js';

/**
 * ⭐⭐ THE REFUSAL, IN THE COMPARABLE UNIT. §42/§43 VALUES, **PROPOSED WITH A MEASURED
 * RATIONALE** rather than chosen — and the rationale is a SHAPE across the corpus, not a
 * number. `MFW1B-mask.mjs` measured the share of each leaf above each candidate grade:
 *
 *   grade   thorp village hamlet metro town/highwater/… city/migr fjord  polycentric mountain
 *   0.015    0.0%   0.0%   3.7%   5.7%      14.9%          24.9%   21.8%     41.6%     52.0%
 *   0.020    0.0%   0.0%   0.5%   0.4%       2.2%           6.7%    5.5%     28.9%     43.6%
 *   0.030    0.0%   0.0%   0.0%   0.0%       0.0%            0.1%    0.0%     11.0%     27.7%
 *
 * ⭐ **`crag` IS THE GRADE AT WHICH THE FLAT FAMILIES REFUSE NOTHING AND THE RELIEF FAMILIES
 * REFUSE A LOT.** That is the only defensible shape for this law: a cut that takes ground off
 * a pancake is measuring the normalization, not the land (see the header). At 0.030 the
 * plains, riverside and strand leaves refuse **zero** cells, `hills` refuses a ninth of itself
 * and `mountain` refuses **more than a quarter** — which is what "the fabric stops at the
 * crag" has to mean if it means anything.
 *
 * ⚠ `scarp` IS NOT A REFUSAL AND MUST NOT BE USED AS ONE. It is the grade at which ground
 * begins to COST — §5's "thins on the slope" — and it is published so the thinning and the
 * refusal cannot drift apart into two unrelated numbers.
 *
 * ⚠ `standingWater` IS `relief.js`'s OWN MARSH LINE, imported by `relief.js` FROM HERE so
 * there is exactly one of it. A body may not stand where the drawing puts a reed tuft.
 *
 * ⚠ UNSOAKED. All three ride the tuning signature.
 * @type {Readonly<{ crag:number, scarp:number, standingWater:number }>}
 */
export const REFUSAL = Object.freeze({
  crag: 0.030,
  scarp: 0.020,
  standingWater: 0.64,
});

/** The clause names, closed set — a census may not invent a seventh reason. */
export const REFUSAL_CLAUSES = Object.freeze(['crag', 'standing-water']);

/**
 * ⭐ THE ABSOLUTE GRADE at a view-space point — the raw central-difference gradient of the
 * height field, i.e. `sub.slope` with its per-leaf normalization UNDONE. **This is the only
 * cross-leaf-comparable slope reading in the fabric**, and every threshold in this module is
 * stated in it.
 * @param {import('./substrate.js').Substrate} sub @param {number} x @param {number} y
 * @returns {number}
 */
export function absoluteGrade(sub, x, y) {
  const lm = sub.slopeLocalMax == null ? 0 : sub.slopeLocalMax;
  return sampleAt(sub, sub.slope, x, y) * lm;
}

/** The absolute grade of a substrate CELL, by index — the mask builder's inner loop. */
function gradeOfCell(sub, k) {
  const lm = sub.slopeLocalMax == null ? 0 : sub.slopeLocalMax;
  return sub.slope[k] * lm;
}

/**
 * WHICH CLAUSE REFUSES THIS POINT, or `null` if the ground carries a body.
 * ⚠ The order is fixed (`crag` before `standing-water`) so a point refused by both reports
 * one stable reason — a census that reported "whichever ran first" would not be diffable.
 * @param {import('./substrate.js').Substrate} sub @param {number} x @param {number} y
 * @returns {'crag'|'standing-water'|null}
 */
export function refusalAt(sub, x, y) {
  if (absoluteGrade(sub, x, y) > REFUSAL.crag) return 'crag';
  if (sampleAt(sub, sub.wet, x, y) > REFUSAL.standingWater) return 'standing-water';
  return null;
}

/**
 * ⭐ THE PREDICATE EVERY CONSUMER ASKS. `true` where a body may stand.
 * @param {import('./substrate.js').Substrate} sub @param {number} x @param {number} y
 * @returns {boolean}
 */
export function buildableAt(sub, x, y) { return refusalAt(sub, x, y) === null; }

/**
 * ⭐ THE SCARP TERM — how much this ground COSTS, 0 (free) .. 1 (at the refusal). §5's
 * "thins on the slope", derived from the same two numbers as the refusal so the thinning and
 * the stopping can never drift. Above `crag` it saturates at 1 and the caller must be asking
 * `buildableAt` instead.
 * @param {import('./substrate.js').Substrate} sub @param {number} x @param {number} y
 * @returns {number}
 */
export function scarpCost(sub, x, y) {
  const g = absoluteGrade(sub, x, y);
  if (g <= REFUSAL.scarp) return 0;
  if (g >= REFUSAL.crag) return 1;
  return (g - REFUSAL.scarp) / (REFUSAL.crag - REFUSAL.scarp);
}

/**
 * ⭐⭐ THE MASK, DERIVED. One `Uint8Array` over the substrate grid — 1 buildable, 0 refused —
 * with the per-clause counts and the reason string a receipt can quote.
 *
 * ⚠ IT IS BUILT, NOT CACHED. A memo keyed on the substrate object would be this estate's own
 * §230 staleness class (`laneMFPERF1-receipt.md` J-P1-1); the walk is 9,216 cells and two
 * comparisons, which is cheaper than the hazard.
 * @param {import('./substrate.js').Substrate} sub
 * @returns {{ n:number, cell:number, mask:Uint8Array, refusedCells:number, cragCells:number,
 *   wetCells:number, share:number, grade:{p50:number,p90:number,max:number}, reason:string }}
 */
export function buildableMask(sub) {
  const n = sub.n;
  const mask = new Uint8Array(n * n);
  let crag = 0, wet = 0;
  let gMax = 0;
  const grades = new Float64Array(n * n);
  for (let k = 0; k < n * n; k++) {
    const g = gradeOfCell(sub, k);
    grades[k] = g;
    if (g > gMax) gMax = g;
    if (g > REFUSAL.crag) { mask[k] = 0; crag++; continue; }
    if (sub.wet[k] > REFUSAL.standingWater) { mask[k] = 0; wet++; continue; }
    mask[k] = 1;
  }
  const sorted = Array.prototype.slice.call(grades).sort((a, b) => a - b);
  const q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
  const refused = crag + wet;
  return {
    n,
    cell: sub.cell,
    mask,
    refusedCells: refused,
    cragCells: crag,
    wetCells: wet,
    share: refused / (n * n),
    grade: { p50: q(0.5), p90: q(0.9), max: gMax },
    reason: `buildable refusal on '${sub.family}': ${refused} of ${n * n} cells refused `
      + `(${(refused / (n * n) * 100).toFixed(1)}%) — ${crag} crag (grade > ${REFUSAL.crag}), `
      + `${wet} standing water (wet > ${REFUSAL.standingWater}); leaf grade p50 ${q(0.5).toFixed(4)} `
      + `p90 ${q(0.9).toFixed(4)} max ${gMax.toFixed(4)} (ABSOLUTE — comparable across leaves)`,
  };
}

/**
 * ⭐⭐⭐ IS A BODY STANDING ON REFUSED GROUND? **AREA-TRUE, NEVER A CENTRE TEST.**
 *
 * ⛔ `groundLaw.js` already paid for this lesson in full and its header states the bill:
 * *"THE RESERVATION WAS A TEST ON THE PLOT'S CENTRE AND THE LAW IS ABOUT THE BUILDING'S
 * BODY"* — 39–511 footprints per leaf standing in a carriageway while the census read clean.
 * A burgage body spans one to two substrate cells, and a FURLONG spans four to eleven, so a
 * centre test on a furlong is wrong by an order of magnitude: **that is why the ploughland
 * tiles the crags.**
 *
 * ⭐ THE SWEEP IS EXACT AT THE GRID'S OWN RESOLUTION, and bounded by construction:
 *   1 every vertex's cell,
 *   2 every cell centre inside the polygon (bbox-bounded),
 *   3 every edge walked at the CELL PITCH, so a thin body crossing a refused cell without
 *     putting a vertex or a cell centre in it is still caught.
 * Step 3 is the one a naive rasterizer omits and it is the one a long thin burgage needs.
 *
 * @param {import('./substrate.js').Substrate} sub
 * @param {Array<[number,number]>} poly
 * @returns {{ clause:'crag'|'standing-water', x:number, y:number, grade:number }|null}
 */
export function bodyRefusal(sub, poly) {
  if (!poly || poly.length < 3) return null;
  // ⚠ OUTSIDE THE FRAME THERE IS NO GROUND TO REFUSE, and this is the estate's own rule
  // rather than a convenience: `meanderChannel` already states it — *"Outside the frame there
  // is no drawn ground to climb"* — and the leaf is a WINDOW on the world (§2.3's continuity
  // law). `sampleAt` CLAMPS out-of-frame reads to the edge cell, so without this guard a
  // steading drawn at y = −41 would be convicted by the ground at y = +5, which is a
  // different place. MEASURED: 6 of the mountain's dwellings sat outside the frame.
  const hit = (x, y) => {
    if (x < 0 || y < 0 || x > VIEW || y > VIEW) return null;
    const c = refusalAt(sub, x, y);
    return c ? { clause: c, x, y, grade: absoluteGrade(sub, x, y) } : null;
  };
  // 1 · the vertices.
  for (const p of poly) { const h = hit(p[0], p[1]); if (h) return h; }
  // 3 · the edges, at the cell pitch (before the interior sweep: it is cheaper and a body
  //     that violates at all usually violates on its boundary).
  const pitch = sub.cell;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(len / pitch);
    for (let s = 1; s <= steps; s++) {
      const t = s / (steps + 1);
      const h = hit(a[0] + dx * t, a[1] + dy * t);
      if (h) return h;
    }
  }
  // 2 · the interior cell centres.
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  const i0 = Math.max(0, Math.floor(x0 / sub.cell)), i1 = Math.min(sub.n - 1, Math.floor(x1 / sub.cell));
  const j0 = Math.max(0, Math.floor(y0 / sub.cell)), j1 = Math.min(sub.n - 1, Math.floor(y1 / sub.cell));
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const cx = (i + 0.5) * sub.cell, cy = (j + 0.5) * sub.cell;
      if (!pointInPoly(poly, cx, cy)) continue;
      const h = hit(cx, cy);
      if (h) return h;
    }
  }
  return null;
}

/** Ray-cast point-in-polygon. Local, because this module may import only `substrate.js`
 *  (see the census's own note on why it must not inherit a consumer's predicate). */
function pointInPoly(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > y) !== (yj > y)) {
      const qx = (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (x < qx) inside = !inside;
    }
  }
  return inside;
}

/**
 * ⭐⭐⭐ §5 W1 EXIT 2 · THE CENSUS — **zero drawn bodies on `buildable == false`, per leaf.**
 *
 * ⚠⚠ AND THE ONE THING THAT MAKES IT A CENSUS RATHER THAN A TAUTOLOGY, stated where it
 * cannot be missed. `groundLaw.js`'s own header records the class: **"A CENSUS THAT INHERITS
 * THE LAW'S OWN PREDICATE CANNOT REFUTE THE LAW"** — measured there as 1,299 bodies in a
 * carriageway with all three censuses reading 0. So:
 *
 *   • THE ENFORCEMENT (`suitability`, the plot walk, `tillageScore`) refuses at PROPOSAL
 *     time, at the POINTS it is already sampling.
 *   • THIS CENSUS re-asks the question of the finished body's **whole area**, by a different
 *     construction (`bodyRefusal`'s three-part sweep), over geometry the enforcement never
 *     saw as a polygon.
 *   • THE COUNTERFACTUAL plants a violation the enforcement CANNOT have absorbed, because it
 *     is planted after the enforcement ran (see `townMapFabricRefusal.test.js`).
 *
 * ⭐ THE COMPLETENESS LADDER (`laneMFPERF1-receipt.md` §8) GAINS A FIFTH RUNG HERE, and it
 * earns its keep on this very census: a leaf whose ground refuses NOTHING reports a
 * perfectly honest 0 that means **the law had nothing to refuse**, which is a different fact
 * from "the law refused things and the fabric stayed off them". PERF1's own words —
 * *"a zero here is not a clean bill; it is an absence of a question"* — apply one rung
 * further in than PERF1 could see. So:
 *
 *   MEASURED         it ran, the ground refuses somewhere, and nothing drawn stands on it
 *   VACUOUS          it ran over real bodies, and the ground on this leaf refuses NOTHING
 *   NOT APPLICABLE   the leaf draws no bodies at all
 *   ⛔ SKIPPED       it did not run — can never be green
 *
 * @param {Object} a
 * @param {import('./substrate.js').Substrate} a.sub
 * @param {Array<{kind:string, key:string, poly:Array<[number,number]>}>} a.bodies
 * @returns {{ bodies:number, refused:number, byClause:Record<string,number>,
 *   byKind:Record<string,number>, worst:any, complete:boolean, status:string,
 *   refusedGroundCells:number, reason:string }}
 */
export function refusalCensus(a) {
  const sub = a.sub;
  const bodies = a.bodies || [];
  const m = buildableMask(sub);
  /** @type {Record<string, number>} */ const byClause = {};
  /** @type {Record<string, number>} */ const byKind = {};
  /** @type {Array<any>} */ const offenders = [];
  let refused = 0;
  for (const b of bodies) {
    const r = bodyRefusal(sub, b.poly);
    if (!r) continue;
    refused++;
    byClause[r.clause] = (byClause[r.clause] || 0) + 1;
    byKind[b.kind] = (byKind[b.kind] || 0) + 1;
    // ⚠ THE OFFENDER LIST IS BOUNDED AND THE BOUND IS DECLARED. An unbounded list on a
    // metropolis is a megabyte of receipt; 25 is enough to name the class. The COUNTS above
    // are complete regardless — this list is a sample and says so.
    if (offenders.length < 25) offenders.push({ kind: b.kind, key: b.key, ...r });
  }
  const status = !bodies.length ? 'NOT APPLICABLE'
    : m.refusedCells === 0 ? 'VACUOUS'
      : 'MEASURED';
  return {
    bodies: bodies.length,
    refused,
    byClause,
    byKind,
    worst: offenders,
    offendersListed: offenders.length,
    offendersComplete: offenders.length === refused,
    refusedGroundCells: m.refusedCells,
    complete: true,
    status,
    reason: status === 'NOT APPLICABLE'
      ? '§5 W1 exit 2: NOT APPLICABLE — this leaf draws no bodies, so the refusal has no subject'
      : status === 'VACUOUS'
        ? `§5 W1 exit 2: VACUOUS — ${bodies.length} bodies swept and the ground on this leaf `
          + 'refuses NOTHING (0 refused cells), so a reading of 0 is an absence of a question, '
          + 'not a clean bill'
        : `§5 W1 exit 2: ${refused} of ${bodies.length} drawn bodies stand on refused ground `
          + `(${m.refusedCells} refused cells, ${(m.share * 100).toFixed(1)}% of the leaf) — `
          + `${Object.keys(byClause).sort().map((c) => `${byClause[c]} ${c}`).join(', ') || 'none'}`,
  };
}

/**
 * ⭐ THE DRAWN SET THE CENSUS SWEEPS — **ONE construction, so the census and the receipt can
 * never be measuring different towns.** `groundLaw.js`'s `standingBodies` exists for exactly
 * this reason and its header records what two constructions of one set cost.
 * ⚠ It is a SEPARATE function from `standingBodies` deliberately: that one answers "what is
 * already claimed" for a clipping pass and takes `include` flags; this one answers "what did
 * the reader end up seeing", which is always everything.
 * @param {any} fabric @returns {Array<{kind:string,key:string,poly:Array<[number,number]>}>}
 */
export function drawnBodies(fabric) {
  /** @type {Array<{kind:string,key:string,poly:any}>} */ const out = [];
  const add = (kind, key, poly) => { if (poly && poly.length >= 3) out.push({ kind, key, poly }); };
  // ⛔⛔ **"DRAWN" MEANS WHAT THE RENDERER DRAWS, AND A MERGED PARCEL IS NOT DRAWN.** An LOD
  // mass replaces its members on the page (`renderFolio` skips every `mergedKeys` parcel in
  // four separate passes), so a census that swept them would convict bodies the reader never
  // sees. MEASURED on its first run: 5 of the 20 remaining convictions across the corpus were
  // back-houses of MERGED parcels — geometry that exists in the fabric and not on the plate.
  // ⭐ THE CLASS, and it is §195.0's own lesson read backwards: `groundLaw.js` records a
  // census that ran over a set which did NOT CONTAIN the shapes the reader was looking at;
  // this is a census that ran over a set which contained shapes the reader was NOT looking at.
  // **Both are the same defect — the census's subject is not the plate's — and only one of
  // them makes the number too big.**
  const merged = (fabric.lod && fabric.lod.mergedKeys) || new Set();
  for (const p of (fabric.parcels || [])) {
    if (merged.has && merged.has(p.key)) continue;
    add('parcel', p.key, p.polygon); add('backHouse', `${p.key}#back`, p.backHouse);
  }
  for (const m of ((fabric.lod && fabric.lod.masses) || [])) add('mass', m.key, m.polygon);
  for (const h of ((fabric.shanty && fabric.shanty.huts) || [])) add('hut', h.key, h.polygon);
  // ⚠ THE FAUBOURG SET IS AN OBJECT WITH FOUR BODY LISTS, NOT AN ARRAY. Named individually
  // because a census that quietly missed one of them would read clean over a town's whole
  // extramural suburb — `groundLaw.standingBodies` learned the same lesson about back-houses.
  // ⚠ `faubourgs.inns` IS A COUNT, NOT A LIST — the object carries `buildings`, `leanTos`,
  // `gates`, `glacisClear`, `refused`, `inns`, `reason`, and only the first two are bodies.
  const fb = fabric.faubourgs || {};
  for (const b of (fb.buildings || [])) add('faubourg', b.key, b.polygon);
  for (const b of (fb.leanTos || [])) add('leanTo', b.key, b.polygon);
  for (const h of (fabric.habitation || [])) for (const sol of (h.solids || [])) add('dwelling', h.key, sol);
  for (const lm of (fabric.landmarks || [])) {
    const sol = lm.solids || [];
    for (let i = 0; i < sol.length; i++) add('institution', `${lm.instanceKey}|${i}`, sol[i]);
  }
  // ⛔⛔ §273.3 · **SIXTY-THREE DRAWN BODIES WERE OUTSIDE THIS SET AND NOBODY HAD MEASURED IT.**
  // MEASURED at MF-W2 against the harness census's own rule, on MF-W1b's tip: this function
  // returned **21,919** where the plate carries **21,982** — the missing 63 are §10's STATE
  // BODIES (tent 9, camphut 24, lazar 2) and §18.4's MARKET MIDDLE ROWS (28). Every one of them
  // is FILLED and every one of them is drawn, so §5 W1 exit 2's "0 of 21,982 bodies on refused
  // ground" actually swept 21,919 and never asked the state bodies the question at all.
  // ⭐ THE CLASS IS THE ONE THIS FUNCTION'S OWN HEADER BANKS, ARRIVING FROM THE OTHER SIDE: **a
  // census's subject must be the plate's subject, and a set assembled by hand drifts from the
  // lens the moment the lens gains a family.** The harness census had them; the domain's did
  // not; nothing could red.
  for (const b of ((fabric.stateMarks && fabric.stateMarks.bodies) || [])) {
    add(b.kind || 'state', b.key, b.polygon);
  }
  // ⭐⭐ §250.5 · THE FOSSILS JOIN THE CENSUS IN THE SAME PASS THAT DRAWS THEM (§195.0's standing
  // rule). A demoted tower's round is a filled body like any other; a filled-ditch garden is
  // OPEN GROUND and is deliberately NOT here, for the same reason a green is not.
  for (const d of ((fabric.demotion && fabric.demotion.dwellings) || [])) {
    add('demotedTower', d.key, d.polygon);
  }
  return out;
}

/**
 * ⭐ THE PLOUGHLAND'S OWN CENSUS. §5 W1 exit 4's acceptance failure was named in
 * `laneMFW1SUB-receipt.md` §6.2 in one sentence — *"`mountain` reads as rocky ridges in
 * farmland, because the field patchwork still tiles the entire leaf including the steep
 * ground"* — and a furlong strip is not a body, so the body census above cannot see it.
 * ⚠ Reported SEPARATELY and never merged into the body count: a strip on a crag and a house
 * on a crag are different failures with different cures, and one census may not merge two
 * objects (PERF1 §8's ladder, and §5 W3 exit 6's own rule about courts and yards).
 * @param {any} fabric @returns {{ strips:number, refused:number, share:number, status:string, reason:string }}
 */
export function tillageRefusalCensus(fabric) {
  const sub = fabric.substrate;
  const strips = (fabric.fields && fabric.fields.parcels) || [];
  const m = buildableMask(sub);
  let refused = 0;
  for (const f of strips) if (bodyRefusal(sub, f.polygon)) refused++;
  const status = !strips.length ? 'NOT APPLICABLE' : m.refusedCells === 0 ? 'VACUOUS' : 'MEASURED';
  return {
    strips: strips.length,
    refused,
    share: strips.length ? refused / strips.length : 0,
    status,
    reason: `§5 W1 exit 4 (ploughland): ${refused} of ${strips.length} field strips stand on `
      + `refused ground — ${status}`,
  };
}

export { VIEW };
