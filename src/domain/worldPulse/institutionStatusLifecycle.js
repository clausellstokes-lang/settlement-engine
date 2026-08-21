/**
 * domain/worldPulse/institutionStatusLifecycle.js — W-K slice K1: THE GENERAL
 * INSTITUTION STATUS SYSTEM, lifecycle half (binding law
 * docs/DESIGN_MAGIC_ECONOMY.md §3c; §12's status test list).
 *
 * The model leaf (institutionStatusModel.js) says what the three words MEAN. This
 * leaf is the one place that decides, from live state alone, WHICH causes hold
 * right now, and it is the single writer of the ledger.
 *
 * ── PRESENCE IS DERIVED, NEVER STORED (the no-orphan law) ───────────────────
 * §3c requires that an impairment "can NEVER orphan". The usual way to get that is
 * a repair pass that hunts down records whose cause has died. This slice makes the
 * hunt unnecessary: every advance re-reads cause presence from the settlement and
 * the world ledgers, and the stored annotation carries only the durable half (when
 * it began, the DM's override, what a shell remembered). An impairment therefore
 * cannot survive its cause by even one advance, because presence was never a stored
 * fact that could go stale.
 *
 * `auditInstitutionStatusLedger` exists for the one case derivation cannot cover:
 * a ledger that arrived from disk, or from a save whose world moved on. The pin
 * runs the audit before AND after an advance, and the after is always clean.
 *
 * ── THE CAUSE READS ARE OTHER LAYERS' MARKS, NOT NEW STATE ──────────────────
 * Every predicate below reads a mark some existing producer already writes, so K1
 * adds no signal of its own and cannot disagree with the layer that raised it:
 *
 *   supply_shortage    the institution carries a `supply_starved` impairment
 *                      (supplyKernel) or an `access` impairment (blockadeTransport),
 *                      or the settlement carries a famine / import-shortage /
 *                      cut-route condition (activeConditions).
 *   corruption_exposed the institution carries a `corruption` impairment
 *                      (corruptionImpair's ousted path, which is what makes the rot
 *                      public record), or the settlement carries a corruption_exposed
 *                      condition.
 *   damage             the institution carries a `capacity` impairment (the DM's
 *                      damageInstitution event and the plague-strain stamp).
 *   siege_occupation   a live occupation grips the settlement (the occupations
 *                      ledger), or a siege / occupation condition holds.
 *
 * DELIBERATELY NOT MAPPED: `legitimacy`, `influence`, `wealth`, `staffing`. Those are
 * political and financial drags, not capacity causes, and §3c's impairment is a
 * CAPACITY modifier. A scandal that costs an institution standing without costing it
 * output is honestly not an impairment in this vocabulary. Recorded here so a later
 * reader does not re-find it as a gap.
 *
 * ── THE TWO-TIMESCALE LAW, MECHANICALLY (§3c) ───────────────────────────────
 * This leaf touches the FAST layer only. The shell axis is read off marks
 * institutionLifecycle writes on its own multi-year cadence; nothing here can open or
 * close an institution. That is why a cut road impairs immediately while the funding
 * verdict does not move at all, and why the two-timescale pin is a statement about
 * this module's write set rather than about a tuning constant.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation of inputs. The
 * advance consumes ZERO draws, so it cannot perturb the pulse stream even when lit.
 *
 * NOT WIRED INTO THE PULSE IN THIS SLICE. K1 ships the model, the verbs and the pins;
 * the pulseKernel call site, the Herald routing for these events and the DM command
 * belong to the slice that has a surface to show them on.
 *
 * @enforced-by tests/domain/institutionStatusLifecycle.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import {
  INSTITUTION_IMPAIRMENT_CAUSES,
  INSTITUTION_CAUSE_CURES,
  INSTITUTION_CAUSE_LABELS,
  deriveInstitutionStatus,
  impairmentAnnotation,
  institutionStatusRef,
  isRuinedInstitution,
  isShellInstitution,
  magicEconomyActive,
  readInstitutionStatusLedger,
  writeInstitutionStatusLedger,
} from './institutionStatusModel.js';

/** @typedef {import('./institutionStatusModel.js').InstitutionLike} InstitutionLike */
/** @typedef {import('./institutionStatusModel.js').ImpairmentAnnotation} ImpairmentAnnotation */
/** @typedef {import('./institutionStatusModel.js').InstitutionStatusRecord} InstitutionStatusRecord */
/** @typedef {import('./institutionStatusModel.js').InstitutionStatusLedger} InstitutionStatusLedger */
/** @typedef {import('./institutionStatusModel.js').CidStatusLedger} CidStatusLedger */

/**
 * @typedef {Object} SettlementLike
 * @property {unknown} [institutions]
 * @property {unknown} [activeConditions]
 */

/**
 * @typedef {Object} StatusSnapshotItem
 * @property {unknown} [id]
 * @property {SettlementLike} [settlement]
 */

/**
 * @typedef {Object} InstitutionStatusEvent
 * The receipt one status transition emits. §3c requires the LIFT to be an event;
 * the other three are its siblings, so a consumer never has to infer a transition by
 * differencing two ledgers.
 * @property {string} kind  one of INSTITUTION_STATUS_EVENT_KINDS
 * @property {string} cid
 * @property {string} ref
 * @property {string} name
 * @property {string|null} cause
 * @property {number} tick
 * @property {number} capacity01  the capacity AFTER the transition
 * @property {string} headline
 * @property {string} summary
 * @property {ReadonlyArray<string>} reasons
 */

/**
 * The closed transition vocabulary. `impairment_lifted` is the one §3c names
 * explicitly ("lifts AUTOMATICALLY as an event when the cause resolves").
 * @type {ReadonlyArray<string>}
 */
export const INSTITUTION_STATUS_EVENT_KINDS = Object.freeze([
  'impairment_opened', 'impairment_lifted', 'shell_formed', 'shell_reactivated',
]);

/**
 * Settlement conditions that mean an input road or a harvest has failed. Drawn from
 * the activeConditions archetype vocabulary; a condition the catalog does not carry
 * simply never matches, so this list cannot invent a shortage.
 */
const SUPPLY_CONDITIONS = new Set([
  'famine', 'regional_import_shortage', 'trade_route_cut',
  'regional_route_disruption', 'food_anchor_lost',
]);

/** Settlement conditions that mean a siege or an occupation grips the place. */
const SIEGE_CONDITIONS = new Set([
  'siege', 'occupation_burden', 'occupation_resistance',
]);

/** Institution impairment types that mean the inputs stopped arriving. */
const SUPPLY_IMPAIRMENTS = new Set(['supply_starved', 'access']);

/** @param {unknown} value @returns {string} */
const text = (value) => String(value == null ? '' : value).trim().toLowerCase();

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

/**
 * The impairment types an institution currently carries, lowercased. Reads the
 * estate's own `impairments[]` shape (entities/status.js) and counts only records
 * that actually degrade: a restoration patch is stored as a NEGATIVE severity and a
 * covert mark is a hidden capture, and neither is a capacity cause.
 *
 * @param {InstitutionLike|null|undefined} inst
 * @returns {Set<string>}
 */
function degradingImpairmentTypes(inst) {
  /** @type {Set<string>} */
  const types = new Set();
  for (const raw of asArray(asRecord(inst).impairments)) {
    const impairment = asRecord(raw);
    if (impairment.covert === true) continue;
    if (num(impairment.severity, 0) <= 0) continue;
    const type = text(impairment.type);
    if (type) types.add(type);
  }
  return types;
}

/**
 * The active-condition archetypes a settlement carries, lowercased.
 * @param {SettlementLike|null|undefined} settlement
 * @returns {Set<string>}
 */
function conditionArchetypes(settlement) {
  /** @type {Set<string>} */
  const out = new Set();
  for (const raw of asArray(asRecord(settlement).activeConditions)) {
    const archetype = text(asRecord(raw).archetype);
    if (archetype) out.add(archetype);
  }
  return out;
}

/**
 * @typedef {Object} InstitutionCauseContext
 * The normalized, pure snapshot every cause predicate reads. Built ONCE per
 * institution per advance so the predicates stay unit-testable from a literal.
 * @property {Set<string>} impairmentTypes  degrading impairment types on the institution
 * @property {Set<string>} conditions       settlement active-condition archetypes
 * @property {boolean} occupied             a live occupation grips this settlement
 * @property {string} settlementRef         the cid, for the causeRef
 * @property {string} institutionRef        the institution slug, for the causeRef
 */

/**
 * Build the cause context for one institution. Pure.
 *
 * @param {{ institution: InstitutionLike, settlement: SettlementLike, worldState?: { occupations?: unknown }|null, cid: string }} input
 * @returns {InstitutionCauseContext}
 */
export function readInstitutionCauseContext({ institution, settlement, worldState = null, cid }) {
  const conditions = conditionArchetypes(settlement);
  const occupations = asRecord(asRecord(worldState).occupations);
  return {
    impairmentTypes: degradingImpairmentTypes(institution),
    conditions,
    occupied: Boolean(occupations[String(cid)])
      || conditions.has('occupation_burden') || conditions.has('occupation_resistance'),
    settlementRef: String(cid),
    institutionRef: institutionStatusRef(institution),
  };
}

/**
 * THE CAUSE PRESENCE TABLE. Each entry answers, from the context alone, whether its
 * cause reads LIVE right now, and names the live cause instance it would bind to.
 *
 * Presence and resolution are the SAME read inverted, which is what makes the
 * automatic lift honest: a cause resolves exactly when the mark that raised it stops
 * reading. There is no separate resolution table that could drift from this one.
 *
 * @type {Readonly<Record<string, (ctx: InstitutionCauseContext) => string|null>>}
 */
export const INSTITUTION_CAUSE_SIGNAL = Object.freeze({
  supply_shortage: (ctx) => {
    for (const type of SUPPLY_IMPAIRMENTS) {
      if (ctx.impairmentTypes.has(type)) return `impairment:${type}:${ctx.institutionRef}`;
    }
    for (const condition of [...ctx.conditions].sort()) {
      if (SUPPLY_CONDITIONS.has(condition)) return `condition:${condition}:${ctx.settlementRef}`;
    }
    return null;
  },
  corruption_exposed: (ctx) => {
    if (ctx.impairmentTypes.has('corruption')) return `impairment:corruption:${ctx.institutionRef}`;
    if (ctx.conditions.has('corruption_exposed')) return `condition:corruption_exposed:${ctx.settlementRef}`;
    return null;
  },
  damage: (ctx) => (
    ctx.impairmentTypes.has('capacity') ? `impairment:capacity:${ctx.institutionRef}` : null
  ),
  siege_occupation: (ctx) => {
    if (ctx.occupied) return `occupation:${ctx.settlementRef}`;
    for (const condition of [...ctx.conditions].sort()) {
      if (SIEGE_CONDITIONS.has(condition)) return `condition:${condition}:${ctx.settlementRef}`;
    }
    return null;
  },
});

/**
 * Every cause reading LIVE for one institution, in canonical vocabulary order, with
 * the live instance each is bound to. Deterministic.
 *
 * @param {InstitutionCauseContext} ctx
 * @returns {Array<{ cause: string, causeRef: string }>}
 */
export function liveCausesFor(ctx) {
  /** @type {Array<{ cause: string, causeRef: string }>} */
  const out = [];
  for (const cause of INSTITUTION_IMPAIRMENT_CAUSES) {
    const causeRef = INSTITUTION_CAUSE_SIGNAL[cause](ctx);
    if (causeRef) out.push({ cause, causeRef });
  }
  return out;
}

/**
 * The live-cause INDEX `auditInstitutionStatusLedger` consumes: cid to institution
 * ref to the Set of causes live right now. Built from the same reads the advance
 * uses, so the audit and the advance can never disagree about what is live.
 *
 * @param {{ settlements?: ReadonlyArray<StatusSnapshotItem>, worldState?: { occupations?: unknown }|null }} input
 * @returns {Record<string, Record<string, Set<string>>>}
 */
export function buildLiveCauseIndex({ settlements = [], worldState = null }) {
  /** @type {Record<string, Record<string, Set<string>>>} */
  const index = {};
  for (const item of asArray(settlements)) {
    const entry = /** @type {StatusSnapshotItem} */ (item);
    const cid = String(asRecord(entry).id);
    const settlement = /** @type {SettlementLike} */ (asRecord(entry).settlement || {});
    /** @type {Record<string, Set<string>>} */
    const forCid = {};
    for (const raw of asArray(settlement.institutions)) {
      const institution = /** @type {InstitutionLike} */ (asRecord(raw));
      if (isRuinedInstitution(institution)) continue;
      const ref = institutionStatusRef(institution);
      const ctx = readInstitutionCauseContext({ institution, settlement, worldState, cid });
      forCid[ref] = new Set(liveCausesFor(ctx).map((c) => c.cause));
    }
    index[cid] = forCid;
  }
  return index;
}

/**
 * The institution's display name, or its ref when it has none.
 * @param {InstitutionLike} institution @param {string} ref @returns {string}
 */
function displayName(institution, ref) {
  const name = String(asRecord(institution).name || '').trim();
  return name || ref;
}

/**
 * Compose one transition receipt. Kept in one factory so every event carries the
 * same fields and a consumer can switch on `kind` alone.
 * @param {InstitutionStatusEvent} event @returns {InstitutionStatusEvent}
 */
function makeEvent(event) {
  return { ...event, reasons: Object.freeze([...event.reasons]) };
}

/**
 * ADVANCE THE STATUS LIFECYCLE for one tick, over a whole snapshot.
 *
 * READ-LAST/WRITE-NEXT, like the cause-resolution lifecycle it sits beside: it runs
 * after the layers that stamp impairments have settled this tick, so the marks it
 * reads are this tick's truth.
 *
 * DORMANT IS A NO-OP BY REFERENCE. With the flag absent the function returns the
 * prior ledger untouched and no events, so a dark world writes nothing and reads
 * byte-identically to a world that never had this layer.
 *
 * @param {{
 *   snapshot?: { settlements?: ReadonlyArray<StatusSnapshotItem> }|null,
 *   worldState?: { simulationRules?: unknown, occupations?: unknown }|null,
 *   priorLedger?: InstitutionStatusLedger|null,
 *   tick?: number,
 * }} args
 * @returns {{ ledger: InstitutionStatusLedger|null, events: InstitutionStatusEvent[] }}
 */
export function advanceInstitutionStatus({ snapshot = null, worldState = null, priorLedger = null, tick = 0 } = {}) {
  if (!magicEconomyActive(worldState)) {
    return { ledger: priorLedger || null, events: [] };
  }
  const settlements = asArray(asRecord(snapshot).settlements);
  const prior = asRecord(priorLedger);
  const now = Math.trunc(num(tick, 0));

  /** @type {InstitutionStatusLedger} */
  const nextLedger = {};
  /** @type {InstitutionStatusEvent[]} */
  const events = [];

  for (const rawItem of settlements) {
    const item = /** @type {StatusSnapshotItem} */ (asRecord(rawItem));
    const cid = String(item.id);
    const settlement = /** @type {SettlementLike} */ (asRecord(item.settlement));
    const priorForCid = asRecord(prior[cid]);
    /** @type {CidStatusLedger} */
    const cidLedger = {};

    for (const rawInst of asArray(settlement.institutions)) {
      const institution = /** @type {InstitutionLike} */ (asRecord(rawInst));
      const ref = institutionStatusRef(institution);
      const priorRaw = priorForCid[ref];
      const priorRecord = priorRaw && typeof priorRaw === 'object'
        ? /** @type {InstitutionStatusRecord} */ (priorRaw)
        : null;

      // A RUIN IS OUTSIDE THE VOCABULARY. Its record is dropped rather than carried,
      // because an annotation on a flattened building is exactly the orphan §3c
      // forbids. No lift event fires: the impairment did not resolve, the institution
      // did, and the ruin machinery owns that story.
      if (isRuinedInstitution(institution)) continue;

      const priorImpairments = asRecord(priorRecord?.impairments);
      const ctx = readInstitutionCauseContext({ institution, settlement, worldState, cid });
      const live = liveCausesFor(ctx);
      const liveByCause = new Map(live.map((entry) => [entry.cause, entry.causeRef]));

      /** @type {Record<string, ImpairmentAnnotation>} */
      const nextImpairments = {};
      for (const { cause, causeRef } of live) {
        const carried = /** @type {ImpairmentAnnotation|undefined} */ (priorImpairments[cause]);
        if (carried && typeof carried === 'object') {
          // The cause still holds: carry the durable half forward, including the DM's
          // override, and refresh the bound instance so the record always names the
          // cause that is live NOW rather than the one that first raised it.
          nextImpairments[cause] = { ...carried, causeRef };
        } else {
          nextImpairments[cause] = impairmentAnnotation({ cause, causeRef, sinceTick: now });
        }
      }

      const wasShell = Boolean(priorRecord?.shell);
      const isShell = isShellInstitution(institution);

      /** @type {InstitutionStatusRecord} */
      const record = { impairments: nextImpairments };

      // ── THE SLOW VERDICT: shell formation and warm-started reactivation ──────
      if (isShell) {
        if (priorRecord?.shell) {
          record.shell = priorRecord.shell;
        } else {
          // The capacity the institution was running at when the money stopped is what
          // the shell remembers (law 6, INFRASTRUCTURE REMEMBERS). It is computed from
          // the impairments live at close, NOT from the shell verdict, which is zero by
          // definition and would make every warm start a cold one.
          const atClose = deriveInstitutionStatus({
            institution: { ...institution, _worldPulseEconomyClosed: false, status: 'active' },
            record: { impairments: nextImpairments },
          });
          record.shell = { sinceTick: now, capacity01: clamp01(num(atClose?.capacity01, 1)) };
        }
      } else if (priorRecord?.shell) {
        // WARM START: the institution came back. The shell's memory is retained as
        // priorShell so the verdict can report the capacity a recovery resumes from.
        record.priorShell = priorRecord.shell;
      } else if (priorRecord?.priorShell) {
        record.priorShell = priorRecord.priorShell;
      }

      const verdict = deriveInstitutionStatus({ institution, record });
      const capacity01 = num(verdict?.capacity01, 1);
      const name = displayName(institution, ref);

      // ── THE AUTOMATIC LIFT (§3c) ────────────────────────────────────────────
      // Every prior cause that no longer reads live has resolved. The record is gone
      // by construction (it was never copied into nextImpairments); the event is what
      // makes the resolution visible instead of silent.
      for (const cause of Object.keys(priorImpairments).sort()) {
        if (liveByCause.has(cause)) continue;
        const label = INSTITUTION_CAUSE_LABELS[cause] || cause;
        const cure = INSTITUTION_CAUSE_CURES[cause] || '';
        events.push(makeEvent({
          kind: 'impairment_lifted',
          cid,
          ref,
          name,
          cause,
          tick: now,
          capacity01,
          headline: `${name} is working again`,
          summary: `The cause behind ${name}'s troubles has passed: ${cure}. The impairment from ${label} lifts.`,
          reasons: [`${label} resolved; the cause-bound impairment lifted automatically.`],
        }));
      }

      // A newly opened cause is the fast layer's other half, reported for symmetry so
      // a consumer never has to difference two ledgers to see an impairment begin.
      for (const cause of Object.keys(nextImpairments).sort()) {
        if (priorImpairments[cause]) continue;
        const label = INSTITUTION_CAUSE_LABELS[cause] || cause;
        events.push(makeEvent({
          kind: 'impairment_opened',
          cid,
          ref,
          name,
          cause,
          tick: now,
          capacity01,
          headline: `${name} is running short`,
          summary: `${name} is working at reduced capacity because of ${label}. It will recover when ${INSTITUTION_CAUSE_CURES[cause] || 'the cause resolves'}.`,
          reasons: [`${label} reads live; a cause-bound capacity modifier opened.`],
        }));
      }

      if (isShell && !wasShell) {
        events.push(makeEvent({
          kind: 'shell_formed',
          cid,
          ref,
          name,
          cause: null,
          tick: now,
          capacity01,
          headline: `${name} falls quiet`,
          summary: `${name} still stands, but there is no longer money to run it. The doors are closed and nothing is wrong with the building.`,
          reasons: ['The institution closed for want of funding; the shell remembers what it could do.'],
        }));
      } else if (!isShell && wasShell) {
        const warm = clamp01(num(record.priorShell?.capacity01, 0));
        events.push(makeEvent({
          kind: 'shell_reactivated',
          cid,
          ref,
          name,
          cause: null,
          tick: now,
          capacity01,
          headline: `${name} opens its doors again`,
          summary: `${name} is funded once more, and it resumes from what it remembered rather than from nothing.`,
          reasons: [`Reactivated from a shell; the warm start resumes at ${warm} of full capacity.`],
        }));
      }

      if (Object.keys(nextImpairments).length > 0 || record.shell || record.priorShell) {
        cidLedger[ref] = record;
      }
    }

    if (Object.keys(cidLedger).length > 0) nextLedger[cid] = cidLedger;
  }

  return {
    ledger: Object.keys(nextLedger).length > 0 ? nextLedger : null,
    events,
  };
}

/**
 * The world-facing entry point: advance the lifecycle and fold the result onto the
 * world, drop-when-empty.
 *
 * Returns the INPUT worldState BY REFERENCE when the lane is dark, which is the
 * dormancy gate stated as one line: the ledger key cannot materialize behind a dark
 * switch, so a dormant world is byte-identical by object identity.
 *
 * @param {{ simulationRules?: unknown, occupations?: unknown, spatialLedgers?: unknown }} worldState
 * @param {{ snapshot?: { settlements?: ReadonlyArray<StatusSnapshotItem> }|null, tick?: number }} args
 * @returns {{ worldState: Record<string, unknown>, events: InstitutionStatusEvent[] }}
 */
export function applyInstitutionStatus(worldState, { snapshot = null, tick = 0 } = {}) {
  const world = /** @type {Record<string, unknown>} */ (asRecord(worldState));
  if (!magicEconomyActive(worldState)) {
    return { worldState: world, events: [] };
  }
  const { ledger, events } = advanceInstitutionStatus({
    snapshot,
    worldState,
    priorLedger: readInstitutionStatusLedger(worldState),
    tick,
  });
  return { worldState: writeInstitutionStatusLedger(world, ledger), events };
}
