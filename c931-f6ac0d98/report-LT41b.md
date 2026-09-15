# LT41b — THE CHAIR'S RULINGS ON THE VOICE GUARD'S HELD ITEMS

Dock `kit/lane-LT41-voice`, base `c351fdb44` (LT41 car 3). Four cars ON TOP; nothing rebased,
nothing pushed, no migration, no deletion, no dependency, no ceiling raised.
**Porcelain 0 after every car.** Seal owed: `refs/preserve/lt41b-rulings-2026-09-15` (the chair's act).

    919c37da5  Register (census car): the lighting census re-freezes at the LT41b car-6 tip
    a76fe8cdf  LT41b car 6 (RULING 3): the three separator conventions collapse to ONE
    89f4a622a  LT41b car 5 (RULING 2): the five origin-prose dashes are REFUSED
    c404e1321  LT41b car 4 (RULING 1): the eleven conflict sentences are recast
    c351fdb44  (base)

Every car declares its §764.3 same-seed text shift in its own body. The golden master is ALREADY
525/525 red at the slot (the em-dash wave, banked §901), so no car claims "green": each proves THE
RED SET IS IDENTICAL ROW FOR ROW, by a probe replicating the suite's own comparison line for line
(vitest truncates a 525-element array in its diff). The probe was deleted before every commit.

---

## CAR 4 — c404e1321 — RULING 1: the eleven sentences CURED

Files: src/generators/crossSettlementConflicts.js ·
tests/copy/.voice-mechanics-generators-baseline.json · tests/copy/voiceMechanics.test.js

The eleven at :82 :86 :94 :100 :103 :107 :111 :115 :116 :134 :153 recast VERBATIM from the chair's
authored sentences (not re-authored), under the claim freeze.

THE DEDUPE-KEY PROOF (executed). RelationshipsTab.jsx:82 dedupes persisted against live on
`x.description?.slice(0, 40)`. Corpus generated two ways from the lane's own makeSettlement
fixtures: the deterministic wrapper over all ten relationship types, plus an EXHAUSTIVE template
sweep driven by a stub rng whose pick() returns pool[i], i = 0..3 — which reaches every template
rather than hoping a seed lands on one. All eleven dashed templates present at the base.

    BASE (c351fdb44): 240 rows · 125 distinct descriptions · 70 carrying ' — '
                      min(indexOf(' — ')) = 58        ⇒ ≥ 40, with 18 to spare
    TIP  (car 4):     240 rows · 70 descriptions moved · 0 carrying ' — '
    DEDUPE-KEY DIFFS (first 40 chars, row for row): 0 of 240
    moved descriptions whose dedupe key is unchanged: 70 of 70

NO TEXT PIN MOVED — THERE IS NONE. `git grep -F` at HEAD for each of the eleven sentence stems
returns the producer line and nothing else. The suite pins structure only and is untouched.

REGISTERS. Tier-5 baseline 39 em over 8 files -> 28 over 7 by the documented
`UPDATE_VOICE_BASELINE=1` run (` Test Files  1 passed (1)` / `      Tests  28 passed (28)`); the
crossSettlementConflicts.js row is GONE, not lowered. Tier-2/Tier-3 baselines byte-identical
(49a35259…, ca3d163b…). EM_BUDGET_GENERATORS banked DOWN 39 -> 28.

GOLDEN RED-SET DIFF
    BASE c351fdb44: rows=525 manifestKeys=525 driftRows=525
    TIP  car 4:     rows=525 manifestKeys=525 driftRows=525
    diff of the two sorted failing-row key sets:  EMPTY (exit 0)
    ` Test Files  1 failed (1)` / `      Tests  1 failed | 2 passed (3)`
    `AssertionError: expected [ …(525) ] to deeply equal []`
The base arm was reached by restoring the three files from HEAD BY FILE COPY (no `git stash`, no
`git checkout --`) and restored byte-identically afterwards, verified by sha256.

GATE, VERBATIM — `11:49  up 2 days, 15:40, 1 user, load averages: 8.21 18.34 15.24`
    npx vitest run tests/generators/crossSettlementConflicts.test.js tests/generators/crossSettlementCovertVassal.test.js tests/copy/voiceMechanics.test.js
      ` Test Files  3 passed (3)`      / `      Tests  42 passed (42)`
    npx vitest run tests/generators
      ` Test Files  111 passed (111)`  / `      Tests  1010 passed (1010)`
    npx vitest run tests/copy
      ` Test Files  10 passed (10)`    / `      Tests  130 passed (130)`
    npx vitest run tests/lint                    (load avg 34 → 156)
      ` Test Files  155 passed (155)`  / `      Tests  2599 passed (2599)`
    npm run check:quick                          exit 0
      `  validate-packets: exit 0, 661 ms`   `  typecheck-full: exit 0, 22884 ms`
      `  typecheck-domain: exit 0, 23150 ms` `  lint-changed: exit 0, 3517 ms`
      `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).`
      `[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).`
No census bill (no test title added); the lighting walker is green inside the whole-lint run.

---

## CAR 5 — 89f4a622a — RULING 2: REFUSED, no code moved

Files: tests/copy/voiceMechanics.test.js (comment only)

settlementOriginProse.js and its canonical-at-zero pin are untouched. Four grounds written at the
tier block: (a) R-DST-W4-f at docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5141-5150, restated at
:5418 — verified verbatim in this dock; (b) DS-GEN-6's RECEIPT at :5414 names the file, so the
surface is NOT unlaned as the 09-14 classification supposed; (c) the dash is mechanically
load-bearing and the file says so at :139-143 (${CHANNELS_TOKEN} is a LIST; a comma reads as a
fifth channel); (d) :136 is index 0 of isolated.deficit, transcribed independently into
tests/generators/settlementOriginProse.test.js:62 under RR law 1.

GOLDEN RED-SET DIFF: BASE c404e1321 driftRows=525 · TIP driftRows=525 · diff EMPTY (exit 0).

GATE, VERBATIM — `12:00  up 2 days, 15:52, 1 user, load averages: 60.19 66.07 49.48`
    npx vitest run tests/copy/voiceMechanics.test.js  ` Test Files  1 passed (1)` / `      Tests  28 passed (28)`
    npx vitest run tests/generators                   ` Test Files  111 passed (111)` / `      Tests  1010 passed (1010)`
    npx vitest run tests/copy                         ` Test Files  10 passed (10)` / `      Tests  130 passed (130)`
    npx vitest run tests/lint          (load 25→254)  ` Test Files  1 failed | 154 passed (155)`
                                                      `      Tests  1 failed | 2598 passed (2599)`
      the 1 = `Error: Test timed out in 20000ms.` on sovereigntyLighting DOOR 3 at 26026ms
      MEASURED ALONE: ` Test Files  1 passed (1)` / `      Tests  34 passed (34)`
    npm run check:quick                               exit 0
      `  validate-packets: exit 0, 1000 ms` `  typecheck-full: exit 0, 29753 ms`
      `  typecheck-domain: exit 0, 19052 ms` `  lint-changed: exit 0, 1882 ms`

---

## CAR 6 — a76fe8cdf — RULING 3: three conventions collapse to ONE

Files (11): src/generators/power/governanceNarrative.js · src/domain/display/labelBands.js ·
src/domain/display/stateProse/powerStateProse.js · src/domain/simulationSpine.js ·
src/generators/aiLayer.js · docs/content/wiring-census.json · tests/copy/voiceMechanics.test.js ·
tests/domain/powerStateProseDesk.test.js · tests/generators/aiLayer.test.js ·
tests/generators/governanceNarrative.test.js · tests/lint/vocabularyTotality.walker.test.js

Nine `<Band> — <gloss>` labels become `<Band> (<gloss>)`; :289 becomes
`Critical (active siege, survival priority)`; the `<Band>; <note>` annotation folds into the gloss
via `withGloss`. BAND WORDS UNCHANGED, so vocabularyTotality is green with NO entry added or removed.

THE FULL CONSUMER CENSUS, taken before a byte was edited:
  1. generators/power/governanceNarrative.js — EDITED (nine labels + the annotation composer).
  2. domain/display/labelBands.js — bandOf separator-agnostic by construction. NO CODE CHANGE;
     header records the collapse and the forever-tolerance law.
  3. display/stateProse/powerStateProse.js — stabilityPoolKey reads the first word. NO CODE
     CHANGE; two docstring quotes re-spelled.
  4. domain/simulationSpine.js — classifierWord reads the first word. NO CODE CHANGE; :634 quote
     re-spelled.
  5. generators/aiLayer.js — ORDERED_STABILITY_RE anchors the band word (no branch moves);
     formatStability returns the label verbatim, so THE AI PROMPT TEXT SHIFTS. Docstring re-spelled.
  6. SummaryTab.jsx:213 — stabilityBandOf(…) ?? … : tile BYTE-IDENTICAL. NO CHANGE.
  7. SummaryTab.jsx:40 — ⚠ DECLARED TEXT SHIFT: .replace(/[()]/g,'') makes
     "unstable — criminal governance" read "unstable criminal governance", matching its
     already-parenthetical siblings. NO CODE CHANGE.
  8. SummaryTab.jsx:134 — label verbatim into the markdown export. Text shift, no parse.
  9. domain/summary/settlementQuickGuide.js:221/:225 — label verbatim into a sentence. Text shift.
 10. components/new/dailyLifeLogic.js:37-39 — ps.stability ?? 50, compared NUMERICALLY at
     DailyLifeTab.jsx:354 (pre-existing documented trap, spelling-independent). NO CHANGE.
 11. generators/narrativeGenerator.js:609-610,:829 — includes('occupation'/'suppress'/'Unstable'/
     'Fractured'); all unmoved. NO CHANGE.
 12. generators/power/settlementNarrative.js:116-118 — band-word includes. NO CHANGE.
 13. pdf/lib/headlines.js:72 — powerTone whole-string equality; matched no compound label before
     or after. NO CHANGE, and the pre-existing dead branch is NOT this car's to cure.
 14. generators/servicesGenerator.js:211 — '(criminal governance)' is a pseudo-provider, not the
     label. LEFT ALONE per the brief.
 15. compendium/generated/compendiumData.generated.js — NO CHANGE, NO REGENERATION. Its governance
     block carries BAND WORDS with authored readings; scripts/generate-compendium-data.mjs states
     in source that the vocabulary is "authored from governanceNarrative's parentheticals" and does
     not import the producer; `git grep -F` for each of the nine finds nothing in the generated
     file. THE MINT-TRIGGER QUESTION NEVER ARISES.
 16. settlements/HealthPip.jsx:39 — renders pip.band. NO CHANGE.
 17. domain/display/glossary.js — stability-band entries come from BAND_HINT, a DIFFERENT
     vocabulary. NO CHANGE.
 18. tests/generators/governanceNarrative.test.js — TWO PRODUCER PINS MOVE WITH THE PRODUCER in
     the same commit (:59, :72).
 19. tests/generators/powerAdversarialRemediation.test.js — pins 'Tense (external threat)' ×3,
     already the target form. NO CHANGE.
 20. tests/generators/aiLayer.test.js — retired spellings KEPT as persisted-save tolerance; live
     spellings added beside them (no new test title).
 21. tests/domain/powerStateProseDesk.test.js — REAL_STABILITY RE-SYNCED; RETIRED_STABILITY added
     and walked by the same existing arms (no new title) plus a non-vacuity check.
 22. tests/lint/vocabularyTotality.walker.test.js — the three existing bandOf assertions KEPT
     VERBATIM as tolerance; THE NEW NINE-SPELLING ARM ADDED.
 23. tests/copy/voiceMechanics.test.js — the NINE allowlist entries RETIRE and the file leaves the
     list entirely.
 24. CORPUS — NOTHING IS HELD. `git grep -F` for all nine over docs/content,
     src/domain/display/stateProse and src/data returns only the two powerStateProse.js DOCSTRING
     quotes. No DS-* row, desk, shipped leaf or corpus face touched.
 25. docs/content/wiring-census.json — RE-TAKEN by its own script (finding 2 below). One sha line;
     0 rows, 0 bytes, 0 rate figures moved.

LIFECYCLE — NO MIGRATION, NO SAVE REWRITE. The label is persisted in every save; the retired
spellings keep arriving forever. All four readers were already tolerant BY CONSTRUCTION and none
changed. Pinned by the new arm ("the NINE RETIRED stability spellings recover the same band as
their live twins"), which also asserts the band is non-null, that the two strings differ, and that
the producer ships the live spelling. Independently probed: retired band === live band, both
non-null: 10/10.

THE DRAW DOES NOT MOVE (executed). DS-POW-2 draws on stabilityPoolKey, not on the label text. Over
10 retired/live pairs × 5 seeds: samePoolKey 50/50 · sameDrawnRung (excluding the glance) 50/50 ·
glanceMoved 50/50. The glance moving on all fifty is the control: the probe CAN see a difference,
and the only one it sees is the declared one.

TWO FINDINGS THE BRIEF DID NOT PREDICT
  1. A CEILING CAUGHT THE CAR, AND THE CEILING WON. The first withGloss docblock took
     governanceNarrative.js 793 -> 819 against MODULE_LINE_CEILING = 800:
     `AssertionError: expected [ 'governanceNarrative.js: 820 lines' ] to deeply equal []`
     THE CEILING WAS NOT RAISED. The argument moved to labelBands.js's header (where a reader of
     the recovery meets it anyway); the file now measures 799 — one line BELOW the ceiling.
  2. A SECOND CENSUS BILL. Re-spelling two COMMENTS in powerStateProse.js staled the prose-wiring
     census stamp (stale-stamp, two arms, 89ms/17ms — not timeouts). `--dry` first:
     `bytes committed 2060855 · fresh 2060855 · delta 0` / `sections that would move: stamp` /
     `ROWS that would move: 0`. Paid with `node scripts/wiring-census.mjs` (never by hand):
     `[wiring-census] wrote docs/content/wiring-census.json — 708 pools, 165 relation rows, 7 stamped files`
     One sha line; totals hold at 708 pools / 2266 variants / 165 relation rows / 7 stamped files.
     Re-run green: ` Test Files  2 passed (2)` / `      Tests  99 passed (99)`.
  3. (also found) REAL_STABILITY's header claimed producer fidelity while holding 15 of the
     producer's 21 labels, and its Suppressed row spelled an em dash where the producer has always
     written a COLON. Both corrected; the table is now 21 of 21 plus one composed fold.

REGISTERS. Allowlist 21 distinct generator strings over 5 files -> 12 over 4; declared occurrences
23 -> 14. ⚠ THE TIER-5 BASELINE DOES NOT MOVE AND NEVER COULD — an allowlisted literal counts as
em 0, so governanceNarrative.js was never IN it. Proved: the documented UPDATE_VOICE_BASELINE=1 run
leaves ALL THREE baselines byte-identical (49a35259…, ca3d163b…, 5d0bd698…).

GOLDEN RED-SET DIFF: BASE 89f4a622a driftRows=525 · TIP driftRows=525 · diff EMPTY (exit 0).

GATE, VERBATIM — `13:10  up 2 days, 17:02, 1 user, load averages: 9.66 59.76 97.21`
    focused suite of EVERY file touched (9 files)
      ` Test Files  9 passed (9)`             / `      Tests  320 passed (320)`
    npx vitest run tests/generators
      ` Test Files  1 failed | 110 passed (111)` / `      Tests  1 failed | 1009 passed (1010)`
      the 1 = `Error: Test timed out in 20000ms.` (timelineVariety, 29772ms)
    npx vitest run tests/copy
      ` Test Files  10 passed (10)`           / `      Tests  130 passed (130)`
    npx vitest run tests/domain                       (load avg 54)
      ` Test Files  3 failed | 977 passed (980)` / `      Tests  3 failed | 16530 passed (16533)`
      all three `Error: Test timed out` (240000ms, 20000ms ×2)
    npx vitest run tests/lint                         (load avg 186)
      ` Test Files  11 failed | 144 passed (155)` / `      Tests  11 failed | 2589 passed (2600)`
      EXACTLY ONE of the eleven is an assertion — this car's own census bill, at 90ms:
        `AssertionError: the live TEST-title count moved … expected 24170 to be 24169`
      the other TEN are `Error: Test timed out` (20000ms / 120000ms budgets)
    MEASURED ALONE — all eleven timed-out suites, every one passes:
      8 lint files        ` Test Files  8 passed (8)` / `      Tests  252 passed (252)`
      4 gen/domain files  ` Test Files  1 failed | 3 passed (4)` / `      Tests  1 failed | 111 passed (112)`
        (stateProseKernel's chi-square arm still timed out at 25258ms in company of three — the
         estate has measured that suite's law-6 contention cost at 8.3× — so, alone:)
      tests/domain/stateProseKernel.test.js ` Test Files  1 passed (1)` / `      Tests  38 passed (38)`
    npm run check:quick                               exit 0
      `  validate-packets: exit 0, 1138 ms`  `  typecheck-full: exit 0, 40542 ms`
      `  typecheck-domain: exit 0, 57075 ms` `  lint-changed: exit 0, 5445 ms`
      `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).`
      `[domain-strict] ✓ no strict-type regressions (1120 errors, ceiling 1120).`

---

## CAR 6b — 919c37da5 — the lighting census re-freeze (its own commit, clean tree)

    titles        24,169 -> 24,170     the one new arm in car 6
    files 2,563 -> 2,563 · parked 375 -> 375 · credited 2,188 -> 2,188 · suiteTitles 6,452 -> 6,452
    measuredAtSha cea20ddb (2026-09-09) -> a76fe8cd (2026-09-15)

Four of five figures re-measured IDENTICAL — a control on the instrument as much as a reading of
the tree. The refreeze EXITS NON-ZERO BY DESIGN; the plain re-run is the proof:
` Test Files  1 passed (1)` / `      Tests  34 passed (34)` at
`13:46  up 2 days, 17:38, 1 user, load averages: 5.88 34.32 77.52`.
Golden red-SET still identical at this tip (driftRows=525, diff empty).

---

## EVERY JUDGMENT — chose X over Y because Z

1. Car 5's ruling went in the TIER DOCSTRING, not the baseline JSON's reason string (the brief
   offered both) — because that JSON is MACHINE-WRITTEN: writeShrinkOnlyBaseline emits {em, bang}
   and nothing else, so a hand-added field would be wiped by the next documented refreeze AND
   would break the property car 2 proved by sha256. A ruling a refreeze can delete is not a ruling.
2. The `; ` annotation FOLDS into the gloss rather than opening a second parenthetical — because
   `<Band> (<gloss>) (<note>)` honours the letter of "one convention" and breaks its point.
3. EM_BUDGET_GENERATORS lowered 39 -> 28 with the baseline — because a ceiling that keeps the
   headroom a cure just bought is a ceiling that never cured anything. Down only, never up.
4. NO in-tree dedupe-key ratchet was built in car 4 — the brief asked for a proof, not a pin; this
   car neither creates nor worsens that hazard (proved untouched), and a new pin would owe a
   lighting-census re-freeze the chair did not budget into a three-car sequence. DEFERRED,
   DOCUMENTED IN THE COMMIT BODY, NOT A BUG TO RE-FIND — it belongs to the item that owns
   RelationshipsTab's dedupe.
5. The retired spellings were KEPT beside the live ones in every test, never replaced — because the
   label is persisted and never migrated, so tolerance is a live contract, not history.
6. The wiring-census re-take rides IN car 6 rather than its own commit — the stamp is a measurement
   OF that tree and is meaningless taken against any other. (The lighting census is the opposite
   case: it refuses a dirty tree, so it must be its own commit.)
7. REAL_STABILITY was COMPLETED to 21 of 21 rather than its header softened — a fidelity table
   quietly missing a quarter of its producer cannot red when a new label arrives.
8. The powerTone dead branch (pdf/lib/headlines.js:72) was REPORTED, not fixed — pre-existing,
   spelling-independent, out of this ruling's scope.

## HELD / NOT DONE, with reasons

- NOTHING WAS HELD. No corpus face, DS-* row or desk quotes a stability label verbatim, so the
  brief's HOLD-and-report path was never triggered. The compendium regenerator was never run
  because nothing in its output changes, so the mint-trigger HOLD never triggered either.
- The second seal `refs/preserve/lt41b-rulings-2026-09-15` is NOT created — sealing and
  cherry-picking onto laneCONSIST-930 are the chair's acts, not this lane's.
- docs/REWRITE_RECUT_PROGRAM_PLAN.md still carries LT41 car 3's deferred amendment (a ledger-branch
  document that does not exist on this branch). Unchanged by these cars; the owner row it proposes
  should now read that the ELEVEN were CURED and the FIVE ruled LAWFUL.
- Nothing pushed, deployed, migrated or deleted. No package.json/lockfile byte. No `git stash`, no
  `git checkout --`, no `git reset --hard`. No other dock touched.
