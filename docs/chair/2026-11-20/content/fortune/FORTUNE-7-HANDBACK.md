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
| 0(c) the sentence draft | SENT to the chair, `measures/sentences/LASTING-DRAFT.md` (three wordings, two time words, nine paragraphs, four questions). AWAITING the ruling |
| 1 U7 LASTING | NOT CUT: waits for the chair's "FORTUNE <commit>" |
| 2 U7b the sentence | NOT CUT: waits for the ruled words and U7 merged |
| 3 the lit re-measure, 4 the line + rule 8 + the flip census | NOT STARTED |

NEXT STEP: on "FORTUNE <commit>": fetch `lane/fortune-6-2026-11-21`, merge (this branch has docs commits of its own),
cut ONE builder on `briefs/U7-LASTING.md` in its own worktree, branch `lane/fortune-7-2026-11-22-u7`.

## 2. Rulings in force

FORTUNE-6's section 2, items 1 to 10, stand. Added since: none yet.

## 3. For the join and the security reader

- LASTING's input is `history.age` (VEIL.md). The draft sentence reads `name`, `history.age` and the governing power's
  sentence name, which chooses no wording.
- No vocabulary or class-table row is asked.

## 4. Hazards

- Unit 0's scratch plant tree is at `<scratchpad>/tP` (a `git archive` of f13f31820, two files planted); never commit it.
- A heredoc holding `$` and `{` in one shell command was refused by the permission checker as unparseable: write the
  script to a file first, then run it.
- The pre-push hook for a `lane/*` ref runs typecheck:ratchet, typecheck:domain:strict and lint (about four minutes).
