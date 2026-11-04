/**
 * generators/npc/tieKind.js — THE TIE RULE at the NPC tie step (CENSUS-4 R3).
 *
 * `computeRelTension` rolls a tie kind from the two NPCs' categories; a kind that presumes a
 * relation between the two ROLES (Mentor and Successor: a shared trade or office; Professional
 * Rivalry: a shared trade or market; Jurisdictional Tension: two offices) is checked against the
 * one role-class rule (`domain/roles/roleClass.js :: exemptedVerdict`) AFTER the roll, and a
 * refused kind resolves to a role-free kind (debt, leverage, respect, family, unresolved history)
 * by hash: no roll is added or removed, so a lawful tie is byte-identical and only a refused one
 * moves. The strength label is then drawn from the resolved kind's list with the same single
 * roll (every list is three long).
 *
 * At the tie step the seat's factions are not yet known (the power affiliation is decided by the
 * enrichment tail), so the seat exemptions read empty and only the class, office and same-faction
 * exemptions can spare a tie: the draw is at least as strict as the reader, never laxer.
 */
import { STRESS_ECONOMIC_EFFECTS } from '../../data/npcData.js';
import { resolveTieKey } from '../../domain/roles/roleClass.js';

/**
 * @param {any} archetype the kind `computeRelTension` drew (a STRESS_ECONOMIC_EFFECTS entry)
 * @param {{ id?: unknown, role?: unknown, factionAffiliation?: unknown }} npc
 * @param {{ id?: unknown, role?: unknown, factionAffiliation?: unknown }} partner
 * @returns {any} the archetype to print
 */
export function tieArchetype(archetype, npc, partner) {
  const key = Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, value]) => value === archetype)?.[0];
  if (!key) return archetype;
  const { key: resolved, refused } = resolveTieKey(
    key,
    { role: String(npc?.role ?? ''), npc },
    { role: String(partner?.role ?? ''), npc: partner },
    `${String(npc?.id ?? '')}>${String(partner?.id ?? '')}`,
  );
  return refused ? /** @type {Record<string, unknown>} */ (STRESS_ECONOMIC_EFFECTS)[resolved] : archetype;
}
