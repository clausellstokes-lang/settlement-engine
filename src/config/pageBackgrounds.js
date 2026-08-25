/**
 * config/pageBackgrounds.js — which painted background each page shows.
 *
 * Files live at public/backgrounds/<name>.{jpg,webp}. Each painting ships in
 * two formats: the original JPEG and a smaller WebP twin built by
 * scripts/optimize-backgrounds.mjs (~23% off the ~4 MB set). This module maps
 * view ids + generation modes to image URLs AND picks the best format the
 * running engine supports — the legibility overlays live in src/index.css (so
 * no raw colors leak into JS and trip the visual-budget lint). Components set
 * the URL via the `--page-bg` / `--card-bg` CSS custom properties.
 *
 * Mechanic:
 *   - Each top-level view gets its own page painting.
 *   - On the Create page (view 'generate'), the three mode cards show a
 *     scaled-down settlement scene (basic→thorpe, advanced→village,
 *     custom→city). Choosing a mode blows that scene up into the full
 *     background for the wizard AND the resulting dossier output, until
 *     the user navigates to a different top-level page.
 *
 * Disciplined backgrounds (P5 / P12): a painting earns its place on every page,
 * but a working/reading surface must never be scanned through texture. So the
 * CLEAN_VIEWS paint BELOW a flat-cream header band (`.page-painted`, art-
 * directed by SCRIM_PROFILES); `home` is the OPPOSITE polarity — a dark ink
 * hero (`.hero-dark`) that its own component owns, so it paints nothing at the
 * page level.
 */

const BASE = '/backgrounds';

// ── WebP capability probe ──────────────────────────────────────────────────
// We pick ONE format per engine up front so only one file is ever fetched (no
// double-download) and the CSS background + its <link rel="preload"> always
// agree. The probe is a synchronous canvas encode test, cached after first
// use: document.createElement('canvas').toDataURL('image/webp') returns a
// `data:image/webp` URI only where the engine can ENCODE WebP — which implies
// it can decode it. No network, no flash. Trade-off: Safari <17 decodes WebP
// but can't encode it, so it false-negatives to the (still-shipped) JPEG —
// correct and safe, just not the byte win. In non-DOM contexts (SSR, the
// vitest node env) there's no canvas, so we also fall back to JPEG.
let _bgExt = null;
function bgExt() {
  if (_bgExt === null) {
    _bgExt = 'jpg';
    try {
      if (typeof document !== 'undefined' && document.createElement) {
        const canvas = document.createElement('canvas');
        if (canvas && canvas.toDataURL
          && canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
          _bgExt = 'webp';
        }
      }
    } catch {
      _bgExt = 'jpg';
    }
  }
  return _bgExt;
}

/** MIME type matching the chosen background format (for <link rel="preload">). */
function bgMime() {
  return bgExt() === 'webp' ? 'image/webp' : 'image/jpeg';
}

/** Bare URL (no `url(...)`) for a background basename, in the best format. */
export function backgroundHref(name) {
  return `${BASE}/${name}.${bgExt()}`;
}

/** view id → background image basename. */
export const PAGE_BACKGROUNDS = Object.freeze({
  generate:           'create',
  settlements:        'settlements',
  // The world-map surface is the 'realm' view now (routes.js — `/map` redirects
  // to `/realm`). Key both: 'realm' for the live view, 'map' for the brief
  // pre-redirect frame at `/map`.
  realm:              'world-map',
  map:                'world-map',
  compendium:         'compendium',
  howto:              'about',      // the About page renders the 'howto' view
  gallery:            'gallery',
  pricing:            'pricing',
  account:            'account',
  admin:              'account',
  'dossier-success':  'create',
  signin:             'create',
  register:           'create',
  'reset-password':   'create',
  'verify-email':     'create',
});

/** generation mode → settlement scene (card thumbnail + blown-up flow bg). */
export const MODE_BACKGROUNDS = Object.freeze({
  basic:    'thorpe',
  advanced: 'village',
  custom:   'city',
});

/**
 * Clean views paint BELOW a flat-cream header band: the page header
 * (eyebrow / title / subtitle) sits on solid cream, which then fades into the
 * per-image painting that fills the content region. The cards stay opaque, so
 * every dense reading surface keeps its calm parchment.
 *
 * `home` is special: its hero band carries the OPPOSITE polarity (a dark ink
 * scrim, .hero-dark) rather than the cream page treatment, so it paints nothing
 * at the page level.
 */
export const CLEAN_VIEWS = Object.freeze(new Set([
  'home',         // marketing landing — its hero band carries the dark scrim
  'settlements',  // Library
  'compendium',
  'gallery',
  'pricing',
  'account',
  'admin',
  'howto',        // About
  'terms',        // legal — flat reading surfaces
  'privacy',
  'refunds',
]));

/**
 * view id → scrim profile (art-direction class). Drives index.css
 * `.page-painted.scrim-<profile>`. PROFILES, not colors, live here — the
 * colors are all in index.css so no raw color leaks into JS (visual-budget
 * lint). Profiles come from the per-image art-direction assessment:
 *   - busy: edge-to-edge clutter, no calm region → strongest cream scrim.
 *   - dark: uniformly dark image → cream scrim reads naturally, show more.
 *   - calm: a light calm region where cream-on-light fails → hold cream high.
 */
export const SCRIM_PROFILES = Object.freeze({
  settlements: 'busy',   // settlements.jpg — busy edge-to-edge
  gallery:     'busy',   // gallery.jpg     — busy edge-to-edge
  compendium:  'dark',   // compendium.jpg  — uniformly dark
  pricing:     'calm',   // pricing.jpg     — light calm region
  account:     'calm',   // account.jpg
  admin:       'calm',   // shares account.jpg
  howto:       'calm',   // about.jpg       — light calm region
  terms:       'calm',   // legal pages share the About painting family
  privacy:     'calm',
  refunds:     'calm',
});

const DEFAULT_BG = 'create';

/** Safest (most cream) profile if a clean view is ever left unmapped. */
const DEFAULT_PROFILE = 'calm';

/** A CSS `url(...)` value for a background basename, in the best format. */
export function backgroundImageUrl(name) {
  return `url('${backgroundHref(name)}')`;
}

/**
 * Resolve the full-page background for the current view + generation state.
 *
 * Fields:
 *   - url:    the CSS `url(...)` for the painting (always resolved).
 *   - href/type: the bare URL + MIME of the CHOSEN format, feeding the active-
 *             view <link rel="preload"> in App.jsx (same format, so paint and
 *             preload agree and nothing downloads twice).
 *   - isFlow: a generation flow → the `.page-bg.is-flow` lighter scrim.
 *   - clean:  a clean view (CLEAN_VIEWS) — App suppresses the full-page
 *             `.page-bg` painting for it (the painted-below-header treatment or,
 *             for home, the component's own dark hero, owns the surface instead).
 *   - paintedBelowHeader: a clean view that paints below a flat header band via
 *             `.page-painted`. False for `home` (dark hero) and the legal pages'
 *             plain reading surface may still opt in via SCRIM_PROFILES.
 *   - scrimProfile: the art-direction class suffix (`busy|dark|calm`), or null.
 *
 * @param {{ view?: string, wizardMode?: string|null, settlement?: any }} args
 * @returns {{ url: string, href: string, type: string, isFlow: boolean,
 *             clean: boolean, paintedBelowHeader: boolean,
 *             scrimProfile: string|null }}
 */
export function resolveViewBackground({ view, wizardMode = null, settlement = null } = {}) {
  // Generation flow: once a mode is picked, its settlement scene backs the
  // wizard config and the dossier output (both live in the 'generate' view).
  if (view === 'generate' && (wizardMode || settlement)) {
    const name = MODE_BACKGROUNDS[wizardMode] || MODE_BACKGROUNDS.basic;
    return {
      url: backgroundImageUrl(name), href: backgroundHref(name), type: bgMime(),
      isFlow: true, clean: false, paintedBelowHeader: false, scrimProfile: null,
    };
  }
  // Clean views paint BELOW a flat-cream header band (except home, which owns
  // the dark-hero variant inside its own component).
  if (CLEAN_VIEWS.has(view)) {
    const name = PAGE_BACKGROUNDS[view] || DEFAULT_BG;
    return {
      url: backgroundImageUrl(name), href: backgroundHref(name), type: bgMime(),
      isFlow: false,
      clean: true,                          // back-compat; not "unpainted"
      paintedBelowHeader: view !== 'home',  // home uses the dark-hero path
      scrimProfile: SCRIM_PROFILES[view] || DEFAULT_PROFILE,
    };
  }
  const name = PAGE_BACKGROUNDS[view] || DEFAULT_BG;
  return {
    url: backgroundImageUrl(name), href: backgroundHref(name), type: bgMime(),
    isFlow: false, clean: false, paintedBelowHeader: false, scrimProfile: null,
  };
}
