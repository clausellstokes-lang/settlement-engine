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
 *   • CHROME KEEPS ITS OWN, LOWER FLOOR — labels, eyebrows and counts stay two
 *     steps under the prose, which is what makes the prose findable.
 *
 * ⭐ THAT THIRD LINE USED TO READ "chrome is untouched at both widths", AND THE
 * CHAIR AMENDED IT (2026-09-18). "Keeps its own scale" had been read as "may
 * render at any size", so a sweep had only two moves for a long piece of
 * furniture — leave it at 10px, or promote it to prose at 14px, flattening it
 * into the sentence it labels. `proseScale.js` gained `PHONE_CHROME_FLOOR` and
 * `chromeFontSize`: on a phone PROSE >= 14px and CHROME >= 12px, and the
 * DIFFERENCE between them is the hierarchy. Desktop is still the identity at
 * both, which is what the paired cases below prove.
 *
 * jsdom has no matchMedia, so a controllable fake is installed and the modules
 * are reset per case: useIsMobile keeps one shared store per breakpoint and
 * would otherwise leak the previous case's answer.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { proseFontSize, PHONE_CHROME_FLOOR, PHONE_PROSE_FLOOR } from '../../src/design/proseScale.js';

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

  /**
   * ⭐ RE-AIMED AT THE AMENDED RULING (2026-09-18). This asserted 10px at BOTH
   * widths and was titled "chrome is not prose", which was the right reading
   * while `proseScale.js` said chrome was EXEMPT. The chair then amended it —
   * chrome carries a floor of its own, 12px — because "keeps its own scale" had
   * been read as "may render at any size", and the sweep that followed had only
   * two moves for a long piece of furniture: leave it at 10px or promote it to
   * prose at 14px.
   *
   * The chip is still NOT prose, and that is what this now proves properly: it
   * takes the CHROME floor on a phone, two steps below the 14px the wants line
   * above it takes, and its own 10px step on a desktop. Asserting one number at
   * both widths could not tell those two rules apart.
   */
  const secretChip = (container) =>
    [...container.querySelectorAll('span')].find((s) => /^Secret: $/.test(s.textContent));

  it('takes the CHROME floor on a phone — furniture, floored, but never prose', async () => {
    installMatchMedia(true);
    const { container } = await renderCard();
    const chip = secretChip(container);
    expect(chip, 'the Secret label chip should still render').toBeTruthy();
    expect(px(chip)).toBe(PHONE_CHROME_FLOOR);
    expect(px(chip), 'the chip was promoted to prose, flattening it into the line it labels')
      .toBeLessThan(PHONE_PROSE_FLOOR);
  });

  it('keeps its own 10px step on a desktop — the floors are a phone rule', async () => {
    installMatchMedia(false);
    const { container } = await renderCard();
    const chip = secretChip(container);
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
