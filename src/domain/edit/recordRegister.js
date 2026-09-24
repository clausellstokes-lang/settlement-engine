// src/domain/edit/recordRegister.js — PURE FROZEN DATA. No branch, no function, no import.
// Every row is a MEASUREMENT over the golden corpus and the save path, re-measured at promotion;
// the walker holds this file equal to the corpus in BOTH directions.
// ⛔ NO src/generators/** MODULE MAY IMPORT THIS FILE (§5.4).
// ⛔ PATH SPELLING: collapsed. `[]` means "at every index"; `factions[].members` is the
//    collection, `factions[].members[]` the entry. The merge's keyed arm passes exactly this
//    spelling to an entry node, which is how a PER-ENTRY group is matched with no new machinery.

export const RECORD_CLASS_NAMES = Object.freeze([
  'HELD', 'WORLD', 'CONSTANT', 'READING', 'MIRROR', 'RECEIPT', 'HISTORY', 'AUTHORED',
]);

/** Every top-level key a record can carry — generated, saved, or the editor's. */
export const RECORD_CLASSES = Object.freeze({
  // HELD (7) — the record's first-hand entity facts. Never re-derived.
  institutions: 'HELD', npcs: 'HELD', factions: 'HELD', relationships: 'HELD',
  conflicts: 'HELD', powerStructure: 'HELD', name: 'HELD',
  // WORLD (3) — the input itself; the merge takes R1's.
  config: 'WORLD', _config: 'WORLD', _seed: 'WORLD',
  // CONSTANT (4)
  id: 'CONSTANT', generatorVersion: 'CONSTANT', schemaVersion: 'CONSTANT',
  simulationVersion: 'CONSTANT',
  // READING (25) — everything the seam does not hold; merged three-way, never recomputed.
  activeConditions: 'READING', arrivalScene: 'READING', availableServices: 'READING',
  coherenceNotes: 'READING', culturalIdentity: 'READING', culturalNotes: 'READING',
  defenseProfile: 'READING', economicState: 'READING', economicViability: 'READING',
  generationCoherenceReceipt: 'READING', history: 'READING', isolationSupport: 'READING',
  neighborRelationship: 'READING', population: 'READING', pressureSentence: 'READING',
  prominentRelationship: 'READING', resourceAnalysis: 'READING', settlementReason: 'READING',
  simulationTrace: 'READING', spatialLayout: 'READING', stress: 'READING', stressors: 'READING',
  structuralSuggestions: 'READING', structuralViolations: 'READING', tier: 'READING',
  // AUTHORED (2 live) — the DM's and the clerk's words, untouched BY CLASS.
  userCanon: 'AUTHORED', aiOverlays: 'AUTHORED',
  // SAVED-ONLY (6) — generation produces none of these; see SAVED_ONLY_KEYS.
  neighbourNetwork: 'HELD', interSettlementRelationships: 'HELD',
  crossSettlementConflicts: 'HELD', populationHistory: 'HISTORY',
  // THE EDITOR'S (2) — SAVED-ONLY since the editor landed its writers; see SAVED_ONLY_KEYS.
  dmLayer: 'AUTHORED', decrees: 'AUTHORED',
});

/** The 41 a generated record carries. Arm A1 asserts this set exactly against the corpus. */
export const GENERATED_KEYS = Object.freeze([
  '_config', '_seed', 'activeConditions', 'aiOverlays', 'arrivalScene', 'availableServices',
  'coherenceNotes', 'conflicts', 'config', 'culturalIdentity', 'culturalNotes', 'defenseProfile',
  'economicState', 'economicViability', 'factions', 'generationCoherenceReceipt',
  'generatorVersion', 'history', 'id', 'institutions', 'isolationSupport', 'name',
  'neighborRelationship', 'npcs', 'population', 'powerStructure', 'pressureSentence',
  'prominentRelationship', 'relationships', 'resourceAnalysis', 'schemaVersion',
  'settlementReason', 'simulationTrace', 'simulationVersion', 'spatialLayout', 'stress',
  'stressors', 'structuralSuggestions', 'structuralViolations', 'tier', 'userCanon',
]);
/** Written only by the save path, the campaign, the pulse or the EDITOR — never by generation.
 *  ⭐ THE EDITOR'S TWO JOINED THIS CLASS AT THE OBSERVED-SHAPE REGISTER'S SCHEMA-23 RUNG, which
 *  is where the claim is PROVED rather than merely asserted: that rung's gate 0 re-reads each
 *  named writer out of the scanned tree on every scan, so a key listed here whose writer is
 *  deleted or renamed reds the register instead of leaving a stale row. Their writers are no
 *  longer named in this sentence — they are DATA, in `EDITOR_KEY_WRITERS` below, so that the
 *  claim is re-derived from source by an arm rather than believed from a comment (U62).
 *  The other four keep the writers they always had (the save path's neighbour back-link, the
 *  link/undo/import paths, and the campaign's population history). */
export const SAVED_ONLY_KEYS = Object.freeze([
  'neighbourNetwork', 'interSettlementRelationships', 'crossSettlementConflicts', 'populationHistory',
  'dmLayer', 'decrees',
]);

/**
 * ⭐ EVERY WRITER OF THE EDITOR'S TWO KEYS, BY FILE AND BY SYMBOL — U62, and the row it closes
 * said this register "names ONE writer per save-time key" while the tree carried more. A claim
 * about who writes a key is exactly the kind that rots between landings: EM-E8 added a
 * whole-record write of `dmLayer` at the roster tick, EM-E1's rewind added three `decrees`
 * writes on the undo path, and EM-C1b's per-save resolution added a fourth in the pulse's own
 * hook — none of which a prose sentence naming two sites could notice.
 *
 * ⛔ THE ROW IS NOT THE PROOF; THE ARM IS. `tests/lint/heldKeyWriterCensus.walker.test.js`'s A7
 * RE-DERIVES this set out of `src/` on every run and holds it equal BOTH WAYS — a writer that
 * appears, moves symbol, moves file or retires reds by name, and a row here that resolves to no
 * site reds too. That is the promotion census's A3 idiom: a claim re-derived every run, never
 * believed. This table is therefore a MEASUREMENT of the tree, not an intention about it.
 *
 * `sites` is the number of write sites of that key inside that symbol, so the undo path's two
 * rehydration branches cannot silently collapse into one. `spelling` is the shape the arm's
 * scanner matches: `assign` is `<expr>.<key> = …`, `literal` is `<key>: …` inside an object
 * literal that rebuilds the record.
 */
export const EDITOR_KEY_WRITERS = Object.freeze([
  Object.freeze({
    key: 'dmLayer', file: 'src/store/editSlice.js', symbol: 'applyCascadeEdit',
    sites: 1, spelling: 'assign',
  }),
  Object.freeze({
    key: 'dmLayer', file: 'src/store/editSlice.js', symbol: 'applyPlainEditToDraft',
    sites: 1, spelling: 'assign',
  }),
  // EM-E8's whole-record write: the roster tick re-derives the world and carries the layer onto
  // the fresh record, so the key is written on an object that is not `state.settlement` yet.
  Object.freeze({
    key: 'dmLayer', file: 'src/store/editSlice.js', symbol: 'applyRosterDecreesAtTick',
    sites: 1, spelling: 'assign',
  }),
  Object.freeze({
    key: 'decrees', file: 'src/store/editSlice.js', symbol: 'commitRegistry',
    sites: 1, spelling: 'assign',
  }),
  // EM-E1's rewind, three sites in one symbol: the library row, and the live view on EACH of the
  // two rehydration branches. The `sites: 3` is what keeps the pair of branches visible.
  Object.freeze({
    key: 'decrees', file: 'src/store/campaignWorldPulseDeferred.js', symbol: 'restorePulseSnapshotOnDraft',
    sites: 3, spelling: 'assign',
  }),
  // EM-C1b's per-save resolution: the pulse's own hook rebuilds the save around a new registry.
  Object.freeze({
    key: 'decrees', file: 'src/domain/worldPulse/decreeHook.js', symbol: 'applyDecreesToSaves',
    sites: 1, spelling: 'literal',
  }),
]);
/** Declared, classed SAVED-ONLY, and still written by NOTHING IN src/ — an OVERLAY on the list
 *  above rather than a class of its own, so arm A1 asserts both the partition and this subset.
 *  ⚠ `crossSettlementConflicts` is the whole of it because nothing in src/ writes the key: two
 *  readers merge it and the public allow-list names it (RelationshipsTab.jsx:59;
 *  relationshipsDeskRead.js:156), and the observed-shape register drove the identity
 *  `crossSettlementConflicts on settlement` to ZERO addresses at its schema-22 rung.
 *  ⛔ `dmLayer` and `decrees` LEFT THIS LIST AT THE SCHEMA-23 RUNG, and the distinction is the
 *  point: they are no longer declared-ahead, they are WRITTEN — by the store, one lifecycle step
 *  outside generation — which is exactly why their reads had to be admitted to that register
 *  rather than refused by it. */
export const NOT_YET_WRITTEN_KEYS = Object.freeze(['crossSettlementConflicts']);

/** Sub-paths whose class differs from their parent's. The WHOLE exception list. */
export const CLASS_EXCEPTIONS = Object.freeze({
  'powerStructure.economyInputFingerprint': 'RECEIPT',
  'factions[].members[]': 'MIRROR',
  // ⭐ MEASURED, not named: the ONLY receipt sub-path that reads an input the record lacks.
  'generationCoherenceReceipt.repairs': 'HISTORY',
  // ⛔ ONE PATH, TWO DECLARATIONS, TWO DIFFERENT ACTS -- and it is in both tables on purpose.
  //    ATOMIC_COLLECTIONS governs THE MERGE: the evidence array has no sound key, so the tree
  //    merge takes it from R1 as ONE value, exactly as it always has.
  //    This MIRROR row governs THE POST-PASS: the two PROSE-COUNT rows the receipt carries
  //    (finalGraph's NPC and relationship counts, narrative's historical-event count) are a pure
  //    function of the MERGED record's own HELD rosters, RESTATED after the merge and never
  //    merged. Only the digits those two patterns capture move; no other character does.
  //    generationCoherenceReceipt.repairs stays HISTORY and is neither read nor written by it.
  'generationCoherenceReceipt.judgments[].evidence': 'MIRROR',
});

/** Collections merged BY a declared key (48). A string is one field; an array is a composite. */
export const KEYED_COLLECTIONS = Object.freeze({
  activeConditions: 'archetype',
  'availableServices.criminal': 'name',
  'availableServices.employment': 'name',
  'availableServices.entertainment': 'name',
  'availableServices.equipment': 'name',
  'availableServices.food': 'name',
  'availableServices.healing': 'name',
  'availableServices.information': 'name',
  'availableServices.legal': 'name',
  'availableServices.lodging': 'name',
  'availableServices.magic': 'name',
  'availableServices.transport': 'name',
  conflicts: Object.freeze(['parties', 'issue']),
  'defenseProfile.institutions.charter': 'name',
  'defenseProfile.institutions.garrison': 'name',
  'defenseProfile.institutions.magicDef': 'name',
  'defenseProfile.institutions.mercenary': 'name',
  'defenseProfile.institutions.militia': 'name',
  'defenseProfile.institutions.walls': 'name',
  'defenseProfile.institutions.watch': 'name',
  'economicState.activeChains': 'label',
  'economicState.institutionalServices': 'label',
  'economicState.safetyProfile.crimeTypes': 'type',
  'economicState.tradeDependencies': Object.freeze(['institution', 'resource']),
  'economicViability.dependencies': 'title',
  'economicViability.plotHooks': 'category',
  'economicViability.warnings': 'title',
  factions: 'name',
  'factions[].members': 'id',
  'generationCoherenceReceipt.checks': 'id',
  'generationCoherenceReceipt.judgments': 'id',
  'generationCoherenceReceipt.repairs': Object.freeze(['type', 'subject', 'action']),
  'history.currentTensions': 'type',
  'history.eventsTimeline': 'name',
  'history.historicalEvents': 'name',
  'history.legacyAnnotations': Object.freeze(['eventName', 'yearsAgo']),
  institutions: 'name',
  npcs: 'id',
  'powerStructure.conflicts': Object.freeze(['parties', 'issue']),
  'powerStructure.factionRelationships': 'pair',
  relationships: Object.freeze(['npc1Id', 'npc2Id', 'type']),
  'resourceAnalysis.exploitation.fullyExploited': 'chainKey',
  'resourceAnalysis.exploitation.partiallyExploited': 'chainKey',
  'resourceAnalysis.exploitation.unexploited': 'chainKey',
  'resourceAnalysis.exports': 'chain',
  'resourceAnalysis.resourceChains': 'chainKey',
  'resourceAnalysis.resourceConditions': 'key',
  'spatialLayout.quarters': 'name',
});

/** Collections merged AS ONE VALUE (15) — keyless, key-broken, or under a cross-entry total. */
export const ATOMIC_COLLECTIONS = Object.freeze([
  'activeConditions[].causes',
  'config._isolationSupport.paths',
  'economicState.incomeSources',
  'economicViability.issues',
  'economicViability.suggestions',
  'generationCoherenceReceipt.authoredTensions',
  'generationCoherenceReceipt.judgments[].evidence',
  'isolationSupport.paths',
  'powerStructure.factions',
  'resourceAnalysis.gaps',
  'simulationTrace',
  'simulationTrace[].causes',
  'simulationTrace[].downstreamEffects',
  'structuralSuggestions',
  'structuralViolations',
]);

/** ⭐ Why two of those fifteen are atomic DESPITE carrying a sound key (design §22.3 item 3):
 *  taking one changed entry from the re-derivation beside settled neighbours breaks the total.
 *  `mootUnder: 'HELD'` records that the merge cannot reach the second one today. */
export const CROSS_ENTRY_TOTALS = Object.freeze({
  'economicState.incomeSources': Object.freeze({ field: 'percentage', total: 100 }),
  'powerStructure.factions': Object.freeze({ field: 'power', total: 100, mootUnder: 'HELD' }),
});

/** ⚠ Rows whose longest observed array is ONE entry: the corpus cannot test uniqueness there,
 *  so the key is declared on its STABILITY and NAMED as unproven. */
export const KEY_UNPROVEN_AT_LENGTH_ONE = Object.freeze([
  'activeConditions',
  'activeConditions[].causes',
  'defenseProfile.institutions.charter',
  'defenseProfile.institutions.mercenary',
  'defenseProfile.institutions.militia',
  'defenseProfile.institutions.watch',
  'economicViability.warnings',
  'generationCoherenceReceipt.authoredTensions',
  'structuralSuggestions',
]);

/** ⛔ Collections a reclassification may NOT merge without first proving a key. */
export const UNMERGEABLE_COLLECTIONS = Object.freeze([
  'relationships', 'conflicts', 'powerStructure.conflicts',
]);

/** Object paths the generator derives together. `members: null` means the whole object.
 *  A root spelled `foo[]` is a PER-ENTRY group, matched at the entry node the keyed merge
 *  produces — by path equality, with no additional mechanism.
 *  ⛔ GROUPS NEVER NEST, and "nest" is measured over what a group COVERS — its root expanded
 *     by its member list, `members: null` covering the root itself — NEVER over root strings:
 *     `viability-counts` is rooted at `economicViability` and `food-balance` inside it, which
 *     is lawful precisely because the member list stops the first swallowing the second
 *     (design §22.3 item 2). Arm A6 asserts disjoint COVERED SETS. */
export const CONSISTENCY_GROUPS = Object.freeze([
  { id: 'food-security', root: 'economicState.foodSecurity', members: null },
  { id: 'food-balance', root: 'economicViability.metrics.foodBalance', members: null },
  { id: 'viability-counts', root: 'economicViability', members: Object.freeze([
    'summary', 'dependencies', 'warnings', 'plotHooks',
    'metrics.dependencyCount', 'metrics.warningCount']) },
  { id: 'isolation-support', root: 'isolationSupport', members: Object.freeze([
    'requiredCapacity', 'capacity', 'deficit', 'status']) },
  { id: 'condition-severity', root: 'activeConditions[]', members: Object.freeze([
    'severity', 'severityBand']) },
  { id: 'defense-readiness', root: 'defenseProfile.readiness', members: null },
  // ⭐ ONE FACT AT TWO PATHS (ODQ §934.47 addendum 38 ruling 1): history.age === history.founding.age
  //    in 63/63, and the merge splits it. The two-member list is required — `members: null` would
  //    swallow history's three ORDER-BEARING collections whenever the age moved.
  { id: 'history-age', root: 'history', members: Object.freeze(['age', 'founding.age']) },
]);
