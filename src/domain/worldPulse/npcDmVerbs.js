/**
 * domain/worldPulse/npcDmVerbs.js — W-H4: THE THREE DM VERBS.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §7 DM VERBS, §8 HERALD SURFACES; laws 1
 * NEVER-KILL / DM-SOVEREIGN, 5 DORMANCY, 6 CONSERVATION, 7 AUDIENCE PROJECTION.)
 *
 * THE WHOLE SUBSYSTEM EXISTS SO THAT THESE THREE VERBS ARE THE ONLY PLACE A FATE IS
 * RESOLVED. Every other lane in W-H produces a STATE: a verdict is a state, roaming is
 * a state, a shut door is a state. The engine never decides that somebody dies, never
 * decides that a banishment is over, and never overrules a town's edict. A DM does, by
 * pressing a button, and gets a receipt they can reverse.
 *
 *   ASSIGN  — put a wanderer into a settlement. SOVEREIGN: it may override the
 *             exclusion edges a court wrote, and when it does, the override is NAMED in
 *             the receipt (design §7 is explicit about that, and it is the difference
 *             between a DM's ruling and a bug). Address-chain news: "X takes up
 *             residence in Y."
 *   KILL    — the ONLY death in the system. DM-explicit, receipt-carried, undoable.
 *   PARDON  — the mercy verb: lift the edicts shut against a person, release a jail
 *             hold, and say so in the paper.
 *
 * ── UNDO IS A TYPED INVERSE, NOT A SECOND MECHANISM ──────────────────────────────
 * Design §7 asks for "snapshot undo". Every verb here returns an `undo` payload that IS
 * the snapshot of exactly what it disturbed: KILL carries the removed record verbatim
 * (a snapshot of the soul, since §3b freezes the ledger at three maps and forbids a
 * tombstone), ASSIGN carries the prior placement, PARDON carries the lifted edges
 * verbatim. `undoDmVerb` replays it. ONE mechanism rather than a snapshot ring beside a
 * typed inverse, because two mechanisms for one guarantee is how an undo path drifts out
 * of agreement with the write path it is supposed to reverse. It composes better too: a
 * replayed inverse survives an unrelated ledger write between the act and the undo,
 * where a whole-worldState snapshot would silently roll that write back as well.
 *
 * ── AUDIENCE PROJECTION (law 7) ──────────────────────────────────────────────────
 * Each news item carries its DM receipt under the SAME `dmTruth` key H2 used, so the
 * ledger projection's allowlist and publicSafe.js's recursive denylist both hold it out
 * without either learning a second spelling. What a player reads is the headline, the
 * summary and the reasons, in world words; what the DM reads additionally is which
 * override ran, what the prior state was, and what the inverse would restore.
 *
 * ── DORMANCY (law 5) ─────────────────────────────────────────────────────────────
 * Every entry point is a whole-entry-point early return when `npcConsequencesEnabled`
 * is dark, returning the CALLER'S OWN worldState reference so a dark pass cannot mint a
 * fresh object and defeat a change detector upstream.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation. The
 * verbs are total on garbage: an unknown durable id, a nameless settlement or a dark
 * world all produce a typed refusal rather than a throw or a half-write.
 *
 * @enforced-by tests/domain/npcDmVerbs.test.js
 */

import {
  npcConsequencesActive,
  npcLedgerOf,
  moveNpcRecord,
  removeNpcRecord,
  restoreNpcRecord,
  liftExclusionEdges,
  addExclusionEdge,
} from './npcLedger.js';
import { EDICT_EXCLUSION_KINDS, exclusionActiveAt } from './npcLedgerFacets.js';
// THE RULING REGISTER is its own single-writer leaf (see its header for the walker
// hazard that forced the split): the address-chain items these verbs hand down land
// there, and the inverse withdraws them from there.
import { recordNpcRuling, withdrawNpcRuling } from './npcRulingRegister.js';
// BOTH KEYS ARE IMPORTED, NEVER RE-SPELLED. `dmTruth` is the estate's covert field and
// its exported home is the projection (which is also what holds it out); `npcConsequence`
// is H2's roster mark and its exported home is the verdict lane. A local copy of either
// literal would be a fork that drifts, and the direction it drifts in for the first one
// is a privacy leak rather than a cosmetic inconsistency.
import { DM_TRUTH_KEY } from './npcLedgerProjection.js';
import { NPC_CONSEQUENCE_KEY } from './npcVerdictApply.js';

/** The closed verb vocabulary. A fourth verb is a design amendment, not a call site. */
export const DM_VERBS = Object.freeze(['assign', 'kill', 'pardon']);

/** The address-chain candidate types the three verbs mint. All three ride the
 *  `npc_` family prefix in heraldRouting.js (PREFIX_RULES), so each is EXPLICITLY
 *  routed to the Events door rather than reaching the silent catch-all. */
export const ASSIGN_NEWS_TYPE = 'npc_assignment';
export const DEATH_NEWS_TYPE = 'npc_death';
export const PARDON_NEWS_TYPE = 'npc_pardon';

/** The typed refusal vocabulary. Closed, so a surface can phrase every one of them. */
export const DM_VERB_REFUSALS = Object.freeze([
  'dormant',
  'unknown_identity',
  'no_settlement',
  'excluded_without_override',
  'nothing_to_lift',
  'already_there',
]);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * @typedef {Object} DmVerbUndo
 * @property {string} verb        a DM_VERBS member
 * @property {string} wnpcId
 * @property {string} rulingId    the address-chain item to withdraw from the register
 * @property {string|null} hostSettlementId  ASSIGN: where they were before (null = roaming)
 * @property {number} sinceTick              ASSIGN: the state clock to restore
 * @property {Record<string, unknown>|null} record  KILL: the removed record, verbatim
 * @property {boolean} wasPlaced                    KILL: which map it came out of
 * @property {ReadonlyArray<Record<string, unknown>>} edges  KILL/PARDON: the edges to re-write
 */

/**
 * @typedef {Object} DmVerbResult
 * @property {Record<string, unknown>} worldState
 * @property {unknown} settlement            the (possibly) patched settlement, or the caller's own
 * @property {string} verb
 * @property {Record<string, unknown>|null} news
 * @property {Record<string, unknown>|null} receipt
 * @property {DmVerbUndo|null} undo
 * @property {string|null} refusal           a DM_VERB_REFUSALS member when nothing happened
 * @property {boolean} changed
 */

/**
 * The no-op result. Returns the caller's OWN references (law 5's change-detector rule).
 * @param {Record<string, unknown>} worldState
 * @param {unknown} settlement
 * @param {string} verb
 * @param {string} refusal
 * @returns {DmVerbResult}
 */
function refuse(worldState, settlement, verb, refusal) {
  return {
    worldState,
    settlement,
    verb,
    news: null,
    receipt: null,
    undo: null,
    refusal,
    changed: false,
  };
}

/**
 * Find a durable identity in either map. Returns the record, which map held it, and the
 * host it was under, so every verb reads the ledger through ONE lookup rather than three
 * that could disagree about what "present" means.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} wnpcId
 * @returns {{ record: Record<string, unknown>, wasPlaced: boolean, host: string,
 *   edges: ReadonlyArray<Record<string, unknown>> } | null}
 */
function findIdentity(worldState, wnpcId) {
  const ledger = npcLedgerOf(worldState);
  const id = text(wnpcId);
  const placed = Object.prototype.hasOwnProperty.call(ledger.placed, id);
  const roaming = Object.prototype.hasOwnProperty.call(ledger.roamers, id);
  if (!placed && !roaming) return null;
  const record = /** @type {Record<string, unknown>} */ (
    /** @type {unknown} */ (placed ? ledger.placed[id] : ledger.roamers[id])
  );
  const rawEdges = ledger.exclusions[id] || [];
  return {
    record,
    wasPlaced: placed,
    host: placed ? text(record.hostSettlementId) : '',
    edges: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
      /** @type {unknown} */ (rawEdges)
    ),
  };
}

/** The reader-facing name for a ledger record, never degrading to a raw durable id:
 *  a `wnpc_8f3a2` in a newspaper headline reads as machine noise to a human.
 *  @param {Record<string, unknown>} record @returns {string} */
function nameOf(record) {
  return text(asObject(record.identityFacets).name) || 'A stranger';
}

/** The place word: the settlement's name when we have it, its id only as a last resort.
 *  @param {string} settlementId @param {string} settlementName @returns {string} */
function placeWord(settlementId, settlementName) {
  return text(settlementName) || text(settlementId) || 'the realm';
}

// ── ASSIGN ────────────────────────────────────────────────────────────────────
/**
 * PUT A WANDERER INTO A SETTLEMENT, BY THE DM'S OWN HAND.
 *
 * THE SOVEREIGNTY RULE, and why it is not simply "ignore the exclusions". A DM may
 * absolutely walk a banished person back through the gate they were thrown out of;
 * design §7 says so. But an override that happens SILENTLY is indistinguishable from a
 * bug that forgot to check, and the person who has to tell them apart is a GM six months
 * later reading their own campaign. So the two are separated: without
 * `overrideExclusions` the verb REFUSES and names the doors that are shut; with it, the
 * verb proceeds and the receipt NAMES every edge it overrode. The refusal is what makes
 * the override meaningful.
 *
 * A COOLDOWN IS NOT A DOOR. Only EDICT kinds gate this verb: a rehost cooldown is
 * circulation bookkeeping (the wanderer has not knocked again yet), never a legal fact,
 * and refusing a DM's assignment because of one would be the engine overruling them on a
 * technicality it invented for its own pacing.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {string} args.settlementId
 * @param {string} [args.settlementName]
 * @param {number} args.tick
 * @param {boolean} [args.overrideExclusions]  the DM says "anyway", explicitly
 * @returns {DmVerbResult}
 */
export function assignRoamer({
  worldState,
  wnpcId,
  settlementId,
  settlementName = '',
  tick,
  overrideExclusions = false,
}) {
  if (!npcConsequencesActive(worldState)) return refuse(worldState, null, 'assign', 'dormant');
  const target = text(settlementId);
  if (!target) return refuse(worldState, null, 'assign', 'no_settlement');
  const found = findIdentity(worldState, wnpcId);
  if (!found) return refuse(worldState, null, 'assign', 'unknown_identity');
  if (found.wasPlaced && found.host === target) {
    return refuse(worldState, null, 'assign', 'already_there');
  }

  const at = tickOf(tick);
  // THE SHUT DOORS AT THIS SETTLEMENT, edict kinds only, still live at this tick.
  const shut = found.edges.filter((edge) => (
    text(edge.settlementId) === target
    && EDICT_EXCLUSION_KINDS.includes(text(edge.kind))
    && exclusionActiveAt(edge, at)
  ));
  if (shut.length > 0 && overrideExclusions !== true) {
    return refuse(worldState, null, 'assign', 'excluded_without_override');
  }

  const moved = moveNpcRecord({
    worldState,
    wnpcId: text(wnpcId),
    hostSettlementId: target,
    sinceTick: at,
  });
  if (!moved.changed) return refuse(worldState, null, 'assign', 'already_there');

  const who = nameOf(found.record);
  const where = placeWord(target, settlementName);
  const overrides = shut.map((edge) => `${text(edge.kind)} at ${text(edge.settlementId)}`);
  /** @type {Record<string, unknown>} */
  const receipt = {
    verb: 'assign',
    wnpcId: text(wnpcId),
    settlementId: target,
    tick: at,
    priorHostSettlementId: found.wasPlaced ? found.host : null,
    // THE OVERRIDE, NAMED. Empty when no door was shut, which is the honest reading:
    // the DM did not override anything, they placed somebody nobody had barred.
    overrodeExclusions: Object.freeze(overrides),
  };
  const news = assignmentNewsItem({
    wnpcId: text(wnpcId),
    who,
    where,
    settlementId: target,
    originSettlementId: text(asObject(found.record.originRef).settlementId),
    overrides,
    tick: at,
  });
  return {
    worldState: recordNpcRuling(moved.worldState, news),
    settlement: null,
    verb: 'assign',
    news,
    receipt: Object.freeze(receipt),
    undo: Object.freeze({
      verb: 'assign',
      wnpcId: text(wnpcId),
      rulingId: text(news.id),
      hostSettlementId: found.wasPlaced ? found.host : null,
      sinceTick: tickOf(found.record.sinceTick),
      record: null,
      wasPlaced: found.wasPlaced,
      edges: Object.freeze([]),
    }),
    refusal: null,
    changed: true,
  };
}

/**
 * The ASSIGN address-chain item. Design §7 fixes the headline words.
 * @param {Object} args
 * @param {string} args.wnpcId @param {string} args.who @param {string} args.where
 * @param {string} args.settlementId @param {string} args.originSettlementId
 * @param {ReadonlyArray<string>} args.overrides @param {number} args.tick
 * @returns {Record<string, unknown>}
 */
function assignmentNewsItem({ wnpcId, who, where, settlementId, originSettlementId, overrides, tick }) {
  return Object.freeze({
    id: `npcassign:${settlementId}:${wnpcId}:${String(tick)}`,
    candidateType: ASSIGN_NEWS_TYPE,
    targetSaveId: settlementId,
    settlementIds: Object.freeze([settlementId, originSettlementId].filter(Boolean)),
    wnpcId,
    originSettlementId,
    audience: 'public',
    severity: 0.3,
    tick,
    headline: `${who} takes up residence in ${where}.`,
    summary: overrides.length > 0
      ? `They return by a ruling that sets aside the order shutting them out of ${where}.`
      : `${where} opens its gate to them.`,
    reasons: Object.freeze([
      `${who} is settled at ${where} by the will of the realm.`,
      overrides.length > 0
        ? 'An order standing against them is set aside for this return.'
        : 'No order stood against them here.',
    ]),
    [DM_TRUTH_KEY]: Object.freeze({
      receipt: Object.freeze({
        verb: 'assign',
        overrodeExclusions: Object.freeze([...overrides]),
      }),
    }),
  });
}

// ── KILL ──────────────────────────────────────────────────────────────────────
/**
 * THE ONLY DEATH IN THE SYSTEM (design §7, law 1).
 *
 * No engine path reaches this function and none ever may: the verdict table produces
 * states, circulation produces movements, the lifecycle kernel produces dispersal, and
 * every one of them composes with the others precisely because none of them is
 * terminal. A death is the DM's sentence and nobody else's, so it lives behind a verb
 * they have to press and a receipt they can reverse.
 *
 * WHAT IT TOUCHES. The world ledger only: the durable record leaves the pool and its
 * exclusion edges go with it (an edict against a dead person is not an edict). The
 * settlement roster is DELIBERATELY NOT TOUCHED here and that is documented rather than
 * forgotten: the roster lives on a different persistence surface (a saved settlement,
 * not the campaign world), so removing somebody from it is a save-scoped transaction
 * belonging to the slice that owns that write. The verb instead stamps a
 * `npcConsequence` mark on the roster record when a settlement is supplied, which is the
 * SAME key H2's relinquishment writes, so a dossier reading that key sees the death
 * without this leaf inventing a second spelling for it.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {number} args.tick
 * @param {unknown} [args.settlement]      the host settlement, when the caller has it
 * @param {string} [args.settlementName]
 * @returns {DmVerbResult}
 */
export function killNamedNpc({ worldState, wnpcId, tick, settlement = null, settlementName = '' }) {
  if (!npcConsequencesActive(worldState)) return refuse(worldState, settlement, 'kill', 'dormant');
  const found = findIdentity(worldState, wnpcId);
  if (!found) return refuse(worldState, settlement, 'kill', 'unknown_identity');

  const at = tickOf(tick);
  const removal = removeNpcRecord(worldState, text(wnpcId));
  if (!removal.changed) return refuse(worldState, settlement, 'kill', 'unknown_identity');

  const who = nameOf(found.record);
  const lastSeenId = found.wasPlaced
    ? found.host
    : text(asObject(found.record.residency).settlementId)
      || text(asObject(found.record.originRef).settlementId);
  const where = placeWord(lastSeenId, settlementName);
  const rosterId = text(asObject(found.record.originRef).rosterId);
  const marked = markRosterDeath(settlement, rosterId, at);

  const news = deathNewsItem({
    wnpcId: text(wnpcId),
    who,
    where,
    settlementId: lastSeenId,
    rosterId,
    tick: at,
  });
  return {
    worldState: recordNpcRuling(removal.worldState, news),
    settlement: marked,
    verb: 'kill',
    news,
    receipt: Object.freeze({
      verb: 'kill',
      wnpcId: text(wnpcId),
      settlementId: lastSeenId,
      tick: at,
      wasPlaced: found.wasPlaced,
      doorsClosed: removal.exclusions.length,
    }),
    // THE SNAPSHOT: the record verbatim, which is the only thing that can restore a soul
    // the three-map ledger keeps no tombstone for.
    undo: Object.freeze({
      verb: 'kill',
      wnpcId: text(wnpcId),
      rulingId: text(news.id),
      hostSettlementId: found.wasPlaced ? found.host : null,
      sinceTick: tickOf(found.record.sinceTick),
      record: found.record,
      wasPlaced: found.wasPlaced,
      edges: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
        /** @type {unknown} */ (removal.exclusions)
      ),
    }),
    refusal: null,
    changed: true,
  };
}

/**
 * Stamp the death onto the roster record, when the caller handed us the settlement.
 * Returns the caller's OWN reference when there is nothing to mark, so a no-op cannot
 * mint a fresh settlement object and make an unrelated change detector fire.
 *
 * @param {unknown} settlement @param {string} rosterId @param {number} tick
 * @returns {unknown}
 */
function markRosterDeath(settlement, rosterId, tick) {
  if (!settlement || typeof settlement !== 'object' || !rosterId) return settlement;
  const s = asObject(settlement);
  const roster = Array.isArray(s.npcs) ? s.npcs : null;
  if (!roster) return settlement;
  let hit = false;
  const npcs = roster.map((entry) => {
    const npc = asObject(entry);
    if (text(npc.id) !== rosterId) return entry;
    hit = true;
    return {
      ...npc,
      [NPC_CONSEQUENCE_KEY]: {
        ...asObject(npc[NPC_CONSEQUENCE_KEY]),
        deceasedAtTick: tick,
        deceasedByDm: true,
      },
    };
  });
  return hit ? { ...s, npcs } : settlement;
}

/**
 * The KILL address-chain item.
 * @param {Object} args
 * @param {string} args.wnpcId @param {string} args.who @param {string} args.where
 * @param {string} args.settlementId @param {string} args.rosterId @param {number} args.tick
 * @returns {Record<string, unknown>}
 */
function deathNewsItem({ wnpcId, who, where, settlementId, rosterId, tick }) {
  return Object.freeze({
    id: `npcdeath:${settlementId}:${wnpcId}:${String(tick)}`,
    candidateType: DEATH_NEWS_TYPE,
    targetSaveId: settlementId,
    settlementIds: Object.freeze([settlementId].filter(Boolean)),
    npcId: rosterId,
    wnpcId,
    audience: 'public',
    severity: 0.6,
    tick,
    headline: `${who} is dead.`,
    summary: `The realm strikes their name from the register of the living. ${where} was the last place that held them.`,
    reasons: Object.freeze([
      `${who} is recorded among the dead at ${where}.`,
      'Any order standing against them dies with them.',
    ]),
    [DM_TRUTH_KEY]: Object.freeze({
      receipt: Object.freeze({ verb: 'kill', ruledByDm: true }),
    }),
  });
}

// ── PARDON ────────────────────────────────────────────────────────────────────
/**
 * THE MERCY VERB (design §7): lift the edicts, release the hold, and say so.
 *
 * ONE VERB, TWO HALVES, because they are one act in the fiction and the design names
 * them together. LIFT EXCLUSION works on the world ledger: the edict edges shut against
 * this person, either everywhere or at one named door. RELEASE works on the settlement:
 * a jailed person's hold is the `npcConsequence.jailUntilTick` mark H2 stamped on their
 * roster record, so a release clears exactly that field and leaves the rest of the mark
 * standing (the disgrace happened; the sentence is over).
 *
 * THE SETTLEMENT IS OPTIONAL, AND ITS ABSENCE IS NOT A FAILURE. A pardon issued from the
 * realm register may reach somebody whose host save the caller does not have in hand;
 * the ledger half still runs and the receipt records that no hold was reachable, rather
 * than the verb refusing an act the DM is entitled to perform.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {number} args.tick
 * @param {string} [args.settlementId]  narrow the pardon to ONE door; absent = every door
 * @param {string} [args.settlementName]
 * @param {unknown} [args.settlement]   the host save, when the caller has it (the release half)
 * @returns {DmVerbResult}
 */
export function pardonNpc({
  worldState,
  wnpcId,
  tick,
  settlementId = '',
  settlementName = '',
  settlement = null,
}) {
  if (!npcConsequencesActive(worldState)) return refuse(worldState, settlement, 'pardon', 'dormant');
  const found = findIdentity(worldState, wnpcId);
  if (!found) return refuse(worldState, settlement, 'pardon', 'unknown_identity');

  const at = tickOf(tick);
  const lift = liftExclusionEdges(worldState, text(wnpcId), { settlementId, kinds: EDICT_EXCLUSION_KINDS });
  const rosterId = text(asObject(found.record.originRef).rosterId);
  const released = clearJailHold(settlement, rosterId);
  const releasedHold = released !== settlement;
  if (lift.lifted.length === 0 && !releasedHold) {
    return refuse(worldState, settlement, 'pardon', 'nothing_to_lift');
  }

  const who = nameOf(found.record);
  const doors = lift.lifted.map((edge) => text(edge.settlementId));
  const where = placeWord(settlementId || found.host || doors[0] || '', settlementName);
  const news = pardonNewsItem({
    wnpcId: text(wnpcId),
    who,
    where,
    settlementId: settlementId || found.host || doors[0] || '',
    doors,
    releasedHold,
    tick: at,
  });
  return {
    worldState: recordNpcRuling(lift.worldState, news),
    settlement: released,
    verb: 'pardon',
    news,
    receipt: Object.freeze({
      verb: 'pardon',
      wnpcId: text(wnpcId),
      // The NARROWING scope the caller asked for (empty = every door)...
      settlementId: text(settlementId),
      // ...and, separately, where a jail hold could live. The two are different
      // questions and conflating them is what makes a release half silently miss: a
      // pardon issued against every door names no settlement, while the person it
      // frees is held at exactly one.
      hostSettlementId: found.wasPlaced ? found.host : '',
      tick: at,
      doorsOpened: Object.freeze(doors),
      releasedFromHold: releasedHold,
    }),
    undo: Object.freeze({
      verb: 'pardon',
      wnpcId: text(wnpcId),
      rulingId: text(news.id),
      hostSettlementId: found.wasPlaced ? found.host : null,
      sinceTick: tickOf(found.record.sinceTick),
      record: null,
      wasPlaced: found.wasPlaced,
      // THE SNAPSHOT: the lifted edges verbatim, windows and all, so re-shutting a door
      // restores the exact sentence rather than a fresh indefinite one.
      edges: /** @type {ReadonlyArray<Record<string, unknown>>} */ (
        /** @type {unknown} */ (lift.lifted)
      ),
    }),
    refusal: null,
    changed: lift.changed || releasedHold,
  };
}

/**
 * Clear a jail hold from the roster record. Returns the caller's OWN reference when
 * there is no hold to clear (no settlement, no roster, no mark, or no jail field), so a
 * pardon of somebody who was never jailed writes nothing at all.
 *
 * @param {unknown} settlement @param {string} rosterId @returns {unknown}
 */
function clearJailHold(settlement, rosterId) {
  if (!settlement || typeof settlement !== 'object' || !rosterId) return settlement;
  const s = asObject(settlement);
  const roster = Array.isArray(s.npcs) ? s.npcs : null;
  if (!roster) return settlement;
  let hit = false;
  const npcs = roster.map((entry) => {
    const npc = asObject(entry);
    if (text(npc.id) !== rosterId) return entry;
    const mark = asObject(npc[NPC_CONSEQUENCE_KEY]);
    if (!Object.prototype.hasOwnProperty.call(mark, 'jailUntilTick')) return entry;
    hit = true;
    const nextMark = { ...mark };
    delete nextMark.jailUntilTick;
    return { ...npc, [NPC_CONSEQUENCE_KEY]: nextMark };
  });
  return hit ? { ...s, npcs } : settlement;
}

/**
 * The PARDON address-chain item.
 * @param {Object} args
 * @param {string} args.wnpcId @param {string} args.who @param {string} args.where
 * @param {string} args.settlementId @param {ReadonlyArray<string>} args.doors
 * @param {boolean} args.releasedHold @param {number} args.tick
 * @returns {Record<string, unknown>}
 */
function pardonNewsItem({ wnpcId, who, where, settlementId, doors, releasedHold, tick }) {
  const opened = doors.length;
  return Object.freeze({
    id: `npcpardon:${settlementId}:${wnpcId}:${String(tick)}`,
    candidateType: PARDON_NEWS_TYPE,
    targetSaveId: settlementId,
    settlementIds: Object.freeze([settlementId, ...doors].filter(Boolean)),
    wnpcId,
    audience: 'public',
    severity: 0.35,
    tick,
    headline: releasedHold && opened === 0
      ? `${who} walks free at ${where}.`
      : `${who} is pardoned at ${where}.`,
    summary: opened > 1
      ? 'Every gate that was shut against them stands open again.'
      : releasedHold && opened === 0
        ? 'The sentence that held them is served and set aside.'
        : `The order keeping them out of ${where} is lifted.`,
    reasons: Object.freeze([
      `The realm sets aside what stood against ${who}.`,
      releasedHold
        ? 'The hold that kept them in custody is ended.'
        : 'They may pass where they were barred.',
    ]),
    [DM_TRUTH_KEY]: Object.freeze({
      receipt: Object.freeze({
        verb: 'pardon',
        doorsOpened: Object.freeze([...doors]),
        releasedFromHold: releasedHold,
      }),
    }),
  });
}

// ── THE INVERSE ───────────────────────────────────────────────────────────────
/**
 * REVERSE ONE DM VERB from the `undo` payload it handed back.
 *
 * Total over the closed verb vocabulary: assign puts the person back where they were,
 * kill restores the record and every edge it took with it, pardon re-shuts the exact
 * doors it opened. An unknown verb, a dark world or a stale payload is a no-op returning
 * the caller's own worldState.
 *
 * NOT TOTAL OVER THE SETTLEMENT HALF, and it says so rather than pretending: the roster
 * marks KILL and PARDON write live on a saved settlement, and this pure inverse only
 * restores the WORLD LEDGER. The caller that wrote the settlement is the caller that
 * must restore it, which is why every verb returns the settlement it patched.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {unknown} args.undo
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, verb: string }}
 */
export function undoDmVerb({ worldState, undo }) {
  const payload = asObject(undo);
  const verb = text(payload.verb);
  if (!npcConsequencesActive(worldState) || !DM_VERBS.includes(verb)) {
    return { worldState, changed: false, verb };
  }
  const wnpcId = text(payload.wnpcId);
  if (!wnpcId) return { worldState, changed: false, verb };

  // THE RULING IS WITHDRAWN FIRST, and it is withdrawn for EVERY verb. An undone kill
  // that left "X is dead" standing in the paper would be the register contradicting the
  // ledger, which is exactly the reader/writer drift the estate keeps getting bitten by.
  let next = withdrawNpcRuling(worldState, text(payload.rulingId));

  if (verb === 'assign') {
    const back = moveNpcRecord({
      worldState: next,
      wnpcId,
      hostSettlementId: payload.hostSettlementId == null ? null : text(payload.hostSettlementId),
      sinceTick: tickOf(payload.sinceTick),
    });
    return { worldState: back.worldState, changed: back.worldState !== worldState, verb };
  }

  if (verb === 'kill') {
    const back = restoreNpcRecord({
      worldState: next,
      wnpcId,
      record: payload.record,
      wasPlaced: payload.wasPlaced === true,
      exclusions: Array.isArray(payload.edges) ? payload.edges : [],
    });
    return { worldState: back.worldState, changed: back.worldState !== worldState, verb };
  }

  // pardon: re-shut every door, with its original window.
  for (const edge of Array.isArray(payload.edges) ? payload.edges : []) {
    next = addExclusionEdge(next, wnpcId, asObject(edge)).worldState;
  }
  return { worldState: next, changed: next !== worldState, verb };
}
