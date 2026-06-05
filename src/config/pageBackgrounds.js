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

const DEFAULT_BG = 'create';

/** A CSS `url(...)` value for a background basename. */
export function backgroundImageUrl(name) {
  return `url('${BASE}/${name}.jpg')`;
}

/**
 * Resolve the full-page background for the current view + generation state.
 * @param {{ view?: string, wizardMode?: string|null, settlement?: any }} args
 * @returns {{ url: string, isFlow: boolean }}
 */
export function resolveViewBackground({ view, wizardMode = null, settlement = null } = {}) {
  // Generation flow: once a mode is picked, its settlement scene backs the
  // wizard config and the dossier output (both live in the 'generate' view).
  if (view === 'generate' && (wizardMode || settlement)) {
    const name = MODE_BACKGROUNDS[wizardMode] || MODE_BACKGROUNDS.basic;
    return { url: backgroundImageUrl(name), isFlow: true };
  }
  return { url: backgroundImageUrl(PAGE_BACKGROUNDS[view] || DEFAULT_BG), isFlow: false };
}
