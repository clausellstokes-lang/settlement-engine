# FORTUNE-6 hand-back (kept current at every push; last written 2026-11-22 03:22 UTC by `date -u`)

For a successor: this file, `FORTUNE-5-HANDBACK.md` (its section 0 is the rulings in force; its section 2 the join
and the security reader), `FORTUNE-4-HANDBACK.md` sections 2, 3 and 5, `LIGHTING-WORKLIST.md`, and the open briefs
named below. The chair is the EIGHTH chair, session_01ACmDYY29VRchM87v1yhL9Q (send_message, Claude Code Remote MCP
server). Branch `lane/fortune-6-2026-11-21`, seated 2026-11-21 23:19 UTC on 321081ea9 (FORTUNE-5's saved tip).

## 1. WHERE THE LANE STANDS

| branch | tip | state |
|---|---|---|
| `lane/fortune-6-2026-11-21` | cb43da78e + this hand-back (pushed) | this lane |
| `lane/fortune-6-2026-11-21-cure2u2` | 7ff3feecc (local only, merged) | unit 2's builder branch |
| `lane/fortune-6-2026-11-21-u5b` | 27e224755 (local only, merged) | U5b's builder branch |

| unit | state | commits |
|---|---|---|
| CURE-2 unit 1 (OSR rung 45 -> 46, `merits on breakdown`) | MERGED, read whole once. RED-FIRST re-run at 3ca68ffa1: the walker's two titles ("SHRINK-ONLY…", "A1/A7…") red, 45/47. GREEN at a4ffa59fa and at the merge: the door `check-observed-shape-readers` exit 0; `tests/lint/observedShape*` 5 files 175/175. The rung survives the line's merge (the line touched no OSR file). `tests/lint` whole at bce6e9eaa: 220/220 files, 3271/3271 tests (EXECUTED 23:47 UTC) | merge bce6e9eaa (of a4ffa59fa) |
| CURE-2 unit 2 (the legacy-config helper) | MERGED, read whole once: NEW `tests/helpers/fortuneLegacyConfig.js :: legacyConfig` (`birthConfig` with `FORTUNE_LAW_CONFIG_KEY` deleted) in the ABSENT arm only of Standing (c), Safety (e), Fortune (d), Merits (a); forced arms and `fortuneLawWiring.test.js` untouched; every no-law caller checked to be a dark arm. RE-RUN BY ME at a2e4b0e40, the lane's 13 files: dark 202 passed / 1 failed / 11 skipped (the one red `engineChunkLazy` › "the law is out of vite's own eager first-paint derivation", needs a fresh dist, red in both trees); FLIPPED (only `NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION`, verified by `diff -r`): 199 / 4 / 11, the 4 = that build title + wiring's "the vocabulary: one key, two versions, the dial at the default", "1. CREATE (dark)…", "2. CREATE (THE CLAMP)…" (FORTUNE-5's flipped run was 38). The builder's gates at 7ff3feecc: tests/lint 220/220 · 3271/3271; typecheck:ratchet 167/167; domain strict 1113/1113; lint 0 errors | 7ff3feecc, merge a2e4b0e40 |
| U5b | MERGED, source diff read whole once. The builder STOPPED twice and the chair ruled both times (section 2). Files: `governanceAccount.js` (section 2 and its imports), NEW `src/data/fortuneMeritLines.js` (the three wordings, the time words and `FORTUNE_MERIT_RECENT_YEARS = 10`), `powerStateProse.js :: legitimacyReadingPoolKey` (`merits` counts as a pull), NEW `tests/domain/fortuneMeritSentence.test.js`. `fortuneLaw.js` and `.tuning-register.json` are back to base bytes. Registers re-taken by their doors: wiring-census, tuning inventory, lighting census, writer-reach. RED at base: 8/8 failed. GREEN (the builder, at 27e224755): new test 8/8; eighteen equalities 18/18 with all six pairs reached; confinement 525/525 and 720/720; the 37 named files 3 red, the same 3 as at base; `tests/lint` 220/220 files and 3271/3271 tests; writer-reach walker 4 red (`wr-walker-red.log`) then 52/52; typecheck:ratchet 167/167; domain strict 1113/1113; lint 0 errors. RE-RUN BY ME at the merge: new test 8/8. FIRST PAINT vs a157bd930: raw 1,184,508 (+249 = 231 + 18), gzip 377,245 (+69), Brotli 316,687 (+5), worker 2,636,765 (+0); over the line +18 (the 231 is the line's, point 90). `measures/sentences/PAGES-BUILT.md` (Bailton owner and shared, Cobamal) is for the chair's eye | 10afe3873, a4d15a59e, 085046c7c, a8d380edd, 5341be785, 27e224755; merge 475f23852 |
| lit re-measure | DONE, `measures/bands/BANDS-LIT.md`. Three states at 5341be785 on the visitor's pool, 900 births each, 0 errors. All three tables are BYTE-IDENTICAL to FORTUNE-4's `BANDS.md` states A, B and C. The merit: 33 places merited, 11 newly Endorsed, 16 newly Approved, base score equal to B's on all 900 | this push |
| the line again + landing check | IN PROGRESS. The line's tip 5fca4362d (point 91) is MERGED (0cf38c992; the hooks changed no file of the merge tree). The four conflicted registers were taken from the lane's side, then re-taken by their own doors, each in its own commit. (1) Wiring census, ae13a105e (`--check` exit 0; against the line only the lane's stamps and producerIndexFiles 1441 -> 1443). (2) Observed-shape, b5e20a45f (the gate's own message: six generated inputs changed, `--write` may absorb them; 2215 findings / 1553 identities / 445 files, bank 79/53, SCHEMA 46 KEPT, provenance only). (3) Writer-reach, 597fec7f4 (cohort 1383 -> 1366, exactly the line's 17 stale; against the line only ruling 3's moves). (4) Lighting census, cb43da78e (red, then the refreeze, then 34/34; files 3736 -> 3747). `tests/lint` WHOLE at cb43da78e: 223 files, 5 failed and 3357 passed, all five on RED-AT-LINE by name. RE-RUN AT 5fca4362d: the same five with identical details, except the sameness walker's TOTALITY (28 unregistered against the line's 27; the 28th is `fortuneMeritLines.js :: FORTUNE_MERIT_LINES`, which the lane registers itself on `samenessHideable.handPools.json`, in the wording unit). STILL TO DO: the build with VERIFY_DIST, then the touched directories (`tests/generators`, `tests/data`, `tests/domain/display` whole, and the 146 domain, store and lib files that name a touched module), then `tests/build` whole | 0cf38c992, ae13a105e, b5e20a45f, 597fec7f4, cb43da78e |
| U5b WORDING by kind (the chair, 02:58 UTC) | WAITING for the chair's confirmation of the split (sent 03:21 UTC). Strikes: external_threat (15 of the 33 merited), great_flood 1, plague_years 1, great_fire 0, the Arcane Incident 0. Lived under: occupation_legacy 15, tyranny 1, leadership_vacuum 0, legitimacy_crisis 0, popular_uprising 0. Proposed: no `templateType` draws B only. Then ONE builder: red first (Cobamal draws B, Bailton draws B, a plague or flood place still draws among all three), the eighteen equalities, PAGES-BUILT.md re-rendered, and the hand-list row | — |

NEXT STEP: on the chair's confirmation of the split, seat ONE builder for the wording unit (brief in the chair's 02:58 ruling, section 2 item 4). Then rule 8's build and directories at the tip with that unit merged, and "FORTUNE <commit>". A newer line tip may be pushed: read `ci/LINE-NOW.md` again before the landing line.

## 2. Rulings in force (FORTUNE-5's section 0 items 1 to 7 stand; added since)

1. (the eighth chair, 2026-11-21) Open no pull request for any branch of this lane (COMMON-RULES 11).
2. (the chair, 2026-11-22 01:48 UTC, U5b first paint) The kernel's mixed pick (231) entered first paint ON THE LINE at
   point 90 (5fca4362d): over the line the rise is the 42, then the 18 once the 10 moved; say it so in the landing line.
   The 18 (`weatheredCatastrophe` reached) is ACCEPTED: under a kilobyte, no cure unit. The 10 is a WORDING threshold,
   not a law tuning: it moved beside the time words, on condition that the merit never reads it and no walker forces
   it into the law's table (both held). It is not on the owner's signing list.
3. (the chair, 02:21 UTC, writer-reach) The door writes: (1) `isApproved` and `isTolerated` on `publicLegitimacy` leave
   the dark cohort (1,425 -> 1,423); (2) `yearsAgo on legacyAnnotations` becomes a true read (LIT 700 -> 701); (3)
   the closures web-transitive 1,077, dossier-pdf 614, campaign-pdf 212, world-book 227, foundry 510, webWhole 1,876.
   No identity is new. All three identities go on the veil reader's list, beside the served fields.
4. (the chair, 02:58 UTC, from reading Cobamal) A flood, a plague, a siege or a shortage HITS a place; a tyranny, a
   purge or an occupation is LIVED UNDER. Wordings A and C ("{event} hit {place}") are eligible ONLY where the event's
   kind strikes. Wording B is eligible for every kind, and is the only one for kinds that are lived under. Declare it
   in the pool by the event's own `templateType`, through the one door, still the mixed keyed pick over the eligible
   wordings. First the list of kinds to the chair, then one builder. U5b, the re-measure and the hand-back are
   accepted; the chair read the three pages at 48cbca5cf.

## 3. For the join and the security reader

- The OSR rung 45 -> 46 is this lane's (merged at bce6e9eaa): another lane taking 46 conflicts at the join.
- U5b's served fields (read at the build): `name`; `config._fortuneLawVersion`; `publicLegitimacy` (label, score,
  breakdown.merits); `historicalEvents[]` (name, severity, yearsAgo, templateType); `currentTensions[].type`;
  `legacyAnnotations[]` (eventName, yearsAgo, annotation); the governing power's name fills {seat} but chooses no
  wording. The pick is keyed on place, event and years. No hideable house and no crime fact chooses any wording.
- FOR THE VEIL READER: the three writer-reach identities of ruling 3. The merit's sentence prints wherever the
  governance paragraph prints: web, the dossier PDF, the campaign PDF, the world book, Foundry. The proof that it is the
  same string on the owner's record, on `toPublicSafe` and under the widest veil is the eighteen equalities in
  `tests/domain/fortuneMeritSentence.test.js` (d).
- No vocabulary or class-table row was asked or added by U5b.

## 4. Hazards

- The container carries GIT_CONFIG_* / GIT_ASKPASS / GIT_EDITOR variables: every test runs through
  `scratchpad/clean.sh` (unsets every GIT_*), then `scripts/gate-mutex.sh --run`.
- Push only when HEAD differs from `git ls-remote`.
