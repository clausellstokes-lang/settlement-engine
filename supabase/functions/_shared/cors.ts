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
 *   - any http://localhost:<port>            (DEV deployments ONLY — any
 *                                            Vite/CRA port; see isDevDeployment)
 *   - any https://<subdomain>.settlement-engine.pages.dev
 *                                            (Cloudflare Pages branch/preview)
 *
 * The Cloudflare rule is a SUFFIX match over https only: Pages assigns a fresh
 * `<hash>.settlement-engine.pages.dev` per branch/preview, so an exact list
 * would never keep up. We require the `.settlement-engine.pages.dev` suffix and
 * the https scheme so the match cannot be spoofed by
 * `https://evil-settlement-engine.pages.dev.attacker.com`.
 */

/** Explicit, always-allowed production/staging hosts. Localhost is NOT listed
 *  here — dev origins are matched by the dev-gated rule in `isAllowedOrigin`. */
const STATIC_ORIGINS = [
  'https://settlementforge.com',
  'https://www.settlementforge.com',
  'https://settlementwork.vercel.app',
];

/** Cloudflare Pages project host. Branch/preview deploys are subdomains of it. */
const CLOUDFLARE_PAGES_SUFFIX = '.settlement-engine.pages.dev';

/**
 * Vercel deploy/preview URL shape for this project under our team scope. Vercel
 * assigns a fresh URL per deploy/preview, so an exact list can't keep up (same
 * reason as the Cloudflare rule).
 *
 * A bare `endsWith('-settlement-forge.vercel.app')` suffix match was SPOOFABLE
 * (finding backend-functions-3): `.vercel.app` project names are a global,
 * first-come namespace, so an attacker's project named `evil-settlement-forge`
 * gets the production alias `evil-settlement-forge.vercel.app`, which ends with
 * the suffix and passed the check. The team slug `settlement-forge` only appears
 * as a Vercel-APPENDED trailing segment in PREVIEW URLs (which always carry a
 * generated middle — a deploy hash, or `git-<branch>`); the attacker can only
 * forge the suffix via a bare production alias, which has NO generated middle.
 *
 * So we match the full preview-URL shape: our project prefix, then a generated
 * middle (a 9-char deploy hash OR `git-<branch>`), then the team suffix. This
 * rejects the bare-alias spoof while still matching every real preview/branch
 * build. The apex production access stays via the settlementforge.com custom
 * domain (+ settlementwork.vercel.app in STATIC_ORIGINS).
 *
 * Residual (accepted, bounded — auth is bearer-token, not cookie): an attacker
 * who grabs the exact global project name `settlementforge-<9alnum>-settlement-
 * forge` would still match. For hard enumeration, add explicit hosts via
 * ALLOWED_ORIGINS instead of relying on this rule.
 */
const VERCEL_DEPLOY_RE = /^settlementforge-(?:git-[a-z0-9-]+|[a-z0-9]{9})-settlement-forge\.vercel\.app$/;

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
 * Whether this is a DEV deployment. Production always sets an https CLIENT_URL
 * (checkout redirect URLs depend on it); local `supabase functions serve`, unit
 * tests, and localhost-pointed stacks either leave it unset or point it at
 * localhost. Used to gate the localhost-any-port origin rule: a deployed
 * production function must not reflect `http://localhost:<port>` origins.
 * A developer who genuinely needs a localhost origin against a production
 * deploy can add it explicitly via ALLOWED_ORIGINS.
 *
 * @returns {boolean}
 */
function isDevDeployment(): boolean {
  const clientUrl = readEnv('CLIENT_URL');
  return !clientUrl || /^http:\/\/localhost(:\d+)?$/.test(clientUrl);
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
  // Any http://localhost:<port> — DEV deployments only (see isDevDeployment).
  if (isDevDeployment() && /^http:\/\/localhost:\d+$/.test(origin)) return true;
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
    // Vercel deploy/preview: https + the full deploy-URL shape (project prefix +
    // generated hash/git-branch middle + team suffix). The generated middle is
    // what a bare production-alias spoof (evil-settlement-forge.vercel.app) can't
    // forge — see VERCEL_DEPLOY_RE.
    if (url.protocol === 'https:' && VERCEL_DEPLOY_RE.test(url.hostname)) {
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
    // The supabase-js client (supabase.functions.invoke, used by ingest-events
    // and others) issues its fetch with credentials mode 'include'. Per the CORS
    // spec, a credentialed request's response MUST carry
    // Access-Control-Allow-Credentials: 'true' AND a non-'*' Allow-Origin, or the
    // browser blocks it at preflight ("...Allow-Credentials header is '' which
    // must be 'true'..."). We already echo an exact origin (never '*'), so this
    // is safe: a disallowed origin is still pinned to the first host and rejected
    // on the origin mismatch regardless of this flag.
    'Access-Control-Allow-Credentials': 'true',
  };
  if (options.methods) {
    headers['Access-Control-Allow-Methods'] = options.methods;
  }
  if (matched) {
    headers['Vary'] = 'Origin';
  }
  return headers;
}
