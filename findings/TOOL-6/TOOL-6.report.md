# TOOL-6 — the mutation-coverage manifest and `tests/store`

RECON lane (Opus 5), measure-first, read-only. Chartered 2026-09-19 20:34, ODQ §934.60 addendum 2 Q3.

**Tree read:** `$SP/read-tip-32602dc60` @ `32602dc607b7423838249cf57d73baf08feb047d`, `status --short` EMPTY at start and end.
**Stamp:** `date` in the same call as the HEAD check printed `Sun Sep 20 02:52:40 EDT 2026`.
**No gate was run.** No vitest, eslint, tsc or build. Every timing figure below is labelled PLAUSIBLE.

---

## 0. THE PREMISE, RE-MEASURED — and one correction to the brief

⛔ **`tests/store/participationWriteBase.test.js` DOES NOT EXIST at this tip.** CONFIRMED:

```
$ find $T/tests -name "*articipation*" -o -name "*riteBase*"
/…/tests/domain/roadsParticipation.test.js
$ grep -rl "EM-B1k" $T/tests     # (no output)
```

EM-B1k has not landed on `32602dc60`. The lane therefore measures the *class* and the *door*, not the file. The premise itself holds and is CONFIRMED by execution against the estate's own enumerator:

```
$ node -e 'NAME_PATTERN.test("participationWriteBase.test.js")'   → false
```

Neither arm of the enumeration rule claims it: `tests/store` is not an `ENFORCER_DIR`, and the basename trips none of the sixteen `NAME_PATTERN` tokens. The same is true of three other plausible EM-B1k/EM-B1k2 spellings I probed — `offStageErasure` → false, `shelvedNpcSurvival` → false — while `pulseWriteBaseContract` → **true** (the `contract` token). That last result is the whole finding in miniature: **today the door is the filename, and it opens or shuts on a spelling.**

### The enumeration rule as it stands (CONFIRMED, `tests/lint/mutationCoverage.shared.mjs:36-75`)

```
ENFORCER_DIRS = [tests/lint, tests/design, tests/docs, tests/data,
                 tests/copy, tests/security, tests/edgeFunctions, tests/generators]
NAME_PATTERN  = /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|
                  governance|freshness|integrity|exhaustiveness|roundtrip|golden|
                  contract|pin)/i      // basename only, outside the enforcer dirs
```

### The estate, measured

| figure | value | command |
|---|---|---|
| test files under `tests/` | **2650** | `walk(tests/).filter(/\.test\.(js\|jsx)$/)` |
| currently enumerated | **706** | `enumerateInvariants(ROOT).length` |
| NOT enumerated | **1944** (73.4%) | same walk |
| manifest `invariants` rows | **706** | `Object.keys(manifest.invariants).length` |
| enumerated with no row / rows with no file | **0 / 0** | set-difference both ways |
| `uncoveredBaseline` | **186** | manifest read |
| rows by kind | rationale **430**, mutation **90**, uncovered **186** | manifest read |
| `meta` rows | 34 | manifest read |
| shared `rationales` | 41 | manifest read |
| sweep plants (`check_caught*` labels) | **121** floor, script is 1604 lines | `tests/lint/mutationCoverageManifest.test.js:87` |
| files under `tests/store` | **148** | `find tests/store -type f \| wc -l` (= `git ls-files`) |
| of those, enumerated today | **14** | `enumerateInvariants` filtered |
| would be NEW if `tests/store` joined | **134** | 148 − 14 |

---

## 1. THE POPULATION OF `tests/store` (148 files)

**Band key.** `E` = already enumerated (its current manifest kind in brackets). `R` = **regression suite** — the docblock names a defect that shipped, was reproduced, or whose silent return is a shipped defect. `C` = **contract / fence** — pins a designed seam (auth-owner fence, premium gate, registry totality, command authority, persistence shape); silent loss = a gate quietly opens. `S` = **shape / fixture / round-trip** — small surface, read-back, helper semantics.

Bands are my judgment (PLAUSIBLE) read off CONFIRMED docblock text; line counts and the `E` column are CONFIRMED.

**Totals: E 14 · R 56 · C 69 · S 9.**

| # | file | lines | band | what it holds |
|---|---|---|---|---|
| 1 | accountImportSlice.test.js | 1371 | C | "Import my data" WRITE half: fail-closed on malformed file, foreign `user_id` ignored (ownership remapped), fresh ids per record, save cap, premium gate, same-owner cleanup |
| 2 | actionEnvelope.test.js | 221 | C | Track K §C1 adoption ratchet — converted actions return a uniform ActionResult envelope and the converted set is GROW-ONLY |
| 3 | activeCustomContentContext.test.js | 95 | C | active content execution context: campaign definitions beat later account heads; a malformed binding fails closed |
| 4 | addPlacementGate.test.js | 120 | **R** | the campaign/canon/no-duplicate gate lived only in the UI; the store placed unconditionally and the documented refusal copy was dead |
| 5 | advanceCampaignWorldRefactor.test.js | 195 | C | B11 #2/#3 — pure compute lifted out of the Immer producer, externally-observable behaviour preserved, atomic w.r.t. other actions |
| 6 | advanceEpochForkSemantics.test.js | 649 | **R** | EP-2 fork semantics: a resumed advance REUSES its epoch, a non-committing consumer INHERITS. Minting there splits one advance across two streams mid-interval **with no crash** |
| 7 | advanceFullAutoResolve.test.js | 277 | C | J-D7 full auto-resolve at the store seam: toggle on ⇒ docket emptied in the SAME atomic Phase-2 write; toggle off ⇒ no row marked |
| 8 | advanceInFlightMutatorGuard.test.js | 273 | **R** | a canon event or regional decision made mid-advance returned success yet vanished (Phase-2 replaces worldState wholesale) |
| 9 | advanceMultiTickFlag.test.js | 187 | C | flag off = one tick, undo +1, one analytics event; flag on = N ticks, still one undo step and one event per interval |
| 10 | advancePauseResume.test.js | 359 | C | Stage-3 pause/resume machine incl. reload mid-pause resuming deterministically to the same end |
| 11 | advancePauseSnapshotBounded.test.js | 179 | **R** | the pause cursor deep-copied the whole pre-tick world a SECOND time per pause, then serialized and persisted it |
| 12 | advertisedUndoArming.walker.test.js | 663 | **E** [mutation] | the advertised-undo invariant — a registry row may not claim recovery nothing arms |
| 13 | aiActiveSaveGuard.test.js | 175 | **R** | a resolving narrative run clobbered the now-open settlement's prose — one town's AI prose bleeding onto another |
| 14 | aiDataOutboxConvergence.test.js | 166 | **R** | nine aiSlice writes bypassed the durable outbox: two ai_data writes could RACE, and an offline write was simply LOST |
| 15 | aiSlice.chronicleGate.test.js | 159 | C | owner decision 2026-06-11: pre-canon regenerations are churn, not history; every other reason still records |
| 16 | aiSlice.midSwitchBleed.test.js | 198 | **R** | two cross-save bleed bugs — the chronicle entry built from the LIVE view, and a session-view guard that read the wrong field |
| 17 | aiSlice.orchestration.test.js | 373 | **R** | F18/F19/F20 — a stalled run must not wedge aiLoading; a late result must not commit onto the settlement now on screen; refund notice |
| 18 | aiSlice.protoPollutionAndDeadCode.test.js | 162 | **R** | `__proto__.x` field path wrote THROUGH Object.prototype; a dead paid-spend action removed so a re-wire cannot double-charge |
| 19 | aiSlice.revertNonActive.test.js | 99 | **R** | reverting a NON-active save blanked the prose of whatever settlement was on screen |
| 20 | aiSlice.verifier.test.js | 299 | C | Tier 6.5: the overlay verifier runs, stores violations, still commits (display-only), never crashes the slice |
| 21 | aiSliceHelpers.test.js | 178 | S | helper classification, sibling-collection preservation, immutable copy tables |
| 22 | anonRandomForgeIsNeverDiscarded.test.js | 199 | **R** | the tier gate AIMS the `random` sentinel it would otherwise discard, deterministically, off its own stream |
| 23 | appNavSsot.test.js | 88 | **R** | nav metadata duplicated in App.jsx — this is how About, then Gallery, once got dropped from mobile |
| 24 | autoplacementStore.test.js | 220 | C | W-G/J-D1: positions land only through the canonical writers, one undo reverts the whole act, genesis byte-identical |
| 25 | backdropUrlGuard.test.js | 128 | **R** | a failed re-upload fell back to the ORIGINAL shared `imageUrl` — including a `javascript:`/`data:` scheme MapOverlay then renders |
| 26 | campaignContentLifecycle.test.js | 287 | C | review → durable apply → rollback; replay rejected after the head moved; no plan crosses an account-session boundary |
| 27 | campaignDeleteAuthCommit.test.js | 203 | C | a suspended owner-A delete must never remove, tombstone or clear undo for owner B's same-id campaign |
| 28 | campaignEntryParity.test.js | 480 | **E** [rationale] | thin campaign-entry runtime-capsule parity |
| 29 | campaignHydration.test.js | 62 | C | strict world admission before structural migration; one hydration never aliases its persisted world graph |
| 30 | campaignLetterLifecycle.test.js | 70 | C | V-2 `lastReadTick`/`flagsSeen` normalized at the single load chokepoint, preserved verbatim, survive the persist clone |
| 31 | campaignMembershipIdNormalization.test.js | 200 | **R** | numeric vs string save ids: a member silently vanished from the pulse and from the campaign badge |
| 32 | campaignPulsePersist.test.js | 442 | C | parallel flush contract (no fail-fast), seam ordering (snapshot after every member persist), differential skip |
| 33 | campaignReportingIsolation.test.js | 164 | C | sign-out and A→B transitions cannot retain the prior owner's reporter status or queue |
| 34 | campaignRuntimeBridge.test.js | 122 | C | concurrent loads deduped, table published atomically, rejected promise cleared for retry, per-store isolation |
| 35 | campaignRuntimeCallerCoverage.test.js | 322 | **E** [rationale] | exhaustive campaign-delegate caller census off the live import graph |
| 36 | campaignRuntimeRouteGate.test.js | 151 | C | no view is imported until the runtime preload succeeds; a failed preload rejects without a partially-armed view |
| 37 | campaignRuntimeViewRetry.test.jsx | 73 | S | a generic lazy view retries its importer after an explicit recovery |
| 38 | campaignSlice.deletionSync.test.js | 438 | **R** | the deletion-resurrection regression net, against a real merge/backfill path |
| 39 | campaignSlice.galleryImport.test.js | 175 | C | W4c client-side premium gate before any round-trip (the RPC is the server-authoritative gate) |
| 40 | campaignSlice.hybridTimeline.test.js | 155 | **R** | a failed 069 RPC leaves an ADVANCED local copy with a newer `updatedAt`; letting it win the merge is a permanent campaign-tick vs settlement-state split |
| 41 | campaignSlice.importSettlement.test.js | 175 | C | the clone envelope: cross-settlement refs stripped, every seed scrubbed, provenance stamped, fresh draft |
| 42 | campaignSlice.migrate.test.js | 88 | **R** | correctness-1: `settlementIds` must normalize to an array or SettlementsPanel white-screens on a legacy campaign |
| 43 | campaignSlice.regional.test.js | 507 | **R** | F2/R1 — a failed settlement save must leave the campaign impact QUEUED (resp. APPLIED): no split truth |
| 44 | campaignSlice.tickClockSync.test.js | 153 | **R** | a manual impact-advance press must never permanently skew where pulse news groups |
| 45 | campaignSlice.worldPulse.test.js | 386 | C | preview does not mutate; string- and number-id members both advance; retained inactive campaigns reject mutations |
| 46 | campaignSyncBookkeeping.test.js | 36 | **E** [rationale] | cold sync-bookkeeping seam with injected loaders |
| 47 | campaignWorldPulseControlLayer.test.js | 271 | C | CL-0 (d) frozen progression no-ops byte-for-byte; (e) rulesetLog receipts + wizard-news entry on an EFFECTIVE change only |
| 48 | campaignWorldPulseLazyOwnerFence.test.js | 114 | C | a lazy pulse mutator re-checks the campaign auth generation after its dynamic import resolves |
| 49 | campaignWorldPulseOwnerFence.test.js | 307 | C | campaign UUIDs repeat across accounts; an A→B switch mid-simulation must not commit A's result into B |
| 50 | campaignWorldPulseSpatialCanon.test.js | 519 | C | Phase-5.5 entitled spatial-canonize seam: not-premium / imported map / capture-unavailable all write NOTHING |
| 51 | canonEventCommandTransaction.test.js | 817 | C | the first durable canon-event vertical end to end: lazy boundary, pure preparation, authoritative projection, session replay |
| 52 | catchUpCampaignWorld.test.js | 546 | C | M10b: N weeks run as ONE orchestrated interval (one commit/persist/sync/undo), content byte-identical to N manual advances |
| 53 | commitPendingEditsTotality.walker.test.js | 69 | **E** [rationale → self-proving-meta] | every admitted edit kind reaches a writer and returns a typed outcome |
| 54 | configDirectWriterExemptions.scan.test.js | 268 | **E** [mutation] | the exact set of direct `state.config` writers outside the validated door |
| 55 | corpusFactorySlice.test.js | 64 | S | V-5 staging slice: provenance on every candidate; nothing here writes canon |
| 56 | creditsAndNarrateSignal.test.js | 100 | **R** | B11 #4 — `lifetimeNarrateCount` stayed 0 forever, so the reader-audience signal never progressed; credit surface is a server mirror |
| 57 | customContentArchiveActions.test.js | 131 | C | export ungated, import once + durable receipt, archive mutation premium-gated, no hydration from an unconfirmed receipt |
| 58 | customContentCategoryGuard.test.js | 76 | **R** | unknown categories once created arbitrary buckets on demand — a typo was an undeclared extension point |
| 59 | customContentCutover.test.js | 325 | C | local→cloud cutover: one merged graph, coalesced auth effects, both ledgers kept when the command is ambiguous, stale CAS |
| 60 | customContentEnvironment.test.js | 201 | C | preview/activate/rollback/reset-to-vanilla; stale fingerprint and superseded migration both rejected before persistence |
| 61 | customContentHydrationOrdering.test.js | 158 | **R** | a legacy campaign cutoff is PERMANENT, so it may be minted only after both reads succeeded; initial vanilla is not evidence |
| 62 | customContentSlice.cache.test.js | 86 | C | the offline mirror is owner-scoped and never write authority |
| 63 | customContentSlice.deeager.test.js | 408 | C | the manifest and immutable command stack are absent from the eager closure; only a confirmed writer receipt is projected |
| 64 | customContentSlice.deities.test.js | 266 | C | deity bucket: immutable revisions, archive without deleting history, axes validated before the command writer |
| 65 | customContentSlice.race.test.js | 506 | C | durable command ordering and compare-and-swap on a shared expected head |
| 66 | customContentTunablesRuntime.test.js | 155 | C | generation resolves the reviewed runtime without mutating visible config; intent accumulates through the door |
| 67 | deadOperationRatchet.test.js | 423 | **E** [mutation] | an unreachable registered op may not ship and may not be laundered into the frozen ledger |
| 68 | decreeRegistryPersistence.test.js | 297 | C | EM-B3a: `dmLayer` + `decrees` ride the save blob byte-exact; empty ≠ absent; a malformed legacy value is carried inert |
| 69 | deityClearCults.test.js | 116 | C | R-2 Lane C: entitled clear-all empties the cult list and deletes the dormancy-oracle key; the LAPSED shed-direction allowance |
| 70 | deityRefCollision.test.js | 124 | **R** | confirmed-live: two accounts' same-named homebrew deities identity-merged in a shared campaign |
| 71 | deityRestoreFromWorld.test.js | 189 | **R** | an ousted pool-seeded or foreign patron was gone for good; the restore lane reads the campaign's own surviving record |
| 72 | deityWriteGate.test.js | 247 | C | R-0 Lane D: the panel-lane deity premium gate is FAIL-CLOSED at the store seam (scope honestly bounded to that lane) |
| 73 | deleteMemberPrunesCampaign.test.js | 173 | **R** | deleting a save left campaign residue and queued world-clock intentions that the next tick silently destroyed |
| 74 | destroyConfirmGate.test.js | 122 | C | R-1 confirm-gate parity across the three settlement-terminal-death lanes |
| 75 | destroyWriterConvergence.test.js | 108 | **R** | two writers of the destroyed-settlement fields had already drifted — the store lane never stamped the keys undo revival matches on |
| 76 | dispositionChannelsUndo.test.js | 169 | C | WR-2: the real advance/undo ring preserves the extended `dispositionStats` entry byte-for-byte |
| 77 | draftTimelineTransfer.test.js | 218 | **R** | saving to the library minted `versionHistory: []` — **the act of KEEPING a settlement destroyed its history** |
| 78 | editActionPersist.test.js | 402 | **R** | §10.4 persist gap: an edit on a hydrated save reached the persisted row only by luck — the owner's most-bitten ghosting class |
| 79 | editProseQueueSpine.test.js | 318 | **E** [mutation] | the queue-wired subset stays in lockstep with the registry for the lifecycle-sound prose paths |
| 80 | eventNarrativeSnapshot.test.js | 66 | S | the pure archive helper: append, dedupe-by-eventId, FIFO cap, clone-once |
| 81 | factionRenameConvergence.test.js | 237 | **R** | two rename lanes invisible to each other; the store lane cascaded nothing and the rename had to survive a reload |
| 82 | galleryMapImportNormalize.test.js | 215 | **R** | SB1: the member clone skipped `normalizeSettlement`, so a legacy-shape member arrived un-canonicalized |
| 83 | galleryMapImportOwnerFence.test.js | 119 | C | auth change mid-import must stop before the second write; the committed row is the disclosed partial-success control |
| 84 | generateStrayConfigSeed.test.js | 142 | **R** | ⭐ **reported on production 2026-09-16** — a `seed` stamped into the persisted config made every later Forge fail in that browser |
| 85 | guidancePageOrigin.test.js | 168 | C | ODQ §934.29: a hint belongs to its page of origin; dismissal survives a reload and a sign-in; one page at a time |
| 86 | heldDocketDurability.test.js | 293 | **R** | "dismissal writes nothing" is only safe because the docket is DURABLE — proved through the real persistence writer and reload |
| 87 | hydrateFromSaveAiInFlightReset.test.js | 84 | **R** | switching saves left the previous settlement's in-flight AI flags set, so the spinner never cleared |
| 88 | hydrateFromSaveAiReset.test.js | 109 | **R** | another town's daily-life prose leaked into the dossier and opened it in narrative mode |
| 89 | importReconciliationCommandTransaction.test.js | 452 | C | configured mode has exactly ONE writer (migration 184's RPC); offline refuses without mutation; local-only is a recoverable saga |
| 90 | importReconciliationRpcProjection.test.js | 247 | S | the deliberately-mixed camel/snake envelope shape preserved across transport → admission → projection |
| 91 | importTableEvents.test.js | 126 | C | V-17 commit path: typed records append as `source:'table'` at each record's tick; world-authored entries stay byte-identical |
| 92 | importUndoStackHygiene.test.js | 227 | **R** | a pre-import undo snapshot could restore the membership the import command had just replaced |
| 93 | instantWorldBinding.test.js | 218 | C | `runInstantWorld` orchestration: members persisted, campaign active, placements wired to real ids, realm left un-canonized |
| 94 | isTierAllowedFailClosed.test.js | 123 | **R** | the permission gate failed OPEN for any unranked value — typos, `undefined`, tampered input |
| 95 | lifecycleRoundTrip.test.js | 1988 | **E** [mutation] | ENFORCER E-C: no write orphaned by any path + a completeness registry over persisted families |
| 96 | lineageMemberBirthUndo.test.js | 419 | C | WR-3 member birth through the real advance / store / persistence / undo path |
| 97 | locksEngine.test.js | 254 | C | after the owner removed every lock control, the LIFECYCLE of a lock a save still carries, on every path it can still act through |
| 98 | mapSlice.undo.test.js | 143 | **R** | F6: the undo stack must not clone the heavy `fmgSnapshot`, and undoing a label must not revert geography or the camera |
| 99 | narrativeStampParity.test.js | 142 | **E** [mutation] | two stamp writers converge on one shared condition; the single-writer scan |
| 100 | npcOpsCovenant.test.js | 205 | C | the three typed NPC ops flow through the covenant, are COMMITTABLE, and work post-canon |
| 101 | npcStateRegenRebind.test.js | 325 | **R** | `worldState.npcStates` keys stay live across a reroll, so an existence census reads clean while the row is about the wrong person |
| 102 | npcVerbs.test.js | 476 | **R** | the WIRING, "which is where the estate's write-that-ghosts bugs live" — both halves reach the save, undo reverses both, scoped per campaign |
| 103 | onboardingNudge.test.js | 94 | C | the nudge channel round-trip on the REAL store; retirement is TOTAL; the nudge is session-only |
| 104 | operationRegistry.walker.test.js | 693 | **E** [uncovered] | Track K: every mutating store action is registered with an opType or listed exempt-with-reason (shrink-only) |
| 105 | operations.test.js | 95 | S | K-A: the existing ActionResult bridges to an Operation envelope with no action body touched |
| 106 | outbox.test.js | 563 | C | the durable outbox engine: op identity, supersede-dedup, bounded drain, backoff + park, Retry revive, mirror, boot replay |
| 107 | outboxColumnGate.test.js | 118 | **R** | a backed-off `applyEvent` retry could land after `destroy` and **RESURRECT a deleted settlement** |
| 108 | outboxOwnerScope.test.js | 304 | C | pending writes stay with the account that created them, never replay while auth is unresolved, survive an init race |
| 109 | pendingEditTransaction.test.js | 549 | C | G-1 queue truthfulness: complete admission, stable targets, freshness, ownership, per-item failure, receipts, idempotency |
| 110 | pendingEditsQueueReset.test.js | 106 | **R** | the queue survived every identity swap — **a rename staged for Mossbridge landed on Stoneford** |
| 111 | persistMerge.test.js | 79 | **R** | zustand's shallow merge let a returning user's persisted `config` replace DEFAULT_CONFIG wholesale — a silent config-shape fork between cohorts that reaches the generator |
| 112 | persistSaveUpdate.unify.test.js | 100 | **R** | a second, silent copy of the writer left the user seeing success while Supabase drifted |
| 113 | pinnedNpcRegenRemap.test.js | 191 | **E** [rationale → negative-control-executed] | a DM's pin silently transferred to whichever stranger the reroll put in the old slot, and rode to Supabase that way |
| 114 | previewPersona.test.js | 234 | C | ODQ §934.35: the preview role seats only the client's own gates; with DEV false it is INERT; nothing is claimed to the server |
| 115 | proposalUndoRing.test.js | 505 | C | R-1: the separate proposal-undo ring — restore, stepwise pop, separation by construction from the advance stack |
| 116 | pulseMutatorsInFlightGuard.test.js | 342 | **R** | a rules edit vanished and an undo popped its snapshot then evaporated, because Phase-2 commits from pre-yield clones |
| 117 | pulseUndoAdvertising.test.js | 584 | **R** | five registry rows advertised "Undo last pulse" while exactly ONE code path pushed a snapshot |
| 118 | regenPreservation.test.js | 217 | **R** | the reported defect end to end: `regenSection('npcs')` rerolled and PERSISTED, so a hand-written NPC's loss survived a reload |
| 119 | resolveDisplayTier.test.js | 35 | S | a dead branch dropped; the observable contract pinned so the simplification is proven behaviour-preserving |
| 120 | saveMoments.test.js | 124 | **R** | F34: the pricing-moment funnel never fired because no real save path called the dead action |
| 121 | savedSettlementPatchKeysWalker.test.js | 399 | **E** [mutation] | the source-derived census→allowlist coupling for `updateSavedSettlement` (the hand-copied census proved only list == list) |
| 122 | savedSettlementsHydration.test.js | 120 | C | late owner-A, anonymous and prior-same-owner responses must not fill the current cache |
| 123 | sessionEvictionLifecycle.pin.test.js | 89 | **E** [uncovered] | §7.3 M-9d synchronous single-session eviction initiation |
| 124 | setActiveSaveId.test.js | 69 | **R** | `activeSaveId` stayed null after a successful save: a false "not saved yet" warning, and the $2.99 rung inserted ANOTHER row |
| 125 | settlementDeletionAdvanceRace.test.js | 208 | **R** | fresh advances, resumes and catch-up cursor seeding must not start inside the deletion's pending-batch window |
| 126 | settlementSlice.canonRelationshipRipple.test.js | 448 | C | a non-party DM canon relationship event lands the pulse edge on the live campaign, and undo reverses it |
| 127 | settlementSlice.deityMount.test.js | 211 | C | the embed-on-assign bridge flips the religion subsystem gate — the mount→gate contract is wired |
| 128 | settlementSlice.faithActivation.test.js | 96 | C | W-F6 premium gate: latent pantheon activates for premium on save-open; free/anon load the save verbatim |
| 129 | settlementSlice.sentinelTierRegate.test.js | 114 | **R** | the promised re-gate was MISSING, so an anon capped at 'town' could mint a metropolis via Random or a custom population |
| 130 | settlementSlice.stressorBridge.test.js | 298 | C | the coup-wave seam that had zero tests: an authored stressor on a canon in-campaign settlement also registers as roaming |
| 131 | settlementSlice.test.js | 701 | **R** | the CRIT round-trips that keep saved campaigns truthful across reloads (phase/eventLog/systemState/canonizedAt/locks) |
| 132 | staffUnlockEntitlements.test.js | 299 | C | §934.28 staff unlock, table-driven over nine permission queries; the free/anon rows prove the unlock is not a giveaway |
| 133 | tableEventCommit.test.js | 480 | C | R-1 session ledger commit half: provenance on the receipt, flavor verbatim, effect + receipt survive a fresh reload |
| 134 | toggleSlice.scope.test.js | 148 | C | owner-queue #9: the four layers that keep global toggle scope from becoming a cross-settlement bleed |
| 135 | toggleSlice.servicesNormalize.test.js | 222 | **R** | toggles persisted under the OLD display-name key form are orphaned on read until `normalizeServicesToggles` remaps them |
| 136 | uiSlice.test.js | 48 | S | the transient UI-prefs bag: default closed, write-through, read-back |
| 137 | uncanonizeTombstone.test.js | 194 | **R** | `uncanonize()` wiped the canon eventLog irrecoverably while the registry advertised canonize as its undo token |
| 138 | undoFlatRowGuard.test.js | 339 | **R** | popping a flat library-row entry set `systemState = undefined`, dropped the record, and **PERSISTED the corruption** (probe-reproduced 2026-07-27) |
| 139 | updateConfigPatchValidation.test.js | 227 | C | R-3: every censused caller shape still applies; an all-unknown patch writes NOTHING; a mixed patch drops unknowns with a typed report |
| 140 | updateSavedCampaignPatchValidation.test.js | 213 | C | ANY unknown key refuses the WHOLE patch — structural row fields can no longer be clobbered through this door |
| 141 | updateSavedSettlementAllowlist.test.js | 125 | C | the 21-call-site census frozen as an allowlist; unknown keys are an atomic typed refusal |
| 142 | userEdits.actions.test.js | 296 | C | Tier 5.4 apply/revert wiring, EDITABLE_FIELDS gating, selector agreement with live store state |
| 143 | userRouteCommandTransaction.test.js | 338 | C | the bilateral vertical: ONE call carries BOTH endpoint projections and a confirmed answer lands on BOTH cached rows |
| 144 | versionHistory.test.js | 303 | C | P133/E-5 `recordSnapshot` + `revertToSnapshot` so a future refactor cannot silently break the version timeline |
| 145 | warCoalitionProposalLifecycleWr6.test.js | 511 | C | WR-6: pause/resume retains the pending question without join residue; undo restores the exact pre-approval coalition world |
| 146 | weakReporterRegistry.test.js | 75 | S | weak registry slot semantics: keyed install, unsubscribe, deterministic prune on publish |
| 147 | wizardNewsCommitReconcile.test.js | 75 | **R** | a confirmed table-event import landing during the advance's yield was silently clobbered by the wholesale commit |
| 148 | wizardSaveBinding.test.js | 83 | **R** | ⭐ **browser pass 3, 2026-09-19** — a save that does not bind leaves the wizard warning the settlement was never saved |

### The regression band, measured against the rest of the estate

Of the 56 `R` files, the ones whose silent loss is worst are concentrated in exactly the class the memory index names as the owner's most-bitten: **a write that survives one path and ghosts another** — #77 (keeping a settlement destroyed its history), #78 (§10.4 persist gap), #107 (a retry resurrected a deleted settlement), #110 (a rename landed on the wrong town), #118 (the loss survived a reload), #138 (the corruption was persisted), #147 (an import clobbered at the commit point). **None of the seven is enumerated. None owes a mutant today.**

That is the finding TOOL-6 was chartered to produce, and it is CONFIRMED by set difference, not by reading.

---

## 2. WHAT JOINING `ENFORCER_DIRS` WOULD OWE

### 2a. Already covered by name: 14 of 148

CONFIRMED by `enumerateInvariants(ROOT).filter(r => r.startsWith('tests/store/'))`:

| file | kind | label / ref |
|---|---|---|
| advertisedUndoArming.walker.test.js | mutation | `undo-arming/de-advertised updatePlacement re-advertises mapUndo` |
| deadOperationRatchet.test.js | mutation | `dead-op/unconsumed registry row joins the frozen ledger` |
| savedSettlementPatchKeysWalker.test.js | mutation | `patch-keys/call site writes an unadmitted key` |
| configDirectWriterExemptions.scan.test.js | mutation | `config-door/fifth direct draft writer` |
| lifecycleRoundTrip.test.js | mutation | `state-lifecycle/unregistered campaign family` |
| narrativeStampParity.test.js | mutation | `narrative/stamp re-inlined at the command lane` |
| editProseQueueSpine.test.js | mutation | `edit-prose/wired-subset lockstep drift` |
| campaignEntryParity.test.js | rationale | inline |
| campaignRuntimeCallerCoverage.test.js | rationale | inline |
| campaignSyncBookkeeping.test.js | rationale | inline |
| pinnedNpcRegenRemap.test.js | rationale | `negative-control-executed-2026-07-30` |
| commitPendingEditsTotality.walker.test.js | rationale | `self-proving-meta` |
| operationRegistry.walker.test.js | **uncovered** | — |
| sessionEvictionLifecycle.pin.test.js | **uncovered** | — |

**134 files would be new.** Every one of them owes a row of kind `mutation`, `rationale` or `uncovered`.

### 2b. `uncovered` is NOT a lawful landing zone for them — the walker fails closed against it

CONFIRMED (`tests/lint/mutationCoverageManifest.test.js:242-258`): the SHRINK-ONLY arm asserts `uncovered === manifest.uncoveredBaseline` **exactly**. Above fails; below fails demanding the win be banked. So 134 `uncovered` rows would red the gate unless `uncoveredBaseline` were raised 186 → 320.

**Is raising it mechanically possible?** Yes — the assertion reads the baseline out of the same manifest, so a lane that edits both numbers passes. **Is it lawful?** No, and the history is unambiguous. CONFIRMED by replaying every one of the 230 commits that touched the manifest:

```
95e494bdb 2026-09-19  186|inv=706|unc=186
3f6df23f1 2026-08-30  191|inv=646|unc=191
f9be5ded0 2026-08-30  194|inv=554|unc=194
35cc764d7 2026-08-30  195|inv=555|unc=195
5d839e198 2026-08-29  196|inv=558|unc=196
db649552b 2026-08-24  198|inv=563|unc=198
4dbef1d16 2026-08-03  199|inv=486|unc=199
```

**The baseline has moved seven times and fallen every time. It has never been raised.** The prose says so twice (the file header's "never a silent gap" and the failure message's "Never raise the baseline"), and the commit that admitted `tests/generators` says it a third time: *"`uncovered` is refused twice over (the file header, and the SHRINK-ONLY arm that pins the count EXACTLY at 191)"*.

⚠ **The one structural weakness, worth the chair's attention:** the baseline is enforced only by prose and review. Nothing in the suite is a ratchet **over the baseline number itself** — no test asserts `uncoveredBaseline <= <a frozen literal>`. A lane could raise 186 → 320 in the same commit that adds 134 `uncovered` rows and every gate would stay green. See §6 item ⛔-1.

### 2c. The precedent for admitting a whole tree: ODQ 764.2, measured

CONFIRMED from commit `3f6df23f17e2f748f35f0746b7c79ffb41ce3325` (2026-08-30) and its manifest diff:

```
BEFORE: {"uncovered":191,"rationale":289,"mutation":69} baseline 191 total 549
AFTER : {"uncovered":191,"rationale":386,"mutation":69} baseline 191 total 646
ADDED rows: 97 — all 97 kind:"rationale",
              ref "generators-tree-admitted-subject-coupled-2026-08-30"
```

Its message states the doctrine verbatim: *"Ninety-seven plants is not the honest answer… Ninety-seven hand-written paragraphs is not the honest answer either; it is ninety-seven chances to write something that stops being true. So the reason is stated once, as a property, and CHECKED."* The property is `subjectCouplingOf` — imports or scans production material **and** asserts — re-derived from disk per member on every gate run, with a membership floor (≥ 90) and a planted control that drives the same function the live arm calls.

### 2d. Does `tests/store` satisfy that property? YES — 148 of 148

CONFIRMED by running the estate's own predicate over the tree:

```
total 148   coupled 148   NOT coupled 0
```

Not one file would be refused by the admitted-tree arm's predicate.

### 2e. ⭐ But the transplant is REFUTED BY MEASUREMENT — the honest counterweight

The generators rationale's argument is *"the code a plant would mutate is the code they already execute."* I measured whether that sentence survives the move to `tests/store`. **It does not.** CONFIRMED, both trees, same scan:

```
tests/generators files: 112   with >=1 vi.mock of src/:  0   with ZERO vi.mock: 112
tests/store      files: 148   with >=1 vi.mock of src/: 86   with ZERO vi.mock:  62
```

**Not one of the 112 generators suites mocks anything at all.** The paragraph that admitted that tree is true of it by construction, and measurably so. **58% of `tests/store` mocks at least one `src/` module** — `savesService`, `campaignService`, domain modules, four and five at a time. For those suites a plant in production code may land in a module the suite replaced with a double, and the gate stays green while the invariant is gone: the exact `HZ-MUTANTNOOP` shape the manifest exists to close.

`subjectCouplingOf` cannot see this. It checks for an import and an `expect(`, not for whether the imported module survives to run — so it returns `coupled: true` for a file that imports `src/store/x.js` on line 3 and `vi.mock`s it on line 4.

⛔ **Copying the generators paragraph onto `tests/store` would move a sentence that is 112/112 true into a tree where it is at best 62/148 true.** The admission's rationale must be its own paragraph with its own checked predicate.

### 2f. What a convicting mutant looks like, and what one costs

CONFIRMED anatomy, from the four existing `tests/store` plants (`scripts/mutation-sweep.sh:604-679`). One plant is:

* a **4–10 line comment block** giving the defect class and the anchor's history;
* **one `perl -0pi -e "s/…/…/" <production file>`** line — the smallest edit that removes the invariant;
* **one `check_caught "<label>" <file> "<gate cmd>" [expected title]`** line;
* **one manifest row** `{"kind":"mutation","label":"<same label>"}`;
* **one `MUTATED_FILES` row** if that production file is not already guarded (enforced bidirectionally by the DIRTY-GUARD TOTALITY arm).

So the unit cost is **3 files touched, ~10 lines, 1 manifest row** — plus the authoring work of finding an anchor that is (a) a real invariant remover, (b) stable across refactors, (c) matched by the perl pattern today (a stale anchor writes nothing and the sweep grades it `BROKEN`, by design).

Smallest plausible mutants for the ten highest-value uncovered regression suites (all **PLAUSIBLE** — no plant was written or executed):

| file | production target | smallest convicting mutation |
|---|---|---|
| editActionPersist.test.js | `src/store/settlementSlice*` | delete the `updateSavedSettlement` call from `applyUserEditAction` — the edit lives in memory and ghosts on reload |
| draftTimelineTransfer.test.js | `src/store/…bindActiveSaveId` | drop the draft→save `versionHistory` hand-off, restoring `versionHistory: []` |
| outboxColumnGate.test.js | the outbox `kind` derivation | re-key `kind` on the raw partial keys, so `destroy` and `applyEvent` stop sharing a supersede |
| pendingEditsQueueReset.test.js | one of the four identity-swap sites | remove `pendingEditsQueue` from ONE reset (the 3-of-4 case is the real regression shape) |
| undoFlatRowGuard.test.js | `undoLastEvent` | restore the unconditional `popped.beforeState` assignment |
| pulseMutatorsInFlightGuard.test.js | one gated pulse mutator | remove the `advanceInFlight` guard from exactly one mutator |
| persistMerge.test.js | the custom persist merge | swap the deep merge back to a shallow spread for `config` |
| isTierAllowedFailClosed.test.js | `isTierAllowed` | return `true` for an unranked tier (restore fail-open) |
| campaignMembershipIdNormalization.test.js | `campaignSettlements` | drop the `String()` normalization from ONE of the two resolvers |
| wizardNewsCommitReconcile.test.js | `reconcileWizardNewsForCommit` | return the pre-commit list unchanged |

**Cost to plant all ten:** ~3 files × ~100 lines + 10 manifest rows, plus ≤10 new `MUTATED_FILES` rows. **Cost to plant all 134: not creditable** — see §3(a).

---

## 3. THE THREE ALTERNATIVES, PRICED

### (a) Add `tests/store` to `ENFORCER_DIRS` wholesale

**Mechanical consequences, all CONFIRMED:**

| what moves | from | to |
|---|---|---|
| `enumerateInvariants(ROOT).length` | 706 | **840** |
| manifest `invariants` rows | 706 | **840** (134 new) |
| `mutationCoverageManifest.test.js:81` vacuity floor | `>= 686` | must tighten to **840** (the file's own law: *"Floors TIGHTEN toward reality"*) |
| `tests/scripts/baseStateCapsule.test.js:369` floor | `> 440` | still passes, but is now 400 stale |
| `ADMITTED-TREE CLAIM` arm (`:206`) | hard-codes `rel.startsWith('tests/generators/')` | **reds by name for every `tests/store` row citing the ref** |
| `uncoveredBaseline` | 186 | **must stay 186** (see §2b) |

**So the shape of the work is:**

1. one line in `ENFORCER_DIRS`;
2. **134 manifest rows**, inserted SURGICALLY (`PACKET_MANIFEST.json:31159` states the standing law: *"⛔ SURGICALLY, never re-serialised whole"*; the object is not sorted and no test enforces an order);
3. a **new shared rationale ref** + its paragraph, and a **new `ADMITTED_TREE_REF`-style constant** (`tests/lint/mutationCoverage.shared.mjs`);
4. **a second admitted-tree arm** in the meta-test (or a generalisation of the existing one from a hard-coded prefix to a per-ref tree map) + its own **membership floor** + its own **planted control** — the existing arm's control drives the same function the live arm calls, and a new arm owes the same;
5. the vacuity floor 686 → 840;
6. honestly, **a second predicate** answering §2e, or a written, measured exception list for the 86 mocking files.

**Priced: ~6 files, ~140 manifest rows, 2 new test arms, 1 new predicate. One dock, gate-heavy, no sweep-runtime cost** (zero new plants). The sweep job's 20-minute CI ceiling is untouched.

**Does the ratchet forbid it?** No — the ratchet forbids **`uncovered`**, not admission. The precedent (§2c) shows a whole tree entering on rationale rows with the baseline UNMOVED. **It fails closed against a declared-uncovered baseline and fails open against a predicate-backed shared rationale.** That is the designed asymmetry.

### (b) Extend `NAME_PATTERN` with a regression-naming token

CONFIRMED, repo-wide, for each candidate token (new files it would enumerate that are not enumerated today):

| token | new files repo-wide | of which `tests/store` | which |
|---|---|---|---|
| `participation` | **1** | 0 | `tests/domain/roadsParticipation.test.js` |
| `writeBase` / `write-base` | **0** | 0 | — (EM-B1k's file does not exist yet) |
| `regression` | **1** | 0 | `tests/domain/warRulingsWr5Regressions.test.js` |
| `durability` | 1 | 1 | `heldDocketDurability` |
| `transaction` | 4 | 4 | `canonEventCommandTransaction`, `importReconciliationCommandTransaction`, `pendingEditTransaction`, `userRouteCommandTransaction` |
| `convergence` | 6 | 3 | + `aiDataOutboxConvergence`, `destroyWriterConvergence`, `factionRenameConvergence` |
| `undo` | 13 | 7 | across domain/joins/store/ui |
| `guard` | 14 | 6 | across build/components/domain/lib/store/ui |
| `persist` | 9 | 5 | across build/domain/lib/store |
| `lifecycle` | 22 | 3 | across components/domain/joins/lib/property/store |
| `fence` | 26 | 3 | across lib/property/store |
| `gate` | **43** | 7 | across nine trees |

**Priced as the brief poses it (`participation|writeBase|regression`): 1 line in the shared module, 2 manifest rows today, and EM-B1k's file caught the moment it lands.** Cheapest option on the board by an order of magnitude.

⚠ **But it is the option that most nearly contradicts a standing ruling.** The shared module's own KNOWN EDGES say: *"prefer fixing the name over widening the pattern."* A token minted to catch one named file is a pattern widened for a filename, not for a class. The blast radius is also non-linear: `gate` would conscript 43 files across nine trees in one line, and every one of them would owe a row that same commit.

### (c) A per-file opt-in marker (a header comment the walker honours)

**Does the walker support one today? NO — CONFIRMED.** `enumerateInvariants` (`mutationCoverage.shared.mjs:65-75`) filters on the relative path and the basename only. It never opens a file. A repo-wide grep for a marker convention returns nothing:

```
$ grep -rn "@mutation|mutation-exempt|@invariant|@enforcer|coverage-exempt|@no-mutation" tests/ scripts/
(no output)
```

The machinery is *adjacent* — `subjectCouplingOf` in the same module does read source text — but the enumerator does not, and `premortem-triggers.mjs:1147-1158` re-imports the rule as `claims(path)`, a path-only predicate, so a source-reading marker would change that consumer's contract too.

⛔ **And the estate already HAS a per-file opt-in — the filename.** CONFIRMED, in both directions:

* **Opt IN** — `docs/EPISTEMIC_PREVENTION_PLAN.md` Wave EP-3: `tests/generators/effectReachability.coverage.test.js` — *"('coverage' token is deliberate — **it opts the file into the E-A enumeration rule**)"*.
* **Opt OUT** — `docs/DESIGN_AI_CAPABILITY_LADDER.md` L-2b: the file was named `…Agreement` and not `…Parity` precisely because *"E-A's NAME_PATTERN conscripts basenames containing `parity|contract|golden|coverage|freshness|pin|…` into the manifest spine even OUTSIDE the seven enforcer dirs"* — measured red/green both ways, with *"rename + manifest entry at a future fold if wanted in the spine"* recorded as the route in.

**Priced: building (c) is ~30 lines in the shared module + a new arm + a control + a `premortem-triggers` contract change — and it would install a SECOND opt-in channel beside a working one, against a written preference.** I do not recommend it and I do not think the chair should spend a slot on it.

---

## 4. RECOMMENDATION

**Do (b) narrowly AND (a), in that order, as two separate docks — and do not do (c).**

**Now, in EM-B1k's own dock (one line, no new machinery): name the cure suite so it opts itself in.** `tests/store/participationWriteBase.contract.test.js` — or `…Pin.test.js` — is enumerated by today's rule with **zero changes to any shared module**, and it is the exact mechanism EP-3 chartered and L-2b measured. The file then owes one manifest row, which EM-B1k writes in its own commit alongside its cure. The same applies to EM-B1k2. **This is the cheapest correct action available and it contradicts nothing.**

**Reason to prefer the rename over minting a `participation|writeBase|regression` token:** the token catches two unrelated files in `tests/domain` today and zero in `tests/store` — it does not move the class, only the one file, and it does it by widening a pattern the module's own note says to prefer not widening. The rename moves the same one file, costs one character-string decision, and leaves the rule untouched.

**Then, as its own chartered dock: admit `tests/store` to `ENFORCER_DIRS` (option a).** The reason is the §1 measurement, not tidiness. `tests/store` holds **56 regression suites**, seven of which pin the owner's most-bitten bug class by name, and **134 of 148 files are invisible to the guard-of-guards** — a ratio (90.5%) worse than the 759.4 finding that admitted `tests/generators` (97 of 108 = 89.8%). The structural case is the same case, one tree over, and it is slightly stronger.

**⛔ But the admission must NOT copy the generators paragraph — that is refuted by measurement, not by suspicion.** §2e: **0 of 112** generators suites mock anything; **86 of 148** store suites mock a `src/` module. "The code a plant would mutate is the code they already execute" is 112/112 true of the tree it was written for and at best 62/148 true of this one. The rationale that admits `tests/store` must be **its own paragraph with its own checked predicate** — at minimum `subjectCouplingOf` plus a second arm that sees mocking, or an explicitly measured named-exception list. Writing that predicate is the substance of the dock; the 134 rows are clerical beside it.

**Sequencing, and why:** the rename lands with EM-B1k and unblocks nothing else; the admission is a gate-heavy dock that touches `ENFORCER_DIRS`, a floor, two test arms and 134 manifest rows, and `scripts/mutation-coverage-manifest.json` is a high-contention file (the packet manifest reserves it by name, §6 ⛔-4). Running them together would put a one-line naming decision behind a multi-arm build.

**What I would NOT do:** raise `uncoveredBaseline`. In seven moves over two months it has only ever fallen. Admitting a tree on `uncovered` rows would be the first raise in the register's life, and it would be recorded forever as the commit that did it.

---

## 5. QUESTIONS ONLY THE CHAIR CAN ANSWER

1. **Is EM-B1k's suite still unnamed?** It does not exist at `32602dc60`. If the filename is not yet fixed, the whole of §4's first recommendation is free. If EM-B1k already landed elsewhere under `participationWriteBase.test.js`, the rename is a packet amendment and the chair owns whether that re-opens a sealed dispatch.
2. **What is EM-B1k2's suite called, and is it in the same position?** The charter names it but I cannot see it. If it is also a `tests/store` regression suite, the same one-line cure applies and should be decided once for both.
3. **Does a rename count as "fixing the name" (module-sanctioned) or as a behaviour-visible change to a sealed packet?** The precedent (EP-3, L-2b) is clear on the mechanism but silent on doing it to an in-flight packet.
4. **Is `tests/store` admission a TOOL lane or an EM lane?** It touches `ENFORCER_DIRS`, two meta-test arms, a vacuity floor and 134 manifest rows, none of it product code — but it moves the enforcement spine's shape, which reads like architecture.
5. **Should the admission be `tests/store` alone, or `tests/store` + the other regression-dense trees?** `tests/domain` already carries 44 enumerated rows out of a much larger tree; `tests/lib`, `tests/joins`, `tests/components` carry near-nothing. 1944 of 2650 test files are invisible to the guard today. Admitting one tree at a time is the precedent; the chair may want the sequence declared once rather than re-argued per tree.
6. **May the new admitted-tree predicate be STRICTER than `subjectCouplingOf`** (e.g. refuse a file that mocks its own subject), accepting that a handful of `tests/store` files would then need individual rationales or plants? That trade — a few hand-written paragraphs for a predicate that is actually true — is a judgment I should not make.
7. **Is the missing ratchet over `uncoveredBaseline` (§2b, ⛔-1) in scope for this lane's dock, or its own item?** It is a five-line test and it closes the one hole that would make option (a) abusable.

---

## 6. ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **⛔ THE SHRINK-ONLY RATCHET HAS NO RATCHET OVER ITSELF.** `tests/lint/mutationCoverageManifest.test.js:242-258` compares the uncovered count to `manifest.uncoveredBaseline` — a number that lives in the same file the count is derived from. Raising both in one commit is green. The "never raise" rule exists only in prose (the file header, the failure message, and the 764.2 commit body). **Cure, ~5 lines:** a frozen literal ceiling in the test (`expect(manifest.uncoveredBaseline).toBeLessThanOrEqual(186)`), lowered by hand exactly as the baseline is. Wants a slot.
2. **⛔ `tests/scripts/baseStateCapsule.test.js:369` carries a stale vacuity floor: `expect(picked.length).toBeGreaterThan(440)` against a live value of 706.** That is 266 files that could be dropped from the enumeration while this guard goes on passing — the exact rot the sibling floor in `mutationCoverageManifest.test.js:81` was re-measured for on 2026-09-19 (630 → 686) and on 2026-09-18 (61 → 121). The sibling was re-measured; this one was not. Wants a slot: re-measure to 706 (or to 840 if `tests/store` is admitted).
3. **⛔ The ADMITTED-TREE arm is hard-bound to one tree by a string literal.** `mutationCoverageManifest.test.js:206` — `if (!rel.startsWith('tests/generators/'))` — so any second admitted tree reds by name until the arm is generalised. Not a defect today; it is the precise thing option (a) must change, and it should be changed to a per-ref tree map rather than a second copy of the arm.
4. **⛔ `docs/implementation/PACKET_MANIFEST.json:30377` records a MEASURED determination that admitting `tests/store` would falsify.** EM-B3a's note reads: *"Owes NO mutation-coverage row: tests/store is not an ENFORCER_DIR and the basename trips no NAME_PATTERN token … measured at a41a0e109."* Its file (`decreeRegistryPersistence.test.js`) has landed, so nothing breaks — but any packet still in flight carrying the same sentence would have its recorded measurement invalidated by the admission. **A `tests/store` dock owes a sweep of `PACKET_MANIFEST.json` for that sentence before it lands.** I found one live instance; a full sweep is a lane task, not a recon read.
5. **⛔ The sweep's 20-minute CI ceiling is undeclared anywhere near the plant list.** `.github/workflows/ci.yml:480` sets `timeout-minutes: 20` for 121 plants, each of which runs its gate TWICE (mutated + the attribution re-run on the clean tree). Nothing in `scripts/mutation-sweep.sh` says what the remaining headroom is, so the next lane to add plants is guessing. PLAUSIBLE arithmetic: ≈ <10 s per plant average today. **Wants a slot:** record the measured wall-clock of the last green weekly run beside `MUTATED_FILES`, so a plant-adding lane can price itself.
6. **⛔ `subjectCouplingOf` cannot see mocking — MEASURED, and it is not a live defect today (§2e).** It returns `coupled: true` for a file that imports `src/store/x.js` on line 3 and `vi.mock`s it on line 4. I measured the admitted tree to find out whether the predicate is currently papering over anything: **0 of 112 `tests/generators` files mock anything at all**, so the paragraph is true of its tree and the arm is sound where it stands. The hole is prospective, not live. **It becomes live the moment that predicate is pointed at a mocking tree** — 86 of 148 in `tests/store`. Not a slot on its own; it is the design constraint on option (a)'s predicate, recorded here so it is not re-discovered.
7. **⛔ Two `tests/store` rows sit at `kind: "uncovered"` and have since before this tip** — `operationRegistry.walker.test.js` (693 lines, Track K's structural-prevention walker: every mutating store action registered or exempt) and `sessionEvictionLifecycle.pin.test.js` (89 lines, §7.3 M-9d). The first is one of the most load-bearing walkers in the store tree and it is a declared gap. **Upgrading either banks a baseline point (186 → 185).** Wants a slot, independent of everything above.
8. **⛔ `NAME_PATTERN`'s known over-inclusion is undocumented in the manifest itself.** The shared module's KNOWN EDGES note the `…SpinKeyframe…` → `pin` class, but the manifest carries no marker distinguishing a row that exists because a file is a real enforcer from one that exists because its basename contains a substring. A reader auditing the 186 uncovered rows cannot tell the two apart without re-deriving. Low priority; recording it because it is a known-and-accepted edge that will re-surprise the next auditor.
9. **⛔ `tests/store/participationWriteBase.test.js` is named in the TOOL-6 charter but does not exist at the tip.** Flagging this as a possible charter-vs-tree drift rather than a finding: either EM-B1k landed on a branch this lane may not read, or the charter names a file EM-B1k has not written yet. The chair should reconcile which, because §4's first recommendation is free in one case and a packet amendment in the other.

---

## 7. LABELLING

**CONFIRMED** (command + output in this report): the enumeration rule's contents and behaviour; 2650 / 706 / 1944 / 148 / 14 / 134; 706 rows with zero drift both ways; kind distribution; `uncoveredBaseline = 186`; the seven-step falling baseline history over 230 commits; the ODQ 764.2 admission's exact +97 rationale rows with the baseline unmoved; 148/148 passing `subjectCouplingOf`; 86/148 `tests/store` and 0/112 `tests/generators` mocking a `src/` module; the absence of any opt-in marker convention; the two standing rulings (EP-3 opt-in-by-name, L-2b opt-out-by-name); every token's repo-wide new-file count; the four `tests/store` plant anatomies; the sweep's CI gating and 20-minute timeout; the absence of `participationWriteBase.test.js`.

**PLAUSIBLE** (reasoning only): the band assignment of each file (read off CONFIRMED docblock text, but the R/C/S line is judgment); the ten mutant sketches in §2f; the per-plant sweep runtime arithmetic; the claim that a stricter predicate would leave "a handful" of store files needing individual rows.

**NOT MEASURED:** no gate was run, so no claim here is backed by a green or red suite. Whether any of the 134 files would actually red under a planted mutation is, by construction, exactly what this lane could not test.
