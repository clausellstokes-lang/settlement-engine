/**
 * operations.js — THE FOURTEEN HOME OPS, ONE CONSTRUCTOR, ONE VALIDATOR
 * (EM-B1a, wave 1; ARCH §1/§2/§5/§9, design §12/§13/§18, ODQ §934.43/§934.46/§934.50).
 *
 * The estate's single typed vocabulary of what a DM may do to a settlement AT HOME.
 * `makeOp` builds one op; `validateOp` judges one; nothing anywhere constructs an op
 * another way. The leaf lands DARK: no writer, no consumer, zero importers at this tip,
 * and EM-C4's ONE generic adapter is its first caller.
 *
 * ⛔ THE ROSTER IS FOURTEEN, AND THE SPLIT IS DELIBERATE (the chair's ruling R8). The
 * three `rename-*` types and `set-world-fact` sit with EM-B1c because they DELEGATE to
 * machinery another packet owns — the rename cascade in `factionRename.js`, and the
 * re-derivation engine that is EM-B2's — and `schedule-event` rides with them. This
 * module therefore defines NO rename logic, re-implements NO join surface, resolves NO
 * pool and re-derives NOTHING. A1 and A5 assert those absences by name so the split
 * cannot be quietly re-absorbed.
 *
 * ⛔ EVERY FIELD IS REQUIRED ON EVERY ROW. None is optional; none may be omitted "when
 * empty". An empty relation is `[]`, an absent duration is `null`, and empty guard
 * coverage is `guards: []` plus a non-empty `guardsStated`. A row missing a field is an
 * A1 red, not a default — because the `Op` shape is PERSISTED by EM-B3 inside a
 * `Decree`, so a field added later is a stored-shape change with a migration cost.
 *
 * ⭐ THE DECLARATION CARRIES ELEVEN KEYS AND THE `Op` CARRIES TEN, AND THEY ARE
 * DIFFERENT COUNTS. `requires` is the `{ world, registry }` SPLIT on the declaration and
 * a FLAT array on the `Op`, which is why `makeOp` flattens: EM-A1's built `types.js`
 * declares `Op.requires: readonly string[]`, and copying the pair across would red
 * `typecheck:domain:strict`. The KINDS stay readable where they are judged, on the
 * declaration, which is what the guards read.
 *
 * ⛔ `validateOp` NEVER REFUSES AN ACTION. `ok: false` means malformed, not disallowed.
 * Its step 3 checks the target's kind for MEMBERSHIP of the closed seven and never for a
 * MATCH against the row's declared target, and applies no name rule: both are closed at
 * the door by EM-C4a, and a second authority on one refusal is the shape design §12.13
 * exists to prevent.
 */

/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./types.js').EntityRef} EntityRef */

import { compareCodepoint } from '../deterministicSort.js';
import { NPC_STATUS_VALUES } from '../entities/npcs.js';
import {
  STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED, STATUS_VACANT,
} from '../entities/status.js';
import { PRIMARY_RELATIONSHIP_TYPES } from '../worldPulse/relationshipCompatibility.js';
import { FIELD_DECLARATIONS } from './fieldDeclarations.js';
import { NPC_RENAME_OP_TYPES } from './operationsNpcRename.js';
import { OFF_1, OFF_2, OFF_3, OFF_4 } from './operationsOffStage.js';

/**
 * @typedef {'pool'|'free'|'ref'|'int'|'enum'} PayloadSpecKind
 *
 * @typedef {{ kind: PayloadSpecKind, pool?: string,
 *   values?: readonly string[], required: boolean }} PayloadFieldSpec
 *
 * @typedef {{
 *   target: 'settlement'|'institution'|'npc'|'faction'|'power'|'phantom'|'section',
 *   payload: Readonly<Record<string, PayloadFieldSpec>>,
 *   stage: 'home'|'off-stage',
 *   consequence: 'home'|'by-target-reality',
 *   requires: { world: readonly string[], registry: readonly string[] },
 *   enables: readonly string[],
 *   relatedTo: readonly string[],
 *   conflictsWith: readonly string[],
 *   duration: number|null,
 *   guards: readonly Function[],
 *   guardsStated: string,
 * }} OpTypeDeclaration
 */

/**
 * ⭐ THE THREE CLOSED VOCABULARIES ARE FROZEN **AND** LITERAL-TYPED. `Object.freeze` alone
 * widens its argument to `readonly string[]`, so `OP_STAGES[0]` would be `string` and every
 * row's `stage` would red both typecheckers (33 of version 8's errors were exactly that).
 * The `@type {const} */ /* (…)` assertion INSIDE the freeze keeps the members literal at
 * compile time and frozen at run time, with no `any` anywhere.
 */

/** The closed stage vocabulary (ARCH §2 as amended by design §13). Frozen. */
export const OP_STAGES = Object.freeze(/** @type {const} */ (['home', 'off-stage']));

/** The closed consequence policies. Frozen. */
export const OP_CONSEQUENCE_POLICIES = Object.freeze(/** @type {const} */ (['home', 'by-target-reality']));

/**
 * ⭐ BOTH VOCABULARIES CARRY BOTH MEMBERS although this packet uses only one of each.
 * They are the partition's definition and EM-B1b appends rows against them; minting them
 * half-populated would force B1b to edit a frozen constant, which is the second-home
 * mistake. A3 asserts the unused members are provably unreached at this tip.
 */
const HOME = OP_STAGES[0];

/** The closed `EntityRef.kind` seven, fixed here through every row's `target`. */
const TARGET_KINDS = Object.freeze([
  'settlement', 'institution', 'npc', 'faction', 'power', 'phantom', 'section',
]);

/** The closed payload-spec kinds. */
const PAYLOAD_SPEC_KINDS = Object.freeze(/** @type {const} */ (['pool', 'free', 'ref', 'int', 'enum']));

/** @param {boolean} required @returns {PayloadFieldSpec} */
const freeField = (required) => Object.freeze({ kind: PAYLOAD_SPEC_KINDS[1], required });
/** @param {string} pool @param {boolean} required @returns {PayloadFieldSpec} */
const poolField = (pool, required) => Object.freeze({ kind: PAYLOAD_SPEC_KINDS[0], pool, required });
/** @param {readonly string[]} values @param {boolean} required @returns {PayloadFieldSpec} */
const enumField = (values, required) => Object.freeze({ kind: PAYLOAD_SPEC_KINDS[4], values, required });
/** @param {boolean} required @returns {PayloadFieldSpec} */
const refField = (required) => Object.freeze({ kind: PAYLOAD_SPEC_KINDS[2], required });
/** @param {boolean} required @returns {PayloadFieldSpec} */
const intField = (required) => Object.freeze({ kind: PAYLOAD_SPEC_KINDS[3], required });

/** The removal-cause pool, shared by the three ops that end something. */
const CAUSE = poolField('cause.remove', false);

/**
 * ⛔ THE NPC STATUS SEVEN, READ FROM THE UNION'S OWN VALUE-LEVEL HOME AND NEVER SPELLED
 * HERE. `NPC_STATUS_VALUES` (`entities/npcs.js`, minted by EM-P4) is the `NpcStatus`
 * typedef as values; EM-P4's `tests/domain/statusVocabularies.test.js` pins the two
 * together in both directions, so a typedef edit reds there rather than shipping two
 * vocabularies.
 *
 * ⛔⛔ RE-SPELLING THE SEVEN LITERALS HERE IS A LANDED-WALKER RED, NOT A STYLE CHOICE.
 * `tests/lint/statusUnionTotality.walker.test.js` DERIVES its trigger set as the union
 * members that NO foreign vocabulary spells, skipping only consumer-roster files. A
 * `SCREAMING_SNAKE = [ …the seven… ]` in this non-roster leaf reads as a foreign
 * vocabulary for every member, empties that trigger, and reds the walker's T1 (a new
 * enumerator) and T2 (the matcher stopped firing) at once — measured on version 8.
 */
const NPC_STATUS_POOL = NPC_STATUS_VALUES;

/**
 * ⛔ THE OP'S OWN SIX-MEMBER POOL, WHICH IS NOT THE UNION (ODQ §934.47 add. 6). It is
 * the `EntityStatus` FIVE, read out of the composer's own constants, PLUS `ruined`,
 * which is the PULSE's word and is NOT a member of `EntityStatus`. Offering it here does
 * not widen the union, and A7 asserts both facts separately so neither can drift into
 * the other.
 */
const RUINED_STATE = 'ruined';
const INSTITUTION_STATE_POOL = Object.freeze([
  STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED, RUINED_STATE, STATUS_VACANT,
].sort(compareCodepoint));

/**
 * The editable field names, DERIVED from EM-A1's declaration table rather than copied,
 * so the op's vocabulary cannot drift from the table that generates the modal. `category`
 * is a member because three cards declare it; `archetype` is not, and never can be,
 * because it is a DERIVATION from `category` and design §14 forbids editing one.
 */
const SET_FIELD_FIELDS = Object.freeze([...new Set(
  Object.values(FIELD_DECLARATIONS).flatMap((rows) => rows.map((r) => r.field)),
)].sort(compareCodepoint));

/** @param {OpTypeDeclaration} decl @returns {OpTypeDeclaration} */
function row(decl) {
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

/**
 * THE CATALOGUE. Authored and asserted in `compareCodepoint` order, so a new row cannot
 * be appended wherever. Every row is `stage: 'home'` and `consequence: 'home'`, and the
 * two partitions are asserted SET-EQUAL by A3. The structure is left open for EM-B1b to
 * append its seven off-stage rows.
 * @type {Readonly<Record<string, OpTypeDeclaration>>}
 */
export const OP_TYPES = Object.freeze({
  'add-faction': row({
    target: 'faction',
    payload: { faction: freeField(true), category: poolField('faction.category', true) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['remove-faction'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. EM-C3 owns the rules; the roster writer is generatePower.',
  }),
  'add-institution': row({
    target: 'institution',
    payload: { name: freeField(true), category: poolField('institution.class', true) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['remove-institution'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The prerequisite ground is checkStructuralValidity with GATE_FEATURES, which EM-C3 calls.',
  }),
  'add-npc': row({
    target: 'npc',
    payload: { name: freeField(true), role: poolField('npc.role', true) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['remove-npc'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The declared writer is the ops-layer createNpc, never a second path.',
  }),
  ...OFF_1, // close-trade, declare-war (EM-B1b, splice run 1 of 4)
  'found-phantom': row({
    target: 'phantom',
    payload: { name: freeField(true) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: ['promote-phantom'], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. A phantom carries no world state of its own, by §P8.',
  }),
  ...OFF_2, // make-peace, open-trade (EM-B1b, splice run 2 of 4)
  'promote-phantom': row({
    target: 'phantom',
    payload: {},
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: ['found-phantom'] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The target names the phantom, so the act needs no further field.',
  }),
  'rebalance-power': row({
    target: 'power',
    payload: { faction: refField(true), power: intField(true) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['set-power-holder'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The fulfil writer is renormalizeFactionPower, which MUTATES ITS ARGUMENT IN PLACE and returns the same reference.',
  }),
  ...OFF_3, // recall-force (EM-B1b, splice run 3 of 4)
  'remove-faction': row({
    target: 'faction',
    payload: { cause: CAUSE },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['add-faction'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. Removal is erasure, which is a different act from a state the record keeps.',
  }),
  'remove-institution': row({
    target: 'institution',
    payload: { cause: CAUSE },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['add-institution'], conflictsWith: ['set-institution-state'],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The record FORGETS what was removed, so this op and set-institution-state contradict each other on one target.',
  }),
  'remove-npc': row({
    target: 'npc',
    payload: { cause: CAUSE },
    stage: HOME, consequence: HOME,
    requires: { world: ['npcPresent'], registry: [] },
    enables: [], relatedTo: ['add-npc'], conflictsWith: ['set-npc-status'],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The seal is offered only while the record carries a present person, and erasure contradicts a status the record keeps.',
  }),
  ...OFF_4, // resolve-outcome, send-force (EM-B1b, splice run 4 of 4)
  'set-field': row({
    target: 'settlement',
    payload: { field: enumField(SET_FIELD_FIELDS, true), value: freeField(true) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The editable names are EM-A1 declaration table rows, so category is editable and anything derived from it is not.',
  }),
  'set-institution-state': row({
    target: 'institution',
    payload: { state: enumField(INSTITUTION_STATE_POOL, true), cause: CAUSE },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: [], conflictsWith: ['remove-institution'],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The five union values write the composer constants STATUS_ACTIVE, STATUS_DESTROYED, STATUS_IMPAIRED, STATUS_REMOVED and STATUS_VACANT; ruined alone writes the PULSE shape, status ruined with _worldPulseInactive true, through EM-B1e ruinInstitution with fate ruined_by_decree, and never a composer constant.',
  }),
  ...NPC_RENAME_OP_TYPES,
  'set-npc-status': row({
    target: 'npc',
    payload: { status: enumField(NPC_STATUS_POOL, true), cause: CAUSE },
    stage: HOME, consequence: HOME,
    requires: { world: ['npcPresent'], registry: [] },
    enables: [], relatedTo: [], conflictsWith: ['remove-npc'],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The op CREATES the field on a person who lacks it and calls the existing ops-layer writers, never a second path.',
  }),
  'set-power-holder': row({
    target: 'power',
    payload: { holder: poolField('power.holder', true) },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: ['rebalance-power'], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The op MOVES the isGoverning flag and the declared writer is the rulingPower transfer path; the canonical name FOLLOWS the flag and is never written directly.',
  }),
  'set-relationship': row({
    target: 'settlement',
    payload: {
      counterparty: refField(true),
      relationship: enumField(PRIMARY_RELATIONSHIP_TYPES, true),
      narrative: freeField(false),
    },
    stage: HOME, consequence: HOME,
    requires: { world: [], registry: [] },
    enables: [], relatedTo: [], conflictsWith: [],
    duration: null, guards: [],
    guardsStated: 'No guard is wired here. The vocabulary is the tree own PRIMARY_RELATIONSHIP_TYPES, read by reference so an upstream vocabulary change reds rather than drifting.',
  }),
});

/**
 * ⭐ A TYPE PREDICATE, NOT A BOOLEAN — and that is the whole of the strict-clean read. The
 * callers below index the value they just tested; a `boolean` return narrows nothing, so
 * every such index is a strict error and the only cheap cure is an `any`, which the
 * any-cast ratchet counts. The predicate makes the narrowing the CHECK'S OWN, so the
 * bodies read `Record<string, unknown>` and this leaf carries ZERO `any`.
 * @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an array and never null
 */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} type @returns {OpTypeDeclaration|null} the row, or null for an unknown type */
function declarationOf(type) {
  // Object.hasOwn, never a prototype walk: 'constructor' is an unknown op type like any
  // other, and an inherited member is not a declaration.
  if (typeof type !== 'string' || !Object.hasOwn(OP_TYPES, type)) return null;
  return OP_TYPES[type];
}

/** @param {unknown} target @returns {target is EntityRef} a well-formed EntityRef of the closed seven */
function isEntityRef(target) {
  return isPlainObject(target)
    && typeof target.kind === 'string' && TARGET_KINDS.includes(target.kind)
    && typeof target.id === 'string' && target.id.length > 0;
}

/**
 * Build one op. PURE: reads no world, consumes no draw, mints no id, mutates no argument.
 * Copies the declared `stage`, `consequence`, four relations and `duration` onto the
 * `Op`, FLATTENING `requires` from the declaration's `{ world, registry }` pair into
 * EM-A1's `readonly string[]`.
 *
 * @param {unknown} type @param {unknown} target @param {unknown} payload
 * @returns {Op|null} null when `type` is not a key of OP_TYPES or `target` is not a
 *   well-formed EntityRef. NEVER throws, NEVER returns a partial op.
 */
export function makeOp(type, target, payload) {
  const decl = declarationOf(type);
  if (!decl || !isEntityRef(target)) return null;
  return /** @type {Op} */ (Object.freeze({
    type,
    target: Object.freeze({ kind: target.kind, id: target.id }),
    payload: Object.freeze({ ...(isPlainObject(payload) ? payload : {}) }),
    stage: decl.stage,
    consequence: decl.consequence,
    requires: Object.freeze([...decl.requires.world, ...decl.requires.registry]),
    enables: decl.enables,
    relatedTo: decl.relatedTo,
    conflictsWith: decl.conflictsWith,
    duration: decl.duration,
  }));
}

/** @param {readonly string[]} errors @returns {{ ok: boolean, errors: readonly string[] }} */
function verdict(errors) {
  const sorted = [...errors].sort(compareCodepoint);
  return Object.freeze({ ok: sorted.length === 0, errors: Object.freeze(sorted) });
}

/**
 * Judge one op against a world. PURE and TOTAL: it reports, and it never refuses an
 * action. `errors` is ALWAYS a frozen, codepoint-sorted array, empty when ok, and `ok`
 * is DERIVED from it rather than set independently, so the two can never disagree.
 *
 * @param {unknown} op @param {unknown} _world
 * @returns {{ ok: boolean, errors: readonly string[] }}
 */
export function validateOp(op, _world) {
  if (!isPlainObject(op)) return verdict(['op is absent']);
  const errors = [];
  const decl = declarationOf(op.type);
  if (!decl) errors.push(`unknown op type: ${String(op.type)}`);
  if (!isEntityRef(op.target)) errors.push('target is malformed');
  const payload = isPlainObject(op.payload) ? op.payload : {};
  if (decl) {
    for (const [field, spec] of Object.entries(decl.payload)) {
      const value = payload[field];
      if (spec.required && value === undefined) errors.push(`payload.${field} is required`);
      // The declared vocabulary is WIDENED to `readonly unknown[]` at the membership test,
      // never the value NARROWED to `string`: an op arriving with a non-string value must
      // read as "not one of the declared values", which is exactly what `includes` answers.
      const declared = /** @type {readonly unknown[]} */ (spec.values || []);
      if (value !== undefined && spec.kind === PAYLOAD_SPEC_KINDS[4]
        && !declared.includes(value)) {
        errors.push(`payload.${field} is not one of the declared values`);
      }
    }
    for (const key of Object.keys(payload)) {
      if (!Object.hasOwn(decl.payload, key)) {
        errors.push(`payload.${key} is not declared for ${String(op.type)}`);
      }
    }
  }
  return verdict(errors);
}
