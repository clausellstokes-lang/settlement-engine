/**
 * Lazy Chronicle grounding for AI requests.
 *
 * The Chronicle feed carries campaign-history projection code that has no work
 * to do on first paint. aiSlice loads this module only after a narrative or
 * daily-life request owns the request lock, keeping the history projection out
 * of the eager application graph without changing the request payload.
 */

import {
  buildChronicleFeed,
  selectChronicleContext,
} from '../domain/dossier/chronicleFeed.js';
import { settlementWorldPulseEntries } from '../domain/dossier/settlementWorldChronicle.js';

/**
 * @param {any} saveEntry
 * @param {any} settlement
 * @param {{ campaignWorldState?: any, savedSettlements?: any[] }} [world]
 *   the OWNING campaign's raw worldState plus the saves roster, threaded in by
 *   aiSlice from the store. Omitted ⇒ the world lane falls back to the legacy
 *   per-save path exactly as before.
 */
export function buildChronicleContextFromSave(saveEntry, settlement, world = {}) {
  try {
    if (!saveEntry) return null;
    const campaignState = saveEntry.campaignState || {};
    // WORLD-PULSE SEAM, SECOND SITE (CR-S6-6, 2026-08-11). This lane read
    // `campaignState.worldPulse?.events`, which NO writer produces: the one writer
    // of that slot (store/campaignPulseHelpers.js campaignStateForWorldPulse) emits
    // {lastTick, lastInterval, updatedAt} and nothing else. So the AI grounding
    // context's world lane was PERMANENTLY EMPTY — advancing time never put a single
    // world event in front of the model. Same defect, same cure as the dossier
    // Chronicle (owner bug 2026-07-22, OutputContainer.collectChronicle): the events
    // live on the OWNING campaign's worldState.pulseHistory, and
    // settlementWorldPulseEntries projects that already-persisted history into
    // per-settlement rows. A PURE READ — no new persistence, no shape change.
    // The legacy per-save path is kept as a fallback for any save that carries it,
    // byte-identically to the sibling surface.
    const worldEntries = world.campaignWorldState
      ? settlementWorldPulseEntries(
        world.campaignWorldState,
        saveEntry.id ?? settlement?.id,
        { savedSettlements: world.savedSettlements || [] },
      )
      : [];
    const feed = buildChronicleFeed({
      manual: campaignState.eventLog,
      worldPulse: worldEntries.length ? worldEntries : campaignState.worldPulse?.events,
      worldLog: campaignState.worldState?.eventLog,
      // H9 (2026-08-11): the `recent` slot is GONE, here and at the sibling read in
      // components/OutputContainer.jsx. `settlement.recentEvents` has NO writer
      // anywhere in this repo, so the slot could only ever hand buildChronicleFeed
      // `undefined`. Deleted at BOTH sites together — curing one leaves the class
      // alive at the other.
    }, {
      limit: 40,
      reference: campaignState.worldState?.canonizedAt
        || campaignState.canonizedAt
        || null,
    });
    const items = selectChronicleContext(feed, { limit: 8 });
    return items.length ? { items } : null;
  } catch {
    return null;
  }
}
