/**
 * domain/townMap/fabric/streetEdges.js — WHAT THE STREET WEB DOES AT THE SETTLEMENT'S EDGE.
 *
 * ⭐ THE SEAM IS REAL, NOT A LINE-COUNT CONVENIENCE. `streets.js` DERIVES the web — ranks,
 * widths, squares, the high street, the block lanes the fabric fronts onto. The two passes
 * here are about the web's RELATIONSHIP TO THE TOWN'S OUTLINE, which is a different fact and
 * one that only exists once MF-B4's inversion has derived that outline from the fabric:
 *
 *   • CONTAINMENT — no street where there is no town (and the §2.3 continuity exemption
 *     that lets the region's own roads leave the frame);
 *   • THE OUTLYING LANES — §161c's "connected by their own lane", the countryside half of
 *     the same continuity law.
 *
 * Both read the umbrella; neither derives a rank. Splitting them out also brings `streets.js`
 * back under the 800-effective-line domain ceiling it crossed at MF-B4 (830), which is the
 * sizeBaseline ratchet doing exactly what it exists to do: forcing a decomposition at a seam
 * that was already there rather than at a convenient blank line.
 *
 * PURITY: pure; seeded draws come from entity-keyed forks only.
 */

import { hashUnit } from './fabricRng.js';
import { compareKeys } from './lineage.js';
import { chaikin, ringIndex } from './fabricGeometry.js';
import { sampleAt } from './substrate.js';
import { isInWater } from './waterMode.js';

/** Even-odd point-in-ring, local (umbrella rings are not convex). */
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

/**
 * ⭐⭐⭐ CHANNEL CONTAINMENT — "no street where there is no town" (MF-B4).
 *
 * ⛔ THE DEFECT, SEEN BEFORE IT WAS MEASURED. The MF-B3 exemplars carry short, bright,
 * perfectly straight cream strokes lying in the open fields — most visibly in the village's
 * south-east quadrant, and at the town and city too. MEASURED: 2–11 channels per leaf whose
 * EVERY point falls outside every umbrella component, overwhelmingly `blockCross` (the
 * grid's own column gaps) and `blockLane`. They are drawn at full carriageway width in the
 * palest role on the page, so each reads as a rod of white laid across a ploughed field.
 *
 * ⭐ WHY THEY EXIST, and it is not a bug in the channel pass: the packer's column grid spans
 * the organism's whole span, and a column whose plots were ALL culled still has a column
 * GAP — a fact about a grid that produced no fabric. The channel pass faithfully drew the
 * gap. **A STREET IS A FACT ABOUT A BLOCK, AND WHERE THERE IS NO BLOCK THERE IS NO STREET.**
 *
 * ⭐⭐ AND THE EXEMPTION IS THE CONTINUITY LAW, NOT A CONVENIENCE. §2.3: "roads are one
 * continuous web — countryside S-curves, through the gates, becoming streets". The HIGH
 * STREET and the ARTERIES are facts about the REGION; they must leave the frame, and
 * clipping them at the town's edge would sever exactly the join the continuity law exists
 * to draw. Every other rank is a fact about the fabric and is contained.
 *
 * The clip is a SAMPLED SPLIT, declared: the polyline is walked at a fixed pitch, maximal
 * runs of inside samples become sub-channels, and a surviving piece shorter than the
 * minimum is dropped rather than drawn as a stub. Sub-channels keep their parent's key with
 * an ordinal, so the §11.0 inertia law still sees a stable identity.
 *
 * @param {Array<any>} channels
 * @param {{ components: Array<Array<[number,number]>> }} umbrella
 * @param {{ frontage:number, exempt?: ReadonlyArray<string> }} opts
 * @returns {{ channels:Array<any>, dropped:number, split:number, reason:string }}
 */
export function containChannels(channels, umbrella, opts) {
  const frontage = opts.frontage;
  const exempt = new Set(opts.exempt || ['high', 'artery']);
  const idx = ringIndex(umbrella.components || []);
  const inside = (x, y) => idx.contains(x, y);
  // The walk pitch: a third of a plot frontage. Finer than the narrowest carriageway, so a
  // crossing cannot hide between two samples.
  const pitch = Math.max(1.5, frontage / 3);
  // A piece shorter than one plot frontage is a doorstep, not a street.
  const minLen = frontage;
  /** @type {Array<any>} */ const out = [];
  let dropped = 0, split = 0;
  for (const ch of channels) {
    if (exempt.has(ch.rank)) { out.push(ch); continue; }
    // Walk the polyline, emitting maximal inside runs.
    /** @type {Array<Array<[number,number]>>} */ const runs = [];
    /** @type {Array<[number,number]>} */ let cur = [];
    for (let k = 0; k + 1 < ch.line.length; k++) {
      const a = ch.line[k], b = ch.line[k + 1];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(len / pitch));
      for (let t = 0; t < steps; t++) {
        const u = t / steps;
        const px = a[0] + dx * u, py = a[1] + dy * u;
        if (inside(px, py)) cur.push([px, py]);
        else if (cur.length) { runs.push(cur); cur = []; }
      }
    }
    const last = ch.line[ch.line.length - 1];
    if (inside(last[0], last[1])) cur.push([last[0], last[1]]);
    if (cur.length) runs.push(cur);

    const kept = runs.filter((r) => {
      if (r.length < 2) return false;
      let L = 0;
      for (let k = 0; k + 1 < r.length; k++) {
        L += Math.sqrt((r[k + 1][0] - r[k][0]) ** 2 + (r[k + 1][1] - r[k][1]) ** 2);
      }
      return L >= minLen;
    });
    if (!kept.length) { dropped++; continue; }
    if (kept.length > 1) split++;
    for (let i = 0; i < kept.length; i++) {
      // ⚠ A SPLIT PIECE IS SIMPLIFIED BACK TO ITS ENDPOINTS WHERE THE PARENT WAS STRAIGHT.
      // The walk emits a sample every `pitch`, and keeping them all would turn a two-point
      // block lane into a forty-point polyline — a forty-fold cost in the path data for
      // pixels that are identical. A parent with more than two points (a bent quarter lane)
      // keeps its samples, because there the shape is the information.
      const piece = ch.line.length === 2 && kept[i].length > 2
        ? [kept[i][0], kept[i][kept[i].length - 1]]
        : kept[i];
      out.push(kept.length === 1
        ? { ...ch, line: piece }
        : { ...ch, key: `${ch.key}#${i}`, line: piece });
    }
  }
  return {
    channels: out,
    dropped,
    split,
    reason: `${dropped} channels dropped as wholly outside the built fabric`
      + ` and ${split} split at its edge (high street and arteries exempt — §2.3 continuity)`,
  };
}


/**
 * ⭐⭐ §161c THE OUTLYING LANES — "an OUTLYING institution is apart by function or resource,
 * CONNECTED BY THEIR OWN LANE", and "outlying lanes join the road web (§2.3 continuity)."
 *
 * ⛔ THE DEFECT, VISIBLE ON EVERY MF-B3 EXEMPLAR AND NEVER DRAWN SINCE THE RING LAW LANDED.
 * The siting-ring law places the mill at its water, the quarry at its stone, the abbey apart
 * by design and the roadside inn at its junction — and every one of them rendered as a
 * building sitting in a ploughed field with nothing joining it to anything. §2.3's
 * continuity law is explicit that the road web is ONE web; a working building nobody can
 * reach is not a truth the map may assert.
 *
 * ⭐ THE LANE IS A CONSEQUENCE, NOT A DECORATION: a mill exists because carts come to it, so
 * the lane is as much a fact about the mill as its wheel is. It runs to the NEAREST thing
 * already on the web — a road, the town's own edge, a field lane's head — because that is
 * what the parish would have maintained, and it BENDS once so it reads as a lane rather than
 * as a ruled connector.
 *
 * ⚠ REFUSED RATHER THAN FORCED: a site whose only join would cross open water gets NO lane
 * and is REPORTED (a ferry landing or an island mill is reached by boat, and drawing a track
 * over the water would be a fabrication). §15.6: silent nonsense is forbidden.
 *
 * @param {Object} args
 * @returns {{ lanes:Array<{key:string, line:Array<[number,number]>, targetKind:string}>, refused:number, reason:string }}
 */
export function deriveOutlyingLanes(args) {
  const { landmarks, umbrella, web, sub, water, seeding, frontage } = args;
  const inTown = ringIndex(umbrella.components || []);
  /** @type {Array<{ p:[number,number], kind:string }>} */ const targets = [];
  for (const rd of (web.roads || [])) for (const p of rd.line) targets.push({ p, kind: 'road' });
  if (web.highStreet) for (const p of web.highStreet) targets.push({ p, kind: 'high' });
  for (const l of (args.fieldLanes || [])) for (const p of l.line) targets.push({ p, kind: 'fieldlane' });
  for (const comp of (umbrella.components || [])) for (const p of comp) targets.push({ p, kind: 'edge' });
  /** @type {Array<{key:string, line:Array<[number,number]>, targetKind:string}>} */ const lanes = [];
  let refused = 0;
  if (!targets.length) return { lanes, refused, reason: 'no road web to join' };

  const ordered = (landmarks || []).slice().sort((a, b) => compareKeys(a.instanceKey, b.instanceKey));
  for (const lm of ordered) {
    if (!Number.isFinite(lm.x) || !Number.isFinite(lm.y)) continue;
    if (inTown.contains(lm.x, lm.y)) continue;                 // it is in the town; it has streets
    // The nearest joinable point, and the runners-up, so a refusal can try again.
    // ⚠ THE CANDIDATES ARE THINNED BY DISTANCE FROM EACH OTHER, NOT JUST RANKED BY RANGE.
    // The nearest twelve points of a road are twelve points of the SAME road a few units
    // apart, so a lane refused by the river between the site and that road was refused
    // twelve times over and the site reported unreachable while a perfectly good lane ran
    // the other way. MEASURED on the riverside town: 8 refusals became 1.
    // ⭐ THE CLASS: a ranked shortlist over a dense sample is a shortlist of ONE PLACE.
    const scored = targets
      .map((t) => ({ t, d: (t.p[0] - lm.x) ** 2 + (t.p[1] - lm.y) ** 2 }))
      .sort((a, b) => a.d - b.d);
    /** @type {Array<{t:any,d:number}>} */ const ranked = [];
    const spread = (frontage * 4) ** 2;
    for (const c of scored) {
      let clash = false;
      for (const k of ranked) {
        if ((k.t.p[0] - c.t.p[0]) ** 2 + (k.t.p[1] - c.t.p[1]) ** 2 < spread) { clash = true; break; }
      }
      if (clash) continue;
      ranked.push(c);
      if (ranked.length >= 12) break;
    }
    let made = null;
    for (const cand of ranked) {
      const to = cand.t.p;
      const d = Math.sqrt(cand.d);
      // A building ALREADY on the web needs no lane drawn to itself.
      if (d < frontage * 1.2) { made = 'onweb'; break; }
      // ⭐ ONE SEEDED KINK: the lane leaves the site square and then bends to the road, which
      // is what a track does when it has to get round a hedge or a wet corner.
      const mx = (lm.x + to[0]) / 2, my = (lm.y + to[1]) / 2;
      const nx = -(to[1] - lm.y) / d, ny = (to[0] - lm.x) / d;
      const bend = (hashUnit(`${seeding.seed}|outlane|${lm.instanceKey}`) - 0.5) * d * 0.24;
      /** @type {Array<[number,number]>} */
      const line = [[lm.x, lm.y], [mx + nx * bend, my + ny * bend], [to[0], to[1]]];
      // No track over open water, and none up a cliff the cart could not climb.
      // ⚠ THE ENDPOINTS ARE EXEMPT, AND THAT IS A TRUTH CORRECTION RATHER THAN A TOLERANCE.
      // §161m's physical absolutes put the MILL ON ITS RACE and the FERRY AT ITS CROSSING,
      // so a lane to a water-sited institution BEGINS in the water by construction — and the
      // first spelling of this test sampled its own start point and refused every mill on
      // the corpus for standing where the law requires it to stand. What must not cross the
      // water is the lane's RUN, not its doorstep.
      // ⭐ THE CLASS: a path predicate that samples its own endpoints is asking about the
      // places it was GIVEN rather than about the ground it CHOSE.
      let bad = false;
      const skirt = frontage * 1.3;
      for (let k = 0; k + 1 < line.length && !bad; k++) {
        for (let t = 0; t <= 8; t++) {
          const u = t / 8;
          const px = line[k][0] + (line[k + 1][0] - line[k][0]) * u;
          const py = line[k][1] + (line[k + 1][1] - line[k][1]) * u;
          const dStart = Math.sqrt((px - lm.x) ** 2 + (py - lm.y) ** 2);
          const dEnd = Math.sqrt((px - to[0]) ** 2 + (py - to[1]) ** 2);
          if (dStart < skirt || dEnd < skirt) continue;
          if (isInWater(water, px, py)) { bad = true; break; }
          if (sampleAt(sub, sub.slope, px, py) > 0.62) { bad = true; break; }
        }
      }
      if (bad) continue;
      lanes.push({ key: `outlane.${lm.instanceKey}`, line: chaikin(line, 2, false), targetKind: cand.t.kind });
      made = 'lane';
      break;
    }
    if (!made) refused++;
  }
  return {
    lanes,
    refused,
    reason: `${lanes.length} outlying lanes joined to the web`
      + (refused ? `; ${refused} sites refused a lane (water or cliff between them and every join — reached by boat or by nothing)` : ''),
  };
}
