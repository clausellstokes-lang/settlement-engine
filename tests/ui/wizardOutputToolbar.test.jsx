/**
 * @vitest-environment jsdom
 *
 * tests/ui/wizardOutputToolbar.test.jsx
 *
 * Regression net for the Create-view "dark bar over the dossier" fix.
 *
 * The sticky output toolbar sits above the generated dossier. Two
 * properties must hold for it not to occlude or block the dossier:
 *
 *   1. It stays a sticky bar that yields to the global header — it sticks
 *      BELOW the header (a positive top offset) and carries a LOWER z-index
 *      than the header (50), so when the two meet the toolbar slides under
 *      the header rather than covering it. A regression that bumped the
 *      toolbar's z-index above the header, or zeroed its top offset, would
 *      put the dark bar back on top of the chrome.
 *   2. Every control it owns (Back, Regenerate, New Draft) keeps an
 *      accessible name and stays in the tree — the layout fix re-columns the
 *      bar but must not drop or hide any of its controls.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CHROME, HEADER_H } from '../../src/components/theme.js';

afterEach(cleanup);

// Resolve sibling source files relative to this test, not the cwd, so the
// source-guard reads stay correct whichever directory vitest runs from.
const fromTest = (rel) => fileURLToPath(new URL(rel, import.meta.url));

// Analytics is fire-and-forget; stub so the SimulationDrawer trigger inside
// the toolbar mounts quietly without pulling the funnel wiring into the test.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { WizardOutputToolbar } from '../../src/components/generate/WizardOutputToolbar.jsx';

const settlement = { name: 'Ashford', tier: 'Village', population: 1200 };

function renderToolbar(props = {}) {
  return render(
    <WizardOutputToolbar
      settlement={settlement}
      isMobile={false}
      handleBack={() => {}}
      handleGenerate={() => {}}
      handleNewSettlement={() => {}}
      {...props}
    />,
  );
}

describe('WizardOutputToolbar layering + controls', () => {
  test('all controls keep accessible names and stay reachable', () => {
    renderToolbar();
    // Back / Regenerate / New Draft are the toolbar's own controls.
    expect(screen.getByRole('button', { name: /back/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /regenerate/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /new draft/i })).toBeTruthy();
  });

  test('sticks flush below the painted header (its own length) under a lower z-index', () => {
    const { container } = renderToolbar();
    const bar = container.firstChild;
    expect(bar.style.position).toBe('sticky');
    // Desktop: the bar must pin BELOW the whole sticky header, not merely at a
    // positive offset. An offset short of the header (the old top:52) left the
    // bar's top edge tucked under the chrome.
    //
    // The header is the owner's arrow painting (2026-09-16), whose band height scales
    // with the page, so the contract is an EQUALITY with the header's own length
    // (HEADER_H, the --sf-header-h var ArrowHeader writes): the toolbar pins flush
    // beneath the shaft at every width instead of needing this line edited.
    expect(bar.style.top).toBe(HEADER_H);
    // Lower than the header's z-index (50) so the header wins the overlap, and above
    // the feather's hang layer (35) so the pinned bar covers the feather.
    expect(Number(bar.style.zIndex)).toBeLessThan(50);
    expect(Number(bar.style.zIndex)).toBeGreaterThan(35);
  });

  test('mobile pins BELOW the slim app header so the two stack (not under it)', () => {
    // Mobile fix (Phase 5): the bar used to pin at top:0, which let it slide
    // UNDER the sticky mobile header (top:0, z:50) and hide the dossier name and
    // Back/Regenerate while scrolling. It now pins at the header's height so the
    // header and toolbar stack cleanly, with the bar still below the header in
    // z-order so the header wins any overlap.
    const { container } = renderToolbar({ isMobile: true });
    const bar = container.firstChild;
    expect(bar.style.position).toBe('sticky');
    expect(bar.style.top).toBe(HEADER_H);
    expect(Number(bar.style.zIndex)).toBeLessThan(50);
  });

  test('mobile hide-on-scroll also hides the bar once its slide ends (the painted header is see-through)', () => {
    const { container } = renderToolbar({ isMobile: true });
    const bar = container.firstChild;
    expect(bar.style.visibility).toBe('visible');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 400 });
    fireEvent.scroll(window);
    expect(bar.style.transform).toBe('translateY(-140%)');
    expect(bar.style.visibility).toBe('hidden');
    // The visibility change waits out the 0.25 s slide.
    expect(bar.style.transition).toContain('visibility 0s linear 0.25s');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    fireEvent.scroll(window);
    expect(bar.style.visibility).toBe('visible');
    delete window.scrollY;
  });

  test('caps its OWN width to the dossier column and centres it, without a wrapper', () => {
    // The overhang fix caps the bar to PAGE_MAX and centres it. This cap MUST
    // live on the sticky bar's own box (maxWidth + auto side margins), not on a
    // height-collapsed parent wrapper — a wrapper would become the sticky
    // containing block and rob the bar of its scroll travel. So the firstChild
    // of the render (no intervening wrapper) is the sticky bar AND carries the
    // cap itself.
    const { container } = renderToolbar({ maxWidth: 960 });
    const bar = container.firstChild;
    // Same node is both the sticky bar and the capped box — proves no wrapper.
    expect(bar.style.position).toBe('sticky');
    expect(bar.style.maxWidth).toBe('960px');
    expect(bar.style.marginLeft).toBe('auto');
    expect(bar.style.marginRight).toBe('auto');
    expect(bar.style.width).toBe('100%');
  });
});

describe('Create-view sticky chrome: occlusion root-cause guards', () => {
  // The user's real complaint was occlusion: the dark bar sat in a layer over
  // the dossier and the chrome hid controls as content scrolled under it. Two
  // upstream causes — both invisible to a render-only test of the bar in
  // isolation — drove that, so they are guarded at the source.

  test('App <main> does not establish a scroll container that kills the toolbar sticky', () => {
    // App's shell is sized with `minHeight: 100vh` (not a fixed height), so the
    // WINDOW scrolls, not <main>. A stray `overflow-y: auto` on <main> never
    // engaged as a scroller but still made it the nearest scroll-clipping
    // ancestor — which silently broke `position: sticky` for the toolbar: it
    // resolved its offset against a box that never scrolled and so scrolled
    // away with the page instead of pinning. Guard that <main> never reintroduces
    // an overflow that traps descendant sticky chrome.
    const appSrc = readFileSync(fromTest('../../src/App.jsx'), 'utf8');
    // Capture the <main style={{ ... }}> object up to its closing `}}>` (the
    // style contains `${...}` template braces, so match non-greedily to `}}>`).
    // `<main>` carries a11y attributes (id/ref/tabIndex) before `style` now, so allow
    // any leading attributes rather than requiring style to be first.
    const mainTag = appSrc.match(/<main[^>]*?style=\{\{([\s\S]*?)\}\}>/);
    expect(mainTag, 'expected a <main …style={{...}}> in App.jsx').toBeTruthy();
    const mainStyle = mainTag[1];
    expect(mainStyle).not.toMatch(/overflow(Y)?\s*:\s*['"](auto|scroll|hidden)['"]/);
  });

  test('GenerateWizard reserves scroll-padding on the document scroller while the dossier is visible', () => {
    // With the window as the scroller, anchored/focus scrolls into a dossier
    // section would land the target flush under the pinned header + toolbar,
    // hiding the control jumped to. The fix sets `scroll-padding-top` on the
    // real scroller (the document element) for the visible-dossier window. Guard
    // that it targets `document.documentElement` (not `main`, which is no longer
    // a scroller) and clears the full chrome stack (header + pinned toolbar).
    const wizardSrc = readFileSync(fromTest('../../src/components/GenerateWizard.jsx'), 'utf8');
    expect(wizardSrc).toMatch(/document\.documentElement[\s\S]{0,200}scrollPaddingTop/);
    // Clearance must reach past the pinned toolbar's bottom, not a header-only offset
    // that re-hides the tab strip behind the toolbar. The header is the owner's arrow
    // painting, whose band height scales with the page, so the pad is DERIVED: the
    // header's own length (HEADER_H) plus the toolbar (CHROME.toolbarHeight), with 22 px
    // of air on desktop.
    expect(
      wizardSrc,
      'expected the pad to derive from the toolbar token, plus the desktop air',
    ).toMatch(/const pad\s*=\s*isMobile\s*\?\s*CHROME\.toolbarHeight\s*:\s*CHROME\.toolbarHeight\s*\+\s*22;/);
    expect(
      wizardSrc,
      'expected one scrollPaddingTop assignment composing the header length',
    ).toMatch(/root\.style\.scrollPaddingTop\s*=\s*`calc\(\$\{HEADER_H\}\s*\+\s*\$\{pad\}px\)`/);
    expect((wizardSrc.match(/scrollPaddingTop\s*=/g) || []).length, 'one assignment plus the restore').toBe(2);
    expect(CHROME.toolbarHeight).toBeGreaterThanOrEqual(64);
  });
});

describe('WizardOutputToolbar mobile compaction (order W2-f)', () => {
  // On mobile the three utilities (How this was simulated / Regenerate / New Draft)
  // collapse into one "⋯" overflow menu so Back + name + trigger fit a single row,
  // instead of a full-width third row wrapping under the name. Desktop is unchanged.
  test('desktop shows the utilities inline, with no overflow menu', () => {
    renderToolbar({ isMobile: false });
    expect(screen.queryByRole('button', { name: /more draft actions/i })).toBeNull();
    expect(screen.getByRole('button', { name: /regenerate/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /new draft/i })).toBeTruthy();
  });

  test('mobile hides the utilities behind an "⋯" overflow menu that opens to reveal them', () => {
    renderToolbar({ isMobile: true });
    // Back stays a first-class control; the utilities are behind the menu.
    expect(screen.getByRole('button', { name: /back/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /regenerate/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /new draft/i })).toBeNull();

    const trigger = screen.getByRole('button', { name: /more draft actions/i });
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu', { name: /draft actions/i })).toBeTruthy();
    // The SAME three utilities are now reachable inside the menu.
    expect(screen.getByRole('button', { name: /regenerate/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /new draft/i })).toBeTruthy();
  });

  test('Escape closes the overflow menu (keyboard dismissible)', () => {
    renderToolbar({ isMobile: true });
    const trigger = screen.getByRole('button', { name: /more draft actions/i });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('button', { name: /regenerate/i })).toBeNull();
  });
});
