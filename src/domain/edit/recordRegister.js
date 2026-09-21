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
  // SAVED-ONLY (4) — generation produces none of these; see SAVED_ONLY_KEYS.
  neighbourNetwork: 'HELD', interSettlementRelationships: 'HELD',
  crossSettlementConflicts: 'HELD', populationHistory: 'HISTORY',
  // THE EDITOR'S (2) — declared ahead; asserted ABSENT until an editor packet writes them.
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
/** Written only by the save path, the campaign or the pulse — never by generation. */
export const SAVED_ONLY_KEYS = Object.freeze([
  'neighbourNetwork', 'interSettlementRelationships', 'crossSettlementConflicts', 'populationHistory',
]);
/** Declared but not yet written anywhere. Arm A1 asserts their ABSENCE, never their shape.
 *  ⚠ `crossSettlementConflicts` is here because NOTHING IN src/ WRITES IT: two readers merge it
 *  and the public allow-list names it (RelationshipsTab.jsx:59; relationshipsDeskRead.js:156). */
export const NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts']);

/** Sub-paths whose class differs from their parent's. The WHOLE exception list. */
export const CLASS_EXCEPTIONS = Object.freeze({
  'powerStructure.economyInputFingerprint': 'RECEIPT',
  'factions[].members[]': 'MIRROR',
  // ⭐ MEASURED, not named: the ONLY receipt sub-path that reads an input the record lacks.
  'generationCoherenceReceipt.repairs': 'HISTORY',
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
