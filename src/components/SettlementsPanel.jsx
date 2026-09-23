import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FolderPlus, Plus } from 'lucide-react';

import { track, EVENTS } from '../lib/analytics.js';
import { useFunnelEvent } from '../hooks/useFunnelEvent.js';

import {generateCrossSettlementConflictsDeterministic} from '../generators/crossSettlementConflicts';
import {getAllModifiers} from '../lib/relationshipGraph.js';
import { campaignMembershipIndex } from '../domain/relationships/effectiveNeighbours.js';
import { INK, BODY, BORDER, sans, serif_, FS, SP, swatch, PROSE_MAX, PARCH } from './theme.js';
import { useStore } from '../store/index.js';
import { navigate } from '../hooks/useRoute.js';
import { viewToPath } from '../lib/routes.js';
import { saves as savesService } from '../lib/saves.js';
import { t } from '../copy/index.js';
import { isCampaignActive } from '../lib/campaigns.js';
import { activeSaveCount, isSaveActive } from '../lib/saveAccess.js';
import {
  relationshipDefinition,
  relationshipLinkMetadata,
} from '../domain/relationships/canonicalRelationship.js';
import { buildInterSettlementNPCs } from '../domain/relationships/neighbourBackLink.js';
import { useLibraryBulkSelect } from '../hooks/useLibraryBulkSelect.js';
import { useLibraryLiveWorld } from '../hooks/useLibraryLiveWorld.js';
import LibraryToolbar, { applyLibraryFilters as _applyLibraryFilters } from './library/LibraryToolbar.jsx';
import SettlementDetail from './SettlementDetail';
import { forkConfigFor, forkSeedFor } from '../data/sampleSettlements.js';
import { GENERATION_INTENT_SAMPLE_FORK } from '../lib/generationIntent.js';
import { forkIdentity } from '../lib/anonForkSalt.js';
import {
  migrateConfig, findSaveById, saveCountBand, dayGapBand,
  canonPhaseOf, lastEditedMs, hasAiData,
  withSettlementChanges, withFactionRenamed, withNpcRenamed,
} from './settlements/helpers.js';
import { CampaignFolder } from './settlements/CampaignFolder.jsx';
import {
  createLibraryBatchPersister,
  createLibraryDeleteHandlers,
} from './settlements/libraryDeleteHandlers.js';
import { SampleDashboard } from './settlements/SampleDashboard.jsx';
import SaveQuotaMeter from './settlements/SaveQuotaMeter.jsx';
import BulkActionBar from './settlements/BulkActionBar.jsx';
import { useCampaignAdvance } from './settlements/useCampaignAdvance.js';
import { useOwnerScopedSaves } from '../hooks/useOwnerScopedSaves.js';
import Button from './primitives/Button.jsx';
import RefusalNotice from './primitives/RefusalNotice.jsx';
import { REFUSAL_REASONS } from '../lib/refusalReasons.js';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import UnassignedLedger from './settlements/UnassignedLedger.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { chromeFontSize } from '../design/proseScale.js';

// ── Main Panel ──────────────────────────────────────────────────────────────

export default function SettlementsPanel({ onNavigate, routeId }) {
  const mobile = useIsMobile();
  const updateConfig = useStore(s => s.updateConfig);
  const setInstitutionToggles = useStore(s => s.setInstitutionToggles);
  const setCategoryToggles = useStore(s => s.setCategoryToggles);
  const setGoodsToggles = useStore(s => s.setGoodsToggles);
  const setServiceToggles = useStore(s => s.setServiceToggles);
  const setSettlement = useStore(s => s.setSettlement);
  const setLoadedFromSave = useStore(s => s.setLoadedFromSave);
  const maxSaves = useStore(s => s.maxSaves());
  const canSave = useStore(s => s.canSave());
  const authTier = useStore(s => s.auth.tier);
  const isElevated = useStore(s => s.isElevated());
  const authUser = useStore(s => s.auth.user);
  const applyCosmeticRename = useStore(s => s.applyCosmeticRename);
  const generateSettlement = useStore(s => s.generateSettlement);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const clearLoadedFromSave = useStore(s => s.clearLoadedFromSave);
  // The lane records WHY it refused; this surface only renders it (and, for the ONE
  // reason that has a purchase door, opens that door as well).
  const lastRefusal = useStore(s => s.lastRefusal);
  const clearRefusal = useStore(s => s.clearRefusal);
  // The fork door's half of the create chokepoint (ODQ §934.14). Read the same
  // way the three sibling doors read it (BuyThisDossier, SaveToLibraryButton,
  // ConstructionPanel) so there is one access pattern to recognise.
  const setActiveSaveId = useStore(s => s.setActiveSaveId);

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
  const getCampaignMembershipBlock = useStore(s => s.getCampaignMembershipBlock);
  const getSettlementDeletionBlock = useStore(s => s.getSettlementDeletionBlock);
  // W4a — Library living surface: canonize-from-list, per-campaign advance-time.
  const canonizeSavedSettlement = useStore(s => s.canonizeSavedSettlement);
  const setActiveCampaign = useStore(s => s.setActiveCampaign);
  const advanceCampaignWorld = useStore(s => s.advanceCampaignWorld);
  const discoverCampaignRegionalChannels = useStore(s => s.discoverCampaignRegionalChannels);
  const setRegionalChannelStatus = useStore(s => s.setRegionalChannelStatus);
  const applyQueuedRegionalImpact = useStore(s => s.applyQueuedRegionalImpact);
  const ignoreQueuedRegionalImpact = useStore(s => s.ignoreQueuedRegionalImpact);
  const resolveRegionalImpact = useStore(s => s.resolveRegionalImpact);
  const advanceCampaignRegionalImpacts = useStore(s => s.advanceCampaignRegionalImpacts);
  const applyAllQueuedRegionalImpacts = useStore(s => s.applyAllQueuedRegionalImpacts);
  const ignoreAllQueuedRegionalImpacts = useStore(s => s.ignoreAllQueuedRegionalImpacts);

  const onLoad = (data) => {
    if (data && !isSaveActive(data)) return;
    // Prefer the settlement's RAW pre-resolution config (random sentinels
    // intact) over the save's stored config: legacy saves only carry the
    // RESOLVED config, which pinned 'random' settings to their first roll
    // after "Apply Saved Configuration & Regenerate".
    const rawConfig = data.settlement?._config || data.config;
    if (rawConfig) updateConfig(migrateConfig(rawConfig));
    if (data.institutionToggles) setInstitutionToggles(data.institutionToggles);
    if (data.categoryToggles) setCategoryToggles(data.categoryToggles);
    if (data.goodsToggles) setGoodsToggles(data.goodsToggles);
    if (data.servicesToggles) setServiceToggles(data.servicesToggles);
    if (data.settlement) { setSettlement(data.settlement); setLoadedFromSave({ name: data.settlement.name, tier: data.settlement.tier }); }
    onNavigate?.('generate');
  };

  // Which sample is mid-generation (holds the sample.id). Drives the
  // per-card disabled state + transient "Generating…" label so a slow
  // engine load can't be double-clicked into two concurrent forks.
  const [forkingId, setForkingId] = useState(null);

  /**
   * Fork a Tier 8.2 sample. "Generate" on a sample card now actually
   * produces the settlement (it used to only pre-fill the wizard and
   * navigate, which read as a no-op). The flow:
   *   1. Load the sample's config, minus its seed, into generator state
   *      (forkConfigFor: a seed is the generation argument, never a
   *      config key).
   *   2. Run the engine with a user-suffixed seed (generateSettlement(seed))
   *      so two users forking the same sample get mechanically-different
   *      towns; this populates the
   *      store's `settlement` so the Create view shows the result.
   *   3. If the user can save (signed-in, under cap), persist the fork
   *      to their library immediately — "generate AND save" in one tap —
   *      and BIND the returned id as the active save, so the row the tap
   *      just created is the one the rest of the app is looking at.
   *   4. Navigate to the Create view to reveal the dossier.
   * ⛔ A NULL IS NOT ALWAYS A PRICE (adversarial review of the second wave). This
   * handler answered EVERY null with the purchase modal, on the guess that a fork can
   * only fail by tier — so an anonymous reader whose day's allowance was spent, or
   * anyone whose engine chunk failed to load, was shown a checkout for a problem money
   * does not solve. The lane names its reason; only `tier` has a door worth selling, and
   * every other reason is SAID where the reader clicked.
   */
  const forkSample = useCallback(async (sample) => {
    if (!sample?.config || forkingId) return;
    clearRefusal?.();
    setForkingId(sample.id);
    // ⛔ forkIdentity, NEVER A BARE auth id — the same rule the create landing's fork
    // door obeys, and the reason it is one function rather than two spellings. A
    // signed-out reader has no id, and the constant 'anon' that used to stand in for
    // one is the same constant in every browser, so two anonymous visitors forked
    // byte-identical towns (REVIEW-P F1); a signed-in id becomes a short DIGEST of
    // the WHOLE id, because truncating it to eight characters collided two real
    // accounts (noticed 8) while the id itself is too long to be an address.
    const seed = forkSeedFor(sample, forkIdentity(authUser?.id));
    // The seed is the generation argument, never a config key (forkConfigFor).
    const forkedConfig = {
      ...migrateConfig(forkConfigFor(sample)),
      _forkedFromSample: sample.id,
    };
    updateConfig(forkedConfig);

    let result = null;
    try {
      // ⛔ A FORK OF A CURATED SAMPLE IS A CURATED SEED, NOT A FREE GENERATION (owner
      // ruling, ODQ §934.24(b)) — and this door was the one that had not been told.
      // generate/FoundingWorlds.jsx has passed the intent since the ruling landed; the
      // Library's identical fork did not, so the SAME click spent the day's allowance on
      // one surface and was exempt on the other. `intentOf` fails closed, so the
      // exemption has to be asked for by its exact name, which is why the omission was
      // silent. The intent rides the ARGUMENT and never the persisted config: `config` is
      // persisted, so an exemption stamped there would outlive the fork that earned it.
      result = await generateSettlement(seed, { intent: GENERATION_INTENT_SAMPLE_FORK });
    } catch (e) {
      console.error('[SettlementsPanel] fork generate failed:', e);
    }

    if (!result) {
      setForkingId(null);
      // ⛐ READ THE REASON OFF THE STORE, NOT OFF A SELECTOR CLOSURE. The gate recorded
      // it DURING the await above, so the `lastRefusal` this callback closed over is the
      // value from before the click. `getState()` is the estate's idiom for exactly this
      // (App.jsx's front-door effects read it the same way).
      const refused = useStore.getState().lastRefusal;
      // The size door is the only one a purchase opens. Everything else — the day's
      // allowance, a failed engine chunk, a tab that outlived a deploy — is rendered by
      // the notice below, which is already mounted above the cards the reader clicked.
      if (refused?.reason === REFUSAL_REASONS.TIER) setPurchaseModalOpen(true);
      return;
    }

    // Signed-in users: persist the fork to the library straight away so
    // the sample becomes a real save, not just an unsaved draft.
    if (canSave) {
      try {
        // V2 DEFAULT-MINT (create chokepoint 2/3): a forked settlement is a NEW settlement —
        // mint layout v2 onto its fresh blob (non-clobbering; a fork carries no mapEdits).
        // Lazy import keeps first-paint byte-identical.
        const { newSettlementMapEdits } = await import('../domain/townMap/mapEdits.js');
        const minted = result.mapEdits ? result : { ...result, mapEdits: newSettlementMapEdits() };
        const newSaveId = await savesService.save({
          name: minted.name || sample.name,
          tier: minted.tier || sample.tier,
          settlement: minted,
          config: minted._config || forkedConfig,
        });
        // ⭐ BIND THE NEW ROW THROUGH THE SAME DOOR THE OTHER THREE CREATE
        // CHOKEPOINTS USE (ODQ §934.14). This was the fourth, and the only one
        // that saved without binding: it wrote a real library row and left
        // `activeSaveId` null, so the world the keeper had just forked went on
        // being an UNBOUND draft. Everything keyed to the active save then read
        // the wrong answer about it — the exit dialog calls a saved world
        // unsaved, the AI lifecycle's `activeSaveId === saveId` guards never
        // match the row, the durable-purchase rung does not advance, and a draft
        // timeline made before the fork is never handed over to the new row.
        //
        // `setActiveSaveId` → `bindActiveSaveId` also CLAIMS the world for the
        // account (claimSettlementForAccount), which matters on the anonymous
        // path even though this branch is gated on `canSave`: a visitor who
        // signs in mid-generation reaches here with `draftOrigin` already
        // 'account' from the generate action, and the claim keeps the two
        // writers agreeing rather than depending on which ran last.
        //
        // No try/catch shape changes around it: `bindActiveSaveId` swallows its
        // own persist rejection and reports it, so the promise it returns cannot
        // reject and the discarded return value is not a leak.
        if (typeof setActiveSaveId === 'function') setActiveSaveId(newSaveId);
      } catch (e) {
        console.error('[SettlementsPanel] fork auto-save failed:', e);
      }
    }

    clearLoadedFromSave();
    setForkingId(null);
    onNavigate?.('generate');
  }, [
    authUser?.id, updateConfig, generateSettlement, canSave,
    clearLoadedFromSave, onNavigate, setPurchaseModalOpen, forkingId,
    setActiveSaveId, clearRefusal,
  ]);

  const [deleteId, setDeleteId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [linking, setLinking] = useState(false);
  const [_networkVersion, setNetworkVersion] = useState(0);
  const [editNamesOpen, setEditNamesOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [reactivatingId, setReactivatingId] = useState(null);
  const [reactivationError, setReactivationError] = useState(null);
  const [persistenceError, setPersistenceError] = useState(null);
  const resetOwnerView = useCallback(() => {
    setDetail(null);
    setDeleteId(null);
    setPersistenceError(null);
  }, []);
  const reportLibraryLoadError = useCallback(error => {
    console.error('Failed to load saves:', error);
    setPersistenceError(t('errors.libraryLoadFail'));
  }, []);
  const { reloadSaves, saves, savesLoading, setSaves } = useOwnerScopedSaves(
    authUser?.id,
    { onOwnerBoundary: resetOwnerView, onLoadError: reportLibraryLoadError },
  );

  // Co-campaign settlements are implicit Neutral neighbours by default (owner
  // order 2026-07-22). From ALL active campaigns (not the premium-gated
  // `activeCampaigns`) so the Network Effects cascade stays ungated for every tier.
  const neighbourCampaignOf = useMemo(() => campaignMembershipIndex(campaigns.filter(isCampaignActive)), [campaigns]);
  const allModifiers = useMemo(() => getAllModifiers(saves, 4, { campaignOf: neighbourCampaignOf }), [saves, neighbourCampaignOf]);
  const activeSlotsUsed = useMemo(() => activeSaveCount(saves), [saves]);
  const canReactivateInactive = authTier === 'free' && activeSlotsUsed < Math.min(maxSaves || 0, 3);

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
      setReactivationError(t('errors.reactivateNeedsSlot'));
      return;
    }
    setReactivatingId(save.id);
    setReactivationError(null);
    try {
      const result = await savesService.reactivateFreeSettlement(save.id);
      if (result && result.ok === false) {
        setReactivationError(result.reason === 'free_limit_reached'
          ? t('errors.reactivateSlotsFull')
          : t('errors.reactivateFail'));
        return;
      }
      await reloadSaves();
    } catch (e) {
      console.error('Reactivation failed:', e);
      setReactivationError(t('errors.reactivateFail'));
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
    if (pendingFocusId == null || savesLoading || !saves.length || detail) return;
    const match = saves.find(s => String(s.id) === String(pendingFocusId));
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

  const persistBatch = createLibraryBatchPersister({
    ownerId: authUser?.id ?? null, previousSaves: saves,
    detail, setDetail, setSaves, setPersistenceError,
  });

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
    // Owner queue #14: BOTH arms route ENTIRELY through the ONE converged writer
    // (domain/factionRename.js), which the store lane calls too, so a rename
    // means the same thing on every lane and can only regress in one place. The
    // generic rewrites this replaced were both too broad and too narrow: too
    // broad because they renamed a neighbouring TOWN sharing the name, and too
    // narrow because neither walked `factions[].members[]` — the second home a
    // character is stored in, and a separate object on every RELOADED save.
    //
    // `id` addresses the record the detail view offered; the cascade itself
    // joins by NAME, because the stored joins it heals (relationships[].npc1Name,
    // member chips) are display names rather than ids.
    const updatedSaves = saves.map(save => {
      const isHost = String(save.id) === String(saveId);
      return type === 'faction'
        ? withFactionRenamed(save, isHost, detail.settlement.name, oldName, trimmed)
        : withNpcRenamed(save, isHost, detail.settlement.name, oldName, trimmed);
    });
    setSaves(updatedSaves);
    const modifiedIds = updatedSaves.filter((s, i) => s !== saves[i]).map(s => s.id);
    persistBatch(updatedSaves, modifiedIds);
    const updatedDetailSave = findSaveById(updatedSaves, saveId);
    if (updatedDetailSave) setDetail(d => ({ ...d, ...updatedDetailSave, saveData: updatedDetailSave }));

    // AI-2: cosmetic-tier change — cascade the rename into every touched
    // save's ai_data blob too. applyCosmeticRename no-ops when a save has
    // no narrative, so this is cheap for unnarrated saves.
    for (const mid of modifiedIds) {
      applyCosmeticRename({ saveId: mid, oldName, newName: trimmed });
    }
  };

  const { deleteConfirmed, bulkDeleteConfirmed } = createLibraryDeleteHandlers({
    ownerId: authUser?.id ?? null, saves, detail, setDetail, setDeleteId,
    setSaves, setPersistenceError, persistBatch,
  });

  // ── Link ────────────────────────────────────────────────────────────────
  const handleLink = (linkedSave, relType) => {
    const definition = relationshipDefinition(relType || 'neutral', detail.saveData.id, linkedSave.id);
    const resolvedRelType = definition.relationshipType;
    const linkId = `link_${detail.saveData.id}_${linkedSave.id}`;
    const currentNeighbourEntry = {
      id: linkedSave.id, linkId,
      name: linkedSave.name, neighbourName: linkedSave.name,
      neighbourTier: linkedSave.tier, tier: linkedSave.tier,
      ...relationshipLinkMetadata(definition, definition.sourceRole),
      description: `Manually linked as ${definition.sourceRole.replace(/_/g, ' ')}.`,
      bidirectional: true,
    };
    const partnerNeighbourEntry = {
      id: detail.saveData.id, linkId,
      name: detail.settlement.name, neighbourName: detail.settlement.name,
      neighbourTier: detail.settlement.tier || detail.saveData.tier,
      tier: detail.saveData.tier,
      ...relationshipLinkMetadata(definition, definition.targetRole),
      description: `${detail.settlement.name} is linked as ${definition.targetRole.replace(/_/g, ' ')}.`,
      bidirectional: true,
    };
    const { forA: currentNpcs, forB: partnerNpcs } = buildInterSettlementNPCs(
      detail.settlement, linkedSave.settlement, resolvedRelType, linkId,
    );
    const { forA: currentConflicts, forB: partnerConflicts } =
      generateCrossSettlementConflictsDeterministic(
        detail.settlement, linkedSave.settlement, resolvedRelType, linkId,
      );
    const currentNetwork = [...(detail.settlement.neighbourNetwork || []), currentNeighbourEntry];
    const currentRelationships = [
      ...(detail.settlement.interSettlementRelationships || []), ...currentNpcs, ...currentConflicts,
    ];
    const currentChanges = { neighbourNetwork: currentNetwork, interSettlementRelationships: currentRelationships };
    const currentSaveId = detail?.saveData?.id;
    const updatedSaves = saves.map(save => {
      if (String(save.id) === String(currentSaveId)) {
        return withSettlementChanges(save, currentChanges);
      }
      if (String(save.id) === String(linkedSave.id)) {
        const existingNetwork = save.settlement?.neighbourNetwork || [];
        const partnerNetwork = [partnerNeighbourEntry, ...existingNetwork
          .filter(neighbour => String(neighbour.id) !== String(currentSaveId))];
        const existingRelationships = save.settlement?.interSettlementRelationships || [];
        const partnerRelationships = [...existingRelationships
          .filter(relationship => relationship.linkId !== linkId), ...partnerNpcs, ...partnerConflicts];
        return withSettlementChanges(
          save, { neighbourNetwork: partnerNetwork, interSettlementRelationships: partnerRelationships },
        );
      }
      return save;
    });
    setSaves(updatedSaves);
    setDetail(currentDetail => withSettlementChanges(currentDetail, currentChanges));
    setNetworkVersion(version => version + 1);
    setLinking(false);
    persistBatch(updatedSaves, [detail.saveData.id, linkedSave.id]);
  };

  const removeNeighbour = (index) => {
    const removedEntry = detail.settlement.neighbourNetwork[index];
    const linkId = removedEntry?.linkId;
    const currentNetwork = detail.settlement.neighbourNetwork
      .filter((_, neighbourIndex) => neighbourIndex !== index);
    const currentRelationships = (detail.settlement.interSettlementRelationships || [])
      .filter(relationship => !linkId || relationship.linkId !== linkId);
    const currentChanges = { neighbourNetwork: currentNetwork, interSettlementRelationships: currentRelationships };
    let updatedSaves = saves.map(save => {
      if (String(save.id) !== String(detail?.saveData?.id)) return save;
      return withSettlementChanges(save, currentChanges);
    });
    if (linkId || removedEntry?.id) {
      const partnerId = removedEntry?.id;
      const partnerSave = partnerId ? findSaveById(updatedSaves, partnerId) : null;
      if (partnerSave) {
        updatedSaves = updatedSaves.map(save => {
          if (String(save.id) !== String(partnerId)) return save;
          const partnerNetwork = (save.settlement?.neighbourNetwork || []).filter(
            neighbour => linkId
              ? neighbour.linkId !== linkId
              : String(neighbour.id) !== String(detail?.saveData?.id),
          );
          const partnerRelationships = (save.settlement?.interSettlementRelationships || [])
            .filter(relationship => !linkId || relationship.linkId !== linkId);
          return withSettlementChanges(save, {
            neighbourNetwork: partnerNetwork, interSettlementRelationships: partnerRelationships,
          });
        });
      }
    }
    setSaves(updatedSaves);
    setDetail(currentDetail => withSettlementChanges(currentDetail, currentChanges));
    setNetworkVersion(version => version + 1);
    const modifiedIds = [detail.saveData.id];
    if (removedEntry?.id) modifiedIds.push(removedEntry.id);
    persistBatch(updatedSaves, modifiedIds);
  };

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
  // forward instead of a path-less label.
  const openCreateCampaign = useCallback(() => setShowNewCampaign(true), []);

  // ── Canonize (from the library row kebab) ─────────────────────────────────
  // Promote a draft save to canon straight from the list. The store action owns
  // the mutation + persistence; the savedSettlements subscription refreshes the
  // local list, so the row flips draft → Canon. Guarded (active + draft); the
  // action also no-ops on already-canon.
  const handleCanonize = useCallback((s) => {
    if (!isSaveActive(s) || canonPhaseOf(s) !== 'draft') return;
    canonizeSavedSettlement(s.id);
  }, [canonizeSavedSettlement]);

  // ── Advance Time (per campaign, from the list) ────────────────────────────
  // Premium (Cartographer) gate lives on the card. The handler + its typed-refusal
  // surface live in useCampaignAdvance (experience-product-fit-2).
  const { advanceError, handleAdvanceCampaignTime } = useCampaignAdvance({
    advanceCampaignWorld, setActiveCampaign, onNavigate,
  });

  const handleApplyRegionalImpact = useCallback((campaignId, impactId) => {
    applyQueuedRegionalImpact(campaignId, impactId);
  }, [applyQueuedRegionalImpact]);

  const handleIgnoreRegionalImpact = useCallback((campaignId, impactId) => {
    ignoreQueuedRegionalImpact(campaignId, impactId);
  }, [ignoreQueuedRegionalImpact]);

  const handleResolveRegionalImpact = useCallback((campaignId, impactId) => {
    resolveRegionalImpact(campaignId, impactId);
  }, [resolveRegionalImpact]);

  const handleAdvanceRegionalImpacts = useCallback((campaignId, ticks) => {
    advanceCampaignRegionalImpacts(campaignId, ticks);
  }, [advanceCampaignRegionalImpacts]);

  const handleApplyAllRegionalImpacts = useCallback((campaignId) => {
    applyAllQueuedRegionalImpacts(campaignId);
  }, [applyAllQueuedRegionalImpacts]);

  const handleIgnoreAllRegionalImpacts = useCallback((campaignId) => {
    ignoreAllQueuedRegionalImpacts(campaignId);
  }, [ignoreAllQueuedRegionalImpacts]);

  // P108 / E-6 — Library search + sort + filter state. Self-contained
  // here; LibraryToolbar is a controlled component. The filter pipeline
  // (applyLibraryFilters) is a pure function over the saves array.
  const [libraryQuery, setLibraryQuery] = useState('');
  const [librarySort, setLibrarySort] = useState('recent');
  const [libraryFilters, setLibraryFilters] = useState({});

  // Save → owning campaign + the living-world filter context (reuses the same
  // owning-campaign worldState the cards render from — one source of truth, no
  // divergent recompute) for the "At war" / campaign filters.
  const { filterContext } = useLibraryLiveWorld(activeCampaigns);

  /**
   * ⛔ THE SHELF'S OWN ROWS — what the library ACTUALLY holds, before any search term or
   * chip narrows it. `applyLibraryFilters` hides EM-F1's phantom counterparties at the
   * HEAD of its pipeline (a phantom is an off-stage prop that persists as a save, not a
   * settlement the DM keeps), so the raw `saves` array is not the library: it is the
   * library plus rows no viewer can ever reach. Two readers used to take that raw array
   * and so answered about rows the shelf does not show:
   *
   *   • `totalCount` — the toolbar's DENOMINATOR. With a phantom in it the toolbar read
   *     "4 of 5" over a shelf of four, and the minimal face offered to search a
   *     settlement that is not there. A count is a sentence the GM reads.
   *   • `useLibraryBulkSelect`'s corpus — the rows a bulk action resolves a selection
   *     against. No rendered card can put a phantom into that selection TODAY, because
   *     the cards come off `filteredSaves`; this half therefore closes the HABITAT
   *     rather than a reachable bug, which is the honest description of it. What the
   *     bulk actions can reach is now exactly what the shelf can offer.
   *
   * The query, the sort's chips and the campaign context are deliberately NOT applied
   * here: a denominator that moved with the filters would make "N of M" read "M of M"
   * forever, and the numerator (`filteredSaves`) is the one that answers the chips.
   *
   * ⛔ U50 — AND THE RENDER BELOW ASKS THE SAME QUESTION SIX TIMES, so it reads the same
   * answer six times. Every `saves.length` in the returned tree was a reader of "how much
   * library is there", and each one was answering over rows the viewer cannot reach:
   *
   *   • THE EMPTY-SHELF SENTENCE (its gate AND its count). A library holding NOTHING BUT
   *     phantoms used to render "No settlements match your search or filters … clear the
   *     active filters to see all 1" — over a shelf with no filter on and nothing to
   *     clear. Curing only the count would have produced "see all 0", which is a worse
   *     sentence, so the gate moves with it.
   *   • THE FIRST-RUN GATE. Once the sentence's gate reads the shelf, a phantom-only
   *     library falls past it — and would land on the card region with no cards, a blank
   *     panel. Read off the shelf, that library IS empty, so it gets the SAMPLE DASHBOARD
   *     an empty library has always got. This is the same reading EM-F1b already made of
   *     the quota (`activeSaveCount`): a phantom is the estate's row, not the user's.
   *   • THE TOOLBAR'S OWN GATE and the bulk bar's, for the same reason: a search box over
   *     an empty shelf offering to "Search 0 settlements…" is the blank panel again.
   *   • THE MINIMAL FACE. `minimal` keyed on the RAW length, so four real saves and two
   *     phantoms drew the full six-control toolbar over a four-town shelf. THE THRESHOLD
   *     VALUE (5) IS THE OWNER'S AND IS UNTOUCHED (legibility wave, 2026-07-22) — only
   *     the count it is compared against moved.
   *
   * `filteredSaves` stays the numerator, and the two library WRITERS
   * (`createLibraryDeleteHandlers`, `createLibraryBatchPersister`) keep the raw array, as
   * U23 left them: they persist against the WHOLE library, phantoms included.
   */
  const shelfSaves = useMemo(() => _applyLibraryFilters(saves), [saves]);

  const filteredSaves = useMemo(() => {
    return _applyLibraryFilters(saves, {
      query: libraryQuery,
      sort: librarySort,
      filters: libraryFilters,
    }, filterContext);
  }, [saves, libraryQuery, librarySort, libraryFilters, filterContext]);

  // ── Bulk multi-select (state + actions live in the extracted hook) ─────────
  const bulk = useLibraryBulkSelect({
    // The shelf's rows, never the raw array — a bulk action may only resolve a
    // selection against what the shelf can offer. See `shelfSaves` above.
    saves: shelfSaves,
    addToCampaign,
    canonizeSavedSettlement,
    bulkDeleteConfirmed,
    getCampaignMembershipBlock,
    getSettlementDeletionBlock,
    isActive: isSaveActive,
    isDraft: (sv) => canonPhaseOf(sv) === 'draft',
  });
  const { selectMode, selectedIds, toggleSelect } = bulk;

  // Derive assigned/unassigned settlement grouping (from the FILTERED set so the
  // search/sort/filter UI actually changes what renders).
  const assignedIds = useMemo(() => {
    const ids = new Set();
    for (const c of activeCampaigns) for (const id of c.settlementIds || []) ids.add(String(id));
    return ids;
  }, [activeCampaigns]);

  const unassignedSaves = useMemo(
    () => filteredSaves.filter(s => !assignedIds.has(String(s.id))),
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
    }, { subjectId: s.id });
    setDetail({ ...s, saveData: s });
  };

  // ── Detail view ─────────────────────────────────────────────────────────
  if (detail) {
    return <SettlementDetail
      detail={detail} setDetail={setDetail} saves={saves} setSaves={setSaves}
      linking={linking} setLinking={setLinking}
      editNamesOpen={editNamesOpen} setEditNamesOpen={setEditNamesOpen}
      handleLink={handleLink} removeNeighbour={removeNeighbour}
      applyRename={applyRename} onLoad={onLoad}
    />;
  }

  // ── List view ───────────────────────────────────────────────────────────
  // One shared trust-surface alert treatment: persistenceError and
  // reactivationError both render through this so the two error rows stay
  // visually identical and neither forks a raw-hex border. No dedicated
  // danger-border token exists, so the border falls back to swatch.danger.
  const alertStyle = { padding:'9px 12px', background:swatch['#FAF8F4'], color:swatch.danger, border:`1px solid ${swatch.danger}`, fontFamily:sans, fontSize:FS.sm };
  return (
    // Differential rhythm, not a flat 12px stack: the funnel cluster (alerts +
    // header + meter) groups tight via local margins, then a single loose break
    // (SP.xl) drops to the GM's own content so the town list reads as the
    // dominant band rather than another peer in an even stack.
    <Page>
     <div style={{ display:'flex', flexDirection:'column', gap:SP.sm }}>
      {persistenceError && <div role="alert" style={alertStyle}><strong>Library:</strong> {persistenceError}</div>}
      {reactivationError && <div role="alert" style={alertStyle}><strong>Reactivation:</strong> {reactivationError}</div>}
      {advanceError && <div role="alert" style={alertStyle}><strong>Advance:</strong> {advanceError}</div>}

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

      {/* Save-quota meter + funnel header (W4a) — COUNT limit, never a size cap.
          The cap (max) is the store's maxSaves() (free floor 3, premium ∞) — read,
          not hardcoded. 'Sign in' routes to the sign-in flow; 'Upgrade' to pricing.
          Tight to the header above (one funnel cluster); the loose content
          break lives on the toolbar/list region below, not here. */}
      <SaveQuotaMeter tier={authTier} used={activeSlotsUsed} max={maxSaves}
        onUpgrade={() => onNavigate?.('pricing')} onSignIn={() => onNavigate?.('signin')} />

      {/* Library toolbar (search + sort + Filters▾ + Select). The loose break
          (SP.xl) lives here: the toolbar opens the GM's own content region, so
          the funnel cluster above (header + meter) reads as a separate, lighter
          band and the town list survives the squint as the dominant layer. */}
      {shelfSaves.length > 0 && (
        <div style={{ marginTop:SP.xl }}><LibraryToolbar
          query={libraryQuery} setQuery={setLibraryQuery}
          sort={librarySort} setSort={setLibrarySort}
          filters={libraryFilters} setFilters={setLibraryFilters}
          totalCount={shelfSaves.length} visibleCount={filteredSaves.length}
          // The THRESHOLD (5) is the owner's and is unchanged; only the count it reads is
          // the shelf's now, so a phantom cannot draw the full face over a small library.
          minimal={shelfSaves.length < 5}
          selectMode={selectMode} onToggleSelectMode={bulk.toggleMode}
        /></div>
      )}

      {/* Bulk multi-select action bar + its delete confirm (W4a). */}
      {selectMode && shelfSaves.length > 0 && (
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
                style={{ flex:1, padding:'6px 10px', border:`1px solid ${BORDER}`, fontSize:FS.sm, fontFamily:sans, outline:'none' }}/>
              <Button variant="primary" size="sm" onClick={handleCreateCampaign} disabled={!newCampaignName.trim()}>Create</Button>
              <Button variant="secondary" size="sm" onClick={() => { setShowNewCampaign(false); setNewCampaignName(''); }}>Cancel</Button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              <Button variant="secondary" size="sm" onClick={() => setShowNewCampaign(true)} icon={<FolderPlus size={14}/>} style={{ alignSelf:'flex-start' }}>New campaign</Button>
              <span style={{ fontSize:chromeFontSize(FS.xs, mobile), color:BODY, fontFamily:sans }}>Group towns into one world that advances together.</span>
            </div>
          )}
        </div>
      )}

      {savesLoading ? (
        // Skeleton card rows: first paint matches the eventual list shape so
        // the layout doesn't pop when saves resolve. PARCH-tinted, card-height
        // rhythm; role=status announces the polite loading live region.
        <div role="status" aria-live="polite" aria-busy="true" aria-label="Loading saves" style={{ marginTop:SP.xl, display:'flex', flexDirection:'column', gap:SP.sm }}>
          {[0,1,2].map(i => (
            <div key={i} aria-hidden="true" style={{ height:76, background:PARCH, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${BORDER}` }} />
          ))}
        </div>
      ) : (shelfSaves.length === 0 && campaigns.length === 0) ? (
        // Tier 8.2 — show sample dossiers instead of a bare empty state.
        // Eliminates the "you have nothing — go figure it out" first run.
        // Gated on campaigns too: a campaign-first user (campaigns made before
        // any settlement is saved) falls through to the campaign folders below
        // instead of seeing a "you have nothing" sample.
        <div style={{ marginTop:SP.xl }}>
          {/* The reason, above the cards the reader clicked — FoundingWorlds' idiom, and
              the only thing that was missing here when a fork came back null. */}
          <RefusalNotice refusal={lastRefusal} style={{ marginBottom: SP.md }} />
          <SampleDashboard onFork={forkSample} forkingId={forkingId} tier={authTier} />
        </div>
      ) : (filteredSaves.length === 0 && shelfSaves.length > 0) ? (
        // The library has saves, but none survive the active search/filters.
        // Offer a recovery CTA rather than a silent dead-end (no inert list).
        // Flat PARCH placeholder surface — distinct from the CARD-filled real
        // cards so the surface itself carries the elevation difference.
        <div style={{ padding:'28px 16px', textAlign:'center', background:PARCH, display:'flex', flexDirection:'column', alignItems:'center', gap:SP.sm }}>
          <h2 style={{ margin:0, fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK }}>No settlements match your search or filters</h2>
          <div style={{ maxWidth:PROSE_MAX, fontFamily:sans, fontSize:FS.sm, color:BODY }}>Try a broader term, or clear the active filters to see all {shelfSaves.length} saved settlement{shelfSaves.length === 1 ? '' : 's'}.</div>
          <Button variant="secondary" size="sm" onClick={() => { setLibraryQuery(''); setLibraryFilters({}); }}>Clear filters</Button>
        </div>
      ) : (
        // Group-of-groups rhythm: campaign folders and the unassigned pile are
        // distinct chunks (loose SP.lg between), while the cards within each
        // chunk stay tight.
        <div style={{ display:'flex', flexDirection:'column', gap:SP.lg }}>
          {/* Campaign folders */}
          {campaigns.map(campaign => {
            const campaignIds = new Set((campaign.settlementIds || []).map(String));
            const campSaves = canManageCampaigns && isCampaignActive(campaign)
              // Filter the already-sorted Library sequence by normalized
              // membership, so folders honor the selected sort and mixed
              // numeric/string ids cannot duplicate into "Unassigned".
              ? filteredSaves.filter(s => campaignIds.has(String(s.id)))
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
                onApplyRegionalImpact={handleApplyRegionalImpact}
                onIgnoreRegionalImpact={handleIgnoreRegionalImpact}
                onResolveRegionalImpact={handleResolveRegionalImpact}
                onAdvanceRegionalImpacts={handleAdvanceRegionalImpacts}
                onApplyAllRegionalImpacts={handleApplyAllRegionalImpacts}
                onIgnoreAllRegionalImpacts={handleIgnoreAllRegionalImpacts}
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
              when they exist. Quiet eyebrow style (FS.xs + SECOND — clears AA
              where MUTED at FS.xxs failed 4.5:1) keeps it from adding a fourth
              dominance level. */}
          {unassignedSaves.length > 0 && (
            <UnassignedLedger
              saves={unassignedSaves} campaignsExist={campaigns.length > 0}
              allModifiers={allModifiers} onView={onViewSettlement}
              deleteId={deleteId} setDeleteId={setDeleteId} deleteConfirmed={deleteConfirmed}
              campaigns={activeCampaigns} addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
              onReactivate={handleReactivateSave} canReactivate={canReactivateInactive} reactivatingId={reactivatingId}
              onCanonize={handleCanonize} onAdvanceTime={handleAdvanceCampaignTime} onCreateCampaign={openCreateCampaign}
              onNavigate={onNavigate} canManageCampaigns={canManageCampaigns}
              selectMode={selectMode} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
          )}
        </div>
      )}
     </div>
    </Page>
  );
}
