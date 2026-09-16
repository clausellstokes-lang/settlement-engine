/**
 * Cold persisted-world admission.
 *
 * This module is dynamically reached by cache/cloud campaign loading and is
 * statically reached only from already-lazy command code. Keeping the strict
 * envoy DTO family here prevents its negotiation/peace-term closure from riding
 * first paint while every raw world still crosses the full validator once.
 */
import { normalizeEnvoyErrands } from './envoyErrandRecords.js';
import { ensureWorldStateWithEnvoyNormalizer } from './worldState.js';

export function hydratePersistedWorldState(rawInput = {}, campaign = {}) {
  return ensureWorldStateWithEnvoyNormalizer(
    rawInput,
    campaign,
    normalizeEnvoyErrands,
  );
}
