# U8 CRISIS-POWER: the diagnosis (read-only, base 1e1bdf8f5)

All figures below are EXECUTED: `probe-arm.mjs` (the dualhat probe with the explicit `{ ...birthConfig(cfg), _fortuneLawVersion: 2 }` arm),
`trace.mjs` / `trace2.mjs` (the same births on a scratch `git archive` copy instrumented by `instrument.patch`, log-only),
`cf.mjs` (counterfactuals on that copy: lit, with ONE value held at its dark figure), `r13.mjs`. Every run went through the gate mutex.
Lit reproduces the chair's three MISS (slave_revolt-thorp-5, wartime-thorp-2, rvw-thorp-86) and the city's lost Reform Line; the other five OK.

## The gate: no label test cuts the power. The density law's seat ROLL does, and the lit standing moves the roll's odds.
A thorp's band is one faction (`domain/density/densityBands.js`, thorp `factions {1,1}`, `rivalBonusSeat: 1`). None of these three crises is
`seated` (`data/stressPowerFaces.js` marks only occupied and politically_fractured), so its power's ONLY road to the page is the rival's
bonus seat: `generators/density/densityRoll.js :: chooseSeats -> rollRival` (R16: weight = 0.22 + 0.55 x gap, gap = (top - ruling) / ruling).
The gap reads the governing power AFTER `generators/factionDynamics.js :: applyLegitimacyMultipliers` (governing x `govMultiplier`, the
legitimacy band's, `data/bandLadders.js`), and lit legitimacy crosses a band cut (`LEGITIMACY_CUTS`):

| seed | legitimacy dark -> lit (cut) | govMultiplier | resize roll's powers (top / ruling) | rival roll |
|---|---|---|---|---|
| slave_revolt-thorp-5 | 19 -> 38 (contested 30) | 0.60 -> 0.80 | Revolt 48 / Elder 34 -> 43 / 41 | gap .412 -> .049, weight .446 -> .247: the SAME draw (in [.247,.446)) now declines |
| wartime-thorp-2 | 27 -> 38 (contested 30) | 0.60 -> 0.80 | War Council 46 / Elder 36 -> Elder 42 > War 41 | the ruler is now the top power: no candidate, no roll (weight 0) |
| rvw-thorp-86 (succession_void) | 37 -> 46 (tolerated 45) | 0.80 -> 1.00 | Highborn 37 / Elder 32 -> Elder 36 > Highborn 35 | no candidate, no roll |

Raw powers are unchanged dark to lit (Revolt 39, Elder 46 raw on the revolt thorp); only the multiplier moves. The mass ceiling is NOT the gate:
`massOverride` (npcs + `seatFacesFoldedByDualHat`) is 2 dark and lit on all three, ceiling 2. Prosperity's tilt is not it either (a thorp rolls 1).
COUNTERFACTUAL (cf.mjs): lit with only the dark `govMultiplier` held (0.60, 0.60, 0.80) brings all three powers BACK, prosperity still lit.

## The city is the SAME family, a DIFFERENT reader
rvf-succession_void-city-4: Comfortable -> Struggling, legitimacy 53 -> 14. The city's seat count is `rollInBand(sizing, factions {5,8}, tilt)`
in `rollDensityPlan`; `particularTilt` reads `prosperity01` (`domain/prosperityRank.js`: 0.65 -> 0.10, x `PARTICULAR_TILTS.prosperity` 0.20 x 2),
so tilt -0.234 -> -0.454 and the SAME sizing draw rolls 7 -> 6 houses; less the one doubled niche, 6 -> 5 distinct seats, and the Reform Line
(8, the sixth by power, behind the Senior Line's 10) is the one squeezed out. COUNTERFACTUAL: lit with dark `govMultiplier` (1.00) alone: still
missing; with dark `prosperity01` (0.65) alone: BACK. So: ONE path (the density law's seat roll, `rollDensityPlan`), TWO readers of the moved
standing: the rival's weight reads the legitimacy BAND (thorps, upward), the seat count reads the prosperity LABEL's rank (city, downward).
Draw order does not shift: in every case the same stream position lands on the other side of a moved threshold (the counterfactuals restore it).

## The shape: B, said exactly
Not (A): no crisis power's existence tests a label. `applyStressEventFactions` pushes the crisis power unconditionally (it is on the roster dark and
lit, `ordered` above). The fault is that an UNSEATED crisis power's body is a weighted draw in the density law (R16 rival roll at a thorp, the
R10 band roll for count at a city) whose odds read fortune-moved standing (legitimacy band -> govMultiplier; prosperity label -> tilt). The lit law
therefore changes which crisis powers are BORN, in either direction. The chair's leaning fits the measure: the occupation's and the fractured
realm's powers already have a body by their crisis (`seated` -> `crisisSeatKeys` -> seat floor 2, seated second); these do not.

## What else rides the same moved values on this path
- The cast: a crisis leader's card follows its seat: Zenobia Maximus ("the revolt's leader") and Liangjie Wu ("the lord") go (npcs 2 -> 1); city 48 -> 47.
- The stability text does NOT ride it: `power/governanceNarrative.js` reads the stressor (`hasStress('slave_revolt')` -> "Unstable (revolt not
  contained)"), so it stays, beside a roster with no revolt: the contradiction the chair saw.
- `govMultiplier` also sets every power's renormalised share (the whole card order), the coup reading's incumbent weight
  (`domain/rulingPowerCoup.js`), `governanceFractured` / the seat's crisis note and `settleClaimsToLabel`'s crisis twin; and it weighs the rival
  roll at EVERY tier (a city's rival bonus seat is 0, so there it moves only which power is the candidate).
- `prosperity01` also moves `rolledMass` (overridden by `massOverride` at the resize, so inert there) and `vacancyMultiplier` (the rungs: which
  benches stand vacant) at every tier.
- Read whole: `rollDensityPlan`, `chooseSeats`, `rollRival`, `rollInBand`, `particularTilt`, `applyLegitimacyMultipliers`, `computePublicLegitimacy`,
  `applyStressEventFactions` (the three arms), `densityParticularsFrom`, the X4 loop. The chair's `claimant-probe.mjs` (c1c65fff8) was read; its
  city-4 birth is the one `trace2.mjs` measures under the explicit arm (not run separately).

## R13 (`defenceParts` "v3build-village-3: 6.9 <= 6.8"): CONFIRMED, with a correction
One birth each way (`r13.mjs`). Dark: will 6.9, armed 5.2, old bound 6.9 (passes on equality). Lit: will 6.9, armed 5.1 (households 1.5 -> 1.4),
old bound 5.1 + 0.1 x 17 = 6.8: red. The generator's own rule, score by score (n = 5): mil: will 23.93, armedOn 11.31, floor min(23.93, 6) = 6 ->
11.31; int: will 23, armedOn 14.4, floor min(23, 23) = 23 -> 23. Will = (11.31 + 23) / 5 = 6.86, EXACTLY the X4 rule's value; the int score
sits ON its X4 floor (23 > armedOn 14.4), which is the 1.72 the old bound does not allow. The will does not exceed the X4 floor anywhere: no fault.
Correction to the reading: the will did not rise (6.86 dark and lit, floor binding in both); the ARMED sum fell 0.1 lit, and the dark birth already
sat exactly on the old bound. The bound predates X4; the floor explains the gap.
