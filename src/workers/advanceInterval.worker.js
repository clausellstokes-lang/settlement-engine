/**
 * advanceInterval.worker.js — runs the multi-tick world-pulse advance OFF the
 * main thread.
 *
 * A one_year Advance is 48 synchronous kernel ticks; on the main thread that
 * froze the tab. This worker imports the SAME pure `simulateCampaignWorldInterval`
 * (the domain function is untouched and remains the single source of truth — it
 * still runs in-thread for tests/Node/SSR and as the client-side fallback) and
 * runs it here, so the UI thread stays interactive. Determinism is preserved:
 * same code + same structured-cloned inputs + a pinned `now` ⇒ byte-identical
 * output across the realm.
 *
 * Message protocol (one advance per worker instance; the client spawns a fresh
 * worker per request and terminates it on completion):
 *   in:  { payload: {campaign,saves,interval,commit,now,autoResolve,resume}, customContent }
 *   out: { type:'progress', detail:{ticksDone,ticksTotal,interval} }  (per tick)
 *        { type:'result', result }                                    (exactly once)
 *        { type:'error', message, stack }                             (on throw)
 *
 * Import the LEAF advanceInterval.js (not the worldPulse/index.js barrel) so the
 * worker bundle stays the audited DOM-free graph.
 */
import { simulateCampaignWorldInterval } from '../domain/worldPulse/advanceInterval.js';

self.onmessage = async (e) => {
  const { payload, customContent } = e.data || {};
  try {
    const result = await simulateCampaignWorldInterval({
      ...payload,
      // Scope the immutable campaign projection per synchronous kernel tick.
      // This mirrors the in-thread fallback without installing mutable global
      // library state for the worker lifetime.
      customContent: customContent || {},
      onProgress: (detail) => self.postMessage({ type: 'progress', detail }),
    });
    self.postMessage({ type: 'result', result });
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err?.message || err), stack: err?.stack });
  }
};
