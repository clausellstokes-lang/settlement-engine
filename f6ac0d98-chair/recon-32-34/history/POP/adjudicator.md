# HISTORY PASS — POP (POP-1 … POP-7) — THE ADJUDICATOR — 2026-09-15

Adjudicated by re-opening **every** LANDED / LANDED-DARK / LANDED-INERT /
RECORD≠CODE / UNKNOWN claim of both readers at the product consist
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneCONSIST-932`,
HEAD `315080928` (2026-09-15, "LT37 car 6" — `git log -1`, executed).

Sources read whole before adjudicating: `HISTORY-TRADE-2026-09-15.md` (§A.1, §A.3,
§A.4, the grep-trap paragraph after §B, §C), `DESIGN_FP_ARCH_POP.md` (605 lines,
§1a/§1b/§2/§3/§4/§5/§6 whole), `history/POP/ledger.md` (297 lines), `history/POP/older.md`
(251 lines), plus the POP rows of `PROGRAMME-32-34.md` §B, `RECHECK-32-34.md` §1/§3/§5 and
`PRICING-32-33.md` §B/§C/§D.

**Standard.** Every figure below is an **executed receipt** taken by this seat — a `grep`,
a `sed -n` read, or a `git log -1` — quoted with `path:line`, and marked **CONFIRMED** on
that basis. Derivations (car arithmetic, status counts) are **PLAUSIBLE**. Read-only: no
suite executed, nothing staged, nothing mutated. Where I differ from a reader I say so and
give the receipt.

---

## A. THE ANSWER FIRST

### A.1 In one paragraph, for the owner

**Yes, populations were built far more deeply than the POP volume's own tables admit — and
unlike trade, some of it is LIT in the preset a new realm is born into. But not one POP
wave is built, and the reason is bigger than any wave: the engine all eight of them stand
on is switched OFF in every world a player can run, under a STOP the chair re-affirmed on
2026-09-07.** Four older programmes built POP's machinery under their own names. **WAVE P**
(six commits, all 2026-08-01 — `d620a05d4` P1 · `439030622` P1a · `ef54119e9` P2 ·
`7ce0148bd` P3 · `99e2d54f2` P4 · `47b4ed9dc` P5, every sha verified by `git log -1`) built
the whole demographic engine, and it is dark: `demographicsEnabled: false` at
`simulationRules.js:1027`, and a tree-wide grep for `demographicsEnabled: true` returns
**src 0, tests 10** (CONFIRMED). **M11a pestilence** (`82ad676b2`) already implements POP-4's
arc staging — `@typedef {'incubating'|'active'|'recovering'} EpidemicPhase` at
`spatial/pestilence.js:257`, mounted unconditionally at `pulseKernel.js:2420` and gated only
on `spatialCanonVersion > 0` (`pestilence.js:151-155`) — and **M11b calamity**
(`62c81a0ce` + `45eb5387e`, 1,376 lines) is **LIT in the default preset**
(`disastersEnabled: true` at `simulationRules.js:768`, inside
`realistic_regional: preset(DEFAULT_SIMULATION_PRESET_ID, …)`), already killing a
tier-scaled fraction, stamping `calamityHistory` and demoting the tier
(`calamityKernel.js:410-460`). **SPINE SP-B** minted POP-1's belief axis and reserved it to
POP by name (`beliefAxisSubjects.js:107`; `:120-123` "`pullBand` is SP-B's own populations
road"), and **GRAMMAR GR-2/GR-3** built POP-5b's treaty half on the mounted peacetime pact
lane (`pactTriggers.js:256` → `pactFormation.js:262`/`:180-184` →
`peaceTermsCatalog.js:250-254`, mounted `settlementLifecycleKernel.js:564`). **CAPACITY**
(`ec6b0a132`/`6bddd6183`/`d02c5acde`, 2026-09-03) landed a third of POP-6 and a third of
POP-7 a month after the volume compiled. The two code passes' **8-of-8-UNBUILT** headline is
wrong: the count is **0 built / 5 part-built / 3 unbuilt**. The money barely moves
(32–45 → **32–46 C**). What moves is the brief: **one recon row that a launch-path lane
would have been briefed against is false**, **POP's real car 0 is an owner sitting, not a
wave**, and there is a **frozen ground truth under the whole engine** that no pass had
found.

### A.2 Wave by wave — THE ADJUDICATED VERDICT

Legend: **recon** = PROGRAMME §B / RECHECK §1 as carried into PRICING §B. **L** = ledger
reader, **O** = older-programme reader. Every "evidence" cell is this seat's own executed
read at the consist.

| Wave | Recon | L | O | **ADJUDICATED** | The deciding receipt |
|---|---|---|---|---|---|
| **POP-1** the believed road | UNBUILT | unbuilt | PART | **PART-BUILT** (belief half only; all four of the wave's own behaviours absent) | Built elsewhere: `beliefAxisSubjects.js:107 PULL_BANDS = ['shunned','overlooked','sought','coveted']`, reserved to POP at `:120-123`, ground truth `conditionsGroundTruth` `:303-338`, consumed `pactFormation.js:262`. Absent: `believedMigrationRead.js`, `arrivalClearing.js` = **0 files** (`find src -name`). The landing is still unconditional — `demographicsMigration.js:464-466` `const target = writable(column.destId) ? column.destId : writable(column.originId) ? column.originId : null;`, `lost` `:468`, `returned` `:478`, receipt `:495` "newcomers reach ${name} and are taken in". **No capacity is read at the wall.** |
| **POP-2** the commons arc | UNBUILT | unbuilt | UNBUILT | **UNBUILT** | `commonsArcEnabled` 0 src / 0 tests. `commonsAnswer.js` 0 files. The misrule gap is open at the volume's own address: `assizeKernel.js:344-347` `coupled = commonsActive && ((!!namedAccused && !!accusedNid && namedAccused === accusedNid) \|\| (String(liveCommons.kind) === 'corruption' && c.charge === 'corruption'))`. Substrate itself dark: `commonsVoiceEnabled` has **no manifest row** and sits in the walker BACKLOG (`tests/lint/engineGatedRuleKeys.walker.test.js:195`), 0 `: true` in src. |
| **POP-3** departure memory | UNBUILT | unbuilt | UNBUILT | **UNBUILT — the only genuinely greenfield POP wave** | `departureMemoryEnabled` 0/0; `departureMemory.js` 0 files; `departureMemory` 0 src files, `kinTie` 0, `kinPull` 0, `diaspora` 1 (generated prose). |
| **POP-4** the plague arc | UNBUILT | unbuilt | PART (+2 C) | **PART-BUILT — the most built of the seven, and the recon row is furthest from it** | Staging already built and LIT: `spatial/pestilence.js:257-267` typed three-phase lifecycle, `:107 RECOVERY_FLOOR_TICKS`, `:108 REFRACTORY_TICKS`, mount `pulseKernel.js:2420` inside a bare block, gate `epidemicActive` `:151-155` = `spatialCanonVersion > 0`. The mortality sink is LIT in the default preset: `simulationRules.js:768 disastersEnabled: true` in `realistic_regional`, `:819`, `:927`; `calamityKernel.js:410` `popBefore`, `:434 population: afterDeaths`, `:437 reason: 'Killed in the calamity.'`, `:441 popToTier(afterDeaths - loss.exodus)`, `:459 calamityHistory`. The precise hole is the **silent close**: `pestilenceKernel.js:258` pushes `materializationNews(...)` (headline "Plague reaches …", impactKind `plague_arrival`) and the clearance loop at `:262-264` pushes **only** `receipts.push({ id: c.id, kind: 'cleared' })`. `calamityArc.js` 0 files; `calamityArcs` **0 src hits**. |
| **POP-5a** road drama | UNBUILT | unbuilt | UNBUILT | **UNBUILT (body absent, reader already waiting)** | `roadDramaEnabled` 0/0; `columnEvents.js` 0 files; `events` never on a column. RF-1 holds verbatim: `spatial/migration.js:543-560` `columnOf` rebuilds exactly `{originId, destId, arrivals, departTick, arrivalTick, ...(COLUMN_CLASSES.indexOf(travelClass) >= 0 ? { travelClass } : {})}`. The waiting reader is real and is IMPORTED: `src/domain/roads/migrationReason.js` (3,573 B), consumed at `src/domain/briefs/roadScene.js:40`. |
| **POP-5b** the permit table | UNBUILT | unbuilt | PART | **PART-BUILT** (drafting lane + catalog built and mounted; the four reads and the depth step owed) | `pactTriggers.js:256 export function scoreMigrationPressure`; called `pactFormation.js:262` with `PULL_BANDS`; ladder `pactFormation.js:180-184` (`migration_right` 0 · `labor_compact` 0.60 · `settlement_provision` 0.85); catalog `peaceTermsCatalog.js:250/:251/:254`, `family: 'population'`, executors `grant`/`transfer`; lane mounted `settlementLifecycleKernel.js:91/:564`. POP-side readers inert: `migrationRightFor` (`treatyEnforcement.js:300`) has **zero src callers** (the only other src hits are a comment and a registry row at `couplingRegistryGrammar.js:148/:208`); `moverPermitted` (`demographicsLadder.js:209`) has **exactly one** src caller, `demographicsResponses.js:244`. `pactFormationEnabled` in the manifest (`simulationRules.js:324`), 0 `: true`. |
| **POP-6** the hopeful half | UNBUILT | unbuilt | PART (−1 C) | **PART-BUILT — and MORE built than the older reader said** (see §C.1 correction 2) | Landed under CAPACITY/NEWSTRAIN: crowding line `demographicsHerald.js:166 crowdingCrossingOf`, ranks `:143-145`, used `:436`; file grown to **465** lines. Eight WHAT_PHRASES rows live: `settlementRumors.js:349 flow_migration`, `:350 migration_pressure`, `:351 population_emigration`, `:355 population_crowding`, `:357 migration_flight`, `:474 settlement_resettled`, `:475 settlement_terminal_death`, `:477 steading_forced`. C2's reader surface is **LANDED-INERT**: `src/domain/display/demographicReading.js` (257 lines) has **zero src importers** (`grep -rln` returns the file itself only). Absent: `populationEditor.js`, `populationLines.js` = 0 files. R-28 still open at a MOVED address: `demographicsHerald.js:420 headline: \`${quantityWords(departures \|\| unplaced)} left ${origin}\`` with the honest fork at `:423`. |
| **POP-7** convergence | UNBUILT | unbuilt | PART (−1 C) | **PART-BUILT (the rail is laid)** | `scripts/soak/tripwires.mjs:392 capacity_plateau`, `:461 capacity_floor_thaw`, `:494 capacity_realm_load` execute; `:543 capacity_envelope_30y` present and refused with its reason recorded at `:703`. Instrument wired: `demographicsObservation.js:103 measureRealmDemography` / `:196 observeRealmDemography`, imported `scripts/audit/behavioral-observation.mjs:15`, called `:1003`. **No populations convergence contract exists**: `ls src/domain/certification/` carries `tradeConvergenceContract.js` and three war files, nothing population-side. |

**COUNT (adjudicated): 0 built / 5 part-built / 3 unbuilt.** Part: POP-1, POP-4, POP-5b,
POP-6, POP-7. Unbuilt: POP-2, POP-3, POP-5a. I adopt the older reader's count and I reject
the two code passes' `8 of 8 UNBUILT`. **PLAUSIBLE at the total, CONFIRMED at each row.**

A caution I record vetoably, because it is the one place I nearly split from the older
reader: **POP-1's "part" is a precondition the volume already booked.** §2's POP-1 row
already says "SP-2 believed-conditions subject family LANDED (SATISFIED)". What is genuinely
new — and what earns the status change — is that the axis SP-B minted is *POP's own axis,
reserved to POP by name*, with its ground truth written and a live consumer, so POP-1 must
**not rebuild `pullBand`** and its resolver has a ready-made closed set. That is a brief
change, not a car change.

---

## B. WHAT EACH PART-BUILT WAVE STILL OWES — so PRICING §B can be re-cut

| Wave | PRICING | **Re-cut** | The cars that remain, named |
|---|---|---|---|
| **POP-1** | 5–7 C | **5–7 C** (unchanged) | (1) class extension `'returning'` — now a **three**-structure decision, not the volume's two (`migration.js:474 DEMOGRAPHIC_COLUMN_CLASSES`, `:504 MILITARY_COLUMN_CLASSES`, `:509 COLUMN_CLASSES`, widened at `4c87bae45`); (2) `believedMigrationRead.js` + the seam swap — **consume `pullBand`, do not mint an axis**; (3) `arrivalClearing.js` + the return column + the conservation re-derivation — this is the FIRST refusal machinery in the tree and it is what three foreign lanes wait on; (4) disappointment + letters home; (5) the coupling desk leaf (blocked — see car 0 #4); (6) the flag mint. **The brief must be re-cut against a false premise** (§C.1 correction 1) and **against a stale S1** (§C.2 R2). |
| **POP-4** | 3–4 C | **5–7 C (+2)** | (a) **THE M11b RECONCILIATION CAR (mandatory car 0 — §C.3 #2)**: own, gate or fold the LIT calamity arc before minting `spatialLedgers.calamityArcs` beside a live `calamityHistory` stamp, or POP-4 runs two arc ledgers and asserts ZERO-NEW-MORTALITY beside a live, shipping mortality sink. (b) **THE SILENT-CLOSE CAR**: the aftermath/recovery voice is a **fork on an existing producer** (`pestilenceKernel.js:262-264`), not a new one — and the recovery kind has a copy-exact precedent in the registered `plague_arrival` mint at `:289-298`. Then the burial attribution and the arc prune as designed. |
| **POP-5b** | 4–5 C | **4–5 C** (unchanged) | The four permit read-sites + the J-POP-11 gate narrowing + the two treaty reads. Cheaper than priced in one respect: C-POPF-7's **reachability** pins are now genuinely reachable — GR-2's mounted lane drafts all three population terms — so the "degraded while GR-3 unbuilt" arm is history. |
| **POP-6** | 6–9 C | **5–8 C (−1)**, and possibly **4–7** | The crowding line and eight phrase rows already landed, and C1 banked the `population_` prefix cure. **Further than the older reader measured**: `population_decline` and `population_growth` are *already voiced* through the fallback surface (`rumorFallbackPhrasePools.js:624` + `:634`-family, each 7 doc variants with "variant 1 … is the live anchor", listed in the registered roster at `:990-991`), reached by `settlementRumors.js:587-592`. **Exactly three of the volume's eleven S30 kinds are genuinely mute** — `tier_change`, `steading_founded`, `steading_absorbed` carry neither a WHAT_PHRASES row nor a pool and therefore return `UNREGISTERED_SUBJECT` (`settlementRumors.js:594`, value `:517`). Still owed: the two charter modules, R-28's verb repair at `:420`, and C2's inert reader (mount it or declare it). |
| **POP-7** | 3–5 P | **2–4 C (−1)** | Three tripwire rows, the per-year series and `realmDemography` already execute. Owed: the six flag certification rows, the endings-mix envelopes, the rush/commons/arc censuses, and Q2's `commonsVoiceEnabled` backlog row. |
| POP-2 / POP-3 / POP-5a | 4–6 / 3–4 / 4–5 | **unchanged** | POP-2: re-derive the plan-refusal *price* against W-COIN's coin (§C.2 R5) and declare the `sovereigntyMarketStage` sibling reader. POP-5a: declare `roads/migrationReason.js` (imported at `briefs/roadScene.js:40`) as the waiting reader in the event-kind registry comment. |
| **POP total** | **32–45** | **32–46, centre ≈ 39** (PLAUSIBLE) | Flat. POP-4 +2, POP-6 −1, POP-7 −1. **The yield is not money.** |

---

## C. THE FINDINGS THAT CHANGE A BRIEF

### C.1 Two corrections this seat makes to the readers themselves

**1. The ledger reader is RIGHT and the trade pilot was WRONG — and I settled it at the
code, not at the ledger.** `HISTORY-TRADE-2026-09-15.md` row 37, `RECHECK-32-34.md` §3
line 371 and `PROGRAMME-32-34.md:371` all say ODQ §49's "BLOCKED-ON POP-1" blocker is dead
because "`demographicsMigration.js:107-109` MIGRATION_REFUSALS and capacity-ranked
placement `:231-242` landed without POP-1". Those two sites are the **pre-departure**
competition and nothing else: `MIGRATION_REFUSALS` is defined at `:107-109` under a
docstring that says "Every column **that did not form** names why", and the refusal word is
minted inside `competeForDestinations` at `:232-237` (`const refusal = placed === migrants …
: !sawRoom ? 'no_capacity' …`). The **landing** — STAGE 1, `:453-497` — reads nothing:
`:464-466` branches only on `writable(destId)` / `writable(originId)`, `:468` is `lost`,
`:478` is `returned`, and `:495` says "newcomers reach ${name} and are **taken in**".
**CONFIRMED. §49's blocker is alive.** Consequence, and this is the one finding that would
have mis-briefed a launch-path lane: **LG-9..12, the §46c caravan-cover spy waves and pg-3
all still wait on POP-1**, and POP-1's arrival clearing is still "the FIRST refusal
machinery in the tree".

**2. The older reader under-counts POP-6's landed estate.** Its claim 14 says
`population_decline`, `population_growth`, `tier_change`, `steading_founded`,
`steading_absorbed` are "absent (0 hits)" and "now **refuse** rather than fall back". Two of
the five are voiced. NEWSTRAIN did not delete the de-underscore arm outright — it **gated it
on a pool existing**: `settlementRumors.js:587` `const legacyPool = FALLBACK_PHRASE_POOLS[key];
if (legacyPool) { … const stripped = key.replace(WHAT_STRIP_PREFIX, '').replace(/_/g, ' ')
… }`, and only a kind with **neither** a row nor a pool falls through to
`return UNREGISTERED_SUBJECT` at `:594`. `population_decline` (`rumorFallbackPhrasePools.js:624`)
and `population_growth` both have authored pools. **POP-6's genuine hole is three kinds, not
five** — and that is a car-sized difference on a 6–9 C wave.

### C.2 RECORD ≠ CODE — eight rows, every one CONFIRMED at the consist

| # | The record | The code | Who it mis-briefs |
|---|---|---|---|
| **R1** | `PROGRAMME-32-34.md:371` · `RECHECK §3 L371` · `HISTORY-TRADE` row 37: "§49's POP-1 blocker is dead" | `demographicsMigration.js:464-466/:495` — no capacity read at the landing | LG-9..12, ES §46c, pg-3 — three foreign lanes told they are unblocked |
| **R2** | POP volume §1a **S1**: `after = Math.max(named, …)` | `demographicsKernel.js:313` `const after = Math.max(Math.min(named, before), before + births - deaths);` with `// CS-B2 (cs-4): floor WITHOUT the mint.` at `:305` (landed `ac2d32ac8`, 2026-08-15, eleven days after the volume compiled) | POP-4's "named-cast pin under arc conditions (S1 machinery)" is written against a shape that no longer exists |
| **R3** | `PRICING-32-33.md` §B POP-1: "blocked on: **nothing** (three lit-preconditions satisfied)" | Two of three are unmet. `demographicsEnabled: false` (`simulationRules.js:1027`); `migrationRumorsEnabled` is in the manifest at `:309` and in **no preset spread** (0 `: true` in src). Only SP-2 is satisfied | the POP-1 lane itself — lighting it alone buys nothing |
| **R4** | ODQ §517.3: "`urbanFabricKernel.js` … is dark behind `ONE_REGEN`" | `ONE_REGEN` (`simulationRules.js:666`, carrying `urbanFabricEnabled: true` at `:670`) is spread into the **default** preset at `:772`, plus `:824`, `:865`, `:1073`. The population→residential deposit at `:415-418` runs in every new realm | any B8/estate brief |
| **R5** | Wave P3's own certification row: "the tree carries **NO settlement treasury** … provision is the lane own unit and **should be re-denominated the day a real treasury lands**" (`subsystemRowsGrowth.js:284`, read whole) | `src/domain/worldPulse/treasury.js` = **73,777 B**; `treasuryEnabled` 0 `: true` in src | POP-2's plan-refusal pricing, POP-5b |
| **R6** | POP volume §1a **S30**: eleven kinds absent, de-underscore fallback carries them | The fallback arm is pool-gated (`settlementRumors.js:587-594`); 8 kinds have rows, 2 have pools, **3 are mute** | POP-6's car count |
| **R7** | POP volume §1b **RF-4** addresses | `stressorPicker.js` is at `src/domain/`, not `src/domain/worldPulse/`; the claim holds, the addresses do not | POP-1/POP-3 |
| **R8** | POP volume §1a **R-28** at `demographicsHerald.js:257` | Still open, at `:420` — C1 grew the file 266 → 465 lines | POP-6(g) |

### C.3 MANDATORY CAR 0 — four, and the first is not a car

**#1 — THE OWNER SITTING (the family's real car 0, and it is OWNER-GATED).** I adopt the
ledger reader's D.5 whole and I re-took its three receipts:

- `simulationRules.js:1027 demographicsEnabled: false`, with the code's own instruction at
  `:1019-1026`: "**LIGHTING IT belongs at the owner-signed soak redo**, after P2's overflow
  valves, P3's migration homeostat and P4's stressor couplings land; flip this one value
  there." The 2026-09-06 lit default (`432ff6441`) took twenty-one virtual keys into
  `realistic_regional` (`:747-773`, `...WAVES` + `...ONE_REGEN` + three literals) and
  `demographicsEnabled` is in **neither const**. ODQ §907(e) (`898dcb5b8`, 2026-09-07):
  "the STOP holds; nothing here lights it."
- `demographicsRates.js:375 export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({ signed: false, lit: null });`
- `densityBands.js:60-63 export const REGISTER_VII_SIGNATURE = Object.freeze({ signed: false, live: false });`,
  derived at `densityLaw.js:99`

**This is POP's §96.2.** Until it is signed, all eight POP waves land into an engine no
shipped preset runs. It is one row on the owner queue and it gates ~32–46 POP cars plus
LG-9..12, the §46c spy waves, pg-0..pg-4, WY-4 and (per FVQ:1803) WR-10's own lighting.
**It should board BEFORE the POP-1 lane, not after.**

**#2 — POP-4's M11b RECONCILIATION (a LIVE PRODUCER OF THE WAVE'S OWN FICTION).** Exactly
the shape of trade's famine-profiteering find, and larger, because this one ships lit and
kills people. POP-4 may not mint `spatialLedgers.calamityArcs` or assert ZERO-NEW-MORTALITY
until it has owned, gated or folded `calamityKernel.js`'s live strike. Receipts in §A.2.

**#3 — POP-1's RECEPTION-PREMISE RE-CUT.** Not a build car: a brief correction (R1) plus the
re-instatement of three foreign dependencies the recon retired.

**#4 — C-POPF-6 IS AN UNRESOLVED CHAIR STOP ON POP-1.** ODQ §144.2 (2026-08-16): "C-POPF-6
is a hard STOP awaiting chair"; the ledger reader found `C-POPF` at exactly seven ODQ lines
and the last is that STOP. POP-1's coupling rows have no desk. The volume's own §1a S34
already carries the superseded-address warning for the registry. **PLAUSIBLE: unresolved**
(absence in a 32,673-line file is weaker than a positive read) — hand it to the chair, do
not brief POP-1 around it.

### C.4 THE JOIN CAR — and it is bigger than TR-3's

The brief asked whether `demographicsObservation.js`'s `realmPressure01` is POP's analogue
of TR-3's generation-frozen `foodRatio`. **It is not** — it is recomputed live
(`demographicsObservation.js:137`, Σpop / Σ K_food) and its only src consumers are war
readers (`warReasons.js:803-804`, gated on `demographicsLit`; `demographicsWar.js:172/:295`).
Its problem is **darkness, not freezing**. The ledger reader is right.

**But the analogue exists, one level down, and it is the engine's own bound.** The carrying
capacity K_food is generation-frozen at every configuration the product ships:

- `demographicsRates.js:558` `const local = Math.max(0, Math.floor(ledger.dailyProduction * mouthsPerUnit));`
- `dailyProduction` has exactly **two authoring writers tree-wide**, both generators:
  `src/generators/foodGenerator.js:428` and `src/generators/economy/foodBalance.js:459`
  (`src/domain/foodLedger.js:35/:61` is the normalizer's default and read-through).
- The two arms that could move it are both dark: the import side requires
  `routeLifecycleActive` (`:565`; `routeLifecycleEnabled: true` = **0 src hits**), and the
  P3 works-plan factor requires the demographic engine lit (`:577`).

⇒ **A JOIN CAR is owed, and it belongs to POP-1 or to the owner sitting, not to polish:**
wire the food bound to a live production path, or **declare the frozen derivation as the
family's floor** in the charter. Without it the push-pull homeostat pushes people against a
wall that never moves, POP-1's disappointment gap can only ever measure belief drift against
a constant, and the 300-year plateau the §907(e) STOP is waiting on is being asked of a
model whose bound cannot respond. One live counterweight, recorded so the car is priced
honestly: the *reserve* axis does move — `foodStockpile.js:1-6` ("storageMonths **was**
generation-frozen … This module makes it a conserved, tick-advanced stock"), mounted
`pulseKernel.js:35/:543`.

**Secondary, and it narrows POP-1's own risk:** POP-1's belief input is **not** frozen.
`conditionsGroundTruth` (`beliefAxisSubjects.js:303-338`) bands `prosperityRank(economy.prosperity)`
at `:323`, and prosperity has a live pulse writer at `generosityUpdates.js:145`; only the
hunger-shift arm at `:330` reads the frozen `foodRatio`. So POP-1 does **not** inherit TR-3's
one-shot hazard.

### C.5 TWO OWNER-ORDERED PROGRAMMES CHARTERED AND NEVER BUILT — in no recon doc

Both from the ledger reader, both re-verified here by tree-wide grep:

- **The pg contagion family** (ODQ §136/§138/§139, 2026-08-16; owner verbatim
  "*Comprehensively, exhaustively, carefully, seamlessly, coherently, and cohesively build it
  and slot it where appropriate*"; pg-0..pg-4, including belief-based refusal at the gates
  riding POP-1's reception contract): `plagueTouched` **0 src / 0 tests**, `afflictionBand`
  **0 / 0**, `contagionEnabled` **0 / 0**.
- **The stressor pin** (ODQ §128, owner directive): `stressorPin` **0**, `pinnedStressor`
  **0**, `dmPinned` **0**.

Neither appears in `PROGRAMME-32-34.md`, `RECHECK-32-34.md` or `PRICING-32-33.md`. They are
owner-ordered work the #32 tables do not carry, and pg-3 is a **fourth** lane blocked on
POP-1.

---

## D. GREP TRAPS CONFIRMED AT SOURCE BY THIS SEAT

1. ⛔ **`POP-[0-9]` matches `DS-POP-1/2/3`** — POP's `INSTR-1 ≠ TR-1`.
   `git log --all --grep='POP-'` returns **22 commits and not one is a POP wave**: the
   genuine population hits are `bc1773983`/`94a6f33f4` (September's prose-rewrite dossier
   sections DS-POP-1/2/3), `acdc2bcd5` (§401 retiring a DS-POP-2 item as a false positive)
   and `9165f910b` ("POP-S collected" — a stamping round). Executed.
2. **`PULL_BANDS` has three incompatible definitions.** `beliefAxisSubjects.js:107` is SP-B's
   four-rung populations pull (the one `pactFormation.js:262` imports);
   `faithWitnessSource.js:104` and `npc/livedExperienceCatalog.js:134` are both
   `['faint','firm','heavy']`. A bare grep returns all three.
3. **`calamity` is M11b's LIT natural disaster** (`calamityKernel.js`, `spatial/calamity.js`,
   `display/calamityLedger.js`, `calamityHistory`) — **not** POP-4's `calamityArcs`, which
   has **0 src hits**. One word deep, and the collision sits over a live mortality sink.
4. **`demographicReading.js`** (singular, `src/domain/display/`, C2's inert leaf) vs
   **`demographicReadings`** (plural, `demographicsPushPull.js`, live). One letter.
5. **`population_decline` in `settlementRumors.js` is a COMMENT** (`:353`, "an echo of
   `population_growth` or `population_decline` above"), not a row — while the real rows live
   in a *different file* (`rumorFallbackPhrasePools.js:624`, `:990`). A per-file grep says
   "absent" and a tree-wide grep says "present"; both are misleading. **New this pass.**
6. **`commonsVoiceEnabled` is not in the manifest** — it is a BACKLOG entry in the walker
   (`tests/lint/engineGatedRuleKeys.walker.test.js:195`). A manifest grep says the flag does
   not exist; the kernel reads it at `commonsVoiceKernel.js:50`.
7. **`migrationRumorsEnabled` is manifested (`simulationRules.js:309`) but lit nowhere** —
   presence in the manifest is not lighting, and PRICING's POP-1 row read it as satisfied.
8. Inherited and re-confirmed: `migration` in the ODQ is ~90 % SQL/schema migrations ·
   `commonsVoice` ≠ `commonsArc` · `believedMigrationEnabled` is one word from the live
   `migrationRumorsEnabled` · `mass_migration` is a **generation** stressor whose every
   writer is a generator · `tests/domain/demographicsWorldsHand.test.js:524` "the permit
   table is TOTAL" is P4's ladder, not POP-5b · `C-POPF-n` are compile cures, `POP-F`/`POP-S`
   are stamping rounds, `P1..P5` are the July/August wave-P programme.

---

## E. WHAT I COULD NOT SETTLE (handed up, not dropped)

1. **Whether the owner ever signed the demographic tuning constants.** Three unsigned
   signatures read at the consist (§C.3 #1) and no ODQ § records a signature. **PLAUSIBLE:
   still unsigned.**
2. **Whether C-POPF-6 was resolved off-ledger.** **PLAUSIBLE: unresolved.**
3. **Whether `pop-1`'s compiled five-member train (ODQ §144.2, "compiled to
   execution-ready") survives in the kit's preserved refs.** Not searched. Recovering it
   would save POP-1's compile.
4. **Which display surface a POP-6 new kind must land on.** I confirmed the resolution order
   in `settlementRumors.js:587-594`, but I did not measure whether a pool-only kind satisfies
   the three registration walkers the volume's S24 names. Treat my POP-6 **−1 to −2 C** as
   PLAUSIBLE until a lane checks the walkers.
5. Read-only. **CONFIRMED** here means the code or commit text was read at the cited address
   at HEAD `315080928`, not that a suite was observed green.
