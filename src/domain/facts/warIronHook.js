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

/** The hook speaks of the war where the war's state is not peace (`facts/warState.js :: WAR_STATES`). @param {unknown} warState */
export const warIronState = (warState) => warState !== 'peace';

/**
 * THE PREDICATE OVER THE KEPT RECORD: a dependency row "Imports <a metal>" (the economy's own row, written beside the hook),
 * the imports holding iron or metal, and a war's state other than peace.
 * @param {ReadonlyArray<unknown>} dependencies `economicViability.dependencies` @param {ReadonlyArray<unknown>} imports
 * `economicState.primaryImports` @param {unknown} warState @returns {boolean}
 */
export function warHoldsIron(dependencies, imports, warState) {
  if (!warIronState(warState)) return false;
  /** @param {RegExp} pattern */
  const held = (pattern) => imports.some((x) => typeof x === 'string' && pattern.test(x));
  return dependencies.some((d) => {
    const m = /^Imports (.+)$/.exec(String(/** @type {{ title?: unknown } | null} */ (d)?.title ?? ''));
    return !!m && ironHookStands(m[1], held);
  });
}
