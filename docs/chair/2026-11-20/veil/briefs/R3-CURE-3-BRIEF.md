# R3-CURE-3 — brief (VEIL-24, the lane's owner; the seventh chair's rulings bind, each vetoable by the owner)

You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and green,
and merges. You never push and never open a pull request. A security lane: a slip is a leak. Measure first, red first.
A failure falls toward WITHHOLDING, never toward sending.

## Where you work
- Worktree `/home/user/wt/r3c2`, branch `v24-r3c2`, at b907c75c9 (the R3-CURE-2 builder's commit; R3 and the first cure
  under it). `node_modules` in place. ONE commit on top of b907c75c9. 212 at your base: sha256 `cde84613…79e2`.
- Read first, and no more: `CLAUDE.md`; `docs/chair/2026-11-20/veil/briefs/R3-CURE-2-BRIEF.md` (its "Where you work", THE
  LAWS and THE RULINGS bind you word for word); `docs/chair/2026-11-20/veil/out/v24/r3c2/R3C2-HANDBACK.md` (units 3 and 5,
  and its section "Left"); `git show b907c75c9 -- supabase src tests` where a unit below sends you.
- Outputs under `docs/chair/2026-11-20/veil/out/v24/r3c3/`, one file per figure. YOUR MARK: about 150,000 tokens.

## THE UNITS, IN ORDER

### 1. ATTRIBUTE THE TWO REVEAL-DM GOALS (a possible leak: the first act, before any change)
In `tests/security/galleryServerVeil.pglite.test.js`, towns "server-veil-city-infiltrated-0" and "server-veil-metropolis-3",
Reveal DM on: the goals of `npc_mages_guild` and `npc_smelter` (target `{ family, key, kind }`, no id) were withheld at
06e9e64b3, which matched a withheld power's label as a plain case-folded substring of the goal sentence, and are SERVED at
b907c75c9, which uses the lane's search (`gallerySecondHomes.js :: buildNameSearch`: name boundary, the served powers'
names left out as open names). Reproduce the two towns EXACTLY as that test builds them (its own seeds and dials; do not
guess). Print, to a file: each goal's `short` and `long`, its `intent` targets, every withheld power's name and id at that
read, every served power's name, and which substring the first cure matched. Then classify each:
- (a) A FALSE POSITIVE of the substring (a withheld name inside a longer served word or a served power's name; the goal
  names a SHOWN power or none): serving it is right. Record the reason in the test.
- (b) THE GOAL NAMES A WITHHELD POWER in a form the lane's search misses (a plural, a possessive, an article, a part of the
  name, the `{ family, key, kind }` target pointing at it): A LEAK. Cure it RED FIRST in BOTH engines by widening what the
  search or the target match recognises, never by going back to a plain substring that would withhold shown powers' goals.
  If the cure belongs to the lane's shared search (`buildNameSearch`, 212's name forms), say so and STOP for the seat: other
  stages call it.
- A goal whose `{ family, key, kind }` target resolves to a withheld power is withheld whatever its sentence says: check
  that rule exists in both engines. If not, it is unit 1's cure, red first.

### 2. COMMIT THE TOOTH
The second cure's tooth arm in `galleryServerVeil` (a goal aimed at a SHOWN power is still served on that read, byte for
byte) ran red ("expected 0 to be greater than 0" on `control.goals`) and was not committed. Make it bite truly. Plant a
goal aimed at a shown power if the hand rows hold none, and commit it green. A tooth that counts zero goals proves nothing.

### 3. ATTRIBUTE THE FOUR TWIN REDS AT THE BASE (measure only; change nothing in those tests)
`tests/domain/display/criminalVeilSwitch.test.js` VR34 (b) ("a power's members carried only on master's top-level list") and
three in `publicSafe` ("criminal faction … name, category and standing stay"; "Defense's criminal architecture … their data
goes"; "flipping every eye to shown reveals no DM-only field"). They are red at 06e9e64b3 too (`out/v24/r3c2/twin-reds-at-base.txt`).
For each: run it at 4c753ec52 (the lane tip, without R3), at 411565ff9 (R3) and at 06e9e64b3, to name the commit that
turned it. Read its assertion and say whether it pins behaviour a ruling overturned (the power rule: a power a hidden house
raised leaves whole; power.entry's reach), or whether it is a regression. Write a re-statement you would propose, with its
reason, into the hand-back only. THE CHAIR RULES before any of these four is edited.

### 4. GREEN, AT YOUR COMMIT
R3's born test whole; `galleryServerVeil` whole (81 of 81 with the tooth); `galleryVeilHandRows`; the registry `--check`;
eslint on touched files; the typechecks. If you touched 212 or the twin, also: the acceptance run (EXIT 0), the two
harnesses, and 212's and its rollback's sha256. Prove 211 unchanged.

## Your hand-back
`docs/chair/2026-11-20/veil/out/v24/r3c3/R3C3-HANDBACK.md`: each unit with its files, CONFIRMED vs PLAUSIBLE. Last line:
your commit's hash, its files, and 212's sha256.
