/**
 * worldPulseFates.js — EM-B1h: THE CLOSED, KINDED WORDS THE WORLD PULSE MAY STAMP.
 *
 * A PURE ZERO-IMPORT LEAF. One spelling, one file: two spellings of a fate would let an
 * import forge a history the writer never authored (FINITE-SEMANTICS LAW, and the exact
 * argument `envoyErrandVocabulary.js` already makes for the envoy words). A module that
 * reaches nothing cannot pass truth along, which is why this leaf imports NOTHING at all
 * and why its `ARGUED_UNLAYERED` reach declaration in
 * tests/lint/couplingInclusion.walker.test.js is structurally, not argumentatively, empty.
 *
 * THE VOCABULARY IS DERIVED FROM WHAT THE PULSE ALREADY WRITES, never invented: thirteen
 * write sites in six files (five literal, one argument, three derived, four clearing),
 * seventeen live values, and `ruined_by_decree` as the eighteenth, declared ahead of the
 * op that will produce it. THE PROMISE holds: no saved record becomes invalid, and no
 * record's bytes move.
 *
 * ⛔ `null` IS THE CLEAR SENTINEL AND IS NOT A MEMBER. Four sites write
 * `worldPulseFate: null` to CLEAR a fate when an institution stands again — the reopen
 * (institutionLifecycle :959), the re-raise (:1103), the magic reopen
 * (magicRegimeLifecycle :374) and the tier reactivation (tierOutcomeApply :265) — each
 * beside an 'active' standing with its inactive flags set FALSE. A cleared fate is the
 * ABSENCE of a fate, and `causeLifecycle.institutionDestroyed` reads exactly that
 * distinction through truthiness. Adding `null` here would make "no fate" a fate.
 *
 * ⛔ `ruined_by_decree` IS DECLARED AND UNPRODUCIBLE until EM-B1a's `set-institution-state`
 * op calls `ruinInstitution` with it. It is here so that op lands against a CLOSED set.
 *
 * ⛔⛔ NOTHING READS `WORLD_PULSE_FATE_KIND` YET. It is frozen DATA, and that is what keeps
 * this packet a freeze rather than a cure: no production code branches on a kind. EM-B1i is
 * the packet that makes `causeLifecycle.institutionDestroyed` test the `closure` kind —
 * today that reader decides on the KEY's presence, so the three non-`closure` members (a
 * demoted tower, a reconstructed guild, a flourishing academy) all read as destroyed.
 *
 * ⛔ THIS FILE NAMES NO ENTITY STANDING IN CODE. The LANDED
 * tests/domain/ruinInstitution.test.js A7 asserts the pulse's ruin shape has exactly ONE
 * writer, over a comment-only strip of every non-test src/ file, and this leaf is inside
 * that scan — so a later editor who reaches for a record literal here breaks that arm.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/lint/worldPulseFateTotality.walker.test.js
 */

/** The three answers to "what did this writer do to the institution". */
export const WORLD_PULSE_FATE_KINDS = Object.freeze(['closure', 'rise', 'standing']);

/**
 * Every word the world pulse may stamp on `worldPulseFate`, with its kind.
 *
 * ⭐ EACH KIND WAS DERIVED BY EXECUTION FROM THE SIBLING KEYS OF ITS WRITER'S OWN RECORD
 * LITERAL, never from the fate's English: `closure` means the writer sets
 * `_worldPulseInactive: true` AND a non-active standing; `standing` means it changes
 * neither; `rise` means the institution is raised or founded and active.
 * @type {Readonly<Record<string, string>>}
 */
export const WORLD_PULSE_FATE_KIND = Object.freeze({
  abandoned: 'closure',                     // tierOutcomeApply demotionFateForInstitution :143 (removed)
  abandoned_with_the_settlement: 'closure', // settlementLifecycleFirstClass :601
  abolished: 'closure',                     // institutionLifecycle :1055 <- moralInstitutionPressure :348
  bankrupt: 'closure',                      // closureFateForInstitution :654 ; magicClosureFate :130
  captured_by_local_powers: 'closure',      // tierOutcomeApply :147
  closed_for_want_of_custom: 'closure',     // closureFateForInstitution :655 ; magicClosureFate :130
  demoted_by_disaster: 'standing',          // ⭐ calamityKernel :309 — renamed in place, the slot stays standing
  destroyed_by_disaster: 'closure',         // calamityKernel :317/:321 through ruinInstitution
  disbanded: 'closure',                     // institutionLifecycle :1055 <- moralInstitutionPressure :348
  downsized: 'closure',                     // tierOutcomeApply :146
  founded_by_flourishing: 'rise',           // ⭐ upswingKernel :763 — a NEW active institution
  hollowed_out: 'closure',                  // tierOutcomeApply :148
  privatized: 'closure',                    // tierOutcomeApply :144
  reduced_to_watch_post: 'closure',         // tierOutcomeApply :142
  ruined_by_decree: 'closure',              // ⭐ DECLARED, UNPRODUCIBLE until EM-B1a
  shuttered: 'closure',                     // closureFateForInstitution :653
  survives_as_remnant: 'closure',           // tierOutcomeApply :145
  upgraded_by_reconstruction: 'rise',       // ⭐ upswingKernel :516 — promoted in place, stays active
});

/**
 * The members, in codepoint order — DERIVED, so a member can never lack a kind.
 * @type {readonly string[]}
 */
export const WORLD_PULSE_FATES = Object.freeze(Object.keys(WORLD_PULSE_FATE_KIND));

const FATE_SET = new Set(WORLD_PULSE_FATES);

/**
 * @param {unknown} value
 * @returns {boolean} true when `value` is one of the eighteen words
 */
export function isWorldPulseFate(value) {
  return typeof value === 'string' && FATE_SET.has(value);
}

/**
 * Refuse a fate the pulse may not stamp. The message is spelled ONCE, here, so the
 * guarded writer, EM-B1a's op and EM-B1i's reader never re-spell it.
 * @param {unknown} fate
 * @param {string} caller
 * @returns {void} throws a TypeError on a non-member
 */
export function assertWorldPulseFate(fate, caller) {
  if (!FATE_SET.has(/** @type {string} */ (fate))) {
    throw new TypeError(`${caller}: worldPulseFate '${String(fate)}' is not a member of WORLD_PULSE_FATES.`);
  }
}
