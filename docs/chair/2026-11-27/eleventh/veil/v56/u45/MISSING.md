# U45: WHAT WAS LOST, WHAT SURVIVES, WHAT I REBUILD (seat U45 of VEIL-56; written before any build)

Hour from `date -u`: 2026-11-27T23:32Z. Seat stands on `lane/veil-56-2026-11-27-tip` = dbd4cd9e5. Code branch (to be cut):
`lane/veil-56-2026-11-27-u45-wip` at dbd4cd9e5. This file: `lane/veil-56-2026-11-27-u45-docs`.
CONFIRMED = executed by me in this container; PLAUSIBLE = read only.

## 0. THE THREE SURVIVORS (CONFIRMED by `git merge-base` / `git merge-tree` on this box)
| commit | branch | base | holds |
|---|---|---|---|
| aa54a6791 | lane/veil-40-2026-11-23-r5desc-wip | 23bb8b8ae (PIN-2; NOT the tip's ancestor; 15 commits above it) | R5-DESC whole as VEIL-36/37/40 built it: the table `scripts/veil/standingForms.{data,ids}.json`, its door `standingForms.mjs` (+proof), the cut in 212 (header item numbered (36)) and the twin (`galleryWithholdAlways.js :: standingBase`, STANDING_ROWS), the (36)(e) belt (`galleryRosterChoices.js :: withheldPowerNamer`, the last loop of `withholdPowerCopies`), reader S (`pageRederive.js :: rederiveStanding`, wired at both doors), `galleryVeilDesc.pglite` (958 lines), `standingReaders.walker`, `governmentLabelFromKindTable.walker`, three manifest rows |
| 0ff0773c7 | lane/veil-51-2026-11-24-descarm-wip | d7764e67a (the tip's 2nd parent; 1 commit) | DESCARM: `tests/security/galleryVeilDescNames.pglite.test.js` + 1 manifest row. RED BY DESIGN until the cut |
| 7010a0004 | lane/veil-51-2026-11-24-walker-wip | aa54a6791 (2 commits) | STANDWALK: `tests/lint/standingFormsTotality.walker.test.js` (totality, master pinned, census under STANDWALK_POOLS, tie rule), fixture `tests/fixtures/standingForms.master-db832c892.json`. Merging it brings aa54a6791 with it |

Trial `git merge-tree dbd4cd9e5 aa54a6791` (and 7010a0004): THREE conflicts, exactly VEIL-51's plan M1-M3:
`src/domain/display/galleryRosterChoices.js`, `tests/lint/rosterChoiceComposedHosts.walker.test.js`,
`tests/security/galleryWithholdAlways.pglite.test.js`; 212, the registry, rulings.json, the manifest auto-merge. CONFIRMED.

## 1. THE LOST STEPS, AGAINST VEIL-51's SECTION 0 (in its order)
Sizes are my estimate from VEIL-51's section 1 (PLAUSIBLE): S = under ~40 changed lines, M = ~40-200, L = over 200 or SQL+twin+tests.
| # | lost commit | step | in the survivors | to rebuild | size | proof that survives as an instrument (v51/ on `origin/lane/veil-51-2026-11-24`) |
|---|---|---|---|---|---|---|
| 1 | 56727861a | merge M (aa54a6791 -> tip): M1 take R5D's `withheldPowerNamer`, port R4-IDS's boolean-id filter into its `wIds`; M2 union of the two import blocks | all the code | the merge's 3 resolutions | S | `u4/mproof.sh` (3 pglite slices + domain-strict); expected galleryWithholdAlways 9/9, galleryRosterChoices 39/39, galleryVeilDesc 16/17 (the inherited "107 (3)") |
| 2 | 2944a4db5 | M3: composed census re-pinned: COMPOSED_IDS = [FIRST, 'power.relation.dmNote'], R5D's 23-prose pin dropped | none | one walker file | S | the walker itself (10/10) |
| 3 | 89e7d2d2c | M4: 212 header item (36) -> (38), after STORED-PROSE's (37); comments only | none | 212 comments | S | 212 apply/down/reapply; `rosterChoiceRegistry.mjs --check`, `standingForms.mjs --check` |
| 4 | e8cfe56a0 | DESCARM merged (manifest: union of R5D's 3 rows + DESCARM's 1) | 0ff0773c7 whole | the merge | S | DESCARM red before the cut, 2/2 green after N1-N3 (`u4/n5.sh`) |
| 5 | 04cfe6d85 | STANDWALK merged (plain) | 7010a0004 whole | the merge | S | the walker |
| 6 | 5b39bd019 | N1: reader S narrowed to the cut alone (`rederiveStanding` keeps name, export and both calls; writes nothing; `standingBase(desc)`; the import's authoritative drop kept); standingReaders walker re-pinned (writer-call arm inverted) | S as wired (the thing N1 narrows) | pageRederive.js + the walker | M | walker red first 2 of 5 on the un-narrowed reader, then 5/5; domain-strict rc 0 (R5D's TS2345 goes with the writer call) |
| 7 | 9c03baa71 | N2: twin compiles `(?:^\| )(re)$` (forced end, 212's reading); STANDWALK arm pinning every row ends `$`, no top-level `\|`, no leading space; twin comment re-cut. 212 NOT edited. VETOABLE | the tie rule in 7010a0004 | twin line + one walker arm | S | the arm red first on the un-forced twin |
| 8 | bcf26ccbd | N2b: `standingForms.mjs` LABEL_RE's bracket takes a lower-case head; SAMPLE_LABELS + 'Merchant Guilds (dominant)'; `--write` regenerates the table; 212's STANDING_FORMS block and the twin literal replaced by `--print` (never by hand); STANDWALK census gains LEFTOVER; fixture `reDerived` | the door and the old table | generated table + 212 literal + twin literal + census arm | M (generated: large diff, small hand) | `u4/leftover.mjs`, `u4/n2b-measures-{old,new2}.txt` (master UNCUT 4 -> 0), literal sha256 04838347... (24,112 chars) to re-match |
| 9 | a5e77c820 | N3: R5D's "(36)" citations -> (38); the belt's measured reach stated (212 (38)(e), twin) | none | comments/strings | S | 212 apply/down |
| 10 | 802578955 | item 5: registry row power.desc page 'not drawn', scope V15, the loss (423/743 today, 591/752 master); two walkers re-pinned | none | registry row + registry.json + 2 walker pins | S | walkers 19+1 skipped |
| 11 | 483d95861 | V27 (1) THE STORED BELT: 5-argument `_gallery_veil` (no default on `stored`; 3/4-arg forms wrap with null), 3-argument `_gallery_veil_roster_choices`, the belt BEFORE `if not whole`; the three 212 doors pass the stored row; twin `applyRosterChoices(s, pub, idOf, stored)` before `if (!whole) return;`, `projectShareVeil(..., { stored })`; rollback drops both new forms | none | 212 SQL + twin + rollback | L | `u4/v27twin.mjs`, `u4/probe.sql` (the 107 (3) record: served without, withheld with the stored row) |
| 12 | 2376572f3 | term (a)'s WALKER: every live function calling `_gallery_veil` is a registered door passing 5 arguments; red by design only on 211's `get_gallery_map` | none | one new walker | M | the walker itself (red on the map door) |
| 13 | 04711aa1b | UNIT 5 U1, the twin's person rule (`withholdPersonStrings`, stored set + mask, every copy by id, before the house gate) | none | twin | M | `u5/u5twin.mjs`, `u5/plant5.mjs`, `u5/losesnothing.mjs` (0 of 422 / 0 of 416) |
| 14 | 91605fd9c | V27 (5) THE WRITER-ORACLE CENSUS (master's writer from a db832c892 tree, `STANDWALK_MASTER_TREE`) | the census of 7010a0004 (pattern oracle) | census arm | M | `u4/v27oracle.sh`, `u4/oracle-{old,new}.txt` (red first master 3 on the pre-N2b table; 0/754, 0/765) |
| 15 | 8697f4eff | UNIT 5 U2 (212's person rule, `_gallery_veil_person_named`) + U3 (three registry rows, registry.json) + TERM (b) as corrected (stored = [live row, served source]; `_gallery_veil_stored_docs` / `storedDocs`; gallery and import `jsonb_build_array(base.j, src.j)`, link `base.j`) | none | 212 SQL + registry + twin | L | `u5/u5.sh`, `u5/paths.mjs` (paths-*.txt), probes named in section 1 |
| h1 | 50e0bd13b (n4-wip) | N4: galleryVeilDesc's page arms re-cut to V15; V25's three standing arms | the file before re-cut | test file | M | `u4/N4-BRIEF.md`; arm 1 was RED (60 reads: the mask gap) |
| h2 | 54b4fced3 (arms-wip) | THE ARMS (A-E): written, NEVER RUN | none | new pglite file + catalogue rows + manifest row | L | `u4/ARMS-BRIEF.md` |
| - | (never built) | the mask cure (N4's cause (b)); A5's field at the head of the cut; A16 | - | - | - | `u4/v25measure.mjs`, `v25all.mjs`, `v27measure.mjs` |

Survives only as a document: VEIL-51's design of every step (section 1), its tables (`u4/*.txt`, `u5/*.txt`), its
instruments (`.mjs`, `.sh`). None of 1-15 or h1-h2 is on origin in any form. 33 lost commits = 15 above + the 18 of R5-DESC's
own history that aa54a6791 and 7010a0004 still carry (CONFIRMED: `git log` lists them under both survivors).

## 2. A5's THREE COMMITS ON THE BASE: A TRIAL ON A SCRATCH BRANCH (CONFIRMED; `scratch/u45-a5-trial`, local, never pushed)
`git worktree add -b scratch/u45-a5-trial /home/user/wt/a5trial dbd4cd9e5`, then cherry-pick 9cbf5cf16, 7e1c465b5, 6de78192c.
The base is 1,669 commits behind A5's base (merge-base 8f3b8bf4b). RESULT: TWO OF THREE CONFLICT, ALL BY ABSENCE.
- 9cbf5cf16: CONFLICT in `factionStanding.js` and `rosterText.js`. The base has NO `settleSeatHolderToRecord` (nor
  `RANK_STANDINGS`, `cutLine`) and NO `settleStandingToLegitimacy`: A5's hunks for those two settlers have nothing to land on.
  `annotateFactionStanding`'s line, `settleStandingToRoster`'s, `rivalDescOf` (applyDensityLaw.js) and the rename surface
  (factionRename.js) apply cleanly. Resolved on the scratch by dropping the two absent settlers' hunks (the base's side).
- 7e1c465b5: clean.
- 6de78192c: CONFLICT modify/delete: `tests/generators/seat/seatHolderLines.test.js` does not exist on the base; resolved by
  leaving it deleted.
- On the scratch tip 2e4766ca2: `standingStoredAsField.test.js` + `factionRename.test.js` 37/37 rc 0 (through the mutex).
SO: A5 on this base is A5 MINUS TWO SETTLERS. The base's writer is not the join's writer: the field my cut reads will be
written at the join by four settlers the base never runs. The scratch tree is good for births with the base's settlers only.
Births on it are the brief's "if your trial cherry-pick applied" case, which it did only with a resolution: YOURS TO RULE
whether those births count (my lean: yes, as the base's proof, with the join's births owed at the join).

## 3. THE ORDER I PROPOSE (the brief's, unchanged)
1 merge M (M1-M4), DESCARM, STANDWALK; 2 N1; 3 N2; 4 N2b; 5 N3; 6 item 5; 7 V27 (1); 8 term (a)'s walker; 9 V27 (5);
10 term (b) corrected (it rides with V27 (1)'s forms); 11 N4's arms (V25's three) and the mask proposal (TO YOU FIRST);
12 A5's cut; 13 unit 5 U1-U3; 14 the ARMS; 15 A16; 16 the proofs and the hand-in. Each its own commit, red first, pushed.
THE MACHINE: PG16 on /var/tmp/rv7 being built by `make-instruments.sh` (v27x211); the two stored pools by dump.sh at d71a3ee44
(today-born from the tip's engine, master-born from db832c892).
