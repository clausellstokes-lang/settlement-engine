/**
 * @vitest-environment jsdom
 *
 * tests/ui/proofPairTopAlign.test.jsx — C1r-d walk fix (owner): THE MINIATURE
 * PAIR STARTS AT THE SAME HEIGHT.
 *
 * The two below-the-fold demo exhibits — HomeSampleDossier (Hightower's Reach)
 * and RegionWakeReplay ("Watch a region wake up") — sit in the .sf-proof-pair
 * grid, which top-aligns its items (align-items: start). The sample dossier
 * miniature carried a 16px per-card TOP margin while the replay carried 0, so
 * the two exhibits started 16px apart. This pins that both compact miniatures
 * expose the SAME (zero) top offset, so their tops align.
 *
 * Both REAL components are exercised (compact mode); the store is mocked to the
 * anon + no-settlement state that passes their self-gates.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

let storeState = { auth: { tier: 'anon' }, settlement: null };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

const HomeSampleDossier = (await import('../../src/components/home/HomeSampleDossier.jsx')).default;
const RegionWakeReplay = (await import('../../src/components/home/RegionWakeReplay.jsx')).default;

/** Top component of an inline `margin` shorthand (`<top> …`). */
function topMargin(el) {
  return el.style.margin.trim().split(/\s+/)[0];
}

describe('C1r-d — proof-pair miniatures start at the same height', () => {
  test('both compact exhibits carry a zero top offset, so their tops align', () => {
    const { container: c1 } = render(<HomeSampleDossier compact />);
    const sample = c1.querySelector('section[aria-label="Sample settlement dossier"]');
    expect(sample).not.toBeNull();

    const { container: c2 } = render(<RegionWakeReplay compact />);
    const replay = c2.querySelector('[data-testid="region-wake-replay"]');
    expect(replay).not.toBeNull();

    // Tops align: identical top offset, and it is zero (the 16px sample-dossier
    // offset was killed so the grid's align-items:start lands both at the row top).
    expect(topMargin(sample)).toBe(topMargin(replay));
    expect(['0', '0px']).toContain(topMargin(sample));
  });
});
