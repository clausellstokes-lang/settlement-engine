# WY (WAYFARE) — THE LEDGER READER'S TABLE — 2026-09-16

**Seat:** the LEDGER READER for family WY (wayfare, items 44–67 C). Sibling seat (`older.md`) reads the older programmes in code; this file reads the ODQ, the queue docs, and the git log, and code-checks every claim it makes.

**Sources read at:**
- Ledger docs: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad/ledger-a803dee7a/docs` (branch copy `a803dee7a`).
- Code / git: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneCONSIST-932`, HEAD `315080928` (2026-09-15, "LT37 car 6"), 12,181 commits reachable from `--all`.
- Volume: `docs/DESIGN_FP_ARCH_WY.md`, 1,721 lines, twelve waves in two lanes.

**Status: COMPLETE.** 28 claims, 10 grep traps. Every figure below is an executed receipt quoted with `path:line` or `§:line` ⇒ **CONFIRMED**; two rows that rest on a judgment rather than a measurement are marked **PLAUSIBLE** and say why. Read-only throughout — no git state mutated, no test run.

---

## A. THE ANSWER FIRST

### A.1 The one-sentence answer

**Nothing in the WY family was ever built.** Across the whole 12,181-commit history of the product lineage there is **not one build car for any of WY's twelve waves**; every WY-shaped commit in the log is a *document* commit (a fold, a census, a docs-debt sweep). The only WY artefact that exists in code today is **one word in a test file** — `'WY'` inside `CHARTERED_VOLUME_PREFIXES` at `tests/domain/couplingRegistry.test.js:108` — admitted in the 2026-08-05 fold *without* the cross-layer registry row that the same file's docstring says must arrive in that row's own commit. That single token is **LANDED-INERT**. Everything else the volume describes is **DESIGNED-ONLY**.

This is the opposite of the TRADE pilot's shape. Trade's answer was "the physics was built in July under other names, the agency layer has three commits." WY's answer is "**the design is complete, stamped, compiled to execution-ready, and has never been dispatched**" — and the substrate it was chartered to *consume* (roads, missions, caravans, sea lanes, army transit) was built long before WY existed, which is the sibling seat's estate, not a WY landing.

### A.2 The receipts that settle it

| # | Receipt | Executed evidence |
|---|---|---|
| R1 | Zero build cars for any WY wave | `git log --all -i --grep=WY-0 … --grep=WY-11` over 12,181 commits returns **9 commits total, all docs**: `dd0cc340d` `edea9b1fc` `5a44b5db3` `84f50fe49` `0c95ea33d` `d840a3a6a` `7794cb4a9` `d789f9f5a` (folds/censuses/docs-debt) — and `84f50fe49` is *ES-2*, which merely names WY-6. |
| R2 | Zero WY flags in code | All **eight** flag names (`severityDurableRumorsEnabled`, `caravanBodiesEnabled`, `flowMigrationPhysicalEnabled`, `migrationCargoEnabled`, `moversCarryNewsEnabled`, `caravanSeizureEnabled`, `caravanFloorEnabled`, `armySupplyEnabled`) = **0 files** under `src/**` + `tests/**` at HEAD. |
| R3 | Zero WY fields in code | `kmScale` 0 · `supplyCargo` 0 · `prizeCargo` 0 · `legDepartTick` 0 · `faithCargo` 0 files. (`causeReceipt` shows 2 files — **a grep trap**, see §C.) |
| R4 | Zero WY-minted leaves | `modeSpeeds` `severityDurability` `moverTidings` `armySupply` `armyCaravanSeizure` `flowRegimeContract` `treatyProjection` `personProjection` `wayfareMirror` `mapLayerManifest` `armyProjection` `linesForEntity` `resolveOwningCampaign` — **all 0 files**. |
| R5 | The ledger says so too, twice, independently | `FABLE_VALIDATION_QUEUE.md:4053-4054` — "WY LANE E … 7 waves / **0 landed** / 7 remaining" and "WY LANE S … 5 / **0** / 5". `RESUME_STATE.md:2578` (Lane FPC's fresh census, method-law honored) — "**WY 0/7**". `RESUME_STATE.md:2260` says the same. |
| R6 | The one thing that did land | `tests/domain/couplingRegistry.test.js:108` — `const CHARTERED_VOLUME_PREFIXES = Object.freeze([… 'ES', 'WY', 'HB', 'ENC'])`, while `git grep -E '\.WY-[0-9]'` over `src/**`+`tests/**` returns **0**. The file's own docstring at `:101-102` says "The FIRST ES or WY row additionally widens the owningVolume set asserted below, in that row's own commit" — i.e. the file itself records that WY's first row never came. |
| R7 | It was never built and then reverted, either | `git log --all -S<term> -- 'src/'` run for all eight flags and twelve leaf/field identifiers over 12,181 commits returns **empty for every one**. The single exception is `kmScale`, whose one hit is a *comment asserting its own absence* on a sealed sandbox tip (claim 27). Output kept at `history/WY/pickaxe-src.txt`. |

### A.3 Per-wave verdict (all twelve)

| Wave | Charter (one line) | Flag | Status | Code evidence |
|---|---|---|---|---|
| WY-0 | The lawful canvas: delete TravelersLayer chevron/flip/tooltip + WarFaithMapOverlay arrows; mint `mapLayerManifest.walker.test.js` | none | **DESIGNED-ONLY** | `mapLayerManifest` = 0 files; no `WY-0` commit exists in 12,181 |
| WY-1 | The scale charter: `spatialDigest.kmScale` + NEW `modeSpeeds.js`, hopWeeks absolute arm | data-gated by `kmScale` | **DESIGNED-ONLY** | `kmScale` 0 files, `modeSpeeds` 0 files |
| WY-2 | The durable truth: severity-scaled rumor weathering, NEW `severityDurability.js` | `severityDurableRumorsEnabled` | **DESIGNED-ONLY** | flag 0 files, `severityDurability` 0 files |
| WY-3 | The mover bodies: F1 `departTick` + F2 `path` on shipments, F3 `legDepartTick` at nine sites, NEW `flowRegimeContract.js` | `caravanBodiesEnabled` | **DESIGNED-ONLY** | flag 0, `legDepartTick` 0, `flowRegimeContract` 0 |
| WY-4 | The population cargo + the exactly-one fence: F4 `faithCargo`, F5 `causeReceipt` on migration columns | `flowMigrationPhysicalEnabled` + `migrationCargoEnabled` | **DESIGNED-ONLY** | both flags 0, `faithCargo` 0; `causeReceipt`'s 2 hits are a different family (§C trap 2) |
| WY-5 | The carried word: NEW `moverTidings.js`, the going-dark read, Herald kind `no_word_from` | `moversCarryNewsEnabled` | **DESIGNED-ONLY** | flag 0, `moverTidings` 0 |
| WY-6 | The prize arm + the closed encounter-pairs walker (born seeing fifteen), F8 `prizeCargo` | `caravanSeizureEnabled` | **DESIGNED-ONLY** | flag 0, `armyCaravanSeizure` 0, `prizeCargo` 0 |
| WY-7 | The projection spine: NEW `treatyProjection.js`, `personProjection.js`, `wayfareMirror.walker.test.js`, the WarFaithSection phantom retirement | none | **DESIGNED-ONLY** | all three leaf names 0 files |
| WY-8a | The supply train: NEW `worldPulse/armySupply.js`, F9 `supplyCargo`, consumption/condition coupling, rest-debits + requisition-resistance | `armySupplyEnabled` | **DESIGNED-ONLY** | flag 0, `armySupply` 0, `supplyCargo` 0; `src/domain/war/` still does not exist (the C-WYF-2 re-home premise holds) |
| WY-8b | The army mirror: `armyProjection.js`, the CONDITION_BANDS rename, the supply band facet | (rides 8a) | **DESIGNED-ONLY**, and its M2/M4 instructions have **rotted** | `armyProjection` 0 files; the collision it was to cure is still live at `src/domain/display/armyStrength.js:133` (see claim 12) |
| WY-9 | The clickable canvas: four sub-layers, PortablePopup popups, the covert tightening, `linesForEntity` | store-gated | **DESIGNED-ONLY** | `linesForEntity` 0 files; the chosen primitive `PortablePopup.jsx` **does exist** (SP-6's, not WY's) |
| WY-10 | The flow layers: caravan + population sub-layers bound to F1/F2/F4/F5 | store-gated | **DESIGNED-ONLY** | blocked at source — the fields it binds to are 0 files |
| WY-11 | The lifeblood envelope: the subsistence circulation floor + density soak instrument + the eight batched cert rows | `caravanFloorEnabled` | **DESIGNED-ONLY** | flag 0 files |

**Score: 0 built / 0 part-built / 12 designed-only.** Plus one LANDED-INERT artefact (the prefix token) that belongs to no wave.

### A.4 What the history actually contains — the five acts

WY's whole recorded life is five *document* acts and one *compile*, with no build in any of them:

1. **2026-08-05 — the volume is authored and folded.** `d789f9f5a` "Fold 1/3: the two owner-amendment volumes land" + `7794cb4a9` "Fold 3/3" + `edea9b1fc` "Fold sweep". The volume is promoted to repo form at `32cc17f75`. The prefix admission (R6) rides this fold. Five chair rulings Q1–Q5 baked.
2. **2026-08-05/06 — the blanket sign-off releases the one owner gate.** The owner grants "I give permission for everything that requires my sign off in the full queue"; F9 `supplyCargo` moves from ⛔ PARKED to **RELEASED TO BUILD** (`FABLE_VALIDATION_QUEUE.md:2613`). Nothing builds on it.
3. **2026-08-07 — the HB/WC/EP fold re-cites WY.** `dd0cc340d` + `5a44b5db3`; WC takes a **hard gate on WY-8a's build** that is still unreleased today.
4. **2026-08-1x — Lane WY-S, the substrate sweep.** 126 claims / 102 TRUE / 11 REFUTED / 13 UNVERIFIABLE (`RESUME_STATE.md:1580-1593`, annex `laneWYS-WY-SUBSTRATE.md`). This is the single richest WY record in the estate and it appears in **no other queue document**.
5. **2026-08-15/16 — the round is stamped, the volume is swept, the train is compiled, and everything parks.** ODQ §94 accepts the WY round and closes the sitting in one act (four chair-owed items closed). The same day `51ec5a103` applies **eleven stale-site blocks** to the volume (+46/−12) and `d840a3a6a` lands the F9 strike-and-point at five build-branch sites. ODQ §144.2 then reports TC26 compiled **`wy-0` (5 flagless members)** to *execution-ready*. It was never dispatched — the consist has no `wy-0` commit — and **nothing named WY has changed anything since 2026-08-16**, roughly 540 cars before HEAD.

### A.5 The three live blockers (all still alive in code today)

| Blocker | Recorded at | Still alive? |
|---|---|---|
| **WC-10 HARD-GATES on WY-8a built** | `SOL_QUEUE.md:411-412`; `DESIGN_FP_ARCH_WC.md:6656` row 5 ("`WC-10 <- WC-3, WC-6 [HARD GATE: WY-8a built]`") | **YES — CONFIRMED.** `armySupplyEnabled` and `supplyCargo` are 0 files at HEAD, so WC-10 is still undispatchable. WC is 0/17. |
| **The cn / WAR CONSOLE family banks until WY lands** | ODQ §126.4, §130.2, §132.2 ("The charter BANKS until WY lands, per §130.2") | **PARTLY LIFTED BY RE-READING, NOT BY A BUILD** — ODQ §144.3 re-reads the condition as "§130's WY condition = TC26 done" (WY *compiled*, not landed) and unlocks cn's compile; §148.1 then compiles cn-1 carrying "WY-8a supply section as a signed §77 R3 fork". The *execution* gate on a built WY was never satisfied. |
| **C-WYF-3, the CONDITION_BANDS collision** | ODQ §94.2(i): "the collision is a LIVE three-scalar army-supply model the volume never names"; the rename "executes at compile (measured free — zero external consumers)" | **YES — CONFIRMED LIVE.** `src/domain/display/armyStrength.js:133` still declares `const CONDITION_BANDS`, still supply-worded, still derived from a different quantity. See claims 12–13. |

---

## B. THE FULL CLAIM TABLE (ledger order)

Status vocabulary: **LANDED-IN-CODE** (the code does the described behaviour today) · **LANDED-DARK** (leaf exists, no preset lights it) · **LANDED-INERT** (leaf exists, nothing reaches it) · **LANDED-THEN-REVERTED** · **DESIGNED-ONLY** · **RECORD-NE-CODE** (the ledger says a thing the consist contradicts) · **RECORD-NE-RECORD** (two ledger sites contradict each other).

---

**Claim 1 — The WY volume was authored, folded and promoted to repo form.**
- **Source:** `docs/DESIGN_FP_ARCH_WY.md:1-7` ("Master architect, 2026-08-05; PROMOTED TO REPO FORM AT THE QUEUE FOLD, 32cc17f7"); `SOL_QUEUE.md:223-224`.
- **Shas verified:** `d789f9f5a 2026-08-05 Fold 1/3: the two owner-amendment volumes land, and every binding document agrees` · `7794cb4a9 2026-08-05 Fold 3/3: the queue rows, the ledger row, and the executed occupation census` · `32cc17f75 2026-08-05 Ledger: FP BUILD CYCLE 1 CLOSED — twelve commits, four gates, everything dark`. All three exist.
- **Status:** **LANDED-IN-CODE** (as a document). The volume is present on **both** branches and is **byte-identical** — `cmp` of the ledger copy against `HEAD:docs/DESIGN_FP_ARCH_WY.md` returns equal, 1,721 lines each.
- **Label:** CONFIRMED.

---

**Claim 2 — WY was admitted to `CHARTERED_VOLUME_PREFIXES` as the eleventh prefix, in the fold, WITHOUT its promised first registry row. The token is still there and still reaches nothing.**
- **Source:** `SOL_QUEUE.md:377-380` — "ES joins `CHARTERED_VOLUME_PREFIXES` as the TENTH prefix and WY as the ELEVENTH, **each in the SAME commit as its own first cross-layer registry row**." Refuted-in-place by `RESUME_STATE.md:1589-1590`: "WY admitted to CHARTERED_VOLUME_PREFIXES WITHOUT its promised registry row".
- **Code evidence:** `tests/domain/couplingRegistry.test.js:108` → `const CHARTERED_VOLUME_PREFIXES = Object.freeze(['WR', 'TR', 'GR', 'WF', 'POP', 'IN', 'INT', 'SP', 'CW', 'ES', 'WY', 'HB', 'ENC']);` — `'WY'` present. `git grep -nE '\.WY-[0-9]' HEAD -- 'src/**' 'tests/**'` → **0 hits**; no coupling id anywhere names a WY wave. The file's own docstring at `:101-102` states the obligation is unmet: "The FIRST ES or WY row additionally widens the owningVolume set asserted below, in that row's own commit." The ENC note at `:104-107` (2026-09-03) explicitly contrasts itself — "Its first live row is the ladder kernel's consume of a meeting mark deposit, **exactly as the header says the first ES or WY row would be**."
- **Status:** **LANDED-INERT** — this is the *only* WY token in the tree, and nothing reads it as a WY row.
- **Label:** CONFIRMED.

---

**Claim 3 — Zero of WY's twelve waves ever landed a build car, on any branch.**
- **Source:** the negative is the finding; the positive record is `FABLE_VALIDATION_QUEUE.md:4053-4054` and `RESUME_STATE.md:2578`.
- **Code evidence:** `git -C <consist> log --all -i --grep=<WY-0 … WY-11>` over 12,181 commits returns nine distinct commits, **every one of which is a docs act**: `dd0cc340d 2026-08-07 Fold 1/4: HABIT, WAR CIRCULATION and ADVANCE EPOCH land…` · `edea9b1fc 2026-08-05 Fold sweep: the verifier's four one-line cures…` · `5a44b5db3 2026-08-07 Fold 3/4: the queue rows, the ledger row, and the three gates that survive the fold` · `84f50fe49 2026-08-06 ES-2: the gauntlet rolls…` (an *ES* car naming WY-6) · `0c95ea33d 2026-08-06 The wave census is MEASURED for the first time…` · `d840a3a6a 2026-08-15 EFF-M4 I1: the docs-debt consolidation and the F9 strike-and-point` · `7794cb4a9` · `d789f9f5a`. Grep for `WY-0`, `WY-3`, `WY-4`, `WY-5`, `WY-7`, `WY-9`, `WY-10`, `WY-11`, `laneWY` returns **nothing at all**.
- **Status:** **DESIGNED-ONLY** (the family).
- **Label:** CONFIRMED.

---

**Claim 4 — The FVQ's derived remaining-work table records WY at 0 landed in both lanes, and states the method by which it was derived.**
- **Source:** `FABLE_VALIDATION_QUEUE.md:4035` heading "THE REMAINING-WORK TABLE — RE-DERIVED FROM THE VOLUMES' OWN §5 TABLES"; rows at `:4053` (`| WY LANE E (rides FP §5) | same §5, WY-1/2/3/6/11/4/5 | 7 | 0 | 7 |`) and `:4054` (`| WY LANE S (surfaces) | … | 5 | 0 | 5 |`). The method is stated at `:4044-4046`: "Landed set: `git log --oneline` on `claude/composite-r4` filtered to wave-shaped subjects, then **each candidate read**."
- **Corroborating:** the same block at `:4066-4072` carries the standing warning that produced the method — "⚠ ES-4 HAS NOT LANDED, AND THE COMMIT LOG READS AS IF IT HAD… `8a4b0aef`'s own body opens **'THE WAVE DID NOT LAND.'**". WY has no such trap because it has no wave-shaped commits at all.
- **Status:** ledger and code **AGREE**.
- **Label:** CONFIRMED (re-derived independently by claim 3).

---

**Claim 5 — Lane FPC's fresh census (the method-law census) independently scores WY 0/7.**
- **Source:** `RESUME_STATE.md:2570-2578` — "✅ Lane FPC COLLECTED (~04:45): THE FRESH FP CENSUS — 111 declared / 22 landed whole / 4 part-built / 85 REMAINING … Per family: … **WY 0/7** · WF 0/10 · POP 0/8 · INT 0/8 · HB 0/10 · WC 0/17 · EP 0/6." Method explicitly stated: "landed-state by flag-manifest membership, packet ancestry + CREATE-path existence, or live test markers, **never commit subjects or module-name presence, both of which produced false positives at EP and ES-5c**."
- **Note:** this census counts only WY's seven ENGINE waves; the five surface waves are counted in FVQ's table (claim 4).
- **Status:** ledger and code **AGREE**.
- **Label:** CONFIRMED.

---

**Claim 6 — ODQ §94: the WY round was ACCEPTED and the WY sitting CLOSED in one act, 2026-08-15. WY is STAMPED.**
- **Source:** `OWNER_DECISION_QUEUE.md:3561-3599`, "## §94 · THE WY ROUND ACCEPTED — AND THE WY SITTING CLOSED IN ONE ACT (2026-08-15, chair, vetoable; evidence laneWYF-round.md + laneWYF-report.md, volume blob verified unchanged across all three in-window ledger moves)". Item 4 at `:3596`: "**WY is STAMPED. Six of seven rounds done** (WC/WF/EP/POP/INT/WY); TL-F (the tails, the LAST round) dispatched".
- **What "stamped" means here:** the *architecture* round passed — not a build. Item 1 at `:3566-3571`: "absorption 7/11 + 4 structural rows SIGNED here (WY had no cure surface; its §7+FVQ rulings were Fable-surveyed — that debt discharged) … law pass 6 MATERIAL / 8 DRIFT / 10 HOLDS with all five §7 rulings validated."
- **Code evidence:** no code changed — the evidence files (`laneWYF-round.md`, `laneWYF-report.md`) are scratchpad annexes, not repo files, and `git log -i --grep=WYF` returns exactly one commit, the docs-debt one (`d840a3a6a`).
- **Status:** **DESIGNED-ONLY** (a ruling about a design).
- **Label:** CONFIRMED.

---

**Claim 7 — ODQ §144.2: TC26 compiled WY's build train `wy-0` (five flagless members) to EXECUTION-READY. It was never dispatched.**
- **Source:** `OWNER_DECISION_QUEUE.md:5341-5344` — "**TC26 (WY/POP): wy-0 (5 flagless) + pop-1 (5, §2.5 flag-LEADS shape) compiled to execution-ready; §125.4 derived not signed** (ARMY_SIZE_EDGES/COLUMN_SIZE_EDGES/GAIN 0.2 await the tuning signature)." Dispatched by §140.2 at `:5212-5214`.
- **Code evidence:** `git log --all -i --grep=wy-0` → **0 commits**. `git log --all -i --grep=TC26` over the consist likewise yields no WY build car. The five flagless members are the five waves that need no flag mint — WY-0, WY-1 (data-gated), WY-7, WY-9, WY-10 — and none of their leaves exist (`mapLayerManifest` `modeSpeeds` `treatyProjection` `personProjection` `wayfareMirror` `linesForEntity` `resolveOwningCampaign` = 0 files each).
- **Status:** **DESIGNED-ONLY** — a compiled, execution-ready train that never boarded.
- **Label:** CONFIRMED.

---

**Claim 8 — F9 `supplyCargo` was OWNER-GATED, then RELEASED by the blanket queue sign-off. The release is real; four ledger sites still say "UNSIGNED".**
- **Source (the park):** `FABLE_VALIDATION_QUEUE.md:2559-2561` — "⛔ **PARKED — OWNER-GATED, RECORDED, NOT BUILT BY THIS FOLD OR ANY WAVE UNDER IT:** (1) the **F9 `supplyCargo` sign-off row** — WY-8a does not build until the owner signs it".
- **Source (the release):** `FABLE_VALIDATION_QUEUE.md:2613-2614` — "**RELEASED TO BUILD (at their queue positions, not immediately):** the F9 `supplyCargo` sign-off row (WY-8's gate — WY-8 builds whole)", under the owner grant of 2026-08-05 recorded at `:2605` ("I give permission for everything that requires my sign off in the full queue"). Corroborated at `RESUME_STATE.md:1581` ("⭐ F9 `supplyCargo` IS SIGNED at HEAD") and `docs/archive/memory-estate/owner-blanket-queue-signoff.md:27`.
- **The stale survivors on the LEDGER branch (all four still read UNSIGNED / not-signed today):** `SOL_QUEUE.md:233` ("WY F9 `supplyCargo` (UNSIGNED — and WC-10 HARD-GATES on it)") · `SOL_QUEUE.md:376` ("**F9 (`supplyCargo`) is UNSIGNED: no build until the owner signs it**") · `SOL_QUEUE.md:499` ("⛔ Slice 8a does not build until the owner signs the F9 `supplyCargo` row") · `START_HERE.md:471` ("WY F9 `supplyCargo` UNSIGNED (WC-10…"). Also `FABLE_VALIDATION_QUEUE.md:5930` and `:2560`.
- **Status:** **RECORD-NE-RECORD** — the same branch's `SOL_QUEUE.md:412` says the opposite ("`supplyCargo` is owner-SIGNED but UNBUILT"), so SOL_QUEUE contradicts itself internally across 36 lines.
- **Label:** CONFIRMED.

---

**Claim 9 — The C-WYF-1 "strike-and-point" cure landed on the BUILD branch and NOT on the LEDGER branch. The two branches are cured in different places and neither is whole.**
- **Source (the ruling):** `OWNER_DECISION_QUEUE.md:3577-3581` (§94.2 ii) — "F9 — **STRIKE-AND-POINT at all SIX sites** (the census was under-enumerated; DFA:3043 is the no-adjacent-note grep-trap): ledger sites join the batched micro-act; the FVQ/SOL sites ride the next build-branch docs member."
- **Sha verified:** `d840a3a6a 2026-08-15 EFF-M4 I1: the docs-debt consolidation and the F9 strike-and-point`. Its body: "The F9 strike-and-point (C-WYF-1 Arm A) lands at **FIVE build-branch sites, not the four dispatched**: an exhaustive re-grep found a third SOL_QUEUE site with no adjacent note at all". It also records the routing: "⛔ One dispatched item is NOT landable here and is ROUTED, not dropped: `docs/START_HERE.md` is a LEDGER file and does not exist on this branch (executed both ways with ls-tree)."
- **Executed comparison (both copies read):**
  - BUILD `HEAD:docs/SOL_QUEUE.md:250` = "WY F9 `supplyCargo`, WC CR-WC-9 …" with a new `:252` "⚠ **F9 and CR-WC-9: SIGNED, released at their queue positions**" → **CURED**. LEDGER `SOL_QUEUE.md:233` still carries "(UNSIGNED — …)" → **STALE**.
  - BUILD `HEAD:docs/SOL_QUEUE.md:400` = "⚠ **F9 (`supplyCargo`): SIGNED, released at its queue position**" with a "*(Point, don't restate: the superseded … spelling stood inline here until the …)*" note → **CURED**. LEDGER `SOL_QUEUE.md:376` still carries the superseded spelling → **STALE**.
  - BUILD SOL_QUEUE has no "Slice 8a does not build until the owner signs" line at all → **CURED**. LEDGER `SOL_QUEUE.md:499` still has it → **STALE**.
  - Inversely: LEDGER `DESIGN_FP_ARCHITECTURE.md:669` = "F9 `supplyCargo`: ⏱ SIGNED — released at its queue position" and `:3007-3008` = "⏱ The F9 `supplyCargo` sign-off row — SIGNED SINCE (released at its queue position…)" → **CURED on the ledger**. BUILD `HEAD:docs/DESIGN_FP_ARCHITECTURE.md:3043` = "The F9 `supplyCargo` sign-off row (no build until the owner signs it)" with **no adjacent note** → **STILL THE BARE GREP-TRAP §94 NAMED**, on the build branch, a month after the ruling.
  - File sizes confirm the fork: LEDGER `SOL_QUEUE.md` = 616 lines, BUILD = 654 lines.
- **Status:** **RECORD-NE-RECORD**, both directions. The volume itself (`DESIGN_FP_ARCH_WY.md`) is byte-identical on both branches; the *queue* docs around it are forked.
- **Cross-reference:** ODQ §151.4 at `:5586-5590` charters the cure — "**THE VOLUME UNFORK is ruled a DEDICATED docs train (uf-1)** … Scope: WC (MERGE — neither copy a superset), INT, CW, **WY**, POP fold-to-build". `git log --all -i --grep=uf-1` finds no such train landed.
- **Label:** CONFIRMED.

---

**Claim 10 — C-WYF-2: WY-8a's writer was re-homed to `src/domain/worldPulse/armySupply.js` because `src/domain/war/` does not exist. The premise still holds.**
- **Source:** `OWNER_DECISION_QUEUE.md:3581-3584` (§94.2 iii) — "**WY-8a BINDS to `src/domain/worldPulse/armySupply.js` beside supplyWebWarfare** (twin-note pairing; the absent `src/domain/war/` reservation dissolves at zero cross-volume cost)." Grounded by `RESUME_STATE.md:1587-1588` ("`src/domain/war/` DOES NOT EXIST (WY-8a's path reservation collides with nothing — silent)").
- **Code evidence:** `git ls-tree --name-only HEAD src/domain/ | grep -c '^src/domain/war$'` → **0**. No `war` directory or file at that level. `armySupply` → 0 files; `supplyWebWarfare.js` exists (the twin the note was to pair with).
- **Status:** **DESIGNED-ONLY** — the ruling stands unexecuted; the premise it rests on is still true.
- **Label:** CONFIRMED.

---

**Claim 11 — C-WYF-3: the one-supply-truth contract was SIGNED, and the collision it cures is STILL LIVE in code.**
- **Source:** `OWNER_DECISION_QUEUE.md:3572-3577` (§94.2 i) — "(i) CONDITION_BANDS — **the collision is a LIVE three-scalar army-supply model the volume never names**, and **WY-8a as written DOUBLE-DRIVES attrition and reinforcement**: C-WYF-3's one-supply-truth contract is SIGNED; the rename executes at compile (measured free — zero external consumers)."
- **Code evidence — the three scalars, confirmed:** `src/domain/display/armyStrength.js:146-150`:
  ```
  const supply = clamp01(num(record?.supplyIntegrity, 0.5));
  const morale = clamp01(num(record?.morale, 0.5));
  const food   = clamp01(num(record?.foodReserve, 0.5));
  const health = Math.min(supply, morale, food);
  ```
  Three scalars (`supplyIntegrity`, `morale`, `foodReserve`) off the deployment record — exactly the "LIVE three-scalar army-supply model the volume never names". The supply-worded ladder is at `:133-137`: `{ floor: 0.66, phrase: 'well supplied and in good heart' }` / `{ floor: 0.4, phrase: 'supply lines strained, morale wavering' }` / `{ floor: 0, phrase: 'starving and demoralized, close to falling apart' }`.
- **Status:** **DESIGNED-ONLY** for the cure; the collision is **LANDED-IN-CODE and unchanged**. WY-8b's M4 mint was to execute the rename "at compile" — there was no compile.
- **Label:** CONFIRMED.

---

**Claim 12 — RECORD-NE-CODE: the volume addresses the collision at `armyStrength.js:94-98`; it is at `:133-137`. Line-address rot of +39.**
- **Source:** `docs/DESIGN_FP_ARCH_WY.md` WY-8b block (~`:1400`) — "⛔ COLLISION RECORDED (C-WYF-3): `armyStrength.js:94-98` already exports a supply-worded `CONDITION_BANDS` deriving from a DIFFERENT quantity".
- **Code evidence:** `git grep -n 'CONDITION_BANDS' HEAD -- src/` →
  ```
  src/domain/display/armyStrength.js:133:const CONDITION_BANDS = Object.freeze([
  src/domain/display/armyStrength.js:152:  const band = CONDITION_BANDS.find(b => health >= b.floor) || …
  src/domain/display/armyStrength.js:237:export const ARMY_STRENGTH_PHRASES = Object.freeze({ STRENGTH_BANDS, REMAINING_BANDS, CONDITION_BANDS });
  ```
  The declaration is at `:133`, not `:94-98`.
- **Note:** the volume's own header hazard block (`:66-70`) anticipated exactly this — "**LIVE CODE OUTRANKS EVERY TABLE IN THIS DOCUMENT** … navigate by SYMBOL, never by any line number". The rot is the documented class realized, not a new defect. Recorded so a builder does not chase `:94`.
- **Status:** **RECORD-NE-CODE** (address only; the substance holds).
- **Label:** CONFIRMED.

---

**Claim 13 — AMBER on the "measured free — zero external consumers" figure that authorized the rename.**
- **Source:** `OWNER_DECISION_QUEUE.md:3576-3577` — "the rename executes at compile (**measured free — zero external consumers**)."
- **Code evidence:** the *symbol* `CONDITION_BANDS` indeed has no importer — the only three references are all inside `armyStrength.js` (`:133`, `:152`, `:237`). **But** `:237` re-exports it inside the frozen bundle `ARMY_STRENGTH_PHRASES`, and that bundle **is** imported externally: `tests/domain/display/forceComposition.test.js:12` (`import { ARMY_STRENGTH_PHRASES } from '…/armyStrength.js';`). That test reads only `.STRENGTH_BANDS` at `:70`, so nothing reads the colliding key today — but the rename touches a key on an exported public shape, which is not the same thing as "zero external consumers".
- **Status:** the ruling's figure is **narrowly true for the symbol and loose for the shape**; a builder executing C-WYF-3 must decide whether the bundle key renames with it.
- **Label:** **PLAUSIBLE** (the consumer count is executed and exact; whether that makes the rename non-free is a judgment, not a measurement).

---

**Claim 14 — RECORD-NE-CODE: WY-8b's M2 instruction ("EXPORT-AND-REUSE `opportunism.js:122`, never a second spelling") has been overtaken — a second, exported `hasMartialRecord` already landed elsewhere, and it is the one the estate now steers toward.**
- **Source:** `docs/DESIGN_FP_ARCH_WY.md` WY-8b block — "the `hasMartialRecord` absence predicate (M2 — ⚠ NOT NEW: the spelling already exists module-local at `opportunism.js:122` with the volume's exact intent documented in-file; **EXPORT-AND-REUSE, never a second spelling** — C-WYF-2 item 2)".
- **Code evidence:** the module-local one is exactly where the volume said — `src/domain/worldPulse/opportunism.js:122` → `function hasMartialRecord(item) { const m = asObject(asObject(asObject(item).settlement).config).faithProfile; return !!asObject(m).martial; }` — and it is **still not exported** (the file's export list has no `hasMartialRecord`). Meanwhile a **second, exported** spelling now exists: `src/domain/worldPulse/martialReadiness.js:256` → `export function hasMartialRecord(settlement)`, consumed at `src/components/new/tabs/WarTab.jsx:48` and `:421`. A walker test names the new one as the preferred spelling: `tests/lint/observedShapeReaders.walker.test.js:1202` — "martialReadiness's **new** hasMartialRecord instead of spelling the faithProfile".
- **Why it matters:** M2's instruction, executed literally today, would export the *deprecated* faithProfile-reading predicate that the estate has already moved away from — the opposite of the "one spelling" intent. The instruction is stale in its target, not in its principle.
- **Status:** **RECORD-NE-CODE**.
- **Label:** CONFIRMED.

---

**Claim 15 — Q4's popup primitive exists (SP-6's), so WY-9's substrate is present; nothing WY reaches it.**
- **Source:** `docs/DESIGN_FP_ARCH_WY.md:57-60` — "**Q4 the popup primitive — PortablePopup MODAL v1** (clicking is reading; canvas occlusion while reading is ACCEPTED; the anchored popover is RECORDED-NOT-BUILT until the modal measurably fails)."
- **Code evidence:** `src/components/primitives/PortablePopup.jsx:2` — "PortablePopup — THE PORTABLE POPUP (SP-6's THE PORTABLE POPUP + THE …)" and `:39` `export default function PortablePopup({ open, title, onClose, children, testId = 'portable-popup', width = 560 })`. One live consumer: `src/components/map/CausalityPopup.jsx:38/:120`. No WY consumer (`linesForEntity` = 0 files; no Wayfare layer family).
- **Status:** the primitive is **LANDED-IN-CODE** (SP-6's landing, not WY's); WY-9's use of it is **DESIGNED-ONLY**.
- **Label:** CONFIRMED.

---

**Claim 16 — CR-ES-6 / E15: the one WY obligation another family DID discharge.**
- **Source:** `FABLE_VALIDATION_QUEUE.md:2516-2537` — "⭐ CR-ES-6 — the ES gauntlet vs the WY encounter table … mounting `espionageGauntlet.js` at **ES-2** ADDS row **E15** (spy-dwell detection) to the WAYFARE volume's §4 closed encounter-pairs table IN ES-2's OWN COMMIT … WY-6's walker is **BORN SEEING FIFTEEN**". Echoed at `SOL_QUEUE.md:334-339`.
- **Sha verified:** `84f50fe49 2026-08-06 ES-2: the gauntlet rolls, and the one thing it cannot do is written down` — this is the only non-fold commit in the whole log that names a WY wave, and it names WY-6 as the *consumer* of its own act.
- **Corroborating ledger:** `RESUME_STATE.md:1592` — "ES-2 landed (WY-6's hedge discharged)".
- **Status:** the ES side **LANDED-IN-CODE**; WY-6's walker (`tests/lint/encounterPairs.walker.test.js`) is **DESIGNED-ONLY** and was never written, so the table it was to close has no walker.
- **Label:** CONFIRMED.

---

**Claim 17 — The WC family takes a hard build-gate on WY-8a that is still unreleased.**
- **Source:** `SOL_QUEUE.md:410-413` — "⛔⛔ **TWO GATES AND ONE ESCALATION, EACH BLOCKING WAVES AND NOT THE LANE:** (1) **WC-10 HARD-GATES on WY-8a built** — F9 `supplyCargo` is owner-SIGNED but UNBUILT and rides §2 LANE B, not this lane, so WC-10 is a SPEC ROW until it clears (CR-WC-14)." Full seam row at `DESIGN_FP_ARCH_WC.md:6656` — "The dependency graph's own gate: `WC-10 <- WC-3, WC-6 [HARD GATE: WY-8a built]`. WC-10 is undispatchable until WY-8a lands".
- **Code evidence:** `armySupplyEnabled` 0 files, `supplyCargo` 0 files, `armySupply` 0 files at HEAD ⇒ the gate has **not** cleared. `DESIGN_FP_ARCH_WC.md:6804` confirms the WC volume re-measured it: "**Row 5's premise HOLDS.** `supplyCargo` and `armySupplyEnabled` return [zero]".
- **Status:** the blocker is **ALIVE IN CODE TODAY**. WC is 0/17 (`RESUME_STATE.md:2578`).
- **Label:** CONFIRMED.

---

**Claim 18 — The WAR CONSOLE (cn) family was chartered to compile only after WY lands; the gate was later re-read as "after WY compiles" and the family compiled anyway.**
- **Source (the gate):** `OWNER_DECISION_QUEUE.md:4716-4718` (§126.4) — "chartered as the WAR CONSOLE family; **compiles after WY (its prime feeder) lands**; slices light with LG". Restated at `:4913-4914` (§130.2) — "the family **COMPILES when WY lands** (its prime feeder) and EXECUTES in the family-train tail". Restated again at `:4965` (§132.2) — "**The charter BANKS until WY lands**, per §130.2."
- **Source (the re-read):** `OWNER_DECISION_QUEUE.md:5352-5353` (§144.3) — "**cn's compile unlocks NOW (§130's WY condition = TC26 done)**" — i.e. the condition is satisfied by WY being *compiled*, not built. `:5448-5449` (§148.1) then reports cn-1 execution-ready "belief/forces/view-model; **WY-8a supply section as a signed §77 R3 fork**; edits ZERO existing production files".
- **Also measured at the charter:** `:4954-4956` (§132.1) — "**The WY trigger is now MEASURED** (the army-supply binding is WY's future act); every console verb is a new walker-demanded command registration (**the registry carries zero war verbs today**)."
- **Status:** a **ruling that drifted** — the gate's words ("lands") and its application ("compiled") differ. Not a code contradiction; a record-vs-record reading a builder should see before assuming cn is unblocked.
- **Label:** CONFIRMED (both texts quoted); the characterization as drift is the reader's, PLAUSIBLE.

---

**Claim 19 — The §125.4 size-scaled speed law was assigned to WY's compile and its bands are DERIVED, NOT SIGNED.**
- **Source:** `OWNER_DECISION_QUEUE.md:4920-4923` (§130.3) — "The speed-scaling law (§125.4) is **assigned to WY's compile for armies** and POP's for columns (it lives with the transit kernels, not the console); the cn charter cites both rather than owning them." Outcome at `:5341-5344` (§144.2) — "**§125.4 derived not signed** (ARMY_SIZE_EDGES/COLUMN_SIZE_EDGES/GAIN 0.2 await the tuning signature)."
- **Code evidence:** `ARMY_SIZE_EDGES` / `COLUMN_SIZE_EDGES` — searched; the WY-side speed table `modeSpeeds` is 0 files. (The de-facto army speed constants that *do* exist — `ARMY_SPEED_FACTOR`, `MAX_MARCH_WEEKS` in `armyTransit.js` — are the older-programme seat's finding, not a WY landing.)
- **Status:** **DESIGNED-ONLY**, and additionally **owner-unsigned** on its tuning bands — a second gate beyond the build gate.
- **Label:** CONFIRMED.

---

**Claim 20 — C-WYF-5: WY is the FIFTH certification-pattern instance; its eight batched cert rows would red the bijection. Ruled, never built.**
- **Source:** `OWNER_DECISION_QUEUE.md:3590-3595` (§94.3) — "**WY is the FIFTH certification-pattern instance** (the deferred-batch variant — WY-11's eight batched cert rows red the bijection at the first flag wave): **C-WYF-5 applies §92.2**. **C-WYF-6 is SIGNED** — eight of nine dial families get derivation homes before any WY band lands (the WF F-5 shape). **C-WYF-7** joins the batched stale-site sitting, now FIVE volumes." The volume's WY-11 block carries the cure: "each row **LANDS AT ITS MINTING WAVE** in `subsystemRowsVirtual.js` with its twin — WY-11 AMENDS the landed rows … never lands them as a batch".
- **Code evidence:** `subsystemRowsVirtual.js` exists but carries no WY rows (all eight WY flags are 0 files, so no row can name one).
- **Related live law:** `OWNER_DECISION_QUEUE.md:5457-5462` (§148.2) — "⛔⛔ **LAW CORRECTION — THE FLAG-MINT BILL IS FOUR OBLIGATIONS, NOT THREE** … Every flag-mint member now owes the fourth obligation." WY has **seven** flag-minting waves, so this correction re-prices the whole family and postdates its compile.
- **Status:** **DESIGNED-ONLY**; the §148.2 correction means WY's compiled price is now **stale**.
- **Label:** CONFIRMED.

---

**Claim 21 — Lane WY-S: a 126-claim substrate sweep exists and is recorded in exactly ONE place in the estate.**
- **Source:** `RESUME_STATE.md:1580-1593` — "**✅ Lane WY-S COLLECTED (~00:30): 126 claims / 102 TRUE / 11 REFUTED / 13 UNVERIFIABLE.** … Sharpest defects: `src/domain/war/` DOES NOT EXIST …; the CONDITION_BANDS design collision …; **WY admitted to CHARTERED_VOLUME_PREFIXES WITHOUT its promised registry row**; covert chokepoints 8 not 5; ES-2 landed (WY-6's hedge discharged). Annex: `laneWYS-WY-SUBSTRATE.md`."
- **Uniqueness (executed):** `grep -rn 'laneWYS\|WY-S' ` over `OWNER_DECISION_QUEUE.md`, `SOL_QUEUE.md`, `FABLE_VALIDATION_QUEUE.md`, `START_HERE.md`, `A_PLUS_ROADMAP.md`, `GOLDEN_SHIFT_LEDGER.md` — the sweep appears **only** in `RESUME_STATE.md`. Its annex `laneWYS-WY-SUBSTRATE.md` is a scratchpad file, not in the repo.
- **Why it matters:** this is the WY analogue of the trade pilot's "FVQ-only landings" — the single record that carries the family's real substrate findings, and it is invisible to anyone reading the ODQ or the queue docs. Three of its five sharpest defects are re-confirmed in code by claims 2, 10 and 11 of this table; I could not verify "covert chokepoints 8 not 5" within this seat's scope.
- **Status:** **RECORD-ONLY** (a finding that lives in one place and would be lost with it).
- **Label:** CONFIRMED for the existence and for the three defects re-measured; the remaining two are PLAUSIBLE on the ledger's word.

---

**Claim 22 — The GOLDEN_SHIFT_LEDGER has ZERO WY entries — consistent with zero landings.**
- **Source / executed:** `grep -c -i` over `GOLDEN_SHIFT_LEDGER.md` for `WY-[0-9]`, `wayfare`, `kmScale`, `armySupply`, `caravanBodies`, `severityDurab`, `moversCarryNews`, `flowMigrationPhysical`, `migrationCargo`, `caravanSeizure`, `caravanFloor`, `modeSpeeds`, `moverTidings` → **0 for every term**.
- **Why it matters:** WY-0 was chartered to move two shipped test files and WY-7 to land disclosed dossier-wording and PDF shifts — both are golden-shift classes. A silent golden ledger is a second, independent confirmation that neither ever executed.
- **Status:** ledger and code **AGREE**.
- **Label:** CONFIRMED.

---

**Claim 23 — `A_PLUS_ROADMAP.md` and `HANDOFF_CURRENT.md` carry NO WY rows at all.**
- **Source / executed:** `grep -c -i` over both files for all fourteen WY terms → **0 hits in each**.
- **Why it matters:** the two documents a successor is told to read first (`HANDOFF_CURRENT.md`, then `START_HERE.md`) mention WY only in `START_HERE.md`, and there only in wave-arithmetic rows (`:251`, `:254`, `:267`, `:272-277`, `:292-293`, `:359`) plus one stale gate row (`:471`). A zero-context successor would not learn from the handoff path that WY exists as a twelve-wave family.
- **Status:** a **documentation gap**, not a contradiction.
- **Label:** CONFIRMED.

---

**Claim 24 — The five chair rulings Q1–Q5 are RECORDED, VETOABLE, and all five are unexecuted.**
- **Source:** `docs/DESIGN_FP_ARCH_WY.md:43-63` — "THE CHAIR RULINGS ARE RECORDED, NOT OPEN (Q1-Q5; §7 is the authoritative record — ruled in the FIRST ruling round by the chair, 2026-08-05, baked at r2 … every one VETOABLE, the owner's veto window is the queue fold". Validated at ODQ §94.1 (`:3570-3571`) — "law pass … with all five §7 rulings validated".
- **The five:** Q1 faith-cargo conservation = the BLEND shape (WY-4) · Q2 home units = DECLARE-ABSENT (WY-8b) · Q3 the WarFaithMapOverlay deployment arrows = DELETED under the ambiguity law (WY-0, "owner-visible with the veto window **open until the wave lands**") · Q4 the popup primitive = PortablePopup MODAL v1 (WY-9) · Q5 the caravan layer = SHIPS ON WY-3 with an honest legend.
- **Code evidence:** none executed — WY-0/3/4/8b/9 are all DESIGNED-ONLY (§A.3). Q3 is the notable one: its veto window was defined as open *until WY-0 lands*, and WY-0 has not landed, so **the owner's veto window on the arrow deletion has stood open since 2026-08-05** — nothing was deleted. `WarFaithMapOverlay` deployment arrows were never touched by a WY act.
- **Status:** **DESIGNED-ONLY** ×5; Q3's veto window is still open by its own terms.
- **Label:** CONFIRMED.

---

**Claim 25 — The volume's own compile provenance names branch `claude/composite-r4` and four measurement bases; all four resolve in the consist.**
- **Source:** `docs/DESIGN_FP_ARCH_WY.md:26-33` — "re-measured against the live minifold worktree (branch claude/composite-r4; censuses at HEAD `e30770bd`, drift-checked to `c7933e84`; the r1 compile at `c7933e84`; the r2 REVISION at `d7ea69a4` … drift-checked to `b441bca5`)".
- **Shas verified (all four exist):** `e30770bd0 2026-08-04 CW-0w slice 4: three raw floats had been reaching the reader outside the scanner entirely` · `c7933e845 2026-08-04 TR-9c: the trade convergence contract, and the lighting law stops being prose` · `d7ea69a4b 2026-08-04 TR-1 THE CASUS COMMERCII: commerce learns to say why it shut the gate` · `b441bca53 2026-08-04 GR-0 THE LIFECYCLE VOICE: the pact grammar learns the two moments it always executed in silence`.
- **Why it matters:** the volume was compiled against a tree from **2026-08-04**. HEAD is **2026-09-15** — roughly 540 cars later. Every premise in it is over a month stale, which is why claims 12 and 14 found rot on the first two premises checked.
- **Status:** the provenance is **sound and verifiable**; the premises it rests on are **aged**.
- **Label:** CONFIRMED.

---

**Claim 26 — LANDED-THEN-REVERTED is ruled out for the entire family by executed pickaxe.**
- **Executed:** `git -C <consist> log --all --format='%h %ad %s' -S'<term>' -- 'src/'` for twenty identifiers — the eight flags, `kmScale`, `supplyCargo`, `prizeCargo`, `legDepartTick`, `moverTidings`, `armySupply.js`, `armyCaravanSeizure`, `flowRegimeContract`, `modeSpeeds`, `severityDurability`, `treatyProjection`, `wayfareMirror` — over all 12,181 commits on all refs.
- **Result:** **nineteen of twenty return zero commits.** No WY flag, field or leaf has ever existed in `src/` on any branch, so none was built and later removed. Raw output preserved at `history/WY/pickaxe-src.txt`.
- **Method note:** the same pickaxe **without** the `-- 'src/'` pathspec returns 35 commits for `modeSpeeds` and 34 for `severityDurability` — all documentation, because the identifiers are spelled inside `docs/DESIGN_FP_ARCH_WY.md` and that file exists on many branches. The pathspec is what makes the test mean anything (trap 4).
- **Status:** the family's status is **DESIGNED-ONLY**, not reverted.
- **Label:** CONFIRMED.

---

**Claim 27 — The only time `kmScale` ever appeared in `src/` in the whole history, it was a sentence asserting that `kmScale` does not exist — and it is on a sealed sandbox tip that never merged.**
- **Executed:** the single hit from claim 26 is `ee0db96d3 2026-08-21 PRESERVE: the sealed fresh-W3 sandbox tip (laneMFW3F-tip, code+tests+harness, no node_modules) — the map generator of record until the D3a port completes; preserved per ODQ §312 (tmp is not durable)`. `git branch -a --contains ee0db96d3` returns **nothing** — it is a detached preservation ref, not on any lineage.
- **The text:** `ee0db96d3:src/domain/townMap/fabric/measure.js:4-6` — "§2.6: *'Our scale bar is TRUE — with a home to build first (MF-R1, convicted at 6b337fb1): no `kmScale` and no physical-distance metric exists anywhere in the estate.'*"
- **The twist, and why it matters to WY-1:** that same file's docstring then **refutes its own programme's conviction** — `:11-19`: "⛔⛔⛔ THE FIRST FINDING IS THAT MF-R1's CONVICTION IS NO LONGER TRUE AND NOBODY NOTICED. A physical-distance metric ALREADY EXISTS at this base and it is LOAD-BEARING: `fields.js` computes `metresPerUnit = METRES_PER_FRONTAGE / frontage` … ⭐ THE CLASS: **A METRIC MINTED INSIDE ITS FIRST CONSUMER IS STILL A METRIC, AND THE ESTATE'S CONVICTION THAT 'NO METRIC EXISTS' GOES STALE THE MOMENT SOMEBODY NEEDS ONE.**"
- **But it does not reach WY:** `metresPerUnit`, `METRES_PER_FRONTAGE`, `REACH_METRES` and `measure.js` itself are **all 0 hits at HEAD** (`git cat-file -e HEAD:src/domain/townMap/fabric/measure.js` → absent). The MAP FABRIC metric lives only in the sealed sandbox. So **WY-1's absolute-distance premise is still true on the product lineage today** — but the estate has already discovered once, elsewhere, that the premise can go stale silently.
- **Ledger cross-reference:** ODQ §152.3 (`:5619-5622`) sends MF-R1 to verify "every machinery claim against the code of record at `6b337fb1` (district-affinity table, exit-road bearings, event log's trace support, **kmScale**, power structure fields)" — the ODQ's two `kmScale` hits (`:5551`, `:5624`) are **MAP FABRIC's, not WY's**. A reader greping `kmScale` in the ODQ and assuming WY will land on the wrong programme.
- **Status:** **DESIGNED-ONLY** for WY-1; the near-miss is recorded because it is the one place in the estate where WY-1's datum name touched code.
- **Label:** CONFIRMED.

---

**Claim 28 — The WY volume's one substantive post-fold docs landing: eleven stale-site blocks applied, two of them chair-placed.**
- **Source:** `OWNER_DECISION_QUEUE.md:3996-4004` (§106.1) — "**NINETY of 107 blocks are APPLIED in this commit** across the nine ledger volumes (WC 8 · WF 9 · EP 10 · POP 12 · INT 14 · **WY 11** · TR 15 · CW 9 · DFA 2): 85 mechanically with strict one-anchor verification, 5 chair-placed (… **the two WY fragments whose STS anchors had dropped the bullet indent**). The CLAIM_RE screen is ZERO on every touched file, before and after."
- **Sha verified:** `51ec5a103 2026-08-15 Execute the nine-volume stale-site sitting: 90 blocks (§106)`. `git show --stat` confirms `docs/DESIGN_FP_ARCH_WY.md | 58 +++---` — **46 insertions, 12 deletions** — alongside nine sibling volumes and the ODQ itself.
- **Status:** **LANDED-IN-CODE** as a document act. Together with `d840a3a6a` (the same day) this is the last time anything named WY changed anything at all — one month of commit clock, and roughly 540 cars, before HEAD.
- **Label:** CONFIRMED.

---

## C. METHOD NOTES AND GREP TRAPS (for the next reader of this family)

**Trap 1 — `WY` is a substring of nothing useful, but `wy` is.** Lowercase `wy` matches `wyvern`, `Conwy`-style names and `alwys` typos. Every search in this fold used either the uppercase token `\bWY\b` or the wave-id form `WY-[0-9]`. The `INSTR-1 ≠ TR-1` class does **not** bite WY: there is no longer identifier ending in `WY-n`. Verified — all five ODQ `WY-[0-9]` hits and all nineteen FVQ hits were read in context and every one is genuinely about wayfare.

**Trap 2 — `causeReceipt` is NOT WY's F5.** `git grep causeReceipt` returns two files, and neither is a migration column: `src/domain/realm/realmItemReadModel.js:321/:341/:344/:659` is a realm-item provenance family (`causeReceiptOf`, `causeReceiptId`), and `src/components/dossier/SettlementWorkbench.jsx:89` reads `raw.causeReceipt` off a **dossier entry**, not a `spatialLedgers.migration[]` record. WY's F5 is 0 files.

**Trap 3 — `settlementNameFor` and `hasMartialRecord` both already exist under different ownership.** The volume calls `settlementNameFor` NEW (WY-7 / D10); in the tree it is a **local closure** in two modules — `src/domain/worldPulse/mobilizationEffects.js:149` and `src/domain/worldPulse/pulseKernel.js:1925` — plus a port name in `pulseStageManifest.js:130`. A builder greping the name will get seven files and wrongly conclude D10 landed. `resolveOwningCampaign`, its twin in the same D9/D10 pair, is genuinely 0 files. See claim 14 for `hasMartialRecord`.

**Trap 4 — `git log -S<term>` WITHOUT a pathspec is useless here.** `-S'modeSpeeds' --all` returns 35 commits and `-S'severityDurability'` returns 34 — all of them *documentation* commits, because the identifiers appear inside `docs/DESIGN_FP_ARCH_WY.md`, which exists on many branches. Always restrict: `-S<term> -- 'src/'`.

**Trap 5 — the queue docs are FORKED between the ledger branch and the build branch, and the fork is not uniform.** `SOL_QUEUE.md` is 616 lines on the ledger and 654 on the build; `DESIGN_FP_ARCHITECTURE.md` is cured on the ledger at the two sites where the build is bare, and bare on the build at `:3043` where the ledger is cured. The WY *volume itself* is byte-identical. Quote the branch with every line number. (Claim 9.)

**Trap 6 — "STAMPED" and "compiled to execution-ready" are not "built".** ODQ §94 stamps WY; §144.2 compiles `wy-0` to execution-ready. Both read like completion. Neither produced a line of code. The FVQ's own warning at `:4066` ("⚠ ES-4 HAS NOT LANDED, AND THE COMMIT LOG READS AS IF IT HAD") is the general form of this trap; WY's variant is subtler because it never even minted the misleading commit subjects.

**Trap 7 — `RESUME_STATE.md` is the WY source nobody points at.** It holds Lane WY-S (126 claims), Lane FPC's census figure, and the `wy-1` train note at `:2273`. It is not on the brief's source list and is not linked from `HANDOFF_CURRENT.md`. Anyone repeating this recon for another family should grep `RESUME_STATE.md` first, not last.

**Trap 9 — `kmScale` in the ODQ is MAP FABRIC's, not WY's.** The ODQ has exactly two `kmScale` hits, `:5551` and `:5624`, and **both belong to the MF (map fabric) charter** — `:5624` is §152.3 dispatching MF-R1 to verify "district-affinity table, exit-road bearings, event log's trace support, kmScale, power structure fields" against `6b337fb1`. Neither is a WY record. WY's own datum name appears nowhere in the ODQ. (Claim 27.)

**Trap 10 — "WY 11" in ODQ §106 is a count of DOCS BLOCKS, not of waves.** `OWNER_DECISION_QUEUE.md:4002` reads "WC 8 · WF 9 · EP 10 · POP 12 · INT 14 · **WY 11** · TR 15 · CW 9 · DFA 2". A reader skimming for a wave count will read "WY 11" as eleven waves landed. It is eleven stale-site *text blocks* applied to the volume by `51ec5a103`. (Claim 28.)

**Trap 8 — WY's substrate belongs to older programmes and is genuinely LIT.** The roads kernel, missions, caravans, sea lanes and army transit all predate WY and run today. That is **not** a WY landing — "substrate the wave was chartered to CONSUME is not the wave." The sibling seat (`older.md`) holds those receipts; this table deliberately claims none of them.

---

## D. THE YIELD — what a builder should carry out of this fold

1. **WY is the cleanest unbuilt family in the estate.** Twelve waves, a stamped round, a compiled train, five validated rulings, one owner gate already released — and zero code. There is no archaeology to do and no half-landed mechanism to reconcile. What exists is a complete, aged design.
2. **Its compiled price is stale in at least three ways:** the volume was measured at a 2026-08-04 tree (claim 25); §148.2's four-obligation flag-mint law postdates the compile and WY has seven flag-minting waves (claim 20); and two of the first two premises spot-checked had rotted (claims 12, 14). A re-price is owed before dispatch, not after.
3. **Three things block other families on WY, and only one has actually been relieved.** WC-10 is still hard-gated on a build that does not exist (claim 17); the cn/war-console family unblocked itself by re-reading "lands" as "compiles" (claim 18); the encounter table's E15 row was discharged by ES-2 but its walker was never written (claim 16).
4. **One inert token should be either used or removed.** `'WY'` in `CHARTERED_VOLUME_PREFIXES` (claim 2) is a prefix with no row, contrary to the rule the same file states. Either WY's first wave lands its registry row, or the admission should be reverted — the current state is the shape the file's own docstring warns against.
5. **Two ledger debts are open and cheap.** The C-WYF-1 strike-and-point never reached the ledger branch's four "UNSIGNED" sites, and never reached the build branch's `DESIGN_FP_ARCHITECTURE.md:3043` (claims 8, 9). The `uf-1` unfork train that would cure both was chartered at ODQ §151.4 and never ran.

---

*Ledger reader's file complete. Progress cursor: `progress-ledger.txt`.*
