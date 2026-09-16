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
        : 'the market quarter',
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
