# COHERENCE-VEIL — hand-back, part 18: the seventeenth seat (the join into pull request #75, then 212 finished)

Seat: VEIL-17, branch `lane/veil-17-2026-11-19` (local `veil17`, worktree `/home/user/wt/veil17`). Assignment:
`lane/chair-2026-11-08 :: docs/chair/2026-11-19/veil/prompts/VEIL-17.txt` (the chair is session_01FbPLbcLDSJzZFzb5B7EjxR).
Every database is an in-process pglite or a scratch native PostgreSQL 16.15 cluster in this container (`/var/tmp/v17pg`,
locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7` only, `listen_addresses = ''`). No hosted database, no production
credential, no `supabase db push`, no `migration repair`, no deploy, no pull request. **Nothing is applied anywhere but
those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to (each vetoable by the owner)

THE OWNER'S WORD (the chair's chat, 2026-11-19 ~05:00 UTC, verbatim): "Yes get 211 and 212 in there": migrations 211
(frozen) and 212 (its later cures) go into pull request #75 BEFORE the deploy. 212 is not applied until a FRESH security
reader (REVIEW-VEIL-9, a separate seat) clears its final text; this seat never clears its own work.

PART 17's section 0 stands whole (its rulings, the chair's re-ruling of 2026-11-14 07:42 UTC, the ruling on V13-1, the
chair on item 0, the non-ASCII withholding call of 2026-11-15). THE LAWS, as the assignment restates them: 211's two
files BYTE-FROZEN; every cure into 212 and the client's twin; a house hidden whole and anything that gives it away never
reaches a non-owner read (gallery, party link, import, public page, map; both stored shapes; reveal-to-DM on and off);
WHERE THE VEIL CANNOT BE SURE, IT WITHHOLDS; THE COST LAW: no read more than twice the frozen 211 on the reader's 300 KB
row, its V8-3 row and the largest born town; a read never fails where 211 serves; RED FIRST; ALL DATABASES LOCAL.

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` |
| 212 at the join (unchanged from 4fa35f294) | `46389052ea3460a2b0ce8181df0e0c0c7599fe4c63e29af58f55ff06941bce0b` / down `5b3eb697ae2531f83c2586d2c59b5afe414e6647ba65b9a884e9dfd09ddf694f` |
| 212 after V8-9 (284583359; the builder's cfa727a9d) | `d1b5da911f66d41c3f0350cf93dcf792b4e000fe5ca39f1fe5ea69cd9103a938` / down unchanged `5b3eb697ae2531f83c2586d2c59b5afe414e6647ba65b9a884e9dfd09ddf694f` (no signature added) |

212 is NOT final.

## 2. STEP 1, THE JOIN

`lane/veil-17-2026-11-19` cut from origin/lane/coherence-veil-2026-11-11 at **4fa35f294** (read back from origin: equal);
origin/lane/landing-pieces-2026-11-18 at **8f3b8bf4b** (pull request #75's head, read back: equal) merged with `--no-ff`;
merge-base **e969a75b7** (the chair's). Commits:

| Commit | What |
|---|---|
| dfad3a18b | THE MERGE. No code conflict. Conflicted registers: `docs/content/wiring-census.json` (re-taken by its door at the merged tree, `node scripts/wiring-census.mjs`, `--check` exit 0: the line's census, producerIndexFiles 1435 -> 1436, the veil's own src file), `scripts/.writer-reach-baseline.json` and `tests/lint/.lighting-census-baseline.json` (held at the line's bytes in this commit only: both doors stamp HEAD, the census refuses a dirty tree). `scripts/mutation-coverage-manifest.json`, `tests/lint/tuningRegister.walker.test.js`: merged clean, both sides' rows. The merge touched exactly the union of the two sides' files (proved both ways by `git diff --name-only`). |
| 1e0d63a02 | The writers' reach by its shrink-only door (`--write`): cohort 1385 -> 1384 ("impression on presentation", lit by the veil's twin), 0 registered rows now lit; the plain check after it exit 0. |
| d7abcdc55 | The lighting census by its door (`LIGHTING_CENSUS_REFREEZE=VEIL-17`): files 3699 -> 3705, parked 471 -> 472, credited 3228 -> 3233, titles 31153 -> 31218, suiteTitles 8626 -> 8631: exactly the line's figures plus the veil's own movement since the merge-base (+6/+1/+5/+65/+5); the walker after it 34 of 34. |

GREEN AT THE JOINED TREE (d7abcdc55; every run to a file, read by its count lines, never through a pipe):
- `tests/security` whole: 156 files passed, 1 skipped (`customContentLockOrder.postgres.test.js`, which asks a live
  PostgreSQL env: not the veil's), 1,986 tests passed. galleryVeilHandRows, the client twin's tests among them.
- The line's public-projection guards and the twin's tests (130 files: toPublicSafe's, publicProseEquality, the
  publicProseVeil arms, publicSafeVeil, worldSnapshotPublic, houseLabelEverySurface and the PDF's every-surface tests,
  the Foundry journal's, tests/lib/gallery*, the party link's, the store's gallery import, the register walkers):
  127 files and 2,239 tests passed; 3 files, 5 titles red: SEE BELOW.
- `npm run typecheck:domain:strict` exit 0 (1113, ceiling 1113); `npm run typecheck:ratchet` exit 0; `npm run lint`
  exit 0 (0 errors, 38 warnings).
- The reader's acceptance run (REVIEW-VEIL-7 `run-all.sh`) at the joined tree: exit 1, a07 and d06 the only FAIL rows
  (items B and C), checks 37 / PASS 35, the twin 15 of 15 equal, V7-10 and V7-6 PASS: unchanged from PART 17.

THE FIVE RED TITLES ARE THE VEIL'S OWN, CARRIED, NOT MADE BY THE JOIN: the same three walkers run at the veil's own tip
4fa35f294 (a `git archive`, `node_modules` linked) red on the same five titles (plus four refreeze-ritual titles there,
which need a git repository and pass in the worktree). Named, not repaired (no adjacent repair; each is a register row
for a ruling):
1. `tests/lint/mutationCoverageManifest.test.js` TOTALITY: `tests/security/galleryVeilHandRows.pglite.test.js` has no
   manifest entry. Proposed: a rationale row `pglite-executed`, as its four veil siblings have.
2. `tests/lint/ruinFilterRoster.walker.test.js` (two titles): `src/domain/display/gallerySecondHomes.js` reads the raw
   `.institutions` roster; the reader count 115 -> 116. Proposed: a `RUIN_AGNOSTIC_EXEMPT` row (name-lookup: the veil
   reads the roster to withhold names, a ruined house's name included) and the pinned count 116, by identity.
3. `tests/lint/tuningRegister.walker.test.js` (two titles): `gallerySecondHomes.js` carries one unregistered named
   constant (`NAME_WALK_BOUND = 64`, the walk's security bound), so `UNREGISTERED_NAMED_CEILING` 541 -> 542. Proposed:
   the ceiling raised by one with a DECLARED_GROWTH row, in the form of the chair's ruling TU1: a ceiling is the
   chair's to raise.

THE CHAIR'S RULINGS ON THE THREE (2026-11-19 05:43 UTC, copied whole): "VR1 GO: galleryVeilHandRows.pglite takes its
mutation-manifest row with the rationale `pglite-executed`, as its four siblings. VR2 GO: gallerySecondHomes.js takes a
RUIN_AGNOSTIC_EXEMPT row, reason "a name lookup: the veil withholds a hidden house's name whether the house stands or
lies ruined (it fails toward withholding)", and the pin 115 -> 116. VR3: REGISTER `NAME_WALK_BOUND` (and any bound V8-9
adds) in the tuning register as a proper entry, so UNREGISTERED_NAMED_CEILING does not grow; only if the register's form
asks for something you cannot state truly, fall back to a DECLARED_GROWTH row in TU1's form naming VR3."
AS BUILT: VR1 6d73b0fe9 (the walker 1 of 10 red at the join, 10 of 10 after); VR2 3fce0a80e (2 of 12 red, 12 of 12
after; eslint 0). VR3 NOT YET BUILT, and why its fallback: the register's proper entry for a named constant is a row the
owner signs (`declaredGrowth.unregisteredNamed` rows all say "the name earns its register row when the owner signs the
estate"; a `_TUNING` table would state a security bound to be a tuning value, which it is not); so VR3 takes the
DECLARED_GROWTH fallback in TU1's form (the row in `tests/lint/.tuning-register.json`, the two ceilings +1, the
inventory banked by its ritual `TUNING_INVENTORY_REFREEZE`), built once V8-9 lands so any bound it adds rides with it.

## 3. STEP 2 (in the assignment's order)

| Item | State |
|---|---|
| V8-9 | DONE, 284583359 (the builder's cfa727a9d to `briefs/SUB-BRIEF-V8-9.md`, cherry-picked onto the lane line). THE BOUND, one in both engines: the search's patterns (the alternation and every cut-out) at most 16,384 code points together, a weight (code points x distinct code points, summed) at most 4,194,304, at most 16 cut-outs; births at most 3,413 / 4,413 code points, weight 933,621, 2 cut-outs; the least refusal 3.2x (size) and 7x (weight) above. THE CLOSED ANSWER past the bound or on a raise: every key and string answers as a hit (the floors aside): the reader receives the town's name alone; the read serves. RED at ad093c92c's bytes: the new arm 90 faults (36 server reads raise); GREEN 0 faults in 55 s, server against twin 0 paths, under the bound 24 of 24 responses equal to the base's. COST (ms, x211 / base / after): V8-3 row 6,822 / 7,958 / 7,885 (1.16x); Langengrund link 290.1 / 504.2 / 490.8 (1.69x), gallery default veil 340.7 / 521.6 / 538.8 (1.58x); the reader's 600x145 223 / raises / 264, 1,000x80 388 / raises / 437, 1,500x145 671 / raises / 778. Born 1,152 rows 0 differ; V13-1 plant 18 of 18. Proof files `out/V89-*.txt`. THE SEAT READ THE DIFF LINE BY LINE (212's `_name_search` bound and exception block, `_name_hits` closed and exception paths, every caller of `p` and `blank`: `blank` reaches only look-ups after the search; the twin rule for rule: code-point length, distinct by code point, the same order of checks, the same closed answer on a refused compile; `NAME_SEARCH_BOUND` a frozen object, no named constant; the guard arm additive, 117 lines, none removed): nothing to cure. EXECUTED BY THE SEAT: the acceptance run at cfa727a9d exit 1, a07 and d06 only, twin 15 of 15, V7-10 and V7-6 PASS; the six guard files (section 5). NOT DONE (the builder's note): no bound on the separators-only names (not patterns; one `position` a token). PLAUSIBLE only: the closed read's memory under hosted limits. |
| V8-2, V8-4, V8-5; B, C, D; E | not started. Notes for V8-2: the defence rows find their house by name (`_gallery_veil_sources` 'houses', keyed by card name; applied in `_gallery_veil_second_homes` at the `defenseProfile.institutions` loop); identity is `catalogId` (`catalogIdForName` = the catalogue lookup of the trimmed lowered name). V8-4: `_gallery_veil_name_floor` floors only `powerStructure.factions[]`. V8-5: the reader's own remedy (keep the person named) would send the hidden house's name inside the person's name, against the law; the lawful cure by identity is that a tie whose end the sweep removed leaves with it. |

## 4. THE FRESH READER'S FINDINGS (REVIEW-VEIL-9, through the chair) AND VR4

The chair sent V9-1 (the gates twin `gatesSmugglersLine`, #75), V9-2 / ruling VR5 (holders' role and title under the
default veil), V9-3 (the Shadows District quarter, on master too) and ruling VR6 (the owner's own design: the income
shares re-derived where the criminal row is withheld), with RULING VR4: cure THE CLASS; measure first; propose ONE
mechanism before building. MEASURED by a read-only seat (`out/VR4-REPORT.md`: 240 births, a 20-cell read matrix on 211
and 212). PROPOSED to the chair (06:5x UTC): a roster-choice registry read by 212 and the twin; NO stored twin (a new key
on the saved record is against the lane's law and VR6 (5)); per path (a) recompose where SQL rebuilds the served-roster
wording exactly from served data alone, else (b) withhold wherever a hidden-whole house could have chosen it;
spatialLayout.quarters withheld whole (nothing draws it on a non-owner page); two rows (the diffuse safety bands, NPC
roster composition) and the `npc_veiled_` id prefix left for the chair or the owner. AWAITING THE CHAIR'S ANSWER: nothing
of VR4 is built.

THE CHAIR'S RULINGS ON THE VR4 PROPOSAL (2026-11-19 06:53 UTC, copied whole; each vetoable by the owner): "VR7: THE
MECHANISM IS APPROVED as proposed: one ROSTER-CHOICE REGISTRY module (path, chooser, house predicate, rule) read by 212
and the twin alike; (a) RECOMPOSE where SQL rebuilds the served-roster wording EXACTLY from served data alone, (b)
WITHHOLD everywhere else a house hidden whole could have chosen it; NO stored twin and no new key on the saved record;
the guards as proposed (a registry walker red on any unregistered roster predicate or crime-name regex; a born
counterfactual test in both engines). VR8, the diffuse rows: LEAVE THEM DIFFUSE, RECORDED: the overall safety band
(safetyLabel) and the roster's general composition are statistical signals, not a tell of a house; they stay, named in
the pull request as known residual signals for the owner's veto. BUT any safetyDesc or other sentence that names crime
SPECIFICALLY (organised crime's foothold, a black market, smugglers) is not diffuse: it is (a) or (b). VR9, the
holders: before you blank a role, MEASURE the base rate of people shown with no role on unveiled pages; if role-less
people are rare (a blank role would itself tell), the holder's card is withheld WHOLE with its ties instead; if they are
common, blanking stands. VR10, the `npc_veiled_` prefix: do not touch the saved record; try instead a per-read re-key of
EVERY person's id on non-owner reads (salted, consistent within one payload), so no prefix or pattern tells; measure
whether any non-owner view needs an id stable across reads; if one does, report it and it becomes the owner's question
(re-minting at birth changes the saved record). Push your report and the measurement with your V8-9 work; your successor
builds the mechanism from your hand-back."
FOR THE SUCCESSOR: VR7 is built from `out/VR4-REPORT.md` section 3's placement table, read against VR8 (the safety band
and roster composition stay; a crime-specific safetyDesc sentence is (a) or (b)), VR9 (measure the role-less base rate
first) and VR10 (per-read salted re-key of every person's id on non-owner reads; measure id stability needs first).

THE CHAIR, FOR THE HAND-BACK (2026-11-19 07:01 UTC, copied whole): "the reader's COUNTERFACTUAL DIFFER is built
(differ.probe.jsx on lane/review-veil-9-2026-11-19; 140 new-shape + 70 master-shape births; each veil, reveal off/on; a
control cutting ordinary houses). Its BOUND with every eye shut: 130 differing paths in the new shape, 113 in master's:
49 derived numbers/booleans (criminalEffective 56.9→31.3, safetyRatio, defence scores, FACTION POWER), 24 crime-worded
texts (the crime_wave tension 81 towns; Shadows District 71; economicDragDesc 48; the gates twin;
powerStructure.stability "Unstable (pervasive organized crime)" 14; the publicOrder rung 21; the shadowEconomy block 24;
templeFraud 8; merchantCriminalBlur), 44 other texts/labels, 13 history re-drawn (rng only). NEW: V9-5 HIGH (old, on the
veil lane): with block:power.criminalUnderside shut by hand, the server withholds blackMarketCapture but sends the
publicProse shadowEconomy sentence COMPOSED FROM IT (the link, reveal off, 12 of 24 towns); V9-6 MED: with the receipt
shut, general:viability.verdictLines composed from it ships (8 towns). RULINGS: VR11 faction power gets VR6's treatment:
where a power is withheld, the remaining powers' shares are re-derived to 100 by largest remainder before the bytes leave
(the same tell as the income shares). VR12 a publicProse block (or any composed sentence) whose INPUTS include a
withheld field is withheld or recomposed with it, by rule in the registry, not case by case (cures V9-5, V9-6 and their
class). VR13 history re-drawn by the rng alone is information-free (the seed never ships): accepted, recorded. THE
CLEARANCE STANDARD: at FINAL the reader re-runs the differ; every differing path must be in the registry with its rule
(a or b), or ruled diffuse (VR8), or rng-only (VR13): zero unregistered paths."
FOR THE SUCCESSOR: the registry's first rows are the differ's 130 / 113 paths (run it first: it is the list); VR11 and
VR12 are rules of the registry (a share re-derived like VR6; a composed block follows its inputs' rule).

RULING VR14 (2026-11-19 07:02 UTC, copied whole), on the differ's 49 DERIVED NUMBERS: "in scope by what a number can be
made to say (the repository is public, so a precise figure with a hidden term can be inverted from the known formula).
(i) Numbers that measure crime or the underworld itself (criminalEffective, criminalPreStress, blackMarketCapture, the
compound's criminal figures, crime counts and types, safetyRatio while it carries the crime term): WITHHELD. (ii) Shares
or counts that must add up: RE-DERIVED to add up (VR6, VR11) or withheld. (iii) PAYLOAD MINIMISATION: a non-owner read
carries any other derived number only in the form a shared page DRAWS it (band or label or drawn score); a raw figure no
shared page draws is not sent. (iv) What a shared page draws stays, recorded as DIFFUSE (VR8), unless the reader's
differ shows the drawn form alone identifies a house (then it is (i)). The registry records each number under (i) to
(iv); at FINAL a precise figure with a hidden term reaching a non-owner read undrawn is a finding."

## 5. THE WALKERS (VR1, VR2, VR3) AND THE DOORS AFTER V8-9

VR1 6d73b0fe9 and VR2 3fce0a80e (section 2). VR3 by its fallback: ef0eacb3f (the DECLARED_GROWTH row for
gallerySecondHomes.js, introducedAt 5abf99906, the cause naming VR3; UNREGISTERED_NAMED_CEILING 541 -> 542,
DECLARED_GROWTH_CEILING 14 -> 15) and 841d492f9 (the inventory by its ritual `TUNING_INVENTORY_REFREEZE=VEIL-17`: exactly
gallerySecondHomes.js 1 and unregisteredNamed 541 -> 542). After them the three walkers 98 of 98: the five titles carried
from 4fa35f294 are green. The lighting census re-taken by its door at 841d492f9 (0837a7fb2: titles 31218 -> 31219, V8-9's
arm; the walker 34 of 34). The wiring census `--check` and the writers' reach check at the tip: exit 0.
NOTE for the instruments: a worktree whose `node_modules` is a SYMLINK is "dirty" to the inventory's ritual and the
census's door (the ignore pattern `node_modules/` matches a directory only, and the walker isolates git from the
environment); use `cp -al <a real node_modules> node_modules` in a scratch worktree.

## 6. HANDED BACK AT THE MARK (2026-11-19, after V8-9 and VR3)

The count read by `get_session` before the VR4 proposal: 278,293, at the mark of 300,000; the chair was told the seat
hands back after V8-9 is read and pushed. Nothing is running; every commit is pushed (the tip: the commit carrying this
file). 211's two files untouched, proved at the first commit and at the last (eface6d0…0be01 / ce8474ff…49712f).

**DONE:** STEP 1, the join (section 2), green, JOINED sent; VR1, VR2, VR3; V8-9 (212 `d1b5da91…`); the VR4 class measured
(`out/VR4-REPORT.md`) and its one mechanism proposed and APPROVED (VR7), with VR8 to VR14 and the clearance standard
recorded (section 4).
**WHAT IS LEFT, in order (the assignment's STEP 2 and the chair's rulings):**
1. V8-2, V8-4, V8-5 (each one commit by identity, else into the pack's WHAT 212 DOES NOT CLOSE; section 3's notes).
2. B (V7-5, a07), C (V7-8, d06; R3 with it), D (the income row by its house: VR6 folds it in, section 4).
3. VR7, THE MECHANISM, built from `out/VR4-REPORT.md` section 3 read against VR8 to VR14: first run the reader's differ
   (`differ.probe.jsx` on origin/lane/review-veil-9-2026-11-19) — its 130 / 113 paths are the registry's first rows;
   VR9 and VR10 measure first (the role-less base rate; whether any non-owner view needs a stable person id). The
   clearance standard: zero unregistered differing paths at FINAL.
4. E, the acceptance run at ONE checksum, ONE message to the chair; 212 unchanged until the chair answers. F and G after.
**FOR THE NEXT SEAT:** the instruments are this container's (PART 17 section 5, with `/var/tmp/v17` for `/var/tmp/v16`
and `/var/tmp/v17pg` for the cluster; section 5 above for `node_modules`); the guard set is six files (galleryVeilHandRows
18 titles now); the measure scripts of V8-9 are in `docs/chair/2026-11-19/veil/measure/`.
