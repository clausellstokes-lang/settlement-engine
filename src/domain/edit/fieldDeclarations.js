/**
 * fieldDeclarations.js — WHAT THE DM MAY EDIT, DECLARED ONCE (EM-A1, wave 1).
 *
 * NINETEEN rows across SIX card types: 10 `root`, 5 `world-fact`, 2 `annotation`,
 * 2 `dm`; by kind, 12 `pool`, 3 `free-cascade`, 3 `free`, 1 `share`. The editor's modal
 * is GENERATED from this table, so a card without a row here has no pencil at all.
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
 *               HOLDS the fact on the record; `inputKey` names the config key the ENGINE
 *               READS, which is a THIRD word from the other two — terrain lands at
 *               `config.terrainType` and is read from `config.terrainOverride`, so a
 *               re-derivation keyed by `outputKey` or by the field name moves nothing;
 *               neither writer key
 *   annotation  kind is always 'free'; `readersProof`; and NO `outputKey` at all,
 *               because the absence IS the claim that nothing on the record reads it
 *   dm          kind is 'pool' or 'free'; NO `outputKey` at all, and there the absence
 *               is a DIFFERENT claim from the annotation row's — the field is not a
 *               record field of the open settlement at all, it is an ARGUMENT OF THE
 *               MINT that writes a DM-minted entity's own save (EM-F3, design §2.8);
 *               neither writer key, no `tier1`, no `inputKey`
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
const PHANTOM_NAME_PROOF = 'tests/store/phantomMint.test.js: arm S1 grounds this free value at exactly ONE writer, `mintPhantom`\'s own `name` argument, read back off the minted save row; arm S5 grounds it at ZERO readers of THIS record by asserting the open settlement, in the store and on the device, is byte-identical before and after the mint. The flavor census does not govern a `dm` row, and states why: its two halves both ask a question about the record, and this field is on none.';

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
  phantom: frozenCard([
    // ⭐⭐ THE PHANTOM COUNTERPARTY'S CARD (EM-F3, design §2.8; the chair's judgment 275).
    // It is the ONE card in this table whose subject is not on the open settlement's
    // record: a phantom is a SAVE OF ITS OWN (EM-F1, judgment 261), so every row carries
    // `provenance: 'dm'` and NO `outputKey` at all. The door generated from these rows is
    // a CREATE form, not a pencil, and the shell renders no pencil for this card.
    //
    // ⛔ TWO ROWS, AND THE TWO DESIGN §2.8 ALSO SPELLS ARE CLOSED BY MEASUREMENT RATHER
    // THAN MINTED (U24, EM-F3's judgment). §2.8's vocabulary is `name (free), kind
    // (pool), size (pool), stance (pool), traits (rolled)`, and EM-F1 EXECUTED two of
    // those words against this estate:
    //   `kind`   — the minted record's own `kind` IS the discriminant `'phantom'`,
    //              spelled once in `phantoms.js` so the shelf's hiding, the registry's
    //              badge and the apply-time policy can never disagree; and that leaf's
    //              own measurement is that "the place-type in this estate IS the tier",
    //              which the `size` row below already declares. A second pooled word for
    //              one fact would be the drift, not the coverage.
    //   `stance` — "already carried where it belongs — the neighbour link's own
    //              `relationshipType`, written by the back-link when the phantom
    //              resolves" (`phantoms.js`). The editor may not write it HERE: design
    //              §13 gives a phantom act exactly two products, the home procedures and
    //              the record, and forbids a treaty, a trade route or any relationship
    //              state derived from a phantom. A stance the mint wrote onto the link
    //              would be exactly that derivation.
    // Veto: mint `phantom.kind` and `phantom.stance` pools in `pools.js` and declare
    // them here, accepting a second word for the tier and a relationship state the
    // editor writes against §13.
    { card: 'phantom', field: 'name', kind: 'free', provenance: 'dm', label: 'Name', group: 'identity', maxLength: TEXT_LIMITS.name, readersProof: PHANTOM_NAME_PROOF },
    // ⭐ THE TIER POOL, DECLARED AT LAST. `tier` is the pool EM-F1's own
    // `PHANTOM_TRAIT_POOLS.size` names, so the DM's list here IS the vocabulary the mint
    // rolls from, joined by the acceptance rather than re-typed — and the DM's pick
    // reaches the record through the mint's INJECTED roller, never by a second writer of
    // the persisted record's shape.
    { card: 'phantom', field: 'size', kind: 'pool', provenance: 'dm', label: 'Size', group: 'identity', pool: 'tier' },
  ]),
  worldFact: frozenCard([
    { card: 'worldFact', field: 'terrain', kind: 'pool', provenance: 'world-fact', label: 'Terrain', group: 'world', outputKey: 'config.terrainType', inputKey: 'terrainOverride', pool: 'worldFact.terrain', tier1: { step: 'resolveConfig', key: 'terrainType' } },
    { card: 'worldFact', field: 'culture', kind: 'pool', provenance: 'world-fact', label: 'Culture', group: 'world', outputKey: 'config.culture', inputKey: 'culture', pool: 'worldFact.culture', tier1: { step: 'resolveConfig', key: 'culture' } },
    { card: 'worldFact', field: 'monsterThreat', kind: 'pool', provenance: 'world-fact', label: 'Monster threat', group: 'world', outputKey: 'config.monsterThreat', inputKey: 'monsterThreat', pool: 'worldFact.monsterThreat', tier1: { step: 'resolveConfig', key: 'effectiveConfig' } },
    { card: 'worldFact', field: 'stressors', kind: 'pool', provenance: 'world-fact', label: 'Stressors', group: 'world', outputKey: 'config.stressTypes', inputKey: 'stressTypes', pool: 'worldFact.stressors', tier1: { step: 'resolveStress', key: 'stressTypes' } },
    { card: 'worldFact', field: 'resources', kind: 'pool', provenance: 'world-fact', label: 'Nearby resources', group: 'world', outputKey: 'config.nearbyResources', inputKey: 'nearbyResources', pool: 'worldFact.resources', tier1: { step: 'resolveResources', key: 'nearbyResources' } },
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
