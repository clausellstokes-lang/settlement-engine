# FINDINGS — THE COMPILED FOLD AND THE SMALL LATER VOLUMES (reader seat FOLD-SMALL, 2026-10-16, chair session 2fc13d59)

**Family read.** `volumes-master/DESIGN_FP_ARCHITECTURE.md` (3318 lines, read whole; byte-equal to `docs/` at master `00b648c9d`) · `volumes/DESIGN_FP_ARCH_CN.md` (491, whole) · `volumes/DESIGN_FP_ARCH_LG.md` (205, whole; byte-equal to master `docs/`) · `volumes/DESIGN_FP_ARCH_PG.md` (418, whole) · `volumes/DESIGN_FP_ARCH_MF.md` (480; the header, §0–§4 and every FP-relevant line read, §5–§15 skimmed by heading and grep; it is a map-rendering charter, see §2). Reference reads: `DESIGN_WAR_RULINGS_ARCHITECTURE.md` §1 + §10 whole; `DESIGN_REALM_DIRECTIVES.md` the amendment block A..S (lines 174–1425) by headline; `DESIGN_ROUTE_LIFECYCLE.md` header + §1.
**Receipts.** `ARCH:N` = volumes-master/DESIGN_FP_ARCHITECTURE.md line N · `CN:N` `LG:N` `PG:N` `MF:N` = the volumes/ copies · `RD:N` = DESIGN_REALM_DIRECTIVES · `WRA:N` = DESIGN_WAR_RULINGS_ARCHITECTURE · `src/...:N` = the code of record at `00b648c9d` · `BOARD:N` = fp-kit-87797a6a-2026-09-23/FP-PROGRESS-BOARD.md · `ODQ:N` = the ledger branch's docs/OWNER_DECISION_QUEUE.md.
**Evidence class.** Every row is a READ (static grep/sed/node-import of the code of record, git log of `00b648c9d`, git ls-tree of the ledger). No test was run. "Landed" means present at `00b648c9d`, never "proven green". Anything reasoned is marked PLAUSIBLE.

**Provenance finding first (it governs the whole fold).** Two different fold texts exist. The LEDGER copy (`volumes/`, byte-equal to `review-fixes-2026-07-08:docs/DESIGN_FP_ARCHITECTURE.md`, 3035 lines) has NO L10, NO §12, NO §13, and its only progress block is the 2026-08-09 one (`volumes/…ARCHITECTURE.md:891`). The MASTER copy (3318 lines) carries L10, §12 (2026-09-23), §13 (2026-09-24) and a 2026-09-23 re-derived progress block (ARCH:946). ARCH:3147 (J-EM-14) promised "the ledger's copy of the volume receives the same text at the ledger's next docs pass … until then the ledger's copy is one fold behind" — at 2026-10-16 that sync has not happened (CONFIRMED by diff). The other readers' "progress block measured 2026-08-09, five weeks stale" is true of the ledger copy only; master's block is 23 days stale.

---

## 1. THESIS

**The fold (ARCH).** One compiled build order for thirteen programs (SP·GR·IN·TR·WF·POP·INT·CW·ES·WY·HB·WC·EP): ten law families (L1–L10, ARCH:70–220), a 63-flag family (ARCH:459–668), fourteen sub-ledgers (ARCH:670–851), 111 waves (ARCH:853) grown to 114 by §13 (ARCH:3318), a 112-logical-seam matrix (ARCH:2655–2753), and since 2026-09-23 the editor fold (§12) and the seam family (§13). It owns no mechanism of its own; it is the scheduling and law surface. Its DM-felt sentences are §8's acceptance list (ARCH:2569–2600); the flagship, the CW braid, is *"the drought reached the temple by way of the granary, the road, and the count's pride"* (ARCH:2595–2597). That sentence's mechanism (CW-1) landed DARK at `155da82f2`; no DM can read it today.
**CN — the DM war console** (stressor pin, external besieger, conversion valve, ORDER/AUTHOR hats). No DM-facing Herald sentence is authored; the only in-fiction phrase is the toggle's provenance gloss *"held by the DM's hand"* (CN:294). **No DM-felt sentence exists for cn-1..cn-6.**
**LG — the logistics network** (teleport circles, air/sea fleets, journeys). **No DM-felt sentence exists anywhere in the volume** (LG:1–205; no receipt pool, no Herald kind named).
**PG — pestilence coherence** (contagion on arrival, resistance+duration, belief refusal at the gates). One in-fiction reason line: *"A well-fed, well-ordered town buries its sick before the sickness spreads"* (PG:212–213). pg-1's sentence is inherited ("Plague reaches X", the landed `plague_arrival` kind, PG:162, ruling 3).
**MF — the settlement-map fabric** (Watabou/FTG visual clone). A rendering program; its "sentence" is a picture. Not an FP program (§2).

## 2. STATUS, TRUTHFULLY

### 2a. The fold's own claims, against each other
| Claim | Where | Contradicted by |
|---|---|---|
| "Status: ARCHITECTURE. Nothing here is scheduled … Every wave ships DARK; no flag lights" | ARCH:42–44 | ARCH:3270–3272 §12.8 J-EM-15/16 "SHIPPED LIT … The August shipping law … is SUPERSEDED for FP"; L2 ARCH:89–91 itself now reads "PRESENT, strictly true, in the presets a LIT-n lighting unit names" |
| "Nothing is scheduled until the owner sequences it" (colophon) | ARCH:3299 | §12.5 FP-T1 dispatched (ARCH:3244–3251); owner "no just build it all shipped lit" (ARCH:3268) |
| "THREE OF THE FIVE ARE NOT SEALED" (EP draft r7; HB r4 no close; WC architected, CR-WC-9 standing) | ARCH:32–38 | CR-WC-9 SIGNED by J-EM-9 (ARCH:3142); HB-0..2, EP-0..3, WC-0 LANDED (ARCH:946). The sealing statement may still be true; the "not started"/"standing escalation" halves are stale |
| §5 progress (09-23): 28 landed · 10 partial · 73 not started | ARCH:946, 3094 | the code of record (table 2b) |
| HB-3..HB-9 gated on HB Q1 "unsigned" | ARCH:946, 3217 (HB-3 row) | ARCH:3270 J-EM-15(2): "'Build it all' SIGNS HB Q1 … HB-3..HB-9 are released" — same section, same night |
| §11 addendum "OWNER-GATED — RECORDED, PARKED": F9 unsigned; war-chooser spy wiring deferred | ARCH:3064 | ARCH:693–696 (F9 SIGNED, 2026-08-11 note); ARCH:1608–1612 (HB-5: "CR-ES-4's deferred arm, RELEASED by the owner's blanket queue sign-off") |
| §12.7 item 1 the launch line "keep espionage, habit, war circulation and the epoch dark for the first world" | ARCH:3263 | ARCH:3270 "THE LAUNCH LINE IS EVERYTHING … §12.7 item 1 is CLOSED by this word" |

### 2b. ONE STATUS TABLE FOR ALL PROGRAMS (fold claim at 09-23 · landed at `00b648c9d` · lit flags · verdict)
Lit = present `true` in a preset at `src/domain/worldPulse/simulationRules.js:789–802` (FP_LIT_ALIVE → realistic_regional :899, dramatic_campaign :956, living_realm :999, full_simulation :1213; FP_LIT_BELIEF → dramatic/living/full; FP_LIT_WARPEACE → dramatic :958 + full :1215). realistic_regional is the DEFAULT CHIP (`:6`, `:893–896` "the realm dialog offers it as the default chip"); the raw birth seam `NEW_CAMPAIGN_SIMULATION_PRESET_ID = null` (`:31`) still births the plain default, where every FP key is absent.

| Program | Fold claim (ARCH:946, 09-23) | Landed at 00b648c9d (commit receipts) | Minted / LIT flags (code) | Verdict |
|---|---|---|---|---|
| **SP** | A,B,B2,C,D,E landed | same + **SP-D2** `3fd25f5df` (a §12 member, not a §5 wave). **SEAM-0** (SP-C's appetite mount) NOT built (§13 ARCH:3308 says the facet "has NO DATA") | strategicPosture, errandSpine, believedScarcity/Conditions/Devotion minted; **LIT: beliefAxes + believedConditions + believedScarcity** in dramatic/living/full (LIT-1b `d53e161cf`); errandSpine HELD DARK (:783) | Spine complete; the fold's block is accurate for SP but misses SP-D2 and SEAM-0's debt |
| **GR** | 0,3 landed; 1,2,4,5 partial; 6,7 not started | **GR-2 complete** (GR-2b `3f05e36e0`); **GR-6** `f0f433a05`; GR-5b `253d14848`, GR-5c `df7aeaef4`, GR-5c-b `0c557fea1`, GR-5d `5d699cc68`; plus TREATY-VOICE U1/U3, TREATY-VOICE-2 U1/U2/U4, PACT-REASK U1 `28e7d4b08` (chain-first units, not §5 ids). Still partial: GR-1 (stamp), GR-4 (4b-β, 4b-ii), GR-5 (5e/5f). Not started: GR-7 + court bonds | **LIT: pactFormation (4 presets incl. the default chip); oathHolder, treatyLifecycleVoice, treatyRenewal, mediationGeneralized (dramatic + full)** | The most-built FP family and LIT; every GR header that says "dark" is stale |
| **IN** | 0 landed; 1 partial; 2–6 not started | **IN-2** `b9dc9540b`(+2 cures), **IN-3** `9c4ddfc50`/`60877042d`(+cure), **IN-4/1** `9e916163b`, **IN-4/2** `769c2363e`, **IN-5/1** `6cf6920d4`, **IN-6 U1–U6** (`e9fb5e270`…`ca5eb1ae0`). Owed: IN-1c-b, IN-4b (FPQ-31), IN-5/2 | secondOrderBelief, infoLure, counterIntel, reputationRace minted — **ALL DARK** (lure/sweep need the statecraft head, "lit in no preset", :785–787; the race needs routeLifecycle, :787–788) | Built to its measure wave but inert; a DM sees none of it |
| **TR/EC** | 1 landed; 9 partial; 2–8 not started | **TR-3** `0fd6b9209`; **TR-2** `c8c21a9f3`(+cures) BUILT BUT UNMOUNTED ("no pulse mount yet (vacuous)", :784; TR-2b owed); TR-4..8 absent (no grainFlow/cornerGate/ventureLedger/factor module). **EC** compiled 2026-10-16 (`39940723b`, ODQ §934.90) "absorbs TR (its five unbuilt waves keep their flags and texts)"; zero EC code | casusCommercii, merchantHouses, believedMarkets minted — **ALL DARK**; foodCaravans/tradePacts/cornering/ventures/factorErrands NOT minted | TR's ownership of TR-4..8 is now EC-shared; the fold knows nothing of EC (zero hits) |
| **WF** | 1 landed; 8 partial; 0,2–7,9 not started | **WF-0** `217ff1700`/`5ee982bf1`/`4bc3ef9e9` (+cure `06025d546`). WF-2..7, WF-9 absent (no stanceConsequences/omenReading/tithe/realmFaithArcs) | **LIT: faithUnseating (4 presets incl. default chip)**; every other WF flag NOT minted | One layer lit at the default; the rest unbuilt |
| **POP** | none | none (no believedMigrationRead/commonsAnswer/departureMemory/calamityArc/columnEvents) | none minted | Unstarted; LG-9+ and PG-3 wait on POP-1 |
| **INT** | 3 partial (3B seam) | unchanged (no seatBooks/blocCounsel/decisionPolitics/strainAttribution/burialLedger/legitimacyCrossings) | none minted (settlementPolitics pre-exists, dark) | Unstarted beyond the seam |
| **CW** | 0w landed; 1,2x,3 not started | **CW-1** `155da82f2` "cascadeGovernorEnabled minted dark" (pulled forward by FP-25) | cascadeGovernor minted, DARK | The braid exists and is silent |
| **ES** | 0,1,3,4,5a–d landed; 2,6 partial; 7 parked | unchanged; ES-2b STOPPED twice (BOARD:22, :28); STATECRAFT-BAND U1 `9a1ded02d` re-banded EXPOSE_BASE 0.06→0.01 (an ES-adjacent tuning act) | espionage minted, DARK (no preset; `espionageActive` needs the envoy keys, dark everywhere) | Machinery present, unreachable in any shipped preset |
| **WY** | none landed | **WY-1** `bfe4830d0` (data-gated by `spatialDigest.kmScale`, no flag) | none of the eight WY flags minted | First wave only |
| **HB** | 0,1,2 landed | unchanged | habitConditioning minted, DARK; HB-6/7/8 flags not minted | Gate (HB Q1) signed by J-EM-15, nothing built since |
| **WC** | 0 landed | unchanged | warCirculation + contributionLedger minted, DARK | Unstarted beyond the vocabulary wave |
| **EP** | 0–3 landed | unchanged | advanceEpoch minted, DARK (LIT-0/3 `744aeae27` only threads it through nine harnesses) | Kernel seam in, unlit |
| **CN** | — (fold silent) | ledger only (`1d77ceb67` 2026-08-16); not on master; zero code (`stressorPinsEnabled`, `externalBesiegersEnabled`, `warCouncilModel` — 0 hits) | none | DRAFT header is stale (it LANDED on the ledger); not compiled into the order |
| **LG** | "absent from the build branch" (ARCH:3094) | docs/DESIGN_FP_ARCH_LG.md on master (J-EM-12 discharged); zero code (`circleNetworkEnabled`, `vesselFleetsEnabled` — 0 hits) | none | Architected, unbuilt, unordered |
| **PG** | — (fold silent) | ledger only (`1d77ceb67`); zero code (`contagionEnabled`, `afflictionBand`, `plagueTouched` — 0 hits; CONDITIONS_KEYS still four, `src/domain/worldPulse/beliefAxisSubjects.js:123`) | none | DRAFT header stale; unordered |
| **MF** | — (fold silent) | ledger only (`1d77ceb67`); zero code (`mapFabricEnabled`/`map-fabric` 0 hits; `LAYOUT_LAW_VERSIONS = [1, 2]`, `src/domain/townMap/mapEdits.js:123` — Door B's v3 not minted) | none | Not an FP program; mis-filed by name |

**Wave arithmetic at `00b648c9d` (derived from the table; PLAUSIBLE as a count, each row CONFIRMED by symbol/commit):** of §5's 111 — **37 LANDED · 12 PARTIAL · 62 NOT STARTED**; with §13's three SEAM waves, 114 → 37 · 12 · 65. Moved since 09-23: GR-2 (partial→landed); GR-6, IN-2, IN-3, IN-6, TR-3, CW-1, WF-0, WY-1 (not started→landed); IN-4, IN-5, TR-2 (not started→partial). **Nine FP flags are lit** (eight §3 flags + the `beliefAxesEnabled` host); **24 of §3's 63 are minted** (manifest `simulationRules.js:230–668`, 43 entries total).

### 2c. Are CN / LG / PG / MF FP programs?
| Test | CN | LG | PG | MF |
|---|---|---|---|---|
| Cites the SPINE / the twelve requirements | NO (0 hits for SPINE/requirement) | NO | NO | NO |
| Req 13 Alignment line / Req 14 Edit-verb (or L10 EDITOR line) | NO | NO | NO | NO |
| Owns coupling rows / a couplingId prefix | NO (prefix set is WR·TR·GR·WF·POP·IN·INT·SP·CW·ES·WY·HB·ENC, `tests/domain/couplingRegistry.test.js:119`) | NO | names the need (PG:349 "a new per-volume leaf `couplingRegistryPestilence.js`") but owns none | NO |
| Names a receipt-pool annex (§8 obligation, ARCH:2561) | NO | NO | rides POP's pool (PG:274–277) | n/a |
| Uses the FP flag law (virtual, manifest, four fences) | YES (CN:176–197, "§49/§50 three obligations") | YES (LG:99–106) | YES (PG:103–118) | REFUSES it as "semantically wrong for a presentation surface" (MF:159, Door B) |
| Inherits war §10 | NO (cites the "LG-volume rule" and estate §-numbers) | NO | NO | NO |
| Listed in the fold | NO (0 hits) | only as a docs member (J-EM-12, ARCH:3145) | NO | NO |
**Verdict.** LG and PG are FP-ADJACENT families written in the August "estate §-number" idiom (§42/§43, §49/§50, §85.4, §102.3), not in the FP volume idiom; they carry none of the spine's obligations. CN is a DM-surface program (an editor program in substance) predating Edit Mode. MF is a presentation program with "Zero simulation-engine changes; zero persisted-state changes" (MF:157); the `DESIGN_FP_ARCH_` prefix is a naming accident of lane UF-1 (MF:4–7). Recommendation in §10.

## 3. LAWS AND OWNER-SETTLED ITEMS (verbatim; the fold may not re-narrate these)
- **Owner, 2026-09-23 (ARCH:3079):** "can you continue the architecture and implimentation work for FP?" · "as you take into account the FP, also make sure it nows covers, where appropriate, any additions to edit mode".
- **Owner, 2026-09-23 ~23:4x (ARCH:3268 heading; ODQ:32952 §934.84):** "no just build it all shipped lit" · "then do everything else" · (ODQ only) "alright do everything according to your judgement."
- **Owner, 2026-09-24 11:38 (ARCH:3304; ODQ:32953 §934.85):** "then i approve of your suggestions, add them to the sequence".
- **Owner blanket grant 2026-08-05 (ARCH:3142, J-EM-9):** "I give permission for everything that requires my sign off in the full queue".
- **Owner (PG:44–47, ODQ §136):** "if they have priests and healing and good prosperity and are more orderly, then they both have resistance to oncoming and less plague time as well as based on belief refusing any groups that come from known plague towns and locations to stave off infection amongst other coherences."
- **Owner (CN:33–34, ODQ §130):** "Comprehensively, exhaustively, carefully, seamlessly, coherently, and cohesively build it and slot it where appropriate."
- **Owner (MF:146, §150, marked "verbatim intent" — i.e. NOT verbatim):** "comprehensively redo the maps… that is the style and way that I want you to clone the settlement layer map…". MF:150 the decision rule (owner order §161j): "reconcile HISTORICAL EVIDENCE with THE ABSOLUTE BEST POSSIBLE PRODUCT, regardless of risk."
- **Laws:** L1–L9 (ARCH:76–175), L10 (ARCH:178–218) with its five members (a) FORKS (b) SEALS AND CONDITIONS (c) THE COUNTERPARTY (d) THE TICK AND THE STATES (e) THE RECORD AND THE VOCABULARIES; the predicate law and dark-layer law (ARCH:3105–3107); J-EM-1..J-EM-16 (ARCH:3132–3147, 3270–3272). LG's L-LG-1..7 (LG:26–62). PG's first law "ONE PLAGUE TRUTH" (PG:17–21). CN's §2 laws 1–11 (CN:125–175, each citing ODQ §126/§128/§129). MF §0.0 decision rule.
- **Rulings recorded as owner-signed or owner-gated:** CR-FP-3..10, CR-FP-12 (ARCH:2978–3033); CQ2, CQ5 (ARCH:3035–3045); HB Q1 (owner's, then signed by J-EM-15's reading); F1..F9 + CR-WC-9 (signed by J-EM-9's reading, "Veto surface: one word on F1..F8 re-parks WY-3/4/6", ARCH:3142); CN OQ-1 OWNER-VALUE (command-power tier gating, CN:416); PG pg-4 quarantine verb OWNER-VALUE (PG:310, 389); MF-R1 (compile-blocking, MF:30, 159); LG Q2 "the doctrine-10 shift is therefore scheduled, not smuggled" (LG:69–73).
- **"Not vetoable" items:** none in this family is marked non-vetoable; every chair ruling is "vetoable by one owner clause" (ARCH:3077 heading, 3302 heading, LG/CN/PG/MF headers).

## 4. CROSS-PROGRAM CLAIMS
| # | Claim (source) | About | Other side / code | Mark |
|---|---|---|---|---|
| X1 | "LG-1.. waits on POP-1 as its §D says" (ARCH:3145 J-EM-12); "POP-1 unlocks WY-4/5 and LG" (ARCH:3251) | LG | LG:181–182 "LG-0..LG-8 are unblocked at compile-time … LG-9+ waits on POP-1" | **DISAGREES** (the fold blocks eight waves LG says are free) |
| X2 | "a seal over a layer that is dark IN THAT PRESET is not offered" / FP flags lit by LIT-n | all | code lights 9 FP keys (§2b) | AGREES (master) / ledger copy SILENT |
| X3 | ODQ §934.84: "errandSpine and merchantHouses light at LIT-2 (FP-QUEUE FPQ-19)" (ODQ:32952) | SP/TR | `simulationRules.js:783–785` "HELD DARK ON PURPOSE: the errand spine … the merchant houses, which have no pulse mount yet"; LIT-2 `6fbde8097` lit mediation only | **DISAGREES** (the ledger row promises a lighting the code declined; the slot is open, no record names its new home) |
| X4 | Seam row 32: "the closed TWELVE-prefix alternation … a THIRTEENTH prefix reds until consciously admitted" (ARCH:2687) | CW/all | `tests/domain/couplingRegistry.test.js:119` lists 13 incl. `ENC`; :94 "A thirteenth volume must amend BOTH this list and that seam row" | **STALE** (the code's own instruction to amend row 32 is unmet) |
| X5 | HB-2 "LANDS HB'S FIRST CROSS-LAYER ROW … its own couplingRegistryHabit.js leaf" (ARCH:1580–1584; seam row 32) | HB | J-EM-6 (ARCH:3139) "HB's first coupling row lands with HB-4 … minted then"; no `couplingRegistryHabit.js` in `src/domain/certification/` | DISAGREES internally; code AGREES with J-EM-6 |
| X6 | §1 L1 / J-EM-13 "pulseKernel.js … receive ZERO edits ever" (ARCH:85–87, 3146) | EP / EM | EP-1 "THE ONE WAVE … THAT EDITS pulseKernel.js" (ARCH:1385–1392); L10(d) "applyDecreesAtTick, the one hook pulseKernel.js gained" (ARCH:212); baseline 1581 (`scripts/.size-baseline.json:13`) vs R-BLD-10's 1580 | DISAGREES internally (an "ever" with two landed exceptions) |
| X7 | §10 "the war volume's §10 verbatim, plus the FP compile's additions" (ARCH:2766) | WAR | WRA:1741–1768 has 7 clauses; ARCH:2768–2856 has 10 and re-words 1, 3, 4, 5, 6, 8 | **DISAGREES** (an amended superset, not verbatim) |
| X8 | §10.6 "every new store action registers in operationRegistry + `npm run gen:compendium-data`" (ARCH:2829–2831) | EM | L10/J-EM-2 (ARCH:3135) "An FP DM verb is a REALM_MANIFEST row … or a DIRECTION_OP_TYPES row … never a bespoke op type" | DISAGREES internally (the protocol still teaches the superseded lane) |
| X9 | WF-2's movers "purpose `religious`" (ARCH:1035, 2006) | WF/SP | J-EM-6 (ARCH:3139) "WF-2's pilgrims travel with purpose `personal`, not `religious`"; WF arch :89 still "typed purpose `religious`" | DISAGREES internally; WF volume SIDES with the stale text |
| X10 | TR-5 "five executors … each of the five spellings appears EXACTLY ONCE" (ARCH:1745–1750) | GR/TR | J-EM-6 "TR-5 builds executors for the THREE commercial term rows GR-3 minted" (ARCH:3139) | DISAGREES internally |
| X11 | INT-7 mints `subsystemRowsInterior.js` (ARCH:2337, 473–475) | INT/CERT | J-EM-6 "INT-7 reads `subsystemRowsVirtual.js`, not the superseded `subsystemRowsInterior.js`" | DISAGREES internally |
| X12 | WC-2 "`warStanceOf` live (a derivation over deployments + credit)" (ARCH:1835–1836) | WC | J-EM-6 "spelled `derivedWarStanceOf(deployments, credit)` — `warStance.js :: warStanceOf(rung)` keeps its accessor meaning" | DISAGREES internally |
| X13 | §13 SEAM-2 `scarcity` driver, "its own, not the subject's belief", under the court record (ARCH:3312) | EC | EC §934.90 addendum 4 (ODQ:32975) "a persistent condition on a critical need colours the build, pact, ally and war deciders"; `grep SEAM` in DESIGN_FP_ARCH_EC.md = 0 | **SILENT** both ways — two homes for a court's true need are now chartered (PLAUSIBLE overlap) |
| X14 | §13 SEAM-2 "the appetite idiom generalized"; the owner's 10-02 THE STANDING ("consolidate how settlements AND their courts regard each other … one centre", BOARD:223) | SP/STANDING | STANDING-U0 stopped on a lane (BOARD: 2026-10-02 19:22); §13 does not cite it | SILENT (§13 predates it; a later directive overlaps SEAM-2's reader set) |
| X15 | CN cn-3: every console verb "a registered command spec dispatched through C3's `execute`" + "the ONE edit mode" `setEditMode` (CN:131, 253–279) | EM | L10 (ARCH:178–186): "ONE door into ONE queue … every change is a typed OP through the one mutation boundary"; DM verbs are REALM_MANIFEST/DIRECTION rows (J-EM-2) | **DISAGREES** (CN is the pre-Edit-Mode Change-Dock idiom L10 replaced) |
| X16 | CN cn-4: the stressor pin holds a siege forever, gating `resolveSiegeVerdict` + `SIEGE_MAX_AGE` (CN:280–320) | EM | §12.2 seal 6 `letSiegeFall (or hold)` = `pin-fork` over HBF-86 `SIEGE_VERDICT_BANDS` (ARCH:3115); HBF-84 `STRESSOR_LIFECYCLE_STAGES` registered (ARCH:3089) | **DISAGREES** (two DM-hold mechanisms for one siege: a persisted pin field vs a per-tick fork pin) |
| X17 | CN cn-5 external authored besieger, "a typed record … no faction economy" (CN:321–330) | EM | L10(c) the PHANTOM, "a minimal save record, `kind: 'phantom'`, no simulated side" (ARCH:204) | SILENT (overlapping concepts; neither cites the other) |
| X18 | PG pg-3 widens SP-B's closed `CONDITIONS_KEYS` with `afflictionBand` (PG:247–254) | SP | `beliefAxisSubjects.js:123` four keys; SP volume `CONDITIONS_KEYS` 0 hits; ES-1 legRefs "five-member … 'pullBand' was already excluded" (ARCH:1220–1222) | SILENT (SP never consented; the ES legRefs census would also have to rule) |
| X19 | PG: reception terms are POP-owned (C-POPF-2), `refused_at_the_wall` pool exists (PG:265–277) | POP | DESIGN_FP_ARCH_POP.md:59–63 cites C-POPF-2 and LG §C; fold POP-1 "refused_at_the_wall" (ARCH:2071) | AGREES |
| X20 | PG one-plague-truth, silent on POP-4 THE PLAGUE ARC (`calamityArc.js`, "ZERO-NEW-MORTALITY", ARCH:2149–2156) | POP | PG:0 hits for POP-4/calamity | SILENT (two plague programs, neither names the other) |
| X21 | LG §C "the column-class vocabulary … is ONE closed vocabulary owned by POP" (LG:169–177) | POP/WC | WC-0 minted `MILITARY_COLUMN_CLASSES` and widened the column predicates (ARCH:1806–1813), outside POP | **DISAGREES** (WC extended the column vocabulary without a POP-family wave) |
| X22 | MF §2.6 "no `kmScale` and no physical-distance metric exists anywhere in the estate" (MF:190) | WY | WY-1 `bfe4830d0` minted `spatialDigest.kmScale` (`spatialDigest.js`, `modeSpeeds.js`, `distanceRead.js`) | **STALE** as stated; MF's conclusion survives — kmScale is km per REALM map-coordinate unit, MF needs a TOWN-plan `viewMetersPerUnit` (MF:190) |
| X23 | CN C9 "NO `src/domain/worldPulse/armySupply.js`" (CN:96) | WY | still absent at 00b648c9d | AGREES (still true) |
| X24 | CN C16 feeder `migrationFlowsEnabled` "(spelling per WY volume :162)" | POP | the key exists (`static_campaign` sets it, `simulationRules.js:974`) | AGREES |

## 5. INTERNAL CONTRADICTIONS (within the fold and within the small volumes)
1. **The header vs §12.8.** ARCH:42 "Every wave ships DARK; no flag lights" ↔ ARCH:3270 "every FP layer LIGHTS. The August shipping law … is SUPERSEDED for FP by this word".
2. **The kernel "ever".** ARCH:85 "receive ZERO edits ever" ↔ ARCH:1385 "THIS IS THE ONE WAVE … THAT EDITS `pulseKernel.js`" ↔ ARCH:212 "the one hook `pulseKernel.js` gained". Also ARCH:85/432 "1580" ↔ baseline 1581.
3. **HB Q1.** ARCH:3217 "Gated: HB Q1's two owner-gated persisted fields are unsigned" ↔ ARCH:3270 "'Build it all' SIGNS HB Q1's two persisted fields".
4. **The parked list.** ARCH:3064 "The F9 `supplyCargo` sign-off row (no build until the owner signs it)" ↔ ARCH:696 "SIGNED, released at its queue position".
5. **The phantom vocabulary.** L10(b)/(c) define exactly two policies, "`real-only`" and "`home+record`" (ARCH:200, 204) ↔ §12.2 rows 4, 5, 7 use "home-only" (ARCH:3116, 3117, 3119). The code has none of the three literals (rg, 0 hits).
6. **J-EM-6's eight corrections vs §5's unbracketed text** (X9–X12, X5): the corrections live only in §12.3; the §5 charters they correct carry no pointer. ARCH:615 records that "a half-applied correction is worse than none, because the volume then contradicts itself" — the fold's own law, broken five times by its own §12.
7. **§12.4 vs §12.5 on LG.** J-EM-12 ARCH:3145 "LG-1.. waits on POP-1" ↔ LG:181 "LG-0..LG-8 are unblocked".
8. **CN header vs its landing.** CN:4–8 "DRAFT — NOT YET LANDED … no docs/ path was written" ↔ the file IS `docs/DESIGN_FP_ARCH_CN.md` on the ledger since `1d77ceb67` ("land the CN/PG/MF volumes"). Same for PG:4–8 and MF:4–7.
9. **CN's flag table counts.** CN:183 "TWO engine-gated virtual flags" and MF:159 "the contributionLedgerShape.test.js:51-52 length-22 literals moving to 23" are August counts; harmless but un-dated.

## 6. STALE PREMISES (spot-checked at 00b648c9d; ≥10)
| # | Premise (line) | Live line | Verdict |
|---|---|---|---|
| S1 | pulseKernel "enforcer-effective 1580" (ARCH:85, 432) | `scripts/.size-baseline.json:13` `"src/domain/worldPulse/pulseKernel.js": 1581` | STALE (+1, the decree hook) |
| S2 | applyWorldPulse "941, zero headroom" (ARCH:86, 433) | `.size-baseline.json:9` `907` | STALE |
| S3 | ENGINE_GATED_VIRTUAL_RULE_KEYS "= five members" (ARCH:410–416); §12.8 "every one of the 35 keys" (ARCH:3272) | 43 entries (`simulationRules.js:230–668`) | STALE (both) |
| S4 | "every one of the 35 keys … is dark in all seven presets" (ARCH:3272) | 9 FP keys lit (`:789–802`) | STALE |
| S5 | TERM_CATALOG "12 terms / 8 families" (ARCH:243–245) | node import: 26 terms, 13 families | STALE (expected growth; the fold says "derive from the live export") |
| S6 | Fork registry "86 rows and SIX outcome vocabularies" (ARCH:3089; L10 ARCH:218 "6 of 86") | 104 distinct `HBF-` ids, 10 `actionVocabulary:` rows (`habitForkRegistry.js`) | STALE |
| S7 | `envoyArrived` = `ABSENT_UNTIL_E4` (ARCH:3087, seal 8 ARCH:3120) | `src/domain/edit/worldConditions.js:241` `envoyArrived: liveRow({` (SP-D2) | STALE (discharged) |
| S8 | Prefix set "TWELVE" (ARCH:2687) | 13 incl. `ENC` (`couplingRegistry.test.js:119`) | STALE |
| S9 | "settlementStrategy 812 effective … frozen surface" (ARCH:432, 1600, 1763) | entry DELETED, "812 -> 760" (`.size-baseline.json` key `_te_ceil_settlement_strategy_2026_08_31`) — J-EM-6 already says so | STALE in §2c/§5, cured in §12.3 |
| S10 | "MAGIC/… `riskToleranceOf` collision must be ruled before SP-C" (ARCH:1018–1021) | `strategicPosture.js:303` `export function courtRiskAppetiteOf` | DISCHARGED (CR-FP-3 executed) |
| S11 | §10.1 hard-gate `[ "$(git branch --show-current)" = "claude/composite-r4" ] || exit 1` (ARCH:2770–2772; WRA:1743–1745) | every FP landing since 09-23 is on `fp/*` / `em-train-*` branches (git log; BOARD:22) | STALE — and inherited "verbatim" by SP, GR, IN, TR, WF, POP, INT, CW, ES, WY, HB, EP, EC (§9's table) |
| S12 | OP_TYPES "twenty-two rows"; one bound seal (ARCH:3088, 3086) | `operations.js:177` OP_TYPES = 22 (node); `editSlice.js:1506` SEAL_ACTS = `{ acceptPeace }` | STILL TRUE |
| S13 | MF "no `kmScale`" (MF:190) | `spatialDigest.js` kmScale datum (WY-1) | STALE as stated |
| S14 | CN C7 `SIEGE_MAX_AGE = 60` at `warSiegeVerdict.js:101` | `:179` | ADDRESS ROT (value still 60) |
| S15 | CN C1 `ENVOY_PURPOSES` `['sue','self_parlay']` at `:119` | `envoyErrandVocabulary.js:119` same | STILL TRUE |
| S16 | "the knowledge desk exists only after IN-5" (ARCH:2560) | IN-5/1 `6cf6920d4` "the seventh Herald desk" | DISCHARGED |
| S17 | §12.0 "The last FP landing was EP-3B on 2026-08-16" (ARCH:3094) | 60+ FP commits 09-24..10-02 (§2b) | STALE (true at 09-23) |
**Overturned by later rulings (not code):** the Edit-verb clause of every §5 block (Req 14 mechanics superseded by L10, ARCH:178); "lighting is owner-held at the soak redo" (ARCH:630, 2852–2856; superseded by §934.84); the CQ2 early-motion set (ARCH:3046–3049; overtaken by tests-only area lanes ARCH:3143 and then CHAIN-FIRST FP-40, FP-ORDER.md "⭐ CHAIN-FIRST AMENDMENT"); the pair cadence §13 sequences SEAM into ("Pair 6 … SEAM-0 rides pair 2", ARCH:3318) — FP-40 (2026-10-02) made "THE UNIT OF WORK … THE NEXT FELT CHAIN" and kept the pair table only as "the INVENTORY", so §13's order clause no longer orders anything.

## 7. THE CLOCK AND THE TIER (for the fold's families: program grain; for the small volumes: mechanism grain)
| Mechanism | Cadence / dwell | Aspatial? | Felt at |
|---|---|---|---|
| GR pacts / renewal / mediation (lit) | proposal answer = hopWeeks 2..8 (ARCH:1145); renewal window yearly; "twenty-year eulogy" (ARCH:1119) | needs `peaceCausalActive` (war+peace) for oath/voice/renewal/mediation | **YEARLY** — read 3 found "5 pacts signed over 20 years" (BOARD:178) |
| WF unseating (lit, default chip) | patron falls; ≥4-suppressed obituary | needs a deity world | YEARLY/EPOCH |
| SP belief chain (lit, 3 presets) | weekly belief decay; pacts via trade_demand/migration_pressure occasions | needs infoMode ≠ omniscient (`:766–771`) | seasonal→yearly |
| CW-1 braid (dark) | INTERVAL_WEEKS window | display-side | per advance (would be felt every session) |
| §13 SEAM-1 dispute | "within twenty advances" (ARCH:3310) | aspatial OK (typed bucket) | SEASONAL/YEARLY |
| CN console orders | ORDER hat = transit time (weekly legs, law M) | war-gated (`hasLiveWarState`) | **WEEKLY — the one family whose drama lives at the session clock** |
| CN stressor pin | per tick | aspatial | session (the DM's own hand) |
| LG circles/fleets | per pulse graph recompute; rebuild timers | **needs spatial canon** (one graph over `distanceRead`) | weekly travel; rebuild seasonal |
| PG pg-1/2 | epidemic ledger ticks; incubation = journey | **pg-1 needs the spatial canon marker** (PG:170–175); pg-2's aspatial gate arm works aspatially | SEASONAL (plague fronts) |
| PG pg-3 | belief decay | needs POP-1 + belief-recording infoMode | seasonal |
| MF | render time; drift grammar over years (MF §11) | n/a | every view |
**Flag:** every lit FP layer's felt drama sits at the YEARLY clock; a DM advancing a few weeks between sessions sees nothing, which is exactly what EXPERIENCE READ 1 measured ("twenty one-year advances … showed a DM NOTHING from FP", BOARD:60) and what FP-40 was written to cure.

## 8. DEPTH VS FELT VALUE
| Mechanism | What a DM sees | Judgment |
|---|---|---|
| The fold's §5 per-wave charters (1,500 lines) | nothing directly; implementers re-derive each one at build anyway (§12.9 item 2) | **CUT-TO-SENTENCE** — §5 should shrink to one line per wave pointing at its volume + a status column; the charters duplicate the program files (which "are normative where this volume compresses them", ARCH:22) |
| The fold's §9 seam matrix (50 physical / 112 logical rows) | nothing | **FOLD** into each volume's own seam section (ARCH:2690 already says rows 46–112 are "an INDEX, never the contract") |
| L10 + §12 | the seals on the Edit Mode cards | **KEEP** — the only part of the fold written against the editor that exists |
| §13 SEAM-1 standing dispute | "a dispute heating and exiting" with the object named | **KEEP** (the owner signed it; peacetime friction is the measured silence) |
| §13 SEAM-2 neighbour drivers | two neighbours answering differently "for a reason the Herald says" | **FOLD** into STANDING (the owner's 10-02 one-centre directive) and EC's condition — three homes chartered for one court-side truth (X13, X14) |
| §13 SEAM-3 law across the seam | extradition/sanctuary demands | **DEFER** (rides SP-D errands no shipped preset lights) |
| Court bonds | "a match sealed between the two courts" | **KEEP** as flavour (no wave, cheap) |
| CN war console (cn-1..cn-6) | a war tab that becomes a command centre | **FOLD** into Edit Mode: cn-1/cn-2 (read model) KEEP; cn-3's verbs become REALM_MANIFEST/DIRECTION rows; cn-4's pin becomes the `letSiegeFall` seal + a HBF-84 stressor-stage pin; cn-5 external host reconciles with phantoms |
| CN conversion valve | "commit the force" | **CUT-TO-SENTENCE** until a pinned siege exists in a shipped world |
| LG circles + fleets | airships, teleport politics | **DEFER** (needs spatial canon + many unbuilt producers; LG-9+ blocked on POP-1) — but LG-0's willingness gate repairs a LIVE defect (hostile routing through a target's circle, LG:69–71) and should be pulled forward alone |
| PG pg-1/pg-2 | "Plague reaches X" more often from refugees; rich towns recover faster | **KEEP**, as POP-4's sibling, after POP-4's ruling (one plague truth must name POP-4) |
| PG pg-3 | gates shut on a rumour of plague | **DEFER** (POP-1 + belief infoMode) |
| MF fabric | the town map looks like Watabou | **KEEP — but not as FP**; move to the map program's own family |

## 9. VOCABULARY (closed sets minted or restated by this family)
| Name | Values | Line |
|---|---|---|
| Significance family | routine · notable · major | ARCH:842–843, 413–416 |
| Errand purpose classes | diplomatic · commercial · religious · factional · personal · covert | ARCH:1026 |
| Record register classes | HELD · WORLD · CONSTANT · READING · MIRROR · RECEIPT · HISTORY · AUTHORED | ARCH:216 |
| Phantom policy | real-only · home+record (L10) · **home-only (§12.2 only)** | ARCH:200, 204, 3116 |
| Decree cause | table · party | ARCH:212 |
| TRADE_ENDING_KEYS | fortune · ruin · monopoly · collapse · severance · cornered | ARCH:1777–1778 |
| MILITARY_COLUMN_CLASSES | 3 incl. reinforcement_column | ARCH:1806 |
| SEAM-1 temperature | cold · simmering · hot · open | ARCH:3310 |
| SEAM-2 drivers | scarcity · warWeariness · successionClock · appetite | ARCH:3312 |
| SEAM-3 demand kinds / answers | extradition · sanctuary claim · outlaw levy / accept · refuse · counter | ARCH:3314 |
| Bond flavours | match · fosterage · adoption · hostage exchange | ARCH:3316 |
| CN hats | ORDER · AUTHOR | CN:159–167 |
| CN besieger union | settlement-faction army · external authored host | CN:145–152 |
| LG modes | ground · sea · air · circle | LG:26–29 |
| PG afflictionBand | clean · whispered · feared · shunned | PG:254 |
| PG plagueTouched | band 0..3 | PG:140 |
| MF colour roles | Paper · Ink · Roofs · Water · Greens · Roads · Walls · Trees · Labels · Elements | MF:169–178 |
| MF doors | A (engine virtual rule) · B (layoutLawVersion 3) · C (UI dial) | MF:159 |
**Homonyms for the chair:** (1) **SEAM-n** — §13's SEAM-0..3 vs the landed TE-NET-1/T5 "car SEAM-3/4/5" commits (`16c4a2eb0`, `83704ad3f`, `23434a863`, 2026-08-30) vs §9's "seam matrix" rows vs "the SEAM FAMILY". (2) **MF** — DESIGN_FP_ARCH_MF's MF-1..MF-7 / MF-R1/R2 vs the landed **MF-CH2B** (`fd9845dc5`, `94e40b900`: the magic shelf-gate census, the urban band's "Approve + fold in MF-CH2B"). (3) **pin** — CN's stressor pin (a persisted DM hold) vs EM's `pin-fork` (a per-tick fork outcome) vs "pin" = a test assertion, used on the same pages. (4) **bond** — §13 court bonds vs WC `serviceBonds` / WC-15 "diaspora bonds". (5) **L-numbers** — the fold's L1–L10 vs LG's L-LG-1..7 vs WRA's "law M/K3". (6) **§-numbers** — CN/LG/PG cite "§42/§43, §49/§50, §85.4" meaning ODQ/estate sections, not volume sections.

## 10. REFINEMENTS (in-place, dated brackets; never rewrite a law)
1. `[ARCH:42]` "Every wave ships DARK; no flag lights" → `[CORRECTED 2026-10-16 (coherence fold) — superseded for FP by §12.8 (J-EM-15/16, ODQ §934.84 "shipped lit"). At 00b648c9d nine FP keys are lit: pactFormation + faithUnseating in the four world-alive presets incl. the realistic_regional default chip; the belief chain in three; the war-peace four in two (simulationRules.js FP_LIT_*).]` — the header is the first line a reader trusts.
2. `[ARCH:946]` the 09-23 progress block → append `[RE-DERIVED 2026-10-16 (coherence fold) at 00b648c9d — 37 landed · 12 partial · 62 not started of 111 (114 with §13: 65 not started); moved: GR-2, GR-6, IN-2, IN-3, IN-6, TR-3, CW-1, WF-0, WY-1 landed; IN-4, IN-5, TR-2 partial; SP-D2 landed as a §12 member. The table is in the coherence volume.]` — and add the same bracket to the LEDGER copy, which still carries only the 08-09 block.
3. `[ARCH:85]` "receive ZERO edits ever" → `[CORRECTED 2026-10-16 — two sanctioned exceptions exist: EP-1's six-token seam and EM's applyDecreesAtTick (the 1580→1581 baseline). The law reads: no FP stage mounts in the kernel; EP-1 is the one FP edit.]`
4. `[ARCH:2687]` seam row 32 "TWELVE-prefix" → `[CORRECTED 2026-10-16 — THIRTEEN at 00b648c9d: ENC admitted (couplingRegistry.test.js:119), whose own header (:94) requires this row's amendment.]`
5. `[ARCH:2766]` "the war volume's §10 verbatim" → `[CORRECTED 2026-10-16 — an amended superset (7 → 10 clauses); clause 1's branch gate names claude/composite-r4, which no lane since 09-23 builds on — read it as "the lane's own branch, hard-gated".]` Same bracket owed at every volume that "inherits §10 verbatim" (SP:912, GR:699, IN:6/709, TR:8/600, WF:7/18/837, POP:7/599, INT:8/277, CW:8/172, ES:36, WY:82, HB:108, EP:63, EC:11/96).
6. `[ARCH:2829]` §10.6 operationRegistry clause → `[CORRECTED 2026-10-16 — for DM verbs read L10/J-EM-2: a REALM_MANIFEST or DIRECTION_OP_TYPES row; operationRegistry remains for store actions only.]`
7. `[ARCH:3116–3119]` "home-only" → `[CORRECTED 2026-10-16 — not an L10 policy; read home+record (L10(b)) or mint "home-only" in L10(c) by ruling.]`
8. `[ARCH:1035, 2006]` WF-2 purpose `religious` · `[ARCH:1745]` TR-5 "five" · `[ARCH:2337]` INT-7 subsystemRowsInterior · `[ARCH:1835]` WC-2 warStanceOf · `[ARCH:1580]` HB-2 first coupling row → each `[CORRECTED 2026-09-23 by J-EM-6 (§12.3); pointer added 2026-10-16 — see ARCH:3139.]` — the fold's own half-applied-correction law (ARCH:615).
9. `[ARCH:3064]` the parked list → `[CORRECTED 2026-10-16 — F9 SIGNED (ARCH:696, J-EM-9); the war-chooser spy wiring RELEASED by the 08-05 grant (HB-5 block); ES-0's CR-FP-12 moot (ES-0 landed). Still parked: ES Q5 alliance-topology ACQUIRE; Q6/J-POP-14 (no ODQ row found by grep — owed a slot under the 09-19 never-deferred law); tuning bands.]`
10. `[ARCH:3145]` J-EM-12 "LG-1.. waits on POP-1" → `[CORRECTED 2026-10-16 — LG §D: LG-0..LG-8 are unblocked; only LG-9+ waits on POP-1.]`
11. `[ARCH:3318]` §13 order clause → `[CORRECTED 2026-10-16 — the pair cadence is the INVENTORY since FP-40 CHAIN-FIRST (2026-10-02); SEAM-0..3 are taken in the order of the chains they unlock. SEAM-2 overlaps THE STANDING (FPQ-78) and EC's condition (§934.90 add. 4): one court-side truth, ruled once.]`
12. `[ARCH:3217 (HB-3 row) and ARCH:946 "(HB Q1)"]` → `[CORRECTED 2026-10-16 — HB Q1 SIGNED by the owner's word as read at J-EM-15 (ARCH:3270); HB-3..HB-9 released.]`
13. `[CN:4, PG:4, MF:4]` "DRAFT — NOT YET LANDED" → `[CORRECTED 2026-10-16 — LANDED on the ledger at 1d77ceb67 (2026-08-16); NOT on master; NOT in the compiled order; carries none of the spine's obligations (no Req 13/14 or L10 line, no coupling prefix, no annex).]`
14. `[MF:190]` "no `kmScale` … exists" → `[CORRECTED 2026-10-16 — WY-1 (bfe4830d0) minted spatialDigest.kmScale, km per REALM map unit; the town plan's viewMetersPerUnit is still owed by MF-5 — the conclusion stands.]`
15. `[MF:1]` → `[NOTED 2026-10-16 — a presentation program, not FP; the DESIGN_FP_ARCH_ prefix is lane UF-1's naming; distinct from MF-CH2B (the magic shelf gate).]`
16. `[CN:280 cn-4]` → `[NOTED 2026-10-16 — overlaps Edit Mode seal 6 letSiegeFall/HBF-86 and HBF-84; and L10 requires the verb as a REALM_MANIFEST/DIRECTION row, not a command spec. Rule which hold the DM gets before cn-4 compiles.]`
17. `[LG:169 §C]` → `[NOTED 2026-10-16 — WC-0 (landed) widened the column predicates with MILITARY_COLUMN_CLASSES outside a POP-family wave; §C needs a ruling that admits it or routes it.]`
18. `[ODQ:32952 §934.84]` "errandSpine and merchantHouses light at LIT-2" → `[CORRECTED 2026-10-16 — LIT-2 lit mediation only; both HELD DARK (simulationRules.js:783–785: envoy keys dark everywhere; houses unmounted until TR-2b). FPQ-19's slot moves to TR-2b's lighting and the envoy-key ruling.]`

## 11. OPEN QUESTIONS FOR THE OWNER (only what is his)
1. **Do CN, LG, PG and MF belong in FP at all?** Recommendation: MF out (its own map family); CN folded into the Edit Mode program (it is a DM surface); LG and PG stay FP-adjacent volumes that must take the spine's obligations (Req 13, L10 EDITOR line, a coupling prefix, an annex) before any wave compiles. Re-sequencing is yours.
2. **The envoy keys** (`envoyDiplomacyEnabled`, `routeLifecycleEnabled`, `warTerminationEnabled`, `npcConsequencesEnabled`, `demographicsEnabled`, ARCH:3272) are non-FP prerequisites lit in no preset; without them errandSpine, espionage, the reputation race and SP-D2's inbound read stay dark in every shipped world. Lighting them is a same-seed shift on new worlds.
3. **The statecraft head** (`infoStatecraftEnabled`, "LIT-2 measured the head's shift and held it for a ruling", `simulationRules.js:785–787`): IN-2/IN-3 are built and wait on it.
4. **One court-side truth:** SEAM-2's drivers, THE STANDING's one centre, and EC's persistent condition chart three homes for how a neighbour's own need and regard reach its choosers — which one is the home (a persistence-shape call).
5. **Q6 / J-POP-14 (arrivals feeding `mass_migration`)**: recorded as "on the owner queue, not into any wave" (ARCH:2930–2937, CR-FP-6 ARCH:2995) but no ODQ row was found; it needs your slot or a CLOSED-with-reason.
6. **CN OQ-1** (are command powers tier-gated, and is AUTHOR priced apart from ORDER — CN:416) is a paid-surface question, still open.

---

## APPENDIX A — THE FOLD'S §11 CHAIR QUESTIONS, §12.7 DECISION POINTS AND §13 SEAM FAMILY: RULED / STALE
| Item | Ruling (line) | State at 00b648c9d / 10-16 | Verdict |
|---|---|---|---|
| Q1 posture naming | CR-FP-3 keep `postureOf`, rename to `courtRiskAppetiteOf` (ARCH:2978) | `strategicPosture.js:303` `courtRiskAppetiteOf` | RULED · DISCHARGED |
| Q2 early motion | CQ2 = GR-0+GR-1+TR-1+TR-9-contract (ARCH:3035–3045) | superseded by tests-only area lanes (J-EM-10, ARCH:3143) then CHAIN-FIRST FP-40 (FP-ORDER.md) | RULED · **STALE** (moot) |
| Q3 IN-0a transport | CR-FP-4 primary road (ARCH:2983) | IN-0 landed | RULED · DISCHARGED |
| Q4 J-INT-13 | CR-FP-5 dark prose-version arm, "every existing golden byte-identical" | INT-8 not started; the owner's §934.88 signs text-only re-records wave by wave (ODQ:32962) — the byte-identical premise PLAUSIBLY overtaken | RULED · STANDS, premise at risk |
| Q5 manifest uniformity | CQ5 one-commit law (ARCH:3035–3045) | law holds in code (manifest + rows); §12.9 item 1 adds codepoint insertion | RULED · STANDS |
| Q6 arrivals → mass_migration | CR-FP-6 NO, "this goes on the owner queue, not into any wave" (ARCH:2995–2997) | no ODQ row found (`J-POP-14`: 0 hits in ODQ); FVQ:2446 records it | RULED · **OPEN OWNER ITEM WITHOUT A SLOT** |
| Q7 D-W3 | CR-FP-7 cap-raise, CLOSED | — | RULED · CLOSED |
| Q8 sale door | CR-FP-8 "not in this build … a recorded post-GR-2 candidate" | GR-2 COMPLETE (GR-2b `3f05e36e0`) — the trigger fired; no slot named | RULED · **STALE (dangling)** |
| Q9 storageMonths fold | CR-FP-9 REPORTED-NOT-DEFECT | TR-4 unbuilt; TR-4 now inside EC's absorption | RULED · STANDS |
| Q10 errand address | CR-FP-10 keep in place | `errandMint.js` present; `envoyErrands` top-level | RULED · DISCHARGED |
| CR-FP-12 ES-0 motion | declined (ARCH:3019) | ES-0 landed | RULED · MOOT |
| CR-FP-1/2/11 | landed (ARCH:3035–3040) | — | LANDED |
| §12.7.1 launch line | J-EM-15 "THE LAUNCH LINE IS EVERYTHING" (ARCH:3270) | 9 FP keys lit; the rest dark for want of layers or prerequisites | CLOSED |
| §12.7.2 HB Q1 | J-EM-15(2) signed | §12.4's HB rows still say unsigned | CLOSED · text STALE |
| §12.7.3 F1..F8 reading | J-EM-9 (ARCH:3142) | WY-3/4/6 unbuilt | OPEN veto surface (one word) |
| §12.7.4 U104 roster | Edit Mode's decision | SEAL_ACTS still one row (`editSlice.js:1506`) | OPEN (EM program) |
| SEAM-0 appetite mount | "owed, not new" (ARCH:3308) | not built; the facet "has NO DATA" | OWED · unslotted under FP-40 |
| SEAM-1 standing dispute | §934.85 (ARCH:3310) | flag `standingDisputeEnabled` 0 hits | RULED (owner) · NOT STARTED |
| SEAM-2 neighbour drivers | §934.85 (ARCH:3312) | flag 0 hits; overlaps THE STANDING (10-02) and EC add. 4 (10-16) | RULED (owner) · NOT STARTED · **needs a home ruling** |
| SEAM-3 law across the seam | §934.85 (ARCH:3314) | flag 0 hits; needs SP-D errands (lit nowhere) | RULED (owner) · NOT STARTED |
| Court bonds | flavour on GR-7 / FP-23 (ARCH:3316) | GR-7 not started | RULED · NOT STARTED |
| §13 order clause | pair 6 / pair 2 (ARCH:3318) | FP-40 replaced the pair cadence as order | **STALE** |

## APPENDIX B — THE AMENDMENT LADDER A..S (DESIGN_REALM_DIRECTIVES.md; all dated 2026-08-01) AND WHO CITES IT
"Explicit" = the volume writes "amendment X"; "by law token" = it cites the war volume's law spelling (K3/K.n, law M) instead. Volumes abbreviated without `DESIGN_FP_`. Grep-based: a lower bound for explicit citations; no volume cites the ladder as a whole except FP_TRADE:27 ("amendments A, B, I, L, M and …"). **There is no amendment P** (no heading in RD; the ladder runs A–O, Q–S: eighteen letters).
| Amd | One-line law (headline, RD line) | Explicit FP citers | Also cited by law token |
|---|---|---|---|
| A | Every cause needs a REAL counterforce, not a mirror word (RD:174) | ARCH_EC, TRADE | — |
| B | Absolute coherence with settlement state; alignment weights motive (RD:184; WRA:54 law B) | SPINE, INFORMATION, INTERIOR, TRADE (+ ARCH, ARCH_TR by "(amendment B)") | — |
| C | A cause is live for the war's duration; cost is a second, independent front (RD:199) | SPINE, FAITH | — |
| D | A change of ruler or legitimate power re-reads the whole war (RD:261) | COUPLINGS | — |
| E | War as culture, and the god who wants it — a fourteenth cause (RD:297) | none | ⚠ "E3" (WRA:71, disposition is a threshold) is a DIFFERENT law with a colliding letter; cited by ARCH, ARCH_EC, ARCH_ES, ARCH_SP, ARCH_WF, ARCH_WY, FAITH, INTERIOR, SPINE, TRADE |
| F | Costs are comparative and projected; the home front is its own stream (RD:397) | none | — |
| G | The actor is the legitimate ruler, with their own books (RD:439) | INTERIOR | (warSeatBooks — INT-1's subject) |
| H | A coalition inside the walls can overturn the ruler over a war decision (RD:511) | none | — |
| I | Multi-party war is a graph of bilateral edges — pairwise only (RD:532; WRA:74) | ARCH_WY | TRADE (mechanism) |
| J | The coalition settlement: collective liability, pairwise settlement (RD:625) | none | — |
| K | The envoy: peace is carried by a person and can be stopped on the road; K3 "nobody is ever current" (RD:664; WRA:48) | none by letter | **K3/K.n in 21 volumes**: ARCH, ARCH_CW, ARCH_EC, ARCH_ES, ARCH_GR, ARCH_HB, ARCH_IN, ARCH_INT, ARCH_POP, ARCH_SP, ARCH_TR, ARCH_WC, ARCH_WF, COUPLINGS, FAITH, GRAMMAR, INFORMATION, INTERIOR, POPULATIONS, SPINE, TRADE |
| L | Convergence: war must end, and not by a timer — no clamps (RD:824; WRA:76) | TRADE | — |
| M | Travel is slow: one week per leg minimum; the road is a place (RD:866; WRA:66 law M) | none by letter | **law M in 13 volumes**: ARCH, ARCH_HB, ARCH_IN, ARCH_SP, ARCH_WC, ARCH_WY, COUPLINGS, FAITH, GRAMMAR, INFORMATION, INTERIOR, POPULATIONS, TRADE |
| N | Conquest is a different end state; the overwhelming gate (RD:892; WRA:79) | none by letter | (conquestDoctrine mechanism, many) |
| O | Captivity is not permanent: the ransom after a dwell (RD:990) | none by letter | (ransom mechanism: ES, IN, TR, WY, LG) |
| Q | The compromised envoy, and the one honest channel (RD:1023) | none by letter | (ES, TR-8 compromised factor, GRAMMAR, COUPLINGS) |
| R | The razing: punitive victory is the third intent (RD:1064; WRA:79) | none by letter | (razing mechanism: POP, WC, HB, CW) |
| S | The sovereignty market: satellites and vassals are tradeable, through belief (RD:1227) | ARCH_WF, TRADE | (WR-10, every SP-B2/ES-4 lighting row) |
**For the chair:** the claim "the amendment ladder A..S every FP volume cites" holds only for K (as K3) and M (as law M); A, B, C, D, G, I, L, S are cited by 1–5 volumes each; E, F, H, J, N, O, Q, R are cited by NO FP volume by letter. None of CN, LG, PG, MF cites any amendment by letter.

## APPENDIX C — THE WAR VOLUME'S §10 (WRA:1741–1768), VERBATIM — the clauses every FP volume says it inherits "verbatim"
> ## §10 IMPLEMENTER PROTOCOL (binding on the external implementer, Sol 5.6)
> 1. **Worktree + branch:** all work in the minifold worktree (`.claude/worktrees/minifold`, branch `claude/composite-r4`). Hard-gate every state-mutating compound: `[ "$(git branch --show-current)" = "claude/composite-r4" ] || exit 1`. NEVER `git add -A/-u/.` — explicit files only. `git stash` is FORBIDDEN. Never touch `momentum.js`. Never edit another program's dirty files.
> 2. **Gates:** never read a gate through a pipe — `npm run check:tail` or `sh scripts/gate-tail.sh <cmd>`; full suite exceeds a 10-minute cap (run detached); gate only when `lsof`/`ps` shows zero other vitest workers; timeout-shaped reds under load are flakes — isolation re-run before diagnosis.
> 3. **One wave = one commit** (WR-7 = four commits, one per slice) + focused gates per slice + full gate at wave end + a ledger row in docs/COMPREHENSIVE_REVIEW_PROGRAM.md (ledger branch) or the program's Progress blockquote per the house convention.
> 4. **Goldens:** capture every dormancy fence BEFORE wiring (the J1 precedent). A golden that moves unexpectedly is a STOP-and-report, never a re-record. Golden re-records happen only against a ruling recorded in FABLE_VALIDATION_QUEUE.md or by the owner.
> 5. **New tests in generation trees** MUST use tests/helpers/{anchoredNegatives, seedFailures}.js (walkers red otherwise). Every envelope carries a mutant negative control. Every new news kind registers in WHAT_PHRASES + heraldRouting (totality walkers red otherwise). Every new store action registers in operationRegistry + regenerated compendium data.
> 6. **Report, don't rule:** any conflict between this document, an amendment, or the tree is a STOP-and-report to the validation chair. Deviations an implementer believes necessary are proposed in the report, never taken.
> 7. **Every claim in the completion report is CONFIRMED (executed, output quoted) or PLAUSIBLE (labeled).** "Should work" is not a state of the world.

**Which clauses have rotted (receipts in §6/§4):** clause 1's worktree and branch gate (no FP lane builds on `claude/composite-r4`; the build slot moved to train/`fp/*` branches — S11); clause 1's "Sol 5.6 external implementer" header (FP seats are the chair's agents); clause 3's ledger home (FP landings record on the FP kit board and ODQ, not COMPREHENSIVE_REVIEW_PROGRAM.md — PLAUSIBLE, by the board's practice); clause 4's "STOP-and-report, never a re-record" — superseded for FP by the signed-door re-records "WITH THE CAUSE" (J-EM-16, ARCH:3272; every LIT-n pick); clause 5's operationRegistry lane for DM verbs (superseded by L10/J-EM-2). Clauses 2, 6 and 7 stand. Every FP volume that says "§10 binds verbatim" inherits the rotted clauses with it (list in §10 refinement 5); the fold's own §10 (ARCH:2768–2856) is NOT verbatim (X7) — it is the better text and should be named as the FP protocol, with the war §10 cited as its ancestor.
