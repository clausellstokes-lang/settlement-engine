/**
 * @vitest-environment jsdom
 *
 * tests/components/arrowPaint.test.jsx: THE PAINT ENGINE'S RENDER CONTRACT.
 *
 * The owner's orders (2026-09-16): the header is a cut of the owner's own arrow painting,
 * not an emulation. components/nav/ArrowPaint.jsx places the shipped strip and filler tile
 * where components/nav/arrowGeometry.js says; components/nav/useChromeWidth.js supplies the
 * page width. jsdom has no layout engine, so these are CONTRACTS (the seams themselves are
 * measured in a browser):
 *   (a) PAINT ORDER, the seam law: every filler is painted before every segment, fillers
 *       carry no mask (they are opaque), and only segments fade, at their inner ends only;
 *   (b) each segment is a clipped window on the one strip, offset by its first column;
 *   (a2) TONE: each filler takes its slot's brightness, and the compact slot's second tone is an
 *       opaque copy of the same tile fading in over it (never a fade over the page);
 *   (c) band and hang are two clips of one row that OVERLAP inside the opaque shaft: the band
 *       stops at SEAM_BAND_TO and the hang starts at SEAM_HANG_FROM, both at one page position;
 *       the hang's mask leaves out the feather, which is its own part (FEATHER_X1 wide, from
 *       FEATHER_FROM, fading in across the rows it shares with the hang);
 *   (d) decoration only: aria-hidden, alt="", not draggable, no pointer events, one
 *       high-priority fetch; and the kill list's patterns are absent from the source (with
 *       a CONTROL showing the scan fires);
 *   (e) the width store: clientWidth first, innerWidth fallback, a stable snapshot, one
 *       ResizeObserver on the document element that re-renders on change and disconnects
 *       with its last reader, the resize fallback, and the short-viewport flag.
 */
import React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import ArrowPaint, { hangMask, segmentMask } from '../../src/components/nav/ArrowPaint.jsx';
import useChromeWidth, { readChromeWidth } from '../../src/components/nav/useChromeWidth.js';
import {
  ARROW_FILLER_SRC, ARROW_STRIP_SRC, BAND_H, CUTS, FE, FEATHER_FROM, FEATHER_RAMP, FEATHER_X1,
  SEAM_BAND_TO, SEAM_HANG_FROM, SHORT_QUERY, SLOT_TONE, layoutArrow,
} from '../../src/components/nav/arrowGeometry.js';
import { INK } from '../../src/components/theme.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** Render a layout part into a detached container and return its painted children in DOM order. */
function paint(layout, part) {
  const { container } = render(<ArrowPaint layout={layout} part={part} />);
  const wrapper = container.firstElementChild;
  const row = wrapper.firstElementChild;
  return { wrapper, row, children: [...row.children] };
}

describe('(a) paint order: opaque fillers first, only segments fade', () => {
  test('at 1920 px every filler precedes every segment, and the counts follow the cut table', () => {
    const layout = layoutArrow({ clientWidth: 1920, full: true });
    const { children } = paint(layout, 'band');
    const kinds = children.map((el) => (el.hasAttribute('data-sf-arrow-filler') ? 'filler' : 'segment'));
    expect(kinds).toEqual([...Array(CUTS.length).fill('filler'), ...Array(CUTS.length + 1).fill('segment')]);
  });

  test('segments fade at their inner ends only; fillers carry no mask at all', () => {
    const layout = layoutArrow({ clientWidth: 1920, full: true });
    const html = renderToStaticMarkup(<ArrowPaint layout={layout} part="band" />);
    const fe = FE * layout.s;
    const first = `linear-gradient(90deg, ${INK} 0px, ${INK} calc(100% - ${fe}px), transparent 100%)`;
    const middle = `linear-gradient(90deg, transparent 0px, ${INK} ${fe}px, ${INK} calc(100% - ${fe}px), transparent 100%)`;
    const last = `linear-gradient(90deg, transparent 0px, ${INK} ${fe}px, ${INK} 100%)`;
    expect(segmentMask(0, fe)).toBe(first);
    expect(segmentMask(fe, fe)).toBe(middle);
    expect(segmentMask(fe, 0)).toBe(last);
    expect(segmentMask(0, 0)).toBeUndefined();
    const masks = [...html.matchAll(/(?<!-webkit-)mask-image:([^;"]+)/g)].map((m) => m[1]);
    expect(masks).toEqual([first, ...Array(CUTS.length - 1).fill(middle), last]);
    expect([...html.matchAll(/-webkit-mask-image:/g)]).toHaveLength(CUTS.length + 1);
    // Every mask sits on a segment: the filler elements' own style strings carry none.
    const fillerStyles = [...html.matchAll(/<div data-sf-arrow-filler="" style="([^"]*)"/g)].map((m) => m[1]);
    expect(fillerStyles).toHaveLength(CUTS.length);
    expect(fillerStyles.filter((style) => style.includes('mask'))).toEqual([]);
  });

  test('each filler tiles the painting\'s wood across its slot plus both crossfades', () => {
    const layout = layoutArrow({ clientWidth: 1920, full: true });
    const { children } = paint(layout, 'band');
    const fillers = children.filter((el) => el.hasAttribute('data-sf-arrow-filler'));
    expect(fillers.map((el) => el.style.left)).toEqual(layout.fillers.map((f) => `${f.x}px`));
    expect(fillers.map((el) => el.style.width)).toEqual(layout.fillers.map((f) => `${f.w}px`));
    expect(fillers[1].style.backgroundImage).toBe(`url("${ARROW_FILLER_SRC}")`);
    expect(fillers[1].style.backgroundRepeat).toBe('repeat-x');
    expect(fillers[1].style.backgroundSize).toBe(`${layout.fillerPx.w}px ${layout.fillerPx.h}px`);
    expect(fillers[1].style.backgroundPosition).toBe(`${-layout.fillers[1].phase}px 0px`);
  });

  test('the uncut arrow is one unmasked image, and the compact arrow is two crops around one filler', () => {
    const uncut = paint(layoutArrow({ clientWidth: 1280, full: true }), 'band');
    expect(uncut.children).toHaveLength(1);
    expect(renderToStaticMarkup(<ArrowPaint layout={layoutArrow({ clientWidth: 1280, full: true })} />).includes('mask-image')).toBe(false);
    cleanup();
    const compact = paint(layoutArrow({ clientWidth: 390, full: false }), 'band');
    expect(compact.children.map((el) => (el.hasAttribute('data-sf-arrow-filler') ? 'filler' : 'segment'))).toEqual(['filler', 'segment', 'segment']);
  });
});

describe('(a2) tone: the wood inserted matches the wood beside it', () => {
  test('every full-arrow filler carries its cut\'s brightness, and no second layer', () => {
    const layout = layoutArrow({ clientWidth: 2560, full: true });
    const { children } = paint(layout, 'band');
    const fillers = children.filter((el) => el.hasAttribute('data-sf-arrow-filler'));
    expect(fillers.map((el) => el.style.filter)).toEqual(CUTS.map((c) => `brightness(${SLOT_TONE[c.x]})`));
    expect(fillers.every((el) => el.children.length === 0)).toBe(true);
  });

  test('the compact slot: its tile at the left tone, and an opaque copy at the right tone fading in across the slot', () => {
    const layout = layoutArrow({ clientWidth: 800, full: false });
    const { children } = paint(layout, 'band');
    const [filler] = children.filter((el) => el.hasAttribute('data-sf-arrow-filler'));
    const kL = SLOT_TONE[558];
    const kR = SLOT_TONE[1596];
    expect(filler.style.filter).toBe(`brightness(${kL})`);
    const copy = filler.querySelector('[data-sf-arrow-filler-tone]');
    expect(copy).not.toBeNull();
    // Its own filter composes with the filler's, so the right end lands on kR.
    expect(copy.style.filter).toBe(`brightness(${kR / kL})`);
    expect([copy.style.left, copy.style.top, copy.style.width, copy.style.height]).toEqual(['0px', '0px', '100%', '100%']);
    for (const prop of ['backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition']) {
      expect(copy.style[prop], prop).toBe(filler.style[prop]);
    }
    const html = renderToStaticMarkup(<ArrowPaint layout={layout} part="band" />);
    const ext = FE * layout.s;
    expect(html).toContain(`mask-image:linear-gradient(90deg, transparent ${ext}px, ${INK} ${layout.fillers[0].w - ext}px)`);
  });
});

describe('(b) a segment is a clipped window on the one strip', () => {
  test('its image is the strip at scale, offset by the segment\'s first column', () => {
    const layout = layoutArrow({ clientWidth: 2200, full: true });
    const { children } = paint(layout, 'band');
    const segments = children.filter((el) => el.hasAttribute('data-sf-arrow-segment'));
    expect(segments).toHaveLength(layout.segments.length);
    segments.forEach((el, i) => {
      const seg = layout.segments[i];
      const img = el.querySelector('img');
      expect([el.style.left, el.style.width, el.style.overflow]).toEqual([`${seg.x}px`, `${seg.w}px`, 'hidden']);
      expect(img.getAttribute('src')).toBe(ARROW_STRIP_SRC);
      expect([img.style.left, img.style.width, img.style.height, img.style.maxWidth]).toEqual([
        `${-seg.from * layout.s}px`, `${layout.stripPx.w}px`, `${layout.stripPx.h}px`, 'none',
      ]);
      expect([img.getAttribute('width'), img.getAttribute('height')]).toEqual(['2133', '182']);
    });
  });
});

describe('(c) band and hang are two clips of one row, overlapping inside the opaque shaft', () => {
  test('the band clips at SEAM_BAND_TO; the hang starts at SEAM_HANG_FROM, above the band\'s bottom, and runs to the feather\'s end', () => {
    const layout = layoutArrow({ clientWidth: 1440, full: true });
    const { s } = layout;
    const band = paint(layout, 'band');
    expect([band.wrapper.style.top, band.wrapper.style.height, band.row.style.top]).toEqual(['0px', `${SEAM_BAND_TO * s}px`, '0px']);
    cleanup();
    const hang = paint(layout, 'hang');
    // The hang layer's own top is the header's bottom (bandPx), so its clip starts above it by
    // (bandPx - SEAM_HANG_FROM * s) and its row sits at the same page position as the band's.
    const wrapperTop = SEAM_HANG_FROM * s - layout.bandPx;
    expect([hang.wrapper.style.top, hang.wrapper.style.height, hang.row.style.top]).toEqual([
      `${wrapperTop}px`, `${layout.bandPx + layout.hangPx - SEAM_HANG_FROM * s}px`, `${-SEAM_HANG_FROM * s}px`,
    ]);
    expect(layout.bandPx + wrapperTop + -SEAM_HANG_FROM * s, 'the hang row lands at the page position of the band row').toBeCloseTo(0, 9);
    expect(SEAM_HANG_FROM * s, 'the overlap: the hang starts before the band stops').toBeLessThan(SEAM_BAND_TO * s);
    expect(hang.wrapper.getAttribute('data-sf-arrow-paint')).toBe('hang');
    expect(hang.children).toHaveLength(band.children.length);
  });

  test('the hang\'s mask draws the rows above the band\'s bottom everywhere and every row from the feather\'s edge rightward', () => {
    const layout = layoutArrow({ clientWidth: 1440, full: true });
    const { s } = layout;
    const mask = hangMask(s, FEATHER_X1 * s);
    const solid = `linear-gradient(${INK}, ${INK})`;
    expect(mask).toEqual({
      WebkitMaskImage: `${solid}, ${solid}`, maskImage: `${solid}, ${solid}`,
      WebkitMaskSize: `100% ${(BAND_H - SEAM_HANG_FROM) * s}px, 100% 100%`, maskSize: `100% ${(BAND_H - SEAM_HANG_FROM) * s}px, 100% 100%`,
      WebkitMaskPosition: `0px 0px, ${FEATHER_X1 * s}px 0px`, maskPosition: `0px 0px, ${FEATHER_X1 * s}px 0px`,
      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
    });
    const html = renderToStaticMarkup(<ArrowPaint layout={layout} part="hang" />);
    expect(html).toMatch(new RegExp(`data-sf-arrow-paint="hang" style="[^"]*mask-position:0px 0px, ${FEATHER_X1 * s}px 0px`));
    // The band carries no such mask (its segments' own masks are the anchor that it is masked HTML).
    expectAbsentWithAnchor(renderToStaticMarkup(<ArrowPaint layout={layout} part="band" />), 'mask-position', 'mask-image');
  });

  test('the feather is its own part: FEATHER_X1 wide, from FEATHER_FROM down, the first segment alone, fading in over the shared rows', () => {
    for (const [cw, full] of [[1920, true], [390, false]]) {
      const layout = layoutArrow({ clientWidth: cw, full });
      const { s } = layout;
      const feather = paint(layout, 'feather');
      expect(feather.wrapper.getAttribute('data-sf-arrow-paint')).toBe('feather');
      expect([feather.wrapper.style.top, feather.wrapper.style.width, feather.wrapper.style.height, feather.wrapper.style.overflow]).toEqual([
        `${FEATHER_FROM * s - layout.bandPx}px`, `${FEATHER_X1 * s}px`, `${layout.bandPx + layout.hangPx - FEATHER_FROM * s}px`, 'hidden',
      ]);
      expect(feather.row.style.top).toBe(`${-FEATHER_FROM * s}px`);
      expect(feather.children.map((el) => (el.hasAttribute('data-sf-arrow-segment') ? 'segment' : 'filler'))).toEqual(['segment']);
      expect(feather.children[0].querySelector('img').getAttribute('fetchpriority')).toBeNull();
      const html = renderToStaticMarkup(<ArrowPaint layout={layout} part="feather" />);
      expect(html).toContain(`data-sf-arrow-paint="feather" style="`);
      // It fades in across its first FEATHER_RAMP rows and is whole where the hang's mask ends.
      expect(html).toContain(`mask-image:linear-gradient(transparent 0px, ${INK} ${FEATHER_RAMP * s}px)`);
      expect(FEATHER_FROM + FEATHER_RAMP).toBeLessThan(BAND_H);
      cleanup();
    }
  });
});

describe('(d) decoration only, and inside the kill list', () => {
  test('aria-hidden, no pointer events, alt="" and not draggable; one high-priority fetch, on the band', () => {
    const layout = layoutArrow({ clientWidth: 1920, full: true });
    const band = paint(layout, 'band');
    expect([band.wrapper.getAttribute('aria-hidden'), band.wrapper.style.pointerEvents, band.wrapper.style.overflow]).toEqual(['true', 'none', 'hidden']);
    const imgs = [...band.wrapper.querySelectorAll('img')];
    expect(imgs).toHaveLength(CUTS.length + 1);
    expect(imgs.map((img) => [img.getAttribute('alt'), img.getAttribute('draggable')])).toEqual(Array(imgs.length).fill(['', 'false']));
    expect(imgs.map((img) => img.getAttribute('fetchpriority'))).toEqual(['high', ...Array(CUTS.length).fill(null)]);
    cleanup();
    const hang = paint(layout, 'hang');
    expect([...hang.wrapper.querySelectorAll('img')].map((img) => img.getAttribute('fetchpriority'))).toEqual(Array(CUTS.length + 1).fill(null));
  });

  test('the source carries no shadow, rounding, translucent literal, *_BG tint or raised z-index', () => {
    const KILL = /boxShadow|rgba\(|borderRadius|[A-Z]+_BG\b|zIndex/g;
    const source = readFileSync(join(process.cwd(), 'src/components/nav/ArrowPaint.jsx'), 'utf8');
    expect(source.includes('WebkitMaskImage')).toBe(true); // the scan reads the real file
    expect(source.match(KILL)).toBeNull();
    // CONTROL: the same pattern convicts each forbidden spelling.
    const forged = "boxShadow: ELEV[1], background: 'rgba(0,0,0,.2)', borderRadius: 4, GOLD_BG, zIndex: 60";
    expect(forged.match(KILL)).toEqual(['boxShadow', 'rgba(', 'borderRadius', 'GOLD_BG', 'zIndex']);
  });
});

describe('(e) the width store', () => {
  /** Give the document element a clientWidth (jsdom reports 0). */
  const setClientWidth = (w) => {
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, get: () => w });
  };
  afterEach(() => {
    delete document.documentElement.clientWidth;
  });

  function Probe() {
    const { clientWidth, short } = useChromeWidth();
    return <output data-testid="w">{`${clientWidth}|${short}`}</output>;
  }

  test('reads clientWidth, falls back to innerWidth when it is 0, and keeps one snapshot while nothing changes', () => {
    setClientWidth(0);
    expect(readChromeWidth().clientWidth).toBe(window.innerWidth);
    setClientWidth(1263);
    const a = readChromeWidth();
    expect(a).toEqual({ clientWidth: 1263, short: false });
    expect(readChromeWidth()).toBe(a);
  });

  test('one ResizeObserver on the document element re-renders on a width change and disconnects with its last reader', () => {
    const observers = [];
    vi.stubGlobal('ResizeObserver', class {
      constructor(cb) { this.cb = cb; this.targets = []; this.disconnected = false; observers.push(this); }
      observe(el) { this.targets.push(el); }
      disconnect() { this.disconnected = true; }
    });
    setClientWidth(1440);
    const view = render(<><Probe /><Probe /></>);
    expect(observers).toHaveLength(1);
    expect(observers[0].targets).toEqual([document.documentElement]);
    expect(view.container.textContent).toBe('1440|false1440|false');
    setClientWidth(1425); // a scrollbar appeared
    act(() => { observers[0].cb([]); });
    expect(view.container.textContent).toBe('1425|false1425|false');
    view.unmount();
    expect(observers[0].disconnected).toBe(true);
  });

  test('without a ResizeObserver, a window resize updates the width', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    setClientWidth(800);
    const view = render(<Probe />);
    expect(view.container.textContent).toBe('800|false');
    setClientWidth(700);
    act(() => { window.dispatchEvent(new Event('resize')); });
    expect(view.container.textContent).toBe('700|false');
  });

  test('the short flag follows the landscape-phone query', () => {
    const listeners = [];
    const mql = { matches: false, media: SHORT_QUERY, addEventListener: (_t, fn) => listeners.push(fn), removeEventListener: () => {} };
    const matchMedia = vi.fn(() => mql);
    vi.stubGlobal('matchMedia', matchMedia);
    vi.stubGlobal('ResizeObserver', undefined);
    setClientWidth(844);
    const view = render(<Probe />);
    expect(matchMedia).toHaveBeenCalledWith(SHORT_QUERY);
    expect(view.container.textContent).toBe('844|false');
    mql.matches = true;
    act(() => { listeners.forEach((fn) => fn()); });
    expect(view.container.textContent).toBe('844|true');
  });
});
