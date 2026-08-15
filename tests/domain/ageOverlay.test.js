/**
 * ageOverlay.test.js — VISION V-15 THE AGED MAP.
 *
 * The town wears its history: growth thickening, decade-fading calamity scars,
 * reconstruction patina — all DERIVED-ONLY (the stored layout / golden draw path
 * is never touched) and gated on a bounded age style so it can never pollute the
 * town-map golden.
 */
import { describe, it, expect } from 'vitest';
import {
  decadeDecay, deriveAgePortrait, ageOverlayOps, streetWearOps, SCAR_DECADE_HALF_LIFE_WEEKS,
} from '../../src/domain/townMap/ageOverlay.js';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { resolveTownMapStyle } from '../../src/design/townMapStyles.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const AGE_STYLE = { ink: '#4a4030', opacity: { age: 0.5 }, stroke: { age: 1.4 } };
const model = buildTownMapModel(GOLDEN_CONFIGS[0].settlement);
const cat = model.districts[0].category; // the fixture's district class

describe('V-15 — decadeDecay (half-life measured in decades)', () => {
  it('halves every decade; is full when fresh; is zero before it forms', () => {
    expect(decadeDecay(1, 0)).toBe(1);
    expect(decadeDecay(1, SCAR_DECADE_HALF_LIFE_WEEKS)).toBeCloseTo(0.5, 10);
    expect(decadeDecay(1, SCAR_DECADE_HALF_LIFE_WEEKS * 2)).toBeCloseTo(0.25, 10);
    expect(decadeDecay(1, -10)).toBe(0); // a mark that does not exist yet at this scrub week
    expect(decadeDecay(0.8, SCAR_DECADE_HALF_LIFE_WEEKS / 2)).toBeCloseTo(0.8 * Math.SQRT1_2, 10);
  });
});

describe('V-15 — deriveAgePortrait (from the urban-fabric mirror, as of a week)', () => {
  const settlement = { urbanFabric: {
    stocks: { residential: 0.8, market: 0.4 },
    scars: [
      { kind: 'burn_lots', severity: 0.9, week: 100 },
      { kind: 'flood_line', severity: 0.5, week: 600 }, // in the FUTURE for asOfWeek 300
    ],
    rebirths: [{ classes: ['market'], type: 'fire', week: 200 }],
  } };

  it('carries growth stocks and decade-decayed scars, skipping not-yet-formed marks', () => {
    const p = deriveAgePortrait({ settlement, asOfWeek: 300 });
    expect(p.growth).toEqual({ market: 0.4, residential: 0.8 });
    expect(p.scars.map((s) => s.kind)).toEqual(['burn_lots']); // the future flood is skipped
    expect(p.scars[0].displaySeverity).toBeGreaterThan(0.6);
    expect(p.scars[0].displaySeverity).toBeLessThan(0.75);
    expect(p.rebirthClasses).toEqual(['market']);
  });

  it('scrubbing back shows fresher scars and un-happened rebirths', () => {
    const p = deriveAgePortrait({ settlement, asOfWeek: 150 }); // just after the burn, before the rebirth
    expect(p.scars[0].displaySeverity).toBeGreaterThan(0.8); // bolder when fresh
    expect(p.rebirthClasses).toEqual([]); // the market rebirth (week 200) has not happened yet
  });

  it('is empty for a settlement with no fabric memory (dark ⇒ near-empty overlay)', () => {
    const p = deriveAgePortrait({ settlement: {}, asOfWeek: 300 });
    expect(p.growth).toEqual({});
    expect(p.scars).toEqual([]);
    expect(p.rebirthClasses).toEqual([]);
  });
});

describe('V-15 — ageOverlayOps (the op-emitter + the dormancy wall)', () => {
  const portrait = { growth: { [cat]: 0.8 }, scars: [{ kind: 'burn_lots', week: 0, displaySeverity: 0.8 }], rebirthClasses: [cat], asOfWeek: 300 };

  it('emits ops under the bounded age style', () => {
    const ops = ageOverlayOps(model, AGE_STYLE, portrait);
    expect(ops.length).toBeGreaterThan(0);
  });

  it('is deterministic — a second build is byte-identical', () => {
    expect(JSON.stringify(ageOverlayOps(model, AGE_STYLE, portrait))).toBe(JSON.stringify(ageOverlayOps(model, AGE_STYLE, portrait)));
  });

  it('THE DORMANCY WALL — a base lens (no .age fields) emits NOTHING (cannot pollute the golden path)', () => {
    for (const id of ['parchment', 'watercolor', 'darkFantasy', 'vtt', 'accessible']) {
      expect(ageOverlayOps(model, resolveTownMapStyle(id), portrait)).toEqual([]);
    }
    expect(ageOverlayOps(model, { opacity: {}, stroke: {} }, portrait)).toEqual([]);
  });

  it('a null model ⇒ [] (total on garbage)', () => {
    expect(ageOverlayOps(null, AGE_STYLE, portrait)).toEqual([]);
  });
});

describe('V-25a — streetWearOps (the street-level wear follow-on)', () => {
  const worn = { growth: { [cat]: 0.8 }, scars: [{ kind: 'burn_lots', week: 0, displaySeverity: 0.8 }], rebirthClasses: [], asOfWeek: 300 };

  it('lays wear ruts on the thoroughfares when the town carries history', () => {
    const ops = streetWearOps(model, AGE_STYLE, worn);
    expect(ops.length).toBeGreaterThan(0);
    for (const op of ops) {
      expect(op.t).toBe('line');
      for (const v of [op.x1, op.y1, op.x2, op.y2]) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1000); }
    }
  });

  it('is deterministic — a second build is byte-identical', () => {
    expect(JSON.stringify(streetWearOps(model, AGE_STYLE, worn))).toBe(JSON.stringify(streetWearOps(model, AGE_STYLE, worn)));
  });

  it('THE DORMANCY WALL — a base lens (no .age fields) emits NOTHING', () => {
    for (const id of ['parchment', 'watercolor', 'darkFantasy', 'vtt', 'accessible']) {
      expect(streetWearOps(model, resolveTownMapStyle(id), worn)).toEqual([]);
    }
  });

  it('absent history ⇒ NOTHING (empty portrait ⇒ no wear signal)', () => {
    const dark = { growth: {}, scars: [], rebirthClasses: [], asOfWeek: 300 };
    expect(streetWearOps(model, AGE_STYLE, dark)).toEqual([]);
    expect(streetWearOps(null, AGE_STYLE, worn)).toEqual([]);
  });

  it('is a SEPARATE layer — ageOverlayOps is untouched (its golden holds); wear adds its own marks', () => {
    const area = ageOverlayOps(model, AGE_STYLE, worn);
    const wear = streetWearOps(model, AGE_STYLE, worn);
    // the district-area emitter still emits (unchanged path); the wear emitter contributes on top
    expect(area.length).toBeGreaterThan(0);
    expect(wear.length).toBeGreaterThan(0);
  });
});
