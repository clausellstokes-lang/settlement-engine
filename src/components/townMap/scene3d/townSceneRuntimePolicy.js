/** View-only quality and lifecycle policies shared by the Three runtime. */

export const DEFAULT_TOWN_SCENE_QUALITY = Object.freeze({
  renderScale: 1,
  lodBias: 0,
  contactShadows: true,
  creaseInk: true,
  cullScale: 1,
  massingOnly: false,
});

export function disposeTownSceneRenderer(renderer, { releaseContext = true } = {}) {
  renderer.renderLists?.dispose?.();
  renderer.dispose?.();
  if (releaseContext) {
    // Every permanently removed runtime owns its canvas/context. Explicitly
    // relinquish that scarce browser resource after its listeners are gone.
    renderer.forceContextLoss?.();
  }
}

/** Canonical camera arrays are id-sorted, so the product default is explicit. */
export function townSceneDefaultCameraPreset(presets) {
  if (!Array.isArray(presets) || !presets.length) return null;
  return presets.find((preset) => preset?.id === 'overview') || presets[0] || null;
}

/**
 * Choose the best available architectural LOD for projected screen height.
 * Quality bias moves only toward coarser tiers; massing-only is an LOD0 floor.
 */
export function townSceneLodForProjectedPixels(projectedPixels, options = {}) {
  const base = projectedPixels >= 86 ? 2 : projectedPixels >= 26 ? 1 : 0;
  const biased = options.massingOnly
    ? 0
    : Math.max(
      0,
      Math.min(2, base - Math.max(0, Math.round(options.lodBias || 0))),
    );
  const available = (options.availableLods || [0, 1, 2])
    .filter((lod) => Number.isInteger(lod) && lod >= 0 && lod <= 2)
    .sort((a, b) => a - b);
  if (!available.length) return biased;
  const atOrBelow = available.filter((lod) => lod <= biased);
  return atOrBelow.length ? atOrBelow[atOrBelow.length - 1] : available[0];
}
