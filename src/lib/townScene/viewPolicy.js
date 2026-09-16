/** The persisted/UI identifier shared with the Map presentation switch. */
export const TOWN_SCENE_VIEW_ID = 'portrait3d';

/**
 * Probe WebGL2 without retaining a context. Dependency injection keeps the
 * policy unit-testable in jsdom and avoids touching the DOM during SSR.
 *
 * @param {{
 *   documentRef?:Document|null,
 *   webgl2Constructor?:unknown,
 * }} [environment]
 * @returns {{available:boolean,reason:string|null}}
 */
export function detectTownSceneCapability(environment = {}) {
  const documentRef = environment.documentRef === undefined
    ? globalThis.document
    : environment.documentRef;
  if (!documentRef?.createElement) return { available: false, reason: 'no-document' };
  const webgl2Constructor = environment.webgl2Constructor === undefined
    ? globalThis.WebGL2RenderingContext
    : environment.webgl2Constructor;
  // The interface itself is part of the WebGL2 capability contract. Checking it
  // before allocating a canvas also keeps SSR and DOM-only test environments
  // from invoking a deliberately unimplemented canvas method.
  if (!webgl2Constructor) return { available: false, reason: 'webgl2-unavailable' };
  try {
    const canvas = documentRef.createElement('canvas');
    const context = canvas.getContext?.('webgl2', {
      antialias: false,
      failIfMajorPerformanceCaveat: true,
    });
    if (!context) return { available: false, reason: 'webgl2-unavailable' };
    context.getExtension?.('WEBGL_lose_context')?.loseContext?.();
    return { available: true, reason: null };
  } catch {
    return { available: false, reason: 'webgl2-probe-failed' };
  }
}

/**
 * Resolve the initial Map presentation without mutating a user's preference.
 * An automatic runtime fallback is session state, not a new saved preference.
 *
 * @param {{
 *   enabled?:boolean,
 *   promoted?:boolean,
 *   explicitView?:string|null,
 *   capability?:{available?:boolean,reason?:string|null}|null,
 *   manifestReady?:boolean,
 *   sessionDisabled?:boolean,
 * }} input
 */
export function resolveTownSceneViewPolicy(input = {}) {
  const capability = input.capability || { available: false, reason: 'not-probed' };
  const eligible = Boolean(
    input.enabled
    && input.manifestReady !== false
    && capability.available
    && !input.sessionDisabled,
  );
  const explicitlyRequested = input.explicitView === TOWN_SCENE_VIEW_ID;
  const view = eligible && (explicitlyRequested || (!input.explicitView && input.promoted))
    ? TOWN_SCENE_VIEW_ID
    : (input.explicitView && input.explicitView !== TOWN_SCENE_VIEW_ID ? input.explicitView : 'plan');

  let reason = null;
  if (!input.enabled) reason = 'disabled';
  else if (input.manifestReady === false) reason = 'manifest-unavailable';
  else if (input.sessionDisabled) reason = 'session-disabled';
  else if (!capability.available) reason = capability.reason || 'webgl2-unavailable';

  return Object.freeze({
    view,
    eligible,
    reason,
    requestedPortrait: explicitlyRequested,
    shouldPromote: eligible && Boolean(input.promoted),
  });
}
