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

afterEach(cleanup);

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

  test('sticks below the global header (positive offset) under a lower z-index', () => {
    const { container } = renderToolbar();
    const bar = container.firstChild;
    expect(bar.style.position).toBe('sticky');
    // Desktop: a positive top offset so the bar parks beneath the sticky
    // header (top:0) instead of on top of it.
    expect(parseInt(bar.style.top, 10)).toBeGreaterThan(0);
    // Lower than the header's z-index (50) so the header wins the overlap.
    expect(Number(bar.style.zIndex)).toBeLessThan(50);
  });

  test('mobile sticks to the top of the scroll region', () => {
    const { container } = renderToolbar({ isMobile: true });
    const bar = container.firstChild;
    expect(bar.style.position).toBe('sticky');
    expect(parseInt(bar.style.top, 10)).toBe(0);
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
