/**
 * operationGrammar.js — W-OPS car O1: THE ONE GRAMMAR every operation walks.
 *
 * docs/DESIGN_W_OPS.md §1 (the unified operation model) and §0 (the task qualification
 * law). ODQ §803. This leaf carries the TYPED OPERATION RECORD and its validators, plus
 * the mission-kind catalog as OWNER-UNSIGNED CANDIDATE DATA. It decides nothing, rolls
 * nothing, and reaches no world.
 *
 * ── WHAT "ONE GRAMMAR" MEANS, STATED BEFORE THE TABLES ────────────────────────────────
 * Three operation CLASSES differing only in who wills them — GOAL (the NPC, endogenous),
 * MISSION (a principal: court, faction, patron, cult), ERRAND (a seat, travel-borne) —
 * and ONE walk for all three:
 *
 *   charter → cast → accept | refuse → method → resolve → receipt
 *
 * The walk is the whole point. A GOAL that skipped acceptance and a MISSION that skipped
 * method would be two systems wearing one word, and the volume's §7 risk 3 ("a second
 * espionage system by accident") is exactly what a shared state machine prevents.
 *
 * ── ⛔ THE TASK QUALIFICATION LAW, MADE MECHANICAL RATHER THAN PROMISED ────────────────
 * DESIGN_W_OPS §0: "a mission or task kind registers only if its resolution writes an
 * ALREADY-RECEIPTED outcome family" — the §800 source law transposed to operations. A
 * catalog row therefore names its receipt family AND carries the verdict of a census run
 * against the live tree. A row whose family could not be found, or whose family exists but
 * cannot be REACHED from this kind's resolution, carries `sourceUnverified: true` and is
 * absent from `DISPATCHABLE_MISSION_KINDS`.
 *
 * ⭐ THE POINT OF THE UNVERIFIED ROW IS THAT IT STAYS. Deleting the three unqualified kinds
 * would make this catalog look complete and would lose the finding; wiring them to a
 * plausible-looking writer would ship a phantom. The L3 idiom is to CARRY the kind, mark
 * it, and let the wave that builds the family clear the mark — and the pin in
 * tests/domain/operationGrammar.test.js reds the day a marked kind is dispatched.
 *
 * ── ⛔ EVERY ROW IS OWNER-UNSIGNED (`signedBy: null`), AND THAT IS A PIN, NOT A DEFAULT ──
 * docs/briefs/W-REGISTERS-PACK.md REGISTER V is a CANDIDATE register: the mission kinds,
 * the envoy task rows and the depth rates are owner-taste and are frozen only by the
 * owner's pen (DESIGN_W_OPS §8's registers, ODQ §803 row 1). `signedBy: null` on every row
 * says so in the data rather than in a comment, and the totality pin asserts it, so a
 * signature can only ever arrive as a visible diff the owner authored.
 *
 * ── DARK: THIS LEAF HAS NO PRODUCTION CALLER, BY CONSTRUCTION ──────────────────────────
 * Nothing under src/ imports this module; tests/domain/operationGrammar.test.js walks the
 * whole src tree and asserts the empty importer set, so the day a caller appears the
 * closure walker reds and the wiring is a visible act. No flag is minted here — the door
 * seam is NAMED in missionDispatcher.js's header (`missionDispatcherEnabled`, the
 * CR-WR10-C virtual-flag mint) and is the flag car's to open.
 *
 * PURE: no Date, no Math.random, no store, no I/O, no mutation, no rng. Every export is
 * frozen data or a total function over its arguments.
 *
 * @enforced-by tests/domain/operationGrammar.test.js
 */

/**
 * THE THREE CLASSES — who wills the operation. Closed, and the order is the volume's own
 * (endogenous → principal-willed → travel-borne), which is also the order of increasing
 * distance between the actor and the will.
 */
export const OPERATION_CLASSES = Object.freeze(['GOAL', 'MISSION', 'ERRAND']);

/**
 * THE STATES OF THE ONE WALK. `refused` and `receipted` are terminal on the ordinary road;
 * `lapsed` is the DM's mandate — DESIGN_W_OPS §1's "a player/user act interrupts anywhere"
 * — and is reachable from EVERY non-terminal state, which is why it is listed last rather
 * than in walk order.
 */
export const OPERATION_STATES = Object.freeze([
  'chartered',
  'cast',
  'accepted',
  'refused',
  'method_chosen',
  'resolved',
  'receipted',
  'lapsed',
]);

/** The states no transition may leave. */
export const OPERATION_TERMINAL_STATES = Object.freeze(['refused', 'receipted', 'lapsed']);

/**
 * THE ADJACENCY, spelled as data so the walk can be walked rather than trusted.
 *
 * ⚠ `accepted` does NOT flow back to `cast`. A re-cast after a refusal is a NEW operation
 * with its own charter — the volume's acceptance seam reads a person's register at ONE
 * moment, and letting one operation shop for an acceptor would turn a real refusal
 * (⟨F8⟩'s whole subject) into a retry loop.
 */
export const OPERATION_TRANSITIONS = Object.freeze({
  chartered: Object.freeze(['cast', 'lapsed']),
  cast: Object.freeze(['accepted', 'refused', 'lapsed']),
  accepted: Object.freeze(['method_chosen', 'lapsed']),
  refused: Object.freeze([]),
  method_chosen: Object.freeze(['resolved', 'lapsed']),
  resolved: Object.freeze(['receipted', 'lapsed']),
  receipted: Object.freeze([]),
  lapsed: Object.freeze([]),
});

/**
 * THE VERDICT VOCABULARY of the receipt-family census. Two words only: a family either was
 * found and is reachable from this kind's resolution, or it was not. A third word
 * ("partial") is deliberately absent — the estate's recorded hazard is that PARTIAL is the
 * status that hides, so a kind that can half-write is `unverified` and says why in its note.
 */
export const RECEIPT_SOURCE_VERDICTS = Object.freeze(['verified', 'unverified']);

/**
 * ── REGISTER V, THE MISSION-KIND CATALOG ───────────────────────────────────────────────
 *
 * Loaded from docs/briefs/W-REGISTERS-PACK.md REGISTER V verbatim as to MEMBERSHIP, and
 * carrying this lane's own census as to QUALIFICATION. Every row is owner-unsigned.
 *
 * `receiptWriter` and `receiptModule` are the SYMBOL and the PATH the census actually
 * found and read — not the family's marketing name — so a reader can re-run the census by
 * opening one file. Where the verdict is `unverified` the note names what is missing, in
 * enough detail that the wave which clears it knows what it is building.
 *
 * ⚠ THE PATHS ARE DATA A WALKER READS, not prose: the totality pin resolves every
 * `receiptModule` of a `verified` row against the live tree and reds if one moves, so a
 * rename cannot leave this catalog quietly pointing at nothing.
 */
export const MISSION_KIND_CATALOG = Object.freeze([
  Object.freeze({
    kind: 'confirm_belief',
    operationClass: 'MISSION',
    receiptFamily: 'espionage_product_confirm',
    receiptWriter: 'landEspionageProduct',
    receiptModule: 'src/domain/worldPulse/espionage/espionageProducts.js',
    sourceVerdict: 'verified',
    sourceNote:
      'the ES product triad CONFIRM arm; the writer lands a synthetic report into '
      + 'spatialLedgers.beliefMaps through the belief road, and is one of the six licensed '
      + 'beliefMaps writers named in ledgerOwnershipManifest.js',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'acquire_intel',
    operationClass: 'MISSION',
    receiptFamily: 'espionage_product_acquire',
    receiptWriter: 'landEspionageProduct',
    receiptModule: 'src/domain/worldPulse/espionage/espionageProducts.js',
    sourceVerdict: 'verified',
    sourceNote:
      'the ACQUIRE arm — the only product that may CREATE a belief; it crosses exactly the '
      + 'appraisal legs the mission named and lands through the same one writer',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'refute_claim',
    operationClass: 'MISSION',
    receiptFamily: 'espionage_product_refute',
    receiptWriter: 'landEspionageProduct',
    receiptModule: 'src/domain/worldPulse/espionage/espionageProducts.js',
    sourceVerdict: 'verified',
    sourceNote:
      'the REFUTE arm — the sweeping branch, which crosses every readable slot so the '
      + 'contradiction term can bite, then lands through the same one writer',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'counter_lie',
    operationClass: 'MISSION',
    receiptFamily: 'information_statecraft_lie_stigma',
    receiptWriter: 'advanceNpcCredibility',
    receiptModule: 'src/domain/worldPulse/npcCredibility.js',
    sourceVerdict: 'verified',
    sourceNote:
      'the contradict arm homes on the EXISTING lie machinery rather than on a second one: '
      + 'informationStatecraft detects the contradiction and advanceNpcCredibility deposits '
      + 'the deception delta and the exposed band into the npcCredibility ledger',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'place_agent',
    operationClass: 'MISSION',
    receiptFamily: 'infiltration_placement',
    receiptWriter: null,
    receiptModule: null,
    sourceVerdict: 'unverified',
    sourceUnverified: true,
    sourceNote:
      'NO PLACEMENT OR COVER WRITER EXISTS, and the tree declares the gap in its own words: '
      + 'espionageProductStage.js records that the inside-asset predicate is INJECTED and '
      + 'this estate has no producer for it anywhere under src, so the deepest tap rung is a '
      + 'declared dead arm. The L3 cover object is additionally a RECON-THEN-OWNER-GATE row '
      + '(ODQ §806 F15): declaredPurpose is journey-scoped and journeys terminate, so a '
      + 'standing cover is NEW PERSISTED SCHEMA and is never assumed. Car O3 designs it.',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'task_mole',
    operationClass: 'MISSION',
    receiptFamily: 'corruption_web_tasking',
    receiptWriter: null,
    receiptModule: null,
    sourceVerdict: 'unverified',
    sourceUnverified: true,
    sourceNote:
      'the corruption web writes RECRUITMENT (mintLeashOnto) and EXPOSURE '
      + '(applyForeignExposureBlowback), and neither is a patron-issued task: the census '
      + 'found no tasking record family anywhere under src. ODQ §806 F8 rules that L4 '
      + 'placement enrolls through the web CREATION seam, so the caps and the '
      + 'recruitment-degradation rules apply — but enrolling is not tasking, and the tasking '
      + 'family is car O3 to build or to refuse.',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'extract_agent',
    operationClass: 'MISSION',
    receiptFamily: 'foreign_guest_hold_covert',
    receiptWriter: null,
    receiptModule: null,
    sourceVerdict: 'unverified',
    sourceUnverified: true,
    sourceNote:
      '⚠ THE FAMILY IS REAL AND THE ROAD INTO IT IS NOT — which is exactly the case a '
      + 'two-word verdict must not soften. foreignGuestHold.js is a proper single-writer '
      + 'custody ledger and `caught_spying` is a declared member of its cause vocabulary, '
      + 'but NO CALL SITE ANYWHERE PASSES THAT CAUSE: the espionage capture arm computes the '
      + 'capture, receipts it in its return value, and hands back custodyWritten:false with '
      + 'the blocking reason, because the errand DTO refuses the held state for a row '
      + 'carrying no army encounter. Relaxing that shape is a persisted-schema question and '
      + 'this estate gates those on the owner. The kind qualifies the day the ES charter '
      + 'opens its own capture arm, and not before.',
    signedBy: null,
  }),
]);

/** Every kind the catalog carries, in catalog order. Derived — never transcribed. */
export const MISSION_KINDS = Object.freeze(MISSION_KIND_CATALOG.map((row) => row.kind));

/**
 * The kinds the task qualification law admits. DERIVED from the verdict column, so a row
 * that flips to `verified` becomes dispatchable in the same edit and no second list can
 * disagree with the first.
 */
export const DISPATCHABLE_MISSION_KINDS = Object.freeze(
  MISSION_KIND_CATALOG.filter((row) => row.sourceVerdict === 'verified').map((row) => row.kind),
);

/**
 * ── THE ACCEPTANCE SEAMS: FOUR NOW BOUND, ONE STILL PINNED ABSENT ──────────────────────
 *
 * DESIGN_W_OPS §1 rules that the `cast → accepted | refused` step reads four things: the
 * ⟨F8⟩ vetting refusal, §802 R1 WILLINGNESS, §803.1 R6's personal RISK REGISTER, and §802
 * R2's KNOWN CHARACTER of the counterparty. When this leaf was written, three of those
 * four lived in W-LIVES cars that had not landed on its branch, so the roster NAMED each
 * seam, measured it absent, and pinned the absence with a producer census.
 *
 * ⭐ THE CENSUS FIRED, EXACTLY AS DESIGNED, AT THE SUBSTRATE COUPLING — the first tree on
 * which W-LIVES' producers and this grammar have ever stood together. Its instruction was
 * that "the wave that landed it must come back and wire acceptance rather than leaving a
 * seam that has quietly outlived its own fact", and this roster is that discharge: the
 * three landed seams now carry the module and the EXPORTED SYMBOL a reader can open, plus
 * the ROUTE acceptance reads them through, and the census RESOLVES all three against the
 * live tree instead of grepping for a name.
 *
 * ⛔⛔ AND THE COUPLING CORRECTED THE ROSTER'S OWN SPELLING, WHICH IS THE FINDING WORTH
 * MORE THAN THE FLIP. The `known_character` row awaited `knownCharacter`. NO SUCH SYMBOL
 * EXISTS ANYWHERE IN THE ESTATE: the reader is `knownCharacterOf`, and every one of the
 * census's matches on the old spelling was a COMMENT — three files explaining themselves,
 * plus this leaf's own roster string. A mention census reports arrival for prose; a
 * resolving census cannot. The row now names the real export and the pin opens the file.
 *
 * ⛔ NOTHING HERE IMPORTS A PRODUCER, AND THAT IS UNCHANGED BY THE FLIP. `characterDrift`
 * is pinned by its own suite to exactly ONE production door and `knownCharacter` to ZERO
 * src importers; those darknesses are cars L4's and L5's and are not this leaf's to
 * spend. `consumedThrough` therefore records the CHOKEPOINT each seam is read through
 * rather than a direct reach, and the reading itself lives in the supplier leaf named on
 * every bound row.
 *
 * ⭐ THE FIFTH SEAM STAYS PINNED ABSENT AND ITS ROW STAYS. §802 R1's willingness door has
 * landed NOWHERE A PRODUCER READS IT — the census scans `src/` outside `operations/`, where
 * O2's `WILLINGNESS_KIND` and its tests name the word unwired — so wiring it would mint a
 * second spelling of a law nobody has written; the day W-LIVES lands it, this reds again.
 */
export const ACCEPTANCE_SEAMS = Object.freeze([
  Object.freeze({
    seam: 'vetting_refusal',
    awaitedSymbol: 'vetVolunteerEnvoy',
    home: 'src/domain/worldPulse/sendTwoDivergence.js',
    consumedThrough: 'acceptanceCharacterReads.vettingInputFor — the INPUT ROW is composed and the verdict is left to the one home',
    ruling: 'ODQ §806 ⟨F8⟩ — one vetting home, importance-DESCENDING; neither program forks a second',
    landed: true,
  }),
  Object.freeze({
    seam: 'willingness',
    awaitedSymbol: 'seek_compromise',
    home: null,
    consumedThrough: null,
    ruling: 'ODQ §802 R1 — willing compromise emits through npcAgency\'s EXISTING candidate grammar toward a typed patron menu; acceptance is a REAL refusal reading the seeker\'s KNOWN character',
    landed: false,
  }),
  Object.freeze({
    seam: 'risk_register',
    awaitedSymbol: 'riskRegister',
    home: 'src/domain/npc/characterConsumers.js',
    consumedThrough: 'acceptanceCharacterReads.acceptanceCharacterRead — the register is called on the chokepoint, and its absent[] is propagated whole',
    ruling: 'ODQ §803.1 R6/R8 — DERIVED never stored: centre from effective character × home-desperation, breadth from the CHAOS projection. ⚠ ODQ §806 F4: the register FREEZES AT ROOTING, so a rooted stay re-reads the appetite it rooted with and the §3.4b termination proof stands',
    landed: true,
  }),
  Object.freeze({
    seam: 'known_character',
    awaitedSymbol: 'knownCharacterOf',
    home: 'src/domain/npc/knownCharacter.js',
    consumedThrough: 'acceptanceCharacterReads — the KNOWN chart is an ARGUMENT (§14 GAP D: the caller runs the query), banded by the chokepoint\'s vettingTemperBand',
    ruling: 'ODQ §802 R2 + §802.1 — CHOOSE ON KNOWN, RESOLVE ON TRUE; mortals read reputation, deities keep true-sight',
    landed: true,
  }),
  Object.freeze({
    seam: 'effective_character',
    awaitedSymbol: 'effectiveCharacter',
    home: 'src/domain/npc/characterDrift.js',
    consumedThrough: 'acceptanceCharacterReads — reached ONLY as the chokepoint already reaches it; the drift family keeps its one production door',
    ruling: 'W-LIVES L5 — the chokepoint every consumer re-routes through; core + drift, sparse',
    landed: true,
  }),
]);

/**
 * THE SUPPLIER the bound rows above are read through — named as a constant rather than
 * left to a search, the `PARADIGM_WORD_PROJECTION_SEAM` idiom. Acceptance's character
 * half lives there and NOT here, because this leaf decides nothing and reaches nothing.
 */
export const ACCEPTANCE_SUPPLIER_SEAM = 'src/domain/npc/acceptanceCharacterReads.js';

/**
 * THE CLOSED REFUSAL VOCABULARY of `normalizeOperation`. Every refusal is separately
 * reachable and separately named: a validator whose rejections all read `malformed` has
 * proven nothing about which arm caught what.
 */
export const OPERATION_REFUSALS = Object.freeze([
  'not_a_row',
  'missing_operation_id',
  'unknown_class',
  'unknown_kind',
  'class_kind_mismatch',
  'missing_principal',
  'missing_subject',
  'unknown_state',
  'kind_unqualified',
]);

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @type {ReadonlyMap<string, (typeof MISSION_KIND_CATALOG)[number]>} */
const KIND_INDEX = new Map(MISSION_KIND_CATALOG.map((row) => [row.kind, row]));

/**
 * The catalog row for a kind, or null. The ONE lawful reader of the catalog — consumers
 * derive their recognized set from here rather than transcribing a second copy.
 *
 * @param {unknown} kind
 * @returns {(typeof MISSION_KIND_CATALOG)[number] | null}
 */
export function missionKindRow(kind) {
  return KIND_INDEX.get(text(kind)) || null;
}

/**
 * Does the task qualification law admit this kind for dispatch?
 *
 * A kind absent from the catalog is NOT dispatchable, and neither is one whose receipt
 * family the census could not reach. Both refuse the same way and for the same reason: an
 * operation that cannot write its outcome is a mission that leaves no trace.
 *
 * @param {unknown} kind
 * @returns {boolean}
 */
export function isDispatchableKind(kind) {
  const row = missionKindRow(kind);
  return row !== null && row.sourceVerdict === 'verified';
}

/**
 * May this operation walk from `from` to `to`?
 *
 * @param {unknown} from
 * @param {unknown} to
 * @returns {boolean}
 */
export function mayTransition(from, to) {
  const allowed = /** @type {Record<string, readonly string[]>} */ (OPERATION_TRANSITIONS)[text(from)];
  return Array.isArray(allowed) && allowed.includes(text(to));
}

/**
 * THE TOTAL-ON-GARBAGE VALIDATOR. Returns the exact-key record, or `null` with the reason
 * available from `operationRefusal` on the same input — the errand family's own discipline
 * (normalize to ABSENT, never to a half-record that reads as real).
 *
 * `qualified` is checked ONLY for MISSION rows. A GOAL is willed by the NPC and an ERRAND
 * by a seat; neither passes through the mission-kind catalog, and demanding a catalog row
 * of them would make the grammar unusable for two of its three classes.
 *
 * @param {unknown} row
 * @returns {{operationId: string, operationClass: string, kind: string, principalId: string,
 *   subjectId: string, state: string} | null}
 */
export function normalizeOperation(row) {
  if (operationRefusal(row) !== null) return null;
  const src = /** @type {Record<string, unknown>} */ (row);
  return {
    operationId: text(src.operationId),
    operationClass: text(src.operationClass),
    kind: text(src.kind),
    principalId: text(src.principalId),
    subjectId: text(src.subjectId),
    state: text(src.state) || 'chartered',
  };
}

/**
 * WHY a row would be refused, from the closed vocabulary — or `null` when it is lawful.
 * Arms are ordered cheapest-first and each is separately reachable.
 *
 * @param {unknown} row
 * @returns {string | null}
 */
export function operationRefusal(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return 'not_a_row';
  const src = /** @type {Record<string, unknown>} */ (row);
  if (!text(src.operationId)) return 'missing_operation_id';
  const operationClass = text(src.operationClass);
  if (!OPERATION_CLASSES.includes(operationClass)) return 'unknown_class';
  const kind = text(src.kind);
  if (!kind) return 'unknown_kind';
  if (!text(src.principalId)) return 'missing_principal';
  if (!text(src.subjectId)) return 'missing_subject';
  const state = text(src.state) || 'chartered';
  if (!OPERATION_STATES.includes(state)) return 'unknown_state';
  if (operationClass === 'MISSION') {
    const catalogRow = missionKindRow(kind);
    if (catalogRow === null) return 'unknown_kind';
    if (catalogRow.operationClass !== operationClass) return 'class_kind_mismatch';
    if (catalogRow.sourceVerdict !== 'verified') return 'kind_unqualified';
  }
  return null;
}

/**
 * Walk one lawful step. Returns the moved record, or `null` when the step is not in the
 * adjacency — the caller learns nothing it could mistake for success.
 *
 * @param {unknown} operation
 * @param {unknown} nextState
 * @returns {ReturnType<typeof normalizeOperation>}
 */
export function advanceOperation(operation, nextState) {
  const normalized = normalizeOperation(operation);
  if (normalized === null) return null;
  if (!mayTransition(normalized.state, nextState)) return null;
  return { ...normalized, state: text(nextState) };
}
