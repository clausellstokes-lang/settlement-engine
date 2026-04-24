/**
 * historyGenerator.js
 * Settlement history, historical event generation, and founding narrative.
 *
 * Bugs fixed vs minified original:
 *  - getHistoryTemplate was defined but never returned its value (dead function)
 *  - CONFLICT_TYPES was referenced but undefined; getSettlementAgeData always returned null silently
 *  - local popToTier shadowed imported popToTier with a different (multiplier) function; renamed to priorityMult
 *  - pickRandom2/random01 were local re-implementations; now imported from helpers
 */

import { POLITICAL_FLAVOR } from '../data/narrativeData.js';
import { getInstFlags, getStressFlags, pick, pickRandom2, random01, randInt } from './helpers.js';
import { random as _rng } from './rngContext.js';

import { genArrivalDetail } from './narrativeGenerator.js';
import { AGE_BY_TIER, HISTORICAL_EVENTS_DATA, EVENT_TYPE_NAMES } from '../data/historyData.js';

// ─── priorityMult ─────────────────────────────────────────────────────────────
// Convert a 0–100 priority/influence score to a 0–2 multiplier centred at 1.
// (Named distinctly to avoid confusion with helpers.popToTier which maps population → tier string.)

const priorityMult = (score = 50) => Math.max(0, (score ?? 50) / 50);

/**
 * Return a randomised settlement age in years appropriate for its tier.
 * @param {string} tier
 * @returns {number}
 */
const getSettlementAge = tier => {
  const range = AGE_BY_TIER[tier] || AGE_BY_TIER.town;
  return randInt(range.min, range.max);
};

// ─── HISTORICAL_EVENTS_DATA ───────────────────────────────────────────────────

// ─── getSettlementHistoryNote ─────────────────────────────────────────────────
/**
 * Return a one-sentence historical character description based on the pattern
 * of event types in the settlement's historical record.
 *
 * @param {Array}  events  - Historical event objects with .type and .severity
 * @param {string} tier    - Settlement tier
 * @param {Object} config  - Settlement config
 * @returns {string}
 */
const getSettlementHistoryNote = (events, tier, config) => {
  if (!events || events.length === 0) return 'recently established and still finding its character';

  const disasters = events.filter(e => e.type === 'disaster').length;
  const political = events.filter(e => e.type === 'political').length;
  const economic = events.filter(e => e.type === 'economic').length;
  const religious = events.filter(e => e.type === 'religious').length;
  const magical = events.filter(e => e.type === 'magical').length;
  const catastrophic = events.some(e => e.severity === 'catastrophic');

  // Small chance to use a stable/generic description regardless
  if (random01(0.15)) return pickRandom2(POLITICAL_FLAVOR.stable)(events);

  // Choose the dominant narrative pattern
  let pattern;
  if (catastrophic) pattern = 'catastrophic';
  else if (political >= 2) pattern = 'political_heavy';
  else if (disasters >= 2) pattern = 'disaster_heavy';
  else if (economic >= 2) pattern = 'economic_heavy';
  else if (religious >= 1 && random01(0.6)) pattern = 'religious_heavy';
  else if (magical >= 1 && random01(0.5)) pattern = 'magical_heavy';
  else if (events.length >= 4 && random01(0.65)) pattern = 'layered_history';
  else pattern = 'stable';

  // Map pattern to relevant event subset
  const eventSubsets = {
    political_heavy: events.filter(e => e.type === 'political'),
    disaster_heavy: events.filter(e => e.type === 'disaster'),
    economic_heavy: events.filter(e => e.type === 'economic'),
    religious_heavy: events.filter(e => e.type === 'religious'),
    magical_heavy: events.filter(e => e.type === 'magical'),
    catastrophic: events.filter(e => e.severity === 'catastrophic'),
    stable: events,
    layered_history: events,
  };

  const flavors = POLITICAL_FLAVOR[pattern];
  const subset = eventSubsets[pattern];

  if (!flavors || !subset || subset.length === 0) {
    return pickRandom2(POLITICAL_FLAVOR.stable)(events);
  }

  return pickRandom2(flavors)(subset)
    .replace(/\bthe\s+(the|a|an)\s+/gi, 'the ')
    .replace(/\bthe\s+(The|A|An)\s+/g, 'the ');
};

// ─── buildHistoryContext ──────────────────────────────────────────────────────
/**
 * Extract the context object used by generateTradeNarrative2 and related helpers.
 * Classifies institution presence and economic state into descriptive fields.
 *
 * @param {Object} config        - Settlement config
 * @param {Array}  institutions  - Institution objects
 * @param {Object} economicState - Generated economic state
 * @param {Object} powerStructure- Generated power structure
 * @returns {Object} Context object with named descriptors
 */
const buildHistoryContext = (config, institutions = [], economicState = null, powerStructure = null) => {
  const { tradeRouteAccess: route = 'road', magicLevel = 'medium', monsterThreat: threat = 'frontier' } = config;

  // Determine primary trade commodity
  const exports = economicState?.primaryExports || [];
  const tradeCommodity = (() => {
    if (!exports.length) return null;
    const first = exports[0].toLowerCase();
    if (first.includes('timber') || first.includes('lumber') || first.includes('wood')) return 'timber';
    if (first.includes('grain') || first.includes('wheat') || first.includes('rye')) return 'grain';
    if (first.includes('fish') || first.includes('seafood')) return 'fish';
    if (first.includes('wool') || first.includes('textile') || first.includes('cloth')) return 'wool';
    if (first.includes('iron') || first.includes('metal') || first.includes('steel')) return 'iron';
    if (first.includes('stone') || first.includes('marble') || first.includes('quarry')) return 'stone';
    if (first.includes('gem') || first.includes('jewel') || first.includes('crystal')) return 'gems';
    if (first.includes('potion') || first.includes('alchemical') || first.includes('reagent')) return 'alchemy';
    if (first.includes('craft') || first.includes('tool') || first.includes('manufactured')) return 'crafts';
    if (first.includes('livestock') || first.includes('cattle') || first.includes('sheep')) return 'livestock';
    if (first.includes('salt')) return 'salt';
    if (first.includes('spice') || first.includes('exotic')) return 'spices';
    return null;
  })();

  // Determine dominant guild
  const guildInsts = institutions.filter(i => {
    const n = (i.name || '').toLowerCase();
    return n.includes('guild') || (i.tags || []).includes('guild');
  });
  const dominantGuild = (() => {
    if (!guildInsts.length) return "Merchants'";
    const n = guildInsts[0].name;
    if (n.toLowerCase().includes('weav') || n.toLowerCase().includes('text')) return "Weavers'";
    if (n.toLowerCase().includes('smith') || n.toLowerCase().includes('iron')) return "Smiths'";
    if (n.toLowerCase().includes('merchant')) return "Merchants'";
    if (n.toLowerCase().includes('mason') || n.toLowerCase().includes('stone')) return "Masons'";
    if (n.toLowerCase().includes('timber') || n.toLowerCase().includes('wood')) return "Timber Workers'";
    if (n.toLowerCase().includes('fisher')) return "Fishers'";
    return "Crafters'";
  })();

  // Power structure context
  const dominantFaction = powerStructure?.factions?.[0]?.faction || 'the governing council';
  const stability = powerStructure?.stability || 'Stable';
  const recentConflict = powerStructure?.recentConflict || null;

  // Gov type classification
  const govInst = institutions.find(i => i.category === 'Government');
  const govType = (() => {
    if (!govInst) return 'council';
    const n = govInst.name.toLowerCase();
    if (n.includes('noble') || n.includes('lord')) return 'noble';
    if (n.includes('guild') || n.includes('merchant')) return 'merchant_guild';
    if (n.includes('mayor') || n.includes('council')) return 'council';
    if (n.includes('royal') || n.includes('king')) return 'crown';
    if (n.includes('democratic')) return 'democratic';
    return 'council';
  })();

  // Religious infrastructure
  const relInsts = institutions.filter(
    i => i.category === 'Religious' || (i.tags || []).includes('religious') || (i.tags || []).includes('church'),
  );
  const hasChurch = relInsts.some(
    i => (i.name || '').toLowerCase().includes('church') || (i.name || '').toLowerCase().includes('parish'),
  );
  const hasCathedral = relInsts.some(i => (i.name || '').toLowerCase().includes('cathedral'));
  const hasMonastery = relInsts.some(
    i => (i.name || '').toLowerCase().includes('monastery') || (i.name || '').toLowerCase().includes('friary'),
  );
  const religiousScale = hasCathedral ? 'cathedral' : hasMonastery ? 'monastery' : hasChurch ? 'church' : 'shrine';

  // Defense infrastructure
  const defInsts = institutions.filter(i => i.category === 'Defense' || (i.tags || []).includes('defense'));
  const hasWalls = defInsts.some(i => (i.name || '').toLowerCase().includes('wall'));
  const hasCitadel = defInsts.some(i => (i.name || '').toLowerCase().includes('citadel'));
  const hasGarrison = defInsts.some(
    i => (i.name || '').toLowerCase().includes('garrison') || (i.name || '').toLowerCase().includes('barracks'),
  );

  // Disaster profile
  const disasterProfile =
    route === 'port'
      ? 'coastal'
      : route === 'river'
        ? 'river'
        : tradeCommodity === 'timber'
          ? 'forest'
          : threat === 'plagued'
            ? 'monster'
            : 'general';

  // Magic infrastructure
  const magicInsts = institutions.filter(i => i.category === 'Magic' || (i.tags || []).includes('arcane'));
  const hasTower = magicInsts.some(
    i => (i.name || '').toLowerCase().includes('tower') || (i.name || '').toLowerCase().includes('wizard'),
  );
  const hasGuildMag = magicInsts.some(
    i => (i.name || '').toLowerCase().includes('mages') || (i.name || '').toLowerCase().includes('academy'),
  );

  return {
    tradeRouteAccess: route,
    magicLevel,
    monsterThreat: threat || 'frontier',
    primaryExports: exports,
    incomeSources: (economicState?.incomeSources || []).map(s => s.source),
    prosperity: economicState?.prosperity || 'Modest',
    tradeCommodity,
    dominantGuild,
    dominantFaction,
    stability,
    recentConflict,
    govType,
    religiousScale,
    hasChurch,
    hasCathedral,
    hasMonastery,
    hasWalls,
    hasCitadel,
    hasGarrison,
    disasterProfile,
    magicInsts,
    hasTower,
    hasGuildMag,
  };
};

// ─── generateSafetyNarrative2 ────────────────────────────────────────────────
// Compute a weighted probability map over history event types based on the
// settlement's current state. Used to drive the historical event type distribution.

const generateSafetyNarrative2 = (config = {}, institutions = []) => {
  const flags = getInstFlags(config, institutions);
  const stress = getStressFlags(config, institutions);
  const threat = config.monsterThreat || 'frontier';

  // Threat multiplier for disaster events
  const threatMult = threat === 'plagued' ? 1.6 : threat === 'heartland' ? 0.6 : 1;

  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];

  // Base weights by event category
  const weights = {
    economic: 1.3 * priorityMult(flags.economyOutput),
    political: 1.2 * (0.5 + 0.5 * priorityMult(Math.max(flags.militaryEffective, flags.criminalEffective))),
    disaster: 1.0 * (0.6 + 0.4 * priorityMult(flags.militaryEffective)) * (stress.stateCrime ? 1.4 : 1) * threatMult,
    religious: 1.0 * priorityMult(flags.religionInfluence) * (stress.crusaderSynthesis ? 1.5 : 1),
    magical: 0.8 * priorityMult(flags.magicInfluence) * (stress.heresySuppression ? 0.4 : 1),
    occupation_infiltration: 0.7,
    exile_return: 0.6,
    demographic: 0.6,
  };

  // Stress-specific boosts
  const STRESS_BOOSTS = {
    under_siege: { disaster: 2.5, political: 1.5 },
    famine: { disaster: 2.0, economic: 1.8 },
    occupied: { occupation_infiltration: 3.0, political: 2.0 },
    politically_fractured: { political: 2.5, exile_return: 1.5 },
    indebted: { economic: 2.5, political: 1.3 },
    recently_betrayed: { political: 2.5, occupation_infiltration: 1.8 },
    infiltrated: { occupation_infiltration: 3.0, political: 1.5 },
    plague_onset: { disaster: 2.5, religious: 1.5 },
    succession_void: { political: 3.0, exile_return: 2.0 },
    monster_pressure: { disaster: 2.0, political: 1.3 },
  };

  stresses.forEach(stressType => {
    const boosts = STRESS_BOOSTS[stressType] || {};
    Object.entries(boosts).forEach(([category, mult]) => {
      if (weights[category] !== undefined) weights[category] *= mult;
    });
  });

  return weights;
};

// ─── generateTradeNarrative2 ─────────────────────────────────────────────────
/**
 * Return a context object of named template variables for a specific history
 * event category (economic, political, disaster, religious, magical).
 */
const generateTradeNarrative2 = (category, context) => {
  const {
    tradeCommodity: commodity,
    dominantGuild,
    primaryExports,
    incomeSources,
    tradeRouteAccess: route,
    prosperity,
    dominantFaction,
    govType,
    religiousScale,
    disasterProfile,
    magicLevel,
    hasTower,
    hasGuildMag,
  } = context;

  const primaryExport = commodity
    ? commodity.charAt(0).toUpperCase() + commodity.slice(1)
    : primaryExports[0] || 'trade goods';

  switch (category) {
    case 'economic': {
      const routeType =
        { port: 'coastal', river: 'river', crossroads: 'overland', road: 'overland', isolated: 'mountain' }[route] ||
        'overland';
      const destination =
        route === 'port'
          ? 'distant maritime ports'
          : route === 'river'
            ? 'upriver markets and capitals'
            : 'the regional capital';
      const demands = incomeSources.some(s => s.toLowerCase().includes('guild'))
        ? 'guild recognition and fair wages'
        : incomeSources.some(s => s.toLowerCase().includes('port'))
          ? 'docking rights and fair tariffs'
          : 'better working conditions';
      return {
        '{resource}': primaryExport.toLowerCase(),
        '{guild_name}': dominantGuild,
        '{route_type}': routeType,
        '{destination}': destination,
        '{demands}': demands,
        '{bank_name}': pick(['Golden Scales', 'Iron Vault', "Merchant's Crown", 'Silver Ledger']),
        '{frequency}': route === 'crossroads' ? 'weekly' : 'seasonal',
      };
    }
    case 'political': {
      const authority =
        {
          noble: 'the regional duke',
          merchant_guild: 'the merchant council',
          crown: 'the king',
          democratic: 'the popular assembly',
          council: 'the council',
        }[govType] || 'the governing authority';
      const method = dominantFaction.toLowerCase().includes('merchant')
        ? 'economic pressure'
        : dominantFaction.toLowerCase().includes('military')
          ? 'armed negotiation'
          : dominantFaction.toLowerCase().includes('guild')
            ? 'guild coalition'
            : 'legal maneuvering';
      const faction = dominantFaction.toLowerCase().includes('merchant')
        ? 'the merchant guilds'
        : dominantFaction.toLowerCase().includes('military')
          ? 'the military garrison'
          : dominantFaction.toLowerCase().includes('noble')
            ? 'the noble families'
            : 'the common people';
      return {
        '{authority}': authority,
        '{method}': method,
        '{faction}': faction,
        '{former_ruler}': pick(['the previous governing family', 'the regional empire', 'the old council']),
        '{family_name}': pick(['Aldermere', 'Greystone', 'Vanthorpe', 'Coldmoor']),
        '{new_family}': pick(['Ironmark', 'Brightwater', 'Stormveil', 'Ashford']),
        '{ally_settlement}': pick(['Westmarch', 'Northgate', 'Riverhold', 'Silverpeak']),
        '{outcome}': context.stability === 'Unstable' ? 'a costly compromise' : 'negotiated settlement',
      };
    }
    case 'disaster': {
      const quarter =
        commodity === 'timber'
          ? 'the lumber yards and sawmill district'
          : route === 'port'
            ? 'the dockside warehouses'
            : route === 'river'
              ? 'the riverside mill quarter'
              : 'the market quarter';
      const buildingType =
        commodity === 'timber'
          ? 'timber stockpiles and workshop buildings'
          : route === 'port'
            ? 'ships, warehouses, and dock infrastructure'
            : 'wooden buildings and merchant stalls';
      return {
        '{quarter}': quarter,
        '{building_type}': buildingType,
        '{location}':
          disasterProfile === 'coastal'
            ? 'the harbour and coastal districts'
            : disasterProfile === 'river'
              ? 'the riverside quarter'
              : disasterProfile === 'forest'
                ? 'the mill and lumber district'
                : 'the lower districts',
        '{percent}': randInt(20, 50),
        '{duration}': randInt(2, 4),
        '{dragon_color}': pick(['red', 'black', 'green', 'blue']),
        '{reason}': disasterProfile === 'monster' ? 'a monster incursion' : 'a natural disaster',
      };
    }
    case 'religious': {
      const orderMap = {
        cathedral: pick(['Benedictine', 'Cistercian', 'Franciscan']),
        monastery: pick(['Franciscan', 'Dominican', 'Augustinian']),
        church: pick(['Parish', 'Mendicant', 'Hospitaller']),
        shrine: pick(['Hermetic', 'Pilgrim', 'Wandering']),
      };
      return {
        '{deity}': pick([
          'the patron deity of the settlement',
          'the church of the Sun God',
          'the faith of the Earth Mother',
        ]),
        '{order_name}': orderMap[religiousScale] || 'Hospitaller',
        '{saint_name}': pick(['St. Aldric', 'St. Brigid', 'St. Marcus', 'St. Helena', 'St. Corvin']),
        '{heresy_type}': pick(['reformist', 'mystical', 'ascetic', 'apocalyptic']),
        '{doctrinal_dispute}': pick([
          'the role of the laity',
          'interpretation of sacred texts',
          'hierarchy and authority',
        ]),
      };
    }
    case 'magical': {
      const founderDesc = pick(
        magicLevel === 'high'
          ? ['a conclave of archmages', 'the regional magical authority', 'a legendary wizard']
          : ['a solitary wizard', 'wandering mage scholars', 'a minor magical order'],
      );
      return {
        '{wizard_name}': pick(['Aldric the Wise', 'Morgana Shadowweaver', 'Theron Stormcaller', 'Elara Moonwhisper']),
        '{magical_effect}': pick(
          magicLevel === 'high'
            ? ['a warping of local reality', 'transformation of the affected district', 'a permanent arcane storm']
            : ['minor reality distortions', 'lingering magical residue', 'unstable enchantments on buildings'],
        ),
        '{plane_name}': pick(['the Feywild', 'the Shadowfell', 'the Elemental Chaos']),
        '{founder}': founderDesc,
      };
    }
    default:
      return {};
  }
};

// ─── generateEventNarrative ───────────────────────────────────────────────────
/**
 * Render a historical event at a specific point in time, substituting template
 * variables and selecting effects/hooks appropriate to the event severity.
 */

const generateEventNarrative = (eventTemplate, yearsAgo, extraTokens = {}) => {
  // Template variable substitutions (can be overridden by extraTokens)
  const defaultTokens = {
    '{quarter}': pick(['the market quarter', 'the residential district', 'the waterfront', 'the temple district']),
    '{building_type}': pick(['wooden buildings', 'warehouses', 'housing', 'commercial buildings']),
    '{percent}': randInt(15, 60),
    '{duration}': randInt(1, 5),
    '{location}': pick(['lower districts', 'riverside quarter', 'eastern sector', 'merchant district']),
    '{dragon_color}': pick(['red', 'black', 'green', 'white', 'blue']),
    '{authority}': pick(['the king', 'the regional duke', 'the merchant council', 'the emperor']),
    '{method}': pick(['negotiation', 'revolt', 'economic pressure', 'legal maneuvering']),
    '{former_ruler}': pick(['the duke', 'the baron', 'the empire', 'the neighboring kingdom']),
    '{family_name}': pick(['Blackwood', 'Redmont', 'Silverstone', 'Goldcrest']),
    '{new_family}': pick(['Ironheart', 'Stormwind', 'Brightblade', 'Shadowmere']),
    '{faction}': pick(['the common people', 'the merchant guilds', 'the military', 'the clergy']),
    '{outcome}': pick(['partial success', 'costly victory', 'negotiated settlement', 'crushing defeat']),
    '{ally_settlement}': pick(['Westmarch', 'Northgate', 'Riverhold', 'Silverpeak']),
    '{route_type}': pick(['overland', 'river', 'mountain', 'coastal']),
    '{destination}': pick(['the capital', 'distant ports', 'the eastern kingdoms', 'foreign lands']),
    '{reason}': pick(['war', 'natural disaster', 'political dispute', 'monster incursion']),
    '{guild_name}': pick(["Merchants'", "Crafters'", "Masons'", "Weavers'", "Smiths'"]),
    '{demands}': pick(['better wages', 'representation', 'tax relief', 'working conditions']),
    '{frequency}': pick(['weekly', 'monthly', 'seasonal', 'annual']),
    '{bank_name}': pick(['Golden Eagle', 'Silver Crown', 'Iron Vault', 'Diamond Trust']),
    '{resource}': pick(['silver', 'iron', 'gems', 'rare timber', 'magical crystal']),
    '{deity}': pick(['the Sun God', 'the Earth Mother', 'the Lord of Justice', 'the Lady of Mercy']),
    '{heresy_type}': pick(['dualistic', 'apocalyptic', 'reformist', 'mystical']),
    '{saint_name}': pick(['St. Aldric', 'St. Brigid', 'St. Marcus', 'St. Helena']),
    '{order_name}': pick(['Benedictine', 'Franciscan', 'Templar', 'Hospitallar']),
    '{doctrinal_dispute}': pick([
      'interpretation of scripture',
      'hierarchy and authority',
      'ritual practices',
      'theological doctrine',
    ]),
    '{wizard_name}': pick(['Aldric the Wise', 'Morgana Shadowweaver', 'Theron Stormcaller', 'Elara Moonwhisper']),
    '{magical_effect}': pick([
      'reality distortion in the affected area',
      'transformation of inhabitants',
      'a permanent magical storm',
      'dimensional rifts',
    ]),
    '{plane_name}': pick(['the Feywild', 'the Shadowfell', 'the Elemental Chaos', 'the Abyss']),
    '{founder}': pick([
      'a council of archmages',
      'a legendary wizard',
      'the regional magical authority',
      'refugee mages',
    ]),
    ...extraTokens,
  };

  let description = eventTemplate.description;
  Object.entries(defaultTokens).forEach(([token, value]) => {
    description = description.replace(token, String(value));
  });

  // Select lasting effects based on severity
  const severity = pick(eventTemplate.severity || ['major']);
  const effectCount = severity === 'catastrophic' ? 3 : severity === 'major' ? 2 : 1;
  const availableEffects = [...(eventTemplate.lastingEffects || [])];
  const selectedEffects = [];
  for (let i = 0; i < Math.min(effectCount, availableEffects.length); i++) {
    const idx = randInt(0, availableEffects.length - 1);
    selectedEffects.push(availableEffects.splice(idx, 1)[0]);
  }

  // Plot hooks only for events within living/recent memory (≤80 years ago).
  // Ancient and deep history events are too distant to generate actionable hooks —
  // they're background texture, not immediate adventure seeds.
  const selectedHooks = [];
  if (yearsAgo <= 80) {
    const hookCount = severity === 'catastrophic' ? 3 : severity === 'major' && _rng() < 0.5 ? 2 : 1;
    const availableHooks = [...(eventTemplate.plotHooks || [])];
    for (let i = 0; i < Math.min(hookCount, availableHooks.length); i++) {
      const idx = randInt(0, availableHooks.length - 1);
      let hook = availableHooks.splice(idx, 1)[0];
      // For older events (last century: 30–80y), reframe present-tense hooks as
      // historical discoveries — things uncovered now, not things actively happening.
      if (yearsAgo > 30 && hook) {
        const ECHO_PREFIXES = [
          'Old records suggest ',
          'A recently surfaced document implies ',
          'Family accounts passed down from the time claim ',
          "An archivist's notes from that period reveal ",
          'Evidence that survived the years indicates ',
        ];
        // Only prefix hooks that read as present-tense (contain present-tense signals)
        const presentTenseSignals = [' is ', ' are ', ' has ', ' have ', ' exists', ' exist', ' being '];
        const needsReframe = presentTenseSignals.some(sig => hook.toLowerCase().includes(sig));
        if (needsReframe) {
          const prefix = ECHO_PREFIXES[Math.floor(_rng() * ECHO_PREFIXES.length)];
          // Lowercase the first letter of the hook when adding prefix
          hook = prefix + hook.charAt(0).toLowerCase() + hook.slice(1);
        }
      }
      selectedHooks.push(hook);
    }
  }

  return {
    yearsAgo,
    type: '',
    name: eventTemplate.name || EVENT_TYPE_NAMES[eventTemplate.type] || 'The Event',
    description,
    severity,
    lastingEffects: selectedEffects,
    plotHooks: selectedHooks,
  };
};

// ─── buildHistoricalEvent ─────────────────────────────────────────────────────
/**
 * Select and personalise a set of current tensions for this settlement.
 * Uses institution presence, economic state, stress type, and neighbor
 * relationship to weight and choose appropriate tension types.
 */
const buildHistoricalEvent = (
  institutions,
  economicViability,
  tier,
  economicState = null,
  config = {},
  factions = [],
) => {
  // Resolve active stress type
  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = stresses.length
    ? [
        'under_siege',
        'occupied',
        'famine',
        'plague_onset',
        'politically_fractured',
        'recently_betrayed',
        'succession_void',
        'indebted',
        'infiltrated',
        'monster_pressure',
        'insurgency',
        'mass_migration',
        'wartime',
        'religious_conversion',
        'slave_revolt',
      ].find(s => stresses.includes(s)) || stresses[0]
    : null;

  // Resolve faction names for text substitution
  const govFaction = factions.find(f => f.isGoverning)?.faction || 'the governing authority';
  const secFaction = (factions.find(f => !f.isGoverning) || factions[1])?.faction || 'the merchant class';
  const altFaction = factions[1]?.faction || 'the merchant class';
  const crimeFaction =
    factions.find(f => f.faction?.toLowerCase().includes('thieves') || f.faction?.toLowerCase().includes('criminal'))
      ?.faction || null;
  const milFaction =
    factions.find(
      f =>
        f.faction?.toLowerCase().includes('military') ||
        f.faction?.toLowerCase().includes('guard') ||
        f.faction?.toLowerCase().includes('war council'),
    )?.faction || null;
  const relFaction =
    factions.find(f => f.faction?.toLowerCase().includes('religious') || f.faction?.toLowerCase().includes('church'))
      ?.faction || null;

  // Stress → tension type mapping
  const STRESS_TO_TENSION = {
    under_siege: 'occupation_legacy',
    famine: 'resource_scarcity',
    occupied: 'occupation_legacy',
    politically_fractured: 'leadership_vacuum',
    indebted: 'outside_debt',
    recently_betrayed: 'corruption_scandal',
    infiltrated: 'infiltration_fear',
    plague_onset: 'resource_scarcity',
    succession_void: 'succession_crisis',
    monster_pressure: 'external_threat',
    insurgency: 'legitimacy_crisis',
    mass_migration: 'demographic_pressure',
    wartime: 'external_threat',
    religious_conversion: 'legitimacy_crisis',
    slave_revolt: 'legitimacy_crisis',
  };

  // Neighbor relationship → tension
  const neighborRel = (config.neighborRelationship?.relationshipType || '').toLowerCase();
  const neighborTension =
    neighborRel.includes('hostile') || neighborRel.includes('rival') || neighborRel.includes('cold_war')
      ? 'external_threat'
      : neighborRel.includes('trade_partner')
        ? 'trade_dispute'
        : null;

  // How many tensions to generate
  const isLargeTier = ['city', 'metropolis'].includes(tier);
  const isSmallTier = ['thorp', 'hamlet'].includes(tier);
  const targetCount = isLargeTier ? randInt(2, 3) : isSmallTier ? 1 : randInt(1, 2);

  const selected = [];
  const usedTypes = new Set();
  const hasGuild = institutions.some(i => (i.tags || []).includes('guild'));
  const hasCriminal = institutions.some(i => i.priorityCategory === 'criminal');

  // Priority-add: economic viability issues → resource_scarcity
  if (economicViability) {
    if ((economicViability.issues?.length || 0) > 0) {
      const tmpl = HISTORICAL_EVENTS_DATA.find(e => e.type === 'resource_scarcity');
      if (tmpl && _rng() > 0.4) {
        const commodity = economicState?.tradeCommodity || 'key goods';
        selected.push({
          ...tmpl,
          description: `The supply of ${commodity} — the settlement's economic backbone — is under pressure. ${economicViability.issues[0].message}`,
          specificIssue: economicViability.issues[0].message,
        });
        usedTypes.add('resource_scarcity');
      }
    }
    if (economicViability.stability === 'Unstable' && !usedTypes.has('succession_crisis')) {
      const tmpl = HISTORICAL_EVENTS_DATA.find(e => e.type === 'succession_crisis');
      if (tmpl && _rng() > 0.5) {
        selected.push({ ...tmpl });
        usedTypes.add('succession_crisis');
      }
    }
    if (hasCriminal && !usedTypes.has('crime_wave') && _rng() > 0.5) {
      const tmpl = HISTORICAL_EVENTS_DATA.find(e => e.type === 'crime_wave');
      if (tmpl) {
        selected.push({ ...tmpl });
        usedTypes.add('crime_wave');
      }
    }
  }

  // Priority-add: neighbor tension
  if (neighborTension && !usedTypes.has(neighborTension)) {
    const tmpl = HISTORICAL_EVENTS_DATA.find(e => e.type === neighborTension);
    if (tmpl) {
      selected.push({ ...tmpl });
      usedTypes.add(neighborTension);
    }
  }

  // Small settlement + criminal institutions → localised crime wave
  if (['thorp', 'hamlet', 'village'].includes(tier) && !primaryStress && !usedTypes.has('crime_wave')) {
    const hasCrimInst = institutions.some(i => {
      const n = (i.name || '').toLowerCase();
      return n.includes('fence') || n.includes('smuggl') || n.includes('bandit') || n.includes('outlaw');
    });
    if (hasCrimInst) {
      const tmpl = HISTORICAL_EVENTS_DATA.find(e => e.type === 'crime_wave');
      if (tmpl) {
        selected.push({
          ...tmpl,
          description: tmpl.description
            .replace('overwhelms authorities', 'circulates openly')
            .replace('vigilantes are forming', 'and there is no authority to stop it'),
        });
        usedTypes.add('crime_wave');
      }
    }
  }

  // Priority-add: stress → tension
  if (primaryStress) {
    const tensionType = STRESS_TO_TENSION[primaryStress];
    if (tensionType && !usedTypes.has(tensionType)) {
      const tmpl = HISTORICAL_EVENTS_DATA.find(e => e.type === tensionType);
      if (tmpl) {
        selected.push({ ...tmpl });
        usedTypes.add(tensionType);
      }
    }
  }

  // Fill remaining slots with random tensions
  // Suppress magical events in no-magic worlds
  const magicFilter = config?.magicExists === false ? e => e.type !== 'magical' : () => true;
  const pool = HISTORICAL_EVENTS_DATA.filter(e => !usedTypes.has(e.type) && magicFilter(e));
  while (selected.length < targetCount && pool.length > 0) {
    let candidate = pick(pool);
    // Bias toward guild conflict if guilds present
    if (hasGuild && candidate.type !== 'guild_conflict' && _rng() > 0.7) {
      const guildTmpl = pool.find(e => e.type === 'guild_conflict');
      if (guildTmpl) candidate = guildTmpl;
    }
    pool.splice(pool.indexOf(candidate), 1);
    selected.push({ ...candidate });
    usedTypes.add(candidate.type);
  }

  // Substitute faction names into descriptions
  const merchantRef =
    secFaction !== govFaction ? secFaction : altFaction !== govFaction ? altFaction : 'the merchant class';
  const substituteNames = text => {
    let result = text
      .replace(/Wealthy merchants/g, merchantRef)
      .replace(/Legitimate heir/g, govFaction)
      .replace(/Corrupt officials/g, govFaction)
      .replace(/Official guards/g, milFaction || 'The garrison')
      .replace(/Criminal organisations/g, crimeFaction || 'the criminal network')
      .replace(/Orthodox believers/g, relFaction || 'the orthodox clergy')
      .replace(/Power behind throne/g, altFaction !== govFaction ? altFaction : merchantRef);
    // Remove accidental doubled nouns (e.g. "the council vs the council")
    result = result.replace(/\b(.{4,40}) vs \1\b/g, '$1');
    return result;
  };

  return selected.map(tension => ({
    ...tension,
    description: substituteNames(tension.description),
    factions: (tension.factions || []).map(substituteNames),
  }));
};

// ─── generateRelationshipEvent ────────────────────────────────────────────────
/**
 * Generate the timeline of historical events for this settlement.
 * Produces a series of events spread across the settlement's age,
 * weighted by the current economic/political/social situation.
 */
const generateRelationshipEvent = (age, tier, config, context = null) => {
  // Number of history events (scaled by age)
  const ageFraction = age / 100;
  // Scale event count by age — each tier gets appropriate depth
  const ageFractionScaled = age / 60;
  const rawEventCount = Math.floor(ageFractionScaled * randInt(1, 3));
  const eventCount =
    tier === 'thorp'
      ? Math.min(rawEventCount, 3)
      : tier === 'hamlet'
        ? Math.max(1, Math.min(rawEventCount, 4))
        : tier === 'village'
          ? Math.max(1, Math.min(rawEventCount, 5))
          : tier === 'town'
            ? Math.max(1, Math.min(rawEventCount, 8))
            : tier === 'city'
              ? Math.max(2, Math.min(rawEventCount, 12))
              : Math.max(3, Math.min(rawEventCount, 20)); // metropolis

  // Get the category weight map for this settlement
  const categoryWeights = generateSafetyNarrative2(config, context?._institutions || []);
  // Suppress magical history events in no-magic worlds
  if (config?.magicExists === false) {
    delete categoryWeights['magical'];
  }

  // Weighted random category picker
  const pickCategory = () => {
    const cats = Object.keys(categoryWeights);
    const weights = cats.map(c => Math.max(0.1, categoryWeights[c]));
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = _rng() * total;
    for (let i = 0; i < cats.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return cats[i];
    }
    return cats[0];
  };

  // Pick categories (no repeats)
  const events = [];
  const usedCats = new Set();
  const usedNames = new Set(); // prevent same event template appearing twice
  for (let i = 0; i < eventCount; i++) {
    let cat,
      attempts = 0;
    do {
      cat = pickCategory();
      attempts++;
    } while (usedCats.has(cat) && attempts < 5);
    usedCats.add(cat);

    // Map category to an event type data object (simplified — use a generic template)
    const tmpl = HISTORICAL_EVENTS_DATA.find(e => {
      const typeMap = {
        economic: ['economic_disparity', 'outside_debt', 'resource_scarcity', 'guild_conflict'],
        political: [
          'succession_crisis',
          'corruption_scandal',
          'infiltration_fear',
          'leadership_vacuum',
          'occupation_legacy',
          'disputed_land',
          'population_friction',
          'generational_divide',
        ],
        disaster: ['external_threat'],
        religious: ['religious_tension'],
        magical: ['magical_controversy'],
        occupation_infiltration: ['infiltration_fear'],
        exile_return: ['occupation_legacy'],
        demographic: ['population_friction'],
      };
      return (typeMap[cat] || []).includes(e.type);
    });
    if (!tmpl) continue;
    // Skip if we've already used this exact event template name (prevents duplicates)
    const tmplName = tmpl.name || tmpl.type || '';
    if (usedNames.has(tmplName)) continue;
    usedNames.add(tmplName);

    // Spread event across the age timeline
    const fraction = i / eventCount;
    const nextFraction = (i + 1) / eventCount;
    const minYearsAgo = Math.floor(age * fraction);
    const maxYearsAgo = Math.floor(age * nextFraction);
    const yearsAgo = randInt(Math.max(minYearsAgo, 5), maxYearsAgo);

    // Build context tokens
    const contextTokens = context ? generateTradeNarrative2(cat, context) : {};

    const event = generateEventNarrative(tmpl, yearsAgo, contextTokens);
    event.type = cat;
    events.push(event);
  }

  events.sort((a, b) => b.yearsAgo - a.yearsAgo);

  if (!context) return events.sort((a, b) => a.yearsAgo - b.yearsAgo);

  // Anchor events to specific settlement-appropriate narratives
  const anchored = [...events].sort((a, b) => a.yearsAgo - b.yearsAgo);
  const anchoredTypes = new Set();

  anchored.forEach((event, idx) => {
    const cat = event.type;
    if (anchoredTypes.has(cat)) return;

    const contextTokens = generateTradeNarrative2(cat, context) || {};
    if (_rng() < 0.6) {
      const anchored = generateEventNarrative(
        HISTORICAL_EVENTS_DATA.find(e => {
          const typeMap = {
            economic: 'economic_disparity',
            political: 'succession_crisis',
            disaster: 'external_threat',
            religious: 'religious_tension',
            magical: 'magical_controversy',
          };
          return e.type === typeMap[cat];
        }) || events[idx],
        event.yearsAgo,
        contextTokens,
      );
      if (anchored) {
        anchored.type = cat;
        anchored.anchored = true;
        events[idx] = anchored;
      }
    }
    anchoredTypes.add(cat);
  });

  // Add resource-specific historical events based on nearby resources
  const nearbyResources = context.nearbyResources || [];
  const hasResource = keys => nearbyResources.some(r => keys.some(k => r.includes(k)));
  const resourceAge = Math.floor(age * (0.4 + _rng() * 0.4));

  const resourceEvents = [];
  if (hasResource(['iron_deposits', 'iron_mine']) && _rng() < 0.4) {
    resourceEvents.push({
      name: 'The Iron Dispute',
      description:
        'Rights to the local iron deposits became the subject of a prolonged dispute between the settlement and a rival lord. The outcome shaped who controls extraction to this day.',
      lastingEffects: [
        'Iron production rights still legally contested in some records',
        'Fortified extraction sites established during the dispute',
      ],
      plotHooks: [
        'Old deed to the iron rights has resurfaced in an estate sale',
        'A rival family claims their ancestor was cheated out of the original mining contract',
      ],
      severity: ['minor', 'major'],
      type: 'economic',
      yearsAgo: resourceAge,
      anchored: false,
    });
  }
  if (hasResource(['grain_fields', 'fertile_floodplain']) && _rng() < 0.35) {
    resourceEvents.push({
      name: 'The Great Harvest Compact',
      description:
        'After years of disputed grain prices, the major farming families and the merchant guilds negotiated a formal compact regulating grain sale and storage. It held for a generation.',
      lastingEffects: [
        'Grain price regulation persists in modified form',
        "Compact signatories' families still hold preferential market positions",
      ],
      plotHooks: [
        'A clause in the compact entitles certain families to first refusal on grain sales — and the current shortage makes that clause valuable',
        'The original compact was signed under duress; someone wants that history exposed',
      ],
      severity: ['minor', 'major'],
      type: 'economic',
      yearsAgo: resourceAge,
      anchored: false,
    });
  }
  if (hasResource(['stone_quarry']) && _rng() < 0.35) {
    resourceEvents.push({
      name: 'The Great Construction',
      description:
        "A period of ambitious stone construction transformed the settlement's character — walls, civic buildings, or a cathedral raised from local quarry stone. The quarry workers became a political force.",
      lastingEffects: [
        "Quarrymen's guild retains unusual civic influence",
        "Architectural legacy of the construction period defines the settlement's visual character",
      ],
      plotHooks: [
        'Something was sealed inside the walls during construction — deliberately',
        "The quarry foreman's descendants claim unpaid wages from the original commission",
      ],
      severity: ['major'],
      type: 'economic',
      yearsAgo: resourceAge,
      anchored: false,
    });
  }
  if (hasResource(['magical_node']) && _rng() < 0.45) {
    resourceEvents.push({
      name: 'The Arcane Incident',
      description:
        'A catastrophic or transformative event tied to the local ley line concentration occurred, permanently altering a district of the settlement and the lives of its inhabitants.',
      lastingEffects: [
        'Affected district retains residual magical effects',
        'Arcane regulatory body established with unusual local authority',
      ],
      plotHooks: [
        'The incident was caused by deliberate misuse of the node — someone covered it up',
        'The transformation affected a family lineage in ways that are only now becoming apparent',
      ],
      severity: ['major', 'catastrophic'],
      type: 'magical',
      yearsAgo: resourceAge,
      anchored: false,
    });
  }

  if (resourceEvents.length > 0 && events.length < 7) {
    const chosen = resourceEvents[Math.floor(_rng() * resourceEvents.length)];
    // Strip plot hooks from ancient resource events (same ≤80y rule)
    if ((chosen.yearsAgo || 0) > 80) chosen.plotHooks = [];
    events.push(chosen);
    events.sort((a, b) => (b.yearsAgo || 0) - (a.yearsAgo || 0));
  }

  // Final deduplication pass — the anchor pass can produce same event name
  // across multiple slots when two events share a category type mapping.
  const seenNames = new Set();
  const deduped = events.filter(e => {
    const key = e.name || e.type || '';
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });

  return deduped;
};

// ─── generateHistory ──────────────────────────────────────────────────────────
/**
 * Main export. Assembles the complete history object for a settlement.
 *
 * @param {string} tier            - Settlement tier
 * @param {Object} config          - Settlement config
 * @param {Array}  institutions    - Institution objects
 * @param {Object} economicViability - Result of generateEconomicViability
 * @param {Object} economicState   - Result of generateEconomicState
 * @param {Object} powerStructure  - Result of generatePowerStructure
 * @returns {Object} History object with age, founding, events, tensions, character
 */
export const generateHistory = (
  tier,
  config,
  institutions,
  economicViability = null,
  economicState = null,
  powerStructure = null,
) => {
  const age = getSettlementAge(tier);
  const context = buildHistoryContext(config, institutions, economicState, powerStructure);
  if (context) context._institutions = institutions;

  // Founding narrative
  const founding = genArrivalDetail(config, context);
  founding.age = age;

  // Historical timeline
  const timeline = generateRelationshipEvent(age, tier, config, context);

  // Current tensions
  const tensions = buildHistoricalEvent(
    institutions,
    economicViability,
    tier,
    economicState,
    config,
    powerStructure?.factions || [],
  );

  // Derive historical character from event pattern
  const disasters = timeline.filter(e => e.type === 'disaster').length;
  const political = timeline.filter(e => e.type === 'political').length;
  const economic = timeline.filter(e => e.type === 'economic').length;

  let historicalCharacter = 'stable and prosperous';
  if (disasters >= 2) historicalCharacter = 'marked by repeated calamities';
  else if (political >= 2) historicalCharacter = 'politically turbulent';
  else if (economic >= 2) historicalCharacter = 'economically dynamic';
  else if (timeline.some(e => e.severity === 'catastrophic'))
    historicalCharacter = 'defined by a single great catastrophe';

  return {
    age,
    founding,
    historicalEvents: timeline,
    currentTensions: tensions,
    historicalCharacter,
    eventsTimeline: timeline.map(e => ({
      year: age - e.yearsAgo,
      yearsAgo: e.yearsAgo,
      name: e.name,
      type: e.type,
      anchored: e.anchored || false,
    })),
  };
};
