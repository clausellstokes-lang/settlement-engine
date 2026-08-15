/**
 * domain/worldPulse/magicRegimeLifecycle.js — W-K slice K2: THE CROSSINGS, THE
 * RECEIPTS, AND THE SHELLS (binding law docs/DESIGN_MAGIC_ECONOMY.md §3a, §3c, §8,
 * §12; constitutional laws 4 THRESHOLDS WITH BANDS + HYSTERESIS and 6 INFRASTRUCTURE
 * REMEMBERS).
 *
 * magicRegimeModel.js says what a regime IS and magicForms.js says what a band IS.
 * This leaf is the one place a settlement MOVES between them, and it is the single
 * writer of the regime ledger.
 *
 * ── A CROSSING IS AN EVENT WITH MATERIAL RECEIPTS (§3a, §8) ─────────────────
 * Law 4 requires that "every crossing is a Herald EVENT with material receipts", and
 * the word material is doing work: a receipt that said only "the regime changed"
 * would be a number wearing prose. Every crossing here names WHAT CHANGED IN THE
 * WORLD: the forms that opened or closed as rungs, and the institutions that were
 * actually shuttered or reopened BY NAME. A reader learns that the foundry fell
 * quiet, not that a band index decremented.
 *
 * ── EXACTLY TWO EVENT KINDS, AND THE SHELL IS NOT ONE OF THEM ───────────────
 * A demotion CLOSES institutions, and K1 already owns the vocabulary for what a
 * closed institution then IS. So this leaf marks the roster with institutionLifecycle's
 * own close spelling and stops; `advanceInstitutionStatus` (K1) sees the mark on its
 * next pass and emits `shell_formed` with the capacity the shell remembers, and emits
 * `shell_reactivated` with the warm start when a recovery clears it. The estate
 * therefore has ONE spelling of "closed for want of money" and ONE producer of the
 * shell transition, and K2's receipts reference the institutions rather than
 * duplicating K1's verdict about them.
 *
 * ── THE WARM START IS A REOPEN, NOT A REBUILD (law 6) ───────────────────────
 * A promotion that lifts the ceiling back over a shelled rung clears the economic
 * close on THAT ROW, the same row, keeping its id, name and history. It is never a
 * fresh institution of the same name. That is what makes K1's `priorShell` memory
 * land on the right record and the warm start resume from the capacity the shell
 * remembered rather than from nothing.
 *
 * IMPAIRMENTS SURVIVE A REOPEN, deliberately. institutionLifecycle's own reopen path
 * keeps corruption impairments across a close/reopen cycle precisely so the cycle
 * cannot launder a scandal for free, and this path does not get to be more generous:
 * a foundry that reopens with an unresolved corruption case reopens impaired.
 *
 * ── ORDERING ────────────────────────────────────────────────────────────────
 * READ-LAST/WRITE-NEXT, like K1: it runs after the layers that move the economy have
 * settled this tick, so the reading it grades is this tick's truth.
 *
 * NOT WIRED INTO THE PULSE IN THIS SLICE, on K1's terms and for K1's reason. K2 ships
 * the model, the lifecycle and the pins; the pulseKernel call site, the Herald routing
 * and the candidate registration belong to the slice that has a surface to show them
 * on. The events are returned from a pure advance and are Herald-SHAPED so that
 * wiring is a routing change rather than a rewrite.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation of inputs. The
 * advance consumes ZERO draws, so it cannot perturb the pulse stream even when lit.
 *
 * @enforced-by tests/domain/magicRegimeLifecycle.test.js,
 *   tests/domain/magicRegimeShells.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import {
  MAGIC_REGIME_LABELS,
  magicEconomyActive,
  magicExploitationGate,
  readMagicRegimeLedger,
  regimeEconomyReading,
  resolveMagicRegime,
  writeMagicRegimeLedger,
} from './magicRegimeModel.js';
import {
  MAGIC_FORM_LABELS,
  availableMagicForms,
  formRank,
  magicFormsAboveCeiling,
  magicFormsDelta,
  shelledMagicForms,
} from './magicForms.js';
import { institutionStatusRef } from './institutionStatusModel.js';

/** @typedef {import('./magicRegimeModel.js').MagicRegimeRecord} MagicRegimeRecord */
/** @typedef {import('./magicRegimeModel.js').MagicRegimeLedger} MagicRegimeLedger */
/** @typedef {import('./magicRegimeModel.js').SnapshotItem} SnapshotItem */
/** @typedef {import('./magicForms.js').MagicFormsBand} MagicFormsBand */

/**
 * @typedef {Object} MagicRegimeEvent
 * The receipt one crossing emits. Shaped like K1's status events so a later routing
 * slice handles both with one adapter.
 * @property {string} kind  one of MAGIC_REGIME_EVENT_KINDS
 * @property {string} cid
 * @property {string} from  the regime left
 * @property {string} to    the regime entered
 * @property {number} tick
 * @property {number} economy01  the reading that caused the crossing
 * @property {number} gate01     THE ONE GATE after the crossing
 * @property {string} headline
 * @property {string} summary
 * @property {ReadonlyArray<string>} reasons
 * @property {{ opened: ReadonlyArray<string>, closed: ReadonlyArray<string>, institutions: ReadonlyArray<string> }} receipts
 */

/**
 * @typedef {Object} MagicFormPatch
 * One institution the crossing shutters or reopens, named so the caller can fold it
 * and a receipt can print it.
 * @property {string} cid
 * @property {string} ref   the K1 institution ref, so both lanes name one row
 * @property {string} name
 * @property {string} form  the rung it realizes
 */

/**
 * The closed transition vocabulary. TWO kinds, because the shell transitions belong
 * to K1 (see the header) and a third kind here would be a second producer of them.
 * @type {ReadonlyArray<string>}
 */
export const MAGIC_REGIME_EVENT_KINDS = Object.freeze([
  'magic_regime_promoted', 'magic_regime_demoted',
]);

/**
 * The closure fate stamped on a row this lane shutters. DRAWN FROM
 * institutionLifecycle's EXISTING three-word fate vocabulary ('shuttered',
 * 'bankrupt', 'closed_for_want_of_custom') rather than adding a fourth: a guild or a
 * foundry was a business and goes `bankrupt`, everything below it simply loses the
 * custom that paid for it. Law 7 is a rule about not growing vocabularies casually,
 * and this is a case where the existing one already said it.
 * @param {string} form
 * @returns {string}
 */
export function magicClosureFate(form) {
  return formRank(form) >= 3 ? 'bankrupt' : 'closed_for_want_of_custom';
}

/** @param {unknown} value @param {number} fallback @returns {number} */
const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/** @param {unknown} value @returns {ReadonlyArray<unknown>} */
const asArray = (value) => (Array.isArray(value) ? value : []);

/** @param {Record<string, unknown>} institution @param {string} ref @returns {string} */
const displayName = (institution, ref) => String(institution.name || '').trim() || ref;

/**
 * Render a rung list as in-world prose: "a tower and a guild". Empty answers the
 * empty string so a caller can test it rather than printing "nothing".
 * @param {ReadonlyArray<string>} forms
 * @returns {string}
 */
function formsPhrase(forms) {
  const words = forms.map((form) => MAGIC_FORM_LABELS[form] || form);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0];
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

/**
 * THE ADVANCE for one settlement. Returns the next record, the crossing event when
 * one fired, and the institution patches the crossing implies.
 *
 * @param {{ item?: SnapshotItem|null, prior?: MagicRegimeRecord|null, tick?: number }} input
 * @returns {{
 *   record: MagicRegimeRecord,
 *   event: MagicRegimeEvent|null,
 *   closures: MagicFormPatch[],
 *   reopenings: MagicFormPatch[],
 * }}
 */
export function advanceMagicRegimeFor({ item = null, prior = null, tick = 0 }) {
  const entry = asRecord(item);
  const cid = String(entry.id == null ? '' : entry.id);
  const settlement = /** @type {{ institutions?: unknown, tier?: unknown, config?: unknown }} */ (
    asRecord(entry.settlement)
  );
  const now = Math.trunc(num(tick, 0));
  const economy01 = regimeEconomyReading(item);
  const resolved = resolveMagicRegime({ prior, economy01, tick: now });
  const record = { regime: resolved.regime, sinceTick: resolved.sinceTick };

  if (!resolved.changed) {
    return { record, event: null, closures: [], reopenings: [] };
  }

  const priorRegime = prior ? String(prior.regime) : resolved.regime;
  const bandBefore = availableMagicForms({ settlement, regime: priorRegime });
  const bandAfter = availableMagicForms({ settlement, regime: resolved.regime });
  const delta = magicFormsDelta(bandBefore, bandAfter);
  const gate01 = clamp01(magicExploitationGate({ regime: resolved.regime, economy01 }));

  /** @type {MagicFormPatch[]} */
  const closures = [];
  /** @type {MagicFormPatch[]} */
  const reopenings = [];

  if (resolved.direction === 'demoted') {
    // THE MATERIAL HALF OF THE DEMOTION: every standing magic row now above the
    // ceiling is closed. A row already shelled is untouched, because
    // magicFormsAboveCeiling reads the LIVE roster and a shell is not live.
    for (const above of magicFormsAboveCeiling({ settlement, band: bandAfter })) {
      const ref = institutionStatusRef(above.institution);
      closures.push({
        cid, ref, name: displayName(above.institution, ref), form: above.form,
      });
    }
  } else {
    // THE WARM START: every shelled magic row the raised ceiling can pay for again
    // reopens, as the SAME ROW (law 6).
    const topRank = bandAfter.top == null ? -1 : formRank(bandAfter.top);
    for (const shelled of shelledMagicForms(settlement)) {
      if (shelled.rank > topRank) continue;
      const ref = institutionStatusRef(shelled.institution);
      reopenings.push({
        cid, ref, name: displayName(shelled.institution, ref), form: shelled.form,
      });
    }
  }

  const touched = resolved.direction === 'demoted' ? closures : reopenings;
  const names = touched.map((patch) => patch.name);
  const promoted = resolved.direction === 'promoted';
  const rungPhrase = formsPhrase(promoted ? delta.opened : delta.closed);

  /** @type {MagicRegimeEvent} */
  const event = {
    kind: promoted ? 'magic_regime_promoted' : 'magic_regime_demoted',
    cid,
    from: priorRegime,
    to: resolved.regime,
    tick: now,
    economy01,
    gate01,
    headline: promoted
      ? `The magic of this place finds a purse${rungPhrase ? `: ${rungPhrase} becomes possible` : ''}`
      : `The magic of this place loses its purse${rungPhrase ? `: ${rungPhrase} is no longer affordable` : ''}`,
    summary: promoted
      ? `What magic costs here is now ${MAGIC_REGIME_LABELS[resolved.regime] || resolved.regime}.`
        + (names.length ? ` ${names.join(', ')} opens again, resuming from what it remembered.` : '')
      : `What magic costs here is now only ${MAGIC_REGIME_LABELS[resolved.regime] || resolved.regime}.`
        + (names.length ? ` ${names.join(', ')} closes its doors; the building stands, and nothing is wrong with it.` : ''),
    reasons: Object.freeze([
      `The economy reads ${economy01.toFixed(2)}, which ${promoted ? 'carries' : 'drops'} this place from ${priorRegime} to ${resolved.regime}.`,
      ...(rungPhrase ? [`The forms band ${promoted ? 'opens' : 'closes'} at ${rungPhrase}.`] : []),
      ...(names.length ? [`${names.length} standing institution${names.length === 1 ? '' : 's'} ${promoted ? 'reopened' : 'closed'} with the crossing.`] : []),
    ]),
    receipts: {
      opened: delta.opened,
      closed: delta.closed,
      institutions: Object.freeze(names),
    },
  };

  return { record, event, closures, reopenings };
}

/**
 * ADVANCE THE REGIME LADDER for one tick, over a whole snapshot.
 *
 * DORMANT IS A NO-OP BY REFERENCE. With the flag absent the function returns the
 * prior ledger untouched and no events, so a dark world writes nothing and reads
 * byte-identically to a world that never had this layer.
 *
 * @param {{
 *   snapshot?: { settlements?: ReadonlyArray<SnapshotItem> }|null,
 *   worldState?: { simulationRules?: unknown }|null,
 *   priorLedger?: MagicRegimeLedger|null,
 *   tick?: number,
 * }} args
 * @returns {{
 *   ledger: MagicRegimeLedger|null,
 *   events: MagicRegimeEvent[],
 *   closures: MagicFormPatch[],
 *   reopenings: MagicFormPatch[],
 * }}
 */
export function advanceMagicRegime({ snapshot = null, worldState = null, priorLedger = null, tick = 0 } = {}) {
  if (!magicEconomyActive(worldState)) {
    return { ledger: priorLedger || null, events: [], closures: [], reopenings: [] };
  }
  const settlements = asArray(asRecord(snapshot).settlements);
  const prior = asRecord(priorLedger);
  const now = Math.trunc(num(tick, 0));

  /** @type {MagicRegimeLedger} */
  const nextLedger = {};
  /** @type {MagicRegimeEvent[]} */
  const events = [];
  /** @type {MagicFormPatch[]} */
  const closures = [];
  /** @type {MagicFormPatch[]} */
  const reopenings = [];

  for (const rawItem of settlements) {
    const item = /** @type {SnapshotItem} */ (asRecord(rawItem));
    const cid = String(asRecord(item).id);
    const priorRaw = prior[cid];
    const priorRecord = priorRaw && typeof priorRaw === 'object'
      ? /** @type {MagicRegimeRecord} */ (priorRaw)
      : null;

    const result = advanceMagicRegimeFor({ item, prior: priorRecord, tick: now });
    nextLedger[cid] = result.record;
    if (result.event) events.push(result.event);
    closures.push(...result.closures);
    reopenings.push(...result.reopenings);
  }

  return {
    ledger: Object.keys(nextLedger).length > 0 ? nextLedger : null,
    events,
    closures,
    reopenings,
  };
}

/**
 * FOLD one settlement's crossing patches onto its roster. Pure: returns a NEW
 * settlement, or the SAME REFERENCE when nothing applied.
 *
 * THE CLOSE SPELLING IS institutionLifecycle's, FIELD FOR FIELD. That is not
 * imitation, it is the requirement: K1 grades a shell off exactly
 * `_worldPulseEconomyClosed === true && status === 'remnant'`, and any divergence
 * here would produce a row that is closed to this lane and invisible to the status
 * system. `remnantReason` names the regime so a DM reading the roster learns WHY.
 *
 * THE REOPEN SPELLING IS institutionLifecycle's too, including its rule that
 * corruption impairments SURVIVE the cycle: a close and reopen must not launder a
 * scandal.
 *
 * @param {{ settlement: { institutions?: unknown }, closures?: ReadonlyArray<MagicFormPatch>, reopenings?: ReadonlyArray<MagicFormPatch>, regime?: string }} input
 * @returns {Record<string, unknown>}
 */
export function applyMagicFormPatches({ settlement, closures = [], reopenings = [], regime = '' }) {
  const record = asRecord(settlement);
  const roster = asArray(record.institutions);
  if (roster.length === 0 || (closures.length === 0 && reopenings.length === 0)) return record;

  const closeRefs = new Map(closures.map((patch) => [patch.ref, patch]));
  const reopenRefs = new Map(reopenings.map((patch) => [patch.ref, patch]));
  let touched = false;

  const next = roster.map((raw) => {
    const institution = asRecord(raw);
    const ref = institutionStatusRef(/** @type {{ id?: unknown, name?: unknown }} */ (institution));
    if (closeRefs.has(ref)) {
      touched = true;
      const patch = /** @type {MagicFormPatch} */ (closeRefs.get(ref));
      return {
        ...institution,
        status: 'remnant',
        _worldPulseInactive: true,
        _worldPulseEconomyClosed: true,
        worldPulseFate: magicClosureFate(patch.form),
        remnantReason: `Closed when the settlement fell to a ${regime || 'lower'} magic economy; the building stands.`,
      };
    }
    if (reopenRefs.has(ref)) {
      touched = true;
      const keptImpairments = asArray(institution.impairments).filter((imp) => {
        const record2 = asRecord(imp);
        return record2.type === 'corruption'
          || String(record2.causeEventId || '').startsWith('corruption:');
      });
      return {
        ...institution,
        status: 'active',
        impairments: keptImpairments,
        _worldPulseInactive: false,
        _worldPulseEconomyClosed: false,
        worldPulseFate: null,
      };
    }
    return institution;
  });

  return touched ? { ...record, institutions: next } : record;
}

/**
 * The world-facing entry point: advance the ladder and fold the ledger onto the
 * world, drop-when-empty.
 *
 * Returns the INPUT worldState BY REFERENCE when the lane is dark, which is the
 * dormancy gate stated as one line: the ledger key cannot materialize behind a dark
 * switch, so a dormant world is byte-identical by object identity.
 *
 * THE ROSTER PATCHES ARE RETURNED, NOT APPLIED. Settlements are not reachable from
 * worldState (they live on the snapshot), and inventing a write path to them here
 * would be this leaf claiming an ownership it does not have. The caller folds them
 * with `applyMagicFormPatches`, which is also what lets a pin drive the whole chain
 * end to end without a pulse.
 *
 * @param {{ simulationRules?: unknown, spatialLedgers?: unknown }} worldState
 * @param {{ snapshot?: { settlements?: ReadonlyArray<SnapshotItem> }|null, tick?: number }} args
 * @returns {{
 *   worldState: Record<string, unknown>,
 *   events: MagicRegimeEvent[],
 *   closures: MagicFormPatch[],
 *   reopenings: MagicFormPatch[],
 * }}
 */
export function applyMagicRegime(worldState, { snapshot = null, tick = 0 } = {}) {
  const world = /** @type {Record<string, unknown>} */ (asRecord(worldState));
  if (!magicEconomyActive(worldState)) {
    return { worldState: world, events: [], closures: [], reopenings: [] };
  }
  const { ledger, events, closures, reopenings } = advanceMagicRegime({
    snapshot,
    worldState,
    priorLedger: readMagicRegimeLedger(worldState),
    tick,
  });
  return {
    worldState: writeMagicRegimeLedger(world, ledger, Math.trunc(num(tick, 0))),
    events,
    closures,
    reopenings,
  };
}
