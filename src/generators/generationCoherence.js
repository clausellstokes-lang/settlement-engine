/**
 * generationCoherence.js — deterministic final coherence receipt.
 *
 * Generation used to rely on scattered tests and a display validator: a seed
 * could therefore ship a structurally valid object whose prose, route, food
 * verdict, or world-law claims disagreed. This pass does not invent another
 * simulation. It reads the final settlement and records whether the existing
 * canonical systems agree.
 *
 * Random/default generation is expected to finish `coherent`. Explicit player
 * premises may finish `coherent_with_authored_tensions` when the structural
 * validator marks a contradiction `by_design`. Any remaining hard finding is
 * `needs_review` and belongs in the corpus gate.
 */

import {
  generatedContentTopicsOf,
  resolveGenerationContentProfile,
} from '../domain/generationContentProfile.js';
import {
  nativeResourceConditionRecords,
  resourceKeyForLabel,
  resourceShortageImport,
} from '../domain/resourceSemantics.js';
import { factsOf } from '../domain/facts/factsOf.js';
import { offersFoodSurplus } from '../domain/foodSurplus.js';
import { GRAIN_TOP_UP } from './economy/primaryTradeLists.js';
import { TRADE_LINE_BANDS, tradeBandContradictsLabel } from './economy/prosperity.js';
import { PEACE_IRON_HOOKS } from './economy/outlookHookSiblings.js';
import {
  MATERIAL_RESOURCE_KEYS,
  STRATEGIC_CLAUSES,
  STRENGTH_SUPPORT,
  liveMaterialFor,
  townSupports,
} from './resourceGenerator.js';
import {
  isAuthoredGenerationEntity,
} from '../domain/generationOwnership.js';
import { createGenerationWorldLaw } from './generationContext.js';
import { recordBatteryJudgment } from './recordBatteryFindings.js';
import {
  buildGenerationReceiptExtension,
} from './generationReceiptJudgments.js';

const TEMPLATE_TOKEN = /\{[a-z][a-z0-9_]*\}/gi;

/**
 * Remove denormalized identity fields before walking presentation claims.
 * Canonical NPCs and conflicts are scanned at their owning branches; copied
 * roles inside relationship edges or faction memberships must not turn one
 * leak into five indistinguishable findings.
 */
function withoutCopiedFields(value, fields) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !fields.includes(key)),
  );
}

/**
 * Presentation-bearing branches only. Config and trace contain legitimate
 * engine vocabulary and must not be mistaken for player-facing claims.
 */
function presentationBranches(settlement) {
  const culturalIdentity = settlement?.culturalIdentity
    ? Object.fromEntries(
        Object.entries(settlement.culturalIdentity)
          // `scope` documents the profile's full design vocabulary, including
          // alternatives such as "maritime or upland". `exchangePattern`
          // likewise describes the culture-wide repertoire rather than proving
          // that this particular settlement has ocean access. Neither field is
          // an instantiated settlement claim.
          .filter(([key]) => !['scope', 'exchangePattern'].includes(key)),
      )
    : null;
  const relationships = Array.isArray(settlement?.relationships)
    ? settlement.relationships.map(relationship => withoutCopiedFields(
        relationship,
        ['npc1Name', 'npc1Role', 'npc2Name', 'npc2Role'],
      ))
    : settlement?.relationships;
  const powerStructure = withoutCopiedFields(
    settlement?.powerStructure,
    ['conflicts'],
  );
  return {
    institutions: settlement?.institutions,
    availableServices: settlement?.availableServices,
    npcs: settlement?.npcs,
    history: settlement?.history,
    economicState: settlement?.economicState,
    economicViability: settlement?.economicViability,
    resourceAnalysis: settlement?.resourceAnalysis,
    settlementReason: settlement?.settlementReason,
    arrivalScene: settlement?.arrivalScene,
    pressureSentence: settlement?.pressureSentence,
    coherenceNotes: settlement?.coherenceNotes,
    powerStructure,
    // PEOPLE-5A (M-2): the NPC grouping is not a presentation branch — the powers are.
    conflicts: settlement?.conflicts,
    relationships,
    stress: settlement?.stressors ?? settlement?.stress,
    spatialLayout: settlement?.spatialLayout,
    culturalIdentity,
    culturalNotes: settlement?.culturalNotes,
    activeConditions: settlement?.activeConditions,
    defenseProfile: settlement?.defenseProfile,
    neighborRelationship: settlement?.neighborRelationship,
  };
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {Array<{path:string,text:string,authored:boolean}>} out
 * @param {boolean} [inheritedAuthored]
 */
function collectStrings(value, path, out, inheritedAuthored = false) {
  if (typeof value === 'string') {
    out.push({ path, text: value, authored: inheritedAuthored });
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => (
      collectStrings(entry, `${path}[${index}]`, out, inheritedAuthored)
    ));
    return;
  }
  const record = /** @type {Record<string, any>} */ (value);
  const authored = inheritedAuthored
    || isAuthoredGenerationEntity(record);
  for (const [key, child] of Object.entries(record)) {
    collectStrings(child, path ? `${path}.${key}` : key, out, authored);
  }
}

function finding(path, detail, evidence = null) {
  return {
    path,
    detail,
    ...(evidence ? { evidence } : {}),
  };
}

function check(id, label, findings) {
  return Object.freeze({
    id,
    label,
    status: findings.length ? 'fail' : 'pass',
    findings: Object.freeze(findings),
  });
}

function normalizedName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const RESOURCE_IMPORT_NOISE = new Set([
  'and',
  'bulk',
  'coastal',
  'desert',
  'fine',
  'foodstuffs',
  'goods',
  'large',
  'local',
  'luxury',
  'major',
  'mountain',
  'quality',
  'river',
]);

function materialTerms(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter(word => word.length > 3 && !RESOURCE_IMPORT_NOISE.has(word));
}

function criticalImportMatchesAvailableRecord(label, record) {
  const required = new Set(materialTerms(label));
  if (required.size === 0) return false;
  return [
    record?.key,
    record?.label,
  ].some(value => materialTerms(value).some(term => required.has(term)));
}

/**
 * Prove that the persisted resource authority and its two most important
 * projections agree. The check deliberately compares exact catalog keys, not
 * prose or fuzzy commodity aliases: `resourceAnalysis.availableResources` and
 * active-chain condition fields are derived views, never alternate rosters.
 *
 * @param {any} settlement
 * @returns {Array<{path:string, detail:string, evidence?:string}>}
 */
function resourceTruthFindings(settlement) {
  const config = settlement?.config || {};
  const records = nativeResourceConditionRecords(config);
  const byKey = new Map(records.map(record => [record.key, record.condition]));
  const findings = [];
  const analysisAvailable = new Set(
    Array.isArray(settlement?.resourceAnalysis?.availableResources)
      ? settlement.resourceAnalysis.availableResources
          .map(resourceKeyForLabel)
          .filter(Boolean)
      : [],
  );

  for (const record of records) {
    const analysisClaimsAvailable = analysisAvailable.has(record.key);
    if (
      (record.condition === 'available' && !analysisClaimsAvailable)
      || (record.condition === 'depleted' && analysisClaimsAvailable)
    ) {
      findings.push(finding(
        `resourceAnalysis.availableResources.${record.key}`,
        'Resource-analysis availability disagrees with the canonical resource condition.',
        `authority=${record.condition}; analysis=${analysisClaimsAvailable ? 'available' : 'unavailable'}`,
      ));
    }
  }

  const nativeRoster = new Set(records.map(record => record.key));
  for (const value of config.nearbyResourcesNativeDepleted || []) {
    const key = resourceKeyForLabel(value);
    if (key && !nativeRoster.has(key)) {
      findings.push(finding(
        `config.nearbyResourcesNativeDepleted.${key}`,
        'A depleted resource is absent from the canonical native roster.',
        key,
      ));
    }
  }

  const criticalImports = Array.isArray(
    settlement?.resourceAnalysis?.imports?.critical,
  )
    ? settlement.resourceAnalysis.imports.critical
    : [];
  for (const [index, label] of criticalImports.entries()) {
    const supplied = records.find(record => (
      record.condition === 'available'
      && criticalImportMatchesAvailableRecord(label, record)
    ));
    if (!supplied) continue;
    findings.push(finding(
      `resourceAnalysis.imports.critical[${index}]`,
      'A critical import contradicts an available canonical local resource.',
      `${label}: supplied by ${supplied.key}`,
    ));
  }

  for (const [index, chain] of (
    settlement?.economicState?.activeChains || []
  ).entries()) {
    const primaryKey = resourceKeyForLabel(chain?.resourceKey);
    const primaryCondition = primaryKey ? byKey.get(primaryKey) : null;
    if (
      primaryCondition
      && chain.resourceCondition
      && chain.resourceCondition !== primaryCondition
    ) {
      findings.push(finding(
        `economicState.activeChains[${index}].resourceCondition`,
        'Active-chain primary condition disagrees with canonical resource truth.',
        `${primaryKey}: authority=${primaryCondition}; chain=${chain.resourceCondition}`,
      ));
    }

    const inputKey = resourceKeyForLabel(chain?.resourceInputKey);
    const inputCondition = inputKey ? byKey.get(inputKey) : null;
    if (
      inputCondition
      && chain.resourceInputCondition
      && chain.resourceInputCondition !== inputCondition
    ) {
      findings.push(finding(
        `economicState.activeChains[${index}].resourceInputCondition`,
        'Active-chain input condition disagrees with canonical resource truth.',
        `${inputKey}: authority=${inputCondition}; chain=${chain.resourceInputCondition}`,
      ));
    }
    if (
      inputCondition === 'depleted'
      && chain.resourceInputAvailable === true
    ) {
      findings.push(finding(
        `economicState.activeChains[${index}].resourceInputAvailable`,
        'A depleted canonical input is still marked available to its active chain.',
        inputKey,
      ));
    }
  }

  return findings;
}

/**
 * The income lines that name a local resource, and the resources that make them true.
 * @type {ReadonlyArray<readonly [RegExp, ReadonlyArray<string>]>}
 */
const LOCAL_INCOME_WORDS = Object.freeze([
  // COHERENCE-AGREE-3 (F3): the smith's ore is iron, the material table's one answer (economy/localMaterials.js);
  // gold and silver are not the smith's ore, so a "Local ore" line beside them alone is a disagreement.
  [/^Local ore\b/, MATERIAL_RESOURCE_KEYS.metals],
  [/^Local forest\b/, ['managed_forest', 'timber', 'mountain_timber', 'shipbuilding_timber']],
  [/^Local quarry\b/, ['stone_quarry']],
  [/^Local flocks\b/, ['grazing_land', 'alpine_pasture']],
]);

/** The safety text's court sentences: one says a court sits, the other that none does. */
const COURT_SITS = /\b(?:a court exists|the court can try|before the court|tried at the court|the court sits|functioning court|with a working court|only a court|prosecution is real|real prosecution)/i;
const COURT_ABSENT = /\b(?:with no court|without a court|without courts|without a working court|without consistent courts|without prison or courts|no reliable court|lack of reliable courts)/i;

/** The peacetime iron events and their twins (economy/outlookHookSiblings.js): each presumes the peace. */
const PEACE_IRON_TEXTS = new Set(PEACE_IRON_HOOKS.flat());

/** The town's watch named as its own ("the watch"); "There is no watch" names none. */
const WATCH_NAMED = /(?<!\bno )\bthe watch\b/i;

/** The town's gates named as standing ("by the gates", "the gates"); "no gates" names none. */
const GATES_NAMED = /(?<!\bno )\bgates?\b/i;

/** A market named as the town's own ("the market", "markets meet"); a black market is not one. */
const MARKET_NAMED = /(?<!black )\bmarkets?\b/i;

/**
 * A hook's words for a material, and the must-import key that names it.
 * @type {ReadonlyArray<readonly [RegExp, string]>}
 */
const SCARCE_MATERIAL_WORDS = Object.freeze([[/\b(?:iron|metal)\b/i, 'metals'], [/\btimber\b/i, 'timber']]);

/**
 * A shortage import's bracket names a kind of land; the resources that ARE that land (F12b, COHERENCE-AGREE-3).
 * A shortage that says the town's pastures are spent beside a live pasture tells two stories.
 * @type {ReadonlyArray<readonly [RegExp, ReadonlyArray<string>]>}
 */
const SHORTAGE_LAND_WORDS = Object.freeze([
  [/\(local pastures? /i, ['grazing_land', 'alpine_pasture']],
  [/\(local (?:grain )?fields /i, ['grain_fields']],
  [/\(local floodplain /i, ['fertile_floodplain']],
  [/\(local forests? /i, ['timber', 'managed_forest', 'mountain_timber', 'shipbuilding_timber']],
]);

/** Worked land and the food source it is (the chair's food-sources ruling, 2026-11-11; game and fish keep their rules). */
const CULTIVATED_SOURCE_OF = Object.freeze({ grain_fields: 'grain', fertile_floodplain: 'grain', grazing_land: 'livestock' });

/**
 * THE PROJECTION-AGREEMENT ARM (COHERENCE-AGREE, 2026-11-11). One fact, one answer: every field of
 * the record that states a fact the town's own drawn record answers must agree with it. The terrain
 * tables are defaults the town's resources override; a second reader of a fact must not answer it
 * otherwise. `resource` findings join `resource_truth`, `food` findings join `food_verdict`, so the
 * receipt keeps its checks and its shape; a town that agrees prints the receipt it printed before.
 *   imports    a critical import "this terrain cannot produce" beside a live resource that yields it
 *   strengths  a terrain strength with nothing of the town's under it (the table is total: a strength
 *              the table does not know is a finding, so the table cannot fall behind the terrain data)
 *   strategic  a yield clause of the strategic line the town's resources do not stand on
 *   hooks      a viability hook that names a war the record does not hold, presumes the peace where it holds
 *              one, or makes scarce a material the town has
 *   income     an income line that names a local resource ("Local ore", "Local quarry") the town lacks
 *   viability  an "Imports …" note beside a live resource that yields it (one reader of the must-import list)
 *   gate       the safety text naming gates the gate home does not hold
 *   watch      the safety text naming the watch where the defence home holds none
 *   safety     the safety text naming a mercenary company the defence home does not list; saying a
 *              court sits where the defence home has none, or that none sits where it has one
 *   market     the economic situation, or the food record's foodways line, naming a market the market home says the town lacks
 *   trade      the economic situation's trade line saying the opposite of the prosperity label (prosperity.js)
 *   sources    available fields, floodplain or grazing that the food record does not count as a source
 *   surplus    an income line selling a surplus the food record does not hold (offersFoodSurplus)
 *   land       a shortage import whose bracket says a kind of land is spent beside a live resource of that land
 *   food       bare grain a primary import, unqualified, where the town grows 90% or more of its need; a
 *              shortage import ("local fields depleted") beside the resource it says is spent
 * @param {any} settlement
 * @returns {{ resource: Array<{path:string, detail:string, evidence?:string}>, food: Array<{path:string, detail:string, evidence?:string}> }}
 */
export function projectionAgreementFindings(settlement) {
  const resource = [];
  const food = [];
  const analysis = settlement?.resourceAnalysis;
  const available = Array.isArray(analysis?.availableResources) ? analysis.availableResources.map(String) : [];
  const route = String(settlement?.config?.tradeRouteAccess || '');
  if (analysis && Array.isArray(analysis.availableResources)) {
    for (const [index, label] of (analysis.imports?.critical || []).entries()) {
      if (!/cannot produce this locally/.test(String(analysis.imports?.reasons?.[label] || ''))) continue;
      const live = liveMaterialFor(label, available);
      if (live) resource.push(finding(`resourceAnalysis.imports.critical[${index}]`, 'A terrain must-import names a material a live local resource yields.', `${label}: ${live}`));
    }
    for (const [index, strength] of (analysis.economicStrengths || []).entries()) {
      const rule = STRENGTH_SUPPORT[/** @type {keyof typeof STRENGTH_SUPPORT} */ (strength)];
      if (!rule || !townSupports(available, rule, route)) {
        resource.push(finding(`resourceAnalysis.economicStrengths[${index}]`, rule ? 'A terrain strength has nothing of the town\'s under it.' : 'A terrain strength has no support row.', String(strength)));
      }
    }
    const line = String(analysis.strategicValue || '');
    for (const { readings } of STRATEGIC_CLAUSES[/** @type {keyof typeof STRATEGIC_CLAUSES} */ (settlement?.config?.terrainType)] || []) {
      const said = readings.find((r) => r.text && r.needs.length && line.includes(r.text));
      if (said && !said.needs.every((group) => group.some((key) => available.includes(key)))) {
        resource.push(finding('resourceAnalysis.strategicValue', 'The strategic line names a yield the town lacks.', said.text.replace(/^[, ]+|[, ]+$/g, '')));
      }
    }
  }
  const facts = factsOf(settlement);
  for (const [index, entry] of (settlement?.economicViability?.plotHooks || []).entries()) {
    const hook = String(entry?.hook || '');
    if (/\b(?:war|armies|siege)\b/i.test(hook) && facts.warState === 'peace') {
      resource.push(finding(`economicViability.plotHooks[${index}]`, 'A hook asserts a war the record does not hold.', facts.warState));
    }
    // F4 (COHERENCE-AGREE-3): both directions — a peacetime iron event where the record holds a war or a front.
    if (PEACE_IRON_TEXTS.has(hook) && facts.warState !== 'peace') {
      resource.push(finding(`economicViability.plotHooks[${index}]`, 'A hook presumes the peace where the record holds a war.', facts.warState));
    }
    for (const [word, material] of SCARCE_MATERIAL_WORDS) {
      const live = word.test(hook) ? liveMaterialFor(material, available) : null;
      if (live) resource.push(finding(`economicViability.plotHooks[${index}]`, 'A hook makes a material scarce that a live local resource yields.', `${material}: ${live}`));
    }
  }
  for (const [index, entry] of (settlement?.economicState?.incomeSources || []).entries()) {
    const said = LOCAL_INCOME_WORDS.find(([words]) => words.test(String(entry?.desc || '')));
    if (said && !said[1].some((key) => available.includes(key))) {
      resource.push(finding(`economicState.incomeSources[${index}].desc`, 'An income line names a local resource the town does not have.', String(entry?.source || '')));
    }
  }
  for (const field of ['dependencies', 'warnings']) {
    for (const [index, entry] of (settlement?.economicViability?.[field] || []).entries()) {
      const imported = entry?.category === 'Resource Import' ? /^Imports (.+)$/.exec(String(entry?.title || '')) : null;
      const live = imported ? liveMaterialFor(imported[1], available) : null;
      if (live) resource.push(finding(`economicViability.${field}[${index}]`, 'The viability notes an import a live local resource yields.', `${imported?.[1]}: ${live}`));
    }
  }
  const safety = settlement?.economicState?.safetyProfile;
  for (const field of ['guardEffectivenessDesc', 'safetyDesc']) {
    if (/\bmercenary compan/i.test(String(safety?.[field] || '')) && facts.defence?.mercenary === false) {
      resource.push(finding(`economicState.safetyProfile.${field}`, 'The safety text names a mercenary company the defence record does not list.'));
    }
  }
  // F5 (COHERENCE-AGREE-3): the gate — the safety text naming the town's gates where the gate home has none.
  const gateTexts = [['guardEffectivenessDesc', safety?.guardEffectivenessDesc], ['safetyDesc', safety?.safetyDesc],
    ...(Array.isArray(safety?.crimeTypes) ? safety.crimeTypes.map((c, i) => [`crimeTypes[${i}].desc`, c?.desc]) : [])];
  for (const [field, text] of gateTexts) {
    if (facts.defence?.gate === false && GATES_NAMED.test(String(text || ''))) resource.push(finding(`economicState.safetyProfile.${field}`, 'The safety text names gates the defence record does not hold.'));
    // F12 (COHERENCE-AGREE-3): the watch — named as the town's own where the defence home has none.
    if (facts.defence?.watch === false && WATCH_NAMED.test(String(text || ''))) resource.push(finding(`economicState.safetyProfile.${field}`, 'The safety text names a watch the defence record does not hold.'));
  }
  if (facts.market === false && MARKET_NAMED.test(String(settlement?.economicState?.situationDesc || ''))) {
    resource.push(finding('economicState.situationDesc', 'The economic situation names a market the town does not have.'));
  }
  // F11 (COHERENCE-AGREE-3): the trade line against the prosperity label printed beside it.
  const situation = String(settlement?.economicState?.situationDesc || '');
  const tradeBand = TRADE_LINE_BANDS.find(([words]) => words.test(situation));
  if (tradeBand && tradeBandContradictsLabel(tradeBand[1], settlement?.economicState?.prosperity)) {
    resource.push(finding('economicState.situationDesc', 'The trade line says the opposite of the prosperity label beside it.', `${tradeBand[1]}; ${settlement?.economicState?.prosperity}`));
  }
  // F6 (COHERENCE-AGREE-3): the food record's foodways line reads the market home too.
  if (facts.market === false && MARKET_NAMED.test(String(settlement?.economicState?.foodSecurity?.foodRecord?.foodwaysLine || ''))) {
    resource.push(finding('economicState.foodSecurity.foodRecord.foodwaysLine', 'The foodways line names a market the town does not have.'));
  }
  const court = facts.defence?.court;
  const courtTexts = [['guardEffectivenessDesc', safety?.guardEffectivenessDesc], ['safetyDesc', safety?.safetyDesc],
    ...(Array.isArray(safety?.crimeTypes) ? safety.crimeTypes.map((c, i) => [`crimeTypes[${i}].desc`, c?.desc]) : [])];
  for (const [field, text] of courtTexts) {
    const said = String(text || '');
    if (court === false && COURT_SITS.test(said)) resource.push(finding(`economicState.safetyProfile.${field}`, 'The safety text says a court sits where the defence record has none.'));
    if (court === true && COURT_ABSENT.test(said)) resource.push(finding(`economicState.safetyProfile.${field}`, 'The safety text says no court sits where the defence record has one.'));
  }
  const imports = Array.isArray(settlement?.economicState?.primaryImports) ? settlement.economicState.primaryImports.map(String) : [];
  const grownPct = Number(settlement?.economicState?.foodSecurity?.foodRecord?.grownPct);
  for (const [index, label] of imports.entries()) {
    // F8 (COHERENCE-AGREE-3): a bracketed grain import says how little too, where the town feeds itself.
    if (/^(?:bulk )?grain(?: and (?:foodstuffs|produce))?(?: \([^)]*\))?$/i.test(label) && label !== GRAIN_TOP_UP && grownPct >= 90) {
      food.push(finding(`economicState.primaryImports[${index}]`, 'Grain stands as a primary import, unqualified, where the town grows most of its need.', `${label}; grown ${grownPct}%`));
    }
  }
  // F7 (COHERENCE-AGREE-3): an income line that sells a surplus reads the food record's one surplus rule.
  const foodRecord = settlement?.economicState?.foodSecurity?.foodRecord;
  for (const [index, entry] of (settlement?.economicState?.incomeSources || []).entries()) {
    if (/^Surplus from local harvest\b/.test(String(entry?.desc || '')) && foodRecord && !offersFoodSurplus(foodRecord)) {
      food.push(finding(`economicState.incomeSources[${index}].desc`, 'An income line sells a surplus the food record does not hold.', `grown ${grownPct}%; band ${foodRecord.band}`));
    }
  }
  for (const [index, label] of imports.entries()) {
    const said = SHORTAGE_LAND_WORDS.find(([words]) => words.test(label));
    const live = said ? said[1].find((key) => available.includes(key)) : null;
    if (live) food.push(finding(`economicState.primaryImports[${index}]`, 'A shortage import says land is spent that a live resource is.', `${label}: ${live} available`));
  }
  const sources = settlement?.economicState?.foodSecurity?.foodRecord?.foodSources;
  for (const record of nativeResourceConditionRecords(settlement?.config || {})) {
    // The chair's food-sources ruling (2026-11-11): worked land is a source by its own name.
    const source = record.condition === 'available' ? CULTIVATED_SOURCE_OF[record.key] : null;
    if (source && Array.isArray(sources) && !sources.includes(source)) {
      food.push(finding('economicState.foodSecurity.foodRecord.foodSources', 'Available worked land is not among the food sources.', `${record.key}: no ${source}`));
    }
    const shortage = record.condition === 'available' ? resourceShortageImport(record.key) : null;
    const index = shortage ? imports.indexOf(shortage) : -1;
    if (index >= 0) food.push(finding(`economicState.primaryImports[${index}]`, 'A shortage import stands beside the resource it says is spent.', `${shortage}: ${record.key} available`));
  }
  return { resource, food };
}

/**
 * @param {any} settlement
 * @param {{
 *   generationRepairs?: Array<any>,
 *   generationContext?: any,
 *   seed?: string,
 * }} [context]
 */
export function buildGenerationCoherenceReceipt(settlement, context = {}) {
  /** @type {Array<{path:string,text:string,authored:boolean}>} */
  const strings = [];
  Object.entries(presentationBranches(settlement)).forEach(([path, branch]) => (
    collectStrings(branch, path, strings)
  ));

  const tokenFindings = [];
  const generatedStrings = strings.filter(item => !item.authored);
  for (const entry of generatedStrings) {
    const matches = entry.text.match(TEMPLATE_TOKEN);
    if (matches?.length) {
      tokenFindings.push(finding(
        entry.path,
        'Unresolved narrative template token.',
        [...new Set(matches)].join(', '),
      ));
    }
  }

  const grammarFindings = [];
  for (const entry of generatedStrings) {
    const withoutAbbreviations = entry.text.replace(
      /\b(?:e\.g|i\.e)\.\s+/gi,
      '',
    );
    let detail = null;
    if (/\bthe\s+(?:the|a|an)\b/i.test(entry.text)) {
      detail = 'Doubled article in generated prose.';
    } else if (/(?<!\.)\.\.(?!\.)/.test(entry.text)) {
      detail = 'Doubled terminal punctuation in generated prose.';
    } else if (/\b(?:there is|in)\s+a\s+(?:outstanding|embattled)\b/i.test(entry.text)) {
      detail = 'Incorrect indefinite article in generated prose.';
    } else if (/(?<!\.)[.!]\s+[a-z][a-z'-]{2,}/.test(withoutAbbreviations)) {
      detail = 'Sentence begins with a lower-case word.';
    }
    if (detail) {
      grammarFindings.push(finding(
        entry.path,
        detail,
        entry.text,
      ));
    }
    if (grammarFindings.length >= 25) break;
  }

  const worldLaw = context.generationContext?.worldLaw
    || createGenerationWorldLaw(
      settlement?.config || {},
      {
        tier: settlement?.tier,
        tradeRoute:
          settlement?.config?.tradeRouteAccess
          || settlement?.economicState?.tradeAccess,
        terrainType: settlement?.config?.terrainType,
      },
    );
  const worldLawFindings = [];
  for (const entry of generatedStrings) {
    if (
      typeof worldLaw.allowsMagicClaim === 'function'
      && !worldLaw.allowsMagicClaim(entry.text)
    ) {
      worldLawFindings.push(finding(
        entry.path,
        'Functional-magic claim in a world where magic does not function.',
        entry.text,
      ));
    }
    if (
      typeof worldLaw.allowsMaritimeClaim === 'function'
      && !worldLaw.allowsMaritimeClaim(entry.text)
    ) {
      worldLawFindings.push(finding(
        entry.path,
        'Maritime claim without coastal or ocean-going capability.',
        entry.text,
      ));
    }
    if (worldLawFindings.length >= 25) break;
  }

  const contentProfile = resolveGenerationContentProfile(settlement?.config);
  const authoredTopicRoots = new Map();
  for (const entry of strings.filter(item => item.authored)) {
    for (const topic of generatedContentTopicsOf(entry.text)) {
      if (
        contentProfile.boundaries[topic] !== true
        && !authoredTopicRoots.has(topic)
      ) {
        authoredTopicRoots.set(topic, entry.path);
      }
    }
  }
  const contentFindings = [];
  for (const entry of strings.filter(item => !item.authored)) {
    const excluded = generatedContentTopicsOf(entry.text)
      .filter(topic => (
        contentProfile.boundaries[topic] !== true
        && !authoredTopicRoots.has(topic)
      ));
    if (excluded.length) {
      contentFindings.push(finding(
        entry.path,
        `Content falls outside the ${contentProfile.id} generated-theme profile.`,
        excluded.join(', '),
      ));
    }
  }

  const structural = Array.isArray(settlement?.structuralViolations)
    ? settlement.structuralViolations
    : [];
  const hardStructural = structural
    .filter(item => ['error', 'critical'].includes(item?.severity))
    .map(item => finding(
      `structural.${item?.type || 'violation'}`,
      item?.reason || 'Unresolved structural violation.',
      item?.institution || null,
    ));
  const authoredTensions = structural
    .filter(item => item?.severity === 'by_design')
    .map(item => Object.freeze({
      type: item?.type || 'authored_tension',
      subject: item?.institution || null,
      reason: item?.reason || 'Explicit player premise.',
    }));
  for (const [topic, path] of authoredTopicRoots) {
    authoredTensions.push(Object.freeze({
      type: 'content_boundary_override',
      subject: path,
      reason: `Authored ${topic.replace(/_/g, ' ')} content intentionally sits outside the selected generated-theme profile.`,
    }));
  }

  const foodFindings = [];
  const food = settlement?.economicViability?.metrics?.foodBalance;
  const foodNeed = Number(food?.dailyNeed) || 0;
  const foodDeficit = Number(food?.deficit) || 0;
  const foodVerdicts = [
    [
      'economicViability.summary',
      settlement?.economicViability?.summary,
    ],
    [
      'economicState.situationDesc',
      settlement?.economicState?.situationDesc,
    ],
  ];
  if (foodNeed > 0 && foodDeficit / foodNeed > 0.25) {
    for (const [path, value] of foodVerdicts) {
      if (!/self-sufficient/i.test(String(value || ''))) continue;
      foodFindings.push(finding(
        path,
        'Self-sufficiency verdict contradicts the canonical food ledger.',
        `${Math.round((foodDeficit / foodNeed) * 100)}% unmet need`,
      ));
    }
  }

  const duplicateFindings = [];
  const names = new Map();
  for (const npc of settlement?.npcs || []) {
    const key = normalizedName(npc?.name);
    if (!key) continue;
    const prior = names.get(key);
    if (prior) {
      duplicateFindings.push(finding(
        `npcs.${npc?.id || key}`,
        'Two notable NPCs share the same display name.',
        `${prior?.id || 'unknown'} / ${npc?.id || 'unknown'}`,
      ));
    } else {
      names.set(key, npc);
    }
  }

  const isolationFindings = [];
  const isolationSupport = settlement?.isolationSupport;
  if (
    settlement?.config?.tradeRouteAccess === 'isolated'
    && ['town', 'city', 'metropolis'].includes(settlement?.tier)
    && isolationSupport?.deficit > 0
    && settlement?.config?._routeIntent !== 'explicit'
  ) {
    isolationFindings.push(finding(
      'isolationSupport',
      'Random generation left a town-scale isolation support gap.',
      `${isolationSupport.capacity}/${isolationSupport.requiredCapacity}`,
    ));
  }

  const agreement = projectionAgreementFindings(settlement);
  const baseChecks = [
    check('template_tokens', 'Narrative templates resolved', tokenFindings),
    check('narrative_quality', 'Generated prose clears grammar seams', grammarFindings),
    check('world_law_magic', 'Generated claims obey world law', worldLawFindings),
    check('content_boundaries', 'Generated themes obey profile', contentFindings),
    check('resource_truth', 'Resource conditions agree across projections', [...resourceTruthFindings(settlement), ...agreement.resource]),
    check('structural', 'No hard structural violations', hardStructural),
    check('food_verdict', 'Food verdict agrees with ledger', [...foodFindings, ...agreement.food]),
    check('npc_identity', 'Notable NPC display identities are unique', duplicateFindings),
    check('isolation_support', 'Isolation support is explained and sufficient', isolationFindings),
  ];
  const seed = String(context.seed || settlement?._seed || '');
  const worldLawVersion = context.generationContext?.worldLaw?.version
    ?? worldLaw?.version
    ?? null;
  const repairs = Object.freeze([...(context.generationRepairs || [])]);
  const { checks, judgments } = buildGenerationReceiptExtension({
    settlement,
    baseChecks,
    authoredTensions,
    repairs,
    seed,
    worldLawVersion,
  });
  const hardFindings = checks.reduce(
    (sum, item) => sum + item.findings.length,
    0,
  );
  const status = hardFindings > 0
    ? 'needs_review'
    : authoredTensions.length
      ? 'coherent_with_authored_tensions'
      : 'coherent';

  return Object.freeze({
    version: 1,
    status,
    seed,
    worldLawVersion,
    cultureProfile: settlement?.culturalIdentity?.key || settlement?.config?.culture || null,
    contentProfile: contentProfile.id,
    checks,
    // The eighth judgment (lane SELF-VOUCH): the coherence battery over the stored record.
    judgments: Object.freeze([...judgments, recordBatteryJudgment(settlement)]),
    repairs,
    authoredTensions: Object.freeze(authoredTensions),
  });
}
