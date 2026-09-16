/**
 * domain/worldPulse/npcReplacement.js — W-H3: THE SETTLEMENT'S FINGERPRINT ON ITS NEXT
 * GENERATION, AND THE POPULATION FLOOR.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §5 replacement, §9 the population floor
 * reconciliation; laws 4 FINITE SEMANTICS, 5 DORMANCY, 6 CONSERVATION.)
 *
 * ── THE BIAS IS MARGINAL, AND THE NUMBER IS THE POINT ──────────────────────
 * A vacated slot refills through the EXISTING slot-inheritance lane. When no roamer
 * passes admission, the fresh mint draws its traits with a SMALL bias toward the
 * settlement's own state: a hard town breeds slightly harder people, a prosperous one
 * slightly more acquisitive ones. One documented weight, REPLACEMENT_BIAS_WEIGHT, and
 * nothing else. At the designed 0.18 the favoured rung of a three-rung band wins about
 * 51% of the time instead of 33%, so roughly half of all successors still surprise you
 * and the lean is nonetheless unmistakable over a century.
 *
 * ── THE LOOP IS CUT AT THE INPUT, NOT DAMPED AT THE OUTPUT ────────────────
 * J-D8b ii asks that the corruption-attracts-corruption loop be MEASURED SHUT. Damping
 * a feedback loop is a tuning claim that has to be re-measured every time anything
 * moves. SEVERING it is a structural one: settlementTraitBias reads SETTLEMENT STATE
 * ONLY (config, economy, stress, the governing power's own alignment) and never reads
 * the roster. The cast therefore cannot feed back into the distribution its successors
 * are drawn from, at any horizon, by construction. The stationarity pin measures the
 * consequence (year 100 matches year 10 within power) and an in-test mutant that DOES
 * read the roster is the negative control that proves the measurement has teeth.
 *
 * ── THE POPULATION FLOOR IS A RECONCILIATION, NOT A NEW RULE (§9) ─────────
 * Population is never below the resident named-NPC count, and ANONYMOUS RESIDENTS DRAIN
 * FIRST. The settlement lifecycle kernel's empty fast path then evaluates its
 * effective-zero floor against (population MINUS resident named NPCs), which is what
 * makes "a town reduced to only its cast" terminal-decline eligible rather than immortal.
 * The arithmetic lives here as pure functions; the lifecycle kernel is READ-ONLY to this
 * slice, so the wiring that hands these to it is recorded as deferred, not smuggled in.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation, and
 * ZERO rng draws (every choice is a labelled FNV-1a hash).
 *
 * @enforced-by tests/domain/npcReplacement.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { clamp, clamp01 } from '../../kernel/math.js';
import { npcConsequencesActive, npcLedgerOf } from './npcLedger.js';
import { NPC_CONSEQUENCES_TUNING } from './npcConsequencesTuning.js';

/** The seeded-fork labels (design §11's `npcfate:*` namespace). */
export const REPLACEMENT_FORK_LABEL = 'npcfate:replacement';
export const MINT_FORK_LABEL = 'npcfate:mint';

/** The composite-key delimiter, named for the same reason H1 and H2 name theirs. */
const KEY_DELIM = '|';

/**
 * THE THREE BIASED BANDS (design §5's "alignment lean, economic character, stress
 * posture"). Each is an ORDERED three-rung closed vocabulary, so the middle rung is
 * always the unremarkable one and a bias toward either end is legible without a lookup.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const MINT_BIAS_BANDS = Object.freeze({
  alignmentLean: Object.freeze(['good', 'neutral', 'evil']),
  economicCharacter: Object.freeze(['thrifty', 'steady', 'acquisitive']),
  stressPosture: Object.freeze(['sanguine', 'guarded', 'hardened']),
});

/** The band names, in the fixed order a mint draws them. Key order is load-bearing for
 *  byte identity exactly as it is for the reputation facet set.
 *  @type {ReadonlyArray<string>} */
export const MINT_BIAS_KEYS = Object.freeze(['alignmentLean', 'economicCharacter', 'stressPosture']);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * FNV-1a 32-bit. The estate's one hash idiom, carried locally so this leaf keeps a
 * narrow import posture (same constants as kernel/proseHash.js and its siblings).
 * @param {string} s @returns {number} unsigned 32-bit
 */
function fnv1a32(s) {
  let h = 0x811c9dc5;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A deterministic roll in [0, 1) from a labelled key. ZERO DRAWS.
 *  @param {string} key @returns {number} */
export function replacementRoll01(key) {
  return fnv1a32(text(key)) / 0x100000000;
}

// ── THE BANDED DELAY (design §5: "shortly after") ────────────────────────────
/**
 * WHEN THE SLOT REFILLS. A banded, seeded delay after the tick the seat emptied.
 *
 * The band's floor is one tick rather than zero on purpose: a seat that refills on the
 * very tick it emptied never reads as a vacancy at all, and the contested opening H2
 * emits needs at least one tick in which to be contested.
 *
 * @param {Object} args
 * @param {string} args.settlementSeed @param {string} args.settlementId
 * @param {string} args.rosterId @param {number} args.vacancyTick
 * @returns {number} the tick the slot is due to refill
 */
export function replacementDueTick({ settlementSeed, settlementId, rosterId, vacancyTick }) {
  const band = NPC_CONSEQUENCES_TUNING.REPLACEMENT_DELAY_TICKS;
  const span = Math.max(0, band.max - band.min);
  const key = [
    REPLACEMENT_FORK_LABEL, text(settlementSeed), text(settlementId), text(rosterId), String(tickOf(vacancyTick)),
  ].join(KEY_DELIM);
  const offset = span === 0 ? 0 : Math.min(span, Math.floor(replacementRoll01(key) * (span + 1)));
  return tickOf(vacancyTick) + band.min + offset;
}

// ── THE SETTLEMENT'S FINGERPRINT (design §5) ─────────────────────────────────
/**
 * THE FAVOURED RUNG OF EACH BAND, read from SETTLEMENT STATE ONLY.
 *
 * WHAT IS DELIBERATELY NOT READ, and it is the whole stationarity argument: `npcs`,
 * `factions[].members`, any trait, any personality, any corruption flag on a person.
 * Reading the cast would make the next generation a function of this one, which is the
 * corruption-attracts-corruption loop J-D8b ii requires be shut. It is shut HERE, at the
 * input, so no amount of drift downstream can reopen it.
 *
 * The three reads are settlement-level and ordinary: the governing power's own alignment
 * (or the settlement's declared one), prosperity, and unrest. Each maps onto its band's
 * three rungs through documented thresholds and is TOTAL on a settlement that carries
 * none of them (everything reads the middle rung, which is the no-signal answer).
 *
 * @param {unknown} settlement
 * @returns {{ alignmentLean: string, economicCharacter: string, stressPosture: string }}
 */
export function settlementTraitBias(settlement) {
  const s = asObject(settlement);
  const config = asObject(s.config);

  // ALIGNMENT: the settlement's declared moral character, from its own field or its
  // config's. A d20-style alignment string is read for its good/evil half only.
  const declared = text(s.alignment || config.alignment).toLowerCase();
  const alignmentLean = declared.includes('evil')
    ? 'evil'
    : declared.includes('good') ? 'good' : 'neutral';

  // ECONOMY: prosperity as the estate spells it on a settlement, 0..100 or 0..1.
  const rawProsperity = num(s.prosperity, num(config.prosperity, num(s.wealth, Number.NaN)));
  const prosperity01 = Number.isFinite(rawProsperity)
    ? clamp01(rawProsperity > 1 ? rawProsperity / 100 : rawProsperity)
    : 0.5;
  const economicCharacter = prosperity01 >= 0.66
    ? 'acquisitive'
    : prosperity01 <= 0.33 ? 'thrifty' : 'steady';

  // STRESS: unrest as the estate spells it on a settlement, 0..100 or 0..1.
  const rawUnrest = num(s.unrest, num(config.unrest, num(s.stress, Number.NaN)));
  const unrest01 = Number.isFinite(rawUnrest)
    ? clamp01(rawUnrest > 1 ? rawUnrest / 100 : rawUnrest)
    : 0.5;
  const stressPosture = unrest01 >= 0.66
    ? 'hardened'
    : unrest01 <= 0.33 ? 'sanguine' : 'guarded';

  return { alignmentLean, economicCharacter, stressPosture };
}

/**
 * DRAW ONE RUNG FROM ONE BAND, with the marginal bias.
 *
 * The favoured rung takes an EXTRA `REPLACEMENT_BIAS_WEIGHT` of probability mass, taken
 * evenly from the others; every rung keeps positive mass, so no outcome is ever
 * unreachable and the surprise is real rather than a rounding artifact. At weight 0 this
 * is exactly a uniform draw, which is the negative control the effect-size pin runs.
 *
 * @param {string} bandKey a MINT_BIAS_KEYS member
 * @param {string} favoured the rung the settlement leans toward
 * @param {string} rollKey
 * @returns {string} a rung of that band
 */
export function biasedRung(bandKey, favoured, rollKey) {
  const band = MINT_BIAS_BANDS[bandKey] || MINT_BIAS_BANDS.alignmentLean;
  const size = band.length;
  const uniform = 1 / size;
  const weight = clamp(NPC_CONSEQUENCES_TUNING.REPLACEMENT_BIAS_WEIGHT, 0, 1 - uniform);
  const favouredIndex = band.indexOf(favoured);
  const roll = replacementRoll01(rollKey);
  if (favouredIndex < 0 || size < 2) return band[Math.min(size - 1, Math.floor(roll * size))];

  const share = weight / (size - 1);
  let acc = 0;
  for (let i = 0; i < size; i += 1) {
    acc += i === favouredIndex ? uniform + weight : uniform - share;
    if (roll < acc) return band[i];
  }
  return band[size - 1];
}

/**
 * @typedef {Object} FreshMintDraw
 * @property {string} alignmentLean
 * @property {string} economicCharacter
 * @property {string} stressPosture
 * @property {{ alignmentLean: string, economicCharacter: string, stressPosture: string }} bias
 */

/**
 * THE FRESH MINT'S BIASED TRAIT DRAW. Three bands, three independent rolls, one
 * documented weight. Key order is fixed for the same byte-identity reason the facet set
 * fixes its own.
 *
 * @param {Object} args
 * @param {unknown} args.settlement
 * @param {string} args.settlementSeed @param {string} args.settlementId
 * @param {string} args.rosterId @param {number} args.tick
 * @returns {FreshMintDraw}
 */
export function freshMintDraw({ settlement, settlementSeed, settlementId, rosterId, tick }) {
  const bias = settlementTraitBias(settlement);
  const stem = [MINT_FORK_LABEL, text(settlementSeed), text(settlementId), text(rosterId), String(tickOf(tick))];
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of MINT_BIAS_KEYS) {
    out[key] = biasedRung(key, /** @type {Record<string, string>} */ (bias)[key], [...stem, key].join(KEY_DELIM));
  }
  out.bias = bias;
  return /** @type {FreshMintDraw} */ (out);
}

// ── THE REFILL DECISION (design §5: a roamer FIRST, then a fresh mint) ───────
/**
 * @typedef {Object} RefillDecision
 * @property {string} kind        'roamer' | 'fresh_mint' | 'not_due'
 * @property {string} wnpcId      the roamer taking the slot ('' for a fresh mint)
 * @property {FreshMintDraw|null} draw
 * @property {number} dueTick
 */

/**
 * WHO TAKES THE EMPTY SEAT.
 *
 * A ROAMER FIRST, because design §5 gives them priority and because a settlement
 * reaching for somebody already displaced is the whole reason circulation exists. The
 * candidates are supplied by the caller (they are the roamers who passed §6 admission at
 * this settlement, which is npcCirculation.js's question, not this file's), so this
 * function never re-runs an admission check and the two can never disagree about who was
 * eligible. Ties resolve by codepoint, so the seat is a pure function of the candidate
 * set rather than of its order.
 *
 * A FRESH MINT otherwise, with the marginal bias.
 *
 * NOT DUE before the banded delay elapses. That is a real answer: the seat stands open,
 * which is exactly what the contested opening wants.
 *
 * DORMANT ⇒ 'not_due' with a null draw, so no caller can mint a person out of a dark flag.
 *
 * @param {Object} args
 * @param {{ simulationRules?: unknown, spatialLedgers?: unknown } | null | undefined} args.worldState
 *   BOTH halves of the shared world shape, because this function asks BOTH questions:
 *   the dormancy gate reads `simulationRules` and the roamer lookup reads the ledger
 *   under `spatialLedgers`. Naming only one of them would have been a third spelling of
 *   a shape convergence.js and the circulation siblings already state this way.
 * @param {unknown} args.settlement
 * @param {string} args.settlementSeed @param {string} args.settlementId
 * @param {string} args.rosterId @param {number} args.vacancyTick @param {number} args.tick
 * @param {ReadonlyArray<string>} [args.admittedRoamerIds]
 * @returns {RefillDecision}
 */
export function resolveSlotRefill({
  worldState, settlement, settlementSeed, settlementId, rosterId, vacancyTick, tick,
  admittedRoamerIds = [],
}) {
  const dueTick = replacementDueTick({ settlementSeed, settlementId, rosterId, vacancyTick });
  if (!npcConsequencesActive(worldState)) return { kind: 'not_due', wnpcId: '', draw: null, dueTick };
  if (tickOf(tick) < dueTick) return { kind: 'not_due', wnpcId: '', draw: null, dueTick };

  const roamers = npcLedgerOf(worldState).roamers;
  const eligible = asArray(admittedRoamerIds)
    .map(text)
    .filter((id) => id && Object.prototype.hasOwnProperty.call(roamers, id))
    .sort(compareCodepoint);
  if (eligible.length > 0) return { kind: 'roamer', wnpcId: eligible[0], draw: null, dueTick };

  return {
    kind: 'fresh_mint',
    wnpcId: '',
    draw: freshMintDraw({ settlement, settlementSeed, settlementId, rosterId, tick }),
    dueTick,
  };
}

// ── THE POPULATION FLOOR (design §9) ─────────────────────────────────────────
/**
 * HOW MANY NAMED PEOPLE LIVE HERE.
 *
 * Counted off `npcs[]` and DEDUPED BY SLOT ID, never summed across the faction homes.
 * The alias trap makes that distinction load-bearing: `factions[].members[]` entries ARE
 * the `npcs[]` objects in memory, so adding the two homes would double-count every
 * affiliated character in memory and count them correctly only after a reload. A
 * population floor that moved on serialization would be the worst possible version of
 * this function.
 *
 * @param {unknown} settlement
 * @returns {number}
 */
export function residentNamedNpcCount(settlement) {
  const ids = new Set();
  let anonymous = 0;
  for (const raw of asArray(asObject(settlement).npcs)) {
    const id = text(asObject(raw).id);
    // A roster entry with no id is still a person living here; it just cannot be deduped,
    // so it is counted once on its own rather than dropped.
    if (id) ids.add(id);
    else anonymous += 1;
  }
  return ids.size + anonymous;
}

/**
 * THE EFFECTIVE POPULATION the empty fast path evaluates against (design §9): the head
 * count MINUS the resident named cast. Never negative.
 *
 * This is the number that makes a town reduced to only its cast terminal-decline
 * ELIGIBLE. Without it a settlement whose last forty anonymous residents left would
 * still read as a population of six and live forever on the strength of its own
 * paperwork.
 *
 * @param {unknown} settlement
 * @returns {number}
 */
export function effectivePopulationForFloor(settlement) {
  const pop = Math.max(0, Math.round(num(asObject(settlement).population, 0)));
  return Math.max(0, pop - residentNamedNpcCount(settlement));
}

/**
 * @typedef {Object} FloorReconciliation
 * @property {number} population    the reconciled head count
 * @property {number} namedCount
 * @property {number} anonymous     population minus the named cast, never negative
 * @property {boolean} violated     the input population sat BELOW its own named cast
 * @property {boolean} changed
 */

/**
 * RECONCILE ONE SETTLEMENT'S HEAD COUNT AGAINST ITS NAMED CAST (design §9): population
 * is at least the resident named count AT ALL TIMES.
 *
 * A violation is REPAIRED UPWARD rather than by removing people, because the alternative
 * is deleting a named character to satisfy an arithmetic invariant, and law 1 forbids the
 * engine ending anybody. The slack constant is declared in the tuning table rather than
 * written as a bare zero here.
 *
 * @param {unknown} settlement
 * @returns {FloorReconciliation}
 */
export function reconcilePopulationFloor(settlement) {
  const pop = Math.max(0, Math.round(num(asObject(settlement).population, 0)));
  const namedCount = residentNamedNpcCount(settlement);
  const floor = namedCount + NPC_CONSEQUENCES_TUNING.POPULATION_NAMED_FLOOR_SLACK;
  const population = Math.max(pop, floor);
  return {
    population,
    namedCount,
    anonymous: Math.max(0, population - namedCount),
    violated: pop < floor,
    changed: population !== pop,
  };
}

/**
 * DRAIN A POPULATION LOSS, ANONYMOUS RESIDENTS FIRST (design §9).
 *
 * The named cast is the last thing a town loses, and it never loses them to arithmetic:
 * a loss larger than the anonymous pool stops at the named count and reports the
 * SHORTFALL, which is the signal the caller needs to disperse the cast instead (the two
 * laws compose in the SAME outcome). Nobody is deleted here.
 *
 * @param {unknown} settlement
 * @param {number} loss
 * @returns {{ population: number, drained: number, shortfall: number, castExposed: boolean }}
 */
export function drainAnonymousFirst(settlement, loss) {
  const reconciled = reconcilePopulationFloor(settlement);
  const wanted = Math.max(0, Math.round(num(loss, 0)));
  const drained = Math.min(wanted, reconciled.anonymous);
  return {
    population: reconciled.population - drained,
    drained,
    shortfall: wanted - drained,
    // The town is now nothing but its cast: terminal-decline eligible, and the dispersal
    // is what resolves it.
    castExposed: reconciled.population - drained <= reconciled.namedCount,
  };
}

/**
 * IS THIS TOWN DOWN TO ITS CAST at the lifecycle kernel's effective-zero floor?
 *
 * The floor value is a PARAMETER rather than an import, because the settlement lifecycle
 * kernel owns it (SETTLEMENT_LIFECYCLE_TUNING.ZERO_POP_FLOOR) and this slice is read-only
 * toward that kernel. Passing it in keeps one owner for the number and lets the pin
 * assert the composition without this file reaching across the boundary.
 *
 * @param {unknown} settlement
 * @param {number} zeroPopFloor
 * @returns {boolean}
 */
export function reducedToCast(settlement, zeroPopFloor) {
  return effectivePopulationForFloor(settlement) <= Math.max(0, num(zeroPopFloor, 0));
}
