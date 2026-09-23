/**
 * types.js — THE EDIT VOLUME'S SHARED JSDoc TYPES (EM-A1, wave 1).
 *
 * Five typedefs and nothing else. This leaf exports no value, imports no module and
 * reaches no runtime: it is the one address the edit volume's siblings name when they
 * write `@typedef {import('./types.js').Op}`. `export {}` is what makes it a MODULE
 * rather than a script, which is what makes that import specifier resolvable; it is
 * the estate's own idiom for a types-only leaf (src/domain/types.js).
 *
 * ⛔ THREE CLOSED UNIONS LIVE HERE, AND EACH IS A CONTRACT SOMEONE ELSE MEASURED.
 *   - `FieldKind` carries 'share' because design §14 rules a faction's power share a
 *     root under a totality guard, not a pool member. A bounded number whose totality
 *     is a guard's is a fourth kind or it is undeclarable.
 *   - `FieldProvenance` is exactly THREE. Design §14 names five kinds of fact; DERIVED
 *     is never editable on any card, and MINTED is a property of an ENTITY rather than
 *     of a field, so only three of the five are ever a field's provenance.
 *   - `EntityRef`'s `kind` is the closed seven EM-B1a's `OpTypeDeclaration.target`
 *     names, and `Op`'s ten fields are EM-B1a §6's rule that EVERY field is required on
 *     every row: an empty relation is `[]` and an absent duration is `null`, never an
 *     omitted key. ARCH §2's optional-field spelling is SUPERSEDED, deliberately.
 *
 * ⭐ ONE CONCEPT, THREE LAYERS, ONE NAME. `src/pdf/primitives/EntityRef.jsx` renders an
 * entity reference into the PDF and `src/lib/entityRefTokenizer.js` tokenizes one out of
 * prose; this typedef is that same concept's shape in the domain, so the shared name is
 * the right one and a second spelling would be the drift. Neither module declares a
 * typedef and neither is imported here.
 */

/** The control a declared field is edited through. */
/** @typedef {'pool'|'free'|'free-cascade'|'share'} FieldKind */

/** Which of design §14's five kinds of fact a declared field is. */
/** @typedef {'root'|'world-fact'|'annotation'} FieldProvenance */

/**
 * ONE editable field of ONE card type.
 *
 * Which optional keys are present is NOT free: §6.2's absence table binds them by
 * provenance, and `tests/domain/editDeclarations.test.js` asserts every cell of it over
 * the whole table. In short — a root row carries exactly one of `writer` / `createdBy`
 * and no `tier1`; a world-fact row carries `tier1` AND `inputKey` and neither writer key;
 * an annotation row carries `readersProof` and no `outputKey` at all, and that absence IS
 * the claim that nothing on the record reads it.
 *
 * ⭐ `inputKey` IS THE ENGINE'S OWN CONFIG KEY, and it is a THIRD word from the two the
 * row already carries (EM-B2b, the chair's judgment 241 ruling 2). `outputKey` says where
 * the value LANDS on the record and `tier1` names the ctx key; for terrain the engine
 * READS `config.terrainOverride` while the value lands at `config.terrainType`, so a
 * re-derivation keyed by either of the other two moves nothing. It is declared here and
 * joined to its producing step by `tests/lint/editDeclarations.walker.test.js`, never held
 * privately by a reader.
 *
 * @typedef {{ card: 'institution'|'npc'|'faction'|'powerSeat'|'worldFact', field: string,
 *   kind: FieldKind, provenance: FieldProvenance, label: string, group: string,
 *   outputKey?: string, pool?: string, maxLength?: number, readersProof?: string,
 *   writer?: string, createdBy?: string, inputKey?: string,
 *   tier1?: { step: string, key: string } }} FieldDeclaration
 */

/**
 * A stable reference to one entity an op acts on.
 * @typedef {{ kind: 'settlement'|'institution'|'npc'|'faction'|'power'|'phantom'|'section',
 *   id: string }} EntityRef
 */

/**
 * ONE staged operation, at the rigid shape EM-B1a §6 authors.
 *
 * ⚠ `duration` is carried although EM-B1a's transition table names only `stage`,
 * `consequence` and the four relations: `OpTypeDeclaration` carries it as a required
 * `number|null`, and EM-B1a's own note is that the op shape is PERSISTED by a later
 * packet, which is why it is rigid — a field added after EM-B3 lands is a stored-shape
 * change with a migration cost. Reversal is one deleted line.
 *
 * @typedef {{ type: string, target: EntityRef, payload: Readonly<Record<string, unknown>>,
 *   stage: 'home'|'off-stage', consequence: 'home'|'by-target-reality',
 *   requires: readonly string[], enables: readonly string[], relatedTo: readonly string[],
 *   conflictsWith: readonly string[], duration: number|null }} Op
 */

export {};
