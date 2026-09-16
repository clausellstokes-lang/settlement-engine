/**
 * Read model for flat trade-label ownership.
 *
 * A rendered row can be native-only, custom-only, or mixed when an active
 * custom category lands on a label the native economy already owns. Consumers
 * must not infer ownership from `customTradeLabels` alone: that would tint the
 * entire mixed row as custom and visually erase its native source.
 */

/** @param {unknown} value */
const normalize = value => String(value || '').trim().toLowerCase();

/**
 * @typedef {Record<string, unknown> & {
 *   customTradeEndpoints?:Partial<
 *     Record<'exports'|'imports', Array<{label?:unknown}>>
 *   >,
 *   nativeTradeLabels?:Partial<Record<'exports'|'imports', unknown[]>>,
 *   customTradeLabels?:Partial<Record<'exports'|'imports', unknown[]>>,
 *   customCategoryExports?:Record<string, string[]>,
 *   customCategoryImports?:Record<string, string[]>,
 *   tradeLabelSources?:{
 *     custom?:Partial<
 *       Record<'exports'|'imports', Array<{label?:unknown}>>
 *     >,
 *     native?:Partial<Record<'exports'|'imports', unknown[]>>,
 *   },
 * }} TradeOwnershipState
 */

/** @param {unknown} values @param {unknown} label */
function includesLabel(values, label) {
  const wanted = normalize(label);
  return Boolean(
    wanted
    && Array.isArray(values)
    && values.some(value => normalize(value) === wanted),
  );
}

/**
 * @param {TradeOwnershipState|null|undefined} economicState
 * @param {'exports'|'imports'} direction
 * @param {unknown} label
 * @returns {{
 *   custom:boolean,
 *   native:boolean,
 *   mixed:boolean,
 *   customOnly:boolean,
 *   members:string[],
 * }}
 */
export function tradeLabelOwnership(economicState, direction, label) {
  const economy = economicState || {};
  const customEndpoints = (
    economy.customTradeEndpoints
    || economy.tradeLabelSources?.custom
  );
  const nativeLabels = (
    economy.nativeTradeLabels
    || economy.tradeLabelSources?.native
  );
  const custom = (
    includesLabel(economy.customTradeLabels?.[direction], label)
    || (
      Array.isArray(customEndpoints?.[direction])
      && customEndpoints[direction].some(endpoint => (
        normalize(endpoint?.label) === normalize(label)
      ))
    )
  );
  const native = includesLabel(
    nativeLabels?.[direction],
    label,
  );
  const categoryMembers = direction === 'exports'
    ? economy.customCategoryExports
    : economy.customCategoryImports;
  const members = Array.isArray(categoryMembers?.[String(label)])
    ? categoryMembers[String(label)]
    : [];
  return {
    custom,
    native,
    mixed: custom && native,
    customOnly: custom && !native,
    members,
  };
}
