# D-CH-r1 — disposition lane, round 1: THE CHAMPIONS (`docs/DESIGN_FP_ARCH_CH.md`)

Seat: D-CH-r1 (Opus 5.5), chair a73343ed, P3 round 1, 2026-10-18 (~01:10–01:50 EDT). Code of record: the detached master worktree `master-81f1cd963` (read-only; `rg`/`sed`; node only under `cure/D-CH-r1-probe/`). Git and the test suite untouched. The volume was backed up before the first edit (`scratchpad/dch/CH.before.md`, 716 lines); it is now 879 lines (222,575 bytes), every change bracketed in place.

## OUTCOME

All 55 findings routed to CH are disposed: **53 CURED · 0 REFUTED · 2 ⛔ STOP · 0 NOTED**. The volume's new §25 THE CURE RECORD lists every id, and the script checked that each id appears in both the body and the record. The STOPs are SEAMS-r1-1 (capture, against the chair's re-ruling CH-r1-1) and SEAMS-r1-19 (`drawn`, against RULINGS-ROUND1's rename line). The chair's re-rulings CH-r1-1 (executed in part), CH-r1-3 and CH-r1-4 are executed. So are RULINGS-AFTER-COMPILE's RN-S1 and OD-CH-4, and L-FOLD's three unplaced CH items: capture, §6.2's `menace_strikes`, and `stand_off`.

Sources read whole: kit README; briefs COMPILE-COMMON, DISPOSE, L-CH, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1, RESEARCH-COMMON, OWNERSHIP, BOARD; cure/L-FOLD (unplaced items); cure/L-CH; skeptic/CH-r1, SEAMS-r1, HOST-r1; the volume. The owner's attachment `HOST-REQUIREMENTS-2026-10-18.md` is byte-identical to the kit's `refs/` copy (`cmp`), and I read its H5/H6/H7/H8/H9/H10/H11/H13/H15/H16/H17/H19/H20/H22–H25 rows, the world-site asks ENC-HL-01..13, the FP laws 1–12 and the audience rule. RN, PL and MN were re-read at their sites while their own lanes edited them, so CH cites them as they now stand.

## 1. FIRST ACT — the measurements (master `81f1cd963`)

| # | Claim tested | Receipt | Result |
|---|---|---|---|
| M1 | Can the landed custody hold any paragon? (SEAMS-r1-1 vs RULINGS-ROUND1 CH-r1-1) | `foreignGuestHold.js :: normalizeForeignGuestHold`: `if (!id \|\| !npcId \|\| !errandId \|\| !encounterId \|\| !captorId \|\| !venueId …) return null;` · the ONE opener `envoyInterceptionStage.js :: holdInterruptedEnvoy` (`resolveEnvoyInterception({ … resolution: 'held' … })` then `openForeignGuestHold({ … errandId: text(errand.id), encounterId: text(encounter.id) … })`) · `subsystemRowsBelief.js` ES row: "The errand DTO refuses the held state for a row that carries no army-carried ENCOUNTER … Relaxing either shape is a persisted-schema question and this estate gates those on the owner" | CONFIRMED: only a traveller on an ERRAND interrupted by an ARMY encounter can be held. The skeptic is right against the general re-ruling, which is a STOP. The narrow arm is buildable and is designed. |
| M2 | Residency stay and the errand claim (CH-r1-3/4) | `npcResidency.js :: advanceResidency` ("LODGED, stay not yet up ⇒ nothing at all"; reads `npcLedgerOf(worldState).roamers[id]`); `NPC_CONSEQUENCES_TUNING.RESIDENCY_STAY_TICKS`; `envoyDiplomacy.js :: activeOwnsLeg` (claims only `unclaimedRoamer`: not placed, no `residency`, no `dmAssignment`); `npcCirculationTransit.js :: planWanderLeg`, `namedPersonTransit.js :: openNamedPersonLeg` exported | CONFIRMED: the hand-off rule follows from `activeOwnsLeg`. The paragon's own leg is built from the two exported leg functions. |
| M3 | Two faith strength sites (CH-r1-9) | `religiousContest.js :: advanceReligionStates` 3a `let strength = clamp01(pietyMult * deityLocalStrength({…}))` → `attemptEntry`; 3b `strengthByRef[dref] = …`; the `reach` map "stays EMPTY when spread is off" | CONFIRMED: the 3a carrier works only where spread is lit. |
| M4 | Care's reach (HOST-r1-8) | `pestilenceKernel.js` `care01Of`; `spatial/pestilence.js :: onsetProbability` ("… MINUS care") and the recovering relax `T.LEVEL_RELAX_CARE * care01Of(id)`; `tableLedger.js :: OBLIGATION_TYPES` includes `'plague'` | CONFIRMED. HOST-r1-8 said care "only speeds the recovering fade"; the read shows care also lowers the takes-hold roll. The cure states both terms. |
| M5 | Axis words (CH-r1-19) | `paradigmAxisCatalog.js :: PARADIGM_AXES`: TEMPER patient/wrathful; FORBEARANCE forgiving/vengeful; FIDELITY loyal/treacherous (`mercurial`); GENEROSITY generous/greedy; HUMILITY humble/arrogant (`proud`); TRUST trusting/paranoid | CONFIRMED |
| M6 | Exported vocabularies (CH-r1-28) | `npcFacetContract.js :: NPC_ALIGNMENTS` (eight words, no `chaotic_good`), `NPC_GOALS`; `npcAgency.js` `const IDEALS = [...]` private; `warSeatBooks.js` `function rulerAlignment(` not exported | CONFIRMED. Making `rulerAlignment` an export changes zero lines. The ideals list needs a car (`NPC_IDEALS` plus an equality pin). |
| M7 | Removal pin (CH-r1-18) | `tests/domain/npcDmVerbs.test.js` "ANCHORED NEGATIVE…" scans `['src/domain/worldPulse', 'src/store']`; `npcLedger.js :: removeNpcRecord` | CONFIRMED |
| M8 | Ledger readers (CH-r1-24) | `rg -l 'npcLedgerOf\(\|\.roamers\b\|\.placed\b' src` gives 18 files: 15 real readers and 3 false hits (`AutoplacementConsent.jsx`, `demographicsMigration.js`, `demographicsResponses.js`). Readers that matter: `npcReplacement.js` (eligible roamers drafted into a roster vacancy), `npcCirculation.js :: poolCensus`, `heraldWanderers.js`, `reputationRaceConsumer.js` (reads `placed` as exiles) | CONFIRMED (the §2.4 table) |
| M9 | Treasury (CH-r1-5) | `treasury.js :: advanceTreasury(settlement, options = {})` (no worldState), single caller `pulseKernel.js`; `UPKEEP_LEDGERS` doc "A widening car adds the member and its call site in the same act"; `COIN_FLOW_TERMS` conservation identity | CONFIRMED. A retainer row cannot be reached without a kernel line. The pay is therefore a slot on SEAT-8's car. |
| M10 | Blowback (CH-r1-6) | `corruptionWeb.js :: applyForeignExposureBlowback` adds `resentment + T.EXPOSURE_GRIEVANCE_W * fx.magnitude01`, a `credDeltas` deception charge and two `courtHits` on every call. Decay is read-time by tick difference, so a second call does not double-decay. `informationStatecraft.js :: credibilityScoreOf(worldState, id, tick)` takes no observer. | CONFIRMED |
| M11 | Peace seam (CH-r1-16) | `warPeaceDecision.js :: readWarPeaceDecision` `accepted = … termination.suePressure01 >= WAR_PEACE_DECISION_TUNING.ACCEPT_AT`; caller `applyWorldPulse.js` (`readWarPeaceDecision({`) | CONFIRMED (seam). Its lighting is PLAUSIBLE. |
| M12 | Kernel order (CH-r1-25) | `pulseKernel.js`: `ageRoamingStressors(` ~l.510 · `advanceReligionStates({` 1332 · `advanceRumorLedgers({` 2097 · `advanceEnvoyDiplomacyPulse({` 2194 · `advanceSettlementPestilence({` 2496 | CONFIRMED |
| M13 | Prosperity (HOST-r1-16) | `prosperityRank.js` "THE ONE ladder for a prosperity LABEL as 0..1" (`prosperityRank01`) | CONFIRMED |
| M14 | Token census | `cure/D-CH-r1-probe/census.sh` (zsh, rg wrapper) gives `census1.out` and `census2.out`. `drawn` LANDED (1 literal file: `generationForkRegistry.js`; 216 word files) · `indecisive` free · `expelled` LANDED (roads detention outcome) · `overlooked` LANDED (`PULL_BANDS`) · `rival_creed` LANDED (dossier corpus slot) · `opposed_creed`, `polity_ban`, `let_be`, `legend_recorded`, `exerted`, `bearingWord`, `paragon_employer`, `gateDefault`, `NPC_IDEALS` free · `creedRef` doc-only (`DESIGN_FP_FAITH.md`, same meaning) | CONFIRMED |
| M15 | Host lines | `cure/D-CH-r1-probe/effLines.mjs` (eslint max-lines) gives `effLines.out`: warPeaceDecision 370 · treasury 438 · religiousContest 493 · envoyPulse 332 · npcDmVerbs 711 · npcFacetContract 84 · stressorGates 609 · warSeatBooks 492 · pactFormation 565 · foreignGuestHold 424 · envoyInterceptionStage 590 · corruptionWeb 510 · npcLedger 429 | CONFIRMED |

## 2. ⛔ STOPs — the chair's to rule

- **⛔ STOP SEAMS-r1-1 (capture).** The re-ruling `RULINGS-ROUND1.md` CH-r1-1 says "a held paragon rides `foreignGuestHold` … `banished_found` gains `seized`". M1 refutes its general case. The landed row refuses anything without `errandId` and `encounterId`, and its only opener is the army interception of an errand. ES-2 gated relaxing the row on the owner, and fold §3.3.13 and OD-FC-60 record it as THE OWNER'S GATE. So a failed exertion falling to capture, a gate seizure, and the owner's §125.5 bandit capture of a free wanderer cannot be held. **Proposed re-ruling (C′):** paragon custody is the landed errand-encounter arm only, meaning a BOUND paragon on its court's errand that an army intercepts. That case rides `envoy_held` (`held · released · ransomed`) and the `ransom` row (`pay · refuse · abandon` against RN's court regard; `abandon` mints `abandoned_to_captivity`). The failure ladder tops at `disgrace`. `seized` is withdrawn from `banished_found`, which needs a fold §3.4 bracket. The wider custody shape is an owner slot (ES-2b's relaxation) whose named first consumer is the paragon. The volume already carries (C′)'s buildable arm and marks the rest `[STOP SEAMS-r1-1]`: §12.4, §9 road 4, §11, §18, §19, S13 and S27.
- **⛔ STOP SEAMS-r1-19 (`drawn`).** RULINGS-ROUND1 says to rename CH's `stand_off` to `drawn`. But `drawn` is a landed literal (`generationForkRegistry.js` `@property {'drawn' | 'pure' | 'label'} class`), and the fold's own §5 register says "`drawn` (landed) avoided". **Proposed re-ruling:** use `indecisive`, which is FREE and is MN's word for the same outcome on the same docket (`menace_met`). The volume writes `indecisive` PROVISIONALLY and marks it `[STOP SEAMS-r1-19]` (§13, §2.3, §18).

## 3. THE RECORD (id · severity · disposition · where · receipt)

| id | sev | disposition | where | receipt / what changed |
|---|---|---|---|---|
| CH-r1-1 | B | CURED | §12.4, §0, §8, §21 L7, OD-CH-11 | (A) withdrawn per the re-ruling: no `jailed` (`npcVerdictTable.js :: HOLDING_VERDICT`) and no `paragon.held`; custody rides `foreignGuestHold` on its landed arm (M1); the remainder is SEAMS-r1-1's STOP |
| CH-r1-2 | B | CURED | §11 step 3, §0, CH15, §6, §10 | `opposed_creed` reads `stanceOf`'s consumed `cooperation`/`betrayalHazard` or RN's creed regard; `aggression` is never read (`deityStance.js` "DELIBERATE build-ahead … OWNER-GATED") |
| CH-r1-3 | M | CURED | CH8, CH9, P2, §3, §4.2–4.3, §5, §7, OD-CH-24 | RULINGS-ROUND1 CH-r1-3: the paragon's own leg (M2); the W-H3 stay is unused; every paragon is a `roamers` record; the town's gate is read before lodging (S33) |
| CH-r1-4 | M | CURED | §0, CH8, §4.2, §5, §7, §8, §19 | RULINGS-ROUND1 CH-r1-4 by statement: errands light with OD-FC-39's unit; degraded arm stated; hand-off via `activeOwnsLeg` |
| CH-r1-5 | M | CURED | CH10, §7, §0, CH-4, OD-CH-10 | `UPKEEP_LEDGERS` row struck (M9); pay is a slot on W-SEAT SEAT-8's widening car; terms read as paid |
| CH-r1-6 | M | CURED | §9, P2, §19, S7 | `retainer.exposedAt` latch (M10); `infoStatecraftEnabled` named; S7 restated around one global stock |
| CH-r1-7 | M | CURED | §9 road 1, P3, CH-7, L5 | the leak is seeded inside the rumour stage through RN-0's telling arm (a registration; fallback ≤ 3 lines in `rumorNetwork.js`); `paragonBeliefs` is written by the person stage from arrivals |
| CH-r1-8 | M | CURED | P2, §4.5, §6.3, L3 | `aim.exert` and `exertion.outcome` (`exerted · faltered · voided`) declared |
| CH-r1-9 | M | CURED | §0, §6.2, §6.4, CH-3, S3b | the saint is a 3a carrier and also the 3b multiplicand (M3); ≤ 6 host lines |
| CH-r1-10 | M | CURED | banner, §0, §4.1, §12.4, L7, OD-CH-4, OD-CH-6, CH-1 | registers in RN's ONE PERSON STAGE (no host lines of its own); capture per the re-ruling plus the STOP; OD-CH-4 rewritten as an owner lighting row; S27 made measurable |
| CH-r1-11 | M | CURED | §14, §2.2, OD-CH-28 | a call is known by presence, by a telling's arrival, or by a `BeliefRecord` band; truth only in the omniscient arm |
| CH-r1-12 | M | CURED | §2.2b, P2 `calling`, §17, S28, OD-CH-22 | one deed per stay in the calling; a deed-rate pin |
| CH-r1-13 | M | CURED | §13, P2 `turned`, §18, S16, OD-CH-23 | the living `turned` field carries the turn; `authored.polarity` is never rewritten by the engine; `holds` is the default on any advance longer than a week |
| CH-r1-14 | M | CURED | CH21, §7, §9, §18, S30, OD-CH-21 | every engine-made villain hire is covert |
| CH-r1-15 | M | CURED | P1 `renown`, §2.2b, §3, S31 | `legend_recorded` minted once at introduction through RN's `mintDeed`; it decays on `a_decade` |
| CH-r1-16 | M | CURED | §6.2, §0, CH-3, S32 | the peace seam `readWarPeaceDecision` (M11), ≤ 2 lines; frozen hosts untouched |
| CH-r1-17 | M | CURED | §3 CH-0c, CH15, §10, OD-CH-12 | slot beside CH-0b, the owner's hand, on the 200_deity migration pattern; read through the creed's `declared` baseline |
| CH-r1-18 | M | CURED | CH3, §3, CH-0, L1 | the removal stays in `npcDmVerbs.js`; the anchored negative is widened to `src/domain/paragon` (M7) |
| CH-r1-19 | M | CURED | §4.4, §0 | every personality word is read from its own axis (M5) |
| CH-r1-20 | M | CURED | §11, OD-CH-13, S12 | harbouring writes a `fealty_defied` row through `applyRelationshipPatch` (PL §4.6's road); CH writes no deference patch of its own |
| CH-r1-21 | M | CURED | §6.2, §14, §18 | `menace_siege` words; CH's terms registered in MN's DECLARED seams (MN §5.2 draw bias ±0.05; §5.5 `menaceCounterTerms` ±0.10, cured by D-MN this round) |
| CH-r1-22 | M | CURED | §6.1, §24 | every reason names the paragon and its calling |
| CH-r1-23 | M | CURED | §4.5, CH18, S5 | `bearingWord` over canon world points (H5); aspatial "these lands" or the DM's region name |
| CH-r1-24 | M | CURED | §2.4, S2, S29, OD-CH-25 | 15 readers, each with a declared arm, plus a census pin (M8) |
| CH-r1-25 | m | CURED | §6.3 | latency per seam (M12) |
| CH-r1-26 | m | CURED | §6.1, CH-3 | ten gates plus the import; war's birth rows light with CH-3 |
| CH-r1-27 | m | CURED | §13 | `stand_off` removed; `indecisive` written provisionally (SEAMS-r1-19 STOP) |
| CH-r1-28 | m | CURED | P1, §0, §7, CH-0 | M6 |
| CH-r1-29 | m | CURED | §9 road 2, P3, CH-7 | ES confirm/refute subject kind `paragon_employer` |
| CH-r1-30 | m | CURED | §4.1, §9, CH-1 | RN's mount must thread `settlementUpdates` (a requirement on RN-1's car-0) |
| CH-r1-31 | m | CURED | §21 L1/L2 | the normalizer is shape-only; receipts come from the pass's weekly check |
| CH-r1-32 | m | CURED | §13, S9 | a duel needs leans that oppose on the same target |
| CH-r1-33 | m | CURED | §11, §19 | `renownLeansEnabled` |
| SEAMS-r1-1 | B | ⛔ STOP | §12.4 et al. | §2 above |
| SEAMS-r1-2 | M | CURED | §2.2b, OD-CH-27 | CH's registration table in RN §6.1's three coordinates (`kind01 · law01 · force01`), matching RN's cured sentence |
| SEAMS-r1-3 | M | CURED | §11 Lifted, S11 | PL §5.6's two tails (`previousGovernments` + `seatTransitions`); the DM's KILL/ASSIGN card offers the pardon |
| SEAMS-r1-4 | M | CURED | CH12, §11, §18 | the BENCH proclaims bans and the WATCH keeps the town's gate (RN §5.2 `actingOfficer`) |
| SEAMS-r1-5 | M | CURED | CH12, §2.2, §11, §2.3 | one leaf `gateDefault` with person and party arms; thresholds stated once; one meaning of `enemy_in_service` |
| SEAMS-r1-9 | M | CURED | P1, §3, §10 | authored relations are `declared` band baselines; RN widened `declared` this round (RN §5: "any `REGARD_BANDS` word") |
| SEAMS-r1-12 | M | CURED | CH9, §5, §7, §11 | PL minted `crownReachAt(worldState, snapshot, rootId, memberId, observerId) → { share01, liegeId, tier }` this round; CH reads `share01 > 0` |
| SEAMS-r1-13 | M | CURED | §6.1, §6.2, §14 | MN's declared warden terms; a menace's pressure is a warden's call only where they are lit |
| SEAMS-r1-14 | M | CURED | §14 | an answered call is never closed by the answer |
| SEAMS-r1-16 | M | CURED | §0, CH8, §5 | CH's statement: the loop stays callerless |
| SEAMS-r1-18 | M | CURED | §14 | calls keyed by stressor id; CH depends on MN-2 keeping the id, pinned across a lift |
| SEAMS-r1-19 | m | ⛔ STOP | §13, §2.3, §18 | §2 above |
| SEAMS-r1-21 | m | CURED | §6.2, CH-3 | one shared leaf per seam with a joint cap (the fold row is the FOLD's) |
| SEAMS-r1-22 | m | CURED | §2.3, §11 | `polity_ban`, `opposed_creed`, `let_be`; `expelled` reused in its landed meaning; three words registered |
| SEAMS-r1-24 | m | CURED | §6.2 faith | CH's three faith carriers named for PL §14.7 |
| SEAMS-r1-25 | m | CURED | §7, §18, §6.2 | `stand_by`; `menace_siege` |
| HOST-r1-2 | B | CURED (CH side) | CH18, §5, §6.2, §19 | both arms held; on map-module worlds the spatial arm is the default (H22); the birth-canon entitlement is the owner's row, which is the FOLD's to write |
| HOST-r1-3 | M | CURED | CH19, §5, OD-CH-26 | the piece is an H17 presentation mover (law 6: presence, not intention; covert fails closed) |
| HOST-r1-5 | M | CURED | §2.3, CH12, §11, §24 | "the town's gate" and "stressor gate"; warden, realm, hold, lens and prosperity registered |
| HOST-r1-6 | M | CURED | §18 | WHERE column (ENC-HL-13); `site` arm slotted |
| HOST-r1-8 | M | CURED | §0, §6.2, §24 | M4; the reason sentence is now true |
| HOST-r1-16 | M | CURED | §0, §7 | `prosperityRank01` (M13) |

## 4. REFINED (beyond the findings; each marked `[REFINED 2026-10-18 (fp-final r1) — …]` in the volume)

1. P1 gains `creedRef`: the faith calling's creed, needed by the 3a carrier and the gate. P1 also gains `renown` (part of CH-r1-15's cure).
2. The authoring pool is the landed eight alignments. There is no `chaotic_good` until the host document's alignment-16 cure lands (OD-CH-29).
3. The bound paragon's reading of RULINGS-ROUND1 CH-r1-3: it moves on its own leg inside its lands and takes the court's errand only abroad, so a bound magistrate still answers a member town's call while errands are dark. This is vetoable.
4. `expelled` is reused in its landed meaning, not renamed.
5. A `frayed` hold gives the polity ban no gate weight and writes no fealty row.
6. The DM's KILL/ASSIGN card offers "lift this court's bans", mirroring PL's STOP-2 "ask the vassals".

## 5. CROSS-VOLUME REQUESTS (routed; not CH's to write)

- **RN:** (a) RN-1's ONE PERSON STAGE mount must thread `settlementUpdates` to both returns (CH-r1-30). (b) RN-0's telling arm (`renown/deedTelling.js`) should take a closed list of registered telling sources, CH's leak source among them; if it refuses, CH costs ≤ 3 lines in `rumorNetwork.js`. (c) The `paragon_act` block takes CH §2.2b's coordinates as they stand; RN already says "CH SUPPLIES its values". (d) `projectScope` must accept a `legend_recorded` deed whose significance is set from the authored `renown`.
- **PL:** register the fealty-record episode prefix `polity_ban:<wnpcId>:<banTick>` for CH's harbouring row, which reaches the fealty record through `applyRelationshipPatch`. PL §4.6 says the polity module mints fealty rows, so CH minting one through the same road needs PL's word. Also name the one shared two-tail seat-change leaf that CH and PT cite (§5.6).
- **MN:** change `wilds` to `wildland` in MN §5.2 and §5.5 ("a `wilds` paragon"). The domain value is `wildland` because `wilds` is a landed biome display literal (`biomeTexture.js`). Also keep a driven stressor's id on release (SEAMS-r1-18).
- **PT:** cite CH's `gateDefault` and its thresholds (`staunch`+ refused, `shaky` watch, `frayed` no weight). PT §9.2 currently says "`admitted_under_watch` below" `staunch`, which disagrees at `frayed`. Also apply the same never-closed-by-an-answer rule to requests (SEAMS-r1-14).
- **ES:** one confirm/refute subject kind `paragon_employer` (C1).
- **FOLD:** bracket §3.4 `banished_found` (`seized` withdrawn pending STOP SEAMS-r1-1; verdicts `expelled · let_be`) and `champion_duel` (`indecisive`, pending STOP SEAMS-r1-19). Add §5 rows for `polity_ban`, `opposed_creed`, `let_be`, `exerted · faltered · voided`, `legend_recorded`, `termsBand`, `neverLine`, `secretKind`, and the map register words. Add the §3.1 shared-seam row (SEAMS-r1-21). Fold §2's CH row should drop "W-H3 wander loop … CH is its first consumer" (SEAMS-r1-16, -23). Write the HOST-r1-2 owner row.

## 6. OPEN QUESTIONS FOR THE CHAIR

1. Rule on the two STOPs above.
2. Is the bound-paragon reading in REFINED 3 the intended reading of RULINGS-ROUND1 CH-r1-3? If not, a bound paragon is immobile without errands, which means in every world until OD-FC-39's unit lights.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED by read or execution at `81f1cd963`: M1–M15 (the custody row's errand and encounter requirement, the leg exports, the two faith sites, care's two terms, the axis words, the vocabularies, the removal pin, the 15 ledger readers, the treasury signature, the blowback's non-idempotence, the peace decision line, the kernel order, the prosperity ladder, the token census and the host counts). Also CONFIRMED by quoting their current text: MN's declared warden terms, PL's `crownReachAt`, and RN's widened `declared` and `paragon_act` block. PLAUSIBLE: that the peace decision runs only under `peaceEngineEnabled` ∧ `warTerminationEnabled`; the pact and peace latency; that the interception stage meets an errand row carrying a covert sub-record (S27); that RN's telling arm can take a registration. Every one is named for a car-0, and none is upgraded.
