/**
 * components/dossier/collectChronicle.js — the dossier's unified Chronicle feed, MOVED VERBATIM
 * out of `OutputContainer.jsx` (W2 commit 3).
 *
 * WHY IT MOVED, stated plainly so nobody re-finds it as a mystery: OutputContainer sat EXACTLY at
 * its 600-line layer ceiling, and the Scribe's open trigger needs two lines there (an import and
 * one hook call). The rule in this estate is that a ratchet is never moved to make room, so a
 * pure, module-level, already-exported function with its own two imports came out instead. Nothing
 * is rewritten: the body below and its `chronicleReferenceFor` helper are byte-for-byte what they
 * were, and OutputContainer re-exports `collectChronicle` so `tests/components/publicChronicleTab.test.jsx`
 * imports it from the same place it always did.
 */

import { buildChronicleFeed } from '../../domain/dossier/chronicleFeed.js';
import { settlementWorldPulseEntries } from '../../domain/dossier/settlementWorldChronicle.js';

function chronicleReferenceFor(saveEntry) {
  const cs = saveEntry?.campaignState;
  return cs?.worldState?.canonizedAt || cs?.canonizedAt || cs?.startedAt || null;
}

export function collectChronicle(saveEntry, settlement, publicChronicle = null, campaignWorldState = null, savedSettlements = []) {
  // The unified Chronicle feed (spec §8 M3c): manual events + party-caused +
  // world-pulse, merged + normalized + sorted newest-first and timed relative to
  // canonization by the shared domain helper, so screen + any future surface
  // read one source of truth.
  //
  // WORLD-PULSE SEAM (owner bug 2026-07-22): the world source used to read the
  // per-save campaignState.worldPulse.events / worldState.eventLog paths, which the
  // advance NEVER writes — so advancing time showed nothing here. The events live on
  // the owning campaign's worldState.pulseHistory; settlementWorldPulseEntries
  // projects that already-persisted history into per-settlement rows (a pure read).
  // The legacy per-save paths are kept as a fallback for any save that happens to
  // carry them.
  //
  // A PUBLIC gallery dossier has no saved campaignState — the gallery RPC
  // projects an allowlisted copy of the eventLog into its own `chronicle`
  // column (migration 032; re-filtered client-side in gallery.js), threaded
  // here as publicChronicle and fed through the same manual-source
  // normalization. It is consulted ONLY when there is no save entry at all;
  // owner surfaces (live editor, saved view) never pass it, so the owner feed
  // is byte-for-byte what it was before.
  const worldEntries = campaignWorldState
    ? settlementWorldPulseEntries(campaignWorldState, saveEntry?.id ?? settlement?.id, { savedSettlements })
    : [];
  const feed = buildChronicleFeed({
    manual:     saveEntry ? saveEntry.campaignState?.eventLog : publicChronicle,
    worldPulse: worldEntries.length ? worldEntries : saveEntry?.campaignState?.worldPulse?.events,
    worldLog:   saveEntry?.campaignState?.worldState?.eventLog,
    // H9 (2026-08-11): the `recent` slot is GONE, here and at the sibling read in
    // store/aiChronicleContext.js. `settlement.recentEvents` has NO writer anywhere
    // in this repo — no generator, no import, no migration, no normalizer produces
    // it — so the slot could only ever hand buildChronicleFeed `undefined`. Deleted
    // at BOTH sites together, because curing one leaves the class alive at the other.
  }, { limit: 60, reference: chronicleReferenceFor(saveEntry) });
  // Re-attach THE NEWS ADDRESS LAW block to the world rows. buildChronicleFeed's
  // normalizer keeps the byte-minimal common shape (no address passthrough — that
  // module is first-paint-eager via the store, so it stays untouched); the address
  // rides back on here, in the lazy dossier path, keyed by the row id.
  if (worldEntries.length) {
    const addressById = new Map(worldEntries.map(e => [e.id, e.address]));
    return feed.map(e => (e.source === 'world' && addressById.has(e.id)) ? { ...e, address: addressById.get(e.id) } : e);
  }
  return feed;
}
