# RECEIPT — LANE DESK-900-CARS — **COMPLETE FOR THIS DISPATCH** · 5 cars landed · 1 car REFUSED with measurement, built-and-reverted
(opened as a PARTIAL header before the first act, updated after every proof)

Seat: Opus 5 — Fable-unvalidated · Lane: DESK-900-CARS · Chair: Fable 5.1 · 2026-09-05
Dock `$SC/laneDESKINT`, **verified on arrival**: HEAD `8b9031f4c`, porcelain **0**, detached,
`node_modules` present as the dock's own symlink tree (NOT materialised by me; `ls -la node_modules`
= `total 0`). `git rev-list --count 38474a59e..8b9031f4c` = **54**, as briefed.
**No hooks are active in this dock** (`core.hooksPath` unset; the worktree carries no hooks dir and
the repo's `.git/hooks` holds only samples), so no pre-commit re-staging was possible and
`git diff HEAD` was never blind.

## ⚠ BRIEF ERRORS FOUND (three; each reported where it was found)
1. **The seal tags do not exist.** The brief and `DESK-LANDING-PLAN.md` name `train-desk-2026-09-05`
   and six sealed dock tags. `git tag | wc -l` in this dock = **0** (`--git-common-dir` =
   `/Users/cstokes/Desktop/settlement-engine/.git`). Every dock in this program is identified by SHA
   only. Non-blocking; corrected here so a successor does not hunt for a ref.
2. **Car 3's mechanism is refuted by the instrument's own source** — see the REFUSAL below.
3. **Car 6's two figures and both of its mechanisms are refuted by measurement** — see car 6.

## OUTCOME TABLE
| car | outcome | sha |
|---|---|---|
| 1 EXPECTED_VOICE `chance_meeting_exposed` | **LANDED** — cures 2 arms that were RED at this dock's base | `cd1514212` |
| 2 the W-SEAT D10 coupling licence (deploymentReturn → irregularForce, INTERIOR→WAR) | **LANDED** — cures the walker arm that was RED at base | `6b2a8f138` |
| 2b the same licence banks the multi-row bucket it joined | **LANDED** — a FIX for my own car 2, caught by vitest, not by my probe | `574be56b9` |
| 3 the ninth OSR exemption retires (declared 9 → 8) | ⛔ **REFUSED WITH MEASUREMENT.** Built in full, measured, and REVERTED by inverse edit. See STOP 1 | — |
| 4 the roster carries the two-kind figures | **NOTHING OWED — proven.** The chair's conflict resolution is complete and correct; a verification car needs no commit | — |
| 5 `{founder}` re-declared `proper` → `phrase` | **LANDED** — the class corrected against the chair's draft, by measurement | `2f49ef77c` |
| 6 DOCKET item 8 re-scoped (`{good}` / `{chain}`) | **LANDED as a measurement record.** BOTH of the brief's mechanisms refuted; neither wired | `27a9a7557` |

**DOCK TIP: `27a9a75573f911ed2d8c53a001006abd857834e4`** — 5 cars over `8b9031f4c`, porcelain 0,
detached, no rebase, no push, no ref writes.

---
## ⛔ STOP 1 — CAR 3 CANNOT LAND UNDER THE PLAN'S OWN DOOR, AND THE RULING'S MECHANISM IS FALSE

`RULING-OSR-SCHEMA17-DECISIONS.md` §2 orders the ninth exemption retired *"at §900 as a chair roster
car … both in one car"*, and the brief adds *"⛔ Take NO `--write` here (that is register step 3e,
the chair's)"*. Plan step 3e is *"OSR baseline — `--write` shrink-only"*.

**I built the retirement in full** — the entry removed from `EXPLAINED_WRITER_EXEMPTIONS` with a
provenance-bearing RETIRED note, the mechanism kept chartered-with-no-member, and all five dependent
roster arms moved in `observedShapeSentinel.test.js` (identities, mechanisms, writers, gate-0
evidence identities, gate-0 evidence keys) and `observedShapeReaders.walker.test.js` (the two
per-identity maps and the banked-identities note). **It measures correct**: `$SC/desk900/probe-car3.mjs`,
node, EXIT 0, 8/8 PASS — roster 8, identities/mechanisms/writers exact,
`assertExplainedWriterExemptions()` returns the roster, gate-0 evidence 8 with the right keys.

**AND IT CANNOT LAND, because `scripts/check-observed-shape-readers.mjs` IS A DETECTOR SOURCE.**
Executed, not read: `$SC/desk900/probe-osr-drift.mjs` (node, EXIT 0)

```
isDetectorSourcePath(scripts/check-observed-shape-readers.mjs) = true
DETECTOR_INPUT_PATHS = ["tests/fixtures/spatialPackFixtures.js"]      ← the ONLY exemption
drift.detectorSources = ["scripts/check-observed-shape-readers.mjs"]
drift.inputs = []
```
and `$SC/desk900/probe-digest2.mjs` (node, EXIT 0) proves the drift is MINE and nothing else's:
```
BEFORE (HEAD backup substituted): 47f0690763a29c13dd83e760ebf9bccfc2e9a26baabf0c08e413c02f5597304d
recorded detectorDigest         : 47f0690763a29c13dd83e760ebf9bccfc2e9a26baabf0c08e413c02f5597304d   MATCH
AFTER  (with the retirement)    : cdaacb4754b807a6cdb829f7fec0f9989dfac8157b4e2e6644eb96a6c6b2ec44   MISMATCH
```
The gate's own branch on that condition (`check-observed-shape-readers.mjs` ~:2828) says, verbatim:
*"observed-shape DETECTOR SOURCE changed since the schema-17 instrument was governed …; an ordinary
gate/write cannot migrate the instrument. Build and review the governed migration bundle instead."*
— **and on `--write` it THROWS that message rather than printing it.** So plan step 3e cannot absorb
this car: retiring the ninth exemption needs a **governed migration to a new schema rung (18) with a
reviewed migration bundle**, the same machinery OSR-SCHEMA17 used to reach 17. That is a lane, not a
car, and it is a register class this lane may not take.

**⭐ THE SAME REFUTATION APPLIES TO THE RULING'S §3.** *"`_doc` … cure it in the §900 OSR baseline
`--write` (plan step 3e), the ONE further write that step already owes"* — `_doc` is a source
constant inside the same detector source, so that write throws too. OSR-SCHEMA17's F2 was right to
defer it and slightly understated the cost: it is not "a SECOND `--write`", it is a rung.

**REVERTED, and the revert is proved rather than asserted.** Inverse edit from backups taken BEFORE
the plant, then `cmp` on all three files (`cmp OK` ×3), porcelain 0, and the detector digest
re-measured back to `47f0690763…` = the recorded value. The finished work is kept as a patch at
`$SC/desk900/REFUSED-car3-ninth-exemption-retirement.patch` (203 lines) so the rung-18 lane costs
nothing to start. ⛔ **Landing it here would have made `npm run check` unpassable at the composed
tip** — a STOP-class outcome for the whole §900 landing, which is why it is not landed.

---
## CAR 1 — the exposed refusal's voice decision
`chance_meeting_exposed` is minted at `src/domain/worldPulse/envoyChanceMeetingNews.js:674` and
phrased at `settlementRumors.js:458`, but was never classified, so **two arms of
`impactKindWalkers.test.js` were RED at this dock's base**. Measured before acting: the literal mint
scan finds exactly two chance-meeting kinds; `newsVoiceCategory({impactKind:'chance_meeting_exposed'})`
already returns `null` through the set-but-unclassified guard (control: `boom` → `'prosperity'`), so
the row **DECIDES rather than changes**. The comment is §899 car 5's, taken again for the cohort's
second beat. **CONFIRMED** — both arms green at my tip (see PROOF 3's cured list).

## CAR 2 + 2b — the W-SEAT D10 licence
SEAT-78 landed the pair and rightly refused to license it, quoting the walker: *"minting a registry
row declares a coupling's direction, desk, flags and receipt address. That is a chair declaration,
not a walker repair."* The chair authorised it in this brief. **Three judgments, each argued in the
leaf and each vetoable:**

| # | judgment | why |
|---|---|---|
| J1 | wave `WR-6e`, `owningVolume: 'WAR'` — **not** a fourteenth chartered prefix | W-SEAT's own SEAT-4 row took `WR-6c` on this exact reasoning; a new prefix additionally owes `DESIGN_FP_ARCHITECTURE.md` §9 seam row 32, a document act nobody chartered here |
| J2 | `receiptField: 'pulseRecord.autoApplied[ruleId=deployment_return_coup].{…}'` | D10 commits to *"no persisted state of any kind"*, so the factor leaves no trace of its own; a receiptField whose EVERY address is a returned read RAISES the frozen still-unsampled count that `couplingReceiptSample`'s seam SC-9 arm exists to red. `applyWorldPulse` pushes every applied outcome onto its emitted `autoApplied` record (`:1066`; the proposal branch returns first at `:373` and this outcome is `applyMode:'auto'` with no routing to a proposal), so the outcome the factor decides is reviewable by its own `ruleId`. `[ruleId=…]` deliberately, not `[kind=…]`: `couplingDesk.walker`'s `KIND_TOKEN_RE` scans receiptFields for Herald kinds and a `kind=` filter would demand one this row does not mint |
| J3 | counterforce = the same read | the W-MEM precedent two blocks above: the factor is ONE number that already nets `rising` against `loyal` inside `irregularShareFactor`, so there is no second call to name |

**Executed proof** — `$SC/desk900/probe-car2.mjs`, node, **EXIT 0, 13/13 PASS**: the walker's own
licensing join replicated over the live tree returns exactly this row; registry 57 → 58; ids unique;
`COUPLING_ID_SHAPE` matches; closed key set exact; row and flags frozen; the legacy first-row seat for
CPL-6/INTERIOR→WAR unmoved; the address parses to rootKind `pulseRecord`; **no row anywhere parses to
`unknown-root`**; the frozen returned-only list still exactly its same four; no Herald kind in the
receiptField; `deploymentReturn.js` still imports `./irregularForce.js`.

⛔ **AND THE PROBE MISSED SOMETHING VITEST CAUGHT, which is car 2b.** The probe checked
`couplingRowFor` (the first-row seat) and treated that as the pair's whole ordering contract. It is
not: `couplingRowsFor` returns EVERY row on a pair+direction and `couplingRegistry.test.js`'s
'multi-row lookup preserves the legacy first-row result and fails closed' asserts that LIST exactly.
PROOF1 convicted it (vitest prints ACTUAL first: received 5, expected 4, the fifth being my row).
Car 2b banks the fifth entry in the same arm, with the reason recorded in place. **This is the
strongest single argument in this receipt for running the suite rather than the probe.**

## CAR 4 — the roster carries the two-kind figures: NOTHING OWED
`$SC/desk900/probe-car4.mjs`, node, **EXIT 0, 12/12 PASS**. Measured from the LIVE registries and
`heraldRouting.EXACT_SECTION`, against `tests/helpers/kindRegistryRoster.js`'s
`KIND_REGISTRATION_FREEZES`, and against the four literals the base-state capsule parses out of the
walker (read with the capsule's own regexes):

| figure | tree | roster | walker literal |
|---|---|---|---|
| registries | **12** | 12 | `toHaveLength(12)` |
| allRows / registeredKinds | **115** | 115 | `REGISTERED_KIND_COUNT = 115` |
| routedTokens | **381** | 381 | roster-only (nothing parses it) |
| unvoiced | **274** | 274 | `LEGACY_UNVOICED_TOKENS = 274` |
| registered − routed | **8** | 8 | `.toBe(8)` |
| small families | INFORMATION · FAITH · CHANCE_MEETING | same | roster-only |

No duplicate kind (`REGISTERED_KINDS.size` 115 = allRows 115). All three suites the brief names —
`tests/scripts/baseStateCapsule.test.js`, `tests/domain/pantheon.test.js`,
`tests/lint/kindPoolFloors.walker.test.js` — **PASSED under vitest** in PROOF 1 (7 of 9 files passed;
the two failures were elsewhere and both pre-existing).

⚠ **FINDING, not a blocker:** the committed `docs/implementation/BASE_STATE.json` is STALE against
the live tree — `kindPoolFloorsRegisteredKinds` **112** vs live 115, `routedTokens` **378** vs 381,
`kindPoolFloorsRegistries` **10** vs 12. Nothing convicts it: `baseStateCapsule.test.js` compares the
generator's readings against the LIVE homes and compares the committed artifact only for its KEY set
and `consumptionLaw`, never its values. A regeneration is a chair act.

## CAR 5 — `{founder}` re-declared `proper` → `phrase`
The chair's PERMISSION (*"the annex moves"*) is upheld; the chair's MECHANISM (*"the same bare-common
family"*) is **corrected by measurement**. `fillShapeViolation` over all 26 `FOUNDERS_BY_TIER` values
(`$SC/desk900/probe-founder.mjs`, node, EXIT 0):

| declared shape | refused |
|---|---|
| `proper` (as declared until now) | **26 of 26** — `PROPER-FILL-IS-NOT-CAPITALISED` |
| `bare-common` (the ruling's draft) | **18 of 26** — `DETERMINER-IN-FILL` |
| `phrase` (landed) | **0 of 26** |

`phrase` is also the class the sibling on the same record already carries (`{challenge}` ←
`founding.initialChallenge`). ⛔ **The fill stays WITHHELD for a GRAMMAR reason, not a shape one:**
measured, EXACTLY ONE variant in either corpus names `{founder}` (DS-GEN-9 :: founding) and it is
SENTENCE-INITIAL; `fillSlots` capitalises nothing, so a conforming lowercase fill renders *"a miller
who built a mill … put Thornwall here"* (that exact render is in the probe output). **NO variant
needs a NAME**, so the ruling's name-only withholding provision has an empty subject. The two
releases — author a variant naming the slot non-initially, or rule a sentence-initial capitalisation
step for `phrase` fills — are both recorded in the new annex §0c-4 and both are the chair's.

**THE PLANT the brief asks for, with its control:** `fillShapeViolation('phrase','Aldric the Wise')`
= `'COMMON-FILL-IS-CAPITALISED'` — **a proper-noun fill is now refused**; the identical fill was
ACCEPTED (`''`) under the old `proper` declaration, and the real producer value was REFUSED by it.
The declaration's truth value inverted exactly. `$SC/desk900/probe-car5.mjs`, node, **EXIT 0, 9/9 PASS**.

⛔ **NOT DONE, DELIBERATELY: the desk's producer-path fill.** It belongs in `generalStateProse.js`,
which this dispatch fences off ("do not touch their areas — the general/pop/rel desk mounts") because
laneGEN2/GEN3 is replayed onto this dock AFTER this lane reports and `replay-cars.sh` resolves only
`dossierMounts.js`; any other conflict STOPS the chair. **Deliberately deferred — documented, not a
bug to re-find**, and blocked on the sentence-initial ruling in any case.

## CAR 6 — DOCKET item 8 re-scoped: BOTH mechanisms refuted, recorded as annex §0c-5
**`{good}` — the denominator is 248, not 197, and the transform is honest for 240.**
197 is the supply-chain OUTPUTS half alone. The closed vocabulary reaching `{good}` through
`primaryExports` is the UNION of the resource trade-goods labels and the chain outputs:
**80 ∪ 197, overlapping in 29 = 248** — the brief's figure omits 51 labels as reader-facing as the
rest. Against `bare-common`: refused **248/248 as shipped, 0/248 after a per-word lowercase**. The
mechanical predicate is total and is not the whole of honesty: **8 values carry a unit-or-qualifier
parenthetical** the predicate does not ban and a reader should never meet —
`Ale (barrel)` · `Arrows (sheaf)` · `Beer (barrel)` · `Education (basic)` · `Healing waters (bottled)` ·
`Medical care (basic)` · `Spellcasting (greater)` · `Spellcasting (minor)`.
*"the town sends ale (barrel) out"* is not a sentence. **240 of 248 ⇒ the brief's own gate
("if N/N, wire it") is not met ⇒ NOT WIRED.** Two facts make the rest safe when the chair says go,
both measured: **ZERO of the 248 carry an interior capital** (no proper noun is destroyed), and all
**11 casing collisions** are a Title-Case label meeting its own already-lowercase twin
(`Charcoal`/`charcoal`), which the transform MERGES rather than confuses.

**`{chain}` — a HEADING CLASS IS REFUSED BY THE CORPUS'S OWN GRAMMAR: 38 of 38 seams supply a determiner.**
75 distinct producer labels, **75/75 Title-Case, 52/75 carrying an ampersand**. Of the 38 variants
naming the slot, **35** put an article or demonstrative immediately before it (*"The {chain} is
running below what it should"*, *"Nobody talks about the {chain}"*, *"see nothing wrong with this
{chain}"*) and the other **3** a possessive (*"{settlement}'s {chain} produces less…"*). A heading
admitted there renders *"The Raw Materials & Fuel is running below what it should"* — a definite
article in front of a Title-Case category heading, with an ampersand in the reader's sentence. That
is §0c-3's own *"the Highly diversified — multiple major revenue streams"* defect in a smaller hat.
The seams are **not wrong**: they are authored correctly for `bare-common`, whose whole content is
that the SENTENCE supplies the article. **So the shape STAYS `bare-common`** and the cure is a
`CHAIN_NOUN` table on the `COMPLEXITY_NOUN` pattern — **whose words are the chair's**, which is why
this car opens the row and does not fill it. Every variant rendered with a real heading is printed in
`$SC/desk900/probe-chain.mjs`'s output.

⛔ **Also noted:** adding a heading class would have required a FIFTH token in
`SLOT_SHAPES` — a closed set the two annexes, the corpus generator and the projection contract all
share (`byShape` asserts exactly the four present). Widening a shared closed contract for a slot
nobody fills is a cost the measurement above says buys nothing.

---
## EXECUTED PROOFS — every exit captured in-shell, none taken from a task notification
⚠ A task notification reported PROOF 1 as *"exit code 0"* while the captured `PROOF1_EXIT` was **1**.
The recorded hazard, live again today. Every figure below is from a captured exit.

| # | command | exit | result |
|---|---|---|---|
| 1 | `sh scripts/gate-mutex.sh --run -- npx vitest run` over 9 named files | **1** | 2 failed of 126 — one was car 2's own bucket (→ car 2b), one PRE-EXISTING |
| 2 | the same over the 4 coupling suites, after car 2b | **0** | **4 files, 46 tests, 0 failed** |
| 3 | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint tests/domain` (WHOLE, at my tip) | **1** | **12 files / 28 arms failed of 1117 files / 18,552 tests** |
| 4 | the same over the projection contract + the economy and general desk suites | **1** | 2 failed of 109, both PRE-EXISTING |
| 5 | `npm run typecheck:domain:strict` (the REAL script) | **1** | **+2 on `envoyChanceMeetingNews.js`, NOT MINE** — see the findings |
| 6 | `npx eslint` on every JS file touched | **0** | no output |
| 7 | `node scripts/generate-dossier-state-prose.mjs --check` before car 5, after car 5, after car 6 | **0** ×3 | 68 state blocks / 2266 variants / 6 desks; 78 causal families / 468 variants — the annex edits stale no corpus leaf |
| 8 | `node scripts/implementation-packets.mjs validate` | **0** | 182 packets |

### ⭐ ATTRIBUTION, EXECUTED — the tip against the dock's own base
The chair's whole-suite run at **`8b9031f4c`** (`$SC/whole-900a.log`, 26 files / 49 tests failed) is
the base. Restricting both to `tests/lint` + `tests/domain` and diffing the FAIL lines:

- **ARMS RED AT MY TIP BUT NOT AT BASE: _none_.** (`comm -13` = empty.)
- **ARMS RED AT BASE AND GREEN AT MY TIP: three**, all cured by this lane —
  `impactKindWalkers :: every minted impactKind is classified in EXPECTED_VOICE`,
  `impactKindWalkers :: newsVoiceCategory returns each minted kind's expected category` (car 1), and
  `couplingInclusion.walker :: a NEW cross-layer import is either licensed by a registry row or REDS` (car 2).
- **31 → 28 failing arms.** The 12 files still red are the same 12 that were red at base; the two
  files this lane cured left the list entirely.
- PROOF 4's two reds are likewise base reds: `dossierStateProseProjection.contract :: holds every desk
  fill table…` (`defenseStateProse.js exports the string map DEF6_FACT_SPOKEN_AT / DEF10_FACT_SPOKEN_AT
  and SLOT_FILL_TABLES does not name it` — a DEF2 landing bill) and `economyStateProseDesk :: DS-ECO-3
  holds the three canonical variants…`.
- `tests/lint/` was run WHOLE as part of PROOF 3; **no scanner-family arm is red that was not red at
  base**, and this lane adds no file under `src/` or `tests/`, which is the condition that bill keys on.

### THE HAND-FROZEN ROSTER SWEEP the brief requires (grepped, every hit resolved)
| roster | keyed on | verdict |
|---|---|---|
| `COUPLING_REGISTRY.length` — 4 sites | a count | **all `toBeGreaterThan(0)` floors; no frozen count exists.** 57 → 58 moves nothing |
| `couplingRowsFor('CPL-6','INTERIOR→WAR')` list | the bucket | **MOVED — banked in car 2b**, with attribution |
| `couplingRowFor('CPL-6','INTERIOR→WAR')` | the first-row seat | **provably unmoved** (probe + the arm's own next line) |
| `COUPLING_REGISTRY_FILES` (`blastRadiusUnion.test.js` `.toBe(7)`) | registry LEAF files | unmoved — I added no leaf |
| `WR-6c` / `WR-6d` / `WR-6e` | owningWave | `WR-6e` appears **only** in my own edits; no sibling roster enumerates waves |
| `chance_meeting_exposed` rosters — `chanceMeetingKindPools.walker`, `kindRegistryRoster` (115/381), `pantheon` A5 | the KIND | none is keyed on `EXPECTED_VOICE`; all green in PROOF 3, and car 4 proves the 115/381 set consistent |
| `.prose-numerics-baseline.json` | path+line | **zero rows** address any of the five files I touched — no relocation |
| `.news-voice-baseline.json` | the corpus | not keyed on `EXPECTED_VOICE` (grep `chance_meeting` = 0; totals all 0) |
| `.coupling-inclusion-baseline.json` | unlicensed pairs | unmoved — a licensed pair needs no entry, which is the walker's own rule; `REACH_OWED_ROWS` never held this pair |

## REGISTER DELTAS — I TOOK NONE; these are the predictions the chair verifies
| register | predicted delta | why |
|---|---|---|
| mounts baseline `.dossier-mounts-baseline.json` | **0** | no mount row added, no id struck |
| prose-numerics | **0** | measured: no frozen row is addressed to any file I touched |
| **lighting census** (`files` 2523 / `credited` 2152 / `titles` 23204 / `suiteTitles` 6217) | **0 / 0 / 0 / 0** | **NO new test file and NO new test title.** Every assertion I added lands inside an EXISTING `it()`/`test()` — the PANTHEON-ROSTER precedent, applied deliberately |
| test-ratchet totals | `totalFiles` **0**, `totalTests` **0** | same reason |
| writer-reach | **0** | no new read; `writerReach.walker` is red at base and stays red, unchanged |
| OSR baseline + detector digest | **0** | car 3 reverted; digest re-measured **back to the recorded `47f0690763…`** |
| tuning inventory / register | **0** | no tuning table, no tuning value |
| coupling-inclusion baseline | **0** | see the sweep above |

## FINDINGS FOR THE CHAIR (each needs one line back)
1. ⛔⛔ **`typecheck:domain:strict` is RED at the composed tip and it is ENC-4b/ENC-4c's bill, not
   mine.** `src/domain/worldPulse/envoyChanceMeetingNews.js`: **2 strict errors, baseline 0, +2** —
   both `TS7053` at `:505,24` and `:655,24`: `CHANCE_MEETING_PRESENTATION[row.significance]` indexes a
   table declaring only `notable` and `major` with a value typed
   `'routine' | 'major' | 'notable' | 'n/a'`. Last touched by `c42740969` (ENC-4c car 2). Fail-closed
   at runtime (`if (!presentation) return null`), so it is a TYPE hole, not a behaviour bug — **but it
   blocks `npm run check` at step 4 of the landing.**
2. ⛔ **The ninth-exemption retirement needs a rung, not a write** — STOP 1. The ruling's §2 and §3
   mechanisms are both refuted; the patch is ready at `$SC/desk900/REFUSED-car3-ninth-exemption-retirement.patch`.
3. ⚠ **`docs/implementation/BASE_STATE.json` is stale** (112/378/10 vs live 115/381/12) and no
   instrument convicts it — the capsule test compares generator-vs-live-home, and the committed
   artifact only for its key set.
4. ⚠ **`COUPLING_REGISTRY_FILES` (`scripts/soak/blastRadius.mjs`) omits
   `couplingRegistryEncounters.js`** — 7 files listed, 8 leaves exist. Pre-existing since ENC-2, and
   `blastRadiusUnion.test.js` pins `.toBe(7)`, so the roster is green and blind. Not mine to widen (it
   is a soak blast-radius contract).
5. ⚠ **`{good}`'s remaining 8** and **`{chain}`'s `CHAIN_NOUN` map** are two chair word-decisions now
   fully measured and recorded in annex §0c-5; neither is a lane's.
6. ⚠ **`{founder}`'s sentence-initial problem** (annex §0c-4) is a chair choice between authoring one
   variant and ruling a kernel-wide capitalisation step for `phrase`.

## FENCES HONOURED
No register act of any kind. No `--write`, `--update`, `--genesis`, `--rebank`, no `*_REFREEZE` /
`UPDATE_*` env var. No `npm run check`, no `npm run build`. No subagents. No `npm install`, no
materialised `node_modules` (`ls -la node_modules` = `total 0`, symlinks intact). No `git stash`, no
`git checkout --`, no `git show HEAD:<path> > <path>`, no rebase, no push, no ref writes, no
`--amend` (car 2b is a NEW car, which is why the trailer survives). Explicit staging only, verified
with `git diff --cached --name-only` before every commit. Every vitest run through
`sh scripts/gate-mutex.sh --run --`, never during the chair's gate — the quiet-window probe
(`$SC/desk900/quiet.log`) recorded the chair's 7-worker exclusive run from 11:06 and this lane built
without vitest throughout it, dispatching only after it drained. ⛔ **I did not touch the three
pending docks' areas**: no `generalStateProse.js`, no `dossierMounts.js`, no pop/rel desk, no
timeband pool, no `scripts/check-test-ratchet.mjs`.

## SCRATCH ARTEFACTS (all under `$SC/desk900`, none in the tree)
`probe-car2.mjs` · `probe-car3.mjs` · `probe-car4.mjs` · `probe-car5.mjs` · `probe-founder.mjs` ·
`probe-good.mjs` · `probe-good2.mjs` · `probe-chain.mjs` · `probe-digest.mjs` · `probe-digest2.mjs` ·
`probe-osr-drift.mjs` · `quietprobe.sh` + `quiet.log` · `proof1.log` … `proof4.log` · `tcstrict.log` ·
`packets.log` · `gen-prose-check-{base,car5,car6}.log` · `base-arms.txt` / `tip-arms.txt` (the
attribution diff) · `msg-car*.txt` · `*.pre-car*.bak` (pre-edit backups) ·
`REFUSED-car3-ninth-exemption-retirement.patch`.

---
## ⭐ RETROVALIDATION ROW (for the Fable 5.1 chair)
| # | what was judged | what the chair must re-derive | receipts by path | priority |
|---|---|---|---|---|
| R1 | **Car 3 is REFUSED: retiring the ninth exemption needs schema rung 18, not step 3e's `--write`** | that `isDetectorSourcePath('scripts/check-observed-shape-readers.mjs')` is `true`, that `provenanceDriftOf` therefore returns it in `detectorSources`, and that the gate's branch THROWS on `--write` — and that the ruling's §3 `_doc` cure carries the same defect | `$SC/desk900/probe-osr-drift.mjs`, `probe-digest2.mjs`; `check-observed-shape-readers.mjs` `:190` / `:2485` / `:2828`; the patch | ⭐⭐⭐ **HIGHEST — it changes a ruling and a plan step** |
| R2 | **`typecheck:domain:strict` is red at the composed tip on ENC-4c's file** | the two `TS7053` at `envoyChanceMeetingNews.js:505,24` and `:655,24`, and whether the cure is widening `CHANCE_MEETING_PRESENTATION` or narrowing the `significance` type | `$SC/desk900/tcstrict.log`; `npx tsc --noEmit -p tsconfig.domain-strict.json` | ⭐⭐⭐ **HIGHEST — it blocks the landing gate** |
| R3 | **The D10 licence's three judgments (J1 wave, J2 receipt address, J3 counterforce)** | that `WR-6e` under `owningVolume: 'WAR'` is right against a fourteenth prefix, that `pulseRecord.autoApplied[ruleId=deployment_return_coup]` is the honest receipt for a car that persists nothing, and that the same-read counterforce is the W-MEM precedent and not a dodge | `couplingRegistryWar.js` (argued in place); `$SC/desk900/probe-car2.mjs`; `receipt-seat-78.md` R3/R4 | ⭐⭐ HIGH — it is a live registry row |
| R4 | **`{founder}` is `phrase`, not the ruling's bare-common family** | the 26/26 · 18/26 · 0/26 measurement, and that `{challenge}` on the same record is already `phrase` | `$SC/desk900/probe-founder.mjs`; annex §0c-4 | ⭐⭐ HIGH — it amends a ruling's mechanism |
| R5 | **`{founder}`'s fill stays withheld for a SENTENCE-INITIAL reason** and the release is the chair's | that exactly one variant names the slot, that it is sentence-initial, and that `fillSlots` capitalises nothing | `$SC/desk900/probe-car5.mjs`; `stateProseKernel.js:280`; annex §0c-4 | ⭐⭐ HIGH — an owner row sits behind it (the founder-name producer) |
| R6 | **`{good}`'s denominator is 248 and the honest total is 240** | the 80 ∪ 197 (overlap 29) union, and that the 8 parentheticals are the exceptions | `$SC/desk900/probe-good.mjs` / `probe-good2.mjs`; annex §0c-5 | ⭐⭐ HIGH — it decides whether item 8 is wireable |
| R7 | **`{chain}` cannot take a heading; the cure is a `CHAIN_NOUN` table whose words are the chair's** | the 38/38 determiner count (35 article/demonstrative + 3 possessive) and the 52-of-75 ampersand figure | `$SC/desk900/probe-chain.mjs`; annex §0c-5 | ⭐⭐ HIGH — it refuses a chartered mechanism |
| R8 | **Car 2b exists because a node probe cannot stand in for the suite** | that `couplingRowsFor` and `couplingRowFor` are different properties and only the suite checked both | `$SC/desk900/proof1.log` vs `probe-car2.mjs` | ⭐ MEDIUM — a method row for the program |
| R9 | **The register deltas are all ZERO, including the lighting census** | that no new test FILE and no new test TITLE landed — every assertion rode an existing `it()` | this lane's five diffs; `git diff --stat 8b9031f4c..HEAD` | ⭐⭐ HIGH — the chair's step 3f prediction depends on it |
| R10 | **`BASE_STATE.json` is stale and `COUPLING_REGISTRY_FILES` is blind** | the 112/378/10 vs 115/381/12 gap, and the missing ENCOUNTERS leaf against `.toBe(7)` | findings 3 and 4 above | ⭐ MEDIUM |

## DOCK TIP
**`27a9a75573f911ed2d8c53a001006abd857834e4`** — 5 cars over `8b9031f4c`, porcelain 0, detached,
no rebase, no push, no ref writes.
