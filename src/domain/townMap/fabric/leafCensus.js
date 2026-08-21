/**
 * domain/townMap/fabric/leafCensus.js — THE LAWS THAT CAN ONLY BE ASKED OF A FINISHED LEAF.
 *
 * Four members, and they are together because they share one shape: each is a question whose
 * answer does not exist until every stage above has run, and each returns a MEASURED figure
 * beside a VERDICT rather than a boolean. None of them draws anything.
 *
 *   §205 A  THE WATER RIGHT-OF-WAY CENSUS — what lies in the channel, and which of it is
 *           lawfully there under a NAMED exemption whose predicate is asserted.
 *   §203    THE ZONE CENSUSES — containment (does a quarter's fabric stay inside its own
 *           wash?) and fill (does its open share sit in the corpus's measured band?).
 *   GAP-B   `radialDensityFalloff` — the centre:edge density gradient, per morphology.
 *   GAP-C   THE STREET WIDTH CLASSES — how many distinct ranks the drawing actually carries
 *           and at what ratios.
 *
 * ⭐⭐ WHY A CENSUS RETURNS A NUMBER AND NOT A BOOLEAN. MF-B7's §202 flood taught this lane
 * the hard version: a census that blocks on more than its law names manufactures false
 * positives that the next lane will "cure". Every member here reports what it measured, what
 * band it was measured against, and which members are exempt BY NAME — so a red is always
 * traceable to a law rather than to a threshold.
 *
 * PURITY: pure reads and arithmetic. No draws, no Date, no Math.random, no runtime trig.
 */

import { distToPolyline, absArea, centroid, pointInPolygon } from './fabricGeometry.js';
import {
  segSegClosest, claimSegments, claimIndex, deepestPenetration, latticeAreaShare, bbox as polyBox,
} from './reservedGround.js';
import { compareKeys } from './lineage.js';
import { isInWater } from './waterMode.js';
import { ownerAt } from './organismFields.js';
import { repairAccess, accessCensus, circuitPermeability, collectAccessBodies, streetSeeds } from './accessLaw.js';
import { circuitClaims } from './wallCircuit.js';
import { waterClaims, runIsCovered } from './waterWorks.js';

/**
 * ⭐⭐ THE LEAF'S CLOSING PASS — every law that can only be asked once the drawing is finished,
 * asked in one place.
 *
 * ⚠ IT LIVES HERE RATHER THAN IN `buildFabric` FOR A REASON THE PREVIOUS LANE WROTE DOWN:
 * `buildFabric.js` stood at 797 effective lines against the 800 domain ceiling and MF-B7's
 * hazard list says in terms "the next member added to it will break the ratchet; PLAN the
 * decomposition, do not discover it." This wave adds four censuses, so the decomposition is
 * planned: the closing pass is one seam — everything above it composes the leaf, everything
 * in it measures the leaf — and it takes the assembled parts and returns their findings.
 *
 * @param {Object} a
 * @returns {Object} every closing finding, keyed for the meta
 */
export function censusLeaf(a) {
  // ⚠ ⟦SW-1b⟧ THE PARAMETER IS `web`, NOT `fabricWeb`, AND THE RENAME IS THE POINT. The caller
  //   has always handed this the FACED web while the parameter carried the PACKED version's
  //   binding name — `fabricWeb: facedWeb` — so every reader of this function has been told, by
  //   the only name available to them, that they hold a version they do not. A parameter named
  //   after a version must carry that version; `streetWebVersion.walker.test.js` refuses the
  //   disagreement now.
  const { seatedAll, channels, web: fabricWeb, walls, waterRel, frontage, mergedKeys,
    scale, organisms, builtUmbrella, nucleus, morphology, bridges, meetings, waterGates } = a;
  // ── §202 / §201 B · ACCESS. It runs first because its REPAIR moves bodies, and every
  //    census below must measure the geometry the leaf actually draws.
  // ⚠ THE ARGUMENTS ARE THE ARTIFACT VERSIONS THEMSELVES, never the containers that hold
  // them. Taking `packed`/`lod`/`shanty` whole is what made assigning back into them look
  // natural; taking the arrays makes the caller state WHICH version it is handing over.
  const accessSet = collectAccessBodies({
    parcels: a.parcels, merged: mergedKeys, masses: a.masses, huts: a.huts,
    faubourgs: { buildings: a.faubourgBuildings, leanTos: a.faubourgLeanTos },
    institutions: seatedAll,
  });
  const accessFabric = { channels, web: fabricWeb, walls };
  // ⭐⭐ MF-PERF1 · THE §202 GRID's STREET SEEDS ARE A FACT ABOUT THE CHANNELS, so they are
  // derived ONCE here and handed to all three consumers — J-W0-1's shape, applied to the
  // access law: a walled leaf used to stamp this identical 1,200² mask six times per build.
  const seeds = streetSeeds(accessFabric);
  const access = repairAccess(accessFabric, accessSet, frontage, seeds);
  // ⭐⭐⭐ MF-ARCH-2 · THE VERSION AXIS REACHES ACROSS THE CALL BOUNDARY (§241.2). This pass used
  // to ASSIGN its survivors back into its caller's `packed`, `lod`, `shanty` and `faubourgs` —
  // five write-backs the assembly's own SCC instrument could not see, because a stage graph
  // extracted from `buildFabric` stops at the call. ⭐ THE CLASS: **A WRITE-BACK PERFORMED
  // INSIDE A CALLEE IS INVISIBLE TO THE CALLER'S CYCLE ANALYSIS.** The survivors are RETURNED
  // as their own version and the caller names them.
  const parcels = a.parcels.filter((p) => p.polygon && p.polygon.length >= 3);
  for (const p of parcels) if (p.backHouse && p.backHouse.length < 3) p.backHouse = null;
  const masses = a.masses.filter((mm) => mm.polygon && mm.polygon.length >= 3);
  const huts = a.huts.filter((h) => h.polygon && h.polygon.length >= 3);
  const faubourgBuildings = a.faubourgBuildings.filter((b) => b.polygon && b.polygon.length >= 3);
  const faubourgLeanTos = a.faubourgLeanTos.filter((b) => b.polygon && b.polygon.length >= 3);
  const live = accessSet.filter((b) => b.poly && b.poly.length >= 3);
  const accessAudit = accessCensus(accessFabric, live, seeds);
  const permeability = circuitPermeability(accessFabric, live, circuitClaims(a.wallCircuit), seeds);
  // ── §205 A · THE WATER RIGHT-OF-WAY, with its exemptions named and their predicates asserted.
  const water = waterRightOfWay({
    rel: waterRel, channels, bridges, meetings, waterGates, landmarks: seatedAll, frontage,
  });
  // ── §203 · THE ZONES.
  const zones = zoneCensus({
    organisms, partition: builtUmbrella.partition, grid: a.grid,
    parcels, masses,
    merged: mergedKeys, tier: scale.tier, demoted: scale.highWater && scale.highWater.demoted,
  });
  // ── GAP-B / GAP-C · the two statistics no law named.
  const radial = radialDensity({
    bodies: live, centre: { x: nucleus.x, y: nucleus.y }, extent: scale.builtRadius,
    morphology: morphology.band, demoted: scale.highWater && scale.highWater.demoted,
  });
  const streets = streetClasses({
    channels, squares: fabricWeb.squares, frontage, tier: scale.tier,
  });
  return {
    access, accessAudit, permeability, water, zones, radial, streets,
    claims: waterClaims(waterRel),
    // The ACCESSIBLE version of every body family — this pass's own output, named.
    accessible: { parcels, masses, huts, faubourgBuildings, faubourgLeanTos },
  };
}

/**
 * ⭐⭐⭐ §205 A · THE WATER IS A RESERVED RIGHT-OF-WAY, AND THE THINGS THAT MAY STAND IN IT
 * ARE NAMED, NOT TOLERATED.
 *
 * ⛔ WHAT MF-B7's FORENSIC ZOOM FOUND AND COULD NOT RESOLVE: "two heavy structures lie across
 * the town's river… the drawn-body census reports 0 bodies in the channel, so these are
 * outside `footprints()`. Either a body class the census does not contain — §195.0 again — or
 * lawful bank works with an unasserted spanning predicate. UNRESOLVED."
 *
 * ⭐ THE ANSWER, MEASURED THIS WAVE BY WALKING EVERY GEOMETRY-BEARING ARRAY ON THE FABRIC
 * RATHER THAN THE CENSUS'S OWN SET: they are **STREET CHANNELS**. The town's drawn channel
 * carries 21 channel vertices, 43 seam vertices and 28 quarter-lane vertices inside the
 * water. They were invisible because every census this family owns asks about FILLED BODIES,
 * and a street is not a body — it is a claim of its own, and two claims can overlap without
 * either census noticing. ⭐⭐ THE CLASS, and it is new: **TWO RESERVED SURFACES CAN OCCUPY
 * THE SAME GROUND AND NEITHER SURFACE'S CENSUS IS LOOKING FOR THE OTHER.**
 *
 * ⭐ AND THE CURE IS NOT TO DELETE THE STREETS. A street crossing a river is exactly right —
 * it is what a bridge is for. The law is that the crossing must be a NAMED WORK carrying an
 * ASSERTED PREDICATE, which is §205 A in one sentence. So this census asks, of every crossing:
 *   • is a BRIDGE within reach of it, and does that bridge SPAN (its deck's ends on opposite
 *     banks)?  → lawful, exempt by name, predicate `spanning` TRUE
 *   • is the body a QUAY / port pier?  → lawful if BANK-ROOTED (one end on the dry side)
 *   • is it a WATER GATE?  → lawful: the wall closing against the water is §161m.3 itself
 *   • otherwise → a VIOLATION, reported with its own key.
 *
 * @param {Object} args
 * @returns {{ crossings:number, exempt:number, violations:Array<any>, byExemption:Record<string,number>, reason:string }}
 */
export function waterRightOfWay(args) {
  const { rel, channels, bridges, meetings, waterGates, landmarks, frontage } = args;
  if (!rel || !rel.line || rel.line.length < 2) {
    return { crossings: 0, exempt: 0, violations: [], byExemption: {}, reason: 'no watercourse on this leaf' };
  }
  // The census's own EFFECTIVE reach for a body: `isInWater` is 0.62 of the width for a river,
  // which is wider than `half`, and the old `wet` test unioned the two. Named once here rather
  // than left implicit in a boolean OR, so the area-true arm can be given the SAME threshold —
  // comparing two predicates means varying ONE thing.
  const reach = (rel.width || 0) * 0.62;
  const decks = bridges || [];
  const gates = waterGates || [];
  /** @type {Array<any>} */ const violations = [];
  /** @type {Record<string, number>} */ const byExemption = {};
  let crossings = 0, exempt = 0;
  const bump = (k) => { byExemption[k] = (byExemption[k] || 0) + 1; };

  // ── EVERY PLACE THE CHANNEL RUNS IN THE WATER IS A CROSSING TO ACCOUNT FOR.
  //
  // ⛔⛔ IT USED TO ASK THE CHANNEL'S **VERTICES**, AND THAT IS THE §230/§238 BLIND PREDICATE
  // ONE SURFACE OUT. A street whose two ends sit on opposite banks crosses the river between
  // them and has NO VERTEX INSIDE IT — the identical shape as the wall running through a
  // back-house whose four corners stand clear. MEASURED at MF-ARCH over the b8b corpus:
  // **113 crossings by the vertex reading, 115 segment-true** — the city and the migration
  // leaf each hide one street that spans their river in a single segment.
  // ⭐ THE CURE IS THE SEGMENT, AND THE EXEMPTION POINT COMES FROM THE SAME ANSWER. A vertex
  // is not the place a street meets a river; the CLOSEST APPROACH is, and `segSegClosest`
  // returns it from the same computation that decides whether there was a crossing at all —
  // so "is it a crossing" and "where is it" can never be two readings.
  //
  // ⭐⭐⭐ MF-W0 / G-34 · AND THE READING NOW COMES FROM `waterWorks.waterMeetings`, WHICH IS
  // THE SAME COMPUTATION `deriveBridges` USED TO CHOOSE THE DECKS — handed across on
  // `bridges2.meetings` rather than repeated here. Until this wave the two modules asked the
  // same two lines different questions (`crossPoint` against the centreline vs
  // `segSegClosest < half` against the band) and **the census convicted exactly the crossings
  // the deriver was blind to: 92 of 127 street violations, 72%, unexemptable BY CONSTRUCTION**
  // (ODQ §262.2, `laneMFW1-receipt.md` §6.1). ⚠ The `meetings` argument is not an optimisation
  // and must never be made optional "for safety": a fallback recomputation here would be a
  // SECOND SPELLING of the predicate and would restore the defect silently.
  for (const ch of (channels || []).slice().sort((a, b) => compareKeys(String(a.key || a.rank), String(b.key || b.rank)))) {
    if (!ch.line || ch.line.length < 2) continue;
    const m = meetings.get(String(ch.key || ch.rank));
    if (!m || !m.runs.length) continue;
    crossings++;
    // ⭐ §262.2(e) · THE ONE LAWFUL EXEMPTION, AND IT IS NAMED. A run that enters and leaves on
    // the SAME bank — a quay street, a shore road, a slipway, a field seam along its own bank —
    // crosses nothing and owes nothing. It is keyed to the WATER'S RELATIONSHIP TO THE RUN
    // (bankside adjacency vs channel transit), never to the leaf's terrain token, and it is
    // reported under its own name so a reader can see what was forgiven and why.
    let transits = 0, uncovered = 0, refused = '';
    for (const run of m.runs) {
      if (run.verdict === 'bankside') continue;
      if (run.verdict !== 'transit') { refused = refused || run.verdict; continue; }
      transits++;
      if (!runIsCovered(run, decks, gates, frontage)) uncovered++;
    }
    if (!refused && !uncovered) { exempt++; bump(transits ? 'decked crossing' : 'bankside adjacency'); }
    else {
      violations.push({
        key: String(ch.key || ch.rank), kind: 'street',
        // ⛔ THE CAUSE IS PUBLISHED, because "165 violations" without causes is the figure that
        // made the last three waves guess. `in-channel` = the line lies in the water with dry
        // ground on neither bank; `open-water` = a road out past the strand into the sea, for
        // which there is no far shore to bridge to.
        cause: refused || 'undecked transit',
        inside: m.inside, runs: m.runs.length, transits, uncovered,
      });
    }
  }

  // ── AND EVERY DRAWN BODY. A quay is lawful; a house is not. The predicate is BANK-ROOTED:
  //    part of the work must stand on dry ground, which is what roots it.
  //
  // ⛔⛔ THE SAME BLINDNESS, AND IT WAS TWO DEFECTS RATHER THAN ONE. (a) `wet` counted the
  // body's VERTICES, so a body the channel passes THROUGH scored wet = 0 and was skipped
  // entirely; (b) `rooted` was `wet < poly.length` — A COUNT OF DRY CORNERS — so a pier
  // covered by the channel except at one corner read "rooted" and a quay whose bulk is ashore
  // but whose four corners are all wet read "not rooted". MEASURED at MF-ARCH over the b8b
  // corpus at the census's own reach: **12 bodies by the vertex reading, 26 area-true.**
  // ⭐ BOTH ARE NOW ONE QUESTION ASKED OF AREA: `deepestPenetration` says whether the claim
  // reaches the body's ground, and `latticeAreaShare`-free rooting says whether any of that
  // ground is outside the claim. Same module, same proof, one predicate.
  //
  // ⚠⚠ THE SUBJECT SET IS **NOT** WIDENED IN THIS WAVE AND THE GAP IS REPORTED INSTEAD. This
  // loop walks institution SOLIDS only; the drawn set is 23,116 bodies and 92 of them stand in
  // this census's own 0.62-width reach. Widening the subject of a census is a LAW change, the
  // feature-law freeze (§234.4) is in force, and MF-B7's §202 flood is the standing warning
  // that a census blocking on more than its law names manufactures false positives the next
  // lane will "cure". The number is measured, recorded, and left for wave nine to rule on.
  const wetSegs = claimSegments([{ line: rel.line, width: (rel.width || 0) * 1.24, key: 'water.reach' }]);
  const wetIdx = claimIndex(wetSegs);
  for (const lm of (landmarks || [])) {
    for (let i = 0; i < (lm.solids || []).length; i++) {
      const poly = lm.solids[i];
      if (!poly || poly.length < 3) continue;
      const pen = deepestPenetration(poly, wetSegs, wetIdx).pen;
      if (pen <= 0 && !seaTouches(rel, poly)) continue;
      crossings++;
      // ROOTED, AREA-TRUE: some of the body's own GROUND lies outside the claim. The point
      // test below is legitimate because `latticeAreaShare` weights it BY AREA at cell
      // centres — the area-truth comes from the lattice, never from the sample.
      const bb = polyBox(poly);
      const pitch = Math.max(0.25, Math.min((rel.width || 1) * 0.5,
        Math.max(bb.x1 - bb.x0, bb.y1 - bb.y0) / 4));
      const dry = latticeAreaShare(poly, pitch,
        (x, y) => (distToPolyline(x, y, rel.line) < reach || isInWater(rel, x, y) ? 1 : 0), 0);
      const rooted = dry.share > 0;
      // ⛔⛔ §262.2(d) · THE FALLBACK THAT NEVER FELL BACK. This read
      // `String(lm.archetype || lm.anchorKey || '')`, and **every landmark has an archetype** —
      // `inst.name.mill#0#0` carries `archetype "extraction"`, `anchorKey "name:mill"` — so the
      // `||` short-circuited on the truthy archetype, `anchorKey` was unreachable for every
      // body in the corpus, and **the regex's own word `mill` could never fire.** A bank-rooted
      // watermill standing on its own river was convicted as an unlawful structure by a rule
      // that names mills. ⭐ THE CLASS: **`a || b` READS AS "a, FALLING BACK TO b" AND IS IN
      // FACT "a, AND b IS DEAD CODE" WHENEVER `a` IS RELIABLY TRUTHY — a blind predicate with
      // an idiom instead of a comment.** Both strings are read; MEASURED at MF-W1 as exempt
      // +6, violations 165 → 159, subject set unchanged, and the run-1 parchment SHAs
      // BYTE-IDENTICAL on town/city/highwater/fjord (`laneMFW1-receipt.md` §5).
      const marine = /port|quay|mill|ferry|bridge|dock|wharf/i
        .test(`${String(lm.archetype || '')} ${String(lm.anchorKey || '')}`);
      if (marine && rooted) { exempt++; bump('bank-rooted work'); }
      else {
        violations.push({
          key: `${lm.instanceKey}#${i}`, kind: 'body', archetype: String(lm.archetype || ''), rooted,
          cause: marine ? 'unrooted water work' : 'body in the claim',
        });
      }
    }
  }
  violations.sort((a, b) => compareKeys(a.key, b.key));
  return {
    crossings, exempt, violations, byExemption,
    reason: `${crossings} member${crossings === 1 ? '' : 's'} touch the drawn channel; ${exempt} exempt by name`
      + ` (${Object.keys(byExemption).sort().map((k) => `${k} ${byExemption[k]}`).join(', ') || 'none'});`
      + ` ${violations.length} unaccounted`,
  };
}

/**
 * Does a body's AREA reach the sea BODY? Asked as polygon against polygon — a vertex test
 * misses an inlet that crosses a body without either outline's corners being inside the other.
 */
function seaTouches(rel, poly) {
  const sea = rel.kind === 'coast' && rel.body && rel.body.length >= 3 ? rel.body : null;
  if (!sea) return false;
  for (const p of poly) if (pointInPolygon(p[0], p[1], sea)) return true;
  for (const p of sea) if (pointInPolygon(p[0], p[1], poly)) return true;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    for (let j = 0; j < sea.length; j++) {
      const c = sea[j], d = sea[(j + 1) % sea.length];
      if (segSegClosest(a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]).d === 0) return true;
    }
  }
  return false;
}

/**
 * ⭐⭐⭐ §203 · THE ZONE LAWS — CONTAINMENT AND FILL.
 *
 * The owner's finding, and MF-B7's largest untouched item: a quarter's wash and a quarter's
 * fabric must be the same place, and a quarter must not be empty inside its own bound.
 *
 * ⭐ CONTAINMENT IS ASKED THREE WAYS, BECAUSE ONE WAY IS A THRESHOLD AND THREE ARE A LAW:
 *   1. MEMBERS OUTSIDE — how many of a quarter's own bodies fall outside its drawn wash. The
 *      strict reading, and the one a reader can check by eye.
 *   2. MAJORITY-AREA — is most of each body's area inside? A body clipped by the wash's own
 *      boundary is not a containment failure; a body sitting a wash away is.
 *   3. THE DISPLACE-ONE COUNTERFACTUAL — move a single body to a neighbouring quarter's
 *      centroid and the census MUST red. ⭐ Without this arm the census is vacuous whenever
 *      the wash happens to cover everything, which is exactly when it looks best.
 *
 * FILL uses MF-S1's measured T-05 bands (village 5–27%, town 2–13%, city 1–11%, metropolis
 * ≈1%) with the corpus's own per-district modifiers, and a DEMOTED quarter is lawfully empty
 * only where §161g's visible work says so.
 *
 * @param {Object} args
 * @returns {{ outside:number, majorityOutside:number, fill:Array<any>, offBand:number, reason:string }}
 */
export function zoneCensus(args) {
  const { organisms, partition, grid, parcels, masses, merged, tier, demoted } = args;
  const ordered = (organisms || []).slice().sort((a, b) => compareKeys(a.key, b.key));
  const index = new Map(ordered.map((o, i) => [o.key, i]));
  // ⭐⭐⭐ CONTAINMENT IS ASKED OF THE GROUND, NOT OF THE CLICK REGION — AND THE FIRST
  // SPELLING ASKED THE WRONG SURFACE, WHICH IS WORTH THE WHOLE NOTE.
  //
  // ⛔ MEASURED against `umbrella.partition`: 366 of a town's 1,026 bodies and 706 of a
  // city's 1,798 were "outside their own quarter" — a 36% containment failure that would have
  // been the wave's biggest finding. It is not real. `umbrella.partition` is the TRUTH
  // LAYER's click region and it is a deliberately LOSSY summary of the ownership: umbrella.js
  // publishes ONE region per DISTRICT ID and takes only that district's LARGEST traced
  // component, because the landed contract is one element per district id and an ambiguous
  // hit would break five UI suites. So a quarter cut into two lobes publishes one, and two
  // multiplicity instances of one district publish one between them.
  // ⭐ THE GROUND THE PACKER ACTUALLY USED is the PARTITION GRID's owner field, and asked
  // there the same town measures **1 body of 1,005 off its own quarter**. ⭐⭐ THE CLASS:
  // **A UI SUMMARY OF A FACT IS NOT THE FACT, AND A CENSUS THAT MEASURES AGAINST THE SUMMARY
  // REPORTS THE SUMMARY'S LOSSES AS THE SUBJECT'S DEFECTS.**
  // ⚠ AND IT IS NOT VACUOUS, because the packer's own test ran BEFORE three passes that move
  // bodies: the ground law's clipping, the §202 access repair's insets and corridor cuts, and
  // the LOD merge's hulls. This asks the question of the geometry the leaf actually draws.
  /** @type {Map<string, Array<any>>} */ const wash = new Map();
  for (const part of (partition || [])) {
    if (!part || !part.organismKey || !part.polygon || part.polygon.length < 3) continue;
    const list = wash.get(part.organismKey);
    if (list) list.push(part.polygon); else wash.set(part.organismKey, [part.polygon]);
  }
  const inWash = (list, x, y) => {
    for (const w of list) if (pointInPolygon(x, y, w)) return true;
    return false;
  };
  /** @type {Map<string, any>} */ const tally = new Map();
  const seat = (k) => {
    let t = tally.get(k);
    if (!t) { t = { n: 0, out: 0, majOut: 0, clicked: 0, area: 0, body: 0 }; tally.set(k, t); }
    return t;
  };
  const bodies = [];
  for (const p of (parcels || [])) {
    if (merged && merged.has(p.key)) continue;
    if (p.polygon && p.polygon.length >= 3) bodies.push({ key: p.key, org: p.organismKey, poly: p.polygon });
    if (p.backHouse && p.backHouse.length >= 3) bodies.push({ key: `${p.key}#b`, org: p.organismKey, poly: p.backHouse });
  }
  for (const mm of (masses || [])) if (mm.polygon && mm.polygon.length >= 3) bodies.push({ key: mm.key, org: mm.organismKey, poly: mm.polygon });

  for (const b of bodies) {
    if (!b.org || !index.has(b.org)) continue;
    const t = seat(b.org);
    t.n++;
    t.body += absArea(b.poly);
    const c = centroid(b.poly);
    // ARM 1 — the CENTRE stands on its own quarter's ground.
    if (!grid || ownerAt(grid, c[0], c[1]) !== index.get(b.org)) t.out++;
    // ARM 2 — MAJORITY AREA. A body clipped by its own quarter's boundary is not a
    // containment failure; a body sitting a quarter away is.
    //
    // ⛔⛔ AND UNTIL MF-ARCH THIS ARM COUNTED **CORNERS** WHILE ITS OWN NAME AND COMMENT SAID
    // "MAJORITY AREA". A burgage plot is about 4 × 10 units against a partition cell of
    // 1000/128 ≈ 7.8, so a plot spans one to four cells and its four corners routinely land in
    // a distribution its bulk does not share. MEASURED over the b8b corpus: **444 bodies
    // convicted by the corner count, 251 by the true area, 229 bodies where the two disagree**
    // (211 acquitted by area, 18 convicted by it) — the published `zoneMajorityOutside` was
    // over-reporting by 77 %.
    // ⭐ THE CLASS: **A PREDICATE WHOSE NAME SAYS "AREA" AND WHOSE BODY COUNTS VERTICES IS THE
    // §230 DEFECT WITH A DOCSTRING** — and it survived because the comment read as the proof.
    // `latticeAreaShare` clips the body to each cell EXACTLY; nothing here is sampled.
    if (grid) {
      const share = latticeAreaShare(b.poly, grid.cell, (x, y) => ownerAt(grid, x, y), index.get(b.org));
      if (share.share <= 0.5) t.majOut++;
    }
    // ARM 3 (statistic) — does the TRUTH LAYER's click region cover this body at all?
    const w = wash.get(b.org);
    if (w && inWash(w, c[0], c[1])) t.clicked++;
  }
  for (const [k, w] of wash) { let a = 0; for (const poly of w) a += absArea(poly); seat(k).area = a; }

  const BAND = { thorp: [30, 70], hamlet: [20, 55], village: [5, 27], town: [2, 13], city: [1, 11], metropolis: [0.4, 6] };
  const MOD = {
    government: 12, civic: 12, religious: 17, military: 27,
    crafts: -4, industrial: -4, noxious: -4, poor: -3, shadows: -3,
  };
  const band = BAND[tier] || BAND.town;
  /** @type {Array<any>} */ const fill = [];
  let offBand = 0, outside = 0, majorityOutside = 0, clicked = 0, counted = 0;
  /** @type {Array<string>} */ const unwashed = [];
  for (const org of ordered) {
    const t = tally.get(org.key);
    if (!t || !t.n) continue;
    outside += t.out; majorityOutside += t.majOut; clicked += t.clicked; counted += t.n;
    if (!t.area) { unwashed.push(org.key); continue; }
    const open = 100 * Math.max(0, 1 - t.body / t.area);
    const cat = String(org.category || org.character || 'other').toLowerCase();
    let shift = 0;
    for (const k of Object.keys(MOD).sort()) if (cat.indexOf(k) >= 0) { shift = MOD[k]; break; }
    const lo = Math.max(0, band[0] + shift), hi = band[1] + shift;
    // ⚠ A DEMOTED LEAF IS LAWFULLY EMPTIER, AND ONLY WHERE §161g DRAWS THE WORK.
    const inBand = open >= lo && (open <= hi || (demoted && open <= hi * 2.4));
    if (!inBand) offBand++;
    fill.push({
      key: org.key, category: cat, bodies: t.n,
      openPct: Math.round(open * 10) / 10, band: [Math.round(lo * 10) / 10, Math.round(hi * 10) / 10],
      verdict: inBand ? 'in' : (open < lo ? 'tight' : 'airy'),
    });
  }
  let unwashedBodies = 0;
  for (const k of unwashed) unwashedBodies += tally.get(k).n;
  return {
    outside, majorityOutside, fill, offBand, unwashed, unwashedBodies,
    clickCoverage: counted > 0 ? Math.round((1000 * clicked) / counted) / 1000 : 1,
    reason: `${counted} bodies: ${outside} off their own quarter's ground (${majorityOutside} by majority area);`
      + ` ${offBand} of ${fill.length} quarters off the fill band for ${tier};`
      + ` the truth layer's click regions cover ${counted > 0 ? Math.round((100 * clicked) / counted) : 100}% of the fabric`
      + (unwashed.length ? ` and ${unwashed.length} quarter(s) with ${unwashedBodies} bodies publish NO region (the landed one-per-district-id contract — see umbrella.js)` : ''),
  };
}

/**
 * ⭐⭐ GAP-B · `radialDensityFalloff` — THE MORPHOLOGY DISCRIMINATOR NO CENSUS COULD SEE.
 *
 * MF-S1 T-03: the centre:edge density ratio separates the morphologies cleanly and measurably
 * — organic 2.5–5.0, planned 1.4–1.9, growth-ring/boom/influx 7–17, demoted 4–5 with a
 * near-zero occupancy beyond the core — and **no law currently names it**. Its value is that
 * it catches "an organic settlement rendered as an even blob", which is a failure no existing
 * census can see because every body in such a leaf is individually lawful.
 *
 * @param {Object} args
 * @returns {{ falloff:number, inner:number, outer:number, band:[number,number], morphology:string, verdict:string, reason:string }}
 */
export function radialDensity(args) {
  const { bodies, centre, extent, morphology, demoted } = args;
  const rIn = extent * 0.34, rOut = extent;
  let inA = 0, outA = 0;
  for (const b of bodies) {
    if (!b.poly || b.poly.length < 3) continue;
    const c = centroid(b.poly);
    const d = Math.sqrt((c[0] - centre.x) ** 2 + (c[1] - centre.y) ** 2);
    if (d <= rIn) inA += absArea(b.poly);
    else if (d <= rOut) outA += absArea(b.poly);
  }
  const inArea = 3.141592653589793 * rIn * rIn;
  const outArea = 3.141592653589793 * (rOut * rOut - rIn * rIn);
  const dIn = inA / Math.max(1, inArea), dOut = outA / Math.max(1, outArea);
  const falloff = dOut > 0 ? dIn / dOut : 0;
  const BAND = {
    planned: [1.4, 1.9], regular: [1.4, 1.9], organic: [2.5, 5.0],
    accreted: [2.5, 5.0], chaotic: [2.5, 5.0], boom: [7, 17],
  };
  const key = String(morphology || 'organic').toLowerCase();
  let band = BAND.organic;
  for (const k of Object.keys(BAND).sort()) if (key.indexOf(k) >= 0) { band = BAND[k]; break; }
  if (demoted) band = [4, 5];
  const verdict = falloff < band[0] ? 'flat' : falloff > band[1] ? 'steep' : 'in';
  return {
    falloff: Math.round(falloff * 100) / 100,
    inner: Math.round(dIn * 1000) / 1000, outer: Math.round(dOut * 1000) / 1000,
    band, morphology: key, verdict,
    reason: `centre:edge built-area density ${Math.round(falloff * 100) / 100} against ${key}'s`
      + ` measured band ${band[0]}–${band[1]} (T-03) — ${verdict}`,
  };
}

/**
 * ⭐⭐ GAP-C · THE STREET WIDTH CLASSES — how many distinct ranks the drawing carries.
 *
 * MF-S1 T-04: the corpus runs **4–5 width classes at ratios ≈ 1 : 1.6 : 2.6 : 4.2 : 6.5**
 * (alley : lane : lateral : arterial : market void), the CLASS COUNT falling with disorder
 * (hf33's chaos drops the arterial class entirely), and the market void present only at
 * town+. b6 measured p97/p50 = 8.5–10.3 against the corpus's 16–30 — about half the depth.
 * This measures the classes the fabric actually emits, in the fabric's own module.
 *
 * @param {Object} args
 * @returns {{ classes:Array<any>, count:number, ratios:number[], p97overP50:number, marketVoid:boolean, reason:string }}
 */
export function streetClasses(args) {
  const { channels, squares, frontage, tier } = args;
  /** @type {Map<string, {rank:string, w:number, n:number, len:number}>} */ const byRank = new Map();
  for (const ch of (channels || [])) {
    const k = String(ch.rank || 'lane');
    let len = 0;
    for (let i = 0; i + 1 < ch.line.length; i++) {
      len += Math.sqrt((ch.line[i + 1][0] - ch.line[i][0]) ** 2 + (ch.line[i + 1][1] - ch.line[i][1]) ** 2);
    }
    const prev = byRank.get(k);
    if (prev) { prev.n++; prev.len += len; prev.w = Math.max(prev.w, ch.width); }
    else byRank.set(k, { rank: k, w: ch.width, n: 1, len });
  }
  // The market void is the widest "channel" on the leaf and it is not a channel at all: it is
  // the square the streets organise around (T-04's own top class).
  let voidW = 0;
  for (const sq of (squares || [])) if (sq.radius) voidW = Math.max(voidW, sq.radius * 2);
  const rows = [...byRank.values()].sort((a, b) => (a.w - b.w) || compareKeys(a.rank, b.rank));
  if (voidW > 0) rows.push({ rank: 'market-void', w: voidW, n: (squares || []).length, len: 0 });
  // ⭐ T-04 COUNTS DISTINCT WIDTH CLASSES, NOT RANK NAMES. The ladder emits ranks that share a
  // width by construction (a quarter lane and a block lane are one carriageway under two
  // names), and counting the names gave 9 "classes" against the corpus's 4–5 — a number about
  // our vocabulary rather than about the drawing. Ranks within 8% of one another are ONE class,
  // and the class takes every rank name that lands in it so nothing is hidden by the merge.
  /** @type {Array<any>} */ const classes = [];
  for (const r of rows) {
    const wf = Math.round((r.w / Math.max(0.01, frontage)) * 100) / 100;
    const last = classes[classes.length - 1];
    if (last && wf <= last.widthInFrontages * 1.08) {
      last.ranks.push(r.rank); last.segments += r.n;
      last.widthInFrontages = Math.max(last.widthInFrontages, wf);
      continue;
    }
    classes.push({ rank: r.rank, ranks: [r.rank], widthInFrontages: wf, segments: r.n });
  }
  const base = classes.length ? classes[0].widthInFrontages : 1;
  const ratios = classes.map((c) => Math.round((c.widthInFrontages / Math.max(0.01, base)) * 100) / 100);
  const widest = classes.length ? classes[classes.length - 1].widthInFrontages : 0;
  const median = classes.length ? classes[Math.floor(classes.length / 2)].widthInFrontages : 1;
  const marketVoid = voidW > 0;
  const townPlus = ['town', 'city', 'metropolis'].indexOf(String(tier)) >= 0;
  return {
    classes, count: classes.length, ratios,
    p97overP50: Math.round((widest / Math.max(0.01, median)) * 100) / 100,
    marketVoid,
    reason: `${classes.length} width classes at ${ratios.join(' : ')} (T-04 target 4–5 at ~1:1.6:2.6:4.2:6.5);`
      + ` market void ${marketVoid ? 'present' : 'ABSENT'}${townPlus ? ' (required at town+)' : ''}`,
  };
}
