# ENGINE-MERGE-2 — the engine lane merged onto rung 1's final tip, its registers re-derived, its proofs re-run (2026-11-07)

**Branch:** `lane/engine-merge-2026-11-06`, from `0604582dd` (the first engine merge, recorded in
[`ENGINE_PR_2026-11-06.md`](ENGINE_PR_2026-11-06.md)). Seat: ENGINE-MERGE-2 (Opus 5.5), a child
session of the cloud chair. **Nothing deploys from this branch; `VITE_ENGINE_REMOTE` stays OFF;
the four owner steps in DEPLOY.md stay the owner's.** No full check was run and nothing was
pushed through the hook (the brief); every push is `--no-verify` to the lane branch.

## 1. The merges

| Merge | Rung 1 at | Conflicts | Resolution |
|---|---|---|---|
| `a62c5081d` | `77bfd3535` (646 commits over the engine base) | six, all generated registers: the five `_shared` bundle metas (`aiCharter`, `aiGrounding`, `aiOutputSchema`, `analyticsEvents`, `intentAtlas`) and `tests/lint/.lighting-census-baseline.json` | rung 1's side taken, then each re-derived through its own door (§2) |
| `51b254cc3` | `76febf9b0` (= `1bff51c6d`, the chair's message, + one docs record) | none | `1bff51c6d` anchors the two `modeSpeedsWy1` negatives (rung 1's own red, see §4); `76febf9b0` is ODQ / HANDOFF / REGISTER-VII docs. No register moved. |

No source conflict. Three files both sides touched auto-merged with **disjoint hunks**, each read on
both sides: `vite.config.js` (the engine lane's `engineAbsentWhenRemote` plugin; rung 1's
`FIRSTPAINT2_LAZY_DOMAIN` and its `coherence-lazy` chunk), `tests/build/generationWorkerLazy.test.js`
(the seam's worker construction; rung 1's worker ceiling re-records), `ARCHITECTURE.md` (the
migration and function counts; the 23-step pipeline). The merge does not touch generation-remediation
ownership or persistence. Migration numbers stay unique (204 is the only 204).

## 2. Registers, before → after

| Register | Door | Before → after | Cause (side) | Commit |
|---|---|---|---|---|
| `engineBundle.js` + `.meta.json` | `npm run build:edge-shared` (ONE run, all six) | inputs 241 → 281; sourceHash `ff2d42172d2996e0` → `778502e3086a3a71`; **engineVersion `51f0592cb309f45b` → `2a1127e4b9c24fe1`**; builtFromCommit `a62c5081d` | RUNG 1 moved pipeline inputs (the 23rd step `resolveCrisisCast`, the coherence findings, the FIRSTPAINT-2 domain modules) | `115b91596` |
| `analyticsEventsBundle.meta.json` | same run | sourceHash `0a6ba64ce0b8d5e2` → `83bb7cabd0d39a9a`; `.js` bytes unchanged | ENGINE side's `analyticsEvents.js` (rev 14) | `115b91596` |
| the other four metas | same run | `generatedAt` only; no bundle `.js`, no sourceHash moved | one build window | `115b91596` |
| lighting census | `LIGHTING_CENSUS_REFREEZE` | files 2940 → 2953, parked 368 → 370, credited 2572 → 2583, titles 27868 → 27928, suiteTitles 7414 → 7436; the ordinary run 34 passed (34) | the +13 files are the engine lanes' tests (the same +13 the first merge measured) | `ef6c943af` |
| size baseline | the house test's "fell under the layer ceiling → delete" | `src/store/settlementSlice.js` 816 → entry deleted (754 < 800) | ENGINE side (ENGINE-5's regen lift, ENGINE-3's seam) | `12429c757` |
| mutation-coverage manifest | rationale entry (`pglite-executed`) | + `tests/security/engineGenerationReport.pglite.test.js` | ENGINE side (ENGINE-5 unit 4) | `7fe1261a0` |
| metrics registry | Exempt events | + `engine_generate` (diagnostic) | ENGINE side (EVENTS rev 14) | `f0499825b` |
| source-citation archival roster | the arm's own instruction | dated 76 → 78: `ENGINE_PR_2026-11-06.md`, `ENGINE_MERGE2_2026-11-07.md` | ENGINE side (both lane records, born dated) | §5 |
| wiring census · writer reach · observed-shape readers · dossier prose leaves · analytics dictionary | their `--check` / generators | fresh, no change (709 pools / 2310 variants / 165 relation rows; 68 state blocks / 2310 variants; 133 events) | rung 1 had already moved and banked them | — |

## 3. Reds found at the merged tip, and their cures

Every red below was measured **at the engine tip `0604582dd` too** (a worktree there, the same
titles) and green on rung 1's tip, so each is the ENGINE lanes' own latent red, not the merge's: the
lanes ran the trimmed batch (rule 37), and the first merge seat ran named suites, not the directories.
Each is cured through its documented door, in its own commit; **no assertion was removed or loosened.**

| Red | Cure | Commit |
|---|---|---|
| `sourceCitationIntegrity` ARM 2: `docs/RISK_REGISTER.md` and `docs/briefs/W4a_LIBRARY_IMPLEMENTER_BRIEF.md` cited `settlementSlice.js` lines past its end (1606 lines) | re-addressed to symbols (rule 32): `settlementSlice.js :: undoLastEvent`, `settlementSlice.js :: canonizeSavedSettlement` | `97b4960b2` |
| `engineChunkLazy` "settlementSlice loadEngine() dynamic-imports generateSettlementPipeline" (the pipeline `import()` moved to `src/lib/localPipeline.js :: loadLocalPipeline`, the move EM-B2a4's two `retiredBy` rows record) | **re-anchored, not loosened**: the slice's static-import absence kept byte-for-byte; added the seam's statement-anchored `return import(...)`, the slice → regen lane and regen lane → seam dynamic edges, two anchored absences. Red-first: a static pipeline import planted in the regen lane → exit 1; the seam's `import()` re-pointed → exit 1. Title re-worded to the claim it now reads. | `c13c834c1` |
| `negativeAssertionAnchor`: `engineAbsentWhenRemote` line 110's bare negative (the marker sat two lines up) | an honest same-line `// anchored:` marker | `bdf83f49f` |
| `moduleScopeCwdRatchet` A4: tests/build 31 roots vs 30 banked (`engineBundleReplay`'s `process.cwd()`) | TOOL-31's one-line shape, the root from the file's own address | `b7807fd30` |
| `seedLoopTotality`: seven bare seed loops in six engine tests | the two synchronous loops adopt `collectSeedFailures` (engineServiceCore's one in-loop await hoisted; side effect recorded in the commit); the four async loops catch per seed and assert the roster once, under the walker's `// seed-loop: collected` marker. Red-first: "3 of the seeds failed", "3 of 3 case(s) failed". No title changed. | `ef8f9026a` |
| `sizeBaseline` (two titles) | entry deleted (§2) | `12429c757` |
| `mutationCoverageManifest` TOTALITY | rationale entry; its mutation proof executed on migration 204 (event filter widened → exit 1; anon granted execute → exit 1; restored → exit 0; the migration's bytes unchanged) | `7fe1261a0` |
| `voiceMechanics` JSX ratchet: `AdminAnalyticsPanel.jsx` em 0 → 1 | the admin line's separator " — " → "; "; the lane's own exact-text pin re-recorded in the same commit | `c5cbc2c14` |
| `metricsRegistry` coverage: `engine_generate` | Exempt events, **diagnostic** | `f0499825b` |

Found by sweeping `tests/lint` whole and `vitest related` over the engine lanes' 28 changed source
files (709 files, 6256 tests; 2 red, both above).

## 4. The proofs at the tip

Every run redirected to a file; every exit read from the run. Final run at `f0499825b` (+ this record
and the roster commit, docs and one register only).

| Proof | Command | Figure | Exit |
|---|---|---|---|
| replay: golden master 525 configs + espionage fence 360 rows + service births | `npx vitest run tests/build/engineBundleReplay.test.js` | Tests 6 passed (6) | 0 |
| flag-on build | `VITE_ENGINE_REMOTE=true npx vite build --outDir node_modules/.cache/engine-remote-dist --emptyOutDir` | built | 0 |
| no generator in the flag-on bundle | `VERIFY_ENGINE_REMOTE_DIST=1 npx vitest run tests/build/engineAbsentWhenRemote.test.js` | Tests 10 passed (10) | 0 |
| flag-off build | `npm run build` | worker `generation.worker-MaAIxfqL.js` 1,574,838 B = rung 1's ceiling, byte-identical file name | 0 |
| tests/build whole | `npx vitest run tests/build` | 63 files; Tests 520 passed, 65 skipped (585) | 0 |
| the lanes' 20 suites | (the first merge's list) | Tests 168 passed (168) | 0 |
| edge functions | `npx vitest run tests/edgeFunctions` | 38 files; Tests 947 passed (947) | 0 |
| tests/lint whole | `npx vitest run tests/lint` | 198 files; 3023 passed, 1 failed — the archival roster title, cured by §5 | 1 → 0 at §5 |
| the related reds' suites | voiceMechanics + metricsRegistry + adminEngineGenerationsLine | Tests 39 passed (39) | 0 |
| type ratchet | `npm run typecheck:ratchet` | 167 errors, ceiling 167 | 0 |
| domain strict | `npm run typecheck:domain:strict` | 1113 errors, ceiling 1113 | 0 |
| eslint, the repo's `lint` scope | `npx eslint src/ tests/ scripts/` | 0 errors, 36 warnings | 0 |
| eslint, bare | `npx eslint .` | **1 error**: `vendor/deno.land/std@0.177.1/node/internal/util/inspect.mjs` ("Definition for rule 'node-core/no-unescaped-regexp-dot' was not found"). `vendor/` (578 files) is committed identically on master `a07ee4e0a` and rung 1's tip; the error is not this branch's | 1 |
| packets | `node scripts/implementation-packets.mjs validate` | valid: 257 packets (0 READY); both EM-B2a4 `retiredBy` rows (§934.105) held | 0 |
| Deno `check:edge` / `test:edge` | — | **not run: Deno is not on this box**; CI's deno job gates it | — |

**Owed to the integration tip, stated:** the deployed `engine-version` must answer
**`2a1127e4b9c24fe1`** for this tip; it moves again if rung 2 moves a pipeline input (re-run
`build:edge-shared` then). The chair's one full check at the integration tip is the gate; this lane
ran none.

## 5. The roster

`tests/lint/.source-citation-baseline.json` `archivalExclusionAtFreeze.byRule.dated` 76 → 78 and the
walker's header, by the arm's own instruction: this record and `ENGINE_PR_2026-11-06.md` joined
`dated` by being born into it, 0 past-EOF citations between them. A growth, not a re-classification.
