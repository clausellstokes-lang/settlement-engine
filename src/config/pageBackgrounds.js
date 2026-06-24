/**
 * config/pageBackgrounds.js — which painted background each page shows.
 *
 * Files live at public/backgrounds/<name>.jpg (web-optimized from the
 * source paintings). This module only maps view ids + generation modes
 * to image URLs — the legibility overlays live in src/index.css (so no
 * raw colors leak into JS and trip the visual-budget lint). Components
 * set the URL via the `--page-bg` / `--card-bg` CSS custom properties.
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

/**
 * Disciplined backgrounds (P5 / P12). A painting earns its place on every
 * page, but a working/reading surface must never be scanned through texture.
 * So the clean views paint BELOW a flat-cream header band: the page header
 * (eyebrow / title / subtitle — the only bare, non-card text) sits on solid
 * cream, which then fades into the per-image painting that fills the content
 * region (page margins + the gaps between the opaque cards). The cards stay
 * fully opaque, so every dense reading surface keeps its calm parchment.
 *
 * `home` is special: its hero band carries the OPPOSITE polarity (a dark ink
 * scrim, .hero-dark) rather than the cream page treatment.
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
});

const DEFAULT_BG = 'create';

/** Safest (most cream) profile if a clean view is ever left unmapped. */
const DEFAULT_PROFILE = 'calm';

/** A CSS `url(...)` value for a background basename. */
export function backgroundImageUrl(name) {
  return `url('${BASE}/${name}.jpg')`;
}

/**
 * Resolve the full-page background for the current view + generation state.
 *
 * Fields:
 *   - url:    the CSS `url(...)` for the painting (always resolved).
 *   - isFlow: a generation flow → the `.page-bg.is-flow` lighter scrim.
 *   - clean:  back-compat flag (true for CLEAN_VIEWS). Kept stable for any
 *             existing reader; it no longer means "unpainted".
 *   - paintedBelowHeader: NEW truth — a clean view that paints below a flat
 *             header band via `.page-painted`. False for `home` (dark hero).
 *   - scrimProfile: the art-direction class suffix (`busy|dark|calm`), or null.
 *
 * @param {{ view?: string, wizardMode?: string|null, settlement?: any }} args
 * @returns {{ url: string, isFlow: boolean, clean: boolean,
 *             paintedBelowHeader: boolean, scrimProfile: string|null }}
 */
export function resolveViewBackground({ view, wizardMode = null, settlement = null } = {}) {
  // Generation flow: once a mode is picked, its settlement scene backs the
  // wizard config and the dossier output (both live in the 'generate' view).
  if (view === 'generate' && (wizardMode || settlement)) {
    const name = MODE_BACKGROUNDS[wizardMode] || MODE_BACKGROUNDS.basic;
    return { url: backgroundImageUrl(name), isFlow: true, clean: false,
             paintedBelowHeader: false, scrimProfile: null };
  }
  // Clean views paint BELOW a flat-cream header band (except home, which owns
  // the dark-hero variant inside its own component).
  if (CLEAN_VIEWS.has(view)) {
    return {
      url: backgroundImageUrl(PAGE_BACKGROUNDS[view] || DEFAULT_BG),
      isFlow: false,
      clean: true,                          // back-compat; not "unpainted"
      paintedBelowHeader: view !== 'home',  // home uses the dark-hero path
      scrimProfile: SCRIM_PROFILES[view] || DEFAULT_PROFILE,
    };
  }
  return { url: backgroundImageUrl(PAGE_BACKGROUNDS[view] || DEFAULT_BG), isFlow: false, clean: false,
           paintedBelowHeader: false, scrimProfile: null };
}
