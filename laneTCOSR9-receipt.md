# laneTCOSR9-receipt — the OSR schema-9 mint charter lane

**Lane:** TC-OSR9, COMPILE/CHARTER (chair-tier, ODQ §343.1(c)). **Date:** 2026-08-21/22.
**Wrote nothing in the repository, moved no ref, touched no worktree.** All repo reads via
`git show`/`git archive` extraction into the session scratchpad.

**Pinned subject:** `refs/heads/claude/composite-r4` @
`27c250f94bb7c5c799693a62985c5ddecd4b6c7c` (unchanged from laneMEAS's re-executed tip).
ODQ read at ledger branch `review-fixes-2026-07-08` @ `0ab3d655` (§338 :14316, §346 :14537).
Schema-8 genesis referenced: `3df85a3aa33b60be5983ebede63375d8d0fae8f5`.

**Deliverable:** `<scratchpad>/draft-OSR9-MINT.md` — the executor charter.
**Extraction:** `<scratchpad>/OSR9-tree/` (instrument + tests + baseline at the pinned tip).

## Inputs read in full or in load-bearing scope
laneMEAS-minkeys-memo.md (whole) · ODQ §338 + §346 (whole rows) ·
archive-2026-08-osr-schema-program.md (whole) · check-observed-shape-readers.mjs
(≈1,900 of 2,427 lines: header/filters/M8-M9 bank/freeze/history/args/run) ·
migrate-observed-shape-readers.mjs (constants, transition law, heuristic report, review
ledger, bundle, run) · observed-shape-baseline.mjs (schema constants, validators, tag
grammar) · observedShapeSentinel.test.js (titles + M8/M9 + A5 pins) ·
observedShapeMigration/Baseline/walker test pin surfaces · the committed baseline JSON
(envelope, rowTags, eventLog + institutions inventory slices) · package.json scripts ·
.husky/pre-commit · the EP-1 hunk and package.json hunk (freeze-SHA diff).

## Executed measurements (CONFIRMED — quoted output in the transcript)
1. `git diff 3df85a3a..27c250f9` over the 11-path detector universe → EXACTLY
   `package.json` (+2 script lines) and `observed-shape-corpus.mjs` (+23, EP-1).
   `package-lock.json` unmoved. Confirms the memo's two named drift causes at file level.
2. **NEW FINDING — a third drift cause:** `git diff --name-only` over `src/` filtered to
   `.json`/`.generated.js` → exactly `src/data/dossierStateProse/warFaith.generated.js`
   changed since the schema-8 genesis (175 src files total). `.generated.js` is subject-but-
   unscanned, so the committed `unscannedInputDigest` no longer reproduces — the gate's
   `:2161-2163` check and the transition law's `:561-566` equality demand BOTH trip on it.
   §346.2's cause list is therefore incomplete; the charter carries the consequence (CH-6).
3. Baseline JSON: schema 8; `frozenAtSha == migrationReview.subjectSha == 3df85a3a` — the
   live baseline IS its own genesis, so the transition-predecessor demand (`:517`) and the
   write's byte-binding (`:2133`) are jointly satisfiable. 1998/1412/387; four tagged
   identities (44 reads / 31 addresses); the four §346.1 eventLog identities occupy 9
   untagged addresses / 16 reads incl. 3 addresses in chronicleFeed.js.
4. Pre-commit hook = `npx lint-staged` only — no test census; the C1→C2 red window blocks
   no commit.
5. `check:observed-shape-readers` standalone — absent from `npm run check`, CI, husky
   (grep over package.json scripts, ci.yml, both hook files).

## Mechanics determined from code (the charter's spine)
`--migrate-schema=<live>` refused while schema already matches (`:2128`); ordinary `--write`
throws on the digest move (`:2161-2168`) → the lawful path is: C1 commits the schema-9
instrument code, the migrate script builds report→review→bundle at C1, the check script's
`--write --migrate-schema=9 --migration-review=<bundle>` writes the baseline on the clean
committed C1 tree, C2 commits it; prove in-tree AND detached at C2; never amend C1 (the
subjectSha must stay a committed ancestor). Three code-law traps found and chartered as
required fixes: the `rowTagsOf` genesis condition null-reason trap (`:1864-1883` — a
declaration-adding mint is impossible as written), the hard-coded 4-path delta
(`unchangedPaths.length !== 7`, migrate `:557`), and the unreviewable unscanned-input
equality (migrate `:561-566`).

## Archive-law verification (each checked against the live instrument before repeating)
- "the OSR gate CANNOT pass pre-commit — prove DETACHED": holds, refined — the genesis
  window C1→C2 is un-greenable by design (`validateBaselineHistory` needs the committed
  descendant); pre-commit itself runs no OSR machinery; the detached proof is chartered S11.
- "a shrink re-freeze is plain --write, NOT genesis": holds in code (maintenance path) and
  is NOT this case — the digest drift makes ordinary --write throw; this is a full mint.
- "a dependency bump is a mint trigger": holds and is WIDER than stated — any package.json
  byte change is (the +2 scripts moved the digest with the lock untouched).

## Judgments (all vetoable, recorded in the charter §8)
J1 unscanned movement reviewable for target 9 (vs block-and-escalate) · J2 no hard same-only
inventory invariant for target 9 (review-reconciled; unattributable growth = STOP-RAISE) ·
J3 `genesis = predecessor.schema !== BASELINE_SCHEMA` in rowTagsOf · J4 entry shape
(save-time-writer / applyEvent.js / appended alphabetically) · J5 C1/C2 pin split with a
declared one-test red window · J6 stresses-on-institutions chartered as procedure+routing
(advisory evidence: BOTH `pressures` and `stresses` on institutions are untagged rows in
viewModelBodySlices.js — likely a real dead arm, not pre-decided).

## Labels
Everything under "Executed measurements" is CONFIRMED with quoted output. The charter's
step order and pin table are CONFIRMED at the source-reading level (the cited lines were
read at the pinned SHA); the post-mint FIGURES (banked 60 reads / 40 addresses etc.) are
PLAUSIBLE arithmetic marked STOP: RE-DERIVE — the executor re-measures every one. Nothing
in this lane ran the corpus, the scan, or any vitest suite; no behavioral claim about a
future run is made without the S-step that produces it.

*The chair reviews; queue slot 4's executor dispatches from draft-OSR9-MINT.md.*
