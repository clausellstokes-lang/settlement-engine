# V53 CURES UNIT E — builder notes (partial, as I go)

- Worktree /home/user/cures53, branch lane/veil-53-2026-11-24-cures-wip, tip b61c1e630 at start.
- Read: brief EVERY UNIT, UNIT E, UNIT E AMENDED; REDSCAUSE (6); r5/r6 probes.
- Sources read: importRederive.js :: rederiveInPlace (11 steps), seatLaw.js :: withRecordSeatLaw / resolveSeatLawVersion,
  densityCreateBoundary.js :: GENERATION_LAWS (4 rows at this tip), factionDynamics.js :: computePublicLegitimacy (4th arg).
- Engine calls in rederiveInPlace: getInstFlags(config,..), computeBaseProsperity(..config..) / deriveProsperityLabel(..config..)
  (via servedProsperityOutcomes), defenceExactOf(r), generateDefenseProfile(r, keep), promoteStressorsToConditions(r),
  computePublicLegitimacy(e,label,tier) [LAW-BLIND: no 4th arg], generateSpatialLayout(tier,inst,route,terrain),
  rederiveCrimeTypes(s), rederiveRecentConflict(s).
