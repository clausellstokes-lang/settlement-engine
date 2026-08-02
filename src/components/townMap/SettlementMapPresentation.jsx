/**
 * SettlementMapPresentation — the projection switch above the canonical plan.
 *
 * The SVG plan stays mounted at all times. Panorama and Portrait are replaceable
 * presentation overlays derived from the same town-map truth; neither owns
 * settlement state. Keeping the switch in this leaf protects the already-large
 * SettlementMapPane and, more importantly, gives the WebGL implementation a
 * nested lazy boundary. A player who never asks for Portrait downloads no Three
 * runtime, worker, geometry compiler, or scene renderer.
 */

import { Component, lazy, Suspense, useRef } from 'react';
import { BORDER, CARD, FS, INK, MUTED, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';
import SettlementMapPanorama from './SettlementMapPanorama.jsx';

const SettlementScene3D = lazy(() => import('./scene3d/SettlementScene3D.jsx'));

function SceneLoading({ onUsePlan }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        gap: SP.sm,
        padding: SP.lg,
        background: CARD,
        color: MUTED,
        fontFamily: sans,
        fontSize: FS.sm,
        textAlign: 'center',
      }}
    >
      <div>
        <div style={{ color: INK, fontWeight: 800, marginBottom: SP.xs }}>
          Building the settlement portrait…
        </div>
        <div>The precision plan remains available while the dimensional scene loads.</div>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onUsePlan?.({
          reason: 'user-selected-plan',
          recoverable: true,
        })}
      >
        Use 2D plan
      </Button>
    </div>
  );
}

/**
 * A lazy-chunk failure happens before SettlementScene3D can invoke its own
 * recovery callback. Catch it here and return the product to a usable plan
 * instead of letting a WebGL/network problem take down the whole dossier.
 */
class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onFallback?.({ reason: 'scene_chunk_error', error });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <SceneLoading onUsePlan={this.props.onFallback} />;
  }
}

/**
 * @param {{
 *   viewMode: 'plan'|'panorama'|'portrait3d',
 *   onViewModeChange: (mode: 'plan'|'panorama'|'portrait3d') => void,
 *   sceneEnabled?: boolean,
 *   panoramaOps?: unknown[]|null,
 *   background: string,
 *   settlementName?: string,
 *   sceneProps?: Record<string, unknown>,
 *   onSceneFallback?: (detail?: unknown) => void,
 *   showSwitch?: boolean,
 * }} props
 *
 * `showSwitch` (TC-0 / §12) stands this leaf's own projection switch down when
 * the dossier's Map tab sub-tab shell owns the choice. Default true, so every
 * other mount is unchanged. The overlays above it are untouched either way: the
 * switch is chrome, not the projection.
 */
export default function SettlementMapPresentation({
  viewMode,
  onViewModeChange,
  sceneEnabled = false,
  panoramaOps = null,
  background,
  settlementName,
  sceneProps = {},
  onSceneFallback,
  showSwitch = true,
}) {
  const toggleRef = useRef(null);
  const options = [
    { id: 'plan', label: 'Plan' },
    { id: 'panorama', label: 'Panorama' },
    ...(sceneEnabled ? [{ id: 'portrait3d', label: 'Portrait' }] : []),
  ];
  const handleSceneFallback = (detail) => {
    onSceneFallback?.(detail);
    // A runtime/chunk failure unmounts the focused canvas and companion list.
    // Return focus to the surviving Plan choice instead of dropping keyboard
    // users at the document root. The next frame lets React commit Plan first.
    const focusPlan = () => toggleRef.current?.querySelector('button')?.focus();
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(focusPlan);
    else globalThis.setTimeout?.(focusPlan, 0);
  };

  return (
    <>
      {viewMode === 'panorama' && panoramaOps && (
        <SettlementMapPanorama ops={panoramaOps} bg={background} name={settlementName} />
      )}

      {viewMode === 'portrait3d' && sceneEnabled && (
        <div
          data-town-scene-overlay
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            // The semantic companion stacks below the canvas on narrow screens.
            // Keep it reachable by touch, keyboard, and zoom instead of clipping
            // it to the fixed map viewport. The canvas itself still owns its
            // orbit gesture through `touch-action:none`.
            overflow: 'auto',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
            background,
            border: `1px solid ${BORDER}`,
          }}
        >
          <SceneBoundary onFallback={handleSceneFallback}>
            <Suspense fallback={<SceneLoading onUsePlan={handleSceneFallback} />}>
              <SettlementScene3D {...sceneProps} onFallback={handleSceneFallback} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      {showSwitch && (
        <div ref={toggleRef} data-town-view-toggle style={{ position: 'absolute', top: 8, left: 8, zIndex: 4 }}>
          <Segmented
            size="sm"
            ariaLabel="Map view"
            value={viewMode}
            onChange={onViewModeChange}
            options={options}
          />
        </div>
      )}
    </>
  );
}
