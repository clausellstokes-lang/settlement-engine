/**
 * domain/coherence/hookTruthRecord.js — the hook-truth check over the hooks the RECORD
 * stores, moved verbatim out of hookTruthFindings.js (which re-exports it beside the page
 * check) so a reader that needs only the record's answer — the generation receipt's
 * coherence battery — does not import the page's hook collector (lane SELF-VOUCH,
 * 2026-11-04).
 *
 * PURE: no rng, no clock, no store, no React.
 */

import { crisisHooksOf } from '../crisis/crisisHooks.js';

import { hookTruthViolations, settlementHookFacts } from './hookTruth.js';
import { buildViabilitySummary } from '../viabilitySummary.js';

/** @typedef {import('./hookTruth.js').HookTruthRecord} HookTruthRecord */

/** @typedef {import('./hookTruth.js').HookTruthFinding} HookTruthFinding */

/**
 * EVERY HOOK THE RECORD STORES, whoever wrote it, in a stable order.
 *
 * This is the ENGINE's text rather than the DM's page, and that is the point: a writer
 * that stores a false sentence owes a cure even where the display layer has learned to
 * refuse it. Read `renderedHookTruthFindings` for the page.
 * @param {unknown} settlement
 * @returns {string[]}
 */
function storedHookTexts(settlement) {
  const record = /** @type {HookTruthRecord} */ (
    settlement && typeof settlement === 'object' ? settlement : {}
  );
  /** @type {string[]} */
  const out = [];
  const take = (/** @type {unknown} */ hook) => {
    if (typeof hook === 'string') { if (hook.trim() !== '') out.push(hook); return; }
    const entry = /** @type {{ hook?: unknown, text?: unknown }} */ (hook);
    const text = typeof entry?.hook === 'string' ? entry.hook
      : typeof entry?.text === 'string' ? entry.text : '';
    if (text.trim() !== '') out.push(text);
  };
  const takeAll = (/** @type {unknown} */ list) => {
    if (Array.isArray(list)) list.forEach(take);
  };
  /** @type {unknown[]} */
  const npcs = Array.isArray(record.npcs) ? record.npcs : [];
  npcs.forEach((npc) => takeAll(/** @type {{ plotHooks?: unknown }} */ (npc)?.plotHooks));
  // The faction rosters carry a COPY of each member NPC, hooks included (F10 unit 4, rung 1C:
  // `soak1k-452` stored the dropped soldiers hook on `factions[2].members[1]` after the NPC lost it).
  /** @type {unknown[]} */
  const factions = Array.isArray(record.factions) ? record.factions : [];
  factions.forEach((faction) => {
    const members = /** @type {{ members?: unknown }} */ (faction)?.members;
    if (Array.isArray(members)) members.forEach((m) => takeAll(/** @type {{ plotHooks?: unknown }} */ (m)?.plotHooks));
  });
  /** @type {unknown[]} */
  const conflicts = Array.isArray(record.conflicts) ? record.conflicts : [];
  conflicts.forEach((conflict) => takeAll(/** @type {{ plotHooks?: unknown }} */ (conflict)?.plotHooks));
  /** @type {unknown[]} */
  const tensions = Array.isArray(record.history?.currentTensions) ? record.history.currentTensions : [];
  tensions.forEach((tension) => takeAll(/** @type {{ plotHooks?: unknown }} */ (tension)?.plotHooks));
  /** @type {unknown[]} */
  const events = Array.isArray(record.history?.historicalEvents) ? record.history.historicalEvents : [];
  events.forEach((event) => takeAll(/** @type {{ plotHooks?: unknown }} */ (event)?.plotHooks));
  takeAll(record.economicViability?.plotHooks);
  takeAll(record.economicState?.safetyProfile?.plotHooks);
  // The hooks each active crisis's stored CAST derives (src/domain/crisis/crisisHooks.js): they
  // are a function of the record, never a stored copy, so the record's own answer is to derive
  // them from the engine's cast (the DM's edit is the page's business, read there).
  /** @type {unknown[]} */
  const crises = Array.isArray(record.stress) ? record.stress : record.stress && typeof record.stress === 'object' ? [record.stress] : [];
  crises.forEach((entry) => takeAll(crisisHooksOf(settlement, /** @type {Parameters<typeof crisisHooksOf>[1]} */ (entry))));
  return out;
}

/**
 * THE STANDALONE CHECK (the chair's acceptance 5). Every hook the RECORD stores, read
 * against the facts of the place that stores it.
 *
 * Returns [] for a record whose hooks all say something true of it, and one finding per
 * (hook, violated fact) otherwise. The chair wires this into the certification receipt;
 * it is deliberately NOT wired here, and `src/domain/certification/generationReceiptJudgments.js`
 * is untouched by this lane.
 * @param {unknown} settlement
 * @returns {HookTruthFinding[]}
 */
export function hookTruthFindings(settlement) {
  const facts = settlementHookFacts(settlement);
  return storedHookTexts(settlement).flatMap((text) => hookTruthViolations(text, facts));
}

/**
 * The text of one stored hook entry, in the shapes `storedHookTexts` reads.
 * @param {unknown} hook
 * @returns {string}
 */
function hookTextOf(hook) {
  if (typeof hook === 'string') return hook;
  const entry = /** @type {{ hook?: unknown, text?: unknown }} */ (hook);
  return typeof entry?.hook === 'string' ? entry.hook
    : typeof entry?.text === 'string' ? entry.text : '';
}

/**
 * The containers `withoutFalseHooks` may copy, as the assembled record carries them.
 * @typedef {Object} StoredHookRecord
 * @property {unknown} [npcs]
 * @property {unknown} [factions] the faction rosters, each `members[]` a copy of its NPCs (F10 unit 4)
 * @property {unknown} [conflicts]
 * @property {{ currentTensions?: unknown, historicalEvents?: unknown }} [history]
 * @property {{ plotHooks?: unknown, summary?: unknown, viable?: unknown, issues?: unknown, dependencies?: unknown, metrics?: { foodBalance?: { dailyNeed?: unknown, deficit?: unknown, rawDeficit?: unknown, deficitPercent?: unknown } } }} [economicViability]
 * @property {{ safetyProfile?: { plotHooks?: unknown } }} [economicState]
 * @property {{ conflicts?: unknown }} [powerStructure]
 */

/**
 * @typedef {Object} TrueHooksPatch
 * @property {number} dropped how many stored hooks the record contradicted
 * @property {Record<string, unknown>} patch the containers that changed, keyed by their
 *   top-level record key (`npcs`, `conflicts`, `history`, `economicViability`,
 *   `economicState`); empty when nothing was dropped
 */

/**
 * THE GENERATION-SIDE CURE (lane RUNG1-TRUTH unit A, 2026-11-04; docs/SOAK_1000_RUNG1_2026-11-04.md
 * §2 row 11): a hook FALSE ON ITS OWN RECORD IS NOT STORED.
 *
 * `hookTruthFindings` above reports the debt; this drops it, with the same walk and the same
 * classifier, so the two can never disagree about which hook is false. The page already
 * refused every one of these (`hook-truth-page` 0 of 1,000); the record still stored 216
 * places' worth ("The settlement is starving…" on fed places, "paying their soldiers" with no
 * armed force, a blockade's "21 days of reserves" over 6.5 months in store).
 *
 * THE DRAW-ORDER PROMISE: this runs AFTER every draw (the assembly step calls it once the
 * roster, the defence profile and the conflicts are final) and it draws nothing itself. A
 * dropped hook leaves the list's next candidate in its place, or none; it never writes a new
 * sentence and never asks a pool for another. A record whose hooks are all true comes back
 * with no patch at all, so a calm place is byte-identical to what it was.
 *
 * COPY-ON-WRITE: a container is copied only where a hook leaves it, so no ctx-shared object
 * is mutated in place. The crisis hooks are derived from the cast (`crisisHooksOf`), never
 * stored, and are the page's business; they are not read here.
 *
 * A HELD ROSTER IS NOT RE-WRITTEN: under a held `npcs` pin (`options.npcsHeld`) the NPCs'
 * hooks are the held record's and are left as they are; the page's own truth gate still
 * refuses a false one there. The other containers are re-derived on every run.
 *
 * @param {unknown} settlement the assembled record
 * @param {{ npcsHeld?: boolean }} [options]
 * @returns {TrueHooksPatch}
 */
export function withoutFalseHooks(settlement, options = {}) {
  const record = /** @type {StoredHookRecord} */ (
    settlement && typeof settlement === 'object' ? settlement : {}
  );
  const facts = settlementHookFacts(settlement);
  let dropped = 0;
  /** @type {(list: unknown) => unknown} the list itself when every hook is true */
  const keep = (list) => {
    if (!Array.isArray(list)) return list;
    const kept = list.filter((hook) => hookTruthViolations(hookTextOf(hook), facts).length === 0);
    if (kept.length === list.length) return list;
    dropped += list.length - kept.length;
    return kept;
  };
  /** @type {(rows: unknown) => unknown} each row's `plotHooks`, copying only a changed row */
  const keepRows = (rows) => {
    if (!Array.isArray(rows)) return rows;
    let changed = false;
    const next = rows.map((/** @type {unknown} */ row) => {
      const entry = /** @type {{ plotHooks?: unknown }} */ (row);
      if (!row || typeof row !== 'object' || !Array.isArray(entry.plotHooks)) return row;
      const kept = keep(entry.plotHooks);
      if (kept === entry.plotHooks) return row;
      changed = true;
      return { ...entry, plotHooks: kept };
    });
    return changed ? next : rows;
  };
  /** @type {Record<string, unknown>} */
  const patch = {};

  const npcs = options.npcsHeld ? record.npcs : keepRows(record.npcs);
  if (npcs !== record.npcs) patch.npcs = npcs;
  // The faction rosters' member copies, under the same hold (F10 unit 4): a copy keeps no hook
  // its NPC lost, so the Power tab and the exports cannot print what the roster dropped.
  if (!options.npcsHeld && Array.isArray(record.factions)) {
    let changed = false;
    const factions = record.factions.map((/** @type {unknown} */ faction) => {
      const entry = /** @type {{ members?: unknown }} */ (faction);
      if (!faction || typeof faction !== 'object' || !Array.isArray(entry.members)) return faction;
      const members = keepRows(entry.members);
      if (members === entry.members) return faction;
      changed = true;
      return { ...entry, members };
    });
    if (changed) patch.factions = factions;
  }
  const conflicts = keepRows(record.conflicts);
  if (conflicts !== record.conflicts) patch.conflicts = conflicts;
  if (record.history && typeof record.history === 'object') {
    const tensions = keepRows(record.history.currentTensions);
    const events = keepRows(record.history.historicalEvents);
    if (tensions !== record.history.currentTensions || events !== record.history.historicalEvents) {
      patch.history = { ...record.history, currentTensions: tensions, historicalEvents: events };
    }
  }
  if (record.economicViability && typeof record.economicViability === 'object') {
    const viability = record.economicViability;
    const hooks = keep(viability.plotHooks);
    if (hooks !== viability.plotHooks) {
      // V-SUMMARY-HOOKS (LANDING-6, signed record 28): the summary states a hook count, so it is
      // RE-DERIVED from the surviving hooks by its one writer, never left at the pre-filter count.
      // The other inputs are the record's own published fields, the ones the generator handed it.
      const summary = typeof viability.summary === 'string' && Array.isArray(hooks)
        ? buildViabilitySummary(viability.viable !== false, Array.isArray(viability.issues) ? viability.issues : [],
          Array.isArray(viability.dependencies) ? viability.dependencies : [], hooks, viability.metrics?.foodBalance)
        : viability.summary;
      patch.economicViability = { ...viability, plotHooks: hooks, ...(summary === viability.summary ? {} : { summary }) };
    }
  }
  const safety = record.economicState?.safetyProfile;
  if (safety && typeof safety === 'object') {
    const hooks = keep(safety.plotHooks);
    if (hooks !== safety.plotHooks) {
      patch.economicState = { ...record.economicState, safetyProfile: { ...safety, plotHooks: hooks } };
    }
  }
  return { dropped, patch };
}

/**
 * `withoutFalseHooks` applied: the record with its false stored hooks gone, or the SAME
 * record (by reference) when every hook is true. The conflicts are dual-written on
 * `powerStructure.conflicts` by the assembly step, so a filtered conflict list is carried
 * there too and the two addresses stay one list.
 * @template {object} T
 * @param {T} settlement
 * @param {{ npcsHeld?: boolean }} [options] see `withoutFalseHooks`
 * @returns {T}
 */
export function storeTrueHooksOnly(settlement, options = {}) {
  const { dropped, patch } = withoutFalseHooks(settlement, options);
  if (dropped === 0) return settlement;
  const before = /** @type {StoredHookRecord} */ (settlement);
  const next = /** @type {StoredHookRecord} */ ({ ...before, ...patch });
  if (patch.conflicts && next.powerStructure && next.powerStructure.conflicts === before.conflicts) {
    next.powerStructure = { ...next.powerStructure, conflicts: patch.conflicts };
  }
  return /** @type {T} */ (/** @type {unknown} */ (next));
}
