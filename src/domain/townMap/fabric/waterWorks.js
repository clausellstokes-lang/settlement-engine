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
import { isInWater, stationAt, widthAt } from './waterMode.js';
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
  // ⭐⭐ REG-BRIDGE · THE INCURSION IS ASKED AT THE LOCAL HALF-WIDTH once a profile exists — a
  // street that grazes a 12-unit headwater and a street that grazes a 23-unit mouth are not the
  // same event, and a nominal half-width calls one of them wrong wherever the taper bites.
  // ⛔ UNARMED, `halfAt` IS NULL AND EVERY LINE BELOW IS THE LINE IT ALWAYS WAS. This predicate
  // decides the whole corpus's TRANSIT set; dormancy here is proved by the branch, not by a
  // float comparison.
  const halfAt = rel.widthProfile ? (x, y) => stationAt(rel, x, y).w * 0.5 : null;
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
    const hit = best < (halfAt ? halfAt(x, y) : half);
    if (hit) inside++;
    seg.push({ k, inside: hit, d: best, x, y, wx, wy });
  }
  // ⚠ THE SIDE OF A VERTEX IS ASKED ONLY WHERE IT IS NEEDED. Walking every vertex would
  // double the census's own cost for an answer that only the first DRY vertex either side of
  // a run can give; the scan below stops at that vertex.
  const sideAt = (v) => {
    const p = line[v];
    const n = nearestOnWater(p[0], p[1], rel.line);
    if (n.d < (halfAt ? halfAt(p[0], p[1]) : half)) return 0;
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
    // ⭐⭐⭐ REG-BRIDGE · THE CLAIM TAPERS WITH THE DRAWING, AND IT IS STILL **ONE** CLAIM.
    //
    // ⛔ WHY THIS SHAPE AND NOT A CLAIM-PER-SEGMENT. §205 A's dominant class is *a drawn surface
    // with no claim is a surface no law governs* — so a river drawn 23 units wide at its mouth
    // while the ground law reserves 16.7 would put buildings IN the drawn water at every wide
    // reach, which is the b4 defect this whole module exists to end, re-minted by its own cure.
    // The obvious fix — return N per-segment claims — reds `townMapFabricBuildOut`'s
    // `expect(claims).toHaveLength(1)`, and that pin is right: a claim is a THING (the channel),
    // not a list of slices of one. So the claim carries its own `widths` and `claimSegments`
    // spends them per segment — which `claimIndex` was already built for, since it sizes its
    // cell from `maxHalf` and grows every segment's box by that segment's own half.
    // ⛔ ABSENT, never undefined-with-a-key, so an unarmed claim is the object it always was.
    const widths = rel.widthProfile ? rel.widthProfile.w : null;
    return [{
      line: rel.line, width: rel.width, rank: 'water', key: 'water.channel',
      ...(widths ? { widths } : {}),
    }];
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
  /** @type {Map<string, {ch:any, run:any}>} */ const site = new Map();
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
        // ⛔⛔ THE NAME `across` LIES, AND REG-5 MEASURED IT TO 0.1° ON ALL 19 DECKS: this is the
        // RIVER'S OWN TANGENT at the crossing (`run.at.wx/wy` is the water segment's direction),
        // not the across-channel direction. It reads as the exact opposite of what it stores.
        // ⚠ RENAMED-IN-PLACE IS NOT AVAILABLE: `across` is a published field of a fabric record.
        // It is kept, correctly spelled beside it as `tangent`, and the census confirmed it has
        // ZERO read sites anywhere in src/, harness/ or tests/ — so the honest field is free.
        across: bearingIndex(run.at.wx, run.at.wy),
        tangent: bearingIndex(run.at.wx, run.at.wy),
        width: ch.width,
        // ⭐⭐ REG-BRIDGE · THE SPAN IS THE RIVER'S WIDTH **WHERE THIS DECK CROSSES**, not the
        // leaf's nominal. This one line is why two decks in the corpus floated in mid-channel:
        // the deck is drawn `2 × max(span·0.85, width·0.9)` long, so a nominal span on a reach
        // 6× the nominal width draws a 30-unit plank across 105 units of water.
        span: widthAt(rel, run.at.x, run.at.y),
        rank: ch.rank,
        // ⭐ THE WORK IS SCALED TO THE ROAD THAT WANTED IT (§262.2(b)): a plank is a real
        // thing a town builds, and cloning the arterial bridge across a person-wide gap would
        // be as wrong as refusing the crossing altogether.
        kind: deckKindFor(ch.rank),
        key: `bridge|${ch.key || ch.rank}|${run.from}`,
      });
      // the deck's own channel and run, kept beside it so the L-REG-31/32 cure can bend the
      // road it belongs to. Keyed rather than carried on the record: a fabric record does not
      // publish a handle to a mutable street.
      site.set(`bridge|${ch.key || ch.rank}|${run.from}`, { ch, run });
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

  // ── ⭐⭐⭐ L-REG-31 / L-REG-32 · THE DECK LAW, ARMED-ONLY ───────────────────────────────────
  // Unarmed, not one line below runs and the record is the record it has always been.
  let sited = 0, refused = 0, moved = 0, kinked = 0;
  /** @type {Record<string, number>} */ const refusedWhy = {};
  if (args.deckLaw === true) {
    const corridor = Number.isFinite(args.corridor) && args.corridor > 0
      ? args.corridor : frontage * 16;
    // ⚠ THE ROAD EDITS ARE COLLECTED AND APPLIED FROM THE END. A channel that meets a meander
    // twice has TWO bridges (§262.2(c)), and splicing the first run shifts every index the
    // second one holds — the exact class of bug the `break` this module removed used to hide.
    /** @type {Map<any, Array<any>>} */ const edits = new Map();
    for (const br of bridges) {
      const s = site.get(br.key);
      if (!s) { refused++; continue; }
      // ⚠ `args.kinkMax` IS A MEASUREMENT HOOK, NOT A FEATURE. It exists so a lane can SWEEP the
      //   kink budget over the corpus and propose the constant from a curve rather than assert it
      //   (the sweep that moved it 0.70 → 3.73 is in the receipt). Absent, `DECK_LAW.kinkMaxTan`
      //   is used and nothing anywhere passes it.
      const best = siteDeck(rel, br, s.ch, s.run, corridor, frontage, args.kinkMax);
      if (!best.ok) {
        refused++;
        // ⭐ THE REFUSAL IS PUBLISHED ON THE RECORD, not only tallied. A deck that keeps its old
        //   geometry must say so where a census will trip over it, or the corpus quietly carries
        //   an uncured deck under a cured wave's name.
        br.deckRefused = { ...best.why };
        for (const k of Object.keys(best.why)) refusedWhy[k] = (refusedWhy[k] || 0) + best.why[k];
        continue;
      }
      sited++;
      if (dist2p(best.P, [br.x, br.y]) > 1e-6) moved++;
      br.x = best.P[0]; br.y = best.P[1];
      // THE DECK IS SQUARE: `along` is the bearing of the shortest wet crossing at this station,
      // which is what "the normal of the river's local tangent" MEANS once you refuse to define
      // the tangent with a window nobody can justify. The road is what bends.
      br.along = best.idx;
      br.tangent = (best.idx + Math.round(TRIG_N / 4)) % TRIG_N;
      br.across = br.tangent;
      br.span = widthAtIndexLocal(rel, best.j);
      // ⭐ THE DECK'S OWN HALF-LENGTH, published so the renderer stops deriving a length from a
      //   width. This is the single field that ends the floating-deck defect.
      br.reach = best.reach;
      br.crossed = best.cross.len;
      br.narrowsCorridor = best.narrowsCorridor;
      br.narrowsAdmissible = best.narrowsAdmissible;
      br.headA = best.headA;
      br.headB = best.headB;
      br.sited = true;
      const list = edits.get(s.ch) || [];
      list.push({ ia: best.ia, ib: best.ib, headA: best.headA, headB: best.headB });
      edits.set(s.ch, list);
    }
    for (const [ch, list] of edits) {
      list.sort((p, q) => q.ia - p.ia);
      // ⭐⭐ THE APPROACH KINKS AT THE BRIDGEHEAD (L-REG-31). The road's wet stretch is replaced
      //    by the deck's own two heads, so the carriageway bends onto a SQUARE deck instead of
      //    the deck being skewed to save the road a bend — which is the law in one splice.
      // ⛔ A NEW ARRAY, NEVER AN IN-PLACE SPLICE. Anything that captured this polyline earlier
      //    in the build keeps what it captured; only the channel record moves forward.
      let line = ch.line;
      for (const e of list) {
        if (e.ia < 0 || e.ib >= line.length || e.ib <= e.ia) continue;
        line = line.slice(0, e.ia + 1).concat([e.headA, e.headB], line.slice(e.ib));
        kinked++;
      }
      ch.line = line;
    }
  }

  const byKind = {};
  for (const b of bridges) byKind[b.kind] = (byKind[b.kind] || 0) + 1;
  return {
    bridges,
    meetings,
    deckLaw: args.deckLaw === true ? { sited, refused, moved, kinked, refusedWhy } : null,
    reason: `${bridges.length} crossing work${bridges.length === 1 ? '' : 's'} where a street TRANSITS the water`
      + (args.deckLaw === true
        ? ` — L-REG-31/32: ${sited} sited at a local narrows and squared to the channel,`
        + ` ${moved} moved, ${kinked} approach roads kinked at the bridgehead,`
        + ` ${refused} refused (no crossing inside the corridor the road could reach)`
        : '')
      + ` (${found.length} transit runs, de-duplicated at ${Math.round(apart)} units — the wider road keeps the deck);`
      + ` ${Object.keys(byKind).sort().map((k) => `${k} ${byKind[k]}`).join(', ') || 'none'}`,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ REG-BRIDGE · L-REG-31 / L-REG-32 — THE DECK LAW AND THE NARROWS (owner §637, chair §641.5)
 *
 * ⛔⛔ THE THREE DEFECTS THIS CURES, ALL MEASURED BY REG-5 ON THE SHIPPED CORPUS:
 *   1. **TWO DECKS TOUCHED NEITHER BANK.** The drawn deck is `2 × max(span·0.85, width·0.9)` and
 *      `span` was the NOMINAL river width, so a deck was a fixed ~1.7× the nominal *whatever
 *      crossing it actually faced*. On `highwater/wallLane…|3` that is a 29.9-unit plank laid
 *      across 105.8 units of water — endpoint clearance −6.94 and −4.07, a plank floating in
 *      mid-channel. Not a tolerance question: a visible ink defect.
 *   2. **FOUR DECKS SAT 19.9–79.7° OFF THE NORMAL**, because the deck simply took the ROAD's
 *      bearing (`along = the road's own first segment`) and a road that meets the water at 60°
 *      got a deck at 60°. L-REG-31 says the opposite: the deck is square and THE ROAD BENDS.
 *   3. **EVERY POINT WAS A LOCAL NARROWS**, so L-REG-32 was not measurable at all. The width
 *      profile is what makes a narrows exist; this is what sites a bridge at one.
 *
 * ⭐⭐ THE ORDER IS RE-SITE → RE-AIM → RE-LENGTH → BEND THE ROAD, and it has to be that order:
 * the aim depends on where the deck ends up, the length depends on the aim, and the road's kink
 * depends on where the deck's two ends finished.
 *
 * ⚠⚠ THE AIM IS TAKEN FROM THE CHANNEL'S OWN WINDOWED TANGENT, **NOT** from a shortest-crossing
 * scan — deliberately, so the census can still convict it. REG-5's census reads the normal
 * window-FREE (the direction of the shortest wet crossing, bisected to 1e-4), and measured that
 * the windowed family swings a census from 15/19 to 8/19 with no change in the drawing. If the
 * cure aimed with the census's own instrument the census would be a tautology; aiming with an
 * independent one leaves it a real test, and a deck that lands outside ±15° is a finding rather
 * than an impossibility.
 *
 * ⚠ THE MOVE IS BOUNDED BY THE ROAD, NOT ONLY BY THE CORRIDOR. §637.1's words are "the shortest
 * point between both banks **within reasonable distance to major roads**", so two bounds apply
 * at once: the corridor says where we may LOOK (J-REG5-BR-1: 3 × the median block dimension, the
 * street web's own scale), and the kink budget says how far the approach can actually REACH
 * without becoming a hairpin. A bridge that moved to a beautiful narrows the road could only
 * meet at 80° would have obeyed one half of the law by breaking the other.
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐ THE TUNING SURFACE — PROPOSED-WITH-RATIONALE; the chair signs. All dimensionless.
 *
 *  abutment      how far past each bank the deck lands, as a fraction of the LOCAL river width.
 *                0.34 is not invented: it is what the fifteen CONFORMING decks in the shipped
 *                corpus already measure (clearance +2.42…+6.13 on a 16.7-unit channel), so the
 *                cured decks keep the look the good ones already had.
 *  abutmentRoad  a floor on the same figure as a fraction of the ROAD's width — a wide arterial
 *                needs a real landing even over a narrow brook.
 *  corridorBlocks  J-REG5-BR-1, ratified §641.2: the corridor half-length is 3 × the median
 *                block dimension. ⚠ "block dimension" is √area, NOT a bbox side — that is the
 *                spelling that reproduces REG-5's own 26.80 / 28.43 / 29.81 to the centimetre.
 *  kinkMaxTan    tan of the sharpest bend an approach may take at the bridgehead.
 *                ⛔⛔ IT IS 3.73 (75°) BECAUSE THE LAW SAYS SO, AND THE FIRST VALUE (0.70 ≈ 35°)
 *                WAS THIS CLAUSE DOING THE CORRIDOR'S JOB. L-REG-31 is explicit that where the
 *                road and the crossing disagree the DECK WINS — *"the approach road kinks at
 *                the bridgehead; the deck is never skewed to save the road a bend"* — so a kink
 *                budget that trades squareness against a road's convenience has inverted the
 *                law it implements. MEASURED on a sweep of the whole river corpus: 35° sites
 *                2 of 8 decks, 55° sites 6, 60° sites 8. The only thing this clause is entitled
 *                to refuse is a road DOUBLING BACK on itself, which is what 75° names. How far
 *                a bridge may move is the CORRIDOR's question (§637.1's "within reasonable
 *                distance to major roads"), and it is answered there.
 *                ⚠ The sweep is not monotone (45° sites fewer than 40°) and that is real, not
 *                noise: loosening the budget admits a BETTER-scoring station which then fails a
 *                different clause. A constant chosen off a single reading of a non-monotone
 *                curve would have been chosen off an accident.
 *  window        the arc window, in local widths, the river's tangent is read over. Matches the
 *                profile's own window — one reading of "which way the river runs here".
 *  reachCap      how far a crossing walk may go, in local widths, before it reports NO CROSSING.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const DECK_LAW = Object.freeze({
  abutment: 0.34,
  abutmentRoad: 0.5,
  corridorBlocks: 3,
  kinkMaxTan: 3.73,
  window: 1.5,
  reachCap: 14,
});

/** The channel's own tangent at vertex `j`, read over a `DECK_LAW.window`-wide arc. */
function riverTangent(rel, j) {
  const line = rel.line, n = line.length;
  const win = widthAtIndexLocal(rel, j) * DECK_LAW.window;
  let a = j, b = j, back = 0, fwd = 0;
  while (a > 0 && back < win) { back += dist2p(line[a], line[a - 1]); a--; }
  while (b < n - 1 && fwd < win) { fwd += dist2p(line[b], line[b + 1]); b++; }
  let tx = line[b][0] - line[a][0], ty = line[b][1] - line[a][1];
  const l = Math.sqrt(tx * tx + ty * ty);
  return l > 1e-9 ? [tx / l, ty / l] : [1, 0];
}

function dist2p(p, q) { return Math.sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2); }

/** The local width at a vertex index — `widthAtIndex`'s job, kept local so waterWorks does not
 *  grow a second import for one lookup. */
function widthAtIndexLocal(rel, j) {
  const p = rel.widthProfile;
  return p && p.w && j >= 0 && j < p.w.length ? p.w[j] : rel.width;
}

/**
 * ⭐⭐ THE CROSSING A DECK ACTUALLY HAS TO MAKE. Walks out from (x,y) both ways along (ux,uy)
 * until the water ends, bisecting the last wet→dry interval.
 *
 * ⛔⛔ THE BISECTION IS NOT AN OPTIMIZATION, IT IS THE INSTRUMENT'S CORRECTNESS — banked by
 * REG-5 as law: **a length read off a marching walk has an angular blur of `arccos(w/(w+step))`,
 * which at `step = w/60` is 10.4°, comparable to the whole ±15° band.** A performance knob
 * inverted a census once already. The step below is coarse ON PURPOSE and the answer comes from
 * the bisection, which is where the precision is cheap.
 *
 * ⚠ IT ASKS `isInWater`, THE PUBLISHED PREDICATE, and never re-spells it. The whole reason this
 * module exists is that `deriveBridges` and the §205 A census once asked the same geometric
 * question in two spellings and disagreed about 92 of 127 crossings.
 *
 * @returns {{len:number, a:[number,number], b:[number,number]}|null}
 */
function wetCrossing(rel, x, y, ux, uy) {
  if (!isInWater(rel, x, y)) return null;
  const w = widthAt(rel, x, y) || rel.width;
  const cap = w * DECK_LAW.reachCap, step = Math.max(0.05, w / 24);
  const edge = (sx, sy) => {
    let lo = 0, hi = step;
    while (hi < cap && isInWater(rel, x + sx * hi, y + sy * hi)) { lo = hi; hi += step; }
    if (hi >= cap) return null;
    for (let i = 0; i < 40 && hi - lo > 1e-4; i++) {
      const mid = (lo + hi) / 2;
      if (isInWater(rel, x + sx * mid, y + sy * mid)) lo = mid; else hi = mid;
    }
    return lo;
  };
  const f = edge(ux, uy); if (f == null) return null;
  const b = edge(-ux, -uy); if (b == null) return null;
  return { len: f + b, a: [x - ux * b, y - uy * b], b: [x + ux * f, y + uy * f] };
}

/**
 * ⭐⭐⭐ THE CURE ITSELF. Re-sites, re-aims and re-lengths one deck, and reports the two
 * bridgehead points the approach road must now bend to reach. Returns null where the law cannot
 * be met (no crossing found, no admissible station) — and a refusal is REPORTED, never papered
 * over with the old geometry silently.
 */
function siteDeck(rel, br, ch, run, corridor, frontage, kinkMax) {
  const line = rel.line, n = line.length;
  // the station the deck stands at now
  let at = 0, ad = Infinity;
  for (let i = 0; i < n; i++) {
    const d = (line[i][0] - br.x) ** 2 + (line[i][1] - br.y) ** 2;
    if (d < ad) { ad = d; at = i; }
  }
  const prof = rel.widthProfile;
  const sOf = prof ? prof.s : null;
  const within = (j) => (sOf ? Math.abs(sOf[j] - sOf[at]) <= corridor
    : dist2p(line[j], line[at]) <= corridor);

  const why = { corridor: 0, noCrossing: 0, wetEnd: 0, kinkA: 0, kinkB: 0 };
  // ⭐⭐ TWO NARROWS ARE PUBLISHED, NOT ONE, AND THE PAIR IS THE HONEST STATEMENT OF §637.
  //   `narrowsCorridor` is the shortest crossing ANYWHERE in the corridor; `narrowsAdmissible` is
  //   the shortest one the ROAD CAN ACTUALLY REACH. The law names both halves — "the shortest
  //   point between both banks WITHIN REASONABLE DISTANCE TO MAJOR ROADS" — so a census that
  //   scored a deck against the corridor minimum alone would convict the law for obeying its own
  //   second clause. The deck must sit at `narrowsAdmissible` exactly; the gap up to
  //   `narrowsCorridor` is a REPORTED figure, not a defect.
  let narrowsCorridor = Infinity, narrowsAdmissible = Infinity;
  let best = null;
  for (let j = 0; j < n; j++) {
    if (!within(j)) { why.corridor++; continue; }
    const P = line[j];
    const shortest = shortestCrossingAt(rel, P[0], P[1], j, COARSE_STEP, COARSE_SPAN);
    if (!shortest) { why.noCrossing++; continue; }
    if (shortest.len < narrowsCorridor) narrowsCorridor = shortest.len;
    const w = widthAtIndexLocal(rel, j);
    const fit = fitDeck(rel, ch, run, P, shortest, w, br, frontage, kinkMax);
    if (fit.reject) { why[fit.reject]++; continue; }
    if (shortest.len < narrowsAdmissible) narrowsAdmissible = shortest.len;
    // ⭐ THE SCORE IS THE NARROWS ITSELF — the shortest bank-to-bank crossing available here.
    //   Ties go to the station nearest where the road already wanted to cross: the roads bend
    //   TO the bridge, but a bridge does not wander a hundredth of a unit for nothing.
    if (!best || shortest.len < best.len - 1e-9
      || (Math.abs(shortest.len - best.len) <= 1e-9 && Math.abs(j - at) < Math.abs(best.j - at))) {
      best = { j, len: shortest.len, P, idx: shortest.idx, w };
    }
  }
  if (!best) return { ok: false, why, narrowsCorridor, narrowsAdmissible };

  // ⭐ THE WINNER IS RE-AIMED AT FULL RESOLUTION. The candidate sweep is coarse on purpose —
  //   it ranks stations, and ranking survives a quantized bearing — but the bearing the deck is
  //   actually BUILT on is refined to one trig index (0.35°), far inside the ±15° band.
  const fine = shortestCrossingAt(rel, best.P[0], best.P[1], best.j, 1, FINE_SPAN, best.idx);
  const use = fine && fine.len <= best.len ? fine : { len: best.len, idx: best.idx };
  let fit = fitDeck(rel, ch, run, best.P, use, best.w, br, frontage, kinkMax);
  // ⛔⛔ THE REFINEMENT MAY REFUSE WHAT THE SWEEP ACCEPTED, and dropping the deck when it does is
  // a bug that hides as a lawful refusal. The fine pass moves the bearing by up to half a coarse
  // step (~4.9°), which is enough to flip a MARGINAL kink — MEASURED: `highwater`'s regional
  // approach was the corpus's last refusal, its own attribution added to 283 of 290 stations,
  // and the 7 unaccounted-for stations were the ones that had PASSED the sweep. The coarse
  // bearing is known to fit, so it is what the deck falls back to; a sharper crossing is a
  // refinement, never a precondition.
  const coarse = { len: best.len, idx: best.idx };
  if (fit.reject && use.idx !== coarse.idx) {
    fit = fitDeck(rel, ch, run, best.P, coarse, best.w, br, frontage, kinkMax);
    if (!fit.reject) {
      return { ok: true, j: best.j, P: best.P, idx: coarse.idx, cross: { len: coarse.len }, narrowsCorridor, narrowsAdmissible, ...fit };
    }
  }
  if (fit.reject) return { ok: false, why, narrowsCorridor, narrowsAdmissible };
  return { ok: true, j: best.j, P: best.P, idx: use.idx, cross: { len: use.len }, narrowsCorridor, narrowsAdmissible, ...fit };
}

/** the candidate sweep: ±COARSE_SPAN trig indices about the windowed normal, every COARSE_STEP */
const COARSE_SPAN = 128;        // ±45°
const COARSE_STEP = 12;         // ~4.2°
const FINE_SPAN = 14;           // ±4.9°, walked one index (0.35°) at a time

/**
 * ⭐⭐⭐ THE SHORTEST WET CROSSING AT A STATION — and it is what the deck is aimed on.
 *
 * ⛔⛔ THE WINDOWED TANGENT'S NORMAL WAS TRIED FIRST AND IT IS NOT THE LAW'S OBJECT. Aiming from
 * a 1.5-width chord's perpendicular MEASURED **22–28° off** the true normal on `town`'s own high
 * street — a deck REG-5's window-free census scores 6.3° from square. That is J-REG5-BR-2 in
 * miniature: the window family swings a census from 15/19 to 8/19 with no change in the drawing,
 * so a deck aimed by a window is a deck aimed at an artefact of a number somebody picked.
 * ⚠ THE CONSEQUENCE IS DECLARED RATHER THAN HIDDEN: the angle census and this cure now read the
 * same geometric object, so the census is no longer independent of the cure. Its value moves
 * entirely onto its PLANTED CONTROLS (C1/C2/C3, all proved LIVE) and onto the endpoint-clearance
 * and narrows censuses, which measure different things and remain independent.
 *
 * ⚠ INTEGER BEARINGS ONLY — `cosI`/`sinI` off the frozen table, never runtime trig (the module's
 * purity law). One index is 0.35°, which is twenty times finer than the band it is judged in.
 */
function shortestCrossingAt(rel, x, y, j, step, span, centre) {
  const base = centre != null ? centre : normalIndexAt(rel, j);
  let best = null;
  for (let d = -span; d <= span; d += step) {
    const idx = ((base + d) % TRIG_N + TRIG_N) % TRIG_N;
    const c = wetCrossing(rel, x, y, cosI(idx), sinI(idx));
    if (c && (!best || c.len < best.len)) best = { len: c.len, idx, a: c.a, b: c.b };
  }
  return best;
}

/** the windowed normal, used ONLY to centre the sweep — never to aim a deck. */
function normalIndexAt(rel, j) {
  const [tx, ty] = riverTangent(rel, j);
  return bearingIndex(-ty, tx);
}

/**
 * Lay the deck at `P` on bearing `use.idx`, find the road anchors it must join, and charge the
 * kink. Returns `{reject}` naming the clause that refused, or the sited deck.
 */
function fitDeck(rel, ch, run, P, use, w, br, frontage, kinkMax) {
  const KMAX = Number.isFinite(kinkMax) && kinkMax > 0 ? kinkMax : DECK_LAW.kinkMaxTan;
  const nx = cosI(use.idx), ny = sinI(use.idx);
  const ab = Math.max(w * DECK_LAW.abutment, (br.width || frontage) * DECK_LAW.abutmentRoad);
  const reach = use.len / 2 + ab;
  const endA = [P[0] - nx * reach, P[1] - ny * reach];
  const endB = [P[0] + nx * reach, P[1] + ny * reach];
  // ⛔ BOTH ENDS DRY — the exit's own predicate, enforced where the deck is sited rather than
  //    measured afterwards and apologized for.
  if (isInWater(rel, endA[0], endA[1]) || isInWater(rel, endB[0], endB[1])) return { reject: 'wetEnd' };

  // ⛔⛔ THE ANCHOR IS THE LAST ROAD VERTEX **OUTSIDE THE DECK**, NOT THE LAST DRY ONE, and that
  // distinction refused the entire corpus once. The deck lands `ab` PAST each bank, so on a
  // well-sited crossing the road's last dry vertex is ON the deck — and the chord from it to the
  // deck head then runs BACKWARD along the approach, which the (correct) "a deck behind its
  // approach is not a bridge" guard refuses. MEASURED: `town/street.high|46`, one of the
  // squarest decks in the corpus, refused at all 34 stations in its corridor with `chordA =
  // Infinity` and `reachA = 6.98`. ⭐ THE CLASS: **an anchor chosen by the wrong predicate makes
  // a correct guard fire on a correct configuration**, and it presents as a clean refusal.
  const insideDeck = (p) => {
    const vx = p[0] - P[0], vy = p[1] - P[1];
    const alongDeck = Math.abs(vx * nx + vy * ny);
    return alongDeck <= reach && isNear(rel, p, w);
  };
  let ia = run.from;
  while (ia > 0 && (isInWater(rel, ch.line[ia][0], ch.line[ia][1]) || insideDeck(ch.line[ia]))) ia--;
  let ib = run.to + 1;
  while (ib < ch.line.length - 1
    && (isInWater(rel, ch.line[ib][0], ch.line[ib][1]) || insideDeck(ch.line[ib]))) ib++;
  const PA = ch.line[ia], PB = ch.line[ib];
  const dirA = ia > 0 ? unit(PA[0] - ch.line[ia - 1][0], PA[1] - ch.line[ia - 1][1])
    : unit(PB[0] - PA[0], PB[1] - PA[1]);
  const dirB = ib < ch.line.length - 1 ? unit(ch.line[ib + 1][0] - PB[0], ch.line[ib + 1][1] - PB[1])
    : unit(PB[0] - PA[0], PB[1] - PA[1]);
  const flip = dist2p(PA, endB) < dist2p(PA, endA);
  const headA = flip ? endB : endA, headB = flip ? endA : endB;

  // The bend the carriageway turns through AT the bridgehead: the approach's own course against
  // the deck's axis. The reach chord is charged too, but only once it is long enough to have a
  // direction — a near-zero chord's bearing is numerical noise.
  const axis = unit(headB[0] - headA[0], headB[1] - headA[1]);
  const chordA = dist2p(PA, headA) > w * 0.25 ? kinkTan(PA, headA, dirA) : 0;
  const chordB = dist2p(PB, headB) > w * 0.25 ? kinkTan(PB, headB, [-dirB[0], -dirB[1]]) : 0;
  if (Math.max(chordA, tanBetween(dirA, axis)) > KMAX) return { reject: 'kinkA' };
  if (Math.max(chordB, tanBetween(axis, dirB)) > KMAX) return { reject: 'kinkB' };
  return { reject: null, reach, headA, headB, ia, ib, nx, ny };
}

/** within a couple of local widths of the channel — the band a deck's abutment can sit in */
function isNear(rel, p, w) {
  return distToPolyline(p[0], p[1], rel.line) <= w * 1.2;
}

function unit(x, y) { const l = Math.sqrt(x * x + y * y) || 1; return [x / l, y / l]; }

/** The tangent of the bend the road takes at a bridgehead: how far the chord from the road's
 *  last dry vertex to the deck head departs from the road's own incoming course. */
function tanBetween(u, v) {
  const dot = u[0] * v[0] + u[1] * v[1];
  const cr = Math.abs(u[0] * v[1] - u[1] * v[0]);
  if (dot <= 1e-9) return Infinity;                // more than a right angle is not a bend
  return cr / dot;
}

function kinkTan(P, head, dir) {
  const vx = head[0] - P[0], vy = head[1] - P[1];
  const l = Math.sqrt(vx * vx + vy * vy);
  if (l < 1e-9) return 0;
  const along = (vx * dir[0] + vy * dir[1]);
  const side = Math.abs(vx * dir[1] - vy * dir[0]);
  if (along <= 1e-9) return Infinity;              // the deck is BEHIND the approach: refuse
  return side / along;
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
    // ⭐⭐ REG-BRIDGE · THE PROBE AND THE PREDICATE MOVE IN LOCKSTEP, and the comment above says
    // why in the voice of the bug that produced it. `wetAt` now asks the LOCAL width; a probe
    // still stepping a NOMINAL 0.35 would overshoot the far bank at every narrows and re-mint
    // the exact defect — a probe and a predicate measured in the same units that disagree
    // because the probe steps past the predicate's own reach. Both read `widthAt` at the SAME
    // point, the bank station, so they cannot drift apart again.
    const probe = Math.max(2, widthAt(rel, near.qx, near.qy) * 0.35);
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
  if (!rel.widthProfile) return distToPolyline(x, y, rel.line) <= rel.width * 0.6;
  const st = stationAt(rel, x, y);
  return st.d <= st.w * 0.6;
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
        // ⭐ REG-BRIDGE · the arch spans the channel AT THE CUT, which is a local fact even
        // though the gate's SPACING (`apart`, above) is deliberately the circuit's and stays
        // nominal — the comment there rules on that and this does not disturb it.
        span: widthAt(rel, hit.x, hit.y),
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
  // ⭐⭐ REG-BRIDGE · A PER-SEGMENT HALF, AND THE TWO ENDS OF THE PROFILE DO OPPOSITE JOBS.
  // ⛔ THE INDEX'S EXACTNESS CLAIM NEEDS THE **MAX** ("a segment whose bucket the query does not
  //    touch cannot be within `half` of it" is false the moment one segment is wider than the
  //    cell the grid was sized from), while
  // ⛔ THE DENSIFICATION PITCH NEEDS THE **MIN** (the §190a guarantee is that a crossing cannot
  //    hide between two sampled points, and a pitch set by the widest reach is too coarse to
  //    catch the narrowest one).
  // One profile, two opposite ends, and reading the wrong one is silent in both directions.
  const ws = rel.kind === 'river' && rel.widthProfile
    && rel.widthProfile.w.length === rel.line.length ? rel.widthProfile.w : null;
  const halfOfSeg = (i) => (ws ? (ws[i] + ws[i + 1]) / 4 : half);
  const maxHalf = ws ? rel.widthProfile.max * 0.5 : half;
  const minWidth = ws ? rel.widthProfile.min : rel.width;
  let clipped = 0, dropped = 0;

  // ⚠ THE SEGMENT INDEX IS LOAD-BEARING, in the same way MF-B4's ringIndex and segmentHash
  // are. This predicate runs over every densified vertex of every field parcel — MEASURED,
  // ~5 million polyline distance evaluations per leaf against a 289-segment meandering
  // channel, which alone took a leaf from 0.35 s to 1.1 s. The index is EXACT: a segment
  // whose bucket the query does not touch cannot be within `half` of it.
  const cell = Math.max(8, maxHalf * 2);
  /** @type {Map<string, Array<number>>} */ const segGrid = new Map();
  const segs = [];
  for (let i = 0; i + 1 < rel.line.length; i++) segs.push([rel.line[i], rel.line[i + 1]]);
  segs.forEach(([a, b], i) => {
    const h = halfOfSeg(i);
    const x0 = Math.min(a[0], b[0]) - h, x1 = Math.max(a[0], b[0]) + h;
    const y0 = Math.min(a[1], b[1]) - h, y1 = Math.max(a[1], b[1]) + h;
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
      const h = halfOfSeg(i);
      if (qx * qx + qy * qy < h * h) return true;
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
  const pitch = Math.max(2, (rel.kind === 'river' ? minWidth : 12) * 0.5);
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

/* ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ REG-BRIDGE · THE FORD REGISTER — L-REG-32's MIRROR (owner §637.2, chair §641.5)
 *
 * ⛔⛔ THE DEFECT: **seventeen fords exist and not one has ever been drawn.** `routes.js:141-145`
 * mints a `kind: 'ford'` crossing wherever a regional corridor meets the watercourse; exactly one
 * consumer reads the record (`corridorPull`) and it reads only `x, y, weight` — `kind` is never
 * branched on anywhere, and `renderFolio.mjs` has no ford pass. The ford that justifies the site
 * is invisible on the page that shows the site.
 *
 * ⭐⭐ AND THE MEASUREMENT THAT SHAPES THIS DERIVATION: **all 17 fords sit at distance 0.00 from a
 * DRAWN channel, and on the same two channels the bridges are on** (`street.high` and
 * `street.road.approach.corridor.*`), every one of them in the water. The ford and the bridge are
 * not two places, they are two READINGS OF ONE CROSSING — which is why this register's first
 * clause is that a ford is never drawn under a deck. Drawing both would put a ford's dashes
 * across a bridge's parapets.
 *
 * ⭐⭐⭐ THE MIRROR LAW (§637.2 verbatim): *"a ford takes the WIDE, shallow reach"* — the exact
 * opposite of L-REG-32's narrows. That is a legibility gift before it is a rule: a reader who
 * sees a crossing at a pinch reads BRIDGE, and at a broad reach reads FORD, with no legend.
 * ⚠ SHALLOWNESS IS NOT MODELLED and is not faked. The substrate has no depth field; the width
 * profile is what exists, so the register sites on WIDTH and says so. A depth term is a mint,
 * and a mint inside a presentation wave is the move this programme keeps refusing.
 *
 * ⚠⚠ THE DRAWN FORD MOVES; THE FOUNDING RECORD DOES NOT — and the choice is deliberate.
 * `routes.crossings` is computed at STAGE 0b, before any nucleus exists, and it feeds
 * `corridorPull`, which is an input to the site search. Re-siting the record at birth would move
 * the NUCLEUS on every river leaf, and the whole town moving would swamp the visual evidence for
 * everything else this wave changed. So the founding fact stays where it is — *a corridor crosses
 * this river here* — and the DRAWN ford is where that crossing is actually made. §637.2 describes
 * exactly this: *"A road that meets the river far from any narrows follows the bank to the
 * crossing (the period riverside road)."* ⭐ THE ALTERNATIVE IS OWNER-GATED, NOT WRONG: re-siting
 * at birth is a stronger reading and a much larger declared shift; it is written up rather than
 * taken.
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐ THE TUNING SURFACE — PROPOSED-WITH-RATIONALE; the chair signs. Dimensionless.
 *
 *  corridorWidths  how far along the bank a ford may look for its reach, in NOMINAL river
 *                  widths. ⚠ It cannot be J-REG5-BR-1's block-scale corridor: the ford is a
 *                  countryside crossing on a regional corridor and there are no blocks out
 *                  there. 5 widths is 83.6 units on `town`, which lands inside the bridge
 *                  corridor's own measured range (80.4–89.4) — the two laws look over
 *                  comparable ground, which is what makes "the mirror" a fair comparison.
 *  wideBand        a drawn ford must stand at a reach at least this fraction of the WIDEST in
 *                  its corridor. 0.97 is a band, not a maximum: two adjacent stations of a
 *                  smoothed profile differ by less than a percent and picking between them on
 *                  the third decimal would be picking on noise.
 *  deckClear       a ford is refused within this many local widths of a drawn deck. One crossing
 *                  gets one work.
 *  obliqueMax      the longest wet run a ford's own road may make, in local widths, before the
 *                  station is refused. ⛔ IT IS NOT COSMETIC. The wide-reach search moves the
 *                  ford ALONG the bank, and a station where the road runs down the channel
 *                  rather than across it has a wet run of any length you like — MEASURED,
 *                  `town-2` first produced a ford whose road dipped through 57.5 units of a
 *                  15.4-unit river, a 3.7× obliquity that would have drawn a ford longer than
 *                  the reach it crosses. A crossing is a place where a road CROSSES.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const FORD_LAW = Object.freeze({
  corridorWidths: 5,
  wideBand: 0.97,
  deckClear: 2.2,
  obliqueMax: 2.5,
});

/**
 * Derive the DRAWN fords. Armed-only; absent the arm nothing here runs and the fabric is the
 * object it always was.
 *
 * @param {Object} a
 * @param {any} a.rel                the water relationship
 * @param {Array<any>} a.crossings   `fabric.routes.crossings` — the founding records
 * @param {Array<any>} a.channels    the drawn street web, for the road a ford lies on
 * @param {Array<any>} a.bridges     the drawn decks: one crossing, one work
 * @param {number} a.frontage
 */
export function deriveFords(a) {
  const { rel, crossings = [], channels = [], bridges = [], frontage = 6 } = a;
  /** @type {Array<any>} */ const fords = [];
  if (!rel || rel.kind !== 'river' || !rel.line || rel.line.length < 4) {
    return { fords, reason: 'no river on this leaf: no ford is owed' };
  }
  const line = rel.line;
  const prof = rel.widthProfile;
  const corridor = rel.width * FORD_LAW.corridorWidths;
  let underDeck = 0, offRoad = 0, moved = 0, oblique = 0;
  const ordered = crossings.filter((c) => c && c.kind === 'ford')
    .slice().sort((p, q) => (p.x - q.x) || (p.y - q.y));
  let serial = 0;
  for (const c of ordered) {
    const idx = serial++;
    // the station the founding record names
    let at = 0, ad = Infinity;
    for (let i = 0; i < line.length; i++) {
      const d = (line[i][0] - c.x) ** 2 + (line[i][1] - c.y) ** 2;
      if (d < ad) { ad = d; at = i; }
    }
    // ⛔⛔ THE FORD KEEPS THE ROAD THAT OWNS IT, AND FINDING THE ROAD **AFTER** THE MOVE WAS A
    //    BUG WITH A PLAUSIBLE OUTPUT. The first spelling re-sited first and then took the nearest
    //    drawn channel — so a ford that walked 80 units up the bank landed on whatever lane
    //    happened to be closest, and `town`'s ford came out keyed
    //    `ford|street.block.org.district.religious_quarter|…`: a regional river crossing drawn on
    //    a block lane inside a precinct, at a 61° obliquity that made its glyph twice as long as
    //    the river is wide. ⭐ THE CLASS: **an identity resolved after a move is resolved against
    //    the destination, not the subject** — and it produces a record that is internally
    //    consistent and completely wrong.
    // ⭐ The owning road is the channel nearest the FOUNDING record, which is where the corridor
    //    actually met the water (MEASURED: all 17 records sit at distance 0.00 from a channel).
    let road = null, rd = Infinity;
    for (const ch of channels) {
      for (let i = 0; i + 1 < ch.line.length; i++) {
        const cc = segSegClosest(c.x, c.y, c.x, c.y,
          ch.line[i][0], ch.line[i][1], ch.line[i + 1][0], ch.line[i + 1][1]);
        if (cc.d < rd) { rd = cc.d; road = ch; }
      }
    }
    if (!road || rd > rel.width * 1.5) { offRoad++; continue; }

    // ⭐ THE WIDE REACH, within a bank's walk of where the corridor met the water — and only at
    //   stations THIS road still reaches, because §637.2's road "follows the bank to the
    //   crossing"; it does not hand the crossing to a different road.
    const nearRoad = (P) => {
      let d = Infinity;
      for (let i = 0; i + 1 < road.line.length; i++) {
        const cc = segSegClosest(P[0], P[1], P[0], P[1],
          road.line[i][0], road.line[i][1], road.line[i + 1][0], road.line[i + 1][1]);
        if (cc.d < d) { d = cc.d; }
      }
      return d;
    };
    // a station is a CROSSING only where the road gets across; `dipAt` is what makes that a
    // measurement rather than an assumption, and it is the same walk the deck law uses.
    const roadIdxAt = (P) => {
      let seg = 0, sd = Infinity;
      for (let i = 0; i + 1 < road.line.length; i++) {
        const cc = segSegClosest(P[0], P[1], P[0], P[1],
          road.line[i][0], road.line[i][1], road.line[i + 1][0], road.line[i + 1][1]);
        if (cc.d < sd) { sd = cc.d; seg = i; }
      }
      const A0 = road.line[seg], B0 = road.line[seg + 1];
      return bearingIndex(B0[0] - A0[0], B0[1] - A0[1]);
    };
    const dipAt = (P, wj) => {
      const bi = roadIdxAt(P);
      const d = wetCrossing(rel, P[0], P[1], cosI(bi), sinI(bi));
      return d && d.len <= wj * FORD_LAW.obliqueMax ? d.len : null;
    };
    const admissible = (j) => Math.abs(prof.s[j] - prof.s[at]) <= corridor
      && nearRoad(line[j]) <= prof.w[j] * 1.5
      && dipAt(line[j], prof.w[j]) != null;
    let pick = at;
    if (prof) {
      let wide = -Infinity;
      for (let j = 0; j < line.length; j++) {
        if (!admissible(j)) continue;
        if (prof.w[j] > wide) { wide = prof.w[j]; pick = j; }
      }
      if (wide > -Infinity) {
        let bestJ = pick, bestD = Math.abs(pick - at);
        for (let j = 0; j < line.length; j++) {
          if (!admissible(j)) continue;
          if (prof.w[j] < wide * FORD_LAW.wideBand) continue;
          if (Math.abs(j - at) < bestD) { bestJ = j; bestD = Math.abs(j - at); }
        }
        pick = bestJ;
      } else { oblique++; continue; }        // no station on this road is a crossing at all
    }
    const P = line[pick];
    if (pick !== at) moved++;
    const w = prof ? prof.w[pick] : rel.width;

    // ⛔ ONE CROSSING, ONE WORK. A ford drawn under a deck lays its dashes across the parapets.
    let covered = false;
    for (const b of bridges) {
      const r = Math.max(deckReach(b, frontage), w * FORD_LAW.deckClear);
      if ((P[0] - b.x) ** 2 + (P[1] - b.y) ** 2 < r * r) { covered = true; break; }
    }
    if (covered) { underDeck++; continue; }

    // the segment of the owning road the glyph takes its bearing from
    let rseg = 0, sd = Infinity;
    for (let i = 0; i + 1 < road.line.length; i++) {
      const cc = segSegClosest(P[0], P[1], P[0], P[1],
        road.line[i][0], road.line[i][1], road.line[i + 1][0], road.line[i + 1][1]);
      if (cc.d < sd) { sd = cc.d; rseg = i; }
    }
    const A = road.line[rseg], B = road.line[rseg + 1];
    const alongIdx = bearingIndex(B[0] - A[0], B[1] - A[1]);
    // ⭐ HOW MUCH WATER THE ROAD ACTUALLY DIPS THROUGH, along its OWN bearing — a ford is not
    //   square to the channel the way a deck is, so its wet run is longer than the width by
    //   exactly the obliquity, and the glyph has to be that long or the dashes stop mid-river.
    const dip = wetCrossing(rel, P[0], P[1], cosI(alongIdx), sinI(alongIdx));
    fords.push({
      x: P[0], y: P[1],
      along: alongIdx,
      wet: dip ? dip.len : w,
      tangent: bearingIndex(line[Math.min(line.length - 1, pick + 1)][0] - line[Math.max(0, pick - 1)][0],
        line[Math.min(line.length - 1, pick + 1)][1] - line[Math.max(0, pick - 1)][1]),
      width: road.width,
      span: w,
      rank: road.rank,
      station: pick,
      moved: pick !== at,
      weight: c.weight,
      key: `ford|${road.key || road.rank}|${idx}`,
    });
  }
  fords.sort((p, q) => compareKeys(p.key, q.key));
  return {
    fords, underDeck, offRoad, moved, oblique,
    reason: `${fords.length} ford${fords.length === 1 ? '' : 's'} drawn at the WIDE reach of their own`
      + ` corridor (§637.2's mirror of the narrows law); ${moved} re-sited along the bank,`
      + ` ${underDeck} refused as already carrying a deck (one crossing, one work),`
      + ` ${offRoad} refused as off any drawn road, ${oblique} refused as having no station where`
      + ' their own road actually crosses',
  };
}

/* ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ V-QUAY · THE WATERFRONT DETAIL REGISTER (chair-minted, ODQ §636.2)
 *
 * WHY IT EXISTS, MEASURED: the warehouse blind re-round scored 33 %, and the reader's notes
 * localize the failure exactly — *quay warehouses with no quay furniture read as farmsteads*.
 * The ONE correct call was carried by "bollard/barrel circles ranged along the shed's road face"
 * plus a hoist and a loading way. A quay is not identified by its shed; it is identified by the
 * WORKING GEAR on its apron, and the corpus draws that gear in plan.
 *
 * ⭐ THE VOCABULARY IS CLOSED AND EVERY MEMBER IS ANCHORED IN THE DETAIL REGISTER — no anatomy
 * is invented here, and where an anchor were absent the member would be reported THIN rather
 * than guessed:
 *   `bollardRow`    hf322's *"ashlar quay with bollards"* + hf133's mooring swing circles.
 *                   ⭐ ONE ROW IS ONE FIXTURE (§636.2 verbatim), exactly as V-B13's stall row is.
 *   `hoist`         hf122's *"treadwheel cranes with dashed swing arcs"* — a wheel-and-jib PLAN
 *                   with its dashed arc, never an elevation.
 *   `pierDeckEdge`  hf322's *"timber jetty on pile dots"* — the deck edge with its pile dots.
 *   `goodsStack`    hf122's *"countable cargo — barrels with stave lines, crates, jars, timber"*.
 * ⛔ PROJECTION: hf122 titles itself a PLAN study and hf265 reads "HULLS FROM ABOVE". Every glyph
 * below is strict top-down orthographic; there is no elevation anywhere in this vocabulary.
 *
 * ⛔ IT FURNISHES ONLY A QUAY THAT IS ACTUALLY DRAWN. A landmark whose piers the ground law ate
 * has no apron to furnish, and hanging bollards in the water beside an absent shed would be the
 * dress leg papering over the geometric one. REG-QUAY's exemption comes first, by construction.
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */

/** the closed vocabulary — a fifth kind cannot appear without this list changing */
export const V_QUAY_KINDS = Object.freeze(['bollardRow', 'hoist', 'pierDeckEdge', 'goodsStack']);

/** the provisional band, chair-minted §636.2: 2–5 fixtures per drawn quay at page register */
export const V_QUAY_BAND = Object.freeze([2, 5]);

/**
 * The candidate ladder. Order is precedence, not preference: the bollard row is what MAKES a
 * quay read as a quay (the blind reader's own evidence), so it is always first and a two-fixture
 * quay always has it.
 */
function quayCandidates({ rank, tier, kind }) {
  const out = [];
  out.push({ kind: 'bollardRow', why: 'hf322: the ashlar quay is read by its bollards — the blind round\'s own discriminator' });
  out.push({ kind: 'pierDeckEdge', why: 'hf322: the timber jetty on its pile dots gives the apron an edge' });
  if (rank >= 1) out.push({ kind: 'goodsStack', why: 'hf122: countable cargo — a working quay has goods standing on it' });
  if (rank >= 2 || tier === 'city' || tier === 'metropolis') out.push({ kind: 'hoist', why: 'hf122: the treadwheel crane with its dashed swing arc' });
  if (rank >= 3) out.push({ kind: 'goodsStack', why: 'hf122: a busier quay lays a second cargo set, not a bigger one' });
  if (kind === 'river') out.push({ kind: 'bollardRow', why: 'hf133: a river berth takes a second row along the upstream face' });
  return out;
}

/**
 * ⭐ THE APRON is the strip of the quay's own ground between the shed and the water — the band
 * the gear stands on. It is derived from the landmark's OWN anchor and rotation (both already set
 * by `moorWaterBound`), never re-derived from the water, so the furniture cannot drift away from
 * the building it belongs to.
 */
export function deriveQuayRegister(a) {
  const { landmarks = [], rel = null, seedKey = 'q', frontage = 6, tier = 'town' } = a;
  /** @type {Array<any>} */ const quays = [];
  if (!rel || !rel.line) return { quays, reason: 'no water on this leaf: no quay register' };
  const ordered = landmarks.filter((lm) => lm && lm.archetype === 'port' && lm.fronts === 'water')
    .slice().sort((p, q) => compareKeys(String(p.anchorKey || p.instanceKey), String(q.anchorKey || q.instanceKey)));
  for (const lm of ordered) {
    const solids = Array.isArray(lm.solids) ? lm.solids.filter((s) => s && s.length >= 3) : [];
    if (!solids.length) continue;                       // ⛔ an undrawn quay is not furnished
    const key = String(lm.anchorKey || lm.instanceKey);
    const rank = Number.isFinite(lm.rung) ? lm.rung : 0;
    const cands = quayCandidates({ rank, tier, kind: rel.kind });
    const [lo, hi] = V_QUAY_BAND;
    const n = Math.min(cands.length, lo + Math.floor(hashUnit(`${seedKey}|vquay|${key}`) * (hi - lo + 1)));
    // the apron axis is the pier's own long axis; the gear ranges ALONG the water, i.e. across it
    const ang = ((lm.rot || 0) % TRIG_N + TRIG_N) % TRIG_N;
    const ax = cosI(ang), ay = sinI(ang);               // toward the water
    const bx = -ay, by = ax;                            // along the bank
    const s = Math.max(frontage * 0.9, (lm.size || frontage) * 0.55);
    /** @type {Array<any>} */ const fixtures = [];
    for (let i = 0; i < n; i++) {
      const c = cands[i];
      const u = hashUnit(`${seedKey}|vquay|${key}|${i}|u`) - 0.5;
      const v = hashUnit(`${seedKey}|vquay|${key}|${i}|v`);
      const px = lm.x + bx * u * s * 1.7 + ax * (0.35 + v * 0.5) * s;
      const py = lm.y + by * u * s * 1.7 + ay * (0.35 + v * 0.5) * s;
      const f = { kind: c.kind, why: c.why, x: px, y: py, ang, s: s * 0.5, key: `${key}|vq${i}` };
      if (c.kind === 'bollardRow') {
        f.count = 3 + Math.floor(hashUnit(`${seedKey}|vquay|${key}|${i}|n`) * 3);   // 3–5 bollards
        f.step = Math.max(1.4, frontage * 0.34);
        f.r = Math.max(0.5, frontage * 0.11);
      } else if (c.kind === 'goodsStack') {
        f.count = 3 + Math.floor(hashUnit(`${seedKey}|vquay|${key}|${i}|n`) * 4);   // 3–6 barrels
        f.r = Math.max(0.6, frontage * 0.15);
      } else if (c.kind === 'hoist') {
        f.r = Math.max(1.1, frontage * 0.30);
        f.jib = Math.max(2.2, frontage * 0.72);
      } else if (c.kind === 'pierDeckEdge') {
        f.len = Math.max(4, s * 1.2);
        f.piles = 4 + Math.floor(hashUnit(`${seedKey}|vquay|${key}|${i}|n`) * 3);   // 4–6 pile dots
      }
      fixtures.push(f);
    }
    quays.push({ key, x: lm.x, y: lm.y, rank, fixtures, band: [lo, hi], target: n });
  }
  const total = quays.reduce((t, q) => t + q.fixtures.length, 0);
  const inBand = quays.filter((q) => q.fixtures.length >= V_QUAY_BAND[0] && q.fixtures.length <= V_QUAY_BAND[1]).length;
  return {
    quays, total, inBand,
    reason: `${quays.length} drawn quays furnished with ${total} V-QUAY fixtures`
      + ` (${inBand} inside the ${V_QUAY_BAND[0]}–${V_QUAY_BAND[1]} band); the vocabulary is closed at`
      + ` ${V_QUAY_KINDS.join(', ')} and every member cites hf322/hf122/hf133`,
  };
}
