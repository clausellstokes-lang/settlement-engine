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

// ── GR-3: THE SEVENTH EXECUTOR KIND — `grant`, A STANDING RIGHT ─────────────────────
//
// The six executors above are things a term DOES TO a party. `grant` is the other half
// of the vocabulary: a right one party HOLDS while the term lives — to preach, to walk a
// pilgrim road, to send people across, to be answered when it is struck. Every one of
// them consolidates HERE for the reason this whole module exists (its header's one-reader
// law): a right must lift on the SAME TICK the term expires, and a second spelling of
// "is this right still live" would eventually disagree with this one.
//
// WHO HOLDS THE RIGHT. A NEGOTIATED term carries `beneficiary` — the party it runs to, or
// the literal `'both'` for a symmetric clause — so the direction is on the record and
// needs no inference. A term carrying NONE is a war-door or sale term, and its direction
// comes from the ONE orientation reader (CR-WR10-G): the OBLIGEE holds what the OBLIGOR
// promised, which is the same axis `occupationHoldFor` already reads. Neither path ever
// splits an id or guesses from a name.
//
// A DEFAULTED *TERM* GRANTS NOTHING — AND THE UNIT IS THE TERM, NOT THE INSTRUMENT
// (chair ruling J-GR3-C1, 2026-08-06). The first spelling of this read skipped any treaty
// whose INSTRUMENT-level `complianceState` was defaulted, and that was wrong in both
// directions, each reproduced by execution before the repair:
//
//   (a) peaceTerms.js sets `treaty.complianceState = worstObserved` across ALL live terms,
//       driven by the LOSER's capacity. So a loser who stopped paying tribute silently
//       stripped the VICTOR of an honored tolerance_guarantee running the other way — a
//       breach by one party voiding the NON-BREACHING party's rights. Election to void
//       belongs to the injured party, never to the mechanism. GR-2 widened §13 stacking to
//       family × beneficiary, so mixed instruments are the NORMAL case: this fired on the
//       common path, not an edge.
//   (b) the mirror: a term whose OWN state was defaulted still read as HELD whenever the
//       instrument around it was honored.
//
// So the compliance question is asked of the TERM, and it is asked at the two public doors
// rather than in the finder — because the finder must still be able to SEE a broken right.
// That is what keeps NEVER-GRANTED distinguishable from GRANTED-THEN-VOIDED: absence
// answers `''`, a voided right answers `'defaulted'`, and collapsing the two would be the
// exact absence-into-denial failure this wave's DARK/ABSENT/NONSENSE pin forbids.
//
// It is the OBSERVED state deliberately — the fog governs rights exactly as it governs
// war-blocks, so a right quietly throttled by a party its counterpart cannot watch is
// still legally standing, which is the peacetime face of §12.2. `grantedRightStateFor`
// is how a consumer tells "lawful and kept" from "lawful and fraying" without this
// module ever handing out truth the observer has not earned.
//
// DARK ⇒ every read below returns its identity (false · '') because a world with no
// treaties ledger short-circuits at `treatyLedgerOf`, and no engine path can mint one of
// these terms with `pactFormationEnabled` dark — the peacetime draft lens is the only
// producer and it never runs. Byte-identical, by the same mechanism `non_intervention`
// has always been byte-identical.

/**
 * The live term of `type` on the pair's instrument that runs TO `granteeId`, or null.
 *
 * ⚠ FINDS A TERM WHATEVER ITS COMPLIANCE — including a defaulted one. That is deliberate
 * and is what lets the two public doors above disagree usefully: `grantedRightFor` asks
 * whether the right is HELD (a defaulted term is not), while `grantedRightStateFor` asks
 * what CONDITION it is in and must be able to answer `'defaulted'` rather than falling
 * back to the never-granted `''`. Filtering here would collapse absence into denial.
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} type
 * @param {unknown} grantorId @param {unknown} granteeId @param {number} tick
 * @returns {TermRecord | null}
 */
function grantTermFor(worldState, type, grantorId, granteeId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return null;
  const grantor = String(grantorId);
  const grantee = String(granteeId);
  const wanted = String(type);
  if (!grantor || !grantee || grantor === grantee || !wanted) return null;
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(grantor) || !parties.includes(grantee)) continue;
    for (const term of liveTermsOf(t, tick)) {
      if (term.type !== wanted) continue;
      const beneficiary = String(term.beneficiary || '');
      if (beneficiary === 'both' || beneficiary === grantee) return term;
      // A term with no beneficiary is war-door/sale provenance: the OBLIGEE holds it.
      if (!beneficiary && treatyOrientationOf(t).obligeeId === grantee) return term;
    }
  }
  return null;
}

/**
 * DOES `granteeId` HOLD A LIVE `type` RIGHT GRANTED BY `grantorId`? The generic read every
 * named right below is a pointer to. False whenever the ledger, the pair, the term or the
 * direction does not resolve — an unresolved anything grants nobody anything.
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} type
 * @param {unknown} grantorId @param {unknown} granteeId @param {number} tick @returns {boolean}
 */
export function grantedRightFor(worldState, type, grantorId, granteeId, tick) {
  const term = grantTermFor(worldState, type, grantorId, granteeId, tick);
  // THE COMPLIANCE DOOR, asked of the TERM (J-GR3-C1). A right observed to be broken is
  // not held; a right on an instrument some OTHER clause broke is untouched.
  return term !== null && String(term.complianceState || '') !== 'defaulted';
}

/**
 * THE OBSERVED CONDITION of a standing right — `'honored'` / `'strained'` / `'defaulted'`,
 * or `''` when no such right stands. This is what "honored on parchment and harassed on
 * the road" reads as: the right is live (so `grantedRightFor` is true) while its observed
 * state has slipped. It reports the OBSERVED word only; `trueState` is the fog's business
 * and never leaves the ledger through this door.
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} type
 * @param {unknown} grantorId @param {unknown} granteeId @param {number} tick @returns {string}
 */
export function grantedRightStateFor(worldState, type, grantorId, granteeId, tick) {
  const term = grantTermFor(worldState, type, grantorId, granteeId, tick);
  return term ? String(term.complianceState || 'honored') : '';
}

/** May `granteeId` lawfully preach in `grantorId`'s lands? (FAITH WF-6 consumes.)
 *  @param {Record<string, unknown> | null | undefined} w @param {unknown} grantorId
 *  @param {unknown} granteeId @param {number} tick @returns {boolean} */
export function missionaryAccessFor(w, grantorId, granteeId, tick) {
  return grantedRightFor(w, 'missionary_access', grantorId, granteeId, tick);
}

/** Do these two courts keep a signed communion? Symmetric — a `shared_rite` is drafted
 *  to both parties, so either direction answers the same.
 *  @param {Record<string, unknown> | null | undefined} w @param {unknown} aId
 *  @param {unknown} bId @param {number} tick @returns {boolean} */
export function sharedRiteFor(w, aId, bId, tick) {
  return grantedRightFor(w, 'shared_rite', aId, bId, tick);
}

/** May `granteeId`'s pilgrims lawfully travel `grantorId`'s roads?
 *  @param {Record<string, unknown> | null | undefined} w @param {unknown} grantorId
 *  @param {unknown} granteeId @param {number} tick @returns {boolean} */
export function pilgrimageRightFor(w, grantorId, granteeId, tick) {
  return grantedRightFor(w, 'pilgrimage_right', grantorId, granteeId, tick);
}

/** Has `grantorId` forsworn suppressing `granteeId`'s creed? (WF-5b's underground
 *  surfacing arm and the eviction/purge lanes read this.)
 *  @param {Record<string, unknown> | null | undefined} w @param {unknown} grantorId
 *  @param {unknown} granteeId @param {number} tick @returns {boolean} */
export function toleranceGuaranteeFor(w, grantorId, granteeId, tick) {
  return grantedRightFor(w, 'tolerance_guarantee', grantorId, granteeId, tick);
}

/** May `granteeId`'s people lawfully cross into `grantorId`? (POP-5b's permit gate.)
 *  @param {Record<string, unknown> | null | undefined} w @param {unknown} grantorId
 *  @param {unknown} granteeId @param {number} tick @returns {boolean} */
export function migrationRightFor(w, grantorId, granteeId, tick) {
  return grantedRightFor(w, 'migration_right', grantorId, granteeId, tick);
}

/** Does a labour compact stand from `grantorId` to `granteeId`? (TRADE/POP production
 *  arms read it as a BANDED colour on output and never as a headcount.)
 *  @param {Record<string, unknown> | null | undefined} w @param {unknown} grantorId
 *  @param {unknown} granteeId @param {number} tick @returns {boolean} */
export function laborCompactFor(w, grantorId, granteeId, tick) {
  return grantedRightFor(w, 'labor_compact', grantorId, granteeId, tick);
}

/**
 * IS THERE A SWORN BOND OF MUTUAL DEFENCE BETWEEN THESE TWO? Symmetric.
 *
 * ⚠ THIS IS THE WRITER THE SURVEY LOOKED FOR AND THE CONSUMERS ARE NOT WIRED TO IT YET.
 * Five reader families treat a `defensive_pact` RELATIONSHIP edge as support — the levy
 * set (`warHomeCosts.js`), the ally-relief set (`warCapacityReads.js`),
 * `thirdPartyRansom.js`, `warAllianceRisk.js` and the certification notes — and none of
 * them consults this read. Wiring them is NOT a catalog wave's business: `computeAllyRelief`
 * takes no `tick`, so admitting a treaty-scoped right there means threading the clock
 * through war hot paths, which is a war-owned change with its own verification.
 * DEFERRED BY NAME in the GRAMMAR×WAR coupling row, and pinned as a tripwire in
 * tests/domain/peaceTermsGrantTerms.test.js so the day a reader consults this the census
 * reds and the coupling row must be discharged in that commit.
 * @param {Record<string, unknown> | null | undefined} w @param {unknown} aId
 * @param {unknown} bId @param {number} tick @returns {boolean}
 */
export function mutualDefenseFor(w, aId, bId, tick) {
  return grantedRightFor(w, 'mutual_defense', aId, bId, tick);
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
