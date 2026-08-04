/**
 * FletchBand.jsx — ONE CONTINUOUS FLETCH BAND: three goose vanes, drawn as FULL
 * PARALLELOGRAMS, shingled along the shaft in ONE coordinate space.
 *
 * ⚠️⚠️ THE OWNER'S FINAL CORRECTION (2026-08-03 night) SUPERSEDES EVERY EARLIER
 * BAND BRIEF, AND IT CORRECTS TWO THINGS AT ONCE.
 *
 *   1. THE DIRECTION. The shingle's Z-ORDER ASCENDS INTO REALM. Library's leading
 *      edge laps OVER Create's trailing edge; Realm's laps over Library's. Realm is
 *      topmost, Create bottommost, and every tab therefore reads as FEEDING INTO the
 *      next one: Create → Library → Realm. The previous cut painted the stack the
 *      other way (Create on top), which made the cascade point BACK at Create — the
 *      opposite of the journey the nav describes.
 *
 *   2. THE GEOMETRY. Each cell is a SIMPLE SLANTED QUAD, completely filled with the
 *      goose treatment edge to edge — no complex feather silhouettes, no curved tips,
 *      no tapered leading points, no bellies. The earlier cut spent all four of those
 *      on realism and the shipped bar read as three torn dark tabs with honey wood
 *      showing in the notches between them. A parallelogram cannot grow a notch: two
 *      adjacent quads lean by the SAME run at EVERY depth, so the gap between them is
 *      a constant (FLETCH.lap) rather than something that opens up as the vane
 *      deepens. The material — the barb comb, the rachis, the pale leading edge, the
 *      sheen bands — is what says "feather" now, and the silhouette says nothing at
 *      all except which way the row is swept.
 *
 * ⚠️⚠️ THE SEAT — WHY THE WHOLE BAND IS SHIFTED LEFT BY `SEAT`, AND IT IS NOT A
 * NUDGE. The lap boundaries are SLANTED, so "where is the seam between Create and
 * Library" has a different answer at every depth. The labels are laid out as equal
 * thirds of the band's box, centred at each lane's midpoint, and they are read at ONE
 * depth: the vertical middle of the bar. Drawn without the shift, the seam at that
 * depth sits `lean(D/2)` to the RIGHT of the lane division — which at today's metrics
 * is about 10 screen px, against a cell that has only ~6px of slack around its label.
 * The label would cross its own leading seam and sit half on the cell beneath it, at a
 * different z, with the contact shadow running through the letterforms. `SEAT` is
 * exactly that lean, subtracted from every x, so the seams cross the lane divisions AT
 * THE HEIGHT THE LABELS ARE READ. It is the whole reason a label can be "centred in
 * its cell's calm zone" while the cell is a slanted quad.
 *
 * ⚠️⚠️ WHY THIS IS ONE SVG AND NOT THREE — THE BUG THAT FORCED THE REWRITE, kept
 * because the trap is still live. V3 drew one SVG per nav cell, each `inset: 0` on its
 * own button and stretched to that button's width by `preserveAspectRatio="none"`. The
 * lap was authored in each cell's LOCAL units, so it came out at a different number of
 * screen pixels in every cell — and at a number small enough that the 10px NavDivider
 * seam sitting between two cells outran it. The net fusion was about two pixels: the
 * shipped bar rendered three separate dark tabs with bare honey wood between them.
 * Every structural pin was green throughout, because every pin measured the shapes and
 * none measured the RELATIONSHIP between two of them in the space they actually land
 * in. The band is now ONE SVG spanning the whole cluster, so `FLETCH.lap` is a fixed
 * fraction of `FLETCH.lane` and the shingle is exact by construction at every width.
 *
 * ⚠️⚠️ THE HANG IS PAINT, NEVER LAYOUT — AND IT IS `overflow: visible` THAT KEEPS IT
 * SO. The band is roughly TWICE the bar's height, top-aligned at the quill line, and
 * about half of it hangs below the bar's bottom edge. The obvious ways to buy that — a
 * taller box, `height: calc(100% + Npx)`, a negative `bottom` — ALL spend a layout
 * property, and theme.js derives ANCHOR_OFFSET from CHROME.headerDesktop, so every
 * About / guide / Compendium / dossier in-page anchor in the estate lands on a number
 * this bar must not move. Instead the SVG's box is exactly the band (`inset: 0`), its
 * viewBox is exactly CHROME.headerDesktop units tall so one vertical unit is one
 * pixel, and the quads are simply DRAWN past the bottom at y > headerDesktop with the
 * UA's default `overflow: hidden` lifted. Painting outside your own box costs no box —
 * and it is the ONLY mechanism here that survives the shaft getting thinner, because
 * the hang then deepens for free. tests/components/navFletching.test.jsx pins all
 * three halves: the overflow, the geometry that reaches past the bar, and the absence
 * of any box that spends it.
 *
 * ⚠️ THE SVG IS NEVER THE FOCUSABLE ELEMENT, AND IT IS NOT EVEN INSIDE ONE.
 * `clip-path` clips an element's whole rendering INCLUDING its outline, and a11y.css
 * draws the global focus ring outside the border box, so clipping a cell's own control
 * would silently swallow the keyboard ring while every visual test stayed green. The
 * band is a single aria-hidden decoration layer painted BEHIND the three controls as
 * their sibling; no control, and no ancestor of one, is clipped. (Spelled in prose on
 * purpose: the raw-control ratchet counts JSX tags by source match, so writing the tag
 * name here would spend a unit of the migration budget on a docstring. See
 * tests/lint/rawButtonBaseline.test.js.)
 *
 * THE SPECIES IS STILL GREY GOOSE, and with the silhouette simplified it is now the
 * ONLY thing carrying the material. A turkey primary is boldly BARRED — broad
 * light/dark stripes across the vane. A goose primary is not: it is cooler, more
 * uniform, and what you see is FINE PARALLEL BARB STRIATIONS combed diagonally off a
 * pale rachis, a paler leading edge, a soft darkening toward the trailing tip, and two
 * or three broad gentle SHEEN BANDS. There is no barring anywhere, and that is not
 * only accuracy — it is what lets three labels sit on three feathers and still read as
 * words.
 *
 * ⚠️ THE COMB, THE CUT AND THE SHEEN ALL LEAN BY ONE NUMBER. `FLETCH.barbRun` is the
 * horizontal run a mark makes over the vane's full depth, and the quad's two slanted
 * edges use exactly it. That is what makes the lap boundary read as a barb line rather
 * than as a cut across the grain — and it is why a single constant now buys the comb,
 * the shingle, the sheen lean and the sweep.
 *
 * ⚠️ WHY THE SHEEN BANDS STOP SHORT OF THE LOWER EDGE. SHEEN_FLOOR ends them at 72%
 * of the vane's depth, and that is a CONTRAST guarantee, not a taste: the active
 * vane's gold runs along the vane's own lower edge, and GOLD measures 2.42:1 on the
 * brightened sheen but 4.12:1 on the vane gradient. Letting a band reach the lower
 * edge would put the state-carrying edge under SC 1.4.11's 3:1 floor at whatever x the
 * band happened to cross. Ending them high keeps the edge's ground the vertical
 * gradient alone, which only ever darkens downward.
 *
 * WHY THE SHEEN MAY BE BLURRED AND THE AA CLAIM STILL HOLDS. A blur is a weighted
 * average of its inputs, so it cannot produce a tone lighter than the lightest tone it
 * was given — the lightest pixel on a blurred sheen band is still exactly the sheen
 * tone. The label's AA floor is therefore unchanged by the blur, which is why the tones
 * can stay opaque and computable.
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
/** The horizontal run every slanted mark makes over the vane's full depth. */
const RUN = FLETCH.barbRun;
/** Where the sheen bands stop, short of the lower edge (see the header note). */
const SHEEN_FLOOR = BAND * 0.72;

/** How far a mark leaning at the comb angle drifts over `depth` of vane. */
const lean = (depth) => (depth / BAND) * RUN;

/**
 * SEAT — the lean at the depth the LABELS are read (the bar's vertical middle),
 * subtracted from every x so the slanted seams cross the lane divisions there.
 * See the header note; this is the number that keeps a label off its own seam.
 */
const SEAT = lean(D / 2);

/**
 * ⚠️ THE LAP — HOW FAR EACH CELL REACHES UNDER THE NEXT, AND IT IS THE DIFFERENCE
 * BETWEEN FLETCHING AND BADGES.
 *
 * Three feathers bound along a shaft OVERLAP. Here the overlap is hidden material:
 * cell i's quad runs `FLETCH.lap` PAST its own lane division, and cell i+1 — painted
 * after it, therefore over it — covers exactly that overhang with its own leading
 * edge. So the visible width of every cell is precisely one lane, the visible seam IS
 * cell i+1's leading edge, and there is no depth at which a gap can open: both quads
 * lean by the same run, so their horizontal separation is the constant `FLETCH.lap`
 * at y=0 and at y=BAND alike.
 *
 * THE LAST CELL REACHES UNDER NOTHING. Realm is topmost and has no successor, so its
 * trailing edge is the band's own end and resolves onto the bar.
 */
const REACH = (lane) => (lane === 2 ? 0 : FLETCH.lap);

/**
 * ⚠️⚠️ THE FRAME — WHY THE BAND'S TWO ENDS ARE SQUARE WHILE ALL THREE CELLS ARE
 * PARALLELOGRAMS, AND IT IS THE FIX FOR A DEFECT THE FIRST CUT SHIPPED.
 *
 * A slanted edge cannot end a band cleanly. Wherever the band's OUTER boundary slants,
 * the box it lives in does not: so at one depth the feather falls short of the box and
 * bare honey wood shows through in a triangle (a WOOD GAP INSIDE THE BAND — the exact
 * thing the directive forbids), and at the opposite depth it overshoots and the feather
 * pokes out past its own whipping. The first cut of this file had both, about 10px
 * each, at the trailing top corner and the leading bottom corner.
 *
 * So the outer cells are drawn LONGER than their lanes — `RUN` past the frame at both
 * ends, which is enough to cover the box at every depth — and the whole band is then
 * CLIPPED to its own box horizontally. Every cell stays a true parallelogram, its
 * gradient and its comb are computed on the whole shape, and the band's two ends are
 * square against the wraps that bracket them: "after Realm the band's final trailing
 * edge resolves cleanly onto the bar."
 *
 * ⚠️ THE FRAME IS OPEN VERTICALLY, and that is what keeps the hang. It clips x only;
 * its y range runs from above the quill to well past BAND so the vanes hang free and
 * the contact shadows are not sheared off at the bottom. Clipping y here would undo
 * the whole `overflow: visible` mechanism in one attribute.
 */
const FRAME = `M 0 ${-BAND} L ${BAND_W} ${-BAND} L ${BAND_W} ${BAND * 2} L 0 ${BAND * 2} Z`;

/**
 * The two quill-line x's of one cell's quad — its leading and trailing edges at y=0.
 * The outer cells reach `RUN` past the frame so the clip above always has material to
 * cut, at every depth; the inner boundaries carry the lap.
 * @param {number} lane 0 Create · 1 Library · 2 Realm
 * @returns {[number, number]} leading x, trailing x
 */
function edges(lane) {
  return [
    lane * LANE - SEAT - (lane === 0 ? RUN : 0),
    (lane + 1) * LANE + REACH(lane) - SEAT + (lane === 2 ? RUN : 0),
  ];
}

/**
 * ONE VANE, as a parallelogram in band coordinates.
 *
 * Four points, two of them slanted edges leaning by RUN over BAND of depth. The top
 * edge lies on the quill line (y=0, where the binding is) and the bottom edge at
 * y=BAND, well below the bar. `lower` is the bottom edge alone — what the active gold
 * is stroked along — and `lead`/`trail` are the two slanted edges the edge-light rides.
 *
 * @param {number} lane 0 Create · 1 Library · 2 Realm
 * @returns {{ closed: string, lower: string, lead: string, trail: string }}
 */
function vane(lane) {
  const [x0, x1] = edges(lane);
  return {
    closed: `M ${x0} 0 L ${x1} 0 L ${x1 + RUN} ${BAND} L ${x0 + RUN} ${BAND} Z`,
    // ⚠️ The gold's path is the LOWER EDGE ONLY, deliberately. Stroking the whole
    // closed silhouette ran the gold up both slants and along the quill too, which
    // read as a selected-badge outline rather than as a lit lower edge. Gold on the
    // bottom is a highlight; gold all the way round is a border.
    lower: `M ${x0 + RUN} ${BAND} L ${x1 + RUN} ${BAND}`,
    lead: `M ${x0} 0 L ${x0 + RUN} ${BAND}`,
    trail: `M ${x1} 0 L ${x1 + RUN} ${BAND}`,
  };
}

const VANES = [0, 1, 2].map(vane);

/**
 * ⚠️ THE DETERMINISTIC JITTER — INTEGER ARITHMETIC, NEVER `Math.sin`.
 *
 * A perfectly regular comb reads as machine hatching, not as a feather; a small wobble
 * in barb spacing and in how brightly each barb catches the light is what buys realism
 * for free. But it must be BYTE-IDENTICAL on every render and every machine, so there
 * is no random source here and no transcendental either: `Math.sin` is not required by
 * IEEE-754 to be correctly rounded and engines differ in the last ulp, which would make
 * the comb a cross-engine golden hazard. This is a plain 32-bit integer hash — same
 * bits everywhere, forever.
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
 * every desktop page load and one element per barb would be a hundred and fifty nodes
 * of pure decoration. Three buckets is enough to stop the comb reading as one flat
 * screen while keeping the node count at nine for the whole band.
 *
 * ⚠️ THE COMB RUNS PARALLEL TO THE CELL'S OWN EDGES — same `RUN`, same depth — so a
 * barb reaching the leading seam meets it edge-on instead of crossing it. That
 * alignment is most of what makes a lap read as one feather lying on another.
 *
 * The strokes are `non-scaling-stroke`, which is load-bearing under
 * `preserveAspectRatio="none"`: the band's x-scale is not its y-scale, and a scaled
 * hairline would come out visibly heavier one way than the other.
 *
 * @param {number} lane which fletch
 * @returns {string[]} three path strings, dimmest first
 */
function barbBuckets(lane) {
  const [x0, x1] = edges(lane);
  const from = x0 - 6;
  const to = x1 + 6;
  const buckets = [[], [], []];
  let x = from;
  for (let k = 0; x < to; k += 1) {
    const bucket = Math.floor(unitHash(k * 7 + lane * 131 + 3) * 3) % 3;
    buckets[bucket].push(`M ${x.toFixed(1)} 0 L ${(x + RUN).toFixed(1)} ${BAND}`);
    // The gap wobbles within ±barbJitter/2 of its nominal value, and never to zero.
    x += FLETCH.barbGap * (1 - FLETCH.barbJitter / 2 + FLETCH.barbJitter * unitHash(k + lane * 911));
  }
  return buckets.map((m) => m.join(' '));
}

/**
 * A sheen band: a broad parallelogram leaning at the comb angle, from the rachis down
 * to SHEEN_FLOOR. Three per vane, at widths and positions chosen by eye — real goose
 * primaries show two or three soft tonal runs, never an even set. All three sit inside
 * the cell's VISIBLE lane, so the pattern reads the same on the last cell (which has
 * no lap) as on the first two.
 * @param {number} x the band's leading x at the rachis
 * @param {number} w its width there
 * @returns {string} an SVG path
 */
const sheenBand = (x, w) => {
  const drift = lean(SHEEN_FLOOR);
  return `M ${x} 0 L ${x + w} 0 L ${x + w + drift} ${SHEEN_FLOOR} L ${x + drift} ${SHEEN_FLOOR} Z`;
};
const SHEENS = [0, 1, 2].map((lane) => {
  const x0 = lane * LANE - SEAT;
  return [sheenBand(x0 + 6, 20), sheenBand(x0 + 42, 28), sheenBand(x0 + 80, 15)];
});

/**
 * THE RACHIS — the pale spine the barbs comb off, tapering toward the trailing end the
 * way a real quill does. It rides the top of the vane because that is where the quill
 * is: BOUND TO THE SHAFT. That placement is also why it can be genuinely pale without
 * costing anything — it sits above the label band entirely. Its tone is held inside the
 * vane ladder's AA floor regardless, so the claim never depends on the label staying
 * where it is today.
 * @param {number} lane which fletch
 * @returns {string} an SVG path
 */
function rachis(lane) {
  const [x0, x1] = edges(lane);
  return `M ${x0} 1.2 L ${x1} 2.8 L ${x1} 5.6 L ${x0} 4.4 Z`;
}

/**
 * THE BAND, painted once behind the three fletch controls.
 *
 * ⚠️⚠️ THE PAINT ORDER IS READING ORDER, AND THAT IS THE WHOLE SHINGLE. Create is
 * painted first, then Library over it, then Realm over that — so the Z-ORDER ASCENDS
 * INTO REALM exactly as the owner's correction says, Library's leading edge laps over
 * Create's trailing edge, and each tab reads as feeding into the next. The earlier cut
 * painted 2,1,0 and the cascade pointed backwards.
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
        // The box is EXACTLY the band. The quads reach past it in paint only — see
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
          in objectBoundingBox units, so EACH cell maps it to its own box — the paler
          LEADING edge sits at every feather's own origin and the tone darkens toward
          that feather's trailing end AND its lower edge. Two separate gradients would
          need two layers and would let the two stories drift apart; a feather's
          shading is one fall of light.
        */}
        <linearGradient id={`${id}-vane`} x1="0" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor={FLETCH_LEAD} />
          <stop offset="0.45" stopColor={FLETCH_VANE} />
          <stop offset="1" stopColor={FLETCH_TIP} />
        </linearGradient>
        {/*
          THE ACTIVE CELL'S FILL — the owner's active grammar is a BRIGHTENED CELL,
          so the whole quad steps ONE RUNG UP THE EXISTING LADDER rather than gaining
          a new tone: lead→sheen, vane→lead, tip→vane. ⚠️ THAT IS WHY THE AA CLAIM IS
          UNCHANGED. Every stop here is already a member of the goose ladder that
          tests/design/contrast.test.js measures, and the lightest tone a label can
          land on anywhere on this bar is still FLETCH_SHEEN_LIFT (the brightened
          sheen band painted over this fill), not any stop of it. A brightening built
          from a NEW paler tone would have moved that floor silently.
        */}
        <linearGradient id={`${id}-vane-lit`} x1="0" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor={FLETCH_SHEEN} />
          <stop offset="0.45" stopColor={FLETCH_LEAD} />
          <stop offset="1" stopColor={FLETCH_VANE} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        {VANES.map((v, lane) => (
          <clipPath key={lane} id={`${id}-clip-${lane}`}><path d={v.closed} /></clipPath>
        ))}
        <clipPath id={`${id}-frame`}><path d={FRAME} /></clipPath>
      </defs>

      <g clipPath={`url(#${id}-frame)`} data-testid="nav-fletch-frame">
        {[0, 1, 2].map((lane) => {
          const v = VANES[lane];
          const active = lane === activeLane;
          return (
            <g
              key={lane}
              data-testid={`nav-fletch-vane-${lane}`}
              data-fletch-state={active ? 'active' : 'resting'}
              // ⚠️ THE CONTACT SHADOW — the cue that sells depth, and the reason the
              // laps read as feathers lying on feathers instead of as flat overlapping
              // parallelograms. Because the paint order ascends into Realm, THIS cell's
              // shadow falls on the cell it laps, which lies to its LEADING side — so
              // the offset is NEGATIVE in x. That is not a taste: the barrel is lit from
              // above (SHAFT_STOPS puts the highlight on the top centreline), so a
              // raised leading edge throws its shadow down and back.
              //
              // TWO shadows, not one, and they are doing different jobs: a TIGHT dark
              // one right at the edge (the contact — where the two vanes actually touch,
              // light cannot get in at all) and a WIDE soft one further out (the ambient
              // occlusion that says the upper feather stands off the lower). One shadow
              // can be tight or soft; it cannot be both, and a single soft shadow between
              // two nearly-tonal feathers reads as a smudge rather than as contact.
              style={{
                filter: `drop-shadow(-1.6px 0.6px 0.9px ${FLETCH_SHADOW})`
                  + ` drop-shadow(-5px 3px 5px ${FLETCH_SHADOW})`,
              }}
            >
              <path d={v.closed} fill={`url(#${id}-vane${active ? '-lit' : ''})`} />
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
                  // THE GOLD UNDERLINE — the owner's second active channel, and it rides
                  // the cell's OWN lower edge rather than a rectangle drawn across the
                  // cell, so it hangs below the bar with the feather it belongs to. The
                  // clip halves the stroke, which is why it is authored at double width:
                  // what survives is the 2px inside.
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
                  on purpose: it is the lit rim of this cell's own edge, so half its width
                  must fall on whatever lies behind. A whisper only (the BALANCE LAW): one
                  hairline at low opacity on each slanted edge. The LEADING one is the
                  load-bearing half — it is the exposed lap boundary, the edge that says
                  "this cell is on top of that one" — and the trailing one only ever shows
                  on Realm, where it resolves the band's own end. Any heavier and the
                  cells read as outlined shapes, which is the badge failure this band was
                  cut out of. */}
              <path d={v.lead} fill="none" stroke={FLETCH_RACHIS} strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d={v.trail} fill="none" stroke={FLETCH_RACHIS} strokeOpacity="0.38" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export {
  BAND, BAND_W, D, LANE, REACH, RUN, SEAT, SHEENS, SHEEN_FLOOR, VANES, barbBuckets,
  lean, rachis, unitHash, vane, FLETCH_HANG,
};
