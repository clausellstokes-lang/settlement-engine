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
 * @property {string} label         authored, human-readable name (spaced; the public
 *                                  Compendium + the Surveyor render THIS, never the
 *                                  raw camelCase opType — authored once, read everywhere)
 * @property {string} description   1-2 sentence plain description of what the op does
 * @property {'canon'|'macro'|'mechanical'} klass   its §2 class
 * @property {string} slice         the slice module that defines it
 * @property {'save'|'campaign'|'global'} targetScope  what the op addresses
 * @property {string|null} receiptRef  the EXISTING receipt source it produces, or null
 * @property {string|null} undoToken   the EXISTING undo action, or null
 */

/** The registered operation surface — every mutating action that is a real verb. */
export const OPERATIONS = Object.freeze({
  // ── K-A CANON (5) — ActionResult-enveloped; adapt via operationFromActionResult ──
  applyEvent: { opType:'applyEvent', label:"Apply an event", description:"Applies a chosen event to the active save, writing the change into canon and recording it in the event log. It can be undone with Undo last event.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry', undoToken:'undoLastEvent' },
  undoLastEvent: { opType:'undoLastEvent', label:"Undo last event", description:"Reverses the most recent applied event on the active save, rolling canon back to the state before it.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  recordSnapshot: { opType:'recordSnapshot', label:"Record a snapshot", description:"Saves a full point-in-time snapshot of the current settlement into its version history, so the state can be returned to later.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'versionHistory-snapshot', undoToken:'revertToSnapshot' },
  revertToSnapshot: { opType:'revertToSnapshot', label:"Revert to a snapshot", description:"Restores the settlement to a previously recorded snapshot from its version history, discarding changes made since.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  destroySavedSettlement: { opType:'destroySavedSettlement', label:"Destroy a saved settlement", description:"Marks a saved settlement as destroyed, recording a destroy entry in canon. This is a one-way canon act.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry(DESTROY_SETTLEMENT)', undoToken:null },
  // ── K-C MACRO (40) — orchestrators; existing receipts become receiptRef ──
  generateSettlement: { opType:'generateSettlement', label:"Generate a settlement", description:"Runs the full generation pipeline to build a new settlement from the current configuration and seed, and records it in the pipeline history.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'pipelineHistory', undoToken:null },
  regenSection: { opType:'regenSection', label:"Regenerate a section", description:"Rebuilds one section of the settlement (for example its power structure or economy) from the seed, recording the change as a regeneration delta.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'regenerationDelta', undoToken:null },
  canonize: { opType:'canonize', label:"Canonize the settlement", description:"Locks the current settlement as canon so later regeneration will not overwrite it. It can be reversed with Uncanonize the settlement.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'uncanonize' },
  uncanonize: { opType:'uncanonize', label:"Uncanonize the settlement", description:"Removes the canon lock from the settlement, allowing it to be regenerated again.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'canonize' },
  applyEventBatch: { opType:'applyEventBatch', label:"Apply a batch of events", description:"Applies several events to the active save in one pass, recording each in the event log. The last event can be undone.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry(per-event)', undoToken:'undoLastEvent' },
  canonizeSavedSettlement: { opType:'canonizeSavedSettlement', label:"Canonize a saved settlement", description:"Marks a specific saved settlement as canon in the saved-settlements list.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  commitPendingEdits: { opType:'commitPendingEdits', label:"Commit pending edits", description:"Writes the settlement's queued edits into canon as a committed change and records a version-history snapshot.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'versionHistory-snapshot', undoToken:'revertToSnapshot' },
  refreshPendingEdits: { opType:'refreshPendingEdits', label:"Review pending edits again", description:"Revalidates retained pending edits against the active save and current world without applying them.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  importGalleryMapWithCampaign: { opType:'importGalleryMapWithCampaign', label:"Import a gallery map with its campaign", description:"Imports a shared gallery map together with a new campaign built around it, recording a gallery-imported entry.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'GALLERY_IMPORTED', undoToken:null },
  instantWorld: { opType:'instantWorld', label:"Build an instant world", description:"Creates a campaign and its canon members in one step, standing up a ready-to-play region without the step-by-step wizard.", klass:'macro', slice:'instantWorldSlice', targetScope:'campaign', receiptRef:'campaign+canon-members', undoToken:null },
  importGallerySettlement: { opType:'importGallerySettlement', label:"Import a gallery settlement", description:"Imports a settlement shared in the gallery into a campaign as a new save, recording the gallery import.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'gallery-import-id', undoToken:null },
  rebuildCampaignRegionalGraph: { opType:'rebuildCampaignRegionalGraph', label:"Rebuild the regional graph", description:"Recomputes the campaign's regional relationship graph from its current settlements and links.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'regionalGraph', undoToken:null },
  injectCampaignStressor: { opType:'injectCampaignStressor', label:"Inject a regional stressor", description:"Adds a normalized stressor, such as a famine or a raid, into the campaign's region to be resolved later. The change can be undone.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'normalized-stressor', undoToken:'undoCampaignStressorBridge' },
  resolveCampaignStressor: { opType:'resolveCampaignStressor', label:"Resolve a regional stressor", description:"Resolves an active regional stressor, producing residual proposals for its aftermath. The change can be undone.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'residual-proposals', undoToken:'undoCampaignStressorBridge' },
  undoCampaignStressorBridge: { opType:'undoCampaignStressorBridge', label:"Undo a stressor change", description:"Reverses the most recent regional stressor injection or resolution on the campaign.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  advanceCampaignRegionalImpacts: { opType:'advanceCampaignRegionalImpacts', label:"Advance regional impacts", description:"Steps the campaign's queued regional impacts forward, updating the regional graph as their effects land.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'regionalGraph', undoToken:null },
  applyQueuedRegionalImpact: { opType:'applyQueuedRegionalImpact', label:"Apply a queued regional impact", description:"Applies one queued regional impact to its target settlement and records the result.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'impact-result', undoToken:null },
  resolveRegionalImpact: { opType:'resolveRegionalImpact', label:"Resolve a regional impact", description:"Marks a regional impact as resolved and records its outcome.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'impact-result', undoToken:null },
  requestNarrative: { opType:'requestNarrative', label:"Request narrative refinement", description:"Sends the settlement for AI narrative refinement and records the result to the chronicle. It can be reverted to the raw generated text.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED+chronicle', undoToken:'revertCurrentToRaw' },
  requestDailyLife: { opType:'requestDailyLife', label:"Request a daily-life account", description:"Requests an AI daily-life account for the settlement. It can be reverted to the raw generated text.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED', undoToken:'revertCurrentToRaw' },
  requestProgression: { opType:'requestProgression', label:"Request a progression account", description:"Requests an AI account of how the settlement has progressed and records it to the chronicle. It can be reverted to the raw text.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED+chronicle', undoToken:'revertCurrentToRaw' },
  applyCosmeticRename: { opType:'applyCosmeticRename', label:"Apply a cosmetic rename", description:"Applies a purely cosmetic rename returned by narrative refinement, without changing any underlying canon.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null },
  revertCurrentToRaw: { opType:'revertCurrentToRaw', label:"Revert to the raw text", description:"Discards the AI-refined narrative for the current settlement and restores the raw generated text, recording a chronicle entry.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'chronicle-entry', undoToken:null },
  applyCustomContentCommand: { opType:'applyCustomContentCommand', label:"Apply a custom-content command", description:"Executes one reviewed custom-content mutation through the durable command boundary, preserving immutable revisions and returning a persistence receipt.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'application-command-receipt', undoToken:null },
  applyReviewedSupplyChainCommand: { opType:'applyReviewedSupplyChainCommand', label:"Apply a reviewed supply-chain command", description:"Confirms, revises, restores, or removes one derived supply-chain review through its dedicated immutable command boundary.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'reviewed-supply-chain-receipt', undoToken:null },
  importCustomContentArchive: { opType:'importCustomContentArchive', label:"Import a custom-content archive", description:"Atomically imports a complete versioned custom-content graph, then refreshes its active, archived, and environment projections after persistence is confirmed.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'custom-content-archive-receipt', undoToken:null },
  loadCustomContentFromCloud: { opType:'loadCustomContentFromCloud', label:"Load custom content from the cloud", description:"Loads the account's saved custom content into the store from the cloud.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  migrateLocalCustomContentToCloud: { opType:'migrateLocalCustomContentToCloud', label:"Migrate local custom content to the cloud", description:"Atomically transfers the anonymous and signed-in browser ledgers into the account's cloud graph, clearing local authorities only after a confirmed receipt.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'custom-content-archive-receipt', undoToken:null },
  importAccountData: { opType:'importAccountData', label:"Import account data", description:"Imports a full account export of campaigns, saves, and custom content into the store, recording a gallery-imported entry.", klass:'macro', slice:'accountImportSlice', targetScope:'global', receiptRef:'GALLERY_IMPORTED', undoToken:null },
  importNeighbour: { opType:'importNeighbour', label:"Import a neighbour", description:"Imports another settlement as a neighbour into the neighbour network.", klass:'macro', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  handleImportDirect: { opType:'handleImportDirect', label:"Import a neighbour directly", description:"Imports a neighbour settlement directly from a supplied payload into the neighbour network.", klass:'macro', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  canonizeCampaignWorld: { opType:'canonizeCampaignWorld', label:"Canonize the campaign world", description:"Commits the campaign's living-world state as canon, recording a world-canonized entry. It can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'world_canonized', undoToken:'undoLastPulse' },
  canonizeCampaignWorldSpatial: { opType:'canonizeCampaignWorldSpatial', label:"Canonize the spatial world", description:"Commits the campaign's spatial map world state as canon and records a spatial digest.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'spatialDigest', undoToken:null },
  updateCampaignSimulationRules: { opType:'updateCampaignSimulationRules', label:"Update the simulation rules", description:"Changes which living-world systems are enabled for the campaign and records the change in the ruleset log.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'rulesetLog', undoToken:null },
  advanceCampaignWorld: { opType:'advanceCampaignWorld', label:"Advance the world", description:"Runs the world pulse forward, advancing the campaign's region by the chosen span and recording a pulse record. It can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  catchUpCampaignWorld: { opType:'catchUpCampaignWorld', label:"Catch the world up", description:"Advances the campaign's world through any elapsed time it had fallen behind, without a manual pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  applyCampaignContentBindingMigration: { opType:'applyCampaignContentBindingMigration', label:"Apply a campaign content migration", description:"Applies one reviewed immutable content-binding migration or rollback through compare-and-swap persistence, preserving the campaign's prior binding in history.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'campaign-content-binding-receipt', undoToken:null },
  resolveIntervalMajors: { opType:'resolveIntervalMajors', label:"Resolve interval majors", description:"Resolves the major events queued for a world-pulse interval and records them in the pulse record. It can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  applyWorldPulseProposal: { opType:'applyWorldPulseProposal', label:"Apply a world-pulse proposal", description:"Applies a proposed world-pulse change to campaign canon and records it in the pulse record. It can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  recordPartyImpact: { opType:'recordPartyImpact', label:"Record a party impact", description:"Records the party's effect on the region as a world-pulse entry, so player action becomes part of the living world. It can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse' },
  recordCanonRelationshipRipple: { opType:'recordCanonRelationshipRipple', label:"Record a relationship ripple", description:"Records a ripple change to the canon relationships between settlements. It can be reversed.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:'reverseCanonRelationshipRipple' },
  reverseCanonRelationshipRipple: { opType:'reverseCanonRelationshipRipple', label:"Reverse a relationship ripple", description:"Undoes a previously recorded canon relationship ripple.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  dismissWorldPulseProposal: { opType:'dismissWorldPulseProposal', label:"Dismiss a world-pulse proposal", description:"Rejects a pending world-pulse proposal, recording its dismissed status without applying it.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'proposal-status', undoToken:null },
  // W-COMPOSER-2: the realm-verb force-as-proposal mint (cancel = dismissWorldPulseProposal; apply = applyWorldPulseProposal).
  stageRealmVerb: { opType:'stageRealmVerb', label:"Stage a realm action", description:"Mints a realm-level action as a pending world-pulse proposal for review. Applying or dismissing it uses the pulse-proposal verbs.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'realm-proposal', undoToken:null },
  undoLastPulse: { opType:'undoLastPulse', label:"Undo last pulse", description:"Reverses the most recent world pulse on the campaign, rolling the living world back.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  // ── K-B MECHANICAL — simple setters/updaters of durable/domain state ──
  // (No count in this header: the old "(118)" rotted to 124 unnoticed. Census
  //  the live number with `grep -c "klass:'mechanical'"` — never transcribe it.)
  queueEdit: { opType:'queueEdit', label:"Queue an edit", description:"Adds a single pending edit to the settlement, to be committed later. The edit can be reverted on its own.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'revertSingleEdit' },
  revertSingleEdit: { opType:'revertSingleEdit', label:"Revert a single edit", description:"Removes one queued pending edit from the settlement.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  revertPendingEdits: { opType:'revertPendingEdits', label:"Revert all pending edits", description:"Discards every queued pending edit on the settlement without committing them.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setSettlement: { opType:'setSettlement', label:"Set the settlement", description:"Replaces the active settlement in the store with a given settlement.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  clearSettlement: { opType:'clearSettlement', label:"Clear the settlement", description:"Clears the currently loaded settlement from the store.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setSavedSettlements: { opType:'setSavedSettlements', label:"Set the saved settlements", description:"Replaces the full list of saved settlements in the store.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setActiveSaveId: { opType:'setActiveSaveId', label:"Set the active save", description:"Selects which saved settlement is the active one.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  clearSavedSettlements: { opType:'clearSavedSettlements', label:"Clear saved settlements", description:"Removes all saved settlements from the store.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  removeSavedSettlement: { opType:'removeSavedSettlement', label:"Remove a saved settlement", description:"Deletes one settlement from the saved-settlements list.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  updateSavedSettlement: { opType:'updateSavedSettlement', label:"Update a saved settlement", description:"Writes changed fields onto one saved settlement in the list.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  renameNPC: { opType:'renameNPC', label:"Rename an NPC", description:"Renames a named NPC within the settlement and carries the new name through its references.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  renameFaction: { opType:'renameFaction', label:"Rename a faction", description:"Renames a faction within the settlement and carries the new name through its references.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  applyUserEditAction: { opType:'applyUserEditAction', label:"Apply a manual edit", description:"Applies a manual user edit to the settlement. It can be reversed with Revert a manual edit.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'revertUserEditAction' },
  revertUserEditAction: { opType:'revertUserEditAction', label:"Revert a manual edit", description:"Reverses a previously applied manual user edit.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'applyUserEditAction' },
  persistActiveSaveEdit: { opType:'persistActiveSaveEdit', label:"Persist an edit to the active save", description:"Writes an edit to the active save so the change survives a reload.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  markExported: { opType:'markExported', label:"Mark as exported", description:"Flags the settlement as having been exported, for example to a PDF dossier.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setLock: { opType:'setLock', label:"Set a section lock", description:"Locks a section of the settlement so it is preserved when other sections regenerate.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  clearLocks: { opType:'clearLocks', label:"Clear section locks", description:"Removes all section locks from the settlement.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  refreshSystemState: { opType:'refreshSystemState', label:"Refresh the system state", description:"Recomputes the settlement's derived system state from its current data.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  hydrateFromSave: { opType:'hydrateFromSave', label:"Load state from a save", description:"Rebuilds the working settlement state from a saved settlement.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  renameSettlement: { opType:'renameSettlement', label:"Rename the settlement", description:"Changes the settlement's name.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  // SM-3 — cosmetic town-map edit (mapEdits container: nudges / reroll / legend
  // prefs). Mechanical: a durable blob write via the applyEvent persist triple.
  // Cosmetic-always (no canon lock); undo rides the blob's own time-travel (no
  // dedicated map undo action ⇒ undoToken:null).
  applyMapEdit: { opType:'applyMapEdit', label:"Apply a map edit", description:"Writes a cosmetic town-map edit, such as a nudge, a reroll, or a legend preference, into the settlement's saved map edits.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  // DOOR 2 — fog-of-war reveal edit (fogSessions sidecar: per-session district/street/
  // building reveal). Mechanical: a durable blob write via the applyMapEdit persist idiom.
  // Cosmetic-always (no canon lock); undo rides the blob's own time-travel (undoToken:null).
  applyFogEdit: { opType:'applyFogEdit', label:"Apply a fog-of-war edit", description:"Records a fog-of-war reveal of a district, street, or building into the settlement's per-session fog state.", klass:'mechanical', slice:'fogEditSlice', targetScope:'save', receiptRef:null, undoToken:null },
  syncActiveNeighbourFields: { opType:'syncActiveNeighbourFields', label:"Sync neighbour fields", description:"Updates the active settlement's fields that mirror a linked neighbour.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  recordCanonFlavorEntry: { opType:'recordCanonFlavorEntry', label:"Record a flavour entry", description:"Adds a piece of canon flavour text to the settlement's record. It can be undone with Undo last event.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'undoLastEvent' },
  retryOutbox: { opType:'retryOutbox', label:"Retry the sync outbox", description:"Retries any campaign changes that failed to sync to the cloud.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  loadCampaigns: { opType:'loadCampaigns', label:"Load campaigns", description:"Loads the account's campaigns into the store.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearCampaigns: { opType:'clearCampaigns', label:"Clear campaigns", description:"Removes all campaigns from the store.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  invalidateCampaignSession: { opType:'invalidateCampaignSession', label:"Invalidate the campaign session", description:"Advances the campaign session boundary and clears in-flight campaign locks so stale asynchronous work cannot commit after credentials change.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  createCampaign: { opType:'createCampaign', label:"Create a campaign", description:"Creates a new, empty campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  createImportedCampaign: { opType:'createImportedCampaign', label:"Create an imported campaign", description:"Persists one complete remapped campaign envelope and publishes it locally only after the selected authority confirms the insert.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'imported-campaign-persistence-receipt', undoToken:null },
  renameCampaign: { opType:'renameCampaign', label:"Rename a campaign", description:"Changes a campaign's name.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteCampaign: { opType:'deleteCampaign', label:"Delete a campaign", description:"Removes a campaign and its membership from the store.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  toggleCampaignCollapsed: { opType:'toggleCampaignCollapsed', label:"Collapse or expand a campaign", description:"Toggles whether a campaign is shown collapsed in the list.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  addToCampaign: { opType:'addToCampaign', label:"Add a settlement to a campaign", description:"Adds a saved settlement to a campaign's membership.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  removeFromCampaign: { opType:'removeFromCampaign', label:"Remove a settlement from a campaign", description:"Removes a settlement from a campaign's membership.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  withSettlementDeletionLock: { opType:'withSettlementDeletionLock', label:"Guard a settlement deletion", description:"Serializes settlement deletion against campaign advances and membership changes.", klass:'mechanical', slice:'campaignSlice', targetScope:'save', receiptRef:null, undoToken:null },
  executeImportReconciliationDraft: { opType:'executeImportReconciliationDraft', label:"Apply an import reconciliation command", description:"Executes one reviewed settlement create-or-attach draft through the durable application command plane.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:'application-command-receipt', undoToken:null },
  saveCampaignMap: { opType:'saveCampaignMap', label:"Save the campaign map", description:"Stores the campaign's map state.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearCampaignMap: { opType:'clearCampaignMap', label:"Clear the campaign map", description:"Removes the stored map from a campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  updateSavedCampaign: { opType:'updateSavedCampaign', label:"Update a campaign", description:"Writes changed fields onto a saved campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearCampaignWizardNews: { opType:'clearCampaignWizardNews', label:"Clear campaign news", description:"Clears the pending news items shown for a campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  appendCampaignChronicle: { opType:'appendCampaignChronicle', label:"Append to the campaign chronicle", description:"Adds an entry to the campaign's chronicle history.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  markCampaignLettersRead: { opType:'markCampaignLettersRead', label:"Mark campaign letters read", description:"Marks a campaign's pending letters as read.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  // V-17 THE CAMPAIGN IMPORT — commits confirmed typed table-events as source:'table'
  // news history at DM-chosen ticks (the per-event confirmation gate is upstream).
  importTableEvents: { opType:'importTableEvents', label:"Import table events", description:"Commits confirmed tabletop events into a campaign's news history at the chosen ticks.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setActiveCampaign: { opType:'setActiveCampaign', label:"Set the active campaign", description:"Selects which campaign is the active one.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  queueSettlementEvent: { opType:'queueSettlementEvent', label:"Queue a settlement event", description:"Adds an event to a settlement's queue to be applied at a future tick.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  cancelQueuedEvent: { opType:'cancelQueuedEvent', label:"Cancel a queued event", description:"Removes a queued settlement event before it is applied.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  // W-COMPOSER-2 §10: the MUTABLE DOCKET — in-place edit of a queued intention.
  updateQueuedEvent: { opType:'updateQueuedEvent', label:"Update a queued event", description:"Edits a queued settlement event in place before it is applied.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  // Composer V2 §4 — target-first / SuccessorPrompt injection staging. Writes
  // only the transient composerIntent field (registered rather than exempt:
  // the K-D exempt ledger sits at its shrink-only ceiling).
  stageComposerIntent: { opType:'stageComposerIntent', label:"Stage a composer intent", description:"Stages a target-first intent for the event composer, writing only the transient composer-intent field.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null },
  reorderCampaignSettlements: { opType:'reorderCampaignSettlements', label:"Reorder campaign settlements", description:"Changes the display order of settlements within a campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  ensureCampaignRegionalGraph: { opType:'ensureCampaignRegionalGraph', label:"Ensure a regional graph", description:"Creates the campaign's regional graph if it does not exist yet, leaving an existing one unchanged.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setRegionalChannelStatus: { opType:'setRegionalChannelStatus', label:"Set a regional channel status", description:"Sets the status of a channel, such as a trade route or a war front, between two settlements in the region.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setRegionalChannelVisibility: { opType:'setRegionalChannelVisibility', label:"Set a regional channel's visibility", description:"Sets whether a regional channel is shown.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setCampaignRegionalGraph: { opType:'setCampaignRegionalGraph', label:"Set the regional graph", description:"Replaces the campaign's regional graph with a given graph.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  queueCampaignRegionalImpacts: { opType:'queueCampaignRegionalImpacts', label:"Queue regional impacts", description:"Adds regional impacts to the campaign's queue to be applied over time.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setRegionalImpactStatus: { opType:'setRegionalImpactStatus', label:"Set a regional impact's status", description:"Changes the status of a queued regional impact.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setAiSettlement: { opType:'setAiSettlement', label:"Set the AI settlement", description:"Stores an AI-refined version of the settlement. It can be reverted to the raw text.", klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:'revertCurrentToRaw' },
  clearAiSettlement: { opType:'clearAiSettlement', label:"Clear the AI settlement", description:"Removes the stored AI-refined settlement.", klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setAiDailyLife: { opType:'setAiDailyLife', label:"Set the AI daily-life account", description:"Stores an AI daily-life account for the settlement. It can be reverted to the raw text.", klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:'revertCurrentToRaw' },
  hydrateAiFromSave: { opType:'hydrateAiFromSave', label:"Load AI content from a save", description:"Restores stored AI content from a saved settlement.", klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null },
  setAuth: { opType:'setAuth', label:"Set the auth session", description:"Stores the current sign-in session. It can be cleared with Clear the auth session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  clearAuth: { opType:'clearAuth', label:"Clear the auth session", description:"Signs the user out locally by clearing the sign-in session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'setAuth' },
  setDossierEntitlement: { opType:'setDossierEntitlement', label:"Set a dossier entitlement", description:"Grants a dossier entitlement in the store. It can be cleared.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearDossierEntitlements' },
  clearDossierEntitlements: { opType:'clearDossierEntitlements', label:"Clear dossier entitlements", description:"Removes all stored dossier entitlements.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:null },
  refreshDossierEntitlement: { opType:'refreshDossierEntitlement', label:"Refresh a dossier entitlement", description:"Re-reads a dossier entitlement's current state.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:null },
  initAuth: { opType:'initAuth', label:"Initialize sign-in", description:"Sets up the sign-in session on startup from any stored session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  authSignUp: { opType:'authSignUp', label:"Sign up", description:"Creates a new account and stores the resulting session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  authSignIn: { opType:'authSignIn', label:"Sign in", description:"Signs the user in and stores the resulting session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth' },
  listCustomContentRevisions: { opType:'listCustomContentRevisions', label:"Load custom-content revision history", description:"Loads one custom definition's immutable revision history into the inspection cache without changing its active head.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  loadArchivedCustomContent: { opType:'loadArchivedCustomContent', label:"Load archived custom content", description:"Loads archived custom-content heads into their separate inspection projection without restoring them to generation.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  loadCustomContentEnvironments: { opType:'loadCustomContentEnvironments', label:"Load custom-content environments", description:"Loads immutable environment history and the durable active-environment pointer into the store.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null },
  rollbackCustomContentEnvironment: { opType:'rollbackCustomContentEnvironment', label:"Roll back a custom-content environment", description:"Reactivates a reviewed immutable environment revision through the durable command boundary; no environment history is overwritten.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:'application-command-receipt', undoToken:null },
  pinLegacyCampaignContentBindings: { opType:'pinLegacyCampaignContentBindings', label:"Pin legacy campaign content", description:"Captures the correct owner's resolved custom definitions for legacy campaigns so future simulation cannot drift with later library edits.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:'campaign-content-binding', undoToken:null },
  clearCloudCustomContent: { opType:'clearCloudCustomContent', label:"Clear cloud custom content", description:"Clears the account's cloud custom content. It can be reloaded from the cloud.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:'loadCustomContentFromCloud' },
  // V-5 THE CORPUS FACTORY — staging-catalog mutations. None writes canon (canon is the
  // owner's gen:compendium-data fold of APPROVED_CORPUS); these only stage/review candidates.
  stageCorpusCandidates: { opType:'stageCorpusCandidates', label:"Stage corpus candidates", description:"Adds candidate entries to the custom-content corpus staging catalog for review. A candidate can be removed.", klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:'removeCorpusCandidate' },
  reviewCorpusCandidate: { opType:'reviewCorpusCandidate', label:"Review a corpus candidate", description:"Records a review decision on a staged corpus candidate.", klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:null },
  removeCorpusCandidate: { opType:'removeCorpusCandidate', label:"Remove a corpus candidate", description:"Removes a candidate from the corpus staging catalog.", klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:null },
  addPlacement: { opType:'addPlacement', label:"Add a map placement", description:"Places a marker or feature on the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  removePlacementLocal: { opType:'removePlacementLocal', label:"Remove a map placement", description:"Removes a placement from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updatePlacement: { opType:'updatePlacement', label:"Update a map placement", description:"Changes a placement on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  replaceAllPlacements: { opType:'replaceAllPlacements', label:"Replace all map placements", description:"Replaces every placement on the campaign map at once.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearAllPlacementsLocal: { opType:'clearAllPlacementsLocal', label:"Clear all map placements", description:"Removes every placement from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  addLabel: { opType:'addLabel', label:"Add a map label", description:"Adds a text label to the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updateLabel: { opType:'updateLabel', label:"Update a map label", description:"Changes a label on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteLabel: { opType:'deleteLabel', label:"Delete a map label", description:"Removes a label from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  addMarker: { opType:'addMarker', label:"Add a map marker", description:"Adds a marker to the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updateMarker: { opType:'updateMarker', label:"Update a map marker", description:"Changes a marker on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteMarker: { opType:'deleteMarker', label:"Delete a map marker", description:"Removes a marker from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  addForest: { opType:'addForest', label:"Add a map forest", description:"Adds a forest area to the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  updateForest: { opType:'updateForest', label:"Update a map forest", description:"Changes a forest area on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  deleteForest: { opType:'deleteForest', label:"Delete a map forest", description:"Removes a forest area from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  setMapSnapshot: { opType:'setMapSnapshot', label:"Set the map snapshot", description:"Stores a snapshot of the campaign map's current state.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  setMapBackdrop: { opType:'setMapBackdrop', label:"Set the map backdrop", description:"Sets the backdrop image for the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  clearMapBackdrop: { opType:'clearMapBackdrop', label:"Clear the map backdrop", description:"Removes the campaign map's backdrop image.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  bumpGeometryVersion: { opType:'bumpGeometryVersion', label:"Bump the map geometry version", description:"Advances the map geometry version so dependent layers know to recompute.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  replaceMapState: { opType:'replaceMapState', label:"Replace the map state", description:"Replaces the campaign's entire map state with a given state.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  resetMapState: { opType:'resetMapState', label:"Reset the map state", description:"Clears the campaign map back to an empty state.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null },
  pushMapUndo: { opType:'pushMapUndo', label:"Push a map undo step", description:"Records the current map state as an undo step. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  mapUndo: { opType:'mapUndo', label:"Undo a map change", description:"Reverses the most recent campaign-map change. It can be redone.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapRedo' },
  mapRedo: { opType:'mapRedo', label:"Redo a map change", description:"Re-applies a campaign-map change that was undone. It can be undone again.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo' },
  clearNeighbour: { opType:'clearNeighbour', label:"Clear a neighbour", description:"Removes a settlement's neighbour link data.", klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setNeighbourRelType: { opType:'setNeighbourRelType', label:"Set a neighbour relationship type", description:"Sets the relationship type, such as ally or rival, for a neighbour link.", klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  addNeighbourLink: { opType:'addNeighbourLink', label:"Add a neighbour link", description:"Creates a link between two settlements in the neighbour network.", klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  removeNeighbourLink: { opType:'removeNeighbourLink', label:"Remove a neighbour link", description:"Removes a link between two settlements from the neighbour network.", klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setNeighbourNetwork: { opType:'setNeighbourNetwork', label:"Set the neighbour network", description:"Replaces the entire neighbour network with a given network.", klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null },
  completeOnboarding: { opType:'completeOnboarding', label:"Complete onboarding", description:"Marks the first-run onboarding as finished. It can be reset.", klass:'mechanical', slice:'onboardingSlice', targetScope:'global', receiptRef:null, undoToken:'resetOnboarding' },
  markFeatureUsed: { opType:'markFeatureUsed', label:"Mark a feature as used", description:"Records that the user has used a given feature, which retires its coaching hints. It can be reset.", klass:'mechanical', slice:'onboardingSlice', targetScope:'global', receiptRef:null, undoToken:'resetOnboarding' },
  resetOnboarding: { opType:'resetOnboarding', label:"Reset onboarding", description:"Clears the onboarding progress so the coaching flow runs again.", klass:'mechanical', slice:'onboardingSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setCreditBalance: { opType:'setCreditBalance', label:"Set the credit balance", description:"Sets the account's narrative-credit balance to a given amount.", klass:'mechanical', slice:'creditsSlice', targetScope:'global', receiptRef:null, undoToken:null },
  addCredits: { opType:'addCredits', label:"Add credits", description:"Increases the account's narrative-credit balance.", klass:'mechanical', slice:'creditsSlice', targetScope:'global', receiptRef:null, undoToken:null },
  spendCredits: { opType:'spendCredits', label:"Spend credits", description:"Decreases the account's narrative-credit balance when a paid action is taken.", klass:'mechanical', slice:'creditsSlice', targetScope:'global', receiptRef:null, undoToken:null },
  updateConfig: { opType:'updateConfig', label:"Update the generation settings", description:"Changes the settlement generation settings, such as size, sliders, and options.", klass:'mechanical', slice:'configSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetConfig: { opType:'resetConfig', label:"Reset the generation settings", description:"Restores the generation settings to their defaults.", klass:'mechanical', slice:'configSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setSettlementType: { opType:'setSettlementType', label:"Set the settlement type", description:"Sets the settlement type, such as village or city, in the generation settings.", klass:'mechanical', slice:'configSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleInstitution: { opType:'toggleInstitution', label:"Toggle an institution", description:"Turns one institution on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setInstitutionToggles: { opType:'setInstitutionToggles', label:"Set institution choices", description:"Replaces the full set of institution on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  mergeInstitutionToggles: { opType:'mergeInstitutionToggles', label:"Merge institution choices", description:"Merges a set of institution on-or-off choices into the current ones.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleCategory: { opType:'toggleCategory', label:"Toggle a category", description:"Turns a whole institution category on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setCategoryToggles: { opType:'setCategoryToggles', label:"Set category choices", description:"Replaces the full set of category on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleGood: { opType:'toggleGood', label:"Toggle a trade good", description:"Turns one trade good on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setGoodsToggles: { opType:'setGoodsToggles', label:"Set trade-good choices", description:"Replaces the full set of trade-good on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  toggleService: { opType:'toggleService', label:"Toggle a service", description:"Turns one service on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  setServiceToggles: { opType:'setServiceToggles', label:"Set service choices", description:"Replaces the full set of service on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetToggles: { opType:'resetToggles', label:"Reset all toggles", description:"Restores every institution, category, goods, and service choice to its default.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetGoodsServices: { opType:'resetGoodsServices', label:"Reset goods and services", description:"Restores the trade-good and service choices to their defaults.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  resetAllToggles: { opType:'resetAllToggles', label:"Reset every toggle", description:"Restores all generation choices to their defaults.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  bulkSetInstitutions: { opType:'bulkSetInstitutions', label:"Bulk-set institutions", description:"Sets many institution choices at once.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  bulkSetServices: { opType:'bulkSetServices', label:"Bulk-set services", description:"Sets many service choices at once.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
  bulkSetGoods: { opType:'bulkSetGoods', label:"Bulk-set trade goods", description:"Sets many trade-good choices at once.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null },
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
  setTimelapseTick: { slice: 'mapSlice', reason: 'V-3 timelapse scrub position; transient UI, not persisted' },
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
// 71 -> 72 (VISION V-3 THE TIMELAPSE): setTimelapseTick — the shared scrub position
// (null = live). Pure transient map UI, not persisted, not domain data — the SAME
// K-D EXEMPT class as its mapSlice peers setSelectedSettlementId / setHoveredSettlementId /
// toggleLayer / setLayerFilter (all exempt above). A documented ratchet raise for a
// genuinely-new UI setter, not an operation-surface omission.
export const EXEMPT_CEILING = 72;

/** Action names carrying an opType (the registered operation surface). */
export function registeredActionNames() { return Object.keys(OPERATIONS); }

/** Action names exempt-with-reason from the operation surface. */
export function exemptActionNames() { return Object.keys(EXEMPT_OPERATIONS); }

/** The OperationSpec for an action name, or null if it is exempt/unknown. */
export function operationFor(actionName) { return OPERATIONS[actionName] || null; }

/**
 * The authored, human-readable label for an action name. Falls back to the raw
 * opType for an unregistered verb (an AI-proposed op may not be in the registry).
 * The single accessor every display surface reads, so a legible name is authored
 * once here and consumed everywhere (Compendium via gen:compendium-data, Surveyor
 * via this function) — never a per-surface camelCase splitter.
 * @param {string} actionName
 * @returns {string}
 */
export function operationLabel(actionName) {
  return OPERATIONS[actionName]?.label || String(actionName || '');
}
