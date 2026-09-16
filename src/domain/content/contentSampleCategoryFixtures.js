/**
 * Category-aware fixtures for the custom-content sample taste gate.
 *
 * Generation-backed content is exercised at the inclusive lower and upper
 * edges of its authored tier range. Living-world content takes the narrowest
 * canonical path that can truthfully demonstrate it:
 *
 * - deities are assigned through SET_PRIMARY_DEITY;
 * - factions enter through ADD_FACTION;
 * - stressors begin through APPLY_STRESSOR;
 * - traditions use the deterministic custom-founding observance adapter.
 *
 * Every path is pure. Events receive no timestamp, no store is imported, and
 * the returned receipts explicitly distinguish field truth from the temporary
 * fixture action. In particular, a stressor's presentation-only severity label
 * is never converted into invented physics: the event uses its canonical 0.6
 * default and says so.
 */

import { TIER_ORDER } from '../../data/constants.js';
import { applyEvent } from '../events/applyEvent.js';
import { adaptCustomTradition } from '../traditions/customFounding.js';
import { deitySnapshotFrom } from '../deitySnapshot.js';
import { mintDeityRef } from '../../lib/customRegistry.js';
import { classifyCustomContentField } from './customContentManifest.js';

const GENERATION_BUCKETS = new Set(['institutions', 'resources', 'services']);
const EVENT_BUCKETS = new Set(['deities', 'factions', 'stressors']);
const SYSTEM_FIELDS = new Set([
  'id',
  'localUid',
  'isCustom',
  'source',
  'createdAt',
  'updatedAt',
  'version',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string|null} */
function tierName(value) {
  const normalized = String(value || '').toLowerCase();
  return TIER_ORDER.includes(normalized) ? normalized : null;
}

/** @param {Record<string, unknown>} entry */
function lowerTier(entry) {
  return tierName(entry.tierMin) || TIER_ORDER[0];
}

/** @param {Record<string, unknown>} entry */
function upperTier(entry) {
  return tierName(entry.tierMax) || TIER_ORDER[TIER_ORDER.length - 1];
}

/**
 * The manifest remains the single source of truth for every authored field.
 * The fixture adds activation context; it does not reclassify those fields.
 *
 * @param {string} bucket
 * @param {Record<string, unknown>} entry
 */
function fieldTruth(bucket, entry) {
  /** @type {Array<{field:string, displayKind:string, when?:string}>} */
  const mechanical = [];
  /** @type {string[]} */
  const presentationOnly = [];
  /** @type {Array<{field:string, reason:string}>} */
  const unsupported = [];

  for (const [field, value] of Object.entries(entry)) {
    if (SYSTEM_FIELDS.has(field) || value === undefined) continue;
    const label = classifyCustomContentField(bucket, field, value);
    if (label.displayKind === 'mechanical' || label.displayKind === 'conditional') {
      mechanical.push({
        field,
        displayKind: label.displayKind,
        ...(label.activation?.when ? { when: label.activation.when } : {}),
      });
    } else if (label.displayKind === 'presentation') {
      presentationOnly.push(field);
    } else {
      unsupported.push({
        field,
        reason: label.reason || 'unregistered_field',
      });
    }
  }

  return { mechanical, presentationOnly, unsupported };
}

/**
 * Normalize accepted compiler output without mutating it.
 *
 * @param {unknown} accepted
 * @returns {Array<{
 *   bucket:string,
 *   entry:Record<string, unknown>,
 *   localUid:string,
 *   name:string,
 * }>}
 */
function acceptedDefinitions(accepted) {
  return (Array.isArray(accepted) ? accepted : [])
    .map((candidate, index) => {
      const record = plainRecord(candidate);
      const bucket = typeof record.bucket === 'string' ? record.bucket : '';
      const entry = plainRecord(record.entry);
      if (!bucket || typeof entry.name !== 'string' || !entry.name.trim()) {
        return null;
      }
      return {
        bucket,
        entry,
        localUid: String(entry.localUid || entry.id || `preview_${bucket}_${index}`),
        name: entry.name.trim(),
      };
    })
    .filter(candidate => candidate !== null);
}

/**
 * Project the complete ephemeral content snapshot into the same bounded
 * identity shape used by accepted definitions. Attribution must consider
 * pre-existing same-name definitions as well as the reviewed candidates.
 *
 * @param {unknown} snapshot
 * @returns {ReturnType<typeof acceptedDefinitions>}
 */
export function contentSampleDefinitionsFromSnapshot(snapshot) {
  const source = plainRecord(snapshot);
  return acceptedDefinitions(
    Object.entries(source).flatMap(([bucket, definitions]) => (
      Array.isArray(definitions)
        ? definitions.map(entry => ({ bucket, entry }))
        : []
    )),
  );
}

/**
 * Definitions sharing a category and boundary tier share one same-seed bundle
 * fixture. The six-tier vocabulary therefore caps this at six fixtures per
 * category (eighteen total), even when a reviewed pack contains many entries
 * with different lower and upper bounds.
 *
 * @param {ReturnType<typeof acceptedDefinitions>} definitions
 */
function generationPlans(definitions) {
  /** @type {Map<string, {
   *   bucket:string,
   *   tier:string,
   *   boundaries:Set<string>,
   *   definitions:Array<NonNullable<ReturnType<typeof acceptedDefinitions>[number]>>,
   * }>} */
  const plans = new Map();

  for (const definition of definitions) {
    if (!definition || !GENERATION_BUCKETS.has(definition.bucket)) continue;
    const boundaries = [
      { kind: 'minimum', tier: lowerTier(definition.entry) },
      { kind: 'maximum', tier: upperTier(definition.entry) },
    ];
    for (const boundary of boundaries) {
      const key = `${definition.bucket}:${boundary.tier}`;
      let plan = plans.get(key);
      if (!plan) {
        plan = {
          bucket: definition.bucket,
          tier: boundary.tier,
          boundaries: new Set(),
          definitions: [],
        };
        plans.set(key, plan);
      }
      plan.boundaries.add(boundary.kind);
      if (!plan.definitions.some(item => item.localUid === definition.localUid)) {
        plan.definitions.push(definition);
      }
    }
  }

  return [...plans.values()].sort((left, right) => {
    const bucketOrder = [...GENERATION_BUCKETS];
    const bucketDelta = bucketOrder.indexOf(left.bucket)
      - bucketOrder.indexOf(right.bucket);
    return bucketDelta || TIER_ORDER.indexOf(left.tier) - TIER_ORDER.indexOf(right.tier);
  });
}

/**
 * Decide whether one reviewed definition can be attributed to a projected
 * materialized entity without inventing identity.
 *
 * Exact localUid wins whenever the output surface retains it. Name-only
 * surfaces (currently resources and some legacy services) are acceptable only
 * when exactly one reviewed definition in that category owns the display name.
 * This deliberately reports duplicate name-only projections as ambiguous
 * rather than claiming that one visible entity proves every same-name draft.
 *
 * @param {{bucket?:string, localUid?:string, name?:string}|null|undefined}
 *   definition
 * @param {unknown[]} entities
 * @param {Array<{
 *   bucket?:string,
 *   localUid?:string,
 *   name?:string,
 * }|null|undefined>} peers
 * @returns {{
 *   state:'materialized'|'absent'|'ambiguous',
 *   materialized:boolean,
 * }}
 */
export function contentSampleDefinitionMaterialization(
  definition,
  entities,
  peers,
) {
  if (!definition) return { state: 'absent', materialized: false };
  const bucket = String(definition.bucket || '');
  const localUid = String(definition.localUid || '');
  const name = String(definition.name || '');
  const namedEntities = (Array.isArray(entities) ? entities : [])
    .map(plainRecord)
    .filter(entity => String(entity.name || '') === name);

  if (localUid) {
    if (namedEntities.some(entity => (
      String(entity.localUid || '') === localUid
    ))) return { state: 'materialized', materialized: true };
    // A different exact identity on the same displayed entity is affirmative
    // evidence that this definition did not materialize.
    if (namedEntities.some(entity => String(entity.localUid || ''))) {
      return { state: 'absent', materialized: false };
    }
  }

  const sameNameDefinitions = peers.filter(peer => (
    peer
    && String(peer.bucket || '') === bucket
    && String(peer.name || '') === name
  ));
  if (namedEntities.length === 0) {
    return { state: 'absent', materialized: false };
  }
  if (sameNameDefinitions.length !== 1) {
    return { state: 'ambiguous', materialized: false };
  }
  return { state: 'materialized', materialized: true };
}

/**
 * @param {unknown} settlement
 * @param {string} name
 */
function factionNamed(settlement, name) {
  const root = plainRecord(settlement);
  const powerStructure = plainRecord(root.powerStructure);
  const factions = [
    ...(Array.isArray(powerStructure.factions) ? powerStructure.factions : []),
    ...(Array.isArray(root.factions) ? root.factions : []),
  ];
  return factions
    .map(plainRecord)
    .find(faction => String(faction.faction || faction.name || '') === name) || null;
}

/** @param {unknown} settlement @param {string} name */
function stressorNamed(settlement, name) {
  const root = plainRecord(settlement);
  const raw = root.stressors ?? root.stress ?? root.stresses;
  const stressors = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return stressors
    .map(plainRecord)
    .find(stressor => String(stressor.name || stressor.label || '') === name) || null;
}

/**
 * Apply one event through the canonical pure event pipeline. No timestamp is
 * supplied, so its receipt remains deterministic and cannot imply persistence.
 *
 * @param {unknown} settlement
 * @param {Record<string, unknown>} event
 */
function applyFixtureEvent(settlement, event) {
  const outcome = applyEvent(
    /** @type {Parameters<typeof applyEvent>[0]} */ (
      /** @type {unknown} */ ({
        settlement: plainRecord(settlement),
        systemState: null,
        event,
        now: null,
      })
    ),
  );
  return {
    settlement: outcome.nextSettlement,
    eventReceipt: {
      type: String(event.type || ''),
      targetId: String(event.targetId || ''),
      appliedAt: outcome.logEntry.appliedAt,
      deltas: outcome.logEntry.deltas,
      causalStateDeltas: outcome.logEntry.causalStateDeltas,
      veto: outcome.veto
        ? { code: outcome.veto.code, detail: outcome.veto.detail }
        : null,
    },
  };
}

/**
 * @param {NonNullable<ReturnType<typeof acceptedDefinitions>[number]>} definition
 * @param {unknown} settlement
 * @param {string} seed
 */
function deityFixture(definition, settlement, seed) {
  const deityRef = mintDeityRef(definition.entry)
    || `deity:${definition.localUid}`;
  const event = {
    id: `preview.deity.${definition.localUid}`,
    type: 'SET_PRIMARY_DEITY',
    targetId: deityRef,
    payload: {
      deityRef,
      snapshot: deitySnapshotFrom(definition.entry),
    },
  };
  const applied = applyFixtureEvent(settlement, event);
  const config = plainRecord(plainRecord(applied.settlement).config);
  return {
    id: `deities:${definition.localUid}`,
    kind: 'deity-assignment',
    bucket: 'deities',
    name: definition.name,
    seed,
    saved: false,
    event: applied.eventReceipt,
    result: {
      assigned: config.primaryDeityRef === deityRef,
      deityRef,
      snapshot: config.primaryDeitySnapshot || null,
    },
    receipt: {
      activation: 'temporary-assignment',
      fieldTruth: fieldTruth('deities', definition.entry),
      note: 'Assigned only to this unsaved settlement through SET_PRIMARY_DEITY.',
    },
  };
}

/**
 * @param {NonNullable<ReturnType<typeof acceptedDefinitions>[number]>} definition
 * @param {unknown} settlement
 * @param {string} seed
 */
function factionFixture(definition, settlement, seed) {
  const event = {
    id: `preview.faction.${definition.localUid}`,
    type: 'ADD_FACTION',
    targetId: definition.name,
    description: String(definition.entry.description || ''),
    payload: { name: definition.name },
  };
  const applied = applyFixtureEvent(settlement, event);
  return {
    id: `factions:${definition.localUid}`,
    kind: 'faction-event',
    bucket: 'factions',
    name: definition.name,
    seed,
    saved: false,
    event: applied.eventReceipt,
    result: {
      present: Boolean(factionNamed(applied.settlement, definition.name)),
      faction: factionNamed(applied.settlement, definition.name),
    },
    receipt: {
      activation: 'unsaved-event',
      fieldTruth: fieldTruth('factions', definition.entry),
      appliedFields: ['name', 'description'].filter(field => definition.entry[field] != null),
      note: 'Introduced only in this fixture through ADD_FACTION. Other authored faction fields remain Compendium presentation metadata.',
    },
  };
}

/**
 * @param {NonNullable<ReturnType<typeof acceptedDefinitions>[number]>} definition
 * @param {unknown} settlement
 * @param {string} seed
 */
function stressorFixture(definition, settlement, seed) {
  const event = {
    id: `preview.stressor.${definition.localUid}`,
    type: 'APPLY_STRESSOR',
    targetId: definition.name,
    description: String(definition.entry.description || ''),
    payload: {
      stressorType: definition.name,
      label: definition.name,
      isCustom: true,
    },
  };
  const applied = applyFixtureEvent(settlement, event);
  const stressor = stressorNamed(applied.settlement, definition.name);
  return {
    id: `stressors:${definition.localUid}`,
    kind: 'stressor-event',
    bucket: 'stressors',
    name: definition.name,
    seed,
    saved: false,
    event: applied.eventReceipt,
    result: {
      active: Boolean(stressor),
      stressor,
      fixtureSeverity: typeof stressor?.severity === 'number'
        ? stressor.severity
        : null,
    },
    receipt: {
      activation: 'unsaved-event',
      fieldTruth: fieldTruth('stressors', definition.entry),
      appliedFields: ['name', 'description'].filter(field => definition.entry[field] != null),
      assumption: 'The canonical event default severity (0.6) is used. The authored severity label, affected systems, and disablement relationships are not converted into simulation rules.',
    },
  };
}

/**
 * @param {NonNullable<ReturnType<typeof acceptedDefinitions>[number]>} definition
 * @param {string} seed
 */
function traditionFixture(definition, seed) {
  const observance = adaptCustomTradition({
    ...definition.entry,
    id: String(definition.entry.id || definition.localUid),
  });
  return {
    id: `traditions:${definition.localUid}`,
    kind: 'tradition-observance',
    bucket: 'traditions',
    name: definition.name,
    seed,
    saved: false,
    event: null,
    result: { observance },
    receipt: {
      activation: 'presentation-only',
      fieldTruth: fieldTruth('traditions', definition.entry),
      note: 'This is the deterministic custom-founding dossier observance. It does not run the campaign traditions mover or claim tick-time effects.',
    },
  };
}

/**
 * Forge bounded category-aware fixtures.
 *
 * @param {{
 *   seed:string,
 *   config:Record<string, unknown>,
 *   baselineContent:Record<string, Array<Record<string, unknown>>>,
 *   snapshot:Record<string, Array<Record<string, unknown>>>,
 *   accepted:unknown,
 *   eventSettlement:unknown,
 *   generateSettlement:Function,
 *   projectSettlement:(settlement:unknown) => unknown,
 *   compareProjections:(before:unknown, after:unknown) => unknown,
 * }} args
 */
export function forgeContentSampleCategoryFixtures(args) {
  const definitions = acceptedDefinitions(args.accepted);
  const attributionDefinitions = contentSampleDefinitionsFromSnapshot(
    args.snapshot,
  );
  /** @type {Array<Record<string, unknown>>} */
  const fixtures = [];

  for (const plan of generationPlans(definitions)) {
    const fixtureSeed = `${args.seed}::${plan.bucket}:${plan.tier}`;
    const fixtureConfig = { ...args.config, settType: plan.tier };
    const baselineSettlement = args.generateSettlement(
      { ...fixtureConfig },
      null,
      { seed: fixtureSeed, customContent: args.baselineContent },
    );
    const candidateSettlement = args.generateSettlement(
      { ...fixtureConfig },
      null,
      { seed: fixtureSeed, customContent: args.snapshot },
    );
    const before = args.projectSettlement(baselineSettlement);
    const after = args.projectSettlement(candidateSettlement);
    const diff = args.compareProjections(before, after);
    // Presence attribution is a fact about the candidate projection, not the
    // before/after delta. An edited definition with the same stable identity
    // may already exist in the baseline and therefore never appear in
    // `diff.materialized`, yet it is still present in the fixture settlement.
    const bucketMaterialized = plainRecord(after)[plan.bucket];
    const materialized = Array.isArray(bucketMaterialized)
      ? bucketMaterialized
      : [];

    fixtures.push({
      id: `${plan.bucket}:${plan.tier}`,
      kind: 'generation-boundary',
      bucket: plan.bucket,
      tier: plan.tier,
      boundaries: [...plan.boundaries],
      names: plan.definitions.map(definition => definition?.name || '').filter(Boolean),
      seed: fixtureSeed,
      saved: false,
      config: fixtureConfig,
      baseline: before,
      candidate: after,
      diff,
      receipt: {
        activation: 'canonical-generation',
        forcedInEphemeralSnapshot: true,
        definitions: plan.definitions.map((definition) => {
          const materialization = contentSampleDefinitionMaterialization(
            definition,
            materialized,
            attributionDefinitions,
          );
          return {
            localUid: definition?.localUid || '',
            name: definition?.name || '',
            materialized: materialization.materialized,
            materializationState: materialization.state,
            fieldTruth: fieldTruth(plan.bucket, definition?.entry || {}),
          };
        }),
        note: 'The reviewed bundle is generated at this authored tier boundary. Same seed and config are used before and after; only the ephemeral content snapshot differs.',
      },
    });
  }

  for (const definition of definitions) {
    if (!definition) continue;
    const fixtureSeed = `${args.seed}::${definition.bucket}:${definition.localUid}`;
    if (EVENT_BUCKETS.has(definition.bucket)) {
      if (definition.bucket === 'deities') {
        fixtures.push(deityFixture(definition, args.eventSettlement, fixtureSeed));
      } else if (definition.bucket === 'factions') {
        fixtures.push(factionFixture(definition, args.eventSettlement, fixtureSeed));
      } else {
        fixtures.push(stressorFixture(definition, args.eventSettlement, fixtureSeed));
      }
    } else if (definition.bucket === 'traditions') {
      fixtures.push(traditionFixture(definition, fixtureSeed));
    }
  }

  return fixtures;
}
