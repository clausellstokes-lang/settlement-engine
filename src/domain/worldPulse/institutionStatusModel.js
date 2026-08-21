/**
 * domain/worldPulse/institutionStatusModel.js — W-K slice K1: THE GENERAL
 * INSTITUTION STATUS SYSTEM, model half (binding law docs/DESIGN_MAGIC_ECONOMY.md
 * §3c, §10, §11; constitutional laws 6 INFRASTRUCTURE REMEMBERS and 7 FINITE
 * SEMANTICS).
 *
 * THE SLICE IS MAGIC-INDEPENDENT AND SHIPS FIRST (§13). Nothing here reads the
 * magic profile, a regime, or a band. Every institution in the estate gets an
 * honest three-word answer to "is this place working" before magic gets one.
 *
 * ── WHAT THIS IS NOT: A SECOND STATUS SYSTEM ────────────────────────────────
 * The estate already carries a status vocabulary (entities/status.js:
 * active | impaired | removed | destroyed | vacant) and an impairment record
 * whose `causeEventId` is already a cause link. K1 does NOT fork it, widen it, or
 * write to it. `operational | impaired | shell` is a DERIVED VERDICT over marks
 * other layers already write:
 *
 *   OPERATIONAL  the institution stands and carries no live impairing cause.
 *   IMPAIRED     a cause-bound capacity modifier is live (the FAST layer).
 *   SHELL        the institution is intact but UNFUNDED (the SLOW verdict). The
 *                estate already spells this: institutionLifecycle's economic
 *                close stamps `status:'remnant'` + `_worldPulseEconomyClosed`,
 *                and its `found` path already re-raises a remnant of the same
 *                name. K1 reads that mark; it never mints a parallel closed
 *                state, because two spellings of "closed" would drift the first
 *                time either lane was refactored.
 *
 * A RUIN IS NOT IN THE VOCABULARY, DELIBERATELY. calamityKernel's strike stamps
 * `status:'ruined'` (and, note, `_worldPulseEconomyClosed` alongside it), and
 * abandonment/removal stamp 'removed'/'destroyed'. §3c calls the impaired shell
 * "the darkest state short of ruin", so ruin sits OUTSIDE the three words by the
 * design's own framing. `deriveInstitutionStatus` returns null for a ruin rather
 * than inventing a fourth word: the ruin machinery owns that verdict and K1 is
 * read-only over it.
 *
 * ── THE TWO-TIMESCALE LAW (§3c) ─────────────────────────────────────────────
 * Impairment is the FAST layer and shell the SLOW verdict, and they COMPOSE. The
 * derived verdict therefore carries `impaired` and `shell` as INDEPENDENT flags
 * beside the single headline `status`, so an impaired shell reads as the
 * frayed-dark rather than collapsing into whichever word won. The headline word
 * for an impaired shell is 'shell', because a closed institution produces nothing
 * whatever its remaining rot, and the composition stays legible through the flag.
 *
 * ── THE NO-ORPHAN LAW, STRUCTURALLY (§3c: "NEVER orphaned") ─────────────────
 * The ledger is NOT the authority on which causes are live. LIVE STATE IS. Every
 * advance re-derives cause presence from the settlement and the world ledgers
 * (institutionStatusLifecycle.js) and stores only what derivation cannot recover:
 * WHEN the impairment began, the DM's severity override, and the capacity a shell
 * remembers. An impairment therefore cannot outlive its cause even by one advance,
 * because it is not a thing that persists on its own. `auditInstitutionStatusLedger`
 * is the walker-style totality check for a ledger that arrived from disk.
 *
 * ── DORMANCY (law 8; §10) ───────────────────────────────────────────────────
 * `magicEconomyEnabled` is VIRTUAL: no entry in DEFAULT_SIMULATION_RULES (the
 * routeLifecycleEnabled / npcConsequencesEnabled convention), so it adds no bytes
 * to a legacy save and does not join RULE_COMPARISON_KEYS. Every gate reads
 * `=== true`, so ABSENT means DORMANT means BYTE-IDENTICAL: the ledger nests under
 * the `spatialLedgers` conditional namespace and `writeInstitutionStatusLedger`
 * drops the whole key when empty, taking the namespace with it when it was the
 * last sub-ledger.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation, no store.
 * Records fold in codepoint-sorted key order so a rebuilt ledger is byte-identical
 * to a persisted one.
 *
 * @enforced-by tests/domain/institutionStatusModel.test.js,
 *   tests/domain/institutionStatusLifecycle.test.js,
 *   tests/domain/institutionStatusCertification.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { stablePart } from './stablePart.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';

/**
 * The conditional sub-ledger key under worldState.spatialLedgers. Named with the
 * `_LEDGER` suffix so the spatialLedgers coverage walker
 * (tests/lib/spatialLedgerCoverage.walker.test.js) resolves the constant to its
 * string value and can hold the src/lib/spatialUsage.js manifest honest.
 * @type {string}
 */
export const INSTITUTION_STATUS_LEDGER = 'institutionStatus';

/**
 * The VIRTUAL rule key gating everything in W-K. Declared (at false) in the
 * full_simulation preset spread so the subsystem-certification totality walker can
 * census it; absent from DEFAULT_SIMULATION_RULES so preset identity is untouched.
 * @type {string}
 */
export const MAGIC_ECONOMY_RULE = 'magicEconomyEnabled';

/**
 * THE CLOSED STATUS VOCABULARY (§3c, law 7). Three words, and the headline word an
 * institution reports is exactly one of them. `shell` outranks `impaired` in the
 * headline because a closed institution's output is zero regardless of what else
 * is wrong with it; the composition survives in the `impaired` flag.
 * @type {ReadonlyArray<string>}
 */
export const INSTITUTION_STATUSES = Object.freeze(['operational', 'impaired', 'shell']);

export const STATUS_OPERATIONAL = 'operational';
export const STATUS_IMPAIRED = 'impaired';
export const STATUS_SHELL = 'shell';

/**
 * THE CLOSED IMPAIRMENT-CAUSE VOCABULARY (§3c, law 7). Exactly the four the design
 * names. The design's trailing "…authored" is an AUTHORING SEAM, not a licence to
 * guess: a fifth cause is a design decision with a written reason, added here and
 * nowhere else, and the tuning table plus the cure table below are total over this
 * list by construction so a widening cannot half-land.
 *
 * `supply_shortage` deliberately absorbs ANY root (a cut route, a failed harvest,
 * interdicted reagents) exactly as §3c specifies: the cause names the MECHANISM the
 * institution feels, not the upstream story, and the upstream story lives in the
 * causeRef.
 * @type {ReadonlyArray<string>}
 */
export const INSTITUTION_IMPAIRMENT_CAUSES = Object.freeze([
  'supply_shortage', 'corruption_exposed', 'damage', 'siege_occupation',
]);

/**
 * TUNING (§11: "impairment default severities per cause"). Every entry is PROPOSED
 * and soak-vetoable per the R-15 shape.
 *
 * SEVERITY IS A CAPACITY REDUCTION in 0..1: capacity01 = 1 minus the combined
 * severity, so 1 is a temporarily zero capacity and 0 would be no impairment at
 * all. §3c bounds the modifier to [reduced .. temporarily zero], which is why
 * MIN_SEVERITY is strictly positive: an impairment record that reduced nothing
 * would be a record claiming a degradation the world could not feel.
 *
 * NONE OF THESE FOUR NUMBERS IS INVENTED. Each is the severity the estate's own
 * existing producer already stamps for that mechanism, so a lit K1 grades a cause
 * exactly as hard as the layer that raised it already does:
 *   supply_shortage   0.60  supplyKernel's SUPPLY_STARVED stamp (a cut input road)
 *   corruption_exposed 0.30 corruptionImpair's exposure stamp
 *   damage            0.70  events/mutateEntities damageInstitution's default
 *   siege_occupation  0.50  blockadeTransport's access band midpoint
 *                           (0.3 + severity * 0.4, capped 0.7)
 */
export const INSTITUTION_STATUS_TUNING = Object.freeze({
  defaultSeverity: Object.freeze({
    supply_shortage: 0.6,
    corruption_exposed: 0.3,
    damage: 0.7,
    siege_occupation: 0.5,
  }),
  // The floor of "reduced": a DM override below this is clamped up, because §3c's
  // range starts at REDUCED and the cure for a cause is to resolve the cause, never
  // to zero its severity behind the world's back.
  MIN_SEVERITY: 0.05,
  // The ceiling of "temporarily zero": severity 1 is a full suspension, and it is
  // reachable by DM override on purpose (sovereignty over operations, §3c).
  MAX_SEVERITY: 1,
});

/**
 * THE CURE FOLLOWS THE CAUSE (§3c). A terse, DM-facing sentence naming what must
 * happen for the impairment to lift. Total over INSTITUTION_IMPAIRMENT_CAUSES.
 * These are the resolution predicates of institutionStatusLifecycle.js stated in
 * words, so a surface can say what is owed without reading the predicate table.
 * @type {Readonly<Record<string, string>>}
 */
export const INSTITUTION_CAUSE_CURES = Object.freeze({
  supply_shortage: 'the road reopens or the stores refill',
  corruption_exposed: 'the house is cleaned out and the scandal closes',
  damage: 'the repairs are finished',
  siege_occupation: 'the siege lifts or the occupier withdraws',
});

/**
 * A terse mechanism label per cause, for receipts and headlines. Total over
 * INSTITUTION_IMPAIRMENT_CAUSES.
 * @type {Readonly<Record<string, string>>}
 */
export const INSTITUTION_CAUSE_LABELS = Object.freeze({
  supply_shortage: 'a supply shortage',
  corruption_exposed: 'an exposed corruption',
  damage: 'damage to the building',
  siege_occupation: 'siege or occupation',
});

/**
 * @typedef {Object} InstitutionLike
 * The loosely-shaped roster row. `status` is `unknown` rather than `string`
 * because SimInstitution.status is `string|Object` across the estate (the forced
 * seam applyWorldPulse documents); every read here normalizes through String().
 * @property {unknown} [status]
 * @property {unknown} [id]
 * @property {unknown} [name]
 * @property {unknown} [_worldPulseInactive]
 * @property {unknown} [_worldPulseEconomyClosed]
 * @property {unknown} [_worldPulseMorallyAbolished]
 */

/**
 * @typedef {Object} ImpairmentAnnotation
 * The DURABLE half of one cause-bound impairment. Presence is re-derived from live
 * state every advance and is NOT stored (that is the no-orphan law made
 * structural); what is stored is only what derivation cannot recover.
 * @property {string} cause      a member of INSTITUTION_IMPAIRMENT_CAUSES
 * @property {string} causeRef   the live cause instance this record is bound to
 * @property {number} sinceTick  the tick the impairment began
 * @property {number} [dmSeverity]  the DM's override, when one is set
 */

/**
 * @typedef {Object} ShellAnnotation
 * What a shell REMEMBERS (law 6). `capacity01` is the capacity the institution was
 * running at the moment it closed, which is what a later recovery warm-starts from
 * rather than a cold rebuild.
 * @property {number} sinceTick
 * @property {number} capacity01
 */

/**
 * @typedef {Object} InstitutionStatusRecord
 * @property {Record<string, ImpairmentAnnotation>} impairments  keyed by cause
 * @property {ShellAnnotation} [shell]      present while the institution is a shell
 * @property {ShellAnnotation} [priorShell] the shell it most recently reopened from
 */

/** @typedef {Record<string, InstitutionStatusRecord>} CidStatusLedger */
/** @typedef {Record<string, CidStatusLedger>} InstitutionStatusLedger */

/**
 * @typedef {Object} InstitutionStatusVerdict
 * @property {string} status      one of INSTITUTION_STATUSES
 * @property {boolean} impaired   the FAST layer, independent of `status`
 * @property {boolean} shell      the SLOW verdict, independent of `status`
 * @property {number} capacity01  0..1; exactly 0 for a shell
 * @property {ReadonlyArray<{ cause: string, causeRef: string, severity: number, sinceTick: number, dmOverridden: boolean, cure: string }>} causes
 * @property {{ capacity01: number, closedTick: number }} [warmStart] the capacity a
 *   reopened institution resumes from, present only when it came back from a shell
 */

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

/**
 * Rebuild a record with its keys in codepoint order, so a ledger rebuilt from a
 * re-ordered save serializes byte-identically to the one that was persisted.
 * @template T
 * @param {Record<string, T>} record
 * @returns {Record<string, T>}
 */
function sortedRecord(record) {
  /** @type {Record<string, T>} */
  const out = {};
  for (const key of Object.keys(record).sort()) out[key] = record[key];
  return out;
}

/**
 * Is THE MAGIC ECONOMY lane lit for this world? Reads
 * `simulationRules.magicEconomyEnabled === true`, defensively. ABSENT means false
 * means DORMANT (law 8). Pure, total.
 *
 * @param {{ simulationRules?: unknown }|null|undefined} worldState
 * @returns {boolean}
 */
export function magicEconomyActive(worldState) {
  const rules = asRecord(worldState && typeof worldState === 'object' ? worldState.simulationRules : null);
  return rules[MAGIC_ECONOMY_RULE] === true;
}

/**
 * THE INSTITUTION REF: the stable per-settlement key this ledger uses. Reuses the
 * estate's canonical `stablePart(inst.id || inst.name)` slug rather than minting a
 * sibling identity, so a ref written here names the same row the tier-outcome
 * applier and the pulse both already name.
 *
 * @param {InstitutionLike|null|undefined} inst
 * @returns {string}
 */
export function institutionStatusRef(inst) {
  if (!inst || typeof inst !== 'object') return 'unknown';
  const raw = inst.id == null || inst.id === '' ? inst.name : inst.id;
  return stablePart(raw);
}

/**
 * Non-standing statuses that read as RUINED OR GONE rather than shelled. Mirrors
 * institutions/institutionRoster.js INACTIVE_STATUS, minus 'remnant': a remnant is
 * precisely the closed-but-intact row K1 grades as a shell, while the other three
 * are outside the vocabulary entirely.
 */
const RUINED_STATUS = new Set(['ruined', 'removed', 'destroyed']);

/**
 * True when an institution is RUINED OR GONE, and therefore outside the K1
 * vocabulary altogether. Checked BEFORE the shell read, because calamityKernel's
 * strike stamps `_worldPulseEconomyClosed: true` alongside `status: 'ruined'` and a
 * shell test that read the flag alone would grade a flattened building as merely
 * unfunded.
 *
 * @param {InstitutionLike|null|undefined} inst
 * @returns {boolean}
 */
export function isRuinedInstitution(inst) {
  if (!inst || typeof inst !== 'object') return false;
  return RUINED_STATUS.has(text(inst.status));
}

/**
 * True when an institution is a SHELL: intact, closed, and UNFUNDED (§3c). The
 * predicate is the ECONOMIC close specifically, and the narrowness is the point.
 *
 *   economic close  `_worldPulseEconomyClosed` + status 'remnant'  ⇒ SHELL. Nothing
 *       is wrong with it; the money stopped. This is the design's shell exactly.
 *   moral abolition `_worldPulseMorallyAbolished` + status 'remnant' ⇒ NOT a shell.
 *       The patron tore it down on a verdict, so "nothing wrong with it" is false.
 *       It is intact and re-raisable, and a later slice may decide it deserves its
 *       own word; inventing one here would be a widening without a design line.
 *   calamity ruin   status 'ruined' ⇒ NOT a shell (see isRuinedInstitution).
 *
 * @param {InstitutionLike|null|undefined} inst
 * @returns {boolean}
 */
export function isShellInstitution(inst) {
  if (!inst || typeof inst !== 'object') return false;
  if (isRuinedInstitution(inst)) return false;
  if (inst._worldPulseMorallyAbolished === true) return false;
  return inst._worldPulseEconomyClosed === true && text(inst.status) === 'remnant';
}

/**
 * The engine's DEFAULT severity for a cause (§3c: "the engine derives a default
 * severity from the cause"). An unknown cause answers 0, which makes it
 * non-impairing rather than silently mid-band, so a typo cannot invent a degradation.
 *
 * @param {string} cause
 * @returns {number}
 */
export function defaultSeverityForCause(cause) {
  const table = INSTITUTION_STATUS_TUNING.defaultSeverity;
  return Object.prototype.hasOwnProperty.call(table, String(cause))
    ? table[/** @type {keyof typeof table} */ (String(cause))]
    : 0;
}

/**
 * The severity actually in force for one annotation: the DM's override when set,
 * otherwise the engine default for the cause. THE DM OVERRIDE SEAM (§3c: "the DM
 * may override anywhere in the range including full suspension").
 *
 * @param {ImpairmentAnnotation|null|undefined} annotation
 * @returns {number}
 */
export function effectiveSeverity(annotation) {
  if (!annotation || typeof annotation !== 'object') return 0;
  if (annotation.dmSeverity != null && Number.isFinite(Number(annotation.dmSeverity))) {
    return clampSeverity(Number(annotation.dmSeverity));
  }
  return defaultSeverityForCause(annotation.cause);
}

/**
 * Clamp a severity into §3c's band: [MIN_SEVERITY .. MAX_SEVERITY], i.e. from
 * REDUCED to TEMPORARILY ZERO capacity. A non-finite input answers the floor
 * rather than throwing, because a DM verb is a user surface.
 *
 * @param {number} severity
 * @returns {number}
 */
export function clampSeverity(severity) {
  const { MIN_SEVERITY, MAX_SEVERITY } = INSTITUTION_STATUS_TUNING;
  const value = num(severity, MIN_SEVERITY);
  if (value < MIN_SEVERITY) return MIN_SEVERITY;
  if (value > MAX_SEVERITY) return MAX_SEVERITY;
  return value;
}

/**
 * COMBINE severities the way the estate already combines them: 1 - prod(1 - s), so
 * two 0.5 causes yield 0.75 rather than 1 and something always survives short of a
 * deliberate full suspension.
 *
 * THE RULE IS NOT FORKED, IT IS SHARED. entities/status.js `severityFor` is the
 * canonical spelling, but it aggregates over an ENTITY's own `impairments[]` by
 * type, and K1 aggregates over CAUSE annotations in a sidecar, so the function
 * cannot simply be called. The formula is therefore restated here once and pinned
 * against `severityFor` on identical inputs
 * (tests/domain/institutionStatusModel.test.js), which turns a silent fork into a
 * failing test the moment either spelling moves.
 *
 * @param {ReadonlyArray<number>} severities
 * @returns {number} 0..1, rounded to 3 decimals like severityFor
 */
export function combineSeverities(severities) {
  const list = Array.isArray(severities) ? severities : [];
  let surviving = 1;
  for (const severity of list) surviving *= (1 - clamp01(num(severity, 0)));
  return Number((1 - surviving).toFixed(3));
}

/**
 * Mint one cause-bound impairment annotation. THE ONLY FACTORY, so a record is
 * structurally incapable of existing without naming a cause and the live cause
 * instance it is bound to (the no-orphan law, §3c).
 *
 * @param {{ cause: string, causeRef: string, sinceTick?: number }} input
 * @returns {ImpairmentAnnotation}
 */
export function impairmentAnnotation(input) {
  return {
    cause: String(input.cause),
    causeRef: String(input.causeRef),
    sinceTick: Math.trunc(num(input.sinceTick, 0)),
  };
}

/**
 * THE DM OVERRIDE VERB (§3c: sovereignty over operations). Returns a NEW annotation
 * carrying the override, clamped into the band. Severity 1 is honoured: a DM may
 * suspend an institution outright, and the result is a TEMPORARILY zero capacity
 * that still lifts automatically when its cause resolves, which is what keeps a
 * suspension distinct from a shell.
 *
 * NOT WIRED TO A STORE ACTION IN THIS SLICE, deliberately. K1 ships the pure verb;
 * the command, its undo entry and its operationRegistry row belong to the slice
 * that gives the DM a surface to press.
 *
 * @param {ImpairmentAnnotation} annotation
 * @param {number} severity
 * @returns {ImpairmentAnnotation}
 */
export function withDmSeverity(annotation, severity) {
  return { ...annotation, dmSeverity: clampSeverity(severity) };
}

/**
 * Drop a DM override, returning the annotation to the engine's default severity for
 * its cause. The inverse of withDmSeverity; the key is DELETED rather than set to
 * null so an un-overridden annotation serializes exactly as a never-overridden one.
 *
 * @param {ImpairmentAnnotation} annotation
 * @returns {ImpairmentAnnotation}
 */
export function clearDmSeverity(annotation) {
  if (annotation == null || annotation.dmSeverity == null) return annotation;
  const { dmSeverity: _dropped, ...rest } = annotation;
  return rest;
}

/** An empty per-institution record. Never persisted (see writeInstitutionStatusLedger). */
export function emptyInstitutionStatusRecord() {
  return /** @type {InstitutionStatusRecord} */ ({ impairments: {} });
}

/**
 * True when a record carries nothing worth persisting, and therefore must be
 * dropped rather than written as an empty container.
 * @param {InstitutionStatusRecord|null|undefined} record
 * @returns {boolean}
 */
export function isInstitutionStatusRecordEmpty(record) {
  if (!record || typeof record !== 'object') return true;
  const impairments = asRecord(record.impairments);
  return Object.keys(impairments).length === 0 && !record.shell && !record.priorShell;
}

/**
 * THE DERIVED VERDICT (§3c). Composes the SLOW shell read off the institution's own
 * marks with the FAST cause-bound modifier off the ledger annotations, and reports
 * both the single closed-vocabulary word and the two independent flags so the
 * impaired shell stays legible.
 *
 * Returns NULL for a ruined or removed institution: ruin is outside the vocabulary
 * (§3c calls the impaired shell the darkest state SHORT OF ruin) and the ruin
 * machinery owns that verdict.
 *
 * @param {{ institution: InstitutionLike|null|undefined, record?: InstitutionStatusRecord|null }} input
 * @returns {InstitutionStatusVerdict|null}
 */
export function deriveInstitutionStatus({ institution, record = null }) {
  if (!institution || typeof institution !== 'object') return null;
  if (isRuinedInstitution(institution)) return null;

  const annotations = asRecord(record?.impairments);
  /** @type {Array<{ cause: string, causeRef: string, severity: number, sinceTick: number, dmOverridden: boolean, cure: string }>} */
  const causes = [];
  for (const cause of Object.keys(annotations).sort()) {
    const annotation = /** @type {ImpairmentAnnotation} */ (annotations[cause]);
    if (!annotation || typeof annotation !== 'object') continue;
    causes.push({
      cause,
      causeRef: String(annotation.causeRef || ''),
      severity: effectiveSeverity(annotation),
      sinceTick: Math.trunc(num(annotation.sinceTick, 0)),
      dmOverridden: annotation.dmSeverity != null,
      cure: INSTITUTION_CAUSE_CURES[cause] || '',
    });
  }

  const impaired = causes.length > 0;
  const shell = isShellInstitution(institution);
  // A shell produces nothing whatever else is wrong with it, so its capacity is
  // exactly zero and the impairment survives only in the flag and the cause list.
  const capacity01 = shell ? 0 : clamp01(1 - combineSeverities(causes.map((c) => c.severity)));
  const status = shell ? STATUS_SHELL : (impaired ? STATUS_IMPAIRED : STATUS_OPERATIONAL);

  /** @type {InstitutionStatusVerdict} */
  const verdict = { status, impaired, shell, capacity01, causes: Object.freeze(causes) };
  // WARM START (law 6): present only on an institution that came BACK from a shell,
  // and it is the capacity that shell remembered. K1 reports the number and does not
  // spend it: there is no output model to multiply until K2.
  if (!shell && record?.priorShell) {
    verdict.warmStart = {
      capacity01: clamp01(num(record.priorShell.capacity01, 0)),
      closedTick: Math.trunc(num(record.priorShell.sinceTick, 0)),
    };
  }
  return verdict;
}

/**
 * Read the status ledger off a world, DEFENSIVELY. A world that never had one, a
 * world whose ledger was dropped, and a world persisted before this layer existed
 * all answer the same way: null.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @returns {InstitutionStatusLedger|null}
 */
export function readInstitutionStatusLedger(worldState) {
  const raw = getSpatialLedger(
    /** @type {Record<string, unknown>} */ (worldState || {}),
    INSTITUTION_STATUS_LEDGER,
  );
  if (!raw || typeof raw !== 'object') return null;
  return /** @type {InstitutionStatusLedger} */ (raw);
}

/**
 * One institution's record off a world, or null. The accessor a surface reads so it
 * never has to know the two-level key law.
 *
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState
 * @param {string|number} cid
 * @param {string} ref
 * @returns {InstitutionStatusRecord|null}
 */
export function readInstitutionStatusRecord(worldState, cid, ref) {
  const ledger = readInstitutionStatusLedger(worldState);
  if (!ledger) return null;
  const forCid = asRecord(ledger[String(cid)]);
  const record = forCid[String(ref)];
  return record && typeof record === 'object'
    ? /** @type {InstitutionStatusRecord} */ (record)
    : null;
}

/**
 * Fold a ledger onto a world, DROP-WHEN-EMPTY.
 *
 * An empty ledger is not written as `{}`; the key is dropped outright, and
 * `dropSpatialLedger` drops the whole `spatialLedgers` namespace with it when this
 * was the last sub-ledger. That is the byte-identity half of dormancy: a world whose
 * every impairment lifted is indistinguishable from a world that never had one, so a
 * lit-then-cleared run cannot quietly break the dormancy golden.
 *
 * Returns a NEW worldState, or the SAME REFERENCE when there was nothing to drop.
 *
 * @param {Record<string, unknown>} worldState
 * @param {InstitutionStatusLedger|null|undefined} ledger
 * @returns {Record<string, unknown>}
 */
export function writeInstitutionStatusLedger(worldState, ledger) {
  /** @type {InstitutionStatusLedger} */
  const kept = {};
  for (const cid of Object.keys(asRecord(ledger)).sort()) {
    const forCid = asRecord(/** @type {InstitutionStatusLedger} */ (ledger)[cid]);
    /** @type {CidStatusLedger} */
    const keptForCid = {};
    for (const ref of Object.keys(forCid).sort()) {
      const record = /** @type {InstitutionStatusRecord} */ (forCid[ref]);
      if (isInstitutionStatusRecordEmpty(record)) continue;
      const impairments = /** @type {Record<string, ImpairmentAnnotation>} */ (
        asRecord(record.impairments)
      );
      keptForCid[ref] = { ...record, impairments: sortedRecord(impairments) };
    }
    if (Object.keys(keptForCid).length > 0) kept[cid] = keptForCid;
  }
  if (Object.keys(kept).length === 0) {
    return dropSpatialLedger(worldState, INSTITUTION_STATUS_LEDGER);
  }
  return setSpatialLedger(worldState, INSTITUTION_STATUS_LEDGER, kept);
}

/**
 * THE NO-ORPHAN AUDIT (§3c: "NEVER orphaned"), walker-style and total.
 *
 * Every stored impairment annotation must (a) name a cause from the closed
 * vocabulary, (b) carry a non-empty causeRef, and (c) have that cause reading LIVE
 * in the state it is bound to. The third is what makes this an orphan check rather
 * than a schema check, and it is why the caller supplies the live index: the audit
 * asks the world, never the ledger, whether a cause still holds.
 *
 * `liveCauses` maps `<cid>` to `<ref>` to the Set of causes live for that
 * institution right now (institutionStatusLifecycle.js builds it). A cid or ref the
 * index does not know is treated as having NO live causes, so a ledger row for a
 * settlement or institution that no longer exists is reported as an orphan rather
 * than silently excused.
 *
 * @param {InstitutionStatusLedger|null|undefined} ledger
 * @param {Record<string, Record<string, Set<string>>>|null|undefined} liveCauses
 * @returns {{ ok: boolean, orphans: Array<{ cid: string, ref: string, cause: string, reason: string }> }}
 */
export function auditInstitutionStatusLedger(ledger, liveCauses) {
  /** @type {Array<{ cid: string, ref: string, cause: string, reason: string }>} */
  const orphans = [];
  const index = liveCauses && typeof liveCauses === 'object' ? liveCauses : {};
  for (const cid of Object.keys(asRecord(ledger)).sort()) {
    const forCid = asRecord(/** @type {InstitutionStatusLedger} */ (ledger)[cid]);
    for (const ref of Object.keys(forCid).sort()) {
      const record = /** @type {InstitutionStatusRecord} */ (forCid[ref]);
      const annotations = asRecord(record?.impairments);
      const live = index[cid]?.[ref];
      for (const cause of Object.keys(annotations).sort()) {
        const annotation = /** @type {ImpairmentAnnotation} */ (annotations[cause]);
        if (!INSTITUTION_IMPAIRMENT_CAUSES.includes(cause)) {
          orphans.push({ cid, ref, cause, reason: 'cause is outside the closed vocabulary' });
          continue;
        }
        if (!annotation || !String(annotation.causeRef || '')) {
          orphans.push({ cid, ref, cause, reason: 'annotation names no live cause instance' });
          continue;
        }
        if (!(live instanceof Set) || !live.has(cause)) {
          orphans.push({ cid, ref, cause, reason: 'the bound cause no longer reads live' });
        }
      }
    }
  }
  return { ok: orphans.length === 0, orphans };
}
