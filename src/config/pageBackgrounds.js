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

const DEFAULT_BG = 'create';

/** A CSS `url(...)` value for a background basename, in the best format. */
export function backgroundImageUrl(name) {
  return `url('${backgroundHref(name)}')`;
}

/**
 * Resolve the full-page background for the current view + generation state.
 * `url` feeds the `--page-bg` CSS var; `href`/`type` feed the active-view
 * <link rel="preload"> in App.jsx (same chosen format, so paint and preload
 * agree).
 * @param {{ view?: string, wizardMode?: string|null, settlement?: any }} args
 * @returns {{ url: string, href: string, type: string, isFlow: boolean }}
 */
export function resolveViewBackground({ view, wizardMode = null, settlement = null } = {}) {
  // Generation flow: once a mode is picked, its settlement scene backs the
  // wizard config and the dossier output (both live in the 'generate' view).
  const isFlow = view === 'generate' && !!(wizardMode || settlement);
  const name = isFlow
    ? (MODE_BACKGROUNDS[wizardMode] || MODE_BACKGROUNDS.basic)
    : (PAGE_BACKGROUNDS[view] || DEFAULT_BG);
  return { url: backgroundImageUrl(name), href: backgroundHref(name), type: bgMime(), isFlow };
}
