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
 * ⛔ **SIX OF THE NINE RUN TYPES ARE GROUNDED HERE; THREE ARE NOT, AND THAT IS DECLARED RATHER
 * THAN FILLED.** `crest` needs the heightfield and `notch` needs an institution roster — neither
 * is a partition input (A1.5 keeps seating its own car) — so this publication MINTS NEITHER, and
 * `counts` prints a zero for them beside the six it does mint. A publication that invented a
 * `crest` from the ring's own curvature would be manufacturing a hill.
 *
 * PURITY: one keyed `fabricRng` stream, seeded from the partition's own seed — the same
 * discipline `deriveRampartWorks` uses, and deterministic for the same reason. No `Date`, no
 * `Math.random`.
 */

import { faceCentroid, faceRing, liveFaces } from './partitionArrangement.js';
import { RUN_POLICY, RUN_TYPES, runBand, towerKind, quantile } from './wallRuns.js';
import { WALL_BAND } from './walls.js';
import { rampartRung, turnAt, TURN_FLOOR_DEG, TURN_QUANTILE } from './rampartWorks.js';
import { keyedRandom } from './fabricRng.js';

export const WALL_PUBLICATION_SCHEMA_VERSION = 1;

/**
 * ⭐ THE THREE RUN TYPES THIS PUBLICATION CANNOT GROUND, NAMED SO THE ZERO IS READ AS A REFUSAL
 * AND NOT AS AN ABSENCE. §9 law 8: *absence decays — re-measure every inherited zero at the slot
 * that consumes it.* This is the slot; the measure is "the input does not exist".
 */
export const UNGROUNDED_RUN_TYPES = Object.freeze({
  crest: 'the heightfield is not a partition input (SPINE §2 carries it to the CONSTRUCTOR, not'
    + ' to the published faces) — a crest minted from ring curvature would be a manufactured hill',
  notch: 'SPINE A1.5 keeps institution seating its own car, so no precinct exists to double back'
    + ' around; the SEATING CAR is where this type becomes mintable',
});

/**
 * ⚠⚠ **THE OTHER TWO ZEROES ARE NOT REFUSALS, AND CONFLATING THEM WOULD BE THE WORSE ERROR.**
 * `terrain-surrender` keys on CLIFF edges and `detour-to-work` on published quay faces — both ARE
 * partition facts and both ARE tested for below. They read zero across the corpus today because no
 * corpus leaf puts a cliff edge or a quay face within a band's reach of its own wrap, which is a
 * measurement about the corpus, not a gap in the classifier. §9 law 8 (*absence decays*) is why
 * this distinction is written down rather than left to a reader to infer from a table of noughts.
 */
export const GROUNDED_BUT_UNFIRED = Object.freeze(['terrain-surrender', 'detour-to-work']);

/**
 * `bad-closure` is CONDITIONAL, not ungrounded: it is a fact about the JOIN and is assigned at the
 * seam between the first and last run of a CLOSED cycle — so an open fragment (a half-ring whose
 * fourth side is the bank) correctly never carries one.
 */
export const CONDITIONAL_RUN_TYPES = Object.freeze(['bad-closure']);

/** How near a ring vertex must come to a feature to be classified by it, in band widths. */
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

  const waterFaces = [];
  const quayFaces = new Set((partition.quays || []).map((q) => q.face).filter((f) => f != null));
  const cliffPts = [];
  for (const f of liveFaces(arr)) {
    if (f.cls === 'WATER') waterFaces.push({ id: f.id, ring: faceRing(arr, f.id) });
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
    const fragments = sliceCycle(ring, cut);

    const priorRings = circuits.map((c) => c.ring);
    const published = [];
    for (const [fi, frag] of fragments.entries()) {
      const runs = classifyRuns(frag, {
        arr, waterFaces, quayFaces, cliffPts, priorRings, gates, stone, form,
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
      fragments: Object.freeze(published),
      /** ⭐⭐ WEAR (PA.4) — the GRADE derives from the ledger's own facts; only the two cuts
       *  are chair-signed provisionals. See `wearOfCircuit`. */
      wear: wearOfCircuit(wrap, opts),
    }));
  }

  const fragmentTotal = circuits.reduce((s, c) => s + c.fragments.length, 0);
  return Object.freeze({
    artifactKind: 'WALL_SUCCESSOR_PUBLICATION',
    schemaVersion: WALL_PUBLICATION_SCHEMA_VERSION,
    circuits: Object.freeze(circuits),
    counts: Object.freeze(counts),
    ungrounded: UNGROUNDED_RUN_TYPES,
    reason: `${circuits.length} circuit(s) published as ${fragmentTotal} ordered cycle(s);`
      + ` run types minted: ${RUN_TYPES.filter((t) => counts[t] > 0).map((t) => `${t} ${counts[t]}`).join(', ') || 'none'}`
      + `; ${Object.keys(UNGROUNDED_RUN_TYPES).length} type(s) declared ungrounded rather than invented`,
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

function classifyRuns(frag, ctx) {
  const { arr, waterFaces, quayFaces, cliffPts, priorRings, stone } = ctx;
  const pts = frag.pts;
  const near = stone * NEAR_BANDS;
  /** @type {string[]} */ const type = new Array(pts.length);
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (nearAnyRing(waterFaces, p, near)) { type[i] = 'water-termination'; continue; }
    if (nearAnyPoint(cliffPts, p, near)) { type[i] = 'terrain-surrender'; continue; }
    if (nearQuay(arr, quayFaces, p, near * 1.6)) { type[i] = 'detour-to-work'; continue; }
    if (priorRings.length && nearAnyPolyline(priorRings, p, near)) { type[i] = 're-use'; continue; }
    if (adjacentToPlot(arr, p, near)) { type[i] = 'toft-backs'; continue; }
    type[i] = 'new-cutting';
  }
  // chain consecutive same-type vertices into runs
  const runs = [];
  let cur = null;
  for (let i = 0; i < pts.length; i++) {
    if (cur && cur.type === type[i]) { cur.idx.push(i); continue; }
    if (cur) runs.push(cur);
    cur = { type: type[i], idx: [i] };
  }
  if (cur) runs.push(cur);
  // ⭐ A CLOSED CYCLE WHOSE FIRST AND LAST RUN AGREE IS ONE RUN, NOT TWO — and where they do NOT
  // agree, the seam between them is `bad-closure`: §1.1.13a's *"closure between the first and
  // last run is deliberately imperfect and marks a seam"*, minted only where a cycle closes.
  if (frag.closed && runs.length > 1) {
    if (runs[0].type === runs[runs.length - 1].type) {
      const last = runs.pop();
      runs[0].idx = last.idx.concat(runs[0].idx);
    } else if (runs.length > 2) {
      runs[runs.length - 1].type = 'bad-closure';
    }
  }
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

function nearAnyRing(faces, p, r) {
  const r2v = r * r;
  for (const f of faces) for (const q of f.ring) if (dist2(p, q) < r2v) return true;
  return false;
}

function nearAnyPoint(pts, p, r) {
  const r2v = r * r;
  for (const q of pts) if (dist2(p, q) < r2v) return true;
  return false;
}

function nearAnyPolyline(rings, p, r) {
  const r2v = r * r;
  for (const ring of rings) for (const q of ring) if (dist2(p, q) < r2v) return true;
  return false;
}

function nearQuay(arr, quayFaces, p, r) {
  if (!quayFaces.size) return false;
  const r2v = r * r;
  for (const fid of quayFaces) {
    const f = arr.faces[fid];
    if (!f || !f.alive) continue;
    const c = faceCentroid(arr, fid);
    if (dist2(p, c) < r2v) return true;
  }
  return false;
}

/**
 * ⚠ `toft-backs` IS A CLAIM ABOUT WHAT THE WALL WAS BUILT ALONG, and the partition can answer it
 * exactly: the band was inserted through standing fabric, so a ring vertex with a PLOT face
 * within a band's reach is a stretch of wall following the backs of existing tofts. The scan is
 * over the LIVE PLOT faces' centroids, which is why the radius is generous — a centroid is not
 * an edge, and a tighter radius would answer "no" for a plot the wall genuinely abuts.
 */
function adjacentToPlot(arr, p, r) {
  const r2v = (r * 2.2) * (r * 2.2);
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'PLOT') continue;
    if (dist2(p, faceCentroid(arr, f.id)) < r2v) return true;
  }
  return false;
}
