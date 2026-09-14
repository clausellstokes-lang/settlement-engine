# SCOPE-MEASURE — the three carried-forward figures, re-derived

Lane SCOPE-MEASURE · 2026-09-05 · Seat Opus 5 · **read-only; zero repo writes, zero refs, zero register acts.**

**Bases of measurement, stated once.**
- **Product tip `90702c3e9`** (`claude/composite-r4`, §895 "DESK consist lands at 25 cars"). Every figure
  labelled CONFIRMED below was read from this tree tonight via `git show`/`git grep`/`git ls-tree`, or by
  importing `simulationRules.js` (self-contained, zero imports) into a scratch dir and running the
  sealed `lightingscope/measure-presets.mjs`.
- **Ledger tip `29e7bf1e5`** (`review-fixes-2026-07-08`, §895).
  ⚠ **The ledger working tree is heavily dirty with mass `docs/` DELETIONS.** `ls docs/X.md` returning
  "No such file" proves nothing about branch content — every docs check below was re-done with
  `git show review-fixes-2026-07-08:docs/X.md`. One of my own early readings was wrong for this reason
  and is corrected in place.
- **Recorded sources, all sealed, all read tonight:** `refs/preserve/session-kit-893-2026-09-04`
  (`pending/LIGHTING.json` 31 items, `pending/RECONCILED.json`, `pending/HORIZONDARK/HORIZONDARK.json`)
  and `refs/preserve/session-kit-893b-2026-09-04` (`lightingscope/doors.md`, `lightingscope/wave-plan.md`,
  `warmsscope/items.md`, `warmsscope/warms-plan.md`, `DESIGN_W_ARMS.md`).
  Those artifacts were measured at `c2f80ffc9` / `f537ce47e` / `ca651d54b` — **one to three landings
  behind the current tip.** Where they and the tree disagree, the tree wins and I say so.

---

## ⛔ 0 · THE FINDING THAT OUTRANKS THE SCOPE QUESTION

### `LIGHTING-INVENTORY.md` IS GONE. The risk its own author recorded has materialised.

**CONFIRMED, two independent negatives:**
- `git rev-list --all --objects | grep -i LIGHTING-INVENTORY` → **empty.** It is in no git object at all,
  reachable or unreachable, on either branch.
- Its recorded home `/private/tmp/claude-502/…/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad/` —
  **the entire session directory no longer exists.** Only five session dirs survive under
  `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/`, none of them `825f209c…`.

`doors.md` §A.1 recorded it verbatim as a risk and did not act:
> "⚠ The inventory is scratchpad-only. … Its loss would cost the wave its entire design.
> Recorded as a risk, not acted on."

**What was lost:** 169,776 B / 436 lines — findings ⟦A1⟧…⟦A29⟧ dispositioned in place, §6 the disposition
table, §7 the owner rows re-sorted, **§8 the bill as amended (one table, every instrument with its
measuring act and its STOP)**, §9 the charter question.

**What survives, and it is a lossy but usable substitute (CONFIRMED):**
| survivor | where | what it carries |
|---|---|---|
| the charter row §882.1 | `docs/OWNER_DECISION_QUEUE.md:32350` (ledger branch, committed) | the fold summary, **all 23 chair rulings by name** (O-1, O-2, O-4, O-6(a), O-7(a), O-8, O-9 amended, O-10(a), O-13, O-15, CS-2, WK-1, CH-1…CH-11), the three largest amendments, the 7 owner-by-nature rows |
| the derived docket | `session-kit-893:pending/LIGHTING.json` (36,248 B) | **the 31 items**, each with `klass` / `landed` / `blocked_by` |
| LIGHTINGSCOPE's re-measure | `session-kit-893b:lightingscope/{doors,wave-plan,receipt-lightingscope}.md` | the door denominator, the six ordered consists, the blocker verdicts |

⭐ **What is NOT recoverable from the survivors: §8's instrument-and-STOP table.** The ledger row names
that §8 exists; it does not reproduce it. A wave built from the survivors will have every ruling and
every item, and will be missing the per-instrument STOP list.

**Contrast — `DESIGN_HORIZON.md` is SAFE.** CONFIRMED at 728,943 B, committed on the ledger branch
(`git show review-fixes-2026-07-08:docs/DESIGN_HORIZON.md`), blob `ad83b30fb`. It is merely deleted in
the dirty working tree. HORIZON-DARK's design is intact; LIGHTING's is not.

**`DESIGN_W_ARMS.md` was rescued.** See §2/B1 — it is now sealed in a preserve ref.

---

## 1 · THE LIGHTING WAVE

### 1.1 Is "6 cars + 16 prerequisites" right?

**No — it is a SUBSET, and it omits 9 items.** The figure is quoted in `docs/HANDOFF_CURRENT.md:39`
as *"the lighting wave (6 cars + 16 prerequisite builds)"*.

**CONFIRMED composition of the docket (`pending/LIGHTING.json`, `items` array re-counted tonight = 31):**

| block | n | items |
|---|---|---|
| prerequisite builds | **16** | LGT-P1-BIRTH … LGT-P16-FAITHFIX |
| wave cars | **6** | LGT-C0-PROBE, C2-DEFAULT, C3-MAT, C3B-DOORS, C4-UI, C5-PROBE2 |
| register / declaration acts | **2** | LGT-REG-DECL (the eleven shift declarations), LGT-REG-CENSUS |
| the `src/` prose car | **1** | LGT-PROSE (⚠ **not in the lighting charter at all**) |
| owner rows | **6** | LGT-O5, O11, O14, O10B, O-CLOSURE, CAP10 |
| **TOTAL** | **31** | |

⇒ **"6 + 16 = 22" understates the wave by 9 items.** The omitted 9 are not filler: they include the ONE
lighting-census refreeze, the ONE OSR migration, the eleven shift declarations, and the prose car that
`wave-plan.md` argues should land **FIRST**, not last.

⚠ **A conflation trap.** The docket's "6 cars" are C0/C2/C3/C3b/C4/C5. `wave-plan.md` independently
proposes **6 CONSISTS** (L-PROBE · PROSE · L-HOMES · L-DEFAULT · the small flips · L-PROBE-2+registers).
Same number, **different partition** — L-HOMES is a container for 9 of the 16 prerequisites and has no
docket item of its own. A reader who sees "6" in both places will think they agree. They do not.

⚠ The docket's own `status` string is internally inconsistent with its own array — it says *"30 pending
items: 16 prerequisite builds, 7 wave cars…"*, which sums to 32 and miscounts the cars as 7.
`doors.md` §E caught this; I re-confirm the array is **31** and the cars are **6**.

### 1.2 Real current size — what is done

**CONFIRMED at product tip: 0 of 31 are DONE. 4 are PARTIAL. 27 are untouched.**

Every landed-status probe re-executed tonight at `90702c3e9`:

| probe | result at `90702c3e9` | verdict |
|---|---|---|
| `NEW_CAMPAIGN_SIMULATION_PRESET_ID` (P1-BIRTH) | **0 files** in src+tests+scripts | NO |
| `presetLightingWitness` (P14-WITNESS) | **0 files** | NO |
| `irregularForceEnabled` (P10-SEAT78) | **0 files** | NO |
| `generationWorker` (C3B-DOORS ii) | **0 files** | NO — nothing exists to flip |
| `charsetPolicy.enforcement` (C3B-DOORS i) | `"report"` (`schema/custom-content.manifest.json:31`) | NO |
| `warEconomySurfacing` / `handbookVoice` / `mobileSingleChrome` (C4-UI) | all `false` | NO |
| `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION` (C3-MAT) | `= DEFAULT_LIVING_CONTENT_LAW_VERSION` (dormant) | NO |
| `FAITH_TUNING_SIGNATURE` (P16-FAITHFIX) | `{ signed: false, live: true }` | **PARTIAL** — law half landed §890.3, fixture out |
| `DEMOGRAPHIC_TUNING_SIGNATURE` (P3-CAPSIG) | `{ signed: false, lit: null }` | **PARTIAL** — C1 surface landed, C2/C3 evidence owed |
| espionage news writers (P6-ESPWIRE) | **0 of 18** files under `src/domain/worldPulse/espionage/` | NO |
| CHARSET Car 2 markers (P9-CS9) | `charsetPolicy` **0 hits in `src`**, no CS-9 plant | NO |
| O-10(b) ceiling raise | closed at §889.3, **residual measured ZERO** | **PARTIAL/closed** |

⇒ **Nothing on the lighting wave has moved since the docket was built.** `doors.md` said the same at
`c2f80ffc9`; it is still true two landings later.

### 1.3 The door denominator — RE-DERIVED, and it has GROWN

Executed tonight by importing `simulationRules.js` from `90702c3e9`:

```
PRESET IDS: quiet_local | realistic_regional | dramatic_campaign | static_campaign
            | narrative_campaign | living_realm | full_simulation
DEFAULT_SIMULATION_PRESET_ID = realistic_regional
union of *Enabled keys                 = 56    (recorded 56 ✓)
LIT in the default preset              = 11    (recorded 11 ✓)
DARK in the default preset             = 45    (recorded 45 ✓)
   of which lit in SOME preset         = 34    (recorded 34 ✓)
   of which dark in EVERY preset       = 11    (recorded 11 ✓)
ENGINE_GATED_VIRTUAL_RULE_KEYS         = 30    ⛔ recorded 29 — MOVED
BACKLOG_RULE_KEYS                      = 17    (ceiling <=17, shrink-only) ✓
EXEMPT_RULE_KEYS                       =  4    ✓
FLAG_DEFAULTS: total 38, TRUE 27, FALSE 11     ✓ exactly, same 11 names
```

⭐ **The one key that moved: `chanceEncountersEnabled` joined `ENGINE_GATED_VIRTUAL_RULE_KEYS`.**
CONFIRMED both directions — `grep -c chanceEncounters` in `simulationRules.js` is **0 at `ca651d54b`**
(§890) and **2 at `90702c3e9`**. It was minted by the §893.2 ENCOUNTERS landing.
⇒ **The ENCOUNTERS program grew the lighting wave's denominator by one dark door.** Nothing recorded
this as a lighting cost.

**The re-derived headline table (CONFIRMED except where marked):**

| family | exist | lit | **dark** | recorded (doors.md) |
|---|---|---|---|---|
| rules doors | **103** | 11 | **92** | 102 / 11 / 91 |
| product flags (`FLAG_DEFAULTS`) | **38** | 27 | **11** | 38 / 27 / 11 ✓ |
| named mechanism doors | **3** | 0 | **3** | 3 / 0 / 3 ✓ (MAT dial dormant · charset `"report"` · `generationWorker` absent) |
| named-but-unminted doors | **8** | 0 | **8** | 8 ✓ — re-verified src-only: `irregularForce` 0, `operationsVoice` 1, `envoyTaskCatalog` 1, `infiltrationDepth` 3, `missionDispatcher` 4, `characterDrift` 3, `faithField` 2, `seatBooks` 1 (still a comment at `strategicPosture.js:36`) |
| **TOTAL** | **152** | **38** | **114** | 151 / 38 / 113 |

⇒ **"151 doors, 113 dark" is now 152 doors, 114 dark.** The wave got one item bigger, not smaller.

### 1.4 What I could not tighten

- **How many of the 17 backlog keys earn a manifest entry inside this wave** is a design choice not yet
  made. It is not derivable from the tree. `doors.md`'s "≈96 lit" is arithmetic over a plan and is
  correctly labelled as such; I reproduce that label rather than replacing it with a number.

---

## 2 · W-ARMS

### 2.1 Is "14 items" right?

**YES. CONFIRMED as the best-derived denominator, and it is the only figure of the three that is not
understated.** It comes from `warmsscope/items.md`, which explains where the older "roughly 9" came from
(`RECONCILED.json` stage H's H1…H6 plus three `owner_gated` rows) and why it undercounts: it omits the
four landing-register acts the design's own §7 names as obligations.

**The 14, enumerated (all NO at `90702c3e9` unless noted):**

**TIER A — build cars (5)**
| id | item | state |
|---|---|---|
| A1 | Car 0 — MEASURE (5 probes, 0 product bytes, read-only) | NO |
| A2 | Car 1 — the leaf + pins (`src/design/organic/ornament/arms.js`, `CADENCY_MARKS`, `CADENCY_PATHS`, ~24 samples) | NO |
| A3 | Car 2 — the adapter + web seam (`src/domain/display/armsKinship.js`, `<Arms/>`, `DossierHeaderRow`, the ONE new test file) | NO |
| A4 | Car 3 — the PDF seam (`src/pdf/primitives/HouseArmsBlock.jsx`, `Cover.jsx`) — **paid surface** | NO |
| A5 | Car 4 — the CC0 charge roster | **explicitly out of this landing** (owner taste row §9.8) |

**TIER B — unmet terms of the charter (3)**: B1 commit the volume · B2 the independent skeptic pass ·
B3 re-measure the point-in-time figures at the boarding base.
**TIER C — owner acts (2)**: C1 the one-word veto (standing, open) · C2 the eleven §9 taste rows.
**TIER D — landing-register acts (4)**: D1 the lighting-census refreeze · D2 the DECLARED UI shift
record · D3 the §713.2 bit claim + espionage fence · D4 the size/hash build.

### 2.2 Real current size: **0 done, 14 open.** Of the 5 build cars, 4 are landable (A5 is out).

**CONFIRMED — there is zero heraldry code at the product tip:**
```
git ls-tree -r --name-only claude/composite-r4 | grep -iE "ornament/arms|armsKinship|HouseArmsBlock|CADENCY"
→ empty
src/design/organic/ornament/  = exactly 5 files (compose, emblemPaths, fnv, palette, pools) — no arms.js
docs/samples/organic-craft/ornament/ = 16 samples   (recorded base 16 ✓)
tests/pdf/__snapshots__/goldenViewModel.test.js.snap = 17 lines  (recorded 17 ✓)
public/map/charges/ = 104 files                     (recorded 104 ✓)
```
The "nothing was half-built" finding holds at the current tip. **PLAUSIBLE→CONFIRMED.**

### 2.3 Decayed W-ARMS figures — the register bases have all moved

| figure | recorded (at `f537ce47e`) | **measured at `90702c3e9`** | status |
|---|---|---|---|
| D1 lighting census `files` | 2515 | **2521** | DECAYED |
| D1 `parked` | 371 | **371** | holds |
| D1 `credited` | 2144 | **2150** | DECAYED |
| D1 `titles` | 22922 | **23178** | DECAYED |
| D1 `suiteTitles` | 6153 | **6213** | DECAYED |
| OSR `total` / `identities` / inventory | 1993 / 1409 / 388 | **1993 / 1409 / 388** | holds ✓ |
| **OSR `schema`** | **15** | **16** | ⛔ **DECAYED — see §4** |
| enforcement-claims ceiling | 6 | **6** | holds ✓ |
| domain-strict typecheck | 1121 / 75 files | **1121 / 75** | holds ✓ |
| full typecheck | 173 / 38 files / resolved 1400 | **173 / 38 / 1400** | holds ✓ |
| the 7 zero-headroom voice ceilings | 34 / 0 / 15 / 382 / 69 / 9 / 770 | **34 / 0 / 15 / 382 / 69 / 9 / 770** | ceilings hold ✓ |

⚠ **On "zero headroom": the CEILINGS are CONFIRMED; the "measured == ceiling" claim is NOT re-derived.**
§893 recorded the tree at exactly zero headroom on seven measures. Confirming that today needs a
`voiceMechanics` run, which the load discipline forbids. **Label: PLAUSIBLE, as of §893.**

---

## 3 · HORIZON-DARK

### 3.1 Is "5 cars" right? **YES for build cars — but the item count is 6.**

The "5" traces to `HANDOFF_CURRENT.md:154` — the derived carlist held **11 chair-class + 3 owner-gated**,
**6 of the 11 built, 5 remain.** `RECONCILED.json` stage B enumerates **6 items**, of which 5 are build
cars and one is a zero-byte measurement block:

| id | item | class | **state at `90702c3e9`** |
|---|---|---|---|
| **B1** | **CHARSET Car 2** — the wiring, the typed rejection surface, the restore split (~10 files, risk HIGH) | build car | **NO. CONFIRMED:** `charsetPolicy` **0 hits in `src`**; no `charsetRefusal`/`restoreSplit`/`accountImportCharset`; no CS-9 plant |
| **B2** | **WORKER Car 1** — the lane + transport, dark (~15 files, 5 new `src`, risk HIGH) | build car | **NO. CONFIRMED:** `generation.worker.js`, `generationProtocol`, `generationRequest`, `generationClient`, `settlementGenerateAction` all absent; `generationWorker` 0 hits |
| **B3** | **WORKER Car 2** — instant-world op + headless isolate | build car | **NO** (blocked on B2) |
| **B4** | **WORKER Car 3** — regen ops (**DROPPABLE**) | build car | **NO** (blocked on B2/B3) |
| **B5** | **TUNEREG Car 4** — fold the duplicated `INTERVAL_WEEKS` into one imported home (**OPTIONAL, LAST, STOP-heavy**) | build car | **NO. CONFIRMED:** `INTERVAL_WEEKS` still separately `Object.freeze`d in **both** `foodStockpile.js:66` and `populationDynamics.js:19` |
| **B6** | the three **CAPACITY evidence measurements** (~2.3 h plateau receipt + 2 unsized) | zero-byte | **NO.** `DEMOGRAPHIC_TUNING_SIGNATURE = {signed:false, lit:null}` at `demographicsRates.js:375` — C1's surface landed, the evidence has not |

⇒ **5 build cars is CONFIRMED accurate; "5" silently drops B6**, which is the item with the longest
wall-clock (~2.3 h for one of three measurements) and the one that gates `demographicsEnabled`.
**Honest size: 3 firm cars + 2 optional/droppable + 1 zero-byte measurement block = 6 items.**

### 3.2 ⚠ One HORIZON-DARK line item was CANCELLED and the record may mislead

**CHARSET Car 3 is CANCELLED** (§893, ODQ:32425): all 27 codepoints were already inside the shipped
font, so the widening was *"a step the embed DELETES"*. §894 then landed the embed
(`src/utils/jsPdfBookFont.js`, `tests/pdf/renderedFontEmbedding.test.js`,
`tests/pdf/exoticUnicodeRender.test.js` — all CONFIRMED present at the tip), curing 41/41 at 0 B first
paint. **This does not shrink the 5** — Car 3 was not among B1…B5 — but any plan quoting "CHARSET Cars
1–3" as outstanding is quoting a cancelled car.

---

## 4 · DECAYED BLOCKERS — the full list

Every recorded blocker I found, checked against the tree today.

### ⛔ DECAYED — do not obey these

| # | blocker, as recorded | verdict tonight | evidence |
|---|---|---|---|
| **D-1** | **"the known-failure census is FULL at 10/10 with ZERO headroom"** — `wave-plan.md` PART 2, twice, and it is the stated ground for the wave's ordering | ⛔ **DECAYED ON THE COUNT AND WRONG ON THE MECHANISM** | `scripts/.test-ratchet-baseline.json` at `90702c3e9`: **`entries` = 6**, `measuredAtSha afde4f9f3`. §893.1 records the fall 10 → 6 and says in its own words *"This is NOT headroom bought — the headroom was always there and the ruling that said otherwise is withdrawn."* **See D-2 for the mechanism half.** |
| **D-2** | **"a NEW TEST FILE reds three censuses"** / "must be spent only where the plan says so" | ⛔ **REFUTED ON THE MECHANISM** | `scripts/check-test-ratchet.mjs:97` `SCOPE_FLOOR_RATIO = 0.9`; `:1118` and `:1138` compare `rows.length` / `totalFiles` against `floor(frozen * 0.9)` and red only on **COLLAPSE**. `totalTests`/`totalFiles` are **90% floors, not exact ceilings** — a new test file RAISES them and cannot breach them. A new test file costs **REGISTER REFREEZES** (lighting census + ratchet totals), which are routine landing acts, **not census headroom.** ⇒ `LGT-P14-WITNESS`, `LGT-P4-READER`, the fences car and the five desk leaves are **not competing for slots.** |
| **D-3** | **"the wave's only witness cannot land until the prose car frees voice slots"** — `wave-plan.md`'s headline ordering argument, PART 4 | ⛔ **FALLS WITH D-1/D-2** | The argument's entire premise was 10/10. At 6 entries against `CEILING = 17` (`tests/lint/testRatchet.test.js:182`, asserted at `:268`) there are 11 slots below the structural cap, and by D-2 the witness needs none of them. ⚠ **The prose car may still be worth landing first** — the voice baseline genuinely refuses upward and the wave is string-adding — but that is a *different, weaker* argument than the one recorded, and a planner should not inherit the strong one. |
| **D-4** | `LGT-O11` "blocked_by: the owner. Recommendation on the desk: SIGN" | ⛔ **PHANTOM** | **§882.13** (ODQ:32362, 2026-09-02): *"LIGHTING O-11 SIGN the three persistence paths (publicSafe allowlist, accountImport id-resolution, provenance receiptHash)."* Zero occurrences of a withdrawal after that line. ⇒ **L-MAT is a whole car, not half a car.** |
| **D-5** | `LGT-O5` "owner-act, blocked" | ⛔ **PHANTOM** | **§882.13:** *"LIGHTING O-5 BUILD the Remembrance reader"* — ruled a COMPLETION of §881.4, not new capability. |
| **D-6** | `LGT-O14` "owner-act, blocked" | ⛔ **PHANTOM** | **§882.13:** *"LIGHTING O-14 premium-only canonize STAYS AS DESIGNED for launch"* — the status quo. |
| **D-7** | `LGT-O10B` "owner-gated ceiling raise" | ⛔ **CLOSED, AND MOOT** | **§889.3** (ODQ:32405): three real builds put the engine chunk at **675,764 B against a 676,000 ceiling with an IDENTICAL content hash in all three** ⇒ *"a ceiling the owner delegated turned out not to need raising."* The documented `+1,047 B` priced a re-export shape never taken. |
| **D-8** | W-ARMS **H1** "Car 0 blocked by the freeze" | ⛔ **REFUTED** (WARMSSCOPE, re-confirmed by me) | No landed freeze register gates it; `EAGER_FIRST_PAINT_MODULES` is exported at `vite.config.js:309` and already consumed by `tests/build/vendorPdfLazy.test.js`. **Car 0 is runnable now.** |
| **D-9** | W-ARMS **H5** "re-measure blocked by the freeze existing" | ⛔ **REFUTED as stated** | A re-measure needs **A** base, not **THE** freeze. WARMSSCOPE re-measured 20 figures with no freeze; I re-measured 12 again tonight at a different tip. |
| **D-10** | W-ARMS **B1** *"It is in NO git ref, on NEITHER branch"* — the stated reason to commit the volume FIRST, because *"Everything else in this block is recoverable; that file is not."* | ⛔ **DECAYED — the rescue already happened** | **CONFIRMED:** `DESIGN_W_ARMS.md` is blob `c0e1dad237130ba72fe26d12415dd0b90172f697`, **reachable from `refs/preserve/session-kit-893b-2026-09-04`**, 55,812 B, md5 `58e1e8dc6f9aebe55b3eeed7758524b2` — **byte-identical to the recorded scratchpad original.** B1 (commit it to `docs/`) is still OPEN and still cheap, but its **urgency is discharged**: it is now housekeeping, not a rescue. ⭐ And the risk it was protecting against **landed on LIGHTING instead** (§0). |
| **D-11** | W-ARMS **UB-5** — the design's §3.1/§6/§8.2 rest on *"first-paint closure 1,047,205 B … 205 B OVER"* | ⛔ **REFUTED, and now doubly stale** | §883 and `HANDOFF_CURRENT.md:39` both record the composed tip **288 B UNDER** the unraised 1,047,000. The tree is UNDER, not over. ⚠ **Neither figure is current** — six landings have passed. See §5. |
| **D-12** | `{complexity}` "a BLOCKER on lighting the economy desk's C1 pool" | ⛔ **RE-CLASSED, not a blocker** | `wave-plan.md` BLOCKER 1, executed: the C1 pool **renders**; it collapses 3 variants → 1. A §0c-3 band-vocabulary CONTENT car, schedulable anywhere. (I did not re-execute this at the current tip — **INHERITED from LIGHTINGSCOPE, PLAUSIBLE.** ⚠ §895 moved the desk's dark blocks 64 → 52, so the surrounding figures have moved.) |

### ✅ STILL HOLDS — these blockers are real today

| # | blocker | evidence at `90702c3e9` |
|---|---|---|
| **S-1** | **`L-DOORS (ii)` cannot flip `generationWorker`** — WORKER Car 1 must create the registry entry first | **CONFIRMED: `generationWorker` has 0 hits in `src`+`tests`.** There is literally nothing to flip. |
| **S-2** | **`L-DOORS (i)` cannot flip charset `report → refuse`** — needs CHARSET Car 2 / CS-9's plant | **CONFIRMED:** `enforcement: "report"` at `schema/custom-content.manifest.json:31`; `charsetPolicy` 0 hits in `src`; no plant. |
| **S-3** | **`demographicsEnabled` STOPs on the three CAPACITY evidence items** | **CONFIRMED:** `demographicsRates.js:375` = `Object.freeze({ signed: false, lit: null })`. |
| **S-4** | **W-ARMS H2/H3** — Car 1 needs 2 of Car 0's 5 probes; Car 2 consumes Car 1's exports | genuine build order (WARMSSCOPE, not re-derived by me — **PLAUSIBLE**) |
| **S-5** | **W-ARMS H6 / B2** — the independent skeptic pass was **never run**; §879.11's bill named *"a short Fable design note **+ skeptic pass**"* and §880.5 records only the note | four-way negative in `warmsscope/warms-plan.md` §1.1; the volume's own §8 is **self-administered** by the design lane and does not discharge it. **PLAUSIBLE, well-argued.** |
| **S-6** | the **prose-car rebase** — `refs/preserve/srcprose-2026-09-03` = `8f4d5c648`, based two landings back | ⚠ **This is the one blocker that has DECAYED IN THE WRONG DIRECTION.** LIGHTINGSCOPE measured it as **2 of 200 overlapping paths** against `c2f80ffc9`. **Six landings have since passed** (§893, §893.1, §893.2, §893.3, §894, §895 — ninety cars between `ca651d54b` and the tip). I did **not** re-run the overlap. ⛔ **Treat "2 of 200" as EXPIRED, not as small.** |

### ⚠ ONE BLOCKER WHOSE STATUS I CANNOT SETTLE AND WILL NOT GUESS

**CS-9** (the RESTORE-vs-authoring-wall ruling, blocking B1/CHARSET Car 2 and `LGT-P9-CS9`).
Its latest ledger mention is **§882.1** (ODQ:32350), where it is BLOCKING and owner-gated. But **§893**
(ODQ:32425) amended the carve-out line itself on the owner's word, and the new line is: *"⛔ **STILL
GATED, exactly two:** every `git push`/deploy, and the owner's WALK,"* with **persisted shapes** listed
under **✅ TAKEN**.

**CS-9 is not one of the two.** On the amendment's face it has decayed from owner-gated to chair-class.
**I am not ruling that** — applying the chair's own amendment to a specific row is a chair act, and this
is a measurement lane. **Reported as: probably decayed, needs one sentence from the chair.**
It is worth one sentence: CS-9 gates CHARSET Car 2, which gates one of the two `L-DOORS` halves.

---

## 5 · ⛔ A DECAY NOBODY HAS RECORDED: THE OSR RUNG IS SPENT

**CONFIRMED, both directions:**
```
ca651d54b (§890) : scripts/.observed-shape-readers-baseline.json  schema = 15   frozen 2026-09-03
90702c3e9 (§895) : scripts/.observed-shape-readers-baseline.json  schema = 16   frozen 2026-09-04
                                                                  frozenAtSha c08df7d59
```
§893.2 records the cause: *"The OSR rung 15 -> 16 was **MINTED**, not absorbed."* — spent by ENCOUNTERS.

**Why this matters.** The lighting charter's **CH-8** ruling (§882.1) is *"**ONE schema-16 OSR
migration**"*, and `LGT-P15-EP1` is chartered as *"the EP-1 corpus RE-KEY + **the wave's ONE schema-16
migration**"*. **Rung 16 no longer belongs to the lighting wave.** A lane reading that charter will
either conclude the migration is already done, or mint a rung that collides.

**What I can and cannot say:**
- **CONFIRMED:** the number "16" in the charter is stale. The wave's migration, if still owed, is
  schema **17**.
- **CANNOT DETERMINE:** whether the wave still owes a migration *at all*. That depends on whether the
  EP-1 re-key crosses the detector, which is a property of code nobody has written.
  ⚠ The standing hazard applies: **a shape crossing `MIN_ROWS = 40` detonates the OSR ratchet**
  (`minRows: 40` CONFIRMED in the baseline at the tip).

---

## 6 · WHAT ACTUALLY GATES WHAT

**The three items are NOT three independent blocks, and two of them DOUBLE-COUNT.**

### 6.1 Overlap — the same work is billed twice

| lighting item | is the same work as | consequence |
|---|---|---|
| `LGT-P9-CS9` (prerequisite build 9) | **HORIZON-DARK B1** (CHARSET Car 2 / CS-9's plant) | one car, two dockets |
| `LGT-P3-CAPSIG` (prerequisite build 3) | **HORIZON-DARK B6** (the three CAPACITY evidence measurements) | `RECONCILED.json` B6 says so explicitly: *"Named by both HORIZONVOL (E44) and LIGHTING (LGT-P3-CAPSIG)"* |

⇒ **"lighting 31 + HORIZON-DARK 6" is NOT 37 distinct items. It is at most 35**, and a plan that adds
them will over-book two of the highest-risk cars.

### 6.2 The real dependency graph (CONFIRMED where a probe settles it)

```
HORIZON-DARK B1 (CHARSET Car 2)  ──gates──>  LGT-C3B-DOORS (i)   charset report→refuse
        └─ itself gated by CS-9 (probably decayed — §4)

HORIZON-DARK B2 (WORKER Car 1)   ──gates──>  LGT-C3B-DOORS (ii)  generationWorker flip
        └─ CONFIRMED hard: the registry entry does not exist (0 hits)
        └─ B3 ──> B4 (both droppable)

HORIZON-DARK B6 (CAPACITY ×3)    ──gates──>  demographicsEnabled inside LGT-C2-DEFAULT
        └─ CONFIRMED: {signed:false, lit:null}

HORIZON-DARK B5 (TUNEREG Car 4)  ──gates──>  NOTHING. Optional, droppable, sequenced last.

W-ARMS                           ──gates──>  NOTHING, and is gated by nothing in either.
LIGHTING WAVE                    ──gates──>  NOTHING in W-ARMS.
```

**⇒ The answer to "which of the three gates another":**
- **HORIZON-DARK gates the LIGHTING WAVE, but only PARTIALLY and only in three named places.** B1 gates
  one of two `L-DOORS` halves; B2 gates the other; B6 gates one flag inside L-DEFAULT.
  **The wave can land without B1 with a named residue** — `wave-plan.md` PART 3 says exactly that, and
  I found nothing contradicting it. B5 gates nothing at all.
- **W-ARMS is gated by NEITHER.** ⭐ Its "after the GOLDEN freeze" slot (§880.5) is, in WARMSSCOPE's
  words and I agree with the reading, *"a chair CLEANLINESS ruling, not a technical dependency"*.
  Its stated ground is *"landing after L9 keeps the GOLDEN freeze's corpus untouched by a display-only
  landing."* **Nothing in the tree binds it.**
- ⭐ **Three W-ARMS items are landable TONIGHT at zero critical-path cost** — B1 (commit the volume),
  B2 (the skeptic pass), A1+B3 (Car 0's five probes). All three are zero product bytes and none depends
  on the freeze (D-8/D-9). This is the cheapest genuinely-parallel work in the arc.

### 6.3 The gap that neither figure funds — RE-CONFIRMED and it MOVED

`doors.md` and `RECONCILED.json` both record it: **the lighting charter has ZERO mentions of the dossier
state-prose corpus across all 436 lines.** The desk work is a parallel track no wave bill funds.

⚠ **The figure has moved and the record has not.** The docket says *"64 dark blocks carrying 2,185
authored variants"*. **§895 records dark blocks 64 → 52** (power leaf 7/7 complete, stressors 3/3,
defense 2 of 11). So the gap is **52 blocks**, not 64, and shrinking under the DESK consists — which are
themselves on none of the three lists.

---

## 7 · WHAT I COULD NOT DETERMINE

1. **Whether the seven voice measures still sit at EXACTLY zero headroom.** The magnitude **ceilings**
   are CONFIRMED at the tip (34/0/15, 382/69/9, 770). Whether the **measured** values still equal them
   needs a `voiceMechanics` run — forbidden by the load discipline. **PLAUSIBLE as of §893.**
2. **The current first-paint closure and engine margin.** Needs a build — forbidden. Every closure
   figure in every artifact I read (1,047,205 / 1,046,712 / 1,046,662 / 675,764) is **at least six
   landings stale.** ⛔ **No closure number in the record should be quoted into a plan tonight.**
3. **The prose car's true rebase cost.** "2 of 200 paths" was measured six landings ago. Re-deriving it
   needs a merge-base + diff against `8f4d5c648`, which I judged too heavy for the current load
   (uptime showed **21.76** with the ratchet running, and one reachability loop already timed out at
   2 min). **The single cheapest measurement that would improve this report.**
4. **Whether the lighting wave still owes an OSR migration at all**, and at which rung (§5).
5. **Whether CS-9 survives §893's carve-out amendment** — a chair call, not a tree fact (§4).
6. **W-ARMS Car 1's sample count N.** The design estimates ~24 against a measured base of 16, but the
   samples are not authored, so the total is not derivable. WARMSSCOPE refused it; I refuse it too.
7. **§713.2's `525/525 + fence 21/21`** (W-ARMS D3). WARMSSCOPE could not locate a comparator by name at
   `f537ce47e`; I did not attempt it. ⚠ §893.3 records *"§713.2 became an instrument"* — the dormancy
   oracle gained its bit arm — so **this figure's home may now exist and should be re-checked before
   D3 is priced.**
8. **How many of the 17 backlog keys the wave lights.** A design choice not yet made (§1.4).

---

## 8 · CORRECTIONS TO THE BRIEF

The brief invited these, and there are three.

1. ✅ **The brief's premise is right, and understated.** It said the "census FULL at 10/10" blocker was
   provably stale. It is — **and the count was the smaller half of the error.** The mechanism was also
   wrong: `totalTests`/`totalFiles` are 90 % collapse floors, so a new test file could never have
   breached them even at 10/10 (D-2). The blocker was never true *in the form it was stated*.

2. ⚠ **"the known-failure census is now 6 of 17" needs one qualification.** Both numbers are CONFIRMED
   (`entries` = 6; `CEILING = 17` at `testRatchet.test.js:182`, asserted `:268`). But "6 of 17" reads as
   *11 slots available to bank reds in*, and that is not the operating rule. `check-test-ratchet.mjs:50`:
   *"A NEW REGRESSION IS NEVER BASELINED. `--update` can only REMOVE entries"*, and the baseline `_doc`:
   *"A failing test ABSENT from `entries` is a REGRESSION and reds the gate … adding one is a
   deliberate, attributed hand edit."* ⇒ **17 is a structural cap on how many rows may exist, not a
   budget of permitted reds.** Every wave car still lands green or does not land. The correct
   conclusion is the one D-2 gives: **the cars never needed slots in the first place.**

3. ⛔ **The brief's list of where to look omits the one thing that would have changed the answer.**
   `docs/DESIGN_HORIZON.md` is alive on the ledger branch (728,943 B) and `LIGHTING-INVENTORY.md` is
   **dead everywhere** (§0). The asymmetry is the single most consequential fact in this report and it
   is not a scope figure at all.

---

## 9 · THE THREE FIGURES, IN ONE TABLE

| item | quoted | **measured** | done / open | label |
|---|---|---|---|---|
| **LIGHTING WAVE** | "6 cars + 16 prerequisites" (22) | **31 docket items** = 16 builds + 6 cars + 2 register acts + 1 prose car + 6 owner rows | **0 done · 4 partial · 27 open** | CONFIRMED |
| **W-ARMS** | "14 items" | **14** — A1–A5 · B1–B3 · C1–C2 · D1–D4 | **0 done · 14 open** (A5 out of the landing ⇒ 4 landable build cars) | CONFIRMED |
| **HORIZON-DARK** | "5 cars" | **5 build cars + 1 zero-byte measurement block = 6 items** | **0 done · 6 open** (3 firm, 2 droppable, 1 measurement) | CONFIRMED |
| *(doors)* | "151 doors, 113 dark" | **152 doors, 38 lit, 114 dark** — `chanceEncountersEnabled` joined `ENGINE_GATED` (29→30) at §893.2 | — | CONFIRMED |
| *(overlap)* | — | **lighting ∩ HORIZON-DARK ≥ 2** (`LGT-P9-CS9` ≡ B1; `LGT-P3-CAPSIG` ≡ B6) | — | CONFIRMED |
