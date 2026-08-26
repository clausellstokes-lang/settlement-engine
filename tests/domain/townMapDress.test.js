/**
 * tests/domain/townMapDress.test.js — ⭐⭐⭐ DRESS-1 · **THE STRUCTURAL INK'S LAWS.**
 *
 * DESIGN_SPINE_COMPLETION §1 (DRESS-1 half) with PA.3 (the ford), PA.4 (wear), PA.6 (the roof and
 * the look). Every zero asserted here is followed by a PLANT that must move it — §6's law, and the
 * reason the value ladder below is trusted at all: its first two spellings were both WRONG and it
 * was the census, not a reading, that said so.
 *
 * ⚠ THE FIXTURE IS SYNTHETIC AND SMALL, for the reason `townMapPartition.test.js` gives: the laws
 * are properties of the STRUCTURE. Corpus-scale figures live in `harness/laneDRESS1/`.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { publishWallWorks } from '../../src/domain/townMap/fabric/wallPublication.js';
import { LENS_IDS, resolveLens, HATCH } from '../../src/domain/townMap/fabric/folioLenses.js';
import {
  dressPage, tones, valueCensus, legendCensus, accessibleHatch, hatchPolygon, clipSegment,
  inRing, contrast, mix, polesOf, VALUE_STEP, GRAIN, DRESS_GROUPS, DRESS_LEGEND,
  DRESS_SCHEMA_VERSION, PAGE_QUANTUM_DECIMALS, STATE_GROUPS,
} from '../../src/domain/townMap/fabric/partitionDress.js';

/**
 * ⟦DRESS-2 W1⟧ A SYNTHETIC §10 REGISTER — one of every family the dress can draw, so the arms
 * below are properties of the INK and not of any one leaf's weather. Shapes copied from
 * `stateMarks.js`'s own published records, not invented for the test.
 */
function fixtureState() {
  const quad = (x, y, w, h) => [[x - w, y - h], [x + w, y - h], [x + w, y + h], [x - w, y + h]];
  return {
    expressed: ['under_siege', 'plague_onset', 'famine', 'monster_pressure', 'wartime'],
    bodies: [
      { key: 'state.siege.tent.0', kind: 'tent', cite: 'settlement.stressors[under_siege]', polygon: quad(300, 40, 4, 3) },
      { key: 'state.siege.tent.1', kind: 'tent', cite: 'settlement.stressors[under_siege]', polygon: quad(312, 40, 4, 3) },
      { key: 'state.plague.lazar', kind: 'lazar', cite: 'settlement.stressors[plague_onset]', polygon: quad(-260, 90, 6, 5) },
      // ⛔ the §18.4 fossil — present on the fabric, and this family must NOT be drawn here
      { key: 'colonize.1', kind: 'middleRow', cite: '§18.4 age 191 ≥ 128', polygon: quad(0, 0, 5, 2) },
    ],
    marks: [
      { kind: 'barredGate', x: 120, y: 0, dx: 1, dy: 0, cite: 'settlement.stressors[under_siege]', label: 'INVESTED' },
      { kind: 'quarantineBar', x: 0, y: 120, dx: 0, dy: 1, cite: 'settlement.stressors[plague_onset]' },
      { kind: 'emptyStall', cite: 'settlement.stressors[famine]', polygon: quad(10, 10, 6, 2) },
      { kind: 'watchFire', x: -140, y: -140, r: 3, cite: 'settlement.stressors[monster_pressure]' },
      { kind: 'trampled', x: 150, y: 150, r: 20, ang: 292, cite: 'settlement.stressors[wartime]' },
      { kind: 'barricade', x: -40, y: 40, dx: 1, dy: 1, w: 10, cite: 'settlement.stressors[unrest]' },
    ],
  };
}

function fixtureLedger() {
  const epochs = [];
  const pops = [1, 60, 240, 700, 1400];
  const years = [0, 20, 55, 110, 200];
  for (let k = 0; k < pops.length; k++) {
    epochs.push({
      index: k, year: years[k], population: pops[k], peakSoFar: pops[k], extentTier: 'town',
      builtRadius: 30 + k * 26,
      plotSetDelta: k === 0 ? 1 : pops[k] - pops[k - 1],
      intramuralDelta: k === 0 ? 1 : pops[k] - pops[k - 1],
      extramuralDelta: 0,
      provenance: k === 0 ? 'recorded' : 'interpolated',
      circuitEvents: k === 3
        ? [{ index: 0, epoch: 3, year: 110, frozenRadius: 108, provenance: 'derived-frozen' }] : [],
      emissions: [], quarterMints: [],
    });
  }
  return { version: 1, epochs, circuitEvents: [], emissions: [], quarterMints: [], annotations: {} };
}

/** @type {any} */ let P = null;
/** @type {any} */ let page = null;
/** @type {any} */ let walls = null;
/** @type {any} */ let dress = null;

beforeAll(() => {
  P = buildSettledPartition({
    seed: 'dress1-ink', ledger: fixtureLedger(), extent: { cx: 0, cy: 0, radius: 200 },
    originForm: 'NUCLEATED_CROSSROADS', planMode: 'COMPOSITE', roadWidth: 5, bodyTarget: 260,
    water: null, wallForm: { facets: 20, width: 2.2 },
  });
  page = projectPage(P, { roadWidth: 5 });
  walls = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-ink', year: 200 });
  dress = dressPage(page, { lens: 'parchment', roadWidth: 5, walls });
}, 900000);

describe('DRESS-1 · the ink exists and is a view, not a re-derivation', () => {
  it('a page frame dresses to SVG with a group per drawn family', () => {
    expect(dress.artifactKind).toBe('PARTITION_PAGE_DRESS');
    expect(dress.schemaVersion).toBe(DRESS_SCHEMA_VERSION);
    expect(dress.svg.length).toBeGreaterThan(1000);
    expect(dress.groups.length).toBeGreaterThan(6);
    for (const g of dress.groups) expect(DRESS_GROUPS, `undeclared group ${g}`).toContain(g);
  });

  it('⭐ the dress is PURE — two calls on one page are byte-identical', () => {
    const a = dressPage(page, { lens: 'parchment', roadWidth: 5, walls });
    const b = dressPage(page, { lens: 'parchment', roadWidth: 5, walls });
    expect(a.svg).toBe(b.svg);
    // and a control: a different lens MUST move the ink, or `lens` is decorative
    expect(dressPage(page, { lens: 'vtt', roadWidth: 5, walls }).svg).not.toBe(a.svg);
  });

  it('the page quantum is one decimal, and no path carries a second one', () => {
    expect(PAGE_QUANTUM_DECIMALS).toBe(1);
    // ⚠ PATH DATA ONLY — a stroke width or an opacity is not a coordinate, and testing the whole
    //   document convicts `stroke-width="0.16"` for carrying two decimals it is entitled to.
    const nums = [...dress.svg.matchAll(/ d="([^"]*)"/g)].map((m) => m[1]).join(' ')
      .match(/\d+\.\d+/g) || [];
    const twoPlaces = nums.filter((n) => n.split('.')[1].length > 1);
    expect(twoPlaces.length, `${twoPlaces.length} coordinate(s) carry more than one decimal`).toBe(0);
    // ⛔ the control: a two-decimal render MUST trip that filter, or the filter is dead
    const q2 = dressPage(page, { lens: 'parchment', roadWidth: 5, walls, decimals: 2 });
    const n2 = (q2.svg.match(/d="[^"]*"/g).join(' ').match(/\d+\.\d+/g) || [])
      .filter((n) => n.split('.')[1].length > 1);
    expect(n2.length).toBeGreaterThan(0);
    // and the byte cure is real, in the direction claimed
    expect(Buffer.byteLength(q2.svg, 'utf8')).toBeGreaterThan(Buffer.byteLength(dress.svg, 'utf8'));
  });
});

describe('I3 + I4 · THE VALUE HIERARCHY — and its first two spellings both failed', () => {
  it('every lens clears every rung of the ladder', () => {
    for (const id of LENS_IDS) {
      const v = valueCensus(tones(resolveLens(id)));
      expect(v.ok, `${id}: ${v.reason}`).toBe(true);
    }
  });

  it('⭐ I4 · the plot ground is a FULL STEP off the street ground', () => {
    for (const id of LENS_IDS) {
      const T = tones(resolveLens(id));
      expect(contrast(T.street, T.plotGround), `${id}`).toBeGreaterThanOrEqual(VALUE_STEP - 1e-9);
    }
  });

  it('⛔ FOUR PLANTED CONTROLS — each collapses one rung and each must convict', () => {
    const T = tones(resolveLens('parchment'));
    expect(valueCensus(T).ok).toBe(true);
    for (const [name, o] of [
      ['plot = street', { plotGround: T.street }],
      ['built = plot', { built: T.plotGround }],
      ['field = paper', { field: T.paper }],
      ['SE plane = NW plane', { roofSE: T.roofNW }],
    ]) {
      expect(valueCensus({ ...T, ...o }).ok, `the plant '${name}' did not convict`).toBe(false);
    }
    expect(valueCensus(T).ok, 'the restore failed').toBe(true);
  });

  it('the poles are read off the lens, never assumed to be white and black', () => {
    const night = polesOf(resolveLens('darkFantasy').roles);
    expect(night.light).not.toBe('#FFFFFF');
    expect(night.dark).not.toBe('#000000');
  });
});

describe('I7 + §650.2 · THE CLIP — no mark leaves the face that owns it', () => {
  it('a hatch of an L-shaped (non-convex) ring stays inside it', () => {
    const L = [[0, 0], [60, 0], [60, 20], [20, 20], [20, 60], [0, 60]];
    const segs = hatchPolygon(L, 0, 4);
    expect(segs.length).toBeGreaterThan(4);
    let out = 0;
    for (const [a, b] of segs) {
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      if (!inRing(L, m[0], m[1])) out++;
    }
    expect(out, 'the hatch escaped a non-convex face — this is review I7').toBe(0);
    // ⛔ the control: tested against a face it does NOT own, every segment must read outside
    const other = [[200, 200], [240, 200], [240, 240], [200, 240]];
    expect(segs.filter(([a]) => !inRing(other, a[0], a[1])).length).toBe(segs.length);
  });

  /**
   * ⚠ **THIS TEST'S TITLE WAS TRUE WHEN IT WAS WRITTEN AND DRESS-FABRIC MADE HALF OF IT FALSE**,
   * so the title moves with the code rather than being left to overstate. The reviewed STROKE is
   * still carried verbatim and the reviewed OPACITY is still the constant it always was; what the
   * dress now EMITS is a per-lens solved alpha, because the furrow's weight is a property of the
   * field it textures and 0.72 was nobody's derived figure. A test whose name outlives its
   * predicate is the family this estate has now caught eight times.
   */
  it('the grain keeps its reviewed stroke; the EMITTED alpha is solved, not the constant', () => {
    expect(GRAIN.stroke).toBe(0.25);
    expect(GRAIN.opacity, 'the reviewed constant is unmoved — the cure was never its value').toBe(0.72);
    const T = tones(resolveLens('parchment'));
    expect(T.grainOpacity, 'the emitted alpha is solved per lens').toBeLessThan(GRAIN.opacity);
    expect(T.grainOpacity).toBeGreaterThan(0);
  });

  /**
   * ⭐⭐ **THE FURROW ROW, WITH ITS OWN NEGATIVE CONTROL IN THE SAME TEST.** DRESS-FABRIC measured
   * `grain:built` at **1.097** on the shipped tip — a ground hatch and a roof at the same value —
   * and found every TONE-side cure closed (moving the field reds i5's `water:ground`; moving the
   * grain cannot clear both a roof and the water, which sit 1.397 apart on `illustrated` where a
   * step from each needs 1.638). So the hatch is demoted AT THE PIXEL, and what is pinned is the
   * rendered furrow rather than the declared pair.
   */
  /**
   * ⚠ **AND DRESS-FRAME MOVES THE SURFACE THIS ROW IS ASKED AT, WHICH IS A CORRECTION TO THE ARM
   * RATHER THAN AN ADDITION.** The law is *"the furrow is within one value step of the field it
   * textures"*; with the countryside's own fill now stepping back toward the paper, the field the
   * furrow textures is `fieldOnPage`, not `field`. Asked against the declared tone the row stays
   * green while the rendered hatch drifts three steps clear of its own ground — the same
   * name-outlives-its-predicate family this test's own header names, arriving inside the cure for
   * it. Both the solve and the assertion now read the seen tone.
   */
  it('⭐ the RENDERED furrow is within one value step of the field AS SEEN — and 0.72 is not', () => {
    let convicted = 0; let violating = 0;
    for (const id of LENS_IDS) {
      const T = tones(resolveLens(id));
      const rendered = (a) => contrast(T.fieldOnPage, mix(T.fieldOnPage, T.grain, a));
      expect(rendered(T.grainOpacity), `${id}: the solved alpha misses its own step`)
        .toBeLessThanOrEqual(VALUE_STEP + 1e-9);
      /** ⛔ the control: the pre-cure alpha, on every lens whose base actually violates the row */
      if (rendered(GRAIN.opacity) > VALUE_STEP + 1e-9) {
        violating++;
        if (rendered(GRAIN.opacity) > rendered(T.grainOpacity)) convicted++;
      }
    }
    /**
     * ⚠ FIVE OF SIX, NOT SIX OF SIX, AND THAT IS THE MEASUREMENT: on `darkFantasy` the shipped
     * 0.72 already renders the furrow INSIDE the step (1.184), so the lens has no defect to
     * convict and demanding one would make a true reading look like a dead arm. The liveness of
     * the row on that lens is carried by the α=1.0 plant below.
     */
    expect(violating, 'no lens violates the row at 0.72 — the cure would be curing nothing').toBe(5);
    expect(convicted, 'a violating lens was not convicted').toBe(violating);
    for (const id of LENS_IDS) {
      const T = tones(resolveLens(id));
      const worst = contrast(T.field, mix(T.field, T.grain, 1));
      expect(worst >= rendered0(T) || T.grainOpacity === 1,
        `${id}: an alpha of 1 must be no better than the solved one`).toBe(true);
    }
    function rendered0(T) { return contrast(T.fieldOnPage, mix(T.fieldOnPage, T.grain, T.grainOpacity)); }
  });

  /**
   * ⭐⭐⭐ **DRESS-FRAME · THE COUNTRYSIDE IS NOT A DARKER THING THAN THE TOWN'S OWN GROUND.**
   *
   * The reference paints plain countryside with ZERO ink and makes it the brightest large value on
   * the plate; ours had it at luminance **0.3171 against `plotGround`'s 0.5121** on parchment — the
   * hierarchy inverted, over the largest region on the sheet. Every tone-side cure is still shut
   * (`valueCensus`'s `field:paper` floor, and §701.5's measured i5 red), so the demotion is solved
   * at the PIXEL exactly as the furrow's was, and this row is asked at the pixel too.
   *
   * ⚠ THE DECLARED TONE MUST NOT HAVE MOVED. That is the whole reason this cure is shippable, so
   * it is asserted rather than assumed — if a later hand "simplifies" the alpha into the tone, five
   * value rows move with it and this arm says so first.
   */
  it('⭐ the SEEN countryside stands a value step on the PAPER\u2019s side of the settled ground', () => {
    let stepped = 0;
    for (const id of LENS_IDS) {
      const T = tones(resolveLens(id));
      expect(T.fieldOpacity, `${id}: alpha out of range`).toBeGreaterThan(0);
      expect(T.fieldOpacity, `${id}: alpha out of range`).toBeLessThanOrEqual(1);
      // the relation the alpha solves, asked of what lands on the page
      expect(contrast(T.fieldOnPage, T.plotGround), `${id}: the seen field misses its own step`)
        .toBeGreaterThanOrEqual(VALUE_STEP - 1e-9);
      // ⭐ AND ON THE RIGHT SIDE — contrast has no sign, so a magnitude alone would pass the very
      //   state this cure exists to leave.
      const towardPaper = contrast(T.paper, T.plotGround) > contrast(T.paper, T.fieldOnPage);
      expect(towardPaper, `${id}: the seen field is on the WRONG side of the settled ground`).toBe(true);
      // the declared tone is untouched, so no value row can have moved
      expect(valueCensus(T).rows.find((r) => r.pair === 'field:paper').pass, `${id}: field:paper`).toBe(true);
      if (T.fieldOpacity < 1) stepped++;
    }
    /**
     * ⛔ THE CONTROL, AND IT IS THE ONE THAT MATTERS: at α = 1 — the state before this cure — the
     * countryside must FAIL the row on the lenses that actually had the defect. Five of six do;
     * `darkFantasy` already stood on the right side and its alpha solves to 1, which is why the
     * count is five and not six. An arm that demanded six would make a true reading look dead.
     */
    let convicted = 0;
    for (const id of LENS_IDS) {
      const T = tones(resolveLens(id));
      const onPaperSide = contrast(T.paper, T.plotGround) > contrast(T.paper, T.field);
      const clears = contrast(T.field, T.plotGround) >= VALUE_STEP - 1e-9;
      if (!(onPaperSide && clears)) convicted++;
    }
    expect(stepped, 'no lens stepped back — the cure is doing nothing').toBe(5);
    expect(convicted, 'the pre-cure state passes the row — the control is dead').toBe(5);
  });

  it('⭐ PA.6 · a ridge is CLIPPED to its footprint, and one wholly outside is REFUSED', () => {
    const box = [[0, 0], [40, 0], [40, 40], [0, 40]];
    const long = clipSegment(box, [-100, 20], [140, 20]);
    expect(long).not.toBe(null);
    expect(long[0][0]).toBeGreaterThanOrEqual(-1e-6);
    expect(long[1][0]).toBeLessThanOrEqual(40 + 1e-6);
    expect(clipSegment(box, [200, 200], [260, 260]), 'a ridge outside its footprint was drawn').toBe(null);
  });

  it('B7 · the dress reports how many ridges it clipped and how many it refused', () => {
    expect(dress.census.ridges).toBeGreaterThan(0);
    expect(dress.census.ridgeClipped).toBeGreaterThan(0);
    expect(dress.census.ridgeOutside).toBe(0);
  });
});

describe('B7 + PA.6 · THE ROOF GRAMMAR, and PA.6\'s ruled LOOK', () => {
  it('every mass draws two roof planes, hips at its ends, and eaves shadow', () => {
    expect(dress.census.planes).toBe(dress.census.ridges * 2 - dress.census.ridgeOutside * 2);
    expect(dress.census.hips).toBeGreaterThanOrEqual(dress.census.ridges * 2);
    expect(dress.svg).toContain('id="dress-eaves"');
  });

  it('⭐ THE LOOK: the yard is GROUND and the built footprint is drawn over it', () => {
    expect(dress.svg).toContain('id="dress-yards"');
    expect(dress.svg).toContain('id="dress-masses"');
    expect(dress.svg.indexOf('id="dress-yards"'))
      .toBeLessThan(dress.svg.indexOf('id="dress-masses"'));
    expect(dress.tones.plotGround).not.toBe(dress.tones.built);
  });

  it('⛔ HOLLOW WASH IS BANNED — the member unit lines are drawn', () => {
    expect(dress.census.unitLines).toBeGreaterThan(0);
    expect(dress.svg).toContain('id="dress-unitlines"');
  });

  it('the SE plane is darker than the NW plane — one value step, NW light', () => {
    const T = dress.tones;
    expect(contrast(T.paper, T.roofSE)).toBeGreaterThan(contrast(T.paper, T.roofNW));
  });
});

describe('I10 · THE WALL BAND — coursing, a one-sided comb, and a hachured ditch', () => {
  it('the band draws as a FACE with coursing, not as a tick ladder', () => {
    expect(dress.census.bandFaces).toBeGreaterThan(0);
    expect(dress.census.coursing).toBeGreaterThan(0);
    expect(dress.svg).toContain('id="dress-band"');
    expect(dress.svg).toContain('id="dress-coursing"');
  });

  it('⭐ the ditch is RADIATING HACHURE, never a dash array', () => {
    const ditch = (dress.svg.match(/<g id="dress-ditch">[\s\S]*?<\/g>/) || [''])[0];
    if (dress.census.ditchHachure > 0) {
      expect(ditch).not.toContain('stroke-dasharray');
      expect(ditch.length).toBeGreaterThan(20);
    }
  });

  it('gates are SEATED IN the band, and towers are plan shapes on it', () => {
    expect(dress.census.gatehouses).toBeGreaterThan(0);
    expect(dress.svg).toContain('id="dress-gates"');
  });
});

describe('L-REG-34 · THE LEGEND, in both directions', () => {
  it('every drawn group is taught and every taught group is drawable, with a plate', () => {
    const L = legendCensus(dress);
    expect(L.ok, L.reason).toBe(true);
    expect(L.untaught).toEqual([]);
    expect(L.unlocatable).toEqual([]);
    expect(L.plateless).toEqual([]);
  });

  it('⛔ the control — a drawn group with no row must convict', () => {
    expect(legendCensus({ groups: ['dress-masses', 'dress-invented-mark'] }).ok).toBe(false);
    expect(legendCensus({ groups: ['dress-masses'] }).ok).toBe(true);
  });

  it('every legend row cites a corpus plate — an uncited mark is an invented one', () => {
    for (const r of DRESS_LEGEND) {
      expect(typeof r.plate, `${r.group} has no plate`).toBe('string');
      expect(r.plate.length).toBeGreaterThan(3);
      expect(r.teaches.length).toBeGreaterThan(8);
    }
  });
});

/* ══════════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ ⟦DRESS-2 W1⟧ THE §10 STATE REGISTER — review I2's cure, at fixture scale.
 *
 * The corpus-level proof lives in the corpus describe below (and in
 * `harness/laneDRESS2/scenarioCensus.mjs`); these arms are properties of the INK: that each family
 * draws its own glyph in its own group, that the §18.4 fossils are excluded on purpose, and that
 * the canvas tone clears the paper on every lens — the row whose FIRST spelling redded the gate.
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */
describe('⟦DRESS-2 W1⟧ I2 · THE §10 STATE EXPRESSIONS, one family per group', () => {
  it('every state family draws into its OWN group, and each is counted', () => {
    const d = dressPage(page, { lens: 'parchment', roadWidth: 5, walls, state: fixtureState() });
    const c = d.census;
    expect(c.stateExpressed).toBe(5);
    expect(c.stateBodies, 'the two tents and the lazar, and NOT the colonize fossil').toBe(3);
    expect(c.barredGates, 'one barred gate and one quarantine bar').toBe(2);
    expect(c.emptyStalls).toBe(1);
    expect(c.watchFires).toBe(1);
    expect(c.trampled).toBe(1);
    expect(c.barricades).toBe(1);
    for (const gp of STATE_GROUPS) {
      expect(d.groups, `${gp} is not on the plate`).toContain(gp);
    }
    // …and every one of them is a group the roster knows and the legend teaches
    for (const gp of STATE_GROUPS) expect(DRESS_GROUPS).toContain(gp);
    expect(legendCensus(d).ok, legendCensus(d).reason).toBe(true);
  });

  it('⛔ §18.4 INFILL FOSSILS ARE EXCLUDED BY KEY, NOT BY KIND — the discriminator the fabric owns', () => {
    // `state.*` is a §10 expression; `colonize.*` is market infill present on every town+ leaf.
    // Excluding by KIND would go stale the moment a new body kind is minted; the key prefix is
    // what `stateMarks` itself publishes.
    const S = fixtureState();
    const only = { ...S, bodies: S.bodies.filter((b) => b.key.startsWith('colonize.')) };
    const d = dressPage(page, { lens: 'parchment', roadWidth: 5, walls, state: only });
    expect(d.census.stateBodies).toBe(0);
    expect(d.groups).not.toContain('dress-camp');
  });

  it('⛔ THE CONTROL — no state channel means no state ink, and that is the shipped defect', () => {
    const d = dressPage(page, { lens: 'parchment', roadWidth: 5, walls });
    for (const gp of STATE_GROUPS) expect(d.groups).not.toContain(gp);
    expect(d.census.stateBodies + d.census.barredGates + d.census.emptyStalls
      + d.census.watchFires + d.census.trampled + d.census.barricades).toBe(0);
  });

  it('the bar spans the ROAD, so it survives the tier ladder (§179) rather than the view', () => {
    // Two dresses of the same page at different road widths: the barred-gate mark must scale with
    // the road, because a gate passage is about a road wide at every tier. A view-unit constant
    // (the legacy's `builtRadius × 0.035`) would be right at one tier and wrong at the rest.
    const S = { expressed: ['under_siege'], bodies: [], marks: [{ kind: 'barredGate', x: 0, y: 0, dx: 1, dy: 0, cite: 'c' }] };
    const span = (rw) => {
      const d = dressPage(page, { lens: 'parchment', roadWidth: rw, walls, state: S });
      const m = d.svg.match(/<g id="dress-barred">.*?d="([^"]*)"/s);
      const ys = [...m[1].matchAll(/-?\d+(?:\.\d+)?/g)].map(Number).filter((_, i) => i % 2 === 1);
      return Math.max(...ys) - Math.min(...ys);
    };
    expect(span(10) / span(5)).toBeCloseTo(2, 3);
  });

  it('⭐ the CANVAS tone clears the paper on EVERY lens — the row that redded its own first spelling', () => {
    // `camp: atLeast(paper, mix(paper, built, 0.42), VALUE_STEP, poles.dark)` measured
    // `camp:paper` 1.242 < 1.280 on darkFantasy: "away from the paper is a DIRECTION, not a sign",
    // this module's own lesson, a third time. The cure is a RELATION between two ladder rungs.
    for (const id of LENS_IDS) {
      const T = tones(resolveLens(id));
      expect(contrast(T.paper, T.camp), `${id}: camp:paper`).toBeGreaterThanOrEqual(VALUE_STEP - 1e-9);
      // and it really is BETWEEN the ground it is pitched on and the roof it is not
      expect(contrast(T.plotGround, T.camp), `${id}: camp vs toft`).toBeGreaterThan(1);
      expect(contrast(T.built, T.camp), `${id}: camp vs roof`).toBeGreaterThan(1);
    }
  });
});

describe('E11 · THE ACCESSIBLE LENS ARM — patterns replace hue, as real geometry', () => {
  it('the hatch consumes the CLOSED vocabulary and clips like everything else', () => {
    const a = accessibleHatch(page, { roadWidth: 5, characterOf: () => 'merchant' });
    expect(a.segments).toBeGreaterThan(0);
    expect(a.svg).toContain('id="dress-accessible"');
    expect(a.vocabulary).toEqual(Object.keys(HATCH));
  });

  it('⭐ an UNHATCHED class is the matrix, not an omission — pitch 0 draws nothing', () => {
    const res = accessibleHatch(page, { roadWidth: 5, characterOf: () => 'residential' });
    expect(HATCH.residential.pitch).toBe(0);
    expect(res.segments).toBe(0);
    // ⛔ and the control: a class WITH a pitch must draw, or "nothing" means "broken"
    expect(accessibleHatch(page, { roadWidth: 5, characterOf: () => 'noble' }).segments)
      .toBeGreaterThan(0);
  });
});

describe('PA.3 · THE FORD, and the crossing family', () => {
  it('a ford draws STIPPLE + SPLAYED CHEVRONS, and never a ring or a dot-chain', () => {
    const withFord = dressPage({
      ...page,
      crossings: [{ kind: 'ford', at: [0, 0], localWidth: 12 }],
    }, { lens: 'parchment', roadWidth: 5, walls });
    expect(withFord.census.fords).toBe(1);
    const ford = (withFord.svg.match(/<g id="dress-ford">[\s\S]*?<\/g>/) || [''])[0];
    expect(ford.length).toBeGreaterThan(50);
    // §646's struck glyphs: no arc command in the ford's own PATH DATA.
    // ⚠ THE FIRST SPELLING TESTED THE WHOLE GROUP STRING AND CONVICTED A HEX COLOUR: `/[Aa]\d/`
    //   matched the `a5` inside `stroke="#565a5b"`. A pattern test has to be pointed at the data.
    const d = [...ford.matchAll(/ d="([^"]*)"/g)].map((m) => m[1]).join(' ');
    expect(d.length).toBeGreaterThan(50);
    expect(d, 'the ford drew an arc — §646 struck the ring and the dot-chain').not.toMatch(/[Aa]/);
    expect(ford).not.toContain('circle');
  });

  it('⭐ stepping stones are a DISTINCT dress, drawn only where truth mints them', () => {
    const none = dressPage({ ...page, crossings: [] }, { lens: 'parchment', roadWidth: 5, walls });
    expect(none.census.steppingStones).toBe(0);
    const some = dressPage({ ...page, crossings: [{ kind: 'stepping', at: [0, 0], localWidth: 8 }] },
      { lens: 'parchment', roadWidth: 5, walls });
    expect(some.census.steppingStones).toBeGreaterThan(0);
    expect(some.census.fords).toBe(0);
  });

  it('a deck draws OVER the water with its shadow line (§649.2\'s fresh-eyes exit)', () => {
    const d = dressPage({ ...page, crossings: [{ kind: 'bridge', at: [0, 0], localWidth: 12 }] },
      { lens: 'parchment', roadWidth: 5, walls });
    expect(d.census.decks).toBe(1);
    expect(d.svg).toContain('id="dress-decks"');
  });
});

/* ══════════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ THE CORPUS-RENDER ARM (DRESS-FRAME, chartered ODQ §703.4)
 *
 * ⛔⛔ THE DEFECT IT EXISTS FOR, AND IT IS THE SHARPEST ONE THIS PROGRAMME HAS FOUND:
 * **NOTHING IN THE GATE RENDERED THE PAGE.** At `9c7261829` the gate ran **19 files / 439 tests,
 * EXIT 0** at a tip whose page renderer **threw on leaf 14 of 18** — a `Math.max(1, …)` floor over
 * a hatch list that had become empty, so `linePath(undefined)`. Two test files *referenced* the
 * dress modules; none built a corpus leaf and drew it. So a leaf-specific crash passed a green
 * gate, and three waves of "gate green" were read by the chair as "the picture renders" when they
 * only ever said "the parts pass".
 *
 * ⭐ WHAT THIS ARM IS, STATED SO IT CANNOT DRIFT: it renders **every leaf of the corpus, through
 * BOTH renderers, end to end** — the partition dress page (the surface that ships at the port) and
 * the legacy folio plate (the surface the corpus is measured on today) — and requires each to
 * produce a well-formed plate with no non-finite number anywhere in its markup. It asserts almost
 * nothing about how the plate LOOKS. That is deliberate: every look-assertion the estate owns
 * already lives above this line, and what was missing was not a judgement, it was an EXECUTION.
 *
 * ⚠ IT COSTS ~40 s AND THAT IS THE POINT. The fixture-based arms above are fast because they are
 * synthetic; a crash that only the metropolis reaches cannot be caught by a synthetic fixture. The
 * corpus is built ONCE per leaf and both renderers are driven off that one build.
 *
 * ⛔ AND IT WAS PROVED BY A PLANTED CRASH BEFORE IT WAS BELIEVED — see the receipt: the §703.4
 * defect was re-planted at its original site and this arm convicted `metropolis`, while the rest
 * of the gate stayed green exactly as it did the first time.
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */
describe('⭐⭐⭐ THE CORPUS RENDERS — every leaf, both renderers, end to end (§703.4)', () => {
  /** @type {any} */ let plates = null;
  /** @type {any} */ let CORPUS_KEYS = null;

  beforeAll(async () => {
    const { CORPUS } = await import('../../harness/exemplars.mjs');
    const { dressLeaf } = await import('../../harness/laneDRESS1/renderPage.mjs');
    const { renderFolio } = await import('../../harness/renderFolio.mjs');
    CORPUS_KEYS = CORPUS.map((s) => s.key);
    plates = [];
    for (const key of CORPUS_KEYS) {
      // ⚠ NO try/catch. A throw here IS the verdict — wrapping it would turn the one thing this
      //    arm exists to catch into a soft row in a report nobody reads.
      const r = dressLeaf(key, 'parchment');
      const folio = renderFolio(r.fabric, { lens: 'parchment' });
      plates.push({ key, tier: r.tier, dress: r.svg, page: r.page, folio: folio.svg, folioEls: folio.elementCount, folioPrims: folio.primitiveCount, ops: r.ops, prims: r.primitives,
        // ⟦DRESS-2 W1⟧ the §10 roster rides along so the scenario arms cost NO extra build
        expressed: ((r.fabric.stateMarks || {}).expressed || []), census: r.dress.census });
    }
  }, 900000);

  it('⛔ NON-VACUITY FIRST: the arm visited every leaf of the corpus, and the corpus is not empty', () => {
    // A corpus-render arm that renders nothing is the vacuous-census family's newest member, and
    // it would read exactly like this one passing. So the roster is asserted before the plates.
    expect(Array.isArray(CORPUS_KEYS)).toBe(true);
    expect(CORPUS_KEYS.length).toBeGreaterThanOrEqual(18);
    expect(plates.length).toBe(CORPUS_KEYS.length);
    expect(plates.map((p) => p.key)).toEqual(CORPUS_KEYS);
  });

  it('every leaf renders a WELL-FORMED dress page, and the frame it declares is finite', () => {
    for (const p of plates) {
      expect(p.dress.startsWith('<svg'), `${p.key}: no <svg`).toBe(true);
      expect(p.dress.endsWith('</svg>'), `${p.key}: unterminated`).toBe(true);
      const vb = /viewBox="([^"]+)"/.exec(p.dress);
      expect(vb, `${p.key}: no viewBox`).not.toBeNull();
      const nums = vb[1].trim().split(/\s+/).map(Number);
      expect(nums.length, `${p.key}: viewBox arity`).toBe(4);
      for (const n of nums) expect(Number.isFinite(n), `${p.key}: viewBox ${vb[1]}`).toBe(true);
      expect(nums[2], `${p.key}: zero-width page`).toBeGreaterThan(0);
      expect(nums[3], `${p.key}: zero-height page`).toBeGreaterThan(0);
      // the leaf actually drew something — a blank page is not a rendered page
      expect(p.dress).toContain('id="dress-paper"');
      expect(p.dress).toContain('id="dress-masses"');
      expect(p.prims, `${p.key}: no primitives`).toBeGreaterThan(0);
      expect(p.ops, `${p.key}: no elements`).toBeGreaterThan(0);
    }
  });

  it('every leaf renders a WELL-FORMED folio plate — the legacy surface is in the gate too', () => {
    for (const p of plates) {
      expect(p.folio.startsWith('<svg'), `${p.key}: folio no <svg`).toBe(true);
      expect(p.folio.trimEnd().endsWith('</svg>'), `${p.key}: folio unterminated`).toBe(true);
      expect(p.folioEls, `${p.key}: folio no elements`).toBeGreaterThan(0);
      expect(p.folioPrims, `${p.key}: folio no primitives`).toBeGreaterThan(0);
    }
  });

  it('⛔ NO NON-FINITE NUMBER REACHES EITHER PLATE — the NaN class, caught at the page', () => {
    // §701.7's own lesson from the other side: a NaN can render a confident-looking plate that is
    // silently broken, and an exit code will not say so. `NaN`, `Infinity` and a stringified
    // `undefined` are all things a coordinate arithmetic slip puts straight into path data.
    for (const p of plates) {
      for (const [what, svg] of [['dress', p.dress], ['folio', p.folio]]) {
        for (const bad of ['NaN', 'Infinity', 'undefined', 'null']) {
          expect(svg.includes(bad), `${p.key}/${what}: markup contains ${bad}`).toBe(false);
        }
      }
    }
  });

  it('⛔ AND THE PATH DATA ITSELF PARSES — every coordinate in every d= is a finite number', () => {
    // The check above is a string scan and would miss a coordinate that came out as `1e+31` or
    // an empty command. This one reads the numbers.
    let coords = 0;
    for (const p of plates) {
      for (const [what, svg] of [['dress', p.dress], ['folio', p.folio]]) {
        for (const m of svg.matchAll(/ d="([^"]*)"/g)) {
          const d = m[1];
          expect(d.length, `${p.key}/${what}: empty path data`).toBeGreaterThan(0);
          for (const num of d.matchAll(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g)) {
            const v = Number(num[0]);
            expect(Number.isFinite(v), `${p.key}/${what}: ${num[0]} in path data`).toBe(true);
            coords++;
          }
        }
      }
    }
    // …and the scan actually read something, on every leaf, rather than matching nothing
    expect(coords).toBeGreaterThan(100000);
  });

  it('DRESS-FRAME · every leaf is FITTED to its settlement, and no leaf falls back', () => {
    // The framing law's corpus-wide exit: the page is the settlement's own disc on the short side,
    // the fit is strictly tighter than the content box it replaced, and the rule that fired is
    // named on every leaf so a silent fallback cannot pass for the law.
    for (const p of plates) {
      const b = p.page.bound;
      expect(b.radius, `${p.key}: no bound`).toBeGreaterThan(0);
      expect(b.rule, `${p.key}: ${b.rule}`).not.toMatch(/FALLBACK/);
      expect(p.page.frame.w).toBeCloseTo(2 * b.radius, 6);
      expect(p.page.frame.h).toBeCloseTo(2 * b.radius, 6);
      expect(p.page.frame.w, `${p.key}: the fit is not tighter than the content box`)
        .toBeLessThanOrEqual(p.page.contentFrame.w + 1e-6);
    }
    // ⭐ TIER-INVARIANCE, ASSERTED RATHER THAN ADMIRED: the settlement's own disc takes the SAME
    //   share of every plate, whatever the tier — which is the whole reason the fit exists. A
    //   fixed plate against a tier-varying radius cannot do this, and ours could not before.
    for (const p of plates) {
      const share = (Math.PI * p.page.bound.radius ** 2) / (p.page.frame.w * p.page.frame.h);
      expect(share, `${p.key}: share ${share}`).toBeCloseTo(Math.PI / 4, 9);
    }
  });

  /* ────────────────────────────────────────────────────────────────────────────────────────
   * ⭐⭐⭐ ⟦DRESS-2 W1⟧ REVIEW I2 · THE SCENARIO LEAVES, AND THE OUTSIDE EVIDENCE BEHIND THEM
   *
   * ODQ §696.4: a reader with no knowledge of this programme flagged four plates, unprompted, as
   * *"the same underlying map… rendered four separate times"*. MEASURED at `6bc1a5051`, those
   * four shared ONE sha256 and `city`/`migration` shared another — **the eighteen-leaf corpus was
   * FOURTEEN distinct drawings**, so every gestalt score taken over it was over a thinner sample
   * than its leaf count claimed. These arms make that state unreachable.
   * ⚠ They are free: they read the `plates` this describe already built once per leaf.
   * ──────────────────────────────────────────────────────────────────────────────────────── */

  it('⭐ every leaf of the corpus is a DISTINCT drawing — no plate is another plate', () => {
    const seen = new Map();
    for (const p of plates) {
      const prior = seen.get(p.dress);
      expect(prior, `${p.key} renders byte-identically to ${prior}`).toBeUndefined();
      seen.set(p.dress, p.key);
    }
    expect(seen.size).toBe(plates.length);
  });

  it('⭐⭐ the scenario element-diff census is GREEN, and it counts CITED marks only', async () => {
    const { scenarioCensus, SCENARIO_PAIRS, CITED_FLOOR } = await import('../../harness/laneDRESS2/scenarioCensus.mjs');
    const by = Object.fromEntries(plates.map((p) => [p.key, { svg: p.dress, expressed: p.expressed }]));
    const c = scenarioCensus(by);
    expect(c.rows.length).toBe(SCENARIO_PAIRS.length);
    expect(c.ok, c.reason).toBe(true);
    for (const r of c.rows) expect(r.citedDiff, `${r.leaf}: ${r.citedDiff}`).toBeGreaterThanOrEqual(CITED_FLOOR);
  });

  it('⛔ THE NEGATIVE CONTROL: withhold the state channel and the census RED-flags every pair', async () => {
    // The pre-bridge corpus reproduced exactly — `dressPage` without `opts.state` is what shipped
    // at `6bc1a5051`, and it is what the naive reader was looking at. If this passes, the census
    // above is measuring nothing.
    const { dressLeaf } = await import('../../harness/laneDRESS1/renderPage.mjs');
    const { scenarioCensus, SCENARIO_PAIRS } = await import('../../harness/laneDRESS2/scenarioCensus.mjs');
    const need = [...new Set(SCENARIO_PAIRS.flatMap((p) => [p.leaf, p.base]))];
    const by = {};
    for (const k of need) {
      const r = dressLeaf(k, 'parchment', { state: null });
      by[k] = { svg: r.svg, expressed: [] };
    }
    const c = scenarioCensus(by);
    expect(c.ok, `the census passed with the state channel WITHHELD: ${c.reason}`).toBe(false);
    for (const r of c.rows) expect(r.citedDiff, `${r.leaf} still differs`).toBe(0);
    // …and the four plates really are one drawing without it, which is the defect itself
    expect(new Set(Object.values(by).map((v) => v.svg)).size).toBe(2);
  }, 900000);

  it('⭐ every stressor the world EXPRESSES reaches the page as ink, on every leaf', () => {
    // The silent half of the defect: a condition derived, published on the fabric, and then
    // dropped by the renderer. `expressed[]` is the world's claim; the census counts are the ink.
    for (const p of plates) {
      if (!p.expressed.length) continue;
      const c = p.census;
      const ink = c.stateBodies + c.barredGates + c.emptyStalls + c.watchFires + c.trampled
        + c.barricades;
      expect(ink, `${p.key} expresses ${JSON.stringify(p.expressed)} and draws nothing`)
        .toBeGreaterThan(0);
      expect(c.stateExpressed, `${p.key}`).toBe(p.expressed.length);
    }
    // and the corpus really does contain expressed leaves, so the loop above is not vacuous
    expect(plates.filter((p) => p.expressed.length).length).toBeGreaterThanOrEqual(6);
  });

  it('⛔ §18.4 market-infill fossils are NOT drawn as state bodies — the exclusion is asserted', () => {
    // `colonize.*` bodies ride on `stateMarks.bodies` and carry NO scenario signal; drawing them
    // in the scenario wave would put an unattributable shift inside the measurement that wave
    // exists to take. `town` has three of them and expresses nothing, so it must draw no camp.
    const town = plates.find((p) => p.key === 'town');
    expect(town.expressed).toEqual([]);
    expect(town.census.stateBodies, 'town drew a state body it has no state for').toBe(0);
    const siege = plates.find((p) => p.key === 'siege');
    // siege carries the SAME three fossils plus nine tents — so nine is the exact expected count
    expect(siege.census.stateBodies).toBe(9);
  });
});
