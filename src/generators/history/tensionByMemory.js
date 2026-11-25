/**
 * tensionByMemory.js — a selected tension's words follow what the timeline holds of its own event
 * (URBAN-FIX D-1 and D-1b; TAIL-HISTORY Y13). Moved VERBATIM out of `historyGenerator.js` by lane KINDS-1,
 * unit K1 (2026-11-20, the chair's ruling of 21:41 UTC), to make room under that file's shrink-only size
 * ceiling for the trouble law's one import: a tension-side helper of `buildHistoricalEvent`, self-contained
 * (its one read is `HISTORICAL_EVENTS_DATA`), called once from that function's return. Draw-free: no stream
 * moves, and every birth is byte-identical (the K1 dark control).
 */
import { HISTORICAL_EVENTS_DATA } from '../../data/historyData.js';

// ─── URBAN-FIX D-1: a tension's words follow what the timeline holds of its own event ────────
// (the chair's urban ruling D, 2026-11-09; URBAN-AUDIT §4). The tension and the timeline are drawn
// independently from one table, so a tension's "source" is the timeline event of its own template
// (`templateType`, the reader battery's own identity, readerBattery.js :: tensionMemoryFindings).
// At the file's end on purpose, beside the SIZE helpers: nothing is inserted above the producer
// writes the prose wiring census cites by line. Draw-free: no stream moves.

/**
 * A selected tension template with its memory table taken off (the table is the template's, never
 * the record's) and, where the template carries one, the DATED words in place of its own: its own
 * event sits on the timeline older than 80 years, so no living participant is named. URBAN-FIX D-1b:
 * where the timeline holds NO event of its template, the UNANCHORED words, which name no past event.
 * @param {any} tmpl a selected template copy
 * @param {ReadonlyArray<any>} timeline the history's events, built before the tensions
 * @returns {any}
 */
export function tensionByMemory(tmpl, timeline) {
  const { byMemory, ...tension } = tmpl;
  if (!byMemory) return tension;
  const own = (Array.isArray(timeline) ? timeline : []).find((e) => e?.templateType === tension.type);
  // 80: the page's Ancient boundary (HistoryTab.jsx :: recencyLabel, up to 80 years is "Last century"), the
  // same line generateEventNarrative draws for the hooks of living memory
  const words = !own ? byMemory.unanchored : Number(own.yearsAgo) > 80 ? byMemory.dated : null;
  if (!words) return tension;
  // TAIL-HISTORY Y13: the memory words replace the TEMPLATE's own description only; a description the selection wrote
  // for this town (the scarcity's lead and its top issue, the record's own evidence in the present) is kept
  const { description, ...rest } = words;
  const ownWords = HISTORICAL_EVENTS_DATA.find((e) => e.type === tension.type)?.description;
  return { ...tension, ...rest, ...(description && tension.description === ownWords ? { description } : {}) };
}
