/**
 * useChangeQueueCascade — the cross-save rename / link / unlink cascade, plus
 * the change-queue replay seam.
 *
 * Extracted from SettlementsPanel (which owns the `saves`/`detail` React state
 * these cascades mutate) to keep that surface under the component-size ratchet.
 * Behaviour-preserving: WHAT each cascade does is unchanged; this only relocates
 * the closures and the executor registration.
 *
 * Two modes per cascade:
 *   • IMMEDIATE (default, and the only mode for a clock-bound campaign member):
 *     mutate local saves/detail AND persist the affected rows now.
 *   • DEFERRED (during a change-queue flush, when `flushDeferRef` is set):
 *     mutate local saves/detail off the LIVE `savesRef` snapshot but DEFER the
 *     cloud write, recording every touched row id in `flushAffectedRef`. The
 *     flush then commits the whole affected-row set in ONE atomic persistBatch
 *     (registerBatchCommit), so a failed link commit restores BOTH settlements.
 *
 * The change-queue staging entry points (handleLink / removeNeighbour) QUEUE an
 * order when the open settlement is STANDALONE, and apply immediately for a
 * CLOCK-BOUND canon campaign member — matching how every other member edit
 * lands (EventComposer's Apply calls applyEvent now, the world-pulse redirect;
 * the header rename calls applyRename now). queueActiveForOpenDetail is true
 * for ANY open detail since Phase 4b, so the clock-bound check is made here,
 * live against the store at click time — without it a member's link order
 * would stage into a queue whose commit panel treats members as immediate.
 * A link order captures the partner SAVE ID + a STABLE linkId (never a neighbour
 * array index, which drifts as other queued orders mutate the network); an
 * unlink order captures the stable linkId. Both resolve to the live partner /
 * network at flush time.
 */

import { useEffect } from 'react';
import { generateCrossSettlementConflicts } from '../../generators/crossSettlementConflicts';
import {
  relationshipDefinition,
  relationshipLinkMetadata,
} from '../../domain/relationships/canonicalRelationship.js';
import { buildInterSettlementNPCs } from '../../domain/relationships/neighbourBackLink.js';
import { findSaveById, canonPhaseOf } from '../settlements/helpers.js';
import { useStore } from '../../store/index.js';
import { registerLinkExecutor, registerBatchCommit } from '../../store/changeQueueSlice.js';

/** STABLE link id for a (current, partner) pair — captured by the queue, not an index. */
const linkIdFor = (currentId, partnerId) => `link_${currentId}_${partnerId}`;

/**
 * @param {{
 *   saves: any[],
 *   setSaves: (next: any[]) => void,
 *   savesRef: { current: any[] },
 *   detail: any,
 *   setDetail: (updater: any) => void,
 *   setLinking: (v: any) => void,
 *   setNetworkVersion: (updater: any) => void,
 *   persistBatch: (updated: any[], ids: any[], options?: any) => Promise<boolean>,
 *   applyCosmeticRename: (args: { saveId: any, oldName: string, newName: string }) => void,
 *   queueChange: (saveId: any, order: any) => void,
 *   queueActiveForOpenDetail: boolean,
 *   flushDeferRef: { current: boolean },
 *   flushAffectedRef: { current: Set<any> },
 * }} ctx
 * @returns {{ applyRename: Function, handleLink: Function, removeNeighbour: Function }}
 */
export function useChangeQueueCascade(ctx) {
  const {
    saves, setSaves, savesRef, detail, setDetail, setLinking, setNetworkVersion,
    persistBatch, applyCosmeticRename, queueChange, queueActiveForOpenDetail,
    flushDeferRef, flushAffectedRef,
  } = ctx;

  // ── Rename ──────────────────────────────────────────────────────────────
  const applyRename = (type, id, oldName, newName) => {
    if (!newName.trim() || newName.trim() === oldName) return;
    // Campaign-clock identity lock (defense in depth): NPC + faction names freeze
    // once the owning settlement is canonized. The detail view hides the rename
    // affordance, but guard the persisting mutation itself so no future caller
    // can rename a canon settlement's NPCs/factions. Settlement-name renames and
    // the draft phase are unaffected.
    if ((type === 'npc' || type === 'faction') && canonPhaseOf(detail?.saveData) === 'canon') return;
    const trimmed = newName.trim();
    const saveId = detail?.saveData?.id;

    // During a change-queue flush the cascade is replayed against the live saves
    // snapshot (savesRef), and its cloud write is DEFERRED to the flush's single
    // atomic commit — only the affected ids are collected here.
    const deferring = flushDeferRef.current;
    const baseSaves = deferring ? savesRef.current : saves;

    // Consolidated settlement-name rename: the dossier header's single inline
    // edit is the ONE place a settlement is renamed. NOT canon-locked; cascades
    // into neighbours' interSettlementRelationships.partnerSettlement.
    if (type === 'settlement') {
      const oldNm = detail?.settlement?.name || oldName;
      const next = baseSaves.map(s => {
        if (s.id === saveId) return { ...s, name: trimmed, settlement: { ...s.settlement, name: trimmed } };
        const isr = s.settlement?.interSettlementRelationships || [];
        if (!isr.some(r => r.partnerSettlement === oldNm)) return s;
        return { ...s, settlement: { ...s.settlement, interSettlementRelationships:
          isr.map(r => r.partnerSettlement === oldNm ? { ...r, partnerSettlement: trimmed } : r) } };
      });
      setSaves(next);
      const modifiedIds = next.filter((s, i) => s !== baseSaves[i]).map(s => s.id);
      if (deferring) modifiedIds.forEach(mid => flushAffectedRef.current.add(mid));
      else persistBatch(next, modifiedIds);
      const upd = next.find(s => s.id === saveId);
      if (upd) setDetail(d => ({ ...d, ...upd, name: trimmed, settlement: upd.settlement, saveData: upd }));
      return;
    }

    let updatedSaves = baseSaves.map(s => {
      if (s.id !== saveId) {
        const needsUpdate = (s.settlement?.interSettlementRelationships||[]).some(r => r.partnerSettlement === detail.settlement.name && (r.partnerName === oldName || r.npcName === oldName || r.partnerFactionName === oldName || r.factionName === oldName));
        if (!needsUpdate) return s;
        return { ...s, settlement: { ...s.settlement, interSettlementRelationships: (s.settlement.interSettlementRelationships||[]).map(r => {
          if (r.partnerSettlement !== detail.settlement.name) return r;
          return { ...r, partnerName: r.partnerName === oldName ? trimmed : r.partnerName, partnerFactionName: r.partnerFactionName === oldName ? trimmed : r.partnerFactionName, npcName: r.npcName === oldName ? trimmed : r.npcName, factionName: r.factionName === oldName ? trimmed : r.factionName };
        }) } };
      }
      const sett = s.settlement;
      const updatedNpcs = type === 'npc' ? (sett.npcs||[]).map(n => n.id === id ? {...n, name:trimmed} : n) : sett.npcs;
      const updatedFactions = type === 'faction' ? (sett.factions||[]).map(f => f.name === oldName ? {...f, name:trimmed} : f) : sett.factions;
      const updatedRels = (sett.relationships||[]).map(r => ({ ...r, npc1Name: r.npc1Name === oldName ? trimmed : r.npc1Name, npc2Name: r.npc2Name === oldName ? trimmed : r.npc2Name }));
      const updatedISR = (sett.interSettlementRelationships||[]).map(r => ({ ...r, npcName: r.npcName === oldName ? trimmed : r.npcName, partnerName: r.partnerName === oldName ? trimmed : r.partnerName, factionName: r.factionName === oldName ? trimmed : r.factionName, partnerFactionName: r.partnerFactionName === oldName ? trimmed : r.partnerFactionName }));
      return { ...s, settlement: { ...sett, npcs: updatedNpcs, factions: updatedFactions, relationships: updatedRels, interSettlementRelationships: updatedISR } };
    });
    setSaves(updatedSaves);
    const modifiedIds = updatedSaves.filter((s, i) => s !== baseSaves[i]).map(s => s.id);
    if (deferring) modifiedIds.forEach(mid => flushAffectedRef.current.add(mid));
    else persistBatch(updatedSaves, modifiedIds);
    const updatedDetailSave = updatedSaves.find(s => s.id === saveId);
    if (updatedDetailSave) setDetail(d => ({ ...d, ...updatedDetailSave, saveData: updatedDetailSave }));

    // Cosmetic-tier change: cascade the rename into every touched save's ai_data
    // blob too. applyCosmeticRename no-ops when a save has no narrative.
    for (const mid of modifiedIds) {
      applyCosmeticRename({ saveId: mid, oldName, newName: trimmed });
    }
  };

  // Is the OPEN settlement bound to a canonized campaign clock? Checked at
  // click time against the live store (canonization can happen mid-session, so
  // a render-time snapshot could go stale). A clock-bound member's edits apply
  // IMMEDIATELY on every other surface — EventComposer's Apply (applyEvent →
  // world-pulse redirect) and the header rename (applyRename) — so link/unlink
  // follow the same rule rather than staging where nothing else stages.
  const openDetailIsClockBound = () => {
    const st = useStore.getState();
    const id = detail?.saveData?.id;
    return !!(id != null
      && typeof st.isSettlementClockBound === 'function'
      && st.isSettlementClockBound(id));
  };

  // ── Link ──────────────────────────────────────────────────────────────────
  // Staging entry point (standalone): QUEUE a link order. Clock-bound: apply now.
  const handleLink = (linkedSave, relType) => {
    const currentId = detail?.saveData?.id;
    if (!currentId || !linkedSave?.id) return;
    if (queueActiveForOpenDetail && !openDetailIsClockBound()) {
      const linkId = linkIdFor(currentId, linkedSave.id);
      queueChange(currentId, {
        type: 'link',
        humanLabel: `Link ${linkedSave.name}`,
        payload: { partnerSaveId: linkedSave.id, relType: relType || 'neutral', linkId, partnerName: linkedSave.name },
      });
      setLinking(false);
      return;
    }
    applyLink(linkedSave, relType);
  };

  // Pure link cascade (immediate apply, or deferred replay during a flush).
  const applyLink = (linkedSave, relType) => {
    const deferring = flushDeferRef.current;
    const baseSaves = deferring ? savesRef.current : saves;
    const definition = relationshipDefinition(relType || 'neutral', detail.saveData.id, linkedSave.id);
    const resolvedRelType = definition.relationshipType;
    const linkId = linkIdFor(detail.saveData.id, linkedSave.id);
    const entryForCurrent = {
      id:linkedSave.id, linkId, name:linkedSave.name, neighbourName:linkedSave.name,
      neighbourTier:linkedSave.tier, tier:linkedSave.tier,
      ...relationshipLinkMetadata(definition, definition.sourceRole),
      description:`Manually linked as ${definition.sourceRole.replace(/_/g,' ')}.`, bidirectional:true,
    };
    const entryForPartner = {
      id:detail.saveData.id, linkId, name:detail.settlement.name,
      neighbourName:detail.settlement.name,
      neighbourTier:detail.settlement.tier||detail.saveData.tier, tier:detail.saveData.tier,
      ...relationshipLinkMetadata(definition, definition.targetRole),
      description:`${detail.settlement.name} is linked as ${definition.targetRole.replace(/_/g,' ')}.`, bidirectional:true,
    };
    const { forA: npcForA, forB: npcForB } = buildInterSettlementNPCs(detail.settlement, linkedSave.settlement, resolvedRelType, linkId);
    const { forA: conflictForA, forB: conflictForB } = generateCrossSettlementConflicts(detail.settlement, linkedSave.settlement, resolvedRelType, linkId);
    // During a flush, replay against the LIVE detail settlement carried in the
    // saves mirror (a prior order may have already mutated this row), so forward
    // references between queued orders resolve.
    const currentBase = deferring
      ? (findSaveById(baseSaves, detail.saveData.id)?.settlement || detail.settlement)
      : detail.settlement;
    // Dedupe the current side the same way the partner side already self-heals
    // (see the `.filter(n => n.id !== …)` / `.filter(r => r.linkId !== linkId)`
    // below): two 'link' orders for the SAME partner in one queue commit — or a
    // re-link of an existing neighbour — must not double-append the entry or
    // stack a second full ISR set. Drop any prior entry/relationships for this
    // linkId (or partner id) before appending the fresh ones. Idempotent.
    const network = [
      ...(currentBase.neighbourNetwork||[]).filter(n => (n.linkId ? n.linkId !== linkId : n.id !== linkedSave.id)),
      entryForCurrent,
    ];
    const ownISR = [
      ...(currentBase.interSettlementRelationships||[]).filter(r => r.linkId !== linkId),
      ...npcForA, ...conflictForA,
    ];
    let updatedSaves = baseSaves.map(s => {
      if (s.id === detail?.saveData?.id) return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } };
      if (s.id === linkedSave.id) return { ...s, settlement: { ...s.settlement, neighbourNetwork: [entryForPartner, ...(s.settlement?.neighbourNetwork||[]).filter(n => n.id !== detail.saveData.id)], interSettlementRelationships: [...(s.settlement?.interSettlementRelationships||[]).filter(r => r.linkId !== linkId), ...npcForB, ...conflictForB] } };
      return s;
    });
    setSaves(updatedSaves);
    setDetail(d => ({ ...d, settlement: { ...d.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } }));
    setNetworkVersion(v => v + 1);
    if (deferring) {
      flushAffectedRef.current.add(detail.saveData.id);
      flushAffectedRef.current.add(linkedSave.id);
    } else {
      setLinking(false);
      persistBatch(updatedSaves, [detail.saveData.id, linkedSave.id]).then((ok) => {
        // Auto-surface the link in the realm: when BOTH settlements are members of
        // the same campaign, rebuild that campaign's regional graph so the new
        // neighbour becomes a channel in the inspector/map without a manual
        // "Discover regional" step. setSaves already wrote the link THROUGH to the
        // store's savedSettlements (setSavedSettlements — the rebuild's source), so
        // this reads it live. Skipped on a failed persist (the store is rolled back
        // there). Non-member links stay dossier-local, as designed. Non-fatal.
        if (ok === false) return;
        try {
          const st = useStore.getState();
          const a = String(detail.saveData.id), b = String(linkedSave.id);
          const shared = (st.campaigns || []).find(c => {
            const ids = (c.settlementIds || []).map(String);
            return ids.includes(a) && ids.includes(b);
          });
          if (shared && typeof st.rebuildCampaignRegionalGraph === 'function') {
            st.rebuildCampaignRegionalGraph(shared.id);
          }
        } catch { /* non-fatal: the manual Discover regional still surfaces it */ }
      });
    }
  };

  // ── Unlink ──────────────────────────────────────────────────────────────────
  // Staging entry point (standalone): QUEUE an unlink order keyed on the STABLE
  // linkId. Clock-bound: apply immediately.
  const removeNeighbour = (idx) => {
    const currentId = detail?.saveData?.id;
    const removedEntry = detail.settlement.neighbourNetwork[idx];
    if (queueActiveForOpenDetail && currentId && !openDetailIsClockBound()) {
      const linkId = removedEntry?.linkId || null;
      const partnerId = removedEntry?.id || null;
      queueChange(currentId, {
        type: 'unlink',
        humanLabel: `Unlink ${removedEntry?.name || 'a neighbour'}`,
        payload: { linkId, partnerId, partnerName: removedEntry?.name || null },
      });
      return;
    }
    applyUnlink({ linkId: removedEntry?.linkId || null, partnerId: removedEntry?.id || null });
  };

  // Pure unlink cascade. Resolves the live network entry by STABLE linkId
  // (preferred) or partner id at call time, so a stage-time index never points
  // at the wrong neighbour after earlier orders mutated the list.
  const applyUnlink = ({ linkId, partnerId }) => {
    const deferring = flushDeferRef.current;
    const baseSaves = deferring ? savesRef.current : saves;
    const currentId = detail?.saveData?.id;
    const currentBase = deferring
      ? (findSaveById(baseSaves, currentId)?.settlement || detail.settlement)
      : detail.settlement;
    const liveNet = currentBase.neighbourNetwork || [];
    const network = liveNet.filter(n => linkId ? n.linkId !== linkId : n.id !== partnerId);
    const ownISR = (currentBase.interSettlementRelationships||[]).filter(r => !linkId || r.linkId !== linkId);
    let updatedSaves = baseSaves.map(s => {
      if (s.id !== currentId) return s;
      return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } };
    });
    if (linkId || partnerId) {
      const partnerSave = partnerId ? findSaveById(updatedSaves, partnerId) : null;
      if (partnerSave) {
        updatedSaves = updatedSaves.map(s => {
          if (s.id !== partnerId) return s;
          return { ...s, settlement: { ...s.settlement, neighbourNetwork: (s.settlement?.neighbourNetwork||[]).filter(n => linkId ? n.linkId !== linkId : n.id !== currentId), interSettlementRelationships: (s.settlement?.interSettlementRelationships||[]).filter(r => !linkId || r.linkId !== linkId) } };
        });
      }
    }
    setSaves(updatedSaves);
    setDetail(d => ({ ...d, settlement: { ...d.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } }));
    setNetworkVersion(v => v + 1);
    const modifiedIds = [currentId];
    if (partnerId) modifiedIds.push(partnerId);
    if (deferring) modifiedIds.forEach(mid => flushAffectedRef.current.add(mid));
    else persistBatch(updatedSaves, modifiedIds);
  };

  // ── Change-queue replay seam ────────────────────────────────────────────────
  // The flush replays each cross-save order through this executor (which mutates
  // local state but DEFERS its cloud write), then calls the batch-commit ONCE to
  // persist the union of affected rows atomically. Re-registered every render so
  // it always closes over the CURRENT detail/saves.
  useEffect(() => {
    registerLinkExecutor(async (order) => {
      flushDeferRef.current = true;
      try {
        // The store owns the active row's EVENT deltas (a prior event order in
        // the same flush already mutated the store settlement). Sync those onto
        // the panel's saves mirror BEFORE this cascade runs, so a link/unlink/
        // rename builds ON TOP of the event-applied settlement rather than
        // clobbering it (the two surfaces mutate divergent mirrors otherwise).
        const live = useStore.getState();
        const activeId = live.activeSaveId;
        if (activeId != null && live.settlement) {
          savesRef.current = savesRef.current.map(s => String(s.id) === String(activeId)
            ? { ...s, settlement: live.settlement, name: live.settlement.name || s.name }
            : s);
          // The deferred cascade reads detail.settlement for the active row, so
          // keep it in lockstep with the event-applied settlement too.
          setDetail(d => (d ? { ...d, settlement: live.settlement } : d));
        }
        if (order?.type === 'rename') {
          const { renameType, targetId, oldName, newName } = order.payload || {};
          applyRename(renameType, targetId, oldName, newName);
        } else if (order?.type === 'link') {
          const { partnerSaveId, relType } = order.payload || {};
          const partnerSave = findSaveById(savesRef.current, partnerSaveId);
          if (!partnerSave) return { ok: false };
          applyLink(partnerSave, relType);
        } else if (order?.type === 'unlink') {
          const { linkId, partnerId } = order.payload || {};
          applyUnlink({ linkId: linkId || null, partnerId: partnerId || null });
        } else {
          return { ok: false };
        }
        // Reconcile the store settlement's neighbour fields from the panel
        // mirror, so a later event order in this same flush builds on the
        // link/unlink network (the two mirrors converge — see
        // syncActiveNeighbourFields). After this the store settlement is
        // authoritative for BOTH the event deltas and the neighbour cascade.
        const aid = useStore.getState().activeSaveId;
        const activeRow = aid != null ? findSaveById(savesRef.current, aid) : null;
        if (activeRow?.settlement) {
          useStore.getState().syncActiveNeighbourFields?.({
            neighbourNetwork: activeRow.settlement.neighbourNetwork,
            interSettlementRelationships: activeRow.settlement.interSettlementRelationships,
          });
        }
        return {
          ok: true,
          settlement: useStore.getState().settlement,
          affectedIds: Array.from(flushAffectedRef.current),
        };
      } catch (e) {
        console.warn('[changeQueue] cascade executor failed:', e);
        return { ok: false };
      } finally {
        flushDeferRef.current = false;
      }
    });
    registerBatchCommit(async (affectedIds) => {
      const ids = Array.from(new Set([...(affectedIds || []), ...flushAffectedRef.current].map(String)));
      flushAffectedRef.current = new Set();
      // After the replay the STORE settlement is authoritative for the active
      // row — it carries the event deltas AND (reconciled in the executor) the
      // link/unlink neighbour cascade. Overlay it + the store's campaignState
      // onto the active row of the panel mirror so the single atomic write
      // carries every surface's change for that settlement; the partner rows
      // already hold their cascade result in the mirror.
      const live = useStore.getState();
      const activeId = live.activeSaveId;
      let mirror = savesRef.current;
      if (activeId != null && live.settlement) {
        const aid = String(activeId);
        const storeRow = (live.savedSettlements || []).find(s => String(s.id) === aid);
        mirror = mirror.map(s => String(s.id) === aid
          ? { ...s, settlement: live.settlement, ...(storeRow?.campaignState ? { campaignState: storeRow.campaignState } : {}), name: live.settlement.name || s.name }
          : s);
        savesRef.current = mirror;
        if (!ids.includes(aid)) ids.push(aid);
      }
      // persistBatch is itself atomic + self-rolling-back (restores local
      // saves/detail for EVERY row on a failed write). Its boolean tells the
      // flush whether to keep the queue and restore the store.
      return persistBatch(mirror, ids);
    });
    return () => { registerLinkExecutor(null); registerBatchCommit(null); };
  });

  return { applyRename, handleLink, removeNeighbour };
}
