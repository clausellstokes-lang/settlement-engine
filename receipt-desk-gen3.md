# RECEIPT — lane DESK-GEN3 — **COMPLETE**
⟦Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 · Dock: $SC/laneGEN2, arrived detached at a4ce9f80f⟧

Five cars landed on `a4ce9f80f`; porcelain 0; every claim is CONFIRMED (executed evidence quoted)
or PLAUSIBLE (reasoning only).

    f8e18e6f7  car 1  why these workshops — and the blocker was in the wrong place       (DS-GEN-18)
    f2efa0e84  car 2  the remnant, the fallen city and the steadings                     (DS-GEN-8)
    1e21e95cf  car 3  the neighbour network and the direction of the roll                (DS-REL-1, DS-POP-3)
    ff4c73aa8  car 4  a control that convicts the desk for lighting a block              (test-only)
    c48d24ba5  car 5  the fold that hid a sentence, and a ratchet my own read had hidden

**FOUR of my seven blocks are lit. `UNMOUNTED_BLOCKS` falls 30 → 26.** Three are DECLINED with
measurement (DS-GEN-15, DS-POP-1, DS-POP-2), each with the exact ruling it is waiting on.

## Arrival receipts (CONFIRMED)
- `git rev-parse HEAD` = `a4ce9f80fe44b9dccf2eb253d3eb51720d06b49b` — matches the brief.
- `git status --porcelain | wc -l` = `0` on arrival and after every car.
- `node_modules`: 453 top-level symlinks, no real package dirs. Not materialised, untouched.
- Gate at arrival (09:57): load-1 **43.31**, `[v]itest/dist/workers` = **7**. The chair's hold and
  the quiet-window law both refused independently; no vitest ran until RESUME (10:54).
- `git diff --name-status --diff-filter=A a4ce9f80f HEAD` → **no new files of any kind.**

## ⛔ BRIEF ERROR — GEN2's DS-GEN-18 route was measured against the WRONG ANTECEDENTS
The brief hands GEN2's route on as measured: *HOME-FED 24/24 (`activeChains[].resourceActive ===
true`), STALLED 18/24 (a non-stable chain with `resourceActive === false`), BOUGHT-IN 12–18/24,
UNWORKED 13/24*. **Neither of the first two is the annex's antecedent.**
`RECEIPT_POOLS_DOSSIER_STATE.md:6085` reads `STALLED` = *a chain row with a non-empty
`upstreamMissing[]`* and `HOME-FED` = *a chain row whose `resource` appears in `fullyExploited` or
`partiallyExploited`*. Re-derived over 24 towns (6 seeds × 6 configs; `$SC/gen3work/probe18b.mjs`,
`probe18c.mjs`):

| key | brief / GEN2 | ANNEX antecedent, independent | under the annex's ORDER |
|---|---|---|---|
| STALLED | 18/24 | **14/24** | 14/24 |
| HOME-FED | 24/24 | **3/24** | **0/24** |
| BOUGHT-IN | 12–18/24 | 20/24 | 6/24 |
| UNWORKED | 13/24 | 13/24 | 4/24 |
| (silence) | — | — | 0/24 |

⭐ **`resourceActive === true` IS TRUE ON EVERY CHAIN OF EVERY TOWN.** Keying HOME-FED on it would
print "the ground gives it, so the workshop is here" over every settlement in every world — a
default wearing a reading's clothes, the exact shape `dossierMounts.js`'s own general test refuses.
The real reason HOME-FED is dark is a VOCABULARY GAP: the chain rows name their feed `Grazing land`
/ `Iron ore deposits` and the exploitation rows name theirs `livestock` / `wool` / `timber`. They
agree on 3 of 24 towns. **CONFIRMED.**

## ⭐⭐ THE CHAIR'S `{institution}` RULING — PERMISSION CONFIRMED, MECHANISM REFUTED TWICE
The chair ruled: *`{institution}` takes the NAME of one of the town's own `institutions[]` whose
CATEGORY matches the stalled chain's processing category, and NEVER the plural category label; if
none exists, WITHHOLD.* Measured before building (`probe18.mjs`, `probe18e.mjs`, `probe-sing.mjs`;
36–48 generated towns):

| claim | measured | verdict |
|---|---|---|
| STALLED is lightable at all | 25/48 towns carry a stalled chain; **25/25 offer a shape-conforming name** | ⭐ **PERMISSION CONFIRMED — I did NOT stop** |
| route by institution CATEGORY | `institutions[].category` is a FOUR-value coarse enum — `Government · Religious · Economy · Infrastructure`. It cannot identify a processing house | ⛔ **REFUTED** |
| roster resolution cleans the digit label | over 835 pattern→institution pairs, 103 patterns carry a digit and **0 of 103** resolve to a digit-free name: `"Merchant guilds (3-8)"` → `"Merchant guilds (50-100+)"`, which is worse | ⛔ **REFUTED** |
| the digit is the blocker | only **103 of 835** rows carry one; **489 of 558** distinct rows pass `proper` unchanged | ⛔ **OVERSTATED** |
| the live defect | **NUMBER AGREEMENT**, which survives every digit cure: both STALLED seams say "outlived **its** feed" / "the building stands", so `"Glassmakers"` renders a disagreement | ⛔ **the chair's mechanism does not catch it** |

**WHAT WAS BUILT INSTEAD IS THE ANNEX'S OWN RULING** (§DS-GEN-18: the fill is *"a
`processingInstitutions[]` row's own recorded name"*): the first row of the chain's OWN
`processingInstitutions[]` that passes `properFill` **and reads as a singular house** (the head word
is tested; a trailing `ss` and a possessive are not plural markers). No roster join, so no GENERATOR
import into a display leaf — and none is needed: `computeActiveChains.js:297` returns early where no
institution matches, so that list is ALREADY the matched subset. **Measured: 20/25 stalled towns
name a house; on the other five (`City walls and gates`, `Glassmakers`) STALLED is WITHHELD —
silence, never a hole.** CONFIRMED.

## ⛔ FOUR DEFECTS FOUND IN RENDERED OUTPUT, NOT IN REASONING
1. **`{resource}` on STALLED printed a false statement.** Filling from the chain's own `resource`
   rendered *"Furrier's district at Novacolonia outlived its feed; **the hunting grounds stopped
   arriving**"* and *"the iron ore deposits stopped arriving"* — the town's own standing ground
   described as a delivery that failed. The seam names THE FEED THAT FAILED, whose only producer is
   `upstreamMissing[]`, and that field holds **CHAIN IDS** (`warehouse_logistics`,
   `food_processing`, `precious_metals_mining`) — engine tokens the shape contract refuses. The slot
   is not offered on STALLED; the `ledger` variant carries the pool.
2. **`{good}` admitted the engine's parenthetical bookkeeping.** `primaryImports[]` really writes
   `Bulk grain (local fields depleted)`. That is the `{complexity}` defect §0c records — a gloss
   reaching a reader through a slot — in its round-bracket spelling, which the shared dash test does
   not catch. `bareCommonFill` refuses it.
3. ⛔⛔ **A CORPUS SENTENCE BEHIND A FOLD IS A SENTENCE NO READER SEES, AND EVERY WALKER WAS GREEN
   OVER IT.** DS-GEN-18's line was drawn INSIDE `Supply Chains`, which is `collapsible
   defaultOpen={false}`, and `Primitives.jsx:114` renders `{open && <div>{children}</div>}` — a
   collapsed section renders no children at all. The reachability arm saw the literal, the desk drew
   the sentence, the DOM carried nothing on first paint. **This is the citation law one layer past
   the literal, and only the UI test caught it.** The line now sits above the fold as the FRAMING of
   what follows (the DS-HK-1 arrangement), and the arm asserts it renders WITHOUT the section being
   opened, with `not.toContain('Ingots')` proving the fold is still shut.
4. **DS-POP-3 would have been the loudest dead arm in the leaf.** `populationTrendBand` returns
   `{band: 0, window: 0}` for an EMPTY ring and `populationHistory` is 0/48 at generation, so keyed
   on the sign alone `LEVEL` fires on EVERY town in EVERY world. Fewer than two readings is SILENCE.

## THE FIVE MOUNTS
| position | block | rung | tab | why this tab, and what it sits beside |
|---|---|---|---|---|
| `economics.craftReason` | DS-GEN-18 | `sentence` | `economics` | `sectionTarget ["economy","overview"]`, economy first. The reading is about the chain rows and the chain rows render here; the line is the framing ABOVE the fold, and the node graph keeps its own words below |
| `overview.steadings` | DS-GEN-8 | `sentence` | `overview` | drawn inside `SteadingsSection.jsx`, the ONE component that resolves `spatialLedgers.satellites`. Three surfaces kept APART — the remnant banner, the ancient-ruin banner, the steading cards — because they are three places on one section |
| `relationships.network` | DS-REL-1 | `sentence` | `relationships` | `RelationshipsTab.jsx` already assembles the merged link list and the typed engagement rows, so the prose and the cards cannot describe two different sets. ⚠ ONE ROW, TWO ROUTES: `relationships` and `neighbours` are two router cases rendering one component — still ONE position on the page-set, the `power.factionLadder` precedent — and BOTH are asserted to thread the flag |
| `overview.populationDirection` | DS-POP-3 | `sentence` | `overview` | beside the head count in the identity strip, the only place that figure reaches a reader |

## ⛔ THREE BLOCKS DECLINED, each with the ruling it waits on
1. **DS-GEN-15 — a THRESHOLD nobody has authored.** `SCARRED-FRESH` is "a scar carried at high
   severity", `SCARRED-FADING` is "decayed low", `ENCROACHED` is "drift high": three of its five
   pools need a 0..1 cut. A lane may not mint it — a new named constant enters the tuning register
   as unregistered debt and raising that ceiling is the chair's act, which is exactly why DESK-GEN2
   car 3 removed its own `TIMEBAND_YEARS_PER_TICK` — and borrowing `scoreBand`'s 65/40/20 DEFENCE
   ladder would be this desk ruling that a masonry scar reads on a defence scale, a VOCABULARY
   decision. Pinned so the chair's ruling is one line: the two threshold-free keys are `REBUILT` (a
   rebirth row on record) and `WORN-PLAIN` (a present mirror, no scars, no rebirths), and the scar
   vocabulary is CLOSED at eight (`burn_lots`, `plague_quarter`, `flood_line`, `rubble_field`,
   `calamity_scar`, `siege_repairs`, `occupation_marks`, `lean_years`). ⚠ `calamity_scar` is the
   UNCLASSIFIED default and has no honest common noun — calling it "calamity" would print the
   classifier's own failure as a fact about the town.
2. **DS-POP-2 — its own written fence, RE-MEASURED and still true.** *"NO SURFACE — DO NOT WIRE A
   SELECTOR UNTIL A DOSSIER POPULATION-TREND SURFACE EXISTS… Whether to build that surface is an
   ARCHITECTURE decision and is not made here."* The premise holds at this tip: `buildTrendLenses`
   has exactly ONE consumer, `WhatChangedPanel.jsx`, which is not a dossier tab.
3. **DS-POP-1 — its evidence reaches no dossier tab at all.** `spatialLedgers.migration` surfaces
   only on map layers (`TravelersLayer.jsx`), `QUANTITY_BANDS` lives in `demographicsHerald.js` and
   the demographic receipts in the demographics kernels, and the block carries **NO `sectionTarget`**.
   R-DST-A is satisfied: exactly ONE of the three POP blocks is mounted.

## ⛔ THE ROSTER SWEEP THE BRIEF ORDERED — one hit, cured at cause
Grepped `tests/` and `scripts/` for every hand-frozen roster keyed on anything this lane mints
(mount ids, block ids, desks, slot names, scar kinds). Seven files reference the registry; six read
it DERIVED (`A_DARK_SIBLING` is computed, not named — DESK-GEN2 car 3's own cure). **ONE was a
literal list and it convicted the desk for lighting a block:** `generalStateProseDesk.test.js`
pinned `Object.keys(SLOT_FILL_SHAPES)` as eleven names, and cars 1–3 add seven mirror rows. Car 4
DERIVES it instead — what the mirror owes is that every row agrees with the annex's parsed register
and that it declares no RESERVED slot, and a literal list adds nothing to either. **This is the
third instance of that shape in this subsystem.** `.dossier-mounts-baseline.json` is shrink-only and
my movement is a fall, so it banks lawfully; `.golden-freeze-register.json` carries no row for any
file I touched.

## RESUMED PROOFS — every owed vitest run, exits captured in-shell
All through `sh scripts/gate-mutex.sh --run --` (`acquired atomic lock at
/tmp/settlementforge-vitest-gate.502.lock`). Machine at RESUME: load-1 5.39 → 5.32, workers 0.

| # | command | exit | result |
|---|---|---|---|
| R1 | `… npx vitest run tests/domain/generalStateProseDesk.test.js` | **1** | 4 failed / 65 passed — **ALL FOUR MINE**, cured in car 5 |
| R2 | same, after the cure | **0** | **69 passed (69)** |
| R3 | `… npx vitest run tests/ui/generalDeskTabFlow.test.js` | **1** | 1 failed — **THE FOLD**, cured in car 5 |
| R4 | same, after the cure | **0** | **24 passed (24)** |
| R5 | `… npx vitest run tests/lint/dossierMountRegistry.walker.test.js tests/lint/couplingDesk.walker.test.js tests/lint/autoresolveTwoMount.walker.test.js tests/ui/economicsTabFlow.test.js` | **0** | **42 passed (42)** |
| R6 | `… npx vitest run tests/lint/` WHOLE (first pass) | **1** | 7 files / 8 tests red |
| R7 | `… npx vitest run <both suites + negativeAssertionAnchor + observedShapeReaders + mountRegistry + couplingDesk + autoresolveTwoMount + economicsTabFlow>` | **1** | **186 passed / 2 failed**, and both failures are the INHERITED `observedShapeReaders` pair |
| R8 | `… npx vitest run tests/lint/` WHOLE (after car 5) | **1** | 6 files / **7** tests red — the eighth (`negativeAssertionAnchor`) cured |

### The four failures R1 convicted, every one mine
| arm | what it said | what was actually wrong |
|---|---|---|
| `THE INSTITUTION FILL IS THE CHAIN ROW'S OWN` | `expected '…' not to contain 'computeActiveChains'` | ⛔ **my arm convicted a CITATION.** The desk's docblock names `computeActiveChains.js:297` in writing precisely so a later reader knows why the value is handed in. A coupling claim is about the IMPORT GRAPH; the arm now reads import specifiers |
| `the band comes from the ANNEX'S OWN READER` | `not to contain 'trendLens'` | the same shape, same cure |
| `⛔ DORMANT AT BIRTH` | `the opt-in ancient ruin no longer writes: expected undefined to be truthy` | ⛔ **the flag is NECESSARY AND NOT SUFFICIENT.** Measured: 1 of 12 seeds with `ancientRuinsEnabled`, 0 of 12 without. Twelve seeds are scanned now, with the flag-off control making the presence a reading of the FLAG rather than of the SEED |
| `` `{band}` IS RESERVED `` | `expected 5 to be 4` | ⛔ **vitest prints ACTUAL first: the tree carries FIVE.** I wrote 4 from a hand count of the dump and missed the `charterPending` ledger variant |

### ⛔⛔ A RATCHET MY OWN TRUNCATED READ HAD HIDDEN
`tests/lint/` reported `observedShapeReaders violations: 2` where the base carries 1. The second was
**mine**: `generalStateProse.js: NEW ancientRuin on history — 3 read(s)`. I had run the standalone
scanner four times and read it through `head -2` / `head -3`, which cut the second file's block off
every time — **the exit code was right and my READING of it printed a green I had not earned.** The
cure is car 2's, applied again: `SteadingsSection.jsx` carries a FROZEN row for that identity
(`ancientRuin on history = 1`) and already spells the read at its own line 36, so the caller reads
it and hands it over. After the cure the scanner's WHOLE output carries one violation, the
inherited one. **Method worth keeping: never read a ratchet's output through `head`.**

### THE PLANT-OUT, both halves — CONFIRMED
Static, per car: each mount literal broken in `generalDeskRead.js` ⇒ the walker's reachability arm
convicts by name (`economics.craftReason 0 sites` → 1 fault; `overview.steadings 0 sites` → 1 fault;
`relationships.network` + `overview.populationDirection` → 2 faults). Restored by **INVERSE EDIT**
every time and proved `cmp`-identical to a backup taken BEFORE the plant (md5 `81ca9b2b…`,
`9297da82…`, `c5ee341b…` on both sides); faults back to 0. Runtime: R3's UI failure IS the plant-out
in its most useful form — the DOM refused a sentence the walker was green over.

### R8's seven remaining reds, EVERY ONE ATTRIBUTED BY RE-RUNNING THE SAME FILES AT BASE
    R9  sh scripts/gate-mutex.sh --run -- sh -c "cd <archive of a4ce9f80f> && npx vitest run \
          tests/lint/clampPrimitiveBaseline.test.js tests/lint/proseNumerics.test.js \
          tests/lint/sovereigntyLightingContract.walker.test.js \
          tests/lint/tuningRegister.walker.test.js tests/lint/writerReach.walker.test.js"
    → exit 1, **4 files failed / 1 passed, 8 failed / 188 passed**
The base substrate is a `git archive a4ce9f80f` extraction with `node_modules` **SYMLINKED**, never
materialised. `observedShapeReaders` was excluded from it deliberately: that walker refuses to run
outside a git repo (*"observed-shape migration genesis is not a committed ancestor of current
HEAD"*), which is the same wall DESK-9 hit, so its attribution rests on the scanner naming the
offending FILE instead.

**R9's verdict, arm by arm:**
- `clampPrimitiveBaseline` **RED at base** (`expected [62] to deeply equal [78]`) ⇒ inherited.
- `sovereigntyLightingContract` **RED at base with the IDENTICAL message**, `expected 2523 to be
  2522` ⇒ inherited, and GEN2's new test file is the cause.
- `tuningRegister` **RED at base with the IDENTICAL `dependents moved` row** ⇒ inherited. ⚠ At base
  it reds on FIVE arms and at my tip on ONE; the four extra are that file's own refreeze-ritual
  meta-tests and are not mine either way.
- `writerReach` **RED at base on a DIFFERENT identity** — `anchored on historicalEvents`, frozen
  `web-display=N` against a live `R`, which is GEN2's own predicted gain. Mine sorts earlier so the
  walker names it first at my tip. **Both are gains, one inherited and one new.**
- `proseNumerics` **PASSED at base — zero occurrences in R9's output** ⇒ the red at my tip is
  **MINE**, exactly as predicted before any instrument ran.

### The triage table


| file | mine? | evidence |
|---|---|---|
| `clampPrimitiveBaseline` (1) | **no** | named in `_DESK-LAW.md` as the one permitted estate red, **and RED at base in R9** |
| `observedShapeReaders` (2) | **no** | `violations: 1` + `expected 65 to be 64` — the exact pair DESK-9's receipt records at the shared base `940d161ca`; the survivor is `economyStateProse.js: isCriminal on incomeSources`, sibling car `0e78576d4` (DESK-ECONFAITH C3), and `git diff --name-only` at my tip never names that file |
| `sovereigntyLightingContract` (1) | **no** | **RED at base in R9 with the identical message.** `expected 2523 to be 2522` on the estate's TEST-FILE count. `git cat-file -e a4ce9f80f:tests/ui/generalDeskTabFlow.test.js` succeeds and `git log --diff-filter=A` attributes that file to **GEN2's car `c68d245af`**; `git diff --diff-filter=A a4ce9f80f HEAD` returns **nothing**, so I added no file. ⚠ MY title additions sit BEHIND this assertion and will surface when the chair re-takes the census |
| `proseNumerics` (1) | **yes — a register act, predicted; GREEN at base in R9** | 225 rows both sides (net zero); the 22 `EconomicsTab.jsx` rows relocate by exactly the predicted offsets (194→195, 202→203, 651→660, …). Of every file any of us touched, **only EconomicsTab.jsx carries rows** (22; OverviewTab, HistoryTab, RelationshipsTab, SteadingsSection, generalStateProse, generalDeskRead = 0 each) |
| `tuningRegister` (1) | **no** | **RED at base in R9 with the identical row.** `generalStateProse.js#DEFICIT_FRACTION_FROM: dependents moved` — the row and the wording GEN2's receipt predicted for its own one-caller act. My cars move that constant's LINE, not its dependents; I added no importer of it and no new named constant |
| `writerReach` (1) | **yes, AND IT IS A GAIN** | see below |

⭐⭐ **THE WRITER-REACH MOVEMENT IS A GAIN, AND THE LABELS READ BACKWARDS.** The message is
`expected 'dossier-pdf=N foundry=N web-display=N' to be '… web-display=R'`, and the assertion is
`expect(frozen[row.identity]).toBe(formatted)` — so **FROZEN is *Received* and LIVE is *Expected***.
**R9 settles the argument order by execution rather than by argument:** `writerReach.walker.test.js:295`
is `expect(frozen[row.identity], …)`, so the *Received* side IS the frozen file. Settled again by
reading the frozen FILE directly:
`scripts/.writer-reach-baseline.json` carries `"rawResource on fullyExploited": "dossier-pdf=N
foundry=N web-display=N"` and the tree now measures `R`. **This lane LIT `rawResource on
fullyExploited` on the web-display surface** through DS-GEN-18's exploitation read; the refreeze
banks a win. (`partiallyExploited` and `unexploited` carry `N` in the same file and are likely to
move with it — the walker stops at the first.)

## REGISTER DELTAS — recorded in writing, **no register act taken**
| register | delta | note |
|---|---|---|
| mounts baseline `.dossier-mounts-baseline.json` | `UNMOUNTED_BLOCKS` **30 → 26** | a fall; shrink-only, so it banks lawfully |
| lighting census `sovereigntyLightingContract` | `titles` **+36**, `suiteTitles` **+11**, `files` **UNMOVED** | ⚠ MEASURED BY COUNTING BOTH TIPS, not by counting `+` lines in a diff — a re-indented title counts twice there. `generalStateProseDesk.test.js` 43 → 69 titles / 13 → 20 describes; `generalDeskTabFlow.test.js` 14 → 24 / 6 → 10, and the two suites' own runs report exactly 69 and 24 passing. **NO NEW TEST FILE** — every arm went into `generalStateProseDesk.test.js` and `generalDeskTabFlow.test.js`, which already existed. The file-count red at 2523 is GEN2's and sits in front of my title figure |
| prose-numerics `.prose-numerics-baseline.json` | all **22** `EconomicsTab.jsx` rows relocate (+1 above line 331, +5 between 331 and 530, +9 below 530); **net zero rows** | path-and-line addressed |
| tuning register `.tuning-inventory.json` | `generalStateProse.js#DEFICIT_FRACTION_FROM` line **844 → 900**; the `dependents moved` red is GEN2's | **no new named constant, no ceiling moves** |
| writer-reach `scripts/.writer-reach-baseline.json` | `rawResource on fullyExploited` **`web-display=N` → `R`** | ⭐ a GAIN |
| sizeBaseline | PLAUSIBLE: unmoved | no new file; the chair's build is the authority on bytes |

## LAYER CEILINGS — measured before and after (eslint Linter, skipBlankLines + skipComments)
`EconomicsTab.jsx` **587 → 592 / 600** ⚠ eight effective lines of headroom left ·
`OverviewTab.jsx` 458 → 466/600 · `RelationshipsTab.jsx` 251 → 260/600 ·
`SteadingsSection.jsx` 72 → 78/600 · `generalDeskRead.js` 117 → 156/800 ·
`generalStateProse.js` 497 → 698/800 · **`OutputContainer.jsx` 600/600, UNTOUCHED.**

## FORWARD RISKS FOR THE CHAIR
1. ⚠ **`EconomicsTab.jsx` has EIGHT effective lines left against the 600 layer ceiling.** The next
   car that touches it should extract a position leaf rather than add lines.
2. ⚠ **`generalStateProse.js` is at 698/800** and this leaf still has nine dark blocks.
3. ⚠ **DESK-9's ARM 3 could not be run: its cars are NOT in my history** (`git merge-base
   --is-ancestor 0b0906a02 HEAD` → false), so the walker in my dock carries ARM 1 and ARM 2 only.
   Its three clauses are satisfied BY HAND and stated so the chair can check at the composed tip:
   (a) every drawing tab's `publicDossier` is a PARAMETER, never a file-written constant;
   (b) every consumer hands the flag to the shared reader AND holds one itself — `EconomicsTab`,
   `SteadingsSection`, `RelationshipsTab`, `OverviewTab`; (c) the flag is in the SAME STATEMENT as
   each call.
4. ⚠ **`SteadingsSection.jsx` and `RelationshipsTab.jsx` are new consumers of `generalDeskLines`.**
   ARM 2 counts callers of `generalStateProse(`, which is still exactly one — but the consumer count
   is now six tabs plus one section, and the byte claim about the shared chunk needs a BUILD.
5. ⚠ **Neither `generalStateProseDesk.test.js` nor `generalDeskTabFlow.test.js` carries a row in
   `.golden-freeze-register.json`,** and both now assert same-seed corpus sentences. Neither is
   enrolled nor excluded. That is the state GEN2 left them in and I did not change it; flagged
   because the standing LGT-P14-WITNESS rule says a golden-adjacent file must do one or the other.

## ⭐ RETROVALIDATION ROW (for the Fable chair)
| # | what was judged | what the chair must re-derive | receipts by path | priority |
|---|---|---|---|---|
| 1 | **the chair's `{institution}` mechanism is REFUTED and replaced** — roster/category resolution cleans nothing (0 of 103) and misses the real defect (number agreement); the annex's own `processingInstitutions[]` fill plus a singular-house filter is what works | the 835-pair and 25/48-town figures at the composed tip; whether "the head word is not plural" is the right refusal | `generalStateProse.js#craftInstitutionFill`; desk test "⛔ {institution} REFUSES A PLURAL HOUSE" | ⭐⭐ chair-facing |
| 2 | **the brief's DS-GEN-18 route figures are wrong** — HOME-FED is 3/24 and not 24/24, because `resourceActive` is true everywhere | that the annex's antecedents are the ones I read, and that HOME-FED's vocabulary gap is generation-side | this receipt's route table; desk test "⛔ HOME-FED IS ALL BUT UNREACHABLE" | ⭐⭐ |
| 3 | **`{resource}` is NOT offered on STALLED** — the only producer of "what stopped" holds chain ids | that no other field records the failed feed | `generalStateProse.js` craftSlots note; desk test "⛔ {resource} IS NOT OFFERED ON STALLED" | ⭐⭐ |
| 4 | ⛔⛔ **a corpus sentence inside a `defaultOpen={false}` Section reaches no reader, and every walker is green over it** | whether any OTHER landed mount sits inside a collapsed section — this lane checked only its own | `Primitives.jsx:114`; UI test "the craft-reason line reaches the DOM" | ⭐⭐⭐ estate-wide |
| 5 | **DS-GEN-15 declined for want of a 0..1 threshold** | the cut itself (severity high/low, drift high), which is the chair's or the owner's | desk test "⛔ DS-GEN-15 stays dark" | ⭐⭐ owner-facing |
| 6 | **DS-POP-2 declined on its own NO-SURFACE fence; DS-POP-1 declined for want of any dossier surface; DS-POP-3 mounted alone** | that one of three is the right reading of R-DST-A | desk test "⛔ DS-POP-1 and DS-POP-2 stay dark" | ⭐⭐ |
| 7 | **DS-POP-3's window ≥ 2 gate** — without it LEVEL fires on every town in every world | that silence is right where DS-POP-2 (which owns the honest sentence for it) is unmountable | desk test "⛔⛔ THE WINDOW GATE" | ⭐⭐ |
| 8 | **DS-REL-1's arm reads `localRelationshipRole`, and a tie with no stated end is WITHHELD** | that no other field carries the direction, and that `overlord`/`vassal` must not fold into `patron`/`client` | desk test "⛔⛔ THE ARM"; UI arm asserting the patron line is ABSENT | ⭐⭐ |
| 9 | **the steading provenance order: `forced` outranks `charterPending`** (origin is permanent, standing is transient) | one line | `generalStateProse.js#steadingPoolKey` | ⭐ |
| 10 | **a slot-mirror control that convicts the desk for lighting a block**, cured by derivation (third instance of this shape) | that deriving is the right cure rather than re-listing | car `ff4c73aa8` | ⭐ |
| 11 | **five register deltas + one GAIN** (mounts 30→26, titles +36, prose-numerics relocation, tuning line move, writer-reach N→R) | each figure at the composed tip before banking | this receipt's register table | ⭐⭐ landing |
| 12 | **two reads moved to their accepted sites** (`lifecycleStatus`, `ancientRuin`) rather than widening a baseline | that `SteadingsSection.jsx`'s frozen rows are the right home | cars `f2efa0e84`, `c48d24ba5` | ⭐ |

**DOCK TIP: `c48d24ba5`** (porcelain 0).
