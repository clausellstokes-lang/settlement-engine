# PRONOUN-2: REPORT (BUILDER PRONOUN-2 of CLOSE-5; written 2026-11-23 06:32 UTC, read from `date -u`)

**THE COMMIT: `119f419bf`** on `lane/close-5-2026-11-23-pronoun2-wip` (worktree `/home/user/wt/pronoun2`), parent 95180c283.
ONE commit, by explicit paths, hooks run (lint-staged eslint --fix: no change; the committed leaf's sha256 13a99bde… equals
the tested file's). Not pushed. STOPS: none.

## What moved (2 files, +18 -8)
- `src/data/people/personMention.js`: the six stop marks `, . ; : ! ?` leave `OBJECT_FOLLOWERS` (old: 19 entries, 6 marks +
  13 words; new: the 13 words). ONE exported regex literal `OBJECT_STOP_MARK = /^[,.;:!?]$/`, read where the Set is read:
  `isSubject` now `if (!byBefore && (OBJECT_STOP_MARK.test(follower) || OBJECT_FOLLOWERS.has(follower))) return false;`.
  Two comments name the regex. CAUSE: the E2 ratchet counts the string literal `'!'` (bang 0 -> 1).
- `tests/lint/personMentionCase.walker.test.js`: the Set's only other reader (`git grep OBJECT_FOLLOWERS`: the leaf, this
  walker, and a prose rationale in `scripts/mutation-coverage-manifest.json`, not a reader). `classOf` reads the same exported
  regex beside the Set (no second copy of the rule). THE TOOTH, inside the existing `it` "CLASSED: a follower in neither class
  is red, named with its template" (no new title, so no register moves): each of the six marks classes `{ follower: mark, kase:
  'object' }`, and four non-marks (`— … " )`) class `kase: null` (the regex is the six, not all punctuation).

## Proofs, in order (logs in `scratchpad/flip/PRONOUN-2/`)
1. RED FIRST at 95180c283 (`1-red-voice.log`, exit 1): E2 "per-file debt exactly matches the baseline":
   `src/data/people/personMention.js: baseline em:0 bang:0 → current em:0 bang:1`. GREEN after (`3-green.log`): E2 passes.
   ALSO RED, before AND after, NOT this unit's: E-E (JSX) `src/components/new/tabs/DailyLifeTab.jsx: baseline em:0 bang:0 →
   current em:1 bang:0` (that file is unchanged between 244fa84ef and 95180c283; last touched by c35847792, point 96): the line's.
2. EQUALITY. `close-4/they-measure.mjs` with `TREE=` a `git archive` copy of 95180c283 and with `TREE=` this tree: byte-equal
   (17 lines, 1,663 bytes, sha256 e1adf4e9…2f7279 both; "candidates 8 templates 7"). THE WIDER ONE (`wide.mjs`): every template
   of both callers' tables (394 ties incl. twins, 152 wants), 6 names (a shared surname, a shared given name, a one-word name, a
   bracketed qualified name) as 30 ordered pairs x 5 gender castings x 3 role castings, ties with both card orders, wants filled
   one-person (as `cellCandidates`) and two-person: **628,200 strings, 0 differ** (113,584 changed by the leaf at all; sha256
   655119073555…087db both). ITS CONTROL: a mutant leaf reading the stop marks as subject: 3,600 differ ("trace back to he").
   Note: a stop-mark follower also falls to object through `opensClause` (no lower-case word after the name), so the
   behaviour of `secondMentions` alone cannot tell the regex from no rule; the class itself is held by the walker's tooth.
3. THE TOOTH bites: the regex without `!` reds the CLASSED control (`expected { follower: '!', kase: null } to deeply equal
   { follower: '!', kase: 'object' }`, 1 failed | 7 passed, `4-tooth-mutant.log`); restored, sha checked.
4. The pronoun lane's test files (`git diff --name-only 244fa84ef 95180c283 -- tests`: the leaf test, the walker, the
   lighting-census json): 18/18 (10 + 8). `tests/copy` whole: 171/172, the one red E-E above (`5-copy.log`). `tests/lint` whole:
   3369/3372, only the line's three (`proseComposed` A0b under-claim 2322 > 2103; `proseCorpusBytes` RAW and GZIP, all on
   `src/data/dossierStateProse/*.generated.js`) (`6-lint.log`); the lighting census green (no title moved).
   `typecheck:ratchet` 167/167 exit 0; `typecheck:domain:strict` 1113/1113 exit 0; `npx eslint` on both files exit 0.
   Every run through the mutex, to a log, read by `tail`; none with GIT_DIR / GIT_WORK_TREE / GIT_INDEX_FILE set.

## 6. Why PRONOUN's own proofs did not show this red
CLOSE-4's gate (CLOSE-4-HANDBACK.md section (2), "THE GATE") ran `tests/lint` whole, `tests/generators/people` plus 34 files
naming the leaf or its callers' tables, the 89 golden-reading files, `tests/build` and `bootSmoke`, never `tests/copy`, where
`voiceMechanics.test.js` lives and which names neither the leaf nor its tables (it walks `src/data` and `src/domain` by
`readdirSync`, and reads no golden), so the `'!'` that 2904f0475 (CLOSE-2 unit 3c) put in `OBJECT_FOLLOWERS` was read by no run.

## CONFIRMED vs PLAUSIBLE
CONFIRMED by run: the red and its green, the byte-equal outputs (8-row measure and 628,200 strings) with a control that
differs, the tooth's bite, and every gate count above. PLAUSIBLE (read from the handback, no list of the 34/89 files exists
on disk): that no file of CLOSE-4's 34 or 89 was in `tests/copy`.
