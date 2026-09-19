---
name: ""
metadata: 
  node_type: memory
  type: program-state
  lane: VISION WAVE — LANE V-B (displays)
  worktree: .claude/worktrees/minifold
  branch: claude/composite-r4
  base: 299f2843 (V-A)
  tip: a9caa573
  date: 2026-07-20
  status: "SHIPPED (dark/inert per item; NOT folded, NOT pushed — manager folds)"
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T16:30:10.550Z
---

# VISION LANE V-B SHIPPED — the chronicler writes, the years replay, the causes trace, the town wears its history

⭐ All 5 items + 2 letter riders built on claude/composite-r4 (minifold), 6 commits, base 299f2843 (V-A):
- **V-10 THE CERTIFICATE** @ `7fba38ac` — certification manifest schema (hand-rolled `{ok,errors}` validator, closed SOAK_PROPERTY vocab, status↔soak lockstep) + inert-honest empty manifest + WorldCertificationPanel on the RealmDashboard. Claims-parity pin `[claims-parity-3]`.
- **V-4 THE CAUSE-WALK** @ `3b50f21e` — `recordedAncestors` (the backward mirror of recordedDescendants in chronicleGraph.js) + `domain/display/causeWalk.js` (backward BFS over worldState.spatialLedgers.provenance) + CauseWalkPanel "Trace the causes" in AdvanceReport. SECRETS SEAM: covert hops redacted for non-DM (`receiptIsCovert` checks nested metadata/proposalPayload/stressor/institutionPatch).
- **V-3 THE TIMELAPSE** @ `7440e9cd` — `domain/display/timelineTrack.js` (buildTimelineTrack/frameAtTick from pulseHistory) + TimelapseLayer (travelers-overlay idiom on MapOverlay) + TimelapsePanel scrubber (new RealmInspector section).
- **V-15 THE AGED MAP** @ `6ebb1464` — `domain/townMap/ageOverlay.js` (deriveAgePortrait from the urbanFabric mirror via fabricRead + ageOverlayOps, the groundDress op-emitter idiom, decadeDecay half-life 520wk) + SettlementMapAgeOverlay leaf + "Show the years" toggle in SettlementMapEditControls. DERIVED-ONLY — buildTownMapDrawList untouched (v1/v2/style/panorama goldens byte-identical, proven).
- **V-2 THE CHRONICLER'S LETTER + R-16/R-17** @ `71548631` (culminating commit, canonical subject) — `domain/display/chroniclersLetter.js` (deterministic composer + letterToPlainText) + ChroniclersLetterPanel (Letter section). R-16 world-deepened (flag delta vs flagsSeen). R-17 export = downloadBlob text.
- **ratchet cleanup** @ `a9caa573` — see hazard #3 below.

## Why / how-to-apply (load-bearing for the fold + future display waves)
- **Closure 1,025,451 (Δ +717 eager from V-A baseline 1,024,734; budget 1,040,000, headroom 14,549).** Every composer/panel/overlay/derivation is LAZY (grep-confirmed no eager leak). The +717 is IRREDUCIBLE persisted-state cost: V-10 +30 Rollup reshuffle (a new lazy edge); V-3 +115 the shared `timelapseTick` store field + setter (eager mapSlice); V-2 +572 the `markCampaignLettersRead` action + lastReadTick/flagsSeen fields + the operationRegistry entry (eager campaignSlice). The V-A ~0 held only because it added NO store surface. When folding, re-pin the closure ratchet to the MEASURED 1,025,451, not 1,024,734.
- **timelapseTick** (mapSlice top-level, null=live) is the SHARED V-3↔V-15 coordination contract: the realm timelapse overlay AND the town aged-map overlay both read it; the town "Show the years" toggle sets it to the live week. Transient UI, not persisted, not worldState.
- **V-2 persisted state (lastReadTick + flagsSeen):** normalized at the `migrateCampaign` chokepoint (legacy⇒0/null) AND initialized in `createCampaign` (the import init site). Persist=cloneJson (round-trip pinned). `undoLastPulse` restores worldState/regionalGraph/wizardNews only — never these top-level fields (verified + pinned). The composer is robust to lastReadTick > currentTick (empty diff) which undo can produce.

## ⚠️ Hazards discovered (each cost real time this lane)
1. **SettlementMapPane is at 598/600 lines** (component cap 600, skipComments+skipBlankLines) — only 2 lines of headroom. New town-map surface must ride a lazy leaf + a 1-line mount (V-15 did: import + `<SettlementMapAgeOverlay/>`). To measure a file's exact eslint count: `npx eslint --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' <file>`.
2. **New store ACTION lifecycle:** a mutating action (references `set`) MUST be in operationRegistry or it reds `tests/store/operationRegistry.walker.test.js`. Pure-UI transient setters → EXEMPT_OPERATIONS (setTimelapseTick; bumped EXEMPT_CEILING 71→72, the evictSession-precedent documented bump). Persisted campaign writers → OPERATIONS mechanical (markCampaignLettersRead, like appendCampaignChronicle; OPERATIONS 164→165). EITHER path needs `npm run gen:compendium-data` (compendiumDataFreshness + the op-walker catch a skip).
3. **⚠️⚠️ Ratchet tests the per-item strict/tsc/ESLint gates DO NOT cover — RUN AT LANE END** (they are VITEST tests, not eslint rules): `tests/lint/domainAnyCastBaseline` (a `@type{any}`/`*` in a NEW src/domain file reds it — I left one in chroniclersLetter.js), `tests/lint/rawColorLiteral` (raw `#hex` anywhere in src/ grows a budget — route through swatch tokens / `swatch['#HEX']`), `tests/lint/mapPaletteSingleSource` (canonical relationship hues #1a5a28/#8b1a1a raw in components/map), `tests/design/deepCraftKillList` (borderRadius shrink-only ceiling — **and it counts COMMENT lines**, so a comment containing "borderRadius" trips it). All five were caught only by the lane-end constitution shard (tests/design+lint+docs+joins) and fixed in `a9caa573`. ADD THESE TO EVERY DISPLAY-WAVE LANE GATE.
4. **Expected/flake reds:** the 3 parked golden families (generatorGoldenMaster, beliefMapGolden, worldpulseDeityGolden — 4th is pdf goldenViewModel) fail on this lineage regardless (my diff touches NO generator/kernel). `tests/store/advancePauseResume` timed out (70s) under concurrent-shard machine load = FLAKE (passes 9/9 isolated) — the documented isolation-re-run rule.

## Judgments (vetoable — recorded in the commits)
- V-3: ONE shared `timelapseTick` store field over per-surface React context (realm+town are disjoint trees). Cost ~115 B eager.
- V-15: DERIVE at draw time (separate overlay) over populating model.reserved.scarHistory (which is hashed by the town-map goldens). Keeps every existing golden byte-identical.
- V-4: AdvanceReport passes seesSecrets=true (owner-only realm inspector, live worldState, never shared payload); a future non-owner mount must pass false (redaction pinned).
- DEFERRED (recorded): adoption telemetry on the V-B surfaces — a new event NAME costs eager and no existing usage event fits; deferred per the adoption rider's "report if unavoidable." AI dressing of the letter/oracle rides existing metered surfaces (not built here).

## Gate at lane end (all green modulo the expected/flake reds above)
domain-strict 0 · full typecheck 0 · full lint 0 errors · verify:dist green (closure 1,025,451 ≤ 1,040,000) · tests/components+ui 1390 green · tests/store+property 782 green (4 reds = 3 parked + 1 flake) · design/lint/docs/joins green after a9caa573 · anyCast unchanged · existing town-map goldens byte-identical.
