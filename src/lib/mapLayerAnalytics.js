/**
 * lib/mapLayerAnalytics.js — SM-5 (7) the MAP-LAYER telemetry helper.
 *
 * The reusable capture module for the town-map layer: ONE feature-discriminated
 * event (EVENTS.TOWN_MAP_LAYER_USED, the ai_stage_answer precedent — one name, not
 * eight) carrying BOTH the map-GENERATION profile and LEGIBILITY ENGAGEMENT. Best-
 * effort and never throws (the WorldMap `map_opened` precedent).
 *
 * PRIVACY: coarse enums / bands / booleans / counts ONLY — never a settlement name,
 * prose, coordinate, or marker label (the analytics props-hygiene lint bans those
 * keys anyway). Consent-tiering rides the seam automatically (essential class). The
 * engine emits NOTHING — this is fired from the UI layer (the lazy pane) alone.
 *
 * LAZY: imported only by the lazy SettlementMapPane, so it adds zero first-paint
 * bytes beyond the single new event-name string in the (eager) EVENTS registry. The
 * post-launch fog + interior layers reuse this helper with new `feature` values.
 */
import { track, EVENTS } from './analytics.js';

/** A 0..1 Lynch imageability score → a coarse band (never the raw number). */
function lynchBand(score) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return null;
  return score >= 0.8 ? 'high' : score >= 0.7 ? 'mid' : 'low';
}

/**
 * The GENERATION profile props for a town-map model. v1 renders report
 * layoutVersion:1 + nulls (v1 carries no site/morphology/response meta).
 * @param {{ layoutLawVersion?: number, meta?: Record<string, unknown> } | null | undefined} model
 * @returns {Record<string, unknown>}
 */
export function mapRenderProps(model) {
  const meta = model && typeof model === 'object' && model.meta && typeof model.meta === 'object' ? model.meta : {};
  const layoutVersion = model && Number(model.layoutLawVersion) === 2 ? 2 : 1;
  const v2 = layoutVersion === 2;
  return {
    feature: 'render',
    layoutVersion,
    siteKind: v2 && typeof meta.siteKind === 'string' ? meta.siteKind : null,
    morphology: v2 && typeof meta.morphology === 'string' ? meta.morphology : null,
    responseMode: v2 && typeof meta.responseMode === 'string' ? meta.responseMode : null,
    lynchBand: v2 ? lynchBand(typeof meta.lynchScore === 'number' ? meta.lynchScore : NaN) : null,
    retryCount: v2 && Number.isFinite(meta.retries) ? Number(meta.retries) : null,
    hasFabric: !!meta.hasFabric,
  };
}

/** Best-effort emit — never throws, never blocks the render. */
function emit(props) {
  try { track(EVENTS.TOWN_MAP_LAYER_USED, props); } catch { /* analytics is best-effort */ }
}

/** Fire the map-GENERATION profile (once per settlement render / v1→v2 redraw).
 *  @param {{ layoutLawVersion?: number, meta?: Record<string, unknown> } | null | undefined} model */
export function trackMapRender(model) {
  emit(mapRenderProps(model));
}

/** Fire a LEGIBILITY ENGAGEMENT signal. `feature` discriminates the moment; extra
 *  props must stay coarse (enums / counts / booleans).
 *  @param {string} feature @param {Record<string, unknown>} [props] */
export function trackMapFeature(feature, props = {}) {
  emit({ feature, ...props });
}
