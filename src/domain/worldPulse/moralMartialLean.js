/**
 * domain/worldPulse/moralMartialLean.js — the W-F8 moral/martial LEAN-TABLE leaf.
 *
 * Two small, governed, content-reviewable tables + their readers, homed in one
 * dependency-light leaf (its only import is the zero-dependency custom-content
 * authority boundary) so every W-F8 consumer — the institution
 * lifecycle (moral viability pressure + martial emergence), the endogenous conduct
 * plane (religionLegitimacy), the development value-ranking (tierResourceDynamics),
 * and the readiness module — reads ONE mapping without an import cycle.
 *
 * The owner's brief (PHASE4_FAITH_DELTA.md, 2026-07-11): morally-loaded institutions
 * carry a PLANE LEAN — MORAL axis = tolerance of CRUELTY, LAW axis = tolerance of
 * DISORDER — projected exactly like the clergy-trait plane. This leaf codes ONLY the
 * institutions that ALREADY exist in the catalog and are CLEARLY loaded (slave
 * market, gambling house, fighting pit/arena, red-light, debtor's prison, workhouse
 * on the cruelty pole; almshouse, hospice, sanctuary on the good pole). The FULL
 * catalog coding is Phase 5's — this table is the seed Phase 5 extends.
 *
 * Leans are SIGNED, −1..+1, 0 = neutral/absent:
 *   • cruelty  +1 embodies cruelty (evil)  ·  −1 embodies mercy (good)
 *   • disorder +1 embodies disorder (chaos) · −1 embodies order (law)
 * so the owner's derivation cases fall out of the geometry, never special-cased:
 *   CG (low evil / high chaos) abolishes the slave market (+cruelty) but tolerates
 *   the gambling house (+disorder, ~0 cruelty); LE (+evil / −chaos) runs the market
 *   and shutters the rowdy pit (+disorder); LG (−evil / −chaos) tolerates neither and
 *   raises orderly charity (−cruelty −disorder); CE (+evil / +chaos) keeps what bleeds.
 *
 * PURE: no rng, no wall-clock, no mutation. A settlement with none of these
 * institutions reads {0,0} ⇒ the endogenous-conduct term is 0 ⇒ byte-identical.
 *
 * PHASE 5 SPLIT (2026-07-11). This leaf stays CANONICAL for the leans generation
 * reads — it is frozen here and is NOT extended to new catalog
 * institutions (that would flip settlements the golden manifest already pins from
 * {0,0} to a live lean). Phase 5's fuller per-institution coding lives in the
 * generation-inert side-car domain/display/institutionVocabulary.js (INSTITUTION_MORAL_LEAN
 * is a SUPERSET; INSTITUTION_MARTIAL_ROLE carries role tags while the lawful/
 * chaotic FORM stays here). tests/data/institutionVocabulary.test.js is the DRIFT
 * PIN: it asserts the side-car agrees with this leaf on every seed-overlap value.
 * Keep this leaf free of simulation-layer imports; the pin lives in the test,
 * never a cross-import.
 */

import {
  isMaterializedCustomContent,
} from '../content/customContentSemanticAuthority.js';

/** @typedef {{ cruelty: number, disorder: number }} PlaneLean signed −1..+1 on each axis */
/** @typedef {{ name?: string, id?: string|number, category?: string, priorityCategory?: string, tags?: string[], status?: unknown, required?: boolean, requiredForTier?: boolean, _worldPulseInactive?: boolean }} InstLike a loosely-typed institution record */
/** @typedef {{ institutions?: InstLike[] }} SettlementLike a settlement carrying institutions */

/**
 * MORALLY-LOADED institution leans. Ordered specific→general; the FIRST matching
 * pattern wins (colosseum before the generic pit, slave-market before market). Only
 * the clearly-loaded catalog entries are coded; Phase 5 extends with the full sweep.
 * @type {ReadonlyArray<readonly [RegExp, PlaneLean]>}
 */
export const MORAL_INSTITUTION_LEANS = Object.freeze(/** @type {ReadonlyArray<readonly [RegExp, PlaneLean]>} */ ([
  // ── cruelty pole ─────────────────────────────────────────────────────────────
  [/slave\s*market|slave\s*(pen|block|district|auction)|slaver/i, { cruelty: 0.9, disorder: -0.4 }], // ordered exploitation ⇒ lawful-evil
  [/debtor'?s?\s*prison|debt\s*bond|indenture/i, { cruelty: 0.6, disorder: -0.6 }],                   // harsh + ordered
  [/workhouse|poorhouse|labour\s*camp|labor\s*camp/i, { cruelty: 0.5, disorder: -0.5 }],              // harsh ordered labour
  [/colosseum|arena|fighting\s*pit|blood\s*pit|gladiator/i, { cruelty: 0.55, disorder: 0.85 }],       // bloodsport is rowdy spectacle first ⇒ chaotic-evil, disorder-led
  [/red\s*light|brothel\s*district|pleasure\s*district/i, { cruelty: 0.2, disorder: 0.6 }],           // vice + disorder
  [/gambling\s*(den|hall|house|district|arena)|casino|betting\s*(den|house)/i, { cruelty: 0.1, disorder: 0.7 }], // vice ⇒ chaotic, mild cruelty
  // ── good (mercy) pole ────────────────────────────────────────────────────────
  [/almshouse|poor\s*relief|charity\s*house/i, { cruelty: -0.7, disorder: -0.2 }],                    // orderly charity ⇒ LG raises it
  [/hospice|infirmary\s*for\s*the\s*poor|leper\s*house|lazar/i, { cruelty: -0.8, disorder: -0.1 }],
  [/sanctuary|refuge\s*house|asylum\s*for\s*the/i, { cruelty: -0.6, disorder: -0.1 }],
]));

/**
 * MARTIAL institution leans. Martial institutions do not carry a moral (cruelty)
 * charge — a garrison is neither cruel nor kind — but LAW textures their FORM: a
 * standing garrison / armoury is ORDERED (−disorder, lawful); a warrior-band /
 * war-camp / raider hall is a chaotic warrior culture (+disorder). `martial: 1`
 * tags the row so the readiness lifecycle can find martial institutions; `disorder`
 * is the lawful/chaotic flavour the catalog supports. Phase 5 extends the coding.
 * @type {ReadonlyArray<readonly [RegExp, { disorder: number }]>}
 */
export const MARTIAL_INSTITUTION_LEANS = Object.freeze(/** @type {ReadonlyArray<readonly [RegExp, { disorder: number }]>} */ ([
  [/armou?ry|arsenal|magazine\b/i, { disorder: -0.6 }],                                 // standing stores ⇒ lawful
  [/garrison|barrack|standing\s*(army|watch)|professional\s*(watch|guard)/i, { disorder: -0.5 }], // standing institution ⇒ lawful
  [/town\s*watch|city\s*watch|militia|citizen\s*militia/i, { disorder: -0.2 }],         // civic order ⇒ mild lawful
  [/war\s*(band|camp|hall)|raider|mercenary\s*company|free\s*company|warrior\s*lodge/i, { disorder: 0.6 }], // warrior culture ⇒ chaotic
]));

/**
 * WAR-SUPPLY value chains — the resource/chain patterns the martial-readiness tilt
 * lifts in the development value-ranking (tierResourceDynamics): war-supporting
 * chains score higher in militarized towns. A small NAMED table (owner addendum
 * "The war-supply web") seeded with the obvious entries the existing supplyChainData
 * supports — ore/smelting/weapons, leather, horses, timber. Phase 5 extends it with
 * the full catalog coding. Matched against the resource key the ranking iterates.
 * @type {RegExp}
 */
export const WAR_SUPPLY_CHAINS = Object.freeze(
  /iron|\bore\b|steel|smelt|coal|weapon|armou?r|bowyer|fletch|blacksmith|forge|leather|hide|tann|horse|mount|cavalry|steed|timber|lumber|\bwood\b|\bstone\b|quarr|saltpeter|sulfur|sulphur/i,
);

/** @param {InstLike|null|undefined} x @returns {string} */
const nameKindTags = (x) => {
  const inst = x || {};
  const tags = Array.isArray(inst.tags) ? inst.tags.join(' ') : '';
  return `${String(inst.name || '')} ${String(inst.category || '')} ${String(inst.priorityCategory || '')} ${tags}`;
};

/** True iff the institution is currently STANDING (active/present) — a closed remnant
 *  exerts no conduct charge. Mirrors institutionLifecycle's active read. @param {InstLike|null|undefined} inst @returns {boolean} */
export function isStandingInstitution(inst) {
  if (!inst) return false;
  if (inst._worldPulseInactive) return false;
  const s = String(inst.status || 'active').toLowerCase();
  return s !== 'removed' && s !== 'destroyed' && s !== 'remnant' && s !== 'ruined';
}

/**
 * The signed plane lean of a single institution, or null when it is not morally
 * coded. Matches name/category/tags against MORAL_INSTITUTION_LEANS (first wins).
 * @param {InstLike|null|undefined} inst @returns {PlaneLean | null}
 */
export function institutionMoralLean(inst) {
  if (!inst) return null;
  // Current custom names, categories, and tags are presentation fields.
  // Native and unstamped legacy rows retain the historical keyword fallback.
  if (isMaterializedCustomContent(inst)) return null;
  const hay = nameKindTags(inst);
  for (const [re, lean] of MORAL_INSTITUTION_LEANS) if (re.test(hay)) return lean;
  return null;
}

/**
 * The martial lean of a single institution ({ disorder }), or null when it is not a
 * martial institution. @param {InstLike|null|undefined} inst @returns {{ disorder: number } | null}
 */
export function institutionMartialLean(inst) {
  if (!inst) return null;
  if (isMaterializedCustomContent(inst)) return null;
  const hay = nameKindTags(inst);
  for (const [re, lean] of MARTIAL_INSTITUTION_LEANS) if (re.test(hay)) return lean;
  return null;
}

/**
 * The settlement's ENDOGENOUS moral-conduct lean — the mean signed (cruelty,
 * disorder) over its STANDING morally-coded institutions. This is the "standing
 * building = drift made brick" signal: a good-patroned town that KEEPS its slave
 * market reads a cruel conduct plane, so the reciprocal fit loop registers the
 * drift. EXACTLY {0,0} when the settlement has no morally-coded institution ⇒ the
 * endogenous-conduct term is 0 ⇒ byte-identical for every legacy fixture. Pure.
 * @param {SettlementLike|null|undefined} settlement @returns {PlaneLean}
 */
export function settlementMoralConductLean(settlement) {
  const insts = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  let cruelty = 0; let disorder = 0; let n = 0;
  for (const inst of insts) {
    if (!isStandingInstitution(inst)) continue;
    const lean = institutionMoralLean(inst);
    if (!lean) continue;
    cruelty += lean.cruelty; disorder += lean.disorder; n += 1;
  }
  if (n === 0) return { cruelty: 0, disorder: 0 };
  return { cruelty: cruelty / n, disorder: disorder / n };
}

/** True iff the resource/chain key is a war-supply chain (the readiness value tilt gate).
 *  @param {string|null|undefined} resource @returns {boolean} */
export function isWarSupplyResource(resource) {
  return WAR_SUPPLY_CHAINS.test(String(resource || ''));
}
