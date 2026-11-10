/** @vitest-environment jsdom */
/**
 * tests/components/aboutCurrent.test.jsx — ABOUT-CURRENT (2026-11-10): the Practical
 * Guide's lists hold to the product's own registries.
 *
 * THE OWNER (2026-11-10): "What are your thoughts on the about page? Can you update it
 * so that it's current?" The Guide had kept the header's old seat names (Settlements,
 * World Map, ten times "Settlements tab") and a flat thirteen-tab list after the
 * dossier regrouped its tabs. These pins bind each list to the source the product
 * renders from, so the Guide cannot fall behind again silently:
 *   1. the Navigation seats are the route table's NAV, in its order, each described;
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { NAV } from '../../src/lib/routes.js';
import HowToUse, { NAV_DESCRIPTIONS } from '../../src/components/HowToUse.jsx';

afterEach(cleanup);

// The page's FAQ and the living-world rungs read a few store selectors; the same
// minimal anon mock tests/components/aboutSplit.test.jsx uses.
const storeState = { auth: { tier: 'anon' } };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('ABOUT-CURRENT — the Navigation list is the header', () => {
  it('every header seat has a description and no description names a missing seat', () => {
    expect(Object.keys(NAV_DESCRIPTIONS).sort()).toEqual(NAV.map((n) => n.id).sort());
    for (const n of NAV) expect(NAV_DESCRIPTIONS[n.id], n.id).toBeTruthy();
  });

  it('the rendered Navigation rows carry the header labels in the header order', () => {
    const { container } = render(<HowToUse />);
    const nav = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Navigation');
    expect(nav, 'the Navigation sub-section renders').toBeTruthy();
    const labels = [...nav.parentElement.querySelectorAll('div > span:first-child')].map((s) => s.textContent);
    expect(labels.slice(0, NAV.length)).toEqual(NAV.map((n) => n.label));
  });
});
