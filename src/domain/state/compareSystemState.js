/**
 * domain/state/compareSystemState.js — Diff two SystemState snapshots
 * into a list of human-readable Deltas.
 *
 * Used by the event engine to turn "this is what the state looked like
 * before, this is what it looks like after" into the deltas the UI shows
 * the DM ("Food security fell sharply because the granary was the town's
 * main reserve.") and the event log persists for the campaign timeline.
 *
 * The explanation strings are intentionally generic at this layer —
 * "Resilience fell sharply" rather than "the granary was burned" —
 * because the *cause* belongs to the event, not the state diff. The
 * EventComposer combines event description + state delta into the
 * narrative summary the user reads.
 */

import { severityFor, bandForDimension, dimensionPolarity } from './bands.js';

/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../types.js').Delta} Delta */
/** @typedef {keyof SystemState} StateKey */

/** Short human label per dimension — for delta strings. */
const LABEL = {
  resilience:       'Resilience',
  volatility:       'Volatility',
  externalThreat:   'External Threat',
  resourcePressure: 'Resource Pressure',
};

// Polarity — which direction is "bad" per dimension — is read from bands.js
// (DIM_POLARITY), the SINGLE source. It used to be re-declared here, and the
// duplicate was the tell for the defect this file carried: `better` below was
// polarity-correct while the band pair beside it was not, so a volatility rise
// from 70 to 80 rendered the self-contradicting sentence "Volatility rose
// noticeably (Strained → Stable) — pressure increased". Both halves now read
// the same source.

/**
 * @param {SystemState} before
 * @param {SystemState} after
 * @returns {Delta[]}
 */
export function compareSystemState(before, after) {
  if (!before || !after) return [];
  /** @type {Delta[]} */
  const deltas = [];
  for (const key of /** @type {StateKey[]} */ (Object.keys(LABEL))) {
    const b = before[key]?.value ?? 50;
    const a = after[key]?.value ?? 50;
    const change = a - b;
    if (change === 0) continue;
    deltas.push({
      key,
      before: b,
      after:  a,
      change,
      severity:    /** @type {Delta['severity']} */ (severityFor(change)),
      explanation: explain(key, b, a, change),
    });
  }
  // Sort by absolute change descending — biggest movers first, which is
  // what a DM scanning a delta panel actually wants.
  deltas.sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
  return deltas;
}

/**
 * @param {StateKey} key
 * @param {number} before
 * @param {number} after
 * @param {number} change
 * @returns {string}
 */
function explain(key, before, after, change) {
  const label  = LABEL[key];
  const polar  = dimensionPolarity(key);
  const dir    = change > 0 ? 'rose' : 'fell';
  const mag    = Math.abs(change) >= 15 ? 'sharply' : Math.abs(change) >= 7 ? 'noticeably' : 'slightly';
  const better = (polar === 'higher_is_better' && change > 0) ||
                 (polar === 'lower_is_better'  && change < 0);

  // Band crossings deserve their own callout — moving from Strained to
  // Vulnerable is a real qualitative shift even with the same numeric
  // delta. Oriented by polarity, so the band pair and `better` agree.
  const bandBefore = bandForDimension(key, before);
  const bandAfter  = bandForDimension(key, after);
  if (bandBefore !== bandAfter) {
    return `${label} ${dir} ${mag} (${bandBefore} → ${bandAfter})${better ? '' : ' — pressure increased'}`;
  }
  return `${label} ${dir} ${mag}${better ? '' : ' — pressure increased'}`;
}
