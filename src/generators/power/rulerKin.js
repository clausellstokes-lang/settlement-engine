/**
 * power/rulerKin.js — COHERENCE-POWERS phase 2B (the chair's charter of 2026-11-11, items 1-3, on the owner's law of
 * 2026-11-11: "whoever leads teh town, in any type of government is wearing a dual hat (where appropraite) they come
 * from an institution, and are elevated yet still tied to an institution"). Split out of rulingStructure.js, whose
 * module ceiling is cured by a split, never raised (LANDING-R2, ODQ §934.105).
 *
 *   THE COUNCIL OF A KIND (`drawCouncilOfAKind`, called by rulingStructure.js :: generatePowerStructure): a
 *   government of a kind is drawn only where the town has an open house of that kind (the house its leader comes
 *   from, people/representatives.js :: hasHouseOfKind), else the next priority's, else the size's civic government.
 *   A name the roster's own government house gives (govBody) is never second-guessed. No house is raised.
 */
import { inferFactionCategory } from './factionCategories.js';
import { hasHouseOfKind } from '../people/representatives.js';
import { backingArchetypeOf, RULER_KINDS } from '../../domain/dossier/powerSupport.js';

/**
 * The kind a governing name is of (the backing catalogue's archetype, powerSupport.js :: backingArchetypeOf), or null
 * for a civic, criminal or other government.
 * @param {string} name @returns {string | null}
 */
export function rulingKindOf(name) {
  const arch = backingArchetypeOf({ faction: name, category: inferFactionCategory(name) });
  return RULER_KINDS.includes(arch) ? arch : null;
}

/** @param {unknown} name @returns {boolean} */
const isCriminalName = (name) => backingArchetypeOf({ faction: String(name), category: inferFactionCategory(String(name)) }) === 'criminal';

/**
 * THE COUNCIL OF A KIND. `choose` is rulingStructure.js's own chooser of the governing name and modifier from one
 * category and its priority. The top priority's choice stands where it names no kind, names the govBody, or the
 * town has an open house of its kind; else the next priority's (ties broken as the top's own reduce breaks them:
 * the later category wins), unless that also lacks its house or is a criminal council (its house is hidden, so no
 * house shows it: the veil); else the size's civic government (the chooser at priority 0).
 * @param {(category: string, priority: number) => [any, any]} choose
 * @param {string} topCategory @param {number} topPriority
 * @param {Record<string, number>} priorityByCategory
 * @param {string | null} govBody @param {Array<any>} institutions
 * @returns {[any, any]} the governing name and its modifier
 */
export function drawCouncilOfAKind(choose, topCategory, topPriority, priorityByCategory, govBody, institutions) {
  /** @param {unknown} name @returns {boolean} */
  const lacksHouse = (name) => {
    if (!name || name === govBody) return false;
    const kind = rulingKindOf(String(name));
    return !!kind && !hasHouseOfKind(institutions, kind);
  };
  const first = choose(topCategory, topPriority);
  if (!lacksHouse(first[0])) return first;
  const next = Object.entries(priorityByCategory).map(([c, p], i) => ({ c, p, i }))
    .sort((x, y) => (y.p - x.p) || (y.i - x.i)).find((o) => o.c !== topCategory);
  const second = next ? choose(next.c, next.p) : null;
  if (second && !lacksHouse(second[0]) && !isCriminalName(second[0])) return second;
  return choose(topCategory, 0);
}
