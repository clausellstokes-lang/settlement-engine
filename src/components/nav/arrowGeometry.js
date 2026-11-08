/**
 * components/nav/arrowGeometry.js: THE PAINTED ARROW, AS NUMBERS.
 *
 * THE OWNER'S ORDERS (2026-09-16): "Replace the arrow ribbon entirely with the following
 * image however appropriate. This is the arrow we were trying and failing to create, so I
 * created it. I do not want you to emulate it. I want some copy/cut/cropped/pasted version
 * of this arrow as the header/ribbon of the entire website." And: "The top of the wooden
 * shaft (not the top feather) is where the page starts, so cut off that top feather."
 *
 * So the header is the owner's painting, cut once into a levelled STRIP (2133x182, row 0 is
 * the top of the wooden shaft) and a plain-wood FILLER tile (372x70) cut from the same
 * painting's own ink-free gaps. Nothing here draws an arrow. This module only says where
 * the painting's parts are and how the strip is laid across a page of a given width.
 *
 * Every coordinate below is a STRIP pixel, half-open [x0, x1), and every one was measured
 * from the shipped file's decoded pixels (tests/build/arrowHeaderAssets.test.js re-measures
 * them, so a re-cut of the art reds instead of mislinking a painted word).
 *
 * TWO COMPOSITIONS.
 *   - FULL (viewport 1024 px and wider): nock, feather, logo plate, the six painted words,
 *     the blank brass plate and the arrowhead, in one row across the page.
 *   - COMPACT (narrower): the brand crop (nock, feather, logo plate, first binding), a
 *     stretch of plain wood, and the tail crop (blank plate, right binding, arrowhead). The
 *     painted words leave the header and the bottom bar carries the destinations.
 *
 * HOW A WIDER PAGE IS FILLED. The painting is never stretched. It is cut at columns of plain
 * wood (CUTS) and the gap opened at each cut (a SLOT) is filled with the filler tile. Each
 * slot's filler is painted OPAQUE first, spanning the slot plus its cut's crossfade width
 * (`fe`, FE unless the cut says otherwise) on both sides, and the two painted segments beside
 * it fade to transparent across those overlaps. Two layers that BOTH fade across one zone dip
 * in opacity and show the page through as grey bands (the kit's canvas prototype showed it),
 * so only the painted segments fade. A cut therefore needs `fe` columns of plain, ink-free
 * wood on BOTH sides, and every cut below sits inside a measured WOOD_RUN with that margin.
 * At a slot width of zero the construction reproduces the uncut painting exactly. The
 * painting darkens toward the arrowhead while the filler is one tone, so each slot's filler
 * is toned to the painted wood beside its cut (SLOT_TONE).
 *
 * THE SIX SECTIONS ARE EQUAL (owner, 2026-11-08: "The spacing between the sections
 * ( represented by the banded thread red) are not equally spaced and scales as such can you
 * do that for me?"). A section is the shaft between two consecutive red bindings, 1 to 7,
 * each holding one painted word; the painting's own six run from 121 to 160 columns. Once
 * the page is wide enough to lift every section to the widest one's painted width, the extra
 * width is laid so the six are EQUAL, each section's two slots taking half of its section's
 * share, and they grow together; the blank plate's slot takes one part in seven of the extra
 * (it grows like one section). Below that width the painting is shown uncut: no section can
 * shrink, because the painting is never stretched or cut inside ink.
 *
 * THE FEATHER HIDES ON SCROLL (owner, 2026-09-17): "once we start scrolling, the feather in
 * the arrow turns completely transparent, only to reappear fully if they scroll to the very
 * top." The feather is the strip's columns [0, FEATHER_X1) below the shaft band; the
 * arrowhead's lower barb is not the feather and stays (featherShown, FEATHER_FROM).
 *
 * SCALE (s = CSS px per strip px). JS rather than clamp()/vw: 100vw includes a classic
 * scrollbar, CSS round() is newer than the build target, and the slot and hit mapping is
 * piecewise. The painted extent always ends exactly at the page's clientWidth.
 *
 * Pure: no React, no window, no document. JSDoc-typed.
 *
 * @enforced-by tests/components/arrowGeometry.test.js
 * @enforced-by tests/build/arrowHeaderAssets.test.js
 */

/** The shipped strip, a root-absolute public URL (never a Vite import: it would inline). */
export const ARROW_STRIP_SRC = '/brand/arrow/arrow-strip.webp';
/** The shipped plain-wood filler tile. */
export const ARROW_FILLER_SRC = '/brand/arrow/arrow-filler.webp';

/** Strip canvas, in strip px. */
export const STRIP_W = 2133;
export const STRIP_H = 182;

/**
 * THE SHAFT BAND: rows [0, 68). The shaft's lower anti-aliased edge wanders over rows 66 to
 * 72 (the first row under half alpha is 67 or 68 in most columns). The header box is this
 * band; everything below it is overhang.
 */
export const BAND_H = 68;

/**
 * THE HANG: rows [68, 178). The feather's last row with alpha of 8 or more is 177, so this
 * covers the whole feather, the barb and the shaft's lower edge.
 */
export const HANG_H = 110;

/** The arrowhead's lower barb: alpha of 8 or more ends at row 108, so rows [68, 109). */
export const BARB_HANG_H = 41;

/**
 * THE SEAM BETWEEN THE TWO PAINTED LAYERS. The header draws the band and a sticky layer under
 * it draws the overhang, and the two are separate composited layers. Butted at the band's own
 * bottom row, their clip edges fall between device pixels at fractional device pixel ratios
 * and a row of page ground shows through: measured in Chromium at 1.5 (and, fainter, at 1.25)
 * as a light hairline across the whole arrow, the seam metric's row difference against one
 * unclipped image of the strip reading 85 on the boundary rows against 3 elsewhere. Snapping
 * the band to device pixels did not cure it (layout rounds lengths to 1/64 px first).
 *
 * So the layers OVERLAP, inside the shaft's opaque body: the band draws rows [0, SEAM_BAND_TO)
 * and the hang draws rows [SEAM_HANG_FROM, the end), both at the same page position. On rows
 * 55 to 62 the strip is opaque from the nock to the socket (tests/build/arrowHeaderAssets.test.js
 * pins where it is not: the nock's tip, the socket's notch and the arrowhead's point), so the
 * two layers paint identical opaque wood over each other and each layer's fractional clip row
 * lies over the other's full coverage. The eight rows are at least 2 CSS px at the smallest
 * scale, and the band's anti-aliased lower edge (rows 64 to 72) is drawn once, by the hang.
 * The header BOX is still the full band, BAND_H: every sticky offset reads that.
 */
export const SEAM_HANG_FROM = 55;
export const SEAM_BAND_TO = 63;

/**
 * Row 0 (the page's first row) is opaque wood, alpha 250 or more, across these runs. The
 * gap between them, [1947, 1989), is the painted notch where the arrowhead's upper barb
 * leaves the socket: anti-aliased at its sides and fully transparent across [1962, 1978),
 * by the painting.
 * @type {ReadonlyArray<Readonly<{ x0: number, x1: number }>>}
 */
export const ROW0_OPAQUE = Object.freeze([
  Object.freeze({ x0: 82, x1: 1947 }),
  Object.freeze({ x0: 1989, x1: 2056 }),
]);

/**
 * The filler tile, in strip px (rows [0, 70) of the shaft, opaque through row 62). The
 * chair's re-cut (2026-09-17): the eleven plain-wood runs in painting order, then again in a
 * different order, mirrored, without the bright knot beside binding 7, each row's lighting
 * matched and the column brightness flattened, so it wraps seamlessly and no knot repeats.
 */
export const FILLER_W = 372;
export const FILLER_H = 70;

/** The crossfade width on each side of a cut, in strip px (a cut may name its own `fe`). */
export const FE = 10;

/** The largest scale the arrow takes while there is room to insert wood. */
export const S_MAX = 0.6;

/**
 * The smallest scale at which the painted words stay legible (capitals about 10 CSS px).
 * It sets the switch: 2133 x 0.48 = 1023.8.
 */
export const WORD_FLOOR = 0.48;

/** The viewport width (useIsMobile's breakpoint) from which the FULL arrow shows. */
export const FULL_MIN_VIEWPORT = 1024;

/** Landscape phones: the compact arrow is also capped at this scale. */
export const SHORT_CAP = 0.36;
/** The media query that marks a short (landscape phone) viewport. */
export const SHORT_QUERY = '(max-height: 480px)';

/** The compact arrow's slot is never narrower than this many strip px (times s). */
export const COMPACT_MIN_SLOT = 40;

/**
 * @typedef {{ x0: number, x1: number }} Span
 * @typedef {{ x0: number, x1: number, y0: number, y1: number }} Box
 */

/**
 * The red cord bindings, measured as the columns with four or more dark shaft pixels around
 * each crimson core. The last one is the arrowhead's binding.
 * @type {ReadonlyArray<Readonly<Span>>}
 */
export const BINDINGS = Object.freeze([
  Object.freeze({ x0: 512, x1: 547 }),
  Object.freeze({ x0: 668, x1: 702 }),
  Object.freeze({ x0: 836, x1: 870 }),
  Object.freeze({ x0: 994, x1: 1027 }),
  Object.freeze({ x0: 1187, x1: 1219 }),
  Object.freeze({ x0: 1364, x1: 1397 }),
  Object.freeze({ x0: 1530, x1: 1566 }),
  Object.freeze({ x0: 1889, x1: 1958 }),
]);

/**
 * Plain, ink-free wood along the shaft: maximal runs of columns with no cord pixel and at
 * most one dark pixel (a grain fleck) in rows 4 to 62, where dark means under half the
 * row's median luminance across the shaft. Read off the shipped strip.
 * @type {ReadonlyArray<Readonly<Span>>}
 */
export const WOOD_RUNS = Object.freeze([
  Object.freeze({ x0: 548, x1: 569 }),
  Object.freeze({ x0: 646, x1: 668 }),
  Object.freeze({ x0: 702, x1: 726 }),
  Object.freeze({ x0: 813, x1: 836 }),
  Object.freeze({ x0: 870, x1: 895 }),
  Object.freeze({ x0: 968, x1: 994 }),
  // Compendium's two gaps, 10 and 11 columns wide: narrower than 2 x FE, so each takes a cut
  // with a 5-column crossfade (COMPENDIUM_FE).
  Object.freeze({ x0: 1027, x1: 1037 }),
  Object.freeze({ x0: 1176, x1: 1187 }),
  Object.freeze({ x0: 1219, x1: 1250 }),
  Object.freeze({ x0: 1337, x1: 1364 }),
  Object.freeze({ x0: 1397, x1: 1431 }),
  Object.freeze({ x0: 1503, x1: 1529 }),
  // Binding 7 to the blank plate (the run's last five columns carry the plate's one-pixel tip).
  Object.freeze({ x0: 1566, x1: 1628 }),
]);

/**
 * Compendium's crossfade width: its two plain-wood gaps are 10 and 11 columns, so a cut in
 * each has exactly 5 columns of wood on both sides (about 3 CSS px at S_MAX).
 */
export const COMPENDIUM_FE = 5;

/**
 * THE CUT TABLE (full arrow). Each cut is a column of plain wood with `fe` columns of plain
 * wood on both sides (the crossfade width there). Two per painted word beside its bindings,
 * one before and one after the lettering, so a word's hit region widens by its own slots;
 * Compendium's two sit in its narrow gaps at COMPENDIUM_FE; the last is before the blank
 * plate. The other ten are the columns the kit's canvas prototype rendered seamlessly.
 * @type {ReadonlyArray<Readonly<{ x: number, fe: number }>>}
 */
export const CUTS = Object.freeze([
  Object.freeze({ x: 558, fe: FE }),
  Object.freeze({ x: 657, fe: FE }),
  Object.freeze({ x: 713, fe: FE }),
  Object.freeze({ x: 825, fe: FE }),
  Object.freeze({ x: 881, fe: FE }),
  Object.freeze({ x: 982, fe: FE }),
  Object.freeze({ x: 1032, fe: COMPENDIUM_FE }),
  Object.freeze({ x: 1181, fe: COMPENDIUM_FE }),
  Object.freeze({ x: 1234, fe: FE }),
  Object.freeze({ x: 1350, fe: FE }),
  Object.freeze({ x: 1413, fe: FE }),
  Object.freeze({ x: 1516, fe: FE }),
  Object.freeze({ x: 1596, fe: FE }),
]);

/**
 * SLOT_TONE: the CSS brightness each slot's filler takes, keyed by cut column. The painting
 * darkens toward the arrowhead while the filler is one tone, so an untoned slot reads as a
 * pale patch before the blank plate. Each value is the painted plain wood's mean luma
 * (band rows 6 to 59, across the wood run holding the cut) over the filler tile's median
 * luma: the chair's measurement, re-measured on the shipped pixels by
 * tests/build/arrowHeaderAssets.test.js to within 0.02, so a re-cut of either image reds.
 * The compact arrow's one slot takes its left cut's tone at its left end and its right cut's
 * tone at its right end.
 * @type {Readonly<Record<number, number>>}
 */
export const SLOT_TONE = Object.freeze({
  558: 1.047, 657: 1.027, 713: 1.044, 825: 1.014, 881: 1.035, 982: 1.019, 1032: 1.050,
  1181: 0.975, 1234: 0.994, 1350: 0.955, 1413: 0.981, 1516: 0.923, 1596: 0.802,
});

/**
 * THE COMPACT JOIN. The brand crop ends at column 558 and the tail crop starts at column
 * 1596, both inside wood runs with FE of margin. (A join at column 511, right against the
 * first binding, has five columns of wood to its left and none to its right, so the brand
 * crop carries the first binding and 10 columns of wood.)
 */
export const COMPACT_JOIN = Object.freeze({ left: 558, right: 1596 });

/** The compact arrow's natural width, strip px (the two crops without a slot). */
export const COMPACT_W = COMPACT_JOIN.left + (STRIP_W - COMPACT_JOIN.right);

/** The home control: the nock, feather and logo plate, up to the first binding. */
export const HOME = Object.freeze({ x0: 0, x1: 512 });

/** The logo plate inside HOME, ornament tip to ornament tip (the home control's hover glow). */
export const LOGO_PLATE = Object.freeze({ x0: 128, x1: 505 });

/**
 * THE HOVER GLOW's box: a word's lettering widened by GLOW_PAD columns on each side (still
 * inside its region, and clipped at a cut: glowSpan), or a plate, over band rows GLOW_ROWS.
 */
export const GLOW_PAD = 10;
export const GLOW_ROWS = Object.freeze({ top: 4, bottom: 64 });

/**
 * THE FEATHER. Its hanging pixels lie in columns [19, 464) and reach row 177; from column 475
 * to the barb, nothing below row 68 carries more than the shaft's own anti-aliased edge,
 * which is clear (alpha 0) past row 68 from column 480. So the feather's layer is columns
 * [0, FEATHER_X1) below the band, and the always-drawn hang is everything else.
 */
export const FEATHER_X1 = 480;

/**
 * The feather's layer starts FEATHER_FROM rows down, OVERLAPPING the always-drawn hang's rows
 * [FEATHER_FROM, BAND_H) over the feather's columns, so no row of page ground shows between
 * the two layers while both are shown. It fades in across its first FEATHER_RAMP rows and is
 * whole for the rest of the overlap: the hang's mask edge at BAND_H lands up to a device
 * pixel early (measured in Chromium at 390 px and a device pixel ratio of 3, where a feather
 * still fading at that edge let a light line of page ground through), and four whole rows
 * are more than a device pixel at the smallest scale. Eight rows of overlap are at least
 * 2 CSS px there.
 */
export const FEATHER_FROM = 60;
export const FEATHER_RAMP = 4;

/**
 * The feather shows only while the page is at its very top: scrollY under 1 px (sub-pixel
 * positions count as the top). Anything else, a NaN included, hides it only when it is at
 * least 1 px down.
 * @param {number} scrollY
 * @returns {boolean}
 */
export const featherShown = (scrollY) => !(scrollY >= 1);

/**
 * NAV_HIT: each painted word's control, keyed by its NAV id, from the edge of one binding to
 * the edge of the next. tests/components/arrowGeometry.test.js holds the keys to NAV's ids
 * in NAV's order, so a relabel or reorder in lib/routes.js reds instead of mislinking.
 * @type {Readonly<Record<string, Readonly<Span>>>}
 */
export const NAV_HIT = Object.freeze({
  generate: Object.freeze({ x0: 547, x1: 668 }),
  settlements: Object.freeze({ x0: 702, x1: 836 }),
  realm: Object.freeze({ x0: 870, x1: 994 }),
  compendium: Object.freeze({ x0: 1027, x1: 1187 }),
  gallery: Object.freeze({ x0: 1219, x1: 1364 }),
  'about-what-this-is': Object.freeze({ x0: 1397, x1: 1530 }),
});

/**
 * THE SECTIONS' PAINTED WIDTHS, strip px: NAV_HIT's six regions, binding to binding
 * (121, 134, 124, 160, 145, 133).
 * @type {ReadonlyArray<number>}
 */
export const SECTION_W = Object.freeze(Object.values(NAV_HIT).map((hit) => hit.x1 - hit.x0));

/** The widest painted section: below the width that lifts every section to it, no slot opens. */
export const SECTION_W_MAX = Math.max(...SECTION_W);

/** The mean painted section, 817 / 6 strip px. */
export const SECTION_W_MEAN = SECTION_W.reduce((sum, w) => sum + w, 0) / SECTION_W.length;

/** The parts the extra width is laid in: one per section and one for the blank plate's slot. */
export const PARTS = SECTION_W.length + 1;

/**
 * The extra width, strip px at the scale, that lifts every section to SECTION_W_MAX with the
 * plate taking its part: PARTS x (160 - 817 / 6) = 166.83.
 */
export const EQUAL_EXTRA = PARTS * (SECTION_W_MAX - SECTION_W_MEAN);

/**
 * The slot at each cut of the full arrow, CSS px, for one part of the extra width (`part`)
 * at scale s. Every section's width becomes T = (painted mean) x s + part, so each of its two
 * slots takes (T - painted x s) / 2; the plate's cut (in no section) takes one part.
 * @param {number} part
 * @param {number} s
 * @returns {number[]}
 */
export function fullSlots(part, s) {
  const hits = Object.values(NAV_HIT);
  return CUTS.map(({ x }) => {
    const k = hits.findIndex((hit) => x > hit.x0 && x < hit.x1);
    return k < 0 ? part : (part + (SECTION_W_MEAN - SECTION_W[k]) * s) / 2;
  });
}

/**
 * NAV_WORD: the painted lettering inside each region (Create, Library, Realm, Compendium,
 * Gallery, About), measured as the columns carrying three or more ink pixels.
 * @type {Readonly<Record<string, Readonly<Span>>>}
 */
export const NAV_WORD = Object.freeze({
  generate: Object.freeze({ x0: 569, x1: 646 }),
  settlements: Object.freeze({ x0: 727, x1: 812 }),
  realm: Object.freeze({ x0: 896, x1: 968 }),
  compendium: Object.freeze({ x0: 1037, x1: 1176 }),
  gallery: Object.freeze({ x0: 1250, x1: 1336 }),
  'about-what-this-is': Object.freeze({ x0: 1432, x1: 1502 }),
});

/**
 * A word's hover-glow span, strip px: its lettering widened by GLOW_PAD columns on each side,
 * but never past a cut, so the glow never stretches across a slot. Only Compendium's cuts sit
 * that close (5 columns from its lettering), so only its pad is 5.
 * @param {string} id - a NAV_HIT key
 * @returns {Span}
 */
export function glowSpan(id) {
  const { x0, x1 } = NAV_WORD[id];
  const xs = CUTS.map((c) => c.x);
  return {
    x0: Math.max(x0 - GLOW_PAD, ...xs.filter((x) => x <= x0)),
    x1: Math.min(x1 + GLOW_PAD, ...xs.filter((x) => x >= x1)),
  };
}

/**
 * The lettering's rows: capitals [19, 41), descenders (the y of Library and Gallery, the p
 * of Compendium) down to row 49.
 */
export const WORD_ROWS = Object.freeze({ top: 19, baseline: 41, bottom: 50 });

/**
 * THE ACTIVE PAGE HAS NO MARK ON THE SHAFT (owner, 2026-09-19: "remove that as well", under
 * "revert it back to the way before with no parchment").
 *
 * This module carried two of them in turn and now carries neither. UNDERLINE_ROW with a 2-row
 * PARCH_100 rule came first; the 2026-09-18 review found it invisible (one device pixel at the
 * smallest full-arrow scale), and PLAQUE_ROWS / PLAQUE_PAD replaced it with a ten-row
 * parchment slip at 8.49:1. The owner has since removed the whole idea: the header is the
 * painting, and parchment laid over the shaft is not part of it.
 *
 * So there is no plaque rect in the layout and no constant for one. `aria-current="page"`
 * (components/nav/ArrowHeader.jsx) is the only current-page signal the header emits. The hit
 * regions, the hover/focus glow boxes and the focus ring are unaffected — they are pointer and
 * focus affordances, not a current-page mark.
 */

/** The blank brass plate, ornament tip to ornament tip (the account's home at every width). */
export const PLATE = Object.freeze({ x0: 1623, x1: 1877 });

/** The plate's flat field inside its engraved frame. */
export const PLATE_FIELD = Object.freeze({ x0: 1672, x1: 1833, y0: 11, y1: 51 });

/**
 * The plate's two rivets, inside the flat field's ends.
 * @type {ReadonlyArray<Readonly<Box>>}
 */
export const PLATE_RIVETS = Object.freeze([
  Object.freeze({ x0: 1664, x1: 1679, y0: 25, y1: 37 }),
  Object.freeze({ x0: 1829, x1: 1843, y0: 25, y1: 37 }),
]);

/**
 * THE SLIP: the parchment label's field on the plate, between the rivets and inside the
 * frame, with no engraved line or rivet under it.
 */
export const SLIP = Object.freeze({ x0: 1683, x1: 1825, y0: 13, y1: 49 });

/**
 * THE SLIP'S TYPE SIZE, which is a fact about the PAINTING and so lives with the
 * painting's other numbers (it moved here from components/AccountMenu.jsx, which draws
 * the slip, so a census can execute it without mounting a React tree).
 *
 * ⛔ IT RETURNS 10 ON A PHONE, BELOW THE 12 px CHROME FLOOR, AND THAT IS A REGISTERED
 * EXCEPTION rather than an oversight (ODQ §934.26; the row is in
 * tests/components/publicChromeFloor.census.test.js, where the floor is enforced).
 *
 * The compact arrow's scale is clientWidth / 1135. MEASURED by executing layoutArrow()
 * over the shipped geometry — the slip's CONTENT box, after its 1 px border and 3 px
 * side padding:
 *
 *     cw=320  s=0.2819  font 10  32.04 x  8.15 css px
 *     cw=375  s=0.3304  font 10  38.92 x  9.89 css px
 *     cw=391  s=0.3445  font 10  40.92 x 10.40 css px
 *     cw=430  s=0.3789  font 10  45.80 x 11.64 css px
 *
 * A 12 px line at lineHeight 1 needs 12 px of HEIGHT, and the slip is under 12 px tall at
 * every one of those widths; "SIGN IN" at 12 px bold uppercase would want roughly 50 px
 * of the 38.92 available at 375. Raising the type means growing the plate, which means
 * re-cutting the owner's painting, and the header law forbids that. The word keeps the
 * painting's own size; the CONTROL is the whole plate, padded to at least 44 x 44 on a
 * phone (`padTarget`), so the target is usable even where the word is small.
 *
 * @param {number} s the layout's scale (CSS px per strip px)
 * @returns {number} CSS px
 */
export const slipFont = (s) => (s >= 0.55 ? 12 : s >= 0.4 ? 11 : 10);

/**
 * @typedef {{ x: number, y: number, w: number, h: number }} Rect
 * @typedef {{
 *   x: number, w: number, from: number, to: number,
 *   fadeL: number, fadeR: number, coreX: number, coreW: number,
 * }} Segment
 *   x and w: the element's box in CSS px, crossfade overlaps included. from and to: the strip
 *   columns that box shows. fadeL and fadeR: the CSS px of fade at each end (0 for none).
 *   coreX and coreW: the part of the box that is not a crossfade.
 * @typedef {{ x: number, w: number, slot: number, phase: number, toneL: number, toneR: number }} Filler
 *   x and w: the opaque filler's box (the slot plus its cut's fe times s on both sides). slot: the
 *   slot's own width. phase: the tile's horizontal offset in CSS px. toneL and toneR: the
 *   brightness at its left and right ends (equal on the full arrow, SLOT_TONE of its cut).
 * @typedef {{
 *   mode: 'full' | 'compact',
 *   width: number,
 *   s: number,
 *   share: number,
 *   bandPx: number,
 *   hangPx: number,
 *   barbHangPx: number,
 *   stripPx: { w: number, h: number },
 *   fillerPx: { w: number, h: number },
 *   segments: Segment[],
 *   fillers: Filler[],
 *   hits: {
 *     home: Rect,
 *     nav: Record<string, Rect>,
 *     plate: Rect,
 *     slip: Rect,
 *     glow: { home: Rect, nav: Record<string, Rect>, plate: Rect },
 *   },
 *   mapX: (x: number) => number,
 * }} ArrowLayout
 */

/**
 * The strip columns each composition shows, in order, the joins between them, the cut
 * columns on each side of each join (for its tone) and each join's crossfade width.
 * @param {'full' | 'compact'} mode
 * @param {number} share - CSS px per part (full) or the one slot's width (compact)
 * @param {number} s
 * @returns {{ ranges: Array<[number, number]>, slots: number[], joins: Array<[number, number]>, fes: number[] }}
 */
function composition(mode, share, s) {
  if (mode === 'compact') {
    return {
      ranges: [[0, COMPACT_JOIN.left], [COMPACT_JOIN.right, STRIP_W]],
      slots: [share],
      joins: [[COMPACT_JOIN.left, COMPACT_JOIN.right]],
      fes: [FE],
    };
  }
  if (share <= 0) return { ranges: [[0, STRIP_W]], slots: [], joins: [], fes: [] };
  /** @type {Array<[number, number]>} */
  const ranges = [];
  let from = 0;
  for (const cut of CUTS) {
    ranges.push([from, cut.x]);
    from = cut.x;
  }
  ranges.push([from, STRIP_W]);
  return {
    ranges,
    slots: fullSlots(share, s),
    joins: CUTS.map((cut) => [cut.x, cut.x]),
    fes: CUTS.map((cut) => cut.fe),
  };
}

/**
 * The CSS px per part at which the widest word slot is exactly one filler tile, per unit of
 * scale: the narrowest section's slots are the widest, (2 x FILLER_W - (mean - narrowest))
 * per part. (The plate's slot, one part, then stays under two tiles, as its old double share
 * did.)
 */
const TILE_PART = 2 * FILLER_W - SECTION_W_MEAN + Math.min(...SECTION_W);

/**
 * The full arrow's scale and wood per part (one seventh of the extra width), from the page's
 * clientWidth.
 *   - Below (STRIP_W + EQUAL_EXTRA) x S_MAX (1379.9 px): uncut, s = cw / 2133 (so s rises
 *     past S_MAX, to about 0.647, before the slots open: the six sections cannot be equal
 *     without cutting into the widest one's painting).
 *   - Up to (STRIP_W + PARTS x TILE_PART) x S_MAX (4340.9 px): s = S_MAX, and the extra
 *     width is laid so the six sections are equal.
 *   - Above: s grows again so that the widest word slot is exactly one filler tile.
 * @param {number} cw
 * @returns {{ s: number, share: number }}
 */
export function fullScale(cw) {
  const uncutBelow = (STRIP_W + EQUAL_EXTRA) * S_MAX;
  const tiledAbove = (STRIP_W + PARTS * TILE_PART) * S_MAX;
  if (cw < uncutBelow) return { s: cw / STRIP_W, share: 0 };
  if (cw <= tiledAbove) return { s: S_MAX, share: (cw - STRIP_W * S_MAX) / PARTS };
  const s = cw / (STRIP_W + PARTS * TILE_PART);
  return { s, share: TILE_PART * s };
}

/**
 * The compact arrow's scale and slot width.
 * @param {number} cw
 * @param {boolean} short - true on a short (landscape phone) viewport
 * @returns {{ s: number, share: number }}
 */
export function compactScale(cw, short) {
  const cap = short ? Math.min(S_MAX, SHORT_CAP) : S_MAX;
  const s = Math.min(cap, cw / (COMPACT_W + COMPACT_MIN_SLOT));
  return { s, share: cw - COMPACT_W * s };
}

/**
 * Lay the strip across a page.
 *
 * @param {{ clientWidth: number, full: boolean, short?: boolean }} input
 *   clientWidth: the page's clientWidth in CSS px (never 100vw). full: true from
 *   FULL_MIN_VIEWPORT. short: the SHORT_QUERY flag (read by the compact arrow only; a short
 *   desktop window keeps the full arrow's word floor).
 * @returns {ArrowLayout}
 */
export function layoutArrow({ clientWidth, full, short = false }) {
  const width = Math.max(0, Number.isFinite(clientWidth) ? clientWidth : 0);
  /** @type {'full' | 'compact'} */
  const mode = full ? 'full' : 'compact';
  const { s, share } = full ? fullScale(width) : compactScale(width, short);
  const { ranges, slots, joins, fes } = composition(mode, share, s);

  /** @type {Segment[]} */
  const segments = [];
  /** @type {Filler[]} */
  const fillers = [];
  /** @type {number[]} the CSS x where each range's first column lands */
  const starts = [];
  let x = 0;
  ranges.forEach(([a, b], i) => {
    const feL = i > 0 ? fes[i - 1] : 0;
    const feR = i < ranges.length - 1 ? fes[i] : 0;
    const fadeL = feL * s;
    const fadeR = feR * s;
    starts.push(x);
    segments.push({
      x: x - fadeL,
      w: (b - a) * s + fadeL + fadeR,
      from: a - feL,
      to: b + feR,
      fadeL,
      fadeR,
      coreX: x,
      coreW: (b - a) * s,
    });
    x += (b - a) * s;
    if (i < ranges.length - 1) {
      const slot = slots[i];
      // A per-slot phase so neighbouring slots do not repeat the same knot at the same place.
      fillers.push({
        x: x - fadeR, w: slot + 2 * fadeR, slot, phase: ((i * 67) % FILLER_W) * s,
        toneL: SLOT_TONE[joins[i][0]], toneR: SLOT_TONE[joins[i][1]],
      });
      x += slot;
    }
  });

  /**
   * Where a strip column lands on the page: its scaled position plus every slot opened at
   * or before it. A column the composition does not show (the compact arrow's middle)
   * lands where the join begins.
   * @param {number} col
   * @returns {number}
   */
  const mapX = (col) => {
    for (let i = ranges.length - 1; i >= 0; i -= 1) {
      const [a, b] = ranges[i];
      if (col >= a) {
        if (col <= b) return starts[i] + (col - a) * s;
        // col lies past this range's end: in the compact gap, or beyond the strip.
        return i === ranges.length - 1 ? width : starts[i] + (b - a) * s;
      }
    }
    return 0;
  };

  /**
   * @param {{ x0: number, x1: number }} span
   * @param {number} y0 - strip row
   * @param {number} h - CSS px
   * @returns {Rect}
   */
  const rect = (span, y0, h) => {
    const left = mapX(span.x0);
    return { x: left, y: y0 * s, w: mapX(span.x1) - left, h };
  };

  const bandPx = BAND_H * s;
  const glowH = (GLOW_ROWS.bottom - GLOW_ROWS.top) * s;
  /** @type {Record<string, Rect>} */
  const nav = {};
  /** @type {Record<string, Rect>} */
  const glowNav = {};
  if (full) {
    for (const [id, span] of Object.entries(NAV_HIT)) nav[id] = rect(span, 0, bandPx);
    for (const id of Object.keys(NAV_WORD)) {
      // A glow clipped at a cut ends where the column before it ends, before the slot.
      const span = glowSpan(id);
      const left = mapX(span.x0);
      glowNav[id] = { x: left, y: GLOW_ROWS.top * s, w: mapX(span.x1 - 1) + s - left, h: glowH };
    }
  }

  return {
    mode,
    width,
    s,
    share,
    bandPx,
    hangPx: HANG_H * s,
    barbHangPx: BARB_HANG_H * s,
    stripPx: { w: STRIP_W * s, h: STRIP_H * s },
    fillerPx: { w: FILLER_W * s, h: FILLER_H * s },
    segments,
    fillers,
    hits: {
      home: rect(HOME, 0, bandPx),
      nav,
      plate: rect(PLATE, 0, bandPx),
      slip: rect(SLIP, SLIP.y0, (SLIP.y1 - SLIP.y0) * s),
      glow: {
        home: rect(LOGO_PLATE, GLOW_ROWS.top, glowH),
        nav: glowNav,
        plate: rect(PLATE, GLOW_ROWS.top, glowH),
      },
    },
    mapX,
  };
}

/**
 * Grow a control's box to a minimum target size: wider symmetrically (kept inside
 * [0, maxX]) and taller downward from the top of the shaft, into the transparent space
 * under the band. For coarse pointers and phones (44 x 44).
 * @param {Rect} r
 * @param {number} min - CSS px
 * @param {number} maxX - the page's width
 * @returns {Rect}
 */
export function padTarget(r, min, maxX) {
  const w = Math.min(Math.max(r.w, min), maxX);
  const left = Math.min(Math.max(0, r.x - (w - r.w) / 2), Math.max(0, maxX - w));
  return { x: left, y: r.y, w, h: Math.max(r.h, min) };
}
