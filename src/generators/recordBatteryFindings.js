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
import { RECORD_BATTERY_CHECKS, recordBattery } from '../domain/coherence/recordBattery.js'; import { foodwaysLineOf } from '../domain/foodways.js'; // URBAN-FIX C-1: one line

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
  // URBAN-FIX C-1: the path `culturalIdentity.foodways` is SUPERSEDED where the food record carries its line
  // (the line the page prints; a record stored before the one-home cure kept the culture's raw sentence there).
  const superseded = foodwaysLineOf(settlement) ? settlement.culturalIdentity : null;
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
      if (key.startsWith('_') || RECORD_TEXT_SKIPPED_KEYS.has(key) || (key === 'foodways' && value === superseded)) continue;
      walk(entry);
    }
  };
  walk(settlement);
  return { all: [...rest, ...town].join('\n'), town: [...town].join('\n') };
}

/**
 * A placeholder faction name ("Claimant Bloc A", "Rival Faction B", "Unknown Faction"), the soak's A-10
 * reading; and the stand-in the owner's rename map gave them all (SW-8 RENAME-POWERS, 2026-11-09):
 * "Unnamed power" (with or without a trailing number). The old spellings stay matched for saved towns.
 */
const PLACEHOLDER_FACTION = /\b(?:Bloc|Faction) [A-Z]\b|Unknown Faction|^Unnamed power(?: \d+)?$/;
/** A role standing where a name should be ("The Guildmaster"), the soak's A-10 reading. */
const ROLE_ONLY_NAME = /^The [A-Z]/;

/**
 * KIND 7, THE UNNAMED (the chair's ruling I5, 2026-11-04, withdrawing the earlier exclusion): a
 * placeholder faction or a role-only person is a contradiction the page must not vouch against.
 * At most one finding of each, in the battery's entry shape.
 * @param {any} settlement
 * @returns {Array<{ check: string, quote: string, detail: string }>}
 */
function unnamedFindings(settlement) {
  const out = [];
  const person = (Array.isArray(settlement.npcs) ? settlement.npcs : [])
    .find(npc => ROLE_ONLY_NAME.test(String(npc?.name || '')));
  if (person) out.push({ check: 'unnamed', quote: String(person.name), detail: `a role-only person (${String(person.role || '')})` });
  // The powers only (PEOPLE-5A: the NPC grouping's check dropped): a `powerStructure.factions[]`
  // record's display name is `.faction`, with `.name` its legacy alias (rulingPower.js :: nameOf).
  const factions = [
    ...(Array.isArray(settlement.powerStructure?.factions) ? settlement.powerStructure.factions : [])
      .map(f => String(f?.faction ?? f?.name ?? '')),
  ];
  const placeholder = factions.find(name => PLACEHOLDER_FACTION.test(name));
  if (placeholder) out.push({ check: 'unnamed', quote: placeholder, detail: 'a placeholder faction' });
  return out;
}

/**
 * The coherence battery's narrow entry (domain/coherence/recordBattery.js) over the record alone: its
 * record-level instruments and its word instruments read against the strings the record
 * stores — never a render. Every battery check is one of the root-cause kinds 1–5 and 8, and
 * `unnamed` is kind 7 (I5), so every finding is a contradiction; the check label is the battery's own.
 */
export function recordBatteryFindings(settlement) {
  if (settlement == null || typeof settlement !== 'object') return [];
  const text = recordTextSurfaces(settlement);
  return [
    ...recordBattery(settlement, { record: text.all }, {
      only: RECORD_BATTERY_CHECKS.filter(check => check !== 'tier-noun'),
    }),
    ...recordBattery(settlement, { record: text.town }, { only: ['tier-noun'] }),
    ...unnamedFindings(settlement),
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
    label: 'The dossier\'s lines agree with each other',
    status: findings.length ? 'needs_review' : 'pass',
    scope: 'single_settlement',
    summary: 'Where one line in this dossier disagrees with another, check both before play; the dossier does not vouch for itself until they agree.',
    findings,
    evidence: Object.freeze([Object.freeze({
      path: 'coherenceBattery',
      detail: `The coherence battery read the stored record (${RECORD_BATTERY_CHECKS.join(', ')}).`,
    })]),
  });
}
