---
name: ""
metadata: 
  node_type: memory
  title: Fix wave 2 — store & engine truth single-sourced (shipped)
  date: 2026-07-20
  branch: claude/composite-r4
  commit: 8dfd2aed
  base: 257b0eed
  status: "committed, NOT folded / NOT pushed (owner-gated)"
  tags: 
    - phantom-siege
    - warStatus
    - wizardNews
    - deposit-and-consume
    - map-undo
    - single-source
    - fix-wave-2
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T00:04:16.779Z
---

# Fix wave 2 — store & engine correctness @ 8dfd2aed

Three class-kills + one contradiction resolved-by-#1, on claude/composite-r4 (base
257b0eed, wave-1 FMG-XSS tip). ONE commit, 6 files, 256 insertions. Gate fully green;
closure 1,038,424 <= 1,040,000. NO golden shift (byte-identity goldens proved).

## Why (the three defects)
- **#1 Phantom siege (idx32/idx20).** `src/domain/display/warStatus.js` had a LOCAL
  `confirmedWarFronts` that admitted any `status:'confirmed'` war_front. A merely-hostile
  pair mints a `war_front` in BOTH directions off the relationship bundle
  (`evidence:[{source:'relationship_label'}]`, no army) — `channelIdFor` keys on
  (type,from,to) so it COLLIDES with the war-layer siege id. Result: `liveSieges` /
  `settlementWarStatus` reported a siege + `atWar` with zero deployments, across every
  consumer (map overlay, chronicle, realm arc, PDF, autonomy signals, town dress).
- **#2 wizardNews clobbered by worker advance (idx33).** `applyWorldPulseResultToState`
  (campaignPulseHelpers.js:161) commits `result.wizardNews` WHOLESALE from a clone lifted
  BEFORE the advance's in-flight yield. A confirmed table-event import
  (`importTableEvents` — the ONE ungated wizardNews writer) landing during the yield was
  silently dropped when the worker result committed.
- **#3 Map undo survives campaign switch (idx35).** `mapSlice` `replaceMapState` /
  `resetMapState` swapped `mapState` but left `mapUndoStack`/`mapRedoStack` intact → Undo
  in campaign B injected campaign A's placements + secret markers (cross-campaign leak).

## How each was fixed (the chokepoint)
- **#1:** `confirmedWarFronts` now gates each channel through the CANONICAL
  `isLiveWarFront` (`src/domain/worldPulse/warFrontReads.js`) — the SAME predicate
  warDeployment/occupation/martialReadiness/settlementStrategy already use. Display can no
  longer diverge from engine siege detection. War-layer (`hasWarLayerEvidence`) and
  bare/legacy fronts still read as sieges; pure `relationship_label` fronts do not.
  **This also resolved idx20** — strategy already used isLiveWarFront; war display now agrees.
- **#2:** New SHARED helper `reconcileWizardNewsForCommit(resultFeed, liveFeed, preIds, now)`
  in `campaignAdvanceSession.js` (exported, unit-tested). Folds back ONLY entries whose id
  is NEW since the pre-advance snapshot (`preAdvanceNewsIds` / `preResumeNewsIds`), never
  the pre-existing entries the advance's cap evicted. Called at the pre-commit point of
  BOTH paths: `runAdvanceCampaignWorld` (manual + setActiveCampaign auto-catch-up) AND
  `runResolveIntervalMajors` (paused-resume). Non-concurrent advance is byte-identical
  (empty landed set returns the feed BY REFERENCE); idempotent (appendWizardNewsEntries
  dedups by stable id). Chose MERGE over the store's usual in-flight GUARD because the DM's
  confirmed import must not silently fail during a catch-up, and wizardNews has stable ids.
- **#3:** Both `replaceMapState` and `resetMapState` now clear `mapUndoStack`+`mapRedoStack`.
  AnnotateToolbar's Undo `canUndo = mapUndoStack.length > 0`, so it disables automatically.

## How to apply / hazards for successors
- **THE read-side siege gate is `isLiveWarFront` (warFrontReads.js).** Any NEW war/siege
  read — display or engine — MUST route through it, never re-check `status==='confirmed'`
  by hand. A relationship-minted front (`relationship_label`, no `war_layer*` evidence) is
  NOT a siege; a war-layer or bare/legacy front IS. warStatus.js is DISPLAY (pure
  projection) → not itself golden-pinned; display→worldPulse imports are layering-legal
  (armyStrength/credibilityRead already do it).
- **wizardNews wholesale-commit sites are the clobber habitat.** `applyWorldPulseResultToState`
  does `campaign.wizardNews = ensureWizardNewsFeed(result.wizardNews)`. Any future advance/
  resume commit path that lands during a yield must run `reconcileWizardNewsForCommit`
  first, or it will drop concurrently-appended entries. wizardNews entries HAVE stable ids
  (table events: `id` set by tableEventToNewsEntry) so merge-by-id is safe.
- **`reconcileWizardNewsForCommit` is a plain exported helper, NOT a store action** — no
  operationRegistry entry needed (precedent: `buildPausedAdvanceCursor` in the same file).
- **warStatus is NOT in the first-paint closure** (sentinels 'near peace' / 'occupation
  authority' absent from all 7 chunks; it rides a lazy chunk). campaignAdvanceSession is
  lazy (loadWorldEngine). So this wave's only eager delta was mapSlice's 4 array-clear
  statements (~tens of bytes) → ~0 closure delta.

## Deferred (owner-gated, documented not dropped)
- **idx21 (tier-collapse vs population narration)** and **idx19 (durable memory drops
  turning points)** are engine-internal narration/retention behaviors. Every engine history
  ledger (populationHistory/lifecycleHistory/calamityHistory/selectedOutcomes/recentIncidents/
  relationship history) uses recency-slice (`.slice(-N)`/`.slice(0,N)`) BY DESIGN. The
  player-facing wizardNews cap (`capEntries`, MAX_ENTRIES=240) is ALREADY significance-aware
  (major-arc head rescue). "Fixing" idx19/idx21 would shift same-seed simulation output =
  owner-gated tuning per THE PROMISE, and needs the exact audit reproduction. Left for a
  dedicated owner-signed tuning pass. Do NOT force these in a display/store correctness wave.

## Gate receipts (verbatim summary)
build OK (307 prerendered routes) · closure 1,038,424 <= 1,040,000 (headroom 1,576) ·
domain-strict 0/ceiling 0 · tsc full exit 0 (0 lines) · eslint 6 files exit 0 · focused +
touched-area suites all green (warStatus consumers, chronicle/realm/gallery/autonomy/pdf,
advance-path incl. advanceInFlightMutatorGuard/pauseResume/catchUp) · byte-identity goldens
22 passed (advanceWorkerByteIdentity + worldSnapshotCache + supplyWebWarfare + chroniclersLetter
+ wizardNewsRetention) — no golden re-recorded · python NUL scan 0 bytes.

Foreign stash@{0} (analytics-intelligence-layer) untouched throughout.
