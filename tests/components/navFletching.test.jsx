/**
 * @vitest-environment jsdom
 *
 * tests/components/navFletching.test.jsx — THE HALF-SEEN WAR ARROW (owner directive,
 * 2026-08-03 evening; refined the same night from the owner's mockup).
 *
 * The composition: the bar is HALF OF AN ARROW IN PROFILE. The arrow lies along the
 * top screen edge, the viewport shows this side's half, so the whole header is the
 * SHAFT'S VISIBLE HALF — a honey-tan barrel shaded as a cylinder — and Create ·
 * Library · Realm are ONE CONTINUOUS FLETCH BAND riding it: three grey-goose vanes
 * SHINGLED so each lies over the next, top-aligned at the quill line and hanging
 * well below the bar, bracketed by two silk wraps.
 *
 * This file pins the claims that make it safe to ship, and it exists because most of
 * them are invisible to the eye and to every other suite:
 *
 *   1. THE FLETCHING'S MEMBERSHIP IS DERIVED, NOT LISTED. It is the maximal NAV run
 *      whose consecutive pairs are declared in routes.js NAV_FLOW, read through the
 *      one predicate that owns that declaration (NavFlowArrow.flowsInto). A hardcoded
 *      trio would silently keep painting the wrong tabs after a nav reorder — the
 *      exact second truth routes.js:163 exists to forbid.
 *
 *   2. ⚠️⚠️ THE SHINGLE IS A RELATIONSHIP, AND THAT IS THE ONE THING V3'S PINS
 *      COULD NOT SEE. V3 drew one fletch SVG per nav cell, each stretched to its own
 *      cell by `preserveAspectRatio="none"`, and authored the lap in each cell's
 *      LOCAL units. Every structural pin was green — the paths were right, the
 *      angles were right, the overhang was right — and the shipped bar rendered
 *      three separate dark tabs with bare honey wood between them, because the lap
 *      came out at about two screen pixels while the seam between two cells was ten.
 *      No pin asked whether one vane actually REACHED the next. This file now does,
 *      in the single coordinate space that makes the question answerable.
 *
 *   3. ⚠️⚠️ THE HANG IS PAINT, NEVER LAYOUT. The vanes reach FLETCH_HANG px BELOW
 *      the ribbon, and they MUST do so without adding one pixel to any box. This is
 *      the load-bearing one: theme.js derives ANCHOR_OFFSET from CHROME.headerDesktop
 *      and every About / guide / Compendium / dossier in-page anchor in the estate
 *      lands on that number. A height, a margin, or a negative offset here would push
 *      the sticky header taller and every anchor would land worse — a defect no nav
 *      test would ever see. All three halves are pinned: the overflow, the geometry
 *      that reaches past the bar, and the ABSENCE of any box that spends it.
 *
 *      ⚠️ NEVER PIN THE SUM. Every assertion here names `CHROME.headerDesktop +
 *      SP.xxl`, not the number it happens to evaluate to. A pin on the literal
 *      survives an edit that BREAKS the derivation and fails on one that HONOURS it,
 *      which is exactly backwards; literals appear only as a second, clearly-labelled
 *      today's-value line.
 *
 *      ⚠️ jsdom HAS NO LAYOUT, so this file pins the STRUCTURE that makes the hang
 *      paint-only; the height itself was proved in a real browser and the receipt is
 *      recorded here so nobody re-derives it. At 1440×900 with the shingled band
 *      present: header 48, main top 48 — identical to the measurement taken with the
 *      fletching removed, which is the whole point of buying paint with `overflow`.
 *
 *   4. ⚠️ NOTHING CLIPPED IS EVER FOCUSABLE. `clip-path` clips an element's whole
 *      rendering INCLUDING its outline, and a11y.css draws the global focus ring as
 *      `outline: 3px` at a positive `outline-offset` — entirely OUTSIDE the border
 *      box. Clipping the control would therefore swallow the keyboard focus ring
 *      while leaving every visual test green. All clipping lives inside FletchBand's
 *      aria-hidden SVG, which is now a SIBLING of the three controls rather than a
 *      child of each; neither the controls nor any ancestor may carry a clip-path or
 *      an `overflow: hidden`, and this file asserts the whole chain.
 *
 *   5. ⚠️⚠️ AA IS OWED AGAINST THE LIGHTEST TONAL BAND, NOT THE VANE. A pale label
 *      on a dark feather fails at the feather's LIGHT points, so the governing
 *      number is the lightest tone in the whole goose ladder — FLETCH_SHEEN_LIFT,
 *      the active vane's brightened sheen. Every tone is authored OPAQUE precisely
 *      so "the lightest band" is a value this file can name rather than a hand-wave,
 *      and the ratios are quoted, not asserted vaguely.
 *
 *   6. THE TEXTURE AND THE COMB ARE BOTH DETERMINISTIC. The shaft grain is
 *      feTurbulence with a FIXED seed in an inline data URI; the barb comb's jitter
 *      is a 32-bit integer hash. A random source — or a transcendental, which is not
 *      required to be correctly rounded and differs between engines in the last ulp
 *      — would make the bar differ per render or per browser: invisible in review,
 *      and a golden-shift bomb.
 *
 * The mobile bottom nav is untouched by the directive and is pinned as the negative
 * control: no band, no wrap, no vane.
 *
 * App.jsx is a pure layout shell over the Zustand store + path router, so the store,
 * the route hook, the breakpoint hook and the routed view are stubbed — the render
 * then exercises only the nav chrome under test (the sibling suites' idiom, kept
 * identical on purpose). The active/resting A/B renders NavRibbon as a LEAF, so a
 * register can be observed without mounting a lazy view.
 */

import React from 'react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { NAV, NAV_FLOW } from '../../src/lib/routes.js';
import { flowsInto } from '../../src/components/nav/NavFlowArrow.jsx';
import {
  ANCHOR_OFFSET, BODY, CHROME, FLETCH, FLETCH_BARB, FLETCH_BARB_DEG, FLETCH_HANG,
  FLETCH_LEAD, FLETCH_RACHIS, FLETCH_SHEEN, FLETCH_SHEEN_LIFT, FLETCH_TIP,
  FLETCH_VANE, FS, GILT, GILT_LIGHT, GOLD, GOLD_TXT, HEADER_RIDERS, INK_DEEP, LABEL_BOX,
  LIGHT_UNIT, PARCH, PARCH_100,
  PLATE_LIGHT_DEG, SHAFT, SHAFT_BODY, SHAFT_CYLINDER, SHAFT_EDGE, SHAFT_GRAIN_LAYERS,
  SHAFT_GRAIN_TEXTURE, SHAFT_RIM, SHAFT_SHEEN, SHAFT_STOPS, SP, WRAP,
  contactShadow, lightOffset, shadowOffset,
} from '../../src/components/theme.js';
import {
  BAND, BAND_PX_PER_UNIT, BAND_W, BARB, DRIFT, LANE, QUILLS, QUILL_H, REACH, RUN, SEAT,
  SHEENS, SHEEN_FLOOR, SHEEN_PEEK, VANES, barbBuckets, combCoverage, frayHairs, laneGap,
  lean, quill, rachis, unitHash,
} from '../../src/components/nav/FletchBand.jsx';

const H = vi.hoisted(() => ({
  route: { view: 'generate', params: {}, legacy: false, notFound: false },
  isMobile: false,
  storeState: null,
}));

// The house idiom for App-mounting tests: mock analytics so its lazy event-dictionary
// import can never race environment teardown (the welcomeJourney precedent).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: {},
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/hooks/useRoute.js', () => ({
  useRoute: () => H.route,
  navigate: vi.fn(),
  replacePath: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  hasStoredAuthToken: () => false,
  isConfigured: false,
  supabase: { auth: { getUser: () => Promise.resolve({ data: { user: null } }) } },
}));

vi.mock('../../src/hooks/useIsMobile', () => ({ default: () => H.isMobile }));

vi.mock('../../src/lib/stripe.js', () => ({
  checkCheckoutResult: () => null,
  fetchCreditBalance: () => Promise.resolve(0),
}));

// Sever the pricing surface's lazy stripe->creditLedger chain at the component
// boundary — this suite tests the nav ribbon, not pricing internals, and the chain's
// dynamic import races environment teardown under gate load.
vi.mock('../../src/components/pricing/PricingMomentCard.jsx', () => ({
  default: () => null,
}));

vi.mock('../../src/components/GenerateWizard.jsx', () => ({
  default: () => <div data-testid="generate-view">create</div>,
}));

function makeState(overrides = {}) {
  return {
    authModalOpen: false,
    setAuthModalOpen: vi.fn(),
    auth: { tier: 'anon', displayName: null, role: null, user: null, loading: false },
    isElevated: () => false,
    wizardMode: null,
    settlement: null,
    initAuth: vi.fn(),
    authSignOut: vi.fn(),
    onboardingNudge: null,
    clearOnboardingNudge: vi.fn(),
    purchaseModalOpen: false,
    setPurchaseModalOpen: vi.fn(),
    setCreditBalance: vi.fn(),
    creditBalance: 0,
    loadCampaigns: vi.fn(),
    loadCustomContentFromCloud: vi.fn(() => Promise.resolve()),
    migrateLocalCustomContentToCloud: vi.fn(() => Promise.resolve()),
    clearCloudCustomContent: vi.fn(),
    setActivePricingMoment: vi.fn(),
    canSave: () => false,
    activeSaveId: null,
    savedSettlements: [],
    campaignSyncError: null,
    clearCampaignSyncError: vi.fn(),
    ...overrides,
  };
}

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(H.storeState);
  useStore.getState = () => H.storeState;
  return { useStore };
});

import App from '../../src/App.jsx';
import NavRibbon from '../../src/components/nav/NavRibbon.jsx';

/** cssstyle normalizes authored hex to rgb(); compare through one converter. */
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

/** WCAG relative luminance of an authored #rrggbb. */
function relLuminance(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two authored hexes. */
function ratio(a, b) {
  const [hi, lo] = [relLuminance(a), relLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const feathers = (c) => [...c.querySelectorAll('[data-nav-cell="feather"]')];
const plains = (c) => [...c.querySelectorAll('[data-nav-cell="plain"]')];
const label = (b) => b.textContent.trim();
const paint = (c) => c.querySelector('[data-testid="nav-fletch-band-paint"]');

/** Every y coordinate authored into an SVG path's `d`, for the geometry pins. */
function pathYs(d) {
  const nums = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  return nums.filter((_, i) => i % 2 === 1);
}

/**
 * The ON-CURVE vertices of an SVG path — the points the silhouette actually passes
 * through, discarding Bézier control points (which pull the curve without lying on
 * it). Every `M`/`L` endpoint and the LAST pair of every `C`. Geometry pins ask
 * about the shape, and a control point is not part of the shape.
 */
function ONCURVE(d) {
  const out = [];
  for (const seg of d.match(/[MLC][^MLCZ]*/g) || []) {
    const n = (seg.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    if (n.length >= 2) out.push({ x: n[n.length - 2], y: n[n.length - 1] });
  }
  return out;
}

/** The membership the DERIVATION demands, computed here the long way round. */
function derivedBandIds() {
  return NAV.filter((n, i) => flowsInto(n.id, NAV[i + 1]?.id) || flowsInto(NAV[i - 1]?.id, n.id))
    .map((n) => n.id);
}

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = (rel) => readFileSync(join(HERE, '../../src', rel), 'utf8');

beforeEach(() => {
  H.route = { view: 'generate', params: {}, legacy: false, notFound: false };
  H.isMobile = false;
  H.storeState = makeState();
  window.history.replaceState(null, '', '/create');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('1 — the fletching’s membership is DERIVED from the flow, never listed', () => {
  test('the rendered fletch cells are exactly the declared flow run', () => {
    const { container } = render(<App />);
    expect(feathers(container).map(label)).toEqual(['Create', 'Library', 'Realm']);
    // …and that trio is not typed in: it is what the predicate answers.
    expect(derivedBandIds()).toEqual(['generate', 'settlements', 'realm']);
    expect(feathers(container).map(label))
      .toEqual(derivedBandIds().map((id) => NAV.find((n) => n.id === id).label));
  });

  test('the reference tabs stay plain — the hierarchy IS the point', () => {
    const { container } = render(<App />);
    expect(plains(container).map(label)).toEqual(['Compendium', 'Gallery', 'About']);
    // Totality: every nav cell is one register or the other, none is both.
    const all = [...container.querySelectorAll('header nav button')];
    expect(all.length).toBe(NAV.length);
    expect(feathers(container).length + plains(container).length).toBe(NAV.length);
  });

  test('there is exactly ONE cluster, ONE paint layer, and it wraps exactly the fletches', () => {
    const { container } = render(<App />);
    const bands = [...container.querySelectorAll('[data-testid="nav-fletch-band"]')];
    expect(bands.length).toBe(1);
    // ⚠️ ONE SVG FOR THE WHOLE BAND, not one per cell — see the header's note 2.
    // Three SVGs is not a style choice here, it is the bug: three coordinate spaces
    // cannot express a lap between two of them.
    expect(container.querySelectorAll('[data-testid="nav-fletch-band-paint"]').length).toBe(1);
    for (const f of feathers(container)) expect(bands[0].contains(f)).toBe(true);
    for (const p of plains(container)) expect(bands[0].contains(p)).toBe(false);
    // The paint is a SIBLING of the controls, never a child of one — which is what
    // makes the focus-ring claim in block 4 structural rather than careful.
    expect(paint(container).closest('button')).toBeNull();
    expect(paint(container).parentElement).toBe(bands[0]);
  });

  test('a cell with no declared flow neighbour can never be fletched', () => {
    // The negative control the derivation needs: NAV_FLOW names two pairs, and the
    // fletching is exactly their union. If this ever grew, the predicate stopped
    // being the source and something restated the trio.
    const declared = new Set(Object.entries(NAV_FLOW).flat());
    expect(new Set(derivedBandIds())).toEqual(declared);
    for (const id of ['compendium', 'gallery', 'about-what-this-is', 'home']) {
      expect(derivedBandIds()).not.toContain(id);
    }
  });
});

describe('2 — ⚠️⚠️ THE SHINGLE: three parallelograms, ascending into Realm', () => {
  test('three cells are drawn, from one geometry, in one coordinate space', () => {
    const { container } = render(<App />);
    const svg = paint(container);
    expect(svg.tagName.toLowerCase()).toBe('svg');
    // One viewBox for the whole cluster: three lanes wide, exactly the bar tall.
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${BAND_W} ${CHROME.headerDesktop}`);
    expect(BAND_W).toBe(LANE * 3);
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none');
    const groups = [...svg.querySelectorAll('[data-testid^="nav-fletch-vane-"]')];
    expect(groups.length).toBe(3);
    // Every cell silhouette the module authored really is painted.
    const drawn = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('d'));
    for (const v of VANES) expect(drawn).toContain(v.closed);
  });

  test('⚠️ EACH CELL IS A FULL PARALLELOGRAM — a simple slanted quad, no curves', () => {
    // THE OWNER'S SECOND CORRECTION, AS GEOMETRY. The cut before this one drew
    // complex feather silhouettes — a tapered leading point, a curved belly, a
    // rounded trailing back — and the shipped bar read as three torn dark tabs with
    // honey wood showing in the notches between them. A parallelogram cannot grow a
    // notch. jsdom cannot see "that looks like a torn tab"; it CAN see a cubic
    // segment in a path that is supposed to have none, so that is what is pinned.
    for (const [lane, v] of VANES.entries()) {
      // NO CURVE COMMANDS AT ALL. This is the pin that forbids the whole retired
      // family of silhouettes in one line.
      expect(v.closed, `cell ${lane} is not a straight-edged quad`).not.toMatch(/[CcQqSsTtAa]/);
      const pts = ONCURVE(v.closed);
      expect(pts.length).toBe(4);
      const [tl, tr, br, bl] = pts;
      // The top edge lies on the quill line, where the binding is; the bottom edge
      // at the vane's full depth, well below the bar.
      expect([tl.y, tr.y]).toEqual([0, 0]);
      expect([br.y, bl.y]).toEqual([BAND, BAND]);
      // BOTH slanted edges lean by exactly the same run — that is what makes it a
      // parallelogram rather than a trapezoid, and it is why the gap between two
      // adjacent cells is the same at every depth (see the next test).
      expect(bl.x - tl.x).toBe(DRIFT);
      expect(br.x - tr.x).toBe(DRIFT);
      expect(tr.x - tl.x).toBe(br.x - bl.x);
      // …and the lean is the COMB's own run, so a lap boundary is a barb line and
      // never a cut across the grain.
      expect(Math.abs(DRIFT)).toBe(FLETCH.barbRun);
      expect(RUN).toBe(FLETCH.barbRun);
    }
  });

  test('⚠️⚠️ THE MIRROR: every slanted mark sweeps DOWN AND LEFT, from ONE sign', () => {
    // THE OWNER'S V4 §c CORRECTION, AS ARITHMETIC: "vane slant MIRRORED on x". Before
    // it, `+RUN` was spelled at six independent sites — the quad, both rims, the comb,
    // the fray, the gold path — and agreed with `lean()` only by convention. Mirroring
    // six spellings by hand is how a band ends up with five edges leaning one way and
    // one the other, with every pin green because every pin re-derives from the site it
    // is checking. So the pin is on the SINGLE SIGN and then on every consumer of it.
    expect(DRIFT).toBeLessThan(0);              // down and to the LEFT
    expect(DRIFT).toBe(lean(BAND));             // …and DRIFT really is the lean at depth
    expect(Math.abs(DRIFT)).toBe(RUN);          // …at the magnitude the token names
    // The drift is LINEAR in depth, which is what makes one number enough for every
    // mark at every depth. (Half the depth, half the drift.)
    expect(lean(BAND / 2)).toBeCloseTo(DRIFT / 2, 9);
    expect(Math.abs(lean(0))).toBe(0);
    // EVERY CONSUMER, walked. A site that kept a hand-spelled `+RUN` reds here.
    for (const lane of [0, 1, 2]) {
      const [tl, , , bl] = ONCURVE(VANES[lane].closed);
      expect(bl.x - tl.x, `cell ${lane}'s quad did not mirror`).toBe(DRIFT);
      for (const d of barbBuckets(lane)) {
        for (const seg of d.match(/M (-?[\d.]+) 0 L (-?[\d.]+) [\d.]+/g) || []) {
          const [, a, b] = seg.match(/M (-?[\d.]+) 0 L (-?[\d.]+) [\d.]+/);
          expect(Number(b) - Number(a), `lane ${lane}'s comb did not mirror`)
            .toBeCloseTo(DRIFT, 0);
        }
      }
      for (const d of SHEENS[lane]) {
        const pts = ONCURVE(d);
        const top = pts.filter((q) => q.y === 0).sort((a, b) => a.x - b.x);
        const low = pts.filter((q) => q.y === SHEEN_FLOOR).sort((a, b) => a.x - b.x);
        expect(low[0].x - top[0].x, `lane ${lane}'s sheen did not mirror`)
          .toBeCloseTo(lean(SHEEN_FLOOR), 6);
      }
      const fray = frayHairs(lane).match(/M (-?[\d.]+) [\d.]+ L (-?[\d.]+) ([\d.]+)/g) || [];
      expect(fray.length, `lane ${lane} has no fray to check`).toBeGreaterThan(0);
      for (const seg of fray) {
        const [, a, b, y] = seg.match(/M (-?[\d.]+) [\d.]+ L (-?[\d.]+) ([\d.]+)/);
        expect(Number(b) - Number(a), `lane ${lane}'s fray did not mirror`)
          .toBeCloseTo(lean(Number(y) - BAND), 0);
      }
    }
    // NEGATIVE CONTROL — the pin is not tautological on its own module. Reconstruct
    // each quad as it would be WITHOUT the mirror and require it to differ, so a revert
    // of the one sign really does move geometry rather than shuffling equal numbers.
    for (const lane of [0, 1, 2]) {
      const [tl, tr] = ONCURVE(VANES[lane].closed);
      const asBuilt = ONCURVE(VANES[lane].closed).map((p) => +p.x.toFixed(4));
      const unmirrored = [tl.x, tr.x, tr.x + RUN, tl.x + RUN].map((x) => +x.toFixed(4));
      expect(asBuilt, `cell ${lane} is byte-identical mirrored and not`).not.toEqual(unmirrored);
    }
  });

  test('⚠️⚠️ THE PAINT ORDER ASCENDS INTO REALM — the owner’s first correction', () => {
    // Library's leading edge must lie OVER Create's trailing edge, and Realm's over
    // Library's, so Realm is topmost and Create bottommost and every tab reads as
    // FEEDING INTO the next. In SVG that is document order, so the cells are painted
    // 0, 1, 2 and the LAST one in the DOM is Realm. The previous cut painted 2, 1, 0
    // — every structural pin stayed green and the cascade pointed back at Create.
    const { container } = render(<App />);
    const lanes = [...paint(container).querySelectorAll('[data-testid^="nav-fletch-vane-"]')]
      .map((g) => Number(g.dataset.testid.split('-').pop()));
    expect(lanes).toEqual([0, 1, 2]);
    // Stated the other way round too, so a reader cannot mistake which end is on top.
    expect(lanes[lanes.length - 1]).toBe(2);          // Realm paints last  → topmost
    expect(lanes[0]).toBe(0);                          // Create paints first → bottommost
  });

  test('⚠️ EVERY CELL REACHES UNDER THE NEXT, and the gap cannot open at ANY depth', () => {
    // THE FAILURE THIS EXISTS FOR. V3's lap was authored per-cell in a stretched
    // local space and resolved to ~2 screen px against a 10px seam, so the band
    // rendered as three tabs. Here the whole band is one space AND both edges of
    // every quad lean by the same run, so the horizontal separation between cell i's
    // trailing edge and cell i+1's leading edge is a CONSTANT — measured at the quill
    // line and again at full depth, and required to be the same number both times.
    expect(FLETCH.lap).toBeGreaterThan(0);
    for (const lane of [0, 1]) {
      const [, tr, br] = ONCURVE(VANES[lane].closed);
      const [ntl, , , nbl] = ONCURVE(VANES[lane + 1].closed);
      const atQuill = tr.x - ntl.x;
      const atDepth = br.x - nbl.x;
      // ⚠️ toBeCloseTo, not toBe: SEAT is a derived float, so the corner x's carry
      // one ulp of noise. The CLAIM is the lap and its constancy, never the bit
      // pattern — a strict-equality pin here would red on an unrelated retune of the
      // comb and teach the next reader to weaken the pin instead of the tolerance.
      expect(atQuill, `cell ${lane} does not reach under cell ${lane + 1}`)
        .toBeCloseTo(FLETCH.lap, 9);
      expect(atDepth, `cell ${lane}'s lap narrows with depth`).toBeCloseTo(atQuill, 9);
      // …and it is a real shingle, not a hairline: at least a fifth of a lane.
      expect(atQuill / LANE).toBeGreaterThan(0.2);
    }
    // THE LAST CELL REACHES UNDER NOTHING — Realm is topmost and has no successor.
    expect(REACH(2)).toBe(0);
  });

  test('⚠️⚠️ THE SEAT: every seam crosses its lane division AT THE LABEL’S HEIGHT', () => {
    // The pin that makes "each label centred in its cell's calm zone" true rather
    // than hopeful. The seams are slanted, so "where is the boundary between Create
    // and Library" has a different answer at every depth; the labels are laid out as
    // equal thirds and read at ONE depth — the bar's vertical middle. Without the
    // seat the seam sits lean(D/2) to the right of the lane division there, and at
    // today's metrics that is more than the slack a cell has around its label, so the
    // label would sit half on the cell beneath it at a different z.
    const mid = CHROME.headerDesktop / 2;
    for (const lane of [1, 2]) {
      const [tl, , , bl] = ONCURVE(VANES[lane].closed);
      // The leading edge, interpolated to the label's own depth.
      const atLabel = tl.x + ((bl.x - tl.x) * mid) / BAND;
      expect(atLabel, `cell ${lane}'s seam misses its lane division at label height`)
        .toBeCloseTo(lane * LANE, 6);
    }
    // NON-VACUITY: the seat is a real, substantial shift — not zero dressed up as a
    // derivation. Drawn without it every seam would land this far off its lane.
    // ⚠️ THE SIGN IS ASSERTED SEPARATELY FROM THE MAGNITUDE, and it flipped with the
    // mirror: the seam now sits to the LEFT of its division without the seat, so the
    // band shifts RIGHT. Pinning only `> 0` here would have gone green on a band that
    // had mirrored its edges and forgotten to mirror its seat, which is the exact
    // half-migration this test exists to catch.
    expect(SEAT).toBe(lean(mid));
    expect(SEAT).toBeLessThan(0);
    expect(Math.abs(SEAT)).toBeGreaterThan(LANE * 0.05);
  });

  test('⚠️⚠️ THE FRAME RETIRED: FOUR IDENTICAL PARALLEL SLASHES, and no clip at all', () => {
    // ⚠️ THIS TEST REPLACES "THE FRAME squares the band's two ends", which is now the
    // WRONG claim rather than a weakened one. The owner's V4 §c directive is "EVERY
    // border parallel INCL. the band's two outer ends", and the frame existed precisely
    // to make the two outer ends NOT parallel: the outer cells were drawn `RUN` longer
    // than their lanes and the whole band was clipped back to its box in x, which bought
    // square ends at the price of two of the composition's four visible edges.
    //
    // So the pin inverts. It asserts (a) the clip is GONE, (b) the overshoots that fed
    // it are gone, and (c) the four slashes a user actually sees are identical parallels.
    const { container } = render(<App />);
    const svg = paint(container);
    const frame = svg.querySelector('[data-testid="nav-fletch-frame"]');
    expect(frame).toBeTruthy();
    // (a) NO CLIP — on the group, and nowhere in the band's defs either. A clipPath
    // left behind and merely unreferenced is one attribute away from coming back.
    expect(frame.getAttribute('clip-path')).toBeNull();
    const clipIds = [...svg.querySelectorAll('clipPath')].map((c) => c.id);
    expect(clipIds.some((cid) => cid.endsWith('-frame'))).toBe(false);
    // …and the clips that DO survive are exactly the three per-lane vane clips, which
    // is what keeps this from passing on a band that lost its clipping altogether.
    expect(clipIds.length).toBe(3);
    for (const lane of [0, 1, 2]) expect(clipIds.some((cid) => cid.endsWith(`-clip-${lane}`))).toBe(true);
    // (b) NO OVERSHOOTS. Every cell's quill-line span is exactly its lane plus its own
    // lap — the outer two no longer reach `RUN` past the band to give the clip material.
    for (const lane of [0, 1, 2]) {
      const [tl, tr] = ONCURVE(VANES[lane].closed);
      expect(tl.x, `cell ${lane}'s leading edge is not on its lane`)
        .toBeCloseTo(lane * LANE - SEAT, 9);
      expect(tr.x - tl.x, `cell ${lane} overshoots its lane`)
        .toBeCloseTo(LANE + REACH(lane), 9);
    }
    // (c) FOUR IDENTICAL SLASHES. These are the boundaries a user sees: each cell's
    // leading edge (Library's and Realm's laid OVER the cell beneath), plus Realm's
    // trailing edge, which is the band's own end. Every one leans by the same DRIFT
    // over the same depth, and they are EQUALLY SPACED at the quill line — which is
    // what "identical parallels" means and what the frame's square ends broke.
    const slashes = [VANES[0].lead, VANES[1].lead, VANES[2].lead, VANES[2].trail];
    expect(slashes.length).toBe(4);
    const heads = [];
    for (const d of slashes) {
      const [a, b] = ONCURVE(d);
      expect(a.y).toBe(0);
      expect(b.y).toBe(BAND);
      expect(b.x - a.x, 'a visible slash does not lean with the rest').toBe(DRIFT);
      heads.push(a.x);
    }
    const gaps = heads.slice(1).map((x, i) => +(x - heads[i]).toFixed(9));
    expect(new Set(gaps).size, 'the four slashes are not equally spaced').toBe(1);
    expect(gaps[0]).toBe(LANE);
    // NON-VACUITY for the whole block: the band really does paint past its own box
    // now, which is what the retired clip used to cut off — so "no clip" is a visible
    // change and not a no-op.
    expect(Math.min(...ONCURVE(VANES[0].closed).map((p) => p.x))).toBeLessThan(0);
    expect(Math.max(...ONCURVE(VANES[2].closed).map((p) => p.x))).toBeGreaterThan(BAND_W);
  });

  test('⚠️⚠️ the two depth cues obey the COMPOSITION’S ONE LIGHT — F4’s cure', () => {
    // These are the cues that make a lap read as one feather lying on another rather
    // than as two flat shapes sharing a border, and their DIRECTION was the finding.
    //
    // The verifier's F4, quoted: "The band's contact shadows are (-1.6,+0.6) and
    // (-5,+3) — down and LEFT, i.e. light from the upper RIGHT. Two elements 700px
    // apart in one 38px composition are lit from opposite sides. The band's negative-x
    // is load-bearing (the shadow must fall on the cell beneath, which lies to the
    // leading side), so this cannot be fixed by flipping the band; the chair has to
    // choose which element moves."
    //
    // ⚠️ THE CHAIR CHOSE THE BAND, AND THE TWO SHADOWS THEREFORE SPLIT BY KIND, NOT BY
    // OFFSET. Under an upper-left light a shingle that ascends rightward casts its
    // shadow onto the cell ON TOP of it — invisible — so the seam's contact cue is
    // AMBIENT OCCLUSION, which has no azimuth at all, and the cast shadow is the wide
    // one, on the composition's real ray. A future edit that "restores" a negative dx
    // here puts two suns back in one 38px bar, so the pin asserts the sign.
    const { container } = render(<App />);
    const groups = [...paint(container).querySelectorAll('[data-testid^="nav-fletch-vane-"]')];
    expect(groups.length).toBe(3);
    const cast = shadowOffset(5.8);
    for (const g of groups) {
      // TWO shadows, tight + soft: one filter can be one or the other, not both,
      // and a single soft shadow between two nearly-tonal feathers is a smudge.
      const offs = [...g.style.filter.matchAll(/drop-shadow\((-?[\d.]+)px\s+(-?[\d.]+)px/g)]
        .map((m) => ({ dx: Number(m[1]), dy: Number(m[2]) }));
      expect(offs.length, 'a shadow offset lost its unit, or there are not two').toBe(2);
      // 1 — the CONTACT is occlusion: no azimuth, because a crevice has no source.
      expect(offs[0]).toEqual({ dx: 0, dy: 0 });
      // 2 — the CAST shadow is on the one light, down and to the RIGHT, and it is the
      // derived vector rather than a number that merely looks like it.
      expect(offs[1]).toEqual({ dx: cast.dx, dy: cast.dy });
      expect(offs[1].dx, 'the band is lit from the wrong side').toBeGreaterThan(0);
      expect(offs[1].dy).toBeGreaterThan(0);
      // The edge-light rides OUTSIDE the clip — it is this cell's own lit rim, so
      // half of it must fall on whatever lies behind.
      const rims = [...g.children].filter((c) => c.tagName === 'path'
        && c.getAttribute('stroke') === FLETCH_RACHIS);
      expect(rims.length).toBe(2); // the leading edge and the trailing one
      for (const r of rims) {
        expect(Number(r.getAttribute('stroke-opacity'))).toBeLessThan(1); // a whisper
        expect(Number(r.getAttribute('stroke-opacity'))).toBeGreaterThan(0);
        expect(r.getAttribute('fill')).toBe('none');
      }
      // …and the LEADING rim carries more than the trailing one, because it is what
      // the light strikes and what now marks the seam.
      expect(Number(rims[0].getAttribute('stroke-opacity')))
        .toBeGreaterThan(Number(rims[1].getAttribute('stroke-opacity')));
    }
  });

  test('⚠️⚠️ PLATE_LIGHT_DEG IS NOT A DEAD TOKEN — F3’s cure, asserted as reachability', () => {
    // The verifier's F3, quoted: "PLATE_LIGHT_DEG IS A DEAD TOKEN. It is exported from
    // theme.js under a docstring calling it 'the composition's ONE light direction',
    // and it is referenced exactly once in the entire tree: inside a JSX *comment* at
    // src/components/brand/MakerPlate.jsx:178. No code computes from it; `grep -rn
    // PLATE_LIGHT_DEG src/ tests/` finds no consumer and no pin. Changing 225 to any
    // other value moves nothing and reds nothing."
    //
    // ⚠️ SO THE PIN IS THE ONE THAT WOULD HAVE CAUGHT IT: it reads the SOURCE of every
    // module that draws relief on this bar, strips comments, and requires a real
    // reference. A docstring claiming a single writer while every consumer hand-keys
    // its own numbers is the exact shape of this estate's side-table hazard.
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    // ⚠️ THE MAP MOVED WITH THE MODULES IN V4: the maker's plate retired from the
    // header and the gilded wordmark took its place, so the row that named
    // MakerPlate.jsx now names GildedWordmark.jsx. The CLAIM is unchanged — every
    // module that draws relief on this bar computes from the azimuth — and it is the
    // map, not the file list, that is the pin.
    const consumers = {
      'components/nav/FletchBand.jsx': /contactShadow|dropShadow/,
      'components/brand/GildedWordmark.jsx': /lightOffset\(/,
      'components/brand/WaxSeal.jsx': /lightArc\(/,
    };
    for (const [rel, want] of Object.entries(consumers)) {
      const code = strip(SRC(rel));
      expect(code, `${rel} lost the module it was stripped by`).toContain('import');
      expect(code, `${rel} no longer computes from the one light`).toMatch(want);
      // NEGATIVE CONTROL: no hand-keyed drop-shadow offsets left in the file. A
      // literal `drop-shadow(-1.6px ...)` is exactly what F4 was.
      expect(code, `${rel} hand-keys a shadow offset again`).not.toMatch(/drop-shadow\(\s*-?[\d.]+px/);
    }
    // The azimuth really does point up and to the LEFT, and the cast shadow really is
    // its negation — the frame the whole derivation rests on, stated once.
    expect(LIGHT_UNIT.x).toBeLessThan(0);
    expect(LIGHT_UNIT.y).toBeLessThan(0);
    // (compared with a tolerance, not by identity: the offsets round to 3dp and the
    // unit vector to 4, and pinning the rounding would not be pinning the direction)
    expect(shadowOffset(1).dx).toBeCloseTo(-LIGHT_UNIT.x, 3);
    expect(shadowOffset(1).dy).toBeCloseTo(-LIGHT_UNIT.y, 3);
    expect(lightOffset(1).dx).toBeCloseTo(LIGHT_UNIT.x, 3);
    expect(lightOffset(1).dy).toBeCloseTo(LIGHT_UNIT.y, 3);
    // NON-VACUITY: moving the constant really moves the offsets it is supposed to own.
    expect(PLATE_LIGHT_DEG).toBe(225);
    expect(LIGHT_UNIT.x).toBeCloseTo(-0.7071, 4);
    expect(contactShadow(2, '#000')).toBe('drop-shadow(0px 0px 2px #000)');
  });

  test('every cell still COVERS ITS LABEL — the trap any silhouette edit invites', () => {
    // A pale label that slipped off its cell would sit on bare honey wood at 1.85:1
    // and be unreadable. Each label is centred in its own equal-width lane and read
    // at the bar's vertical middle, so the claim is: at that depth, the cell's own
    // painted span brackets the whole label box with room to spare.
    const mid = CHROME.headerDesktop / 2;
    // The widest label the band carries, in band units: the cells are equal thirds of
    // the cluster, so a lane is worth LANE units of whatever the band measures.
    const halfLabel = LANE * 0.42;
    for (const lane of [0, 1, 2]) {
      const [tl, tr, br, bl] = ONCURVE(VANES[lane].closed);
      const at = (a, b) => a.x + ((b.x - a.x) * mid) / BAND;
      const leadAt = at(tl, bl);
      const trailAt = at(tr, br);
      const centre = lane * LANE + LANE / 2;
      expect(leadAt, `cell ${lane}'s leading edge crosses its label`)
        .toBeLessThanOrEqual(centre - halfLabel);
      expect(trailAt, `cell ${lane}'s trailing edge crosses its label`)
        .toBeGreaterThanOrEqual(centre + halfLabel);
    }
  });

  test('⚠️⚠️ THE INDICATOR IS A QUILL LINE ON THE BINDING — and it MOVED, not copied', () => {
    // ⚠️ THIS REPLACES "the gold traces the LOWER EDGE only". The owner's V4 directive
    // moves the active indicator to the TOP, and the cumulative-audit addendum reads
    // that as MOVED: "a pin asserts NO active-state paint exists below the vane (the
    // owner's 'move it to the top' means moved, not duplicated)". A band that grew a
    // quill line while keeping its underline would satisfy every other pin in this file.
    //
    // 1 — THE GEOMETRY. A parallelogram lying on the quill line, slant-cut at the lean.
    for (const lane of [0, 1, 2]) {
      const pts = ONCURVE(QUILLS[lane]);
      expect(pts.length, `lane ${lane}'s quill line is not a quad`).toBe(4);
      expect(QUILLS[lane]).not.toMatch(/[CcQqSsTtAa]/);
      const [tl, tr, br, bl] = pts;
      // It sits IN the sheen zone and never touches y=0: a gold bar flush against the
      // viewport's own top edge reads as browser chrome, not as a mark on the shaft.
      expect(tl.y).toBe(SHEEN_PEEK);
      expect(tr.y).toBe(SHEEN_PEEK);
      expect(SHEEN_PEEK).toBeGreaterThan(0);
      expect(bl.y - tl.y).toBe(QUILL_H);
      expect(br.y - tr.y).toBe(QUILL_H);
      // …and it stays inside the barrel's own lit zone, which is the ground its
      // 1.4.11 number is quoted against (theme.js's GILT ladder note).
      expect(bl.y).toBeLessThanOrEqual(SHAFT_STOPS.lit * CHROME.headerDesktop);
      // The ends are SLANT-CUT at the composition's one lean, so the indicator is
      // bounded by the same parallels as every other mark on this band.
      expect(bl.x - tl.x).toBeCloseTo(lean(QUILL_H), 9);
      expect(br.x - tr.x).toBeCloseTo(lean(QUILL_H), 9);
      // It spans the lane between its lap boundaries: its right end is exactly where
      // the NEXT cell's leading edge crosses, so it can never be painted over.
      expect(tr.x - tl.x).toBeCloseTo(LANE, 9);
      expect(tl.x).toBeCloseTo(lane * LANE - SEAT + lean(SHEEN_PEEK), 9);
    }
    // 2 — THE MOVE. `vane()` no longer publishes a lower edge at all, so there is no
    // path left for an underline to be stroked along.
    for (const v of VANES) expect(v.lower).toBeUndefined();
    expect(Object.keys(VANES[0])).toEqual(['closed', 'lead', 'trail']);
    // 3 — NO ACTIVE PAINT BELOW THE VANE. The addendum's own pin, asserted on the
    // rendered band: with a fletch lit, nothing gilt is drawn anywhere below the quill
    // line — not on the lower edge, not in the hang, not anywhere.
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const svg = paint(container);
    const gilt = [...svg.querySelectorAll('path')].filter((p) => {
      const paints = [p.getAttribute('fill'), p.getAttribute('stroke')];
      return paints.includes(GILT_LIGHT) || paints.includes(GILT) || paints.includes(GOLD);
    });
    expect(gilt.length, 'the active band paints no metal at all').toBe(1);
    expect(gilt[0].dataset.testid).toBe('nav-fletch-quill-1');
    expect(Math.max(...pathYs(gilt[0].getAttribute('d'))))
      .toBeLessThanOrEqual(SHEEN_PEEK + QUILL_H);
    // …stated as the addendum states it, against the vane's own depth.
    expect(Math.max(...pathYs(gilt[0].getAttribute('d')))).toBeLessThan(BAND);
    // NON-VACUITY: the retired mark really did live below the vane, so this is a
    // relocation and not a claim about a mark that was never there.
    expect(SHEEN_PEEK + QUILL_H).toBeLessThan(BAND * 0.05);
  });
});

describe('3 — THE COMB: fine barb striations, at the derived angle, jittered', () => {
  test('⚠️⚠️ THE COMB IS A WHISPER — the AREAL COVERAGE budget, cause (1)’s cure', () => {
    // THE PIN THIS BLOCK EXISTS FOR NOW, and the one the previous cut did not have.
    // The verifier's finding, quoted: "The comb is stripes, not texture: barbGap 4.1
    // viewBox units = 3.6 CSS px with strokes at 0.7/1.0/1.25px non-scaling → up to
    // ~35% areal coverage; the docstring's 'hairline at a ~8% tonal drop' describes
    // the TONE, not the resulting coverage."
    //
    // ⚠️ THAT IS THE WHOLE LESSON: the old species pin (further down, "the barbs are
    // FINE, not barring") measures the TONAL drop between FLETCH_VANE and FLETCH_BARB
    // and was green throughout, because tone was never the defect. The eye integrates
    // tone × AREA, and a third of the vane's area at any tone is a slatted shutter.
    // So the budget is on area, computed from the same three numbers that draw it.
    const { areal, ink } = combCoverage();
    expect(areal, 'the comb has grown back into stripes').toBeLessThan(0.08);
    expect(ink, 'the comb is no longer a whisper').toBeLessThan(0.025);
    // NON-VACUITY, THE OTHER WAY: it must still EXIST. A comb budgeted to nothing is
    // a vane with no barbs at all, which fails the reference just as surely.
    expect(areal).toBeGreaterThan(0.02);
    for (const o of BARB.opacities) expect(o).toBeGreaterThan(0);
    // Today's values, quoted, in their own assertion so a retune edits an obvious
    // record rather than the invariant above.
    expect((areal * 100).toFixed(1)).toBe('7.2');
    expect((ink * 100).toFixed(1)).toBe('1.4');
    // ⚠️ AND THE NARROW CASE IS QUOTED TOO, not hidden. Barb strokes are CSS px
    // (non-scaling); the gap is viewBox units and compresses with the band, so a
    // NARROWER viewport raises coverage. At the 640px desktop breakpoint the cluster
    // measures about 200px against a 300-unit viewBox.
    expect(combCoverage(200 / 300).areal).toBeLessThan(0.12);
    // The measured scale this is all quoted at, recorded as a receipt (jsdom has no
    // layout and cannot re-derive it).
    expect(BAND_PX_PER_UNIT).toBeCloseTo(264.53 / 300, 4);
  });

  test('the barbs are present, fine, and split across brightness buckets', () => {
    const { container } = render(<App />);
    const svg = paint(container);
    for (const lane of [0, 1, 2]) {
      const paths = [...svg.querySelectorAll(`[data-testid^="nav-fletch-barbs-${lane}-"]`)];
      expect(paths.length, `lane ${lane} has no barbs`).toBe(3);
      const counts = paths.map((p) => (p.getAttribute('d').match(/M /g) || []).length);
      const strokes = counts.reduce((n, c) => n + c, 0);
      // ⚠️ THE CLAIM IS A DENSITY, NOT A COUNT, AND V4 IS WHERE THAT STOPPED BEING A
      // DISTINCTION WITHOUT A DIFFERENCE. The frame's retirement took the two OUTER
      // cells' `RUN` overshoot away, and Realm — which has no lap either — went from a
      // 137-unit span to a 100-unit one, so its barb COUNT fell from ~23 to 17 with the
      // comb itself completely unchanged. A count floor calibrated on the old spans
      // would have red on a band that got narrower, which is not the defect this pin is
      // for. The comb is a spacing, so the pin is a spacing: at least four fifths of the
      // barbs the lane's own width and gap predict.
      const span = LANE + REACH(lane) + 12;   // the cell, plus the 6-unit bleed each side
      expect(strokes, `lane ${lane}'s comb is sparser than its own gap predicts`)
        .toBeGreaterThan((span / laneGap(lane)) * 0.8);
      // Every bucket carries a real SHARE — a bucket that never fills is a jitter that
      // is not jittering, and a bucket that takes most of them is not three buckets.
      // Stated as a fraction for the same reason as above.
      for (const c of counts) {
        expect(c / strokes, `lane ${lane} has a starved brightness bucket`).toBeGreaterThan(0.1);
        expect(c / strokes, `lane ${lane} has a bucket carrying the whole comb`).toBeLessThan(0.7);
      }
      for (const p of paths) {
        expect(p.getAttribute('stroke')).toBe(FLETCH_BARB);
        // Non-scaling stroke is load-bearing under preserveAspectRatio="none": the
        // band's x-scale is not its y-scale, so a scaled hairline would come out
        // heavier one way than the other.
        expect(p.getAttribute('vector-effect')).toBe('non-scaling-stroke');
        expect(p.getAttribute('fill')).toBe('none');
      }
      // Three distinct weights and three distinct opacities — the jitter's second
      // channel, and what stops the comb reading as one flat screen.
      expect(new Set(paths.map((p) => p.getAttribute('stroke-opacity'))).size).toBe(3);
      expect(new Set(paths.map((p) => p.getAttribute('stroke-width'))).size).toBe(3);
    }
  });

  test('⚠️ the jitter is DETERMINISTIC INTEGER ARITHMETIC — no random, no transcendental', () => {
    // A comb built from a random source would differ per render: invisible in review
    // and a golden-shift bomb. `Math.sin` would be worse in a subtler way — it is not
    // required by IEEE-754 to be correctly rounded, so engines differ in the last ulp
    // and the same page would draw differently in two browsers.
    // ⚠️ SCANNED WITH THE COMMENTS STRIPPED. The module's own docstring NAMES the
    // forbidden call in the sentence explaining why it is forbidden, so a raw source
    // scan reds on the warning rather than on the offence — a pin that punishes the
    // documentation is a pin nobody keeps.
    const code = SRC('components/nav/FletchBand.jsx')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).toContain('unitHash'); // the strip did not eat the module
    expect(code).not.toMatch(/Math\.random|crypto\.getRandomValues|Date\.now/);
    expect(code).not.toMatch(/Math\.(sin|cos|tan|exp|log|pow)\b/);
    // Same input, same output, every time.
    for (const n of [0, 1, 7, 911, -3, 123456]) expect(unitHash(n)).toBe(unitHash(n));
    // ⚠️ IN RANGE FOR NEGATIVE INPUTS TOO. The first cut let a signed xor through and
    // `%` kept its sign, so the "unit" came out negative, indexed a bucket at -1 and
    // blew the band up at first paint. Any n must land in [0, 1].
    for (let n = -50; n < 50; n += 1) {
      expect(unitHash(n)).toBeGreaterThanOrEqual(0);
      expect(unitHash(n)).toBeLessThanOrEqual(1);
    }
    // Non-vacuity: it really varies, and the comb really is uneven as a result.
    expect(new Set([...Array(40)].map((_, i) => unitHash(i))).size).toBeGreaterThan(20);
    // ⚠️ MEASURED AGAINST `laneGap(lane)`, NOT `FLETCH.barbGap`. The nominal gap is
    // now scaled per lane (cause 2's cure at the quietest channel), so a pin against
    // the raw token would have to be loosened to a tolerance that no longer describes
    // the jitter — which is how an envelope pin becomes a formality.
    for (const lane of [0, 1, 2]) {
      const xs = (barbBuckets(lane).join(' ').match(/M (-?[\d.]+) 0/g) || [])
        .map((m) => Number(m.slice(2, -2))).sort((a, b) => a - b);
      const gaps = xs.slice(1).map((x, i) => +(x - xs[i]).toFixed(3));
      expect(new Set(gaps).size, `lane ${lane} combs like a ruler`).toBeGreaterThan(3);
      for (const g of gaps) {
        expect(g).toBeGreaterThan(laneGap(lane) * (1 - FLETCH.barbJitter));
        expect(g).toBeLessThan(laneGap(lane) * (1 + FLETCH.barbJitter));
      }
    }
  });

  test('⚠️⚠️ NO TWO CELLS REPEAT — cause (2), the PERIODICITY that made it a shutter', () => {
    // The verifier's finding, quoted: "SHEENS are authored at IDENTICAL offsets in
    // every lane (x0+6 w20, x0+42 w28, x0+80 w15), so all three cells carry the same
    // three bright blobs in the same places; the barb hash varies per lane but the
    // sheen — the loud channel — does not, and combined with one constant 26° angle
    // and one gap across the whole band the eye reads a repeating machine pattern."
    //
    // So the pin is on the two channels that were repeating, stated as a NEGATIVE:
    // no lane may carry another lane's pattern translated by its own lane offset.
    const rel = (lane) => SHEENS[lane].map((d) => ONCURVE(d)
      .filter((p) => p.y === 0)
      .map((p) => +(p.x - (lane * LANE - SEAT)).toFixed(2)).join(','));
    expect(rel(0)).not.toEqual(rel(1));
    expect(rel(1)).not.toEqual(rel(2));
    expect(rel(0)).not.toEqual(rel(2));
    // The comb's nominal spacing differs per lane too, so the three cells cannot beat
    // against one another — and it stays inside a tenth of the token, which is what
    // keeps the envelope pin above a real constraint.
    const gaps = [0, 1, 2].map(laneGap);
    expect(new Set(gaps.map((g) => g.toFixed(4))).size).toBe(3);
    for (const g of gaps) expect(Math.abs(g / FLETCH.barbGap - 1)).toBeLessThanOrEqual(0.1);
    // ⚠️ THE ANGLE IS DELIBERATELY *NOT* VARIED, and this asserts the refusal so a
    // future reader does not "finish" cause (2) by breaking the one-lean law: the
    // comb, both cuts and the sheen all lean by ONE number, which is what makes a lap
    // read as a barb line rather than as a cut across the grain.
    for (const lane of [0, 1, 2]) {
      const [tl, , , bl] = ONCURVE(VANES[lane].closed);
      expect(bl.x - tl.x).toBe(DRIFT);
    }
  });

  test('⚠️ THE LOWER EDGE IS NOT A RULER — cause (3), free barb tips past the cut', () => {
    // The verifier's finding, quoted: "all three cells terminate at y=76, so the
    // composited band is an exact rectangle with a ruler-straight bottom — a
    // fletching's most recognisable feature is its ragged lower edge and there is
    // none."
    //
    // ⚠️ THE CURE IS MATERIAL, NOT SILHOUETTE, AND THAT IS THE OWNER'S CALL STANDING.
    // The final correction forbids torn or complex cell shapes, so the quad stays a
    // quad — the block above still pins four on-curve points and no curve command —
    // and the ruler line is broken by escaped barb tips instead. Both halves are
    // pinned together here so nobody "improves" one by discarding the other.
    const { container } = render(<App />);
    const svg = paint(container);
    for (const lane of [0, 1, 2]) {
      const el = svg.querySelector(`[data-testid="nav-fletch-fray-${lane}"]`);
      expect(el, `lane ${lane} has no frayed edge`).toBeTruthy();
      const d = el.getAttribute('d');
      const hairs = (d.match(/M /g) || []).length;
      // A DENSITY, never a handful: the first cut ran one hair every 2.4-4.6 gaps and
      // they read as stray whiskers at 400%, which is a worse artefact than the ruler.
      // ⚠️ MEASURED AS A DENSITY AND NOT AS A COUNT — same correction as the comb's,
      // for the same reason: the frame's retirement narrowed Realm's cell from 137 band
      // units to 100, so its hair count fell from 13 to 10 with the spacing untouched.
      // The hairs must sit a little over one comb gap apart, which is what makes the
      // edge read as frayed rather than as a row of whiskers.
      const spanU = LANE + REACH(lane);
      expect(hairs, `lane ${lane}'s fray is too sparse to read as an edge`)
        .toBeGreaterThan((spanU / FLETCH.barbGap) * 0.4);
      expect(hairs, `lane ${lane}'s fray is a handful, not an edge`).toBeGreaterThan(8);
      // …and never so dense it becomes a second comb below the cut.
      expect(hairs).toBeLessThan(spanU / FLETCH.barbGap);
      const ys = pathYs(d);
      // Every hair STARTS on the cut and ENDS below it — that is what makes it an
      // escaped tip rather than a fringe drawn under the band.
      expect(Math.min(...ys)).toBe(BAND);
      // ⚠️⚠️ AND IT STARTS ON *THIS CELL'S* CUT, WHICH A SURVIVING MUTANT PROVED WAS
      // UNGUARDED. The pin below checks each hair's own LEAN, and a hair anchored at
      // `x + RUN` instead of `x + DRIFT` leans identically — it is simply drawn a whole
      // run to the wrong side, floating in space beside the feather it is supposed to
      // fringe. Every test in this file stayed green under exactly that edit. So the
      // ANCHOR is now pinned too: every head lies on the segment the quad's own bottom
      // edge occupies, which is the thing "escaped from the cut" actually means.
      const [bl, br] = ONCURVE(VANES[lane].closed).filter((p) => p.y === BAND)
        .map((p) => p.x).sort((a, b) => a - b);
      for (const m of d.matchAll(/M (-?[\d.]+) [\d.]+/g)) {
        const head = Number(m[1]);
        expect(head, `lane ${lane} frays from off the cut`).toBeGreaterThanOrEqual(bl);
        expect(head, `lane ${lane} frays from off the cut`).toBeLessThanOrEqual(br);
      }
      expect(Math.max(...ys)).toBeGreaterThan(BAND);
      // …and no tip reaches so far that it becomes a second silhouette.
      expect(Math.max(...ys) - BAND).toBeLessThan(BAND * 0.07);
      // The tips lean by the ONE number too, so they continue the comb.
      for (const seg of d.match(/M (-?[\d.]+) [\d.]+ L (-?[\d.]+) ([\d.]+)/g) || []) {
        const [, x0, x1, y1] = seg.match(/M (-?[\d.]+) [\d.]+ L (-?[\d.]+) ([\d.]+)/);
        // ⚠️ PRECISION 0, and it is the path's own rounding that sets it: the tips'
        // x's are authored to one decimal, so two of them can each be 0.05 out and
        // the difference 0.1 — a tighter tolerance would pin the rounding, not the
        // lean. The claim is "these hairs run with the comb", not "to 2dp".
        expect(Number(x1) - Number(x0)).toBeCloseTo(lean(Number(y1) - BAND), 0);
      }
    }
    // The three cells' fray patterns are distinct, or the ruler comes back as a
    // repeating fringe — the same defect one layer down.
    expect(new Set([0, 1, 2].map(frayHairs)).size).toBe(3);
    // NON-VACUITY: the quad itself really is still flat-bottomed, so the fray is the
    // only thing doing this job and cannot be silently replaced by a torn silhouette.
    for (const v of VANES) expect(ONCURVE(v.closed).filter((p) => p.y === BAND).length).toBe(2);
  });

  test('⚠️ THREE QUILLS, NOT ONE RAIL — cause (4), the rachis stops at its own lane', () => {
    // The verifier's finding, quoted: "the rachis renders as one continuous pale rail
    // across the top of the whole band rather than three quills."
    //
    // The previous cut ran each quill across its whole quad INCLUDING the lap, so
    // consecutive quills abutted and the band carried a single pale rule along its
    // top — the one mark most likely to say "machined panel". Each quill now starts
    // inside its own lane and stops short of the next division.
    const span = (lane) => {
      const xs = ONCURVE(rachis(lane)).map((p) => p.x);
      return [Math.min(...xs), Math.max(...xs)];
    };
    for (const lane of [0, 1]) {
      const [, end] = span(lane);
      const [nextStart] = span(lane + 1);
      expect(nextStart, `quill ${lane} runs straight into quill ${lane + 1}`)
        .toBeGreaterThan(end);
      // A break the eye can see, not a hairline: at least 5 band units.
      expect(nextStart - end).toBeGreaterThanOrEqual(5);
    }
    // Each quill really tapers — thick at the quill line, thin at the trailing end —
    // and each sits at its own height, so the three do not line up into a rule.
    const tops = [];
    for (const lane of [0, 1, 2]) {
      const pts = ONCURVE(rachis(lane));
      expect(pts.length).toBe(4);
      const [a, b, c, dd] = pts;
      expect(dd.y - a.y, `quill ${lane} does not taper`).toBeGreaterThan(c.y - b.y);
      tops.push(a.y);
    }
    expect(new Set(tops.map((y) => y.toFixed(2))).size, 'the three quills share one height').toBe(3);
  });

  test('⚠️ THE COMB RUNS PARALLEL TO THE CELLS’ OWN EDGES — one lean, not two', () => {
    // The claim the simplified geometry rests on. Every slanted mark on this band —
    // each barb, each sheen band, and BOTH edges of every cell (hence every lap
    // boundary) — leans by the SAME run over the SAME depth. That is what makes a lap
    // read as a barb line rather than as a cut across the grain, and it is why one
    // constant buys the comb, the shingle and the sweep. Two leans maintained
    // separately is how a feather stops looking like one feather.
    for (const lane of [0, 1, 2]) {
      const [tl, , , bl] = ONCURVE(VANES[lane].closed);
      const edgeRun = bl.x - tl.x;
      for (const d of barbBuckets(lane)) {
        const segs = d.match(/M (-?[\d.]+) 0 L (-?[\d.]+) ([\d.]+)/g) || [];
        expect(segs.length, `lane ${lane} bucket has no barbs`).toBeGreaterThan(0);
        for (const seg of segs) {
          const [, x0, x1, y1] = seg.match(/M (-?[\d.]+) 0 L (-?[\d.]+) ([\d.]+)/);
          expect(Number(y1), 'a barb does not span the vane’s full depth').toBe(BAND);
          expect(Number(x1) - Number(x0), 'a barb crosses the cut instead of running with it')
            .toBeCloseTo(edgeRun, 6);
        }
      }
      // …and a sheen band leans by the same number over ITS depth, so the light runs
      // with the barbs it is catching.
      for (const d of SHEENS[lane]) {
        const pts = ONCURVE(d);
        const top = pts.filter((q) => q.y === 0).sort((a, b) => a.x - b.x);
        const low = pts.filter((q) => q.y === SHEEN_FLOOR).sort((a, b) => a.x - b.x);
        expect(top.length).toBe(2);
        expect(low.length).toBe(2);
        expect(low[0].x - top[0].x).toBeCloseTo(lean(SHEEN_FLOOR), 6);
      }
    }
  });

  test('the comb angle is DERIVED from the FEATHER, never from the chrome', () => {
    // A barb leaves the rachis and runs FLETCH.barbRun across the vane over exactly
    // the vane's own depth. ⚠️ IT USED TO DERIVE FROM CHROME.headerDesktop, which was
    // true only while the vane was as deep as the bar: thinning the shaft would then
    // have swung the comb on every feather as a side effect of a layout edit.
    expect(FLETCH_BARB_DEG).toBe(
      Math.round((Math.atan2(FLETCH.barbRun, FLETCH.band) * 180) / Math.PI),
    );
    expect(FLETCH_BARB_DEG).toBe(26); // today's value — a comb, not a rake
    // NEGATIVE CONTROL: the comb must not run with the wood. The shaft's grain is
    // LONGITUDINAL (the turbulence is stretched along the shaft), so a vertical or
    // horizontal comb would read as one interference pattern where vane meets barrel.
    expect(FLETCH_BARB_DEG % 90).not.toBe(0);
  });

  test('the rachis and the sheen bands are present, and the sheen STOPS SHORT', () => {
    const { container } = render(<App />);
    const svg = paint(container);
    for (const lane of [0, 1, 2]) {
      expect(svg.querySelector(`[data-testid="nav-fletch-rachis-${lane}"]`)).toBeTruthy();
      const sheen = svg.querySelector(`[data-testid="nav-fletch-sheen-${lane}"]`);
      expect(sheen).toBeTruthy();
      const bands = [...sheen.querySelectorAll('path')];
      expect(bands.length).toBe(SHEENS[lane].length);
      expect(bands.length).toBe(3); // soft uneven runs, the goose reading — never stripes
      // ⚠️ THE CONTRAST GUARANTEE, AS GEOMETRY. The active vane's gold runs along its
      // own lower silhouette, and GOLD is 2.42:1 on a sheen band but 4.12:1 on the
      // vane gradient. A band reaching the lower edge would put a state-carrying
      // boundary under 1.4.11's floor at whatever x it crossed.
      for (const p of bands) {
        expect(Math.max(...pathYs(p.getAttribute('d')))).toBeLessThanOrEqual(SHEEN_FLOOR);
      }
      expect(SHEEN_FLOOR).toBeLessThan(BAND);
    }
  });
});

describe('4 — THE WRAPS: two glossy bands riding the shaft, bracketing the cluster', () => {
  test('both wraps render, on bare barrel OUTSIDE the fletching', () => {
    const { container } = render(<App />);
    const band = container.querySelector('[data-testid="nav-fletch-band"]');
    const lead = container.querySelector('[data-testid="nav-shaft-wrap-lead"]');
    const trail = container.querySelector('[data-testid="nav-shaft-wrap-trail"]');
    expect(lead).toBeTruthy();
    expect(trail).toBeTruthy();
    // ⚠️⚠️ THEY BRACKET THE CLUSTER AT ITS QUILL-LINE CORNERS, NOT AT ITS BOX, AND V4
    // IS WHERE THOSE STOPPED BEING THE SAME PLACE. Until the frame retired, the band's
    // two outer ends were square, so a wrap at `right: 100%` bound the feather by
    // construction. The owner's "every border parallel" makes both ends slashes, and the
    // whole band's quill line is displaced by |SEAT| — so a wrap left at the box would
    // bind nothing at the lead end and leave bare feather standing proud at the trail.
    //
    // The inset is therefore DERIVED from the band's own seat, and the pin re-derives
    // it here rather than restating the string: a hand-typed percentage that happened to
    // match today's lean is exactly the side-table hazard this estate keeps being bitten
    // by. `BITE` is the 3px of thread that paints over the corner.
    const corner = Math.abs(SEAT) / BAND_W;
    const BITE = 3;
    // ⚠️ PARSED, NOT STRING-MATCHED. cssstyle re-serialises a calc() and drops trailing
    // precision (103.0833% comes back as 103.083%), so a literal comparison would pin
    // the serialiser rather than the geometry — and would red on a jsdom bump.
    const calcOf = (v) => {
      const m = v.match(/^calc\((-?[\d.]+)%\s*-\s*([\d.]+)px\)$/);
      expect(m, `not a seated inset: ${v}`).toBeTruthy();
      return { pct: Number(m[1]), px: Number(m[2]) };
    };
    expect(calcOf(lead.style.right).pct).toBeCloseTo((1 - corner) * 100, 3);
    expect(calcOf(trail.style.left).pct).toBeCloseTo((1 + corner) * 100, 3);
    expect(calcOf(lead.style.right).px).toBe(BITE);
    expect(calcOf(trail.style.left).px).toBe(BITE);
    // NON-VACUITY: the offset is a real displacement, not 100% written the long way —
    // and it is SMALL, because a wrap that walked far into the band would cross a label.
    expect(corner).toBeGreaterThan(0.02);
    expect(corner).toBeLessThan(0.05);
    // …and it really lands on the corner the band draws. Realm's trailing corner sits
    // `corner` PAST the box and Create's leading corner `corner` INSIDE it, which is
    // the asymmetry the two insets encode.
    expect(ONCURVE(VANES[0].closed)[0].x / BAND_W).toBeCloseTo(corner, 9);
    expect(ONCURVE(VANES[2].closed)[1].x / BAND_W).toBeCloseTo(1 + corner, 9);
    expect(band.contains(lead)).toBe(true);
    // Out of flow, so they spend no row width and cannot wrap the header to a
    // second flex line.
    for (const w of [lead, trail]) {
      expect(w.style.position).toBe('absolute');
      expect(w.getAttribute('aria-hidden')).toBe('true');
      expect(w.style.pointerEvents).toBe('none');
      expect(w.textContent).toBe('');
      expect(w.style.width).toBe(`${FLETCH.wrap}px`);
      // The thread is red-brown and WOUND — the turns are what stop it reading as a
      // painted stripe.
      expect(w.style.backgroundColor).toBe(rgb(WRAP));
      expect(w.style.backgroundImage).toContain('repeating-linear-gradient');
    }
  });

  test('the wrap is lit by the SAME light as the barrel it rides', () => {
    // A wrap with its own highlight position reads as a sticker on a shaft. Sharing
    // SHAFT_STOPS is what makes the two cylinders one object.
    const { container } = render(<App />);
    const lead = container.querySelector('[data-testid="nav-shaft-wrap-lead"]');
    expect(lead.style.backgroundImage).toContain(`${SHAFT_STOPS.lit * 100}%`);
    expect(lead.style.backgroundImage).toContain(`${SHAFT_STOPS.mid * 100}%`);
  });
});

describe('5 — THE CYLINDER: the bar is a shaft seen in profile, not a plank', () => {
  test('the barrel is shaded, and it darkens DOWNWARD toward the silhouette', () => {
    // The read the whole composition rests on: lighter above, darker toward the
    // bottom edge. Inverted, the bar would look like a lit shelf, not a round shaft.
    const ladder = [SHAFT_SHEEN, SHAFT, SHAFT_BODY, SHAFT_EDGE, SHAFT_RIM];
    for (let i = 1; i < ladder.length; i += 1) {
      expect(relLuminance(ladder[i]), `${ladder[i]} must be darker than ${ladder[i - 1]}`)
        .toBeLessThan(relLuminance(ladder[i - 1]));
    }
    // All five really are in the painted gradient — a ladder nobody paints is a lie.
    for (const tone of ladder) expect(SHAFT_CYLINDER).toContain(tone);
    expect(SHAFT_CYLINDER).toContain('180deg');
    // The modelling range: a real barrel, and still one piece of wood. ⚠️ The RANGE is
    // what is pinned, not the tones: V4 re-authored all five for the cedar shaft and
    // deliberately preserved the modelling, so this number moved only in its last digit
    // while every colour in it changed.
    expect(ratio(SHAFT_SHEEN, SHAFT_RIM)).toBeCloseTo(2.76, 2);
  });

  test('the falloff ACCELERATES toward the rim — that is what makes it round', () => {
    // A cylinder's cos-falloff is flat near the centreline and steep near the
    // silhouette. Painted linearly it reads as a gradient-filled rectangle, which is
    // exactly the "feathers on a plank" failure the directive names.
    const early = (SHAFT_STOPS.mid - SHAFT_STOPS.lit);
    const late = (1 - SHAFT_STOPS.edge);
    const dropEarly = relLuminance(SHAFT_SHEEN) - relLuminance(SHAFT);
    const dropLate = relLuminance(SHAFT_EDGE) - relLuminance(SHAFT_RIM);
    expect(dropLate / late).toBeGreaterThan(dropEarly / early);
  });

  test('⚠️⚠️ THE LABEL BOX IS DERIVED FROM THE MEASURED RIDERS — F2’s cure', () => {
    // WHAT THIS PIN USED TO SAY, AND WHY IT WAS FALSE. It read: "SHAFT_STOPS.body
    // CLEARS THE LABEL BOX on BOTH header heights", computing labelBottom =
    // (1 + LABEL_BOX/h)/2 from a hand-keyed LABEL_BOX = 20. The verifier's F2:
    // "the tallest rider is the wordmark, whose box is 34.84px, 74% larger than 20...
    // LABEL_BOX=20 is a hand-keyed side table standing in for 'every rider's box' —
    // the exact hazard class this estate has been bitten by."
    //
    // ⚠️ AND THE MODEL WAS WRONG TWICE. Even the correct box would have given the
    // wrong answer, because "vertically centred" is false of ink: the wordmark's
    // deepest ink is the `g` of "Forge" at 37.08px of 38 (fraction 0.9758), which the
    // centred-box formula puts at 0.958. So the derivation is on MEASURED INK now, and
    // the box survives only for the SEAT claim, which is genuinely about boxes.
    expect(LABEL_BOX).toBe(Math.max(...Object.values(HEADER_RIDERS).map((r) => r.box)));
    expect(LABEL_BOX).toBe(HEADER_RIDERS.wordmark.box);
    expect(LABEL_BOX).toBe(34.84);        // today's value, recorded
    expect(LABEL_BOX).not.toBe(20);       // the hand-keyed number this replaced
    // THE TABLE IS ABOUT THE BARS THIS APP ACTUALLY PAINTS: every desktop row was
    // measured on a bar of exactly CHROME.headerDesktop, so a future resize that
    // forgets to re-measure reds here rather than shipping a stale ground.
    for (const [name, r] of Object.entries(HEADER_RIDERS)) {
      expect(r.ink[1], `${name}'s ink is not below its own top`).toBeGreaterThan(r.ink[0]);
      expect(r.ink[1], `${name}'s ink escapes its own bar`).toBeLessThanOrEqual(r.bar);
      if (name !== 'mobileTab') {
        expect(r.bar, `${name} was measured on a bar this app no longer paints`)
          .toBe(CHROME.headerDesktop);
      }
    }
    // ⚠️ THE MOBILE BAR IS CONTENT-SIZED — it wraps to two rows at phone widths — so
    // its row is measured rather than derived from CHROME.headerMobile, and it is
    // TALLER than that token rather than equal to it. Asserting the relationship keeps
    // the row honest without pretending the token predicts the bar.
    expect(HEADER_RIDERS.mobileTab.bar).toBeGreaterThan(CHROME.headerMobile);
    // ⚠️ NO PIN MAY DERIVE A CONTRAST FLOOR FROM THIS NUMBER AGAIN. The floor is per
    // rider and lives in tests/design/compositedBarAA.test.js; the deepest ink on the
    // bar sits BELOW SHAFT_STOPS.body, which is exactly the fact the old pin denied.
    const deepest = Math.max(...Object.values(HEADER_RIDERS).map((r) => r.ink[1] / r.bar));
    expect(deepest).toBeCloseTo(0.9758, 4);
    expect(deepest, 'the old "the falloff never reaches a letterform" claim is back')
      .toBeGreaterThan(SHAFT_STOPS.body);
  });

  test('BOTH headers paint the same barrel, grain OVER shading, over a base colour', () => {
    const { container } = render(<App />);
    const header = container.querySelector('header');
    expect(header.style.backgroundColor).toBe(rgb(SHAFT));
    // Paint order is the claim: grain is a property of the surface, shading is the
    // light falling on it. Reversed, the barrel washes over the grain and the wood
    // goes flat.
    expect(SHAFT_GRAIN_LAYERS.indexOf(SHAFT_GRAIN_TEXTURE))
      .toBeLessThan(SHAFT_GRAIN_LAYERS.indexOf(SHAFT_CYLINDER));
    // ⚠️ background-IMAGE over background-COLOR, never the shorthand: the grain is
    // transparent in its gaps and the page would show through the shaft.
    expect(header.style.backgroundImage).toBeTruthy();
  });
});

describe('6 — THE TEXTURE IS DETERMINISTIC: a fixed seed, and no random source', () => {
  test('the grain is inline feTurbulence at a FIXED seed, stretched ALONG the shaft', () => {
    expect(SHAFT_GRAIN_TEXTURE).toContain('data:image/svg+xml');
    expect(SHAFT_GRAIN_TEXTURE).toContain('feTurbulence');
    expect(SHAFT_GRAIN_TEXTURE).toContain("seed='7'");
    // ANISOTROPY IS THE WHOLE TRICK: slow across the shaft, fast along its short
    // axis, which is what turns fractal noise into LONGITUDINAL grain. An isotropic
    // baseFrequency would give a blotchy stucco, not turned wood.
    const bf = SHAFT_GRAIN_TEXTURE.match(/baseFrequency='([\d.]+) ([\d.]+)'/);
    expect(bf, 'the grain must declare a two-axis baseFrequency').toBeTruthy();
    expect(Number(bf[2])).toBeGreaterThan(Number(bf[1]) * 10);
    // Seamless when the tile repeats, or the plank shows a join at some width.
    expect(SHAFT_GRAIN_TEXTURE).toContain("stitchTiles='stitch'");
  });

  test('the data URI is a CONSTANT and the module names no random source', async () => {
    // Non-vacuity: re-importing the module fresh yields the identical string. A
    // texture built at import time from a random source would differ here and be
    // invisible in review.
    vi.resetModules();
    const again = await import('../../src/components/theme.js');
    expect(again.SHAFT_GRAIN_TEXTURE).toBe(SHAFT_GRAIN_TEXTURE);
    const src = SRC('components/theme.js');
    expect(src).not.toMatch(/Math\.random|crypto\.getRandomValues|Date\.now/);
  });

  test('the URI is escaped in the ORDER that makes it valid', () => {
    // `%` must be escaped BEFORE `#`, or the `%23` the escaper itself emits gets
    // re-escaped into `%2523` and the filter reference dangles — a bug that renders
    // as a completely untextured bar and nothing else.
    expect(SHAFT_GRAIN_TEXTURE).toContain('%23grain');
    expect(SHAFT_GRAIN_TEXTURE).not.toContain('%2523');
    expect(SHAFT_GRAIN_TEXTURE).not.toContain('<');
    expect(SHAFT_GRAIN_TEXTURE).not.toContain('>');
  });
});

describe('7 — ⚠️⚠️ the hang is PAINT, and the layout box stays CHROME.headerDesktop', () => {
  test('the anchor derivation chain the hang must not disturb', () => {
    // The reason this whole block exists, pinned beside the thing that could break
    // it. THE DERIVATION IS THE CLAIM: assert the sum's SHAPE, never the number it
    // currently reaches, so slimming the shaft again moves this pin with it.
    expect(ANCHOR_OFFSET).toBe(CHROME.headerDesktop + SP.xxl);
    // Today's values, in a SEPARATE assertion so a future resize edits one line that
    // is obviously a record and never the invariant.
    expect(CHROME.headerDesktop).toBe(38);
    expect(ANCHOR_OFFSET).toBe(62);
  });

  test('⚠️⚠️ THE THIN SHAFT SEATS ITS RIDERS AT THEIR CURRENT FONT SIZES', () => {
    // THE PIN THAT MAKES 38 A FLOOR RATHER THAN A PREFERENCE, and the one the next
    // person to thin this bar will actually be stopped by. The directive is "the
    // thinnest bar that still seats the wordmark, the reference tabs and Sign In AT
    // CURRENT FONT SIZES" — so the type is what is pinned, and the bar is required to
    // fit around it. Sizing the bar down by shrinking the type would satisfy any
    // height pin and betray the whole instruction.
    //
    // ⚠️ jsdom HAS NO LAYOUT, so the measured box heights below are receipts from a
    // real browser (Chrome, 1440x900, this lane) recorded beside the declarations
    // that produce them. What jsdom CAN prove is that the declarations have not
    // moved, and that the arithmetic those measurements imply still clears.
    // ⚠️ THE RIDER SET IS NOW theme.js's HEADER_RIDERS — the SAME table the contrast
    // floor reads (F2's cure: "make the lane's own SEAT pin cover the same set"). Two
    // hand-keyed tables describing one bar is how the two claims drifted apart in the
    // first place: the seat pin knew the wordmark was 34.8 while LABEL_BOX said 20.
    const RIDERS = HEADER_RIDERS;
    const DESKTOP = Object.entries(RIDERS).filter(([name]) => name !== 'mobileTab');
    // 1. THE TYPE HAS NOT MOVED. These are the sizes the measurement was taken at.
    expect(FS.h1).toBe(24);
    expect(FS.sm).toBe(12);
    expect(SP.sm).toBe(8);
    // 2. THE TAB'S HEIGHT IS ARITHMETIC, not a measurement — label line box (16 at
    //    FS.sm) + both paddings + its 2px rule — so this half needs no browser at all.
    expect(16 + SP.sm * 2 + 2).toBe(RIDERS.tab.box);
    // 3. THE BAR SEATS THE TALLEST OF THEM, with air on both sides.
    const tallest = Math.max(...DESKTOP.map(([, r]) => r.box));
    expect(tallest).toBe(LABEL_BOX);
    expect(tallest).toBe(34.84);
    expect(CHROME.headerDesktop, 'the bar no longer seats its tallest rider')
      .toBeGreaterThan(tallest);
    // …and it is a SEAT, not a coincidence: at least a pixel of air above and below.
    // 36 would leave 0.58px, which is one font fallback away from a clipped wordmark.
    expect((CHROME.headerDesktop - tallest) / 2).toBeGreaterThanOrEqual(1);
    // 3b. ⚠️ AND THE INK IS SEATED TOO, WHICH THE BOX ALONE DOES NOT PROVE. The
    //     wordmark's ink OVERFLOWS its own 34.84px box by 0.66px at the bottom — that
    //     is exactly why the box-based AA model could not see the defect F2 found —
    //     so the seat is asserted on the measurement as well as on the box.
    for (const [name, r] of DESKTOP) {
      expect(r.ink[0], `${name}'s ink is clipped at the top of the bar`).toBeGreaterThan(0);
      expect(r.ink[1], `${name}'s ink is clipped at the bottom of the bar`).toBeLessThan(r.bar);
    }
    expect(RIDERS.wordmark.ink[1]).toBe(37.08);
    expect(CHROME.headerDesktop - RIDERS.wordmark.ink[1]).toBeCloseTo(0.92, 2);
    // 4. NEGATIVE CONTROL — and it is the whole point of the block. The bar is
    //    genuinely THIN: it is not merely "big enough", it is within a few px of the
    //    floor its own type imposes. A future edit that fattened it back toward 48
    //    reds here, with the reason attached.
    expect(CHROME.headerDesktop - tallest).toBeLessThan(8);
  });

  test('⚠️ THE BAND IS ROUGHLY TWICE THE BAR, so about half of it HANGS', () => {
    // The composition, as a number. The owner asked for a band "roughly twice the
    // bar's height, top-aligned, hanging 40-50% below the bar's bottom edge" — which
    // is the same statement twice: at exactly twice, exactly half hangs. Pinned as a
    // BAND rather than an equation on purpose (see theme.js's note): making `band` a
    // multiple of the chrome would freeze the hang at a fixed fraction and it could
    // never deepen as the shaft thins, which is the behaviour the directive is FOR.
    expect(BAND / CHROME.headerDesktop).toBeGreaterThanOrEqual(1.8);
    expect(BAND / CHROME.headerDesktop).toBeLessThanOrEqual(2.2);
    const hangShare = FLETCH_HANG / BAND;
    expect(hangShare, 'the band no longer hangs the share the directive asks for')
      .toBeGreaterThanOrEqual(0.40);
    expect(hangShare).toBeLessThanOrEqual(0.50);
    // Today's values, recorded so a reader knows the bar without running it.
    expect(BAND).toBe(76);
    expect(FLETCH_HANG).toBe(38);
  });

  test('the DESKTOP HEADER ITSELF spends CHROME.headerDesktop, in border-box', () => {
    // ⚠️ Everything else here proves the fletching does not ADD height. This proves
    // the bar SPENDS the token at all — the half V2 actually repaired, when the
    // header sized by content and an in-flow SVG set the flex line at 124 while the
    // token said 60.
    const { container } = render(<App />);
    const header = container.querySelector('header');
    expect(header).toBeTruthy();
    expect(header.style.minHeight).toBe(`${CHROME.headerDesktop}px`);
    // border-box is load-bearing beside it: under content-box the min-height would
    // be the CONTENT box and the bar would measure the token plus any padding.
    expect(header.style.boxSizing).toBe('border-box');
    // …and it is a FLOOR, never a fixed height (J-V2-1): the desktop breakpoint is
    // 640px while this row wants ~1000, so flexWrap really fires on a narrow desktop
    // and a fixed height would clip the second line instead of growing.
    expect(header.style.height).toBeFalsy();
    expect(header.style.maxHeight).toBeFalsy();
  });

  test('the hang is DERIVED from the feather and the bar, and really reaches past it', () => {
    // FIRST, that the peek exists at all. Without this, the absence census below
    // would pass just as happily on a fletching that had lost it.
    expect(FLETCH_HANG).toBe(FLETCH.band - CHROME.headerDesktop);
    expect(FLETCH_HANG).toBeGreaterThan(0);
    expect(BAND).toBe(FLETCH.band);
    for (const v of VANES) {
      expect(Math.max(...pathYs(v.closed))).toBe(BAND);
      expect(Math.max(...pathYs(v.closed))).toBeGreaterThan(CHROME.headerDesktop);
    }
    // …and the viewBox is exactly the BAR, so one vertical unit is one pixel and
    // FLETCH_HANG is a real measurement rather than a coordinate that looks like one.
    const { container } = render(<App />);
    expect(paint(container).getAttribute('viewBox')).toBe(`0 0 ${BAND_W} ${CHROME.headerDesktop}`);
  });

  test('the peek is bought with OVERFLOW on a zero-inset box, not with a taller one', () => {
    // ⚠️ THE MECHANISM PIN. Every other way to reach below this box — a taller
    // height, `calc(100% + Npx)`, a negative `bottom` — spends a layout property.
    // Painting outside your own box costs no box; growing it costs every anchor in
    // the estate.
    const { container } = render(<App />);
    const svg = paint(container);
    expect(svg.style.overflow).toBe('visible');
    expect(svg.style.position).toBe('absolute');
    for (const side of ['top', 'right', 'bottom', 'left']) {
      expect(svg.style[side], `band.${side} must be flush with the cluster`).toBe('0px');
    }
    expect(svg.style.height).toBe('100%');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.style.pointerEvents).toBe('none');
  });

  test('NO element in the ribbon spends the hang on a LAYOUT property', () => {
    const { container } = render(<App />);
    const nav = container.querySelector('header nav');
    const nodes = [nav, ...nav.querySelectorAll('*')];
    expect(nodes.length).toBeGreaterThan(10); // not a vacuous walk
    const LAYOUT = [
      'height', 'minHeight', 'maxHeight',
      'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom',
      'top', 'bottom', 'transform',
    ];
    const hang = `${FLETCH_HANG}px`;
    const depth = `${FLETCH.band}px`;
    for (const el of nodes) {
      if (!el.style) continue;
      for (const prop of LAYOUT) {
        const v = el.style[prop];
        if (!v) continue;
        for (const spend of [hang, depth]) {
          expect(
            String(v).includes(spend),
            `<${el.tagName}> spends the hang on ${prop}: ${v}`,
          ).toBe(false);
        }
      }
      // And no negative VERTICAL pull either — the other way to fake a hang.
      // (Horizontal is exempt and deliberately so: the wraps hang outside the
      // cluster on `right: 100%`, which is paint beside the box, not height under it.)
      for (const prop of ['marginBottom', 'bottom', 'marginTop', 'top']) {
        const v = el.style[prop];
        if (v) expect(String(v).startsWith('-'), `<${el.tagName}> ${prop}=${v}`).toBe(false);
      }
    }
  });
});

describe('8 — ⚠️ the clip never touches a focusable element, so the focus ring survives', () => {
  test('the clipped layers are inside the aria-hidden band, never the controls', () => {
    const { container } = render(<App />);
    const clipped = [...container.querySelectorAll('header nav [clip-path], header nav clipPath')];
    expect(clipped.length).toBeGreaterThan(0); // non-vacuity: something really is clipped
    for (const el of clipped) {
      expect(el.tagName.toLowerCase()).not.toBe('button');
      // The decisive one: a clipped node may not CONTAIN anything focusable.
      expect(el.querySelector('button, a, input, [tabindex]')).toBeNull();
      // …and it lives inside an aria-hidden decoration, so it contributes no name.
      expect(el.closest('[aria-hidden="true"]')).toBeTruthy();
    }
  });

  test('no fletch control — nor any ancestor up to the header — clips or hides overflow', () => {
    const { container } = render(<App />);
    const drawn = feathers(container);
    expect(drawn.length).toBe(3); // not a vacuous loop
    for (const button of drawn) {
      expect(button.tagName).toBe('BUTTON');
      expect(button.style.clipPath).toBeFalsy();
      // The band's paint is not even INSIDE the control any more, so there is no
      // ancestor relationship left to get wrong.
      expect(button.querySelector('svg')).toBeNull();
      for (let el = button; el && el.tagName !== 'HEADER'; el = el.parentElement) {
        expect(el.style?.clipPath, `${el.tagName} clips the ring`).toBeFalsy();
        expect(['hidden', 'clip']).not.toContain(el.style?.overflow);
        expect(['hidden', 'clip']).not.toContain(el.style?.overflowY);
      }
    }
  });

  test('⚠️⚠️ THE FLETCH CELL’S RING IS DRAWN IN FULL, AND IT IS LEGIBLE — F5’s cure', () => {
    // The verifier's F5, quoted: "THE FLETCH CELLS' FOCUS RING LOSES ITS TOP EDGE. Real
    // Tab traversal gives skip-link -> SettlementForge -> Create -> Library -> Realm ->
    // ... and NO focusable control has a clipping ancestor... so the lane's central
    // a11y claim holds. But the fletch cells take `outline: rgb(244,234,208) solid 3px`
    // at outline-offset 0 on a box spanning y=0..38 inside a sticky top:0 header, so
    // the ring's top 3px is drawn at y=-3..0 and is off-viewport... The lapped cell's
    // ring is visible on three sides only."
    //
    // ⚠️ THE BLOCK ABOVE ALREADY PROVED NOTHING CLIPS THE RING. That was the whole of
    // the old claim, and it was TRUE and INSUFFICIENT: a ring can be unclipped by every
    // ancestor and still be painted where no viewport reaches. This pin is the missing
    // half — the ring must land INSIDE the box it belongs to.
    const a11y = readFileSync(join(HERE, '../../src/styles/a11y.css'), 'utf8');
    const ring = a11y.match(/outline:\s*(\d+(?:\.\d+)?)px\s+solid\s+var\(--sf-focus\)/);
    expect(ring, 'a11y.css no longer draws the ring this pin is derived from').toBeTruthy();
    const ringPx = Number(ring[1]);
    expect(a11y, 'a11y.css no longer reads the offset variable this cell sets')
      .toContain('outline-offset: var(--sf-focus-ring-offset)');

    const { container } = render(<App />);
    const drawn = feathers(container);
    expect(drawn.length).toBe(3); // not a vacuous loop
    for (const b of drawn) {
      // 1 — THE OFFSET IS INSET BY AT LEAST THE RING'S OWN WIDTH, so the whole ring is
      //     drawn inside a box whose top edge is the sticky header's top edge.
      const offset = b.style.getPropertyValue('--sf-focus-ring-offset');
      expect(offset, `${label(b)} has no inset ring`).toBeTruthy();
      expect(Number(offset.replace('px', '')), `${label(b)}'s ring still reaches outside its box`)
        .toBeLessThanOrEqual(-ringPx);
      // 2 — THE COLOUR IS THE ONE SANCTIONED OVERRIDE, and it is set to a tone that
      //     clears SC 1.4.11 on the ground the ring is actually drawn on.
      expect(b.style.getPropertyValue('--sf-focus')).toBe(PARCH);
      // 3 — AND NOTHING SUPPRESSES THE RING. a11y.css's standing rule is that a
      //     component may re-colour it and may never switch it off.
      expect(b.style.outline).toBeFalsy();
    }
    // THE CONTRAST THAT MADE THE COLOUR NECESSARY, quoted both ways.
    // ⚠️⚠️ AND V4 CORRECTED WHICH GROUND THE CLAIM IS AGAINST, WHICH MATTERS BECAUSE THE
    // OLD GROUND WOULD NOW LET THE BRONZE BACK IN. On the V3 vane the house bronze
    // measured 2.41:1 and failed on the vane body alone. The V4 feather is darker, so
    // the bronze clears 3:1 there (3.36:1) — and a pin written against the VANE would
    // now happily green-light restoring it. The honest ground was always the LIGHTEST
    // band a fletch cell can show, because a focus ring is drawn across the whole cell
    // including its brightened sheen, and THERE the bronze still fails at 2.71:1.
    const HOUSE_RING = (a11y.match(/--sf-focus:\s*(#[0-9A-Fa-f]{6})/) || [])[1];
    expect(HOUSE_RING).toBe('#a0762a');
    expect(ratio(HOUSE_RING, FLETCH_SHEEN_LIFT), 'the house ring reads on the lit cell after all')
      .toBeLessThan(3);
    expect(ratio(HOUSE_RING, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('1.93');
    // …recorded beside the number that would have hidden it, so the trap is written down.
    expect(ratio(HOUSE_RING, FLETCH_VANE)).toBeGreaterThanOrEqual(3);
    expect(ratio(HOUSE_RING, FLETCH_VANE).toFixed(2)).toBe('3.36');
    // THE OVERRIDE'S OWN TONE clears on BOTH, which is why it is the right answer at
    // either reading.
    expect(ratio(PARCH, FLETCH_VANE)).toBeGreaterThanOrEqual(3);
    expect(ratio(PARCH, FLETCH_VANE).toFixed(2)).toBe('12.67');
    expect(ratio(PARCH, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(3);
    expect(ratio(PARCH, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('7.27');

    // 4 — THE GEOMETRY THAT MAKES AN OUTSET RING IMPOSSIBLE HERE, as arithmetic.
    //     A fletch cell is `alignSelf: stretch` inside a header stuck at top 0, so its
    //     box top IS the viewport's top edge and an outset ring is drawn at negative y.
    //     (Measured in Chrome this lane: fletch cell box top 0, height 38; the plain
    //     tabs sit at top 2 and lose their top edge too — reported separately.)
    for (const b of drawn) expect(b.style.alignSelf).toBe('stretch');
    expect(0 - Number(a11y.match(/--sf-focus-ring-offset:\s*(\d+)px/)[1]) - ringPx)
      .toBeLessThan(0); // an outset ring's top edge lands above the viewport

    // 5 — NEGATIVE CONTROL: the plain reference tabs do NOT take the override. The
    //     inset is a considered answer to the fletch cell's own geometry and its own
    //     dark ground, not a blanket suppression of the house ring.
    for (const p of plains(container)) {
      expect(p.style.getPropertyValue('--sf-focus-ring-offset')).toBe('');
      expect(p.style.getPropertyValue('--sf-focus')).toBe('');
    }
  });

  test('the fletches are in the TAB ORDER, in reading order, and take focus', () => {
    const { container } = render(<App />);
    // The tab order jsdom can prove: every nav control is a native button with no
    // tabindex override, so the platform sequences them in DOM order — and the
    // band's paint is not in it at all. (A real Tab traversal was also driven in a
    // browser for this lane; the receipt is in the lane notes.)
    const order = [...container.querySelectorAll('header nav button')];
    expect(order.map(label)).toEqual(NAV.map((n) => n.label));
    for (const button of order) {
      expect(button.getAttribute('type')).toBe('button');
      expect(button.hasAttribute('disabled')).toBe(false);
      expect(button.hasAttribute('tabindex')).toBe(false);
      button.focus();
      expect(document.activeElement, `${label(button)} did not take focus`).toBe(button);
    }
    // The paint is NOT a tab stop: an SVG with focusable="false" and aria-hidden.
    expect(paint(container).getAttribute('focusable')).toBe('false');
    expect(paint(container).querySelector('[tabindex]')).toBeNull();
  });

  test('clicking a fletch still navigates — the band is not eating the pointer', () => {
    const onNavClick = vi.fn();
    const { container } = render(<NavRibbon view="generate" onNavClick={onNavClick} />);
    const realm = feathers(container).find((b) => label(b) === 'Realm');
    realm.click();
    expect(onNavClick).toHaveBeenCalledWith('realm');
  });

  test('the band contributes no accessible name — every cell reads as its label alone', () => {
    const { container } = render(<App />);
    for (const [i, b] of [...container.querySelectorAll('header nav button')].entries()) {
      expect(label(b)).toBe(NAV[i].label);
    }
  });

  test('⚠️ the three fletch cells are EQUAL-WIDTH lanes, matching the drawn thirds', () => {
    // The band's vanes live at fixed thirds of one coordinate space, so a cell wider
    // or narrower than a third would put its label off its own feather's calm zone
    // and land the lap boundaries inside labels instead of between them. jsdom has
    // no layout, so the pin is on the declaration that produces the thirds.
    // (Authored as LONGHANDS: jsdom's cssstyle does not implement the `flex`
    // shorthand and drops it silently, so a shorthand pin here would be vacuous.)
    const { container } = render(<App />);
    for (const b of feathers(container)) {
      expect(b.style.flexGrow, `${label(b)} does not grow`).toBe('1');
      expect(b.style.flexBasis, `${label(b)} is not zero-basis`).toBe('0px');
      expect(b.style.alignSelf).toBe('stretch');
    }
    // The plain tabs must NOT grow — they are a shelf, not a journey.
    for (const b of plains(container)) expect(b.style.flexGrow).toBeFalsy();
  });
});

describe('9 — the active fletch LIGHTENS, and takes the gold along its own edge', () => {
  test('active brightens the sheen, brightens the label, and gilds the silhouette', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const active = feathers(container).find((b) => label(b) === 'Library');

    expect(active.getAttribute('aria-current')).toBe('page');          // 1 — semantics
    expect(active.style.color).toBe(rgb(PARCH));                       // 2 — brighter label
    const svg = paint(container);
    // The band knows WHICH lane is active — the index, derived from the run's own
    // membership, so a nav reorder cannot light the wrong feather.
    expect(svg.dataset.activeLane).toBe('1');
    const vane = svg.querySelector('[data-testid="nav-fletch-vane-1"]');
    expect(vane.dataset.fletchState).toBe('active');
    // 3 — THE WHOLE CELL BRIGHTENS. The owner's active grammar is a BRIGHTENED CELL
    // plus a gold underline, so the fill itself steps one rung up the ladder and the
    // sheen bands riding it lift with it. Pinned as a DIFFERENT gradient reference
    // from the resting one, because a fill that merely looked lighter in review and
    // resolved to the same url() would be the whole state channel silently gone.
    const fill = vane.querySelector('path').getAttribute('fill');
    expect(fill).toContain('-vane-lit');
    const bands = [...svg.querySelectorAll('[data-testid="nav-fletch-sheen-1"] path')];
    expect(bands.length).toBe(3);
    for (const b of bands) expect(b.getAttribute('fill')).toBe(FLETCH_SHEEN_LIFT);
    // 4 — the QUILL LINE, lying on the binding at the top of the cell. ⚠️ IT REPLACED
    // the gold underline that used to ride the vane's lower edge; see the indicator
    // pin in block 2 for the "moved, not duplicated" half of the claim.
    const mark = svg.querySelector('[data-testid="nav-fletch-quill-1"]');
    expect(mark).toBeTruthy();
    expect(mark.getAttribute('d')).toBe(QUILLS[1]);
    // FILLED, not stroked, because a stroke's cap cannot be slant-cut at the lean.
    expect(mark.getAttribute('fill')).toBe(GILT_LIGHT);
    expect(mark.getAttribute('stroke')).toBeNull();
    // ⚠️ AND IT IS THE BRIGHT LEAF, NOT THE HOUSE GOLD. It is drawn inside the barrel's
    // sheen zone, where GOLD manages 2.23:1 against SC 1.4.11's 3:1 and GILT_LIGHT
    // clears it — the finding that unified the gilding and the indicator onto one metal.
    expect(mark.getAttribute('fill')).not.toBe(GOLD);
    expect(ratio(GILT_LIGHT, SHAFT_SHEEN)).toBeGreaterThanOrEqual(3);
    expect(ratio(GOLD, SHAFT_SHEEN)).toBeLessThan(3);
  });

  test('a resting fletch carries none of the channels — the A/B is real', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const resting = feathers(container).find((b) => label(b) === 'Realm');
    const svg = paint(container);

    expect(resting.getAttribute('aria-current')).toBeNull();
    expect(resting.style.color).toBe(rgb(PARCH_100));
    const restingVane = svg.querySelector('[data-testid="nav-fletch-vane-2"]');
    expect(restingVane.dataset.fletchState).toBe('resting');
    // The A/B on the fill itself: the resting cell takes the plain ladder, and the
    // absence is stated positively so "both cells look the same" cannot pass.
    const restFill = restingVane.querySelector('path').getAttribute('fill');
    expect(restFill).not.toContain('-vane-lit');
    expect(restFill).toContain('-vane');
    for (const b of svg.querySelectorAll('[data-testid="nav-fletch-sheen-2"] path')) {
      expect(b.getAttribute('fill')).toBe(FLETCH_SHEEN);
    }
    // Absence is the assertion, and it is non-vacuous because the block above proves
    // the quill line exists when it should.
    expect(svg.querySelector('[data-testid="nav-fletch-quill-2"]')).toBeNull();
    expect(svg.querySelector('[data-testid="nav-fletch-quill-0"]')).toBeNull();
    // …and the retired underline stays retired on the resting cells too, so a
    // half-revert that put it back on one register only would red here.
    expect(svg.querySelectorAll('[data-testid^="nav-fletch-edge-"]').length).toBe(0);
  });

  test('on a plain view NO vane is lit — the band knows "none", not "the first"', () => {
    const { container } = render(<NavRibbon view="compendium" onNavClick={() => {}} />);
    expect(paint(container).dataset.activeLane).toBe('-1');
    expect(paint(container).querySelectorAll('[data-testid^="nav-fletch-quill-"]').length).toBe(0);
    expect(paint(container).querySelectorAll('[data-testid^="nav-fletch-edge-"]').length).toBe(0);
  });

  test('⚠️ WEIGHT IS NOT A STATE CHANNEL — both registers of fletch label are 600', () => {
    // V1's grammar put active at 700 and resting at 500. The BALANCE LAW spends that
    // channel: EVERY fletch label is 600, and the difference between the fletching
    // and the shelf (500) is what the weight now carries. Pinned as an equality
    // between the two states, so half-reverting one of them fails here.
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const active = feathers(container).find((b) => label(b) === 'Library');
    const resting = feathers(container).find((b) => label(b) === 'Realm');
    expect(active.style.fontWeight).toBe('600');
    expect(resting.style.fontWeight).toBe('600');
    expect(plains(container)[0].style.fontWeight).toBe('500');
  });
});

describe('10 — ⚠️⚠️ AA against the LIGHTEST tonal band, and the ratios are QUOTED', () => {
  // The whole hazard of a pale label on a dark feather: it fails at the feather's
  // LIGHT points, not its dark ones. So the governing ground is the lightest tone in
  // the entire goose ladder, and every tone is authored opaque so that ground is a
  // value this file can name rather than a hand-wave.
  const LADDER = {
    FLETCH_TIP, FLETCH_BARB, FLETCH_VANE, FLETCH_LEAD, FLETCH_SHEEN,
    FLETCH_RACHIS, FLETCH_SHEEN_LIFT,
  };

  test('FLETCH_SHEEN_LIFT really IS the lightest band a label can land on', () => {
    // Non-vacuity for every claim below: if some other tone were lighter, measuring
    // against this one would be measuring the wrong thing while staying green.
    const lightest = Object.entries(LADDER)
      .sort((a, b) => relLuminance(b[1]) - relLuminance(a[1]))[0];
    expect(relLuminance(lightest[1])).toBe(relLuminance(FLETCH_SHEEN_LIFT));
  });

  test('every label register clears AA on the lightest band — quoted to 2dp', () => {
    expect(ratio(PARCH_100, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(PARCH, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(PARCH_100, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('6.60');
    expect(ratio(PARCH, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('7.27');
    // …and on every other band too, so the "lightest governs" argument is not the
    // only thing holding the register up.
    for (const [name, tone] of Object.entries(LADDER)) {
      expect(ratio(PARCH_100, tone), `PARCH_100 on ${name}`).toBeGreaterThanOrEqual(4.5);
      expect(ratio(PARCH, tone), `PARCH on ${name}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('the barbs are FINE, not barring — the goose correction, as a number', () => {
    // ⚠️ THE SPECIES PIN. A turkey primary is boldly BARRED; a goose primary is not.
    // If a future edit deepened the barbs back toward V2's turkey texture this reds,
    // with the reason attached. 8% is a comb; V2's was 27% of this vane's luminance,
    // which is a stripe.
    const drop = (relLuminance(FLETCH_VANE) - relLuminance(FLETCH_BARB))
      / relLuminance(FLETCH_VANE) * 100;
    expect(drop).toBeCloseTo(7.96, 1);
    expect(drop).toBeGreaterThan(4);   // a striation you can see
    expect(drop).toBeLessThan(12);     // never a bar
  });

  test('the vane is the boundary that says "fletch"; nothing else has to be', () => {
    // ⚠️⚠️ WHAT TELLS A USER WHERE A FLETCH IS CHANGED IN V4, AND THE TRADE IS RECORDED
    // RATHER THAN QUIETLY KEPT. On the honey barrel it was the DARK VANE against the
    // wood at 4.46:1. The owner's V4 correction puts a dark-ink feather on a dark cedar
    // shaft, so that boundary is 1.73:1 and no retune recovers it — lifting the vane
    // walks it into the label register, lifting the wood walks it into the dead band
    // (theme.js). The claim moves to the three channels that DO carry it, and each is
    // asserted here rather than described.
    expect(ratio(FLETCH_VANE, SHAFT_BODY)).toBeLessThan(3);
    expect(ratio(FLETCH_VANE, SHAFT_BODY).toFixed(2)).toBe('1.73');
    // 1 — THE LABEL. A component whose own name is legible on it is identified by the
    //     strongest means WCAG knows, and the label clears AA on every band.
    expect(ratio(PARCH_100, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(4.5);
    // 2 — THE ACTIVE INDICATOR, AND V4 MOVED IT TO THE QUILL LINE. It is still a state
    //     carrier, so it still owes 1.4.11 on the LIGHTEST ground it can touch — and
    //     that ground changed with the mark. The quill line lies in the top 3px of the
    //     active cell, so its ground is the lit vane's own top stop and any sheen band
    //     crossing it: FLETCH_SHEEN_LIFT is the lightest of those, by the ladder pin
    //     above. GILT_LIGHT clears it with room.
    expect(ratio(GILT_LIGHT, FLETCH_SHEEN_LIFT)).toBeGreaterThanOrEqual(3);
    expect(ratio(GILT_LIGHT, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('4.95');
    // …and on the BARE SHAFT's sheen zone too, which is the number theme.js's GILT
    // ladder quotes and the reason the indicator had to leave the house GOLD family.
    // Kept as a second ground because it is the one that binds if the band ever stops
    // covering its own quill line.
    expect(ratio(GILT_LIGHT, SHAFT_SHEEN)).toBeGreaterThanOrEqual(3);
    expect(ratio(GILT_LIGHT, SHAFT_SHEEN).toFixed(2)).toBe('3.34');
    // ⚠️ NEGATIVE CONTROL, AND IT IS THE WHOLE REASON THERE ARE TWO GOLDS: the house
    // GOLD fails on that same ground, so "just use the brand gold" reds with the number.
    expect(ratio(GOLD, SHAFT_SHEEN)).toBeLessThan(3);
    expect(ratio(GOLD, SHAFT_SHEEN).toFixed(2)).toBe('2.23');
    // ⚠️ AND THE OLD REASON THE SHEEN BANDS STOP SHORT IS NOW FULLY DISCHARGED, which
    // is recorded rather than left as a stale comment. On the V3 ladder the gold ran
    // along the vane's LOWER edge and measured 2.42:1 on a brightened sheen, so
    // SHEEN_FLOOR was LOAD-BEARING for the state claim. V4 moved the mark to the top,
    // where a sheen band cannot reach it at all — SHEEN_FLOOR is 72% of the vane's
    // depth and the indicator ends inside the first 3px — so the geometry survives as
    // FEATHER ANATOMY alone. The margin is quoted rather than the necessity re-asserted.
    expect(SHEEN_PEEK + QUILL_H).toBeLessThan(SHEEN_FLOOR);
    expect(ratio(GOLD, FLETCH_VANE).toFixed(2)).toBe('5.74');
    // 3 — THE HANG. The lower half of every vane sits on the parchment PAGE, where the
    //     same silhouette is unmissable.
    expect(ratio(FLETCH_VANE, PARCH)).toBeGreaterThanOrEqual(4.5);
  });

  test('⚠️⚠️ THE PLAIN REGISTER FLIPPED TO PARCHMENT, with its negative controls', () => {
    // THE SHELF JOINS THE JOURNEY. On the honey barrel these labels were INK and their
    // underline was GOLD_TXT. On cedar the ink register does not exist at any tone, so
    // the reference tabs take the same parchment register the fletch labels have had
    // since V1, and the underline takes GILT — the same metal as the wordmark's leaf
    // and the quill-line indicator, rather than a fourth gold.
    const { container } = render(<NavRibbon view="compendium" onNavClick={() => {}} />);
    const active = plains(container).find((b) => label(b) === 'Compendium');
    const resting = plains(container).find((b) => label(b) === 'Gallery');
    expect(active.style.color).toBe(rgb(PARCH));
    expect(resting.style.color).toBe(rgb(PARCH_100));
    expect(active.style.borderBottom).toBe(`2px solid ${rgb(GILT)}`);
    // ⚠️ NEGATIVE CONTROLS — every tone this replaced, pinned as a failure so "just put
    // the old colour back" reds with the reason attached. All three were CORRECT on the
    // honey barrel; this is a list of tones whose ground moved, not of mistakes.
    expect(ratio(INK_DEEP, SHAFT_BODY)).toBeLessThan(4.5);
    expect(ratio(INK_DEEP, SHAFT_BODY).toFixed(2)).toBe('1.97');   // was 7.06 on honey
    expect(ratio(BODY, SHAFT_BODY).toFixed(2)).toBe('1.36');       // was 4.89 on honey
    expect(ratio(GOLD_TXT, SHAFT_BODY)).toBeLessThan(3);           // fails even as a boundary
    expect(ratio(GOLD_TXT, SHAFT_BODY).toFixed(2)).toBe('1.06');   // was 3.38 on honey
    // …and the replacements really are better, or the swap bought nothing. (Quoted
    // against SHAFT_BODY here, which is the token every version of this pin has used;
    // the per-rider PALE floors live in tests/design/compositedBarAA.test.js.)
    expect(ratio(PARCH_100, SHAFT_BODY)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(GILT, SHAFT_BODY)).toBeGreaterThanOrEqual(3);
    expect(ratio(GILT, SHAFT_BODY).toFixed(2)).toBe('3.79');
  });
});

describe('11 — the mobile bottom nav is untouched by the directive', () => {
  beforeEach(() => { H.isMobile = true; });

  test('a phone renders its bar with no band, no wrap and no vane', () => {
    const { container } = render(<App />);
    // Presence control: the mobile bar really did render (else every absence below
    // would be vacuous).
    const labels = [...container.querySelectorAll('button')]
      .map(label)
      .filter((t) => ['Create', 'Library', 'Gallery', 'Compendium', 'About'].includes(t));
    expect(labels).toEqual(['Create', 'Library', 'Gallery', 'Compendium', 'About']);

    expect(container.querySelectorAll('[data-testid="nav-fletch-band"]').length).toBe(0);
    expect(container.querySelectorAll('[data-testid^="nav-fletch-"]').length).toBe(0);
    expect(container.querySelectorAll('[data-testid^="nav-shaft-wrap-"]').length).toBe(0);
    expect(container.querySelectorAll('[data-nav-cell="feather"]').length).toBe(0);
  });

  test('…but the mobile HEADER is the same barrel — one arrow, both breakpoints', () => {
    // The shaft is not a desktop decoration: the directive says the arrow runs the
    // full width of the top edge, and the phone has a top edge too.
    const { container } = render(<App />);
    const header = container.querySelector('header');
    expect(header.style.backgroundColor).toBe(rgb(SHAFT));
    expect(header.style.backgroundImage).toContain('data:image/svg+xml');
  });
});
