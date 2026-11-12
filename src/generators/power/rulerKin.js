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
 *
 *   THE FOLD AND THE POWER WITH NO ONE ON THE PAGE (`settleHouselessPowers`, called by
 *   density/applyDensityLaw.js :: resizePoliticalRoster, where the roster is last built and the houses are final).
 */
import { inferFactionCategory } from './factionCategories.js';
import { faceBearingHouseNames, hasHouseOfKind } from '../people/representatives.js';
import { backingArchetypeOf, dealDoubledNiches, houseBacksOf, RULER_KINDS } from '../../domain/dossier/powerSupport.js';
import { FACTION_LABEL_SIBLINGS } from '../../data/factionLabelSiblings.js';

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

/** The powers rulingStructure.js's roster raises from the houses and the priorities: the merchant, craft, criminal
 *  and arcane blocs, the church, the military bloc under either label, and the landed bloc by size. */
export const BASE_ROSTER_NAMES = Object.freeze(['Merchant Guilds', 'Craft Guilds', "Thieves' Guild", 'Arcane Orders', 'Religious Authorities',
  ...FACTION_LABEL_SIBLINGS['Military/Guard'].map((sibling) => sibling.text), 'Manor Household', 'Landed Gentry', 'Noble Houses', 'Noble Families']);

/**
 * THE FOLD (A-plus, item 1): a power of the ruler's own kind that no house stands behind is not a power, and its
 * figure folds into the ruler. THE POWER WITH NO ONE ON THE PAGE (item 3, inside R-P5: no borrowing, never a
 * fabricated citizen): any other power of a house kind that no house stands behind is not built; its share leaves
 * the roster (the resize's conservation restores 100). An `other` power keeps its R-P4 mint; a criminal power
 * stands outside (its houses are hidden: the veil); the ruler is never touched.
 *
 * Both reach only the roster's own powers (BASE_ROSTER_NAMES) and the density law's doubled-niche rivals
 * (`contestsNiche`, the resize's own mint). A power a stress brings (stressFactions.js: the occupier, the quarantine
 * council, the war council, a schism's congregation) carries the stress's story and stands whatever the houses say;
 * one with no one on the page is the residue the phase-2B note names for a ruling.
 *
 * Runs where the houses are final: at the power step the faction boost (factionCorrelation.js) has not yet raised
 * the houses a power founds, so a fold there would fold powers housed by birth's end, and drop their houses.
 * "No house" is the people seam's own test: no face-bearing house (people/representatives.js ::
 * faceBearingHouseNames) lands a share on the power after the doubled-niche deal (powerSupport.js ::
 * dealDoubledNiches, the ruler first among its kind). Mutates `factions` in place.
 * @param {Array<any>} factions the roster, the governing row marked @param {Array<any>} institutions
 * @returns {{ folded: string[], dropped: string[] }} the powers folded into the ruler, and those not built
 */
export function settleHouselessPowers(factions, institutions) {
  const view = { institutions, powerStructure: { factions: factions.map((f) => ({ ...f, category: f.category || inferFactionCategory(f.faction || '') })) } };
  const governing = view.powerStructure.factions.find((f) => f.isGoverning);
  if (!governing) return { folded: [], dropped: [] };
  const rulerKind = backingArchetypeOf(governing);
  const faced = faceBearingHouseNames(institutions);
  const housed = new Set();
  for (const [house, list] of dealDoubledNiches(view, houseBacksOf(view))) {
    if (faced.has(house)) for (const back of list) if (back.share > 0) housed.add(back.faction);
  }
  /** @type {string[]} */ const folded = [];
  /** @type {string[]} */ const dropped = [];
  for (const f of view.powerStructure.factions) {
    if (f.isGoverning || housed.has(f.faction)) continue;
    if (!BASE_ROSTER_NAMES.includes(f.faction) && !f.contestsNiche) continue;
    const kind = backingArchetypeOf(f);
    if (kind === 'other' || kind === 'criminal') continue;
    (RULER_KINDS.includes(rulerKind) && kind === rulerKind ? folded : dropped).push(f.faction);
  }
  const ruler = factions.find((f) => f.isGoverning);
  for (const name of [...folded, ...dropped]) {
    const at = factions.findIndex((f) => !f.isGoverning && f.faction === name);
    if (folded.includes(name)) ruler.power = (ruler.power || 0) + (factions[at].power || 0);
    factions.splice(at, 1);
  }
  return { folded, dropped };
}
