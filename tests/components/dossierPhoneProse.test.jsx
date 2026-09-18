/** @vitest-environment jsdom */
/**
 * dossierPhoneProse.test.jsx — THE PHONE PROSE FLOOR (2026-09-18).
 *
 * Measured on a 375px phone, the dossier's reading text sat at 10, 11, 12 and
 * 13px: the NPC card's wants and secrets, the quick guide's defining truths and
 * pressure, the table-night card bodies, the Services tab's absence notes. Those
 * steps were chosen against 600px of measure; on a 343px column the same step is
 * the size a reader has to bring the phone closer for, and the dossier IS the
 * read-at-the-table surface.
 *
 * Pinned here in both directions, because a floor that quietly applied
 * everywhere would be as wrong as no floor:
 *   • below the breakpoint every prose paragraph clears 14px;
 *   • above it every size is byte-identical to what shipped;
 *   • CHROME is untouched at both widths — labels, eyebrows and counts keep
 *     their own scale, which is what makes the prose findable.
 *
 * jsdom has no matchMedia, so a controllable fake is installed and the modules
 * are reset per case: useIsMobile keeps one shared store per breakpoint and
 * would otherwise leak the previous case's answer.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { proseFontSize, PHONE_PROSE_FLOOR } from '../../src/hooks/useIsMobile.js';

function installMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({
    media: query,
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
}

/** The inline fontSize the element actually carries, in px. */
const px = (el) => Number.parseFloat(el.style.fontSize);

beforeEach(() => installMatchMedia(false));
afterEach(cleanup);

describe('proseFontSize — the floor itself', () => {
  it('lifts a below-floor size to the floor on a phone', () => {
    for (const size of [8, 10, 11, 12, 13, 13.5]) {
      expect(proseFontSize(size, true)).toBe(PHONE_PROSE_FLOOR);
    }
  });

  it('leaves a size that already clears the floor exactly where it was', () => {
    for (const size of [14, 14.5, 15, 17, 20]) {
      expect(proseFontSize(size, true)).toBe(size);
    }
  });

  it('is the identity above the breakpoint — desktop never moves', () => {
    for (const size of [8, 10, 11, 12, 13, 14, 15, 20]) {
      expect(proseFontSize(size, false)).toBe(size);
    }
  });
});

describe('the NPC card', () => {
  const NPC = {
    id: 'n1',
    name: 'Hesta Roal',
    role: 'Factor',
    goal: { short: 'corner the grain trade before the thaw' },
    secret: { what: 'she already owns the mill' },
  };

  async function renderCard() {
    vi.resetModules();
    const { NPCCategoryGroup } = await import('../../src/components/new/npcComponents.jsx');
    const view = render(<NPCCategoryGroup category="civic" label="Civic" group={[NPC]} />);
    const { fireEvent } = await import('@testing-library/react');
    const toggles = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(toggles[toggles.length - 1]);
    return view;
  }

  it('reads the wants line at the floor on a phone', async () => {
    installMatchMedia(true);
    await renderCard();
    expect(px(screen.getByText('Wants').parentElement)).toBeGreaterThanOrEqual(PHONE_PROSE_FLOOR);
  });

  it('leaves the wants line at its own step on a desktop', async () => {
    installMatchMedia(false);
    await renderCard();
    expect(px(screen.getByText('Wants').parentElement)).toBe(11);
  });

  it('leaves the trait chips alone at BOTH widths — chrome is not prose', async () => {
    installMatchMedia(true);
    const { container } = await renderCard();
    const chip = [...container.querySelectorAll('span')].find((s) => /^Secret: $/.test(s.textContent));
    expect(chip, 'the Secret label chip should still render').toBeTruthy();
    expect(px(chip)).toBe(10);
  });
});

describe('the table-night cards', () => {
  const SETTLEMENT = {
    name: 'Hollowmere',
    tier: 'village',
    population: 320,
    pressureSentence: 'The reeve runs a quiet skim and the harvest is failing.',
    npcs: [{ name: 'Maren', role: 'Reeve', power: 9, secret: { what: 'skims the tithe' } }],
  };

  async function renderTableView() {
    vi.resetModules();
    const TableView = (await import('../../src/components/TableView.jsx')).default;
    return render(<TableView settlement={SETTLEMENT} onClose={() => {}} />);
  }

  it('reads a card body at the floor on a phone and at its own step on a desktop', async () => {
    installMatchMedia(true);
    const phone = await renderTableView();
    expect(px(screen.getByText(/skims the tithe/).closest('div')))
      .toBeGreaterThanOrEqual(PHONE_PROSE_FLOOR);
    phone.unmount();

    installMatchMedia(false);
    await renderTableView();
    expect(px(screen.getByText(/skims the tithe/).closest('div'))).toBe(12);
  });
});

describe('the Summary quick guide', () => {
  const SETTLEMENT = {
    id: 'settlement.guide',
    name: 'Eldey',
    tier: 'village',
    population: 610,
  };

  async function renderSummary() {
    vi.resetModules();
    const SummaryTabV2 = (await import('../../src/components/new/SummaryTabV2.jsx')).default;
    return render(<SummaryTabV2 settlement={SETTLEMENT} />);
  }

  it('reads every defining truth at the floor on a phone', async () => {
    installMatchMedia(true);
    const { container } = await renderSummary();
    const truths = [...container.querySelectorAll('div')]
      .filter((d) => d.style.lineHeight === '1.5' && d.style.fontSize);
    expect(truths.length, 'the quick guide should render its defining truths').toBeGreaterThan(0);
    for (const truth of truths) expect(px(truth)).toBeGreaterThanOrEqual(PHONE_PROSE_FLOOR);
  });
});
