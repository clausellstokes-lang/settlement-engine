/**
 * archConditionGrammar.test.js -- K-2 SPINE: the condition-mapping layer (drift rules + coherence law).
 *
 * The K-2 drift kernel maps a settlement's STATE (the frozen 11-field conditionVector) to building FORM
 * -- a finite, typed selection of ornament / material / weathering / damage / statuary, per functional
 * archetype, one coherent dress per settlement. These tests pin the four invariant classes:
 *   1. FINITE-SEMANTICS   -- every output is a token from a frozen vocabulary; the statuary vocab only
 *                            ever names REAL kit assets (the map selects, never invents).
 *   2. DRIFT-TABLE TOTALITY (E-A) -- every archetype (the 8 SHAPE_FAMILIES) is profiled, and every
 *                            (archetype x condition field) sweep yields a valid in-vocabulary token --
 *                            no (archetype, field) can fall through to undefined. PLANT: delete a profile
 *                            or return an off-vocabulary token and the walker reds.
 *   3. COHERENCE LAW (E-A) -- one settlement = one dress; all buildings share the tracery/order/relief
 *                            spine; per-building variation is condition-driven; the variant is a pure
 *                            hash of (seedId, anchorKey) so adding a building never re-dresses another.
 *                            PLANT: stop inheriting the shared spine and neighbours clash -> reds.
 *   4. COVERT-ZERO SECURITY -- corruptionCovert is EXACTLY 0 (fail-closed at the input) and the drift
 *                            source NEVER reads it: the map can never leak what the dossier hides.
 * Plus THE 2D DRIFT PARITY: the moral-dark threshold is IMPORTED from spatial/moralDrift.js (not
 * re-pinned), and the pinned band edges are asserted so a silent re-tune reds.
 *
 * Determinism is by JSON.stringify equality (the selections are small typed bags, not meshes).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  DAMAGE_STATES, MATERIAL_TIERS, STATUARY_MODES, CIVIC_DRESS, ORNAMENT_ORDER, STATUARY_VOCAB,
  ARCHETYPE_PROFILES, MORAL_DARK_THRESHOLD,
  PROSPERITY_CUTS, WAR_SCAR_CUTS, CORRUPTION_CUTS, LEGITIMACY_CUTS, ALIGN_GOOD_CUTS,
  driftStatuaryMode, driftDamageState, driftOrnamentDensity,
} from '../../src/domain/townMap/arch/conditionGrammar.js';
import {
  resolveSettlementDress, driftBuildingDress, dressRoleAlbedo, DRIFT_ARCHETYPES, archetypeProfile,
} from '../../src/domain/townMap/arch/settlementDress.js';
import {
  makeConditionVector, neutralConditionVector, CONDITION_VECTOR_KEYS, CONDITION_VECTOR_FIELDS,
  ORNAMENT_DENSITY, TRACERY_FAMILY_TOKENS, SHAPE_FAMILIES,
} from '../../src/domain/townMap/arch/params.js';
import { WEATHERING_CLASSES } from '../../src/domain/townMap/arch/materials/materials.js';
import { KIT_ASSETS } from '../../src/domain/townMap/arch/kit.js';
import { MATERIAL_ROLES } from '../../src/domain/townMap/arch/grammarIR.js';
import { MORAL_DRIFT_TUNING } from '../../src/domain/spatial/moralDrift.js';

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/** a conditionVector varying one field to a value over the neutral base. */
const cvWith = (field, value) => makeConditionVector({ ...neutralConditionVector(), [field]: value });
/** a few probe values inside a field's band (index fields probed at their integer extremes; scalars
 *  clamped to [lo,hi] so the fixed-zero corruptionCovert field probes only 0 -- covert>0 is the
 *  fail-closed case tested separately, not a totality sweep value). */
function probeValues(field) {
  const f = CONDITION_VECTOR_FIELDS[field];
  if (f.kind === 'index') return [f.lo, Math.floor((f.lo + f.hi) / 2), f.hi];
  const all = [0, 0.19, 0.30, 0.45, 0.5, 0.6, 0.75, 0.85, 1].filter((v) => v >= f.lo && v <= f.hi);
  return all.length ? all : [f.lo];
}

// ── 1. FINITE-SEMANTICS: frozen vocabularies + statuary only names real kit assets ────────────────
describe('the drift vocabulary is finite + frozen (FINITE-SEMANTICS)', () => {
  it('guard-the-guard: the vocab sizes are pinned', () => {
    expect(DAMAGE_STATES).toEqual(['sound', 'shored', 'broken', 'patched']);
    expect(MATERIAL_TIERS).toEqual(['timber', 'stone', 'marble']);
    expect(STATUARY_MODES).toEqual(['beneficent', 'neutral', 'macabre', 'none']);
    expect(CIVIC_DRESS.length).toBe(5);
    expect(ORNAMENT_ORDER).toEqual(['chaotic', 'measured', 'regular']);
  });
  it('every statuary vocab piece is a REAL registered kit asset (the map selects, never invents)', () => {
    const kit = new Set(Object.keys(KIT_ASSETS));
    let pieces = 0;
    for (const mode of STATUARY_MODES) {
      expect(STATUARY_VOCAB[mode], `mode ${mode} has a vocab`).toBeDefined();
      for (const piece of STATUARY_VOCAB[mode]) { expect(kit.has(piece), `statuary "${piece}" is a registered kit asset`).toBe(true); pieces++; }
    }
    expect(pieces).toBeGreaterThan(0); // anti-vacuity
  });
  it('the vocab keys of STATUARY_VOCAB are exactly the STATUARY_MODES', () => {
    expect(Object.keys(STATUARY_VOCAB).sort()).toEqual([...STATUARY_MODES].sort());
  });
});

// ── 2. DRIFT-TABLE TOTALITY (E-A plant): every archetype profiled + every field sweep is in-vocab ──
describe('drift-table totality -- every archetype x every condition field is defined (E-A)', () => {
  it('every building archetype (the 8 SHAPE_FAMILIES) has a drift profile (deposit-and-consume)', () => {
    expect(Object.keys(ARCHETYPE_PROFILES).sort()).toEqual([...SHAPE_FAMILIES].sort());
    expect(DRIFT_ARCHETYPES).toEqual(SHAPE_FAMILIES);
    expect(DRIFT_ARCHETYPES.length).toBe(8); // guard-the-guard
    for (const a of DRIFT_ARCHETYPES) expect(() => archetypeProfile(a)).not.toThrow();
    expect(() => archetypeProfile('nonesuch')).toThrow(/no drift profile/);
  });

  const ORN = new Set(ORNAMENT_DENSITY), TRA = new Set(TRACERY_FAMILY_TOKENS), MAT = new Set(MATERIAL_TIERS);
  const DAM = new Set(DAMAGE_STATES), WEA = new Set(WEATHERING_CLASSES), MOD = new Set(STATUARY_MODES);
  const ORD = new Set(ORNAMENT_ORDER), CIV = new Set(CIVIC_DRESS), KIT = new Set(Object.keys(KIT_ASSETS));
  let sweeps = 0;
  for (const archetype of DRIFT_ARCHETYPES) {
    it(`${archetype}: every condition-field sweep yields in-vocabulary tokens`, () => {
      const dress = resolveSettlementDress('s', 'a', neutralConditionVector());
      for (const field of CONDITION_VECTOR_KEYS) {
        for (const v of probeValues(field)) {
          const bd = driftBuildingDress(dress, archetype, cvWith(field, v));
          expect(ORN.has(bd.ornamentDensity), `${archetype}/${field}=${v} ornamentDensity`).toBe(true);
          expect(TRA.has(bd.traceryFamily)).toBe(true);
          expect(MAT.has(bd.materialTier)).toBe(true);
          expect(DAM.has(bd.damageState)).toBe(true);
          expect(WEA.has(bd.weathering)).toBe(true);
          expect(MOD.has(bd.statuaryMode)).toBe(true);
          expect(ORD.has(bd.ornamentOrder)).toBe(true);
          expect(bd.reliefMotif >= 0 && bd.reliefMotif < 16).toBe(true);
          expect(bd.civicDress === null || CIV.has(bd.civicDress)).toBe(true);
          for (const piece of bd.statuaryVocab) expect(KIT.has(piece)).toBe(true);
          sweeps++;
        }
      }
    });
  }
  it('guard-the-guard: the totality walk actually ran a full grid', () => {
    // 8 archetypes x 11 fields x >=3 probes -> a few hundred sweeps; never 0 (anti-vacuity)
    expect(sweeps).toBeGreaterThan(8 * CONDITION_VECTOR_KEYS.length * 3 - 1);
  });

  it('dressRoleAlbedo covers every material role with an in-gamut linear RGB', () => {
    for (const [, raw] of Object.entries({ a: { prosperity: 0.9 }, b: { warScar: 0.9, corruptionRevealed: 0.9 } })) {
      const bd = driftBuildingDress(resolveSettlementDress('s', 'a'), 'sacred', makeConditionVector(raw));
      const map = dressRoleAlbedo(bd);
      for (const role of MATERIAL_ROLES) {
        expect(map[role], `role ${role}`).toBeDefined();
        for (const ch of map[role]) expect(ch >= 0 && ch <= 1).toBe(true);
      }
    }
  });
});

// ── 3. DRIFT DETERMINISM: same conditionVector -> byte-identical selection ─────────────────────────
describe('drift is deterministic (same conditionVector -> identical dress)', () => {
  const scenes = [
    { prosperity: 0.9, patronAlignGood: 0.85, patronAlignLaw: 0.8, moral: 0.85, terrain: 0.75, legitimacy: 0.85 },
    { warScar: 0.8, corruptionRevealed: 0.1, legitimacy: 0.4, patronEmblem: 12, historyMark: 7 },
    { patronAlignGood: 0.15, patronAlignLaw: 0.2, moral: 0.2, corruptionRevealed: 0.4, patronEmblem: 33 },
  ];
  for (let i = 0; i < scenes.length; i++) {
    it(`scene ${i}: settlement dress + building dress double-resolve identical`, () => {
      const cv = makeConditionVector(scenes[i]);
      expect(eq(resolveSettlementDress('seed', 'anchor', cv), resolveSettlementDress('seed', 'anchor', cv))).toBe(true);
      const d = resolveSettlementDress('seed', 'anchor', cv);
      expect(eq(driftBuildingDress(d, 'sacred', cv), driftBuildingDress(d, 'sacred', cv))).toBe(true);
    });
  }
});

// ── 4. THE COHERENCE LAW (E-A plant): one settlement, one dress; variation is condition-driven ─────
describe('the coherence law -- one settlement = one coherent dress (E-A)', () => {
  const cv = makeConditionVector({ prosperity: 0.8, patronAlignGood: 0.2, patronAlignLaw: 0.3, moral: 0.5, legitimacy: 0.7, historyMark: 5, patronEmblem: 9 });
  const dress = resolveSettlementDress('town', 'A', cv);

  it('all buildings share the tracery / order / relief spine EVEN with differing local conditions', () => {
    // give each building a DIFFERENT local condition; the shared spine must still hold (the coherence
    // teeth: break the inheritance in driftBuildingDress and these clash -> reds).
    const bldgs = DRIFT_ARCHETYPES.map((a, i) => driftBuildingDress(dress, a, makeConditionVector({ prosperity: i / DRIFT_ARCHETYPES.length, warScar: (i % 3) / 3, corruptionRevealed: (i % 2) / 2, patronAlignLaw: i / 10, historyMark: i })));
    for (const b of bldgs) {
      expect(b.traceryFamily).toBe(dress.traceryFamily);
      expect(b.ornamentOrder).toBe(dress.ornamentOrder);
      expect(b.reliefMotif).toBe(dress.reliefMotif);
    }
  });

  it('per-building variation is real (archetypes differ within the shared style)', () => {
    const sacred = driftBuildingDress(dress, 'sacred', cv);
    const domestic = driftBuildingDress(dress, 'domestic', cv);
    // same coherence spine, different specialization (ornament/statuary vary by role)
    expect(sacred.traceryFamily).toBe(domestic.traceryFamily);
    expect(eq(sacred.statuaryVocab, domestic.statuaryVocab)).toBe(false);
  });

  it('a corrupt ward decays while a clean ward gleams -- condition-driven contrast is legal', () => {
    const clean = driftBuildingDress(dress, 'sacred', makeConditionVector({ prosperity: 0.8, corruptionRevealed: 0 }));
    const corrupt = driftBuildingDress(dress, 'sacred', makeConditionVector({ prosperity: 0.8, corruptionRevealed: 0.9 }));
    expect(clean.weathering).not.toBe(corrupt.weathering); // the contrast the CONDITION drives
    expect(clean.traceryFamily).toBe(corrupt.traceryFamily); // but the town style still coheres
  });

  it('the variant is a pure hash of (seedId, anchorKey) -- adding a building never re-dresses another', () => {
    const a = resolveSettlementDress('town', 'A', cv);
    const b = resolveSettlementDress('town', 'B', cv);
    expect(a.variant).not.toBe(b.variant);           // distinct anchors -> distinct variant
    expect(eq(a, resolveSettlementDress('town', 'A', cv))).toBe(true); // stable regardless of B existing
    expect(a.traceryFamily).toBe(b.traceryFamily);   // same town condition -> same shared style
  });
});

// ── 5. THE COVERT-ZERO SECURITY PIN: the map never leaks what the dossier hides ────────────────────
describe('covert-zero security -- the map never dresses covert corruption', () => {
  it('a covert value fails closed at the contract boundary (before any drift runs)', () => {
    expect(() => makeConditionVector({ corruptionRevealed: 0.5, corruptionCovert: 0.5 })).toThrow(/covert/i);
  });
  it('the drift source NEVER reads corruptionCovert (structural: only revealed dresses)', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const src = (rel) => readFileSync(join(here, '../../src/domain/townMap/arch', rel), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const f of ['conditionGrammar.js', 'settlementDress.js']) {
      expect(src(f).includes('corruptionCovert'), `${f} must not read corruptionCovert in code`).toBe(false);
    }
  });
  it('revealed corruption DOES dress (the reveal is not silently dropped)', () => {
    const clean = driftBuildingDress(resolveSettlementDress('s', 'a'), 'sacred', makeConditionVector({ corruptionRevealed: 0 }));
    const shown = driftBuildingDress(resolveSettlementDress('s', 'a'), 'sacred', makeConditionVector({ corruptionRevealed: 0.9 }));
    expect(clean.weathering).not.toBe(shown.weathering);
  });
});

// ── 6. THE 2D DRIFT PARITY: the moral threshold is IMPORTED, the band edges are pinned ────────────
describe('the 2D drift parity -- imported where a 2D constant exists, pinned + cited elsewhere', () => {
  it('the moral-dark threshold is IMPORTED from spatial/moralDrift.js (not re-pinned)', () => {
    expect(MORAL_DARK_THRESHOLD).toBe(MORAL_DRIFT_TUNING.RECKONING_THRESHOLD);
    expect(MORAL_DARK_THRESHOLD).toBe(0.3); // the current 2D value; follows a 2D re-tune automatically
  });
  it('a good-patron town in moral freefall drifts macabre (the moral-parity tie-in)', () => {
    const good = makeConditionVector({ patronAlignGood: 0.9, moral: 0.9 });
    const fallen = makeConditionVector({ patronAlignGood: 0.9, moral: 0.1 }); // below RECKONING
    expect(driftStatuaryMode(good, 'macabre')).toBe('beneficent');
    expect(driftStatuaryMode(fallen, 'macabre')).toBe('macabre');
  });
  it('the pinned band edges are stable (a silent re-tune reds)', () => {
    expect(PROSPERITY_CUTS).toEqual([0.30, 0.50, 0.75]);   // PARITY: causalBand 75/50/30
    expect(WAR_SCAR_CUTS).toEqual([0.20, 0.45, 0.60]);     // PARITY: warExhaustionBand 0.20/0.60
    expect(CORRUPTION_CUTS).toEqual([0.25, 0.55]);
    expect(LEGITIMACY_CUTS).toEqual([0.30, 0.45, 0.60, 0.75]); // PARITY: rebandLegitimacy 30/45/60/75
    expect(ALIGN_GOOD_CUTS).toEqual([0.40, 0.60]);
  });
  it('warScar drives a saturating REVEALED damage ladder (a war-scarred town reads scarred)', () => {
    expect(driftDamageState(makeConditionVector({ warScar: 0 }), 1)).toBe('sound');
    expect(driftDamageState(makeConditionVector({ warScar: 0.3 }), 1)).toBe('shored');
    expect(driftDamageState(makeConditionVector({ warScar: 0.9 }), 1)).toBe('patched');
  });
});
