import { useEffect, useRef } from 'react';
import { CARD_ALT } from '../../theme.js';
import { createTownSceneRuntime } from './threeSceneRuntime.js';

/**
 * The deepest lazy boundary. Three and OrbitControls are requested only after
 * Portrait is selected, capability is green, and geometry is available.
 */
export default function TownSceneCanvas({
  manifest,
  geometry,
  quality,
  reducedMotion = false,
  selectedNodeId = null,
  cameraRequest = null,
  onPick,
  onReady,
  onStatus,
  onCameraInteraction,
  onContextLost,
  onContextRestored,
  onFatal,
}) {
  const canvasRef = useRef(null);
  const runtimeRef = useRef(null);
  const contextReleaseTimerRef = useRef(null);
  const callbacks = useRef({});

  useEffect(() => {
    callbacks.current = {
      onPick,
      onReady,
      onStatus,
      onCameraInteraction,
      onContextLost,
      onContextRestored,
      onFatal,
    };
  }, [
    onCameraInteraction,
    onContextLost,
    onContextRestored,
    onFatal,
    onPick,
    onReady,
    onStatus,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geometry) return undefined;
    // React may replay this effect in development or rebuild it on the same
    // canvas after a dependency changes. Cancel the prior runtime's deferred
    // context release before the new renderer claims that canvas.
    if (contextReleaseTimerRef.current !== null) {
      globalThis.clearTimeout(contextReleaseTimerRef.current);
      contextReleaseTimerRef.current = null;
    }
    let cancelled = false;
    let resizeObserver = null;
    let windowResize = null;
    let pointerStart = null;
    let runtime = null;

    const handleVisibility = () => {
      runtime?.setPaused(document.visibilityState === 'hidden');
    };
    const handlePointerDown = (event) => {
      pointerStart = { x: event.clientX, y: event.clientY };
    };
    const handlePointerUp = (event) => {
      if (!pointerStart) return;
      const movement = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
      pointerStart = null;
      if (movement <= 5) runtime?.pick(event.clientX, event.clientY);
    };
    const handlePointerCancel = () => {
      pointerStart = null;
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      callbacks.current.onPick?.(null);
    };
    const handleContextLost = (event) => {
      event.preventDefault();
      runtime?.setPaused(true);
      callbacks.current.onStatus?.('The 3D portrait paused while its graphics context recovers.');
      callbacks.current.onContextLost?.();
    };
    const handleContextRestored = () => {
      callbacks.current.onStatus?.('Graphics recovered. Rebuilding the settlement portrait.');
      callbacks.current.onContextRestored?.();
    };

    async function mount() {
      try {
        callbacks.current.onStatus?.('Preparing the illustrated settlement portrait.');
        const [THREE, controlsModule] = await Promise.all([
          import('three'),
          import('three/examples/jsm/controls/OrbitControls.js'),
        ]);
        if (cancelled) return;
        runtime = createTownSceneRuntime({
          THREE,
          OrbitControls: controlsModule.OrbitControls,
          canvas,
          manifest,
          geometry,
          quality,
          reducedMotion,
          onPick: (sceneId) => callbacks.current.onPick?.(sceneId),
          onCameraInteraction: () => callbacks.current.onCameraInteraction?.(),
        });
        runtimeRef.current = runtime;
        const resize = () => {
          const rect = canvas.parentElement?.getBoundingClientRect?.() || canvas.getBoundingClientRect();
          runtime.resize(rect.width || 1, rect.height || 1);
        };
        windowResize = resize;
        resizeObserver = typeof ResizeObserver === 'function'
          ? new ResizeObserver(resize)
          : null;
        if (resizeObserver) resizeObserver.observe(canvas.parentElement || canvas);
        else globalThis.addEventListener?.('resize', resize);
        resize();
        runtime.setSelected(selectedNodeId);
        runtime.setPaused(document.visibilityState === 'hidden');
        runtime.start();
        callbacks.current.onStatus?.('Settlement portrait ready.');
        callbacks.current.onReady?.();
      } catch (error) {
        if (!cancelled) callbacks.current.onFatal?.(error);
      }
    }

    document?.addEventListener?.('visibilitychange', handleVisibility);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerCancel);
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    mount();

    return () => {
      cancelled = true;
      runtimeRef.current = null;
      resizeObserver?.disconnect();
      if (!resizeObserver && windowResize) globalThis.removeEventListener?.('resize', windowResize);
      document?.removeEventListener?.('visibilitychange', handleVisibility);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerCancel);
      canvas.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      if (runtime) {
        const releasedRuntime = runtime;
        // Dispose GPU-owned resources immediately, but defer forceContextLoss
        // by one task. A synchronous effect replay cancels this release and
        // safely reuses the same canvas; a true unmount has no successor, so
        // the scarce WebGL context is still relinquished promptly.
        releasedRuntime.dispose({ releaseContext: false });
        contextReleaseTimerRef.current = globalThis.setTimeout(() => {
          releasedRuntime.releaseContext();
          contextReleaseTimerRef.current = null;
        }, 0);
      }
    };
    // Geometry identity is the rebuild boundary. Callback/selection/quality
    // changes are applied imperatively below and do not recreate GPU resources.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, manifest, reducedMotion]);

  useEffect(() => {
    runtimeRef.current?.setQuality(quality);
  }, [quality]);

  useEffect(() => {
    runtimeRef.current?.setSelected(selectedNodeId);
  }, [selectedNodeId]);

  useEffect(() => {
    if (cameraRequest?.kind === 'zoom') {
      runtimeRef.current?.zoomBy(cameraRequest.scale);
    } else if (cameraRequest?.preset) {
      runtimeRef.current?.moveCamera(cameraRequest.preset);
    }
  }, [cameraRequest]);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      aria-label="Interactive three-dimensional settlement portrait. Use pointer or touch to orbit, two fingers or secondary drag to pan, and the companion list to select places."
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        minHeight: 360,
        touchAction: 'none',
        background: CARD_ALT,
      }}
    />
  );
}
