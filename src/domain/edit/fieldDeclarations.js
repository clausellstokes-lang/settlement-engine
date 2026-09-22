/**
 * fieldDeclarations.js — WHAT THE DM MAY EDIT, DECLARED ONCE (EM-A1, wave 1).
 *
 * SEVENTEEN rows across FIVE card types: 10 `root`, 5 `world-fact`, 2 `annotation`;
 * by kind, 11 `pool`, 3 `free-cascade`, 2 `free`, 1 `share`. The editor's modal is
 * GENERATED from this table, so a card without a row here has no pencil at all.
 *
 * ⛔ THE TABLE HOLDS STRINGS AND JOINS NOTHING. It imports no registry, no pool
 * catalogue and no option set: `outputKey`, `pool`, `writer` and `tier1` are NAMES,
 * and the two test arms do the joining against the producers themselves. That is why
 * this leaf is pure data with zero runtime dependencies and cannot drag a generator,
 * a component or a bundle closure behind it.
 *
 * ⭐ WHICH KEYS A ROW CARRIES IS A CONTRACT, NOT A CONVENIENCE (§6.2's absence table,
 * asserted cell by cell over all seventeen rows by tests/domain/editDeclarations.test.js):
 *   root        exactly one of `writer` / `createdBy`; `outputKey`; never `tier1`,
 *               never `readersProof`, never kind 'free'
 *   world-fact  kind is always 'pool'; `tier1` names the Tier-1 (step, key) pair that
 *               HOLDS the fact on the record; neither writer key
 *   annotation  kind is always 'free'; `readersProof`; and NO `outputKey` at all,
 *               because the absence IS the claim that nothing on the record reads it
 * `pool` is present iff the kind is 'pool'; `maxLength` iff the kind is 'free-cascade'
 * or 'free'. A 'share' row carries neither, and that is what convicts the planted one.
 *
 * ⚠ TWO ROWS CARRY A MEASURED HAZARD, recorded here because a later op author will
 * reach for them. `powerStructure.governingName` is a PROJECTION of the roster's
 * `isGoverning` flag and has two writers, so a set-power-holder op moves the FLAG and
 * lets the name follow; it never writes the name. And a faction's `category` is
 * inferred from its display name, so renaming a faction moves its category with it.
 *
 * ⛔ `goods` and `services` ARE NOT DECLARED and that is a measurement, not an
 * omission: both are keys of the world-fact vocabulary, but the wizard's toggles never
 * reach the settlement record and what the record holds nearby is their DERIVATION,
 * which design §14 forbids declaring. The world-fact card shows five facts, not seven.
 */

/** @typedef {import('./types.js').FieldDeclaration} FieldDeclaration */

/**
 * PRICED, NOT INVENTED. Over three generated tiers the longest institution name was 32
 * characters, the longest person and faction names 21 and 22, so 60 leaves a DM roughly
 * twice the generator's reach without admitting a paragraph into a join key. The note
 * limit is a short paragraph. Both are the free-text hygiene limit design asks for; the
 * control that enforces them is EM-D0's.
 *
 * ⛔ ONE FROZEN OBJECT RATHER THAN TWO TOP-LEVEL CONSTANTS, AND THE SHAPE IS THE POINT:
 * these bound what a DM may TYPE and shape no generated world, so they are input limits
 * and not simulation dials and they take no tuning-register row — while the tuning
 * inventory's P2 predicate counts a module-top-level `const UPPER_SNAKE = <number>;`
 * under `src/domain` as an UNREGISTERED DIAL with new files banked at zero, so the
 * two-constant spelling would file two dials that do not exist.
 */
const TEXT_LIMITS = Object.freeze({ name: 60, note: 280 });

/**
 * The census that proves an annotation has display readers only. EM-A3 mints the VALUE
 * it points at; this string names the census design asks for and claims no proof that
 * has not been run.
 */
const ANNOTATION_PROOF = 'tests/lint/flavorFields.census.test.js: the value-join arm finds no cascade key for this field, and the receiver-shape arm grounds zero reads of this key on this card shape under src/generators, src/domain/worldPulse and src/domain/causalState.js, its key-level site roster holding only the declared unrelated receivers; the resolver grounds part of the corpus, so the claim is zero GROUNDED reads.';

/**
 * ONE shared frozen empty array, returned BY IDENTITY for every undeclared card type, so
 * a caller may compare with `===` and a reader never allocates.
 * @type {readonly FieldDeclaration[]}
 */
const NO_DECLARATIONS = Object.freeze([]);

/**
 * `Object.freeze` is shallow, so a row's `tier1` pair is frozen by name or not at all.
 * @param {FieldDeclaration} declaration
 * @returns {FieldDeclaration}
 */
function frozenRow(declaration) {
  if (declaration.tier1) Object.freeze(declaration.tier1);
  return Object.freeze(declaration);
}

/**
 * @param {FieldDeclaration[]} rows
 * @returns {readonly FieldDeclaration[]}
 */
function frozenCard(rows) {
  return Object.freeze(rows.map(frozenRow));
}

/**
 * The declaration table, deep-frozen, in AUTHORED order. A card type that declares
 * nothing is ABSENT from this object; it is never present with an empty array.
 * @type {Readonly<Record<string, readonly FieldDeclaration[]>>}
 */
export const FIELD_DECLARATIONS = Object.freeze({
  institution: frozenCard([
    { card: 'institution', field: 'name', kind: 'free-cascade', provenance: 'root', label: 'Name', group: 'identity', outputKey: 'institutions[].name', maxLength: TEXT_LIMITS.name, writer: 'src/generators/steps/assembleInstitutions.js#assembleInstitutions' },
    { card: 'institution', field: 'category', kind: 'pool', provenance: 'root', label: 'Category', group: 'identity', outputKey: 'institutions[].category', pool: 'institution.class', writer: 'src/generators/steps/assembleInstitutions.js#assembleInstitutions' },
    { card: 'institution', field: 'state', kind: 'pool', provenance: 'root', label: 'State', group: 'condition', outputKey: 'institutions[].state', pool: 'institution.state', createdBy: 'EM-B1a' },
    { card: 'institution', field: 'note', kind: 'free', provenance: 'annotation', label: 'Notes', group: 'annotation', maxLength: TEXT_LIMITS.note, readersProof: ANNOTATION_PROOF },
  ]),
  npc: frozenCard([
    { card: 'npc', field: 'name', kind: 'free-cascade', provenance: 'root', label: 'Name', group: 'identity', outputKey: 'npcs[].name', maxLength: TEXT_LIMITS.name, writer: 'src/generators/steps/generatePopulation.js#generatePopulation' },
    { card: 'npc', field: 'role', kind: 'pool', provenance: 'root', label: 'Role', group: 'identity', outputKey: 'npcs[].role', pool: 'npc.role', writer: 'src/generators/steps/generatePopulation.js#generatePopulation' },
    { card: 'npc', field: 'status', kind: 'pool', provenance: 'root', label: 'Status', group: 'condition', outputKey: 'npcs[].status', pool: 'npc.status', writer: 'src/generators/steps/generatePopulation.js#generatePopulation' },
    { card: 'npc', field: 'note', kind: 'free', provenance: 'annotation', label: 'Notes', group: 'annotation', maxLength: TEXT_LIMITS.note, readersProof: ANNOTATION_PROOF },
  ]),
  faction: frozenCard([
    { card: 'faction', field: 'faction', kind: 'free-cascade', provenance: 'root', label: 'Name', group: 'identity', outputKey: 'powerStructure.factions[].faction', maxLength: TEXT_LIMITS.name, writer: 'src/generators/steps/generatePower.js#generatePower' },
    { card: 'faction', field: 'category', kind: 'pool', provenance: 'root', label: 'Category', group: 'identity', outputKey: 'powerStructure.factions[].category', pool: 'faction.category', writer: 'src/generators/steps/generatePower.js#generatePower' },
    { card: 'faction', field: 'power', kind: 'share', provenance: 'root', label: 'Power share', group: 'standing', outputKey: 'powerStructure.factions[].power', writer: 'src/generators/steps/generatePower.js#generatePower' },
  ]),
  powerSeat: frozenCard([
    { card: 'powerSeat', field: 'holder', kind: 'pool', provenance: 'root', label: 'Governing seat', group: 'standing', outputKey: 'powerStructure.governingName', pool: 'power.holder', writer: 'src/generators/steps/generatePower.js#generatePower' },
  ]),
  worldFact: frozenCard([
    { card: 'worldFact', field: 'terrain', kind: 'pool', provenance: 'world-fact', label: 'Terrain', group: 'world', outputKey: 'config.terrainType', pool: 'worldFact.terrain', tier1: { step: 'resolveConfig', key: 'terrainType' } },
    { card: 'worldFact', field: 'culture', kind: 'pool', provenance: 'world-fact', label: 'Culture', group: 'world', outputKey: 'config.culture', pool: 'worldFact.culture', tier1: { step: 'resolveConfig', key: 'culture' } },
    { card: 'worldFact', field: 'monsterThreat', kind: 'pool', provenance: 'world-fact', label: 'Monster threat', group: 'world', outputKey: 'config.monsterThreat', pool: 'worldFact.monsterThreat', tier1: { step: 'resolveConfig', key: 'effectiveConfig' } },
    { card: 'worldFact', field: 'stressors', kind: 'pool', provenance: 'world-fact', label: 'Stressors', group: 'world', outputKey: 'config.stressTypes', pool: 'worldFact.stressors', tier1: { step: 'resolveStress', key: 'stressTypes' } },
    { card: 'worldFact', field: 'resources', kind: 'pool', provenance: 'world-fact', label: 'Nearby resources', group: 'world', outputKey: 'config.nearbyResources', pool: 'worldFact.resources', tier1: { step: 'resolveResources', key: 'nearbyResources' } },
  ]),
});

/**
 * Every declared field of one card type, frozen, in authored order.
 *
 * @param {string} cardType
 * @returns {readonly FieldDeclaration[]} the frozen authored array BY REFERENCE, never a
 *   copy and never sorted; the SAME shared frozen EMPTY array for an unknown or
 *   undeclared cardType, never null and never a throw.
 */
export function declarationsFor(cardType) {
  if (typeof cardType !== 'string' || cardType.length === 0) return NO_DECLARATIONS;
  // Object.hasOwn, never a prototype walk: 'constructor' and 'toString' are undeclared
  // card types like any other, and an inherited member is not a declaration.
  if (!Object.hasOwn(FIELD_DECLARATIONS, cardType)) return NO_DECLARATIONS;
  return FIELD_DECLARATIONS[cardType];
}

/**
 * @param {string} cardType
 * @returns {boolean} whether this card type has any declared field at all
 */
export function isEditableCard(cardType) {
  return declarationsFor(cardType).length > 0;
}
