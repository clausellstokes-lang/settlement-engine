/**
 * domain/townMap/fabric/wallRuns.js — ⭐⭐⭐ THE CIRCUIT IS A CHAIN OF TYPED RUNS
 * (§5 W2 · CX-13 · ODQ §251.4b, which rules that this and the epoch ladder are ONE piece of
 * work because three rings derived WITHOUT run typing come out CONCENTRIC).
 *
 * ⭐⭐⭐ THE LAW, IN ONE SENTENCE: **A WALL IS NOT A SHAPE FITTED AROUND A FABRIC. A WALL IS A
 * SEQUENCE OF RUNS, EACH OF WHICH IS A DECISION WITH A CAUSE** — and every one of the causes
 * comes from facts the pipeline already holds. ATLAS T-10's verdict on the prior circuit was
 * *"the trace reads geometric, not economic"*; a run chain is what makes it economic.
 *
 * ⛔⛔ WHAT THIS REPLACES, MEASURED AT MY BASE (`MFW2-runfacts.log`). One trace with two
 * exceptions: `traceWalls` produced ONE polygon, ONE tower interval (`i += spec.towerEvery`,
 * which is EVEN SPACING BY INDEX — ATLAS banned prior #7 by name), ONE ditch policy and ONE
 * band for the whole circuit. And the half-ring's water flank was CLOSED WITH A STRAIGHT CHORD
 * that the lens stroked as wall: the town's ring carries a **102.8-unit segment against a
 * median of 18.8 (5.5×)**, the city's **391.0 against 133.3**, and the ratio is 1.6 on the one
 * DRY ring in the corpus. ⭐ **THE ANOMALY CORRELATES EXACTLY WITH `halfRing`** — so the "water
 * is the fourth wall" law was drawing a hundred units of masonry along the bank it had just
 * declared undefended.
 *
 * ⭐⭐ N IS NOT A KNOB — it falls out of how many distinct conditions the boundary crosses. The
 * classifier reads a FACT VECTOR at every ring vertex, assigns a type in a FIXED PRIORITY
 * ORDER, then coalesces contiguous vertices of one type into a run. A leaf whose boundary
 * genuinely crosses two conditions gets two runs and says so.
 *
 * ⚠⚠ TOWER POSITIONS REMAIN **SEEDED-IRREGULAR**, AND THAT IS A RULING, NOT AN OVERSIGHT.
 * §259.3 would place towers at every non-gate CORNER and let the spacing emerge (register entry
 * SUB-3), and two prior-art products agree. **§5 W2's own content note holds SUB-3 shut until
 * W0's G-40(i) reads a number, and `laneMFW0-receipt.md` §6.2 reports it ⛔ NO INSTRUMENT** —
 * tracing a drawn circuit off a raster plate and detecting tower glyphs on it are two vision
 * tasks no instrument performs. §258.2 forbids a substitution that cannot name its preserved
 * signature. **So this module keeps the seeded-irregular policy and says so** (exit 9, second
 * branch). ⭐ What it does NOT keep is even spacing by index, which was neither policy.
 *
 * PURITY: pure arithmetic and geometry. No Date, no Math.random, no runtime trig, no locale.
 */

import { fabricRng } from './fabricRng.js';
import { distToPolyline } from './fabricGeometry.js';
import { absoluteGrade, refusalAt } from './groundRefusal.js';

/**
 * ⭐⭐⭐ THE CLOSED SET OF NINE (CX-13's table, verbatim in substance). A run type outside this
 * set is a programming error and fails loudly; `tests/lint/wallRuns.walker.test.js` walks the
 * PRODUCING code against this list so a tenth type reds until it is ruled, which is the shape
 * `laneMFW1B-receipt.md` §8.1's totality walker established.
 */
export const RUN_TYPES = Object.freeze([
  'crest',
  'notch',
  'detour-to-work',
  'terrain-surrender',
  'water-termination',
  'toft-backs',
  'new-cutting',
  're-use',
  'bad-closure',
]);

/**
 * ⭐⭐ THE PER-TYPE POLICY TABLE — the parameters CX-13 names, one row per type, and every
 * column is a decision the run makes rather than a dial the circuit carries.
 *
 *  `towers`     none | sparse | clustered  (§1.1.13b's per-RUN policy, MEASURED at n=7: six of
 *               seven walled plates show towers ABSENT on at least one flank and in every one
 *               of the six the bare flank is the TERRAIN-DEFENDED one)
 *  `thickness`  a multiplier on the form's own weight. A terrain-surrender run THINS TO A
 *               PARAPET (§205.3: *a cliff flank needs NO wall — drawing one is the violation*).
 *  `ditch`      whether this run's ground was dug. A cliff is its own ditch; a river is its own
 *               moat; an old work on the line already had one.
 *  `lane`       ⭐⭐ THE WALL-SIDE STREET (§239.2), PER RUN. `true` = the intervallum is kept
 *               and carries a drawn lane; `false` = the wall was built along existing property
 *               and the inner face is ABUTTED, lawfully. **7/7 walled plates show a wall-side
 *               street on SOME runs and 0/7 on EVERY run**, which is why this is a column and
 *               not a constant, and why §200's clearance census must key its exemption HERE.
 *  `straight`   0 = wobbles plot by plot (keep the traced vertices); 1 = ruler-straight (the
 *               run is replaced by its own chord).
 */
export const RUN_POLICY = Object.freeze({
  crest: {
    towers: 'clustered', thickness: 1.0, ditch: true, lane: true, straight: 0.55,
    cause: 'high ground worth holding — the trace climbs to the rise the substrate offers',
  },
  notch: {
    towers: 'clustered', thickness: 1.0, ditch: true, lane: true, straight: 0.0,
    cause: 'an institution demanded inclusion — the wall doubles back to wrap the precinct',
  },
  'detour-to-work': {
    towers: 'sparse', thickness: 1.0, ditch: true, lane: true, straight: 0.0,
    cause: 'a work had to be inside — a hard kink round the mill, pond or quay',
  },
  'terrain-surrender': {
    towers: 'none', thickness: 0.45, ditch: false, lane: false, straight: 0.0,
    cause: 'the ground defends itself — a scarp or marsh the fabric already refuses, so the wall thins to a parapet and carries NO towers (§205.3)',
  },
  'water-termination': {
    towers: 'none', thickness: 0.55, ditch: false, lane: false, straight: 0.30,
    cause: 'the river is the flank — the wall runs to the bank and stops; the water is the fourth wall (§161m.3)',
  },
  'toft-backs': {
    towers: 'sparse', thickness: 0.85, ditch: true, lane: false, straight: 0.0,
    cause: 'the wall was built along existing property — it wobbles plot by plot along the backs of the tofts, and the inner face is abutted (ATLAS T-22, widened by CONTEXT)',
  },
  'new-cutting': {
    towers: 'clustered', thickness: 1.0, ditch: true, lane: true, straight: 1.0,
    cause: 'one campaign, one decision, open ground — ruler-straight and long',
  },
  're-use': {
    towers: 'sparse', thickness: 1.0, ditch: true, lane: true, straight: 0.75,
    cause: 'an older work was already on the line — the cut follows it and the old ditch survives',
  },
  'bad-closure': {
    towers: 'sparse', thickness: 1.0, ditch: true, lane: true, straight: 0.0,
    cause: 'two campaigns met and did not agree — a visible seam, a mismatched join, one odd tower',
  },
});

/**
 * ⭐ THE TOWER TYPES — **A TOWER IS A TYPE, NOT A REPEAT** (§1.1.13b; hf315 draws ten genuinely
 * different ones of which the open-backed D and the beaked tower are FUNCTIONAL choices).
 * Every row below is derived from what the run is doing, never from a style dial.
 */
export const TOWER_TYPES = Object.freeze(['drum', 'square', 'open-backed-D', 'beaked', 'angle']);

/** The threat band a clustered run answers to — read from the dossier's own military score. */
export const THREAT_CLUSTER = 1.55;   // clustered runs carry this multiple of the base density
export const THREAT_SPARSE = 0.62;    // and a sparse run this share

/**
 * ⭐⭐ THE FACT VECTOR, READ ONCE PER RING VERTEX. Everything the classifier decides on is in
 * here, so the priority order below is a statement about FACTS and not a chain of ad-hoc tests
 * scattered through a loop.
 *
 * @param {Object} a
 * @returns {Array<Object>}
 */
export function runFacts(a) {
  const { ring, hull, sub, water, seats, margin, roads, priorRing } = a;
  const n = ring.length;
  /** @type {Array<Object>} */ const out = [];
  for (let i = 0; i < n; i++) {
    const p = ring[i];
    const prev = ring[(i - 1 + n) % n], next = ring[(i + 1) % n];
    const ux = p[0] - prev[0], uy = p[1] - prev[1];
    const vx = next[0] - p[0], vy = next[1] - p[1];
    const lu = Math.sqrt(ux * ux + uy * uy) || 1, lv = Math.sqrt(vx * vx + vy * vy) || 1;
    out.push({
      i,
      x: p[0],
      y: p[1],
      segLen: lv,
      // |sin θ| of the turn at this vertex. Winding-agnostic, and it is the only shape term
      // the classifier uses — a wall's straightness is a fact about its own line.
      turn: Math.abs((ux * vy - uy * vx) / (lu * lv)),
      grade: sub ? absoluteGrade(sub, p[0], p[1]) : 0,
      refused: sub ? !!refusalAt(sub, p[0], p[1]) : false,
      waterD: water && water.line ? distToPolyline(p[0], p[1], water.line) : Infinity,
      hullD: hull && hull.length ? distToRing(hull, p[0], p[1]) : Infinity,
      seatD: nearestSeatD(seats, p[0], p[1], 'monumental'),
      workD: nearestSeatD(seats, p[0], p[1], 'work'),
      roadD: nearestLineD(roads, p[0], p[1]),
      priorD: priorRing && priorRing.length ? distToRing(priorRing, p[0], p[1]) : Infinity,
      margin,
    });
  }
  return out;
}

/**
 * ⭐⭐⭐ SEGMENT THE BOUNDARY INTO RUNS **BY CAUSE**, in a FIXED PRIORITY ORDER.
 *
 * ⭐ THE ORDER IS AN ARGUMENT, NOT A CONVENIENCE, AND IT READS FROM THE MOST BINDING PHYSICAL
 * FACT TO THE LEAST:
 *   1. WATER TERMINATION   — the water is the fourth wall; where it stands nothing else can
 *                            decide what the wall is doing, because there is no wall.
 *   2. TERRAIN SURRENDER   — a scarp the fabric itself refuses defends the same ground.
 *   3. NOTCH               — an institution demanded inclusion; the wall doubles back for it.
 *   4. DETOUR TO A WORK    — a mill or quay had to be inside.
 *   5. RE-USE              — an older work was already on the line.
 *   6. CREST               — high ground worth holding.
 *   7. TOFT-BACKS          — the wall hugs the fabric's own property line.
 *   8. NEW CUTTING         — one campaign across open ground: the residual, and it is honest
 *                            as a residual because everything above it is a POSITIVE fact.
 * BAD CLOSURE is not in the ladder: it is a fact about the JOIN, assigned last, at the seam
 * between the first and last run — §1.1.13a's "closure between the first and last run is
 * deliberately imperfect and marks a seam".
 *
 * @param {Object} a
 * @returns {{runs:Array<Object>, reason:string, counts:Record<string,number>}}
 */
export function deriveRuns(a) {
  const {
    ring, hull, sub, water, seats, margin, roads, priorRing, halfRing, form, spec,
    seeding, epoch, threat, frontage, laneWidth,
  } = a;
  if (!ring || ring.length < 3) return { runs: [], reason: 'no ring to segment', counts: {} };
  const facts = runFacts({ ring, hull, sub, water, seats, margin, roads, priorRing });
  const n = facts.length;

  // ── THE PER-LEAF CUTS. Every one is a QUANTILE OF THIS RING'S OWN READING, never an
  //    absolute: `laneMFW1B-receipt.md` §0's standing lesson is that a threshold stated in a
  //    per-place-normalized unit is a quantile wearing a grade's name, and the honest cure is
  //    to say QUANTILE where a quantile is meant.
  const grades = facts.map((f) => f.grade);
  // ⛔⛔ A QUANTILE CUT ON A DEGENERATE DISTRIBUTION SELECTS **EVERYTHING**, AND A PIN CAUGHT IT.
  // On a ring over flat ground every vertex reads grade 0, so p80 is 0 and `grade >= crestCut`
  // is true at every vertex — the whole circuit came back as CREST. ⭐ THE CLASS, and it is
  // `laneMFW1B-receipt.md` §0's lesson from the other side: **a threshold expressed as a
  // quantile is only a threshold where the distribution has a spread; where it does not, the
  // quantile is the minimum and the test is vacuously true.** A crest is ground that is HIGHER
  // THAN THE REST OF THIS RING'S — so the arm is live only where the ring's own p80 stands
  // clear of its own p50.
  const gradeMid = quantile(grades, 0.5);
  const crestCut = quantile(grades, 0.80);
  const crestLive = crestCut > 0 && crestCut > gradeMid * 1.2;
  const segs = facts.map((f) => f.segLen);
  const segMedian = quantile(segs, 0.5);
  const turns = facts.map((f) => f.turn);
  const turnMedian = quantile(turns, 0.5);
  // ⛔⛔ AND THE SAME TRAP ONE COLUMN OVER, CAUGHT BY THE SAME PIN. `turn > turnMedian` is a
  // KNIFE EDGE on a regular polygon: every vertex of a 40-gon turns by the same angle to within
  // float noise, so a strict comparison against the median splits the ring in half AT RANDOM
  // and the flat control came back with **26 runs** instead of one. ⭐ THE CLASS, worth banking
  // beside the crest's: **A QUANTILE COMPARISON WITHOUT A SPREAD TEST LETS FLOATING-POINT NOISE
  // DO THE CLASSIFYING.** A run is only "wobbly" where the ring actually wobbles, and the
  // margin is what makes the test about the shape rather than about the arithmetic.
  const turnHigh = quantile(turns, 0.9);
  const wobbleLive = turnHigh > turnMedian * 1.15;
  const wobbly = (f) => f.turn > turnMedian * 1.20;
  // A "long chord" is a segment several times the ring's own median — the signature the
  // half-ring closure leaves. 2.5× is the value; MEASURED, dry rings top out at 1.6× and
  // half-ring leaves run 2.8–5.5×, so the cut separates the populations rather than splitting
  // one of them. ⚠ §42/§43 VALUE, argued from the corpus table in this module's header.
  const chordCut = segMedian * 2.5;
  const waterReach = water && water.width ? water.width * 1.6 : 0;

  /** @type {string[]} */ const type = new Array(n);
  for (let k = 0; k < n; k++) {
    const f = facts[k];
    // 1 · WATER TERMINATION. Two readings, and BOTH are the water's own act: a vertex standing
    //     within reach of the channel, and the LONG CHORD a half-ring's filter leaves behind
    //     when it drops the flank. ⛔ The chord is the one the corpus was silently stroking.
    if (halfRing && (f.waterD <= waterReach || f.segLen > chordCut)) { type[k] = 'water-termination'; continue; }
    if (f.waterD <= waterReach * 0.75) { type[k] = 'water-termination'; continue; }
    // 2 · TERRAIN SURRENDER. The ground the FABRIC refuses is the ground that defends itself —
    //     one predicate, shared with §5 W1 exit 2's mask, so the wall and the houses cannot
    //     disagree about where the crag is.
    if (f.refused) { type[k] = 'terrain-surrender'; continue; }
    // 3 · NOTCH — a monumental precinct within one working margin of the line, WITH the trace
    //     bending for it. A seat that is merely near is not a notch; a seat the wall turns
    //     around is.
    if (f.seatD < margin * 1.25 && wobbly(f)) { type[k] = 'notch'; continue; }
    // 4 · DETOUR TO A WORK — a mill, quay or pond inside the line.
    if (f.workD < margin * 1.25) { type[k] = 'detour-to-work'; continue; }
    // 5 · RE-USE — an older work was on the line. TWO sources, both facts we hold: a previous
    //     epoch's circuit within half a margin, and a regional road the wall was laid along
    //     (a road embankment is the commonest re-used work there is).
    if (f.priorD < margin * 0.5) { type[k] = 're-use'; continue; }
    if (f.roadD < margin * 0.25 && f.turn < turnMedian) { type[k] = 're-use'; continue; }
    // 6 · CREST — the top fifth of this ring's own ground, AND only where there is a top fifth
    //     to speak of (see `crestLive`).
    if (crestLive && f.grade >= crestCut) { type[k] = 'crest'; continue; }
    // 7 · TOFT-BACKS — the wall hugging its own fabric. Two conditions together, because
    //     either alone is ordinary: it stands CLOSE to the epoch's own outline (inside one
    //     working margin of it) AND it WOBBLES (turning above this ring's own median). That is
    //     what "built along the backs of the tofts" looks like as a measurement.
    if (wobbleLive && f.hullD < margin * 1.15 && wobbly(f)) { type[k] = 'toft-backs'; continue; }
    // 8 · NEW CUTTING — the residual, and every positive fact above has been asked first.
    type[k] = 'new-cutting';
  }

  // ── COALESCE. Contiguous vertices of one type are ONE run. The ring is closed, so the walk
  //    starts at the first type CHANGE — otherwise the run containing index 0 is split in two
  //    and the chain reports a boundary the wall does not have.
  let start = 0;
  while (start < n && type[start] === type[(start - 1 + n) % n]) start++;
  if (start >= n) start = 0;                      // one type all the way round
  /** @type {Array<{type:string, idx:number[]}>} */ const raw = [];
  for (let s = 0; s < n; s++) {
    const k = (start + s) % n;
    const last = raw[raw.length - 1];
    if (last && last.type === type[k]) last.idx.push(k);
    else raw.push({ type: type[k], idx: [k] });
  }
  // ── ABSORB THE SLIVERS. A run shorter than the wall's own working margin is not a decision,
  //    it is a vertex — so it joins the longer of its two neighbours. ⭐ THE MINIMUM IS THE
  //    MARGIN because the margin is the ONE length this circuit already states about itself;
  //    a new constant here would be the knob §240.2 forbids one stage earlier.
  const runLen = (r) => { let L = 0; for (const k of r.idx) L += facts[k].segLen; return L; };
  let merged = raw;
  for (let pass = 0; pass < 4 && merged.length > 1; pass++) {
    /** @type {Array<{type:string, idx:number[]}>} */ const next = [];
    let changed = false;
    for (let r = 0; r < merged.length; r++) {
      const cur = merged[r];
      if (next.length && next[next.length - 1].type === cur.type) {
        next[next.length - 1].idx = next[next.length - 1].idx.concat(cur.idx);
        continue;
      }
      // ⚠ A TERRAIN-SURRENDER OR WATER RUN IS NEVER ABSORBED, however short. It is the one
      // place the law says the wall changes KIND (no towers, a parapet), and swallowing it
      // into a neighbour would put towers back on the flank the corpus measures bare.
      if (runLen(cur) >= margin || cur.type === 'terrain-surrender' || cur.type === 'water-termination'
        || merged.length <= 3) { next.push({ type: cur.type, idx: cur.idx.slice() }); continue; }
      const prevRun = next.length ? next[next.length - 1] : null;
      const nextRun = r + 1 < merged.length ? merged[r + 1] : null;
      if (prevRun && (!nextRun || runLen(prevRun) >= runLen(nextRun))) {
        prevRun.idx = prevRun.idx.concat(cur.idx);
      } else if (nextRun) {
        nextRun.idx = cur.idx.concat(nextRun.idx);
      } else { next.push({ type: cur.type, idx: cur.idx.slice() }); continue; }
      changed = true;
    }
    merged = next;
    if (!changed) break;
  }
  // The closed chain's first and last runs are one run when they share a type.
  if (merged.length > 2 && merged[0].type === merged[merged.length - 1].type) {
    merged[0].idx = merged.pop().idx.concat(merged[0].idx);
  }

  // ── ⭐⭐ THE SEAM. §1.1.13a: closure between the first and last run is DELIBERATELY IMPERFECT
  //    and marks a seam. The join is a BAD CLOSURE only where the two campaigns genuinely did
  //    not agree — measured as the two runs meeting at a turn above this ring's p90 — so a
  //    circuit built in one push does not grow a fictitious seam.
  const turnP90 = turnHigh;
  if (merged.length >= 3) {
    const joinIdx = merged[0].idx[0];
    const join = facts[joinIdx];
    const closeable = merged[0].type !== 'water-termination' && merged[0].type !== 'terrain-surrender'
      && merged[merged.length - 1].type !== 'water-termination'
      && merged[merged.length - 1].type !== 'terrain-surrender';
    if (closeable && join.turn >= turnP90) {
      // ⛔ AND THE FIRST SPELLING REQUIRED THE JOIN RUN TO BE LONGER THAN ONE VERTEX, WHICH IS
      // BACKWARDS. MEASURED on the metropolis's E1 old core: the seam's own turn EQUALS the
      // ring's p90 (0.968) and the run at the join is exactly ONE vertex — so the arm that
      // exists to catch "a mismatched join, one odd tower" was refusing the only shape in the
      // corpus that is literally one odd vertex. ⭐ THE CLASS: **A GUARD WRITTEN FOR THE COMMON
      // CASE CAN EXCLUDE THE VERY CASE THE RULE WAS WRITTEN FOR.** A short join run is RE-TYPED
      // whole; a long one is split.
      if (merged[0].idx.length > 1) {
        const cut = merged[0].idx.splice(0, Math.max(1, Math.round(merged[0].idx.length * 0.34)));
        merged.unshift({ type: 'bad-closure', idx: cut });
      } else {
        merged[0].type = 'bad-closure';
      }
    }
  }

  // ── BUILD THE RUNS.
  /** @type {Array<Object>} */ const runs = [];
  /** @type {Record<string, number>} */ const counts = {};
  for (let r = 0; r < merged.length; r++) {
    const m = merged[r];
    const pol = RUN_POLICY[m.type];
    if (!pol) throw new Error(`wallRuns: '${m.type}' is not in RUN_TYPES`);
    counts[m.type] = (counts[m.type] || 0) + 1;
    const line = m.idx.map((k) => /** @type {[number,number]} */ ([ring[k][0], ring[k][1]]));
    let length = 0;
    for (let k = 0; k + 1 < line.length; k++) {
      length += Math.sqrt((line[k + 1][0] - line[k][0]) ** 2 + (line[k + 1][1] - line[k][1]) ** 2);
    }
    runs.push({
      // ⚠ THE KEY IS TYPE + START VERTEX, NEVER THE RUN'S ORDINAL. §240.4's inertia law at run
      // granularity: a run must keep its own rng stream when a NEIGHBOUR is reclassified, and
      // an ordinal key re-rolls every run after the one that changed.
      key: `run.${m.type}.${m.idx[0]}`,
      type: m.type,
      idx: m.idx.slice(),
      line,
      length,
      towerPolicy: pol.towers,
      thickness: pol.thickness,
      ditch: pol.ditch,
      lane: pol.lane,
      laneWidth: pol.lane ? laneWidth : 0,
      straight: pol.straight,
      cause: pol.cause,
    });
  }

  // ── ⭐⭐ THE TOWERS, PER RUN. Positions are SEEDED-IRREGULAR inside the run (exit 9's second
  //    branch — see the module header for why SUB-3's corner rule is held). The DENSITY is the
  //    form's own facet interval restated as a length, so this wave changes WHERE towers stand
  //    and WHICH KIND they are without inventing a new spacing number.
  const baseEvery = Math.max(1, spec.towerEvery) * Math.max(1, segMedian);
  for (const run of runs) {
    // ⭐ AN ANGLE TOWER IS A FACT ABOUT A **JUNCTION**, and asking it that way is what lets the
    // other kinds exist. My first spelling made the first and last tower of every run an angle
    // tower, which on a corpus whose runs mostly carry one or two towers meant angle towers
    // everywhere and `square` / `open-backed-D` never firing at all — a vocabulary that cannot
    // occur is the class `laneMFW1B-receipt.md` §8.1 built its totality walker for.
    run.corner = facts[run.idx[0]].turn >= turnP90;
    run.towers = towersFor({
      run, baseEvery, seeding, epoch, threat, form, frontage,
    });
  }

  const total = runs.reduce((s, r) => s + r.towers.length, 0);
  return {
    runs,
    counts,
    reason: `${runs.length} typed run(s): `
      + runs.map((r) => `${r.type}(${Math.round(r.length)}u, ${r.towers.length}T)`).join(' → ')
      + `; ${total} tower(s) — positions SEEDED-IRREGULAR (SUB-3's corner rule is HELD: G-40(i)`
      + ' produced NO INSTRUMENT, laneMFW0-receipt §6.2)',
  };
}

/**
 * ⭐⭐ ONE RUN'S TOWERS. `none` returns nothing at all and that is the measured point: six of
 * seven walled plates show towers ABSENT on at least one flank, and in every one of those six
 * the bare flank is the TERRAIN-DEFENDED one.
 */
export function towersFor(a) {
  const { run, baseEvery, seeding, epoch, threat, form } = a;
  if (run.towerPolicy === 'none' || run.line.length < 2) return [];
  const density = run.towerPolicy === 'clustered'
    ? THREAT_CLUSTER * (0.75 + 0.5 * clamp01(threat))
    : THREAT_SPARSE;
  const every = baseEvery / Math.max(0.2, density);
  // ⛔ `Math.floor` PER RUN LOSES A TOWER PER RUN, AND A CHAIN OF THIRTEEN RUNS LOSES THIRTEEN.
  // MEASURED on the coastal city: the ring-wide interval gave 20 towers and the first per-run
  // spelling gave 9 — a wall the reader would read as unbuilt. ⭐ THE CLASS: **A QUANTITY
  // DERIVED PER SEGMENT AND FLOORED IS NOT THE SAME QUANTITY DERIVED WHOLE AND FLOORED.** A run
  // longer than half an interval carries at least one tower, which is also what a run IS: a
  // stretch of wall somebody decided about.
  const count = run.length >= every * 0.5
    ? Math.max(1, Math.round(run.length / Math.max(1, every)))
    : 0;
  if (count < 1) return [];
  const rng = fabricRng(seeding.seed, `wall.epoch.${epoch}.${run.key}`, { variant: seeding.variant });
  /** @type {Array<{x:number,y:number,kind:string,at:number}>} */ const out = [];
  // The stations are the run's own arc-length divisions, each JITTERED by up to ±0.4 of a
  // division — §214 bans even spacing by name and ATLAS's banned prior #7 makes it the
  // strongest "generated" tell in the corpus. The jitter is drawn from THIS RUN's stream.
  for (let k = 0; k < count; k++) {
    const t = (k + 0.5) / count + rng.jitter(0.4 / count);
    const p = alongRun(run.line, run.length * clamp01(t));
    if (!p) continue;
    out.push({
      x: p[0], y: p[1], at: t,
      kind: towerKind({ run, form, threat, first: k === 0, last: k === count - 1, rng }),
    });
  }
  return out;
}

/**
 * ⭐ WHICH KIND OF TOWER — **A TOWER IS A TYPE, NOT A REPEAT**, and every branch is a FUNCTION
 * rather than a style: the beaked tower presents an angle to the shot that is coming, the
 * open-backed D is the cheap one you build where nothing is coming, the angle tower is what
 * stands where two runs meet.
 */
export function towerKind(a) {
  const { run, form, threat, first, rng } = a;
  // ⭐ THE ANGLE TOWER IS THE ONE THAT STANDS WHERE TWO RUNS MEET AT A REAL CORNER — the run's
  // own start vertex turning above the ring's p90. A run that begins on a gentle curve begins
  // with an ordinary tower, which is the honest reading and is what leaves the other kinds a
  // population to occur in.
  if (first && run.corner) return 'angle';
  if (run.type === 'bad-closure') return 'angle';
  if (run.towerPolicy === 'clustered' && threat >= 0.6) return 'beaked';
  if (run.towerPolicy === 'clustered') return 'drum';
  if (form === 'palisade' || form === 'bank') return 'square';
  // A sparse stone run takes the cheap open-backed D most of the time and a drum sometimes —
  // the one place the roll decides, because the choice is a mason's and not the ground's.
  return rng.chance(0.68) ? 'open-backed-D' : 'drum';
}

/** The point at arc length `s` along a run's polyline. */
export function alongRun(line, s) {
  if (line.length < 2) return line[0] || null;
  let acc = 0;
  for (let i = 0; i + 1 < line.length; i++) {
    const dx = line[i + 1][0] - line[i][0], dy = line[i + 1][1] - line[i][1];
    const L = Math.sqrt(dx * dx + dy * dy);
    if (acc + L >= s) {
      const t = L > 0 ? (s - acc) / L : 0;
      return /** @type {[number,number]} */ ([line[i][0] + dx * t, line[i][1] + dy * t]);
    }
    acc += L;
  }
  return line[line.length - 1];
}

/**
 * ⭐⭐⭐ §200's BAND, PER RUN — and this is the function §5 W2 exit 4 is about.
 *
 * The circuit's band has three parts (walls.wallBand): the stones, the INTERVALLUM inside and
 * the GLACIS outside. ⭐ **THE INTERVALLUM IS THE WALL-SIDE STREET.** §259 found the mechanism
 * and §258.2 requires it to be expressed as a SETBACK rather than as a drawn lane: the lane
 * appears automatically wherever the wall edge carries the LARGEST setback in the fabric.
 *
 * ⛔⛔ AND THE CENSUS CONSEQUENCE IS RULED (§251.4b): **7/7 walled plates show a wall-side
 * street on SOME runs, 0/7 on EVERY run**, so a GLOBAL intervallum reserves a band the corpus
 * never draws — and §200's clearance census READS 0 ON CORRECT OUTPUT ONLY IF ITS EXEMPTION
 * KEYS TO RUN TYPE. ATLAS T-22 warned that inner-face abutment is NORMAL in military compounds
 * and must be exempted by name; CONTEXT widens that to **any run built along existing
 * property** — the toft-backs run.
 *
 * ⚠ THE EXEMPTION ONLY EVER FREES GROUND. A run that carries no lane reserves LESS than the
 * whole-ring band did, never more, so nothing this function does can put a body inside a
 * reservation that already stood.
 *
 * @param {{stone:number, inner:number, outer:number, inkHalf:number}} band the ring's own band
 * @param {{lane:boolean, thickness:number, type:string}} run
 * @returns {{stone:number, inner:number, outer:number, width:number, half:number, shift:number,
 *            inkHalf:number, lane:boolean, exempt:string|null}}
 */
export function runBand(band, run) {
  const stone = band.stone * run.thickness;
  // The side floor is the ink's own half-width: a reservation thinner than the stroke that
  // draws it would let the lens cover ground no law reserved (walls.wallBand's own finding,
  // re-applied to the thinner parapet a terrain-surrender run carries).
  const sideFloor = Math.max(0, band.inkHalf - stone / 2);
  const inner = run.lane ? Math.max(band.inner, sideFloor) : sideFloor;
  const outer = Math.max(band.outer, sideFloor);
  const width = stone + inner + outer;
  return {
    stone, inner, outer, width, half: width / 2, shift: (outer - inner) / 2,
    inkHalf: band.inkHalf, lane: run.lane,
    exempt: run.lane ? null : `${run.type}: the inner face is abutted lawfully (ATLAS T-22, widened by CONTEXT to any run built along existing property)`,
  };
}

/**
 * ⭐⭐ THE WALL-SIDE LANE'S OWN LINE — the intervallum's centreline, INSIDE the run. It is a
 * consequence of the setback rather than a second geometry: the carriageway is exactly the
 * ground the band already reserves, so the lane can never be drawn where the law did not
 * reserve it, and §200 stays a theorem rather than a hope.
 */
export function laneLineFor(run, ring, band) {
  if (!run.lane || run.line.length < 2) return null;
  const inset = band.stone / 2 + band.inner / 2;
  /** @type {Array<[number,number]>} */ const out = [];
  const n = ring.length;
  for (let k = 0; k < run.idx.length; k++) {
    const i = run.idx[k];
    const a = ring[(i - 1 + n) % n], b = ring[i], c = ring[(i + 1) % n];
    // The INWARD normal of the vertex, from the mean of its two edge normals, oriented by the
    // ring's own interior — winding-agnostic, exactly as epochAxis.edgeNormal is.
    let nx = 0, ny = 0;
    for (const [p, q] of [[a, b], [b, c]]) {
      let ex = q[1] - p[1], ey = -(q[0] - p[0]);
      const L = Math.sqrt(ex * ex + ey * ey);
      if (L < 1e-12) continue;
      nx += ex / L; ny += ey / L;
    }
    const L = Math.sqrt(nx * nx + ny * ny);
    if (L < 1e-9) continue;
    nx /= L; ny /= L;
    if (!pointInRingLocal(ring, b[0] + nx * 0.05, b[1] + ny * 0.05)) { nx = -nx; ny = -ny; }
    out.push([b[0] + nx * inset, b[1] + ny * inset]);
  }
  return out.length >= 2 ? out : null;
}

/* ── small shared helpers ───────────────────────────────────────────────────────────────── */

function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

export function quantile(arr, p) {
  if (!arr.length) return 0;
  const s = arr.slice().sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(p * s.length)))];
}

function distToRing(poly, px, py) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = dx * dx + dy * dy;
    let t = L > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const qx = a[0] + dx * t, qy = a[1] + dy * t;
    const d = Math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
    if (d < best) best = d;
  }
  return best;
}

function nearestLineD(lines, px, py) {
  let best = Infinity;
  for (const l of (lines || [])) {
    const d = distToPolyline(px, py, l.line || l);
    if (d < best) best = d;
  }
  return best;
}

/**
 * The nearest seat of a KIND. ⚠ THE SEATS ARE A DECLARED INPUT, never a live handle onto the
 * institution list: `wallCircuit.WALL_CIRCUIT_INPUTS` hashes them, so a seat that MOVED
 * without changing the count moves the circuit's input hash — which is exactly the staleness
 * B8b §11.3 named as the seam a future lane can smuggle a fact through.
 */
function nearestSeatD(seats, px, py, kind) {
  let best = Infinity;
  for (const s of (seats || [])) {
    if (s.kind !== kind) continue;
    const d = Math.sqrt((px - s.x) * (px - s.x) + (py - s.y) * (py - s.y));
    if (d < best) best = d;
  }
  return best;
}

function pointInRingLocal(poly, px, py) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > py) !== (yj > py)) {
      const x = (xj - xi) * (py - yi) / (yj - yi) + xi;
      if (px < x) inside = !inside;
    }
  }
  return inside;
}

/**
 * ⭐⭐ THE WALL'S OWN META ROWS — G-42's epoch count, the run chain's census and the fossil
 * ladder's figures, assembled where they are derived rather than in the assembly.
 *
 * ⚠ IT LIVES HERE FOR THE REASON MF-PERF1 §9 GAVE FOR THE FIRST TWO EXTRACTIONS AND THE 800-LINE
 * DOMAIN CEILING ENFORCED: `buildFabric.js` reached **822 effective lines** with these rows
 * inline. The ceiling is what makes the decomposition happen at the right seam instead of being
 * discovered later — *"the decomposition was a benefit disguised as a cost"*.
 *
 * @param {Array<any>} walls the circuit's rings
 * @param {any} demotion     the SITED fossil set
 * @returns {Record<string, any>}
 */
export function wallMeta(walls, demotion) {
  const runTypes = {};
  const towerTypes = {};
  for (const w of walls) {
    for (const k of Object.keys(w.runCounts || {})) runTypes[k] = (runTypes[k] || 0) + w.runCounts[k];
    for (const k of (w.towerTypes || [])) towerTypes[k] = (towerTypes[k] || 0) + 1;
  }
  const fates = {};
  for (const f of (demotion.fates || [])) fates[f.rung] = (fates[f.rung] || 0) + 1;
  const emissions = demotion.ringStreets.length + demotion.dwellings.length
    + demotion.gardens.length + demotion.widenings.length + demotion.stubs.length;
  return {
    wallRuns: walls.reduce((n, w) => n + (w.runs ? w.runs.length : 0), 0),
    wallRunTypes: runTypes,
    wallTowerTypes: towerTypes,
    wallRunReason: walls.map((w) => `${w.kind} E${w.epoch}: ${w.runReason}`).join(' · ') || 'unwalled — no runs',
    wallLaneRuns: walls.reduce((n, w) => n + (w.laneRuns || 0), 0),
    wallAbuttedRuns: walls.reduce((n, w) => n + (w.abuttedRuns || 0), 0),
    demotedCircuits: demotion.ringStreets.length,
    demotedEmissions: emissions,
    demotedTowerRounds: demotion.dwellings.length,
    demotedDitchGardens: demotion.gardens.length,
    demotedGateWidenings: demotion.widenings.length,
    demotedStubs: demotion.stubs.length,
    demotedFates: fates,
    demotionReason: `${demotion.reason}; ${demotion.sitingReason || 'nothing to site'}`,
  };
}
