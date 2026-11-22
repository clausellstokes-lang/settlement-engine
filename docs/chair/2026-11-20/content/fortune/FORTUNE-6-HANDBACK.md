# FORTUNE-6 hand-back (kept current at every push; last written 2026-11-22 07:3x UTC by `date -u`)

For a successor: this file, `FORTUNE-5-HANDBACK.md` (its section 0 is the rulings in force; its section 2 the join
and the security reader), `FORTUNE-4-HANDBACK.md` sections 2, 3 and 5, `LIGHTING-WORKLIST.md`, and the open briefs
named below. The chair is the EIGHTH chair, session_01ACmDYY29VRchM87v1yhL9Q (send_message, Claude Code Remote MCP
server). Branch `lane/fortune-6-2026-11-21`, seated 2026-11-21 23:19 UTC on 321081ea9 (FORTUNE-5's saved tip).

## 1. WHERE THE LANE STANDS

| branch | tip | state |
|---|---|---|
| `lane/fortune-6-2026-11-21` | 7e7420a60 + this hand-back (pushed) | this lane |
| `lane/fortune-6-2026-11-21-u5d` | (the builder's; pushed as `-u5d-wip` if cut short) | U5d-ECO-ANCHOR's builder branch, from 7e7420a60 |
| `lane/fortune-6-2026-11-21-u5bw` | 252047285 (local only, merged) | U5b-WORDING's builder branch |
| `lane/fortune-6-2026-11-21-u5c` | f2f56c734 (local only, merged) | U5c-FIRSTPAINT's builder branch |
| `lane/fortune-6-2026-11-21-cure2u2` | 7ff3feecc (local only, merged) | unit 2's builder branch |
| `lane/fortune-6-2026-11-21-u5b` | 27e224755 (local only, merged) | U5b's builder branch |

| unit | state | commits |
|---|---|---|
| CURE-2 unit 1 (OSR rung 45 -> 46, `merits on breakdown`) | MERGED, read whole once. RED-FIRST re-run at 3ca68ffa1: the walker's two titles ("SHRINK-ONLY…", "A1/A7…") red, 45/47. GREEN at a4ffa59fa and at the merge: the door `check-observed-shape-readers` exit 0; `tests/lint/observedShape*` 5 files 175/175. The rung survives the line's merge (the line touched no OSR file). `tests/lint` whole at bce6e9eaa: 220/220 files, 3271/3271 tests (EXECUTED 23:47 UTC) | merge bce6e9eaa (of a4ffa59fa) |
| CURE-2 unit 2 (the legacy-config helper) | MERGED, read whole once: NEW `tests/helpers/fortuneLegacyConfig.js :: legacyConfig` (`birthConfig` with `FORTUNE_LAW_CONFIG_KEY` deleted) in the ABSENT arm only of Standing (c), Safety (e), Fortune (d), Merits (a); forced arms and `fortuneLawWiring.test.js` untouched; every no-law caller checked to be a dark arm. RE-RUN BY ME at a2e4b0e40, the lane's 13 files: dark 202 passed / 1 failed / 11 skipped (the one red `engineChunkLazy` › "the law is out of vite's own eager first-paint derivation", needs a fresh dist, red in both trees); FLIPPED (only `NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION`, verified by `diff -r`): 199 / 4 / 11, the 4 = that build title + wiring's "the vocabulary: one key, two versions, the dial at the default", "1. CREATE (dark)…", "2. CREATE (THE CLAMP)…" (FORTUNE-5's flipped run was 38). The builder's gates at 7ff3feecc: tests/lint 220/220 · 3271/3271; typecheck:ratchet 167/167; domain strict 1113/1113; lint 0 errors | 7ff3feecc, merge a2e4b0e40 |
| U5b | MERGED, source diff read whole once. The builder STOPPED twice and the chair ruled both times (section 2). Files: `governanceAccount.js` (section 2 and its imports), NEW `src/data/fortuneMeritLines.js` (the three wordings, the time words and `FORTUNE_MERIT_RECENT_YEARS = 10`), `powerStateProse.js :: legitimacyReadingPoolKey` (`merits` counts as a pull), NEW `tests/domain/fortuneMeritSentence.test.js`. `fortuneLaw.js` and `.tuning-register.json` are back to base bytes. Registers re-taken by their doors: wiring-census, tuning inventory, lighting census, writer-reach. RED at base: 8/8 failed. GREEN (the builder, at 27e224755): new test 8/8; eighteen equalities 18/18 with all six pairs reached; confinement 525/525 and 720/720; the 37 named files 3 red, the same 3 as at base; `tests/lint` 220/220 files and 3271/3271 tests; writer-reach walker 4 red (`wr-walker-red.log`) then 52/52; typecheck:ratchet 167/167; domain strict 1113/1113; lint 0 errors. RE-RUN BY ME at the merge: new test 8/8. FIRST PAINT vs a157bd930: raw 1,184,508 (+249 = 231 + 18), gzip 377,245 (+69), Brotli 316,687 (+5), worker 2,636,765 (+0); over the line +18 (the 231 is the line's, point 90). `measures/sentences/PAGES-BUILT.md` (Bailton owner and shared, Cobamal) is for the chair's eye | 10afe3873, a4d15a59e, 085046c7c, a8d380edd, 5341be785, 27e224755; merge 475f23852 |
| lit re-measure | DONE, `measures/bands/BANDS-LIT.md`. Three states at 5341be785 on the visitor's pool, 900 births each, 0 errors. All three tables are BYTE-IDENTICAL to FORTUNE-4's `BANDS.md` states A, B and C. The merit: 33 places merited, 11 newly Endorsed, 16 newly Approved, base score equal to B's on all 900 | this push |
| the line again + landing check | IN PROGRESS. The line's tip 5fca4362d (point 91) is MERGED (0cf38c992; the hooks changed no file of the merge tree). The four conflicted registers were taken from the lane's side, then re-taken by their own doors, each in its own commit. (1) Wiring census, ae13a105e (`--check` exit 0; against the line only the lane's stamps and producerIndexFiles 1441 -> 1443). (2) Observed-shape, b5e20a45f (the gate's own message: six generated inputs changed, `--write` may absorb them; 2215 findings / 1553 identities / 445 files, bank 79/53, SCHEMA 46 KEPT, provenance only). (3) Writer-reach, 597fec7f4 (cohort 1383 -> 1366, exactly the line's 17 stale; against the line only ruling 3's moves). (4) Lighting census, cb43da78e (red, then the refreeze, then 34/34; files 3736 -> 3747). `tests/lint` WHOLE at cb43da78e: 223 files, 5 failed and 3357 passed, all five on RED-AT-LINE by name. RE-RUN AT 5fca4362d: the same five with identical details, except the sameness walker's TOTALITY (28 unregistered against the line's 27; the 28th is `fortuneMeritLines.js :: FORTUNE_MERIT_LINES`, which the lane registers itself on `samenessHideable.handPools.json`, in the wording unit). THEN THE LINE MOVED to f5295e425 (point 93): MERGED at eee2fe0ce (the hooks changed nothing). Two registers conflicted and were re-taken by their doors: the tuning inventory, 5691cd2e0 (people/goals.js GOAL_FAMILY_TUNING and LAW_PURSUIT_TUNING, dependents moved, no value moved; then 76/76), and the lighting census, 2fe23c0f6 (files 3741 -> 3752 against the line; 34/34). Wiring `--check`, the observed-shape gate (2215 findings, exactly) and writer-reach (HOLD) all passed with no re-take. STILL TO DO: the build with VERIFY_DIST, then the touched directories (`tests/generators`, `tests/data`, `tests/domain/display` whole, and the 146 domain, store and lib files that name a touched module), then `tests/build` whole, plus EVERY test file under `tests/` that names a module the lane changed (the chair, 03:23 UTC) | 0cf38c992, ae13a105e, b5e20a45f, 597fec7f4, cb43da78e |
| U5b-WORDING (rulings 5 and 7) | MERGED 2273a2331, the source diff read whole: A and C take B's opening VERBATIM, `ago` retired, `FORTUNE_MERIT_LINES` on the sameness hand list with `HAND_CEILING` 73 -> 74. RED at 2fe23c0f6: the two reworded-line titles, and TOTALITY 1 failed / 28 passed. GREEN, the builder's: new test 10/10; named files 39/39; `tests/lint` 3 failed / 3359 passed, the 3 on RED-AT-LINE; typecheck:ratchet 167/167; domain strict 1113/1113; lint 0 errors; the lighting census re-taken (titles 31632 -> 31634). RE-RUN BY ME at the merge: the new test and the sameness walker, 39/39. FIRST PAINT against 2fe23c0f6: raw 0, gzip -12, Brotli +66. The +66 is hash entropy: the entry chunk is byte-identical once the lazy chunks' hashes are normalized (EXECUTED). PAGES-BUILT.md re-rendered (252047285) | b7ee02d7f, 49ba2f7d6, 252047285; merge 2273a2331 |
| U5c-FIRSTPAINT (rulings 6 and 8) | MERGED d29cb4084, the diff read whole. `fortuneMerits.js` gets the last `ENGINE_SHARED_DOMAIN_EXCISIONS` row and a pin to its OWN `fortune-merits` chunk. Pinning it into `fortune-law` (as first ruled) was MEASURED and refused: the law's chunk gained a data-lazy edge, and `densityCreateBoundary`'s closure went 701,978 -> 2,642,547. U6's comment has two words corrected. THE SIZE ACCOUNT: below, section 5 | f2f56c734; merge d29cb4084 |

NEXT STEP: merge U5d (`briefs/U5d-ECO-ANCHOR.md`, test-only: arm (b) of `tests/domain/fortuneLawEconomyHeader.test.js` anchored on eligibility, not on a draw), re-run `tests/lint` whole (COMMON-EIGHTH 11), then send "FORTUNE <commit>" with `measures/REGISTERS-AT-LINE.md`, section 5's size account and the reds by name. RULE 8 IS DONE at 745bab4f3 (the line f5295e425 merged): `tests/build` 15 failed / 600 passed, all on the list; `tests/lint` 3 failed / 3359 passed, the line's three; the directories plus 288 named test files, 47 failed / 7596 passed, 46 on the list and the one U5d cures. FOR FORTUNE-7 AFTER THAT: `briefs/U7-LASTING.md`, then `briefs/U7b-LASTING-SENTENCE.md` (ruling 10).

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
4. (the chair, 02:58 UTC, from reading Cobamal; confirmed 03:23 UTC; SUPERSEDED at 03:38 UTC by item 5) A split of
   the wordings by the event's kind ("strikes" against "lived under"). The chair read the three pages at 48cbca5cf and
   accepted U5b, the re-measure and the hand-back.
5. (the chair, 03:38 UTC) THE ATOM IS NOT GRANTED AND THE SPLIT IS WITHDRAWN: no vocabulary row, no closed list, no
   `needsContext`. No wording says "hit". A and C take B's opening, and the `{ago}` time words retire (only `{past}`
   stays: "only a few years past" / "within living memory"):
   A "{event} is {past} at {place}; the place came through it, and its people hold the more firmly to {seat}."
   B "{event} is {past} at {place}; having come through it, people there are slower to turn on {seat}." (unchanged)
   C "{event} is {past} at {place}, and coming through it has left its people readier to stand by {seat}."
   No new need is declared; the pool goes through the door as before; the pick is unchanged. The pool's row goes on
   the sameness hand list (`HAND_CEILING` 73 -> 74, its comment extended), AFTER merging the line's f5295e425.
6. (the chair, 03:50 UTC) THE FIRST-PAINT CURE: `fortuneMerits.js` gains an `ENGINE_SHARED_DOMAIN_EXCISIONS` row AND is
   pinned into the `fortune-law` chunk, U6's form exactly (never the excision without the pin). U5a made this regression
   against U6's own proof; it is cured on the lane BEFORE the landing line. Proof: first paint's three figures beside
   the line's f5295e425 build, the residual named file by file; `fortuneLaw.js`, `bandLadders.js` and
   `legacyUnresolvedWordings.js` out of every first-paint chunk; `engineChunkLazy` green on the fresh dist; the
   `vite.config.js` comment true again. `vite.config.js` is shared between lanes: append only, the lines listed for the
   join. Churn on unchanged sources is accepted only as what remains once those four files are out, by its figure.
   The size account goes into this hand-back.
7. (the chair, 03:23 UTC, rule 8) Beside the directories, every test file anywhere under `tests/` that names a module
   the lane changed.

8. (the chair, 04:51 UTC) U5c: the merits go into A CHUNK OF THEIR OWN, `fortune-merits`, not `fortune-law`. It is
   committed if it meets five conditions: (a) the law's chunk imports nothing; (b) the static closures of
   densityCreateBoundary and settlementGenerateAction are not above the line's; (c) the four files are at 0 in first
   paint; (d) a guard in U6's form; (e) `tests/build` reds by name. All five were met. What is left over the line in
   `index` is said BY ITS CAUSE, in bytes, and goes on the owner's size-signing list as itemized.
9. (the chair, 04:51 UTC) The registers' table (`measures/REGISTERS-AT-LINE.md`, c906b2a94) is ACCEPTED as reported.
   The chair's landing runs its own comparison.
10. (the owner, 2026-11-22, verbatim: "I leave all decisions to you'd but got number 4 build it"; the chair, 04:51 UTC)
    THE SECOND MERIT (LASTING) IS BUILT BEFORE THE DEPLOY, by FORTUNE-7, as its own line ("FORTUNE-B <commit>"), after
    "FORTUNE <commit>". The briefs are `briefs/U7-LASTING.md` and `briefs/U7b-LASTING-SENTENCE.md`: the veil proof of
    `history.age` comes first; one DRAFT table of six ages, with the hamlet's 108 under the thorp's 269 said in plain
    words (`AGE_BY_TIER`: hamlet 30 to 120 years, thorp 15 to 300); its sentence drafted to the chair first. One law
    version holds both merits; no default flips. This strikes the prompt's "NOT YOURS: the second merit".

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

## 5. THE SIZE ACCOUNT (EXECUTED, production and sourcemap builds against the line f5295e425)

| state | first paint raw | gzip | Brotli | worker |
|---|---|---|---|---|
| the line f5295e425 | 1,179,511 | 375,172 | 315,169 | 2,671,005 |
| the lane 2fe23c0f6 (before U5c) | 1,186,120 (+6,609) | 377,705 (+2,533) | 317,071 (+1,902) | 2,676,534 |
| the lane f2f56c734 (U5c) | 1,179,678 (+167) | 375,202 (+30) | 315,132 (-37) | 2,676,534 (+5,529) |

- BEFORE U5c, by file: `fortuneMerits.js` +1,898 (engine-core); `fortuneLaw.js` +1,749 (`fortune-law`, then in the
  closure); `bandLadders.js` +2,386 (data); `legacyUnresolvedWordings.js` +65; about +440 of minifier churn. ONE CAUSE:
  U5a's merits rode eager engine-core through ESD. CURED by U5c.
- AFTER U5c, the residual +167 raw is all in the entry chunk, itemized byte for byte. 69 B are the two lazy chunk
  names (`fortune-merits`, `fortune-law`) in its preload map (`__vite__mapDeps`). 98 B are their index entries in the
  16 dynamic imports that preload them (93), plus renumbering (5). This is the real cost of two lazy chunks, FOR THE
  OWNER'S SIZE SIGNING.
- THE WORKER, +5,529 over the line, itemized from sourcemaps (EXECUTED). By file:
  - `fortuneMerits.js` +1,892 and `fortuneLaw.js` +1,669;
  - the size-relative standing: `factionDynamics.js` +637, `power/rosterText.js` +616, `economy/prosperity.js` +510;
  - `steps/assembleSettlement.js` +118 and `legacyUnresolvedWordings.js` +71;
  - `legacyGenerator.js` -34, and +1 to +21 in five other generators.
  The worker runs the birth, so all of it is the law's own code, truly needed there. FOR THE OWNER'S SIZE SIGNING.
  The line's own worker figure is already red against its ceiling (2,579,708).
- Earlier, now superseded: FORTUNE-4 section 3 ("after U6 about +58") predates U5a.

## 6. FOR FORTUNE-7: WHAT LASTING NEEDS (written 2026-11-22 07:5x UTC; the chair's E45 seats FORTUNE-7 now)

Read with `briefs/U7-LASTING.md` and `briefs/U7b-LASTING-SENTENCE.md` (the chair's decision E32 is in both). Cut NO builder
until the chair names "FORTUNE <commit>" to you; then stand on that commit.

**WHERE THE MERIT'S GATES AND POINTS LIVE** (read whole: `src/domain/fortune/fortuneMerits.js`, `fortuneLaw.js`):
- `MERIT_NAMES` is the list of counted merits. Today it is `['weathered']`; LASTING adds `'lasting'`.
- `meritsOf(settlement)` is THE predicate. The birth, the sentence and the neutral-reading cure all import it, and none
  restates it.
- The gates are in `meritsOf`:
  - the base score at Tolerated or better, read from `data/bandLadders.js :: LEGITIMACY_CUTS.tolerated`;
  - no ruler-trouble tension (`rulerTroubled`, `FORTUNE_LAW_TUNING.standing.rulerTroubleKinds`).
- The points: `meritedLegitimacy(legitimacy, names, bandFor)` adds `standing.meritPoints` (10) per merit, upward only.
  Endorsed needs `standing.endorsedMinReasons` (2) reasons, and a merit is a reason.
- The write is `settleMeritsOfRule(settlement, seams)`, the assembly step's tail
  (`generators/steps/assembleSettlement.js`). Law 1 writes no byte.
- The weathered merit's own input is `weatheredCatastrophe(settlement)` (`historicalEvents[]`, catastrophic,
  `yearsAgo <= standing.weatheredWithinYears` (40), its kind naming no tension of today, no unresolved legacy note via
  `data/legacyUnresolvedWordings.js`).
- First paint: `fortuneMerits.js` is EXCISED from ESD and pinned to its own lazy `fortune-merits` chunk (U5c,
  `vite.config.js`). A new import into it lands in that chunk. Rebuild and read `engineChunkLazy`'s U5c block.

**THE SENTENCE DOOR** (U5b's form, `display/governanceAccount.js :: governanceAccountOf`, section "2. THE STANDING"):
- It is pushed right after the standing sentence, only where `meritsOf(...)` credits the merit.
- The wording comes from `drawDeclared(POOL, { draw: (pool) => pickVariantMixed(pool, identity), key, facts, poolId,
  surface: 'power', drawKind: 'H' })`, then `{slot}` fills.
- The pool is its OWN data file (`src/data/fortuneMeritLines.js` is the model), imported only by `governanceAccount.js`
  (lazy).
- The pool goes on `tests/lint/samenessHideable.handPools.json`, and `HAND_CEILING` is raised by one with its comment
  extended, by the chair's word.

**THE VEIL PROOFS' FORM** (`tests/domain/fortuneMeritSentence.test.js`): each wording by each band is the same string on
the owner's record, on `toPublicSafe(record)` (`display/publicSafe.js`) and under the widest veil
(`display/galleryVeil.js`, every hideable grouping shut), on the six places of `measures/sentences/PAGES.md`. That is the
"eighteen equalities". LASTING's input (`history.age`) needs the same proof BEFORE the merit is built (U7 step 1).

**THE LIT RE-MEASURE'S RECIPE** (`measures/bands/BANDS-LIT.md`, `lit-run.mjs`, `lit-report.mjs`):
- The visitor's pool is `measure-lit.mjs :: visitorJob`: seeds `visitor-<size>-0..149`, 900 births a state.
- `node lit-run.mjs <tree> <state> '<force-json>' <out.jsonl>`, then `node lit-report.mjs A.jsonl B.jsonl C.jsonl`.
- A state without a merit is a PLANT in a `git archive` scratch copy (e.g. `meritsOf` returning `[]`), checked by
  `diff -r` to the one line.
- Run through the mutex. Expect state D to equal `BANDS.md`'s D byte for byte.

**WHAT BIT ME** (each cost a stop and a ruling):
1. A NEW IMPORT INTO AN EAGER MODULE IS A FIRST-PAINT RISE. `computeEngineSharedDomain` puts every domain module a
   generator imports into eager engine-core: U5a's merits did, and dragged the law and two data files with them
   (+6,609). Build and read the closure (`scratchpad/fp-closure.mjs` and `sm-attr.mjs`, copies in section 5's method)
   before you call any unit green.
2. PIN A LAZY MODULE TO ITS OWN CHUNK, never into the law's: data imports give an import-free chunk a `data-lazy` edge,
   and the create boundary's closure triples.
3. Brotli moving with raw at 0 is chunk-hash entropy. Prove it by normalising `-XXXXXXXX.js` in the entry chunk.
4. A new import moves WRITER-REACH: identities leave the dark cohort and closures grow. That is the chair's to rule
   (rule 9); state every movement.
5. A NEW POOL needs its row on the sameness HAND list (TOTALITY red) after merging the line that carries the walker.
6. A NEW TABLE ROW in `FORTUNE_LAW_TUNING` costs first-paint bytes only if the law's chunk is in first paint (it is
   not now). A wording threshold is NOT a law tuning: it lives beside its words (ruling 2).
7. A TEST ANCHORED ON A DRAW BREAKS WHEN THE LINE REGENERATES POOLS (U5d). Anchor on eligibility.
8. `it.each` raises the lighting census's park count; write plain tests.
9. MERGING THE LINE: take THE LINE'S SIDE of every register, then its door (the chair, 04:23). The lane's side hides a
   shrink-only raise. Then compare three ways (`measures/REGISTERS-AT-LINE.md`).
10. The observed-shape register needs an explained-writer row for a key written only under law 2 (rung 46, this
    lane's). If LASTING writes a NEW key, a rung 47 is the chair's call.
11. COMMON-EIGHTH 11: `tests/lint` WHOLE after ANY test-file change, before calling a commit green.
