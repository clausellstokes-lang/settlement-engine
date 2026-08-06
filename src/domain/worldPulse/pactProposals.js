/**
 * pactProposals.js — GR-2. THE ONE WRITER of `worldState.spatialLedgers.pactProposals`.
 *
 * An offer stands before a court, and an answer is owed by a date the roads decided. This
 * leaf owns that row from the moment it opens to the moment it prunes: it is the only
 * module in the estate that may create, amend or delete one, and every consumer reads
 * through `pactProposalsOf` rather than reaching into the container.
 *
 * ── A QUEUE, NOT AN ARCHIVE (§4, J-GR-8) ────────────────────────────────────────
 * Open proposals are RE-DERIVABLE INTENTIONS, not precious state. Regeneration re-scores
 * the triggers and re-opens whatever the new world still wants; signed history lives in
 * treaties and the chronicle, which regen preserves under their own laws. So a settled row
 * PRUNES once its receipt has landed, and a world that has never opened one carries NO
 * `pactProposals` key at all — `dropSpatialLedger` takes the whole namespace with it when
 * it was the last sub-ledger, which is what keeps a dark campaign byte-identical to a
 * campaign that simply never had an occasion.
 *
 * ── THE DWELL IS PHYSICS, AND ITS BANDS ARE STATED AGAINST A MEASURED SPECTRUM ──
 * `answerDueTick` is not a constant. It is two legs of `hopWeeks` — out and back — plus a
 * deliberation, so a far court answers slowly BY PHYSICS and law M's one-week-per-leg floor
 * binds a pact exactly as it binds an embassy.
 *
 * ⚠ THE CALIBRATED-WEEKS HAZARD, ANSWERED WITH NUMBERS. `hopWeeks` is CALIBRATED PER
 * DIGEST: a whole realm spans roughly 2..8 march weeks (and the read's own ceiling is
 * MAX_HOP_WEEKS = 52), so ANY band at or above 9 weeks would refuse nothing anywhere in a
 * normal campaign and would be dead the day it was authored. The dwell this file computes
 * therefore lands in 6..18 ticks across that measured 2..8-week spectrum — 2·2+2 at the
 * near end, 2·8+2 at the far end — every value distinct, every value inside the year, and
 * no threshold above the spectrum's own ceiling. An UNMEASURABLE pair (aspatial world,
 * unmapped id, no route) falls to the floor dwell and the row says `measured: false`
 * through its receipt rather than pretending a road was walked.
 *
 * ── THE TRANSPORT IS A FIELD ON THE RECORD, BECAUSE RECEIPTS ARE BUILT FROM IT ──
 * Dark spine ⇒ `abstract`: the answer simply arrives, on the clock the geometry set. Lit
 * spine (SP-D's `errandSpineEnabled`) ⇒ `envoy`: the same clock, now carried by a named
 * person on a `diplomatic` errand, with everything WR-7b–d implies about interception and
 * testimony. The mode rides the ROW rather than being re-derived at each read, because
 * every formation receipt has to be able to say how the word travelled, and a receipt that
 * recomputed it would disagree with the row the day the flag moved mid-campaign.
 *
 * ── K3 (NOBODY IS EVER CURRENT) ─────────────────────────────────────────────────
 * This module is in the negotiation set and its import list is pinned there. Its whole
 * reach is the constitutional spatial accessors, the errand mint head, the pure trigger
 * leaf and the id primitive. Not one of them can hand back a settlement's real strength,
 * stock or pressure — the beliefs a proposal is built from are read by the STAGE and
 * arrive here as words.
 *
 * ⚠ Every number in `PACT_PROPOSAL_TUNING` is UNSOAKED — §7 owns them, the owner signs
 * them at the soak redo under THE PROMISE.
 *
 * @enforced-by tests/domain/pactProposals.test.js,
 *   tests/domain/envoyK3BeliefSeam.test.js,
 *   tests/property/pactFormationDormancyFence.test.js
 */
import { dropSpatialLedger, getSpatialLedger, hopWeeks, setSpatialLedger } from '../spatial/distanceRead.js';
import { mintErrandSpine } from './errandMint.js';
import { PACT_TRIGGERS } from './pactTriggers.js';
import { stablePart } from './stablePart.js';

/** The ledger's key under `worldState.spatialLedgers`. ONE new top-level key in the whole
 *  GRAMMAR program, and this is it (§4 L4). */
export const PACT_PROPOSAL_LEDGER_KEY = 'pactProposals';

/** The closed state vocabulary, codepoint-frozen. @type {readonly string[]} */
export const PACT_PROPOSAL_STATES = Object.freeze(['expired', 'open', 'refused', 'signed']);

/** The closed transport vocabulary (§3's cross-program disclosure). @type {readonly string[]} */
export const PACT_TRANSPORTS = Object.freeze(['abstract', 'envoy']);

/**
 * THE TYPED REFUSAL CODES. These are the verb's `coversVetoCodes` and the writer's own
 * refusal words, and they are ONE list deliberately: a DM-opened proposal and an
 * engine-opened one are refused by the same predicate for the same reason in the same
 * words, which is what the DM-parity pin asserts.
 * @type {readonly string[]}
 */
export const PACT_PROPOSAL_REFUSALS = Object.freeze([
  'invalid_term_sheet', 'no_cap_headroom', 'open_proposal_exists',
]);

/** ⚠ UNSOAKED — §7 owns these. */
export const PACT_PROPOSAL_TUNING = Object.freeze({
  /** How many proposals one court may have standing at once. The spam bound, and it is a
   *  bound on the PROPOSER: a court that floods the map runs out of envoys, not of
   *  neighbours. */
  MAX_OPEN_PROPOSALS: 2,
  /** Law M's floor, restated as this lane's own minimum leg. One week per leg, so no pair
   *  answers instantly however close the two courts sit. */
  DWELL_LEG_FLOOR_WEEKS: 1,
  /** The court's own deliberation, on top of the road. A pact is read before it is
   *  answered. */
  DELIBERATION_WEEKS: 2,
});

const T = PACT_PROPOSAL_TUNING;

/**
 * ⚠ THE ONE BY-NAME GATE READ of `pactFormationEnabled` IN THE WHOLE TREE, AND IT LIVES
 * HERE ON PURPOSE. The flag governs a LEDGER, and this module is that ledger's only writer,
 * so a gate standing at this door is a gate nothing can write past — the same reason SP-D
 * put `errandSpineActive` at the errand mint head rather than in a file named for the flag.
 *
 * The key is VIRTUAL under the CQ5 law (FP §3, CR-WR10-C): absent from
 * DEFAULT_SIMULATION_RULES and from every preset spread, so a campaign that never lights it
 * pays ZERO persisted bytes; read strictly with `=== true`, so ABSENT and FALSE are
 * identical at the decision site; manifested in `ENGINE_GATED_VIRTUAL_RULE_KEYS` with its
 * AUTHORED certification row in the SAME COMMIT as this, its first real gate read.
 *
 * ONCE and BY NAME, both deliberate: by NAME because a frozen-list `.every()` conjunction is
 * a computed member access that attributes to no key and would hide a fully wired flag from
 * the engine-gated-key census; ONCE because two doors on one flag is how a deleted guard
 * hides behind a surviving one.
 *
 * @param {unknown} worldState @returns {boolean}
 */
export function pactFormationActive(worldState) {
  const rules = recordOf(recordOf(worldState).simulationRules);
  return rules.pactFormationEnabled === true;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value) : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/**
 * THE READER. Every consumer comes through here — the writer/reader spelling pin boots the
 * REAL writer and reads back through this function, so a payload the writer stopped
 * emitting cannot pass as present.
 * @param {Record<string, unknown>} worldState
 * @returns {Array<Record<string, unknown>>} codepoint-ordered by id; [] when absent
 */
export function pactProposalsOf(worldState) {
  const rows = getSpatialLedger(worldState, PACT_PROPOSAL_LEDGER_KEY);
  return Array.isArray(rows) ? /** @type {Array<Record<string, unknown>>} */ (rows) : [];
}

/**
 * THE WRITER. Rows land codepoint-ordered by id so serialization is canonical, and an
 * EMPTY set drops the key entirely rather than persisting `[]` — a distinction that is the
 * difference between a dormant world and a world that answered everything.
 * @param {Record<string, unknown>} worldState
 * @param {ReadonlyArray<Record<string, unknown>>} rows
 * @returns {Record<string, unknown>}
 */
export function writePactProposals(worldState, rows) {
  const sorted = [...rows].sort((a, b) => (String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0));
  return sorted.length
    ? setSpatialLedger(worldState, PACT_PROPOSAL_LEDGER_KEY, sorted)
    : dropSpatialLedger(worldState, PACT_PROPOSAL_LEDGER_KEY);
}

/**
 * IMPORT VALIDATION (§4 migrate/import). A row whose trigger, state or transport is
 * outside its closed vocabulary is DROPPED rather than repaired — an invented word is
 * worse than a missing intention, and the intention re-derives from the triggers anyway.
 * @param {unknown} raw @returns {Record<string, unknown>|null}
 */
export function normalizePactProposal(raw) {
  const row = recordOf(raw);
  const id = text(row.id);
  const from = text(row.from);
  const to = text(row.to);
  const trigger = text(row.trigger);
  const state = text(row.state);
  const transport = text(row.transport);
  const openedTick = wholeTick(row.openedTick);
  const answerDueTick = wholeTick(row.answerDueTick);
  const terms = Array.isArray(recordOf(row.sheet).terms) ? recordOf(row.sheet).terms : null;
  if (!id || !from || !to || from === to || !terms
    || !PACT_TRIGGERS.includes(trigger)
    || !PACT_PROPOSAL_STATES.includes(state)
    || !PACT_TRANSPORTS.includes(transport)
    || openedTick == null || answerDueTick == null || answerDueTick < openedTick) return null;
  return {
    id, from, to, trigger, sheet: { terms: /** @type {unknown[]} */ (terms) },
    openedTick, answerDueTick, state, transport,
  };
}

/**
 * THE DWELL, FROM THE ROADS. Two legs and a deliberation. `measured` is false exactly when
 * the geometry could not price the pair, and the caller's receipt says so — the band is
 * never quietly a constant.
 * @param {{digest?: unknown, fromId: string, toId: string, season?: unknown, tick: number}} input
 * @returns {Readonly<{answerDueTick: number, weeks: number, measured: boolean}>}
 */
export function answerDueTickFor({ digest, fromId, toId, season = null, tick }) {
  const legs = digest
    ? hopWeeks(/** @type {never} */ (digest), fromId, toId, season == null ? null : String(season))
    : null;
  const measured = Number.isFinite(legs) && Number(legs) > 0;
  const weeks = measured ? Math.max(T.DWELL_LEG_FLOOR_WEEKS, Number(legs)) : T.DWELL_LEG_FLOOR_WEEKS;
  return Object.freeze({
    answerDueTick: Math.round(tick) + 2 * weeks + T.DELIBERATION_WEEKS,
    weeks,
    measured,
  });
}

/**
 * WHO CARRIES THE WORD. Lit spine ⇒ a named person on a `diplomatic` errand, priced
 * through the family's ONE transit seam so a pact proposal and a peace embassy cannot be
 * made to travel at different speeds. Dark spine ⇒ `abstract`, and the mint head IGNORES
 * the class cargo entirely rather than refusing it (SP-D's dormancy arm), which is why the
 * transport falls back rather than the proposal failing.
 *
 * The plan is ONE outbound leg on the dwell the geometry already priced. It is handed to
 * `mintErrandSpine` as an INJECTED PLAN — this leaf validates nothing about speed and owns
 * no clock fraction, exactly as the movement-site manifest requires.
 *
 * ⚠ IT READS THE MINT'S `reason`, NEVER THE FIELD BLOCK. `purposeClass` is a
 * DROP-WHEN-DERIVABLE field — absent on every row whose class its purpose already implies —
 * so a direct read returns `undefined` exactly where it matters, and SP-D's one-reader law
 * (`tests/lint/errandConsumerRegistry.walker.test.js`) forbids reaching for it outside the
 * errand family. The mint already answers the only question this leaf has, in one closed
 * word: `spine` when the spine really ran, `dark` when it did not.
 *
 * @param {{worldState: Record<string, unknown>, fromId: string, toId: string, tick: number,
 *   arrivalTick: number}} input
 * @returns {string} a PACT_TRANSPORTS member
 */
export function pactTransportFor({ worldState, fromId, toId, tick, arrivalTick }) {
  const depart = Math.round(tick);
  const arrive = Math.max(depart + 1, Math.round(arrivalTick));
  const minted = mintErrandSpine({
    worldState,
    purpose: 'pact_proposal',
    purposeClass: 'diplomatic',
    fromId,
    toId,
    journey: 'outbound',
    routePlan: {
      legs: [{ fromId, toId, departTick: depart, arrivalTick: arrive, journey: 'outbound' }],
      expectedReturnTick: arrive,
    },
  });
  return minted.ok && minted.reason === 'spine' ? 'envoy' : 'abstract';
}

/** Every OPEN row this court has standing. @param {ReadonlyArray<Record<string, unknown>>} rows
 *  @param {string} from @returns {Array<Record<string, unknown>>} */
export function openProposalsFrom(rows, from) {
  return rows.filter((row) => row.state === 'open' && String(row.from) === from);
}

/** The OPEN row standing between this pair in EITHER direction, or null. A pair already in
 *  correspondence does not open a second conversation.
 *  @param {ReadonlyArray<Record<string, unknown>>} rows @param {string} a @param {string} b
 *  @returns {Record<string, unknown>|null} */
export function openProposalBetween(rows, a, b) {
  return rows.find((row) => row.state === 'open'
    && ((String(row.from) === a && String(row.to) === b)
      || (String(row.from) === b && String(row.to) === a))) || null;
}

/**
 * OPEN ONE PROPOSAL — the ONE creation path, shared by the trigger crossing and by the
 * `PROPOSE_PACT` verb handler, which is what makes DM parity a fact rather than a promise.
 *
 * A STANDING INSTRUMENT IS NOT A BLOCKER (§1c R1): formation AMENDS. The three refusals are
 * the cap, an open conversation on this pair, and a sheet that drafts nothing.
 *
 * @param {{worldState: Record<string, unknown>, from: string, to: string, trigger: string,
 *   sheet?: unknown, tick: number, digest?: unknown, season?: unknown}} input
 * @returns {{worldState: Record<string, unknown>, proposal: Record<string, unknown>|null,
 *   refusal: string, receipt: string}}
 */
export function openPactProposal({ worldState, from, to, trigger, sheet, tick, digest, season }) {
  const rows = pactProposalsOf(worldState);
  const terms = Array.isArray(recordOf(sheet).terms) ? recordOf(sheet).terms : [];
  if (!from || !to || from === to || !PACT_TRIGGERS.includes(trigger) || terms.length === 0) {
    return {
      worldState, proposal: null, refusal: 'invalid_term_sheet',
      receipt: 'There was nothing here that could be written into an instrument.',
    };
  }
  if (openProposalBetween(rows, from, to)) {
    return {
      worldState, proposal: null, refusal: 'open_proposal_exists',
      receipt: 'These courts already have a question standing between them.',
    };
  }
  if (openProposalsFrom(rows, from).length >= T.MAX_OPEN_PROPOSALS) {
    return {
      worldState, proposal: null, refusal: 'no_cap_headroom',
      receipt: 'This court already has as many offers abroad as it can answer for.',
    };
  }
  const due = answerDueTickFor({ digest, fromId: from, toId: to, season, tick });
  const transport = pactTransportFor({
    worldState, fromId: from, toId: to, tick, arrivalTick: tick + due.weeks,
  });
  /** @type {Record<string, unknown>} */
  const proposal = {
    id: `pact.${Math.round(tick)}.${stablePart(from)}.${stablePart(to)}.${stablePart(trigger)}`,
    from,
    to,
    trigger,
    sheet: { terms },
    openedTick: Math.round(tick),
    answerDueTick: due.answerDueTick,
    state: 'open',
    transport,
  };
  return {
    worldState: writePactProposals(worldState, [...rows, proposal]),
    proposal,
    refusal: '',
    receipt: due.measured
      ? `An answer is owed in ${due.answerDueTick - Math.round(tick)} weeks — ${due.weeks} on the road each way.`
      : 'An answer is owed, though no road between these courts could be measured.',
  };
}

/**
 * SETTLE ONE PROPOSAL. The state moves once and only forward: an `open` row becomes
 * `signed`, `refused` or `expired`, and a row that is already settled is left exactly as it
 * is rather than re-settled into a second receipt.
 * @param {{worldState: Record<string, unknown>, id: string, state: string}} input
 * @returns {{worldState: Record<string, unknown>, proposal: Record<string, unknown>|null}}
 */
export function settlePactProposal({ worldState, id, state }) {
  const rows = pactProposalsOf(worldState);
  const target = rows.find((row) => String(row.id) === id && row.state === 'open');
  if (!target || !PACT_PROPOSAL_STATES.includes(state) || state === 'open') {
    return { worldState, proposal: null };
  }
  const settled = { ...target, state };
  return {
    worldState: writePactProposals(worldState, rows.map((row) => (row === target ? settled : row))),
    proposal: settled,
  };
}

/**
 * PRUNE THE SETTLED. A queue, not an archive — a row whose receipt has landed is gone, and
 * with the last row goes the key. Returns the SAME reference when nothing was settled, so
 * a tick that answered nothing perturbs no byte.
 * @param {{worldState: Record<string, unknown>}} input @returns {Record<string, unknown>}
 */
export function prunePactProposals({ worldState }) {
  const rows = pactProposalsOf(worldState);
  const open = rows.filter((row) => row.state === 'open');
  return open.length === rows.length ? worldState : writePactProposals(worldState, open);
}
