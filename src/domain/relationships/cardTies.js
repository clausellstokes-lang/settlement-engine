/**
 * relationships/cardTies.js — a card's ties as its card reads them (the people car, PEOPLE-4
 * TIES, 2026-11-07; R-P7: "the Relationships surfaces listing a card's own tie and the ties naming
 * it"). A tie is DIRECTED (`from` → `to`, people/ties.js): the card's OWN outgoing tie first, then
 * the ties NAMING it ("called by", the in-edges), each the same record. Pure; no draw.
 *
 * TODO(PEOPLE-5): a v1 save's undirected `npc1Id`/`npc2Id` pair is read as `from`/`to` by the save
 * migration (M-7), not by a shim here.
 */

/**
 * @typedef {{ from?: unknown, to?: unknown, type?: string, typeName?: string, description?: string,
 *   npc1Name?: string, npc2Name?: string }} DirectedTie
 */

/**
 * @param {unknown} relationships the settlement's ties @param {unknown} npcId the card's id
 * @returns {{ own: DirectedTie[], calledBy: DirectedTie[] }}
 */
export function tiesOfCard(relationships, npcId) {
  const id = npcId == null ? '' : String(npcId);
  const list = /** @type {DirectedTie[]} */ (Array.isArray(relationships) ? relationships : []);
  if (!id) return { own: [], calledBy: [] };
  return {
    own: list.filter((r) => r && String(r.from ?? '') === id),
    calledBy: list.filter((r) => r && String(r.to ?? '') === id && String(r.from ?? '') !== id),
  };
}

/**
 * The card's ties as one ordered list of lines: its own first ("→ the other end"), then each
 * tie naming it ("← the caller"). The kind is the tie's own label, the names the tie's own fields
 * (`npc1Name` is the `from` end's, `npc2Name` the `to` end's).
 * @param {unknown} relationships @param {unknown} npcId
 * @returns {Array<{ direction: 'own' | 'calledBy', withId: unknown, withName: string, kind: string, description: string, tie: DirectedTie }>}
 */
export function cardTieLines(relationships, npcId) {
  const { own, calledBy } = tiesOfCard(relationships, npcId);
  const kindOf = (/** @type {DirectedTie} */ r) => String(r.typeName || r.type || '');
  return [
    ...own.map((r) => ({ direction: /** @type {const} */ ('own'), withId: r.to, withName: String(r.npc2Name || ''), kind: kindOf(r), description: String(r.description || ''), tie: r })),
    ...calledBy.map((r) => ({ direction: /** @type {const} */ ('calledBy'), withId: r.from, withName: String(r.npc1Name || ''), kind: kindOf(r), description: String(r.description || ''), tie: r })),
  ];
}
