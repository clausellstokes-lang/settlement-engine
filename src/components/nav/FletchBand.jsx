/**
 * FletchBand.jsx — ONE CONTINUOUS FLETCH BAND: three grey-goose primaries SHINGLED
 * along the shaft, drawn in ONE coordinate space.
 *
 * THE OWNER'S REFINEMENT (2026-08-03 night, from the mockup): a thin wooden shaft
 * bar; riding it, one continuous fletch band roughly twice the bar's height,
 * top-aligned at the quill line and HANGING well below the bar; inside the band,
 * Create · Library · Realm are three goose vanes shingled like real stacked
 * fletching — EACH FEATHER PARTIALLY LAPS THE NEXT, Create's trailing region lying
 * over Library's leading edge and Library's over Realm's — with a soft CONTACT
 * SHADOW where each upper vane laps the lower. The repeated exposed slanted edges
 * step rightward, and that cascade IS the flow direction Create → Library → Realm,
 * like fanned cards. After Realm the band ends and its last trailing edge resolves.
 *
 * ⚠️⚠️ WHY THIS IS ONE SVG AND NOT THREE — THE BUG THAT FORCED THE REWRITE. V3
 * (GooseFletch.jsx, retired here) drew one SVG per nav cell, each `inset: 0` on its
 * own button and stretched to that button's width by `preserveAspectRatio="none"`.
 * The lap was authored in each cell's LOCAL units, so it came out at a different
 * number of screen pixels in every cell — and at a number small enough that the
 * 10px NavDivider seam sitting between two cells outran it. The net fusion was
 * about two pixels: the shipped bar rendered three separate dark tabs with bare
 * honey wood between them, which is precisely the "feathers on a plank" failure the
 * whole directive exists to avoid. Every structural pin was green throughout,
 * because every pin measured the shapes and none measured the RELATIONSHIP between
 * two of them in the space they actually land in.
 *
 * The band is now ONE SVG spanning the whole cluster. `FLETCH.lap` is a fixed
 * fraction of `FLETCH.lane` inside a single coordinate space, so the shingle is
 * exact by construction at every band width and on every display. The internal
 * seams are retired with it: the laps ARE the seams now, and a drawn line between
 * two overlapping feathers would be a line nobody has ever seen on an arrow.
 *
 * ⚠️⚠️ THE HANG IS PAINT, NEVER LAYOUT — AND IT IS `overflow: visible` THAT KEEPS
 * IT SO. The vanes reach FLETCH_HANG px below the bar's bottom edge. The obvious
 * ways to buy that — a taller box, `height: calc(100% + Npx)`, a negative `bottom`
 * — ALL spend a layout property, and theme.js derives ANCHOR_OFFSET from
 * CHROME.headerDesktop, so every About / guide / Compendium / dossier in-page
 * anchor in the estate lands on a number this bar must not move. Instead the SVG's
 * box is exactly the band (`inset: 0`), its viewBox is exactly CHROME.headerDesktop
 * units tall so one vertical unit is one pixel, and the vanes are simply DRAWN past
 * the bottom at y > headerDesktop with the UA's default `overflow: hidden` lifted.
 * Painting outside your own box costs no box — and it is the ONLY mechanism here
 * that survives the shaft getting thinner, because the hang then deepens for free.
 * tests/components/navFletching.test.jsx pins all three halves: the overflow, the
 * geometry that reaches past the bar, and the absence of any box that spends it.
 *
 * ⚠️ THE SVG IS NEVER THE FOCUSABLE ELEMENT, AND IT IS NOT EVEN INSIDE ONE.
 * `clip-path` clips an element's whole rendering INCLUDING its outline, and a11y.css
 * draws the global focus ring outside the border box, so clipping a cell's own
 * control would silently swallow the keyboard ring while every visual test stayed
 * green. The band is a single aria-hidden decoration layer painted BEHIND the three
 * controls as their sibling; no control, and no ancestor of one, is clipped.
 * (Spelled in prose on purpose: the raw-control ratchet counts JSX tags by source
 * match, so writing the tag name here would spend a unit of the migration budget on
 * a docstring. See tests/lint/rawButtonBaseline.test.js.)
 *
 * THE SPECIES IS STILL GREY GOOSE, and it still drives every mark. A turkey primary
 * is boldly BARRED — broad light/dark stripes across the vane. A goose primary is
 * not: it is cooler, more uniform, and what you see is FINE PARALLEL BARB STRIATIONS
 * combed diagonally off a pale rachis, a paler leading edge, a soft darkening toward
 * the trailing tip, and two broad gentle SHEEN BANDS. There is no barring anywhere,
 * and that is not only accuracy — it is what lets three labels sit on three feathers
 * and still read as words.
 *
 * ⚠️ WHY THE SHEEN BANDS STOP SHORT OF THE LOWER EDGE. SHEEN_FLOOR ends them at 72%
 * of the vane's depth, and that is a CONTRAST guarantee, not a taste: the active
 * vane's gold runs along the vane's own lower silhouette, and GOLD measures 2.42:1
 * on the brightened sheen but 4.12:1 on the vane gradient. Letting a band reach the
 * lower edge would put the state-carrying edge under SC 1.4.11's 3:1 floor at
 * whatever x the band happened to cross. Ending them high keeps the edge's ground
 * the vertical gradient alone, which only ever darkens downward.
 *
 * WHY THE SHEEN MAY BE BLURRED AND THE AA CLAIM STILL HOLDS. A blur is a weighted
 * average of its inputs, so it cannot produce a tone lighter than the lightest tone
 * it was given — the lightest pixel on a blurred sheen band is still exactly the
 * sheen tone. The label's AA floor is therefore unchanged by the blur, which is why
 * the tones can stay opaque and computable.
 */
import {
  CHROME, FLETCH, FLETCH_BARB, FLETCH_HANG, FLETCH_LEAD, FLETCH_RACHIS,
  FLETCH_SHADOW, FLETCH_SHEEN, FLETCH_SHEEN_LIFT, FLETCH_TIP, FLETCH_VANE, GOLD,
} from '../theme.js';

/** One fletch's lane, and the band's own width: three lanes side by side. */
const LANE = FLETCH.lane;
const BAND_W = LANE * 3;
/** The vane's painted depth — the FEATHER's number, independent of the bar. */
const BAND = FLETCH.band;
/** The viewBox's height: exactly the bar, so one vertical unit is one pixel. */
const D = CHROME.headerDesktop;
/** Where the sheen bands stop, short of the lower edge (see the header note). */
const SHEEN_FLOOR = BAND * 0.72;

/**
 * ⚠️ THE LAP — HOW FAR EACH VANE LIES OVER THE NEXT, AND IT IS THE DIFFERENCE
 * BETWEEN FLETCHING AND BADGES.
 *
 * Three feathers bound along a shaft OVERLAP: each vane lies across the quill of
 * the one behind it, which is what makes the row read as one continuous thing swept
 * in one direction rather than as three shapes in a line. `FLETCH.lap` is that
 * reach, in lane units, and because the whole band is one coordinate space it is
 * also a fixed fraction of a lane at every rendered width — see the header note for
 * the version of this that was authored per-cell and silently came out at two
 * pixels.
 *
 * THE LAST VANE DOES NOT LAP ANYTHING. Realm's trailing reach is zero, so its quill
 * ends at the band's own edge and its trailing curve rounds back inside the band:
 * the fletching resolves rather than running off under the trail wrap.
 */
const REACH = (lane) => (lane === 2 ? 0 : FLETCH.lap);

/**
 * ONE VANE, as a closed path in band coordinates.
 *
 * ⚠️ IT IS ASYMMETRIC ON PURPOSE — the vane is DEEPEST at the trailing end, toward
 * Realm, and rises to a short taper at the leading end. That rake IS the sweep the
 * directive asks for, and it is also the whole visual difference from a shield: a
 * shield is symmetric about its centre, a flight feather never is.
 *
 * The deepest control points are pinned AT `BAND` rather than beyond it, so the
 * curve's maximum is exactly `BAND` — a Bézier never exceeds its own control hull.
 * That is what makes "the hang is FLETCH_HANG" a derivation rather than an
 * eyeballed coordinate that drifts the next time the curve is retouched.
 *
 * ⚠️ THE LEADING END IS A POINT ON THE QUILL, NOT A CORNER AT DEPTH. With it
 * squared off at the quill line each vane had two hard 90° corners against the wood
 * and the row read as three dark TABS. A real primary is thin where it enters the
 * binding and widens backward; `FLETCH.tipIn` is that entry point.
 *
 * ⚠️⚠️ BOTH ENDS ARE CUT ALONG THE BARBS, AND THAT IS WHAT MAKES THE SHINGLE
 * VISIBLE. The first shingled cut ran the trailing end almost straight down from the
 * quill, which is what a card's edge does, not a feather's — and the result rendered
 * as ONE dark blob with three barely-perceptible vertical creases in it. A fletcher
 * trims a vane along its own barb line, so both ends slope by exactly
 * `FLETCH.barbRun` over the vane's depth: the SAME angle the comb runs at, derived
 * from the same number. That turns each lap boundary into a long diagonal — the
 * upper feather's trailing cut lying across the lower feather's face — and three of
 * those stepping rightward is the cascade the directive asks for. It also puts the
 * deepest point of every vane at its far trailing corner, which is the rake toward
 * Realm, so one constant now buys the comb, the cut, the cascade and the rake.
 *
 * @param {number} lane 0 Create · 1 Library · 2 Realm
 * @returns {{ closed: string, lower: string, lead: string, trail: string }} the
 *   silhouette, its lower edge alone (what the gold is stroked along), and the two
 *   exposed edges the edge-light rides.
 */
function vane(lane) {
  const x0 = lane * LANE;
  const xt = x0 + LANE + REACH(lane);       // the deepest trailing corner
  const xq = xt - FLETCH.barbRun;           // where the trailing cut meets the quill
  const xl = x0 - FLETCH.back;              // the leading tip, on the quill
  const xr = xl + 12;                       // where the leading cut meets the belly
  const trail = `M ${xq} 0 C ${xq + 15} ${BAND * 0.31}, ${xt - 7} ${BAND * 0.73}, ${xt} ${BAND}`;
  // ⚠️ THE TWO LOWER CURVES MEET WITH A CONTINUOUS TANGENT, AND THAT IS NOT
  // fussiness. The belly's last control is the exact mirror of the leading cut's
  // last control through the join, so the margin runs smoothly round the lower
  // leading corner. The first cut of this shape left the two arriving at an angle
  // and every vane grew a hard BEAK there — three of which read as three torn tabs
  // rather than as one fletching, and the active vane's gold traced the beak in
  // metal so it was the loudest thing on the bar.
  const belly = `C ${x0 + 66} ${BAND}, ${xl + 20} ${BAND * 0.94}, ${xr} ${BAND * 0.72}`;
  const lead = `M ${xl} ${FLETCH.tipIn} C ${xl + 2} ${BAND * 0.22}, ${xl + 4} ${BAND * 0.5}, ${xr} ${BAND * 0.72}`;
  return {
    closed: `M ${xl} ${FLETCH.tipIn} L ${xq} 0 ${trail.slice(`M ${xq} 0 `.length)} ${belly}`
      + ` C ${xl + 4} ${BAND * 0.5}, ${xl + 2} ${BAND * 0.22}, ${xl} ${FLETCH.tipIn} Z`,
    // ⚠️ The gold's path EXCLUDES the leading cut deliberately. Stroking the whole
    // closed silhouette ran the gold up the front and along the quill too, which read
    // as a selected-badge outline rather than as a lit lower edge. Gold on the bottom
    // is a highlight; gold all the way round is a border.
    lower: `${trail} ${belly}`,
    lead,
    trail,
  };
}

const VANES = [0, 1, 2].map(vane);

/**
 * ⚠️ THE DETERMINISTIC JITTER — INTEGER ARITHMETIC, NEVER `Math.sin`.
 *
 * A perfectly regular comb reads as machine hatching, not as a feather; a small
 * wobble in barb spacing and in how brightly each barb catches the light is what
 * buys realism for free. But it must be BYTE-IDENTICAL on every render and every
 * machine, so there is no random source here and no transcendental either:
 * `Math.sin` is not required by IEEE-754 to be correctly rounded and engines differ
 * in the last ulp, which would make the comb a cross-engine golden hazard. This is
 * a plain 32-bit integer hash — same bits everywhere, forever.
 *
 * @param {number} n any integer
 * @returns {number} a value in [0, 1]
 */
function unitHash(n) {
  let h = Math.imul(n | 0, 2654435761) >>> 0;
  // ⚠️ EVERY XOR IS RE-COERCED TO UNSIGNED, and the first cut of this function was
  // not. `^` evaluates to a SIGNED int32, so `h ^= h >>> 13` could hand back a
  // negative number, `%` in JS keeps the sign of its left operand, and the "unit"
  // came out negative — which indexed a bucket array at -1 and blew the whole band
  // up at first paint. A hash that must land in [0, 1] has to say so at every step.
  h = ((h ^ (h >>> 15)) >>> 0);
  h = Math.imul(h, 2246822519) >>> 0;
  h = ((h ^ (h >>> 13)) >>> 0);
  return (h % 4096) / 4095;
}

/**
 * THE BARB STRIATIONS for one vane, bucketed by brightness.
 *
 * Three paths rather than ~50, because this renders in the EAGER App.jsx header on
 * every desktop page load and one element per barb would be a hundred and fifty
 * nodes of pure decoration. Three buckets is enough to stop the comb reading as one
 * flat screen while keeping the node count at nine for the whole band.
 *
 * The strokes are `non-scaling-stroke`, which is load-bearing under
 * `preserveAspectRatio="none"`: the band's x-scale is not its y-scale, and a scaled
 * hairline would come out visibly heavier one way than the other.
 *
 * @param {number} lane which fletch
 * @returns {string[]} three path strings, dimmest first
 */
function barbBuckets(lane) {
  const x0 = lane * LANE;
  const from = x0 - FLETCH.back - FLETCH.barbRun - 6;
  const to = x0 + LANE + REACH(lane) + 6;
  const buckets = [[], [], []];
  let x = from;
  for (let k = 0; x < to; k += 1) {
    const bucket = Math.floor(unitHash(k * 7 + lane * 131 + 3) * 3) % 3;
    buckets[bucket].push(`M ${x.toFixed(1)} 0 L ${(x + FLETCH.barbRun).toFixed(1)} ${BAND}`);
    // The gap wobbles within ±barbJitter/2 of its nominal value, and never to zero.
    x += FLETCH.barbGap * (1 - FLETCH.barbJitter / 2 + FLETCH.barbJitter * unitHash(k + lane * 911));
  }
  return buckets.map((m) => m.join(' '));
}

/** How far a mark leaning at the comb angle drifts over `depth` of vane. */
const lean = (depth) => (depth / BAND) * FLETCH.barbRun;

/**
 * A sheen band: a broad quadrilateral leaning at the comb angle, from the rachis
 * down to SHEEN_FLOOR. Two per vane, at widths and positions chosen by eye — real
 * goose primaries show two or three soft tonal runs, never an even set.
 * @param {number} x the band's leading x at the rachis
 * @param {number} w its width there
 * @returns {string} an SVG path
 */
const sheenBand = (x, w) => {
  const drift = lean(SHEEN_FLOOR);
  return `M ${x} 0 L ${x + w} 0 L ${x + w + drift} ${SHEEN_FLOOR} L ${x + drift} ${SHEEN_FLOOR} Z`;
};
const SHEENS = [0, 1, 2].map((lane) => [
  sheenBand(lane * LANE + 4, 23),
  sheenBand(lane * LANE + 54, 31),
  sheenBand(lane * LANE + 108, 19),
]);

/**
 * THE RACHIS — the pale spine the barbs comb off, tapering toward the trailing end
 * the way a real quill does. It rides the top of the vane because that is where the
 * quill is: BOUND TO THE SHAFT. That placement is also why it can be genuinely pale
 * without costing anything — it sits above the label band entirely. Its tone is held
 * inside the vane ladder's AA floor regardless, so the claim never depends on the
 * label staying where it is today.
 * @param {number} lane which fletch
 * @returns {string} an SVG path
 */
function rachis(lane) {
  const xl = lane * LANE - FLETCH.back;
  const xq = lane * LANE + LANE + REACH(lane);
  return `M ${xl} 1.2 L ${xq} 2.8 L ${xq} 5.6 L ${xl} 4.4 Z`;
}

/**
 * THE BAND, painted once behind the three fletch controls.
 *
 * ⚠️ THE PAINT ORDER IS REVERSED, AND THAT IS THE WHOLE SHINGLE. Realm is painted
 * first, then Library over it, then Create over that — so Create's trailing region
 * lies OVER Library's leading edge exactly as the directive says, and the exposed
 * slanted edges step rightward toward Realm. Painting them in reading order would
 * shingle the other way and the cascade would point back at Create.
 *
 * @param {{ id: string, activeLane: number }} props `id` scopes the SVG-local ids so
 *   two bands on one page cannot collide; `activeLane` is the index of the active
 *   fletch, or -1 when none of the three is the current view.
 */
export default function FletchBand({ id, activeLane }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-testid="nav-fletch-band-paint"
      data-active-lane={String(activeLane)}
      viewBox={`0 0 ${BAND_W} ${D}`}
      preserveAspectRatio="none"
      style={{
        // The box is EXACTLY the band. The vanes reach past it in paint only — see
        // the hang note. `overflow` is not a layout property and buys no height;
        // every alternative that reaches below this box does.
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
        width: '100%', height: '100%',
        overflow: 'visible',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <defs>
        {/*
          ONE gradient carrying BOTH tonal stories: it runs diagonally (0,0)→(0.75,1)
          in objectBoundingBox units, so EACH vane maps it to its own box — the paler
          LEADING edge sits at every feather's own origin and the tone darkens toward
          that feather's trailing tip AND its lower edge. Two separate gradients would
          need two layers and would let the two stories drift apart; a feather's
          shading is one fall of light.
        */}
        <linearGradient id={`${id}-vane`} x1="0" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor={FLETCH_LEAD} />
          <stop offset="0.45" stopColor={FLETCH_VANE} />
          <stop offset="1" stopColor={FLETCH_TIP} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        {VANES.map((v, lane) => (
          <clipPath key={lane} id={`${id}-clip-${lane}`}><path d={v.closed} /></clipPath>
        ))}
      </defs>

      {[2, 1, 0].map((lane) => {
        const v = VANES[lane];
        const active = lane === activeLane;
        return (
          <g
            key={lane}
            data-testid={`nav-fletch-vane-${lane}`}
            data-fletch-state={active ? 'active' : 'resting'}
            // ⚠️ THE CONTACT SHADOW — the cue that sells depth, and the reason the
            // laps read as feathers lying on feathers instead of as flat overlapping
            // parallelograms. Because the paint order is reversed, THIS vane's shadow
            // falls on the vane it laps, offset toward the trailing side the way a
            // real feather's would under light from above and ahead. A filter, so it
            // paints outside its own geometry without occupying a box.
            //
            // TWO shadows, not one, and they are doing different jobs: a TIGHT dark
            // one right at the edge (the contact — where the two vanes actually
            // touch, light cannot get in at all) and a WIDE soft one further out (the
            // ambient occlusion that says the upper feather stands off the lower).
            // One shadow can be tight or soft; it cannot be both, and a single soft
            // shadow between two nearly-tonal feathers reads as a smudge rather than
            // as contact.
            style={{
              filter: `drop-shadow(1.5px 0.5px 0.9px ${FLETCH_SHADOW})`
                + ` drop-shadow(5px 3px 5px ${FLETCH_SHADOW})`,
            }}
          >
            <path d={v.closed} fill={`url(#${id}-vane)`} />
            <g clipPath={`url(#${id}-clip-${lane})`}>
              {/* The sheen first, the barbs over it: light falls on the vane, and the
                  barbs ARE the vane. Painted the other way round the comb would
                  vanish wherever the light was, which is where it should read most. */}
              <g filter={`url(#${id}-soft)`} data-testid={`nav-fletch-sheen-${lane}`}>
                {SHEENS[lane].map((d) => (
                  <path key={d} d={d} fill={active ? FLETCH_SHEEN_LIFT : FLETCH_SHEEN} />
                ))}
              </g>
              {barbBuckets(lane).map((d, bucket) => (
                <path
                  key={bucket}
                  d={d}
                  data-testid={`nav-fletch-barbs-${lane}-${bucket}`}
                  fill="none"
                  stroke={FLETCH_BARB}
                  // The jitter's second channel: three brightness/weight buckets, so
                  // the comb has depth instead of reading as one flat screen. Weight
                  // stays sub-pixel-to-hairline at every bucket — under the BALANCE
                  // LAW the comb is texture, never a set of bars.
                  strokeOpacity={[0.5, 0.76, 1][bucket]}
                  strokeWidth={[0.7, 1, 1.25][bucket]}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <path d={rachis(lane)} data-testid={`nav-fletch-rachis-${lane}`} fill={FLETCH_RACHIS} />
              {active && (
                // THE GOLD, TRANSLATED — not a rectangle across the cell but a stroke
                // along the vane's OWN lower silhouette, so it follows the rounded
                // back and the leading rise. The clip halves the stroke, which is why
                // it is authored at double width: what survives is the 2px inside.
                <path
                  d={v.lower}
                  data-testid={`nav-fletch-edge-${lane}`}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="4"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
            {/* ⚠️ THE EDGE-LIGHT — the second depth cue, and it rides OUTSIDE the clip
                on purpose: it is the lit rim of this feather's own silhouette, so half
                its width must fall on whatever lies behind. A whisper only (the
                BALANCE LAW): one hairline at low opacity on each exposed slanted edge,
                the leading taper and the trailing back. Any heavier and the vanes read
                as outlined shapes, which is the badge failure this band was cut out
                of. */}
            <path d={v.lead} fill="none" stroke={FLETCH_RACHIS} strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d={v.trail} fill="none" stroke={FLETCH_RACHIS} strokeOpacity="0.38" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
    </svg>
  );
}

export {
  BAND, BAND_W, D, LANE, REACH, SHEENS, SHEEN_FLOOR, VANES, barbBuckets, lean,
  rachis, unitHash, vane, FLETCH_HANG,
};
