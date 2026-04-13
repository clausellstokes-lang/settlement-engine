/**
 * narrativeGenerator.js
 * Arrival scenes, pressure sentences, settlement summaries, and coherence notes.
 *
 * Exports consumed by generateSettlement.js:
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
 *  - buildStressProfile        — history-pattern → character string
 *  - generateSiegeCapability   — history → tension string
 */

import { random as _rng } from './rngContext.js';
import {chance, pick, pickRandom, pickRandom2, random01} from './helpers.js';

import {PRESSURE_SENTENCES, ARRIVAL_SCENES, ARRIVAL_ADDONS, TERRAIN_NARRATIVE_HOOKS, POLITICAL_FLAVOR} from '../data/narrativeData.js';
import {checkInstCompat} from './structuralValidator.js';
import {genRelNarrative, genSuccessionNarr} from './powerGenerator.js';
import {mergeNPCLists} from './npcGenerator.js';
import {enrichNPCsWithStructure} from './npcStructure.js';
import {generateCrimeLevel, getStressHistory} from './npcGenerator.js';

// ─── buildTradeNarrative ─────────────────────────────────────────────────────
/**
 * Return a culture-specific architectural detail string for the arrival scene.
 *
 * @param {string} tier
 * @param {string} culture
 * @param {number} magicPriority - 0–100
 */
const buildTradeNarrative = (tier, culture, magicPriority) => {
  const CULTURAL_DETAILS = {
    germanic: ['half-timbered upper floors overhang the street', 'steeply pitched roofs catch the rain', 'carved lintels above the better doorways'],
    latin:    ['stone colonnades along the market facing', 'terracotta tiles warmer than the local stone', 'a forum-style open square at the centre'],
    celtic:   ['thatched roofs on the older buildings', 'carved knotwork on the standing stones at the crossroads', 'roundhouses in the oldest quarter'],
    arabic:   ['latticed stonework on the upper windows', 'a shaded courtyard visible through an open gate', 'domed rooftops in the merchant quarter'],
    norse:    ['carved dragon-head beams on the hall', 'turf roofing on the older structures', 'ships visible at the water\'s edge'],
    slavic:   ['painted facades in the guild district', 'an onion-dome tower above the temple', 'timber construction that looks like it was built to last and has'],
  };

  const detail = pick(CULTURAL_DETAILS[culture] || CULTURAL_DETAILS.germanic);

  const TIER_BASE = {
    thorp:      `The settlement is small enough that you can see all of it from the road: ${detail}.`,
    hamlet:     `A dozen buildings around a central green, most of them old. ${detail}.`,
    village:    `A proper village, large enough to have a market and small enough that strangers are noticed — ${detail}.`,
    town:       `A market town of substance: multiple streets, a visible guild quarter, ${detail}.`,
    city:       `A city, properly speaking — dense, layered, too large to take in at once. ${detail}.`,
    metropolis: `The scale of the place takes a moment to register. This is not a large settlement. It is a city in its own right. ${detail}.`,
  };

  const magicSuffix =
    magicPriority >= 66 ? ' Arcane lights burn in several windows in the middle of the day.' :
    magicPriority >= 40 ? ' A magelight lamp post marks the main gate.'                       : '';

  return (TIER_BASE[tier] || '') + magicSuffix;
};

// ─── buildStressProfile ───────────────────────────────────────────────────────
/**
 * Return a one-sentence historical character description driven by the pattern
 * of event types in the settlement's history. Uses POLITICAL_FLAVOR templates.
 */
const buildStressProfile = (events, tier, config) => {
  if (!events || events.length === 0) return 'recently established and still finding its character';

  const disasters   = events.filter(e => e.type === 'disaster').length;
  const political   = events.filter(e => e.type === 'political').length;
  const economic    = events.filter(e => e.type === 'economic').length;
  const religious   = events.filter(e => e.type === 'religious').length;
  const magical     = events.filter(e => e.type === 'magical').length;
  const catastrophic = events.some(e => e.severity === 'catastrophic');

  if (random01(0.15)) return pickRandom2(POLITICAL_FLAVOR.stable)(events);

  let pattern;
  if (catastrophic)          pattern = 'catastrophic';
  else if (political >= 2)   pattern = 'political_heavy';
  else if (disasters >= 2)   pattern = 'disaster_heavy';
  else if (economic >= 2)    pattern = 'economic_heavy';
  else if (religious >= 1 && random01(0.6)) pattern = 'religious_heavy';
  else if (magical >= 1 && random01(0.5))   pattern = 'magical_heavy';
  else if (events.length >= 4 && random01(0.65)) pattern = 'layered_history';
  else                       pattern = 'stable';

  const subset = {
    political_heavy:  events.filter(e => e.type === 'political'),
    disaster_heavy:   events.filter(e => e.type === 'disaster'),
    economic_heavy:   events.filter(e => e.type === 'economic'),
    religious_heavy:  events.filter(e => e.type === 'religious'),
    magical_heavy:    events.filter(e => e.type === 'magical'),
    catastrophic:     events.filter(e => e.severity === 'catastrophic'),
    layered_history:  events,
    stable:           events,
  }[pattern];

  const flavors = POLITICAL_FLAVOR[pattern];
  if (!flavors || !subset || subset.length === 0) return pickRandom2(POLITICAL_FLAVOR.stable)(events);

  return pickRandom2(flavors)(subset)
    .replace(/\bthe\s+(the|a|an)\s+/gi, 'the ')
    .replace(/\bthe\s+(The|A|An)\s+/g, 'the ');
};

// ─── generateSiegeCapability ──────────────────────────────────────────────────
/**
 * Return a string describing the current state of tensions, possibly informed
 * by the settlement's historical events.
 */
const generateSiegeCapability = (historicalEvents, currentTensions, age) => {
  if (!historicalEvents || historicalEvents.length === 0) return currentTensions;

  const recentEvents = historicalEvents
    .slice(0, 3)
    .filter(e => e.yearsAgo < Math.max(30, age * 0.3));

  if (!recentEvents.length) return currentTensions;

  const hasMilitary = recentEvents.some(e => e.type === 'political' || e.type === 'disaster');
  if (!hasMilitary) return currentTensions;

  const recent = recentEvents[0];
  if (!recent?.name) return currentTensions;

  return `The ${recent.name} is still present in living memory — ${currentTensions || 'its effects shape current decisions'}.`;
};

// ─── STRESS_DESCS ─────────────────────────────────────────────────────────────
/**
 * Per-stress-type arrival scene vignettes.
 * Each key maps to an array of template functions: (settlementName) => string.
 * Exported for use by UI components that want to preview stress descriptions.
 */
const STRESS_DESCS = {
  under_siege: [
    r => `The gates of ${r} are closed. There are people on the walls. This is not the relaxed watch of a settlement going about its day — these are people watching the treeline. A runner comes out of the small side gate, sees your group, stops.`,
    r => `${r}'s gates are open but attended — every person entering is noted, every cart searched. The guards are professional about it, which makes it worse. Professional means this has been happening long enough to become routine.`,
    r => `From the road, ${r} looks ordinary. Smoke from cookfires, the sound of a market. It is only at the gate that the weight becomes apparent — the guards' expressions, the way conversation stops when strangers approach.`,
    r => `The approach to ${r} is quieter than it should be for a settlement this size. The outlying farms are empty. The road has not been maintained recently. The settlement itself is intact, but everything around it has been abandoned to the walls.`,
  ],
  famine: [
    r => `${r} looks prosperous in the merchant quarter — new paint, loaded carts, a market stall with produce. It is only when you walk further in that the other version of the settlement appears: shuttered houses, people sitting on doorsteps with no particular purpose.`,
    r => `${r} is functional. The market is open, the streets are swept, the guards are at their posts. Something is wrong anyway. It takes a moment to identify: there are no children playing in the street.`,
    r => `The queue at the granary gate is the first thing you see in ${r}. Not a market queue, not a water queue — the organised, patient, daily queue of people who are waiting to receive what they are owed and are not certain they will receive it.`,
    r => `${r} is orderly in the way that a settlement is orderly when order is being enforced. The streets are clear. The rationing markers are painted on the doors. A guard patrol passes and everyone steps aside.`,
  ],
  occupied: [
    r => `The flags above ${r}'s gatehouse are not the settlement's own. Two soldiers at the gate — their uniform is not local. They look at your papers with the particular expression of people who have been told to look at papers.`,
    r => `${r} looks normal from the approach. It is only at the gate that the nature of normal becomes apparent: the guard asks where you are from, writes it down, and asks how long you intend to stay. This is not the usual question.`,
    r => `The approach to ${r} looks like any other settlement. There is graffiti on the wall near the gate that someone has attempted to scrub off. The symbol is still readable.`,
    r => `${r} is going about its business. The market is open, the streets are busy, the gates are attended by soldiers whose armour is not local. Everyone is doing what they are supposed to be doing, which is the point.`,
  ],
  politically_fractured: [
    r => `${r} has two gates. The eastern one is controlled by one faction, the western by another — you can tell by the pennants. The road you are on leads to the eastern gate.`,
    r => `The gate guard at ${r} asks where you intend to stay — which inn, which district. The answer apparently matters. They note it and say nothing further.`,
    r => `The road into ${r} has been marked. Symbols painted on fence posts and milestone stones — the same symbol, repeated, belonging to one faction or another. Someone has been doing this recently; the paint is fresh.`,
    r => `${r} is quieter than it should be. Not the quiet of a sleeping town or a working one — the particular quiet of a place where people have learned to be careful about what they say in earshot of strangers.`,
  ],
  indebted: [
    r => `${r} is in reasonable shape. The walls are standing, the market is functioning, the main street is paved. The paving needs repair. The wall has a section of new brick that doesn't quite match the old. The repairs that needed doing five years ago are still waiting.`,
    r => 'A building near the gate has a new sign — an institution that wasn\'t there last season, with a name that is recognisably the name of an outside creditor. Someone has arrived and set up an office. This is not a good sign.',
    r => `${r} functions. The market is busy enough. The streets are clean enough. The civic buildings are maintained enough. 'Enough' is doing a lot of work in every impression.`,
    r => `The merchant district of ${r} looks prosperous. The rest of the settlement, visible further in, looks like it has been waiting for the merchant district's prosperity to reach it for some years.`,
  ],
  recently_betrayed: [
    r => `The guard at ${r}'s gate is polite, thorough, and writes down more than guards usually write down. You are asked your business three times, by three different people, in the space of five minutes.`,
    r => `Something happened in ${r} recently. You cannot immediately say what, but the settlement has the quality of a place that is still processing something — hushed conversations, people watching the street.`,
    r => `There are notices posted at the gate of ${r}. You take a moment to read one: it is asking for information about a specific event, with a contact at the council offices. The date on the notice is recent.`,
    r => `${r} looks ordinary from the approach. It is only in the expressions of the people at the gate — watchful in a specific, tired way — that something registers.`,
  ],
  infiltrated: [
    r => `${r} looks exactly like it should. The gate is attended, the market sounds busy, there is nothing remarkable about the approach. Everything is as it should be.`,
    r => `The approach to ${r} is unremarkable in every respect. Gate, road, market noise, smoke, the usual questions from the guard. Nothing to note.`,
    r => `${r} looks normal. There is a moment at the gate — a guard glancing at another guard after you answer a question — that is probably nothing.`,
    r => `${r} is functioning well. Clean streets, busy market, maintained walls. If you were looking for problems, you would not find them from the outside.`,
  ],
  plague_onset: [
    r => `The approach to ${r} is interrupted by a checkpoint a quarter mile from the gates — a temporary structure, manned by people wearing cloth over their faces. They want to know where you came from and when.`,
    r => `${r}'s gate is open, the market is running, and there are people in the street. People are giving each other slightly more space than usual. A cart passes with barrels marked with an unfamiliar symbol — you have seen that symbol once before, on a quarantine notice.`,
    r => `Near the gate of ${r} there is a temporary shelter — a healer's station, by the look of it, with two attendants and a queue. The queue is not yet long. That is either good or early.`,
    r => `Some of ${r}'s market stalls are closed. Not all, not most — but several, in a pattern that isn't about the day of the week. The ones that are open are busy; the ones that are closed have been for a while.`,
  ],
  succession_void: [
    r => `There are two sets of pennants above ${r}'s main gate — different colours, same height. Someone made a decision to hang them both and has committed to maintaining the ambiguity.`,
    r => `${r} has the specific quality of a settlement waiting for news. People are going about their business, but there is a particular alertness to the street — people checking who is talking to whom.`,
    r => `The road into ${r} has been busy recently. You can tell by the wheel ruts, the quality of the mud, the number of horses at the inn you pass on the approach. Something is happening that requires people to arrive quickly.`,
    r => `${r} functions, after a fashion. The market is open, the gates are attended. The flagpole above the council building is empty. Someone removed the standard and hasn't replaced it yet.`,
  ],
  monster_pressure: [
    r => `${r} is more fortified than its size suggests. The walls are new — or newly repaired, the mortar still pale. There are more torches at the gate than a settlement like this would normally need.`,
    r => `The farms outside ${r} are partially abandoned. You count three sets of buildings that have not been worked recently — the fields untended, the doors standing open. The settlement's wall is a quarter mile closer than it would have been three months ago.`,
    r => `${r}'s gate is attended by its usual guards and, less usually, by several people in road-worn equipment who are clearly not local and clearly not merchants. The settlement is paying for help.`,
    r => `${r} is going about its business, but the business includes people you wouldn't normally see on a market day: hunters checking arrows, a blacksmith working past dark, a group of militia running a drill in the square visible from the gate.`,
  ],
};

// ─── genSettSummary ───────────────────────────────────────────────────────────
/**
 * Extract key settlement facts into a structured summary object used by
 * genArrivalDetail, genPressureDetail, and buildPoliticalNarrative.
 */
const genSettSummary = (settlement) => {
  const {
    name, tier, config = {}, economicState = {}, powerStructure = {},
    npcs = [], history = {}, stress, institutions = [],
  } = settlement;

  const stresses     = (stress ? (Array.isArray(stress) ? stress : [stress]) : []).map(s => s.type);
  const primaryStress = stresses.length
    ? ['under_siege','occupied','famine','plague_onset','politically_fractured','recently_betrayed',
       'succession_void','indebted','infiltrated','monster_pressure','insurgency','mass_migration',
       'wartime','religious_conversion','slave_revolt'].find(s => stresses.includes(s)) || stresses[0]
    : null;

  const factions     = powerStructure.factions || [];
  const govFaction   = factions.find(f => f.isGoverning)?.faction ||
    (tier === 'thorp' ? 'the household heads' :
     tier === 'hamlet' || tier === 'village' ? 'the village elders' :
     tier === 'town' ? 'the town council' :
     tier === 'city' ? 'the city council' :
     tier === 'metropolis' ? 'the grand council' : 'the council');
  const topFaction   = factions[0]?.faction || 'the dominant faction';

  const crimFaction  = factions.find(f =>
    f.faction?.toLowerCase().includes('thieves') ||
    f.faction?.toLowerCase().includes('criminal') ||
    (f.faction?.toLowerCase().includes('guild') && f.faction?.toLowerCase().includes('black'))
  )?.faction || null;

  const milFaction   = factions.find(f =>
    f.faction?.toLowerCase().includes('military') ||
    f.faction?.toLowerCase().includes('guard') ||
    f.faction?.toLowerCase().includes('war council')
  )?.faction || null;

  const relFaction   = factions.find(f =>
    f.faction?.toLowerCase().includes('religious') ||
    f.faction?.toLowerCase().includes('church') ||
    f.faction?.toLowerCase().includes('quarantine')
  )?.faction || null;

  // Primary commodity
  const commodity = (() => {
    const exp = economicState?.primaryExports?.[0] || '';
    for (const [kw, label] of [['grain','grain'],['wheat','grain'],['fish','fish'],['iron','iron'],
        ['timber','timber'],['salt','salt'],['stone','stone'],['wool','wool'],['silk','silk'],
        ['spice','spice'],['herb','medicinal herbs'],['ale','ale']]) {
      if (exp.toLowerCase().includes(kw)) return label;
    }
    return exp.split(' ')[0].toLowerCase() || 'trade goods';
  })();

  return {
    name, tier,
    stressType:   primaryStress,
    stressTypes:  stresses,
    commodity,
    prosperity:   economicState.prosperity || 'Moderate',
    stability:    powerStructure.stability || 'Stable',
    govFaction,
    topFaction,
    crimFaction,
    milFaction,
    relFaction,
    age:          history.age || 100,
    access:       config.tradeRouteAccess || 'road',
    npcNames:     npcs.slice(0, 6).map(n => ({ name: n.name, role: n.role })),
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
export const genArrivalDetail = (config, economicContext = null) => {
  const route     = config?.tradeRouteAccess || 'road';
  const commodity = economicContext?.tradeCommodity || null;
  const prosperity= economicContext?.prosperity || 'Moderate';
  const stresses  = (config?.stressTypes?.length)
    ? config.stressTypes
    : config?.stressType ? [config.stressType] : [];
  const primaryStress = stresses.length
    ? ['under_siege','occupied','famine','plague_onset','politically_fractured','recently_betrayed',
       'succession_void','indebted','infiltrated','monster_pressure','insurgency','mass_migration',
       'wartime','religious_conversion','slave_revolt'].find(s => stresses.includes(s)) || stresses[0]
    : null;

  const tier = config?.tier || config?.settType || 'town';

  // Terrain narrative hooks (why the settlement is here)
  let reasonPool = TERRAIN_NARRATIVE_HOOKS[route] || TERRAIN_NARRATIVE_HOOKS.isolated;

  // Add commodity-specific reasons
  if (commodity) {
    const COMMODITY_HOOKS = {
      timber:    ['grew from a single logging operation whose owner refused to leave when the contract ended', 'was founded when foresters discovered that the surrounding woodland was three times richer than the maps showed'],
      grain:     ['began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield', 'was established on farmland that three generations of the same family refused to sell, and eventually others settled around them'],
      fish:      ['started as a seasonal camp for deep-water fishers who stopped bothering to go home between seasons', "grew around a natural harbour that fish seemed to prefer — nobody knows why, and nobody questions it"],
      iron:      ["was founded the week someone hit iron three feet below the surface and word reached the nearest city", 'grew around a smithing operation that discovered the local ore was unusually pure and refused to share the location'],
      stone:     ["began when quarry workers sent to extract stone for a distant cathedral decided the site was worth keeping for themselves", "was established because the local stone cuts cleanly and doesn't crack in frost — a property worth more than it sounds"],
      gems:      ["was founded the day a shepherd's child found a stone in a streambed that turned out to be worth more than the flock", "grew from a prospectors' camp into something permanent when the gems didn't run out as quickly as expected"],
      wool:      ['began when a merchant realised the local sheep produced finer wool than anything available on the open market', "grew around a sheep run whose owner had the rare good sense to also build a mill and a market"],
      livestock: ['developed where two droving roads crossed, because animals needed water and drovers needed ale', 'began as a seasonal gathering point for cattle traders that became permanent when someone built an inn'],
      salt:      ["was established to control a salt deposit that the local lord considered more valuable than the surrounding farmland combined", "grew around salt workings that made everything they touched last longer — including the settlement itself"],
      alchemy:   ["attracted practitioners seeking ingredients found nowhere else within three days' travel", 'began when a wandering alchemist settled here specifically because of what grows along the river margins'],
      crafts:    ['was founded when a group of skilled artisans pooled resources to build a permanent workshop district away from guild restrictions', 'grew because the local clay and water made the finest ceramic work in the region — a reputation that preceded the settlement\'s name'],
    };
    const commodityHooks = COMMODITY_HOOKS[commodity] || [];
    if (commodityHooks.length) reasonPool = [...reasonPool, ...commodityHooks];
  }

  // Who founded the settlement
  const FOUNDERS_BY_TIER = {
    thorp:      ['a single extended family who came and never left', 'a pair of siblings who disagreed about which direction to keep walking', 'a discharged soldier who liked the view and had nowhere better to be', 'a healer who stopped to treat a traveller and found the location too useful to leave'],
    hamlet:     ['three or four families who agreed to try wintering together and never stopped', 'a miller who built a mill and found customers before they found customers', 'a retired tradesperson whose skills attracted dependents', 'a small religious community whose members drifted into secular life over two generations'],
    village:    ['a group of settlers seeking new opportunities', 'refugees fleeing war or persecution who found the location defensible', 'a noble granted lands by the crown and obligated to populate them', 'escaped serfs seeking a place beyond the reach of their former masters', 'a community of tradespeople who left a larger settlement under contested circumstances'],
    town:       ["merchants recognising economic potential before anyone else did", 'a noble granted lands by the crown with the resources to develop them', 'military veterans given land grants who brought their skills with them', 'a merchant consortium that needed a waypoint and decided to own it', 'religious authorities who wanted a centre for their regional operations'],
    city:       ['a powerful noble house that needed a commercial base independent of rivals', 'a merchant coalition that grew too large for the town they started in', 'a military command that built fortifications and found civilians followed', 'royal decree and a century of forced investment'],
    metropolis: ['imperial decree and the systematic forced relocation of skilled populations', 'a dynastic decision that this crossroads would anchor the realm', 'the slow accretion of three smaller settlements that eventually merged under a single administration', 'a great trade house that outgrew every other settlement in the region'],
  };

  // Initial challenges
  const CHALLENGES_BY_ROUTE = {
    port:      ['storms that destroyed the first harbour', 'piracy and coastal raids', 'disease from sailors', 'disputes over docking rights'],
    river:     ['seasonal flooding that destroyed early buildings', 'disputes over water rights', 'navigation hazards upriver', 'river bandits'],
    crossroads:['rival claimants to the toll rights', 'competition from nearby markets', 'bandit activity on all four roads', 'political pressure from surrounding lords'],
    road:      ['hostile local inhabitants', 'rival claimants to the land', 'harassment by a nearby lord', 'poor early harvests'],
    isolated:  ['harsh environmental conditions', 'lack of outside resources', 'dangerous wildlife in the surrounding terrain', 'disease and hardship in the early winters'],
  };

  // How it was overcome
  const OVERCOMING_BY_PROSPERITY = {
    Wealthy:    ['through ruthless commercial efficiency', 'by securing an exclusive charter before competitors could react', 'by outlasting every rival'],
    Prosperous: ['through sustained effort and reliable governance', 'by attracting the right people at the right time', 'through good fortune and good decisions in roughly equal measure'],
    Moderate:   ['through determination and cooperation', 'by making enough right decisions to survive the wrong ones', 'with help from external allies at a critical moment'],
    Poor:       ['at significant cost', 'though the founding was harder than anyone admitted at the time', 'by giving up more than the founders intended'],
  };

  // Stress context note
  const STRESS_NOTES = {
    under_siege:          "What the founders built is now being tested by forces they could not have anticipated. The original reasons for settling here have become irrelevant to immediate survival.",
    famine:               "The settlers who chose this land did so because it seemed fertile and promising. The current harvest failures would be unrecognisable to them.",
    occupied:             "The original settlement was founded with a degree of independence that no longer exists. The current administration answers to outside authority.",
    politically_fractured:"The settlement was founded by people who agreed on its purpose. That consensus no longer exists.",
    indebted:             "The original settlers built something valuable. Their descendants have borrowed against it until the debt outweighs the asset.",
    recently_betrayed:    "The founding required trust among a small group of people. That trust has recently been violated in a way that echoes the founding's original fragility.",
    infiltrated:          "The settlement was founded by people who knew each other. Somewhere in the current population, that familiarity is being exploited.",
    plague_onset:         "The settlers chose this location for its resources and access. Disease does not respect those original calculations.",
    succession_void:      "The founding generation is gone. What remains is contested — in ways the founders did not anticipate and did not plan for.",
    monster_pressure:     "The founding required pushing into terrain that was not entirely safe. That calculation is being revisited.",
  };

  return {
    age:              null,  // filled in by historyGenerator
    reason:           pick(reasonPool),
    foundedBy:        pick(FOUNDERS_BY_TIER[tier] || FOUNDERS_BY_TIER.village),
    initialChallenge: pick(CHALLENGES_BY_ROUTE[route] || CHALLENGES_BY_ROUTE.road),
    overcoming:       pick(OVERCOMING_BY_PROSPERITY[prosperity] || OVERCOMING_BY_PROSPERITY.Moderate),
    stressNote:       primaryStress ? (STRESS_NOTES[primaryStress] || null) : null,
  };
};

// ─── genPressureDetail ────────────────────────────────────────────────────────
/**
 * Build the structured pressure context object used by generatePressureSentence.
 */
const genPressureDetail = (settlement) => {
  const {
    tier, institutions = [], economicState = {}, powerStructure = {},
    npcs = [], history = {}, stress, config = {}, name,
    neighborRelationship, economicViability,
  } = settlement;

  const instNames   = (institutions || []).map(i => (i.name || '').toLowerCase());
  const hasInst     = (kw) => instNames.some(n => n.includes(kw));

  const stresses    = (stress ? (Array.isArray(stress) ? stress : [stress]) : []).map(s => s.type);
  const primaryStress = stresses.length
    ? ['under_siege','occupied','famine','plague_onset','politically_fractured','recently_betrayed',
       'succession_void','indebted','infiltrated','monster_pressure','insurgency','mass_migration',
       'wartime','religious_conversion','slave_revolt'].find(s => stresses.includes(s)) || stresses[0]
    : null;

  const commodity = (() => {
    const exp = economicState?.primaryExports?.[0] || '';
    for (const [kw, label] of [['grain','grain'],['fish','fish'],['iron','iron'],
        ['timber','timber'],['salt','salt'],['stone','stone'],['wool','wool']]) {
      if (exp.toLowerCase().includes(kw)) return label;
    }
    return exp.split(' ')[0].toLowerCase() || null;
  })();

  const factions    = powerStructure?.factions || [];
  const govFaction  = factions.find(f => f.isGoverning)?.faction ||
    (tier === 'thorp' ? 'the household heads' :
     ['hamlet','village'].includes(tier) ? 'the village elders' :
     tier === 'town' ? 'the town council' :
     tier === 'city' ? 'the city council' :
     tier === 'metropolis' ? 'the grand council' : 'the council');
  const topFaction  = factions[0]?.faction || null;

  const milForce =
    hasInst('garrison')          ? 'the garrison'          :
    hasInst('barracks')          ? 'the barracks guard'    :
    hasInst('professional guard')? 'the professional guard':
    hasInst('city watch') || hasInst('town watch') ? 'the watch' :
    hasInst('militia')           ? 'the militia'           :
    hasInst('mercenary')         ? 'the mercenary company' :
    ['thorp','hamlet','village'].includes(tier) ? 'the able-bodied' : 'the guard';

  const healerRef =
    hasInst('hospital')                      ? 'the hospital staff'     :
    hasInst('monastery') || hasInst('friary')? 'the monastery brothers' :
    hasInst('healer')                        ? 'the healers'            :
    hasInst('church') || hasInst('cathedral') || hasInst('parish') ? 'the clergy' :
    ['thorp','hamlet'].includes(tier)        ? 'the local herbalist'    :
                                               'the healers';

  return {
    name,
    tier,
    stressType:   primaryStress,
    milForce,
    healersRef:   healerRef,
    stresses:     stresses.map(type => ({ type })),
    commodity,
    prosperity:   economicState?.prosperity || 'Moderate',
    govFaction,
    topFaction:   topFaction || govFaction,
    stability:    powerStructure?.stability || 'Stable',
    recentConflict: powerStructure?.recentConflict || null,
    topNPC:       npcs?.[0] || null,
    topNPCRole:   npcs?.[0]?.role || null,
    topNPCName:   npcs?.[0]?.name || null,
    viabilityIssues: economicViability?.issues || [],
    isViable:     economicViability?.viable !== false,
    topTension:   (history?.currentTensions || [])[0]?.type || null,
    access:       config?.tradeRouteAccess || 'road',
    threat:       config?.monsterThreat || 'frontier',
    neighbor:     neighborRelationship?.neighborName || null,
    neighborType: neighborRelationship?.relationshipType || null,
    hasNeighborConflict: neighborRelationship?.relationshipType?.toLowerCase().includes('hostile') ||
                         neighborRelationship?.relationshipType?.toLowerCase().includes('rival'),
    isPort:       config?.tradeRouteAccess === 'port',
    isCrossroads: config?.tradeRouteAccess === 'crossroads',
    isIsolated:   config?.tradeRouteAccess === 'isolated',
  };
};

// ─── genCoherence ─────────────────────────────────────────────────────────────
/**
 * Generate cross-tab contradiction notes (shown in the Viability/Overview tab).
 * Flags contradictions between power structure, economics, stress, and history.
 */
const genCoherence = (settlement) => {
  const notes = [];
  const { powerStructure, economicState, config, institutions, history } = settlement;
  if (!powerStructure || !economicState) return notes;

  const factions = powerStructure.factions || [];
  const stresses = config?.stressTypes || [];

  const crimeFaction = factions.find(f =>
    f.faction?.toLowerCase().includes('thieve') ||
    f.faction?.toLowerCase().includes('criminal') ||
    f.faction?.toLowerCase().includes('underworld'));
  const govFaction = factions.find(f => f.isGoverning);

  // Criminal faction in a trade hub controls shadow flows
  if (crimeFaction && crimeFaction.power > 20 && economicState.isEntrepot) {
    notes.push({
      type: 'power_economic', severity: 'notable', tab: 'economics',
      note: `${crimeFaction.faction} holds ${crimeFaction.power}% of power in this transit hub. A portion of import/export flow is likely controlled outside official channels. Stated trade figures may not reflect actual volumes.`,
    });
  }

  // Siege contradicts trade income
  if (stresses.includes('under_siege') &&
      economicState.incomeSources?.some(s => s.source?.toLowerCase().includes('trade'))) {
    notes.push({
      type: 'stress_economic', severity: 'contradiction', tab: 'economics',
      note: 'Settlement is under active siege. Trade income above reflects pre-siege operations. Current effective trade is likely zero or severely restricted.',
    });
  }

  // Occupation contradicts stable governance
  if (stresses.includes('occupied') && powerStructure.stability &&
      !powerStructure.stability.toLowerCase().includes('occupation') &&
      !powerStructure.stability.toLowerCase().includes('suppress')) {
    notes.push({
      type: 'power_stress', severity: 'notable', tab: 'power',
      note: 'Settlement is under occupation. Stated stability reflects surface conditions only. Governance legitimacy and local loyalty are separate from what the occupier presents.',
    });
  }

  // Church controls economy but formal governance is secular
  const churchControlsEcon = economicState.situationDesc?.toLowerCase().includes('church controls');
  const govIsSecular = govFaction &&
    !govFaction.faction.toLowerCase().includes('church') &&
    !govFaction.faction.toLowerCase().includes('temple') &&
    !govFaction.faction.toLowerCase().includes('clergy') &&
    !govFaction.faction.toLowerCase().includes('order');
  if (churchControlsEcon && govIsSecular) {
    notes.push({
      type: 'power_economic', severity: 'notable', tab: 'power',
      note: `Economic activity flows through religious institutions, but formal governance rests with ${govFaction.faction}. Whoever controls trade and tithes holds more practical power than whoever holds the official seat.`,
    });
  }

  // Powerful criminal faction in prosperous settlement
  if (crimeFaction && crimeFaction.power > 35 &&
      ['Prosperous','Wealthy','Thriving'].includes(economicState.prosperity)) {
    notes.push({
      type: 'power_economic', severity: 'notable', tab: 'overview',
      note: `${crimeFaction.faction} controls ${crimeFaction.power}% of power here. Stated prosperity reflects gross output — a meaningful share flows outside official taxation.`,
    });
  }

  // Recovery narrative: collapse long ago followed by recent boom
  if (history?.historicalEvents) {
    const events = history.historicalEvents;
    const hadCollapse = events.some(e =>
      (e.name?.includes('Collapse') || e.name?.includes('Famine')) && e.yearsAgo > 80);
    const hadBoom = events.some(e =>
      (e.name?.includes('Boom') || e.name?.includes('Trade Route Opened')) && e.yearsAgo < 60);
    if (hadCollapse && hadBoom) {
      notes.push({
        type: 'historical_economic', severity: 'context', tab: 'history',
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
const getSettReason = (safetyLabel, monsterThreat, hasStress) => {
  if (hasStress) return null;
  const label = (safetyLabel || '').toLowerCase();

  if (label.includes('authoritarian') || label.includes('enforced')) {
    return pickRandom(['The settlement is orderly in a way that requires maintenance.', 'The guard presence is higher than the threat level requires.']);
  }
  if (label.includes('criminal') || label.includes('corrupt')) {
    return pickRandom(['The market stalls near the gate are attended by people who seem more interested in watching the street than selling.', 'Commerce is active. Some of it is the kind that doesn\'t invite close attention.']);
  }
  if (label.includes('tense') || label.includes('unstable')) {
    return pickRandom(['Something is not quite right about the street, though it takes a moment to identify what.', 'The settlement is going about its business, but with a particular awareness of itself.']);
  }
  if (label.includes('military') || label.includes('ordered')) {
    return pickRandom(['The settlement has a military discipline to it — not oppressive, but structured.', 'The guards are well-turned-out. Someone takes their job seriously.']);
  }
  return pickRandom(
    monsterThreat === 'plagued'
      ? ['The settlement is armed in ways that a casual visitor might not notice immediately but can\'t stop noticing once they do.', 'The torches at the gate burn in the middle of the day.']
      : ['It is, as far as you can tell, a normal day here.', 'The settlement is going about its business.', null]
  );
};

// ─── buildPoliticalNarrative ──────────────────────────────────────────────────
/**
 * Enrich an NPC object with faction affiliation, secret motivation overlay,
 * and stress-specific goal modifications.
 */
const buildPoliticalNarrative = (npc, index, summary, allNpcs) => {
  const crimeLevel = generateCrimeLevel(npc, index, summary, allNpcs);
  const secret     = crimeLevel || npc.secret;
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
 * @param {Object} config
 * @returns {string[]} Array of reason strings (shown as bullet list)
 */
export const generateSettlementReason = (tier, route, neighbor, config = {}) => {
  const lines    = [];
  const routeHooks = TERRAIN_NARRATIVE_HOOKS[route] || TERRAIN_NARRATIVE_HOOKS.isolated;

  // Primary settlement reason
  let reason = '';
  if (route === 'crossroads') {
    reason = 'Positioned at a major crossroads — trade flows through here by geography, not by choice.';
  } else if (route === 'port') {
    reason = 'A coastal settlement whose existence is inseparable from the sea.';
  } else if (route === 'river') {
    reason = 'Built along the river — water access shapes every economic decision.';
  } else if (route === 'isolated') {
    reason = 'Isolated from major trade routes. Self-sufficiency is not an aspiration here; it is a constraint.';
  } else {
    reason = 'Established along a road route — trade flows in, goods flow out, people pass through.';
  }
  lines.push(reason);

  // Tier-specific context
  if (tier === 'metropolis') {
    lines.push('At this scale, the settlement no longer serves a single economic function — it IS the economic function for its region.');
  } else if (tier === 'city') {
    lines.push('Large enough to produce what it consumes and consume what it produces. External trade amplifies rather than sustains.');
  } else if (['thorp','hamlet'].includes(tier)) {
    lines.push('Small enough that every household knows its purpose. Surplus, if any, is modest.');
  }

  return lines;
};

// ─── generatePressureSentence ─────────────────────────────────────────────────
/**
 * Generate a short, vivid one-liner describing the settlement's current
 * political/social pressure. Used in the Overview tab header.
 */
export const generatePressureSentence = (settlement) => {
  if (!settlement) return null;
  const detail = genPressureDetail(settlement);
  const summary = genSettSummary(settlement);

  // Stress → pressure sentence
  // PRESSURE_SENTENCES entries may be functions (r => [...]) or plain arrays.
  // Call the function first to resolve the template array, then pick from it.
  const stressType = detail.stressType;
  if (stressType && PRESSURE_SENTENCES[stressType]) {
    const raw       = PRESSURE_SENTENCES[stressType];
    const templates = typeof raw === 'function' ? raw(detail) : raw;
    if (Array.isArray(templates) && templates.length) {
      const template = pickRandom2(templates);
      return typeof template === 'function' ? template(detail) : template;
    }
  }

  // Succession narrative
  if (summary.stability?.includes('Unstable') || summary.stability?.includes('Fractured')) {
    const succNarr = genSuccessionNarr(summary);
    if (succNarr?.length) return succNarr[0];
  }

  // Relationship narrative
  const relNarr = genRelNarrative(settlement);
  if (relNarr?.phrasing) return relNarr.phrasing;

  // Fallback: generic pressure
  if (detail.recentConflict) return detail.recentConflict;

  // Thorp/hamlet fallback — even stable small settlements have subsistence-level tensions
  if (['thorp','hamlet'].includes(detail.tier || '')) {
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
 * Generate the arrival scene text shown at the top of the Overview tab.
 * Combines a stress-specific vignette (or generic arrival) with an
 * architectural detail and landmark description.
 */
export const generateArrivalScene = (settlement) => {
  if (!settlement) return null;

  const {
    name, tier, config = {}, institutions = [],
    stress, economicState = {},
  } = settlement;

  const stresses    = (stress ? (Array.isArray(stress) ? stress : [stress]) : []).map(s => s.type);
  const primaryStress = stresses.length
    ? ['under_siege','occupied','famine','plague_onset','politically_fractured','recently_betrayed',
       'succession_void','indebted','infiltrated','monster_pressure','insurgency','mass_migration',
       'wartime','religious_conversion','slave_revolt'].find(s => stresses.includes(s)) || stresses[0]
    : null;

  const culture       = config.culture || 'germanic';
  const magicPriority = config.priorityMagic ?? 50;
  const route         = config.tradeRouteAccess || 'road';

  // Try stress-specific vignette first
  let openingLine = null;
  if (primaryStress && STRESS_DESCS[primaryStress]) {
    openingLine = pickRandom2(STRESS_DESCS[primaryStress])(name);
  } else if (ARRIVAL_SCENES[route]) {
    // Generic route-based arrival
    const template = pickRandom2(ARRIVAL_SCENES[route]);
    openingLine    = typeof template === 'function' ? template(name, tier) : template;
  } else {
    openingLine = `${name} comes into view.`;
  }

  // Culture-specific architectural detail
  const architecturalNote = buildTradeNarrative(tier, culture, magicPriority);

  // Landmark from institution presence
  const landmarkNote = checkInstCompat(institutions, tier, magicPriority);

  // Addon (trade commodity note, prosperity note, etc.)
  let addon = null;
  if (ARRIVAL_ADDONS && economicState.tradeCommodity) {
    const addonPool = ARRIVAL_ADDONS[economicState.tradeCommodity];
    if (addonPool?.length) addon = pickRandom2(addonPool)(name);
  }

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
export const generateCoherence = (settlement) => {
  if (!settlement) return settlement;

  const summary = genSettSummary(settlement);
  const npcs    = settlement.npcs || [];

  // Enrich each NPC with faction/secret overlays
  const enrichedNpcs = npcs.map((npc, idx) => buildPoliticalNarrative(npc, idx, summary, npcs));

  // Merge NPC list with faction structure for display
  const rawMergedNpcs = mergeNPCLists(
    enrichedNpcs,
    settlement.powerStructure?.factions || [],
    settlement.institutions || [],
    settlement.tier,
    settlement.config || {},
  );

  // Enrich top NPCs with structural position, goal, and constraint
  // derived from the live settlement state (legitimacy, capture state, food, prosperity)
  const mergedNpcs = enrichNPCsWithStructure(rawMergedNpcs, settlement);

  const history = settlement.history || {};

  // Historical character string
  const historicalCharacter = buildStressProfile(
    history.historicalEvents || [],
    settlement.tier,
    settlement.config,
  );

  // Prominent relationship narrative
  const prominentRelationship = genRelNarrative(settlement);

  // Coherence contradiction notes
  const coherenceNotes = genCoherence(settlement);

  // Siege narrative (separate from currentTensions array)
  const siegeNarrative = generateSiegeCapability(
    history.historicalEvents || [],
    history.currentTensions || [],
    history.age || 100,
  );
  // Only use siege narrative if it's a string (not the original array pass-through)
  const siegeNarrativeStr = typeof siegeNarrative === 'string' ? siegeNarrative : null;

  return {
    ...settlement,
    npcs: mergedNpcs,
    prominentRelationship,
    coherenceNotes,
    history: {
      ...history,
      historicalCharacter,
      currentTensions: history.currentTensions || [],  // always keep as array
      siegeNarrative: siegeNarrativeStr,
    },
  };
};
