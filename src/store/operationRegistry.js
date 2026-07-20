/**
 * operationRegistry.js — Track K COMPLETION §2/§3: the OPERATION MANIFEST.
 *
 * The complete census of every state-mutating store action (the set()-usage
 * denominator — see the walker at tests/store/operationRegistry.walker.test.js),
 * classified per DESIGN_TRACK_K_COMPLETION.md §2 into the operation surface:
 *   K-A CANON       — the 5 Track-K canon-path actions (ActionResult-enveloped);
 *                     they adapt to the registry with ZERO change via
 *                     operationFromActionResult (operations.js).
 *   K-B MECHANICAL  — simple setters/updaters of durable/domain state.
 *   K-C MACRO       — orchestrators whose EXISTING receipts (rollExplanations,
 *                     rulesetLog, pulse records, eventLog entries, regeneration
 *                     deltas) become the receiptRef; no internal change.
 *   K-D EXEMPT      — pure-UI / transient / session state (EXEMPT_OPERATIONS),
 *                     registered exempt-with-reason so the walker's denominator
 *                     is total. Shrink-only (EXEMPT_CEILING).
 *
 * WHY THIS WAVE ADDS NO RUNTIME EMISSION (the budget + sequencing call). The
 * design §4 anticipated ~1-2 lines/action of eager envelope-emission (≤400 B).
 * The store slices are EAGER (in the first-paint static closure) and the closure
 * budget margin is ~54 B against CLOSURE_BUDGET_BYTES=1,214,050 — so eager
 * emission across ~150 actions provably cannot ship within the constitution's
 * first-paint gate, and its only consumer (the Surveyor proposal/approval lane +
 * the owner-gated aiOperationLog, DESIGN_AI_CONTROL_SURFACE.md stage 3) does not
 * exist yet. So this wave ships the typed operation SURFACE (this manifest) + the
 * completeness WALKER (§3, the wave's stated point) with ZERO action-body changes
 * — goldens stay byte-identical and first-paint is untouched (nothing eager
 * imports this module or operations.js). Runtime envelope FLOW lands with its
 * consumer, when the budget question is owner-resolved. This is a deliberate,
 * documented divergence from §4's eager estimate, not an omission.
 *
 * opType == the store action name (the ActionResult.action convention): manual UI
 * and the future AI compiler name the SAME verb. receiptRef/undoToken are hints at
 * the EXISTING receipt source + undo action (§5: undoToken points at existing undo
 * machinery where it exists; absent ⇒ null — this wave adds no undo).
 *
 * @see tests/store/operationRegistry.walker.test.js — enforces this is COMPLETE.
 */

/**
 * @typedef {Object} OperationSpec
 * @property {string} opType        canonical verb (== the store action name)
 * @property {'canon'|'macro'|'mechanical'} klass   its §2 class
 * @property {string} slice         the slice module that defines it
 * @property {'save'|'campaign'|'global'} targetScope  what the op addresses
 * @property {string|null} receiptRef  the EXISTING receipt source it produces, or null
 * @property {string|null} undoToken   the EXISTING undo action, or null
 */

/** The registered operation surface — every mutating action that is a real verb. */
export const OPERATIONS = Object.freeze({
  // ── K-A CANON (5) — ActionResult-enveloped; adapt via operationFromActionResult ──
  applyEvent: { opType:'applyEvent', klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry', undoToken:'undoLastEvent' },
  undoLastEvent: { opType:'undoLastEvent', klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  recordSnapshot: { opType:'recordSnapshot', klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'versionHistory-snapshot', undoToken:'revertToSnapshot' },
  revertToSnapshot: { opType:'revertToSnapshot', klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  destroySavedSettlement: { opType:'destroySavedSettlement', klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry(DESTROY_SETTLEMENT)', undoToken:null },
  // ── K-C MACRO (40) — orchestrators; existing receipts become receiptRef ──
  generateSettlement: { opType:'generateSettlement', klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'pipelineHistory', undoToken:null },
  regenSection: { opType:'regenSection', klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'regenerationDelta', undoToken:null },
  canonize: { opType:'canonize', klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'uncanonize' },
  uncanonize: { opType:'uncanonize', klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'canonize' },
  applyEventBatch: { opType:'applyEventBatch', klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry(per-event)', undoToken:'undoLastEvent' },
  canonizeSavedSettlement: { opType:'canonizeSavedSettlement', klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  commitPendingEdits: { opType:'commitPendingEdits', klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'versionHistory-snapshot', undoToken:'revertToSnapshot' },
  importGalleryMapWithCampaign: { opType:'importGalleryMapWithCampaign', klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'GALLERY_IMPORTED', undoToken:null },
  instantWorld: { opType:'instantWorld', klass:'macro', slice:'instantWorldSlice', targetScope:'campaign', receiptRef:'campaign+canon-members', undoToken:null },
  importGallerySettlement: { opType:'importGallerySettlement', klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'gallery-import-id', undoToken:null },
  rebuildCampaignRegionalGraph: { opType:'rebuildCampaignRegionalGraph', klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'regionalGraph', undoToken:null },
  injectCampaignStressor: { opType:'injectCampaignStressor', klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'normalized-stressor', undoToken:'undoCampaignStressorBridge' },
  resolveCampaignStressor: { opType:'resolveCampaignStressor', klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'residual-proposals', undoToken:'undoCampaignStressorBridge' },
  undoCampaignStressorBridge: { opType:'undoCampaignStressorBridge', klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  advanceCampaignRegionalImpacts: { opType:'advanceCampaignRegionalImpacts', klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'regionalGraph', undoToken:null },
  applyQueuedRegionalImpact: { opType:'applyQueuedRegionalImpact', klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'impact-result', undoToken:null },
  resolveRegionalImpact: { opType:'resolveRegionalImpact', klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'impact-result', undoToken:null },
  requestNarrative: { opType:'requestNarrative', klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED+chronicle', undoToken:'revertCurrentToRaw' },
  requestDailyLife: { opType:'requestDailyLife', klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED', undoToken:'revertCurrentToRaw' },
  requestProgression: { opType:'requestProgression', klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED+chronicle', undoToken:'revertCurrentToRaw' },
  applyCosmeticRename: { opType:'applyCosmeticRename', klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null },
  revertCurrentToRaw: { opType:'revertCurrentToRaw', klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'chronicle-entry', undoToken:null },
  loadCustomContentFromCloud: { opType:'loadCustomContentFromCloud', klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  migrateLocalCustomContentToCloud: { opType:'migrateLocalCustomContentToCloud', klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  importAccountData: { opType:'importAccountData', klass:'macro', slice:'accountImportSlice', targetScope:'global', receiptRef:'GALLERY_IMPORTED', undoToken:null },
  importNeighbour: { opType:'importNeighbour', klass:'macro', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  handleImportDirect: { opType:'handleImportDirect', klass:'macro', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  canonizeCampaignWorld: { opType:'canonizeCampaignWorld', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'world_canonized', undoToken:'undoLastPulse' },
  canonizeCampaignWorldSpatial: { opType:'canonizeCampaignWorldSpatial', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'spatialDigest', undoToken:null },
  updateCampaignSimulationRules: { opType:'updateCampaignSimulationRules', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'rulesetLog', undoToken:null },
  advanceCampaignWorld: { opType:'advanceCampaignWorld', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  catchUpCampaignWorld: { opType:'catchUpCampaignWorld', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  resolveIntervalMajors: { opType:'resolveIntervalMajors', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  applyWorldPulseProposal: { opType:'applyWorldPulseProposal', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  recordPartyImpact: { opType:'recordPartyImpact', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  recordCanonRelationshipRipple: { opType:'recordCanonRelationshipRipple', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:'reverseCanonRelationshipRipple' },
  reverseCanonRelationshipRipple: { opType:'reverseCanonRelationshipRipple', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  dismissWorldPulseProposal: { opType:'dismissWorldPulseProposal', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'proposal-status', undoToken:null },
  // W-COMPOSER-2: the realm-verb force-as-proposal mint (cancel = dismissWorldPulseProposal; apply = applyWorldPulseProposal).
  stageRealmVerb: { opType:'stageRealmVerb', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'realm-proposal', undoToken:null },
  undoLastPulse: { opType:'undoLastPulse', klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  // ── K-B MECHANICAL (118) — simple setters/updaters of durable/domain state ──
  queueEdit: { opType:'queueEdit', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'revertSingleEdit' },
  revertSingleEdit: { opType:'revertSingleEdit', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  revertPendingEdits: { opType:'revertPendingEdits', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setSettlement: { opType:'setSettlement', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  clearSettlement: { opType:'clearSettlement', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setSavedSettlements: { opType:'setSavedSettlements', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setActiveSaveId: { opType:'setActiveSaveId', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  clearSavedSettlements: { opType:'clearSavedSettlements', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  removeSavedSettlement: { opType:'removeSavedSettlement', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  updateSavedSettlement: { opType:'updateSavedSettlement', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  renameNPC: { opType:'renameNPC', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  renameFaction: { opType:'renameFaction', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  applyUserEditAction: { opType:'applyUserEditAction', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'revertUserEditAction' },
  revertUserEditAction: { opType:'revertUserEditAction', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'applyUserEditAction' },
  persistActiveSaveEdit: { opType:'persistActiveSaveEdit', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  markExported: { opType:'markExported', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setLock: { opType:'setLock', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  clearLocks: { opType:'clearLocks', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  refreshSystemState: { opType:'refreshSystemState', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  hydrateFromSave: { opType:'hydrateFromSave', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  renameSettlement: { opType:'renameSettlement', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  // SM-3 — cosmetic town-map edit (mapEdits container: nudges / reroll / legend
  // prefs). Mechanical: a durable blob write via the applyEvent persist triple.
  // Cosmetic-always (no canon lock); undo rides the blob's own time-travel (no
  // dedicated map undo action ⇒ undoToken:null).
  applyMapEdit: { opType:'applyMapEdit', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  // DOOR 2 — fog-of-war reveal edit (fogSessions sidecar: per-session district/street/
  // building reveal). Mechanical: a durable blob write via the applyMapEdit persist idiom.
  // Cosmetic-always (no canon lock); undo rides the blob's own time-travel (undoToken:null).
  applyFogEdit: { opType:'applyFogEdit', klass:'mechanical', slice:'fogEditSlice', targetScope:'save', receiptRef:null, undoToken:null },
  syncActiveNeighbourFields: { opType:'syncActiveNeighbourFields', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  recordCanonFlavorEntry: { opType:'recordCanonFlavorEntry', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'undoLastEvent' },
  retryOutbox: { opType:'retryOutbox', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  loadCampaigns: { opType:'loadCampaigns', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearCampaigns: { opType:'clearCampaigns', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  createCampaign: { opType:'createCampaign', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  renameCampaign: { opType:'renameCampaign', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteCampaign: { opType:'deleteCampaign', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  toggleCampaignCollapsed: { opType:'toggleCampaignCollapsed', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  addToCampaign: { opType:'addToCampaign', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  removeFromCampaign: { opType:'removeFromCampaign', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  saveCampaignMap: { opType:'saveCampaignMap', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearCampaignMap: { opType:'clearCampaignMap', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  updateSavedCampaign: { opType:'updateSavedCampaign', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearCampaignWizardNews: { opType:'clearCampaignWizardNews', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  appendCampaignChronicle: { opType:'appendCampaignChronicle', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setActiveCampaign: { opType:'setActiveCampaign', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  queueSettlementEvent: { opType:'queueSettlementEvent', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  cancelQueuedEvent: { opType:'cancelQueuedEvent', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  // W-COMPOSER-2 §10: the MUTABLE DOCKET — in-place edit of a queued intention.
  updateQueuedEvent: { opType:'updateQueuedEvent', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  // Composer V2 §4 — target-first / SuccessorPrompt injection staging. Writes
  // only the transient composerIntent field (registered rather than exempt:
  // the K-D exempt ledger sits at its shrink-only ceiling).
  stageComposerIntent: { opType:'stageComposerIntent', klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  reorderCampaignSettlements: { opType:'reorderCampaignSettlements', klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  ensureCampaignRegionalGraph: { opType:'ensureCampaignRegionalGraph', klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setRegionalChannelStatus: { opType:'setRegionalChannelStatus', klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setRegionalChannelVisibility: { opType:'setRegionalChannelVisibility', klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setCampaignRegionalGraph: { opType:'setCampaignRegionalGraph', klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  queueCampaignRegionalImpacts: { opType:'queueCampaignRegionalImpacts', klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setRegionalImpactStatus: { opType:'setRegionalImpactStatus', klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setAiSettlement: { opType:'setAiSettlement', klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:'revertCurrentToRaw' },
  clearAiSettlement: { opType:'clearAiSettlement', klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setAiDailyLife: { opType:'setAiDailyLife', klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:'revertCurrentToRaw' },
  hydrateAiFromSave: { opType:'hydrateAiFromSave', klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setAuth: { opType:'setAuth', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  clearAuth: { opType:'clearAuth', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'setAuth' },
  setDossierEntitlement: { opType:'setDossierEntitlement', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearDossierEntitlements' },
  clearDossierEntitlements: { opType:'clearDossierEntitlements', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:null },
  refreshDossierEntitlement: { opType:'refreshDossierEntitlement', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:null },
  initAuth: { opType:'initAuth', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  authSignUp: { opType:'authSignUp', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  authSignIn: { opType:'authSignIn', klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  addCustomItem: { opType:'addCustomItem', klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:'deleteCustomItem' },
  updateCustomItem: { opType:'updateCustomItem', klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  deleteCustomItem: { opType:'deleteCustomItem', klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  clearCloudCustomContent: { opType:'clearCloudCustomContent', klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:'loadCustomContentFromCloud' },
  // V-5 THE CORPUS FACTORY — staging-catalog mutations. None writes canon (canon is the
  // owner's gen:compendium-data fold of APPROVED_CORPUS); these only stage/review candidates.
  stageCorpusCandidates: { opType:'stageCorpusCandidates', klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:'removeCorpusCandidate' },
  reviewCorpusCandidate: { opType:'reviewCorpusCandidate', klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:null },
  removeCorpusCandidate: { opType:'removeCorpusCandidate', klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:null },
  addPlacement: { opType:'addPlacement', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  removePlacementLocal: { opType:'removePlacementLocal', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updatePlacement: { opType:'updatePlacement', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  replaceAllPlacements: { opType:'replaceAllPlacements', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearAllPlacementsLocal: { opType:'clearAllPlacementsLocal', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  addLabel: { opType:'addLabel', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updateLabel: { opType:'updateLabel', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteLabel: { opType:'deleteLabel', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  addMarker: { opType:'addMarker', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updateMarker: { opType:'updateMarker', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteMarker: { opType:'deleteMarker', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  addForest: { opType:'addForest', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updateForest: { opType:'updateForest', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteForest: { opType:'deleteForest', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  setMapSnapshot: { opType:'setMapSnapshot', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setMapBackdrop: { opType:'setMapBackdrop', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearMapBackdrop: { opType:'clearMapBackdrop', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  bumpGeometryVersion: { opType:'bumpGeometryVersion', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  replaceMapState: { opType:'replaceMapState', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  resetMapState: { opType:'resetMapState', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  pushMapUndo: { opType:'pushMapUndo', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  mapUndo: { opType:'mapUndo', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapRedo' },
  mapRedo: { opType:'mapRedo', klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  clearNeighbour: { opType:'clearNeighbour', klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setNeighbourRelType: { opType:'setNeighbourRelType', klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  addNeighbourLink: { opType:'addNeighbourLink', klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  removeNeighbourLink: { opType:'removeNeighbourLink', klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setNeighbourNetwork: { opType:'setNeighbourNetwork', klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  completeOnboarding: { opType:'completeOnboarding', klass:'mechanical', slice:'onboardingSlice', targetScope:'global', receiptRef:null, undoToken:'resetOnboarding' },
  markFeatureUsed: { opType:'markFeatureUsed', klass:'mechanical', slice:'onboardingSlice', targetScope:'global', receiptRef:null, undoToken:'resetOnboarding' },
  resetOnboarding: { opType:'resetOnboarding', klass:'mechanical', slice:'onboardingSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setCreditBalance: { opType:'setCreditBalance', klass:'mechanical', slice:'creditsSlice', targetScope:'global', receiptRef:null, undoToken:null },
  addCredits: { opType:'addCredits', klass:'mechanical', slice:'creditsSlice', targetScope:'global', receiptRef:null, undoToken:null },
  spendCredits: { opType:'spendCredits', klass:'mechanical', slice:'creditsSlice', targetScope:'global', receiptRef:null, undoToken:null },
  updateConfig: { opType:'updateConfig', klass:'mechanical', slice:'configSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetConfig: { opType:'resetConfig', klass:'mechanical', slice:'configSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setSettlementType: { opType:'setSettlementType', klass:'mechanical', slice:'configSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleInstitution: { opType:'toggleInstitution', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setInstitutionToggles: { opType:'setInstitutionToggles', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  mergeInstitutionToggles: { opType:'mergeInstitutionToggles', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleCategory: { opType:'toggleCategory', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setCategoryToggles: { opType:'setCategoryToggles', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleGood: { opType:'toggleGood', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setGoodsToggles: { opType:'setGoodsToggles', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleService: { opType:'toggleService', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setServiceToggles: { opType:'setServiceToggles', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetToggles: { opType:'resetToggles', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetGoodsServices: { opType:'resetGoodsServices', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetAllToggles: { opType:'resetAllToggles', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  bulkSetInstitutions: { opType:'bulkSetInstitutions', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  bulkSetServices: { opType:'bulkSetServices', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  bulkSetGoods: { opType:'bulkSetGoods', klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
});

/** EXEMPT-with-reason (K-D): pure-UI / transient / session state. Shrink-only. */
export const EXEMPT_OPERATIONS = Object.freeze({
  dismissPipelineReveal: { slice: 'settlementSlice', reason: 'reveal-overlay flag; session-transient' },
  setActivePricingMoment: { slice: 'settlementSlice', reason: 'pricing-moment card content; transient view state' },
  clearActivePricingMoment: { slice: 'settlementSlice', reason: 'clears pricing-moment card; transient view state' },
  bumpLifetimeNarrate: { slice: 'settlementSlice', reason: 'in-memory audience-promotion counter; not persisted' },
  clearLastRegenerationDelta: { slice: 'settlementSlice', reason: 'dismisses regen-delta summary card; transient view surface' },
  setEditMode: { slice: 'settlementSlice', reason: 'edit-mode UI toggle; session-transient' },
  toggleEditMode: { slice: 'settlementSlice', reason: 'edit-mode UI toggle; session-transient' },
  previewEvent: { slice: 'settlementSlice', reason: 'computes transient pendingPreview; no settlement/eventLog commit' },
  dismissPendingSuccession: { slice: 'settlementSlice', reason: 'dismisses transient successor prompt' },
  dismissPreview: { slice: 'settlementSlice', reason: 'clears transient preview panel' },
  previewEventBatch: { slice: 'settlementSlice', reason: 'computes transient batch preview; no commit' },
  dismissBatchPreview: { slice: 'settlementSlice', reason: 'clears transient batch preview' },
  clearCampaignSyncError: { slice: 'campaignSlice', reason: 'nulls a transient sync-error banner string; no persist' },
  cancelAiGeneration: { slice: 'aiSlice', reason: 'in-flight request/loading flags only; never touches narrative data' },
  clearAiRefundNotice: { slice: 'aiSlice', reason: 'dismisses a transient support-notice card' },
  clearAiViolations: { slice: 'aiSlice', reason: 'dismisses the verifier-report banner; resurfaces on next generation' },
  setAiLoading: { slice: 'aiSlice', reason: 'pure loading flag' },
  setAiError: { slice: 'aiSlice', reason: 'pure error-message flag' },
  setAiProgress: { slice: 'aiSlice', reason: 'pure progress-text flag' },
  toggleNarrativeView: { slice: 'aiSlice', reason: 'raw/narrative view toggle; not persisted' },
  setShowNarrative: { slice: 'aiSlice', reason: 'raw/narrative view toggle; not persisted' },
  setAuthLoading: { slice: 'authSlice', reason: 'pure loading flag' },
  setAuthError: { slice: 'authSlice', reason: 'pure error-message flag' },
  authResetPassword: { slice: 'authSlice', reason: 'store footprint is only the transient auth.error flag (send is external)' },
  authUpdatePassword: { slice: 'authSlice', reason: 'store footprint is only the transient auth.error flag (update is external)' },
  authMagicLink: { slice: 'authSlice', reason: 'store footprint is only the transient auth.error flag (session lands via listener)' },
  authOAuth: { slice: 'authSlice', reason: 'store footprint is only auth.loading/error; session lands via SIGNED_IN listener' },
  setMapReady: { slice: 'mapSlice', reason: 'runtime iframe-bridge ready flag; non-persisted' },
  setMapLoading: { slice: 'mapSlice', reason: 'runtime bridge loading flag; non-persisted' },
  setMapError: { slice: 'mapSlice', reason: 'runtime bridge error flag; non-persisted' },
  setMapMode: { slice: 'mapSlice', reason: 'map UI mode switch; not domain data' },
  setTerrainTool: { slice: 'mapSlice', reason: 'active terrain-tool selection; pure UI' },
  setAnnotateTool: { slice: 'mapSlice', reason: 'active annotate-tool selection; pure UI' },
  setSelectedBurgId: { slice: 'mapSlice', reason: 'click selection handle; pure UI' },
  clearSelectedBurgId: { slice: 'mapSlice', reason: 'clears selection; pure UI' },
  setSelectedSettlementId: { slice: 'mapSlice', reason: 'detail-panel selection; pure UI' },
  clearSelectedSettlementId: { slice: 'mapSlice', reason: 'clears selection; pure UI' },
  setHoveredSettlementId: { slice: 'mapSlice', reason: 'hover-peek state; pure UI' },
  clearHoveredSettlementId: { slice: 'mapSlice', reason: 'clears hover peek; pure UI' },
  setSelectedAnnotationId: { slice: 'mapSlice', reason: 'annotation-layer selection; pure UI' },
  setDraggingOver: { slice: 'mapSlice', reason: 'transient drag-over UI flag' },
  setTerrainOption: { slice: 'mapSlice', reason: 'terrain-tool option default; pure UI' },
  setAnnotateOption: { slice: 'mapSlice', reason: 'annotate-tool option default; pure UI' },
  setMapViewport: { slice: 'mapSlice', reason: 'camera pan/zoom; NOT part of saved campaign mapState' },
  toggleLayer: { slice: 'mapSlice', reason: 'layer visibility toggle; NOT part of saved campaign mapState' },
  setLayerFilter: { slice: 'mapSlice', reason: 'layer display filter; NOT part of saved campaign mapState' },
  initOnboarding: { slice: 'onboardingSlice', reason: 'reads persisted flag but writes session-only coaching UI state' },
  advanceOnboarding: { slice: 'onboardingSlice', reason: 'session-only coach-flow step' },
  setOnboardingStep: { slice: 'onboardingSlice', reason: 'session-only coach-flow step' },
  trackTabExplored: { slice: 'onboardingSlice', reason: 'session-only exploration counter' },
  clearOnboardingNudge: { slice: 'onboardingSlice', reason: 'transient post-onboarding nudge toast' },
  setPurchaseModalOpen: { slice: 'creditsSlice', reason: 'UI modal visibility flag' },
  setDossierClaimToast: { slice: 'uiSlice', reason: 'transient toast; excluded from persist partialize' },
  setAuthModalOpen: { slice: 'uiSlice', reason: 'UI modal visibility flag; excluded from persist partialize' },
  setUserPref: { slice: 'uiSlice', reason: 'userPrefs (e.g. tableViewOpen) deliberately excluded from persist; transient overlay flag' },
  setWizardStep: { slice: 'configSlice', reason: 'wizard step; deliberately not persisted' },
  setWizardMode: { slice: 'configSlice', reason: 'wizard mode; deliberately not persisted' },
  setConfigPanelOpen: { slice: 'configSlice', reason: 'config-panel open flag; UI' },
  setInstPanelOpen: { slice: 'configSlice', reason: 'institution-panel open flag; UI' },
  setSvcPanelOpen: { slice: 'configSlice', reason: 'service-panel open flag; UI' },
  setShowAdvanced: { slice: 'configSlice', reason: 'advanced-panel visibility; UI' },
  setRandomSliderMode: { slice: 'configSlice', reason: 'slider-mode UI flag' },
  setCustomSlidersExplicit: { slice: 'configSlice', reason: 'custom-chip intent; session-only UI' },
  setLoadedFromSave: { slice: 'configSlice', reason: 'loaded-from-save indicator; transient' },
  clearLoadedFromSave: { slice: 'configSlice', reason: 'clears loaded-from-save indicator; transient' },
  setAdvanceAutoResolve: { slice: 'campaignWorldPulseSlice', reason: 'auto-resolve UI toggle; not persisted' },
  dismissLivingCatchUp: { slice: 'campaignWorldPulseSlice', reason: 'dismisses the while-you-were-away digest banner; transient' },
  // Entity-link hyperlink focus (master-merge W5): transient dossier-navigation
  // target, deliberately excluded from the persist partialize (uiSlice).
  focusEntity: { slice: 'uiSlice', reason: 'transient dossier hyperlink focus target; excluded from persist partialize' },
  clearFocusedEntity: { slice: 'uiSlice', reason: 'clears the transient dossier hyperlink focus; excluded from persist' },
  // Merge-introduced services-toggle hydration (transient session hydration).
  hydrateServicesToggles: { slice: 'configSlice', reason: 'hydrates transient services toggles from a loaded save; session-only, not re-persisted' },
  // Single-session eviction (§7.3, M-9d): raises the transient sessionEvicted banner
  // flag + a LOCAL sign-out. It NEVER mutates durable/saved state (the LIFECYCLE PIN
  // is the wall) and sessionEvicted is excluded from the persist partialize — the same
  // K-D EXEMPT class (transient session flag) as the standing setAuthModalOpen.
  evictSession: { slice: 'authSlice', reason: 'transient single-session eviction banner flag + local sign-out; excluded from persist partialize' },
});

/** The committed exempt ceiling (shrink-only; lower it as actions are adopted). */
// OWNER-SIGNED 2026-07-17 ("i give all remaining signoffs ahead of schedule"): 66 -> 69.
// The +3 are the fold-in's master-lineage ephemeral view-state actions (focusEntity,
// clearFocusedEntity, hydrateServicesToggles) — the same class as the standing 66.
// Shrink-only from here: adopting any exempt action into the operation surface lowers it.
// 69 -> 70 (restoration #16): setAuthModalOpen lifted from App-local useState onto the
// store so the signup/unlock PricingMomentCard can route an anon user to sign-in rather
// than the buy-credits wall. Same K-D EXEMPT class (UI modal visibility flag) as the
// standing setPurchaseModalOpen — a documented ratchet raise, not an omission.
// 70 -> 71 (MONEY WAVE M-9d): evictSession — the single-session eviction banner flag +
// local sign-out (§7.3). Authorized by the wave's LAW 6 ("+ EXEMPT_CEILING bump if
// tripped"); same transient-session-flag K-D class as setAuthModalOpen. A documented,
// spec-sanctioned ratchet raise.
export const EXEMPT_CEILING = 71;

/** Action names carrying an opType (the registered operation surface). */
export function registeredActionNames() { return Object.keys(OPERATIONS); }

/** Action names exempt-with-reason from the operation surface. */
export function exemptActionNames() { return Object.keys(EXEMPT_OPERATIONS); }

/** The OperationSpec for an action name, or null if it is exempt/unknown. */
export function operationFor(actionName) { return OPERATIONS[actionName] || null; }
