/**
 * HOOKS-BUILD (PAGE-7's brief, 2026-11-20 17:01 UTC; the chair's rulings of 16:35 and 17:00): A TROUBLE'S HOOKS FROM A
 * POOL BY NEED, THREE KEPT. The eight commonest current-tension kinds stored their template's whole hook list, so two
 * places of one kind shared every line. Their hooks now come from the kind's pool (`src/data/troubleHooks.js`): the pool
 * is ranked by `fnv1a32(`${seed}::trouble::${kind}::hook::${text}`)` highest first (the town's own seed, `config._seed`,
 * as the timeline's description variants are keyed, so a history reroll keeps it), and each line in that order is handed
 * to the declared door ALONE, so a line is admitted where its needs hold and the presumption ledger notes exactly the
 * lines kept (the birth self-check re-reads those on the final record, and no other); the first three admitted are
 * stored. Draw-free: no roll is added, removed or moved. The template's own list stays the timeline's
 * (`historyGenerator.js :: generateEventNarrative`), and every other kind keeps its template's list. An approved seat's
 * legitimacy hook still takes its twin after the pick (`historyData.js :: legitimacyHeldTensions`, at the history step
 * and again at assembly); the pick reads the form, so the seat never moves it.
 * A leaf of `historyGenerator.js` (its one call site, `buildHistoricalEvent`), as `sizedLastingEffects.js` is: that file
 * stands at its size ceiling.
 */
import { drawDeclared } from '../../domain/facts/drawDeclared.js';
import { getActiveRng } from '../../kernel/rngContext.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { TROUBLE_HOOKS, TROUBLE_HOOK_COUNT } from '../../data/troubleHooks.js';

/**
 * The stored hooks of a tension of one of the eight kinds; null for any other kind (its template's list stands).
 * @param {unknown} kind the tension's type
 * @param {object | (() => object) | null} facts the history's facts (`hookFacts`)
 * @param {unknown} townSeed the town's own seed (`config._seed`); the step's stream seed only where none is stamped
 * @returns {string[] | null}
 */
export function troubleHooksOf(kind, facts, townSeed) {
  const pool = typeof kind === 'string' && Object.hasOwn(TROUBLE_HOOKS, kind) ? TROUBLE_HOOKS[kind] : null;
  if (!pool) return null;
  const seed = townSeed ?? getActiveRng()?.seed ?? '';
  const keyOf = (/** @type {{ text: string }} */ line) => fnv1a32(`${seed}::trouble::${kind}::hook::${line.text}`);
  // id: the line's index in its pool, the ledger's line id (the door notes a one-line domain's line by it)
  const ranked = pool.map((line, id) => ({ ...line, id })).sort((a, b) => keyOf(b) - keyOf(a));
  /** @type {string[]} */ const kept = [];
  for (const line of ranked) {
    if (kept.length >= TROUBLE_HOOK_COUNT) break;
    const text = drawDeclared([line], { draw: (p) => p[0], facts, key: `${seed}::trouble::${kind}::hook`, poolId: `troubleHooks:TROUBLE_HOOKS:${kind}`, surface: 'history', drawKind: 'H' }).text;
    if (typeof text === 'string') kept.push(text);
  }
  return kept;
}
