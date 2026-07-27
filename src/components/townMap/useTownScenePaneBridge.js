/**
 * Product bridge for the lazy settlement scene.
 *
 * The viewer speaks only canonical semantic records. This adapter mirrors a
 * pick into the existing map cards and connects explicit inspector actions to
 * the dossier Workbench and realm Herald without teaching the renderer about
 * routing or store topology.
 */

import { useCallback } from 'react';
import { navigate } from '../../hooks/useRoute.js';
import { useStore } from '../../store/index.js';
import { useDossierEntities } from '../dossier/DossierEntityContext.jsx';
import { heraldDestinationForSceneAction } from '../map/heraldCommandNavigation.js';
import { writeHeraldCommandSession } from '../map/heraldCommandSession.js';
import { mirrorTownSceneSelection } from './townSceneSelection.js';

const SCENE_HERALD_ACTION = 'inspect-scene-provenance';

export function useTownScenePaneBridge({
  settlement,
  mapEdits,
  worldState,
  regionalGraph,
  audience,
  editing,
  commitEdits,
  model,
  wrapperRef,
  districtPayload,
  setPinned,
  authoringSaveId,
  selectView,
  activeLens,
  mapAnalytics,
  selectedNodeId,
  canUndoEdits,
  canRedoEdits,
  undoEdits,
  redoEdits,
}) {
  const { navigateToEntity } = useDossierEntities();
  // R-5b (owner queue #17): the portrait's quality CEILING is a device preference,
  // not settlement state, so it lives in the persisted displayPrefs bag and reaches
  // the renderer as props from this bridge. That keeps the viewer store-free (its
  // stated contract) while ending the re-clamp-every-open cost on weak machines.
  const sceneQualityMode = useStore((state) => state.displayPrefs?.sceneQualityMode ?? null);
  const setSceneQualityMode = useStore((state) => state.setSceneQualityMode);
  const heraldCampaignId = useStore((state) => (
    authoringSaveId == null
      ? null
      : state.getCampaignForSettlement?.(authoringSaveId)?.id ?? null
  ));
  const heraldSessionId = heraldCampaignId == null
    ? null
    : String(heraldCampaignId);

  const openWorkbench = useCallback((selection) => {
    const reference = selection?.workbenchRef
      || selection?.semantic?.workbenchRef
      || selection?.canonicalRef
      || selection?.semantic?.canonicalRef;
    const id = reference?.id;
    if (!id) return;
    if (reference.kind === 'settlement') {
      useStore.getState().setSelectedSettlementId?.(id);
      navigate('settlements', { params: { id: String(id) } });
      return;
    }
    navigateToEntity(id);
  }, [navigateToEntity]);

  const openHerald = useCallback((selection) => {
    const semantic = selection?.semantic;
    const sceneId = typeof selection?.sceneId === 'string'
      ? selection.sceneId.trim()
      : typeof semantic?.sceneId === 'string'
        ? semantic.sceneId.trim()
        : '';
    if (!sceneId || heraldCampaignId == null || !heraldSessionId) return;

    const store = useStore.getState();
    if (authoringSaveId != null) store.setSelectedSettlementId?.(authoringSaveId);

    // The scene action promises Herald context, not merely the Realm route.
    // Persist the bounded exact selection before the route transition, then make
    // its canonical campaign active. Scene/canonical/provenance ids remain their
    // own vocabularies; no external id is promoted into a Herald story focus.
    const destination = heraldDestinationForSceneAction(SCENE_HERALD_ACTION);
    writeHeraldCommandSession(heraldSessionId, {
      open: true,
      section: destination.section,
      sceneContext: {
        action: SCENE_HERALD_ACTION,
        settlementId: authoringSaveId == null ? null : String(authoringSaveId),
        sceneId,
        entityKind: semantic?.entityKind,
        label: semantic?.label,
        canonicalRef: selection?.canonicalRef || semantic?.canonicalRef || null,
        provenanceRefs: selection?.provenanceRefs || semantic?.provenanceRefs || [],
        provenance: selection?.provenance || [],
      },
    });
    store.setActiveCampaign?.(heraldCampaignId);
    navigate('realm');
  }, [authoringSaveId, heraldCampaignId, heraldSessionId]);

  const onSelect = (sceneId, payload) => {
    const semantic = payload && Object.prototype.hasOwnProperty.call(payload, 'semantic')
      ? payload.semantic
      : payload;
    mirrorTownSceneSelection({
      sceneIdOrSemantic: sceneId,
      explicitSemantic: semantic,
      model,
      settlement,
      wrapper: wrapperRef.current,
      districtPayload,
      setPinned,
    });
  };

  const onViewChange = (nextMode) => {
    if (!selectView(nextMode, activeLens)) return;
    if (nextMode === 'portrait3d') mapAnalytics.fireOnce('portrait3d');
    else if (nextMode === 'panorama') mapAnalytics.fireOnce('panorama');
  };

  return {
    onViewChange,
    sceneProps: {
      settlement,
      mapEdits,
      worldState,
      regionalGraph,
      audience,
      canEdit: editing,
      onCommitEdits: commitEdits,
      onSelect,
      onOpenWorkbench: audience === 'dm' ? openWorkbench : null,
      onOpenHerald: audience === 'dm' && heraldSessionId ? openHerald : null,
      selectedNodeId: selectedNodeId || undefined,
      canUndo: canUndoEdits,
      canRedo: canRedoEdits,
      onUndo: undoEdits,
      onRedo: redoEdits,
      initialQualityMode: sceneQualityMode,
      onQualityModeChange: setSceneQualityMode,
    },
  };
}
