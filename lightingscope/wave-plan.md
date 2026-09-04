# wave-plan.md — THE LIGHTING WAVE AS AN ORDERED, EXECUTABLE CONSIST PLAN

**Lane LIGHTINGSCOPE (Opus 5), 2026-09-04. Measurement-and-design only.**
**Base of every measurement: dock `c2f80ffc9` (`$SP/laneKERNELMARK-tree`), porcelain 0.**
⚠ Register acts are the LAST cars of a consist and belong to **the chair at the landing**, never to a
lane. Where a figure is derivable it is PREDICTED IN WRITING below; where it is not, it is **REFUSED**
by name, and the refusal is the deliverable.

---

## PART 1 — THE BLOCKERS, RE-MEASURED

Three blockers were named for re-measurement. **One survived. Two are phantoms.** A fourth and fifth
were found dead on the way past. The clause text was read in every case, never the summary.

---

### BLOCKER 1 — `{complexity}`'s eleven in-sentence forms "BLOCK lighting the economy desk's C1 pool"
## ⇒ **REFUTED as a blocker. CONFIRMED as a defect, and it is WORSE than the docket reports.**

**What was claimed** (`$SC/RESUME-NOTE.md:141`, live-fault item 6): *"`{complexity}` is dark on all
eleven values — with the desk now wired, four of five DS-ECO-1 pools lose a variant: a BLOCKER on
lighting the economy desk's C1 pool."*

**What is true, executed at `c2f80ffc9`:**

1. `src/generators/economy/prosperity.js:293` `deriveEconomicComplexity` emits **exactly 11 values,
   every one title-cased, 5 carrying an em dash** — read from the source.
2. `src/domain/display/stateProse/economyStateProse.js` `bareCommonFill()` returns `undefined` for a
   value with a leading determiner, an em/en dash, terminal punctuation, a digit, snake_case, **or a
   non-lowercase first character**. All eleven fail the last clause. `slots.complexity` is therefore
   **always `undefined` in production**, by construction.
3. A LANDED test already pins it: `tests/domain/economyStateProseDesk.test.js:358`
   — `expect(refused.length).toBe(COMPLEXITY_VALUES.length); expect(COMPLEXITY_VALUES.length).toBe(11);`

**The measurement the docket did not take** — executed by this lane over the shipped corpus
(`src/data/dossierStateProse/economy.generated.js`) and then through the real desk:

```
DS-ECO-1 :: COMBINATION C1 (high rung, working approach)  total 3, names {complexity} 2, SURVIVORS 1
DS-ECO-1 :: COMBINATION C2 (high rung, narrow approach)   total 3, names {complexity} 1, SURVIVORS 2
DS-ECO-1 :: COMBINATION C3 (the middle rungs)             total 3, names {complexity} 1, SURVIVORS 2
DS-ECO-1 :: COMBINATION C5 (low rung, narrow approach)    total 3, names {complexity} 1, SURVIVORS 2
                                    (C4 loses none)   economy corpus: 329 variants, 5 name {complexity}
```

Then driven through `economyStateProse` over 24 seeds, both arms:

```
VALUE "Highly diversified — multiple major revenue streams"  -> 1 distinct sentence
VALUE "Diversified market economy"                           -> 1 distinct sentence
VALUE "Subsistence with surplus"                             -> 1 distinct sentence
CONTROL, a conformant bare-common value ("diversified trades") -> 3 distinct sentences
```

**VERDICT.** Nothing is dark and nothing is blocked: the C1 pool **renders**. What it does is collapse
from three variants to **one**, so every wealthy road-connected settlement in the game receives the
identical sentence. The docket's *"lose a variant"* understates C1, which loses **two of three**. The
desk's own comment states the designed behaviour: *"the kernel's anchored liveness drops the variants
that name the slot and the pool degrades to the ones that never needed it."*
⇒ **Re-class it: not a lighting blocker, a §0c-3 band-vocabulary CONTENT car**, schedulable anywhere,
and it does not gate one item of the 31. **It is also the cheapest quality win in the arc** — one
lowercase bare-common band vocabulary restores 5 variants across 4 pools with zero `src/` risk.

---

### BLOCKER 2 — the src-prose car owes a rebase before it can ride this wave
## ⇒ **CONFIRMED, and it is cheap. It should be re-ordered to the FRONT of the wave, not the back.**

Executed at `c2f80ffc9`:

```
refs/preserve/srcprose-2026-09-03 = 8f4d5c648
merge-base with dock HEAD         = 30c1667bc   (i.e. it is based two landings back)
HEAD ancestor of prose?  NO       prose ancestor of HEAD?  NO
prose car spans 200 paths; the dock has moved 83 paths since the merge-base
OVERLAPPING PATHS = 2:
    src/domain/display/settlementRumors.js   (prose side −1/+1 · train side +4)
    src/domain/region/propagation.js         (prose side −1/+1 · train side +9/−2)
```

**VERDICT.** The rebase is genuinely owed and genuinely small: **2 of 200 paths**, and on both of them
the prose car's edit is a **single-line sentence cure** against a train hunk that adds lines
elsewhere. Take it immediately after the §891 CAS, when the dock's tip becomes the product tip.
⚠ It is *no longer* owner-gated — see PHANTOM 4.

---

### BLOCKER 3 — "the MAT dial's persistence paths were recently signed"
## ⇒ **CONFIRMED SIGNED — and the live docket still records it as blocked. It is a PHANTOM.**

The claim was put to this lane as fact and it is correct; what is wrong is the docket.

**The clause text, twice, in two places:**

1. **On the ledger, 2026-09-02** — `docs/OWNER_DECISION_QUEUE.md:32362` (§882.13, inside "THE NINETEEN
   RULED", positioned before "⛔ THE FIVE HELD"):
   > **O-11 SIGN** the three persistence paths (publicSafe allowlist, accountImport id-resolution,
   > provenance receiptHash).
   Its stated ground is the reusable boundary: *"pre-launch, with no installed users, a persisted-SHAPE
   decision is reversible by a plain code revert and carries no migration — so persisted shape is
   CHAIR-CLASS in this window."*
2. **Re-ruled 2026-09-04** — `$SC/RULINGS-893.md` §4: **"RULED: SIGNED"**, with a veto shape.

**Searched for a withdrawal and found none:** `O-11` has **zero** occurrences after ledger line 32362;
the only withdrawal in `RULINGS-893.md` is §5b, which withdraws ruling 5's ENC-4 *preference clause*
and says so by name.

**But `$SC/pending/LIGHTING.json` — written 2026-09-04 00:17, two days AFTER the ledger ruling — still
carries:** `LGT-O11 … klass=owner-act, landed=NO, blocked_by="The owner. Recommendation on the desk:
SIGN."` and `LGT-C3-MAT … blocked_by=O-11 … UNSIGNED ⇒ the dial stays at v1 and the car lands wiring
only.` **Both rows are stale.** L-MAT is a whole car, not half a car.

---

### PHANTOM 4 (found in passing) — **O-5, O-14 and the DRIFT DOOR are also already ruled**

| docket row | docket says | the clause text says |
|---|---|---|
| `LGT-O5` (fund the Remembrance reader) | owner-act, blocked | **§882.13 ledger: "LIGHTING O-5 BUILD the Remembrance reader"**, ruled a COMPLETION of §881.4, not new capability. Re-ruled `RULINGS-893.md` §3 **"RULED: BUILD IT."** |
| `LGT-O14` (belief entitlement) | owner-act, blocked | **§882.13 ledger: "LIGHTING O-14 premium-only canonize STAYS AS DESIGNED for launch"** — the status quo, not a paid-surface change. |
| `LGT-P7-DRIFTDOOR` | "RE-CLASSED… a NEW decision" | **`RULINGS-893.md` §2 CHARTERS it** in three parts; the owner granted the fresh charter §890.1 named. |
| `LGT-PROSE` | "gated on the owner's window" | The §6 amendment leaves **exactly two** gated acts; a chartered window is not one of them. |
| `LGT-O10B` (ceiling raise) | owner-gated | **`RULINGS-893.md` §6 item 5: takeable** *"by exactly the measured residual, never a round number, never silent"*. **And the residual is ZERO** — `$SP/receipt-lighting-rows.md` records three real builds at `30c1667bc`, engine `675,764` in all three with an **identical content hash** `engine-C9-_paJc`, so the MAT dial flip costs **0 B**. The docs' `+1,047 B` priced a re-export shape that **was never taken** (`livingContentLaw.js:79–87`). |

### THE STANDING GATE, QUOTED — `$SC/RULINGS-893.md` §6
> **⛔ STILL GATED — exactly TWO** … 1. **EVERY `git push` AND THE DEPLOY.** … 2. **THE OWNER'S WALK +
> ONE REGEN.** *"Not a permission at all — an EXPERIENCE."*

## ⇒ **OF THE DOCKET'S SIX OWNER ROWS, ZERO STILL GATE THE WAVE.**
O-5 ruled · O-11 signed · O-14 ruled · O-10(b) takeable **and moot at residual 0** ·
O-CLOSURE takeable but conditional on a measurement not yet taken (L-PROBE's class-C listing diff) ·
CAP-10 (tuning values) is chair-*declined*, not gated, and by nature follows the soak.
**Blockers surviving re-measurement: ONE — the prose-car rebase, which is two files.**

---

## PART 2 — THE ORDERED CONSISTS

Six consists, each landing on its own gate. Dependencies are real, measured, and named.
**Every step names the EXISTING test file it extends** — the known-failure census is **FULL at 10/10
(executed: `scripts/.test-ratchet-baseline.json` `entries` = 10)** and a NEW test file reds three
censuses, so a new file is spent only where the plan says so and pays its three censuses by name.

### ⭐ THE ORDERING CALL THAT DIFFERS FROM THE DOCKET
The docket appends the prose car to the end of the wave (*"the lighting wave (+ the src-prose car
AFTER its owed rebase)"*). **This lane recommends the opposite: the prose car lands FIRST, as its own
consist, immediately after the §891 CAS.** Two measured reasons, and the second one is the arc's only
identified road out of a live corner:

1. **Voice magnitudes are shrink-only and the wave is a string-adding wave.** `UPDATE_VOICE_BASELINE=1`
   already **REFUSES** at the train tip (*"would RAISE its committed totals — em 455 → 770 (+315)"*).
   L-HOMES adds the Remembrance reader's Herald strings, four W-OPS rows and the wiring car's news
   lines. Landing those against a baseline that already refuses guarantees a refused register act.
   The prose car carries the `espree` replacement for the char tokenizer that §890.4 proved false in
   **both** directions (39 bangs by tokenizer vs 0 by parser; 64 of 71 phantom) — so it should bank a
   large **FALL** and create the headroom the wave then spends.
2. **It is the only identified road to known-failure-census headroom.** Executed at HEAD: **4 of the
   10 banked entries are `tests/copy/voiceMechanics.test.js` arms** (E-E JSX per-file, E-E JSX total,
   E2 per-file, E2 total). `sovereigntyLightingContract` DOOR 3's recurring parser-door timeout has
   **nowhere to park** at 10/10. The refreeze that could retire those slots is *impossible until the
   prose car lands*. ⚠ **PREDICTED FIGURE REFUSED:** the maximum recoverable is 4 slots; how many
   actually retire depends on the post-cure measured debt, which is not derivable from the tree. The
   docket's "may retire two" is itself underived — **4 is the ceiling, 0 is the floor.**

---

### CONSIST 0 — **L-PROBE, the DARK ARM** · chair/Fable act · **zero bytes, zero commits**
**Cars:** none. **Registers moved:** none.
**Produces:** `generatorGoldenMaster` 3/3 + the 0/525 control · a certification receipt per preset ·
the soak flag census · the OSR presence dump (per-parent `schemaKeys/keys` + `corpus.shapes.*.rows`,
the MIN_ROWS=40 cause read, **dumped before any regeneration**) · the lighting-census tuple · the
stability rosters · **a REAL-birth new-campaign fixture per preset** (through `createCampaign` →
`buildNewCampaign`/`createImportedCampaign` → `ensureWorldState(null,…)`, never through
`SIMULATION_RULE_PRESETS[id].rules`) · **52-tick pulse hashes** · ⭐ **THE CLASS-C LISTING DIFF** on a
scratch build with only `...WAVES, ...ONE_REGEN` added.
**Why first:** it is the only control the eleven declarations can quote, and its class-C diff is the
single measurement that decides whether a closure re-ask exists at all.
**STOP:** the preset catalog measures eager, or any listing diff exceeds `(margin − 100 B)`.

**PREDICTED REGISTER FIGURES: NONE. Zero commits ⇒ zero register movement. Derivable and stated.**

---

### CONSIST 1 — **PROSE** (the re-ordered car) · one gate · rebase first
**Cars:** 1 — `refs/preserve/srcprose-2026-09-03` rebased onto the §891 product tip (2 conflicting
paths, both single-line sentence cures: `settlementRumors.js`, `propagation.js`).
**Test files extended:** the 8 files / 11 assertions of the driven-corpus constant re-record that the
car already owes — **no new test file.**
**Registers moved (chair, at the landing):** the voice baseline (`UPDATE_VOICE_BASELINE=1`, expected
to bank a **FALL**) · writer-reach (`--write`, plain — never `--genesis`) · prose-numerics · the
seven-member scanner family (a 200-path src-moving train) · the test ratchet.

**PREDICTED FIGURES**
| register | prediction | basis |
|---|---|---|
| lighting census `files` | **2515 → 2515, UNMOVED** | DERIVED: the car adds no test file; `files` counts test files |
| ratchet `totalFiles` | **2462 → 2462** | DERIVED: same |
| voice em total | **falls from 770** | DERIVED IN DIRECTION ONLY — §890.4 measured 64 of 71 as phantom |
| voice em total, exact value | ⛔ **REFUSED** | requires running the espree instrument, which is a gate act |
| known-failure entries | **10 → 6, 7, 8, 9 or 10** | ⛔ **THE EXACT VALUE IS REFUSED.** 4 slots are voiceMechanics arms; how many retire is measured, not derived |
| writer-reach identities | ⛔ **REFUSED** | a 200-path prose sweep moves grades a JSX-prop read grades N; the direction is not even derivable |

---

### CONSIST 2 — **L-HOMES**, the dark-inert builds · one gate · **the biggest build consist**
Cars in dependency order (the two structural ones FIRST):

| # | car | class | extends which EXISTING test file |
|---|---|---|---|
| 1 | **LGT-P1-BIRTH** — every fresh-birth site resolves the lit preset explicitly; `ensureWorldState` keeps plain normalize | wire | `tests/domain/simulationRulesPreset.stability.test.js` — a **sibling pin beside `:136–145`**; `:59` and `:136–145` stay UNEDITED |
| 2 | **LGT-P2-MANIFEST** — split the list into a gated REGISTER and a derived VIRTUAL set | wire | `tests/lint/engineGatedRuleKeys.walker.test.js` · `tests/lint/tradeConvergenceContract.walker.test.js:478–489` · `tests/lint/sovereigntyLightingContract.walker.test.js:1690–1692` · `contributionLedgerShape.test.js:90` |
| 3 | **LGT-P13-FENCES** — 12 keys, each a dark half + a lit-mutant control | wire | the five existing `*DormancyFence` files; ⛔ a per-key fence that needs a new file pays **three censuses** and must be named in the brief |
| 4 | **LGT-P5-WOPS** — 4 mints, one commit each | wire | `subsystemRowsOps.js` rows; each mint extends the fence file its subsystem already owns |
| 5 | **LGT-P6-ESPWIRE** — the espionage Herald wiring car | wire | the existing Herald/news contract files (`newsHeadlineContract.walker.test.js`); ⚠ `narrativeParity.test.js`'s CLAIMS-PARITY arm is the NEWS ADDRESS LAW instrument that convicts a lit arm with no backing |
| 6 | **LGT-P4-READER** — the Remembrance reader (O-5 RULED BUILD) | wire + content | ⛔ **the one place a NEW UI test file is justified; it pays three censuses by name** |
| 7 | **LGT-P7-DRIFTDOOR** — the drift door (§893 §2 chartered) | wire | ⚠ **shared with ENCOUNTERS by the amended O-9: whichever train lands first OWNS the door car, the other CONSUMES it.** Check ENC-3 before building. |
| 8 | **LGT-P8-MATBOUND** — the create boundary | wire | `livingContentMaterialization` pins |
| 9 | **LGT-P14-WITNESS** — `presetLightingWitness.test.js` + its fixture | wire | ⛔ **a NEW test file, deliberately — the wave's ONLY bit witness.** Fixtures born through the REAL birth path or they measure a world no customer receives |

**Registers moved (chair, at the landing):** lighting census · test ratchet · voice magnitudes ·
`sizeBaseline` (`subsystemRowsVirtual.js` is at its 800-line ceiling — W-OPS rows go to
`subsystemRowsOps.js`, character to `subsystemRowsLives.js`) · the four censuses per new `src/domain`
leaf · the seven-member scanner family.

**PREDICTED FIGURES**
| register | prediction | basis |
|---|---|---|
| lighting census `files` | **+1 CERTAIN from LGT-P14** (2515 → 2516), **plus 1 per new fence/UI file** | DERIVED for P14 (exactly one new test file). The fence and reader file counts are a lane's design choice, **not derivable from the tree — REFUSED** |
| ratchet `totalFiles` | moves **by the same count as `files`** | DERIVED — the two instruments count the same set |
| lighting `titles` / `suiteTitles` | ⛔ **REFUSED** | a title count is per-arm; ⚠ **the walker asserts `titles` first and throws, so a single run hides `suiteTitles` — predict BOTH or the second figure is invisible** (§891 register 8/10's lesson) |
| engine chunk | **0 B** | PLAUSIBLE, strongly: `src/generators` imports **zero** `worldPulse`/`display`/`espionage` modules, so W-OPS and the wiring car are engine-0 at the seed by construction. **The listing diff is the proof, not this sentence.** |
| first-paint closure | **≤ (margin − 100 B)** | this is the STOP, not a prediction. The reader and the wiring car land in first-paint UI/display files |
| known-failure entries | **must not grow** | ⛔ at 10/10 an eleventh red **cannot be banked** |

---

### CONSIST 3 — **L-DEFAULT**, the preset table · one gate · **the wave's centre of mass**
One commit series, six hunks, in this order (⟦A24·B5⟧ re-cut — class C is *measured* in Consist 0
before any preset object is written):

1. **class C + D into the lit default** (`...WAVES, ...ONE_REGEN, disasters, commodityFlow,
   allyIntelSharing`), with the stale `:527–529` comment repaired **line-count-neutral** in the same hunk.
2. **O-1 in the BIRTH form** — `NEW_CAMPAIGN_SIMULATION_PRESET_ID`, a lit successor id **after** the
   legacy trio in key order. `:6`, `:38`, `:632`, `:59` and `:136–145` UNTOUCHED.
3. **class B into the lit SUCCESSORS**, never onto a legacy id. ⛔ The reason is in the tree at
   `simulationRules.js` (the §890 O-12 block) and the instrument that keeps it honest is
   `simulationRulesPreset.stability.test.js`'s `WAR_DEPTH_FLAGS` roster.
4. **O-2** `infoMode: 'perfect_delayed'` on the lit default and dramatic's successor.
   ⚠ every belief-conjoined record carries a **PREMIUM** sentence — `campaignWorldPulseSlice.js:391`
   refuses canonize to a non-premium tier, so a free-tier default can never satisfy `beliefsActive`.
5. **class E `false → true`.** ⛔ `demographicsEnabled` **STOPs** on HORIZON's three evidence items.
6. **classes F and G** in dependency order across every lit preset.
   ⛔ F requires Consist 2 car 2; `espionage` requires car 5; `neutralNeighbors` requires the O-6(a)
   perf car proven on `tickScanBudget`'s own fixture **first**.
7. **LGT-P15-EP1** — the corpus re-key + **ONE** schema-16 migration, at the END, after the per-parent
   presence dump is attributed key-by-key.

**Test files extended:** `simulationRulesPreset.stability.test.js` (rosters `:163`/`:306`/`:366`,
rewritten as declared acts) · `moverCompositionSmoke.test.js` · `emergentArcSoak.test.js` ·
`narrativeParity.test.js` · `discourseParity.test.js` (these four run **LIVE** on `full_simulation` —
a red here is a **FINDING**, reported, never re-recorded) · `soakScriptSeams.test.js` ·
`engineGatedRuleKeys.walker.test.js`. **No new test file.**

**Registers moved (chair, at the landing):** `soakRulesBaseline.json` · the certification receipts ·
the compendium's 21 generated `"flag"` rows · the OSR (via the single governed migration) · the
soak covering array · the stability rosters.

**PREDICTED FIGURES**
| register | prediction | basis |
|---|---|---|
| every pulse HASH golden | **0 rows** | DERIVED, by construction: every pulse golden drives a **LITERAL** rules object (deity `:39`, spatial `:37`, chronicler `:33`, rumor/belief `:101`/`:78`, seasons `:88`, demographicsLifecycle `:130`, every `*Dormancy*`). ⇒ a preset flip is invisible to all of them. **This is why LGT-P14 exists.** |
| `generatorGoldenMaster` | **0 / 525, BOTH arms** | DERIVED: generation-side, reads no rules flag. A move on either arm is a **STOP** |
| OSR newly-discoverable keys | **+25 (21 class F + 4 class G)** | ⚠ **INHERITED from the fold ⟦A5·B9⟧, not re-derived by this lane.** The act that settles it is Consist 0's presence dump |
| OSR `total` / `identities` | ⛔ **REFUSED** | at HEAD `1993 / 1409`; the delta needs the corpus builder run, and **`--update` is FORBIDDEN on the OSR** |
| class B/C/D/E OSR movement | **ZERO** | INHERITED ⟦A5·B9⟧ |
| `BACKLOG_RULE_KEYS` count | **falls from 17; the walker's equality arm makes it exact** | DERIVED in mechanism (`toEqual(measuredGap)` + `toBeLessThanOrEqual(17)`, shrink-only). ⛔ **the landing value is REFUSED** — it depends on how many of the 17 earn a manifest entry in this wave, which is a design choice not yet made |
| the 52-tick preset hashes | **every lit preset MUST move** | the movement IS the declared shift. An unmoved preset hash at 52 ticks is a **FINDING**. ⚠ an unmoved **KEY** is read from the certification grade table **only** — never inferred from a hash |
| `MIN_ROWS=40` crossings | ⛔ **must be attributed per key BEFORE the baseline is touched** | a shape crossing 40 detonates the OSR ratchet (188 growth rows from one key at §875) |

---

### CONSIST 4 — **L-MAT + L-DOORS + L-UI**, the small flips · one gate
| car | state | dependency |
|---|---|---|
| **L-UI** — 3 product flag flips (`warEconomySurfacing`, `handbookVoice`, `mobileSingleChrome`) | ready **now** | none. O-13 ratified. The other 4 flags wait in the walk's preview by their own unmet promotion proofs |
| **L-MAT** — the dial + the create boundary + **the three persistence paths** | ready — **O-11 is SIGNED** | Consist 2 car 8. ⛔ the three paths land in the SAME car as the flip, never optional |
| **L-DOORS (i)** — charset `report → refuse` | **BLOCKED** | CS-9's restore plant, a HORIZON-DARK CHARSET Car 2 build |
| **L-DOORS (ii)** — `generationWorker: false → true` | **BLOCKED** | WORKER Car 1 must first land the `false` entry — **`generationWorker` has 0 hits in `src`+`tests` at HEAD, so there is nothing to flip** |

**Test files extended:** `livingContentMaterialization` pins · the `dossierFiveTabs`-class snapshot
tests (re-recorded as **declared display shifts**) · the admission suites · the worker identity triple.

**PREDICTED FIGURES**
| register | prediction | basis |
|---|---|---|
| engine chunk, MAT dial flip | **0 B** | **CONFIRMED** by three real builds at `30c1667bc`, hash-identical `engine-C9-_paJc` (`$SP/receipt-lighting-rows.md`). ⚠ **re-measure at the current build before boarding** — the figure is base-relative and two landings old |
| the `+1,047 B` engine cost in the docs | **DEAD** — it priced a re-export shape never taken (`livingContentLaw.js:79–87`) | CONFIRMED |
| the O-10(b) ceiling raise | **not reached** at the last measurement (residual 0) | CONFIRMED at `30c1667bc`; conditional on re-measurement |
| `generatorGoldenMaster` at L-MAT | **0 / 525** | the roster is post-RNG |
| closure at L-DOORS (ii) | **≈ +20 B** | INHERITED (HORIZON G5′, already priced in WORKER Car 1) |
| the MAT new-key shift | **freshly created worlds ONLY** | ⛔ **STOP:** `_livingContentLawVersion` stamped on an EXISTING world on regen is a PROMISE breach |

---

### CONSIST 5 — **L-PROBE-2 + the ELEVEN DECLARATIONS + the register acts** · the landing
**Cars:** the lit-arm battery re-run at the composed tip (zero bytes), then the register series.
**The eleven causes (i)–(xi)** each get one `docs/GOLDEN_SHIFT_LEDGER.md` row + one ledger §-row +
the landing commit body, **quoting base hash → lit hash per preset and rows moved per instrument**.
⛔ Nothing is written by hand; the declarations are written FROM the battery's outputs.
⛔ **A `docs/shift-records/*` file is FORBIDDEN while the freeze register is unfrozen** — that door
lands at L9, AFTER this wave. `goldenRecordDoor.js` and `.golden-freeze-register.json` are **absent**
from the tree; `docs/GOLDEN_SHIFT_LEDGER.md` exists and is the idiom.

**Register acts, in order, chair-only:** lighting census refreeze (ONCE, on a CLEAN tree, exits
non-zero **by design**, the plain re-run is the proof) → the OSR migration → the treasury
`VIRTUAL_DORMANT_WRITERS` row shrink (`--write`) → the test ratchet `--update` under the exclusive
mutex. ⚠ **mutex give-up exit 3 is NOT-RUN, never green.**

**PREDICTED FIGURES: the composed tuple is REFUSED.** ⭐ The reason is a measured law of this program:
**the sum of independently-measured deltas is not the composed delta** (§891 register 1/2 — four lanes
summed +75 titles, the composed tree measured +78). Predicting the composed census from the consists'
individual predictions would reproduce exactly that error. **Predict per file, from title counts,
at the composed tip, immediately before the refreeze — never from raw diff lines (§875.2).**

---

## PART 3 — THE CRITICAL PATH, AND WHAT IS NOT ON IT

| stage | gates the wave? | why |
|---|---|---|
| §891 CAS | **YES** | the prose rebase needs a product tip |
| HORIZON-DARK: CHARSET Cars 1–3 (CS-9's plant) | **YES, for L-DOORS (i) only** | one of two doors; the wave lands without it, with a named residue |
| HORIZON-DARK: WORKER Cars 1–3 | **YES, for L-DOORS (ii) only** | the registry entry does not exist yet |
| HORIZON-DARK: CAPACITY's three evidence items | **YES, for `demographicsEnabled` only** | the ≈2.3 h `research-lit-4s` receipt is the long pole among them |
| **SEAT-7/8 + `irregularForceEnabled`** | **NO — it rides its OWN consist** | ⭐ **but it is the arc's longest pole: ≈4 cars, 2–3 DAYS, chair-ruled FUND at §882.1, confirmed 0 hits at HEAD.** It must be started EARLY and in parallel, or it, not the wave, sets the freeze date |
| the desk remainder (six corpus leaves at 8–13 cars) | **NO** | ⛔ but see the gap below |
| GOLDEN's seven unlanded cars | **NO, and it must not be** | 197+ commits behind, `commitTrailerRefusal` unwired — no freeze act until they land |

### ⛔ THE GAP NO CHARTER FUNDS — carried forward, re-confirmed
The lighting charter has **zero** mentions of the dossier state-prose corpus across all 436 lines.
**64 dark blocks carrying 2,185 authored variants ship in the bundle and reach no reader**, and they
are on nobody's bill. They are not in the 31. ⚠ **Blocker 1's `{complexity}` defect lives in exactly
this territory** — which is why it reads as a blocker in the docket and measures as a content car
here. Schedule the desk stage deliberately or it will not happen.

---

## PART 4 — THE SINGLE BIGGEST RISK

**Not a byte budget, not the owner's desk, and not the 91 doors.**

⭐ **THE WAVE'S ONLY BIT-LEVEL WITNESS DOES NOT EXIST, AND EVERY EXISTING GOLDEN IS BLIND TO IT.**
Executed and derived: every pulse hash golden in the estate drives a **literal** rules object, and
`generatorGoldenMaster` is flag-blind. ⇒ **the entire preset table can be lit, or silently re-darkened
afterwards, and not one of 525 + 8 golden instruments moves a row.** `presetLightingWitness` has
**0 hits at HEAD**. Until LGT-P14 lands — a 52-tick hash per preset, minted through the REAL birth
path — "everything is lit" is an unfalsifiable claim, and the GOLDEN freeze would then record a world
nobody can prove is the lit one.

**Second-order, and the reason it is acute:** LGT-P14 is a **new test file** against a known-failure
census measured **FULL at 10/10 with zero headroom**, while `sovereigntyLightingContract` DOOR 3's
recurring timeout already has nowhere to park. **The only identified road to headroom runs through the
prose car's voice refreeze** — which is the ordering change this plan recommends, and the reason it
recommends it.
