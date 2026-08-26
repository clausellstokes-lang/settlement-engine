/**
 * domain/townMap/fabric/wallPublication.js — ⭐⭐⭐ DRESS-1 · **THE OPENING ACT: THE WALL
 * SUCCESSOR PUBLICATION** (DESIGN_SPINE_COMPLETION PANEL AMENDMENT **PA.2**, and SPINE A1.3's
 * S2-M5 *"the circuit node's published contract gets a SUCCESSOR SPEC … the band face publishes
 * the same surface"*).
 *
 * ⭐⭐⭐ **WHY THIS FILE EXISTS BEFORE ANY INK.** PA.2: *"Before any ink: from the WALLBAND face +
 * ledger events, publish the exact surface that `rampartWorks`/`wallRuns` consume today … one
 * ordered cycle PER FRAGMENT … The dress modules become CONSUMERS, NEVER RE-DERIVERS."* Every
 * previous generation of this estate carried the same law spelled twice — GROW-FOLD found
 * `frontierHost` and `pickHost` spelling one host law two ways inside one module, and §686.3
 * called it *"the second time this program has found one law spelled two ways"*. A dress that
 * re-derived runs, bands, gates and towers from the ring would be the third. So the derivation
 * happens ONCE, here, off the partition's own faces, and the dress reads the result.
 *
 * ⭐⭐ **WHAT IS PUBLISHED, AND WHERE EVERY FIELD COMES FROM.** Per wrap, per FRAGMENT:
 *   `ring`         the wrap's own facet-resampled outer cycle (`wrap.outer`), sliced to the
 *                  fragment. A closed circuit publishes ONE fragment with `closed: true`.
 *   `runs`         the typed run chain, each carrying `RUN_POLICY`'s own `cause` STRING —
 *                  imported, never re-worded, so a run's stated reason cannot drift from the
 *                  table `tests/lint/wallRuns.walker.test.js` walks.
 *   `runOfVertex`  fragment-vertex index → run index. Total by construction.
 *   `runBands`     `runBand(band, run)` from `wallRuns.js` — the estate's own function, called,
 *                  not re-implemented. The ring band's `stone` is **`wallForm.width`** (PA.2's
 *                  own sourcing): the annulus between the wrap's outer and inner rings IS the
 *                  band face's thickness, so reading it is the consumer law applied to the one
 *                  number a re-deriver would have recomputed from the form's weight.
 *   `gates`        `wrap.gates` (WAY faces gated at the raise) **and `wrap.waterGates`** — A1.3
 *                  S2-M1's own class, flagged `water: true`, because hf313's water gate is a
 *                  different anatomy and a roster that hides it makes the dress guess.
 *   `towers`       towers-as-joints AT THE FACET ECONOMY'S VERTICES, filtered by the run's own
 *                  `towers` policy (`none` on a terrain-surrender or water-termination run —
 *                  §205.3: *a cliff flank needs NO wall*, so it certainly needs no tower).
 *   `form`/`epoch`/`vintage`  the rung name, the fold epoch, and `wrap.year` — A1.3's VINTAGE
 *                  HONESTY (S2-M4): the year is required by the wrap schema, so a vintage with
 *                  no year is structurally unrepresentable and this publication cannot invent one.
 *
 * ⛔⛔ **THE RUN CLASSIFIER IS NOT SPELLED HERE ANY MORE — SPINE-3, ODQ §692.6(ii).** This file
 * used to carry its own ladder, and the estate then had TWO producers of the same nine types.
 * MEASURED at the DRESS-1b seal: **the successor produced 0 of the 83 runs the legacy producer
 * classifies as `crest`/`notch`/`terrain-surrender`/`detour-to-work` on the same corpus** — a
 * LOST SIGNAL, and the third instance of the exact defect this file's header was written to
 * prevent. `wallRuns.runCuts` + `wallRuns.runTypeAt` are now the ONE ladder; this file builds the
 * FACT VECTOR from the partition's own faces and calls it. See `partitionRunFacts` for the
 * column-by-column mapping and for what each column can and cannot answer.
 *
 * ⭐ **ONE TYPE REMAINS UNGROUNDED BY RULING, NOT BY OMISSION.** `notch` needs an institution
 * roster; A1.5 keeps seating its own car (CAR-SEATING), so no precinct exists for a wall to
 * double back around and this publication mints none. `crest` and `terrain-surrender` are
 * grounded **when the caller supplies a SITE** — the heightfield is a §2 spine input that nothing
 * ever carried — and declared in `publication.ungrounded` when it does not.
 *
 * PURITY: one keyed `fabricRng` stream, seeded from the partition's own seed — the same
 * discipline `deriveRampartWorks` uses, and deterministic for the same reason. No `Date`, no
 * `Math.random`.
 */

import { faceCentroid, faceRing, liveFaces } from './partitionArrangement.js';
import {
  RUN_POLICY, RUN_TYPES, runBand, towerKind, quantile, runCuts, runTypeAt, markSeam,
} from './wallRuns.js';
import { WALL_BAND, WALL_MARGIN_DEFAULT } from './walls.js';
import { rampartRung, turnAt, TURN_FLOOR_DEG, TURN_QUANTILE } from './rampartWorks.js';
import { keyedRandom } from './fabricRng.js';
import { distToPolyline, pointInPolygon } from './fabricGeometry.js';
import { absoluteGrade, refusalAt } from './groundRefusal.js';

export const WALL_PUBLICATION_SCHEMA_VERSION = 1;

/**
 * ⭐ THE THREE RUN TYPES THIS PUBLICATION CANNOT GROUND, NAMED SO THE ZERO IS READ AS A REFUSAL
 * AND NOT AS AN ABSENCE. §9 law 8: *absence decays — re-measure every inherited zero at the slot
 * that consumes it.* This is the slot; the measure is "the input does not exist".
 */
export const UNGROUNDED_RUN_TYPES = Object.freeze({
  notch: 'SPINE A1.5 keeps institution seating its own car, so no precinct exists to double back'
    + ' around; the SEATING CAR is where this type becomes mintable',
});

/**
 * ⭐⭐ **THE TYPES THIS PUBLICATION CAN ONLY GROUND WHEN THE CALLER SUPPLIES THE SITE.** SPINE-3.
 *
 * §2 of DESIGN_SPINE charters the heightfield as a spine INPUT and §5 lists it under CONSUMES
 * UNCHANGED — and nothing ever carried it, which is why DRESS-1's grade claim documented a
 * behaviour that could not fire. It reaches the classifier now, by the same route `form` and
 * `frontage` reach it: the CALLER hands it in. A call that hands none does not get a zero, it
 * gets a declared refusal in `publication.ungrounded`, because **a zero and a refusal are
 * different facts and a single table of noughts hides which is which** (§9 law 8).
 */
export const SITE_GROUNDED_RUN_TYPES = Object.freeze({
  crest: 'the caller supplied no SITE, so no ground exists to be higher than the rest of — a'
    + ' crest minted from ring curvature would be a manufactured hill',
  'terrain-surrender': 'the caller supplied no SITE, so the refusal mask cannot be read; ⛔ the'
    + ' partition\'s own CLIFF edges cannot answer it either — the constructor mints NONE'
    + ' (0 of 91,669 corpus-wide, three convicting plants), so that column is structurally false',
});

/**
 * ⚠⚠ **A ZERO IS NOT A REFUSAL, AND CONFLATING THEM WOULD BE THE WORSE ERROR.**
 * `detour-to-work` keys on published QUAY faces — a partition fact, tested for below, and it
 * reads zero on a leaf whose quays stand outside a working margin of the circuit. That is a
 * measurement about the leaf, not a gap in the classifier.
 *
 * ⛔ **CORRECTED AT SPINE-3, AND THE CORRECTION IS THE POINT.** This roster used to carry
 * `terrain-surrender` on the same footing, justified by *"no corpus leaf puts a cliff edge …
 * within a band's reach"*. That was false: there is no cliff edge ANYWHERE and none can be
 * minted, so the reach was never the question. An unfired classifier and an absent input read
 * identically from a table of noughts, which is exactly why they are now separated by name.
 */
export const GROUNDED_BUT_UNFIRED = Object.freeze(['detour-to-work']);

/**
 * `bad-closure` is CONDITIONAL, not ungrounded: it is a fact about the JOIN and is assigned at the
 * seam between the first and last run of a CLOSED cycle — so an open fragment (a half-ring whose
 * fourth side is the bank) correctly never carries one.
 */
export const CONDITIONAL_RUN_TYPES = Object.freeze(['bad-closure']);

/**
 * How near a ring vertex must come to a CLIFF edge to be a terminus, in band widths.
 * ⚠ SINCE SPINE-3 THIS IS THE ONLY REACH STATED IN BAND WIDTHS, and it is the right unit for the
 * one question it answers (a curtain stops AT a brink, not a margin away from it). Every other
 * proximity in the classifier is stated in the circuit's own WORKING MARGIN, which is what the
 * estate's one ladder reads. ⛔ Stating them ALL in band widths was the old classifier's scale
 * error and cost the publication four whole run types.
 */
const NEAR_BANDS = 2.4;

/**
 * ⭐⭐⭐ PUBLISH ONE PARTITION'S WALL WORKS.
 *
 * @param {any} partition a `SETTLED_GROUND_PARTITION`
 * @param {{form?:string, frontage?:number, glacisClear?:boolean, seed?:string|number,
 *          variant?:any}} [opts]
 */
export function publishWallWorks(partition, opts = {}) {
  const arr = partition.arrangement;
  const frontage = opts.frontage || 5;
  const glacisClear = opts.glacisClear !== false;
  const formGiven = typeof opts.form === 'string' && rampartRung(opts.form) ? opts.form : null;
  // ⚠ NEVER INVENT A HEAVIER DEFENCE. `rampartRung` already degrades to the palisade rung; the
  // publication says so out loud rather than letting a caller's omission read as a ruling.
  const form = formGiven || 'palisade';
  const seed = opts.seed != null ? opts.seed : (partition.inputEcho && partition.inputEcho.seed) || 'wallpub';

  /**
   * ⭐⭐ **THE SITE — DECLARED, OPTIONAL, AND CARRIED BY THE CALLER.** The substrate is a §2
   * spine input the pipeline never delivered; the caller holds the fabric and therefore holds it.
   * Handed in, `crest` and `terrain-surrender` become real readings; withheld, they are DECLARED
   * ungrounded on the publication rather than printed as zeroes.
   */
  const site = opts.site && opts.site.slope ? opts.site : null;
  /** The channel's own width — `waterReach`'s source in `wallRuns.runCuts`. */
  const water = opts.water && opts.water.width ? { width: opts.water.width } : null;
  /** The §648 channel's own centreline, when the caller carries it — see `waterDistance`. */
  const channel = opts.water && Array.isArray(opts.water.line) && opts.water.line.length > 1
    ? opts.water.line : null;

  const waterFaces = [];
  const quayFaces = new Set((partition.quays || []).map((q) => q.face).filter((f) => f != null));
  const cliffPts = [];
  const plotPts = [];
  const arteryPts = [];
  for (const f of liveFaces(arr)) {
    if (f.cls === 'WATER') { waterFaces.push({ id: f.id, ring: faceRing(arr, f.id) }); continue; }
    if (f.cls === 'PLOT') { plotPts.push(faceCentroid(arr, f.id)); continue; }
    // ⭐ THE REGIONAL CORRIDOR, IN THE PARTITION'S OWN VOCABULARY. `re-use`'s second source is
    // "a road embankment already on the line", and an ARTERY is what that is here — a street or
    // a lane is the town's own web, which every wall stands beside and none is laid along.
    if (f.cls === 'WAY' && f.attrs && f.attrs.rank === 'artery') arteryPts.push(faceCentroid(arr, f.id));
  }
  const quayPts = [];
  for (const fid of quayFaces) {
    const f = arr.faces[fid];
    if (f && f.alive) quayPts.push(faceCentroid(arr, fid));
  }
  for (const e of arr.edges) {
    if (e.type !== 'CLIFF') continue;
    const he = arr.halfEdges[e.he];
    const a = arr.verts[he.origin];
    cliffPts.push([a.x / arr.quantumPerUnit, a.y / arr.quantumPerUnit]);
  }

  const circuits = [];
  const counts = {};
  for (const t of RUN_TYPES) counts[t] = 0;

  for (const wrap of partition.wraps || []) {
    const ring = (wrap.outer || []).map((p) => [p[0], p[1]]);
    if (ring.length < 4) continue;
    const stone = wrap.bandWidth;
    const band = ringBand(stone, frontage, glacisClear);
    /**
     * ⭐ THE CIRCUIT'S OWN WORKING MARGIN — the length every proximity in the ladder is stated
     * in. The caller supplies it when it knows the tier (`WALL_MARGIN[tier] * builtRadius`);
     * otherwise it is the wrap's **own** recorded `frozenRadius` at the estate's own default
     * share. ⛔ THE OLD CLASSIFIER STATED ITS RADII IN BAND WIDTHS — about 2 units against this
     * ~24 — which is why it read zero for every type the legacy finds by a margin's reach.
     */
    const margin = opts.margin != null ? opts.margin
      : WALL_MARGIN_DEFAULT * (wrap.frozenRadius || meanRadius(ring));

    // ── the gate roster: the raise's own WAY gates, plus A1.3 S2-M1's WATER gates ────────────
    const gates = [];
    for (const fid of wrap.gates || []) {
      const f = arr.faces[fid];
      if (!f || !f.alive) continue;
      const c = faceCentroid(arr, fid);
      const n = ringNormalAt(ring, nearestVertex(ring, c));
      gates.push(Object.freeze({
        key: `gate.${fid}`, face: fid, x: c[0], y: c[1], dx: n[0], dy: n[1],
        rank: (f.attrs && f.attrs.rank) || 'street',
        bricked: false, water: false, forced: wrap.forcedGate === fid,
      }));
    }
    for (const fid of wrap.waterGates || []) {
      const f = arr.faces[fid];
      if (!f || !f.alive) continue;
      const c = faceCentroid(arr, fid);
      const n = ringNormalAt(ring, nearestVertex(ring, c));
      gates.push(Object.freeze({
        key: `watergate.${fid}`, face: fid, x: c[0], y: c[1], dx: n[0], dy: n[1],
        rank: 'water', bricked: false, water: true, forced: false,
      }));
    }

    // ── THE FRAGMENTS. A wrap that never met water is ONE closed cycle; a wrap that did is a
    //    chain per reach between its water gates — A1.3's half-ring, whose fourth side IS the
    //    bank, published as the open cycle it actually is rather than as a closed lie.
    const cut = new Set();
    for (const g of gates) if (g.water) cut.add(nearestVertex(ring, [g.x, g.y]));
    /**
     * ⛔⛔ **AND THE WATER ITSELF CUTS, NOT ONLY THE GATE ROSTER — SPINE-3, §692.9(ii).**
     *
     * A reader found a wall drawn straight across the bay on `city` and `migration`: MEASURED,
     * wrap E1's ring runs **303.6 of 1,787.5 units (17.0 %) inside the WATER face**, four
     * consecutive vertices in open sea, two proper crossings of the shore. Nothing objected.
     *
     * **THE MECHANISM, AND IT IS A PREDICATE THAT CANNOT FIRE.** `raiseWrap` mints a water gate
     * for a WATER face whose **CENTROID** falls inside the band annulus. A coast's water body
     * reaches 1.6 extent radii seaward by `BANK_LAW.coastReach`, so its centroid is *by
     * construction* outside every wrap — the guard is unfireable on exactly the leaves that need
     * it. With no water gate, `sliceCycle` never opened the ring, the half-ring apparatus (the
     * terminus works, `towers:'none'`, the open cycle) was unreachable, and the dress painted a
     * closed band over the sea.
     *
     * ⭐ **THE CURE IS THE ESTATE'S OWN LAW, RE-APPLIED AT THIS SEAM.** `walls.js`'s legacy trace
     * already drops ring vertices the water holds — *"the water is the fourth wall"*, §161m.3 —
     * and that law simply never crossed to the successor. It does now: **a ring vertex standing
     * inside a WATER face is not ground a wall can stand on**, so the cycle is published as the
     * DRY spans it actually occupies and the curtain ends at the bank.
     *
     * ⚠⚠ **THIS MOVES NO GEOMETRY.** `wrap.outer` and `wrap.inner` are untouched — so the band's
     * width, the ring-sanity table and every wrap figure in the estate read exactly what they
     * read before. What moves is what is PUBLISHED AS WALL. The wrap ring still crosses the
     * water, and that is a CONSTRUCTOR defect reported, not cured, here.
     */
    const wetVertexAt = ring.map((p) => waterFaces.some((f) => f.ring.length >= 3 && pointInPolygon(p[0], p[1], f.ring)));
    const wetVertices = wetVertexAt.reduce((s, v) => s + (v ? 1 : 0), 0);
    /**
     * ⛔⛔ **AND THE DROP IS BY SEGMENT, NOT BY VERTEX — MY OWN FIRST SPELLING WAS CONVICTED BY
     * THE CENSUS I BUILT TO CONVICT IT.** Dropping only the vertices the water holds still
     * published **four wraps drawing over water** (`town-2`, `highwater`, `year-018`, `year-100`),
     * and `year-100` had **ZERO wet vertices and 33.5 units of wall over the river**: on a
     * 26-facet ring the segments are tens of units long, so a narrow reach passes clean between
     * two dry vertices. ⭐ THE CLASS: **a vertex test measures the vertices, not the line.**
     *
     * The exact rule: a SEGMENT is wet if any point along it stands in water; a VERTEX is dropped
     * if it is wet OR incident to a wet segment. Every surviving consecutive pair therefore spans
     * a segment that was measured dry, so a published fragment cannot cross water — which is the
     * property, proven rather than hoped for.
     */
    const wetAt = wetVertexAt.slice();
    if (waterFaces.length) {
      for (let i = 0; i < ring.length; i++) {
        const j = (i + 1) % ring.length;
        if (!segmentTouchesWater(ring[i], ring[j], waterFaces)) continue;
        wetAt[i] = true; wetAt[j] = true;
      }
    }
    const anyWet = wetAt.some((v) => v);
    const fragments = anyWet ? sliceAtWater(ring, wetAt, cut) : sliceCycle(ring, cut);

    const priorRings = circuits.map((c) => c.ring);
    const published = [];
    for (const [fi, frag] of fragments.entries()) {
      const runs = classifyRuns(frag, {
        arr, waterFaces, quayPts, arteryPts, plotPts, cliffPts, priorRings, gates, stone, form,
        margin, site, water, channel,
      });
      for (const r of runs) counts[r.type]++;
      const runOfVertex = new Array(frag.pts.length).fill(0);
      for (const [ri, r] of runs.entries()) for (const i of r.idx) runOfVertex[i] = ri;
      const runBands = runs.map((r) => Object.freeze(runBand(band, r)));
      /**
       * ⭐⭐ **A KEYED HASH, NOT A STREAM — THE WALL NODE'S OWN DECLARED DISCIPLINE.** A
       * `fabricRng` stream would have moved the fabric's pinned stateful-fork total of 18, and
       * moving a pin to admit a module is the shape this estate distrusts. Every draw below is a
       * pure function of (seed, fragment, mechanic, index), re-derivable at any later point.
       *
       * ⚠⚠ AND THE MECHANIC IDS ARE **LITERALS AT THE CALL SITE**, not variables passed through a
       * helper. `stageManifest.walker`'s arm 3 derives each node's `randomNamespaces` FROM SOURCE,
       * and a mechanic id reaching `keyedRandom` as a variable is invisible to it — the walker
       * would then enforce a roster that silently excluded these two draws. Measured: behind a
       * closure, arm 3 derived neither `kind` nor `thin`.
       */
      const fragKey = `wallpub.E${wrap.index}.F${fi}`;
      const variant = { variant: opts.variant };
      const rng = {
        thin: (i) => keyedRandom(seed, fragKey, 'thin', i, variant),
        kind: (i) => keyedRandom(seed, fragKey, 'kind', i, variant),
      };
      const turns = frag.pts.map((_, i) => turnAt(frag.pts, i));
      const turnCut = Math.max(TURN_FLOOR_DEG, quantile(turns, TURN_QUANTILE));
      const joints = seedTowers(frag, runs, runOfVertex, {
        turns, turnCut, form, gates, stone, rng,
      });
      // ⛔⛔ **`deriveRampartWorks` READS `towers` AS `[x,y]` TUPLES AND `towerTypes` AS A PARALLEL
      // STRING ARRAY** (`rampartWorks.js:584-596`) — not as objects. Publishing rich objects under
      // the name `towers` would have type-checked, walked, and produced `NaN` coordinates in the
      // joint field: the consumer indexes `t[0]`/`t[1]`. The rich record is published BESIDE, under
      // its own name, so both readers get the shape they actually consume.
      const towers = joints.map((t) => [t.x, t.y]);
      const terminalWorks = joints.filter((t) => t.terminus).map((t, k) => ({
        x: t.x, y: t.y, dx: 0, dy: 0,
        via: frag.closed ? 'run boundary' : 'the fragment ends — the water is the fourth wall (A1.3 S2-M1)',
        key: `terminus.E${wrap.index}.F${fi}.${k}`,
      }));
      published.push(Object.freeze({
        index: fi,
        closed: frag.closed,
        ring: Object.freeze(frag.pts.map((p) => Object.freeze(p.slice()))),
        /** ⭐ THE FRAGMENT'S VERTICES IN THE WRAP'S OWN CYCLE — so a consumer can address the
         *  same vertex from the fragment or from the circuit and get the same answer. */
        vertexOfRing: Object.freeze(frag.at.slice()),
        runs: Object.freeze(runs.map((r) => Object.freeze({
          ...r,
          idx: Object.freeze(r.idx.slice()),
          line: Object.freeze(r.line.map((p) => Object.freeze(p.slice()))),
        }))),
        runOfVertex: Object.freeze(runOfVertex),
        runBands: Object.freeze(runBands),
        /** ⛔ TUPLES — the shape `rampartWorks.js:595` indexes. */
        towers: Object.freeze(towers.map((t) => Object.freeze(t))),
        towerTypes: Object.freeze(joints.map((t) => t.kind)),
        /** The same works with their cause, for a dress that wants to know WHY a tower stands. */
        towerJoints: Object.freeze(joints.map((t) => Object.freeze(t))),
        terminalWorks: Object.freeze(terminalWorks.map((t) => Object.freeze(t))),
        gates: Object.freeze(gates.filter((g) => nearFragment(frag, [g.x, g.y], stone * 6))),
        halfRing: !frag.closed,
      }));
    }

    circuits.push(Object.freeze({
      index: wrap.index,
      ring: Object.freeze(ring.map((p) => Object.freeze(p.slice()))),
      inner: Object.freeze((wrap.inner || []).map((p) => Object.freeze(p.slice()))),
      form,
      formSource: formGiven ? 'caller (the estate\'s own wallForm)'
        : 'DEFAULTED to the lightest rung — the caller named none, and a heavier defence is never invented',
      rung: rampartRung(form),
      /** ⭐ A1.3 S2-M4 · VINTAGE HONESTY: the year is the wrap schema's required field. */
      epoch: wrap.epoch,
      vintage: wrap.year,
      provenance: wrap.provenance,
      facets: wrap.facets,
      band: Object.freeze(band),
      bandFaces: wrap.bandFaces,
      gates: Object.freeze(gates),
      waterGateCount: (wrap.waterGates || []).length,
      /**
       * ⭐⭐ **THE WRAP RING'S OWN WET READING, PUBLISHED — because the cure at this seam does not
       * cure the ring.** `wetVertices > 0` says the CONSTRUCTOR ran its enclosure over open water
       * (`raiseWrap`'s hull never consults it); `margin` is the length the classifier read. A
       * census that wants the constructor defect reads this row rather than re-deriving it.
       */
      wetVertices,
      margin,
      fragments: Object.freeze(published),
      /** ⭐⭐ WEAR (PA.4) — the GRADE derives from the ledger's own facts; only the two cuts
       *  are chair-signed provisionals. See `wearOfCircuit`. */
      wear: wearOfCircuit(wrap, opts),
    }));
  }

  const fragmentTotal = circuits.reduce((s, c) => s + c.fragments.length, 0);
  /**
   * ⭐⭐ **WHAT THIS CALL COULD NOT GROUND, AND WHY — A REFUSAL ROSTER, NOT A TABLE OF NOUGHTS.**
   * `notch` is ungrounded by RULING (A1.5 holds CAR-SEATING); `crest` and `terrain-surrender` are
   * ungrounded only where the CALLER supplied no site. §9 law 8: a zero and a refusal are
   * different facts, so the publication says which this one is.
   */
  const ungrounded = { ...UNGROUNDED_RUN_TYPES, ...(site ? {} : SITE_GROUNDED_RUN_TYPES) };
  const wetTotal = circuits.reduce((s, c) => s + c.wetVertices, 0);
  return Object.freeze({
    artifactKind: 'WALL_SUCCESSOR_PUBLICATION',
    schemaVersion: WALL_PUBLICATION_SCHEMA_VERSION,
    circuits: Object.freeze(circuits),
    counts: Object.freeze(counts),
    ungrounded: Object.freeze(ungrounded),
    /** ⭐ WHETHER THE SITE REACHED THE CLASSIFIER — a fact about the CALL, published so a census
     *  can tell an unsupplied input from an unfired branch without reading the caller. */
    site: site ? 'the caller supplied a substrate; grade and refusal are READ'
      : 'NO SITE SUPPLIED — grade reads 0 and refusal reads false at every vertex, and the two'
        + ' types that depend on them are declared in `ungrounded` rather than counted as zero',
    /** ⛔ THE CONSTRUCTOR DEFECT THIS SEAM REPORTS BUT DOES NOT CURE. */
    wrapVerticesInWater: wetTotal,
    reason: `${circuits.length} circuit(s) published as ${fragmentTotal} ordered cycle(s);`
      + ` run types minted: ${RUN_TYPES.filter((t) => counts[t] > 0).map((t) => `${t} ${counts[t]}`).join(', ') || 'none'}`
      + `; ${Object.keys(ungrounded).length} type(s) declared ungrounded rather than invented`
      + (wetTotal ? `; ⛔ ${wetTotal} wrap vertex/vertices stand INSIDE a water face — the curtain`
        + ' is published as its DRY spans and the constructor defect is reported, not cured' : ''),
  });
}

/**
 * ⭐⭐⭐ **THE CARRIAGE CENSUS — "THE PUBLICATION CARRIES WHAT THE LEGACY PRODUCER CARRIED."**
 * SPINE-3, ODQ §692.6(ii) and §688.7.
 *
 * ⛔⛔ **WHY THIS EXISTS, AND IT IS A LESSON ABOUT TESTS AND NOT ABOUT WALLS.** PA.2's exit was
 * *"a CONTRACT TEST asserting the REG-2 dress renders unchanged against a legacy-node fixture"*,
 * and the test that met it proved exactly that: feed the ADAPTER the legacy's own values and the
 * dress comes back byte-identical. That is a true and useful claim about the ADAPTER. It is a
 * **strictly weaker claim than the one the test's name makes**, because it never once ran the
 * successor's own PRODUCER against the legacy's — so the producer could lose 83 runs of signal
 * with the contract test green, and it did.
 *
 * ⭐ **THAT IS THE THIRD TIME IN THIS PROGRAMME A PREDICATE HAS BEEN WEAKER THAN ITS NAME**
 * (§688.7's inert mode · unasserted subject · unchanged file; then L-REG-34's legend census
 * checking a BIJECTION where it claims LEGIBILITY; then this). The pattern is worth stating once
 * more in the place it bit: **a test written in the same breath as the thing it tests tends to
 * assert the shape of the claim rather than its substance.** The cure is not more assertions — it
 * is naming the claim as a PREDICATE, in the module, where a reader can see what it does and does
 * not cover.
 *
 * THE PREDICATE, in full: for every run type the LEGACY producer minted on this settlement, the
 * publication must either MINT IT TOO, or DECLARE IT UNGROUNDED with a reason. A type the legacy
 * finds and the successor neither mints nor declares is a LOST SIGNAL and this census says so.
 *
 * ⚠ WHAT IT DELIBERATELY DOES **NOT** ASSERT, stated so nobody reads more into it: the two
 * producers work on DIFFERENT GEOMETRY (the legacy's traced ring, the successor's facet-resampled
 * wrap), so equal COUNTS are not available and demanding them would be a lie. Carriage is about
 * the SIGNAL — which causes the wall is allowed to have — not about the tally.
 *
 * @param {Record<string,number>} legacyCounts the legacy producer's own `runCounts`, summed
 * @param {any} pub a `WALL_SUCCESSOR_PUBLICATION`
 */
export function carriageCensus(legacyCounts, pub) {
  const ungrounded = (pub && pub.ungrounded) || {};
  const counts = (pub && pub.counts) || {};
  const rows = [];
  for (const t of RUN_TYPES) {
    const legacy = (legacyCounts && legacyCounts[t]) || 0;
    if (legacy === 0) continue;
    const successor = counts[t] || 0;
    const declared = Object.prototype.hasOwnProperty.call(ungrounded, t);
    rows.push(Object.freeze({
      type: t, legacy, successor, declared, carried: successor > 0 || declared,
      why: declared ? ungrounded[t] : null,
    }));
  }
  const lost = rows.filter((r) => !r.carried);
  const lostRuns = lost.reduce((s, r) => s + r.legacy, 0);
  return Object.freeze({
    rows: Object.freeze(rows),
    lost: Object.freeze(lost.map((r) => r.type)),
    lostRuns,
    ok: lost.length === 0,
    reason: lost.length
      ? `⛔ LOST SIGNAL: ${lost.length} type(s) the legacy producer mints are neither minted nor`
        + ` declared ungrounded by the publication — ${lost.map((r) => `${r.type} (${r.legacy})`).join(', ')}`
        + `; ${lostRuns} run(s) of signal dropped`
      : `every one of the ${rows.length} type(s) the legacy producer mints is carried:`
        + ` ${rows.map((r) => `${r.type} ${r.legacy}→${r.declared && !r.successor ? 'DECLARED UNGROUNDED' : r.successor}`).join(', ')}`,
  });
}

/**
 * ⭐⭐⭐ **THE ADAPTER — AND IT IS THE WHOLE POINT OF PA.2.** This is the ONE function that maps a
 * published fragment onto `deriveRampartWorks`'s argument object. Because it is one function, a
 * dress module never assembles that object itself, and the contract test below can prove the
 * mapping is LOSSLESS by feeding it the LEGACY node's own values and asserting the derived works
 * come back byte-identical to the legacy call.
 *
 * ⛔ THE KEY SET IS `walls.js:718-729`'s, EXACTLY. A key added here that the consumer does not read
 * is dead weight; a key missing is a silent `undefined` inside the consumer — which is the class
 * `rampartWorks.js:415` itself records (*"a guard that silently evaluates to false is
 * indistinguishable from a guard that passed"*).
 *
 * @param {any} fragment a published fragment
 * @param {any} circuit its circuit
 * @param {{cliffs?:any, water?:any, seeding?:any}} [env]
 */
export function rampartArgsFor(fragment, circuit, env = {}) {
  return {
    ring: fragment.ring,
    runs: fragment.runs,
    runOfVertex: fragment.runOfVertex,
    runBands: fragment.runBands,
    gates: fragment.gates,
    towers: fragment.towers,
    towerTypes: fragment.towerTypes,
    terminalWorks: fragment.terminalWorks,
    halfRing: fragment.halfRing,
    form: circuit.form,
    cliffs: env.cliffs || null,
    water: env.water || null,
    stone: circuit.band.stone,
    seeding: env.seeding || { seed: `wrap.${circuit.index}` },
    epoch: circuit.epoch,
  };
}

/** The argument keys `deriveRampartWorks` consumes — the contract test's own denominator. */
export const RAMPART_ARG_KEYS = Object.freeze(['ring', 'runs', 'runOfVertex', 'runBands', 'gates',
  'towers', 'towerTypes', 'terminalWorks', 'halfRing', 'form', 'cliffs', 'water', 'stone',
  'seeding', 'epoch']);

/**
 * ⭐⭐ **THE LEGACY-NODE FIXTURE BRIDGE.** PA.2's exit is *"a CONTRACT TEST asserting the REG-2
 * dress renders unchanged against a LEGACY-NODE FIXTURE"*. A legacy circuit `c` (from
 * `deriveWallCircuit` → `traceWalls`) is re-expressed here as a publication fragment + circuit
 * pair carrying **the legacy's own values**. Running `rampartArgsFor` on the result must therefore
 * reproduce `walls.js`'s own argument object exactly — and the dress derived from it must come
 * back byte-identical. That is the losslessness claim, testable rather than asserted.
 */
export function legacyAsPublication(c, band) {
  const fragment = Object.freeze({
    index: 0,
    closed: !c.halfRing,
    ring: c.polygon,
    vertexOfRing: Object.freeze(c.polygon.map((_, i) => i)),
    runs: c.runs || [],
    runOfVertex: c.runOfVertex || [],
    runBands: c.runBands || [],
    towers: c.towers || [],
    towerTypes: c.towerTypes || [],
    towerJoints: Object.freeze([]),
    terminalWorks: c.cliffTermini || [],
    gates: c.gates || [],
    halfRing: !!c.halfRing,
  });
  const circuit = Object.freeze({
    index: c.epoch, form: c.form, epoch: c.epoch, vintage: c.vintage != null ? c.vintage : null,
    band, fragments: Object.freeze([fragment]),
  });
  return { fragment, circuit };
}

/**
 * ⭐⭐ THE RING'S BAND. `stone` is **the wrap's own `bandWidth`** — PA.2's sourcing, and the
 * consumer law applied: the annulus between the two inserted rings IS the band face's thickness,
 * so re-deriving it from the form's weight (as `walls.wallBand` must, having no face to read)
 * would be this estate's third instance of one law spelled twice. The side geometry is
 * `wallBand`'s own arithmetic, restated on the read thickness rather than on a computed one.
 */
export function ringBand(stone, frontage, glacisClear) {
  const inkHalf = Math.max(WALL_BAND.inkFloor,
    Math.min(WALL_BAND.strokeCeil, frontage * WALL_BAND.strokeShare)) / 2;
  const sideFloor = Math.max(0, inkHalf - stone / 2);
  const inner = Math.max(frontage * WALL_BAND.intervallum, sideFloor);
  const outer = Math.max(glacisClear ? frontage * WALL_BAND.glacis : 0, sideFloor);
  return { stone, inner, outer, width: stone + inner + outer, half: (stone + inner + outer) / 2, inkHalf };
}

/**
 * ⭐⭐ **WEAR — L-REG-18's FACTS × AGE, AT PA.4's CHAIR-SIGNED PROVISIONAL CUTS.**
 * PA.4: *"Never an invented number: the grades DERIVE from the ledger's maintenance facts × age;
 * only the two thresholds are provisional."* So the SCORE below is entirely read — the circuit's
 * age in years since its own vintage, against the estate's own `WEAR_FULL_YEARS` span, modulated
 * by whether the ledger recorded the raise or the constructor derived-and-froze it (an
 * unrecorded circuit is one nobody's chronicle says was kept up). The two CUTS are
 * `rampartWorks.WEAR_CUTS`, which the estate already signed and this file re-uses rather than
 * re-spelling.
 */
export function wearOfCircuit(wrap, opts = {}) {
  const now = opts.year != null ? opts.year : (opts.presentYear != null ? opts.presentYear : null);
  const age = now != null && wrap.year != null ? Math.max(0, now - wrap.year) : null;
  // The unrecorded circuit carries no maintenance testimony: it is not evidence of neglect, it is
  // ABSENCE of evidence of upkeep, and it moves the score by a named factor rather than a grade.
  const kept = wrap.provenance === 'recorded' ? 1 : 0.72;
  const span = 240; // rampartWorks.WEAR_FULL_YEARS — re-stated as a local for the null-age case
  const score = age == null ? null : Math.min(1, (age / span) * (2 - kept));
  const grade = score == null ? 'kept' : score >= 0.55 ? 'crumbling' : score >= 0.28 ? 'weathered' : 'kept';
  return Object.freeze({
    grade,
    score,
    age,
    kept,
    provisional: true,
    reason: age == null
      ? `no present year was supplied, so no age exists to grade — 'kept' is the null case, not a finding`
      : `${age} year(s) since the circuit of ${wrap.year} (${wrap.provenance}); score ${score.toFixed(3)}`
        + ` against the chair-signed provisional cuts 0.28/0.55 (PA.4 — the owner re-signs at tuning)`,
  });
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * THE RUN CLASSIFIER — every type from a fact the PARTITION holds
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **THE PARTITION'S OWN FACT VECTOR — THE SAME COLUMNS `wallRuns.runFacts` READS, FILLED
 * FROM FACES INSTEAD OF FROM THE FABRIC.** SPINE-3, ODQ §692.6(ii).
 *
 * ⛔⛔ **WHAT THIS REPLACES, AND WHY IT WAS THE THIRD SPELLING THIS FILE'S OWN HEADER FORBIDS.**
 * The first version of `classifyRuns` was a SECOND CLASSIFIER: six ad-hoc proximity tests in a
 * private priority order, every radius stated in BAND WIDTHS. The legacy classifier states its
 * radii in the circuit's WORKING MARGIN — about **13× larger** on a town — so the two producers
 * were not two readings of one question, they were two questions. MEASURED at the DRESS-1b seal:
 * the successor produced **0 of the 83 runs** the legacy classifier finds as
 * `crest`/`notch`/`terrain-surrender`/`detour-to-work`. That is the divergence a second spelling
 * always eventually produces, and the cure is not a better second spelling — it is to delete it
 * and call `wallRuns.runTypeAt`, which is now this estate's ONE ladder.
 *
 * ⭐ **THE COLUMN MAPPING IS THE ARGUMENT, AND EVERY ROW NAMES ITS PARTITION FACT:**
 *   `grade`/`refused`  the SITE, when the caller supplies one. §2 of DESIGN_SPINE charters the
 *                      heightfield as a spine input and §5 lists it under CONSUMES UNCHANGED;
 *                      it simply never reached anything. The caller holds it (it holds the
 *                      fabric), so it hands it in the same way it hands `form` and `frontage`.
 *                      **Absent, both columns read their null and the publication SAYS SO in
 *                      `ungrounded` rather than printing a zero** (§9 law 8).
 *   `terminus`         a CLIFF edge of the arrangement. ⛔ The constructor mints NONE — measured
 *                      0 of 91,669 edges, corpus-wide, with three convicting plants — so this
 *                      column is structurally false today. That is a fact about the CONSTRUCTOR,
 *                      not about the corpus, and the previous doc-comment here said the opposite.
 *   `waterD`           distance to the nearest WATER face BOUNDARY, and **zero where the vertex
 *                      stands INSIDE one**. ⛔ The old test asked only whether a ring vertex sat
 *                      near a water ring's VERTEX, which cannot see a circuit that runs straight
 *                      across a bay — the exact defect a reader found on `city`/`migration`.
 *   `hullD`            distance to the nearest live PLOT face centroid — the partition's own
 *                      spelling of the legacy's "close to the epoch's own outline".
 *   `seatD`            **Infinity, by ruling.** A1.5: the §640 seating weights are NOT spine
 *                      inputs and CAR-SEATING is held, so `notch` cannot be grounded here and is
 *                      declared ungrounded rather than approximated from something else.
 *   `workD`            distance to the nearest published QUAY face centroid.
 *   `roadD`            distance to the nearest ARTERY-ranked WAY face centroid — the partition's
 *                      own regional corridor, which is what "a road embankment already on the
 *                      line" means.
 *   `priorD`           distance to the nearest prior wrap's ring, as before.
 *   `margin`           the wrap's **own** `frozenRadius` at the estate's own default margin
 *                      share (`walls.WALL_MARGIN_DEFAULT`, the `|| 0.10` that was already there),
 *                      or the caller's, when the caller knows the tier. No new number.
 */
function partitionRunFacts(pts, ctx) {
  const { arr, waterFaces, quayPts, arteryPts, cliffPts, priorRings, plotPts, margin, site } = ctx;
  const n = pts.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = pts[(i - 1 + n) % n]; const next = pts[(i + 1) % n];
    const ux = p[0] - prev[0]; const uy = p[1] - prev[1];
    const vx = next[0] - p[0]; const vy = next[1] - p[1];
    const lu = Math.sqrt(ux * ux + uy * uy) || 1; const lv = Math.sqrt(vx * vx + vy * vy) || 1;
    out.push({
      i,
      x: p[0],
      y: p[1],
      segLen: lv,
      turn: Math.abs((ux * vy - uy * vx) / (lu * lv)),
      grade: site ? absoluteGrade(site, p[0], p[1]) : 0,
      refused: site ? refusalAt(site, p[0], p[1]) != null : false,
      terminus: nearAnyPoint(cliffPts, p, ctx.stone * NEAR_BANDS),
      waterD: waterDistance(waterFaces, p, ctx.channel),
      hullD: nearestPointD(plotPts, p),
      seatD: Infinity,
      workD: nearestPointD(quayPts, p),
      roadD: nearestPointD(arteryPts, p),
      priorD: priorRings.length ? nearestPolylineD(priorRings, p) : Infinity,
      margin,
    });
  }
  return out;
}

function classifyRuns(frag, ctx) {
  const pts = frag.pts;
  const facts = partitionRunFacts(pts, ctx);
  // ⭐⭐ THE ONE LADDER, CALLED — never re-spelled. `runCuts` derives this ring's own quantile
  // cuts (with their liveness tests) and `runTypeAt` walks the eight steps in the estate's own
  // fixed priority order. An open fragment IS the half-ring, so it says so.
  const cuts = runCuts(facts, { water: ctx.water });
  /** @type {string[]} */ const type = facts.map((f) => runTypeAt(f, cuts, { halfRing: !frag.closed }));
  // chain consecutive same-type vertices into runs
  const runs = [];
  let cur = null;
  for (let i = 0; i < pts.length; i++) {
    if (cur && cur.type === type[i]) { cur.idx.push(i); continue; }
    if (cur) runs.push(cur);
    cur = { type: type[i], idx: [i] };
  }
  if (cur) runs.push(cur);
  // ⭐ A CLOSED CYCLE WHOSE FIRST AND LAST RUN AGREE IS ONE RUN, NOT TWO.
  if (frag.closed && runs.length > 1 && runs[0].type === runs[runs.length - 1].type) {
    const last = runs.pop();
    runs[0].idx = last.idx.concat(runs[0].idx);
  }
  // ⭐⭐ AND THE SEAM ITSELF COMES FROM `wallRuns.markSeam` — the ONE place `bad-closure` is
  // decided. ⛔ This block used to re-type the last run inline, which was a smaller second
  // spelling of the same law left behind by the very extraction meant to close it; the
  // single-writer walker arm caught it. Only a CLOSED cycle can carry a seam — an open fragment's
  // fourth side is the bank, and a bank is not two campaigns disagreeing.
  if (frag.closed) markSeam(runs, facts, cuts);
  return runs.map((r, ri) => {
    const policy = RUN_POLICY[r.type];
    return {
      index: ri,
      /** ⛔ `rampartWorks.js:511` composes `waterEnd.E${epoch}.${run.key}` — a run with no `key`
       *  publishes a work keyed `…undefined…`, which collides with every other such work. */
      key: `run.${ri}.${r.type}`,
      type: r.type,
      /** ⭐ THE CAUSE IS THE TABLE'S OWN SENTENCE, IMPORTED — never re-worded here. */
      cause: policy.cause,
      idx: r.idx,
      line: r.idx.map((i) => pts[i]),
      towerPolicy: policy.towers,
      towers: policy.towers,
      thickness: policy.thickness,
      ditch: policy.ditch,
      lane: policy.lane,
      straight: policy.straight,
      corner: false,
    };
  });
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * TOWERS AS JOINTS, AT THE FACET ECONOMY'S VERTICES
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐ **A TOWER IS A JOINT** (rampartWorks' own phrase): a work stands where the masonry has to
 * be held together — at a real corner, and where the curtain STOPS. Both are vertices of the
 * facet economy, which is the charter's *"towers-as-joints at the facet economy's vertices"*
 * read literally: the publication never plants a tower between vertices.
 *
 * ⛔ AND A RUN WHOSE POLICY IS `none` GETS NONE. §205.3 — a cliff flank needs no wall, so it
 * certainly needs no tower — and the same holds at the water termination.
 */
function seedTowers(frag, runs, runOfVertex, o) {
  const { turns, turnCut, form, gates, stone, rng } = o;
  const pts = frag.pts;
  const out = [];
  const gateClear = stone * 3.2;
  const spacingFloor = stone * 4.5;
  for (let i = 0; i < pts.length; i++) {
    const run = runs[runOfVertex[i]];
    if (!run || run.towerPolicy === 'none') continue;
    const isEnd = !frag.closed && (i === 0 || i === pts.length - 1);
    const isCorner = turns[i] >= turnCut;
    // a run BOUNDARY is a joint too — two runs meeting is exactly what an angle tower holds
    const isRunStart = i > 0 && runOfVertex[i - 1] !== runOfVertex[i];
    if (!isEnd && !isCorner && !isRunStart) continue;
    if (gates.some((g) => dist2(pts[i], [g.x, g.y]) < gateClear * gateClear)) continue;
    if (out.some((t) => dist2(pts[i], [t.x, t.y]) < spacingFloor * spacingFloor)) continue;
    // ⚠ THE SPARSE RUN THINS ITS JOINTS RATHER THAN MOVING THEM. A sparse policy that shifted a
    // tower off its corner would be planting by spacing, which is the tell rampartWorks names.
    if (run.towerPolicy === 'sparse' && !isEnd && !isRunStart && !(rng.thin(i) < 0.62)) continue;
    out.push({
      x: pts[i][0], y: pts[i][1], at: i,
      terminus: isEnd,
      kind: towerKind({
        run: { ...run, corner: isCorner }, form, threat: run.towerPolicy === 'clustered' ? 0.7 : 0.3,
        first: isRunStart,
        last: false,
        // ⚠ `towerKind` asks for ONE thing from an rng — `chance(p)` — so it is handed exactly that,
        //   backed by the keyed hash at this vertex. A full stream object would be a stream.
        rng: { chance: (p) => rng.kind(i) < p },
      }),
    });
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * small pure helpers — no geometry library is re-invented; these are ring arithmetic only
 * ════════════════════════════════════════════════════════════════════════════════════════ */

function dist2(a, b) { const dx = a[0] - b[0]; const dy = a[1] - b[1]; return dx * dx + dy * dy; }

function nearestVertex(ring, p) {
  let bi = 0; let bd = Infinity;
  for (let i = 0; i < ring.length; i++) { const d = dist2(ring[i], p); if (d < bd) { bd = d; bi = i; } }
  return bi;
}

function ringNormalAt(ring, i) {
  const n = ring.length;
  const a = ring[(i - 1 + n) % n]; const b = ring[(i + 1) % n];
  const dx = b[0] - a[0]; const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  return [dy / L, -dx / L];
}

/**
 * ⭐ DOES THIS SEGMENT TOUCH WATER ANYWHERE ALONG ITS LENGTH? Two readings, and both are needed:
 * a proper crossing of a water face's boundary (the segment passes through a narrow reach), and a
 * sampled interior point (the segment lies wholly inside a body). The sample step is ONE WORLD
 * UNIT, which is finer than any water face this estate mints — the channel's own width is 10–19
 * units on the corpus — so a reach cannot slip between two samples.
 */
const WATER_SAMPLE_STEP = 1.0;
function segmentTouchesWater(a, b, waterFaces) {
  for (const f of waterFaces) {
    const w = f.ring;
    if (!w || w.length < 3) continue;
    for (let j = 0; j < w.length; j++) {
      if (properSegmentCross(a, b, w[j], w[(j + 1) % w.length])) return true;
    }
  }
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.ceil(L / WATER_SAMPLE_STEP));
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = a[0] + (b[0] - a[0]) * t; const y = a[1] + (b[1] - a[1]) * t;
    for (const f of waterFaces) if (f.ring.length >= 3 && pointInPolygon(x, y, f.ring)) return true;
  }
  return false;
}

function sideOf(a, b, p) {
  return Math.sign((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
}
function properSegmentCross(a, b, c, d) {
  const s1 = sideOf(a, b, c); const s2 = sideOf(a, b, d);
  const s3 = sideOf(c, d, a); const s4 = sideOf(c, d, b);
  return s1 !== 0 && s2 !== 0 && s3 !== 0 && s4 !== 0 && s1 !== s2 && s3 !== s4;
}

/** The ring's own mean radius about its centroid — the fallback when a wrap records no radius. */
function meanRadius(ring) {
  let cx = 0; let cy = 0;
  for (const p of ring) { cx += p[0]; cy += p[1]; }
  cx /= ring.length; cy /= ring.length;
  let s = 0;
  for (const p of ring) s += Math.hypot(p[0] - cx, p[1] - cy);
  return s / ring.length;
}

/**
 * ⭐⭐ **PUBLISH ONLY THE DRY SPANS — the curtain runs to the bank and stops** (§161m.3, A1.3
 * S2-M1). Given a per-vertex wet reading, the maximal runs of DRY vertices become OPEN fragments;
 * the wet span between two of them is the water, and the water is the fourth wall.
 *
 * ⚠ A span of fewer than three dry vertices is not a stretch of wall, it is a corner poking out
 * of the sea — it is dropped, and the drop is counted by the caller so a leaf whose whole circuit
 * drowns reports zero fragments rather than a spray of two-point stubs.
 *
 * ⚠ THE GATE CUTS STILL APPLY WITHIN A DRY SPAN — a water gate inside a reach is still a gate,
 * so the span is sub-divided at it exactly as `sliceCycle` would.
 */
function sliceAtWater(ring, wetAt, cut) {
  const n = ring.length;
  if (wetAt.every((w) => w)) return [];
  // rotate so index 0 begins a dry span that follows a wet one
  let start = 0;
  while (start < n && !(wetAt[start] === false && wetAt[(start - 1 + n) % n] === true)) start++;
  if (start >= n) return sliceCycle(ring, cut);       // no wet vertex at all
  /** @type {Array<number[]>} */ const spans = [];
  /** @type {number[]|null} */ let cur = null;
  for (let s = 0; s < n; s++) {
    const i = (start + s) % n;
    if (wetAt[i]) { if (cur) { spans.push(cur); cur = null; } continue; }
    if (!cur) cur = [];
    cur.push(i);
  }
  if (cur) spans.push(cur);
  const out = [];
  for (const at of spans) {
    if (at.length < 3) continue;
    // sub-divide the dry span at any water gate that falls inside it
    const marks = at.map((_, k) => k).filter((k) => k > 0 && k < at.length - 1 && cut.has(at[k]));
    const bounds = [0, ...marks, at.length - 1];
    for (let b = 0; b + 1 < bounds.length; b++) {
      const seg = at.slice(bounds[b], bounds[b + 1] + 1);
      if (seg.length >= 3) out.push({ pts: seg.map((j) => ring[j]), at: seg, closed: false });
    }
  }
  return out;
}

/** Slice a closed cycle at a set of vertex indices into ordered fragments. */
function sliceCycle(ring, cut) {
  if (!cut.size) return [{ pts: ring, at: ring.map((_, i) => i), closed: true }];
  const marks = [...cut].sort((a, b) => a - b);
  const out = [];
  for (let k = 0; k < marks.length; k++) {
    const s = marks[k];
    const e = marks[(k + 1) % marks.length];
    const at = [];
    let i = s;
    let guard = 0;
    do { at.push(i); i = (i + 1) % ring.length; } while (i !== e && ++guard < ring.length + 2);
    at.push(e);
    if (at.length >= 3) out.push({ pts: at.map((j) => ring[j]), at, closed: false });
  }
  return out.length ? out : [{ pts: ring, at: ring.map((_, i) => i), closed: true }];
}

function nearFragment(frag, p, r) {
  const r2v = r * r;
  for (const q of frag.pts) if (dist2(p, q) < r2v) return true;
  return false;
}

function nearAnyPoint(pts, p, r) {
  const r2v = r * r;
  for (const q of pts) if (dist2(p, q) < r2v) return true;
  return false;
}

/** The nearest of a point cloud, as a DISTANCE — `Infinity` on an empty cloud, never 0. */
function nearestPointD(pts, p) {
  let best = Infinity;
  for (const q of pts) { const d = dist2(p, q); if (d < best) best = d; }
  return best === Infinity ? Infinity : Math.sqrt(best);
}

/** The nearest of a set of closed rings, as a DISTANCE to the LINE, not to a vertex. */
function nearestPolylineD(rings, p) {
  let best = Infinity;
  for (const ring of rings) {
    if (!ring || ring.length < 2) continue;
    const d = distToPolyline(p[0], p[1], ring.concat([ring[0]]));
    if (d < best) best = d;
  }
  return best;
}

/**
 * ⭐⭐ **HOW FAR IS THIS VERTEX FROM THE WATER — AND ZERO IF IT IS STANDING IN IT.**
 *
 * ⛔⛔ THE DEFECT THIS REPLACES IS THE ONE THE PARTITION EXISTS TO MAKE UNREPRESENTABLE. The old
 * test asked `dist2(p, q) < r` over the water face's own VERTICES. A circuit that runs straight
 * across a bay passes far from every vertex of the water face while standing squarely inside it,
 * so the wall was typed `new-cutting` over open water and nothing anywhere objected. A distance
 * to the BOUNDARY plus a containment test answers the question that was actually being asked.
 */
function waterDistance(waterFaces, p, channel) {
  let best = Infinity;
  for (const f of waterFaces) {
    if (!f.ring || f.ring.length < 3) continue;
    if (pointInPolygon(p[0], p[1], f.ring)) return 0;
    const d = distToPolyline(p[0], p[1], f.ring.concat([f.ring[0]]));
    if (d < best) best = d;
  }
  /**
   * ⛔⛔ **AND THE CHANNEL LINE IS ASKED TOO, BECAUSE THE WATER FACE IS CLIPPED TO THE EXTENT AND
   * THE CHANNEL IS NOT.** Caught by the carriage census on its first run: a `mode:'near'` river
   * runs just outside the settlement's extent, so `cutWatercourse` mints **no WATER face at all**
   * while the legacy classifier — which measures to `water.line`, the §648 channel authority —
   * reads four `water-termination` runs. A successor that could only see clipped faces would call
   * that a corpus fact; it is a CLIPPING fact. The line is the same §2 input the constructor
   * already consumes, handed in by the same caller that hands the site.
   */
  if (channel && channel.length > 1) {
    const d = distToPolyline(p[0], p[1], channel);
    if (d < best) best = d;
  }
  return best;
}
