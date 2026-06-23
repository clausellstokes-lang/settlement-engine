/**
 * structuralValidator.js
 * Institution structural validation, base chance calculation, and
 * institution-to-narrative text adaptation.
 */

import {getTradeRouteFeatures, hasTeleportationInfra, pickRandom, tierAtLeast} from './helpers.js';
export { getBaseChance } from './institutionProbability.js';

import {GATE_FEATURES, INSTITUTION_SPATIAL, GOVERNMENT_INSTITUTIONS} from '../data/spatialData.js';
import { RESOURCE_DATA } from '../data/resourceData.js';

// RELATION_TYPES re-exported as alias so existing importers don't break.
export { SPECIAL_RESOURCES as RELATION_TYPES } from '../data/resourceData.js';

/**
 * Deterministic 0..1 hash keyed on identity text (FNV-1a + fmix32 avalanche).
 * Same construction as domain/region/contestMath.hash01 (kept local so this
 * generator carries no domain import). Used for stable probabilistic gates that
 * must NOT depend on a live RNG draw — the validator runs on the re-render-heavy
 * draft path where no seeded RNG is active.
 * @param {string} text
 * @returns {number} a value in [0, 1)
 */
const hash01 = (text) => {
  let h = 0x811c9dc5;
  const s = String(text);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// ─── SPATIAL_FEATURES ────────────────────────────────────────────────────────
// Maps an institution name to the list of lesser institutions it implies
// (for validation expansion — if you have the greater, you implicitly have the lesser).

export const SPATIAL_FEATURES = {
  // Markets
  'District markets (5-10)':        ['Multiple market squares', 'Daily markets', 'Market square', 'Weekly market'],
  'Daily markets':                  ['Market square', 'Weekly market'],
  'Multiple market squares':        ['Market square', 'Weekly market'],
  // Military
  'Multiple garrisons': [
    'Garrison', 'Barracks', 'Town watch',
    'Citizen militia', 'Professional guard (hundreds)',
  ],
  'Professional guard (hundreds)':  ['Garrison', 'Barracks', 'Town watch', 'Citizen militia'],
  // Fortification
  'Inner citadel': [
    'Citadel', 'City walls and gates',
    'Massive walls and fortifications', 'Town walls',
  ],
  'Massive walls and fortifications': ['City walls and gates', 'Town walls'],
  'City walls and gates':           ['Town walls'],
  // Religious
  'Parish churches (50-100+)': [
    'Parish churches (10-30)', 'Parish churches (2-5)',
    'Parish church', 'Priest (resident)',
  ],
  'Parish churches (10-30)':        ['Parish churches (2-5)', 'Parish church', 'Priest (resident)'],
  'Parish churches (2-5)':          ['Parish church', 'Priest (resident)'],
  'Great cathedral': [
    'Cathedral (10,000+ only)', 'Parish churches (10-30)',
    'Parish churches (2-5)', 'Parish church',
  ],
  'Multiple cathedrals':            ['Cathedral (10,000+ only)', 'Great cathedral', 'Parish churches (10-30)'],
  'Major monasteries (5-10)':       ['Multiple monasteries', 'Monastery or friary'],
  'Multiple monasteries':           ['Monastery or friary'],
  // Medical
  'Hospital network':               ['Major hospital', 'Small hospital'],
  'Major hospital':                 ['Small hospital'],
  // Guilds / economy
  'Craft guilds (100-150+)':        ['Craft guilds (30-80)', 'Craft guilds (5-15)'],
  'Craft guilds (30-80)':           ['Craft guilds (5-15)'],
  'Merchant guilds (50-100+)':      ['Merchant guilds (15-40)', 'Merchant guilds (3-8)', 'Money changers'],
  'Merchant guilds (15-40)':        ['Merchant guilds (3-8)', 'Money changers'],
  'Multiple warehouse districts':   ['Warehouse district'],
  // Hospitality
  'Hospitality district': [
    "Inns and taverns (district)", 'Inn (multiple)',
    'Taverns (5-20)', "Travelers' inn", 'Ale house',
  ],
  "Inns and taverns (district)":    ['Inn (multiple)', 'Taverns (5-20)', "Travelers' inn", 'Ale house'],
  'Inn (multiple)':                 ["Travelers' inn", 'Ale house'],
  // Trade / finance
  'International trade center':     ['Warehouse district', 'Banking houses', 'Money changers'],
  'Banking district':               ['Banking houses', 'Money changers'],
  'Banking houses':                 ['Money changers'],
  // Magic
  'Multiple wizard towers':         ["Wizard's tower", 'Alchemist shop'],
  "Mages' district":                ["Wizard's tower", "Mages' guild"],
  'Academy of magic':               ["Mages' guild", "Mages' district", 'Multiple wizard towers', "Wizard's tower"],
  'Enchanting quarter':             ["Mages' guild", "Mages' district", "Enchanter's shop"],
  // Criminal
  "Thieves' guild (powerful)": [
    "Thieves' guild chapter", 'Multiple criminal factions',
    'Black market', 'Front businesses', 'Street gang',
  ],
  'Multiple criminal factions':     ["Thieves' guild chapter", 'Street gang'],
  'Black market bazaar':            ['Black market', 'Multiple criminal factions', 'Underground city'],
  "Assassins' guild":               ["Thieves' guild (powerful)", 'Underground city'],
  // Infrastructure
  'Advanced water infrastructure':  ['Aqueduct or water system', 'Water source', 'Multiple water sources'],
  'Sewage system':                  ['Aqueduct or water system', 'Advanced water infrastructure'],
  // Entertainment
  'Gambling district':              ['Gambling halls', 'Gambling den'],
  'Gambling halls':                 ['Gambling den', 'Ale house'],
  'Colosseum/arena':                ['Professional arena', 'Fighting pits'],
  'Professional arena':             ['Fighting pits'],
  'Multiple theaters':              ['Theaters'],
  'Opera house':                    ['Multiple theaters', 'Theaters'],
  // Adventuring
  "Multiple adventurers' guilds":   ["Adventurers' guild hall", 'Hireling hall'],
  'Dungeon delving supply district': ["Adventurers' guild hall", "Multiple adventurers' guilds"],
  // Justice
  'Massive prison':                 ['Large prison', 'Multiple court buildings', 'Courthouse'],
  'Large prison':                   ['Courthouse', 'City hall', 'Town hall'],
  'Multiple court buildings':       ['Courthouse', 'City hall', 'Town hall'],
  'Palace/government complex':      ['City hall', 'Town hall'],
  // Knowledge
  'University':                     ['Great library', 'Cathedral (10,000+ only)', 'Sage/library'],
  'Great library':                  ['Sage/library', 'Cathedral (10,000+ only)'],
  "Sage's quarter":                 ['Great library', 'Sage/library'],
  // Chains
  'Major port':                     ['Docks/port facilities'],
  'Garrison':                       ['Barracks', 'Citizen militia', 'Town watch'],
  'Professional city watch':        ['Town watch', 'Citizen militia'],
  'City hall':                      ['Town hall', 'Mayor and council'],
  "Wizard's tower":                 ['Hedge wizard', 'Alchemist shop'],
  "Mages' guild":                   ["Wizard's tower", 'Alchemist shop', 'Hedge wizard'],
  "Adventurers' guild hall":        ['Hireling hall', 'Mercenary company HQ'],
  'Cathedral (10,000+ only)':       ['Monastery or friary', 'Parish churches (10-30)', 'Major hospital'],
  'City granaries':                 ['Town granary'],
  'State granary complex':          ['City granaries', 'Town granary'],
  "Thieves' guild chapter":         ['Street gang', 'Black market', 'Gambling den'],
  'Smuggling network':              ['Smuggling operation', 'Warehouse district'],
  'Front businesses':               ['Street gang', 'Gambling den', 'Black market'],
  'Mercenary quarter':              ['Mercenary company HQ', 'Hireling hall'],
  'Courthouse':                     ['Town hall', 'Mayor and council'],
  'Bardic college':                 ['Sage/library', 'Theaters'],
  "Enchanter's shop":               ["Wizard's tower", 'Alchemist shop'],
  'Teleportation circle':           ["Mages' guild", "Wizard's tower"],
  'Scroll scribe':                  ["Wizard's tower", 'Hedge wizard', 'Alchemist shop'],
  'Golem workforce':                ["Mages' guild", 'Academy of magic'],
  'Undead labor':                   ["Mages' guild", 'Academy of magic'],
  'Printing house':                 ['Great library', 'Craft guilds (30-80)'],
  'Glassmakers':                    ['Craft guilds (30-80)', 'Craft guilds (5-15)'],
  'Specialized metalworkers':       ['Blacksmiths (3-10)', 'Craft guilds (5-15)'],
  'Weekly market':                  ['Common grazing land'],
  'Monster part dealers':           ["Adventurers' guild hall", 'Alchemist shop'],
  'Curse breaking':                 ["Mages' guild", 'Cathedral (10,000+ only)', "Wizard's tower"],
  'Small hospital':                 ['Parish church', 'Monastery or friary', 'Priest (resident)'],
};

// ─── expandInstitutionSet ─────────────────────────────────────────────────────
// Given a list of institution names, expand it with all implied lesser institutions.

const expandInstitutionSet = (names) => {
  const set = new Set(names);
  names.forEach(name => {
    (SPATIAL_FEATURES[name] || []).forEach(implied => set.add(implied));
  });
  return set;
};

// NOTE: a dead _getPriorityModifiers() lived here — it mirrored the goods-toggle
// penalty in institutionProbability.js, which was inert because no good defines
// `institutionKeywords` on GOODS_MODIFIERS_BY_TIER. Removed along with the unused
// GOODS_MODIFIERS_BY_TIER import; the live (also-removed) copy is documented in
// institutionProbability.js.

// ─── getTierConstraints ───────────────────────────────────────────────────────
/**
 * Adapt generic narrative text to use institution-appropriate terminology.
 * Replaces placeholder phrases like "the garrison", "the council", "the healers"
 * with the actual institution names present in this settlement.
 *
 * @param {string}   text         - Narrative text containing generic placeholders
 * @param {string[]} instNames    - Lowercase institution names present in settlement
 * @param {string}   tier         - Settlement tier
 * @param {string}   [govOverride]- Override for the governing body name
 * @returns {string} Adapted text
 */
const _getTierConstraints = (text, instNames, tier, govOverride) => {
  const has = (keyword) => instNames.some(n => n.includes(keyword));
  const isSmall = ['thorp', 'hamlet', 'village'].includes(tier);

  // Resolve the military/law enforcement reference
  const militaryRef =
    has('garrison')           ? 'the garrison'          :
    has('barracks')            ? 'the barracks guard'   :
    has('professional guard')  ? 'the professional guard':
    has('city watch') || has('town watch') ? 'the watch' :
    has('militia')             ? 'the militia'           :
    has('mercenary')           ? 'the mercenary company' :
    isSmall                    ? 'the able-bodied'       :
                                 'the guard';

  // Resolve the governing body reference
  const councilRef = govOverride || (
    isSmall
      ? (tier === 'thorp' ? 'the household heads' : 'the village elders')
      : tier === 'town'       ? 'the town council'
      : tier === 'city'       ? 'the city council'
      : tier === 'metropolis' ? 'the grand council'
      :                         'the council'
  );

  // Resolve the merchant/trade reference
  const merchantRef =
    has('merchant') || has('guild') || has('market') ? 'the merchants' :
    isSmall                                           ? 'the wealthiest household' :
                                                        'the traders';

  // Resolve the healer reference
  const healerRef =
    has('hospital')                              ? 'the hospital staff'    :
    has('monastery') || has('friary')           ? 'the monastery brothers' :
    has('healer')                               ? 'the healers'            :
    has('church') || has('cathedral') || has('parish') ? 'the clergy'     :
    isSmall                                     ? 'the local herbalist'    :
                                                  'the healers';

  // Resolve the watch/patrol reference (narrower than militaryRef)
  const watchRef =
    has('city watch') || has('town watch') ? 'the watch'    :
    has('garrison') || has('guard')        ? 'the guard'    :
    has('militia')                         ? 'the militia'  :
    isSmall                                ? 'the neighbours' :
                                             'the guard';

  // Resolve the arcane reference
  const arcaneRef =
    has('wizard') || has('mage') || has('alchemist')
      ? "the mages' quarter"
      : 'the arcane practitioners';

  return text
    .replace(/\bthe garrison commander\b/gi, militaryRef.replace(/^the /, 'the ') + "'s commander")
    .replace(/\bthe garrison\b/gi,           militaryRef)
    .replace(/\bthe public watch\b/gi,       watchRef)
    .replace(/\bthe watch\b/gi,              watchRef)
    .replace(/\bthe council\b/gi,            councilRef)
    .replace(/\ba council\b/gi,              councilRef)
    .replace(/\bcouncil meetings\b/gi,       councilRef.replace(/^the /, '') + ' meetings')
    .replace(/\binside the council\b/gi,     'inside ' + councilRef)
    .replace(/\bthe grain merchants\b/gi,    merchantRef)
    .replace(/\bgrain merchants\b/gi,        merchantRef)
    .replace(/\btwo healers\b/gi,            'two ' + healerRef.replace(/^the /, ''))
    .replace(/\bthe healers\b/gi,            healerRef)
    .replace(/\bthe mages' quarter\b/gi,     arcaneRef);
};

// ─── checkInstCompat ──────────────────────────────────────────────────────────
/**
 * Return a short flavour string describing a visually distinctive institution
 * present in this settlement, used to build the arrival scene.
 * Returns null if no distinctive institution is found.
 *
 * @param {Array}  institutions - Institution objects
 * @param {string} tier
 * @param {number} _magicPriority
 */
export const checkInstCompat = (institutions, tier, _magicPriority) => {
  const names = institutions.map(i => (i.name || '').toLowerCase());
  const has   = (...keywords) => keywords.some(k => names.some(n => n.includes(k)));

  if (has('great cathedral')) {
    return pickRandom([
      "The great cathedral's spire is the tallest thing for miles.",
      'A cathedral dominates the skyline. It is larger than anything else in the settlement, which may say something about what matters here.',
    ]);
  }
  if (has('cathedral') && tier !== 'thorp' && tier !== 'hamlet') {
    return pickRandom([
      'A stone cathedral anchors the high ground.',
      'The cathedral bell tower is the first thing visible from this direction.',
    ]);
  }
  if (has('massive wall', 'citadel')) {
    return pickRandom([
      'The walls are serious: high stone, maintained, with watchtowers spaced to cover every angle.',
      'The citadel on the high ground makes clear that this settlement has been defended before and expects to be again.',
    ]);
  }
  if (has('wall', 'gatehouse') && !has('massive')) {
    return pickRandom([
      'A wall circuit, unremarkable but intact.',
      'The gatehouse arch frames the main road.',
    ]);
  }
  if (has('wizard', 'mage') && has('tower')) {
    return pickRandom([
      "A tower rises above the roofline in a way that isn't architectural. It was added later, and whoever added it wasn't interested in fitting in.",
      'The mage tower catches the light differently from the other buildings.',
    ]);
  }
  if (has('major port')) {
    return pickRandom([
      'The harbour cranes are visible from the road: tall, necessary, industrial.',
      'Half the settlement seems to be about the water.',
    ]);
  }
  if (has('palace', 'royal seat')) {
    return pickRandom([
      'The palace complex sits on the highest point of the settlement and does not look apologetic about it.',
      'Flags on the palace towers. Someone is in residence.',
    ]);
  }
  if (has('university', 'academy of magic')) {
    return pickRandom([
      'The university buildings take up more of the skyline than you expected.',
      'A complex of old stone buildings (the university) anchors the northern quarter.',
    ]);
  }
  return null;
};

// ─── checkStructuralValidity ──────────────────────────────────────────────────
/**
 * Validate an institution set for logical consistency. Returns violations
 * (errors/warnings) and suggestions.
 *
 * Checks:
 *  - GATE_FEATURES: tier requirements, dependencies, blockers
 *  - INSTITUTION_SPATIAL: trade-route access requirements
 *  - Low-magic exotic institution warnings
 *  - Government exclusivity (only one gov form)
 *  - Military adequacy for scale and threat level
 *  - Isolation viability
 *  - Structural gaps (city without garrison, etc.)
 *  - Resource access violations
 *
 * @param {Array}  institutions - Institution objects
 * @param {Object} config       - Settlement config
 * @returns {{ violations: Array, suggestions: Array }}
 */
export const checkStructuralValidity = (institutions, config = {}) => {
  const violations  = [];
  const suggestions = [];

  const instNames    = institutions.map(i => i.name);
  const expandedSet  = [...expandInstitutionSet(instNames)];

  const {
    tier           = 'town',
    tradeRouteAccess: route = 'road',
    magicLevel,
    monsterThreat:  threat = 'frontier',
    priorityMagic:  magicPriority,
    priorityMilitary: milPriority,
  } = config;

  // Resolve effective magic level
  const effectiveMagicLevel = magicPriority !== undefined
    ? (magicPriority <= 25 ? 'low' : magicPriority >= 66 ? 'high' : 'medium')
    : (magicLevel || 'medium');

  // ── GATE_FEATURES checks ─────────────────────────────────────────────────
  Object.entries(GATE_FEATURES).forEach(([instName, gate]) => {
    if (!instNames.includes(instName)) return;

    if (gate.minTier && !tierAtLeast(tier, gate.minTier)) {
      violations.push({
        type:        'tier_violation',
        institution: instName,
        reason:      `${instName} requires ${gate.minTier} tier minimum. ${gate.reason}`,
        severity:    'warning',
      });
    }

    if (gate.requires?.length > 0 && !gate.requires.some(r => expandedSet.includes(r))) {
      if (gate.suggestionOnly) {
        // Soft dependency — push as a suggestion, not a violation
        suggestions.push({
          type:        'suggestion',
          institution: instName,
          reason:      gate.reason,
          suggested:   gate.requires,
        });
      } else {
        violations.push({
          type:        'dependency_violation',
          institution: instName,
          missing:     gate.requires,
          reason:      gate.reason,
          severity:    'error',
        });
      }
    }

    if (gate.requiresAny?.length > 0 && !gate.requiresAny.some(r => expandedSet.includes(r))) {
      violations.push({
        type:        'dependency_violation',
        institution: instName,
        missing:     gate.requiresAny,
        reason:      gate.reason,
        severity:    'warning',
      });
    }

    if (gate.blockedBy?.length > 0) {
      const blocker = gate.blockedBy.find(b => expandedSet.includes(b));
      if (blocker) {
        violations.push({
          type:        'exclusion_violation',
          institution: instName,
          blockedBy:   blocker,
          reason:      `${instName} cannot coexist with ${blocker}.`,
          severity:    'error',
        });
      }
    }
  });

  // ── INSTITUTION_SPATIAL: trade-route access checks ────────────────────────
  INSTITUTION_SPATIAL.forEach(entry => {
    if (!expandedSet.includes(entry.institution)) return;
    if (entry.exception && expandedSet.includes(entry.exception)) return;
    if (!entry.requiredAccess) return;
    if (entry.requiredAccess.includes(route)) return;

    violations.push({
      type:           'access_violation',
      institution:    entry.institution,
      requiredAccess: entry.requiredAccess,
      actualAccess:   route,
      reason:         entry.reason,
      note:           entry.note || null,
      severity:       'error',
    });
  });

  // ── Low-magic exotic institution warnings ─────────────────────────────────
  const HIGH_MAGIC_INSTITUTIONS = [
    'Airship docking', 'Golem workforce', 'Undead labor', 'Dream parlor',
    'Magical banking', 'Message network', 'Planar embassy', 'Teleportation circle',
    'Magic item consignment', 'Enchanting quarter', 'High magic district',
    'Extradimensional vault',
  ];
  if (effectiveMagicLevel === 'low') {
    HIGH_MAGIC_INSTITUTIONS.forEach(instName => {
      if (expandedSet.includes(instName)) {
        violations.push({
          type:        'context_warning',
          institution: instName,
          reason:      `Magic level is set to Low. ${instName} would be exceptionally rare and likely controversial in this setting.`,
          severity:    'warning',
        });
      }
    });
  }

  // ── Government exclusivity ────────────────────────────────────────────────
  Object.entries(GOVERNMENT_INSTITUTIONS).forEach(([group, options]) => {
    const present = options.filter(opt => instNames.includes(opt));
    if (present.length > 1) {
      violations.push({
        type:        'exclusivity_violation',
        institution: present.join(' / '),
        group,
        conflicting: present,
        reason:      `Only one ${group} option should be selected: ${present.join(', ')} are mutually exclusive.`,
        severity:    'warning',
      });
    }
  });

  // ── Military adequacy checks ──────────────────────────────────────────────
  const lowerNames  = instNames.map(n => n.toLowerCase());
  const hasFort     = lowerNames.some(n =>
    n.includes('wall') || n.includes('citadel') || n.includes('garrison') ||
    n.includes('barracks') || n.includes('palisade') || n.includes('earthwork'));
  const hasMilForce = lowerNames.some(n =>
    n.includes('garrison') || n.includes('guard') || n.includes('militia') ||
    n.includes('barracks') || n.includes('mercenary') || n.includes('watch'));

  const resolvedMilPriority = milPriority ?? 50;

  if (threat === 'plagued') {
    const isTownPlus = getTradeRouteFeatures(tier || 'village');

    if (!hasFort && !hasMilForce) {
      violations.push({
        type:        'survival_crisis',
        institution: 'Settlement (Regional Threat)',
        reason:      'Embattled region with no fortification or military force. Constant creature pressure makes this settlement unsurvivable without defensive infrastructure.',
        severity:    isTownPlus ? 'warning' : 'error',
      });
    } else if (!hasFort) {
      violations.push({
        type:        'survival_crisis',
        institution: 'Settlement (Regional Threat)',
        reason:      'Embattled region with no fortification. Walls, a palisade, or a citadel are not optional under constant creature pressure. Defenders need something to stand behind.',
        severity:    isTownPlus ? 'warning' : 'error',
      });
    } else if (!hasMilForce) {
      violations.push({
        type:        'survival_crisis',
        institution: 'Settlement (Regional Threat)',
        reason:      'Embattled region with no military force. Walls without defenders are a convenient funnel. A garrison, militia, or mercenary force is required.',
        severity:    isTownPlus ? 'warning' : 'error',
      });
    } else {
      // Has both — check funding level
      if (resolvedMilPriority < 25) {
        violations.push({
          type:        'survival_crisis',
          institution: 'Regional Threat',
          reason:      `Embattled region: Military priority is ${resolvedMilPriority}/100. Infrastructure exists on paper but this level of underfunding means the defences are barely maintained and the garrison is skeletal. This settlement will fall.`,
          severity:    'error',
        });
      } else if (resolvedMilPriority < 40) {
        violations.push({
          type:        'survival_crisis',
          institution: 'Regional Threat',
          reason:      `Embattled region: Military priority is ${resolvedMilPriority}/100. Fortification and forces are present but chronically underfunded: poor equipment, low morale, and thin reinforcement. A beleaguered outpost surviving on the edge.`,
          severity:    'warning',
        });
      }
    }
  } else if (threat === 'frontier' && !hasFort && tierAtLeast(tier, 'town')) {
    violations.push({
      type:        'survival_crisis',
      institution: 'Settlement (Regional Threat)',
      reason:      'Frontier region with no fortification. Active monster threats make an unfortified town-scale settlement a liability. Raiders and creatures exploit the lack of a perimeter.',
      severity:    'warning',
    });
  }

  // ── City/metropolis must have professional military ───────────────────────
  const isCityPlus = tier === 'city' || tier === 'metropolis';
  const isMetropolis = tier === 'metropolis';

  if (isCityPlus) {
    const hasProfMilitary = lowerNames.some(n =>
      n.includes('garrison') || n.includes('professional guard') ||
      n.includes('professional city watch') || n.includes('multiple garrison'));
    if (!hasProfMilitary) {
      violations.push({
        type:        'structural_gap',
        institution: 'Settlement Defense',
        reason:      `A ${tier} without a garrison or professional guard is indefensible. City-scale settlements require permanent military infrastructure. The walls require someone to man them.`,
        severity:    'error',
      });
    }
  }

  if (isMetropolis) {
    const hasMultiple = lowerNames.some(n =>
      n.includes('multiple garrison') || n.includes('professional guard'));
    const hasSingle = lowerNames.some(n =>
      n.includes('garrison') || n.includes('barracks'));
    const hasCityWatch = lowerNames.some(n =>
      n.includes('professional city watch') || n.includes('professional guard') || n.includes('city watch'));
    if (!hasMultiple && !(hasSingle && hasCityWatch)) {
      violations.push({
        type:        'structural_gap',
        institution: 'Settlement Defense',
        reason:      'A metropolis requires multiple garrisons or a professional guard force of hundreds. A single garrison cannot secure a city of this scale.',
        severity:    'warning',
      });
    }
  }

  // ── Isolation viability ───────────────────────────────────────────────────
  // Small isolated settlements (thorp/hamlet) are subsistence economies — historically valid
  if (['thorp','hamlet'].includes(tier) && route === 'isolated') {
    // Derive the ~40% subsistence-struggle gate from a STABLE hash of the
    // settlement's identity (tier + route + sorted institution names) instead of
    // a live RNG draw. The validator is also called on the re-render-heavy draft
    // path (domain/coherence/checkDraftEdit) where no seeded RNG is active, so a
    // raw _rng() previously fell back to Math.random() and the warning flickered
    // on/off each render (and tripped the rngContext 'not reproducible' warning).
    // Hashing keeps the result deterministic and identical for the same
    // settlement on every call, on both the generation and draft paths.
    const struggleKey = `${tier}|${route}|${[...instNames].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join(',')}`;
    if (hash01(struggleKey) < 0.40) {
      violations.push({
        type:        'subsistence_struggle',
        institution: `${tier.charAt(0).toUpperCase()+tier.slice(1)} Settlement`,
        reason:      `This isolated ${tier} exists on the edge of survival. No trade, no outside medicine, no grain reserves. A bad harvest, a harsh winter, or a disease outbreak could collapse it entirely.`,
        severity:    'warning',
        suggestedFixes: [
          'Consider a food or medicine cache as a plot element',
          'A wandering healer or trader would be a significant event for this community',
        ],
      });
    }
    violations.push({
      type:        'subsistence_economy',
      institution: `${tier.charAt(0).toUpperCase()+tier.slice(1)} Settlement`,
      reason:      'Subsistence economy. No trade routes means no imports, no exports, and no market participation. The settlement produces only what it needs to survive, and relies on its immediate environment entirely.',
      severity:    'info',
      suggestedFixes: [
        'Any outside trade good (iron tools, salt, medicine) would be precious and potentially plot-relevant',
      ],
    });
  }

  if (getTradeRouteFeatures(tier) && route === 'isolated') {
    const hasMagicTrade = hasTeleportationInfra(instNames.map(n => ({ name: n })), config);
    const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

    if (hasMagicTrade) {
      suggestions.push({
        type:        'suggestion',
        institution: `${tierLabel} Settlement`,
        reason:      `${tierLabel} sustains itself in isolation via magical infrastructure. Trade flows through teleportation or planar channels. If magic fails, the settlement has no physical trade fallback.`,
        suggested:   ['Add a road, river, or port trade route as redundancy'],
      });
    } else {
      violations.push({
        type:        'isolation_violation',
        institution: `${tierLabel} Settlement`,
        reason:      `A ${tier} cannot realistically exist in isolation without a trade route or magical infrastructure. Only thorps, hamlets, and villages can be isolated.`,
        severity:    'critical',
        suggestedFixes: [
          'Add a road, river, crossroads, or port trade route',
          'Add teleportation circle or planar infrastructure (requires high magic)',
        ],
      });
    }
  }

  // ── Suggestions ───────────────────────────────────────────────────────────
  const inExp = (keyword) => expandedSet.some(n => n.toLowerCase().includes(keyword.toLowerCase()));

  if (tierAtLeast(tier, 'town') && (inExp('Garrison') || inExp('Multiple garrisons') || inExp('Professional guard'))
      && !inExp('wall') && !inExp('citadel') && threat !== 'heartland') {
    suggestions.push({
      type:      'suggestion',
      reason:    threat === 'plagued'
        ? "A garrison without walls is untenable in a embattled region. Defenders have nowhere to make a stand."
        : "Military forces shelter behind walls. A garrison without a perimeter is a vulnerability on the frontier.",
      suggested: ['Town walls', 'City walls and gates'],
    });
  }

  if ((inExp('International trade center') || inExp('Major port')) && !inExp('Warehouse')) {
    suggestions.push({
      type:      'suggestion',
      reason:    'Major trade centers need warehouse facilities for bulk goods storage.',
      suggested: ['Warehouse district'],
    });
  }

  if (tierAtLeast(tier, 'city') && (inExp('Mages') || inExp('Wizard')) && !inExp('Alchemist')) {
    suggestions.push({
      type:      'suggestion',
      reason:    'Magical communities attract alchemists. Reagent supply is mutually beneficial.',
      suggested: ['Alchemist quarter', 'Alchemist shop'],
    });
  }

  if (threat === 'frontier' && !inExp('wall') && !inExp('citadel') && !inExp('palisade')
      && !tierAtLeast(tier, 'town')) {
    suggestions.push({
      type:      'suggestion',
      reason:    'Frontier region: even small settlements benefit from a palisade or earthwork against monster incursions.',
      suggested: ['Palisade or earthworks', 'Citizen militia'],
    });
  }

  if (route === 'port' && !inExp('Dock') && !inExp('port') && !inExp('harbour')) {
    suggestions.push({
      type:      'suggestion',
      reason:    'A port settlement without dock facilities cannot service the ships its location implies.',
      suggested: ['Docks/port facilities'],
    });
  }

  if (route === 'river'
      && !inExp('Dock') && !inExp('Mill') && !inExp('Fisher')
      && !inExp('barge') && !inExp('harbour') && !inExp('harbor')) {
    suggestions.push({
      type:      'suggestion',
      reason:    'A river settlement should exploit its water access: mills, docks, or fishmongers.',
      suggested: ['Docks/port facilities', 'Mill'],
    });
  }

  if (tierAtLeast(tier, 'city') && inExp('Thieves') && !inExp('Courthouse') && !inExp('City hall')
      && !inExp('Multiple court')) {
    suggestions.push({
      type:      'suggestion',
      reason:    'A powerful criminal organization usually exists in tension with law. Courts and criminal infrastructure co-evolve.',
      suggested: ['Courthouse', 'Multiple court buildings'],
    });
  }

  // ── Resource access violations ────────────────────────────────────────────
  (config?.nearbyResources || []).forEach(resourceKey => {
    const data = RESOURCE_DATA[resourceKey];
    if (data?.forbidden?.includes(route)) {
      violations.push({
        type:        'resource_access_violation',
        institution: data.label,
        reason:      data.incompatibleReason || data.warning || `${data.label} is not compatible with ${route} access.`,
        severity:    'warning',
      });
    }
  });

    // ── Out-of-tier contradictions (by-design) ─────────────────────────────────
  // These are not errors — they're DM choices. Surface them in Viability as
  // "By Design Contradictions" so the DM knows the tension exists.
  const outOfTierInsts = (institutions || []).filter(i => i.outOfTier);
  outOfTierInsts.forEach(inst => {
    violations.push({
      type:        'out_of_tier',
      institution: inst.name,
      reason:      `${inst.name} is a ${inst.nativeTier || 'higher'}-tier institution in a ${tier} settlement. This is a deliberate override. The settlement has infrastructure beyond its normal scale.`,
      severity:    'by_design',
      suggestedFixes: ['This contradiction is intentional. No fix needed unless you want to remove the institution'],
    });
  });

  // ── Exclusivity conflicts (by-design) ───────────────────────────────────────
  // Two institutions in the same exclusive group both present — flag but don't block.
  const exclusiveGroupMap = {};
  (institutions || []).forEach(inst => {
    if (!inst.exclusiveGroup) return;
    if (!exclusiveGroupMap[inst.exclusiveGroup]) exclusiveGroupMap[inst.exclusiveGroup] = [];
    exclusiveGroupMap[inst.exclusiveGroup].push(inst.name);
  });
  Object.entries(exclusiveGroupMap).forEach(([group, names]) => {
    if (names.length > 1) {
      violations.push({
        type:        'exclusivity_conflict',
        institution: names.join(' + '),
        reason:      `${names.join(' and ')} normally cannot coexist (exclusive group: ${group}). This is a deliberate override: expect political tension, power struggle, or a unique historical circumstance.`,
        severity:    'by_design',
        suggestedFixes: ['This contradiction is intentional. Use it as a plot seed: why do both exist?'],
      });
    }
  });

  // ── Magic-only trade dependency (isolated town+ with teleportation) ────────
  if (config?._magicTradeOnly) {
    suggestions.push({
      type:        'suggestion',
      institution: 'Magical Trade Infrastructure',
      reason:      `This ${tier} exists in isolation through magical infrastructure alone. Every import and export flows through the teleportation circle. If the magic fails, the settlement cannot survive without physical trade routes.`,
      suggested:   ['Redundant arcane institution', 'Physical road or river route'],
    });
  }

  return { violations, suggestions };
};

// ─── getBaseChance ────────────────────────────────────────────────────────────
/**
 * Calculate the final spawn probability for an institution given the settlement
 * configuration. Applies priority slider multipliers, trade route bonuses/penalties,
 * monster threat modifiers, and goods-toggle penalties.
 *
 * @param {number} baseChance    - Institution's raw base probability (0–1)
 * @param {string} category      - Category string e.g. "economy", "defense"
 * @param {string} name          - Institution name string
 * @param {Object} config        - Settlement config
 * @param {Object} [neighbor]    - Imported neighbor settlement (or null)
 * @param {Object} [goodsToggles]- Goods toggle overrides
 * @returns {number} Adjusted probability clamped to [0, 1]
 */
