/**
 * domain/facts/legacyRuin.js — THE BLOW THE RECORD'S LEGACY NAMES DESTROYED SOMETHING (BAR6-CULTURE, LAW 10 rule
 * 10g-legacy; BRIEF-BAR6 §BAR6-CULTURE fact (c); vetoable by the owner, on the veto list as new vocabulary).
 *
 * The general desk's history row (DS-GEN-16 `LEGACY-RECOVERED`) names the event of the record's top legacy annotation
 * (`history.legacyAnnotations[0].eventName`, `generalStateProse.js :: legacyPoolKey`) and one of its lines says "Much of
 * what stands in <town> now was built after the <event>". That presumes the event pulled something down: a fire, a flood,
 * a sickness that emptied the houses, a siege or a raid (the timeline's `disaster` events), or a past occupation. A
 * quarrel about wealth, a succession or a purge destroyed nothing (C55011: "built after the economic divide" in a city
 * 192 years old). This leaf reads the SAME event the line names, by its name on `history.historicalEvents[]`, and says
 * whether its kind is one that destroys.
 *
 * Pure: no randomness, no clock.
 */

/** The timeline's event kinds that pull a place down (`historicalEvents[].type` / `templateType`). */
export const RUINOUS_EVENT_TYPES = Object.freeze(['disaster']);
export const RUINOUS_TEMPLATE_TYPES = Object.freeze(['great_fire', 'great_flood', 'plague_years', 'external_threat', 'occupation_legacy']);

/** @param {unknown} name @returns {string} the event's name, lower-cased, its article stripped */
const nameKey = (name) => String(name ?? '').trim().toLowerCase().replace(/^the\s+/, '');

/**
 * Did the event the record's top legacy annotation names destroy something? Undefined where the record carries no
 * history (unanswered); false where there is no legacy, or its event is not on the timeline.
 * @param {unknown} record the settlement record
 * @returns {boolean|undefined}
 */
export function legacyRuinOf(record) {
  const history = /** @type {{ history?: { legacyAnnotations?: unknown, historicalEvents?: unknown } | null } | null | undefined} */ (record)?.history;
  if (!history || typeof history !== 'object') return undefined;
  const top = Array.isArray(history.legacyAnnotations) ? history.legacyAnnotations[0] : null;
  const named = nameKey(/** @type {{ eventName?: unknown } | null} */ (top)?.eventName);
  if (!named) return false;
  const events = Array.isArray(history.historicalEvents) ? history.historicalEvents : [];
  return events.some((e) => nameKey(e?.name) === named
    && (RUINOUS_EVENT_TYPES.includes(String(e?.type ?? '')) || RUINOUS_TEMPLATE_TYPES.includes(String(e?.templateType ?? ''))));
}
