# GOLDEN-REHEARSAL — the people car's golden door, rehearsed on lane 1 alone (2026-11-07)

> Measure-only. The seat: GOLDEN-REHEARSAL (Opus 5.5) under the cloud chair (Fable 5.1, session
> `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's delegation of 2026-11-06. Branch
> `lane/golden-rehearsal-2026-11-07`, cut at lane 1's tip `8fa9de5b8`. Nothing here touches a golden
> fixture, `docs/shift-records/` or a register on the branch. Every stage, door run and ritual run happened
> in scratch worktrees. The only commits made were the stage tool's own scratch commits there. Every figure
> below was produced by running a command. The outputs are in [`golden-rehearsal/`](golden-rehearsal/).

## 0. Findings first

1. **The car's base is already red on the 525, on the fence and on the prose manifest, before lane 1.** At
   `262e8b255` the generator produces `6b0d226e…`, not the committed `06050f53…`. All 525 rows differ. The fence
   corpus is `f1aa52d8…` against the constant `726ef86a…` (360 of 360). The prose manifest moves 8 of 1,050 rows
   (town 8). Two upstream merges did this (`golden-rehearsal/integration-base-red.txt`):
   - `5b444331a` merged `lane/review-intake-2026-11-06` (`63a7cd852`). That lane's own tip was already red,
     525 of 525 against its fixture, and was never re-recorded: `e7e8a6ff` → `b1be65e4`.
   - `fc834a6bd` merged W0 (`eb4c508e1`). W0 is green at its own tip (`06050f53`), but on top of the
     review-intake change the merge produces `6b0d226e`.

   M-3 says the goldens are red "from lane 1 on". In fact the red starts on the integration branch, at the base
   itself. **The forward stack cannot start at lane 1's base if each record is to carry one cause.** Either the
   landing signs the integration's two upstream causes first, or lane 1's record absorbs them. The second option
   breaks OPERATING_STANDARD rule 7 (one cause per signed shift). The chair has to choose; §5 assumes the first.
   The herald desk and the PDF snapshot are green at the base. Their moves belong to lane 1 alone.
2. **The stage tool builds the forward chain without a stop.** `landing-stage.sh build` built 11 forward stages
   over lane 1's first-parent chain (base plus 10 steps). It carried 0 door paths at every stage, because no
   lane-1 step touched one. Its `measure` command reads only 3 of the 5 moved surfaces, so the rest were measured
   by hand. The proposed fix is in `golden-rehearsal/landing-stage.proposed.diff` (not applied).
3. **The door works end to end at lane 1's tip.** In a scratch stage at `8fa9de5b8`, all 5 acts went through
   `landing-act.mjs run` and the signed door accepted them. The figures it printed match the pre-measurement
   exactly. The 7 refusal arms each fired with their own code. After the write, 3 pins in the suites and 1 digest
   pin elsewhere stay red. The landing has to restate them by hand (§3).
4. **The Register VII v2 ritual cannot run at lane 1's tip.** It refuses with `POPULATION_GREW` before it reads
   the record: `castPowers.js` added 1 bare decimal and 1 unregistered named constant (each 0 → 1), with no
   DECLARED_GROWTH row. The plain tuning walker is red at `8fa9de5b8` for the same reason. At the base, the v2
   record is accepted: version 2, 8 ids, digests equal to v1. After that, the walker's receipt is red on 3 pins
   that say "version 1". The ritual also accepts `ownerWords: "1"`, which the golden door refuses (§4).
5. **Lane 1 has reds of its own outside the golden door.** `tests/domain/worldFactRederive.test.js` A4 lists
   `src/generators/people/castPowers.js` and `representatives.js` as unlisted culture readers. The tuning
   walker's 4 inventory arms are also red. Neither is a golden. Both are lane 1's to cure under M-3. A7 (the
   digest pin) was already red at the base.

## 1. Rows moved per fixture, per forward stage

Each cell counts the rows that differ between one stage's produced bytes and the previous stage's
(`stage-digests.json`). The "base → tip" column compares 262e8b255 with 8fa9de5b8. The steps are listed in their
first-parent order. The brief listed them as 1 → 1b → 1c → 2 → 3 → 4d → 4e, but the chain actually runs
1, 2, 3, 1b, 4a, 4b, 4c, 1c, 4d, 4e.

| fixture | fixture → base | base → tip | 1 | 2 | 3 | 1b | 4a | 4b | 4c | 1c | 4d | 4e |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| generator master (525) | 525 | 525 | 0 | 525 | 525 | 412 | 525 | 0 | 0 | 525 | 0 | 0 |
| espionage fence (360) | 360 | 360 | 0 | 360 | 360 | 290 | 360 | 0 | 0 | 360 | 0 | 0 |
| herald desk (435 keys) | 0 | 435 → 479 keys (+222 −178, 2 moved) | 0 | +205 −164 | +79 −71 | +45 −70 | +151 −152 | 0 | 0 | +95 −74 | 0 | 0 |
| prose manifest (1,050) | 8 | 940 | 0 | 950 | 570 | 484 | 0 | 0 | 0 | 230 | 0 | 0 |
| PDF view-model snapshot | 0 | `headcounts.npcs` 10 → 36 | 0 | 1 line | 1 line | 1 line | 0 | 0 | 0 | 1 line | 0 | 0 |
| preset lighting witness | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| dormancy goldens hashing a roster (every registered `*Dormancy*` / ladder / ledger / growth / credibility suite) | 0 | 0 (all green at 8fa9de5b8, both plainly and at the DRY stage: 50 of 52 registered files pass, and the 2 that fail are the herald and prose pins in §3) | — | — | — | — | — | — | — | — | — | — |

Five steps move the goldens: 2, 3, 1b, 4a and 1c. The other five (1, 4b, 4c, 4d, 4e) are dark. Per-step records
would mean **5** signed records for the lane. M-1 says one record per lane-cause, which is **1** record, written
from one stage at the lane tip. The dry run below is that one record.

## 2. The forward stages

`sh scripts/audit/landing-stage.sh build <step> <scratch>/stages/Snn` ran for each of the 11 trees. The carry was
`8fa9de5b8`, and every stage carried 0 door paths, so each stage tree is its step tree.

| stage | step | stage commit | stage tree | gm bytes sha | fence corpus |
|---|---|---|---|---|---|
| S00 | base `262e8b255` | `6a1ac8599` | `9c5a27ee4` | `6b0d226e…` (produced) | `f1aa52d8…` |
| S01 | 1 `d03bf6d24` | `6a2da534a` | `0c38e5aff` | `6b0d226e…` | `f1aa52d8…` |
| S02 | 2 `69eef4fe9` | `fc89656f5` | `f9b1a3521` | `11498042…` | `1f9ea126…` |
| S03 | 3 `ac1a23085` | `e78967002` | `dab7aaa2c` | `51d36bc8…` | `ba183786…` |
| S04 | 1b `d5983d353` | `c1841aadd` | `e0420a2b5` | `9739cdcf…` | `354cf081…` |
| S05 | 4a `8d45d8308` | `101d01218` | `7ed583ff4` | `d3c97753…` | `dcb63ae2…` |
| S06–S07 | 4b `b1d1fb541`, 4c `a47bd3285` | `09d253763`, `6c29faded` | `4af769b52`, `126e862cd` | `d3c97753…` | `dcb63ae2…` |
| S08 | 1c `8fbe270a1` | `51a7820d1` | `7f3201941` | `d9f0e758…` | `1b03f1f3…` |
| S09–S10 | 4d `1f09ca532`, 4e `8fa9de5b8` | `16a45be81`, `46b95cb61` | `5ed71c611`, `417d7cb63` | `d9f0e758…` | `1b03f1f3…` |

`stage-digests.json` holds the full digests: the herald, prose, witness and PDF bytes at every stage. **Where the
script stops:** it never stops on a linear chain. Its limits are in `measure`, not `build`:

- It does not read the prose manifest, the witness or the PDF snapshot.
- It compares the gm and herald against the committed fixture rather than the previous stage. That is equivalent
  only when the previous record has already been committed on the branch.

`landing-stage.proposed.diff` adds the missing surfaces and a previous-stage comparison. Its other caveat stands as
written: a step that touches a door path still STOPs the build. Lane 1 has no such step. Later lanes have to be
checked.

## 3. The dry-run record and the door's verdict

**The record.** `golden-rehearsal/dry-run-shift-record.people-1-cast.json` carries one cause: "PEOPLE-1 CAST — one
face per face-bearing house …". `ownerWords` is the charter quote from PEOPLE-RULINGS §0, the row is `§934.105`,
and it names 5 surfaces:

| surface | predictedRows | proofForm |
|---|---|---|
| generator master | 525 | settlement-hash |
| fence | 1 | in-file corpus constant (its bytes are JavaScript, so the door does not count rows) |
| herald | 479 | derived-artefact |
| prose | 2 (the door counts top-level keys: `_provenance` and `rows`) | derived-artefact |
| PDF | 1 (not JSON, so not counted) | derived-artefact |

**The setup.** The stage `DRY` is `8fa9de5b8` with the door paths carried; the stage commit is `6553c98f1`.

**The refusal arms.** They were run through `prose-manifest-cells.mjs --record` (`door-refusal-arms.txt`):

| arm | input | refusal |
|---|---|---|
| A | signature `=1` | NO_SIGNATURE |
| B | missing file | RECORD_UNREADABLE |
| C | `ownerWords` "1" | BLANK_PROVENANCE |
| D | `odqRow` without § | RECORD_MALFORMED |
| E | record without the surface | SURFACE_NOT_IN_RECORD |
| F | a stray file in the tree | DIRTY_TREE |
| G | predicted 3, produced 2 | PREDICTION_MISS |

Each arm left the stage clean.

**The acts.** `node scripts/audit/landing-act.mjs run <config>` recorded all five, each committed in the stage
(`dry-run-door-acts.txt`):

| surface | register sha | rows |
|---|---|---|
| gm | `06050f53` → `d9f0e758` | 525 → 525 |
| fence | `b48e8b18` → `72284f02` | — |
| herald | `3c879080` → `b7e22df6` | 435 → 479 |
| prose | `777e4b4b` → `32988b6b` | 2 → 2 |
| PDF | `b1a92886` → `2a785d50` | — |

`figures` reports gm 525/525, herald 479 keys (+222 −178, 2 moved) and prose 940/1,050, the same as §1. **Verdict:
ACCEPTED for every act.**

**What the receipt says** (`dry-run-receipt.txt`). After the door, `landing-stage.sh suites DRY` shows 50 of 52
files passing (470 of 473 tests). These pins are left for the landing to restate in the same act, by hand:

- `heraldKnowledgeDeskGolden.test.js:105`: the length 435 → 479. `shift-rows.mjs --herald` writes this one.
- `heraldKnowledgeDeskGolden.test.js:156`: the year's misjudgment beats are re-dealt. `[4, 42]` becomes `[4]`.
- `dossierProseManifest.test.js:186`: the DRIFT tally. gm-seed-a goes 372 → 380 cells, gm-seed-b 364 → 372, and
  golden-master-v3 67,754 → 67,146.
- `tests/domain/worldFactRederive.test.js` A7: the gm digest `06050f53…` → `d9f0e758…` and the prose digest
  `777e4b4b…` → `32988b6b…`. A7 was already red at the base for its stride.
- `generatorGoldenMaster.test.js`: the SHIFT RECORD header row, written by `shift-rows.mjs --golden`.
- `scripts/prose-manifest-cells.mjs :: MANIFEST_PROVENANCE`: the provenance sentence, committed ahead of the
  door (landing-act's `provenance` flag).

## 4. Register VII v2, rehearsed

The scratch record is `golden-rehearsal/register-vii-v2.scratch-record.json`: version 2, the eight
`densityBands.js` ids from v1, and `ownerWords` = the charter quote in §0. It was run through
`tests/lint/tuningRegister.walker.test.js` with `TUNING_INVENTORY_REFREEZE`/`_NOTE`/`TUNING_SIGNATURE_RECORD`
(`register-vii-v2-ritual.txt`). Every arm ran in a scratch worktree, and each tree was restored afterwards.

**At lane 1's tip.** With the record inside the tree but uncommitted, the ritual refuses `DIRTY_TREE`. With the
record outside the tree (`../tune-rec/v2.json`, which keeps the tree clean), every variant (v2, "1", v1, v3, a bad
id) is refused `POPULATION_GREW` on `castPowers.js` before the record is read. The plain walker is red, 4 of 75
(the inventory arms). The landing cannot write v2 until lane 1 (or the landing) adds a DECLARED_GROWTH row for
`castPowers.js` or registers the constant.

**At the base S00.**

| variant | result |
|---|---|
| dirty tree | DIRTY_TREE |
| v1 | RECORD_VERSION_MISMATCH |
| v3 | RECORD_VERSION_MISMATCH |
| an id with no row | ID_NOT_IN_RECORD |
| v2 | **ACCEPTED**: "SIGNED at tuning-register v2: 8 ids, §934.105" (the register diff is `register-vii-v2-accepted-at-base.register.diff`) |

After the v2 write, the plain receipt is red on 3 pins: `tuningRegister.walker.test.js:1182`, `:1211` and
`:1322` assert version 1, and the landing re-keys them to 2. `applySigningRecord` was also run purely at the tip:
v2 is accepted, the digests equal v1's (so `densityBands.js` really is byte-identical), and no signed digest moved.

**A soft spot.** The tuning door accepts `ownerWords: "1"`, because `signingRecordMalformations` checks only for
blank text. The golden door refuses it. Only whitespace is refused, as RECORD_MALFORMED. This is reported, not
changed.

**What the rehearsal does not show.** M-5's "the mass rows retired from the dial" has no mechanism in the ritual.
A record signs ids. It cannot retire rows.

## 5. The landing seat's checklist (in order, with the figures to expect)

1. **Decide the upstream causes (finding 1).** Sign the integration's review-intake move (`e7e8a6ff` →
   `b1be65e4`, 525/525) and its W0-merge composition (`b1be65e4` → `6b0d226e`, 525/525). The fence base is
   `726ef86a` → `f1aa52d8` (360/360) and the prose 8/1,050. These are records 0a and 0b, built from stages at
   `5b444331a` and `fc834a6bd`, or whatever the chair rules. Without them, lane 1's record is not one cause.
2. Cure lane 1's own non-golden reds: worldFactRederive A4 (+`castPowers.js`, +`representatives.js`), and the
   tuning inventory (DECLARED_GROWTH for `castPowers.js` 0 → 1 bare decimal and 0 → 1 named constant, or a
   refreeze naming its cause).
3. `git fetch origin && git checkout <landing branch at the stack tip>`. Check that `git status` is clean.
4. Per lane L in stack order, at L's tip:
   1. `sh scripts/audit/landing-stage.sh build <L tip> <scratch>/stage-L`. Expect `carry` = the branch HEAD,
      and no STOP unless a step touched a door path.
   2. `sh scripts/audit/landing-stage.sh measure <scratch>/stage-L <scratch>/m-L [<prev>/fence.tsv]`, plus
      `node scripts/prose-manifest-cells.mjs --out` and `witness-stage.mjs` in the stage (the measure gap in §2).
      For lane 1 expect: gm 525 (`d9f0e758…`), fence 360 (`1b03f1f3…`), herald 479 keys, prose 940, PDF `npcs`
      10 → 36, witness 0, dormancy 0.
   3. Write `docs/shift-records/2026-11-07-people-<n>-<slug>.json` into the stage (§3's form; predictedRows gm 525,
      fence 1, herald 479, prose 2, PDF 1). Write the fence movement block to `<scratch>/fence-block-<n>.txt`
      (the sixty-seventh movement).
   4. Commit `MANIFEST_PROVENANCE`'s sentence ahead of the door (the config's `provenance`).
   5. `node scripts/audit/landing-act.mjs run <config.json>`. Expect 5 RE-RECORDED lines matching §3.
   6. In the stage, by hand:
      - `shift-rows.mjs --golden …` and `--herald …` (herald length 479)
      - the herald misjudgment list `[4]`
      - the prose DRIFT tally (380 / 372 / 358 / 67,146)
      - worldFactRederive A7's two digests
   7. `sh scripts/audit/landing-stage.sh suites <stage>`: expect 52/52 files, plus `worldFactRederive` green.
   8. `node scripts/audit/landing-act.mjs transplant <config.json>`. This makes one branch commit per act, with
      `Owner-Signed: §934.105`. The message text says "RUNG 1"; edit it.
5. After the last lane, run the Register VII v2 ritual at the clean landing tip:
   1. Commit `docs/tuning-signatures/2026-11-07-v2.json`.
   2. Run `TUNING_INVENTORY_REFREEZE='<seat>' TUNING_INVENTORY_NOTE='Register VII v2 (M-5)' TUNING_SIGNATURE_RECORD=docs/tuning-signatures/2026-11-07-v2.json npx vitest run tests/lint/tuningRegister.walker.test.js`.
      Expect REFROZEN, "SIGNED at tuning-register v2: 8 ids, §934.105".
   3. Re-key the walker's version-1 pins (`:1182`, `:1211`, `:1322`) to 2.
   4. Run the plain walker. Expect 75/75.
6. Run `sh scripts/gate-tail.sh npx vitest run tests/lint tests/scripts`, then the one `npm run check:tail`.
   Push.

## 6. Not done, and why

- **Dormancy goldens per intermediate stage.** They were not measured stage by stage, because every one is green
  at the tip and at the DRY stage after the acts. They matter only if per-step records are chosen.
- **The record, the rows and the register on the branch.** None of these were written: the brief is
  measure-only. Every stage, worktree and probe lives in the seat's scratchpad and is not pushed.

`@measured-by` the seat's scratch instruments: `chain.cjs` (stage-to-stage row diffs), `mkshift.cjs`,
`mkv2.cjs`, `door-arms.sh`, `tune-arms.sh`, `pure-sign.mjs`, `digests.cjs`. Their outputs are the files in
`golden-rehearsal/`.
