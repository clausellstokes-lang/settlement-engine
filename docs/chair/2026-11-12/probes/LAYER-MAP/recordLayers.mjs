// LAYER-MAP recordLayers.mjs — the STORED record's strata, longest-prefix wins.
// Layer 0 = the rolled structure: the config and every DRAW that reads only the config and other draws
// (pipeline contract, `getStepMeta`; steps.json): resolveConfig, buildGenerationContext, resolveResources,
// resolveStress, resolveNeighbour, assembleInstitutions + subsumption/cascade/isolation/stressConfirm/coherenceRepair.
// Stored DERIVED fields take 1 + the highest layer their writing step reads (the contract's `reads`), a value
// the generator computes and stores is a fact like any other; a stored SENTENCE is a line (section 3).
// Each row: [prefix, layer, home, note]. Rows marked READ were read in source, not executed.
export const RECORD_LAYERS = [
  // ── layer 0: the rolled structure ──
  ['name', 0, 'assembleSettlement :: generateSettlementName', 'a draw over culture'],
  ['id', 0, 'meta', ''], ['_seed', 0, 'meta', ''], ['schemaVersion', 0, 'meta', ''], ['generatorVersion', 0, 'meta', ''], ['simulationVersion', 0, 'meta', ''],
  ['tier', 0, 'resolveConfig', 'size'], ['population', 0, 'resolveConfig', 'size'],
  ['config', 0, 'resolveConfig (the user dials, resolved)', 'terrain, access, culture, threat, priorities, magic dial, resources'],
  ['_config', 0, 'resolveConfig', ''],
  ['culturalIdentity', 0, 'buildGenerationContext (culture profile)', ''],
  ['stress', 0, 'resolveStress / isolationPass / stressConfirmPass', 'the crises in force'],
  ['stressors', 0, 'resolveStress', 'the crises in force'],
  ['activeConditions', 0, 'conditionPromotion (stress promoted)', 'the crises in force'],
  ['institutions', 0, 'assembleInstitutions (+ subsumption, cascade, isolation, coherenceRepair)', 'the roster; CAVEAT: factionCorrelationPass re-shapes it after power in 164/720 (rosterLoop.mjs)'],
  ['neighborRelationship', 0, 'resolveNeighbour', ''],
  ['stresses', 0, 'legacy alias of stress (absent in the corpus)', ''], ['settlement', 0, 'legacy wrapper key (absent in the corpus)', ''],
  ['userCanon', 0, 'meta', ''], ['aiOverlays', 0, 'meta', ''], ['simulationTrace', 0, 'meta', ''], ['generationCoherenceReceipt', 0, 'meta', ''],
  // ── layer 1: the economy and the structural checks, stored (reads roster + config) ──
  ['economicState', 1, 'generateEconomy → economyReconcilePass', 'reads institutions, config, neighbour'],
  ['economicState.safetyProfile.crimeTypes', 3, 'assembleSettlement :: settleCrimeLinesToSignal', 'desc re-settled against the powers (L2) — READ'],
  ['spatialLayout', 1, 'economyReconcilePass', ''], ['availableServices', 1, 'economyReconcilePass', ''],
  ['isolationSupport', 1, 'isolationPass / coherenceRepairPass', 'reads stress, tier, route, roster'],
  ['structuralViolations', 1, 'structuralValidationPass', ''], ['structuralSuggestions', 1, 'structuralValidationPass', ''],
  ['culturalIdentity.foodways', 2, 'assembleSettlement :: foodwaysLineOf({economicState})', 'a stored LINE over the food record'],
  // ── layer 2: the powers (generatePower reads economicState) ──
  ['powerStructure', 2, 'generatePower → neighbourFactions → powerEconomyReconcilePass', 'government and factions are DRAWS conditioned on the economy'],
  ['conflicts', 4, 'assembleSettlement :: generateConflicts(factions, relationships, config, institutions, npcs)', 'reads the cast (L3) — READ'],
  ['powerStructure.criminalCaptureState', 4, 'people/hallCapture.js :: writeHallCapture', 'reads the cast\'s memberships (L3) — READ'],
  // ── layer 3: the cast and the narratives (read economy L1 and powers L2) ──
  ['npcs', 3, 'generatePopulation (reads economicState, powerStructure)', 'the cast'],
  ['relationships', 3, 'generatePopulation', ''],
  ['history', 3, 'generateNarratives (reads economicState, powerStructure)', 'events are draws; their text is stored LINES'],
  ['settlementReason', 3, 'generateNarratives', 'stored LINES'],
  ['resourceAnalysis', 3, 'generateNarratives', 'derived over resources + economy'],
  ['economicViability', 3, 'generateNarratives', 'derived; issues/summary are stored LINES'],
  // ── stored lines written at assembly (their layer is taken in section 3) ──
  ['arrivalScene', 4, 'assembleSettlement :: generateArrivalScene(settlement)', 'a stored LINE over the whole record'],
  ['pressureSentence', 4, 'assembleSettlement :: generatePressureSentence(settlement)', 'a stored LINE over the whole record'],
  ['culturalNotes', 1, 'assembleSettlement :: culturalNotesFor(culturalIdentity)', 'a stored LINE over culture'],
  ['prominentRelationship', 4, 'assembleSettlement', 'a stored LINE over the cast'],
  ['coherenceNotes', 4, 'assembleSettlement', ''],
  ['crisisCast', 4, 'resolveCrisisCast', ''],
  ['defenseProfile', null, 'assembleSettlement :: generateDefenseProfile(settlement)', 'by READS 4 (its generator reads the cast; facts.mjs); by VALUE 2 (readiness.mjs: economy, roster, config only)'],
];
export function layerOfPath(path, overrides = {}) {
  let best = null;
  for (const row of RECORD_LAYERS) {
    const [p] = row;
    if (path === p || path.startsWith(p + '.')) if (!best || p.length > best[0].length) best = row;
  }
  if (best && best[1] == null && overrides[best[0]] != null) return { layer: overrides[best[0]], row: best };
  return best ? { layer: best[1], row: best } : { layer: null, row: null };
}
