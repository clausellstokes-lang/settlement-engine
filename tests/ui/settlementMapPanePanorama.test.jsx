/**
 * @vitest-environment jsdom
 *
 * settlementMapPanePanorama.test.jsx — THE PANORAMA PROJECTION view toggle (#38).
 *
 * The pane exposes a Plan / Panorama view switch (available to every viewer — viewing
 * is free). Flipping to Panorama mounts the static oblique overlay (data-town-panorama)
 * that re-poses the SAME model; flipping back removes it. The plan svg stays mounted
 * behind the overlay (an instant flip). WYSIWYG holds because the overlay reads the
 * same model the plan does.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

afterEach(cleanup);

/** The Plan/Panorama Segmented button whose label matches. */
function viewButton(container, label) {
  const toggle = container.querySelector('[data-town-view-toggle]');
  return [...toggle.querySelectorAll('button')].find((b) => b.textContent.trim() === label);
}

describe('SettlementMapPane — panorama view toggle', () => {
  test('defaults to plan; the panorama overlay is absent until toggled', () => {
    const fx = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'pano-ui-1' });
    const { container } = render(<SettlementMapPane settlement={fx} />);
    expect(viewButton(container, 'Plan')).toBeTruthy();
    expect(viewButton(container, 'Panorama')).toBeTruthy();
    expect(viewButton(container, 'Plan').getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-town-panorama]')).toBeNull(); // not shown yet
  });

  test('clicking Panorama mounts the oblique overlay and re-poses the model', () => {
    const fx = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'pano-ui-2' });
    const { container } = render(<SettlementMapPane settlement={fx} />);
    fireEvent.click(viewButton(container, 'Panorama'));
    const overlay = container.querySelector('[data-town-panorama]');
    expect(overlay).toBeTruthy();
    expect(overlay.tagName.toLowerCase()).toBe('svg');
    // the overlay actually drew geometry (the projected town), not an empty frame
    expect(overlay.querySelectorAll('polygon, line, rect, circle, path').length).toBeGreaterThan(0);
    expect(viewButton(container, 'Panorama').getAttribute('aria-pressed')).toBe('true');
  });

  test('flipping back to Plan removes the overlay (the plan stayed mounted behind it)', () => {
    const fx = makeTownFixture({ tier: 'town', terrain: 'hills', walls: true, water: false, seed: 'pano-ui-3' });
    const { container } = render(<SettlementMapPane settlement={fx} />);
    fireEvent.click(viewButton(container, 'Panorama'));
    expect(container.querySelector('[data-town-panorama]')).toBeTruthy();
    fireEvent.click(viewButton(container, 'Plan'));
    expect(container.querySelector('[data-town-panorama]')).toBeNull();
    // the interactive plan is still there (districts render)
    expect(container.querySelectorAll('[data-town-district]').length).toBeGreaterThan(0);
  });

  test('the panorama also works on a v2 settlement (marker carried in mapEdits)', () => {
    const fx = { ...makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'pano-ui-v2' }), mapEdits: { layoutLawVersion: 2 } };
    const { container } = render(<SettlementMapPane settlement={fx} />);
    fireEvent.click(viewButton(container, 'Panorama'));
    const overlay = container.querySelector('[data-town-panorama]');
    expect(overlay).toBeTruthy();
    expect(overlay.querySelectorAll('polygon, path, rect').length).toBeGreaterThan(0);
  });
});
