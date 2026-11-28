/**
 * domain/dossier/storedHookShown.js — A HOOK STORED AT BIRTH, AS PRINTED (SURVEY S-A, print site 2; the chair's ruling S-A-1).
 *
 * Two kinds of hook are drawn at birth from a declared pool and stored as text while the record is still being made:
 * a historical event's hooks (`historyData.js :: HISTORICAL_EVENTS_DATA[type].plotHooks`, drawn in the narratives step,
 * where a guild power still stands that the close renames away: `power/factionLabelClose.js`), and a person's loyalty
 * hook (`npcData.js :: NPC_FACTION_LOYALTY`, drawn in the population step). Where the collector prints them
 * (`plotHooks.js :: collectPlotHooks`: the Plot Hooks tab, the PDF, the Tonight sheet, the session sheet), each is
 * re-answered on the FINAL record by the door's own rule (`facts/lineOnFinal.js`): admitted, as stored; refused, its
 * twin, else the next admitted line of its own pool (never one the card or the town already carries), else nothing.
 * A hook no pool holds (a DM's own words, a line from another pool) prints as written. No birth moves.
 *
 * THE GATE IS INJECTED (S-A-2): `storedHookGate(record)` is handed to the collector by the screen's callers
 * (`collectPlotHooksShown`), and `display/printRecord.js` applies it once on the caller's thread for the PDF, the
 * Foundry module and the campaign book, so the worker carries no table. THE SHARED PAGE: the guild and the roster are
 * what a DM can hide, so a reader's page passes no gate and every stored hook prints AS STORED.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/dossier/storedHookShown.test.js
 */
import { HISTORICAL_EVENTS_DATA } from '../../data/historyData.js';
import { NPC_FACTION_LOYALTY } from '../../data/npcData.js';
import { lineText } from '../facts/drawDeclared.js';
import { lineOnFinal } from '../facts/lineOnFinal.js';
import { factsOf } from '../facts/factsOf.js';
import { plotHookText } from '../../lib/proseSeams.js';
import { collectPlotHooks } from './plotHooks.js';

/** each event template's hook pool, by the template's type (a stored event's own `type` is its category, not this key) */
const EVENT_POOLS = HISTORICAL_EVENTS_DATA.filter((d) => Array.isArray(d.plotHooks) && d.plotHooks.length).map((d) => ({ type: d.type, pool: d.plotHooks }));

/** the loyalty pools, each a category's own */
const LOYALTY_POOLS = Object.values(NPC_FACTION_LOYALTY).filter(Array.isArray);

/** @param {unknown} settlement @returns {string} the town's identity for the door's hash (no roll) */
const keyOf = (settlement) => {
  const s = /** @type {{ _seed?: unknown, id?: unknown, name?: unknown } | null} */ (settlement && typeof settlement === 'object' ? settlement : null);
  return String(s?._seed ?? s?.id ?? s?.name ?? '');
};

/**
 * @param {string} text the stored hook @param {unknown} type the stored event's type (its own template first, else the pool that holds the text)
 * @param {unknown} settlement the final record
 * @param {object | (() => object)} facts the final record's facts (`factsOf`) @param {ReadonlySet<string>} held the hooks the town already prints
 * @returns {string | null}
 */
export function eventHookShown(text, type, settlement, facts, held) {
  const home = EVENT_POOLS.find((h) => h.type === type && h.pool.some((l) => lineText(l) === text))
    ?? EVENT_POOLS.find((h) => h.pool.some((l) => lineText(l) === text));
  if (!home) return text;
  return lineOnFinal(text, { pool: home.pool, key: `${keyOf(settlement)}::historyData:HISTORICAL_EVENTS_DATA.plotHooks:${home.type}`, held }, facts);
}

/**
 * @param {string} text the stored hook @param {unknown} settlement the final record
 * @param {object | (() => object)} facts the final record's facts @param {ReadonlySet<string>} held the hooks the town already prints
 * @returns {string | null}
 */
export function npcHookShown(text, settlement, facts, held) {
  const pool = LOYALTY_POOLS.find((p) => p.some((l) => lineText(l) === text));
  if (!pool) return text;
  return lineOnFinal(text, { pool, key: `${keyOf(settlement)}::npcData:NPC_FACTION_LOYALTY`, held }, facts);
}

/**
 * @typedef {{ plotHooks?: ReadonlyArray<unknown> } | null | undefined} HookCarrier
 * @typedef {{ npcs?: ReadonlyArray<HookCarrier>, history?: { historicalEvents?: ReadonlyArray<HookCarrier> } | null }} HookRecord
 */

/**
 * THE GATE for one record (S-A-2): the final record's facts read once, and every hook the town stores held (a next
 * admitted line is never one the town already carries).
 * @param {HookRecord | null | undefined} settlement the final record
 * @returns {(text: string, where: { kind: 'npc' } | { kind: 'event', type: unknown }) => string | null}
 */
export function storedHookGate(settlement) {
  /** @type {ReturnType<typeof factsOf> | null} */ let f = null;
  const facts = () => (f ??= factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (settlement)));
  const held = new Set([
    ...(settlement?.npcs || []).flatMap((n) => (n?.plotHooks || []).map(plotHookText)),
    ...(settlement?.history?.historicalEvents || []).flatMap((e) => (e?.plotHooks || []).map(plotHookText)),
  ].filter((t) => typeof t === 'string'));
  return (text, where) => (where.kind === 'npc' ? npcHookShown(text, settlement, facts, held) : eventHookShown(text, where.type, settlement, facts, held));
}

/**
 * The collector with the gate injected: the owner's screens (the Plot Hooks tab, the session sheet, the search).
 * @param {Parameters<typeof collectPlotHooks>[0]} settlement @param {Parameters<typeof collectPlotHooks>[1]} [options]
 * @returns {ReturnType<typeof collectPlotHooks>}
 */
export function collectPlotHooksShown(settlement, options = {}) {
  return collectPlotHooks(settlement, { ...options, gate: storedHookGate(settlement) });
}
