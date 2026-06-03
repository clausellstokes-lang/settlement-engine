/**
 * lib/routes.js — Path ↔ view routing table.
 *
 * The app's navigation is a single `view` string switched by App's render
 * block. This module is the one place that maps those internal view ids to
 * public URL paths (and back), so the address bar, Back/Forward, refresh,
 * and shared links all line up with what's on screen.
 *
 * Pure data + pure functions — no React, no window access. The `useRoute`
 * hook (src/hooks/useRoute.js) wires this to history; this file is unit-
 * testable in isolation (tests/lib/routes.test.js).
 *
 * Resolution precedence (resolveLocation):
 *   1. Legacy `?view=<id>` query param — back-compat for already-sent
 *      emails and shared links (e.g. /?view=settlements). Highest
 *      precedence so an old link always lands where it used to, then the
 *      hook silently upgrades the URL to the canonical path.
 *   2. Exact path match (/create, /settlements, …).
 *   3. Param path match (/settlements/:id).
 *   4. Root "/" → default view (/create).
 *   5. Unknown path → default view, notFound:true (hook rewrites to /create).
 */

const SITE_NAME = 'SettlementForge';
const DEFAULT_VIEW = 'generate';

// ── The canonical table ─────────────────────────────────────────────────────
// `view`  — internal id used by App's render switch + nav arrays.
// `path`  — public URL.
// `title` — document.title fragment (DEFAULT_VIEW renders bare SITE_NAME).
// `guard` — 'auth' (signed-in) | 'elevated' (developer/admin) | undefined.
export const ROUTES = Object.freeze([
  { view: 'generate',              path: '/create',                title: 'Create a Settlement' },
  { view: 'settlements',           path: '/settlements',           title: 'Your Settlements' },
  { view: 'map',                   path: '/map',                   title: 'World Map' },
  { view: 'compendium',            path: '/compendium',            title: 'Compendium' },
  { view: 'howto',                 path: '/how-to',                title: 'About' },
  { view: 'workshop',              path: '/workshop',              title: 'Workshop' },
  { view: 'account',               path: '/account',               title: 'Account',                       guard: 'auth' },
  { view: 'admin',                 path: '/admin',                 title: 'Admin',                         guard: 'elevated' },
  { view: 'pricing',               path: '/pricing',               title: 'Pricing' },
  { view: 'gallery',               path: '/gallery',               title: 'Gallery' },
  { view: 'compare',               path: '/compare',               title: 'Compare SettlementForge' },
  { view: 'compare-chatgpt',       path: '/compare/chatgpt',       title: 'SettlementForge vs ChatGPT' },
  { view: 'compare-worldographer', path: '/compare/worldographer', title: 'SettlementForge vs Worldographer' },
  { view: 'compare-kanka',         path: '/compare/kanka',         title: 'SettlementForge vs Kanka' },
  { view: 'signin',                path: '/signin',                title: 'Sign In' },
  { view: 'register',              path: '/register',              title: 'Create Your Account' },
  { view: 'reset-password',        path: '/reset-password',        title: 'Reset Password' },
  { view: 'verify-email',          path: '/verify-email',          title: 'Verify Your Email' },
  { view: 'dossier-success',       path: '/checkout/success',      title: 'Purchase Complete' },
]);

// Param routes — matched after exact paths. Each declares a matcher regex
// and a builder that turns the capture groups into a params object.
const PARAM_ROUTES = Object.freeze([
  { view: 'settlements', re: /^\/settlements\/([^/]+)$/, build: m => ({ id: decodeURIComponent(m[1]) }) },
]);

// Old view ids that have since been renamed map here (old → new). Empty
// today (every legacy ?view= id still matches a current view id 1:1) but
// kept as the single forward-compat seam so a future rename only edits one
// place instead of hunting through email templates and old links.
const LEGACY_VIEW_ALIASES = Object.freeze({});

// ── Fast lookups (built once) ───────────────────────────────────────────────
const VIEW_TO_ROUTE = Object.freeze(
  ROUTES.reduce((acc, r) => { acc[r.view] = r; return acc; }, /** @type {Record<string, typeof ROUTES[number]>} */ ({})),
);
const PATH_TO_ROUTE = Object.freeze(
  ROUTES.reduce((acc, r) => { acc[r.path] = r; return acc; }, /** @type {Record<string, typeof ROUTES[number]>} */ ({})),
);

/** True if `view` is a declared view id. */
export function isKnownView(view) {
  return Object.prototype.hasOwnProperty.call(VIEW_TO_ROUTE, view);
}

function normalizeLegacyView(v) {
  return LEGACY_VIEW_ALIASES[v] || v;
}

/**
 * view (+ optional params) → canonical path string. Unknown views fall
 * back to the default (/create) rather than producing a broken URL.
 */
export function viewToPath(view, params) {
  if (params && params.id && view === 'settlements') {
    return `/settlements/${encodeURIComponent(params.id)}`;
  }
  const r = VIEW_TO_ROUTE[view];
  return r ? r.path : VIEW_TO_ROUTE[DEFAULT_VIEW].path;
}

/**
 * Resolve a location string (a bare path, "path?query#hash", or a full
 * href) to { view, params, notFound?, legacy? }.
 */
export function resolveLocation(location) {
  let url;
  try {
    // Base host lets us parse a bare path like "/create?x=1#h".
    url = new URL(String(location ?? '/'), 'http://localhost');
  } catch {
    return { view: DEFAULT_VIEW, params: {}, notFound: true };
  }

  // 1. Legacy ?view= (back-compat for already-sent links).
  const legacy = url.searchParams.get('view');
  if (legacy) {
    const v = normalizeLegacyView(legacy);
    if (isKnownView(v)) {
      const params = {};
      const slug = url.searchParams.get('slug');
      if (slug) params.slug = slug;
      return { view: v, params, legacy: true };
    }
  }

  // 2 + 3. Path.
  let path = url.pathname.replace(/\/+$/, '');
  if (path === '') path = '/';

  if (path === '/') return { view: DEFAULT_VIEW, params: {} };

  const exact = PATH_TO_ROUTE[path];
  if (exact) return { view: exact.view, params: {} };

  for (const pr of PARAM_ROUTES) {
    const m = path.match(pr.re);
    if (m) return { view: pr.view, params: pr.build(m) };
  }

  return { view: DEFAULT_VIEW, params: {}, notFound: true };
}

/** Per-route document title. DEFAULT_VIEW (home/create) gets bare SITE_NAME. */
export function titleForView(view) {
  const r = VIEW_TO_ROUTE[view];
  if (!r || view === DEFAULT_VIEW) return SITE_NAME;
  return `${r.title} · ${SITE_NAME}`;
}

/** Guard requirement for a view ('auth' | 'elevated' | undefined). */
export function guardForView(view) {
  return VIEW_TO_ROUTE[view] ? VIEW_TO_ROUTE[view].guard : undefined;
}

/**
 * True if `path` is a safe internal destination for a post-auth redirect
 * (the `?next=` param). Blocks protocol-relative (//evil.com) and absolute
 * (http://…) URLs so the redirect can't be used as an open redirect.
 */
export function isSafeNextPath(path) {
  return (
    typeof path === 'string' &&
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !path.startsWith('/\\')
  );
}
