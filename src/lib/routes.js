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
// `nav`   — top-nav metadata `{ label, order }` for the views that appear in the
//           primary navigation. The single source of truth for the nav bar:
//           App derives its NAV array from these (see the NAV export below), so
//           adding/relabelling/reordering a nav tab is a one-place edit here
//           instead of a parallel array that can silently drift.
export const ROUTES = Object.freeze([
  { view: 'generate',              path: '/create',                title: 'Create a Settlement',           nav: { label: 'Create',     order: 20 } },
  // The Welcome front door: a hero over the same generation flow as /create.
  // Leftmost nav tab. A bare root visit ('/') canonicalizes here for logged-out
  // visitors (the marketing CTAs); signed-in members are sent to /create — via
  // App's front-door effect (it rewrites only '/', not deep links).
  { view: 'home',                  path: '/home',                  title: 'Welcome',                       nav: { label: 'Welcome',    order: 10 } },
  // UX Phase 4 — `settlements` keeps its view id + /settlements path (back-compat),
  // but the nav LABEL becomes "Library" (via the nav.label below).
  { view: 'settlements',           path: '/settlements',           title: 'Your Library',                  nav: { label: 'Library',    order: 30 } },
  // UX Phase 4 — the Realm hub: the simulation's new IA home (World Map + Pulse +
  // Chronicle + Pantheon as one destination). The old World Map lives here as the
  // Map sub-tab. `/map` (and `?view=map`) redirect into `/realm` — see
  // LEGACY_VIEW_ALIASES + App's redirect effect.
  { view: 'realm',                 path: '/realm',                 title: 'Realm',                         nav: { label: 'Realm',      order: 40 } },
  { view: 'map',                   path: '/map',                   title: 'World Map' },
  { view: 'compendium',            path: '/compendium',            title: 'Compendium',                    nav: { label: 'Compendium', order: 50 } },
  { view: 'howto',                 path: '/how-to',                title: 'About',                         nav: { label: 'About',      order: 70 } },
  { view: 'workshop',              path: '/workshop',              title: 'Workshop' },
  { view: 'account',               path: '/account',               title: 'Account',                       guard: 'auth' },
  { view: 'admin',                 path: '/admin',                 title: 'Admin',                         guard: 'elevated' },
  { view: 'pricing',               path: '/pricing',               title: 'Pricing' },
  { view: 'gallery',               path: '/gallery',               title: 'Gallery',                       nav: { label: 'Gallery',    order: 60 } },
  // The Founders page — the public seat lineage (30 lifetime seats). Public +
  // indexable, footer-linked (no top-nav block), no guard. Lazy route; its lineage
  // read is fail-closed (components/founders/FoundersPage.jsx).
  { view: 'founders',              path: '/founders',              title: 'Founders' },
  // Legal / trust pages. Public + indexable (no nav block — they live in the
  // footer, not the top nav; no guard — anyone can read them). Content is
  // derived from the actual product behavior (see components/legal/*).
  { view: 'terms',                 path: '/terms',                 title: 'Terms of Service' },
  { view: 'privacy',               path: '/privacy',               title: 'Privacy Policy' },
  { view: 'refunds',               path: '/refunds',               title: 'Refunds' },
  // The dedicated competitor pages were deleted; App's redirect effect bounces
  // every `compare*` view to /how-to?tab=compare (the competitor-agnostic "How
  // We Compare" tab). The path entries stay so old/SEO links still resolve
  // instead of 404ing, but the titles are retired to the destination ('About')
  // so the one-frame pre-redirect document.title matches where the GM lands —
  // no flash of a named-competitor title for a page that no longer exists.
  { view: 'compare',               path: '/compare',               title: 'About' },
  { view: 'compare-chatgpt',       path: '/compare/chatgpt',       title: 'About' },
  { view: 'compare-worldographer', path: '/compare/worldographer', title: 'About' },
  { view: 'compare-kanka',         path: '/compare/kanka',         title: 'About' },
  { view: 'signin',                path: '/signin',                title: 'Sign In' },
  { view: 'register',              path: '/register',              title: 'Create Your Account' },
  { view: 'reset-password',        path: '/reset-password',        title: 'Reset Password' },
  // The recovery-link landing: completes a forgot-password reset. The auth-
  // recovery edge function redirects its emailed link here; the page detects the
  // recovery session and shows the set-new-password form.
  { view: 'set-new-password',      path: '/set-new-password',      title: 'Set a New Password' },
  { view: 'verify-email',          path: '/verify-email',          title: 'Verify Your Email' },
  { view: 'confirm-email',         path: '/confirm-email',         title: 'Email Confirmed' },
  { view: 'dossier-success',       path: '/checkout/success',      title: 'Purchase Complete' },
]);

// Param routes — matched after exact paths, IN ORDER. Each declares a matcher
// regex and a builder that turns the capture groups into a params object.
//
// The gallery FACET HUBS (GALLERY-2 phase 2; manifest src/lib/galleryHubs.js)
// must precede the dossier slug route: /gallery/at-war and /gallery/most-alive
// would otherwise match the slug pattern. Unknown hub values still resolve to
// the gallery view — GalleryHubPage renders its own not-found state.
const PARAM_ROUTES = Object.freeze([
  { view: 'settlements', re: /^\/settlements\/([^/]+)$/, build: m => ({ id: decodeURIComponent(m[1]) }) },
  // Per-ENTRY Compendium routes (V-19 the long tail): /compendium/<entry-id>
  // (kebab-case ids like `tier-thorp`, `arch-plague-of-beasts`, `deity-…`). The
  // exact `/compendium` overview is matched first (PATH_TO_ROUTE); this fans the
  // 289 named entries into their own indexable path routes. The sitemap +
  // prerender enumerate the ids from the committed compendium index, so this ONE
  // pattern carries the whole tail without a 289-line eager route table.
  { view: 'compendium', re: /^\/compendium\/([a-z0-9][a-z0-9-]*)$/, build: m => ({ entry: m[1] }) },
  { view: 'gallery', re: /^\/gallery\/(terrain|tier)\/([a-z0-9_-]+)$/, build: m => ({ hub: { facet: m[1], value: m[2] } }) },
  { view: 'gallery', re: /^\/gallery\/(at-war|most-alive)$/, build: m => ({ hub: { facet: m[1] } }) },
  { view: 'gallery', re: /^\/gallery\/([^/]+)$/, build: m => ({ slug: decodeURIComponent(m[1]) }) },
]);

// Old view ids that have since been renamed map here (old → new). The single
// forward-compat seam so a rename only edits one place instead of hunting
// through email templates and old links.
//
// UX Phase 4: the World Map moved INTO the Realm hub. A legacy `?view=map`
// link now resolves straight to `realm` (the Map sub-tab is the Realm's
// default body). The `/map` PATH still resolves to the `map` view in ROUTES,
// which App's redirect effect bounces to `realm` — so both legacy seams land
// in the same place without a 404.
const LEGACY_VIEW_ALIASES = Object.freeze({
  map: 'realm',
});

// ── Fast lookups (built once) ───────────────────────────────────────────────
const VIEW_TO_ROUTE = Object.freeze(
  ROUTES.reduce((acc, r) => { acc[r.view] = r; return acc; }, /** @type {Record<string, typeof ROUTES[number]>} */ ({})),
);
const PATH_TO_ROUTE = Object.freeze(
  ROUTES.reduce((acc, r) => { acc[r.path] = r; return acc; }, /** @type {Record<string, typeof ROUTES[number]>} */ ({})),
);

/**
 * The primary top-nav destinations, derived from the ROUTES `nav` metadata and
 * sorted by `nav.order`. The single source of truth for App's nav bar — a new
 * nav tab is added by giving its ROUTES entry a `nav` block, not by editing a
 * parallel array in App.jsx (which historically drifted out of sync).
 * @type {ReadonlyArray<{ id: string, label: string, order: number }>}
 */
export const NAV = Object.freeze(
  ROUTES
    .filter(r => r.nav)
    .map(r => ({ id: r.view, label: r.nav.label, order: r.nav.order }))
    .sort((a, b) => a.order - b.order),
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
  if (params && params.slug && view === 'gallery') {
    return `/gallery/${encodeURIComponent(params.slug)}`;
  }
  // Facet-hub URLs (GALLERY-2 phase 2): /gallery/<facet>[/<value>].
  if (params && params.hub && params.hub.facet && view === 'gallery') {
    const { facet, value } = params.hub;
    return value
      ? `/gallery/${encodeURIComponent(facet)}/${encodeURIComponent(value)}`
      : `/gallery/${encodeURIComponent(facet)}`;
  }
  if (params && params.id && view === 'settlements') {
    return `/settlements/${encodeURIComponent(params.id)}`;
  }
  // Per-entry Compendium path (V-19 long tail).
  if (params && params.entry && view === 'compendium') {
    return `/compendium/${encodeURIComponent(params.entry)}`;
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
