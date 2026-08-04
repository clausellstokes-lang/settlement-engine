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
 *      deepens. The silhouette says nothing at all except which way the row is swept.
 *
 * ⚠️⚠️⚠️ THE FEATHER SURFACE (lane FS, 2026-08-03 night) — WHY THE MATERIAL WAS
 * REBUILT, AND IT IS THE ONE THING THE PREVIOUS CUT GOT WRONG.
 *
 * The PB verifier's eye verdict was unambiguous: at 1440x900 the band read as
 * CORRUGATED METAL or a slatted shutter, not as goose fletching. Every mechanical
 * claim held — the geometry, the z-order, the seam-freedom, the hang, the AA — and the
 * composition still failed, because the MATERIAL failed. Four causes were measured and
 * all four are cured here, each beside its cure:
 *
 *   (1) THE COMB WAS STRIPES, NOT TEXTURE. Measured: "barbGap 4.1 viewBox units = 3.6
 *       CSS px with strokes at 0.7/1.0/1.25px non-scaling → up to ~35% areal
 *       coverage". The BALANCE LAW had been honoured in TONE and ignored in AREA, and
 *       the eye integrates tone × area. CURE: the comb stops being the material. The
 *       vane's body is now smooth layered tonal gradation — a four-stop fall that
 *       HOLDS the mid tone across the label band and concentrates the darkening in the
 *       tip — and the comb becomes a near-subliminal whisper over it: gap 6.6 units,
 *       weights 0.3/0.4/0.5px, opacities 0.11/0.17/0.24, further faded toward the tip
 *       by a mask. That is ~6.9% areal coverage and ~1.2% effective ink against the
 *       previous ~35%. See COVERAGE below, which computes it rather than claiming it.
 *
 *   (2) PERIODICITY. Measured: "SHEENS are authored at IDENTICAL offsets in every lane
 *       (x0+6 w20, x0+42 w28, x0+80 w15), so all three cells carry the same three
 *       bright blobs in the same places; the barb hash varies per lane but the sheen —
 *       the loud channel — does not". CURE: the sheen bands' positions AND widths are
 *       now drawn per lane from the same integer hash the comb uses, and the comb's
 *       nominal gap is scaled per lane too (`laneGap`), so no two cells share a
 *       spacing. ⚠️ THE ANGLE IS DELIBERATELY NOT VARIED — see the one-lean law below;
 *       the comb, the cut and the sheen leaning by one number is what makes a lap read
 *       as a barb line instead of a cut, and that law outranks the periodicity cure.
 *
 *   (3) THE SILHOUETTE SAID NOTHING. Measured: "all three cells terminate at y=76, so
 *       the composited band is an exact rectangle with a ruler-straight bottom — a
 *       fletching's most recognisable feature is its ragged lower edge and there is
 *       none". CURE, AND IT IS DELIBERATELY NOT A SILHOUETTE EDIT: the owner's own
 *       correction forbids torn or complex cell shapes, so the quad stays a quad and
 *       the ruler line is broken by MATERIAL instead — `frayHairs`, a handful of FREE
 *       BARB TIPS per cell escaping past the cut, which is exactly what a bound fletch
 *       shows in life. The composited lower boundary is no longer straight; the clip,
 *       the gold underline and every geometry pin are untouched.
 *
 *   (4) THE RACHIS WAS ONE RAIL. Measured: "the rachis renders as one continuous pale
 *       rail across the top of the whole band rather than three quills". CURE: each
 *       quill now starts inside its OWN lane and stops short of the next division, at
 *       a per-lane height, so the band carries three tapering quills with real breaks
 *       between them instead of a single pale rule.
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
 * uniform, and what you see at reading distance is a SMOOTH DARK VANE with two or
 * three broad gentle SHEEN BANDS, a pale rachis, a paler leading edge, and a soft
 * darkening toward the trailing tip. The fine barb striations are there, combed
 * diagonally off the rachis, but they are a whisper you notice on inspection — never
 * the thing you see first. There is no barring anywhere, and that is not only accuracy
 * — it is what lets three labels sit on three feathers and still read as words.
 *
 * ⚠️ THE COMB, THE CUT AND THE SHEEN ALL LEAN BY ONE NUMBER. `FLETCH.barbRun` is the
 * horizontal run a mark makes over the vane's full depth, and the quad's two slanted
 * edges use exactly it. That is what makes the lap boundary read as a barb line rather
 * than as a cut across the grain — and it is why a single constant now buys the comb,
 * the shingle, the sheen lean and the sweep. It is also why cause (2)'s angle
 * variation was REFUSED: two leans maintained separately is how a feather stops
 * looking like one feather.
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
 * can stay opaque and computable. The same argument covers the comb's fade mask: a
 * mask can only REMOVE ink, and removing dark ink can never make the ground lighter
 * than the sheen it lies on.
 */
import {
  CHROME, FLETCH, FLETCH_BARB, FLETCH_HANG, FLETCH_LEAD, FLETCH_RACHIS,
  FLETCH_SHADOW, FLETCH_SHEEN, FLETCH_SHEEN_LIFT, FLETCH_TIP, FLETCH_VANE, GOLD,
  contactShadow, dropShadow,
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
 * ⚠️ THE BAND'S MEASURED SCALE — a RECEIPT, not a derivation, and it exists so the
 * coverage budget below can be stated in the units the eye works in.
 *
 * The band is stretched by `preserveAspectRatio="none"`, so one viewBox x-unit is some
 * number of CSS px that depends on the cluster's laid-out width. Measured in Chrome at
 * 1440x900 on this lane: the cluster is 264.53 CSS px wide against a 300-unit viewBox,
 * so one unit is 0.8818 px. jsdom has no layout and cannot re-derive this, which is
 * exactly why it is recorded here beside the number it is used to compute.
 *
 * ⚠️ IT IS THE WIDEST CASE, AND THE COVERAGE BUDGET IS THEREFORE OPTIMISTIC IN THE
 * SAFE DIRECTION ONLY IF THE BAND GROWS. Barb strokes are `non-scaling-stroke`, so
 * their width is CSS px regardless; the GAP is in viewBox units and scales. A NARROWER
 * viewport compresses the gap and raises coverage — at the 640px desktop breakpoint
 * the cluster measures about 200px (0.667 px/unit), which lifts the comb from 6.9% to
 * about 9.1%. Both numbers are quoted in the pin rather than one of them hidden.
 */
const BAND_PX_PER_UNIT = 0.8818;

/**
 * ⚠️ THE COMB'S WEIGHTS AND OPACITIES, AND THEY ARE THE CURE FOR CAUSE (1).
 *
 * Three buckets, dimmest first. The previous cut used 0.7/1.0/1.25px at
 * 0.5/0.76/1.0 opacity over a 3.6px gap — up to ~35% areal coverage, which is a
 * slatted shutter no matter how near-tonal the ink is. These weights are sub-pixel to
 * hairline at a whisper of opacity, which renders as a faint smooth veil rather than
 * as a set of lines: at 0.3px a stroke cannot occupy a whole device pixel and the
 * rasteriser resolves it as partial coverage, which is precisely the "reads as sheen,
 * not as stripes" behaviour the reference asks for.
 */
const BARB = Object.freeze({
  widths: Object.freeze([0.32, 0.42, 0.52]),
  opacities: Object.freeze([0.13, 0.2, 0.27]),
});

/**
 * THE COMB'S AREAL COVERAGE, COMPUTED — the number cause (1) was measured in, so the
 * cure is checkable rather than assertable.
 *
 * @param {number} [pxPerUnit=BAND_PX_PER_UNIT] the band's measured x-scale
 * @returns {{ areal: number, ink: number }} areal = stroke width over gap; ink weights
 *   that by opacity, which is what the eye integrates at arm's length.
 */
function combCoverage(pxPerUnit = BAND_PX_PER_UNIT) {
  const gapPx = FLETCH.barbGap * pxPerUnit;
  const meanW = BARB.widths.reduce((a, b) => a + b, 0) / BARB.widths.length;
  const meanO = BARB.opacities.reduce((a, b) => a + b, 0) / BARB.opacities.length;
  return { areal: meanW / gapPx, ink: (meanW * meanO) / gapPx };
}

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
 * its y range runs from above the quill to well past BAND so the vanes hang free, the
 * free barb tips fray below the cut, and the contact shadows are not sheared off at
 * the bottom. Clipping y here would undo the whole `overflow: visible` mechanism in
 * one attribute.
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
 * It is now also the source of every PER-LANE variation (cause 2's cure): the sheen
 * positions, the sheen widths, the comb's nominal gap, the quill's height and the free
 * barb tips all draw from it, so the three cells stop being three copies.
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
 * THE COMB'S NOMINAL GAP FOR ONE LANE — cause (2)'s cure, at the quietest channel.
 *
 * The barb hash already varied per lane, but the SPACING did not: one gap across the
 * whole band, held to within the jitter envelope, is a period the eye can lock onto.
 * Each lane now scales the nominal gap by +/-10%, which is enough that no two cells
 * beat against each other and small enough that the envelope pin below stays a real
 * constraint rather than a formality.
 *
 * @param {number} lane which fletch
 * @returns {number} this lane's nominal barb gap in band units
 */
const laneGap = (lane) => FLETCH.barbGap * (0.9 + 0.2 * unitHash(lane * 53 + 7));

/**
 * THE BARB STRIATIONS for one vane, bucketed by brightness.
 *
 * Three paths rather than ~30, because this renders in the EAGER App.jsx header on
 * every desktop page load and one element per barb would be a hundred nodes of pure
 * decoration. Three buckets is enough to stop the comb reading as one flat screen
 * while keeping the node count at nine for the whole band.
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
  const gap = laneGap(lane);
  const buckets = [[], [], []];
  let x = from;
  for (let k = 0; x < to; k += 1) {
    const bucket = Math.floor(unitHash(k * 7 + lane * 131 + 3) * 3) % 3;
    buckets[bucket].push(`M ${x.toFixed(1)} 0 L ${(x + RUN).toFixed(1)} ${BAND}`);
    // The gap wobbles within +/-barbJitter/2 of THIS LANE's nominal value, and never
    // to zero.
    x += gap * (1 - FLETCH.barbJitter / 2 + FLETCH.barbJitter * unitHash(k + lane * 911));
  }
  return buckets.map((m) => m.join(' '));
}

/**
 * THE FREE BARB TIPS — cause (3)'s cure, and it is MATERIAL rather than silhouette.
 *
 * A bound fletch does not end in a drawn line: a few barbs always escape the cut and
 * stand proud of it, which is the single most recognisable thing about a real feather's
 * lower edge. The verifier measured the composited band as "an exact rectangle with a
 * ruler-straight bottom"; these hairs break that line without touching the quad, the
 * clip, the gold underline or one geometry pin, which is what lets the owner's
 * "simple slanted quads" correction stand unamended.
 *
 * They are drawn OUTSIDE the vane's clip on purpose — a tip that escapes the cut is by
 * definition outside it — and they lean by the same RUN as everything else, so they
 * read as continuations of the comb rather than as fringe.
 *
 * @param {number} lane which fletch
 * @returns {string} one path string, all of that cell's escaped tips
 */
function frayHairs(lane) {
  const [x0, x1] = edges(lane);
  const out = [];
  let x = x0 + 4;
  for (let k = 0; x < x1; k += 1) {
    const u = unitHash(k * 37 + lane * 613 + 11);
    // ⚠️ SHORT AND MANY, NEVER LONG AND FEW. The first cut of this ran one hair every
    // 2.4-4.6 gaps at up to 7.8 units of drop, and at 400% they read as stray whiskers
    // or scratches — a handful of isolated straight lines below a ruler edge, which is
    // a worse artefact than the ruler edge was. A frayed edge is a DENSITY, so the
    // spacing is now a little over one comb gap and the drop is a third of what it was.
    const drop = 0.9 + u * 3.1;
    const bx = x + RUN;
    out.push(`M ${bx.toFixed(1)} ${BAND} L ${(bx + lean(drop)).toFixed(1)} ${(BAND + drop).toFixed(1)}`);
    x += FLETCH.barbGap * (1.1 + u * 0.9);
  }
  return out.join(' ');
}

/**
 * A sheen band: a broad parallelogram leaning at the comb angle, from the rachis down
 * to SHEEN_FLOOR. Three per vane — real goose primaries show two or three soft tonal
 * runs, never an even set.
 * @param {number} x the band's leading x at the rachis
 * @param {number} w its width there
 * @returns {string} an SVG path
 */
const sheenBand = (x, w) => {
  const drift = lean(SHEEN_FLOOR);
  return `M ${x} 0 L ${x + w} 0 L ${x + w + drift} ${SHEEN_FLOOR} L ${x + drift} ${SHEEN_FLOOR} Z`;
};

/**
 * THE SHEEN BANDS, THREE PER LANE, PLACED AND SIZED PER LANE — cause (2)'s cure at the
 * LOUD channel, which is where it mattered most.
 *
 * The previous cut authored the identical triple in every lane (x0+6 w20, x0+42 w28,
 * x0+80 w15), so the band's brightest marks repeated on a 100-unit period three times
 * across — and a repeating bright pattern over a repeating comb is what "slatted
 * shutter" means. Each band now takes its offset and its width from the integer hash,
 * inside its own third of the lane so the three still read as separated runs and still
 * sit inside the cell's VISIBLE lane (the last cell has no lap to hide anything in).
 */
const SHEENS = [0, 1, 2].map((lane) => {
  const x0 = lane * LANE - SEAT;
  const slot = (LANE - 8) / 3;
  return [0, 1, 2].map((k) => {
    const at = x0 + 4 + k * slot + unitHash(lane * 47 + k * 13 + 1) * (slot * 0.28);
    const w = slot * 0.35 + unitHash(lane * 71 + k * 29 + 5) * (slot * 0.4);
    return sheenBand(+at.toFixed(2), +w.toFixed(2));
  });
});

/**
 * THE RACHIS — the pale spine the barbs comb off, tapering toward the trailing end the
 * way a real quill does. It rides the top of the vane because that is where the quill
 * is: BOUND TO THE SHAFT. That placement is also why it can be genuinely pale without
 * costing anything — it sits above the label band entirely. Its tone is held inside the
 * vane ladder's AA floor regardless, so the claim never depends on the label staying
 * where it is today.
 *
 * ⚠️ THREE QUILLS, NOT ONE RAIL — cause (4)'s cure. The previous cut ran each quill
 * across its whole quad INCLUDING the lap, so consecutive quills abutted and the band
 * carried a single continuous pale rule along its top: the one mark most likely to say
 * "machined panel". Each quill now starts inside its own lane and stops well short of
 * the next division, at a height drawn from the hash, so there are real breaks between
 * three tapering spines. The outer cells' quills run off under the whipping, which is
 * where a bound quill actually goes.
 *
 * @param {number} lane which fletch
 * @returns {string} an SVG path
 */
function rachis(lane) {
  const a = lane * LANE - SEAT + 3;
  const b = (lane + 1) * LANE - SEAT - 7;
  const y = 0.9 + unitHash(lane * 17 + 5) * 1.5;
  return `M ${a.toFixed(2)} ${y.toFixed(2)} L ${b.toFixed(2)} ${(y + 1.5).toFixed(2)}`
    + ` L ${b.toFixed(2)} ${(y + 2.3).toFixed(2)} L ${a.toFixed(2)} ${(y + 4.1).toFixed(2)} Z`;
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

          ⚠️ FOUR STOPS, NOT THREE, AND THE MIDDLE PAIR ARE THE SAME TONE — cause (1)'s
          cure at the body. With the comb reduced to a whisper the GRADIENT is now the
          material, so it has to behave like one: the mid tone is HELD across the label
          band (0.42 → 0.74) and the fall into the tip is concentrated in the last
          quarter. A three-stop ramp descended linearly through the whole vane, which
          is exactly the "gradient-filled rectangle" read that SHAFT_STOPS avoids for
          the barrel. Holding the mid also makes every AA number steadier: more of the
          vane is literally FLETCH_VANE, the tone the ratios are quoted against.
        */}
        <linearGradient id={`${id}-vane`} x1="0" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor={FLETCH_LEAD} />
          <stop offset="0.42" stopColor={FLETCH_VANE} />
          <stop offset="0.74" stopColor={FLETCH_VANE} />
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
          <stop offset="0.42" stopColor={FLETCH_LEAD} />
          <stop offset="0.74" stopColor={FLETCH_LEAD} />
          <stop offset="1" stopColor={FLETCH_VANE} />
        </linearGradient>
        {/*
          THE COMB'S FADE — the last third of cause (1)'s cure. Barb striations are
          most visible where the light catches the vane and effectively invisible in
          the tip's shadow, so the whisper is faded toward the bottom rather than
          drawn at one strength through the whole depth. A mask can only REMOVE ink,
          so it cannot lighten any ground and the AA ladder is untouched by it.
        */}
        <linearGradient id={`${id}-comb-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.62" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.12" />
        </linearGradient>
        <mask
          id={`${id}-comb-mask`}
          maskUnits="userSpaceOnUse"
          x={-RUN - 12}
          y={0}
          width={BAND_W + RUN * 2 + 24}
          height={BAND}
        >
          <rect
            x={-RUN - 12}
            y={0}
            width={BAND_W + RUN * 2 + 24}
            height={BAND}
            fill={`url(#${id}-comb-fade)`}
          />
        </mask>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4.6" />
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
              // ⚠️⚠️ TWO SHADOWS, AND SINCE LANE FS THEY OBEY THE COMPOSITION'S ONE
              // LIGHT — which took working out, because the naive fix is wrong.
              //
              // The verifier's F4, quoted: "The band's contact shadows are (-1.6,+0.6)
              // and (-5,+3) — down and LEFT, i.e. light from the upper RIGHT... The
              // band's negative-x is load-bearing (the shadow must fall on the cell
              // beneath, which lies to the leading side), so this cannot be fixed by
              // flipping the band; the chair has to choose which element moves."
              //
              // THE CHAIR CHOSE THE BAND, AND THE PHYSICS THEN CHOSE THE MECHANISM. With
              // light from the upper LEFT and a shingle whose z ASCENDS to the right, a
              // cell's cast shadow falls down-and-RIGHT — onto the cell painted after it,
              // therefore over it, therefore invisible. That is not a bug in the fix; it
              // is what an overlapping row lit from the direction it faces actually looks
              // like: the raised rims CATCH the light instead of throwing shadow across
              // the seam. So the two shadows split by KIND rather than by offset:
              //
              //   · the TIGHT one becomes AMBIENT OCCLUSION — `contactShadow`, offset
              //     ZERO. Occlusion in a crevice has no azimuth (see theme.js), so it
              //     shows all round the silhouette including at the leading seam, where
              //     it is the contact cue the cast shadow can no longer supply.
              //   · the WIDE one is the real CAST shadow on the composition's azimuth,
              //     down and to the right. It shows where a cast shadow can show: below
              //     every hanging vane, and to the right of Realm's trailing edge on bare
              //     shaft, which is exactly where the band should look like it stands off
              //     the wood.
              //
              // The seam's third cue is the leading edge-light below, lifted 0.50 → 0.62
              // because under this light the raised leading rims are what the light
              // actually strikes. ⚠️ THAT LIFT IS PAID FOR under the BALANCE LAW by the
              // comb's own collapse from ~35% areal coverage to 7.2% in piece 1 — one
              // device strengthened, another weakened in the same lane.
              style={{
                filter: `${contactShadow(1.1, FLETCH_SHADOW)} ${dropShadow(5.8, 5, FLETCH_SHADOW)}`,
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
                <g mask={`url(#${id}-comb-mask)`} data-testid={`nav-fletch-comb-${lane}`}>
                  {barbBuckets(lane).map((d, bucket) => (
                    <path
                      key={bucket}
                      d={d}
                      data-testid={`nav-fletch-barbs-${lane}-${bucket}`}
                      fill="none"
                      stroke={FLETCH_BARB}
                      // The jitter's second channel: three brightness/weight buckets, so
                      // the comb has depth instead of reading as one flat screen. ⚠️ THE
                      // BALANCE LAW IS NOW SPENT IN AREA AS WELL AS IN TONE — see BARB
                      // and combCoverage above. The comb is texture, never a set of bars.
                      strokeOpacity={BARB.opacities[bucket]}
                      strokeWidth={BARB.widths[bucket]}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
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
              {/* ⚠️ THE FREE BARB TIPS — cause (3)'s cure. Outside the clip because a
                  tip that escaped the cut is outside it by definition; a whisper, like
                  the comb it continues. */}
              <path
                d={frayHairs(lane)}
                data-testid={`nav-fletch-fray-${lane}`}
                fill="none"
                stroke={FLETCH_BARB}
                strokeOpacity="0.3"
                strokeWidth="0.4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* ⚠️ THE EDGE-LIGHT — the second depth cue, and it rides OUTSIDE the clip
                  on purpose: it is the lit rim of this cell's own edge, so half its width
                  must fall on whatever lies behind. A whisper only (the BALANCE LAW): one
                  hairline at low opacity on each slanted edge. The LEADING one is the
                  load-bearing half — it is the exposed lap boundary, the edge that says
                  "this cell is on top of that one" — and the trailing one only ever shows
                  on Realm, where it resolves the band's own end. Any heavier and the
                  cells read as outlined shapes, which is the badge failure this band was
                  cut out of.
                  ⚠️ THE LEADING RIM CARRIES MORE SINCE LANE FS (0.50 → 0.62) because the
                  light now comes from the upper LEFT and a raised leading edge is what it
                  strikes; the cast shadow that used to mark this seam cannot, so the lit
                  rim takes the job. Paid for by the comb — see the shadow note above. */}
              <path d={v.lead} fill="none" stroke={FLETCH_RACHIS} strokeOpacity="0.62" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d={v.trail} fill="none" stroke={FLETCH_RACHIS} strokeOpacity="0.38" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export {
  BAND, BAND_PX_PER_UNIT, BAND_W, BARB, D, LANE, REACH, RUN, SEAT, SHEENS, SHEEN_FLOOR,
  VANES, barbBuckets, combCoverage, frayHairs, laneGap, lean, rachis, unitHash, vane,
  FLETCH_HANG,
};
