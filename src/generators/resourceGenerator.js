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
  nativeSemanticResourceKeys,
} from '../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys, nativeResourceConditionRecords, resourceShortageImport } from '../domain/resourceSemantics.js';
import { waterAccessKind, hasTradeRouteConnection } from '../domain/tradeRouteSemantics.js';
import { MATERIAL_RESOURCE_KEYS, liveMaterialFor } from './economy/localMaterials.js';
import {
  CHAIN_INPUTS, CHAIN_RAW_INPUT, chainsOfHouse, houseHead, houseInputAtHand, houseRunsChain, impliedGroundGoods, housesOnSpentGround, housesWantingTradeInput,
  localProducerSupplies, terrainSynonymsFor, tradeFinisherIn, ventureHouseOf, worksTheGround, inputMissingBeforeStory,
} from '../domain/facts/houseInputAtHand.js';
import { ALSO_USES, BUYS_AND_WORKS, IMPLIED_GROUND, IMPORT_WORD, KEEPS_OR_YIELDS, MATERIAL_OF, RUNS_ON_BOUGHT, SOURCE_GROUNDS, isSourceHouse } from '../domain/facts/houseKinds.js';
import { BIRTH_PICKS, FAMILY_NOUN, rowGoodOf, rowNamesGround, boughtAtBirth, groundPicksAtBirth, impliedGroundsShown, sourceStoryOf, storySeed, usedGroundOf, ventureAtBirth } from '../domain/facts/supplyStory.js';
import { liveInstitutions } from '../domain/institutions/institutionRoster.js';
import { HOUSE_TRADE_INPUT, SPENT_GROUND_YIELD } from '../data/crisisDependence.js';
import { subsumeTradeGoods } from '../domain/region/goodsCatalog.js';
import { catalogIdForName } from '../data/institutionalCatalog.js';

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
const support = (keys, routes = [], record = {}) => Object.freeze({ keys: Object.freeze(keys), routes: Object.freeze(routes), ...Object.freeze(record) });
/**
 * What a terrain strength stands on: any one of these resources, or the route. A strength with
 * none of them is the terrain's, not the town's, and is not the town's to claim.
 * @type {Readonly<Record<string, Readonly<{ keys: ReadonlyArray<string>, routes?: ReadonlyArray<string>, income?: ReadonlyArray<string>, foodChains?: ReadonlyArray<string> }>>>}
 */
export const STRENGTH_SUPPORT = Object.freeze({
  'Maritime trade': support(['deep_harbour', 'maritime_access'], ['port']),
  'Fishing industry': support(['fishing_grounds', 'river_fish']),
  'Salt production': support(['salt_flats', 'desert_salt']),
  'Salt trade': support(['salt_flats', 'desert_salt']),
  Shipbuilding: support(['shipbuilding_timber']),
  Agriculture: support([...GRAIN_KEYS, 'grazing_land'], [], { income: ['Agricultural Rents', 'Harvest'], foodChains: ['Grain & agriculture'] }), // COHERENCE-AGREE-8 (T6): or the town's own record of farming
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

/** @param {ReadonlyArray<string>} available @param {Readonly<{ keys: ReadonlyArray<string>, routes?: ReadonlyArray<string>, income?: ReadonlyArray<string>, foodChains?: ReadonlyArray<string> }>} rule @param {string} [route] @param {any} [economicState] the record: an income it earns, a food chain it runs (COHERENCE-AGREE-8 T6) */
export const townSupports = (available, rule, route = '', economicState = null) => (
  rule.keys.some((key) => available.includes(key)) || (rule.routes || []).includes(route) || (rule.income || []).some((i) => (economicState?.incomeSources || []).some((/** @type {any} */ e) => e?.source === i)) || (rule.foodChains || []).some((c) => (economicState?.foodSecurity?.activeChains || []).includes(c))
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
// The table's one home is `domain/facts/houseInputAtHand.js` (BAR4-RECORD R1: the house's input is matched by it there).
export { terrainSynonymsFor };

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

// The houses that produce a raw good here: one home, `domain/facts/houseInputAtHand.js :: localProducerSupplies` (BAR4-RECORD
// R1: the gap writer and the page's gap reader read one table).
const localInstitutionSupplies = (requirement, institutions) => localProducerSupplies(String(requirement || ''), institutions);

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
//
// A COMPLETE ROW SAYS ONLY WHAT THE ANALYSIS ITSELF HOLDS (R3-CODE-C-2, ROUND-3-CUT #457 and
// #1163; the chair's ruling of 2026-11-13: no map between this model and the chain model is
// built, the row reads this analysis's own data). A chain counts as fully exploited at two
// processors of ANY of its tags, so the livestock row named "leather goods" from a butcher and a
// dairy farmer while the same analysis's gaps listed the Tannery missing (#457), and the herbs
// row claimed "Complete production chain in place" while the town's own settings mark its herb
// ground depleted (#1163). So, for a fully exploited chain:
//   (1) a final good made by a house the gaps list as MISSING (that house's own other chains
//       name the good: the Tannery's hides chain makes "leather") is not named in the row; a
//       row left with no good is not written;
//   (2) the claim of completeness stands only where no source the analysis counts for the
//       chain's raw material (a resource key, or its commodities, that reconciles with the raw
//       material as `evaluateEconomicActivity` reconciles it) is marked depleted in the town's
//       own settings (`nativeResourceConditionRecords`); otherwise the row gives its goods and
//       its reason is empty (the page prints no reason).
// A partial row is unchanged: its goods are intermediates, made by the lone processor it has.
//
// THE ROW NEEDS ITS HOUSES AND ITS SOURCE (R3-CODE-C-8, the reader's L05 and the #457 class carried;
// the chair's ruling (b) of 2026-11-14). Two processors of ANY of the chain's tags made a chain
// "fully exploited", so a famine thorp of Subsistence farming and an external mill printed "cheese,
// preserved meat · Complete production chain in place" beside "The herds failed this year", with no
// Butcher, Tannery or Dairy farmer standing, and a fish row stood on a Mill and Farmland. So a full
// chain's row is written only where:
//   (3) every house the chain names (`processingInstitutions`; an "Access to …" entry is a road to a
//       house elsewhere, not a house in place, and is not one of them) stands on the roster: by its
//       own name, or as a house that processes this chain and is the same kind ("Mills (2-5)" for
//       Mill, "Tanners" for Tannery: the name's head word);
//   (4) and the source the food record says a famine failed (`failedSource`) is not this chain's:
//       the herds that failed feed no cheese and no preserved meat.
// Elsewhere the good is not listed (the ruling's own arm; silence is not a false sentence). A chain that names no
// house at all (the oasis dates) has nothing to stand the claim on: its goods are given without it, as (2) gives them.
//
// A GOOD NO HOUSE OF ITS CHAIN MAKES (R3-CODE-C-9; the eighth seat's named row, the chair's ruling of 2026-11-14 as
// its L05's): (5) the grain chain names a Mill and Bakers and no brewer, so its row named "beer" in towns with Inns and
// Taverns and no brewer standing (19 of the reader's 1,722; r2r-town-24, town of 423: "bread, beer, animal feed ·
// Complete production chain in place"). Such a good is listed only where its maker stands on the roster, read by kind
// as (3) reads a house (`houseHead`: a Brewery or a Brewer is a brewer; an alehouse is not); elsewhere it is not listed.
/** The goods a chain lists that none of its own houses makes, and the kind of house that makes each (houseHead's word). */
const UNHOUSED_GOOD_MAKER = Object.freeze({ beer: 'brewer' });
/** The chain a famine's failed source stops (foodBalance.js :: failedSource; the mill grinds the grain). */
const FAILED_SOURCE_CHAIN = Object.freeze({ grain: 'grain', mill: 'grain', livestock: 'livestock', fish: 'fish' });
// A house name's head word, as a kind: one home, `domain/facts/houseInputAtHand.js :: houseHead` (imported above).
/** @param {string} name a house the chain names @param {any} chain @param {Array<{ name?: string }>} institutions */
const houseStands = (name, chain, institutions) => institutions.some((inst) => inst?.name === name
  || (institutionSupportsChain(inst, chain) && houseHead(inst?.name) === houseHead(name)));

/**
 * @param {{ fullyExploited?: Array<any>, partiallyExploited?: Array<any> }} exploitation
 * @param {Array<{ name?: string }>} [institutions] the native roster the gaps were read on
 * @param {Array<{ missing?: unknown }>} [gaps] this analysis's own gaps (evaluateInstitutionChain)
 * @param {Array<{ key: string, condition: string }>} [resourceConditions] the town's own settings
 * @param {unknown} [failedSource] the food record's source a famine failed (economicState.foodSecurity.foodRecord)
 */
const evaluateInstitutionDeps = (exploitation, institutions = [], gaps = [], resourceConditions = [], failedSource = null) => {
  const exports = [];
  const listedMissing = new Set(gaps.flatMap((gap) => (Array.isArray(gap?.missing) ? gap.missing : [])));
  const depleted = resourceConditions.filter((record) => record?.condition === 'depleted');
  const stoppedChain = typeof failedSource === 'string' ? FAILED_SOURCE_CHAIN[/** @type {keyof typeof FAILED_SOURCE_CHAIN} */ (failedSource)] : undefined;

  exploitation.fullyExploited?.forEach(chain => {
    if (stoppedChain && chain.chainKey === stoppedChain) return; // (4)
    const needed = (chain.processingInstitutions || []).filter((/** @type {string} */ name) => !/^access to /i.test(name));
    if (!needed.every((/** @type {string} */ name) => houseStands(name, chain, institutions))) return; // (3)
    const absent = (chain.processingInstitutions || []).filter((name) => (
      listedMissing.has(name) && !institutions.some((inst) => inst?.name === name)));
    const madeByAbsent = Object.entries(RESOURCE_CHAINS)
      .filter(([key, other]) => key !== chain.chainKey
        && absent.some((name) => (other.processingInstitutions || []).includes(name)))
      .flatMap(([, other]) => [...(other.intermediateGoods || []), ...(other.finalProducts || [])]);
    const products = (chain.finalProducts || []).filter((product) => (
      !madeByAbsent.some((good) => tokensReconcile(product, good))))
      .filter((product) => { // (5): a good its chain's houses do not make stands only beside its maker
        const maker = UNHOUSED_GOOD_MAKER[/** @type {keyof typeof UNHOUSED_GOOD_MAKER} */ (normalizeToken(product))];
        return !maker || institutions.some((inst) => houseHead(inst?.name) === maker);
      });
    if (products.length === 0) return;
    const raws = [chain.rawResource, ...terrainSynonymsFor(chain.rawResource)];
    const sourceDepleted = depleted.some((record) => (
      [record.key, ...(RESOURCE_DATA[record.key]?.commodities || [])]
        .some((token) => raws.some((raw) => tokensReconcile(token, raw)))));
    exports.push({
      product: products.join(', '),
      chain:   chain.rawResource,
      value:   chain.exportValue,
      reason:  sourceDepleted || needed.length === 0 ? '' : 'Complete production chain in place', // (3): a chain that names no house claims none
    });
  });

  exploitation.partiallyExploited?.forEach(chain => {
    exports.push({
      product: chain.intermediateGoods.join(', '),
      chain:   chain.rawResource,
      value:   'medium',
      reason:  'Partial processing - worked only to semi-finished goods', // TAIL-DEFECON-4 (15458, D3): the row is export POTENTIAL; it claims no export the trade list does not hold, and none under a siege
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
//   'route'    — TAIL-DEFECON-R M-V (the chair's ruling of 2026-11-15, vetoable by the owner): GRAPES AND GLASS SAND
//                COME BY ANY ROUTE. An input a house may run on by trade (the vintner's must, the glassblower's sand:
//                "grapes grown near or must brought in") reaches it wherever the town can bring goods in
//                (`hasTradeRouteConnection`) and no siege shuts the road (UNDER A SIEGE nothing comes in: the record's
//                `stressTypes`, as the economy's income lines read it): NOT a gap, so no line, as 'local'. No record yields grapes, and no import
//                list names them, so before this every census vintner "lacked grapes" (184 of 184). The import list is
//                the economy's (computeActiveChains.js :: deriveImportsFromChains): no row here says "imported";
//   'missing'  — none of these: the line as before.
// A record entry's parenthetical is its reason ("Iron ore (local mines exhausted)"), not a good.
// BAR4-RECORD R1 (the chair's K6 of BRIEF-BAR4, vetoable by the owner): ONE READING OF "THIS HOUSE'S INPUT IS AT HAND".
// The kinds above are read by the one home both this writer and the page's gap reader call
// (`domain/facts/houseInputAtHand.js :: houseInputAtHand`), over the record in the making: the live native roster, what
// the town makes of the raw good itself, a local producer, the route where no siege shuts it (grapes, glass sand and
// camels by any route; a house whose trade IS the route), the imports and the food record. The two asked it two ways and
// split in 67 rows of the census's 720 (a caravanserai on a connected road "lacked camels"; a sawmill the page called
// answered by the grove's "Sacred wood").
// BIRTH-1 (BR2 (ii)): A SOURCE HOUSE IS READ OVER THE LIST AS THE ECONOMY WROTE IT. The words the birth brings in for the
// buyers (`importsBroughtAtBirth`, below) feed no source house: a charcoal burner is not answered by the cooper's bought
// "Timber" (`evidence.importsBeforeBirth`, the list before those words; the record in the making only, never saved).
const supplyOfInput = (chainKey, institution, institutions, evidence = {}) => {
  const before = evidence.importsBeforeBirth;
  const id = String((typeof institution?.catalogId === 'string' && institution.catalogId) || catalogIdForName(String(institution?.name ?? '')) || '');
  const record = Array.isArray(before) && isSourceHouse(id) && !Object.prototype.hasOwnProperty.call(RUNS_ON_BOUGHT, id) && evidence.economicState
    ? { ...evidence, economicState: { ...evidence.economicState, primaryImports: before }, institutions }
    : { ...evidence, institutions };
  return houseInputAtHand(record, chainKey, institution, RESOURCE_CHAINS[chainKey]);
};

// Does another of this house's chains feed it? Worked here (fully or partly exploited), or its input held locally or
// bought in. M-S, read by evaluateInstitutionChain's lacks-access row.
const reachedByAnotherInput = (chain, institution, institutions, exploitation, evidence) => (
  Object.entries(RESOURCE_CHAINS || {}).some(([otherKey, other]) => other !== chain
    && houseRunsChain(other, institution.name)
    && (exploitation.fullyExploited?.some((c) => c.rawResource === other.rawResource)
      || exploitation.partiallyExploited?.some((c) => c.rawResource === other.rawResource)
      || supplyOfInput(otherKey, institution, institutions, evidence) !== 'missing'))
);

// ─── gapRowOf ─────────────────────────────────────────────────────────────────
// A HOUSE'S GAP ROW, worded once (the gap writer's, and BIRTH-3's story rows: `writeStoryRows`).
/** @param {string} institution @param {{ rawResource?: unknown }} chain @param {string} kind 'imported' or 'missing' */
const gapRowOf = (institution, chain, kind) => {
  const name = institutionDisplayName(institution);
  return {
    chain:       chain.rawResource,
    institution,
    kind,
    impact:      kind === 'imported'
      ? `${name} runs on imported ${chain.rawResource}`
      : `${name} exists but lacks access to ${chain.rawResource}`,
    severity:    kind === 'imported' ? 'low' : 'high',
  };
};

// ─── evaluateInstitutionChain ─────────────────────────────────────────────────
// Identify gaps: missing processing links and institutions lacking their inputs.

const evaluateInstitutionChain = (exploitation, institutions, evidence = {}) => {
  const gaps = [];

  // R3-CODE-C-10 (d) (the chair's ruling of 2026-11-14, vetoable by the owner): A LINE THAT NAMES A HOUSE THE TOWN
  // LACKS READS THE ROSTER BY WHAT THE HOUSE IS, NEVER BY ONE SPELLING OF ITS NAME. A partial chain's missing houses
  // ("Work on the timber here stops half-way: no sawmill or carpenters' guild finishes it.", validationOnPage.js) are
  // those no house of the same kind stands for (houseHead, as (3) and (5) read a house): 'Sawmill' is not missing
  // beside 'Sawmill (commercial)', nor "Carpenters' guild" beside 'Carpenters (5-15)'.
  // BAR5-CHAINS (a) (LAW 3's L3.halfway, the chair's direction of BRIEF-BAR5; vetoable by the owner): A FINISHER BY TRADE
  // STANDS FOR THE NAMED HOUSE, AS THE PAGE READS IT. The gap named "Fulling mill" missing beside a Fuller and
  // "Leatherworkers' guild" beside a Cobbler's guild (98 of the 171 houses the census's 720 half-way towns called missing)
  // while the page's own reader answered them (`validationOnPage.js :: resourceGapLines`, R1: where one finisher of the
  // missing houses stands, the work does not stop half-way). One table, `houseInputAtHand.js :: tradeFinisherIn`, read by
  // catalogue identity, and the page's rule: no gap where a finisher of one of the missing houses stands.
  exploitation.partiallyExploited?.forEach(chain => {
    const missingInsts = chain.processingInstitutions.filter(name =>
      !institutions.some(i => i.name === name || houseHead(i?.name) === houseHead(name)));
    if (missingInsts.some((name) => tradeFinisherIn(institutions, name))) return;
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
    Object.entries(RESOURCE_CHAINS || {}).forEach(([chainKey, chain]) => {
      if (!houseRunsChain(chain, institution.name)) return; // R1/R2: a sawmill's rung runs the sawmill's chains
      const alreadyInGaps =
        exploitation.fullyExploited?.some(c => c.rawResource === chain.rawResource) ||
        exploitation.partiallyExploited?.some(c => c.rawResource === chain.rawResource);
      if (alreadyInGaps) return;
      const kind = supplyOfInput(chainKey, institution, institutions, evidence);
      if (kind === 'local' || kind === 'route') return; // the place holds the input, or trade brings it: not a gap
      // TAIL-DEFECON-R M-S (the chair's ruling of 2026-11-15, vetoable by the owner): A HOUSE IS SHORT ONLY IF NONE OF ITS
      // INPUTS REACHES IT. The Smelter works three chains (iron ore, copper ore, gold/silver ore); judged chain by chain,
      // every smelter "lacked copper" (238 of 238 census towns) while it smelted iron. An input reaches the house where its
      // chain is worked here or the record holds it locally or by import (supplyOfInput). Only the `missing` row goes: a
      // house that runs on imported ore still says so ("Smelter runs on imported iron ore" is the record's import list).
      if (kind === 'missing' && reachedByAnotherInput(chain, institution, institutions, exploitation, evidence)) return;
      gaps.push(gapRowOf(institution.name, chain, kind));
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

// ─── importsBroughtAtBirth ─────────────────────────────────────────────────────
// BIRTH-1 (the chair's ruling BR2 of 2026-11-17 on the audit BIRTH-AUDIT's R2; vetoable by the owner): A HOUSE THAT BUYS
// AND WORKS ITS MATERIAL HAS IT BROUGHT IN. Of the 2,066 houses the page marked short in the census's 720 towns, 2,058
// were BORN short: the town was drawn a potter and no clay, a fuller and no wool, and the imports list (the economy's,
// written before the houses' gaps) named only what a RUNNING chain needs. Where a connected road no siege shuts reaches
// the town, each live native house of kind (i) (`houseKinds.js :: BUYS_AND_WORKS`) gets its material brought in, on the
// imports list that exists (`economicState.primaryImports`; no new field), in the list's own words (`IMPORT_WORD`):
//   (1) a buyer on a ground of its own the record has spent, unmarked by the shortage import the economy writes only at a
//       town or larger, has that ground's shortage import (`resourceSemantics.js :: resourceShortageImport`), as a town's
//       has: "Clay and ceramics materials (local clay pits exhausted)". A ground with no shortage import is left (named in
//       the hand-back), and so is a house that works the ground itself (`SPENT_GROUND_WORKERS`: an import feeds a buyer,
//       never the work on the ground);
//   (2) a buyer every input of which the one reader (`houseInputAtHand`) answers `missing` has its input's word.
// Each word once: a word the list already holds (its bracketed reason struck, in any case) is not written again. The
// gaps are written after, over the list: the house then "runs on imported clay", and under a siege the page reads it as
// it reads every house on an imported input ("Curtailed by the siege."). No draw is taken: no person, tie, name or house
// moves (measured by birth over the census's 720, the 150 and the 525).
// BIRTH-2 (the chair's rulings BR4 and BR5 of 2026-11-17, the owner's rule: THE SEED PICKS THE STORY; vetoable by the owner):
// the word is written EXACTLY where the material's story says bought (`domain/facts/supplyStory.js`): a used-up ground, its
// own shortage word, where the seed has the town buy it (3 times in 4); a material never there, the plain word; under a
// siege too (a cause is of ordinary times). Where the story says idle or abandoned, nothing: the owner's fourth and fifth
// stories, by the seed. The seed is the generator's, handed in (`generateResourceAnalysis`'s last argument).
// @enforced-by tests/domain/birthKindsLaw.test.js
// @enforced-by tests/domain/supplyStoryLaw.test.js

/** @param {unknown} x @returns {string} an import as a word: its bracketed reason struck, one spacing, lower case */
const importWordOf = (x) => String(x ?? '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
/** @param {string} x @returns {string} its words, singular, spaced ("Raw hides" -> " raw hide ") */
const wordsOf = (x) => ` ${x.toLowerCase().replace(/[^a-z]+/g, ' ').replace(/\b([a-z]{3,}?)e?s\b/g, '$1').replace(/\s+/g, ' ').trim()} `;
/** @param {unknown} imp an import @param {string} good a good's noun @returns {boolean} the import names the good whole */
const namesGood = (imp, good) => wordsOf(importWordOf(imp)).includes(wordsOf(good));

// ─── birthPicksOn ─────────────────────────────────────────────────────────────
// BIRTH-3 (the chair's ruling BR8 of 2026-11-17, vetoable: THE SEED WRITES ONCE, AT THE BIRTH; EVERY VIEW READS THE RECORD).
// THE ONE PLACE THE SEED ENTERS THE SUPPLY RULE: the birth's picks (`supplyStory.js :: …AtBirth`) are made here, over the
// record in the making, and carried on it under `BIRTH_PICKS` (a symbol: on no saved field). The birth then writes each
// story into the rows the page already stores (`writeStoryRows`, below); every reader at print reads those rows.
// @enforced-by tests/domain/supplyStoryLaw.test.js

/** A chain key's material family (the families of `houseKinds.js :: MATERIAL_OF`). @param {string} key */
const familyOfKey = (key) => (key === 'alpineWool' ? 'wool' : key === 'mountainTimber' ? 'timber' : key === 'desertGlass' ? 'sand' : key);
/** @param {unknown} inst @returns {string} the catalogue id */
const idOfInst = (inst) => { const i = /** @type {{ name?: unknown, catalogId?: unknown } | null} */ (inst);
  return String((typeof i?.catalogId === 'string' && i.catalogId) || catalogIdForName(String(i?.name ?? '')) || ''); };
/** The input keys of a house: its trade's good, or the chains that name it. @param {{ name?: unknown }} inst @returns {string[]} */
const inputKeysOf = (inst) => { const id = idOfInst(inst); const trade = Object.prototype.hasOwnProperty.call(HOUSE_TRADE_INPUT, id) ? HOUSE_TRADE_INPUT[id] : '';
  return (trade ? [trade] : chainsOfHouse(inst.name, RESOURCE_CHAINS).map(([k]) => k)).filter((k) => !!CHAIN_INPUTS[k]); };
/** @param {string} key @returns {{ rawResource?: unknown }} */
const chainOfKey = (key) => RESOURCE_CHAINS[key] || { rawResource: CHAIN_RAW_INPUT[key] };
/** The house as a sentence names it ("the potter"), as the page's gap lines name it. @param {unknown} inst */
const sentenceName = (inst) => { const name = String(institutionDisplayName(inst) || /** @type {{ name?: unknown }} */ (inst)?.name || '')
  .replace(/^access to (?:an? )?/i, '').replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim(); return `the ${name.charAt(0).toLowerCase()}${name.slice(1)}`; };

/**
 * THE BIRTH'S PICKS ON THE RECORD IN THE MAKING (the grounds the houses prove, the failed venture, the words bought), made
 * once with the generator's seed; a record already picked is returned as it is.
 * @template {Record<string, any>} T @param {T} record @param {unknown} seed @returns {T}
 */
export function birthPicksOn(record, seed) {
  if (record && /** @type {Record<symbol, unknown>} */ (record)[BIRTH_PICKS]) return record;
  const k = storySeed(seed);
  const grounds = groundPicksAtBirth(/** @type {any} */ (record), k);
  /** @type {(r: any, word: string, usedUp: boolean) => boolean} */
  const bought = (r, word, usedUp) => boughtAtBirth(r, word, usedUp, k);
  const staged = { ...record, [BIRTH_PICKS]: { grounds, venture: null, bought } };
  const live = liveInstitutions(/** @type {any} */ (staged)).filter((i) => !!i && typeof i.name === 'string' && i.name && !isMaterializedCustomContent(i));
  // FAULTS-BIRTH (FR8 (b)): a house that keeps or yields the material counts as one of its houses (`KEEPS_OR_YIELDS`)
  /** @param {any} inst @param {string} family */
  const usesFamily = (inst, family) => { const id = idOfInst(inst);
    return MATERIAL_OF[id] === family || ALSO_USES[id] === family || (Object.prototype.hasOwnProperty.call(KEEPS_OR_YIELDS, id) && KEEPS_OR_YIELDS[id].includes(family))
      || inputKeysOf(inst).some((key) => familyOfKey(key) === family); };
  const venture = ventureAtBirth(/** @type {any} */ (staged), k, {
    inputMissing: (inst, family) => inputMissingBeforeStory(/** @type {any} */ (staged), inst, family),
    usersOf: (family) => live.filter((i) => usesFamily(i, family)).length,
    // a ground a failed venture would leave unproved feeds no other house of the town (BR6: it proves nothing)
    feedsAnother: (inst, ground) => {
      const without = { ...staged, [BIRTH_PICKS]: { grounds: new Map([...grounds].filter(([g]) => g !== ground)), venture: null, bought } };
      return live.some((h) => h.name !== inst.name && inputKeysOf(h).some((key) => houseInputAtHand(/** @type {any} */ (staged), key, h, chainOfKey(key)) !== houseInputAtHand(/** @type {any} */ (without), key, h, chainOfKey(key))));
    },
    houseWords: sentenceName,
  });
  const picked = venture && venture.ground ? new Map([...grounds].filter(([g]) => g !== venture.ground)) : grounds;
  return { ...record, [BIRTH_PICKS]: { grounds: picked, venture, bought } };
}

/**
 * BIRTH-3 (BR8 (2)): THE BIRTH WRITES EVERY STORY IT PICKS INTO THE ROWS THE PAGE ALREADY STORES (`resourceAnalysis.gaps`;
 * no new field): the failed venture's rows carry its one line (a row of its material where no chain asked it); a source
 * house its story leaves idle has a `missing` row of its ground's yield, whether or not a chain asks it (a mine, a peat
 * cutter); a source house that runs on its material bought in, on a ground it proves used up, has an `imported` row of
 * that ground's yield. Nothing for a house the land answers. The gaps are written in place (the record in the making).
 * @param {any} record the record in the making, picked (`birthPicksOn`), its imports and gaps written
 * @param {Array<Record<string, unknown>>} gaps the gaps, written in place
 */
function writeStoryRows(record, gaps) {
  const picks = record?.[BIRTH_PICKS];
  if (!picks) return;
  const read = { ...record, resourceAnalysis: { ...(record.resourceAnalysis || {}), gaps } };
  const { all } = (() => { const c = record?.config || {}; return { all: new Set([...(c.nearbyResources || []), ...(c.nearbyResourcesNative || []), ...(c.nearbyResourcesDepleted || [])].map(String)) }; })();
  const live = liveInstitutions(read).filter((i) => !!i && typeof i.name === 'string' && i.name && !isMaterializedCustomContent(i));
  /** @param {string} name */
  const own = (name) => gaps.filter((g) => g && g.institution === name);
  for (const inst of live) {
    const id = idOfInst(inst);
    const name = String(inst.name);
    if (picks.venture && picks.venture.name === name) {
      const rows = own(name).filter((g) => g.kind === 'missing');
      if (rows.length) for (const g of rows) g.impact = picks.venture.line;
      else {
        const family = picks.venture.family;
        const chain = picks.venture.ground ? rowGoodOf(picks.venture.id, picks.venture.ground) : (CHAIN_RAW_INPUT[family] || family);
        gaps.push({ chain, institution: name, kind: 'missing', impact: picks.venture.line, severity: 'high' });
      }
      continue;
    }
    if (!isSourceHouse(id)) continue;
    const story = sourceStoryOf(read, inst, resourceShortageImport);
    if (!story || !story.ground) continue;
    const chain = rowGoodOf(id, story.ground);
    if (!chain) continue;
    const implied = Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id) && IMPLIED_GROUND[id] === story.ground && !SOURCE_GROUNDS[id].some((g) => all.has(g));
    if (story.story === 'idle' && !own(name).some((g) => g.kind === 'missing' && rowNamesGround(g.chain, id, story.ground))) {
      gaps.push(gapRowOf(name, { rawResource: chain }, 'missing'));
    } else if (story.story === 'bought' && implied && !own(name).some((g) => (g.kind === 'imported' || g.kind === 'missing') && rowNamesGround(g.chain, id, story.ground))) {
      gaps.push(gapRowOf(name, { rawResource: chain }, 'imported'));
    }
  }
}

/**
 * The words the birth brings in for the houses that buy and work their material (above), in order, none the list holds.
 * @param {{ config?: Record<string, unknown> | null, economicState?: { primaryImports?: unknown } | null,
 *   institutions?: ReadonlyArray<unknown> | null, resourceAnalysis?: { imports?: unknown } | null }} record the record in
 *   the making (the generator's) or the saved record: the same fields
 * @returns {string[]}
 */
export function importsBroughtAtBirth(record, seed) {
  const config = record?.config || {};
  // BIRTH-2 (BR3 (c), BR5): A CAUSE IS OF ORDINARY TIMES: a siege excludes nothing (the import stays the town's ordinary
  // trade and reads cut off while the siege lasts); only a town with no route even in ordinary times cannot buy in
  if (!record?.economicState || !hasTradeRouteConnection(String(config.tradeRouteAccess ?? ''))) return [];
  const have = Array.isArray(record.economicState.primaryImports) ? record.economicState.primaryImports.map(String) : [];
  // the record in the making, with the birth's picks (BIRTH-3, BR8: the seed is read here, at the birth, and nowhere at print)
  const base = birthPicksOn(record, seed);
  const k = storySeed(seed);
  /** @type {string[]} */
  const add = [];
  const held = new Set(have.map(importWordOf));
  /** @param {unknown} word */
  // BIRTH-3 (the chair's AMENDMENT 1 (2)): no second word of one canonical good (the trade catalog's own reading,
  // `goodsCatalog.js :: subsumeTradeGoods`: "Raw hides and animal products" is the livestock good "Livestock" names)
  const bring = (word) => { if (typeof word === 'string' && word && !held.has(importWordOf(word))
    && subsumeTradeGoods([...have, ...add, word]).length > subsumeTradeGoods([...have, ...add]).length) { held.add(importWordOf(word)); add.push(word); } };
  /** @param {unknown} inst */
  const idOf = (inst) => { const i = /** @type {{ name?: unknown, catalogId?: unknown } | null} */ (inst);
    return String((typeof i?.catalogId === 'string' && i.catalogId) || catalogIdForName(String(i?.name ?? '')) || ''); };
  const live = liveInstitutions(base).filter((i) => !!i && typeof i.name === 'string' && i.name && !isMaterializedCustomContent(i));
  const houses = live.filter((i) => BUYS_AND_WORKS.has(idOf(i)));
  const venture = ventureHouseOf(base); // BIRTH-2 (d): the failed venture buys nothing
  // (1) a buyer on its own spent ground: that ground's shortage import, WHERE THE SEED HAS THE TOWN BUY IT (BIRTH-2 (b))
  const spent = new Set(Array.isArray(config.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted.map(String) : []);
  const onSpent = housesOnSpentGround(base);
  /** @type {Set<string>} the families the seed has the town not buy */
  const refused = new Set();
  const chains = /** @type {Array<{ resourceKey?: unknown, processingInstitutions?: unknown }>} */ (Array.isArray(/** @type {{ activeChains?: unknown }} */ (record.economicState).activeChains) ? /** @type {{ activeChains: any[] }} */ (record.economicState).activeChains : []);
  for (const inst of houses) {
    if (!onSpent.has(inst.name) || worksTheGround(idOf(inst))) continue;
    for (const c of chains) {
      if (!Array.isArray(c?.processingInstitutions) || !c.processingInstitutions.includes(inst.name) || !spent.has(String(c.resourceKey))) continue;
      // the good once: a ground whose yield the list already brings by name ("Grain (a little, beside its own harvest)") is
      // not bought in twice ("Bulk grain (local grain fields depleted)" beside it: the coherence receipt's doubled grain)
      const good = Object.prototype.hasOwnProperty.call(SPENT_GROUND_YIELD, String(c.resourceKey)) ? SPENT_GROUND_YIELD[String(c.resourceKey)] : '';
      if (good && [...have, ...add].some((imp) => namesGood(imp, good))) continue;
      const word = resourceShortageImport(String(c.resourceKey));
      if (!word) continue;
      if (boughtAtBirth(base, word, true, k)) bring(word);
      else refused.add(MATERIAL_OF[idOf(inst)] || String(c.resourceKey)); // not bought: no house of this material is bought for (one answer a material)
    }
  }
  // (1b) BIRTH-2: a source house that runs on bought-in material (`RUNS_ON_BOUGHT`) and whose story is bought: its word
  for (const inst of live) {
    if (!Object.prototype.hasOwnProperty.call(RUNS_ON_BOUGHT, idOf(inst)) || venture?.name === inst.name) continue;
    const story = sourceStoryOf(base, inst, resourceShortageImport);
    if (story?.story === 'bought' && story.word && !held.has(importWordOf(RUNS_ON_BOUGHT[idOf(inst)]))) bring(story.word);
  }
  // (2) a buyer none of whose inputs the one reader answers: its input's word. The record read with the words of (1).
  // BIRTH-2 (b): where a ground of its material is used up (stored or implied), the seed's pick, in that ground's own
  // shortage word; where its material never lay near, the plain word; the failed venture, nothing.
  const rec = { ...base, economicState: { ...record.economicState, primaryImports: [...have, ...add] } };
  const wanting = housesWantingTradeInput(rec);
  for (const inst of houses) {
    if (venture?.name === inst.name) continue;
    const id = idOf(inst);
    const trade = Object.prototype.hasOwnProperty.call(HOUSE_TRADE_INPUT, id) ? HOUSE_TRADE_INPUT[id] : '';
    if (trade === 'luxury') { if (wanting.get(inst.name)?.reach === 'missing') bring(IMPORT_WORD.luxury); continue; }
    const keys = (trade ? [trade] : chainsOfHouse(inst.name, RESOURCE_CHAINS).map(([k]) => k)).filter((k) => !!CHAIN_INPUTS[k]);
    if (!keys.length) continue;
    if (keys.some((k) => houseInputAtHand(rec, k, inst, RESOURCE_CHAINS[k] || { rawResource: CHAIN_RAW_INPUT[k] }) !== 'missing')) continue;
    const family = MATERIAL_OF[id] || keys[0];
    if (refused.has(family)) continue;
    const used = usedGroundOf(rec, family);
    if (!used) { bring(IMPORT_WORD[keys[0]]); continue; }
    // FAULTS-BIRTH FR21 (1): wool and hides take a ground whose shortage word names another good ("Livestock and dairy (local
    // grazing land depleted)" brings no wool): there the material's own word is the one the seed buys or refuses
    const shortage = String(resourceShortageImport(used) || '');
    const own = (family === 'wool' || family === 'hides') && shortage && !namesGood(shortage, FAMILY_NOUN[family] || family);
    const word = own ? String(IMPORT_WORD[keys[0]] || shortage) : String(shortage || IMPORT_WORD[keys[0]] || '');
    if (word && boughtAtBirth(rec, word, true, k)) bring(word);
  }
  return add;
}

// ─── importWordsOfImportedGaps ─────────────────────────────────────────────────
// BAR8 MARKS-2 item 5 (J's root gapImportedNoImport; the sixth chair's BRIEF-BAR8, 2026-11-17, the supply rule's BR3 (b): no
// import is claimed that the imports do not name; vetoable by the owner). The gap writer reads a house's input brought in
// where the food record imports it as well as where the imports list names it (`houseInputAtHand`: the fish a fishmonger
// sells is the food record's import share), so "Fishmonger runs on imported fish" stood beside an imports list that named
// no fish (r2r-village-36, r2s-indebted-village-2, r2s-religious_conversion-village-0). Each `imported` row's good whose
// words (`CHAIN_INPUTS`) no import names gets its buyer's word (`IMPORT_WORD`), once, on the list that exists, under the
// birth's own rule: no second word of one canonical good (`subsumeTradeGoods`; a tannery's "livestock" beside "Raw hides
// and animal products" is that good already, and nothing is written). No draw is taken.
/**
 * @param {ReadonlyArray<Record<string, unknown>>} gaps the gaps as written @param {ReadonlyArray<unknown>} have the imports
 * @returns {string[]} the words to add, in order
 */
function importWordsOfImportedGaps(gaps, have) {
  /** @type {string[]} */
  const add = [];
  const list = () => [...have.map(String), ...add];
  for (const g of gaps) {
    if (!g || g.kind !== 'imported' || typeof g.institution !== 'string') continue;
    const key = Object.keys(CHAIN_RAW_INPUT).find((k) => CHAIN_RAW_INPUT[k] === g.chain && Object.prototype.hasOwnProperty.call(IMPORT_WORD, k));
    if (!key || !CHAIN_INPUTS[key]) continue;
    if (list().some((imp) => CHAIN_INPUTS[key].words.some((w) => namesGood(imp, w)))) continue;
    const word = IMPORT_WORD[key];
    if (list().some((imp) => importWordOf(imp) === importWordOf(word))) continue;
    if (subsumeTradeGoods([...list(), word]).length > subsumeTradeGoods(list()).length) add.push(word);
  }
  return add;
}

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
 * @param {unknown} [seed] - the generator's seed (BIRTH-2: the seed picks each material's story; no draw is taken)
 * @returns {Object} Full resource analysis
 */
export const generateResourceAnalysis = (
  terrainType,
  nearbyResources,
  specialResources,
  institutions,
  config = {},
  economicState = null,
  seed = undefined,
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
  // BIRTH-2 (BR4 (b)): THE GROUND A HOUSE PROVES, THERE BY THE SEED, is no critical import: the need list ("Needed, and not
  // brought in: timber") does not stand beside the woodland the charcoal burner stands in. Read over the record in the making
  // with the generator's seed; it builds no chain and no export (the economy's hour is past: the audit's V2)
  const storyRecord = birthPicksOn({ config, economicState, institutions: nativeInstitutions }, seed); // BIRTH-3 (BR8): the one place the seed enters
  const proven = impliedGroundsShown(storyRecord).there
    .flatMap((g) => impliedGroundGoods(storyRecord, g)); // FAULTS-BIRTH FR21 (3): a river's fishing ground gives no salt
  const imports        = buildViabilityReport(
    terrainType,
    nativeInstitutions,
    [...(nearbyResources || []), ...proven],
  );
  // BIRTH-1 (R2): a house that buys and works its material has it brought in, before the gaps are written (above)
  const importsBeforeBirth = economicState && Array.isArray(economicState.primaryImports) ? [...economicState.primaryImports] : [];
  if (economicState) {
    const brought = importsBroughtAtBirth({ ...storyRecord, resourceAnalysis: { imports } }, seed);
    if (brought.length) economicState.primaryImports = [...importsBeforeBirth, ...brought];
  }
  const gaps           = evaluateInstitutionChain(
    exploitation,
    nativeInstitutions,
    { ...storyRecord, resourceAnalysis: { imports }, importsBeforeBirth }, // the record in the making: houseInputAtHand reads it as the page reads the record (BAR5-CHAINS (b): the need list too), with the birth's picks (BIRTH-3)
  );
  // BIRTH-3 (BR8 (2)): every story the birth picked, written into the rows the page already stores
  writeStoryRows({ ...storyRecord, resourceAnalysis: { imports } }, gaps);
  // BAR8 MARKS-2 item 5 (BR3 (b)): a gap row "runs on imported X" stands beside an imports list that names X
  // (on a connected route only: a town on no road buys nothing in, BIRTH-1's arm 2)
  if (economicState && Array.isArray(economicState.primaryImports) && hasTradeRouteConnection(String(config.tradeRouteAccess ?? ''))) {
    const named = importWordsOfImportedGaps(gaps, economicState.primaryImports);
    if (named.length) economicState.primaryImports = [...economicState.primaryImports, ...named];
  }
  const resourceConditions = nativeResourceConditionRecords(config);
  // after the gaps and the town's settings: a complete row reads both (#457, #1163)
  const exports        = evaluateInstitutionDeps(exploitation, nativeInstitutions, gaps, resourceConditions,
    economicState?.foodSecurity?.foodRecord?.failedSource); // (4): the source a famine failed
  const featureEffects = evaluateResourceChain(specialResources);

  const pri            = getPriorities(config);
  const priorityNotes  = [];
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
      return Boolean(rule) && townSupports(nearbyResources || [], rule, config.tradeRouteAccess, economicState);
    }),
    strategicValue:   townStrategicValue(terrainType, nearbyResources || []),
    priorityNotes,
  };
};
