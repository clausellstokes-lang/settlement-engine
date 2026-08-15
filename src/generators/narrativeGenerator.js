/**
 * narrativeGenerator.js
 * Arrival scenes, pressure sentences, settlement summaries, and coherence notes.
 *
 * Exports consumed by the settlement generation pipeline:
 *  - generateSettlementReason  — why the settlement exists (trade/founding reason)
 *  - generatePressureSentence  — one-liner describing the current political pressure
 *  - generateArrivalScene      — vivid first-impression paragraph for DMs
 *  - generateCoherence         — cross-tab contradiction notes
 *
 * Internal helpers used only within this file:
 *  - STRESS_DESCS              — per-stress-type arrival vignettes (exported for UI)
 *  - genSettSummary            — structured summary of key settlement facts
 *  - genArrivalDetail          — full founding + arrival context object
 *  - genPressureDetail         — structured pressure context object
 *  - genCoherence              — coherence note array
 *  - getSettReason             — safety label → flavour sentence
 *  - buildTradeNarrative       — culture-appropriate architectural detail
 *  - generateSiegeCapability   — history → tension string
 *
 * Shared with the history REROLL path, so they live in ./narrative/historyCoherence.js
 * rather than here (see that module's header):
 *  - buildStressProfile        — history-pattern → character string
 *  - historySiegeNarrative     — the stored-form siege sentence
 */

import {
  clearActiveRng,
  random as _rng,
  setActiveRng,
} from '../kernel/rngContext.js';
import { pickVariant } from '../kernel/proseHash.js';
import { selectOriginBody } from './narrative/settlementOriginProse.js';
import { resolvePrimaryStress } from './stressPriority.js';
import { pick, pickRandom, pickRandom2, random01 } from './helpers.js';
import { resolveTerrain } from '../domain/resolveTerrain.js';
import { deriveTradeCommodity } from './tradeCommodity.js';
import {
  sentenceCase,
} from './narrativeProse.js';
import {
  CULTURE_PROFILES,
  resolveCultureProfileKey,
} from '../data/cultureProfiles.js';

import {
  ARRIVAL_SCENES,
  ARRIVAL_ADDONS,
  TERRAIN_NARRATIVE_HOOKS,
  STRESS_DESCS,
  STRESS_NOTES,
} from '../data/narrativeData.js';

// Re-export: STRESS_DESCS' public import path stays THIS module (tests + UI import it
// from here); the table itself now lives in the data leaf.
export { STRESS_DESCS };
// PRESSURE_SENTENCES + POLITICAL_FLAVOR hold render-time rng/pickRandom2 closures,
// so they live in the generators layer (A+ Track H data-schema.3), not src/data.
// POLITICAL_FLAVOR is read by the history-coherence leaf now, not here.
import { PRESSURE_SENTENCES } from './narrativeText.js';
import { checkInstCompat } from './structuralValidator.js';
import { genRelNarrative, genSuccessionNarr } from './powerGenerator.js';
import { mergeNPCLists } from './npcGenerator.js';
import { enrichNPCsWithStructure } from './npcStructure.js';
import { generateCrimeLevel, getStressHistory } from './npcGenerator.js';
import { generateSiegeCapability } from './narrative/siegeCapability.js';
// The history half of the coherence tail. Extracted so the history REROLL runs
// the same derivations assembly runs instead of shipping generateHistory's raw
// shape — the enrichNpcCoherence precedent [generators-domain-3]. This module
// is the single source; generateCoherence below reads it rather than owning a
// second copy.
import { buildStressProfile, historySiegeNarrative } from './narrative/historyCoherence.js';
import { resolveGenerationWorldLaw } from './generationContext.js';
import { deriveHistoryChallengeRoute } from './history/historyRouteContext.js';

// Keep the established public import path while the implementation lives with
// the other extracted narrative policies.
export { generateSiegeCapability };

// ─── buildTradeNarrative ─────────────────────────────────────────────────────
/**
 * Return a culture-specific architectural detail string for the arrival scene.
 *
 * @param {string} tier
 * @param {string} culture
 * @param {number} magicPriority - 0–100
 * @param {string|null} materializedDetail - Seed-stable cultural identity detail
 */
const buildTradeNarrative = (tier, culture, magicPriority, materializedDetail = null) => {
  // New settlements carry the exact detail chosen while resolving their
  // cultural identity. Legacy saves do not, so fall back to the complete
  // canonical profile vocabulary rather than silently presenting newer or
  // unknown culture keys as Germanic.
  const profileKey = resolveCultureProfileKey(culture);
  const legacyDetails = CULTURE_PROFILES[profileKey]?.architecturalDetails || [
    'local materials and inherited building methods distinguish the older wards',
    'workshops, homes, and civic buildings follow a practical regional grammar',
    'the settlement has grown in layers around its busiest public ground',
  ];
  const detail =
    typeof materializedDetail === 'string' && materializedDetail.trim()
      ? materializedDetail.trim()
      : pick(legacyDetails);
  const sentenceDetail = sentenceCase(detail);

  const TIER_BASE = {
    thorp: `The settlement is small enough that you can see all of it from the road: ${detail}.`,
    hamlet: `A dozen buildings around a central green, most of them old. ${sentenceDetail}.`,
    village: `A proper village, large enough to have a market and small enough that strangers are noticed — ${detail}.`,
    town: `A market town of substance: multiple streets, a visible guild quarter, ${detail}.`,
    city: `A city, properly speaking — dense, layered, too large to take in at once. ${sentenceDetail}.`,
    metropolis: `The scale of the place takes a moment to register. This is not one city so much as several districts, markets, and old settlements grown together into the region's great urban centre. ${sentenceDetail}.`,
  };

  const magicSuffix =
    magicPriority >= 66
      ? ' Arcane lights burn in several windows in the middle of the day.'
      : magicPriority >= 40
        ? ' A magelight lamp post marks the main gate.'
        : '';

  return (TIER_BASE[tier] || '') + magicSuffix;
};

// ─── buildStressProfile ───────────────────────────────────────────────────────
// Moved to ./narrative/historyCoherence.js (max-lines leaf rule, the STRESS_DESCS
// precedent below) so the reroll path can read the SAME derivation instead of a
// second copy. Imported above; still reached through this module by its existing
// consumers.

// ─── STRESS_DESCS ─────────────────────────────────────────────────────────────
/**
 * Per-stress-type arrival scene vignettes.
 * Each key maps to an array of template functions: (settlementName) => string.
 * Exported for use by UI components that want to preview stress descriptions.
 */
// STRESS_DESCS moved to src/data/narrativeData.js (max-lines leaf rule; Charge 4
// grew every pool 4→6). Imported above and re-exported below so every existing
// consumer import path keeps working.

// ─── genSettSummary ───────────────────────────────────────────────────────────
/**
 * Extract key settlement facts into a structured summary object used by
 * genArrivalDetail, genPressureDetail, and buildPoliticalNarrative.
 */
const genSettSummary = settlement => {
  const {
    name,
    tier,
    config = {},
    economicState = {},
    powerStructure = {},
    npcs = [],
    history = {},
    stress,
    _institutions = [],
  } = settlement;

  const stresses = (stress ? (Array.isArray(stress) ? stress : [stress]) : []).map(s => s.type);
  const primaryStress = resolvePrimaryStress(stresses);

  const factions = powerStructure.factions || [];
  const govFaction =
    factions.find(f => f.isGoverning)?.faction ||
    (tier === 'thorp'
      ? 'the household heads'
      : tier === 'hamlet' || tier === 'village'
        ? 'the village elders'
        : tier === 'town'
          ? 'the town council'
          : tier === 'city'
            ? 'the city council'
            : tier === 'metropolis'
              ? 'the grand council'
              : 'the council');
  const topFaction = factions[0]?.faction || 'the dominant faction';

  const crimFaction =
    factions.find(
      f =>
        f.faction?.toLowerCase().includes('thieves') ||
        f.faction?.toLowerCase().includes('criminal') ||
        (f.faction?.toLowerCase().includes('guild') && f.faction?.toLowerCase().includes('black')),
    )?.faction || null;

  const milFaction =
    factions.find(
      f =>
        f.faction?.toLowerCase().includes('military') ||
        f.faction?.toLowerCase().includes('guard') ||
        f.faction?.toLowerCase().includes('war council'),
    )?.faction || null;

  const relFaction =
    factions.find(
      f =>
        f.faction?.toLowerCase().includes('religious') ||
        f.faction?.toLowerCase().includes('church') ||
        f.faction?.toLowerCase().includes('quarantine'),
    )?.faction || null;

  // Primary commodity — unified scan (tradeCommodity.js). 'trade goods' fallback:
  // this feeds replaceTokens, which leaves the literal "{commodity}" in prose on
  // a falsy substitution, so the result must never be empty.
  const commodity = deriveTradeCommodity(economicState, { firstWordFallback: true, fallback: 'trade goods' });

  return {
    name,
    tier,
    stressType: primaryStress,
    stressTypes: stresses,
    commodity,
    prosperity: economicState.prosperity || 'Moderate',
    stability: powerStructure.stability || 'Stable',
    govFaction,
    topFaction,
    crimFaction,
    milFaction,
    relFaction,
    age: history.age || 100,
    access: config.tradeRouteAccess || 'road',
    npcNames: npcs.slice(0, 6).map(n => ({ name: n.name, role: n.role })),
    pickNPC: (exclude = -1) => {
      const pool = npcs.slice(0, 6).filter((_, i) => i !== exclude);
      return pool.length > 0 ? pickRandom2(pool) : null;
    },
    factionCount: factions.length,
  };
};

// ─── genArrivalDetail ─────────────────────────────────────────────────────────
/**
 * Build the full founding + arrival context object.
 * Used by historyGenerator (genArrivalDetail import) and internally.
 */
export const genArrivalDetail = (
  config,
  economicContext = null,
  generationContext = null,
) => {
  const route = config?.tradeRouteAccess || 'road';
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  const commodity = economicContext?.tradeCommodity || null;
  const prosperity = economicContext?.prosperity || 'Moderate';
  const stresses = config?.stressTypes?.length ? config.stressTypes : config?.stressType ? [config.stressType] : [];
  const primaryStress = resolvePrimaryStress(stresses);

  const tier = config?.tier || config?.settType || 'town';

  // Terrain narrative hooks (why the settlement is here). TERRAIN_NARRATIVE_HOOKS
  // mixes terrain keys (mountain/forest/plains) with route keys (port/road/isolated),
  // but the lookup only ever used `route` — so the 18 terrain-specific founding hooks
  // never fired (a mountain settlement got generic road/port reasons instead of its
  // "rich mineral deposits" / "strategic pass" ones). Prefer the settlement's resolved
  // terrain, fall back to route, then isolated.
  const terrain = resolveTerrain(config);
  const terrainHookKey = terrain === 'riverside'
    ? 'river'
    : terrain === 'coastal'
      ? 'port'
      : terrain;
  let reasonPool = TERRAIN_NARRATIVE_HOOKS[terrainHookKey]
    || TERRAIN_NARRATIVE_HOOKS[route]
    || TERRAIN_NARRATIVE_HOOKS.isolated;

  // Add commodity-specific reasons
  if (commodity) {
    const COMMODITY_HOOKS = {
      timber: [
        'grew from a single logging operation whose owner refused to leave when the contract ended',
        'was founded when foresters discovered that the surrounding woodland was three times richer than the maps showed',
      ],
      grain: [
        'began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield',
        'was established on farmland that three generations of the same family refused to sell, and eventually others settled around them',
      ],
      fish: terrain === 'riverside'
        ? [
            'started as a seasonal camp beside a dependable river fishery and became permanent when traders began stopping there',
            'grew around fishing weirs and a sheltered barge landing where the river catch could be salted and sold',
          ]
        : [
            'started as a seasonal camp for deep-water fishers who stopped bothering to go home between seasons',
            'grew around a natural harbour that fish seemed to prefer — nobody knows why, and nobody questions it',
          ],
      iron: [
        'was founded the week someone hit iron three feet below the surface and word reached the nearest city',
        'grew around a smithing operation that discovered the local ore was unusually pure and refused to share the location',
      ],
      stone: [
        'began when quarry workers sent to extract stone for a distant cathedral decided the site was worth keeping for themselves',
        "was established because the local stone cuts cleanly and doesn't crack in frost — a property worth more than it sounds",
      ],
      gems: [
        "was founded the day a shepherd's child found a stone in a streambed that turned out to be worth more than the flock",
        "grew from a prospectors' camp into something permanent when the gems didn't run out as quickly as expected",
      ],
      wool: [
        'began when a merchant realised the local sheep produced finer wool than anything available on the open market',
        'grew around a sheep run whose owner had the rare good sense to also build a mill and a market',
      ],
      livestock: [
        'developed where two droving roads crossed, because animals needed water and drovers needed ale',
        'began as a seasonal gathering point for cattle traders that became permanent when someone built an inn',
      ],
      salt: [
        'was established to control a salt deposit that the local lord considered more valuable than the surrounding farmland combined',
        'grew around salt workings that made everything they touched last longer — including the settlement itself',
      ],
      alchemy: [
        "attracted practitioners seeking ingredients found nowhere else within three days' travel",
        'began when a wandering alchemist settled here specifically because of what grows along the river margins',
      ],
      crafts: [
        'was founded when a group of skilled artisans pooled resources to build a permanent workshop district away from guild restrictions',
        "grew because the local clay and water made the finest ceramic work in the region — a reputation that preceded the settlement's name",
      ],
    };
    const commodityHooks = COMMODITY_HOOKS[commodity] || [];
    if (commodityHooks.length) reasonPool = [...reasonPool, ...commodityHooks];
  }

  // Who founded the settlement
  const FOUNDERS_BY_TIER = {
    thorp: [
      'a single extended family who came and never left',
      'a pair of siblings who disagreed about which direction to keep walking',
      'a discharged soldier who liked the view and had nowhere better to be',
      'a healer who stopped to treat a traveller and found the location too useful to leave',
    ],
    hamlet: [
      'three or four families who agreed to try wintering together and never stopped',
      'a miller who built a mill and found customers before they found customers',
      'a retired tradesperson whose skills attracted dependents',
      'a small religious community whose members drifted into secular life over two generations',
    ],
    village: [
      'a group of settlers seeking new opportunities',
      'refugees fleeing war or persecution who found the location defensible',
      'a noble granted lands by the crown and obligated to populate them',
      'escaped serfs seeking a place beyond the reach of their former masters',
      'a community of tradespeople who left a larger settlement under contested circumstances',
    ],
    town: [
      'merchants recognising economic potential before anyone else did',
      'a noble granted lands by the crown with the resources to develop them',
      'military veterans given land grants who brought their skills with them',
      'a merchant consortium that needed a waypoint and decided to own it',
      'religious authorities who wanted a centre for their regional operations',
    ],
    city: [
      'a powerful noble house that needed a commercial base independent of rivals',
      'a merchant coalition that grew too large for the town they started in',
      'a military command that built fortifications and found civilians followed',
      'royal decree and a century of forced investment',
    ],
    metropolis: [
      'imperial decree and the systematic forced relocation of skilled populations',
      'a dynastic decision that this crossroads would anchor the realm',
      'the slow accretion of three smaller settlements that eventually merged under a single administration',
      'a great trade house that outgrew every other settlement in the region',
    ],
  };

  // Initial challenges
  const CHALLENGES_BY_ROUTE = {
    port: [
      'storms that destroyed the first harbour',
      'piracy and coastal raids',
      'disease from sailors',
      'disputes over docking rights',
    ],
    river: [
      'seasonal flooding that destroyed early buildings',
      'disputes over water rights',
      'navigation hazards upriver',
      'river bandits',
    ],
    crossroads: [
      'rival claimants to the toll rights',
      'competition from nearby markets',
      'bandit activity on all four roads',
      'political pressure from surrounding lords',
    ],
    road: [
      'hostile local inhabitants',
      'rival claimants to the land',
      'harassment by a nearby lord',
      'poor early harvests',
    ],
    isolated: [
      'harsh environmental conditions',
      'lack of outside resources',
      'dangerous wildlife in the surrounding terrain',
      'disease and hardship in the early winters',
    ],
  };
  const challengeRoute = deriveHistoryChallengeRoute(route, worldLaw);

  // How it was overcome
  const OVERCOMING_BY_PROSPERITY = {
    Wealthy: [
      'through ruthless commercial efficiency',
      'by securing an exclusive charter before competitors could react',
      'by outlasting every rival',
    ],
    Prosperous: [
      'through sustained effort and reliable governance',
      'by attracting the right people at the right time',
      'through good fortune and good decisions in roughly equal measure',
    ],
    Moderate: [
      'through determination and cooperation',
      'by making enough right decisions to survive the wrong ones',
      'with help from external allies at a critical moment',
    ],
    Poor: [
      'at significant cost',
      'though the founding was harder than anyone admitted at the time',
      'by giving up more than the founders intended',
    ],
  };

  // Stress context note. CONTENT-GT-FINAL (Charge 4): each note is now a variant pool
  // (index 0 = the pre-existing canonical string). The lookup was a 0-draw deterministic
  // object read MID-history-stream, so variety here must ALSO draw zero: pickVariant
  // (pure fnv, kernel/proseHash) keyed on the settlement's config._seed — stamped by
  // generateHistory's callers. A seedless caller (or an unknown stress) renders the
  // canonical index-0 note, byte-identical to the old behaviour.
  // STRESS_NOTES (now variant pools, canonical-at-zero) lives in src/data/narrativeData.js.

  return {
    age: null, // filled in by historyGenerator
    reason: pick(reasonPool),
    foundedBy: pick(FOUNDERS_BY_TIER[tier] || FOUNDERS_BY_TIER.village),
    initialChallenge: pick(
      CHALLENGES_BY_ROUTE[challengeRoute] || CHALLENGES_BY_ROUTE.road,
    ),
    overcoming: pick(OVERCOMING_BY_PROSPERITY[prosperity] || OVERCOMING_BY_PROSPERITY.Moderate),
    stressNote: primaryStress
      ? pickVariant(
        STRESS_NOTES[primaryStress],
        config?._seed ? `${config._seed}::stressNote::${primaryStress}` : null,
      ) ?? null
      : null,
  };
};

// ─── genPressureDetail ────────────────────────────────────────────────────────
/**
 * Build the structured pressure context object used by generatePressureSentence.
 */
const genPressureDetail = settlement => {
  const {
    tier,
    institutions = [],
    economicState = {},
    powerStructure = {},
    npcs = [],
    history = {},
    stress,
    config = {},
    name,
    neighborRelationship,
    economicViability,
  } = settlement;

  const instNames = (institutions || []).map(i => (i.name || '').toLowerCase());
  const hasInst = kw => instNames.some(n => n.includes(kw));

  const stresses = (stress ? (Array.isArray(stress) ? stress : [stress]) : []).map(s => s.type);
  const primaryStress = resolvePrimaryStress(stresses);

  // Unified scan (tradeCommodity.js); the pressure templates carry their own
  // per-sentence defaults, so a plausible first word beats null here.
  const commodity = deriveTradeCommodity(economicState, { firstWordFallback: true });

  const factions = powerStructure?.factions || [];
  const govFaction =
    factions.find(f => f.isGoverning)?.faction ||
    (tier === 'thorp'
      ? 'the household heads'
      : ['hamlet', 'village'].includes(tier)
        ? 'the village elders'
        : tier === 'town'
          ? 'the town council'
          : tier === 'city'
            ? 'the city council'
            : tier === 'metropolis'
              ? 'the grand council'
              : 'the council');
  const topFaction = factions[0]?.faction || null;

  const milForce = hasInst('garrison')
    ? 'the garrison'
    : hasInst('barracks')
      ? 'the barracks guard'
      : hasInst('professional guard')
        ? 'the professional guard'
        : hasInst('city watch') || hasInst('town watch')
          ? 'the watch'
          : hasInst('militia')
            ? 'the militia'
            : hasInst('mercenary')
              ? 'the mercenary company'
              : ['thorp', 'hamlet', 'village'].includes(tier)
                ? 'the able-bodied'
                : 'the guard';

  const healerRef = hasInst('hospital')
    ? 'the hospital staff'
    : hasInst('monastery') || hasInst('friary')
      ? 'the monastery brothers'
      : hasInst('healer')
        ? 'the healers'
        : hasInst('church') || hasInst('cathedral') || hasInst('parish')
          ? 'the clergy'
          : ['thorp', 'hamlet'].includes(tier)
            ? 'the local herbalist'
            : 'the healers';

  return {
    name,
    tier,
    stressType: primaryStress,
    milForce,
    healersRef: healerRef,
    stresses: stresses.map(type => ({ type })),
    commodity,
    // compound: the economic/military/criminal effectiveness triplet the
    // wartime/mass_migration/insurgency PRESSURE_SENTENCES closures branch on
    // (r.compound?.economyOutput / militaryEffective / criminalEffective). Without
    // this the closures always hit their '|| default' fallback (dead compound branch).
    compound: economicState?.compound || undefined,
    prosperity: economicState?.prosperity || 'Moderate',
    govFaction,
    topFaction: topFaction || govFaction,
    stability: powerStructure?.stability || 'Stable',
    recentConflict: powerStructure?.recentConflict || null,
    topNPC: npcs?.[0] || null,
    topNPCRole: npcs?.[0]?.role || null,
    topNPCName: npcs?.[0]?.name || null,
    viabilityIssues: economicViability?.issues || [],
    isViable: economicViability?.viable !== false,
    topTension: (history?.currentTensions || [])[0]?.type || null,
    access: config?.tradeRouteAccess || 'road',
    threat: config?.monsterThreat || 'frontier',
    neighbor: neighborRelationship?.neighborName || null,
    neighborType: neighborRelationship?.relationshipType || null,
    hasNeighborConflict:
      neighborRelationship?.relationshipType?.toLowerCase().includes('hostile') ||
      neighborRelationship?.relationshipType?.toLowerCase().includes('rival'),
    isPort: config?.tradeRouteAccess === 'port',
    isCrossroads: config?.tradeRouteAccess === 'crossroads',
    isIsolated: config?.tradeRouteAccess === 'isolated',
  };
};

// ─── genCoherence ─────────────────────────────────────────────────────────────
/**
 * Generate cross-tab contradiction notes (shown in the Viability/Overview tab).
 * Flags contradictions between power structure, economics, stress, and history.
 */
const genCoherence = settlement => {
  const notes = [];
  const { powerStructure, economicState, config, _institutions, history } = settlement;
  if (!powerStructure || !economicState) return notes;

  const factions = powerStructure.factions || [];
  const stresses = config?.stressTypes || [];

  const crimeFaction = factions.find(
    f =>
      f.faction?.toLowerCase().includes('thieve') ||
      f.faction?.toLowerCase().includes('criminal') ||
      f.faction?.toLowerCase().includes('underworld'),
  );
  const govFaction = factions.find(f => f.isGoverning);

  // Criminal faction in a trade hub controls shadow flows
  if (crimeFaction && crimeFaction.power > 20 && economicState.isEntrepot) {
    notes.push({
      type: 'power_economic',
      severity: 'notable',
      tab: 'economics',
      note: `${crimeFaction.faction} holds ${crimeFaction.power}% of power in this transit hub. A portion of import/export flow is likely controlled outside official channels. Stated trade figures may not reflect actual volumes.`,
    });
  }

  // Siege contradicts trade income
  if (
    stresses.includes('under_siege') &&
    economicState.incomeSources?.some(s => s.source?.toLowerCase().includes('trade'))
  ) {
    notes.push({
      type: 'stress_economic',
      severity: 'contradiction',
      tab: 'economics',
      note: 'Settlement is under active siege. Trade income above reflects pre-siege operations. Current effective trade is likely zero or severely restricted.',
    });
  }

  // Occupation contradicts stable governance
  if (
    stresses.includes('occupied') &&
    powerStructure.stability &&
    !powerStructure.stability.toLowerCase().includes('occupation') &&
    !powerStructure.stability.toLowerCase().includes('suppress')
  ) {
    notes.push({
      type: 'power_stress',
      severity: 'notable',
      tab: 'power',
      note: 'Settlement is under occupation. Stated stability reflects surface conditions only. Governance legitimacy and local loyalty are separate from what the occupier presents.',
    });
  }

  // Church controls economy but formal governance is secular
  const churchControlsEcon = economicState.situationDesc?.toLowerCase().includes('church controls');
  const govIsSecular =
    govFaction &&
    !govFaction.faction.toLowerCase().includes('church') &&
    !govFaction.faction.toLowerCase().includes('temple') &&
    !govFaction.faction.toLowerCase().includes('clergy') &&
    !govFaction.faction.toLowerCase().includes('order');
  if (churchControlsEcon && govIsSecular) {
    notes.push({
      type: 'power_economic',
      severity: 'notable',
      tab: 'power',
      note: `Economic activity flows through religious institutions, but formal governance rests with ${govFaction.faction}. Whoever controls trade and tithes holds more practical power than whoever holds the official seat.`,
    });
  }

  // Powerful criminal faction in prosperous settlement
  if (
    crimeFaction &&
    crimeFaction.power > 35 &&
    ['Prosperous', 'Wealthy', 'Thriving'].includes(economicState.prosperity)
  ) {
    notes.push({
      type: 'power_economic',
      severity: 'notable',
      tab: 'overview',
      note: `${crimeFaction.faction} controls ${crimeFaction.power}% of power here. Stated prosperity reflects gross output — a meaningful share flows outside official taxation.`,
    });
  }

  // Recovery narrative: collapse long ago followed by recent boom
  if (history?.historicalEvents) {
    const events = history.historicalEvents;
    const hadCollapse = events.some(
      e => (e.name?.includes('Collapse') || e.name?.includes('Famine')) && e.yearsAgo > 80,
    );
    const hadBoom = events.some(
      e => (e.name?.includes('Boom') || e.name?.includes('Trade Route Opened')) && e.yearsAgo < 60,
    );
    if (hadCollapse && hadBoom) {
      notes.push({
        type: 'historical_economic',
        severity: 'context',
        tab: 'history',
        note: 'This settlement has a recovery narrative — significant economic hardship in its past, followed by more recent growth. Current prosperity was rebuilt, not inherited. The memory of the collapse shapes how risk and surplus are managed.',
      });
    }
  }

  return notes;
};

// ─── getSettReason ────────────────────────────────────────────────────────────
/**
 * Return a short flavour sentence matching the settlement's safety label.
 * Returns null if a stress type is active (pressure sentence handles that case).
 */
const _getSettReason = (safetyLabel, monsterThreat, hasStress) => {
  if (hasStress) return null;
  const label = (safetyLabel || '').toLowerCase();

  if (label.includes('authoritarian') || label.includes('enforced')) {
    return pickRandom([
      'The settlement is orderly in a way that requires maintenance.',
      'The guard presence is higher than the threat level requires.',
    ]);
  }
  if (label.includes('criminal') || label.includes('corrupt')) {
    return pickRandom([
      'The market stalls near the gate are attended by people who seem more interested in watching the street than selling.',
      "Commerce is active. Some of it is the kind that doesn't invite close attention.",
    ]);
  }
  if (label.includes('tense') || label.includes('unstable')) {
    return pickRandom([
      'Something is not quite right about the street, though it takes a moment to identify what.',
      'The settlement is going about its business, but with a particular awareness of itself.',
    ]);
  }
  if (label.includes('military') || label.includes('ordered')) {
    return pickRandom([
      'The settlement has a military discipline to it — not oppressive, but structured.',
      'The guards are well-turned-out. Someone takes their job seriously.',
    ]);
  }
  return pickRandom(
    monsterThreat === 'plagued'
      ? [
          "The settlement is armed in ways that a casual visitor might not notice immediately but can't stop noticing once they do.",
          'The torches at the gate burn in the middle of the day.',
        ]
      : ['It is, as far as you can tell, a normal day here.', 'The settlement is going about its business.', null],
  );
};

// ─── buildPoliticalNarrative ──────────────────────────────────────────────────
/**
 * Enrich an NPC object with faction affiliation, secret motivation overlay,
 * and stress-specific goal modifications.
 */
const buildPoliticalNarrative = (npc, index, summary, allNpcs) => {
  const crimeLevel = generateCrimeLevel(npc, index, summary, allNpcs);
  const secret = crimeLevel || npc.secret;
  let presentation = npc.presentation;

  // 40% chance to override presentation with a stress-coloured variant
  if (secret && random01(0.4)) {
    const stressVariant = getStressHistory(secret);
    if (stressVariant) presentation = stressVariant;
  }

  const enriched = { ...npc, presentation };
  if (crimeLevel) enriched.secret = crimeLevel;
  return enriched;
};

// ─── generateSettlementReason ─────────────────────────────────────────────────
/**
 * Generate the founding reason description for the settlement header.
 * Selects from trade-route appropriate narrative hooks.
 *
 * @param {string} tier
 * @param {string} route       - Trade route access string
 * @param {Object} neighbor    - Neighbor settlement (unused, kept for compat)
 * @param {Object} _config
 * @param {Object} [foodBalance] - Optional economicViability.metrics.foodBalance
 *                                 ({ dailyNeed, dailyProduction, deficit, rawDeficit, … }).
 *                                 When it records a meaningful deficit, the isolated
 *                                 wording acknowledges the gap instead of seeding the
 *                                 AI pass with a self-sufficiency claim.
 * @returns {string[]} Array of reason strings (shown as bullet list)
 */
export const generateSettlementReason = (tier, route, neighbor, _config = {}, foodBalance = null) => {
  const lines = [];

  // Meaningful food deficit? rawDeficit is the pre-import gap (need − production);
  // deficit is the residual after imports/magic. Either one signals the settlement
  // does not feed itself. Treated as meaningful above 5% of daily need so rounding
  // noise can't flip the founding narrative.
  const gap  = foodBalance ? Math.max(foodBalance.rawDeficit ?? 0, foodBalance.deficit ?? 0) : 0;
  const need = foodBalance?.dailyNeed ?? foodBalance?.need ?? 0;
  const hasFoodDeficit = gap > 0 && (need <= 0 || gap / need >= 0.05);

  // Primary settlement reason. THE ARM LOGIC IS UNCHANGED — route, with the port
  // terrain sub-arms and the isolated deficit split — but each arm now holds a pool
  // of authored variants instead of one frozen sentence, and the variant is chosen
  // DRAW-FREE from the settlement's founding state (see narrative/settlementOriginProse.js).
  // A caller that passes no `_seed` gets the pool's index 0, which is the exact
  // pre-widening sentence: canonical-at-zero, so no seedless caller moved.
  const supportChannels = (
    _config.magicExists !== false
    && Number(_config.priorityMagic ?? 50) > 0
  )
    ? 'magical transport, sanctioned caravans, seasonal access, or patronage'
    : 'sanctioned caravans, seasonal access, patronage, or emergency rationing';
  lines.push(selectOriginBody({
    route,
    terrainType: _config.terrainType ?? null,
    hasFoodDeficit,
    supportChannels,
    specialResources: _config.specialResources ?? null,
    seed: _config._seed ?? null,
  }));

  // Tier-specific context
  if (tier === 'metropolis') {
    lines.push(
      'At this scale, the settlement no longer serves a single economic function — it IS the economic function for its region.',
    );
  } else if (tier === 'city') {
    lines.push(
      hasFoodDeficit
        ? 'Large enough that its appetites outrun its fields — what the city consumes, it cannot fully produce.'
        : 'Large enough to produce what it consumes and consume what it produces. External trade amplifies rather than sustains.',
    );
  } else if (['thorp', 'hamlet'].includes(tier)) {
    lines.push('Small enough that every household knows its purpose. Surplus, if any, is modest.');
  }

  return lines;
};

// ─── generatePressureSentence ─────────────────────────────────────────────────
/**
 * Generate a short, vivid one-liner describing the settlement's current
 * political/social pressure. Used in the Overview tab header.
 */
export const generatePressureSentence = settlement => {
  if (!settlement) return null;
  const detail = genPressureDetail(settlement);

  // Stress → pressure sentence
  // PRESSURE_SENTENCES entries may be functions (r => [...]) or plain arrays.
  // Call the function first to resolve the template array, then pick from it.
  const stressType = detail.stressType;
  if (stressType && PRESSURE_SENTENCES[stressType]) {
    const raw = PRESSURE_SENTENCES[stressType];
    const templates = typeof raw === 'function' ? raw(detail) : raw;
    if (Array.isArray(templates) && templates.length) {
      const template = pickRandom2(templates);
      return typeof template === 'function' ? template(detail) : template;
    }
  }

  // Succession narrative. genSuccessionNarr reads name/topTension/topFaction/
  // govFaction/topNPC*/viabilityIssues/neighbor/commodity/stability etc. — the
  // genSettSummary shape carried almost none of those, so the branches never fired.
  // detail (genPressureDetail) provides all of them, including the same stability.
  if (detail.stability?.includes('Unstable') || detail.stability?.includes('Fractured')) {
    const succNarr = genSuccessionNarr(detail);
    if (succNarr?.length) return succNarr[0];
  }

  // Relationship narrative
  const relNarr = genRelNarrative(settlement);
  if (relNarr?.phrasing) return relNarr.phrasing;

  // Fallback: generic pressure
  if (detail.recentConflict) return detail.recentConflict;

  // Thorp/hamlet fallback — even stable small settlements have subsistence-level tensions
  if (['thorp', 'hamlet'].includes(detail.tier || '')) {
    const thorpPressures = [
      'A dispute over grazing rights and water access has been running for two seasons without resolution.',
      'The harvest was thin this year. Everyone knows it. Nobody is saying it directly.',
      'A family moved away last spring. The reason is not discussed, but it affected the dynamics here.',
      "The question of who tends the shared fields when the miller's household falls ill has never been properly settled.",
      'Two families have been in a quiet feud over a boundary marker for longer than anyone can clearly remember.',
      'The last frost came late and damaged the seedstock. Recovery is possible but the margin is narrow.',
      'A stranger passed through a month ago and asked questions nobody found comfortable.',
    ];
    return thorpPressures[Math.floor(_rng() * thorpPressures.length)];
  }

  return null;
};

// ─── generateArrivalScene ─────────────────────────────────────────────────────
/**
 * ARRIVAL_SCENES is keyed by SCENE (market/port/river/smoke/guild/ordinary), not
 * by route — indexing it with the raw route meant only 'river' ever hit and
 * every other settlement opened on the bare '… comes into view.' fallback.
 * Deterministic route → scene mapping:
 *   crossroads             → market  (roads converge on the market square)
 *   port                   → port    (coastal harbour approach)
 *   river                  → river   (inland working-waterfront approach)
 *   isolated/mountain_pass → smoke   (you see the smoke long before the buildings)
 *   road + anything else   → ordinary (the default in generateArrivalScene)
 * 'guild' has no route that implies it; it stays reserved for a future
 * craft-economy key. Exported so the joins harness can assert the mapping
 * lands on real ARRIVAL_SCENES keys.
 */
export const ROUTE_TO_SCENE = Object.freeze({
  crossroads: 'market',
  port: 'port',
  river: 'river',
  isolated: 'smoke',
  mountain_pass: 'smoke',
});

/**
 * Generate the arrival scene text shown at the top of the Overview tab.
 * Combines a stress-specific vignette (or generic arrival) with an
 * architectural detail and landmark description.
 */
export const generateArrivalScene = settlement => {
  if (!settlement) return null;

  const {
    name,
    tier,
    config = {},
    institutions = [],
    stress,
    culturalIdentity = null,
  } = settlement;

  const stresses = (stress ? (Array.isArray(stress) ? stress : [stress]) : []).map(s => s.type);
  const primaryStress = resolvePrimaryStress(stresses);

  const culture = config.culture || 'germanic';
  const magicPriority = config.priorityMagic ?? 50;
  const route = config.tradeRouteAccess || 'road';

  // Try stress-specific vignette first
  let openingLine;
  // `port` describes infrastructure/connectivity, while terrain describes
  // geography. A port on explicitly riverside terrain is an inland river port,
  // not a seaport; route-only defaults remain coastal for backwards
  // compatibility because getTerrainType('port') resolves to coastal.
  const riverPort = route === 'port' && config.terrainType === 'riverside';
  const sceneKey = riverPort ? 'river' : (ROUTE_TO_SCENE[route] || 'ordinary');
  if (primaryStress && STRESS_DESCS[primaryStress]) {
    openingLine = pickRandom2(STRESS_DESCS[primaryStress])(name);
  } else if (ARRIVAL_SCENES[sceneKey]) {
    // Generic route-based arrival, via the route → scene mapping above
    const template = pickRandom2(ARRIVAL_SCENES[sceneKey]);
    openingLine = typeof template === 'function' ? template(name, tier) : template;
  } else {
    openingLine = `${name} comes into view.`;
  }

  // Culture-specific architectural detail
  const architecturalNote = buildTradeNarrative(
    tier,
    culture,
    magicPriority,
    culturalIdentity?.architecturalDetail,
  );

  // Landmark from institution presence
  const landmarkNote = checkInstCompat(institutions, tier, magicPriority);

  // Route-flavour addon. ARRIVAL_ADDONS is keyed by ROUTE (port/river/
  // crossroads/road/isolated) but was indexed by economicState.tradeCommodity
  // — a field nothing writes on economicState (historyGenerator computes
  // tradeCommodity into history context only), so addons never fired. Index
  // by route; templates take (name, tier). mountain_pass has no addon pool
  // yet — the ?.length guard keeps that honest.
  let addon = null;
  const addonPool = ARRIVAL_ADDONS?.[riverPort ? 'river' : route];
  if (addonPool?.length) addon = pickRandom2(addonPool)(name, tier);

  const parts = [openingLine, architecturalNote, landmarkNote, addon].filter(Boolean);
  return parts.join(' ');
};

// ─── generateCoherence ────────────────────────────────────────────────────────
/**
 * Top-level coherence pass — enriches the settlement with:
 *  - NPC faction affiliations and stress-modified goals
 *  - Historical character description
 *  - Prominent NPC relationship
 *  - Coherence contradiction notes
 *  - Current tensions string
 */
/**
 * The NPC coherence-enrichment sub-pass: faction/secret overlays
 * (buildPoliticalNarrative) → faction-structure merge (mergeNPCLists) →
 * structural positions/goals/constraints (enrichNPCsWithStructure). Extracted so
 * BOTH full assembly (generateCoherence) and NPC section-regen (regenNPCsPipeline)
 * run the identical tail — a rerolled roster must carry the same factionAffiliation,
 * secrets overlay, and structuralPosition as a freshly generated one, not the
 * poorer raw shape. [generators-domain-3]
 * @param {*} settlement  a settlement-shaped object carrying the target npcs plus
 *   powerStructure/institutions/tier/config and the live state enrichment reads.
 * @returns {Array} the enriched npc list
 */
export const enrichNpcCoherence = (settlement) => {
  const npcs = settlement.npcs || [];
  const summary = genSettSummary(settlement);
  const enrichedNpcs = npcs.map((npc, idx) => buildPoliticalNarrative(npc, idx, summary, npcs));
  const rawMergedNpcs = mergeNPCLists(
    enrichedNpcs,
    settlement.powerStructure?.factions || [],
    settlement.institutions || [],
    settlement.tier,
    settlement.config || {},
  );
  return enrichNPCsWithStructure(rawMergedNpcs, settlement);
};

/**
 * Re-link faction member records to the ENRICHED roster by id.
 * [experience-faction-member-staleness] factionGrouping.buildFactions captures direct
 * references to the PRE-enrichment npc objects; the coherence tail then mints NEW enriched
 * npc objects for settlement.npcs (stress-woven goals + the secrets overlay + structural
 * position), leaving every faction's embedded members pointing at the discarded generic
 * copies — the ONE-SOURCE-PER-FACT violation. This remaps each member to the enriched npc
 * of the same id (identity fallback to the original when no id match), so the canonical
 * roster and the faction rosters carry the SAME npc records.
 *
 * Minimum honest repair only — NO id-reference / settlementMigration / normalizeSettlement
 * persistence-shape rewrite (owner-gated). Same-seed generator output shifts (members now
 * serialize the enriched shape): a DECLARED one-time move confined to the ALREADY-PARKED
 * generatorGoldenMaster family (re-mints at THE ONE REGEN).
 * @param {Array<{members?: Array<{id?: any}>}>|undefined} factions
 * @param {Array<{id?: any}>} enrichedNpcs
 * @returns {Array|undefined} the factions with members re-linked (input passed through when not an array)
 */
export const relinkFactionMembers = (factions, enrichedNpcs) => {
  if (!Array.isArray(factions)) return factions;
  const byId = new Map((Array.isArray(enrichedNpcs) ? enrichedNpcs : []).map((n) => [n?.id, n]));
  return factions.map((f) => {
    if (!f || !Array.isArray(f.members)) return f;
    return { ...f, members: f.members.map((m) => (m && byId.has(m.id) ? byId.get(m.id) : m)) };
  });
};

/**
 * Run one coherence concern on a stable child stream when the caller provides
 * the pipeline's coherence RNG. Direct legacy callers keep the historical
 * shared-stream behaviour.
 *
 * @template T
 * @param {{fork:(label:string)=>any}|null} rng
 * @param {string} label
 * @param {() => T} operation
 * @returns {T}
 */
function inCoherenceSubstream(rng, label, operation) {
  if (!rng?.fork) return operation();
  const previousRng = setActiveRng(rng.fork(label));
  try {
    return operation();
  } finally {
    clearActiveRng(previousRng);
  }
}

export const generateCoherence = (settlement, coherenceRng = null) => {
  if (!settlement) return settlement;

  // Each output owns a stable draw budget. Conditional work in NPC enrichment
  // (for example a stress overlay) cannot move the prominent-relationship
  // selection, and narrative-only work cannot rewrite canonical NPC state.
  const mergedNpcs = inCoherenceSubstream(
    coherenceRng,
    'npc-enrichment',
    () => enrichNpcCoherence(settlement),
  );

  const history = settlement.history || {};

  // Historical character string
  const historicalCharacter = inCoherenceSubstream(
    coherenceRng,
    'historical-character',
    () => buildStressProfile(
      history.historicalEvents || [],
      settlement.tier,
      settlement.config,
    ),
  );

  // Prominent relationship narrative
  const prominentRelationship = inCoherenceSubstream(
    coherenceRng,
    'prominent-relationship',
    () => genRelNarrative(settlement),
  );

  // Coherence contradiction notes
  const coherenceNotes = inCoherenceSubstream(
    coherenceRng,
    'coherence-notes',
    () => genCoherence(settlement),
  );

  // Siege narrative (separate from currentTensions array). The producer AND the
  // "strings only" filter live together in the history-coherence leaf, so the
  // reroll path stores the field under exactly this rule rather than a
  // re-implemented one.
  const siegeNarrativeStr = inCoherenceSubstream(
    coherenceRng,
    'siege-capability',
    () => historySiegeNarrative(history),
  );

  return {
    ...settlement,
    npcs: mergedNpcs,
    // Re-link faction rosters to the enriched npcs so members are not stale pre-enrichment
    // copies (only when the settlement already carries faction groups). [faction-member-staleness]
    ...(Array.isArray(settlement.factions)
      ? { factions: relinkFactionMembers(settlement.factions, mergedNpcs) }
      : {}),
    prominentRelationship,
    coherenceNotes,
    history: {
      ...history,
      historicalCharacter,
      currentTensions: history.currentTensions || [], // always keep as array
      siegeNarrative: siegeNarrativeStr,
    },
  };
};
