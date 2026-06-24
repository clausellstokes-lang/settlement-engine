/**
 * RealmStrip — the campaign-folder "state of the realm" header strip (UX overhaul
 * Phase 3, plan §4.2). Surfaces, only when the campaign world is canonized /
 * simulated:
 *   - the in-world clock (season · month/year · tick)
 *   - the active-siege count           (liveSieges)
 *   - the dominant-faith pill          (top pantheon tier, by seats)
 *   - the Wizard-News recency          (latest entry tick vs current tick)
 *   - the pending-propagation cue      (Phase 4b — committed member changes
 *                                        whose regional ripple is waiting for
 *                                        the next Advance to take effect)
 *
 * SELF-HIDES WHEN DORMANT: returns NULL when the campaign world is not canonized
 * (no `worldState.canonizedAt`). A dormant campaign folder is byte-identical to
 * today — the strip never appears. Even when canonized, each segment self-hides if
 * its system is empty (no sieges → no siege count; no pantheon → no faith pill).
 *
 * Pure presentational over the existing warStatus / pantheon read-models. No
 * store, no rng, no wall clock.
 */

import { liveSieges } from '../../domain/display/warStatus.js';
import { GOLD_TXT, BODY, VIOLET_DEEP, FS, sans, swatch } from '../theme.js';

const SIEGE_RED = swatch['#8B1A1A'];

const SEASON_LABEL = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', fall: 'Autumn', winter: 'Winter' };

/**
 * The dominant faith in a campaign's pantheon: the highest-tier deity (major >
 * minor > cult), breaking ties by seats held, then by name. Resolves the human
 * name from the member settlements' embedded snapshots (same lookup PantheonPanel
 * uses). Null when the campaign carries no materialized pantheon (dormant faith).
 *
 * @param {any} campaign
 * @param {Array<any>} settlements  the campaign's member saves.
 * @returns {{ name: string, tier: string, seats: number } | null}
 */
export function dominantFaith(campaign, settlements = []) {
  const pantheon = campaign?.worldState?.pantheon;
  if (!pantheon || typeof pantheon !== 'object' || Object.keys(pantheon).length === 0) return null;
  const TIER_RANK = { major: 3, minor: 2, cult: 1 };
  let best = null;
  for (const id of Object.keys(pantheon)) {
    const entry = pantheon[id] || {};
    const tierRank = TIER_RANK[entry.tier] || 1;
    const seats = Number(entry.seats) || 0;
    const cand = { id, tier: entry.tier || 'cult', tierRank, seats };
    if (!best
      || cand.tierRank > best.tierRank
      || (cand.tierRank === best.tierRank && cand.seats > best.seats)
      || (cand.tierRank === best.tierRank && cand.seats === best.seats && String(cand.id) < String(best.id))) {
      best = cand;
    }
  }
  if (!best) return null;
  return { name: deityNameOf(settlements, best.id), tier: best.tier, seats: best.seats };
}

/** Resolve a deity's display name from member settlements' snapshots, else humanize the id. */
function deityNameOf(settlements, deityId) {
  for (const sv of settlements || []) {
    const deity = sv?.settlement?.config?.primaryDeitySnapshot;
    if (!deity) continue;
    const ref = deity._deityRef || deity.primaryDeityRef || (deity.name ? `deity:${deity.name}` : null);
    if (String(ref) === String(deityId) && deity.name) return String(deity.name);
  }
  const tail = String(deityId).split(/[:_]/).filter(Boolean).pop() || String(deityId);
  return tail.charAt(0).toUpperCase() + tail.slice(1);
}

/**
 * Phase 4b — how many DISTINCT member settlements have a committed-but-not-yet-
 * propagated change waiting for the next Advance. Counted off the deferred
 * impacts' source settlement (each impact carries the settlement whose edit
 * produced it), mirroring the store's pendingPropagationCount selector so the
 * cue and the selector never disagree. Zero ⇒ the cue self-hides.
 * @param {any} worldState
 * @returns {number}
 */
export function pendingPropagationSettlements(worldState) {
  const deferred = worldState?.deferredImpacts;
  if (!Array.isArray(deferred) || deferred.length === 0) return 0;
  const sources = new Set();
  for (const impact of deferred) {
    const src = impact?.sourceSettlementId ?? impact?.originSettlementId ?? impact?.source ?? null;
    sources.add(src != null ? String(src) : `impact:${impact?.id}`);
  }
  return sources.size;
}

/** The in-world clock label from the worldState calendar + tick. */
function clockLabel(worldState) {
  const cal = worldState?.calendar || {};
  const season = SEASON_LABEL[String(cal.season || '').toLowerCase()] || '';
  const year = Number.isFinite(cal.year) ? cal.year : 1;
  const tick = Number.isFinite(worldState?.tick) ? worldState.tick : 0;
  const parts = [];
  if (season) parts.push(season);
  parts.push(`Year ${year}`);
  return { label: parts.join(' · '), tick };
}

/**
 * @param {{ campaign: any, settlements?: Array<any> }} props
 */
export default function RealmStrip({ campaign, settlements = [] }) {
  const worldState = campaign?.worldState || null;
  // Self-hide when the world is not canonized (dormant) — byte-identical today.
  if (!worldState?.canonizedAt) return null;

  const regionalGraph = campaign?.regionalGraph || worldState?.regionalGraph || null;
  const { label: clock, tick } = clockLabel(worldState);
  const siegeCount = liveSieges({ worldState, regionalGraph }).length;
  const faith = dominantFaith(campaign, settlements);

  // Wizard-News recency: how many ticks since the latest news entry.
  const news = campaign?.wizardNews || null;
  const latestEntryTick = Array.isArray(news?.entries) && news.entries.length > 0
    ? Math.max(...news.entries.map(e => Number(e?.tick) || 0))
    : null;
  const newsAge = latestEntryTick != null ? Math.max(0, (Number(news?.currentTick) || tick) - latestEntryTick) : null;

  // Phase 4b — committed member changes whose regional ripple awaits the Advance.
  const pendingPropagation = pendingPropagationSettlements(worldState);

  return (
    <div
      data-testid="realm-strip"
      style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '6px 12px',
        fontFamily: sans, fontSize: FS.xs, color: BODY,
      }}
    >
      <Seg title="In-world clock. One advance step is one month.">
        <strong style={{ color: GOLD_TXT, fontSize: FS.sm }}>{clock}</strong>
        <span style={{ color: BODY }}> · month {tick}</span>
      </Seg>

      <Seg title="Active sieges in the realm">
        <span style={{ color: siegeCount > 0 ? SIEGE_RED : BODY, fontWeight: siegeCount > 0 ? 700 : 400 }}>
          {siegeCount} {siegeCount === 1 ? 'siege' : 'sieges'}
        </span>
      </Seg>

      {faith && (
        <Seg title={`Dominant faith: ${faith.name} (${faith.tier})`}>
          <span style={{ color: VIOLET_DEEP, fontWeight: 700 }}>{faith.name}</span>
          <span style={{ color: BODY }}> · {faith.tier}</span>
        </Seg>
      )}

      {newsAge != null && (
        <Seg title="Wizard News recency">
          <span style={{ color: BODY }}>
            {newsAge === 0 ? 'News this month' : `News ${newsAge} month${newsAge === 1 ? '' : 's'} ago`}
          </span>
        </Seg>
      )}

      {pendingPropagation > 0 && (
        <Seg title="Committed member changes whose regional effects apply on the next Advance.">
          <span data-testid="pending-propagation-cue" style={{ color: GOLD_TXT, fontWeight: 700 }}>
            {pendingPropagation} settlement{pendingPropagation === 1 ? '' : 's'} waiting to propagate
          </span>
          <span style={{ color: BODY }}> – advance to apply</span>
        </Seg>
      )}
    </div>
  );
}

/** One labelled segment of the strip. */
function Seg({ children, title }) {
  return (
    <span title={title} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}
