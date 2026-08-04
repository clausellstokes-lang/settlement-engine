/**
 * domain/worldPulse/treatyEnforcement.js — THE TERMS THAT BITE (the peace engine's
 * enforcement reads, extracted as a DEPENDENCY-FREE leaf).
 *
 * DESIGN_PEACE_ENGINE.md §11 declares six term executors. Three of them —
 * readiness_cap (demilitarization), war_block (non_aggression) and occupation_hold
 * (occupation_continuation) — are pure READS over the treaties ledger that the
 * war-layer consumers must consult. Those reads used to live in peaceTerms.js, where
 * NOTHING could reach them: peaceTerms imports warReasons' gate, warReasons reaches
 * mobilization through corruptionWeb/settlementPolitics, so every would-be consumer
 * sat on the wrong side of an import cycle and the executors stayed dead letters
 * (declared, tested against themselves, consumed by no engine code).
 *
 * This module is the cure, and it is the SAME cure sacredClaim.js applied to
 * faithProximityOf: the read moves to a leaf that imports ONLY the ledger accessor
 * and the kernel clamp, so warReasons / mobilization / occupation can each consult it
 * without closing a cycle back through the peace engine. peaceTerms.js re-exports the
 * three historic names, so its own import path and its battery are untouched.
 *
 * ONE READER, MANY CONSUMERS — the reason a fork here would be dangerous is that a
 * treaty's expiry must lift EVERY effect on the same tick. A second spelling of
 * "is this term still live" would eventually disagree with this one, and a term whose
 * cap outlived its war-block is a peace nobody can reason about.
 *
 * PURE + DETERMINISTIC: no rng, no wall clock, no mutation, no iteration-order
 * dependence (every read is a min / boolean / codepoint-sorted walk). DARK ⇒ every
 * reader returns its identity (null cap · false block · false hold · zero draw), so a
 * world with no treaties ledger is byte-identical to the pre-wire engine.
 */

import { getSpatialLedger } from '../spatial/distanceRead.js';
import { clamp01 } from '../../kernel/math.js';
import { CURRENT_TREATY_TICKS_PER_YEAR, treatyTicksPerYearOf } from './treatyClock.js';
// WHO BEARS THE TERM (chair ruling CR-WR10-G). The two enforcement reads below used to
// spell `String(t?.loserId || '')` and mean "the party this term binds" — true while
// every treaty ended a war, and silently false the moment WR-10's market mints one with
// a seller and a buyer instead. The orientation leaf is zero-import, so consulting it
// keeps this module's own dependency-free property intact.
import { treatyOrientationOf } from './treatyOrientation.js';

export const TREATY_ENFORCEMENT_TUNING = Object.freeze({
  /** Installments a newly minted stream term pays per nominal year. The value is
   *  owned by the zero-graph treaty clock leaf so duration and enforcement cannot
   *  silently diverge while peaceTerms continues to import this module. */
  INSTALLMENTS_PER_YEAR: CURRENT_TREATY_TICKS_PER_YEAR,
});

/** @typedef {Record<string, unknown>} TreatyRecord */
/** @typedef {Record<string, TreatyRecord>} TreatyLedger */
/** @typedef {import('./peaceTerms.js').TermRecord} TermRecord */

/**
 * The treaties ledger, or null when dark/absent. The single entry point — every
 * reader below goes through it, so a dark world short-circuits exactly once.
 * @param {Record<string, unknown> | null | undefined} worldState @returns {TreatyLedger | null}
 */
export function treatyLedgerOf(worldState) {
  return /** @type {TreatyLedger | null} */ (getSpatialLedger(worldState, 'treaties')) || null;
}

/** The treaty's terms that have NOT yet expired at `tick`. A term at/past its
 *  expiresTick is spent history and enforces nothing (§12.5 — the effect lifts with
 *  the term, on the same tick, for every consumer).
 *  @param {TreatyRecord | null | undefined} treaty @param {number} tick @returns {TermRecord[]} */
function liveTermsOf(treaty, tick) {
  const terms = /** @type {TermRecord[]} */ (Array.isArray(treaty?.terms) ? treaty.terms : []);
  return terms.filter((t) => Number(tick) < Number(t?.expiresTick));
}

/**
 * The DEMILITARIZATION CEILING on a settlement's war footing (0..1), or null when no
 * live term binds it. Consumed by mobilization.evaluateMobilization, which refuses to
 * ramp the posture above the rung the ceiling permits.
 *
 * POLARITY (this is the bug the extraction fixed): a term's `magnitude` is its
 * SEVERITY everywhere in the catalog — tribute 0.25 means a quarter of the income,
 * resource_share 0.5 means half the export. The old reader returned that severity
 * AS the ceiling, which inverted the term: a crushing demilitarization (magnitude
 * ~1.0) read as ceiling 1.0 = no constraint at all, while a token one (magnitude
 * ~0.17) read as a near-total disarmament. And "lowest cap wins" then let the
 * MILDEST treaty bind hardest. The ceiling is the severity's COMPLEMENT, and the
 * lowest (tightest) ceiling across live treaties wins, so the harshest term governs.
 * The old pin passed only because it used magnitude 0.5, where 1 − m == m.
 *
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} settlementId
 * @param {number} tick @returns {number | null}
 */
export function demilitarizationCapFor(worldState, settlementId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return null;
  const id = String(settlementId);
  /** @type {number | null} */
  let cap = null;
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    // THE OBLIGOR, not the loser (CR-WR10-G). On a war settlement they are the same
    // party; on a sale the obligor is the BUYER, because the buyer is the one who
    // promised something. An unresolved orientation yields '' and binds nobody.
    if (treatyOrientationOf(t).obligorId !== id) continue;
    for (const term of liveTermsOf(t, tick)) {
      if (term.type !== 'demilitarization') continue;
      const ceiling = clamp01(1 - clamp01(Number(term.magnitude) || 0));
      cap = cap == null ? ceiling : Math.min(cap, ceiling);
    }
  }
  return cap;
}

/**
 * Does a live non-aggression pact BLOCK war between two parties? Consumed by
 * warReasons.warReasonFactor, which zeroes the war lane's deploy weight for the pair.
 * A DEFAULTED treaty no longer blocks (§12.4 — the war-block lifts on repudiation,
 * and the same default mints the treaty_default casus in the same module).
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} aId @param {unknown} bId
 * @param {number} tick @returns {boolean}
 */
export function treatyBlocksWar(worldState, aId, bId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return false;
  const a = String(aId); const b = String(bId);
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(a) || !parties.includes(b)) continue;
    if (String(t?.complianceState || '') === 'defaulted') continue; // repudiated ⇒ block lifts
    if (liveTermsOf(t, tick).some((term) => term.type === 'non_aggression')) return true;
  }
  return false;
}

/**
 * Does a live occupation_continuation term give `occupierId` a TREATY RIGHT to keep
 * holding `occupiedId`? Consumed by occupation.evaluateOccupations: the ceded garrison
 * stands in for physical presence and the occupation cannot collapse while the term
 * runs. Directional on purpose — the term is the VICTOR's right over the LOSER, so a
 * treaty pointing the other way grants nothing.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} occupiedId @param {unknown} occupierId @param {number} tick @returns {boolean}
 */
export function occupationHoldFor(worldState, occupiedId, occupierId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return false;
  const occupied = String(occupiedId); const occupier = String(occupierId);
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    // Directional through the ONE orientation reader (CR-WR10-G): the right runs from
    // the OBLIGOR (wartime loser · sale buyer) to the OBLIGEE, so a treaty pointing the
    // other way still grants nothing and an unresolved one grants nothing at all.
    const orientation = treatyOrientationOf(t);
    if (orientation.obligorId !== occupied || orientation.obligeeId !== occupier) continue;
    if (liveTermsOf(t, tick).some((term) => term.type === 'occupation_continuation')) return true;
  }
  return false;
}

/**
 * The fraction of the payer's SPAREABLE stock ONE installment of a stream term draws
 * this tick. A term's magnitude is its NOMINAL YEARLY share (§11's vocabulary: "25% of
 * the treasury"), so an installment is that share divided across the year's ticks,
 * scaled by what the payer can actually deliver (§12 — a strained loser under-delivers
 * and that under-delivery IS the compliance signal the victor may or may not detect).
 * Pure; 0 whenever there is nothing to draw, which keeps a zero-capacity payer's
 * granary byte-identical.
 * Omitted `treaty` means a newly minted/current-clock calculation. Supplying a
 * treaty resolves its persisted clock marker; an unmarked raw treaty therefore
 * retains the legacy twelve-tick installment schedule.
 * @param {{ magnitude?: unknown } | null | undefined} term @param {number} trueDelivery01
 * @param {TreatyRecord | null | undefined} [treaty]
 * @returns {number}
 */
export function streamInstallmentFraction(term, trueDelivery01, treaty) {
  const magnitude = clamp01(Number(term?.magnitude) || 0);
  const delivery = clamp01(Number(trueDelivery01) || 0);
  if (magnitude <= 0 || delivery <= 0) return 0;
  const installmentsPerYear = treaty && typeof treaty === 'object'
    ? treatyTicksPerYearOf(treaty)
    : TREATY_ENFORCEMENT_TUNING.INSTALLMENTS_PER_YEAR;
  return (magnitude * delivery) / installmentsPerYear;
}
