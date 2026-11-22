# FORTUNE U5s: SAFETY JUDGED AGAINST THE SIZE'S USUAL (the chair's ruling of 2026-11-20 15:58 UTC), DARK

Written by FORTUNE-3 on the chair's order: "THE SAFETY HUNK IS YOUR FIRST UNIT, NOW, ALONE: the leaf's DRAFT row
(`standing.safetyUsualRange`), the one hunk that reads it, dark under the fortune law, red first, FS4's arm (no score
falls; the Legitimacy Crisis share unchanged at every size) and the confinement with the law off (golden 525 of 525,
census 720 of 720)." After this commit is merged, `src/generators/factionDynamics.js` is RELEASED to the seat's lane
and this lane never touches it again: get the hunk right in one commit.

READ FIRST: `COMMON.md` (its laws bind); `U5-PROPOSAL.md` section 3 (PART 1, form `offset`) and section 10's first row;
`instruments/u5-rule.mjs`, patch `u5-safety` (the behaviour exactly, form `offset`; write it properly: no figure or
label outside the leaf's table). The chair's condition 1 (verbatim in `U5-BUILD.md`).

BRANCH: `lane/fortune-3-u5s-2026-11-20`, cut from the lane tip FORTUNE-3 names; ONE commit; push it as
`lane/fortune-3-2026-11-20-u5s-wip` (before every push `git ls-remote` and push only if the remote differs; never commit
while a push is in flight). Plain pushes with the hooks; never `--no-verify`, never a force push, never a pull request.

## THE RULE (under the fortune law only: `computePublicLegitimacy`'s fourth argument, read by `sizeRelativeStanding`)

The safety term of `src/generators/factionDynamics.js :: computePublicLegitimacy`: a label ON the calm ladder (lowest
first: Dangerous, Unsafe, Moderate, Safe, Very Safe) inside the size's usual range is worth 0; outside it, the label's
own points (`safetyContrib`) LESS those of the nearest band of the usual range. A label OFF the ladder (a crisis strain
such as "Tense — Plague", "Controlled — Authoritarian", "Dangerous — Criminal Governance") keeps today's points. Under
law 1, absent or garbage: today's line exactly. At untouched settings this moves one cell (a calm city's Unsafe, -8 ->
0); Safe (+15) and Very Safe (+20) keep their points at every size (the usual top is Moderate everywhere).

1. `src/domain/fortune/fortuneLaw.js :: FORTUNE_LAW_TUNING.standing` gains two DRAFT rows, documented in the leaf's
   header like their neighbours: `safetyCalmLadder` (the five labels lowest first; no exported list of them exists
   today, so the leaf holds it, guarded by the test below) and `safetyUsualRange` (thorp, hamlet, village, town,
   metropolis `['Moderate', 'Moderate']`; city `['Unsafe', 'Moderate']`; p10..p90 of seeds hxe, the proposal's
   `measures/u5-usual.txt`). Frozen like the rows beside them; the leaf stays zero-import.
2. `factionDynamics.js`: the ONE line `const sContrib = safetyContrib(safetyLabel);` is replaced IN PLACE by ONE line in
   the shape of its two neighbours (`pContrib`, `dContrib`): `sizeRelativeStanding(fortuneLaw) ? <helper>(...) :
   safetyContrib(safetyLabel)`. The helper is placed BELOW `computePublicLegitimacy`, beside U3's
   `sizeRelativeDefenceContrib`, with a JSDoc in their style. ⛔ NO LINE ABOVE U3's block may be added or removed: the
   holder census keys this file by line (U3's comment says so). Nothing else in the file: no relation line, no table.
3. A NEW decimal outside the table would raise the file's bare-decimal count in the tuning inventory (shrink-only):
   read every figure from the table. If the inventory or another register keyed on these files reds, re-take it by its
   own door and say so.

MANIFEST: `src/domain/fortune/fortuneLaw.js` (the two rows and their header lines), `src/generators/factionDynamics.js`
(the one line and the one helper), NEW `tests/generators/fortuneLawSafety.test.js`, registers keyed on those files that
red, re-taken by their own doors. No census rows (the integrator takes both censuses).

## THE TEST (red first; every expectation computed from `FORTUNE_LAW_TUNING`, `safetyContrib` behaviour through the
public function, and the ladder; never a quoted figure)

(a) DARK: for every (safety label on and off the ladder x size x prosperity x defence label) cell, `computePublicLegitimacy`
with no fourth argument, with 1 and with garbage ('2', NaN, 3) equals today's (compute today's by the law-1 call);
(b) LIT: inside the usual range the safety term is 0; below it, the label's law-1 term less the bottom band's law-1
term; above it, less the top band's; an off-ladder label's term equals its law-1 term; a calm city's Unsafe is 0 and a
village's Unsafe is not; (c) THE LADDER: every label the leaf lists is one `generateSafetyProfile` can return (drive it, or
read its returned labels over a grid of births), and the law-1 points rise strictly along the ladder; (d) FS4's ARM,
born forced (the fixture arm of `COMMON.md`): births under law 2 (two a size, untouched, and two a size with every dial
random: the DIALS of `instruments/run.sh`) whose safety term is never below the term the same town's safety label had
before this unit (the score never falls: compute it as the stored score minus this unit's safety term plus the law-1
term, or by the helper's definition) and whose band is never lower; (e) the same births without the marker
byte-identical to `_fortuneLawVersion: 1`.

GREEN AT YOUR COMMIT: your test; every test file naming `factionDynamics`, `computePublicLegitimacy`, `fortuneLaw` or
`rulingStructure` (`grep -rlE "factionDynamics|computePublicLegitimacy|fortuneLaw|rulingStructure" tests`): five of them
are red at the lane's base already (the line's stored fingerprints: worldFactRederive, pipelinePinnedChoosers,
powerEconomyFreshness, espionageDormancyFence, generatorGoldenMaster): a red is yours only if its titles differ from the
base's; `tests/lint` whole; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`;
`npm run validate:tuning-bands`. Default TMPDIR (/tmp) for every gate.

REPORT (at most 300 words): the commit; the files; the red (failing titles) and green (count lines); registers re-taken;
anything you stopped on. EXECUTED vs PLAUSIBLE.
