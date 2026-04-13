/**
 * crossSettlementConflicts.js
 * Generates inter-settlement NPC conflicts and faction engagements
 * based on relationship type, settlement data, and economic/military context.
 */

import { random as _rng } from './rngContext.js';

// Which NPC categories create friction per relationship type
const CONFLICT_CATS = {
  trade_partner: ['economy'],
  allied:        ['military', 'economy'],
  patron:        ['military', 'economy', 'government'],
  client:        ['economy', 'government'],
  rival:         ['economy', 'military', 'criminal'],
  cold_war:      ['military', 'criminal', 'government'],
  hostile:       ['military', 'criminal'],
  neutral:       ['economy'],
};

// Nature of the conflict by relationship type and NPC category
const CONFLICT_NATURE = {
  trade_partner: {
    economy:    ['market boundary dispute', 'pricing agreement breakdown', 'export quota conflict', 'merchant route rivalry'],
  },
  allied: {
    military:   ['command hierarchy dispute', 'troop deployment disagreement', 'border patrol overlap'],
    economy:    ['trade preference dispute', 'supply priority conflict'],
  },
  patron: {
    military:   ['garrison obligation dispute', 'tribute enforcement standoff'],
    economy:    ['tribute levy disagreement', 'resource extraction claim'],
    government: ['administrative jurisdiction conflict', 'policy enforcement dispute'],
  },
  client: {
    economy:    ['debt renegotiation', 'supply chain dependency tension'],
    government: ['political autonomy dispute', 'representation grievance'],
  },
  rival: {
    economy:    ['market domination contest', 'trade route blockade', 'price war', 'export undercutting'],
    military:   ['border incursion', 'arms buildup standoff', 'mercenary recruitment competition'],
    criminal:   ['smuggling territory dispute', 'protection racket boundary war'],
  },
  cold_war: {
    military:   ['intelligence operation exposure', 'proxy force skirmish', 'defection incident'],
    criminal:   ['spy network compromise', 'asset elimination contract', 'double-agent suspicion'],
    government: ['diplomatic envoy incident', 'propaganda escalation', 'treaty violation allegation'],
  },
  hostile: {
    military:   ['open border skirmish', 'raid and reprisal cycle', 'siege posture standoff'],
    criminal:   ['sabotage operation', 'assassination contract', 'destabilization campaign'],
  },
  neutral: {
    economy:    ['tariff dispute', 'waypoint access disagreement'],
  },
};

function pick(arr) {
  return arr[Math.floor(_rng() * arr.length)];
}

function pickNPC(npcs, cat) {
  const filtered = npcs.filter(n => (n.category||'').toLowerCase() === cat);
  return filtered.length ? pick(filtered) : null;
}

// Generate a conflict description given two NPCs and context
function buildConflictDesc(npcA, npcB, settA, settB, relType, nature) {
  const templates = {
    trade_partner: [
      `${npcA.name} (${npcA.role}) and ${npcB.name} (${npcB.role}) of ${settB.name} are locked in a ${nature} — both claim the right to set terms for the shared corridor.`,
      `A ${nature} between ${npcA.name} and ${npcB.name} of ${settB.name} has stalled the trade agreement renewal for two seasons.`,
    ],
    allied: [
      `${npcA.name} and ${npcB.name} of ${settB.name} have reached an impasse over a ${nature} — the alliance holds, but with open tension.`,
      `The ${nature} between ${npcA.name} and ${settB.name}'s ${npcB.name} risks destabilizing the mutual defense pact.`,
    ],
    patron: [
      `${npcB.name} of ${settB.name} is pressing ${npcA.name} on a ${nature}, invoking the patronage agreement to compel compliance.`,
      `A ${nature} has put ${npcA.name} in direct conflict with ${settB.name}'s ${npcB.name}, who represents the patron's interests.`,
    ],
    client: [
      `${npcA.name} is negotiating with ${settB.name}'s ${npcB.name} over a ${nature} — the client settlement needs better terms.`,
      `Tension over a ${nature} has led ${npcA.name} to consider breaking with ${npcB.name}'s faction in ${settB.name}.`,
    ],
    rival: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} are engaged in open ${nature}, with neither willing to concede ground.`,
      `The ${nature} between ${npcA.name} and ${npcB.name} of ${settB.name} has escalated from professional friction to personal enmity.`,
      `${npcA.name} accuses ${settB.name}'s ${npcB.name} of deliberately undercutting a ${nature} — the charge is probably true.`,
    ],
    cold_war: [
      `${npcA.name} suspects ${settB.name}'s ${npcB.name} of orchestrating a ${nature} — no proof, but the suspicion is corrosive.`,
      `A ${nature} involving ${npcA.name} and ${npcB.name} of ${settB.name} has both sides operating through intermediaries.`,
    ],
    hostile: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} are on opposite sides of an active ${nature} — formal violence is a matter of timing.`,
      `The ${nature} between ${npcA.name} and ${npcB.name} of ${settB.name} has claimed blood on both sides.`,
    ],
    neutral: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} have a routine ${nature} that hasn't been resolved cleanly.`,
    ],
  };
  const pool = templates[relType] || templates.neutral;
  return pick(pool);
}

// Faction engagement description
function buildFactionDesc(facA, facB, settA, settB, relType) {
  const templates = {
    rival: [
      `The ${facA.name} of ${settA.name} and the ${facB.name} of ${settB.name} are in direct competition for the same economic territory. Both are escalating.`,
      `${facA.name} has been systematically undercutting ${facB.name}'s influence in ${settB.name}. Retaliation is expected.`,
    ],
    cold_war: [
      `${facA.name} and ${settB.name}'s ${facB.name} are running parallel intelligence operations — each knows the other knows.`,
      `The ${facA.name} has placed assets inside ${facB.name} of ${settB.name}. The infiltration goes both ways.`,
    ],
    hostile: [
      `${facA.name} and ${settB.name}'s ${facB.name} are in open conflict. Casualties have occurred on both sides.`,
    ],
    allied: [
      `${facA.name} and ${settB.name}'s ${facB.name} maintain a formal cooperation agreement, though it strains under individual interests.`,
    ],
    patron: [
      `${facB.name} of ${settB.name} exercises de facto oversight of ${facA.name}'s operations through the patronage arrangement.`,
    ],
    trade_partner: [
      `${facA.name} and ${settB.name}'s ${facB.name} share a market agreement, but competition still flares at the edges.`,
    ],
    neutral: [
      `${facA.name} and ${settB.name}'s ${facB.name} maintain careful distance, neither allied nor opposed.`,
    ],
  };
  const pool = templates[relType] || templates.neutral;
  return pick(pool);
}

/**
 * Generate cross-settlement conflicts between two settlements.
 * Returns { forA: [...], forB: [...] } — same entries, mirrored perspective.
 */
export function generateCrossSettlementConflicts(settlementA, settlementB, relType, linkId) {
  const cats  = CONFLICT_CATS[relType] || CONFLICT_CATS.neutral;
  const forA  = [];
  const forB  = [];

  // ── NPC conflicts ──────────────────────────────────────────────────────────
  const usedA = new Set();
  const usedB = new Set();
  let conflictCount = 0;
  const maxConflicts = relType === 'hostile' || relType === 'cold_war' ? 3 : 2;

  for (const cat of cats) {
    if (conflictCount >= maxConflicts) break;
    const poolA = (settlementA.npcs || []).filter(n =>
      (n.category || '').toLowerCase() === cat && !usedA.has(n.id)
    );
    const poolB = (settlementB.npcs || []).filter(n =>
      (n.category || '').toLowerCase() === cat && !usedB.has(n.id)
    );
    if (!poolA.length || !poolB.length) continue;

    const npcA = pick(poolA);
    const npcB = pick(poolB);
    usedA.add(npcA.id);
    usedB.add(npcB.id);

    const natures = CONFLICT_NATURE[relType]?.[cat] || ['jurisdictional dispute'];
    const nature  = pick(natures);
    const desc    = buildConflictDesc(npcA, npcB, settlementA, settlementB, relType, nature);
    const descB   = buildConflictDesc(npcB, npcA, settlementB, settlementA, relType, nature);

    const base = { linkId, type: 'conflict', conflictNature: nature, relType };
    forA.push({
      ...base,
      npcName: npcA.name, npcRole: npcA.role, npcId: npcA.id,
      partnerName: npcB.name, partnerRole: npcB.role,
      partnerSettlement: settlementB.name,
      description: desc,
    });
    forB.push({
      ...base,
      npcName: npcB.name, npcRole: npcB.role, npcId: npcB.id,
      partnerName: npcA.name, partnerRole: npcA.role,
      partnerSettlement: settlementA.name,
      description: descB,
    });
    conflictCount++;
  }

  // ── Faction engagement ─────────────────────────────────────────────────────
  // Only for relationship types where factions clash meaningfully
  const doFaction = ['rival','cold_war','hostile','allied','patron'].includes(relType);
  if (doFaction) {
    const factionsA = settlementA.factions || [];
    const factionsB = settlementB.factions || [];

    // Pair by matching dominant category, or just the largest factions
    let bestA = null, bestB = null;
    outer: for (const cat of cats) {
      for (const fa of factionsA) {
        if (fa.dominantCategory !== cat) continue;
        for (const fb of factionsB) {
          if (fb.dominantCategory === cat) { bestA = fa; bestB = fb; break outer; }
        }
      }
    }
    // Fallback: just use first factions from each
    if (!bestA && factionsA.length) bestA = factionsA[0];
    if (!bestB && factionsB.length) bestB = factionsB[0];

    if (bestA && bestB) {
      const desc  = buildFactionDesc(bestA, bestB, settlementA, settlementB, relType);
      const descB = buildFactionDesc(bestB, bestA, settlementB, settlementA, relType);
      const base  = { linkId, type: 'faction_engagement', relType };
      forA.push({
        ...base,
        factionName: bestA.name, factionCategory: bestA.dominantCategory,
        partnerFactionName: bestB.name, partnerFactionCategory: bestB.dominantCategory,
        partnerSettlement: settlementB.name,
        description: desc,
      });
      forB.push({
        ...base,
        factionName: bestB.name, factionCategory: bestB.dominantCategory,
        partnerFactionName: bestA.name, partnerFactionCategory: bestA.dominantCategory,
        partnerSettlement: settlementA.name,
        description: descB,
      });
    }
  }

  return { forA, forB };
}
