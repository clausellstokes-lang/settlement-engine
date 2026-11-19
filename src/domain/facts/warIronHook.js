/**
 * domain/facts/warIronHook.js — THE WAR'S HOLD ON THE IRON, ONE PREDICATE (BIRTH-3, the chair's ruling BR9 of 2026-11-17,
 * vetoable: A MARK THE PLAYERS SEE IS NEVER READ OFF THE DM'S HOOKS). The economy writes the war's iron hook ("War has taken
 * the iron: …", `generators/economy/foodBalance.js`) where the town must import a metal, its imports hold iron or metal, and
 * a war is in force; the shared page withholds the hooks (`display/publicSafe.js`), so the two readers that marked the iron
 * houses off the hook (`warReach.js :: warTakesOf`, `houseInputAtHand.js :: warIronHookOutsideWar`) told the shared page
 * another story. The hook's writer and both readers now ask THIS predicate, over fields every view keeps (the town's
 * dependency rows, its imports, the war's state). Import-free, pure (EG1).
 *
 * @enforced-by tests/domain/supplyStoryLaw.test.js
 */

/** The goods an import of iron names. */
export const IRON_GOODS = /\b(?:iron|metal)/i;

/**
 * The hook stands for this resource the town must import: it is a metal, and the imports hold iron or metal.
 * @param {unknown} resource the resource the town must import ("metals") @param {(pattern: RegExp) => boolean} held
 * whether the imports hold a good the pattern names @returns {boolean}
 */
export const ironHookStands = (resource, held) => /metal|iron/.test(String(resource ?? '').toLowerCase()) && held(IRON_GOODS);

/** The stress types of an occupation, in the generator's words and the world pulse's (`stressorPicker.js :: GEN_TO_PULSE_TYPE`). */
export const OCCUPATION_TYPES = Object.freeze(['occupied', 'occupation']);

/**
 * BAR8 MARKS-2 item 4 (RULING BR16 of the sixth chair, 2026-11-17; vetoable by the owner): THE WAR'S IRON IS TAKEN ONLY WHERE
 * A WAR IS IN FORCE ON THE PAGE. `facts/warState.js` reads an occupied town "at war"; for the iron it is peace where the
 * occupation stands alone (no `wartime` among the town's stress types): the occupied town printed "Short of iron." on every
 * iron house, its income row's mark and the forges' quiet scene beside its own import of iron (C38200, C38039). A siege keeps
 * its own reading ("front"). Handed no stress types, the state is read as it is (the hook's writer hands none).
 * @param {unknown} warState @param {ReadonlyArray<unknown>} [stressTypes] the town's stress types
 * @returns {unknown} the war's state as the iron reads it
 */
export function ironWarState(warState, stressTypes) {
  if (warState !== 'at war' || !Array.isArray(stressTypes)) return warState;
  const types = stressTypes.map((t) => String(t ?? ''));
  return types.some((t) => OCCUPATION_TYPES.includes(t)) && !types.includes('wartime') ? 'peace' : warState;
}

/**
 * The hook speaks of the war where the war's state is not peace (`facts/warState.js :: WAR_STATES`); handed the town's stress
 * types, an occupation alone is peace (BR16, `ironWarState`). @param {unknown} warState @param {ReadonlyArray<unknown>} [stressTypes]
 */
export const warIronState = (warState, stressTypes) => ironWarState(warState, stressTypes) !== 'peace';

/**
 * THE PREDICATE OVER THE KEPT RECORD: a dependency row "Imports <a metal>" (the economy's own row, written beside the hook),
 * the imports holding iron or metal, and a war's state other than peace (an occupation alone is peace, handed the stress types).
 * @param {ReadonlyArray<unknown>} dependencies `economicViability.dependencies` @param {ReadonlyArray<unknown>} imports
 * `economicState.primaryImports` @param {unknown} warState @param {ReadonlyArray<unknown>} [stressTypes] @returns {boolean}
 */
export function warHoldsIron(dependencies, imports, warState, stressTypes) {
  if (!warIronState(warState, stressTypes)) return false;
  /** @param {RegExp} pattern */
  const held = (pattern) => imports.some((x) => typeof x === 'string' && pattern.test(x));
  return dependencies.some((d) => {
    const m = /^Imports (.+)$/.exec(String(/** @type {{ title?: unknown } | null} */ (d)?.title ?? ''));
    return !!m && ironHookStands(m[1], held);
  });
}
