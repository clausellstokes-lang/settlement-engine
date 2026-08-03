/**
 * NavDivider.jsx — the desktop ribbon's seam mark (LD-2, refitted for THE
 * FLETCHED RIBBON under the owner directive of 2026-08-03).
 *
 * The original order: nav items are separated by vertical lines running
 * top-to-bottom of the bar, EXCEPT inside the Create → Library → Realm trio,
 * whose seams were full-height CHEVRONS — two strokes converging on a mid-height
 * apex. THE CURVED-CHEVRON READING IS RETIRED ON DESKTOP. The trio now sits as
 * three fletches rooted on the arrow shaft (NavRibbon.jsx + GooseFletch.jsx), and
 * the seams between them become what a fletching's seams actually are: one straight
 * angled stroke per boundary, leaning with the comb — the shadow where one vane
 * overlaps the next.
 *
 * THE KIND IS STILL DERIVED, NEVER MAPPED. `dividerKind` asks the flow predicate
 * NavFlowArrow already owns (lib/routes.js NAV_FLOW) whether the left cell feeds
 * the right one. A hardcoded "angled strokes at these two boundaries" list is
 * exactly the parallel-array second truth routes.js:163 exists to forbid: a
 * future nav insertion or reorder files its own divider automatically instead of
 * silently keeping a stale mark at the wrong boundary. Only the ANSWER's spelling
 * changed ('chevron' → 'fletch'); the derivation did not.
 *
 * GEOMETRY. Both kinds are an inline SVG stretched to the parent's height
 * (`alignSelf: stretch`) with `preserveAspectRatio="none"`, so one viewBox serves
 * every bar height, and `vectorEffect="non-scaling-stroke"` keeps the hairline
 * exactly one device pixel under that non-uniform scale.
 *
 * ⚠️⚠️ THE SVG IS ABSOLUTELY POSITIONED, AND THAT IS LOAD-BEARING — A DECORATION
 * MUST NEVER PRICE THE BAR. `H` below is a COORDINATE SPACE, not a measurement. When
 * this SVG was in flow it asked for `height="100%"` against a parent whose height was
 * indefinite (the whole chain up to the header was `alignSelf: stretch`, which
 * resolves against the flex line, which is itself derived from the content). A
 * percentage against an indefinite height does not resolve, so the SVG fell back to
 * its INTRINSIC size — the viewBox's 100 — and that number then became the tallest
 * item on the header's flex line and set the bar. The desktop header measured 124px
 * (100 + 2×12 padding) while CHROME.headerDesktop said 60, ANCHOR_OFFSET inherited
 * the 40px shortfall so every in-page anchor landed under the chrome, and the dossier
 * toolbar pinned itself 64px beneath the bar it was supposed to sit flush under.
 * Lane FL-2 measured that divergence and could not name its cause; this was the cause.
 *
 * `position: absolute` with all four insets 0 resolves the percentage against the
 * span's used height instead (an absolutely positioned box's containing block is
 * always definite), so the mark still spans the seam exactly — and contributes zero
 * intrinsic height doing it. tests/components/navDividers.test.jsx pins the box to
 * the ribbon's height and asserts it is NOT the viewBox's, so no future edit can put
 * the coordinate space back into the layout.
 *
 * WHY THE FLETCH STROKE IS `FLETCH.slant` WIDE AND NOTHING ELSE. ⚠️ `slant` SURVIVED
 * V3 WITH A NARROWER JOB. Under V2 it was the parallelogram feather's own edge run,
 * and this mark borrowed it so the seam and the vane leaned identically. V3's vanes
 * are shield-cut PATHS, so there is no parallelogram edge left to match — but the
 * seam still wants to lean rather than stand vertical, because a fletch's overlap
 * shadow does. So `slant` is now exactly this: the seam box's width, drawn
 * corner-to-corner so the stroke traverses `slant` over the bar's height. The barbs
 * lean at their OWN derived angle (FLETCH_BARB_DEG, off FLETCH.barbRun); do not
 * re-couple the two, because they are no longer the same geometry.
 *
 * WIDTH + CLEARANCE. The plain rule stays 7px wide and the ribbon's flex `gap`
 * stays 0, so the divider IS the seam rather than an addition to it: each label
 * keeps its SP.lg (16px) padding and the rule sits 3.5px further out.
 *
 * BYTE FRUGALITY. This renders in the EAGER App.jsx header, so it is inline SVG
 * with no icon import and no new dependency — one or two `<line>` elements and a
 * token colour.
 *
 * A11Y. Pure decoration: `aria-hidden`, no focus stop, no pointer surface, no
 * text content, so no nav link's accessible name changes. The ribbon's buttons
 * carry the whole accessible name and keyboard behaviour. NEITHER stroke clears
 * WCAG 1.4.11's 3:1, and under V3 that is true by design for both: the fletch seam
 * is a quill shadow (1.23:1 on the vane) and the plain rule a groove (2.14:1 on the
 * barrel). 1.4.11 governs boundaries a user must perceive to understand or operate a
 * control; these separate two already-legible labels that each carry their own text,
 * focus ring and hit area. Nothing about reaching Compendium depends on seeing the
 * groove, and nothing about reaching Realm depends on seeing the seam — the vane's
 * own silhouette against the wood (4.46:1) is what says where a fletch is.
 */
import { FLETCH_SEAM, SHAFT_RULE, FLETCH } from '../theme.js';
import { flowsInto } from './NavFlowArrow.jsx';

/** The plain rule's own coordinate space; scaled to the bar by preserveAspectRatio. */
const W = 7;
const H = 100;

/**
 * The seam mark between two adjacent nav cells, derived from the declared flow.
 * @param {string} from left cell's view id
 * @param {string} to right cell's view id
 * @returns {'fletch'|'line'} an angled fletch stroke when `from` feeds `to` (the
 *   pair is inside the fletched band), else a plain vertical rule
 */
export function dividerKind(from, to) {
  return flowsInto(from, to) ? 'fletch' : 'line';
}

export default function NavDivider({ kind, from, to }) {
  const isFletch = kind === 'fletch';
  // The fletch stroke's box is exactly as wide as the feathers' slant, so its
  // corner-to-corner diagonal is the vanes' own angle (see the geometry note).
  const w = isFletch ? FLETCH.slant : W;
  const stroke = {
    // A QUILL SHADOW inside the fletching, a wood groove between the reference tabs.
    // ⚠️ THE FLETCH SEAM IS NO LONGER GOLD, and the reason is the species. V2 edged
    // its parallelogram feathers in a GILT hairline and cut the seams in the same
    // gold, which read as ornament. Real fletching has no metal in it: where two
    // vanes meet you see one feather's shadow on the next. So the seam took
    // FLETCH_SEAM — the vane's own darkest tone — which measures 1.23:1 against the
    // vane. That is correct and recorded, not an oversight: feather-on-feather
    // shadows ARE nearly tonal, and the boundary a user must actually perceive is
    // the vane against the wood at 4.46:1, which GooseFletch's silhouette carries.
    // The groove keeps SHAFT_RULE, retoned for the honey barrel (V2's #A39062 was
    // picked against cream and measures 1.29:1 here, i.e. invisible).
    stroke: isFletch ? FLETCH_SEAM : SHAFT_RULE,
    strokeWidth: 1,
    vectorEffect: 'non-scaling-stroke',
  };
  return (
    <span
      aria-hidden="true"
      data-testid={`nav-divider-${kind}-${from}-${to}`}
      data-divider-kind={kind}
      style={{
        // Stretches to the ribbon's full height — inside the fletched band that
        // is the band's height, so the stroke spans exactly the feathers it cuts
        // between; outside it, the ribbon's, so a plain rule still runs the bar
        // top-to-bottom. Both fall out of the flex chain rather than out of
        // absolute positioning (which would span BOTH rows once the header wraps).
        alignSelf: 'stretch', display: 'flex', flex: `0 0 ${w}px`,
        pointerEvents: 'none',
        // Above the band's paint layer, which is z-index 0 within the band.
        position: 'relative', zIndex: 1,
      }}
    >
      <svg
        width="100%" height="100%" viewBox={`0 0 ${w} ${H}`}
        preserveAspectRatio="none" focusable="false" aria-hidden="true"
        // Out of flow on purpose — see the GEOMETRY note. The insets, not the
        // percentages, are what make this box the seam's exact size, and taking it
        // out of flow is what stops the viewBox from becoming a layout height.
        style={{ position: 'absolute', inset: 0, display: 'block', overflow: 'visible' }}
      >
        {isFletch ? (
          // ONE straight stroke, bottom-left → top-right: the same forward lean
          // the feathers carry, cut through the band as a single sharp angle.
          <line x1="0" y1={H} x2={w} y2="0" {...stroke} />
        ) : (
          <line x1={w / 2} y1="0" x2={w / 2} y2={H} {...stroke} />
        )}
      </svg>
    </span>
  );
}
