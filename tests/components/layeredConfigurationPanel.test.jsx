/** @vitest-environment jsdom */
/**
 * layeredConfigurationPanel.test.jsx — the Create reorg (UX overhaul Phase 6).
 * Pins:
 *   • Foundations renders ALWAYS; Fine-tune / Deep-constraints are collapsibles.
 *   • The 17-archetype "Character" preset is a top-level Tier-1 card (out of
 *     SliderPanel).
 *   • Each Deep-constraints section keeps its wizard STEP ID and fires
 *     wizard_step_viewed when opened (funnel analytics continuity).
 *   • The premium "Place in Region" close-out card renders.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

const trackMock = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  track: (...a) => trackMock(...a),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Stub the heavy content panels to bare markers.
vi.mock('../../src/components/ConfigurationPanel.jsx', () => ({ default: () => <div data-testid="configuration-panel">foundations</div> }));
vi.mock('../../src/components/InstitutionalGrid.jsx', () => ({ default: () => <div data-testid="institutions-panel" /> }));
vi.mock('../../src/components/ServicesTogglePanel.jsx', () => ({ default: () => <div data-testid="services-panel" /> }));
vi.mock('../../src/components/TradeDynamicsPanel.jsx', () => ({ default: () => <div data-testid="trade-panel" /> }));
// CharacterPresetCard + PlaceInRegionCard read the store; render real wrappers
// over a store mock so the cards mount.
vi.mock('../../src/components/generate/CharacterPresetCard.jsx', () => ({ default: () => <div data-testid="character-preset-card" /> }));
vi.mock('../../src/components/generate/PlaceInRegionCard.jsx', () => ({ default: () => <div data-testid="place-in-region-card" /> }));

import LayeredConfigurationPanel from '../../src/components/generate/LayeredConfigurationPanel.jsx';

describe('LayeredConfigurationPanel — Create reorg', () => {
  beforeEach(() => trackMock.mockClear());
  afterEach(cleanup);

  it('renders Foundations always, the Character card top-level, and Place in Region', () => {
    render(<LayeredConfigurationPanel />);
    expect(screen.getByTestId('layered-configuration-panel')).toBeTruthy();
    // Foundations (the ConfigurationPanel) is always mounted.
    expect(screen.getByTestId('configuration-panel')).toBeTruthy();
    // Character preset promoted to a top-level card.
    expect(screen.getByTestId('character-preset-card')).toBeTruthy();
    // Place in Region close-out.
    expect(screen.getByTestId('place-in-region-card')).toBeTruthy();
  });

  it('Deep-constraints panels are collapsed by default, expand on click', () => {
    render(<LayeredConfigurationPanel />);
    // Not rendered until opened.
    expect(screen.queryByTestId('institutions-panel')).toBeNull();
    fireEvent.click(screen.getByText('Institutions'));
    expect(screen.getByTestId('institutions-panel')).toBeTruthy();
  });

  it('reports config step on mount and the deep section step ids on open', () => {
    render(<LayeredConfigurationPanel />);
    const stepViews = () => trackMock.mock.calls.filter(([ev]) => ev === 'WIZARD_STEP_VIEWED');
    expect(stepViews().some(([, p]) => p.step_id === 'config')).toBe(true);

    fireEvent.click(screen.getByText('Available Services'));
    expect(stepViews().some(([, p]) => p.step_id === 'services')).toBe(true);

    fireEvent.click(screen.getByText('Trade Dynamics'));
    expect(stepViews().some(([, p]) => p.step_id === 'trade')).toBe(true);
  });

  it('can suppress the Place in Region card', () => {
    render(<LayeredConfigurationPanel showPlaceInRegion={false} />);
    expect(screen.queryByTestId('place-in-region-card')).toBeNull();
  });
});
