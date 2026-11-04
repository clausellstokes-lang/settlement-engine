/**
 * domain/crisis/crisisFacts.js — WHICH CRISES ARE ACTIVE, and which calm claims they deny
 * (F12 CRISIS-BLIND PROSE, rung 2, 2026-11-04).
 *
 * The one reader of the crisis record for the two consumers that must agree on it: the
 * page check `coh:crisis-blind-prose` (`coherence/crisisBlindFindings.js`), which flags a
 * rendered sentence that asserts calm under a crisis that denies it, and the state-prose
 * desks, which answer the kernel's crisis dimensions at their entries (`crisisAnswered`) so a
 * calm variant is never drawn under the crisis it denies.
 *
 * THE RECORD. An active crisis is an entry of the settlement's stress container
 * (`settlement.stress`, one entry or a list; `stressGenerator.js :: buildStressEntry`), keyed
 * by its `type` (`data/stressTypes.js :: STRESS_TYPE_MAP`). Resolution removes the entry
 * (`crisisLifecycle.js :: crisisResolve`), so presence is activity.
 *
 * THE FAMILIES. A calm sentence denies a KIND of trouble, not one crisis type: "Nothing
 * presses the town" is false under a siege, an occupation and a beast-and-raider threat
 * alike. Each family is one state-prose dimension (`stateProseKernel.js ::
 * STATE_MARK_DIMENSIONS`) with two words: the crisis word and its `no …` twin. A variant
 * that asserts the calm carries the `no …` word and speaks only where no crisis of the family
 * is active; a crisis-safe variant carries the crisis word and speaks only where one is. The
 * words are spelled here and in the kernel (a display leaf imports nothing);
 * `tests/domain/crisisBlindDossierProse.test.js` holds the two equal.
 *
 * Pure: no randomness, no clock.
 */

/**
 * The crisis families: dimension → its two words and the stress types that make it active.
 * @type {Readonly<Record<string, Readonly<{ on: string, off: string, types: ReadonlyArray<string> }>>>}
 */
export const CRISIS_FAMILIES = Object.freeze({
  // an armed threat at or inside the place: the calm it denies is "nothing presses", "never
  // needed to think about what is outside it", the relaxed perimeter
  threat: Object.freeze({ on: 'threat', off: 'no threat', types: Object.freeze(['under_siege', 'occupied', 'monster_pressure']) }),
  // the food has failed or is cut off: "the town eats", "fed and only just comfortably"
  hunger: Object.freeze({ on: 'hunger', off: 'no hunger', types: Object.freeze(['famine', 'under_siege']) }),
  // the seat is open or nobody holds authority: "the succession question is not a live one"
  succession: Object.freeze({ on: 'succession open', off: 'succession settled', types: Object.freeze(['succession_void', 'politically_fractured']) }),
  // armed conflict in the streets: "very little street violence"
  unrest: Object.freeze({ on: 'unrest', off: 'no unrest', types: Object.freeze(['insurgency', 'slave_revolt', 'wartime']) }),
  // ANY active crisis: "nothing about the town's condition asks to be remarked on"
  crisis: Object.freeze({ on: 'crisis', off: 'no crisis', types: Object.freeze(['*']) }),
});

/**
 * The active crisis types of a settlement, in the container's order, without repeats.
 * @param {object | null | undefined} settlement
 * @returns {string[]}
 */
export function activeCrisisTypes(settlement) {
  const raw = /** @type {{ stress?: unknown } | null | undefined} */ (settlement)?.stress;
  const entries = Array.isArray(raw) ? raw : raw ? [raw] : [];
  /** @type {string[]} */
  const out = [];
  for (const entry of entries) {
    const type = /** @type {{ type?: unknown } | null | undefined} */ (entry)?.type;
    if (typeof type === 'string' && type !== '' && !out.includes(type)) out.push(type);
  }
  return out;
}

/**
 * The active types of one family ('*' admits any type).
 * @param {string} family a key of CRISIS_FAMILIES
 * @param {ReadonlyArray<string>} types the active crisis types
 * @returns {string[]}
 */
export function familyTypesActive(family, types) {
  const def = CRISIS_FAMILIES[family];
  if (!def) return [];
  return def.types.includes('*') ? [...types] : types.filter((t) => def.types.includes(t));
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
  for (const [family, def] of Object.entries(CRISIS_FAMILIES)) out[family] = familyTypesActive(family, types).length ? def.on : def.off;
  return out;
}

/**
 * A desk's options with every crisis dimension answered for this place. Every other dimension
 * the caller already answered (the `walls` answer included) is kept.
 * @template {object} T
 * @param {object | null | undefined} settlement
 * @param {T} options
 * @returns {T & { dimensions: Record<string, string> }}
 */
export function crisisAnswered(settlement, options) {
  const given = /** @type {{ dimensions?: Record<string, string> } | null | undefined} */ (options)?.dimensions;
  return Object.assign({}, options, { dimensions: { ...(given || {}), ...crisisDimensionsOf(settlement) } });
}
