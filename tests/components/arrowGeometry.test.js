/**
 * tests/components/arrowGeometry.test.js: THE PAINTED ARROW'S GEOMETRY CONTRACT.
 *
 * The owner's orders (2026-09-16): the header is a cut of the owner's own arrow painting,
 * "not emulate[d]", and the page starts at the top of the wooden shaft. The paint engine
 * lays that one strip across any page width by cutting it at plain wood and filling each
 * gap with a tile cut from the same painting (src/components/nav/arrowGeometry.js).
 *
 * What this file pins (node: pure arithmetic, no DOM; the pixels behind the tables are
 * re-measured by tests/build/arrowHeaderAssets.test.js):
 *   (a) the painted regions are keyed by NAV's ids in NAV's order, with NAV's labels, so a
 *       routes.js relabel or reorder reds instead of mislinking a painted word;
 *   (b) the tables agree with each other: every cut has its own `fe` columns of plain wood
 *       on both sides, Compendium's gaps take one cut each at COMPENDIUM_FE, bindings separate
 *       the regions, the slip clears the rivets (with a CONTROL showing the cut check can fail);
 *   (c) for every page width from 320 to 3840 px in both compositions: the painting ends
 *       exactly at the page's width, the segments tile with their slots, every filler
 *       spans its slot plus both crossfades (so only painted segments ever fade), and no slot
 *       opens below the uncut threshold (the tile cap went with the tile zone, 2026-11-08: a
 *       slot wider than one tile repeats the tile, as the filler's repeat-x always allowed);
 *   (c2) THE SIX SECTIONS ARE EQUAL (owner, 2026-11-08: "The spacing between the sections
 *       ( represented by the banded thread red) are not equally spaced and scales as such can
 *       you do that for me?"): binding to binding, within 1 px, at every full width from the
 *       catch-up to 3840, and they grow together; below the catch-up the extra water-fills
 *       the narrowest sections first, and the scale never passes S_MAX or jumps;
 *   (d) the scale: the word floor at the switch, S_MAX while wood is inserted, continuity
 *       inside each zone, the short-landscape cap on the compact arrow only;
 *   (e) the hit rectangles: ordered, disjoint, in bounds, each widened only by its own
 *       slots, and at least 24 px wide at the floor;
 *   (f) the band, hang and barb heights, the compact slot floor, mapX and padTarget;
 *   (g) the width store (components/nav/useChromeWidth.js) loads and answers in node, where
 *       there is no window: nothing in it touches window or document at module load;
 *   (h) every slot's filler carries the tone of the wood beside its cut (the compact slot a
 *       tone at each end);
 *   (i) THE FEATHER HIDES ON SCROLL (owner, 2026-09-17): the state logic, and the feather's
 *       columns end before every cut, so its layer holds the first segment alone;
 *   (j) the hover glow boxes sit inside their controls;
 *   (b2) THE PLATE IS CENTRED BETWEEN ITS BINDINGS (owner, 2026-11-09, amending the header law
 *       for this one cut): the blank plate's centre is the centre of the span from binding 7's
 *       right edge to the arrowhead's binding's left edge, within one column, and the slip, the
 *       field and the rivets moved with it (FIX-ARROW-PLAQUE).
 */
import { describe, expect, it } from 'vitest';
import {
  BAND_H, BARB_HANG_H, BINDINGS, COMPACT_JOIN, COMPACT_MIN_SLOT, COMPACT_W, COMPENDIUM_FE, CUTS, EQUAL_EXTRA,
  FE, FEATHER_FROM, FEATHER_RAMP, FEATHER_X1, FILLER_W, FULL_MIN_VIEWPORT, GLOW_PAD, GLOW_ROWS, HANG_H, HOME,
  LOGO_PLATE, NAV_HIT, NAV_WORD, PARTS, SECTION_W_MEAN, SECTION_W_SORTED, waterLevel, PLATE, PLATE_FIELD, PLATE_RIVETS, S_MAX, SECTION_W, SECTION_W_MAX,
  SHORT_CAP, SLIP, SLOT_TONE, STRIP_W, WOOD_RUNS, WORD_FLOOR, WORD_ROWS, SEAM_BAND_TO, SEAM_HANG_FROM,
  featherShown, fullScale, glowSpan, layoutArrow, padTarget,
} from '../../src/components/nav/arrowGeometry.js';
import { NAV } from '../../src/lib/routes.js';
import { legacy } from '../../src/design/tokens.js';

const EPS = 1e-6;
/** Where the slots open: the painting reaches S_MAX, STRIP_W x S_MAX. */
const UNCUT_BELOW = 1279.8;
/**
 * THE CATCH-UP: the width whose extra lifts every section to Compendium's 160 painted columns,
 * (STRIP_W + EQUAL_EXTRA) x S_MAX. A literal, so the equality pin below cannot run over an
 * empty range if the geometry loses its constants ((d) holds the two together).
 */
const CATCH_UP = 1379.9;

/**
 * Every cut that lacks its own `fe` (FE when it names none) columns of plain wood on either
 * side, as readable strings.
 * @param {ReadonlyArray<{ x: number, fe?: number }>} cuts
 */
function cutViolations(cuts) {
  return cuts
    .filter(({ x, fe = FE }) => !WOOD_RUNS.some((run) => run.x0 <= x - fe && x + fe <= run.x1))
    .map(({ x, fe = FE }) => `cut ${x} has no ${fe}-column margin of plain wood on both sides`);
}

/** The six sections' CSS widths, binding 1 to binding 7, in a layout. */
const sectionWidths = ({ mapX }) => BINDINGS.slice(0, 6).map((b, i) => mapX(BINDINGS[i + 1].x0) - mapX(b.x1));

/** Everything a layout must satisfy at its width, as a list of failures. */
function layoutFailures(layout) {
  const out = [];
  const { s, width, segments, fillers } = layout;
  const tag = `${layout.mode} ${width}`;
  // Each join's crossfade width, strip px: its cut's own `fe` on the full arrow, FE at the compact join.
  const fes = layout.mode === 'compact' ? [FE] : CUTS.map((c) => c.fe);
  const last = segments[segments.length - 1];
  if (Math.abs(last.coreX + last.coreW - width) > 0.01) out.push(`${tag}: ends at ${last.coreX + last.coreW}`);
  if (Math.abs(segments[0].coreX) > EPS) out.push(`${tag}: starts at ${segments[0].coreX}`);
  if (fillers.length !== segments.length - 1) out.push(`${tag}: ${fillers.length} fillers for ${segments.length} segments`);
  segments.forEach((seg, i) => {
    const wantL = i > 0 ? fes[i - 1] * s : 0;
    const wantR = i < segments.length - 1 ? fes[i] * s : 0;
    if (Math.abs(seg.fadeL - wantL) > EPS || Math.abs(seg.fadeR - wantR) > EPS) out.push(`${tag}: segment ${i} fades ${seg.fadeL}/${seg.fadeR}`);
    if (Math.abs(seg.x - (seg.coreX - seg.fadeL)) > EPS) out.push(`${tag}: segment ${i} box x`);
    if (Math.abs(seg.w - (seg.coreW + seg.fadeL + seg.fadeR)) > EPS) out.push(`${tag}: segment ${i} box w`);
    if (s > 0 && Math.abs((seg.to - seg.from) * s - seg.w) > EPS) out.push(`${tag}: segment ${i} shows ${seg.to - seg.from} columns in ${seg.w} px`);
    if (i < segments.length - 1) {
      const next = segments[i + 1];
      const filler = fillers[i];
      const end = seg.coreX + seg.coreW;
      if (Math.abs(end + filler.slot - next.coreX) > EPS) out.push(`${tag}: segment ${i} and its slot do not meet segment ${i + 1}`);
      if (Math.abs(filler.x - (end - fes[i] * s)) > EPS || Math.abs(filler.w - (filler.slot + 2 * fes[i] * s)) > EPS) {
        out.push(`${tag}: filler ${i} does not span its slot plus both crossfades`);
      }
      if (filler.slot < -EPS) out.push(`${tag}: slot ${i} is negative`);
    }
  });
  return out;
}

describe('(a) the painted regions follow NAV', () => {
  it('NAV_HIT and NAV_WORD are keyed by NAV ids, in NAV order', () => {
    const ids = NAV.map((n) => n.id);
    expect(ids).toEqual(['generate', 'settlements', 'realm', 'compendium', 'gallery', 'about-what-this-is']);
    expect(Object.keys(NAV_HIT)).toEqual(ids);
    expect(Object.keys(NAV_WORD)).toEqual(ids);
  });

  it('the painted words are the NAV labels, left to right', () => {
    expect(NAV.map((n) => n.label)).toEqual(['Create', 'Library', 'Realm', 'Compendium', 'Gallery', 'About']);
  });
});

describe('(b) the measured tables agree with each other', () => {
  it('every cut sits inside a plain-wood run with its own fe columns to spare on both sides', () => {
    expect(cutViolations(CUTS)).toEqual([]);
    const cx = [COMPACT_JOIN.left, COMPACT_JOIN.right].map((x) => ({ x }));
    expect(cutViolations(cx)).toEqual([]);
  });

  it('CONTROL: the cut check convicts a cut inside a word, a cut against the first binding, and a Compendium cut at the full FE', () => {
    // 1100 is inside the word Compendium; 511 is the old compact join, against binding 1;
    // 1032 is Compendium's left cut, whose 10-column gap holds 5 columns a side, not 10.
    expect(cutViolations([{ x: 1100 }, { x: 511 }, { x: 558 }, { x: 1032, fe: FE }, { x: 1032, fe: COMPENDIUM_FE }])).toEqual([
      'cut 1100 has no 10-column margin of plain wood on both sides',
      'cut 511 has no 10-column margin of plain wood on both sides',
      'cut 1032 has no 10-column margin of plain wood on both sides',
    ]);
  });

  it('the cuts are ordered, two per painted word beside its bindings, two on Compendium at fe 5, the plate\'s cut last', () => {
    const xs = CUTS.map((c) => c.x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
    expect(PARTS).toBe(7);
    expect(CUTS.filter((c) => c.fe !== FE)).toEqual([{ x: 1032, fe: COMPENDIUM_FE }, { x: 1181, fe: COMPENDIUM_FE }]);
    const perWord = Object.fromEntries(Object.entries(NAV_HIT).map(([id, hit]) => [
      id, xs.filter((x) => x >= hit.x0 && x < hit.x1),
    ]));
    expect(perWord).toEqual({
      generate: [558, 657],
      settlements: [713, 825],
      realm: [881, 982],
      compendium: [1032, 1181],
      gallery: [1234, 1350],
      'about-what-this-is': [1413, 1516],
    });
    // Every word cut is outside the word's own lettering.
    for (const [id, cuts] of Object.entries(perWord)) {
      const word = NAV_WORD[id];
      const fe = (x) => CUTS.find((c) => c.x === x).fe;
      expect(cuts.filter((x) => x + fe(x) > word.x0 && x - fe(x) < word.x1), id).toEqual([]);
      // One cut before the lettering and one after, so a word's two slots sit either side of it.
      expect(cuts.map((x) => x < word.x0), id).toEqual([true, false]);
    }
    // The plate's cut moved from 1596 to 1586 with the plate (FIX-ARROW-PLAQUE, 2026-11-09): at
    // 1596 its crossfade would reach the moved tip at 1601.
    expect(CUTS[CUTS.length - 1]).toEqual({ x: 1586, fe: FE });
    expect(CUTS[CUTS.length - 1].x + FE).toBeLessThanOrEqual(PLATE.x0);
    expect(CUTS[CUTS.length - 1].x).toBeLessThan(PLATE.x0);
  });

  it("Compendium's two gaps are narrower than an FE pair but hold a COMPENDIUM_FE pair, one cut in each", () => {
    const hit = NAV_HIT.compendium;
    const gaps = WOOD_RUNS.filter((r) => r.x0 >= hit.x0 && r.x1 <= hit.x1);
    expect(gaps.map((r) => r.x1 - r.x0)).toEqual([10, 11]);
    expect(gaps.filter((r) => r.x1 - r.x0 >= 2 * FE)).toEqual([]);
    expect(gaps.every((r) => r.x1 - r.x0 >= 2 * COMPENDIUM_FE)).toBe(true);
    expect(gaps.map((r) => CUTS.filter((c) => c.x >= r.x0 && c.x < r.x1).map((c) => c.x))).toEqual([[1032], [1181]]);
  });

  it('the sections are the painting\'s six, binding to binding, and Compendium is the widest', () => {
    expect(SECTION_W).toEqual([121, 134, 124, 160, 145, 133]);
    expect(SECTION_W_MAX).toBe(160);
    expect(SECTION_W).toEqual(BINDINGS.slice(0, 6).map((b, i) => BINDINGS[i + 1].x0 - b.x1));
    expect(SECTION_W).toEqual(Object.values(NAV_HIT).map((hit) => hit.x1 - hit.x0));
    // The literals the layout reads, held to their derivation (literals keep the bundle small).
    expect(SECTION_W_SORTED).toEqual([...SECTION_W].sort((x, y) => x - y));
    expect(SECTION_W_MAX).toBe(Math.max(...SECTION_W));
    expect(SECTION_W_MEAN).toBeCloseTo(SECTION_W.reduce((t, w) => t + w, 0) / SECTION_W.length, 12);
    expect(PARTS).toBe(SECTION_W.length + 1);
    // Seven parts lift all six to 160 at S_MAX: 7 / 6 x (6 x 160 - 817) strip px.
    expect(EQUAL_EXTRA).toBeCloseTo(166.8333, 4);
  });

  it('the bindings separate home, the six regions and the plate', () => {
    const regions = Object.values(NAV_HIT);
    expect(HOME).toEqual({ x0: 0, x1: BINDINGS[0].x0 });
    regions.forEach((hit, i) => {
      expect(hit.x0).toBe(BINDINGS[i].x1);
      expect(hit.x1).toBe(BINDINGS[i + 1].x0);
    });
    expect(BINDINGS[6].x1).toBeLessThanOrEqual(PLATE.x0);
    expect(PLATE.x1).toBeLessThanOrEqual(BINDINGS[7].x0);
    for (const [id, word] of Object.entries(NAV_WORD)) {
      expect(word.x0 > NAV_HIT[id].x0 && word.x1 < NAV_HIT[id].x1, id).toBe(true);
    }
  });

  it('(b2) the blank plate is centred between binding 7 and the arrowhead\'s binding, within one column', () => {
    // Red at the painting as first cut: the plate [1623, 1877) centred at 1750 against the span
    // [1566, 1889)'s 1727.5, 22.5 columns toward the arrowhead. The re-cut moved it 22 columns.
    const span = (BINDINGS[6].x1 + BINDINGS[7].x0) / 2;
    const plate = (PLATE.x0 + PLATE.x1) / 2;
    expect(Math.abs(plate - span), `plate centre ${plate}, span centre ${span}`).toBeLessThanOrEqual(1);
    // The wood either side differs by at most one column, so the centring is not an artefact of
    // the bindings' own widths.
    expect(Math.abs((PLATE.x0 - BINDINGS[6].x1) - (BINDINGS[7].x0 - PLATE.x1))).toBeLessThanOrEqual(1);
    // The slip, the field and the rivets moved with the plate, column for column: each keeps the
    // offset from the plate's left tip it had in the painting (the field, the rivets and the slip
    // sit 2.5 to 4 columns right of the tip-to-tip centre there, and still do).
    expect([SLIP.x0, SLIP.x1, PLATE_FIELD.x0, PLATE_FIELD.x1, PLATE_RIVETS[0].x0, PLATE_RIVETS[1].x1].map((x) => x - PLATE.x0))
      .toEqual([1683, 1825, 1672, 1833, 1664, 1843].map((x) => x - 1623));
    expect([SLIP.y0, SLIP.y1, PLATE_FIELD.y0, PLATE_FIELD.y1]).toEqual([13, 49, 11, 51]);
  });

  it('CONTROL: the centring pin convicts the plate where the painting first set it', () => {
    const span = (BINDINGS[6].x1 + BINDINGS[7].x0) / 2;
    expect(Math.abs((1623 + 1877) / 2 - span)).toBeGreaterThan(1);
  });

  it('the slip sits inside the plate field, clear of both rivets', () => {
    expect(SLIP.x0 >= PLATE_FIELD.x0 && SLIP.x1 <= PLATE_FIELD.x1).toBe(true);
    expect(SLIP.y0 >= PLATE_FIELD.y0 && SLIP.y1 <= PLATE_FIELD.y1).toBe(true);
    expect(PLATE_RIVETS.map((r) => r.x1 <= SLIP.x0 || r.x0 >= SLIP.x1)).toEqual([true, true]);
    // The lettering stays inside the band it is painted on; nothing is drawn under it since
    // the owner removed the active-page mark (2026-09-19), so no rect hangs below the word.
    expect(WORD_ROWS.bottom).toBeLessThan(BAND_H);
  });

  it('the word floor sets the switch', () => {
    expect(FULL_MIN_VIEWPORT).toBe(Math.ceil(STRIP_W * WORD_FLOOR));
    // The tail crop starts at the plate's cut, 1586 since the plate moved (it was 1596).
    expect(COMPACT_W).toBe(558 + (STRIP_W - 1586));
  });
});

describe('(c) every width from 320 to 3840 px, both compositions', () => {
  it('the full arrow tiles exactly at every width', () => {
    const failures = [];
    for (let cw = 320; cw <= 3840; cw += 1) {
      const layout = layoutArrow({ clientWidth: cw, full: true });
      failures.push(...layoutFailures(layout));
      const slotted = layout.segments.length > 1;
      if (slotted !== cw >= UNCUT_BELOW) failures.push(`full ${cw}: slotted=${slotted}`);
      if (slotted && layout.segments.length !== CUTS.length + 1) failures.push(`full ${cw}: ${layout.segments.length} segments`);
      if (layout.s > S_MAX + EPS) failures.push(`full ${cw}: s ${layout.s} past S_MAX`);
    }
    expect(failures).toEqual([]);
  });

  it('the compact arrow tiles exactly at every width, on both viewport heights', () => {
    const failures = [];
    for (const short of [false, true]) {
      for (let cw = 320; cw <= 3840; cw += 1) {
        const layout = layoutArrow({ clientWidth: cw, full: false, short });
        failures.push(...layoutFailures(layout));
        if (layout.segments.length !== 2) failures.push(`compact ${cw}: ${layout.segments.length} segments`);
        if (layout.fillers[0].slot < COMPACT_MIN_SLOT * layout.s - EPS) failures.push(`compact ${cw}: slot ${layout.fillers[0].slot}`);
        if (layout.segments[0].from !== 0 || layout.segments[0].to !== COMPACT_JOIN.left + FE) failures.push(`compact ${cw}: brand crop`);
        if (layout.segments[1].from !== COMPACT_JOIN.right - FE || layout.segments[1].to !== STRIP_W) failures.push(`compact ${cw}: tail crop`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('CONTROL: the tiling check convicts a layout whose filler does not cover a crossfade', () => {
    const layout = layoutArrow({ clientWidth: 1920, full: true });
    expect(layoutFailures(layout)).toEqual([]);
    const broken = { ...layout, fillers: layout.fillers.map((f, i) => (i === 3 ? { ...f, w: f.slot } : f)) };
    expect(layoutFailures(broken)).toEqual(['full 1920: filler 3 does not span its slot plus both crossfades']);
  });

  it('CONTROL: the tiling check convicts a Compendium filler laid at the full FE', () => {
    const layout = layoutArrow({ clientWidth: 1920, full: true });
    const broken = { ...layout, fillers: layout.fillers.map((f, i) => (i === 6 ? { ...f, x: f.x + COMPENDIUM_FE * layout.s - FE * layout.s, w: f.slot + 2 * FE * layout.s } : f)) };
    expect(layoutFailures(broken)).toEqual(['full 1920: filler 6 does not span its slot plus both crossfades']);
  });

  it('the mode follows the full flag, and the uncut arrow is one segment with no fade', () => {
    expect(layoutArrow({ clientWidth: 1280, full: true }).mode).toBe('full');
    expect(layoutArrow({ clientWidth: 1280, full: false }).mode).toBe('compact');
    const uncut = layoutArrow({ clientWidth: 1279, full: true });
    expect(uncut.segments).toHaveLength(1);
    const [only] = uncut.segments;
    expect([only.x, only.from, only.to, only.fadeL, only.fadeR, only.coreX]).toEqual([0, 0, STRIP_W, 0, 0, 0]);
    expect(only.w).toBeCloseTo(1279, 9);
    expect(uncut.fillers).toEqual([]);
  });
});

describe('(c2) the six sections are equal between their red bindings, and grow together', () => {
  it('within 1 px at every full width from the uncut threshold to 3840, the whole ending at the page width', () => {
    const failures = [];
    let prev = 0;
    let checked = 0;
    for (let cw = Math.ceil(CATCH_UP); cw <= 3840; cw += 1) {
      checked += 1;
      const layout = layoutArrow({ clientWidth: cw, full: true });
      const w = sectionWidths(layout);
      const spread = Math.max(...w) - Math.min(...w);
      if (spread > 1) failures.push(`${cw}: sections ${w.map((v) => v.toFixed(1)).join(' ')}`);
      if (w[0] < prev - EPS) failures.push(`${cw}: the sections shrank as the page widened`);
      if (Math.abs(layout.mapX(STRIP_W) - cw) > 0.01) failures.push(`${cw}: ends at ${layout.mapX(STRIP_W)}`);
      prev = w[0];
    }
    expect(checked).toBe(3840 - 1380 + 1);
    expect(failures.slice(0, 3)).toEqual([]);
  });

  it('each section is its painted width plus its own two slots, split equally either side of its word', () => {
    for (const cw of [1440, 1920, 2560, 3840]) {
      const layout = layoutArrow({ clientWidth: cw, full: true });
      const w = sectionWidths(layout);
      Object.values(NAV_HIT).forEach((hit, k) => {
        const own = layout.fillers.filter((_, i) => CUTS[i].x > hit.x0 && CUTS[i].x < hit.x1).map((f) => f.slot);
        expect(own, `${cw} section ${k}`).toHaveLength(2);
        expect(own[0]).toBeCloseTo(own[1], 9);
        expect(w[k]).toBeCloseTo(SECTION_W[k] * layout.s + own[0] + own[1], 9);
      });
      // The plate's slot is one part in seven of the extra: one section's growth on average.
      const extra = cw - STRIP_W * layout.s;
      expect(layout.fillers[CUTS.length - 1].slot).toBeCloseTo(extra / PARTS, 9);
    }
  });

  it('pins the sections at named widths: 104.6 at 1440, 173.2 at 1920, 264.6 at 2560, 447.4 at 3840; at the threshold each is Compendium\'s painted width', () => {
    expect([1440, 1920, 2560, 3840].map((cw) => Number(sectionWidths(layoutArrow({ clientWidth: cw, full: true }))[0].toFixed(1))))
      .toEqual([104.6, 173.2, 264.6, 447.4]);
    const at = layoutArrow({ clientWidth: Math.ceil(CATCH_UP), full: true });
    expect(sectionWidths(at)[0]).toBeGreaterThanOrEqual(SECTION_W_MAX * S_MAX - EPS);
    expect(sectionWidths(at)[0]).toBeLessThan(SECTION_W_MAX * S_MAX + 1);
  });

  it('below the catch-up the extra water-fills: the narrowest sections rise together, none shrinks, none passes the level', () => {
    const failures = [];
    let prev = sectionWidths(layoutArrow({ clientWidth: 1279, full: true }));
    for (let cw = 1280; cw < CATCH_UP + 1; cw += 0.5) {
      const layout = layoutArrow({ clientWidth: cw, full: true });
      const w = sectionWidths(layout);
      const lifted = Math.min(...w);
      w.forEach((v, k) => {
        if (v < SECTION_W[k] * layout.s - EPS) failures.push(`${cw}: section ${k} under its painting`);
        if (v < prev[k] - EPS) failures.push(`${cw}: section ${k} shrank`);
        // A section is either at the level (the narrowest, lifted together) or still its painting.
        if (Math.abs(v - lifted) > EPS && Math.abs(v - SECTION_W[k] * layout.s) > EPS) failures.push(`${cw}: section ${k} is neither level nor painted`);
      });
      prev = w;
    }
    expect(failures.slice(0, 3)).toEqual([]);
    expect(waterLevel(0)).toBe(121);
    expect(waterLevel(EQUAL_EXTRA * 6 / PARTS)).toBeCloseTo(SECTION_W_MAX, 9);
  });

  it('pins the water-fill at named widths: 1300 lifts Create, Library, Realm and About to 81.1; 1340 leaves only Compendium above, 89.2', () => {
    const at = (cw) => sectionWidths(layoutArrow({ clientWidth: cw, full: true })).map((v) => Number(v.toFixed(1)));
    expect(at(1300)).toEqual([81.1, 81.1, 81.1, 96.0, 87.0, 81.1]);
    expect(at(1340)).toEqual([89.2, 89.2, 89.2, 96.0, 89.2, 89.2]);
    expect(at(1380)).toEqual([96.0, 96.0, 96.0, 96.0, 96.0, 96.0]);
  });

  it('continuity: s and every section move by under 1 px per page pixel, through both old thresholds (1303.8 and 1380)', () => {
    // Per page PIXEL, not across W - 1 .. W + 1: while one section is the narrowest it takes
    // the sections' whole share, 6/7 px per page pixel, so two pixels move it 1.71 px. The
    // bound is a jump detector: the parent jumped 2.77 px at 1303.8, the threshold cut 17.8 px at 1380.
    const failures = [];
    for (let w = 1240; w <= 1420; w += 0.25) {
      const lo = layoutArrow({ clientWidth: w, full: true });
      const hi = layoutArrow({ clientWidth: w + 1, full: true });
      if (Math.abs(hi.s - lo.s) > 1 / STRIP_W + EPS) failures.push(`${w}: s ${lo.s} -> ${hi.s}`);
      const a = sectionWidths(lo);
      const b = sectionWidths(hi);
      a.forEach((v, k) => { if (Math.abs(b[k] - v) > 1 + EPS) failures.push(`${w}: section ${k} ${v.toFixed(2)} -> ${b[k].toFixed(2)}`); });
    }
    expect(failures.slice(0, 3)).toEqual([]);
  });

  it('CONTROL: the equality check convicts the painting\'s own unequal sections, uncut below S_MAX', () => {
    const w = sectionWidths(layoutArrow({ clientWidth: 1279, full: true }));
    expect(Math.max(...w) - Math.min(...w)).toBeGreaterThan(20);
  });
});

describe('(d) the scale', () => {
  it('pins the zones at named widths', () => {
    expect(layoutArrow({ clientWidth: 1024, full: true }).s).toBeCloseTo(1024 / 2133, 12);
    // Uncut until the painting reaches S_MAX; then the slots open and s holds.
    const at1279 = layoutArrow({ clientWidth: 1279, full: true });
    expect(at1279.share).toBe(0);
    expect(at1279.s).toBeCloseTo(1279 / 2133, 12);
    const at1280 = layoutArrow({ clientWidth: 1280, full: true });
    expect(at1280.s).toBe(S_MAX);
    expect(at1280.share).toBeCloseTo((1280 - 1279.8) / 7, 9);
    const at1380 = layoutArrow({ clientWidth: 1380, full: true });
    expect(at1380.s).toBe(S_MAX);
    expect(at1380.share).toBeCloseTo((1380 - 1279.8) / 7, 9);
    const at1920 = layoutArrow({ clientWidth: 1920, full: true });
    expect(at1920.s).toBe(S_MAX);
    expect(at1920.share).toBeCloseTo((1920 - 1279.8) / 7, 9);
    const at3840 = layoutArrow({ clientWidth: 3840, full: true });
    expect(at3840.s).toBe(S_MAX);
    expect(at3840.share).toBeCloseTo((3840 - 1279.8) / 7, 9);
    // s = min(S_MAX, cw / STRIP_W) at every width (the chair's ruling, 2026-11-08): no tile zone.
    const at4400 = layoutArrow({ clientWidth: 4400, full: true });
    expect(at4400.s).toBe(S_MAX);
    expect(at4400.share).toBeCloseTo((4400 - 1279.8) / 7, 9);
    expect(FILLER_W).toBe(372);
    expect((STRIP_W + EQUAL_EXTRA) * S_MAX).toBeCloseTo(CATCH_UP, 9);
    expect(STRIP_W * S_MAX).toBeCloseTo(UNCUT_BELOW, 9);
  });

  it('the full arrow keeps the word floor, holds S_MAX while wood is inserted, and moves continuously inside each zone', () => {
    const failures = [];
    let prev = fullScale(1009);
    for (let cw = 1009; cw <= 4800; cw += 1) {
      const { s } = fullScale(cw);
      if (s < 0.47) failures.push(`${cw}: s ${s} under the floor`);
      // The chair's ruling (2026-11-08): no scale past S_MAX, at any width.
      if (s > S_MAX + EPS) failures.push(`${cw}: s ${s} past S_MAX`);
      if (cw >= UNCUT_BELOW && s !== S_MAX) failures.push(`${cw}: s ${s} is not S_MAX`);
      // Continuous across the zone join too: no jump anywhere (the parent dropped 0.611 -> 0.6).
      if (cw > 1009 && Math.abs(s - prev.s) > 1 / STRIP_W + EPS) failures.push(`${cw}: s jumps ${prev.s} -> ${s}`);
      prev = { s, share: 0 };
    }
    expect(failures).toEqual([]);
  });

  it('the compact arrow: S_MAX at most, the short cap on landscape phones only, and the full arrow ignores the flag', () => {
    expect(layoutArrow({ clientWidth: 900, full: false }).s).toBe(S_MAX);
    expect(layoutArrow({ clientWidth: 390, full: false }).s).toBeCloseTo(390 / (COMPACT_W + COMPACT_MIN_SLOT), 12);
    const short = layoutArrow({ clientWidth: 900, full: false, short: true });
    expect(SHORT_CAP).toBe(0.36);
    expect(short.s).toBe(SHORT_CAP);
    expect(short.fillers[0].slot).toBeCloseTo(900 - COMPACT_W * SHORT_CAP, 9);
    expect(layoutArrow({ clientWidth: 1440, full: true, short: true })).toEqual(
      expect.objectContaining({ s: S_MAX, share: layoutArrow({ clientWidth: 1440, full: true }).share }),
    );
  });
});

describe('(e) the hit rectangles', () => {
  it('ordered, disjoint, in bounds, each widened only by its own slots, at least 24 px at the floor', () => {
    const failures = [];
    const ids = Object.keys(NAV_HIT);
    for (let cw = 1009; cw <= 3840; cw += 7) {
      const { hits, s, width, mapX, fillers } = layoutArrow({ clientWidth: cw, full: true });
      const chain = [hits.home, ...ids.map((id) => hits.nav[id]), hits.plate];
      chain.forEach((r, i) => {
        if (r.x < -EPS || r.x + r.w > width + EPS) failures.push(`${cw}: rect ${i} out of bounds`);
        if (i > 0 && chain[i - 1].x + chain[i - 1].w > r.x + EPS) failures.push(`${cw}: rect ${i} overlaps its left neighbour`);
        if (r.h !== BAND_H * s) failures.push(`${cw}: rect ${i} height`);
      });
      for (const id of ids) {
        const span = NAV_HIT[id];
        const own = fillers.reduce((n, f, i) => (CUTS[i].x > span.x0 && CUTS[i].x < span.x1 ? n + f.slot : n), 0);
        const want = (span.x1 - span.x0) * s + own;
        if (Math.abs(hits.nav[id].w - want) > EPS) failures.push(`${cw}: ${id} width ${hits.nav[id].w} vs ${want}`);
        if (hits.nav[id].w < 24) failures.push(`${cw}: ${id} narrower than 24 px`);
        // The hit region is the control's whole box: it must contain the painted word it
        // names, at every width. (It used to have to contain a plaque too; the owner removed
        // that mark on 2026-09-19 and the region is now the only rect a word owns.)
        const word = NAV_WORD[id];
        const wordRect = { x: hits.nav[id].x, w: hits.nav[id].w };
        if (mapX(word.x0) < wordRect.x - EPS || mapX(word.x1) > wordRect.x + wordRect.w + EPS) {
          failures.push(`${cw}: ${id} lettering outside its hit region`);
        }
      }
      const { slip, plate } = hits;
      if (slip.x < plate.x || slip.x + slip.w > plate.x + plate.w || slip.y < 0 || slip.y + slip.h > plate.h) failures.push(`${cw}: slip outside the plate`);
    }
    expect(failures).toEqual([]);
  });

  it('pins the floor widths at 1009: Create about 57 px, home about 242 px', () => {
    const { hits } = layoutArrow({ clientWidth: 1009, full: true });
    expect(hits.nav.generate.w).toBeCloseTo(121 * (1009 / 2133), 9);
    expect(hits.home.w).toBeCloseTo(512 * (1009 / 2133), 9);
  });

  it('the compact arrow has home, plate and slip and no painted-word regions', () => {
    for (const cw of [320, 390, 640, 1023]) {
      const { hits, width } = layoutArrow({ clientWidth: cw, full: false });
      expect(Object.keys(hits.nav)).toEqual([]);
      expect(hits.home.x).toBe(0);
      expect(hits.home.w).toBeLessThanOrEqual(hits.plate.x);
      expect(hits.plate.x + hits.plate.w).toBeLessThanOrEqual(width + EPS);
      expect(hits.slip.x).toBeGreaterThan(hits.plate.x);
      expect(hits.slip.x + hits.slip.w).toBeLessThan(hits.plate.x + hits.plate.w);
    }
  });
});

describe('(f) heights, mapX and padTarget', () => {
  it('band 68s, hang 110s, barb 41s', () => {
    for (const [cw, full] of [[390, false], [1024, true], [1920, true], [3840, true]]) {
      const l = layoutArrow({ clientWidth: cw, full });
      expect(l.bandPx).toBeCloseTo(68 * l.s, 12);
      expect(l.hangPx).toBeCloseTo(110 * l.s, 12);
      expect(l.barbHangPx).toBeCloseTo(41 * l.s, 12);
    }
    expect([BAND_H, HANG_H, BARB_HANG_H]).toEqual([68, 110, 41]);
  });

  it('mapX is monotone, starts at 0 and ends at the page width in both compositions', () => {
    const failures = [];
    for (const [cw, full] of [[390, false], [800, false], [1280, true], [1600, true], [3000, true]]) {
      const { mapX } = layoutArrow({ clientWidth: cw, full });
      let prev = -1;
      for (let col = 0; col <= STRIP_W; col += 1) {
        const x = mapX(col);
        if (x < prev - EPS) failures.push(`${full ? 'full' : 'compact'} ${cw}: mapX(${col}) moved left`);
        prev = x;
      }
      if (mapX(0) !== 0) failures.push(`${cw}: mapX(0)`);
      if (Math.abs(mapX(STRIP_W) - cw) > 0.01) failures.push(`${cw}: mapX(${STRIP_W}) = ${mapX(STRIP_W)}`);
    }
    expect(failures).toEqual([]);
    // A cut column lands after its slot: the right-hand segment starts there.
    const l = layoutArrow({ clientWidth: 1920, full: true });
    expect(l.mapX(558)).toBeCloseTo(l.segments[1].coreX, 9);
    expect(l.mapX(557)).toBeCloseTo(557 * S_MAX, 9);
  });

  it('padTarget grows a box to the minimum within the page and never shrinks it', () => {
    expect(padTarget({ x: 100, y: 0, w: 20, h: 23 }, 44, 390)).toEqual({ x: 88, y: 0, w: 44, h: 44 });
    expect(padTarget({ x: 0, y: 0, w: 20, h: 23 }, 44, 390)).toEqual({ x: 0, y: 0, w: 44, h: 44 });
    expect(padTarget({ x: 380, y: 0, w: 10, h: 23 }, 44, 390)).toEqual({ x: 346, y: 0, w: 44, h: 44 });
    expect(padTarget({ x: 10, y: 0, w: 174, h: 50 }, 44, 390)).toEqual({ x: 10, y: 0, w: 174, h: 50 });
  });
});

describe('(f2) the seam: the band and hang layers overlap inside the opaque shaft', () => {
  it('the hang starts above where the band stops, both inside the band, and the overlap is at least 2 CSS px at every width it renders', () => {
    expect(SEAM_HANG_FROM).toBeLessThan(SEAM_BAND_TO);
    expect(SEAM_BAND_TO).toBeLessThanOrEqual(BAND_H);
    let smallest = Infinity;
    for (let cw = 320; cw <= 3840; cw += 1) {
      // The compact arrow renders below the 1024 switch (short landscape phones included); the
      // full arrow from it, less a classic scrollbar's width.
      const renders = [
        ...(cw < FULL_MIN_VIEWPORT ? [{ full: false, short: false }, { full: false, short: true }] : []),
        ...(cw >= FULL_MIN_VIEWPORT - 20 ? [{ full: true, short: false }] : []),
      ];
      for (const mode of renders) {
        const { s } = layoutArrow({ clientWidth: cw, ...mode });
        smallest = Math.min(smallest, (SEAM_BAND_TO - SEAM_HANG_FROM) * s);
      }
    }
    expect(smallest).toBeGreaterThanOrEqual(2);
  });
});

describe('(g) the width store in a windowless environment', () => {
  it('imports, reads the fallback width and subscribes without a window or a document', async () => {
    expect([typeof window, typeof document]).toEqual(['undefined', 'undefined']);
    const store = await import('../../src/components/nav/useChromeWidth.js');
    expect(store.readChromeWidth()).toEqual({ clientWidth: store.CHROME_WIDTH_FALLBACK, short: false });
    expect(store.CHROME_WIDTH_FALLBACK).toBe(FULL_MIN_VIEWPORT);
    const unsubscribe = store.subscribeChromeWidth(() => {});
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });
});

describe('(h) each slot is toned to the wood beside its cut', () => {
  it('the full arrow\'s fillers carry their cut\'s tone at both ends, in cut order', () => {
    const { fillers } = layoutArrow({ clientWidth: 1920, full: true });
    expect(fillers.map((f) => [f.toneL, f.toneR])).toEqual(CUTS.map((c) => [SLOT_TONE[c.x], SLOT_TONE[c.x]]));
    expect(Object.values(SLOT_TONE).every((k) => k > 0.7 && k < 1.2)).toBe(true);
  });

  it('the compact slot takes its left cut\'s tone at its left end and its right cut\'s at its right end', () => {
    for (const cw of [320, 390, 800, 1023]) {
      const [only] = layoutArrow({ clientWidth: cw, full: false }).fillers;
      expect([only.toneL, only.toneR]).toEqual([SLOT_TONE[COMPACT_JOIN.left], SLOT_TONE[COMPACT_JOIN.right]]);
    }
    expect(SLOT_TONE[COMPACT_JOIN.left]).not.toBe(SLOT_TONE[COMPACT_JOIN.right]);
  });
});

describe('(i) the feather hides on scroll', () => {
  it('shows only at the very top: under 1 px, sub-pixel positions and the overscroll bounce included', () => {
    expect([0, 0.25, 0.5, 0.999, -12].map(featherShown)).toEqual([true, true, true, true, true]);
    expect([1, 1.5, 2, 400, 90000].map(featherShown)).toEqual([false, false, false, false, false]);
    // A value that is not a position is never a scroll away from the top.
    expect(featherShown(Number.NaN)).toBe(true);
  });

  it('the feather\'s columns end before the first cut and the compact join, so its layer holds the first segment alone', () => {
    expect(FEATHER_X1 + FE).toBeLessThanOrEqual(Math.min(CUTS[0].x, COMPACT_JOIN.left) - FE);
    expect(FEATHER_X1).toBeLessThan(HOME.x1);
    for (const [cw, full] of [[390, false], [1023, false], [1280, true], [1920, true], [3000, true]]) {
      const l = layoutArrow({ clientWidth: cw, full });
      const clip = l.mapX(FEATHER_X1);
      expect(clip).toBeCloseTo(FEATHER_X1 * l.s, 9);
      expect(l.segments.filter((seg) => seg.x < clip)).toHaveLength(1);
      expect(l.fillers.filter((f) => f.x < clip)).toEqual([]);
    }
  });

  it('the feather layer overlaps the always-drawn hang by at least 2 CSS px, and is whole for more than 1 CSS px of it, at every rendered scale', () => {
    expect(FEATHER_FROM).toBeLessThan(BAND_H);
    let smallest = Infinity;
    let smallestWhole = Infinity;
    for (let cw = 320; cw <= 3840; cw += 1) {
      for (const full of cw < FULL_MIN_VIEWPORT ? [false] : [true]) {
        const { s } = layoutArrow({ clientWidth: cw, full, short: true });
        smallest = Math.min(smallest, (BAND_H - FEATHER_FROM) * s);
        smallestWhole = Math.min(smallestWhole, (BAND_H - FEATHER_FROM - FEATHER_RAMP) * s);
      }
    }
    expect(smallest).toBeGreaterThanOrEqual(2);
    // The hang's mask edge lands up to a device pixel early; the feather is whole across it.
    expect(smallestWhole).toBeGreaterThan(1);
  });
});

describe('(j) the hover glow boxes', () => {
  it('each word\'s glow sits inside its region and clear of every slot; the plates\' glows inside their controls', () => {
    const failures = [];
    for (const [cw, full] of [[1024, true], [1440, true], [1920, true], [2560, true], [390, false], [800, false]]) {
      const { hits } = layoutArrow({ clientWidth: cw, full });
      const inside = (g, r, tag) => {
        if (g.x < r.x - EPS || g.x + g.w > r.x + r.w + EPS || g.y < r.y - EPS || g.y + g.h > r.y + r.h + EPS) failures.push(`${cw} ${tag}`);
      };
      inside(hits.glow.home, hits.home, 'home');
      inside(hits.glow.plate, hits.plate, 'plate');
      for (const id of Object.keys(hits.nav)) inside(hits.glow.nav[id], hits.nav[id], id);
      if (full !== (Object.keys(hits.glow.nav).length === 6)) failures.push(`${cw}: glow nav count`);
    }
    expect(failures).toEqual([]);
    for (const [id, word] of Object.entries(NAV_WORD)) {
      const box = glowSpan(id);
      expect(CUTS.filter((c) => c.x > box.x0 && c.x < box.x1), id).toEqual([]);
      // GLOW_PAD on both sides, except where a cut is nearer: only Compendium's (5 columns).
      const pad = id === 'compendium' ? COMPENDIUM_FE : GLOW_PAD;
      expect([word.x0 - box.x0, box.x1 - word.x1], id).toEqual([pad, pad]);
    }
    // The clipped glow ends before the slot: Compendium's glow is exactly its middle segment.
    const l = layoutArrow({ clientWidth: 1920, full: true });
    const g = l.hits.glow.nav.compendium;
    const mid = l.segments[CUTS.findIndex((c) => c.x === 1032) + 1];
    expect(g.x).toBeCloseTo(mid.coreX, 9);
    expect(g.x + g.w).toBeCloseTo(mid.coreX + mid.coreW, 9);
    expect(LOGO_PLATE.x0).toBeGreaterThan(HOME.x0);
    expect(LOGO_PLATE.x1).toBeLessThanOrEqual(HOME.x1);
    expect(GLOW_ROWS.top).toBeGreaterThanOrEqual(0);
    expect(GLOW_ROWS.bottom).toBeLessThanOrEqual(BAND_H);
  });
});

/**
 * ⭐⭐ (k) THE 44 PX CONTROL IS BIGGER THAN THE PAINTED BAND, AND THAT IS PAID FOR
 * (ODQ §934.63 noticed 7).
 *
 * The review measured the phone `<header>` box at 22 px with two 44 px buttons inside it
 * and slotted the question: "check whether anything depends on the header's box height".
 * The box really is that small — it is `HEADER_H`, which ArrowHeader writes as the painted
 * BAND's height, and at 375 px the band is 22.47 px — while `padTarget` grows both painted
 * plates to the 44 px touch floor. So each control hangs about 21.5 px BELOW its own
 * header.
 *
 * ⛔ THE CURE IS NOT TO GROW THE HEADER. `HEADER_H` is the sticky offset the whole shell
 * is hung from: the feather layer sticks at `top: HEADER_H`, the wizard toolbar pins
 * there, the landing pulls its hero up by it. Growing the box to 44 would slide the
 * painted feather 21.5 px down the page, which is re-cutting the owner's painting to fix
 * a hit target — and the painting is the owner's (§934.26). The controls are absolutely
 * positioned, so the overhang costs no layout; what it could cost is a COLLISION, and
 * that is what this arm measures instead of assuming.
 *
 * Two facts, executed over the shipped geometry at every narrow width:
 *   PAID      — the target really reaches 44 x 44, which is the whole reason it overhangs.
 *   CLEAR     — the overhang lands inside the reserve that already sits under the header:
 *               ARROW_HANG (the feather's own hang, `pointerEvents: 'none'`) plus the
 *               phone's `main` top padding. So the last row of the control is still above
 *               the first line of content, and neither can swallow the other's taps.
 * If a re-cut ever shrinks the hang under the overhang, CLEAR reds here rather than a
 * reader finding it with their thumb.
 */
describe('(k) the touch target overhangs the painted band, and the overhang is clear', () => {
  /** The touch floor ArrowHeader pads a phone control to (its own TOUCH_TARGET). */
  const TOUCH = 44;
  /** App.jsx's phone `main` top padding above `calc(ARROW_HANG + …)`: SP.md. */
  const MAIN_PAD_PHONE = legacy.SP.md;

  it('every narrow width pays the 44 px target on both painted plates', () => {
    const short = [];
    for (let cw = 280; cw < FULL_MIN_VIEWPORT; cw += 1) {
      const layout = layoutArrow({ clientWidth: cw, full: false });
      for (const key of ['home', 'plate']) {
        const box = padTarget(layout.hits[key], TOUCH, layout.width);
        if (box.h < TOUCH - EPS || box.w < TOUCH - EPS) short.push(`${cw}px ${key} ${box.w}x${box.h}`);
      }
    }
    expect(short, 'a painted control is under the 44px touch floor at some narrow width').toEqual([]);
  });

  it('the band really is SHORTER than the target, so this describe is about something', () => {
    // ⛔ ANTI-VACUITY. If the band ever grew past 44 the overhang would be zero and every
    // arm here would pass on nothing; the review's finding would also have gone away, and
    // a reader deserves to be told which world they are in.
    const band = layoutArrow({ clientWidth: 375, full: false }).bandPx;
    expect(band).toBeLessThan(TOUCH);
    // 22.47 until the re-cut (2026-11-09): the compact arrow's tail crop starts at 1586, not
    // 1596, since the plate moved, so its natural width is 1105 strip px and its scale cw / 1145.
    expect(Number(band.toFixed(2)), "the review's 22px header box").toBe(22.27);
  });

  it('the overhang never reaches the first line of content, at any narrow width', () => {
    const collisions = [];
    for (let cw = 280; cw < FULL_MIN_VIEWPORT; cw += 1) {
      const { bandPx, hangPx } = layoutArrow({ clientWidth: cw, full: false });
      const overhang = Math.max(0, TOUCH - bandPx);      // how far the control passes the box
      const reserve = hangPx + MAIN_PAD_PHONE;           // what already sits under the box
      if (overhang > reserve + EPS) collisions.push(`${cw}px overhang ${overhang.toFixed(2)} > reserve ${reserve.toFixed(2)}`);
    }
    expect(
      collisions,
      '\nThe painted control now hangs past the arrow\'s own reserve and into the page, so its last rows '
      + 'sit over content a reader is trying to touch. Do NOT grow HEADER_H: that is the sticky offset the '
      + 'shell hangs from and moving it moves the painting. Either the hang shrank or the touch floor rose; '
      + 'measure which, and give `main` the clearance instead.\n',
    ).toEqual([]);
  });
});
