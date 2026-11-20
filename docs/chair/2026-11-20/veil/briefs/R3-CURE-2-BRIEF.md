# R3-CURE-2 — brief (VEIL-24, the lane's owner; the seventh chair's rulings of 09:04 UTC bind, each vetoable by the owner)

You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and green,
and merges. You never push and never open a pull request. A security lane: a slip is a leak. Measure first, red first.
A failure falls toward WITHHOLDING, never toward sending.

## Where you work
- Worktree `/home/user/wt/r3c2`, branch `v24-r3c2`, cut from the lane tip 4c753ec52 (which carries VR47, the honorific),
  with R3 (a3d54949b) and the first R3 cure (4db8e4208) cherry-picked on it as 411565ff9 and 06e9e64b3. `node_modules` is
  in place (hard links). Leave those two commits as they are. Your cure is ONE commit on top of them, unless a unit below
  says otherwise. The seat squashes the three into the lane's single R3 commit. 212 at your base: sha256 `de3efccb…`.
- Read first, and no more: `CLAUDE.md`; `docs/chair/2026-11-20/veil/briefs/R3-BRIEF.md` and `R3-CURE-BRIEF.md` (the stage
  and the first cure); `docs/chair/2026-11-20/veil/out/v23/r3c/R3C-HANDBACK.md` (what the first cure did, measured and
  left; its `measure/` scripts are yours to reuse, and their chains must be rebuilt in THIS container); the two commits'
  diffs (`git show 411565ff9 06e9e64b3 -- supabase src tests scripts`); the registry rows R3 owns in
  `src/domain/veil/rosterChoiceRegistry.js`.
- THE LAWS: 211 is BYTE-FROZEN (sha256 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`, rollback
  `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f`). Prove both unchanged at your commit. Every cure
  goes into 212 AND the client's twin (`src/domain/display/galleryRosterChoices.js`, and `gallerySecondHomes.js` /
  `galleryVeil.js` where the row lives there), rule for rule. RED FIRST: every new arm fails before your cure and passes
  after, both runs saved to files. A helper 212 adds that only the definer reads call is revoked from PUBLIC, anon and
  authenticated by name in the same commit (VR27).
- ALL DATABASES LOCAL: pglite, or the scratch PostgreSQL 16 at socket `/var/tmp/rv7` (`PGHOST=/var/tmp/rv7`, user postgres,
  trust; your databases named `r3c2_*`). If the socket refuses, the container rebooted: run
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"` and go on.
  No hosted database, no credential, no `supabase` command, no deploy.
- Never run the whole suite. Run pglite files with `--maxWorkers=1`, at most four pglite files a run. Run every test with
  `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX`. Read a
  gate's exit with `sh scripts/gate-tail.sh <command>`, never through a pipe. Commit with the hooks; never `--no-verify`.
- Outputs go under `docs/chair/2026-11-20/veil/out/v24/r3c2/`, one file per figure you quote, committed with the cure.
- You touch nothing of R4 (`galleryVeilPeople.js`, the re-key, the holders) and nothing of R5's composers
  (`publicProse.js`, `publicProseCompose.js`). A hit inside composed prose is R5's: list it by path and count.
- YOUR MARK: about 250,000 tokens. Before you reach it, stop cleanly: commit what is green, write the hand-back, and say
  what is left.

## THE RULINGS THAT BIND THIS STAGE (beside R3-BRIEF's and the first cure's)
- THE NAME SEARCH (ruling 28; the chair, 08:22 and 09:04): in the engines AND in every test that proves a withholding, a
  name is searched FOLDED, as itself AND as its BARE FORM (the name without its bracketed qualifier), and an id is searched
  as a STRING (a number id by its String()) and as a KEY. No stage narrows it to the full label. Use the lane's own fold:
  the twin's `gallerySecondHomes.js` (`QUALIFIER`, the bare fold in the name search) and 212's name forms ("itself, and
  itself without its bracketed qualifier"). Never write a third copy of the fold if you can call the lane's own.
- LEAVES WHOLE: a power a hidden house raised is not a shown power; it leaves WHOLE: its name and its id in NO served
  string and as NO key, in both stored shapes, the gallery read and the party link, Reveal DM off and on. This is proved by
  SEARCH, never by a list of fields. Structured copies are cured here; prose copies are R5's, listed by path and count.
- VR42: the GOVERNING power's row is never removed while the government's name stays. Keep the hand-town arm (the
  governing "Thieves' Guild" served whole, share 60).
- VR21 (dense, in order, no counter taken before a removal), VR29 (`criminalInstitutions` and `crimeTypes` stay arrays),
  VR31 (shares sum to 100 over what is served whenever any member is withheld, whatever withheld it), VR39 (a crime type
  leaves by attribution; an unknown type FAILS CLOSED).
- THE COST LAW (VR36): the named rows, and the Reveal-DM gallery read of the largest born town, bound by twice 211's
  Reveal-OFF read of the same town.

## THE UNITS, IN ORDER (each red first)

### 1. THE FOLD (the chair's ruling 1)
The first cure's goal check, its other structured-copy matches and its born arm all match the LITERAL full label (and a
string id). RED first by a PLANT: a withheld power whose name carries a bracketed qualifier (for example
"Thieves' Guild (powerful)"), named in a served string by its BARE form ("the Thieves' Guild" in a person's goal, a
membership, an affiliation key, a conflict party, a tension). Show it served at 06e9e64b3. Then:
- the born arm's leave-whole search uses the lane's fold (name and bare form, case-folded) and searches each withheld
  power's id as a string AND as a key, numbers included;
- 212 and the twin match every structured copy (goal sentences, memberships, affiliation keys, conflicts, tensions,
  contestsNiche) by the same fold;
- the plant goes green in both engines, Reveal DM off and on, both shapes, gallery and link.

### 2. THE DERIVED DEFENSE KEY (the chair's ruling 2: R3 IS NOT GREEN WHILE ANY TOWN DIFFERS)
The first cure's unit 4: of 92 hidden-house towns, the Defense key a visitor derives from the served document (Reveal off)
equals the house-free counterfactual in 78, is LOWER in 9, HIGHER in 5 (`out/v23/r3c/unit4-counterfactual.txt`).
- (a) THREE TOWNS (city-none-0-37, city-wartime-0-49, city-none-0-31) by the operations label "Rival Gangs", which the
  engine writes for the hidden "Multiple criminal factions" (row `safety.criminalInstitutions`; server
  `_gallery_veil_apply`, twin `gallerySecondHomes.js`). THE RULE: EVERY SERVED FIELD THAT FEEDS A DERIVED KEY IS
  RE-DERIVED OVER THE HOUSES THAT READ SERVES, OR WITHHELD. It is never served as stored beside a roster that no longer
  justifies it.
- (b) TWO TOWNS (town-indebted-0-16, town-wartime-0-19) by the covert rung, not attributed (`income.criminalRow` or the
  services veil). ATTRIBUTE FIRST: per town, measure which served field moves the key (serve each candidate as the
  counterfactual would and see which one alone closes the gap). Write it to a file. Then apply the same rule to it.
- The nine LOWER towns: say for each why the served key is lower. Lower is toward withholding and allowed, but name its
  cause. If the cause is a served field that a visitor reads as a tell, say so and stop for the seat.
- ACCEPTANCE: per town, the served Defense key equals the counterfactual's (or is lower with its cause named), AND the
  "Magical crime" observable equals it. Zero towns HIGHER, in both engines. The counterfactual is built as R6's
  `tests/security/rosterChoiceCounterfactual.pglite.test.js` builds it (origin/lane/veil-22-r6-2026-11-20 7d9ebd078, a
  reference only; do not merge it). Make this per-town equality an arm of the born test, not only a measurement.
- If a field that feeds the key is a row R3 does not own and cannot be re-derived from what is served, withhold it, add or
  amend its registry row with the reason, and say so in the hand-back.

### 3. THE TWO GUARD REDS (the chair's ruling 3)
`tests/security/galleryServerVeil*` "server-veil-city-infiltrated-0" and "server-veil-metropolis-3" (78 of 80): the
goal rule withholds a Reveal-DM person's goal aimed at a withheld power, and the guard pins the page that showed it.
RE-STATE the guard, with the reason in the test: a goal that names a withheld power leaves with it, under Reveal DM too
(the ruling "leaves whole" reaches every string). ITS TOOTH, executed: a goal aimed at a SHOWN power is still served on
that read, byte for byte (plant it if the hand rows hold none). Re-state nothing else in that file. Any other red there:
read it, attribute it, stop if it is not R3's.

### 4. THE SEAT'S READ OF 06e9e64b3 (measure each first; cure only what the measure shows)
- (i) NUMBER IDS: `wn` (the withheld powers' tokens) takes an `id` only when it is a string, in both engines. A power whose
  id is a NUMBER keeps its copies (a membership `{ id: 7 }`, a goal target id 7). Red first by a plant; match by String().
- (ii) THE SHARE SUM: 212 tests `sum(power::numeric) <> 100`; the twin tests a JavaScript float sum `!== 100`. With
  fractional shares (33.3, 33.3, 33.4) the two engines may disagree on whether to re-derive. Plant it; if they disagree,
  make them agree (prefer the exact comparison in both).
- (iii) A POWER WITHHELD WHERE NO HOUSE IS HIDDEN WHOLE: the structured-copy pass runs only under `whole` (a house of `pub`
  missing from the body). Measure, on born towns and the hand rows, Reveal DM off and on: where the projection or the veil
  withholds a power while no house is hidden whole, does any served string or key still name it (by the fold)? If yes, it
  is a leak by the "leaves whole" ruling: cure it red first (run the copy pass wherever `wn` is non-empty).

### 5. WHAT THE FIRST CURE DID NOT RUN (owed before the seat can merge)
At your commit, each with its output file: R3's born test whole (`tests/security/galleryRosterChoices.pglite.test.js`)
with every new arm; the six veil guards; R2's born test (`galleryWithholdAlways.pglite.test.js`); VR17's signal copies;
V10-2's three files; `galleryVeilHandRows`; `criminalVeilSwitch` (it must stay green); the twin batch the first cure never
finished (`guards-twin`); `node scripts/veil/rosterChoiceRegistry.mjs --check` and its walker
(`tests/lint/rosterChoiceRegistry.walker.test.js`); `tests/lint/rosterChoicePools.walker.test.js`; the two harnesses
(`tests/security/shareRenderTwice.pglite.test.jsx`, `tests/security/rosterChoiceInversion.pglite.test.js`); THE ACCEPTANCE
RUN (`cd /var/tmp/v18 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v18/pgmod sh
lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/wt/r3c2 <outdir>`: it must EXIT 0); the typechecks;
eslint on every file you touched; THE COST LAW (the first cure's `measure/big-cost.mjs` and the v8245 rows, against 211
on chains you build here). Report 212's and its rollback's sha256, and prove 211's two unchanged.
KNOWN REDS, NOT YOURS: `observedShapeReaders.walker`; `phoneChromeFloor.census`, `presumedThings.walker`,
`presumptionClasses.walker`, `writerReach.walker` (stage L of the lane). Report them unchanged; do not touch them.

### 6. THE OWNER'S COUNTS
Say plainly, with the files: of how many born pages, how many lose a criminal power's row that no hidden house raised (the
first cure: "9 pages lose a Thieves' Guild row"); VR42 met by how many of the born towns (the first cure: 0 of 140).

## Your hand-back
`docs/chair/2026-11-20/veil/out/v24/r3c2/R3C2-HANDBACK.md`, written as R3C-HANDBACK.md is. For each unit: what you did,
the red and the green with their files, the counts, CONFIRMED vs PLAUSIBLE, and what you would tell the seat. Last line:
your commit's hash, the files it touches, and 212's sha256.
