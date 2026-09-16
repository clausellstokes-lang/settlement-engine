# HISTORY PASS — POP (populations) — THE LEDGER READER — 2026-09-15

Reader: the POP ledger seat. Sources read in full or by targeted `grep -n` +
`sed -n` section reads: `OWNER_DECISION_QUEUE.md` (3.4 MB / 32,673 lines, at the
ledger blob `a803dee7a`), `START_HERE.md`, `A_PLUS_ROADMAP.md`, `SOL_QUEUE.md`,
`FABLE_VALIDATION_QUEUE.md`, `GOLDEN_SHIFT_LEDGER.md`, and the volume
`DESIGN_FP_ARCH_POP.md` (605 lines, compiled 2026-08-04 at HEAD `e564e135`).
There is no separate git-log reader in this run, so every sha the ledger names
was verified with `git -C laneCONSIST-932 log -1`, and `git log --all --grep=`
was run over the family's wave ids, leaf names and older-programme names so that
landings the ledger never recorded still enter the table.

**Code standard.** Every code figure is an executed receipt at
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneCONSIST-932`
(HEAD `315080928`, 2026-09-15, "LT37 car 6"), quoted with `path:line`, and
marked **CONFIRMED** on that basis. Reasoning-only claims are **PLAUSIBLE**.
Read-only pass: no suite was executed, nothing was staged, nothing mutated.

⚠ **Address note.** The POP volume's `file:line` addresses were taken against
`src/domain/…`. At the consist the whole family lives under
`src/domain/worldPulse/` (`demographicsMigration.js`, `demographicsKernel.js`,
`demographicsHerald.js`, `simulationRules.js`, `populationDynamics.js`,
`demographicsObservation.js`, `commonsVoiceKernel.js`, `urbanFabricKernel.js`).
Navigate by symbol.

---

## A. THE ANSWER FIRST

### A.1 In one paragraph, for the owner

**No POP wave was ever built, and — unlike trade — almost nothing was built
under another programme's name either. What the history shows instead is a
family whose entire substrate is switched OFF in every world a player can run,
under a STOP the chair re-affirmed eight days ago.** All six POP flags
(`believedMigrationEnabled`, `commonsArcEnabled`, `departureMemoryEnabled`,
`calamityArcEnabled`, `roadDramaEnabled`, `moverPermitsEnabled`) have **zero
hits in src and zero in tests** at the consist (CONFIRMED), `git log --all
--grep='POP-'` returns **not one wave commit** (every hit is a `DS-POP-*`
dossier section from September's prose rewrite — the family's own grep trap),
and the waves' own titles ("believed road", "arrival clearing", "departure
memory", "commons arc", "road drama", "permit table") return **zero commits**.
The ledger's decisive POP finding is not a landing but a **ruling**: the
demographic engine itself — `demographicsEnabled`, the flag every one of the
eight waves declares as its lit-precondition — is `false` in `full_simulation`
and absent from the other six presets (`simulationRules.js:1027`, CONFIRMED),
and when the 2026-09-06 lighting wave put twenty-one virtual keys into the
default preset it **deliberately left this one out**: ODQ §907(e), 2026-09-07,
"*the `demographicsEnabled` class-E STOP inside L-DEFAULT: its trigger (the
runaway) does not reproduce, its plateau half is unproven, and the key still
re-infers the legacy default as `custom` (§903) — the STOP holds; nothing here
lights it*". That is POP's §96.2. Around that STOP the ledger records **five
real POP-family landings nobody's #32 table carries** — the P4 decline/death
reconciliation (§219→§272, `4eafca31a`), the cs-4 named-floor cure (`ac2d32ac8`),
and CAPACITY C1/C2/C3 (`ec6b0a132`/`6bddd6183`/`d02c5acde`), which together
**cure the 300-year population runaway, add a third demographic Herald line and
mint a 31-row owner tuning roster** — and **two owner-ordered programmes that
were chartered and never built at all**: the **pg contagion family** (owner,
2026-08-16, verbatim "*Comprehensively, exhaustively, carefully, seamlessly,
coherently, and cohesively build it and slot it where appropriate*" — pg-0..pg-4,
**zero code at the consist**) and the **stressor pin** (§128, owner directive,
**zero code**). Neither appears in `PROGRAMME-32-34.md`, `RECHECK-32-34.md` or
`PRICING-32-33.md`. Finally, one correction the trade pilot's fold got backwards
and the RECHECK repeated: **ODQ §49's "BLOCKED-ON POP-1" blocker is ALIVE**, not
dead.

### A.2 The six things a POP implementer must know before writing a brief

1. **The family's substrate flag is under a live STOP** (§907(e), 2026-09-07).
   Every POP wave lands into a dark engine, and lighting it is not a POP act —
   it is the owner-signed soak redo. `simulationRules.js:1019-1026` says so in
   its own words: "*LIGHTING IT belongs at the owner-signed soak redo, after P2's
   overflow valves, P3's migration homeostat and P4's stressor couplings land*".
   PRICING §B's POP-1 row ("blocked on: nothing — three lit-preconditions
   satisfied") reads past this.
2. **Two of POP-1's three declared lit-preconditions are NOT lit.**
   `demographicsEnabled` is false (above); `migrationRumorsEnabled` is in the
   manifest (`simulationRules.js:309`) but appears in **no preset spread**
   (CONFIRMED — the only three flag literals in the preset table are
   `migrationFlowsEnabled`). Only SP-2's `believedConditionsEnabled` landing
   is satisfied. Lighting POP-1 alone buys nothing.
3. **The volume's substrate row S1 is stale.** cs-4/CS-B2 (`ac2d32ac8`,
   2026-08-15) already cured the named floor; the code now reads
   `const after = Math.max(Math.min(named, before), before + births - deaths);`
   (`demographicsKernel.js:313`) with a comment naming the old expression as a
   people-minting law-1 break. POP-4's "named-cast pin under arc conditions
   (S1 machinery)" is written against a shape that no longer exists.
4. **POP-4's substrate gate is DISCHARGED, and the ledger says who did it and
   at what cost.** §219→§271→§272 (2026-08-16/17) landed the P4 reconciliation
   at `ac243e1c1 → 4eafca31a`; §271.4 flags three constants
   (`DEATH_CRISIS_GAIN = 3.0` and two siblings) **for the owner's tuning
   signature**, and §272.2 records thirteen golden rows re-recorded under four
   conditions. PRICING already carries the discharge; the **owner obligation**
   attached to it is not in any recon doc.
5. **C-POPF-6 is an unresolved chair STOP on POP-1.** §144.2 (2026-08-16):
   "*C-POPF-6 is a hard STOP awaiting chair.*" No later § records a resolution
   (the string `C-POPF` appears at seven ODQ lines only; the last is that STOP).
   POP-1's coupling rows have no desk.
6. **POP-1 was COMPILED and never dispatched.** §144.2: "*TC26 (WY/POP): wy-0
   (5 flagless) + pop-1 (5, §2.5 flag-LEADS shape) compiled to execution-ready*".
   A five-member execution-ready POP-1 train exists in the record and produced
   no commit. Whoever re-briefs POP-1 should look for that compile before
   re-compiling it.

---

## B. THE FULL CLAIM TABLE — IN LEDGER ORDER

Status vocabulary (the trade fold's, verbatim): **LANDED-LIT** (runs in a
shipped preset) · **LANDED-DARK** (code present, no preset lights it) ·
**LANDED-INERT** (code present, unreachable regardless of flag) ·
**LANDED-THEN-REVERTED** · **DESIGNED-ONLY** · **RECORD≠CODE** · **RULING** ·
**COMPILED-NEVER-EXECUTED**.

| # | § / line (ODQ unless named) | Date | What was decided or landed | Sha the record names (verified) | Wave | Status at laneCONSIST-932 | Code evidence | Label |
|---|---|---|---|---|---|---|---|---|
| 1 | §46c (L1781, L1836-1857, L1895, L1925) | 2026-08-15 | LG's caravan-cover design: a spy hides in an **immigrant population** or a caravan and inherits the group's fate; "POPULATIONS and settlements RETAIN THE RIGHT TO REFUSE the individual NPC" | — | POP-1 consumer (#33) | DESIGNED-ONLY | no reception/refusal machinery on the arrival path — see row 2 | CONFIRMED |
| 2 | **§49 (L2019-2025)** | 2026-08-15 | ⭐ **THE CORRECTION THAT STILL BINDS.** The chair REFUTED its own §46c note: "*there IS no caravan reception machinery at HEAD; migration landing is unconditional with no capacity read (demographicsMigration.js:453-482). **POP-1's arrival clearing would be the FIRST refusal machinery in the tree**, so §46c's cover mechanics are BLOCKED-ON POP-1*"; sequencing recorded: **POP-1 precedes the §46c spy waves**. Also: the demographic column-class vocabulary + `columnOf` carry-through are ruled JOINTLY across POP/LG/ES at the LG sitting, not at POP-1's Q1 | — | POP-1 / LG-9..12 / ES | **RULING — STILL ALIVE** (contra the trade fold row 37 and RECHECK §3 L371) | `demographicsMigration.js:453-490` STAGE 1 has **no capacity read**: `const target = writable(column.destId) ? column.destId : writable(column.originId) ? column.originId : null;` (:464-466) — `lost` only when both ends are gone (:468), `returned` only when the destination is unwritable (:478). The refusal words are minted PRE-DEPARTURE inside `competeForDestinations` (`:232-237`), and `MIGRATION_REFUSALS` (`:107-108`) is that same pre-departure vocabulary | **CONFIRMED** |
| 3 | §50 / §49 (the flag-mint bill) | 2026-08-15 | The flag-mint law: manifest + AUTHORED certification row + first strict gate read in ONE commit; the seventh path (`subsystemRowsVirtual.test.js`); later the EIGHTH (seven edge-shared MODIFY rows + `npm run build:edge-shared`) | — | every POP wave (six flag mints) | RULING — live | volume RF-3 + §2 carry it; PRICING §A item 2 prices it at 35→36 manifest keys today | CONFIRMED (record); code count PLAUSIBLE |
| 4 | **§72.1 (L2830)** | 2026-08-15 | **cs-4 CONFIRMED as an engine defect**: "*the demographic named floor mints population against the receipt (`max(named, …)` vs the module's own law 1)*"; repair chartered as a declared-shift packet | `ac2d32ac8` **CS-B2** 2026-08-15 "the named floor stops minting people against its own receipt" | POP-4's S1 premise | **LANDED-DARK** (rides `demographicsEnabled`) — and **RECORD≠CODE against the VOLUME** | `demographicsKernel.js:303-313`: `const pool = Math.max(0, before - named);` … `const after = Math.max(Math.min(named, before), before + births - deaths);` with `// CS-B2 (cs-4): floor WITHOUT the mint.` at `:305`. The volume's S1 receipt (`after = Math.max(named, …)`) is the PRE-cure shape | **CONFIRMED** |
| 5 | §72.2 | 2026-08-15 | INVARIANT-HOLDS recorded: "*demographics conservation closing to zero byte-identically*" — the 300-tick identity is the family's standing defence | — | POP-1/POP-5a extend it | LANDED (test) | `tests/domain/demographicsMigration.test.js` (volume S8: exact identity `:209`, leak negative control `:234`) | CONFIRMED (record); line cites inherited from the volume — PLAUSIBLE |
| 6 | **§92.1 (L3494-3510)** | 2026-08-15 | **THE POP ROUND ACCEPTED (POP-F).** §70.4 stamp: absorption 18/26 + 8 structural rows; 0 verdict changes over 65 blobs; law pass 5 MATERIAL / 9 DRIFT / 10 HOLDS. **Cures C-POPF-1..8 SIGNED as compile obligations**, headed by **C-POPF-2 THE RECEPTION CONTRACT** (POP-1's §6 now specifies what §46c's journey fates consume: inputs, refusal-by-suspicion, wartime relaxation, caravan class-intake, flag-conjunction ordering) | — | POP-1 (all waves) | DESIGNED-ONLY | no reception contract in code; row 2's evidence | CONFIRMED |
| 7 | §92.2 (L3507) | 2026-08-15 | **THE CERTIFICATION-PATTERN STANDING CURE**: the 20↔20 bijection killed the own-lane certification design in three volumes (WC-0E F-1, EP J-EP-1, **POP's F-1**); all family volumes authored before that pin are RULED SUPERSEDED on their certification/flag sections | — | every POP wave | RULING — live; C-POPF-1 STRUCK the declared-pending + backlog doors | volume RF-3 records it; PRICING §A item 2 confirms `VIRTUAL_PENDING_RULE_KEYS = Object.freeze([])` | CONFIRMED (record) |
| 8 | **§92.3 (L3518-3523)** | 2026-08-15 | **THE LG BLOCKAGE NARROWED (F-3)**: LG Q3's "POP's cured shape when POP-0/1 lands" is a PHANTOM (the scalar is schema-canonical, §66.1) — **LG-2 waits on nothing**; but "***LG-9..12 still wait on POP-1 itself***, now with C-POPF-2 as their exact consumption seam; POP-1 lands the TIER_POP refusal pin instead of the phantom" | — | POP-1 → LG-9..12 | **RULING — the narrow half is alive** | the arrival-refusal seam is absent (row 2); `TIER_POP` is still the raw fallback (row 17) | **CONFIRMED** |
| 9 | §92.4 / §93.4 (L3554) | 2026-08-15 | The FOUR-VOLUME STALE-SITE MICRO-ACT docketed as one chair sitting: WF, EP, **POP (C-POPF stale sites)**, INT — each with a drafted volume-text cure | — | volume hygiene | DESIGNED-ONLY; no later § records the sitting held | the volume still carries its own ⚠ ADDRESS-ROT NOTE (twelve rotted addresses) and the stale S1 (row 4) | CONFIRMED |
| 10 | **§128 (L4762-4800)** | 2026-08-15 | **OWNER DIRECTIVE — THE STRESSOR PIN.** Every stressor gains a DM-authority pin; fork resolved PIN THE STRESSOR NEVER THE SETTLEMENT; refinement one: "*the pinned famine's **population asymptotes at a desperate band** instead of extinction*"; refinement two: the dyadic pin | `3eb393e5d` 2026-08-15 "Record the stressor pin: hold the wound, not the world (§128)" — a **record-only** commit | POP-adjacent (population terminal arms) | **DESIGNED-ONLY — owner-ordered, never built** | `stressorPin` / `pinnedStressor` / `dmPinned` / `pinnedBy` = **0 src files each** | **CONFIRMED** |
| 11 | §125.4 (L4649-4652) | 2026-08-15 | **OWNER DIRECTIVE — SIZE-SCALED SPEED**: armies travel slower with size "*AND THE SAME FOR MIGRATING POPULATIONS*"; operative: the law applies to army transit **AND population columns** | — | POP/WY-adjacent | **DESIGNED-ONLY** | RECHECK §2a L277 (CONFIRMED there): `armyTransit.js:293-301 armyMarchWeeks(baseHopWeeks, readiness01)` — two inputs, no size; `spatial/migration.js` has no size read | CONFIRMED (via RECHECK's executed receipt) |
| 12 | §135.2 (L5065-5070) | 2026-08-16 | Realism erratum: the plague→flight coupling **EXISTS** ("*flight from the plague swells the columns*"); what is absent is **contagion on arrival** | — | POP-4 adjacent | **LANDED-LIT** (the coupling) | `stressorDynamics.js:483` `mass_migration: { … disease_outbreak: { decayMult: 0.8, note: 'flight from the plague swells the columns' } }`, and the mirror at `:479` `'crowded camps spread contagion'` | **CONFIRMED** |
| 13 | **§136 (L5077-5100)** | 2026-08-16 | ⭐ **OWNER DIRECTIVE — THE CONTAGION DIRECTIVE, VERIFY THEN BUILD.** Verbatim design: settlements with priests, healing, prosperity and order gain RESISTANCE and shorter outbreaks; **BELIEF-BASED REFUSAL AT THE GATES** (groups from settlements *believed* plagued may be refused entry **per the §46c refusal machinery**); "a stale belief refusing a now-clean caravan is correct fiction, not a bug"; quarantine flagged OWNER-VALUE | `1c6945eaf` 2026-08-16 "Record the contagion directive: verify then build (§136)" — **record-only** | POP-4 / POP-1 reception | **DESIGNED-ONLY** | see row 15 | **CONFIRMED** |
| 14 | §138 (L5134-5164) | 2026-08-16 | **THE CONTAGION CENSUS ACCEPTED — verdict ABSENT with receipts**: "*all three arrival lanes credit population with ZERO disease reads; the persisted column carries no origin-condition state; no outbreak producer reads an arrival; **the reception seam is absent entirely (per §49's own correction — POP-1's clearing will be the FIRST refusal machinery in the tree)***". Honest nuance: disease DOES travel by graph-channel spread and M11a fronts; what is missing is PEOPLE AS CARRIERS | `ffb626d39` 2026-08-16 "Accept the contagion census; charter the pg family (§138)" — **record-only** | POP-1/POP-4 | **RULING — the census's verdict still holds at the consist** | rows 2 and 15 | **CONFIRMED** |
| 15 | **§138.2 + §139 (L5147-5200)** | 2026-08-16 | ⭐⭐ **THE pg FAMILY CHARTERED AND ORDERED BUILT.** Owner, verbatim: "*Comprehensively, exhaustively, carefully, seamlessly, coherently, and cohesively build it and slot it where appropriate.*" Five waves: pg-0 (flag, dark) → pg-1 (`plagueTouched` band stamped on columns at dispatch, seeding the EXISTING M11a ledger at landing — ONE PLAGUE TRUTH) → pg-2 (prosperity + order joining the two resistance seams) → pg-3 (`afflictionBand` as the fifth believedConditions key + **the POP-owned suspicion term inside C-POPF-2's reception contract**) → pg-4 (rides M11a). §139.1 held the joint column-vocabulary sitting and APPROVED `plagueTouched` as a lawful column BAND | the two record commits above; **no build commit exists** | pg (POP-4 / POP-1 sibling) | **DESIGNED-ONLY — ZERO CODE** | `plagueTouched` **0 src / 0 tests**; `afflictionBand` **0 / 0**; `contagionEnabled` **0**; `git log --all --grep='pg-[0-9]'` = **0 commits**; `git log --all -i --grep='contagion'` = the two record commits only | **CONFIRMED** |
| 16 | §144.2 (L5341-5352) | 2026-08-16 | ⭐ **TC26 COMPILED `pop-1`**: "*wy-0 (5 flagless) + **pop-1 (5, §2.5 flag-LEADS shape) compiled to execution-ready***"; WY/POP volumes forked ledger-vs-build (OQ-1); **"C-POPF-6 is a hard STOP awaiting chair"**; and **OQ-2**: "*the {total} population tolerance is LIVE CODE (`relationshipGraph.getPopulation`'s TIER_POP fallback understates 15-57% and LG's fleet derivation is about to consume it)*" | — | POP-1 | **COMPILED-NEVER-EXECUTED**; C-POPF-6 **STOP unresolved** (no later § in 32,673 lines) | zero POP flags in src (row 22); `C-POPF` appears at exactly 7 ODQ lines, the last being this STOP | **CONFIRMED** |
| 17 | §148.4 / §144.2 (OQ-2) | 2026-08-16 | OQ-2's population cure "*is NOT in this round (LG-2 not compiled) — dependency stated*" | — | POP-1 (TIER_POP refusal pin, §92.3) | **RECORD≠CODE is not the right label — it is a LIVE, RECORDED, UNCURED DEFECT** | `src/lib/relationshipGraph.js:55` `const TIER_POP = { thorp: 20, hamlet: 100, village: 500, town: 2500, city: 10000, metropolis: 50000 };` and `:63` the fallback chain `save?.settlement?.population?.total \|\| save?.settlement?.population \|\| TIER_POP[…]` — unchanged | **CONFIRMED** |
| 18 | §148.1 (L5452-5453) | 2026-08-16 | Six trains execution-ready; "***pg-3 (forked on POP-1A landing; co-lives clean with pop-1)***" — the only place a POP-1 SLICE (`POP-1A`) is named | — | POP-1A | COMPILED-NEVER-EXECUTED | no POP-1A commit; `POP-1A` is a ledger-only token | CONFIRMED |
| 19 | §148.3 | 2026-08-16 | Banked hazard: "*cn's `migrationFlowsEnabled` feeder is **DEFAULT-ON** (a section keyed on it renders everywhere the day cn-2 lands)*" | — | POP-adjacent | **CONFIRMED STILL TRUE** | `simulationRules.js:72` `migrationFlowsEnabled: true,` inside `DEFAULT_SIMULATION_RULES`; overridden false only in `QUIET` (`:619`) and one preset (`:835`) | **CONFIRMED** |
| 20 | **§219 (L7889-7925)** | 2026-08-16 | ⭐⭐ **THE ca-015 COLLAPSE ROOT-CAUSED TO POP SUBSTRATE.** 95.3 % of the loss (−16,097 of −16,890) is "*the LEGACY PRESSURE-DECLINE LANE in `populationDynamics.js`, which under `demographicsEnabled` loses its growth side and its deadband and becomes a **ONE-WAY RATCHET WITH NO FIXED POINT** (the code's own comment defers the reconciliation to P4)*". Three-flag interaction (npcAgency OFF × demographics ON). **"Not reachable in any shipped campaign (`demographicsEnabled` false in WAVES)."** Repair R-B + R-C chartered | — | **POP-4's SUBSTRATE GATE** | RULING → landed at row 22 | the volume's own §1a re-measure recorded this gate "still armed" at 2026-08-04 | CONFIRMED (record) |
| 21 | **§271 (L10419-10483)** | 2026-08-17 | **THE P4 REPAIR CURES BOTH CELLS AND IS PROVED NOT A FLOOR.** ca-015 ×0.04→×0.45 PASS; ca-bd7e00d6 ×0.04→×0.31 PASS; the anti-floor proof is asymmetric in the cure's direction (+0.41 failing vs +0.11/+0.05 healthy); "*nothing anywhere clamps a population*". **§271.4: `DEATH_CRISIS_GAIN = 3.0` and two siblings are DERIVED-TO-PRESERVE and ⭐ FLAGGED FOR THE OWNER'S TUNING SIGNATURE — "the owner may veto them there, and if he does, the re-record is redone at his values"** | `2d1e09ceb` 2026-08-17 (edge re-bundle: "demographicsRates is a real bundle input") | POP-4 substrate | **OWNER OBLIGATION — OPEN** | the roster that carries it landed later as CAPACITY C1 (row 27) | **CONFIRMED (shas)**; the obligation's open state PLAUSIBLE (no § records a signature) |
| 22 | **§272 (L10484-10533)** | 2026-08-17 | **THE P4 REPAIR IS LANDED AND EXPOSED — THE COLLAPSE IS CURED.** Terminal green on 17 steps; **CAS `claude/composite-r4` `ac243e1c` → `4eafca31`** (four commits). §272.3: thirteen golden rows, one cause, each explained (`newsHeadlineContract` ×3, `observedShapeReaders` ×1, `proseFamilyContract` ×5 with `populationDeltas[].reason` 2→1, `proseNumerics` ×2 pure address rot, `sovereigntyLighting` ×1). **§272.4: "THE SHIPPED SURFACE IS PROVED UNTOUCHED BY ENUMERATION — all seven shipped presets checked — ZERO light `demographicsEnabled` (six omit it, `full_simulation` declares it false, the default rules carry no key)"** | `ac243e1c1` 2026-08-16 ✔ · `4eafca31a` 2026-08-17 "chore(TE36/P4): re-record the 13 lit-corpus rows — CHAIR-AUTHORIZED, ODQ §271" ✔ | POP-4 substrate | **LANDED-DARK** — and §272.4's enumeration **STILL HOLDS at the consist, 29 days later** | `simulationRules.js:1027` `demographicsEnabled: false,` inside the `full_simulation` preset (block opens at `:868`); the key appears **nowhere else** in the 1,444-line file except its own explainer comment at `:1013-1026` | **CONFIRMED** |
| 23 | §311 / §441 / §443 / §480 (undercity) | 2026-08-23/24 | The undercity charter: plague-year surge pits, plague/great-fire REBUILD as a dated cause; §441(d) — the WALLS row "*reads HOME OWED AT UC-0 (engine-side accessor: **demographicsObservation** / warDeployment / safetyProfile spellings to walk)*" | `233c35a69` MF-CH4; `a3023d98a` §611 the decline arc | POP-adjacent (a foreign consumer of the POP instrument) | DESIGNED-ONLY for the POP read | `demographicsObservation.js` exports `measureRealmDemography` (`:103` per the volume; `:137` computes `realmPressure01`); no undercity importer exists | CONFIRMED (the accessor exists); the undercity consumption PLAUSIBLE |
| 24 | §401 (L16257) | 2026-08-22 | **POP2 COLLECTED: the queued DS-POP-2 item is a FALSE POSITIVE — retired** | `acdc2bcd5` 2026-08-22 ✔ | **NOT a POP wave** | **GREP TRAP** | `DS-POP-1/2/3` are dossier SECTION ids in the prose corpus (`94a6f33f4`, `bc1773983`, 2026-09-14). Six `DS-POP-2` + three `DS-POP-3` of the ODQ's twenty `POP-[0-9]` hits | **CONFIRMED** |
| 25 | §435 / §437 / §452 / §453 / §456 / §482 / §502 / §506 | 2026-08-23/24 | **THE DWELLINGS PROGRAM**: charter (164.5 KB) + code architecture (103.6 KB); 10 waves / 41 cars / one flag / one declared shift / 18 owner bands; "*THE ENGINE HAS NO STOREYS AND THE INTERIOR IS A POINT, NOT A POLYGON*"; owner orders it runs after its research, ahead of the §290 review stop, and its output goes into the 300-year soak | `7c3377cd4` DW-0 2026-08-24 ✔ (+ ~18 further DW-0/§5xx doc commits) | POP-adjacent (households — which the POP volume lists under "deliberately NOT modeled") | **DESIGNED-ONLY** | `git ls-files \| grep -i dwelling` = **0 code files** (docs only) | **CONFIRMED** |
| 26 | **§514.2 (L21599-21624)** | 2026-08-23 | ⭐⭐ **OWNER: B8 IS NOT A BAND — IT IS A TWO-WAY DEMOGRAPHIC LOOP.** Verbatim: "*it is not a percentage idea, it is dependent literally on the makeup of the cities demographics*". Concentration: nobles/wealth merge poor plots → **displacement** → house-building pushed to the outskirts. Decline: the rich leave or split properties → the displaced move back in → the core re-densifies. TC-B8-RECON dispatched | `a2f09a88b` 2026-08-23 ✔ | POP-adjacent, owner-originated | DESIGNED-ONLY | `displacementPool` / `ownershipLedger` / `estateEnabled` = **0 src files each** | **CONFIRMED** |
| 27 | **§517 (L21750-21790)** | 2026-08-23 | **THE B8 VERDICT.** (a) Buildable; its home already exists. (b) ⛔ **BLOCKER: `noble` CANNOT BE CLASSIFIED** — `districtProfile.inferCategory` classified 0 of 10 quarters as `noble`; Common Residential → `criminal` because "Resi**den**tial" contains `den`. Ruled to the catalog-hygiene train as **CH-4**. (c) **The home is `urbanFabricKernel.js` (884 lines), "dark behind `ONE_REGEN`"**. (d) The runaway is real; **hysteresis does not bound it — the capacity cap (a geometric theorem) does** | `cd321ff20` 2026-08-23 ✔ (the verdict); `b7e531349` 2026-08-24 **CH-4** "the QUARTER_CATEGORY registry, the anchored `den`…" ✔ | POP-adjacent | (b) **BLOCKER DEAD** · (c) **RECORD≠CODE — the home is now LIT, not dark** | (b) `districtProfile.js:180-181` `'Wealthy Residential': 'noble', 'Common Residential': 'residential',` in a `QUARTER_CATEGORY` table consulted at `:189` **before** the substring patterns. (c) `urbanFabricKernel.js` is 885 lines, gate `:161` reads `urbanFabricEnabled === true`, population→residential deposit at `:415-418`; `simulationRules.js:670` `urbanFabricEnabled: true` inside `ONE_REGEN`, and `ONE_REGEN` is spread into **realistic_regional (THE DEFAULT, `:772`)**, dramatic_campaign (`:824`), living_realm (`:865`) and full_simulation (`:1073`) | **CONFIRMED** |
| 28 | §518 (L21823-21845) | 2026-08-23 | **OWNER SIGNS THE SCHEMA CALL: ownership is FACTION-SCOPED; THE HOUSEHOLD REFUSAL STANDS**; "*the displacement pool stays anonymous fabric, which is what the demography layer …*" | — | POP-adjacent | **RULING — live, and it AGREES with the POP volume** ("no households" under §3's deliberately-not-modeled list) | row 26's zero-hit census | CONFIRMED |
| 29 | §739.1 / §740 | 2026-08-29 | **OWNER RULING: the map-coupled launch-tail members — DWELLINGS INCLUDED — DEFER to the post-launch module.** Verbatim: "*some of these are directly related to settlement layer mapmaking including dwellings. those need to be deferred to the post launch module work*". §740 overrules §739's provisional keep of the undercity train | — | POP-adjacent | **RULING — supersedes §456/§482** | row 25's zero-code census | **CONFIRMED** |
| 30 | **§881.8 (L32337)** | 2026-09-02 | **THE LIGHTING INVENTORY**: 91 rules doors dark in the default preset; 65 keys dark in every preset; **11 declared false at the ceiling (class E — `demographicsEnabled`'s class)**; car plan L-PROBE → L-HOMES → L-DEFAULT → L-MAT → L-UI → L-PROBE-2 | — | POP substrate | RULING/plan | — | CONFIRMED (record) |
| 31 | **§903 (L32473-32476)** | 2026-09-06 | **THE LIT DEFAULT LANDS AT 9 CARS** — the default preset takes classes C+D (**twenty-one virtual keys**) so a new realm runs the world-alive stack from its first tick; hunks 2–7 REFUSED with measurement and become three owner rows + the rung-20 migration | `432ff6441` 2026-09-06 "LGT-C2-DEFAULT hunk 1" ✔; `eaf50fee7` 2026-09-06 "§903: the lit default lands at 9 cars" ✔ | POP substrate (by omission) | **LANDED-LIT — and `demographicsEnabled` is NOT among the twenty-one** | `simulationRules.js:747-773` — the default preset's own comment at `:748-750` "⭐ THE LIT DEFAULT (lighting wave, L-DEFAULT hunk 1, 2026-09-06)"; the spread is `...WAVES` (nine keys, `:644-655`) + `...ONE_REGEN` (nine keys, `:666-676`) + three literals. `demographicsEnabled` appears in **neither** const | **CONFIRMED** |
| 32 | §907(a) (L32482) | 2026-09-07 | **THE 300-YEAR LIT RUN CURES THE RUNAWAY** (`runawayCount` 0, `flooredCount` 0, `bifurcated` 0, `realm population bounded` PASSES) **BUT DOES NOT PLATEAU**; the M1 interim cell ran `--lighting demographicsEnabled=true` for 300 y × 4 s, 762.3 s, receipt schemaVersion 5 | `898dcb5b8` 2026-09-07 ✔ | POP substrate | measurement | — | CONFIRMED (record) |
| 33 | **§907(e) (L32482)** | 2026-09-07 | ⭐⭐⭐ **THE FAMILY'S STOP — POP's §96.2.** Verbatim: "*The `demographicsEnabled` class-E STOP inside L-DEFAULT: its trigger (the runaway) does not reproduce, its plateau half is unproven, and the key still re-infers the legacy default as `custom` (§903) — **the STOP holds; nothing here lights it**.*" No later § lifts it | `898dcb5b8` ✔ | **every POP wave's lit-precondition** | **RULING — LIVE** | `simulationRules.js:1027` (row 22); and the code's own gate at `:1019-1026`: "*LIGHTING IT belongs at the owner-signed soak redo, after P2's overflow valves, P3's migration homeostat and P4's stressor couplings land; flip this one value there*" | **CONFIRMED** |
| 34 | §910 / §911 (L32491-32494) | 2026-09-07 | `yearlyPopulations` / `yearlyDiedFlags` ship additively on the soak receipt (schemaVersion 5); the 600-year run discharges D1; "*a DEFAULT 30-year soak cannot prove the acceptance line (its `demographicsEnabled` is false, so the rows are gate-skipped before `requires` is read — a LIT run was taken instead)*"; `capacity_envelope_30y` armed **gated on `demographicsEnabled` like its siblings** (R11, reversible) | `ec265d24c` 2026-09-07 ✔ ("the per-year population series ships") | POP-7's instrument territory | **LANDED-DARK by construction** (the rows gate-skip in every shipped preset) | row 22 | **CONFIRMED (sha + record)** |
| 35 | §911.1 | 2026-09-07 | Owner rules the three §911 rows: "*then yes, but only after the reconciliation work has passed*" | — | POP substrate lighting | OWNER CONDITION — open | — | CONFIRMED (record) |
| 36 | FVQ:1803 | 2026-08 | A FOREIGN family's lighting is ordered behind POP's flag: "*Lighting `sovereigntyTradeEnabled` (§9.5, in build order, **after `demographicsEnabled`** and WR-7's flag)*" | — | WR-10 ← POP substrate | **ORDERING ANCHOR — live** | `sovereigntyTradeEnabled` has no preset row (FVQ:1798-1802 records the cause) | CONFIRMED (record) |
| 37 | FVQ:2447, :2564, :2628 | 2026-08 | **Q6 / J-POP-14 arrival couplings**: "*ONE owner ruling covers both, per CR-FP-6*" — deliberately deferred, on the owner queue, **not into any wave** | — | POP-7 / POP-1 arrival | **DEFERRAL — owner-gated, recorded** | matches `DESIGN_FP_ARCHITECTURE.md:2938` as PROGRAMME §B cites it | CONFIRMED |
| 38 | SOL_QUEUE:350-351 | — | The programme slot: "*16. POPULATIONS POP-1 → POP-7 … picks up its Alignment lines at build per requirement 13 (**currently zero engagement**)*" | — | all | record | — | CONFIRMED |
| 39 | SOL_QUEUE:372-373 | — | Ordering: "*WY-4 in PHASE 6 immediately after POP-1 (shared `columnOf` amendments compose by order)*" | — | POP-1 → WY-4 | ORDERING — live | PRICING §C lane 30 carries it | CONFIRMED |
| 40 | SOL_QUEUE:554 | — | "*CPL-17 carries the **owner-override line for the population levy***" | — | POP-2 (levy refusal) | DESIGNED-ONLY | `commonsArcEnabled` 0 hits | CONFIRMED (record) |
| 41 | SOL_QUEUE:501 | — | `RECEIPT_POOLS_POPULATIONS.md` is a named prose-pool obligation of the family | — | POP-6 | DESIGNED-ONLY | — | CONFIRMED (record) |
| 42 | GOLDEN_SHIFT_LEDGER:289-291 | — | "*[worldpulse-core-6] — M11a plague spread under political autonomy — RULING DOCUMENTED + OWNER-NOTE*": canonizing a map upgrades plague travel from DM-gated to autonomous, **which is intended** | — | POP-4 substrate | RULING — live | `pestilenceKernel.js` per volume S31 | CONFIRMED (record) |
| 43 | GOLDEN_SHIFT_LEDGER:1543 | — | Ordering law: the roster settles "*BEFORE the population floor bump*" | — | POP-adjacent | record | — | CONFIRMED (record) |

### B.2 LANDINGS THE LEDGER NEVER RECORDED AS POP WORK (found by `git log --all`)

| # | Sha (verified) | Date | Subject | Wave it touches | Status at the consist | Code evidence | Label |
|---|---|---|---|---|---|---|---|
| 44 | `c247568b5` | 2026-07-12 | "Round 21 → **M11 WORLD-AS-ACTOR SHOCKS: pestilence that travels, calamity that strikes** (owner-architect)" | POP-4's ancestor | LANDED — but as a **one-shot Great Calamity**, never a staged arc | `components/compendium/CatalogHubs.jsx:82` "*There is **one** calamity mechanic: the Great Calamity. Its type is cosmetic flavour*"; `AdvanceReport.jsx:45` `plague: 'Plague', calamity: 'Calamity'` as event kinds. **No `calamityArcs` ledger, no `openedTick/crestTick/closedTick/peakBand`** anywhere | **CONFIRMED** |
| 45 | `82ad676b2` + `10f22f39f` | 2026-07-13 | M11a PESTILENCE — "the plague travels the trade roads, and a temple city resists but is never immune" (+ the 3-bug fix) | POP-4 substrate (volume S31) | LANDED-LIT | `pestilenceKernel.js`; volume S31's receipt (`:7-14`, `:223-234`) | CONFIRMED (sha); line cites inherited — PLAUSIBLE |
| 46 | `1a0b868ed` | 2026-07-15 | "DESIGN: W-UPSWING — the same variables, running up (constitution + arcs + **the calamity bucket**)" | POP-4 naming ancestor | design → `upswingKernel.js` LANDED-LIT | `simulationRules.js:651` `upswingArcsEnabled: true` inside `WAVES`, lit in the default preset (`:772`); `src/domain/worldPulse/upswingKernel.js` exists | **CONFIRMED** |
| 47 | `ac2d32ac8` | 2026-08-15 | CS-B2 — see row 4 | POP-4's S1 premise | LANDED-DARK | row 4 | CONFIRMED |
| 48 | **`35d9d5e74`** | 2026-08-31 | ⭐ **TE-DENSITY-1 D2c: "the ladder becomes the world — a town grows the politics it can carry, loses them when it shrinks, and nobody dies for it"** — 394 lines into `factionDensityKernel.js`, plus `tierOutcomeApply.js`, `tierResourceDynamics.js` and a rumor kind | POP-adjacent: **a settlement-size → political-body coupling**, the nearest thing in the estate to POP-3/B8's territory | **LANDED-DARK behind an UNSIGNED OWNER TUNING SIGNATURE — a third instance of the same gate** | mounted at `pulseKernel.js:103` (`advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssizeAndDensity`); the gate is NOT a rules flag but the world's own law version — `factionDensityKernel.js:40-42` "*The product dial (`NEW_SETTLEMENT_DENSITY_LAW_VERSION`) is held at v1 **pending the owner's tuning signature**, so every world the product makes today reads dormant here*"; `densityLaw.js:98-101` derives it from `REGISTER_VII_SIGNATURE.signed && .live`, and `densityBands.js:60-63` reads `{ signed: false, live: false }` | **CONFIRMED** |
| 49 | **`59a0c8d77`** | 2026-08-31 | TE-DENSITY-1 D2c: "**a house exists only while somebody is in it** — the reading becomes a writing, and the frozen kernel does not grow by one line" — 389 more lines into `factionDensityKernel.js` + `mutateEntities.js` + `pulseKernel.js` | household-adjacent (occupancy → dwelling existence), inside the same dormant law | **LANDED-DARK**, same gate as row 48 | as row 48 | **CONFIRMED** |
| 50 | **`ec6b0a132`** | 2026-09-03 | ⭐ **CAPACITY C1: "the demographic tuning surface gets an address, and a town that grows into its granary is told so once."** Two things: (a) `DEMOGRAPHIC_TUNING_SIGNATURE/_PROVENANCE/_COVERAGE` — a **31-row roster of every demographic dial**, at rest `{ signed: false, lit: null }`, "CANDIDATE OWNER-UNSIGNED"; (b) **a THIRD Herald demographic line** — the crowding CROSSING of the overflow ladder, beside the hunger line and the departure line. The commit body also records two design errors corrected by measurement (a phantom `MIGRATION_KERNEL_TUNING.CONGEST_DECAY` home — the real dial is `spatial/migration.js#MIGRATION_TUNING` at 0.85 — and an unrostered tunable, `demographicsHerald.js#QUANTITY_BANDS`) | ✔ | **POP-6's territory, built outside POP** | **LANDED-DARK** (rides `demographicsEnabled`) | `demographicsRates.js:375` `export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({ signed: false, lit: null });`, `:392` `_PROVENANCE`, `:427` `_COVERAGE`; `demographicsHerald.js:166` `export function crowdingCrossingOf(receipt)`, `:143-145` `FILLING_RANK/PRESSED_RANK/OVERFLOWING_RANK`, `:175-176` the two crossings | **CONFIRMED** |
| 51 | **`6bddd6183`** | 2026-09-03 | **CAPACITY C2: "a reader can ask how much room a town has left at any year, and the answer costs nothing"** — a new 257-line display leaf + 237-line suite | POP-6 / POP-7 adjacent | **LANDED-DARK** | `src/domain/display/demographicReading.js` (13,551 B): `:73` `DEMOGRAPHIC_READING_SENTINEL`, `:77` `DEMOGRAPHIC_READING_LIVE_MARK = 'Nobody has counted the harvest'`, `:105` `OCCUPANCY_SENTENCES`, `:171` `demographicReadingViewOf`, `:237` `readingChipsOf` | **CONFIRMED** |
| 52 | **`d02c5acde`** | 2026-09-03 | **CAPACITY C3**: the cured model measured inside 30 years, not only across 300 — `tests/domain/demographicsEnvelope.test.js` (235 lines), `tests/helpers/demographicsRealmFixture.js`, and three soak tripwires | POP-7's acceptance-harness territory | LANDED (tests + soak) | commit stat: `scripts/soak/tripwires.mjs +113`, `tests/domain/demographicsEnvelope.test.js +235`, `tests/soak-harness/tripwireRegistry.test.js +71` | **CONFIRMED** |
| 53 | `79d45d274` | 2026-09-03 | "§891 register 2/6: **the tuning inventory takes CAPACITY C1's demographic address**, both figures predicted exact" | POP tuning | LANDED | subject verified | CONFIRMED (sha) |
| 54 | `d58b489b8` / `268d53605` / `ec265d24c` | 2026-09-07 | §909 cars — the per-year population series, the fourth capacity row armed | POP-7 instrument | LANDED-DARK | row 34 | CONFIRMED (shas) |
| 55 | — (no commit) | — | **The six POP flags** | all eight waves | **NEVER MINTED** | `believedMigrationEnabled` · `commonsArcEnabled` · `departureMemoryEnabled` · `calamityArcEnabled` · `roadDramaEnabled` · `moverPermitsEnabled` — each **0 src files and 0 test files** at the consist | **CONFIRMED** |
| 56 | — (no commit) | — | **R-28, the volume's own OPEN-DEFECT** ("the departures=0 arm still says 'left'") | POP-6(g) | **STILL OPEN** | `demographicsHerald.js:420` `headline: \`${quantityWords(departures \|\| unplaced)} left ${origin}\`` — the headline is still unconditional, though the BODY at `:422-423` forks honestly ("*would have left … and the realm had nowhere to put them*") | **CONFIRMED** |
| 57 | — (no commit) | — | **`realmPressure01`, the volume's S28 dead-consumer row** — the brief asked whether this is a frozen-ground-truth analogue of TR-3's `foodRatio`. **It is NOT frozen; it is DARK.** | POP-1/POP-4 hunger arm | LANDED-DARK | producer `demographicsObservation.js:137` (`realmPressure01 = Σpop / Σ K_food`, bounded by `PRESSURE_MAX`); the only src consumers are **war** readers — `warReasons.js:803-804` (`const realmPressure01 = demographicsLit ? measureRealmDemography(…).realmPressure01 : 0;`, gated `demographicsActive(ws)` at `:802`) and `demographicsWar.js:172/:295`. It is recomputed live from population and food capacity, so lighting the flag moves it — the POP analogue of TR-3's hazard is **darkness, not freezing** | **CONFIRMED** |

---

## C. THE RECORD-vs-CODE ROWS, AND THE CORRECTIONS THIS PASS HANDS BACK

### C.1 RECORD ≠ CODE (three, all CONFIRMED)

1. **The POP volume's substrate row S1 is STALE.** It records
   `after = Math.max(named, …)`; CS-B2 (`ac2d32ac8`, 2026-08-15 — eleven days
   *after* the volume's 2026-08-04 compile) replaced it with
   `Math.max(Math.min(named, before), …)` (`demographicsKernel.js:313`).
   POP-4's "named-cast pin under arc conditions (S1 machinery)" and any
   conservation argument resting on S1 must be re-derived.
2. **§517.3's "`urbanFabricKernel.js` … is dark behind `ONE_REGEN`" is now
   FALSE.** `ONE_REGEN` was lit into the **default preset** at §903
   (`432ff6441`, 2026-09-06). The per-district class-prominence ledger with its
   population→`residential` deposit (`urbanFabricKernel.js:415-418`) runs in
   every new realm today. Any B8/estate brief written against "it lights with
   the estate wave" is written against a superseded fact.
3. **§517.2's `noble` blocker is DEAD.** CH-4 (`b7e531349`, 2026-08-24) added
   the `QUARTER_CATEGORY` declared table (`districtProfile.js:180-181`), read at
   `:189` before the substring patterns. "A loop keyed on 'the neighbourhood
   gains nobles' cannot fire once until this is fixed" no longer applies.

### C.2 THE CORRECTION THIS PASS OWES THE OTHER READERS

⛔ **`HISTORY-TRADE-2026-09-15.md` row 37 is WRONG, and `RECHECK-32-34.md` §3
line 371 repeats it.** Both say ODQ §49's "BLOCKED-ON POP-1" blocker is DEAD
because `demographicsMigration.js:107-109 MIGRATION_REFUSALS` and
capacity-ranked placement `:231-242` "landed without POP-1".

Those two sites are the **pre-departure** competition: `MIGRATION_REFUSALS`
(`:107-108`) is the vocabulary a column names when it *fails to form*, and the
refusal is minted inside `competeForDestinations` at `:232-237`. §49 was never
about that. §49 says, in its own words, "*migration landing is unconditional
with no capacity read (demographicsMigration.js:453-482)*" — and at the consist
STAGE 1 still is: `const target = writable(column.destId) ? column.destId :
writable(column.originId) ? column.originId : null;` (`:464-466`), with
`lost` (`:468`) only when both ends are gone and `returned` (`:478`) only when
the destination is unwritable. **No capacity is read at the wall.** The same
verdict was re-taken independently by the contagion census eight months later
(§138.1, 2026-08-16: "*the reception seam is absent entirely*").

⇒ **LG-9..12 still wait on POP-1** (§92.3 is intact), **§46c's caravan-cover
spy waves still wait on POP-1** (§49's sequencing is intact), and **pg-3 still
waits on POP-1's reception contract** (§139.3). POP-1 is a hard predecessor of
three foreign lanes, not one, and the recon's "smaller car that can ride LG-9
itself" understates it.

### C.3 GREP TRAPS BANKED FOR THE HAZARDS FOLD (all CONFIRMED at source)

- ⛔ **`migration` in the ODQ is overwhelmingly the SQL/schema kind** — 182 hits,
  of which the population sense is a small minority. The rest are supabase
  migrations 123/134/188–199/201–203, the "migration rehearsal runbook", the
  governed schema 8→9…16→17 *instrument* migrations, and "call-site migration".
  A naive `grep -i migration` over this ledger is ~90 % noise for POP.
- ⛔ **`POP-[0-9]` matches `DS-POP-1/2/3`** — the dossier section ids of the
  September prose rewrite. Nine of the ODQ's twenty `POP-[0-9]` hits, and
  **every** hit of `git log --all --grep='POP-'`. This is POP's INSTR-1≠TR-1.
- **`pop-6000` / `pop-30000`** (§718.5 saturation probes) match a lowercase
  `pop-[0-9]` train-id grep.
- **`plague` / `famine` in §609–§719** is the MAP programme's dress/state axis
  (drawn stalls, barred gates, element-diffs), not POP-4.
- **`calamity` in src** is the Great Calamity event kind + its Compendium hub,
  not `calamityArcs`.
- **`population` after line ~31400** is mostly a *test* population (a walker's
  row set), a soak metric (`yearlyPopulations`), or `POPULATION_SATURATION`
  (a float constant), not a settlement's people.
- **`commons` in the ODQ (6 hits)** is the landing page's gallery commons and
  the `wizard_news` id family — `commonsVoice` ≠ `commonsArc` (the volume's own
  name-collision fence).
- **`household` / `dwelling` (25 / 64 hits)** are the DW programme and the
  §498/§518 ownership sitting — both of which **refuse** households as a
  simulation body, matching the POP volume's "deliberately NOT modeled".
- **`POP-F` / `POP-S`** are the volume's stamping rounds, not waves.
- **`C-POPF-n`** are POP-F's eight compile cures, not POP wave ids.
- **`P1/P2/P3/P4`** in `simulationRules.js:1024-1026` and §219/§271/§272 are the
  **wave-P demographics programme** (July), not POP-1..POP-7.

---

## D. WHAT THIS READER COULD NOT SETTLE (handed up, not dropped)

1. **Whether the owner ever signed the demographic tuning constants.** §271.4
   flagged three; CAPACITY C1 rostered thirty-one at
   `{ signed: false, lit: null }`. No ODQ § between §271 and §931 records a
   signature, and the code record is still unsigned — but absence in a 32,673-line
   file is a weaker proof than a positive read. **PLAUSIBLE: still unsigned.**
2. **Whether C-POPF-6 was resolved off-ledger.** `C-POPF` appears at seven ODQ
   lines and the last is the STOP. **PLAUSIBLE: unresolved.**
3. ~~The TE-DENSITY-1 D2c pair.~~ **SETTLED in this pass — rows 48–49 are
   CONFIRMED LANDED-DARK**, and they surface the pass's second structural
   finding (see D.5).
4. **Whether `pop-1`'s compiled five-member train (§144.2) survives anywhere.**
   The kit's preserved refs may hold it; recovering it would save POP-1's
   compile. Not searched here.

### D.5 ⭐ THE PATTERN THE PASS FOUND, AND THE CAR IT IMPLIES

**Three separate POP-adjacent landings are all parked behind an unsigned owner
signature, and no #32 lane brief names any of them:**

| Landing | Sha | The gate | State at the consist |
|---|---|---|---|
| P4 decline/death reconciliation | `4eafca31a` | §271.4's three derived constants, "FLAGGED FOR THE OWNER'S TUNING SIGNATURE at the tuning pass" | no signature recorded |
| CAPACITY C1's 31-row demographic roster | `ec6b0a132` | `DEMOGRAPHIC_TUNING_SIGNATURE` | `{ signed: false, lit: null }` (`demographicsRates.js:375`) |
| TE-DENSITY-1 D2c's size→politics law | `35d9d5e74` + `59a0c8d77` | `REGISTER_VII_SIGNATURE` | `{ signed: false, live: false }` (`densityBands.js:60-63`) |

Above all three sits the **`demographicsEnabled` STOP** (§907(e)), whose own lift
condition is "the owner-signed soak redo".

⇒ **POP's real car 0 is not a wave — it is an OWNER SITTING.** Until the
demographic tuning surface is signed and `demographicsEnabled` is lit, every one
of the eight POP waves lands into an engine no shipped preset runs, three cured
population mechanisms stay dormant, and the pg family's belief-at-the-gates
design has nothing to mount on. That sitting is one row on the owner queue, and
it gates roughly 32–45 cars of POP plus LG-9..12, the §46c spy waves, pg-0..pg-4,
WY-4, and (per FVQ:1803) WR-10's own lighting. Recommend it board **before** the
POP-1 lane, not after.
