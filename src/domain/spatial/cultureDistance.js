/**
 * cultureDistance.js — Phase 5.5 (built in M4): the CULTURE-DISTANCE composite.
 *
 * The §II.5-2 (owner-settled) ruling: culture is NOT ethnographic identity — it is a
 * DERIVED behavioural/economic SIMILARITY, a composite distance computed from state
 * the engine ALREADY has, NEVER a new authored coordinate. This module is the ONE
 * pure composite selector both the M4 migration "least-drift" axis and the M7
 * contraband "culturally-different" gate read (rounds 6/7).
 *
 * FIVE composite terms (§II.5-2):
 *   1. FAITH proximity      — the dominant deity's evil01/chaos01 alignment axes.
 *   2. ALIGNMENT proximity  — the W0 settlementAlignment axes (lawfulness01/malice01).
 *   3. ECONOMY / ways of life — the derived economic character (capacity/prosperity).
 *   4. TRADE TIES           — established trade relationship + balance (a heavy trade
 *                             tie makes two settlements "close"); a PAIRWISE ctx term.
 *   5. GOVERNANCE DRIFT     — the round-7 political-similarity term, TWO sub-terms:
 *        (i)  REGIME-TYPE distance over THREE governance axes (concentration /
 *             legitimacy-source ordinal / rule-of-law), derived from the governing
 *             faction's ARCHETYPE (`regimeAxes`) so it works for any generator
 *             governanceType string — no hardcoded pair table;
 *        (ii) GOVERNING-POWER IDENTITY — same sovereign/overlord (governingName) ⇒
 *             close; different ⇒ distant (so a conquest that flips B's governingName
 *             to A's DRIFTS B toward A's culture over the following weeks).
 *
 * LIVE READ (constitutional, §II.5-2 / round 7): this reads a CULTURE VECTOR the
 * kernel extracts from CURRENT worldState each eval — it NEVER reads the frozen
 * spatial digest. Culture drifts as corruption / coups / conquest move its inputs,
 * with no stored field to migrate or go stale. The DERIVE-it-endogenously law.
 *
 * PURE + LAZY + ZERO-IMPORT LEAF: no worldPulse import (the extraction of faith /
 * alignment / economy / trade / governance from live state is the kernel adapter's
 * job — mirroring the embattlement.js "no worldPulse imports" discipline, which keeps
 * this a chunk-safe spatial leaf with zero first-paint bytes). No Date, no
 * Math.random, no mutation. Total on garbage (a null vector reads the neutral 0.5s ⇒
 * a mid-distance, never a throw).
 */

// ── Tuning (documented; retuned in the M4 + M7 soaks) ─────────────────────────
// The five composite weights (sum ≈ 1) + the governance sub-weights. Every constant
// is NAMED with its effect so the owner can retune game-feel WITHOUT a rebuild.
export const CULTURE_TUNING = Object.freeze({
  // The FOUR intrinsic-term weights (faith/alignment/economy/governance) SUM TO 1, so
  // the core distance is a clean [0,1] blend and two identical settlements read EXACTLY
  // 0 (no baseline distance is minted by any term).
  W_FAITH: 0.3,    // shared gods ⇒ close (the strongest single cultural signal)
  W_ALIGN: 0.25,   // shared law/good disposition ⇒ close
  W_ECON: 0.18,    // similar wealth / ways of life ⇒ close
  W_GOV: 0.27,     // similar governance / same overlord ⇒ close (round 7)
  // TRADE is a CLOSING pull, NOT an additive term: a heavy established trade tie
  // MULTIPLICATIVELY reduces the core distance by up to TRADE_CLOSE (behaviour makes
  // two trading settlements "close"). Absent a tie ⇒ no change (never adds distance).
  TRADE_CLOSE: 0.25,
  // Governance sub-weights: the regime-type 3-axis gap vs the same-overlord identity.
  W_REGIME: 0.6,   // how alike the FORM of rule is
  W_IDENTITY: 0.4, // do they answer to the SAME sovereign (governingName)?
});

// The governance 3-axis table keyed by the canonical FACTION archetype (the
// "factionArchetype 3-axis" §II.5-2 derivation, built HERE). Each archetype maps to
// three normalized 0..1 axes; distance is the axis-space gap, so "some regimes are
// more similar than others" falls out of the geometry rather than a lookup:
//   • concentration01 — 1 single-ruler/autocratic … 0 distributed/popular.
//   • legitimacy01    — an ORDINAL placing legitimacy KINDS so ADJACENT kinds read
//                       close (divine≈arcane; monarchy≈… ; merchant≈popular):
//                       divine 0 · arcane .15 · hereditary .35 · martial .55 ·
//                       mercantile .75 · popular 1.
//   • ruleOfLaw01     — 1 lawful-bureaucratic … .5 personalist … 0 lawless.
// Unknown/other ⇒ the neutral middle (0.5, 0.5, 0.5) ⇒ contributes little distance.
const REGIME_AXES = Object.freeze({
  government:  { concentration01: 0.35, legitimacy01: 1.0,  ruleOfLaw01: 0.9 },
  civic:       { concentration01: 0.3,  legitimacy01: 1.0,  ruleOfLaw01: 0.85 },
  noble:       { concentration01: 0.9,  legitimacy01: 0.35, ruleOfLaw01: 0.65 },
  military:    { concentration01: 0.8,  legitimacy01: 0.55, ruleOfLaw01: 0.5 },
  occupation:  { concentration01: 0.95, legitimacy01: 0.55, ruleOfLaw01: 0.3 },
  religious:   { concentration01: 0.7,  legitimacy01: 0.0,  ruleOfLaw01: 0.6 },
  arcane:      { concentration01: 0.7,  legitimacy01: 0.15, ruleOfLaw01: 0.55 },
  merchant:    { concentration01: 0.45, legitimacy01: 0.75, ruleOfLaw01: 0.7 },
  craft:       { concentration01: 0.4,  legitimacy01: 0.75, ruleOfLaw01: 0.7 },
  labor:       { concentration01: 0.35, legitimacy01: 0.75, ruleOfLaw01: 0.6 },
  criminal:    { concentration01: 0.5,  legitimacy01: 0.5,  ruleOfLaw01: 0.1 },
  outsider:    { concentration01: 0.5,  legitimacy01: 0.5,  ruleOfLaw01: 0.5 },
  other:       { concentration01: 0.5,  legitimacy01: 0.5,  ruleOfLaw01: 0.5 },
});
const NEUTRAL_REGIME = Object.freeze({ concentration01: 0.5, legitimacy01: 0.5, ruleOfLaw01: 0.5 });

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @returns {number} finite 0..1, else the 0.5 no-signal midpoint */
function axis01(v) {
  return typeof v === 'number' && Number.isFinite(v) ? clamp01(v) : 0.5;
}

/**
 * A settlement's CULTURE VECTOR — the live-extracted composite inputs. The kernel
 * adapter builds this from current worldState (dominant deity axes, settlementAlignment,
 * economic character, governing archetype + identity); this module never reads state.
 * @typedef {Object} CultureVector
 * @property {number} faithEvil01   dominant deity evil01 (0 good … 1 evil; 0.5 = none/neutral)
 * @property {number} faithChaos01  dominant deity chaos01 (0 lawful … 1 chaotic; 0.5 = none/neutral)
 * @property {number} lawfulness01  settlementAlignment lawfulness01 (0.5 = no signal)
 * @property {number} malice01      settlementAlignment malice01 (0.5 = no signal)
 * @property {number} economy01     economic character 0..1 (wealth/capacity; 0.5 = unknown)
 * @property {string} archetype     the governing faction's canonical archetype (FACTION_ARCHETYPES.*)
 * @property {string} governingName the governing power identity (same overlord ⇒ close)
 */

/**
 * The 3-axis regime position for a governing archetype (the §II.5-2 "factionArchetype
 * 3-axis" derivation). Unknown/absent ⇒ the neutral middle. Pure.
 * @param {string|null|undefined} archetype
 * @returns {{ concentration01: number, legitimacy01: number, ruleOfLaw01: number }}
 */
export function regimeAxes(archetype) {
  const key = String(archetype || '').toLowerCase();
  return /** @type {Record<string, { concentration01: number, legitimacy01: number, ruleOfLaw01: number }>} */ (REGIME_AXES)[key] || NEUTRAL_REGIME;
}

/** The mean absolute gap between two regime positions (0 identical … 1 opposite). */
/** @param {string} a @param {string} b @returns {number} */
function regimeDistance(a, b) {
  const ra = regimeAxes(a);
  const rb = regimeAxes(b);
  return (Math.abs(ra.concentration01 - rb.concentration01)
    + Math.abs(ra.legitimacy01 - rb.legitimacy01)
    + Math.abs(ra.ruleOfLaw01 - rb.ruleOfLaw01)) / 3;
}

/**
 * The composite CULTURE DISTANCE between two settlements' culture vectors, in [0,1]
 * (0 = culturally identical, 1 = maximally distant). A weighted blend of the five
 * §II.5-2 terms; the TRADE term is PAIRWISE (passed on ctx). Symmetric:
 * cultureDistance(a,b) === cultureDistance(b,a). Pure; total on garbage (missing
 * axes read the 0.5 no-signal midpoint ⇒ a mid distance, never a throw).
 * @param {CultureVector|null|undefined} a
 * @param {CultureVector|null|undefined} b
 * @param {{ tradeTie01?: number }} [ctx] tradeTie01 ∈ [0,1]: 1 = heavy established
 *   trade (⇒ culturally close), 0 = no trade tie. Absent ⇒ 0 (no closing pull).
 * @returns {number} in [0,1]
 */
export function cultureDistance(a, b, ctx = {}) {
  const T = CULTURE_TUNING;
  const va = a || /** @type {CultureVector} */ ({});
  const vb = b || /** @type {CultureVector} */ ({});

  // 1. FAITH — the two deity alignment axes.
  const faith = 0.5 * Math.abs(axis01(va.faithEvil01) - axis01(vb.faithEvil01))
    + 0.5 * Math.abs(axis01(va.faithChaos01) - axis01(vb.faithChaos01));

  // 2. ALIGNMENT — the W0 settlement-alignment axes.
  const align = 0.5 * Math.abs(axis01(va.lawfulness01) - axis01(vb.lawfulness01))
    + 0.5 * Math.abs(axis01(va.malice01) - axis01(vb.malice01));

  // 3. ECONOMY / ways of life — the derived economic character.
  const econ = Math.abs(axis01(va.economy01) - axis01(vb.economy01));

  // 5. GOVERNANCE — regime-type gap + same-overlord identity.
  const regime = regimeDistance(String(va.archetype || ''), String(vb.archetype || ''));
  const sameOverlord = va.governingName != null && vb.governingName != null
    && String(va.governingName) !== '' && String(va.governingName) === String(vb.governingName);
  const identity = sameOverlord ? 0 : 1;
  const gov = T.W_REGIME * regime + T.W_IDENTITY * identity;

  // The core distance — a [0,1] blend of the four INTRINSIC terms (weights sum to 1),
  // so two identical settlements read EXACTLY 0.
  const core = T.W_FAITH * faith + T.W_ALIGN * align + T.W_ECON * econ + T.W_GOV * gov;

  // 4. TRADE TIES — a heavy established trade tie MULTIPLICATIVELY CLOSES the distance
  // (never adds any). tradeTie01 ∈ [0,1]: 1 = heavy trade ⇒ up to TRADE_CLOSE closer.
  const tradeTie = clamp01(typeof ctx.tradeTie01 === 'number' && Number.isFinite(ctx.tradeTie01) ? ctx.tradeTie01 : 0);
  return clamp01(core * (1 - T.TRADE_CLOSE * tradeTie));
}

/**
 * The culture AFFINITY (1 - distance) in [0,1] — the form the M4 destination score
 * consumes (higher = more attractive: migrants prefer the LEAST-drift destination).
 * @param {CultureVector|null|undefined} a @param {CultureVector|null|undefined} b
 * @param {{ tradeTie01?: number }} [ctx]
 * @returns {number} in [0,1]
 */
export function cultureAffinity(a, b, ctx = {}) {
  return clamp01(1 - cultureDistance(a, b, ctx));
}
