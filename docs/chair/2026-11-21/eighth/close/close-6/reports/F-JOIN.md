# F-JOIN: PAUSED before any edit (CLOSE-6's order: 13G lands first)

Written 2026-11-23 (~13:05 UTC). Worktree `/home/user/wt/flip`, branch `lane/close-6-2026-11-23-flip`, tip 8f882d0f0.
NO COMMIT. NO FILE EDITED: `git -C /home/user/wt/flip status --short` is empty, so no `wip/F-JOIN-PAUSED.patch` was written.

## Read
CLOSE-6-ADDENDUM (rulings 5 to 8), FLIP-COMMON, F-JOIN.md, rows-JOIN.tsv (83 rows, 49 files). Not mine by the brief: the
2 DIAL PIN rows (fortuneLastingSentence, fortuneMeritSentence), the pageCensus.walker STORED PIN, and seatChainHolder arm 8.
That leaves 79 rows. Idiom read from f02f969c2, ec216e759 and 9df6731ee: a born anchor whose case no longer holds is read as a
premise (re-picked, its original line restored).

## Measured (run0, PARTIAL: stopped by me at the pause; it is on the OLD tip, so every value is re-read after 13G)
The run of the 49 files, through the mutex, was stopped mid-way. Files reported red before the stop (fails/tests):
bar3PlacesRows 2/11, display/tensionCause 1/18, r3c9ReaderLinesTrue 1/7, bar8People 2/12, corpusEcoTailGuards 8/137,
bar6PowersCards 2/10, bar7Lines 1/7, tailCrisisBatch8 5/58, bar3DefeconLines 1/4, bar6CrimeOneReading 1/4,
successionClaimants 1/6, stressLateReRead 1/7, relationLinesSayTheRecord 2/16, power/standingAgainstFigure 1/4,
tailCrisisBatch1 1/2, tailCrisisK26 1/1, bar2PayAndGrain 3/5, powersReadTheRosterP31 5/19 (4 rows of mine listed; the
fifth is unread), power/bar2PeoplePowers 2/11.
Every count matches its list except powersReadTheRosterP31 (5 red against 4 listed rows). That fifth red is UNREAD, not yet
a STOP: read it on the new tip. No file had finished green before the stop, so no row is GONE yet. No values were read
and no seeds were re-picked.

## Note for CLOSE-6
Stopping the run left a STALE atomic lock (`/tmp/settlementforge-vitest-gate.0.lock`, dead PID 7524). `gate-mutex.sh --run`
reclaims it by its own design; nothing was removed by hand.
Log: `/tmp/claude-0/-home-user-settlement-engine/237fca18-9a05-575d-8f9a-f8032f4bd46d/scratchpad/flip/F-JOIN/run0.log`.
