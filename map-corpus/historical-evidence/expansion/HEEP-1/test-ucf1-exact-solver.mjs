#!/usr/bin/env node

import assert from 'node:assert/strict';
import crypto from 'node:crypto';

import {
  LEGAL_PREFIXES,
  buildReplacementQueues,
  chooseReplacementFromSealedQueue,
  replacementSwapPasses,
  solveExactNestedFrame,
  validatePrefix,
  verifyUnsatCertificate,
} from './select-ucf1-frame.mjs';

const SEED = 'UCF1-PUBLIC-SYNTHETIC-EXACT-SOLVER-FIXTURE';
const MACROS = [
  'ATLANTIC_ARCHIPELAGO',
  'NORDIC_BALTIC',
  'WESTERN_CONTINENTAL',
  'CENTRAL_EASTERN_SOUTHEASTERN',
  'SOUTHERN_MEDITERRANEAN',
];
const PHASES = ['PRE_1200', '1200_1399', '1400_1599', '1600_1799', '1800_PLUS'];
const SCALES = ['SMALL_LOCAL', 'INTERMEDIATE_REGIONAL', 'MAJOR_METROPOLITAN'];
const CONTEXTS = [
  'COASTAL_ESTUARINE',
  'RIVER_CROSSING',
  'WETLAND_ENGINEERED_WATER',
  'UPLAND_CONSTRAINED',
  'OTHER_INLAND',
];

const tieHash = (stableTownId) => crypto.createHash('sha256').update(`${SEED}|${stableTownId}`).digest('hex');

function syntheticCandidates() {
  const stableTownIds = Array.from({ length: 240 }, (_, index) => `SYNTHETIC_UNIT_${String(index).padStart(3, '0')}`)
    .sort((left, right) => tieHash(left).localeCompare(tieHash(right)) || left.localeCompare(right));
  const baseFeatures = Array.from({ length: 120 }, (_, index) => ({
    macroRegion: MACROS[index % MACROS.length],
    countryCode: `SYNTHETIC_COUNTRY_${String(index % 10).padStart(2, '0')}`,
    primaryProgramId: `SYNTHETIC_PROGRAM_${String((index * 3) % 10).padStart(2, '0')}`,
    indexPhase: PHASES[index % PHASES.length],
    scaleFunction: { band: SCALES[index % SCALES.length] },
    physicalContext: { tags: [CONTEXTS[index % CONTEXTS.length]] },
    priorExposure: index < 13 ? 'PRIOR_SEEN' : 'NOT_PRIOR_SEEN',
  }));
  return stableTownIds.map((stableTownId, index) => ({
    stableTownId,
    ...structuredClone(baseFeatures[index % baseFeatures.length]),
  }));
}

const candidates = syntheticCandidates();
const first = solveExactNestedFrame(candidates, SEED);
assert.equal(first.status, 'SAT');
assert.equal(first.selected.length, 120);
assert.equal(first.replacementPlan.pass, true);
assert.equal(first.replacementPlan.aggregate.slotsWithInitiallyLegalReplacement, 120);
assert.ok(Number(first.search.skipBranches) > 0, 'fixture must exercise a deterministic skip branch');
for (const prefix of LEGAL_PREFIXES) assert.equal(validatePrefix(first.selected.slice(0, prefix), prefix).pass, true);
const firstNonPriorSlot = first.selected.findIndex((candidate, index) => index < 80 && candidate.priorExposure !== 'PRIOR_SEEN');
const capBreakingReplacement = {
  ...structuredClone(first.selected[firstNonPriorSlot]),
  stableTownId: 'SYNTHETIC_CAP_BREAKING_REPLACEMENT',
  priorExposure: 'PRIOR_SEEN',
};
assert.equal(replacementSwapPasses(first.selected, firstNonPriorSlot, capBreakingReplacement), false);

const rebuiltQueues = buildReplacementQueues(first.selected, candidates, first.tieHashes);
assert.deepEqual(rebuiltQueues.queueBySlot, first.replacementPlan.queueBySlot);
for (const [slotKey, queue] of Object.entries(first.replacementPlan.queueBySlot)) {
  const slotIndex = Number(slotKey.slice('SLOT_'.length)) - 1;
  assert.ok(queue.length > 0);
  const byId = new Map(candidates.map((candidate) => [candidate.stableTownId, candidate]));
  for (const stableTownId of queue) assert.equal(replacementSwapPasses(first.selected, slotIndex, byId.get(stableTownId)), true);
  assert.equal(
    chooseReplacementFromSealedQueue(first.selected, slotIndex, queue, byId)?.stableTownId,
    queue[0],
  );
  assert.equal(
    chooseReplacementFromSealedQueue(first.selected, slotIndex, queue, byId, new Set(queue)),
    null,
    'an exhausted sealed queue must fail closed',
  );
}

const second = solveExactNestedFrame(candidates, SEED);
assert.equal(second.status, 'SAT');
assert.deepEqual(
  second.selected.map((candidate) => candidate.stableTownId),
  first.selected.map((candidate) => candidate.stableTownId),
);
assert.deepEqual(second.replacementPlan.queueBySlot, first.replacementPlan.queueBySlot);
assert.deepEqual(second.search, first.search);

const replacementBacktrackingCandidates = syntheticCandidates().map((candidate) => ({
  ...candidate,
  priorExposure: 'NOT_PRIOR_SEEN',
}));
for (const index of [...Array.from({ length: 13 }, (_, value) => value), 80, 81, 82, 83, 84, 85]) {
  replacementBacktrackingCandidates[index].priorExposure = 'PRIOR_SEEN';
}
const primaryStratumKey = (candidate) => [candidate.macroRegion, candidate.indexPhase, candidate.scaleFunction.band].join('|');
const initiallyUnreplaceableStratum = primaryStratumKey(replacementBacktrackingCandidates[119]);
for (let index = 120; index < replacementBacktrackingCandidates.length; index += 1) {
  if (primaryStratumKey(replacementBacktrackingCandidates[index]) === initiallyUnreplaceableStratum) {
    replacementBacktrackingCandidates[index].priorExposure = 'PRIOR_SEEN';
  }
}
replacementBacktrackingCandidates[120].priorExposure = 'NOT_PRIOR_SEEN';
const replacementBacktracking = solveExactNestedFrame(replacementBacktrackingCandidates, SEED);
assert.equal(replacementBacktracking.status, 'SAT');
assert.equal(replacementBacktracking.replacementPlan.pass, true);
assert.equal(replacementBacktracking.search.replacementTerminalRejects, '1');
assert.equal(replacementBacktracking.search.completeSlateTerminals, '2');
assert.equal(
  replacementBacktracking.selected.some((candidate) => candidate.stableTownId === replacementBacktrackingCandidates[119].stableTownId),
  false,
);
assert.equal(
  replacementBacktracking.selected.some((candidate) => candidate.stableTownId === replacementBacktrackingCandidates[120].stableTownId),
  true,
);

const simpleUnsat = solveExactNestedFrame(candidates.slice(0, 10), SEED);
assert.equal(simpleUnsat.status, 'UNSAT');
assert.equal(simpleUnsat.certificate.certificateType, 'UNSAT_BY_NECESSARY_POOL_BOUND');
assert.equal(verifyUnsatCertificate(candidates.slice(0, 10), SEED, simpleUnsat.certificate), true);
const tamperedSimpleCertificate = structuredClone(simpleUnsat.certificate);
tamperedSimpleCertificate.violatedBounds[0].available += 1;
assert.equal(verifyUnsatCertificate(candidates.slice(0, 10), SEED, tamperedSimpleCertificate), false);

const jointUnsatCandidates = syntheticCandidates().map((candidate) => ({
  ...candidate,
  countryCode: candidate.scaleFunction.band === 'SMALL_LOCAL'
    ? 'SYNTHETIC_COUNTRY_CONCENTRATED'
    : candidate.countryCode,
}));
const jointUnsat = solveExactNestedFrame(jointUnsatCandidates, SEED);
assert.equal(jointUnsat.status, 'UNSAT');
assert.equal(jointUnsat.certificate.certificateType, 'UNSAT_BY_COMPLETE_ENUMERATION');
assert.equal(jointUnsat.search.nodesVisited, '1');
assert.equal(verifyUnsatCertificate(jointUnsatCandidates, SEED, jointUnsat.certificate), true);

process.stdout.write(`${JSON.stringify({
  pass: true,
  satPrefixes: LEGAL_PREFIXES,
  satSearch: first.search,
  replacementSlotsVerified: first.replacementPlan.aggregate.slotsWithInitiallyLegalReplacement,
  replacementTerminalBacktrackingVerified: true,
  necessaryBoundCertificateVerified: true,
  completeEnumerationCertificateVerified: true,
})}\n`);
