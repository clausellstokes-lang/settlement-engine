/**
 * domain/display/stateProse/dmFieldProjection.js — THE DM-FIELD PROJECTION RULE.
 *
 * DESIGN_FP_SPINE.md §2 SP-6, AMENDED 2026-08-03 from the corpus's own critical find:
 *
 *   > SECTION-TARGET is a READING position, never a write target: several dossier
 *   > sections render from DM-EDITABLE prose fields, and causal machine prose must
 *   > PROJECT BESIDE such fields — rendered adjacent, never persisted into them; a
 *   > DM-edited field always wins its position whole (the DM's-pen law, dossier
 *   > edition).
 *
 * WHY THIS IS A MODULE AND NOT A CONVENTION. The corpus's section targets read like
 * write targets. `DS-GEN-5` frames Overview › Situation, whose text IS
 * `settlement.arrivalScene` — a queue-wired, DM-editable field. `DS-GEN-11` frames the
 * coherence verdict, whose text IS `economicViability.summary`. An implementer wiring
 * "the corpus supplies this section's prose" the obvious way overwrites the DM's pen
 * and does it silently, because the machine sentence is a perfectly good sentence. The
 * only defence that survives a hurried wiring is a projection type that has nowhere to
 * put a write: `projectBesideDmField` RETURNS the DM's string by identity and offers
 * the machine line as a SEPARATE, adjacent field. There is no third shape.
 *
 * THE FROZEN FIELD LIST is the same one the workbench editor and the version-diff view
 * read (QUEUE_WIRED_PROSE_PATHS / PROSE_FIELD_LABELS). It is duplicated here as a pure
 * data constant rather than imported, because this leaf must not reach into the
 * components layer; tests/domain/dmFieldProjection.test.js pins the two lists equal, so
 * a path added to the editor and forgotten here reds.
 *
 * PURE HEADLESS LEAF: no imports, no state, no writes anywhere.
 *
 * @enforced-by tests/domain/dmFieldProjection.test.js
 */

/**
 * EVERY prose path a DM can edit, BY ENTITY KIND — the whole register, mirroring all
 * three arms of QUEUE_WIRED_PROSE_PATHS. A machine sentence may render BESIDE any of
 * these and INTO none of them.
 *
 * WHY ALL THREE ARMS AND NOT JUST THE SETTLEMENT (lane PT, 2026-08-03). The register
 * started settlement-only because every SECTION-TARGET the corpus frames lands on a
 * settlement field. But the queue also wires `faction.desc` and `institution.desc`, and
 * the structural no-writer scan derives its search from THIS constant: with the two
 * `desc` arms missing, a composer that rebuilt a faction blurb or an institution
 * description would have written straight through the DM's pen with nothing red. The
 * scan is the reason the register must be total, so the register is total.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const DM_EDITABLE_PROSE_PATHS_BY_KIND = Object.freeze({
  faction: Object.freeze(['desc']),
  institution: Object.freeze(['desc']),
  settlement: Object.freeze([
    'arrivalScene',
    'pressureSentence',
    'settlementReason',
    'prominentRelationship.phrasing',
    'history.historicalCharacter',
    'history.founding.reason',
    'history.founding.initialChallenge',
    'history.founding.overcoming',
    'history.founding.stressNote',
    'history.founding.foundedBy',
    'economicViability.summary',
    'economicState.safetyProfile.safetyDesc',
    'economicState.safetyProfile.guardEffectivenessDesc',
    'economicState.safetyProfile.economicDragDesc',
  ]),
});

/**
 * The settlement arm, DERIVED rather than re-listed — the two spellings of this list
 * cannot drift because there is only one list. Kept as its own export because every
 * caller of the projection holds a settlement, and `DM_FIELD_FRAMED_BY_BLOCK` maps
 * blocks onto settlement paths exclusively.
 * @type {ReadonlyArray<string>}
 */
export const DM_EDITABLE_SETTLEMENT_PROSE_PATHS = DM_EDITABLE_PROSE_PATHS_BY_KIND.settlement;

/**
 * Which corpus block frames which DM-editable field. A block in this map is one whose
 * SECTION-TARGET names a section that renders from the DM's pen — precisely the set
 * where an implementer would otherwise write into the field. Recorded so the walker can
 * assert that every one of them is reached through `projectBesideDmField` and never
 * through a plain assignment.
 * @type {Readonly<Record<string, string>>}
 */
export const DM_FIELD_FRAMED_BY_BLOCK = Object.freeze({
  'DS-GEN-5': 'arrivalScene',
  'DS-GEN-6': 'settlementReason',
  'DS-GEN-9': 'history.historicalCharacter',
  'DS-GEN-11': 'economicViability.summary',
  'DS-REL-2': 'prominentRelationship.phrasing',
  'DS-DEF-1': 'economicState.safetyProfile.guardEffectivenessDesc',
  'DS-DEF-3': 'economicState.safetyProfile.safetyDesc',
  'DS-ECO-6': 'economicState.safetyProfile.economicDragDesc',
});

/**
 * Settlement-scoped by design: the only caller is the block→field map above, whose
 * every value is a settlement path. A faction or institution `desc` is DM-editable but
 * is not a SECTION-TARGET the corpus frames, so admitting it here would make the
 * predicate answer a question nobody asks and blur which arm a path came from.
 * @param {string} path @returns {boolean}
 */
export function isDmEditableProsePath(path) {
  return DM_EDITABLE_SETTLEMENT_PROSE_PATHS.includes(path);
}

/**
 * Read a dotted path off a settlement without touching it.
 * @param {object|null|undefined} subject
 * @param {string} path
 * @returns {unknown}
 */
export function readProsePath(subject, path) {
  if (!subject || typeof subject !== 'object' || typeof path !== 'string') return undefined;
  let cursor = /** @type {any} */ (subject);
  for (const key of path.split('.')) {
    if (cursor === null || typeof cursor !== 'object') return undefined;
    cursor = cursor[key];
  }
  return cursor;
}

/**
 * THE RULE. The DM's field keeps its position whole; the machine sentence sits beside
 * it or does not appear.
 *
 * The returned `field` is the caller's own string BY IDENTITY — not trimmed, not
 * normalised, not re-cased, not composed with anything. That identity is what the
 * byte-identity pin measures: a DM-edited field renders the same bytes with the corpus
 * fully wired as it does with the corpus absent.
 *
 * `beside` is the machine line, or `null`. `null` is the ordinary case and means the
 * composer renders nothing at all in the adjacent position (R-DST-K).
 *
 * @param {unknown} fieldValue the DM-editable field's current value
 * @param {string|null|undefined} machineLine the corpus sentence, if one was drawn
 * @returns {Readonly<{field: unknown, beside: string|null, hasField: boolean}>}
 */
export function projectBesideDmField(fieldValue, machineLine) {
  const hasField = typeof fieldValue === 'string' && fieldValue !== '';
  const beside = typeof machineLine === 'string' && machineLine.trim() !== ''
    ? machineLine
    : null;
  return Object.freeze({ field: fieldValue, beside, hasField });
}

/**
 * The same rule applied against a settlement and a path, for the common case where the
 * composer has the entity rather than the value.
 * @param {object} settlement
 * @param {string} path one of DM_EDITABLE_SETTLEMENT_PROSE_PATHS
 * @param {string|null|undefined} machineLine
 * @returns {Readonly<{field: unknown, beside: string|null, hasField: boolean}>}
 */
export function projectBesideSettlementField(settlement, path, machineLine) {
  return projectBesideDmField(readProsePath(settlement, path), machineLine);
}
