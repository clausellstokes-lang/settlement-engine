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

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

describe('SM-5 — edge annotations (deliverable 3)', () => {
  test('named neighbours appear as on-map exit labels and in the Roads out section', () => {
    stubMatchMedia(true);
    // ⚠ THE PERSISTED SHAPE, not the writer-less `neighbors[]` this fixture used to
    // build. Reading that dead spelling made buildEdgeAnnotations return [] for every
    // real settlement, so this very test passed against a surface the app never
    // rendered — the fixture and the reader agreed with each other and with nothing
    // else. `neighbourNetwork` is what a saved settlement actually carries.
    const settlement = {
      ...v2Fixture(),
      neighbourNetwork: [
        { name: 'Ashford', relationshipType: 'trade_partner' },
        { name: 'Zephyr Hold', relationshipType: 'rival' },
      ],
    };
    const { container } = render(<SettlementMapPane settlement={settlement} canEdit={false} saveId={null} />);
    // on-map wayfinding labels
    const labels = container.querySelectorAll('[data-town-edge-label]');
    expect(labels.length).toBe(2);
    expect(container.textContent).toMatch(/→ Ashford/);
    // and the drawer gazetteer
    fireEvent.click(container.querySelector('[data-town-notes-toggle]'));
    const drawer = container.querySelector('[data-town-notes]');
    expect(within(drawer).getByText(/Roads out/)).toBeTruthy();
    expect(drawer.textContent).toMatch(/trade partner/);
  });

  test('a neighbour-less town shows no edge labels', () => {
    stubMatchMedia(true);
    const { container } = render(<SettlementMapPane settlement={v2Fixture()} canEdit={false} saveId={null} />);
    expect(container.querySelectorAll('[data-town-edge-label]').length).toBe(0);
  });

  test('a neighbour-less town HIDES the Roads out section rather than heading an empty one', () => {
    // ⭐ THE RULING (owner, 2026-08-11): a freshly generated settlement binds no
    // neighbour — `neighbourNetwork` is written only by a DM's manual link or by
    // saves.js — and generation must NOT invent a destination to fill the gap. An
    // ABSENT section is honest; an empty heading implies data went missing.
    //
    // ⚠⚠ THIS NEGATIVE HAS THE RENDERED-SURFACE VACUITY: "the drawer does not say
    // 'Roads out'" is equally true when the section is correctly absent AND when the
    // drawer never mounted, the pane threw, or the toggle stopped selecting. So the
    // refusal is anchored on a LIVE SIBLING SECTION INSIDE THE SAME DRAWER — the
    // surveyor's read, which this v2 fixture legitimately lights. The anchor dies of
    // every drift that would fake this green, and survives the regression actually
    // being guarded (a RoadsSection that renders its heading on an empty list), so
    // the EXCLUSION arm is the one that fires and it names the true cause.
    stubMatchMedia(true);
    const { container } = render(<SettlementMapPane settlement={v2Fixture()} canEdit={false} saveId={null} />);
    fireEvent.click(container.querySelector('[data-town-notes-toggle]'));
    const drawer = container.querySelector('[data-town-notes]');
    expect(drawer).toBeTruthy();
    expectAbsentWithAnchor(
      drawer.textContent,
      'Roads out',
      'The surveyor',
      'an exit-road section with nothing honest to say is absent, not empty',
    );
  });

  test('a rendered road label is inert text — it never becomes a link to a settlement', () => {
    // ⭐ THE PIN THAT MATTERS MOST, at the CONSUMER end. `buildEdgeAnnotations` is
    // pinned to emit no identity (tests/domain/townMapEdgeAnnotations.test.js); this
    // is the other half — nothing downstream may TREAT the label as an entity. The
    // moment a road label becomes a link, a lookup, or a stored reference, the name
    // has been promoted to a settlement identity and the defect is rebuilt.
    //
    // The liveness anchor here is STRUCTURAL and executed: `getByText` THROWS when the
    // label is missing, so every assertion below is reached only on a surface that
    // genuinely rendered the label.
    stubMatchMedia(true);
    const settlement = {
      ...v2Fixture(),
      neighbourNetwork: [{ id: 'save-7f3a', name: 'Ashford', relationshipType: 'trade_partner' }],
    };
    const { container } = render(<SettlementMapPane settlement={settlement} canEdit={false} saveId={null} />);
    fireEvent.click(container.querySelector('[data-town-notes-toggle]'));
    const drawer = container.querySelector('[data-town-notes]');
    const row = within(drawer).getByText(/→ Ashford/);

    // it is plain text: not an anchor, not a button, carrying no navigation target
    expect(row.closest('a')).toBeNull();
    expect(row.closest('button')).toBeNull();
    expect(row.closest('[role="link"]')).toBeNull();
    expect(row.closest('[role="button"]')).toBeNull();
    // …and the persisted row's identity reached no rendered attribute anywhere in the
    // drawer or on the map — the label travelled as a STRING, alone.
    expect(drawer.querySelector('[data-settlement-id],[data-neighbour-id],[data-neighbor-id],[data-save-id]')).toBeNull();
    expect(drawer.innerHTML.includes('save-7f3a')).toBe(false);
    expect(container.querySelector('[data-town-edge-labels]').innerHTML.includes('save-7f3a')).toBe(false);
    // the on-map sign is non-interactive by construction, so it cannot become a target
    expect(container.querySelector('[data-town-edge-labels]').style.pointerEvents).toBe('none');
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
