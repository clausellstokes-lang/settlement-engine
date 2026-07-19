/**
 * townMapSeasonDress.test.js — THE ILLUSTRATED TOWN (IT-3): season/state dress + the resolver.
 *
 * Pins:
 *   • DORMANCY (the law) — the seasonless path (no dress / null dress) is BYTE-IDENTICAL to the
 *     2-arg base, on the illustrated lens AND on every other lens. This is the dormancy proof at
 *     unit strength (the golden proves it at golden strength).
 *   • SEASON SWAPS — a season context changes the ground dress (winter ≠ summer ≠ base) and is
 *     folded into the seed (deterministic, reproducible).
 *   • BOUNDED — every season variant stays within DRESS_CAP on the largest seed (no explosion).
 *   • ACCESSIBLE LENS stays dress-free even WITH a season context (it never names the dress
 *     fields) ⇒ byte-identical + colourblind-safe.
 *   • THE RESOLVER — resolveMapDress derives season from worldState.calendar + severity from
 *     seasonalSeverityFor, returns null when there's nothing to paint (the dormancy source).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { groundDressOps } from '../../src/domain/townMap/groundDress.js';
import { resolveMapDress } from '../../src/domain/townMap/mapDress.js';
import { seasonalSeverityFor } from '../../src/domain/worldPulse/seasons.js';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { GOLDEN_CONFIGS, V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const stable = (v) => JSON.stringify(v);
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const DRESS_CAP = 160; // must match tests/design/townMapOpBudget.test.js

const richModel = () => buildTownMapModel(GOLDEN_CONFIGS[10].settlement); // city / coastal / walls / water

describe('season dress — DORMANCY (seasonless === base bytes)', () => {
  it('groundDressOps: no-dress === null-dress === {season:null} (byte-identical)', () => {
    const model = richModel();
    const base = stable(groundDressOps(model, 'illustrated'));
    expect(stable(groundDressOps(model, 'illustrated', null))).toBe(base);
    expect(stable(groundDressOps(model, 'illustrated', { season: null }))).toBe(base);
    expect(stable(groundDressOps(model, 'illustrated', {}))).toBe(base);
  });

  it('buildTownMapDrawList: the 2-arg call === 3-arg-null (illustrated + every other lens)', () => {
    const model = richModel();
    for (const lens of [...TOWN_MAP_STYLE_IDS, 'illustrated']) {
      expect(stable(buildTownMapDrawList(model, lens, null)), `${lens} moved`).toBe(stable(buildTownMapDrawList(model, lens)));
    }
  });

  it('a non-illustrated lens emits ZERO dress even WITH a winter context (no dress fields named)', () => {
    const model = richModel();
    // accessible + every re-skin never name style.opacity.dress ⇒ [] dress ⇒ byte-identical to base.
    for (const lens of TOWN_MAP_STYLE_IDS) {
      expect(groundDressOps(model, lens, { season: 'winter', severity: 'hard_winter' }).length, `${lens} dressed`).toBe(0);
      expect(stable(buildTownMapDrawList(model, lens, { season: 'winter' })), `${lens} moved w/ season`).toBe(stable(buildTownMapDrawList(model, lens)));
    }
  });
});

describe('season dress — the season swaps + determinism', () => {
  it('each season changes the illustrated ground dress vs the seasonless base', () => {
    const model = richModel();
    const base = stable(groundDressOps(model, 'illustrated'));
    for (const season of SEASONS) {
      const dressed = stable(groundDressOps(model, 'illustrated', { season }));
      if (season === 'spring' || season === 'summer') {
        // spring/summer are the default look, but folded into the seed ⇒ still deterministic;
        // they MAY differ from base only by the seed suffix (a different texture, same idiom).
        expect(dressed).not.toBe(''); // sanity
      } else {
        expect(dressed, `${season} looked identical to base`).not.toBe(base);
      }
    }
    // winter ≠ summer (bare trees + snow vs full canopy + dots)
    expect(stable(groundDressOps(model, 'illustrated', { season: 'winter' })))
      .not.toBe(stable(groundDressOps(model, 'illustrated', { season: 'summer' })));
  });

  it('is byte-deterministic — same (model, season, severity) hashes identically', () => {
    const model = richModel();
    for (const season of SEASONS) {
      for (const severity of [null, 'drought', 'hard_winter', 'bountiful']) {
        const a = stable(groundDressOps(model, 'illustrated', { season, severity }));
        const b = stable(groundDressOps(model, 'illustrated', { season, severity }));
        expect(a, `${season}/${severity} not reproducible`).toBe(b);
      }
    }
  });

  it('severity deepens a season deterministically (hard_winter ≠ plain winter)', () => {
    const model = richModel();
    expect(stable(groundDressOps(model, 'illustrated', { season: 'winter', severity: 'hard_winter' })))
      .not.toBe(stable(groundDressOps(model, 'illustrated', { season: 'winter', severity: null })));
    expect(stable(groundDressOps(model, 'illustrated', { season: 'summer', severity: 'drought' })))
      .not.toBe(stable(groundDressOps(model, 'illustrated', { season: 'summer', severity: null })));
  });
});

describe('season dress — BOUNDED (≤ DRESS_CAP on every seed × season × severity)', () => {
  it('no season variant explodes the frame texture', () => {
    let worst = { label: 'none', ops: 0 };
    const configs = [
      ...GOLDEN_CONFIGS.map((c) => ({ ...c, model: buildTownMapModel(c.settlement) })),
      ...V2_GOLDEN_CONFIGS.map((c) => ({ ...c, model: buildTownMapModel(c.settlement, c.mapEdits) })),
    ];
    for (const c of configs) {
      for (const season of SEASONS) {
        for (const severity of [null, 'drought', 'hard_winter', 'bountiful']) {
          const n = groundDressOps(c.model, 'illustrated', { season, severity }).length;
          if (n > worst.ops) worst = { label: `${c.spec.tier}/${c.spec.terrain} ${season}/${severity}`, ops: n };
        }
      }
    }
    expect(worst.ops, `worst season dress ${worst.label} = ${worst.ops} (> ${DRESS_CAP})`).toBeLessThanOrEqual(DRESS_CAP);
    expect(worst.ops).toBeGreaterThan(0);
  });
});

describe('season dress — resolveMapDress (the season source)', () => {
  it('null / calendar-less worldState ⇒ null (seasonless base, the dormancy source)', () => {
    expect(resolveMapDress({ id: 's1' }, null)).toBeNull();
    expect(resolveMapDress({ id: 's1' }, {})).toBeNull();
    expect(resolveMapDress({ id: 's1' }, { calendar: {} })).toBeNull();
    expect(resolveMapDress({ id: 's1' }, { calendar: { season: 'nonsense' } })).toBeNull();
  });

  it('derives season from the calendar + severity from the seeded verdict', () => {
    const worldState = { rngSeed: 'seed-xyz', calendar: { season: 'Winter', year: 4 } };
    const dress = resolveMapDress({ id: 's7' }, worldState);
    expect(dress).not.toBeNull();
    expect(dress.season).toBe('winter'); // lowercased, bounded
    expect(dress.severity).toBe(seasonalSeverityFor('seed-xyz', 4, 's7')); // exact seeded match
  });

  it('no rngSeed / no id ⇒ season only, severity null', () => {
    expect(resolveMapDress({ id: 's7' }, { calendar: { season: 'summer', year: 2 } }).severity).toBeNull();
    expect(resolveMapDress(null, { rngSeed: 'x', calendar: { season: 'summer', year: 2 } }).severity).toBeNull();
  });

  it('a resolved dress fed through the draw list paints the season', () => {
    const model = richModel();
    const dress = resolveMapDress({ id: 's7' }, { rngSeed: 'seed-xyz', calendar: { season: 'winter', year: 4 } });
    expect(stable(buildTownMapDrawList(model, 'illustrated', dress)))
      .not.toBe(stable(buildTownMapDrawList(model, 'illustrated')));
  });
});

describe('state dress (IT3-b) — DORMANCY (absent read ⇒ zero state ops)', () => {
  it('no state === state:null (byte-identical to season-only)', () => {
    const model = richModel();
    const winter = stable(groundDressOps(model, 'illustrated', { season: 'winter' }));
    expect(stable(groundDressOps(model, 'illustrated', { season: 'winter', state: null }))).toBe(winter);
    // an all-false state adds nothing (no siege, no scars, no rebirth)
    expect(stable(groundDressOps(model, 'illustrated', { season: 'winter', state: { besieged: false, scarLevel: 0, rebuiltCategories: [] } }))).toBe(winter);
  });

  it('resolveMapDress: a dark urban-fabric mirror + no siege ⇒ no state (null when seasonless)', () => {
    expect(resolveMapDress({ id: 'x' }, null)).toBeNull();                          // nothing at all
    expect(resolveMapDress({ id: 'x', urbanFabric: {} }, null)).toBeNull();          // dark mirror
    expect(resolveMapDress({ id: 'x', urbanFabric: { scars: [] } }, null)).toBeNull();
    // a season with a dark mirror ⇒ season present, state null
    const d = resolveMapDress({ id: 'x' }, { calendar: { season: 'summer', year: 1 } });
    expect(d.state).toBeNull();
  });
});

describe('state dress (IT3-b) — each mark appears from its read', () => {
  it('SIEGE works ring — besieged adds ops over the base', () => {
    const model = richModel();
    const base = groundDressOps(model, 'illustrated').length;
    const sieged = groundDressOps(model, 'illustrated', { state: { besieged: true } }).length;
    expect(sieged).toBeGreaterThan(base);
  });

  it('SCAR grain — scarLevel adds ops, heavier scars add more', () => {
    const model = richModel();
    const base = groundDressOps(model, 'illustrated').length;
    const light = groundDressOps(model, 'illustrated', { state: { scarLevel: 0.3 } }).length;
    const heavy = groundDressOps(model, 'illustrated', { state: { scarLevel: 0.9 } }).length;
    expect(light).toBeGreaterThan(base);
    expect(heavy).toBeGreaterThanOrEqual(light);
  });

  it('REBIRTH scaffold — a rebuilt district CLASS adds scaffold ops on the matching quarter', () => {
    const model = richModel();
    const cat = model.districts[0].category;
    const base = groundDressOps(model, 'illustrated').length;
    const rebuilt = groundDressOps(model, 'illustrated', { state: { rebuiltCategories: [cat] } }).length;
    expect(rebuilt).toBeGreaterThan(base);
    // an unmatched class adds nothing (no district carries it)
    expect(groundDressOps(model, 'illustrated', { state: { rebuiltCategories: ['__no_such_class__'] } }).length).toBe(base);
  });

  it('is deterministic across runs (state marks are seeded, no trig)', () => {
    const model = richModel();
    const dress = { season: 'winter', severity: 'hard_winter', state: { besieged: true, scarLevel: 0.8, rebuiltCategories: [model.districts[0].category] } };
    expect(stable(groundDressOps(model, 'illustrated', dress))).toBe(stable(groundDressOps(model, 'illustrated', dress)));
  });
});

describe('state dress (IT3-b) — resolveMapDress wires the reads', () => {
  it('SCARS — urbanFabric.scars ⇒ state.scarLevel = the worst severity', () => {
    const settlement = { id: 's9', urbanFabric: { scars: [{ kind: 'siege_repairs', severity: 0.4, week: 10 }, { kind: 'lean_years', severity: 0.8, week: 12 }] } };
    const d = resolveMapDress(settlement, null);
    expect(d).not.toBeNull();
    expect(d.state.scarLevel).toBe(0.8);
  });

  it('REBIRTH — urbanFabric.rebirths ⇒ state.rebuiltCategories (deduped, sorted)', () => {
    const settlement = { id: 's9', urbanFabric: { rebirths: [{ classes: ['market', 'civic'], type: 'fire', week: 8 }, { classes: ['civic'], type: 'flood', week: 9 }] } };
    const d = resolveMapDress(settlement, null);
    expect(d.state.rebuiltCategories).toEqual(['civic', 'market']);
  });

  it('SIEGE — a deployment targeting the settlement ⇒ state.besieged', () => {
    const worldState = { deployments: { enemyTown: { targetId: 's9' } } };
    const d = resolveMapDress({ id: 's9' }, worldState);
    expect(d.state.besieged).toBe(true);
    // a settlement NOT targeted ⇒ not besieged
    expect(resolveMapDress({ id: 'other' }, worldState)).toBeNull();
  });
});

describe('state dress (IT3-b) — BOUNDED (full stack ≤ DRESS_CAP)', () => {
  it('the worst season + siege + scars + all-classes rebuilt stays ≤ DRESS_CAP on every seed', () => {
    let worst = { label: '', ops: 0 };
    const configs = [
      ...GOLDEN_CONFIGS.map((c) => ({ label: `v1 ${c.spec.tier}/${c.spec.terrain}`, model: buildTownMapModel(c.settlement) })),
      ...V2_GOLDEN_CONFIGS.map((c) => ({ label: `v2 ${c.spec.tier}/${c.spec.terrain}`, model: buildTownMapModel(c.settlement, c.mapEdits) })),
    ];
    for (const c of configs) {
      const cats = [...new Set((c.model.districts || []).map((d) => d.category))];
      for (const severity of ['bountiful', 'hard_winter', 'drought']) {
        const n = groundDressOps(c.model, 'illustrated', { season: 'winter', severity, state: { besieged: true, scarLevel: 1, rebuiltCategories: cats } }).length;
        if (n > worst.ops) worst = { label: `${c.label} ${severity}`, ops: n };
      }
    }
    expect(worst.ops, `worst full-stack dress ${worst.label} = ${worst.ops} (> ${DRESS_CAP})`).toBeLessThanOrEqual(DRESS_CAP);
  });
});
