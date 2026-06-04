/**
 * domain/state/compareSystemState.js - Diff two SystemState snapshots
 * into a list of human-readable Deltas.
 *
 * Used by the event engine to turn "this is what the state looked like
 * before, this is what it looks like after" into the deltas the UI shows
 * the DM ("Food security fell sharply because the granary was the town's
 * main reserve.") and the event log persists for the campaign timeline.
 *
 * The explanation strings are intentionally generic at this layer -
 * "Resilience fell sharply" rather than "the granary was burned" -
 * because the *cause* belongs to the event, not the state diff. The
 * EventComposer combines event description + state delta into the
 * narrative summary the user reads.
 */

import { severityFor, bandFor } from './bands.js';

/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../types.js').Delta} Delta */
/** @typedef {keyof SystemState} StateKey */

/** Short human label per dimension - for delta strings. */
const LABEL = {
  resilience:       'Resilience',
  volatility:       'Volatility',
  externalThreat:   'External Threat',
  resourcePressure: 'Resource Pressure',
};

/**
 * For each dimension, polarity describes which direction is "bad."
 * Resilience drops are bad (less ability to absorb shocks). Volatility
 * rises are bad (more conflict pressure). This drives the severity
 * wording and the +/- arrow choice in the UI.
 */
const POLARITY = {
  resilience:       'higher_is_better',
  volatility:       'lower_is_better',
  externalThreat:   'lower_is_better',
  resourcePressure: 'lower_is_better',
};

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
      severity:    severityFor(change),
      explanation: explain(key, b, a, change),
    });
  }
  // Sort by absolute change descending - biggest movers first, which is
  // what a DM scanning a delta panel actually wants.
  deltas.sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
  return deltas;
}

function explain(key, before, after, change) {
  const label  = LABEL[key];
  const polar  = POLARITY[key];
  const dir    = change > 0 ? 'rose' : 'fell';
  const mag    = Math.abs(change) >= 15 ? 'sharply' : Math.abs(change) >= 7 ? 'noticeably' : 'slightly';
  const better = (polar === 'higher_is_better' && change > 0) ||
                 (polar === 'lower_is_better'  && change < 0);

  // Band crossings deserve their own callout - moving from Strained to
  // Vulnerable is a real qualitative shift even with the same numeric
  // delta.
  const bandBefore = bandFor(before);
  const bandAfter  = bandFor(after);
  if (bandBefore !== bandAfter) {
    return `${label} ${dir} ${mag} (${bandBefore} → ${bandAfter})${better ? '' : ' - pressure increased'}`;
  }
  return `${label} ${dir} ${mag}${better ? '' : ' - pressure increased'}`;
}
