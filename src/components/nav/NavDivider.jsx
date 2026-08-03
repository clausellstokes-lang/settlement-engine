/**
 * NavDivider.jsx — the desktop ribbon's seam mark (LD-2, refitted for THE
 * FLETCHED RIBBON under the owner directive of 2026-08-03).
 *
 * The original order: nav items are separated by vertical lines running
 * top-to-bottom of the bar, EXCEPT inside the Create → Library → Realm trio,
 * whose seams were full-height CHEVRONS — two strokes converging on a mid-height
 * apex. THE CURVED-CHEVRON READING IS RETIRED ON DESKTOP. The trio now sits in a
 * single leather-brown fletched band (NavRibbon.jsx), and the seams between its
 * feathers become what a fletching's seams actually are: SHARP STRAIGHT ANGLED
 * STROKES, one per boundary, cut at exactly the angle the feathers lean.
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
 * WHY THE FLETCH STROKE IS `FLETCH.slant` WIDE AND NOTHING ELSE. The feather's
 * clipped edge runs `FLETCH.slant` px horizontally over the band's full height
 * (NavRibbon's FEATHER_CLIP). Giving this mark the SAME width and drawing it
 * corner-to-corner — bottom-left to top-right — makes it traverse the same run
 * over the same height, so the stroke is PARALLEL to the vanes by construction
 * rather than by a second angle someone has to keep in sync. Change FLETCH.slant
 * and both move together.
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
 * carry the whole accessible name and keyboard behaviour. The fletch stroke takes
 * GILT, measured at 3.12:1 against FLETCH_BROWN — clear of WCAG 1.4.11's 3:1 for
 * a non-text boundary (the ratio is recorded in theme.js and recomputed by
 * tests/design/contrast.test.js). The plain rule takes SHAFT_RULE at 2.50:1 against
 * the wood and does NOT clear 3:1, which is correct and recorded: 1.4.11 governs
 * boundaries a user must perceive to understand or operate a control, and these
 * separate two already-legible labels that each carry their own text, focus ring
 * and hit area. Nothing about reaching Compendium depends on seeing the groove.
 */
import { GILT, SHAFT_RULE, FLETCH } from '../theme.js';
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
    // GILT inside the fletching, a wood groove between the reference tabs. Both
    // tones moved with the material under ribbon v2: the seam colours that read on
    // an ink bar are not the seam colours that read on a light plank, and the plain
    // rule in particular went invisible (BORDER is 1.56:1 on wood) until it became
    // SHAFT_RULE. The GAP between the two — gilt at 3.12:1, groove at 2.50:1 — is
    // the hierarchy, and it is deliberate.
    stroke: isFletch ? GILT : SHAFT_RULE,
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
