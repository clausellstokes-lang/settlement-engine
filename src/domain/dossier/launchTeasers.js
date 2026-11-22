/**
 * domain/dossier/launchTeasers.js — WHICH WORLD TABS ARE STILL TEASERS.
 *
 * THE OWNER, 2026-11-01 (ODQ §934.103): the tabs that stand in the strip with an
 * "Available at launch" card and no live body — War, Rumors & News, Faith — keep
 * the World tail and wear a purple hue "just for distinction". The strip paints
 * the hue from these predicates; the tab bodies decide their own teaser the same
 * way they always did (RumorsTab's `view`, FaithTab's deity embed, WarTab's
 * `warTabHasContent`), so a tab reads purple exactly when opening it shows the
 * card.
 *
 * ⚠ THIS LEAF IS EAGER (OutputContainer reads it to paint the strip before any
 * tab chunk loads), so it imports NOTHING from the lazy tab modules. The rumor
 * and faith predicates are cheap facts of the store and the settlement record.
 * The war predicate lives on WarTab.jsx (`warTabHasContent`), which is lazy and
 * heavy; `warTeaserSync` answers the common case without it (no campaign owns
 * the settlement, so there is no war picture at all) and reports `null` where
 * only the full predicate can say, which the caller resolves through a dynamic
 * import after first paint.
 */

/**
 * @typedef {{ id?: string|number|null }} TeaserSettlement
 * @typedef {{ settlementIds?: Array<string|number>, worldState?: { spatialLedgers?: { rumorLedgers?: unknown } } }} TeaserCampaign
 */

/** @param {TeaserSettlement|null|undefined} settlement @param {string|number|null|undefined} saveId */
function sidOf(settlement, saveId) {
  if (saveId != null) return String(saveId);
  return settlement?.id != null ? String(settlement.id) : null;
}

/** @param {TeaserCampaign[]|null|undefined} campaigns @param {string|null} sid @returns {TeaserCampaign[]} */
function owningCampaigns(campaigns, sid) {
  if (!sid || !Array.isArray(campaigns)) return [];
  return campaigns.filter((c) => (c?.settlementIds || []).map(String).includes(sid));
}

/**
 * RumorsTab shows its launch card when no campaign that owns the settlement carries a
 * rumor ledger (RumorsTab :: `view` is null). Mirrors that test exactly.
 * @param {TeaserSettlement|null|undefined} settlement
 * @param {{ saveId?: string|number|null, campaigns?: TeaserCampaign[]|null }} [context]
 * @returns {boolean} true when the tab has a live body
 */
export function rumorsTabHasContent(settlement, { saveId = null, campaigns = [] } = {}) {
  const sid = sidOf(settlement, saveId);
  return owningCampaigns(campaigns, sid).some((c) => !!c?.worldState?.spatialLedgers?.rumorLedgers);
}

/**
 * FaithTab renders a live panel only over an embedded deity snapshot; every other
 * viewer who sees the tab sees the generic teaser (OutputContainer's `hasFaithTab`
 * and FaithTab's `faithWillRender`). Takes the embed VALUE, not the settlement: the
 * key it lives under is one the generator never writes (an owner's embed), so the
 * observed-shape instrument allows its read only where it is already banked
 * (OutputContainer), which reads it once and hands the value down.
 * @param {unknown} deityEmbed the settlement's `config.primaryDeitySnapshot`, as read by the caller
 * @returns {boolean} true when the tab has a live body
 */
export function faithTabHasContent(deityEmbed) {
  return !!deityEmbed && typeof deityEmbed === 'object';
}

/**
 * The war tab's teaser, decided WITHOUT the lazy war reader where that is honest:
 * a settlement no campaign owns has no war picture, so the tab is a teaser.
 * Where a campaign owns it, only WarTab :: warTabHasContent can answer, so this
 * returns null and the caller resolves it after first paint.
 * @param {TeaserSettlement|null|undefined} settlement
 * @param {{ saveId?: string|number|null, campaigns?: TeaserCampaign[]|null }} [context]
 * @returns {boolean|null} true = teaser, false = live, null = ask the full predicate
 */
export function warTeaserSync(settlement, { saveId = null, campaigns = [] } = {}) {
  const sid = sidOf(settlement, saveId);
  return owningCampaigns(campaigns, sid).length === 0 ? true : null;
}

/** The strip's tone word for a teaser tab (DossierTabStrip, MobileTabStrip). */
export const LAUNCH_TONE = 'launch';
