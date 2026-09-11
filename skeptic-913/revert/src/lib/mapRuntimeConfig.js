/**
 * mapRuntimeConfig.js — one authority for the FMG frame URL and trust boundary.
 *
 * The map fork deliberately runs on a separate origin in production. That
 * topology keeps the fork's large, deliberately relaxed script surface away
 * from the app origin's Supabase session and payment state. The postMessage
 * bridge therefore needs two values that must never drift:
 *
 *   - frameUrl: the URL loaded by the iframe, including the parent-origin
 *     handshake and the fork cache revision;
 *   - frameOrigin: the exact origin accepted by the parent bridge and used as
 *     its postMessage target.
 *
 * Development remains boring: with no VITE_FMG_URL, localhost uses the
 * same-origin /map/ copy. Production has no such fallback. A missing, insecure,
 * same-origin, or CSP-unapproved production URL yields an invalid runtime
 * configuration instead of quietly restoring the original trust problem.
 */

export const MAP_FORK_REVISION = 'sfdrop16';
export const PRODUCTION_MAP_ORIGIN = 'https://map.settlementforge.com';

const LOCAL_FRAME_PATH = '/map/index.html';
const HTTP_PROTOCOLS = new Set(['http:', 'https:']);

export class MapRuntimeConfigError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'MapRuntimeConfigError';
  }
}

/** @param {string} hostname */
function isLoopbackHostname(hostname) {
  const normalized = String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '');
  return normalized === 'localhost'
    || normalized === '127.0.0.1'
    || normalized === '::1';
}

/**
 * @param {string | undefined} value
 * @param {string} label
 * @param {string | URL | undefined} [base]
 * @param {{ allowFragment?: boolean }} [options]
 */
function parseHttpUrl(value, label, base, { allowFragment = false } = {}) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new MapRuntimeConfigError(`${label} must be a valid URL.`);
  }
  let url;
  try {
    url = new URL(value, base);
  } catch {
    throw new MapRuntimeConfigError(`${label} must be a valid URL.`);
  }

  if (!HTTP_PROTOCOLS.has(url.protocol)) {
    throw new MapRuntimeConfigError(`${label} must use HTTP or HTTPS.`);
  }
  if (url.username || url.password) {
    throw new MapRuntimeConfigError(`${label} must not contain credentials.`);
  }
  if (url.hash && !allowFragment) {
    throw new MapRuntimeConfigError(`${label} must not contain a fragment.`);
  }
  return url;
}

/**
 * @param {string} configuredUrl
 * @param {URL} parentUrl
 */
function normalizeConfiguredFrameUrl(configuredUrl, parentUrl) {
  const frameUrl = parseHttpUrl(configuredUrl, 'VITE_FMG_URL', parentUrl);

  // The documented value is the dedicated host. Keep accepting a complete
  // index URL for staging/custom deployments, but make the host-only spelling
  // resolve to the repository's actual static entrypoint.
  if (frameUrl.pathname === '/' || frameUrl.pathname === '') {
    frameUrl.pathname = LOCAL_FRAME_PATH;
  } else if (frameUrl.pathname.endsWith('/map')) {
    frameUrl.pathname += '/index.html';
  } else if (frameUrl.pathname.endsWith('/map/')) {
    frameUrl.pathname += 'index.html';
  }
  return frameUrl;
}

/**
 * Resolve the frame contract without reading browser globals. Tests and build
 * checks use this pure function directly.
 *
 * @param {{
 *   configuredUrl?: string,
 *   parentHref?: string,
 *   production?: boolean,
 * }} [options]
 */
export function resolveMapRuntimeConfig({
  configuredUrl = '',
  parentHref,
  production = false,
} = {}) {
  const parentUrl = parseHttpUrl(
    parentHref,
    'Parent application URL',
    undefined,
    { allowFragment: true },
  );
  if (production && parentUrl.protocol !== 'https:') {
    throw new MapRuntimeConfigError('The production application must use HTTPS.');
  }

  const trimmedConfiguredUrl = String(configuredUrl || '').trim();
  let frameUrl;
  if (!trimmedConfiguredUrl) {
    if (production) {
      throw new MapRuntimeConfigError(
        'VITE_FMG_URL is required in production; the map may not fall back to the app origin.',
      );
    }
    frameUrl = new URL(LOCAL_FRAME_PATH, parentUrl);
  } else {
    frameUrl = normalizeConfiguredFrameUrl(trimmedConfiguredUrl, parentUrl);
  }

  if (frameUrl.protocol === 'http:' && !isLoopbackHostname(frameUrl.hostname)) {
    throw new MapRuntimeConfigError('The map frame must use HTTPS outside local development.');
  }

  if (production) {
    if (frameUrl.origin === parentUrl.origin) {
      throw new MapRuntimeConfigError('The production map frame must use a separate origin.');
    }
    if (frameUrl.origin !== PRODUCTION_MAP_ORIGIN) {
      throw new MapRuntimeConfigError(
        `The production map origin must match the CSP allowlist (${PRODUCTION_MAP_ORIGIN}).`,
      );
    }
  }

  // URLSearchParams owns the encoding. The child receives only an origin, never
  // the parent's path/query/hash, so campaign navigation state cannot leak.
  frameUrl.searchParams.set('v', MAP_FORK_REVISION);
  frameUrl.searchParams.set('parentOrigin', parentUrl.origin);

  return Object.freeze({
    frameUrl: frameUrl.href,
    frameOrigin: frameUrl.origin,
    parentOrigin: parentUrl.origin,
    production: Boolean(production),
  });
}

/**
 * Browser-facing, fail-soft wrapper. Security validation still fails closed:
 * invalid production configuration produces no frame URL/origin. Returning a
 * stable error object lets the World Map render its existing recovery panel
 * instead of taking down the entire React tree.
 */
export function readMapRuntimeConfig() {
  const env = /** @type {{
   *   VITE_FMG_URL?: string,
   *   PROD?: boolean,
   * }} */ (import.meta.env || {});
  const parentHref = typeof window !== 'undefined'
    ? window.location.href
    : 'http://localhost/';

  try {
    return Object.freeze({
      ...resolveMapRuntimeConfig({
        configuredUrl: env.VITE_FMG_URL || '',
        parentHref,
        production: env.PROD === true,
      }),
      configurationError: null,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return Object.freeze({
      frameUrl: null,
      frameOrigin: null,
      parentOrigin: null,
      production: env.PROD === true,
      configurationError: `The terrain engine is not securely configured. ${detail}`,
    });
  }
}
