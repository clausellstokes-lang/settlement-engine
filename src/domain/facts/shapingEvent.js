/**
 * domain/facts/shapingEvent.js — THE EVENT THE RECORD CALLS THE ONE THAT SHAPED THE PLACE (BAR4-HISTORY, kind T1-SHAPE;
 * the chair's ruling SH1b of 2026-11-16, vetoable by the owner).
 *
 * The record's `history.historicalCharacter` (one writer: `narrativeText.js :: buildStressProfile`) may name ONE past event
 * as why the place looks as it does ("The <Event> is why this place looks as it does …", "Everything before the <Event> is
 * referred to as 'the old settlement'. What exists now was built after …", "The <Event> left the buildings standing and
 * changed everything else; the place was rebuilt afterwards …"). The general desk's history row (DS-GEN-16) reads this
 * home at render time, so that one page names one shaping event: a row that would claim the shape for ANOTHER event
 * yields its twin (`generalStateProse.js`). The record is not touched.
 *
 * Pure: no randomness, no clock.
 */

/** The character's lines that claim the shape, each with its event's name group. */
export const CHARACTER_SHAPING_CLAIMS = Object.freeze([
  /^The (?<ev>[A-Z][\w' -]+?) is why this place looks as it does/,
  /^Everything before the (?<ev>[A-Z][\w' -]+?) is referred to as 'the old settlement'\. What exists now was built after/,
  /^The (?<ev>[A-Z][\w' -]+?) left the buildings standing and changed everything else; the place was rebuilt afterwards/,
]);

/**
 * The event the record's character calls the one that shaped the place, in the desk's own word for it (lowercase, no
 * article: `generalStateProse.js :: calamityFill`'s form); null where the character claims no shape.
 * @param {unknown} historicalCharacter @returns {string|null}
 */
export function shapingEventOfCharacter(historicalCharacter) {
  const said = typeof historicalCharacter === 'string' ? historicalCharacter.trim() : '';
  for (const re of CHARACTER_SHAPING_CLAIMS) {
    const m = re.exec(said);
    if (m?.groups?.ev) return m.groups.ev.toLowerCase();
  }
  return null;
}

/**
 * The general desk's history pool key (DS-GEN-16), yielding to its `-MARKED` twin where the record's character names ANOTHER
 * event as the one that shaped the place: one shaping event a page. A key with no twin in the pools is kept (its words
 * claim no shape); so is every key where the character claims none, or claims it for this row's own event.
 * @param {string|null} key the desk's own key @param {string|undefined} calamity the row's event in the desk's word
 * (`generalStateProse.js :: calamityFill`) @param {unknown} historicalCharacter @param {Record<string, unknown>} pools
 * @returns {string|null}
 */
export function shapeYieldingKey(key, calamity, historicalCharacter, pools) {
  if (!key) return key;
  const shaping = shapingEventOfCharacter(historicalCharacter);
  return shaping && shaping !== calamity && pools[`${key}-MARKED`] ? `${key}-MARKED` : key;
}
