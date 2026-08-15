# W-R2-INTENT — the DM's-order-is-sacred wave (store/hooks/composer intent-trust)
## Read docs/briefs/W_R2_COMMON_PROTOCOL.md FIRST. Branch: `claude/w-r2-intent`.
## Base symbols to verify: src/store/settlementSlice.js has applyEvent (~line 1664); src/components/settlement/eventComposer/editSeed.js exists.

**CHARGE:** no DM intent is ever silently dropped, silently inverted, or silently reverted.
Every fix here is client/store — zero goldens, zero engine bytes; the persisted-surface
round-trip pin class applies everywhere (the write must survive reload + every lifecycle path).

**FENCE:** src/store/**, src/hooks/**, src/components/settlement/eventComposer/**,
src/components/map/ (autosave pair only), src/domain/events/drainQueuedEvents.js,
src/domain/worldPulse/worldState.js (upsertProposal only), src/domain/worldPulse/
realmVerbExecution.js (outcome-id mint only) + tests. Nothing else in domain.

**THE FIXES** (verdict corrections BIND; extraction per protocol):

Silent drops:
1. `store-hooks-state-1` — queueSettlementEvent's typed refusal must ride applyEvent as
   ok:false with ADVANCE_ERROR_TEXT prose; EventComposer branches on queued===false (keep the
   form, toast the reason); applyEventBatch classifies refusals. Composer-during-pause store
   test beside advancePauseResume.test.js.
2. `state-lifecycle-3` — drainQueuedEvents adds the missing_target refusal branch (rides the
   advance digest via queueRefusalNews). Pin: drained queue with a non-member saveId refuses
   visibly.
3. `store-hooks-state-6` — addToCampaign prunes/migrates the moved settlement's pendingEvents
   from every campaign it leaves (the removeFromCampaign pattern).
4. `worldpulse-tick-core-2` — proposal-ring eviction: resolved records pruned FIRST; pending
   overflow gets a visible expire-to-decline stamp (mirror expireStaleActorMajors). LAW: the
   eviction is always receipted. (The √N ring scaling itself is W-R2-DEPTH's D2c — do NOT
   build scaling here; just the receipted eviction.)

Silent inversions (the docket edit lane):
5. `components-dossier-library-2` — editSeed keys IMPOSE_CULT removal on snapshot==null →
   deityMode:'remove' + cultRemoveRef. THEN the structural guard: the round-trip pin —
   buildEvent(applyComposerIntent(eventToComposerIntent(e))) reproduces every queued payload
   byte-for-byte across ALL authorable verbs (this pins the whole reverse-map class).
6. `components-dossier-library-7` — custom APPLY_STRESSOR round-trip (stressorPick twin with
   {key, name, isCustom}); covered by 5's pin — verify the PARTIAL verdict's correction for
   exact scope.
7. `composer-realm-verbs-4` — realm outcome ids fold a stable short hash of sorted args
   (decided-proposal history survives re-stage). Pin.

Silent reverts (the pause window + persistence ghosts):
8. `store-hooks-state-3` — updateCampaignSimulationRules, canonizeCampaignWorld,
   canonizeCampaignWorldSpatial gain the getPausedAdvance sync-prefix (typed advance_paused
   no-op); rulesEditBlocked covers parked-pause; extend pulseMutatorsInFlightGuard.test.js.
9. `store-hooks-state-4` — resolveRegionalImpact + advanceCampaignRegionalImpacts gain the
   store-2 guards their siblings have.
10. `store-hooks-state-5` + `state-lifecycle-1` (same defect, two lenses) — town rename reaches
    the row `name` column: route the queue dispatch through renameSettlementImpl (ONE writer),
    add name to the in-memory entry AND the persist partial. Extend the §10.4 pin to assert
    the persisted entry + cloud partial.
11. `state-lifecycle-2` — delete/bulk-delete calls removeFromCampaign for every campaign
    holding the id. Pin: delete a member → campaign.settlementIds + pendingEvents clean.
12. `components-map-1` — extract AutoSaveChip's content-aware fingerprint() to a shared module;
    the autosave hook consumes it (one source, two consumers) + parity pin. Delete the stale
    'mirrors' comment.
13. `store-hooks-state-7` — mapSlice.addPlacement implements the typed gate its hook documents
    ({ok:false, reason} for no-campaign/not-canon/duplicate; handleDrop's checks shared).
14. `store-hooks-state-2` — outbox ordering keyed on the mapped COLUMN set (strip non-column
    keys); route aiSlice's direct ai_data write through persistSaveUpdate. Interleaved-kinds
    outbox test.

**EXCLUDED (REFUTED):** components-dossier-library-4 (DailyLife deficit — the verdict found
the canonical read; read it before touching anything nearby).
