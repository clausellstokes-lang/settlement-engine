/**
 * NavRibbon.jsx — the desktop header's primary destination ribbon.
 *
 * THE FLETCHED RIBBON (owner directive, 2026-08-03; lane FL, refined as RIBBON V2
 * the same day). The bar reads as the back half of an arrow in mid-flight. The
 * whole header is now the SHAFT — one continuous plank of light wood running
 * full width, wordmark included (App.jsx paints it; theme.js SHAFT* owns it) — and
 * Create · Library · Realm are the FLETCHING lying on that wood: three DARK-BROWN,
 * GILT-EDGED feathers whose parallel edges lean FORWARD, toward Realm, the
 * direction the work flows. V1 had these polarities the other way round (a brown
 * band on a dark ink bar); V2 inverts the material, and everything below that says
 * "the band" now means dark fletching on light wood.
 *
 * The reference tabs beyond it (Compendium · Gallery · About) stay plain on
 * purpose: the hierarchy between "the journey" and "the shelf" IS the point, and it
 * is carried by the band, not by shouting three louder buttons.
 *
 * ⚠️ THE BALANCE LAW (V2 directive §4), and it is the reason nothing here is at
 * full strength. FIVE emphasis devices now stack on the same three cells — the
 * band's dark fill, the forward slant, the gilt hairline, the barb texture, and the
 * label weight. Each is deliberately dialled to about HALF what it would be if it
 * were carrying the hierarchy alone: the gilt is one pixel and its bloom is alpha
 * 0.22, the barbs vary luminance by ~4.6%, the weight is 600 rather than 700. If a
 * future edit strengthens one of them, it must weaken another; turning them all up
 * is how this becomes a novelty bar instead of a ribbon.
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
 * is sticky and theme.js derives ANCHOR_OFFSET from CHROME.headerDesktop, so every
 * About / guide / Compendium / dossier in-page anchor lands on a number the
 * ribbon must not move. tests/components/navFletching.test.jsx pins both halves —
 * the derivation chain, and the absence of any box that spends the overhang.
 * There is no TOP overhang: the header is sticky at top:0 and it would clip.
 *
 * ⚠️ MEASURED, NOT ASSUMED — AND CHROME.headerDesktop IS NOW THE LIVE HEIGHT.
 * V1 recorded that the constant said 60 while the bar measured 124 at 1440×900,
 * reported it as a pre-existing estate-wide divergence, and left it alone because
 * moving ANCHOR_OFFSET blindly would relocate every anchor landing in the estate.
 * V2 found the mechanism instead of moving the number: NavDivider's decorative SVG
 * was in flow asking for `height="100%"` against an indefinite parent, so it fell
 * back to its own viewBox height of 100 and THAT set the header's flex line
 * (100 + 2×12 padding = the 124 that was measured). The SVG is now out of flow, the
 * header spends CHROME.headerDesktop as its own min-height, and the bar measures
 * exactly 48 — so ANCHOR_OFFSET's derivation is true for the first time rather
 * than merely tidy. Do not reintroduce an in-flow percentage-height decoration.
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
 * ACTIVE STATE. The old affordance was a gold underline at label height; it has
 * been translated twice now, never replaced. The active feather lifts to
 * FLETCH_BROWN_LIFT, brightens its label to PARCH, trades its gilt hairline for the
 * brighter GILT_ACTIVE, and keeps a 2px gold bottom edge clipped to the vane so the
 * gold follows the feather's own bottom between the slants instead of drawing a
 * rectangle across it. Weight is deliberately NOT one of these channels any more —
 * V2 fixes every feather label at 600, which is why the directive asked for the
 * brighter gilt as a second distinguisher. That leaves four visual channels plus
 * aria-current="page", none of them colour alone. The plain reference tabs keep the
 * underline register, inverted to the ink browns the light shaft requires.
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
  BODY, GOLD_TXT, PARCH, PARCH_100, SP, FS, sans, FLETCH, FLETCH_BARB, FLETCH_BARB_DEG,
  FLETCH_BARB_LIFT, FLETCH_BROWN, FLETCH_BROWN_LIFT, GILT, GILT_ACTIVE, GILT_BLOOM,
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
 * THE BARB TEXTURE — fine diagonal streaks running WITH the feather's slant.
 *
 * The angle is FLETCH_BARB_DEG, derived in theme.js from the slant and the bar
 * height, so a barb is always parallel to the edge of the feather carrying it. The
 * period is deliberately TINY (3.25px against the shaft grain's 13px and 29px): the
 * directive asks the two textures to differ in direction AND scale, and it is the
 * scale gap that stops them reading as one interference pattern where a feather
 * meets bare wood.
 * @param {string} tone the barb's opaque darkest step (FLETCH_BARB / _LIFT)
 * @returns {string} a CSS repeating-linear-gradient
 */
const barbLayer = (tone) =>
  `repeating-linear-gradient(${FLETCH_BARB_DEG}deg, transparent 0, transparent 2.5px,`
  + ` ${tone} 2.5px, ${tone} 3.25px)`;

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
            // A feather's label rides DARK BROWN, so it stays in the pale register
            // even though the shaft under the fletching is now light wood. Weight
            // 600, never 700: under the BALANCE LAW weight is one of five stacked
            // devices and it is dialled to half — it separates the band from the shelf
            // (600 vs the reference tabs' 500) and says nothing about active-ness,
            // which the lift, the brighter gilt, the gold underline, the brighter
            // label and aria-current already carry between them.
            ? { alignSelf: 'stretch', color: active ? PARCH : PARCH_100, fontWeight: 600 }
            : {
              // The plain register, INVERTED for the light shaft: these labels sit
              // on bare wood, so they take the ink browns rather than the pale ones.
              // The underline is GOLD_TXT, not GOLD — on light wood GOLD measures
              // 1.92:1 and would be a boundary nobody can see; GOLD_TXT is 5.75:1
              // against the darkest streak and still reads as the gold register.
              borderBottom: active ? `2px solid ${GOLD_TXT}` : '2px solid transparent',
              color: active ? GOLD_TXT : BODY,
              fontWeight: active ? 700 : 500,
            }),
        }}
      >
        {fletchedCell && active && (
          // THE ACTIVE VANE — drawn ONLY for the active cell. The band's own paint
          // layer already gives every resting feather its brown, its gilt and its
          // barbs, so a resting vane would be an empty box painting nothing; this
          // one exists to OVERRIDE its patch of the band with the lifted fill, the
          // brighter gilt and the gold underline. Same two-layer trick as the band:
          // an outer clipped layer in GILT_ACTIVE showing through as a hairline
          // around an inner layer inset by FLETCH.gilt. The button above is never
          // clipped, so the focus ring survives (see the header note).
          <span
            aria-hidden="true"
            data-testid={`nav-feather-${id}`}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
              background: GILT_ACTIVE,
              clipPath: FEATHER_CLIP,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <span
              aria-hidden="true"
              data-testid={`nav-feather-fill-${id}`}
              style={{
                position: 'absolute', inset: FLETCH.gilt,
                background: FLETCH_BROWN_LIFT,
                backgroundImage: barbLayer(FLETCH_BARB_LIFT),
                // The underline follows the CLIP, so the gold runs along the
                // feather's own bottom between the slants rather than drawing a
                // rectangle across it.
                borderBottom: `2px solid ${GILT_ACTIVE}`,
                clipPath: FEATHER_CLIP,
                // Stated, not inherited — see the band fill's note.
                pointerEvents: 'none',
              }}
            />
          </span>
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
                    // THE GILT HAIRLINE, and why it is a FILL rather than a border:
                    // a border cannot follow a clip-path, so tracing the slanted
                    // silhouette means painting the whole shape gold and letting an
                    // inner copy, inset by FLETCH.gilt and clipped the same way,
                    // cover all but the edge. What is left is a hairline that
                    // follows every leaning edge exactly, by construction.
                    background: GILT,
                    clipPath: FEATHER_CLIP,
                    // Two shadows of this ONE clipped silhouette, in order: the
                    // brown copy offset down is the overhang (paint, never layout),
                    // then a soft low-alpha gold bloom around the result. Gilding —
                    // the bloom is alpha at 0.22 and blurred over FLETCH.bloom px,
                    // so it warms the wood at the feather's edge and never becomes
                    // a second, brighter line.
                    filter: `drop-shadow(0 ${FLETCH.overhang}px 0 ${FLETCH_BROWN})`
                      + ` drop-shadow(0 0 ${FLETCH.bloom}px ${GILT_BLOOM})`,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                >
                  <span
                    aria-hidden="true"
                    data-testid="nav-fletch-fill"
                    style={{
                      // The fletching's actual body: dark brown, carrying the barb
                      // grain. Inset by exactly the hairline's width on all four
                      // sides, so the gold beneath shows only as an edge.
                      position: 'absolute', inset: FLETCH.gilt,
                      background: FLETCH_BROWN,
                      backgroundImage: barbLayer(FLETCH_BARB),
                      clipPath: FEATHER_CLIP,
                      // Stated, not inherited. The parent is already
                      // pointer-events:none and this would inherit it, but the
                      // clipped-layer census in navFletching.test.jsx asserts the
                      // property on every clipped node — and it is right to: an
                      // inherited guarantee silently evaporates the day someone
                      // edits the parent, and this layer covers the whole band.
                      pointerEvents: 'none',
                    }}
                  />
                </span>
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
