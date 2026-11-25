# WORDS-1 · the joined proof (E1, E8, D6) — 2026-11-25

THE TREE (the chair's 11:01 method, never committed): a detached worktree at 0ec96f13d8; `git merge --no-commit --no-ff`
of `-e1-wip` 902b7005d and `-d6-wip` 81ac266a5 (an octopus of all three refuses on goals.js and goalSentencesOnceInTown), then
`git diff 0ec96f13d8 -e8-wip(94b7a13d9) | git apply -3`; the three conflicts resolved by union (personMention.js: both blocks;
goals.js: both imports; the test: `vantageHash(heldGoal(longTitled(c)))`). Removed after the proof.

THE RUN: `tools/page-battery.mjs --views --strings` on the base and on the joined tree, C and V (900 births each), compared by
`tools/joined-proof.mjs` (full outputs: `joined-proof-C.txt`, `joined-proof-V.txt`). Every changed string (record, public
projection) and printed line is classed by the unit that explains it; OTHER is what no unit explains.

| | C | V |
|---|---|---|
| places moved, record hash / page hash | 439 / 587 | 416 / 556 |
| page-battery rows moved | 0 | 0 |
| unexplained by any unit (OTHER) | 0 | 0 |
| E1 detector, owner pages: before → after | 125 hits in 122 places → 0 | 145 in 126 → 0 |
| E1 detector, public projection: before → after | 52 in 41 → 0 | 34 in 19 → 0 |
| E1 detector, record strings: before → after | 120 in 116 → 0 | 96 in 90 → 0 |
| E1 places moved: page (= the measure table) / any string | 122 / 163 | 126 / 143 |
| E8 strings moved / places; e8-check covered lines, disagreeing | 627 / 390; 623, 0 | 595 / 381; 591, 0 |
| D6 pages changed (= G7); flag vs raw-record oracle | 502; 0 | 452; 0 |
| D6 "Contender" kept in all / with a recorded conflict with the holder | 503 / 115 | 671 / 170 |

THE FIRST JOINED RUN (E1 at 72db12c69) left E1 residue: V owner pages 3 in 2, public C 15 / V 8, record C 22 / V 12, from five
joiners the first commits had not reached; cured in 902b7005d (see its message), then the joined tree was rebuilt and re-rendered.
