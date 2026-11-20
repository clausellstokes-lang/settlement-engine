# R6 HAND-BACK — the born counterfactual test (VR4 G2), test only

Builder for VEIL-21, branch `v21-r6`, base `0d28ccf19` (R2 not merged there). No file under `src/`, `supabase/` changed;
`scripts/` only for the mutation-manifest row the new test owes (`pglite-executed`, its siblings' form).

## What was built
`tests/security/rosterChoiceCounterfactual.pglite.test.js`: one pglite chain of every migration; 8 births (6 with a
hideable house), each born three ways on one seed (A as born; B every `isHideableHouse` house cut after every step;
C as many ordinary houses cut: the re-roll control). Read through the server (gallery; party link for Reveal off) and the
twin, under the DEFAULT veil and EVERY EYE SHUT, Reveal DM off and on: 24 counterfactual reads, 3 views each.
The rows judged are `REGISTRY_ROWS` with `built: true` and rule withhold/recompose (no hand list).
The judge: (a) no A/B difference at the row's path; (b) `always`: absent from A and B (and from a share hiding nothing);
(b) `house-hidden`: A carries nothing B does not. A difference that A/C shows at the same path with the same A value
is a re-roll: EXCUSED and counted per row in `counterfactual.json`.

## Arms (all green at the base, `green.txt`: 4 of 4, exit 0)
- CONTROL: a share hiding nothing sends the hideable houses; the default veil withholds them; B holds none; built
  house-hidden rows do not move there; built always rows are absent there.
- RED: the always judge, the house-hidden judge and the recompose judge each catch a planted value beside a clean twin
  that passes (stand-in rows at this base: `conditions.severity`, `compound.inst.names`, `compound.inst.flags`); the
  inversion judge catches a moved `defence.scores.internal`.
- MAIN: built (a) 0, built (b) 0 at this base: nothing to judge yet. NAMED in `counterfactual.json`
  (`cannotYetJudge`): all 105 unbuilt withhold/recompose rows, each with what it would do were it built today:
  79 would fail, 23 would pass, 3 held by no born town (`tile.stability`, `chronicle`, `people.rosterCopy`).
- INVERSION (VR32 re-derivation from the served values as served; VR28 tiers): tier 1 inverting =
  `defence.scores.internal` (KNOWN_TIER1, blocking, shrink-only; R2 withholds it); tier 2 recorded 2
  (`economy.prosperity`, `safety.safetyLabel`); 6 prose rows not re-derivable on the open read; 10 diffuse rows not
  judged here (`inversion.json`).

## Not reached, for the seat
Master's stored shape, the hand veil, the map, the import send. The old `rosterChoiceInversion.pglite.test.js` is left
untouched (R2's cure edits its KNOWN_INVERTING): under VR32 the legitimacy rows and `prosperityStanding` no longer
invert; aligning or retiring that harness is the seat's call.
