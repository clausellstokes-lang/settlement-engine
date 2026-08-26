/**
 * domain/townMap/fabric/pageChrome.js — ⭐⭐⭐ ⟦CAR-WORDS-2⟧ **THE DRESS PAGE LEARNS TO SPEAK.**
 *
 * ⛔⛔ **THE DEFECT, MEASURED BEFORE A LINE OF THIS FILE EXISTED (REG-F0 F0-31/32/33, ODQ §717).**
 * The judged surface is the PARTITION DRESS PAGE, and at `dea9239d0` it carried **ZERO `<text>`
 * nodes on 18 of 18 leaves** against the legacy folio's **950**. No name, no legend ink, no scale,
 * no quarter labels, no cartouche. A reader of the plate could not tell what settlement it was.
 *
 * ⭐⭐⭐ **THIS IS A RE-WIRING, NOT A TYPOGRAPHY IMPLEMENTATION, AND THE FILE IS SHORT BECAUSE OF
 * IT.** `lettering.js` (§173, ⟦CAR-WORDS⟧) already owns the metric table, the advance walk, the
 * collision boxes, the §195.3 word-dropping ladder, the containment guarantee and the cartouche's
 * typed-bucket vocabulary. Nothing here re-derives any of them. What was missing was never the
 * typesetter; it was **a page for it to set type on**.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ **THE ONE FINDING THIS MODULE IS BUILT AROUND: THE TWO SURFACES DO NOT SHARE A PAGE.**
 *
 * `renderFolio` draws into a FIXED `viewBox="0 0 1000 1000"`. Every chrome constant it owns is
 * written in that space — the cartouche at `(26, 858)` 348×116, the compass at `(918, 84)` r30,
 * the legend at `(674, …)` 300 wide, type at 23 / 10.5 / 8.4 / 7.4 / 7 — and so is
 * `lettering.placeBox`, whose page bounds are the literal `6 … 994`.
 *
 * The dress page is not that page. `projectPage` fits the frame to the settlement's own disc, so
 * the viewBox is WORLD units and MEASURED over the corpus it runs:
 *
 * ```
 *   thorp       197.8 u        metropolis  826.9 u        ← a 4.18× span
 *   origins     x −43.3 (city) … +528.1 (mountain)
 * ```
 *
 * ⛔ So a cartouche drawn at world-unit sizes is **4.18× larger on a thorp than on a metropolis**,
 * and `placeBox`'s `6 … 994` rejects or admits boxes against a page that is not there. Porting the
 * folio's chrome by copying its numbers would have produced exactly the defect the DRESS-FRAME fit
 * exists to forbid: chrome whose size depends on the tier.
 *
 * ⭐⭐ **THE CURE IS ONE TRANSFORM AND IT MAKES EVERY FOLIO CONSTANT CORRECT AGAIN.** The words
 * layer is derived and emitted in PAGE-PX SPACE — a `PAGE_SPAN`-square page, the folio's own — and
 * the whole fragment is wrapped in a SINGLE
 * `<g transform="translate(F.x F.y) scale(F.w/PAGE_SPAN)">`. Inside that group `placeBox`'s
 * `6 … 994` is exactly the page margin again, a 23 px title is 23 px at every tier, and the chrome
 * takes the same share of every plate — the same tier-invariance the frame fit already buys for
 * the drawing, now bought for the words.
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * ⭐⭐⭐ **AND THE QUARTER LABELS ARE RE-ANCHORED, BECAUSE THE OBVIOUS SOURCE IS §710.6's TRAP.**
 * See `anchorQuarters` for the two measurements that forced it: the partition's own `WARD` pieces
 * carry NO geometry and NO name, and **42 of 101 legacy districts (41.6 %) contain ZERO of the
 * partition's drawn masses**. The name is the legacy fabric's (L-REG-29 forbids inventing a
 * toponym); the GEOMETRY is the partition's own drawn ink. That is `anchorStateMarks`' shape, one
 * wave earlier, applied to text.
 *
 * PURITY: pure functions returning strings and plain data. No `Date`, no `Math.random`, no rng, no
 * runtime `atan2`. Nothing here reads or writes the fabric or the partition.
 *
 * ⚠ **STAGE S23, WITH `lettering.js`, AND THAT PLACEMENT IS LOAD-BEARING.** `partitionDress.js` is
 * S22. Had the words gone INSIDE the dress, the import would derive the cross-node edge `S23>S22`
 * — a **new public-order inversion** the stage walker's arm 6 convicts by name. At S23 the read of
 * `lettering.js` is a SAME-NODE read and derives no edge at all, and `allowedImports` is unchanged
 * (`fabricGeometry.js` alone). Every other input — the palette, the scale bar, the drawn-group
 * roster — arrives as PLAIN DATA, which is the discipline `partitionDress` already documents for
 * `losses` and for the same reason.
 */

import { r2, q6, absArea, centroid, convexHull, cosI, sinI, TRIG_N } from './fabricGeometry.js';
import {
  esc, textWidth, emWidth, metricFor, pointInPolygon,
  letteringFragment, cartoucheLines, GENERIC_WORD,
  wardLabelPath, fitLabel, glyphsAlong,
} from './lettering.js';

export const PAGE_CHROME_SCHEMA_VERSION = 1;

/**
 * ⭐ **THE PAGE THE WORDS ARE SET ON.** 1000 is not a new constant: it is `renderFolio`'s own page,
 * restated once here so the folio's chrome geometry and `placeBox`'s margins are read in the space
 * they were authored in. Changing it would silently re-scale every literal below AND
 * `lettering.placeBox`'s bounds, which is precisely why it is named rather than inlined.
 */
export const PAGE_SPAN = 1000;

/** The folio's own chrome geometry, in page px. Carried over verbatim — see the header. */
export const CARTOUCHE = Object.freeze({ w: 348, h: 116, x: 26, y: PAGE_SPAN - 116 - 26 });
export const COMPASS = Object.freeze({ x: 918, y: 84, r: 30 });
export const LEGEND_BOX = Object.freeze({ w: 300, x: PAGE_SPAN - 300 - 26, lead: 13, pad: 18 });

/**
 * ⚠ **THE LEGEND'S ROW CAP, AND IT IS A DECLARED JUDGMENT RATHER THAN A DERIVATION.** The dress
 * draws 27–31 of `DRESS_LEGEND`'s 46 families on a corpus leaf; a key that printed all of them
 * would be a 400 px wall of type down the right third of the plate, which is a legibility defect
 * of its own (§714.1's *drawn, counted and unseeable* seen from the other end). The folio's own
 * legend caps at seven. The cap is stated and the DROPPED count is published in the census.
 *
 * ⛔⛔ **THE ORDER IS THE HARDER HALF, AND THE FIRST SPELLING SHIPPED THE WRONG FOURTEEN.** Taking
 * `DRESS_LEGEND`'s authored order looks neutral and is not: that order is DRAW order, ground
 * first, so the fourteen rows a `town` printed were *the sheet · open tone · the furlong's strips ·
 * water · the water's edge · the way as a gap · square/market/green · the toft tone · the built
 * footprint · two tints per roof · the eaves shadow · the ridge · a hipped end · a lived-in house*
 * — every generic ground on the page and **not one gate, tower, ford, ditch or ruin.** A legend
 * that teaches the paper and omits the gatehouse is `hf61`'s chrome plate with better manners.
 *
 * ⭐⭐ **THE CURE IS A RULE THE PAGE DERIVES ABOUT ITSELF, NOT ONE THIS FILE AUTHORS: ROWS ARE
 * ORDERED BY THE FAMILY'S OWN INK VOLUME, ASCENDING.** `renderFolio`'s legend teaches FEATURES and
 * never GROUNDS, and ink volume is exactly that distinction measured rather than asserted — a
 * ground covers the sheet and a feature is drawn once. MEASURED on `town`: `dress-gates` 233 B,
 * `dress-stairs` 199 B, `dress-marsh` 270 B, `dress-ditch` 332 B, `dress-soilmark` 415 B,
 * `dress-towers` 568 B against `dress-grain` 52,791 B, `dress-street` 35,518 B, `dress-yards`
 * 30,157 B. The marks a reader meets once come first; the sheet-wide grounds fall off the end.
 * ⚠ ONE ROW IS ORDERED "WRONGLY" BY THE RULE AND IT IS LEFT THAT WAY DELIBERATELY: `dress-paper`
 * is a single 99-byte rect over the whole plate, so it sorts first while needing no teaching at
 * all. Special-casing it would be this lane legislating over the authored roster to buy one row;
 * the rule is uniform, the cost is one line of a fourteen-line key, and it is written down here.
 */
export const LEGEND_MAX_ROWS = 14;
/** Type sizes for the key, solved down to this floor before a row is dropped (§195.3's rule). */
export const LEGEND_SIZE_CEIL = 7.2;
export const LEGEND_SIZE_FLOOR = 5.2;

/**
 * ⭐⭐ **A QUARTER MUST BE MADE OF BUILDINGS BEFORE IT CAN BE NAMED.** A district holding two drawn
 * masses is not a quarter on this page, and a label strung across its hull would be a name written
 * over open ground with two houses at the ends of it. Six is the smallest count at which the hull
 * of the masses is a shape rather than a line; a district under it is DROPPED and counted, which
 * is `wardLabelPath`'s own rule that a blank quarter is honest.
 */
export const QUARTER_MIN_MASSES = 6;

/**
 * ⚠⚠ **THE WORDS' OP BUDGET IS A DECLARED CEILING BECAUSE THE DRESS PAGE HAS NO RATION LAW YET, AND
 * SAYING SO IS BETTER THAN INVENTING ONE.** `renderFolio` prices its letters against
 * `OP_CEILING_BY_TIER` — a §628-SIGNED table, moved only by the chair — and that table is the
 * FOLIO's. Nothing in this tree pins the dress page's op or byte ceiling; the 830,000 B metropolis
 * figure this port measures against is chair-held, not source.
 *
 * ⛔ SO THIS IS NOT A RATION AND MUST NOT BE READ AS ONE. It is a REFUSAL BOUND: it exists so the
 * words can never run away with a page, and it is set far above what any leaf spends so it never
 * silently starves one (the failure `renderFolio`'s §19 comment records — a leaf losing EVERY ward
 * label the instant an earlier pass overran). MEASURED over the corpus, the largest spend is 67 on
 * `city`; 400 is the next round figure above six times it. **A signed dress ration is OWED to the
 * port**, and when it lands this constant is what it replaces.
 */
export const WORDS_OP_BUDGET = 400;

/* ═════════════════════════════════════════════════════════════════════════════════════════════
 * 1 · THE PROJECTOR — world ⇄ page px
 * ═════════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐ **THE ONE COORDINATE SEAM, AND IT HAS EXACTLY ONE SPELLING.** §711.6's class — *a numeric
 * field with no declared unit acquires a different unit at every consumer, and nothing ever reds* —
 * is the failure this function exists to make impossible. Every world→page conversion in this
 * module goes through `toPage`; every page→world statement of size goes through `worldPer`. The
 * emitted `transform` is the exact inverse of `toPage`, so a fragment derived in page px and drawn
 * inside that group lands where it was derived.
 *
 * @param {{x:number,y:number,w:number,h:number}} frame the dress page's own `page.frame`, WORLD units
 */
export function pageProjector(frame) {
  const S = PAGE_SPAN / frame.w;                 // page px per world unit
  const k = frame.w / PAGE_SPAN;                 // world units per page px — the exact inverse
  return {
    /** page px per world unit */
    scale: S,
    /** world units per page px — what one page pixel measures on the ground */
    worldPer: k,
    toPage: (p) => [(p[0] - frame.x) * S, (p[1] - frame.y) * S],
    toPageRing: (ring) => ring.map((p) => [(p[0] - frame.x) * S, (p[1] - frame.y) * S]),
    /**
     * ⚠ `q6` AND NOT `r2`. The scale is ~0.2–0.83, and two decimals would round it to a page that
     * is up to 2.5 % wider than the one the fragment was derived on — a drift the eye reads as
     * chrome sliding off the sheet at the small tiers. `q6` is `TOPOLOGY_PLACES`, the estate's own
     * geometry precision, and it is the same rounding the partition's own topology text uses.
     */
    transform: `translate(${q6(frame.x)} ${q6(frame.y)}) scale(${q6(k)})`,
  };
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════
 * 2 · THE QUARTERS, RE-ANCHORED ONTO THE INK THAT IS ACTUALLY DRAWN
 * ═════════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **THE PORT'S SHARPEST FINDING, AND IT REFUTES THE OBVIOUS IMPLEMENTATION TWICE.**
 *
 * ⛔ **FIRST REFUTATION — THE PARTITION HAS NO WARD FACES AND NO WARD NAMES.** The natural reading
 * of the port is *"run `wardLabelPath` against the partition's WARD faces"*. It is not executable.
 * `partitionConstruct.js:466` and `:1620` both mint a ward with `mintPiece(arr, 'WARD', -1, …)` —
 * **face id −1** — so `arr.faces[faceId].piece = id` never runs and a WARD piece owns NO FACE and
 * NO GEOMETRY; it is a hierarchy node that BLOCK and PLOT hang off. MEASURED over the corpus:
 * **1–2 WARD pieces per leaf**, the root one carrying `name: null` (*"name-rights are EARNED at a
 * tier threshold"*) and `mintQuarter` setting no name at all. There is nothing there to letter.
 *
 * ⛔⛔ **SECOND REFUTATION — AND THIS IS THE ONE THAT WOULD HAVE SHIPPED.** The names DO exist, on
 * the legacy fabric (`fabric.organisms` × `fabric.umbrella.partition`). Labelling from those hulls
 * is one line of code and it is §710.6's trap word for word — *the mark-deriver anchored on the
 * LEGACY fabric while the dress drew the PARTITION*. MEASURED, 18 leaves, FULL arm:
 *
 * ```
 *   42 of 101 legacy districts (41.6 %) contain ZERO of the partition's drawn masses
 *   town  Government Quarter  area 14,266 → 0 masses     city  Shadows District 25,909 → 0
 *   metropolis Religious Quarter 11,949 → 0              polycentric Religious Quarter 39,937 → 0
 * ```
 *
 * Four names in ten would have been written across empty countryside on the drawing the reader is
 * actually looking at — and every existence census over `<text>` would have passed.
 *
 * ⭐⭐ **THE CURE IS `anchorStateMarks`' SHAPE, ONE WAVE OLD, APPLIED TO TEXT: THE NAME IS LEGACY,
 * THE GEOMETRY IS THE PARTITION'S.** L-REG-29 forbids inventing a toponym, so the name may only
 * come from the fabric. Nothing forbids taking the SHAPE from the ink: a quarter's drawn extent is
 * the convex hull of the page masses that fall inside the district that names it. A district with
 * fewer than `QUARTER_MIN_MASSES` drawn masses is dropped — it has no drawn quarter to name — and
 * the drop is counted rather than silent.
 *
 * ⚠ THE HULL IS A HULL AND NOT THE QUARTER'S TRUE OUTLINE, and saying so is the point: what it
 * BUYS is that the label path is clipped (`clipRunToPolygon`, inside `wardLabelPath`) to a region
 * every one of whose extreme points is a drawn building. The census then asserts the stronger,
 * checkable thing — that every glyph is within a bounded reach of real ink — rather than the
 * weaker thing the hull alone would give.
 *
 * @param {any} page a `PARTITION_PAGE_FRAME` from `projectPage`
 * @param {Array<{organismKey:string, polygon:number[][]}>} districts `fabric.umbrella.partition`
 * @param {(key:string)=>string|null} nameOf resolves an organism key to its name, or null
 * @param {ReturnType<pageProjector>} proj
 */
export function anchorQuarters(page, districts, nameOf, proj) {
  const masses = (page.masses || []).filter((m) => m.ring && m.ring.length >= 3);
  /**
   * ⛔⛔ **THE MASSES ARE CLIPPED TO THE SHEET, AND THE CENSUS FOUND WHY BEFORE ANYONE REASONED IT.**
   * `projectPage` fits the frame to the SETTLEMENT'S OWN DISC (DRESS-FRAME, §702.1), so a page
   * carries masses the frame does not contain — outlying farms, a faubourg past the gate. They are
   * drawn and the viewBox clips them, which is right for the ink and catastrophic for a label: the
   * hull of a district holding one outlying mass reaches off the plate, `clipRunToPolygon` finds
   * the run "inside the quarter", and the name is written on the table the map is lying on.
   * MEASURED on the first census run: `polycentric` put MARKET QUARTER's glyphs at **y = 1,207.6**
   * and `crossing` at **x = 1,020.1** on a 1,000-px page — 13 and 7 glyphs off the sheet.
   * ⭐ THE CLASS: **a containment guarantee is only as good as the polygon it is given**, and a
   * polygon derived from marks the page does not show is not a page polygon.
   */
  const onSheet = (c) => c[0] >= 0 && c[0] <= PAGE_SPAN && c[1] >= 0 && c[1] <= PAGE_SPAN;
  const drawn = [];
  let offSheet = 0;
  for (const m of masses) {
    const ring = proj.toPageRing(m.ring);
    const c = centroid(ring);
    if (!onSheet(c)) { offSheet++; continue; }
    drawn.push({ ring, c });
  }
  const quarters = [];
  const dropped = [];
  for (const d of (districts || [])) {
    const name = nameOf(d.organismKey);
    if (!name || !d.polygon || d.polygon.length < 3) { dropped.push({ key: d.organismKey, why: 'no name or no outline' }); continue; }
    const poly = proj.toPageRing(d.polygon);
    const mine = drawn.filter((m) => pointInPolygon(m.c, poly));
    if (mine.length < QUARTER_MIN_MASSES) {
      dropped.push({ key: d.organismKey, name, masses: mine.length, why: `only ${mine.length} drawn mass(es) — no drawn quarter to name` });
      continue;
    }
    const pts = [];
    for (const m of mine) for (const p of m.ring) pts.push(p);
    const hull = convexHull(pts);
    if (!hull || hull.length < 3) { dropped.push({ key: d.organismKey, name, masses: mine.length, why: 'the drawn masses have no hull' }); continue; }
    quarters.push({
      organismKey: d.organismKey,
      name,
      polygon: hull,
      centroid: centroid(hull),
      area: absArea(hull),
      masses: mine.length,
      /** the masses' own rings, kept so the placement census can ask "is this glyph on ink?" */
      inkRings: mine.map((m) => m.ring),
    });
  }
  // ⭐ AREA-SORTED, because `letteringFragment`'s same-name ladder reads "first seen" as "largest"
  //   and consolidates the smaller of two same-named quarters. Handing it an unsorted list would
  //   silently invert that rule — the ladder would keep the WRONG one of a duplicated name.
  quarters.sort((a, b) => b.area - a.area);
  return {
    quarters,
    dropped,
    massesOnSheet: drawn.length,
    massesOffSheet: offSheet,
    reason: `${quarters.length} quarter(s) anchored on the page's own masses,`
      + ` ${dropped.length} district(s) dropped (${dropped.filter((x) => (x.masses || 0) === 0).length} with no drawn mass at all);`
      + ` ${drawn.length} mass(es) on the sheet, ${offSheet} outside the fitted frame and ignored`,
  };
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════
 * 2b · THE QUARTER NAMES — the shipped typesetter, composed with ONE extra clip
 * ═════════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐ How far from a drawn building a quarter's glyph may sit and still be *on the fabric*, in page
 * px. It is not a taste figure: a page is `PAGE_SPAN` across and a mass on a town leaf spans ~6–20
 * px, so 24 px is one building plus the yard and the street beside it — the width of the gap a
 * name legitimately crosses between two houses of the same quarter.
 *
 * ⚠ **ONE SPELLING, BOTH SIDES.** The producer clips with it and `wordsPlacementCensus` measures
 * with it, through the SAME `inkDistance`. `wordsCensus.mjs` records what the alternative costs:
 * its first spelling reconstructed the metric it was auditing and reported 19 overruns that were
 * not overruns. Two rulers is the defect; one ruler makes the `offInk` arm a REGRESSION arm, and
 * that is stated in the census rather than hidden.
 */
export const INK_REACH = 24;

/** `lettering.js`'s own clutter ladder, in page px — the figures are its, not this file's. */
export const QUARTER_SEPARATION = 150;
export const MAX_QUARTER_LABELS = 4;
export const QUARTER_ROOM_CAP = 108;
export const QUARTER_TRACKING = 1.15;

/**
 * ⛔⛔ **THE CLIP IS DENSIFIED, AND THE CENSUS FOUND OUT WHY WITH ONE GLYPH.** A clip over path
 * VERTICES does not bound the path BETWEEN them, and `glyphsAlong` places each glyph at an
 * ARC-LENGTH position — interpolated inside a segment, not at a vertex. `wardLabelPath`'s arc
 * branch samples a circle at the frozen table's 5.625° step, which on a 230 px radius is a **22.6
 * px gap**, so a glyph could sit half a gap off the ink between two points that were both on it.
 * MEASURED after the first cure: 17 of 18 leaves clean and `metropolis` carrying exactly **one
 * `M` at 37.0 px** — the whole defect, one glyph wide.
 *
 * ⭐ THE CURE IS RESOLUTION, NOT TOLERANCE. Distance-to-a-set is 1-Lipschitz, so a run whose
 * vertices are 1 px apart and all within `INK_REACH` bounds every interior point at
 * `INK_REACH + 0.5` — half a page pixel, which is below the finest raster this estate shoots and
 * below `PAGE_QUANTUM_DECIMALS`' own rounding. ⚠ Widening the census's bound instead would have
 * been the move that makes the number mean nothing; `lettering.js` records the same choice for the
 * clipper's sample count (*"the curve is unchanged, only its resolution"*).
 */
export const INK_GAP = 1;

/** Resample an open polyline so no two consecutive points are more than `gap` apart. */
export function densify(pts, gap) {
  if (!pts || pts.length < 2) return pts || [];
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const d = Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
    const n = Math.max(1, Math.ceil(d / gap));
    for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * (k / n), a[1] + (b[1] - a[1]) * (k / n)]);
  }
  return out;
}

/** Distance from a point to the nearest vertex of any of the quarter's own drawn masses. */
export function inkDistance(p, rings) {
  let best = Infinity;
  for (const ring of rings) {
    for (const v of ring) {
      const d = (v[0] - p[0]) ** 2 + (v[1] - p[1]) ** 2;
      if (d < best) best = d;
    }
  }
  return Math.sqrt(best);
}

/**
 * ⭐⭐⭐ **THE QUARTER NAMES, AND THIS FUNCTION EXISTS BECAUSE `lettering.js` MAY NOT CHANGE.**
 *
 * ⛔⛔ **THE CONSTRAINT IS A DORMANCY CONSTRAINT AND IT IS ABSOLUTE.** `renderFolio.mjs:61` imports
 * `lettering.js`, so ONE byte moved in that module moves the shipped folio corpus and takes this
 * wave's dormancy exit with it (§713.2: *a dormancy claim is a bit claim*). Two defects this
 * lane's own census convicted therefore had to be cured OUTSIDE it:
 *
 *   1 · **`letteringFragment` NEVER PLACES A WARD NAME AGAINST THE CHROME.** It builds `claimed`
 *       from the reserved boxes and consults it for marginalia, captions and neighbour edges — and
 *       the ward block, which runs FIRST, never looks at it and never joins it. MEASURED on this
 *       page: `town`, `siege`, `plague` and `famine` each wrote two glyphs of a quarter name
 *       straight through the cartouche's first metadata line. It is latent on the folio too.
 *   2 · **A HULL IS NOT INK.** `wardLabelPath` clips the run to the polygon it is given, and a
 *       quarter's masses are not convex — `Market Quarter` rings a market VOID and `Common
 *       Residential` sprawls. MEASURED: 14 of 18 leaves put quarter glyphs more than `INK_REACH`
 *       from any drawn building, the worst at **195 px on `highwater`** — a name floating over the
 *       hole in its own quarter, which is §710.6's *"three strokes floating in open country"*
 *       arriving in the words layer.
 *
 * ⭐ SO THE COMPOSITION IS HERE AND EVERY TYPOGRAPHIC DECISION IS STILL `lettering.js`'s:
 * `wardLabelPath` derives the curve (arc of the quarter's own radius, or its principal axis),
 * `fitLabel` runs §195.3's word-dropping ladder, `glyphsAlong` walks the glyphs at the true metric,
 * and `metricFor(true)` is the ⟦CAR-WORDS⟧ advance table. What this function adds is ONE clip —
 * *keep the longest run that is on ink, on the sheet, and clear of the chrome* — and the honest
 * consequence: **a quarter whose name cannot be written on its own buildings loses the name.** That
 * is `wardLabelPath`'s own rule, which says a blank quarter is honest, applied to a stronger
 * predicate.
 */
export function quarterLabels(quarters, reserved, a) {
  const metric = metricFor(true);
  /**
   * ⭐ **THE PAGE CENTRE *IS* THE SETTLEMENT CENTRE, EXACTLY, AND THAT IS A CONSEQUENCE OF THE
   * FRAME FIT RATHER THAN AN APPROXIMATION.** DRESS-FRAME fits the frame to the settlement's own
   * disc: `frame.x = bound.cx − radius` and `frame.w = 2·radius`, so
   * `(bound.cx − frame.x) · PAGE_SPAN/frame.w = radius · PAGE_SPAN/(2·radius) = PAGE_SPAN/2`.
   * The arc branch of `wardLabelPath` curves a quarter's name with the town, and it is curving
   * about the true centre — the test asserts the frame relation this rests on.
   */
  const centre = { x: PAGE_SPAN / 2, y: PAGE_SPAN / 2 };
  const kept = [];
  const takenNames = new Set();
  let duplicates = 0;
  // ⭐ `lettering.js`'s clutter ladder, verbatim: the 150-unit separation, the same-name
  //   consolidation (L-REG-29 forbids inventing a toponym, so the LARGER quarter keeps the name
  //   and the smaller goes unlabelled) and the hard cap of four. `quarters` arrives area-sorted,
  //   so "first seen" IS "largest" and the rule needs no comparison of its own.
  for (const q of quarters) {
    let clash = false;
    for (const k of kept) {
      const dx = k.centroid[0] - q.centroid[0], dy = k.centroid[1] - q.centroid[1];
      if (Math.sqrt(dx * dx + dy * dy) < QUARTER_SEPARATION) { clash = true; break; }
    }
    const nm = String(q.name).toUpperCase();
    if (!clash && takenNames.has(nm)) { clash = true; duplicates++; }
    if (clash) continue;
    takenNames.add(nm);
    kept.push(q);
    if (kept.length >= MAX_QUARTER_LABELS) break;
  }

  const claimed = reserved.slice();
  const rows = [];
  const dropped = [];
  for (const q of kept) {
    const path = wardLabelPath(q, centre, QUARTER_ROOM_CAP, true);
    // ── THE INK CLIP. Longest consecutive run that is on the sheet, on this quarter's own
    //    buildings, and outside every box the chrome has already claimed.
    const ok = (p) => p[0] >= 6 && p[1] >= 6 && p[0] <= PAGE_SPAN - 6 && p[1] <= PAGE_SPAN - 6
      && inkDistance(p, q.inkRings) <= INK_REACH
      && !claimed.some((r) => p[0] >= r.x && p[0] <= r.x + r.w && p[1] >= r.y && p[1] <= r.y + r.h);
    // ⚠ DENSIFIED FIRST — see `INK_GAP`. A clip over vertices does not bound the path between them,
    //   and the glyphs are placed between them.
    const dense = densify(path.pts, INK_GAP);
    let bs = -1, bl = 0, cs = -1, cl = 0;
    for (let i = 0; i < dense.length; i++) {
      if (ok(dense[i])) { if (cs < 0) { cs = i; cl = 0; } cl++; if (cl > bl) { bl = cl; bs = cs; } }
      else { cs = -1; cl = 0; }
    }
    const run = bl >= 2 ? dense.slice(bs, bs + bl) : [];
    if (run.length < 2) { dropped.push({ name: q.name, why: 'no run of its own ink long enough to write along' }); continue; }
    let len = 0;
    for (let k = 1; k < run.length; k++) len += Math.sqrt((run[k][0] - run[k - 1][0]) ** 2 + (run[k][1] - run[k - 1][1]) ** 2);
    const fit = fitLabel(q.name, len, QUARTER_TRACKING, metric);
    if (!fit.text) { dropped.push({ name: q.name, why: `${r2(len)} px of ink will not hold one word at the floor` }); continue; }
    /**
     * ⭐⭐ **THE LABEL RESERVES ITS OWN RUN AT GLYPH GRANULARITY, NOT A BOUNDING BOX — AND THE
     * COARSE SPELLING WAS MEASURED BEFORE IT WAS REPLACED.** A curved name's bounding box is mostly
     * empty: the glyphs sit on a one-glyph-wide ribbon along the curve and the box is the whole
     * rectangle the curve sweeps. Rejecting a label whose BOX touched the chrome dropped names
     * whose GLYPHS were nowhere near it — MEASURED, `town` fell to **one** quarter name of three
     * (`Market Quarter` refused on a box overlap its own run had already cleared) and `crossing`
     * lost `Government Quarter` the same way.
     * ⭐ So the reservation is a chain of glyph-sized cells along the run itself, sampled at the
     * type size, which is exactly the footprint `glyphsAlong` will ink. The next quarter's `ok()`
     * predicate then refuses the same points at the same resolution — one granularity, both
     * directions — and no name is refused for room it does not occupy.
     * ⚠ The BOUNDING box is still published on the row, because that is the right conservative
     * shape for the MARGINALIA to avoid: a note is set in the margin in horizontal lines and has
     * no business anywhere the name sweeps.
     */
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of run) {
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    }
    const box = { x: x0 - 2, y: y0 - fit.size, w: (x1 - x0) + 4, h: (y1 - y0) + fit.size * 1.4 };
    const step = Math.max(1, Math.round(fit.size));
    for (let i = 0; i < run.length; i += step) {
      claimed.push({ x: run[i][0] - fit.size * 0.6, y: run[i][1] - fit.size, w: fit.size * 1.2, h: fit.size * 1.4 });
    }
    rows.push({ name: q.name, fit, run, along: path.along, box, masses: q.masses });
  }

  const body = rows.length
    ? `<g id="page-wardlabels" font-family="${SERIF}" fill="${a.palette.labels}" text-anchor="middle"`
      + ` paint-order="stroke" stroke="${a.palette.roads}" stroke-width="2" stroke-linejoin="round">`
      + rows.map((row) => `<g data-along="${row.along}" data-cite="${esc(row.name)}" font-size="${r2(row.fit.size)}">`
        + glyphsAlong(row.run, row.fit.text, row.fit.size, QUARTER_TRACKING, metric) + '</g>').join('')
      + '</g>'
    : '';
  return {
    fragment: body,
    rows,
    dropped,
    duplicates,
    considered: kept.length,
    ops: rows.reduce((n, r) => n + r.fit.text.length, 0),
    reason: `${rows.length} quarter name(s) written on their own buildings of ${kept.length} considered`
      + ` (${quarters.length} anchored, ${duplicates} same-name consolidated, ${dropped.length} dropped:`
      + ` ${dropped.map((d) => `${d.name} — ${d.why}`).join('; ') || 'none'})`,
  };
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════
 * 3 · THE LEGEND — the leaf's own drawn families, in the leaf's own ink
 * ═════════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐ **THE SWATCH IS THE PAGE'S OWN INK, LIFTED — NOT A SAMPLE RE-DRAWN BESIDE IT.** `renderFolio`
 * states the law and then hand-draws seven swatches to satisfy it: *"a legend whose sample does not
 * match the page teaches the wrong thing, which is worse than no legend."* Hand-drawing 30 samples
 * is 30 chances to drift.
 *
 * ⛔ **AND THE PAGE CANNOT SUPPLY A GEOMETRIC SAMPLE, WHICH WAS MEASURED BEFORE THIS WAS DECIDED.**
 * The dress emits ONE BATCHED element per family — measured on `town`, **28 of 30 drawn groups
 * contain a single `<path>`**, `dress-fields` being every field ring in one `d=`. There is no
 * per-instance geometry to clip a true sample out of, and a thumbnail of a whole-page path is the
 * *drawn, counted and unseeable* failure by construction.
 *
 * ⭐ SO THE SHAPE IS STANDARD AND THE **INK IS THE PAGE'S**: this extractor reads the family's own
 * presentation attributes off the leaf's own markup, and the swatch is drawn with them. A row's
 * colour, weight, dash and opacity therefore CANNOT disagree with the mark it names — the census
 * asserts the equality — and only the outline of the sample is this file's.
 *
 * ⛔⛔ **AND THE WINDOW IS UNBOUNDED, WHICH THE FIRST SPELLING GOT WRONG AND THE CENSUS CAUGHT.**
 * That spelling read a fixed 4,000-byte window off the group's head, because "the first element's
 * attributes are near the top" is true of the TAG and false of the ELEMENT: a batched family's
 * `d="…"` runs to 53 KB on `dress-grain`, so the closing `>` fell outside the window, the regex
 * matched nothing, and the swatch was silently omitted. MEASURED on the first run: **3 of 30
 * families matched on `town`, 1 of 31 on `city`** — and every row still printed, so only the
 * `legendInkMatched` count said so. ⭐ THE CLASS, and it is this programme's own: **a fixed window
 * over variable-length data fails silently and in the direction that looks like success.**
 *
 * @param {string} svg the leaf's finished dress markup
 * @param {string} group a `dress-*` id
 * @returns {{ fill:string|null, stroke:string|null, width:string|null, dash:string|null,
 *             fillOpacity:string|null, strokeOpacity:string|null, bytes:number }|null}
 */
export function groupInk(svg, group) {
  const tag = `<g id="${group}">`;
  const open = svg.indexOf(tag);
  if (open < 0) return null;
  const close = svg.indexOf('</g>', open);
  const bytes = close < 0 ? svg.length - open : close + 4 - open;
  // the first drawable child of the group — the one element the family batches into
  const elStart = /<(?:path|rect|circle|line|polygon)\b/.exec(svg.slice(open + tag.length, close < 0 ? undefined : close));
  if (!elStart) return null;
  const from = open + tag.length + elStart.index;
  // ⚠ the next `>` ENDS the tag: none of the dress's attribute values can contain one (they are
  //   numbers, hex colours and path data), so this is exact rather than a heuristic.
  const gt = svg.indexOf('>', from);
  if (gt < 0) return null;
  const attrs = svg.slice(from, gt);
  const at = (n) => {
    const m = new RegExp(`\\s${n}="([^"]*)"`).exec(attrs);
    return m ? m[1] : null;
  };
  const fill = at('fill');
  const stroke = at('stroke');
  return {
    fill: fill === 'none' ? null : fill,
    stroke: stroke === 'none' ? null : stroke,
    width: at('stroke-width'),
    dash: at('stroke-dasharray'),
    fillOpacity: at('fill-opacity'),
    strokeOpacity: at('stroke-opacity'),
    /** the family's own ink VOLUME on this leaf, in bytes — see `LEGEND_MAX_ROWS`' selection rule */
    bytes,
  };
}

/**
 * ⭐ **THE ROW'S WORDS ARE THE AUTHORED ONES, CUT AT THEIR OWN CLAUSE BREAK — NOT PARAPHRASED.**
 * `DRESS_LEGEND.teaches` is written as *"short naming — long explanation"*; the head clause is the
 * naming. Cutting there is a mechanical rule over strings the dress already owns, so this module
 * mints no vocabulary of its own (which would be a lane legislating). MEASURED on `town`: the head
 * clauses run 52 characters at the longest, 28 at the median.
 * ⚠ §195.3's rule still governs what happens when one does not fit: the size is solved down to a
 * floor, then the row loses its GENERIC word, and a row that still will not fit is DROPPED whole.
 * Nothing is ever truncated — half a phrase is a drawing error a reader cannot tell from a phrase.
 */
export function legendPhrase(teaches) {
  const head = String(teaches).split(' — ')[0].split(' (')[0];
  return head.toUpperCase();
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════
 * 4 · THE CHROME FRAGMENT
 * ═════════════════════════════════════════════════════════════════════════════════════════════ */

const SERIF = "Georgia,'Iowan Old Style','Times New Roman',serif";

/**
 * ⭐⭐⭐ **CARTOUCHE + COMPASS + LEGEND + SCALE BAR, IN PAGE PX.**
 *
 * ⚠ **THE SCALE BAR IS THE ONE PIECE WHOSE LENGTH IS NOT A PAGE CONSTANT, AND §711.6 IS WHY THIS
 * PARAGRAPH EXISTS.** `scaleBarFor` returns `drawnUnits` in **WORLD** units, because
 * `measure.metresPerUnit` is metres per world unit. The bar's drawn length in page px is therefore
 * `drawnUnits × proj.scale`, and the caller must have asked `scaleBarFor` for a room expressed in
 * WORLD units too (`roomPx × proj.worldPer`). Two consumers, one field, and the unit is stated at
 * both — which is the whole of §711.6's cure.
 *
 * @param {Object} a
 * @param {any} a.meta `fabric.meta` — name, tier, population, prosperity and the §5.0 members
 * @param {Object} a.palette the resolved ten lens roles
 * @param {{drawnUnits:number,label:string}|null} a.bar a `scaleBarFor` result, WORLD units
 * @param {Array<{group:string,teaches:string}>} a.legendRows the leaf's own drawn legend rows
 * @param {(g:string)=>any} a.inkOf resolves a drawn group to its own presentation attributes
 * @param {ReturnType<pageProjector>} a.proj
 */
export function chromeFragment(a) {
  const { meta: m, palette: P, bar, proj } = a;
  const metric = metricFor(true);
  const out = [];
  const reserved = [];
  const census = { cartoucheLines: 0, legendRows: 0, legendDropped: 0, legendInkMatched: 0, scaleBar: 0, compass: 0, overruns: 0 };

  /* ── THE CARTOUCHE ──────────────────────────────────────────────────────────────────────── */
  const C = CARTOUCHE;
  const elements = P.elements || P.paper;
  const inkTone = P.ink;
  out.push(`<g id="page-cartouche">`);
  out.push(`<rect x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" fill="${elements}" fill-opacity="0.86" stroke="${inkTone}" stroke-width="1.3"/>`);
  out.push(`<rect x="${C.x + 4.5}" y="${C.y + 4.5}" width="${C.w - 9}" height="${C.h - 9}" fill="none" stroke="${inkTone}" stroke-width="0.6"/>`);
  out.push(`<text x="${C.x + 16}" y="${C.y + 33}" font-family="${SERIF}" font-size="23" fill="${P.labels}" letter-spacing="1.1">${esc(m.name)}</text>`);
  // ⭐ THE SAME THREE FACTS `renderFolio.mjs:3035` PRINTS, in the same order and the same words —
  //   a tier, a count of people and a prosperity band are all things a reader can use, which is
  //   why none of them is on `lettering.js`'s engine-vocabulary denylist.
  out.push(`<text x="${C.x + 16}" y="${C.y + 51}" font-family="${SERIF}" font-size="10.5" fill="${inkTone}" letter-spacing="1.5">`
    + `${esc(String(m.tier).toUpperCase())} · ${esc(String(m.population))} SOULS · ${esc(String(m.prosperity).toUpperCase())}</text>`);
  {
    // ⭐⭐ REG-8's CARTOUCHE LANGUAGE, ARMED. The dress page has never printed the untranslated
    //    spelling, so there is no dormant arm to keep here: `cartoucheLines` is the only thing this
    //    surface has ever said, and it says it in words a reader owns.
    const lines = cartoucheLines(m);
    const INNER = C.w - 32;
    const BAND_TOP = 64, BAND_FOOT = 90;
    // ⛔ THE LEADING IS SOLVED FROM THE BAND THE LINES ACTUALLY HAVE, never a constant.
    //    `renderFolio`'s §17 comment claimed a declared constant "stops the next line that gets
    //    added from silently landing on top of something" and it did not — the fourth line landed
    //    on the scale bar's rule. ⟦CAR-WORDS⟧ replaced it with this solve; the port takes the cure,
    //    not the defect it cured.
    const LEAD = lines.length > 1 ? Math.min(14.5, (BAND_FOOT - BAND_TOP) / (lines.length - 1)) : 14.5;
    lines.forEach((t, i) => {
      const fs = Math.max(5.8, Math.min(Math.min(8.4, LEAD - 0.8), (INNER - t.length * 0.9) / emWidth(t, metric)));
      const w = textWidth(t, fs, 0.9, metric);
      if (w > INNER) census.overruns++;
      out.push(`<text x="${C.x + 16}" y="${r2(C.y + BAND_TOP + i * LEAD)}" font-family="${SERIF}"`
        + ` font-size="${r2(fs)}" fill="${inkTone}" letter-spacing="0.9" opacity="0.84">${esc(t)}</text>`);
      census.cartoucheLines++;
    });
  }
  /* ── THE SCALE BAR ──────────────────────────────────────────────────────────────────────── */
  if (bar && Number.isFinite(bar.drawnUnits) && bar.drawnUnits > 0) {
    // ⚠ WORLD → PAGE PX, once, through the projector. See this function's header.
    const drawn = Math.max(24, Math.min(bar.drawnUnits * proj.scale, C.w * 0.42));
    const bx = C.x + C.w - 18 - drawn, by = C.y + C.h - 13;
    let d = `M${r2(bx)} ${r2(by)}L${r2(bx + drawn)} ${r2(by)}`
      + `M${r2(bx)} ${r2(by - 3.4)}L${r2(bx)} ${r2(by + 3.4)}`
      + `M${r2(bx + drawn)} ${r2(by - 3.4)}L${r2(bx + drawn)} ${r2(by + 3.4)}`;
    // the surveyor's quarter division at the left end — the first interval subdivided
    for (let k = 1; k <= 3; k++) d += `M${r2(bx + (drawn / 4) * (k / 4))} ${r2(by - 2)}L${r2(bx + (drawn / 4) * (k / 4))} ${r2(by + 2)}`;
    out.push(`<path d="${d}" stroke="${inkTone}" stroke-width="1.2" fill="none"/>`);
    out.push(`<text x="${r2(bx + drawn / 2)}" y="${r2(by - 5.5)}" font-family="${SERIF}" font-size="7"`
      + ` fill="${inkTone}" text-anchor="middle">${esc(bar.label)}</text>`);
    census.scaleBar = 1;
  }
  out.push('</g>');
  reserved.push({ x: C.x - 2, y: C.y - 2, w: C.w + 4, h: C.h + 4 });

  /* ── THE COMPASS ────────────────────────────────────────────────────────────────────────── */
  {
    const N = COMPASS;
    out.push(`<g id="page-compass">`);
    out.push(`<circle cx="${N.x}" cy="${N.y}" r="${N.r}" fill="${elements}" fill-opacity="0.86" stroke="${inkTone}" stroke-width="0.9"/>`);
    out.push(`<circle cx="${N.x}" cy="${N.y}" r="${r2(N.r * 0.72)}" fill="none" stroke="${inkTone}" stroke-width="0.45"/>`);
    let d = '';
    for (let k = 0; k < 8; k++) {
      // ⚠ THE FROZEN 64-STEP TABLE, as everywhere else in the fabric — a runtime trig call here
      //   would break the cross-machine ULP law `townMapModel.js:17-20` states for the whole estate.
      const ang = Math.round((k * TRIG_N) / 8);
      const rIn = k % 2 === 0 ? N.r * 0.12 : N.r * 0.10;
      const rOut = k % 2 === 0 ? N.r : N.r * 0.55;
      d += `M${r2(N.x + cosI(ang) * rOut)} ${r2(N.y + sinI(ang) * rOut)}`
        + `L${r2(N.x + cosI(ang - 22) * rIn)} ${r2(N.y + sinI(ang - 22) * rIn)}`
        + `L${r2(N.x + cosI(ang + 22) * rIn)} ${r2(N.y + sinI(ang + 22) * rIn)}Z`;
    }
    out.push(`<path d="${d}" fill="${inkTone}" fill-opacity="0.62" stroke="${inkTone}" stroke-width="0.55"/>`);
    out.push(`<text x="${N.x}" y="${N.y - N.r - 7}" font-family="${SERIF}" font-size="13" fill="${P.labels}" text-anchor="middle">N</text>`);
    out.push('</g>');
    reserved.push({ x: N.x - N.r - 6, y: N.y - N.r - 22, w: N.r * 2 + 12, h: N.r * 2 + 28 });
    census.compass = 1;
  }

  /* ── THE LEGEND ─────────────────────────────────────────────────────────────────────────── */
  const rows = [];
  // ⭐ THE ORDER IS THE PAGE'S OWN INK VOLUME, ASCENDING — see `LEGEND_MAX_ROWS` for the
  //   measurement that forced it. A family whose ink cannot be read at all sorts LAST (it has no
  //   swatch to teach with), so a parse failure can never displace a family that does.
  const candidates = (a.legendRows || []).map((row) => ({ row, ink: a.inkOf ? a.inkOf(row.group) : null }));
  candidates.sort((x, y) => {
    const bx = x.ink ? x.ink.bytes : Infinity, by = y.ink ? y.ink.bytes : Infinity;
    return bx === by ? String(x.row.group).localeCompare(String(y.row.group)) : bx - by;
  });
  for (const { row, ink } of candidates) {
    if (rows.length >= LEGEND_MAX_ROWS) { census.legendDropped++; continue; }
    let words = legendPhrase(row.teaches).split(/\s+/).filter(Boolean);
    const INNER = LEGEND_BOX.w - 52;
    const sizeFor = (t) => (INNER - t.length * 0.4) / emWidth(t, metric);
    // §195.3: shrink to the floor, then lose the GENERIC word, then drop the row whole.
    while (words.length > 1 && sizeFor(words.join(' ')) < LEGEND_SIZE_FLOOR) {
      const gi = words.findIndex((w) => GENERIC_WORD.test(w));
      words.splice(gi >= 0 ? gi : words.length - 1, 1);
    }
    const text = words.join(' ');
    if (!text || sizeFor(text) < LEGEND_SIZE_FLOOR) { census.legendDropped++; continue; }
    rows.push({ group: row.group, text, size: Math.min(LEGEND_SIZE_CEIL, sizeFor(text)), ink });
  }
  let legendBox = null;
  if (rows.length) {
    const L = LEGEND_BOX;
    const lh = L.pad + rows.length * L.lead;
    const ly = PAGE_SPAN - lh - 26;
    legendBox = { x: L.x - 2, y: ly - 2, w: L.w + 4, h: lh + 4 };
    out.push(`<g id="page-legend">`);
    out.push(`<rect x="${L.x}" y="${r2(ly)}" width="${L.w}" height="${r2(lh)}" fill="${elements}" fill-opacity="0.86" stroke="${inkTone}" stroke-width="0.9"/>`);
    out.push(`<rect x="${L.x + 3}" y="${r2(ly + 3)}" width="${L.w - 6}" height="${r2(lh - 6)}" fill="none" stroke="${inkTone}" stroke-width="0.35"/>`);
    rows.forEach((row, i) => {
      const y = ly + L.pad - 4 + i * L.lead, kx = L.x + 12;
      // ⭐ THE SWATCH, IN THE FAMILY'S OWN INK. See `groupInk`: the attributes are the page's, the
      //   outline is this file's, and the census asserts the first half.
      const ink = row.ink;
      if (ink) {
        const at = (n, v) => (v == null ? '' : ` ${n}="${v}"`);
        if (ink.fill) {
          out.push(`<rect x="${r2(kx)}" y="${r2(y - 6)}" width="18" height="8" fill="${ink.fill}"${at('fill-opacity', ink.fillOpacity)}`
            + `${ink.stroke ? ` stroke="${ink.stroke}"${at('stroke-width', ink.width)}` : ' stroke="none"'}/>`);
        } else {
          out.push(`<path d="M${r2(kx)} ${r2(y - 2)}L${r2(kx + 18)} ${r2(y - 2)}" fill="none" stroke="${ink.stroke || inkTone}"`
            + `${at('stroke-width', ink.width)}${at('stroke-dasharray', ink.dash)}${at('stroke-opacity', ink.strokeOpacity)}/>`);
        }
        census.legendInkMatched++;
      }
      out.push(`<text x="${r2(kx + 26)}" y="${r2(y)}" font-family="${SERIF}" font-size="${r2(row.size)}"`
        + ` fill="${P.labels}" letter-spacing="0.4" data-cite="${esc(row.group)}">${esc(row.text)}</text>`);
      census.legendRows++;
    });
    out.push('</g>');
    reserved.push(legendBox);
  }

  return {
    fragment: out.join(''),
    reserved,
    legendBox,
    census,
    reason: `page chrome: cartouche (${census.cartoucheLines} metadata line(s), scale bar ${census.scaleBar ? 'drawn' : 'absent'}),`
      + ` compass, ${census.legendRows} legend row(s) of ${(a.legendRows || []).length} drawn family(ies)`
      + ` (${census.legendDropped} dropped, ${census.legendInkMatched} swatch(es) in the page's own ink)`,
  };
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════
 * 5 · THE WHOLE WORDS LAYER, COMPOSED
 * ═════════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **THE FRAGMENT, AND THE ORDER IS `injectFog`'s FOR `injectFog`'s REASON.**
 *
 * `renderFolio.mjs:3206` states it: the chrome is pushed onto the FINISHED draw list, and the
 * letters go last of all, because *"text placement is the one decision that cannot be made until
 * everything else on the page exists"* — a ward name has to know where the cartouche is. So the
 * chrome runs first and hands `letteringFragment` its boxes; the letters place against them.
 *
 * ⛔ AND AN EMPTY FRAGMENT RETURNS THE BASE BYTE-IDENTICAL, which is the clause that makes the
 * whole channel safe: a leaf with nothing to say is bit-for-bit the leaf without this module, so
 * this splice can never be blamed for a byte it did not write.
 *
 * @param {Object} a
 * @param {any}    a.page       the `PARTITION_PAGE_FRAME` the dress drew
 * @param {any}    a.meta       `fabric.meta`
 * @param {Object} a.palette    the resolved ten lens roles
 * @param {Array}  a.districts  `fabric.umbrella.partition`
 * @param {Function} a.nameOf   organism key → name
 * @param {any}    a.bar        a `scaleBarFor` result in WORLD units, or null
 * @param {Array}  a.legendRows the leaf's own drawn `DRESS_LEGEND` rows
 * @param {Function} a.inkOf    drawn group → its own presentation attributes
 * @param {Array}  a.notes      `fabric.immersion.notes.notes`, or []
 * @param {number} a.budget     ops left under the ceiling — chrome is not exempt (§12)
 */
export function pageWords(a) {
  const proj = pageProjector(a.page.frame);
  const chrome = chromeFragment({
    meta: a.meta, palette: a.palette, bar: a.bar, legendRows: a.legendRows, inkOf: a.inkOf, proj,
  });
  const anchored = anchorQuarters(a.page, a.districts, a.nameOf, proj);

  /**
   * ⭐ THE QUARTER NAMES — `quarterLabels`, which composes `lettering.js`'s own typesetter with the
   *   ink clip. See that function for the two defects it exists to cure and why neither could be
   *   cured in `lettering.js` itself.
   * ⚠ THE GATE IS THE FABRIC'S OWN `meta.wardLabels`, carried through rather than forced true, so
   *   the tier law that decides whether a leaf names its quarters still decides.
   */
  const wards = a.meta.wardLabels
    ? quarterLabels(anchored.quarters, chrome.reserved, { palette: a.palette })
    : { fragment: '', rows: [], dropped: [], duplicates: 0, considered: 0, ops: 0, reason: 'this tier does not name its quarters (meta.wardLabels)' };

  /**
   * ⭐⭐ **THE MARGINALIA GO THROUGH THE SHIPPED FRAGMENT UNCHANGED.** `letteringFragment` is
   * parameterised entirely through the object it is handed, so a surrogate carrying ONLY the notes
   * re-uses its §12.1 margin placer, its leader rule and its `placeBox` collision list without a
   * line of it being re-derived here.
   *
   * ⛔⛔ **THREE CHANNELS ARE DELIBERATELY EMPTY, AND EACH REFUSAL IS A MEASUREMENT.**
   *   • `umbrella.partition` — the quarter names are `quarterLabels`' above, for the reasons that
   *     function documents. Handing them here too would draw every name twice.
   *   • `eventMarks` — the marks live in LEGACY coordinates and **the dress page draws no event
   *     marks at all**. A caption beside a mark that is not on the sheet is §710.6 exactly, and
   *     projecting the legacy coordinate would put it on the partition's unrelated ground.
   *   • `neighbours` — MEASURED 0 edges on all 18 leaves; §164a makes a standalone settlement carry
   *     none, so there is nothing to draw and an arm over it would be vacuous.
   * ⭐ The MARGINALIA are kept, and for the opposite reason: MEASURED, they are pure chronicle —
   *   `"THE OCCUPATION · IN THE YEAR 19 OF THIS PLACE"` — carrying no map coordinate at all, so
   *   they are as true in this page's margin as they are in the folio's.
   */
  const surrogate = {
    meta: { wardLabels: false, centre: { x: PAGE_SPAN / 2, y: PAGE_SPAN / 2 } },
    umbrella: { partition: [] },
    organisms: [],
    immersion: {
      notes: { notes: a.notes || [] },
      eventMarks: { marks: [] },
      neighbours: { edges: [] },
    },
  };
  const lettering = letteringFragment({
    fabric: surrogate,
    palette: a.palette,
    // ⭐ THE NOTES PLACE AGAINST THE CHROME **AND** AGAINST THE NAMES ALREADY WRITTEN — the order
    //   is §173's own (chrome → names → notes), so the pass that must never give way runs first.
    reserved: chrome.reserved.concat(wards.rows.map((r) => r.box)),
    budget: a.budget,
    allowNotes: (a.notes || []).length > 0,
    words: true,
  });

  const body = chrome.fragment + wards.fragment + (lettering.fragment || '');
  return {
    fragment: body ? `<g id="page-words" transform="${proj.transform}">${body}</g>` : '',
    proj,
    chrome,
    anchored,
    wards,
    lettering,
    ops: wards.ops + lettering.ops,
    census: {
      ...chrome.census,
      quarters: anchored.quarters.length,
      quartersDropped: anchored.dropped.length,
      massesOffSheet: anchored.massesOffSheet,
      wards: wards.rows.length,
      wardsConsidered: wards.considered,
      wardsDropped: wards.dropped.length,
      wardsDuplicate: wards.duplicates,
      notes: lettering.placed.notes,
      notesUnplaced: lettering.placed.notesUnplaced,
    },
    reason: `${chrome.reason}; ${anchored.reason}; ${wards.reason}; ${lettering.reason}`,
  };
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════
 * 6 · THE PLACEMENT CENSUS — is the word ON the thing it names?
 * ═════════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **THE CENSUS ASKS §710.6's QUESTION AND NOT THE EASY ONE.** *"Every census W1 wrote asked
 * whether the mark EXISTS. Not one asked whether it is ON THE THING IT MEANS."* A `<text>` count
 * passes on eighteen labels stacked in one corner, so the count is published as a denominator and
 * the VERDICT is placement.
 *
 * ⚠⚠ **WHICH ARMS DISCOVER AND WHICH REGRESS** (§711.4's law, applied to this census's own greens
 * before anybody quotes them — and the honest answer CHANGED once the census convicted the
 * producer and the producer was cured, which is exactly what should happen):
 *   • `outsideFrame`  — **DISCOVERY.** The producer clips PATH POINTS to `6 … 994`; this arm
 *     measures GLYPH BOXES, which extend by the text's own width past the anchor. The predicates
 *     are not the same one and the larger footprint can fail where the point passed.
 *   • `overlaps`      — **DISCOVERY.** The producer reserves a label's BOUNDING BOX against the
 *     chrome; this arm compares every glyph box against every other glyph box across families,
 *     which no upstream pass computes. It is the arm that convicted `town`/`siege`/`plague`/
 *     `famine` for writing a quarter name through the cartouche.
 *   • `offInk`        — ⚠ **REGRESSION, AND IT WAS DISCOVERY UNTIL IT FIRED.** It found 14 of 18
 *     leaves off their own ink (worst 195 px on `highwater`); the cure put the SAME `inkDistance`
 *     into the producer's clip, so it now shares its producer's predicate and cannot discover
 *     again. It is kept because an edit to the clip would red it. **Its green is not evidence of
 *     placement; the planted control is.**
 *   • `outsideQuarter` — ⚠ **REGRESSION.** `wardLabelPath` already clips the run to the hull.
 *
 * @param {string} svg the finished plate, words spliced
 * @param {any} words a `pageWords` result from the SAME build
 */
export function wordsPlacementCensus(svg, words) {
  const metric = metricFor(true);
  const open = svg.indexOf('<g id="page-words"');
  if (open < 0) {
    return { texts: 0, verdict: null, outsideFrame: [], overlaps: [], offInk: [], outsideQuarter: [],
      reason: 'no words layer on this plate — NO SUBJECT, not a pass' };
  }
  const layer = svg.slice(open);
  /**
   * ⛔ THE GLYPHS ARE READ OFF THE MARKUP, NOT OFF THE PRODUCER'S INTENT. A census that asked
   * `words.anchored` where the letters were MEANT to go would agree with the producer by
   * construction; the plate is the artifact a reader holds, so the plate is what is measured.
   * ⚠ A curved ward label carries its size on the enclosing `<g font-size="…">` and the glyph
   * inherits it, so the scan tracks the last group size it passed — which is exactly how an SVG
   * renderer resolves it.
   */
  const items = [];
  let groupSize = 7, family = 'chrome', label = null;
  const re = /<g id="(page-cartouche|page-compass|page-legend|page-wardlabels|marginalia)"|<g data-along="[^"]*" data-cite="([^"]*)" font-size="([\d.]+)"|<text\s([^>]*)>([^<]*)</g;
  for (const m of layer.matchAll(re)) {
    if (m[1]) { family = m[1] === 'page-wardlabels' ? 'ward' : m[1]; continue; }
    /**
     * ⛔ **THE GLYPH IS ATTRIBUTED TO THE LABEL IT IS PART OF, NEVER TO "the first hull that
     * contains it", AND THAT CORRECTION WAS ITSELF A RED THIS CENSUS PRODUCED.** Quarter hulls
     * OVERLAP — a sprawling `Common Residential` hull covers a compact `Mages' Quarter` — so the
     * containment search attributed one `metropolis` glyph to the wrong quarter and measured it
     * against the wrong buildings: **1 leaf RED at 37.0 px** while the producer had clipped every
     * glyph to within 24 px of its OWN ink. ⭐ THE CLASS, and it is the mirror of §710.6: **an
     * instrument that re-derives which thing a mark belongs to can convict the drawing for the
     * instrument's own join.** The producer stamps the name on the group; the census reads it.
     */
    if (m[3]) { groupSize = Number(m[3]); family = 'ward'; label = m[2]; continue; }
    const at = (n) => { const q = new RegExp(`${n}="([^"]*)"`).exec(m[4]); return q ? q[1] : null; };
    const x = Number(at('x')), y = Number(at('y'));
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const fs = Number(at('font-size'));
    const size = Number.isFinite(fs) ? fs : (family === 'ward' ? groupSize : 7);
    const anchor = at('text-anchor') || 'start';
    const text = m[5];
    const w = textWidth(text, size, 0.4, metric);
    const bx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    items.push({ family, text, x, y, size, box: { x: bx, y: y - size, w, h: size * 1.2 },
      cite: at('data-cite'), label: family === 'ward' ? label : null });
  }

  // 1 · IN THE FRAME (DISCOVERY)
  const outsideFrame = items.filter((it) => it.box.x < 0 || it.box.y < 0
    || it.box.x + it.box.w > PAGE_SPAN || it.box.y + it.box.h > PAGE_SPAN)
    .map((it) => ({ family: it.family, text: it.text, x: r2(it.x), y: r2(it.y) }));

  // 2 · NO LABEL ON ANOTHER (DISCOVERY, across families — a label's own glyphs may touch)
  const hit = (a, b) => !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  const overlaps = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i].family === items[j].family && items[i].family === 'ward') continue;
      if (items[i].family === items[j].family && items[i].family === 'page-legend') continue;
      if (items[i].family === items[j].family && items[i].family === 'page-cartouche') continue;
      if (hit(items[i].box, items[j].box)) {
        overlaps.push({ a: `${items[i].family}:${items[i].text}`, b: `${items[j].family}:${items[j].text}` });
      }
    }
  }

  // 3 · ON THE FABRIC (DISCOVERY) and 4 · IN ITS OWN QUARTER (REGRESSION)
  const quarters = (words && words.anchored && words.anchored.quarters) || [];
  const wardGlyphs = items.filter((it) => it.family === 'ward');
  const offInk = [];
  const outsideQuarter = [];
  let worstReach = 0;
  for (const gl of wardGlyphs) {
    const p = [gl.x, gl.y];
    // the quarter this glyph belongs to is the one its own group CITES — see the note above.
    const home = quarters.find((q) => q.name === gl.label);
    if (!home) { outsideQuarter.push({ text: gl.text, x: r2(gl.x), y: r2(gl.y), label: gl.label, why: 'the glyph cites a quarter this build did not anchor' }); continue; }
    // …and it must be INSIDE the quarter it names (REGRESSION — `wardLabelPath` already clips)
    if (!pointInPolygon(p, home.polygon)) { outsideQuarter.push({ text: gl.text, x: r2(gl.x), y: r2(gl.y), label: gl.label, why: 'outside the quarter it names' }); continue; }
    // ⚠ THE SAME `inkDistance` THE PRODUCER CLIPPED WITH — one ruler, both sides. See `INK_REACH`.
    const best = inkDistance(p, home.inkRings);
    if (best > worstReach) worstReach = best;
    if (best > INK_REACH) offInk.push({ text: gl.text, name: home.name, reach: r2(best) });
  }

  const verdict = outsideFrame.length === 0 && overlaps.length === 0
    && offInk.length === 0 && outsideQuarter.length === 0;
  return {
    texts: items.length,
    wardGlyphs: wardGlyphs.length,
    quarters: quarters.length,
    worstReach: r2(worstReach),
    outsideFrame,
    overlaps,
    offInk,
    outsideQuarter,
    verdict,
    reason: `${items.length} glyph(s) placed (${wardGlyphs.length} on ${quarters.length} quarter(s));`
      + ` ${outsideFrame.length} outside the page, ${overlaps.length} cross-family overlap(s),`
      + ` ${offInk.length} quarter glyph(s) further than ${INK_REACH} px from a drawn mass`
      + ` (worst ${r2(worstReach)}), ${outsideQuarter.length} outside the quarter named`,
  };
}
