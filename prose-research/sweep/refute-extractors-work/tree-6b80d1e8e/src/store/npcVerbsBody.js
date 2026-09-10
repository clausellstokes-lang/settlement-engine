/**
 * npcVerbsBody.js — the BODY of the three DM verbs (design DESIGN_NPC_CONSEQUENCES.md
 * §7, wave W-H4).
 *
 * WHY A SEPARATE BODY MODULE. npcVerbsSlice.js is composed into the store and is
 * therefore EAGER: every byte it statically imports is a first-paint byte. The verbs
 * need the whole consequence-economy leaf graph (the ledger, its facets, the audience
 * projection, the verdict lane's roster-mark key), which is exactly the kind of heavy
 * derivation the first-paint law forbids an eager module from pulling in. So the slice
 * keeps thin async wrappers and dynamic-imports this module on first use, which is the
 * proven loadWorldEngine() / campaignAdvanceSession pattern the world-pulse slice
 * already uses for the same reason.
 *
 * WHAT A VERB DOES HERE, in order and no other:
 *   1. read the campaign and run the PURE verb over its world state;
 *   2. commit the world state, and the host settlement when the verb patched one;
 *   3. push the typed inverse onto the session undo ring;
 *   4. persist the campaign, and the touched save through the durable outbox.
 * Nothing is decided here. Every rule about what a verb may do lives in the domain leaf,
 * so the store cannot develop a second opinion about, say, whether an exclusion may be
 * overridden.
 *
 * THE UNDO RING IS SESSION-SCOPED and deliberately not persisted (store/index.js's
 * partialize is an allowlist, so this needs no exclusion): the same contract
 * pulseUndoStack holds. A reload clears it, and the world state it would have restored
 * is the world state you reloaded, which is the honest reading.
 */

import {
  assignRoamer,
  killNamedNpc,
  pardonNpc,
  undoDmVerb,
} from '../domain/worldPulse/npcDmVerbs.js';
import { placementOf } from '../domain/worldPulse/npcLedger.js';
import { ensureWorldState } from '../domain/worldPulse/worldState.js';
import {
  cloneJson,
  findActiveCampaign,
  persistCampaignState,
  persistSaveUpdate,
} from './campaignSliceShared.js';

/** How many rulings the session can walk back. Matches the register's own cap, so the
 *  ring can never promise an undo for a ruling the register has already evicted. */
export const NPC_VERB_UNDO_DEPTH = 40;

/**
 * @typedef {object} NpcVerbResult
 * @property {boolean} ok            did the ruling land
 * @property {string} verb           assign | kill | pardon | undo, or '' when nothing was attempted
 * @property {string|null} refusal   the refusal word when ok is false, null when it landed
 * @property {Record<string, unknown>|null} receipt  the ruling's receipt when it landed
 * @property {Record<string, unknown>|null} news     the address-chain item when it landed
 * @property {ReadonlyArray<Record<string, unknown>>} [envoyEvidence] WR-7a loss
 *   evidence when KILL closes a live errand
 */

/** The refused result, shaped like the granted one so a caller never branches on shape.
 *  @param {string} verb @param {string} refusal
 *  @returns {NpcVerbResult} */
function refused(verb, refusal) {
  return { ok: false, verb, refusal, receipt: null, news: null };
}

/**
 * Find the saved library row for a settlement id, or null. The verbs patch a roster
 * record (a death mark, a cleared jail hold), and that record lives on a SAVE rather
 * than on the campaign, so the write has to reach across.
 *
 * @param {any} state @param {string} settlementId
 * @returns {any}
 */
function savedEntryFor(state, settlementId) {
  const id = String(settlementId || '');
  if (!id) return null;
  return (state.savedSettlements || []).find((row) => String(row?.id) === id) || null;
}

/**
 * Commit one verb result onto the store.
 *
 * @param {Object} args
 * @param {any} args.state          the Immer draft
 * @param {any} args.campaign       the draft campaign
 * @param {any} args.result         a DmVerbResult
 * @param {string} args.settlementId  the save the settlement half addressed, if any
 * @param {any} args.priorSettlement  the settlement BEFORE the verb, for the undo ring
 * @returns {Array<{ saveId: string, partial: Record<string, unknown> }>} save writes to flush
 */
function commitVerbResult({ state, campaign, result, settlementId, priorSettlement }) {
  const now = new Date().toISOString();
  campaign.worldState = result.worldState;
  campaign.updatedAt = now;

  /** @type {Array<{ saveId: string, partial: Record<string, unknown> }>} */
  const saveWrites = [];
  if (result.settlement && settlementId && result.settlement !== priorSettlement) {
    const row = savedEntryFor(state, settlementId);
    if (row) {
      row.settlement = result.settlement;
      // The LIVE view is the same settlement when the DM has it open; leaving it stale
      // would show a dead person still standing until the next dossier round trip.
      if (String(state.activeSaveId || '') === String(settlementId)) {
        state.settlement = result.settlement;
      }
      saveWrites.push({ saveId: String(settlementId), partial: { settlement: cloneJson(result.settlement) } });
    }
  }

  const ring = Array.isArray(state.npcVerbUndoStack) ? state.npcVerbUndoStack : [];
  state.npcVerbUndoStack = [
    ...ring,
    {
      campaignId: String(campaign.id),
      undo: result.undo,
      // The settlement half has no typed inverse (the pure leaf says so in its own
      // header), so the ring carries the BEFORE image and the undo re-writes it.
      settlementId: saveWrites.length > 0 ? String(settlementId) : '',
      priorSettlement: saveWrites.length > 0 ? cloneJson(priorSettlement) : null,
    },
  ].slice(-NPC_VERB_UNDO_DEPTH);

  persistCampaignState(state, campaign.id);
  return saveWrites;
}

/** Flush the save writes a verb produced. Awaited by the caller so the returned result
 *  is authoritative rather than optimistic.
 *  @param {Array<{ saveId: string, partial: Record<string, unknown> }>} writes */
async function flushSaveWrites(writes) {
  for (const write of writes) await persistSaveUpdate(write.saveId, write.partial);
}

/**
 * ASSIGN. The DM settles somebody into a place.
 *
 * @param {{ set: Function, campaignId: string, wnpcId: string,
 *   settlementId: string, overrideExclusions?: boolean }} input
 */
export async function runAssignNpc({ set, campaignId, wnpcId, settlementId, overrideExclusions = false }) {
  /** @type {NpcVerbResult} */
  let out = refused('assign', 'unknown_identity');
  let writes = [];
  set((state) => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const worldState = ensureWorldState(campaign.worldState, campaign);
    const row = savedEntryFor(state, settlementId);
    const result = assignRoamer({
      worldState,
      wnpcId,
      settlementId,
      settlementName: row?.name || row?.settlement?.name || '',
      tick: Number(worldState.tick) || 0,
      overrideExclusions: overrideExclusions === true,
    });
    if (!result.changed) {
      out = refused('assign', result.refusal || 'unknown_identity');
      return;
    }
    writes = commitVerbResult({ state, campaign, result, settlementId: '', priorSettlement: null });
    out = { ok: true, verb: 'assign', refusal: null, receipt: result.receipt, news: result.news };
  });
  await flushSaveWrites(writes);
  return out;
}

/**
 * KILL. The one death in the system.
 *
 * @param {{ set: Function, campaignId: string, wnpcId: string }} input
 */
export async function runKillNpc({ set, campaignId, wnpcId }) {
  /** @type {NpcVerbResult} */
  let out = refused('kill', 'unknown_identity');
  let writes = [];
  set((state) => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const worldState = ensureWorldState(campaign.worldState, campaign);
    // The roster mark needs the save the person was last hosted at; the pure verb
    // resolves that id itself, so a dry run over a null settlement tells us WHICH save
    // to hand it before the real one runs. Two calls over the same immutable input are
    // byte-identical by construction (the leaf is pure and consumes no randomness).
    const probe = killNamedNpc({ worldState, wnpcId, tick: Number(worldState.tick) || 0 });
    const hostId = String(probe.receipt?.settlementId || '');
    const row = savedEntryFor(state, hostId);
    const priorSettlement = row?.settlement || null;
    const result = killNamedNpc({
      worldState,
      wnpcId,
      tick: Number(worldState.tick) || 0,
      settlement: priorSettlement,
      settlementName: row?.name || row?.settlement?.name || '',
    });
    if (!result.changed) {
      out = refused('kill', result.refusal || 'unknown_identity');
      return;
    }
    writes = commitVerbResult({ state, campaign, result, settlementId: hostId, priorSettlement });
    out = {
      ok: true,
      verb: 'kill',
      refusal: null,
      receipt: result.receipt,
      news: result.news,
      ...(Array.isArray(result.envoyEvidence)
        ? { envoyEvidence: result.envoyEvidence }
        : {}),
    };
  });
  await flushSaveWrites(writes);
  return out;
}

/**
 * PARDON. Lift the edicts, release the hold.
 *
 * @param {{ set: Function, campaignId: string, wnpcId: string,
 *   settlementId?: string }} input
 */
export async function runPardonNpc({ set, campaignId, wnpcId, settlementId = '' }) {
  /** @type {NpcVerbResult} */
  let out = refused('pardon', 'unknown_identity');
  let writes = [];
  set((state) => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const worldState = ensureWorldState(campaign.worldState, campaign);
    // The release half addresses the save the person is HELD at, which is where a jail
    // mark lives; an unnarrowed pardon still lifts every edict.
    // WHERE A HOLD COULD LIVE is read from the LEDGER, not from a probe call: a person
    // who is jailed but under no edict makes the probe refuse (nothing to lift), and a
    // refusal carries no receipt, so probing for the host would silently skip the
    // release half in exactly the case it exists for.
    const hostId = String(placementOf(worldState, wnpcId)?.hostSettlementId || settlementId || '');
    const row = savedEntryFor(state, hostId);
    const priorSettlement = row?.settlement || null;
    const result = pardonNpc({
      worldState,
      wnpcId,
      tick: Number(worldState.tick) || 0,
      settlementId,
      settlementName: row?.name || row?.settlement?.name || '',
      settlement: priorSettlement,
    });
    if (!result.changed) {
      out = refused('pardon', result.refusal || 'nothing_to_lift');
      return;
    }
    writes = commitVerbResult({ state, campaign, result, settlementId: hostId, priorSettlement });
    out = { ok: true, verb: 'pardon', refusal: null, receipt: result.receipt, news: result.news };
  });
  await flushSaveWrites(writes);
  return out;
}

/**
 * UNDO. Reverse the most recent ruling on this campaign.
 *
 * Pops the ring's newest entry FOR THIS CAMPAIGN rather than the newest entry overall,
 * so a DM running two realms in one session cannot undo the wrong world's ruling.
 *
 * @param {{ set: Function, campaignId: string }} input
 */
export async function runUndoLastNpcVerb({ set, campaignId }) {
  /** @type {NpcVerbResult} */
  let out = { ok: false, verb: '', refusal: 'nothing_to_undo', receipt: null, news: null };
  let writes = [];
  set((state) => {
    const ring = Array.isArray(state.npcVerbUndoStack) ? state.npcVerbUndoStack : [];
    const index = [...ring].reverse().findIndex((e) => String(e?.campaignId) === String(campaignId));
    if (index === -1) return;
    const at = ring.length - 1 - index;
    const entry = ring[at];
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const worldState = ensureWorldState(campaign.worldState, campaign);
    const back = undoDmVerb({ worldState, undo: entry.undo });
    // A typed inverse may reject after a later writer changes one of its exact
    // conflict tokens. Keep the ring and both persistence halves untouched; popping a
    // rejected inverse would advertise success while only the settlement snapshot moved.
    if (!back.changed) {
      out = { ok: false, verb: back.verb, refusal: 'undo_conflict', receipt: null, news: null };
      return;
    }
    campaign.worldState = back.worldState;
    campaign.updatedAt = new Date().toISOString();
    if (entry.settlementId) {
      const row = savedEntryFor(state, entry.settlementId);
      if (row) {
        row.settlement = entry.priorSettlement;
        if (String(state.activeSaveId || '') === String(entry.settlementId)) {
          state.settlement = entry.priorSettlement;
        }
        writes = [{ saveId: String(entry.settlementId), partial: { settlement: cloneJson(entry.priorSettlement) } }];
      }
    }
    state.npcVerbUndoStack = [...ring.slice(0, at), ...ring.slice(at + 1)];
    persistCampaignState(state, campaignId);
    out = { ok: true, verb: back.verb, refusal: null, receipt: null, news: null };
  });
  await flushSaveWrites(writes);
  return out;
}
