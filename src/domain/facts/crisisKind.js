/**
 * domain/facts/crisisKind.js — THE CRISIS-KIND HOME (CENSUS-1 wave 0, fact 1; the design's
 * `docs/DESIGN_POOL_CENSUS.md` §1 row "crisis kind and state", Appendix A competing reading 10).
 *
 * ONE answer to "which crises is this place under?", over the record's carriers:
 *
 *   (a) THE STRESS CONTAINER — `stressors` → `stress` → `stresses`, the first array wins, a bare
 *       object is one entry (`canonicalAccessors.js :: canonStressors`, unchanged). At birth
 *       `stressors` and `stress` are the same object (`assembleSettlement.js`), and every later
 *       writer moves both homes (`crisisLifecycle.js`, the edit layer's `rekeyUserEdit`), so the
 *       order is the alias order and never a choice between two truths.
 *   (b) THE PULSE STRESSORS — world-level (`worldState.stressors`, one entry per roaming
 *       stressor, its live footprint `affectedSettlementIds`). A lone record does not carry
 *       them; a caller that holds the world passes them (`options.worldStressors` +
 *       `options.settlementId`), and their pulse types fold back to the record's kinds through
 *       the inverse of `stressorPicker.js :: GEN_TO_PULSE_TYPE`.
 *   (c) THE ACTIVE CONDITIONS — `activeConditions[].archetype`. Reported (`conditionKinds`) and
 *       NOT folded into `kinds`: the archetypes are consequences and regional pressures (a
 *       `rebellion` condition follows a slave revolt, `siege_lifted` is the end of one), so
 *       folding them would make `crisis: insurgency` true of a slave revolt. Only the
 *       archetypes that MIRROR one kind name it (`CONDITION_KIND`).
 *
 * THE KIND VOCABULARY is the stress record's own keys (`data/stressTypes.js ::
 * STRESS_TYPE_MAP`). A type outside it (a DM's custom crisis) stays in `types` — it is a crisis,
 * so the `any` family sees it — and names no kind.
 *
 * THE FAMILIES are F12's five (the chair's ruling 2, CENSUS-1), moved here from
 * `crisis/crisisFacts.js`, which now re-exports them: a line may declare a family as a GROUP
 * (`crisis: threat`), and the kernel's five crisis dimensions are answered by this reader.
 *
 * SIEGE, ONCE. "Is the place under siege" is `crisisOf(s).has('under_siege')`: the record's
 * kind, or a pulse `siege` stressor when the caller passes the world. `foodSecurity.hasSiege` is
 * NOT a second reading of it: it records that the FOOD RECORD was computed under a siege (the
 * cut harvest is in its numbers), and stays the food record's own fact. The world war layer's
 * `liveSieges(worldState)` is the war-state home's (fact 10).
 *
 * Pure: no randomness, no clock, no write.
 */
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';
import { GEN_TO_PULSE_TYPE } from '../stressorPicker.js';
import { canonStressors } from '../canonicalAccessors.js';

/** The record's crisis kinds, in the stress map's order. @type {ReadonlyArray<string>} */
export const CRISIS_KINDS = Object.freeze(Object.keys(STRESS_TYPE_MAP));

/** pulse type → record kind (the inverse of GEN_TO_PULSE_TYPE). @type {Readonly<Record<string, string>>} */
const KIND_OF_PULSE_TYPE = Object.freeze(Object.fromEntries(
  Object.entries(GEN_TO_PULSE_TYPE).map(([kind, pulse]) => [pulse, kind]),
));

/**
 * The condition archetypes that MIRROR one crisis kind (the rest are consequences or regional
 * pressures and name none). @type {Readonly<Record<string, string>>}
 */
export const CONDITION_KIND = Object.freeze({
  plague: 'plague_onset',
  famine: 'famine',
});

/**
 * The crisis families: dimension → its two kernel words and the kinds that make it active
 * ('*' = any crisis). F12's table, verbatim.
 * @type {Readonly<Record<string, Readonly<{ on: string, off: string, types: ReadonlyArray<string> }>>>}
 */
export const CRISIS_FAMILIES = Object.freeze({
  // an armed threat at or inside the place: the calm it denies is "nothing presses", "never
  // needed to think about what is outside it", the relaxed perimeter
  threat: Object.freeze({ on: 'threat', off: 'no threat', types: Object.freeze(['under_siege', 'occupied', 'monster_pressure']) }),
  // the food has failed or is cut off: "the town eats", "fed and only just comfortably"; and, beyond
  // these kinds, any crisis while the food record reads a deficit (`familyActiveIn`)
  hunger: Object.freeze({ on: 'hunger', off: 'no hunger', types: Object.freeze(['famine', 'under_siege']) }),
  // the seat is open or nobody holds authority: "the succession question is not a live one"
  succession: Object.freeze({ on: 'succession open', off: 'succession settled', types: Object.freeze(['succession_void', 'politically_fractured']) }),
  // armed conflict in the streets: "very little street violence"
  unrest: Object.freeze({ on: 'unrest', off: 'no unrest', types: Object.freeze(['insurgency', 'slave_revolt', 'wartime']) }),
  // ANY active crisis: "nothing about the town's condition asks to be remarked on"
  crisis: Object.freeze({ on: 'crisis', off: 'no crisis', types: Object.freeze(['*']) }),
});

/**
 * The record kind a type string names: itself when it is a kind, its record kind when it is a
 * pulse type, else null.
 * @param {unknown} type
 * @returns {string|null}
 */
export function crisisKindOf(type) {
  if (typeof type !== 'string' || type === '') return null;
  if (Object.prototype.hasOwnProperty.call(STRESS_TYPE_MAP, type)) return type;
  return Object.prototype.hasOwnProperty.call(KIND_OF_PULSE_TYPE, type) ? KIND_OF_PULSE_TYPE[type] : null;
}

/**
 * The stress container as stored: carrier (a), every slot kept, so a slot's index is its edit
 * address (`stress[i]`, mirrored at `stressors[i]`).
 * @param {object | null | undefined} settlement
 * @returns {Array<unknown>}
 */
export function crisisContainer(settlement) {
  return canonStressors(/** @type {Parameters<typeof canonStressors>[0]} */ (settlement));
}

/**
 * The stress container's entries: carrier (a), objects only.
 * @param {object | null | undefined} settlement
 * @returns {Array<Record<string, unknown>>}
 */
export function crisisEntries(settlement) {
  return /** @type {Array<Record<string, unknown>>} */ (crisisContainer(settlement)
    .filter((entry) => !!entry && typeof entry === 'object'));
}

/**
 * The active crisis TYPE strings of the record, in the container's order, without repeats
 * (carrier (a); a custom type is kept). This is F12's `activeCrisisTypes`, now over the alias
 * order rather than `stress` alone (the same object at birth and under every writer).
 * @param {object | null | undefined} settlement
 * @returns {string[]}
 */
export function activeCrisisTypes(settlement) {
  /** @type {string[]} */
  const out = [];
  for (const entry of crisisEntries(settlement)) {
    const type = entry.type;
    if (typeof type === 'string' && type !== '' && !out.includes(type)) out.push(type);
  }
  return out;
}

/**
 * The active types of one family ('*' admits any type). A pulse-typed entry counts as its kind.
 * @param {string} family a key of CRISIS_FAMILIES
 * @param {ReadonlyArray<string>} types the active crisis types
 * @returns {string[]}
 */
export function familyTypesActive(family, types) {
  const def = CRISIS_FAMILIES[family];
  if (!def) return [];
  return def.types.includes('*') ? [...types] : types.filter((t) => def.types.includes(crisisKindOf(t) ?? t));
}

/**
 * The food record's bands that read a deficit (`data/bandLadders.js :: FOOD_SECURITY_BANDS`:
 * 'Deficit — Active Famine', 'Deficit'). The rung-2 window's ruling (d175715): HUNGER reads the
 * food record's deficit band, not the crisis kind alone, so a place under ANY active crisis whose
 * record stands on one of these is hungry (a wartime place with a food deficit), and the same
 * crisis with the record secure is not (soak1k-5: wartime, 15 months in store).
 */
const HUNGER_BANDS = Object.freeze(['famine', 'deficit']);

/**
 * The active types under which a family holds for THIS place: the family's own kinds, and for
 * hunger every active crisis when the food record reads a deficit. A crisis-free place holds
 * no family.
 * @param {object | null | undefined} settlement
 * @param {string} family a key of CRISIS_FAMILIES
 * @param {ReadonlyArray<string>} [types] the active crisis types (read from the record when absent)
 * @returns {string[]}
 */
export function familyActiveIn(settlement, family, types = activeCrisisTypes(settlement)) {
  const own = familyTypesActive(family, types);
  if (family !== 'hunger' || own.length > 0 || types.length === 0) return own;
  const band = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { band?: unknown } } } } | null | undefined} */ (settlement)
    ?.economicState?.foodSecurity?.foodRecord?.band;
  return typeof band === 'string' && HUNGER_BANDS.includes(band) ? [...types] : [];
}

/**
 * @typedef {object} CrisisFacts
 * @property {string[]} types every active type string (record, then the world's pulse types for this place)
 * @property {string[]} kinds the record kinds those types name, without repeats
 * @property {string[]} conditionKinds the kinds the active conditions mirror (reported, not folded)
 * @property {string[]} families the F12 families on (`crisis` whenever any type is)
 * @property {boolean} active any crisis at all
 * @property {(kind: string) => boolean} has is this kind (or a family of that name) on
 */

/**
 * THE ONE READER. `options.worldStressors` + `options.settlementId` fold carrier (b) in.
 * @param {object | null | undefined} settlement
 * @param {{ worldStressors?: ReadonlyArray<unknown> | null, settlementId?: unknown }} [options]
 * @returns {Readonly<CrisisFacts>}
 */
export function crisisOf(settlement, options = {}) {
  const types = activeCrisisTypes(settlement);
  const id = options.settlementId == null ? null : String(options.settlementId);
  if (id !== null && Array.isArray(options.worldStressors)) {
    for (const st of options.worldStressors) {
      const row = /** @type {{ type?: unknown, affectedSettlementIds?: unknown } | null} */ (st);
      const ids = Array.isArray(row?.affectedSettlementIds) ? row.affectedSettlementIds.map(String) : [];
      if (typeof row?.type === 'string' && ids.includes(id) && !types.includes(row.type)) types.push(row.type);
    }
  }
  /** @type {string[]} */
  const kinds = [];
  for (const t of types) {
    const k = crisisKindOf(t);
    if (k && !kinds.includes(k)) kinds.push(k);
  }
  /** @type {string[]} */
  const conditionKinds = [];
  const conditions = /** @type {{ activeConditions?: unknown } | null | undefined} */ (settlement)?.activeConditions;
  for (const c of Array.isArray(conditions) ? conditions : []) {
    const archetype = /** @type {{ archetype?: unknown }} */ (c)?.archetype;
    const k = typeof archetype === 'string' ? CONDITION_KIND[archetype] : undefined;
    if (k && !conditionKinds.includes(k)) conditionKinds.push(k);
  }
  const families = Object.keys(CRISIS_FAMILIES).filter((f) => familyActiveIn(settlement, f, types).length > 0);
  return Object.freeze({
    types, kinds, conditionKinds, families, active: types.length > 0,
    has: (/** @type {string} */ kind) => kinds.includes(kind) || families.includes(kind),
  });
}

/**
 * The kernel's crisis dimension words for this place, one per family.
 * @param {object | null | undefined} settlement
 * @returns {Record<string, string>}
 */
export function crisisDimensionsOf(settlement) {
  const types = activeCrisisTypes(settlement);
  /** @type {Record<string, string>} */
  const out = {};
  for (const [family, def] of Object.entries(CRISIS_FAMILIES)) out[family] = familyActiveIn(settlement, family, types).length ? def.on : def.off;
  return out;
}
