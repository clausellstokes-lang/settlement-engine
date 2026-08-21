/**
 * smuggle.js — Phase 5.5 mover wave M7: CONTRABAND / SMUGGLE (rounds 4/6, §II.3-4-e/f).
 *
 * Smuggling is THE TAIL OF THE GREED CURVE (round 22.4): when M6c's legal dispatch EV
 * goes NEGATIVE (danger too high for an honest caravan), the UNMET need-premium spills
 * into the CRIMINAL channel. One continuous economic logic — honest caravan → risk-
 * taking merchant → smuggler. This module is the pure decision leaf that layer reads;
 * commodityFlow.js threads the live reads and runs it at the arrival gate.
 *
 * FOUR load-bearing ideas (§4d / §7 / §II.3-4-e / §II.3-4-f):
 *
 *   1. GATE POLICY — CONTRABAND IS RELATIONAL. A gate PROHIBITS/CONFISCATES goods
 *      categories that violate ITS law/culture/alignment (SLAVES the flagship — an
 *      abolitionist gate seizes a slave caravan a slaver gate waves through). The status
 *      is RELATIONAL: `cultureDistance(gate, origin)` + the gate's own alignment decide,
 *      never an intrinsic property — a good legal in one realm is contraband in the next.
 *      A DATA-DRIVEN, extensible category table (`CONTRABAND_TABLE`).
 *
 *   2. THE SMUGGLE NETWORK. Strength from the endpoints' criminal opportunity / thieves-
 *      guild (the EXISTING saturating guildStrength — bounded [0,1] — is the BRAKE re-
 *      validated here: `criminalNetworkStrength` is a max of two already-bounded reads,
 *      and `smuggleSuccessChance` is HARD-CAPPED at SMUGGLE_MAX < 1). Attempts are RISK-
 *      TOLERANCE-gated (`boldnessFromCaution` reuses the ONE W0 alignment read: bold/
 *      chaotic runs contraband a cautious/lawful trader won't).
 *
 *   3. THE PER-GATE PIPELINE ORDER IS LAW (§II.3-4-e). `smugglePipeline` decides, in this
 *      EXACT precedence: smuggle roll → (detected ∧ hostile) SEIZURE → (elif contraband)
 *      CONFISCATION → else TOLL. Seizure and confiscation deny the destination the same
 *      shipment via different conscience-gated paths; the code order MUST match this law.
 *
 *   4. ONE ROLL vs THE WORST GATE (§II.3-4-f). A shipment makes ONE smuggle roll against
 *      the route's WORST gate (`worstGate`), not one per gate — otherwise a long hostile
 *      route becomes impossible and contradicts the besieged TRICKLE. Corruption is the
 *      HINGE (a leaky gate raises success); conscience (W-C2) gates every seizure's TAKE
 *      (`seizureTake` — a good/lawful seizer loots little, an evil one takes near-all).
 *
 * DORMANCY (constitutional). This runs ONLY when commodityFlow threads the smuggle
 * context (marker AND commodityFlowEnabled — the criminal tail of the same trade
 * bundle). Absent ⇒ no smuggle roll, no contraband policy, no criminal carrier ⇒ the
 * M6 arrival path runs verbatim, byte-identical.
 *
 * PURE + LAZY LEAF: no Date, no Math.random (the caller forks a stable composite key
 * `smuggle:${shipmentId}:${tick}` and passes the draw), no mutation of inputs, no tier/
 * auth read. Imports ONLY the cultureDistance sibling leaf (zero first-paint bytes).
 */

import { cultureDistance } from './cultureDistance.js';

/** @typedef {import('./cultureDistance.js').CultureVector} CultureVector */

// ── Tuning (documented; retuned in the M7 + checkpoint soaks) ─────────────────
export const SMUGGLE_TUNING = Object.freeze({
  // ── The smuggle-success roll (§7 "bounded like combat, no hand of miracle"). A tight
  // HONEST siege leaks little; a CORRUPT loose one much more — but NEVER a certainty.
  // chance = clamp(BASE + NETWORK_W·network + CORRUPTION_W·corruption − RESIST_W·bulk,
  //   0, SMUGGLE_MAX) × attemptFactor(boldness). SMUGGLE_MAX < 1 is the ceiling BRAKE:
  // the besieged trickle SLOWS starvation, never lifts it (most rolls still fail).
  SUCCESS_BASE: 0.12,
  NETWORK_W: 0.4,      // the endpoints' criminal contacts
  CORRUPTION_W: 0.45,  // the worst gate's corruption — the HINGE (a leaky gate leaks)
  RESIST_W: 0.35,      // bulky / valuable cargo is harder to run
  SUCCESS_MAX: 0.65,   // the hard ceiling — no shipment is ever guaranteed through a siege

  // ── The risk-tolerance ATTEMPT gate (§4d). boldness = 1 − caution (the ONE W0 read).
  // Below ATTEMPT_FLOOR the mover does not run contraband at all (a cautious/lawful
  // trader submits); above it the smuggle scales linearly to full boldness.
  ATTEMPT_FLOOR: 0.3,

  // ── The conscience-gated SEIZURE take (W-C2). take = carried·(1 − conscience)·TAKE_MAX.
  // A good/lawful seizer (high conscience) loots little (the rest spoils / is freed); an
  // evil one takes near-all as loot. Bounded so a seizure never over-credits the gate.
  SEIZE_TAKE_MAX: 0.85,

  // ── The M6c EV-SPILL warrant (the tail of the greed curve). The criminal channel picks
  // up a legally-REFUSED link only when the shortage premium is deep AND the criminal
  // network is real AND the mover is bold. Deep shortage × strong network overcomes even a
  // siege (the blockade-runner emergence) — mirrors M6c's premium-beats-danger threshold.
  WARRANT_FLOOR: 0.35,
  WARRANT_NETWORK_FLOOR: 0.15,
});

// ── THE CONTRABAND CATEGORY TABLE (data-driven, relational, extensible) ────────
// Each contraband category carries a BAN PROFILE the relational rule evaluates against
// the TRANSITING gate. A category ABSENT from the table is freely traded everywhere.
// SLAVES is the flagship: banned by any morally-GOOD gate (abolition) OR any LAWFUL gate
// (outlawed), AND by a culturally-DISTANT gate. The others show the axis is general.
export const CONTRABAND_TABLE = Object.freeze({
  // The flagship. A good/lawful realm seizes a slave caravan; a slaver realm waves it on.
  slaves:   Object.freeze({ moralGoodBan: true,  lawfulBan: true,  cultureBanFloor: 0.5 }),
  // Arms: a culturally-distant / rival gate does not let a stranger's weapons pass.
  military: Object.freeze({ moralGoodBan: false, lawfulBan: false, cultureBanFloor: 0.55 }),
  // Unsanctioned arcana: a lawful-bureaucratic gate licenses (bans) it; culturally far too.
  arcane:   Object.freeze({ moralGoodBan: false, lawfulBan: true,  cultureBanFloor: 0.6 }),
});

// A morally-GOOD gate reads malice below this; a LAWFUL gate reads lawfulness above this.
const MORAL_GOOD_MALICE_MAX = 0.4;
const LAWFUL_MIN = 0.6;

// Per-category smuggle RESISTANCE (0..1): bulky / valuable / conspicuous cargo is harder
// to run (§7 "the goods — bulky/valuable = harder"). A slave caravan is the hardest to
// hide; luxuries draw scrutiny; bulk raw materials are heavy; the default is modest.
const GOODS_RESISTANCE = Object.freeze({
  slaves: 0.8, luxury: 0.7, military: 0.6, arcane: 0.6, raw_material: 0.5, fuel: 0.5,
  finished_good: 0.4, food: 0.35, other: 0.4,
});
const DEFAULT_RESISTANCE = 0.4;

// The gate-threat RANK ORDER (§II.3-4-e precedence): a HOSTILE gate (seizure) is worse than
// a CONTRABAND gate (confiscation) is worse than a plain TOLL gate. Named for the worst-gate
// selection; the pipeline branch reads the same precedence.
export const GATE_RANK = Object.freeze({ hostile: 3, contraband: 2, toll: 1 });

// A good whose id/category matches one of these is the flagship SLAVES category (an
// AGGREGATE good category — never a named person; the product boundary holds).
const SLAVE_GOOD_RE = /slave|captive|chattel|thrall|bondsm|serf.?trade/i;

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy floats */
function round4(v) {
  return Math.round(finiteNumber(v, 0) * 10000) / 10000;
}

// ── 1. CONTRABAND — the relational category classification + rule ──────────────
/**
 * Map a good (its catalog category + id) to its CONTRABAND category, or null when the
 * good is not a contraband category anywhere (freely traded). Data-driven: any category
 * present in CONTRABAND_TABLE is recognised, plus the flagship SLAVES id/category hook
 * (so a 'slaves' aggregate good is contraband-checked even though the catalog has no such
 * category yet — the extensible seam). Pure.
 * @param {string|null|undefined} goodCategory  the catalog category (normalizeGood)
 * @param {string|null|undefined} goodId        the good id (for the slaves hook)
 * @returns {string|null}
 */
export function contrabandCategoryOf(goodCategory, goodId) {
  const cat = String(goodCategory || '').toLowerCase();
  const id = String(goodId || '').toLowerCase();
  if (cat === 'slaves' || SLAVE_GOOD_RE.test(id) || SLAVE_GOOD_RE.test(cat)) return 'slaves';
  return Object.prototype.hasOwnProperty.call(CONTRABAND_TABLE, cat) ? cat : null;
}

/**
 * Is a carried good CONTRABAND at a transiting gate — the RELATIONAL rule (§4d). Reads the
 * category's ban profile against the GATE's own alignment (a morally-good gate abolishes
 * slavery; a lawful gate outlaws the trade) AND the cultureDistance(gate, origin) (a
 * culturally-distant gate bans what its neighbour trades freely). The SAME good is thus
 * contraband at one gate and legal at the next. A non-contraband category ⇒ always false.
 * Pure; total on garbage (a null vector reads the neutral 0.5s ⇒ mid distance, never throws).
 * @param {Object} args
 * @param {string|null} args.category         the contraband category (contrabandCategoryOf)
 * @param {CultureVector|null|undefined} args.gateVector    the transiting gate's culture vector
 * @param {CultureVector|null|undefined} args.originVector  the shipment origin's culture vector
 * @param {number} [args.tradeTie01]  the gate↔origin trade tie (closes culture distance)
 * @returns {boolean}
 */
export function isContraband({ category, gateVector, originVector, tradeTie01 = 0 }) {
  const profile = category
    ? /** @type {Record<string, { moralGoodBan: boolean, lawfulBan: boolean, cultureBanFloor: number }>} */ (CONTRABAND_TABLE)[category]
    : null;
  if (!profile) return false;
  const gate = gateVector || /** @type {CultureVector} */ ({});
  const gateMalice = clamp01(finiteNumber(gate.malice01, 0.5));
  const gateLaw = clamp01(finiteNumber(gate.lawfulness01, 0.5));
  // The gate's OWN law/alignment prohibition.
  if (profile.moralGoodBan && gateMalice < MORAL_GOOD_MALICE_MAX) return true;
  if (profile.lawfulBan && gateLaw > LAWFUL_MIN) return true;
  // The culturally-different gate bans what its neighbour trades freely.
  const dist = cultureDistance(gate, originVector || /** @type {CultureVector} */ ({}), { tradeTie01: clamp01(finiteNumber(tradeTie01, 0)) });
  return dist >= profile.cultureBanFloor;
}

/** The smuggle RESISTANCE of a good category (0..1; bulky/valuable = harder). Pure.
 *  @param {string|null|undefined} category @returns {number} */
export function goodsResistance(category) {
  const key = String(category || '').toLowerCase();
  const r = /** @type {Record<string, number>} */ (GOODS_RESISTANCE)[key];
  return Number.isFinite(r) ? r : DEFAULT_RESISTANCE;
}

// ── 2. THE SMUGGLE NETWORK + the risk-tolerance attempt gate ───────────────────
/**
 * The criminal-network strength of a shipment (0..1): the STRONGER of its two endpoints'
 * thieves-guild reads — either end's smugglers can run the goods (the besieged
 * destination's contacts, or the origin's). Both inputs are the EXISTING saturating
 * guildStrength (bounded [0,1]); the max of two bounded reads is bounded — the guild
 * saturation cap is the BRAKE this re-validates. Pure.
 * @param {number} originGuild @param {number} destGuild @returns {number}
 */
export function criminalNetworkStrength(originGuild, destGuild) {
  return clamp01(Math.max(clamp01(finiteNumber(originGuild, 0)), clamp01(finiteNumber(destGuild, 0))));
}

/** Smuggle BOLDNESS (0..1) from the mover's caution — the risk-tolerance ATTEMPT gate
 *  (§4d). boldness = 1 − caution, reusing the ONE W0 read (riskToleranceFromAlignment):
 *  a lawful/seasoned mover (high caution) runs little; a chaotic/rusty one runs a lot.
 *  @param {number} caution the ONE W0 risk-tolerance read (0..1) @returns {number} */
export function boldnessFromCaution(caution) {
  return clamp01(1 - clamp01(finiteNumber(caution, 1)));
}

/** The 0..1 attempt factor: 0 below ATTEMPT_FLOOR (too cautious to run contraband), then
 *  linear to 1 at full boldness. @param {number} boldness @returns {number} */
function attemptFactor(boldness) {
  const T = SMUGGLE_TUNING;
  const b = clamp01(finiteNumber(boldness, 0));
  return b <= T.ATTEMPT_FLOOR ? 0 : clamp01((b - T.ATTEMPT_FLOOR) / (1 - T.ATTEMPT_FLOOR));
}

/**
 * The smuggle-SUCCESS chance (0..SUCCESS_MAX) — the probability a shipment slips the worst
 * gate undetected. Rises with the network + the gate's CORRUPTION (the leaky-gate hinge),
 * falls with the goods' resistance, and is scaled by the risk-tolerance attempt factor.
 * HARD-CAPPED at SUCCESS_MAX < 1 (the no-hand-of-miracle brake): a tight honest siege has a
 * very low rate, a corrupt loose one much higher — never a certainty. Pure + total.
 * @param {Object} args
 * @param {number} args.network         criminalNetworkStrength (0..1)
 * @param {number} args.corruption      the worst gate's corruption / leakiness (0..1)
 * @param {number} args.goodsResistance the cargo's resistance (0..1, bulky/valuable higher)
 * @param {number} args.boldness        the mover's boldness (0..1)
 * @returns {number} chance in [0, SUCCESS_MAX]
 */
export function smuggleSuccessChance({ network, corruption, goodsResistance: resist, boldness }) {
  const T = SMUGGLE_TUNING;
  const raw = T.SUCCESS_BASE
    + T.NETWORK_W * clamp01(finiteNumber(network, 0))
    + T.CORRUPTION_W * clamp01(finiteNumber(corruption, 0))
    - T.RESIST_W * clamp01(finiteNumber(resist, DEFAULT_RESISTANCE));
  return round4(clamp(raw, 0, T.SUCCESS_MAX) * attemptFactor(boldness));
}

/** The smuggle roll outcome: DETECTED when the draw fails to beat the success chance.
 *  A draw ≥ chance ⇒ detected (the gate catches it); a draw < chance ⇒ it slips through.
 *  @param {number} chance the smuggleSuccessChance @param {number} draw a seeded [0,1) roll
 *  @returns {boolean} detected */
export function smuggleDetected(chance, draw) {
  return clamp01(finiteNumber(draw, 1)) >= clamp01(finiteNumber(chance, 0));
}

// ── 3. THE PIPELINE ORDER (§II.3-4-e — LAW) ────────────────────────────────────
/**
 * The per-gate event pipeline branch, in the EXACT §II.3-4-e precedence:
 *   smuggle roll → (if detected ∧ hostile) SEIZURE → (elif contraband) CONFISCATION → else TOLL.
 * A shipment that slips the roll (detected false) ALWAYS falls to TOLL (delivered — the
 * trickle survives). A detected shipment SEIZES at a hostile gate BEFORE it CONFISCATES at
 * a contraband one BEFORE it merely TOLLs — a hostile gate seizes even a legal cargo. This
 * function IS the law; commodityFlow calls it so the code order provably matches the design.
 * @param {{ detected: boolean, hostile: boolean, contraband: boolean }} args
 * @returns {'seizure'|'confiscation'|'toll'}
 */
export function smugglePipeline({ detected, hostile, contraband }) {
  if (detected && hostile) return 'seizure';       // interception seizure (a hostile gate)
  if (detected && contraband) return 'confiscation'; // legal/moral confiscation (a banning gate)
  return 'toll';                                    // slipped through, or nothing to seize
}

// ── 4. THE WORST GATE (§II.3-4-f) + the conscience-gated seizure take ──────────
/**
 * @typedef {Object} GateThreat
 * @property {string} id            the gate settlement id
 * @property {boolean} hostile      hostile to the destination (interception seizure)
 * @property {boolean} contraband   the cargo is contraband here (confiscation)
 * @property {number} danger        the gate's embattlement level (the intra-rank tie-break)
 */

/** A gate's threat RANK (the §II.3-4-e precedence). @param {GateThreat} g @returns {number} */
function gateRank(g) {
  return g.hostile ? GATE_RANK.hostile : g.contraband ? GATE_RANK.contraband : GATE_RANK.toll;
}

/**
 * The route's WORST gate — the ONE gate the single smuggle roll is made against (§II.3-4-f:
 * NOT one roll per gate, or a long hostile route becomes impossible and contradicts the
 * besieged trickle). Worst by TIER precedence (hostile > contraband > toll), then by highest
 * embattlement, then codepoint id (deterministic). Returns the gate + its resolved `kind`,
 * or null when the route has no intermediary gate at all. Pure.
 * @param {GateThreat[]} gates  the route's intermediaries (path minus origin + destination)
 * @returns {(GateThreat & { kind: 'hostile'|'contraband'|'toll' })|null}
 */
export function worstGate(gates) {
  const list = Array.isArray(gates) ? gates : [];
  /** @type {GateThreat|null} */
  let best = null;
  for (const g of list) {
    if (!g) continue;
    if (!best) { best = g; continue; }
    const rg = gateRank(g);
    const rb = gateRank(best);
    if (rg > rb
      || (rg === rb && finiteNumber(g.danger, 0) > finiteNumber(best.danger, 0))
      || (rg === rb && finiteNumber(g.danger, 0) === finiteNumber(best.danger, 0) && String(g.id) < String(best.id))) {
      best = g;
    }
  }
  if (!best) return null;
  const kind = best.hostile ? 'hostile' : best.contraband ? 'contraband' : 'toll';
  return { id: String(best.id), hostile: !!best.hostile, contraband: !!best.contraband, danger: finiteNumber(best.danger, 0), kind };
}

/**
 * The conscience-gated SEIZURE take (W-C2): how much of a seized load the interceptor loots
 * into its own stock. take = floor(carried · (1 − conscience) · SEIZE_TAKE_MAX). A good/
 * lawful seizer (conscience → 1) loots almost nothing (the rest spoils / is returned); an
 * evil one (conscience → 0) takes near-all. Bounded to [0, carried]. Pure.
 * @param {number} carried     the seized quantity
 * @param {number} conscience  the seizer's conscience read (0 evil … 1 good/lawful)
 * @returns {number} integer units looted
 */
export function seizureTake(carried, conscience) {
  const load = Math.max(0, Math.floor(finiteNumber(carried, 0)));
  const c = clamp01(finiteNumber(conscience, 0));
  return Math.max(0, Math.min(load, Math.floor(load * (1 - c) * SMUGGLE_TUNING.SEIZE_TAKE_MAX)));
}

// ── THE M6c EV-SPILL — the criminal channel picks up a refused legal link ──────
/**
 * The M6c → M7 spill warrant: does the CRIMINAL channel run a legally-REFUSED (or route-
 * blocked) link? True when the destination's shortage premium is deep enough AND the
 * criminal network is real AND the mover is bold enough to attempt it. A deep shortage
 * (premium → 1) with a strong network overcomes even a siege — the blockade-runner
 * emergence (round 22.4). Pure.
 * @param {Object} args
 * @param {number} args.needPremium  the destination's shortage premium (0..1, M6a band)
 * @param {number} args.network      criminalNetworkStrength (0..1)
 * @param {number} args.boldness     the mover's boldness (0..1)
 * @returns {boolean}
 */
export function smuggleDispatchWarrant({ needPremium, network, boldness }) {
  const T = SMUGGLE_TUNING;
  const prem = clamp01(finiteNumber(needPremium, 0));
  const net = clamp01(finiteNumber(network, 0));
  const bold = clamp01(finiteNumber(boldness, 0));
  if (net < T.WARRANT_NETWORK_FLOOR || bold <= T.ATTEMPT_FLOOR) return false;
  // Deep shortage × a real network clears the floor (the blockade-runner threshold).
  return prem * (0.5 + 0.5 * net) >= T.WARRANT_FLOOR;
}
