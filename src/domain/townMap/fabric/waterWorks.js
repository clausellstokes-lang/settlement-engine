/**
 * domain/townMap/fabric/waterWorks.js — ⭐⭐⭐ THE WATER-COHERENCE MEMBER (chair directive
 * ODQ §195.1, from the owner's forensic zoom of the b4 town).
 *
 * ⛔⛔ THE FINDING WAS ONE SENTENCE WITH SIX FACES: **the water was drawn as a stroke on top
 * of a settlement that had never been told the water was there.** The channel crossed the
 * fabric and the fabric ignored it — houses stood in it, field seams ran under it, the piers
 * of the docks pointed inland, no street that crossed it carried a bridge, and the wall
 * circuit simply stopped when it reached the bank. Every one of those is the same defect:
 * water was a MARK, and it has to be a CLAIM.
 *
 * ⭐⭐ THE CURE IS THE PRIMITIVE THIS FAMILY ALREADY OWNS. A carriageway is forbidden ground
 * that buildings FRONT; a watercourse is forbidden ground that buildings front, that roads
 * CROSS at a named work, that fields STOP at, and that a wall closes against with a water
 * gate. So the water joins the ground law's claim set as a channel of its own width, and
 * this file derives the three works that a crossing implies:
 *
 *   THE BRIDGE   — where a street channel crosses the water, at the crossing itself.
 *   THE QUAY     — the port's piers, rotated to run INTO the water and rooted at the bank
 *                  (§161m's physical absolute: "the port sits ON flowing/harbor water").
 *   THE WATER GATE — where the wall circuit meets the water (§161m.3: the water is the
 *                  fourth wall; the waterfront gets a water gate and lighter works).
 *
 * PURITY: no Date, no Math.random, no runtime trig (the frozen table only), no localeCompare.
 */

import { bearingIndex, distToPolyline } from './fabricGeometry.js';
import { cosI, sinI, TRIG_N } from './trigTable.js';
import { hashUnit } from './fabricRng.js';
import { compareKeys } from './lineage.js';
import { isInWater } from './waterMode.js';
import { segSegClosest } from './reservedGround.js';

/**
 * ⭐⭐⭐ §205 A / G-34 · **THE ONE CROSSING PREDICATE, AND THIS IS ITS ONE HOME** (ODQ §262.2).
 *
 * ⛔⛔ WHAT THIS FILE EXISTS TO END, MEASURED (`laneMFW1-receipt.md` §6.1): `deriveBridges`
 * asked **`crossPoint`** — a true intersection with the water's CENTRELINE — while the cured
 * §205 A census asked **`segSegClosest < half`** — an incursion into the water's BAND. Two
 * modules asked the same geometric question in two spellings, so **the census convicted
 * exactly the crossings the deriver was structurally blind to: 72 of 127 street violations,
 * with 20 more refused by a RANK test and 35 more lost to a `break`.** 92 of 127 — 72% —
 * could not be exempted BY CONSTRUCTION, and no amount of care in either module could have
 * closed that, because neither module was wrong on its own terms.
 *
 * ⭐⭐ THE STRUCTURAL RULE THIS ADOPTS, AND IT IS THE ENFORCEMENT ANALOGUE OF §241.5a's
 * RAW-HANDLE GUARD: **a geometric question gets ONE exported predicate, its consumers may not
 * re-spell it, and the guard sits where the predicate is PUBLISHED rather than where it is
 * read** (a scan over read sites must solve aliasing; a publication guard need not).
 * `tests/lint/waterPredicate.walker.test.js` reds if a second module re-spells this question,
 * and a behavioural pin asserts the deriver and the census see the SAME transit set.
 *
 * ⭐⭐⭐ AND THE UNIT OF THE ANSWER IS A **RUN**, NOT A SEGMENT AND NOT A CHANNEL. This lane
 * sized all three and only the run survives contact with the corpus:
 *   · asked of a SEGMENT, every field seam that grazes its own bank owes a bridge (68 decks
 *     across the corpus against 15, five of them under block seams);
 *   · asked of a CHANNEL, a high street that crosses once and then runs 200 units along the
 *     bank owes decks over the whole of that run;
 *   · asked of a RUN — one continuous stretch of street inside the claim — all three of the
 *     chair's arms fall out at once, and **a street meeting a meander twice has TWO runs and
 *     therefore TWO bridges**, which is §262.2(c) ("fix the loop") as a consequence of the
 *     formulation rather than as a patch.
 *
 * THE FOUR VERDICTS, and each is a fact about geometry rather than a threshold:
 *   TRANSIT     the run enters from one bank and leaves on the OTHER — it gets to the far
 *               side, so it owes a crossing work. ⭐ §262.2(b): WHAT work is a question of
 *               RANK (a passage earns a plank, not an arterial bridge); WHETHER it owes one
 *               is a question of geometry, and a rank test may never answer it.
 *   BANKSIDE    the run enters and leaves on the SAME bank. It crosses nothing.
 *               ⭐ §262.2(e)'s LAWFUL EXEMPTION, named in the census, never a silent pass.
 *   IN-CHANNEL  the run has dry ground on NEITHER side — the line lies in the water. Neither
 *               adjacency nor transit; convicted.
 *   OPEN-WATER  (coast only) the run reaches the sea BODY beyond the strand.
 *
 * ⚠⚠ AND THE COAST IS A DIFFERENT ANIMAL, WHICH IS THE WHOLE OF §262.2(e). `waterClaims`
 * already says it in terms: a coast's claim is **"the strand between the ink of the shoreline
 * and the dry ground, which is where a hut on the beach would stand"** — the STRAND, not the
 * sea. **A COAST HAS ONE BANK.** A quay street, a shore road or a slipway on the strand
 * crosses nothing and can never reach a far side, so it is BANKSIDE by construction rather
 * than by tolerance. MEASURED: `street.road.approach.corridor.2~frame.2` scores **775
 * "crossings" on `city` and 555 on `fjord`** with **every one of its points inside the strand
 * and none of them beyond it** — it does not cross the shore, it IS the shore.
 * ⛔ What the coast branch does NOT forgive is a road in the SEA: `city` and `migration` each
 * carry three roads reaching **143 units past the strand into open water** (visible on the
 * plate as the wall and the high street striding across the bay), and those stay convicted
 * under their own name. **THE CURE IS NOT TO CONVICT LESS.**
 */
export const WATER_MEETING = Object.freeze({
  TRANSIT: 'transit',
  BANKSIDE: 'bankside',
  IN_CHANNEL: 'in-channel',
  OPEN_WATER: 'open-water',
});

/**
 * The point ON THE WATER nearest (px,py), with the water's local run there.
 * ⚠ THE POINT MUST BE TAKEN ON THE WATER AND `segSegClosest` CANNOT BE ASKED FOR IT.
 * That function returns the point on its FIRST segment by contract ("the caller asks about
 * AB"), so calling it with a degenerate first segment hands back the query point itself —
 * and every side test then reads `sign(0) = 0` and classifies the whole corpus IN-CHANNEL.
 * This lane wrote that bug and the simulation caught it; the note stays so nobody rewrites it.
 */
function nearestOnWater(px, py, line) {
  let best = Infinity, qx = 0, qy = 0, wx = 1, wy = 0;
  for (let i = 0; i + 1 < line.length; i++) {
    const ax = line[i][0], ay = line[i][1], bx = line[i + 1][0], by = line[i + 1][1];
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
    let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const cx = ax + dx * t, cy = ay + dy * t;
    const d = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
    if (d < best) { best = d; qx = cx; qy = cy; wx = dx; wy = dy; }
  }
  return { d: best, qx, qy, wx, wy };
}

/**
 * ⭐ HOW A LINE MEETS THE WATER — the ONE answer both the bridge deriver and the §205 A census
 * consume. Returns the maximal runs of contiguous incursion segments, each with its verdict.
 *
 * @param {Array<[number,number]>} line the channel's own polyline
 * @param {any} rel the water relationship
 * @returns {{ inside:number, runs:Array<{from:number,to:number,verdict:string,at:{x:number,y:number,wx:number,wy:number},segs:Array<any>}> }}
 */
export function waterMeetings(line, rel) {
  if (!rel || !rel.line || rel.line.length < 2 || !line || line.length < 2) return { inside: 0, runs: [] };
  const half = (rel.width || 0) * 0.5;
  // ── THE INCURSION TEST IS THE CENSUS'S OWN, UNCHANGED: the closest approach of the two
  //    segments, which answers "is this a meeting" and "where" from ONE computation.
  /** @type {Array<any>} */ const seg = [];
  let inside = 0;
  for (let k = 0; k + 1 < line.length; k++) {
    let best = Infinity, x = 0, y = 0, wx = 0, wy = 0;
    for (let i = 0; i + 1 < rel.line.length; i++) {
      const c = segSegClosest(
        line[k][0], line[k][1], line[k + 1][0], line[k + 1][1],
        rel.line[i][0], rel.line[i][1], rel.line[i + 1][0], rel.line[i + 1][1],
      );
      if (c.d < best) {
        best = c.d; x = c.x; y = c.y;
        wx = rel.line[i + 1][0] - rel.line[i][0]; wy = rel.line[i + 1][1] - rel.line[i][1];
      }
    }
    const hit = best < half;
    if (hit) inside++;
    seg.push({ k, inside: hit, d: best, x, y, wx, wy });
  }
  // ⚠ THE SIDE OF A VERTEX IS ASKED ONLY WHERE IT IS NEEDED. Walking every vertex would
  // double the census's own cost for an answer that only the first DRY vertex either side of
  // a run can give; the scan below stops at that vertex.
  const sideAt = (v) => {
    const p = line[v];
    const n = nearestOnWater(p[0], p[1], rel.line);
    if (n.d < half) return 0;
    return Math.sign(n.wx * (p[1] - n.qy) - n.wy * (p[0] - n.qx)) || 0;
  };
  /** @type {Array<any>} */ const runs = [];
  let k = 0;
  while (k < seg.length) {
    if (!seg[k].inside) { k++; continue; }
    let j = k;
    while (j + 1 < seg.length && seg[j + 1].inside) j++;
    let before = 0;
    for (let v = k; v >= 0; v--) { const s = sideAt(v); if (s) { before = s; break; } }
    let after = 0;
    for (let v = j + 1; v < line.length; v++) { const s = sideAt(v); if (s) { after = s; break; } }
    let verdict;
    if (rel.kind === 'coast') {
      // A COAST HAS ONE BANK: the strand is walkable ground, the sea beyond it is not.
      let beyond = false;
      for (let v = k; v <= j + 1 && v < line.length; v++) {
        const p = line[v];
        if (!isInWater(rel, p[0], p[1])) continue;
        if (nearestOnWater(p[0], p[1], rel.line).d >= half) { beyond = true; break; }
      }
      verdict = beyond ? WATER_MEETING.OPEN_WATER : WATER_MEETING.BANKSIDE;
    } else if (before && after && before !== after) verdict = WATER_MEETING.TRANSIT;
    else if (before || after) verdict = WATER_MEETING.BANKSIDE;
    else verdict = WATER_MEETING.IN_CHANNEL;
    const segs = seg.slice(k, j + 1);
    const mid = segs[Math.floor(segs.length / 2)];
    runs.push({ from: k, to: j, verdict, at: { x: mid.x, y: mid.y, wx: mid.wx, wy: mid.wy }, segs });
    k = j + 1;
  }
  return { inside, runs };
}

/**
 * ⭐ HOW FAR A DECK REACHES — the SECOND question this pair used to spell twice, in the same
 * two modules (`deriveBridges`' uncovered second pass and the census's `decks` radius carried
 * the identical arithmetic). One home, one spelling.
 * @param {{span?:number, width?:number}} deck @param {number} frontage
 */
export function deckReach(deck, frontage) {
  return Math.max(deck.span || 0, deck.width || 0) * 0.75 + frontage * 0.6;
}

/** Is any segment of this run under a deck (or inside a water gate's arch)? */
export function runIsCovered(run, decks, gates, frontage) {
  for (const s of run.segs) {
    for (const d of decks) {
      const r = deckReach(d, frontage);
      if ((s.x - d.x) * (s.x - d.x) + (s.y - d.y) * (s.y - d.y) < r * r) return true;
    }
    for (const g of (gates || [])) {
      const r = frontage * 2.2;
      if ((s.x - g.x) * (s.x - g.x) + (s.y - g.y) * (s.y - g.y) < r * r) return true;
    }
  }
  return false;
}

/**
 * ⭐ THE WATER AS A CLAIM. Returns the carriageway-shaped segment list the ground law
 * understands, so a footprint standing in the river is clipped to the bank exactly as one
 * standing in the high street is clipped to the kerb — and for the same reason: the bank is
 * where the building stops, and a building clipped to it has its wall ON the water, which is
 * what a waterfront is.
 *
 * ⚠ THE WIDTH IS THE DRAWN WIDTH, NOT A MARGIN. Widening it here would push the town off
 * its own river, and §5.0b's BANKSIDE mode is precisely a town whose yards run to the bank.
 *
 * @param {any} rel  the water relationship
 * @returns {Array<{ line:Array<[number,number]>, width:number, rank:string, key:string }>}
 */
export function waterClaims(rel) {
  if (!rel || !rel.line) return [];
  if (rel.kind === 'river') {
    return [{ line: rel.line, width: rel.width, rank: 'water', key: 'water.channel' }];
  }
  // ⭐⭐⭐ §205 A · THE COAST CLAIMS ITS SHORE, AND MF-B7 MEASURED THE HOLE THIS CLOSES.
  //
  // ⛔ "0 drawn bodies stand in a drawn river channel on any leaf — BUT THE CLAIM IS EMPTY ON
  // THREE OF EIGHT WATERED LEAVES." MEASURED: city / fjord / migration each DRAW a water edge
  // 10.0 units wide and CLAIM 0.0, because this function returned `[]` for anything that was
  // not a river. Nothing stood in it at those seeds and nothing was stopping anything from
  // standing in it. ⭐ THE CLASS, and it is this programme's dominant one, third instance:
  // **A DRAWN SURFACE WITH NO CLAIM IS A SURFACE NO LAW GOVERNS** — the wall was the first,
  // the coast is the third.
  //
  // ⚠ THE SEA BODY WAS NEVER UNGOVERNED — `isInWater` refuses it to the packer as an
  // ABSOLUTE. What was ungoverned is the DRAWN SHORE ITSELF: the strand between the ink of
  // the shoreline and the dry ground, which is where a hut on the beach would stand. So the
  // claim is exactly the drawn edge's own width and no more, because widening it would push
  // a coastal town off its own working waterfront — which is the whole of §5.0b's BANKSIDE.
  if (rel.kind === 'coast') {
    return [{ line: rel.line, width: rel.width, rank: 'water', key: 'water.shore' }];
  }
  return [];
}

/**
 * ⭐⭐ THE BRIDGES (§2.3 continuity, §5.0b.1). A street that crosses the water and carries no
 * bridge is a street that says the town fords its own river at every lane. The crossings are
 * found on the DRAWN channel set, so a bridge exists exactly where the reader can see one is
 * needed, and the deck is drawn at the crossing channel's own width — a bridge is as wide as
 * the road that wanted it.
 *
 * ⚠ ONE BRIDGE PER CROSSING, AND THE CROSSINGS ARE DE-DUPLICATED BY DISTANCE. Two channels
 * that meet at the bank both cross within a few units of one another; drawing both would put
 * two decks on one pier line. The survivor is the WIDER channel — the road that paid for it.
 *
 * @param {Object} args
 * @param {any} args.rel
 * @param {Array<any>} args.channels
 * @param {number} args.frontage
 * @returns {{ bridges:Array<any>, reason:string }}
 */
export function deriveBridges(args) {
  const { rel, channels, frontage } = args;
  if (!rel || !rel.line || rel.line.length < 2) {
    return { bridges: [], meetings: new Map(), reason: 'no watercourse to cross' };
  }
  /** @type {Array<any>} */ const found = [];
  /** @type {Map<string, any>} */ const meetings = new Map();
  const ordered = channels.slice().sort((a, b) => compareKeys(String(a.key || a.rank), String(b.key || b.rank)));
  for (const ch of ordered) {
    // ⭐⭐⭐ §262.2(a) · THE PREDICATE IS ASKED IN ONE PLACE AND THE ANSWER IS CARRIED OUT, so
    // the census cannot be handed a different reading of the same two lines. `meetings` is
    // this computation, not a second one (see waterWorks' header, and the equivalence pin).
    const m = waterMeetings(ch.line, rel);
    if (!m.runs.length) continue;
    meetings.set(String(ch.key || ch.rank), m);
    for (const run of m.runs) {
      // ⭐⭐ §262.2(b) · NO RANK MAY REFUSE A CROSSING. The old line here was
      // `if (ch.rank === 'passage') continue;` — "a person-wide gap does not bridge" — and it
      // is a RANK test standing where a GEOMETRY test belongs. A passage that gets to the far
      // bank got there over something; rank decides WHAT that something is (below), never
      // WHETHER it exists. ⚠ MEASURED ON THIS CORPUS: all 20 passage convictions turn out to
      // be BANKSIDE — none of them actually crosses — so removing the refusal moves no leaf
      // here. The refusal is removed anyway because it was answering the wrong question, and
      // `townMapFabricBuildOut` carries a PLANTED passage that truly transits and must earn a
      // plank; without that fixture this arm would be unreachable and the pin vacuous.
      // ⭐⭐ §262.2(c) · AND THE LOOP NO LONGER `break`s. The old code took the FIRST crossing
      // per channel and stopped — a street that meets a meander twice got one bridge and the
      // census convicted the other crossing forever (35 violations). Every TRANSIT run earns
      // its own candidate deck; the de-duplication below still merges works that would stand
      // on one pier line.
      if (run.verdict !== WATER_MEETING.TRANSIT) continue;
      const a = ch.line[run.from], b = ch.line[run.from + 1];
      found.push({
        x: run.at.x, y: run.at.y,
        // The deck runs along the ROAD, so its bearing is the road's, and its span crosses
        // the channel — which is why the two bearings are kept separately.
        along: bearingIndex(b[0] - a[0], b[1] - a[1]),
        across: bearingIndex(run.at.wx, run.at.wy),
        width: ch.width,
        span: rel.width,
        rank: ch.rank,
        // ⭐ THE WORK IS SCALED TO THE ROAD THAT WANTED IT (§262.2(b)): a plank is a real
        // thing a town builds, and cloning the arterial bridge across a person-wide gap would
        // be as wrong as refusing the crossing altogether.
        kind: deckKindFor(ch.rank),
        key: `bridge|${ch.key || ch.rank}|${run.from}`,
      });
    }
  }
  // De-duplicate by distance: the wider road keeps the bridge.
  found.sort((p, q) => (q.width - p.width) || compareKeys(p.key, q.key));
  /** @type {Array<any>} */ const bridges = [];
  const apart = Math.max(rel.width * 1.6, frontage * 3);
  for (const f of found) {
    let clash = false;
    for (const k of bridges) {
      if (Math.sqrt((f.x - k.x) * (f.x - k.x) + (f.y - k.y) * (f.y - k.y)) < apart) { clash = true; break; }
    }
    if (!clash) bridges.push(f);
  }
  // ⭐⭐⭐ §205 A · EVERY CROSSING CARRIES A NAMED WORK, AND THE DE-DUPLICATION USED TO LOSE
  // SOME. MEASURED this wave by walking the water claim against the DRAWN channel set: the
  // town's channel carried 21 channel vertices, 43 seam vertices and 28 quarter-lane vertices
  // INSIDE the water, with only three bridges to account for them — six streets crossing the
  // river on nothing. They were invisible to every census this family owns because each of
  // those censuses asks about FILLED BODIES, and a street is a claim rather than a body.
  // ⭐ THE CLASS: **TWO RESERVED SURFACES CAN OCCUPY THE SAME GROUND AND NEITHER SURFACE'S
  // CENSUS IS LOOKING FOR THE OTHER.**
  // ⚠ THE CURE IS A BRIDGE, NEVER A TRIM. Cutting the channel at the bank would sever the
  // street web across its own river and red §201 B's orphan census for a reason that is not a
  // defect — a town on a river has streets on both banks and they are connected. So a crossing
  // the de-duplication did not cover gets its OWN deck: the second pass re-walks the raw
  // crossings and admits any that no surviving deck reaches.
  for (const f of found) {
    let covered = false;
    for (const k of bridges) {
      const r = deckReach(k, frontage);
      if ((f.x - k.x) ** 2 + (f.y - k.y) ** 2 < r * r) { covered = true; break; }
    }
    if (!covered) bridges.push({ ...f, secondPass: true });
  }
  bridges.sort((p, q) => compareKeys(p.key, q.key));
  const byKind = {};
  for (const b of bridges) byKind[b.kind] = (byKind[b.kind] || 0) + 1;
  return {
    bridges,
    meetings,
    reason: `${bridges.length} crossing work${bridges.length === 1 ? '' : 's'} where a street TRANSITS the water`
      + ` (${found.length} transit runs, de-duplicated at ${Math.round(apart)} units — the wider road keeps the deck);`
      + ` ${Object.keys(byKind).sort().map((k) => `${k} ${byKind[k]}`).join(', ') || 'none'}`,
  };
}

/**
 * ⭐ §262.2(b) · THE WORK A RANK EARNS. The corpus does not draw one bridge primitive: a
 * cart road gets a decked bridge, a lane a footbridge, a person-wide gap a plank laid across.
 * Rank answers WHAT is built; only geometry answers WHETHER (see `deriveBridges`).
 * @param {string} rank @returns {string}
 */
export function deckKindFor(rank) {
  if (rank === 'passage') return 'plank';
  if (rank === 'alley' || rank === 'lane' || rank === 'blockLane' || rank === 'blockCross' || rank === 'seam') return 'footbridge';
  return 'bridge';
}

/** Where segment a→b crosses the polyline, with the polyline's local direction there.
 *  ⚠ THE CIRCUIT'S OWN QUESTION, AND IT IS NOT THE STREET'S. A wall is a closed ring that the
 *  water CUTS; the gate stands at the cut, which is a true centreline intersection and
 *  nothing else. `waterMeetings` answers a different question — how a street's run relates to
 *  the claim — and giving the wall that answer would put a water gate wherever the curtain
 *  merely grazed the bank. The two are kept apart deliberately, and the walker test names
 *  this function as the ONE lawful centreline-intersection spelling in the fabric. */
function crossPoint(a, b, line) {
  for (let i = 0; i + 1 < line.length; i++) {
    const c = line[i], d = line[i + 1];
    const r0 = b[0] - a[0], r1 = b[1] - a[1], s0 = d[0] - c[0], s1 = d[1] - c[1];
    const den = r0 * s1 - r1 * s0;
    if (den === 0) continue;
    const t = ((c[0] - a[0]) * s1 - (c[1] - a[1]) * s0) / den;
    const u = ((c[0] - a[0]) * r1 - (c[1] - a[1]) * r0) / den;
    if (t < 0 || t > 1 || u < 0 || u > 1) continue;
    return { x: a[0] + r0 * t, y: a[1] + r1 * t, wx: s0, wy: s1 };
  }
  return null;
}

/**
 * ⭐⭐⭐ THE QUAY (§161m PHYSICAL ABSOLUTE: "the port sits ON flowing/harbor water").
 *
 * ⛔ MEASURED DEFECT: the port archetype draws its piers as a rank of long thin solids about
 * the anchor, and the anchor was rotated by the same free hash as every other institution —
 * so the pier bars stood INLAND, broadside to the water they exist to reach. That is a
 * physical absolute violated AT RENDER, which is the §195.0 class in a second costume: the
 * absolute was enforced on the ANCHOR and the drawing is made of something else.
 *
 * ⭐ THE CURE: a water-bound institution's rotation is the bearing TOWARD the water and its
 * anchor is pulled to the bank, so the piers run out from the shore into the channel. The
 * general rotation rule (front the street) does not apply to it — a quay answers to the
 * water, and where the two disagree the physical absolute wins (§161m's own precedence).
 *
 * @param {Object} args
 * @param {Array<any>} args.landmarks
 * @param {any} args.rel
 * @returns {{ moored:number, reason:string }}
 */
export function moorWaterBound(args) {
  const { landmarks, rel } = args;
  if (!rel || !rel.line) return { moored: 0, reason: 'no water: nothing to moor' };
  let moored = 0;
  const ordered = landmarks.slice().sort((a, b) => compareKeys(String(a.instanceKey), String(b.instanceKey)));
  for (const lm of ordered) {
    if (!WATER_BOUND.has(lm.archetype)) continue;
    const near = nearestOnLine(lm.x, lm.y, rel.line);
    if (!near) continue;
    // The bearing from the bank INTO the water — the piers' own direction. For a river the
    // water is the channel itself, so "into" is the perpendicular toward the wet side.
    let nx = -(near.dy), ny = near.dx;
    const l = Math.sqrt(nx * nx + ny * ny) || 1;
    nx /= l; ny /= l;
    // Which perpendicular actually reaches water? Probe both; the wet one wins. A coast
    // answers by its body, a river by its own half-width.
    // ⚠ THE PROBE MUST LAND INSIDE THE CHANNEL. The first spelling probed at 0.75 × width
    // from the centreline while the wet test is 0.6 × width — so every probe overshot the
    // far bank and no port on the corpus was ever found to be near water. ⭐ THE CLASS: a
    // PROBE and a PREDICATE measured in the same units still disagree if the probe steps
    // past the predicate's own reach.
    const probe = Math.max(2, rel.width * 0.35);
    const wetA = wetAt(rel, near.qx + nx * probe, near.qy + ny * probe);
    const wetB = wetAt(rel, near.qx - nx * probe, near.qy - ny * probe);
    if (!wetA && wetB) { nx = -nx; ny = -ny; }
    if (!wetA && !wetB) continue;                        // no water within a probe: leave it
    // ⭐ THE ROOT IS AT THE BANK. The arrangement is centred on the anchor, so the anchor
    // sits half a pier's length back from the water's edge and the piers reach across it.
    const back = lm.size * 1.1;
    lm.x = near.qx - nx * back * 0.35;
    lm.y = near.qy - ny * back * 0.35;
    // The arrangement's own +y axis is the pier's long axis, so the rotation that points the
    // piers along (nx, ny) is that bearing less a quarter turn.
    lm.rot = ((bearingIndex(nx, ny) - TRIG_N / 4) % TRIG_N + TRIG_N) % TRIG_N;
    lm.fronts = 'water';
    lm.frontRank = 'water';
    lm.frontReason = '§161m physical absolute: a quay answers to the water, not to a street';
    moored++;
  }
  return {
    moored,
    reason: `${moored} water-bound institutions moored: rotation and anchor derive from the bank,`
      + ' so the piers run INTO the channel (§161m physical absolute outranks the fronting rule)',
  };
}

/** The archetypes §161m binds to water ABSOLUTELY. A mill is here because its race is the
 *  reason it exists; the §161c ring already put it at the water and this points it at it. */
export const WATER_BOUND = new Set(['port', 'mill']);

function wetAt(rel, x, y) {
  if (rel.kind === 'coast') return isInWater(rel, x, y);
  return distToPolyline(x, y, rel.line) <= rel.width * 0.6;
}

/** Centroid of a ring — the field's own middle, for choosing the splitting segment. */
function centroidOf(poly) {
  let x = 0, y = 0;
  for (const p of poly) { x += p[0]; y += p[1]; }
  return [x / poly.length, y / poly.length];
}

function nearestOnLine(px, py, line) {
  if (Array.isArray(px)) { py = px[1]; px = px[0]; }
  let best = null, bd = Infinity;
  for (let i = 0; i + 1 < line.length; i++) {
    const ax = line[i][0], ay = line[i][1], bx = line[i + 1][0], by = line[i + 1][1];
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
    let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const qx = ax + dx * t, qy = ay + dy * t;
    const d = Math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
    if (d < bd) { bd = d; best = { qx, qy, dx, dy, d }; }
  }
  return best;
}

/**
 * ⭐⭐ THE WATER GATE (§161m.3). Where the wall circuit meets the water it does not simply
 * stop: it closes with a water gate, and where the circuit CROSSES the channel the crossing
 * is a marked work — a grated arch, not an absence of ink. The b4 leaf had the circuit
 * dead-ending at the bank, which reads as an unfinished drawing rather than as a decision.
 *
 * @param {Object} args
 * @param {Array<any>} args.walls
 * @param {any} args.rel
 * @param {{seed:string|number}} args.seeding
 * @returns {{ gates:number, reason:string }}
 */
export function deriveWaterGates(args) {
  const { walls, rel, seeding } = args;
  // ⚠ THE SPACING IS THE CIRCUIT'S, NOT THE CHANNEL'S. A river crosses a circuit once or
  // twice; a traced SHORELINE weaves in and out of it many times, and spacing the gates at
  // 2.4 river-widths minted TEN water gates on the coastal city. A gate is a fact about the
  // circuit, so its spacing is a fraction of the circuit's own extent.
  const apart = Math.max(rel.width * 2.4, (args.extent || 0) * 0.55);
  if (!rel || !rel.line || !walls || !walls.length) {
    return { gates: 0, reason: 'no circuit or no water: no water gate' };
  }
  let gates = 0;
  for (const ring of walls) {
    if (!ring.polygon || ring.polygon.length < 3) continue;
    /** @type {Array<any>} */ const wg = [];
    for (let i = 0; i < ring.polygon.length; i++) {
      const a = ring.polygon[i], b = ring.polygon[(i + 1) % ring.polygon.length];
      const hit = crossPoint(a, b, rel.line);
      if (!hit) continue;
      // Not two water gates within a circuit's own tower spacing.
      let clash = false;
      for (const g of wg) if (Math.sqrt((g.x - hit.x) ** 2 + (g.y - hit.y) ** 2) < apart) clash = true;
      if (clash) continue;
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const l = Math.sqrt(dx * dx + dy * dy) || 1;
      wg.push({
        x: hit.x, y: hit.y, dx: dx / l, dy: dy / l,
        span: rel.width,
        // ⭐ THE GRATE IS AN ORDER READ, exactly like the §5.0e wall-foot tell: a town that
        // still expects a siege bars its water gate; a long-peaceful one leaves the arch open.
        grated: hashUnit(`${seeding.seed}|watergate|${Math.round(hit.x)}|${Math.round(hit.y)}`) < 0.62,
      });
    }
    ring.waterGates = wg;
    gates += wg.length;
  }
  return {
    gates,
    reason: gates
      ? `${gates} water gate${gates === 1 ? '' : 's'} where the circuit crosses the channel — the wall closes against the water rather than stopping at it (§161m.3)`
      : 'the circuit never meets the water: no water gate is owed',
  };
}

/**
 * ⭐⭐ THE FIELD EDGE IS THE BANK (§195.1: "water BOUNDS field parcels"). A furlong whose
 * seams run under the river tells the reader the ploughman worked the channel. Every land
 * and hedge is clipped to the dry side of the water.
 *
 * ⚠ IT CLIPS, IT DOES NOT CULL. A field that meets the river keeps the part of itself on the
 * bank — which is what a riverside furlong looks like, and culling it would open a bare
 * collar along every watercourse (the same defect the §16.1 contiguity law forbids).
 *
 * @param {Object} args
 * @param {any} args.fields
 * @param {any} args.rel
 * @returns {{ clipped:number, dropped:number, reason:string }}
 */
export function clipFieldsToWater(args) {
  const { fields, rel } = args;
  if (!rel || !rel.line || !fields) return { clipped: 0, dropped: 0, reason: 'no water: fields unbounded by it' };
  const half = rel.kind === 'river' ? rel.width * 0.5 : 0;
  let clipped = 0, dropped = 0;

  // ⚠ THE SEGMENT INDEX IS LOAD-BEARING, in the same way MF-B4's ringIndex and segmentHash
  // are. This predicate runs over every densified vertex of every field parcel — MEASURED,
  // ~5 million polyline distance evaluations per leaf against a 289-segment meandering
  // channel, which alone took a leaf from 0.35 s to 1.1 s. The index is EXACT: a segment
  // whose bucket the query does not touch cannot be within `half` of it.
  const cell = Math.max(8, half * 2);
  /** @type {Map<string, Array<number>>} */ const segGrid = new Map();
  const segs = [];
  for (let i = 0; i + 1 < rel.line.length; i++) segs.push([rel.line[i], rel.line[i + 1]]);
  segs.forEach(([a, b], i) => {
    const x0 = Math.min(a[0], b[0]) - half, x1 = Math.max(a[0], b[0]) + half;
    const y0 = Math.min(a[1], b[1]) - half, y1 = Math.max(a[1], b[1]) + half;
    for (let gx = Math.floor(x0 / cell); gx <= Math.floor(x1 / cell); gx++) {
      for (let gy = Math.floor(y0 / cell); gy <= Math.floor(y1 / cell); gy++) {
        const k = `${gx}|${gy}`; const v = segGrid.get(k); if (v) v.push(i); else segGrid.set(k, [i]);
      }
    }
  });
  const nearRiver = (x, y) => {
    const b = segGrid.get(`${Math.floor(x / cell)}|${Math.floor(y / cell)}`);
    if (!b) return false;
    for (const i of b) {
      const [a, c] = segs[i];
      const dx = c[0] - a[0], dy = c[1] - a[1], L = dx * dx + dy * dy;
      let t = L > 0 ? ((x - a[0]) * dx + (y - a[1]) * dy) / L : 0;
      if (t < 0) t = 0; else if (t > 1) t = 1;
      const qx = x - a[0] - dx * t, qy = y - a[1] - dy * t;
      if (qx * qx + qy * qy < half * half) return true;
    }
    return false;
  };
  const wet = (x, y) => (rel.kind === 'coast' ? isInWater(rel, x, y) : nearRiver(x, y));
  /** Clip a polygon to the DRY side by walking its edges and cutting at the bank. */
  const clipDry = (poly) => {
    /** @type {Array<[number,number]>} */ const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const aw = wet(a[0], a[1]), bw = wet(b[0], b[1]);
      if (!aw) out.push(a);
      if (aw !== bw) {
        // Bisect to the bank — a bounded, fixed number of steps, never to a tolerance.
        let lo = 0, hi = 1;
        for (let k = 0; k < 8; k++) {
          const m = (lo + hi) / 2;
          const mx = a[0] + (b[0] - a[0]) * m, my = a[1] + (b[1] - a[1]) * m;
          if (wet(mx, my) === aw) lo = m; else hi = m;
        }
        const t = (lo + hi) / 2;
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out;
  };

  // ⛔⛔ A PREDICATE ASKED AT THE CORNERS IS NOT A PREDICATE ABOUT THE FIELD (the §190a class
  // again, on a different shape). A furlong is far wider than a channel, so a river can run
  // clean through the middle of one with all four corners bone dry — which is EXACTLY what
  // the chair's zoom saw: field seams continuing under the water. The test walks the EDGES
  // at a pitch finer than the channel's own width, so a crossing cannot hide between corners.
  const pitch = Math.max(2, (rel.kind === 'river' ? rel.width : 12) * 0.5);
  const densify = (poly) => {
    /** @type {Array<[number,number]>} */ const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const d = Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
      const n = Math.max(1, Math.min(64, Math.ceil(d / pitch)));
      for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * (k / n), a[1] + (b[1] - a[1]) * (k / n)]);
    }
    return out;
  };

  const kept = [];
  for (const p of fields.parcels) {
    const poly = p.polygon || p.poly;
    if (!poly || poly.length < 3) { kept.push(p); continue; }
    const dense = densify(poly);
    let anyWet = false;
    for (const v of dense) if (wet(v[0], v[1])) { anyWet = true; break; }
    if (!anyWet) { kept.push(p); continue; }
    // ⭐ THE RIVER SPLITS THE FIELD, IT DOES NOT SHAVE IT. A channel through the middle of a
    // furlong leaves land on BOTH banks — clipping to one side would open a bare collar
    // along the far bank, which §16.1's contiguity law forbids as loudly as the defect does.
    const near = nearestOnLine(centroidOf(poly), null, rel.line);
    const pieces = [];
    if (near) {
      const l = Math.sqrt(near.dx * near.dx + near.dy * near.dy) || 1;
      const nx = -near.dy / l, ny = near.dx / l;
      for (const side of [1, -1]) {
        const half = [];
        const dn = densify(poly);
        for (let i = 0; i < dn.length; i++) {
          const a = dn[i], b = dn[(i + 1) % dn.length];
          const da = ((a[0] - near.qx) * nx + (a[1] - near.qy) * ny) * side;
          const db = ((b[0] - near.qx) * nx + (b[1] - near.qy) * ny) * side;
          if (da >= 0) half.push(a);
          if ((da >= 0) !== (db >= 0)) {
            const t = da / (da - db);
            half.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
          }
        }
        if (half.length >= 3) pieces.push(half);
      }
    }
    const sources = pieces.length ? pieces : [densify(poly)];
    let survived = 0;
    for (let pi = 0; pi < sources.length; pi++) {
      const cut = clipDry(sources[pi]);
      if (cut.length < 3) continue;
      survived++;
      kept.push(pi === 0 ? Object.assign(p, p.polygon ? { polygon: cut } : { poly: cut })
        : { ...p, key: `${p.key}#bank${pi}`, polygon: cut });
    }
    if (survived) clipped++; else dropped++;
  }
  fields.parcels = kept;

  // The hedges and furrows are lines, so they are TRUNCATED at the bank rather than clipped.
  const dryLine = (line) => {
    /** @type {Array<[number,number]>} */ const out = [];
    for (const v of line) { if (wet(v[0], v[1])) break; out.push(v); }
    return out;
  };
  let hedgesDrowned = 0;
  if (Array.isArray(fields.hedges)) {
    const before = fields.hedges.length;
    fields.hedges = fields.hedges.map(dryLine).filter((l) => l.length >= 2);
    hedgesDrowned = before - fields.hedges.length;
  }
  return {
    clipped,
    dropped,
    hedgesDrowned,
    reason: `${clipped} field parcels clipped to the bank and ${dropped} wholly in the water dropped —`
      + ' a furlong stops at the water, and its seams no longer run under the channel',
  };
}
