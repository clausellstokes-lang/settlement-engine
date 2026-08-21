/**
 * heraldCommandSelectors.js — pure view selectors over the canonical RealmItem
 * read model.
 *
 * The domain model owns facts. These selectors own only the Herald's task:
 * narrowing those facts for a local edition, grouping them into the four command
 * views, and preserving deterministic presentation order. They never infer a new
 * cause, urgency, or permission.
 */

/**
 * The selectors consume only this deliberately small projection of RealmItem.
 * Unknown domain fields remain untouched; naming the fields read here keeps the
 * strict boundary meaningful without copying the full domain schema into UI.
 *
 * @typedef {{
 *   kind?: unknown,
 *   id?: unknown,
 * }} RealmEntityRef
 *
 * @typedef {{
 *   id?: unknown,
 *   presentationKey?: unknown,
 *   tick?: unknown,
 *   headline?: unknown,
 *   summary?: unknown,
 *   subjects?: ReadonlyArray<RealmEntityRef>,
 *   affectedEntities?: ReadonlyArray<RealmEntityRef>,
 *   source?: {
 *     classes?: ReadonlyArray<unknown>,
 *     primaryClass?: unknown,
 *   }|null,
 *   attention?: {
 *     significance?: unknown,
 *     class?: unknown,
 *   }|null,
 *   topic?: {
 *     primary?: unknown,
 *     tags?: ReadonlyArray<unknown>,
 *   }|null,
 *   epistemic?: {class?: unknown}|null,
 *   workflow?: {kind?: unknown}|null,
 *   temporal?: {phase?: unknown}|null,
 *   resolution?: {state?: unknown}|null,
 *   [key:string]: unknown,
 * }} RealmItem
 */

/** @type {Readonly<Record<string, string>>} */
const TOPIC_ALIASES = Object.freeze({
  war: 'war',
  faith: 'faith',
  trade: 'trade',
  events: 'events',
});

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value).trim();
}

/** @param {unknown} value @returns {number} */
function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** @param {RealmItem} item @returns {string[]} */
function settlementIdsOf(item) {
  const entities = [
    ...(Array.isArray(item.subjects) ? item.subjects : []),
    ...(Array.isArray(item.affectedEntities) ? item.affectedEntities : []),
  ];
  return [...new Set(entities
    .filter(entity => entity?.kind === 'settlement' && entity.id != null)
    .map(entity => String(entity.id)))];
}

const OPERATIONAL_SOURCES = Object.freeze(new Set([
  'live_stressor',
  'proposal',
  'paused_major',
  'docket_order',
]));

/** @param {RealmItem} item @returns {string[]} */
function sourceClassesOf(item) {
  const classes = item?.source?.classes;
  if (Array.isArray(classes)) return classes.map(text).filter(Boolean);
  const primary = text(item?.source?.primaryClass);
  return primary ? [primary] : [];
}

/**
 * The advance lens is a temporal window, not a historical delete. Operational
 * sources remain visible because they describe the realm NOW. Recorded pulse
 * and Wizard News sources narrow independently to each source family's latest
 * recorded tick, so a slower news feed is not erased by a newer pulse tick.
 *
 * Unknown source classes stay visible. The proof shell must degrade to more
 * evidence, never silently discard an adapter it does not yet recognize.
 *
 * @param {ReadonlyArray<RealmItem>} items
 * @param {'advance'|'campaign'} lens
 * @returns {RealmItem[]}
 */
export function itemsForTimeLens(items, lens = 'advance') {
  const source = Array.isArray(items) ? items : [];
  if (lens === 'campaign') return [...source];

  let latestPulseTick = null;
  let latestNewsTick = null;
  for (const item of source) {
    const classes = sourceClassesOf(item);
    const tick = Number(item?.tick);
    if (!Number.isFinite(tick)) continue;
    if (classes.some(sourceClass => sourceClass.startsWith('pulse_'))) {
      latestPulseTick = latestPulseTick == null ? tick : Math.max(latestPulseTick, tick);
    }
    if (classes.includes('wizard_news')) {
      latestNewsTick = latestNewsTick == null ? tick : Math.max(latestNewsTick, tick);
    }
  }

  return source.filter((item) => {
    const classes = sourceClassesOf(item);
    if (classes.length === 0 || classes.some(sourceClass => OPERATIONAL_SOURCES.has(sourceClass))) return true;
    if (classes.some(sourceClass => sourceClass.startsWith('pulse_'))) {
      return latestPulseTick == null || Number(item?.tick) === latestPulseTick;
    }
    if (classes.includes('wizard_news')) {
      return latestNewsTick == null || Number(item?.tick) === latestNewsTick;
    }
    return true;
  });
}

/** Named severity bands remain a presentation lens over significance evidence. */
/** @param {RealmItem} item */
export function realmItemSignificanceBand(item) {
  const significance = number(item?.attention?.significance);
  if (significance >= 0.72) return 'critical';
  if (significance >= 0.4) return 'strained';
  return 'routine';
}

/**
 * Apply the Herald strip's focus, structured search, attention, and significance
 * facets to RealmItems. Search is intentionally shallow: authored headline and
 * summary, typed topic tags, and resolved settlement names only.
 *
 * @param {ReadonlyArray<RealmItem>} items
 * @param {{
 *   focusId?: unknown,
 *   query?: unknown,
 *   attention?: boolean,
 *   band?: string|null,
 *   timeLens?: 'advance'|'campaign',
 *   nameById?: Map<string,string>,
 * }} [options]
 * @returns {RealmItem[]}
 */
export function filterRealmItems(items, options = {}) {
  const {
    focusId = null,
    query = '',
    attention = false,
    band = null,
    timeLens = 'advance',
    nameById = new Map(),
  } = options;
  const focus = focusId == null ? null : String(focusId);
  const needle = text(query).toLowerCase();

  return itemsForTimeLens(items, timeLens).filter((item) => {
    const settlementIds = settlementIdsOf(item);
    if (focus != null && !settlementIds.includes(focus)) return false;
    if (attention && item?.attention?.class === 'routine_record') return false;
    if (band && realmItemSignificanceBand(item) !== band) return false;
    if (!needle) return true;

    const topic = item?.topic || {};
    const haystack = [
      item?.headline,
      item?.summary,
      topic.primary,
      ...(Array.isArray(topic.tags) ? topic.tags : []),
      ...settlementIds.map(id => nameById.get(id)),
    ].map(text).filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(needle);
  });
}

/**
 * Briefing contains only evidence the model promoted above routine record.
 * Crucially, the selector does not reinterpret significance as urgency: the
 * model's typed attention class and reason travel together to the card.
 *
 * @param {ReadonlyArray<RealmItem>} items
 * @returns {RealmItem[]}
 */
export function briefingItems(items) {
  return (Array.isArray(items) ? items : [])
    .filter(item => item?.attention?.class && item.attention.class !== 'routine_record');
}

/**
 * Stories is the complete recorded archive, optionally narrowed by a legacy
 * topic alias.
 *
 * @param {ReadonlyArray<RealmItem>} items
 * @param {unknown} [topic]
 * @returns {RealmItem[]}
 */
export function storyItems(items, topic = null) {
  const wanted = topic == null ? null : TOPIC_ALIASES[String(topic)];
  return (Array.isArray(items) ? [...items] : [])
    .filter(item => item?.epistemic?.class === 'recorded_fact')
    .filter(item => !wanted || item?.topic?.primary === wanted)
    .sort((a, b) => {
      const tickDelta = number(b.tick) - number(a.tick);
      if (tickDelta) return tickDelta;
      const aKey = text(a.presentationKey || a.id);
      const bKey = text(b.presentationKey || b.id);
      return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
    });
}

/**
 * Plans owns staged orders and recorded emerging outlook, but not unresolved
 * decisions.
 *
 * @param {ReadonlyArray<RealmItem>} items
 * @returns {RealmItem[]}
 */
export function planItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => (
    item?.workflow?.kind === 'order'
    || item?.workflow?.kind === 'projection'
    || item?.temporal?.phase === 'emerging'
  ));
}

/**
 * Decisions is a resting inbox: unresolved proposal/verdict workflows only.
 *
 * @param {ReadonlyArray<RealmItem>} items
 * @returns {RealmItem[]}
 */
export function decisionItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => (
    ['proposal', 'verdict'].includes(item?.workflow?.kind)
    && item?.resolution?.state === 'unresolved'
  ));
}

/**
 * The Decisions view carries the unresolved inbox and its terminal history.
 * Counts still use `decisionItems`, so an applied/dismissed/refused case never
 * remains in the "awaiting your word" badge.
 *
 * @param {ReadonlyArray<RealmItem>} items
 * @returns {RealmItem[]}
 */
export function decisionCaseItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => (
    ['proposal', 'verdict'].includes(item?.workflow?.kind)
  ));
}

/**
 * Counts belong to task views, not editorial topics. The same RealmItem may
 * legitimately appear in Briefing and Decisions without becoming two events.
 */
/** @param {ReadonlyArray<RealmItem>} items */
export function commandViewCounts(items) {
  return Object.freeze({
    briefing: briefingItems(items).length,
    stories: storyItems(items).length,
    plans: planItems(items).length,
    decisions: decisionItems(items).length,
  });
}
