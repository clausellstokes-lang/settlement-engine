# PEOPLE-LAND: the people car's landing — the remainder cured, the observed-shape rung 31, the shim out, Register VII v2; the golden door NOT reached (2026-11-07)

> Archival record of the people car's landing seat PEOPLE-LAND (Opus 5.5), a child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's delegation of 2026-11-06. Base: `origin/lane/people-5ab-merge-2026-11-07` at `bc4b64230`. Branch: `lane/people-land-2026-11-07`, pushed with `--no-verify` after every step. The brief: `docs/chair/2026-11-07/BRIEF-PEOPLE-LAND-2026-11-07.md` on the integration branch; the map: `GOLDEN-REHEARSAL-2026-11-07.md` on `lane/golden-rehearsal-2026-11-07` (the rehearsal is not on the integration branch; read from there).

## 0. The outcome

Steps 0, 0b, 1 and 4 are done and pushed. **Steps 2, 3, 5 and 6 are NOT done: the seat reached its context budget before the forward golden stack.** No golden fixture, no `docs/shift-records/` file and no budget ceiling moved on this branch. The goldens stay red by construction (M-3) until a second seat signs records 0a, 0b and the car's stack forward (§6, the numbered remainder). Nothing was refused by a door; nothing is a STOP of a door's making.

## 1. Step 0 — the tooling (`17651d2f9`)

- `scripts/audit/landing-stage.sh measure` reads all five moved surfaces: the rehearsal's `landing-stage.proposed.diff` applied (the 525, the herald desk, the fence, plus the prose manifest via `prose-manifest-cells.mjs --out`, the witness via `witness-stage.mjs`, the PDF snapshot copied out with the stage restored); with a previous stage's scratch dir it compares stage to stage, and the new `scripts/audit/stage-chain.mjs` (the rehearsal's `chain.cjs` on the tree) counts rows moved per surface. Control: `tests/scripts/landingStageMeasure.test.js` — the live block reads five, the planted pre-landing block reads three.
- The tuning ritual's `signingRecordMalformations` refuses a bare numeral as `ownerWords` (rehearsal finding 4), with its paired positive control (words carrying a numeral pass). No register byte.

## 2. Step 0b — the inherited remainder

**(a) 5B's §9 re-keys, cause M-7** (`e73d0878e`): `generationCertificationCorpus` 7 red → 13/13 (conflict parties against `powerStructure.factions`, a card's power from its memberships, the record asserted to carry no grouping); `persistenceAdmission` 2 red → 7/7 (the current rows carry schema 2; a legacy row migrates to 2, measured); `pipelinePinnedChoosers` A5 (the watch list 19 → 18, `factions` no key of a v2 record). The four pinned "golden corpus byte-identical" arms (`pipelinePinnedChoosers` A1, `pipelinePinnedMode` A1/A2/A5) read `tests/fixtures/generator-golden-master.json`: they are the golden door's and turn with the 525's records (§6).

**(b) 5B's hand-off to the display side** (`8a99ebe74`): of the six birth/display reds, three were already green here (5A's re-points); `seatHolder` 1, `castPowers` 2, `npcCrimeSignalWriters` 1 re-keyed to the memberships, 24/24. **The export allowlist's three unwritten keys are NOT cured**: `publicSafe.js`'s two allowlists are parity-pinned to the SQL `_gallery_sanitize_public_json` (migration 189's `npc_allowed`, `tests/security/*`); dropping them is a Supabase migration, a public data-contract change outside the car. writerReach's report arm names them and is green. Remainder §6.12.

**(c) The observed-shape register — MERGE-5AB's STOP, cured by a new genesis, rung 30 → 31:**

| commit | act | figures |
|---|---|---|
| `db5dbb001` | X: `8dd30106b`'s consistent schema-30 register restored byte for byte | the predecessor |
| `aaa15f224` | act 1: `BASELINE_SCHEMA` 31, `RETIRED_PEOPLE_CAST_BASELINE_SCHEMA` 30, `validateSchema31Baseline` live, `PEOPLE_LANDING_TARGET_SCHEMA = 31`, policy `schema-30-to-31-exact-scanner-transition-v1`, pairing 31: 30, the pins (120/120) | measured at X: reads 2,068 → 2,200 · identities 1,470 → 1,551 · files 403 → 426 · NEW 90 · GONE 9 · INCREASED 0 · DECREASED 2 · SAME 1,459 |
| `b61029f4d` | act 2: scan → report → review ledger → bundle → `--write --migrate-schema=31` | froze 2,200 / 1,551 / 426; bank 77/51; plain check exit 0 |
| `1adf403e4` | the walker's TCD-1 anchor `name` → `faction` (the `factions` shape is the powers) | observedShapeReaders 47/47; writerReach green whole |

The review (committed: `docs/people-land/osr-rung31-review.json`, one accepted note per row) — every NEW row ADMITTED WITH ATTRIBUTION by lane cause, none declared:

| class | rows |
|---|---|
| FPZ's (M-6), each attributed to `fpz-list.json`'s reason | 32 |
| the simulation's reads under `worldPulse/` not on that list (M-6) | 7 |
| 5A — the display reads | 25 |
| lane 1 — the card's `institution` | 9 |
| **v1-migration-reads** (one class: "the migration reads the five legacy fields once, by design, to move them"; `settlementMigrations.js`, 5B) | 9 |
| 5B — the grouping's builders (retired at step 1) / its birth readers of the powers | 5 / 2 |
| lane 3 — the hook parties | 1 |
| lanes 2 and 4 | 0 |

Where each row first appeared was measured by scanning the lane tips (234 `c7d552370`, 5A `3d76fb058`, 5B `f24623a9f`): 86 at 5B's tip (the v2 boundary strips the grouping and the shim's fields from the observed record), 2 at 5A's, 2 only in the union; each note names its blame lane. 9 GONE, 2 DECREASED: the grouping's readers the car re-pointed.

## 3. Step 1 — the shim out and the walker (`2981f23f6` … `e9e1af3ad`)

- **Deleted**: `src/generators/people/legacyShim.js` (`shimLegacyFactionFields`) and its call; `src/generators/power/factionGrouping.js` (`generateFactions`); `relinkFactionMembers`. The assembly, the coherence tail and the NPC regen no longer build, relink or return `settlement.factions`. `mergeNPCLists` no longer writes `factionAffiliation`, `secondaryAffiliation`, `factionGoal` (its draws stay). `factionRoles.js` (the pre-law office path): the powers alone; coverage by first-rank membership; the placeholder carries `memberships`. `structuralRank` stays.
- **The walker** `tests/lint/noLegacyFactionReaders.walker.test.js`, its core, `ast-sites.mjs` and `fpz-list.json` moved beside it under `tests/lint/legacyFactionReaders/` (the chair's docs tree is not on this base). **45 violations at the step-0b tip → 0** (2,394 files). Reviewed rows, each with its reason: `structuralRank` off the refused list; drifted file:line rows re-keyed; OTHER_SHAPES for the preview's powers count (MERGE-5AB ruling 1) and a tension's camps; FIELD_CONTRACTS for `publicSafe.js` (§2b) and the custom-content library's legacy fallback; MIGRATION_FILES (v1-migration-reads); `fpz-list.json` 35 → 38 (`applyDensityLaw.js`, `titularSuccession.js`, `densityRungs.js`: the density law's rung machinery, retired from birth by lane 1, no src caller, run only by `densityLaw.test.js`, FPZ's). The planted control fires on all seven refused shapes.
- **Measured against the step-0b tip** over the 45 red files of the wide sweep (`tests/generators tests/domain tests/store tests/components tests/lib tests/pdf`; 2,007 files, 65 failing tests at step 1, 58 at `1adf403e4`): 7 tests newly red, all re-keyed (powerStructure F31, factionNamePrecedence 2, factionRefContract 1, factionStructuralOfficeCoverage 2, regenPreservesUserCanon 1). `heldKeyWriterCensus` roster 16 → 15 (the one MIRROR and `generateFactions` left; lane 3's `truePersonHooks` joined, `resolveGenerationWorldLaw` exempt): A3, red since MERGE-234, green 7/7.
- **Registers**: observed-shape `--write` shrink 2,200 → 2,193 / 1,551 → 1,545 / 426 → 425 (`da2a8f967`); wiring census producerIndexFiles 1271 → 1269 (`e1f104956`); writer reach `--write`, cohort 1397 → 1397, the shapes re-digested (`e9e1af3ad`, walker 52/52); the lint reds step 1 caused cured (`f79e45110`: arcane census line, size ratchet npcGenerator 1209 → 1201, a citation, three packet rows `retiredBy` §934.105). Lighting census: green in the lint run (not refrozen). Fork census: `tests/generators/generationForkCensus` red before and after step 1 (unattributed here — §6.9).

## 4. Step 4 — Register VII v2 (`75df41336`, `dae8da183`)

`docs/tuning-signatures/2026-11-07-v2.json` committed ahead of its ritual (version 2, the eight ids, `ownerWords` the owner's charter quoted verbatim in PEOPLE-RULINGS §0, `ownerDate` 2026-11-07, `odqRow` §934.105, the seat line as the brief words it, the note on the unread mass band). The ritual printed: **"tuning inventory REFROZEN at 75df41336 … 263 tables, 536 named, 6935 bare. SIGNED at tuning-register v2: 8 ids, §934.105"**. `densityBands.js` byte-identical (no diff since `262e8b255`; v2's digests equal v1's). Lane 4's `ties.js` growth attributed by two DECLARED_GROWTH rows (ceiling 6 → 8), `UNREGISTERED_NAMED_CEILING` 535 → 536 for its one name (the §883.8 idiom, under the delegation). The version pins re-keyed 1 → 2 (four sites in three arms). **Walker 75/75**: the base's four tuning reds cured. Taken out of the brief's order (before step 3) because it touches no golden and no stage carries it.

## 5. The red list at the tip

`tests/lint` + `tests/scripts` whole at `e1f104956` (before §3's lint cures and §4): 217 files, 23 failing tests in 16 files; since cured on the branch: `writerReach` 2, `arcaneClassifierCensus` 2, `sizeBaseline` 1, `sourceCitationIntegrity` 1, `implementationPackets` 1, `tuningRegister` 4. **Remaining, none caused by this seat**: `proseFamilyContract` 5, `newsHeadlineContract` 1, `newsVoiceContract` 1 (the AO-0 corpus re-dealt by the cast — the lanes' cross-records, for the golden door's records); `institutionTable` 2, `negativeAssertionAnchor` 2, `mutationCoverageManifest` 1, `proseWiringCensus` 1, `sovereigntyLightingContract` 1 (the base's, per MERGE-5AB §5); `ledgerCitationIntegrity`, `provenanceMap` (ENVIRONMENT: no local `refs/heads/review-fixes-2026-07-08`). The goldens (M-3): 6 files / 10 tests red by construction, plus the four pinned-corpus arms of §2a and `tests/pdf/goldenViewModel`. FPZ's (M-6): `densityLaw` 4, `killNpcDoubleImpair` 3, `npc/characterConsumers` 3, `clergyTraitPlane` 2, `worldPulseFactionSeating` 2, `deityStanceLane` 1, `religionLegitimacyFactionKey` 1, `regenNpcEnrichment` 1. The rest of the 58 wide-sweep reds standing at `1adf403e4` are listed by test in the remainder (§6.9) — not attributed by this seat.

## 6. The remainder, numbered (for the second seat)

1. **Step 2, record 0a** — the review-intake move (`5b444331a`, `e7e8a6ff` → `b1be65e4`, 525/525), its units from `docs/REVIEW_INTAKE_2026-11-06.md`, through the door as rehearsal §5 step 1 says. (The stage tool now measures all five surfaces; `stage-chain.mjs` compares stage to stage.)
2. **Step 2, record 0b** — the W0 merge's composition (`fc834a6bd`, `b1be65e4` → `6b0d226e`; the fence `726ef86a` → `f1aa52d8`, 360/360; the prose 8/1,050), naming W0's five signed records.
3. **Step 3, the car's stack forward**, one record per lane-cause at the first-parent points: lane 1 `dc655f712` (tip `bbe4a02ab`), lane 2 `3aa160a70`, lane 3 `0f930ce95`, lane 4 `c7d552370`, 5A `053283dfd`, 5B `a725df7e4`, the landing's step 1 `2981f23f6` (the shim out moves birth: the grouping leaves the record bytes; mergeNPCLists' field writes gone). Check each point with `landing-stage.sh build` for door-path STOPs first (a merge's diff is the whole lane). Per record: the by-hand restatements of rehearsal §5 4.vi, `transplant` with "RUNG 1" corrected and `Owner-Signed: §934.105`. Then the four pinned-corpus arms (§2a) and `goldenViewModel` should be green.
4. The dormancy goldens measured once at the DRY stage after the acts (rehearsal §6).
5. **Step 5, the budgets** at the final tip: `npm run build`, `sh scripts/gate-tail.sh npm run verify:dist`, the three ceilings re-recorded at the measured figures attributed by first-parent step; the landing fixture through its door with the two narration sentences quoted old → new.
6. **Step 6, the proof**: `tests/lint tests/scripts` whole, the people suites, the golden suites GREEN; the soak 1,000 once (`cert:*`/`coh:*` beside rung 2F's figures, the cast a named cause).
7. 5A's render proofs re-run at the final tip ("every surface still renders"): `powerSeatRender` 2, `powerStrata` 1, `dossierPhoneFloorAllViews` 2, `phoneChromeFloor.census` 1, `tabSentencesOnce` 1 are red at `1adf403e4` and at step 1 alike — attribute (lane or golden) and cure or bank.
8. The lighting census and the fork census re-derived through their doors at the final tip (not refrozen by this seat; the lighting census was green in the lint run).
9. The wide sweep's other reds standing before step 1 (`1adf403e4`), unattributed here: `npcStateRegenRebind` 2, `recordMerge` 2 (base), `plotHooks` 2, `editWorldFactResources` 2 (base), `display/forceComposition` 2, `pinnedNpcRegenRemap` 1, `locksEngine` 1, `mundaneRealmAcceptance` 1, `x46NpcBand` 1, `terrainPoolsHookLines` 1, `rosterFinalUnderHeldRoster` 1 (base), `powerEconomyFreshness` 1, `nameHeldThroughAssembly` 1 (base), `institutionBudgetPromise` 1, `hookThemeDraws` 1, `generationForkCensus` 1, `corruptionPass.integration` 1, `worldFactRederive` 1 (A7, the golden digests), `mergeLadderHeldKeys` 1, `legacyGeneratorQuarantine` 1, `intentAtlasSoakDistiller` 1, `explanation` 1, `stateProse/tierNounKeptRulings` 1, `repeatOnceTonightTraditions` 1 (base). Each is a lane's (cure) or the golden door's (turns with §6.3) — measure against `262e8b255` and the lane tips.
10. The dated roster: this record and the v2 signing record are born dated (101 → 103, this commit).
11. The one full check at the integration tip after the chair merges the car in.
12. The export allowlist's three unwritten keys (§2b): a Supabase migration recreating `_gallery_sanitize_public_json` without `factions` / `factionAffiliation` / `secondaryAffiliation`, the client allowlists and `publicNpc` in step — the owner's or the chair's call, outside the car.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED: every exit code above, read from `gate-tail.sh` or captured directly; the rung's reconciliation by the migration's own report (equal to the hand reconciliation); the 86/2/2 first-appearance figures by scans at the three tips; the ritual's printed line; `densityBands.js` byte-identity by `git diff`. PLAUSIBLE: that the second seat's stages at the merge commits build without a door-path STOP (not tried; the rehearsal built lane 1's linear chain only).

## 8. The tip

`lane/people-land-2026-11-07`, the commit carrying this file's last edit.

---

# SECOND SEAT (PEOPLE-LAND-2, Opus 5.5, session `01FE9mEwUmU2JVR1AvJZ95P1`, continuing from `1994a2ef5`)

## L0 — SECOND SEAT: the links lane in (`147fa6c3f`, `e4a11b32b`, `2b6368f9c`)

`origin/lane/people-6-links-2026-11-07` (tip `7f905f6fe`, cut from `bc4b64230`, this branch's base) merged `--no-ff` (`147fa6c3f`). The lane is display-only: the institution card's face row, the NPC card's door back, the honorific pools (`src/data/faceHonorifics.js`, 212 titles / 373 forms), `src/domain/people/cardDoor.js`. The merge was made in a scratch worktree (the live checkout's merge was refused by the session's permission classifier); the branch was pushed from it, the live checkout untouched.

Four register files conflicted; each was re-derived through its door at the merged tree, no side picked:

| register | door | figure | commit |
|---|---|---|---|
| dated roster (`.source-citation-baseline.json` byRule.dated, the walker's `dated (N)` header) | the walker's own arm | 103 (landing) / 102 (links) → **104**; both lanes' `_rosterGrowth…` notes kept; `_rosterGrowth2026-11-07-people-land-l0` added; walker green | `147fa6c3f` |
| wiring census | `node scripts/wiring-census.mjs`, then `--check` exit 0 | `producerIndexFiles` 1269 (landing; step 1 took 1271 → 1269) / 1272 (links) → **1270** (`cardDoor.js`); 709 pools, 165 relation rows unmoved | `147fa6c3f` |
| writer reach | `node scripts/check-writer-reach.mjs --write` exit 0 | cohort 1397 → 1397, 0 stale, 0 newly lit; web-transitive 966 → 968, files 1717 → 1719 (the links lane's two files); `writerReach.walker` green | `147fa6c3f` |
| observed-shape | plain check at the merge commit, then `--write` | plain: exit 0, "2193 finding(s), exactly matching the frozen inventory" — the links lane's reads (the card's `institution.kind/key/title`, `title`, `name`, `gender`; `institutions[].name`) add **no** finding at rung 31; `--write` froze 2193 / 1545 / 425 unchanged, bank 77/51, only the scanned files' manifests restamped (cause PEOPLE-6 LINKS); the five `observedShape*` suites green | `e4a11b32b` |
| lighting census | the ritual (`LIGHTING_CENSUS_REFREEZE='PEOPLE-LAND second seat'`, NOTE "PEOPLE-6 LINKS merged into the landing"), exit 1 by convention, then the plain run 34/34 | "census REFROZEN at e4a11b32b … files 2974 -> 2976, parked 372 -> 372, credited 2602 -> 2604, titles 28035 -> 28039, suiteTitles 7473 -> 7475". The merge auto-took the links lane's 2974 (its 2 test files over the base's 2972); the +2 are the landing's own step-0/1 suites (`landingStageMeasure`, `noLegacyFactionReaders.walker`), never frozen on the landing | `2b6368f9c` |
| prose numerics | auto-merged (the links lane's two `npcComponents.jsx` rows re-keyed 151 → 152, 157 → 158) | `proseNumerics` green at the merged tip — no re-key needed | — |

**The goldens did not move at L0.** `git diff 1994a2ef5 HEAD --stat -- tests/fixtures/` is empty. The 525 bytes measured by `scripts/audit/golden-master-stage.mjs` at `1994a2ef5` and at the merged tip: 525 rows each, sha256 `c7c11b0b81376930b074c1145bb40071a9b632848fae453361223e8be48db007` both, `moved 0, added 0, removed 0`.

**The links lane's suites at the merged tip**: `tests/data/faceHonorifics`, `people6InstitutionFaceLinks` and every suite importing `InstitutionsTab`, `npcComponents`, `cardPowers`, `cardDoor`, `NPCsTab` or `faceHonorifics` — 30 files, 365/367. The two red are the base's, as the links record §5 measured: `phoneChromeFloor.census` (`/admin` 86 → 87, `/world` 5 → 6 only) and `tabSentencesOnce` (X-50 PlotHooks repeats).
