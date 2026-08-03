/**
 * GooseFletch.jsx — ONE grey-goose primary, in profile, rooted on the shaft.
 *
 * THE OWNER CORRECTED THE SPECIES (2026-08-03 evening): turkey → GREY GOOSE, the
 * English war-arrow feather, and the correction drives every mark in this file.
 * A turkey primary is boldly BARRED — broad light/dark stripes across the vane. A
 * goose primary is not: it is cooler, more uniform, and what you actually see is
 * FINE PARALLEL BARB STRIATIONS combed diagonally off a pale rachis, a slightly
 * paler leading edge, a soft darkening toward the trailing tip, and two broad
 * gentle SHEEN BANDS where a run of barbs catches the light. So there is no barring
 * here, anywhere — and that is not only historical accuracy, it is what lets three
 * labels sit on three feathers and still read as words.
 *
 * THE SILHOUETTE IS A WAR FLETCH, NOT A PLUME AND NOT A SHIELD. Period English war
 * arrows carried a low shield-cut vane — short, broad and functional. A long flowing
 * plume would be heraldic, wrong for the object, and would stop covering the label.
 * But a SYMMETRIC low shape is wrong too, and that is the failure this file was
 * rebuilt out of: see LAP below. The vane runs the full width bound to the shaft,
 * hangs below it, deepens toward Realm, and laps back over the feather behind it.
 *
 * ⚠️⚠️ THE OVERHANG IS PAINT, NEVER LAYOUT — AND IT IS `overflow: visible` THAT
 * KEEPS IT SO. The vanes' lower edges peek FLETCH.overhang px below the ribbon's
 * bottom border. The obvious ways to buy that — a taller box, `height: calc(100% +
 * 6px)`, a negative `bottom` — ALL spend a layout property, and theme.js derives
 * ANCHOR_OFFSET from CHROME.headerDesktop, so every About / guide / Compendium /
 * dossier in-page anchor in the estate lands on a number this bar must not move.
 * Instead the SVG's box is exactly the cell (`inset: 0`), its viewBox is exactly
 * CHROME.headerDesktop units tall so one unit is one pixel, and the vane path is
 * simply DRAWN past the bottom at y > headerDesktop with the UA's default
 * `overflow: hidden` lifted. Painting outside your own box costs no box.
 * tests/components/navFletching.test.jsx pins all three halves: the overflow, the
 * geometry that reaches past the bar, and the absence of any box that spends it.
 *
 * ⚠️ THE SVG IS NEVER THE FOCUSABLE ELEMENT. `clip-path` clips an element's whole
 * rendering INCLUDING its outline, and a11y.css draws the global focus ring outside
 * the border box, so clipping the cell's own control would silently swallow the
 * keyboard ring while every visual test stayed green. Everything here is an
 * aria-hidden decoration layer INSIDE the control; the control itself is never
 * clipped. (Spelled in prose on purpose: the raw-control ratchet counts JSX tags by
 * source match, so writing the tag name here would spend a unit of the migration
 * budget on a docstring. See tests/lint/rawButtonBaseline.test.js.)
 *
 * ⚠️ WHY THE SHEEN BANDS STOP SHORT OF THE LOWER EDGE. SHEEN_FLOOR ends them at
 * 72% of the vane's depth, and that is a CONTRAST guarantee, not a taste: the active
 * fletch's gold underline runs along the vane's own bottom, and GOLD measures
 * 2.42:1 on the brightened sheen but 4.12:1 on the vane gradient. Letting a band
 * reach the bottom edge would put the state-carrying underline under SC 1.4.11's
 * 3:1 floor at whatever x the band happened to cross. Ending them high keeps the
 * underline's ground the vertical gradient alone, which only ever darkens downward.
 *
 * WHY THE SHEEN MAY BE BLURRED AND THE AA CLAIM STILL HOLDS. The bands are softened
 * with a gaussian blur, because a hard-edged band reads as a printed stripe rather
 * than as light. A blur is a weighted average of its inputs, so it cannot produce a
 * tone lighter than the lightest tone it was given — the lightest pixel on a blurred
 * sheen band is still exactly the sheen tone. The label's AA floor is therefore
 * unchanged by the blur, which is why the tones can stay opaque and computable.
 */
import {
  CHROME, FLETCH, FLETCH_BARB, FLETCH_LEAD, FLETCH_RACHIS, FLETCH_SHADOW,
  FLETCH_SHEEN, FLETCH_SHEEN_LIFT, FLETCH_TIP, FLETCH_VANE, GOLD,
} from '../theme.js';

/** The fletch's own coordinate width. Stretched to the cell by preserveAspectRatio. */
const W = 120;
/** Vane depth at the shaft line — ONE unit per pixel, which is what makes `B` real. */
const D = CHROME.headerDesktop;
/** The deepest the vane reaches: past the bar by exactly the overhang. */
const B = D + FLETCH.overhang;
/** Where the sheen bands stop, short of the lower edge (see the header note). */
const SHEEN_FLOOR = D * 0.72;

/**
 * ⚠️ LAP — HOW FAR EACH VANE REACHES BACK OVER THE ONE BEHIND IT, AND IT IS THE
 * DIFFERENCE BETWEEN FLETCHING AND BADGES.
 *
 * The first cut of this file gave every tab a symmetric shield that stopped inside
 * its own cell. Three of those in a row read — accurately, and fatally — as three
 * heraldic escutcheons pinned to a plank: bare wood between each pair, no direction,
 * no object. Real fletching does not look like that. Three feathers bound along a
 * shaft OVERLAP, each vane lying across the quill of the one behind it, which is
 * what makes the row read as one continuous thing swept in one direction.
 *
 * So each vane extends LAP units back past its own cell, and (because a later cell
 * paints over an earlier one) laps across its predecessor. The SVG can do that
 * without a layout consequence for the same reason it can reach BELOW the bar:
 * `overflow: visible` paints outside the box and costs no box. Horizontal reach is
 * the safe direction anyway — the ribbon's hazard is vertical.
 */
const LAP = 12;

/**
 * THE LOWER SILHOUETTE, as an OPEN path from the trailing end forward to where the
 * leading taper begins.
 *
 * ⚠️ IT IS ASYMMETRIC ON PURPOSE — the vane is DEEPEST at the trailing end, toward
 * Realm, and rises to a short taper at the leading end. That rake IS the "sweeping
 * toward Realm" the directive asks for, and it is also the whole visual difference
 * from a shield: a shield is symmetric about its centre, a flight feather never is.
 * Only the LEADING corner is rounded; the trailing end runs out at full depth
 * because the next feather is lying over it.
 *
 * The deepest control points are pinned AT `B` rather than beyond it, so the curve's
 * maximum is exactly `B` — a Bézier never exceeds its own control hull. That is what
 * makes "the overhang is FLETCH.overhang" a derivation rather than an eyeballed
 * coordinate that drifts the next time the curve is retouched.
 */
const VANE_EDGE = [
  `C ${W + 6} ${D * 0.52}, ${W} ${B}, ${W - 22} ${B}`,
  `C 72 ${B}, 38 ${D * 0.94}, 10 ${D * 0.79}`,
].join(' ');

/**
 * The leading taper, rising back to a POINT on the quill and lapping over the fletch
 * behind.
 *
 * ⚠️ IT ENDS AT A POINT, NOT A CORNER, and that was the second thing this file got
 * wrong. With the leading end squared off at the quill line, each vane had two hard
 * 90° corners against the wood and the row read as three dark TABS — better than
 * three shields, still not feathers. A real primary is thin where it enters the
 * binding and widens backward. `TIP_IN` is that entry point: a few units below the
 * quill, so the top edge arrives at it as a taper instead of a butt joint.
 */
const TIP_IN = 3;
const VANE_LEAD_IN = `C 2 ${D * 0.62}, ${2 - LAP} ${D * 0.26}, ${-LAP} ${TIP_IN}`;

/** The closed vane: the quill line bound to the shaft, then the silhouette back. */
const VANE_PATH = `M ${-LAP} ${TIP_IN} L ${W + 4} 0 ${VANE_EDGE} ${VANE_LEAD_IN} Z`;
/**
 * The LOWER edge alone — what the active fletch's gold is stroked along.
 * ⚠️ It deliberately EXCLUDES the leading taper. The first cut stroked the whole
 * closed silhouette, and the gold ran up the front and along the quill too, which
 * read as a selected-badge outline rather than as a lit lower edge. Gold on the
 * bottom is a highlight; gold all the way round is a border.
 */
const VANE_LOWER = `M ${W + 4} 0 ${VANE_EDGE}`;

/** How far a mark leaning at the comb angle drifts over `depth` of vane. */
const lean = (depth) => (depth / D) * FLETCH.barbRun;

/**
 * THE BARB STRIATIONS — every barb the vane carries, as ONE path.
 *
 * One element rather than ~45, because this renders in the EAGER App.jsx header on
 * every desktop page load and forty-five DOM nodes per tab is a hundred and
 * thirty-five nodes of pure decoration. Deterministic by construction: a plain
 * arithmetic sweep, no random source anywhere, so the comb is byte-identical on
 * every render and every machine.
 *
 * The strokes are `non-scaling-stroke`, which is load-bearing under
 * `preserveAspectRatio="none"`: the three tabs are different widths, so the x-scale
 * differs per tab, and a scaled hairline would come out visibly heavier on Create
 * than on Realm. One device pixel on all three is what makes them one fletching.
 */
const BARB_PATH = (() => {
  const marks = [];
  for (let x = -FLETCH.barbRun - LAP - 6; x < W + 10; x += FLETCH.barbGap) {
    marks.push(`M ${x.toFixed(1)} 0 L ${(x + FLETCH.barbRun).toFixed(1)} ${D}`);
  }
  return marks.join(' ');
})();

/**
 * A sheen band: a broad quadrilateral leaning at the comb angle, from the rachis
 * down to SHEEN_FLOOR. Two of them, at widths and positions chosen by eye — real
 * goose primaries show two or three soft tonal runs, never an even set.
 * @param {number} x the band's leading x at the rachis
 * @param {number} w its width there
 * @returns {string} an SVG path
 */
const sheenBand = (x, w) => {
  const drift = lean(SHEEN_FLOOR);
  return `M ${x} 0 L ${x + w} 0 L ${x + w + drift} ${SHEEN_FLOOR} L ${x + drift} ${SHEEN_FLOOR} Z`;
};
const SHEEN_BANDS = [sheenBand(6, 19), sheenBand(56, 26)];

/**
 * THE RACHIS — the pale spine the barbs comb off, tapering toward the trailing end
 * the way a real quill does. It rides the top of the vane because that is where the
 * quill is: BOUND TO THE SHAFT. That placement is also why it can be genuinely pale
 * without costing anything — it sits above the label band entirely. Its tone is held
 * inside the vane ladder's AA floor regardless, so the claim never depends on the
 * label staying where it is today.
 */
const RACHIS_PATH = `M ${-LAP} 1.2 L ${W + 4} 2.8 L ${W + 4} 5.6 L ${-LAP} 4.4 Z`;

/**
 * One fletch, painted inside a nav cell.
 * @param {{ id: string, active: boolean }} props `id` scopes the SVG-local ids so
 *   three fletches on one page cannot collide; `active` brightens the sheen and
 *   draws the gold edge.
 */
export default function GooseFletch({ id, active }) {
  const clipId = `fletch-clip-${id}`;
  const vaneId = `fletch-vane-${id}`;
  const softId = `fletch-soft-${id}`;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-testid={`nav-fletch-${id}`}
      data-fletch-state={active ? 'active' : 'resting'}
      viewBox={`0 0 ${W} ${D}`}
      preserveAspectRatio="none"
      style={{
        // The box is EXACTLY the cell. The vane reaches past it in paint only —
        // see the overhang note. `overflow` is not a layout property and buys no
        // height; every alternative that reaches below this box does.
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
        width: '100%', height: '100%',
        overflow: 'visible',
        display: 'block',
        pointerEvents: 'none',
        // The soft drop shadow that seats the feather on the wood. A filter, so it
        // too paints outside the box without occupying one.
        filter: `drop-shadow(-1px 1.5px 2px ${FLETCH_SHADOW})`,
        zIndex: 0,
      }}
    >
      <defs>
        {/*
          ONE gradient carrying BOTH tonal stories the directive asks for: it runs
          diagonally (0,0)→(0.75,1), so the paler LEADING edge sits at its origin and
          the tone darkens together toward the trailing tip AND the lower edge. Two
          separate gradients would need two layers and would let the two stories
          drift apart; a feather's shading is one fall of light.
        */}
        <linearGradient id={vaneId} x1="0" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor={FLETCH_LEAD} />
          <stop offset="0.45" stopColor={FLETCH_VANE} />
          <stop offset="1" stopColor={FLETCH_TIP} />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={VANE_PATH} />
        </clipPath>
        <filter id={softId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <path d={VANE_PATH} fill={`url(#${vaneId})`} />

      <g clipPath={`url(#${clipId})`}>
        {/* The sheen first, the barbs over it: light falls on the vane, and the
            barbs are the vane. Painted the other way round the comb would vanish
            wherever the light was, which is precisely where it should read most. */}
        <g filter={`url(#${softId})`} data-testid={`nav-fletch-sheen-${id}`}>
          {SHEEN_BANDS.map((d) => (
            <path key={d} d={d} fill={active ? FLETCH_SHEEN_LIFT : FLETCH_SHEEN} />
          ))}
        </g>
        <path
          d={BARB_PATH}
          data-testid={`nav-fletch-barbs-${id}`}
          fill="none"
          stroke={FLETCH_BARB}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path d={RACHIS_PATH} data-testid={`nav-fletch-rachis-${id}`} fill={FLETCH_RACHIS} />
        {active && (
          // THE GOLD, TRANSLATED — not a rectangle across the cell but a stroke
          // along the vane's OWN lower silhouette, so it follows the rounded back
          // and the leading rise. The clip halves the stroke, which is why it is
          // authored at double width: what survives is the 2px inside the shape.
          <path
            d={VANE_LOWER}
            data-testid={`nav-fletch-edge-${id}`}
            fill="none"
            stroke={GOLD}
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </g>
    </svg>
  );
}

export { VANE_PATH, VANE_LOWER, BARB_PATH, SHEEN_BANDS, RACHIS_PATH, SHEEN_FLOOR, W, B, LAP, lean };
