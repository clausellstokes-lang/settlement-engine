# FRAME-3 · B9 addendum — what changed since FRAME-2 wrote B9

This was written by FRAME-3, the integrating seat, on `lane/frame-3-2026-11-20`. It binds beside `docs/chair/2026-11-20/content/frame2/B9-W2-BOTH-POWERS.md`, and where the two differ, it governs.

1. **YOUR BASE IS THIS LANE'S TIP** (`993865a02` or later). The working line is merged in at `e356c94f2`, with its final names work. The byte-identity pins were re-measured at that merge:
   - a calm town's sheet is held to the sheet the LINE composes at `e356c94f2`, which has no frame code;
   - a crisis sheet is held to the line plus B5's `crisisHooks.js` diff alone;
   - the veil test's shared reads are held to the line.
   
   Every NEW pin you add (a calm town that loses its frame under both powers) is measured the same way. Make an archive of `e356c94f2` with a symlink to this checkout's `node_modules`, and compose the sheet there. Never measure at `7e0c77ae2` or `85fccf898`.
2. **THE COUNT YOUR CHANGE MUST GIVE**, measured independently by the seat from the ruling's words, before your build: 58 framed, by tier thorp 0, hamlet 8, village 15, town 5, city 12, metropolis 18. Re-measure it with B2's scripts. Then compare town by town with the seat's list, `docs/chair/2026-11-20/content/frame3/FRAME3-CF11-RECOUNT.md` (the seed, the tension's place and its type). Every difference is a finding: report it. Do not adjust anything to fit.
3. **THE VEIL TEST'S CRIMINAL LIVENESS TOWNS.** Under both powers, `frame-calm-city-0` and `frame-calm-city-4` lose their frame, and `frame-calm-metropolis-1` opens on a trade dispute. Re-seat `WITH_CRIMINAL`, by identity, from the 12 crime_wave openers that survive, with the reason written in the test. Keep at least two towns whose frame names the criminal power.
4. **`tests/lint` WHOLE** at your tip. List each red with its cause, and say which are pre-existing at your base (run at the base in an archive).
5. **A SECOND CAUSE, A SECOND COMMIT** (the chair's ruling): `tests/lint/seedLoopTotality.walker.test.js` reds on `tests/security/frameShareVeil.test.jsx`. It has 4 bare seed loops (lines 141, 176, 210 and 230 at `1fe37f10e`), and the frozen ceiling is 0. A loop that asserts inline stops at the first failing town, so its failure count is only a lower bound.
   - Cure each loop through the house's `collectSeedFailures` / `expectNoSeedFailures` (`tests/helpers/seedFailures.js`, as `troubleWeight.test.js` already does).
   - The walker's red at your base is the red; its green is the green. The ceiling stays 0.
   - Say in that commit that every assertion is kept.
   - Make this commit AFTER the B9 commit, with the message `test(FRAME-3 · B9b): the veil test's seed loops collected (seedLoopTotality)`.
