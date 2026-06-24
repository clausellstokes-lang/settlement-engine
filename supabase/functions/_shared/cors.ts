/**
 * supabase/functions/_shared/cors.ts — ONE CORS allowlist for every edge
 * function.
 *
 * Background: each edge function used to carry its OWN inline allowlist
 * (settlementforge.com / www / settlementwork.vercel.app / localhost). Those
 * copies drifted (different localhost ports, '*' fallbacks, missing
 * Allow-Methods) and — the bug that motivated this module — none of them
 * allowed the Cloudflare Pages preview origin, so cross-origin calls from a
 * branch/preview deploy (e.g. the narrative stream) failed CORS when tested
 * there. This module is the single source of truth: edit the allowlist here,
 * every function inherits it.
 *
 * Policy — FAIL CLOSED. These are credentialed endpoints, so we NEVER emit
 * `Access-Control-Allow-Origin: '*'`. We echo the request's Origin only when it
 * matches the allowlist; otherwise we pin to the first allowed host (which a
 * disallowed cross-origin browser will reject, as intended). A missing Origin
 * is treated as same-origin (also pinned to the first host).
 *
 * Allowed origins:
 *   - the explicit production + apex/www hosts
 *   - the Vercel app host
 *   - CLIENT_URL and any comma-separated ALLOWED_ORIGINS env entries
 *   - any http://localhost:<port>            (local dev, any Vite/CRA port)
 *   - any https://<subdomain>.settlement-engine.pages.dev
 *                                            (Cloudflare Pages branch/preview)
 *
 * The Cloudflare rule is a SUFFIX match over https only: Pages assigns a fresh
 * `<hash>.settlement-engine.pages.dev` per branch/preview, so an exact list
 * would never keep up. We require the `.settlement-engine.pages.dev` suffix and
 * the https scheme so the match cannot be spoofed by
 * `https://evil-settlement-engine.pages.dev.attacker.com`.
 */

/** Explicit, always-allowed production/staging hosts. */
const STATIC_ORIGINS = [
  'https://settlementforge.com',
  'https://www.settlementforge.com',
  'https://settlementwork.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
];

/** Cloudflare Pages project host. Branch/preview deploys are subdomains of it. */
const CLOUDFLARE_PAGES_SUFFIX = '.settlement-engine.pages.dev';

/**
 * Read an env var without assuming the Deno global exists. The helper is
 * imported by vitest (Node) for behavioral testing, where `Deno` is undefined;
 * guarding here keeps the module importable in both runtimes.
 *
 * @param {string} name
 * @returns {string}
 */
function readEnv(name: string): string {
  // deno-lint-ignore no-explicit-any
  const deno = (globalThis as any).Deno;
  if (deno && typeof deno.env?.get === 'function') {
    return deno.env.get(name) || '';
  }
  return '';
}

/**
 * The full allowlist for a request: the static hosts plus CLIENT_URL and any
 * ALLOWED_ORIGINS env entries. Localhost-any-port and Cloudflare Pages are
 * matched by RULE in `isAllowedOrigin`, not enumerated here.
 *
 * @returns {string[]}
 */
function configuredOrigins(): string[] {
  const clientUrl = readEnv('CLIENT_URL');
  const extra = readEnv('ALLOWED_ORIGINS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [clientUrl, ...STATIC_ORIGINS, ...extra].filter(Boolean);
}

/**
 * Whether an Origin is allowed. A missing Origin counts as same-origin (true).
 *
 * @param {string} origin
 * @returns {boolean}
 */
export function isAllowedOrigin(origin: string): boolean {
  if (!origin) return true;
  if (configuredOrigins().includes(origin)) return true;
  // Any http://localhost:<port>.
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  // Cloudflare Pages branch/preview: https + suffix match (never a bare match
  // on the suffix host itself without a subdomain, and https-only so the
  // scheme can't be downgraded).
  try {
    const url = new URL(origin);
    if (
      url.protocol === 'https:' &&
      url.hostname !== CLOUDFLARE_PAGES_SUFFIX.slice(1) &&
      url.hostname.endsWith(CLOUDFLARE_PAGES_SUFFIX)
    ) {
      return true;
    }
  } catch {
    // Not a parseable absolute origin — reject.
  }
  return false;
}

/**
 * Resolve the value to put in Access-Control-Allow-Origin: the request's own
 * Origin when allowed, else the first configured host (fail closed, never '*').
 * Also used by callers that need a single canonical origin (e.g. building a
 * redirect base) sourced from the same decision.
 *
 * @param {Request} [req]
 * @returns {string}
 */
export function resolveAllowedOrigin(req?: Request): string {
  const origin = req?.headers?.get('Origin') || '';
  if (isAllowedOrigin(origin)) {
    return origin || configuredOrigins()[0];
  }
  return configuredOrigins()[0];
}

/**
 * @typedef {Object} CorsOptions
 * @property {string} [methods] Value for Access-Control-Allow-Methods. Omit to
 *   leave the header out (some endpoints don't advertise methods).
 * @property {string} [headers] Value for Access-Control-Allow-Headers.
 */
type CorsOptions = {
  methods?: string;
  headers?: string;
};

const DEFAULT_ALLOW_HEADERS = 'authorization, x-client-info, apikey, content-type';

/**
 * Build the CORS response headers for a request using the shared allowlist.
 * Fail-closed: echoes the matched Origin (with `Vary: Origin`), else pins to
 * the first allowed host. Never emits '*'.
 *
 * Callers preserve their own Allow-Methods / Allow-Headers by passing options;
 * the ORIGIN decision always comes from here.
 *
 * @param {Request} [req]
 * @param {CorsOptions} [options]
 * @returns {Record<string, string>}
 */
export function getCorsHeaders(req?: Request, options: CorsOptions = {}): Record<string, string> {
  const origin = req?.headers?.get('Origin') || '';
  const matched = isAllowedOrigin(origin);
  const headers: Record<string, string> = {
    // Fail closed: never '*'. Echo the matched origin (or same-origin/missing),
    // else pin to the first allowed host.
    'Access-Control-Allow-Origin': resolveAllowedOrigin(req),
    'Access-Control-Allow-Headers': options.headers || DEFAULT_ALLOW_HEADERS,
  };
  if (options.methods) {
    headers['Access-Control-Allow-Methods'] = options.methods;
  }
  if (matched) {
    headers['Vary'] = 'Origin';
  }
  return headers;
}
