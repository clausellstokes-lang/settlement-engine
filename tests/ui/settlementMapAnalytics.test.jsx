/**
 * @vitest-environment jsdom
 *
 * settlementMapAnalytics.test.jsx — SM-5 (7) the map-layer capture points fire.
 *
 * Renders the real pane with `track` mocked and asserts each legibility signal emits
 * the ONE feature-discriminated event (town_map_layer_used) with the right feature —
 * the coordinator's "event-emission test per capture point", at the integration level.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

const { trackSpy } = vi.hoisted(() => ({ trackSpy: vi.fn() }));
vi.mock('../../src/lib/analytics.js', async () => {
  const actual = await vi.importActual('../../src/lib/analyticsEvents.js');
  return { track: trackSpy, EVENTS: actual.EVENTS };
});

import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

function stubMatchMedia(matches) {
  window.matchMedia = (q) => ({
    matches, media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}

const featuresFired = () => trackSpy.mock.calls
  .filter(([event]) => event === 'town_map_layer_used')
  .map(([, props]) => props.feature);

const v2WithNeighbors = () => ({
  ...makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'mla-ui' }),
  mapEdits: { layoutLawVersion: 2 },
  // The PERSISTED neighbour shape — `neighbors[]` has no writer anywhere in the
  // estate, so a fixture built on it fired no edge-label analytics in the app.
  neighbourNetwork: [{ name: 'Ashford', relationshipType: 'trade_partner' }],
});

beforeEach(() => { trackSpy.mockClear(); stubMatchMedia(true); });
afterEach(cleanup);

describe('map-layer analytics — capture points fire', () => {
  test('the generation profile + edge-labels-visible fire on mount', () => {
    render(<SettlementMapPane settlement={v2WithNeighbors()} canEdit={false} saveId={null} />);
    const fired = featuresFired();
    expect(fired).toContain('render');
    expect(fired).toContain('edge_labels');
    // the render event carries the coarse v2 profile
    const renderCall = trackSpy.mock.calls.find(([, p]) => p.feature === 'render');
    expect(renderCall[1].layoutVersion).toBe(2);
    expect(renderCall[1].morphology).toBeTruthy();
  });

  test('lens switch, panorama, provenance hover, and change-view drawer each fire', () => {
    const { container } = render(<SettlementMapPane settlement={v2WithNeighbors()} canEdit={false} saveId={null} />);
    trackSpy.mockClear();

    fireEvent.click(container.querySelector('[data-town-lens="accessible"]'));
    fireEvent.click(container.querySelector('[data-town-view-toggle] button[aria-label*="Panorama" i]') || container.querySelectorAll('[data-town-view-toggle] button')[1]);
    fireEvent.pointerEnter(container.querySelector('[data-town-district]'), { clientX: 100, clientY: 100 });
    fireEvent.click(container.querySelector('[data-town-notes-toggle]'));

    const fired = featuresFired();
    expect(fired).toContain('lens_switch');
    expect(fired).toContain('panorama');
    expect(fired).toContain('provenance_hover');
    expect(fired).toContain('change_view');
    // lens_switch carries the coarse lens id (accessible = the a11y lens selection)
    const lensCall = trackSpy.mock.calls.find(([, p]) => p.feature === 'lens_switch');
    expect(lensCall[1].lens).toBe('accessible');
  });

  test('provenance_hover fires at most once per settlement (deduped)', () => {
    const { container } = render(<SettlementMapPane settlement={v2WithNeighbors()} canEdit={false} saveId={null} />);
    trackSpy.mockClear();
    const district = container.querySelector('[data-town-district]');
    fireEvent.pointerEnter(district, { clientX: 100, clientY: 100 });
    fireEvent.pointerEnter(district, { clientX: 120, clientY: 120 });
    expect(featuresFired().filter((f) => f === 'provenance_hover')).toHaveLength(1);
  });
});
