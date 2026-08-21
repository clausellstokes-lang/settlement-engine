/**
 * tests/lint/substrateCoherence.walker.test.js — §161a + §5.-1c, THE CONSISTENCY WALKER.
 *
 * ⭐⭐ TWO PIN FORMS, AND WHICH ONE APPLIES IS ITSELF DERIVED (§5.-1c).
 *   UNFORCED settlements assert THE LAND MATCHES THE ECONOMY — a mountain-valley
 *     settlement whose substrate rolls flat plains is a RED.
 *   FORCED settlements assert BEST RECONCILIATION, EVERY FORCED FACT HONOURED — because a
 *     user who asserts mountain AND ocean AND a port has not made an error, they have
 *     named a fjord, and asserting "the land matches the economy" against a forced
 *     combination would red the correct answer.
 * Applying the unforced form to a forced settlement is the failure this file exists to
 * make impossible.
 *
 * ⚠ EVERY ARM CARRIES A PLANTED CONTROL. A substrate that cannot contradict its dossier
 * proves nothing.
 */
import { describe, it, expect } from 'vitest';
import {
  buildSubstrate, measuredRelief, wetShare, workableSlopeShare,
  forcedConstraints, reconcileLandform, LANDFORM_FAMILIES, FAMILY_SATISFIES, STRAIN_WORKS,
} from '../../src/domain/townMap/fabric/substrate.js';

const sub = (terrain, commodity, access, facts) => buildSubstrate(
  { config: { tradeRouteAccess: access || 'moderate' }, economicState: { tradeCommodity: commodity } },
  terrain, { seed: 'walker-seed' }, facts || {},
);

describe('substrate coherence — the unforced pin form', () => {
  it('a mountain settlement never rolls flat plains', () => {
    expect(measuredRelief(sub('mountain', 'iron'))).toBeGreaterThan(measuredRelief(sub('plains', 'grain')) * 2.5);
  });

  it('PLANTED CONTROL: a flat substrate fails the relief arm', () => {
    const flat = { ...sub('mountain', 'iron'), height: new Float64Array(96 * 96).fill(0.5) };
    expect(measuredRelief(flat)).toBe(0);
  });

  it('a DRY biome holds no standing water unless a water economy justifies it', () => {
    expect(wetShare(sub('desert', 'stone'))).toBe(0);
    expect(wetShare(sub('desert', 'fish'))).toBeGreaterThan(0);
  });

  it('an ORE economy raises the relief floor, so workable slope exists', () => {
    expect(measuredRelief(sub('plains', 'iron'))).toBeGreaterThan(measuredRelief(sub('plains', 'grain')));
    expect(workableSlopeShare(sub('plains', 'iron'))).toBeGreaterThan(0.05);
  });

  it('road count tracks tradeRouteAccess', () => {
    expect(sub('plains', 'grain', 'isolated').route.roads).toBeLessThan(sub('plains', 'grain', 'crossroads').route.roads);
  });
});

describe('substrate coherence — the FORCED pin form (§5.-1c)', () => {
  it('mountain + ocean + port reconciles to a FJORD with every forced fact honoured', () => {
    const facts = { waterKind: 'coast' };
    const s = sub('mountain', 'fish', 'port', facts);
    expect(s.forced).toBe(true);
    expect(s.family).toBe('fjord');
    expect(s.strained).toHaveLength(0);
    // anchored: the reconciliation keeps the mountain's relief — it did not flatten the
    // mountain to make room for the sea
    expect(measuredRelief(s)).toBeGreaterThan(0.5);
  });

  it('desert + river reconciles to an OASIS and RECORDS its residual strain as work', () => {
    const s = sub('desert', 'stone', 'river', { waterKind: 'river' });
    expect(s.family).toBe('oasis');
    for (const w of s.works) expect(STRAIN_WORKS[w.constraint]).toBeTruthy();
  });

  it('an UNFORCED settlement is not marked forced (the two forms do not overlap)', () => {
    expect(sub('plains', 'grain').forced).toBe(false);
  });

  it('every landform family declares a constraint set — totality by construction', () => {
    for (const family of Object.keys(LANDFORM_FAMILIES)) {
      expect(FAMILY_SATISFIES[family], `family '${family}' has no constraint set`).toBeTruthy();
    }
  });

  it('the solver never discards a forced fact to keep a family tidy', () => {
    const constraints = forcedConstraints(
      { config: { tradeRouteAccess: 'port' }, economicState: { tradeCommodity: 'iron' } },
      'mountain', { waterKind: 'coast' },
    );
    const solved = reconcileLandform(constraints, 'mountain');
    const covered = solved.satisfied.length + solved.strained.length;
    expect(covered).toBe(constraints.length);
  });
});

/**
 * ⭐⭐⭐ §5 W1 EXIT 1 · THE CONSISTENCY PIN **OVER EVERY §161a INPUT** — added by lane MF-W1b.
 *
 * ⛔ WHAT THE FILE ABOVE ACTUALLY COVERED, AND IT IS ONE INPUT OF FOUR. §161a names four
 * contracts by hand — *ore ⇒ workable slopes and spoil ground · fisheries ⇒ shore and shoal ·
 * timber ⇒ standing forest · quarry ⇒ exposed stone* — and every pin above asserts the RELIEF
 * FLOOR, which is the ore contract's first half and nothing else. A fishery, a wood and a
 * quarry could each be sited on ground that cannot carry them and the walker was silent.
 *
 * ⚠⚠ AND THE VACUITY THIS SET IS WRITTEN AROUND, because it is the one that would have made
 * these arms worthless: **a coherence check that re-uses the SITER's own fit expression is
 * `list === list`.** `siteResources` ranks cells by a `fit` and takes a seeded rank; asserting
 * that the winner scores well on `fit` is asserting that the argmax of a function is where the
 * function is large. `resourceCoherence` therefore asks LEAF-LEVEL SHARES and absolute
 * readings with floors — statistics that appear nowhere in `siteResources`.
 */
import {
  resourceCoherence, buildSubstrate as mkSub, RESOURCE_GROUND,
} from '../../src/domain/townMap/fabric/substrate.js';

const econ = (commodity, access) => ({
  config: { tradeRouteAccess: access || 'moderate' },
  economicState: { tradeCommodity: commodity },
});

describe('§5 W1 exit 1 — §161a consistency over EVERY resource input', () => {
  it('ORE ⇒ workable slopes AND spoil ground', () => {
    const s = mkSub(econ('iron'), 'hills', { seed: 'coh-ore' }, {});
    const c = resourceCoherence(s);
    expect(c.status).toBe('MEASURED');
    const row = c.rows.find((r) => r.needs === 'workable-slope');
    expect(row, 'no workable-slope contract was invoked').toBeTruthy();
    expect(row.ok).toBe(true);
    expect(row.evidence.workableShare).toBeGreaterThan(0.04);   // the slopes
    expect(row.evidence.wet).toBeLessThan(0.55);                // ground to tip spoil on
    expect(row.why).toMatch(/SPOIL GROUND/);
  });

  it('FISHERIES ⇒ shore AND shoal', () => {
    const s = mkSub(econ('fish', 'port'), 'coastal', { seed: 'coh-fish' }, { waterKind: 'coast' });
    const c = resourceCoherence(s);
    const row = c.rows.find((r) => r.needs === 'shore');
    expect(row, 'no shore contract was invoked').toBeTruthy();
    expect(row.ok).toBe(true);
    // ⭐ THE SHOAL IS THE HALF A "shore" TEST WOULD MISS: a fishery needs shallow water to
    // work, not merely water somewhere on the leaf. ⚠ AND IT IS READ OFF THE **HEIGHT** FIELD
    // as well as the wetness one, because on a coastal leaf the sea is a height contour and
    // `sub.wet` knows nothing about it — see resourceCoherence's own note.
    expect(row.evidence.wetShare > 0 || row.evidence.ramp > 0).toBe(true);
    expect(row.evidence.shoalShare).toBeGreaterThanOrEqual(0.30);
    expect(row.why).toMatch(/SHORE and SHOAL/);
  });

  it('TIMBER ⇒ standing forest — soil that holds water on ground it can be grown on', () => {
    const s = mkSub(econ('timber'), 'forest', { seed: 'coh-timber' }, {});
    const c = resourceCoherence(s);
    const row = c.rows.find((r) => r.needs === 'standing-forest');
    expect(row, 'no standing-forest contract was invoked').toBeTruthy();
    expect(row.ok).toBe(true);
    expect(row.evidence.meanWet).toBeGreaterThanOrEqual(0.04);
    expect(row.evidence.gentleShare).toBeGreaterThanOrEqual(0.30);
    expect(row.why).toMatch(/STANDING FOREST/);
  });

  it('QUARRY ⇒ exposed stone — and stone is a property of the GROUND, not of angle', () => {
    const s = mkSub(econ('stone_quarry'), 'hills', { seed: 'coh-quarry' }, {});
    const c = resourceCoherence(s);
    const row = c.rows.find((r) => r.needs === 'exposed-stone');
    expect(row, 'no exposed-stone contract was invoked').toBeTruthy();
    expect(row.ok).toBe(true);
    expect(row.evidence.rockBias).toBeGreaterThan(0);
    expect(row.why).toMatch(/EXPOSED STONE/);
  });

  it('the four §161a contracts named in the spec are all REACHABLE from RESOURCE_GROUND', () => {
    // ⚠ TOTALITY, so a later wave cannot delete a contract and leave three arms passing.
    const needs = new Set(Object.values(RESOURCE_GROUND).map((r) => r.needs));
    for (const n of ['workable-slope', 'exposed-stone', 'shore', 'standing-forest']) {
      expect(needs.has(n), `§161a names '${n}' and no RESOURCE_GROUND row provides it`).toBe(true);
    }
  });

  it('⛔ COUNTERFACTUAL — an INCONSISTENT resource REDS, one clause at a time', () => {
    // ⭐⭐ THE PLANT IS IN THE GROUND, NOT IN THE DOSSIER, and that is deliberate: planting a
    // resource on the wrong terrainType is absorbed by §5.-1c's SOLVER (declare `stone` on
    // plains and the solver moves to `hills`, which is the solver working). The only way to
    // produce a genuinely incoherent leaf is to make the GROUND unable to carry an economy
    // the settlement really has — so each arm takes a coherent substrate and removes the one
    // thing that contract needs.
    const ore = mkSub(econ('iron'), 'hills', { seed: 'cf-ore' }, {});
    expect(resourceCoherence(ore).coherent).toBe(true);
    const flattened = { ...ore, slope: new Float64Array(ore.slope.length) };
    const cf1 = resourceCoherence(flattened);
    expect(cf1.coherent).toBe(false);
    expect(cf1.rows.find((r) => r.needs === 'workable-slope').ok).toBe(false);
    expect(cf1.reason).toMatch(/INCOHERENT/);

    const fish = mkSub(econ('fish', 'port'), 'coastal', { seed: 'cf-fish' }, { waterKind: 'coast' });
    expect(resourceCoherence(fish).coherent).toBe(true);
    // ⚠ TAKING THE WATER AWAY IS TWO FIELDS BECAUSE THE WATER IS IN TWO FIELDS: the wetness
    // (a river fishery) and the shelf + low ground (a sea fishery). Zeroing only one leaves
    // the other arm passing, which would make this counterfactual a half-plant.
    const dried = {
      ...fish,
      wet: new Float64Array(fish.wet.length),
      shape: { ...fish.shape, ramp: 0 },
      height: new Float64Array(fish.height.length).fill(0.9),
    };
    const cf2 = resourceCoherence(dried);
    expect(cf2.coherent).toBe(false);
    expect(cf2.rows.find((r) => r.needs === 'shore').ok).toBe(false);

    const wood = mkSub(econ('timber'), 'forest', { seed: 'cf-timber' }, {});
    expect(resourceCoherence(wood).coherent).toBe(true);
    const sheer = { ...wood, slope: new Float64Array(wood.slope.length).fill(1), wet: new Float64Array(wood.wet.length) };
    const cf3 = resourceCoherence(sheer);
    expect(cf3.coherent).toBe(false);
    expect(cf3.rows.find((r) => r.needs === 'standing-forest').ok).toBe(false);

    const quarry = mkSub(econ('stone_quarry'), 'hills', { seed: 'cf-quarry' }, {});
    expect(resourceCoherence(quarry).coherent).toBe(true);
    const soft = { ...quarry, shape: { ...quarry.shape, rockBias: 0 } };
    const cf4 = resourceCoherence(soft);
    expect(cf4.coherent).toBe(false);
    expect(cf4.rows.find((r) => r.needs === 'exposed-stone').ok).toBe(false);
  });

  it('the ladder is honest — an economy with NO ground contract reads NOT APPLICABLE, never a pass', () => {
    // ⭐ PERF1 §8's own words: "a zero here is not a clean bill; it is an absence of a
    // question." A settlement whose ledger names nothing contract-bearing has no consistency
    // to assert, and reporting that as `coherent: true, checked: 0, status: MEASURED` would
    // be a green light nobody earned.
    const bare = mkSub({ config: {}, economicState: {} }, 'plains', { seed: 'coh-bare' }, {});
    const c = resourceCoherence(bare);
    expect(c.checked).toBe(0);
    expect(c.status).toBe('NOT APPLICABLE');
    expect(c.reason).toMatch(/NOT APPLICABLE/);
  });
});
