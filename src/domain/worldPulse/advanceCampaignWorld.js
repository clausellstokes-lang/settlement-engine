// advanceCampaignWorld — a thin barrel over pulseKernel (the one-week kernel),
// advanceInterval (the multi-tick Stage 1-5 orchestrator), and pulseHelpers (the
// shared compactors / clone / interval helpers). The public API is unchanged: this
// re-exports the kernel + interval entry points and defines the two thin
// preview/advance wrappers. The byte-identity equivalence invariant (ON ==
// OFF-recommended advance) lives in pulseKernel/advanceInterval, not here.
export { simulateCampaignWorldPulse } from './pulseKernel.js';
export { weeksPerInterval, ticksForInterval, simulateCampaignWorldInterval } from './advanceInterval.js';
import { simulateCampaignWorldPulse } from './pulseKernel.js';

export function previewCampaignWorldPulse(args = {}) {
  return simulateCampaignWorldPulse({ ...args, commit: false });
}

export function advanceCampaignWorld(args = {}) {
  return simulateCampaignWorldPulse({ ...args, commit: true });
}
