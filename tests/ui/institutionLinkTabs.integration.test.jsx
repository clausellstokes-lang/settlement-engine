/**
 * @vitest-environment jsdom
 *
 * tests/ui/institutionLinkTabs.integration.test.jsx — Wave E / batch E2.
 *
 * Drives the REAL wired surfaces end-to-end: a fully generated city settlement is
 * fed into the actual PowerTab and ServicesTab, and we confirm an institution
 * name inside each renders through InstitutionLink and opens the profile card with
 * derived content. This is the behaviour-observation for the two-consumer wiring
 * (not just the standalone primitive).
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent, within } from '@testing-library/react';
import { PowerTab } from '../../src/components/new/tabs/PowerTab.jsx';
import ServicesTab from '../../src/components/new/tabs/ServicesTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

const city = generateSettlementPipeline(
  { settType: 'city', terrain: 'river', tradeRouteAccess: 'road' },
  null,
  { seed: 'e2-tabs-integration', customContent: {} },
);

describe('PowerTab — faction institutions link to their profile', () => {
  test('a guild faction renders as an InstitutionLink and opens the card', () => {
    render(<PowerTab powerStructure={city.powerStructure} settlement={city} />);
    // "Merchant Guilds" resolves to the "Merchant guilds (...)" institution → a trigger.
    const trigger = screen.getByRole('button', { name: 'Merchant Guilds' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading').textContent).toMatch(/Merchant guilds/i);
    // The card carries at least one derived contribution row.
    expect(within(dialog).getAllByText(/Backed by|Processes|Gates|Services offered/).length).toBeGreaterThan(0);
  });
});

describe('ServicesTab — service institutions link to their profile', () => {
  test('an institution under a service renders as an InstitutionLink and opens the card', () => {
    render(<ServicesTab services={city.availableServices} settlement={city} />);
    // Every collapsed category must be opened to reach its service items; expand all.
    for (const btn of screen.getAllByRole('button')) {
      const label = btn.textContent || '';
      if (/▼/.test(label)) fireEvent.click(btn);
    }
    // At least one institution link is present across the opened categories.
    const links = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-haspopup') === 'dialog');
    expect(links.length).toBeGreaterThan(0);
    fireEvent.click(links[0]);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
