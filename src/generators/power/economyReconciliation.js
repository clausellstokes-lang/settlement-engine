/**
 * Final economy -> power reconciliation.
 *
 * Power has to exist before factionCorrelationPass because faction pressure can
 * pull one institution onto the roster. That pull can change the economy, so
 * the first power structure is necessarily provisional. This module closes the
 * loop once, after the final economy exists, without reopening the
 * faction -> institution edge:
 *
 *   1. Capture the original power inputs in a detached, immutable intent.
 *   2. Replay the exact named power RNG stream against the final economy.
 *   3. Assert that replay did not invent or discard generated faction identities.
 *   4. Preserve neighbour-faction rolls, then re-normalize the combined roster.
 *   5. Stamp the exact economy-input fingerprint the projection consumed.
 *
 * The same seam is reused when assembly replaces the provisional defense label
 * with the real defense profile. Reconciliation is therefore bounded and
 * idempotent: no institution writer runs again and no new random intent is
 * created.
 */

import { deepClone } from '../../domain/clone.js';
import { deriveFactionProfile } from '../../domain/factionProfile.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { createPRNG } from '../../kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../kernel/rngContext.js';
import {
  generatePowerStructure,
  renormalizeFactionPower,
} from './rulingStructure.js';

const POWER_INTENT_VERSION = 1;
const POWER_PROJECTION_VERSION = 1;
const ECONOMY_FINGERPRINT_VERSION = 'power-economy-v1';
const POWER_STREAM = 'power-structure';
const NEIGHBOUR_SOURCES = new Set([
  'neighbour_mirror',
  'neighbour_opposition',
]);
const TRANSIENT_PROJECTION_FIELDS = [
  'legitimacyCrisis',
  'crisisNote',
  'captureState',
];

function deepFreeze(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function normalizedFactionName(faction) {
  const name = String(faction?.faction || faction?.name || '')
    .trim()
    .toLowerCase();
  // Prosperity projects merchant dominance as a display suffix. It is a state
  // label, not a different organization, so both forms share one intent key.
  return name.replace(/\s+\(dominant\)$/, '');
}

function factionIntentKey(faction) {
  if (faction?.isGoverning === true) return 'governing-seat';
  return [
    String(faction?.category || 'other').toLowerCase(),
    normalizedFactionName(faction),
  ].join('::');
}

function isNeighbourFaction(faction) {
  return NEIGHBOUR_SOURCES.has(faction?.source);
}

function powerLabelFor(power) {
  return power >= 35 ? 'Dominant'
    : power >= 25 ? 'Strong'
      : power >= 18 ? 'Significant'
        : power >= 10 ? 'Minor'
          : 'Suppressed';
}

function economyProjectionInput(economicState, tier) {
  return {
    tier: String(tier || ''),
    prosperity: economicState?.prosperity || 'Moderate',
    safetyLabel: economicState?.safetyProfile?.safetyLabel || 'Moderate',
    foodLabel: economicState?.foodSecurity?.label || 'Secure',
  };
}

/**
 * Versioned, draw-free fingerprint of every economic field the power projector
 * reads. FNV-1a is appropriate here because this is an internal freshness
 * assertion, not a security boundary; the explicit tuple order avoids object-key
 * ordering ambiguity.
 */
export function fingerprintPowerEconomyInput(economicState, tier) {
  const input = economyProjectionInput(economicState, tier);
  const serialized = JSON.stringify([
    ECONOMY_FINGERPRINT_VERSION,
    input.tier,
    input.prosperity,
    input.safetyLabel,
    input.foodLabel,
  ]);
  const digest = fnv1a32(serialized).toString(16).padStart(8, '0');
  return `${ECONOMY_FINGERPRINT_VERSION}:${digest}`;
}

/**
 * Capture the exact inputs and RNG stream used to establish political intent.
 * The snapshot is transient pipeline state; it is deliberately not persisted
 * on the settlement.
 */
export function createPowerGenerationIntent({
  stepRng,
  tier,
  tradeRoute,
  config,
  institutions,
}) {
  if (!stepRng || typeof stepRng.fork !== 'function') {
    throw new TypeError(
      'Power generation intent requires the generatePower step RNG.',
    );
  }
  const snapshot = deepClone({
    version: POWER_INTENT_VERSION,
    rngSeed: stepRng.fork(POWER_STREAM).seed,
    tier,
    tradeRoute: tradeRoute || null,
    config: config || {},
    institutions: institutions || [],
  });
  return deepFreeze(snapshot);
}

function assertIntent(intent) {
  if (!intent || intent.version !== POWER_INTENT_VERSION) {
    throw new Error(
      'Power reconciliation requires a current power-generation intent.',
    );
  }
}

/**
 * Replay the original power calculation without consuming the active pipeline
 * step's stream. The named seed reproduces every power-local roll even if later
 * code adds draws elsewhere in generatePower.
 */
export function projectPowerGenerationIntent(
  intent,
  economicState,
  { defenseLabel = null } = {},
) {
  assertIntent(intent);
  const previousRng = setActiveRng(createPRNG(intent.rngSeed));
  try {
    const powerStructure = generatePowerStructure(
      intent.tier,
      economicState,
      intent.tradeRoute,
      intent.config,
      intent.institutions,
      defenseLabel ? { defenseLabel } : {},
    );
    powerStructure.powerProjectionVersion = POWER_PROJECTION_VERSION;
    powerStructure.economyInputFingerprint = fingerprintPowerEconomyInput(
      economicState,
      intent.tier,
    );
    return powerStructure;
  } finally {
    clearActiveRng(previousRng);
  }
}

function factionKeyCounts(factions) {
  const counts = new Map();
  for (const faction of factions) {
    const key = factionIntentKey(faction);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
}

function assertStableGeneratedRoster(currentFactions, projectedFactions) {
  const current = factionKeyCounts(currentFactions);
  const projected = factionKeyCounts(projectedFactions);
  if (JSON.stringify(current) !== JSON.stringify(projected)) {
    throw new Error(
      'Power intent replay changed the generated faction identity roster. '
      + 'Only economy-dependent projections may change during finalization.',
    );
  }
}

function queueByFactionKey(factions) {
  const queues = new Map();
  for (const faction of factions) {
    const key = factionIntentKey(faction);
    const queue = queues.get(key) || [];
    queue.push(faction);
    queues.set(key, queue);
  }
  return queues;
}

/**
 * Merge a fresh economy/defense projection into the live power structure.
 * Generated factions come from replay; neighbour factions retain their names,
 * prose, sources, and raw random weights.
 *
 * @returns {{ beforeFactions: Array<any>, afterFactions: Array<any> }}
 */
export function reconcilePowerStructure(
  powerStructure,
  economicState,
  intent,
  options = {},
) {
  assertIntent(intent);
  if (!powerStructure || !Array.isArray(powerStructure.factions)) {
    throw new Error('Power reconciliation requires an existing faction roster.');
  }

  const beforeFactions = powerStructure.factions.map(faction => ({ ...faction }));
  const generatedFactions = powerStructure.factions.filter(
    faction => !isNeighbourFaction(faction),
  );
  const neighbourFactions = powerStructure.factions.filter(isNeighbourFaction);
  const projected = projectPowerGenerationIntent(
    intent,
    economicState,
    options,
  );

  assertStableGeneratedRoster(generatedFactions, projected.factions);
  const currentByKey = queueByFactionKey(generatedFactions);
  const reconciledGenerated = projected.factions.map((projection) => {
    const current = currentByKey.get(factionIntentKey(projection))?.shift();
    const merged = { ...current, ...projection };
    for (const field of TRANSIENT_PROJECTION_FIELDS) {
      if (!(field in projection)) delete merged[field];
    }
    return merged;
  });

  // Neighbour factions were rolled after the original legitimacy pass. Restore
  // their retained raw draw beside the newly projected base roster, then repeat
  // the same largest-remainder normalization as neighbourFactions.
  const reconciledNeighbours = neighbourFactions.map((faction) => ({
    ...faction,
    power: Number.isFinite(faction.rawPower)
      ? faction.rawPower
      : faction.power,
  }));
  const combinedFactions = [
    ...reconciledGenerated,
    ...reconciledNeighbours,
  ];
  if (reconciledNeighbours.length) {
    renormalizeFactionPower(combinedFactions);
    for (const faction of combinedFactions) {
      faction.powerLabel = powerLabelFor(faction.power);
    }
    combinedFactions.sort((left, right) => (
      (right.power || 0) - (left.power || 0)
    ));
  }

  powerStructure.factions = combinedFactions;
  powerStructure.governingName = projected.governingName;
  powerStructure.government = projected.government;
  powerStructure.publicLegitimacy = projected.publicLegitimacy;
  powerStructure.factionRelationships = projected.factionRelationships;
  powerStructure.criminalCaptureState = projected.criminalCaptureState;
  powerStructure.powerProjectionVersion = projected.powerProjectionVersion;
  powerStructure.economyInputFingerprint =
    projected.economyInputFingerprint;

  return {
    beforeFactions,
    afterFactions: powerStructure.factions,
  };
}

/**
 * Keep the original generatePower receipts aligned with the final projection.
 * This mutates existing trace entries instead of emitting duplicate faction
 * identities later in the pipeline.
 */
export function refreshPowerGenerationTraces(
  traceCarrier,
  beforeFactions,
  powerStructure,
  intent,
) {
  const traces = (traceCarrier?.simulationTrace || []).filter(
    trace => trace.step === 'generatePower',
  );
  if (!traces.length) return;

  const beforeByKey = queueByFactionKey(
    (beforeFactions || []).filter(faction => !isNeighbourFaction(faction)),
  );
  const usedTraces = new Set();
  for (const faction of powerStructure.factions.filter(
    item => !isNeighbourFaction(item),
  )) {
    const previousFaction = beforeByKey.get(factionIntentKey(faction))?.shift();
    if (!previousFaction) continue;
    const previousId = deriveFactionProfile(previousFaction, {
      powerStructure,
    })?.id;
    const trace = traces.find(
      candidate => !usedTraces.has(candidate)
        && candidate.targetId === previousId,
    );
    if (!trace) continue;
    usedTraces.add(trace);

    const profile = deriveFactionProfile(faction, { powerStructure });
    if (!profile) continue;
    trace.targetId = profile.id;

    const tierCause = trace.causes?.find(
      cause => cause.source === `tier.${intent.tier}`,
    );
    if (tierCause) tierCause.effect = `power ${profile.power}`;

    if (faction.isGoverning === true) {
      const legitimacyCause = trace.causes?.find(
        cause => cause.source === 'governingFaction',
      );
      if (legitimacyCause) {
        legitimacyCause.reason =
          `As the governing faction, ${profile.name} inherits the settlement's `
          + `public-legitimacy score (${profile.legitimacy}).`;
      }
    }
  }
}

/**
 * Fail closed if any later step mutates the economic facts after power was
 * projected. The persisted fingerprint is evidence, not a best-effort note.
 */
export function assertPowerEconomyFreshness(
  powerStructure,
  economicState,
  tier,
) {
  const expected = fingerprintPowerEconomyInput(economicState, tier);
  const received = powerStructure?.economyInputFingerprint;
  if (received !== expected) {
    throw new Error(
      'Power/economy freshness invariant failed: the final power structure '
      + `consumed ${received || 'no economy fingerprint'}, expected ${expected}.`,
    );
  }
  return true;
}
