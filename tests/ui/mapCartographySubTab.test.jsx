/**
 * @vitest-environment jsdom
 *
 * tests/ui/mapCartographySubTab.test.jsx — TC-5b-ii, THE PAINTER'S MOUNT.
 *
 * The acceptance denominator for the first user-visible cartography surface:
 * C1 (the reachable render), C2 (absence, never a disabled tab), C3 (the colour
 * binding, derived and total), C4 (no colour smuggled), C5 (A-4 degraded state,
 * and EMPTY is not MALFORMED), C6 (determinism of the rendered surface) and C7
 * (the seat guard — the tab exists without joining the persisted vocabulary).
 * C8, the lazy boundary, lives in tests/build/mapTabShellLazy.test.js because it
 * is a build-layer question.
 *
 * ⚠ EVERY TEST IS REGISTERED STRAIGHT-LINE. A `test(` inside a loop, or a
 * `describe` whose body is not straight-line, parks the WHOLE FILE in the
 * sovereignty lighting census — losing every other title in it too. Loops appear
 * only INSIDE test bodies, over assertions.
 *
 * ⚠ THE VACUITY TRAP THIS FILE IS BUILT AGAINST: `CARTOGRAPHY_PAINT_ROLES` has
 * ten members but only eight are reachable from a draw op — no ward kind maps to
 * `green` or `water`. C3 therefore binds over the ROLE VOCABULARY, never over
 * observed ops; an "every op's role resolves" test would be vacuous for exactly
 * the two members most likely to be forgotten.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { CARTOGRAPHY_PAINT_ROLES } from '../../src/domain/townCartography/cartographyPaintRoles.js';
import { buildCartographyDrawList } from '../../src/domain/townCartography/cartographyPaint.js';
import { color, semantic } from '../../src/design/tokens.js';
import {
  ROLE_TONE_ENDS,
  STREET_TONE_PERMILLE,
  resolveRoleFill,
} from '../../src/components/townMap/subtabs/cartographyColours.js';
import MapCartographySubTab from '../../src/components/townMap/subtabs/MapCartographySubTab.jsx';
import { createDisplayPrefsSlice } from '../../src/store/displayPrefsSlice.js';
import { readLastMapView } from '../../src/lib/lastMapView.js';

const ROOT = process.cwd();
const PALETTE_SRC = resolve(ROOT, 'src/components/townMap/subtabs/cartographyColours.js');
const PAINTER_SRC = resolve(ROOT, 'src/components/townMap/subtabs/MapCartographySubTab.jsx');

const PLAN_EXTENT = 1000;

// ── The seams the SHELL-mounted arms drive (C2, C7) ──────────────────────────

const h = vi.hoisted(() => ({
  prefs: null,
  // TC-5b-i's seam, mocked at the HOOK. This packet consumes the seam and never
  // builds it, so the arms below drive its four answers directly rather than
  // standing up the real compiler inside a jsdom test.
  cartography: { status: 'idle', block: null, planExtent: null, available: false },
}));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(h.prefs.getState()); }
  useStore.getState = () => h.prefs.getState();
  return { useStore };
});

vi.mock('../../src/components/townMap/useTownCartographyBlock.js', () => ({
  useTownCartographyBlock: () => h.cartography,
}));

vi.mock('../../src/lib/townScene/viewPolicy.js', async (importOriginal) => ({
  ...(await importOriginal()),
  detectTownSceneCapability: () => ({ available: false, reason: 'webgl2-unavailable' }),
}));

vi.mock('../../src/components/townMap/SettlementMapPane.jsx', () => ({
  default: (props) => <div data-testid="map-pane" data-presentation={props.presentation} />,
}));

vi.mock('../../src/components/townMap/subtabs/MapPlayerSubTab.jsx', () => ({
  default: () => <div data-testid="map-player" />,
}));

const { default: MapTabShell } = await import('../../src/components/townMap/MapTabShell.jsx');

// ── Fixtures ─────────────────────────────────────────────────────────────────

/** A lawful block: two wards, one arterial, one lane, one building = FIVE ops. */
const BLOCK = Object.freeze({
  schemaVersion: 1,
  wards: [
    { id: 'ward:a', kind: 'civic', polygon: [[0, 0], [400, 0], [400, 400], [0, 400]], tonePermille: 600 },
    { id: 'ward:b', kind: 'industrial', polygon: [[500, 500], [900, 500], [900, 900]], tonePermille: 300 },
  ],
  parcels: [{ id: 'parcel:a1', wardId: 'ward:a' }],
  buildings: [
    { id: 'bldg:a1', parcelId: 'parcel:a1', footprint: [[10, 10], [60, 10], [60, 60], [10, 60]], condition: 'sound' },
  ],
  streets: {
    arterials: [{ id: 'street:main', polyline: [[0, 200], [1000, 200]], classKind: 'arterial', widthPlan: 12 }],
    lanes: [{ id: 'street:back', polyline: [[200, 0], [200, 1000]], classKind: 'lane', widthPlan: 5 }],
  },
});

/** Lawful, and legitimately EMPTY — the frozen `[]` path, not a failure. */
const EMPTY_BLOCK = Object.freeze({
  schemaVersion: 1, wards: [], parcels: [], buildings: [],
  streets: { arterials: [], lanes: [] },
});

/** MALFORMED: `wards` is not an array, so the paint leaf THROWS `premise`. */
const MALFORMED_BLOCK = Object.freeze({ ...BLOCK, wards: 'not an array' });

/** The exact premise text the leaf throws for MALFORMED_BLOCK. */
const PREMISE_TEXT = 'cartography.wards must be an array';

const A4_HEADING = 'The surveyor’s sheet could not be drawn for this settlement.';
const A4_ROAD = 'The Plan view holds the same ground, and remains the precision fallback.';
const EMPTY_NARRATION = 'This settlement has nothing laid down on the surveyor’s sheet yet.';

/** Every value the token module publishes, lowercased — the "token-derived" oracle. */
const TOKEN_VALUES = new Set(
  [...Object.values(color), ...Object.values(semantic)]
    .filter((value) => typeof value === 'string')
    .map((value) => value.toLowerCase()),
);

const paint = (props = {}) => render(
  <MapCartographySubTab block={BLOCK} planExtent={PLAN_EXTENT} {...props} />,
);

const svgChildren = (container) => [...(container.querySelector('svg')?.children ?? [])];

function makePrefsStore() {
  return create(immer((...a) => ({ ...createDisplayPrefsSlice(...a) })));
}

async function mountShell(props = {}) {
  const utils = render(
    <MapTabShell settlement={{ id: 'alderport', name: 'Alderport' }} audience="dm" saveId="save-1" {...props} />,
  );
  await act(async () => {});
  await act(async () => {});
  return utils;
}

const tabNames = () => screen.getAllByRole('tab').map((el) => el.textContent);

beforeEach(() => {
  h.prefs = makePrefsStore();
  h.cartography = { status: 'idle', block: null, planExtent: null, available: false };
  localStorage.clear();
  window.history.replaceState({}, '', '/settlements/alderport');
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('TC-5b-ii C1 — the main reachable behavior', () => {
  test('the sheet renders ONE svg whose viewBox is built from the planExtent PROP', () => {
    const { container } = paint();
    const svg = container.querySelectorAll('svg');
    expect(svg).toHaveLength(1);
    expect(svg[0].getAttribute('viewBox')).toBe('0 0 1000 1000');
  });

  test('a different planExtent moves the viewBox, so the prop is genuinely read', () => {
    // Anti-vacuity for the assertion above: 1000 is also TOWN_SCENE_PLAN_EXTENT's
    // value, so a component that ignored the prop and restated the constant would
    // pass C1's first arm. This arm is the one it cannot pass.
    const { container } = paint({ planExtent: 640 });
    expect(container.querySelector('svg').getAttribute('viewBox')).toBe('0 0 640 640');
  });

  test('the emitted element count equals the draw list LENGTH IDENTITY', () => {
    const { container } = paint();
    const ops = buildCartographyDrawList(BLOCK);
    expect(ops).toHaveLength(
      BLOCK.wards.length + BLOCK.streets.arterials.length
      + BLOCK.streets.lanes.length + BLOCK.buildings.length,
    );
    expect(svgChildren(container)).toHaveLength(ops.length);
  });

  test('wards precede streets precede buildings, in the leaf\'s own emitted order', () => {
    const { container } = paint();
    const rendered = svgChildren(container)
      .map((el) => `${el.tagName.toLowerCase()}|${el.getAttribute('points')}`);
    // Derived from the LEAF, which is the ordering authority; the component may
    // only transcribe it.
    const expected = buildCartographyDrawList(BLOCK).map((op) => {
      const tag = op.op === 'street' ? 'polyline' : 'polygon';
      const vertices = op.op === 'street' ? op.polyline : op.polygon;
      return `${tag}|${vertices.map(([x, y]) => `${x},${y}`).join(' ')}`;
    });
    expect(rendered).toEqual(expected);
    // And stated by hand too, so a leaf that silently reordered would still red.
    expect(rendered.map((entry) => entry.split('|')[0]))
      .toEqual(['polygon', 'polygon', 'polyline', 'polyline', 'polygon']);
  });

  test('a street\'s pen width is its own widthPlan weighted by its own class', () => {
    const { container } = paint();
    const polylines = svgChildren(container).filter((el) => el.tagName.toLowerCase() === 'polyline');
    // arterial: 12 x 1000/1000 = 12. lane: 5 x 620/1000 = 3.1 -> 3 (round half up).
    expect(polylines.map((el) => el.getAttribute('stroke-width'))).toEqual(['12', '3']);
    expect(polylines.every((el) => el.getAttribute('fill') === 'none')).toBe(true);
  });
});

describe('TC-5b-ii C2 — absent, never present-and-disabled', () => {
  test('an unavailable block leaves the strip without a Cartography tab', async () => {
    h.cartography = { status: 'unavailable', block: null, planExtent: null, available: false };
    const { container } = await mountShell();
    expectAbsentWithAnchor(tabNames(), 'Cartography', 'Plan', 'the Map sub-tab strip');
    // The beside-it PRESENCE pin: Plan still renders, so the absence above is a
    // gate decision rather than a strip that failed to render at all.
    expect(container.querySelector('[data-testid="map-pane"]')).not.toBe(null);
    expect(container.querySelector('[data-map-cartography-subtab]')).toBe(null);
  });

  test('an IDLE (dark) seam is equally absent, and the leaf is never mounted', async () => {
    const { container } = await mountShell();
    expectAbsentWithAnchor(tabNames(), 'Cartography', 'Plan', 'the Map sub-tab strip (dark)');
    expect(container.querySelector('[data-map-cartography-subtab]')).toBe(null);
  });

  test('an available block seats the tab LAST, after Player View', async () => {
    h.cartography = { status: 'ready', block: BLOCK, planExtent: PLAN_EXTENT, available: true };
    await mountShell();
    expect(tabNames()).toEqual(['Plan', 'Panorama', 'Player View', 'Cartography']);
  });
});

describe('TC-5b-ii C3 — the colour binding is DERIVED and TOTAL', () => {
  test('the role map\'s keys are the frozen vocabulary, exact-set BOTH WAYS', () => {
    expect(CARTOGRAPHY_PAINT_ROLES).toHaveLength(10);
    expect([...Object.keys(ROLE_TONE_ENDS)].sort()).toEqual([...CARTOGRAPHY_PAINT_ROLES].sort());
    // Named explicitly: these two are unreachable from any ward kind, so a binding
    // built from observed ops would ship without them and nothing else would see it.
    expect(Object.keys(ROLE_TONE_ENDS)).toContain('green');
    expect(Object.keys(ROLE_TONE_ENDS)).toContain('water');
  });

  test('every role resolves, at every tone, to a six-digit value with NO float in it', () => {
    for (const role of CARTOGRAPHY_PAINT_ROLES) {
      for (const tone of [0, 1, 499, 500, 501, 999, 1000]) {
        expect(resolveRoleFill(role, tone), `${role}@${tone}`).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  test('both ends of every role ARE token values, and the ends are the tokens', () => {
    for (const role of CARTOGRAPHY_PAINT_ROLES) {
      const [ink, wash] = ROLE_TONE_ENDS[role];
      expect(TOKEN_VALUES.has(ink.toLowerCase()), `${role} ink end is a token`).toBe(true);
      expect(TOKEN_VALUES.has(wash.toLowerCase()), `${role} wash end is a token`).toBe(true);
      expect(resolveRoleFill(role, 0), `${role}@0`).toBe(ink.toLowerCase());
      expect(resolveRoleFill(role, 1000), `${role}@1000`).toBe(wash.toLowerCase());
    }
  });

  test('a HIGHER tone is BRIGHTER, the direction the landed condition ladder forces', () => {
    const channels = (value) => [1, 3, 5].map((at) => Number.parseInt(value.slice(at, at + 2), 16));
    for (const role of CARTOGRAPHY_PAINT_ROLES) {
      const dark = channels(resolveRoleFill(role, 0));
      const light = channels(resolveRoleFill(role, 1000));
      expect(light.every((ch, i) => ch >= dark[i]), `${role} never darkens as tone rises`).toBe(true);
      expect(light.some((ch, i) => ch > dark[i]), `${role} actually moves`).toBe(true);
    }
  });

  test('THE NEGATIVE CONTROL — an unknown role THROWS rather than defaulting', () => {
    expect(() => resolveRoleFill('not_a_role', 500)).toThrow(/no colour binding/);
    expect(() => resolveRoleFill('constructor', 500)).toThrow(/no colour binding/);
    expect(() => resolveRoleFill('civic', 1001)).toThrow(/not a permille/);
    expect(() => resolveRoleFill('civic', 12.5)).toThrow(/not a permille/);
    // And the anchor: a REAL role at a REAL tone does not throw, so the four
    // negatives above are measuring rejection rather than a broken accessor.
    expect(() => resolveRoleFill('civic', STREET_TONE_PERMILLE)).not.toThrow();
  });

  test('every fill the rendered sheet emits is a value the binding produced', () => {
    const { container } = paint();
    const emitted = svgChildren(container)
      .map((el) => el.getAttribute('fill') ?? el.getAttribute('stroke'))
      .filter((value) => value !== 'none');
    expect(emitted.length).toBeGreaterThan(0);
    const producible = new Set();
    for (const role of CARTOGRAPHY_PAINT_ROLES) {
      for (let tone = 0; tone <= 1000; tone += 1) producible.add(resolveRoleFill(role, tone));
    }
    expect(emitted.filter((value) => !producible.has(value))).toEqual([]);
  });
});

describe('TC-5b-ii C4 — no colour is smuggled into either new file', () => {
  test('neither new file\'s SOURCE holds a raw colour literal or a forked hex const', () => {
    const rawColour = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/;
    const forkedConst = /^\s*const\s+\w+\s*=\s*['"]#[0-9a-fA-F]{3,8}['"]/m;
    const palette = readFileSync(PALETTE_SRC, 'utf-8');
    const painter = readFileSync(PAINTER_SRC, 'utf-8');
    // Non-vacuity first: the scan is live, proved on a SPLICED control string that
    // is assembled here rather than written, so this file smuggles nothing either.
    const control = ['#', 'a', 'b', 'c', 'd', 'e', 'f'].join('');
    expect(rawColour.test(`${palette}\nconst x = '${control}';`)).toBe(true);
    expect(forkedConst.test(`${painter}\nconst x = '${control}';`)).toBe(true);
    expect(rawColour.test(palette), 'the palette holds a raw colour literal').toBe(false);
    expect(rawColour.test(painter), 'the painter holds a raw colour literal').toBe(false);
    expect(forkedConst.test(palette), 'the palette forks a token hex').toBe(false);
    expect(forkedConst.test(painter), 'the painter forks a token hex').toBe(false);
  });

  test('the palette imports NOTHING outside its two permitted modules', () => {
    const code = readFileSync(PALETTE_SRC, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
    const specifiers = [...code.matchAll(/from\s+'([^']+)'/g)].map((match) => match[1]);
    expect(specifiers.length).toBeGreaterThan(0);
    expect(specifiers.filter((spec) => ![
      '../../../domain/townCartography/cartographyPaintRoles.js',
      '../../../design/tokens.js',
    ].includes(spec))).toEqual([]);
  });
});

describe('TC-5b-ii C5 — the A-4 degraded state, and EMPTY is not MALFORMED', () => {
  test('a MALFORMED block renders the ruled notice and NO svg', () => {
    const { container } = paint({ block: MALFORMED_BLOCK });
    expect(container.textContent).toContain(A4_HEADING);
    expect(container.textContent).toContain(A4_ROAD);
    expect(container.querySelector('svg')).toBe(null);
    const notice = container.querySelector('[role="status"]');
    expect(notice).not.toBe(null);
    expect(notice.getAttribute('aria-live')).toBe('polite');
    // A terminal state is not a wait: aria-busy belongs to the Suspense fallback.
    expect(notice.hasAttribute('aria-busy')).toBe(false);
  });

  test('the RAW premise never reaches the DOM — it goes to the console alone', () => {
    const { container } = paint({ block: MALFORMED_BLOCK });
    expectAbsentWithAnchor(
      container.textContent, PREMISE_TEXT, A4_ROAD,
      'the A-4 notice must never leak the raw premise to a reader',
    );
    // The beside-it presence pin: it WAS reported, just not to the reader. Without
    // this the negative above would pass on a component that swallowed the error.
    expect(console.warn).toHaveBeenCalled();
    expect(String(console.warn.mock.calls[0][1])).toContain(PREMISE_TEXT);
  });

  test('a non-positive planExtent degrades to A-4 rather than to a broken viewBox', () => {
    const { container } = paint({ planExtent: null });
    expect(container.textContent).toContain(A4_HEADING);
    expect(container.querySelector('svg')).toBe(null);
  });

  test('a legitimately EMPTY block narrates, and does NOT show the failure notice', () => {
    const { container } = paint({ block: EMPTY_BLOCK });
    expect(buildCartographyDrawList(EMPTY_BLOCK)).toHaveLength(0);
    expect(container.textContent).toContain(EMPTY_NARRATION);
    expectAbsentWithAnchor(
      container.textContent, A4_HEADING, EMPTY_NARRATION,
      'an empty sheet is not a failed one',
    );
    expect(container.querySelector('svg')).toBe(null);
    expect(console.warn).not.toHaveBeenCalled();
  });
});

describe('TC-5b-ii C6 — determinism of the rendered surface', () => {
  test('the same block renders byte-identical markup twice', () => {
    const first = paint().container.innerHTML;
    cleanup();
    const second = paint().container.innerHTML;
    expect(second).toBe(first);
    expect(first).toContain('<svg');
  });

  test('a block whose layer arrays are REVERSED renders identically', () => {
    // The draw list sorts by raw codepoint id inside each layer; the component must
    // not add a second ordering truth, so input order cannot reach the markup.
    const reversed = {
      ...BLOCK,
      wards: [...BLOCK.wards].reverse(),
      buildings: [...BLOCK.buildings].reverse(),
      parcels: [...BLOCK.parcels].reverse(),
      streets: {
        arterials: [...BLOCK.streets.arterials].reverse(),
        lanes: [...BLOCK.streets.lanes].reverse(),
      },
    };
    const straight = paint().container.innerHTML;
    cleanup();
    const flipped = paint({ block: reversed }).container.innerHTML;
    expect(flipped).toBe(straight);
  });
});

describe('TC-5b-ii C7 — THE SEAT GUARD: a tab that joins no persisted vocabulary', () => {
  test('choosing Cartography records NOTHING in the living-backdrop sidecar', async () => {
    h.cartography = { status: 'ready', block: BLOCK, planExtent: PLAN_EXTENT, available: true };
    localStorage.setItem('sf.lastMapView.save-1', JSON.stringify({ view: 'panorama', lens: 'ink' }));
    await mountShell();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Cartography' })); });
    // Untouched: `cartography` is not in the sidecar's vocabulary, and a blind
    // write would have coerced it to 'plan' and washed the wrong composition.
    expect(readLastMapView('save-1')).toEqual({ view: 'panorama', lens: 'ink' });
  });

  test('THE ANCHOR — choosing Panorama DOES write one, so the probe above is live', async () => {
    h.cartography = { status: 'ready', block: BLOCK, planExtent: PLAN_EXTENT, available: true };
    localStorage.setItem('sf.lastMapView.save-1', JSON.stringify({ view: 'plan', lens: 'ink' }));
    await mountShell();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Panorama' })); });
    expect(readLastMapView('save-1')).toEqual({ view: 'panorama', lens: 'ink' });
  });

  test('selecting Cartography mounts the painter, so the seat is not merely chrome', async () => {
    h.cartography = { status: 'ready', block: BLOCK, planExtent: PLAN_EXTENT, available: true };
    const { container } = await mountShell();
    await act(async () => { fireEvent.click(screen.getByRole('tab', { name: 'Cartography' })); });
    await act(async () => {});
    expect(container.querySelector('[data-map-cartography-subtab]')).not.toBe(null);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    expect(container.querySelector('[data-testid="map-pane"]')).toBe(null);
  });
});
