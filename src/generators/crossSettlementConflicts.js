/**
 * crossSettlementConflicts.js
 * Generates inter-settlement NPC conflicts and faction engagements
 * based on relationship type, settlement data, and economic/military context.
 *
 * DETERMINISM: this module NEVER runs inside the pipeline's setActiveRng scope
 * (all callers are UI/save-flow code). Reaching for the ambient rngContext here
 * silently fell back to Math.random(), so the same settlement pair rendered /
 * persisted DIFFERENT conflicts on every mount — the marquee "same seed ⇒ same
 * settlement" promise, broken. It now takes an EXPLICIT `rng` and exposes a
 * convenience wrapper that derives that rng from the pair's STABLE IDENTITY, so
 * a given (settlementA, settlementB, relationshipType) yields the same conflicts
 * forever, on any device, with no ambient state.
 */

import { createPRNG } from '../kernel/prng.js';

// Which NPC categories create friction per relationship type
const CONFLICT_CATS = {
  trade_partner: ['economy'],
  allied:        ['military', 'economy'],
  patron:        ['military', 'economy', 'government'],
  client:        ['economy', 'government'],
  rival:         ['economy', 'military', 'criminal'],
  cold_war:      ['military', 'criminal', 'government'],
  hostile:       ['military', 'criminal'],
  vassal:        ['military', 'economy', 'government'],
  criminal_network: ['criminal', 'economy'],
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
  vassal: {
    military:   ['levy obligation dispute', 'garrison quartering grievance', 'muster quota standoff'],
    economy:    ['tribute assessment dispute', 'harvest levy conflict'],
    government: ['charter rights dispute', 'homage renewal grievance'],
  },
  criminal_network: {
    criminal:   ['contraband route dispute', 'fence territory disagreement', 'exposed informant incident'],
    economy:    ['smuggled goods pricing conflict', 'front operation ownership dispute'],
  },
  neutral: {
    economy:    ['tariff dispute', 'waypoint access disagreement'],
  },
};

// Generate a conflict description given two NPCs and context
function buildConflictDesc(npcA, npcB, settA, settB, relType, nature, rng) {
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
    vassal: [
      `${npcB.name} of ${settB.name} is pressing ${npcA.name} over a ${nature} — the oath holds, but its terms are contested.`,
      `A ${nature} has strained relations between ${npcA.name} and ${settB.name}'s ${npcB.name}, who speaks for the liege's interests.`,
    ],
    criminal_network: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} are quietly at odds over a ${nature} — neither can bring the matter to any authority.`,
      `A ${nature} has soured the arrangement between ${npcA.name} and ${npcB.name} of ${settB.name} — the network still runs, but trust is thin.`,
    ],
    neutral: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} have a routine ${nature} that hasn't been resolved cleanly.`,
    ],
  };
  const pool = templates[relType] || templates.neutral;
  return rng.pick(pool);
}

// Faction engagement description
function buildFactionDesc(facA, facB, settA, settB, relType, rng) {
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
    vassal: [
      `${facB.name} of ${settB.name} presses feudal claims on ${facA.name}, which complies in public and resists in private.`,
    ],
    criminal_network: [
      `${facA.name} and ${settB.name}'s ${facB.name} share routes and fences — the partnership is profitable, and neither side trusts it.`,
    ],
    neutral: [
      `${facA.name} and ${settB.name}'s ${facB.name} maintain careful distance, neither allied nor opposed.`,
    ],
  };
  const pool = templates[relType] || templates.neutral;
  return rng.pick(pool);
}

/**
 * Stable identity for a settlement, used to seed conflict generation.
 * Prefers the generation seed (survives reruns of the same seed), then the
 * persisted save/settlement id, then the name. Never the object reference —
 * two structurally-equal settlements must seed identically.
 */
export function stableIdOf(settlement) {
  return String(settlement?._seed ?? settlement?.id ?? settlement?.name ?? '');
}

/**
 * Generate cross-settlement conflicts between two settlements.
 * Returns { forA: [...], forB: [...] } — same entries, mirrored perspective.
 *
 * `rng` is REQUIRED (a createPRNG instance). This function draws no ambient
 * randomness; callers without an rng should use
 * generateCrossSettlementConflictsDeterministic below, which derives a stable
 * one from the pair's identity.
 */
export function generateCrossSettlementConflicts(settlementA, settlementB, relType, linkId, rng) {
  if (!rng || typeof rng.pick !== 'function') {
    throw new Error(
      'generateCrossSettlementConflicts requires an rng (createPRNG instance). '
      + 'Use generateCrossSettlementConflictsDeterministic() to seed one from settlement identity.',
    );
  }
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

    const npcA = rng.pick(poolA);
    const npcB = rng.pick(poolB);
    usedA.add(npcA.id);
    usedB.add(npcB.id);

    const natures = CONFLICT_NATURE[relType]?.[cat] || ['jurisdictional dispute'];
    const nature  = rng.pick(natures);
    const desc    = buildConflictDesc(npcA, npcB, settlementA, settlementB, relType, nature, rng);
    const descB   = buildConflictDesc(npcB, npcA, settlementB, settlementA, relType, nature, rng);

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
  const doFaction = ['rival','cold_war','hostile','allied','patron','vassal','criminal_network'].includes(relType);
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
      const desc  = buildFactionDesc(bestA, bestB, settlementA, settlementB, relType, rng);
      const descB = buildFactionDesc(bestB, bestA, settlementB, settlementA, relType, rng);
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

/**
 * Deterministic convenience wrapper: derives the rng from the pair's STABLE
 * IDENTITY so the same (settlementA, settlementB, relType) always yields the
 * same conflicts — across remounts, saves, exports, and devices — with no
 * dependence on the ambient pipeline rng (which is never active for this
 * module's callers). This is the entry point every caller should use.
 */
export function generateCrossSettlementConflictsDeterministic(settlementA, settlementB, relType, linkId) {
  const rng = createPRNG(`xconflict:${stableIdOf(settlementA)}:${stableIdOf(settlementB)}:${relType}`);
  return generateCrossSettlementConflicts(settlementA, settlementB, relType, linkId, rng);
}
