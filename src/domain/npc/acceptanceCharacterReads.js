/**
 * domain/npc/acceptanceCharacterReads.js — THE ACCEPTANCE SEAM'S CHARACTER HALF.
 *
 * docs/DESIGN_W_OPS.md §1 (the `cast → accepted | refused` step and the four reads it
 * makes) and §8b's fold, which outranks it; docs/DESIGN_W_LIVES.md §13 R6/R8 and §15.
 * The substrate coupling's own leaf: the first tree on which W-LIVES' producers and
 * W-OPS' grammar have ever stood together.
 *
 * ── ⛔ WHAT THIS IS, STATED AS A BOUNDARY BECAUSE THE BOUNDARY IS THE DESIGN ──────────
 * W-OPS car O2 built the acceptance DECISION — pricing an operation against a register,
 * freezing that register at rooting, the refusal receipt — and built it over INJECTED
 * values, recording in its own ledger that it imports no producer and that the SUPPLIER
 * of those values was owed. THIS LEAF IS THAT SUPPLIER AND NOTHING ELSE. It decides no
 * acceptance, prices no risk, and refuses nobody. It reads a soul and hands the reading
 * on in the shape the decision consumes.
 *
 * Keeping the two apart is not tidiness. A supplier that also decided would be a second
 * home for a law O2 already owns, and the estate has spent whole cars killing exactly
 * that shape.
 *
 * ── ⛔⛔ EVERY READ GOES THROUGH THE CHOKEPOINT. THIS IS FORCED, NOT PREFERRED ────────
 * `characterDrift.js` is pinned by its own suite to exactly ONE production door
 * (`characterConsumers.js`), and `knownCharacter.js` is pinned to ZERO src importers.
 * Those are car L4's and car L5's deliberate darknesses, and they are the reason this
 * leaf imports ONE module. The effective chart is reached only as `riskRegister` and
 * `vettingTemperBand` already reach it; the KNOWN chart is not fetched at all.
 *
 * ⭐ THE KNOWN CHART ARRIVES AS AN ARGUMENT, and that is §14 GAP D honoured rather than
 * quoted: a biography is a QUERY over the receipts that name a person, so the caller
 * runs the query and hands the answer in. A version of this leaf that went looking would
 * need somewhere to look, and somewhere to look is the store the design forbids. The
 * caller derives it through `knownCharacter.characterAsSeenBy({ viewer: 'mortal' })` —
 * a court is a MORTAL consumer (§12 R2), which is what makes a well-run treachery read
 * `dutiful` here.
 *
 * ⭐ AND THE ⟨F8⟩ VETTING VERDICT IS NEVER RECOMPUTED. `vetVolunteerEnvoy` is the
 * estate's ONE vetting reader and ODQ §806 ⟨F8⟩ rules that neither program forks a
 * second. So this leaf composes that reader's INPUT ROW and stops. What the seat decides
 * on the row remains the seat's, in the one home that already decides it.
 *
 * ── ⛔ THE R6 COERCION CURE HAS MOVED TO THE PRODUCER, AND THIS LEAF'S COPY IS RETIRED ─
 * `riskRegister` used to test presence with `Number.isFinite(Number(x))`, and
 * `Number(null)` and `Number('')` are both `0` and both finite — so a caller handing
 * `null` for a term it does not hold was recorded as having SUPPLIED ZERO. The numeric
 * outcome coincides in both readings, so the collapse was invisible in `center` and
 * `breadth` and showed ONLY in `absent[]`.
 *
 * This leaf carried the cure at the CONSUMER, because at the time the register was
 * another car's home and this lane would not edit it to fix its own call. The substrate
 * coupling owns both, so the guard now lives in the register itself, where every caller
 * gets it instead of only the callers that remembered. What was here was a second
 * spelling of one guard — the fork J-WR-10 forbids — and, once the producer is right, a
 * branch no input can distinguish: the estate's own law is to RETIRE a redundant
 * guarantee rather than pin it. The suite asserts the composition and names whose guard
 * it is asserting.
 *
 * ── DARK: NO PRODUCTION CALLER, NO FLAG, NO NEW STATE ────────────────────────────────
 * Nothing under `src/` imports this leaf and its suite asserts the empty importer set.
 * No flag is minted here and none is read: lighting the acceptance road is the door
 * car's act, and this leaf is one of the things it will find already built.
 *
 * PURE: no Date, no Math.random, no store, no I/O, no mutation, no world read. Every
 * input arrives as an argument and every output is frozen.
 *
 * @see docs/DESIGN_W_OPS.md §1, §8b (F4)
 * @see docs/DESIGN_W_LIVES.md §13 (R6, R8), §14 (GAP D), §15
 * @enforced-by tests/domain/npc/acceptanceCharacterReads.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { RISK_TERMS, riskRegister, vettingTemperBand } from './characterConsumers.js';

/**
 * THE TERMS AN ACCEPTANCE READ CAN BE MISSING, named on the read's own face — the SP-C
 * idiom, and the reason a caller can tell "this man is ordinary" from "nobody looked".
 *
 * `knownChart` is this leaf's own; the two risk terms are the register's and are
 * DERIVED from `RISK_TERMS` rather than transcribed beside it, so a term added upstream
 * arrives here instead of falling silently out of the vocabulary.
 * @type {readonly string[]}
 */
export const ACCEPTANCE_READ_TERMS = Object.freeze(
  ['knownChart', ...RISK_TERMS].sort(compareCodepoint),
);

/**
 * @typedef {Object} AcceptanceCharacterRead
 * @property {{center: number, breadth: number, absent: readonly string[]}} register
 *           R6's reading, produced by the chokepoint's own function
 * @property {string|null} temperBand
 *           the ⟨F8⟩ band a seat reads, or `null` when no KNOWN chart was supplied
 * @property {readonly string[]} absent
 *           every term this reading did not have, codepoint-ordered — the register's own
 *           `absent[]` UNIONED with this leaf's, so one list answers the whole question
 */

/**
 * ⭐ THE ACCEPTANCE READ — the four §1 seams, as far as a character reader may take them.
 *
 * THREE DECISION ARMS, and each one exists to keep an ABSENCE from reading as a VALUE:
 *
 *   1. a desperation that is not a number is ABSENT, never a supplied zero (finding O2-D
 *      — the guard is the REGISTER'S since the substrate coupling; this leaf passes the
 *      caller's value through unchanged and its suite proves the absence still lands)
 *   2. a disorder that is not a number is ABSENT, never a supplied zero (same finding)
 *   3. NO KNOWN CHART GIVES `temperBand: null`, NOT `'ordinary'`.
 *
 * ⚠⚠ ARM 3 IS THE ONE THAT WOULD HAVE BEEN EASY TO GET WRONG, and it is R7's
 * `claim: false` law in a second place: `vettingTemperBand` answers `'ordinary'` for an
 * absent chart, because the middle band is the honest reading of a chart that says
 * nothing. But "an ordinary man" and "nobody looked at this man" are different facts
 * about a court, and a supplier that flattened them would hand the ⟨F8⟩ reader a
 * positive finding it never made. The band is therefore only ever quoted when a chart
 * was actually supplied.
 *
 * @param {Object} args
 * @param {unknown} args.npc
 * @param {import('./characterConsumers.js').CharacterLens|null} [args.lens]
 * @param {unknown} [args.knownChart]     a `characterAsSeenBy({ viewer: 'mortal' })` result
 * @param {unknown} [args.desperation01]  0..1; anything not a finite number is ABSENT
 * @param {unknown} [args.disorder01]     0..1; anything not a finite number is ABSENT
 * @returns {AcceptanceCharacterRead}
 */
export function acceptanceCharacterRead({ npc, lens, knownChart, desperation01, disorder01 }) {
  // ⭐ THE TERMS GO THROUGH UNTOUCHED. The register itself now tests the TYPE, so
  // normalizing here would be a second spelling of its guard — and one that hides
  // whether the guard downstream still works.
  const register = riskRegister({ npc, lens, desperation01, disorder01 });
  const hasChart = knownChart !== null && typeof knownChart === 'object';
  const absent = [...register.absent];
  if (!hasChart) absent.push('knownChart');
  return Object.freeze({
    register,
    temperBand: hasChart ? vettingTemperBand(knownChart) : null,
    absent: Object.freeze(absent.sort(compareCodepoint)),
  });
}

/**
 * ⭐ THE ⟨F8⟩ INPUT ROW — the volunteer a seat vets, carrying the character term that
 * reader has been waiting for.
 *
 * `vetVolunteerEnvoy`'s own header records that its `temper` arm "cannot fire, which is
 * every caller today", because no caller in the estate held a KNOWN chart to band. This
 * function is the caller that can, and it still does not vet anybody: it fills one field
 * and hands the row back to the one reader that decides.
 *
 * ⛔ THE CALLER'S OWN ROW, BY REFERENCE, when no chart was supplied — L5's
 * `effectiveDescriptors` idiom exactly. A seat that holds no chart gets back the object
 * it passed in, so it cannot compute anything different from what it computed before
 * this leaf existed. That reference identity IS the byte-identity proof, structurally,
 * rather than a claim a test has to keep re-asserting.
 *
 * ⚠ AND A ROW THAT ALREADY CARRIES A BAND IS NOT OVERWRITTEN. A caller that banded the
 * man itself has made a judgement, and silently replacing it would make this leaf the
 * decider it is written not to be.
 *
 * @param {Object} args
 * @param {unknown} args.volunteer      the row `vetVolunteerEnvoy` takes
 * @param {unknown} [args.knownChart]   a `characterAsSeenBy({ viewer: 'mortal' })` result
 * @returns {unknown} the caller's own row, or a copy carrying `temperBand`
 */
export function vettingInputFor({ volunteer, knownChart }) {
  if (!volunteer || typeof volunteer !== 'object' || Array.isArray(volunteer)) return volunteer;
  if (knownChart === null || typeof knownChart !== 'object') return volunteer;
  const row = /** @type {Record<string, unknown>} */ (volunteer);
  if (typeof row.temperBand === 'string' && row.temperBand !== '') return volunteer;
  return { ...row, temperBand: vettingTemperBand(knownChart) };
}

/**
 * Provenance, in the module, the L1 catalog's idiom.
 * @type {Readonly<{status: string, signedBy: string|null, consumes: readonly string[], ownerRows: readonly string[]}>}
 */
export const ACCEPTANCE_READ_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (this leaf authors no magnitude; every number it returns is the register\'s)',
  signedBy: null,
  consumes: Object.freeze([
    'characterConsumers.riskRegister — §13 R6/R8, the personal register, DERIVED never stored',
    'characterConsumers.vettingTemperBand — the ⟨F8⟩ band, over a KNOWN chart the caller supplies',
    'sendTwoDivergence.vetVolunteerEnvoy — CONSUMED as the one vetting home; this leaf composes its input and never its verdict',
  ]),
  ownerRows: Object.freeze([
    'whether a court that holds NO known chart should vet as though the man were ordinary, or refuse to let character speak at all. This leaf takes the second reading — an absence is not a finding — and the first is one field away',
    'the §802 R1 willingness door is NOT wired here and its symbol is deliberately unnamed in this file: it has landed nowhere in the estate, and naming it would trip the producer census that is holding its place',
  ]),
});
