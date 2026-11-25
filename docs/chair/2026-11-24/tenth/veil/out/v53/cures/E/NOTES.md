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
