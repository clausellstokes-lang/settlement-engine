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
  inRing, contrast, polesOf, VALUE_STEP, GRAIN, DRESS_GROUPS, DRESS_LEGEND,
  DRESS_SCHEMA_VERSION, PAGE_QUANTUM_DECIMALS,
} from '../../src/domain/townMap/fabric/partitionDress.js';

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

  it('the grain family keeps its reviewed stroke and opacity — the CURE was the reach', () => {
    expect(GRAIN.stroke).toBe(0.25);
    expect(GRAIN.opacity).toBe(0.72);
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
