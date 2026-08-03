/**
 * WR-6 pulse adapter: standing allied-front decisions and bounded evidence.
 *
 * The behavior stays in the existing WR-1/WR-5 evaluators.  This leaf only
 * censuses valid joined deployments once, removes the premature "separate
 * peace" claim from an exit that is still merely a proposal, and admits
 * recurring cost/stay facts to public news only on meaningful transitions.
 */

import { normalizeWarCoalitionEvidence } from './warCoalitionEvidence.js';
import { coalitionLedgerActive } from './warCoalitionExpenditure.js';
import { readStandingCoalitionDecision } from './warPeaceDecision.js';
import { strategyEmergencyRecallFor } from './settlementStrategy.js';

const EXPENDITURE_BAND_RANK = Object.freeze({
  quiet: 0,
  present: 1,
  pressing: 2,
  decisive: 3,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** Canonical, codepoint-stable union of evidence groups. */
export function mergeWarCoalitionEvidence(...groups) {
  const byIdentity = new Map();
  for (const group of groups) {
    for (const raw of Array.isArray(group) ? group : []) {
      const row = normalizeWarCoalitionEvidence(raw);
      if (!row) continue;
      const identity = `${row.kind}\u0000${row.id}`;
      if (!byIdentity.has(identity)) byIdentity.set(identity, row);
    }
  }
  return [...byIdentity.values()].sort((left, right) => {
    const a = `${left.kind}\u0000${left.id}`;
    const b = `${right.kind}\u0000${right.id}`;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

/**
 * Read one standing decision per valid joined deployment.  An exit remains a
 * desire until the bilateral proposal is accepted, so only its expenditure
 * read is retained here; peaceTerms owns the eventual separate-peace fact.
 */
export function readCoalitionStandingFronts({
  worldState = null,
  snapshot = null,
  pIndex = null,
  tick = null,
} = {}) {
  const empty = { decisions: [], byParty: new Map(), evidence: [] };
  if (!coalitionLedgerActive(worldState)) return empty;
  const state = asObject(worldState);
  const deployments = asObject(state.deployments);
  const decisions = [];
  const recalledEvidence = [];
  for (const partyId of Object.keys(deployments).sort()) {
    const targetId = String(asObject(deployments[partyId]).targetId || '');
    if (!targetId) continue;
    // The chooser's deterministic return-home arm outranks the strategic
    // decision, but it does not erase expenditure already borne by this joined
    // episode. Read once, retain only the derived bill, and suppress both
    // "stayed" and any exit desire that the same pulse will override.
    const emergencyRecall = strategyEmergencyRecallFor(snapshot, partyId, tick);
    const decision = readStandingCoalitionDecision({
      worldState: state,
      snapshot,
      pIndex,
      partyId,
      targetId,
      tick,
    });
    if (!decision) continue;
    if (emergencyRecall) {
      recalledEvidence.push(...(Array.isArray(decision.coalitionEvidence)
        ? decision.coalitionEvidence.filter((row) => asObject(row).kind === 'coalition_expenditure_read')
        : []));
      continue;
    }
    decisions.push(decision);
  }
  const byParty = new Map(decisions.map((decision) => [String(decision.partyId), decision]));
  const evidence = mergeWarCoalitionEvidence(recalledEvidence, ...decisions.map((decision) => (
    (Array.isArray(decision.coalitionEvidence) ? decision.coalitionEvidence : [])
      .filter((row) => decision.decision !== 'exit'
        || asObject(row).kind !== 'coalition_separate_peace')
  )));
  return { decisions, byParty, evidence };
}

/** @param {Record<string, unknown>} row */
function episodeIdentity(row) {
  const joinedTick = Number(row.joinedTick);
  return [
    String(row.kind || ''),
    String(row.settlementId || ''),
    String(row.counterpartId || ''),
    String(row.thirdPartyId || row.targetId || ''),
    Number.isFinite(joinedTick) ? Math.floor(joinedTick) : '',
  ].join('\u0000');
}

/** Newest earlier fact for the same joined episode, robust to imported order. */
function priorEpisodeEvidence(worldState, current) {
  const history = Array.isArray(asObject(worldState).pulseHistory)
    ? asObject(worldState).pulseHistory
    : [];
  const identity = episodeIdentity(current);
  const currentTick = Number(current.tick);
  let newest = null;
  let newestTick = Number.NEGATIVE_INFINITY;
  for (const rawPulse of history) {
    const pulse = asObject(rawPulse);
    const rows = Array.isArray(pulse.warCoalitionEvidence) ? pulse.warCoalitionEvidence : [];
    for (const raw of rows) {
      const row = normalizeWarCoalitionEvidence(raw);
      const rowTick = Number(row?.tick);
      if (!row || episodeIdentity(row) !== identity
        || !Number.isFinite(rowTick) || rowTick >= currentTick || rowTick < newestTick) continue;
      newest = row;
      newestTick = rowTick;
    }
  }
  return newest;
}

/**
 * Admission for the recurring standing census: cost speaks on first nonquiet
 * evidence or a worsening band; stay speaks once per joined episode.
 */
export function coalitionStandingTransitionEvidence(worldState, evidence) {
  const admitted = [];
  for (const row of mergeWarCoalitionEvidence(evidence)) {
    const prior = priorEpisodeEvidence(worldState, row);
    if (row.kind === 'coalition_expenditure_read') {
      const rank = EXPENDITURE_BAND_RANK[String(row.band)] ?? -1;
      const priorRank = prior ? EXPENDITURE_BAND_RANK[String(prior.band)] ?? -1 : -1;
      if (rank > EXPENDITURE_BAND_RANK.quiet && rank > priorRank) admitted.push(row);
    } else if (row.kind === 'coalition_stayed' && !prior) {
      admitted.push(row);
    }
  }
  return admitted;
}
