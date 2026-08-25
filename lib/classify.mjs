/**
 * lib/classify.mjs — REG-I0 · the ten-role classifier and the role MASKS every pixel
 * instrument probes through.
 *
 * ⭐ THE CLASSIFIER IS REG-0's, LIFTED (postPass.mjs §2). It keys on the sealed lens's exact
 * role colours (`folioLenses.js` at ee0db96d3), which is what makes it safe: the harness emits
 * role colours verbatim, so the classifier reads the drawing's own vocabulary rather than
 * guessing at pixels.
 *
 * ⭐⭐ AND THE MASKS ALWAYS COME FROM THE **BASE** RENDER, WHATEVER RASTER IS UNDER TEST.
 * That is the controlled design REG-0's own frontage metric uses in its own words — "the same
 * instrument, the same samples, the same probes… only the mask differs". A specimen repaints
 * the page, so classifying the specimen with the base's colour table would move the PROBES as
 * well as the picture, and a before/after delta measured through two different probe sets is
 * not a delta at all.
 */
import { readFileSync } from 'node:fs';
import { tokenize, subpaths, pointsOf, isHex } from './svg.mjs';
import { lumHex, hex2rgb, inPoly } from './geom.mjs';

/** the sealed ten-role tables, copied from folioLenses.js at ee0db96d3 */
export const LENSES = {
  parchment: { paper: '#E9DEC3', ink: '#2B2118', roofs: '#8A5F3A', water: '#7E8E97', greens: '#9FA47A', roads: '#F3EBD6', walls: '#241B12', trees: '#61704A', labels: '#3E2C18', elements: '#EFE5CC' },
  darkFantasy: { paper: '#1E2430', ink: '#05070B', roofs: '#2E2A33', water: '#16202E', greens: '#26302B', roads: '#6E7486', walls: '#04060A', trees: '#1D2A22', labels: '#C9C2AE', elements: '#2A313E' },
  watercolor: { paper: '#F1E8D2', ink: '#3A2C20', roofs: '#A9714A', water: '#8FA3AE', greens: '#AEB489', roads: '#FAF3E2', walls: '#33261A', trees: '#6E7F52', labels: '#4A3520', elements: '#F6EDD9' },
};

export const ROLE_NAMES = ['text', 'paper', 'ground', 'detail', 'field', 'street', 'water', 'chrome', 'square', 'yard', 'building', 'blockfront', 'landmark', 'wall'];

/**
 * ⭐⭐ REG-5 · **THE GROUP→ROLE TABLE. A GROUP ID *IS* A CLASSIFICATION** (REG-3's J-REG3-9,
 * restated by REG-4's J-REG4-7), and the classifier now holds that in one table instead of a
 * hand-written `inG` ladder that every later wave had to remember to extend. It did not:
 * REG-I1 (§2.2, J-I1-3) caught four REG-4 ids missing, and this lane's own per-rule probe caught
 * a FIFTH — REG-3's `precincts`, live on 8 of 28 armed artifacts and unknown to the ladder.
 *
 * ⛔⛔ AND THE INHERITED DIAGNOSIS WAS WRONG ABOUT THE BIG HALF, MEASURED. REG-I1 attributed the
 * +64 circles to REG-4's market furniture; single-arm renders put every one of them under
 * `--shapes` (REG-3), inside `<g id="landmarks">`. `marketFurniture` is BATCHED and carries three
 * elements on the town leaf, not sixty-four. The damage was therefore never mainly the market's:
 *   · 64 landmark CIRCLES convicted by `rect|circle → chrome` (that rule ran before every group)
 *   · 57 landmark PATHS convicted by the chrome-ZONE point test, because those same 64 circles
 *     each planted a 22-unit-padded exclusion box over the landmark quarter.
 * The zone flood is the larger and quieter defect: it is invisible in a role census, because the
 * elements it eats were never rects or circles at all.
 *
 * ROLE CHOICES, each by what the ink DRAWS rather than by what produced it (REG-5, vetoable):
 *   `marketOutline`     → square    the void's own edge; `square` is the market role, and the
 *                                   void SURFACE is now the street web itself (L-REG-6)
 *   `marketFossils`     → building  §18.4's hardened middle rows are permanent buildings
 *   `marketFurniture`   → detail    the V-B13 detail register, drawn at detail weight
 *   `faubourgDistricts` → ground    extramural district ground; this also keeps hf311's TOLL BAR
 *                                   out of `wall` (it is drawn in wall ink but is not circuit)
 *                                   and the frontage SPINE out of `street` (it is not carriageway)
 *   `precincts`         → yard      drawn in yardTone; REG-3 moved these OUT of `landmarks`
 *                                   precisely so they would not read as monuments in the
 *                                   salience instrument, so `landmark` would undo that cure
 */
export const GROUP_ROLE = Object.freeze({
  fields: 'field', fabric: 'building', landmarks: 'landmark', yards: 'yard', squares: 'square',
  marketOutline: 'square', marketFossils: 'building', marketFurniture: 'detail',
  faubourgDistricts: 'ground', precincts: 'yard',
  // ⭐ REG-5's own group, registered in the same act that cured the ladder — the kit paying
  //   for itself immediately. V-QUAY's gear is DETAIL-register ink, exactly as the market's
  //   furniture is, and filing it here keeps a bollard out of instrument 4's LANDMARK read.
  quayFurniture: 'detail',

  /* ══════════════════════════════════════════════════════════════════════════════════════
   * ⭐⭐⭐ **DRESS-1b · THE THIRTY `dress-*` GROUPS (ODQ §691.2, RULED BY THE CHAIR).**
   *
   * ⛔⛔ WHY THIS BLOCK EXISTS, AND WHY "LEAVE IT ALONE" WAS NEVER THE NEUTRAL OPTION.
   * DRESS-1 emitted thirty `dress-*` groups and NOT ONE of them was known here. The classifier
   * did not merely fail to name the dress — it CONVICTED it. MEASURED on all 18 dress plates
   * before this block existed (`$SP/dress1b/probe-classify.mjs`):
   *   · `building`, `landmark`, `street`, `field`, `yard` and `square` came back EMPTY on every
   *     plate. `lib/pixels.mjs` builds the GROUND population as the closed urban envelope of
   *     `building` ∪ `landmark`, so with `building` empty the ground population is ZERO and
   *     EVERY i1 arm and i5's `street:ground` / `water:ground` rows are structurally dead.
   *   · the dress emits exactly ONE `<rect>` (`dress-paper`) and NO `<circle>`. On the four
   *     leaves whose frame is narrower than 900 units — thorp 286.8, hamlet 422.1, village
   *     519.4, mountain 519.4 — that rect planted a **WHOLE-PAGE chrome exclusion zone**, and
   *     the point test that runs before everything else then ate the entire drawing:
   *     thorp `detail:12 chrome:13`, hamlet/village/mountain `detail:13 chrome:14`. No ground,
   *     no water, no wall anywhere on those plates.
   * ⚠⚠ AND THE MARGIN ON A FIFTH LEAF IS **1.2 UNITS**: `town-2`'s paper rect is 901.2 wide
   *   against the 900 threshold. One tuning nudge to that leaf's extent and a whole town plate
   *   flips to total chrome. The width test is a cliff, not a slope — recorded because nothing
   *   about the classifier's ladder makes that visible.
   * Registering `dress-paper` here removes the flood AT ITS SOURCE, exactly as REG-5's own cure
   * did: `drawingGroup()` guards the zone plant, so a NAMED group never plants one.
   *
   * ⭐⭐ **DERIVED, NOT BLANKET (§691.3).** Every row below is the role the mark ACTUALLY DRAWS,
   * read off `partitionDress.js`'s own emission at `ad2b8d399`, with the emitting line named.
   * `chrome` is assigned to NONE of the thirty: the dress draws no legend, no scale bar, no
   * compass and no cartouche, so not one of its marks is plate furniture. A blanket mapping
   * would have traded one wrong answer for a quieter one.
   * ══════════════════════════════════════════════════════════════════════════════════════ */

  /** L174 the sheet: `<rect … fill="${T.paper}"/>`. The one rect the dress emits. */
  'dress-paper': 'paper',
  /** L193 `fill="${T.field}"` over `page.fields` — the same call `fields: 'field'` above makes. */
  'dress-fields': 'field',
  /** L199 `stroke="${T.grain}"`, and `grain = mix(field, poles.dark, 0.34)`. The source's own
   *  words at L195: "THE GRAIN IS DRAWN IN THE FIELD'S OWN DARKER TONE, NOT IN INK … a furrow is
   *  a tonal texture in the corpus (hf140), not a drawn line in map ink." It is the field. */
  'dress-grain': 'field',
  /** L226 `fill="${T.water}"` over `page.water`. */
  'dress-water': 'water',
  /** L228 `stroke="${T.waterInk}"`, and `waterInk = mix(R.water, poles.dark, 0.45)` — the water
   *  role's own colour, darkened. Shore recession lines and calm ruling hug the water face. */
  'dress-shore': 'water',
  /** ⚠ A ROSTER MEMBER WITH NO EMITTER. `DRESS_GROUPS` (partitionDress.js:71) carries
   *  `dress-ground`; `DRESS_LAYERS` names a `ground` layer; and NOTHING calls
   *  `g('dress-ground', …)` — the street gap is emitted as `dress-street` instead. Mapped by
   *  name so this table is TOTAL over the roster rather than over the roster's live half. */
  'dress-ground': 'ground',
  /** L241 `fill="${T.street}"` over `page.ways`. `T.street` is rung 1 of the value ladder,
   *  "the palest ground role — §9.7's own law, and the street IS the gap" (L609). */
  'dress-street': 'street',
  /** L250 over `page.voids`; the legend row (L1083) teaches "square / market / green". The
   *  same call `marketOutline: 'square'` above makes — `square` is the market role. */
  'dress-voids': 'square',
  /** L321 `fill="${T.plotGround}"` — the mass's own toft ring, PA.6's "yards remain ground".
   *  The same call `precincts: 'yard'` above makes, on the same evidence (drawn in yard tone). */
  'dress-yards': 'yard',
  /** ⭐ L323 `fill="${T.built}"` — THE BUILT FOOTPRINT, and `fabric: 'building'` is its
   *  precedent. This row is also STRUCTURALLY LOAD-BEARING: `rolePopulations` derives the whole
   *  ground population from `building` ∪ `landmark`, so if the masses are not `building`, i1
   *  and i5 have nothing to measure against.
   *  (This row is load-bearing in the structural sense, not merely the semantic one.) */
  'dress-masses': 'building',
  /** L326 the two-tone roof planes, `fill="${T.roofNW}"` / `"${T.roofSE}"`, over that same
   *  footprint. A roof plane is the mass seen from above; it is not a separate thing. */
  'dress-planes': 'building',
  /** L328 `stroke="${T.eaves}"`, `eaves = mix(R.roofs, poles.dark, 0.55)` — the roof tone
   *  darkened, ticked along the footprint's own SE-facing edges. */
  'dress-eaves': 'building',
  /** L331 one ridge per party run, clipped to the run's own dissolved footprint (PA.6). */
  'dress-ridges': 'building',
  /** L333 hips closing each end of that ridge (hf208 rule 3). */
  'dress-hips': 'building',
  /** L336 a square astride the ridge (hf208 rule 9) — the mass's own furniture, not the page's. */
  'dress-chimneys': 'building',
  /** L338 A1.2's member party lines INSIDE an aggregated mass. `blockfront` was considered and
   *  refused: that role is the block's FRONTAGE line, and a party wall is not a frontage. */
  'dress-unitlines': 'building',

  /* ── THE CIRCUIT. The roster is DRESS-1's own executed `WALL_GROUPS`
   *    (harness/laneDRESS1/wallAll.mjs:33) — the eight groups the `wall:all` figure the estate
   *    has already published (6.08–7.00, §688 exit 9) was measured over. Adopting it means the
   *    classifier's `wall` population IS the population that number describes, which this lane
   *    then CROSS-CHECKS by reproducing `wall:all` through i5 rather than asserting it. ── */
  /** L419 `fill="${T.bandGround}" stroke="${T.wall}"` — the band as a double-edged FACE. */
  'dress-band': 'wall',
  /** L422 `stroke="${T.wall}"` — coursed masonry in patches (hf261 rung 4). */
  'dress-coursing': 'wall',
  /** L425 `stroke="${T.wall}"` — the merlon comb on the OUTER edge only (hf103). */
  'dress-comb': 'wall',
  /** L433 `stroke="${T.wall}"` — towers as plan shapes straddling the band; towers-as-JOINTS,
   *  which is why `landmark` is refused here: REG-3 moved precincts out of `landmarks` for
   *  exactly this reason and a tower is circuit, not monument. */
  'dress-towers': 'wall',
  /** ⚠ THE ONE ARGUABLE ROW, AND THE ARGUMENT IS RECORDED. L427 draws the ditch hachure in
   *  `T.ink`, not `T.wall`, and it lies OUTSIDE the band face — so `faubourgDistricts: 'ground'`
   *  ("drawn in wall ink but is not circuit", the toll-bar case) looks like a precedent for
   *  demoting it. It is not: that precedent turns on the toll bar being CIVIC FURNITURE that
   *  merely borrows wall ink, whereas the ditch is minted from the wall run's OWN policy field
   *  (`f.runs[ri].ditch`, L387) and is the rampart's earthwork. It is circuit. */
  'dress-ditch': 'wall',
  /** L430 `stroke="${T.wall}"` — rare stair flights on the band's inner face (hf314). */
  'dress-stairs': 'wall',
  /** L436 `stroke="${T.wall}"` — the passage cut through the band; "a gate is SEATED IN the
   *  wall" (legend L1098), which is precisely why it is not its own role. */
  'dress-gates': 'wall',
  /** ⚠ THE SECOND ARGUABLE ROW. L439 dresses a robbed circuit as a dashed boundary in `T.ink`
   *  at detail weight (B4's cure, hf123), so `detail` is defensible on tone alone. Refused for
   *  the same reason as the ditch: a relict RING is a circuit — the wave that drew it counted it
   *  as one — and the estate's published `wall:all` was measured with it in. MEASURED: zero
   *  elements on all 18 leaves today, so this row moves no current figure either way. */
  'dress-relict': 'wall',

  /** L476 `fill="${T.deck}"`, and `deck = mix(built, poles.dark, 0.18)` — the deck tone is
   *  DERIVED FROM the built tone, i.e. a deck is built fabric. `street` was considered and
   *  refused with a concrete cost: `street` is the PALEST role on the page and a dark deck
   *  dropped into that population would corrupt i1's street luminance arm. */
  'dress-decks': 'building',
  /** L480 `stroke="${T.waterInk}"` — PA.3's stipple shallows draw BROKEN WATER across the reach.
   *  The tone is the water's own; the mark is the river's surface. */
  'dress-ford': 'water',
  /** ⚠ AND ITS SIBLING CROSSING SPLITS FROM IT, ON THE EMISSION'S OWN EVIDENCE. L483 draws
   *  stepping stones `fill="${T.ink}"` — OBJECTS standing in the water, in map ink, not the
   *  water's own surface. Two crossing dresses, two roles, because the ink says so. */
  'dress-stepping': 'detail',
  /** L520 `fill="${T.plotGround}" stroke="${T.ink}"` — a worked public waterfront surface.
   *  `yard` was considered (it is drawn in the toft tone) and refused: a quay is not a plot's
   *  private back-land. `ground` is the estate's generic worked-ground role, which is the call
   *  `faubourgDistricts: 'ground'` ("extramural district ground") already makes. */
  'dress-quays': 'ground',
  /** ⭐ ESSENTIALLY PRE-RULED: `quayFurniture: 'detail'` above is the SAME MARK, and its own
   *  comment gives the reason — "filing it here keeps a bollard out of instrument 4's LANDMARK
   *  read". L523 draws the identical bollard squares in `T.ink`. */
  'dress-vquay': 'detail',
  /** L1161 E11's accessible-lens category hatch, clipped to each mass's own run rings. §9.7's
   *  "patterns replace hue" makes this the BUILDING'S IDENTITY carried by pattern instead of by
   *  colour, so it belongs to the population whose identity it is carrying. */
  'dress-accessible': 'building',
});
/** the plate's own furniture — these groups are chrome whatever they contain */
export const CHROME_GROUPS = Object.freeze(['legend', 'lettering', 'wardlabels', 'marginalia', 'eventcaptions']);

/**
 * Classify every drawing element of an SVG into REG-0's roles.
 * @returns {{els:Array, census:Object, ROLE:Object}}
 */
export function classify(svgPath, lensId = 'parchment') {
  const src = readFileSync(svgPath, 'utf8');
  const ROLE = LENSES[lensId] || LENSES.parchment;
  const toks = tokenize(src);
  const stack = [];
  const els = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.kind === 'text') continue;
    if (t.kind === 'close') { stack.pop(); continue; }
    const groups = stack.slice();
    if (t.kind === 'open') stack.push(t.attrs.id || `<${t.tag}>`);
    if (t.tag === 'svg') continue;
    els.push({ i, t, groups, tag: t.tag });
  }
  const inG = (rec, id) => rec.groups.includes(id);
  /** the INNERMOST drawing group this element sits in, or null — the table above decides */
  const drawingGroup = (rec) => {
    for (let k = rec.groups.length - 1; k >= 0; k--) if (GROUP_ROLE[rec.groups[k]]) return rec.groups[k];
    return null;
  };

  /**
   * ⛔⛔ REG-5 · **A CHROME ZONE IS PLANTED BY PLATE FURNITURE, NEVER BY DRAWING.**
   *
   * The zone list exists so the legend swatches, the scale bar and the compass can pull the small
   * paths that belong to them out of the drawing. It was built from RAW TAGS before any role
   * existed, so it could not tell a legend swatch from a monument's own glyph — and the moment
   * REG-3's shape code put sixty-four circles inside `<g id="landmarks">`, each one planted a
   * 22-unit-padded box and the point test below ate 57 landmark PATHS that were never rects or
   * circles at all. MEASURED on `town-town-parchment`, armed: zones 10 → 74, and `landmarks`
   * lost 121 of 240 elements to chrome. Restricting the plant to elements OUTSIDE every drawing
   * group is byte-exact on the base corpus (all three base circles live in `<g id="legend">`,
   * all seven zone-planting rects at root) and stops the flood at its source.
   */
  const chromeZones = [];
  for (const r of els) {
    const a = r.t.attrs;
    if (drawingGroup(r)) continue;
    if (r.tag === 'rect' && a.x != null && Number(a.width) < 900) {
      chromeZones.push([Number(a.x) - 6, Number(a.y) - 6, Number(a.x) + Number(a.width) + 6, Number(a.y) + Number(a.height) + 6]);
    }
    if (r.tag === 'circle' && Number(a.r) < 60) {
      chromeZones.push([Number(a.cx) - Number(a.r) - 22, Number(a.cy) - Number(a.r) - 22, Number(a.cx) + Number(a.r) + 22, Number(a.cy) + Number(a.r) + 22]);
    }
  }
  chromeZones.push([18, 20, 320, 110]);
  const inChrome = (x, y) => chromeZones.some((z) => x >= z[0] && x <= z[2] && y >= z[1] && y <= z[3]);

  const paperLum = lumHex(ROLE.paper);
  for (const r of els) {
    const a = r.t.attrs;
    const fill = a.fill, stroke = a.stroke, d = a.d;
    if (r.tag === 'text' || r.tag === 'tspan' || r.tag === 'title') { r.role = 'text'; continue; }
    if (CHROME_GROUPS.some((g) => inG(r, g))) { r.role = 'chrome'; continue; }
    if (r.tag === 'rect' && Number(a.width) >= 900) { r.role = 'paper'; continue; }
    /**
     * ⭐ REG-5 · THE CHROME-ZONE POINT TEST KEEPS ITS PRECEDENCE OVER THE GROUP TABLE, and only
     * `rect|circle → chrome` moves. The zone list now holds nothing but genuine plate furniture
     * plus the fixed cartouche box, so a path lying wholly inside one really is occluded by the
     * plate — and a mask that claimed those pixels would sample the cartouche's colour, not the
     * drawing's. Moving the group table above this test as well was measured and rejected: it
     * would have re-classified ink the eye cannot see. Only the ONE defective rule is reordered.
     */
    const pts = d ? pointsOf(d) : [];
    if (pts.length && pts.every((p) => inChrome(p[0], p[1]))) { r.role = 'chrome'; continue; }
    /** ⭐⭐ REG-5 · the group table, now AHEAD of `rect|circle → chrome` (J-I1-3's cure) */
    const dg = drawingGroup(r);
    if (dg) { r.role = GROUP_ROLE[dg]; continue; }
    if (r.tag === 'rect' || r.tag === 'circle') { r.role = 'chrome'; continue; }
    if (isHex(stroke) && stroke.toUpperCase() === ROLE.walls.toUpperCase()) { r.role = 'wall'; continue; }
    if (a['stroke-linecap'] === 'square' && isHex(stroke) && fill === 'none' && stroke.toUpperCase() === ROLE.ink.toUpperCase()) { r.role = 'blockfront'; continue; }
    if (a['stroke-linecap'] === 'square' && isHex(stroke) && lumHex(stroke) < paperLum * 0.55) { r.role = 'wall'; continue; }
    const bluish = (h) => { if (!isHex(h)) return false; const c = hex2rgb(h); return c[2] > c[0] + 3; };
    if (bluish(fill) || (fill === 'none' && bluish(stroke) && Number(a['stroke-width']) < 1.2)) { r.role = 'water'; continue; }
    if (fill === 'none' && isHex(stroke) && lumHex(stroke) >= paperLum - 2 && Number(a['stroke-width']) >= 1) { r.role = 'street'; continue; }
    if (fill === 'none' && isHex(stroke) && Math.abs(lumHex(stroke) - paperLum) < 16 && Number(a['stroke-width']) >= 1.5) { r.role = 'street'; continue; }
    if (isHex(fill) && (stroke === 'none' || stroke === undefined)) { r.role = 'ground'; continue; }
    if (isHex(fill) && isHex(stroke)) { r.role = 'ground'; continue; }
    r.role = 'detail';
  }
  const census = {};
  for (const r of els) census[r.role] = (census[r.role] || 0) + 1;
  return { els, census, ROLE, src };
}

/* ───────────────────── role masks, in RASTER pixel space ───────────────────── */

/**
 * A binary mask over an image of side `n` pixels, addressed in SVG VIEW UNITS (0..1000).
 * The folio viewBox is `0 0 1000 1000` and shoot.sh strips width/height before screenshotting
 * at a square window, so unit → pixel is a single uniform scale with no offset. That is
 * asserted here rather than assumed: `assertViewBox()` refuses any other frame.
 */
export class PxMask {
  constructor(n, extent = 1000) { this.n = n; this.extent = extent; this.s = extent / n; this.a = new Uint8Array(n * n); }
  count() { let c = 0; for (let i = 0; i < this.a.length; i++) if (this.a[i]) c++; return c; }
  at(x, y) {
    const cx = Math.floor(x / this.s), cy = Math.floor(y / this.s);
    return (cx < 0 || cy < 0 || cx >= this.n || cy >= this.n) ? 0 : this.a[cy * this.n + cx];
  }
  fillPoly(poly) { this.fillPolys([poly]); }

  /**
   * ⛔⛔ EVEN-ODD ACROSS **ALL** SUBPATHS OF ONE PATH, AND THE UNION VERSION WAS A REAL DEFECT.
   *
   * SVG fills a multi-subpath `<path>` by a single winding rule over every subpath at once, so an
   * outer shape plus an inner subpath is a shape WITH A HOLE. Filling each subpath separately
   * and OR-ing the results turns every hole solid. MEASURED on the sealed city: the water role
   * came back covering 327,001 of 1,210,000 decision pixels — 27% of the plate, swallowing the
   * town — and 210,506 of those "water" pixels were unsaturated because they were not water at
   * all, they were the fabric showing through a hole the mask had filled in. Downstream that
   * read as "the water hue is 42°, warm", which is a false conviction of a correct drawing.
   *
   * ⭐ THE CLASS: a mask built subpath-by-subpath cannot express a hole, and a role that has
   * holes will report the things inside them as itself.
   */
  fillPolys(polys) {
    const { n, s } = this;
    let y0 = Infinity, y1 = -Infinity;
    for (const poly of polys) for (const p of poly) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    if (!Number.isFinite(y0)) return;
    const cy0 = Math.max(0, Math.floor(y0 / s)), cy1 = Math.min(n - 1, Math.ceil(y1 / s));
    const xs = [];
    for (let cy = cy0; cy <= cy1; cy++) {
      const y = (cy + 0.5) * s;
      xs.length = 0;
      for (const poly of polys) {
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const [xi, yi] = poly[i], [xj, yj] = poly[j];
          if ((yi > y) !== (yj > y)) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi);
        }
      }
      if (xs.length < 2) continue;
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const cx0 = Math.max(0, Math.floor(xs[k] / s)), cx1 = Math.min(n - 1, Math.floor(xs[k + 1] / s));
        for (let cx = cx0; cx <= cx1; cx++) this.a[cy * n + cx] = 1;
      }
    }
  }
  /**
   * Stamp a stroked segment of half-width `hw` UNITS.
   *
   * ⚠⚠ BITTEN 2026-08-24, AND THE FIX IS THE INSTRUMENT. REG-0's own `stampSeg` marks an
   * INTEGER-CELL disc (`r = ceil(hw/s)`), which is right for a fusion mask and wrong for a
   * measurement: a 1.87-unit alley has hw 0.94, `ceil` rounds its radius up to a whole cell,
   * and the alley is stamped THREE units wide. At 200px that inflated alley then covers 60% of
   * a 5-unit squint pixel and SURVIVES a test it should fail — the street population fills with
   * ink the eye never sees, and the squint verdict is measured on a street web that is not
   * there. The test below is the true distance from the CELL CENTRE to the segment, so a stroke
   * marks the cells it actually covers and a sub-cell stroke marks about one cell per unit run.
   */
  /**
   * ⚠ `legacy` REPRODUCES REG-0's ORIGINAL INTEGER-CELL DISC, and it exists for exactly one
   * reason: REG-0's published figures were measured through it, and a compatibility mode that
   * quietly used the corrected stamp would report "reproduced" while differing in the fourth
   * decimal. It is never the default and never used for a new baseline.
   */
  stampSegLegacy(x0, y0, x1, y1, hw) {
    const L = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(L / (this.s * 0.7)));
    const r = Math.ceil(hw / this.s);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      const ccx = Math.floor(x / this.s), ccy = Math.floor(y / this.s);
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        const cx = ccx + dx, cy = ccy + dy;
        if (cx < 0 || cy < 0 || cx >= this.n || cy >= this.n) continue;
        this.a[cy * this.n + cx] = 1;
      }
    }
  }

  stampSeg(x0, y0, x1, y1, hw) {
    const s = this.s, n = this.n;
    const rc = Math.ceil(hw / s) + 1;
    const L = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(L / (s * 0.7)));
    const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, x = x0 + dx * t, y = y0 + dy * t;
      const ccx = Math.floor(x / s), ccy = Math.floor(y / s);
      for (let jy = -rc; jy <= rc; jy++) {
        for (let jx = -rc; jx <= rc; jx++) {
          const cx = ccx + jx, cy = ccy + jy;
          if (cx < 0 || cy < 0 || cx >= n || cy >= n) continue;
          const k = cy * n + cx;
          if (this.a[k]) continue;
          const px = (cx + 0.5) * s, py = (cy + 0.5) * s;
          const u = L2 ? Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / L2)) : 0;
          if (Math.hypot(px - (x0 + dx * u), py - (y0 + dy * u)) <= hw) this.a[k] = 1;
        }
      }
    }
  }
}

/**
 * ⛔ **THE FRAME. Refuse anything the unit→pixel map cannot express — but the map now covers a
 * FITTED SQUARE frame as well as the folio's own `0 0 1000 1000`.**
 *
 * ⛔⛔ **DRESS-1b: THIS REFUSED ALL EIGHTEEN DRESS PLATES, AND THAT BLOCKER WAS NOT ON §690's
 * LIST.** `renderPage.mjs` frames the partition page on its own extent
 * (`viewBox="-32.50 166.28 979.37 979.37"` on the town), so the old form of this function threw
 * `VIEWBOX_…` for every leaf and i1/i5/i7 could not open a dress plate AT ALL — a fact upstream
 * of the classifier question §690.1 does name. Measured before the cure: `0 accepted, 18 REFUSED`.
 *
 * ⭐⭐ **WHY A FRAME DESCRIPTOR RATHER THAN A REWRITE OF THE PLATE'S PATH DATA.** The obvious
 * alternative was to re-emit each dress SVG with its coordinates pre-mapped into 0..1000. It was
 * REFUSED: a path rewrite has to scale arc radii and relative deltas and stroke-widths correctly,
 * every one of them a chance to be quietly wrong, and a quiet error there would corrupt every
 * baseline recorded through it while still looking like a clean number. The frame descriptor is
 * exact by construction and **reduces to the identity on every legacy plate**, which is directly
 * provable and is proved (`i1/i5/i7 --controls` unmoved, see INSTRUMENTS.md).
 *
 * ⚠ **ONE SEMANTIC MOVES AND IT IS DECLARED, NOT SMUGGLED.** Distances expressed "in units" —
 * `stampSeg`'s 200-unit stray-chord guard, `rolePopulations`' 22-unit urban-envelope closing —
 * are now FRAME-RELATIVE on a fitted plate rather than world-absolute. On the folio (extent
 * exactly 1000) nothing changes. On a thorp (extent 352) 22 normalised units are 7.7 world units;
 * on a metropolis (extent 1281) they are 28. That is arguably the more correct reading — the
 * envelope should scale with the page — but it is a CHANGE and a successor is owed the sentence.
 *
 * @returns {{x:number,y:number,w:number,h:number,identity:boolean}}
 */
export function assertViewBox(src) {
  const m = src.match(/viewBox="([^"]*)"/);
  if (!m) throw new Error('NO_VIEWBOX — the unit→pixel map cannot be established');
  const v = m[1].trim().split(/[\s,]+/).map(Number);
  if (v.length !== 4 || v.some((k) => !Number.isFinite(k))) {
    throw new Error(`VIEWBOX_${m[1]} — not four finite numbers; refusing rather than mis-mapping`);
  }
  if (!(v[2] > 0) || !(v[3] > 0)) {
    throw new Error(`VIEWBOX_${m[1]} — non-positive extent; refusing rather than mis-mapping`);
  }
  /**
   * ⛔ A NON-SQUARE FRAME IS STILL REFUSED. `PxMask` is square by construction (`n × n`, one
   * scale `s` for both axes), so a 2:1 page would need two scales and every "unit" figure in the
   * estate would become ambiguous about which axis it meant. Refusing is the honest answer until
   * some plate actually needs it.
   *
   * ⚠⚠ **AND THE FIRST TOLERANCE HERE WAS 1e-6 AND IT REFUSED A LEGITIMATE PLATE — measured, not
   * foreseen.** `renderPage.mjs` prints the frame's width and height through `toFixed(2)`
   * INDEPENDENTLY, so a genuinely square frame can reach the attribute as
   * `viewBox="-156.12 68.32 973.19 973.18"` — the `polycentric` leaf, refused at 0.01 units of
   * pure decimal rounding while 17 siblings passed. The tolerance is therefore RELATIVE and set
   * at 1e-3: at the smallest plate in the corpus (extent 352) that admits 0.35 units, comfortably
   * above a 2-decimal artifact, and a page that is actually non-square is off by tens of percent.
   * The alternative — printing more decimals in the emitter — was refused because it would move
   * the bytes of every shipped plate to suit an instrument.
   */
  if (Math.abs(v[2] - v[3]) > 1e-3 * Math.max(v[2], v[3])) {
    throw new Error(`VIEWBOX_${m[1]} — non-square frame; PxMask carries ONE scale and refuses to guess an axis`);
  }
  const identity = v[0] === 0 && v[1] === 0 && v[2] === 1000 && v[3] === 1000;
  return { x: v[0], y: v[1], w: v[2], h: v[3], identity };
}

/**
 * The affine that carries a frame's own units into the 0..1000 space `PxMask` addresses.
 * ⚠ `sx`/`sy` are taken per axis so the residual anisotropy `assertViewBox` tolerates (a
 * 2-decimal print artifact, ≤1e-3 relative) is mapped away exactly instead of being carried;
 * `s` — the single scale LENGTHS take, since a stroke-width has no axis — is their mean.
 */
export function frameTransform(frame) {
  if (!frame || frame.identity) return { pt: (p) => p, s: 1, sx: 1, sy: 1, identity: true };
  const sx = 1000 / frame.w;
  const sy = 1000 / frame.h;
  return {
    pt: (p) => [(p[0] - frame.x) * sx, (p[1] - frame.y) * sy],
    s: (sx + sy) / 2,
    sx,
    sy,
    identity: false,
  };
}

/**
 * Build one mask per role at raster resolution `n`.
 * Filled roles are scan-filled; stroked roles (street, wall, water rules) are stamped along
 * their polyline at their own declared half-width — the ink's real footprint, not its spine.
 *
 * `frame` is `assertViewBox()`'s descriptor. Omitted, or the folio's own `0 0 1000 1000`, the
 * transform is the IDENTITY and this function is byte-for-byte the one every existing baseline
 * was measured through.
 */
export function roleMasks(els, n, roles, frame = null) {
  const XF = frameTransform(frame);
  /** @type {Record<string, PxMask>} */ const out = {};
  for (const role of roles) out[role] = new PxMask(n);
  for (const r of els) {
    if (!roles.includes(r.role)) continue;
    const a = r.t.attrs;
    if (!a.d) continue;
    const M = out[r.role];
    const stroked = a.fill === 'none' || !isHex(a.fill);
    // ⚠ the half-width is a LENGTH, so it takes the scale and never the translation.
    const hw = Math.max(0.5, (Number(a['stroke-width'] || 1) / 2) * XF.s);
    const sps = subpaths(a.d);
    if (!stroked) {
      // one winding rule over EVERY subpath of this path — see fillPolys' header
      M.fillPolys(sps.filter((sp) => sp.poly.length > 2).map((sp) => sp.poly.map(XF.pt)));
      continue;
    }
    for (const sp of sps) {
      const poly = XF.identity ? sp.poly : sp.poly.map(XF.pt);
      for (let k = 0; k + 1 < poly.length; k++) {
        const [x0, y0] = poly[k], [x1, y1] = poly[k + 1];
        if (Math.hypot(x1 - x0, y1 - y0) > 200) continue;   // a stray closing chord
        M.stampSeg(x0, y0, x1, y1, hw);
      }
    }
  }
  return out;
}

/** collect the raw subpath polygons of a role (unit space) */
export function rolePolys(els, role) {
  const out = [];
  for (const r of els) {
    if (r.role !== role || !r.t.attrs.d) continue;
    for (const sp of subpaths(r.t.attrs.d)) if (sp.poly.length > 2) out.push({ poly: sp.poly, attrs: r.t.attrs });
  }
  return out;
}

export { inPoly };
