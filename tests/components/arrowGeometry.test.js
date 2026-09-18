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
 *   (b) the tables agree with each other: every cut has FE columns of plain wood on both
 *       sides, Compendium's gaps are too narrow for one, bindings separate the regions,
 *       the slip clears the rivets (with a CONTROL showing the cut check can fail);
 *   (c) for every page width from 320 to 3840 px in both compositions: the painting ends
 *       exactly at the page's width, the segments tile with their slots, every filler
 *       spans its slot plus both crossfades (so only painted segments ever fade), no slot
 *       opens below the uncut threshold, and no share is longer than one filler tile;
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
 *   (j) the hover glow boxes sit inside their controls.
 */
import { describe, expect, it } from 'vitest';
import {
  BAND_H, BARB_HANG_H, BINDINGS, COMPACT_JOIN, COMPACT_MIN_SLOT, COMPACT_W, CUTS, FE, FEATHER_FROM,
  FEATHER_RAMP, FEATHER_X1, FILLER_W, FULL_MIN_VIEWPORT, GLOW_PAD, GLOW_ROWS, HANG_H, HOME, LOGO_PLATE, MIN_SHARE_PX,
  NAV_HIT, NAV_WORD, PLATE, PLATE_FIELD, PLATE_RIVETS, S_MAX, SHARES, SHORT_CAP, SLIP, SLOT_TONE,
  STRIP_W, UNDERLINE_ROW, PLAQUE_ROWS, PLAQUE_PAD, WOOD_RUNS, WORD_FLOOR, WORD_ROWS, SEAM_BAND_TO, SEAM_HANG_FROM,
  featherShown, fullScale, layoutArrow, padTarget,
} from '../../src/components/nav/arrowGeometry.js';
import { NAV } from '../../src/lib/routes.js';

const EPS = 1e-6;
const UNCUT_BELOW = STRIP_W * S_MAX + SHARES * MIN_SHARE_PX;
const TILED_ABOVE = (STRIP_W + SHARES * FILLER_W) * S_MAX;

/**
 * Every cut that lacks FE columns of plain wood on either side, as readable strings.
 * @param {ReadonlyArray<{ x: number }>} cuts
 */
function cutViolations(cuts) {
  return cuts
    .filter(({ x }) => !WOOD_RUNS.some((run) => run.x0 <= x - FE && x + FE <= run.x1))
    .map(({ x }) => `cut ${x} has no ${FE}-column margin of plain wood on both sides`);
}

/** Everything a layout must satisfy at its width, as a list of failures. */
function layoutFailures(layout) {
  const out = [];
  const { s, width, segments, fillers } = layout;
  const tag = `${layout.mode} ${width}`;
  const last = segments[segments.length - 1];
  if (Math.abs(last.coreX + last.coreW - width) > 0.01) out.push(`${tag}: ends at ${last.coreX + last.coreW}`);
  if (Math.abs(segments[0].coreX) > EPS) out.push(`${tag}: starts at ${segments[0].coreX}`);
  if (fillers.length !== segments.length - 1) out.push(`${tag}: ${fillers.length} fillers for ${segments.length} segments`);
  segments.forEach((seg, i) => {
    const wantL = i > 0 ? FE * s : 0;
    const wantR = i < segments.length - 1 ? FE * s : 0;
    if (Math.abs(seg.fadeL - wantL) > EPS || Math.abs(seg.fadeR - wantR) > EPS) out.push(`${tag}: segment ${i} fades ${seg.fadeL}/${seg.fadeR}`);
    if (Math.abs(seg.x - (seg.coreX - seg.fadeL)) > EPS) out.push(`${tag}: segment ${i} box x`);
    if (Math.abs(seg.w - (seg.coreW + seg.fadeL + seg.fadeR)) > EPS) out.push(`${tag}: segment ${i} box w`);
    if (s > 0 && Math.abs((seg.to - seg.from) * s - seg.w) > EPS) out.push(`${tag}: segment ${i} shows ${seg.to - seg.from} columns in ${seg.w} px`);
    if (i < segments.length - 1) {
      const next = segments[i + 1];
      const filler = fillers[i];
      const end = seg.coreX + seg.coreW;
      if (Math.abs(end + filler.slot - next.coreX) > EPS) out.push(`${tag}: segment ${i} and its slot do not meet segment ${i + 1}`);
      if (Math.abs(filler.x - (end - FE * s)) > EPS || Math.abs(filler.w - (filler.slot + 2 * FE * s)) > EPS) {
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
  it('every cut sits inside a plain-wood run with FE columns to spare on both sides', () => {
    expect(cutViolations(CUTS)).toEqual([]);
    const cx = [COMPACT_JOIN.left, COMPACT_JOIN.right].map((x) => ({ x }));
    expect(cutViolations(cx)).toEqual([]);
  });

  it('CONTROL: the cut check convicts a cut on Compendium and a cut against the first binding', () => {
    // 1100 is inside the word Compendium; 511 is the old compact join, against binding 1.
    expect(cutViolations([{ x: 1100 }, { x: 511 }, { x: 558 }])).toEqual([
      'cut 1100 has no 10-column margin of plain wood on both sides',
      'cut 511 has no 10-column margin of plain wood on both sides',
    ]);
  });

  it('the cuts are ordered, two per painted word beside its bindings, none on Compendium, two shares at the plate', () => {
    const xs = CUTS.map((c) => c.x);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
    expect(SHARES).toBe(12);
    const perWord = Object.fromEntries(Object.entries(NAV_HIT).map(([id, hit]) => [
      id, xs.filter((x) => x >= hit.x0 && x < hit.x1),
    ]));
    expect(perWord).toEqual({
      generate: [558, 657],
      settlements: [713, 825],
      realm: [881, 982],
      compendium: [],
      gallery: [1234, 1350],
      'about-what-this-is': [1413, 1516],
    });
    // Every word cut is outside the word's own lettering.
    for (const [id, cuts] of Object.entries(perWord)) {
      const word = NAV_WORD[id];
      expect(cuts.filter((x) => x + FE > word.x0 && x - FE < word.x1), id).toEqual([]);
    }
    expect(CUTS[CUTS.length - 1]).toEqual({ x: 1596, shares: 2 });
    expect(CUTS[CUTS.length - 1].x).toBeLessThan(PLATE.x0);
  });

  it("Compendium's two gaps are narrower than a crossfade pair, so it takes no slot", () => {
    const hit = NAV_HIT.compendium;
    const gaps = WOOD_RUNS.filter((r) => r.x0 >= hit.x0 && r.x1 <= hit.x1);
    expect(gaps.map((r) => r.x1 - r.x0)).toEqual([10, 11]);
    expect(gaps.filter((r) => r.x1 - r.x0 >= 2 * FE)).toEqual([]);
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

  it('the slip sits inside the plate field, clear of both rivets, and the plaque hangs under every descender without leaving the band', () => {
    expect(SLIP.x0 >= PLATE_FIELD.x0 && SLIP.x1 <= PLATE_FIELD.x1).toBe(true);
    expect(SLIP.y0 >= PLATE_FIELD.y0 && SLIP.y1 <= PLATE_FIELD.y1).toBe(true);
    expect(PLATE_RIVETS.map((r) => r.x1 <= SLIP.x0 || r.x0 >= SLIP.x1)).toEqual([true, true]);
    expect(UNDERLINE_ROW).toBeGreaterThan(WORD_ROWS.bottom);
    expect(UNDERLINE_ROW + PLAQUE_ROWS).toBeLessThan(BAND_H);
  });

  it('the word floor sets the switch', () => {
    expect(FULL_MIN_VIEWPORT).toBe(Math.ceil(STRIP_W * WORD_FLOOR));
    expect(COMPACT_W).toBe(558 + (STRIP_W - 1596));
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
      if (layout.share > FILLER_W * layout.s + EPS) failures.push(`full ${cw}: share ${layout.share} longer than one tile`);
      if (slotted && layout.share < MIN_SHARE_PX - EPS) failures.push(`full ${cw}: share ${layout.share} under the floor`);
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

  it('the mode follows the full flag, and the uncut arrow is one segment with no fade', () => {
    expect(layoutArrow({ clientWidth: 1280, full: true }).mode).toBe('full');
    expect(layoutArrow({ clientWidth: 1280, full: false }).mode).toBe('compact');
    const uncut = layoutArrow({ clientWidth: 1280, full: true });
    expect(uncut.segments).toHaveLength(1);
    const [only] = uncut.segments;
    expect([only.x, only.from, only.to, only.fadeL, only.fadeR, only.coreX]).toEqual([0, 0, STRIP_W, 0, 0, 0]);
    expect(only.w).toBeCloseTo(1280, 9);
    expect(uncut.fillers).toEqual([]);
  });
});

describe('(d) the scale', () => {
  it('pins the zones at named widths', () => {
    expect(layoutArrow({ clientWidth: 1024, full: true }).s).toBeCloseTo(1024 / 2133, 12);
    expect(layoutArrow({ clientWidth: 1303, full: true }).share).toBe(0);
    const at1304 = layoutArrow({ clientWidth: 1304, full: true });
    expect(at1304.s).toBe(S_MAX);
    expect(at1304.share).toBeCloseTo((1304 - 1279.8) / 12, 9);
    const at1920 = layoutArrow({ clientWidth: 1920, full: true });
    expect(at1920.s).toBe(S_MAX);
    expect(at1920.share).toBeCloseTo((1920 - 1279.8) / 12, 9);
    // The 372-column filler (2026-09-17) holds S_MAX up to 3958.2 px; past that a share is one tile.
    const at3840 = layoutArrow({ clientWidth: 3840, full: true });
    expect(at3840.s).toBe(S_MAX);
    expect(at3840.share).toBeCloseTo((3840 - 1279.8) / 12, 9);
    const at4200 = layoutArrow({ clientWidth: 4200, full: true });
    expect(at4200.s).toBeCloseTo(4200 / 6597, 12);
    expect(at4200.share).toBeCloseTo(FILLER_W * at4200.s, 9);
    expect(FILLER_W).toBe(372);
    expect(UNCUT_BELOW).toBeCloseTo(1303.8, 9);
    expect(TILED_ABOVE).toBeCloseTo(3958.2, 9);
  });

  it('the full arrow keeps the word floor, holds S_MAX while wood is inserted, and moves continuously inside each zone', () => {
    const failures = [];
    let prev = fullScale(1009);
    for (let cw = 1009; cw <= 4400; cw += 1) {
      const { s } = fullScale(cw);
      if (s < 0.47) failures.push(`${cw}: s ${s} under the floor`);
      if (cw >= UNCUT_BELOW && cw <= TILED_ABOVE && s !== S_MAX) failures.push(`${cw}: s ${s} is not S_MAX`);
      if (cw < TILED_ABOVE && s > UNCUT_BELOW / STRIP_W + EPS) failures.push(`${cw}: s ${s} above the uncut ceiling`);
      const sameZone = (cw - 1 < UNCUT_BELOW) === (cw < UNCUT_BELOW) && (cw - 1 <= TILED_ABOVE) === (cw <= TILED_ABOVE);
      if (cw > 1009 && sameZone && Math.abs(s - prev.s) > 1 / STRIP_W + EPS) failures.push(`${cw}: s jumps ${prev.s} -> ${s}`);
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
      const { hits, s, share, width } = layoutArrow({ clientWidth: cw, full: true });
      const chain = [hits.home, ...ids.map((id) => hits.nav[id]), hits.plate];
      chain.forEach((r, i) => {
        if (r.x < -EPS || r.x + r.w > width + EPS) failures.push(`${cw}: rect ${i} out of bounds`);
        if (i > 0 && chain[i - 1].x + chain[i - 1].w > r.x + EPS) failures.push(`${cw}: rect ${i} overlaps its left neighbour`);
        if (r.h !== BAND_H * s) failures.push(`${cw}: rect ${i} height`);
      });
      for (const id of ids) {
        const span = NAV_HIT[id];
        const own = CUTS.filter((c) => c.x > span.x0 && c.x < span.x1).reduce((n, c) => n + c.shares, 0);
        const want = (span.x1 - span.x0) * s + own * share;
        if (Math.abs(hits.nav[id].w - want) > EPS) failures.push(`${cw}: ${id} width ${hits.nav[id].w} vs ${want}`);
        if (hits.nav[id].w < 24) failures.push(`${cw}: ${id} narrower than 24 px`);
        const u = hits.plaque[id];
        if (u.x < hits.nav[id].x || u.x + u.w > hits.nav[id].x + hits.nav[id].w) failures.push(`${cw}: ${id} plaque outside its region`);
        if (Math.abs(u.y - UNDERLINE_ROW * s) > EPS) failures.push(`${cw}: ${id} plaque row`);
        // The plaque hangs DOWNWARD only: its top row is the word's baseline clearance and
        // its ten rows stay inside the painted band at every scale.
        if (Math.abs(u.h - PLAQUE_ROWS * s) > EPS) failures.push(`${cw}: ${id} plaque height ${u.h}`);
        if (u.y + u.h > hits.nav[id].y + hits.nav[id].h + EPS) failures.push(`${cw}: ${id} plaque below the band`);
        const word = NAV_WORD[id];
        if (Math.abs(u.w - ((word.x1 - word.x0) + 2 * PLAQUE_PAD) * s) > EPS) failures.push(`${cw}: ${id} plaque width ${u.w}`);
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
      expect(Object.keys(hits.plaque)).toEqual([]);
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
  it('each word\'s glow sits inside its region and clear of every cut; the plates\' glows inside their controls', () => {
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
      const box = { x0: word.x0 - GLOW_PAD, x1: word.x1 + GLOW_PAD };
      expect(CUTS.filter((c) => c.x > box.x0 && c.x < box.x1), id).toEqual([]);
    }
    expect(LOGO_PLATE.x0).toBeGreaterThan(HOME.x0);
    expect(LOGO_PLATE.x1).toBeLessThanOrEqual(HOME.x1);
    expect(GLOW_ROWS.top).toBeGreaterThanOrEqual(0);
    expect(GLOW_ROWS.bottom).toBeLessThanOrEqual(BAND_H);
  });
});
