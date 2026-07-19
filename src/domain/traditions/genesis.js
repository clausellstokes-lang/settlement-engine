/**
 * domain/traditions/genesis.js — THE TRADITIONS wave (Engine Lift #4), slice T-1.
 *
 * `deriveFoundingTraditions(settlement)` — the ONE pure function that reconstructs
 * a settlement's FOUNDING traditions from its stable identity. It is the design's
 * MINT-TIME RULING made concrete (DESIGN_TRADITIONS §2): genesis is deterministic
 * from the settlement seed alone, so it can run BOTH view-time (the dossier preview
 * for a draft, this slice) AND tick-time (the T-2 mover's first-lit mint) and land
 * byte-identical. Because it never touches `generateSettlementPipeline` output, the
 * generator goldens are untouched by construction.
 *
 * PURITY (the townMap discipline, enforced by the src/domain eslint gates +
 * domain:strict): a true leaf — no store/React import, no Date, no Math.random, no
 * localeCompare. All entropy comes from a SEEDED PRNG forked off the settlement
 * seed (`${seed}::tradition:genesis`), with `.fork(label)` for every sub-draw, so
 * the same settlement yields the same set forever, on any device. Reads ONLY stable
 * settlement fields (seed, tier, terrain, culture, economic character, patron-deity
 * alignment axes) — never live campaign state. Zero settlement-object writes.
 *
 * GENESIS STATE SHAPE: every record leaves the campaign-time fields null/empty —
 * ownerKey/ownerKind (assigned by T-3 politics), lastHeldYear/lastOutcome (stamped
 * by the T-2 occurrence engine), mutationLog (grown by T-3), suppressedBy/
 * adoptedFrom (T-4 relations). This slice fills only the timeless facts: the id, the
 * immutable coreMotif, the name, the window, the scaleBand, the deity dedication,
 * and the expression. foundedYear is SETTLEMENT-RELATIVE (year 1 = the founding);
 * T-2 may rebase it to an absolute campaign year at mint (interface note in the
 * lane report).
 */

import { createPRNG } from '../../kernel/prng.js';
import { slugify } from '../../kernel/slugify.js';
import { resolveTerrain } from '../resolveTerrain.js';
import { evil01, chaos01 } from '../worldPulse/deityAxes.js';
import { seasonForTick } from '../worldPulse/worldState.js';
import { popToTier, TIER_ORDER } from '../../data/constants.js';
import {
  TRADITION_ELEMENTS, TRADITION_ACTS, TRADITION_NAME_TEMPLATES, TRADITION_ADJECTIVES,
  TRADITION_CULTURE_FLAVOR, TRADITION_TRAPPINGS, TRADITION_EPITHETS,
  TRADITION_SEASON_LABELS, WEEK_ORDINALS,
} from '../../data/traditionCorpus.js';

/**
 * @typedef {import('../../data/traditionCorpus.js').TraditionElement} TraditionElement
 * @typedef {import('../../data/traditionCorpus.js').TraditionAct} TraditionAct
 * @typedef {import('../../data/traditionCorpus.js').TraditionSeason} TraditionSeason
 */

/**
 * @typedef {Object} TraditionDeitySnapshot
 * The embedded patron-deity snapshot fields genesis reads (the embed-on-assign
 * bridge shape; deityAxes reads the two axis strings, dedication the ref).
 * @property {string} [_deityRef]
 * @property {string} [alignmentAxis]
 * @property {string} [lawAxis]
 *
 * @typedef {Object} TraditionSourceConfig
 * The stable config fields genesis reads. Loose by design — every field optional,
 * every read defensive. Terrain legs mirror resolveTerrain's chain.
 * @property {string} [culture]
 * @property {string} [tradeRouteAccess]
 * @property {string|null} [terrainType]
 * @property {string|null} [terrainOverride]
 * @property {string|null} [terrain]
 * @property {TraditionDeitySnapshot|null} [primaryDeitySnapshot]
 *
 * @typedef {Object} TraditionSourceSettlement
 * The stable identity fields genesis reads — a draft OR saved settlement. Loose by
 * design: every field optional; garbage falls through to seeded fallbacks, never a
 * throw. (Real settlements carry far more; structural typing admits them.)
 * @property {string|number} [_seed]
 * @property {string|number} [id]
 * @property {string} [tier]
 * @property {number} [population]
 * @property {TraditionSourceConfig|null} [config]
 * @property {TraditionDeitySnapshot|null} [primaryDeity]
 * @property {{ seed?: string }} [identity]
 */

/**
 * @typedef {Object} TraditionWindow
 * @property {number} startWeekOfYear  1..52 (canonical 4-4-5 week clock)
 * @property {number} weeks            1 or 2 (the observance's duration)
 *
 * @typedef {Object} TraditionMotif
 * @property {string} element  a TRADITION_ELEMENTS id (immutable forever)
 * @property {string} act      a TRADITION_ACTS id (immutable forever)
 *
 * @typedef {Object} TraditionExpression
 * @property {string[]} trappings  concrete festival dress (mutates at checkpoints, T-3)
 * @property {string}   epithet    a one-line flavour epithet
 *
 * @typedef {Object} TraditionRec
 * @property {string}  id           `tradition.<settlementSlug>.<index>` — unique within the set
 * @property {TraditionMotif} coreMotif  {element, act} — the immutable origin
 * @property {string}  name         the display name
 * @property {number}  foundedYear  settlement-relative founding year (1 = founding; T-2 rebases)
 * @property {TraditionWindow} window  the observance window
 * @property {number}  scaleBand    0..6, aligned to tier index; the current grandeur
 * @property {string|null} ownerKey  NULL at genesis (T-3 assigns)
 * @property {('faction'|'institution'|'seat'|null)} ownerKind  NULL at genesis (T-3 assigns)
 * @property {string|null} deityRef  the patron deity ref for devotional motifs, else null
 * @property {TraditionExpression} expression  {trappings, epithet}
 * @property {Array<{year:number, kind:string, cause:string}>} mutationLog  EMPTY at genesis (T-3 grows)
 * @property {number|null} lastHeldYear  NULL at genesis (T-2 stamps)
 * @property {string|null} lastOutcome   NULL at genesis (T-2 stamps)
 * @property {null|{overlordId:string, sinceYear:number, traded:TraditionRec}} suppressedBy  NULL at genesis (T-4)
 * @property {string|null} adoptedFrom  NULL at genesis (T-4)
 */

// ── Tier bands (design §2 count-by-tier + the 0..6 scale index) ──────────────
// TIER_ORDER (data/constants) is thorp..metropolis; 'capital' is a schema tier
// beyond it (settlement.schema Tier typedef) — mapped one band above metropolis.
/** @type {Readonly<Record<string, number>>} */
const TIER_INDEX = Object.freeze({ thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5, capital: 6 });
/** @type {Readonly<Record<string, readonly number[]>>} */
const COUNT_BAND = Object.freeze({
  thorp: Object.freeze([1, 2]), hamlet: Object.freeze([1, 2]), village: Object.freeze([2, 2]),
  town: Object.freeze([3, 3]), city: Object.freeze([4, 5]), metropolis: Object.freeze([5, 7]),
  capital: Object.freeze([6, 8]),
});
/** @type {Readonly<Record<TraditionSeason, number>>} */
const SEASON_START0 = Object.freeze({ spring: 0, summer: 13, autumn: 26, winter: 39 });
// Synthesized settlement age (years) by tier index — older/larger reads older. The
// founding core dates to year 1; additions spread across the settlement's life.
/** @type {ReadonlyArray<number>} */
const AGE_BY_TIER = Object.freeze([8, 20, 45, 90, 170, 280, 380]);

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
function clampInt(x, lo, hi) {
  const n = Math.round(Number.isFinite(x) ? x : lo);
  return n < lo ? lo : n > hi ? hi : n;
}

/**
 * Resolve the tier band index (0..6) from a settlement's tier label, falling back
 * to the population→tier map when the label is missing/unknown.
 * @param {TraditionSourceSettlement|null|undefined} settlement
 * @returns {{ tier: string, tierIndex: number }}
 */
function resolveTierBand(settlement) {
  const raw = typeof settlement?.tier === 'string' ? settlement.tier : '';
  if (raw && raw in TIER_INDEX) return { tier: raw, tierIndex: TIER_INDEX[raw] };
  const pop = typeof settlement?.population === 'number' ? settlement.population : 0;
  const fallback = TIER_ORDER.indexOf(popToTier(pop)) >= 0 ? popToTier(pop) : 'village';
  return { tier: fallback, tierIndex: TIER_INDEX[fallback] ?? 2 };
}

/**
 * The stable identity signals genesis reads. Terrain via the one canonical read;
 * economic character via the trade-route access (a stable config fact); alignment
 * via the patron-deity snapshot's two axes (0.5 = no signal); deityRef for
 * dedication. NO live campaign state.
 * @param {TraditionSourceSettlement|null|undefined} settlement
 */
function readIdentity(settlement) {
  /** @type {TraditionSourceConfig} */
  const cfg = settlement?.config || {};
  const deity = (cfg.primaryDeitySnapshot && typeof cfg.primaryDeitySnapshot === 'object')
    ? cfg.primaryDeitySnapshot
    : (settlement?.primaryDeity && typeof settlement.primaryDeity === 'object' ? settlement.primaryDeity : null);
  return {
    terrain: resolveTerrain(cfg),
    culture: typeof cfg.culture === 'string' ? cfg.culture : null,
    econ: typeof cfg.tradeRouteAccess === 'string' ? cfg.tradeRouteAccess : null,
    evil: deity ? evil01(deity) : 0.5,
    chaos: deity ? chaos01(deity) : 0.5,
    hasDeity: !!deity,
    deityRef: (deity && typeof deity._deityRef === 'string') ? deity._deityRef : null,
  };
}

/** @typedef {ReturnType<typeof readIdentity>} TraditionIdentity */

/** Economic characters that read as "market" for act weighting. */
const MARKET_ECON = Object.freeze(['crossroads', 'port', 'road']);

/**
 * Weight an element for an ADDITION draw, biased by the settlement identity.
 * @param {TraditionElement} el @param {TraditionIdentity} id @returns {number}
 */
function elementWeight(el, id) {
  let w = el.foundingFit ? 0.25 : 1; // origin elements rarely recur as additions
  if (id.terrain && el.terrains.includes(id.terrain)) w += 3;
  if (id.econ && el.econ.includes(id.econ)) w += 2;
  if (el.deityFit) w += id.hasDeity ? 2 : 0.5;
  return w;
}

/**
 * Weight the FOUNDING-CORE element (foundingFit candidates only).
 * @param {TraditionElement} el @param {TraditionIdentity} id @returns {number}
 */
function foundingElementWeight(el, id) {
  // The singular origin leans hardest on `founding`; a coastal/river settlement's
  // origin is its first landing, a crossroads market town's its charter.
  let w = el.id === 'founding' ? 3 : el.id === 'first-landing' ? 1.5 : 1;
  const coastalish = id.terrain === 'coastal' || id.terrain === 'riverside';
  const waterEcon = id.econ === 'port' || id.econ === 'river';
  if (el.id === 'first-landing' && (coastalish || waterEcon)) w += 3;
  if (el.id === 'charter' && id.econ === 'crossroads') w += 1.5;
  return w;
}

/**
 * Weight an act given the chosen element + identity.
 * @param {TraditionAct} act @param {TraditionElement} el @param {TraditionIdentity} id @param {boolean} founding @returns {number}
 */
function actWeight(act, el, id, founding) {
  let w = 1;
  if (founding) {
    // The origin is a founding FEAST first (owner spec), a procession next; the
    // devotional acts are a distant option even under a patron.
    w = act.id === 'feast' ? 4 : act.id === 'procession' ? 2 : act.id === 'fair' ? 1.5 : 0.5;
    if (act.id === 'fair' && id.econ && MARKET_ECON.includes(id.econ)) w += 0.5;
    if (act.deityFit) w = id.hasDeity ? 0.75 : 0.2;
    return w;
  }
  if (el.deityFit && act.deityFit) w += 3;
  if (act.deityFit && id.hasDeity) w += 1.5;
  if (act.id === 'contest' && (id.evil > 0.6 || id.chaos > 0.6)) w += 2;
  if (act.id === 'fair' && id.econ && MARKET_ECON.includes(id.econ)) w += 2;
  if (act.id === 'offering' && id.evil < 0.4 && id.chaos < 0.4) w += 1;
  return w;
}

/**
 * Compose a display name from element × act × culture flavour, unique within the
 * running set. Deterministic bounded retry on collision.
 * @param {ReturnType<typeof createPRNG>} rng
 * @param {TraditionElement} el @param {TraditionAct} act @param {string|null} culture
 * @param {Set<string>} used
 * @returns {string}
 */
function composeName(rng, el, act, culture, used) {
  const flavor = TRADITION_CULTURE_FLAVOR[String(culture ?? 'default')] || TRADITION_CULTURE_FLAVOR.default;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const r = rng.fork(`name:${attempt}`);
    const template = r.pick(TRADITION_NAME_TEMPLATES) || TRADITION_NAME_TEMPLATES[0];
    const adj = r.pick(TRADITION_ADJECTIVES) || TRADITION_ADJECTIVES[0];
    const cadj = r.pick(flavor) || flavor[0];
    const name = template
      .replace('{En}', el.noun).replace('{Eg}', el.genitive).replace('{An}', act.noun)
      .replace('{Adj}', adj).replace('{Cadj}', cadj);
    if (!used.has(name)) { used.add(name); return name; }
  }
  // Deterministic last-resort disambiguation (culture epithet + genitive).
  const cadj = (rng.fork('name:final').pick(flavor) || flavor[0]);
  let name = `The ${cadj} ${act.noun} of ${el.genitive}`;
  let n = 2;
  while (used.has(name)) { name = `The ${cadj} ${act.noun} of ${el.genitive} (${n})`; n += 1; }
  used.add(name);
  return name;
}

/**
 * Pick up to `k` distinct trappings for an act (seeded, order-stable).
 * @param {ReturnType<typeof createPRNG>} rng @param {string} actId @param {number} k @returns {string[]}
 */
function pickTrappings(rng, actId, k) {
  const pool = TRADITION_TRAPPINGS[actId] || TRADITION_TRAPPINGS.feast;
  const idx = rng.shuffle(pool.map((_, i) => i));
  const out = [];
  for (let i = 0; i < idx.length && out.length < k; i += 1) out.push(pool[idx[i]]);
  return out;
}

/**
 * Build the observance window: the element's season anchors it; a seeded offset
 * places the start week; grander acts/scales run two weeks.
 * @param {ReturnType<typeof createPRNG>} rng @param {TraditionElement} el @param {TraditionAct} act @param {number} scaleBand
 * @returns {TraditionWindow}
 */
function buildWindow(rng, el, act, scaleBand) {
  const base0 = SEASON_START0[el.season] ?? 0;
  const offset = rng.fork('win').randInt(0, 12);
  const startWeekOfYear = clampInt(base0 + offset + 1, 1, 52);
  const wantsGrand = act.grand || scaleBand >= 4;
  const weeks = wantsGrand && rng.fork('weeks').chance(0.5) ? 2 : 1;
  return { startWeekOfYear, weeks };
}

/**
 * Assemble one TraditionRec with the fixed key order (so JSON.stringify is byte-
 * stable across runs).
 * @param {Object} p
 * @param {string} p.id @param {TraditionElement} p.el @param {TraditionAct} p.act
 * @param {string} p.name @param {number} p.foundedYear @param {TraditionWindow} p.window
 * @param {number} p.scaleBand @param {string|null} p.deityRef @param {string[]} p.trappings
 * @param {string} p.epithet
 * @returns {TraditionRec}
 */
function assembleRec(p) {
  return {
    id: p.id,
    coreMotif: { element: p.el.id, act: p.act.id },
    name: p.name,
    foundedYear: p.foundedYear,
    window: { startWeekOfYear: p.window.startWeekOfYear, weeks: p.window.weeks },
    scaleBand: p.scaleBand,
    ownerKey: null,
    ownerKind: null,
    deityRef: p.deityRef,
    expression: { trappings: p.trappings, epithet: p.epithet },
    mutationLog: [],
    lastHeldYear: null,
    lastOutcome: null,
    suppressedBy: null,
    adoptedFrom: null,
  };
}

/**
 * Derive the FOUNDING traditions of a settlement — pure, seeded, deterministic. An
 * old/large settlement reconstructs its ladder (a singular origin core grown to its
 * current scale + per-tier-band additions), all from the settlement seed alone, so
 * the result is identical whether computed view-time (draft preview) or tick-time
 * (T-2 first-lit mint). Never mutates `settlement`. Total on garbage: a non-object
 * (including a string smuggled through an untyped caller) returns [].
 * @param {TraditionSourceSettlement|string|null|undefined} settlement
 * @returns {TraditionRec[]}
 */
export function deriveFoundingTraditions(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];

  const seed = String(settlement._seed ?? settlement.id ?? settlement.identity?.seed ?? 'tradition-seedless');
  const slug = slugify(seed, { sep: '_', max: 40, fallback: 'seedless' });
  const rootRng = createPRNG(`${seed}::tradition:genesis`);
  const id = readIdentity(settlement);
  const { tier, tierIndex } = resolveTierBand(settlement);

  const band = COUNT_BAND[tier] || COUNT_BAND.village;
  const count = band[0] + rootRng.fork('count').randInt(0, band[1] - band[0]);
  const ageYears = clampInt(
    (AGE_BY_TIER[tierIndex] ?? 45) * rootRng.fork('age').randFloat(0.8, 1.2),
    tierIndex + 2, 500,
  );

  const foundingCandidates = TRADITION_ELEMENTS.filter((e) => e.foundingFit);
  const usedNames = new Set();
  const usedMotifs = new Set();
  /** @type {TraditionRec[]} */
  const out = [];

  for (let i = 0; i < count; i += 1) {
    const rng = rootRng.fork(`t:${i}`);
    const founding = i === 0;

    // Element (founding core: origin-era candidates; additions: full pool, deduped).
    /** @type {TraditionElement} */
    let el;
    /** @type {TraditionAct} */
    let act;
    if (founding) {
      el = rng.fork('el').weightedPick(
        /** @type {TraditionElement[]} */ (foundingCandidates),
        foundingCandidates.map((e) => foundingElementWeight(e, id)),
      );
      act = rng.fork('act').weightedPick(
        /** @type {TraditionAct[]} */ ([...TRADITION_ACTS]),
        TRADITION_ACTS.map((a) => actWeight(a, el, id, true)),
      );
    } else {
      // Reroll a few times to avoid an identical (element,act) motif already present.
      el = TRADITION_ELEMENTS[0];
      act = TRADITION_ACTS[0];
      for (let attempt = 0; attempt < 5; attempt += 1) {
        el = rng.fork(`el:${attempt}`).weightedPick(
          /** @type {TraditionElement[]} */ ([...TRADITION_ELEMENTS]),
          TRADITION_ELEMENTS.map((e) => elementWeight(e, id)),
        );
        act = rng.fork(`act:${attempt}`).weightedPick(
          /** @type {TraditionAct[]} */ ([...TRADITION_ACTS]),
          TRADITION_ACTS.map((a) => actWeight(a, el, id, false)),
        );
        if (!usedMotifs.has(`${el.id}|${act.id}`)) break;
      }
    }
    usedMotifs.add(`${el.id}|${act.id}`);

    // Scale band: the founding core has grown to the current tier; an addition sits
    // between its birth tier and the present.
    const birthLo = founding ? 0 : (tierIndex >= 1 ? 1 : 0);
    const birthTierIndex = founding ? 0 : rng.fork('birth').randInt(birthLo, tierIndex);
    const scaleBand = founding ? tierIndex : rng.fork('scale').randInt(birthTierIndex, tierIndex);

    const foundedYear = founding
      ? 1
      : clampInt(2 + (ageYears - 2) * (tierIndex > 0 ? birthTierIndex / tierIndex : 0)
          + rng.fork('fy').randFloat(-3, 3), 2, ageYears);

    const deityRef = ((act.deityFit || el.deityFit) && id.hasDeity) ? id.deityRef : null;
    const name = composeName(rng, el, act, id.culture, usedNames);
    const window = buildWindow(rng, el, act, scaleBand);
    const trappings = pickTrappings(rng.fork('trap'), act.id, 2);
    const epithet = rng.fork('epithet').pick(TRADITION_EPITHETS) || TRADITION_EPITHETS[0];

    out.push(assembleRec({
      id: `tradition.${slug}.${i}`,
      el, act, name, foundedYear, window, scaleBand, deityRef, trappings, epithet,
    }));
  }

  return out;
}

/**
 * The ordinal word for a 1-based week-of-season (1..13), null-safe.
 * @param {number} weekOfSeason @returns {string}
 */
function ordinalWeek(weekOfSeason) {
  return WEEK_ORDINALS[clampInt(weekOfSeason, 1, 13) - 1];
}

/**
 * Render a tradition window as register prose — "Harvest, the third week" — via the
 * canonical seasonForTick math (never derived from month labels). Handles a two-week
 * window that spills across a season boundary.
 * @param {TraditionWindow|null|undefined} window
 * @returns {string}
 */
export function describeTraditionWindow(window) {
  const startWeekOfYear = clampInt(window?.startWeekOfYear ?? 1, 1, 52);
  const weeks = clampInt(window?.weeks ?? 1, 1, 2);
  const w1 = seasonForTick(startWeekOfYear - 1);
  const label1 = TRADITION_SEASON_LABELS[/** @type {TraditionSeason} */ (w1.season)] || w1.season;
  if (weeks === 1) return `${label1}, the ${ordinalWeek(w1.weekOfSeason)} week`;
  const w2 = seasonForTick(startWeekOfYear); // the following week (wraps the year)
  if (w2.season === w1.season) {
    return `${label1}, the ${ordinalWeek(w1.weekOfSeason)} and ${ordinalWeek(w2.weekOfSeason)} weeks`;
  }
  const label2 = TRADITION_SEASON_LABELS[/** @type {TraditionSeason} */ (w2.season)] || w2.season;
  return `${label1}, the ${ordinalWeek(w1.weekOfSeason)} week, into ${label2}`;
}
