import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {FolderPlus, Plus} from 'lucide-react';

import { track, EVENTS } from '../lib/analytics.js';
import { useFunnelEvent } from '../hooks/useFunnelEvent.js';

import {generateCrossSettlementConflicts} from '../generators/crossSettlementConflicts';
import {getAllModifiers} from '../lib/relationshipGraph.js';
import { INK, BODY, SECOND, BORDER, sans, serif_, FS, SP, swatch, PROSE_MAX, PARCH } from './theme.js';
import { useStore } from '../store/index.js';
import { registerLinkExecutor } from '../store/changeQueueSlice.js';
import { navigate } from '../hooks/useRoute.js';
import { viewToPath } from '../lib/routes.js';
import { saves as savesService } from '../lib/saves.js';
import { isCampaignActive } from '../lib/campaigns.js';
import { activeSaveCount, isSaveActive } from '../lib/saveAccess.js';
import { useLibraryBulkSelect } from '../hooks/useLibraryBulkSelect.js';
import { useLibraryLiveWorld } from '../hooks/useLibraryLiveWorld.js';
import {
  relationshipDefinition,
  relationshipLinkMetadata,
} from '../domain/relationships/canonicalRelationship.js';
import { buildInterSettlementNPCs } from '../domain/relationships/neighbourBackLink.js';
import LibraryToolbar, { applyLibraryFilters as _applyLibraryFilters } from './library/LibraryToolbar.jsx';
import SettlementDetail from './SettlementDetail';
import { forkSeedFor } from '../data/sampleSettlements.js';
import { migrateConfig, findSaveById, saveCountBand, dayGapBand, canonPhaseOf, lastEditedMs, hasAiData, computeBulkDelete } from './settlements/helpers.js';
import { SettlementCard } from './settlements/SettlementCard.jsx';
import { CampaignFolder } from './settlements/CampaignFolder.jsx';
import { SampleDashboard } from './settlements/SampleDashboard.jsx';
import SaveQuotaMeter from './settlements/SaveQuotaMeter.jsx';
import BulkActionBar from './settlements/BulkActionBar.jsx';
import { ADVANCE_TIME_NAV_TARGET } from './settlements/advanceTimeTarget.js';
import Button from './primitives/Button.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';

// ── Main Panel ──────────────────────────────────────────────────────────────

export default function SettlementsPanel({ onNavigate, routeId }) {
  const updateConfig = useStore(s => s.updateConfig);
  const maxSaves = useStore(s => s.maxSaves());
  const canSave = useStore(s => s.canSave());
  const authTier = useStore(s => s.auth.tier);
  const isElevated = useStore(s => s.isElevated());
  const authUser = useStore(s => s.auth.user);
  const setSavedSettlements = useStore(s => s.setSavedSettlements);
  const notePersistedSave = useStore(s => s.notePersistedSave);
  const canonizeSavedSettlement = useStore(s => s.canonizeSavedSettlement);
  const applyCosmeticRename = useStore(s => s.applyCosmeticRename);
  const generateSettlement = useStore(s => s.generateSettlement);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const clearLoadedFromSave = useStore(s => s.clearLoadedFromSave);

  // Campaign store
  const campaigns = useStore(s => s.campaigns);
  const canManageCampaigns = authTier === 'premium' || isElevated;
  const activeCampaigns = useMemo(
    () => canManageCampaigns ? campaigns.filter(isCampaignActive) : [],
    [campaigns, canManageCampaigns],
  );
  const createCampaign = useStore(s => s.createCampaign);
  const renameCampaign = useStore(s => s.renameCampaign);
  const deleteCampaign = useStore(s => s.deleteCampaign);
  const toggleCampaignCollapsed = useStore(s => s.toggleCampaignCollapsed);
  const addToCampaign = useStore(s => s.addToCampaign);
  const removeFromCampaign = useStore(s => s.removeFromCampaign);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const advanceCampaignWorld = useStore(s => s.advanceCampaignWorld);
  const requestMapWorkspace = useStore(s => s.requestMapWorkspace);
  const discoverCampaignRegionalChannels = useStore(s => s.discoverCampaignRegionalChannels);
  const setRegionalChannelStatus = useStore(s => s.setRegionalChannelStatus);
  const applyQueuedRegionalImpact = useStore(s => s.applyQueuedRegionalImpact);
  const ignoreQueuedRegionalImpact = useStore(s => s.ignoreQueuedRegionalImpact);
  const resolveRegionalImpact = useStore(s => s.resolveRegionalImpact);
  const advanceCampaignRegionalImpacts = useStore(s => s.advanceCampaignRegionalImpacts);
  const applyAllQueuedRegionalImpacts = useStore(s => s.applyAllQueuedRegionalImpacts);
  const ignoreAllQueuedRegionalImpacts = useStore(s => s.ignoreAllQueuedRegionalImpacts);

  // Which sample is mid-generation (holds the sample.id). Drives the
  // per-card disabled state + transient "Generating…" label so a slow
  // engine load can't be double-clicked into two concurrent forks.
  const [forkingId, setForkingId] = useState(null);
  // Declared here (above forkSample) so the fork auto-save failure path can set
  // it without a forward reference. Shared with the persistBatch recovery row.
  const [persistenceError, setPersistenceError] = useState('');

  /**
   * Fork a sample. "Generate" on a sample card now actually
   * produces the settlement (it used to only pre-fill the wizard and
   * navigate, which read as a no-op). The flow:
   *   1. Load the sample's config into generator state with a
   *      user-suffixed seed so two users forking the same sample get
   *      mechanically-different towns.
   *   2. Run the engine (generateSettlement(seed)) — this populates the
   *      store's `settlement` so the Create view shows the result.
   *   3. If the user can save (signed-in, under cap), persist the fork
   *      to their library immediately — "generate AND save" in one tap.
   *   4. Navigate to the Create view to reveal the dossier.
   * If generation returns null (e.g. an anon/free user forking the city
   * sample, which is tier-gated above town), open the purchase modal so
   * the button always yields a visible result instead of silently dying.
   */
  const forkSample = useCallback(async (sample) => {
    if (!sample?.config || forkingId) return;
    setForkingId(sample.id);
    const seed = forkSeedFor(sample, authUser?.id);
    const forkedConfig = {
      ...migrateConfig(sample.config),
      seed,
      _forkedFromSample: sample.id,
    };
    updateConfig(forkedConfig);

    let result = null;
    try {
      result = await generateSettlement(seed);
    } catch (e) {
      console.error('[SettlementsPanel] fork generate failed:', e);
    }

    if (!result) {
      // Tier-gated (anon/free forking a city) or a generation error.
      // Surface the upgrade path rather than leaving the click inert.
      setForkingId(null);
      setPurchaseModalOpen(true);
      return;
    }

    // Signed-in users: persist the fork to the library straight away so
    // the sample becomes a real save, not just an unsaved draft.
    if (canSave) {
      try {
        // Persist, refresh savedSettlements so the count is correct, then fire
        // the real-save instrumentation (first_save/third_save pricing moments
        // + 'saved' fingerprint). These are awaited deliberately: the fork must
        // land in the library (and the count must be current) BEFORE we navigate
        // to the generate view, so the user doesn't arrive ahead of their own
        // save. A failure here is caught below and only logged — it never blocks
        // the navigation that follows.
        const saveId = await savesService.save({ name: result.name || sample.name, tier: result.tier || sample.tier, settlement: result, config: result._config || forkedConfig });
        await savesService.list().then(setSavedSettlements).catch(() => {});
        notePersistedSave?.(result, saveId);
      } catch (e) {
        // P10: the fork's "generate AND save" promise failed. Surface a
        // recoverable message on the Library (where the missing save is noticed)
        // rather than landing the user on the dossier believing it was saved.
        console.error('[SettlementsPanel] fork auto-save failed:', e);
        setPersistenceError('Your settlement was generated but could not be saved to your library. Open it and use Save to retry.');
      }
    }

    clearLoadedFromSave();
    setForkingId(null);
    onNavigate?.('generate');
    // setPersistenceError is a stable useState setter — omitted from deps
    // (exhaustive-deps exempts setters; it is also declared below this callback).
  }, [
    authUser?.id, updateConfig, generateSettlement, canSave, clearLoadedFromSave,
    onNavigate, setPurchaseModalOpen, forkingId, setSavedSettlements, notePersistedSave,
  ]);

  const [saves, _setSavesLocal] = useState([]);
  // Wrapper: update local state + Zustand store so WorldMap palette stays in sync
  const setSaves = useCallback((newSaves) => {
    _setSavesLocal(newSaves);
    setSavedSettlements(newSaves);
  }, [setSavedSettlements]);
  useEffect(() => {
    return useStore.subscribe(
      state => state.savedSettlements,
      nextSaves => { _setSavesLocal(nextSaves || []); },
    );
  }, []);
  const [savesLoading, setSavesLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [linking, setLinking] = useState(false);
  const [_networkVersion, setNetworkVersion] = useState(0);
  const [editNamesOpen, setEditNamesOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [reactivatingId, setReactivatingId] = useState(null);
  const [reactivationError, setReactivationError] = useState('');

  const allModifiers = useMemo(() => getAllModifiers(saves), [saves]);
  const activeSlotsUsed = useMemo(() => activeSaveCount(saves), [saves]);
  const canReactivateInactive = authTier === 'free' && activeSlotsUsed < Math.min(maxSaves || 0, 3);

  const reloadSaves = useCallback(async () => {
    const loaded = await savesService.list();
    setSaves(loaded);
    return loaded;
  }, [setSaves]);

  useEffect(() => {
    savesService.list()
      .then(loaded => { setSaves(loaded); setSavesLoading(false); })
      .catch(e => { console.error('Failed to load saves:', e); setSavesLoading(false); });
  }, [setSaves]);

  // LIBRARY_VIEWED — once per session, after saves have loaded so the count
  // band is accurate. useFunnelEvent fires on the false→true transition and
  // self-dedupes per session; payload resolves at fire time. Fire-and-forget.
  useFunnelEvent(
    EVENTS.LIBRARY_VIEWED,
    !savesLoading,
    () => ({ save_count_band: saveCountBand(saves.length), campaign_count: campaigns.length }),
  );

  const handleReactivateSave = async (save) => {
    if (!save?.id || !canReactivateInactive) {
      setReactivationError('Choose an inactive settlement after freeing one of your three free slots.');
      return;
    }
    setReactivatingId(save.id);
    setReactivationError('');
    try {
      const result = await savesService.reactivateFreeSettlement(save.id);
      if (result && result.ok === false) {
        setReactivationError(result.reason === 'free_limit_reached'
          ? 'Your three free settlement slots are already active.'
          : 'That settlement could not be reactivated.');
        return;
      }
      await reloadSaves();
    } catch (e) {
      console.error('Reactivation failed:', e);
      setReactivationError('That settlement could not be reactivated.');
    } finally {
      setReactivatingId(null);
    }
  };

  // If the user jumped here from the World Map's "Open" button, the map had
  // already set selectedSettlementId in the store. Honor it by opening the
  // matching save in detail view, then clear the selection so the next
  // navigation to this tab starts on the list.
  const pendingFocusId = useStore(s => s.selectedSettlementId);
  const clearSelectedSettlement = useStore(s => s.clearSelectedSettlementId);
  // Store-watcher effect: opens the detail view when the world map
  // requests a focus. setDetail-in-effect is flagged by React Compiler,
  // but here the effect is a true side-channel (reacting to external
  // store changes), not a render-derived sync — the correct pattern
  // remains an effect until store integration moves to useSyncExternalStore.
  // `detail` and `clearSelectedSettlement` are intentionally omitted
  // from deps: we only want the effect to re-fire when an external
  // focus request changes, not when `detail` becomes truthy (we early-
  // return for that).
  useEffect(() => {
    if (!pendingFocusId || savesLoading || !saves.length || detail) return;
    const match = saves.find(s => s.id === pendingFocusId);
    if (match && isSaveActive(match)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetail({ ...match, saveData: match });
      clearSelectedSettlement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFocusId, savesLoading, saves]);

  // ── URL ↔ detail sync (path routing, /settlements/:id) ───────────────────
  // Two one-directional effects keep the address bar and the open detail
  // view in lockstep without a feedback loop.
  //
  // route → detail: a deep link, refresh, or Back/Forward that lands on
  // /settlements/:id opens the matching save; landing back on /settlements
  // closes whatever was open. Keyed on `routeId` (+ the loaded saves) and
  // deliberately NOT on `detail`, so in-place edits to an open dossier
  // (rename / link / edit) never re-trigger an open or close.
  useEffect(() => {
    if (savesLoading) return;
    const openId = detail?.saveData?.id ?? null;
    if (routeId) {
      if (String(openId) === String(routeId)) return;   // already showing it
      const match = saves.find(s => String(s.id) === String(routeId));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (match && isSaveActive(match)) setDetail({ ...match, saveData: match });
    } else if (openId !== null) {
       
      setDetail(null);
    }
    // `detail` intentionally omitted — see note above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId, savesLoading, saves]);

  // detail → route: opening/closing the detail in-app (list click, world-map
  // focus, Back-to-list, delete) writes the canonical URL. Guarded three ways
  // so it never fights the route:
  //   • skip the initial mount (a deep link's detail is still null then — the
  //     route→detail effect opens it once saves load);
  //   • only act while we're on the /settlements surface (loading a save into
  //     the generator navigates to /create + closes detail in the same tick —
  //     we must not yank the URL back);
  //   • no-op when the URL already matches (covers Back/Forward, where the
  //     browser changed the URL before the route→detail effect closed us).
  const urlSyncReady = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!urlSyncReady.current) { urlSyncReady.current = true; return; }
    if (!window.location.pathname.startsWith('/settlements')) return;
    const openId = detail?.saveData?.id ?? null;
    const desired = openId ? viewToPath('settlements', { id: openId }) : viewToPath('settlements');
    if (window.location.pathname === desired) return;
    if (openId) navigate('settlements', { params: { id: openId } });
    else navigate('settlements');
  }, [detail]);

  const persistBatch = async (updatedSaves, modifiedIds, options = {}) => {
    const previousSaves = saves;
    try {
      setPersistenceError('');
      const updates = modifiedIds
        .map(id => updatedSaves.find(entry => String(entry.id) === String(id)))
        .filter(Boolean);
      await savesService.mutateBatch({
        updates,
        deletes: options.deletes || [],
        creates: options.creates || [],
      });
    } catch (e) {
      console.error('Persist failed:', e);
      setSaves(previousSaves);
      const openId = detail?.saveData?.id;
      const previousDetail = previousSaves.find(entry => String(entry.id) === String(openId));
      if (openId) setDetail(previousDetail ? { ...previousDetail, saveData: previousDetail } : null);
      setPersistenceError('That change could not be saved. The library was restored to its previous state.');
    }
  };

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

    // Consolidated settlement-name rename (UX overhaul Phase 6): the dossier
    // header's single inline edit is the ONE place a settlement is renamed.
    // Settlement renames are NOT canon-locked; they cascade into neighbours'
    // interSettlementRelationships.partnerSettlement.
    if (type === 'settlement') {
      const oldNm = detail?.settlement?.name || oldName;
      const next = saves.map(s => {
        if (s.id === saveId) return { ...s, name: trimmed, settlement: { ...s.settlement, name: trimmed } };
        const isr = s.settlement?.interSettlementRelationships || [];
        if (!isr.some(r => r.partnerSettlement === oldNm)) return s;
        return { ...s, settlement: { ...s.settlement, interSettlementRelationships:
          isr.map(r => r.partnerSettlement === oldNm ? { ...r, partnerSettlement: trimmed } : r) } };
      });
      setSaves(next);
      persistBatch(next, next.filter((s, i) => s !== saves[i]).map(s => s.id));
      const upd = next.find(s => s.id === saveId);
      if (upd) setDetail(d => ({ ...d, ...upd, name: trimmed, settlement: upd.settlement, saveData: upd }));
      return;
    }

    let updatedSaves = saves.map(s => {
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
    const modifiedIds = updatedSaves.filter((s, i) => s !== saves[i]).map(s => s.id);
    persistBatch(updatedSaves, modifiedIds);
    const updatedDetailSave = updatedSaves.find(s => s.id === saveId);
    if (updatedDetailSave) setDetail(d => ({ ...d, ...updatedDetailSave, saveData: updatedDetailSave }));

    // Cosmetic-tier change: cascade the rename into every touched
    // save's ai_data blob too. applyCosmeticRename no-ops when a save has
    // no narrative, so this is cheap for unnarrated saves.
    for (const mid of modifiedIds) {
      applyCosmeticRename({ saveId: mid, oldName, newName: trimmed });
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const deleteConfirmed = (id) => {
    const deletedSave = saves.find(s => s.id === id);
    // SETTLEMENT_DELETED — fired at the confirmed delete, before the save
    // leaves local state. Coarse enums/bands/booleans only.
    if (deletedSave) {
      track(EVENTS.SETTLEMENT_DELETED, {
        canon_phase: canonPhaseOf(deletedSave),
        age_days_band: dayGapBand(lastEditedMs(deletedSave)),
        had_ai_data: hasAiData(deletedSave),
        was_published: !!deletedSave.is_public,
      });
    }
    const deletedNet = deletedSave?.settlement?.neighbourNetwork || [];
    let updated = saves.filter(s => s.id !== id).map(s => {
      const wasLinked = deletedNet.some(n => n.id === s.id || n.linkId);
      if (!wasLinked) return s;
      const cleanNet = (s.settlement?.neighbourNetwork||[]).filter(n => n.id !== id && n.name !== deletedSave?.name);
      const cleanISR = (s.settlement?.interSettlementRelationships||[]).filter(r => r.partnerSettlement !== deletedSave?.settlement?.name && r.partnerSettlement !== deletedSave?.name);
      if (cleanNet.length === (s.settlement?.neighbourNetwork||[]).length && cleanISR.length === (s.settlement?.interSettlementRelationships||[]).length) return s;
      return { ...s, settlement: { ...s.settlement, neighbourNetwork: cleanNet, interSettlementRelationships: cleanISR } };
    });
    setSaves(updated); setDeleteId(null);
    if (detail?.saveData?.id === id) setDetail(null);
    const modifiedIds = updated.filter((s, i) => s !== saves.filter(x => x.id !== id)[i]).map(s => s.id);
    persistBatch(updated, modifiedIds, { deletes: [id] });
  };

  // ── Bulk delete ───────────────────────────────────────────────────────────
  // Remove every selected id in ONE batch (so neighbour cleanup + persistence run
  // against a single coherent snapshot, not N racing closures over a stale list).
  // The pure array work lives in computeBulkDelete; this owns the side effects.
  const bulkDeleteConfirmed = (ids) => {
    const idSet = new Set(ids.map(String));
    for (const ds of saves.filter(s => idSet.has(String(s.id)))) {
      track(EVENTS.SETTLEMENT_DELETED, {
        canon_phase: canonPhaseOf(ds), age_days_band: dayGapBand(lastEditedMs(ds)),
        had_ai_data: hasAiData(ds), was_published: !!ds.is_public,
      });
    }
    const { remaining, modifiedIds } = computeBulkDelete(saves, ids);
    setSaves(remaining);
    if (detail?.saveData?.id && idSet.has(String(detail.saveData.id))) setDetail(null);
    persistBatch(remaining, modifiedIds, { deletes: ids });
  };

  // ── Canonize ──────────────────────────────────────────────────────────────
  // Promote a draft save to canon straight from the library row. The store
  // action owns the mutation + persistence; the savedSettlements subscription
  // (above) refreshes the local list, so the row flips draft → Canon. Guarded
  // (active + draft) at the button; the action also no-ops on already-canon.
  const handleCanonize = useCallback((s) => {
    if (!isSaveActive(s) || canonPhaseOf(s) !== 'draft') return;
    canonizeSavedSettlement(s.id);
  }, [canonizeSavedSettlement]);

  // ── Advance Time ────────────────────────────────────────────────────────────
  // Advance a campaign's world one step, then jump to the World Map's Wizard
  // News panel for that campaign. Reuses the campaign-world pulse (the button is
  // disabled when the world isn't canonized, so the {ok:false} branch is just a
  // defensive guard). The 'news' workspace is requested via a one-shot store
  // signal WorldMap consumes on mount.
  const handleAdvanceCampaignTime = useCallback(async (campaignId) => {
    const result = await advanceCampaignWorld(campaignId, 'one_month');
    if (result && result.ok === false) return; // not canonized / nothing to do
    setActiveCampaign(campaignId);
    // Forward-compatible nav: the Realm hub (Phase 4) repoints ADVANCE_TIME_NAV_TARGET
    // in one place; today it lands on the World Map's Wizard-News workspace.
    requestMapWorkspace(ADVANCE_TIME_NAV_TARGET.workspace);
    onNavigate?.(ADVANCE_TIME_NAV_TARGET.view);
  }, [advanceCampaignWorld, setActiveCampaign, requestMapWorkspace, onNavigate]);

  // ── Link ────────────────────────────────────────────────────────────────
  const handleLink = (linkedSave, relType) => {
    const definition = relationshipDefinition(
      relType || 'neutral',
      detail.saveData.id,
      linkedSave.id,
    );
    const resolvedRelType = definition.relationshipType;
    const linkId = `link_${detail.saveData.id}_${linkedSave.id}`;
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
    const network = [...(detail.settlement.neighbourNetwork||[]), entryForCurrent];
    const ownISR = [...(detail.settlement.interSettlementRelationships||[]), ...npcForA, ...conflictForA];
    let updatedSaves = saves.map(s => {
      if (s.id === detail?.saveData?.id) return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } };
      if (s.id === linkedSave.id) return { ...s, settlement: { ...s.settlement, neighbourNetwork: [entryForPartner, ...(s.settlement?.neighbourNetwork||[]).filter(n => n.id !== detail.saveData.id)], interSettlementRelationships: [...(s.settlement?.interSettlementRelationships||[]).filter(r => r.linkId !== linkId), ...npcForB, ...conflictForB] } };
      return s;
    });
    setSaves(updatedSaves);
    setDetail(d => ({ ...d, settlement: { ...d.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } }));
    setNetworkVersion(v => v + 1); setLinking(false);
    persistBatch(updatedSaves, [detail.saveData.id, linkedSave.id]);
  };

  const removeNeighbour = (idx) => {
    const removedEntry = detail.settlement.neighbourNetwork[idx];
    const linkId = removedEntry?.linkId;
    const network = detail.settlement.neighbourNetwork.filter((_, i) => i !== idx);
    const ownISR = (detail.settlement.interSettlementRelationships||[]).filter(r => !linkId || r.linkId !== linkId);
    let updatedSaves = saves.map(s => {
      if (s.id !== detail?.saveData?.id) return s;
      return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } };
    });
    if (linkId || removedEntry?.id) {
      const partnerId = removedEntry?.id;
      const partnerSave = partnerId ? findSaveById(updatedSaves, partnerId) : null;
      if (partnerSave) {
        updatedSaves = updatedSaves.map(s => {
          if (s.id !== partnerId) return s;
          return { ...s, settlement: { ...s.settlement, neighbourNetwork: (s.settlement?.neighbourNetwork||[]).filter(n => linkId ? n.linkId !== linkId : n.id !== detail?.saveData?.id), interSettlementRelationships: (s.settlement?.interSettlementRelationships||[]).filter(r => !linkId || r.linkId !== linkId) } };
        });
      }
    }
    setSaves(updatedSaves);
    setDetail(d => ({ ...d, settlement: { ...d.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } }));
    setNetworkVersion(v => v + 1);
    const modifiedIds = [detail.saveData.id];
    if (removedEntry?.id) modifiedIds.push(removedEntry.id);
    persistBatch(updatedSaves, modifiedIds);
  };

  // ── Change-queue cascade executor ──────────────────────────────────────────
  // The change-queue flush (store/changeQueueSlice.flushQueue) replays each
  // staged order through its existing executor. Event + rename(settlement-name +
  // canon record) orders run inside the store, but the CROSS-SAVE cascades —
  // the neighbour/ai_data rename cascade and the neighbour link/unlink writes —
  // own React `detail`/`saves` state here and cannot run in the store. We
  // register a thin replay executor that runs the right cascade per order; it is
  // re-registered on every render so it always closes over the CURRENT
  // detail/saves (never a stale snapshot). The cascades persist their own
  // multi-row writes via persistBatch (the atomicity owner for cross-row), so
  // the flush's single-row dossier persist does not conflict.
  //
  // SCOPE NOTE (flagged deviation): only the rename cascade is wired through the
  // queue here. Link / unlink remain immediate-apply (their existing behaviour),
  // because deferring a multi-row link commit safely needs the R4 index-drift
  // fix + dual-row staging, which is the highest-risk slice of this change. The
  // executor refuses link/unlink orders so the flush surfaces a clear error
  // rather than silently corrupting a partner row.
  useEffect(() => {
    registerLinkExecutor(async (order) => {
      try {
        if (order?.type === 'rename') {
          const { renameType, targetId, oldName, newName } = order.payload || {};
          applyRename(renameType, targetId, oldName, newName);
          return { ok: true, settlement: useStore.getState().settlement };
        }
        // Link/unlink are not deferred yet — see SCOPE NOTE above.
        return { ok: false };
      } catch (e) {
        console.warn('[changeQueue] cascade executor failed:', e);
        return { ok: false };
      }
    });
    return () => registerLinkExecutor(null);
  });

  // (The direct-edit path — onEditSettlement, feeding the Roster & Tune
  // correction editor — was removed with that editor: every settlement
  // change now goes through the event catalog, which reconciles via the
  // store's applyEvent path instead.)

  // ── Campaign helpers ────────────────────────────────────────────────────
  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) return;
    createCampaign(newCampaignName);
    setNewCampaignName('');
    setShowNewCampaign(false);
  };

  // Routes a card's "Create a campaign" CTA to the panel's new-campaign input
  // (which autoFocuses on open), so the kebab's no-campaign state has a real path
  // forward instead of a path-less label (deferred item 2).
  // The new-campaign input autoFocuses on open, so the browser scrolls it into
  // view; this just reveals it as the path forward from the card's kebab.
  const openCreateCampaign = useCallback(() => setShowNewCampaign(true), []);

  // The regional-impact store actions are forwarded to CampaignFolder directly
  // (they share the folder's exact (campaignId, …) signature) — the former
  // identity-wrapper useCallbacks added no behaviour and only diluted this file.

  // Library search + sort + filter state. Self-contained
  // here; LibraryToolbar is a controlled component. The filter pipeline
  // (applyLibraryFilters) is a pure function over the saves array.
  const [libraryQuery, setLibraryQuery] = useState('');
  const [librarySort, setLibrarySort] = useState('recent');
  const [libraryFilters, setLibraryFilters] = useState({});

  // Save → owning campaign + the living-world filter context (reuses the same
  // owning-campaign worldState the cards render from — one source of truth).
  const { filterContext } = useLibraryLiveWorld(activeCampaigns);

  const filteredSaves = useMemo(() => {
    return _applyLibraryFilters(saves, {
      query: libraryQuery,
      sort: librarySort,
      filters: libraryFilters,
    }, filterContext);
  }, [saves, libraryQuery, librarySort, libraryFilters, filterContext]);

  // ── Bulk multi-select (state + actions live in the extracted hook) ─────────
  const bulk = useLibraryBulkSelect({
    saves,
    addToCampaign,
    canonizeSavedSettlement,
    bulkDeleteConfirmed,
    isActive: isSaveActive,
    isDraft: (sv) => canonPhaseOf(sv) === 'draft',
  });
  const { selectMode, selectedIds, toggleSelect } = bulk;

  // Set of save ids surviving the active query/filter — the rendered collections
  // below intersect with this so the toolbar isn't inert.
  const filteredIds = useMemo(() => new Set(filteredSaves.map(s => s.id)), [filteredSaves]);

  // Derive assigned/unassigned settlement grouping (from the FILTERED set so the
  // search/sort/filter UI actually changes what renders).
  const assignedIds = useMemo(() => {
    const ids = new Set();
    for (const c of activeCampaigns) for (const id of c.settlementIds) ids.add(id);
    return ids;
  }, [activeCampaigns]);

  const unassignedSaves = useMemo(
    () => filteredSaves.filter(s => !assignedIds.has(s.id)),
    [filteredSaves, assignedIds],
  );

  const onViewSettlement = (s) => {
    if (!isSaveActive(s)) return;
    // SETTLEMENT_REOPENED — the revisit-gap event. Fired at the explicit
    // library open. Coarse props only; never throws / affects control flow.
    track(EVENTS.SETTLEMENT_REOPENED, {
      days_since_edited_band: dayGapBand(lastEditedMs(s)),
      canon_phase: canonPhaseOf(s),
      has_ai_data: hasAiData(s),
      save_count_band: saveCountBand(saves.length),
      via: 'library',
    });
    setDetail({ ...s, saveData: s });
  };

  // ── Detail view ─────────────────────────────────────────────────────────
  if (detail) {
    return <SettlementDetail
      detail={detail} setDetail={setDetail} saves={saves}
      linking={linking} setLinking={setLinking}
      editNamesOpen={editNamesOpen} setEditNamesOpen={setEditNamesOpen}
      handleLink={handleLink} removeNeighbour={removeNeighbour}
      applyRename={applyRename}
    />;
  }

  // ── List view ───────────────────────────────────────────────────────────
  // One shared trust-surface alert treatment: persistenceError and
  // reactivationError both render through this so the two error rows stay
  // visually identical and neither forks a raw-hex border. No dedicated
  // danger-border token exists, so the border falls back to swatch.danger.
  const alertStyle = { padding:'9px 12px', background:swatch.dangerBg, color:swatch.danger, border:`1px solid ${swatch.danger}`, borderRadius:6, fontFamily:sans, fontSize:FS.sm };
  return (
    // Differential rhythm, not a flat 12px stack: the funnel cluster (alerts +
    // header + meter) groups tight via local margins, then a single loose break
    // (SP.xl) drops to the GM's own content so the town list reads as the
    // dominant band rather than another peer in an even stack.
    <Page>
     <div style={{ display:'flex', flexDirection:'column', gap:SP.sm }}>
      {persistenceError && <div role="alert" style={alertStyle}>{persistenceError}</div>}
      {reactivationError && <div role="alert" style={alertStyle}>{reactivationError}</div>}

      {/* Page header — the GM's own content owns the top of their own page; the
          SaveQuotaMeter is demoted to a slim strip below so the funnel frames
          rather than leads, and the eyebrow/title/subtitle give 5-second
          orientation. The single solid-gold primary on the list region —
          'New settlement' — lives here so the first click lands on the GM's
          own creation task. */}
      <PageHeader
        eyebrow="Your settlements"
        title="Library"
        subtitle="Your saved settlements and campaigns. Reopen a town, advance its world, or export a dossier for the table."
        actions={<Button variant="primary" size="md" icon={<Plus size={16}/>} onClick={() => onNavigate?.('generate')}>New settlement</Button>}
      />

      {/* Save-quota meter + funnel header (Phase 3) — COUNT limit, not size.
          'Sign in' routes to the real sign-in flow (was mis-wired to pricing).
          Tight to the header above (one funnel cluster); the loose content
          break lives on the toolbar/list region below, not here. */}
      <SaveQuotaMeter tier={authTier} used={activeSlotsUsed} max={maxSaves}
        onUpgrade={() => onNavigate?.('pricing')} onSignIn={() => onNavigate?.('signin')} />

      {/* Library toolbar (search + sort + Filters▾ + Select). The loose break
          (SP.xl) lives here: the toolbar opens the GM's own content region, so
          the funnel cluster above (header + meter) reads as a separate, lighter
          band and the town list survives the squint as the dominant layer. */}
      {saves.length > 0 && (
        <div style={{ marginTop:SP.xl }}><LibraryToolbar
          query={libraryQuery} setQuery={setLibraryQuery}
          sort={librarySort} setSort={setLibrarySort}
          filters={libraryFilters} setFilters={setLibraryFilters}
          totalCount={saves.length} visibleCount={filteredSaves.length}
          campaigns={activeCampaigns}
          selectMode={selectMode} onToggleSelectMode={bulk.toggleMode}
        /></div>
      )}

      {/* Bulk multi-select action bar + its delete confirm (Phase 3). */}
      {selectMode && saves.length > 0 && (
        <BulkActionBar bulk={bulk} campaigns={activeCampaigns} canManageCampaigns={canManageCampaigns} />
      )}

      {/* The old "Saved Settlements / Save Current Settlement / N of ∞ slots"
          block was removed here — saving a fresh draft lives in the generate
          flow (SaveToLibraryButton on the dossier), and the Settlements tab is
          just the library list now. */}

      {/* New campaign button */}
      {canManageCampaigns && (
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {showNewCampaign ? (
            <div style={{ flex:1, display:'flex', gap:6 }}>
              <input value={newCampaignName} onChange={e => setNewCampaignName(e.target.value)} aria-label="Campaign name"
                onKeyDown={e => { if (e.key === 'Enter') handleCreateCampaign(); if (e.key === 'Escape') setShowNewCampaign(false); }}
                // eslint-disable-next-line jsx-a11y/no-autofocus -- new-campaign field appears on user action; focus lets them type the name immediately
                placeholder="Campaign name..." autoFocus
                style={{ flex:1, padding:'6px 10px', border:`1px solid ${BORDER}`, borderRadius:5, fontSize:FS.sm, fontFamily:sans, outline:'none' }}/>
              <Button variant="primary" size="sm" onClick={handleCreateCampaign} disabled={!newCampaignName.trim()}>Create</Button>
              <Button variant="secondary" size="sm" onClick={() => { setShowNewCampaign(false); setNewCampaignName(''); }}>Cancel</Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setShowNewCampaign(true)} icon={<FolderPlus size={14}/>}>
              New campaign
            </Button>
          )}
        </div>
      )}

      {savesLoading ? (
        // Skeleton card rows (P9): first paint matches the eventual list shape so
        // the layout doesn't pop when saves resolve. PARCH-tinted, card-height
        // rhythm; role=status + the SR-only text announce load completion.
        <div role="status" aria-busy="true" aria-label="Loading saves" style={{ marginTop:SP.xl, display:'flex', flexDirection:'column', gap:SP.sm }}>
          {[0,1,2].map(i => (
            <div key={i} aria-hidden="true" style={{ height:76, background:PARCH, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${BORDER}`, borderRadius:7 }} />
          ))}
        </div>
      ) : saves.length === 0 ? (
        // Show sample dossiers instead of a bare empty state.
        // Eliminates the "you have nothing — go figure it out" first run.
        <div style={{ marginTop:SP.xl }}><SampleDashboard onFork={forkSample} forkingId={forkingId} /></div>
      ) : filteredSaves.length === 0 ? (
        // The library has saves, but none survive the active search/filters.
        // Offer a recovery CTA rather than a silent dead-end (no inert list).
        // Flat PARCH placeholder surface — distinct from the CARD-filled real
        // cards so the surface itself carries the elevation difference (P5).
        <div style={{ padding:'28px 16px', textAlign:'center', background:PARCH, borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', gap:SP.sm }}>
          <div style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK }}>No settlements match your search or filters</div>
          <div style={{ maxWidth:PROSE_MAX, fontFamily:sans, fontSize:FS.sm, color:BODY }}>Try a broader term, or clear the active filters to see all {saves.length} saved settlement{saves.length === 1 ? '' : 's'}.</div>
          <Button variant="secondary" size="sm" onClick={() => { setLibraryQuery(''); setLibraryFilters({}); }}>Clear filters</Button>
        </div>
      ) : (
        // Group-of-groups rhythm: campaign folders and the unassigned pile are
        // distinct chunks (loose SP.lg between), while the cards within each
        // chunk stay tight (SP.xs, below).
        <div style={{ display:'flex', flexDirection:'column', gap:SP.lg }}>
          {/* Campaign folders */}
          {campaigns.map(campaign => {
            const campSaves = canManageCampaigns && isCampaignActive(campaign)
              ? campaign.settlementIds.map(id => saves.find(s => s.id === id))
                  .filter(Boolean).filter(s => filteredIds.has(s.id))
              : [];
            return (
              <CampaignFolder key={campaign.id} campaign={campaign} settlements={campSaves}
                allModifiers={allModifiers} onViewSettlement={onViewSettlement}
                deleteId={deleteId} setDeleteId={setDeleteId} deleteConfirmed={deleteConfirmed}
                campaigns={activeCampaigns} addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
                onDeleteCampaign={deleteCampaign} onRenameCampaign={renameCampaign}
                toggleCollapsed={toggleCampaignCollapsed}
                onDiscoverRegional={discoverCampaignRegionalChannels}
                onConfirmRegionalChannel={(campaignId, channelId) => setRegionalChannelStatus(campaignId, channelId, 'confirmed')}
                onApplyRegionalImpact={applyQueuedRegionalImpact}
                onIgnoreRegionalImpact={ignoreQueuedRegionalImpact}
                onResolveRegionalImpact={resolveRegionalImpact}
                onAdvanceRegionalImpacts={advanceCampaignRegionalImpacts}
                onApplyAllRegionalImpacts={applyAllQueuedRegionalImpacts}
                onIgnoreAllRegionalImpacts={ignoreAllQueuedRegionalImpacts}
                onReactivate={handleReactivateSave}
                canReactivate={canReactivateInactive}
                reactivatingId={reactivatingId}
                canManageCampaigns={canManageCampaigns}
                onCanonize={handleCanonize}
                onAdvanceTime={handleAdvanceCampaignTime}
                onCreateCampaign={openCreateCampaign}
                onNavigate={onNavigate}
                worldCanonized={!!campaign.worldState?.canonizedAt}
                selectMode={selectMode}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}/>
            );
          })}

          {/* Unassigned settlements — a real <h2> (was a styled div) for
              5-second orientation + screen-reader landmarking. The heading
              renders unconditionally so the common no-campaign library (a bare
              pile of saves) still has a layer-cake anchor over the cards:
              'Settlements (n)' when there are no campaigns, 'Unassigned (n)'
              when they exist. Quiet eyebrow style keeps it from adding a fourth
              dominance level. */}
          {unassignedSaves.length > 0 && (
            <section>
              {/* The list's one structural anchor — lifted to FS.xs + SECOND
                  (ink-800, clears AA; MUTED at FS.xxs failed 4.5:1 and was the
                  smallest text on the surface). The quiet eyebrow read is kept via
                  uppercase + letterspacing, not via a failing color (P7). It now
                  sits at a consistent dominance tier with the campaign-folder name,
                  so the two sibling group headings read as one peer level (P4). */}
              <h2 style={{ margin:'0 0 6px', paddingLeft:4, fontSize:FS.xs, fontWeight:700, color:SECOND, textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:sans }}>
                {campaigns.length > 0 ? 'Unassigned' : 'Settlements'} ({unassignedSaves.length})
              </h2>
              {/* Card grid reflow (P12 + cross-surface consistency with
                  GalleryList): cards reflow to 2-3 columns on a wide monitor and
                  collapse to one readable column on a tablet, instead of a single
                  full-1200 column with View/Delete stranded ~1100px from the name.
                  A grid also breaks the equal-weight single-file card-wall (P5);
                  the semantic left rail stays the per-card scan anchor. */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap:SP.sm }}>
                {unassignedSaves.map(s => (
                  <SettlementCard key={s.id} s={s} allModifiers={allModifiers}
                    onView={onViewSettlement} deleteId={deleteId} setDeleteId={setDeleteId}
                    deleteConfirmed={deleteConfirmed} campaigns={activeCampaigns}
                    addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
                    currentCampaignId={null}
                    onReactivate={handleReactivateSave}
                    canReactivate={canReactivateInactive}
                    reactivatingId={reactivatingId}
                    onCanonize={handleCanonize}
                    onAdvanceTime={handleAdvanceCampaignTime}
                    onCreateCampaign={openCreateCampaign}
                    onNavigate={onNavigate}
                    canManageCampaigns={canManageCampaigns}
                    selectMode={selectMode}
                    selected={selectedIds.has(s.id)}
                    onToggleSelect={toggleSelect}/>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
     </div>
    </Page>
  );
}
