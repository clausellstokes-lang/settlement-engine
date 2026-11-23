# BRIEF ADDENDUM 2: DISAGREE, two pins the landing's gate found (the chair's N57, 2026-11-23 06:07 UTC)
YOU BUILD ON `lane/prose-6-2026-11-23-disagree-wip` in `/home/user/wt-disagree`, at its tip 01ecf1e91. `node_modules` there is a symlink: never commit it.
- Commit by EXPLICIT paths only, and make ONE commit.
- Never push. Never touch another branch. Never `--no-verify`, never `npm run check`, never the whole suite.
- Every run goes through `sh scripts/gate-mutex.sh --run -- <cmd>`, logged under /home/user/logs with its exit code appended. Never read a log through a pipe.
- If your own permission check refuses a command: stop, and report the exact command and the reason.
CHANGE ONLY these two test files, test-only:
(b) `tests/domain/bar3CorpusGuards.test.js`, the BAR3-CORPUS-2 C6 row for `DS-DEF-2::Economic Survival: WEAK` vid 1 (about line 83):
  - `now` becomes `/nothing laid by to pay for a long defence/`, the ruled sentence's own bounded claim;
  - `gone: /nothing put by/` STAYS EXACTLY AS IT IS;
  - the row's note (`rows`) gains the ruling's stamp, CHAIR-2026-11-23-03:55, keeping its present words, e.g. `'C6: defenseWordsFindings\' term "no food stored" · re-pinned to v1 as re-worded (DISAGREE, CHAIR-2026-11-23-03:55)'`.
(c) `tests/domain/composeStateProse.test.js`, the `variants` pin (about line 187): 3176 → 3182. Prepend its cause in that comment's own form: "DISAGREE (PROSE-6, 2026-11-23; the chair's rulings of 03:45 and 03:55 UTC): 3176 -> 3182, DS-DEF-2 CHAIN: food trades failing +6 (F1-F6, v7-v12); W1-W3 withdrawn; WEAK v1 and v2 re-worded in place (no line added) // " and keep the history after it.
ORDER:
1. RED FIRST: run the two files at 01ecf1e91, before any edit. Both must red on these two pins and nothing else. Say each red title.
2. Make the two edits, then run the two files: green.
3. ONE RUN OF THE STACK'S SET, the union of:
   - every test file under `tests/` whose text names `dossierStateProse`, `defense.generated`, `generate-dossier-state-prose` or `oppositeSentencePairs`;
   - every test file whose name contains `StateProse`;
   - `tests/copy` whole.
   Give the count of files, and every red BY NAME against RED-AT-LINE.tsv (`git -C /home/user/settlement-engine show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv`; a row is an `it` title without its describe prefix: match by containment). A red not on that list: STOP and report.
4. `tests/lint` WHOLE (COMMON-EIGHTH 11). Every red goes by name against RED-AT-LINE.
5. ONE commit of the two files, its message naming N57 and both causes. Then read `git config --local --get core.bare`, `user.name`, and `git log --all --since='3 hours ago' --author=Fixture`.
REPORT, at most 120 words: the commit; red-first titles; green; the stack set's count and its reds; the `tests/lint` count and its reds; the git config.
