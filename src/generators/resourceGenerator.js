/**
 * resourceGenerator.js
 * Resource chain analysis and availability reporting.
 */

import {getPriorities} from './helpers.js';
import {priorityToCategory} from './economicGenerator.js';
import {TERRAIN_DATA} from '../data/geographyData.js';
import {RESOURCE_DATA, SPECIAL_RESOURCES} from '../data/goods/identity.js';
import {RESOURCE_CHAINS} from '../data/goods/chains.js';
import {institutionHasAnyTag} from '../lib/entities.js';
import {institutionDisplayName} from '../domain/display/institutionDisplayName.js';
import {
  isMaterializedCustomContent,
  nativeSemanticNames,
  nativeSemanticResourceKeys,
} from '../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys, nativeResourceConditionRecords } from '../domain/resourceSemantics.js';
import { waterAccessKind } from '../domain/tradeRouteSemantics.js';
import { MATERIAL_RESOURCE_KEYS, liveMaterialFor } from './economy/localMaterials.js';

// ─── THE TOWN'S OWN ANSWER OVER THE TERRAIN'S TABLE (COHERENCE-AGREE, 2026-11-11) ──────────────
// The terrain table (`TERRAIN_DATA`) says what a kind of ground usually lacks and yields. The town's
// own drawn resources and route override it. These tables are the words for that, written once and
// read by the writer below and by the coherence receipt's agreement arm (generationCoherence.js).

// The material words live in a leaf (economy/localMaterials.js) so the viability hooks read them too.
export { MATERIAL_RESOURCE_KEYS, liveMaterialFor };

const TIMBER_KEYS = ['timber', 'managed_forest', 'mountain_timber', 'shipbuilding_timber'];
const GRAIN_KEYS = ['grain_fields', 'fertile_floodplain'];
const HERD_KEYS = ['grazing_land', 'alpine_pasture', 'camel_herds'];
const MINING_KEYS = ['iron_deposits', 'coal_deposits', 'precious_metals', 'gemstone_deposits', 'stone_quarry'];
const support = (keys, routes = []) => Object.freeze({ keys: Object.freeze(keys), routes: Object.freeze(routes) });
/**
 * What a terrain strength stands on: any one of these resources, or the route. A strength with
 * none of them is the terrain's, not the town's, and is not the town's to claim.
 * @type {Readonly<Record<string, Readonly<{ keys: ReadonlyArray<string>, routes?: ReadonlyArray<string> }>>>}
 */
export const STRENGTH_SUPPORT = Object.freeze({
  'Maritime trade': support(['deep_harbour', 'maritime_access'], ['port']),
  'Fishing industry': support(['fishing_grounds', 'river_fish']),
  'Salt production': support(['salt_flats', 'desert_salt']),
  'Salt trade': support(['salt_flats', 'desert_salt']),
  Shipbuilding: support(['shipbuilding_timber']),
  Agriculture: support([...GRAIN_KEYS, 'grazing_land']),
  Milling: support(['river_mills']),
  'River trade': support([], ['river']),
  Brewing: support(GRAIN_KEYS),
  Mining: support(MINING_KEYS),
  Metalworking: support(['iron_deposits', 'precious_metals']),
  Stoneworking: support(['stone_quarry']),
  'Stone quarrying': support(['stone_quarry']),
  Gemcutting: support(['gemstone_deposits']),
  'Timber trade': support(TIMBER_KEYS),
  Woodcraft: support(TIMBER_KEYS),
  'Fur trade': support(['hunting_grounds']),
  Hunting: support(['hunting_grounds']),
  'Grain production': support(GRAIN_KEYS),
  Livestock: support(HERD_KEYS),
  'Sheep herding': support(['grazing_land', 'alpine_pasture']),
  'Wool and textiles': support(['grazing_land', 'alpine_pasture']),
  'Wool production': support(['grazing_land', 'alpine_pasture']),
  'Central trade hub': support(['crossroads_position'], ['crossroads']),
  'Trade hub': support(['crossroads_position'], ['crossroads']),
  'Glass and gems': support(['glass_sand', 'gemstone_deposits']),
  'Exotic goods': support(['date_palms', 'precious_metals', 'gemstone_deposits', 'camel_herds'], ['crossroads', 'port']),
});

const reading = (text, ...needs) => Object.freeze({ text, needs: Object.freeze(needs.map((g) => Object.freeze(g))) });
/**
 * The clauses of a terrain's strategic line that name what the ground yields. Each clause lists its
 * readings, the original first; the first whose every group of resources the town has is the one it
 * prints (a reading with no groups always stands, and '' drops the clause). The rating word and the
 * clauses about the lie of the land are the terrain's and stay.
 * @type {Readonly<Record<string, ReadonlyArray<Readonly<{ clause: string, readings: ReadonlyArray<Readonly<{ text: string, needs: ReadonlyArray<ReadonlyArray<string>> }>> }>>>>}
 */
export const STRATEGIC_CLAUSES = Object.freeze({
  plains: Object.freeze([Object.freeze({ clause: 'agricultural heartland', readings: Object.freeze([
    reading('agricultural heartland', [...GRAIN_KEYS, 'grazing_land']), reading('open country')]) })]),
  mountain: Object.freeze([
    Object.freeze({ clause: ', controls mountain passes', readings: Object.freeze([reading(', controls mountain passes', ['defended_pass']), reading('')]) }),
    Object.freeze({ clause: ', mineral wealth', readings: Object.freeze([reading(', mineral wealth', MINING_KEYS), reading('')]) }),
  ]),
  forest: Object.freeze([Object.freeze({ clause: 'provides timber and game, ', readings: Object.freeze([
    reading('provides timber and game, ', TIMBER_KEYS, ['hunting_grounds']), reading('provides timber, ', TIMBER_KEYS),
    reading('provides game, ', ['hunting_grounds']), reading('')]) })]),
});

/** The town's own strategic line: each yield clause read against its resources. @param {string} terrainKey @param {ReadonlyArray<string>} available */
export const townStrategicValue = (terrainKey, available) => (STRATEGIC_CLAUSES[terrainKey] || []).reduce(
  (line, { clause, readings }) => line.replace(clause, (readings.find((r) => r.needs.every((g) => g.some((k) => available.includes(k)))) || readings[readings.length - 1]).text),
  String(TERRAIN_DATA[/** @type {keyof typeof TERRAIN_DATA} */ (terrainKey)]?.strategicValue || ''),
);

/** @param {ReadonlyArray<string>} available @param {Readonly<{ keys: ReadonlyArray<string>, routes?: ReadonlyArray<string> }>} rule @param {string} [route] */
export const townSupports = (available, rule, route = '') => (
  rule.keys.some((key) => available.includes(key)) || (rule.routes || []).includes(route)
);


// ─── resolveNearbyCommodities ─────────────────────────────────────────────────
// Turn the settlement's ACTUALLY-rolled nearby resources into the commodity/
// resource-key tokens the chain matcher reconciles against. This is what couples
// the resource analysis to the specific settlement: config.nearbyResources holds
// RESOURCE_DATA *keys* (e.g. 'iron_deposits'), each mapping to commodity tokens
// (RESOURCE_DATA[key].commodities, e.g. ['iron','metalwork']). A depleted node
// puts nothing on the table — a worked-out mine is not "iron present."
//
// The resolved list carries BOTH the commodity tokens AND the resource keys,
// because the two chain families key off different vocabularies: generic chains
// match commodity tokens ('iron' reconciles with rawResource 'iron ore'), while
// terrain-specific chains match the resource KEY itself (rawResource
// 'alpine_pasture'). evaluateEconomicActivity's normalized matcher bridges both.
//
// Falls back to the terrain's allowedResources when the config roster is empty or
// unresolvable — preserving the terrain-driven default for settlements that never
// rolled an explicit roster.

export const resolveNearbyCommodities = (config = {}, terrainType) => {
  // RESOURCE_CHAINS is the native engine vocabulary. A current custom
  // resource's display name may resemble that vocabulary, but its name is
  // presentation—not permission to activate native mineral, food, or magical
  // production. Keep legacy unstamped keys working while filtering the
  // identity-bearing custom roster through the shared authority boundary.
  const keys = nativeSemanticResourceKeys(config);
  const available = new Set(availableNativeResourceKeys(config));

  const out = new Set();
  let recognizedNativeKey = false;
  for (const key of keys) {
    const meta = RESOURCE_DATA[key];
    if (!meta) continue;
    recognizedNativeKey = true;
    if (!available.has(key)) continue;
    out.add(key); // terrain-specific chains match on the resource key
    for (const c of (meta.commodities || [])) out.add(c); // generic chains match on the commodity token
  }
  if (out.size > 0) return [...out];
  // An explicit native roster — including an intentionally empty one — is
  // canonical. Likewise, a known roster whose every node is depleted should
  // resolve to no commodities. Falling back to the terrain in either case
  // would recreate absent native resources and let custom-only labels acquire
  // built-in production.
  if (Array.isArray(config.nearbyResourcesNative) || recognizedNativeKey) {
    return [];
  }
  return TERRAIN_DATA[terrainType]?.allowedResources?.slice() || [];
};

// ─── terrain-vocabulary synonym matcher ───────────────────────────────────────
// RESOURCE_CHAINS.rawResource is an idealized DISPLAY string ("copper ore",
// "gemstones") that renders verbatim in the gap/critical report, while
// TERRAIN_DATA.allowedResources names the same material with its own token
// ("copper", "gemstone_deposits"). The plain substring join left four chains
// matching NO terrain. This table bridges the two AT THE MATCHER — it never
// renames the displayed rawResource.
const RAW_RESOURCE_TERRAIN_SYNONYMS = {
  'copper ore':      ['copper'],
  'gold/silver ore': ['precious_metals'],
  'gemstones':       ['gemstone_deposits'],
  'glass sand':      ['glass_sand'],
  // 'flax' and 'grapes' match their terrain-vocabulary tokens verbatim (no entry
  // needed); 'animal hides' is the display name for the 'hides' token.
  'animal hides':    ['hides'],
};
export const terrainSynonymsFor = (rawResource) =>
  RAW_RESOURCE_TERRAIN_SYNONYMS[String(rawResource || '').toLowerCase()] || [];

// Does a terrain's controlled vocabulary permit this raw resource? Preserves the
// original substring rule ("timber" still matches "mountain_timber") and adds the
// synonym token — a strict superset, so only the synonym chains gain a match.
// TERRAIN side only: the nearby-resource side keeps OUR tokensReconcile below
// (commodity-token reconciliation), which the terrain vocabulary must not adopt
// ("glass sand" must not activate on generic coastal "sand").
export const terrainAllowsResource = (allowedResources, rawResource) => {
  const raw = String(rawResource || '').toLowerCase();
  const synonyms = terrainSynonymsFor(rawResource);
  return (allowedResources || []).some((r) => {
    const v = String(r).toLowerCase();
    return v.includes(raw) || synonyms.some((s) => v.includes(s));
  });
};

// ─── evaluateEconomicActivity ─────────────────────────────────────────────────
// Return resource chains that are active given the terrain and present resources.

// Whole-token containment: a nearby token 'iron' reconciles with 'iron ore',
// and 'mountain_timber' reconciles with 'timber'. Character substrings do not:
// 'stone' must never activate 'gemstones'. Underscores and whitespace share one
// canonical boundary so commodity- and key-keyed chain families still join.
const normalizeToken = (s) => String(s || '').toLowerCase().replace(/[_\s]+/g, ' ').trim();
const tokensReconcile = (a, b) => {
  const na = normalizeToken(a), nb = normalizeToken(b);
  if (!na || !nb) return false;
  const paddedA = ` ${na} `;
  const paddedB = ` ${nb} `;
  return (
    na === nb
    || paddedA.includes(` ${nb} `)
    || paddedB.includes(` ${na} `)
  );
};

const evaluateEconomicActivity = (terrainType, nearbyResources, water = '') => { // A-11: "ships" only where waterAccessKind is not 'none'
  const terrain = TERRAIN_DATA[terrainType];
  if (!terrain) return [];
  const active = [];
  Object.entries(RESOURCE_CHAINS).forEach(([chainKey, chain]) => {
    const terrainAllows  = terrainAllowsResource(terrain.allowedResources, chain.rawResource);
    // Nearby side: OUR tokensReconcile (commodity-token reconciliation) PLUS the
    // synonym bridge — their tree used exact synonym membership here; ours uses
    // reconciliation, but either way the display string "gemstones" must find the
    // vocabulary token "gemstone_deposits" or the chain stays dormant on the very
    // terrain that owns it.
    const resourcePresent = nearbyResources.some(r =>
      tokensReconcile(r, chain.rawResource) ||
      terrainSynonymsFor(chain.rawResource).some(s => tokensReconcile(r, s)));
    if (terrainAllows && resourcePresent) {
      active.push(water === 'none' && (chain.finalProducts || []).includes('ships')
        ? { ...chain, chainKey, finalProducts: chain.finalProducts.filter((product) => product !== 'ships') }
        : { ...chain, chainKey });
    }
  });
  return active;
};

// ─── institutionSupportsChain ─────────────────────────────────────────────────
// Does this institution process this chain? Tag-first (real capability): anything
// carrying one of the chain's processingTags processes it, regardless of whether
// its NAME string matches a listed processor — "Weavers/Textile workers" processes
// the wool chain because it carries TAG.TEXTILE. The exact-name clause is the
// transitional fallback for chains with no distinct catalog capability tag (stone
// masonry, desert salt), matched against real catalog names — never the old
// phantom labels ('granar' etc.) that could match nothing.

export const institutionSupportsChain = (inst, chain) => (
  !isMaterializedCustomContent(inst)
  && (
    institutionHasAnyTag(inst, chain.processingTags || [])
    || (chain.processingInstitutions || []).some(name => name === inst.name)
  )
);

// ─── evaluateInstitutions ─────────────────────────────────────────────────────
// Classify each active resource chain by how well it is institutionally supported.

const evaluateInstitutions = (institutions, activeChains) => {
  const result = { fullyExploited: [], partiallyExploited: [], unexploited: [], warnings: [] };

  activeChains.forEach(chain => {
    // Count the institutions that can process this chain. ≥2 processors ⇒ the
    // chain runs end-to-end (raw → final goods); exactly 1 ⇒ a lone processor
    // (raw reaches an intermediate, not final goods); 0 ⇒ untapped.
    const supporters = institutions.filter(i => institutionSupportsChain(i, chain)).length;

    if (supporters === 0)     result.unexploited.push(chain);
    else if (supporters >= 2) result.fullyExploited.push(chain);
    else                      result.partiallyExploited.push(chain);
  });

  return result;
};

// ─── buildViabilityReport ─────────────────────────────────────────────────────
// Identify critical imports (things terrain cannot produce) and institution-resource mismatches.

const REQUIREMENT_NOISE = new Set([
  'and',
  'bulk',
  'fine',
  'for',
  'goods',
  'large',
  'luxury',
  'major',
  'quality',
]);

function availableResourceSatisfies(requirement, availableResources) {
  const requirementText = String(requirement || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ');
  const terms = requirementText
    .split(/[^a-z0-9]+/)
    .filter(term => term.length > 3 && !REQUIREMENT_NOISE.has(term));
  return (availableResources || []).some(resource => (
    terms.some(term => tokensReconcile(resource, term))
  )) || liveMaterialFor(requirement, availableResources || []) !== null; // COHERENCE-AGREE: "metals" beside live iron, "fuel" beside coal or peat
}

const LOCAL_REQUIREMENT_PRODUCERS = Object.freeze([
  {
    requirement: /\b(?:grain|foodstuffs?|provisions?)\b/i,
    institution: /\b(?:farm|farmland|subsistence|grain fields?|managed farmland|common fields?)\b/i,
  },
  {
    requirement: /\b(?:timber|lumber|wood)\b/i,
    institution: /\b(?:woodcutter|logging camp|managed forest)\b/i,
  },
  {
    requirement: /\bstone\b/i,
    institution: /\b(?:stone quarry|quarry)\b/i,
  },
  {
    requirement: /\b(?:charcoal|fuel)\b/i,
    institution: /\b(?:charcoal burner|peat cutter|coal mine)\b/i,
  },
  {
    requirement: /\bsalt\b/i,
    institution: /\b(?:salt works|salt pans?|brine works?)\b/i,
  },
]);

function localInstitutionSupplies(requirement, institutions) {
  const rule = LOCAL_REQUIREMENT_PRODUCERS.find(candidate => (
    candidate.requirement.test(String(requirement || ''))
  ));
  if (!rule) return false;
  return nativeSemanticNames(institutions).some(name => (
    rule.institution.test(name)
  ));
}

const buildViabilityReport = (
  terrainType,
  institutions,
  availableResources = [],
) => {
  const terrain = TERRAIN_DATA[terrainType];
  if (!terrain) return { critical: [], recommended: [], reasons: {} };

  const report = { critical: [], recommended: [], reasons: {} };

  // Terrain hard constraints: things this terrain type must import
  terrain.mustImport?.forEach(resource => {
    // `mustImport` describes terrain potential, not an override of the rolled
    // settlement. An explicit live quarry/field/forest is stronger evidence:
    // when the canonical available roster supplies the named material, do not
    // simultaneously call it a critical import.
    if (
      availableResourceSatisfies(resource, availableResources)
      || localInstitutionSupplies(resource, institutions)
    ) return;
    report.critical.push(resource);
    report.reasons[resource] = `${terrain.name} terrain cannot produce this locally`;
  });

  // Institution → resource mismatches: processing inst exists but terrain lacks the input
  Object.entries(RESOURCE_CHAINS).forEach(([, chain]) => {
    const hasProcessingInst = chain.processingInstitutions.some(name =>
      institutions.some(i => i.name === name));
    const terrainHasResource = (
      terrainAllowsResource(terrain.allowedResources, chain.rawResource)
      || localInstitutionSupplies(chain.rawResource, institutions)
      || availableResources.some(resource => (
        tokensReconcile(resource, chain.rawResource)
        || terrainSynonymsFor(chain.rawResource).some(
          synonym => tokensReconcile(resource, synonym),
        )
      ))
    );

    if (hasProcessingInst && !terrainHasResource) {
      report.critical.push(chain.rawResource);
      report.reasons[chain.rawResource] =
        `Required by ${chain.processingInstitutions[0]} but not available in ${terrain.name} terrain`;
    }
  });

  return report;
};

// ─── evaluateInstitutionDeps ──────────────────────────────────────────────────
// Build the list of export products based on exploitation level.

const evaluateInstitutionDeps = (exploitation) => {
  const exports = [];

  exploitation.fullyExploited?.forEach(chain => {
    exports.push({
      product: chain.finalProducts.join(', '),
      chain:   chain.rawResource,
      value:   chain.exportValue,
      reason:  'Complete production chain in place',
    });
  });

  exploitation.partiallyExploited?.forEach(chain => {
    exports.push({
      product: chain.intermediateGoods.join(', '),
      chain:   chain.rawResource,
      value:   'medium',
      reason:  'Partial processing - exports semi-finished goods',
    });
  });

  return exports;
};

// ─── supplyOfInput ────────────────────────────────────────────────────────────
// ⭐ A GAP SAYS WHICH KIND (REVIEW-INTAKE-3 R9, 2026-11-06). Where a house's input comes from,
// read from the record's own evidence and never from chain ACTIVATION alone. The lacks-access
// line below used to fire whenever the input's chain was inactive (terrain allows it AND it was
// rolled nearby), while `buildViabilityReport` reads terrain OR a local producer OR the roster:
// the two disagreed by construction: on the 1,000 soak settlements 1,237 of the 5,166 lines named
// an input the place holds (now unwritten), 1,095 one it imports, 2,834 one it lacks. Classes:
//   'local'    — the non-depleted nearby roster, the economy's `localProduction`, or a local
//                producer (`localInstitutionSupplies`) holds it: NOT a gap, so no line;
//   'imported' — the economy's `primaryImports` names it, or (grain) the food record imports a
//                share of the staple: the house runs on bought input;
//   'missing'  — none of these: the line as before.
// A record entry's parenthetical is its reason ("Iron ore (local mines exhausted)"), not a good.
const FOOD_STAPLE_INPUTS = new Set(['grain']);
const recordHoldsGood = (list, rawResource) => {
  const goods = [rawResource, ...terrainSynonymsFor(rawResource)];
  return (Array.isArray(list) ? list : [])
    .map((entry) => String(entry || '').replace(/\([^)]*\)/g, ' '))
    .some((entry) => goods.some((good) => tokensReconcile(entry, good)));
};
const supplyOfInput = (rawResource, institutions, evidence = {}) => {
  if (
    recordHoldsGood(evidence.availableResources, rawResource)
    || recordHoldsGood(evidence.localProduction, rawResource)
    || localInstitutionSupplies(rawResource, institutions)
  ) return 'local';
  if (
    recordHoldsGood(evidence.primaryImports, rawResource)
    || (FOOD_STAPLE_INPUTS.has(normalizeToken(rawResource)) && Number(evidence.foodImportPct) > 0)
  ) return 'imported';
  return 'missing';
};

// ─── evaluateInstitutionChain ─────────────────────────────────────────────────
// Identify gaps: missing processing links and institutions lacking their inputs.

const evaluateInstitutionChain = (exploitation, institutions, evidence = {}) => {
  const gaps = [];

  exploitation.partiallyExploited?.forEach(chain => {
    const missingInsts = chain.processingInstitutions.filter(name =>
      !institutions.some(i => i.name === name));
    if (missingInsts.length > 0) {
      gaps.push({
        chain:   chain.rawResource,
        missing: missingInsts,
        impact:  'Cannot produce final goods, limited to intermediate products',
        severity: 'medium',
      });
    }
  });

  exploitation.unexploited?.forEach(chain => {
    gaps.push({
      chain:    chain.rawResource,
      missing:  chain.processingInstitutions,
      impact:   'Raw resource available but not being processed',
      severity: 'low',
    });
  });

  // Institutions that exist but whose resource inputs are missing
  institutions.forEach(institution => {
    Object.values(RESOURCE_CHAINS || {}).forEach(chain => {
      if (!chain.processingInstitutions?.includes(institution.name)) return;
      const alreadyInGaps =
        exploitation.fullyExploited?.some(c => c.rawResource === chain.rawResource) ||
        exploitation.partiallyExploited?.some(c => c.rawResource === chain.rawResource);
      if (alreadyInGaps) return;
      const kind = supplyOfInput(chain.rawResource, institutions, evidence);
      if (kind === 'local') return; // the place holds the input: an inactive chain is not a gap
      const name = institutionDisplayName(institution.name);
      gaps.push({
        chain:       chain.rawResource,
        institution: institution.name,
        kind,
        impact:      kind === 'imported'
          ? `${name} runs on imported ${chain.rawResource}`
          : `${name} exists but lacks access to ${chain.rawResource}`,
        severity:    kind === 'imported' ? 'low' : 'high',
      });
    });
  });

  return gaps;
};

// ─── evaluateResourceChain ────────────────────────────────────────────────────
// Return enriched special resource feature data.

const evaluateResourceChain = (specialResourceKeys) => {
  if (!specialResourceKeys || specialResourceKeys.length === 0) return [];
  const result = [];
  specialResourceKeys.forEach(key => {
    const data = SPECIAL_RESOURCES[key];
    if (!data) return;
    result.push({
      feature:             data.name,
      description:         data.description,
      resources:           data.effects.resources || [],
      economicBoost:       data.effects.economicBoost,
      strategicImportance: data.effects.strategicImportance,
      special: {
        tourism:    data.effects.tourism,
        pilgrimage: data.effects.pilgrimage,
      },
    });
  });
  return result;
};

// ─── generateResourceAnalysis ─────────────────────────────────────────────────

/**
 * Generate the full resource analysis for a settlement.
 *
 * @param {string} terrainType      - e.g. 'crossroads', 'river', 'mountain'
 * @param {Array}  nearbyResources  - Resource keys present nearby
 * @param {Array}  specialResources - Special resource feature keys
 * @param {Array}  institutions     - Institution objects
 * @param {Object} config           - Settlement config with priorities
 * @param {Object|null} [economicState] - The reconciled economy: its `primaryImports`,
 *   `localProduction` and food record's import share tell a gap's kind (supplyOfInput)
 * @returns {Object} Full resource analysis
 */
export const generateResourceAnalysis = (
  terrainType,
  nearbyResources,
  specialResources,
  institutions,
  config = {},
  economicState = null,
) => {
  const terrain = TERRAIN_DATA[terrainType];
  if (!terrain) {
    return {
      error:              'Invalid terrain type',
      availableResources: [],
      resourceChains:     [],
      exploitation:       {},
      imports:            {},
      exports:            [],
      resourceConditions: [],
      conditionNotes:     [],
    };
  }

  // Native resource-chain physics predates custom definitions and keys on
  // catalog tags/names. Custom tags and labels are presentation vocabulary;
  // their mechanical lanes are registered food effects and reviewed chains.
  const nativeInstitutions = institutions.filter(
    institution => !isMaterializedCustomContent(institution),
  );
  const activeChains   = evaluateEconomicActivity(terrainType, nearbyResources, waterAccessKind(terrainType, config.tradeRouteAccess));
  const exploitation   = evaluateInstitutions(nativeInstitutions, activeChains);
  const imports        = buildViabilityReport(
    terrainType,
    nativeInstitutions,
    nearbyResources,
  );
  const exports        = evaluateInstitutionDeps(exploitation);
  const gaps           = evaluateInstitutionChain(
    exploitation,
    nativeInstitutions,
    {
      availableResources: nearbyResources,
      localProduction:    economicState?.localProduction,
      primaryImports:     economicState?.primaryImports,
      foodImportPct:      economicState?.foodSecurity?.importPct,
    },
  );
  const featureEffects = evaluateResourceChain(specialResources);

  const pri            = getPriorities(config);
  const priorityNotes  = [];
  const resourceConditions = nativeResourceConditionRecords(config);
  const conditionNotes = resourceConditions
    .filter(record => record.condition === 'depleted')
    .map(record => record.conditionDescription)
    .filter(Boolean);

  // High economy priority + unexploited resources = trade opportunity note
  if (priorityToCategory(pri.economy) === 'very_high' || priorityToCategory(pri.economy) === 'high') {
    const unexploited = exploitation.unexploited || [];
    if (unexploited.length > 0) {
      priorityNotes.push(
        `Strong economic focus creates pressure to develop untapped ${unexploited[0].rawResource || 'resources'}: significant trade opportunity.`
      );
    }
  }

  // Low economy + partially exploited = underperformance note
  if ((priorityToCategory(pri.economy) === 'low' || priorityToCategory(pri.economy) === 'very_low') &&
      (exploitation.partiallyExploited?.length || 0) > 0) {
    priorityNotes.push(
      'Weak economic focus leaves several resource chains underdeveloped. Production capacity exists but is not being realised.'
    );
  }

  // High military + missing strategic resources = vulnerability note
  if (priorityToCategory(pri.military) === 'high' || priorityToCategory(pri.military) === 'very_high') {
    const gapResource = gap => String(
      gap?.rawResource || gap?.chain || '',
    ).toLowerCase();
    const strategicGaps = (gaps || []).filter(g =>
      ['iron ore', 'timber', 'stone'].some(kw => (
        gapResource(g).includes(kw)
      ))
    );
    if (strategicGaps.length > 0) {
      priorityNotes.push(
        `Military focus highlights gap: ${gapResource(strategicGaps[0])} processing is incomplete, strategic vulnerability.`
      );
    }
  }

  return {
    terrain:          terrain.name,
    availableResources: nearbyResources,
    resourceConditions,
    conditionNotes,
    resourceChains:   activeChains,
    exploitation,
    imports,
    exports,
    gaps,
    featureEffects,
    // COHERENCE-AGREE: the terrain's strengths and strategic line are defaults; the town keeps a
    // strength only where its own resources or route stand under it, and a yield clause likewise.
    economicStrengths: (terrain.economicStrengths || []).filter(strength => {
      const rule = STRENGTH_SUPPORT[/** @type {keyof typeof STRENGTH_SUPPORT} */ (strength)];
      return Boolean(rule) && townSupports(nearbyResources || [], rule, config.tradeRouteAccess);
    }),
    strategicValue:   townStrategicValue(terrainType, nearbyResources || []),
    priorityNotes,
  };
};
