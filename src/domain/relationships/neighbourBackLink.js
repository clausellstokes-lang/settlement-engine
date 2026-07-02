/**
 * neighbourBackLink.js — bidirectional neighbour linking for the canonical
 * save flow.
 *
 * When a settlement is generated with a `neighborRelationship` and then saved,
 * its OWN neighbourNetwork entry is derived at the storage boundary
 * (withNeighbourNetworkFromRelationship in lib/saves.js). But if the named
 * neighbour already exists as a save, the two saves should reference *each
 * other* — the partner's row needs a reciprocal neighbourNetwork entry plus the
 * cross-settlement NPC contacts and conflicts. That is a multi-row write the
 * single-insert save path cannot perform on its own.
 *
 * This module holds the pure linking logic (extracted from the now-removed
 * SettlementsPanel.saveCurrentSettlement) so the canonical save flow can compute
 * both sides of the link and persist them atomically. The NPC-pairing helpers
 * live here too because SettlementsPanel's manual-link UI shares them.
 */

import { generateCrossSettlementConflicts } from '../../generators/crossSettlementConflicts.js';
import {
  canonicalEdgeForLink,
  relationshipLinkMetadata,
  rolesForCanonicalEdge,
} from './canonicalRelationship.js';

// ── NPC pairing helpers ──────────────────────────────────────────────────────
const NPC_PAIR_CATS = {
  trade_partner: ['economy'], allied: ['economy', 'military'], patron: ['military', 'economy'],
  client: ['economy'], rival: ['economy', 'military'], cold_war: ['military', 'criminal'],
  hostile: ['military'], vassal: ['military', 'economy'], neutral: ['economy'],
};
const CONTACT_DESC = {
  trade_partner: (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) maintains trade connections with ${b} (${br}) in ${bs}.`,
  allied:        (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) coordinates with ${b} (${br}) of ${bs} on matters of mutual defense and policy.`,
  patron:        (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) reports to ${b} (${br}) of ${bs}, who exercises oversight authority.`,
  client:        (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) supplies goods and services to ${b} (${br}) in ${bs}.`,
  rival:         (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) and ${b} (${br}) of ${bs} are known adversaries competing for the same interests.`,
  cold_war:      (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) runs quiet intelligence operations against ${b} (${br}) of ${bs}, officially unacknowledged.`,
  hostile:       (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) and ${b} (${br}) of ${bs} are active enemies.`,
  vassal:        (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) coordinates obligations and protection with ${b} (${br}) of ${bs}.`,
  neutral:       (/** @type {any} */ a, /** @type {any} */ ar, /** @type {any} */ b, /** @type {any} */ br, /** @type {any} */ bs) => `${a} (${ar}) has occasional dealings with ${b} (${br}) in ${bs}.`,
};

/**
 * @param {any} settlementA
 * @param {any} settlementB
 * @param {any} relType
 * @param {any} linkId
 */
export function buildInterSettlementNPCs(settlementA, settlementB, relType, linkId) {
  const cats = NPC_PAIR_CATS[/** @type {keyof typeof NPC_PAIR_CATS} */ (relType)] || ['economy'];
  const descFn = CONTACT_DESC[/** @type {keyof typeof CONTACT_DESC} */ (relType)] || CONTACT_DESC.neutral;
  let npcsA = (settlementA.npcs || []).filter((/** @type {any} */ n) => cats.includes((n.category || '').toLowerCase()));
  let npcsB = (settlementB.npcs || []).filter((/** @type {any} */ n) => cats.includes((n.category || '').toLowerCase()));
  if (!npcsA.length) npcsA = (settlementA.npcs || []).slice(0, 3);
  if (!npcsB.length) npcsB = (settlementB.npcs || []).slice(0, 3);
  if (!npcsA.length || !npcsB.length) return { forA: [], forB: [] };
  const pairs = [];
  const maxPairs = Math.min(npcsA.length, npcsB.length, 2);
  const usedB = new Set();
  for (let i = 0; i < maxPairs; i++) {
    const a = npcsA[i];
    const b = npcsB.find((/** @type {any} */ n) => !usedB.has(n.id) && n.category === a.category) || npcsB.find((/** @type {any} */ n) => !usedB.has(n.id));
    if (!b) break; usedB.add(b.id); pairs.push({ a, b });
  }
  const forA = pairs.map(({ a, b }) => ({ linkId, npcId: a.id, npcName: a.name, npcRole: a.role, partnerName: b.name, partnerRole: b.role, partnerSettlement: settlementB.name, relType, description: descFn(a.name, a.role, b.name, b.role, settlementB.name) }));
  const forB = pairs.map(({ a, b }) => ({ linkId, npcId: b.id, npcName: b.name, npcRole: b.role, partnerName: a.name, partnerRole: a.role, partnerSettlement: settlementA.name, relType, description: descFn(b.name, b.role, a.name, a.role, settlementA.name) }));
  return { forA, forB };
}

/**
 * @param {any} saves
 * @param {any} name
 */
export function findSaveByName(saves, name) {
  return saves.find((/** @type {any} */ s) => s.name === name || s.settlement?.name === name) || null;
}

/**
 * Compute the bidirectional neighbour link for a save being created.
 *
 * `entry` is the new save (must carry `id`, `name`, `tier`, `settlement`).
 * `existingSaves` is the list of the user's current saves to search for the
 * named neighbour. Both inputs are read-only.
 *
 * Returns `null` when the new settlement has no `neighborRelationship` or no
 * matching active partner exists — the caller then persists a plain single
 * insert. Otherwise returns:
 *   - `settlement`: the new settlement augmented with its side of the link
 *     (neighbourNetwork entry + interSettlementRelationships) — this replaces
 *     the generated stub for the same neighbour.
 *   - `partner`: `{ id, name, tier, settlement }` — the partner save with its
 *     reciprocal back-link applied, ready to write as an update.
 *
 * Pure + idempotent: re-running drops any prior entry for the same partner /
 * linkId before re-adding, so repeated saves do not duplicate links.
 *
 * @param {any} entry
 * @param {any} existingSaves
 */
export function buildNeighbourBackLink(entry, existingSaves) {
  const settlement = entry?.settlement;
  const nr = settlement?.neighborRelationship;
  if (!nr?.name) return null;
  const saveId = entry.id;
  if (!saveId) return null;
  const partnerSave = findSaveByName(existingSaves || [], nr.name);
  if (!partnerSave || !partnerSave.settlement) return null;
  if (String(partnerSave.id) === String(saveId)) return null;

  const relType = nr.relationshipType || 'neutral';
  const linkId = `link_${saveId}_${partnerSave.id}`;
  const edge = /** @type {any} */ (canonicalEdgeForLink({ relationshipType: relType }, { id: saveId }, partnerSave));
  const roles = rolesForCanonicalEdge(edge, saveId, partnerSave.id);
  const definition = { relationshipType: edge.relationshipType, from: edge.from, to: edge.to };

  const entryForOwn = {
    id: partnerSave.id, linkId, name: partnerSave.name, neighbourName: partnerSave.name,
    neighbourTier: partnerSave.tier, tier: partnerSave.tier,
    ...relationshipLinkMetadata(definition, roles.sourceRole),
    description: `Generated with ${roles.sourceRole.replace(/_/g, ' ')} standing toward ${partnerSave.name}.`,
    bidirectional: true,
  };
  const entryForPartner = {
    id: saveId, linkId, name: entry.name, neighbourName: entry.name,
    neighbourTier: entry.tier, tier: entry.tier,
    ...relationshipLinkMetadata(definition, roles.targetRole),
    description: `${entry.name} has ${roles.targetRole.replace(/_/g, ' ')} standing toward this settlement.`,
    bidirectional: true,
  };

  const { forA: npcForOwn, forB: npcForPartner } = buildInterSettlementNPCs(settlement, partnerSave.settlement, edge.relationshipType, linkId);
  const { forA: conflictForOwn, forB: conflictForPartner } = generateCrossSettlementConflicts(settlement, partnerSave.settlement, edge.relationshipType, linkId);

  const ownSettlement = {
    ...settlement,
    neighbourNetwork: [entryForOwn, ...(settlement.neighbourNetwork || []).filter((/** @type {any} */ n) => n.name !== partnerSave.name && n.linkId !== linkId)],
    interSettlementRelationships: [...(settlement.interSettlementRelationships || []).filter((/** @type {any} */ r) => r.linkId !== linkId), ...npcForOwn, ...conflictForOwn],
  };
  const partnerSettlement = {
    ...partnerSave.settlement,
    neighbourNetwork: [entryForPartner, ...(partnerSave.settlement.neighbourNetwork || []).filter((/** @type {any} */ n) => n.id !== saveId && n.linkId !== linkId)],
    interSettlementRelationships: [...(partnerSave.settlement.interSettlementRelationships || []).filter((/** @type {any} */ r) => r.linkId !== linkId), ...npcForPartner, ...conflictForPartner],
  };

  return {
    settlement: ownSettlement,
    // Full merged partner blob — used by the LOCAL storage path (single-threaded, no
    // race) which writes the whole entry back.
    partner: { id: partnerSave.id, name: partnerSave.name, tier: partnerSave.tier, settlement: partnerSettlement },
    // The DELTA the cloud path applies atomically via the merge_neighbour_backlink RPC
    // (migration 096) instead of writing the stale full blob — fixes the read-modify-
    // write clobber race when two saves reference the same partner concurrently.
    partnerDelta: {
      partnerId: partnerSave.id,
      linkId,
      newSaveId: saveId,
      networkEntry: entryForPartner,
      relationshipEntries: [...npcForPartner, ...conflictForPartner],
    },
  };
}
