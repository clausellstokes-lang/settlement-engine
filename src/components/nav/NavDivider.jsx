/**
 * NavDivider.jsx — the desktop ribbon's seam mark (LD-2, refitted twice: for THE
 * FLETCHED RIBBON under the owner directive of 2026-08-03, and again for THE
 * SHINGLED BAND under the owner's mockup refinement the same night).
 *
 * The original order: nav items are separated by vertical lines running
 * top-to-bottom of the bar, EXCEPT inside the Create → Library → Realm trio, whose
 * seams were something else — full-height chevrons under LD-2, then one angled
 * fletch stroke under V3.
 *
 * ⚠️ THE SEAM INSIDE THE BAND IS RETIRED, AND ITS RETIREMENT IS THE POINT.
 * V3 cut an angled "quill shadow" between each pair of fletches. On a real arrow
 * there is no such mark: where two feathers meet, one lies OVER the other and what
 * you see is the upper vane's own edge and the shadow it drops. Worse, the mark was
 * doing active harm — the seam box was 10px wide and the vanes' lap resolved to
 * about two screen pixels, so the drawn seam plus its box was WIDER than the overlap
 * it was supposed to decorate and the band rendered as three separate tabs with bare
 * honey wood between them. FletchBand.jsx now shingles the three vanes in one
 * coordinate space with a contact shadow at every lap: the laps ARE the seams, there
 * is nothing left between two fletches to divide, and this leaf draws only the
 * groove between two REFERENCE tabs.
 *
 * With it goes `dividerKind`. The derivation it performed has not been lost —
 * NavRibbon still asks the same predicate (routes.js NAV_FLOW via
 * NavFlowArrow.flowsInto) which cells belong to the band — but a function whose only
 * remaining answer was 'line' would have been a second truth pretending to be a
 * choice. `from` / `to` survive as the mark's identity, so the census can still name
 * every boundary it sits between.
 *
 * GEOMETRY. The rule is an inline SVG stretched to the parent's height
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
 * WIDTH + CLEARANCE. The rule stays 7px wide and the ribbon's flex `gap` stays 0, so
 * the divider IS the seam rather than an addition to it: each label keeps its SP.lg
 * (16px) padding and the rule sits 3.5px further out.
 *
 * BYTE FRUGALITY. This renders in the EAGER App.jsx header, so it is inline SVG with
 * no icon import and no new dependency — one `<line>` element and a token colour.
 *
 * A11Y. Pure decoration: `aria-hidden`, no focus stop, no pointer surface, no text
 * content, so no nav link's accessible name changes. The ribbon's buttons carry the
 * whole accessible name and keyboard behaviour. The stroke does not clear WCAG
 * 1.4.11's 3:1 and by design: it is a groove (2.14:1 on the barrel), and 1.4.11
 * governs boundaries a user must perceive to understand or operate a control. This
 * separates two already-legible labels that each carry their own text, focus ring and
 * hit area — nothing about reaching Compendium depends on seeing the groove.
 */
import { SHAFT_RULE } from '../theme.js';

/** The rule's own coordinate space; scaled to the bar by preserveAspectRatio. */
const W = 7;
const H = 100;

export default function NavDivider({ from, to }) {
  return (
    <span
      aria-hidden="true"
      data-testid={`nav-divider-line-${from}-${to}`}
      data-divider-kind="line"
      style={{
        // Stretches to the ribbon's full height, so the rule runs the bar
        // top-to-bottom. It falls out of the flex chain rather than out of absolute
        // positioning (which would span BOTH rows once the header wraps).
        alignSelf: 'stretch', display: 'flex', flex: `0 0 ${W}px`,
        pointerEvents: 'none',
        position: 'relative', zIndex: 1,
      }}
    >
      <svg
        width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none" focusable="false" aria-hidden="true"
        // Out of flow on purpose — see the GEOMETRY note. The insets, not the
        // percentages, are what make this box the seam's exact size, and taking it
        // out of flow is what stops the viewBox from becoming a layout height.
        style={{ position: 'absolute', inset: 0, display: 'block', overflow: 'visible' }}
      >
        {/* A groove cut in the barrel. SHAFT_RULE is retoned for the honey wood:
            V2's #A39062 was picked against cream and measures 1.29:1 here, i.e.
            invisible. */}
        <line
          x1={W / 2} y1="0" x2={W / 2} y2={H}
          stroke={SHAFT_RULE} strokeWidth="1" vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
