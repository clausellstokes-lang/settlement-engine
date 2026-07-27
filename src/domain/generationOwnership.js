/**
 * generationOwnership.js — one provenance law for generator normalization.
 *
 * Generation owns probabilistic catalog output. It does not own an entity the
 * player explicitly required, authored through an event, or supplied through
 * custom content. Those entities may create an intentional contradiction, but
 * a content profile, scale-ladder collapse, or coherence repair must not erase
 * the player's premise in order to make the output appear internally tidy.
 *
 * This module deliberately answers several related, but distinct, questions:
 *
 *   - `isAuthoredGenerationEntity` identifies player-controlled provenance.
 *     Generated-theme profiles use it to leave authored content untouched and
 *     validators use it to classify conflicts as by-design tensions.
 *   - `isProtectedGenerationEntity` adds engine-required, locked, and pinned
 *     entities. Roster normalization uses it because those records are also
 *     contracts even though they are not necessarily authored.
 *   - `isProtectedFromCustomSubsumption` answers the narrower question an exact
 *     custom `subsumes` reference asks, where custom provenance is the
 *     authority doing the asking rather than a reason to refuse.
 *   - `hasOwnRequiredContract` scopes a bare `required` flag to the settlement
 *     that actually owes the contract. EXPORTED for pulse-time readers, not
 *     just generation: institution lifecycle and calamity decide closure,
 *     abolition, and strike eligibility off that flag, and a settlement
 *     PERSISTED before the 2026-07-26 cascade fix still carries the borrowed
 *     value on disk. Scoping at the READ retro-covers those saves, so the fix
 *     needs no data migration.
 *   - `hasCascadeProvenance` is the stamp those readers key on.
 *
 * Keep provenance recognition here. A second local list of protected `source`
 * values will eventually drift and reopen a deletion path. The ONE sanctioned
 * exception is `spatial/calamity.js`, a deliberately IMPORT-FREE pure leaf that
 * mirrors the `hasOwnRequiredContract` conjunction inline; that mirror is held
 * honest by a parity ratchet in tests/domain/calamity.test.js.
 */

const AUTHORED_SOURCES = new Set([
  'authored',
  'canon_event',
  'custom',
  'draft_event',
  'event',
  'forced',
  'manual',
  'player',
  'user',
]);

/**
 * @param {unknown} entity
 * @returns {string}
 */
function sourceOf(entity) {
  if (!entity || typeof entity !== 'object') return '';
  const record = /** @type {Record<string, unknown>} */ (entity);
  return String(record.source || record.provenance || '')
    .trim()
    .toLowerCase();
}

/**
 * True when a generation entity represents explicit player-authored intent.
 *
 * Strings and unstamped objects remain generator-owned. That conservative
 * default is important: generated catalog records must still obey selected
 * theme profiles and may still be normalized.
 *
 * @param {unknown} entity
 * @returns {boolean}
 */
export function isAuthoredGenerationEntity(entity) {
  if (!entity || typeof entity !== 'object') return false;
  const record = /** @type {Record<string, unknown>} */ (entity);
  // Isolation support uses `source:"forced"` for an engine-mandated transit
  // dependency. It is protected infrastructure, not a player-authored choice.
  if (
    record.forcedByIsolation === true
    && record.forcedByToggle !== true
    && sourceOf(record) === 'forced'
  ) return false;
  return Boolean(
    AUTHORED_SOURCES.has(sourceOf(record))
    || record._authored === true
    || record.authored === true
    || record.custom === true
    || record.isCustom === true
    || record.forced === true
    || record.forcedByToggle === true
    || record.addedByEventId
    || record.customDefinitionId
    || record.customDefinitionCategory
  );
}

/**
 * True when a record carries the supply-chain cascade's own provenance stamp.
 *
 * The cascade seats a BORROWED lower-tier catalog def at a higher tier and
 * stamps the record `source: 'cascade'` + `cascadeAdded: true`. That stamp is
 * the record's own account of where it came from, which is why a cascade record
 * never needs the name-keyed catalog rescue that legacy/imported rosters (which
 * lost their provenance) depend on.
 *
 * `cascadeAdded` is the load-bearing signal. `source` is checked nowhere here on
 * purpose: a source string is a label an importer can spoof or drop, while the
 * boolean is written only by the cascade step itself.
 *
 * @param {unknown} record
 * @returns {boolean}
 */
export function hasCascadeProvenance(record) {
  if (!record || typeof record !== 'object') return false;
  return /** @type {Record<string, unknown>} */ (record).cascadeAdded === true;
}

/**
 * The exact record keys `hasOwnRequiredContract` reads.
 *
 * Any new clause in the law MUST extend this list. The calamity parity ratchet
 * (tests/domain/calamity.test.js) enumerates the FULL value-product over these
 * keys — absent / true / false / truthy-non-boolean / falsy-non-boolean, crossed
 * with the cascade `source` label — and asserts the import-free mirror in
 * spatial/calamity.js agrees with the law on every shape. A key the law reads
 * but this list omits is therefore a mirror drift the ratchet CANNOT see: the
 * product would never vary that key, and the two implementations could disagree
 * in silence. Extending the law and extending this list are one edit.
 *
 * @type {readonly string[]}
 */
export const REQUIRED_CONTRACT_FLAG_KEYS = Object.freeze(['required', 'cascadeAdded']);

/**
 * True when a record's `required` flag is this settlement's own contract.
 *
 * `required` is scoped to the tier whose catalog declares it. The supply-chain
 * cascade seats borrowed lower-tier defs at a higher tier (a town's
 * 'Town watch' inside a city) and carries the whole catalog def forward, so the
 * flag arrives attached to an institution nothing at THIS tier requires. Read
 * as a contract it made roster normalization refuse to collapse the scale
 * ladder, and cities listed both 'Town watch' and 'Professional city watch'.
 *
 * A cascade addition is a probabilistic second chance, never a contract: the
 * assemble pass already seats every entry the tier genuinely requires, and the
 * cascade skips whatever is already on the roster — so a cascade record's
 * `required` is always borrowed. The flag itself is left on the record because
 * it is the source catalog's own data; only its authority is scoped here.
 *
 * EXPORTED because generation is not the only reader. The world pulse decides
 * economic closure, patron abolition, disaster strikes, and calamity collapse
 * off the same flag, and settlements PERSISTED before the 2026-07-26 producer
 * fix still carry `required: true` on cascade records. Scoping the judgment at
 * every read is what retro-covers that saved data — there is no migration and
 * none is needed, because the flag is never trusted bare again.
 *
 * The exact record keys this reads are published as REQUIRED_CONTRACT_FLAG_KEYS
 * above; a new clause here MUST extend that list, or the calamity parity ratchet
 * goes blind to the drift.
 *
 * @param {unknown} record
 * @returns {boolean}
 */
export function hasOwnRequiredContract(record) {
  if (!record || typeof record !== 'object') return false;
  if (hasCascadeProvenance(record)) return false;
  return /** @type {Record<string, unknown>} */ (record).required === true;
}

/**
 * True when generator cleanup must preserve an entity.
 *
 * Required catalog infrastructure is protected from collapse, but is not
 * mislabeled as player-authored by `isAuthoredGenerationEntity`.
 *
 * @param {unknown} entity
 * @returns {boolean}
 */
export function isProtectedGenerationEntity(entity) {
  if (!entity || typeof entity !== 'object') return false;
  const record = /** @type {Record<string, unknown>} */ (entity);
  return Boolean(
    isAuthoredGenerationEntity(record)
    || hasOwnRequiredContract(record)
    || sourceOf(record) === 'required'
    || record.forcedByIsolation === true
    || record.locked === true
    || record.pinned === true
  );
}

/**
 * True when an institution must survive a custom definition's explicit
 * `subsumes` relationship.
 *
 * Custom content is normally protected from generator cleanup. Subsumption is
 * different: an exact custom-content reference is itself authored authority to
 * represent one optional institution through another. That narrow authority
 * may supersede the target's ordinary `source: "custom"` protection, but it
 * must never erase a required, forced, event-authored, locked, or pinned
 * institution. Bare legacy-name targets receive no such exception because a
 * display label is not sufficient deletion authority.
 *
 * The bare `required === true` read below is deliberate and correct even
 * though generator cleanup scopes the flag through hasOwnRequiredContract:
 * cascade seats have written `required: false` since the 2026-07-26 producer
 * fix, and subsumption only ever runs during assembly on freshly seated
 * records — never on persisted rosters — so a borrowed flag cannot reach this
 * branch. Do not "align" it to the scoped form; the extra condition would
 * guard a path that cannot occur.
 *
 * @param {unknown} entity
 * @param {{ exactTarget?: boolean }} [options]
 * @returns {boolean}
 */
export function isProtectedFromCustomSubsumption(
  entity,
  { exactTarget = false } = {},
) {
  if (!exactTarget) return isProtectedGenerationEntity(entity);
  if (!entity || typeof entity !== 'object') return false;
  const record = /** @type {Record<string, unknown>} */ (entity);
  const source = sourceOf(record);

  return Boolean(
    record.required === true
    || source === 'required'
    || record.forced === true
    || record.forcedByToggle === true
    || record.forcedByIsolation === true
    || record._authored === true
    || record.authored === true
    || record.addedByEventId
    || record.locked === true
    || record.pinned === true
    || (
      AUTHORED_SOURCES.has(source)
      && source !== 'custom'
    )
  );
}

/**
 * Positive predicate used at profile-filtering seams.
 *
 * @param {unknown} entity
 * @returns {boolean}
 */
export function isGeneratorOwnedEntity(entity) {
  return !isAuthoredGenerationEntity(entity);
}
