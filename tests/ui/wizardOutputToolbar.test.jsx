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
import { render, screen, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CHROME } from '../../src/components/theme.js';

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

  test('sticks fully clear of the global header (offset >= header height) under a lower z-index', () => {
    const { container } = renderToolbar();
    const bar = container.firstChild;
    expect(bar.style.position).toBe('sticky');
    // Desktop: the bar must pin BELOW the whole sticky header, not merely at a
    // positive offset. The header is ~59px tall; an offset short of that (the
    // old top:52) left the bar's top edge tucked under the header. Require the
    // offset to clear the full header so the pinned toolbar reads as a clean
    // band, never partly hidden behind the chrome above it.
    expect(parseInt(bar.style.top, 10)).toBeGreaterThanOrEqual(59);
    // Lower than the header's z-index (50) so the header wins the overlap.
    expect(Number(bar.style.zIndex)).toBeLessThan(50);
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
    expect(parseInt(bar.style.top, 10)).toBe(CHROME.headerMobile);
    expect(Number(bar.style.zIndex)).toBeLessThan(50);
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
    // Desktop clearance must reach past the pinned toolbar's bottom (~124px) —
    // not a header-only offset that re-hides the tab strip behind the toolbar.
    // Mobile now STACKS the slim header and the toolbar (the toolbar pins at the
    // header's height, no longer at top:0), so the mobile clearance is the sum
    // of both chrome heights rather than a single header's worth. Both offsets
    // are driven by CHROME tokens, not inline literals.
    const padMatch = wizardSrc.match(
      /scrollPaddingTop\s*=\s*isMobile\s*\?\s*`\$\{mobilePad\}px`\s*:\s*`\$\{CHROME\.scrollPadDesktop\}px`/,
    );
    expect(padMatch, 'expected a mobile/desktop scrollPaddingTop assignment').toBeTruthy();
    expect(
      wizardSrc,
      'expected the mobile clearance to sum the header + toolbar chrome',
    ).toMatch(/const mobilePad\s*=\s*CHROME\.headerMobile\s*\+\s*CHROME\.toolbarHeight/);
    const themeSrc = readFileSync(fromTest('../../src/components/theme.js'), 'utf8');
    const desktopPad = themeSrc.match(/scrollPadDesktop\s*:\s*(\d+)/);
    expect(desktopPad, 'expected CHROME.scrollPadDesktop in theme.js').toBeTruthy();
    expect(Number(desktopPad[1])).toBeGreaterThanOrEqual(120);
    // Mobile stacked clearance must clear both bars.
    expect(CHROME.headerMobile + CHROME.toolbarHeight).toBeGreaterThanOrEqual(120);
  });
});
