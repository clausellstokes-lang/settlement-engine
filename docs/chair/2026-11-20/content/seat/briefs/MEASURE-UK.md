# MEASURE-UK — the corrected keyword, MEASURED AND PROPOSED before any build (hand-back item 42). Builder BUK. Written 2026-11-20T18:42:48Z by SEAT-6.

Read `briefs/COMMON.md` (its SEAT-6 section), `SEAT-5-HANDBACK.md` items 36, 39, 42, and `SEAT-6-HANDBACK.md` items 61, 63, 64 (THE POOLS: the visitor pool is the owner's headline; pool A is never in an owner's table). **Cut from** `lane/seat-6-2026-11-20` at the commit SEAT-6 names: `git checkout -b lane/seat-6-2026-11-20-uk-measure <commit>`, then `npm ci`. You write NOTHING under `src/` or `tests/`: the fold lives only in scratch trees (`git archive` + a patch, as `u4/measure-lit.sh` builds its trees).

**Files you own:** a new `docs/chair/2026-11-20/content/seat/uk/` (`measure-uk.sh`, `measure-uk.mjs`, `uk.md`, `uk.json`); your report `briefs/MEASURE-UK-REPORT.md`.

**What is measured.** `npcGenerator.js :: powerBandOfRole` matches keywords written with underscores (`guild_master`, `council_member`, `wealthy_merchant`) against pool roles written with spaces, so Guild Master, Thieves Guild Master and Council Member fall to the lowest band. The trial fold is `f4a434660` on `origin/lane/page-3-2026-11-20-k-wip` (one line: `_` and space fold alike, both sides; trial scripts `b2f8fe25e`, `docs/chair/2026-11-20/content/page/measures/page-3/`; its output `measures/page-3/K-trial-f4a434660.out.txt` on `lane/page-3-2026-11-20` at `56f5b0db1`). RULED (item 42): it lands ONLY under the seat's birth law (`_seatLawVersion`), DARK, lit with it.

**Trees (scratch):** S = the lane tip as named; SK = S with the fold applied to `powerBandOfRole` (verbatim `f4a434660`'s two lines); SKW = SK plus the WEALTHIEST MERCHANT arm (the role "Wealthiest Merchant" also reaches `wealthy_merchant`'s band: say exactly how you make it match, one line, and that it is a separate proposal).
**Pools:** THE VISITOR POOL (`u4/measure-lit.mjs :: visitorJob`, reuse it: 100 a size), the headline; the chair's 600 (`hxd`) beside it. Every birth with `_seatLawVersion: 2` forced as `measure-lit` forces it (the fold is to land under the law). Every rate "under today's standing".

**Report, by size (thorp → metropolis), S → SK and S → SKW:**
1. Towns whose powers' CONFLICT changes: gain one, lose one, parties swap (read the born record's conflict the way the trial's `kClasses.mjs` reads it; quote that read).
2. The CONTENDER TABLE (`rulingPowerCoup.js :: coupContenders` under the law, read by `seatTable.js :: contestKindOf`, as `u4/measure-u4.mjs` tables it), per kind, with and without the corrected band; the towns with no contender; the risk ladder.
3. The share of powers whose FIRST card reads low (the trial: 2,631 → 1,572 on its corpora).
4. Cards whose band moves, by role (the trial: Guild Master 221, Thieves Guild Master 34 low → high; Council Member 18 low → moderate), and what else in the born record moves (relationship narratives, pressure sentences, goals, ties): counts and one example each.
5. Calibration first: reproduce the trial's role counts on its own corpus (`k300.mjs`, PAGE-2's 300 towns at its commit) or STOP.

**Output:** ONE command, its run time; `uk.md` with the tables; report ≤350 words plus ONE table (the visitor pool: towns that gain / lose / swap a conflict, and contenders per kind, S → SK, by size). Commit by explicit paths with COMMON's trailers; do not push; no census.
