/**
 * domain/coherence/faithDenialFindings.js — THE FAITH-DENIAL CHECK (lane FAITH, 2026-11-03).
 *
 * Root-cause failure 2 ("Faith denies its own church"): the Faith tab printed "keeps no named
 * faith" / "No single creed holds sway" beside the parish church, the religious faction, the
 * High Priest and the tithe generation wrote, on every generated settlement. This standalone
 * check reads a settlement and the text rendered for it, and returns one finding per denial
 * phrase that appears while the ONE FAITH READING finds church evidence: a church, access to
 * a neighbour's church, a religious faction, a senior cleric or a tithe. A place with none of
 * those may keep the quiet-observances line; it returns [] there.
 *
 * Pure; no rng; no mutation.
 */

import { faithHasChurchEvidence, faithReadingOf } from '../dossier/faithReading.js';

/**
 * The phrases that deny an organised faith: the old teaser, the old premium standing message,
 * DS-FTH-2's PRIVATE DOSSIER and PUBLIC / SHARED DOSSIER variants, and DS-WAR-3's dormant note.
 * @type {ReadonlyArray<RegExp>}
 */
export const FAITH_DENIALS = Object.freeze([
  /keeps no named faith/i,
  /no single creed holds sway/i,
  /there is no patron here/i,
  /nothing claims the \w+/i,
  /no faith holds the \w+/i,
  /none of them a creed['’]s/i,
  /rather than clergy/i,
  /nothing in .{1,60} speaks for a god/i,
  /no creed governs the calendar/i,
  /neither a war nor a creed/i,
  /keeps none\b/i,
]);

/**
 * @typedef {object} FaithDenialFinding
 * @property {'faith-denial'} code
 * @property {string} denial the phrase as it appeared in the text
 * @property {ReadonlyArray<string>} evidence what the reading found ("church", "access",
 *   "religious faction", "senior cleric", "tithe")
 */

/**
 * @param {import('../dossier/faithReading.js').FaithReadingSettlement|null|undefined} settlement
 * @param {string} renderedText the text rendered for the settlement (a tab, a chapter, a page)
 * @returns {FaithDenialFinding[]}
 */
export function faithDenialFindings(settlement, renderedText) {
  const reading = faithReadingOf(settlement);
  if (!faithHasChurchEvidence(reading)) return [];
  const evidence = Object.freeze([
    ...(reading.hasChurch ? ['church'] : []),
    ...(reading.accessOnly ? ['access'] : []),
    ...(reading.religiousFaction ? ['religious faction'] : []),
    ...(reading.seniorCleric ? ['senior cleric'] : []),
    ...(reading.tithe ? ['tithe'] : []),
  ]);
  const body = typeof renderedText === 'string' ? renderedText : '';
  /** @type {FaithDenialFinding[]} */
  const out = [];
  for (const re of FAITH_DENIALS) {
    const hit = body.match(re);
    if (hit) out.push({ code: 'faith-denial', denial: hit[0], evidence });
  }
  return out;
}
