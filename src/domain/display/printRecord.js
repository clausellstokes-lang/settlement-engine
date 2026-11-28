/**
 * domain/display/printRecord.js — THE RECORD A WHOLE-DOCUMENT SURFACE PRINTS FROM (SURVEY S-A-2, the chair's ruling:
 * THE WORKER CARRIES NO TABLE).
 *
 * The stored lines S-A re-answers on the final record (a house's description: `institutionDescShown.js`; a hook drawn at
 * birth: `dossier/storedHookShown.js :: storedHookGate`) are re-answered HERE, once, on the caller's thread where the
 * tables already live, and the PDF worker, the Foundry module and the campaign book are handed the gated record: they
 * print what they are given, so the page and the document read one answer and the worker carries no table (the state
 * prose's precedent: `utils/generateSettlementPDF.js` builds it on the caller's thread and posts plain data).
 * `tests/lint/finalLinesPrintGate.walker.test.js` holds every caller to it.
 *
 * A copy: the stored record is untouched (no birth moves). A hook the gate refuses with nothing admitted is dropped;
 * a hook that is not a string (the generators store strings) is handed on as it is. Memoised by record.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/display/printRecord.test.js
 */
import { institutionDescShown } from './institutionDescShown.js';
import { storedHookGate } from '../dossier/storedHookShown.js';
import { plotHookText } from '../../lib/proseSeams.js';

/** @type {WeakMap<object, object>} */
const MEMO = new WeakMap();

/** @param {unknown} hook a stored hook (the generators store strings) @param {string | null} shown @returns {unknown} */
const rehook = (hook, shown) => (typeof hook === 'string' ? shown : hook);

/**
 * @template T
 * @param {T} settlement the FINAL record (normalized where the caller normalizes)
 * @returns {T} the record to print from
 */
export function printRecordOf(settlement) {
  if (!settlement || typeof settlement !== 'object') return settlement;
  const held = MEMO.get(/** @type {object} */ (settlement));
  if (held) return /** @type {T} */ (held);
  /** @typedef {Record<string, unknown> & { desc?: unknown, plotHooks?: unknown, type?: unknown }} Row */
  const s = /** @type {{ institutions?: unknown, npcs?: unknown, history?: { historicalEvents?: unknown } | null } & Record<string, unknown>} */ (/** @type {unknown} */ (settlement));
  const gate = storedHookGate(/** @type {Parameters<typeof storedHookGate>[0]} */ (/** @type {unknown} */ (s)));
  const hooksOf = (/** @type {unknown} */ hooks, /** @type {{ kind: 'npc' } | { kind: 'event', type: unknown }} */ where) => {
    if (!Array.isArray(hooks)) return hooks;
    const out = hooks.map((h) => (typeof h === 'string' ? rehook(h, gate(plotHookText(h), where)) : h)).filter((h) => h !== null);
    return out.length === hooks.length && out.every((h, i) => h === hooks[i]) ? hooks : out;
  };
  const institutions = Array.isArray(s.institutions)
    ? s.institutions.map((/** @type {Row} */ inst) => {
      const own = typeof inst?.desc === 'string' ? inst.desc.trim() : '';
      const shown = own ? institutionDescShown(inst, /** @type {Parameters<typeof institutionDescShown>[1]} */ (s), { audience: 'owner' }) : own;
      return own && shown !== own ? { ...inst, desc: shown } : inst;
    })
    : s.institutions;
  const npcs = Array.isArray(s.npcs) ? s.npcs.map((/** @type {Row} */ n) => { const h = hooksOf(n?.plotHooks, { kind: 'npc' }); return h === n?.plotHooks ? n : { ...n, plotHooks: h }; }) : s.npcs;
  const events = s.history?.historicalEvents;
  const historicalEvents = Array.isArray(events) ? events.map((/** @type {Row} */ e) => { const h = hooksOf(e?.plotHooks, { kind: 'event', type: e?.type }); return h === e?.plotHooks ? e : { ...e, plotHooks: h }; }) : events;
  // S-A-4: the defence profile's copies of the houses (`defenseProfile.institutions.<kind>[]`), which the Defense chapter
  // prints, carry the same description and read the same way
  const dp = /** @type {{ institutions?: Record<string, unknown> } | null | undefined} */ (s.defenseProfile);
  const kinds = dp && dp.institutions && typeof dp.institutions === 'object' ? dp.institutions : null;
  const defenceCopies = kinds ? Object.fromEntries(Object.entries(kinds).map(([kind, rows]) => [kind, Array.isArray(rows)
    ? rows.map((/** @type {Row} */ row) => {
      const own = typeof row?.desc === 'string' ? row.desc.trim() : '';
      const shown = own ? institutionDescShown(row, /** @type {Parameters<typeof institutionDescShown>[1]} */ (s), { audience: 'owner' }) : own;
      return own && shown !== own ? { ...row, desc: shown } : row;
    })
    : rows])) : null;
  const out = {
    ...s,
    ...(kinds ? { defenseProfile: { ...dp, institutions: defenceCopies } } : {}),
    ...(Array.isArray(s.institutions) ? { institutions } : {}),
    ...(Array.isArray(s.npcs) ? { npcs } : {}),
    ...(Array.isArray(events) ? { history: { ...s.history, historicalEvents } } : {}),
  };
  MEMO.set(/** @type {object} */ (settlement), out);
  return /** @type {T} */ (out);
}
