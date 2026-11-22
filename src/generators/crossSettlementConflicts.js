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

/**
 * THE PLAIN WORDS FOR EACH CONFLICT NATURE (STYLE-2 SW-4, ruling A7, 2026-11-09). The keys above are
 * the stored vocabulary (`conflictNature` on every conflict row, read by the Relationships tab and
 * desk) and never move; the description prints the plain words instead of the jargon key. Every
 * phrase takes the templates' own article ("a …", "an active …", "open …"), so each starts on a
 * consonant sound. A key missing here prints as itself (the pin in crossSettlementConflicts.test.js
 * holds that every key IS mapped).
 * @type {Readonly<Record<string, string>>}
 */
export const CONFLICT_NATURE_PLAIN = Object.freeze({
  'market boundary dispute': 'quarrel over where one market ends and the other begins',
  'pricing agreement breakdown': 'broken agreement on prices',
  'export quota conflict': 'dispute over how much each side may sell abroad',
  'merchant route rivalry': 'rivalry between merchants over the same road',
  'command hierarchy dispute': 'dispute over who gives the orders',
  'troop deployment disagreement': 'disagreement over where the soldiers are sent',
  'border patrol overlap': 'dispute over who patrols the border',
  'trade preference dispute': 'dispute over whose goods come first',
  'supply priority conflict': 'dispute over who is supplied first',
  'garrison obligation dispute': 'dispute over who must man the garrison',
  'tribute enforcement standoff': 'standoff over collecting the tribute',
  'tribute levy disagreement': 'disagreement over how much tribute is owed',
  'resource extraction claim': 'dispute over who may take what the land yields',
  'administrative jurisdiction conflict': 'dispute over whose officials have the say',
  'policy enforcement dispute': 'dispute over whose rules are enforced',
  'debt renegotiation': 'dispute over the terms of a debt',
  'supply chain dependency tension': 'grievance over how much one side depends on the other for its goods',
  'political autonomy dispute': 'dispute over how far each side may run its own affairs',
  'representation grievance': 'grievance over who speaks for whom',
  'market domination contest': 'contest over who controls the market',
  'trade route blockade': 'blockade of a trade road',
  'price war': 'price war',
  'export undercutting': 'contest to sell cheaper than the other abroad',
  'border incursion': 'border crossing by armed men',
  'arms buildup standoff': 'standoff as both sides arm themselves',
  'mercenary recruitment competition': 'contest to hire the same sellswords',
  'smuggling territory dispute': 'dispute over who smuggles where',
  'protection racket boundary war': 'fight over who collects protection money where',
  'intelligence operation exposure': 'spying operation that was found out',
  'proxy force skirmish': 'skirmish fought by hired hands',
  'defection incident': 'defection to the other side',
  'spy network compromise': 'betrayal of a spy ring',
  'asset elimination contract': 'contract to kill an agent',
  'double-agent suspicion': 'suspicion that a spy serves both sides',
  'diplomatic envoy incident': 'quarrel over the treatment of an envoy',
  'propaganda escalation': 'campaign of slander',
  'treaty violation allegation': 'charge that a treaty was broken',
  'open border skirmish': 'skirmish on the border',
  'raid and reprisal cycle': 'run of raids and reprisals',
  'siege posture standoff': 'standoff with soldiers ready for a siege',
  'sabotage operation': 'campaign of sabotage',
  'assassination contract': 'contract for a killing',
  'destabilization campaign': 'campaign to stir up trouble',
  'levy obligation dispute': 'dispute over how many fighters must be sent',
  'garrison quartering grievance': 'grievance over soldiers quartered in homes',
  'muster quota standoff': 'standoff over how many must answer the muster',
  'tribute assessment dispute': 'dispute over how the tribute is reckoned',
  'harvest levy conflict': 'dispute over the share of the harvest owed',
  'charter rights dispute': 'dispute over the rights the charter grants',
  'homage renewal grievance': 'grievance over renewing the oath of homage',
  'contraband route dispute': 'dispute over a smuggling road',
  'fence territory disagreement': 'dispute over who sells stolen goods where',
  'exposed informant incident': 'paid informer who was found out',
  'smuggled goods pricing conflict': 'quarrel over the price of smuggled goods',
  'front operation ownership dispute': 'dispute over who owns a business that fronts for them',
  'tariff dispute': 'dispute over tolls and duties',
  'waypoint access disagreement': 'dispute over the use of a stopping place on the road',
  'jurisdictional dispute': 'dispute over whose say it is',
});

/** @param {string} nature @returns {string} */
export const plainConflictNature = (nature) => CONFLICT_NATURE_PLAIN[nature] || nature;

// Generate a conflict description given two NPCs and context
function buildConflictDesc(npcA, npcB, settA, settB, relType, nature, rng) {
  const templates = {
    trade_partner: [
      `${npcA.name} (${npcA.role}) and ${npcB.name} (${npcB.role}) of ${settB.name} are locked in a ${nature}. Both claim the right to set the terms of trade between them.`,
      `A ${nature} between ${npcA.name} and ${npcB.name} of ${settB.name} has stalled the trade agreement renewal for two seasons.`,
    ],
    allied: [
      `${npcA.name} and ${npcB.name} of ${settB.name} have reached an impasse over a ${nature}. The alliance holds, but with open tension.`,
      `The ${nature} between ${npcA.name} and ${settB.name}'s ${npcB.name} could break the pact that binds the two places to defend each other.`,
    ],
    patron: [
      `${npcB.name} of ${settB.name} is pressing ${npcA.name} on a ${nature}, and holding them to the patronage between the two places.`,
      `A ${nature} has put ${npcA.name} in direct conflict with ${settB.name}'s ${npcB.name}, who represents the patron's interests.`,
    ],
    client: [
      `${npcA.name} is negotiating with ${settB.name}'s ${npcB.name} over a ${nature}, and the client settlement needs better terms.`,
      `Tension over a ${nature} has led ${npcA.name} to consider breaking with ${npcB.name} and those they speak for in ${settB.name}.`,
    ],
    rival: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} are engaged in open ${nature}, with neither willing to concede ground.`,
      `The ${nature} between ${npcA.name} and ${npcB.name} of ${settB.name} has escalated from professional friction to personal enmity.`,
      `${npcA.name} accuses ${settB.name}'s ${npcB.name} of deliberately undercutting a ${nature}. The charge is probably true.`,
    ],
    cold_war: [
      `${npcA.name} suspects ${settB.name}'s ${npcB.name} of orchestrating a ${nature}. There is no proof, but the suspicion is corrosive.`,
      `A ${nature} involving ${npcA.name} and ${npcB.name} of ${settB.name} has both sides operating through intermediaries.`,
    ],
    hostile: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} are on opposite sides of an active ${nature}. Fighting between them is only a matter of time.`,
      `The ${nature} between ${npcA.name} and ${npcB.name} of ${settB.name} has claimed blood on both sides.`,
    ],
    vassal: [
      `${npcB.name} of ${settB.name} is pressing ${npcA.name} over a ${nature}. The oath holds, but its terms are contested.`,
      `A ${nature} has strained relations between ${npcA.name} and ${settB.name}'s ${npcB.name}, who speaks for the liege's interests.`,
    ],
    criminal_network: [
      `${npcA.name} and ${settB.name}'s ${npcB.name} are quietly at odds over a ${nature}, and neither can bring the matter to any authority.`,
      `A ${nature} has soured the arrangement between ${npcA.name} and ${npcB.name} of ${settB.name}. The network still runs, but trust is thin.`,
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
      `The ${facA.name} of ${settA.name} and the ${facB.name} of ${settB.name} are competing for the same trade, and neither will back down.`,
      `${facA.name} has been systematically undercutting ${facB.name}'s influence in ${settB.name}. Retaliation is expected.`,
    ],
    cold_war: [
      `${facA.name} and ${settB.name}'s ${facB.name} are spying on each other, and each knows the other knows.`,
      `The ${facA.name} has agents inside ${facB.name} of ${settB.name}, and it has agents of theirs inside it in turn.`,
    ],
    hostile: [
      `${facA.name} and ${settB.name}'s ${facB.name} are in open conflict. People have died on both sides.`,
    ],
    allied: [
      `${facA.name} and ${settB.name}'s ${facB.name} have a formal agreement to work together, though each keeps putting its own interests first.`,
    ],
    patron: [
      `${facB.name} of ${settB.name} keeps a close watch on everything ${facA.name} does, through the patronage between the two places.`,
    ],
    trade_partner: [
      `${facA.name} and ${settB.name}'s ${facB.name} share a market agreement, but competition still flares at the edges.`,
    ],
    vassal: [
      `${facB.name} of ${settB.name} presses feudal claims on ${facA.name}, which complies in public and resists in private.`,
    ],
    criminal_network: [
      `${facA.name} and ${settB.name}'s ${facB.name} share routes and fences. The partnership is profitable, and neither side trusts it.`,
    ],
    neutral: [
      `${facA.name} and ${settB.name}'s ${facB.name} maintain careful distance, neither allied nor opposed.`,
    ],
  };
  const pool = templates[relType] || templates.neutral;
  return rng.pick(pool);
}

/**
 * The factions a settlement engages with (GS-2, ODQ §934.101): its POWER factions, the set the
 * simulation runs and every other surface names, strongest first. The NPC grouping is never read
 * (PEOPLE-5A, M-2): a shape with no power roster engages with none. A neighbour summary carries
 * its partner's powers under `powerStructure.factions` like any place.
 * @param {any} settlement
 * @returns {Array<{ name: string, category: string }>}
 */
function engagingFactions(settlement) {
  const roster = settlement?.powerStructure?.factions;
  if (!Array.isArray(roster)) return [];
  return [...roster]
    .sort((a, b) => (b?.power || 0) - (a?.power || 0))
    .map((f) => ({ name: f?.faction || f?.name, category: f?.category || 'other' }))
    .filter((f) => f.name);
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
    const plain   = plainConflictNature(nature); // the description prints plain words; the stored key stays
    const desc    = buildConflictDesc(npcA, npcB, settlementA, settlementB, relType, plain, rng);
    const descB   = buildConflictDesc(npcB, npcA, settlementB, settlementA, relType, plain, rng);

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
    const factionsA = engagingFactions(settlementA);
    const factionsB = engagingFactions(settlementB);

    // Pair by matching dominant category, or just the largest factions
    let bestA = null, bestB = null;
    outer: for (const cat of cats) {
      for (const fa of factionsA) {
        if (fa.category !== cat) continue;
        for (const fb of factionsB) {
          if (fb.category === cat) { bestA = fa; bestB = fb; break outer; }
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
        factionName: bestA.name, factionCategory: bestA.category,
        partnerFactionName: bestB.name, partnerFactionCategory: bestB.category,
        partnerSettlement: settlementB.name,
        description: desc,
      });
      forB.push({
        ...base,
        factionName: bestB.name, factionCategory: bestB.category,
        partnerFactionName: bestA.name, partnerFactionCategory: bestA.category,
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
