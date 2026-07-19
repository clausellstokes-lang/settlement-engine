/** @vitest-environment jsdom */
/**
 * traditionsTab.test.jsx — THE TRADITIONS wave (T-1). The dossier tab renders in
 * PREVIEW mode for a draft settlement (no engine mirror): it labels the register
 * "founding traditions", lists the derived observances by name with their window
 * phrase, and shows owner/last-outcome as "—" (they exist only where time exists).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { deriveFoundingTraditions, describeTraditionWindow } from '../../src/domain/traditions/genesis.js';

afterEach(cleanup);

const DRAFT = {
  name: 'Briarwatch',
  _seed: 'tab-preview-1',
  tier: 'city',
  population: 14000,
  config: { culture: 'germanic', terrainType: 'riverside', tradeRouteAccess: 'river' },
};

describe('TraditionsTab — preview mode (draft settlement)', () => {
  it('renders the founding-traditions register with each derived tradition', () => {
    const expected = deriveFoundingTraditions(DRAFT);
    expect(expected.length).toBeGreaterThan(0);

    render(<TraditionsTab settlement={DRAFT} />);

    // the register surface + the preview voice (textContent is robust to the
    // mixed-content intro paragraph's text-node splitting)
    const container = screen.getByTestId('traditions-tab');
    expect(container.textContent).toMatch(/founding traditions/i);
    expect(container.textContent).toMatch(/Briarwatch/);

    // every derived tradition renders by name, with its window phrase
    for (const rec of expected) {
      expect(screen.getByText(rec.name)).toBeTruthy();
      const phrase = describeTraditionWindow(rec.window);
      expect(screen.getAllByText(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).length).toBeGreaterThan(0);
    }

    // preview: ownership + outcomes read "—" (no time has passed)
    expect(screen.getAllByText(/Owner: —/).length).toBe(expected.length);
    expect(screen.getAllByText(/Last held: —/).length).toBe(expected.length);
  });

  it('renders an empty-state for a null settlement without throwing', () => {
    render(<TraditionsTab settlement={null} />);
    expect(screen.getByTestId('traditions-tab')).toBeTruthy();
    expect(screen.getByText(/No traditions are recorded/i)).toBeTruthy();
  });

  it('renders the engine mirror verbatim when present (forward-compat for T-2)', () => {
    const mirror = [{
      id: 'tradition.x.0', name: 'The Long Watch', coreMotif: { element: 'stars', act: 'vigil' },
      window: { startWeekOfYear: 40, weeks: 1 }, scaleBand: 4, ownerKey: 'fac.the_watch',
      ownerLabel: 'The Watch', deityRef: null, expression: { trappings: [], epithet: '' },
      mutationLog: [{ year: 12, kind: 'scale-up', cause: 'the town grew' }],
      lastHeldYear: 14, lastOutcome: 'triumph', suppressedBy: null, adoptedFrom: null,
    }];
    render(<TraditionsTab settlement={{ name: 'Karth', traditions: mirror }} />);
    expect(screen.getByText('The Long Watch')).toBeTruthy();
    expect(screen.getByText(/Owner: The Watch/)).toBeTruthy();
    expect(screen.getByText(/a triumph/)).toBeTruthy();
    expect(screen.getByText(/1 change recorded/)).toBeTruthy();
  });
});
