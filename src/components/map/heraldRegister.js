/**
 * heraldRegister.js — the read models behind THE HERALD's two REGISTER doors
 * (owner directive 5, judgment J-D5, wave W-C): the GAZETTEER (the living
 * roster) and RUINS & REMEMBRANCE (the graveyard).
 *
 * The Herald's other doors report the NEWS — heraldFeed routes pulse + chronicle
 * records into the six report sections. These two report the STATE OF THE
 * REGISTER instead: who is still standing, and who is not. Both are read-only
 * projections over truth the campaign already carries. No new canonical state,
 * no writer, no rng, no wall clock.
 *
 * ONE ROSTER, TWO HALVES — the invariant both doors rest on. Every settlement
 * the campaign counts appears in EXACTLY ONE register. The gazetteer is the
 * living half; remembrance is the fallen half, which has two lanes that were
 * never joined on any surface before this door:
 *   • the ENGINE remnant — the terminal-death lane's relic_ruin / abandoned_site
 *     status, read through the canonical `lifecycleStatusOf`;
 *   • the LIBRARY row the GM recorded as destroyed (`settlement.status ===
 *     'destroyed'`), the Destroyed rubric SettlementCard already stacks.
 * A save carrying both reads as fallen ONCE, remnant-first: death outranks the
 * roster, and a settlement is never counted twice.
 *
 * THE SECRETS SEAM (§15, domain/display/viewerSecrets). Remnant grades and the
 * names of the fallen are the world's own facts and ship to every audience — a
 * ruin is a landmark on the map. What does NOT ship without a proven owner
 * session is the RECEIPT half (the cause the GM recorded, the engine outcome id,
 * the destruction event id) and the monster-threat read, which is a DM
 * assessment rather than a register entry. Redaction here means the field is
 * NEVER BUILT, not hidden by CSS — the publicSafe posture.
 *
 * THE LEGIBILITY LAW. Every row's state is a SENTENCE in world words. The
 * register never prints a raw population, tick, severity or score: population is
 * banded by the tier word the engine already stamps, prosperity by the tier word
 * the economy generator already emits, and the age of a fall by TURNINGS — the
 * Herald's own established time word — never by invented calendar arithmetic.
 *
 * Pure; the sibling of heraldFeed.js / heraldFilter.js. The one non-local import
 * is `lifecycleStatusOf` from the terminal-death lane's ONE WRITER, so this
 * surface can never drift from the status the engine actually stamps. Measured
 * cost: zero. That module's chunk is already inside the Herald chunk's
 * transitive static closure, so the canonical import buys single-sourcing for no
 * bytes.
 *
 * @enforced-by tests/ui/heraldRegisterDoors.test.jsx
 */

import { lifecycleStatusOf } from '../../domain/worldPulse/settlementLifecycleFirstClass.js';
import { settlementWarStatus } from '../../domain/display/warStatus.js';
import { popToTier, prosperityRank } from '../../data/constants.js';

/** Codepoint comparator. Never localeCompare: host ICU tables are not a stable order. */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** @typedef {{ id?: unknown, name?: string, settlement?: any, campaignState?: any }} RegisterSave */

/** The save row's id, in the same resolution order the Realm surfaces use. */
export function registerIdOf(save) {
  return String(save?.id ?? save?.settlement?.id ?? '');
}

/** The place's name; never degrades to a raw id on a reader-facing surface. */
export function registerNameOf(save) {
  return String(save?.settlement?.name || save?.name || '').trim() || 'an unnamed seat';
}

/**
 * The saves the campaign actually counts, ordered as a register reads:
 * alphabetically by name, with a codepoint id tiebreak so equal names are stable.
 *
 * @param {any} campaign
 * @param {ReadonlyArray<RegisterSave>} [saves]
 * @returns {Array<RegisterSave>}
 */
export function campaignRegisterSaves(campaign, saves) {
  const ids = new Set((campaign?.settlementIds || []).map(String));
  return (Array.isArray(saves) ? saves : [])
    .filter((s) => ids.has(registerIdOf(s)))
    .sort((a, b) => codepoint(registerNameOf(a), registerNameOf(b)) || codepoint(registerIdOf(a), registerIdOf(b)));
}

/** Is this library row one the GM recorded as destroyed (the Destroyed rubric)? */
export function isDestroyedRow(save) {
  return save?.settlement?.status === 'destroyed';
}

/** The tier word the engine stamped, or the word its population bands to. */
function tierWordOf(settlement) {
  return String(
    settlement?.tier || settlement?.config?.tier || popToTier(num(settlement?.population, 0)),
  );
}

/** The prosperity word the economy generator emits, lowercased for the sentence.
 *  Empty when the save carries a vocabulary this build does not know — the
 *  sentence then simply omits the adjective rather than printing a raw token. */
function prosperityWordOf(settlement) {
  const label = settlement?.economicState?.prosperity;
  if (prosperityRank(label) < 0) return '';
  return String(typeof label === 'string' ? label : label?.tier).toLowerCase();
}

/** @param {string} phrase @returns {'A'|'An'} */
function article(phrase) {
  return /^[aeiou]/i.test(phrase) ? 'An' : 'A';
}

/**
 * One living settlement's state, as a sentence. Never a number: the tier word
 * carries the size, the prosperity word carries the wealth, and the live war
 * ledgers carry the clause.
 *
 * @param {any} settlement
 * @param {{ besiegingTargets: string[], besiegedBy: string[] }|null} warStatus
 * @returns {string}
 */
function livingLine(settlement, warStatus) {
  const tier = tierWordOf(settlement);
  const prosperity = prosperityWordOf(settlement);
  const subject = prosperity ? `${prosperity} ${tier}` : tier;
  const clause = warStatus?.besiegedBy?.length
    ? 'under siege'
    : warStatus?.besiegingTargets?.length
      ? 'with its armies in the field'
      : 'at peace';
  return `${article(subject)} ${subject}, ${clause}.`;
}

/**
 * THE GAZETTEER — every settlement the realm still counts among the living, as a
 * compact register row.
 *
 * @param {Object} args
 * @param {any} args.campaign
 * @param {ReadonlyArray<RegisterSave>} [args.saves]
 * @param {boolean} [args.seesSecrets]  a proven owner session (viewerSeesDmSecrets)
 * @returns {Array<{ id: string, name: string, tier: string, line: string, threat: string|null }>}
 */
export function gazetteerRows({ campaign, saves, seesSecrets = false }) {
  const worldState = campaign?.worldState || {};
  const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;
  const rows = [];
  for (const save of campaignRegisterSaves(campaign, saves)) {
    const settlement = save?.settlement || {};
    if (lifecycleStatusOf(settlement) || isDestroyedRow(save)) continue; // the fallen half
    const id = registerIdOf(save);
    rows.push({
      id,
      name: registerNameOf(save),
      tier: tierWordOf(settlement),
      line: livingLine(settlement, settlementWarStatus({ settlementId: id, worldState, regionalGraph })),
      // The threat read is a DM assessment of the country around the walls, not
      // a register fact — it is built only for a proven owner session.
      threat: seesSecrets ? String(settlement?.config?.monsterThreat || '') || null : null,
    });
  }
  return rows;
}

/** The remnant grades the terminal-death lane stamps, with the register's word
 *  for each and the standing sentence used when the chronicle entry is gone. */
export const REMNANT_GRADE = Object.freeze({
  relic_ruin: Object.freeze({
    label: 'Relic ruin',
    epitaph: 'A great city that dwindled to a final thorp and died. Its stones stand as a landmark and a warning.',
  }),
  abandoned_site: Object.freeze({
    label: 'Abandoned site',
    epitaph: 'It dwindled and was abandoned. A quiet site marks where it stood.',
  }),
});

/** The register's word for a grade this build does not recognise — honest, never a raw token. */
const UNKNOWN_GRADE = Object.freeze({ label: 'Remnant', epitaph: 'The realm records it as fallen; the manner is not set down.' });

/**
 * How long ago it fell, in TURNINGS — the Herald's own time word. A tick is an
 * engine count and never reaches the page; the band is what the reader gets.
 *
 * @param {number|null} diedAtTick
 * @param {number|null} nowTick
 * @returns {string}
 */
function turningsAgoLabel(diedAtTick, nowTick) {
  if (diedAtTick == null || nowTick == null) return 'The record does not set down when it fell.';
  const elapsed = nowTick - diedAtTick;
  if (elapsed <= 0) return 'Fell this turning.';
  if (elapsed === 1) return 'Fell last turning.';
  if (elapsed <= 4) return 'Fell a few turnings back.';
  if (elapsed <= 13) return 'Fell some turnings back.';
  return 'Fell long before the present turning.';
}

/** The chronicle entry the terminal-death writer left on the settlement, if it survives. */
function fallChronicleOf(settlement) {
  const events = settlement?.history?.historicalEvents;
  if (!Array.isArray(events)) return null;
  return events.find((e) => typeof e?.campaignEventId === 'string' && e.campaignEventId.includes('lifecycle_death.')) || null;
}

/** The DESTROY_SETTLEMENT row the library action appended to this save's log. */
function destroyLogEntryOf(save) {
  const log = save?.campaignState?.eventLog;
  if (!Array.isArray(log)) return null;
  return [...log].reverse().find((e) => e?.type === 'DESTROY_SETTLEMENT') || null;
}

/** Build one remnant row from the engine's terminal-death lane. */
function remnantRow(save, settlement, grade, nowTick, seesSecrets) {
  const meta = REMNANT_GRADE[grade] || UNKNOWN_GRADE;
  const chronicle = fallChronicleOf(settlement);
  const diedAt = settlement?.config?.lifecycleDiedAtTick;
  const receipts = [];
  if (seesSecrets) {
    if (chronicle?.name) {
      receipts.push({ id: 'chronicle', label: 'In the chronicle', detail: String(chronicle.name) });
    }
    const stamped = (Array.isArray(settlement?.lifecycleHistory) ? settlement.lifecycleHistory : [])
      .find((e) => e?.event === 'terminal_death');
    if (stamped?.outcomeId) {
      receipts.push({ id: 'outcome', label: 'Ruled by the realm', detail: String(stamped.outcomeId) });
    }
  }
  return {
    id: registerIdOf(save),
    name: registerNameOf(save),
    kind: /** @type {'remnant'} */ ('remnant'),
    gradeLabel: meta.label,
    epitaph: String(chronicle?.description || meta.epitaph),
    whenLabel: turningsAgoLabel(Number.isFinite(diedAt) ? Number(diedAt) : null, nowTick),
    receipts,
    receiptsRedacted: !seesSecrets,
  };
}

/** Build one row from a library save the GM recorded as destroyed. */
function destroyedRow(save, settlement, seesSecrets) {
  const entry = destroyLogEntryOf(save);
  const cause = String(settlement?.destroyedCause || settlement?.destroyedReason || '').trim();
  const receipts = [];
  if (seesSecrets) {
    if (cause) receipts.push({ id: 'cause', label: 'The cause you recorded', detail: cause });
    if (entry?.narrativeSummary) {
      receipts.push({ id: 'entry', label: 'In the settlement canon', detail: String(entry.narrativeSummary) });
    }
  }
  return {
    id: registerIdOf(save),
    name: registerNameOf(save),
    kind: /** @type {'destroyed'} */ ('destroyed'),
    gradeLabel: 'Destroyed',
    epitaph: 'Its destruction is written into its own canon; the dossier stays in your library so the campaign can still read what was there.',
    whenLabel: 'Recorded by your hand, outside the turnings.',
    receipts,
    receiptsRedacted: !seesSecrets,
  };
}

/**
 * RUINS & REMEMBRANCE — the fallen half of the register: engine remnants and the
 * library's Destroyed rubric, joined, each carrying the receipts the record
 * already holds. Retrospective review only; this builds no state and rules on
 * nothing.
 *
 * @param {Object} args
 * @param {any} args.campaign
 * @param {ReadonlyArray<RegisterSave>} [args.saves]
 * @param {boolean} [args.seesSecrets]  a proven owner session (viewerSeesDmSecrets)
 * @returns {Array<ReturnType<typeof remnantRow>|ReturnType<typeof destroyedRow>>}
 */
export function remembranceRows({ campaign, saves, seesSecrets = false }) {
  const nowTick = Number.isFinite(campaign?.worldState?.tick) ? Number(campaign.worldState.tick) : null;
  const rows = [];
  for (const save of campaignRegisterSaves(campaign, saves)) {
    const settlement = save?.settlement || {};
    const grade = lifecycleStatusOf(settlement);
    // Remnant-first: a save that is both a remnant and a recorded destruction is
    // ONE fallen place, filed under the manner the engine itself stamped.
    if (grade) rows.push(remnantRow(save, settlement, grade, nowTick, seesSecrets));
    else if (isDestroyedRow(save)) rows.push(destroyedRow(save, settlement, seesSecrets));
  }
  return rows;
}
