/**
 * domain/people/stressPowerFaces.js — THE ONE READER of data/stressPowerFaces.js (COHERENCE-POWERS item 3): which row
 * of the table a power on the roster answers to, and the declared line the page prints where a power by its nature has
 * no single voice. Pure over the record; reads `stress` and the power's row, writes nothing (no new key).
 */
import { STRESS_POWER_FACES } from '../../data/stressPowerFaces.js';
import { nameOf } from '../rulingPower.js';
import { membersByRank } from './membership.js';

/** The roster's own landed powers (stressFactions.js's succession_void arm lifts exactly these), never a claimant. */
const LANDED_ROSTER = Object.freeze(['Noble Families', 'Noble Houses', 'Landed Gentry', 'Manor Household']);

/** @param {unknown} v @returns {Record<string, unknown>} */
const rec = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {});
/** A roster row's display name (rulingPower.js :: nameOf). @param {Record<string, unknown>} f @returns {string} */
const nameOfRow = (f) => nameOf(/** @type {import('../rulingPower.js').RulingFaction} */ (/** @type {unknown} */ (f)));

/**
 * The stress types the record carries (its `stress` entry or entries).
 * @param {unknown} settlement @returns {Set<string>}
 */
export function stressTypesOf(settlement) {
  const raw = rec(settlement).stress;
  const entries = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return new Set(entries.map((e) => String(rec(e).type || '')).filter(Boolean));
}

/**
 * The table's row for one power of the roster, or null: a row whose stress the town carries and whose power is this
 * one by name, or, for a pool-drawn claimant, by the `category` the stress step writes on it (stressFactions.js ::
 * pushPoolNamed) — not the roster's own, not a density rival, not the ruler.
 * @param {unknown} settlement @param {unknown} faction the power's roster row
 * @returns {import('../../data/stressPowerFaces.js').StressPowerFace | null}
 */
export function stressPowerRowOf(settlement, faction) {
  const f = rec(faction);
  const name = nameOfRow(f);
  if (!name || f.isGoverning === true) return null;
  const stresses = stressTypesOf(settlement);
  for (const row of STRESS_POWER_FACES) {
    if (!stresses.has(row.stress)) continue;
    if (row.power && row.power === name) return row;
    if (row.archetype && !LANDED_ROSTER.includes(name) && !f.contestsNiche
      && f.category === row.archetype) return row;
  }
  return null;
}

/**
 * The declared line the page prints in place of a power's people, where the power by its nature has no single voice
 * (the rule's step (b)); '' where the power has none. Where two or more powers of one row with a `pointer` have no one
 * on the page, the line prints once, under the stronger, and each other reads its pointer naming the stronger.
 * @param {unknown} settlement @param {string} power the power's display name
 * @returns {string}
 */
export function leaderlessLineOf(settlement, power) {
  const listed = rec(rec(settlement).powerStructure).factions;
  /** @type {unknown[]} */
  const factions = Array.isArray(listed) ? listed : [];
  const faction = factions.find((f) => nameOfRow(rec(f)) === power);
  const row = faction ? stressPowerRowOf(settlement, faction) : null;
  if (!row?.leaderless) return '';
  if (!row.pointer) return row.leaderless;
  // the line ONCE (the chair's ruling of 2026-11-12): among this row's powers with no one on the page, the stronger
  // (its power, then the roster's order) prints it; each other points at the stronger by name
  const listedNpcs = rec(settlement).npcs;
  const npcs = Array.isArray(listedNpcs) ? listedNpcs : [];
  const faceless = factions.filter((f) => stressPowerRowOf(settlement, f) === row && membersByRank(npcs, nameOfRow(rec(f))).length === 0);
  if (!faceless.includes(faction)) return row.leaderless;
  const stronger = faceless.reduce((best, f) => (Number(rec(f).power) > Number(rec(best).power) ? f : best));
  return stronger === faction ? row.leaderless : row.pointer.replace('{power}', nameOfRow(rec(stronger)));
}
