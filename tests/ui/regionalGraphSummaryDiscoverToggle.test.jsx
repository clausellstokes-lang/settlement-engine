/** @vitest-environment jsdom */
/**
 * regionalGraphSummaryDiscoverToggle.test.jsx — Discover is a TRUE TOGGLE.
 *
 * Owner order (2026-07-22): "hitting discover after opening it should close
 * it." The Regional-graph "Discover" control reveals the discovered-suggestions
 * section on the first press; a second press must CLOSE it (the reported bug was
 * that re-clicking re-ran discovery and never collapsed the section).
 *
 * This pins the toggle at the component:
 *   • Default-open when the graph already carries suggested channels (a reload
 *     must not hide candidates discovered in an earlier session).
 *   • Press → the suggestions section closes; the control reports
 *     aria-expanded=false and does NOT re-run discovery (onDiscover unused).
 *   • Press again → discovery runs (onDiscover) and the section re-opens.
 *   • The control is a native <button> (keyboard-reachable per E-I).
 *
 * The causal-chain viewer is out of scope for the toggle, so it is stubbed to
 * keep the render focused on the suggestions section the toggle governs.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

vi.mock('../../src/components/region/RegionalCausalChainViewer.jsx', () => ({
  default: () => null,
}));

import RegionalGraphSummary from '../../src/components/region/RegionalGraphSummary.jsx';

// A two-settlement campaign whose persisted graph ALREADY holds one suggested
// channel — so the section is open by default and the first press exercises the
// close path (the exact "opening it should close it" case).
function campaignWithSuggestion() {
  return {
    id: 'camp-toggle',
    regionalGraph: {
      schemaVersion: 2,
      nodes: [
        { id: 's1', name: 'Alpha', settlementId: 's1' },
        { id: 's2', name: 'Beta', settlementId: 's2' },
      ],
      edges: [],
      channels: [{
        id: 'channel.trade_dependency.s1.s2.grain',
        type: 'trade_dependency',
        from: 's1',
        to: 's2',
        status: 'suggested',
        visibility: 'public',
        strength: 0.8,
        confidence: 0.7,
        goods: [{ id: 'grain', label: 'Grain', category: 'food', criticality: 0.9 }],
      }],
      queuedImpacts: [],
      eventLog: [],
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  };
}

const discoverBtn = () => screen.getByRole('button', { name: 'Discover' });

describe('RegionalGraphSummary — Discover is a true toggle', () => {
  afterEach(cleanup);

  it('opens by default with existing suggestions, closes on press, re-opens (and re-discovers) on the next press', () => {
    const onDiscover = vi.fn();
    render(
      <RegionalGraphSummary
        campaign={campaignWithSuggestion()}
        settlementCount={2}
        onDiscover={onDiscover}
      />
    );

    // OPEN by default (the graph already has a suggested channel).
    expect(screen.queryByText(/trade dependency/i)).not.toBeNull();
    expect(discoverBtn().getAttribute('aria-expanded')).toBe('true');
    expect(discoverBtn().getAttribute('title')).toBe('Hide discovered channels');

    // PRESS → the section CLOSES; discovery is NOT re-run on close.
    fireEvent.click(discoverBtn());
    expect(screen.queryByText(/trade dependency/i)).toBeNull();
    expect(discoverBtn().getAttribute('aria-expanded')).toBe('false');
    expect(discoverBtn().getAttribute('title')).toBe('Discover regional channels');
    expect(onDiscover).not.toHaveBeenCalled();

    // PRESS AGAIN → discovery runs and the section RE-OPENS.
    fireEvent.click(discoverBtn());
    expect(onDiscover).toHaveBeenCalledWith('camp-toggle');
    expect(screen.queryByText(/trade dependency/i)).not.toBeNull();
    expect(discoverBtn().getAttribute('aria-expanded')).toBe('true');
  });

  it('the Discover control is a native, keyboard-reachable button (E-I)', () => {
    render(
      <RegionalGraphSummary
        campaign={campaignWithSuggestion()}
        settlementCount={2}
        onDiscover={vi.fn()}
      />
    );
    // A real <button> is focusable and Enter/Space-activatable by the browser —
    // the keyboard-reachability contract without a custom key handler.
    expect(discoverBtn().tagName).toBe('BUTTON');
  });
});
