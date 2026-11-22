/**
 * tests/generators/historyEventTitles.test.js
 *
 * Two chapter-title defects in the history layer:
 *   1. `infiltration_fear` and `occupation_legacy` both rendered the identical
 *      title 'The Occupation'. Besides being ambiguous on the page, the final
 *      history dedup pass (historyGenerator.js) keys on the rendered NAME, so a
 *      settlement that generated BOTH arcs silently lost one. `infiltration_fear`
 *      is now 'The Purge' (its actual paranoia/denunciation theme).
 *   2. `crime_wave` had no EVENT_TYPE_NAMES entry, so it fell through to the
 *      generic 'The Event' fallback. It now resolves to 'The Crime Wave'.
 *
 * Pins: all arc titles are unique, and every HISTORICAL_EVENTS_DATA type resolves
 * to a specific title (nothing falls to the generic fallback).
 */

import { describe, it, expect } from 'vitest';
import { EVENT_TYPE_NAMES, HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';

describe('history event titles', () => {
  it('every EVENT_TYPE_NAMES title is unique (no two arcs share a chapter title)', () => {
    const values = Object.values(EVENT_TYPE_NAMES);
    const dupes = values.filter((v, i) => values.indexOf(v) !== i);
    expect(dupes, `duplicate titles: ${[...new Set(dupes)].join(', ')}`).toEqual([]);
  });

  it('the two former-collision arcs now carry distinct, on-theme titles', () => {
    expect(EVENT_TYPE_NAMES.occupation_legacy).toBe('The Occupation');
    expect(EVENT_TYPE_NAMES.infiltration_fear).toBe('The Purge');
    expect(EVENT_TYPE_NAMES.infiltration_fear).not.toBe(EVENT_TYPE_NAMES.occupation_legacy);
  });

  it('crime_wave resolves to a specific title, not the generic fallback', () => {
    expect(EVENT_TYPE_NAMES.crime_wave).toBe('The Crime Wave');
    expect(EVENT_TYPE_NAMES.crime_wave).not.toBe('The Event');
  });

  it('every historical event type has a specific title (none falls to "The Event")', () => {
    const missing = HISTORICAL_EVENTS_DATA
      .map((e) => e.type)
      .filter((t) => !EVENT_TYPE_NAMES[t]);
    expect(missing, `types with no title mapping: ${missing.join(', ')}`).toEqual([]);
  });
});
