/**
 * espionageDoctrineStage.js — ES-5: THE DOCTRINE ENGAGED. Where a court's two alignment
 * axes become words, and where the words decide whether it sends anybody.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.9 (the doctrine read), §3.12 (spy-before-decision), §1 (the
 * demand band). This is the `conquestDoctrineStage` SPLIT, taken verbatim: ES-0's
 * `readEspionageDoctrine` is a PURE leaf that takes two WORDS and returns words, and it
 * stays that way — a leaf that fetched its own axes could not have either axis mutated out.
 * Everything world-side lives here, in exactly the shape `readConquestIntentFor` already
 * gives the war lane one file over: gather, hand down, return null when dark.
 *
 * ── THE TWO NULLS ARE DIFFERENT ANSWERS AND BOTH ARE LOAD-BEARING ───────────────────────
 * DARK ⇒ `null`. There is no doctrine because there is no layer: `espionageActive` refused
 *   and nothing was read, computed or composed. This is the dormancy arm.
 * LIT BUT UNREADABLE ⇒ a doctrine object with `known: false` and a quotable receipt. The
 *   court exists, the layer is live, and the axes could not be resolved — the
 *   `judgeSovereigntySale` resolution-gate pattern, minted by the leaf and never here.
 * Collapsing the two would make a dark world and an unnameable court indistinguishable,
 * which is precisely how a dormancy fence goes green on a world that was merely broken.
 *
 * ── THE ORDER WORD IS A LOCAL TUNING OF ONE AXIS, NEVER A SECOND SPELLING OF IT ─────────
 * `lawWordFor` takes an optional frozen edge pair for exactly this case (see lawWord.js's
 * header, which names this program's use of it). So the doctrine's J-ES-10 edges
 * (0.60/0.40, vetoable) are passed as an ARGUMENT to the estate's ONE law-band function —
 * one vocabulary, one function, one local pair. The estate pair (0.67/0.33) is untouched
 * and the war lane's bands do not move. There is no fourth law-band ladder in this file and
 * §5 row 10's one-spelling scan stays green because there is nothing here to find.
 *
 * ── ⚠ WHAT THE CADENCE DECIDES, AND WHAT IT MEASURABLY CANNOT DO (R-ES1-1, RE-MEASURED) ─
 * This stage answers "does this court want to send somebody, and how sure does it need to
 * be". It does NOT mint a row, and that is a measured constraint rather than a scope
 * choice. `mintEnvoyErrand` — the errand ledger's ONE writer — refuses unless
 * `envoyDiplomacyActive` (the six war flags) AND a normalized peace OFFER and acceptance
 * are present. So a FREE-STANDING spy row still does not exist in this tree; a covert
 * mission that becomes a row rides a diplomatic errand wearing its face, and the dispatcher
 * that opens such an errand is the WAR lane's own embassy road. ES-1 recorded this as
 * R-ES1-1 and it is unchanged at this build. Wiring the cadence INTO that road is war-lane
 * surgery on a surface this wave's collision map does not name, so the cadence lands as the
 * DECISION it is, with the verdict, the bar and the receipt a caller needs — and the
 * absence of a production caller is DECLARED here rather than discovered.
 *
 * ── THE OBLIGATION ES-0 HANDED THIS FILE BY NAME, AND IT IS DISCHARGED HERE ─────────────
 * `espionageDoctrine.js`'s header says, of the §3.9 permission to quote
 * `deriveSystemVariable('law_order', s).contributors` sentences as prose: "gathering
 * worldState-side prose is the DOCTRINE STAGE's job (`espionageDoctrineStage.js`, ES-5)".
 * ES-5a neither built it nor declared it, which is the worse of the two failures available:
 * a deferral handed BY NAME and then silently skipped LOOKS DISCHARGED. `orderProseFor`
 * below is the discharge.
 *
 * ⚠ TWO HAZARDS RIDE THIS PERMISSION AND THEY ARE DIFFERENT HAZARDS.
 *
 * 1. THE PATRON DOUBLE-COUNT (§3.9's own parenthesis). The deity LAW axis feeds BOTH
 *    `computeLawfulness` — which is where this stage's `orderWord` comes from, through
 *    `settlementAlignment` — AND `deriveLawOrder`. Measured at this repair round, the two
 *    reads share the deity law axis AND the governance-legitimacy ledger. So blending
 *    `law_order`'s SCORE into the doctrine's axis would count the patron twice, invisibly on
 *    every deity-free world (where both terms are 0 and the bug is undetectable). The guard
 *    is structural rather than careful: this file reads `.contributors[].reason` and NOTHING
 *    else off that call. The score, the band and each contributor's `delta` are never
 *    touched, so there is no arithmetic here to double-count with.
 *
 * 2. THE RAW-SCORE HAZARD (L5, and this file's runtime no-decimal pin). `deriveLawOrder`
 *    interpolates raw scores into its own sentences — MEASURED at this round: "Internal-
 *    security score 74 reflects how well order is kept", "Black-market capture at 40%
 *    undermines lawful order", "The Wet Knives (power 70) rivals the law". A receipt must
 *    never speak those. The screen is a TOTAL POSITIVE PREDICATE — a sentence is quotable
 *    iff it contains no digit at all — and it therefore FAILS CLOSED: an unfamiliar sentence
 *    shape is withheld, never quoted. It is deliberately NOT a list of known-bad spellings,
 *    because a credit-side enumeration fails OPEN and this estate has the incident recorded.
 *    Measured on a settlement that lights every arm: 2 of 5 sentences are quotable; on an
 *    anarchic one, 2 of 2. The term is neither dead nor unbounded.
 *
 * The count WITHHELD travels beside the lines, so a reader of the result can always tell a
 * court whose order nobody explained from a court whose explanation was screened.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation. The one
 * stochastic choice is a keyed hash (L1 — zero new PRNG streams).
 *
 * @enforced-by tests/domain/espionageDoctrineStage.test.js,
 *   tests/property/espionageDoctrineDormancyFence.test.js
 */
import { hash01 } from '../../region/contestMath.js';
import { deriveSystemVariable } from '../../causalState.js';
import { natureWordFor } from '../conquestDoctrineStage.js';
import { settlementAlignment } from '../settlementAlignment.js';
import { espionageActive } from './espionageGate.js';
import {
  ESPIONAGE_DOCTRINE_TUNING,
  lawWordFor,
  readEspionageDoctrine,
} from './espionageDoctrine.js';
import { DEMAND_BANDS, deliberationRead } from './espionageMath.js';

/**
 * ES-5's own constants, kept out of `ESPIONAGE_TUNING` for the reason `GAUNTLET_TUNING`
 * records (that export's key set is pinned as a totality). Raw-authored proposals until the
 * owner signs them (L5, THE PROMISE).
 */
export const DISPATCH_TUNING = Object.freeze({
  /**
   * §3.12 — the demand ladder, keyed on the doctrine's own cadence weight. A PATIENT court
   * (low frequency) is the one that can afford to wait for certainty; a court that sends
   * constantly is buying corroboration, not proof. Both edges are MEASURED reachable: the
   * doctrine's frequency is `FREQ_BASE + FREQ_BY_ORDER + FREQ_BY_NATURE` over three rungs
   * each, so the nine reachable values are 0.05 0.2 0.25 0.35 0.4 0.45 0.55 0.6 0.75 —
   * four below the patient edge, two between, three at or above the hasty edge. No rung of
   * this ladder is a dead band.
   */
  DEMAND_PATIENT_MAX: 0.35,
  DEMAND_HASTY_MIN: 0.55,
});

/** The house phrase for each bar, so the receipt speaks the demand instead of printing it.
 *  @type {Readonly<Record<string, string>>} */
const DEMAND_PHRASE = Object.freeze({
  certain: 'certainty',
  confirm: 'a confirmed account',
  corroborate: 'a second voice saying the same thing',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * §3.9 — THE COURT'S ESPIONAGE DOCTRINE, gathered off the world. `null` when the layer is
 * dark; a `known:false` doctrine when the layer is live and the court is not resolvable.
 *
 * @param {{worldState?: unknown, item?: unknown, courtId?: unknown}} [args]
 * @returns {ReturnType<typeof readEspionageDoctrine>|null}
 */
export function espionageDoctrineFor({ worldState, item, courtId } = {}) {
  if (!espionageActive(worldState)) return null;
  const resolved = text(courtId) || text(recordOf(item).id);
  const alignment = settlementAlignment(
    /** @type {Parameters<typeof settlementAlignment>[0]} */ (item),
    /** @type {Parameters<typeof settlementAlignment>[1]} */ (worldState),
  );
  return readEspionageDoctrine({
    courtId: resolved,
    // ONE law-band function, the doctrine's own vetoable edges (J-ES-10) — see the header.
    orderWord: lawWordFor(alignment.lawfulness01, ESPIONAGE_DOCTRINE_TUNING.ORDER_EDGES),
    natureWord: natureWordFor(Number(alignment.malice01)),
  });
}

/**
 * §3.12 + §1 — THE BAR A DISPATCH IS SENT TO CLEAR. One bar, three consumers (this, the
 * magic early resolve, and the grade at close) and no second spelling of "how sure did we
 * need to be" — the words themselves are the errand vocabulary's, borrowed through
 * `DEMAND_BANDS` rather than re-typed, so a court cannot ask for a bar the ledger refuses.
 *
 * URGENCY LOWERS THE BAR AND IS TESTED FIRST. A court with an army at the gate does not get
 * to become more demanding about its intelligence; it gets to be satisfied sooner.
 *
 * @param {{frequency01?: unknown, urgent?: unknown}} [args]
 * @returns {'certain'|'confirm'|'corroborate'}
 */
export function dispatchDemandFor({ frequency01, urgent } = {}) {
  if (urgent === true) return 'corroborate';
  const cadence = Number(frequency01);
  if (!Number.isFinite(cadence)) return 'confirm';
  if (cadence <= DISPATCH_TUNING.DEMAND_PATIENT_MAX) return 'certain';
  if (cadence >= DISPATCH_TUNING.DEMAND_HASTY_MIN) return 'corroborate';
  return 'confirm';
}

/** THE DISPATCH DRAW'S IDENTITY — one keyed stream, spelled once (L1).
 *  @param {unknown} courtId @param {unknown} tick @returns {string} */
export function dispatchCadenceKey(courtId, tick) {
  return `es.dispatch.${text(courtId)}.${Number(tick) || 0}`;
}

/** The empty order-prose read, so every door of the cadence answers the same SHAPE. Frozen
 *  and shared: it carries no per-call state. @type {{lines: ReadonlyArray<string>,
 *  withheld: number, reason: string}} */
const NO_ORDER_PROSE = Object.freeze({ lines: Object.freeze([]), withheld: 0, reason: 'not_read' });

/**
 * §3.9 — THE ORDER PROSE, gathered world-side. The obligation `espionageDoctrine.js` hands
 * this file by name; see the header for the two hazards it rides and how each is guarded.
 *
 * ⭐ SENTENCES ONLY. `.contributors[].reason` is the ONLY field read off the causal call —
 * never `score`, never `band`, never a contributor's `delta` — so the patron double-count
 * has no arithmetic here to happen in.
 *
 * The settlement grain is resolved EXACTLY the way `computeLawfulness` resolves it
 * (`item.settlement || item`), so the prose explains the same record the doctrine's own
 * order word was banded from rather than a sibling nobody can line it up against.
 *
 * @param {{item?: unknown}} [args]
 * @returns {{lines: ReadonlyArray<string>, withheld: number, reason: string}}
 */
export function orderProseFor({ item } = {}) {
  const settlement = recordOf(item).settlement || item || {};
  const read = deriveSystemVariable(
    'law_order',
    /** @type {Parameters<typeof deriveSystemVariable>[1]} */ (settlement),
  );
  const contributors = Array.isArray(recordOf(read).contributors)
    ? /** @type {unknown[]} */ (recordOf(read).contributors)
    : [];
  /** @type {string[]} */
  const lines = [];
  let withheld = 0;
  for (const raw of contributors) {
    const sentence = text(recordOf(raw).reason);
    if (!sentence) continue;
    // THE TOTAL POSITIVE PREDICATE. Quotable iff it speaks no number at all — so an
    // unfamiliar sentence shape is WITHHELD rather than quoted. Fails closed by
    // construction; a list of known-bad spellings would fail open (the recorded class).
    if (/\d/.test(sentence)) withheld += 1;
    else lines.push(sentence);
  }
  const reason = contributors.length === 0
    ? 'no_contributors'
    : (lines.length === 0 ? 'all_withheld' : 'quoted');
  return { lines: Object.freeze(lines), withheld, reason };
}

/**
 * §3.12 — DOES THIS COURT SEND SOMEBODY THIS TICK, and what is it sending them to settle.
 *
 * FIVE DOORS, EACH ITS OWN RETURN WITH ITS OWN REASON, because a conjunction whose arms
 * cannot be dropped one at a time is a conjunction nobody has proven:
 *   1. DARK — the layer is not live, and nothing is read.
 *   2. NO READABLE DOCTRINE — a court whose axes did not resolve sends nobody, and says so
 *      in the leaf's own words rather than defaulting to a moderate temperament.
 *   3. THE DELIBERATION VERDICT — `act_now` and `wait_expired` both mean nobody goes.
 *   4. ALREADY RUNNING — a `dispatch_and_wait` court that is ALREADY waiting on a spy. That
 *      verdict is the right answer to "what do I do about the decision" and the wrong answer
 *      to "do I send another man"; without this door a patient court would send one operative
 *      per tick for the whole of its own patience window.
 *   5. THE DRAW — the doctrine's cadence weight against a keyed hash. Lawless-malicious
 *      courts send often; lawful-benevolent ones rarely.
 *
 * ── ⚠⚠ WHY DOOR 3 RUNS BEFORE DOOR 4, AND WHAT THE OTHER ORDER MEASURABLY COST ──────────
 * ES-5a shipped these two doors the other way round, and the order was not cosmetic: it made
 * one arm of a THREE-WORD closed vocabulary structurally unreachable. `deliberationRead`
 * produces `wait_expired` ONLY for a court with `dispatched === true` (espionageMath.js's
 * timeout arm), so an already-running door that answered EVERY dispatched court ahead of the
 * read consumed the entire population that arm can ever be computed for. Executed at the
 * repair round over a 4,860-cell grid (2 courts × 3 `dispatched` × 9 `ticksSinceDispatch` ×
 * 3 `urgent` × 2 `castable` × 5 confidences × 3 ticks), the shipped order returned exactly
 * two of the three verdicts — `act_now` 2,808 and `dispatch_and_wait` 2,052 — and
 * `wait_expired` ZERO times.
 *
 * ⚠ A TERM THAT CAN ONLY EVER BE UNREACHABLE IS NOT AN UNPINNED ARM, AND A GREEN BATTERY
 * CANNOT TELL THE TWO APART. Every ES-5a pin passed over the shadowed arm without a word,
 * because "no test reaches it" and "no input CAN reach it" produce the identical green. So
 * the repair is pinned by a REACHABILITY census derived from `DELIBERATION_VERDICTS` itself
 * rather than by one more example: the test walks the grid and asserts the verdict SET the
 * stage emits equals the vocabulary's own totality, which reds the day any future door order
 * swallows an arm again.
 *
 * WHAT THE REORDER DOES NOT CHANGE: nobody is dispatched in either order. A court that is
 * already out stays home whether its wait has expired or not — `dispatch: false` on both
 * paths, in both orders, at every one of the 4,860 cells. What changes is that the expired
 * court now says WHY in the deliberation's own word instead of being filed under a door that
 * describes a court still waiting.
 *
 * @param {{worldState?: unknown, item?: unknown, courtId?: unknown, tick?: unknown,
 *   castable?: unknown, decidingConfidence01?: unknown, urgent?: unknown,
 *   dispatched?: unknown, ticksSinceDispatch?: unknown}} [args]
 * @returns {{dispatch: boolean, verdict: string, demand: string, roll01: number,
 *   key: string, doctrine: Record<string, unknown>|null, receipt: string, reason: string,
 *   orderProse: ReturnType<typeof orderProseFor>}}
 */
export function dispatchCadenceFor({
  worldState, item, courtId, tick, castable, decidingConfidence01, urgent,
  dispatched, ticksSinceDispatch,
} = {}) {
  /** @param {string} reason @param {Record<string, unknown>|null} doctrine
   *  @param {string} verdict @param {string} receipt */
  const stays = (reason, doctrine, verdict, receipt) => ({
    dispatch: false, verdict, demand: '', roll01: 0, key: '', doctrine, receipt, reason,
    // ONE SHAPE ON EVERY DOOR. A refusing door that omitted the field would make a consumer
    // reach for `.orderProse.lines` on some paths and not others, which is how an optional
    // sub-record becomes an undefined read three waves later.
    orderProse: NO_ORDER_PROSE,
  });
  const doctrine = espionageDoctrineFor({ worldState, item, courtId });
  if (!doctrine) return stays('dark', null, '', '');
  const row = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (doctrine));
  if (doctrine.known !== true) return stays('no_doctrine', row, '', doctrine.receipt);
  // DOOR 3 BEFORE DOOR 4 — see the header's measured block. The deliberation read is the
  // only producer of `wait_expired`, and it can only produce it for a dispatched court, so
  // it must run ahead of the door that answers every dispatched court.
  const verdict = deliberationRead({
    decidingConfidence01, frequency01: doctrine.frequency01, urgent, castable, dispatched,
    ticksSinceDispatch,
  });
  if (verdict !== 'dispatch_and_wait') return stays(verdict, row, verdict, doctrine.receipt);
  if (dispatched === true) return stays('already_dispatched', row, verdict, doctrine.receipt);
  const resolved = text(courtId) || text(recordOf(item).id);
  const key = dispatchCadenceKey(resolved, tick);
  const roll01 = hash01(key);
  const dispatch = roll01 < Number(doctrine.frequency01);
  const demand = dispatchDemandFor({ frequency01: doctrine.frequency01, urgent });
  // §3.9's licensed prose, screened (see `orderProseFor` and the header's hazard block). It
  // is spliced between the doctrine's words and the dispatch sentence because that is where
  // it reads as a reason: the court's character, why its order stands where it does, then
  // what it is doing about this week.
  const prose = orderProseFor({ item });
  const explained = prose.lines.length ? ` ${prose.lines.join(' ')}` : '';
  return {
    dispatch,
    verdict,
    demand: dispatch ? demand : '',
    roll01,
    key,
    doctrine: row,
    orderProse: prose,
    // DOCTRINE WORDS ONLY. `frequency01` and the roll are control scalars and never enter
    // prose (L5, and the banded-runtime no-decimal pin): a reader learns the court's
    // character and what it will accept, never its coefficients. The gathered sentences are
    // held to the same law by `orderProseFor`'s digit screen, which is what lets them be
    // spliced here at all.
    receipt: dispatch
      ? `${doctrine.receipt}${explained} It sends a watcher, and will settle for nothing short of ${DEMAND_PHRASE[demand]}.`
      : `${doctrine.receipt}${explained} This week it sends nobody.`,
    reason: dispatch ? 'dispatched' : 'cadence_declined',
  };
}

/** The demand vocabulary this stage may set, re-exported as ONE totality read. Re-exporting
 *  is not minting: the `Object.freeze` behind it is the errand vocabulary's.
 *  @type {ReadonlyArray<string>} */
export const DISPATCH_DEMANDS = DEMAND_BANDS;
