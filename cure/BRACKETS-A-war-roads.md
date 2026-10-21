# BRACKETS-A-war-roads — P6c BRACKETS lane A (chair 6eb7b5b6, Fable 5.1; seat Opus 5.5; 2026-10-20)

ONE writer, INSERTIONS-ONLY, in sequence over: WC · WY · ES · IN · GR · GENERALS · POP · W-SEAT · INT · EP · LG · SP (`/Users/cstokes/Desktop/settlement-engine/docs/`). Every bracket reads `[ADDED 2026-10-20 (fp-final P6c; <route id or ruling>) — …]`, carries the route's TEXT and cites the owning volume's section. Insertion method: python scripts under the scratchpad (`bra/ins_<vol>.py`) that assert each anchor unique and insert NEW lines only (no existing line is edited), so the proof target is `git diff --numstat 8a3061070 -- <file>` deletions = 0 relative to the file's pre-lane state (each file's pre-lane numstat is recorded below, since P5 lanes had already edited several files since 8a3061070).

## 0. INPUTS READ
README (RESUME BLOCK 3 + laws) · BOARD (last lines) · RESEARCH-COMMON · COMPILE-COMMON · DISPOSE · RULINGS-P6 WHOLE (§A–§G) · RULINGS-P5 ADDENDUM C.25, §D.1–D.8 · the chair's draft `p6c-routes-draft.md` · ROUTES of cure/D-OP-r1..r3 (r1 has no ROUTED section: its routes are RULINGS-P6 §C's and OP §15's coupling rows) · D-MG-r1..r3 · D-WS-r1..r3 · D-FS-r1..r3 · D-MN-RN-p5b-p5 · L-CH-PD · D-BD-p5b-p5 (+ BD §19.0e) · D-FOLD-p5 route 3 (the WC-car-0 text) · fold §3.1.23 ↳ P5 and §3.1.24.

## 1. MEASUREMENTS (placement)
- M1 WR-7d's slot (RULINGS-P6 E.7): `grep -c WR-7d DESIGN_FP_ARCH_WC.md` = 0; `DESIGN_WAR_RULINGS_ARCHITECTURE.md` carries it (master `81f1cd963` docs: l.1140 "**WR-7d — RANSOM + THE COMPROMISED ENVOY (O, Q).**", l.1164 "WR-7d's EVALUATORS landed 2026-08-03; its PULSE WIRING is owed") — that file is ABSENT from the ledger working tree (a tracked file shown deleted in the stale checkout) and is NOT in this lane's ownership ⇒ COULD-NOT-PLACE (text for the chair in §4). ES carries WR-7d only as an inherited gate (ES l.1096, l.1585, l.1832) ⇒ ES takes OP §15's ES-row cite only.
- M2 D-5 (`roads/thirdPartyRansom.js`): owner volume `DESIGN_DEEP_COUPLINGS.md` (l.30 "| 4 | generosity×roads — THIRD-PARTY RANSOM … | D-5 |"); GR carries `thirdPartyRansom.js` ONLY as one of five readers of `defensive_pact` edges (GR §2b V-18 l.193) — GR does not own it ⇒ OP's D-5 route COULD-NOT-PLACE.
- M3 the roads kernel's owner (`roadsKernel.js` early-release car-0, S-2): `DESIGN_THE_ROADS.md` (not owned); WY/GR/EP cite `roadsKernel.js` as substrate only ⇒ COULD-NOT-PLACE.
- M4 the W-DOCTRINE owners (A.8; D-WS-r1 WC route): master `src/domain/worldPulse/supplyWebWarfare.js` header "W-DOCTRINE-1: SUPPLY-WEB WARFARE (the indirect-war doctrine — DESIGN_SUPPLY_WEB_WARFARE.md)"; `corruptionWeb.js` "W-DOCTRINE-3b: THE FOREIGN LANES (DESIGN_CORRUPTION_WEB.md …)"; `corruptionLeash.js` "THE RESOLVER CHOKEPOINT (W-DOCTRINE-3 §1)" — CONFIRMED by read.
- M5 the code seams named in the WC routes, read at master: `disposition.js :: computeAggressiveness` (l.253 `export function computeAggressiveness(item, worldState, opts = {})`) and the private `personalityDrive` (l.161); `treatyEnforcement.js :: treatyBlocksWar` (l.117, exported); `warHomeCosts.js :: applyHomeWarCosts` "const room = Math.max(0, homePop - WAR_CONSCRIPT_POP_FLOOR);"; `deploymentReturn.js :: deploymentReturnOutcomes` "const conscripted = Math.max(0, deployedPopulation - leviedTotal);" — CONFIRMED by read.
- M6 EDITOR/EM: `DESIGN_FP_ARCH_EDITOR.md` does not exist in the ledger; EP carries the editor notes (the brief) ⇒ EDITOR routes land in EP.
- M7 POP routes name `DESIGN_FP_POPULATIONS.md` POP-2 · `DESIGN_FP_ARCH_POP.md`; only the latter is owned ⇒ placed in ARCH_POP.
- Process note: two read-only git calls beyond numstat were made while measuring M1 (`git status --porcelain` and `git ls-files` on three doc paths); nothing was written to git.

## 2. PROGRESS (saved as the lane goes)
### WC — DONE (16:5x CDT): 10 insertion sites, 19 new lines, 0 lines changed (pre-lane P5 brackets: 2; P6: 0 — none duplicated)
Proof: `diff pre/DESIGN_FP_ARCH_WC.md docs/DESIGN_FP_ARCH_WC.md | grep -c '^<'` = 0 (pure additions) · `git diff --numstat 8a3061070 -- docs/DESIGN_FP_ARCH_WC.md` = `21	1` (pre-lane `2	1`: the one deletion is the P5 lane's in-place amendment, restated intact in its added line — not this lane's).
| # | route | where (after) |
|---|---|---|
| WC-1 | D.4 · MG-r1-9 · D-MG-r2/r3 WC (Arc A fifth; `holdWingAtContact`; held set; losses seam; the wing arrival reader) | l.96 (the `armies_meet` (Arc A) kinds line) |
| WC-2 | A.4 · MG-r1-8 (Arc A's contact a UNIT-sighting producer; the shadowing question) | same block |
| WC-3 | A.6 · MG-r1-14 (the lie-in-wait lean, WC's one constant on PS-V2's car, ≤ `modest`) | same block |
| WC-4 | D-MG-r2 WC (l.1223's MG sentence re-read) | l.1223 (P5W-3 bracket) |
| WC-5 | B.2 · MG-r1-3 (the wing's deployment debit — OWNER ROW) | §1.4.1 after the blocks[] shape |
| WC-6 | D-MG-r1 WC (the wing in WC-11's counts-mover manifest) | §WC-11 heading |
| WC-7 | P5 D.7 + C.1 (`WC-car-0 THE CHOOSER'S SIGNAL CAR`, new wave row) | before ## ARC A |
| WC-8 | WS-r1-1 · D.5 · E.1 · D-WS-r1/r2/r3 (the way's HOST term on the car; no re-consumption) | WC-car-0 block |
| WC-9 | A.8 · D-WS-r1 (`computeAggressiveness` the personality seam; `aggressionTermsOf`) | WC-car-0 block |
| WC-10 | B.2 · MG-r1-11 (`column:` takes MG's `army` row at WC-6) | §7.A.8 |
| WC-11 | WS-r1-7 · B.3 (the silent levy) | §4.4 levy bullet |
| WC-12 | E.2 · G.4 · D-WS-r2/r3 (`conscriptionRoomOf` room only; `conscriptedShareOf`) | §4.4 deploymentReturn bullet |
| WC-13 | WS-r1-3 · D-WS-r1/r2/r3 (withdrawal closer no threshold; P4 by foe; `treatyBlocksWar` CONFIRMED) | §4.4 warTermination bullet |
| WC-14 | D-FS-r2 + r3 WC (WR-4 home front, cite only, attacker's) | same |
| WC-15 | A.8 · D-WS-r1 WC (W-DOCTRINE-1/3/3b owners named, measured M4) | same |
| WC-16 | B.2 · S-MG-1 (engine-read arms composition — OWNER ROW) | §6 end |
NOT PLACED IN WC: E.7 / D-OP-r2 / D-OP-r3 "THE WAR VOLUME (WR-7d's slot)" → could-not-place (M1); D-MN-RN-p5b route 1 (COMMIT THE FORCE's retire) → the fold INBOX (P7) per the brief. ROUTED TO P7 BY THIS LANE: the fold §3.1.23 ↳ P5 claimant list gains WS's `way` HOST term as an EIGHTH registrant (WC-8).
(WC follow-up: six §4.4/§7.A.8 brackets indented to stay inside their list/code block — still pure additions vs pre.)
### WY — DONE: 3 sites, 4 new lines (pre-lane P5 brackets: 4; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `8	2` (pre `4	2`; the 2 deletions are P5's in-place amendments, not this lane's).
| WY-1 | A.6 · OD-MG-15 ⭐ · MG-r1-2 · D-MG-r1 WY (the `horse` MODE row; measure the hop-week distribution first; the ratio's line per pricer: `livedLegTicks` · `planWanderLeg` · PR's detachment leg; the rung-word note) | §1a item 2 (one mode-speed table) |
| WY-2 | A.6 · D-MG-r1/r2 WY/OP (a rider's access proposal: `trail` walks, `wild`/`way` barred) | same |
| WY-3 | A.6 · MG-r1-1 · D-MG-r1 WY (ONE `forced` pace row, land and sea, WY-8a's consumption; the convoy's horse capacity slot with TR) | WY-8 (8a) bracket line |
| WY-4 | §C WY (the two owner-signed tuning rows) + NOTED: RULINGS-P5 A.3's trail option ALREADY CARRIED by P5 (E1 l.1073, l.1110) — not duplicated | §8 tuning surface |
### ES — DONE: 6 sites, 13 new lines (pre-lane P5 brackets: 3; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `16	1` (pre `3	1`).
| ES-1 | V-ALL-p5b fail · P5 D.3 (b) · BD §19.0e (l.1585's two false claims CORRECTED: master re-normalizes on every read and write, the `errandId` dedupe erases errand-less captives; `captiveId` + flag-blind normalizer declared as ES-2b's build step, the owner's, visible) | after ES-2b (l.1585) |
| ES-2 | B.1 (S-7 · OD-OP-23: custody → rescue; the court-carried `host_settlement` writer; `caught_spying`) | same |
| ES-3 | D.2 · D-OP-r2 ES (the occupied-town arm of `legalEncounterVenue`, occupier = actor = `captorId`) | same |
| ES-4 | §C ES (`catchChance01`'s optional `custody01`; the escape close a tell; nothing in the dwell set) | end of §3.3 |
| ES-5 | A.4 · MG-r1-8 · D-MG-r1 ES (ES a declared UNIT-sighting producer; the three products stay closed; MG names the rooted dwell) | end of §3.6 |
| ES-6 | D.1 · E.7 · OP §15 ES row (WR-7d's persisted demand's ARRIVAL is the home's lawful road; the slot itself routed to the chair) | end of §3.10 |
| ES-7 | §C ES · B.1 (`slackTicks` — the owner's, visible; presence-only until minted) | §5 new row 14 |
| ES-8 | A.4 (MG/MN seam) | §5 new row 15 |
| ES-9 | WS-r1-10 · D-WS-r1 ES (the C12 errand-kind input named at ES's unit; `foreignGripOf` confirmed as `way_subversion`'s carrier) | §5 new row 16 + the count note (16 at P7) |
SKIPPED per the brief: L-CH-PD route 4 (the `secret_faith` confirm subject kind — a fold row, P7).
### IN — DONE: 3 sites, 4 new lines (pre P5: 1; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `5	0` (pre `1	0`).
| IN-1 | D.3 (STOP-C-IN ruled) · OP-r1-10 · OP-V1 (`processLies` self-bluff, carrier = `spokespersonNpcId` by `rosterKeyOf`; IN-0a's take reader admits a carried bluff, IN's marker the owner's, visible; third-court carried plant a SLOT; `commissionedPlantAt` untouched) | IN-0a (after its FIRST-VISIBLE line) |
| IN-2 | D-MG-r1 IN (the riding courier's one bounded lean on the delivery clock; WY's `horse` ratio) | IN-4 (after the P5W-4 bracket) |
| IN-3 | §C IN · D.3 (seam row: OP → `processLies`/IN-0a) | §5 item 6 |
| IN-4 | WS-r1-11 · D-WS-r1 IN (a believed carrier of a foe's rot for `seat_rotting`, or DARK) | §5 item 7 |
### GR — DONE: 1 site, 2 new lines (pre P5: 1; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `3	1` (pre `1	1`).
| GR-1 | §C GR · OP §15 GR/SP-D2 (the debtor court's reception lean toward `receive`, one bounded lean, on the landed `rescue_relief` obligation) | §6 seam 10 |
| GR-2 | WS-r1-16 · D-WS-r1 GR/FOLD (the §3.1.24 joint leaf on `reserve01` admits WS third, after RN and CH, under the one joint cap) | §6 seam 11 |
MEASURED (the brief's "GR carries thirdPartyRansom? measure"): GR names `thirdPartyRansom.js` ONCE, as one of five READERS of `defensive_pact` edges (§2b V-18); it does not own D-5 (`DESIGN_DEEP_COUPLINGS.md` does) ⇒ OP's D-5 route could-not-place (§4).
### GENERALS — DONE: 2 sites, 4 new lines (pre P5: 2; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `6	2` (pre `2	2`).
| GEN-1 | WS-r1-3 · A.2 · B.3 · D-WS-r1/r2/r3 C4 ((ii)'s threshold = the gate's verdict band; harassment rides `WITHDRAW_SHIFT` only once C4 rules; `wayPriorOf(…, foeId, tick)`; G13 registers against `conquestMarchOrder`) | after G2 |
| GEN-2 | A.2 · B.3 (WS-S3) · §C · D-MG-r1 WS · D-WS-r3 C4 (C4's leaf the commander arm; the general enters once; TRANSPARENT to C1/C2/C6, replacing ×1; the `personalityDrive` confirmation, OD-WS-35) | after G2 |
| GEN-3 | P5 D.1 (C.24) · D-MN-RN-p5b route 3 (the general's OWN `war_won` deed keyed `<warId>:general`) | after U4 (its P5 bracket) |
### POP (`DESIGN_FP_ARCH_POP.md`) — DONE: 1 site (end of POP-2), 6 new lines (pre P5: 1; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `7	0` (pre `1	0`).
| POP-1 | B.4 (FS-r1-3) · D-FS-r1 POP (`input(settlement, ctx)`, `ctx = { rules }`; `commonsGrievance01` threads `opts.rules`; FS's one `exaction` row) |
| POP-2 | B.4 (FS-r1-5 · OD-FS-9) · D-FS-r1/r2 (answer arm suppressed for `hand`; precedence plan → hand → emigration; only `hand` a hearing; a DM `set-levy` never a target) |
| POP-3 | D.8 · E.8 · G.5 · FS-Vm3 · D-FS-r1→r2→r3 (time-based completion; the dip once per refused season whose first-week answer keeps a raise standing; a standing riot ⇒ `custom`) |
| POP-4 | FS-V3 · E.8 · D-FS-r3 (the target ref climbs to `riot`) |
| POP-5 | FS-V4 · E.9 · D-FS-r3 + OD-FS-6 (the `commons_answered` timing; the `exaction` ledger kind, the owner's, visible) |
| POP-6 | B.4 · OD-FS-11 (the burden push driver — OWNER ROW, the chair recommends yes, not decided) |
(`DESIGN_FP_POPULATIONS.md` is not owned — the POP-2 text routed there by D-FS lanes is carried in ARCH_POP only; P7 may mirror it.)
### W-SEAT (`DESIGN_W_SEAT.md`) — DONE: 2 sites, 3 new lines (pre P5: 0; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `3	0` (pre: no diff).
| SEAT-1 | B.4 (FS-r1-3) · D-FS-r1 W-SEAT (`participation01` passes `{ rules: worldState.simulationRules }`; dark-after-lit pin; no `pHold`) | after F4 |
| SEAT-2 | B.4 · FS-r1-13 · D-FS-r1 stressor lane (the `wartime` row's reason words; ×1.25 = OD-FS-13 (c), the owner's) | after D4 |
### INT — DONE: 1 site, 1 new line (pre P5: 1; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `2	0` (pre `1	0`).
| INT-1 | B.4 (FS-r1-11) · D-FS-r1 INT (the `fiscal_raise` · `fiscal_remit` row on `blocDecisionFactor`, DRAFT pulls in FS §3.1, [0.7, 1.3], exactly 1.0 dark; registered at `strategyMoveVocabulary.walker.test.js` MOVE_TOKEN_BRANCHERS; `blocCounsel.js` mints `hand_decision` on an override; INT-3's `*_decision` list gains it; conjunction includes `settlementPoliticsEnabled`) | the CLOSED table's end ("machinery gates emission meanwhile.") |
### EP — DONE, ZERO PLACED (measured; resumed after the usage-limit break, 20:0x CDT). Proof: diff vs pre = 0 lines; numstat `3	0` = the P5 lanes' lines only.
MEASURED (M8, refutes the computed brief's "EP carries the editor notes"): EP is THE ADVANCE EPOCH (title l.1: "DESIGN — THE ADVANCE EPOCH (EP: living futures, immutable pasts)"); `grep -c "pin-fork\|set-levy\|EM-B3\|dmLayer" DESIGN_FP_ARCH_EP.md` = 0; no `set-muster`, no "Answer the commons", no pin catalogue. The Edit Mode program's home is `docs/DESIGN_EDIT_MODE_AND_DECREES.md` (carries `pin-fork`; with `implementation/charters/EDIT-MODE-TRAIN.md` and DESIGN_FP_ARCHITECTURE.md §12 J-EM) — NOT owned by this lane; `DESIGN_FP_ARCH_EDITOR.md` does not exist ⇒ all four EDITOR/EM routes COULD-NOT-PLACE (text in §4).
### LG — DONE: 2 sites, 2 new lines (pre P5: 0; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `2	0` (pre: no diff).
| LG-1 | B.2 (MG-r1-23; S-MG-2 re-scoped) · D-MG-r1 LG (the sea fleet splits along LG-2's sea-mode commitments; LG states whether a `navalTransit` convoy IS an LG-2 sea commitment; until then MG's fleet verbs are `keep_course` · `hold` at a port · `lie_in_wait` = `blockade`; sea re-plan DARK) | after "rebuild speed (§46a addendum)." |
| LG-2 | D-MG-r2 LG (MG REFINED 3: an air fleet's `double_back` · `reroute` · `shadow` are LG-3's own re-plan, banking what LG-4's interception reads) | after "ground-force immunity, trade round-trips." |
### SP — DONE: 1 site, 2 new lines (pre P5: 1; P6: 0). Proof: diff vs pre `^<` = 0 · numstat `3	0` (pre `1	0`).
| SP-1 | §C SP · B.1 · OP OP12 §10 (SP-9 registers `rescue_attempt`: CLIMAX; actor the rescuer upon the JAILER's settlement (`jailerOf`; occupier D.2; hall's lord E.7); WHERE the venue; registry text of record the fold's §3.4, P7) | after the P5C-14 bracket |
| SP-2 | §C SP · B.4 (FS-r1-7) CORRECTED by D.9/E.9 · D-FS-r1 WITHDRAWN by D-FS-r2 · D-FS-r3 FOLD (`tax_refusal` + its seal only: STANDING, ONE actor the SEAT (OD-FS-9 visible), verdicts `remitted · abated · held_firm`; NO resolve-first stage for interior kinds; FS's resolver splits docket-then-resolve in its own module; the verdict reaches the NEXT week's mint; the one-tick lag said) | same |

## 3. FINAL PROOF (20:0x CDT, all twelve files; `git diff --numstat 8a3061070 -- docs/<f>` · `diff pre/<f> docs/<f>` deleted/added lines · P6c bracket count)
WC 21/1 · 0/19 · 16 — WY 8/2 · 0/4 · 4 — ES 16/1 · 0/13 · 10 — IN 5/0 · 0/4 · 4 — GR 3/1 · 0/2 · 2 — GENERALS 6/2 · 0/4 · 3 — POP 7/0 · 0/6 · 6 — W-SEAT 3/0 · 0/3 · 2 — INT 2/0 · 0/1 · 1 — EP 3/0 · 0/0 · 0 — LG 2/0 · 0/2 · 2 — SP 3/0 · 0/2 · 2.
Every numstat deletion (WC 1, WY 2, ES 1, GR 1, GENERALS 2) is a P5 lane's in-place amendment present BEFORE this lane (pre-lane snapshot numstats identical in deletions); this lane deleted 0 lines in every file (diff vs the pre-lane snapshot `bra/pre/` has no `<` line). 52 P6c brackets on 60 new lines.

## 4. COULD-NOT-PLACE (text for the chair; never an invented placement)
1. **THE WAR VOLUME (WR-7d's slot)** — RULINGS-P6 E.7 · D-OP-r2 · D-OP-r3. Slot measured (M1) in `docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md` (master l.1140 WR-7d; absent from the ledger tree; not owned). TEXT: "the persisted ransom claim keeps its `demandLeg` as minted ONCE (`departTick`/`arrivalTick` fixed at the mint, never re-minted), its `claimantId` and `fromId`: OP's home call and carried chance read that arrival" + "its persistence wave lists OP-1 (the carried-detour arm toward a foreign-guest hold) and OP-6 (the envoy arm) as dependants (E.7 Q1)". ES carries only the cite (ES-6).
2. **D-5 (`thirdPartyRansom.js`)** — OP §15 row; owner `DESIGN_DEEP_COUPLINGS.md` (M2); GR is a reader only. TEXT: "`consumeRansomSettlements`; `payerRefuseProbability`; `payerCompromiseProbability` — the `rescue_relief` concatenation (S-3); the two laws reused unchanged".
3. **THE ROADS (the roads car's owner)** — OP §15 row; owner `DESIGN_THE_ROADS.md` (M3). TEXT: "`roadsKernel.js`'s early-release block → `roads/earlyRelease.js` — the car-0 extraction and the `world_rescue` arm (S-2)".
4. **EDITOR/EM (×4)** — owner `DESIGN_EDIT_MODE_AND_DECREES.md` (M8). TEXTS: (a) D-FS-r1: "`set-levy`'s consumer car in `treasury.js`'s per-form loop (with W-COIN) and the field its apply writes on the settlement, at the unfreeze; precedence 'a directed form's band wins; the hand moves the rest'; the 'Answer the commons.' predicate withheld while a `tax_refusal` card stands" — its lift-path clause WITHDRAWN by (b); (b) D-FS-r2: "no FS verdict touches a DM direction (FS-V2); `set-levy`'s consumer car is CUT WITH FS-1 (named at FS-1's car-0); composing `set-levy` at the unfreeze is the owner's (FS OD-FS-24)" (RULINGS-P6 A.7, D.11 Q2); (c) D-FS-r3 (the POP-2 row): "the refused levy supplies the refusal reason to the existing `set-muster`/`set-levy` acts" → "… to the existing `set-muster` act" (FS-Vm1; OD-FS-25); (d) D-WS-r1 (WS-r1-4, A.7): "the pin catalogue row `war_way_deviation` carries the note 'one week, every court's war'; a lasting per-war setting is an owner row".
5. **W-COIN (outside FP; the chair carries)** — (a) D-FS-r1: "the system-level anti-loop pin (rich vs poor court, hand lit) rides FS-1 beside W-COIN's input-level pin (FS-r1-1); H-FS-1 RESTATED as the weekly price's magnitude (FS-r1-8); H-FS-2 unchanged"; (b) D-FS-r2: "confirm the war-layer loop's coffers half (`warCosts.js :: readWarHomeFront` → `warTermination.js`) and run FS §14 row 17 (b)'s lit soak at W-COIN's car-0; confirm the time-based completion needs no mint-shape change (the discrete bands, one band per form per tick)"; (c) D-FS-r3: "re-measure §14 row 31 (e)'s riot-before-completion timing with POP-2's banded refusal threshold and decay tail".

## 5. LEFT FOR P7 (the fold) / SKIPPED BY OWNERSHIP
P7: the fold §3.1.23 ↳ P5 claimant list gains WS's `way` HOST term as an EIGHTH registrant (WC-8) · registry rows `rescue_attempt` and `tax_refusal` (§3.4 text of record; SP-1/SP-2 cite them) · OD-FC-86+ for the VISIBLE rows carried here (the wing's deployment debit; S-MG-1 composition; `slackTicks`; `captiveId` (ES-2b); the IN carried-bluff marker; OD-FS-9/-11/-6/-13(c); WC-car-0's seven registrants) · D-MN-RN-p5b route 1 (WC INBOX retire row) · L-CH-PD route 4 (`secret_faith` confirm subject kind) and W-LIVES. `DESIGN_FP_POPULATIONS.md` POP-2 may mirror ARCH_POP's POP-1..6 (not owned). SKIPPED (other lanes): HB, ST, RN, PS, PR, MN, BD, PT (lane A2); CH, OP l.340 (lane B); OP · MG · WS · FS (D-FOUR-r4).
