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

import { resolvePrimaryStress } from './stressPriority.js';
import { deriveTradeCommodity } from './tradeCommodity.js';
import { buildCurrentTensionTokens, renderHistoryTemplate } from './historyTemplate.js';
import { pick, random01, randInt } from './helpers.js';
import { random as _rng, getActiveRng } from '../kernel/rngContext.js';

import { genArrivalDetail } from './narrativeGenerator.js';
import { AGE_BY_TIER, HISTORICAL_EVENTS_DATA, EVENT_TYPE_NAMES, historyDescription, tensionDescription } from '../data/historyData.js';
import { resolveGenerationWorldLaw } from './generationContext.js'; import { defenseFactsOf } from '../domain/defense/defenseFacts.js'; import { crimeSignalOf } from '../domain/crimeSignal.js'; // R6 (and F4 unit 3b): one line, so no cited line moves
import {
  STRESS_TO_TENSION,
  TIMELINE_CATEGORY_TYPES,
} from './history/historyPolicyData.js';
import { deriveHistoryRouteContext } from './history/historyRouteContext.js';
import { drawDeclared, filterDeclared, lineText } from '../domain/facts/drawDeclared.js';
import { factsOf } from '../domain/facts/factsOf.js';
import { generateSafetyNarrative2, generateTradeNarrative2 } from './history/historyEventStrands.js';
export {
  STRESS_TO_TENSION,
  TIMELINE_CATEGORY_TYPES,
} from './history/historyPolicyData.js';


/**
 * Return a randomised settlement age in years appropriate for its tier.
 * @param {string} tier
 * @returns {number}
 */
const getSettlementAge = tier => {
  const range = AGE_BY_TIER[tier] || AGE_BY_TIER.town;
  return randInt(range.min, range.max);
};

const resolveSettlementAge = (tier, config = {}) => {
  const mode = config.settlementAgeMode || 'auto';
  if (mode === 'new') return 0;
  if (mode === 'custom') {
    const years = Math.floor(Number(config.settlementAgeYears ?? 0));
    return Math.max(0, Math.min(5000, Number.isFinite(years) ? years : 0));
  }
  return getSettlementAge(tier);
};

// ─── buildHistoryContext ──────────────────────────────────────────────────────
/**
 * Extract the context object used by generateTradeNarrative2 and related helpers.
 * Classifies institution presence and economic state into descriptive fields.
 *
 * @param {Object} config        - Settlement config
 * @param {Array}  institutions  - Institution objects
 * @param {Object} economicState - Generated economic state
 * @param {Object} powerStructure - Generated power structure
 * @returns {Object} Context object with named descriptors
 */
const buildHistoryContext = (
  config,
  institutions = [],
  economicState = null,
  powerStructure = null,
  worldLaw,
) => {
  const { tradeRouteAccess: route = 'road', magicLevel = 'medium', monsterThreat: threat = 'frontier' } = config;

  // Determine primary trade commodity — unified scan (tradeCommodity.js); the
  // strict variant (null fallback) because history prose interpolates it.
  const exports = economicState?.primaryExports || [];
  const tradeCommodity = deriveTradeCommodity(economicState);

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

  const routeContext = deriveHistoryRouteContext(
    route,
    worldLaw,
    tradeCommodity,
    threat,
  );

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
    // resolveResources writes the resolved resource list back to config.nearbyResources;
    // surface it so the resource-anchored history events below are reachable.
    nearbyResources: config.nearbyResources || [],
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
    ...routeContext,
    magicInsts,
    hasTower,
    hasGuildMag,
  };
};


/**
 * THE TIMELINE HOOK'S RESOLUTION (CENSUS-1f unit 3). `drawDeclared` over the drawn row and the
 * template's other rows not yet printed (the rows still in the roll's domain, less those an earlier
 * resolution printed); the drawn row is returned unless it is refused or already printed.
 * @param {any} drawnRow @param {any} eventTemplate @param {any[]} remaining @param {Set<unknown>} taken
 * @param {string[]} printed @param {object | (() => object) | null} facts
 */
const resolveTimelineHook = (drawnRow, eventTemplate, remaining, taken, printed, facts) => {
  const domain = [drawnRow, ...remaining.filter((row) => !taken.has(row) && !printed.includes(lineText(row)))];
  const already = taken.has(drawnRow);
  const r = drawDeclared(domain, {
    draw: () => drawnRow, facts, poolId: `historyData:HISTORICAL_EVENTS_DATA.plotHooks:${eventTemplate?.type ?? ''}`,
    surface: 'history', drawKind: 'R', key: `${getActiveRng()?.seed ?? ''}::${eventTemplate?.type ?? ''}::${lineText(drawnRow)}`, // R-AT (CENSUS-1i unit 5): the settlement's identity leads the key
  });
  if (!already) return r.line;
  const others = domain.slice(1);
  return others.length ? drawDeclared(others, { draw: (p) => p[0], facts, poolId: `historyData:HISTORICAL_EVENTS_DATA.plotHooks:${eventTemplate?.type ?? ''}`, key: `${getActiveRng()?.seed ?? ''}::${eventTemplate?.type ?? ''}::taken`, surface: 'history', drawKind: 'R' }).line : null;
};

// ─── generateEventNarrative ───────────────────────────────────────────────────
/**
 * Render a historical event at a specific point in time, substituting template
 * variables and selecting effects/hooks appropriate to the event severity.
 */

const generateEventNarrative = (eventTemplate, yearsAgo, extraTokens = {}, descSeed = null, hookFacts = null) => {
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

  // CONTENT-GT-FINAL (Charge 1): draw-free variant pick
  // (historyData.historyDescription). The draw count remains fixed:
  // defaultTokens builds every pick regardless of which tokens the chosen
  // variant references, then the renderer resolves every occurrence.
  const description = renderHistoryTemplate(historyDescription(eventTemplate, descSeed), defaultTokens);

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
    /** @type {Set<unknown>} rows already printed by a resolution, never printed twice */
    const taken = new Set();
    for (let i = 0; i < Math.min(hookCount, availableHooks.length); i++) {
      const idx = randInt(0, availableHooks.length - 1);
      // CENSUS-1f unit 3 (Appendix B item 12, R): the roll and its splice are unchanged (the drawn row
      // leaves the domain, so every later roll's range is as before, and the loop's length too). The
      // drawn row is then RESOLVED through `drawDeclared` against CENSUS-3d's declarations: refused
      // (or already printed by an earlier resolution), it gives way to the hash argmax over the
      // template's admitted, unprinted rows; none → this roll prints nothing. The ECHO roll below is
      // keyed on the DRAWN row's tense, so the roll count never depends on the resolution.
      const drawnRow = availableHooks.splice(idx, 1)[0];
      const resolvedRow = resolveTimelineHook(drawnRow, eventTemplate, availableHooks, taken, selectedHooks, hookFacts);
      const drawnText = lineText(drawnRow);
      let hook = resolvedRow == null ? null : lineText(resolvedRow);
      if (resolvedRow != null && resolvedRow !== drawnRow) taken.add(resolvedRow);
      // For older events (last century: 30–80y), reframe present-tense hooks as
      // historical discoveries — things uncovered now, not things actively happening.
      if (yearsAgo > 30 && drawnText) {
        // {colour} (CENSUS-2e, R-R and R-AD; ledger ECHO_PREFIXES_DOSSIER.json): each prefix frames a past
        // discovery (old records, a document, an archivist's notes from that period); none asserts what the
        // place holds now, so none is a roster claim.
        const ECHO_PREFIXES = [
          'Old records suggest ',
          'A recently surfaced document implies ',
          'Family accounts passed down from the time claim ',
          "An archivist's notes from that period reveal ",
          'Evidence that survived the years indicates ',
        ];
        // Only prefix hooks that read as present-tense (contain present-tense signals)
        const presentTenseSignals = [' is ', ' are ', ' has ', ' have ', ' exists', ' exist', ' being '];
        const needsReframe = presentTenseSignals.some(sig => drawnText.toLowerCase().includes(sig));
        if (needsReframe) {
          const prefix = ECHO_PREFIXES[Math.floor(_rng() * ECHO_PREFIXES.length)];
          // Lowercase the first letter of the hook when adding prefix (CENSUS-1f: a resolved row that
          // does not read as present tense keeps its own words; the roll was the drawn row's)
          if (hook && presentTenseSignals.some(sig => hook.toLowerCase().includes(sig))) hook = prefix + hook.charAt(0).toLowerCase() + hook.slice(1);
        }
      }
      if (hook) selectedHooks.push(hook);
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
 * THE TENSION TEMPLATES' DECLARATIONS (R-AL, CENSUS-1g unit 4), read at the selection: a template
 * that presumes a fact declares it beside the table (never on the template object, which is spread
 * into the record). `demographic_pressure` presumes a live migration — `crisis: migration` (R-I:
 * "one of K must be active" is THE spelling; a bare `migration` is no atom). A refused template
 * is set aside and the selection's own fallback draws the next one (no draw moved, R-Q).
 * @type {Readonly<Record<string, Readonly<{ crisis?: ReadonlyArray<string> }>>>}
 */
export const TENSION_TEMPLATE_DECLARATIONS = Object.freeze({
  demographic_pressure: Object.freeze({ crisis: Object.freeze(['migration']) }),
});

/**
 * Is a selected tension template admitted by the birth so far (noted in the ledger when it declares)?
 * @param {{ type: string }} tmpl @param {any} facts the history's `hookFacts` thunk
 */
const tensionAdmitted = (tmpl, facts) => {
  const decl = TENSION_TEMPLATE_DECLARATIONS[tmpl.type];
  if (!decl) return true;
  const line = Object.freeze({ text: tmpl.type, ...decl });
  return drawDeclared([line], {
    draw: (p) => p[0], facts, poolId: 'historyData:HISTORICAL_EVENTS_DATA.tension', surface: 'history', drawKind: 'R', key: `${getActiveRng()?.seed ?? ''}::historyData:HISTORICAL_EVENTS_DATA.tension`, // R-AT (CENSUS-1i unit 5)
  }).line !== null;
};
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
  context = {},
  worldLaw,
  hookFacts = null,
) => {
  // Resolve active stress type
  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = resolvePrimaryStress(stresses);

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
  // R6 (soak 1000 rung 1, kind 4): with no military faction, the enforcing party is the force
  // the place's record holds, in safetyProfile.js's own words (its `lawRef`), never a garrison
  // the place lacks.
  const facts = defenseFactsOf({ institutions });
  const forceParty = facts.hasGarrison ? 'The garrison' : facts.hasWatch ? 'The watch' : facts.hasMilitia ? 'The militia' : 'Local enforcement';

  // Stress → tension type mapping (hoisted to module scope + exported so the
  // stress-registration walker can assert every target resolves to a real
  // HISTORICAL_EVENTS_DATA template — the class of bug where a stress mapped to
  // a tension type that had no template, and the tension was silently dropped).

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
        const commodity = deriveTradeCommodity(economicState) || 'key goods';
        // Viability issues carry `.description` canonically; only stress-derived ones
        // also set `.message`. Reading `.message` alone interpolated the literal
        // 'undefined' into dossier/PDF/AI-grounding prose for every description-only
        // top issue (isolated towns, non-stress import dependencies — the majority).
        // Fall back to `.description`, and omit the trailing sentence entirely when
        // neither is present rather than emitting a dangling clause.
        const topIssue = economicViability.issues[0];
        const issueText = topIssue?.message ?? topIssue?.description ?? '';
        // W1 ECO second seat (the owner's style law, 2026-11-07): the lead names what the place lives
        // by (its first export) and says that trade is strained; the top issue that follows is the
        // evidence (on a migration it is the ARRIVALS food note; a departures record writes none).
        const lead = `Life here runs mostly on the ${commodity} trade, and that trade is under strain.`;
        selected.push({
          ...tmpl,
          description: issueText ? `${lead} ${issueText}` : lead,
          specificIssue: issueText,
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
      if (tmpl && tensionAdmitted(tmpl, hookFacts)) {
        selected.push({ ...tmpl });
        usedTypes.add(tensionType);
      }
    }
  }

  // Fill remaining slots from templates permitted by the run-scoped law. This
  // covers both arcane types and the resolved generated-content boundaries.
  const pool = HISTORICAL_EVENTS_DATA.filter(
    event => !usedTypes.has(event.type) && worldLaw.allowsHistoryEvent(event),
  );
  while (selected.length < targetCount && pool.length > 0) {
    let candidate = pick(pool);
    // Bias toward guild conflict if guilds present
    if (hasGuild && candidate.type !== 'guild_conflict' && _rng() > 0.7) {
      const guildTmpl = pool.find(e => e.type === 'guild_conflict');
      if (guildTmpl) candidate = guildTmpl;
    }
    pool.splice(pool.indexOf(candidate), 1);
    // ⛔ NO CRIME WAVE WITHOUT CRIME (lane RUNG1B-F4 unit 3b, 2026-11-04;
    // docs/F4_CRIME_SIGNAL_2026-11-04.md). The fill drew `crime_wave` in places with no criminal
    // faction and no criminal house, and its "the criminal network" and "A guard captain is on
    // the payroll of the criminal network" printed beside "No criminal infrastructure" (soak1k-134,
    // -830, -842: three of A-06's 16). Where the crime signal's one home reads none, the drawn
    // template is set aside and the loop draws again, so only those places' streams move. The
    // roster here is the pre-trim one; the density law's trim only removes a criminal faction,
    // never adds one, so "none here" is "none on the final record".
    if (candidate.type === 'crime_wave' && !crimeSignalOf({ seats: factions, estate: institutions }).present) continue;
    if (!tensionAdmitted(candidate, hookFacts)) continue; // R-AL: a template that presumes a fact declares it
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
      .replace(/Official guards/g, milFaction || forceParty)
      .replace(/Criminal organisations/g, crimeFaction || 'the criminal network')
      .replace(/Orthodox believers/g, relFaction || 'the orthodox clergy')
      .replace(/Power behind throne/g, altFaction !== govFaction ? altFaction : merchantRef);
    // Remove accidental doubled nouns (e.g. "the council vs the council")
    result = result.replace(/\b(.{4,40}) vs \1\b/g, '$1');
    return result;
  };

  const tensionTokens = buildCurrentTensionTokens(context);
  return selected
    .filter(worldLaw.allowsHistoryEvent)
    .map(({ descriptionByDirection, ...tension }) => ({ // #20: the direction table is the template's, never the record's
      ...tension,
      description: renderHistoryTemplate(
        substituteNames(tensionDescription({ ...tension, descriptionByDirection }, config)), // #20: the migration's own direction
        tensionTokens,
      ),
      factions: (tension.factions || []).map(substituteNames),
      // CENSUS-3d unit 6: a tension prints its template's whole hook list (kind A), so the list is
      // filtered by the record (a refused row leaves it) and stored as text; a list that declares
      // nothing is copied unchanged.
      ...(Array.isArray(tension.plotHooks) ? { plotHooks: filterDeclared(tension.plotHooks, { facts: hookFacts, poolId: `historyData:HISTORICAL_EVENTS_DATA.plotHooks:${tension.type}`, surface: 'history', drawKind: 'A' }).map(lineText) } : {}),
    }))
    .filter(worldLaw.allowsHistoryEvent);
};

// ─── generateRelationshipEvent ────────────────────────────────────────────────
/**
 * Generate the timeline of historical events for this settlement.
 * Produces a series of events spread across the settlement's age,
 * weighted by the current economic/political/social situation.
 */
// Hoisted out of the per-event find() callback (generators-domain-6): the map
// from a picked history CATEGORY to the pool of template types that satisfy it.
// A seeded pick among the pool (rather than find()'s first-match) gives arcs
// variety within a category and lets a re-picked category contribute a DIFFERENT
// template toward the tier's event budget. The new market_crash/trade_collapse/
// great_fire/plague_years/great_flood/heresy_trial/pilgrimage_surge/popular_uprising/
// tyranny/wild_magic types deepen the pools so city/metropolis can reach 12/20.
// Stress → tension-template mapping (hoisted from buildHistoricalEvent so the
// registration walker can verify every target is a real HISTORICAL_EVENTS_DATA type).
const generateRelationshipEvent = (age, tier, config, context, worldLaw, hookFacts = null) => {
  // Number of history events (scaled by age)
  const _ageFraction = age / 100;
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
  if (!worldLaw.magicFunctions()) {
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

    // Seeded pick among ALL still-unused templates matching this category (was a
    // find() that always returned the first match → no variety, and a re-picked
    // category could never add a distinct arc). Empty pool (category exhausted) →
    // skip this slot.
    const candidateTypes = TIMELINE_CATEGORY_TYPES[cat] || [];
    const pool = HISTORICAL_EVENTS_DATA.filter(
      event => (
        candidateTypes.includes(event.type)
        && !usedNames.has(event.name || event.type || '')
        && worldLaw.allowsHistoryEvent(event)
      ),
    );
    if (!pool.length) continue;
    const tmpl = pool[Math.floor(_rng() * pool.length)];
    // Track the exact template so it is not emitted twice this timeline.
    const tmplName = tmpl.name || tmpl.type || '';
    usedNames.add(tmplName);

    // Spread event across the age timeline. Clamp the bounds so a young (custom-age)
    // settlement never produces events older than itself — randInt(5, <5) used to
    // invert and yield negative timeline years for ages 1-4.
    const fraction = i / eventCount;
    const nextFraction = (i + 1) / eventCount;
    const minYearsAgo = Math.floor(age * fraction);
    const maxYearsAgo = Math.floor(age * nextFraction);
    const loYearsAgo = Math.min(Math.max(minYearsAgo, 5), age);
    const hiYearsAgo = Math.max(loYearsAgo, maxYearsAgo);
    const yearsAgo = Math.min(age, randInt(loYearsAgo, hiYearsAgo));

    // Build context tokens
    const contextTokens = context ? generateTradeNarrative2(cat, context) : {};

    const event = generateEventNarrative(tmpl, yearsAgo, contextTokens, `${config?._seed ?? ''}::histEvent::${i}::${tmpl.type}`, hookFacts);
    event.type = cat;
    // Preserve the stable template id alongside the display category. The final
    // dedup keys on templateType (not category), so two distinct arcs in the same
    // category both survive — which is what lets city/metropolis fill their budget.
    event.templateType = tmpl.type;
    events.push(event);
  }

  events.sort((a, b) => b.yearsAgo - a.yearsAgo);

  if (!context) return events.sort((a, b) => a.yearsAgo - b.yearsAgo);

  // Anchor events to settlement-appropriate narratives. Iterate a timeline-ordered
  // copy but write each replacement back to the event's REAL slot in `events`. The
  // previous version wrote events[idx] using an index into a differently-sorted copy,
  // which scrambled the timeline and lost/duplicated events; and for categories with
  // no anchor it fell back to re-rendering the already-rendered events[idx], so
  // pick() turned that event's string severity into a single character. Every
  // category the main loop can emit now maps to a real template; an unmapped one
  // keeps its original event rather than the corrupting fallback.
  const ANCHOR_TYPE_MAP = {
    economic: 'economic_disparity',
    political: 'succession_crisis',
    disaster: 'external_threat',
    religious: 'religious_tension',
    magical: 'magical_controversy',
    occupation_infiltration: 'infiltration_fear',
    exile_return: 'occupation_legacy',
    demographic: 'population_friction',
  };
  const anchoredOrder = [...events].sort((a, b) => a.yearsAgo - b.yearsAgo);
  const anchoredTypes = new Set();

  anchoredOrder.forEach((event) => {
    const cat = event.type;
    if (anchoredTypes.has(cat)) return;
    anchoredTypes.add(cat);

    const contextTokens = generateTradeNarrative2(cat, context) || {};
    if (_rng() < 0.6) {
      const anchorType = ANCHOR_TYPE_MAP[cat];
      const tmpl = anchorType
        ? HISTORICAL_EVENTS_DATA.find(event => (
            event.type === anchorType
            && worldLaw.allowsHistoryEvent(event)
          ))
        : null;
      if (!tmpl) return; // no settlement-appropriate anchor — keep the original event
      const replacement = generateEventNarrative(tmpl, event.yearsAgo, contextTokens, `${config?._seed ?? ''}::histAnchor::${cat}::${tmpl.type}`, hookFacts);
      if (replacement) {
        replacement.type = cat;
        replacement.templateType = tmpl.type; // thread the anchor's template id for the dedup
        replacement.anchored = true;
        const realIdx = events.indexOf(event);
        if (realIdx !== -1) events[realIdx] = replacement;
      }
    }
  });

  // Re-sort: anchor replacements preserve yearsAgo, but keep the timeline canonical.
  events.sort((a, b) => (b.yearsAgo || 0) - (a.yearsAgo || 0));

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
        'A clause in the compact entitles certain families to first refusal on grain sales, and the current shortage makes that clause valuable',
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
        defenseFactsOf({ institutions: context?._institutions || [] }).hasWalls ? "A period of ambitious stone construction transformed the settlement's character. Walls, civic buildings, or a cathedral raised from local quarry stone. The quarry workers became a political force." : "A period of ambitious stone construction transformed the settlement's character. Civic buildings or a cathedral raised from local quarry stone. The quarry workers became a political force.", // F1: walls only where they stand
      lastingEffects: [
        "Quarrymen's guild retains unusual civic influence",
        "Architectural legacy of the construction period defines the settlement's visual character",
      ],
      plotHooks: [
        'Something was sealed inside the walls during construction, deliberately',
        "The quarry foreman's descendants claim unpaid wages from the original commission",
      ],
      severity: ['major'],
      type: 'economic',
      yearsAgo: resourceAge,
      anchored: false,
    });
  }
  // [D6 THE UNDERWAYS] DEFERRED-with-reason: an underways founding mention ("dug during the
  // siege…") belongs in this resourceEvents pool, conditioned on the excavation-competence
  // resources (coal/iron/stone/gemstone). It is NOT added here because historyGenerator.js sits
  // exactly at its frozen size-ratchet ceiling (scripts/.size-baseline.json = 883 effective
  // lines) — any code line trips sizeBaseline.test.js, and the wave protocol forbids raising the
  // baseline while decomposing this file is outside the catalog-half fence. Every other D6
  // parity element (catalog, facets, services, geography, stress content, NPC office) shipped;
  // this cosmetic timeline beat lands when historyGenerator.js is decomposed. (docs/review-r2/G2_SHIFT_MAP.md)
  if (
    worldLaw.allowsHistoryEvent('magical')
    && hasResource(['magical_node'])
    && _rng() < 0.45
  ) {
    resourceEvents.push({
      name: 'The Arcane Incident',
      description:
        'A catastrophic or transformative event tied to the local ley line concentration occurred, permanently altering a district of the settlement and the lives of its inhabitants.',
      lastingEffects: [
        'Affected district retains residual magical effects',
        'Arcane regulatory body established with unusual local authority',
      ],
      plotHooks: [
        'The incident was caused by deliberate misuse of the node: someone covered it up',
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
    // Resource events are authored with an array severity (like a template); collapse
    // it to a single rendered string so downstream consumers (e.g. historyBeats
    // severityScore) see the same shape as generateEventNarrative output.
    if (Array.isArray(chosen.severity)) chosen.severity = pick(chosen.severity);
    // Strip plot hooks from ancient resource events (same ≤80y rule)
    if ((chosen.yearsAgo || 0) > 80) chosen.plotHooks = [];
    events.push(chosen);
    events.sort((a, b) => (b.yearsAgo || 0) - (a.yearsAgo || 0));
  }

  // Final deduplication pass (generators-domain-6). Keyed on the stable
  // TEMPLATE type — NOT the display category (which previously capped every
  // settlement at ~one event per category, ~8 total, so city/metropolis could
  // never reach their 12/20 budget) and NOT the rendered title alone
  // (name-keying silently destroyed a real arc whenever two types rendered the
  // same title). Two DIFFERENT arcs in the same category now both survive.
  // A second guard drops any event whose rendered NAME already appeared — this
  // preserves the cross-type title-collision guard for events that carry a name
  // but no templateType (the resource events, e.g. 'The Arcane Incident', which
  // shares a title with magical_controversy). Template titles are pinned unique
  // (tests/generators/historyEventTitles.test.js).
  const seenKeys = new Set();
  const deduped = events.filter(e => {
    if (!worldLaw.allowsHistoryEvent(e)) return false;
    const typeKey = e.templateType ? `t:${e.templateType}` : null;
    const nameKey = e.name ? `n:${e.name}` : null;
    if ((typeKey && seenKeys.has(typeKey)) || (nameKey && seenKeys.has(nameKey))) return false;
    if (typeKey) seenKeys.add(typeKey);
    if (nameKey) seenKeys.add(nameKey);
    return true;
  });

  return deduped;
};

// ─── generateHistory ──────────────────────────────────────────────────────────
// ── W-LIFECYCLE stage 3 — the ancient-ruin flavor vocabulary (opt-in; see the
// generateHistory block below). Kept local: a fallen-city name is a one-shot
// flavor mint, not the settlement-naming machinery.
const ANCIENT_RUIN_CHANCE = 0.15;
const ANCIENT_RUIN_PREFIXES = ['Vael', 'Korrath', 'Ymber', 'Sarn', 'Thal', 'Ondrim', 'Ecser', 'Mor'];
const ANCIENT_RUIN_SUFFIXES = ['akar', 'unde', 'eth', 'ovar', 'ys', 'antle', 'orim', 'ath'];

/**
 * Main export. Assembles the complete history object for a settlement.
 *
 * @param {string} tier            - Settlement tier
 * @param {Object} config          - Settlement config
 * @param {Array}  institutions    - Institution objects
 * @param {Object} economicViability - Result of generateEconomicViability
 * @param {Object} economicState   - Result of generateEconomicState
 * @param {Object} powerStructure  - Result of generatePowerStructure
 * @param {unknown} generationContext - Run-scoped generation law/context
 * @returns {Object} History object with age, founding, events, tensions, character
 */
export const generateHistory = (
  tier,
  config,
  institutions,
  economicViability = null,
  economicState = null,
  powerStructure = null,
  generationContext = null,
) => {
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  // ⛔⛔ THE SETTLEMENT'S AGE IS DRAWN ONCE, HERE, AND NEVER AGAIN. It is a
  // GENERATION-TIME CONSTANT, not a clock: `founding.age = age` below is the ONLY
  // `.age =` assignment in the whole of src/ (measured repo-wide at this tip), and
  // nothing on the advance path rewrites it. MEASURED over twelve `one_year` advances:
  // the campaign calendar runs year 2 -> 13 while `history.age` holds 215, and it holds
  // it THROUGH the record being re-emitted on every one of those ticks (population,
  // powerStructure, populationHistory and activeConditions all move).
  // THE OTHER CLOCK is worldState.js's `calendarFromWeeks`, which re-derives the year
  // from canonical elapsed weeks every tick. Two clocks over one world, one moving and
  // one frozen: `calendar.year` and `history.age` answer different questions and must
  // never be compared or added.
  // ⇒ THE FREEZE IS DELIBERATE AND RECORDED, not an oversight. Advancing the age moves
  // rendered text on every advance, so the diary ruled it REPORTED NOT FIXED
  // (kit/RESUME-NOTE, 2026-09-14). LT40 car 7 PINS the freeze without lifting it:
  // tests/domain/worldPulseTickClock.test.js, "the second clock". The disposition and
  // the price of both cures are docs/ENGINE_DEFECT_DISPOSITIONS.md §5; curing it is
  // owner-gated under §764.3.
  const age = resolveSettlementAge(tier, config);
  const context = buildHistoryContext(
    config,
    institutions,
    economicState,
    powerStructure,
    worldLaw,
  );
  if (context) context._institutions = institutions;

  // Founding narrative. The per-settlement seed for draw-free prose-variant selection
  // rides on config._seed (stamped by the caller) — read at the generateEventNarrative
  // call sites (Charge 1) and, in Charge 4, by genArrivalDetail for STRESS_NOTES.
  const founding = genArrivalDetail(config, context, worldLaw);
  founding.age = age;

  // CENSUS-3d unit 6: the facts a declared history hook is checked against — the birth so far
  // (roster, config, tier, the power structure), read lazily and once. The birth self-check
  // (`cert:false-presumption`) re-asserts every declared hook against the FINAL record.
  let heldHookFacts = null;
  const hookFacts = () => (heldHookFacts ??= factsOf(
    { institutions, config, tier, powerStructure, stress: Array.isArray(config?.stressTypes) ? config.stressTypes.map((type) => ({ type })) : [] },
    worldLaw?.portKind ? { waterKind: worldLaw.portKind } : {},
  ));

  // Historical timeline
  const timeline = age > 0
    ? generateRelationshipEvent(age, tier, config, context, worldLaw, hookFacts) // CENSUS-1f: the timeline hooks resolve against the birth so far
    : [];

  // Current tensions
  const tensions = buildHistoricalEvent(
    institutions,
    economicViability,
    tier,
    economicState,
    config,
    powerStructure?.factions || [], context, worldLaw, hookFacts,
  );

  // Derive historical character from event pattern
  const disasters = timeline.filter(e => e.type === 'disaster').length;
  const political = timeline.filter(e => e.type === 'political').length;
  const economic = timeline.filter(e => e.type === 'economic').length;

  let historicalCharacter = age <= 0 ? 'newly founded and still becoming itself' : 'stable and prosperous';
  if (disasters >= 2) historicalCharacter = 'marked by repeated calamities';
  else if (political >= 2) historicalCharacter = 'politically turbulent';
  else if (economic >= 2) historicalCharacter = 'economically dynamic';
  else if (timeline.some(e => e.severity === 'catastrophic'))
    historicalCharacter = 'defined by a single great catastrophe';

  // ── W-LIFECYCLE stage 3 — GENERATION-SEEDED ANCIENTS (design §2 sub-century
  // honesty: relic ruins arrive mostly as ancients, since a full city→thorp→death
  // arc rarely completes inside 30 years). STRICTLY OPT-IN via config
  // (`ancientRuinsEnabled: true`): the flag check precedes ANY draw, so a world
  // without it consumes ZERO rng and generates byte-identically (the generator
  // golden master never moves — the constitutional generation-side rule).
  // Flavor + map feature only, no live state: an ancient "fallen city" event
  // rides the EXISTING historicalEvents machinery (pre-founding yearsAgo), and
  // `ancientRuin` is the display marker the realm map + dossier draw as ruins.
  let ancientRuin = null;
  if (config?.ancientRuinsEnabled === true && random01(ANCIENT_RUIN_CHANCE)) {
    const ruinName = `${pick(ANCIENT_RUIN_PREFIXES)}${pick(ANCIENT_RUIN_SUFFIXES)}`;
    const ancientYearsAgo = Math.max(age, 0) + randInt(120, 400);
    ancientRuin = { name: ruinName, yearsAgo: ancientYearsAgo };
    timeline.push({
      name: `The Fall of ${ruinName}`,
      type: 'disaster',
      yearsAgo: ancientYearsAgo,
      severity: 'catastrophic',
      description: `Long before the first stone of this settlement was laid, the great city of ${ruinName} fell nearby; its relic ruin still stands: superstition-attracting, its interior the DM's.`,
      lastingEffects: [`The relic ruin of ${ruinName} stands nearby.`],
      plotHooks: [],
      anchored: true,
      ancientRuin: true,
    });
  }

  const noun = tierNounFor(tier), spokenTimeline = timeline.map((e) => /** @type {any} */ (speakRecord(e, noun)));
  return {
    age,
    founding: speakFounding(founding, noun),
    historicalEvents: spokenTimeline,
    currentTensions: Array.isArray(tensions) ? tensions.map((t) => speakRecord(t, noun)) : tensions,
    historicalCharacter,
    ...(ancientRuin ? { ancientRuin } : {}),
    eventsTimeline: spokenTimeline.map(e => ({
      year: age - e.yearsAgo,
      yearsAgo: e.yearsAgo,
      name: e.name,
      type: e.type,
      anchored: e.anchored || false,
    })),
  };
};

// ─── SIZE ruling 2: the stored story text speaks the place's own noun ────────
// ⚠ AT THE END OF THE FILE ON PURPOSE (imports hoist; these helpers are read only when
// generateHistory runs): the prose wiring census's holder citations name this file's producer
// writes by LINE, so nothing is inserted above them.
import { speakTierNoun } from '../domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../domain/display/stateProse/weaveBlock.js';

/**
 * SIZE ruling 2 (coherence program, 2026-11-03, root-cause failure 8): STORY TEXT WRITTEN AT
 * GENERATION NAMES THE PLACE BY ITS OWN NOUN. The history pools (historyData,
 * historyDescVariants) and the founding pools (narrativeData, via genArrivalDetail) were
 * written with 'town' as the word for a settlement of any size, so a village's record read
 * "the trade the town depended on". Every stored prose string of the history record now passes
 * through the dossier kernel's own `speakTierNoun` with the settlement's tier noun — the same
 * helper and the same kept comparisons as every screen and the PDF. A town is identity, so no
 * town's record moves; nothing here draws, so no other field moves.
 * @param {unknown} value a string, an array of strings, or anything else (returned as is)
 * @param {string|null} noun
 * @returns {unknown}
 */
function speakStored(value, noun) {
  if (typeof value === 'string') return speakTierNoun(value, noun);
  if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? speakTierNoun(v, noun) : v));
  return value;
}

/** The prose fields of an event or tension record that a reader sees. */
const STORED_PROSE_KEYS = Object.freeze(['description', 'lastingEffects', 'plotHooks', 'hooks', 'narrative']);

/**
 * @param {unknown} record @param {string|null} noun
 * @returns {unknown} a shallow copy with its prose fields spoken (the record itself if not an object)
 */
function speakRecord(record, noun) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return record;
  const out = /** @type {Record<string, unknown>} */ ({ ...record });
  for (const key of STORED_PROSE_KEYS) if (key in out) out[key] = speakStored(out[key], noun);
  return out;
}

/**
 * The founding: every own string or string-array field is spoken (it carries the founding
 * reason and the stress note drawn from narrativeData).
 * @param {unknown} founding @param {string|null} noun @returns {unknown}
 */
function speakFounding(founding, noun) {
  if (!founding || typeof founding !== 'object' || Array.isArray(founding)) return founding;
  const out = /** @type {Record<string, unknown>} */ ({ ...founding });
  for (const [key, value] of Object.entries(out)) out[key] = speakStored(value, noun);
  return out;
}
