import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useIsMobile from '../../../hooks/useIsMobile.js';
import './townSceneA11y.css';
import {
  prepareTownSceneCompileInput,
} from '../../../domain/townScene/sceneCompileInput.js';
import * as adaptiveQuality from '../../../lib/townScene/adaptiveQuality.js';
import {
  townSceneCache,
  townSceneCacheKey,
} from '../../../lib/townScene/sceneCache.js';
import { createTownSceneWorkerClient } from '../../../lib/townScene/townSceneWorkerClient.js';
import { detectTownSceneCapability } from '../../../lib/townScene/viewPolicy.js';
import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  GOLD_SOFT,
  INK,
} from '../../theme.js';
import TownSceneInspector from './TownSceneInspector.jsx';
import TownSceneLivingSummary from './TownSceneLivingSummary.jsx';
import TownSceneOrphanOverrides from './TownSceneOrphanOverrides.jsx';
import TownSceneSemanticList from './TownSceneSemanticList.jsx';
import TownSceneViewerControls from './TownSceneViewerControls.jsx';
import { townSceneDefaultCameraPreset } from './townSceneRuntimePolicy.js';
import { useTownSceneAdaptiveQuality } from './useTownSceneAdaptiveQuality.js';

/**
 * Build/certification sentinel. It must remain inside this lazy product module
 * and outside the first-paint closure.
 */
export const TOWN_SCENE_3D_LAZY_SENTINEL = 'settlementforge:town-scene-3d:lazy-v1';

// The renderer is a second lazy boundary inside the already-lazy Map/Portrait
// feature. Loading semantic/product chrome never implies loading Three.
const TownSceneCanvas = lazy(() => import('./TownSceneCanvas.jsx'));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

class SceneRuntimeBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

const surfaceStyle = {
  border: `1px solid ${BORDER}`,
  borderRadius: 0,
  background: CARD_ALT,
  overflow: 'hidden',
  position: 'relative',
  minHeight: 420,
};

/**
 * Lazy production settlement portrait.
 *
 * Callback contracts:
 * - onSelect(sceneId, { semantic, source })
 * - onFallback({ reason, recoverable, error? })
 * - onCommitEdits(nextMapEdits, { kind, action, anchor, sceneId })
 * - onUndo() / onRedo() use the parent-owned, persist-through commit history.
 * - onOpenWorkbench({ sceneId, semantic, canonicalRef })
 * - onOpenHerald({ sceneId, semantic, canonicalRef, provenanceRefs, provenance })
 * - initialQualityMode / onQualityModeChange(mode) — the DEVICE quality ceiling,
 *   owned above this seam (store `displayPrefs.sceneQualityMode`, persisted) so a
 *   user on a weak machine clamps once instead of on every portrait open. The
 *   viewer stays store-free: it SEEDS its local mode from the prop and reports
 *   each pick upward. Both are optional — with neither supplied the control is a
 *   plain session-local ceiling, exactly as before.
 */
export default function SettlementScene3D({
  settlement,
  mapEdits = null,
  worldState = null,
  regionalGraph = null,
  audience = 'public',
  canEdit = false,
  onCommitEdits,
  onSelect,
  onFallback,
  selectedNodeId,
  onOpenWorkbench,
  onOpenHerald,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  capabilityOverride = null,
  initialQualityMode = null,
  onQualityModeChange = null,
}) {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const [detectedCapability] = useState(() => (
    capabilityOverride || detectTownSceneCapability()
  ));
  const capability = capabilityOverride || detectedCapability;
  const [manifest, setManifest] = useState(null);
  const [manifestDigest, setManifestDigest] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [geometryStage, setGeometryStage] = useState('manifest');
  const [status, setStatus] = useState('Preparing the settlement portrait.');
  const [localSelection, setLocalSelection] = useState(null);
  const [cameraRequest, setCameraRequest] = useState(null);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  // Seeded once from the persisted device preference, then owned locally. The
  // clamp lives HERE because OVERRIDE_MODES is this lane's frozen vocabulary: the
  // eager store holds an opaque string, so an unknown or corrupted persisted value
  // renders as 'auto' rather than reaching the renderer.
  const [qualityMode, setQualityMode] = useState(() => (
    adaptiveQuality.OVERRIDE_MODES.includes(initialQualityMode) ? initialQualityMode : 'auto'
  ));
  const [contextEpoch, setContextEpoch] = useState(0);
  const [contextLost, setContextLost] = useState(false);
  const fallbackReasons = useRef(new Set());
  const contextLosses = useRef(0);
  const contextTimer = useRef(null);
  const cameraNonce = useRef(0);
  const activeManifestDigest = useRef(null);
  const workerDisposeTimer = useRef(null);
  const workerClient = useMemo(() => createTownSceneWorkerClient(), []);

  const emitFallback = useCallback((reason, recoverable = true, error = null) => {
    if (fallbackReasons.current.has(reason)) return;
    fallbackReasons.current.add(reason);
    onFallback?.({ reason, recoverable, ...(error ? { error } : {}) });
  }, [onFallback]);

  const compileInputResult = useMemo(() => {
    try {
      return {
        compileInput: prepareTownSceneCompileInput({
          settlement,
          mapEdits,
          worldState,
          regionalGraph,
          audience,
        }),
        error: null,
      };
    } catch (error) {
      return { compileInput: null, error };
    }
  }, [audience, mapEdits, regionalGraph, settlement, worldState]);
  const compileInput = compileInputResult.compileInput;
  const compileInputDigest = compileInput?.inputDigest || null;
  const displayGeometry = geometry?.manifestDigest === manifestDigest ? geometry : null;
  const canvasGeometryMode = displayGeometry
    ? `${displayGeometry.options?.massingOnly ? 'massing' : 'complete'}:${displayGeometry.options?.lodBias || 0}`
    : 'pending';
  const quality = useTownSceneAdaptiveQuality(adaptiveQuality, {
    active: Boolean(capability?.available && displayGeometry),
    onFallback: (reason) => emitFallback(reason, true),
    qualityMode,
    resetKey: compileInputDigest,
  });

  useEffect(() => {
    clearTimeout(workerDisposeTimer.current);
    return () => {
      clearTimeout(contextTimer.current);
      // Strict Mode replays effects across a synthetic teardown. A zero-delay
      // task gives the replay setup a chance to cancel disposal; on a real
      // unmount there is no successor, so the owned worker is terminated.
      workerDisposeTimer.current = setTimeout(() => workerClient.dispose(), 0);
    };
  }, [workerClient]);

  useEffect(() => {
    fallbackReasons.current.clear();
    contextLosses.current = 0;
    activeManifestDigest.current = null;
    clearTimeout(contextTimer.current);
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLocalSelection(null);
      setCameraRequest(null);
      setSelectedCameraId(null);
      setContextLost(false);
      setManifest(null);
      setManifestDigest(null);
      setGeometry(null);
      setGeometryStage('manifest');
      setStatus('Preparing the settlement portrait.');
    });
    return () => { cancelled = true; };
  }, [compileInputDigest]);

  useEffect(() => {
    if (!compileInputResult.error) return;
    emitFallback('manifest-compile-failed', false, compileInputResult.error);
  }, [compileInputResult.error, emitFallback]);

  useEffect(() => {
    if (!capability || capability.available) return;
    emitFallback(capability.reason || 'webgl2-unavailable', false);
  }, [capability, emitFallback]);

  useEffect(() => {
    if (!compileInput || !capability?.available) return undefined;
    const options = {
      // Normal bundles carry all bounded building LOD templates. The renderer
      // applies adaptive bias per projected instance; only the massing floor
      // changes the compiled bundle vocabulary.
      lodBias: 0,
      massingOnly: quality.massingOnly,
    };
    const controller = new AbortController();
    let acceptedManifest = null;
    let acceptedManifestDigest = null;
    let cacheKey = null;
    queueMicrotask(() => {
      if (controller.signal.aborted) return;
      setGeometryStage('manifest');
      setStatus('Compiling the authorized settlement portrait.');
      workerClient.compile(compileInput, options, {
        signal: controller.signal,
        onManifest: ({
          manifest: nextManifest,
          manifestDigest: nextManifestDigest,
        }) => {
          if (controller.signal.aborted) return;
          acceptedManifest = nextManifest;
          acceptedManifestDigest = nextManifestDigest;
          cacheKey = townSceneCacheKey(nextManifest, {
            ...options,
            manifestDigest: nextManifestDigest,
          });
          const firstManifestForInput = (
            activeManifestDigest.current !== nextManifestDigest
          );
          activeManifestDigest.current = nextManifestDigest;
          setManifest(nextManifest);
          setManifestDigest(nextManifestDigest);
          if (firstManifestForInput) {
            setSelectedCameraId(
              townSceneDefaultCameraPreset(nextManifest?.cameraPresets)?.id || null,
            );
          }

          const cached = townSceneCache.get(cacheKey);
          if (cached?.manifestDigest === nextManifestDigest) {
            setGeometry(cached);
            setGeometryStage(options.massingOnly ? 'massing' : 'complete');
            setStatus(options.massingOnly
              ? 'Showing simplified settlement massing.'
              : 'Settlement portrait ready.');
            // Manifest compilation was necessary to establish exact cache identity.
            // Once it matches, terminate the now-redundant geometry compilation.
            controller.abort();
            return;
          }
          setGeometryStage('compiling');
          setStatus('Manifest ready. Laying out the complete settlement.');
        },
        onProgress: ({ stage, geometry: progressiveGeometry }) => {
          if (
            controller.signal.aborted
            || !progressiveGeometry
            || progressiveGeometry.manifestDigest !== acceptedManifestDigest
          ) return;
          setGeometry(progressiveGeometry);
          setGeometryStage(stage || 'massing');
          setStatus('Settlement massing ready. Refining landmarks and materials.');
        },
      }).then(({
        manifest: completeManifest,
        manifestDigest: completeManifestDigest,
        geometry: completeGeometry,
      }) => {
        if (
          controller.signal.aborted
          || completeGeometry?.manifestDigest !== completeManifestDigest
          || completeManifestDigest !== acceptedManifestDigest
        ) return;
        if (!acceptedManifest) {
          acceptedManifest = completeManifest;
          setManifest(completeManifest);
          setManifestDigest(completeManifestDigest);
        }
        cacheKey ||= townSceneCacheKey(completeManifest, {
          ...options,
          manifestDigest: completeManifestDigest,
        });
        townSceneCache.set(cacheKey, completeGeometry);
        setGeometry(completeGeometry);
        setGeometryStage(options.massingOnly ? 'massing' : 'complete');
        setStatus(options.massingOnly
          ? 'Showing simplified settlement massing.'
          : 'Settlement portrait ready.');
      }).catch((error) => {
        if (error?.name === 'AbortError') return;
        setStatus('The 3D portrait could not be prepared. The settlement plan remains available.');
        emitFallback(
          acceptedManifestDigest
            ? 'geometry-compile-failed'
            : 'manifest-compile-failed',
          true,
          error,
        );
      });
    });
    return () => controller.abort();
  }, [
    capability,
    compileInput,
    emitFallback,
    quality.massingOnly,
    workerClient,
  ]);

  const semantics = useMemo(() => manifest?.semantics || [], [manifest]);
  const placeSemantics = useMemo(
    () => semantics.filter((semantic) => ![
      'condition',
      'hazard',
      'scar',
      'reconstruction',
    ].includes(semantic.entityKind)),
    [semantics],
  );
  const selected = selectedNodeId !== undefined ? selectedNodeId : localSelection;
  const selectedSemantic = useMemo(
    () => semantics.find((semantic) => semantic.sceneId === selected) || null,
    [selected, semantics],
  );
  const selectedBuilding = useMemo(
    () => (manifest?.buildings || []).find((building) => building.semanticId === selected) || null,
    [manifest, selected],
  );
  const selectedLivingRecord = useMemo(() => {
    const living = manifest?.living || {};
    return [
      ...(living.conditions || []),
      ...(living.scars || []),
      ...(living.reconstruction || []),
    ].find((record) => record.id === selected) || null;
  }, [manifest, selected]);
  const selectedProvenance = useMemo(() => {
    const wanted = new Set(selectedSemantic?.provenanceRefs || []);
    return (manifest?.provenance || []).filter((entry) => wanted.has(entry.id));
  }, [manifest, selectedSemantic]);

  const select = useCallback((sceneId, semantic, source) => {
    // Always remember the latest scene-originated selection. A defined parent
    // prop still wins while controlled; when that temporary control is released
    // the portrait resumes from the user's latest scene choice, not stale state.
    setLocalSelection(sceneId);
    setSelectedCameraId(null);
    const resolved = semantic || semantics.find((entry) => entry.sceneId === sceneId) || null;
    if (sceneId) setStatus(`${resolved?.label || 'Place'} selected.`);
    else setStatus('Selection cleared.');
    onSelect?.(sceneId, { semantic: resolved, source });
  }, [onSelect, semantics]);

  const requestCamera = useCallback((preset) => {
    cameraNonce.current += 1;
    setSelectedCameraId(preset.id);
    setCameraRequest({ kind: 'preset', preset, nonce: cameraNonce.current });
    setStatus(`${preset.label || preset.name || preset.id} camera selected.`);
  }, []);

  const requestZoom = useCallback((direction) => {
    cameraNonce.current += 1;
    setSelectedCameraId(null);
    setCameraRequest({
      kind: 'zoom',
      scale: direction === 'in' ? 0.78 : 1.28,
      nonce: cameraNonce.current,
    });
    setStatus(direction === 'in' ? 'Portrait zoomed in.' : 'Portrait zoomed out.');
  }, []);

  const selectQualityMode = useCallback((nextMode) => {
    if (!adaptiveQuality.OVERRIDE_MODES.includes(nextMode)) return;
    setQualityMode(nextMode);
    // Report upward so the choice outlives this mount (and this session). Only
    // validated members of the frozen vocabulary get here.
    onQualityModeChange?.(nextMode);
    const label = nextMode === 'auto'
      ? 'Automatic'
      : `${nextMode[0].toUpperCase()}${nextMode.slice(1)} ceiling`;
    setStatus(`${label} rendering quality selected.`);
  }, [onQualityModeChange]);

  const handleContextLost = useCallback(() => {
    contextLosses.current += 1;
    setContextLost(true);
    clearTimeout(contextTimer.current);
    contextTimer.current = setTimeout(() => {
      emitFallback('webgl-context-timeout', true);
    }, 8000);
    if (contextLosses.current > 1) emitFallback('webgl-context-repeated-loss', true);
  }, [emitFallback]);

  const handleContextRestored = useCallback(() => {
    clearTimeout(contextTimer.current);
    setContextLost(false);
    setContextEpoch((value) => value + 1);
  }, []);

  const runtimeFallback = (
    <div role="status" style={{ padding: 18, color: BODY, background: CARD, minHeight: 360 }}>
      The 3D portrait is unavailable. Use the canonical settlement plan while the viewer recovers.
    </div>
  );
  const visibleStatus = compileInputResult.error
    ? 'The settlement portrait could not be compiled. The plan remains available.'
    : capability && !capability.available
      ? 'This device cannot open the 3D portrait. The settlement plan remains available.'
      : status;

  return (
    <section
      data-town-scene-3d={TOWN_SCENE_3D_LAZY_SENTINEL}
      aria-label="Settlement portrait"
      style={{ display: 'grid', gap: 12 }}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-town-scene-status={geometryStage}
      >
        {visibleStatus}
      </div>

      <div
        data-town-scene-layout
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(270px, 330px)',
          gap: 12,
          alignItems: 'start',
        }}
      >
        <div style={surfaceStyle}>
          {capability?.available && manifest && displayGeometry ? (
            <SceneRuntimeBoundary
              // A progressive bundle or restored WebGL context owns a fresh
              // renderer lifecycle. Key the boundary with that lifecycle too:
              // otherwise one massing-stage exception permanently traps the
              // final bundle behind the boundary's earlier error state.
              key={`${manifestDigest}:${canvasGeometryMode}:${contextEpoch}`}
              fallback={runtimeFallback}
              onError={(error) => emitFallback('renderer-boundary-failed', true, error)}
            >
              <Suspense
                fallback={(
                  <div role="status" style={{ padding: 18, color: BODY }}>
                    Opening the illustrated portrait…
                  </div>
                )}
              >
                <TownSceneCanvas
                  // Progressive massing and final detail own different canvas
                  // nodes so permanent disposal can release the old WebGL
                  // context. TownSceneCanvas separately preserves a context
                  // during React's same-node effect replay.
                  key={`${manifestDigest || 'scene'}:${canvasGeometryMode}:${contextEpoch}`}
                  manifest={manifest}
                  geometry={displayGeometry}
                  quality={quality}
                  reducedMotion={reducedMotion}
                  selectedNodeId={selected}
                  cameraRequest={cameraRequest}
                  onPick={(sceneId) => select(sceneId, null, 'canvas')}
                  onCameraInteraction={() => setSelectedCameraId(null)}
                  onStatus={setStatus}
                  onContextLost={handleContextLost}
                  onContextRestored={handleContextRestored}
                  onFatal={(error) => emitFallback('renderer-initialization-failed', true, error)}
                />
              </Suspense>
            </SceneRuntimeBoundary>
          ) : (
            <div
              role="status"
              style={{
                display: 'grid',
                placeItems: 'center',
                minHeight: 420,
                padding: 18,
                color: BODY,
                textAlign: 'center',
              }}
            >
              {visibleStatus}
            </div>
          )}
          {contextLost && (
            <div
              role="status"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                padding: 18,
                background: GOLD_SOFT,
                color: INK,
                textAlign: 'center',
              }}
            >
              Graphics paused. The semantic settlement list remains available while the portrait recovers.
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <TownSceneViewerControls
            qualityMode={qualityMode}
            effectiveQuality={quality.quality}
            onQualityModeChange={selectQualityMode}
            onZoomIn={() => requestZoom('in')}
            onZoomOut={() => requestZoom('out')}
            onUsePlan={() => emitFallback('user-selected-plan', true)}
          />
          <TownSceneLivingSummary
            living={manifest?.living}
            semantics={semantics}
            selectedNodeId={selected}
            onSelect={(sceneId, semantic) => select(sceneId, semantic, 'semantic-list')}
          />
          <TownSceneSemanticList
            semantics={placeSemantics}
            districts={manifest?.districts || []}
            cameraPresets={manifest?.cameraPresets || []}
            selectedNodeId={selected}
            selectedCameraId={selected ? null : selectedCameraId}
            onSelect={(sceneId, semantic) => select(sceneId, semantic, 'semantic-list')}
            onRequestCamera={requestCamera}
          />
          <TownSceneOrphanOverrides
            manifest={manifest}
            mapEdits={mapEdits}
            audience={audience}
            canEdit={canEdit}
            onCommitEdits={onCommitEdits}
          />
          <TownSceneInspector
            semantic={selectedSemantic}
            building={selectedBuilding}
            livingRecord={selectedLivingRecord}
            provenance={selectedProvenance}
            audience={audience}
            mapEdits={mapEdits}
            canEdit={canEdit}
            onCommitEdits={onCommitEdits}
            onOpenWorkbench={onOpenWorkbench}
            onOpenHerald={onOpenHerald}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
          />
        </div>
      </div>

      <p style={{ margin: 0, color: BODY, fontSize: FS.xs }}>
        Drag to orbit, use a secondary drag or two fingers to pan, and scroll or pinch to zoom.
        The Plan view remains the precision and accessibility fallback.
      </p>
    </section>
  );
}
