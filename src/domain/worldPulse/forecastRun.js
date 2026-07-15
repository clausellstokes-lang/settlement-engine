/**
 * domain/worldPulse/forecastRun.js — THE FORECAST (Composer V2 §10 — the
 * realm's pending future; W-COMPOSER-2 Stage 4).
 *
 * THE REFRAME, executed: there is no forecasting an event — only forecasting
 * the realm's PENDING FUTURE. A forecast is never smaller than everything
 * (QUEUE-INCLUSIVE LAW): the clone-run drains the ENTIRE pending queue through
 * the REAL drain (drainQueuedEvents — the same fn, the same fold, the same
 * veto channel) and then runs the REAL interval orchestrator
 * (simulateCampaignWorldInterval) over the drained clones — never a parallel
 * implementation, so preview ≡ apply BY CONSTRUCTION. Interactions between
 * queued events are never analyzed, only RUN.
 *
 * THE HONEST LABEL: the ceteris-paribus future — exact if nothing else
 * changes; the clone runs auto-resolve ("assuming defaults where the world
 * would await your word"). Deterministic: same world + queue + interval ⇒ the
 * identical forecast, forever. NO-COMMIT DISCIPLINE: clone-and-discard — this
 * module never persists, never stamps cursors, never emits analytics.
 *
 * KNOWN DIVERGENCE (documented, not a gap to re-find): party-caused queued
 * events replay their world-side party ripple through the STORE
 * (recordPartyImpact) after the real drain; the forecast applies their
 * settlement-side effect but not that ripple. The preview≡apply pin therefore
 * binds on non-party queues; party-queue parity lands with a party-impact
 * domain seam if wanted.
 */

import { deepClone } from '../clone.js';
import { drainQueuedEvents, applyTwinDirectivesToWorld } from '../events/drainQueuedEvents.js';
import { simulateCampaignWorldInterval } from './advanceInterval.js';

/**
 * REALM-WIDE STALENESS (§10): the forecast fingerprint = world clock × FULL
 * queue hash × pending-proposal set × interval. ANY queue mutation from any
 * member's composer, any advance, any proposal decision changes it — the
 * bidirectional invalidation, by key design. Pure string derivation.
 * @param {Record<string, any>} campaign @param {string} interval
 */
export function forecastFingerprint(campaign, interval) {
  const ws = campaign?.worldState || {};
  const queue = (ws.pendingEvents || [])
    .map((/** @type {any} */ q) => `${q.queueId}@${q.queuedAt}`)
    .join('|');
  const proposals = (ws.proposals || [])
    .filter((/** @type {any} */ p) => p && p.status === 'pending')
    .map((/** @type {any} */ p) => p.id)
    .join('|');
  return `${ws.tick ?? 0}:${interval}:${queue}:${proposals}`;
}

/**
 * Run the realm's pending future once: clone, drain the REAL queue in REAL
 * drain order (candidate appended last — where a newly-staged commit would
 * land), fold exactly as the advance folds, then run the SHARED interval
 * pipeline over the drained clones. Async (the orchestrator yields).
 * @param {Object} io
 * @param {Record<string, any>} io.campaign  the campaign (cloned inside)
 * @param {Array<Record<string, any>>} io.saves  member saves (cloned inside)
 * @param {string} [io.interval]  week/month/season/year — the orchestrator's own vocabulary
 * @param {number|null} [io.weeks]  explicit whole-week span (overrides interval)
 * @param {string} io.now
 * @param {{ saveId: string, event: Record<string, any> } | null} [io.candidate]
 *   the staged-but-unqueued change (the marginal-attribution lane)
 * @returns {Promise<{ result: Record<string, any>, refusals: any[], drainedCount: number }>}
 */
export async function simulatePendingFuture({ campaign, saves, interval = 'one_month', weeks = null, now, candidate = null }) {
  const c = deepClone(campaign);
  const s = deepClone(Array.isArray(saves) ? saves : []);
  const ws = c.worldState || {};
  const queue = [...(ws.pendingEvents || [])];
  if (candidate && candidate.event && candidate.saveId != null) {
    queue.push({
      queueId: 'forecast_candidate',
      saveId: String(candidate.saveId),
      event: deepClone(candidate.event),
      queuedAt: now,
    });
  }
  // THE REAL DRAIN over the clone (the same fn the advance runs).
  const drained = drainQueuedEvents({ queue, saves: s, now, tick: ws.tick ?? null });
  const byId = new Map(s.map((/** @type {any} */ x) => [String(x.id), x]));
  for (const u of drained.updates) {
    const save = byId.get(String(u.saveId));
    if (!save) continue;
    save.settlement = u.settlement;
    save.campaignState = { ...(save.campaignState || {}), eventLog: u.eventLog, systemState: u.systemState };
  }
  const tick = Math.max(0, Math.floor(Number(ws.tick) || 0));
  c.worldState = { ...applyTwinDirectivesToWorld(ws, drained.twinDirectives, { tick, now }), pendingEvents: [] };
  // THE SHARED PIPELINE, the same flags a committed advance uses (preview ≡
  // apply by construction); auto-resolve renders pause points as defaults.
  const result = await simulateCampaignWorldInterval({
    campaign: c, saves: s, interval, commit: true, now, autoResolve: true,
    ...(weeks != null ? { weeks } : {}),
  });
  return { result, refusals: drained.refusals || [], drainedCount: drained.drainedCount };
}

/**
 * THE FORECAST, both runs (§10): BASELINE (world + the ENTIRE queue + the
 * interval) and — when a candidate is staged — CANDIDATE (same + the staged
 * change), rendering the joint outcome and the marginal contribution as
 * with-vs-without, both queue-inclusive.
 * @param {{ campaign: Record<string, any>, saves: Array<Record<string, any>>,
 *   interval?: string, weeks?: number|null, now: string,
 *   candidate?: { saveId: string, event: Record<string, any> } | null }} io
 * @returns {Promise<{ baseline: any, withCandidate: any | null, fingerprint: string }>}
 */
export async function runRealmForecast({ campaign, saves, interval = 'one_month', weeks = null, now, candidate = null }) {
  const baseline = await simulatePendingFuture({ campaign, saves, interval, weeks, now });
  const withCandidate = candidate
    ? await simulatePendingFuture({ campaign, saves, interval, weeks, now, candidate })
    : null;
  return { baseline, withCandidate, fingerprint: forecastFingerprint(campaign, interval) };
}

/**
 * THE DIGEST RENDERING feed (§10): the story of the unattended interval,
 * grouped per settlement, time-resolved (entries keep their ticks). A compact
 * read-model over the run result for the docket pane: per-member before/after
 * (population, tier) + that member's news beats, plus the realm-scope beats.
 * @param {Record<string, any>} run  simulatePendingFuture's return
 * @param {Array<Record<string, any>>} saves  the PRE-forecast member saves
 * @returns {{ members: Array<Record<string, any>>, realm: Array<Record<string, any>>, pauseMarkers: Array<Record<string, any>> }}
 */
export function forecastDigest(run, saves) {
  const result = run?.result || {};
  const updates = new Map((result.settlementUpdates || []).map((/** @type {any} */ u) => [String(u.saveId), u]));
  const entries = Array.isArray(result.wizardNews?.entries) ? result.wizardNews.entries : [];
  const members = [];
  for (const save of Array.isArray(saves) ? saves : []) {
    const sid = String(save.id);
    const before = save.settlement || {};
    const after = updates.get(sid)?.settlement || before;
    members.push({
      saveId: sid,
      name: after.name || before.name || sid,
      populationBefore: Number(before.population) || 0,
      populationAfter: Number(after.population) || 0,
      tierBefore: String(before.tier || ''),
      tierAfter: String(after.tier || ''),
      beats: entries
        .filter((/** @type {any} */ n) => (n.settlementIds || []).map(String).includes(sid))
        .map((/** @type {any} */ n) => ({ tick: n.tick, headline: n.headline, kind: n.kind })),
    });
  }
  const memberIds = new Set(members.map(m => m.saveId));
  const realm = entries
    .filter((/** @type {any} */ n) => !(n.settlementIds || []).some((/** @type {any} */ id) => memberIds.has(String(id))))
    .map((/** @type {any} */ n) => ({ tick: n.tick, headline: n.headline, kind: n.kind }));
  // Pause points render as markers ("where the world would await your word").
  const pauseMarkers = (result.majors || []).map((/** @type {any} */ m) => ({
    tick: m?.tick ?? null, headline: m?.headline || m?.outcome?.headline || 'A major awaited your word',
  }));
  return { members, realm, pauseMarkers };
}
