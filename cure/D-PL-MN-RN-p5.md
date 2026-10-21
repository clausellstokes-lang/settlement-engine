# D-PL-MN-RN-p5 — the P5c dispositions of THE COMPLETENESS CRITIC's findings over PL · MN · RN (chair 6eb7b5b6, Fable 5.1; seat Opus 5.5; begun 2026-10-20 15:03 CDT)

Inputs: `assessments/P5-COMPLETENESS-2026-10-20.md` (the PL · MN · RN ids), `briefs/RULINGS-P5.md` ADDENDUM §C (C.1 · C.3 · C.12 · C.14 · C.15 · C.16 · C.17 · C.20 · C.22 · C.24 · C.25), the census rows (`assessments/WIRING-CENSUS-2026-10-20.md`), the rulings trace §4 (routes 2 · 3 · 4 · 5). Order: PL → MN → RN, one at a time. Status (2026-10-20 ~15:5x CDT): **PL CLOSED (all PL ids disposed in PL §16's P5 block). MN and RN NOT STARTED** — the seat reached its ~300k-token stop after PL (whole-volume reads of PL ≈ 390 KB); §6 below is the successor's exact list, with the receipts already measured. No MN or RN text was touched.

## 1. MEASURED FIRST
**PL (closed 15:4x CDT).** Read PL whole §0–§5.7, §7–§10, §15 and the §16 tail; §11–§14 read at the rows touched (P53–P55, OD-PL-29/33/34/56–59) and searched for every token this lane changed (no hit left stale but quoted history). Master `81f1cd963` (read-only), CONFIRMED by read:
- m1 `warCapacityReads.js :: isBesieged` — `return warFrontsInto(graph, id).length > 0;`: the war's siege has NO record of its own, so the only record living from docketing to resolution is the `siege` engagement's held-docket row (SP-9) → `liegeAnswers` sits there (WC-PL-36).
- m2 `convergence.js` header — "[JUDGMENT — war-gated, not belief-gated: an intervention is a PHYSICAL military operation …]": governs the march, not whom a court backs (WC-PL-93).
- m3 `relationshipRulesCore.js` — `const rebellionActive = activeRebellionAgainstVassal(ctx.snapshot, vassalId);` and the stressor `type: "rebellion"` (`world_stressor.rebellion.<vassalId>.<tick>`): the public sign of strain.
- m4 `beliefMap.js :: readBeliefRelationship` — "the declared relationship is public"; the record holds observer↔subject labels only → no belief of a third pair exists.
- m5 `domain/events/drainQueuedEvents.js :: drainQueuedEvents` returns `{ updates, twinDirectives, partyImpacts, refusals, drainedCount }`; its `if (event?.partyCaused) {` branch is the field-on-event idiom; `src/domain/intent/opVocabulary.js` lists `'KILL_NPC', … 'ASSIGN_NPC_TO_ROLE', 'KILL_LEADER'` (WC-PL-73's hook).
- m6 token probe `D-PL-MN-RN-p5-probe/tokens.sh` → `tokens-pl.out`: `liegeAnswers` · `askVassals` · `openFealtyAsk` · `fealtyAsks` · `press01` 0 in master src/tests/docs and the ledger docs; `passage_of_arms` · `polity_circle` · `APPOINT_TO_SEAT` · `seat_change` 0 src · 0 tests (design docs only); 0 quoted `'ask:` in master `src`.
- m7 `supply_raid`: 0 in master src (probe) and WC (census); `concludedWarRecord.js` = the close-road census of ENDED wars (PL §0 row) → the harm read is DARK, not re-pointed (WC-PL-39).
- m8 the sibling volumes carry 0 `fp-final P5` brackets at 15:03 CDT (no killed predecessor's work to keep).

## 2. THE RECORD (id · sev · disposition · where · receipt)
### PL
| id | sev | disposition | where (PL) | receipt |
|---|---|---|---|---|
| P5C-3 (WC-PL-100 · WC-PS-44) | MAJOR | CURED | §2 · §3.2 row · §3.4 call site · P56 · OD-PL-61 | PS l.130 PS14 "the new precedence class `passage_of_arms` (PL §3's table gains the row, the chair's at P4)"; fold l.908 "`passage_of_arms` (PL's precedence class)"; PL l.136 eight classes (before) |
| C.1 (P5C-1, PL's one-line cite; WC-PL-23) | MAJOR | CURED (PL's half) | §3.4 · §9 HOOKS · PL-3 | RULINGS-P5 C.1; PL l.210/424/435 "owned by the first chain to land" (before) |
| P5C-24 (WC-RN-10) | MINOR | CURED | §9 PL-8 · P59 | RN l.241 slot `seat_change` "PL (its fealty-question trigger read) · C9"; PL 0 hits (before) |
| P5C-15 (WC-PL-93) | MINOR | CURED | §15.2 · OD-PL-29 · §9 HOOKS · P60 | m2 · m3 · m4; OD-PL-29 "resentment ≥ DRAFT 0.5" (before) |
| P5C-17 (WC-ST-42, PL's word) | MINOR | CURED (reading vetoable) | §4.7 F.6 (b) (iii) · §15.6 · §15.9 · §4.9 · §8 · §10 · P58 | ST l.309 "PL registers the incident word in its own commit"; PL §15.9's r5 bracket (A.8 re-homed `riders_quartered` to shape 3) |
| P5C-12 (WC-PL-70) | MINOR | CURED | §5.4 · §5.5 · §10 ↳ row · §2 census · OD-PL-34 | PL l.318 "ends it in a `truce` mark" with no §10 row (before) |
| P5C-20 · WC-PL-19 | MINOR | CURED | PL12 · PL-0 · P61 | PL-0 "No consumer" and `polityOf` pure (before) |
| P5C-20 · WC-PL-27 | MINOR | CURED (DARK until the fold's W-COIN slot) | §3 compromises · PL-5 | `scutage` 0 outside PL (census) |
| P5C-20 · WC-PL-29 | MINOR | CURED (DARK until the fold's GRAMMAR slot) | §3 compromises | `commuted` 0 outside PL (census) |
| P5C-20 · WC-PL-36 | MINOR | CURED (OWNER-VISIBLE field) | §4.3 · OD-PL-60 | m1; MN l.158 `pactAnswers` idiom |
| P5C-20 · WC-PL-39 | MINOR | CURED (arm DARK) | §4.3 (3)(b) | m7 |
| P5C-20 · WC-PL-73 | MINOR | CURED (OWNER-VISIBLE field) | §5.6 · §9 verbs · P57 · OD-PL-60 | m5 |

## 3. STOPs
None for PL. (One reading the chair may veto, not a STOP: C.17's "adds it to §15.9's closed list" is applied in the word's CURRENT home — shape 3's `riders_quartered` row, garrison arm (iii) — because RULINGS-ROUND5 A.8 re-homed the word out of §15.9 to keep one pricing; adding it back to the weave list would price the crown's men on a lord's ground twice where the weave is lit and nowhere where it is dark.)

## 4. REFINED
- PL-8's `seat_change` door reads EVERY settlement, sworn or not (a town outside any polity changes hands too); PLAUSIBLE on cost until PL-8's car-0.
- PL12's proposal naming narrowed to the DM's `SWEAR_FEALTY` card; engine subjugations (auto-applied, no proposal) are named by the stage's receipt.
- The garrison arm (iii) shares the sweep's episode when the holder is the root (one row a season for one fact); a member-held fief writes nothing; a `hollow` garrison writes nothing.
- The KILL/ASSIGN `ask:` rows are not epoch-bearing (so an ask never re-asks itself).

## 5. ROUTED (halves this lane cannot write; one line each)
1. **D-FOLD-p5 — fold §5 l.772** `PRECEDENCE_CLASSES`: widen to NINE, inserting `passage_of_arms` after `trade_abroad` (C.3; PL §2's list order).
2. **D-FOLD-p5 — the spine, SP-9's held-docket row**: register PL's declared sub-field `liegeAnswers?: { [relieverId]: { answer: 'sent'|'kept', tick, by: 'default'|'dm' } }` on the war `siege` engagement's row (PL §4.3, OD-PL-60, OWNER-VISIBLE).
3. **D-FOLD-p5 — fold §3.1 INBOX**: one W-COIN row (a member→liege payment, scutage) and one GRAMMAR row (the commuted-dues charter term) — C.20; PL marks both DARK until carried.
4. **D-PS-ST-PR-p5 — ST l.309 (ST12, §4.4)**: re-word "PL's sworn-edge writer records it as a typed decaying incident … PL registers the incident word" → "PL's `riders_quartered` ROW, its garrison arm (PL §4.7 F.6 (b) (iii)): one row a season with its resentment patch, never a weave incident; ST names the occasion — a site held by a lord above the member on its chain, attached `at_hand`, garrisoned above `hollow`, at the season's end".
5. **D-PS-ST-PR-p5 — PS l.130 (PS14)**: "(PL §3's table gains the row, the chair's at P4)" → "(PL §2 and §3.2's ninth class, P5)"; PS §4.3 may cite PL §3.4's call-site row.
6. **D-FOLD-p5 — the register pass (C.12)**: copy PL §2's new P5 token row (`passage_of_arms` · `liegeAnswers` · `askVassals` · `openFealtyAsk` · `fealtyAsks` · `ask:` · the garrison episode form · `polity_circle` · `APPOINT_TO_SEAT` · `truce` · `seat_change`).
7. **The chair — ODQ §934.93 P5 addendum**: OD-PL-60's two OWNER-VISIBLE fields (`liegeAnswers`, `askVassals`) and OD-PL-61's C.17 reading as VISIBLE rows.
8. **RN (this lane's own, pending — §6)**: RN l.241's `seat_change` slot row cites PL §9 PL-8's door.

## 6. WHAT IS LEFT — the successor seat's exact list (MN, then RN; read each WHOLE first; append a P5 block to each CURE RECORD; brackets `[CURED 2026-10-20 (fp-final P5) — <id>: …]`)
**MN (`docs/DESIGN_FP_ARCH_MN.md`, 944 lines, ~357 KB)**
- **P5C-14 · WC-MN-57** — MN l.541 M12 "`abroad` two weeks per hop" is a second unpriced-leg law beside master `namedPersonTransit.js` `UNPRICED_LEG_WEEKS: 1` (reused by `routeNetworkConsumersTransit.js` l.97/148): read the landed constant, or declare a multiple on the FP-46 roster, UNMEASURED (C.14).
- **P5C-14 · WC-MN-100** — rename `pressTally[id].danger01` (MN l.158 shape · l.193 · l.229) → `press01` (FREE: 0·0·0·0, `D-PL-MN-RN-p5-probe/tokens-pl.out`; master `routeNetworkCharterDanger.js` l.183 `danger01` is a caravan route's danger); add the nine keys `roamAnchorId` · `regroupUntil` · `drives` · `raisedBy` · `headAtStart` · `menace_press` · `menaceSiegeVerdict` · `menaceBattleOutcome` · `menaceRoamPick` to MN §3.4's token table so D-FOLD-p5 copies it (C.12, C.14).
- **P5C-16** — WC-MN-34 (MN-4's Alignment line proposes `lawfulness01`/`malice01` for PL's relief decider "as an inbox row"; PL 0): PL's decider is `reliefAnswerOf` (PL §4.3) — MN cites the fold's PL INBOX row (D-FOLD-p5) or strikes to "PL's decider's landed reads" (PL's Alignment line: "a merciful liege (the landed `moralityBand`) leans `sent`"); WC-MN-38/40 → cite the fold's POP (`unprotected`) and HB (protection read) INBOX rows; WC-MN-39 EC's route-disruption row STRUCK (C.16: the danger term already reaches shipments); WC-MN-54 COMMIT THE FORCE (MN §5.6) — measure master `deploymentReturn.js :: deploymentReturnOutcomes` (l.327) as the loss's writer, else mark the booking DARK with a WC slot.
- **P5C-15 (WC-PS-64 / WC-ST-31, MN side)** — MN5's composer (`embattlement.js :: advanceEmbattlement`, fold §3.3.16 ↳ (1), TRUTH) takes NO belief selection: the feeder rows select by truth (PS: the witnessed `armed_incursion` crossing), the belief read moves to the chooser.
- **ROUTED-UNAPPLIED (C.25; rulings trace §4 routes 2–3)** — add the INFORMER and the AT-HAND WITNESS to `recordSighting`'s caller list (MN §3.1; 0 `informer` in MN); KEEP the `RAISE_MENACE` dial's `a␟b` (`COURSE_TARGET_SEP`, B.2 / P5R-n1) and cite the fold's A.14 bracket ("`␟` is only the landed dial separator").
- **C.1** — MN-4's `menaceAtHome` term and the hostile-pair damper (MN §4.6 · §4.8) cite WAR CIRCULATION's owned `WC-car-0 THE CHOOSER'S SIGNAL CAR` (cut before EC-17); strike any "first to land" phrasing.
- Cross-check while in MN: MN §4.7's relief text against PL §4.3's new `liegeAnswers` bracket (MN's `pactAnswers` stays MN's for the menace siege; PL said so).

**RN (`docs/DESIGN_FP_ARCH_RN.md`, 1,014 lines, ~360 KB)**
- **P5C-14 · WC-RN-50** — `REGARD_CAUSES` (RN l.206) APPENDS CH's `paid_well · sheltered · slandered` through CH's registration row (CH l.535; RN's §14 normalizer otherwise drops them); CH cites (D-CH-p5).
- **P5C-15 · WC-RN-49** — the refused-pair rule (RN l.176: `s:`/`c:` pairs; l.170 `f:<settlementId>:<factionId>` "authored/DM only") gains `f:`×`f:` with reason `pair_state`: a DM-authored faction→faction regard is refused by the writer; master `factionPairLedger.js` (`worldState.factionPairStates`) is the one home.
- **P5C-22** — strike RN l.413's IN clause ("IN's exposure (C1)"; IN has 0 `party`).
- **ROUTED-UNAPPLIED (C.25; routes 4–5)** — `fought` widened to a LED HUNT's `beaten` close, target the court (OD-BD-60, ruled by delegation in BD; RN now says the close "is BD's to register under `body_act` or to rule none"); the quarter acts' receipt `quarter:<bodyId>:<tick>` (path (b); 0 in RN).
- **P5C-24 (RN side)** — RN l.241's `seat_change` slot row cites PL §9 PL-8's door (source `seat_change`, `sourceEventRef` the new episode key, kinds = the landed causes, gate `renownEnabled` ∧ `politySuccessionEnabled`); `war_concluded` (l.242) stays the generals' C4 door (D-BRACKETS-p5 + the fold).

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED: every master symbol quoted in §1 (read at `81f1cd963`), the token census (executed, `D-PL-MN-RN-p5-probe/tokens-pl.out`), and every PL edit (each applied by a unique-anchor script that asserted exactly one match; 37 `fp-final P5` brackets now in PL). PLAUSIBLE, and marked so in PL: the `seat_change` door's per-settlement read cost, the drain-to-slice path for `fealtyAsks` before the pulse, the rebellion stressor as a publicly seen state, and `truce`'s reader (conditional on fallback (B), never written under (A′)). Nothing was executed against the engine; no test was run; no git.
