/**
 * Explicit ownership map for the Herald command brief.
 *
 * The four task views are an information architecture over the established
 * Herald, not a replacement for its specialist readers and writers. This
 * inventory names where every retained body is reachable while the command
 * brief flag is enabled. Keeping the map executable lets rendered tests prove
 * parity without maintaining a second prose checklist.
 */

/**
 * @typedef {'briefing'|'stories'|'plans'|'decisions'} CommandView
 * @typedef {{
 *   id: string,
 *   owner: string,
 *   view: CommandView,
 *   topic: string|null,
 *   legacySection: string,
 *   access: 'inline'|'disclosure'|'nested_control',
 * }} HeraldSourceParityEntry
 */

/** @type {ReadonlyArray<Readonly<HeraldSourceParityEntry>>} */
export const HERALD_COMMAND_SOURCE_PARITY = Object.freeze([
  Object.freeze({
    id: 'realm_dashboard',
    owner: 'RealmDashboard',
    view: 'briefing',
    topic: null,
    legacySection: 'dashboard',
    access: 'disclosure',
  }),
  Object.freeze({
    id: 'wizard_news',
    owner: 'WizardNewsPanel',
    view: 'briefing',
    topic: null,
    legacySection: 'dashboard',
    access: 'nested_control',
  }),
  Object.freeze({
    id: 'war_specialists',
    owner: 'LiveWarStatus, RealmIntrigue, BeliefDivergenceBand, WarResolveSection',
    view: 'stories',
    topic: 'war',
    legacySection: 'war',
    access: 'inline',
  }),
  Object.freeze({
    id: 'faith_specialists',
    owner: 'PantheonPanel, AssignDeityFromMap',
    view: 'stories',
    topic: 'faith',
    legacySection: 'faith',
    access: 'inline',
  }),
  Object.freeze({
    id: 'trade_specialists',
    owner: 'TreatyPanel',
    view: 'stories',
    topic: 'trade',
    legacySection: 'trade',
    access: 'inline',
  }),
  Object.freeze({
    id: 'recorded_archive',
    owner: 'RealmItem archive and HeraldHeadline',
    view: 'stories',
    topic: null,
    legacySection: 'events',
    access: 'inline',
  }),
  Object.freeze({
    id: 'forecast',
    owner: 'HeraldForecast',
    view: 'plans',
    topic: null,
    legacySection: 'divination',
    access: 'inline',
  }),
  Object.freeze({
    id: 'docket',
    owner: 'RealmDocket and RealmForecast',
    view: 'plans',
    topic: null,
    legacySection: 'divination',
    access: 'inline',
  }),
  Object.freeze({
    id: 'adjudication',
    owner: 'HeraldAdjudication',
    view: 'decisions',
    topic: null,
    legacySection: 'adjudication',
    access: 'inline',
  }),
]);

/**
 * Return the retained specialist section for a Stories topic. Civic stories
 * already render through the complete RealmItem archive, so mounting the legacy
 * Events list as well would duplicate the same report cards.
 *
 * @param {unknown} topic
 * @returns {'war'|'faith'|'trade'|null}
 */
export function specialistSectionForStoryTopic(topic) {
  const id = String(topic || '');
  return id === 'war' || id === 'faith' || id === 'trade' ? id : null;
}
