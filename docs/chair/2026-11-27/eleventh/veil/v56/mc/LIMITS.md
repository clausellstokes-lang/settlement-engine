# MC (VEIL-56), WORK 3: THE PLATFORM's LIMITS AGAINST THIS MACHINE's FIGURES

Written 2026-11-27T23:53:58Z (date -u). The limits are VEIL-52's `v52/mapcost/A-PLATFORM-TIMEOUTS.md`: **PLAUSIBLE** (search-rendered, not a read
of the pages; this seat fetched nothing from the web): a statement as `anon` (a visitor) is cancelled at 3 s, as
`authenticated` (a signed-in user) at 8 s, unless the function carries its own `set statement_timeout` clause. The figures are
**CONFIRMED** (executed): `sizes.mjs` (`run.sh sizes`, 23:47-23:53 UTC): the 140 stored documents (`B-STEPS-RERUN.md`'s set) as
the owner's public rows, ONE single-member campaign map per document, each read once untracked after a warm read; then one map
of all 140. Local PostgreSQL 16, 4 cores, fsync off. Raw: `mc/out/sizes-{u3,tip}-{unmarked,hand}.json` (per document).

**PRODUCTION's SPEED IS UNKNOWN.** Nobody in the program has read production; its cores, its cache and its documents are not
this container's. Every count below is THIS MACHINE's, read singly, with no other reader on the map (LOCK.md: a second
concurrent reader of the same map waits for the first, so on a shared map these counts divide by the readers in line).

## ONE MEMBER (ms, untracked) and THE WHOLE MAP

| tree, members | mean | median | p90 | max | 140-member map | sum of the 140 singles |
|---|---|---|---|---|---|---|
| unit 3 (2f849aa53), unmarked | 448 | 308 | 1,386 | 2,048 | 61,550 | 62,686 |
| unit 3, the hand marker | 445 | 307 | 1,357 | 1,860 | 58,950 | 62,312 |
| tip (dbd4cd9e5; 211's map read), unmarked | 116 | 113 | 187 | 294 | 15,352 | 16,204 |
| tip, the hand marker | 395 | 253 | 1,254 | 1,744 | 56,343 | 55,270 |

By size class (unit 3, unmarked, mean / max): metropolis 821 / 2,048; city 478 / 1,444; town 239 / 866; village 60 / 90. A
map's read is the SUM of its members' (the whole map is within 6% of the sum of its singles; the map's own fixed cost, a miss,
is under 1 ms). No single member passes 3 s on either tree; on unit 3, 9 or 10 of the 140 pass 1.5 s.

## AT HOW MANY MEMBERS A MAP READ PASSES THE LIMIT (this machine, one reader)

| tree, members | visitor 3 s: average members / median members / heaviest first / lightest first | signed-in 8 s: the same |
|---|---|---|
| unit 3, unmarked | **6** / 9 / 1 / 40 | **17** / 26 / 4 / 67 |
| unit 3, the hand marker | 6 / 9 / 1 / 41 | 17 / 26 / 4 / 67 |
| tip, unmarked | 25 / 26 / 14 / 51 | 69 / 70 / 44 / 94 |
| tip, the hand marker | 7 / 11 / 1 / 46 | 20 / 31 / 4 / 72 |

(The largest count of members that still fits: floor(limit / mean member) and floor(limit / median member); "heaviest first"
and "lightest first" fill the limit from the 140 documents taken in that order: the worst and the best map of these towns.)

**WHAT EACH LIMIT MEANS HERE.** On unit 3 a visitor's map of more than about 6 average members, or of 2 metropolises with hidden
houses, would be cancelled at 3 s on this machine; a signed-in reader's at about 17 average members (4 of the heaviest). On the
tip the unmarked map fits 25 / 69 members, the marked one 7 / 20: unit 3's default veil (VR23) brings the unmarked map down to
the marked one's count. A map's member count today is the owner's figure to give (C-OWNER-COUNTS.sql, the owner's hand; see
PROPOSAL.md item 5). Raising the timeout is not a cure (V28 (3)): it is the bound a cure must fit under.
