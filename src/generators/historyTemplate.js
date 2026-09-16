/**
 * historyTemplate.js
 *
 * Draw-free rendering utilities shared by historical timelines and current
 * tensions. Keeping template totality separate from event selection prevents
 * prose fixes from changing seeded RNG order.
 */

/**
 * Replace every occurrence of every supplied history token.
 *
 * Several authored descriptions legitimately use the same token more than
 * once. String.replace only resolves the first occurrence, so this helper makes
 * total substitution an explicit contract.
 */
export const renderHistoryTemplate = (template, tokens = {}) =>
  Object.entries(tokens).reduce(
    (rendered, [token, value]) => rendered.split(token).join(String(value)),
    String(template || ''),
  );

/**
 * Build the complete token vocabulary used by current-tension templates.
 * Current tensions draw from the whole catalog, unlike category-specific
 * timeline events, so they need one total and settlement-grounded vocabulary.
 */
export const buildCurrentTensionTokens = (context = {}) => {
  const route = context.tradeRouteAccess || 'road';
  const commodity =
    context.tradeCommodity ||
    context.primaryExports?.[0] ||
    'trade goods';
  const incomeSources = (context.incomeSources || []).map(source =>
    String(source || '').toLowerCase()
  );
  const dominantFaction = String(context.dominantFaction || '').toLowerCase();

  const routeType = context.historyRouteType || {
    port: 'coastal',
    river: 'river',
    crossroads: 'overland',
    road: 'overland',
    isolated: 'remote overland',
    mountain_pass: 'mountain',
  }[route] || 'overland';

  const location = context.disasterLocation || {
    port: 'the harbour district',
    river: 'the riverside quarter',
    crossroads: 'the market quarter',
    isolated: 'the lower district',
    mountain_pass: 'the lower district',
  }[route] || 'the lower district';

  const quarter = context.disasterQuarter || {
    port: 'the dock quarter',
    river: 'the riverside quarter',
    crossroads: 'the market quarter',
    isolated: 'the old quarter',
    mountain_pass: 'the old quarter',
  }[route] || 'the market quarter';

  const buildingType = context.disasterBuildingType || (
    route === 'port'
      ? 'ships, warehouses, and dock buildings'
      : route === 'river'
        ? 'mills, storehouses, and timber buildings'
        : 'wooden buildings and merchant stalls'
  );

  const demands = incomeSources.some(source => source.includes('guild'))
    ? 'guild recognition and fair wages'
    : incomeSources.some(source => source.includes('port') || source.includes('dock'))
      ? 'docking rights and fair tariffs'
      : 'better working conditions';

  const method = dominantFaction.includes('merchant')
    ? 'economic pressure'
    : dominantFaction.includes('military') || dominantFaction.includes('garrison')
      ? 'armed coercion'
      : dominantFaction.includes('guild')
        ? 'guild coalition'
        : 'legal maneuvering';

  return {
    '{resource}': String(commodity).toLowerCase(),
    '{route_type}': routeType,
    '{location}': location,
    '{building_type}': buildingType,
    '{duration}': 'three',
    '{demands}': demands,
    '{method}': method,
    '{quarter}': quarter,
  };
};
