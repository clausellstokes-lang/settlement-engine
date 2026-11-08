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
import { composeTonightSheet, printsAsWant } from '../../src/domain/summary/tonightSheet.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

afterEach(cleanup);

/** @param {string} hay @param {string} needle */
const countOf = (hay, needle) => hay.split(needle).length - 1;

describe('F2: a sentence printed once per tab', () => {
  // soak1k-12 -> soak1k-202 at 1e28faf1f (lane RUNG2-F13 unit 3, CRISIS-CAST-SENSE, the chair's ruling rung 2 §3c: a
  // person voiced from the crisis cast wants what the ROLE wants, CAST_WANTS). soak1k-12's first voice is now a cast
  // person with the role's want, so its two people no longer share one; measured: this arm green at 1e28faf1f^
  // (f7127dd20), red at 1e28faf1f.
  // soak1k-202 -> soak1k-11 WITH ONE GOAL PLANTED TWICE (GREEN-BASE, 2026-11-08). REVIEW-INTAKE-4 (9ae0609e4, "no
  // roster carries one secret or one goal twice — cured at the draw sites") reached soak1k-202 at MERGE-R2's merge
  // 10b8f09b4 (the rung-2 side fc4cb0b9f voices the shared want; the integration side and the merge do not), and since
  // then NO birth voices a shared want: measured by composeTonightSheet over soak1k-0..999 at the integration tip, 0 of
  // 1,000. The fold still guards every record a birth does not write (an edited goal, an authored person), so the arm
  // reads a real birth and plants the duplicate an edit can make: the second voiced person takes the first's goal. The
  // seed is the lowest whose sheet voices two non-cast wants at the integration tip AND at each of the nine wave-lane
  // tips (11, 27 at all ten). The assertions are unchanged.
  it('soak1k-11, one goal planted on two people: the Tonight sheet prints the shared want once, and the second person names the first', async () => {
    await ensureLaws();
    const born = normalizeSettlement(birth(11).settlement);
    const voiced = composeTonightSheet(born).people.filter((p) => printsAsWant(p) && p.line && p.why !== 'cast');
    expect(voiced.length, 'two people voice a want of their own on the born sheet').toBeGreaterThanOrEqual(2);
    expect(voiced[0].line, 'a birth carries no goal twice (REVIEW-INTAKE-4)').not.toBe(voiced[1].line);
    const [a, b] = voiced.map((p) => Number(/\d+/.exec(p.sourcePath)[0]));
    const s = structuredClone(born);
    s.npcs[b].goal = structuredClone(s.npcs[a].goal);
    const sheet = composeTonightSheet(s);
    const { container } = render(<TonightSheet sheet={sheet} palette={{}} />);
    const text = container.textContent || '';
    const WANT = voiced[0].line;
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
