/**
 * treatySuccession.js — GR-4a: THE SUCCESSION QUESTION, DERIVED (pure; writes nothing).
 *
 * A medieval treaty was a PERSONAL oath between princes, which is why every royal
 * death reopened every question. GR-1 landed the identity — `treaty.sworn` records
 * WHOSE oath it was — and left it dark: `swornPartiesOf` has been a writer without a
 * reader ever since. This leaf is its first production consumer, and it asks the one
 * question the stamp exists for: when the hand that swore is gone, does the new seat
 * own the word it never gave?
 *
 * ── WHAT THIS FILE IS AND IS NOT ────────────────────────────────────────────────
 *
 * PURE. It reads two ledgers and returns DESCRIPTORS. It never writes a ledger, never
 * touches `worldState`, never mutates an argument, and takes no clock and no draw.
 * The application — the one act that reaches the treaty ledger — stays inside
 * `treatyBreach.js#repudiateTreaty`, which is the treaty family's already-declared
 * rewriter. That split is not tidiness: `ledgerOwnershipManifest.js` pins the
 * treaties writers by `module#symbol` SET EQUALITY, discovered from executable syntax
 * by the enclosing named function, so a second function anywhere that reached the
 * ledger would red the certification pin whether or not it were exported.
 *
 * ⛔ AND FOR THE SAME REASON THIS FILE MUST NEVER NAME THAT WRITE, EVEN IN PROSE.
 * `tests/lint/oathStampTotality.walker.test.js` scans src/ with a regex that matches
 * inside COMMENTS — its own control proves it — and convicts any module that appears
 * to write the treaty ledger without a declared mint-door or rewriter row. The rule
 * for this file is therefore absolute: no comment, docblock or string here may spell
 * the ledger-write call against the treaties key. Reword the comment; never widen the
 * walker.
 *
 * ── THE TRIGGER, AND EXACTLY HOW WIDE IT IS ─────────────────────────────────────
 *
 * The question opens on a `seatTransitions` row and on nothing else. That surface has
 * exactly TWO producers — the applied `government_change` fold and the organic ladder
 * succession — and the trigger is deliberately no wider than what they record. A coup
 * VERDICT, a conquest, a DM `CHANGE_RULING_POWER`, an H2 verdict removal, DM
 * KILL/ASSIGN and an underworld faction capture all change or vacate a seat and write
 * NO row, so none of them opens a question here. That gap is NAMED rather than
 * silently closed: widening it would need succession records minted at six new sites,
 * which is a different and larger wave nobody has chartered, and building consumers
 * ahead of a producer is the exact mistake that cost this estate the ES-7 volume.
 *
 * THREE CAUSE VOCABULARIES EXIST IN THIS ESTATE AND NONE IS A REGISTRY. A row can
 * carry `government_change` from the applied fold, or `coup` | `challenge` |
 * `succession` | `vacancy` from the ladder, and `RULING_POWER_CAUSES` is a third list
 * that never reaches this field at all. The grading below is therefore authored
 * against exactly those five literals AND CARRIES A DEFAULT ARM, so an unknown cause
 * is answered rather than crashed or silently treated as the gravest case.
 *
 * ── THE ANSWER ──────────────────────────────────────────────────────────────────
 *
 * HONOR is the scored default, and it writes NOTHING AT ALL — no key, no receipt, no
 * ending, not an empty marker. A world where every heir keeps the word is byte-
 * identical to a world where the question was never asked. That is GR-4's central
 * guarantee, and it is held by SCORING rather than by machinery: there is no "honored"
 * branch to write, so there is nothing to leak.
 *
 * DISAVOW is reachable only past a band, and its severity is banded STRICTLY BELOW
 * 1.0 — the DM's open repudiation keeps `defaultSeverity01: 1` to itself, because
 * tearing up a predecessor's oath is not the same public act as tearing up your own.
 *
 * @enforced-by tests/domain/successionQuestion.test.js,
 *   tests/property/oathHolderDormancyFence.test.js
 */
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { swornPartiesOf } from './oathHolder.js';
import { isRepudiationBreach } from './treatyBreachTypes.js';

/** @typedef {Record<string, unknown>} Mut */
/**
 * @typedef {Object} SuccessionQuestion
 * @property {string} treatyKey the treaty-ledger key the question is about
 * @property {string} settlementId the court whose seat changed
 * @property {string} otherId the counterparty on that instrument
 * @property {string} npcId the FALLEN holder named on the parchment
 * @property {string} cause the `seatTransitions` cause literal, verbatim
 * @property {'lineal'|'coup_born'} kind the succession kind the cause resolves to
 * @property {'honor'|'disavow'} answer
 * @property {number} severity01 the graded breach weight, strictly below 1
 * @property {number} pressure01 the instrument's measured weight, versus the band
 */

/**
 * ⚠ UNSOAKED — rides the endgame tuning signature. Module-local and frozen, on the
 * `pactFormation.js` `F` idiom and the `ACTOR_MAJOR_HOLD_WEEKS` owner-decision-default
 * precedent. EXACTLY THREE VALUES, and there may not be a fourth: adding one is a
 * tuning act, and tuning is owner-signed. No key here is duplicated into
 * `simulationRules` or into any shared tuning table.
 */
const SUCCESSION_TUNING = Object.freeze({
  /** The band. An instrument lighter than this on the court is simply honored. */
  DISAVOW_ABOVE: 0.5,
  /** A seat that SEIZED its authority pays least — the world already knows the line broke. */
  COUP_BORN_SEVERITY: 0.35,
  /** A lineal heir pays most: he inherited the crown AND the word, and kept only one. */
  LINEAL_SEVERITY: 0.75,
});

/**
 * The causes that carry a seat's legitimacy FORWARD. Everything else — a seizure, a
 * contested climb, an imposed change of government, and any unknown string — is
 * coup-born and takes the lighter grade through the default arm below.
 * @type {readonly string[]}
 */
const LINEAL_CAUSES = Object.freeze(['succession', 'vacancy']);

/** @param {unknown} value @returns {Mut} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Mut} */ (value) : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/** @param {unknown} value @returns {number|null} */
function finiteNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** A term still binding at `tick` — the same reading `treatyBreach.js` uses.
 * @param {Mut} term @param {number} tick @returns {boolean} */
function isLiveTerm(term, tick) {
  const expires = finiteNumber(term.expiresTick);
  return expires != null && tick < expires;
}

/** @param {unknown} treaty @returns {Mut[]} */
function termsOf(treaty) {
  const terms = recordOf(treaty).terms;
  return Array.isArray(terms) ? terms.map(recordOf) : [];
}

/**
 * THE SECOND ELIGIBILITY PREDICATE (J-GR-16's gate separation).
 *
 * ⭐ IT IS DELIBERATELY NOT `isRepudiableTreaty`. The DM's open-repudiation verb
 * requires a live `non_aggression` term, which makes a tribute-only instrument
 * structurally unreachable through it. The succession question has no such
 * requirement: an heir can perfectly well refuse to keep paying a tribute his father
 * promised, and that is precisely the case that proves the two gates are separate.
 * The DM verb's predicate and its composer surface are BYTE-IDENTICAL after GR-4a.
 *
 * @param {unknown} treaty
 * @param {string} settlementId the court whose seat changed
 * @param {string} fallenNpcId the holder named on the parchment who no longer sits
 * @param {number} tick
 * @returns {boolean}
 */
export function isSuccessionDisavowable(treaty, settlementId, fallenNpcId, tick) {
  const record = recordOf(treaty);
  const sid = text(settlementId);
  const fallen = text(fallenNpcId);
  if (!sid || !fallen) return false;
  // Already answered, by this road or by the DM's. Mirrors isRepudiableTreaty's own
  // second guard, and it is what makes a repeated pass over one tick a no-op.
  if (isRepudiationBreach(record)) return false;
  if (String(record.complianceState || '') === 'defaulted') return false;
  if (!termsOf(record).some((term) => isLiveTerm(term, tick))) return false;
  // The stamp is HISTORY and is read as history: `swornPartiesOf` never re-resolves
  // against the living roster, so a signatory who has died still signed. An unstamped
  // or legacy treaty reads back EMPTY and opens no question — which is the whole
  // reason no backfill is owed and none may ever be written.
  return swornPartiesOf(record).some(
    (stamp) => stamp.settlementId === sid && stamp.npcId === fallen,
  );
}

/**
 * THE ANSWER, SCORED. Pure arithmetic over already-resolved facts.
 *
 * THE BAND IS THE INSTRUMENT'S OWN MEASURED WEIGHT, and that is a deliberate choice
 * over the alternatives. A pact that costs the court nothing is not worth the shame
 * of tearing up, however the seat changed hands; a heavy one is. `burden01` is
 * already written per term by the treaty mover's compliance walk, so this reads a
 * fact the engine measured rather than inventing a second appraisal — and because the
 * pass runs at the head of the treaty stage, the weight it reads is the one last tick
 * actually charged, which is the weight the new seat inherited.
 *
 * THE GRADE IS THE SUCCESSION KIND, and it runs the other way from intuition on
 * purpose: a coup-born seat pays LEAST because the world already watched the line
 * break, while a lineal heir pays MOST because he took the crown on the strength of
 * the continuity he is now denying.
 *
 * @param {{ cause?: unknown, pressure01?: unknown }} input
 * @returns {{ answer: 'honor'|'disavow', severity01: number, kind: 'lineal'|'coup_born' }}
 */
export function successionAnswerFor(input) {
  const cause = text(recordOf(input).cause);
  const kind = LINEAL_CAUSES.includes(cause) ? 'lineal' : 'coup_born';
  const severity01 = kind === 'lineal'
    ? SUCCESSION_TUNING.LINEAL_SEVERITY
    : SUCCESSION_TUNING.COUP_BORN_SEVERITY;
  const pressure01 = finiteNumber(recordOf(input).pressure01) ?? 0;
  const answer = pressure01 > SUCCESSION_TUNING.DISAVOW_ABOVE ? 'disavow' : 'honor';
  return { answer, severity01, kind };
}

/**
 * The heaviest weight this instrument still lays on anyone, at `tick`. Spent terms
 * carry no weight and are not counted; a treaty whose burden was never measured
 * reads 0 and is honored, which is the correct answer for an instrument nobody has
 * yet been asked to pay.
 * @param {unknown} treaty @param {number} tick @returns {number}
 */
function instrumentPressure01(treaty, tick) {
  let worst = 0;
  for (const term of termsOf(treaty)) {
    if (!isLiveTerm(term, tick)) continue;
    const burden = finiteNumber(term.burden01);
    if (burden != null && burden > worst) worst = burden;
  }
  return worst;
}

/** @param {unknown} treaty @param {string} settlementId @returns {string} */
function counterpartyOf(treaty, settlementId) {
  const parties = recordOf(treaty).parties;
  const ids = (Array.isArray(parties) ? parties : []).map(text).filter(Boolean);
  return ids.find((id) => id !== settlementId) || '';
}

/**
 * THE ROWS THIS TICK REALLY CHANGED A SEAT ON, in the order the ladder stores them.
 *
 * ⚠ THE ROWS ARE READ AT `tick` AND ONLY AT `tick`, and that is the whole idempotency
 * story: the question is answered AT the event, so a later pass over a later tick
 * finds no row and asks nothing. Nothing is ever left "open", which is also why GR-4a
 * mints no open-question state and no dossier line saying one exists.
 *
 * ⚠ IMPORTED ARRAY ORDER IS NOT CHRONOLOGY — the ladder's own normalizer sorts by
 * tick then codepoint(id) and the stored rows already carry that order, so the sort
 * here restates the stored contract rather than trusting the array it arrived in.
 * @param {unknown} worldState @param {number} tick
 * @returns {Array<{ settlementId: string, fallenNpcId: string, cause: string }>}
 */
function fallenHoldersAt(worldState, tick) {
  const ladder = recordOf(getSpatialLedger(recordOf(worldState), 'npcLadder'));
  /** @type {Array<{ settlementId: string, fallenNpcId: string, cause: string, id: string }>} */
  const out = [];
  for (const settlementId of Object.keys(ladder).sort(codepoint)) {
    const rows = recordOf(ladder[settlementId]).seatTransitions;
    for (const raw of Array.isArray(rows) ? rows.map(recordOf) : []) {
      if (finiteNumber(raw.tick) !== tick) continue;
      const fallenNpcId = text(raw.fromRulerId);
      const cause = text(raw.cause);
      if (!fallenNpcId || !cause) continue;    // a row with no prior seat opens no question
      out.push({ settlementId, fallenNpcId, cause, id: text(raw.id) });
    }
  }
  return out
    .sort((a, b) => codepoint(a.settlementId, b.settlementId) || codepoint(a.id, b.id))
    .map(({ settlementId, fallenNpcId, cause }) => ({ settlementId, fallenNpcId, cause }));
}

/**
 * EVERY SUCCESSION QUESTION THIS TICK OPENS, ANSWERED. Frozen, stably ordered, and
 * total: an absent ladder, an absent treaty ledger, a malformed row and a legacy
 * unstamped treaty all yield an empty list rather than an exception.
 *
 * BOTH answers are returned, not only the disavowals. A caller that acted on a
 * filtered list could never tell "the question was asked and honored" from "the
 * question was never asked", and those are exactly the two worlds the silence-honors
 * pin has to keep apart.
 *
 * @param {unknown} worldState
 * @param {unknown} tick
 * @returns {ReadonlyArray<SuccessionQuestion>}
 */
export function successionQuestionsForTick(worldState, tick) {
  const nowTick = finiteNumber(tick);
  /** @type {SuccessionQuestion[]} */
  const out = [];
  if (nowTick == null) return Object.freeze(out);
  const fallen = fallenHoldersAt(worldState, nowTick);
  if (!fallen.length) return Object.freeze(out);
  const ledger = recordOf(getSpatialLedger(recordOf(worldState), 'treaties'));
  // The ledger's own key order, restated: a treaty ledger is persisted sorted, and an
  // unsorted map iteration may never reach an output this engine acts on.
  const treatyKeys = Object.keys(ledger).sort(codepoint);
  for (const { settlementId, fallenNpcId, cause } of fallen) {
    for (const treatyKey of treatyKeys) {
      const treaty = recordOf(ledger[treatyKey]);
      if (!isSuccessionDisavowable(treaty, settlementId, fallenNpcId, nowTick)) continue;
      const otherId = counterpartyOf(treaty, settlementId);
      if (!otherId) continue;                  // a party this pass cannot name, it cannot answer
      const pressure01 = instrumentPressure01(treaty, nowTick);
      const { answer, severity01, kind } = successionAnswerFor({ cause, pressure01 });
      out.push({
        treatyKey, settlementId, otherId, npcId: fallenNpcId,
        cause, kind, answer, severity01, pressure01,
      });
    }
  }
  return Object.freeze(out);
}
