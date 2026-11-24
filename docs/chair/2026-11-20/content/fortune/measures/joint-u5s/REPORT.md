# U5s and the joint calm-contested figure (both laws on). A measure only.

Seat tip 6e697f5db (found on lane/seat-5 and seat-6, not seat-2). Worktree A = 6e697f5db + c167b5f11; worktree B = 6e697f5db + 1cd2e6d93 (U5s). The same six conflicts in each. The boundary file and the walker test were resolved by keeping both sides (seat first, fortune second; the registry row got its closing `}),`; `node --check` passed). The four registers were left unresolved. Seeds were hxd-<size>-0..99, 600 places in each of four arms.

**(A) Control reproduces: YES.** The tables match report.txt byte for byte, (a) through (d). The share of calm places contested under both laws, by size: thorp 0, hamlet 1.5, village 17.1, town 8.6, city 16.4, metropolis 10.4.

**(B) With U5s:** thorp 0, hamlet 1.5, village 17.1, town 8.6, **city 11.0** (12 -> 8), metropolis 10.4.

**Leaving the contested reading (A -> B): 4 calm cities, 0 metropolises.** All 4 had Unsafe streets: hxd-city-38, 64, 69 and 73. Each went from standing Contested 42 to Tolerated 50, and its risk from Contested to Holding. No place joined the contested reading. The 18 calm Unsafe cities were the only places whose standing moved. No crisis place moved.

**Standing of calm cities, A vs B:** Contested 8.2 -> 2.7%, Tolerated 64.4 -> 58.9%, Approved 27.4 -> 38.4%. Every other size is unchanged; metropolis stays Tolerated 80.6% and Approved 19.4%. The 8 cities and 7 metropolises still contested all have Moderate streets.

Fortune-only arm: city 19.2 -> 13.7%, the same 4 cities leave. The off and seat arms are byte-identical between A and B.

**Crashes:** 0 in 4,800 births and in every reader.

**EXECUTED:** all of the above comes from executed births on both merged trees. Only whether these cities are unseated in play is PLAUSIBLE, because no unseating can happen at birth.
