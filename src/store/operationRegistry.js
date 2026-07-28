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
 * @property {string} undoState        R-0 (atlas VI.3 #62): what undoToken:null MEANS.
 *   The old field conflated three meanings (honest-irreversible / recovery-exists-
 *   elsewhere / not-built); this field states which, per op:
 *     'action'            — armed: undoToken names the registered inverse and the
 *                           inverse restores the full mutated state (non-null
 *                           undoToken ⇔ undoState ∈ {'action','action-partial'};
 *                           the walker enforces both directions).
 *     'action-partial'    — armed BUT PARTIAL: undoToken names the registered
 *                           inverse, and the inverse restores the primary state
 *                           only — some recorded state does not survive the round
 *                           trip (canonize/uncanonize: phase + canonizedAt come
 *                           back; the event log does not). The atlas's mapUndo
 *                           lesson again: a token row must say WHEN the inverse is
 *                           not a full restore, and may never claim 'none'.
 *     'irreversible'      — one-way BY DESIGN (canon acts, committed history/records,
 *                           wholesale boundary setters whose contract is replacement).
 *     'external:<ref>'    — real recovery exists through OTHER machinery; <ref> names
 *                           it (an action name, or a mechanism token such as
 *                           blob-time-travel / revision-history / inverse-call =
 *                           "re-call this or its pair with the prior value").
 *     'partial:<ref>'     — recovery exists elsewhere but is PARTIAL in scope (the
 *                           atlas's mapUndo lesson: never trade one false promise
 *                           for another).
 *     'none'              — undo would make sense but is NOT BUILT (a gap, not a law).
 *     'not-applicable'    — nothing to undo: idempotent loads/re-reads/ensures, pure
 *                           selection pointers, persistence plumbing, and the recovery
 *                           verbs themselves.
 *     'undetermined'      — explicitly unclassified rather than guessed.
 */

/** The registered operation surface — every mutating action that is a real verb. */
export const OPERATIONS = Object.freeze({
  // ── K-A CANON (5) — ActionResult-enveloped; adapt via operationFromActionResult ──
  applyEvent: { opType:'applyEvent', label:"Apply an event", description:"Applies a chosen event to the active save, writing the change into canon and recording it in the event log. It can be undone with Undo last event.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry', undoToken:'undoLastEvent', undoState:'action' },
  undoLastEvent: { opType:'undoLastEvent', label:"Undo last event", description:"Reverses the most recent applied event on the active save, rolling canon back to the state before it.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  // R-0 exposure honesty, CLOSED by the queue-#18 BUILD (owner-signed): recordSnapshot
  // WAS internal-only — its two callers were the commitPendingEdits batch snapshot and
  // revertToSnapshot's auto 'pre-revert' capture — and the R-0 census recorded it as the
  // standout op-but-no-exposure row. It now has a user-facing lever: the Take-a-snapshot
  // control on VersionsTab (src/components/settlement/VersionsTab.jsx), which calls it
  // with kind:'manual' against the active save. The two internal callers are unchanged.
  recordSnapshot: { opType:'recordSnapshot', label:"Record a snapshot", description:"Saves a full point-in-time snapshot of the current settlement into its version history, so the state can be returned to later.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'versionHistory-snapshot', undoToken:'revertToSnapshot', undoState:'action' },
  revertToSnapshot: { opType:'revertToSnapshot', label:"Revert to a snapshot", description:"Restores the settlement to a previously recorded snapshot from its version history, discarding changes made since.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:auto-pre-revert-snapshot' },
  destroySavedSettlement: { opType:'destroySavedSettlement', label:"Destroy a saved settlement", description:"Marks a saved settlement as destroyed, recording a destroy entry in canon. This is a one-way canon act; it requires the settlement's exact name as confirmName to proceed.", klass:'canon', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry(DESTROY_SETTLEMENT)', undoToken:null, undoState:'irreversible' },
  // ── K-C MACRO (40) — orchestrators; existing receipts become receiptRef ──
  generateSettlement: { opType:'generateSettlement', label:"Generate a settlement", description:"Runs the full generation pipeline to build a new settlement from the current configuration and seed, and records it in the pipeline history.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'pipelineHistory', undoToken:null, undoState:'irreversible' },
  regenSection: { opType:'regenSection', label:"Regenerate a section", description:"Rebuilds one section of the settlement (for example its power structure or economy) from the seed, recording the change as a regeneration delta.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'regenerationDelta', undoToken:null, undoState:'none' },
  // R-0 undo-truth: the canonize/uncanonize pair is PARTIAL, not 'action' (the
  // atlas predicted exactly this trap). Each direction resets eventLog to [] and
  // the inverse resets it AGAIN — phase and canonizedAt round-trip, the event-log
  // timeline is destroyed in both directions and no verb can restore it.
  canonize: { opType:'canonize', label:"Canonize the settlement", description:"Locks the current settlement as canon so later regeneration will not overwrite it. Uncanonize the settlement reverses the lock; an event log it cleared is restored in-session for the same world, gone across reload.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'uncanonize', undoState:'action-partial' },
  uncanonize: { opType:'uncanonize', label:"Uncanonize the settlement", description:"Removes the canon lock from the settlement, allowing it to be regenerated again. The canon event log is cleared; canonizing again restores it in-session for the same world, gone across reload.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'canonize', undoState:'action-partial' },
  applyEventBatch: { opType:'applyEventBatch', label:"Apply a batch of events", description:"Applies several events to the active save in one pass, recording each in the event log. The last event can be undone.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'eventLog-entry(per-event)', undoToken:'undoLastEvent', undoState:'action' },
  // R-0 undo-truth: NO inverse exists. uncanonize() takes no id and mutates only
  // the LIVE slice (settlementSlice.js), so it cannot reach a saved-by-id
  // canonization (canonizeSavedSettlementImpl, settlementRenameHelpers.js) unless
  // that save happens to be the active one — the old 'external:uncanonize' was
  // false. 'none' = an uncanonize-by-id verb could be built but is not (a gap,
  // not a law); it too would be partial, since the event log is wiped here.
  canonizeSavedSettlement: { opType:'canonizeSavedSettlement', label:"Canonize a saved settlement", description:"Marks a specific saved settlement as canon in the saved-settlements list.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  commitPendingEdits: { opType:'commitPendingEdits', label:"Commit pending edits", description:"Writes the settlement's queued edits into canon as a committed change and records a version-history snapshot.", klass:'macro', slice:'settlementSlice', targetScope:'save', receiptRef:'versionHistory-snapshot', undoToken:'revertToSnapshot', undoState:'action' },
  refreshPendingEdits: { opType:'refreshPendingEdits', label:"Review pending edits again", description:"Revalidates retained pending edits against the active save and current world without applying them.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  importGalleryMapWithCampaign: { opType:'importGalleryMapWithCampaign', label:"Import a gallery map with its campaign", description:"Imports a shared gallery map together with a new campaign built around it, recording a gallery-imported entry.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'GALLERY_IMPORTED', undoToken:null, undoState:'external:deleteCampaign' },
  instantWorld: { opType:'instantWorld', label:"Build an instant world", description:"Creates a campaign and its canon members in one step, standing up a ready-to-play region without the step-by-step wizard.", klass:'macro', slice:'instantWorldSlice', targetScope:'campaign', receiptRef:'campaign+canon-members', undoToken:null, undoState:'external:deleteCampaign' },
  importGallerySettlement: { opType:'importGallerySettlement', label:"Import a gallery settlement", description:"Imports a settlement shared in the gallery into a campaign as a new save, recording the gallery import.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'gallery-import-id', undoToken:null, undoState:'external:removeSavedSettlement' },
  rebuildCampaignRegionalGraph: { opType:'rebuildCampaignRegionalGraph', label:"Rebuild the regional graph", description:"Recomputes the campaign's regional relationship graph from its current settlements and links.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'regionalGraph', undoToken:null, undoState:'irreversible' },
  injectCampaignStressor: { opType:'injectCampaignStressor', label:"Inject a regional stressor", description:"Adds a normalized stressor, such as a famine or a raid, into the campaign's region to be resolved later. The change can be undone.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'normalized-stressor', undoToken:'undoCampaignStressorBridge', undoState:'action' },
  resolveCampaignStressor: { opType:'resolveCampaignStressor', label:"Resolve a regional stressor", description:"Resolves an active regional stressor, producing residual proposals for its aftermath. The change can be undone.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'residual-proposals', undoToken:'undoCampaignStressorBridge', undoState:'action' },
  undoCampaignStressorBridge: { opType:'undoCampaignStressorBridge', label:"Undo a stressor change", description:"Reverses the most recent regional stressor injection or resolution on the campaign.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  advanceCampaignRegionalImpacts: { opType:'advanceCampaignRegionalImpacts', label:"Advance regional impacts", description:"Steps the campaign's queued regional impacts forward, updating the regional graph as their effects land.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'regionalGraph', undoToken:null, undoState:'none' },
  applyQueuedRegionalImpact: { opType:'applyQueuedRegionalImpact', label:"Apply a queued regional impact", description:"Applies one queued regional impact to its target settlement and records the result.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'impact-result', undoToken:null, undoState:'none' },
  resolveRegionalImpact: { opType:'resolveRegionalImpact', label:"Resolve a regional impact", description:"Marks a regional impact as resolved and records its outcome.", klass:'macro', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:'impact-result', undoToken:null, undoState:'none' },
  requestNarrative: { opType:'requestNarrative', label:"Request narrative refinement", description:"Sends the settlement for AI narrative refinement and records the result to the chronicle. It can be reverted to the raw generated text.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED+chronicle', undoToken:'revertCurrentToRaw', undoState:'action' },
  requestDailyLife: { opType:'requestDailyLife', label:"Request a daily-life account", description:"Requests an AI daily-life account for the settlement. It can be reverted to the raw generated text.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED', undoToken:'revertCurrentToRaw', undoState:'action' },
  requestProgression: { opType:'requestProgression', label:"Request a progression account", description:"Requests an AI account of how the settlement has progressed and records it to the chronicle. It can be reverted to the raw text.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'AI_GENERATION_COMPLETED+chronicle', undoToken:'revertCurrentToRaw', undoState:'action' },
  applyCosmeticRename: { opType:'applyCosmeticRename', label:"Apply a cosmetic rename", description:"Applies a purely cosmetic rename returned by narrative refinement, without changing any underlying canon.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  revertCurrentToRaw: { opType:'revertCurrentToRaw', label:"Revert to the raw text", description:"Discards the AI-refined narrative for the current settlement and restores the raw generated text, recording a chronicle entry.", klass:'macro', slice:'aiSlice', targetScope:'save', receiptRef:'chronicle-entry', undoToken:null, undoState:'not-applicable' },
  applyCustomContentCommand: { opType:'applyCustomContentCommand', label:"Apply a custom-content command", description:"Executes one reviewed custom-content mutation through the durable command boundary, preserving immutable revisions and returning a persistence receipt.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'application-command-receipt', undoToken:null, undoState:'external:revision-history' },
  applyReviewedSupplyChainCommand: { opType:'applyReviewedSupplyChainCommand', label:"Apply a reviewed supply-chain command", description:"Confirms, revises, restores, or removes one derived supply-chain review through its dedicated immutable command boundary.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'reviewed-supply-chain-receipt', undoToken:null, undoState:'external:restore-command' },
  importCustomContentArchive: { opType:'importCustomContentArchive', label:"Import a custom-content archive", description:"Atomically imports a complete versioned custom-content graph, then refreshes its active, archived, and environment projections after persistence is confirmed.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'custom-content-archive-receipt', undoToken:null, undoState:'external:revision-history' },
  loadCustomContentFromCloud: { opType:'loadCustomContentFromCloud', label:"Load custom content from the cloud", description:"Loads the account's saved custom content into the store from the cloud.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  migrateLocalCustomContentToCloud: { opType:'migrateLocalCustomContentToCloud', label:"Migrate local custom content to the cloud", description:"Atomically transfers the anonymous and signed-in browser ledgers into the account's cloud graph, clearing local authorities only after a confirmed receipt.", klass:'macro', slice:'customContentSlice', targetScope:'global', receiptRef:'custom-content-archive-receipt', undoToken:null, undoState:'irreversible' },
  importAccountData: { opType:'importAccountData', label:"Import account data", description:"Imports a full account export of campaigns, saves, and custom content into the store, recording a gallery-imported entry.", klass:'macro', slice:'accountImportSlice', targetScope:'global', receiptRef:'GALLERY_IMPORTED', undoToken:null, undoState:'none' },
  // R-0 undo-truth (queue #5): DE-ADVERTISED. runCanonizeCampaignWorld pushes NO
  // pulseUndoStack snapshot (the only push site is the advance body,
  // campaignAdvanceSession.js), so the old undoToken:'undoLastPulse' promised an
  // undo that existed only if an unrelated advance snapshot happened to be on the
  // session stack. Arming was REJECTED on semantics, not cost: a canonize is not a
  // pulse — popping a "canonize" snapshot through the "Undo last advance"
  // affordance would mislabel the act, and reverting canonizedAt un-canonizes the
  // world (the advance gate). Honest arming needs a dedicated un-canonize verb —
  // an owner call, not a snapshot push.
  canonizeCampaignWorld: { opType:'canonizeCampaignWorld', label:"Canonize the campaign world", description:"Commits the campaign's living-world state as canon, recording a world-canonized entry.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'world_canonized', undoToken:null, undoState:'none' },
  canonizeCampaignWorldSpatial: { opType:'canonizeCampaignWorldSpatial', label:"Canonize the spatial world", description:"Commits the campaign's spatial map world state as canon and records a spatial digest.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'spatialDigest', undoToken:null, undoState:'irreversible' },
  updateCampaignSimulationRules: { opType:'updateCampaignSimulationRules', label:"Update the simulation rules", description:"Changes which living-world systems are enabled for the campaign and records the change in the ruleset log.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'rulesetLog', undoToken:null, undoState:'external:inverse-call' },
  advanceCampaignWorld: { opType:'advanceCampaignWorld', label:"Advance the world", description:"Runs the world pulse forward, advancing the campaign's region by the chosen span and recording a pulse record. It can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse', undoState:'action' },
  // R-5b (queue: "catchUp-promotion", R-0 recommendation ratified 2026-07-27):
  // PROMOTED from the referential `external:undoLastPulse` to a first-class
  // `undoToken:'undoLastPulse' / undoState:'action'`. The arming was re-derived at
  // the op site rather than inherited: runCatchUpCampaignWorld does not push a ring
  // entry of its own — it routes the WHOLE caught-up span through ONE delegated
  // `get().advanceCampaignWorld(campaignId, 'one_week', { now, autoResolve, weeks: n })`
  // (campaignAdvanceSession.js), and that advance's Phase-2 commit pushes exactly one
  // pre-catch-up snapshot onto pulseUndoStack. So every catch-up that moves the world
  // leaves exactly ONE armed undo step covering the whole span, and the paths that
  // move nothing (no cursor yet ⇒ seeded, cursor under a week old ⇒ up_to_date, a
  // refused/blocked advance) push nothing and offer nothing. That is 'action', not a
  // weaker claim: the pop restores the world, the member saves, AND the M10b cursor
  // (lastLivingAdvanceAt), so the undone span is honestly owed again on the next open
  // rather than silently swallowed. Behaviour pinned in
  // tests/store/catchUpCampaignWorld.test.js ("UNDO over a caught-up span is ONE
  // step", "UNDO restores the prior catch-up cursor"); the metadata/behaviour
  // agreement is pinned in tests/store/pulseUndoAdvertising.test.js, and the arming
  // entry is hand-audited in tests/store/advertisedUndoArming.walker.test.js
  // (kind:'delegates', armedBy advanceCampaignWorld). Session-scoped like every pulse
  // undo: a reload clears the stack and canUndoLastPulse is honestly false.
  catchUpCampaignWorld: { opType:'catchUpCampaignWorld', label:"Catch the world up", description:"Advances the campaign's world through any elapsed time it had fallen behind, without a manual pulse. The whole caught-up span is one step, and it can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:'undoLastPulse', undoState:'action' },
  applyCampaignContentBindingMigration: { opType:'applyCampaignContentBindingMigration', label:"Apply a campaign content migration", description:"Applies one reviewed immutable content-binding migration or rollback through compare-and-swap persistence, preserving the campaign's prior binding in history.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'campaign-content-binding-receipt', undoToken:null, undoState:'external:rollback-migration' },
  // R-0 undo-truth (queue #5): KEPT, armed at the TRANSACTION level. The paused
  // advance pushes the pre-INTERVAL snapshot in its Phase-2 commit, so a resume
  // of any interval begun this session is genuinely undoable (pinned: resume to
  // completion, undoLastPulse restores tick 0).
  // R-5b CLOSES R-0's one remaining gap, reload-into-paused, under the owner's
  // authorization for the shape change R-0 identified: the SAME pre-INTERVAL
  // snapshot is now also parked on the resume cursor
  // (worldState.pausedAdvance.preIntervalUndo), so it rehydrates with the campaign
  // when the session stack does not. undoLastPulse restores from the cursor only
  // when the stack holds nothing for the campaign, and the restore clears the
  // pause (the parked snapshot predates the interval), making it the documented
  // ABANDON path. NOT restored: the cursor's `preSnapshot`, which still holds only
  // pre-PAUSED-TICK clones and would mint a never-committed mid-interval state —
  // that remains resume fuel, never undo fuel. Absent-tolerant: a cursor written
  // before this field existed parks nothing, canUndoLastPulse stays honestly false
  // there, and no migration runs.
  resolveIntervalMajors: { opType:'resolveIntervalMajors', label:"Resolve interval majors", description:"Resolves the major events queued for a world-pulse interval and records them in the pulse record. It can be undone with Undo last pulse.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastPulse', undoState:'action' },
  // R-1 (queue #5): ARMED FOR REAL — the honest cure R-0's revert pointed at.
  // R-0 had de-advertised this row after its first arming was reverted for
  // (1) CAP FLOOD (per-apply pushes onto the shared PULSE_UNDO_CAP=10 advance
  // stack evicted the pre-advance snapshot) and (2) MISLABEL (every
  // canUndoLastPulse surface is advance-only "Undo Advance" copy). Both
  // objections are now removed structurally: runApplyWorldPulseProposal pushes
  // the pre-apply snapshot onto the SEPARATE, separately-capped session
  // proposalUndoStack ring (PROPOSAL_UNDO_CAP=5, campaignWorldPulseDeferred.js
  // — a different array, so proposal traffic cannot evict advance snapshots by
  // construction), and the pop is its own registered verb with its own labeled
  // surfaces (undoLastProposalApply; UndoHistoryPanel names which act each
  // entry reverts). Session-only, like the advance stack: a reload clears it.
  applyWorldPulseProposal: { opType:'applyWorldPulseProposal', label:"Apply a world-pulse proposal", description:"Applies a proposed world-pulse change to campaign canon and records it in the pulse record. It can be undone with Undo a proposal apply for the current session.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:'undoLastProposalApply', undoState:'action' },
  // R-0 undo-truth (queue #5; the atlas's highest-severity instance): DE-ADVERTISED.
  // runRecordPartyImpact pushes no snapshot, so the old undoToken:'undoLastPulse'
  // promised an undo that usually did not exist. Arming was REJECTED on evidence:
  // (1) the immediate path rides applyEvent's party ripple, so a per-impact
  // snapshot would resurrect events the user separately undid via undoLastEvent
  // (two undo systems sharing the saves substrate — the regen-edit-loss bug
  // class); (2) event-frequency pushes would flood the per-campaign cap and evict
  // real advance snapshots; (3) the advance's internal drain-replay runs through
  // this op while in flight and must NOT push mid-advance. Honest arming needs an
  // advance-scoped snapshot discipline that composes with undoLastEvent — an
  // owner-shaped design, not a push at this seam.
  recordPartyImpact: { opType:'recordPartyImpact', label:"Record a party impact", description:"Records the party's effect on the region as a world-pulse entry, so player action becomes part of the living world.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'pulse-record', undoToken:null, undoState:'none' },
  recordCanonRelationshipRipple: { opType:'recordCanonRelationshipRipple', label:"Record a relationship ripple", description:"Records a ripple change to the canon relationships between settlements. It can be reversed.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:'reverseCanonRelationshipRipple', undoState:'action' },
  reverseCanonRelationshipRipple: { opType:'reverseCanonRelationshipRipple', label:"Reverse a relationship ripple", description:"Undoes a previously recorded canon relationship ripple.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  dismissWorldPulseProposal: { opType:'dismissWorldPulseProposal', label:"Dismiss a world-pulse proposal", description:"Rejects a pending world-pulse proposal, recording its dismissed status without applying it.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'proposal-status', undoToken:null, undoState:'none' },
  // W-COMPOSER-2: the realm-verb force-as-proposal mint (cancel = dismissWorldPulseProposal; apply = applyWorldPulseProposal).
  stageRealmVerb: { opType:'stageRealmVerb', label:"Stage a realm action", description:"Mints a realm-level action as a pending world-pulse proposal for review. Applying or dismissing it uses the pulse-proposal verbs.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:'realm-proposal', undoToken:null, undoState:'external:dismissWorldPulseProposal' },
  undoLastPulse: { opType:'undoLastPulse', label:"Undo last pulse", description:"Reverses the most recent world pulse on the campaign, rolling the living world back.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  // R-1 (queue #5): the proposal-ring inverse — pops the newest pre-apply
  // snapshot from the session proposalUndoStack; never touches advance snapshots.
  undoLastProposalApply: { opType:'undoLastProposalApply', label:"Undo a proposal apply", description:"Reverses the most recent applied world-pulse proposal on the campaign, restoring the world and its settlements to just before the apply. The proposal returns to pending review.", klass:'macro', slice:'campaignWorldPulseSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  // ── K-B MECHANICAL — simple setters/updaters of durable/domain state ──
  // (No count in this header: the old "(118)" rotted to 124 unnoticed. Census
  //  the live number with `grep -c "klass:'mechanical'"` — never transcribe it.)
  // R-5b (owner queue #17): REGISTERED, not EXEMPT. Every K-D exempt row earns its
  // exemption with "excluded from the persist partialize" — this setter's whole
  // point is that it IS persisted (displayPrefs rides the allowlist), so it is a
  // real setter of durable state and belongs in the census proper. targetScope
  // 'global' because the preference is a property of the device, not of any save or
  // campaign; undoState 'not-applicable' because re-picking a ceiling IS the
  // inverse, and the value is outside canon entirely.
  setSceneQualityMode: { opType:'setSceneQualityMode', label:"Set the portrait quality ceiling", description:"Sets how much detail the 3D settlement portrait is allowed to render on this device. The portrait can still lower detail below the ceiling to stay responsive, and the choice is remembered for this browser.", klass:'mechanical', slice:'displayPrefsSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  queueEdit: { opType:'queueEdit', label:"Queue an edit", description:"Adds a single pending edit to the settlement, to be committed later. The edit can be reverted on its own.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'revertSingleEdit', undoState:'action' },
  revertSingleEdit: { opType:'revertSingleEdit', label:"Revert a single edit", description:"Removes one queued pending edit from the settlement.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  revertPendingEdits: { opType:'revertPendingEdits', label:"Revert all pending edits", description:"Discards every queued pending edit on the settlement without committing them.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  setSettlement: { opType:'setSettlement', label:"Set the settlement", description:"Replaces the active settlement in the store with a given settlement.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'irreversible' },
  clearSettlement: { opType:'clearSettlement', label:"Clear the settlement", description:"Clears the currently loaded settlement from the store.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'irreversible' },
  setSavedSettlements: { opType:'setSavedSettlements', label:"Set the saved settlements", description:"Replaces the full list of saved settlements in the store.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:rehydrate-from-authority' },
  setActiveSaveId: { opType:'setActiveSaveId', label:"Set the active save", description:"Selects which saved settlement is the active one.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  clearSavedSettlements: { opType:'clearSavedSettlements', label:"Clear saved settlements", description:"Removes all saved settlements from the store.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:rehydrate-from-authority' },
  removeSavedSettlement: { opType:'removeSavedSettlement', label:"Remove a saved settlement", description:"Deletes one settlement from the saved-settlements list.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  updateSavedSettlement: { opType:'updateSavedSettlement', label:"Update a saved settlement", description:"Writes changed fields onto one saved settlement in the list.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  renameNPC: { opType:'renameNPC', label:"Rename an NPC", description:"Renames a named NPC within the settlement and carries the new name through its references.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  // Owner queue #14. The old copy claimed the rename "carries the new name
  // through its references" while the action cascaded nothing. It does now, so
  // the row says exactly which references and stops there.
  renameFaction: { opType:'renameFaction', label:"Rename a faction", description:"Renames a faction and carries the new name through the settlement: its place in the power structure, the governing seat, every member, the institutions it founded, and any neighbouring settlement that names it.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  applyUserEditAction: { opType:'applyUserEditAction', label:"Apply a manual edit", description:"Applies a manual user edit to the settlement. It can be reversed with Revert a manual edit.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'revertUserEditAction', undoState:'action' },
  revertUserEditAction: { opType:'revertUserEditAction', label:"Revert a manual edit", description:"Reverses a previously applied manual user edit.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:'applyUserEditAction', undoState:'action' },
  persistActiveSaveEdit: { opType:'persistActiveSaveEdit', label:"Persist an edit to the active save", description:"Writes an edit to the active save so the change survives a reload.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  markExported: { opType:'markExported', label:"Mark as exported", description:"Flags the settlement as having been exported, for example to a PDF dossier.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'irreversible' },
  // Phase-A honesty (owner queue #21) carried forward to Phase B: these two rows
  // described a locks engine that did not exist for a year. They describe exactly
  // what the engine performs and nothing more. Phase B added the one promise the
  // Phase-A copy had to withhold — locked characters now survive a FULL regenerate,
  // not only a roster reroll. Still deliberately unsaid, because still unbuilt:
  // locking a whole roster does not stop a full regenerate, and a locked faction
  // survives as a name rather than as the faction object itself.
  setLock: { opType:'setLock', label:"Set a section lock", description:"Locks a part of the settlement. A locked section refuses to reroll. Locked characters survive any reroll, including a full regenerate, where they take a place in the new town. A full regenerate also keeps the locked name, terrain and history.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  clearLocks: { opType:'clearLocks', label:"Clear section locks", description:"Removes every lock from the settlement, so nothing is held back from a reroll. To recover a lock, set it again.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'none' },
  hydrateFromSave: { opType:'hydrateFromSave', label:"Load state from a save", description:"Rebuilds the working settlement state from a saved settlement.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  renameSettlement: { opType:'renameSettlement', label:"Rename the settlement", description:"Changes the settlement's name.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  // SM-3 — cosmetic town-map edit (mapEdits container: nudges / reroll / legend
  // prefs). Mechanical: a durable blob write via the applyEvent persist triple.
  // Cosmetic-always (no canon lock); undo rides the blob's own time-travel (no
  // dedicated map undo action ⇒ undoToken:null).
  applyMapEdit: { opType:'applyMapEdit', label:"Apply a map edit", description:"Writes a cosmetic town-map edit, such as a nudge, a reroll, or a legend preference, into the settlement's saved map edits.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:blob-time-travel' },
  // DOOR 2 — fog-of-war reveal edit (fogSessions sidecar: per-session district/street/
  // building reveal). Mechanical: a durable blob write via the applyMapEdit persist idiom.
  // Cosmetic-always (no canon lock); undo rides the blob's own time-travel (undoToken:null).
  applyFogEdit: { opType:'applyFogEdit', label:"Apply a fog-of-war edit", description:"Records a fog-of-war reveal of a district, street, or building into the settlement's per-session fog state.", klass:'mechanical', slice:'fogEditSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:blob-time-travel' },
  retryOutbox: { opType:'retryOutbox', label:"Retry the sync outbox", description:"Retries any campaign changes that failed to sync to the cloud.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  loadCampaigns: { opType:'loadCampaigns', label:"Load campaigns", description:"Loads the account's campaigns into the store.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  clearCampaigns: { opType:'clearCampaigns', label:"Clear campaigns", description:"Removes all campaigns from the store.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:loadCampaigns' },
  invalidateCampaignSession: { opType:'invalidateCampaignSession', label:"Invalidate the campaign session", description:"Advances the campaign session boundary and clears in-flight campaign locks so stale asynchronous work cannot commit after credentials change.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  createCampaign: { opType:'createCampaign', label:"Create a campaign", description:"Creates a new, empty campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:deleteCampaign' },
  createImportedCampaign: { opType:'createImportedCampaign', label:"Create an imported campaign", description:"Persists one complete remapped campaign envelope and publishes it locally only after the selected authority confirms the insert.", klass:'macro', slice:'campaignSlice', targetScope:'campaign', receiptRef:'imported-campaign-persistence-receipt', undoToken:null, undoState:'external:deleteCampaign' },
  renameCampaign: { opType:'renameCampaign', label:"Rename a campaign", description:"Changes a campaign's name.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  deleteCampaign: { opType:'deleteCampaign', label:"Delete a campaign", description:"Removes a campaign and its membership from the store.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'none' },
  toggleCampaignCollapsed: { opType:'toggleCampaignCollapsed', label:"Collapse or expand a campaign", description:"Toggles whether a campaign is shown collapsed in the list.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  addToCampaign: { opType:'addToCampaign', label:"Add a settlement to a campaign", description:"Adds a saved settlement to a campaign's membership.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:removeFromCampaign' },
  removeFromCampaign: { opType:'removeFromCampaign', label:"Remove a settlement from a campaign", description:"Removes a settlement from a campaign's membership.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:addToCampaign' },
  withSettlementDeletionLock: { opType:'withSettlementDeletionLock', label:"Guard a settlement deletion", description:"Serializes settlement deletion against campaign advances and membership changes.", klass:'mechanical', slice:'campaignSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  executeImportReconciliationDraft: { opType:'executeImportReconciliationDraft', label:"Apply an import reconciliation command", description:"Executes one reviewed settlement create-or-attach draft through the durable application command plane.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:'application-command-receipt', undoToken:null, undoState:'external:reconcile-replay' },
  saveCampaignMap: { opType:'saveCampaignMap', label:"Save the campaign map", description:"Stores the campaign's map state.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'irreversible' },
  clearCampaignMap: { opType:'clearCampaignMap', label:"Clear the campaign map", description:"Removes the stored map from a campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'none' },
  updateSavedCampaign: { opType:'updateSavedCampaign', label:"Update a campaign", description:"Writes changed fields onto a saved campaign.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'none' },
  appendCampaignChronicle: { opType:'appendCampaignChronicle', label:"Append to the campaign chronicle", description:"Adds an entry to the campaign's chronicle history.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'irreversible' },
  markCampaignLettersRead: { opType:'markCampaignLettersRead', label:"Mark campaign letters read", description:"Marks a campaign's pending letters as read.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  // V-17 THE CAMPAIGN IMPORT — commits confirmed typed table-events as source:'table'
  // news history at DM-chosen ticks (the per-event confirmation gate is upstream).
  importTableEvents: { opType:'importTableEvents', label:"Import table events", description:"Commits confirmed tabletop events into a campaign's news history at the chosen ticks.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'irreversible' },
  setActiveCampaign: { opType:'setActiveCampaign', label:"Set the active campaign", description:"Selects which campaign is the active one.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  queueSettlementEvent: { opType:'queueSettlementEvent', label:"Queue a settlement event", description:"Adds an event to a settlement's queue to be applied at a future tick.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:cancelQueuedEvent' },
  cancelQueuedEvent: { opType:'cancelQueuedEvent', label:"Cancel a queued event", description:"Removes a queued settlement event before it is applied.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  // W-COMPOSER-2 §10: the MUTABLE DOCKET — in-place edit of a queued intention.
  updateQueuedEvent: { opType:'updateQueuedEvent', label:"Update a queued event", description:"Edits a queued settlement event in place before it is applied.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  // Composer V2 §4 — target-first / SuccessorPrompt injection staging. Writes
  // only the transient composerIntent field (registered rather than exempt:
  // the K-D exempt ledger sits at its shrink-only ceiling).
  stageComposerIntent: { opType:'stageComposerIntent', label:"Stage a composer intent", description:"Stages a target-first intent for the event composer, writing only the transient composer-intent field.", klass:'mechanical', slice:'settlementSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  setRegionalChannelStatus: { opType:'setRegionalChannelStatus', label:"Set a regional channel status", description:"Sets the status of a channel, such as a trade route or a war front, between two settlements in the region.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  setCampaignRegionalGraph: { opType:'setCampaignRegionalGraph', label:"Set the regional graph", description:"Replaces the campaign's regional graph with a given graph.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'irreversible' },
  setRegionalImpactStatus: { opType:'setRegionalImpactStatus', label:"Set a regional impact's status", description:"Changes the status of a queued regional impact.", klass:'mechanical', slice:'campaignRegionalSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'partial:inverse-call' },
  setAiSettlement: { opType:'setAiSettlement', label:"Set the AI settlement", description:"Stores an AI-refined version of the settlement. It can be reverted to the raw text.", klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:'revertCurrentToRaw', undoState:'action' },
  clearAiSettlement: { opType:'clearAiSettlement', label:"Clear the AI settlement", description:"Removes the stored AI-refined settlement.", klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'external:hydrateAiFromSave' },
  hydrateAiFromSave: { opType:'hydrateAiFromSave', label:"Load AI content from a save", description:"Restores stored AI content from a saved settlement.", klass:'mechanical', slice:'aiSlice', targetScope:'save', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  setAuth: { opType:'setAuth', label:"Set the auth session", description:"Stores the current sign-in session. It can be cleared with Clear the auth session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth', undoState:'action' },
  clearAuth: { opType:'clearAuth', label:"Clear the auth session", description:"Signs the user out locally by clearing the sign-in session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'setAuth', undoState:'action' },
  clearDossierEntitlements: { opType:'clearDossierEntitlements', label:"Clear dossier entitlements", description:"Removes all stored dossier entitlements.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'external:refreshDossierEntitlement' },
  refreshDossierEntitlement: { opType:'refreshDossierEntitlement', label:"Refresh a dossier entitlement", description:"Re-reads a dossier entitlement's current state.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  initAuth: { opType:'initAuth', label:"Initialize sign-in", description:"Sets up the sign-in session on startup from any stored session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth', undoState:'action' },
  authSignUp: { opType:'authSignUp', label:"Sign up", description:"Creates a new account and stores the resulting session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth', undoState:'action' },
  authSignIn: { opType:'authSignIn', label:"Sign in", description:"Signs the user in and stores the resulting session.", klass:'mechanical', slice:'authSlice', targetScope:'global', receiptRef:null, undoToken:'clearAuth', undoState:'action' },
  listCustomContentRevisions: { opType:'listCustomContentRevisions', label:"Load custom-content revision history", description:"Loads one custom definition's immutable revision history into the inspection cache without changing its active head.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  loadArchivedCustomContent: { opType:'loadArchivedCustomContent', label:"Load archived custom content", description:"Loads archived custom-content heads into their separate inspection projection without restoring them to generation.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  loadCustomContentEnvironments: { opType:'loadCustomContentEnvironments', label:"Load custom-content environments", description:"Loads immutable environment history and the durable active-environment pointer into the store.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  rollbackCustomContentEnvironment: { opType:'rollbackCustomContentEnvironment', label:"Roll back a custom-content environment", description:"Reactivates a reviewed immutable environment revision through the durable command boundary; no environment history is overwritten.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:'application-command-receipt', undoToken:null, undoState:'external:revision-history' },
  pinLegacyCampaignContentBindings: { opType:'pinLegacyCampaignContentBindings', label:"Pin legacy campaign content", description:"Captures the correct owner's resolved custom definitions for legacy campaigns so future simulation cannot drift with later library edits.", klass:'mechanical', slice:'campaignSlice', targetScope:'campaign', receiptRef:'campaign-content-binding', undoToken:null, undoState:'irreversible' },
  clearCloudCustomContent: { opType:'clearCloudCustomContent', label:"Clear cloud custom content", description:"Clears the account's cloud custom content. It can be reloaded from the cloud.", klass:'mechanical', slice:'customContentSlice', targetScope:'global', receiptRef:null, undoToken:'loadCustomContentFromCloud', undoState:'action' },
  // V-5 THE CORPUS FACTORY — staging-catalog mutations. None writes canon (canon is the
  // owner's gen:compendium-data fold of APPROVED_CORPUS); these only stage/review candidates.
  stageCorpusCandidates: { opType:'stageCorpusCandidates', label:"Stage corpus candidates", description:"Adds candidate entries to the custom-content corpus staging catalog for review. A candidate can be removed.", klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:'removeCorpusCandidate', undoState:'action' },
  reviewCorpusCandidate: { opType:'reviewCorpusCandidate', label:"Review a corpus candidate", description:"Records a review decision on a staged corpus candidate.", klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  removeCorpusCandidate: { opType:'removeCorpusCandidate', label:"Remove a corpus candidate", description:"Removes a candidate from the corpus staging catalog.", klass:'mechanical', slice:'corpusFactorySlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  addPlacement: { opType:'addPlacement', label:"Add a map placement", description:"Places a marker or feature on the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  removePlacementLocal: { opType:'removePlacementLocal', label:"Remove a map placement", description:"Removes a placement from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  // R-4 undo-truth (queue #5, the map-family instance): DE-ADVERTISED. The old
  // undoToken:'mapUndo' / undoState:'action' was FALSE in both places the arming
  // could live. The op body pushes no snapshot (every armed mapSlice sibling
  // opens with snapshotForUndo; this one does not), and its sole consumer — the
  // drag-to-move commit at PlacementsLayer.jsx handleDragPointerUp — never calls
  // pushMapUndo, unlike the exactly-analogous drag handlers in MarkersLayer,
  // LabelsLayer and ForestsLayer that each snapshot once per drag. So a
  // settlement-icon move armed nothing: pressing Undo popped whatever unrelated
  // snapshot was newest. 'none' (not 'partial:pushMapUndo', which its three
  // in-place-patch siblings carry) because the caller-side arming those three
  // rely on does not exist here — the undo is a GAP, not a law. Upgrading it is
  // a one-line component change (pushMapUndo at the placement drag-start, the
  // sibling recipe); that is a behavior addition, deliberately not taken in a
  // prevention wave. Pinned both ways in tests/store/advertisedUndoArming.walker.test.js.
  updatePlacement: { opType:'updatePlacement', label:"Update a map placement", description:"Changes a placement on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'none' },
  clearAllPlacementsLocal: { opType:'clearAllPlacementsLocal', label:"Clear all map placements", description:"Removes every placement from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  addLabel: { opType:'addLabel', label:"Add a map label", description:"Adds a text label to the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  updateLabel: { opType:'updateLabel', label:"Update a map label", description:"Changes a label on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'partial:pushMapUndo' },
  deleteLabel: { opType:'deleteLabel', label:"Delete a map label", description:"Removes a label from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  addMarker: { opType:'addMarker', label:"Add a map marker", description:"Adds a marker to the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  updateMarker: { opType:'updateMarker', label:"Update a map marker", description:"Changes a marker on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'partial:pushMapUndo' },
  deleteMarker: { opType:'deleteMarker', label:"Delete a map marker", description:"Removes a marker from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  addForest: { opType:'addForest', label:"Add a map forest", description:"Adds a forest area to the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  updateForest: { opType:'updateForest', label:"Update a map forest", description:"Changes a forest area on the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'partial:pushMapUndo' },
  deleteForest: { opType:'deleteForest', label:"Delete a map forest", description:"Removes a forest area from the campaign map. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  setMapSnapshot: { opType:'setMapSnapshot', label:"Set the map snapshot", description:"Stores a snapshot of the campaign map's current state.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'irreversible' },
  setMapBackdrop: { opType:'setMapBackdrop', label:"Set the map backdrop", description:"Sets the backdrop image for the campaign map.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:clearMapBackdrop' },
  clearMapBackdrop: { opType:'clearMapBackdrop', label:"Clear the map backdrop", description:"Removes the campaign map's backdrop image.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'external:setMapBackdrop' },
  bumpGeometryVersion: { opType:'bumpGeometryVersion', label:"Bump the map geometry version", description:"Advances the map geometry version so dependent layers know to recompute.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  replaceMapState: { opType:'replaceMapState', label:"Replace the map state", description:"Replaces the campaign's entire map state with a given state.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'irreversible' },
  resetMapState: { opType:'resetMapState', label:"Reset the map state", description:"Clears the campaign map back to an empty state.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:null, undoState:'irreversible' },
  pushMapUndo: { opType:'pushMapUndo', label:"Push a map undo step", description:"Records the current map state as an undo step. It can be undone with the map undo.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  mapUndo: { opType:'mapUndo', label:"Undo a map change", description:"Reverses the most recent campaign-map change. It can be redone.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapRedo', undoState:'action' },
  mapRedo: { opType:'mapRedo', label:"Redo a map change", description:"Re-applies a campaign-map change that was undone. It can be undone again.", klass:'mechanical', slice:'mapSlice', targetScope:'campaign', receiptRef:null, undoToken:'mapUndo', undoState:'action' },
  clearNeighbour: { opType:'clearNeighbour', label:"Clear a neighbour", description:"Removes a settlement's neighbour link data.", klass:'mechanical', slice:'neighbourSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  // RETIRED 2026-07-27 (coach-exit lane, owner queue #21 for the onboarding trio):
  // completeOnboarding, markFeatureUsed, resetOnboarding left the registry with
  // the coach state machine and the feature-hints subsystem they described. All
  // three were measured callerless by the dead-op ratchet, the coach they served
  // was headless (no CSS ever targeted its only rendered output), and the live
  // first-run teaching belongs to the guidance registry (W-GUIDE-1 / host C4).
  // See src/store/onboardingSlice.js for the full retirement note.
  setCreditBalance: { opType:'setCreditBalance', label:"Set the credit balance", description:"Sets the account's narrative-credit balance to a given amount.", klass:'mechanical', slice:'creditsSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  updateConfig: { opType:'updateConfig', label:"Update the generation settings", description:"Changes the settlement generation settings, such as size, sliders, and options.", klass:'mechanical', slice:'configSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  toggleInstitution: { opType:'toggleInstitution', label:"Toggle an institution", description:"Turns one institution on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  setInstitutionToggles: { opType:'setInstitutionToggles', label:"Set institution choices", description:"Replaces the full set of institution on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'irreversible' },
  toggleCategory: { opType:'toggleCategory', label:"Toggle a category", description:"Turns a whole institution category on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  setCategoryToggles: { opType:'setCategoryToggles', label:"Set category choices", description:"Replaces the full set of category on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'irreversible' },
  toggleGood: { opType:'toggleGood', label:"Toggle a trade good", description:"Turns one trade good on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  setGoodsToggles: { opType:'setGoodsToggles', label:"Set trade-good choices", description:"Replaces the full set of trade-good on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'irreversible' },
  toggleService: { opType:'toggleService', label:"Toggle a service", description:"Turns one service on or off in the generation settings.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'external:inverse-call' },
  setServiceToggles: { opType:'setServiceToggles', label:"Set service choices", description:"Replaces the full set of service on-or-off choices.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'irreversible' },
  resetAllToggles: { opType:'resetAllToggles', label:"Reset every toggle", description:"Restores all generation choices to their defaults.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'not-applicable' },
  bulkSetInstitutions: { opType:'bulkSetInstitutions', label:"Bulk-set institutions", description:"Sets many institution choices at once.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'irreversible' },
  bulkSetServices: { opType:'bulkSetServices', label:"Bulk-set services", description:"Sets many service choices at once.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'irreversible' },
  bulkSetGoods: { opType:'bulkSetGoods', label:"Bulk-set trade goods", description:"Sets many trade-good choices at once.", klass:'mechanical', slice:'toggleSlice', targetScope:'global', receiptRef:null, undoToken:null, undoState:'irreversible' },
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
  // The coach-flow exempt rows (initOnboarding, advanceOnboarding,
  // setOnboardingStep, trackTabExplored) were RETIRED 2026-07-27 with the coach
  // itself; only the nudge-toast channel remains on onboardingSlice.
  setOnboardingNudge: { slice: 'onboardingSlice', reason: 'transient nudge toast; session-only, excluded from persist partialize' },
  clearOnboardingNudge: { slice: 'onboardingSlice', reason: 'clears the transient nudge toast; session-only, excluded from persist partialize' },
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
// 72 -> 69 (coach-exit lane, 2026-07-27): a net -3. FOUR coach-flow rows left with
// the retired state machine (initOnboarding, advanceOnboarding, setOnboardingStep,
// trackTabExplored) and ONE was minted — setOnboardingNudge, the missing writer of
// the nudge-toast channel App.jsx already renders (its only call site, the F34
// post-signup save handler, had been silently no-opping behind a typeof guard).
// Shrink direction, per the K-D shrink-only convention.
export const EXEMPT_CEILING = 69;

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
