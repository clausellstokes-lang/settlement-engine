/**
 * calamity.js — Phase 5.5 mover wave M11b: CALAMITY (the natural disaster).
 *
 * A VERY RARE instantaneous shock with a LONG, fully EMERGENT economic tail —
 * "zero new mechanism." The STRIKE is a hand-of-god instant: a terrain-keyed
 * disaster (flood/fire/quake/storm) knocks down K non-required institutions and
 * kills a bounded, tier-scaled fraction of the population. The TAIL is entirely
 * the EXISTING movers reacting: destroyed producers sever M2 supply links, the
 * mass exodus rides M4's migration conservation ledger, population loss demotes
 * the tier via popToTier, and the political fallout puts the ruler under the
 * EXISTING coup-readable legitimacy pressure. This module owns only the PURE
 * DECISIONS; the kernel adapter (worldPulse/calamityKernel.js) supplies the live
 * reads and applies the mutations — the same split as pestilence.js ⟷
 * pestilenceKernel.js and migration.js ⟷ migrationKernel.js.
 *
 * IMPORT-FREE PURE LEAF (M9b's lesson — no eager preload edge): this module
 * imports nothing. Every live input (the institution roster, terrain, tier,
 * population, the prior cooldown stamp, the pulse rng) arrives as an argument;
 * every mutation is the kernel's. Deterministic: PRNG = seeded forks from stable
 * composite keys; every mutation codepoint-sorted; every rate a FROZEN,
 * documented, owner-retunable constant.
 *
 * FREQUENCY (§M11b). Realm-expected once per HAZARD_YEARS years ⇒ a per-
 * settlement-year hazard of 1/(HAZARD_YEARS × N) (N settlements), evaluated as
 * ONE seeded annual draw per settlement (`disaster:${settlementId}:${year}`).
 * COOLDOWN WITHOUT NEW STATE: the minted permanent history STAMP is itself the
 * cooldown record — no re-strike within COOLDOWN_YEARS of a prior stamp (the
 * stamp's year is read; there is no separate cooldown ledger).
 *
 * THE STRIKE (bounded). K is tier-capped 1..4; the K targets are drawn from the
 * NON-REQUIRED institutions, candidates CODEPOINT-SORTED. `required` institutions
 * are NEVER selectable (the hard bound — asserted at the selection boundary).
 * SUBSUMPTION FIRST: a target that is an upgrade-chain GREATER DEMOTES down its
 * chain ("the mages' guild is a wizard's tower again"); a target whose CATEGORY
 * has multiple instances COLLAPSES to one survivor ("the lodging district is one
 * lodge now"); a lone target is DESTROYED (hand-of-god).
 *
 * AGGREGATE population death (§M11b). A seeded, BOUNDED, tier-scaled fraction —
 * significant but survivable; the exodus, not the death toll, is the real
 * depopulator, and it is recoverable drama. AGGREGATE-ONLY: a fraction of a
 * count, never a named NPC (the at-risk / displaced flags are DM hooks).
 */

// ── Tuning (documented here; retuned in the M11b + checkpoint soaks) ──────────
export const CALAMITY_TUNING = Object.freeze({
  // FREQUENCY — realm-expected once per HAZARD_YEARS years. The per-settlement-
  // year hazard is 1/(HAZARD_YEARS × N): summed over N settlements the realm sees
  // ≈ one strike / HAZARD_YEARS years, INDEPENDENT of realm size. 15 lands mid the
  // §M11b 10-20y band; the 50-year realm soak certifies the realized interval.
  HAZARD_YEARS: 15,
  // COOLDOWN — no re-strike within this many years of a settlement's LAST stamp.
  // A settlement that just burned is spared the dice for a while (recovery drama,
  // not a yearly hammering). Read off the permanent stamp — no separate state.
  COOLDOWN_YEARS: 8,
  // STRIKE BREADTH — K non-required institutions fall, capped 1..4 by tier (a
  // metropolis has more to lose). The realized K is a seeded draw in [1, cap].
  STRIKE_K_CAP_BY_TIER: Object.freeze({
    thorp: 1, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 4,
  }),
  // AGGREGATE DEATH — a bounded, tier-scaled fraction of population. Base + a
  // per-tier scale, seeded jitter, clamped to [DEATH_FLOOR, DEATH_MAX]. "Significant
  // but survivable": DEATH_MAX 0.14 (< the exodus) keeps the toll recoverable.
  DEATH_BASE: 0.05,
  DEATH_TIER_SCALE: 0.05, // + up to this by tier density (a packed city dies harder)
  DEATH_JITTER: 0.03,     // seeded ± band for texture
  DEATH_FLOOR: 0.02,
  DEATH_MAX: 0.14,
  // THE EXODUS — the mass departure the disaster triggers, a bounded tier-scaled
  // fraction of the SURVIVING population. Larger than the death toll (the exodus is
  // the real depopulator) but capped so the town is emptied, never annihilated.
  EXODUS_BASE: 0.10,
  EXODUS_TIER_SCALE: 0.06,
  EXODUS_JITTER: 0.04,
  EXODUS_FLOOR: 0.04,
  EXODUS_MAX: 0.26,
});

// Canonical terrain vocabulary (resolveTerrain.js): plains | hills | forest |
// riverside | coastal | mountain | desert. The disaster a place is heir to is
// LEGIBLE DESTINY — a riverside town's flood-year, a timber town's fire.
export const DISASTER_TYPE_BY_TERRAIN = Object.freeze({
  riverside: 'flood',
  coastal: 'storm',
  mountain: 'quake',
  hills: 'quake',
  forest: 'fire',
  plains: 'fire',
  desert: 'storm',
});
export const DEFAULT_DISASTER_TYPE = 'storm';

// The named-stamp title fragment per type ("The Great Fire of Thornwood, year 12").
const DISASTER_TITLE = Object.freeze({
  flood: 'Great Flood', fire: 'Great Fire', quake: 'Great Quake', storm: 'Great Storm',
});

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** @param {{ random: () => number } | null | undefined} rng @returns {number} 0..1 (1 when no rng) */
function draw(rng) {
  return rng && typeof rng.random === 'function' ? clamp01(rng.random()) : 1;
}

// ── The activation gate (the CL rules flag — the byte-identity seam) ──────────
/**
 * Calamity is LIVE iff the CL rules flag is explicitly `true`. A TOLERANT read,
 * total on garbage, DELIBERATELY absent from DEFAULT_SIMULATION_RULES (the M10a
 * pattern): absent ⇒ no eager key, no accessor branch, the whole mover DORMANT ⇒
 * byte-identical (aspatial AND spatial goldens). Only the flag arms it; the
 * spatial TAILS (M2 sever, the M4 spatial exodus) additionally ride the spatial
 * marker, and the aspatial world falls back to the existing population-flight term.
 * @param {Record<string, unknown> | null | undefined} rules
 * @returns {boolean}
 */
export function calamityEnabled(rules) {
  return !!(rules && typeof rules === 'object' && rules.disastersEnabled === true);
}

// ── Frequency + the seeded annual draw ────────────────────────────────────────
/**
 * The per-settlement annual hazard 1/(HAZARD_YEARS × N) — so the realm-summed
 * hazard is ≈ 1/HAZARD_YEARS per year regardless of N. Bounded to a sane (0,1).
 * @param {number} settlementCount N
 * @returns {number}
 */
export function annualHazard(settlementCount) {
  const n = Math.max(1, Math.floor(finiteNumber(settlementCount, 1)));
  return clamp01(1 / (CALAMITY_TUNING.HAZARD_YEARS * n));
}

/**
 * Resolve the seeded annual draw: does the disaster strike this settlement-year?
 * The draw is a stable fork on `disaster:${id}:${year}` — same year ⇒ same result,
 * so the caller may evaluate it idempotently. A strike requires BOTH the hazard
 * draw AND no cooldown collision (see withinCooldown). Pure over the rng.
 * @param {{ rng?: { random: () => number } | null, hazard?: number }} [args]
 * @returns {boolean}
 */
export function rollStrike({ rng, hazard } = {}) {
  const p = clamp01(finiteNumber(hazard, 0));
  return draw(rng) < p;
}

/**
 * Cooldown-via-stamp: the LAST stamp IS the cooldown record. True (blocked) when a
 * prior stamp lies within COOLDOWN_YEARS of `year`. No separate cooldown state.
 * @param {number | null | undefined} lastStampYear  the year of the most recent stamp (or null)
 * @param {number} year  the year under evaluation
 * @returns {boolean} true ⇒ within cooldown ⇒ re-strike REFUSED
 */
export function withinCooldown(lastStampYear, year) {
  if (lastStampYear == null || !Number.isFinite(Number(lastStampYear))) return false;
  return (Number(year) - Number(lastStampYear)) < CALAMITY_TUNING.COOLDOWN_YEARS;
}

// ── Terrain-keyed type table ──────────────────────────────────────────────────
/**
 * The disaster a terrain is heir to (legible destiny). Unknown/absent terrain ⇒
 * DEFAULT_DISASTER_TYPE (a storm — the terrain-agnostic shock). Pure.
 * @param {string | null | undefined} terrain
 * @returns {'flood'|'fire'|'quake'|'storm'}
 */
export function disasterTypeFor(terrain) {
  const key = String(terrain || '').toLowerCase();
  const t = /** @type {Record<string, string>} */ (DISASTER_TYPE_BY_TERRAIN)[key] || DEFAULT_DISASTER_TYPE;
  return /** @type {'flood'|'fire'|'quake'|'storm'} */ (t);
}

/**
 * The permanent named stamp title ("The Great Fire of Thornwood, year 12"). Pure.
 * @param {'flood'|'fire'|'quake'|'storm'} type
 * @param {string} settlementName
 * @param {number} year
 * @returns {string}
 */
export function stampTitle(type, settlementName, year) {
  const great = /** @type {Record<string, string>} */ (DISASTER_TITLE)[type] || 'Great Calamity';
  return `The ${great} of ${settlementName}, year ${year}`;
}

// ── The strike — bounded selection of non-required institutions ───────────────
// NOTE the tier→K cap read (strikeCapForTier) lives in the KERNEL, not here: this
// spatial leaf stays TIER-BLIND (the KEYSTONE invariant). The kernel resolves the
// cap from the settlement's density class and hands `k` to selectStrikeTargets.
/**
 * @typedef {Object} StrikeInstitution
 * @property {string} name
 * @property {boolean} [required]
 * @property {string} [category]
 * @property {string} [status]
 */

/**
 * Is an institution a valid strike TARGET? Never `required` (the hard bound), and
 * never one already inactive (a remnant/ruin doesn't fall twice). Pure.
 * @param {StrikeInstitution | null | undefined} inst
 * @returns {boolean}
 */
export function isStrikeTarget(inst) {
  if (!inst || typeof inst !== 'object') return false;
  if (inst.required === true) return false;
  const status = String(inst.status || 'active');
  if (status === 'remnant' || status === 'removed' || status === 'ruined') return false;
  return !!String(inst.name || '');
}

/**
 * Select up to K strike targets from the roster: NON-REQUIRED only (the hard
 * bound — required institutions are filtered out BEFORE any draw touches them),
 * candidates CODEPOINT-SORTED by name for determinism, then a seeded shuffle picks
 * K. Returns the selected names (codepoint-sorted). Pure + deterministic.
 * @param {{ institutions?: StrikeInstitution[], k?: number, rng?: { random: () => number } | null }} [args]
 * @returns {string[]}  the selected institution names (codepoint-sorted)
 */
export function selectStrikeTargets({ institutions, k, rng } = {}) {
  const eligible = (Array.isArray(institutions) ? institutions : [])
    .filter(isStrikeTarget)
    .map((inst) => String(inst.name))
    .sort();
  // HARD BOUND (asserted): no required institution ever enters the pool.
  const want = Math.max(0, Math.min(Math.floor(finiteNumber(k, 0)), eligible.length));
  if (want <= 0 || eligible.length === 0) return [];
  if (want >= eligible.length) return eligible.slice();
  // Seeded partial Fisher-Yates over the codepoint-sorted pool (deterministic given
  // the fork). Draw `want` names; return them codepoint-sorted (order-free mutation).
  const pool = eligible.slice();
  const picked = [];
  for (let i = 0; i < want; i += 1) {
    const j = i + Math.floor(draw(rng) * (pool.length - i));
    const idx = Math.min(pool.length - 1, Math.max(i, j));
    const tmp = pool[i]; pool[i] = pool[idx]; pool[idx] = tmp;
    picked.push(pool[i]);
  }
  return picked.sort();
}

/**
 * @typedef {'demote'|'collapse'|'destroy'} InstitutionFate
 * @typedef {Object} FatePlan
 * @property {string} name              the struck institution's name
 * @property {InstitutionFate} fate
 * @property {string|null} demotedTo    for 'demote': the lesser it falls to
 * @property {string[]} collapsedAway   for 'collapse': the sibling names removed (survivor kept)
 */

/**
 * Plan the fate of ONE struck institution — SUBSUMPTION FIRST (§M11b):
 *   1. DEMOTE — the target is an upgrade-chain GREATER ⇒ it falls to its lesser
 *      (`demotesTo(name)` returns the lesser). "The mages' guild is a wizard's
 *      tower again." Only when the lesser is not already standing (no free clone).
 *   2. COLLAPSE — the target's CATEGORY holds ≥2 non-required instances ⇒ the
 *      category collapses to ONE survivor (the codepoint-first eligible sibling
 *      kept; the rest, INCLUDING the target, removed). "The lodging district is
 *      one lodge now."
 *   3. DESTROY — a lone target is destroyed (hand-of-god).
 * `demotesTo` and `categoryMembers` are injected (the kernel owns the upgrade-chain
 * data + the live roster) so this stays an import-free pure decision. Pure.
 * @param {{ name?: string, demotesTo?: (name: string) => string | null,
 *   alreadyStanding?: (name: string) => boolean,
 *   categoryMembers?: (name: string) => string[] }} [args]
 * @returns {FatePlan}
 */
export function planInstitutionFate({ name, demotesTo, alreadyStanding, categoryMembers } = {}) {
  const target = String(name || '');
  // 1. SUBSUMPTION FIRST — an upgrade-chain greater demotes to its lesser.
  const lesser = typeof demotesTo === 'function' ? demotesTo(target) : null;
  if (lesser && !(typeof alreadyStanding === 'function' && alreadyStanding(lesser))) {
    return { name: target, fate: 'demote', demotedTo: String(lesser), collapsedAway: [] };
  }
  // 2. COLLAPSE — a multi-instance category folds to one survivor.
  const siblings = (typeof categoryMembers === 'function' ? categoryMembers(target) : []) || [];
  if (siblings.length >= 1) {
    // The survivor is the codepoint-first among {target} ∪ siblings; everyone else
    // (target included, unless it IS the survivor) is removed.
    const all = [target, ...siblings].sort();
    const survivor = all[0];
    const collapsedAway = all.filter((n) => n !== survivor);
    return { name: target, fate: 'collapse', demotedTo: null, collapsedAway };
  }
  // 3. DESTROY — a singleton is razed.
  return { name: target, fate: 'destroy', demotedTo: null, collapsedAway: [] };
}

// ── Aggregate population loss (bounded, tier-scaled, seeded) ───────────────────
/**
 * The immediate DEATH fraction (0..DEATH_MAX): base + tier density scale + seeded
 * jitter, clamped to [DEATH_FLOOR, DEATH_MAX]. Aggregate-only (a fraction of a
 * count). Pure over the rng.
 * @param {{ density01?: number, rng?: { random: () => number } | null }} [args]
 * @returns {number}
 */
export function deathFraction({ density01, rng } = {}) {
  const T = CALAMITY_TUNING;
  const d = clamp01(finiteNumber(density01, 0));
  const jitter = (draw(rng) * 2 - 1) * T.DEATH_JITTER;
  const raw = T.DEATH_BASE + T.DEATH_TIER_SCALE * d + jitter;
  return round4(Math.min(T.DEATH_MAX, Math.max(T.DEATH_FLOOR, raw)));
}

/**
 * The EXODUS fraction (0..EXODUS_MAX) of the SURVIVING population: base + tier
 * scale + seeded jitter, clamped to [EXODUS_FLOOR, EXODUS_MAX]. Larger than the
 * death toll (the exodus is the real depopulator) but bounded — the town empties,
 * it is never annihilated. Pure over the rng.
 * @param {{ density01?: number, rng?: { random: () => number } | null }} [args]
 * @returns {number}
 */
export function exodusFraction({ density01, rng } = {}) {
  const T = CALAMITY_TUNING;
  const d = clamp01(finiteNumber(density01, 0));
  const jitter = (draw(rng) * 2 - 1) * T.EXODUS_JITTER;
  const raw = T.EXODUS_BASE + T.EXODUS_TIER_SCALE * d + jitter;
  return round4(Math.min(T.EXODUS_MAX, Math.max(T.EXODUS_FLOOR, raw)));
}

/**
 * Resolve the aggregate population loss of a strike into exact integer counts —
 * immediate deaths FIRST (a fraction of the pre-strike population), then the exodus
 * (a fraction of the SURVIVORS). Bounded by construction: deaths + exodus < the
 * population (both fractions < 1 and applied in sequence), so a settlement is
 * emptied toward its floor, never below zero. Pure over the rng.
 * @param {{ population?: number, density01?: number, rng?: { random: () => number } | null }} [args]
 * @returns {{ deaths: number, exodus: number, deathFrac: number, exodusFrac: number }}
 */
export function resolvePopulationLoss({ population, density01, rng } = {}) {
  const pop = Math.max(0, Math.floor(finiteNumber(population, 0)));
  const deathFrac = deathFraction({ density01, rng });
  const exodusFrac = exodusFraction({ density01, rng });
  const deaths = Math.min(pop, Math.floor(pop * deathFrac));
  const survivors = pop - deaths;
  const exodus = Math.min(survivors, Math.floor(survivors * exodusFrac));
  return { deaths, exodus, deathFrac, exodusFrac };
}
