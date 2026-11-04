/**
 * recordBatteryFindings.js — the coherence battery over the STORED record, for the generation
 * receipt's `record_coherence_battery` judgment (lane SELF-VOUCH, 2026-11-04; SOAK-1000 R5).
 *
 * The battery (domain/coherence/coherenceBattery.js) asks whether a sentence says something
 * the record contradicts. The soak hands it rendered surfaces; the receipt runs at generation
 * time and has no render, so here it reads the strings the record itself stores. Pure: no
 * rng, no clock; the same record gives the same findings. Measured cost on 120 generations:
 * 8.9–9.3% of generation time (the chair's line is 10%).
 */
import { RECORD_BATTERY_CHECKS, recordBattery } from '../domain/coherence/recordBattery.js';

/** Keys whose strings are not the dossier's own words: the request, the receipt, the trace. */
const RECORD_TEXT_SKIPPED_KEYS = new Set([
  'config',
  'generationCoherenceReceipt',
  'simulationTrace',
]);
const BATTERY_QUOTE_MAX = 160;
// The receipt runs recordBattery.js's checks: every battery check but hook-truth-page,
// which reads the page's hook collector, not the record.
export { RECORD_BATTERY_CHECKS };

/**
 * The record's own words, as the battery's surfaces: every stored string that holds a space
 * (single tokens are ids and enum values, not prose), walked in key order. `all` is every
 * such string; `town` is only those that say "town", for the tier-noun instrument, whose
 * kept-span pass is costly over long text. Keys starting with '_' are bookkeeping.
 * @returns {{ all: string, town: string }}
 */
export function recordTextSurfaces(settlement) {
  const rest = [];
  const town = new Set();
  const seen = new Set();
  const walk = (value) => {
    if (typeof value === 'string') {
      if (!/\s/.test(value.trim())) return;
      if (/town/i.test(value)) town.add(value);
      else rest.push(value);
      return;
    }
    if (value == null || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      for (const entry of value) walk(entry);
      return;
    }
    for (const [key, entry] of Object.entries(value)) {
      if (key.startsWith('_') || RECORD_TEXT_SKIPPED_KEYS.has(key)) continue;
      walk(entry);
    }
  };
  walk(settlement);
  return { all: [...rest, ...town].join('\n'), town: [...town].join('\n') };
}

/**
 * The coherence battery's narrow entry (domain/coherence/recordBattery.js) over the record alone: its
 * record-level instruments and its word instruments read against the strings the record
 * stores — never a render. Every battery check is one of the root-cause kinds 1–5 and 8,
 * so every finding is a contradiction; the check label is the battery's own.
 */
export function recordBatteryFindings(settlement) {
  if (settlement == null || typeof settlement !== 'object') return [];
  const text = recordTextSurfaces(settlement);
  return [
    ...recordBattery(settlement, { record: text.all }, {
      only: RECORD_BATTERY_CHECKS.filter(check => check !== 'tier-noun'),
    }),
    ...recordBattery(settlement, { record: text.town }, { only: ['tier-noun'] }),
  ].map(entry => {
    const quote = String(entry.quote || '').replace(/\s+/g, ' ').trim();
    return Object.freeze({
      path: `battery.${entry.check}`,
      detail: entry.detail,
      ...(quote ? { evidence: quote.length > BATTERY_QUOTE_MAX ? `${quote.slice(0, BATTERY_QUOTE_MAX - 1)}…` : quote } : {}),
    });
  });
}

/**
 * The receipt's eighth formal judgment, `record_coherence_battery`, in the shape of the other
 * seven (generationReceiptJudgments.js :: judgment): 'needs_review' when the battery finds a
 * contradiction in the stored record, 'pass' otherwise. The page's self-vouching line
 * (DS-GEN-11's zero pool) is selected only on a 'pass'.
 */
export function recordBatteryJudgment(settlement) {
  const findings = Object.freeze(recordBatteryFindings(settlement));
  return Object.freeze({
    id: 'record_coherence_battery',
    label: 'The record does not contradict itself',
    status: findings.length ? 'needs_review' : 'pass',
    scope: 'single_settlement',
    summary: 'A stored sentence the record contradicts is a defect; the page may not vouch for a record this judgment does not pass.',
    findings,
    evidence: Object.freeze([Object.freeze({
      path: 'coherenceBattery',
      detail: `The coherence battery read the stored record (${RECORD_BATTERY_CHECKS.join(', ')}).`,
    })]),
  });
}
