# COHERENCE-POWERS-5 probes (the fifth seat, 2026-11-13)

Scratch instruments, kept so the reviewer can re-run them. None is a test; none writes in a tree.

- `birth720.sh <tree> <out>`: the review's 720 births through the census's `births.mjs` (records only).
- `seatcards.mjs <tree> <corpus|dir>`: N1 (the holder's card holds the seat; subordinate rows), N2 (the holder's
  influence against the office's band), N3 (other cards that say they hold the seat), N4 (the claimant bodies' firsts;
  the keeper in a claimant's party). Reads the seat from the tree's own `powerStrata.js :: rulingChainOf`.
- `pages.mjs <dumps-dir> <tree>`: the same classes read on the census's rendered pages, with N5–N7.
- `heads.mjs`, `seatrow.mjs`: N5's title over its names; N7's doubled office word and the keeper's two titles.
- `n4.mjs`, `nobRS.mjs`: the succession bodies' firsts on the 720 and on the lane's corpora.
- `fdiff.mjs` (by index), `idiff.mjs` (cards and ties keyed by id): field diffs of two corpora, paired by seed.
- `n2ties.mjs`: of the ties N2 moves, those touching the raised card.
- `bisect.sh <test> <commit...>`: one test file at each commit in a scratch worktree.
- The lane's corpora (R with the golden's 525, S): `probes/COHERENCE-POWERS-4/whole.mjs` and `wholediff.mjs`, run in two shards.
