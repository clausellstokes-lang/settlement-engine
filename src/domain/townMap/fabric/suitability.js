/**
 * domain/townMap/fabric/suitability.js — SITES ARE FOUND, NOT PLACED (§5.-1.2/.3).
 *
 * A suitability field is rolled over the §5.-1 substrate, and the settlement takes its
 * nucleus from the BEST site — or its NUCLEI from the best several when more than one
 * strong site exists. Nobody chooses where a town begins; the ground does, and people
 * agree with it.
 *
 * ⭐⭐ THE POLYCENTRIC SUBSEED LAW (§5.-1.3, the owner's example adopted verbatim as
 * mechanism). When two viable sites are NOT adjacent — the defensible rise and the river
 * landing, the ford and the crossroads — a road connects them FIRST, and that road
 * becomes a new growth subseed: ribbon development accretes along it and the town matures
 * as a dumbbell or a linear polycentric form. ONE-SITE TOWNS CLUSTER; TWO-SITE TOWNS
 * STRETCH. This is where real towns get their shapes, and it is the single mechanism
 * that stops every settlement in the corpus from being a blob with a different outline.
 *
 * WHAT MAKES A SITE GOOD — five terms, each an argument about why people actually
 * settled where they did, and each reading the substrate rather than a preference:
 *   DRY      you cannot build on a marsh; the wetness field says where the marsh is
 *   LEVEL    you can build on a slope, but every degree costs, so flat wins
 *   WATERED  you must be able to REACH water — near the channel, not in it
 *   DEFENSIBLE  local prominence: standing above your neighbours is worth a great deal
 *   OPEN     room to grow; a site hemmed by steep ground cannot become a town
 *
 * Their WEIGHTS come from the settlement's own facts (a fortified dossier weights
 * defence; a fishery weights water), so two settlements on the same ground still find
 * different sites — which is the truth-bound half of "found, not placed".
 *
 * DETERMINISM: pure. The field is a function of the substrate and the dossier; the
 * site ROLL is a bounded seeded choice among the top candidates, drawn from an
 * entity-keyed fork (§11.0), never from a shared stream.
 */

import { fabricRng, hashUnit } from './fabricRng.js';
import { VIEW, sampleAt } from './substrate.js';
import { buildableAt, scarpCost } from './groundRefusal.js';

/**
 * SITE-TERM WEIGHTS by settlement character. §42/§43 VALUES, PROPOSED-WITH-RATIONALE.
 * The base row is the historical default — dry and level dominate because they are the
 * two that stop you building at all. Modifiers ADD to the base when the dossier says so.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, { dry:number, level:number, watered:number, defensible:number, open:number }>>}
 */
export const SITE_WEIGHTS = Object.freeze({
  base:      { dry: 1.00, level: 0.90, watered: 0.70, defensible: 0.45, open: 0.55 },
  walled:    { dry: 0, level: -0.20, watered: 0, defensible: 0.85, open: -0.10 },
  water:     { dry: -0.15, level: 0, watered: 0.85, defensible: 0, open: 0 },
  trade:     { dry: 0, level: 0.25, watered: 0.10, defensible: -0.10, open: 0.45 },
  extractive:{ dry: 0, level: -0.30, watered: 0, defensible: 0.10, open: -0.15 },
});

/**
 * How far apart two sites must be before they are a POLYCENTRIC PAIR rather than one
 * site with a wobble, as a fraction of the frame. §42/§43 VALUE, DERIVED: below this
 * the two nuclei's own growth lobes overlap from the first generation and the result is
 * one cluster with a lumpy edge — which is a one-site town, correctly. Above it the
 * connecting road is longer than either nucleus's initial reach, so ribbon development
 * along it is a visible third thing: the dumbbell.
 * Measured against the accretion radii the tier grammar produces: an initial lobe at
 * town scale reaches ~0.09 of the frame, so two nuclei must clear ~2.2 lobe radii.
 */
export const POLYCENTRIC_SEPARATION = 0.20;

/** How many candidate sites the field is reduced to before the seeded choice. Enough
 * that the roll is a real choice; few enough that the choice is always among genuinely
 * good ground. */
const CANDIDATE_POOL = 12;

/** The exclusion radius around a taken site, as a fraction of the frame — a second
 * nucleus cannot be found inside the first one's own ground. */
const SITE_EXCLUSION = 0.14;

/**
 * How much of a cell's site value the scarp cost may take, at the refusal boundary.
 * §42/§43 VALUE, ARGUED: it must not reach 1 — ground one step short of the refusal is
 * still ground people built on, terraced and at a price, and zeroing it would make the
 * refusal a cliff in the SCORE as well as in the land, which is how a settlement comes to
 * stop dead at a contour. 0.62 leaves the worst legal ground worth about a third of the
 * best. ⚠ UNSOAKED; rides the tuning signature.
 */
export const SCARP_THINNING = 0.62;

/** Clamp to 0..1. */
function unit(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/**
 * The settlement's site-weight profile: the base row plus every modifier its own facts
 * invoke. Deterministic and additive, so the reasons are legible in the result.
 * @param {any} settlement
 * @param {{ hasWalls?: boolean, waterKind?: string|null }} facts
 * @param {import('./substrate.js').Substrate} sub
 * @returns {{ weights: { dry:number, level:number, watered:number, defensible:number, open:number }, reasons: string[] }}
 */
export function siteWeights(settlement, facts, sub) {
  const w = { ...SITE_WEIGHTS.base };
  /** @type {string[]} */ const reasons = ['base'];
  const add = (row, why) => {
    for (const k of Object.keys(row)) w[k] += row[k];
    reasons.push(why);
  };
  if (facts.hasWalls) add(SITE_WEIGHTS.walled, 'defenseProfile: walled');
  if (facts.waterKind) add(SITE_WEIGHTS.water, `water: ${facts.waterKind}`);
  const access = String(settlement?.config?.tradeRouteAccess || '').toLowerCase();
  if (/cross|major|critical|excellent|good|port|river/.test(access)) add(SITE_WEIGHTS.trade, `tradeRouteAccess: ${access}`);
  for (const c of sub.resourceContracts) {
    if (c.needs === 'workable-slope' || c.needs === 'exposed-stone') {
      add(SITE_WEIGHTS.extractive, `resource: ${c.key}`);
      break;
    }
  }
  for (const k of Object.keys(w)) if (w[k] < 0) w[k] = 0;
  return { weights: w, reasons };
}

/**
 * @typedef {Object} SuitabilityField
 * @property {number} n
 * @property {number} cell
 * @property {Float64Array} score   0..1 per cell
 * @property {{ dry:number, level:number, watered:number, defensible:number, open:number }} weights
 * @property {string[]} reasons
 */

/**
 * Roll the suitability field over the substrate.
 * @param {import('./substrate.js').Substrate} sub
 * @param {any} settlement
 * @param {{ hasWalls?: boolean, waterKind?: string|null }} facts
 * @returns {SuitabilityField}
 */
export function suitabilityField(sub, settlement, facts) {
  const { weights, reasons } = siteWeights(settlement, facts, sub);
  const n = sub.n;
  const score = new Float64Array(n * n);

  // PROMINENCE: how far this cell stands above the mean of its neighbourhood. A ring
  // sample at two cells' distance is the smallest radius at which "on a rise" is
  // distinguishable from "on a bump", and it costs eight reads.
  const prominence = new Float64Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = j * n + i;
      let sum = 0, count = 0;
      for (let dj = -2; dj <= 2; dj += 2) {
        for (let di = -2; di <= 2; di += 2) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di, nj = j + dj;
          if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
          sum += sub.height[nj * n + ni]; count++;
        }
      }
      prominence[k] = count ? unit(0.5 + (sub.height[k] - sum / count) * 4) : 0.5;
    }
  }

  // OPENNESS: the share of the neighbourhood that is buildable at all. A shelf with a
  // cliff behind it scores high on level and low here, and correctly loses to a plain.
  const openness = new Float64Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      let ok = 0, count = 0;
      for (let dj = -3; dj <= 3; dj++) {
        for (let di = -3; di <= 3; di++) {
          const ni = i + di, nj = j + dj;
          if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
          const nk = nj * n + ni;
          if (sub.slope[nk] < 0.55 && sub.wet[nk] < 0.55) ok++;
          count++;
        }
      }
      openness[j * n + i] = count ? ok / count : 0;
    }
  }

  // WATERED: proximity to flow WITHOUT being in it. The peak sits just off the channel,
  // which is where the landing, the mill and the washing place actually are — and it is
  // why a settlement's core never renders in its own river.
  const wTotal = weights.dry + weights.level + weights.watered + weights.defensible + weights.open || 1;
  for (let k = 0; k < n * n; k++) {
    const wetness = sub.wet[k];
    const dry = 1 - unit(wetness / 0.55);
    const level = 1 - unit(sub.slope[k] / 0.70);
    const near = unit(sub.flow[k] / 0.30);
    const inIt = unit((wetness - 0.55) / 0.30);
    const watered = unit(near * (1 - inIt));
    score[k] = unit((
      dry * weights.dry
      + level * weights.level
      + watered * weights.watered
      + prominence[k] * weights.defensible
      + openness[k] * weights.open
    ) / wTotal);
  }

  // ⛔⛔ §5 W1 EXIT 2 · THE GROUND'S OWN REFUSAL IS AN ABSOLUTE, NOT A TERM.
  // The `level` term above discourages slope and the `dry` term discourages wet, and
  // "discourages" is exactly what a crag is not: a sufficiently strong `defensible` bonus
  // (a walled dossier weights it 1.30) can and does outscore a `level` term all the way to
  // 0, which is how a settlement comes to be proposed on ground it cannot stand on. The
  // refusal is therefore a MULTIPLY-BY-ZERO in the same place the sea already is.
  // ⭐ AND THE THINNING IS THE OTHER HALF OF §5's SENTENCE — "stops at the crag, THINS ON
  // THE SLOPE" — so the scarp cost is applied here too, from the same two numbers, rather
  // than left to the `level` term's own unrelated 0.70 divisor.
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = j * n + i;
      const x = (i + 0.5) * sub.cell, y = (j + 0.5) * sub.cell;
      if (!buildableAt(sub, x, y)) { score[k] = 0; continue; }
      score[k] *= 1 - scarpCost(sub, x, y) * SCARP_THINNING;
    }
  }

  // ⛔ THE OTHER ABSOLUTE: with a traced sea body the ground under the water must score
  // ZERO, or a strong-enough defensible bonus can put a nucleus offshore.
  if (facts && typeof facts.exclude === 'function') {
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        if (facts.exclude((i + 0.5) * sub.cell, (j + 0.5) * sub.cell)) score[j * n + i] = 0;
      }
    }
  }

  // A settlement never sits ON the frame edge — the countryside has to run past it.
  const margin = Math.max(2, Math.round(n * 0.10));
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      if (i < margin || j < margin || i >= n - margin || j >= n - margin) score[j * n + i] *= 0.25;
    }
  }

  // ⛔⛔ TWO FIELDS, NOT ONE — AND CONFLATING THEM WAS A REAL DEFECT WITH A MEASURED COST.
  //
  // `ground` is what the LAND is worth. `score` is `ground` times a CARTOGRAPHIC centring
  // term, and the two answer different questions:
  //
  //   • WHERE DOES THE SETTLEMENT SIT ON THE LEAF?  A surveyor drawing ONE town draws it in
  //     the middle of the sheet, so the nucleus search reads `score`. (Without it the town
  //     runs off the edge of its own page while two thirds of the leaf carries empty
  //     countryside — the composition defect MF-B1 found by looking, and its cure stands.)
  //   • WHERE DOES A QUARTER SIT INSIDE ITS OWN TOWN?  Nothing whatever to do with the
  //     middle of the page. A tannery is downwind of the market; the page has no opinion.
  //
  // MF-B1 applied the centring to the ONE field both consumers read, so every district
  // anchor was dragged toward the leaf's middle as well. MEASURED: the §161c siting table
  // spreads its rings from 0.12 to 0.75 with a mean near 0.44, and the anchors came back at
  // a mean of 0.33 — the quarters bunched in the core, the union never reached the extent
  // the tier grammar had sized, and city and metropolis both fell short of their §5 bands
  // (0.61 and 0.41 of the intended footprint disc). It reads as a tuning problem and it is
  // a plumbing one. ⭐ THE CLASS: when one derived field serves two consumers with different
  // frames of reference, the term that is right for one is a silent bias in the other.
  const cx = (n - 1) / 2, cy = (n - 1) / 2;
  const norm = cx * cx + cy * cy;
  const ground = new Float64Array(score);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const dx = i - cx, dy = j - cy;
      const t = (dx * dx + dy * dy) / norm;              // 0 at the centre, 1 at a corner
      score[j * n + i] *= 1 - t * 0.62;
    }
  }

  return { n, cell: sub.cell, score, ground, weights, reasons };
}

/** Suitability at a view-space point — THE GROUND'S OWN VALUE, without the leaf-composition
 * term. Every consumer that asks "is this buildable" wants this one; only the nucleus
 * search wants `score`. See the two-fields note above. */
export function suitabilityAt(field, x, y) {
  const f = field.ground || field.score;
  return sampleAt(/** @type {any} */ ({ n: field.n, cell: field.cell }), f, x, y);
}

/**
 * ⭐⭐⭐ §5 W1 EXIT 6 · THE WATER-BLIND SEAT — where this ground would seat a settlement
 * BEFORE any water is drawn on it.
 *
 * ⛔⛔ WHY THIS EXISTS RATHER THAN "USE THE NUCLEUS", and the reason is a CYCLE, not taste.
 * §5 W1 exit 6 asks for the shoreline's detail term to be damped **where the settlement works
 * its waterfront** — so the water needs to know where the town is. But the town's nucleus is
 * found by a suitability field that READS the water (its body is an absolute exclusion, and
 * `watered` is one of the five terms), and the water is derived at Stage 0 from the substrate
 * alone. Keying the damping on the nucleus would make Stage 0 depend on Stage 2.
 *
 * ⛔ AND THE OBVIOUS ESCAPE IS WORSE. `model.skeleton.anchor` is available at Stage 0 and was
 * the first spelling — MEASURED across the corpus, it is **`(500, 500)` on ten of eleven
 * distinct sites**, i.e. the middle of the page. Damping the shore at the frame centre is a
 * term that happens to be near the right answer, which is precisely the class `findNuclei`'s
 * own ROOM-LAW note convicts: *"a term that happens to prevent a failure is not the same as a
 * rule that forbids it."*
 *
 * ⭐ THE SEAT IS THEREFORE THE ARGMAX OF THE SAME SITE FIELD WITH THE WATER'S TERMS ABSENT:
 * dry, level, defensible and open, over this leaf's own ground. It is a real derivation from
 * the substrate, it has no dependency on the traced channel or the traced shore, and it says
 * exactly what it means — **the best ground this leaf offers, which is where the settlement
 * will be within the reach the damping cares about.** It is an APPROXIMATION of the nucleus
 * and is named as one; a pin holds it within the built radius of the nucleus actually found.
 *
 * @param {SuitabilityField} field  a field built with `exclude: null` (water-blind)
 * @returns {{ x:number, y:number, score:number, reason:string }}
 */
export function waterBlindSeat(field) {
  const n = field.n;
  let best = 0;
  for (let k = 1; k < n * n; k++) if (field.score[k] > field.score[best]) best = k;
  const i = best % n, j = (best - i) / n;
  return {
    x: (i + 0.5) * field.cell,
    y: (j + 0.5) * field.cell,
    score: field.score[best],
    reason: '§5 W1 exit 6: the WATER-BLIND SEAT — the best ground this leaf offers before any '
      + 'water is drawn on it. Used only to damp the water\'s DETAIL scale at the worked '
      + 'waterfront; it decides nothing about where the settlement actually goes.',
  };
}

/**
 * @typedef {Object} Nucleus
 * @property {string} key         a stable entity key ('nucleus.0', 'nucleus.1', …)
 * @property {number} x
 * @property {number} y
 * @property {number} score       its suitability
 * @property {string} kind        'primary' | 'secondary'
 * @property {string} reason      why the ground chose it
 */

/**
 * FIND THE NUCLEI. The best site is taken first; further sites are admitted only when
 * they are BOTH strong in their own right AND far enough away to be a second place
 * rather than the same place (POLYCENTRIC_SEPARATION).
 *
 * The count is BOUNDED BY TIER because a thorp has one place and a city has several —
 * but it is DECIDED BY THE GROUND: a town whose land offers only one good site gets one
 * nucleus and clusters, and that is the correct map, not a failure to reach its bound.
 *
 * @param {SuitabilityField} field
 * @param {import('./substrate.js').Substrate} sub
 * @param {{ seed: string|number, variant?: number }} seeding
 * @param {{ maxNuclei: number, secondaryFloor: number }} bounds
 * @returns {Nucleus[]}
 */
export function findNuclei(field, sub, seeding, bounds) {
  const n = field.n;
  const rng = fabricRng(seeding.seed, 'nuclei', { variant: seeding.variant });

  // Rank every cell, then reduce to a candidate pool. Ties break on index, so the
  // ordering is total and reproducible.
  const toXY = (k) => {
    const i = k % n, j = (k - i) / n;
    return [(i + 0.5) * field.cell, (j + 0.5) * field.cell];
  };

  // ⭐⭐ §15.2 THE CORRIDOR PULL — "the crossroads exists before the crossroads town."
  // The regional route skeleton is built BEFORE this search (see routes.js), and a site on
  // a corridor, or at a crossing of two, is worth more than the same ground off it. The
  // pull is a MULTIPLIER on the site score and nothing else.
  //
  // ⚠ IT IS APPLIED HERE AND NOT INSIDE THE FIELD, WHICH IS MF-B1b's TWO-CONSUMERS LAW
  // OBEYED RATHER THAN RE-BROKEN. `field.ground` answers "what is this land worth" for
  // every consumer including each district anchor; `field.score` adds the cartographic
  // leaf-centring for the site search alone. Folding the corridor term into either would
  // drag every quarter's anchor onto the trade road — a §161c ring table quietly overruled
  // by a term meant for the FOUNDING. §15.2's claim is about where the town began, not
  // about where its tannery sits.
  const pull = typeof bounds.pull === 'function' ? bounds.pull : null;

  // ⛔⛔ THE ROOM LAW, AND IT IS A MISSING CONSTRAINT RATHER THAN A TUNING VALUE.
  // A FOUNDING SITE MUST HAVE ROOM FOR THE SETTLEMENT IT WILL BECOME. Nothing in the site
  // search knew the extent the tier grammar had already sized, so a cell 120 units from the
  // frame could win the founding for a settlement whose own built radius is 442 — and then
  // every lobe on that side was refused by the accretion's frame margin and the umbrella
  // came back a squashed band along the bottom of the leaf. MEASURED: the metropolis
  // founded itself at y=880, all eight quarters anchored between y=839 and y=891, and the
  // tier rendered at 38.6% of the frame against a 58–72% band.
  //
  // ⚠ IT SURFACED WHEN §15.2's CORRIDOR PULL LANDED, AND IT WAS NOT CAUSED BY IT. The
  // leaf-composition term had been the only thing keeping the founding near the middle —
  // a COMPOSITION preference doing a GEOMETRIC constraint's job, which works exactly until
  // something legitimate outweighs it. ⭐ THE CLASS, and it is MF-B1b's two-consumers class
  // once more: a term that happens to prevent a failure is not the same as a rule that
  // forbids it, and the day another term outweighs it the failure arrives looking like the
  // new term's fault.
  const margin = Number.isFinite(bounds.margin) ? bounds.margin : 0;

  /** @type {Float64Array} */ const siteScore = new Float64Array(n * n);
  for (let k = 0; k < n * n; k++) {
    const [x, y] = toXY(k);
    if (margin > 0 && (x < margin || y < margin || x > VIEW - margin || y > VIEW - margin)) {
      siteScore[k] = 0;
      continue;
    }
    siteScore[k] = pull ? field.score[k] * pull(x, y) : field.score[k];
  }

  /** @type {number[]} */ const idx = [];
  for (let k = 0; k < n * n; k++) idx.push(k);
  idx.sort((a, b) => (siteScore[b] - siteScore[a]) || (a - b));

  /** @type {Nucleus[]} */ const nuclei = [];
  const exclusion = VIEW * SITE_EXCLUSION;
  const separation = VIEW * POLYCENTRIC_SEPARATION;
  const best = siteScore[idx[0]] || 1;

  // ── PRIMARY: a seeded choice among the top candidates. Taking the strict argmax
  //    would make the nucleus a function of the substrate alone, so two settlements on
  //    the same seed-family ground would begin at the same spot; a bounded roll over
  //    genuinely good candidates keeps the ground in charge and the settlement distinct.
  const pool = idx.slice(0, CANDIDATE_POOL).filter((k) => siteScore[k] > 0);
  const primaryK = pool.length ? pool[rng.weighted(pool.map((k) => ({ weight: siteScore[k] ** 3 })))] : idx[0];
  const [px, py] = toXY(primaryK);
  nuclei.push({
    key: 'nucleus.0',
    x: px,
    y: py,
    score: siteScore[primaryK],
    kind: 'primary',
    reason: `best site: ${field.reasons.join(' + ')}`,
  });

  // ── SECONDARIES: strong enough, and far enough to be a SECOND PLACE.
  for (const k of idx) {
    if (nuclei.length >= bounds.maxNuclei) break;
    if (siteScore[k] < best * bounds.secondaryFloor) break;   // ranked: the rest are worse
    const [x, y] = toXY(k);
    let tooNear = false;
    for (const nu of nuclei) {
      const dx = x - nu.x, dy = y - nu.y;
      if (Math.sqrt(dx * dx + dy * dy) < separation) { tooNear = true; break; }
    }
    if (tooNear) continue;
    // A secondary must also clear the exclusion of every OTHER candidate already taken,
    // which the separation test above already guarantees; the exclusion constant remains
    // the floor for anything that later wants to sit "at" a nucleus.
    nuclei.push({
      key: `nucleus.${nuclei.length}`,
      x,
      y,
      score: field.score[k],
      kind: 'secondary',
      reason: `a second viable site ${Math.round(Math.sqrt((x - px) * (x - px) + (y - py) * (y - py)))} units off — the ground offered two`,
    });
  }
  void exclusion;
  return nuclei;
}

/**
 * @typedef {Object} Subseed
 * @property {string} key
 * @property {[number, number]} from
 * @property {[number, number]} to
 * @property {Array<[number, number]>} line   the connecting road, terrain-bounded
 * @property {number} length
 */

/**
 * THE CONNECTING ROADS — built BEFORE any growth, because that is the order history
 * used: two viable sites, a road between them, and then the town grows along the road.
 *
 * The road is TERRAIN-BOUNDED, not a straight line: it is walked in fixed steps from one
 * nucleus toward the other, at each step choosing the small lateral offset with the
 * gentlest grade and the least wetness. That is a drover's road — it aims at where it is
 * going and takes the easy ground on the way, which is why real roads bend.
 *
 * @param {Nucleus[]} nuclei
 * @param {import('./substrate.js').Substrate} sub
 * @param {{ seed: string|number, variant?: number }} seeding
 * @returns {Subseed[]}
 */
export function connectingRoads(nuclei, sub, seeding) {
  /** @type {Subseed[]} */ const out = [];
  if (nuclei.length < 2) return out;
  const primary = nuclei[0];
  for (let i = 1; i < nuclei.length; i++) {
    const target = nuclei[i];
    const key = `subseed.${primary.key}~${target.key}`;
    const rng = fabricRng(seeding.seed, key, { variant: seeding.variant });
    /** @type {Array<[number, number]>} */ const line = [[primary.x, primary.y]];
    let cx = primary.x, cy = primary.y;
    const STEP = 18;
    for (let step = 0; step < 120; step++) {
      const dx = target.x - cx, dy = target.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < STEP) break;
      const ux = dx / d, uy = dy / d;
      // Three candidate steps: straight, and a bounded swing either side. The swing
      // magnitude shrinks as the road nears its target, so it arrives rather than
      // orbiting.
      const swing = 0.42 * Math.min(1, d / (STEP * 6));
      /** @type {Array<{ x:number, y:number, weight:number }>} */ const cands = [];
      for (const s of [-swing, 0, swing]) {
        const nx = ux - uy * s, ny = uy + ux * s;
        const l = Math.sqrt(nx * nx + ny * ny) || 1;
        const qx = cx + (nx / l) * STEP, qy = cy + (ny / l) * STEP;
        const grade = sampleAt(sub, sub.slope, qx, qy);
        const wetness = sampleAt(sub, sub.wet, qx, qy);
        // A road refuses steep and refuses standing water; among what is left it takes
        // the straightest option, which is the `s === 0` bonus.
        const weight = Math.max(0.001, (1 - grade) * (1 - wetness) * (s === 0 ? 1.5 : 1));
        cands.push({ x: qx, y: qy, weight });
      }
      const chosen = cands[rng.weighted(cands)];
      cx = chosen.x; cy = chosen.y;
      line.push([cx, cy]);
    }
    line.push([target.x, target.y]);
    let length = 0;
    for (let k = 0; k < line.length - 1; k++) {
      const ax = line[k + 1][0] - line[k][0], ay = line[k + 1][1] - line[k][1];
      length += Math.sqrt(ax * ax + ay * ay);
    }
    out.push({ key, from: [primary.x, primary.y], to: [target.x, target.y], line, length });
  }
  return out;
}

/**
 * RIBBON POINTS along the subseed roads — the growth attractors §5.-1.3 names. An
 * organism whose anchor lands near one of these accretes ALONG the road rather than
 * around a centre, which is what turns two nuclei into a dumbbell instead of two blobs.
 * @param {Subseed[]} subseeds @param {number} spacing @returns {Array<[number, number]>}
 */
export function ribbonPoints(subseeds, spacing) {
  /** @type {Array<[number, number]>} */ const pts = [];
  for (const s of subseeds) {
    let carry = 0;
    for (let i = 0; i < s.line.length - 1; i++) {
      const a = s.line[i], b = s.line[i + 1];
      const d = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
      carry += d;
      if (carry >= spacing) { carry = 0; pts.push([b[0], b[1]]); }
    }
  }
  return pts;
}

/** A stable per-site jitter that does not consume a stream — used where a site must be
 * nudged off an exact grid cell centre without coupling to any other draw. */
export function siteJitter(key, magnitude) {
  return [(hashUnit(`${key}|jx`) - 0.5) * 2 * magnitude, (hashUnit(`${key}|jy`) - 0.5) * 2 * magnitude];
}
