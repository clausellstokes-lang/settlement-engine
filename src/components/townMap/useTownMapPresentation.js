/**
 * Own the shared presentation state for Plan, Panorama, and Portrait.
 *
 * This hook is the product seam between canonical settlement truth and its
 * replaceable views. It authorizes the audience before deriving a model,
 * manages device-local view memory, gates authoring, and supplies one durable
 * map-edit writer. WebGL quality/camera state deliberately lives below this
 * seam because none of it belongs in settlement persistence.
 */

import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useFlag } from '../../lib/flags.js';
import { readLastMapView, writeLastMapView } from '../../lib/lastMapView.js';
import {
  detectTownSceneCapability,
  resolveTownSceneViewPolicy,
  TOWN_SCENE_VIEW_ID,
} from '../../lib/townScene/viewPolicy.js';
import {
  projectSettlementForTownMapAudience,
  projectTownMapDressForAudience,
  projectTownMapModelForAudience,
} from '../../domain/townMap/audienceProjection.js';
import {
  buildTownMapModel,
  resolveMapDress,
} from '../../domain/townMap/index.js';
import {
  normalizeMapEdits,
  readMapEdits,
} from '../../domain/townMap/mapEdits.js';

const MAP_EDIT_HISTORY_LIMIT = 50;

/**
 * @param {{
 *   sourceSettlement: any,
 *   audience: 'dm'|'player'|'public',
 *   canEdit: boolean,
 *   desktop: boolean,
 *   saveId: string|number|null,
 *   worldState: any,
 *   regionalGraph: any,
 *   applyMapEdit?: ((saveId:string|number, edits:any) => void)|null,
 * }} input
 */
export function useTownMapPresentation({
  sourceSettlement,
  audience,
  canEdit,
  desktop,
  saveId,
  worldState,
  regionalGraph,
  applyMapEdit,
}) {
  const sceneEnabled = useFlag('settlementScene3d');
  const scenePromoted = useFlag('settlementScene3dDefault');
  const settlement = useMemo(
    () => projectSettlementForTownMapAudience(sourceSettlement, audience),
    [sourceSettlement, audience],
  );

  const [sceneCapability] = useState(() => detectTownSceneCapability());
  const [sceneSessionDisabled, setSceneSessionDisabled] = useState(false);
  const initialView = resolveTownSceneViewPolicy({
    enabled: sceneEnabled,
    promoted: scenePromoted,
    explicitView: readLastMapView(saveId)?.view ?? null,
    capability: sceneCapability,
  }).view;

  const settlementKey = settlement?.id ?? settlement?._seed ?? null;
  const presentationKey = `${settlementKey ?? 'draft'}:${saveId ?? 'unsaved'}:${audience}`;
  const [seededKey, setSeededKey] = useState(presentationKey);
  const [mapEdits, setMapEdits] = useState(() => readMapEdits(settlement));
  const [editHistory, setEditHistory] = useState({ undo: [], redo: [] });
  const [lensOverride, setLensOverride] = useState(null);
  const [viewMode, setViewMode] = useState(initialView);

  // Match the pane's established adjust-state-on-identity-change convention:
  // reset before commit, so no frame of the prior settlement is displayed.
  if (seededKey !== presentationKey) {
    const nextMapEdits = readMapEdits(settlement);
    setSeededKey(presentationKey);
    setMapEdits(nextMapEdits);
    setEditHistory({ undo: [], redo: [] });
    setLensOverride(null);
    setSceneSessionDisabled(false);
    setViewMode(initialView);
  }

  const authoringSaveId = audience === 'dm' ? saveId : null;
  const editing = audience === 'dm'
    && Boolean(canEdit)
    && authoringSaveId != null
    && desktop;
  const sceneSelectable = Boolean(sceneEnabled && sceneCapability.available);
  const presentedViewMode = (
    viewMode === TOWN_SCENE_VIEW_ID
    && (!sceneSelectable || sceneSessionDisabled)
  ) ? 'plan' : viewMode;

  const persistEdits = useCallback((normalized) => {
    setMapEdits(normalized);
    if (authoringSaveId != null && typeof applyMapEdit === 'function') {
      applyMapEdit(authoringSaveId, normalized);
    }
  }, [authoringSaveId, applyMapEdit]);

  const commitEdits = useCallback((next) => {
    const normalized = normalizeMapEdits(next);
    // Normalization establishes canonical key/order shapes, so this small
    // serialization is a stable no-op check and avoids fake undo entries.
    if (JSON.stringify(mapEdits) === JSON.stringify(normalized)) return false;

    setEditHistory((history) => ({
      undo: [...history.undo, mapEdits].slice(-MAP_EDIT_HISTORY_LIMIT),
      redo: [],
    }));
    persistEdits(normalized);
    return true;
  }, [mapEdits, persistEdits]);

  const undoEdits = useCallback(() => {
    if (editHistory.undo.length === 0) return false;
    const previous = editHistory.undo[editHistory.undo.length - 1];
    setEditHistory({
      undo: editHistory.undo.slice(0, -1),
      redo: [...editHistory.redo, mapEdits].slice(-MAP_EDIT_HISTORY_LIMIT),
    });
    persistEdits(previous);
    return true;
  }, [editHistory, mapEdits, persistEdits]);

  const redoEdits = useCallback(() => {
    if (editHistory.redo.length === 0) return false;
    const next = editHistory.redo[editHistory.redo.length - 1];
    setEditHistory({
      undo: [...editHistory.undo, mapEdits].slice(-MAP_EDIT_HISTORY_LIMIT),
      redo: editHistory.redo.slice(0, -1),
    });
    persistEdits(next);
    return true;
  }, [editHistory, mapEdits, persistEdits]);

  const model = useMemo(
    () => projectTownMapModelForAudience(
      buildTownMapModel(settlement, mapEdits),
      audience,
    ),
    [settlement, mapEdits, audience],
  );
  const dress = useMemo(
    () => projectTownMapDressForAudience(
      resolveMapDress(settlement, worldState, regionalGraph),
      audience,
    ),
    [settlement, worldState, regionalGraph, audience],
  );

  const selectView = useCallback((nextView, lens) => {
    if (nextView === TOWN_SCENE_VIEW_ID) {
      if (!sceneSelectable) return false;
      setSceneSessionDisabled(false);
    }
    setViewMode(nextView);
    writeLastMapView(saveId, { view: nextView, lens });
    return true;
  }, [saveId, sceneSelectable]);

  const rememberLens = useCallback((lens) => {
    writeLastMapView(saveId, { view: presentedViewMode, lens });
  }, [saveId, presentedViewMode]);

  const fallbackToPlan = useCallback(() => {
    // Automatic recovery never overwrites an explicit stored preference.
    setSceneSessionDisabled(true);
    setViewMode('plan');
  }, []);

  const handleSceneFallback = useCallback((detail, lens) => {
    // Runtime fallback is intentionally silent in production, but a developer
    // needs the exact fail-closed reason when validating a new scene compiler,
    // worker, or renderer against real generated settlements.
    if (import.meta.env.DEV) {
      console.warn('[TownScene] returning to Plan', JSON.stringify({
        reason: detail?.reason || 'unknown',
        recoverable: detail?.recoverable !== false,
        error: detail?.error?.message || null,
      }));
    }
    if (detail?.reason === 'user-selected-plan') {
      // A direct choice is a real preference, not recovery state. Route it
      // through the normal selector so the Plan survives remount/navigation.
      return selectView('plan', lens);
    }
    fallbackToPlan();
    return true;
  }, [fallbackToPlan, selectView]);

  const canUndoEdits = editHistory.undo.length > 0;
  const canRedoEdits = editHistory.redo.length > 0;

  return {
    settlement,
    settlementKey,
    mapEdits,
    setMapEdits,
    lensOverride,
    setLensOverride,
    model,
    dress,
    authoringSaveId,
    editing,
    sceneSelectable,
    presentedViewMode,
    commitEdits,
    canUndoEdits,
    canRedoEdits,
    undoEdits,
    redoEdits,
    selectView,
    rememberLens,
    handleSceneFallback,
  };
}
