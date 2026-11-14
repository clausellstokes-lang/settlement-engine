import { resolveDeclared } from '../../domain/facts/drawDeclared.js';
import { HISTORY_SMALL_PLACE_WORDS } from '../../data/historyData.js';

/**
 * Project canonical water-route capabilities into history-safe vocabulary.
 *
 * `port` describes infrastructure and trade importance, not geography. WorldLaw
 * distinguishes an ocean port from an inland river port; history consumes this
 * projection so every template uses the same interpretation.
 */
export function deriveHistoryRouteContext(
  route,
  worldLaw,
  tradeCommodity,
  threat,
) {
  const maritimeSupported = worldLaw.supportsMaritime();
  const riverTradeSupported = worldLaw.supportsRiverTrade();
  const waterborne = maritimeSupported || riverTradeSupported;
  const disasterProfile = maritimeSupported
    ? 'coastal'
    : riverTradeSupported
      ? 'river'
      : tradeCommodity === 'timber'
        ? 'forest'
        : threat === 'plagued'
          ? 'monster'
          : 'general';

  return {
    maritimeSupported,
    riverTradeSupported,
    historyRouteType: maritimeSupported
      ? 'coastal'
      : riverTradeSupported
        ? 'river'
        : route === 'isolated'
          ? 'mountain'
          : 'overland',
    historyDestination: maritimeSupported
      ? 'distant maritime ports'
      : riverTradeSupported
        ? 'upriver markets and capitals'
        : 'the regional capital',
    disasterProfile,
    disasterQuarter: tradeCommodity === 'timber'
      ? 'the lumber yards and sawmill district'
      : waterborne
        ? (maritimeSupported
          ? 'the dockside warehouses'
          : 'the riverside wharves')
        : 'the merchants\' quarter', // COHERENCE-PRESUME (2026-11-11): the town may have no market
    disasterBuildingType: tradeCommodity === 'timber'
      ? 'timber stockpiles and workshop buildings'
      : waterborne
        ? (maritimeSupported
          ? 'ships, warehouses, and dock infrastructure'
          : 'barges, warehouses, and wharf infrastructure')
        : 'wooden buildings and merchant stalls',
    disasterLocation: maritimeSupported
      ? 'the harbour and coastal districts'
      : riverTradeSupported
        ? 'the riverside quarter'
        : disasterProfile === 'forest'
          ? 'the mill and lumber district'
          : 'the lower districts',
  };
}

/**
 * Select the challenge vocabulary that matches the actual water body.
 */
export function deriveHistoryChallengeRoute(route, worldLaw) {
  return (
    route === 'port'
    && worldLaw.supportsRiverTrade()
    && !worldLaw.supportsMaritime()
  )
    ? 'river'
    : route;
}

/**
 * W2-FIX-DATA-2 item 1 (the REVIEW-W2B cold list, rows 3, 7, 29): THE ROUTE'S PLACE WORD AT VILLAGE SIZE AND BELOW.
 * The route context's `disasterLocation` and `disasterQuarter` name districts and quarters; at village size or
 * smaller the place takes its water's small-place word (`historyData.js :: HISTORY_SMALL_PLACE_WORDS`), read
 * through the declared door against the history's facts. A town keeps its words. Draw-free.
 * @param {{ disasterProfile?: string } | null | undefined} context the history context
 * @param {object | (() => object) | null} facts the history's facts (`hookFacts`)
 * @returns {{ disasterLocation?: string, disasterQuarter?: string }}
 */
export function smallPlaceWordsOf(context, facts) {
  if (!context) return {};
  const row = HISTORY_SMALL_PLACE_WORDS[/** @type {'coastal'|'river'} */ (context.disasterProfile)] ?? HISTORY_SMALL_PLACE_WORDS.inland;
  const r = resolveDeclared(row, { facts, poolId: 'historyData:HISTORY_SMALL_PLACE_WORDS', surface: 'history', drawKind: 'T' });
  return r.resolvedBy === 'drawn' && typeof r.text === 'string' ? { disasterLocation: r.text, disasterQuarter: r.text } : {};
}
