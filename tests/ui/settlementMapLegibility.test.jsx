/**
 * @vitest-environment jsdom
 *
 * settlementMapLegibility.test.jsx — SM-5 THE MAP EXPLAINS ITSELF (deliverable 1),
 * end-to-end through the real pane.
 *
 * A v2 map (layoutLawVersion 2) retains per-element provenance; hovering a district
 * shows its recorded cause(s), and the left-edge "Read" drawer surfaces the map-level
 * surveyor's read. A v1 map has neither — the section and the drawer are ABSENT
 * (graceful degradation, never a broken affordance).
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent, within } from '@testing-library/react';

import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

function stubMatchMedia(matches) {
  window.matchMedia = (q) => ({
    matches, media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}

const v2Fixture = () => ({
  ...makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'legib-v2' }),
  mapEdits: { layoutLawVersion: 2 },
});
const v1Fixture = () => makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'legib-v1' });

afterEach(cleanup);

describe('SM-5 — the map explains itself (v2 provenance)', () => {
  test('hovering a district shows its recorded cause(s)', () => {
    stubMatchMedia(true);
    const { container } = render(<SettlementMapPane settlement={v2Fixture()} canEdit={false} saveId={null} />);
    const district = container.querySelector('[data-town-district]');
    expect(district).toBeTruthy();
    fireEvent.pointerEnter(district, { clientX: 100, clientY: 100 });
    // The provenance section renders its label + at least one cause row.
    expect(document.body.textContent).toContain('Why it sits here');
  });

  test('the Read drawer surfaces the map-level surveyor’s read', () => {
    stubMatchMedia(true);
    const { container } = render(<SettlementMapPane settlement={v2Fixture()} canEdit={false} saveId={null} />);
    const toggle = container.querySelector('[data-town-notes-toggle]');
    expect(toggle).toBeTruthy();
    fireEvent.click(toggle);
    const drawer = container.querySelector('[data-town-notes]');
    expect(within(drawer).getByText(/The surveyor’s read/)).toBeTruthy();
    // the founding response mode is named (this coastal walled town founds to Fortify)
    expect(drawer.textContent).toMatch(/Fortify/);
  });
});

describe('SM-5 — graceful degradation (v1 has no provenance)', () => {
  test('a v1 district card shows no provenance section, and no drawer appears', () => {
    stubMatchMedia(true);
    const { container } = render(<SettlementMapPane settlement={v1Fixture()} canEdit={false} saveId={null} />);
    const district = container.querySelector('[data-town-district]');
    fireEvent.pointerEnter(district, { clientX: 100, clientY: 100 });
    expect(document.body.textContent).not.toContain('Why it sits here');
    // no story ⇒ (and no fabric / neighbours) ⇒ the whole drawer self-gates away
    expect(container.querySelector('[data-town-notes]')).toBeNull();
  });
});
