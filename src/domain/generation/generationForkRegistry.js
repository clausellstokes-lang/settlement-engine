/**
 * generationForkRegistry.js: GENERATION'S HELD AND CHOSEN FACTS, IN TWO TIERS, MEASURED.
 *
 * TIER 1 is the `(step, key)` CENSUS: every pair the pipeline's registry declares, with what
 * execution says about it. Whether the step drew for it, whether the key moved under the step's
 * perturbed stream, and whether what was produced reaches the settlement record. Every count is
 * expressed over `GENERATION_CENSUS_ROWS` rows of a declared corpus, so a verdict always
 * carries its denominator, and `GENERATION_BLIND_HALVES` says what those denominators miss.
 *
 * TIER 2 is the ten EDITABLE-ROOT FIELD rows EM-A1 joins on, keyed by `(cardShape, outputKey)`,
 * each naming the Tier-1 row that holds it and the module and symbol that writes it.
 *
 * ⛔ THIS MODULE IS PRODUCTION-UNREACHABLE AND MUST STAY SO. Nothing under `src/` imports it;
 * the only importers are the two test files that hold it equal to a fresh execution. It enters
 * no bundle closure, no worker, no edge-shared meta and no first-paint set, and acquiring a
 * production importer is a STOP, not a refactor.
 *
 * ⛔ EDITABILITY IS NOT CONDITIONED ON ENTROPY (design §14 as amended by §21.5.3). Five of the
 * ten Tier-2 rows are `computed` because the power structure consumes zero draws at generation,
 * and all ten stay editable. `origin` is recorded, never consulted as a gate, and there is no
 * `editable` field here at all: that is EM-A1's declaration to make, and a second home for it
 * would be a second truth.
 *
 * ⛔ IT IS A FROZEN LITERAL WITH NO LIFECYCLE. Nothing writes it at runtime. It is not
 * persisted, not migrated, not serialized into a save, not in the public veil, not in the
 * anonymous envelope, not forked and not in the gallery projection, so there is no undo path
 * and no regeneration path to trace. It holds no user data and no settlement data, only step
 * names, ctx key names, record paths, module paths and counts.
 *
 * ⭐ WHAT IT IS NOT. EM-R0a classes record PATHS by what the editor may do with them (HELD,
 * WORLD, CONSTANT, READING, MIRROR, RECEIPT, HISTORY, AUTHORED). This register classes
 * `(step, key)` pairs by HOW a value comes to be. The two vocabularies share no word and
 * answer different questions, so they cannot contradict each other; they meet at exactly one
 * field, `recordPath`, which is a POINTER INTO EM-R0a's domain and never a class of it. A
 * consumer that needs provenance reads this register; one that needs permission reads EM-R0a.
 */

/**
 * @typedef {object} GenerationTier1Row
 * @property {string} step a registered step name; the row key's first half
 * @property {string} key a ctx key the step provides or mutates; the row key's second half
 * @property {'provides' | 'mutates'} via how the step declares the key
 * @property {number} stepDraws corpus rows in which the STEP drew at all
 * @property {number} keyMoves corpus rows in which THIS key moved under the perturbed stream
 * @property {number} rows the denominator behind both counts; unanimous across the register
 * @property {'drawn' | 'pure' | 'label'} class DERIVED from stepDraws and keyMoves, never authored
 * @property {{ absent: number, same: number, transformed: number }} onRecord the key's FINAL value against the record
 * @property {'absent' | 'same' | 'transformed' | 'varies'} onRecordClass DERIVED from onRecord
 * @property {{ absent: number, same: number, transformed: number }} producedOnRecord the POST-STEP value against the record
 * @property {'absent' | 'same' | 'transformed' | 'varies'} producedOnRecordClass DERIVED from producedOnRecord
 * @property {string | null} recordPath where the FINAL value lands, or null exactly when onRecordClass is absent
 */

/** `Object.freeze` is shallow, so a row's two count triples are frozen by name or not at all. */
const freezeRow = (/** @type {GenerationTier1Row} */ row) => Object.freeze(Object.assign(row, { onRecord: Object.freeze(row.onRecord), producedOnRecord: Object.freeze(row.producedOnRecord) }));

/**
 * ⛔ TWO COMPARANDS, BECAUSE THEY ARE DIFFERENT CLAIMS (design §22; chair ruling Q-6).
 * `onRecord` answers whether the key's FINAL value lands on the record. `producedOnRecord`
 * answers whether the value THIS STEP produced lands on it, so a key a later producer or
 * mutator replaced reads differently in the second than in the first. Eighteen of these rows
 * disagree, and the re-entry family needs the second to know, per writer, whether what that
 * step wrote is what the record holds. THERE IS NO `producedPath`, and that is a measurement:
 * over every corpus row and every register row, counting only rows where both comparands land,
 * the post-step value never lands at a different path than the final one, so one `recordPath`
 * serves both triples. `recordPath` is `null` exactly when `onRecordClass` is `'absent'`,
 * never `''`; where the landing path is not unanimous the row is `'varies'` and the census
 * arm asserts it, because a row that landed in two places while reading `'same'` would be a
 * register telling a caller a single truth it does not have.
 * @type {readonly GenerationTier1Row[]}
 */
export const GENERATION_TIER1 = Object.freeze(/** @type {GenerationTier1Row[]} */ ([
  { step: 'resolveConfig', key: 'tier', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.tier' },
  { step: 'resolveConfig', key: 'population', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.population' },
  { step: 'resolveConfig', key: 'tradeRoute', via: 'provides', stepDraws: 63, keyMoves: 5, rows: 63, class: 'drawn', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'terrainType', via: 'provides', stepDraws: 63, keyMoves: 3, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.config.terrainType' },
  { step: 'resolveConfig', key: 'resolvedTerrain', via: 'provides', stepDraws: 63, keyMoves: 3, rows: 63, class: 'drawn', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'culture', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.config.culture' },
  { step: 'resolveConfig', key: 'culturalIdentity', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.culturalIdentity' },
  { step: 'resolveConfig', key: 'generationContentProfile', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'magicLevel', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.config.magicLevel' },
  { step: 'resolveConfig', key: 'threat', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'priorityMagicEffective', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'noMagic', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'townPlus', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'effectiveConfig', via: 'provides', stepDraws: 63, keyMoves: 7, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.config' },
  { step: 'resolveConfig', key: 'institutionToggles', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'categoryToggles', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'goodsToggles', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveConfig', key: 'servicesToggles', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'buildGenerationContext', key: 'generationContext', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveResources', key: 'nearbyResources', via: 'provides', stepDraws: 63, keyMoves: 62, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.config.nearbyResources' },
  { step: 'resolveResources', key: 'nearbyResourcesNative', via: 'provides', stepDraws: 63, keyMoves: 62, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.config.nearbyResources' },
  { step: 'resolveResources', key: 'nearbyResourcesDepleted', via: 'provides', stepDraws: 63, keyMoves: 48, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 23, transformed: 40 }, onRecordClass: 'varies', producedOnRecord: { absent: 0, same: 23, transformed: 40 }, producedOnRecordClass: 'varies', recordPath: 'record.config.nearbyResourcesDepleted' },
  { step: 'resolveResources', key: 'nearbyResourcesNativeDepleted', via: 'provides', stepDraws: 63, keyMoves: 48, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 23, transformed: 40 }, onRecordClass: 'varies', producedOnRecord: { absent: 0, same: 23, transformed: 40 }, producedOnRecordClass: 'varies', recordPath: 'record.config.nearbyResourcesNativeDepleted' },
  { step: 'resolveResources', key: 'nearbyResourcesCustom', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.config.nearbyResourcesCustom' },
  { step: 'resolveResources', key: 'nearbyResourceDefinitions', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.config.nearbyResourceDefinitions' },
  { step: 'resolveResources', key: 'nearbyResourceDefinitionsDepleted', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.config.nearbyResourceDefinitionsDepleted' },
  { step: 'resolveResources', key: 'effectiveConfig', via: 'mutates', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.config' },
  { step: 'resolveStress', key: 'stress', via: 'provides', stepDraws: 63, keyMoves: 57, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 9, transformed: 54 }, producedOnRecordClass: 'varies', recordPath: 'record.stress' },
  { step: 'resolveStress', key: 'stressTypes', via: 'provides', stepDraws: 63, keyMoves: 57, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 51, transformed: 12 }, onRecordClass: 'varies', producedOnRecord: { absent: 0, same: 51, transformed: 12 }, producedOnRecordClass: 'varies', recordPath: 'record.config.stressTypes' },
  { step: 'resolveStress', key: 'effectiveConfig', via: 'mutates', stepDraws: 63, keyMoves: 57, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.config' },
  { step: 'resolveNeighbour', key: 'neighbourProfile', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveNeighbour', key: 'neighbourEconBias', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveNeighbour', key: 'neighbourFacBias', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveNeighbour', key: 'rawNeighbour', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'resolveNeighbour', key: 'effectiveConfig', via: 'mutates', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.config' },
  { step: 'assembleInstitutions', key: 'institutions', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 7, transformed: 56 }, producedOnRecordClass: 'varies', recordPath: 'record.institutions' },
  { step: 'assembleInstitutions', key: 'catalogForTier', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'assembleInstitutions', key: 'generationRepairs', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 43, same: 20, transformed: 0 }, onRecordClass: 'varies', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.generationCoherenceReceipt.repairs' },
  { step: 'subsumptionPass', key: 'institutions', via: 'mutates', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 7, transformed: 56 }, producedOnRecordClass: 'varies', recordPath: 'record.institutions' },
  { step: 'cascadePass', key: 'institutions', via: 'mutates', stepDraws: 56, keyMoves: 56, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 41, transformed: 22 }, producedOnRecordClass: 'varies', recordPath: 'record.institutions' },
  { step: 'isolationPass', key: 'stress', via: 'provides', stepDraws: 2, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 9, transformed: 54 }, producedOnRecordClass: 'varies', recordPath: 'record.stress' },
  { step: 'isolationPass', key: 'isolationSupport', via: 'provides', stepDraws: 2, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 62, transformed: 1 }, producedOnRecordClass: 'varies', recordPath: 'record.isolationSupport' },
  { step: 'isolationPass', key: 'institutions', via: 'mutates', stepDraws: 2, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 43, transformed: 20 }, producedOnRecordClass: 'varies', recordPath: 'record.institutions' },
  { step: 'isolationPass', key: 'effectiveConfig', via: 'mutates', stepDraws: 2, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.config' },
  { step: 'stressConfirmPass', key: 'stress', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 9, transformed: 54 }, producedOnRecordClass: 'varies', recordPath: 'record.stress' },
  { step: 'stressConfirmPass', key: 'stressTypes', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 51, transformed: 12 }, onRecordClass: 'varies', producedOnRecord: { absent: 0, same: 51, transformed: 12 }, producedOnRecordClass: 'varies', recordPath: 'record.config.stressTypes' },
  { step: 'stressConfirmPass', key: 'effectiveConfig', via: 'mutates', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.config' },
  { step: 'generateEconomy', key: 'economicState', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 17, transformed: 46 }, producedOnRecordClass: 'varies', recordPath: 'record.economicState' },
  { step: 'generateEconomy', key: 'effectiveConfig', via: 'mutates', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: 'record.config' },
  { step: 'generatePower', key: 'powerIntent', via: 'provides', stepDraws: 0, keyMoves: 63, rows: 63, class: 'label', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'generatePower', key: 'powerStructure', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.powerStructure' },
  { step: 'neighbourFactions', key: 'powerStructure', via: 'mutates', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.powerStructure' },
  { step: 'factionCorrelationPass', key: 'institutions', via: 'mutates', stepDraws: 1, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 43, transformed: 20 }, producedOnRecordClass: 'varies', recordPath: 'record.institutions' },
  { step: 'coherenceRepairPass', key: 'generationRepairs', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 43, same: 20, transformed: 0 }, onRecordClass: 'varies', producedOnRecord: { absent: 43, same: 20, transformed: 0 }, producedOnRecordClass: 'varies', recordPath: 'record.generationCoherenceReceipt.repairs' },
  { step: 'coherenceRepairPass', key: 'isolationSupport', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.isolationSupport' },
  { step: 'coherenceRepairPass', key: 'effectiveConfig', via: 'mutates', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.config' },
  { step: 'coherenceRepairPass', key: 'institutions', via: 'mutates', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.institutions' },
  { step: 'economyReconcilePass', key: 'economicState', via: 'provides', stepDraws: 63, keyMoves: 20, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.economicState' },
  { step: 'economyReconcilePass', key: 'spatialLayout', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.spatialLayout' },
  { step: 'economyReconcilePass', key: 'availableServices', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.availableServices' },
  { step: 'powerEconomyReconcilePass', key: 'powerStructure', via: 'mutates', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.powerStructure' },
  { step: 'structuralValidationPass', key: 'structural', via: 'provides', stepDraws: 0, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 63, same: 0, transformed: 0 }, onRecordClass: 'absent', producedOnRecord: { absent: 63, same: 0, transformed: 0 }, producedOnRecordClass: 'absent', recordPath: null },
  { step: 'generatePopulation', key: 'npcs', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.npcs' },
  { step: 'generatePopulation', key: 'relationships', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.relationships' },
  { step: 'generatePopulation', key: 'factions', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.factions' },
  { step: 'generatePopulation', key: 'conflicts', via: 'provides', stepDraws: 63, keyMoves: 58, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.conflicts' },
  { step: 'corruptionPass', key: 'factions', via: 'mutates', stepDraws: 42, keyMoves: 39, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.factions' },
  { step: 'corruptionPass', key: 'npcs', via: 'mutates', stepDraws: 42, keyMoves: 39, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.npcs' },
  { step: 'generateNarratives', key: 'settlementReason', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.settlementReason' },
  { step: 'generateNarratives', key: 'resourceAnalysis', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.resourceAnalysis' },
  { step: 'generateNarratives', key: 'economicViability', via: 'provides', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.economicViability' },
  { step: 'generateNarratives', key: 'history', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.history' },
  { step: 'assembleSettlement', key: 'settlement', via: 'provides', stepDraws: 63, keyMoves: 63, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record' },
  { step: 'assembleSettlement', key: 'powerStructure', via: 'mutates', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 0, transformed: 63 }, onRecordClass: 'transformed', producedOnRecord: { absent: 0, same: 0, transformed: 63 }, producedOnRecordClass: 'transformed', recordPath: 'record.powerStructure' },
  { step: 'assembleSettlement', key: 'stress', via: 'mutates', stepDraws: 63, keyMoves: 54, rows: 63, class: 'drawn', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.stress' },
]).map(freezeRow));

/**
 * The census corpus size every Tier-1 row's counts are expressed over, READ FROM THE ROWS
 * rather than restated beside them: a number spelled twice is a number that can disagree with
 * itself, and this one is a MEASURED denominator, never a dial anybody may turn. The rows'
 * unanimity is not assumed either -- the static arm asserts `rows === GENERATION_CENSUS_ROWS`
 * on every one of them, and the census arm asserts the live corpus builder returns exactly
 * this many rows, so the absolute is pinned by execution rather than by a literal.
 */
export const GENERATION_CENSUS_ROWS = GENERATION_TIER1[0].rows;

/**
 * @typedef {object} GenerationTier2Row
 * @property {'institution' | 'npc' | 'faction' | 'powerSeat'} cardShape the card the field is edited on
 * @property {string} outputKey THE RECORD PATH, spelled a.b[].c, relative to the settlement record
 * @property {string} forkId the step fork's name, which is the argument to rng.fork(name)
 * @property {string} step the HOLDING Tier-1 row's step
 * @property {string} key the HOLDING Tier-1 row's ctx key
 * @property {string} module the file that writes the field
 * @property {string} symbol a symbol that module declares exactly once
 * @property {'drawn' | 'computed'} origin measured, and never a gate on editability
 */

/** @type {readonly GenerationTier2Row[]} */
export const GENERATION_TIER2 = Object.freeze(/** @type {GenerationTier2Row[]} */ ([
  { cardShape: 'institution', outputKey: 'institutions[].name', forkId: 'assembleInstitutions', step: 'assembleInstitutions', key: 'institutions', module: 'src/generators/steps/assembleInstitutions.js', symbol: 'assembleInstitutions', origin: 'drawn' },
  { cardShape: 'institution', outputKey: 'institutions[].category', forkId: 'assembleInstitutions', step: 'assembleInstitutions', key: 'institutions', module: 'src/generators/steps/assembleInstitutions.js', symbol: 'assembleInstitutions', origin: 'drawn' },
  { cardShape: 'npc', outputKey: 'npcs[].name', forkId: 'generatePopulation', step: 'generatePopulation', key: 'npcs', module: 'src/generators/steps/generatePopulation.js', symbol: 'generatePopulation', origin: 'drawn' },
  { cardShape: 'npc', outputKey: 'npcs[].role', forkId: 'generatePopulation', step: 'generatePopulation', key: 'npcs', module: 'src/generators/steps/generatePopulation.js', symbol: 'generatePopulation', origin: 'drawn' },
  { cardShape: 'npc', outputKey: 'npcs[].status', forkId: 'generatePopulation', step: 'generatePopulation', key: 'npcs', module: 'src/generators/steps/generatePopulation.js', symbol: 'generatePopulation', origin: 'drawn' },
  { cardShape: 'faction', outputKey: 'powerStructure.factions[].faction', forkId: 'generatePower', step: 'generatePower', key: 'powerStructure', module: 'src/generators/steps/generatePower.js', symbol: 'generatePower', origin: 'computed' },
  { cardShape: 'faction', outputKey: 'powerStructure.factions[].category', forkId: 'generatePower', step: 'generatePower', key: 'powerStructure', module: 'src/generators/steps/generatePower.js', symbol: 'generatePower', origin: 'computed' },
  { cardShape: 'faction', outputKey: 'powerStructure.factions[].power', forkId: 'generatePower', step: 'generatePower', key: 'powerStructure', module: 'src/generators/steps/generatePower.js', symbol: 'generatePower', origin: 'computed' },
  { cardShape: 'powerSeat', outputKey: 'powerStructure.governingName', forkId: 'generatePower', step: 'generatePower', key: 'powerStructure', module: 'src/generators/steps/generatePower.js', symbol: 'generatePower', origin: 'computed' },
  { cardShape: 'powerSeat', outputKey: 'powerStructure.factions[].isGoverning', forkId: 'generatePower', step: 'generatePower', key: 'powerStructure', module: 'src/generators/steps/generatePower.js', symbol: 'generatePower', origin: 'computed' },
]).map((row) => Object.freeze(row)));

/**
 * WHAT THE CENSUS CANNOT CATCH, DECLARED. A register that states its denominators owes the
 * reader the questions those denominators do not reach, each with what would settle it.
 */
export const GENERATION_BLIND_HALVES = Object.freeze([
  Object.freeze({ id: 'field-rootness', statement: 'Tier 1 classes a (step, key) PAIR, never a field inside the key: a key classed drawn may hold fields no draw touched, and a key classed pure may hold a field a later writer drew for.', refutableBy: 'a per-field perturbation census inside a drawn key, which would show which fields of that key actually move' }),
  Object.freeze({ id: 'hash-channel', statement: 'pickVariant and the external callers of fnv1a32 are censused and are disjoint by construction, but whether those two together are the WHOLE zero-draw selection channel is not measured; the pairProse FNV pick described at src/generators/generateSettlementPipeline.js:216 is not separately attributed.', refutableBy: 'a third zero-draw chooser inside the generation closure that reaches neither wrapper' }),
  Object.freeze({ id: 'corpus-ceiling', statement: 'Every pure verdict is pure over GENERATION_CENSUS_ROWS rows of the declared corpus, not over every reachable config: five keys measured pure here (tier, townPlus, culture, magicLevel, priorityMagicEffective) are DRAWN under a wizard-reachable config.', refutableBy: 'a config switch outside settType random, culture random_culture and _randomizePriorities that moves a key this register calls pure' }),
  Object.freeze({ id: 'second-seedrandom-importer', statement: 'The mint census counts streams minted through src/kernel/prng.js and its fork, and measured zero seeds that are not prefixed by the run root; a module that minted entropy by another door would be invisible to it.', refutableBy: 'an importer of a second entropy source inside the generation closure' }),
]);

/**
 * The two censused side channels. ⚠ THE DISPLAY-NAME-KEYED CHOICE SITES ARE NAMED IN THE
 * CENSUS FILE, NOT HERE, and that is a measurement rather than a preference: spelling those
 * three module paths in `src/` convicts this leaf under two standing estate walkers at once
 * (the entropy-root census counts a quoted stream-mint call as a site even inside a string,
 * and the settlement-map
 * surface allowlist refuses map vocabulary anywhere under `src/`). They are EM-P1b's class
 * and observed data either way, so they live beside the arm that observes them.
 */
export const GENERATION_CHANNELS = Object.freeze({
  mints: Object.freeze({ instrument: 'src/kernel/prng.js#createPRNG', direct: 4, rootSeedPrefixed: true }),
  hash: Object.freeze({ instrument: 'src/kernel/proseHash.js#pickVariant', fnv1a32External: 6 }),
});

/**
 * @param {string} step @param {string} key
 * @returns {GenerationTier1Row | null} the row, or null on a miss, never undefined
 */
export function tier1For(step, key) {
  return GENERATION_TIER1.find((row) => row.step === step && row.key === key) || null;
}

/**
 * @param {string} cardShape @param {string} outputKey
 * @returns {GenerationTier2Row[]} every matching row; one-to-many, and [] on a miss, never null
 */
export function tier2For(cardShape, outputKey) {
  return GENERATION_TIER2.filter((row) => row.cardShape === cardShape && row.outputKey === outputKey);
}
