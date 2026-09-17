/**
 * components/nav/ArrowHeader.jsx: THE PAINTED ARROW HEADER.
 *
 * THE OWNER'S ORDERS (2026-09-16): "Replace the arrow ribbon entirely with the following
 * image however appropriate. This is the arrow we were trying and failing to create, so I
 * created it. I do not want you to emulate it. I want some copy/cut/cropped/pasted version
 * of this arrow as the header/ribbon of the entire website." And: "The top of the wooden
 * shaft (not the top feather) is where the page starts, so cut off that top feather."
 *
 * So the header IS the painting: components/nav/ArrowPaint.jsx draws the shipped strip where
 * components/nav/arrowGeometry.js lays it across the page, and this component places the
 * controls over the painted regions. It is mounted once, for every width.
 *
 * TWO COMPOSITIONS, one switch (useIsMobile(1024), the viewport including any scrollbar, so a
 * page that grows a scrollbar never flips the header):
 *   - FULL (1024 px and up): the home control over the nock and logo plate, the six painted
 *     words as the primary nav (NAV order, keyed by id), and the account on the blank plate.
 *   - COMPACT (below): the brand crop, plain wood and the tail crop. The painted words leave
 *     the header; App.jsx's bottom bar carries the destinations there.
 *
 * TWO LAYERS, and why the feather is not inside the header:
 *   - <header> is the shaft band only: sticky at top 0, z 50, height --sf-header-h. It is
 *     transparent (no shadow, no filter or transform, no overflow clip), so the page shows
 *     through the nock notch and around the arrowhead, and no fixed descendant (the account
 *     menu) is trapped in a containing block.
 *   - The feather and the barb hang below it on a ZERO-HEIGHT sticky layer (top
 *     --sf-header-h, z 35, no pointer events, aria-hidden): pinned sub-chrome such as the
 *     dossier toolbar (z 40) and the generation reveal (z 45) paint over the feather, while
 *     page content passes beneath it. The two layers OVERLAP by eight rows inside the
 *     shaft's opaque body (arrowGeometry.js SEAM_HANG_FROM / SEAM_BAND_TO), so no row of page
 *     ground shows between them at any device pixel ratio.
 *
 * THE FEATHER HIDES ON SCROLL (owner, 2026-09-17: "once we start scrolling, the feather in the
 * arrow turns completely transparent, only to reappear fully if they scroll to the very
 * top"). The feather is its own part of the hang layer (ArrowPaint part="feather"): opacity 1
 * while the page is at its very top (arrowGeometry.js featherShown) and 0 anywhere else,
 * with a 120 ms fade that a11y.css's reduced-motion rule collapses to 1 ms. One passive
 * scroll listener feeds a useSyncExternalStore read of scrollY alone, so the header re-renders
 * only when the answer flips, and a page that loads already scrolled renders the right state
 * on its first frame. The arrowhead's barb is not the feather and stays. main's content
 * reserve is unchanged: at the top of the page the feather is there.
 *
 * THE ONE WRITER. The layout effect below is the only place that writes the five painted
 * lengths onto the document element (lib/chromeInsets.js names them), before first paint:
 * main's content reserve, the sticky toolbars and rails, the anchor offset, the Realm shell
 * and the bottom-anchored layers all compose them.
 *
 * CONTROLS (components/nav/ArrowControl.jsx): Button primitives, never raw buttons. The
 * painted word is the visible label and a visually hidden span supplies the same text as the
 * accessible name. aria-current follows `view === id`, as the retired ribbon did. The home
 * control keeps its name, "SettlementForge home", and stays outside the nav. On phones and
 * coarse pointers every control grows to 44 x 44 (downward, into the transparent space under
 * the band, which main's reserve keeps clear of content). The active page is underlined with
 * a PARCH_100 rule under its painted word (8.3:1 or more on those rows of wood), kept in that
 * colour under forced colours (the ground is the painting, which forced colours leave alone).
 * Hover draws a soft glow on the word or plate itself (ArrowControl), on devices that hover.
 *
 * THE FIRST FRAME. The width store is read during the first render, before the app is in the
 * document, so a classic scrollbar that appears once the page is tall is not in that width.
 * The layout effect below re-reads it and, if it moved, re-renders before the browser paints.
 *
 * handleNavClick and every tier comparison stay in App.jsx; this component only calls back.
 *
 * @enforced-by tests/components/arrowHeader.test.jsx
 */
import { useLayoutEffect, useReducer, useSyncExternalStore } from 'react';
import { NAV } from '../../lib/routes.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import AccountMenu from '../AccountMenu.jsx';
import ArrowControl from './ArrowControl.jsx';
import ArrowPaint from './ArrowPaint.jsx';
import useChromeWidth, { readChromeWidth } from './useChromeWidth.js';
import { FULL_MIN_VIEWPORT, featherShown, layoutArrow, padTarget } from './arrowGeometry.js';
import {
  ARROW_BARB_CLEAR_VAR, ARROW_CLEAR_VAR, ARROW_HANG_VAR, ARROW_VARS, BOTTOM_NAV_H_VAR, HEADER_H,
  HEADER_HEIGHT_VAR, PARCH_100,
} from '../theme.js';

/** The touch target floor (Apple HIG / Material; e2e/mobile-pointer-targets.spec.js). */
const TOUCH_TARGET = 44;

/**
 * The bottom bar's height as App.jsx renders it: a 44 px seat plus its 1 px top rule (measured
 * in Chromium at 390 and 800 px wide; e2e/pinned-footer.spec.js holds the landing hero to the
 * bar's top edge at 800). CHROME.bottomNav (57) is the older phone token, 12 px generous; the
 * phone surfaces that read it are left as they were.
 */
const BOTTOM_BAR_PX = 45;

/** @param {number} n */
const px = (n) => `${n}px`;

/** @param {() => void} notify */
const onScroll = (notify) => {
  window.addEventListener('scroll', notify, { passive: true });
  return () => window.removeEventListener('scroll', notify);
};
const readFeather = () => featherShown(window.scrollY);
const serverFeather = () => true;

/**
 * A glow box relative to its control's box.
 * @param {{ x: number, y: number, w: number, h: number }} glow
 * @param {{ x: number, y: number }} box
 */
const within = (glow, box) => ({ ...glow, x: glow.x - box.x, y: glow.y - box.y });

/** Coarse pointers get touch-sized targets at any width. */
function coarsePointer() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches;
}

/**
 * The painted lengths as the CSS values ArrowHeader writes (exported for the pin).
 * @param {{ bandPx: number, hangPx: number, barbHangPx: number, mode: 'full' | 'compact' }} layout
 * @returns {Record<string, string>}
 */
export function arrowVarValues(layout) {
  const top = (n) => `calc(${px(n)} + env(safe-area-inset-top))`;
  return {
    [HEADER_HEIGHT_VAR]: top(layout.bandPx),
    [ARROW_HANG_VAR]: px(layout.hangPx),
    [ARROW_CLEAR_VAR]: top(layout.bandPx + layout.hangPx),
    [ARROW_BARB_CLEAR_VAR]: top(layout.bandPx + layout.barbHangPx),
    [BOTTOM_NAV_H_VAR]: layout.mode === 'full' ? '0px' : `calc(${px(BOTTOM_BAR_PX)} + env(safe-area-inset-bottom))`,
  };
}

/**
 * @param {{
 *   view: string,
 *   onNavClick: (id: string) => void,
 *   onHome: () => void,
 *   account: Record<string, unknown>,
 * }} props
 */
export default function ArrowHeader({ view, onNavClick, onHome, account }) {
  const narrow = useIsMobile(FULL_MIN_VIEWPORT);
  const phone = useIsMobile();
  const { clientWidth, short } = useChromeWidth();
  const layout = layoutArrow({ clientWidth, full: !narrow, short });
  const roomy = phone || coarsePointer();
  /** @param {{ x: number, y: number, w: number, h: number }} r */
  const target = (r) => (roomy ? padTarget(r, TOUCH_TARGET, layout.width) : r);
  const { bandPx, hangPx, barbHangPx, mode } = layout;
  const feather = useSyncExternalStore(onScroll, readFeather, serverFeather);
  const [, reflow] = useReducer((n) => n + 1, 0);

  useLayoutEffect(() => {
    if (readChromeWidth().clientWidth !== clientWidth) reflow();
  }, [clientWidth]);

  useLayoutEffect(() => {
    const root = document.documentElement.style;
    const values = arrowVarValues({ bandPx, hangPx, barbHangPx, mode });
    for (const name of ARROW_VARS) root.setProperty(name, values[name]);
    return () => {
      for (const name of ARROW_VARS) root.removeProperty(name);
    };
  }, [bandPx, hangPx, barbHangPx, mode]);

  const { hits } = layout;
  const home = target(hits.home);
  return (
    <>
      <header
        data-sf-arrow-header={layout.mode}
        style={{
          position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
          height: HEADER_H, boxSizing: 'border-box', paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div style={{ position: 'relative', height: px(layout.bandPx) }}>
          <ArrowPaint layout={layout} part="band" />
          <ArrowControl rect={home} glow={within(hits.glow.home, home)} aria-label="SettlementForge home" onClick={onHome} />
          {mode === 'full' && (
            <nav aria-label="Primary">
              {NAV.map(({ id, label }) => {
                const rect = target(hits.nav[id]);
                const active = view === id;
                const rule = hits.underline[id];
                return (
                  <ArrowControl
                    key={id}
                    rect={rect}
                    glow={within(hits.glow.nav[id], rect)}
                    data-sf-arrow-region={id}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onNavClick(id)}
                  >
                    <span className="sr-only">{label}</span>
                    {active && (
                      <span
                        aria-hidden="true"
                        data-sf-arrow-current=""
                        style={{
                          position: 'absolute', pointerEvents: 'none', background: PARCH_100, forcedColorAdjust: 'none',
                          left: px(rule.x - rect.x), top: px(rule.y - rect.y), width: px(rule.w), height: px(rule.h),
                        }}
                      />
                    )}
                  </ArrowControl>
                );
              })}
            </nav>
          )}
          <AccountMenu {...account} layout={layout} roomy={roomy} />
        </div>
      </header>
      <div
        aria-hidden="true"
        className="sf-arrow-hang"
        style={{ position: 'sticky', top: HEADER_H, zIndex: 35, height: 0, flexShrink: 0, pointerEvents: 'none' }}
      >
        <ArrowPaint layout={layout} part="hang" />
        <ArrowPaint
          layout={layout}
          part="feather"
          style={{ opacity: feather ? 1 : 0, transition: 'opacity 120ms ease-out' }}
        />
      </div>
    </>
  );
}
