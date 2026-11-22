/**
 * domain/worldPulse/magicSubstitution.js — W-K slice K4: THE SUBSTITUTION CHANNEL
 * (binding law docs/DESIGN_MAGIC_ECONOMY.md §6, with §1 laws 1 NO EXEMPTION,
 * 3 ONE GATE FORMULA, 7 FINITE SEMANTICS and 8 DORMANCY).
 *
 * §6 in one sentence: at the highest regimes magic may substitute for food and
 * supply, AS A CHANNEL in the existing foodBalance architecture, with a CAP-BANDED
 * share that costs material, and removing the magic source makes the deficit
 * honestly reappear.
 *
 * ── THE CHANNEL IS A TERM, NOT A BYPASS (the whole design of this file) ──────
 * The estate's tick-time food model already has exactly the shape §6 asks for.
 * `advanceFoodStockpile` builds ONE effective deficit as a sum of percentage-of-need
 * terms: a structural base, a blockade cut, a famine cut, a deployment drain, a
 * seasonal shortfall, and — the precedent that matters here — `seasonalBoostPct`,
 * a term SUBTRACTED from that same sum. A harvest does not get its own private
 * ledger; it lands on the one number the granary drawdown then answers.
 *
 * Magical substitution is that shape exactly. `magicSubstitutionPct` is a
 * percentage of need, in the same units as `blockadePct` and `seasonalBoostPct`,
 * and `substitutedDeficitPct` is the one-line composition, clamped to the identical
 * [0, 95] band the food model uses. A settlement fed by a guild is therefore not
 * exempt from hunger arithmetic; it is a settlement with one more term, and every
 * mechanism that already answers that number (the drawdown, the tithe, the
 * resilience re-grade, the siege counterforce) answers this one for free.
 *
 * A BYPASS WOULD HAVE BEEN EASIER AND WRONG. Zeroing the deficit for a magical city,
 * or short-circuiting the granary, would have made the substitution share invisible
 * to every existing consumer and unfalsifiable by the conservation pin. The term
 * shape is what makes the anti-exemption law testable rather than asserted.
 *
 * ── WHAT IT COSTS (§6: "costs material") ────────────────────────────────────
 * Two factors, and both are things an enemy can take away.
 *
 *   PRACTITIONER CAPACITY. The share is scaled by the K1 capacity of the magic
 *   institutions actually standing. An impaired guild substitutes less THIS TICK,
 *   which is the fast half of the two-timescale law reaching the dinner table.
 *
 *   REAGENT SUPPLY. The share is scaled by whether the reagent hunger is being met.
 *   A settlement that neither makes nor receives reagents cannot conjure bread out
 *   of an empty bench. The reagent read lives in the sibling leaf
 *   (magicSubstitutionReagents.js) because that is where the corridor demand and
 *   the interdiction verdict are computed; this file consumes its verdict.
 *
 * Both factors are MULTIPLICATIVE against the cap, never additive on top of it, so
 * the cap is a true ceiling: no composition of a rich regime, a full guild and a
 * fat reagent stock can carry more than the band allows.
 *
 * ── THE DEPENDENCY METRIC (§6: "a named fragility") ─────────────────────────
 * The share is not merely a number the food model eats. It is published as
 * MAGICAL DEPENDENCY: a banded word, the named sources carrying it, and the named
 * TARGETS an enemy cuts to end it. The targets list is the design's
 * "enemy-targetable" clause made mechanical rather than rhetorical, and it is
 * denominated in things the rest of the estate already understands (institution
 * refs and a goods-catalog id), so a siege planner and a Herald beat read the same
 * three fields.
 *
 * ── THE REGIME SEAM: K2 IS THE AUTHORITY, AND THIS FILE OWNS NO PART OF IT ──
 * §6's gate is the ECONOMY REGIME, and K2 owns the ladder, the thresholds and the
 * hysteresis. K4 was written against the design contract while K2 was still in
 * flight, and RE-POINTED ONTO K2's ACTUAL EXPORTS the moment its model leaf landed,
 * which is why there is no mirrored ladder and no second spelling of the ledger key
 * here: `MAGIC_REGIME_LADDER` is a re-export of K2's `MAGIC_REGIMES`, and the record
 * read goes through K2's own `readMagicRegimeRecord`. A duplicated key constant
 * would have been a fork the spatial-ledger walker resolves by NAME, so the two
 * definitions would have had to agree forever by discipline alone.
 *
 * K2's BASE RUNG IS THE ABSENCE OF A RECORD: a settlement at `subsistence` carries no
 * ledger row at all, so an absent record reads as the base regime rather than as
 * missing data. That is the honest reading and it is also the dormant one, because
 * the base rung's substitution cap is exactly zero.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation, no store.
 *
 * @enforced-by tests/domain/magicSubstitution.test.js
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { foodLedger } from '../foodLedger.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import {
  deriveInstitutionStatus,
  institutionStatusRef,
  magicEconomyActive,
  readInstitutionStatusRecord,
} from './institutionStatusModel.js';
import {
  BASE_MAGIC_REGIME,
  MAGIC_REGIMES,
  MAGIC_REGIME_LEDGER as MAGIC_REGIME_LEDGER_KEY,
  readMagicRegimeRecord,
} from './magicRegimeModel.js';

/**
 * THE ECONOMY REGIME LADDER (§3a), RE-EXPORTED FROM ITS OWNER. K2's `MAGIC_REGIMES`
 * is the one authority; this alias exists so a K4 consumer can read the ladder
 * without having to know which slice minted it, and it is deliberately an alias
 * rather than a copy so the two can never disagree.
 * @type {ReadonlyArray<string>}
 */
export const MAGIC_REGIME_LADDER = MAGIC_REGIMES;

/**
 * The conditional worldState sub-ledger the regime lives in (§10), re-exported from
 * K2 rather than re-declared. The spatial-ledger coverage walker resolves ledger-key
 * constants BY NAME across the whole domain tree, so a second definition of this name
 * would be a fork that only discipline kept honest.
 * @type {string}
 */
export const MAGIC_REGIME_LEDGER = MAGIC_REGIME_LEDGER_KEY;

/**
 * THE CLOSED DEPENDENCY VOCABULARY (§6, law 7). The word a surface says about a
 * settlement's magical dependency. `none` is the absence reading and is never
 * persisted or narrated.
 * @type {ReadonlyArray<string>}
 */
export const MAGIC_DEPENDENCY_BANDS = Object.freeze([
  'none', 'slight', 'marked', 'severe',
]);

/**
 * MAGIC_SUBSTITUTION_TUNING (§11: "substitution caps"). Every entry PROPOSED and
 * soak-vetoable per the R-15 shape.
 *
 * CAP_BY_REGIME is §6's cap band, and the two live numbers are ANCHORED rather than
 * invented. The industrial ceiling is 0.30 because that is exactly
 * FOOD_IMPORT_RATES.teleport, the estate's own standing verdict on how much of a
 * settlement's need magic can carry: a teleportation circle moves what is rationed
 * and necessary, never bulk plenty. Letting an industrial-magic foundry beat the
 * circle would have been the first quiet exemption. The patronized rung is 0.12, a
 * token share for a house that has a patron but not an industry, which is what makes
 * §6's plural "highest regime(s)" true without making patronage a food policy. The
 * bottom two rungs are exactly zero, which is the law rather than a tuning choice:
 * a subsistence or merely funded settlement has no substitution channel at all.
 *
 * REAGENT_DRAW_PER_SHARE is the material price in flow-ledger integers: how much
 * corridor demand one full point of substituted need generates. Integers, because the
 * flow ledger accrues whole numbers by law (routeNetworkFlows: a float accumulator
 * drifts, and a drift that takes a century to surface is the worst possible violation
 * of THE PROMISE).
 *
 * DEPENDENCY_FLOOR maps the share to the banded word, read high to low.
 * @type {Readonly<Record<string, unknown>>}
 */
export const MAGIC_SUBSTITUTION_TUNING = Object.freeze({
  CAP_BY_REGIME: Object.freeze({
    subsistence: 0,
    funded: 0,
    patronized: 0.12,
    industrial: 0.3,
  }),
  REAGENT_DRAW_PER_SHARE: 8,
  DEPENDENCY_FLOOR: Object.freeze([
    Object.freeze({ atLeast: 0.2, band: 'severe' }),
    Object.freeze({ atLeast: 0.1, band: 'marked' }),
    Object.freeze({ atLeast: 0.02, band: 'slight' }),
  ]),
  // The food model clamps its effective deficit into this band; the substituted
  // deficit is clamped identically so the channel cannot produce a number the
  // architecture it joins would never have produced itself.
  DEFICIT_FLOOR_PCT: 0,
  DEFICIT_CEILING_PCT: 95,
});

/**
 * The rung weight each magic institution contributes to practitioner capacity. Read
 * by substring against the institution's own name, which is how the estate's other
 * magic readers already resolve the forms ladder in prose (foodBalance.js's caster
 * booleans, chainMagicSubstitution's tradition read). K2 owns the FORMS LADDER
 * proper; this is deliberately the coarse read K4 needs to answer "how much can this
 * roster carry", and it is ordered so the strongest match wins.
 * @type {ReadonlyArray<Readonly<{ needle: string, weight: number }>>}
 */
const PRACTITIONER_RUNGS = Object.freeze([
  Object.freeze({ needle: 'academy of magic', weight: 1 }),
  Object.freeze({ needle: 'foundry', weight: 1 }),
  Object.freeze({ needle: 'district', weight: 0.9 }),
  Object.freeze({ needle: 'guild', weight: 0.8 }),
  Object.freeze({ needle: 'tower', weight: 0.6 }),
  Object.freeze({ needle: 'circle', weight: 0.5 }),
  Object.freeze({ needle: 'enchanter', weight: 0.4 }),
  Object.freeze({ needle: 'alchemist', weight: 0.3 }),
  Object.freeze({ needle: 'wizard', weight: 0.25 }),
  Object.freeze({ needle: 'mage', weight: 0.25 }),
  Object.freeze({ needle: 'druid', weight: 0.25 }),
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/** @param {unknown} value @returns {string} */
const text = (value) => String(value == null ? '' : value).trim().toLowerCase();

/** @param {unknown} value @param {number} fallback @returns {number} */
const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

/** Shares are carried at 4 decimals so a cap comparison is exact rather than fuzzy.
 *  @param {number} value @returns {number} */
const round4 = (value) => Math.round(value * 10000) / 10000;

/** @param {number} value @returns {number} */
const round1 = (value) => Math.round(value * 10) / 10;

/**
 * @typedef {Object} MagicDependency
 * THE NAMED FRAGILITY (§6). `share` is the fraction of daily need the magic channel
 * carries; `sources` are the institutions carrying it; `targets` are what an enemy
 * takes away to end it.
 * @property {string} band  a member of MAGIC_DEPENDENCY_BANDS
 * @property {number} share 0..1
 * @property {ReadonlyArray<string>} sources  institution refs, codepoint sorted
 * @property {ReadonlyArray<string>} targets  what an interdiction or a siege removes
 */

/**
 * @typedef {Object} MagicSubstitution
 * @property {string} regime  the regime that authorised the channel
 * @property {number} capShare       the band ceiling, 0..1
 * @property {number} share          the share actually carried, 0..1, never above capShare
 * @property {number} pctOfNeed      `share` in percentage points, the food model's unit
 * @property {number} practitionerCapacity01  the roster factor, 0..1
 * @property {number} reagentSupply01         the material factor, 0..1
 * @property {number} reagentDraw    whole-number corridor demand this share generates
 * @property {MagicDependency} dependency
 */

/**
 * Is the magic economy lit for this world? Re-exported from the K1 model rather than
 * re-spelled, so W-K has exactly one gate (law 3) and a source scan can prove it.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState
 * @returns {boolean}
 */
export function magicSubstitutionActive(worldState) {
  return magicEconomyActive(worldState);
}

/**
 * The economy regime in force for one settlement.
 *
 * Reads through K2's own record accessor, so there is one traversal of that ledger's
 * two-level key law in the estate rather than two. AN ABSENT RECORD IS THE BASE RUNG,
 * not missing data: K2 stores nothing for a subsistence settlement precisely so a
 * world that never grew past subsistence is byte-identical to one with no ledger.
 *
 * A word OUTSIDE the closed ladder answers the base rung too, which makes an unknown
 * regime NON-SUBSTITUTING rather than silently mid-band. A record that is not an
 * OBJECT is likewise the base rung, and that is K2's rule rather than a choice made
 * here: `readMagicRegimeRecord` answers null for anything that is not a record, so a
 * bare string never reaches this function. Restating the tolerance here would be a
 * second opinion about a shape K2 owns.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string|number} cid
 * @returns {string}
 */
export function readMagicRegime(worldState, cid) {
  const normalized = text(asRecord(readMagicRegimeRecord(worldState, cid)).regime);
  return MAGIC_REGIME_LADDER.includes(normalized) ? normalized : BASE_MAGIC_REGIME;
}

/**
 * THE CAP BAND (§6: "share CAP-BANDED"). Total over the ladder; an absent or unknown
 * regime answers exactly 0, so the channel is closed by default at every seam.
 * @param {string|null|undefined} regime
 * @returns {number}
 */
export function substitutionCapFor(regime) {
  const table = /** @type {Record<string, number>} */ (MAGIC_SUBSTITUTION_TUNING.CAP_BY_REGIME);
  const key = text(regime);
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : 0;
}

/**
 * The banded word for a dependency share. Total: a share below the lowest floor is
 * `none`, because a settlement that gets a rounding error's worth of bread from a
 * hedge wizard is not dependent on him.
 * @param {number} share
 * @returns {string}
 */
export function magicDependencyBand(share) {
  const value = num(share, 0);
  if (!(value > 0)) return 'none';
  const floors = /** @type {ReadonlyArray<{ atLeast: number, band: string }>} */ (
    MAGIC_SUBSTITUTION_TUNING.DEPENDENCY_FLOOR);
  for (const rung of floors) {
    if (value >= rung.atLeast) return rung.band;
  }
  return 'none';
}

/**
 * The rung weight of one institution, or 0 when it is not a magic institution at all.
 *
 * THE MAGIC PREDICATE IS THE ESTATE'S EXISTING SPELLING, not a new one: category
 * 'Magic' OR an 'arcane' tag, which is exactly historyGenerator.js's read. Converging
 * on it means a renamed catalog entry moves both readers together instead of leaving
 * this one quietly counting a building nobody else thinks is magical.
 *
 * @param {{ name?: unknown, category?: unknown, tags?: unknown }|null|undefined} inst
 * @returns {number}
 */
export function practitionerRungWeight(inst) {
  const record = asRecord(inst);
  const tags = Array.isArray(record.tags) ? record.tags.map(text) : [];
  const isMagic = text(record.category) === 'magic' || tags.includes('arcane');
  if (!isMagic) return 0;
  const name = text(record.name);
  for (const rung of PRACTITIONER_RUNGS) {
    if (name.includes(rung.needle)) return rung.weight;
  }
  // A magic institution the rung table does not recognise still has someone in it.
  // Answering 0 would let a renamed or custom magical house carry a settlement's
  // food invisibly; the floor is the practitioner rung, which is the smallest thing
  // the forms ladder admits.
  return 0.2;
}

/**
 * PRACTITIONER CAPACITY (§6: the channel "costs practitioner capacity").
 *
 * Sums the rung weights of the LIVE magic institutions, each scaled by the K1
 * capacity the status system grades it at, and clamps to 0..1. Three properties are
 * deliberate and each is pinned:
 *
 *   THE ROSTER READ GOES THROUGH `liveInstitutions`, the estate's one ruin filter, so
 *   a flattened tower cannot feed anybody. This is a REGISTRATION with the reason
 *   stated, not a widening: a ruined or economically closed magical house has no
 *   practitioners at their benches, and §3c puts ruin outside the status vocabulary
 *   entirely.
 *
 *   AN IMPAIRED HOUSE COUNTS AT ITS IMPAIRED CAPACITY, because K1's capacity01 is
 *   precisely "how much of this institution is working". That is the two-timescale
 *   law arriving at the dinner table: the fast layer moves the food number this tick.
 *
 *   A SHELL COUNTS ZERO, because deriveInstitutionStatus grades a shell's capacity at
 *   exactly 0. An unfunded guild is dark, and §6's channel is what it can no longer do.
 *
 * @param {{ institutions?: unknown }|null|undefined} settlement
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string|number} cid
 * @returns {{ capacity01: number, sources: ReadonlyArray<string> }}
 */
export function practitionerCapacity(settlement, worldState, cid) {
  /** @type {Array<string>} */
  const sources = [];
  let total = 0;
  for (const inst of liveInstitutions(settlement)) {
    const weight = practitionerRungWeight(inst);
    if (weight <= 0) continue;
    const ref = institutionStatusRef(inst);
    const verdict = deriveInstitutionStatus({
      institution: inst,
      record: readInstitutionStatusRecord(worldState, cid, ref),
    });
    // A null verdict is a RUIN, which liveInstitutions should already have removed;
    // treating it as zero rather than as full capacity keeps the two filters agreeing
    // even if one of them is later loosened.
    const capacity01 = verdict ? clamp01(num(verdict.capacity01, 0)) : 0;
    if (capacity01 <= 0) continue;
    total += weight * capacity01;
    sources.push(ref);
  }
  return { capacity01: round4(clamp01(total)), sources: Object.freeze(sources.sort()) };
}

/**
 * DERIVE THE SUBSTITUTION CHANNEL for one settlement (§6, the whole slice).
 *
 * Returns null — not a zeroed record — when the channel does not exist: a dark world,
 * an unknown or low regime, no live practitioner, or no reagent supply. Null is what
 * lets the conditional worldState key drop when empty (§10) and what makes the
 * dormancy claim provable by object identity at the call site rather than by a deep
 * comparison of two records that both happen to say zero.
 *
 * `reagentSupply01` is supplied by the caller rather than read here, because the
 * reagent verdict is the sibling leaf's business and threading it in keeps this file
 * free of the flow ledger. It defaults to 1 so a direct unit caller can exercise the
 * regime and roster halves in isolation.
 *
 * @param {{
 *   settlement: Record<string, unknown>|null|undefined,
 *   worldState: Record<string, unknown>|null|undefined,
 *   cid: string|number,
 *   reagentSupply01?: number,
 * }} input
 * @returns {MagicSubstitution|null}
 */
export function deriveMagicSubstitution(input) {
  const worldState = input.worldState || {};
  if (!magicSubstitutionActive(worldState)) return null;
  const settlement = input.settlement || {};
  const cid = String(input.cid);

  const regime = readMagicRegime(worldState, cid);
  const capShare = substitutionCapFor(regime);
  // The base and funded rungs cap at exactly zero, so this one test closes the
  // channel for every settlement the design says has no channel.
  if (capShare <= 0) return null;

  const { capacity01, sources } = practitionerCapacity(settlement, worldState, cid);
  if (capacity01 <= 0) return null;

  const reagentSupply01 = clamp01(num(input.reagentSupply01, 1));
  if (reagentSupply01 <= 0) return null;

  // MULTIPLICATIVE against the cap, so the band is a true ceiling (see the tuning
  // note). The min() is belt and braces: with both factors in 0..1 the product can
  // never exceed capShare, and the pin asserts that rather than trusting it.
  const share = round4(Math.min(capShare, capShare * capacity01 * reagentSupply01));
  if (share <= 0) return null;

  const draw = Math.round(share * num(MAGIC_SUBSTITUTION_TUNING.REAGENT_DRAW_PER_SHARE, 0));

  return {
    regime,
    capShare,
    share,
    pctOfNeed: round1(share * 100),
    practitionerCapacity01: capacity01,
    reagentSupply01: round4(reagentSupply01),
    reagentDraw: Math.max(0, draw),
    dependency: {
      band: magicDependencyBand(share),
      share,
      sources,
      // THE ENEMY-TARGETABLE CLAUSE, made mechanical. What an attacker takes away to
      // end this dependency is exactly two things: the houses carrying it, and the
      // material they eat. Both are named in vocabularies the rest of the estate
      // already speaks, so a siege planner, an interdiction read and a Herald beat
      // are looking at one list rather than three.
      targets: Object.freeze([...sources]),
    },
  };
}

/**
 * THE CHANNEL, COMPOSED INTO THE FOOD MODEL (§6: "AS A CHANNEL in the existing
 * foodBalance/supply architecture").
 *
 * One expression, in `advanceFoodStockpile`'s own idiom and its own clamp band: the
 * substituted percentage is SUBTRACTED from the effective deficit exactly the way
 * `seasonalBoostPct` already is. Wiring it is therefore one term in one sum, and a
 * dark world passes `null` and gets its input back unchanged, to the digit.
 *
 * THE CONSERVATION LAW LIVES HERE (§6: "remove the magic source and the deficit
 * honestly reappears"). Because the base deficit is never mutated and the channel is
 * a term rather than a rewrite, `substitutedDeficitPct(base, null)` is `base` for
 * every base. That identity is what the conservation pin executes: it removes the
 * magic source, re-derives, and asserts the original number came back. Substitution
 * shifts WHAT moves, never whether things move.
 *
 * @param {number} baseDeficitPct  the effective deficit before this channel
 * @param {MagicSubstitution|null|undefined} substitution
 * @returns {number}
 */
export function substitutedDeficitPct(baseDeficitPct, substitution) {
  const base = num(baseDeficitPct, 0);
  const relief = substitution ? num(substitution.pctOfNeed, 0) : 0;
  const T = MAGIC_SUBSTITUTION_TUNING;
  return round1(clamp(
    Math.max(0, base - relief),
    num(T.DEFICIT_FLOOR_PCT, 0),
    num(T.DEFICIT_CEILING_PCT, 95),
  ));
}

/**
 * THE SUPPLY HALF (§6: magic substitutes "for food AND supply"). The same capped
 * share, applied to the settlement's import dependency rather than to its food
 * deficit: a guild that conjures a fraction of the city's bread conjures the same
 * fraction of its bulk supply, because it is the same practitioners spending the
 * same reagents. Returning the RELIEVED dependency rather than a second share keeps
 * the one-gate law: there is one number, read twice.
 *
 * @param {{ economicState?: { foodSecurity?: unknown, [key: string]: unknown }|null, foodSecurity?: unknown }|null|undefined} settlement
 * @param {MagicSubstitution|null|undefined} substitution
 * @returns {number} the import dependency that survives the channel, 0..1
 */
export function substitutedImportDependency(settlement, substitution) {
  const dependency = clamp01(num(foodLedger(settlement).importDependency, 0));
  if (!substitution) return round4(dependency);
  return round4(clamp01(dependency * (1 - clamp01(num(substitution.share, 0)))));
}

/**
 * THE DEPENDENCY SENTENCE (§6: Herald-narratable, "the city eats from the Guild's
 * hand"; §8 wants it address-chained and in-world). Returns null at band `none`, so a
 * settlement with a rounding error's worth of magical bread mints no beat.
 *
 * The sentence names the SHARE and the CURE in the same breath, because the
 * legibility law's test is that a regular human reads one sentence and knows both
 * what is true and what would change it.
 *
 * @param {{ name?: unknown }|null|undefined} settlement
 * @param {MagicSubstitution|null|undefined} substitution
 * @returns {string|null}
 */
export function magicDependencySentence(settlement, substitution) {
  if (!substitution || substitution.dependency.band === 'none') return null;
  const name = String(asRecord(settlement).name || 'The settlement');
  const pct = Math.round(num(substitution.share, 0) * 100);
  const band = substitution.dependency.band;
  const gravity = band === 'severe'
    ? 'eats from the arcane houses hand'
    : band === 'marked'
      ? 'leans on the arcane houses for its table'
      : 'takes a little of its bread from the arcane houses';
  return `${name} ${gravity}: about ${pct} percent of what it eats each day is conjured, and it lasts exactly as long as the reagents keep arriving.`;
}
