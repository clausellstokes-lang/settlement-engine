/**
 * domain/townMap/fabric/commons.js — §5.0c.3 THE INTERIOR GREENS, as a RESERVED CLAIM.
 *
 * ⭐⭐ "WHERE THEY HAVEN'T MET, THE GAPS INSIDE THE UMBRELLA STAY GREEN — gardens, commons,
 * paddocks; the interior green holes that make real town plans breathe."
 *
 * ⛔ THE MF-B1 SHORTFALL AND WHY IT HAPPENED. That lane reported ZERO interior greens at
 * every tier and refused to force one, which was right. Three mechanisms were tried — an
 * inside-threshold sweep (0.10 → 0.34), radial matrix ribbons, a back-lane rim — and none
 * produced an enclosed gap, because all three attack the same losing side of the problem:
 * they hope the organisms will FAIL to cover their own interior. They never do. An
 * organism's influence field has a halo, several quarters overlap, and the connective
 * matrix that makes the umbrella a single shape also fills every wedge between them. A gap
 * that only exists when growth happens to miss is a gap that will be closed by the next
 * settlement, the next seed, or the next tuning pass.
 *
 * ⭐⭐ THE CURE IS THE ONE MF-B1 NAMED AND DID NOT BUILD: A GREEN IS NOT A PLACE THE TOWN
 * HAPPENED NOT TO REACH — IT IS A PLACE THE TOWN WAS NEVER ALLOWED TO BUILD. That is also
 * what a common actually WAS: ground held in common and defended as such for centuries —
 * the moot green, the militia mustering ground, the churchyard glebe, the burgage
 * back-paddock. Enclosure was a legal event, not an accident of growth. So the claim is
 * RESERVED BEFORE GROWTH and every later stage refuses it: the anchor sampler will not
 * anchor in it, accretion will not lobe into it, the partition carves it out of the inside
 * mask, and the parcel packer forbids it. The green then appears in the umbrella trace as a
 * genuine HOLE, by construction rather than by luck.
 *
 * ⭐ AND IT IS SELF-HONEST ABOUT ENCLOSURE. Carving the claim does not ASSERT that the
 * result is an interior green: the boundary trace decides, because an enclosed hole and an
 * open bay come back with opposite windings. A claim the fabric never surrounded simply
 * renders as a notch in the edge — common grazing on the town's skirt, which is exactly
 * what it would have been. Nothing is faked and nothing is asserted that was not traced.
 *
 * ⭐ THE INERTIA LAW HOLDS because the claim reads only STAGE-0/1 FACTS: the nucleus, the
 * extent, the tier, and the SET of district categories (a set, never a count of members).
 * Opening one shop cannot move a common — which is correct twice over, since moving a
 * common required an Act.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare, no Math.pow.
 */

import { fabricRng, hashUnit } from './fabricRng.js';
import { compareKeys } from './lineage.js';
import { TRIG_N, cosI, sinI, organicBlob } from './fabricGeometry.js';
import { VIEW, sampleAt } from './substrate.js';
import { refusalAt, scarpCost } from './groundRefusal.js';
import { isFarBank, isInWater } from './waterMode.js';
import { CATEGORY_RING } from './organisms.js';

/**
 * HOW MANY COMMONS a tier can hold, and how big each one is as a share of the built
 * extent. §42/§43 VALUES, PROPOSED-WITH-RATIONALE:
 *
 *  count   a thorp's whole footprint is smaller than one town common, and its open ground
 *          IS the countryside it sits in — so the bottom of the ladder reserves none and
 *          the green at its fork is the §5 square, not a common. A village has ONE green;
 *          a town one or two; a city and a metropolis several, because a large town's
 *          quarters each kept their own open ground.
 *  radius  as a share of the built extent. The floor is what makes a common read as a
 *          common rather than as a missing building: below about a tenth of the extent the
 *          hole is a courtyard, and courtyards belong to the block, not to the town.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const COMMONS_TIER = Object.freeze({
  thorp:      { count: 0, radius: 0 },
  hamlet:     { count: 0, radius: 0 },
  village:    { count: 1, radius: 0.150 },
  town:       { count: 2, radius: 0.135 },
  city:       { count: 3, radius: 0.115 },
  metropolis: { count: 3, radius: 0.100 },
});

/**
 * THE RESERVATION RING — how far out a common sits, as a share of the built extent.
 *
 * §42/§43 VALUE, DERIVED from where it has to be to be ENCLOSED. The organism anchors run
 * on rings 0.12 (civic) to 0.75 (industrial); a claim inside 0.20 collides with the market
 * square at the heart, and one beyond 0.55 sits at the fabric's own fringe where nothing
 * will ever surround it — it becomes a bay, not a hole. The band between is the ground a
 * growing town encircles.
 */
export const COMMONS_RING = Object.freeze({ lo: 0.24, hi: 0.52 });

/** A common is FLAT and DRY GROUND — it is grazed, mustered on, and played on. These are
 * the same substrate refusals the organisms use, at the thresholds open ground implies. */
/**
 * ⚠ THE COMMON'S OWN EXTRA STRICTNESS, ON TOP OF `groundRefusal`'s shared law — never a
 * second opinion about it. `maxScarp` is a share of the way from `REFUSAL.scarp` to
 * `REFUSAL.crag`: a muster field or a grazing common wants ground gentler than the ground a
 * house will merely stand on, and 0.55 says "rather more than half way to the refusal is
 * already too much". ⚠ UNSOAKED. `maxSlope` is GONE: it was a normalized-unit threshold and
 * groundRefusal.js's header measures what that cost.
 */
export const COMMONS_GROUND = Object.freeze({ maxScarp: 0.55, maxWet: 0.55 });

/**
 * @typedef {Object} Common
 * @property {string} key
 * @property {number} x
 * @property {number} y
 * @property {number} r
 * @property {Array<[number,number]>} polygon
 * @property {number} bearing      the compass slot it was reserved in
 * @property {string} kind         'green' | 'common' | 'paddock'
 * @property {string} reason
 */

/** Trig-free compass slot of a vector (the L1 diamond angle — monotone in the true angle
 * and exact in IEEE ops, so it partitions the circle identically on every platform). */
function compassSlot(dx, dy) {
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d <= 0) return 0;
  const x = dx / d, y = dy / d;
  const ax = x < 0 ? -x : x, ay = y < 0 ? -y : y;
  const t = ax + ay > 0 ? ay / (ax + ay) : 0;
  const diamond = x >= 0 ? (y >= 0 ? t : 4 - t) : (y >= 0 ? 2 - t : 2 + t);
  const slot = Math.floor((diamond / 4) * 16);
  return slot < 0 ? 0 : slot > 15 ? 15 : slot;
}

/**
 * RESERVE THE COMMONS.
 *
 * ⭐ THE BEARINGS ARE THE GAPS BETWEEN THE QUARTERS' OWN COMPASS SLOTS. §5.0c anchors each
 * category on a ring AND a compass quarter (`CATEGORY_RING[c].dir`); the slots the
 * settlement's categories do NOT claim are the bearings along which no quarter is coming.
 * Reserving there is the same fact §5.0c.3 states — "where they haven't met" — decided in
 * advance from the roster instead of hoped for afterwards from the geometry.
 *
 * @param {Object} args
 * @param {{x:number,y:number}} args.nucleus
 * @param {number} args.extent                  the built radius
 * @param {string} args.tier
 * @param {string[]} args.categories            the district categories present
 * @param {import('./substrate.js').Substrate} args.sub
 * @param {import('./waterMode.js').WaterRelationship} args.water
 * @param {{ seed: string|number, variant?: number }} args.seeding
 * @returns {{ commons: Common[], notes: string[] }}
 */
export function reserveCommons(args) {
  const { nucleus, extent, tier, categories, sub, water, seeding } = args;
  const prof = COMMONS_TIER[tier] || COMMONS_TIER.village;
  /** @type {string[]} */ const notes = [];
  if (!prof.count || extent <= 0) {
    return {
      commons: [],
      notes: [`no common reserved: at ${tier} the settlement's open ground IS the countryside around it, and its green is the §5 square at the fork`],
    };
  }

  // The compass slots the quarters have claimed. A SET of categories, never a count of
  // members — see the inertia note in this file's header.
  const claimed = new Set();
  for (const c of [...new Set(categories)].sort(compareKeys)) {
    const ring = CATEGORY_RING[String(c).toLowerCase()];
    if (ring && ring.dir != null) {
      claimed.add(ring.dir);
      claimed.add((ring.dir + 1) % 16);
      claimed.add((ring.dir + 15) % 16);
    }
  }
  /** @type {number[]} */ const gaps = [];
  for (let s = 0; s < 16; s++) if (!claimed.has(s)) gaps.push(s);
  // A settlement whose categories claim every bearing has genuinely met itself all the way
  // round: no common is reserved and its frontiers are seam streets. Recorded, not forced.
  if (!gaps.length) {
    return {
      commons: [],
      notes: ['no common reserved: the settlement\'s quarters claim every compass bearing — its organisms met all the way round and their frontiers are seam streets (§5.0c.3\'s other arm)'],
    };
  }

  const rng = fabricRng(seeding.seed, 'commons', { variant: seeding.variant });
  /** @type {Common[]} */ const commons = [];
  const want = Math.min(prof.count, gaps.length);

  // Walk the gaps in a seeded but total order, so which bearing gets the common is a
  // settlement fact rather than a scan artefact.
  const ordered = gaps
    .map((s) => ({ s, h: hashUnit(`${String(seeding.seed)}|common|slot|${s}`) }))
    .sort((a, b) => (a.h - b.h) || (a.s - b.s))
    .map((r) => r.s);

  for (const slot of ordered) {
    if (commons.length >= want) break;
    const key = `common.${slot}`;
    // The bearing's own direction, at the slot's centre, with a bounded seeded wobble
    // inside the slot — a common is not surveyed onto a compass point.
    const ang = Math.round(((slot + 0.5) / 16) * TRIG_N) + rng.int(-2, 2);
    const ring = COMMONS_RING.lo + (COMMONS_RING.hi - COMMONS_RING.lo) * rng.next();
    const r = extent * prof.radius * (0.84 + hashUnit(`${key}|r`) * 0.34);
    const x = nucleus.x + cosI(ang) * extent * ring;
    const y = nucleus.y + sinI(ang) * extent * ring;

    // THE GROUND STILL DECIDES. A claim in the channel, on the far bank, up a scarp or in
    // a bog is not a common — it is a refusal, and it is recorded as one.
    if (x < r + 12 || y < r + 12 || x > VIEW - r - 12 || y > VIEW - r - 12) {
      notes.push(`common at slot ${slot} REFUSED: the claim runs off the leaf`);
      continue;
    }
    if (isInWater(water, x, y) || isFarBank(water, x, y)) {
      notes.push(`common at slot ${slot} REFUSED: the ground is water or the far bank`);
      continue;
    }
    // ⭐ ONE HOME (§5 W1 exit 2). The absolute refusal comes from groundRefusal.js; the
    // COMMONS_GROUND rows survive as the common's OWN extra strictness (a muster field is
    // flatter and drier than a house plot), stated as a margin ON TOP of the shared law
    // rather than as a second opinion about where the crag is.
    {
      const refusal = refusalAt(sub, x, y);
      if (refusal) {
        notes.push(`common at slot ${slot} REFUSED: the ground refuses a body here (${refusal})`);
        continue;
      }
      if (scarpCost(sub, x, y) > COMMONS_GROUND.maxScarp) {
        notes.push(`common at slot ${slot} REFUSED: too steep to graze or muster on (scarp cost ${scarpCost(sub, x, y).toFixed(2)} of the refusal)`);
        continue;
      }
      if (sampleAt(sub, sub.wet, x, y) > COMMONS_GROUND.maxWet) {
        notes.push(`common at slot ${slot} REFUSED: standing water — this is marsh, not common`);
        continue;
      }
    }
    // Never two commons on top of each other.
    let clash = false;
    for (const c of commons) {
      const dx = c.x - x, dy = c.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < (c.r + r) * 1.05) { clash = true; break; }
    }
    if (clash) { notes.push(`common at slot ${slot} REFUSED: it overlaps one already reserved`); continue; }

    const blobRng = fabricRng(seeding.seed, key, { variant: seeding.variant });
    commons.push({
      key,
      x, y, r,
      polygon: organicBlob(x, y, r, blobRng, { steps: 16, rough: 0.20 }),
      bearing: slot,
      kind: commons.length === 0 && (tier === 'village' || tier === 'town') ? 'green' : commons.length === 2 ? 'paddock' : 'common',
      reason: `reserved on compass slot ${slot}, a bearing no quarter claims, at ${(ring * 100).toFixed(0)}% of the built extent — ground held in common before the fabric grew, so nothing may be built on it`,
    });
  }

  if (!commons.length) notes.push('every reserved bearing was refused by the ground — this settlement has no interior common, and that is the ground\'s answer, not a missing feature');
  return { commons, notes };
}

/**
 * The predicate every later stage consults. Kept here, beside the reservation, so a new
 * consumer cannot invent its own slightly-different idea of what "in a common" means.
 * @param {Common[]} commons @param {number} x @param {number} y @param {number} [pad]
 * @returns {boolean}
 */
export function inCommons(commons, x, y, pad = 0) {
  for (const c of commons) {
    const dx = x - c.x, dy = y - c.y;
    const rr = c.r + pad;
    if (dx * dx + dy * dy < rr * rr) return true;
  }
  return false;
}

/**
 * THE ENCLOSURE READ — reported, never asserted. For each common, what share of a ring
 * just outside it is built-up ground? A claim the fabric surrounded on every side is an
 * interior green; one it surrounded on half its circumference is a bay on the town's edge.
 * The umbrella trace is what actually DECIDES which it is (a hole and a bay come back with
 * opposite windings); this exists so the receipt can say WHY.
 * @param {Common[]} commons
 * @param {(x:number,y:number)=>boolean} inside
 * @returns {Array<{ key:string, enclosure:number, enclosed:boolean }>}
 */
export function enclosureRead(commons, inside) {
  return commons.map((c) => {
    let hit = 0;
    const N = 24;
    for (let i = 0; i < N; i++) {
      const a = Math.round((i * TRIG_N) / N);
      const rr = c.r * 1.28;
      if (inside(c.x + cosI(a) * rr, c.y + sinI(a) * rr)) hit++;
    }
    const enclosure = hit / N;
    return { key: c.key, enclosure, enclosed: enclosure >= 0.92 };
  });
}
