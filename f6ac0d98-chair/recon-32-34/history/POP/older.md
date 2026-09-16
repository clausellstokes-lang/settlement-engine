# HISTORY PASS — POP (POP-1..POP-7), THE OLDER-PROGRAMME READER — 2026-09-15

Read-only. Every code figure below is an **executed receipt** taken by this reader at
`laneCONSIST-932` HEAD `315080928` (`git log -1`), quoted with `path:line`, and is marked
**CONFIRMED** on that basis. Derivations of mine (car arithmetic, status re-counts) are
marked **PLAUSIBLE**. Ledger rows cite `docs/OWNER_DECISION_QUEUE.md` by line. Git rows
cite sha + `%ad` from `git log --all --format='%h %ad %s' --date=short`.

Standard, shape and trap-discipline: `HISTORY-TRADE-2026-09-15.md` §A.1/§A.3/§A.4, the
grep-trap paragraph after §B, and §C. Sources read whole: `DESIGN_FP_ARCH_POP.md` (605
lines, §1a/§1b/§2/§4/§5/§6), `PROGRAMME-32-34.md` §B POP rows, `RECHECK-32-34.md` §1/§5,
`PRICING-32-33.md` §B/§C/§D POP rows, the ODQ POP entries (§46c correction, §92),
`FABLE_VALIDATION_QUEUE.md` (the WAVE P acceptance block), `DESIGN_DEMOGRAPHIC_ENGINE.md`
§-map, and the `demographicsEnabled` certification row (`subsystemRowsGrowth.js:284`, the
single longest record of the P programme in the tree).

---

## A. THE ANSWER FIRST

### A.1 In one paragraph, for the owner

**Yes — populations were built in far more depth than the POP volume's progress block or
the two code passes admit, and unlike trade, three of the older programmes are LIT in the
shipping default preset.** But almost none of it is a POP wave, and the split is different
from trade's. Four programmes touched populations. **WAVE P** (six commits on 2026-08-01:
`d620a05d4` P1, `439030622` P1a, `ef54119e9` P2, `7ce0148bd` P3, `99e2d54f2` P4,
`47b4ed9dc` P5) built the whole demographic *engine* — a bounded birth/death model, a
push-pull migration homeostat with exact 300-tick conservation, six banded settlement
responses on a persistent plan ledger, a viability ladder with a permit table, causal risk
couplings, a war-motive arm, a Herald, and a realm instrument — and it is **DARK in every
preset** (`demographicsEnabled: false` at `simulationRules.js:1027`; zero `: true`
spellings tree-wide). That is the single most important fact about this family: POP is the
only #32 family whose *entire substrate* is unlit, and every one of the six POP flags
carries "`demographicsEnabled` lit" as a §2 lit-precondition. **Phase 5.5 movers M11a and
M11b** (`82ad676b2` and `62c81a0ce`, both 2026-07-13) built the calamity side: a traveling
plague with typed `incubating → active → recovering` stages, and a natural-disaster shock
with a named permanent stamp and a fully emergent tail that sheds population down M4's
conserved exodus path and demotes the tier. **M11b is LIT in `realistic_regional` — the
default preset — plus `dramatic_campaign` and `full_simulation**` (`simulationRules.js:768`,
`:819`, `:927`), so POP-4's fiction already ships and already kills people. **SPINE SP-B
and GRAMMAR GR-2/GR-3** built POP-1's belief half and POP-5b's treaty half under their own
names: `pullBand` is explicitly "SP-B's own populations road"
(`beliefAxisSubjects.js:119`), and GR-2's mounted peacetime pact lane already scores
believed migration pressure and drafts `migration_right` / `labor_compact` /
`settlement_provision`. And **the CAPACITY programme** (`ec6b0a132` / `6bddd6183` /
`d02c5acde`, 2026-09-03, plus §907–§911) landed a third of POP-6 and a third of POP-7 a
month after the volume was compiled — including a Herald crowding line, a reader-facing
state surface that is **inert on a measured 190-byte first-paint cost**, and three
executing soak tripwire rows. Net: the two code passes' 8-of-8-UNBUILT headline becomes
**0 built / 5 part-built / 3 unbuilt**, the car total barely moves (32–45 → 32–46), and
the real yield is **one falsified premise, one over-credited recon row that a launch-path
lane would have been briefed against, and one LIT producer POP-4 must reconcile with or
double-count.**

### A.2 Wave by wave

Legend: **recon row** = PROGRAMME-32-34 §B / RECHECK §1 as carried into PRICING §B.
Status vocabulary per the trade fold.

| Wave | Recon row | What the older programmes show | This reader's verdict | Label |
|---|---|---|---|---|
| **POP-1** the believed road | UNBUILT, 5–7 C; "ordering anchor for WY-4 and LG"; `believedMigrationEnabled` 0 hits | **The belief half is built under SPINE SP-B and consumed by GRAMMAR GR-2.** `PULL_BANDS = ['shunned','overlooked','sought','coveted']` (`beliefAxisSubjects.js:107`) is MINTED and reserved — "`pullBand` is SP-B's own populations road and no ES product may name it" (`:119`); its ground truth is `conditionsGroundTruth` (`:303-338`), carried on `beliefRecord.conditionsBands` (`beliefMap.js:348`) behind `believedConditionsEnabled ∧ beliefAxesEnabled` (`beliefAxes.js:92`), and read by `pactFormation.js:216` (truth) / `:229` (belief). **The wave's own leaves are absent** (`believedMigrationRead.js`, `arrivalClearing.js` = 0 hits). **And the recon row over-credits the reception half** — see claim 16: the landing at `demographicsMigration.js:452-479` is still unconditional. Ground truth is **not** TR-3-frozen: `pullBand`'s primary input `economicState.prosperity` has four live pulse writers; only its hunger-shift arm reads the frozen `foodRatio`. | **PART-BUILT** (belief half + its consumer; the clearing, the return column and the letters owed) | CONFIRMED |
| **POP-2** the commons arc | UNBUILT, 4–6 C; `commonsArcEnabled` 0 | Nothing of POP-2 exists. `commonsVoiceKernel.js` (365 lines) is Vision V-K's (`b0f1dbe6b`, 2026-07-20) and is substrate the wave was chartered to extend. **S22's misrule-answer gap CONFIRMED STILL OPEN**: `assizeKernel.js:344-347` computes `coupled` as exactly `namedAccused===accusedNid \|\| (kind==='corruption' && charge==='corruption')` — no misrule arm. One post-volume consumer to reconcile with: `sovereigntyMarketStage.js:432/:452` reads `plansLedgerOf(worldState)` as a declared **sibling, not extension**, of the plan lane (`:5-7`). | **UNBUILT** | CONFIRMED |
| **POP-3** departure memory | UNBUILT, 3–4 C | **No older analogue under any name.** `departureMemory`, `diaspora`, `kinTie`, `kinPull` = 0 src hits; `homeland` is npc/faction profile copy; `"JF-SS-diaspora_return"` (`dossierCausalProse.generated.js:4897`) is generated prose. Nearest cousin is traditions adoption influx (`traditions/relations.js:48-49` `ADOPTION_THRESHOLD 0.12` / `INFLUX_WINDOW_YEARS 3`; captured `traditionsKernel.js:624-644`) — a memory of **arrivals**, which is the opposite end. | **UNBUILT** | CONFIRMED |
| **POP-4** the plague arc | UNBUILT, 3–4 C; substrate gate DISCHARGED | **The most built of the seven and the recon row is furthest from it.** M11a (`82ad676b2`) already implements POP-4's ARC STAGING: typed `EpidemicPhase = 'incubating'\|'active'\|'recovering'` (`spatial/pestilence.js:257-267`), `RECOVERY_FLOOR_TICKS: 26`, refractory windows, prune, causal receipt per mint — mounted **unconditionally** at `pulseKernel.js:2420`, its only gate `epidemicActive` = `spatialCanonVersion > 0` (`pestilence.js:151-155`), stamped by the canonize action (`campaignSpatialCanonize.js:171`). M11b CALAMITY (`62c81a0ce` + `45eb5387e`, 1,376 lines over three files) is **LIT in the default preset** and already does the shock, the named permanent stamp, the recovery cooldown, the mortality, the M4 conserved exodus, the tier demotion and the disaster-response legitimacy condition. **The precise hole**: the arc opens loudly and closes silently — `pestilenceKernel.js:258` pushes `materializationNews` ("Plague reaches X", impactKind `plague_arrival`, significance-banded) and the clearance loop at `:262-264` pushes a `{kind:'cleared'}` receipt and **no newsEntry at all**. | **PART-BUILT** (+1 M11b reconciliation car, +1 silent-close car) | CONFIRMED |
| **POP-5a** road drama | UNBUILT, 4–5 C | Nothing puts an event on a column. **RF-1 holds unchanged**: `columnOf` (`spatial/migration.js:543-560`) still rebuilds each record as exactly `{originId, destId, arrivals, departTick, arrivalTick, ...(travelClass?)}` — a whitelist, at three sites. One waiting reader exists and the volume never names it: `roads/migrationReason.js` (R-7 THE ROAD SCENE, `98efe1d3b`, 2026-07-19), a zero-import lazy leaf whose own comment records "In this engine migration has a SINGLE cause (a shed/over-capacity origin)" and reads `populationHistory` stamps for enrichment. | **UNBUILT** (body absent, reader waiting) | CONFIRMED |
| **POP-5b** the permit table | UNBUILT, 4–5 C; "`treatyEnforcement.js:297` declared reader, no consumers" | **The treaty half is built under GRAMMAR and MOUNTED.** `scoreMigrationPressure` (`pactTriggers.js:254-268`) — "One court is believed to draw people the other is believed to lose" — is called at `pactFormation.js:262` with `PULL_BANDS`, and `PACT_DRAFT_LENS.migration_pressure` (`pactFormation.js:180-184`) drafts `migration_right` at rung 0, `labor_compact` at 0.60 and `settlement_provision` at 0.85. Catalog rows live: `peaceTermsCatalog.js:250/:254`, family `population`, executors `grant` / `transfer`. `pactFormationEnabled` dark (`simulationRules.js:324`). **The POP-side consumers remain inert**: `migrationRightFor` (`treatyEnforcement.js:300-301`) zero callers; `moverPermitted` (`demographicsLadder.js:209`) exactly one caller, the founding gate at `demographicsResponses.js:244`. | **PART-BUILT** (drafting lane + catalog; the four reads and the depth step owed) | CONFIRMED |
| **POP-6** the hopeful half | UNBUILT, 6–9 C; "neither charter module exists"; S30's eleven kinds absent | **S30 is dead in both directions.** NEWSTRAIN car 2/3 (`6c862159e`, 2026-09-02) **deleted the de-underscore compute arm** — an unregistered token now takes `UNREGISTERED_SUBJECT` — and gave twenty-nine kinds words. Eight population/migration rows exist today (`settlementRumors.js:349`, `:350`, `:351`, `:355`, `:357`, `:474`, `:475`, `:477`); five of the volume's eleven are still absent and now **refuse** rather than fall back. CAPACITY C1 (`ec6b0a132`) landed the crowding Herald line (`demographicsHerald.js` 266→465 lines) and the `population_crowding` phrase row, and banked the ratchet cure POP-6 needs. CAPACITY C2 (`6bddd6183`) landed the reader-facing state surface `display/demographicReading.js` (257 lines) **LANDED-INERT — zero src importers**, held out of its own tab on a measured 190 B first-paint cost. | **PART-BUILT** (the wave's charter modules absent; a third of its estate landed under CAPACITY/NEWSTRAIN) | CONFIRMED |
| **POP-7** convergence | UNBUILT, 3–5 P; owner-gated (CR-FP-6) | Three of POP-7's health metrics already execute as soak tripwire rows: `capacity_plateau` (`scripts/soak/tripwires.mjs:392`), `capacity_floor_thaw` (`:461`), `capacity_realm_load` (`:494`), with `capacity_envelope_30y` (`:543`) declared NOT-EXECUTABLE on a measured absent field. `observeRealmDemography` is wired (`scripts/audit/behavioral-observation.mjs:1003/:1059`, additive, null-on-dark) and the per-year population series landed at §909 car 1a (`ec265d24c`). | **PART-BUILT** (the rail exists; the six flag rows, the endings-mix envelopes and the rush/commons/arc censuses owed) | CONFIRMED |

### A.3 What the older programmes already do that the POP waves describe

Each row is machinery live at the consist; the POP wave named is the one whose
*description* it overlaps, and the last column says why it is not that wave.

| Older mover (sha, date) | Live at | What it does that a POP wave describes | Why it is not the POP wave |
|---|---|---|---|
| **WAVE P1** the rates (`d620a05d4`, 08-01) | `demographicsRates.js` (939), `demographicsKernel.js` (432) | Births minus deaths against `min(K_food, D_tier)`; natural-mortality floor; the whole carrying-capacity model POP-1..7 stand on | **DARK** (`simulationRules.js:1027`). Substrate for every wave; not one of them |
| **WAVE P1a** the floor (`439030622`, 08-01) | `populationDynamics.js`, `tierOutcomeApply.js`, `tierResourceDynamics.js` | A dying town may die; hash-integerized shed; earned promotion; terminal gate reads the head count | DARK. POP-6's `settlement_terminal_death` line rides it |
| **WAVE P2** the homeostat (`ef54119e9`, 08-01) | `demographicsMigration.js` (658), `demographicsPushPull.js` (643), `spatial/migration.js` | Five guarded push drivers, road-priced pull, capacity-ranked destination competition with a closed refusal vocabulary, columns on the shared ledger, 300-tick conservation identity with a leak negative control | **POP-1's body** — but the refusals are PRE-DEPARTURE (volume S6) and the LANDING is unconditional (`:452-479`). The arrival clearing is exactly the hole |
| **WAVE P3** the valves (`7ce0148bd`, 08-01) | `demographicsPlans.js` (664), `demographicsResponses.js` (470), `demographicsLand.js` (541), `demographicsWorks.js` (142) | Six banded responses drawn not ordered; the founding lane refused BY NAME when the realm absorbed everyone; a spatial band in the digest's own cost vocabulary; ONE persistent plan per settlement on `spatialLedgers.demographicPlans` | POP-2's plan-refusal arm and POP-5b's founding gate READ it; neither wave built it. Its provision unit is owed a re-denomination (claim 17) |
| **WAVE P4** the world's hand (`99e2d54f2`, 08-01) | `demographicsLadder.js` (241), `demographicsRisk.js` (244), `demographicsWar.js` (334), `demographicsHerald.js`, `demographicsObservation.js` (207) | The 5×6 viability permit table; capped disease/raid risk lifts at the one pressure seam; war motive/capability/belief; the hunger + departure Herald lines; the realm demography instrument | **POP-5b's table** (one of five consumers wired) and **POP-7's instrument** (already emitting). DARK |
| **M11a PESTILENCE** (`82ad676b2`, 07-13) | `spatial/pestilence.js` (571) + `pestilenceKernel.js` (305), mounted `pulseKernel.js:2420` | A traveling plague front with **typed stages** incubating→active→recovering, onset draw against a roster-read care counterforce, recovery floor, refractory windows, ONE-PLAGUE-TRUTH dedupe, causal receipts, a banded `plague_arrival` headline | **POP-4's staging, already built** — gated only on `spatialCanonVersion > 0`, i.e. LIT on any mapped world. What is missing is the burial attribution and the close |
| **M11b CALAMITY** (`62c81a0ce` 07-13 + `45eb5387e` 07-15) | `calamityKernel.js` (831), `spatial/calamity.js` (468), `display/calamityLedger.js` (77), mounted `pulseKernel.js:2451` | A rare terrain-keyed shock: knocks down non-required institutions, **kills a bounded tier-scaled fraction**, mints a NAMED permanent stamp on `calamityHistory`, severs chains, rides M4's realized-debit exodus, demotes the tier, opens a disaster-response legitimacy condition | **POP-4's arc, LIT IN THE DEFAULT PRESET** (`disastersEnabled: true` at `:768` `realistic_regional`, `:819` `dramatic_campaign`, `:927` `full_simulation`). Its tail is emergent, not typed stages — but it is a live mortality sink POP-4's ZERO-NEW-MORTALITY pin must reconcile with |
| **SPINE SP-B** believed conditions (2026-08-05) | `beliefAxisSubjects.js:107/:119/:303-338`, `beliefMap.js:348`, gate `beliefAxes.js:92` | `pullBand` — how strongly a place is **believed to draw people**, from prosperity softened by hunger; reserved to POP by name | **POP-1's belief half.** Dark; the wave's own resolver and clearing are absent |
| **GRAMMAR GR-2 / GR-3** (2026-08-06) | `pactTriggers.js:254-268`, `pactFormation.js:180-184/:262`, `peaceTermsCatalog.js:250/:254`, `treatyEnforcement.js:300` | Believed migration pressure scored between two courts and drafted into a three-rung population term ladder on the **mounted** peacetime pact lane | **POP-5b's treaty inputs.** The POP-side readers are inert |
| **VISION V-K** (`b0f1dbe6b`, 07-20) | `commonsVoiceKernel.js` (365), `assizeKernel.js` | The crowd's grievance ladder, the petition the assize can answer, the rungs and the dwell | POP-2's ladder to extend; its answer reaches only named-accused / corruption grievances (`assizeKernel.js:344-347`) |
| **R-7 THE ROAD SCENE** (`98efe1d3b`, 07-19) | `roads/migrationReason.js` (67), lazy leaf | A causal reason string for a migrant column on the road scene, enriched from `populationHistory` | **POP-5a's reader, already waiting.** It states the single-cause limitation POP-5a exists to lift |
| **CAPACITY C1** (`ec6b0a132`, 09-03) | `demographicsHerald.js` (266→465), `settlementRumors.js:355`, the `DEMOGRAPHIC_TUNING_*` roster (31 rows) | "A town that grows into its granary is told so once" — an overflow-ladder CROSSING line off the step receipt's own before/after; POP's tuning address | **POP-6's crowding line, landed.** Also banks POP-6's ratchet cure |
| **CAPACITY C2** (`6bddd6183`, 09-03) | `display/demographicReading.js` (257) | "How much room does this town have left, and what runs out first" — the STATE surface beside C1's crossing | **POP-6's reader half — LANDED-INERT.** Zero src importers; held on a measured 190 B first-paint cost |
| **CAPACITY C3 + §907–§911** (`d02c5acde`, `ec265d24c`, 09-03/09-07) | `scripts/soak/tripwires.mjs:392/:461/:494/:543`, `behavioral-observation.mjs:1003` | Three executing capacity tripwire rows, a refused fourth with its reason at the site, the per-year population series, the realm demography envelope | **POP-7's rail, already laid** |
| **NEWSTRAIN car 2/3** (`6c862159e`, 09-02) | `display/settlementRumors.js` | The de-underscore compute arm deleted; unregistered tokens refuse; 29 kinds given words, 8 of them population/migration | **POP-6's phrase estate, a third landed — and its fallback premise deleted** |
| **W-COIN treasury** (dark) | `src/domain/worldPulse/treasury.js` (73,777 B), `treasuryEnabled` `simulationRules.js:402` | Conserved integer coin | Falsifies P3's recorded "the tree carries NO settlement treasury" premise (claim 17) |
| **WC-0B I2** (`4c87bae45`, 08-15) | `spatial/migration.js:474/:504/:509` | The column-class surface widened to a three-way union with a three-way release fork, four planted mutants convicting | Makes POP-1's Q1 (`'returning'`) a three-structure decision, not the volume's two |

### A.4 The corrected car estimate for POP

PRICING-32-33.md §B prices POP at **32–45 C** (POP-1 5–7 · POP-2 4–6 · POP-3 3–4 · POP-4
3–4 · POP-5a 4–5 · POP-5b 4–5 · POP-6 6–9 · POP-7 3–5). This pass moves it as follows
(my arithmetic — PLAUSIBLE; each delta's cause is a CONFIRMED receipt above):

| Wave | PRICING | Corrected | Why |
|---|---|---|---|
| POP-1 | 5–7 | **5–7** | unchanged in cars, but the brief MUST be re-cut: the reception premise is false (claim 16), the belief half already exists (do not rebuild `pullBand`), and Q1 now touches three structures |
| POP-2 | 4–6 | **4–6** | unchanged; re-derive the plan-refusal *price* against W-COIN's coin before drafting, and declare the `sovereigntyMarketStage` sibling reader |
| POP-3 | 3–4 | **3–4** | unchanged; genuinely greenfield, the only POP wave with no older cousin |
| POP-4 | 3–4 | **5–7** | **+2. (a) The M11b reconciliation car** — own, gate, or fold the LIT calamity arc, which already kills people, already stamps `calamityHistory` and already runs the exodus; otherwise POP-4's `spatialLedgers.calamityArcs` is a second arc ledger and ZERO-NEW-MORTALITY is asserted beside a live sink. **(b) The silent-close car** — M11a's clearances push a receipt and no news; the aftermath voice is a fork on an existing producer, not a new one |
| POP-5a | 4–5 | **4–5** | unchanged; declare `roads/migrationReason.js` as the waiting reader in the event-kind registry comment |
| POP-5b | 4–5 | **4–5** | unchanged in cars; the treaty-input reachability pins C-POPF-7 requires are now cheap — GR-2's lane genuinely drafts all three terms |
| POP-6 | 6–9 | **5–8** | **−1**: eight phrase rows and the crowding line already landed, and C1 banked the `population_` prefix cure for the shrink-only EXACT_SECTION trap. Offsetting duty, not a car: every new kind must now REGISTER or print a refusal |
| POP-7 | 3–5 | **2–4** | **−1**: three capacity tripwire rows, the per-year series and `realmDemography` already execute |
| **POP total** | **32–45** | **32–46, centre ≈ 39** | ≈ flat (+0.5 car). The yield is not money: it is three status changes, one falsified premise, one corrected recon row and one LIT producer to reconcile |

Lighting is NOT added per wave — PRICING §D routes every #32 flag through the single
second declared lighting window. Note for that window: POP's flags are unusual in that
their *precondition* `demographicsEnabled` is itself a dark flag governing a behaviour
change the P1 commit measured (1,200 people → 678,742,973 under the pre-cure control), so
POP's lighting is a **declared shift with movers named**, not a quiet flip.

The #32 count row for POP moves from **8 of 8 UNBUILT** to **0 built / 5 part-built /
3 unbuilt** (part: POP-1, POP-4, POP-5b, POP-6, POP-7; unbuilt: POP-2, POP-3, POP-5a).
That is a status change, not a car change — every "part" is either substrate the wave was
chartered to consume, or a neighbouring programme's landing that the wave must now
reconcile with instead of duplicate.

---

## B. THE FULL CLAIM TABLE

| # | Claim | Source (sha/date/§) | Wave | Status | Code evidence at laneCONSIST-932 | Label |
|---|---|---|---|---|---|---|
| 1 | **The entire WAVE P demographic engine is DARK in every preset.** Six commits, ~12,000 lines of src+tests, and no world runs it. Every POP flag's §2 lit-precondition is therefore unmet | `d620a05d4`/`439030622`/`ef54119e9`/`7ce0148bd`/`99e2d54f2`/`47b4ed9dc`, all 2026-08-01 | all | **LANDED-DARK** | `simulationRules.js:1027 demographicsEnabled: false`; `grep -rn 'demographicsEnabled: true' src/` → **0**; gate `demographicsRates.js:102-105`; 16 gated call sites | CONFIRMED |
| 2 | **M11b CALAMITY is LIT in the DEFAULT preset** and already does POP-4's shock, stamp, mortality, exodus, tier demotion and legitimacy condition | `62c81a0ce` 2026-07-13 + `45eb5387e` 2026-07-15 | POP-4 | **LANDED-LIT** | `disastersEnabled: true` at `simulationRules.js:768` (`realistic_regional`, the default), `:819` (`dramatic_campaign`), `:927` (`full_simulation`); mount `pulseKernel.js:2451`; 1,376 lines over `calamityKernel.js` / `spatial/calamity.js` / `display/calamityLedger.js` | CONFIRMED |
| 3 | **M11a PESTILENCE already implements POP-4's ARC STAGING** — typed three-phase lifecycle with a recovery floor and refractory windows | `82ad676b2` 2026-07-13 | POP-4 | **LANDED-LIT** (mapped worlds) | `spatial/pestilence.js:257-267` `@typedef {'incubating'\|'active'\|'recovering'} EpidemicPhase`; `:107 RECOVERY_FLOOR_TICKS: 26`; `:108 REFRACTORY_TICKS: 8`; mount `pulseKernel.js:2420` | CONFIRMED |
| 4 | M11a is reachable with **no simulation-rule flag** — its only gate is the canonize marker, written by a real user action | same | POP-4 | **LANDED-LIT** | `pestilence.js:151-155 epidemicActive` → `Number.isInteger(spatialCanonVersion) && > 0`; writer `src/store/campaignSpatialCanonize.js:171 c.worldState = { ...ws, spatialCanonVersion: nextVersion, ... }`; the call at `pulseKernel.js:2420` is inside no `if` | CONFIRMED |
| 5 | **The plague arc opens loudly and closes silently** — POP-4's aftermath/recovery voice hole, located exactly, on a live producer | same | POP-4 | gap in a LIT producer | `pestilenceKernel.js:258 newsEntries.push(materializationNews(...))`; clearance loop `:262-264` pushes only `receipts.push({ id: c.id, kind: 'cleared' })` — no `newsEntries.push` | CONFIRMED |
| 6 | `plague_arrival` is a **fully registered kind** — POP-4's recovery kind has a copy-exact precedent and needs no new routing class | NEWSTRAIN / heraldRouting | POP-4 | LANDED-LIT | `settlementRumors.js:366 plague_arrival: 'a sickness spreading'`; `realm/heraldRouting.js:277 plague_arrival: 'events'`; mint `pestilenceKernel.js:289-298` (`headline: 'Plague reaches …'`, `significance` banded at `:287`) | CONFIRMED |
| 7 | **POP-1's belief half is built under SPINE SP-B as `pullBand`**, and the volume's own §2 calls SP-2 SATISFIED without noticing the axis is POP-named | SP-B, 2026-08-05 | POP-1 | **LANDED-DARK** | `beliefAxisSubjects.js:107 PULL_BANDS = ['shunned','overlooked','sought','coveted']`; `:101-104` "MINTED. How strongly a place is believed to DRAW people to it"; `:119` "`pullBand` is SP-B's own populations road and no ES product may name it"; `:123 CONDITIONS_KEYS`; field `beliefMap.js:348`; gate `beliefAxes.js:92` | CONFIRMED |
| 8 | **POP-1's ground truth is NOT TR-3-frozen** — the pull band's primary input moves live; only its hunger-shift arm is generation-frozen | — | POP-1 | live + one frozen arm | `beliefAxisSubjects.js:324-331` (`prosperityRank(economy.prosperity)` → band, then `:330` shifts down on `foodRatio < 0.95`); `economicState.prosperity` written live at `generosityUpdates.js:145`, `upswingKernel.js:923`, `traditionsKernel.js:383`, `roads/state.js:485`; `foodRatio` written ONLY at `generators/foodGenerator.js:337/:424` | CONFIRMED |
| 9 | **But the carrying capacity itself IS fully generation-frozen at every lit preset** — the POP analogue of TRADE's `foodRatio`, and a deliberate, pinned property rather than a defect | P1's own commit body | POP-1/4/5b | frozen ground truth | `demographicsRates.js:558 const local = Math.max(0, Math.floor(ledger.dailyProduction * mouthsPerUnit))`; header `:15` "the generation-frozen physics on economicState.foodSecurity"; `dailyProduction` writers ONLY `generators/foodGenerator.js:270/:428` and `generators/economy/foodBalance.js:147/:276/:459`; the live import arms at `:563-577` require `routeLifecycleActive` (dark) or a P3 works plan (dark) | CONFIRMED |
| 10 | The **reserve axis is live**, which narrows the freeze further: `foodStockpile.js` moves `storageMonths` on the production path | — | POP-1 | LANDED-LIT | `foodStockpile.js:1-6` "storageMonths **was** generation-frozen … This module makes it a conserved, tick-advanced stock"; mount `pulseKernel.js:35/:543`; consumed by `demographicReadings` (`demographicsPushPull.js:301-304`) and by `conditionsGroundTruth`'s `storesBand` (`beliefAxisSubjects.js:314-318`) | CONFIRMED |
| 11 | **POP-5b's treaty half is built under GRAMMAR and MOUNTED** — a believed-migration trigger drafting all three population terms | GR-2/GR-3, 2026-08-06 | POP-5b | **LANDED-DARK** | `pactTriggers.js:254-268 scoreMigrationPressure` ("One court is believed to draw people the other is believed to lose"); call `pactFormation.js:262`; ladder `pactFormation.js:180-184` (`migration_right` 0 · `labor_compact` 0.60 · `settlement_provision` 0.85); catalog `peaceTermsCatalog.js:250/:254` family `population`, executors `grant`/`transfer`; flag `simulationRules.js:324`, no `: true` | CONFIRMED |
| 12 | POP-5b's POP-side readers are **inert**, exactly as RECHECK §1 said | — | POP-5b | **LANDED-INERT** | `treatyEnforcement.js:300-301 migrationRightFor` — zero callers in src; `demographicsLadder.js:209 moverPermitted` — exactly one caller, `demographicsResponses.js:244` (the founding gate) | CONFIRMED |
| 13 | **POP-6's S30 premise is dead: the de-underscore fallback arm was DELETED** and unregistered tokens now refuse | `6c862159e` 2026-09-02 (NEWSTRAIN car 2/3) | POP-6 | LANDED-LIT | commit body: "the de-underscore arm is deleted … An unregistered token now takes `UNREGISTERED_SUBJECT`"; also records the `route_chartered`/`route_revived` deferral on the shrink-only EXACT_SECTION trap | CONFIRMED |
| 14 | **Eight of POP-6's population/migration phrase rows already exist**; five of the volume's eleven are still absent and now refuse rather than fall back | `6c862159e` + `ec6b0a132` | POP-6 | LANDED-LIT | present: `settlementRumors.js:349 flow_migration`, `:350 migration_pressure`, `:351 population_emigration`, `:355 population_crowding`, `:357 migration_flight`, `:474 settlement_resettled`, `:475 settlement_terminal_death`, `:477 steading_forced`. Absent (0 hits): `population_decline`, `population_growth`, `tier_change`, `steading_founded`, `steading_absorbed` | CONFIRMED |
| 15 | **CAPACITY C1 landed POP-6's crowding headline** and banked the ratchet cure POP-6's new kinds need | `ec6b0a132` 2026-09-03 | POP-6 | LANDED-LIT | `demographicsHerald.js` 266→465 lines (`crowdingCrossingOf` at `:166`, the authored prose table at `:181+`); commit body: an `EXACT_SECTION.population_crowding` row would have grown `LEGACY_UNVOICED_TOKENS` 275 against a shrink-only ceiling of 274 — "the `population_` family prefix files the beat at the SAME trade desk for nothing" | CONFIRMED |
| 16 | **RECORD≠CODE — the recon pass over-credits POP-1's reception, and the chair's own ledger ruling says so.** The landing is still unconditional; the refusals the recon cites are PRE-DEPARTURE | PROGRAMME-32-34.md:371 vs ODQ line 2019 (§46c correction, chair, 2026-08-15) | POP-1 / #33 LG-9..12 / ES §46c | **RECORD≠CODE** | Stage 1 `demographicsMigration.js:452-479` branches only on `writable(destId) ? destId : writable(originId) ? originId : null` — **no capacity read**; receipt line `:493` "newcomers reach ${name} and are taken in". Volume S6: "`no_capacity` is PRE-departure" (`:107-109`, minted in `competeForDestinations` `:231-242`). ODQ: "REFUTED — there IS no caravan reception machinery at HEAD … POP-1's arrival clearing would be the FIRST refusal machinery in the tree, so §46c's cover mechanics are BLOCKED-ON POP-1" | CONFIRMED |
| 17 | **A FALSIFIED PREMISE the P programme recorded against itself.** P3 denominated plan provision in its own unit because "the tree carries NO settlement treasury"; the treasury has since landed | `subsystemRowsGrowth.js:284` vs W-COIN | POP-2 / POP-5b | **RECORD≠CODE** | The row reads: "the tree carries NO settlement treasury … and storageMonths was REFUSED as the denomination … so provision is the lane own unit and **should be re-denominated the day a real treasury lands**". `src/domain/worldPulse/treasury.js` = 73,777 bytes; `treasuryEnabled` at `simulationRules.js:402`, `: true` only in tests | CONFIRMED |
| 18 | **RF-4's three addresses ROTTED but its claim holds** — and the arrival-side writer is still absent, so the reads are still orphans of the arrival lane | volume §1b RF-4 | POP-1/POP-3 | RECORD≠CODE (addresses only) | `stressorPicker.js` is at `src/domain/stressorPicker.js` (`mass_migration` at `:50`), **not** `src/domain/worldPulse/`; `capacityModel.js:633` is now `:641` (`/refugee\|migrant\|influx/i`, demand +12); `stressorGates.js:476` is now `:602` (×1.4 contagion); `stressorDynamics.js:321-331` survives at its address. Writers: `generators/stressGenerator.js:217/:278`, `generators/stressPriority.js:22`, `generators/foodGenerator.js:255` — **all generation-time** | CONFIRMED |
| 19 | **POP-2's misrule-answer gap CONFIRMED STILL OPEN** at the address the volume gave | volume S22 | POP-2 | gap | `assizeKernel.js:344-347` — `coupled = commonsActive && ((!!namedAccused && !!accusedNid && namedAccused === accusedNid) \|\| (String(liveCommons.kind) === 'corruption' && c.charge === 'corruption'))` | CONFIRMED |
| 20 | **R-28 CONFIRMED STILL OPEN, at a moved address** — the departures=0 arm still says "left" in the headline while the summary is honest | volume §1a R-28 (cited `:257`) | POP-6 | open defect | `demographicsHerald.js:420 headline: \`${quantityWords(departures \|\| unplaced)} left ${origin}\``; honest summary at `:423` "would have left ${origin}, and the realm had nowhere to put them". The volume's `:257` is dead — C1 added 199 lines | CONFIRMED |
| 21 | **A live consumer of P3's plan ledger under another programme's name**, which POP-2/POP-3 must not widen the ledger past | sovereignty market stage | POP-2/POP-3 | LANDED (gated with its own flag) | `sovereigntyMarketStage.js:432 const plans = plansLedgerOf(worldState)`; `:452 const priorBand = text(recordOf(plans[sellerId]).band)`; header `:5-7` "IT IS A SIBLING OF THE DEMOGRAPHIC PLAN LANE, NOT AN EXTENSION OF IT … this stage widens neither the closed RESPONSES vocabulary nor the plan ledger" | CONFIRMED |
| 22 | **RF-1 holds unchanged** — `columnOf` is still a whitelist at three sites; POP-1 and POP-5a each still owe a conditional carry-through | volume §1b RF-1 | POP-1/POP-5a | unchanged | `spatial/migration.js:543-560` rebuilds exactly `{originId, destId, arrivals, departTick, arrivalTick, ...(COLUMN_CLASSES.indexOf(travelClass) >= 0 ? { travelClass } : {})}` | CONFIRMED |
| 23 | **RF-2/Q1 is now a THREE-structure decision** — the class surface was widened after the volume was compiled | `4c87bae45` 2026-08-15 (WC-0B I2) | POP-1 | volume-stale | `spatial/migration.js:474 DEMOGRAPHIC_COLUMN_CLASSES` (2), `:504 MILITARY_COLUMN_CLASSES` (3), `:509 COLUMN_CLASSES` (the frozen union); the release fork made three-way; commit body records four planted mutants convicting on different case sets | CONFIRMED |
| 24 | **POP-5a's road-scene reader already exists** and states the limitation POP-5a exists to lift | `98efe1d3b` 2026-07-19 (R-7) | POP-5a | LANDED (lazy display) | `roads/migrationReason.js:31-33` "The engine's ONE migration cause … the sole reason a column moves: a shed / over-capacity settlement"; `:38-40` "In this engine migration has a SINGLE cause"; enrichment from `dest.populationHistory` at `:56-63`; "a ZERO-IMPORT LAZY LEAF, read only from the lazy roadScene composer" (`:9`) | CONFIRMED |
| 25 | **CAPACITY C2 built POP-6's state surface and it is INERT** on a measured first-paint byte cost — the same wall POP-6 hits through `settlementRumors.js` | `6bddd6183` 2026-09-03 | POP-6 | **LANDED-INERT** | `src/domain/display/demographicReading.js` (257 lines, gate at `:181`); zero src importers — only `tests/lint/.tuning-inventory.json:3125/:3160/:3197` and a `tests/scripts/readerRubric.test.js:220` string literal. Commit body's A/B: leaf imported by ViabilityTab 1,047,186/1,048,000 (margin 814) vs removed 1,046,996 (margin 1,004) — a **190 B chunk-graph cost, not the leaf's bytes** | CONFIRMED |
| 26 | **POP-7's rail is already laid** — three capacity tripwire rows execute, a fourth is refused with its reason at the site, and the realm envelope emits | `d02c5acde` + `ec265d24c` (§909 car 1a) + P4 | POP-7 | LANDED | `scripts/soak/tripwires.mjs:392 capacity_plateau`, `:461 capacity_floor_thaw`, `:494 capacity_realm_load`, `:543 capacity_envelope_30y` (NOT-EXECUTABLE — "MEASURED at this tip: NO SUCH FIELD IS WRITTEN"); `scripts/audit/behavioral-observation.mjs:1003 observeRealmDemography`, `:1059` additive spread; producer `demographicsObservation.js:103/:137` | CONFIRMED |
| 27 | **POP-3 has no older cousin anywhere** — the only POP wave that is genuinely greenfield | tree-wide grep | POP-3 | absent | `departureMemory` / `diaspora` / `kinTie` / `kinPull` = 0 src hits; `dossierCausalProse.generated.js:4897 "JF-SS-diaspora_return"` is generated prose; `homeland` appears only in `npcProfile.js:105/:238` and `factionProfile.js:206-207` copy. Nearest: `traditions/relations.js:48-49` + `traditionsKernel.js:624-644` (adoption influx — a memory of arrivals) | CONFIRMED |
| 28 | **POP-4's substrate gate is DISCHARGED** and the discharge is larger than PRICING's note: the decline lane now writes population ONLY as a conserved transfer when the engine is lit | ODQ §219.3, in-code | POP-4 | LANDED-DARK | `populationDynamics.js:407-425` — "THE DEFERRAL ABOVE IS DISCHARGED … IT WAS NOT CONSERVATIVE. Two rolling soaks measured the consequence independently: a realm at 4% of its start, 95.3% of the loss in THIS lane … SO WHEN THE ENGINE IS LIT THIS LANE WRITES POPULATION ONLY AS A CONSERVED TRANSFER" | CONFIRMED |
| 29 | The P programme's certification row records that **no new impactKind was minted deliberately** — the Herald lines ride `hungry_gap` and `migration_flight`. After NEWSTRAIN that constraint changed shape: registration is now mandatory, not optional | `subsystemRowsGrowth.js:284` + `6c862159e` | POP-6 | premise shift | row: "NO NEW impactKind IS MINTED, deliberately: a new literal would red three registration walkers whose registries live in files this slice may not touch" — the three walkers are still the gate, but the fallback that made non-registration survivable is gone | CONFIRMED |
| 30 | Wave P was flagged by the owner for Fable re-validation and **accepted whole**, with two escalations owner-ruled and landed as P5a/P5b — so nothing in the P estate is an unratified draft | `docs/FABLE_VALIDATION_QUEUE.md:64-66, 126, 137, 147-149` | all | record | FVQ:66 "**WAVE P ENTIRE (P1, P1a, P2, P3, P4) — the demographic engine** … ACCEPTED slice by slice under Opus, every one gate-green with executed negative controls"; FVQ:149 owner ruled the two escalations FIX BOTH, landed `47b4ed9d` | CONFIRMED |

---

### Grep traps banked by this pass (all CONFIRMED at source)

- **`PULL_BANDS` has THREE incompatible definitions.** `beliefAxisSubjects.js:107` is SP-B's
  populations pull, four rungs `['shunned','overlooked','sought','coveted']` — the one
  `pactFormation.js:262` imports. `faithWitnessSource.js:104` and
  `npc/livedExperienceCatalog.js:134` are both `['faint','firm','heavy']` and belong to
  faith witness and the lived-experience funnel. A grep for `PULL_BANDS` returns all three.
- **`calamity` is M11b's natural disaster, LIT in the default preset** (`calamityKernel.js`,
  `spatial/calamity.js`, `display/calamityLedger.js`, `calamityHistory`) — **not** POP-4's
  `calamityArcEnabled`, which has 0 hits. The name collision is one word deep and POP-4's
  designed `spatialLedgers.calamityArcs` sits beside a live `calamityHistory` stamp.
- **`demographicReading.js` (singular, `src/domain/display/`, C2's inert leaf) vs
  `demographicReadings` (plural, `demographicsPushPull.js:288`, eight live src call sites).**
  One letter apart; a grep for the first returns mostly the second.
- **`stressorPicker.js` is at `src/domain/`, not `src/domain/worldPulse/`** — the volume's
  RF-4 address does not exist, and `ls src/domain/worldPulse/stressorPicker.js` exits 1.
- **`mass_migration` is a GENERATION stressor type.** Every writer is a generator; its
  domain hits (`stressorDynamics.js:321/:479/:482`, `stressorGates.js:602/:1039/:1050`,
  `capacityModel.js:641`, `DailyLifeTab.jsx:42`) are all READS. It is not a POP coupling.
- **`migration` in `customContentMigrations.js`, `settlementMigrations.js`,
  `customContentLocalLedgerMigration.js`, `settlementConfigMigration.js`,
  `tests/lint/significanceMigration.census.test.js` and `landingFooterMigration.test.jsx`
  is SCHEMA migration**, not population movement — six of the tree's `*igration*` files.
- **`migration_pressure` is GR-2's pact trigger AND a registered WHAT_PHRASES kind**
  (`settlementRumors.js:350`). It is not a POP wave and not `migrationRumorsEnabled`.
- **`P1`..`P5` in `git log --grep` also matches** June's `Sim P1.1` / `P3.3b` ladder, and
  `W-MEM-P1`, `GR-5A P1`, `HB-2B P1a/P1b`, `sk-a P1`, `Decide P6`. The demographics
  programme is exactly the six commits dated 2026-08-01 listed in claim 1.
- **`POP-` in the ODQ returns 25 hits**, of which the `DS-POP-*` ids are the prose-rewrite
  programme's dossier sections (`94a6f33f4` "DS-POP-1 — the banded head count"), not waves.
  Only 11 lines carry a genuine `POP-[1-7]`.
- **`commonsVoice` ≠ `commonsArc`** (already banked in RECHECK §5) and
  **`believedMigrationEnabled` is one word from the live `migrationRumorsEnabled`** — the
  volume's own §2 name-collision fence. Both still hold.
- **`tests/domain/demographicsWorldsHand.test.js:524` "the permit table is TOTAL" is P4's
  ladder, not POP-5b** (RECHECK §5, re-confirmed).

---

## C. WHAT THIS PASS FOUND THAT NAME-SEARCH COULD NOT, AND WHAT IT DID NOT FIND

**Eight findings, none reachable by a flag/leaf name-search**, because each lives under a
different programme's name, in a ledger ruling, in a commit body, or in a mechanism:

1. **M11b's calamity arc is LIT in the default preset** — found by reading the mount
   comment beside M11a's, not by searching `calamityArcEnabled` (0 hits). It is the POP
   analogue of trade's famine-profiteering find, and larger: a live mortality sink under a
   name one word from POP-4's flag.
2. **M11a already has the typed stages POP-4 was chartered to build** — found by reading
   `spatial/pestilence.js`'s typedef, a file the POP volume's own §4 size list omits.
3. **The arc's silent close** — found by reading the two loops beside each other; no name
   for this absence exists to search for.
4. **`pullBand` is reserved to POP by name inside SPINE's file** — found by tracing
   GR-2's `PULL_BANDS` import, not by searching `believedMigration*`.
5. **The reception over-credit** — found by reading the chair's §46c correction in the
   ledger *against* the recon row and then settling it at the landing code. This is the
   one finding that changes what a launch-path lane would be told: LG-9..12 and ES §46c
   are still blocked on POP-1, and PROGRAMME-32-34.md:371 says they are not.
6. **The falsified no-treasury premise, recorded by the P programme against itself** —
   found by reading the `demographicsEnabled` certification row whole (it is the single
   longest prose record of the P programme anywhere in the tree).
7. **POP-6's fallback arm was deleted a month after the volume** — found in a NEWSTRAIN
   commit body under `display/settlementRumors.js`, a file no POP identifier names.
8. **C2's 190 B is a chunk-graph cost, not the leaf's bytes** — found in the commit body,
   and it matters because POP-6 spends against the same 795 B margin PRICING §C records.

**What it did NOT find: a single POP wave built whole under another name.** The owner's
suspicion is right about the machinery and wrong about the waves, and the split is exact —
the *engine* (P1–P5), the *calamities* (M11a/M11b), the *belief* (SP-B), the *treaty*
(GR-2/GR-3) and the *instruments* (CAPACITY) are all built; the seven POP waves are the
agency, refusal, memory and voice layers that sit on top of them, and not one of those is
complete.

### Caveats, recorded vetoably

- Read-only. No suite was executed; **CONFIRMED** here means the code or commit text was
  read at the cited address at `laneCONSIST-932` HEAD `315080928`, not that a run was
  observed green.
- The car deltas in §A.4 are my arithmetic over PRICING's rows (PLAUSIBLE at the total,
  CONFIRMED at each cause). I did not re-derive PRICING's base figures.
- I did not re-open POP-2's or POP-3's recon rows beyond the two gaps in claims 19 and 27;
  both were already CONFIRMED-UNBUILT by two prior passes and nothing in the older
  programmes contradicts them.
- The `demographicsEnabled` certification row (`subsystemRowsGrowth.js:284`) is a single
  ~9,000-character string. I quote three passages from it; a later reader wanting the P
  programme's full self-record should read that row whole rather than trust this summary.
