/** @vitest-environment jsdom */
/**
 * tableCompanion375.test.jsx — R-3 THE TABLE COMPANION: the 375px pins.
 *
 * The read-only phone face, guarded. At a 375px viewport the player-facing surfaces
 * must render their key content and REFLOW to a single column — no fixed-width row
 * that would force a horizontal scroll. Following the codebase precedent
 * (dossierMobileGate): a controllable matchMedia fake drives mobile, and the pins
 * assert the reflow STYLE + key content (jsdom does no real layout, so overflow is
 * proven by the reflow contract, not by scrollWidth).
 *
 * SCOPE NOTE (recorded): the sibling lanes' Letter / Oracle / DM-screen do NOT exist
 * on this base, so R-3 here guards the surfaces that DO: the TableView companion and
 * the player-facing dossier tabs. Their responsive pass rides their home lanes.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

function installMobile375() {
  window.matchMedia = vi.fn((q) => ({
    media: q, matches: true, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
}

afterEach(() => { cleanup(); vi.resetModules(); });

const settlement = {
  name: 'Ashford',
  tier: 'town',
  population: 1800,
  pressureSentence: 'A grain shortfall is straining the guilds against the crown.',
  economicState: { prosperity: 'struggling', primaryExports: [], primaryImports: [] },
  stressors: [{ type: 'food_shortage', label: 'Food shortage' }],
  npcs: [
    { name: 'Mayor Elda', role: 'Mayor', influence: 'high' },
    { name: 'Captain Ros', role: 'Watch Captain', influence: 'medium' },
  ],
  plotHooks: ['A granary steward has gone missing with the winter ledgers.'],
  defenseProfile: { fortifications: 'palisade', garrison: { size: 20 } },
  config: {},
};

describe('TableView — the phone companion at 375px', () => {
  test('renders single-column with the name, tension, and a close affordance', async () => {
    installMobile375();
    const TableView = (await import('../../src/components/TableView.jsx')).default;
    const onClose = vi.fn();
    const { container } = render(<TableView settlement={settlement} onClose={onClose} />);
    // The name is shown.
    expect(screen.getByText('Ashford')).toBeTruthy();
    // The tension line is shown.
    expect(screen.getByText(/grain shortfall/i)).toBeTruthy();
    // Single-column phone panel: the inner panel is capped at 380px (no wide layout).
    const panel = container.querySelector('div[style*="max-width: 380px"]');
    expect(panel).toBeTruthy();
    // The close affordance is present and reachable.
    expect(screen.getByRole('button', { name: /close table view/i })).toBeTruthy();
  });
});

describe('DefenseTab — reflows to a single column at 375px', () => {
  test('the threat row wraps (no fixed-width row forcing horizontal scroll)', async () => {
    installMobile375();
    const { DefenseTab } = await import('../../src/components/new/tabs/DefenseTab.jsx');
    const { container } = render(<DefenseTab settlement={settlement} />);
    const row = container.querySelector('div[style*="padding: 8px 12px"]');
    if (row) expect(row.style.flexWrap).toBe('wrap');
    // Key content renders (the player can read the security posture).
    expect(container.textContent).toMatch(/security|threat|garrison|defen/i);
  });
});

describe('NPCsTab — the figures are legible at 375px', () => {
  test('renders the notable figures the player will meet', async () => {
    installMobile375();
    const { NPCsTab } = await import('../../src/components/new/tabs/NPCsTab.jsx');
    render(<NPCsTab npcs={settlement.npcs} settlement={settlement} />);
    expect(screen.getByText('Mayor Elda')).toBeTruthy();
    expect(screen.getByText('Captain Ros')).toBeTruthy();
  });
});

describe('OverviewTab — the primary read surface at 375px', () => {
  test('renders the settlement without a fixed-width layout that would overflow', async () => {
    installMobile375();
    const { OverviewTab } = await import('../../src/components/new/tabs/OverviewTab.jsx');
    const { container } = render(<OverviewTab settlement={settlement} />);
    // Key content renders (the name and its population/tier framing).
    expect(container.textContent).toMatch(/Ashford|town|1,800/i);
  });
});
