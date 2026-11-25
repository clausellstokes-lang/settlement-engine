# CLOSE-7 — THE MIRROR (chain one), as built

Brief: `close-7/briefs/MIRROR.md` (6922542d5) and R24d lines 10–12. Tree: `/home/user/wt/mirror` on
`lane/close-7-2026-11-24-mirror-wip`, cut at e7441a93f. Receipts: `close-7/mirror/`. Written as it goes (allowance warning).

## 1. How a line's id is minted, and K1 / K2

A pool line is `{ id, text, needs, excludes? }`. The id is the line's number in the lines document that wrote it
(`foodCulture.js` head: "the id is the line's number in LINES-2 § 1"; `dawnWork.js` head: "its LINES-1 / LINES-1b
number"): a letter for the branch as the document named it and a number in that branch (critical C0–C7, collapsed
X0–X3, surplus.wanting W0–W4; Dawn Work food F0–F6). No code reads an id: the deriver filters by `needs`/`excludes`
and picks by index (`pickVariantMixed`); no test or register in `src/`, `tests/` or `scripts/` names C7 or F6 by id.

- `FOOD_CULTURE` (every branch): ids A0–A16, C0–C7, S0–S12, T1–T11, W0–W4, X0–X3. **K2 is not taken.**
- `DAWN_WORK` (every branch): ids B0–B27, C0–C2, F0–F6, M0–M6, S0–S1, W0–W15. **K1 is not taken.**
- Elsewhere: `src/data/dailyLife/recentChanges.js` uses K0, K1, K2 in several of ITS branches (a different pool and
  slot, `recent_changes`; it repeats K1/K2 across its own branches, so its ids are branch-local there too). Not a
  collision in the pools the two lines enter; I read "taken in a pool" as the receiving pool and build. If the chair
  reads it as any pool, the two ids are the only thing to rename; nothing keys on them.
