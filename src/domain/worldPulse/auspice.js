/**
 * domain/worldPulse/auspice.js — V-16 THE AUSPICE (the omen, not the promise).
 *
 * "Read the auspices" before you commit a decree or a table event: advance a
 * THROWAWAY copy of the realm N ticks through the PURE engine, tier what it
 * foretells by news significance, and DISCARD the copy. The real campaign is
 * NEVER touched — this is the purity dividend of a deterministic engine.
 *
 * It reuses THE FORECAST (forecastRun.simulatePendingFuture) — the same
 * clone-and-discard, queue-inclusive, preview≡apply-by-construction run the
 * docket already trusts — so the auspice is not a parallel simulation: it is the
 * forecast, RE-FRAMED as an omen and tiered for the reader.
 *
 * THE HONEST LABEL (enforced in the surface, AuspicePanel): an omen is the
 * ceteris-paribus future — exact if nothing else changes; the soak's tuning can
 * still shift futures. It is a glimpse, never a promise. DETERMINISTIC: same
 * world + queue + span ⇒ the identical omen, forever (the clone carries the same
 * rngSeed + tick, so the advance reproduces byte-for-byte). ZERO-TRACE: the real
 * worldState is byte-identical before and after (inherited from
 * simulatePendingFuture's no-commit discipline; pinned directly in auspice.test.js).
 *
 * WORKER SEAM (fold): V-8's advanceWorkerClient.runAdvanceInterval is a pure
 * transport swap under simulateCampaignWorldInterval — adopting it leaves this
 * omen-framing untouched. The sync path is v1; do not depend on the worker.
 *
 * Lazy: dynamic-imported by the AuspicePanel only — off the first-paint closure
 * (pinned via AUSPICE_FINGERPRINT).
 */
import { simulatePendingFuture } from './forecastRun.js';

/** Minifier-stable literal proving this graph stays off first paint. */
export const AUSPICE_FINGERPRINT = '::auspice:v1';

/** The schema-owned loose record alias (the forecastRun Mut idiom).
 * @typedef {Record<string, any>} Mut */

/** @param {Mut} n @returns {{ tick: any, headline: string, kind: string, scope: string }} */
function toBeat(n) {
  return {
    tick: n && n.tick != null ? n.tick : null,
    headline: n && typeof n.headline === 'string' ? n.headline : '',
    kind: n && typeof n.kind === 'string' ? n.kind : '',
    scope: n && typeof n.scope === 'string' ? n.scope : 'realm',
  };
}

/**
 * Compose the significance-tiered OMEN from a discarded forecast run. Pure
 * read-model: the two news tiers ('major' vs 'notable', the engine's own news
 * significance vocabulary) plus the crossroads — the pause points where "the
 * world would await your word". Reads only the clone's result; never the real
 * campaign, so composing an omen cannot leave a trace either.
 * @param {{ result?: Mut }} run  simulatePendingFuture's return
 * @returns {{ major: any[], notable: any[], crossroads: any[],
 *            counts: { major: number, notable: number, crossroads: number } }}
 */
export function composeOmen(run) {
  const result = (run && run.result) || {};
  const entries = Array.isArray(result.wizardNews && result.wizardNews.entries) ? result.wizardNews.entries : [];
  const major = entries.filter((/** @type {Mut} */ n) => n && n.significance === 'major').map(toBeat);
  const notable = entries.filter((/** @type {Mut} */ n) => n && n.significance !== 'major').map(toBeat);
  const crossroads = (Array.isArray(result.majors) ? result.majors : []).map((/** @type {Mut} */ m) => ({
    tick: m && m.tick != null ? m.tick : null,
    headline: (m && (m.headline || (m.outcome && m.outcome.headline))) || 'The world would await your word.',
  }));
  return {
    major, notable, crossroads,
    counts: { major: major.length, notable: notable.length, crossroads: crossroads.length },
  };
}

/**
 * READ THE AUSPICES. Advance a throwaway clone of the realm through the pure
 * engine, tier the result, discard the clone. Async (the orchestrator yields).
 * Zero-trace + deterministic (see the module header). Returns the omen only —
 * the discarded run never escapes.
 * @param {{ campaign: Mut, saves?: Mut[], interval?: string, weeks?: number|null, now: string }} io
 * @returns {Promise<ReturnType<typeof composeOmen>>}
 */
export async function readAuspices({ campaign, saves = [], interval = 'one_season', weeks = null, now }) {
  const run = await simulatePendingFuture({ campaign, saves, interval, weeks, now });
  return composeOmen(run);
}
