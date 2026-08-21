/**
 * domain/townMap/arch/settlementDress.js -- K-2: THE COHERENCE LAW (one settlement, one dress).
 *
 * THE COHERENCE LAW (owner order, K-2): one settlement = one coherent dress. A whole town does not read
 * as a bag of clashing buildings -- it shares a resolved STYLE (material tier, tracery family, ornament
 * order, statuary lean, relief motif, the recorded-history mark) drawn once from (seedId, anchorKey,
 * settlement conditionVector). Each building then VARIES that shared dress only by its functional
 * archetype and its LOCAL condition -- so a corrupt ward may decay while the temple ward gleams, because
 * THE CONDITION says so (a condition-driven contrast is legal and desirable; an arbitrary clash is not).
 *
 * This is the layer above conditionGrammar.js (the per-field drift rules): resolveSettlementDress folds
 * the rules into the ONE shared dress; driftBuildingDress specializes it per (archetype, building
 * condition); dressRoleAlbedo lowers a building dress into a role -> linear-RGB map the CPU plate reads
 * (the reskin seam, drop-in for plate.ROLE_ALBEDO) so the drift is renderable WITHOUT touching geometry
 * or the frozen contract. The kernel stays DORMANT (imported by nothing shipped; closure Delta 0).
 *
 * THE DRIFT PARITY (coherent with the 2D layer): the shared-dress idea mirrors the 2D massing/
 * dressedStyle seam (massing.js: one settlement's style resolved once, per-building variant a pure hash
 * of seedId+anchorKey -- the never-restamp law, previewed there for M-0b). The variant tie-break here
 * uses the SAME FNV-1a(seedId:anchorKey) idiom, so adding/removing a building never re-dresses another.
 *
 * PURITY: {+,-,*,/} + Math.round/min/max + integer hashing; 0 transcendental sites; deterministic.
 *
 * @typedef {Readonly<Record<string, number>>} ConditionVector
 * @typedef {readonly [number, number, number]} RGB
 * @typedef {{ seedId: string, anchorKey: string, materialTier: string, traceryFamily: string, ornamentOrder: string, statuaryMode: string, weathering: string, damageState: string, reliefMotif: number, variant: number }} SettlementDress
 * @typedef {{ archetype: string, ornamentDensity: string, traceryFamily: string, materialTier: string, weathering: string, damageState: string, statuaryMode: string, statuaryVocab: ReadonlyArray<string>, ornamentOrder: string, civicDress: string|null, reliefMotif: number }} BuildingDress
 */

import { MATERIAL_ROLES } from './grammarIR.js';
import { materialMeanAlbedo } from './materials/materials.js';
import { SHAPE_FAMILIES, assertConditionVector, neutralConditionVector } from './params.js';
import {
  ARCHETYPE_PROFILES, STATUARY_VOCAB, MATERIAL_TIERS,
  driftOrnamentDensity, driftTraceryFamily, driftMaterialTier, driftDamageState,
  driftWeathering, driftStatuaryMode, driftOrnamentOrder, driftCivicDress, driftReliefMotif,
} from './conditionGrammar.js';

/** the tier token -> material id (timber/stone/marble -> registry material). @type {Readonly<Record<string, string>>} */
const TIER_MATERIAL = Object.freeze({ timber: 'timberFrame', stone: 'stoneAshlar', marble: 'marble' });
/** the fixed leaded-glass tint (a role, not a material -- matches skins.GLASS_ALBEDO / plate glassLead). @type {RGB} */
const GLASS_ALBEDO = Object.freeze([0.12, 0.15, 0.22]);
/** roles that read as the building's structural material (the rest are fixed or heavier-weathered). @type {ReadonlySet<string>} */
const STRUCTURAL_ROLES = Object.freeze(new Set(['ashlar', 'dressedStone', 'voussoir', 'tracery', 'mullion', 'buttressStone', 'pinnacleStone', 'corbel', 'relief']));

/** the profile for an archetype, fail-closed (a family with no profile reds -- totality). @param {string} archetype @returns {typeof ARCHETYPE_PROFILES[keyof typeof ARCHETYPE_PROFILES]} */
export function archetypeProfile(archetype) {
  const p = ARCHETYPE_PROFILES[archetype];
  if (!p) throw new Error(`arch/settlementDress: archetype "${archetype}" has no drift profile (register it in ARCHETYPE_PROFILES)`);
  return p;
}

/**
 * Resolve the ONE coherent settlement dress from (seedId, anchorKey, settlement conditionVector). This
 * is the shared style every building in the town wears; per-building variation is applied by
 * driftBuildingDress. The settlement lean uses the SACRED archetype's ceiling for the statuary/ornament
 * (the grandest institution sets the town's stylistic key), the neutral-null condition falling back to
 * the dormancy default. @param {string} seedId @param {string} anchorKey @param {ConditionVector} [conditionVector]
 * @returns {SettlementDress}
 */
export function resolveSettlementDress(seedId, anchorKey, conditionVector) {
  const cv = conditionVector ? assertConditionVector(conditionVector) : neutralConditionVector();
  const key = `${seedId}:${anchorKey}`;
  const sacred = archetypeProfile('sacred');
  return Object.freeze({
    seedId, anchorKey,
    materialTier: driftMaterialTier(cv, 0),                 // the town's baseline material availability
    traceryFamily: driftTraceryFamily(cv),                 // one tracery family for the town
    ornamentOrder: driftOrnamentOrder(cv),                 // lawful/chaotic reads across the town
    statuaryMode: driftStatuaryMode(cv, sacred.statuary),  // the town's iconographic lean
    weathering: driftWeathering(cv, sacred.baseWeathering),
    damageState: driftDamageState(cv, 0.6),                // the town-wide war read (per-building scales it)
    reliefMotif: driftReliefMotif(cv),
    variant: hashUnit(key),
  });
}

/**
 * Specialize the shared settlement dress for ONE building: its functional archetype + its LOCAL
 * condition (which may differ from the settlement's -- a corrupt ward). Ornament density, weathering,
 * damage, statuary and civic dress vary per building; tracery family, ornament order, and relief motif
 * are INHERITED from the settlement dress (the coherence spine -- these never clash between neighbours).
 * Material tier is the max of the town baseline and the building's own read (a building never reads
 * cheaper than its town, but a rich institution may out-dress it). @param {SettlementDress} dress
 * @param {string} archetype @param {ConditionVector} [buildingConditionVector] @returns {BuildingDress}
 */
export function driftBuildingDress(dress, archetype, buildingConditionVector) {
  const cv = buildingConditionVector ? assertConditionVector(buildingConditionVector) : neutralConditionVector();
  const p = archetypeProfile(archetype);
  const statuaryMode = driftStatuaryMode(cv, p.statuary);
  const townTierIdx = MATERIAL_TIERS.indexOf(dress.materialTier);
  const bldTier = driftMaterialTier(cv, p.materialFloor);
  const bldTierIdx = MATERIAL_TIERS.indexOf(bldTier);
  const materialTier = MATERIAL_TIERS[Math.max(townTierIdx, bldTierIdx)];
  return Object.freeze({
    archetype,
    ornamentDensity: driftOrnamentDensity(cv, p.ornamentGain),
    traceryFamily: dress.traceryFamily,                    // inherited (coherence)
    materialTier,
    weathering: driftWeathering(cv, p.baseWeathering),
    damageState: driftDamageState(cv, p.damageGain),
    statuaryMode,
    statuaryVocab: STATUARY_VOCAB[statuaryMode],
    ornamentOrder: dress.ornamentOrder,                    // inherited (coherence)
    civicDress: p.legitimacyDress ? driftCivicDress(cv) : null,
    reliefMotif: dress.reliefMotif,                        // inherited (coherence)
  });
}

/**
 * Lower a building dress into a role -> mean-linear-RGB map the CPU plate reads (a drop-in for
 * plate.ROLE_ALBEDO, exactly like skins.skinRoleAlbedo, so ANY mesh renders under the drift without
 * touching geometry). Structural roles take the dress material tier at the dress weathering; damaged
 * states weather the ground/buttress masses harder; glazing is a fixed leaded tint; the roof reads lead.
 * @param {BuildingDress} dress @returns {Readonly<Record<string, RGB>>}
 */
export function dressRoleAlbedo(dress) {
  const material = TIER_MATERIAL[dress.materialTier] || 'stoneAshlar';
  const heavy = dress.damageState === 'broken' || dress.damageState === 'patched';
  /** @type {Record<string, RGB>} */ const out = {};
  for (const role of MATERIAL_ROLES) {
    if (role === 'glassLead') { out[role] = GLASS_ALBEDO; continue; }
    if (role === 'roofLead') { out[role] = materialMeanAlbedo('corrugatedIndustrial', heavy ? 'ruin' : 'stain'); continue; }
    if (role === 'groundStone') { out[role] = materialMeanAlbedo(material, 'moss'); continue; }
    if (STRUCTURAL_ROLES.has(role)) {
      // buttress/ground masses take the harder weathering under damage; the rest take the dress weathering
      const w = heavy && (role === 'buttressStone' || role === 'relief') ? 'ruin' : dress.weathering;
      out[role] = materialMeanAlbedo(material, w);
      continue;
    }
    out[role] = materialMeanAlbedo(material, dress.weathering);
  }
  return Object.freeze(out);
}

/** the finite set of building archetypes drift covers (the 8 SHAPE_FAMILIES). @type {ReadonlyArray<string>} */
export const DRIFT_ARCHETYPES = SHAPE_FAMILIES;

/** a pure 0..1 hash of a string (FNV-1a; the massing.js hashUnit idiom, parity-shared). @param {string} str @returns {number} */
function hashUnit(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 16777619) ^ str.charCodeAt(i)) >>> 0;
  return (h >>> 0) / 4294967296;
}
