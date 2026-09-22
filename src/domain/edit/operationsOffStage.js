/**
 * operationsOffStage.js — THE SEVEN OFF-STAGE OPS UNDER THE PHANTOM CONSEQUENCE RULE
 * (EM-B1b, wave 1; design §13, ODQ §934.43, ARCH §9's off-stage list).
 *
 * THE OWNER'S RULE, carried as DECLARED DATA and nothing else: a phantom counterparty
 * can absorb an act but never return one. Each row therefore carries
 * `consequence: 'by-target-reality'`, and the resolver that reads that flag at apply time
 * is EM-F1's. Nothing here computes a consequence, returns a force, or writes a world fact.
 *
 * ⛔ THIS MODULE IMPORTS NOTHING AT RUN TIME. `operations.js` imports THIS module's four
 * groups, so a value import back for `OP_STAGES` / `OP_CONSEQUENCE_POLICIES` would be a
 * module cycle whose `const` bindings sit in the temporal dead zone at initialisation
 * (EM-B1c1's ratified shape). The two typedefs below are TYPE-ONLY `import(...)`
 * references: they erase at emit, create no runtime edge, and membership of the two closed
 * vocabularies is asserted from the TEST, where there is no cycle.
 *
 * ⛔ FOUR EXPORTED GROUPS, NOT ONE MAP, and that is MEASURED rather than chosen
 * (judgment 92). Run through the tree's own `compareCodepoint`, the seven keys form FOUR
 * discontiguous runs inside the home roster, and object spread fixes a key's position at
 * its FIRST insertion — so one map spread four times still lands all seven at the first
 * anchor, and a trailing spread puts them last and reds the catalogue's order arm.
 *
 * ⛔ NO PHANTOM-SIDE STATE, EVER. Every `requires.world` is EMPTY: a prerequisite names a
 * prior ENTRY IN THE REGISTRY, never a war state, treaty, route or envoy state on the
 * phantom's side. That is design §13's clause (d) made structural by the row shape.
 */

/** @typedef {import('./operations.js').OpTypeDeclaration} OpTypeDeclaration */
/** @typedef {import('./operations.js').PayloadFieldSpec} PayloadFieldSpec */

/** The off-stage stage member, spelled as a literal: `OP_STAGES` is not importable here. */
const OFF_STAGE = /** @type {const} */ ('off-stage');
/** The off-stage consequence policy, spelled as a literal for the same reason. */
const BY_TARGET_REALITY = /** @type {const} */ ('by-target-reality');

/**
 * ARCH §5's "stated when empty" — guard coverage is legitimately empty at this wave and
 * still owes a statement, so every row shares this one.
 *
 * ⛔ IT NAMES ITS OWNERS BY PACKET ID AND SPELLS NO RESOLVER SYMBOL. The catalogue's own
 * counterforce scan runs over the comment-stripped source, which KEEPS string text, so a
 * sentence naming the apply-time resolver would convict prose that writes nothing.
 */
const GUARDS_STATED = 'No guard is wired here. EM-C3 owns the rules for every off-stage act, and the consequence a phantom target admits is resolved at apply time by EM-F1.';

/** @param {boolean} required @returns {PayloadFieldSpec} */
const freeField = (required) => Object.freeze({ kind: 'free', required });
/** @param {boolean} required @returns {PayloadFieldSpec} */
const refField = (required) => Object.freeze({ kind: 'ref', required });
/** @param {boolean} required @returns {PayloadFieldSpec} */
const intField = (required) => Object.freeze({ kind: 'int', required });
/** @param {string} pool @param {boolean} required @returns {PayloadFieldSpec} */
const poolField = (pool, required) => Object.freeze({ kind: 'pool', pool, required });
/** @param {readonly string[]} values @param {boolean} required @returns {PayloadFieldSpec} */
const enumField = (values, required) => Object.freeze({ kind: 'enum', values, required });

/** The outcome vocabulary a resolved errand reports, in codepoint order. */
const OFF_STAGE_OUTCOMES = Object.freeze(['lost', 'won']);

/**
 * The row freezer. `operations.js`'s own `row()` is module-private and unreachable here
 * for the same cycle reason, so this leaf freezes its own rows to the identical depth and
 * mints no second validator, constructor or vocabulary.
 * @param {OpTypeDeclaration} decl @returns {OpTypeDeclaration}
 */
function offRow(decl) {
  return Object.freeze({
    ...decl,
    payload: Object.freeze(decl.payload),
    requires: Object.freeze({
      world: Object.freeze(decl.requires.world),
      registry: Object.freeze(decl.requires.registry),
    }),
    enables: Object.freeze(decl.enables),
    relatedTo: Object.freeze(decl.relatedTo),
    conflictsWith: Object.freeze(decl.conflictsWith),
    guards: Object.freeze(decl.guards),
  });
}

/** SPLICE 1 — after `add-npc`, before `found-phantom`. */
export const OFF_1 = Object.freeze({
  'close-trade': offRow({
    target: 'phantom',
    payload: { counterparty: refField(true), cause: poolField('cause.remove', false) },
    stage: OFF_STAGE, consequence: BY_TARGET_REALITY,
    requires: { world: [], registry: ['open-trade'] },
    enables: [], relatedTo: [], conflictsWith: ['open-trade'],
    duration: null, guards: [],
    guardsStated: GUARDS_STATED,
  }),
  'declare-war': offRow({
    target: 'phantom',
    payload: { counterparty: refField(true), casusBelli: freeField(false) },
    stage: OFF_STAGE, consequence: BY_TARGET_REALITY,
    requires: { world: [], registry: [] },
    enables: ['make-peace', 'send-force'], relatedTo: [], conflictsWith: ['make-peace', 'open-trade'],
    duration: null, guards: [],
    guardsStated: GUARDS_STATED,
  }),
});

/** SPLICE 2 — after `found-phantom`, before `promote-phantom`. */
export const OFF_2 = Object.freeze({
  'make-peace': offRow({
    target: 'phantom',
    payload: { counterparty: refField(true), terms: freeField(false) },
    stage: OFF_STAGE, consequence: BY_TARGET_REALITY,
    requires: { world: [], registry: ['declare-war'] },
    enables: [], relatedTo: [], conflictsWith: ['declare-war'],
    duration: null, guards: [],
    guardsStated: GUARDS_STATED,
  }),
  'open-trade': offRow({
    target: 'phantom',
    payload: { counterparty: refField(true), commodity: freeField(false) },
    stage: OFF_STAGE, consequence: BY_TARGET_REALITY,
    requires: { world: [], registry: [] },
    enables: ['close-trade'], relatedTo: [], conflictsWith: ['close-trade', 'declare-war'],
    duration: null, guards: [],
    guardsStated: GUARDS_STATED,
  }),
});

/** SPLICE 3 — after `rebalance-power`, before `remove-faction`. */
export const OFF_3 = Object.freeze({
  'recall-force': offRow({
    target: 'phantom',
    payload: { counterparty: refField(true) },
    stage: OFF_STAGE, consequence: BY_TARGET_REALITY,
    requires: { world: [], registry: ['send-force'] },
    enables: [], relatedTo: [], conflictsWith: ['send-force'],
    duration: null, guards: [],
    guardsStated: GUARDS_STATED,
  }),
});

/** SPLICE 4 — after `remove-npc`, before `set-field`. */
export const OFF_4 = Object.freeze({
  'resolve-outcome': offRow({
    target: 'phantom',
    payload: { counterparty: refField(true), outcome: enumField(OFF_STAGE_OUTCOMES, true) },
    stage: OFF_STAGE, consequence: BY_TARGET_REALITY,
    requires: { world: [], registry: ['send-force'] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: GUARDS_STATED,
  }),
  'send-force': offRow({
    target: 'phantom',
    payload: { counterparty: refField(true), strength: intField(true) },
    stage: OFF_STAGE, consequence: BY_TARGET_REALITY,
    requires: { world: [], registry: ['declare-war'] },
    enables: ['recall-force', 'resolve-outcome'], relatedTo: [], conflictsWith: ['recall-force'],
    duration: null, guards: [],
    guardsStated: GUARDS_STATED,
  }),
});

/**
 * The seven as ONE handle, for the acceptance batteries. The four groups are already
 * codepoint-ordered among themselves, so this composition is ordered too.
 * @type {Readonly<Record<string, OpTypeDeclaration>>}
 */
export const OFF_STAGE_OP_TYPES = Object.freeze({
  ...OFF_1,
  ...OFF_2,
  ...OFF_3,
  ...OFF_4,
});
