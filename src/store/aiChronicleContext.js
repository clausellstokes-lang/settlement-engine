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

export function buildChronicleContextFromSave(saveEntry, settlement) {
  try {
    if (!saveEntry) return null;
    const campaignState = saveEntry.campaignState || {};
    const feed = buildChronicleFeed({
      manual: campaignState.eventLog,
      worldPulse: campaignState.worldPulse?.events,
      worldLog: campaignState.worldState?.eventLog,
      recent: settlement?.recentEvents || saveEntry.settlement?.recentEvents,
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
