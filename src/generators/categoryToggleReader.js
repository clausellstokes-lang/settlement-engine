/**
 * categoryToggleReader.js — the single reader for institution-category toggles.
 *
 * [generators-pipeline-4] The wizard writes category disables keyed on the
 * DISPLAY tier (store resolveDisplayTier): an explicit tier writes
 * `${tier}::${cat}`, `random`/empty writes `all::${cat}`, `custom` writes
 * `${popTier}::${cat}`. Main assembly used to key off the RAW settType sentinel
 * (`random::cat` / `custom::cat`), which no writer ever produces, so disabling a
 * category in the wizard was dead for random/custom while faction pulls honoured
 * it — an internal contradiction. Checking settType, the rolled/resolved tier
 * (ctx.tier — equals the display tier for explicit and custom; `all::` covers
 * random), and `all` (plus the legacy `_` vocabulary) honours every write path.
 *
 * A disabled category returns false; everything else is default-open. Shared by
 * assembleInstitutions (main catalog roll) and factionCorrelation (faction-
 * weighted second-chance pass) so the two can never disagree.
 *
 * @param {Record<string, unknown>} categoryToggles
 * @param {string|undefined|null} settType   raw config.settType
 * @param {string|undefined|null} resolvedTier the rolled/actual tier (ctx.tier)
 * @param {string} cat
 * @returns {boolean}
 */
export function isCategoryEnabled(categoryToggles, settType, resolvedTier, cat) {
  const t = settType || 'all';
  const keys = [
    `${t}::${cat}`, `${t}_${cat}`,
    `${resolvedTier}::${cat}`, `${resolvedTier}_${cat}`,
    `all::${cat}`, `all_${cat}`,
  ];
  return keys.every((k) => categoryToggles[k] !== false);
}
