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
  FLETCH_VANE, GOLD, GOLD_TXT, INK_DEEP, LABEL_BOX, PARCH, PARCH_100, SHAFT,
  SHAFT_BODY, SHAFT_CYLINDER, SHAFT_EDGE, SHAFT_GRAIN_LAYERS, SHAFT_GRAIN_TEXTURE,
  SHAFT_RIM, SHAFT_SHEEN, SHAFT_STOPS, SP, WRAP,
} from '../../src/components/theme.js';
import {
  BAND, BAND_W, LANE, REACH, SHEENS, SHEEN_FLOOR, VANES, barbBuckets, unitHash,
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

describe('2 — ⚠️⚠️ THE SHINGLE: each vane really LAPS the next, in one space', () => {
  test('three vanes are drawn, from one geometry, in one coordinate space', () => {
    const { container } = render(<App />);
    const svg = paint(container);
    expect(svg.tagName.toLowerCase()).toBe('svg');
    // One viewBox for the whole cluster: three lanes wide, exactly the bar tall.
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${BAND_W} ${CHROME.headerDesktop}`);
    expect(BAND_W).toBe(LANE * 3);
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none');
    const groups = [...svg.querySelectorAll('[data-testid^="nav-fletch-vane-"]')];
    expect(groups.length).toBe(3);
    // Every vane silhouette the module authored really is painted.
    const drawn = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('d'));
    for (const v of VANES) expect(drawn).toContain(v.closed);
  });

  test('⚠️ EVERY VANE REACHES INTO THE NEXT LANE — the pin V3 did not have', () => {
    // THE FAILURE THIS EXISTS FOR. V3's lap was authored per-cell in a stretched
    // local space and resolved to ~2 screen px against a 10px seam, so the band
    // rendered as three tabs. Here the whole band is one space, so "does Create's
    // vane actually cross into Library's lane?" is a question about numbers this
    // file can read — and the answer must be a substantial fraction of a lane, not
    // a rounding error.
    expect(FLETCH.lap).toBeGreaterThan(0);
    for (const lane of [0, 1]) {
      const pts = ONCURVE(VANES[lane].closed);
      const reach = Math.max(...pts.map((p) => p.x)) - (lane + 1) * LANE;
      expect(reach, `vane ${lane} reaches only ${reach} into lane ${lane + 1}`)
        .toBeGreaterThanOrEqual(FLETCH.lap);
      // …and the lap is a real shingle, not a hairline: at least a fifth of a lane.
      expect(reach / LANE).toBeGreaterThan(0.2);
    }
    // THE LAST VANE LAPS NOTHING — the band resolves at its own end rather than
    // running off under the trail wrap.
    expect(REACH(2)).toBe(0);
    expect(Math.max(...ONCURVE(VANES[2].closed).map((p) => p.x))).toBe(BAND_W);
  });

  test('⚠️ THE PAINT ORDER IS REVERSED, which is what makes the cascade point right', () => {
    // Create's trailing region must lie OVER Library's leading edge, and Library's
    // over Realm's. In SVG that is document order, so the vanes are painted 2, 1, 0
    // and the LAST one in the DOM is lane 0. Painted in reading order the shingle
    // would face the other way and the cascade would point back at Create.
    const { container } = render(<App />);
    const lanes = [...paint(container).querySelectorAll('[data-testid^="nav-fletch-vane-"]')]
      .map((g) => Number(g.dataset.testid.split('-').pop()));
    expect(lanes).toEqual([2, 1, 0]);
  });

  test('the two depth cues are both present on every vane: contact shadow + edge-light', () => {
    // These are the cues that make a lap read as one feather lying on another
    // rather than as two flat shapes sharing a border. Neither is decoration: the
    // shadow says "they touch", the edge-light says "this one is on top".
    const { container } = render(<App />);
    const groups = [...paint(container).querySelectorAll('[data-testid^="nav-fletch-vane-"]')];
    expect(groups.length).toBe(3);
    for (const g of groups) {
      // TWO shadows, tight + soft: one filter can be one or the other, not both,
      // and a single soft shadow between two nearly-tonal feathers is a smudge.
      expect((g.style.filter.match(/drop-shadow/g) || []).length).toBe(2);
      // The edge-light rides OUTSIDE the clip — it is this feather's own lit rim,
      // so half of it must fall on whatever lies behind.
      const rims = [...g.children].filter((c) => c.tagName === 'path'
        && c.getAttribute('stroke') === FLETCH_RACHIS);
      expect(rims.length).toBe(2); // the leading cut and the trailing back
      for (const r of rims) {
        expect(Number(r.getAttribute('stroke-opacity'))).toBeLessThan(1); // a whisper
        expect(Number(r.getAttribute('stroke-opacity'))).toBeGreaterThan(0);
        expect(r.getAttribute('fill')).toBe('none');
      }
    }
  });

  test('⚠️ the silhouette RAKES toward Realm — a fletch, never a shield or a tab', () => {
    // ⚠️⚠️ THE PIN THIS LANE DID NOT HAVE AND NEEDED — THREE TIMES. Earlier cuts drew
    // a symmetric shield, then squared the leading end off at the quill, then ran the
    // trailing end almost straight down. Every structural pin passed each time, and
    // the bar rendered three escutcheons, then three dark tabs, then one dark blob.
    // jsdom cannot see "that looks like a badge"; it CAN see the geometry that makes
    // it one, so the geometry is what is pinned, parsed from the path.
    for (const [lane, v] of VANES.entries()) {
      const pts = ONCURVE(v.closed);
      expect(pts.length).toBeGreaterThanOrEqual(4); // not a vacuous parse

      // 1. THE LEADING END IS A POINT ON THE QUILL, not a corner at depth. This is
      //    the difference between a feather entering a binding and a rectangle.
      const leadTip = pts.reduce((a, p) => (p.x < a.x ? p : a));
      expect(leadTip.x).toBe(lane * LANE - FLETCH.back);
      expect(leadTip.y).toBe(FLETCH.tipIn);
      expect(leadTip.y).toBeLessThan(BAND * 0.1);

      // 2. THE RAKE — deepest at the TRAILING end. That asymmetry IS the sweep
      //    toward Realm, and a shield, being symmetric, cannot have it.
      const deepest = pts.reduce((a, p) => (p.y > a.y ? p : a));
      expect(deepest.y).toBe(BAND);
      expect(deepest.x).toBeGreaterThan(lane * LANE + LANE / 2);

      // 3. BOTH ENDS ARE CUT ALONG THE BARBS, at exactly FLETCH.barbRun of run over
      //    the vane's depth — the same number the comb leans by. That shared angle
      //    is what turns each lap into a long diagonal instead of a vertical crease,
      //    and it is why the cascade reads at all.
      const quillEnd = pts.reduce((a, p) => (p.y <= FLETCH.tipIn && p.x > a.x ? p : a), leadTip);
      expect(deepest.x - quillEnd.x).toBe(FLETCH.barbRun);
    }
  });

  test('every vane still COVERS ITS LABEL — the trap a prettier silhouette invites', () => {
    // A pale label that slipped off its vane would sit on bare honey wood at 1.85:1
    // and be unreadable. Each label is centred in its own equal-width lane, so the
    // claim is: over the middle of every lane, the vane is deeper than the bottom of
    // the label box.
    const labelBottom = (CHROME.headerDesktop + LABEL_BOX) / 2;
    for (const [lane, v] of VANES.entries()) {
      const mid = lane * LANE + LANE / 2;
      // ⚠️ The LOWER silhouette only. The closed path's quill line runs along y=0
      // straight over the label, so asking the whole outline "how deep are you here"
      // answers 0 at every top vertex and the pin would be unsatisfiable.
      const over = ONCURVE(v.lower).filter((p) => p.y > 0 && Math.abs(p.x - mid) < LANE * 0.45);
      expect(over.length, `no lower-edge vertex over lane ${lane}'s label`).toBeGreaterThan(0);
      for (const p of over) {
        expect(p.y, `vane ${lane} is only ${p.y} deep at x=${p.x}`)
          .toBeGreaterThan(labelBottom);
      }
    }
  });

  test('the gold edge traces the LOWER silhouette only — a highlight, not a border', () => {
    // The first cut stroked the whole closed path, so the gold ran up the leading cut
    // and along the quill and read as "this badge is selected". The open lower path is
    // the fix, pinned as a containment relationship rather than a literal so
    // retouching the curve cannot silently re-close it.
    for (const v of VANES) {
      expect(v.lower.trim().endsWith('Z')).toBe(false);
      expect(v.closed).toContain(v.lower.slice(v.lower.indexOf('C ')));
      // …and the leading cut is in the CLOSED path but NOT in the stroked one.
      expect(v.lower).not.toContain(v.lead.slice(v.lead.indexOf('C ')));
    }
  });
});

describe('3 — THE COMB: fine barb striations, at the derived angle, jittered', () => {
  test('the barbs are present, fine, and split across brightness buckets', () => {
    const { container } = render(<App />);
    const svg = paint(container);
    for (const lane of [0, 1, 2]) {
      const paths = [...svg.querySelectorAll(`[data-testid^="nav-fletch-barbs-${lane}-"]`)];
      expect(paths.length, `lane ${lane} has no barbs`).toBe(3);
      const strokes = paths.reduce((n, p) => n + (p.getAttribute('d').match(/M /g) || []).length, 0);
      // Genuinely dense: a "fine parallel striation" is dozens of marks, not four.
      expect(strokes).toBeGreaterThan(30);
      // Every bucket carries some — a bucket that never fills is a jitter that is
      // not jittering.
      for (const p of paths) {
        expect((p.getAttribute('d').match(/M /g) || []).length).toBeGreaterThan(4);
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
    const xs = (barbBuckets(0).join(' ').match(/M (-?[\d.]+) 0/g) || [])
      .map((m) => Number(m.slice(2, -2))).sort((a, b) => a - b);
    const gaps = xs.slice(1).map((x, i) => +(x - xs[i]).toFixed(3));
    expect(new Set(gaps).size).toBeGreaterThan(3); // a wobble, not a ruler
    // …and every gap stays inside the authored jitter envelope, never to zero.
    for (const g of gaps) {
      expect(g).toBeGreaterThan(FLETCH.barbGap * (1 - FLETCH.barbJitter));
      expect(g).toBeLessThan(FLETCH.barbGap * (1 + FLETCH.barbJitter));
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
    expect(FLETCH_BARB_DEG).toBe(28); // today's value — a comb, not a rake
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
    // They BRACKET the cluster: each sits entirely outside its box, which is what
    // makes them bind the fletching rather than decorate it.
    expect(lead.style.right).toBe('100%');
    expect(trail.style.left).toBe('100%');
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
    // The modelling range: a real barrel, and still one piece of wood.
    expect(ratio(SHAFT_SHEEN, SHAFT_RIM)).toBeCloseTo(2.67, 2);
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

  test('⚠️ SHAFT_STOPS.body CLEARS THE LABEL BOX on BOTH header heights', () => {
    // THE PIN THAT MAKES "SHAFT_BODY is the reference ground" A GEOMETRIC CLAIM
    // rather than a hopeful one. Every AA number in this lane is measured against
    // SHAFT_BODY, and that is only honest if the cylinder never goes darker than
    // SHAFT_BODY anywhere a letterform can land. Labels are vertically centred, so
    // the bottom of the label box sits at (1 + LABEL_BOX/height)/2 of the bar — and
    // the stop must be BELOW that on the desktop bar AND the taller mobile one.
    for (const h of [CHROME.headerDesktop, CHROME.headerMobile]) {
      const labelBottom = (1 + LABEL_BOX / h) / 2;
      expect(SHAFT_STOPS.body, `label box is not clear of the falloff on a ${h}px bar`)
        .toBeGreaterThan(labelBottom);
    }
    expect(LABEL_BOX).toBe(20); // today's value, recorded so a reader knows the bar
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
    expect(CHROME.headerDesktop).toBe(48);
    expect(ANCHOR_OFFSET).toBe(72);
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
    // 3 — THE SHEEN BANDS BRIGHTEN. This is the directive's own words for what
    // "active" looks like on a feather, and it is the channel that replaced V2's
    // whole-fill lift.
    const bands = [...svg.querySelectorAll('[data-testid="nav-fletch-sheen-1"] path')];
    expect(bands.length).toBe(3);
    for (const b of bands) expect(b.getAttribute('fill')).toBe(FLETCH_SHEEN_LIFT);
    // 4 — the gold, stroked along the vane's OWN lower silhouette so it follows the
    // rounded back instead of drawing a rectangle across the cell.
    const edge = svg.querySelector('[data-testid="nav-fletch-edge-1"]');
    expect(edge).toBeTruthy();
    expect(edge.getAttribute('d')).toBe(VANES[1].lower);
    expect(edge.getAttribute('stroke')).toBe(GOLD);
    expect(edge.getAttribute('fill')).toBe('none');
    // Authored at double width because the clip halves it: 2px survives inside.
    expect(edge.getAttribute('stroke-width')).toBe('4');
  });

  test('a resting fletch carries none of the channels — the A/B is real', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const resting = feathers(container).find((b) => label(b) === 'Realm');
    const svg = paint(container);

    expect(resting.getAttribute('aria-current')).toBeNull();
    expect(resting.style.color).toBe(rgb(PARCH_100));
    expect(svg.querySelector('[data-testid="nav-fletch-vane-2"]').dataset.fletchState).toBe('resting');
    for (const b of svg.querySelectorAll('[data-testid="nav-fletch-sheen-2"] path')) {
      expect(b.getAttribute('fill')).toBe(FLETCH_SHEEN);
    }
    // Absence is the assertion, and it is non-vacuous because the block above proves
    // the gold edge exists when it should.
    expect(svg.querySelector('[data-testid="nav-fletch-edge-2"]')).toBeNull();
    expect(svg.querySelector('[data-testid="nav-fletch-edge-0"]')).toBeNull();
  });

  test('on a plain view NO vane is lit — the band knows "none", not "the first"', () => {
    const { container } = render(<NavRibbon view="compendium" onNavClick={() => {}} />);
    expect(paint(container).dataset.activeLane).toBe('-1');
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
    expect(ratio(PARCH_100, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('4.84');
    expect(ratio(PARCH, FLETCH_SHEEN_LIFT).toFixed(2)).toBe('5.33');
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
    // What tells a user where a fletch is, is the DARK VANE against the honey wood —
    // comfortably past SC 1.4.11's 3:1. The contact shadows and the edge-light are
    // depth cues inside an already-legible shape and carry no floor of their own.
    expect(ratio(FLETCH_VANE, SHAFT_BODY)).toBeGreaterThanOrEqual(3);
    expect(ratio(FLETCH_VANE, SHAFT_BODY).toFixed(2)).toBe('4.46');
    // The gold edge is a STATE carrier, so it owes the boundary floor on the
    // lightest ground it can touch — which the SHEEN_FLOOR geometry above keeps at
    // the vane gradient rather than at a sheen band.
    expect(ratio(GOLD, FLETCH_VANE)).toBeGreaterThanOrEqual(3);
    expect(ratio(GOLD, FLETCH_VANE).toFixed(2)).toBe('4.12');
    expect(ratio(GOLD, FLETCH_SHEEN_LIFT)).toBeLessThan(3); // why the bands stop short
  });

  test('the plain register is RE-INKED for the honey barrel, with its negative control', () => {
    const { container } = render(<NavRibbon view="compendium" onNavClick={() => {}} />);
    const active = plains(container).find((b) => label(b) === 'Compendium');
    const resting = plains(container).find((b) => label(b) === 'Gallery');
    expect(active.style.color).toBe(rgb(INK_DEEP));
    expect(resting.style.color).toBe(rgb(BODY));
    expect(active.style.borderBottom).toBe(`2px solid ${rgb(GOLD_TXT)}`);
    // The measurements that forced the move, quoted. GOLD_TXT was V2's ACTIVE LABEL
    // at 5.75:1 on cream; on this barrel it is 3.38:1, which fails AA as text and is
    // why it survives only as the UNDERLINE, where 1.4.11's 3:1 is the floor.
    expect(ratio(INK_DEEP, SHAFT_BODY).toFixed(2)).toBe('7.06');
    expect(ratio(BODY, SHAFT_BODY).toFixed(2)).toBe('4.89');
    expect(ratio(GOLD_TXT, SHAFT_BODY).toFixed(2)).toBe('3.38');
    expect(ratio(GOLD_TXT, SHAFT_BODY)).toBeLessThan(4.5);      // FAILS as text
    expect(ratio(GOLD_TXT, SHAFT_BODY)).toBeGreaterThanOrEqual(3); // clears as a boundary
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
