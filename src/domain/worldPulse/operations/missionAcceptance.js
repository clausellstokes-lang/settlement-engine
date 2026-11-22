/**
 * domain/worldPulse/operations/missionAcceptance.js — THE ACCEPTANCE SEAM (W-OPS car O2;
 * DESIGN_W_OPS.md §1, §8 car 2, and §8b's PANEL FOLD, which OUTRANKS them).
 *
 * WHAT THIS HOLDS. The `cast → accepted | refused` step of the one operation walk, and
 * nothing else. It decides whether a person takes the operation they were cast for. It
 * does not choose WHO is cast (the casting laws), does not choose a METHOD, does not
 * resolve, and does not mint a mission — those are other cars, and a leaf that reached
 * into them would be the volume's §7 risk 3 ("a second espionage system by accident")
 * arriving through the acceptance door.
 *
 * ── ⭐⭐ THE RULING THAT SHAPES THE WHOLE LEAF: §8b F4, THE ROOTING FREEZE ─────
 *
 * The fold rules that **the register FREEZES AT ROOTING** — "the man who stayed is the
 * man who decided". A rooted stay's continue-decision reads the appetite the spy ROOTED
 * WITH; drift-raised tolerance applies only to the NEXT operation's acceptance.
 *
 * This is not bookkeeping. ES §3.4b's termination proof is "appetite is fixed ⇒ every
 * stay terminates". A continue-decision that re-read a LIVE register would let a spy who
 * drifts toward boldness raise his own tolerance every interval, and a stay whose exit
 * condition recedes as fast as it is approached NEVER TERMINATES. The freeze is the
 * whole reason this leaf separates `rootedRegister` from `register` instead of taking
 * one; `registerGoverning` is the single place that choice is made, so there is no
 * second opinion about which register a decision read.
 *
 * ── THE WINDOW HAS TWO EDGES, AND BOTH ARE REAL REFUSALS ─────────────────────
 *
 * R6 gives a CENTRE and R8 gives a BREADTH, which makes acceptance a WINDOW and not a
 * ceiling. §1 is explicit that seek-more and seek-less (§803.1 R5) are both expressions
 * of this one seam: the timid man refuses the raid, and the bored veteran refuses the
 * milk run — "the riskier, better-paying mission is ambition's honest door, and
 * declining it is a character statement the principal receipts". So `risk_above_window`
 * and `risk_below_window` are separately named and separately reachable. Folding the
 * low edge into "accepted" would delete half the character the register exists to read.
 *
 * ── ⚠⚠ WHY THIS LEAF'S PRESENCE GUARD IS STRICTER THAN THE REGISTER'S ────────
 *
 * R6 tests a term's presence with `Number.isFinite(Number(x))`. `Number(null)` is `0`
 * and `Number('')` is `0`, and both are FINITE — so a caller who passes `null` for a
 * term it does not hold is recorded as having supplied ZERO. For R6's own two terms the
 * numeric outcome happens to coincide (a desperation lean of 0; the minimum breadth), so
 * the collapse is invisible in `center`/`breadth` and shows ONLY in `absent[]`. A
 * consumer that read the numbers and dropped `absent[]` would silently convert "nobody
 * asked" into "nobody is desperate".
 *
 * This leaf therefore (a) requires a real `number` — `typeof value !== 'number'` rejects
 * `null`, `''`, `true` and `undefined` alike — and (b) PROPAGATES `absent[]` onto every
 * verdict it returns. A decision that was made on a partial reading says so on its face,
 * the SP-C idiom the register itself is built on.
 *
 * ── WHAT IS INJECTED, AND WHY NOTHING IS IMPORTED ────────────────────────────
 *
 * The four seam values (the ⟨F8⟩ vetting verdict, §802 R1 willingness, the §803.1 R6
 * register, the §802 R2 known-character read) are INJECTED, exactly as L5's own consumer
 * `npcGoalBranches.branchedGoalsFor` takes `riskCenter` rather than importing the
 * producer. That is the estate's established shape for consuming R6, and it keeps three
 * guarantees at once: this leaf FORKS NOTHING (⟨F8⟩'s one-home law — the vetting verdict
 * is `sendTwoDivergence.vetVolunteerEnvoy`'s and no second reader is minted here), it
 * adds no cross-layer coupling row, and it stays a pure leaf that a test can drive with
 * the REAL producers on both sides of an absence.
 *
 * PURE. No world state written, no clock, no PRNG, no I/O, no mutation, no store.
 *
 * @see docs/DESIGN_W_OPS.md §1 (the one grammar, the two-scale seam), §8b (F4, F5)
 * @see docs/OWNER_DECISION_QUEUE.md §803.1 (R6/R8), §802 (R1, R2), §806 (⟨F8⟩, F4)
 * @enforced-by tests/domain/missionAcceptance.test.js
 */

/**
 * The verdicts of the acceptance step. Closed, and deliberately TWO: `lapsed` is a
 * state of the operation walk (O1's `OPERATION_STATES`), not a thing a person decides.
 * @type {readonly string[]}
 */
export const ACCEPTANCE_VERDICTS = Object.freeze(['accepted', 'refused']);

/**
 * THE CLOSED REFUSAL VOCABULARY, every entry separately reachable and separately named —
 * O1's `OPERATION_REFUSALS` idiom: a reader whose rejections all read `refused` has
 * proven nothing about which seam caught what, and the refused-mission receipt below
 * cannot tell a brave refusal from a failed background check without this distinction.
 * @type {readonly string[]}
 */
export const ACCEPTANCE_REFUSALS = Object.freeze([
  'invalid_operation',
  'invalid_register',
  'unpriced_operation',
  'vetting',
  'unwilling',
  'risk_above_window',
  'risk_below_window',
]);

/**
 * The order the seams are read in, named so it is a fact rather than a side effect of
 * statement order. RECORDS FIRST, then character — `vetVolunteerEnvoy`'s own header
 * insists on it ("character only speaks about a man the paperwork clears"), and the
 * risk window is read LAST because it is the only seam that needs the operation priced.
 * @type {readonly string[]}
 */
export const ACCEPTANCE_SEAM_ORDER = Object.freeze(['vetting', 'willingness', 'risk']);

/**
 * Which side of the window a priced risk fell on. `unreadable` is an absence, not a
 * silence: an unpriced operation is a different fact from a well-priced safe one.
 * @type {readonly string[]}
 */
export const RISK_WINDOW_SIDES = Object.freeze(['inside', 'above', 'below', 'unreadable']);

/**
 * ⭐ THE R1 WILLINGNESS DOOR — declared, closed, and DARK.
 *
 * §802 R1's willing compromise emits through npcAgency's EXISTING candidate grammar
 * toward a typed patron menu. The kind is named here so the acceptance seam has one
 * spelling of it; it is NOT added to `npcAgency.NPC_ACTION_FAMILIES`, because that map
 * is read live by `deriveNpcCandidates` and a new family there would change the
 * candidate set — and therefore the outcome — of every existing save on its next tick.
 * THE PROMISE forbids that: a seed is a starting world forever.
 *
 * So the door is a DOOR. Dark ⇒ `willingnessCandidate` returns `null` ⇒ zero keys
 * written ⇒ byte-identical, which is the volume §6 dormancy law verbatim. The wave that
 * lights it owns the same-seed shift record.
 */
export const WILLINGNESS_KIND = 'seek_compromise';

/**
 * The owner-taste row that gates the refused-mission receipt: W-REGISTERS-PACK
 * REGISTER VI row 7 — "Refused mission receipted to the principal? Chair lean: yes —
 * brave or career-fatal by the principal's character." UNSIGNED at this tip, so the
 * receipt lands DARK per the O2 packet.
 *
 * ⚠ The volume's §9 row 3 is the SAME call under a different numbering. One row, two
 * addresses; a reader who finds both has not found two decisions.
 */
export const REFUSED_MISSION_RECEIPT_ROW = 'W-REGISTERS-PACK#REGISTER-VI.7';

/**
 * @typedef {Object} RiskRegisterLike
 * @property {number} center
 * @property {number} breadth
 * @property {readonly string[]} [absent]
 */

/**
 * A real, finite `number` in 0..1, or null. DELIBERATELY NOT `Number(v)`: see the header
 * — `null` and `''` coerce to a finite 0 and would be recorded as a supplied zero.
 * @param {unknown} value
 * @returns {number|null}
 */
function unit01(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(1, value));
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * The `absent[]` roster of a register, as a frozen array of plain strings. TOTAL: a
 * register with no roster and a register with an empty one are one case, because both
 * mean "every term this register names was supplied".
 * @param {unknown} register
 * @returns {readonly string[]}
 */
function absentTermsOf(register) {
  const rows = recordOf(register).absent;
  if (!Array.isArray(rows)) return Object.freeze([]);
  return Object.freeze(rows.map(text).filter(Boolean));
}

/**
 * A register that can be read, or null. A register whose centre or breadth is not a real
 * number is not a timid soul — it is not a reading at all, and it refuses as
 * `invalid_register` rather than being folded to the neutral centre.
 * @param {unknown} register
 * @returns {{center:number, breadth:number, absent:readonly string[]}|null}
 */
function readableRegister(register) {
  const row = recordOf(register);
  const center = unit01(row.center);
  const breadth = unit01(row.breadth);
  if (center === null || breadth === null) return null;
  return { center, breadth, absent: absentTermsOf(register) };
}

/**
 * ⭐ THE §8b F4 FREEZE. A snapshot of the register a person ROOTED with, carrying the
 * tick it was taken at so a later reader can prove which decision it belongs to.
 *
 * Frozen by `Object.freeze` rather than by convention: the termination proof depends on
 * this value not moving, and a proof that depends on nobody writing to an object is a
 * proof that depends on nobody making a mistake.
 *
 * @param {unknown} register  a `riskRegister()` result
 * @param {unknown} [rootedAtTick]
 * @returns {{center:number, breadth:number, absent:readonly string[], rootedAtTick:number|null}|null}
 */
export function freezeRegisterAtRooting(register, rootedAtTick) {
  const readable = readableRegister(register);
  if (!readable) return null;
  const tick = typeof rootedAtTick === 'number' && Number.isFinite(rootedAtTick)
    ? rootedAtTick
    : null;
  return Object.freeze({
    center: readable.center,
    breadth: readable.breadth,
    absent: readable.absent,
    rootedAtTick: tick,
  });
}

/**
 * ⭐ THE ONE PLACE THE F4 CHOICE IS MADE. A rooted operation is governed by the register
 * it rooted with; everything else is governed by the live one. Returning the SOURCE
 * alongside the register is what lets a receipt say which appetite decided, and what
 * lets the termination property be asserted rather than hoped.
 *
 * @param {Object} args
 * @param {unknown} [args.register]        the live reading
 * @param {unknown} [args.rootedRegister]  a `freezeRegisterAtRooting` result
 * @returns {{register:{center:number,breadth:number,absent:readonly string[]}|null, source:'rooted'|'live'|'none'}}
 */
export function registerGoverning({ register, rootedRegister } = {}) {
  const rooted = readableRegister(rootedRegister);
  if (rooted) return { register: rooted, source: 'rooted' };
  const live = readableRegister(register);
  if (live) return { register: live, source: 'live' };
  return { register: null, source: 'none' };
}

/**
 * Where a priced risk falls against a register's window. Pure comparison, no verdict:
 * the window is a reading of a person, and whether being outside it refuses is the
 * acceptance step's business, not the window's.
 *
 * @param {Object} args
 * @param {unknown} [args.register]  a readable register
 * @param {unknown} [args.risk01]    0..1, the operation's priced risk; ABSENT ⇒ unreadable
 * @returns {{side:string, distance:number|null, low:number|null, high:number|null}}
 */
export function priceAgainstRegister({ register, risk01 } = {}) {
  const readable = readableRegister(register);
  const risk = unit01(risk01);
  if (!readable || risk === null) {
    return { side: 'unreadable', distance: null, low: null, high: null };
  }
  const low = readable.center - readable.breadth;
  const high = readable.center + readable.breadth;
  if (risk > high) return { side: 'above', distance: risk - high, low, high };
  if (risk < low) return { side: 'below', distance: low - risk, low, high };
  return { side: 'inside', distance: 0, low, high };
}

/**
 * ⭐ THE ACCEPTANCE STEP. Three seams in `ACCEPTANCE_SEAM_ORDER`, each separately
 * refusing, on a register chosen by the F4 rule.
 *
 * `vetting` is the verdict object `sendTwoDivergence.vetVolunteerEnvoy` returns — INJECTED,
 * never re-derived. ⟨F8⟩'s one-home law makes forking a second vetting reader the one
 * thing this car must not do, and taking the verdict as an input is how a leaf consumes a
 * reader it must not duplicate.
 *
 * `willing` is §802 R1's willingness. ABSENT ⇒ TRUE: R1 is a door that has not been lit,
 * and a dark door must not refuse operations that accept today. An explicit `false`
 * refuses; only a caller holding a real willingness read can supply one.
 *
 * @param {Object} args
 * @param {unknown} [args.operationId]
 * @param {unknown} [args.vetting]         a `vetVolunteerEnvoy` verdict
 * @param {unknown} [args.willing]         R1 (§802); absent ⇒ the door is dark ⇒ no refusal
 * @param {unknown} [args.register]        a live `riskRegister` result
 * @param {unknown} [args.rootedRegister]  a `freezeRegisterAtRooting` result (F4)
 * @param {unknown} [args.risk01]          the operation's priced risk, 0..1
 * @returns {{verdict:string, refusal:string, seam:string, registerSource:string, side:string, absent:readonly string[], operationId:string}}
 */
export function decideAcceptance({
  operationId, vetting, willing, register, rootedRegister, risk01,
} = {}) {
  const id = text(operationId);
  const governing = registerGoverning({ register, rootedRegister });
  const absent = governing.register ? governing.register.absent : Object.freeze([]);

  /**
   * @param {string} refusal
   * @param {string} seam
   * @param {string} [side]
   */
  const refuse = (refusal, seam, side = 'unreadable') => Object.freeze({
    verdict: 'refused',
    refusal,
    seam,
    registerSource: governing.source,
    side,
    absent,
    operationId: id,
  });

  if (!id) return refuse('invalid_operation', '');

  // SEAM 1 — THE RECORDS, and ONLY an explicit refusal refuses. An ABSENT verdict is a
  // seat that did not vet, which is not the same as a seat that refused: the estate has
  // no "unvetted" state — `vetVolunteerEnvoy`'s hurried arm still returns `accepted`
  // with basis `no_time_to_look` — so inventing a refusal here would reject operations
  // that accept today. `=== false` and not a truthiness test, so a malformed `0` is not
  // read as a refusal nobody made.
  if (recordOf(vetting).accepted === false) return refuse('vetting', 'vetting');

  // SEAM 2 — WILLINGNESS. Absent is not unwilling; only an explicit `false` refuses.
  if (willing === false) return refuse('unwilling', 'willingness');

  // SEAM 3 — THE WINDOW, on the register F4 says governs.
  if (!governing.register) return refuse('invalid_register', 'risk');
  const priced = priceAgainstRegister({ register: governing.register, risk01 });
  if (priced.side === 'unreadable') return refuse('unpriced_operation', 'risk');
  if (priced.side === 'above') return refuse('risk_above_window', 'risk', 'above');
  if (priced.side === 'below') return refuse('risk_below_window', 'risk', 'below');

  return Object.freeze({
    verdict: 'accepted',
    refusal: '',
    seam: '',
    registerSource: governing.source,
    side: 'inside',
    absent,
    operationId: id,
  });
}

/**
 * THE R1 WILLINGNESS DOOR, dark by default. Returns a typed candidate row for npcAgency's
 * existing candidate grammar when the door is lit, and `null` when it is not — zero keys
 * written, which is what makes the dark case byte-identical.
 *
 * @param {Object} args
 * @param {unknown} [args.lit]        the door; anything but `true` is dark
 * @param {unknown} [args.npcId]
 * @param {unknown} [args.patronId]   the typed patron menu's counterparty
 * @returns {{kind:string, npcId:string, patronId:string}|null}
 */
export function willingnessCandidate({ lit, npcId, patronId } = {}) {
  if (lit !== true) return null;
  const npc = text(npcId);
  const patron = text(patronId);
  if (!npc || !patron) return null;
  return Object.freeze({ kind: WILLINGNESS_KIND, npcId: npc, patronId: patron });
}

/**
 * THE REFUSED-MISSION RECEIPT, dark until the owner signs REGISTER VI row 7.
 *
 * The chair's lean is "yes — brave or career-fatal by the principal's character", which
 * is a real behaviour change (a principal learning of a refusal is a new fact in the
 * world), so it lands DARK per the O2 packet: unsigned ⇒ `null` ⇒ nothing receipted.
 * The refusal vocabulary above is what makes the signed arm cheap — the receipt already
 * knows whether the man was refused BY the seat or refused it HIMSELF.
 *
 * @param {Object} args
 * @param {unknown} [args.signed]     the owner's pen on row 7; anything but `true` is dark
 * @param {unknown} [args.decision]   a `decideAcceptance` result
 * @param {unknown} [args.principalId]
 * @returns {{row:string, principalId:string, operationId:string, refusal:string, byThePerson:boolean}|null}
 */
export function refusedMissionReceipt({ signed, decision, principalId } = {}) {
  if (signed !== true) return null;
  const row = recordOf(decision);
  if (row.verdict !== 'refused') return null;
  const principal = text(principalId);
  const refusal = text(row.refusal);
  if (!principal || !refusal) return null;
  // WHO refused is the whole drama of row 7: a man the seat rejected is not a man who
  // said no. Only the person's own seams make a refusal his.
  const byThePerson = refusal === 'unwilling'
    || refusal === 'risk_above_window'
    || refusal === 'risk_below_window';
  return Object.freeze({
    row: REFUSED_MISSION_RECEIPT_ROW,
    principalId: principal,
    operationId: text(row.operationId),
    refusal,
    byThePerson,
  });
}

/**
 * Provenance, in the module, the L1 catalog's idiom.
 * @type {Readonly<{status:string, signedBy:string|null, ownerRows:readonly string[], consumes:readonly string[]}>}
 */
export const ACCEPTANCE_PROVENANCE = Object.freeze({
  status: 'CANDIDATE',
  signedBy: null,
  ownerRows: Object.freeze([REFUSED_MISSION_RECEIPT_ROW]),
  consumes: Object.freeze([
    'sendTwoDivergence.js#vetVolunteerEnvoy',
    'characterConsumers.js#riskRegister',
    'knownCharacter.js#characterAsSeenBy',
  ]),
});
