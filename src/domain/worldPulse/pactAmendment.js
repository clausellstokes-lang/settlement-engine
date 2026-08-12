/**
 * pactAmendment.js — GR-2. THE STANDING INSTRUMENT, AND THE ACTS THAT CHANGE IT.
 *
 * A member of the peaceTerms WRITER FAMILY, on the `peaceTermsSale.js` pattern: it composes
 * the family's own primitives and enforcement reader directly, is NOT re-exported by
 * `peaceTerms.js` (a re-export would drag its callers into the head's 35-module import
 * cycle — the dist chunk-cycle TDZ class, see `satellitesLedger.js`'s header), and every
 * caller lives outside that cycle.
 *
 * ── ONE TREATY PER PAIR MEANS FORMATION AMENDS (§1c R1) ─────────────────────────
 * V-1 is the law the whole estate already keeps: one instrument per unordered pair. The
 * war door honours it by REFUSING and the sale door honours it by REFUSING. A peacetime
 * formation cannot refuse — two courts at peace who agree on grain do not stop agreeing
 * because they once signed about something else — so it takes the third road the law
 * leaves open and APPENDS. The instrument grows a lineage; the ledger grows nothing.
 *
 * ── THE STACKING CELL IS FAMILY × BENEFICIARY, AND THE WAR DOOR IS UNCHANGED ────
 * §13 stacking is one term per family per document. A reciprocal peacetime sheet — grain
 * one way, ore the other — is TWO economic terms, so a family-only cell would make the
 * most ordinary pact in the world unrepresentable. §4 widens the axis to family ×
 * BENEFICIARY for negotiated terms, and the widening costs the war door nothing by
 * construction: a war-end term carries no `beneficiary` key at all, so its cell is
 * `family|` exactly as before, and two war-end terms of one family still collide.
 *
 * A collision is REFUSED AND RECEIPTED (`term_refused_stacking`), never silently dropped
 * and never stacked. The peacetime and war-end paths agree on stacking because they run the
 * SAME `stackingCellOf` — one fixture drives both doors.
 *
 * ── PROVENANCE IS READ, NEVER REWRITTEN ─────────────────────────────────────────
 * `provenance` records how an instrument BEGAN. A legacy treaty carries no such key and
 * resolves to `dictated` AT READ — the `treatyTicksPerYear` discipline (V-5) verbatim —
 * and nothing in this file ever writes the resolved default back onto a record. Amending a
 * dictated instrument does not make it negotiated; the LINEAGE is what says what happened
 * to it since.
 *
 * ── T4: EVERY NEW FIELD IS CONDITIONAL AND DROP-WHEN-ABSENT ─────────────────────
 * `provenance`, `lineage` and `beneficiary` ride the `sellerId`/`buyerId`/`swapId`/`assetId`
 * precedent byte-for-byte: absent, never null. Nothing migrates, and every reader here
 * tolerates absence forever.
 *
 * PURE-ISH: no rng, no wall clock. It writes one ledger through the family's own accessor
 * and hands everything else back for its caller to fold.
 *
 * @enforced-by tests/domain/pactAmendment.test.js,
 *   tests/domain/pactFormation.test.js,
 *   tests/property/pactFormationDormancyFence.test.js
 */
import { setSpatialLedger } from '../spatial/distanceRead.js';
import { treatyPairKey } from './peaceTermsPrimitives.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { pactFormationActive } from './pactProposals.js';

/**
 * THE CLOSED LINEAGE VOCABULARY (§4, R1 law). `formed` and `amended` are this wave's;
 * `broken_by_war` is the war-overtaken closure's; `war_ended` is the war door's amendment
 * awareness. GR-5's `renewed`/`converted` join this list in their own wave.
 * @type {readonly string[]}
 */
export const PACT_LINEAGE_ACTS = Object.freeze(['amended', 'broken_by_war', 'disavowed_by_succession', 'formed', 'war_ended']);

/**
 * THE CLOSED FORMATION ENDINGS (§GR-7's vocabulary). Every member has a producer in this
 * wave and the reachability pin names which: `signed` and `no_overlap` at the answer,
 * `refused` at a court's refusal, `expired_unanswered` at the dwell's end, `broken_by_war`
 * at the closure below. GR-4a adds `disavowed_by_succession`, produced by
 * `treatyBreach.js#repudiateTreaty`'s succession road — the instrument's LINEAGE vocabulary,
 * written by the ending act, which is why it joins this list and not the disjoint
 * observation endings `treatyLifecycleVoice.js` exports under the same name.
 * @type {readonly string[]}
 */
export const PACT_ENDINGS = Object.freeze([
  'broken_by_war', 'disavowed_by_succession', 'expired_unanswered', 'no_overlap',
  'refused', 'signed',
]);

/** The closed provenance vocabulary. Legacy-absent resolves to `dictated` AT READ. */
export const PACT_PROVENANCE = Object.freeze(['converted', 'dictated', 'negotiated', 'renewed']);

/**
 * THE ONE COMPOSABLE SECURITY PAIR. Frozen, exactly two members, and the only exception
 * `amendPactInstrument` grants to §13 stacking. NEVER a general stacking rule: promising
 * not to attack and promising to fight beside are the one pair a court can hold at once,
 * and a third security clause in the same cell is refused exactly as it always was.
 * @type {readonly string[]}
 */
export const COMPOSABLE_SECURITY_PAIR = Object.freeze(['mutual_defense', 'non_aggression']);

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value) : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {Array<Record<string, unknown>>} */
function termsOf(value) {
  const terms = recordOf(value).terms;
  return Array.isArray(terms) ? /** @type {Array<Record<string, unknown>>} */ (terms) : [];
}

/**
 * THE READ that resolves the legacy default without writing it. Every consumer of
 * provenance comes through here; nothing touches the raw field.
 * @param {unknown} treaty @returns {string} a PACT_PROVENANCE member
 */
export function provenanceOf(treaty) {
  const written = text(recordOf(treaty).provenance);
  return PACT_PROVENANCE.includes(written) ? written : 'dictated';
}

/**
 * THE READ that resolves an absent lineage to the single act the record implies. A legacy
 * treaty has one act — it was made — and saying so at READ costs no byte and lets every
 * consumer treat the history as total.
 * @param {unknown} treaty @returns {Array<Record<string, unknown>>}
 */
export function lineageOf(treaty) {
  const row = recordOf(treaty);
  const written = Array.isArray(row.lineage) ? /** @type {Array<Record<string, unknown>>} */ (row.lineage) : null;
  if (written) return written;
  return [{
    act: 'formed',
    tick: Number(row.mintedTick) || 0,
    termIds: termsOf(row).map(termIdOf),
  }];
}

/**
 * A TERM'S IDENTITY, DERIVED AND NEVER STORED.
 *
 * ⚠ THE BENEFICIARY IS PART OF THE ID, AND LEAVING IT OUT WAS A MEASURED DEFECT. A
 * reciprocal sheet is TWO terms of one type minted on one tick — grain one way, ore the
 * other — so a `type.mintedTick` id gave both legs the SAME name and the lineage recorded
 * one clause twice while the instrument carried two. The id is unique by construction with
 * it: stacking forbids two live terms in one family × beneficiary cell, and type determines
 * family, so no two terms can collide on all three parts. A legacy term carries no
 * beneficiary and lands on the empty segment, exactly as its stacking cell does.
 *
 * Derived-not-restated: nothing is stored, so nothing can go stale.
 * @param {unknown} term @returns {string}
 */
export function termIdOf(term) {
  const row = recordOf(term);
  return `${text(row.type)}.${text(row.beneficiary)}.${Number(row.mintedTick) || 0}`;
}

/**
 * THE STACKING CELL — family × beneficiary, and the war door is unchanged because a
 * war-end term carries no beneficiary and lands in the bare `family|` cell it always did.
 * @param {unknown} term @returns {string}
 */
export function stackingCellOf(term) {
  const row = recordOf(term);
  return `${text(row.family)}|${text(row.beneficiary)}`;
}

/** The live set of types in one cell, minted on first ask so a caller can record into it.
 *  @param {Map<string, Set<string>>} held @param {string} cell @returns {Set<string>} */
function occupantsOf(held, cell) {
  const seen = held.get(cell) || new Set();
  held.set(cell, seen);
  return seen;
}

/**
 * THE ONE EXCEPTION §13 STACKING GRANTS — and it is a PAIR, not a family.
 *
 * An occupied cell admits the arriving term only when that term is a
 * `COMPOSABLE_SECURITY_PAIR` member AND every clause already sitting in that exact cell —
 * standing on the instrument or admitted earlier in this same call — is the OTHER member.
 * With exactly two members that single condition also forbids a duplicate of the arriving
 * term's own type, so no separate duplicate check is written: it would be an arm no input
 * could reach.
 *
 * ⚠ THE WAR DOOR COSTS NOTHING BY CONSTRUCTION. `CLASS_TERM` maps the security asset class
 * to `non_aggression` and to nothing else, so a war-end sheet can never carry the second
 * member and the bare `security|` cell can never hold a composable pair. Two war-end
 * security clauses still collide exactly as they did before this exception existed.
 *
 * @param {string} type @param {ReadonlySet<string>} occupants @returns {boolean}
 */
function composesWithOccupants(type, occupants) {
  if (!COMPOSABLE_SECURITY_PAIR.includes(type)) return false;
  const sibling = COMPOSABLE_SECURITY_PAIR.find((member) => member !== type);
  return [...occupants].every((occupant) => occupant === sibling);
}

/**
 * APPEND ONE LINEAGE ACT. Returns a NEW treaty record — this family never mutates a record
 * a caller still holds a reference to.
 * @param {Record<string, unknown>} treaty @param {{act: string, tick: number,
 *   termIds?: ReadonlyArray<string>, ending?: string}} entry
 * @returns {Record<string, unknown>}
 */
export function appendLineage(treaty, { act, tick, termIds = [], ending = '' }) {
  if (!PACT_LINEAGE_ACTS.includes(act)) return treaty;
  const entry = {
    act,
    tick: Math.round(tick),
    termIds: [...termIds].sort(),
    ...(ending && PACT_ENDINGS.includes(ending) ? { ending } : {}),
  };
  return { ...treaty, lineage: [...lineageOf(treaty), entry] };
}

/**
 * AMEND A STANDING INSTRUMENT with a negotiated sheet.
 *
 * Every proposed term is tried against the LIVE occupied cells — a term whose own
 * `expiresTick` has passed occupies nothing, so a lapsed grain clause does not block the
 * next one forever. A collision is refused with its cell named. Nothing is added and no
 * lineage act lands when EVERY term collides, so a wholly-refused amendment leaves the
 * record byte-identical.
 *
 * @param {{treaty: Record<string, unknown>, terms: ReadonlyArray<Record<string, unknown>>,
 *   tick: number, act?: string}} input
 * @returns {{treaty: Record<string, unknown>, added: Array<Record<string, unknown>>,
 *   refused: Array<{cell: string, type: string, receipt: string}>}}
 */
export function amendPactInstrument({ treaty, terms, tick, act = 'amended' }) {
  const live = termsOf(treaty).filter((term) => Number(term.expiresTick) > tick);
  // WHICH TYPES occupy each cell, not merely THAT one does: the composable exception has
  // to ask what is already there, and a bare cell set cannot answer that question.
  /** @type {Map<string, Set<string>>} */
  const held = new Map();
  for (const term of live) occupantsOf(held, stackingCellOf(term)).add(text(term.type));
  /** @type {Array<Record<string, unknown>>} */
  const added = [];
  /** @type {Array<{cell: string, type: string, receipt: string}>} */
  const refused = [];
  for (const term of terms) {
    const cell = stackingCellOf(term);
    const occupants = occupantsOf(held, cell);
    if (occupants.size > 0 && !composesWithOccupants(text(term.type), occupants)) {
      refused.push({
        cell,
        type: text(term.type),
        receipt: `term_refused_stacking: this instrument already carries a ${text(term.family)}`
          + ' clause for that party, and one document holds one of each.',
      });
      continue;
    }
    occupants.add(text(term.type));
    added.push(term);
  }
  if (added.length === 0) return { treaty, added, refused };
  const merged = [...termsOf(treaty), ...added]
    .sort((x, y) => (termIdOf(x) < termIdOf(y) ? -1 : termIdOf(x) > termIdOf(y) ? 1 : 0));
  const next = appendLineage({ ...treaty, terms: merged }, {
    act, tick, termIds: added.map(termIdOf),
  });
  return { treaty: next, added, refused };
}

/**
 * THE WAR-OVERTAKEN CLOSURE — the `broken_by_war` producer.
 *
 * A war opens between two courts whose standing instrument still carries live NEGOTIATED
 * terms. That is legal: a grain pact without a non-aggression clause does not block an
 * opener, and a block that already lifted through default leaves its siblings alive. Those
 * terms CLOSE. There is no breach shell — the war is its own public fact and the war record
 * carries that story — and the receipt names the war that ate the peace.
 *
 * WHICH TERMS ARE NEGOTIATED IS READ FROM THE LINEAGE, not guessed from the term. A
 * dictated clause on the same instrument survives the war that its own settlement created.
 *
 * @param {{worldState: Record<string, unknown>, aId: string, bId: string, tick: number}} input
 * @returns {{worldState: Record<string, unknown>, closed: ReadonlyArray<string>, receipt: string}}
 */
export function closeTermsBrokenByWar({ worldState, aId, bId, tick }) {
  const nothing = { worldState, closed: Object.freeze([]), receipt: '' };
  if (!pactFormationActive(worldState)) return nothing;
  const ledger = treatyLedgerOf(/** @type {Parameters<typeof treatyLedgerOf>[0]} */ (worldState));
  if (!ledger) return nothing;
  const key = ledger[treatyPairKey(aId, bId)] ? treatyPairKey(aId, bId)
    : ledger[treatyPairKey(bId, aId)] ? treatyPairKey(bId, aId) : '';
  if (!key) return nothing;
  const treaty = recordOf(ledger[key]);
  const negotiated = new Set(lineageOf(treaty)
    .filter((entry) => entry.act === 'formed' || entry.act === 'amended')
    .flatMap((entry) => (Array.isArray(entry.termIds) ? entry.termIds.map(String) : [])));
  const doomed = termsOf(treaty)
    .filter((term) => negotiated.has(termIdOf(term)) && Number(term.expiresTick) > tick);
  if (doomed.length === 0) return nothing;
  const closed = doomed.map(termIdOf).sort();
  const survivors = termsOf(treaty).filter((term) => !closed.includes(termIdOf(term)));
  const next = appendLineage({ ...treaty, terms: survivors }, {
    act: 'broken_by_war', tick, termIds: closed, ending: 'broken_by_war',
  });
  return {
    worldState: setSpatialLedger(worldState, 'treaties', { ...ledger, [key]: next }),
    closed,
    receipt: `The war between ${aId} and ${bId} ended what they had written down in peace.`,
  };
}

/**
 * THE WAR DOOR'S AMENDMENT AWARENESS (J-GR-14b) — the ONE seam `peaceTerms.js` gains.
 *
 * PASS 1 used to reach a pair already holding an instrument and simply `continue`, so a
 * negotiated peace between courts who had signed a grain pact VANISHED from the record: the
 * war ended, and nothing anywhere said so. Under the flag the standing instrument now
 * ABSORBS that fact as a lineage act.
 *
 * IT IS AN ACT, NOT A TERM MERGE, and the boundary is deliberate (JUDGMENT, vetoable).
 * The guard sits ABOVE the mint, so the war's drafted sheet does not exist yet at this
 * point; merging it would mean moving the guard below the mint, which is a far larger edit
 * to a file measured at 785 of its 800 effective lines with nine waves queued behind it.
 * Recording that a war ended under this instrument is what "awareness" means here; the
 * term merge is the J-GR-14 draft-lens extension and belongs to GR-3's slice of this flag.
 *
 * DARK ⇒ RETURNS FALSE BEFORE READING ANYTHING, so PASS 1's own pair-slot guard runs next
 * and the whole path is byte-identical to the day before this file existed.
 *
 * ⚠ IT ASSIGNS INTO THE CALLER'S WORKING LEDGER, which is `peaceTerms.js`'s own idiom at
 * this exact site (its mint writes `nextLedger[key] = mint.treaty` twenty lines below). The
 * treaty RECORD is replaced, never mutated.
 *
 * @param {{ledger: Record<string, unknown>, worldState: unknown, victorId: string,
 *   loserId: string, tick: number}} input
 * @returns {boolean} true ⇒ the standing instrument absorbed it and PASS 1 should move on
 */
export function absorbWarEndIntoStandingPact({ ledger, worldState, victorId, loserId, tick }) {
  if (!pactFormationActive(worldState)) return false;
  const key = ledger[treatyPairKey(victorId, loserId)] ? treatyPairKey(victorId, loserId)
    : ledger[treatyPairKey(loserId, victorId)] ? treatyPairKey(loserId, victorId) : '';
  if (!key) return false;
  ledger[key] = appendLineage(recordOf(ledger[key]), { act: 'war_ended', tick });
  return true;
}
