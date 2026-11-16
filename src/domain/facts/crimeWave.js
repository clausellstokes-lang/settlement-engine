/**
 * domain/facts/crimeWave.js — A CRIME WAVE STANDS (BAR6-DEFDESK, LAW 9's `9a.wave`, `9a.curfew`, `9a.contested`; BRIEF-BAR6 B6:
 * the `crime wave` atom's home, beneath `crime`, vetoable by the owner, on the veto list as new vocabulary).
 *
 * THE ONE READING, IMPORT-FREE: the history's live `crime_wave` tension (`history.currentTensions[].type`), the field
 * `display/foundationBandShown.js :: crimeWaveStands` and `facts/lawBand.js`'s private copy read. It lives here because the
 * fact vocabulary's homes (`factsOf.js`) sit in the eager engine core, and `foundationBandShown.js` reaches lazily pinned
 * modules (`tests/architecture/engineCoreLazyEdge.test.js`); proposed to the chair as the reading both should delegate to
 * (their files are BAR6-CRIME's). Every such tension carries the hook "The crime wave is coordinated" (`historyData.js`).
 *
 *   crimeWaveOf(record)   true where a live tension of the history is a crime wave
 *
 * Layer 4 (over the history, layer 3). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar6DefDeskGuards.test.js
 */

/**
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function crimeWaveOf(record) {
  const t = /** @type {{ history?: { currentTensions?: unknown } | null } | null} */ (record)?.history?.currentTensions;
  return (Array.isArray(t) ? t : t ? [t] : []).some((x) => !!x && typeof x === 'object' && /** @type {{ type?: unknown }} */ (x).type === 'crime_wave');
}
