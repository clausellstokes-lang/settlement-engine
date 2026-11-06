/** @vitest-environment jsdom */
/**
 * X-50 ON THE TRADITIONS TAB, THREE IN ONE WINDOW (RUNG-2 LANDING phase C unit 3, 2026-11-06;
 * rung 2E's `X-50:boilerplate-twice` in soak1k-5255 and soak1k-5441).
 *
 * F2 REPEAT-ONCE (`TraditionsTab.jsx :: sameWindowPlan`) prints a shared window once and lets a
 * later card name the earlier one. It named the FIRST tradition of the window, so a third card in
 * the same window repeated the second's sentence word for word ("Kept in the same week as The
 * Common Offering." twice in soak1k-5255). Each later card now names the NEAREST earlier tradition
 * kept in that window: every sentence prints once, every claim stays true, and the two-tradition
 * case (soak1k-48, `repeatOnceTonightTraditions.test.jsx`) reads exactly as before.
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [], customContent: {}, auth: { tier: 'premium' }, isElevated: () => false };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

afterEach(cleanup);

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

describe('X-50: three traditions in one window print three different calendar lines', () => {
  it('soak1k-5255: the window prints once, and each later card names the nearest earlier one', async () => {
    await ensureLaws();
    const s = normalizeSettlement(birth(5255).settlement);
    const { container } = render(<TraditionsTab settlement={s} />);
    const text = container.textContent || '';
    expect(countOf(text, 'Kept in Deepwinter, the thirteenth week.')).toBe(1);
    expect(countOf(text, 'Kept in the same week as The Common Offering.')).toBe(1);
    expect(countOf(text, 'Kept in the same week as The Contest of the Standing Stones.')).toBe(1);
  });

  it('soak1k-5441: the same over a two-week window', async () => {
    await ensureLaws();
    const s = normalizeSettlement(birth(5441).settlement);
    const { container } = render(<TraditionsTab settlement={s} />);
    const text = container.textContent || '';
    expect(countOf(text, 'Kept in the same weeks as The Old Procession.')).toBe(1);
    expect(countOf(text, 'Kept in the same weeks as The Hearth Contest.')).toBe(1);
  });
});
