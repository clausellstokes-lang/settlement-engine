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
// riverside | coastal | mountain | desert. THE CALAMITY BUCKET (W-UPSWING stage 0,
// owner ruling "the flavor is for the DM; the effects we bucket into one"): the
// terrain→type map is now a COSMETIC flavor HINT — a SUGGESTION a DM display may
// surface or override, never an engine mechanic. Every mechanical read (K, death/
// exodus, subsumption, sever, exodus, tier, legitimacy) is already type-blind; the
// ENGINE's own titles/news/receipts speak the bucket ("the Great Calamity of {year}").
// The hint is still persisted under the SAME stamp key `type` (no save-shape change),
// so old stamps read unchanged and a DM display can offer the flavor as a suggestion.
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

// The flavor-hint's SUGGESTED title fragment ("Great Fire"), for OPTIONAL DM display
// only — the engine's own stamp title is the bucket-neutral "Great Calamity" (see
// stampTitle). A display surface may offer this as a suggestion the DM accepts or
// overrides with composer/dossier freetext.
export const DISASTER_FLAVOR_TITLE = Object.freeze({
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
 * The realm BASE (mean) per-settlement annual hazard 1/(HAZARD_YEARS × N) — so the
 * realm-summed hazard is ≈ 1/HAZARD_YEARS per year regardless of N. Bounded to a sane
 * (0,1). EXPOSURE LOADING (stage 0) redistributes this fixed budget across settlements
 * by a NORMALIZED terrain+dwell multiplier (see exposureMultiplier / normalizeExposure):
 * the per-settlement hazard = base × normalized-multiplier, and the realm MEAN stays
 * exactly this base value — exposure moves WHERE risk lands, never the total cadence.
 * @param {number} settlementCount N
 * @returns {number}
 */
export function annualHazard(settlementCount) {
  const n = Math.max(1, Math.floor(finiteNumber(settlementCount, 1)));
  return clamp01(1 / (CALAMITY_TUNING.HAZARD_YEARS * n));
}

// ── Exposure loading (stage 0 — §H conformance, JUDGMENT: vetoable) ────────────
// Hazard was uniform regardless of situation; this loads a bounded terrain+dwell
// weighting so a flood plain or a repeatedly-struck "cursed ground" is more exposed
// than a sheltered inland town — WITHOUT changing the realm's fixed strike budget.
// The raw multiplier is bounded [MULT_MIN, MULT_MAX]; normalization across the realm
// rescales the set so its MEAN is 1 ⇒ the mean hazard equals annualHazard exactly.
export const EXPOSURE_TUNING = Object.freeze({
  MULT_MIN: 0.75,
  MULT_MAX: 1.5,
  RISK_WEIGHT: 0.6,        // how much terrain risk drives the raw multiplier
  DWELL_PER_PRIOR: 0.15,   // each prior calamity nudges exposure up (recurring-hazard ground)
  DWELL_CAP: 0.6,          // bounded — prior history never dominates terrain
});

// Terrain base risk 0..1 — the flavor-hint terrains that read as hazard-prone (river
// flood plains, storm coasts, arid storm belts) sit higher; sheltered plains lowest.
// A WEIGHT on the shared, fixed budget — never an independent strike source.
export const EXPOSURE_TERRAIN_RISK = Object.freeze({
  riverside: 1.0, coastal: 0.9, desert: 0.7, mountain: 0.6, forest: 0.55, hills: 0.5, plains: 0.35,
});
export const DEFAULT_EXPOSURE_RISK = 0.5;

/**
 * The RAW (un-normalized) exposure multiplier for one settlement, bounded
 * [MULT_MIN, MULT_MAX]. Terrain risk + a bounded prior-calamity dwell term. Pure.
 * @param {{ terrain?: string | null, priorStrikes?: number }} [args]
 * @returns {number}
 */
export function exposureMultiplier({ terrain, priorStrikes } = {}) {
  const T = EXPOSURE_TUNING;
  const key = String(terrain || '').toLowerCase();
  const risk = /** @type {Record<string, number>} */ (EXPOSURE_TERRAIN_RISK)[key];
  const risk01 = clamp01(typeof risk === 'number' ? risk : DEFAULT_EXPOSURE_RISK);
  const priors = Math.max(0, Math.floor(finiteNumber(priorStrikes, 0)));
  const dwell = Math.min(T.DWELL_CAP, T.DWELL_PER_PRIOR * priors);
  const combined = clamp01(T.RISK_WEIGHT * risk01 + dwell);
  return round4(T.MULT_MIN + (T.MULT_MAX - T.MULT_MIN) * combined);
}

/**
 * Normalize a set of raw exposure multipliers so their MEAN is 1 (preserving the realm
 * budget): each returned factor is raw / mean. An empty or all-zero set ⇒ all-1
 * (uniform fallback). The per-settlement hazard = annualHazard(N) × factor ⇒ the realm
 * MEAN hazard is exactly annualHazard(N). Pure.
 * @param {number[]} rawMultipliers
 * @returns {number[]}
 */
export function normalizeExposure(rawMultipliers) {
  const arr = (Array.isArray(rawMultipliers) ? rawMultipliers : []).map((m) => finiteNumber(m, 1));
  if (arr.length === 0) return [];
  const sum = arr.reduce((a, b) => a + b, 0);
  const mean = sum / arr.length;
  if (!(mean > 0)) return arr.map(() => 1);
  return arr.map((m) => round4(m / mean));
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

// ── Terrain-keyed FLAVOR-HINT table (cosmetic — the DM's slot, not a mechanic) ──
/**
 * The terrain's suggested disaster FLAVOR (the cosmetic hint stamped under the `type`
 * key). Unknown/absent terrain ⇒ DEFAULT_DISASTER_TYPE (a storm — the terrain-agnostic
 * shock). NOTHING mechanical branches on this value: it is a display suggestion only
 * (THE CALAMITY BUCKET, stage 0). Pure.
 * @param {string | null | undefined} terrain
 * @returns {'flood'|'fire'|'quake'|'storm'}
 */
export function disasterTypeFor(terrain) {
  const key = String(terrain || '').toLowerCase();
  const t = /** @type {Record<string, string>} */ (DISASTER_TYPE_BY_TERRAIN)[key] || DEFAULT_DISASTER_TYPE;
  return /** @type {'flood'|'fire'|'quake'|'storm'} */ (t);
}

/**
 * The OPTIONAL DM-facing flavor label for a hint ("Great Fire"), for a display surface
 * that chooses to surface the suggestion. Unknown hint ⇒ the bucket label. Pure.
 * @param {string | null | undefined} type  the persisted flavor hint
 * @returns {string}
 */
export function disasterFlavorLabel(type) {
  return /** @type {Record<string, string>} */ (DISASTER_FLAVOR_TITLE)[String(type || '')] || 'Great Calamity';
}

/**
 * The permanent stamp title — BUCKET-NEUTRAL by constitution ("The Great Calamity of
 * Thornwood, year 12"). The engine never asserts a disaster kind; the flavor hint is a
 * separate persisted field a DM display may surface. Pure.
 * @param {string} settlementName
 * @param {number} year
 * @returns {string}
 */
export function stampTitle(settlementName, year) {
  return `The Great Calamity of ${settlementName}, year ${year}`;
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

// ── FORCE severity banding (stage 0c — the DM dial; force ≡ organic at 'moderate') ─
// A FORCE_CALAMITY severity dial scales the death/exodus draws and the K cap WITHIN
// the existing walls (DEATH_MAX 0.14 / EXODUS_MAX 0.26 stay the ceiling; the FLOORs
// the floor). At the DEFAULT 'moderate' band the scale is EXACTLY 1.0 and the K
// factor 1.0 ⇒ a forced strike is byte-identical to an organic one for the same seed
// (the force≡organic pin). Nothing on the organic path passes a severityScale, so the
// annual draw is untouched.
export const CALAMITY_SEVERITY_BANDS = Object.freeze({
  minor: { scale: 0.7, kFactor: 0.5 },
  moderate: { scale: 1.0, kFactor: 1.0 },
  severe: { scale: 1.3, kFactor: 1.0 },
});
export const DEFAULT_CALAMITY_SEVERITY = 'moderate';

/** The death/exodus scale for a severity band (unknown ⇒ the natural 1.0). Pure.
 * @param {string | null | undefined} band @returns {number} */
export function severityScaleFor(band) {
  const b = /** @type {Record<string, {scale:number}>} */ (CALAMITY_SEVERITY_BANDS)[String(band || '')];
  return b ? b.scale : 1;
}

/** The K-cap factor for a severity band (unknown ⇒ the natural 1.0). Pure.
 * @param {string | null | undefined} band @returns {number} */
export function severityKFactorFor(band) {
  const b = /** @type {Record<string, {kFactor:number}>} */ (CALAMITY_SEVERITY_BANDS)[String(band || '')];
  return b ? b.kFactor : 1;
}

// ── Aggregate population loss (bounded, tier-scaled, seeded) ───────────────────
/**
 * The immediate DEATH fraction (0..DEATH_MAX): base + tier density scale + seeded
 * jitter, scaled by an optional severity factor, clamped to [DEATH_FLOOR, DEATH_MAX].
 * Aggregate-only (a fraction of a count). severityScale defaults to 1 (the organic
 * path never passes it ⇒ byte-identical). Pure over the rng.
 * @param {{ density01?: number, rng?: { random: () => number } | null, severityScale?: number }} [args]
 * @returns {number}
 */
export function deathFraction({ density01, rng, severityScale } = {}) {
  const T = CALAMITY_TUNING;
  const d = clamp01(finiteNumber(density01, 0));
  const jitter = (draw(rng) * 2 - 1) * T.DEATH_JITTER;
  const scale = finiteNumber(severityScale, 1);
  const raw = (T.DEATH_BASE + T.DEATH_TIER_SCALE * d + jitter) * scale;
  return round4(Math.min(T.DEATH_MAX, Math.max(T.DEATH_FLOOR, raw)));
}

/**
 * The EXODUS fraction (0..EXODUS_MAX) of the SURVIVING population: base + tier
 * scale + seeded jitter, scaled by an optional severity factor, clamped to
 * [EXODUS_FLOOR, EXODUS_MAX]. Larger than the death toll (the exodus is the real
 * depopulator) but bounded — the town empties, it is never annihilated. severityScale
 * defaults to 1 (the organic path never passes it). Pure over the rng.
 * @param {{ density01?: number, rng?: { random: () => number } | null, severityScale?: number }} [args]
 * @returns {number}
 */
export function exodusFraction({ density01, rng, severityScale } = {}) {
  const T = CALAMITY_TUNING;
  const d = clamp01(finiteNumber(density01, 0));
  const jitter = (draw(rng) * 2 - 1) * T.EXODUS_JITTER;
  const scale = finiteNumber(severityScale, 1);
  const raw = (T.EXODUS_BASE + T.EXODUS_TIER_SCALE * d + jitter) * scale;
  return round4(Math.min(T.EXODUS_MAX, Math.max(T.EXODUS_FLOOR, raw)));
}

/**
 * Resolve the aggregate population loss of a strike into exact integer counts —
 * immediate deaths FIRST (a fraction of the pre-strike population), then the exodus
 * (a fraction of the SURVIVORS). Bounded by construction: deaths + exodus < the
 * population (both fractions < 1 and applied in sequence), so a settlement is
 * emptied toward its floor, never below zero. Pure over the rng.
 * @param {{ population?: number, density01?: number, rng?: { random: () => number } | null, severityScale?: number }} [args]
 * @returns {{ deaths: number, exodus: number, deathFrac: number, exodusFrac: number }}
 */
export function resolvePopulationLoss({ population, density01, rng, severityScale } = {}) {
  const pop = Math.max(0, Math.floor(finiteNumber(population, 0)));
  const deathFrac = deathFraction({ density01, rng, severityScale });
  const exodusFrac = exodusFraction({ density01, rng, severityScale });
  const deaths = Math.min(pop, Math.floor(pop * deathFrac));
  const survivors = pop - deaths;
  const exodus = Math.min(survivors, Math.floor(survivors * exodusFrac));
  return { deaths, exodus, deathFrac, exodusFrac };
}
