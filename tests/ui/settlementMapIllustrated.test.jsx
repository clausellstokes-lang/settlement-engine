/**
 * @vitest-environment jsdom
 *
 * settlementMapIllustrated.test.jsx — THE ILLUSTRATED TOWN (IT-1): the pane's underlay.
 *
 * Picking the illustrated lens mounts the STATIC op-list underlay (the same
 * buildTownMapDrawList the exports use) UNDER the interactive layers: the plain visual
 * layers self-suppress (the underlay draws them), the interactive district/building
 * hit-targets stay mounted (so hover / pin / edit still work), and switching back to a
 * re-skin lens tears the underlay down. This is the two-render-paths cure on screen.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

afterEach(cleanup);

const fixture = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'it1-ui' });

describe('SettlementMapPane — the illustrated underlay', () => {
  test('picking the illustrated lens mounts the underlay with glyph art', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit={false} saveId={null} />);
    // the lens picker offers the illustrated lens (a pickable base lens)
    const pick = container.querySelector('[data-town-lens="illustrated"]');
    expect(pick).toBeTruthy();
    // not present until picked
    expect(container.querySelector('[data-town-illustrated]')).toBeNull();

    fireEvent.click(pick);
    const underlay = container.querySelector('[data-town-illustrated]');
    expect(underlay).toBeTruthy();
    // the underlay actually drew art (glyph faces / roofs / details as poly/line/circle)
    expect(underlay.querySelectorAll('polygon, line, circle, path').length).toBeGreaterThan(20);
    // pointer events are off so the interactive layers underneath still fire
    expect(underlay.getAttribute('style') || '').toContain('pointer-events: none');
  });

  test('the interactive district / building hit-targets stay mounted in illustrated mode', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit={false} saveId={null} />);
    fireEvent.click(container.querySelector('[data-town-lens="illustrated"]'));
    expect(container.querySelectorAll('[data-town-district]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-town-building]').length).toBeGreaterThan(0);
    // the plain JSX water polygon is suppressed (the underlay draws water instead)
    expect(container.querySelector('[data-town-water]')).toBeNull();
  });

  test('switching back to a re-skin lens tears the underlay down (and restores plain water)', () => {
    const { container } = render(<SettlementMapPane settlement={fixture} canEdit={false} saveId={null} />);
    fireEvent.click(container.querySelector('[data-town-lens="illustrated"]'));
    expect(container.querySelector('[data-town-illustrated]')).toBeTruthy();
    fireEvent.click(container.querySelector('[data-town-lens="parchment"]'));
    expect(container.querySelector('[data-town-illustrated]')).toBeNull();
    expect(container.querySelector('[data-town-water]')).toBeTruthy(); // plain water restored
  });
});
