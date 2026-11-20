# R3-CURE — brief (VEIL-23, the lane's owner; the seventh chair's rulings bind)

You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and green,
and merges. You never push and never open a pull request. A security lane: a slip is a leak; measure first, red first; a
failure falls toward WITHHOLDING, never toward sending.

## Where you work
- Worktree `/home/user/wt/r3c`, branch `v23-r3c`, cut from the lane tip c1b772e55 with R3 (9e082aa0a, VEIL-22's builder)
  cherry-picked on it as a3d54949b. `node_modules` is in place (hard links). Leave a3d54949b as it is; your cure is ONE
  commit on top of it. The seat squashes the two into the lane's single R3 commit.
- Read first, and no more than this: `CLAUDE.md`; `docs/chair/2026-11-20/veil/briefs/R3-BRIEF.md` (the stage);
  `docs/chair/2026-11-20/veil/out/v21/r3/R3-HANDBACK.md` (what R3's builder did and measured); the R3 commit's diff
  (`git show a3d54949b -- supabase src tests scripts`); the registry rows R3 owns in `src/domain/veil/rosterChoiceRegistry.js`.
- THE LAWS: 211 is BYTE-FROZEN (sha256 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`, rollback
  `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f`): prove both unchanged at your commit. Every cure
  goes into 212 AND into the client's twin (`src/domain/display/galleryRosterChoices.js`), rule for rule. RED FIRST:
  every new arm fails at a3d54949b before your cure and passes after, and both runs are saved to files.
- ALL DATABASES LOCAL: pglite, or the scratch PostgreSQL 16 at socket `/var/tmp/rv7` (`PGHOST=/var/tmp/rv7`, user
  postgres, trust; make your own databases named `r3c_*`). No hosted database, no credential, no `supabase` command, no deploy.
- Never run the whole suite. Never run a test with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR,
  GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment (`env -u` each one). Read a gate's exit code with
  `sh scripts/gate-tail.sh <command>`, never through a pipe. Commit with the hooks; never `--no-verify`.
- Save outputs under `docs/chair/2026-11-20/veil/out/v23/r3c/`, one file per figure you quote, and commit them with the cure.
- YOUR MARK: about 300,000 tokens. Before you reach it, stop cleanly: commit what is green, write the hand-back, and say
  what is left. A builder that ran on to 440k cost the lane a second builder.

## The units, in order

### 1. V8-4, AS THE CHAIR RULED (07:31 UTC, confirmed)
`tests/security/galleryVeilHandRows.*` V8-4 pinned that a top-level power which is a SHOWN power keeps its name. Its hand
row's "Thieves' Guild" is RAISED BY THE HIDDEN "Thieves' guild chapter", so the power rule now withholds it (8 lines,
"powerStructure.factions[0] lost its name"). THE RULING: **THE POWER RULE GOVERNS. A power raised by a hidden house is
not a shown power, and it is withheld WHOLE, never left as a row with no name.**
- Re-record V8-4 on a shown power that NO hidden house raises. Keep its floor and sweep arms.
- ADD an arm proving the raised power's row is gone WHOLE on every read (gallery, link, import, map member; both stored
  shapes; Reveal DM off and on). No row with no name; no row left with only its share or category.
- VR42 still holds beside it: the GOVERNING power's row is never removed while the government's name stays. Prove the two
  rules never collide badly. Take a town whose governing power a hidden house would have raised, and say exactly what is
  served there: the row, its name, its share, its relations. Do it as an executed arm with its output saved.

### 2. "WHOLE" MEANS EVERY COPY (the seat's reading of R3's SQL, lines 96-101 of its hunk)
`_gallery_veil_roster_choices` removes the power from `powerStructure.factions` ONLY. Find every other place the served
payload carries a withheld power. Measure first; write the counts to a file, by path, both stored shapes:
- master's shape: the top-level `factions[]` (R4 already treats `factions` and `powerStructure.factions` as twins);
- a person's affiliation naming it (`npcs[].faction` and the like); a power's members;
- the crisis cast's `stakes` naming it. R6's MAIN arm is red on this today: 30 lines, `cast.stakes` @ city-famine-7;
- any pointer to a ruling or dominant power, any count of powers, any relation outside `factionRelationships`;
- any other served string: search every string for each withheld power's name and count the hits by path.
Withhold each STRUCTURED copy in R3's host (212 and the twin). A hit inside composed prose (`publicProse`, sentences) is
R5's: list it by path and count, and do not touch the composers. A hit in neither class: STOP and report it.

### 3. CRIME TYPES FAIL CLOSED (a hole in R3, in 212 and in the twin)
Today an entry whose `type` is not a key of the `raisers` map (twin: `CRIME_TYPE_RAISERS`) is KEPT (`coalesce(..., '[]')`
raises nothing). Its comment says "unsure, withheld", and `plotHooks` already withholds a hook outside its pool. The cure:
- red first: a planted entry with an unknown type, on a town with a hidden house, is served at a3d54949b;
- the cure withholds an unknown type wherever a house is hidden whole;
- a walker that reads the engine's own set of crime types (`safetyProfile.js` and whatever it draws from), compares it
  with the map's keys in 212 and in the twin, and goes red on a type the map lacks. Run it red with one key removed.
Do the same parity walker for the `plotHooks` pool and the `rival` description list. They already fail closed, but a
drifted pool would quietly withhold every hook.

### 4. THE TWO OBSERVABLES NOT MET AS WORDED (the chair: the seat re-measures before accepting)
R3's measure (`out/v21/r3/measure-observables.txt`, m1/mm1) after R3:
- "Magical crime" served in 2 towns, outside the pool of towns with no hideable house;
- the Defense key a visitor derives from the served document, Reveal off: towns with a hidden house
  {organized 11, semi-organized 65, diffuse 5, none 11} against the control {organized 1, semi 7, diffuse 11, none 29}.
R3's builder says SHOWN houses drive both. That is a claim to PROVE, not accept. The test is the counterfactual. For each
such town (all of them, not a sample), compute the same quantity on the HOUSE-FREE COUNTERFACTUAL: the stored town with
every hidden house deleted, as R6's `tests/security/rosterChoiceCounterfactual.pglite.test.js` builds it. Write per town:
the served value, the counterfactual value, and the served element that drives the label.
- served equals counterfactual: the claim holds for that town; it is a SHOWN house's doing.
- served differs: a leak. If it is in an R3 row, cure it (red first). If not, name the row that owns it and STOP for the seat.
Keep R6's branch (`origin/lane/veil-22-r6-2026-11-20`, 7d9ebd078) as a reference only; do not merge it.

### 5. power.entry'S REACH (record it; change it only if the counterfactual proves the change)
R3 removes every non-governing criminal or "thie" power wherever ANY house is hidden whole, even a non-criminal one, and
even where a SHOWN criminal house raised the power. That falls toward withholding, which is allowed. Measure on born towns:
(a) how many power rows are withheld where no hidden house could have raised them (a shown criminal house, a hidden
ordinary house); (b) whether the served crime types (kept by attribution) and the served powers then disagree.
Report both counts. Narrow the rule ONLY if unit 4's counterfactual proves the narrowed rule exact on every born town.
Otherwise leave it, and the seat records the loss.

### 6. WHAT R3'S BUILDER LEFT UNFINISHED
Its reruns did not reach the lane: re-run the security guards, and the twin batch that never finished (`guards-twin.txt`),
on your tree. Name every red by file and line count. Known and NOT yours: `criminalVeilSwitch.test.js` (VS1 was aligned on
the lane at b5cb22caf: it must stay green), and `observedShapeReaders.walker` (violations 4 against frozen 1 and its
register arm: the close's governed rung). Any OTHER red: read it, attribute it, and stop if it is a regression.

### 7. GREEN, AT YOUR COMMIT (the seat re-runs each)
R3's born test `tests/security/galleryRosterChoices.pglite.test.js` with your new arms; the six veil guards and R2's born
test (`galleryWithholdAlways.pglite.test.js`); VR17's signal copies; V10-2's three files; `galleryVeilHandRows`;
`criminalVeilSwitch`; the registry `node scripts/veil/rosterChoiceRegistry.mjs --check` and its walker; the two harnesses
`tests/security/shareRenderTwice.pglite.test.jsx` and `tests/security/rosterChoiceInversion.pglite.test.js`; the
acceptance run (the readers' library at `/var/tmp/v18/lib`: `cd /var/tmp/v18 && PGHOST=/var/tmp/rv7
RV6_PGMOD=/var/tmp/v18/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/wt/r3c <outdir>`;
it must EXIT 0); typechecks; eslint on the files you touched. THE COST LAW (VR36): re-time the rows R3's hand-back timed,
including the largest born town's Reveal-DM gallery read against twice 211's Reveal-OFF read of the same town. Report 212's
and its rollback's sha256, and prove 211's two unchanged.

## Your hand-back
`docs/chair/2026-11-20/veil/out/v23/r3c/R3C-HANDBACK.md`, written as R3-HANDBACK.md is. For each unit: what you did, the
red and the green with their files, the counts, and what you would tell the seat. Last line: your commit's hash and the
files it touches.
