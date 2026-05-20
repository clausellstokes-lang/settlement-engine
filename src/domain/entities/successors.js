/**
 * domain/entities/successors.js — Suggest successors for a removed NPC.
 *
 * The plan flagged this gap: when a pillar NPC dies, the engine knows
 * the institution is now vacant but doesn't know who could fill the
 * role. Without successor logic, every leader-death event creates an
 * authoring burden — the user has to invent a replacement from scratch.
 *
 * `inferSuccessors` walks the settlement and ranks viable candidates
 * for an outgoing NPC by linkage strength + importance + alignment.
 *
 * Pure: no React, no store. The store calls this after KILL_NPC commits
 * a pillar-tier death; the SuccessorPrompt UI consumes the ranked list.
 */


/** @typedef {import('./npcs.js').NpcStructural} NpcStructural */

/**
 * Find the most likely successors to an outgoing NPC.
 *
 * Ranking criteria (in order):
 *   1. Already linked to the same institution(s) — internal succession
 *      (the obvious candidate: the deputy)
 *   2. Linked to the same faction(s) — political loyalty
 *   3. Importance tier — key > notable > minor
 *   4. Influence score (if present)
 *
 * Returns up to `limit` candidates. Pillar NPCs aren't normally
 * successors (they have their own roles), but a key NPC who shares
 * institutional/faction links is the standard successor.
 *
 * @param {Object} args
 * @param {NpcStructural} args.outgoing
 * @param {Object} args.settlement
 * @param {number} [args.limit=3]
 * @returns {NpcStructural[]} ranked candidates
 */
export function inferSuccessors({ outgoing, settlement, limit = 3 }) {
  if (!outgoing || !settlement) return [];
  const npcs = settlement.npcs || [];
  const outId = outgoing.id || outgoing.name;
  const outInst = new Set(outgoing.linkedInstitutionIds || []);
  const outFac  = new Set(outgoing.linkedFactionIds || []);

  // Score each NPC for successor fitness. Higher score = better fit.
  const scored = npcs
    .filter(n => (n.id || n.name) !== outId)               // not the same NPC
    .filter(n => n.status !== 'dead' && n.status !== 'removed' && n.status !== 'exiled')
    .map(n => ({ npc: n, score: scoreCandidate(n, outInst, outFac) }))
    .filter(s => s.score > 0)                              // anyone with zero overlap is irrelevant
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.npc);
}

/**
 * Compose a `potentialSuccessors` field for an NPC at generation time.
 * Called by `npcGenerator` when emitting a pillar NPC so the field is
 * populated before any deaths occur. If no candidates exist yet, the
 * field is empty and the SuccessorPrompt will fall back to free-form
 * input.
 */
export function precomputeSuccessors({ npc, settlement, limit = 3 }) {
  return inferSuccessors({ outgoing: npc, settlement, limit })
    .map(n => n.id || n.name)
    .filter(Boolean);
}

function scoreCandidate(candidate, outInst, outFac) {
  // Institutional overlap is the strongest signal — internal succession
  // is the standard inheritance pattern (deputy mayor becomes mayor).
  const candInst = candidate.linkedInstitutionIds || [];
  let instOverlap = 0;
  for (const id of candInst) {
    if (outInst.has(id)) instOverlap += 50;
  }

  // Faction overlap is the next strongest — political loyalty matters.
  const candFac = candidate.linkedFactionIds || [];
  let facOverlap = 0;
  for (const id of candFac) {
    if (outFac.has(id)) facOverlap += 25;
  }

  // Gate the entire score on having SOME overlap. Without this, an
  // unrelated NPC (random townsperson) would score points just for
  // being notable, and an outgoing NPC with no linkages (a stranger,
  // an unsettled wanderer) would receive a list of every key NPC in
  // the settlement as "successor candidates" — meaningless.
  const overlap = instOverlap + facOverlap;
  if (overlap === 0) return 0;

  let score = overlap;

  // Importance tier breaks ties — a key NPC is a more credible successor
  // than a notable one. Pillar candidates are slightly downweighted on
  // the assumption that they have their own duties.
  if (candidate.importance === 'pillar') score += 10;       // own pillar role probably keeps them busy
  else if (candidate.importance === 'key') score += 30;     // sweet spot
  else if (candidate.importance === 'notable') score += 15;
  // minor adds nothing extra — they only get counted via overlap

  // Influence score (if generated) breaks remaining ties
  if (typeof candidate.influence === 'number') score += Math.min(candidate.influence / 10, 10);

  return score;
}
