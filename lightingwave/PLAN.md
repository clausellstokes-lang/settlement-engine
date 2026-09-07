# PLAN.md — THE LIGHTING WAVE, REBUILT FROM THE SURVIVORS AND RE-DERIVED AT `272dbd2da`

**Lane LIGHT-PLAN (Opus 5) under a Fable 5.1 chair · 2026-09-05 · READ-ONLY.**
**Base of measurement: `$SC/laneANCH2` detached at `272dbd2da416343a6eac14bc50ac09abb69d53b8`** — the clamp consist
(14 cars) + the 3 ANCHORS cars over product `90702c3e9`. Porcelain **0** at open and at close, verified both times.
**Ledger read at `29e7bf1e5`** (`review-fixes-2026-07-08`, §895), always via `git show`, never `ls`.

⚠ **`LIGHTING-INVENTORY.md` is permanently lost** (SCOPE-MEASURE §0). Everything below is rebuilt from
`pending/LIGHTING.json` (31 items), `lightingscope/{doors,wave-plan,receipt-lightingscope}.md`, the ledger charter rows,
and — for every load-bearing figure — a probe **re-executed by this lane at `272dbd2da`**.

⛔ **This lane took no register act, wrote to no git tree, ran no vitest, no `npm run`, no build.**
The live lighting-census probe ran against a **read-only symlink farm**, never against the gating tree (receipt §R3).

---

## 0 · THE HEADLINE, BEFORE THE DETAIL

1. **Nothing on the wave has moved.** 0 of 31 DONE at the freshest tree in existence.
2. **Twelve recorded blockers were checked. Eleven confirm as the chair recorded them; one I dispute in part; two were
   out of this wave's scope and I say so rather than inheriting them.**
3. ⛔ **A 13TH DECAY, MEASURED: the prose car's rebase has quadrupled, 2 → 8 overlapping paths**, and it is the one
   cost in this arc that is *measurably growing with every landing*. This is the single figure that changes the order.
4. ⛔⛔ **A 14TH DECAY, AND IT ADDS A REGISTER THE WAVE DID NOT KNOW IT OWED: the GOLDEN freeze machinery HAS LANDED.**
   `tests/helpers/goldenRecordDoor.js`, `tests/fixtures/.golden-freeze-register.json` and `docs/shift-records/` are all
   **PRESENT** at `90702c3e9` and `272dbd2da`; every survivor document records them as **ABSENT**. Their walker runs on
   every gate. **`LGT-P14-WITNESS` now owes a golden-freeze register row or a written exclusion** — an obligation that
   did not exist when the docket was written.
5. ⭐ **`LGT-P15-EP1` conflates two acts of very different size**, and the measurement below separates them: the wave
   owes the **corpus re-key migration** (25 keys, now independently confirmed) and does **NOT** owe the **EP-1
   `advanceEpochEnabled` release** (four reference-artefact re-records) — and it is the *release*, not the re-key, that
   crosses the detector.

---

## 1 · THE 31 ITEMS, RE-CLASSED AT `272dbd2da`

**State legend** — DONE / PARTIAL / NO / RULED (an owner row the ledger has already answered) / CLOSED.
Every state below carries the probe I re-executed. `git grep -l … | wc -l` over `src tests scripts schema` unless noted.

### 1.1 The sixteen prerequisite builds

| id | what | klass | **state @ `272dbd2da`** (probe, re-executed) | blocked_by AS RECORDED | blocked_by AS RE-DERIVED |
|---|---|---|---|---|---|
| **LGT-P1-BIRTH** | fresh births resolve the lit preset | chair | **NO** — `NEW_CAMPAIGN_SIMULATION_PRESET_ID` = **0 files** | nothing; O-1/CH-5 ruled | ✅ **holds — nothing.** First car of L-HOMES |
| **LGT-P2-MANIFEST** | split the key list into gated REGISTER + derived VIRTUAL | chair | **NO** — `ENGINE_GATED_VIRTUAL_RULE_KEYS` is still one flat list of **30** | must precede any class-F/G flip | ✅ **holds.** A class-F flip before it INVERTS two lighting contracts |
| **LGT-P3-CAPSIG** | CAPACITY C1 surface + C2/C3 evidence | machinery-debt | **PARTIAL** — `demographicsRates.js:375` = `Object.freeze({ signed: false, lit: null })` | HORIZON-DARK (TUNEREG first) | ⚠ **AMENDED.** ≡ **HORIZON-DARK B6**, not TUNEREG (B5). The surface landed; the **three evidence items** are the blocker |
| **LGT-P4-READER** | the Remembrance reader (RR-2) | ~~owner-gated~~ | **NO** | O-5, the owner | ⛔ **STRUCK — PHANTOM.** §882.13: *"LIGHTING O-5 **BUILD** the Remembrance reader"*, inside THE NINETEEN RULED |
| **LGT-P5-WOPS** | four W-OPS door mints | chair | **NO** — src-only: `operationsVoice` 1 · `envoyTaskCatalog` 1 · `infiltrationDepth` 3 · `missionDispatcher` 4; none minted | nothing | ✅ **holds.** Must precede the espionage flip |
| **LGT-P6-ESPWIRE** | espionage Herald wiring | chair | **NO** — **0 of 18** files under `src/domain/worldPulse/espionage/` write a news entry | nothing | ✅ **holds.** Before L-DEFAULT hunk 6 or it is a NEWS ADDRESS LAW breach by construction |
| **LGT-P7-DRIFTDOOR** | `characterDriftEnabled` door + funnel | chair (re-classed) | **NO** — 3 src files name it, no manifest home | "a NEW decision"; §890.1 withdrawal | ⚠ **DECAYED → chartered.** `RULINGS-893` §2 charters it in three parts. ⛔ **shared with ENCOUNTERS by the amended O-9 — whichever train lands first OWNS the door; check ENC-3 before building** |
| **LGT-P8-MATBOUND** | the MAT create boundary | chair | **NO** | nothing | ✅ **holds.** Precedes L-MAT |
| **LGT-P9-CS9** | CS-9's restore-path plant | machinery-debt | **NO** — `charsetPolicy` **0 hits in `src`** | HORIZON-DARK CHARSET Car 2 | ✅ **holds** ⇒ **≡ HORIZON-DARK B1 (double-count, §6.1)**. ⚠ CS-9's own owner-gating is **probably decayed** — reported, **not ruled** (§7) |
| **LGT-P10-SEAT78** | SEAT-7/8 + `irregularForceEnabled` | chair | **NO** — `irregularForceEnabled` = **0 files** | chair-ruled FUND (O-4); D10/D11 fold first | ✅ **holds.** ⭐ the arc's longest pole, ≈4 cars / 2–3 days; **rides its own consist, in parallel from day one** |
| **LGT-P11-NEIGHBOR** | lighter default-edge class for `neutralNeighborsEnabled` | chair | **NO** — still in `BACKLOG_RULE_KEYS` (17 at ceiling 17) | chair-ruled FUND (O-6(a)) | ✅ **holds.** Must be proven on `tickScanBudget`'s own fixture BEFORE the flag enters any preset |
| **LGT-P12-PRELOAD** | the `__vite__mapDeps` preload cure | chair | **NO** | nothing to build; re-measure the engine first | ⚠ **AMENDED — largely MOOT.** §889.3 measured the dial's residual at **ZERO** (three builds, engine 675,764 B, identical content hash). The cure is a nice-to-have, not a gate |
| **LGT-P13-FENCES** | per-key dormancy fences, 12 keys | chair | **NO** | follows L-MANIFEST; precedes those 12 flips | ✅ **holds** (CH-10) |
| **LGT-P14-WITNESS** | the per-preset NEW-CAMPAIGN witness | chair | **NO** — `presetLightingWitness` = **0 files** | LGT-P1-BIRTH | ✅ **holds** — plus ⛔ **A NEW OBLIGATION: the golden-freeze register row** (§4 decay 14) |
| **LGT-P15-EP1** | corpus RE-KEY + "the wave's ONE schema-16 migration" | chair | **NO** — the EP-1 hold is live at `scripts/lib/observed-shape-corpus.mjs:752` | CH-1 fork (b); runs at the END of L-DEFAULT | ⛔ **RE-CUT — see §5.** The name bundles two acts of different size; the rung number is **spent**; the detector crossing belongs to only one half |
| **LGT-P16-FAITHFIX** | the O-17 boon/bane preview fixture | chair | **PARTIAL** — `faithTuningSurface.js:125` = `{ signed: false, live: true }`; law half in, fixture out | nothing | ✅ **holds — nothing.** Landable now |

### 1.2 The six wave cars

| id | what | **state @ `272dbd2da`** | blocked_by AS RE-DERIVED |
|---|---|---|---|
| **LGT-C0-PROBE** | L-PROBE, the DARK-ARM battery, 0 bytes | **NO** | ⛔ **DECAYED.** Recorded as *"HORIZON-DARK landed (still outstanding)"* — HORIZON-DARK gates the wave in **exactly three named places** (§6), none of them this probe. **Runnable now.** Its class-C listing diff needs a build ⇒ a chair act |
| **LGT-C2-DEFAULT** | L-DEFAULT, six hunks | **NO** | ✅ P1-BIRTH + P2-MANIFEST; espionage sub-step needs P6; **`demographicsEnabled` STOPs on HORIZON-DARK B6** |
| **LGT-C3-MAT** | the dial + three persistence paths | **NO** — `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION = DEFAULT_LIVING_CONTENT_LAW_VERSION` (`src/domain/content/livingContentLaw.js:94`, dormant) | ⛔ **DECAYED.** O-11 is **SIGNED** (§882.13 verbatim). **L-MAT is a WHOLE car**, not wiring-only |
| **LGT-C3B-DOORS** | charset wall + worker default | **NO** — `enforcement: "report"` (`schema/custom-content.manifest.json:31`); `generationWorker` **0 hits** | ✅ **both halves hold.** (i) ← HORIZON-DARK B1 · (ii) ← HORIZON-DARK B2. **Both become named residues** |
| **LGT-C4-UI** | three product-flag flips | **NO** — `mobileSingleChrome:false` `:78`, `handbookVoice:false` `:86`, `warEconomySurfacing:false` `:87` | ✅ **nothing.** O-13 ruled. ⚠ **I DISPUTE the docket's `landed: PARTIAL`** — the PARTIAL refers to `founderRecognition:true` (`:74`, O-16), which is **not one of this car's three**. All three of this car's flags are dark. **The car is NO** |
| **LGT-C5-PROBE2** | L-PROBE-2, the LIT-ARM battery, 0 bytes | **NO** | ✅ holds — every build car composed into one tip |

### 1.3 The register acts, the prose car, the six owner rows

| id | **state @ `272dbd2da`** | blocked_by AS RE-DERIVED |
|---|---|---|
| **LGT-REG-DECL** (11 declarations) | **NO** | ⛔ **THE RECORDED FACT IS FALSE NOW.** Docket: *"`goldenRecordDoor.js` and `.golden-freeze-register.json` are ABSENT"* — **all three artifacts are PRESENT** (§4 decay 14). The **conclusion** survives: the register is still **UNFROZEN** (`frozenAt` null) and `goldenFreeze.walker.test.js:358`/`:853` red on any value recorded pre-freeze, so `docs/GOLDEN_SHIFT_LEDGER.md` remains the wave's form |
| **LGT-REG-CENSUS** | **NO** | ⛔ **every register figure in the docket is stale** (it quotes `ca651d54b`). Current tuple in §8. ⭐ The lighting census is **GREEN at this tip** — live probe == frozen exactly |
| **LGT-PROSE** | **NO** — sealed at `8f4d5c648`, unrebased | ⛔ **THE 13TH DECAY (§3).** Overlap is **8 of 200**, not 2 |
| **LGT-O5** | **RULED — BUILD** | ⛔ phantom. §882.13, THE NINETEEN RULED |
| **LGT-O11** | **RULED — SIGN** | ⛔ phantom. §882.13, verbatim, before "⛔ THE FIVE HELD" |
| **LGT-O14** | **RULED — STAYS AS DESIGNED** | ⛔ phantom. §882.13 |
| **LGT-O10B** | **CLOSED & MOOT** | §889.3: *"NO RAISE REACHED, RESIDUAL MEASURED AT ZERO"* |
| **LGT-O-CLOSURE** | **OPEN, conditional** | ✅ holds — conditional on L-PROBE's class-C listing diff, a measurement not yet taken. Chair-takeable under §893's amendment (ceiling raises by exactly the measured residual are ✅ TAKEN) |
| **LGT-CAP10** | **OPEN by nature** | ✅ holds — tuning VALUES, signed LAST, after the soak. Chair-*declined*, not gated |

### 1.4 The count

**0 DONE · 2 PARTIAL (P3-CAPSIG, P16-FAITHFIX) · 1 CLOSED (O10B) · 3 RULED-not-blocked (O5, O11, O14) · 25 open.**
⚠ Against SCOPE-MEASURE's "0 done · 4 partial · 27 open" the only difference is **C4-UI**, which I re-class from
PARTIAL to **NO** with the probe above. **Of the docket's six owner rows, ZERO still gate the wave.**

### 1.5 The double-count rule, applied (§6.1)

`LGT-P9-CS9` **≡** HORIZON-DARK **B1** · `LGT-P3-CAPSIG` **≡** HORIZON-DARK **B6**.
⇒ **lighting 31 + HORIZON-DARK 6 is at most 35 distinct items, never 37.** Both duplicates are high-risk cars; a plan
that adds the dockets over-books exactly the two things it can least afford to over-book.

---

## 2 · THE TWELVE RECORDED DECAYS — CONFIRMED, DISPUTED, OR OUT OF SCOPE

| # | the chair's verdict | **my verdict** | what I executed |
|---|---|---|---|
| **D-1** | census "FULL at 10/10" is DECAYED | ✅ **CONFIRMED** | `entries` = **6** at `90702c3e9` AND at `272dbd2da`; `CEILING = 17` (`testRatchet.test.js:182`, asserted `:268`). The 10 → 6 fall retired the **`warCostKindPools`/`warRulingKindPools`** rows, not the voice rows |
| **D-2** | the "new test file reds three censuses" MECHANISM is refuted | ⚠ **CONFIRMED IN PART — and I sharpen it** | `SCOPE_FLOOR_RATIO = 0.9` (`check-test-ratchet.mjs:97`), applied as `Math.floor(frozen × 0.9)` at `:1118`/`:1138`. **CONFIRMED: `totalTests`/`totalFiles` are 90 % COLLAPSE FLOORS and a new test file cannot breach them.** ⛔ **But "reds three censuses" is not thereby empty** — see §2.1 |
| **D-3** | the witness→prose ordering argument falls | ✅ **CONFIRMED, with a caveat that matters** | The *scarcity* premise is dead. ⚠ **All 4 `voiceMechanics` rows are STILL banked at `272dbd2da`** — so the prose car remains the only identified road to retiring them. The conclusion (prose first) survives; **the recorded argument for it does not** |
| **D-4** | O-11 phantom | ✅ **CONFIRMED** | ledger 32362 verbatim, quoted in receipt §R2 |
| **D-5** | O-5 phantom | ✅ **CONFIRMED** | same line, verbatim |
| **D-6** | O-14 phantom | ✅ **CONFIRMED** | same line, verbatim; **and O-14 is absent from "⛔ THE FIVE HELD"**, which I enumerated: ENCOUNTERS 7 · O-12 · O-17 · O-16 · O-10(b) |
| **D-7** | O-10(b) closed and moot | ✅ **CONFIRMED** | §889.3 (32405) verbatim |
| **D-8** | W-ARMS H1 refuted | ⊘ **OUT OF THIS WAVE'S SCOPE** — W-ARMS is not among the 31. Not re-derived; I decline to inherit it |
| **D-9** | W-ARMS H5 refuted | ⊘ same |
| **D-10** | W-ARMS B1 rescue discharged | ⊘ same |
| **D-11** | UB-5 first-paint refuted | ⊘ out of scope, **but its warning binds me**: ⛔ **no closure figure in any record is quotable tonight** — every one needs a build |
| **D-12** | `{complexity}` re-classed to a content car | ◐ **PARTIALLY RE-DERIVED.** The landed pin survives — `tests/domain/economyStateProseDesk.test.js:359–360`: `expect(refused.length).toBe(COMPLEXITY_VALUES.length); expect(COMPLEXITY_VALUES.length).toBe(11);` (recorded as `:358`; one line of drift). I did **not** re-run the 24-seed both-arms drive — that needs the desk. **The re-class stands as PLAUSIBLE, well-evidenced; it gates none of the 31 either way** |

### 2.1 ⚠ MY ONE DISPUTE WITH THE CHAIR'S D-2 — the brief asked me to name the three censuses, and the answer is now FOUR

D-2 is right that a new test file **consumes no known-failure slot** and **breaches no ratchet floor**. It does not follow
that a new test file is free. Re-derived at `272dbd2da`, a new test file owes:

1. **The lighting census** — `files`, `titles`, `suiteTitles` are compared **exactly** (`CENSUS_FIGURE_KEYS`,
   `sovereigntyLightingContract.walker.test.js:548`, moved-key report at `:752`). **A refreeze is owed, not optional.**
2. **The test-ratchet totals** — `totalTests`/`totalFiles` go stale. A **refreeze**, never a breach (D-2's point).
3. **The known-failure census's file list** — owed **only if the new file fails**. At 6/17 there is room; but
   `check-test-ratchet.mjs:50` — *"A NEW REGRESSION IS NEVER BASELINED; `--update` can only REMOVE entries"* — so the
   right reading is **not** "11 slots free" but "**every wave car lands green or does not land**".
4. ⛔ **NEW, AND IN NO SURVIVOR: the GOLDEN FREEZE REGISTER.** `goldenFreeze.walker.test.js:418` — *"every
   golden-adjacent env spelling in tests is enrolled or written-excluded … Silence is not a disposition."* The walker
   enumerates **by AST pattern over parsed source**, so a capture arm under a novel spelling cannot hide, and `:228`
   makes the roster **grow-only between refreezes**.

⇒ **`LGT-P14-WITNESS` — a new test file that mints a 52-tick same-seed hash per preset — is the one car in the wave that
owes all four.** The docket priced it at "≈0.5 Opus car + three censuses". **It is now four, and the fourth did not
exist when that was written.**

---

## 3 · ⛔ THE 13TH DECAY — THE PROSE CAR'S REBASE HAS QUADRUPLED (CONFIRMED)

S-6 refused to re-run this and correctly told the next lane to treat "2 of 200" as **EXPIRED, not small**. Executed here:

```
merge-base(8f4d5c648, 272dbd2da) = 30c1667bc     (unchanged — the prose car itself never moved)
prose span  30c1667bc..8f4d5c648 = 200 files, 1084 insertions(+), 1019 deletions(-)
mainline    30c1667bc..272dbd2da = 231 files, 26267 insertions(+), 6345 deletions(-)
OVERLAPPING PATHS                = 8            (LIGHTINGSCOPE measured 2 at c2f80ffc9)
```

| overlapping path | prose side | mainline side |
|---|---|---|
| `docs/content/RECEIPT_POOLS_LEGACY.md` | +1/−1 | **+81/−35** |
| `src/domain/display/defenseDisplay.js` | +4/−4 | +4/−16 |
| `src/domain/display/dossierViewModel.js` | +5/−5 | +15/−7 |
| `src/domain/display/settlementRumors.js` | +1/−1 | **+33/−16** |
| `src/domain/region/propagation.js` | +1/−1 | +7/−2 |
| `src/domain/rulingPowerCoup.js` | +2/−2 | **+47/−0** |
| `src/domain/worldPulse/npcLadderKernel.js` | +6/−6 | +6/−5 |
| `src/domain/worldPulse/warReceiptPools.js` | +5/−5 | **+13/−0** |

**Reading it honestly.** Every prose-side edit is still a one- to six-line sentence cure, so the absolute cost is still
**small**. What has changed is the **derivative**: 2 → 8 across six landings, with the merge-base fixed. Nothing about the
wave makes this stop; every future landing adds to it.

⭐ **And the prose car is not a display car.** Of its 200 paths, **179 are `src/`**, and **113 of those are `src/domain/`
outside `display/`** — `warReceiptPools.js`, `npcLadderKernel.js`, `rulingPowerCoup.js`, `region/propagation.js` are
engine modules that emit text. ⇒ **the prose car moves same-seed emitted text**, which has an ordering consequence in §6.

---

## 4 · ⛔⛔ THE 14TH DECAY — THE GOLDEN FREEZE MACHINERY HAS LANDED

Every survivor says these are absent. **They are present.** Measured across four tips:

| sha | `docs/GOLDEN_SHIFT_LEDGER.md` | `tests/helpers/goldenRecordDoor.js` | `tests/fixtures/.golden-freeze-register.json` | `docs/shift-records/` |
|---|---|---|---|---|
| `ca651d54b` | yes | **no** | **no** | **0 files** |
| `c2f80ffc9` | yes | **no** | **no** | **0 files** |
| `90702c3e9` | yes | **YES** | **YES** | **2 files** |
| `272dbd2da` | yes | **YES** | **YES** | **2 files** |

**What is now true, quoted from the register's own `_doc`:**
> "⛔ THIS REGISTER IS UNFROZEN. `frozenAt` is null … What exists today is the MACHINERY … What does NOT exist today is
> the RECORD: every `sha256`, `rows`, `seedSet`, `distinctFloor`, `frozenConstants` and `ownerRow` is null and MUST stay
> null until the freeze act writes it through the door."

And from the walker (`tests/lint/goldenFreeze.walker.test.js:39–47`):
> "⛔ THE REGISTER IS UNFROZEN TODAY, AND THIS WALKER IS GREEN AGAINST IT ON PURPOSE … Everything structural (the roster
> closure, the exclusion roster, the constant census, the door-import closure, the sentinel floor, the schema, the
> tri-state closure) is LIVE TODAY and does real work on every gate run before the freeze ever happens."

**⇒ The two halves of the record must be separated, and a build lane must be told both:**
- ⛔ **The FACT is dead.** "the door verb does not exist" is false; the machinery is in the tree and walks every gate.
- ✅ **The CONCLUSION survives.** The register is unfrozen, `:358` asserts no row carries a recorded value and `:853`
  reds "a bit hash was recorded before the freeze act signed for it". **The wave still cannot use the door.**
  `docs/GOLDEN_SHIFT_LEDGER.md` + the ledger §-row remains the form for the eleven declarations.
- ⛔ **The NEW cost:** any wave car adding a test file that reads a golden-adjacent env spelling must, **in the same
  commit**, enroll it in `.golden-freeze-register.json` or write its exclusion. **This is `LGT-P14-WITNESS`.**

---

## 5 · THE OSR CORRECTION — AND THE QUESTION THE BRIEF ASKED

### 5.1 The rung

**Do not name a rung number for this wave. Write "the next free rung after 17."**

Derivation, one line: read `schema` in `scripts/.observed-shape-readers-baseline.json` **at the boarding base** and take
the next unclaimed integer above it.

- At `272dbd2da`: `schema` = **16**, `frozenAtSha c08df7d59`, and `BASELINE_SCHEMA = 16`
  (`scripts/lib/observed-shape-baseline.mjs:268`). They agree ⇒ **no migration is currently pending.**
- **Rung 16 is SPENT** — §893.2: *"The OSR rung 15 → 16 was **MINTED**, not absorbed."* The charter's CH-8 *"ONE
  schema-16 OSR migration"* names a rung that no longer belongs to this wave.
- **Rung 17 is CLAIMED** by the OSR-SCHEMA17 lane. ⇒ the wave takes **the next free rung after 17**.

⚠ **A TRAP a build lane will otherwise walk into.** `scripts/lib/observed-shape-baseline.mjs:259` declares
`RETIRED_PRESET_LIGHT_BASELINE_SCHEMA = 14`. **That is not this wave's migration.** Its own docblock says schema 14 is a
governance re-definition that, "like 13 and 14, **moves no row at all**". A lane that greps for a preset-lighting schema
will find rung 14 and wrongly conclude the migration already landed.

### 5.2 Does the wave owe a migration AT ALL? — **YES. Measured, not argued.**

The corpus builder lights **every flag it discovers**, at `true`
(`scripts/lib/observed-shape-corpus.mjs:750–751`: `const flags = discoverSimulationFlags(...); const simulationRules =
Object.fromEntries(flags.map((f) => [f, true]));`). So what moves the corpus is **which flags are DISCOVERABLE**, not
which presets are lit — and discovery is a regex for `<x>Enabled` **assigned `true`/`false` in a `src/domain/**/*.js`
file** (`:87–95`).

I ran that function's verbatim body over the 1,012 `src/domain/**/*.js` files at `272dbd2da`:

```
DISCOVERED FLAGS                     = 80
ENGINE_GATED_VIRTUAL_RULE_KEYS = 30  →  21 NOT discovered
BACKLOG_RULE_KEYS              = 17  →   4 NOT discovered
                                        ─────────────────
                                        25   newly discoverable
```

⭐ **This is exactly the docket's "21 class F + 4 class G", which every prior document carried as INHERITED ⟦A5·B9⟧ and
explicitly declined to re-derive. It is now CONFIRMED at the freshest tree.**

⇒ Writing `<x>Enabled: true` into the preset tables in `src/domain/worldPulse/simulationRules.js` makes 25 keys
discoverable; the corpus then lights all 25; observed shapes grow. **Growth on the OSR goes through the governed
migration** — `--write` may only shrink (`check-observed-shape-readers.mjs:2002–2016`), and `--update` is FORBIDDEN.

### 5.3 ⛔ `LGT-P15-EP1` BUNDLES TWO ACTS, AND ONLY ONE CROSSES THE DETECTOR

The docket says the item *"edits a DETECTOR SOURCE (`observed-shape-corpus.mjs:775`; `scannerToolFiles()` :190–204), so
it is a CAR, never a row."* Re-derived, that is true of **only one half**, and the citation itself has drifted (the file
is now `scripts/lib/observed-shape-corpus.mjs` and the block is at **`:752`**, not `:775`).

| act | what it is | crosses `isDetectorSourcePath`? | cost |
|---|---|---|---|
| **(a) the 25-key re-key** | lighting 25 keys in `src/domain/worldPulse/simulationRules.js` | **NO** — that file is a subject-tree **INPUT**, not a scanner tool | the governed migration for corpus growth |
| **(b) the EP-1 release** | setting `simulationRules.advanceEpochEnabled = false` → `true` at `observed-shape-corpus.mjs:772` | **YES** — `scripts/lib/observed-shape-corpus.mjs` **is** in `scannerToolFiles()` (`check-observed-shape-readers.mjs:190–204`), so `isDetectorSourcePath` returns true | ⛔ **very large** |

**The EP-1 block's own words on (b), quoted:**
> "`advanceEpochEnabled` gates none. It appends a nonce segment to the pulse ROOT SEED, so lighting it re-rolls the
> entire corpus … while contributing exactly ONE new observed key … **MEASURED, not argued: threading a pinned epoch
> here reds NINE exact-totality assertions across four contract walkers** … a full re-record of four reference artefacts
> bought for one scalar key — and re-rolling a fixed reference world silently is precisely what THE PROMISE forbids."

⭐ **And (b) is NOT required by (a).** `advanceEpochEnabled` is already discovered (it is not among the 21) and the corpus
**hard-overrides it to `false` at `:772` after building from the discovered flags** — so lighting it in the preset table
moves the corpus not one row. **CONFIRMED both directions by reading the builder.**

⇒ **RECOMMENDATION TO THE CHAIR (a ruling, not mine to take): re-cut `LGT-P15-EP1` into two items.** The wave owes (a).
It should **not** take (b) unless the chair rules the four re-records are worth one scalar key — and the block itself
says when that is right: *"When a wave genuinely needs the lit shape, it lands the epoch WITH the four re-records as a
declared shift, in a commit that says so."*

### 5.4 The probe a build lane must run FIRST

Undeterminable without writing the lighting code: **how many observed shapes cross `MIN_ROWS = 40`.**
`minRows: 40` CONFIRMED in the baseline at `272dbd2da`; the standing hazard is that a crossing detonates the ratchet
(188 growth rows from one key at §875). The order is fixed and it is not negotiable:

> **Dump the per-parent presence (`schemaKeys`/`keys` + `corpus.shapes.*.rows`) in L-PROBE, BEFORE any regeneration;
> attribute every crossing key-by-key; only then touch the baseline.** This is `LGT-C0-PROBE`'s OSR arm, and it is the
> reason L-PROBE must precede L-DEFAULT rather than merely accompany it.

---

## 6 · THE ORDER, WITH THE REASON FOR EVERY POSITION

**Laws applied:** registers are the LAST cars before the gate, in the lineage that lands · lanes take **no** register
act (the chair takes every one at the landing) · nothing is declared by hand — the eleven declarations are written FROM
L-PROBE-2's outputs · a car that changes same-seed output is **recorded** as a behaviour shift, never absorbed.

### POSITION 0 — **PROSE**, its own consist, FIRST. Rebase, then land.
**Why first — and the reason is NOT the one on the record.** The recorded argument (a full 10/10 census; the prose
refreeze is the only road to slots) is **dead**: the census is 6 of 17. Prose still goes first, on three measured
grounds the record does not make:
1. ⛔ **It is the only cost in the arc that is measurably GROWING** — 2 → 8 overlapping paths in six landings (§3),
   merge-base fixed. Every landing this car waits behind makes it dearer. Nothing else here decays this way.
2. **The voice baseline is shrink-only and already REFUSES a raise, and the wave is a string-adding wave.** L-HOMES adds
   the Remembrance reader's Herald strings, four W-OPS rows and the espionage wiring car's news lines. Landing those
   against a baseline that already refuses guarantees a refused register act at the L-HOMES landing.
3. ⭐ **It contaminates the control if it lands later.** 113 of its 200 paths are `src/domain/` **outside** `display/` —
   engine modules that emit text. If L-PROBE's dark arm is measured before prose lands, prose's own text movement is
   later mis-attributed to lighting. **Prose → probe, never probe → prose.** This inverts `wave-plan.md`'s Consist 0/1
   order, which put L-PROBE first, and it is my judgment call, vetoable by name.
**Cars:** 1 (the rebase, 8 conflicting paths, all one- to six-line sentence cures). **New test files:** none — it extends
the 8 files / 11 assertions of the driven-corpus constant re-record it already owes.
**Same-seed shift:** ⚠ **YES, on emitted text.** Declared.
**Registers (chair, at the landing):** voice baseline (`UPDATE_VOICE_BASELINE=1`, expected to bank a **FALL**) ·
writer-reach (`--write`, plain — **never `--genesis`**) · the test ratchet · the `tests/lint/` scanner family (83 walkers).
**DECLARED-SHIFT sentence it owes LGT-REG-DECL:** *"1,001 reader sentences across 200 paths were cured; emitted text
moves on N engine-side paths; no rules value, no preset and no flag moved."*

### POSITION 1 — **L-PROBE (`LGT-C0-PROBE`)**, the DARK ARM. Zero bytes, zero commits, a chair/Fable act.
**Why here:** it is the only control the eleven declarations may quote, and it must be measured on the tree the wave
will actually light from — i.e. **after** prose. Its recorded blocker (*"HORIZON-DARK landed"*) is **DECAYED**:
HORIZON-DARK gates the wave in exactly three named places and none of them is this probe.
**Must produce, before anything lights:** the `generatorGoldenMaster` 3/3 + 0/525 control · a certification receipt per
preset · the OSR **per-parent presence dump** (§5.4 — the `MIN_ROWS=40` cause read, dumped **before** any regeneration) ·
the lighting-census tuple · the stability rosters · **a REAL-birth new-campaign fixture per preset** (through
`createCampaign` → `buildNewCampaign`/`createImportedCampaign`, **never** through `SIMULATION_RULE_PRESETS[id].rules`) ·
the 52-tick pulse hashes · ⭐ **the class-C hashed-chunk LISTING diff**.
**STOP:** the preset catalog measures eager, **or** any listing diff exceeds `(margin − 100 B)` ⇒ the wave halts and
`LGT-O-CLOSURE`'s two-option re-ask goes to the desk **with figures**. ⛔ The listing diff needs a **build** — a chair
act, not a lane's.
**Registers:** none. Zero commits ⇒ zero register movement. Derivable and stated.

### POSITION 2 — **L-HOMES**, the dark-inert builds. The biggest build consist, one gate.
Cars in dependency order, the two structural ones first:

| # | car | files it touches | invariant it preserves | new test file? | same-seed shift |
|---|---|---|---|---|---|
| 1 | **P1-BIRTH** | `buildNewCampaign`, `campaignImportedCreation`, `createDefaultWorldState`, a sibling pin beside `simulationRules.js:136–145` | ⛔ **`ensureWorldState` keeps plain `normalize()`** — an INSTALLED campaign must never acquire virtual keys at its next load. `:59` and `:136–145` stay UNEDITED | no — extends `simulationRulesPreset.stability.test.js` | **no as landed** (the lit successor id does not exist until L-DEFAULT hunk 2) |
| 2 | **P2-MANIFEST** | `tradeConvergenceContract.walker:478–489`, `sovereigntyLightingContract.walker:1690–1692`, five fences' virtuality arms, OSR clause 3, `contributionLedgerShape:90` | ⛔ **a key may be LIT without being DELETED from the register** — the two lighting contracts INVERT the moment a class-F key lights without this split | no | no |
| 3 | **P13-FENCES** | the five existing `*DormancyFence` files, 12 keys | ⛔ **the dark claim must be provable AFTER lighting** — a dark half + a lit-mutant control per key, or lighting destroys the only state in which darkness was ever exercised | ⚠ **only if a key needs its own file — each such file pays all four censuses of §2.1 and must be named in the brief** | no |
| 4 | **P5-WOPS** | 4 mints on the CR-WR10-C shape; rows go to `subsystemRowsOps.js` | ⛔ **`subsystemRowsVirtual.js` is at its 800-line `sizeBaseline` ceiling** — rows must go to `subsystemRowsOps.js`, character to `subsystemRowsLives.js` | no | no (dark-inert) |
| 5 | **P6-ESPWIRE** | espionage → Herald/news seam | ⛔ **NEWS ADDRESS LAW**: a lit mechanism with no backing news is convicted by `narrativeParity.test.js`'s CLAIMS-PARITY arm. **Must precede the espionage flip** | no | no (dark-inert) |
| 6 | **P4-READER** | the Remembrance reader, RR-2 (O-5 **RULED BUILD**) | LAZY, `PROSE_RENDER` only (CH-9) | ⛔ **yes — the one place a new UI test file is justified; it pays all four censuses by name** | no (dark-inert) |
| 7 | **P7-DRIFTDOOR** | manifest + `subsystemRowsLives.js` row + fence | ⚠ **shared with ENCOUNTERS by the amended O-9 — whichever train lands first OWNS the door car, the other CONSUMES it. CHECK ENC-3 BEFORE BUILDING** | no | no |
| 8 | **P8-MATBOUND** | the create boundary | ⛔ **THE PROMISE**: the generate action is both birth and regen today. A boundary that treats regen as birth **restamps lived worlds** | no | no |
| 9 | **P14-WITNESS** | `tests/simulation/presetLightingWitness.test.js` + `tests/fixtures/preset-lighting-witness.json` | ⛔ **fixtures born through the REAL birth path** or they measure a world no customer receives | ⛔ **YES, deliberately — the wave's ONLY bit witness.** Pays: lighting census · ratchet totals · known-failure file list · ⭐ **the golden-freeze register row or written exclusion (§4)** | no (a test) |

**STOP for the consist:** any listing diff exceeding `(margin − 100 B)`; the reader and the wiring car land in
first-paint UI/display files. **Engine cost predicted 0 B** — `src/generators` imports zero
`worldPulse`/`display`/`espionage` modules — **PLAUSIBLE; the listing diff is the proof, not this sentence.**
**Registers (chair):** lighting census · test ratchet · voice magnitudes · `sizeBaseline` · the four censuses per new
`src/domain` leaf · the 83-member `tests/lint/` scanner family · ⭐ **the golden-freeze register**.

### POSITION 3 — **L-DEFAULT (`LGT-C2-DEFAULT`)**, the preset table. One commit series, six hunks. The centre of mass.
Order within the series, unchanged from the survivor and re-verified against the tree:
1. class C + D into the lit default (`...WAVES`, `...ONE_REGEN`, `disasters`, `commodityFlow`, `allyIntelSharing`),
   with the stale `:527–529` comment repaired **line-count-neutral in the same hunk**.
2. **O-1 in the BIRTH form** — `NEW_CAMPAIGN_SIMULATION_PRESET_ID`, a lit successor id **after** the legacy trio in key
   order. `:6`, `:38`, `:632`, `:59`, `:136–145` UNTOUCHED.
3. class B into the lit **SUCCESSORS**, ⛔ **never onto a legacy id** — the §890 O-12 block in the tree states the
   reason: lighting on a legacy id makes `rulesMatchPreset` miss, `presetIdForRules` fall through to `'custom'`, and
   **every installed Dramatic Campaign silently re-label itself at its next `ensureWorldState` with no receipt minted.**
4. **O-2** `infoMode: 'perfect_delayed'` on the lit default and dramatic's successor. ⚠ every belief-conjoined record
   carries a **PREMIUM** sentence (`campaignWorldPulseSlice.js:391` refuses canonize to a non-premium tier).
5. class E `false → true`. ⛔ **`demographicsEnabled` STOPs on HORIZON-DARK B6** — CONFIRMED `{signed:false, lit:null}`.
6. classes F and G in dependency order across every lit preset. ⛔ F requires car 2; espionage requires car 5;
   `neutralNeighbors` requires P11 proven on `tickScanBudget`'s own fixture first.
7. **`LGT-P15-EP1` half (a) only** — the 25-key re-key through the governed migration at **the next free rung after 17**,
   at the END, after the presence dump is attributed key-by-key. ⛔ **Half (b), the EP-1 `advanceEpochEnabled` release,
   does NOT ride this car** (§5.3) — it is a separate chair decision costing four reference-artefact re-records.

**New test files:** none — it extends `simulationRulesPreset.stability.test.js` (rosters `:163`/`:306`/`:366`),
`moverCompositionSmoke`, `emergentArcSoak`, `narrativeParity`, `discourseParity`, `soakScriptSeams`,
`engineGatedRuleKeys.walker`.
⛔ **`narrativeParity`, `discourseParity`, `emergentArcSoak`, `moverCompositionSmoke` run LIVE on `full_simulation` — a
red in these four is a FINDING, reported, never re-recorded.**
**Same-seed shift:** ⛔ **YES — the largest in the wave.** Every lit preset's 52-tick hash **must move**; an UNMOVED
preset hash is a **FINDING**. ⚠ an unmoved **KEY** is read from the certification grade table only, **never inferred
from a hash**. Predicted: every pulse HASH golden moves **0 rows** (they drive LITERAL rules objects) and
`generatorGoldenMaster` moves **0/525 on both arms** — **a move on either is a STOP.** This blindness is precisely why
P14 exists.
**DECLARED-SHIFT sentences it owes:** causes (i) world-alive stack · (ii) war/faith/seasons · (iii) belief stack wakes ·
(iv) the ceiling's eleven · (v) the 29→30 manifest keys + the manifest split · (vi) the backlog seventeen · (xi) the
shipped default mints epochs.

### POSITION 4 — **L-UI + L-MAT + the L-DOORS residues**, the small flips. One gate.
| car | state | note |
|---|---|---|
| **L-UI** (`C4-UI`) | **READY NOW** — O-13 ruled, all three flags dark | 3 boolean flips; `dossierFiveTabs`-class snapshots re-record as **declared display shifts**. **Same-seed shift: display only.** ⚠ It could be pulled forward for an early cheap win — **at the price of re-running L-PROBE's UI arm**, since it contaminates the control exactly as prose does |
| **L-MAT** (`C3-MAT`) | **READY — a WHOLE car** (O-11 **SIGNED**) | dial + `P8-MATBOUND` + **the three persistence paths in the SAME car, never optional**. `P12-PRELOAD` is largely moot (residual 0). ⛔ **STOP: `_livingContentLawVersion` stamped on an EXISTING world at regen is a PROMISE breach.** **Same-seed shift: freshly created worlds ONLY** |
| **L-DOORS (i)** | ⛔ **BLOCKED → RESIDUE** | needs HORIZON-DARK **B1** (CHARSET Car 2 / CS-9's plant). CONFIRMED: `charsetPolicy` 0 hits in `src`, `enforcement: "report"` |
| **L-DOORS (ii)** | ⛔ **BLOCKED → RESIDUE** | needs HORIZON-DARK **B2** (WORKER Car 1). CONFIRMED: `generationWorker` **0 hits** — there is nothing to flip |

### POSITION 5 — **L-PROBE-2 + the ELEVEN DECLARATIONS + the register acts.** The landing. Chair only.
The lit-arm battery re-run at the composed tip (zero bytes), then the register series **in this order**:
lighting-census refreeze → the OSR migration → the treasury `VIRTUAL_DORMANT_WRITERS` shrink (`--write`) → the test
ratchet `--update` under the exclusive mutex.
⛔ **Nothing is written by hand; the eleven declarations are written FROM the battery's outputs.**
⛔ **The composed register tuple is REFUSED in advance** — the sum of independently-measured deltas is **not** the
composed delta (§891 register 1/2: four lanes summed +75 titles, the composed tree measured +78). **Predict per file,
from title counts, at the composed tip, immediately before the refreeze — never from raw diff lines.**

### IN PARALLEL, FROM DAY ONE — **SEAT-7/8 (`LGT-P10`)** on its own consist.
≈4 cars, 2–3 days, chair-ruled FUND under O-4, **0 files at the tip**, shares no file with the wave. ⭐ **It is the arc's
longest pole. Sequenced rather than parallelised, it — not the wave — sets the freeze date.**

### The one-line order
**PROSE → L-PROBE → L-HOMES → L-DEFAULT → (L-UI + L-MAT + the two door residues) → L-PROBE-2 + the eleven declarations
+ the registers**, with **SEAT-7/8 running beside all of it from day one**.

---

## 7 · THE RESIDUE — WHAT LANDS WITH B1 / B2 / B6 STILL OPEN

| open HORIZON-DARK item | what the wave loses | the NAMED residue it leaves |
|---|---|---|
| **B1** — CHARSET Car 2 / CS-9's plant | `L-DOORS (i)` | **`L-DOORS (i)`** — the custom-content authoring wall ships at `enforcement: "report"`. **The exhaustive review will read a wall that is switched off.** ⚠ CS-9's own owner-gating is **probably decayed**: §893's amendment leaves **exactly two** gated acts (every `git push`/deploy, and the owner's WALK) and lists **persisted shapes** under ✅ TAKEN; CS-9 is neither. ⛔ **I do not rule this — reported for the chair, one sentence settles it, and it unblocks a whole car** |
| **B2** — WORKER Car 1 | `L-DOORS (ii)` | **`L-DOORS (ii)`** — generation stays on the main thread by default. Hard-blocked: the registry entry does not exist, so there is literally nothing to flip |
| **B6** — the three CAPACITY evidence measurements (≈2.3 h plateau receipt is the long pole) | one class-E key inside L-DEFAULT hunk 5 | **`demographicsEnabled`** — one flag stays dark inside an otherwise-lit default, with `DEMOGRAPHIC_TUNING_SIGNATURE = {signed:false, lit:null}` as its receipt |

**The wave lands with all three open.** None of them blocks L-PROBE, L-HOMES, the other five hunks of L-DEFAULT, L-UI,
L-MAT, the declarations or the registers. **HORIZON-DARK B5 (TUNEREG Car 4) gates nothing at all** — and note it is
`LGT-P3-CAPSIG`'s recorded blocker, which is why that row is amended in §1.1: the real gate is **B6**, not B5.

---

## 8 · THE RECONSTRUCTED §8 — THE INSTRUMENT-AND-STOP TABLE

⚠⚠ **LABEL: RECONSTRUCTED.** The original §8 died with `LIGHTING-INVENTORY.md` and **is not recoverable from any
survivor** — the ledger row names that it existed; it does not reproduce it. Rows marked **[Q]** quote a survivor or the
tree verbatim; rows marked **[I]** are inferred by this lane from the instrument's own source and are labelled so.

| instrument | register / home | measuring act | **STOP** |
|---|---|---|---|
| **Lighting census** | `tests/lint/.lighting-census-baseline.json`; walker `tests/lint/sovereigntyLightingContract.walker.test.js` | `LIGHTING_CENSUS_REFREEZE='<lane or seat id>' LIGHTING_CENSUS_NOTE='<why it moved>' npx vitest run <walker>` **[Q, `:686`]** | **[Q]** the refreeze **exits non-zero BY DESIGN**; *"re-run this walker without `LIGHTING_CENSUS_REFREEZE`, and THAT green is the proof"* (`:757`). Blank provenance REDS (`:700`). ⛔ `parked + credited !== files` is incoherence, not drift (`:733`). ⚠ **the walker asserts `titles` first and throws — predict BOTH `titles` and `suiteTitles` or the second is invisible** |
| **Test-ratchet totals** | `scripts/.test-ratchet-baseline.json`; `npm run test:ratchet` (wrapped in `scripts/gate-mutex.sh`) | `test:ratchet:update` **[Q]** | **[Q]** `SCOPE_FLOOR_RATIO = 0.9` (`:97`) — `totalTests`/`totalFiles` are **90 % COLLAPSE FLOORS** (`:1118`, `:1138`), red only on collapse. ⛔ **mutex give-up exit 3 is NOT-RUN, never green** |
| **Known-failure census** | `entries` in the same file; `CEILING = 17` (`testRatchet.test.js:182`, asserted `:268`) | `--update` **[Q]** | **[Q]** *"A NEW REGRESSION IS NEVER BASELINED; `--update` can only REMOVE entries"* (`check-test-ratchet.mjs:50`). ⇒ **17 is a structural cap on rows, not a budget of permitted reds. Every wave car lands green or does not land** |
| ⭐ **GOLDEN freeze register** *(absent from every survivor — §4)* | `tests/fixtures/.golden-freeze-register.json`; walker `tests/lint/goldenFreeze.walker.test.js`; door `tests/helpers/goldenRecordDoor.js`; records `docs/shift-records/` | the door, **and nowhere else**, with `GOLDEN_SHIFT_SIGNED` naming a signed record file whose CONTENT is parsed **[Q]** | **[Q]** the register is **UNFROZEN**; every measured field is null and **MUST stay null** until the freeze act. `:358` no row carries a recorded value · `:853` reds *"a bit hash was recorded before the freeze act signed for it"* · `:418` **every golden-adjacent env spelling is enrolled or written-excluded — "Silence is not a disposition"** · `:228` the roster may only GROW between refreezes |
| **OSR (observed-shape readers)** | `scripts/.observed-shape-readers-baseline.json`; `npm run check:observed-shape-readers` | `--write` re-freeze (**SHRINK-ONLY**, `:2002–2016`); growth **only** through `scripts/migrate-observed-shape-readers.mjs` **[Q]** | **[Q]** ⛔ **`--update` is FORBIDDEN on the OSR.** `MIN_ROWS = 40` — **a shape crossing it detonates the ratchet; attribute every crossing key-by-key BEFORE the baseline is touched** (§5.4). `schema` 16 at this tip; **the wave takes the next free rung after 17** |
| **Writer-reach** | `scripts/check-writer-reach.mjs` | `--write` (plain) | **[Q]** `--write` **may only SHRINK the cohort** (`:245`, `:152`); `--genesis`/`--rebank` require `--charter=§NNN` — *"An ungoverned bank is not a bank"* (`:327`); the three verbs conflict (`:82`). **[I]** for a 200-path prose sweep the DIRECTION is not derivable — refuse the prediction rather than guess |
| **Voice magnitudes** | `tests/copy/voiceMechanics.test.js`, `tests/copy/proseLeak.test.js` | `UPDATE_VOICE_BASELINE=1 npx vitest run <file>` **[Q, `voiceMechanics.test.js:37`]** | **[Q]** shrink-only, and **it already REFUSES a raise at the train tip** (*"would RAISE its committed totals — em 455 → 770 (+315)"*). ⇒ **[I]** a string-adding car landed before the prose FALL is banked **guarantees a refused register act** |
| **Prose-numerics** | the driven-corpus constants across `tests/domain/*HeraldWords*`, `eventProse`, `dossierDepthTabs` | re-record with the car **[I]** | **[I]** the prose car already owes **8 files / 11 assertions**; a re-record without the car is a stale numeral |
| **Size baseline** | `scripts/.size-baseline.json`; `tests/lint/sizeBaseline.test.js` | the build | **[Q]** ceilings are **EXACT** (standing hazard) — the test reds on a SHRINK too. ⛔ `subsystemRowsVirtual.js` sits at its **800-line ceiling** ⇒ W-OPS rows to `subsystemRowsOps.js`, character to `subsystemRowsLives.js` |
| **Domain-strict typecheck** | `npm run typecheck:domain:strict` = `node scripts/check-domain-strict.mjs` | `…:strict:update` | ⛔ **[Q, preamble]** `tests/lint/domainStrictBaseline.test.js` **passes 12/12 while the real script exits 1** — its inputs are injected. **If a car touches `src/`, run the script, never the test** |
| **Tuning register / inventory** | `tests/lint/tuningRegister.walker.test.js`; `scripts/count-tuning-inventory.mjs`; `npm run validate:tuning-bands` | the walker | **[Q]** tuning **VALUES** are signed **LAST** (CAP-10, at the sitting, after the soak). ⛔ lighting with candidate values and signing different ones later is a **SECOND same-seed shift after the golden freeze** |
| **Engine-gated walker** | `tests/lint/engineGatedRuleKeys.walker.test.js` | the walker | **[Q, `:789–794`]** *"the backlog must equal the measured gated-but-uncensused set exactly — **bank wins by deleting rows, never by widening the list** … The ceiling is the burn-down marker, never the guard. Lower it whenever a key earns its manifest entry and its certification row; **never raise it**"*. ⛔ a class-F flip before `P2-MANIFEST` **INVERTS two lighting contracts** |
| **Closure / first-paint** | the build's hashed-chunk listing | a real build (chair act) | **[Q]** any listing diff exceeding **`(margin − 100 B)`**, or the preset catalog measuring **eager**, ⇒ the wave STOPs and `LGT-O-CLOSURE`'s two-option re-ask goes to the desk **with figures**. ⛔ **[I, and it binds tonight]** every published closure figure (1,047,205 / 1,046,712 / 1,046,662 / 675,764) is at least six landings stale — **no closure number in any record may be quoted into this plan** |
| **The `tests/lint/` scanner family** | 83 walker files, 138 test files | a **full `tests/lint/` directory run** | **[Q, preamble]** a src- or test-adding train reds a multi-member family; **a single-file green is structurally blind to it.** Report the dir run's exit and failing-arm list **even when green** |

### 8.1 The live register tuple at `272dbd2da` — every figure in the docket's §8 is superseded
```
lighting census   2521 / 371 / 2150 / 23184 / 6214   (frozen; LIVE PROBE == FROZEN ⇒ GREEN, no refreeze owed at boarding)
test ratchet      totalTests 31489 · totalFiles 2468 · entries 6 of CEILING 17
   the 6 rows     4x tests/copy/voiceMechanics.test.js · 1x tests/docs/enforcement-claims.test.js
                  1x tests/lint/clampPrimitiveBaseline.test.js
OSR               schema 16 · total 1993 · identities 1409 · minRows 40
doors             152 total · 38 lit · 114 dark   (rules 103/11/92 · flags 38/27/11 · mechanism 3 · unminted 8)
```

---

## 9 · WHAT I COULD NOT DETERMINE

1. **How many observed shapes cross `MIN_ROWS = 40`.** A property of code nobody has written. The probe that settles it
   is L-PROBE's per-parent presence dump, and it must run **before** any regeneration (§5.4).
2. **How many of the 17 backlog keys the wave lights.** A design choice not yet made; not derivable from the tree.
   `doors.md`'s "≈96 lit" is arithmetic over a plan and I reproduce that label rather than replacing it with a number.
3. **Any closure or engine-byte figure.** Needs a build, which is forbidden to this lane and stale in every record.
4. **Whether the seven voice measures still sit at exactly zero headroom.** The ceilings are confirmed; the measured
   values need a `voiceMechanics` run. **PLAUSIBLE as of §893.**
5. **How many of the 4 banked `voiceMechanics` rows the prose refreeze actually retires.** Ceiling 4, floor 0. Measured,
   not derived.
6. **Whether CS-9 survives §893's carve-out amendment.** A chair call on a specific row, not a tree fact. ⛔ **Reported,
   not ruled**, exactly as the brief instructs. It gates a whole car and is worth one sentence.
7. **Whether the chair wants the EP-1 `advanceEpochEnabled` release at all** (§5.3). I priced both halves and recommend
   splitting the item; the decision is the chair's.
8. **`{complexity}`'s 24-seed both-arms drive** — not re-executed (it needs the desk). The landed pin survives; the
   re-class stands as PLAUSIBLE and gates nothing.
