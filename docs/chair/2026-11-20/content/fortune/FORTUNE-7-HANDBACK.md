# FORTUNE-7 hand-back (kept current at every push; last written 2026-11-22 08:1x UTC by `date -u`)

For a successor: this file, `FORTUNE-6-HANDBACK.md` (its section 2 is the rulings in force; its section 6 is what
LASTING needs), `briefs/U7-LASTING.md`, `briefs/U7b-LASTING-SENTENCE.md`, `LIGHTING-WORKLIST.md`. The chair is the
EIGHTH chair, session_01ACmDYY29VRchM87v1yhL9Q (send_message, Claude Code Remote MCP server). The prompt is
`docs/chair/2026-11-21/eighth/prompts/FORTUNE-7.txt` on `origin/lane/chair-2026-11-08`. Seated 2026-11-22 07:51 UTC
BESIDE FORTUNE-6, which still finishes "FORTUNE <commit>" on `lane/fortune-6-2026-11-21`.

## 1. WHERE THE LANE STANDS

| branch | tip | state |
|---|---|---|
| `lane/fortune-7-2026-11-22` | f13f31820 + unit 0's files (pushed) | this lane; no code of its own yet |

| unit | state |
|---|---|
| 0(a) the six p90 ages | DONE, `measures/lasting/AGES.md`: all six equal E32's, dark and lit; the law moves no age |
| 0(b) the veil as a measure | DONE, `measures/lasting/VEIL.md`: `history.age` served unchanged on 11 of 11 shared projections, 156 of 156 births; the SQL twin by read |
| 0(c) the sentence draft | RULED (E57): the chair's three lines; re-cut for its eye as `measures/sentences/LASTING-RULED.md` (nine paragraphs, the 36 pairs judged: one sits badly, first merit B then LASTING B) |
| 1 U7 LASTING | NOT CUT: waits for the chair's "FORTUNE <commit>" |
| 2 U7b the sentence | BRIEFED on E57 (in the brief verbatim); cut when the chair names the commit, AFTER U7 merged (shared registers) |
| 3 the lit re-measure, 4 the line + rule 8 + the flip census | NOT STARTED |

NEXT STEP: on "FORTUNE <commit>": fetch `lane/fortune-6-2026-11-21`, merge (this branch has docs commits of its own),
cut ONE builder on `briefs/U7-LASTING.md` in its own worktree, branch `lane/fortune-7-2026-11-22-u7`.

## 2. Rulings in force

FORTUNE-6's section 2, items 1 to 10, stand. Added since:
1. (the chair, 08:21 UTC, on unit 0) The six ages stand (E32's). The veil table is ACCEPTED as EXECUTED on the eleven
   projections. The SQL twin stays PLAUSIBLE: say so in the landing line, for the security reader.
2. (E57, 08:21 UTC) THE SENTENCE'S WORDS, verbatim in `briefs/U7b-LASTING-SENTENCE.md`. The time words are under 200
   "for generations", otherwise "for centuries", a wording constant. The hand list gets ONE row, `HAND_CEILING` = the line's
   figure + 1 (76 after the first merit lands). The proofs are as U7b's brief has them.
3. (08:21 UTC) The `_seed` arrangement fault is TAKEN by the chair (owed: the who-rules page unit or the second deploy).
   It is not this lane's.
4. (08:21 UTC) U7b's builder may be briefed now and is cut the moment the chair names the commit.

## 3. For the join and the security reader

- LASTING's input is `history.age` (VEIL.md). The draft sentence reads `name`, `history.age` and the governing power's
  sentence name, which chooses no wording.
- No vocabulary or class-table row is asked.

## 4. Hazards

- Unit 0's scratch plant tree is at `<scratchpad>/tP` (a `git archive` of f13f31820, two files planted); never commit it.
- A heredoc holding `$` and `{` in one shell command was refused by the permission checker as unparseable: write the
  script to a file first, then run it.
- The pre-push hook for a `lane/*` ref runs typecheck:ratchet, typecheck:domain:strict and lint (about four minutes).
