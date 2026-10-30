/** @vitest-environment jsdom */
/**
 * servicesTabHeader.test.jsx — the Services tab's counts strip and its search
 * field, at both widths.
 *
 * Two phone-legibility repairs (2026-09-18):
 *   • the counts strip's two spans were separated by MARGIN ALONE, so the strip
 *     read "15 servicesacross 8 categories" to a screen reader and to anyone who
 *     copied it. The gap is now a real text node as well.
 *   • the search placeholder named four examples and was cut off mid-word on a
 *     375px field ('…"horse", "fenc'), which reads as a rendering fault rather
 *     than a hint. Two examples on a phone, four on a desktop.
 *
 * jsdom has no matchMedia, so a controllable fake is installed and the modules
 * are reset per case — useIsMobile keeps one shared store per breakpoint, and it
 * would otherwise leak the previous case's answer into this one.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

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

const SERVICES = {
  healing: [{ name: 'Herbalist', institution: 'The Green Door' }, { name: 'Bonesetter' }],
  smithing: [{ name: 'Farrier', institution: 'Iron Row' }],
  lodging: [{ name: 'Common room' }],
};

const SETTLEMENT = { id: 'settlement.spacetest', name: 'Spacetest', tier: 'town' };

async function renderServices() {
  vi.resetModules();
  const { ServicesTab } = await import('../../src/components/new/tabs/ServicesTab.jsx');
  return render(<ServicesTab services={SERVICES} settlement={SETTLEMENT} narrativeNote={null} />);
}

beforeEach(() => installMatchMedia(false));
afterEach(cleanup);

describe('ServicesTab — the counts strip', () => {
  it('puts a real space between the service count and the category count', async () => {
    const { container } = await renderServices();
    // Four services across three categories, as one readable phrase.
    expect(container.textContent).toContain('4 services across 3 categories');

    // RS-15..RS-17 (chair rulings 2026-10-30): the strip is ONE line and an absence is
    // said ONCE. A town expects food, healing, goods, information and lodging; this one
    // lacks three, and the Not-available line is their only home on the page: no
    // "missing" chip, no Category Status grid with "not available" cards, no coaching
    // sentence after it, no "No impairments" chip, no footer repeating the strip.
    const text = container.textContent;
    expect(text).toContain('Not available for a town: Food & Drink, Goods & Crafts, Information.');
    expect(text.split('Not available').length - 1, 'the absence is said more than once').toBe(1);
    for (const cut of ['3 missing', 'Category Status', 'not available', 'No impairments',
      'look elsewhere', '4 services · 3 categories']) {
      expect(text, `the cut block "${cut}" is back`).not.toContain(cut);
    }
  });
});

describe('ServicesTab — the search placeholder', () => {
  it('names four examples on a desktop field', async () => {
    installMatchMedia(false);
    await renderServices();
    const field = screen.getByLabelText('Search services');
    expect(field.getAttribute('placeholder')).toBe(
      'Search services, "healing", "horse", "fence", "wizard"…',
    );
  });

  it('names two on a phone field, where four are clipped mid-word', async () => {
    installMatchMedia(true);
    await renderServices();
    const field = screen.getByLabelText('Search services');
    expect(field.getAttribute('placeholder')).toBe('Search services, "healing", "horse"…');
    // The accessible name is the same at both widths, so nothing is lost.
    expect(field.getAttribute('aria-label')).toBe('Search services');
  });
});
