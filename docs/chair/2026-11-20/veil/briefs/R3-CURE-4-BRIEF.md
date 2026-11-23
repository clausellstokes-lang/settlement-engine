# R3-CURE-4 — brief (VEIL-25, the lane's owner; the seventh chair's rulings bind, each vetoable by the owner)

You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and green,
and merges. You never push and never open a pull request. A security lane: a slip is a leak. Measure first, red first.
A failure falls toward WITHHOLDING, never toward sending.

## Where you work
- Worktree `/home/user/wt/r3c4`, branch `v25-r3c4`, at 9b18835d1 (R3 411565ff9, R3-CURE 06e9e64b3, R3-CURE-2 b907c75c9,
  R3-CURE-3 9b18835d1). `node_modules` in place (hard links). Leave those four commits as they are. 212 at your base:
  sha256 `cde846131969c93a094ef518a1ce8dec74d33dff1532b91f3e3dca5310ad79e2`.
- YOUR COMMITS: FIRST the red arms of unit 1 (the patch below), committed RED with the red run saved beside them; THEN one
  cure commit for units 1-2 (212 and the twin); THEN, if you reach them, one commit each for unit 3 (the gate's instrument)
  and unit 4 (VR34 (b)). Each commit names its unit and its receipts in its message.
- Read first, and no more: `CLAUDE.md`; `docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART25.md` section 1 (THE
  RULINGS IN FORCE: they bind you; rulings 11, 28, 30, 31 and 37 above all); `docs/chair/2026-11-20/veil/briefs/R3-CURE-2-BRIEF.md`
  ("Where you work", THE LAWS and THE RULINGS bind you word for word, with `r3c2` read as `r3c4` and `out/v24/r3c2` as
  `out/v25/r3c4`); `docs/chair/2026-11-20/veil/out/v24/r3c3/R3C3-HANDBACK.md` WHOLE (the two findings you cure);
  `out/v24/r3c3/UNCOMMITTED-red-arms.patch`; then the code a unit sends you to. The diffs of the four commits only where you
  need a rule's history (`git show <c> -- supabase src tests`).
- Databases: the scratch PostgreSQL 16 at socket `/var/tmp/rv7` (user postgres, trust; your databases named `r3c4_*`), or
  pglite. A refused socket: `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"`.
  The readers' library is at `/var/tmp/v18/lib` and `/var/tmp/v18/rv9`; the pg driver at `/var/tmp/v18/pgmod`.
- Outputs under `docs/chair/2026-11-20/veil/out/v25/r3c4/`, one file per figure you quote, committed with the commit that
  quotes it.
- You touch nothing of R4 (`galleryVeilPeople.js`, the re-key, the holders), nothing of R5's composers (`publicProse.js`,
  `publicProseCompose.js`), and no line of `src/components/`. A hit inside composed prose is R5's: list it by path and count.
- YOUR MARK: about 250,000 tokens. Before it, stop cleanly: commit what is green, write the hand-back, say what is left.

## THE UNITS, IN ORDER

### 1. THE GOAL HUSK — A LEAK (the chair, 11:12: "a goal naming a withheld power LEAVES WITH IT: the whole goal, every field of it; a husk is a tell")
Found by R3-CURE-3 (its hand-back, finding 1): on server-veil-city-2 and server-veil-metropolis-7 (Reveal DM, the default
veil), a goal aimed at the withheld Thieves' Guild is served with its sentence and its target `id` stripped and its `intent`
left (`{"intent":{"long":{"family":"POWER","key":"expand_influence","kind":"tense","target":{"kind":"power"}}}}`), in BOTH
engines. The likely mechanism (PLAUSIBLE, not traced): a string-level sweep strips the withheld name first, so the goal rule
afterwards finds neither a target id nor a sentence to match.
- RED FIRST: `git apply docs/chair/2026-11-20/veil/out/v24/r3c3/UNCOMMITTED-red-arms.patch`; run it; save the red; COMMIT IT
  RED (the chair's word). Name the red titles and their fault counts in the message.
- TRACE THE MECHANISM before you cure: say, with the line of each engine (by symbol), which pass strips which field, in what
  order.
- THE CURE, in 212 and the twin: a goal that names a withheld power (its target id, by the id search; either sentence, by the
  lane's fold; judged on what the person's goal held BEFORE any pass stripped it, e.g. `pub` by person id, or by running the
  goal rule before the sweep) leaves WHOLE: the `goal` key gone from the card, every field of it. Never a goal with fields
  blanked.
- THE CLASS, MEASURED (this is the point of the unit): a husk is not only a goal. On the born pool and the hand rows, both
  shapes, gallery and link, Reveal DM off and on, find every served OBJECT that, in the pre-sweep projection, held a withheld
  power's name or id in one of its fields and is still served with that field removed or blanked (a membership, a conflict, a
  tension, a relationship, a trace entry, a crime type, anything). The search cannot see a husk because the name is gone, so
  compare the projection with the served body by path. Write every such path with its count to a file. A structured copy is
  cured here (it leaves whole, red first); composed prose is R5's and is listed. An empty list is a finding: say so with the
  number of objects compared.

### 2. THE EXEMPTION — THE OTHER DIRECTION (the chair's ruling 37 (a))
R3-CURE-3's finding 2: the plant's SERVED power "Old Thieves' Guild Watch" (civic, raised by no house) is withheld WHOLE by the
twin on the Reveal-DM open read, so its goal never reaches the page. RULED: it stays served BYTE FOR BYTE. The ONLY exemption is
a hit lying WHOLLY inside the name of a power or house the SAME document serves, and the test NAMES that containing served
name (a positive exemption, never "the boundary search did not fire").
- Find which rule withholds the Watch (power.entry, the copy pass, the projection, the share pass), in both engines; read the
  server too (R3-CURE-3 read only the twin).
- Cure it in both engines, red first, WITHOUT narrowing the search: the fold (a name and its bare form, case-blind, a
  possessive and a plural ending as a boundary) stays at full strength. The served power's own goal and membership are served
  byte for byte, and the test says the exemption's containing name.
- With the tooth passing, run ruling 37 (a)'s three forms (possessive "the Thieves' Guild's fixer", plural lower case "the
  thieves' guilds of the coast", capitals "THE THIEVES' GUILD"): each leaves in both engines, Reveal DM off and on.

### 3. THE R3 GATE AS AN INSTRUMENT (the chair's ruling 37 (b) and its three conditions of 10:28; ruling 30)
THE GATE: per town, EVERY label a visitor's page derives from the served document (the Defense key,
`criminalStructureKey.js`; "Magical crime"; list any other derived label you find the page computing from fields R3 touches)
equals the label of the town's REGENERATED counterfactual (the generator run with every hideable house cut at every step),
over EVERY hidden-house town of the pool (the 92 of `out/v24/r3c2/unit2-keys-after.txt`), both engines, Reveal DM off and on.
HIGHER blocks. LOWER passes only where the town is assigned to a named, RULED fail-closed rule.
- ONE COMMAND that runs it and writes its table (a probe or a test; the security reader must be able to re-run it). Reuse
  `out/v24/r3c2/measure/keys.probe.jsx` where you can.
- (i) INDEPENDENCE: name the code that builds the counterfactual (R3-CURE-3 names `galleryRosterChoices.pglite.test.js ::
  beforeAll`'s `birth` and `keys.probe.jsx :: birth`: `generateSettlementPipeline` with an `onStep` cutting the houses). Show by
  reading it, in the hand-back, that it calls no projection or veil helper (`galleryVeil.js`, `galleryRosterChoices.js`,
  `gallerySecondHomes.js`, `pageRederive.js`, 212).
- (ii) SHOWN ABLE TO FAIL: in a SCRATCH copy (never committed), switch the re-derivation of `safety.criminalInstitutions`
  and the covert service off in both engines; the gate must go RED on the five towns that read HIGHER at the first cure
  (city-none-0-37, city-wartime-0-49, city-none-0-31, town-indebted-0-16, town-wartime-0-19). Save that red.
- (iii) THE CONTROL, REPORTED NOT GATED: the served distribution of each derived label against the control's (towns with no
  hideable house), as a table INSIDE EACH CRIME-DIAL STRATUM. A gap that does not close inside the strata: STOP and write it
  in the hand-back's first lines (the seat sends it to the chair at once).
- THE LOWER TOWNS: re-derive R3-CURE-3's assignment (`out/v24/r3c3/D1-lower-towns.txt`) at your commit with the instrument:
  per town, the rule that took the field; the counts by rule, of 92.

### 4. criminalVeilSwitch VR34 (b), RE-STATED (the chair's word, 11:12)
The behaviour STANDS: with the switch on and no criminal house hidden, the criminal power's row is served; with a criminal
house hidden, it is withheld (power.entry's reach: it fails toward withholding, and a row whose weight a hidden house raised
must not be served). Re-state `tests/domain/display/criminalVeilSwitch.test.js` VR34 (b) to say exactly that, BOTH arms, with
the cause in the test and the commit (R3-CURE 06e9e64b3: power.entry on master's top-level list). Measured by R3-CURE-3 in
the twin (`out/v24/r3c3/vr34b-measure.json`); read the server too. Re-state nothing else in that file; any other red there:
attribute it, do not touch it.

### 5. THE OWNER'S COUNTS (with their denominators; files beside them)
(a) power.entry's REACH: of how many born pages, how many lose a criminal power's row that no hidden house raised. (b) VR42
met by how many born towns. (c) The LOWER towns by rule, of 92. Plain numbers; the seat writes them for the owner.

## GREEN, AT YOUR LAST COMMIT (each with its output file; the seat re-runs each)
R3's born test whole (`tests/security/galleryRosterChoices.pglite.test.js`, every arm, the husk arm included);
`galleryServerVeil.pglite.test.js` whole with the leak check and the tooth; `galleryVeilHandRows`; the six veil guards;
R2's born test; VR17's signal copies; V10-2's three files; `criminalVeilSwitch` (green whole after unit 4); `publicSafe`;
`tests/lint/rosterChoicePools.walker.test.js`; `node scripts/veil/rosterChoiceRegistry.mjs --check` and
`tests/lint/rosterChoiceRegistry.walker.test.js`; the two harnesses; THE ACCEPTANCE RUN (`cd /var/tmp/v18 &&
PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v18/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh
/home/user/wt/r3c4 <outdir>`: EXIT 0); the typechecks (domain:strict and the ratchet); eslint on every touched file; THE COST
LAW (`out/v24/r3c2/measure/cost.sh` / `big-cost.mjs` and the v8245 rows, against 211 on chains you build here; the
Reveal-DM gallery read of the largest born town within twice 211's Reveal-OFF read). 212's and its rollback's sha256; 211's
two proved unchanged; a helper 212 adds that only the definer reads call, revoked by name (VR27).
KNOWN REDS, NOT YOURS (report unchanged, touch nothing): `observedShapeReaders.walker`, `phoneChromeFloor.census`,
`presumedThings.walker`, `presumptionClasses.walker`, `writerReach.walker`.
Pglite with `--maxWorkers=1`, at most four pglite files a run; every test under `env -u GIT_DIR -u GIT_WORK_TREE -u
GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE`; a gate's exit read by `sh
scripts/gate-tail.sh <command>`, never through a pipe; never the whole suite; commits with the hooks, never `--no-verify`.

## Your hand-back
`docs/chair/2026-11-20/veil/out/v25/r3c4/R3C4-HANDBACK.md`: FIRST LINES: any STOP (a control gap that does not close; a husk
class you could not cure; a red that is not R3's). Then each unit with its red and green files, the counts, CONFIRMED vs
PLAUSIBLE. Last line: your commits' hashes, the files they touch, and 212's sha256.
