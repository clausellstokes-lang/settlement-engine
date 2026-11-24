# V53-CURES-V3: THE SIX REDS' CURES (the chair's RULING V3, relayed by VEIL-50 at 21:55 UTC 2026-11-24; the join's work, phase 1)

FIVE UNITS, EACH ITS OWN BUILDER (one at a time), EACH ITS OWN COMMIT, EACH RED FIRST, stacked in this order on
`lane/veil-53-2026-11-24-cures-wip` (worktree `/home/user/cures53`, cut from the trial join ba7460c33 by the FIRST builder:
`git -C /home/user/join53 worktree add -b lane/veil-53-2026-11-24-cures-wip /home/user/cures53 ba7460c33`, `node_modules` and
`.husky/_` symlinked from `/home/user/join53`; a later builder works on the branch's tip as it finds it). THE BUILDER IS TOLD
WHICH UNIT IS ITS OWN; it reads ONLY that unit's section, the "EVERY UNIT" laws, and the cause in
`docs/chair/2026-11-24/tenth/veil/out/v53/redscause/REDSCAUSE.md` (its unit's section; the probes beside it may be reused).

## EVERY UNIT
- Read whole the source files you change and each failing test's `it` block and the helpers it calls.
- RED FIRST: the red quoted in the commit message (title and the failing line), then GREEN. Where the ruling names a plant,
  the plant is a committed control (`it`) that plants and restores in one block and asserts the catch.
- Commit by explicit paths with the hooks (never `--no-verify`, never a hooks-path trick); never push; no pull request; no
  network; no hosted database; never the `supabase` command; `supabase/migrations/**` is NOT touched by any unit.
- Runs through `sh scripts/gate-mutex.sh --run -- ...` from `/home/user/cures53`, never read through a pipe, logs under
  `/var/tmp/v53/cures/<unit>/`. AFTER the commit: the unit's own test files; every test file that NAMES a src file you changed
  or one of its exported symbols (`git grep -l` over `tests/`; say the count); `tests/lint` WHOLE (COMMON-EIGHTH 11: list its
  failing titles against `/var/tmp/v53/grants/lintfails.txt`, the trial join's 66 less the grants row's absence; name any new).
- Cite code by symbol. A new test file's basename avoids the mutation-manifest words
  (census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin).
- A permission refusal: stop that line, report the exact command and reason; route round nothing.
- FINAL MESSAGE (at most 150 words): the commit hash; red (quoted) and green counts; the governing files' count and result;
  `tests/lint` whole with any red not on the trial join's list.

## UNIT A: (1) U5a and (2) U7b, FAIL CLOSED (`tests/generators/fortuneLawMerits.test.js`, `tests/domain/fortuneLastingSentence.test.js`)
THE RULING: on a read that lacks `legitimacy.breakdown`'s terms (prosperity, safety, defense) the governing paragraph
(`src/domain/display/governanceAccount.js :: governanceAccountOf` and what it calls: `legitimacyCausesOf`, the `onIt` turn)
writes NO clause it cannot ground; what remains is WHOLE AND TRUE: "<town> has lasted ...", never "It has lasted ..." with a
lost subject; a sentence that would be a fragment is not written. (S) (serving the terms) is NOT phase 1; (R) (re-pointing at
the stamped block) is VOID. BOTH TESTS ARE RE-STATED for the veiled read (the shared and widest reads: no cause clause; every
sentence whole; the subject is the place's name where the owner's read names it), AND THE OWNER'S READ KEEPS ITS CLAUSE,
ASSERTED (the cause clause present on the owner's record, on the cases the arm walks). U5a: the merits and score ride
unchanged on every read (asserted); the terms present on the owner's read, absent on a veiled read (asserted), not equal.
RED FIRST: the current reds (U5a 19/19, U7b 2/6), then a red of the re-stated arm against the OLD `governanceAccount.js`
("It has lasted" on visitor-thorp-52 widest) before the src change; green after.

## UNIT B: (3) `tests/domain/display/tensionCause.test.js` "(CAUSES-PARITY-2 F) hxd-city-138", THE TEST'S CURE WITH BOTH HALVES
THE RULING: the sentence ("Crime is on the rise here.") ASSERTED on the owner's read; its ABSENCE ASSERTED on the read whose
served document lacks that tension (the crime_wave tension dropped by `galleryRosterChoices.js :: applyRosterChoices`, row
`history.tension.crimeWave`, N102: the rule stands). Also assert the served document indeed lacks the tension (so the absence
is grounded, not vacuous). A test that only stops asserting is not a cure. No src change. RED FIRST: the current red; then
show the new absence-arm would red if the served document carried the tension (a planted tension restored in one block).

## UNIT C: (4) `tests/security/traditionDescriptionSharedPage.test.js` "TRAD-2 UNIT 2, PROVEN BORN" x3, THE TEST'S CURE IN THE LAW'S FORM
THE RULING: each case RE-PICKED BY THE CASE'S OWN FINDER (never a seed chosen for its answer), the reason beside it. The three
causes (REDSCAUSE (4)): NOT VACUOUS expects the curate model to omit a house's People eye (the lane's VR34, 97e51d7f6, now
offers it): re-state what "added" must hold under the lane's curate model, found by the test's own finder; CONTROL counts the
planted hidden house twice (as a house and as a removed phrase): the control's expectation follows the lane's veil (say which
rule removes the phrase, CONFIRMED by execution); (a)/(b) treat the power share as a floor while the lane's `power.share`
recompose (06e9e64b3) rescales to 100: compare by what the ruling keeps (name, category, the order; the share as the lane
serves it, VR31). THE BLOCK "TRAD-4 UNIT 8" IS ANOTHER SEAT'S: NOT TOUCHED. No src change. RED FIRST: the current three reds.

## UNIT D: (5) `src/domain/seat/holderOfSeat.js :: transferTakerOf`, THE SHARED PAGE NAMES THE OWNER'S HOLDER
THE RULING: after two transfers the shared page names the holder the owner's page names; the site registered in
`tests/lint/recentConflictReaders.walker.test.js`'s register (by its door: the walker's own register, with its reason);
RED FIRST BY THE TWO-TRANSFER PLANT (REDSCAUSE (5)'s construction, `r5.probe.test.js`: two "power behind" edges, the owner's
`recentConflict` naming the first taker): a committed arm asserting the shared read's holder equals the owner's, red at the
old code. THE CURE READS ONLY WHAT EVERY SHARED READ SERVES (COMMON-RULES 14 (e); N102: never a new served fact to cure a page
fault): if the owner's holder cannot be told from the served document without serving a new fact, STOP before any src change
and report what it would need.

## UNIT E: (6) VR26 AND THE IMPORT: ONE DEFECT, ONE CURE, WIDER THAN FORTUNE
THE RULING (the owner's rule: a place keeps its laws, through an import too): `src/domain/veil/importRederive.js ::
rederiveInPlace` and the VR26 harness's re-deriver (`tests/security/rosterChoiceInversion.pglite.test.js :: revisit`) read
the record without the laws it was born under. THE CURE PASSES EVERY GENERATION LAW OF THE RECORD in the laws' own form (the
record's markers, as `src/domain/seat/seatLaw.js :: withRecordSeatLaw` and its kin read them; `GENERATION_LAWS` in
`src/domain/density/densityCreateBoundary.js` lists the laws and their `configKey`s), to every engine call the re-derive makes
(`computePublicLegitimacy` is the one found law-blind: its fourth argument; check every other call). AND
`tests/domain/generationLawsSavedPlace.test.js` GAINS AN ARM for the veil's import re-derive that WALKS `GENERATION_LAWS` ROW
BY ROW: for each law, a record born under it re-derived through `rederiveInPlace` keeps the law's outcome (a law added later
must red this arm if the import forgets it: prove that by a planted extra row or a planted forgetting, restored in one block).
RED FIRST on vr26-city-calm-3 (stored defense 0, re-derived 10; `r5.out`'s IMPORT line), and the VR26 FIDELITY and MAIN reds.
SAY, CONFIRMED BY THE ARM: whether the SEAT law (`_seatLawVersion`) is forgotten in the import too (VEIL-53's read, PLAUSIBLE:
no callee of `rederiveInPlace` reads it; `computeBaseProsperity` already reads the fortune law from the config it is handed).
