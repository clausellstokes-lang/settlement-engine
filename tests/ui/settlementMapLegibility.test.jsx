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
import { makeTownFixture, makeFabricMirror } from '../fixtures/townMapFixtures.js';

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

describe('SM-5 — the change view (deliverable 2)', () => {
  test('a lit map shows recent upheavals in the What changed section', () => {
    stubMatchMedia(true);
    const settlement = {
      ...v2Fixture(),
      urbanFabric: makeFabricMirror(),
      calamityHistory: [{ type: 'plague', name: 'The Sickness', year: 38, tick: 200, deaths: 120, k: 1, targets: ['t'] }],
    };
    const { container } = render(<SettlementMapPane settlement={settlement} canEdit={false} saveId={null} />);
    fireEvent.click(container.querySelector('[data-town-notes-toggle]'));
    const drawer = container.querySelector('[data-town-notes]');
    expect(within(drawer).getByText(/What changed/)).toBeTruthy();
    expect(drawer.textContent).toMatch(/Rebuilt/);
    expect(drawer.textContent).toMatch(/Fire damage/);
  });

  test('a dark-fabric map whispers instead of showing content', () => {
    stubMatchMedia(true);
    // v2 map (has a story ⇒ drawer opens) but NO fabric and NO calamity ⇒ dark change view.
    const { container } = render(<SettlementMapPane settlement={v2Fixture()} canEdit={false} saveId={null} />);
    fireEvent.click(container.querySelector('[data-town-notes-toggle]'));
    const drawer = container.querySelector('[data-town-notes]');
    expect(within(drawer).getByText(/What changed/)).toBeTruthy();
    // the Surveyor's-note whisper renders in place of change content (validated register)
    expect(drawer.textContent).toMatch(/A Note from the Surveyor/i);
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
