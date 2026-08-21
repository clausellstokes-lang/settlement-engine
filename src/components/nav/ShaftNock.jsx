/**
 * ShaftNock.jsx — THE HORN CROSS-NOCK AT THE ARROW'S TAIL (counsel R7).
 *
 * ⚠️⚠️ THIS IS A BUILD-AND-SHOW, AND IT IS THE OWNER'S GLANCE THAT DECIDES IT. The
 * counsel proposed it, the chair could not settle it by argument, and a mark this small
 * is not decidable in prose: either the bar's right end reads as an arrow that
 * CONTINUES past the viewport, or the nock reads as a smudge and the end was better
 * left open. It ships behind nothing and reverts in ONE commit — no token outlives it,
 * no other module reads it, and its only consumer is a single line in App.jsx.
 *
 * WHAT A NOCK IS, so the drawing is craft-true rather than decorative. A war arrow's
 * tail is slotted to take the bowstring, and the slot alone would split the shaft under
 * draw — so a sliver of HORN is let in crosswise, at right angles to the grain, and the
 * slot is cut through it. What you see on a real shaft, end-on to the fletching, is
 * therefore three things in this order:
 *
 *   1. THE HORN INSERT — a pale, slightly translucent band ACROSS the shaft, sitting
 *      proud of the wood by a hair. It is the one non-wood, non-metal material on this
 *      bar, and that is exactly why it is worth showing: it says the arrow was MADE.
 *   2. THE STRING SLOT — a narrow groove cut back ALONG the shaft through the horn,
 *      dark, because it is a hole with the bowstring's shadow in it.
 *   3. THE END GRAIN — the shaft's own cut face beyond the horn, a step darker than
 *      the barrel, because it is the wood seen across its fibres rather than along them.
 *
 * ⚠️ PAINT ONLY, LIKE EVERYTHING ELSE ON THIS BAR. Absolutely positioned inside the
 * sticky header with `pointerEvents: none`, so it spends no width, no height, no margin
 * and no offset. theme.js derives ANCHOR_OFFSET from CHROME.headerDesktop and every
 * in-page anchor in the estate lands on it; a decoration that cost one pixel of box
 * would move every one of them.
 *
 * ⚠️ IT CARRIES NO CONTRAST CLAIM AND NO STATE. Nothing about reaching any destination
 * depends on perceiving it; it is never the only channel for anything; it is
 * aria-hidden and unfocusable. The horn is the palest thing on the bar, so the ONE
 * arithmetic obligation it does have is the dead-band law's inverse: it must not sit
 * where a pale label's ink could land on it. It cannot — it lives in the last
 * `NOCK.width` px of the bar, past the last rider on it (the account cluster), and the
 * pin asserts that clearance rather than assuming it.
 */
import {
  CHROME, FLETCH_RACHIS, FLETCH_TIP, SHAFT_EDGE, SHAFT_RIM, SHAFT_STOPS, lightOffset,
} from '../theme.js';

/**
 * THE NOCK'S GEOMETRY, in px of the bar it sits on.
 *
 * ⚠️ `width` IS THE COUNSEL'S OWN RANGE, at its middle. R7 asks for 12-20px; 16 is the
 * value that puts the horn band at a legible ~4px while leaving room for the end grain
 * beyond it, and it is authored as ONE number so the whole mark scales from it.
 */
const NOCK = Object.freeze({ width: 16, horn: 4.2, slot: 1.4 });

/** The bar's own height, which is the mark's coordinate space vertically. */
const H = CHROME.headerDesktop;

/**
 * THE HORN'S TONE, and it is DERIVED rather than a new token, deliberately: this mark
 * is a build-and-show and must be revertible without leaving a palette entry behind.
 * Horn is the feather's own pale rachis tone — which is materially right (both are
 * keratin) and, more to the point here, means the bar grows NO new colour for a mark
 * the owner may not keep.
 */
const HORN = FLETCH_RACHIS;

/** How far the horn's lit edge is pushed toward the composition's one light. */
const LIT = lightOffset(0.5);

/**
 * The horn cross-nock.
 * @param {{ side?: 'right' }} props kept for symmetry with ShaftWrap; the arrow has
 *   exactly one tail and it is at the bar's right end.
 */
export default function ShaftNock() {
  return (
    <span
      aria-hidden="true"
      data-testid="nav-shaft-nock"
      style={{
        // ⚠️ ABSOLUTE, ANCHORED TO THE BAR'S OWN RIGHT EDGE. No width in the flex row,
        // no height on the header, nothing an anchor derivation can see.
        // ⚠️⚠️ `right: 0` REALLY IS THE SCREEN EDGE, AND THAT WAS WORTH MEASURING. The
        // desktop header carries `padding: 0 SP.xxl`, and the obvious correction is to
        // give that padding back with a negative inset — which is WRONG, because an
        // absolutely positioned box resolves against its containing block's PADDING
        // BOX, and a padding box already extends to the border edge. Measured: at
        // `right: -SP.xxl` the nock sat at x 1448..1464 on a 1440 viewport, entirely
        // off-screen and invisible in a screenshot that looked exactly like no nock at
        // all. At `right: 0` its right edge is 1440 — the bar's own end.
        position: 'absolute', top: 0, bottom: 0, right: 0,
        width: NOCK.width,
        pointerEvents: 'none',
        // Above the barrel's own paint, below every control.
        zIndex: 0,
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        data-testid="nav-shaft-nock-paint"
        viewBox={`0 0 ${NOCK.width} ${H}`}
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* The horn's own shading — it is a cylinder segment like everything else on
              this shaft, so it takes the barrel's stops rather than a light of its own. */}
          <linearGradient id="sf-nock-horn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={HORN} stopOpacity="0.92" />
            <stop offset={SHAFT_STOPS.mid} stopColor={HORN} stopOpacity="0.78" />
            <stop offset={SHAFT_STOPS.body} stopColor={HORN} stopOpacity="0.5" />
            <stop offset="1" stopColor={HORN} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* 3 — THE END GRAIN first, because everything else sits on it: the shaft's cut
               face, a step darker than the barrel because it is wood seen ACROSS the
               fibre. It runs the whole height, so the bar simply ends darker. */}
        <rect
          data-testid="nav-shaft-nock-end"
          x={NOCK.width - NOCK.horn - 1}
          y="0"
          width={NOCK.horn + 1}
          height={H}
          fill={SHAFT_EDGE}
        />
        {/* 1 — THE HORN INSERT, let in crosswise. */}
        <rect
          data-testid="nav-shaft-nock-horn"
          x={NOCK.width - NOCK.horn}
          y="0"
          width={NOCK.horn}
          height={H}
          fill="url(#sf-nock-horn)"
        />
        {/* …and its lit edge, on the composition's one azimuth. A whisper: the horn's
            own fill already says "pale", and a second bright line would make the bar's
            end the loudest thing on it. */}
        <rect
          data-testid="nav-shaft-nock-lit"
          x={NOCK.width - NOCK.horn + LIT.dx}
          y="0"
          width="0.6"
          height={H}
          fill={HORN}
          fillOpacity="0.55"
        />
        {/* 2 — THE STRING SLOT, cut back ALONG the shaft through the horn. It is a hole,
               so it is the darkest tone on the bar, and it sits on the barrel's own
               centreline where a string would lie. */}
        <rect
          data-testid="nav-shaft-nock-slot"
          x={NOCK.width - NOCK.horn - 3}
          y={H / 2 - NOCK.slot / 2}
          width={NOCK.horn + 3}
          height={NOCK.slot}
          fill={FLETCH_TIP}
        />
        {/* The slot's own shadowed lower lip — what turns a painted line into a cut. */}
        <rect
          data-testid="nav-shaft-nock-slot-lip"
          x={NOCK.width - NOCK.horn - 3}
          y={H / 2 + NOCK.slot / 2}
          width={NOCK.horn + 3}
          height="0.5"
          fill={SHAFT_RIM}
          fillOpacity="0.8"
        />
      </svg>
    </span>
  );
}

export { HORN, NOCK };
