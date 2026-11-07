/** @vitest-environment jsdom */
/**
 * F2 REPEAT-ONCE (docs/SOAK_1000_RUNG1B_2026-11-04.md §5 F2; X-50, docs/UX_CONSOLIDATION_2026-10-30.md:
 * a fact is printed once per tab). Measured in docs/F2_REPEAT_ONCE_2026-11-04.md.
 *
 * Tonight: two people to voice can carry the same want (two NPCs given one structural goal). The
 * composer (tonightSheet.js :: peopleOf) voices it once, on the first; the second reads "Wants the
 * same as {first}." Traditions: two traditions kept in the same two-week window print the calendar
 * line once; the second card reads "Kept in the same weeks as {first}."
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

import TonightSheet from '../../src/components/TonightSheet.jsx';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

afterEach(cleanup);

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

describe('F2: a sentence printed once per tab', () => {
  // soak1k-12 -> soak1k-202 at 1e28faf1f (lane RUNG2-F13 unit 3, CRISIS-CAST-SENSE, the chair's ruling rung 2 §3c: a
  // person voiced from the crisis cast wants what the ROLE wants, CAST_WANTS). soak1k-12's first voice is now a cast
  // person with the role's want, so its two people no longer share one; measured: this arm green at 1e28faf1f^
  // (f7127dd20), red at 1e28faf1f. The tip voices a shared want on ONE of soak1k-0..299, soak1k-202 (searched by
  // composeTonightSheet over the corpus), so the arm now reads that birth; the assertions are unchanged.
  it('soak1k-202: the Tonight sheet prints the shared want once, and the second person names the first', async () => {
    await ensureLaws();
    const s = normalizeSettlement(birth(202).settlement);
    const sheet = composeTonightSheet(s);
    const { container } = render(<TonightSheet sheet={sheet} palette={{}} />);
    const text = container.textContent || '';
    const WANT = 'identify who the betrayer was before they do further damage.';
    expect(countOf(text, WANT)).toBe(1);
    const first = sheet.people.find((p) => p.line === WANT && !p.sameAs);
    const second = sheet.people.find((p) => p.sameAs);
    expect(first && second).toBeTruthy();
    expect(second.sameAs).toBe(first.name);
    expect(text).toContain(`Wants the same as ${first.name}.`);
  });

  it('soak1k-48: the Traditions tab prints "Kept in Seedtime, the eleventh and twelfth weeks." once, and the second tradition names the first', async () => {
    await ensureLaws();
    const s = normalizeSettlement(birth(48).settlement);
    const { container } = render(<TraditionsTab settlement={s} />);
    const text = container.textContent || '';
    expect(countOf(text, 'Kept in Seedtime, the eleventh and twelfth weeks.')).toBe(1);
    expect(text).toContain('Kept in the same weeks as The Common Procession.');
    expect(text).toContain('The Old Greening Contest');
  });
});
