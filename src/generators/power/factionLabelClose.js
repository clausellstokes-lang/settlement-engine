/**
 * generators/power/factionLabelClose.js — THE FACTION LABELS RESOLVED AT THE BIRTH'S CLOSE
 * (CENSUS-1i unit 1, 2026-11-05; the chair's ruling R-AW of 08:3x, on CENSUS-4f's carried row).
 *
 * The power step pushes the `Military/Guard` faction by the military priority and the tier, and
 * reads its label through `textOf` (CENSUS-4f, `data/factionLabelSiblings.js`): the row declares
 * `guardPresence`, which is NOT settled at that step (R-AN: 1 of 363 holders on the 1,000 differs
 * between the power step and the final record). So the label is resolved where the fact settles:
 * here, once every roster writer has run and the hook-truth gate has stored the record's hooks,
 * against the FINAL record (`factsOf`). A label the record admits stays and is noted (the birth
 * self-check re-asserts it); a refused one is replaced by its twin through the converged faction
 * rename cascade (`domain/factionRename.js :: applyFactionRenameToSettlement`), so every copy of the
 * name — the roster, the conflicts, the affiliations, the blurbs, the crisis cast, the tension
 * parties — follows, and the generation trace keeps the name the generator used (that cascade's own
 * NON_CASCADED ruling). No roll is drawn and none moves; a birth whose labels are admitted is
 * byte-identical.
 *
 * Mutates the settlement in place (the assembly step owns the object at this point).
 *
 * @enforced-by tests/generators/factionLabelClose.test.js
 */
import { FACTION_LABEL_SIBLINGS } from '../../data/factionLabelSiblings.js';
import { resolveSibling } from '../../domain/facts/drawDeclared.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { applyFactionRenameToSettlement } from '../../domain/factionRename.js';

const POOL_ID = 'factionLabelSiblings:FACTION_LABEL_SIBLINGS';

/**
 * @param {any} settlement the assembled record (mutated in place)
 * @returns {Array<{ from: string, to: string }>} the labels replaced, for the caller's trace
 */
export function resolveFactionLabelsAtClose(settlement) {
  const factions = settlement?.powerStructure?.factions;
  if (!Array.isArray(factions)) return [];
  const labels = new Set(factions.map((f) => (f && (f.faction ?? f.name)) || null));
  /** @type {Array<{ from: string, to: string }>} */
  const moved = [];
  /** @type {any} */ let facts = null;
  for (const label of Object.keys(FACTION_LABEL_SIBLINGS)) {
    if (!labels.has(label)) continue;
    facts = facts || factsOf(settlement);
    const to = resolveSibling(label, FACTION_LABEL_SIBLINGS, { facts, poolId: POOL_ID, surface: 'power', drawKind: 'T' });
    if (typeof to === 'string' && to !== label) {
      applyFactionRenameToSettlement(settlement, label, to);
      moved.push({ from: label, to });
    }
  }
  return moved;
}
