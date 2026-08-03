/**
 * NavRibbon.jsx — the desktop header's primary destination ribbon.
 *
 * THE FLETCHED RIBBON (owner directive, 2026-08-03; lane FL). The bar reads as
 * the back half of an arrow in mid-flight. Create · Library · Realm are the
 * FLETCHING: one continuous leather-brown band carrying three feathers whose
 * parallel edges lean FORWARD, toward Realm — the direction the work flows. The
 * reference tabs beyond it (Compendium · Gallery · About) stay plain on purpose:
 * the hierarchy between "the journey" and "the shelf" IS the point, and it is
 * carried by the band, not by shouting three louder buttons.
 *
 * THE BAND'S MEMBERSHIP IS DERIVED, NOT LISTED. `fletchedRuns` groups NAV by the
 * flow predicate NavFlowArrow owns (routes.js NAV_FLOW): a cell is fletched when
 * it feeds, or is fed by, its rendered neighbour. The band is therefore the
 * maximal declared run, and a future nav insertion or reorder re-files the band
 * automatically instead of leaving a hardcoded trio pointing at the wrong tabs.
 * The same derivation already answers the seam marks (NavDivider.dividerKind), so
 * the band and its internal strokes cannot disagree about where the flow is.
 *
 * ⚠️ THE OVERHANG IS PAINT, NEVER LAYOUT. The band's brown extends
 * FLETCH.overhang px BELOW the ribbon's bottom edge, and it does so as a
 * `drop-shadow` of the paint layer's own clipped silhouette — a filter, which
 * paints outside the border box without being in flow, taking no height, no
 * margin, no border and no negative offset. The paint layer is additionally
 * `position: absolute` with all four insets at 0, so it contributes nothing to
 * any box even before the filter is considered. This is load-bearing: the header
 * is sticky and theme.js derives ANCHOR_OFFSET (84) from CHROME.headerDesktop
 * (60), so every About / guide / Compendium in-page anchor lands on a number the
 * ribbon must not move. tests/components/navFletching.test.jsx pins both halves —
 * the derivation chain, and the absence of any box that spends the overhang.
 * There is no TOP overhang: the header is sticky at top:0 and it would clip.
 *
 * ⚠️ MEASURED, NOT ASSUMED — AND CHROME.headerDesktop IS *NOT* THE LIVE HEIGHT.
 * At 1440×900 the desktop header measures **124px** (its right cluster is 100px
 * tall, set by the Sign In chip), not 60, and it did so BEFORE this refit: a
 * detached worktree at base 83b18609 served side by side reported header 124 /
 * nav 100 / main top 124, and the fletched tree reports header 124 / nav 100 —
 * identical. So the overhang cost ZERO layout height, which is the claim that
 * matters; but do not read CHROME.headerDesktop as a measurement of this header.
 * That constant is ~40px short of the real sticky bar and ANCHOR_OFFSET inherits
 * the shortfall — a PRE-EXISTING estate-wide divergence, reported by lane FL-2,
 * owned by nobody yet, and deliberately NOT changed here (moving ANCHOR_OFFSET
 * relocates every anchor landing in the estate, which is not a nav lane's call).
 *
 * ⚠️ THE CLIP NEVER TOUCHES A FOCUSABLE ELEMENT. `clip-path` clips an element's
 * whole rendering INCLUDING its outline, and a11y.css draws the global focus ring
 * as `outline: 3px` at `outline-offset: 2px` — entirely outside the border box,
 * so clipping the <button> would silently swallow the keyboard focus ring. The
 * feather shape is therefore painted by an aria-hidden VANE layer inside each
 * button; the button itself is never clipped and its ring renders whole. No
 * ancestor may introduce `overflow: hidden` or a clip-path either; the pin
 * asserts that too.
 *
 * ACTIVE STATE. The old affordance was a gold underline at label height; it is
 * translated, not replaced. The active feather lifts to FLETCH_BROWN_LIFT,
 * brightens its label to PARCH at weight 700, and keeps a 2px GOLD bottom edge —
 * now clipped to the vane, so the gold follows the feather's own bottom between
 * the slants instead of drawing a rectangle across it. Four channels, none of
 * them colour alone, plus aria-current="page". The plain reference tabs keep the
 * original underline register unchanged.
 *
 * THE FLOW MARK MOVED, IT DID NOT DIE. NavFlowArrow no longer renders here; it
 * still draws on the MOBILE bottom nav, where cells have no seam to carry a
 * divider. Both surfaces stay pinned: tests/components/navFlowArrows.test.jsx
 * keeps the mobile arm as its live half, tests/components/navDividers.test.jsx
 * censuses this one.
 *
 * STRETCH CHAIN. `alignSelf: stretch` here (and on the header cluster that holds
 * it) is what lets the band and the dividers span the bar top-to-bottom;
 * `alignItems: center` keeps the PLAIN cells at their natural height so their
 * gold underline stays exactly where it has always sat, while the band's own
 * `alignItems: stretch` fills the feathers to bar height — which is what makes it
 * read as one band rather than three chips.
 */
import { Fragment } from 'react';
import { NAV } from '../../lib/routes.js';
import NavDivider, { dividerKind } from './NavDivider.jsx';
import { flowsInto } from './NavFlowArrow.jsx';
import {
  GOLD, PARCH, PARCH_100, SP, FS, sans, FLETCH, FLETCH_BROWN, FLETCH_BROWN_LIFT,
} from '../theme.js';

/**
 * The feather silhouette: a parallelogram whose left and right edges both lean
 * FORWARD — the top of each edge sits `FLETCH.slant` px AHEAD of its bottom, so
 * the whole vane rakes toward Realm. Expressed in px (not %) precisely so the
 * band, the three feathers and the angled seam strokes all lean at the same
 * angle despite their very different widths.
 */
const FEATHER_CLIP =
  `polygon(${FLETCH.slant}px 0, 100% 0, calc(100% - ${FLETCH.slant}px) 100%, 0 100%)`;

/**
 * Group NAV into consecutive runs, marking each run fletched or plain. A cell is
 * fletched when the declared flow enters or leaves it AT ITS RENDERED NEIGHBOUR —
 * the same adjacency guard the flow mark uses, so a surface that renders the
 * trio out of order grows no band it has not earned.
 * @returns {{ fletched: boolean, items: ReadonlyArray<{id: string, label: string}> }[]}
 */
function fletchedRuns() {
  const fletched = NAV.map((n, i) =>
    flowsInto(n.id, NAV[i + 1]?.id) || flowsInto(NAV[i - 1]?.id, n.id));
  const runs = [];
  NAV.forEach((item, i) => {
    const last = runs[runs.length - 1];
    if (last && last.fletched === fletched[i]) last.items.push(item);
    else runs.push({ fletched: fletched[i], items: [item] });
  });
  return runs;
}

/** Everything both cell registers share: metrics, type, and the settle. */
const CELL_BASE = {
  display: 'flex', alignItems: 'center', gap: SP.xs,
  padding: `${SP.sm}px ${SP.lg}px`,
  background: 'transparent',
  border: 'none', borderRadius: 0, cursor: 'pointer',
  fontSize: FS.sm, fontFamily: sans,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  transition: 'all 0.2s',
};

export default function NavRibbon({ view, onNavClick }) {
  /** One nav cell — a feather inside the band, or a plain reference tab. */
  const cell = ({ id, label }, fletchedCell) => {
    const active = view === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onNavClick(id)}
        aria-current={active ? 'page' : undefined}
        data-nav-cell={fletchedCell ? 'feather' : 'plain'}
        style={{
          ...CELL_BASE,
          // `relative` is the vane's positioning context; z-index lifts the whole
          // cell above the band's paint layer.
          position: 'relative', zIndex: 1,
          ...(fletchedCell
            ? { alignSelf: 'stretch', color: active ? PARCH : PARCH_100 }
            : {
              // The plain register, unchanged: a gold underline at label height,
              // never a filled cartouche, so the Sign In chip stays the region's
              // single filled-gold focal point.
              borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
              color: active ? GOLD : PARCH_100,
            }),
          fontWeight: active ? 700 : 500,
        }}
      >
        {fletchedCell && (
          // THE VANE — the clipped layer. It carries the feather's shape, its
          // active lift and its gold edge; the button above it is never clipped,
          // so the focus ring survives (see the header note).
          <span
            aria-hidden="true"
            data-testid={`nav-feather-${id}`}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
              background: active ? FLETCH_BROWN_LIFT : 'transparent',
              borderBottom: active ? `2px solid ${GOLD}` : undefined,
              clipPath: FEATHER_CLIP,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      </button>
    );
  };

  /** A run's cells with the derived seam mark between each adjacent pair. */
  const withSeams = (items, fletchedRun) => items.map((item, i) => {
    const next = items[i + 1];
    return (
      <Fragment key={item.id}>
        {cell(item, fletchedRun)}
        {next && <NavDivider kind={dividerKind(item.id, next.id)} from={item.id} to={next.id} />}
      </Fragment>
    );
  });

  const runs = fletchedRuns();
  return (
    // gap:0 — the divider IS the seam (see NavDivider's width/clearance note).
    <nav style={{ display: 'flex', gap: 0, alignItems: 'center', alignSelf: 'stretch' }}>
      {runs.map((run, ri) => {
        const tail = run.items[run.items.length - 1];
        const nextHead = runs[ri + 1]?.items[0];
        const body = withSeams(run.items, run.fletched);
        return (
          <Fragment key={run.items[0].id}>
            {run.fletched ? (
              <span
                data-testid="nav-fletch-band"
                style={{
                  position: 'relative', display: 'flex', gap: 0,
                  // stretch on BOTH axes of the chain: the band fills the bar,
                  // and its feathers fill the band.
                  alignItems: 'stretch', alignSelf: 'stretch',
                }}
              >
                <span
                  aria-hidden="true"
                  data-testid="nav-fletch-paint"
                  style={{
                    // All four insets 0 — the paint layer is exactly the band's
                    // box and NOTHING larger. The overhang below is the filter's
                    // work, not this box's (see the header's OVERHANG note).
                    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
                    background: FLETCH_BROWN,
                    clipPath: FEATHER_CLIP,
                    filter: `drop-shadow(0 ${FLETCH.overhang}px 0 ${FLETCH_BROWN})`,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />
                {body}
              </span>
            ) : body}
            {nextHead && (
              <NavDivider kind={dividerKind(tail.id, nextHead.id)} from={tail.id} to={nextHead.id} />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
