/**
 * history/historyEventStrands.js — the two authored strand builders of
 * historyGenerator.js, moved out verbatim by THE DECOMPOSITION WAVE (lane D).
 *
 * generateSafetyNarrative2 weights the history event CATEGORIES from the
 * settlement's institution flags, stress list and monster threat; generateTradeNarrative2
 * answers, per chosen category, the named template variables the event templates
 * substitute. Both are read by buildHistoricalEvent / generateRelationshipEvent in the
 * head, which keeps the writer role.
 *
 * Byte-identical to their pre-split bodies. generateTradeNarrative2 draws seeded
 * picks in the same order, so the same-seed golden master is unmoved;
 * generateSafetyNarrative2 is draw-free. priorityMult moved with them — it had no
 * other reader.
 */
import { getInstFlags, getStressFlags, pick, randInt } from '../helpers.js';

// ─── priorityMult ─────────────────────────────────────────────────────────────
// Convert a 0–100 priority/influence score to a 0–2 multiplier centred at 1.
// (Named distinctly to avoid confusion with helpers.popToTier which maps population → tier string.)

const priorityMult = (score = 50) => Math.max(0, (score ?? 50) / 50);

// ─── generateSafetyNarrative2 ────────────────────────────────────────────────
// Compute a weighted probability map over history event types based on the
// settlement's current state. Used to drive the historical event type distribution.

export const generateSafetyNarrative2 = (config = {}, institutions = []) => {
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
    insurgency: { political: 2.5, occupation_infiltration: 1.5 },
    mass_migration: { demographic: 3.0, economic: 1.5 },
    wartime: { disaster: 2.0, political: 1.8 },
    religious_conversion: { religious: 2.5, political: 1.5 },
    slave_revolt: { political: 2.5, demographic: 1.5 },
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
export const generateTradeNarrative2 = (category, context) => {
  const {
    tradeCommodity: commodity,
    dominantGuild,
    primaryExports,
    incomeSources,
    tradeRouteAccess: route,
    _prosperity,
    dominantFaction,
    govType,
    religiousScale,
    disasterProfile,
    historyRouteType,
    historyDestination,
    disasterQuarter,
    disasterBuildingType,
    disasterLocation,
    magicLevel,
    _hasTower,
    _hasGuildMag,
  } = context;

  const primaryExport = commodity
    ? commodity.charAt(0).toUpperCase() + commodity.slice(1)
    : primaryExports[0] || 'trade goods';

  switch (category) {
    case 'economic': {
      const demands = incomeSources.some(s => s.toLowerCase().includes('guild'))
        ? 'guild recognition and fair wages'
        : incomeSources.some(s => s.toLowerCase().includes('port'))
          ? 'docking rights and fair tariffs'
          : 'better working conditions';
      return {
        '{resource}': primaryExport.toLowerCase(),
        '{guild_name}': dominantGuild,
        '{route_type}': historyRouteType,
        '{destination}': historyDestination,
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
      return {
        '{quarter}': disasterQuarter,
        '{building_type}': disasterBuildingType,
        '{location}': disasterLocation,
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
