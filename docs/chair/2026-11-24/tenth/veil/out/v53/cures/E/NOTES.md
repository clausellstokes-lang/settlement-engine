# V53 CURES UNIT E — builder notes (partial, as I go)

- Worktree /home/user/cures53, branch lane/veil-53-2026-11-24-cures-wip, tip b61c1e630 at start.
- Read: brief EVERY UNIT, UNIT E, UNIT E AMENDED; REDSCAUSE (6); r5/r6 probes.
- Sources read: importRederive.js :: rederiveInPlace (11 steps), seatLaw.js :: withRecordSeatLaw / resolveSeatLawVersion,
  densityCreateBoundary.js :: GENERATION_LAWS (4 rows at this tip), factionDynamics.js :: computePublicLegitimacy (4th arg).
- Engine calls in rederiveInPlace: getInstFlags(config,..), computeBaseProsperity(..config..) / deriveProsperityLabel(..config..)
  (via servedProsperityOutcomes), defenceExactOf(r), generateDefenseProfile(r, keep), promoteStressorsToConditions(r),
  computePublicLegitimacy(e,label,tier) [LAW-BLIND: no 4th arg], generateSpatialLayout(tier,inst,route,terrain),
  rederiveCrimeTypes(s), rederiveRecentConflict(s).
- MEASURED (probe e1, /var/tmp/v53/cures/E/e1.out): served config carries all four markers (=2); `_config` is not served.
  IMPORT red reproduced on cures53: stored defense 0, rederived 10.
- MEASURED (probe e2): rederiveInPlace on the full stored record (vr26-city-calm-3 and saved-place-town-7), whole-doc drift
  less cast rows and severityBand: ONLY `powerStructure.publicLegitimacy.breakdown.defense` drifts, under fortune lit; born
  with fortune dark: no drift. Seat / density / livingContent: stamping the marker dark moves no import output on these towns.
- Every other call: config-taking callees get the record's own config (all markers); generateSpatialLayout / keepOfRecord
  take none and read no law. So the one law-blind call is computePublicLegitimacy (4th arg).
- Arm written (generationLawsSavedPlace.test.js, new describe at end): walks GENERATION_LAWS at run time; planted 5th row
  via vi.doMock of the boundary + a planted reading in generateDefenseProfile; catch = marker forgotten -> monster drift.
- RED (uncured b61c1e630): arm 2 failed / 9 passed (logs /var/tmp/v53/cures/E/red-arm.log): every row but "fortune: born
  without it" drifts at powerStructure.publicLegitimacy.breakdown.defense. VR26: FIDELITY "expected [ 'legitimacy.colours', …(2) ]
  to deeply equal []", MAIN "expected [ 'economy.prosperity', …(2) ] to deeply equal [ 'economy.prosperity', …(5) ]" (red-vr26.log).
- CURE: importRederive.js :: rederiveInPlace step 7 hands computePublicLegitimacy its 4th arg resolveFortuneLawVersion(r);
  the harness revisit the same. GREEN: arm file 11/11; VR26 4/4.
- JUDGMENT: the cure does NOT import GENERATION_LAWS: the import hands every config-taking callee the record's own config
  whole (every row's marker rides it, no law listed); a re-key from GENERATION_LAWS would be the identity (config IS the
  record's first bag; `_config` is not served). The one positional law parameter is read by its own law's resolver. The
  run-time walk of the rows lives in the arm (no law named, no count), proved by the planted fifth row.
- SEAT: CONFIRMED by the arm: rows "seat: born under it" / "born without it" keep the record (green after cure; pre-cure red
  only through the fortune defence term). Probe e2: stamping the seat marker dark moves no import output on these towns.
- committed 90ddc2fe5
- AFTER THE COMMIT (container restarted once: a 9-file single vitest was OOM-killed, exit 137; re-run one file at a time):
  governing files 9 (git grep over tests/ for importRederive.js or its exports): 8 green; recentConflictReaders.walker
  1 red "transferTakerOf (1): not registered" = holderOfSeat.js (unit D, not built), ON the trial join's list (lintfails.txt:24).
  Per file: /var/tmp/v53/cures/E/governing.sum.
- tests/lint WHOLE (--maxWorkers=1, through the mutex; the first attempt was cut by its background time limit, re-run):
  26 files failed | 206 passed; 66 tests failed | 3376 passed. Its 66 failing titles = the trial join's 66
  (/var/tmp/v53/grants/lintfails.txt, matched by prefix since that list cuts long titles): NEW none, GONE none.
  Log /var/tmp/v53/cures/E/lint.log; titles /var/tmp/v53/cures/E/lintfails.mine.txt.
