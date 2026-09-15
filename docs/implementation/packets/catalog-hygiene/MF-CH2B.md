# Catalog hygiene / MF-CH2B — THE MAGIC LICENCE, LIVE: all five shelf-reading gates stop deciding a catalog row by its display bucket, a magic-free world gets its alchemist and its library back, and the goods vocabulary leaves the institution gate

- **Status:** DRAFT
- **Packet version:** 2
- **Verified base:** `claude/composite-r4` at `f73bdbf16d3f7a57c18d7fd57b0478b953043a73`
  ⚠ RE-DERIVED at this slot on 2026-09-14 (LT17 car 1). Version 1's base was
  `b2852ccc3cc4753499996da6582dd672e90499d0`; three catalog-moving landings intervened
  and every figure in §0, §1.0, §2 and §2.1 below is re-run, not carried forward.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-2**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`**
  (owner directive **ODQ §484**). Third car of the catalog-hygiene train and the second half of
  a **serial pair** — it is built ON TOP of `MF-CH2A` and cannot be landed before it.
- **Charter and rulings:** `draft-CATALOG-HYGIENE-PLAN.md` §2(b)–§2(f), as re-shaped at
  **ODQ §501.4 / §503 / §505**. Re-derived at this base; **five charter claims are corrected by
  execution** and they are listed in `MF-CH2A` §0.2 and §1 below.

---

## §0.0 · ⛔ THE STOP IS DISCHARGED BY EXECUTION — RE-DERIVED AT `f73bdbf16`, 2026-09-14

**THE ONE RULING THIS CAR WAITED ON NO LONGER HAS A SUBJECT.** Version 1's §0.0 held the
packet because `tests/domain/magicForms.test.js` failed under the cure: `classifyMagicForm`
opens with an ARCANE GATE on the authored TAG, and three `none`-licensed rows —
`Alchemist shop`, `Alchemist quarter`, `Warden's Lodge` — were tagged `arcane` or `alchemy`,
so the licence and the tag disagreed in production the moment the licence let them into a
magic-free world.

Two landings since have removed all three disagreements, and neither was taken for this car:

| row | tags at `b2852ccc3` | tags at `f73bdbf16` | still on the arcane ladder? |
|---|---|---|---|
| `Alchemist shop` | `arcane`, `alchemy` | `alchemy` | **no** — TE-CH-5 moved `alchemy` off `ARCANE_INST_TAGS` into `TRADE_INST_TAGS` |
| `Alchemist quarter` | `arcane`, `alchemy` | `alchemy` | **no** — same landing |
| `Warden's Lodge` | `arcane` | `military` | **no** — the tag is gone |

`ARCANE_INST_TAGS` is `['arcane', 'planar', 'enchanting']` at this slot. **No row that
declares `magicLicense: 'none'` carries any member of it.** The deepest thing version 1
found — *"a TRADE vocabulary being used as a MAGIC-DEPENDENCE vocabulary"* — was ruled and
paid at TE-CH-5, and the three lawful shapes offered to the chair in version 1 are moot:
shape 2 is landed and shapes 1 and 3 are no longer needed.

**EXECUTED, not argued.** With P5 and the UI half applied to a clean export of `f73bdbf16`:

```
npx vitest run tests/domain/magicForms.test.js tests/domain/magicFormsPractitioner.test.js
  tests/domain/instantWorldMagicKnob.test.js
    -> 3 files passed, 83 tests passed
npx vitest run tests/lint/magicLicenceCensus.walker.test.js
    -> 2 failed of 61: A7 and A10 ONLY
```

A7 and A10 are the two arms this car is DESIGNED to flip (§5 item 1) — A7 asserts *the world
law still strikes all 28*, A10 asserts *the declaration is read by ONE gate of four and the
shelf still decides*. Both are re-pointed by this car, not broken by it. **No other suite in
that set reds.** ⛔ The STOP is therefore lifted on the MECHANISM. What holds this packet now
is NOT a ruling about the arcane ladder; it is the owner's word on the declared shift below
and on ODQ §764.3's sentence naming TE-TRANS-1 the LAST same-seed-moving wave.

---

## §0 · ⛔ READ THIS FIRST — THE DECLARED SHIFT, RE-DERIVED AT THE LIVE SLOT

⚠⚠ **VERSION 1'S 1,025 WAS MEASURED AT `b2852ccc3` AND IS STALE BY CONSTRUCTION.** Three
catalog-moving landings intervened (T8 car 3's thirty relabels `64c344615`; the burial
ladder's five rows `e6516885e`; TE-CH-6's two de-taggings and licence moves). The estate's own
law — ODQ §550.1, §541.1 — is that a stale figure in a law file is the thing that bites, so
the table below was **re-run**, not carried forward: 2,520 generations at the base and 2,520
with the cure, on the same 504 configurations (the golden corpus's leading tier × culture ×
terrain grid) crossed with `{magicExists:false, priorityMagic:0, 20, 50, 80}`.

**1,182 of 2,520 same-seed institution ROSTERS change; 1,372 of 2,520 whole settlement
RECORDS change.** Version 1 reported one number where there are two, and the wider one is the
honest one — a probability change that moves no roster still moves the record downstream of it.

| magic case | settlements | rosters changed | whole records changed | rosters confined to licensed rows |
|---|---:|---:|---:|---:|
| `magicExists:false` | 504 | **356** | **356** | 0 |
| `priorityMagic:0` | 504 | **356** | **356** | 0 |
| `priorityMagic:20` | 504 | **228** | **228** | 199 |
| `priorityMagic:50` (the default) | 504 | **40** | **132** | 36 |
| `priorityMagic:80` | 504 | **202** | **300** | 115 |
| **total** | **2,520** | **1,182** | **1,372** | **350** |

**AND THE CAR SPLITS CLEANLY IN TWO, WHICH VERSION 1 COULD NOT SAY.** Measured separately,
the two halves are **exactly disjoint by magic case** — 660 + 712 = 1,372 with no overlap:

| half | files | cases it moves | records moved |
|---|---|---|---:|
| **P1 / P2 / P3** (the probability gates) | `institutionProbability.js` | `pm20`, `pm50`, `pm80` ONLY | **660** of 2,520 (470 rosters) |
| **P5 + the UI half** (the world law) | `generationContext.js`, `magicFilter.js` | `magicExists:false`, `pm0` ONLY | **712** of 2,520 (712 rosters) |

That is a landing plan the chair did not have: the two halves can be priced, ruled and landed
as separate acts, and neither hides inside the other's figures.

**Three things make the number readable.**

*First, the default world barely moves.* At `priorityMagic:50` — what an unconfigured
settlement gets — **40 of 504** rosters change. The shift is concentrated exactly where the
bug lived: magic-free worlds, and the low and high extremes of the dial.

*Second, the collateral has one mechanism and it is structural, not a defect.* At
`assembleInstitutions.js` the world law returns **before** the `rng.chance` draw. A row the
law newly ALLOWS therefore consumes a draw it used to skip, and every later draw in that step
shifts. The rng-preserving cure the chair used for `religiousCenter` at ODQ §503.4 is **not**
available here, because there the fix was to un-suppress ONE named group and here the whole
point is that the world law's ANSWER changes for a measured set of rows.

*Third, the shelf door is real and it is measured.* At the base, **0 of 1,008** magic-free
settlements hold any Magic- or Exotic-shelf row. With the cure, **432 of 1,008** do —
`Alchemist quarter` 184, `Great library` 168, `Alchemist shop` 114, `Warden's Lodge` 54,
`Druid Circle` 48, `Elder Grove Council` 24. Two of those are the faith institutions the
deity doctrine is about.

---

## §1 · WHAT THIS CAR IS

Three production files. Nothing else in `src/` is touched.

| file | gate | before | after |
|---|---|---|---|
| `src/generators/institutionProbability.js` | **P1** the magic multiplier (`:88`) | `cat.includes('magic') \|\| inst.includes('wizard') \|\| … 8 substrings` | `declaredLicence !== null ? licensedForMagic : (the old test)` |
| ″ | **P2** `hiMagicInsts` (`:176-180`) | 11 keywords incl. `magical banking`, `enchanting quarter`, `magic item consignment` | **8** — G7's literal cure; the list stays a NAME list (§3) |
| ″ | **P3** the exotic scaler (`:187-189`) | `(cat.includes('magic') \|\| cat === 'exotic') && !NON_MAGIC_EXOTICS.some(…)` | `declaredLicence !== null ? licensedForMagic : (cat.includes('magic') \|\| cat === 'exotic')`; `NON_MAGIC_EXOTICS` deleted |
| `src/domain/arcaneInstitutionIdentity.js` | **P4** the direct world-fact gate (`:229`) | — | **NOT EDITED HERE.** MF-CH2A routed `isArcaneInstitution` through the licence and `institutionProbability.js:302` reads it unchanged. P4 costs this car zero lines |
| `src/generators/generationContext.js` | **P5** THE WORLD LAW (`:89`, `:97`) | `carriesExplicitMagicMetadata(entity) \|\| ARCANE_INST_KW.some(kw => name.includes(kw))` | the declared licence first; the old two tests survive as the non-catalog fallback |
| `src/domain/magicFilter.js` | **UI** the institutional grid (`:37`) | `c === 'magic' \|\| c === 'exotic'` first | `def.magicLicense` first — read straight off the row `filterCatalogForMagic` already holds, so **no new import of the catalog** and no chunk edge |

⭐ **THE SIXTH SURFACE IS ALREADY LANDED AND IS NO LONGER THIS PACKET'S TO PAY.** Version 1
found by execution that `generationCoherence.js` asks `worldLaw.allowsMagicClaim` about every
generated string INCLUDING the taxonomy fields, so a magic-free world keeping a Magic-shelf row
is convicted by its own `world_law_magic` receipt for the name of the shelf. That cure —
J-TECH2-10, chartered as CH-6b car 1 and discharged into this packet by ODQ §879.11 R3 — landed
on its own at **`72545d322`**, measured output-free by execution (**0 of 2,520** grid records,
**0 of 525** golden rows code-to-code) and held by arm **B7b** in
`tests/generators/generationWorldLaw.test.js`. It is the guard that lets P5 land without the
certification turning on the rows P5 admits, and it is now a PRECONDITION already met rather
than work owed.

### §1.0 · THE GATE ROSTER FOR ARM B2, RE-DERIVED BY SOURCE CENSUS AT `f73bdbf16`

Every line in `src/` that decides magic by reading a BUCKET, swept estate-wide rather than
taken from the charter. **The per-file counts version 1 recorded still hold exactly**:

| file | line | the read | arm B2 marker owed |
|---|---|---|---|
| `src/generators/institutionProbability.js` | `:88` | `cat.includes('magic')` (P1) | yes |
| ″ | `:189` | `cat.includes('magic') \|\| cat === 'exotic'` (P3) | yes |
| `src/domain/arcaneInstitutionIdentity.js` | `:229` | `bucket === 'magic'` (P4) | **already carries `@non-catalog-fallback MF-CH2`** |
| `src/generators/generationContext.js` | `:89` | `String(category)… === 'magic'` (P5) | yes |
| ″ | `:97` | `semanticCategory === 'magic'` (P5) | yes |
| `src/domain/magicFilter.js` | `:37` | `c === 'magic' \|\| c === 'exotic'` (UI) | yes |

⇒ `institutionProbability` **2** · `arcaneInstitutionIdentity` **1** · `generationContext` **2**
· `magicFilter` **1**. Version 1's pinned counts are CONFIRMED at this slot.

⭐⭐ **AND THE SWEEP FOUND A SIXTH PRODUCTION READER THE CHARTER'S CENSUS OF FIVE MISSED.**
`src/generators/priorityHelpers.js:147` — `computeEffectiveMagicPresence`, the self-described
*"single source of truth for magic level across Daily Life, Defense, and Power"* — reads
`instCategories.some(c => c === 'magic' || c === 'exotic')` and adds folk weight to a
settlement's magic score for any roster row on those shelves. It is a live generation consumer
(`defenseGenerator.js`, `components/new/dailyLifeLogic.js`).

⛔ **It is INERT in exactly the worlds this car changes, and that is measured, not assumed.**
The function early-returns `{ score: 0, band: 'none' }` whenever `magicExists === false` or
`priorityMagic === 0`, so the hard world fact dominates before the shelf is ever read:

```
magicExists:false  none=0/none  Druid Circle=0/none  Great library=0/none  bare Magic shelf=0/none
priorityMagic:0    none=0/none  Druid Circle=0/none  Great library=0/none  bare Magic shelf=0/none
priorityMagic:20   none=11/low  Druid Circle=13/low  Great library=22/low  bare Magic shelf=13/low
priorityMagic:50   none=28/mod  Druid Circle=30/mod  Great library=39/mod  bare Magic shelf=30/mod
```

So it is NOT a sixth doctrine door, and it is NOT chartered here. It IS live at `pm20` and
above, where P1/P3's roster changes move it — which means its movement is already inside the
660 recorded above and must not be attributed to anything else. **Recorded so it is not
re-found as an omission.**

⚠ **A DOCTRINE RESIDUE IN THE SAME FUNCTION, NAMED RATHER THAN SMUGGLED INTO A CAR.**
`INST_WEIGHTS.folk` still carries the literal keyword `"healer (divine"` — the same faith
string TE-CH-6 removed from `ARCANE_INST_KW` — so a settlement whose only "magical" institution
is a divine healer still scores 13/low at `pm20` and 30/moderate at `pm50` where it would
otherwise score 11 and 28. This is a SECOND vocabulary keying magic on a faith word, in a file
no car of this train opens. It belongs to whichever car next opens `priorityHelpers.js`.

### §1.1 · Where the licence does NOT go, and why

`arcaneInstitutionVocabulary.js`'s header records that a single eager→lazy import edge closed a
chunk-level cycle and made `dist` un-bootable (lane BT, 2026-08-03; `@guarded-by
scripts/boot-smoke.mjs stage 1`). This car creates **no new module edge at all**:

* `institutionProbability.js` already imported `arcaneInstitutionIdentity.js`;
* `generationContext.js` adds an edge in the same direction that file already uses;
* `magicFilter.js` — the lazy one — imports only the LADDER, from `src/data/constants.js`, a
  **zero-import** data leaf. It never reaches for the catalog index, because
  `filterCatalogForMagic` is handed the row and can read `def.magicLicense` directly.

⚠ `filterCatalogForMagic` and `filterServicesForMagic` have **no caller in the generation
pipeline** at this slot — measured: their only `src/` consumers are `components/InstitutionalGrid.jsx`
and `store/selectors.js`. The UI half therefore moves the panel and **not one byte of same-seed
output**, which is why every figure in §0 is attributable to P1/P2/P3 and P5 alone.

`filterServicesForMagic` keeps the keyword vocabulary, deliberately. It is handed service names
rather than catalog rows, so it has nothing to read a declaration off, and it has **zero
production callers in `src/`** (measured).

---

## §2 · THE CURE, ROW BY ROW — RE-MEASURED AT `f73bdbf16`

Settlements (of 504 per case) whose roster holds the row, base → cure, over the same grid.
`—` means the row is absent on both sides; `=` means present and unmoved.

| row | licence | dead | pm0 | pm20 | pm50 | pm80 |
|---|---|---|---|---|---|---|
| `Alchemist quarter` | `none` | 0 → **92** | 0 → **92** | 0 → **96** | 42 = | 72 → 36 |
| `Great library` | `none` | 0 → **84** | 0 → **84** | 19 → **72** | 72 = | 84 → 72 |
| `Alchemist shop` | `none` | 0 → **57** | 0 → **57** | 0 → **72** | 72 = | 72 = |
| `Warden's Lodge` | `none` | 0 → **27** | 0 → **27** | 0 → 5 | 2 → 5 | 39 → 5 |
| `Druid Circle` | `none` | 0 → **24** | 0 → **24** | 0 → 48 | 12 → 48 | 60 → 48 |
| `Elder Grove Council` | `none` | 0 → **12** | 0 → **12** | 0 → 18 | 17 → 18 | 66 → 18 |
| `Adventurers' charter hall` | `none` | 23 = | 23 = | — | — | — |
| `Dragon resident` | `none` | — | — | — | — | — |
| `Undead labor` | `high` | — | — | — | — | 23 → 83 |
| `Message network (high magic)` | `high` | — | — | — | — | 52 → 84 |
| `Golem workforce` | `high` | — | — | — | — | 133 → 144 |
| `Dream parlors (high magic)` | `high` | — | — | — | — | 60 → 72 |
| `Hedge wizard` | `low` | — | — | — | 24 = | 48 = |
| `Enchanter's shop` | `high` | — | — | 24 = | 88 = | 144 = |
| `Academy of magic` | `high` | — | — | — | 60 = | 84 = |
| `Mages' district` | `high` | — | — | — | 78 = | 84 = |
| `Healer (divine, 1st level)` | `low` | — | — | — | — | 48 = |

Read plainly: **a world with no magic in it gets back its alchemists, its great library, its
warden's lodges — and its druids.** `Druid Circle` and `Elder Grove Council` are the deity
doctrine's own rows, authored `tags: ['religious']` and licensed `none`, deleted today by the
name of the shelf they are filed on; they return in 24 and 12 magic-free settlements.

⛔⛔ **TWO OF VERSION 1'S ROW CLAIMS ARE REFUTED BY EXECUTION AND MUST NOT BE RE-QUOTED.**

1. **`Adventurers' charter hall` does not move at all.** Version 1 recorded `23 → 32`. At this
   slot the row sits on **two shelves** — `Magic` and `Adventuring` — and the world law already
   admits it on the second, so 23 magic-free settlements hold it BEFORE the cure and 23 hold it
   after. The row was never excluded; only its Magic-shelf copy was, and the Adventuring copy
   was always reachable. Version 1's figure came from a grid where that was not yet true.
2. **The licensed-row counts are not version 1's.** `Alchemist shop` 9 → **57**, `Warden's
   Lodge` 66 → **27**, `Great library`'s `pm20` 72 → **53** added. Every cell above is executed
   at this slot.

`Dragon resident` is 0 at every magic case on this grid, exactly as version 1 recorded — so this
grid supplies no positive control for that row, and the panel's own 5-seed control (ODQ §503.1)
still stands as the one that does. Stated rather than papered over.

### §2.1 · THE CATALOG CENSUS THIS CAR ACTS ON, RE-COUNTED

| figure | version 1 (`b2852ccc3`) | **re-derived (`f73bdbf16`)** |
|---|---:|---:|
| distinct catalog institution NAMES | 311 | **280** |
| name × shelf pairs | — | **282** |
| rows declaring a `magicLicense` | — | **25** |
| distinct names licensed `none` | 7 | **8** |
| name × shelf pairs the dead-magic world law strikes | 28 | **29** |
| … after the cure | — | **21** |
| name × shelf pairs whose verdict the cure CHANGES | — | **8**, every one licensed `none` |

⚠ **311 WAS QUOTED IN §3 AND IN ARMS B1 AND B4, AND IS CORRECTED THERE IN THIS VERSION.** The
catalog holds **280** distinct names at this slot. Any arm written as "all N rows" must DERIVE
its denominator from the catalog rather than re-type it, or the next landing that adds or
removes a row leaves the arm pinning a denominator that no longer exists — which is exactly how
this figure came to be wrong.

The eight name × shelf pairs the cure newly admits, executed:

```
ADMITTED  Adventurers' charter hall  (shelf Magic,  licence none, tags [military,adventuring])
ADMITTED  Alchemist quarter          (shelf Magic,  licence none, tags [alchemy])
ADMITTED  Alchemist shop             (shelf Magic,  licence none, tags [alchemy])
ADMITTED  Dragon resident            (shelf Exotic, licence none, tags [])
ADMITTED  Druid Circle               (shelf Magic,  licence none, tags [religious])
ADMITTED  Elder Grove Council        (shelf Magic,  licence none, tags [religious])
ADMITTED  Great library              (shelf Magic,  licence none, tags [education,education])
ADMITTED  Warden's Lodge             (shelf Magic,  licence none, tags [military])
```

⚠ **AND THE INSTRUMENT THIS CAR WILL BE JUDGED ON IS ALREADY RED AT ITS OWN BASE.**
`tests/property/generatorGoldenMaster.test.js` fails **525 of 525** at `f73bdbf16` with a clean
tree — the committed manifest has not been re-recorded since `e4aebd28a` (2026-09-01) and the
code moved after it. Bisected here to **`e3f6029b2`** (2026-09-05, the em-dash wave). The red is
pre-existing and banked by the chair since ODQ §901 — `GOLDEN_SHIFT_LEDGER.md`'s closing block
says so in its own words — but it means **no figure in this packet may be stated as "N of 525
moved" against the committed manifest.** Every golden claim here is measured CODE TO CODE
against a clean export of the same base, which is the only comparison that carries information
while the manifest is stale.

## §3 · G7 — the literal cure, and the arm that is NOT in this car

`hiMagicInsts` loses exactly three members, each RE-MEASURED at `f73bdbf16` against all **280**
catalog names (version 1 said 311 — see §2.1): `magical banking` **0 matches**, `enchanting
quarter` **0**, `magic item consignment` **0**, and `filterGoodsForMagic` still strips
`Magic item consignment` at magic-0, executed. The third is a member of `magicFilter`'s `ARCANE_GOODS` — a GOODS vocabulary living
inside an INSTITUTION gate — and `filterGoodsForMagic` keeps it, which arm B6 pins on both
sides. No row's hard-zero verdict changes.

**The rest of the list stays a NAME list, deliberately.** The charter's §2(b) proposed
replacing it with `licenceAtLeast(name, 'high')`. The CH skeptic panel flagged that arm and the
lane brief ordered it split out, and re-measured here that judgment holds: the licence form
would hard-zero the enchanter, the academy and the mages' district below `priorityMagic` 66,
which is a decision about **what a low-magic city contains** rather than about how the engine
identifies magic. `J-TECH2-4` carries it to the chair with its own measurement.

---

## §4 · ACCEPTANCE — EIGHT ARMS

`tests/lint/magicShelfGateCensus.walker.test.js`, a **CREATE** row.

| arm | what it holds |
|---|---|
| **B1** | **SHELF-INDEPENDENCE, executed.** All **280** rows (re-derived from the catalog, never re-typed) answer identically on their own shelf and on a neutral one, across all four observable gates (P4, P5, the UI, and a normalised `getBaseChance` vector across five magic dials that cancels every shelf-CONSTANT factor). Carries its own non-vacuity floor: a synthetic licence-free, tag-free, keyword-free row IS shelf-decided, and all four probes report it |
| **B2** | **THE GREP ARM.** Every surviving shelf comparison in the four gate files carries the exact marker `@non-catalog-fallback MF-CH2`; the per-file counts are pinned (`institutionProbability` 2 · `arcaneInstitutionIdentity` 1 · `generationContext` 2 · `magicFilter` 1). The scanner distinguishes a BUCKET comparison from a TAG comparison — `tag === 'magic'` is an authored tag read R-BLD-5 rules legitimate — and a positive control proves it sees an unmarked bucket read and does not see the tag read |
| **B3** | **G3 by execution.** `Alchemist shop` and `Alchemist quarter` are reachable at `priorityMagic:20` where they were zero, and their chance no longer moves with the dial at any tier. Non-vacuity: `Enchanter's shop` still rides it |
| **B4** | **G4 — one read, two surfaces.** Row by row over all **280** (re-derived from the catalog, never re-typed), `filterCatalogForMagic` and `worldLaw.allowsInstitution` still agree in a dead-magic world, and the five survivors are named as the content-profile denials they are. Both surfaces moved by 9 rows and the disagreement count did not move |
| **B5** | **G5.** `Great library`'s chance is invariant across the whole dial, it is no longer arcane, and it survives a dead-magic world on both surfaces |
| **B6** | **G7.** The `hiMagicInsts` list is pinned at its eight members; each of the three removed keywords is re-proved to match no catalog row; `filterGoodsForMagic` still strips `Magic item consignment` |
| **B7** | **The non-catalog fallback is LIVE at every gate** — a custom `Magic`-shelf entity, a keyword-named entity on a silent shelf, and a plainly mundane invented row, each answered exactly as before |
| **B7b** | **THE SIXTH SURFACE.** Eight bare classification tokens are no longer read as magic claims in a magic-free world, and four SENTENCES still are, in the same world — so the change is a narrowing to bucket names rather than a hole in the certification. A magical world is unaffected in both directions |
| **B8** | **`NON_MAGIC_EXOTICS` is gone** (from the code, not from the prose that explains why), `Dragon resident` is dial-invariant, and its inert companion `Underground city` is re-proved to sit on the metropolis **Criminal** shelf, where the test it was exempted from never fired |

---

## §4.1 · EIGHT MUTANTS, AND THE ONE THAT DID NOT COMPILE

| mutant | the edit | arms it reds |
|---|---|---|
| N1 | *(first attempt — the patch left an unbalanced parenthesis, so vitest collected **0 tests** and the run is NOT a drive. Recorded rather than quietly replaced)* | — |
| N1b | P1 sent back to deciding by the shelf, `node --check` clean first | B1, B3 |
| N2 | P3 sent back to deciding by the shelf | B1, B3, B5, B8 |
| N3 | the world law stops reading the licence | B1, B4, B5 |
| N4 | the UI grid stops reading the licence | B1, B4, B5 |
| N5 | an UNMARKED shelf comparison planted in a gate file | B2 |
| N6 | the `@non-catalog-fallback` marker stripped from an existing one | B2 |
| N7 | the goods-vocabulary keyword put back into `hiMagicInsts` | B6 |
| N8 | `NON_MAGIC_EXOTICS` resurrected | B8 |

Every drive restored `cmp`-exact with a clean control green immediately before the first and
immediately after the last.

---

## §5 · WHAT THE CAR REDDENED, AND WHY EACH RED IS THIS CAR'S TO PAY

Three ratchets outside the acceptance went red at this member and every one was **attributed by
execution** — each was GREEN at the MF-CH2A tip, which is the receipt that MF-CH2A moves no
roster and that these are the gate car's own bill.

1. **`tests/lint/magicLicenceCensus.walker.test.js` arm A7 — the arm this car is DESIGNED to
   flip.** At MF-CH2A it read *the world law still strikes all 28*, and its convicting mutant
   M11 was literally this car's edit. It is **re-pointed rather than deleted**: the world law
   now admits exactly the **seven** rows an author licensed `none` — the two charter halls,
   `Alchemist shop`, `Warden's Lodge`, `Alchemist quarter`, `Dragon resident`, `Great library`
   — and still strikes the other **21**. The arm asserts that list twice: once literally, and
   once DERIVED from the catalog's own `magicLicense === 'none'` rows, so the pin and the data
   cannot drift apart silently.
2. **`tests/lint/negativeAssertionAnchor.walker.test.js`** — this car's own new walker carried a
   bare `not.toContain`, which the estate's habitat-removal ratchet refuses (frozen ceiling 0).
   Cured at the source with `expectAbsentWithAnchor(keywords, dead, 'teleportation', …)` from
   `tests/helpers/anchoredNegatives.js`, so the absence of the goods keyword is anchored on a
   keyword that must still be present. ⚠ ODQ §507.4 recorded that this walker "does NOT red for
   a `tests/lint` file"; that was true of MF-CH1's file and is **not** a property of the tree —
   it reds for any file that writes an unanchored negative, wherever it lives.
3. **`tests/lint/observedShapeReaders.walker.test.js` corpus meta — 1300/8607/14586 →
   1302/8656/14644.** The corpus GREW, and the +2 is exactly this car's two record keys becoming
   OBSERVABLE: `observed-shape-corpus.mjs` lights every `*Enabled` flag it can find, but no
   licensed institution ever reached a roster in that world, so the `magicLicense` key MF-CH2A
   declared was invisible to it. This car puts the seven `none`-licensed rows where they belong
   and the key arrives with them. **Every figure moves UP**, the opposite direction from the
   2026-08-17 re-record above it, and that is also the safe direction for a
   reader-with-no-writer ratchet: more observed shapes can only resolve reads that were
   previously unresolvable, never manufacture a blind spot. **The findings inventory did not
   move** — `check-observed-shape-readers.mjs` returns the same 159 bytes and the same SHA-256
   `c5b67844abe51226…` at this tip as at the clean base, `cmp` exit 0, and
   `.observed-shape-readers-baseline.json` is untouched.

And one ratchet that reds by CONSTRUCTION and is paid at the source:
**`tests/lib/instantWorld/mundaneRealmAcceptance.test.js`'s RECORDED-CENSUS pin.** Its own
docstring says what to do when it reds — confirm the shift was intended and carry the figures
into BOTH places — so this car does: `institutions 134 → 139, factions 22 → 24, services
193 → 195` in the test header and in `docs/DESIGN_REALM_MAGIC_TOGGLE.md`'s MG-4 landed block.
The magical twin does not move on any axis, **the arcane census over the mundane realm is still
EMPTY**, and every envelope ratio stays inside `PENDING_BANDS` with three of five improving —
so no owner-signed tolerance is asked to move.

While in that document, the **"Chair to schedule" residual at `:514-519` is corrected rather
than claimed.** The charter (ODQ §501.4) says CH-2 discharges it. It does not: this car routes
CATALOG rows past the unanchored `ARCANE_INST_KW` scan, but the other 283 rows still fall
through to it and `filterServicesForMagic` is still on it outright. The residual's SURFACE has
shrunk to the unlicensed remainder; its ANCHORING has not changed, and it stays open with that
narrowing written in.

---

## §6 · THE CENSUSES, THE BUNDLES AND THE GATES

*Every exit captured with **no pipe**; every battery mutexed with workers capped
(`--pool=threads --maxWorkers=2` — see MF-CH2A §7's J-TECH2-9 for why the chair's flag string
could not be used verbatim).*

- **The census row, WALKED at this tip (§417).** From the base tuple `2516/366/2150/20863/5808`
  the combined pair delta is **`+2/+0/+2/+17/+2`** → `2518/366/2152/20880/5810`, each moved
  figure read off the arm's own failure message in assertion order, green at step 5, with
  `parked` PASSING UNMOVED at 366 on the iteration between `files` and `credited`. The split is
  MF-CH2A `+1/+0/+1/+9/+1` and MF-CH2B `+1/+0/+1/+8/+1`, and 9 + 8 = 17 closes. The file is then
  reverted `cmp`-exact and the row rides this packet to the landing act.
- **The golden, re-recorded a second time and deliberately.**
  `0a2309f573fc1f4c…` → `600cdf1859c00e7e2525240deb643c162642185f104b3423c68e85f3bffbfcfe`;
  **92 of 525 keys move, 0 added, 0 removed.** ⭐ Measured on the fixtures themselves rather than
  reasoned: base → this tip moves **297**, exactly as base → MF-CH2A did, so **this car moves no
  golden row the declaration had not already moved** — its 92 are a strict subset of that 297.
  A SHIFT RECORD row is added above MF-CH2A's, and it says plainly which of the two is the
  roster shift.
- **Edge bundles: NONE owed.** None of this car's three production files appears in any of the
  five `supabase/functions/_shared/*.meta.json` input rosters (`grep -l`, all five metas, all
  three files, plus the new walker). MF-CH2A pays that bill for the pair.
- **Both typecheckers, verbatim, with this car applied.**
  `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` TRUE_EXIT 0
  `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` TRUE_EXIT 0
- **eslint** over the five authored/edited source and test files: **empty output, exit 0**;
  `--fix-dry-run` likewise.
- **C0** over all eleven files this car authors or edits: **0 control bytes, 0 tabs**.
- **CLAIM_RE** over every added `docs/**` line and every added `src/**` line: **0**.

---

## §7 · JUDGMENTS AND DEFERRALS

The pair's nine judgments and five deferrals are recorded once, in **MF-CH2A §7**, because they
were taken for the car as a whole. The three that decide THIS packet are J-TECH2-4 (the P2 arm
is split out and carried to the chair), J-TECH2-5 (Design A ships, Design B priced at 545 of
2,520) and J-TECH2-8 (`filterServicesForMagic` stays on the keyword vocabulary).
