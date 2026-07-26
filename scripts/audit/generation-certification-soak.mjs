#!/usr/bin/env node
/**
 * Assertive, large-corpus certification for settlement generation.
 *
 * The ordinary Vitest corpus keeps a compact, reviewable set of named fixtures
 * on the per-change path. This scheduled/manual soak widens that evidence
 * without turning a golden hash into a correctness oracle. It imports the live
 * generator vocabularies, generates deterministic configurations, inspects the
 * final persisted dossier directly, and exits non-zero on any unresolved
 * receipt, broken reference, conservation error, or replay mismatch.
 *
 * Usage:
 *   node scripts/audit/generation-certification-soak.mjs
 *   node scripts/audit/generation-certification-soak.mjs \
 *     --count 1200 \
 *     --output artifacts/generation/certification.json
 */

import {
  mkdirSync,
  writeFileSync,
} from 'node:fs';
import {
  dirname,
  resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  POPULATION_RANGES,
  TIER_ORDER,
} from '../../src/data/constants.js';
import { MONSTER_THREAT_TIERS } from '../../src/data/monsterThreat.js';
import { CULTURE_PROFILE_KEYS } from '../../src/domain/cultureProfiles.js';
import { GENERATION_CONTENT_PROFILES } from '../../src/domain/generationContentProfile.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { TERRAIN_WEIGHTS } from '../../src/generators/steps/resolveConfig.js';

const DEFAULT_COUNT = 1_200;
const MAX_EXAMPLES = 20;
const FORMAL_JUDGMENT_IDS = Object.freeze([
  'hard_structural_validity',
  'cross_system_semantic_agreement',
  'user_intent_fulfillment',
  'narrative_realization',
  'dramatic_tension',
  'diversity_and_repetition',
  'confidence_and_provenance',
]);

const TERRAIN_VALUES = Object.freeze(
  TERRAIN_WEIGHTS.map(([terrain]) => terrain),
);
const ROUTE_VALUES = Object.freeze([
  'road',
  'river',
  'port',
  'crossroads',
  'isolated',
  'none',
]);
const CONTENT_PROFILE_VALUES = Object.freeze(
  Object.keys(GENERATION_CONTENT_PROFILES),
);
const MAGIC_SCENARIOS = Object.freeze([
  Object.freeze({ magicExists: false, priorityMagic: 0 }),
  Object.freeze({ magicExists: false, priorityMagic: 100 }),
  Object.freeze({ magicExists: true, priorityMagic: 0 }),
  Object.freeze({ magicExists: true, priorityMagic: 90 }),
]);

export const GENERATION_DIMENSIONS = Object.freeze({
  tiers: Object.freeze([...TIER_ORDER]),
  cultures: Object.freeze([...CULTURE_PROFILE_KEYS]),
  terrains: TERRAIN_VALUES,
  routes: ROUTE_VALUES,
  threats: Object.freeze([...MONSTER_THREAT_TIERS]),
  contentProfiles: CONTENT_PROFILE_VALUES,
  magicScenarios: MAGIC_SCENARIOS,
});

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (
      value
      + Math.imul(value ^ (value >>> 7), 61 | value)
    ) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function selectDimension(
  values,
  index,
  stride,
  offset = 0,
  phaseEvery = null,
) {
  const phase = phaseEvery ? Math.floor(index / phaseEvery) : 0;
  return values[(index * stride + offset + phase) % values.length];
}

/**
 * Produce one live generator config without stale aliases such as `terrain`,
 * `magicLevel`, or the retired four-culture vocabulary.
 */
export function configForIndex(index) {
  const random = mulberry32(Math.imul(index + 1, 2_654_435_761));
  const magic = selectDimension(
    MAGIC_SCENARIOS,
    index,
    3,
    0,
    TIER_ORDER.length,
  );

  return {
    settType: selectDimension(TIER_ORDER, index, 1),
    culture: selectDimension(CULTURE_PROFILE_KEYS, index, 5, 1, TIER_ORDER.length),
    terrainOverride: selectDimension(TERRAIN_VALUES, index, 3, 2, CULTURE_PROFILE_KEYS.length),
    tradeRouteAccess: selectDimension(ROUTE_VALUES, index, 5, 3, TIER_ORDER.length),
    monsterThreat: selectDimension(MONSTER_THREAT_TIERS, index, 2, 1, ROUTE_VALUES.length),
    contentProfile: selectDimension(CONTENT_PROFILE_VALUES, index, 2, 0, CULTURE_PROFILE_KEYS.length),
    ...magic,
    priorityEconomy: Math.floor(random() * 101),
    priorityMilitary: Math.floor(random() * 101),
    priorityReligion: Math.floor(random() * 101),
    priorityCriminal: Math.floor(random() * 101),
  };
}

function normalizedIdentity(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function inspectFiniteNumbers(value, path, findings) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      findings.push({
        code: 'non_finite_number',
        path,
        detail: String(value),
      });
    }
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      inspectFiniteNumbers(entry, `${path}[${index}]`, findings);
    });
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    inspectFiniteNumbers(child, `${path}.${key}`, findings);
  }
}

function addFinding(findings, code, path, detail) {
  findings.push({
    code,
    path,
    detail,
  });
}

/**
 * Inspect facts independently of `generationCoherenceReceipt`.
 *
 * The receipt is also required below, but it cannot prove itself. These graph,
 * chronology, and conservation checks deliberately read the final dossier.
 */
export function inspectSettlement(settlement, config) {
  const findings = [];
  const receipt = settlement?.generationCoherenceReceipt;

  if (!receipt) {
    addFinding(findings, 'receipt_missing', 'generationCoherenceReceipt', 'No receipt was persisted.');
  } else {
    if (receipt.status === 'needs_review') {
      addFinding(
        findings,
        'receipt_needs_review',
        'generationCoherenceReceipt.status',
        receipt.checks
          ?.filter(check => check.status === 'fail')
          .map(check => check.id)
          .join(', ') || 'unspecified',
      );
    }
    for (const check of receipt.checks || []) {
      if (check.status !== 'pass' || check.findings?.length) {
        addFinding(
          findings,
          'receipt_check_failed',
          `generationCoherenceReceipt.${check.id}`,
          `${check.findings?.length || 0} finding(s)`,
        );
      }
    }
    const judgmentIds = (receipt.judgments || [])
      .map(judgment => judgment?.id);
    if (
      judgmentIds.length !== FORMAL_JUDGMENT_IDS.length
      || judgmentIds.some((id, index) => id !== FORMAL_JUDGMENT_IDS[index])
    ) {
      addFinding(
        findings,
        'receipt_judgments_invalid',
        'generationCoherenceReceipt.judgments',
        `Expected ${FORMAL_JUDGMENT_IDS.join(', ')}; received ${judgmentIds.join(', ') || 'none'}.`,
      );
    }
    for (const judgment of receipt.judgments || []) {
      if (judgment?.status === 'needs_review') {
        addFinding(
          findings,
          'receipt_judgment_failed',
          `generationCoherenceReceipt.judgments.${judgment?.id || 'unknown'}`,
          judgment?.summary || 'Formal judgment needs review.',
        );
      }
      if (!judgment?.evidence?.length) {
        addFinding(
          findings,
          'receipt_judgment_evidence_missing',
          `generationCoherenceReceipt.judgments.${judgment?.id || 'unknown'}`,
          'Formal judgment has no supporting evidence.',
        );
      }
    }
  }

  if (settlement?.tier !== config.settType) {
    addFinding(
      findings,
      'tier_echo_mismatch',
      'tier',
      `${settlement?.tier || 'missing'} != ${config.settType}`,
    );
  }
  const range = POPULATION_RANGES[settlement?.tier];
  if (
    !range
    || !Number.isFinite(settlement?.population)
    || settlement.population < range.min
    || settlement.population > range.max
  ) {
    addFinding(
      findings,
      'population_out_of_range',
      'population',
      `${settlement?.population} for ${settlement?.tier}`,
    );
  }

  const institutions = settlement?.institutions || [];
  const duplicateInstitutions = duplicateValues(
    institutions
      .map(institution => normalizedIdentity(institution?.name))
      .filter(Boolean),
  );
  if (duplicateInstitutions.length) {
    addFinding(
      findings,
      'duplicate_institutions',
      'institutions',
      duplicateInstitutions.join(', '),
    );
  }

  const npcs = settlement?.npcs || [];
  const duplicateNpcIds = duplicateValues(
    npcs.map(npc => npc?.id).filter(Boolean),
  );
  const duplicateNpcNames = duplicateValues(
    npcs.map(npc => normalizedIdentity(npc?.name)).filter(Boolean),
  );
  if (duplicateNpcIds.length) {
    addFinding(findings, 'duplicate_npc_ids', 'npcs', duplicateNpcIds.join(', '));
  }
  if (duplicateNpcNames.length) {
    addFinding(findings, 'duplicate_npc_names', 'npcs', duplicateNpcNames.join(', '));
  }

  const npcById = new Map(npcs.map(npc => [npc?.id, npc]));
  for (const [index, relationship] of (
    settlement?.relationships || []
  ).entries()) {
    const first = npcById.get(relationship?.npc1Id);
    const second = npcById.get(relationship?.npc2Id);
    if (!first || !second) {
      addFinding(
        findings,
        'relationship_endpoint_missing',
        `relationships[${index}]`,
        `${relationship?.npc1Id || 'missing'} -> ${relationship?.npc2Id || 'missing'}`,
      );
      continue;
    }
    if (
      normalizedIdentity(first.name) !== normalizedIdentity(relationship.npc1Name)
      || normalizedIdentity(second.name) !== normalizedIdentity(relationship.npc2Name)
    ) {
      addFinding(
        findings,
        'relationship_endpoint_name_drift',
        `relationships[${index}]`,
        `${relationship?.npc1Name || 'missing'} -> ${relationship?.npc2Name || 'missing'}`,
      );
    }
  }

  const prominent = settlement?.prominentRelationship;
  if (prominent) {
    const npcNameSet = new Set(
      npcs.map(npc => normalizedIdentity(npc?.name)),
    );
    if (
      !npcNameSet.has(normalizedIdentity(prominent.npc1))
      || !npcNameSet.has(normalizedIdentity(prominent.npc2))
    ) {
      addFinding(
        findings,
        'prominent_relationship_endpoint_missing',
        'prominentRelationship',
        `${prominent.npc1 || 'missing'} -> ${prominent.npc2 || 'missing'}`,
      );
    }
  }

  const powerFactions = settlement?.powerStructure?.factions || [];
  const powerFactionNames = powerFactions
    .map(faction => faction?.faction)
    .filter(Boolean);
  if (duplicateValues(powerFactionNames).length) {
    addFinding(
      findings,
      'duplicate_power_factions',
      'powerStructure.factions',
      duplicateValues(powerFactionNames).join(', '),
    );
  }
  if (
    powerFactions.length
    && powerFactions.reduce(
      (sum, faction) => sum + (Number(faction?.power) || 0),
      0,
    ) !== 100
  ) {
    addFinding(
      findings,
      'faction_power_not_conserved',
      'powerStructure.factions',
      'Displayed power does not total 100.',
    );
  }

  const powerFactionSet = new Set(powerFactionNames);
  for (const npc of npcs) {
    if (
      npc?.factionAffiliation
      && !powerFactionSet.has(npc.factionAffiliation)
    ) {
      addFinding(
        findings,
        'npc_faction_missing',
        `npcs.${npc.id || 'unknown'}.factionAffiliation`,
        npc.factionAffiliation,
      );
    }
  }

  const narrativeFactions = settlement?.factions || [];
  const narrativeFactionNames = narrativeFactions
    .map(faction => faction?.name)
    .filter(Boolean);
  const narrativeFactionSet = new Set(narrativeFactionNames);
  for (const [index, faction] of narrativeFactions.entries()) {
    for (const member of faction?.members || []) {
      if (!npcById.has(member?.id)) {
        addFinding(
          findings,
          'faction_member_missing',
          `factions[${index}].members`,
          member?.id || 'missing',
        );
      }
    }
  }
  for (const [index, conflict] of (
    settlement?.conflicts || []
  ).entries()) {
    for (const party of conflict?.parties || []) {
      if (!narrativeFactionSet.has(party)) {
        addFinding(
          findings,
          'conflict_faction_missing',
          `conflicts[${index}].parties`,
          party,
        );
      }
    }
  }

  const events = settlement?.history?.historicalEvents || [];
  for (let index = 0; index < events.length; index += 1) {
    const yearsAgo = Number(events[index]?.yearsAgo);
    if (!Number.isFinite(yearsAgo) || yearsAgo < 0) {
      addFinding(
        findings,
        'history_date_invalid',
        `history.historicalEvents[${index}].yearsAgo`,
        String(events[index]?.yearsAgo),
      );
    }
    if (
      index > 0
      && Number(events[index - 1]?.yearsAgo) < yearsAgo
    ) {
      addFinding(
        findings,
        'history_order_invalid',
        'history.historicalEvents',
        'Events are not ordered oldest to newest.',
      );
      break;
    }
  }

  const incomeSources = settlement?.economicState?.incomeSources || [];
  if (
    incomeSources.length
    && incomeSources.reduce(
      (sum, source) => sum + (Number(source?.percentage) || 0),
      0,
    ) !== 100
  ) {
    addFinding(
      findings,
      'income_not_conserved',
      'economicState.incomeSources',
      'Income percentages do not total 100.',
    );
  }

  const viabilityEntries = [
    ...(settlement?.economicViability?.issues || []),
    ...(settlement?.economicViability?.warnings || []),
    ...(settlement?.economicViability?.dependencies || []),
  ];
  for (const [index, issue] of viabilityEntries.entries()) {
    if (
      issue?.category === 'Resource Access'
      && ['critical', 'implausible'].includes(issue?.severity)
    ) {
      addFinding(
        findings,
        'generated_resource_access_impossible',
        `economicViability[${index}]`,
        issue?.description || issue?.title || 'Unexplained resource-access failure.',
      );
    }
  }

  if (
    config.tradeRouteAccess === 'none'
    && /\bvia none\b/i.test(JSON.stringify(settlement))
  ) {
    addFinding(
      findings,
      'impossible_route_claim',
      'settlement',
      'A generated claim treats the `none` route token as an import channel.',
    );
  }

  inspectFiniteNumbers(settlement, 'settlement', findings);
  return findings;
}

function parsePositiveInteger(value, label) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
  return parsed;
}

function parseArgs(argv) {
  const result = {
    count: DEFAULT_COUNT,
    output: resolve('artifacts/generation/certification.json'),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--count') {
      result.count = parsePositiveInteger(argv[index + 1], '--count');
      index += 1;
    } else if (arg === '--output') {
      const output = argv[index + 1];
      if (!output) throw new Error('--output requires a path.');
      result.output = resolve(output);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

function emptyCoverage() {
  return Object.fromEntries(
    Object.entries(GENERATION_DIMENSIONS).map(([name]) => [name, new Set()]),
  );
}

function recordCoverage(coverage, config) {
  coverage.tiers.add(config.settType);
  coverage.cultures.add(config.culture);
  coverage.terrains.add(config.terrainOverride);
  coverage.routes.add(config.tradeRouteAccess);
  coverage.threats.add(config.monsterThreat);
  coverage.contentProfiles.add(config.contentProfile);
  coverage.magicScenarios.add(
    `${config.magicExists}:${config.priorityMagic}`,
  );
}

function expectedCoverageValues(name, values) {
  if (name !== 'magicScenarios') return values;
  return values.map(value => `${value.magicExists}:${value.priorityMagic}`);
}

function coverageGaps(coverage) {
  const gaps = {};
  for (const [name, values] of Object.entries(GENERATION_DIMENSIONS)) {
    const missing = expectedCoverageValues(name, values)
      .filter(value => !coverage[name].has(value));
    if (missing.length) gaps[name] = missing;
  }
  return gaps;
}

export async function runCertificationSoak({
  count,
  output,
}) {
  const startedAt = Date.now();
  const coverage = emptyCoverage();
  const receiptStatuses = {};
  const failureCounts = {};
  const examples = [];
  let replayChecks = 0;
  let replayMismatches = 0;
  let generationErrors = 0;

  for (let index = 0; index < count; index += 1) {
    const config = configForIndex(index);
    const seed = `generation-certification-${index}`;
    recordCoverage(coverage, config);

    try {
      const settlement = generateSettlementPipeline(
        config,
        null,
        { seed, customContent: {} },
      );
      const status = settlement?.generationCoherenceReceipt?.status || 'missing';
      receiptStatuses[status] = (receiptStatuses[status] || 0) + 1;

      const findings = inspectSettlement(settlement, config);
      for (const item of findings) {
        failureCounts[item.code] = (failureCounts[item.code] || 0) + 1;
        if (examples.length < MAX_EXAMPLES) {
          examples.push({
            index,
            seed,
            config,
            ...item,
          });
        }
      }

      if (index % 100 === 0) {
        const replay = generateSettlementPipeline(
          config,
          null,
          { seed, customContent: {} },
        );
        replayChecks += 1;
        if (JSON.stringify(settlement) !== JSON.stringify(replay)) {
          replayMismatches += 1;
          if (examples.length < MAX_EXAMPLES) {
            examples.push({
              index,
              seed,
              config,
              code: 'replay_mismatch',
              path: 'settlement',
              detail: 'The same config and seed produced different bytes.',
            });
          }
        }
      }
    } catch (error) {
      generationErrors += 1;
      if (examples.length < MAX_EXAMPLES) {
        examples.push({
          index,
          seed,
          config,
          code: 'generation_error',
          path: 'generateSettlementPipeline',
          detail: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  const gaps = coverageGaps(coverage);
  const report = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count,
    durationMs: Date.now() - startedAt,
    passed: (
      generationErrors === 0
      && replayMismatches === 0
      && Object.keys(failureCounts).length === 0
      && Object.keys(gaps).length === 0
    ),
    generationErrors,
    replay: {
      checked: replayChecks,
      mismatches: replayMismatches,
    },
    receiptStatuses,
    failureCounts,
    coverage: Object.fromEntries(
      Object.entries(coverage).map(([name, values]) => [
        name,
        [...values].sort(),
      ]),
    ),
    coverageGaps: gaps,
    examples,
  };

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = await runCertificationSoak(options);
  const outcome = report.passed ? 'PASS' : 'FAIL';
  console.log(
    `[generation-certification] ${outcome}: ${report.count} settlements, `
    + `${report.generationErrors} generation errors, `
    + `${Object.values(report.failureCounts).reduce((sum, count) => sum + count, 0)} findings, `
    + `${report.replay.mismatches}/${report.replay.checked} replay mismatches.`,
  );
  console.log(`[generation-certification] Evidence: ${options.output}`);
  if (!report.passed) process.exitCode = 1;
}

const isEntrypoint = (
  process.argv[1]
  && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
);
if (isEntrypoint) {
  main().catch((error) => {
    console.error('[generation-certification] Fatal:', error);
    process.exitCode = 1;
  });
}
