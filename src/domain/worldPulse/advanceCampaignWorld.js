// advanceCampaignWorld — a thin barrel over pulseKernel (the one-week kernel),
// advanceInterval (the multi-tick Stage 1-5 orchestrator), and pulseHelpers (the
// shared compactors / clone / interval helpers). The public API is unchanged: this
// re-exports the kernel + interval entry points and defines the two thin
// preview/advance wrappers. The byte-identity equivalence invariant (ON ==
// OFF-recommended advance) lives in pulseKernel/advanceInterval, not here.
export { simulateCampaignWorldPulse } from './pulseKernel.js';
export { weeksPerInterval, ticksForInterval, simulateCampaignWorldInterval } from './advanceInterval.js';
import { simulateCampaignWorldPulse } from './pulseKernel.js';
import { withCustomContent } from '../../lib/dependencyEngine.js';

/**
 * @typedef {NonNullable<Parameters<typeof simulateCampaignWorldPulse>[0]> & {
 *   customContent?:Record<string, unknown>|null,
 * }} PinnedPulseArgs
 */

/**
 * @param {PinnedPulseArgs} args
 * @param {boolean} commit
 * @returns {ReturnType<typeof simulateCampaignWorldPulse>}
 */
function runWithPinnedContent(args, commit) {
  const { customContent = null, ...pulseArgs } = args || {};
  const run = () => simulateCampaignWorldPulse({ ...pulseArgs, commit });
  return customContent == null
    ? run()
    : withCustomContent(customContent, run);
}

/** @param {PinnedPulseArgs} [args] */
export function previewCampaignWorldPulse(args = {}) {
  return runWithPinnedContent(args, false);
}

/** @param {PinnedPulseArgs} [args] */
export function advanceCampaignWorld(args = {}) {
  return runWithPinnedContent(args, true);
}
