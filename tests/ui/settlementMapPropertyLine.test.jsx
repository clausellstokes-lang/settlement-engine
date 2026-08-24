/**
 * @vitest-environment jsdom
 *
 * tests/ui/settlementMapPropertyLine.test.jsx — MP-1, THE PROPERTY-LINE HALO.
 *
 * The owner's acceptance, drawn (§494.3, §495.4e): hovering ANY member of a property
 * highlights the WHOLE property line ONCE, with no double-draw where members touch; a
 * building whose parcel is absent from the block highlights itself alone and never
 * invents a boundary; the halo is a BORDER as well as a tint so it survives
 * colour-blind and high-contrast modes; and it is FREE — no gate, anonymous included.
 *
 *   H1 THE HALO        border AND tint, the ring drawn exactly once, the yard punched
 *   H2 THE COMPOUND    every member of one property draws the SAME single boundary
 *   H3 THE ABSENT      no parcel, no block, no key ⇒ nothing drawn, nothing invented
 *   H4 THE POSTURE     it never takes a pointer, and it reads no entitlement
 *
 * ⚠ EVERY TEST IS REGISTERED STRAIGHT-LINE (the mapCartographySubTab precedent): a
 * `test(` inside a loop parks the WHOLE FILE out of the sovereignty lighting census.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import SettlementMapPropertyLine from '../../src/components/townMap/SettlementMapPropertyLine.jsx';

const LEAF_SRC = resolve(process.cwd(), 'src/components/townMap/SettlementMapPropertyLine.jsx');
const PANE_SRC = resolve(process.cwd(), 'src/components/townMap/SettlementMapPane.jsx');

/** A token-shaped value threaded in by the pane. The leaf declares no colour itself. */
const HALO = '#c8a24a';

const RING = [[100, 100], [300, 100], [300, 300], [100, 300]];
const HOUSE = [[120, 120], [180, 120], [180, 180], [120, 180]];
const OUTBUILDING = [[220, 220], [260, 220], [260, 260], [220, 260]];

/** ONE property, TWO structures on it — the owner's compound, as the block spells it:
 *  two building rows sharing a parcelId (§495.3, membership needs no new relation). */
const BLOCK = Object.freeze({
  schemaVersion: 2,
  wards: [],
  streets: { arterials: [], lanes: [], gateRefs: [], bridgeRefs: [] },
  parcels: [
    { id: 'parcel:one', wardId: 'ward:a', polygon: RING },
    { id: 'parcel:two', wardId: 'ward:a', polygon: [[500, 500], [600, 500], [600, 600]] },
  ],
  buildings: [
    { id: 'b:hall', parcelId: 'parcel:one', footprint: HOUSE, institutionRef: 'building:cat:hall' },
    { id: 'b:shed', parcelId: 'parcel:one', footprint: OUTBUILDING, institutionRef: 'building:cat:shed' },
    { id: 'b:far', parcelId: 'parcel:two', footprint: [[510, 510], [530, 510], [530, 530]], institutionRef: 'building:cat:far' },
  ],
});

const draw = (props = {}) => render(
  <svg>
    <SettlementMapPropertyLine cartography={BLOCK} halo={HALO} {...props} />
  </svg>,
);

const group = (container) => container.querySelector('[data-town-property-line]');
const paths = (container) => [...container.querySelectorAll('path')];

afterEach(() => cleanup());

describe('MP-1 H1 — the halo is a BORDER as well as a tint, and the yard is punched', () => {
  test('one hovered building draws exactly two paths: the yard and the boundary', () => {
    const { container } = draw({ anchorKey: 'cat:hall' });
    expect(paths(container)).toHaveLength(2);
    expect(group(container).getAttribute('data-town-property-line')).toBe('parcel:one');
  });

  test('the boundary is a STROKE with no fill — a tint alone would fail high contrast', () => {
    const { container } = draw({ anchorKey: 'cat:hall' });
    const border = paths(container).find((el) => el.getAttribute('fill') === 'none');
    // Anchored: the sibling path in the same group IS filled (asserted below), so a
    // missing border here is the stroke half being dropped, not an empty render.
    expect(border, 'the property line has no unfilled border path').toBeTruthy();
    expect(border.getAttribute('stroke')).toBe(HALO);
    expect(Number(border.getAttribute('stroke-width'))).toBeGreaterThan(0);
    expect(Number(border.getAttribute('stroke-opacity'))).toBeGreaterThan(0.5);
  });

  test('the yard is an even-odd fill whose holes are the members\' own footprints', () => {
    const { container } = draw({ anchorKey: 'cat:hall' });
    const yard = paths(container).find((el) => el.getAttribute('fill') === HALO);
    expect(yard).toBeTruthy();
    expect(yard.getAttribute('fill-rule')).toBe('evenodd');
    // The subtraction is the RENDERER's: the path carries the ring plus one subpath
    // per member, and no clipping code exists anywhere. Three subpaths — the parcel
    // and its two structures — is the measurable form of that claim.
    const d = yard.getAttribute('d');
    expect(d.match(/M /g)).toHaveLength(3);
    expect(d).toContain('100,100');
    expect(d).toContain('120,120');
    expect(d).toContain('220,220');
    expect(Number(yard.getAttribute('fill-opacity'))).toBeLessThan(0.4);
    expect(Number(yard.getAttribute('fill-opacity'))).toBeGreaterThan(0);
  });

  test('the boundary path is the ring ALONE — the yard\'s holes are not stroked twice', () => {
    const { container } = draw({ anchorKey: 'cat:hall' });
    const border = paths(container).find((el) => el.getAttribute('fill') === 'none');
    expect(border.getAttribute('d').match(/M /g)).toHaveLength(1);
    expectAbsentWithAnchor(border.getAttribute('d'), '120,120', '100,100', 'the property boundary path');
  });
});

describe('MP-1 H2 — the compound draws ONCE, whichever member is hovered', () => {
  test('hovering the OTHER structure on the same property draws the identical boundary', () => {
    // The owner's acceptance verbatim: "hovering any member of a property highlights
    // the WHOLE property line, once, with no double-draw where members touch."
    const first = draw({ anchorKey: 'cat:hall' });
    const hallPaths = paths(first.container).map((el) => el.getAttribute('d'));
    cleanup();
    const second = draw({ anchorKey: 'cat:shed' });
    expect(paths(second.container).map((el) => el.getAttribute('d'))).toEqual(hallPaths);
    expect(group(second.container).getAttribute('data-town-property-line')).toBe('parcel:one');
  });

  test('a member of a DIFFERENT property draws that one instead, so the join is real', () => {
    // Anti-vacuity for the arm above: two members answering the same boundary would
    // also hold of a component that ignored its key and always drew parcel:one.
    const { container } = draw({ anchorKey: 'cat:far' });
    expect(group(container).getAttribute('data-town-property-line')).toBe('parcel:two');
    expectAbsentWithAnchor(
      paths(container).find((el) => el.getAttribute('fill') === 'none').getAttribute('d'),
      '100,100', '500,500', 'the far property boundary path',
    );
  });
});

describe('MP-1 H3 — absent means absent; the overlay invents nothing', () => {
  test('a building the block carries no parcel for draws NOTHING at all', () => {
    // §495.5(2): PARCELS_PER_WARD is a tier band, so a building with no parcel row is
    // ORDINARY. It highlights itself alone — which is the pane's pre-existing square —
    // and this overlay adds no guessed boundary beside it.
    const { container } = draw({ anchorKey: 'cat:not-in-this-block' });
    expect(group(container)).toBeNull();
    expect(paths(container)).toHaveLength(0);
  });

  test('no hover key at all draws nothing', () => {
    expect(paths(draw({ anchorKey: null }).container)).toHaveLength(0);
  });

  test('a DARK cartography block draws nothing — the ordinary state, not a failure', () => {
    // The cartography rule is virtual with no default entry, so null is what every
    // world hands this leaf today. Anchored by the lit case in H1, which proves the
    // same component does draw when a block is present.
    expect(paths(draw({ cartography: null, anchorKey: 'cat:hall' }).container)).toHaveLength(0);
  });

  test('a MALFORMED block degrades to nothing rather than throwing into the pane', () => {
    // Deliberately unlike the cartography SHEET, which throws loudly on the same block
    // and answers with its A-4 notice. Here the block is an overlay source: a throw
    // would take the whole town map down over a decoration.
    const broken = { ...BLOCK, parcels: 'not an array' };
    expect(() => draw({ cartography: broken, anchorKey: 'cat:hall' })).not.toThrow();
    expect(paths(draw({ cartography: broken, anchorKey: 'cat:hall' }).container)).toHaveLength(0);
  });
});

describe('MP-1 H4 — the posture: no pointer, no gate', () => {
  test('the halo never takes a pointer, so it cannot steal the hover that summoned it', () => {
    const { container } = draw({ anchorKey: 'cat:hall' });
    expect(group(container).style.pointerEvents).toBe('none');
  });

  test('the leaf reads NO entitlement — viewing and interacting are free (§514.1b)', () => {
    // Owner ruling: editing the map is paywalled at every level; viewing and
    // interacting are not. A gate here would be as much a defect as a revenue leak,
    // so the absence is pinned structurally rather than left to review.
    // THE SUBJECT IS THE CODE, NOT THE PROSE — the cartographyColours.js lesson one step
    // on. This arm first failed against the leaf's own header, which NAMES the gate it
    // refuses; a source scan that reads documentation cannot tell a rule from its
    // violation. Comments are stripped exactly as townCartographyPaint.test.js's purity
    // scan strips them, so the header stays free to state the law in plain words.
    const code = readFileSync(LEAF_SRC, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    // Anchored: the STRIPPED code is proven non-trivial and proven to name the leaf's own
    // export, so the absences below are measurements rather than an over-eager strip, a
    // renamed file, or an emptied one.
    expect(code.length).toBeGreaterThan(500);
    expect(code).toMatch(/^export default function SettlementMapPropertyLine/m);
    for (const gate of ['canEdit', 'viewerCanAuthor', 'entitlement', 'premium', 'founder', 'useStore']) {
      expect(code.includes(gate), `the property-line halo must not read '${gate}'`).toBe(false);
    }
  });

  test('the pane mounts it OUTSIDE every authoring gate, keyed off pinned ?? hovered', () => {
    // The mount is one line in a max-lines-capped file, so it is pinned by source
    // rather than by driving the whole pane: this file's subject is the leaf.
    const pane = readFileSync(PANE_SRC, 'utf8');
    const mount = pane.split('\n').find((line) => line.includes('<SettlementMapPropertyLine'));
    expect(mount, 'the pane no longer mounts the property line').toBeTruthy();
    // `active` IS `pinned ?? hovered` (SettlementMapPane's own state machine), and the
    // halo is restricted to a BUILDING so a hovered district still highlights itself.
    expect(mount).toContain("active?.kind === 'building'");
    expect(mount).toContain('hoverKey');
    expect(mount.includes('canEdit'), 'the property-line mount must not be gated').toBe(false);
    expect(mount.includes('editing'), 'the property-line mount must not be gated').toBe(false);
  });
});
