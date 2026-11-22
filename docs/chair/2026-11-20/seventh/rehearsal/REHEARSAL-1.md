# REHEARSAL JOIN 1 — report (2026-11-20)

Of the twenty lane families, three are already on the line (names-4, titles-3, ci-fit-75) and seventeen are not. **Thirteen joined** onto the line's `8196e5712` in the worktree `/home/user/wt/rehearsal` (local branch `rehearsal/join-1`, tip `fe1f5b83e`; nothing pushed). **Four did not join**: depth-3, fortune-3, veil-27, veil-doors-3. Two of those are real code conflicts between lanes: page-7 and depth-3 in `registeredWords.js`, and seat-6 and fortune-3 in `densityCreateBoundary.js :: birthConfig`, where both lanes wire their generation law into the same lines. The two veil lanes conflict with THE LINE itself. The line and the veil lane each built their own fixture-git helper (`tests/helpers/gitFixture.js` against `tests/helpers/fixtureGit.js`), so five test files were written twice. Choosing which helper wins needs a ruling. **The first thing to know:** the joined tree typechecks (167 / 1113, at the ceilings) and lints clean (0 errors), and `npm run build` passes. But `tests/lint` reds **15 tests in 9 files**, and first paint is **3,360,748 B raw** against 1,177,668. That is the known page-7/page-9 first-paint fault, reported as it stands and not chased. In this rehearsal every register conflict took the line's side, and that alone dropped seat-6's `SEAT_CIRCUMSTANCE_TUNING` row from the tuning register.

## 2. The lanes

Line: `origin/lane/join-2026-11-14` at `8196e5712`. Rehearsal branch `rehearsal/join-1` in `/home/user/wt/rehearsal` (local only; `git worktree add -b` set it to track the line's remote ref, nothing pushed). Counts are files changed `<merge-base>..<tip>`; "other" is everything outside `src/ tests/ scripts/ supabase/ vite.config.js` (all `docs/` except `ARCHITECTURE.md` on veil-27, veil-doors-3, sec-grants-2).

| family | lane | tip | merge-base | ahead / behind | src | tests | scripts | supabase | vite | other (docs) | outcome | merge commit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| people-and-place page | page-8 | 9c8172c76 | 43ab0f5eb | 54 / 64 | 6 | 16 | 2 | 0 | 0 | 48 | joined with listed resolutions | 2293102c8 |
| display | page-9 | 53bc3d7da | 43ab0f5eb | 140 / 64 | 35 | 32 | 2 | 0 | 0 | 301 | joined with listed resolutions | 359db4f0c |
| trouble | page-7 | eae5fd6dc | 43ab0f5eb | 77 / 64 | 13 | 9 | 2 | 0 | 0 | 77 | joined clean | a738de941 |
| hooks, conflicts, ties | depth-3 | 29e3883a5 | bd42d63c7 | 88 / 63 | 11 | 17 | 1 | 0 | 0 | 87 | **NOT JOINED** (`registeredWords.js`) | — |
| goals and wants | goals-4 | 7495d3170 | 8196e5712 | 4 / 0 | 0 | 0 | 0 | 0 | 0 | 4 | joined clean | 3aa9c3f79 |
| people | people-2 | 84bb02e4c | 8196e5712 | 37 / 0 | 0 | 0 | 0 | 0 | 0 | 68 | joined clean | b1c479a7c |
| place | place-1 | 8eba89787 | bd42d63c7 | 43 / 63 | 2 | 4 | 1 | 0 | 0 | 85 | joined clean | a227ba3e0 |
| state sentences | prose-2 | e33e3b886 | 43ab0f5eb | 37 / 64 | 0 | 0 | 0 | 0 | 0 | 44 | joined clean | 468281539 |
| daily life | daily-2 | 6400958d5 | bd42d63c7 | 22 / 63 | 3 | 5 | 0 | 0 | 0 | 26 | joined with listed resolutions | 116ec1988 |
| traditions | trad-5 | 37b3f9dcd | 0c9069489 | 70 / 83 | 10 | 9 | 2 | 0 | 0 | 51 | joined with listed resolutions | 4b47a11f1 |
| session sheet | frame-7 | 6a8c0ee86 | 43ab0f5eb | 121 / 64 | 16 | 30 | 2 | 0 | 0 | 65 | joined with listed resolutions | 3bf47e638 |
| sameness door | same-2 | 72b130612 | 8196e5712 | 39 / 0 | 0 | 4 | 4 | 0 | 0 | 26 | joined with listed resolutions | caef7ea8c |
| who rules | seat-6 | ce9462b55 | e356c94f2 | 118 / 104 | 12 | 12 | 1 | 0 | 1 | 121 | joined with listed resolutions | d7039e528 |
| fortune | fortune-3 | 8b7e623ec | 43ab0f5eb | 58 / 64 | 6 | 11 | 1 | 0 | 0 | 59 | **NOT JOINED** (`densityCreateBoundary.js`, against seat-6) | — |
| share veil | veil-27 | 4822c7c8d | 8f3b8bf4b | 311 / 149 | 18 | 44 | 4 | 11 | 0 | 1186 (1185) | **NOT JOINED** (fixture-git helper, against the line) | — |
| share veil's doors | veil-doors-3 | 3e1115c81 | 8f3b8bf4b | 179 / 149 | 12 | 27 | 3 | 4 | 0 | 443 (442) | **NOT JOINED** (same as veil-27) | — |
| names | names-4 | 4414f9e22 | — | on the line | | | | | | | dropped | — |
| titles | titles-3 | 3c7191461 | — | on the line | | | | | | | dropped | — |
| grants (migration 213) | sec-grants-2 | a18bf94bc | 29ec255fe | 12 / 145 | 0 | 3 | 2 | 1 | 0 | 138 (137) | joined clean | fe1f5b83e |
| CI fit | ci-fit-75 | 0dcf81021 | — | on the line | | | | | | | dropped | — |

Shared unlanded history (so their file overlaps are partly the same commits): page-7 and page-9 share 75 commits; page-7 and page-8 share 23; veil-27 and veil-doors-3 share 160.

## 3. The collision table (every non-`docs/` file two or more unlanded lanes change; 72 rows)

| file | lanes | which |
|---|---|---|
| `tests/lint/.lighting-census-baseline.json` | 11 | daily-2 depth-3 fortune-3 frame-7 page-7 page-8 page-9 seat-6 trad-5 veil-27 veil-doors-3 |
| `scripts/mutation-coverage-manifest.json` | 10 | fortune-3 frame-7 page-7 page-8 page-9 same-2 sec-grants-2 trad-5 veil-27 veil-doors-3 |
| `scripts/.writer-reach-baseline.json` | 7 | frame-7 page-7 page-9 seat-6 trad-5 veil-27 veil-doors-3 |
| `tests/lint/.tuning-register.json` | 5 | fortune-3 frame-7 seat-6 veil-27 veil-doors-3 |
| `src/domain/facts/factLayers.js` | 4 | depth-3 page-7 page-9 seat-6 |
| `src/domain/facts/factVocabulary.js` | 4 | daily-2 depth-3 page-7 page-9 |
| `tests/lint/.tuning-inventory.json` | 4 | fortune-3 seat-6 veil-27 veil-doors-3 |
| `ARCHITECTURE.md` | 3 | sec-grants-2 veil-27 veil-doors-3 |
| `scripts/ops/migrationRehearsalCore.mjs` | 3 | sec-grants-2 veil-27 veil-doors-3 |
| `src/components/new/publicProseCompose.js` | 3 | trad-5 veil-27 veil-doors-3 |
| `src/domain/facts/factsOf.js` | 3 | depth-3 page-7 page-9 |
| `src/domain/facts/registeredWords.js` | 3 | depth-3 page-7 page-9 |
| `tests/components/dossierPhoneFloorAllViews.test.jsx` | 3 | page-9 trad-5 veil-27 |
| `tests/lint/presumptionClasses.shared.mjs` | 3 | depth-3 page-7 page-9 |
| `tests/ops/migrationRehearsal.test.js` | 3 | sec-grants-2 veil-27 veil-doors-3 |
| `scripts/census/pool-dominance.register.json` | 2 | depth-3 page-8 |
| `src/components/OutputContainer.jsx` | 2 | frame-7 trad-5 |
| `src/components/ShareToGallery.jsx` | 2 | veil-27 veil-doors-3 |
| `src/components/gallery/CurateMode.jsx` | 2 | veil-27 veil-doors-3 |
| `src/components/new/tabs/DefenseTab.jsx` | 2 | page-9 veil-27 |
| `src/data/historyData.js` | 2 | page-7 page-9 |
| `src/data/npcData.js` | 2 | depth-3 page-8 |
| `src/data/tensionCauses.js` | 2 | page-7 page-9 |
| `src/data/tensionSideMeanings.js` | 2 | page-7 page-9 |
| `src/data/tensionSidePower.js` | 2 | page-7 page-9 |
| `src/domain/density/densityCreateBoundary.js` | 2 | fortune-3 seat-6 |
| `src/domain/display/criminalVeilSwitch.js` | 2 | veil-27 veil-doors-3 |
| `src/domain/display/gallerySecondHomes.js` | 2 | veil-27 veil-doors-3 |
| `src/domain/display/galleryVeil.js` | 2 | veil-27 veil-doors-3 |
| `src/domain/display/publicSafe.js` | 2 | veil-27 veil-doors-3 |
| `src/domain/display/tensionCause.js` | 2 | page-7 page-9 |
| `src/domain/display/tensionCauseHolds.js` | 2 | page-7 page-9 |
| `src/domain/facts/causeHouses.js` | 2 | page-7 page-9 |
| `src/domain/facts/entrepot.js` | 2 | page-7 page-9 |
| `src/foundry/journalPages.js` | 2 | frame-7 page-9 |
| `src/generators/historyGenerator.js` | 2 | page-7 page-9 |
| `src/lib/gallery.js` | 2 | veil-27 veil-doors-3 |
| `supabase/migrations/211_server_side_share_veil.sql` | 2 | veil-27 veil-doors-3 |
| `supabase/migrations/212_share_veil_later_cures.sql` | 2 | veil-27 veil-doors-3 |
| `supabase/rollback/211_server_side_share_veil.down.sql` | 2 | veil-27 veil-doors-3 |
| `supabase/rollback/212_share_veil_later_cures.down.sql` | 2 | veil-27 veil-doors-3 |
| `tests/components/curateModeCriminalSwitch.test.jsx` | 2 | veil-27 veil-doors-3 |
| `tests/components/phoneChromeFloor.census.test.js` | 2 | frame-7 page-9 |
| `tests/components/publicProseVeilInvariance.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/data/tensionSideMeanings.test.js` | 2 | page-7 page-9 |
| `tests/data/tensionSpareWordings.test.js` | 2 | page-7 page-9 |
| `tests/domain/display/criminalVeilSwitch.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/domain/display/tensionCause.test.js` | 2 | page-7 page-9 |
| `tests/domain/facts/causeHouses.test.js` | 2 | page-7 page-9 |
| `tests/domain/tensionCauses.test.js` | 2 | page-7 page-9 |
| `tests/domain/tensionSidePower.test.js` | 2 | page-7 page-9 |
| `tests/generators/bar4HistoryOneTelling.test.js` | 2 | page-7 page-9 |
| `tests/helpers/fixtureGit.js` | 2 | veil-27 veil-doors-3 |
| `tests/lint/.migration-searchpath-baseline.json` | 2 | veil-27 veil-doors-3 |
| `tests/lint/.prose-numerics-baseline.json` | 2 | frame-7 page-9 |
| `tests/lint/densityCreateBoundary.walker.test.js` | 2 | fortune-3 seat-6 |
| `tests/lint/fixtureGitIsolation.walker.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/lint/legacyFactionReaders/noLegacyFactionReaders.core.mjs` | 2 | frame-7 page-9 |
| `tests/lint/migrationSearchPathPin.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/lint/ruinFilterRoster.walker.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/lint/tuningRegister.walker.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/scripts/implementationPackets.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/scripts/implementationSession.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/scripts/landingStageMeasure.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/security/galleryMapMemberCount.pglite.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/security/gallerySanitizer.pglite.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/security/gallerySecondHomes.pglite.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/security/galleryServerVeil.pglite.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/security/galleryVeilCures.pglite.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/security/galleryVeilHandRows.pglite.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/security/playerRecordVeiledFace.test.js` | 2 | veil-27 veil-doors-3 |
| `tests/soak-harness/soakRegister.test.js` | 2 | veil-27 veil-doors-3 |

## 4. Every conflict, by lane

Method for a register: `git merge-file --ours` over the index's three stages, so only the conflicted hunks take the rehearsal branch's side and every clean hunk keeps both; each JSON re-parsed after. Method for a union: each side's added entries kept, JSON re-parsed, and checked for duplicate keys (none).

**page-8** (2293102c8). `scripts/census/pool-dominance.register.json`: register, ours (the conflicted hunk is exactly the ruled row `ledger:npcData:STRESS_ECONOMIC_EFFECTS.mutual_leverage`: line 0.1394 / 0.594, lane 0.1437 / 0.7052; the line's values kept, as ruled; the lane's other moved rows in that region merged clean). `tests/lint/.lighting-census-baseline.json`: census, ours. OWED both.

**page-9** (359db4f0c). `scripts/.writer-reach-baseline.json`: frozen fingerprint (frozenAtSha, scanStats files/sites/propRead/nGrades), ours, OWED. `tests/lint/.lighting-census-baseline.json`: ours, OWED. `scripts/mutation-coverage-manifest.json`: **union** (rehearsal side `tests/data/arrivalPoolsDeepened.test.js`; lane `tests/data/tensionSpareWordings.test.js`).

**page-7** (a738de941): clean.

**depth-3: NOT JOINED.** Conflicts: `src/domain/facts/registeredWords.js` (logic), `src/domain/facts/factVocabulary.js` and `src/domain/facts/factsOf.js` (each side only adds distinct dimensions/getters/imports: would be union), `scripts/census/pool-dominance.register.json`, `tests/lint/.lighting-census-baseline.json`, `docs/content/wiring-census.json` (registers). The blocking hunk, `registeredWords.js`, `HOUSE_FAMILIES` (the `house: <key>` row builder), both sides rewrote the same `leaf`/`atoms` lines:
```
<<<<<<< rehearsal (page-7, via page-9)
      kind: 'thing', layer: 'P', leaf: `institutions.js :: liveInstitutionNames, or a power of the name (a house named ${key}); its atom \`house: ${key}\` waits for a factsOf getter`,
      words: re, atoms: key === "thieves' guild" ? ['house: thieves_guild'] : key === 'smuggling' ? ['house: smuggling'] : [], // PAGE-7 (CAUSES-DATA addendum 4, item 1): the two atoms answered by `causeHouses.js`
      absent: (_f, rosterNames, record) => !rosterHas(rosterNames, stem) && !powerNames(record).some((n) => stem.test(n)),
=======
      kind: 'thing', layer: 'P', leaf: `institutions.js :: liveInstitutionNames, or a power of the name (a house named ${key}); ${HOUSE_FAMILY_ATOMS[key] ? `its atom \`${HOUSE_FAMILY_ATOMS[key].join('\`, \`')}\` (BUILD-CONFLICT)` : `its atom \`house: ${key}\` waits for a factsOf getter`}`,
      words: re, atoms: [...(HOUSE_FAMILY_ATOMS[key] || [])], absent: (_f, rosterNames, record) => !rosterHas(rosterNames, stem) && !powerNames(record).some((n) => stem.test(n)),
>>>>>>> depth-3
```
Lanes meeting: page-7 (trouble, CAUSES-DATA house atoms) and depth-3 (DEPTH-2 BUILD-CONFLICT `HOUSE_FAMILY_ATOMS` table). `git merge --abort`.

**goals-4, people-2, place-1, prose-2**: clean (3aa9c3f79, b1c479a7c, a227ba3e0, 468281539).

**daily-2** (116ec1988). `tests/lint/.lighting-census-baseline.json`: ours, OWED.

**trad-5** (4b47a11f1). `docs/content/wiring-census.json` (`producerIndexFiles` 1439 vs 1437), `scripts/.writer-reach-baseline.json`, `tests/lint/.lighting-census-baseline.json`, `tests/components/dossierPhoneFloorAllViews.test.jsx` (the conflicted hunks are the RE-MEASURED notes above `DESKTOP_BASELINE` and `MOBILE_BASELINE`; the frozen figures themselves merged without conflict): ours, OWED all four. `scripts/mutation-coverage-manifest.json`: **union** (rehearsal: `tests/generators/misfitSecretSettle.test.js`, `tests/data/powerNumberAgreement.test.js`, `tests/data/tensionSideMeanings.test.js`; lane: `tests/lint/traditionDescriptionFrames.walker.test.js`, `tests/security/traditionDescriptionSharedPage.test.js`, `tests/security/traditionsPublicProse.pglite.test.js`).

**frame-7** (3bf47e638). `tests/components/phoneChromeFloor.census.test.js` (`ROUTE_BASELINE` floored counts: rehearsal `/create` 619 against lane 622, and the notes), `docs/content/wiring-census.json`, `scripts/.writer-reach-baseline.json`, `tests/lint/.lighting-census-baseline.json`: ours, OWED. `scripts/mutation-coverage-manifest.json`: **union** (rehearsal: `tests/generators/misfitSecretSettle.test.js`; lane: `tests/domain/tension/sideArchetypes.walker.test.js`, `tests/security/frameShareVeil.test.jsx`).

**same-2** (caef7ea8c). `scripts/mutation-coverage-manifest.json`: **union** (rehearsal: `tests/data/arrivalPoolsDeepened.test.js`, `tests/data/tensionSpareWordings.test.js`; lane: `tests/lint/samenessHideable.walker.test.js`).

**seat-6** (d7039e528). `scripts/.writer-reach-baseline.json`, `tests/lint/.lighting-census-baseline.json`, `tests/lint/.tuning-register.json`: ours, OWED. Note on the tuning register: the conflict is two different NEW rows at one place (rehearsal `src/domain/tension/sideArchetypes.js#FRAME_TUNING` from frame-7; lane `src/domain/seat/seatCircumstances.js#SEAT_CIRCUMSTANCE_TUNING`); taking ours left the joined register with NO `SEAT_CIRCUMSTANCE_TUNING` row (grep count 0). The real join must hold both rows through the register's own door.

**fortune-3: NOT JOINED.** Conflicts: `src/domain/density/densityCreateBoundary.js` (logic: imports, `birthConfig`'s destructure and return, `GENERATION_LAWS`), `tests/lint/densityCreateBoundary.walker.test.js` (`MINT_SYMBOLS`), plus registers `.tuning-register.json`, `.tuning-inventory.json` (totals keys 2296 vs 2297), `.lighting-census-baseline.json`, `docs/content/wiring-census.json`. First hunk, `densityCreateBoundary.js`, the law-module import (the later hunks in `birthConfig` are the same shape: seat's line against fortune's line):
```
<<<<<<< rehearsal (seat-6)
// ⭐ THE THIRD GENERATION LAW, THE SEAT LAW (CS10, SEAT-1 train 1 unit U1), WIRED HERE AND
// NOWHERE ELSE, AND DARK. ...
import { SEAT_LAW_CONFIG_KEY, newSettlementSeatLaw } from '../seat/seatLaw.js';
=======
// ⭐ THE FOURTH GENERATION LAW, THE FORTUNE LAW (FS5, FORTUNE-1 unit U1), WIRED HERE AND
// NOWHERE ELSE, AND DARK. ...
import { FORTUNE_LAW_CONFIG_KEY, newSettlementFortuneLaw } from '../fortune/fortuneLaw.js';
>>>>>>> fortune-3
```
and in `birthConfig`: `[SEAT_LAW_CONFIG_KEY]: _incomingSeatLaw,` / `...newSettlementSeatLaw(),` against `[FORTUNE_LAW_CONFIG_KEY]: _incomingFortuneLaw,` / `...newSettlementFortuneLaw(),`. Lanes meeting: seat-6 and fortune-3. PLAUSIBLE (read, not run): the two are meant to stand together (fortune calls itself "the FOURTH" law, "never before the seat's law"), so the resolution is probably both, seat first; but it is the generation seam's logic, so not guessed here. `git merge --abort`.

**veil-27: NOT JOINED.** Conflicts (against THE LINE, not another lane): `tests/lint/tuningRegister.walker.test.js`, `tests/scripts/implementationPackets.test.js`, `tests/scripts/implementationSession.test.js`, `tests/scripts/landingStageMeasure.test.js`, `tests/soak-harness/soakRegister.test.js` (test code), plus registers `.tuning-inventory.json`, `.lighting-census-baseline.json`, `.writer-reach-baseline.json`, `dossierPhoneFloorAllViews.test.jsx`, `docs/content/wiring-census.json`. Cause: the line and the veil lane each built their OWN fixture-git isolation helper for the same pre-push GIT_DIR leak: the line `tests/helpers/gitFixture.js` (`fixtureGit`, `withoutRepositoryEnv`; a0cea73a7 "git fixtures run behind one door"), the lane `tests/helpers/fixtureGit.js` (`fixtureEnv`, `isolateFromHostRepo`; ec861dbd8). First hunk, `tuningRegister.walker.test.js`:
```
<<<<<<< rehearsal (line)
      fixtureGit(dir, ['init', '-q']);
=======
      execFileSync('git', ['init', '-q'], { cwd: dir, env: fixtureEnv() });
>>>>>>> veil-27
```
and `implementationPackets.test.js`: `import { fixtureGit } from '../helpers/gitFixture.js';` against `import { fixtureEnv, isolateFromHostRepo } from '../helpers/fixtureGit.js';` + `isolateFromHostRepo();`. Which door wins is a ruling. `git merge --abort`.

**veil-doors-3: NOT JOINED.** The same ten files and the same fixture-git hunk (it shares 160 commits with veil-27, ec861dbd8 among them), plus `scripts/mutation-coverage-manifest.json`. `git merge --abort`.

**sec-grants-2** (fe1f5b83e): clean. (It changes `scripts/ops/migrationRehearsalCore.mjs` and `tests/ops/migrationRehearsal.test.js`, which the two veil lanes also change; with both veil lanes out, that meeting is untested here.)

No commit hook ran on any merge commit: `core.hooksPath` is `.husky/_`, which does not exist in the new worktree (husky's generated directory is not checked in), so no hook could stop or check a merge. Nothing was `--no-verify`.

## 5. The joined tree, measured once (tip `fe1f5b83e`; `node_modules` a symlink to `/home/user/wt/line/node_modules`, no tool failed on the link; the merged `package.json` and `package-lock.json` are byte-identical to the line's, so no finding there)

| gate | joined | line today | verdict |
|---|---|---|---|
| `npm run typecheck:ratchet` | 167 errors, ceiling 167 | 167 | pass (exit 0) |
| `npm run typecheck:domain:strict` | 1113 errors, ceiling 1113 | 1113 | pass (exit 0) |
| `npm run lint` | 0 errors, 38 warnings | 0 errors | pass (exit 0) |
| `npx vitest run tests/lint` | 221 of 222 files reported; 3,297 tests passed, 14 failed; `poolDominance.walker.test.js` run alone: 16 passed, 1 failed. Together: **15 failed tests in 9 files** (213 files fully green) | 220/220 files, 3,271/3,271 | RED |
| `npm run build` | passes (prerender 314 documents) | — | pass (exit 0) |
| `tests/build/vendorPdfLazy.test.js` + `generationWorkerLazy.test.js` with `VERIFY_DIST=1` | 8 failed, 58 passed (66) | — | RED |

**How the `tests/lint` run went (it could not finish as one run).** The first whole run (`vitest-lint.log`) was killed at the chair's order after about 16 minutes. The chair first read it as hung, then corrected: `poolDominance.walker.test.js` births a fixed 2,050-town corpus, so it is slow, not hung. A verbose re-run under `timeout 600` (`vitest-lint-verbose.log`) reported 221 files. The session's own background-task limit stopped that run before its summary printed, so its counts come from the per-test lines. The 222nd file, `poolDominance.walker.test.js`, was then run alone under `timeout 1800` (`poolDominance.log`): 589 s, exit 1, no hang.

**Every failing test, by name** (file › title: first line of its message):
1. `samenessHideable.walker.test.js` › PHASE 3, RULE 1: the hand pools' red lines equal the bank's hand rows exactly: expected [ Array(222) ] to deeply equal [ Array(151) ]
2. `samenessHideable.walker.test.js` › PHASE 3, RULE 2: the hand pools' declared lines' houses equal the committed list exactly: expected [ Array(165) ] to deeply equal [ Array(136) ]
3. `samenessHideable.walker.test.js` › SENTENCE KEYS: the rule takes every key of the sentence-keyed tables and no other table's key: expected [ …(6) ] to deeply equal [ …(5) ]
4. `samenessHideable.walker.test.js` › TOTALITY: every pool-shaped table a draw site reads is reached by corpusPools or on the hand list: expected { unregistered: [ …(23) ], stale: [] } to deeply equal { unregistered: [], stale: [] }
5. `observedShapeReaders.walker.test.js` › SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished: the live heuristic inventory must exactly match the frozen one.
6. `observedShapeReaders.walker.test.js` › A1/A7: schema-7 filters narrow ordinary noise while explained writers stay banked live: expected { reads: 2216, identities: 1554, … } to deeply equal { reads: 2214, identities: 1552, … }
7. `proseWiringCensus.walker.test.js` › ⭐ THE DRY READ: both modes, and the one that writes is not among them: the committed register is current at this tip: expected false to be true
8. `proseWiringCensus.walker.test.js` › the committed census is byte-identical to a fresh build, and the stamp is live: the committed file is current: expected 'stale-bytes' to be ''
9. `sovereigntyLightingContract.walker.test.js` › THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed: the estate's file count moved — re-measure, do not re-word: expected 3758 to be 3712
10. `tuningRegister.walker.test.js` › every measured table has a declared row: TOTALITY: a tuning table with no declared row is a dial nobody has named …
11. `tuningRegister.walker.test.js` › the measured tree matches the committed inventory exactly: the inventory is EXACT, both ways, including digests, leaves and dependents …
12. `mutationCoverageManifest.test.js` › TOTALITY: every enumerated invariant file has a manifest entry: Invariant test file(s) with NO mutation-coverage entry: `tests/generators/safetyDescSpread.test.js`
13. `seedLoopTotality.walker.test.js` › no NEW bare seed loop anywhere in the test corpus: expected [ Array(1) ] to deeply equal []
14. `migrationSearchPathPin.test.js` › has no stale baseline entries (shrink-only): remove from `.migration-searchpath-baseline.json`: `public.list_ticket_thread`, `public.set_curated`
15. `poolDominance.walker.test.js` › every drawn pool has a row, and every row is a drawn pool: 12 drawn pools have NO row (unregistered): `ledger:safetyProfile:safetyDesc:` `corners`, `force.garrison`, `force.militia`, `force.none`, `force.watch`, `opening`, `tiny`, `unsafe.advice`, `unsafe.garrison`, `unsafe.opening`, `unsafe.walls`, `walls`. The stale arm did not run because the first assertion failed. No rise and no loose ceiling.

Where each red probably comes from (PLAUSIBLE, read, not bisected): 9 is the lighting census, kept on the line's side (OWED). 10–11 are the tuning register and inventory, kept on the line's side, with the seat row lost (OWED). 7–8 come from `docs/content/wiring-census.json`, kept on the line's side (OWED). 12 and 15 are place-1's new safetyDesc pools and test (`f62d9d2a5`), which merged clean but are unbanked on the joined tree. 1–4 are same-2's walker reading pools that the joined lanes added. 14 is migration 213 (sec-grants-2) re-pinning two functions. 5–6 and 13 are not attributed.

**Build tests (VERIFY_DIST=1, `build-tests-verifydist.log`)**, the 8 failures: worker over ceiling (2,662,235 B > 2,579,708); a FIX-B2 lazy chunk reached first paint (`narrative-mutations-*.js`); the engine chunk is not under 909,928 (924,095); first-paint raw, gzip and Brotli over budget; the composed-prose corpus left the lazy chunk (an 11-file closure); a prose leaf reached no data-lazy chunk. Without `VERIFY_DIST` (`build-tests.log`), 3 failed and 14 skipped. These match the first-paint fault the chair named as known, carried by page-7/page-9 and being cured by their seats. Not chased.

**Sizes.** Read the way the two build tests read them: `dist/assets/generation.worker-*.js` bytes; `engine-*.js` (not `engine-core`); first paint is the entry's static-import closure from `dist/index.html`, gzip level 9 and Brotli q11 per file, summed. My script `bin/measure-sizes.mjs` mirrors `vendorPdfLazy.test.js :: entryStaticClosure / entryTransferMeasurement`, and the test's own failure messages give the same figures.

| figure | line at 8196e5712 | joined | Δ |
|---|---|---|---|
| generation worker | 2,617,934 | 2,662,235 | +44,301 |
| engine chunk | 921,741 | 924,095 | +2,354 |
| first paint raw | 1,177,668 | 3,360,748 (11 files) | +2,183,080 |
| first paint gzip | 374,676 | 964,060 | +589,384 |
| first paint Brotli | 314,472 | 783,842 | +469,370 |

## 6. What the real join owes that this rehearsal skipped (each "OWED: its own door")

- `tests/lint/.lighting-census-baseline.json`: conflicted with page-8, page-9, daily-2, trad-5, frame-7, seat-6 (line's side kept each time; red 9 above)
- `scripts/census/pool-dominance.register.json`: page-8 (the ruled row `STRESS_ECONOMIC_EFFECTS.mutual_leverage` kept at the line's values); plus the 12 unbanked safetyDesc pools (red 15)
- `scripts/.writer-reach-baseline.json`: page-9, trad-5, frame-7, seat-6
- `docs/content/wiring-census.json` (`producerIndexFiles`): trad-5, frame-7 (reds 7–8)
- `tests/components/dossierPhoneFloorAllViews.test.jsx` (RE-MEASURED notes; the frozen figures merged without conflict and were not run here): trad-5
- `tests/components/phoneChromeFloor.census.test.js` (`ROUTE_BASELINE` /create floored 619 vs 622; not run here): frame-7
- `tests/lint/.tuning-register.json`: seat-6. **The `src/domain/seat/seatCircumstances.js#SEAT_CIRCUMSTANCE_TUNING` row is absent from the joined register.**
- Also owed by the four lanes left out: their own register doors (`.tuning-inventory.json`, `.tuning-register.json`, `.lighting-census-baseline.json`, `wiring-census.json`, the writer-reach baseline, the manifest, `pool-dominance.register.json`). Not attempted.
- Not run in this rehearsal (outside the brief): the full test suite, the component tests named above, and `npm run check`.

## CONFIRMED (executed; logs under `logs/`)
- Lane facts, ancestry, counts and collisions: `files-<lane>.txt`, `nondocs.txt`, `collisions.txt`
- The 13 merges and their resolutions, and the 4 aborted merges (`git log --first-parent origin/lane/join-2026-11-14..rehearsal/join-1`); the manifest unions re-parsed with no duplicate key; no conflict marker left in the tree (`git grep`)
- typecheck:ratchet 167/167 pass: `typecheck-ratchet.log`; domain:strict 1113/1113 pass: `typecheck-domain-strict.log`; lint 0 errors / 38 warnings: `lint.log`
- tests/lint reds 1–14: `vitest-lint-verbose.log` (the run was stopped before its summary; the first run, killed: `vitest-lint.log`); red 15 and no hang: `poolDominance.log`
- build passes: `build.log`; build tests: `build-tests.log`, `build-tests-verifydist.log`; sizes: `sizes.log`

## PLAUSIBLE (read, not run)
- fortune-3's and seat-6's `birthConfig` hunks are meant to stand together, seat first (the fortune lane's own words)
- depth-3's `factVocabulary.js` / `factsOf.js` conflicts would union cleanly; only `registeredWords.js` blocks it
- which lane causes each tests/lint red (the paragraph under the list)
- sec-grants-2 against the veil lanes in `scripts/ops/migrationRehearsalCore.mjs` / `tests/ops/migrationRehearsal.test.js`: untested, because the veil lanes did not join
- no hook ran on any merge commit (`core.hooksPath=.husky/_`, which is absent in the new worktree)
