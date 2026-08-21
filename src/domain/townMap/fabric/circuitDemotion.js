/**
 * domain/townMap/fabric/circuitDemotion.js — ⭐⭐⭐ THE FOSSIL LADDER (S14, ODQ §250.5, CX-20,
 * PLAN §6.3). **WITHOUT THIS, EVERY NEW RING ERASES THE HISTORY THE EPOCH MODEL WAS ADOPTED TO
 * EXPRESS**, which is why §5 W2 may not be split: §240 makes multi-circuit settlements
 * imminent, four of ten walled leaves already carry two, and nothing said what happened to the
 * superseded one.
 *
 * ⭐⭐⭐ THE LAW: **when epoch E's circuit is superseded by epoch E+1's, the old circuit is NOT
 * DELETED — IT IS DEMOTED, and its furniture is transformed by a fixed table.**
 *
 *   the old thing  │ becomes
 *   ───────────────┼──────────────────────────────────────────────────────────────────────────
 *   wall           │ ⭐ AN OLD WALL LANE — a ring street running the full former circuit, drawn
 *                  │   wider than an ordinary lane and in its own pavement tone (its width IS
 *                  │   the intervallum's, because the intervallum is what the lane inherited)
 *   gate           │   a STREET WIDENING and a break in the frontage line where the ring meets
 *                  │   a radial
 *   tower          │ ⭐ a CIRCULAR BUILDING embedded in the fabric — a circle where every other
 *                  │   footprint is rectilinear
 *   ditch          │ ⭐ FILLED DITCH GARDENS — a curving ribbon of long narrow garden plots
 *                  │   immediately outside the old wall line, following the ring exactly
 *   intervallum    │   the ring street's carriageway
 *   wall stub      │   a surviving masonry fragment, free-standing inside the fabric
 *
 * ⭐⭐⭐ ⟦§298.5d — THE SECOND WITNESS, AND THE ORDER'S PREMISE IS REFUTED⟧ §298.5(d) required a
 * SECOND WITNESS before this table could lock into implementation, on the ground that it was
 * *"n=1 on a shape-flagged plate"* (hf347). **IT IS NOT n=1. THE CORPUS CARRIES AT LEAST FIVE
 * INDEPENDENT WITNESSES, AND EVERY ROW OF THE TABLE HAS THREE OR MORE**
 * (`map-corpus/docs/laneHF-CALIBRATION.md`, quoted):
 *
 *   row                │ hf347 (the n=1)          │ INDEPENDENT WITNESSES
 *   ───────────────────┼──────────────────────────┼──────────────────────────────────────────────
 *   wall → ring street │ "survives as a curving   │ hf385 "a crooked lane on its line" · hf241
 *                      │  lane exactly on its     │ "street web persisting as field-lane ghosts"
 *                      │  line"                   │
 *   gate → widening /  │ "a labelled gate gap"    │ hf385 "a labelled gap where a gate was" ·
 *   break in frontage  │                          │ hf365 "one gone but for the road's narrowing"
 *                      │                          │ · hf124 "old-gate twin circles absorbed into
 *                      │                          │ an inn"
 *   tower → a CIRCULAR │ "a tower now a dwelling" │ hf385 "towers now dovecotes and dwellings" ·
 *   building           │                          │ hf365 "a single tower left isolated in a
 *                      │                          │ garden as a dovecote" · hf124 "tower-house
 *                      │                          │ ring + dovecote nest-dot circle"
 *   ditch → FILLED-    │ "its filled ditch        │ hf385 "a strip of long narrow ditch gardens"
 *   DITCH GARDENS      │  preserved as a curving  │ · hf365 "kept as a long curving strip of
 *                      │  strip of long narrow    │ gardens and rope walks" · hf124 "filled-ditch
 *                      │  gardens"                │ garden strip" · hf318 "an old ditch now a
 *                      │                          │ garden strip"
 *   wall stub          │ "one masonry stub        │ hf385 "a lone stone stub" · hf365 "reduced to
 *                      │  standing in a garden"   │ a stub with a garden built on top" · hf124
 *                      │                          │ "masonry-band survival as party wall"
 *
 * ⭐⭐ AND THE DECISIVE ONE: **hf385 IS THE CURE OF hf347.** It is the same three-generations
 * subject drawn WITHOUT the concentric-oval prior that flagged hf347, and it carries every row of
 * this table. The shape flag was about the RING PRIOR and never about the vocabulary — so the one
 * plate whose morphology was refused is corroborated, row for row, by the plate that refuted it.
 * ⭐ hf365 supplies the FATE LADDER whole on a single circuit (sound / built-against / pierced /
 * stub-with-garden / gone-as-a-property-line), which is `FATE_RUNGS` in the corpus's own hand.
 * ⚠ THE TABLE IS THEREFORE **NOT PROVISIONAL**, and the reason is written here rather than in a
 * receipt, because a law's evidence should travel with the law.
 *
 * ⭐⭐ AND THE STRUCTURAL RULE THAT GENERATES ALL OF IT: **RADIALS ARE OLDER THAN RINGS.** The
 * radial streets run continuously through every circuit; the ring streets are each a fossilised
 * defence. *A settlement's oldest continuous geometry is its roads OUT, and its ring geometry is
 * the accumulated record of its walls.*
 *
 * ⭐⭐ THE FIVE-RUNG FATE LADDER (CX-20), WEIGHTED BY LOCAL LAND PRESSURE. `wall_dead` —
 * bricked, blocked, robbed, quarried, stub, property-line — is named on **15 of 138 settlement
 * plates (10.9%)**: the corpus treats wall death as NORMAL, not exceptional. High pressure
 * quarries and builds over; low pressure leaves it standing.
 *
 * ⚠⚠ WHERE IT RUNS, AND WHY THAT IS THE WHOLE IMPLEMENTATION SHAPE. **The old wall stops being
 * a wall and becomes an INPUT to the street, plot and land-use stages** — so this runs
 * immediately after the circuit node and BEFORE §17/§17.4/§200's ground law, and its ring street
 * enters the claim set like any other street. A demotion that ran after the ground law would be
 * an overlay drawn after the law ran, which is the §195.0 class this fabric has paid for twice.
 *
 * PURITY: pure arithmetic and geometry. No Date, no Math.random, no runtime trig, no locale.
 */

import { fabricRng } from './fabricRng.js';
import { offsetPolygonOutward, ringSelfCrossings } from './fabricGeometry.js';
import { cosI, sinI, TRIG_N } from './trigTable.js';
import { circuitRings } from './wallCircuit.js';
import { drawnBodies } from './groundRefusal.js';

/**
 * ⭐⭐ THE FIVE RUNGS, from most alive to most gone. A rung is chosen per RUN of the superseded
 * circuit, never per circuit — because land pressure is local, and a wall quarried on the
 * market side while standing on the marsh side is exactly what the plates draw.
 */
export const FATE_RUNGS = Object.freeze([
  'standing',       // the stones are still there, inside the town: a free-standing fragment
  'property-line',  // the wall became somebody's back wall — it survives as a boundary
  'blocked',        // pierced and built against; the lane survives, the stones are half gone
  'robbed',         // the facing stones went into the houses; a low bank remains
  'quarried',       // gone to the foundations; only the STREET remembers it
]);

/**
 * ⭐ HOW HARD THE LAND PRESSED. Derived from facts the leaf already holds — the share of today's
 * extent the superseded ring encloses (a ring deep inside a much larger town is under more
 * pressure than one just inside the current wall) and the settlement's prosperity, because
 * quarrying a wall for its stone is what a growing, building town does with it.
 * ⚠ A DEMOTED settlement presses LESS: §161g's whole reading is that its fabric stopped growing.
 */
export function landPressure(a) {
  const inner = Math.max(0.05, Math.min(1, a.extent));
  // How much fabric stands OUTSIDE the old ring, as a share of the leaf: the pressure that
  // built over it. A ring at 0.585 of the radius has 66% of the area outside it.
  const outsideShare = 1 - inner * inner;
  const prosper = Math.max(0, Math.min(5, a.prosperityRank == null ? 2 : a.prosperityRank)) / 5;
  const p = outsideShare * 0.68 + prosper * 0.32;
  return a.demoted ? p * 0.55 : p;
}

/**
 * ⭐⭐⭐ DEMOTE EVERY SUPERSEDED CIRCUIT. One pass, at the epoch boundary, emitting REAL GEOMETRY
 * into the CURRENT fabric.
 *
 * @param {Object} a
 * @param {any} a.node       the wall-circuit node — pulled through its accessor, never raw
 * @param {number} a.frontage
 * @param {any} a.seeding
 * @param {number} a.prosperityRank
 * @param {boolean} a.demoted
 * @param {any} a.streetWidths  the web's own width ladder — the ring street takes a REAL rank
 * @returns {{ ringStreets:Array<any>, dwellings:Array<any>, gardens:Array<any>,
 *             widenings:Array<any>, stubs:Array<any>, fates:Array<any>, reason:string }}
 */
export function demoteCircuits(a) {
  const rings = circuitRings(a.node);
  const superseded = rings.filter((r) => r.kind === 'old-core');
  const out = {
    ringStreets: [], dwellings: [], gardens: [], widenings: [], stubs: [], fates: [],
    reason: '',
  };
  if (!superseded.length) {
    out.reason = 'no superseded circuit — this settlement has never outgrown a wall';
    return out;
  }
  const frontage = a.frontage || 8;
  for (const ring of superseded) {
    const rng = fabricRng(a.seeding.seed, `wall.demote.${ring.epoch}`, { variant: a.seeding.variant });
    const pressure = landPressure({
      extent: ring.vintageRatio == null ? 1 : ring.vintageRatio,
      prosperityRank: a.prosperityRank, demoted: a.demoted,
    });
    // ── ⭐⭐⭐ 1 · THE WALL BECOMES A RING STREET, ALWAYS. This is the one rung-independent
    //    transformation and it is the law's core: whatever happened to the stones, the LANE
    //    the wall's own intervallum left is still there and still runs the full former circuit.
    //    *That is how a town looks old at a glance without drawing a single ruin.*
    // ⚠ THE TRACE IS THE SUPERSEDED CIRCUIT'S OWN POLYGON, byte for byte, so §5 W2 exit 5's
    // "matches within the topology quantum" is a THEOREM about the construction rather than a
    // tolerance about the output.
    // ⭐⭐ THE LANE'S WIDTH IS **THE WHOLE RESERVATION THE WALL ONCE HELD**, RELEASED — stones,
    // intervallum and glacis together. That is what "the old wall stops being a wall and becomes
    // an INPUT to the street stage" means in units: when the curtain came down its footprint and
    // its clear lane both became carriageway.
    // ⛔ MY FIRST SPELLING TOOK THE OLD CORE'S **OWN** BAND, AND THE 3,000 px ZOOM CONVICTED IT.
    // `wallBand` gives a superseded ring `inner = 0` on purpose (its intervallum was built over
    // generations ago), so the ring street came out **3.4 units against an ordinary lane's 6.6**
    // — a HAIRLINE where the law asks for a street *drawn slightly wider than ordinary lanes*.
    // ⭐ THE CLASS: **A DERIVED WIDTH TAKEN FROM THE POST-DEMOTION OBJECT MEASURES THE DEMOTION,
    // NOT WHAT WAS DEMOTED.** The working circuit's band is the size this wall was when it was
    // a wall, and it is on the node already.
    const workingBand = (rings.find((r) => r.kind !== 'old-core') || ring).bandParts;
    const laneWidth = Math.max(frontage * 0.55, workingBand ? workingBand.width : frontage * 0.9);
    out.ringStreets.push({
      key: `street.ringOld.E${ring.epoch}`,
      rank: 'ringOld',
      width: laneWidth,
      // A closed ring drawn as a polyline: the first point repeated closes it without asking
      // every consumer to know that this particular channel is a loop.
      // ⭐⭐ ⟦SW-1a⟧ AND THE POINTS ARE THIS CHANNEL'S OWN. `concat` makes a new ARRAY and shares
      // every `[x,y]` inside it, so the ring street's line and `walls[].polygon` were two
      // versions holding one mutable point set — 5 point aliases across the corpus, invisible to
      // an array-identity scan. ⚠ The TRACE claim is unaffected: "byte for byte" is about the
      // coordinates, and a copy has the same coordinates. It is the OBJECTS that must not be
      // shared across a version boundary.
      line: ring.polygon.concat([ring.polygon[0]]).map((p) => /** @type {[number,number]} */ ([p[0], p[1]])),
      epoch: ring.epoch,
      fromCircuit: true,
    });
    // ── ⭐⭐ 2 · EACH RUN TAKES A RUNG OF THE FATE LADDER, weighted by local land pressure.
    const runs = ring.runs && ring.runs.length ? ring.runs : [{ type: 'new-cutting', idx: ring.polygon.map((_, i) => i), line: ring.polygon, length: 0 }];
    for (const run of runs) {
      const rung = fateFor(pressure, run, rng);
      out.fates.push({ epoch: ring.epoch, run: run.type, rung, pressure: Math.round(pressure * 1000) / 1000 });
      // A run that is still STANDING or survives as a PROPERTY LINE leaves visible masonry.
      if (rung === 'standing' || rung === 'property-line') {
        const seg = run.line.slice(0, Math.max(2, Math.round(run.line.length * (rung === 'standing' ? 0.55 : 0.30))));
        if (seg.length >= 2) {
          out.stubs.push({
            key: `wallStub.E${ring.epoch}.${run.type}.${run.idx[0]}`,
            line: seg, rung, epoch: ring.epoch,
            weight: rung === 'standing' ? 1 : 0.6,
          });
        }
      }
    }
    // ── ⭐⭐ 3 · EVERY TOWER BECOMES A CIRCULAR DWELLING — a circle where every other footprint
    //    on the leaf is rectilinear, which is the single most legible fossil the table has.
    //    ⚠ A tower on a QUARRIED run is gone with the rest of it; on every other rung the
    //    round is the thing that survives, because a tower is the strongest piece of a circuit
    //    and the easiest to roof.
    const towerRung = fateFor(pressure, { type: 'tower', idx: [0] }, rng);
    if (towerRung !== 'quarried') {
      const rr = Math.max(frontage * 0.62, (ring.bandParts ? ring.bandParts.stone : frontage * 0.3) * 1.6);
      // ⭐⭐ THE ROUND STANDS **INSIDE** THE RING STREET, NOT ON IT, AND THAT IS THE MECHANISM
      // RATHER THAN A COLLISION FIX: the tower's own footprint became a house FRONTING the lane
      // its wall left behind. A round sitting on the carriageway would be a body in a street
      // claim on the very pass that publishes the street.
      // ⚠ THE DIRECTION COMES FROM THE **BOUNDARY**, never from the ring's centroid — a "move
      // it inside" that takes its direction from the region can move it further out
      // (`districtPartition`'s own banked lesson, and `epochAxis.translateEdgesOut`'s).
      // ⛔⛔ ⟦§274.5a⟧ AND THE INSET WAS MEASURED FROM THE WRONG OBJECT — MEASURED, 6 OF 9 ROUNDS
      // ON THE CITY. `laneWidth * 0.5 + rr * 1.02` is the clearance from the tower's VERTEX,
      // but the ring street's claim is a POLYLINE and its chords cut the ring's corners. On a
      // 23-vertex ring of the city's radius the chord sits ~1.4 units inside the vertex, so a
      // round with 0.11 units of clearance by the normal has NEGATIVE clearance against the line
      // the claim actually uses. Nothing could see it: a round refused for standing in a street
      // simply vanished into `refusedDwellings`, which read 90% for a different reason.
      // ⭐ THE CURE IS TO MEASURE THE CLEARANCE THE WAY THE CLAIM MEASURES IT. The centre must
      // stand `half + rr * 1.02` from the ring street's own polyline; a 12-gon inscribed in `rr`
      // is inside that disc, so centre clearance is sufficient. Bounded, deterministic, and
      // arithmetic only — it solves the rule the law already states ("the round stands INSIDE
      // the ring street, not on it") instead of approximating it with a per-vertex normal.
      const need = laneWidth * 0.5 + rr * 1.02;
      const ringLine = ring.polygon;
      for (let t = 0; t < ring.towers.length; t++) {
        const p = ring.towers[t];
        const nrm = inwardNormalAt(ring.polygon, p[0], p[1]);
        let cx = p[0] + nrm[0] * need, cy = p[1] + nrm[1] * need;
        for (let k = 0; k < 8 && pointToClosedPolylineDist(ringLine, cx, cy) < need; k++) {
          cx += nrm[0] * rr * 0.25; cy += nrm[1] * rr * 0.25;
        }
        out.dwellings.push({
          key: `demoted.tower.E${ring.epoch}.${t}`,
          x: cx, y: cy, r: rr,
          polygon: circlePoly(cx, cy, rr, 12),
          was: (ring.towerTypes || [])[t] || 'drum',
          epoch: ring.epoch,
        });
      }
    }
    // ── ⭐⭐ 4 · THE DITCH BECOMES A RIBBON OF FILLED-DITCH GARDENS immediately OUTSIDE the old
    //    line, following the ring exactly. Long, narrow, green, and radial to the old circuit —
    //    because they were laid out against it, which is the structural rule ("plot boundaries
    //    in the ring immediately outside the old wall are RADIAL to the old circuit") arriving
    //    as geometry rather than as a note.
    // ⛔⛔ ⟦§274.5a⟧ **THE RIBBON WAS LAID INSIDE THE RING STREET'S OWN CARRIAGEWAY, ON EVERY
    //    LEAF, SINCE §250.5 LANDED — 110 of 110 gardens across the corpus.** MEASURED: the band
    //    started `stone * 0.5 + frontage * 0.12` from the old line (city 2.42) against a ring
    //    street half-width of 3.25. **AND NO CENSUS COULD EVER HAVE SEEN IT**: a filled-ditch
    //    garden is OPEN GROUND, deliberately outside `drawnBodies` (its own comment says so), so
    //    §17.4 cannot convict it — and the 90% body-collision refusal removed most of them
    //    before a reader could notice the rest.
    // ⭐⭐ THE CAUSE IS THIS MODULE'S OWN BANKED CLASS, APPLIED TO ONE CONSUMER AND NOT THE
    //    OTHER: **A DERIVED WIDTH TAKEN FROM THE POST-DEMOTION OBJECT MEASURES THE DEMOTION, NOT
    //    WHAT WAS DEMOTED.** `laneWidth` was cured to the WORKING band twelve lines above (the
    //    3,000 px zoom convicted the hairline); the ribbon was left on `ring.bandParts.stone` —
    //    the superseded ring's own band, which `wallBand` gives `inner = 0` ON PURPOSE. The cure
    //    was applied to one of two readers of the same wrong number.
    // ⭐ SO THE RIBBON STARTS AT THE LANE'S OUTER KERB, WHICH IS WHAT "immediately outside the
    //    old wall line" MEANS ONCE THE WALL'S WHOLE RESERVATION IS THE CARRIAGEWAY. The band's
    //    DEPTH is unchanged (`frontage * 1.23`); only its base moves, so the plot count and the
    //    radial grain — facts about the old circuit's own resolution — are untouched.
    const gardenBase = laneWidth * 0.5;
    const gardenOuter = offsetPolygonOutward(ring.polygon, gardenBase + frontage * 1.35, 1.5);
    const gardenInner = offsetPolygonOutward(ring.polygon, gardenBase + frontage * 0.12, 1.5);
    // ⛔⛔ ⟦MF-W3F⟧ **THE PAIRING IS BY INDEX, SO IT IS ONLY MEANINGFUL WHEN THE THREE RINGS HAVE
    //    THE SAME VERTEX SET.** `offsetPolygonOutward` clamps its mitre, and at a large enough
    //    offset on a concave ring it can emit a DIFFERENT number of vertices — after which
    //    `gardenInner[i]` and `gardenOuter[i]` are two unrelated points and the quad they span is
    //    a BOW TIE. The old `Math.min(...)` guard bounded the LOOP and said nothing about the
    //    correspondence. ⭐ IT WAS LATENT AND THIS WAVE FIRED IT: moving the ribbon out to the
    //    ring street's kerb (a larger offset) and re-aiming the terrain pull (a different ring
    //    shape) between them put ONE twisted quad on the metropolis, and the ALL-RING census —
    //    which MF-D0 built and which had read 0 for two waves — convicted it immediately.
    // ⭐ THE CLASS: **AN INDEX PAIRING BETWEEN TWO DERIVED SEQUENCES IS A CLAIM ABOUT THEIR
    //    LENGTHS, AND A `min` OVER THE LENGTHS ASSERTS IT INSTEAD OF CHECKING IT.**
    const paired = gardenOuter.length === ring.polygon.length && gardenInner.length === ring.polygon.length;
    const n = paired ? ring.polygon.length : 0;
    for (let i = 0; i + 1 < n; i++) {
      // One garden per pair of adjacent ring vertices — so the plot COUNT is a fact about the
      // old circuit's own resolution, never a chosen number.
      const quad = [gardenInner[i], gardenInner[i + 1], gardenOuter[i + 1], gardenOuter[i]];
      if (!quad.every((p) => p && Number.isFinite(p[0]))) continue;
      // ⚠ AND THE QUAD ITSELF IS ASKED THE RING KERNEL'S OWN QUESTION. Even with the lengths
      // matched, a deep concavity can order two offset points against each other. A garden plot
      // that crosses itself does not bound ground — the same sentence §287.12 wrote about a
      // curtain — so it is not emitted, and the ALL-RING census stays a fact.
      if (ringSelfCrossings(quad) !== 0) continue;
      out.gardens.push({
        key: `ditchGarden.E${ring.epoch}.${i}`, polygon: quad, epoch: ring.epoch,
      });
    }
    // ── ⭐⭐ 5 · EVERY GATE BECOMES A STREET WIDENING AND A BREAK IN THE FRONTAGE LINE where the
    //    ring street meets a radial. The widening IS the gate's own opening diameter — a gate
    //    was already the widest thing on the circuit, and a town does not narrow the one place
    //    its carts were guaranteed to fit.
    for (const g of ring.gates) {
      out.widenings.push({
        key: `ringWidening.E${ring.epoch}.${g.key}`,
        x: g.x, y: g.y, dx: g.dx, dy: g.dy,
        radius: laneWidth * 1.45, epoch: ring.epoch, wasBricked: !!g.bricked,
      });
    }
  }
  const byRung = {};
  for (const f of out.fates) byRung[f.rung] = (byRung[f.rung] || 0) + 1;
  out.reason = `${superseded.length} superseded circuit(s) demoted: ${out.ringStreets.length} ring street(s),`
    + ` ${out.dwellings.length} circular dwelling(s) from towers, ${out.gardens.length} filled-ditch garden(s),`
    + ` ${out.widenings.length} gate widening(s), ${out.stubs.length} standing stub(s);`
    + ` fate ladder ${Object.keys(byRung).sort().map((k) => `${k} ${byRung[k]}`).join(', ') || 'none'}`;
  return out;
}

/**
 * ⭐ THE RUNG, CHOSEN BY PRESSURE AND BIASED BY WHAT THE RUN WAS. A run the water or the crag
 * defended is a run nobody needed the stone from and nobody wanted to build on; a run that
 * carried the wall-side street is in the middle of the town and went first.
 */
export function fateFor(pressure, run, rng) {
  const sheltered = run.type === 'terrain-surrender' || run.type === 'water-termination';
  const p = sheltered ? pressure * 0.45 : pressure;
  // The ladder is walked by weight, not by a chain of thresholds: an independent per-rung roll
  // on a ladder with a floor has no floor, which is the class `cutGates` banked at §161g.
  const w = [
    { weight: (1 - p) * (1 - p) * 2.2 },      // standing
    { weight: (1 - p) * 1.5 },                // property-line
    { weight: 1.0 },                          // blocked
    { weight: p * 1.5 },                      // robbed
    { weight: p * p * 2.2 },                  // quarried
  ];
  return FATE_RUNGS[rng.weighted(w)];
}

/**
 * ⭐⭐⭐ **RESERVE THE FOSSILS' GROUND BEFORE THE ORDINARY FABRIC HOLDS IT** (ODQ §274.5a, W3's
 * ruled first item; the composition-order move, precedent §200's wall band moving above the
 * ground law at MF-B8).
 *
 * ⛔⛔ THE DEFECT THIS EXISTS FOR, WITH THE NUMBER. Until this pass, the fossils were emitted at
 * stage 5a and SITED at stage 5b — after the packer had cut, after the ground law had run, after
 * the access repair. So every fossil contested ground a cottage was already standing on, and the
 * cottage won by arriving first. MEASURED at this lane's own base: **28 of 31 tower rounds
 * (90.3%) and 100 of 110 ditch gardens (90.9%) refused** — §274.5(a)'s "90% of tower rounds and
 * 80% of ditch gardens" reproduced, and the gardens WORSE than W2 measured them, because MF-D0's
 * kernel shortens a repaired ring (D0 §6.3: highwater 5 → 0).
 *
 * ⭐⭐⭐ THE MOVE IS AN ORDERING, NOT A TOLERANCE. Nothing about the fossils' geometry changes.
 * They simply take their turn in the derivation at the point their history entitles them to —
 * **before** the pass that decides which body holds which ground — instead of last. The ring
 * street has had exactly this standing since §250.5 (it joins the claim set every later stage
 * reads); the round, the garden and the widening never did, and that asymmetry is the whole
 * defect.
 *
 * ⭐⭐ AND THE FOSSIL DOES NOT OUTRANK EVERYTHING — IT OUTRANKS THE FABRIC THAT GREW OVER IT.
 * Two things are SENIOR to a fossil, each for a reason the law already states:
 *
 *   the right of way  │ **RADIALS ARE OLDER THAN RINGS** — this module's own structural rule.
 *                     │   A road out predates every circuit; so do the water's bank and the
 *                     │   working circuit's band (§200). A fossil never takes a carriageway
 *   an institution    │   §8.1 / §195.0's precedence — the ordinary fabric gives way to the
 *                     │   monumental, and a fossil is ordinary fabric with a date on it
 *
 * ⭐⭐⭐ AND THE SENIOR CLAIM **CLIPS THE GARDEN; IT DOES NOT REFUSE IT** — which is the ground
 * law's own grammar ("facades land ON the street"), and the difference is the whole census.
 * MEASURED with a refuse-on-touch rule first: **110 of 110 gardens refused, attributed
 * `blockLane 40 · high 30 · seam 22 · artery 17 · blockCross 10 · …`.** Of course — the old ring
 * is INSIDE the town and every radial the fabric owns crosses it. Refusing a whole strip because
 * one corner meets a lane deletes the ribbon to protect a kerb. ⭐ **A RIBBON THAT BREAKS AT THE
 * ROADS IS THE HISTORICAL PICTURE, NOT A DEFECT** — garden plots outside the old wall, interrupted
 * where the ways out cross them. The clip is the ONE right-of-way clip `groundLaw` owns, INJECTED
 * by the composition root, so there is no second spelling and no new module edge.
 *
 * ⛔ **THE ROUND IS REFUSED RATHER THAN CLIPPED, AND THAT ASYMMETRY IS DELIBERATE.** The law's
 * whole claim for the tower round is *"a CIRCLE where every other footprint is rectilinear"* —
 * that is its entire legibility. A circle clipped flat against a kerb is a D, and a D is not the
 * fossil the table names. A round with nowhere to stand is the fate ladder's quarried rung, which
 * this module already says in as many words. The garden has no such shape claim: it is a strip.
 *
 * ⚠⚠ AND THE GARDEN IS CLAIM-TESTED HERE FOR THE FIRST TIME. `siteFossils` never asked a garden
 * about a claim — only about bodies — because a filled-ditch garden is OPEN GROUND and cannot
 * convict §17.4 (`groundRefusal.drawnBodies` says so in as many words). That was harmless while a
 * garden was only ever a survivor; it is NOT harmless now that a garden RESERVES ground, because
 * a reservation lying in a carriageway would push a house out of a street's way for it.
 *
 * @param {Object} a
 * @param {any} a.demotion       the EMITTED demotion (`demoteCircuits`'s own output)
 * @param {Array<any>} a.claims  the senior claim set — streets, water, the working circuit
 * @param {Array<any>} a.institutions  the seated landmarks, whose solids are senior
 * @param {(poly:any)=>{poly:any,clips:number}} a.clip  ⭐ `groundLaw.claimClipper(claims)` — the
 *   ONE right-of-way clip, handed in rather than imported. REQUIRED: a reservation that could
 *   silently skip the clip would reserve carriageway, and an unexercised default reads as a
 *   working path (`coordinateAbi.heightQ`'s own rule, one module over)
 * @param {number} [a.touchEps]
 * @returns {{dwellings:Array<any>, gardens:Array<any>, refusedDwellings:number,
 *            refusedGardens:number, clippedGardens:number, refusedByClaim:number,
 *            refusedByInstitution:number, refusedBy:Record<string,number>,
 *            ground:Array<Array<[number,number]>>, reason:string}}
 */
export function reserveFossils(a) {
  const { demotion, claims, institutions, clip, touchEps } = a;
  if (typeof clip !== 'function') {
    throw new Error('reserveFossils: `clip` is required — the right-of-way clip has one home '
      + '(groundLaw.claimClipper) and a reservation without it would reserve carriageway');
  }
  if (typeof a.overlaps !== 'function') {
    throw new Error('reserveFossils: `overlaps` is required — abutment is not overlap, and the '
      + 'one predicate that knows the difference is groundLaw.overlapping');
  }
  const eps = touchEps == null ? 0.02 : touchEps;
  const inClaim = claimTester(claims, eps);
  /** @type {Array<Array<[number,number]>>} */ const senior = [];
  for (const lm of (institutions || [])) {
    for (const sol of (lm.solids || [])) if (sol && sol.length >= 3) senior.push(sol);
  }
  const hitsSenior = (poly) => {
    for (const s of senior) if (a.overlaps(poly, s)) return true;
    return false;
  };
  let byClaim = 0, byInstitution = 0, clippedGardens = 0;
  /** @type {Record<string, number>} */ const refusedBy = {};
  // ⭐ THE REFUSAL IS TYPED. A bare count cannot tell "the high street was there" from "a cottage
  // was there", and the whole point of the ordering move is that those are different facts.
  // ⚠ `rank` FIRST: a channel names its class in `rank` ('high', 'lane', 'alley', 'ringOld'), a
  // wall claim in `kind`, and only a nameless claim falls back to its key's first token. A family
  // census keyed on the token alone reads 'street' for every one of them — a denominator that
  // cannot answer the question the census is for.
  const noteRefusal = (c) => {
    byClaim++;
    const fam = String(c.rank || c.kind || String(c.key || '').split('.')[0] || 'claim');
    refusedBy[fam] = (refusedBy[fam] || 0) + 1;
  };
  // ── THE ROUND: refused, never clipped (see the header's asymmetry note).
  /** @type {Array<any>} */ const dwellings = [];
  for (const d of demotion.dwellings) {
    if (!d.polygon || d.polygon.length < 3) continue;
    const c = inClaim(d.polygon);
    if (c) { noteRefusal(c); continue; }
    if (hitsSenior(d.polygon)) {
      byInstitution++; refusedBy.institution = (refusedBy.institution || 0) + 1; continue;
    }
    dwellings.push(d);
  }
  // ── THE GARDEN: clipped to the kerb, and refused only when the clip leaves too little to be a
  //    plot. The floor is a SHARE of the strip's own area — a fact about this garden, never an
  //    absolute — so a metropolis strip and a thorp strip are judged by the same rule.
  /** @type {Array<any>} */ const gardens = [];
  for (const g of demotion.gardens) {
    if (!g.polygon || g.polygon.length < 3) continue;
    const area0 = ringArea(g.polygon);
    const cut = clip(g.polygon);
    const poly = cut.poly;
    if (!poly || poly.length < 3 || ringArea(poly) < area0 * GARDEN_AREA_FLOOR) {
      const c = inClaim(g.polygon);
      noteRefusal(c || { rank: 'rightOfWay' });
      continue;
    }
    if (hitsSenior(poly)) {
      byInstitution++; refusedBy.institution = (refusedBy.institution || 0) + 1; continue;
    }
    if (cut.clips) clippedGardens++;
    gardens.push(cut.clips ? { ...g, polygon: poly, clippedToKerb: true } : g);
  }
  /** @type {Array<Array<[number,number]>>} */ const ground = [];
  for (const d of dwellings) ground.push(d.polygon);
  for (const g of gardens) ground.push(g.polygon);
  return {
    dwellings,
    gardens,
    refusedDwellings: demotion.dwellings.length - dwellings.length,
    refusedGardens: demotion.gardens.length - gardens.length,
    clippedGardens,
    refusedByClaim: byClaim,
    refusedByInstitution: byInstitution,
    refusedBy,
    ground,
    reason: `${dwellings.length} of ${demotion.dwellings.length} tower rounds and ${gardens.length}`
      + ` of ${demotion.gardens.length} ditch gardens RESERVED their ground before the ordinary`
      + ` fabric held it (${clippedGardens} strips clipped to a kerb where a way out crosses the`
      + ` old ring; ${byClaim} refused by a senior claim, ${byInstitution} by a seated institution)`,
  };
}

/**
 * ⭐ HOW LITTLE OF A GARDEN STRIP IS STILL A GARDEN. A share of the strip's OWN area, so the rule
 * is scale-free across tiers. Below it, the ground the roads left is not a plot and the strip is
 * the fate ladder's quarried rung arriving as geometry.
 * ⚠ UNSOAKED; rides the tuning signature, like `groundLaw.AREA_FLOOR` it is modelled on.
 */
export const GARDEN_AREA_FLOOR = 0.34;

/** The absolute area of a simple ring — the shoelace, sign discarded. */
function ringArea(poly) {
  let s = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return Math.abs(s) / 2;
}

/**
 * ⭐ THE ONE CLAIM PREDICATE BOTH FOSSIL PASSES USE. A body is in a claim when any claim
 * segment reaches its AREA closer than the claim's own half-width — `reservedGround`'s rule,
 * spelled once here so the reservation and the siting cannot drift apart (the two-constructions
 * class `groundLaw.standingBodies` banks in its own header).
 */
function claimTester(claims, eps) {
  return (poly) => {
    for (const c of (claims || [])) {
      if (!c || !c.line) continue;
      const half = c.width / 2;
      for (let i = 0; i + 1 < c.line.length; i++) {
        // ⭐ IT RETURNS THE CLAIM, NOT A BOOLEAN — so a caller can say WHICH claim refused, and
        // `siteFossils`'s own use is unchanged because a claim object is truthy.
        if (segToPoly(c.line[i], c.line[i + 1], poly) < half - eps) return c;
      }
    }
    return null;
  };
}

/**
 * ⭐⭐⭐ SITE THE FOSSILS AGAINST THE FABRIC THAT SURVIVED — and the refusal IS the fate ladder's
 * top rung rather than a collision fix. A round that has nowhere to stand is a tower that was
 * quarried; a garden strip under a standing house is a strip that was built over. Both are
 * `wall_dead`, which the corpus names on **15 of 138 settlement plates (10.9%)** — normal, not
 * exceptional.
 *
 * ⚠⚠ ⟦§274.5a⟧ **SINCE THE RESERVATION LANDED, THIS PASS IS THE VERIFICATION, NOT THE DECISION.**
 * `reserveFossils` gives the survivors reserved standing in all three ground-law passes, so a
 * body that still overlaps one here is a body some LATER stage placed on reserved ground — which
 * is a finding, not a routine outcome. It stays non-vacuous by construction: the pass runs over
 * the DRAWN set, and its counterfactual (withdraw the reservation) restores the 90% refusal.
 *
 * ⚠⚠ IT RUNS AFTER THE GROUND LAW AND THE ACCESS REPAIR, ON THE **DRAWN** SET, so its subject
 * is the plate's subject in both directions (`laneMFW1B-receipt.md` §13's standing hazard). The
 * survivors carry no overlap with any drawn body and no penetration of any claim BY
 * CONSTRUCTION, which is what makes them safe to add to the drawn censuses in the same pass
 * that draws them (§195.0's standing rule).
 *
 * @param {Object} a
 * @returns {{dwellings:Array<any>, gardens:Array<any>, refusedDwellings:number,
 *            refusedGardens:number, reason:string}}
 */
export function siteFossils(a) {
  const { demotion, bodies, claims, touchEps } = a;
  // ⛔⛔ ⟦§274.5a⟧ **ABUTMENT IS NOT OVERLAP, AND THIS PASS USED TO SAY IT WAS.** Its private
  // `polysOverlap` returns true when two edges come within `eps` — so a parcel the ground law
  // had just clipped EXACTLY to a reserved fossil's kerb was read here as standing on it, and
  // the reservation was undone by the very repair that honoured it. MEASURED: 5 reserved city
  // gardens, 0 sited. ⭐ THE CLASS is §238's predicate contract and §273.3's point-vs-area
  // family in one: **two predicates for "these two bodies overlap", one of which cannot tell a
  // party wall from an overprint.** `groundLaw.overlapping` is the one that can (it shrinks both
  // bodies first, which is what `shrinkToward` exists for) and it is handed in for the same
  // manifest reason the clip is — S14 may not import S20.
  if (typeof a.overlaps !== 'function') {
    throw new Error('siteFossils: `overlaps` is required — abutment is not overlap, and the one '
      + 'predicate that knows the difference is groundLaw.overlapping');
  }
  const eps = touchEps == null ? 0.02 : touchEps;
  const boxes = bodies.map((b) => bbox(b.poly));
  const hits = (poly) => {
    const bb = bbox(poly);
    for (let i = 0; i < bodies.length; i++) {
      const o = boxes[i];
      if (o.x1 < bb.x0 - eps || bb.x1 < o.x0 - eps || o.y1 < bb.y0 - eps || bb.y1 < o.y0 - eps) continue;
      if (a.overlaps(poly, bodies[i].poly)) return true;
    }
    return false;
  };
  const inClaim = claimTester(claims, eps);
  const dwellings = demotion.dwellings.filter((d) => !hits(d.polygon) && !inClaim(d.polygon));
  const gardens = demotion.gardens.filter((g) => !hits(g.polygon));
  return {
    dwellings,
    gardens,
    refusedDwellings: demotion.dwellings.length - dwellings.length,
    refusedGardens: demotion.gardens.length - gardens.length,
    reason: `${dwellings.length} of ${demotion.dwellings.length} tower rounds and ${gardens.length}`
      + ` of ${demotion.gardens.length} ditch gardens survived the fabric that grew over them —`
      + ' the rest are the fate ladder\'s quarried rung, arriving as geometry rather than as a roll',
  };
}

/**
 * ⭐ THE DISTANCE FROM A POINT TO A CLOSED POLYLINE — the ring street's own geometry, including
 * the WRAP segment, because the ring street's `line` closes itself by repeating vertex 0 and a
 * measurement that stopped at the last vertex would leave one segment unasked.
 */
function pointToClosedPolylineDist(poly, px, py) {
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const dd = ptSeg([px, py], poly[i], poly[(i + 1) % poly.length]);
    if (dd < d) d = dd;
  }
  return d;
}

/** The ring's INWARD unit normal nearest a point — winding-agnostic, from the boundary itself. */
function inwardNormalAt(poly, px, py) {
  let bi = 0, bd = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const d = (poly[i][0] - px) * (poly[i][0] - px) + (poly[i][1] - py) * (poly[i][1] - py);
    if (d < bd) { bd = d; bi = i; }
  }
  const n = poly.length;
  const a = poly[(bi - 1 + n) % n], b = poly[bi], c = poly[(bi + 1) % n];
  let nx = 0, ny = 0;
  for (const [p, q] of [[a, b], [b, c]]) {
    let ex = q[1] - p[1], ey = -(q[0] - p[0]);
    const L = Math.sqrt(ex * ex + ey * ey);
    if (L < 1e-12) continue;
    nx += ex / L; ny += ey / L;
  }
  const L = Math.sqrt(nx * nx + ny * ny);
  if (L < 1e-9) return [0, 0];
  nx /= L; ny /= L;
  return pointInRing(poly, b[0] + nx * 0.05, b[1] + ny * 0.05) ? [nx, ny] : [-nx, -ny];
}

function bbox(poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  return { x0, y0, x1, y1 };
}

function pointInRing(poly, px, py) {
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

/** AREA-TRUE overlap: a vertex of either inside the other, or any edge pair crossing. */
function polysOverlap(A, B, eps) {
  for (const p of A) if (pointInRing(B, p[0], p[1])) return true;
  for (const p of B) if (pointInRing(A, p[0], p[1])) return true;
  for (let i = 0; i < A.length; i++) {
    const a = A[i], b = A[(i + 1) % A.length];
    for (let j = 0; j < B.length; j++) {
      const c = B[j], d = B[(j + 1) % B.length];
      if (segSeg(a, b, c, d) < eps) return true;
    }
  }
  return false;
}

function segSeg(a, b, c, d) {
  const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]);
  if (den !== 0) {
    const t = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / den;
    const u = ((c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0])) / den;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return 0;
  }
  return Math.min(ptSeg(c, a, b), ptSeg(d, a, b), ptSeg(a, c, d), ptSeg(b, c, d));
}

function ptSeg(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = dx * dx + dy * dy;
  let t = L > 0 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const qx = a[0] + dx * t, qy = a[1] + dy * t;
  return Math.sqrt((p[0] - qx) * (p[0] - qx) + (p[1] - qy) * (p[1] - qy));
}

/** The distance from one claim segment to a body's AREA — `reservedGround.segToPolyDist`'s rule. */
function segToPoly(a, b, poly) {
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const q = poly[i], r = poly[(i + 1) % poly.length];
    const dd = segSeg(a, b, q, r);
    if (dd < d) d = dd;
    if (d === 0) return 0;
  }
  if (pointInRing(poly, a[0], a[1])) return 0;
  return d;
}

/**
 * A closed circle as a polygon. ⚠ NO RUNTIME TRIG — the fabric's purity law forbids it outright
 * and the scan enforces it. `trigTable` is the fabric's one home for an angle, so the round
 * that makes a demoted tower legible is drawn from the same table every other rotation uses.
 */
export function circlePoly(cx, cy, r, steps) {
  const n = Math.max(6, steps | 0);
  /** @type {Array<[number,number]>} */ const out = [];
  for (let i = 0; i < n; i++) {
    const a = Math.round((i * TRIG_N) / n) % TRIG_N;
    out.push(/** @type {[number,number]} */ ([cx + r * cosI(a), cy + r * sinI(a)]));
  }
  return out;
}

/**
 * ⭐⭐ THE SITED FOSSIL SET, ASSEMBLED WHERE IT IS DERIVED. The caller hands over the DRAWN
 * versions of every body family and gets back the version of the demotion the leaf actually
 * draws — "the fossils as EMITTED" and "the fossils as SITED against the fabric that survived"
 * are two artifacts and each is named (MF-ARCH-2's version axis; the SCC walker convicted my
 * first spelling, which assigned the survivors back into the emitted object).
 */
export function sitedDemotion(a) {
  const { demotion, claims, touchEps, drawn, lod, habitation, keepers, seatedAll, stateMarks } = a;
  const fossils = siteFossils({
    overlaps: a.overlaps,
    demotion,
    bodies: drawnBodies({
      parcels: drawn.parcels,
      lod: { masses: drawn.masses, mergedKeys: lod.mergedKeys },
      shanty: { huts: drawn.huts },
      faubourgs: { buildings: drawn.faubourgBuildings, leanTos: drawn.faubourgLeanTos },
      habitation: habitation.dwellings.concat(keepers.dwellings),
      landmarks: seatedAll,
      stateMarks,
    }),
    claims,
    touchEps,
  });
  return {
    ...demotion,
    dwellings: fossils.dwellings,
    gardens: fossils.gardens,
    sitingReason: fossils.reason,
    refusedDwellings: fossils.refusedDwellings,
    refusedGardens: fossils.refusedGardens,
  };
}
