/**
 * domain/worldPulse/stressorAftermath.js — aftermath is RECORDED, three ways.
 *
 * The echo ladder is: active → resolved (echo, status 'residual', decaying
 * memoryStrength) → graduated (dropped from worldState.stressors). This
 * module makes the transitions leave records the table can actually find:
 *
 *   1. CHRONICLE — resolution and graduation each emit a Wizard-News entry
 *      (the feed the dossier Chronicle and the AI grounding already read).
 *   2. HISTORY — a graduated echo appends a compact campaign-era event to
 *      settlement.history.historicalEvents, the permanent record
 *      historyBeats derives "defining crisis" / "recent disruption" from.
 *      Until now that record was frozen at generation — campaign events
 *      could never become history.
 *   3. ORIGIN SYNC (Wave 8 #4) — an ORGANIC resolution winds down the
 *      origin settlement's local crisis representations through the crisis
 *      lifecycle (withOrganicStressorResolution below), so the dossier
 *      stops showing a stressor the world already ended.
 *
 * Pure + deterministic; timestamps are threaded in, never minted.
 */

import { resolveCrisisLocally } from '../crisisLifecycle.js';

// Stressor type -> the history event-type vocabulary the generators already
// use (historyData EVENT_TYPE_NAMES). Unmapped types fall back to
// external_threat, which renders sensibly for anything crisis-shaped.
const HISTORY_EVENT_TYPE = Object.freeze({
  siege: 'external_threat',
  wartime: 'external_threat',
  monster_raider_pressure: 'external_threat',
  occupation: 'occupation_legacy',
  famine: 'resource_scarcity',
  indebtedness: 'outside_debt',
  market_shock: 'outside_debt',
  criminal_corridor: 'crime_wave',
  infiltration: 'infiltration_fear',
  betrayal: 'corruption_scandal',
  political_fracture: 'succession_crisis',
  succession_void: 'leadership_vacuum',
  coup_detat: 'succession_crisis',
  insurgency: 'guild_conflict',
  rebellion: 'guild_conflict',
  slave_revolt: 'population_friction',
  mass_migration: 'population_friction',
  religious_conversion_fracture: 'religious_tension',
  magical_instability: 'magical_controversy',
  magic_deadzone: 'magical_controversy',
  disease_outbreak: 'population_friction',
});

const MAX_CAMPAIGN_HISTORY_EVENTS = 20;

function severityWord(peak) {
  if (peak >= 0.85) return 'catastrophic';
  if (peak >= 0.6) return 'major';
  if (peak >= 0.35) return 'moderate';
  return 'minor';
}

function residualText(stressor) {
  return (stressor.residualEffects || []).slice(0, 3).join(', ').replace(/_/g, ' ');
}

// History consumers (HistoryTab, pdf HistoryFounding, historyBeats) expect
// lastingEffects as a STRING ARRAY — generator-era events all use arrays, and
// the renderers call .join/.map on it. A bare string would pass their
// `?.length > 0` guards and crash the render.
function residualList(stressor) {
  return (stressor.residualEffects || []).slice(0, 3).map(s => String(s).replace(/_/g, ' '));
}

/** Wizard-News entries for stressors that resolved this tick. */
export function aftermathNewsEntries(resolved = [], tick = 0, now = null) {
  return resolved.map(stressor => ({
    id: `wizard_news.${tick}.aftermath.${stressor.id}`,
    tick,
    scope: (stressor.affectedSettlementIds || []).length >= 3 ? 'realm' : 'regional',
    significance: (stressor.peakSeverity ?? stressor.severity ?? 0) >= 0.6 ? 'major' : 'notable',
    score: 50 + Math.round((stressor.peakSeverity ?? 0) * 30),
    headline: `${stressor.label} has passed`,
    summary: `${stressor.label} is over, but it leaves ${residualText(stressor) || 'scars'} — and it will be remembered for a while yet.`,
    kind: 'applied',
    impactKind: 'stressor_aftermath',
    channelType: null,
    severity: stressor.peakSeverity ?? stressor.severity ?? 0,
    settlementIds: stressor.affectedSettlementIds || [],
    impactIds: [],
    channelIds: [],
    sourceEventId: stressor.id,
    tags: ['world_pulse', 'stressor', 'aftermath', stressor.type],
    reasons: [
      stressor.resolutionReason || 'The crisis ran its course.',
      `Echo begins: still in living memory until it fades.`,
    ],
    createdAt: now,
  }));
}

/** Wizard-News entries for echoes that faded into history this tick. */
export function graduationNewsEntries(graduated = [], tick = 0, now = null) {
  return graduated.map(stressor => ({
    id: `wizard_news.${tick}.history.${stressor.id}`,
    tick,
    scope: 'settlement',
    significance: 'notable',
    score: 32,
    headline: `${stressor.label} passes into history`,
    summary: `No one speaks of ${stressor.label.toLowerCase()} in the present tense anymore; it belongs to the settlement's story now.`,
    kind: 'applied',
    impactKind: 'stressor_graduated',
    channelType: null,
    severity: stressor.peakSeverity ?? 0,
    settlementIds: stressor.affectedSettlementIds || [],
    impactIds: [],
    channelIds: [],
    sourceEventId: stressor.id,
    tags: ['world_pulse', 'stressor', 'history', stressor.type],
    reasons: ['The echo faded below living memory and was recorded as history.'],
    createdAt: now,
  }));
}

/**
 * Append a campaign-era historical event for a graduated echo. Campaign-era
 * entries carry `campaignEra: true` + the tick, use `yearsAgo: 0` (they are
 * the settlement's present-day past), and are capped so a long campaign
 * can't balloon the record. Idempotent per echo id.
 *
 * @param {Object} settlement
 * @param {Object} echo        the graduated stressor record
 * @param {number} tick
 * @returns {Object} new settlement (same reference when nothing changed)
 */
export function withCampaignHistoryEvent(settlement, echo, tick) {
  if (!settlement || !echo) return settlement;
  const history = settlement.history || {};
  const events = Array.isArray(history.historicalEvents) ? history.historicalEvents : [];
  const eventId = `campaign.${echo.id}.${echo.resolvedAt || tick}`;
  if (events.some(e => e?.campaignEventId === eventId)) return settlement;

  const peak = echo.peakSeverity ?? echo.severity ?? 0.3;
  const event = {
    campaignEventId: eventId,
    campaignEra: true,
    tick,
    yearsAgo: 0,
    name: echo.label,
    type: HISTORY_EVENT_TYPE[echo.type] || 'external_threat',
    description: `${echo.label} gripped the settlement during the campaign and has passed into memory${residualText(echo) ? ` — ${residualText(echo)} linger` : ''}.`,
    severity: severityWord(peak),
    lastingEffects: residualList(echo),
    plotHooks: [],
    anchored: true,
  };

  const campaignEvents = events.filter(e => e?.campaignEra);
  let nextEvents = [...events, event];
  if (campaignEvents.length + 1 > MAX_CAMPAIGN_HISTORY_EVENTS) {
    // Drop the OLDEST campaign-era entry (generation history is never pruned).
    const oldest = campaignEvents
      .slice()
      .sort((a, b) => (a.tick ?? 0) - (b.tick ?? 0))[0];
    nextEvents = nextEvents.filter(e => e !== oldest);
  }
  return { ...settlement, history: { ...history, historicalEvents: nextEvents } };
}

/**
 * Settlement-side wind-down for roaming stressors the pulse resolved
 * ORGANICALLY (decay, counterforces, a coup verdict) — the resolution
 * asymmetry the D-wave deferred as an owner decision, now decided: SYNC IT.
 * The roaming twin used to resolve while the origin settlement's stress
 * entry raged on and its promoted condition never eased; this routes the
 * SAME settlement half the RESOLVE_STRESSOR event uses
 * (crisisLifecycle.resolveCrisisLocally: entry removed, condition eased
 * with a world_pulse receipt, stressorEdits suppression recorded) onto the
 * ORIGIN settlement of each resolved twin. Spread targets carry no local
 * entry — their scars arrive through the residual proposals instead.
 * Deterministic; identity no-op when nothing local matches (the common case
 * for pulse-born crises).
 *
 * @param {Object} settlement          a settlementUpdates settlement
 * @param {Array}  resolvedStressors   the pulse result's resolved twins
 * @param {string|number} saveId       the settlement's save id
 * @returns {Object} new settlement (same reference when untouched)
 */
export function withOrganicStressorResolution(settlement, resolvedStressors = [], saveId) {
  let next = settlement;
  for (const twin of resolvedStressors) {
    if (String(twin?.originSettlementId || '') !== String(saveId)) continue;
    next = resolveCrisisLocally(next, twin);
  }
  return next;
}

/**
 * Apply graduation history to every affected settlement in a local map
 * (advanceCampaignWorld's settlement working set). Mutates the Map values
 * immutably; returns the count of settlements written.
 */
export function recordGraduationsIntoHistory(localSettlements, graduated = [], tick = 0) {
  let written = 0;
  for (const echo of graduated) {
    for (const sid of echo.affectedSettlementIds || []) {
      const key = String(sid);
      const settlement = localSettlements.get(key);
      if (!settlement) continue;
      const next = withCampaignHistoryEvent(settlement, echo, tick);
      if (next !== settlement) {
        localSettlements.set(key, next);
        written += 1;
      }
    }
  }
  return written;
}
