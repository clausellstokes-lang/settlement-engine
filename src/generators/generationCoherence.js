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
} from '../domain/resourceSemantics.js';
import {
  isAuthoredGenerationEntity,
} from '../domain/generationOwnership.js';
import { createGenerationWorldLaw } from './generationContext.js';
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
  const factions = Array.isArray(settlement?.factions)
    ? settlement.factions.map(faction => withoutCopiedFields(
        faction,
        ['members'],
      ))
    : settlement?.factions;
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
    factions,
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

  const baseChecks = [
    check('template_tokens', 'Narrative templates resolved', tokenFindings),
    check('narrative_quality', 'Generated prose clears grammar seams', grammarFindings),
    check('world_law_magic', 'Generated claims obey world law', worldLawFindings),
    check('content_boundaries', 'Generated themes obey profile', contentFindings),
    check('resource_truth', 'Resource conditions agree across projections', resourceTruthFindings(settlement)),
    check('structural', 'No hard structural violations', hardStructural),
    check('food_verdict', 'Food verdict agrees with ledger', foodFindings),
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
    judgments,
    repairs,
    authoredTensions: Object.freeze(authoredTensions),
  });
}
