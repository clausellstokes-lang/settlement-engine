/**
 * heraldCommandNavigation.js — the reversible address adapter between the
 * Herald's established seven section IDs and the command brief's four task
 * views.
 *
 * The old IDs remain the public address language. Existing callers, saved
 * links, and `openInspectorAt(...)` therefore keep working while the flag is on.
 * The command brief changes only how those addresses are PRESENTED:
 *
 *   dashboard                         -> Briefing
 *   war / faith / trade / events      -> Stories, prefiltered by topic
 *   divination                        -> Plans
 *   adjudication                      -> Decisions
 *
 * Command-view IDs are accepted as defensive aliases for hand-authored links,
 * but navigation callbacks emit the established IDs until the migration has
 * proven full parity. Product handoffs use a second, closed adapter below: an
 * action names the user's intent, and this module chooses an established Herald
 * address without pretending that an external scene id is a RealmItem id.
 */

/** @typedef {'briefing'|'stories'|'plans'|'decisions'} CommandView */
/** @typedef {{view:CommandView, topic:string|null}} CommandLocation */
/** @typedef {'war'|'faith'|'trade'|'events'} StoryTopicId */
/** @typedef {'inspect-scene-provenance'} HeraldSceneAction */

/** @type {ReadonlyArray<CommandView>} */
export const COMMAND_VIEW_IDS = Object.freeze([
  'briefing',
  'stories',
  'plans',
  'decisions',
]);

/** @type {ReadonlyArray<Readonly<{id:StoryTopicId, label:string}>>} */
export const STORY_TOPICS = Object.freeze([
  { id: 'war', label: 'War' },
  { id: 'faith', label: 'Faith' },
  { id: 'trade', label: 'Trade' },
  { id: 'events', label: 'Civic' },
]);

/** Actions an external settlement portrait may ask the Herald to perform. */
export const HERALD_SCENE_ACTION_IDS = Object.freeze([
  'inspect-scene-provenance',
]);

/** @type {Readonly<Record<CommandView, 'dashboard'|'events'|'divination'|'adjudication'>>} */
const VIEW_ADDRESS = Object.freeze({
  briefing: 'dashboard',
  stories: 'events',
  plans: 'divination',
  decisions: 'adjudication',
});

/** @type {Readonly<Record<string, CommandLocation>>} */
const LEGACY_ROUTE = Object.freeze({
  dashboard: { view: 'briefing', topic: null },
  war: { view: 'stories', topic: 'war' },
  faith: { view: 'stories', topic: 'faith' },
  trade: { view: 'stories', topic: 'trade' },
  events: { view: 'stories', topic: 'events' },
  divination: { view: 'plans', topic: null },
  adjudication: { view: 'decisions', topic: null },
});

/**
 * A scene action deliberately maps to an established broad address, not a
 * fabricated story identity. The exact selected place and recorded causes ride
 * the campaign-scoped Herald session and render as their own context card.
 *
 * @type {Readonly<Record<HeraldSceneAction, Readonly<{
 *   action:HeraldSceneAction,
 *   section:'events',
 *   view:'stories',
 *   topic:'events',
 *   label:string,
 * }>>>}
 */
const SCENE_ACTION_DESTINATION = Object.freeze({
  'inspect-scene-provenance': Object.freeze({
    action: 'inspect-scene-provenance',
    section: 'events',
    view: 'stories',
    topic: 'events',
    label: 'Review recorded causes',
  }),
});

/**
 * Resolve either address vocabulary into one command-brief location.
 *
 * Unknown routes retain the Herald's historical dashboard fallback. The
 * returned object is frozen because callers may safely memoize or compare it.
 *
 * @param {unknown} section
 * @returns {Readonly<CommandLocation>}
 */
export function commandLocationOf(section) {
  const id = String(section || '');
  const legacy = LEGACY_ROUTE[id];
  if (legacy) return Object.freeze({ ...legacy });
  const commandView = COMMAND_VIEW_IDS.find(view => view === id);
  if (commandView) {
    return Object.freeze({ view: commandView, topic: null });
  }
  return Object.freeze({ ...LEGACY_ROUTE.dashboard });
}

/**
 * Return the stable legacy address emitted when a task-view tab is selected.
 *
 * @param {unknown} view
 * @returns {'dashboard'|'events'|'divination'|'adjudication'}
 */
export function legacyAddressForCommandView(view) {
  const commandView = COMMAND_VIEW_IDS.find(candidate => candidate === String(view));
  return commandView ? VIEW_ADDRESS[commandView] : VIEW_ADDRESS.briefing;
}

/**
 * A Stories topic is itself an established semantic address. Invalid topics
 * fall back to the broad Civic/events archive instead of inventing a new route.
 *
 * @param {unknown} topic
 * @returns {'war'|'faith'|'trade'|'events'}
 */
export function legacyAddressForStoryTopic(topic) {
  const id = String(topic || '');
  const match = STORY_TOPICS.find(entry => entry.id === id);
  return match?.id || 'events';
}

/**
 * Resolve a settlement-portrait action into a safe Herald destination.
 *
 * Unknown actions preserve the historical dashboard fallback and return a null
 * action so callers cannot accidentally persist an unsupported intent.
 *
 * @param {unknown} action
 * @returns {Readonly<{
 *   action:HeraldSceneAction|null,
 *   section:'dashboard'|'events',
 *   view:'briefing'|'stories',
 *   topic:null|'events',
 *   label:string,
 * }>}
 */
export function heraldDestinationForSceneAction(action) {
  const id = String(action || '');
  const destination = SCENE_ACTION_DESTINATION[
    /** @type {HeraldSceneAction} */ (id)
  ];
  if (destination) return Object.freeze({ ...destination });
  return Object.freeze({
    action: null,
    section: 'dashboard',
    view: 'briefing',
    topic: null,
    label: 'Open the Herald',
  });
}
