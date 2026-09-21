/**
 * tests/config/pageBackgrounds.test.js — painted clean-view contract.
 *
 * Structural guard for the one-mechanism painted-page system: every
 * clean view must resolve a real painting AND declare whether it paints
 * below the header band (`.page-painted`) or rides the dark hero. The
 * scrim profile must be one of the three art-direction classes that
 * index.css defines, and no raw color may leak through this module (all
 * scrim color lives in CSS; JS carries only URLs + profile strings).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  CLEAN_VIEWS,
  PAGE_BACKGROUNDS,
  SCRIM_PROFILES,
  resolveViewBackground,
  paintsPageBackground,
} from '../../src/config/pageBackgrounds.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const VALID_PROFILES = new Set(['busy', 'dark', 'calm']);

describe('painted clean-view backgrounds', () => {
  it('every clean view resolves a real painting URL', () => {
    for (const view of CLEAN_VIEWS) {
      const bg = resolveViewBackground({ view });
      expect(bg.url, `${view} url`).toMatch(/^url\('\/backgrounds\/[\w-]+\.jpg'\)$/);
    }
  });

  it('every clean view except home paints below the header band', () => {
    for (const view of CLEAN_VIEWS) {
      const bg = resolveViewBackground({ view });
      if (view === 'home') {
        // home rides the OPPOSITE-polarity dark hero, not .page-painted.
        expect(bg.paintedBelowHeader, 'home is not page-painted').toBe(false);
      } else {
        expect(bg.paintedBelowHeader, `${view} paints below header`).toBe(true);
        expect(VALID_PROFILES.has(bg.scrimProfile), `${view} profile valid`).toBe(true);
      }
    }
  });

  it('scrim profiles map only to known art-direction classes', () => {
    for (const [view, profile] of Object.entries(SCRIM_PROFILES)) {
      expect(VALID_PROFILES.has(profile), `${view}→${profile}`).toBe(true);
      // Only painted (non-home) clean views carry a profile.
      expect(CLEAN_VIEWS.has(view) && view !== 'home', `${view} is a painted clean view`).toBe(true);
    }
  });

  it('busy/dark/calm assignments match the art-direction assessment', () => {
    expect(SCRIM_PROFILES.settlements).toBe('busy');
    expect(SCRIM_PROFILES.gallery).toBe('busy');
    expect(SCRIM_PROFILES.compendium).toBe('dark');
    expect(SCRIM_PROFILES.pricing).toBe('calm');
    expect(SCRIM_PROFILES.account).toBe('calm');
    expect(SCRIM_PROFILES.admin).toBe('calm');
    expect(SCRIM_PROFILES.howto).toBe('calm');
  });

  it('admin shares the account painting', () => {
    expect(PAGE_BACKGROUNDS.admin).toBe(PAGE_BACKGROUNDS.account);
  });

  it('the generation flow and non-clean views stay unpainted-below-header', () => {
    const flow = resolveViewBackground({ view: 'generate', wizardMode: 'basic' });
    expect(flow.isFlow).toBe(true);
    expect(flow.paintedBelowHeader).toBe(false);
    const map = resolveViewBackground({ view: 'map' });
    expect(map.clean).toBe(false);
    expect(map.paintedBelowHeader).toBe(false);
  });

  it('index.css defines every scrim profile + the dark-hero variant', () => {
    const css = readFileSync(join(ROOT, 'src/index.css'), 'utf8');
    expect(css).toMatch(/\.page-painted\b/);
    for (const profile of VALID_PROFILES) {
      expect(css, `scrim-${profile}`).toContain(`.page-painted.scrim-${profile}`);
    }
    expect(css).toMatch(/\.hero-dark\b/);
  });

  it('the config module leaks no raw hex color into JS', () => {
    const js = readFileSync(join(ROOT, 'src/config/pageBackgrounds.js'), 'utf8');
    // Comments may mention concepts, but no pure-hex color string literal.
    const codeOnly = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(codeOnly).not.toMatch(/['"]#[0-9a-fA-F]{3,8}['"]/);
  });
});

// ── WHICH VIEWS PAINT AT PAGE LEVEL ──────────────────────────────────────────
// App.jsx preloads the active view's painting. A view that resolves a painting
// but lands NEITHER painting class shows nothing and must not fetch it — `home`
// was doing exactly that on the landing page. paintsPageBackground is the single
// predicate both the paint and the preload read; these pin it in both directions,
// so a view can never paint without preloading or preload without painting.
describe('paintsPageBackground — the preload/paint predicate', () => {
  const ALL_VIEWS = [...new Set([...CLEAN_VIEWS, ...Object.keys(PAGE_BACKGROUNDS)])];

  it('agrees with the two painting classes for every known view', () => {
    for (const view of ALL_VIEWS) {
      const bg = resolveViewBackground({ view });
      // `.page-bg` when not clean; `.page-painted` when painted below the header.
      const paintsSomething = !bg.clean || bg.paintedBelowHeader;
      expect(paintsPageBackground(bg), `${view}`).toBe(paintsSomething);
    }
  });

  it('home is the ONE view that paints nothing at page level', () => {
    const notPainting = ALL_VIEWS.filter((view) => !paintsPageBackground(resolveViewBackground({ view })));
    // If this list grows, App.jsx already withholds the preload for the new view —
    // but check the view really shows nothing before accepting the change.
    expect(notPainting).toEqual(['home']);
  });

  it('the generation flow and a plain non-clean view both paint (and so preload)', () => {
    expect(paintsPageBackground(resolveViewBackground({ view: 'generate', wizardMode: 'basic' }))).toBe(true);
    expect(paintsPageBackground(resolveViewBackground({ view: 'realm' }))).toBe(true);
    expect(paintsPageBackground(resolveViewBackground({ view: 'settlements' }))).toBe(true);
  });

  it('a malformed/absent result never claims to paint nothing by accident', () => {
    // Defensive: an undefined arg must not throw inside a render/effect path.
    expect(() => paintsPageBackground(undefined)).not.toThrow();
  });

  // THE REASON home is excluded: `.hero-dark` is the only rule that would consume
  // --page-bg there, and NO component applies it (HomeLanding paints its own
  // --sf-scene from /media/journey-legs). If someone wires .hero-dark up, home
  // starts painting --page-bg and its preload must come back — this catches that.
  it('no component applies .hero-dark (if one does, home paints and must preload again)', () => {
    const appliers = [];
    (function walk(dir) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (/\.(jsx?|css)$/.test(entry.name) && p !== join(ROOT, 'src/index.css')
          && readFileSync(p, 'utf8').includes('hero-dark')) appliers.push(p);
      }
    }(join(ROOT, 'src')));
    // pageBackgrounds.js only NAMES the class in prose; anything else is a wiring.
    expect(appliers.filter((p) => p !== join(ROOT, 'src/config/pageBackgrounds.js'))).toEqual([]);
  });
});
