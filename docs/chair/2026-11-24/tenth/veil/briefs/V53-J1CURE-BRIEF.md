# V53-J1CURE: THE TWO `tests/copy` REDS, CURED BY CODE POINTS (VEIL-53; the chair's RULING V2 on J1, relayed by VEIL-50 at 21:35 UTC 2026-11-24)

ONE COMMIT on `lane/veil-53-2026-11-24-j1-wip`, cut from the trial join ba7460c33 in its own worktree
(`git -C /home/user/join53 worktree add -b lane/veil-53-2026-11-24-j1-wip /home/user/j153 ba7460c33`; `node_modules` and
`.husky/_` symlinked from `/home/user/join53`). Commit by explicit paths with the hooks (never `--no-verify`); never push; no
pull request. Read first, whole: `src/domain/display/gallerySecondHomes.js` (the constants named below and every reader of
them), `src/domain/display/galleryRosterChoices.js :: DASH` and its readers, `tests/copy/voiceMechanics.test.js` (how it reads
literals: `stringLiteralContents`, `countFile`), and `docs/chair/2026-11-24/tenth/veil/out/v53/copy/J1.md`.

## THE CHANGE (nothing else)
- `galleryRosterChoices.js`: `const DASH = String.fromCharCode(0x2014);`
- `gallerySecondHomes.js`: one `const BANG = String.fromCharCode(0x21);` placed before its first use; every `!` inside
  `HOUSE_FLAGS`'s JSON template written `${BANG}`; `LEFT_BOUND` = `` `(?<${BANG}[${NAME_BOUND}])` ``; `RIGHT_BOUND` =
  `` `(?${BANG}[${NAME_BOUND}])` ``; `NAME_SEPQ`'s head `'\\x01-\\x21\\x23-\\x2f' + SEP_REST` (a plain literal with escaped
  backslashes in place of the `String.raw`).
- TERM (1): a plain comment at the constants (both files): these are pattern characters, not prose; the voice walker
  (`tests/copy/voiceMechanics.test.js`) counts a literal's cooked value; hence the code points.
- TERM (3): 212 (`supabase/migrations/212_share_veil_later_cures.sql`) is NOT touched; neither is the walker or its baseline.

## TERM (2): THE EQUALITY, BY A COMMITTED TEST (new file `tests/domain/display/patternLiteralsCodePoints.test.js`; its basename
avoids the mutation-manifest words)
- DASH, BANG, `HOUSE_FLAGS` (compare `JSON.stringify` of the frozen object, and each `re`/`not` string), `LEFT_BOUND`,
  `RIGHT_BOUND`, `NAME_SEPQ`: each STRICTLY EQUAL AS A STRING to its former value, the former values spelled in the test (the
  walker reads `src/` only). Export what is not exported ONLY if no other way reaches it; prefer reaching each through an
  existing export (`HOUSE_FLAGS` and `NAME_SEP` are exported; find whether `NAME_SEPQ`, `LEFT_BOUND`, `RIGHT_BOUND` reach an
  export, e.g. a compiled RegExp's `.source`); an added export is named in the commit message.
- `NAME_SEPQ` also BY ITS COMPILED PATTERN: `new RegExp('[' + former + ']')` and `new RegExp('[' + NAME_SEPQ + ']')` match
  EXACTLY the same code points over every code point 0 to 0xFFFF (a count and a first-difference report). RED FIRST: a planted
  off-by-one in a range (e.g. the former's `\x23` written `\x24`) makes the arm red; quote it in the commit message.
- Say in the commit message which values are equal as strings and which as patterns (all six as strings is expected: the
  `String.raw` and the escaped literal yield the same characters).

## RED, GREEN, RUNS (through `sh scripts/gate-mutex.sh --run -- ...` from `/home/user/j153`, never through a pipe, logs under
`/var/tmp/v53/j1cure/`)
RED: `tests/copy/voiceMechanics.test.js` at ba7460c33: 2 failed (already logged in `/var/tmp/v53/copy/join.txt`; re-run once
in your worktree before the change and quote it). GREEN after: `tests/copy` WHOLE (172 of 172); the new test; `tests/lint`
WHOLE (list its failing titles: the trial join's own lint reds are expected, name them, flag any new); `tests/security` WHOLE
`--maxWorkers=2` (known reds: `traditionDescriptionSharedPage` TRAD-2 x3, `rosterChoiceInversion` VR26 x2; name any other).
TERM (3)'s STOP: if any test that compares the twin with the SQL (the name search: grep `tests/security` for `NAME_SEPQ`,
`buildNameSearch`, `_gallery_veil_name_sep`) moves by one read: STOP, commit nothing, report.

## YOUR FINAL MESSAGE (at most 150 words)
The commit hash; red and green counts; the equality arm's figures (strings equal: which; code points matched: N of 65,536;
the plant's red quoted); `tests/lint` and `tests/security` whole counts with any red outside the known.
