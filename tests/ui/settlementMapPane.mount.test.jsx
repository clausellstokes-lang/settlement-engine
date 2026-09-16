/**
 * @vitest-environment jsdom
 *
 * settlementMapPane.mount.test.jsx — the SM-2 viewer renders the SM-1 model.
 *
 * A city fixture (quarters + a full institution roster) must produce the map
 * root, at least one landmark building, and at least one district polygon — and
 * NO <image> element (the canvas-taint / pure-vector law). The pane owns its own
 * <svg>, needs no store or providers (theme is plain constants, IconsContext
 * defaults off), so a bare render() suffices.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

afterEach(cleanup);

describe('SettlementMapPane — mount', () => {
  test('renders the map root, buildings, and districts for a city fixture', () => {
    const fx = makeTownFixture({ tier: 'city', terrain: 'riverside', walls: true, water: true, seed: 'sm2-mount' });
    const { container } = render(<SettlementMapPane settlement={fx} />);

    expect(container.querySelector('[data-town-map]')).toBeTruthy();
    expect(container.querySelectorAll('[data-town-building]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-town-district]').length).toBeGreaterThan(0);
  });

  test('renders pure vector — no <image> element (canvas-taint law)', () => {
    const fx = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'sm2-vec' });
    const { container } = render(<SettlementMapPane settlement={fx} />);

    expect(container.querySelector('image')).toBeNull();
    // The wrapper is present and self-owns exactly one <svg>.
    expect(container.querySelectorAll('svg').length).toBe(1);
  });

  test('a quarter-less small settlement still mounts (hamlet-cluster floor)', () => {
    const fx = makeTownFixture({ tier: 'thorp', terrain: 'plains', walls: false, water: false, seed: 'sm2-thorp', quarters: [] });
    const { container } = render(<SettlementMapPane settlement={fx} />);
    expect(container.querySelector('[data-town-map]')).toBeTruthy();
  });
});
