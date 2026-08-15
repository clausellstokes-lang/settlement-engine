/**
 * domain/worldPulse/npcDmVerbRecords.js — W-H4: THE RECORDS A DM VERB HANDS OUTWARD.
 *
 * A PURE LEAF OF THE DM-VERB WRITER FAMILY (ruling R-BLD-4: the single-writer law reads
 * ONE WRITER FAMILY, never one file). npcDmVerbs.js remains the family HEAD — it owns the
 * ledger reads, the settlement patch it returns, and the ruling register write. This leaf
 * owns only the two SHAPES that head hands outward and never a write of its own:
 *
 *   THE ADDRESS-CHAIN ITEM — one frozen news record per verb (design §7 fixes the headline
 *     words; NEWS ADDRESS LAW requires the full address chain, a typed candidateType, the
 *     settlements BY NAME and a reason). Each rides the `npc_` family prefix that
 *     heraldRouting.js routes explicitly to the Events door.
 *   THE ROSTER MARK — the `npcConsequence` patch KILL and PARDON apply to a saved
 *     settlement's roster record. Both return the CALLER'S OWN settlement reference when
 *     there is nothing to mark, so a no-op cannot mint a fresh object and fire an
 *     unrelated change detector upstream (law 5's change-detector rule).
 *
 * WHY THE DM RECEIPT RIDES THE SAME KEY (law 7, AUDIENCE PROJECTION). Every item carries
 * its receipt under the imported `DM_TRUTH_KEY`, never a local re-spelling, so the ledger
 * projection's allowlist and publicSafe.js's recursive denylist both hold it out without
 * either learning a second spelling. A local copy of that literal would be a fork whose
 * drift direction is a privacy leak rather than a cosmetic inconsistency.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation, and no ledger
 * write. Every function here is total on garbage — a nameless record, a missing settlement
 * or an absent roster all produce a value rather than a throw.
 *
 * @enforced-by tests/domain/npcDmVerbs.test.js
 */

import { DM_TRUTH_KEY } from './npcLedgerProjection.js';
import { NPC_CONSEQUENCE_KEY } from './npcVerdictApply.js';

/** The address-chain candidate types the three verbs mint. All three ride the
 *  `npc_` family prefix in heraldRouting.js (PREFIX_RULES), so each is EXPLICITLY
 *  routed to the Events door rather than reaching the silent catch-all. */
export const ASSIGN_NEWS_TYPE = 'npc_assignment';
export const DEATH_NEWS_TYPE = 'npc_death';
export const PARDON_NEWS_TYPE = 'npc_pardon';

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** The reader-facing name for a ledger record, never degrading to a raw durable id:
 *  a `wnpc_8f3a2` in a newspaper headline reads as machine noise to a human.
 *  @param {Record<string, unknown>} record @returns {string} */
export function nameOf(record) {
  return text(asObject(record.identityFacets).name) || 'A stranger';
}

/** The place word: the settlement's name when we have it, its id only as a last resort.
 *  @param {string} settlementId @param {string} settlementName @returns {string} */
export function placeWord(settlementId, settlementName) {
  return text(settlementName) || text(settlementId) || 'the realm';
}

/**
 * The ASSIGN address-chain item. Design §7 fixes the headline words.
 * @param {Object} args
 * @param {string} args.wnpcId @param {string} args.who @param {string} args.where
 * @param {string} args.settlementId @param {string} args.originSettlementId
 * @param {string} args.departureSettlementId
 * @param {ReadonlyArray<string>} args.overrides @param {number} args.tick
 * @param {boolean} args.inTransit
 * @returns {Record<string, unknown>}
 */
export function assignmentNewsItem({
  wnpcId, who, where, settlementId, originSettlementId, departureSettlementId,
  overrides, tick, inTransit,
}) {
  return Object.freeze({
    id: `npcassign:${settlementId}:${wnpcId}:${String(tick)}`,
    candidateType: ASSIGN_NEWS_TYPE,
    targetSaveId: settlementId,
    settlementIds: Object.freeze([...new Set([
      settlementId, departureSettlementId, originSettlementId,
    ].filter(Boolean))]),
    wnpcId,
    originSettlementId,
    ...(departureSettlementId ? { departureSettlementId } : {}),
    audience: 'public',
    severity: 0.3,
    tick,
    headline: inTransit
      ? `${who} sets out for ${where}.`
      : `${who} takes up residence in ${where}.`,
    summary: inTransit
      ? (overrides.length > 0
          ? `A ruling sends them toward ${where} and sets aside the order shutting them out.`
          : `A ruling sends them toward a new place in ${where}.`)
      : (overrides.length > 0
          ? `They return by a ruling that sets aside the order shutting them out of ${where}.`
          : `${where} opens its gate to them.`),
    reasons: Object.freeze([
      inTransit
        ? `${who} travels toward ${where} by the will of the realm.`
        : `${who} is settled at ${where} by the will of the realm.`,
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

/**
 * The KILL address-chain item.
 * @param {Object} args
 * @param {string} args.wnpcId @param {string} args.who @param {string} args.where
 * @param {string} args.settlementId @param {string} args.rosterId
 * @param {boolean} args.locationKnown @param {boolean} args.foreignGuestHoldClosed
 * @param {number} args.tick
 * @returns {Record<string, unknown>}
 */
export function deathNewsItem({
  wnpcId, who, where, settlementId, rosterId, locationKnown, foreignGuestHoldClosed, tick,
}) {
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
    summary: locationKnown
      ? `The realm strikes their name from the register of the living. ${where} was the last place that held them.`
      : 'The realm strikes their name from the register of the living. No public account names where they died.',
    reasons: Object.freeze([
      locationKnown
        ? `${who} is recorded among the dead at ${where}.`
        : `${who} is recorded among the dead.`,
      'Any order standing against them dies with them.',
    ]),
    [DM_TRUTH_KEY]: Object.freeze({
      receipt: Object.freeze({
        verb: 'kill',
        ruledByDm: true,
        ...(foreignGuestHoldClosed ? { foreignGuestHoldClosed: true } : {}),
      }),
    }),
  });
}

/**
 * The PARDON address-chain item.
 * @param {Object} args
 * @param {string} args.wnpcId @param {string} args.who @param {string} args.where
 * @param {string} args.settlementId @param {ReadonlyArray<string>} args.doors
 * @param {boolean} args.releasedHold @param {boolean} args.releasedForeignHold
 * @param {number} args.tick
 * @returns {Record<string, unknown>}
 */
export function pardonNewsItem({
  wnpcId, who, where, settlementId, doors, releasedHold, releasedForeignHold, tick,
}) {
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
    headline: releasedForeignHold && opened === 0
      ? `${who} is pardoned.`
      : releasedHold && opened === 0
      ? `${who} walks free at ${where}.`
      : `${who} is pardoned at ${where}.`,
    summary: releasedForeignHold
      ? 'The realm sets aside what stood against the traveller and sends them onward.'
      : opened > 1
      ? 'Every gate that was shut against them stands open again.'
      : releasedHold && opened === 0
        ? 'The sentence that held them is served and set aside.'
        : `The order keeping them out of ${where} is lifted.`,
    reasons: Object.freeze([
      `The realm sets aside what stood against ${who}.`,
      releasedForeignHold
        ? 'Their interrupted journey is permitted to continue.'
        : releasedHold
          ? 'The hold that kept them in custody is ended.'
        : 'They may pass where they were barred.',
    ]),
    [DM_TRUTH_KEY]: Object.freeze({
      receipt: Object.freeze({
        verb: 'pardon',
        doorsOpened: Object.freeze([...doors]),
        releasedFromHold: releasedHold,
        ...(releasedForeignHold ? { releasedFromForeignCustody: true } : {}),
      }),
    }),
  });
}

/**
 * Stamp the death onto the roster record, when the caller handed us the settlement.
 * Returns the caller's OWN reference when there is nothing to mark, so a no-op cannot
 * mint a fresh settlement object and make an unrelated change detector fire.
 *
 * @param {unknown} settlement @param {string} rosterId @param {number} tick
 * @returns {unknown}
 */
export function markRosterDeath(settlement, rosterId, tick) {
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
 * Clear a jail hold from the roster record. Returns the caller's OWN reference when
 * there is no hold to clear (no settlement, no roster, no mark, or no jail field), so a
 * pardon of somebody who was never jailed writes nothing at all.
 *
 * @param {unknown} settlement @param {string} rosterId @returns {unknown}
 */
export function clearJailHold(settlement, rosterId) {
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
