# PT — THE CURE RECORD AND THE COMPILE HEADER, moved verbatim from `docs/DESIGN_FP_ARCH_PT.md` at `1beabdc85` by the consolidation pass (P8, lane C-PT, 2026-10-23)

Part 1 is the old header and status block (old lines 3–9); Part 1b is old §20's line of each round's STOPs (old line 640); Part 2 is the old §21 THE CURE RECORD (old lines 648–893). Each part is byte-identical to the text of record (`history/PT-bracketed-1beabdc85.md`); the consolidated volume carries the design, this file carries the trail.

## PART 1 — the old header and status block (old lines 3–9)

## Chair session a73343ed (Fable 5.1); compiled by lane L-PT (Opus 5.5), 2026-10-17, in the FP final architecture program (kit `settlement-engine-kits/fp-final-a73343ed-2026-10-17/`).
## Compiled on the owner's word; DARK behind three virtual flags (`partyEnabled`, `partyEngagementsEnabled`, `partyBackingEnabled`) and their host flags; nothing scheduled.
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the fold.
## `[REFINED 2026-10-17 (fp-final) — …]` brackets mark every refinement below; each is vetoable. The compile log, the measurements, every STOP and the open questions are `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-PT.md` (probes `cure/L-PT-probe/`). Round 1 (2026-10-18, lane D-PT-r1, Opus 5.5) rewrote passages in place: each change carries `[CURED 2026-10-18 (fp-final r1) — <finding id>: …]`, each refinement beyond a finding `[REFINED 2026-10-18 (fp-final r1) — …]`; the log is `cure/D-PT-r1.md` (probes `cure/D-PT-r1-probe/`). Round 2 (2026-10-18, lane D-PT-r2, Opus 5.5) re-cured the round-1 verifier's fails and disposed its new findings in place: each change carries `[CURED 2026-10-18 (fp-final r2) — <id>: …]`, each refinement `[REFINED 2026-10-18 (fp-final r2) — …]`; the log is `cure/D-PT-r2.md` (probes `cure/D-PT-r2-probe/`). Round 2b (2026-10-18, lane D-PT-r2b, Opus 5.5) disposed in place the SEAMS-r2 / HOST-r2 ids routed to PT and the items `briefs/RULINGS-ROUND2b.md` names for PT, with the same bracket form; the log is `cure/D-PT-r2b.md` (probes `cure/D-PT-r2b-probe/`). Round 3a (2026-10-18, lane D-PT-r3, Opus 5.5) disposed in place `skeptic/PT-r2-verify.md` (its one new MAJOR PT-V1 and its six carries), the rows the other `*-r2-verify.md` files route to PT, and every A-row and the PT B-section of `briefs/RULINGS-ROUND3.md`: each change carries `[CURED 2026-10-18 (fp-final r3) — <id>: …]`, each refinement `[REFINED 2026-10-18 (fp-final r3) — …]`; the log is `cure/D-PT-r3.md` (probes `cure/D-PT-r3-probe/`). Round 4a (2026-10-18, lane D-PT-r4, Opus 5.5) disposed in place `skeptic/PT-r3-verify.md` (its two fails — one ROUTED-UNAPPLIED — its new MAJOR and its four minors), every PT-routed row of the round-3 cure files and of `cure/L-BD.md`, and every A-row and the PT B-row of `briefs/RULINGS-ROUND4.md`: each change carries `[CURED 2026-10-18 (fp-final r4) — <id>: …]`, each refinement `[REFINED 2026-10-18 (fp-final r4) — …]`; the log is `cure/D-PT-r4.md` (probes `cure/D-PT-r4-probe/`). Round 5a (2026-10-19, lane D-PT-r5, Opus 5.5) disposed in place `skeptic/PT-r4-verify.md` (its two fails — one ROUTED-UNAPPLIED — its new MAJOR PT-X1 and its seven minors), the ids `skeptic/SEAMS-r4.md` and `skeptic/BD-r4.md` touch on PT, every PT-routed line of the ten `cure/D-*-r4.md`, and the PT rows of `briefs/RULINGS-ROUND5.md` (B.5 · B.15 · B.22): each change carries `[CURED 2026-10-19 (fp-final r5) — <id>: …]`, each refinement `[REFINED 2026-10-19 (fp-final r5) — …]`; the log is `cure/D-PT-r5.md` (probes `cure/D-PT-r5-probe/`). P5 (2026-10-20, lane D-PT-p5, Opus 5.5; chair 6eb7b5b6, Fable 5.1) disposed in place THE COMPLETENESS CRITIC's PT findings (`assessments/P5-COMPLETENESS-2026-10-20.md`: P5C-6 · P5C-7 · P5C-8 · P5C-22 (PT's items) · P5C-13 (WC-PT-95)) under `briefs/RULINGS-P5.md` ADDENDUM §C.6 · C.7 · C.8 · C.13 · C.22: each change carries `[CURED 2026-10-20 (fp-final P5) — <id>: …]`, each refinement `[REFINED 2026-10-20 (fp-final P5) — …]`; the log is `cure/D-PT-p5.md` (probes `cure/D-PT-p5-probe/`).
## P6c (THE BRACKETS, 2026-10-20): ONE CONFIRMING bracket from THE OPPORTUNITY (`party_request` never reads CH's `captive_held` call) applied by lane BRACKETS-A2-program-volumes (Opus 5.5), INSERTIONS-ONLY, at §7.2 and §7.3; every earlier bracket kept; the record is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/BRACKETS-A2-program-volumes.md`.

> **Status: COMPILED DRAFT, P5 DISPOSED (2026-10-20).** P5 (lane D-PT-p5) cured the deadline pledge (P5C-6: `needPlaceOf` gains the DEADLINE arm — the summoning, inviting or offering court's own town — so a yes to a summons, an invitation or an offer that the party could have kept and did not falls short and costs its word; MODELLED, `cure/D-PT-p5-probe/p5Probe.out` A), a yes on an offer (P5C-7: the deed `offer_accepted`, and while an EMPLOYMENT stands the employer is PT2's pre-selected backer inside its reach and the party's backer of record at the town's gate), the backing defaults (P5C-8: `backing_voided` reads the landed pair label THROUGH BELIEF for the three court roles — EXECUTED on master's readers, `p5Probe.out` B — and `backing_repudiated` reads `seatChangedSince`'s `via`), the critic's PT shells (P5C-22: the party bounty's purse band, the gate's posture last heard, the IN clause struck) and the party's label (P5C-13: its readers named) — §21's P5 block; no STOP. **Round 5a (2026-10-19).** Round 5a (lane D-PT-r5) cured PT-X1 (a bounty's hunt is a THRESHOLD clock priced each week to the body's own `where` — `needPlaceOf` — so an accepted bounty the party never rode for can fall short; MODELLED, `cure/D-PT-r5-probe/huntFault.out`), L-BD 33 under B.15 (the bounty request reads the call's own domain; a conclave's is `order`), L-BD 36 under B.22 (BD's route: a way revealed TO the party is PT's own `waysKnown` record, no deed, read by nothing in the world; `party_made_known_trail` names that write), B.5's one deed (the party's claim is `body_ended`) and the verifier's minors — §21's round-r5 block; no STOP. Round 4a (lane D-PT-r4) cured A.8 (`enemy_in_service` is CH's ONE BELIEF READ of the pair label, `at_war_with_employer` CH's `atOpenWar`, P49 pinning both — EXECUTED on master's readers, `cure/D-PT-r4-probe/beliefReadAndRestore.out`), RU-1 (the stage's `regionalGraph` threaded through the pass and every `gateDefault` call), PT-W1 under A.19 (`BAN_PARTY`'s inverse RESTORES the door's prior edge, never "lifts the edges it wrote" — and the court's window rides its `banKeys` row so a later verdict survives the undo: REFINED R4-1, EXECUTED as a model), A.12's six actor kinds, THE BODIES' route (a body met on the DM's road is the road arm's BODY HALF, default "nothing has happened to the party yet"; no body acts toward the party), L-BD 33 (the party hunting a body: a bounty's `party_request`, `party_hunted`'s mirror) and L-BD 36 (the reveal's party half), and the verifier's four minors — §21's round-r4 block; no STOP. Round 3a (lane D-PT-r3) had disposed the round-2b verifier's findings: Round 3a (lane D-PT-r3) cured PT-V1 (a court's seat change lapses ONLY a still-windowed party ban; the DM's indefinite word stands, lifted only by `PARDON_PARTY` — EXECUTED on master's own writers, `cure/D-PT-r3-probe/windowedLapse.out`), the verifier's six carries, and RULINGS-ROUND3's PT rows (A.4 `enemy_in_service` reads the landed pair label; A.7 five actor kinds; A.8 the one ban grammar named apart from `banKeys`; A.11 a court, a person or a corps may voice the party; A.14 the stretch key `stretch:<a|b>`) — §21's round-r3 block; no STOP. Round 2b (lane D-PT-r2b) disposed every id `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md` route to PT — SEAMS-r2-6 (THE CORPS' rows: the edge key `u:<unitKey>`, a company as actor and officer), SEAMS-r2-14 (`party_gate`'s ROAD ARM), HOST-r2-12 (the map's site milestones M-SITE-A / M-SITE-F and the priced journey's canon root) — and the items `briefs/RULINGS-ROUND2b.md` names for PT (STOP-PR-2 RULED (a); the corps keyed `u:<unitKey>`; OD-PT-28 ACCEPTED; H16 the map's inbound door, the host's patrol facts out through the window; `site` a WHERE and a subject, never an actor kind), with the rows the sibling lanes routed here (THE SITES' one clearing act and its court-veil word `made_known`; THE PATROLS' WATCH as a riders' detachment) — §21's round-r2b block; no STOP. Round 2 re-cured the five fails and disposed the four new findings and nine carries of `skeptic/PT-r1-verify.md` under RULINGS-ROUND2 (A.1 the party's credibility is persisted; A.2 the DM's mark replaces the band for every reader that can see it; A.3 one pledge vocabulary, PT's; A.4 a voided or repudiated backing is a correction; B the whereabouts' later stamp) and applied its §E standing items (sites considered §4, patrols considered §13, the host document's slots, the owner's doctrines of 2026-10-18 §0) — §21's round-r2 block. In round 1 every id of `skeptic/PT-r1.md` and the SEAMS-r1 / HOST-r1 ids routed to PT is disposed in §21 THE CURE RECORD under the chair's rulings (the round-1 re-rulings PT-r1-1, -2, -3 and the 05:1x ADDENDUM's `party_voiced` and `seatChangedSince` are executed). The compile's two ⛔ STOPS were RULED by the chair (RULINGS-AFTER-COMPILE): PT-S1 (a road closed by a menace, a war or a DM edit is not read by the one travel physics) has its slot in C7 with the map's route windows as its producer, and PT-S2 (the slander's producer is IN's plant road) has its slot in C1 (§20). PT builds on THE RENOWN (`DESIGN_FP_ARCH_RN.md`: the deed ledger, fame, regard, credibility, inherent value and the two lenses — cited, never re-specified), on THE CHAMPIONS (`DESIGN_FP_ARCH_CH.md`: the call board, the champion's visit, the one town's-gate leaf and the one ban) and on THE POLITY (`DESIGN_FP_ARCH_PL.md`: the crown's reach and the seat-change read). The dispatch gate is the owner's: nothing here builds before the UI + prose release is pushed and deployed; push · merge · deploy · migration · dispatch stay the owner's.

## PART 1b — old §20's line of each round's STOPs (old line 640)

**Round 1 raised NO new STOP.** Every finding was cured or is cured on PT's side with its other half listed for the chair (`cure/D-PT-r1.md` §5). **Round 2 raised NO new STOP** (`cure/D-PT-r2.md` §3); its other halves are listed there (§5). **Round 2b raised NO new STOP** (`cure/D-PT-r2b.md` §3); STOP-PR-2 and OD-PT-28 are RULED (RULINGS-ROUND2b) and executed. **Round 3a raised NO new STOP** (`cure/D-PT-r3.md`). **Round 4a raised NO new STOP** (`cure/D-PT-r4.md`); its other-volume halves are listed there (ROUTES). **Round 5a raised NO new STOP** (`cure/D-PT-r5.md`); its other-volume halves are listed there (§5). **P5 raised NO STOP** (`cure/D-PT-p5.md`); its other-volume halves are listed there (§5 ROUTES: the fold's register pass, RN's two `party_event` lists, RN §7's IN clause, and the ODQ's VISIBLE row for `bounty`).

## PART 2 — the old §21 THE CURE RECORD (old lines 648–893)

## §21 THE CURE RECORD

### Round r1 (P3 round 1, 2026-10-18; lane D-PT-r1, Opus 5.5; the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r1.md`, probes `cure/D-PT-r1-probe/`) — 57 ids: 57 CURED · 0 REFUTED · 0 ⛔ STOP · 0 NOTED

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| PT-r1-1 | BLOCKING | CURED — RULINGS-ROUND1 PT-r1-1 executed: ONE read `whereaboutsOf` (the later of the toggle and the derived `lastHeard`), read by the journey, fault, witnesses, suggestions, the backing default, nearness and the visits | PT3, §2.1, §2.3, §3.2, §4, §8.3, §8.4, §12, P21 |
| PT-r1-2 | BLOCKING | CURED — RULINGS-ROUND1 PT-r1-2 executed through PT's registration rows: the institution deeds key on the target's moral lean (`INSTITUTION_MORAL_LEAN` / `MORAL_INSTITUTION_LEANS`) and the registry's `classifyInstitution`; the orphanage reads villainous; a registration walker (REFINED: the landed `EVENT_TO_PARTY_KIND` cannot take rows without a party-impact kind) | §3.3, §2.4, §0, OD-PT-18, P4, P4b |
| PT-r1-3 | BLOCKING | CURED — RULINGS-ROUND1 PT-r1-3 executed (the `sourceEventRef` lookup, RN §2.1) plus the static skip of rippling types for determinism; the drain's deeds minted where the world is in hand | §3.1, §0, OD-PT-19, P22 |
| PT-r1-4 | MAJOR | CURED — `made_good` by the world's evidence first (`reachedTick`, a placing deed at the need, a deed that resolved the need); the card names the evidence | §8.6, §2.2, PT2, PT10, P26 |
| PT-r1-5 | MAJOR | CURED — `need` typed for every call source (`stressorId` · `siege` · `warKey` · `callSource`); each its threshold; unclockable calls under patience, never broken | §2.2, §8.2, §7.3, P27, P28 |
| PT-r1-6 | MAJOR | CURED — "beyond the clock" only for a DEADLINE; the card's two present facts never compared; "near breaking" struck | §8.2, §8.5, §19 |
| PT-r1-7 | MAJOR | CURED — the leaf-first car `reconcileWorldOnUndo` (the slice shrinks); its party arm strikes deeds by `sourceEventRef` | §3.4, §6, §16, §14, OD-PT-24, P23 |
| PT-r1-8 | MAJOR | CURED (PT's side; RN §2.1/§7's stored holder listed) — credibility and `lastHeard` derived on read from unstruck deeds | §2.1, §4, §6, §16, P18, P24 |
| PT-r1-9 | MAJOR | CURED — `BAN_PARTY` / `PARDON_PARTY` on the key `party` through the one edge writer (measured: it keys by any string); `npcDmVerbs.js` named and untouched | §2.1, §6, §9.3, §14, §0, P25 |
| PT-r1-10 | MAJOR | CURED (PT's side; RN §6.1's sentence listed) — a told reason carries only the DM's marked weight, scaled by belief; the default `spoken` softens nothing unmarked | §11.3, PT13, PT2, §2.1, OD-PT-20, P3, P4, P4b |
| PT-r1-11 | MAJOR | CURED — the backing default keeps only the accepted-request arm (REFINED against chair notes item 3; vetoable) | PT2, §3.2, OD-PT-2, P14 |
| PT-r1-12 | MAJOR | CURED — a correction read as the original with the parts of either telling; a bare one replaces nothing; `contradicts` a typed mark | §11.2, §10.2, §6, P6 |
| PT-r1-13 | MAJOR | CURED — `party_gate` CLIMAX at arrival with CH's words; re-heard only on a posture change (the fold's row is the chair's) | §9.2, §7.3, §13, §2.4, P33 |
| PT-r1-14 | MAJOR | CURED — the void's trigger (first hearing, once per deed), `voidsRef`, the three deed kinds registered with rows | §7.3, §10.3, §2.1, §2.4, §3.3, P34 |
| PT-r1-15 | MAJOR | CURED — strike and amend ride the HEARING SEAL (`struck`; a course word); the store verbs are its UI | PT7, §6, §13, §2.4, P12 |
| PT-r1-16 | MAJOR | CURED (RN's citations listed) — `made_good · fell_short · came_to_nothing` | §2.4, §8.6, §13, OD-PT-21, P7, P8 |
| PT-r1-17 | MAJOR | CURED — MN's fourth dial `party` on `MENACE_MIGHT` / `MENACE_STATE`; the deed at execution in `realmVerbExecution.js` | §3.1, §14, P19 |
| PT-r1-18 | MAJOR | CURED — §19b THE VOICES: seventeen subject rows, the line by parts, the card per kind, the push rule, the walls, the corpus owner | §19b, §0, §2.4, OD-PT-23, P32 |
| PT-r1-19 | MAJOR | CURED — `met_in_person` via `RECORD_MEETING`; CH's stage sets `marks.metParty` from it | §7.3, §6, §3.3, P13 |
| PT-r1-20 | MAJOR | CURED — the kingdom is a holder (`c:<rootId>`, RN §2.2) | PT4, §5 |
| PT-r1-21 | MAJOR | CURED — the court voice carries the governing faction and the crown; only non-governing factions and the creed add voices; the dark arm adds none that duplicate the commons | §9.1, P29 |
| PT-r1-22 | MAJOR | CURED — the size drift is symmetric as landed (EXECUTED); "usually swelling" struck (REFINED against L-PT ruling 10; vetoable) | PT13, §11.1, OD-PT-12 |
| PT-r1-23 | MINOR | CURED — the drain returns `partyEvents`; `drainCampaignQueueIntoState` mints them | §3.1, §0, §14 |
| PT-r1-24 | MINOR | CURED — registered on RN's ONE PERSON STAGE after CH; 0 host lines | §7.1, §14, OD-PT-15 |
| PT-r1-25 | MINOR | CURED — the card and the receipt name the roads priced; long-advance receipts offer a one-click strike | §8.4, §8.6, §13 |
| PT-r1-26 | MINOR | CURED — one pair rule (`actAt` holds both endpoints; the journey from the nearer) | PT3, §2.1, §4 |
| PT-r1-27 | MINOR | CURED — RULINGS-AFTER-RESEARCH §4 cited for the party's edges; the engine-recorded deeds listed truly | PT1, PT6, OD-PT-1 |
| PT-r1-28 | MINOR | CURED — the ambush `awaiting` while the party stays within its reach | PT9, §7.3, §13 |
| PT-r1-29 | MINOR | CURED — destroyed settlements skipped; no `NaN`; the engine still never writes `presentAt` | §16, §2.3, §4, §8.3 |
| PT-r1-30 | MINOR | CURED — TILT declared per kind | §13 |
| PT-r1-31 | MINOR | CURED (IN's half listed) — one take, one hearing | §13, §20 |
| PT-r1-32 | MINOR | CURED — a fixed seed and path, with the EXECUTED rate as an envelope | §17 P5, §11.1 |
| PT-r1-33 | MINOR | CURED — the chain weight is PL's `crownReachAt`, PL5 cited | §10.1 |
| PT-r1-34 | MINOR | CURED — `visitPurpose`; a bound paragon presses PT's families; the ordinary person's visit struck | §7.3, §2.2, §2.4 |
| PT-r1-35 | MINOR | CURED — the pool passed as `degradeTelling`'s fourth argument | §11.1, §14 |
| PT-r1-36 | MINOR | CURED — all three flags premium | §14 |
| PT-r1-37 | MINOR | CURED — the call's `band`; the requester is the court of the call's settlement | §7.2, §7.3 |
| SEAMS-r1-3 | MAJOR | CURED (PT's half; PL names the read) — `seatChangedSince` for repudiation and a court's own pardon; the KILL/ASSIGN card | §7.3, §9.3 |
| SEAMS-r1-4 | MAJOR | CURED — the BENCH decides `party_banned`; the WATCH keeps the town's gate | §7.3, §9.2, §9.3 |
| SEAMS-r1-5 | MAJOR | CURED — CH's one leaf `gateDefault` with the party arm; one ladder, one reason vocabulary | §9.2, §7.3 |
| SEAMS-r1-6 | MAJOR | CURED — the chair's ruling executed: `party_voiced` (CLIMAX, `spoken · withheld`, default `spoken`); "condemnation" renamed counter-backing | PT5, PT6, PT12, §7.3, §10.3, §13, OD-PT-22, P31 |
| SEAMS-r1-7 | MAJOR | CURED — RN's pledge reading and `MISS_FALL` cited | PT10, §8.6, P8 |
| SEAMS-r1-8 | MAJOR | CURED — RN's `sourceEventRef` read; the action carries the event id | §3.1, §0 |
| SEAMS-r1-10 | MAJOR | CURED — PT §10.2's term is the one carrier of a backing (RN struck its row shift) | §10.2, PT12 |
| SEAMS-r1-11 | MAJOR | CURED — the closed `backerRole` beside the plain actor ref; RN §2.2 maps each role | §2.1, §2.4, §10.1 |
| SEAMS-r1-12 | MAJOR | CURED — PL's one `crownReachAt` for the crown's backing weight, the court's crown voice and the town's-gate ban | §10.1, §9.1, §9.2 |
| SEAMS-r1-14 | MAJOR | CURED — a request closes only by its need's own state; a paragon at work is a reason | PT11, §7.2, §19 |
| SEAMS-r1-15 | MAJOR | CURED (PT's half; the fold's rows the chair's) — the head unit RN-0 + PT-0; RN-2 before PT-1/PT-2 | §15, OD-PT-17 |
| SEAMS-r1-18 | MAJOR | CURED — the pledge across a menace's release (MN keeps the id) | §8.2, P30 |
| SEAMS-r1-20 | MINOR | CURED — the anchor rule per kind | §13, §7.3 |
| SEAMS-r1-22 | MINOR | CURED — `honoured` → `upheld`; every `party_event` kind listed | §2.4, §10.3, §13 |
| HOST-r1-2 | BLOCKING | CURED (PT's half; the spine/fold brackets are the chair's) — "canonized ≠ premium"; the priced journey the default on a born canon; PT's paid tier the simulator's | §0, §8.3, §14 |
| HOST-r1-3 | MAJOR | CURED — the party's piece an H17 presentation mover, the host-map layer the interim mirror | §4, §12, PT17 |
| HOST-r1-5 | MAJOR | CURED — "the town's gate", never bare; "hold" and "lens" never PT words; "known" registered | PT18, PT8, §2.4, §9.2, §19 |
| HOST-r1-6 | MAJOR | CURED — the WHERE column on every PT row | §13, §2.2 |
| HOST-r1-9 | MAJOR | CURED — the players' known places are the host's record, written by its reveal; PT writes none; `site` presence and ENC-HL-04 when the world-site record lands | §4, PT17, §2.4 |
| HOST-r1-10 | MAJOR | CURED — PT-S1's producers named (H12, H15); the card names the roads priced and offers the DM's amend | §8.4, §20, PT17 |

### Round r2 (P3 round 2, 2026-10-18; lane D-PT-r2, Opus 5.5; input `skeptic/PT-r1-verify.md` + RULINGS-ROUND2's PT routes; the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r2.md`, probes `cure/D-PT-r2-probe/`) — 25 ids: 18 CURED · 0 REFUTED · 0 ⛔ STOP · 7 NOTED

The verifier's nine unnumbered "round-2 carries" are given ids `PT-r1v-c1` … `PT-r1v-c9` in its order; RULINGS-ROUND2's routes that need no PT change are listed as NOTED; §E's standing items as `R2-E-*`.

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| PT-r1-1 | BLOCKING (verify FAIL) | CURED — RULINGS-ROUND2 B: the LATER STAMP (tick, `partySeq`) decides; a same-tick tie no sequence settles goes to the deed. REFINED on B's letter (vetoable): the party's own sequence orders a toggle the DM sets AFTER a same-session deed, which B's tie rule alone would lose | PT3, §2.1, §2.2, §2.3, §3.1, §4, OD-PT-3, OD-PT-27, P21 |
| PT-r1-8 | MAJOR (verify FAIL) | CURED — RULINGS-ROUND2 A.1: credibility PERSISTED as RN §7's holder, the party door its writer; a strike, unstrike or undo RE-FOLDS it exactly from the deed ledger | §0, §2.1, PT4, §5, §6, §16, OD-PT-4, P18, P24 |
| PT-r1-10 | MAJOR (verify FAIL) | CURED — RULINGS-ROUND2 A.2: the mark REPLACES the derived band for every hearer that can see it (its version shows the reason); round 1's belief scaling withdrawn, as RN's round 2 withdrew it (RN-V5(c)) | §11.3, §11.2, PT13, §2.1, the answer paragraph, OD-PT-20, P3, P38 |
| PT-r1-14 | MAJOR (verify FAIL) | CURED — RULINGS-ROUND2 A.4: the void and the repudiation are CORRECTIONS (`correctsRef`) riding RN's one re-read; `voidsRef` struck | §10.3, §3.1, §3.3, §2.1, PT6, §15, §16, OD-PT-5, P34 |
| PT-r1-16 | MAJOR (verify FAIL) | CURED — RULINGS-ROUND2 A.3 rules ONE vocabulary, PT's `made_good · fell_short`; PT's text was already that, RN aligns (bracketed) | §2.4 |
| PT-V1 | MAJOR (new) | CURED — `reachedTick` counts presence only at an evaluation after the answer's tick; a relief deed after the answer counts; a deed merely targeting the town does not | §8.6, §2.2, OD-PT-9, P26, P35 |
| PT-V2 | MAJOR (new) | CURED — the mark moves `kind01` alone; `law01` and `force01` stay the act's own | §11.3, P36 |
| PT-V3 | MAJOR (new) | CURED — RN-3 precedes PT-1 and PT-2; PT's §3.3 rows register at RN-3's unit; PT-0 does not wait; the owner-row wait the verifier asked about is moot — RULINGS-ROUND2 B (RN, HOST-r1-7) struck RN-3's lighting gate | §15, §3.3, §14, OD-PT-17 |
| PT-V4 | MAJOR (new) | CURED — the governing faction's AUTHORED band speaks as its own voice at its share; its derived regard stays inside the court's | §9.1, P29, P37 |
| PT-r1v-c1 | carry | CURED — `MARK_DEED` after mint mints a correction; the deed is never rewritten (RN2) | §6, §3.3, §16, OD-PT-29, P40 |
| PT-r1v-c2 | carry | CURED — a destroyed need's town ends the clock and the pledge is judged, never closed free | §8.2, §16, OD-PT-9, P39 |
| PT-r1v-c3 | carry | CURED — `settlement` is the registry's place word; MN's words are `country · road` | §13 |
| PT-r1v-c4 | carry | CURED — "lens one/two" registered as RN's design prose; `lens` is never a PT token or DM word | §2.4 |
| PT-r1v-c5 | carry | NOTED — RN's normalizer and `mintDeed` owe PT's fields `actAt`, `backerRole`, `partySeq` (RN's half) | §20 (1) |
| PT-r1v-c6 | carry | NOTED — RN's stale text (§3.1's `party_event` row; §5.5/§11's STOP SEAMS-r1-6) is RN's half | §20 (1) |
| PT-r1v-c7 | carry | CURED (PT's side) — PL now names `seatChangedSince` (PL-V3); PT takes its signature and tick form; CH's `met_in_person` reader stays CH's half | §7.3, §9.3, §10.3, §20 (4) |
| PT-r1v-c8 | carry | NOTED — the fold's §3.4 party rows are P4's | §20 (2) |
| PT-r1v-c9 | carry | NOTED as a DECISION POINT — the source event's undo strikes the deed but the party impact's world outcomes stand, as on master; the receipt says so | §6, OD-PT-28, P42 |
| R2-A.5 | routed | NOTED — PT's `party_voiced` hearing already comes first; `voiced_regard` mints at `spoken` | §7.3, §13 |
| R2-A.6 | routed | NOTED — PT's five `BACKER_ROLES` already | §2.1, §2.4 |
| R2-A.13 | routed | NOTED — PT's WHERE placement already the registry's | §13 |
| R2-E-sites | standing | CURED — ONE "sites considered" bracket (ST's coverage row) | §4 (+ §2.4, §3.3, §13, §19b, OD-PT-30, P41) |
| R2-E-patrols | standing | CURED — ONE "patrols considered" line (PR items 5, 13, 15, 18; STOP-PR-2 left to the chair) [STOP-PR-2 ruled and executed in round 2b] | §13, §8.3 |
| R2-E-host | standing | CURED — plague-R7's quarantine slot at the town's gate; patrols map-only until H16 [superseded in round 2b: the host's patrol facts go out through the window and H16 stays untouched — RULINGS-ROUND2b HOST-r2-5, §13] | §9.2, §13 |
| R2-E-doctrines | standing | CURED — the owner's doctrines of 2026-10-18 bracketed | §0 |

### Round r2b (P3 round 2b, 2026-10-18; lane D-PT-r2b, Opus 5.5; inputs: the ids `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md` route to PT, the items `briefs/RULINGS-ROUND2b.md` names for PT (with its ADDENDUM), and the rows the sibling round-2 logs route to PT; the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r2b.md`, probes `cure/D-PT-r2b-probe/`) — 14 ids: 11 CURED · 0 REFUTED · 0 ⛔ STOP · 3 NOTED

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| SEAMS-r2-6 | MAJOR | CURED — THE CORPS' rows on PT's side: the widening's key grammar gains a corps' `u:<unitKey>` (CH writes its edges; zero host lines); a corps may be an engagement's actor (its own `visit_party`) or `officer` (retained); `RECORD_MEETING` takes a company; `corps` on the actor convention, `site` never an actor kind | §0, §2.1 shape 3, §2.2, §2.4, §6, §7.3, §14, §16, P44, OD-PT-6, OD-PT-31 |
| SEAMS-r2-14 | MINOR | CURED — `party_gate`'s ROAD ARM (with CH's road arm for persons): a third court's riders who noticed the party on the road the DM's move crossed; CH's words; at most one road card per move | §9.2, §7.3, §13, §2.2, §2.4, §14, §15, §19, §19b, P43, OD-PT-10, OD-PT-32 |
| HOST-r2-12 | MAJOR | CURED (PT's half) — M-SITE-A cited for the reach and reveal doors (and M-SITE-F for the statuses); the priced journey's canon root H2 → H7, H5 + H7 + H8 + H12 → H22; five host cites re-pointed to the newest document's lines | PT17, §4, §8.3, §14, OD-PT-25 |
| RULINGS-ROUND2b STOP-PR-2 | — | CURED — RULED (a) executed: `party_gate` widened to a road WHERE, no new kind, CH's words unchanged | as SEAMS-r2-14 |
| RULINGS-ROUND2b SEAMS-r2-6 | — | CURED — the corps keyed `u:<unitKey>` in PT's rows | as SEAMS-r2-6 |
| RULINGS-ROUND2b OD-PT-28 | — | CURED — ACCEPTED and recorded: undo strikes the deed, the world effects stay as on master; the reversing road CLOSED (new capability, the owner's to ask for) | §6, OD-PT-28, P42, §20 |
| RULINGS-ROUND2b HOST-r2-5 (`cure/D-PL-r2b.md` §5 item 3; `cure/D-PR-r2.md` §5) | — | CURED — "opens H16" struck: the host's patrol facts go out through the events window (H9) and the lens window (H23); H16, the map's inbound door, untouched | §13, §21 r2 row |
| RULINGS-ROUND2b ADDENDUM ST-r2-14 | — | CURED — `site` is a WHERE kind and a subject, never an actor kind; a site deed's target is the anchor with a `siteId` qualifier | §4 (1)/(3), §0, §2.2, §13, OD-PT-30 |
| `cure/D-ST-r2.md` route (ST-r2-19) | — | CURED — the party's clearing is ONE act through PT's door (`RECORD_CLEARING` → ST's one writer); one undo for both | §4 (2), §6, P41, OD-PT-30 |
| `cure/D-ST-r2.md` route (HOST-r2-19) | — | CURED — the court veil's word: the reveal deed is `party_made_known_site`; `revealed` is never a PT token | §2.4, §3.3, §4, §19b, OD-PT-30 |
| `cure/D-PR-r2.md` route (PR-r2-13) | — | CURED — the WATCH of a warrant or an ambush on a road IS a detachment of the court's riders (PR19); the hearing stays PT's | §7.3, §2.2, §13, OD-PT-32 |
| `cure/D-CH-r2b.md` §5 item 2 | — | NOTED — PT's corps edge arm, cured under SEAMS-r2-6 | §2.1 shape 3 |
| `cure/D-RN-r2b.md` | — | NOTED — RN routes nothing to PT; RN cured PT's three round-2 halves (§20 (1) updated) | §20 |
| the FOLD parenthetical (`cure/D-MN-r2.md`, `cure/D-PT-r2.md` "ROUTE to the chair / fold") | — | NOTED — the fold lane's notes; no PT row | — |

REFINED in round 2b (each marked in place, vetoable): R2b-1 `banKeys` (a court's pardon by PL's exact key form, CH's rule) · R2b-2 the season and the sea on the landed law · R2b-3 `presentAt.fromIds` · R2b-4 `RECORD_CLEARING` · R2b-5 the road WHERE as PR's ONE STRETCH KEY.

### Round r3 (P3 round 3a, 2026-10-18; lane D-PT-r3, Opus 5.5; inputs: `skeptic/PT-r2-verify.md` (its new finding, its carries and its PLAUSIBLE note), the rows the eight other `skeptic/*-r2-verify.md` files route to PT, every A-row and the PT B-section of `briefs/RULINGS-ROUND3.md`, and the rows the round-3a sibling lanes route to PT; the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r3.md`, probes `cure/D-PT-r3-probe/`) — 37 ids: 18 CURED · 0 REFUTED · 0 ⛔ STOP · 19 NOTED

The verifier's six unnumbered carries are given ids `PT-r2v-c1` … `PT-r2v-c6` in its order; its PLAUSIBLE note `PT-r2v-p`.

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| PT-V1 | MAJOR (new) | CURED — a seat change lapses ONLY a still-windowed edge; an indefinite edge (the DM's, alone or after the strictest-wins merge) is lifted only by `PARDON_PARTY`, its key inert; RE-RUN of the convicting probe and the cured rule on master's writers (`windowedLapse.out` E · A–D) | §9.3, §2.1, §16, OD-PT-6, P46 |
| PT-r2v-c1 | carry | CURED (PT's cite) — RN's deed target gains `siteId` (RULINGS-ROUND3 B for RN); PT mints none | §4 (1), §20 (1) |
| PT-r2v-c2 | carry | CURED — §20 (4) closed: CH names `met_in_person` (CH L3, §16) | §20 (4) |
| PT-r2v-c3 | carry | CURED — the EDITOR's counterparty "court, person or corps" | §15 |
| PT-r2v-c4 | carry | CURED — "a warrant served on a road" struck; a warrant stands at the court's town (PR19 agrees) | §7.3 |
| PT-r2v-c5 | carry | CURED — the cap counts WINDOWED keys only, the oldest evicts; an indefinite door's key outside the cap (`windowedLapse.out` F); REFINED R3-1 one key per door | §2.1, §16, P47 |
| PT-r2v-c6 | carry | CURED — "the reveal" has ONE meaning, `party_made_known_site` (ST cites it); the one-act question stays open | §20 (5) |
| PT-r2v-p | PLAUSIBLE note | NOTED — the road arm's traversal stays PLAUSIBLE until PT-6's first measurement | §9.2 |
| SEAMS-r2-11 (CH verifier: "PT reuses the one meaning") | MAJOR (routed) | CURED — A.4: `enemy_in_service` reads the landed pair state (`hostile`, as the court believes it: `beliefMap.js :: readBeliefRelationship`); war reached first as `at_war_with_employer` | §9.2, P49 |
| CH-r2v minor ("until it lands", CH §11) | minor (routed) | NOTED — CH's text; PT's corps edge arm stands (§2.1 shape 3) | — |
| FOLD-V3 | MAJOR (fold's) | NOTED — PT's side holds: `party_made_known_site` is PT's token (§2.4); the fold's row is P4's | §2.4 |
| FOLD-V4 | MAJOR (fold's) | NOTED — PT's OD-PT-17 and §15 already say RN-3 carries no lighting gate | §15, OD-PT-17 |
| FOLD minor (`party_stopped`) | minor (fold's) | NOTED — 0 hits in PT; no such kind (STOP-PR-2) | — |
| RN-V2 (the swapped `doerRef`) | MAJOR (routed) | CURED (PT's cite) — RN's heard pass re-reads on (`ver`, `mag`, `doerRef`); a swapped doer moves the one term | §11.1 |
| RN-V6 | MAJOR (PS's) | NOTED — PT claims no court fame (0 hits) | — |
| RN minor (PT §7.3's voice "a person") | minor (routed) | CURED — A.11: "a court, a person or a corps" | §7.3, §13, §14, §15, §19b, PT5, §0, OD-PT-22, P48 |
| RN minor (the fold's `party_voiced` trigger "a court") | minor (routed) | CURED (PT's side) — A.11's court arm; the fold's bracket is P4's | §7.3, P48 |
| ST-r2v note 6 (`party_cleared_site` in ST §2.5) | minor (ST's) | NOTED — ST's census | — |
| the verifiers' holds citing PT (CH l.10 · PR l.6 · RN l.21/25/26/30/32/40 · ST l.27) | — | NOTED — no PT change | — |
| A.1 the keep's garrison | ruling | NOTED — no PT text (0 hits) | — |
| A.2 the hold helper | ruling | NOTED — no PT text | — |
| A.3 the presence composer | ruling | NOTED — no PT text | — |
| A.4 a court's feeling for a court | ruling | CURED — as SEAMS-r2-11 | §9.2 |
| A.5 the fealty row families | ruling | NOTED — PT writes no fealty row | — |
| A.6 the liege's `sent` | ruling | NOTED — no PT text | — |
| A.7 five actor kinds | ruling | CURED — `settlement · person · party · menace · corps`, the menace rationale; `site` never | §0 |
| A.8 one ban grammar | ruling | CURED — `banKeys` registered apart from `polity_ban:<subjectKey>:<banTick>`; PT names no ban episode | §2.4 |
| A.9 `settlementFundingBand` | ruling | NOTED — no PT text | — |
| A.10 the readiness words | ruling | NOTED — no PT text | — |
| A.11 `party_voiced`'s voice | ruling | CURED — as the RN minors | §7.3 … P48 |
| A.12 `believedWhereabouts` | ruling | NOTED — PT has its own `whereaboutsOf` (the party), never a paragon's | — |
| A.13 a sea waypoint ends no leg | ruling | NOTED — PT plans no legs; the journey prices hops and the road arm skips sea hops | §8.3, §9.2 |
| A.14 the pair key | ruling | CURED — the minted `a␟b` → PR's `stretch:` key on the digest's pair form (two sites, §2.2 and §13); the sea-hop test `classifyLegModes` | §2.2, §13, §9.2 |
| A.15 `paragonLean` | ruling | NOTED — no PT text | — |
| `cure/D-PL-r3.md` route (the ban grammar) | routed | CURED — as A.8 | §2.4 |
| `cure/D-PR-r3.md` route (strike the warrant on a road) | routed | CURED — as PT-r2v-c4 | §7.3 |
| `cure/D-ST-r3.md` route (the reveal; its Q3) | routed | NOTED — ST says the same; the one-act question is the chair's | §20 (5) |

REFINED in round 3a (marked in place, vetoable): R3-1 one `banKeys` key per door, the newer episode replacing.

### Round r4 (P3 round 4a, 2026-10-18; lane D-PT-r4, Opus 5.5; inputs: `skeptic/PT-r3-verify.md` (its two fails — one ROUTED-UNAPPLIED — its new MAJOR and its four minors), `skeptic/SEAMS-r3.md`'s ROUTES ("PT: —"), every PT-routed line of the nine `cure/D-*-r3.md` and of `cure/L-BD.md` §4, and every A-row and the PT B-row of `briefs/RULINGS-ROUND4.md`; the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r4.md`, probes `cure/D-PT-r4-probe/`) — 35 ids: 19 CURED · 0 REFUTED · 0 ⛔ STOP · 16 NOTED

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| SEAMS-r2-11 · A.4 (FAIL) | MAJOR | CURED per RULINGS-ROUND4 A.8 — `enemy_in_service` is CH's ONE BELIEF READ (`readBeliefRelationship(court, served, ws, relationshipTypeBetween(graph, …)) === 'hostile'`), quoted, never restated; `at_war_with_employer` CH's `atOpenWar`, read first; EXECUTED as a model (`beliefReadAndRestore.out` A8) | §9.2, P49 |
| RU-1 (FAIL · ROUTED-UNAPPLIED; `cure/D-CH-r3.md` §5 PT item 2) | MAJOR (routed) | CURED — the stage's `regionalGraph` threaded through `advancePartyEngagements` and every `gateDefault` call (§7.3, §9.2, the road arm) and the siege clock's `liveSieges`; zero host lines (the stage's host already receives it, M2) | §7.1, §7.3, §9.2, P49 |
| PT-W1 | MAJOR (new) | CURED per A.19 — `BAN_PARTY`'s token stores each touched door's PRIOR edge and its inverse RESTORES it; `PARDON_PARTY`'s inverse re-writes edges and `banKeys` rows; REFINED R4-1 the court's window on its key; the conviction RE-RUN byte-identical, the cure MODELLED exact (A–F) | §6, §2.1, §9.3, §16, OD-PT-6, P50, P51 |
| m1 (c4's residue) | minor | CURED — the warrant struck from the road WATCH at §13 and OD-PT-32 | §13, OD-PT-32 |
| m2 | minor | CURED — "CH §11 states the same rule" → CH ADOPTS PT's three clauses (RULINGS-ROUND4 B, CH RU-3) | §9.3 |
| m3 | minor | CURED — `banKeys` "≤ 8 WINDOWED keys, one per door" at §9.3 (and the shape with `untilTick`) | §9.3 |
| m4 | minor | CURED — a REFINED bracket marks the departure from RULINGS-ROUND3 A.8's letter (seat-episode keys, PL's measured route) | §9.3 |
| SEAMS-r3 ROUTES ("PT: —") | — | NOTED — nothing routed to PT | — |
| `cure/D-CH-r3.md` §5 PT item 1 (the `hostile` label) | routed | CURED — superseded by A.8: the label, through belief | §9.2 |
| `cure/D-CH-r3.md` §5 PT item 2 | routed | CURED — = RU-1 | §7.1 … |
| `cure/D-PL-r3.md` §5 PT (the ban grammar) | routed | NOTED — holds (the verifier: §2.4); m4 marks the letter | §2.4, §9.3 |
| `cure/D-PR-r3.md` §5 PT (the warrant on a road) | routed | CURED — l.287 held; its residue at §13 / OD-PT-32 is m1 | §13 |
| `cure/L-BD.md` §4 PT (THE BODIES' route) | routed | CURED — the road arm's BODY HALF (the body's own `where`, truth as physics; default `passed`, "nothing has happened to the party yet"; one card per move; the meeting's words, REFINED R4-2); no body acts toward the party (BD15) | §9.2, §7.3, §2.4, §13, §14, §15, §19, §19b, OD-PT-33, P52 |
| L-BD 33 (the party hunting a body) | owner item | CURED — a bounty on a NAMED body is a request source: `need: { bodyId }`, PATIENCE only, never `fell_short`, `made_good` by `body_ended` — `party_hunted`'s mirror; the deed rides BD's `END_BODY` `party` dial (REFINED R4-3) | §7.2, §8.2, §8.6, §3.1, §3.3, §2.2, §2.4, P53 |
| L-BD 36 (the reveal verb's party half) | owner item | CURED — a trail revealed TO the party is the host's known-places record; the party's discovery TOLD to a town rides `TRAIL_KNOWN`'s `party` dial → `party_made_known_trail`, whose telling teaches no town the way | §3.1, §2.4, §3.3, P54 |
| A.1 · A.2 (the `unopposed` arm; the mint) | ruling | NOTED — 0 PT hits (`unopposed`, `liegeAnswer`, `reliefAnswerOf`) | — |
| A.3 (the cult word) | ruling | CURED (PT's word) — "an untied band" → THE BODIES' gang or beast; a conclave's shrine cleared is AMBIGUOUS; REFINED R4-4 (`IMPOSE_CULT` AMBIGUOUS, never shameful on its face) | §3.3, §19b, P41, P55 |
| A.4 · A.5 (readiness words; field force) | ruling | NOTED — 0 PT hits (`readiness01`, `homeDefense`, `siteDefense`) | — |
| A.6 (the den occasion's two outcomes) | ruling | NOTED — the party's clearing writes ST's `cleared` through ST's one writer (§4 (2)); ST closes the occasion; no PT text | §4 |
| A.7 (THE BANNER) · A.9 (the findings seed) · A.10 (`paragonLean`) · A.11 (the hold helper) | ruling | NOTED — 0 PT hits | — |
| A.8 (ONE belief read) | ruling | CURED — as SEAMS-r2-11 | §9.2, P49 |
| A.12 (six actor kinds) | ruling | CURED — §0's row says six; a body is never PT's actor (§2.2, §15 EDITOR) | §0, §2.2, §15 |
| A.13 · A.14 (`menace_met`; the war-refusal receipt) | ruling | NOTED — 0 PT hits | — |
| A.15 (a court's voice reads the hearer's relation) | ruling | CURED (PT's cite) — "exactly as `party_slander` does" → RN §5.5's court arm with A.15's relation factor; PT restates no arithmetic | §7.3 |
| A.16 (the veil) | ruling | CURED (PT's half, REFINED R4-5) — a party deed at a kept-secret site never names the site in its telling | §4 (6), P56 |
| A.17 · A.18 · A.20 (one belief of might; two at-hand courts; the holder tuple) | ruling | NOTED — 0 PT hits (`seenBy`, `wantSince`, `fundingSet`) | — |
| A.19 (the prior edge restored) | ruling | CURED — as PT-W1 | §6 … |

REFINED in round 4a (marked in place, vetoable): R4-1 the court's window on its `banKeys` row · R4-2 the body half's meeting words · R4-3 the `party` dials on BD's verbs · R4-4 `IMPOSE_CULT` AMBIGUOUS · R4-5 the veil on the party's site tellings · m4 marked.

### Round r5 (P3 round 5a, 2026-10-19; lane D-PT-r5, Opus 5.5; inputs: `skeptic/PT-r4-verify.md` (its two fails — one ROUTED-UNAPPLIED — its new MAJOR PT-X1 and its seven minors m1–m7), the ids `skeptic/SEAMS-r4.md` touches on PT (its ROUTES: "PT: —", SEAMS-r4-5 and -7 as cites; SEAMS-r4-6 PT's executed case on CH's side) and `skeptic/BD-r4.md`'s PT route, every PT-routed line of the ten `cure/D-*-r4.md` (BD · CH · RN; the other seven none), and the PT rows of `briefs/RULINGS-ROUND5.md` (§A none; §B B.5 · B.15 · B.22); the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-r5.md`, probes `cure/D-PT-r5-probe/`) — 21 ids: 11 CURED · 0 REFUTED · 0 ⛔ STOP · 10 NOTED

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| L-BD 33 (FAIL — new contradiction) | MAJOR | CURED per B.15 — the bounty request reads THE CALL'S OWN DOMAIN (BD §9.9's `order` for a gang or a flock, `wildland` for a beast; CH §14's outlawed conclave `order` only); `body_ended` books a conclave as `order`, never `faith` | §7.2, P53, OD-PT-33 |
| L-BD 36 · `D-BD-r4` route (4) (FAIL · ROUTED-UNAPPLIED) | MAJOR | CURED per B.22 — BD's grammar and record taken: `TRAIL_KNOWN` with `party` ON reveals the way TO THE PARTY (the town dial unread; one recipient per act); PT's own `waysKnown` row, read by nothing in the world, shown in `partyView`, offered to the host's one reveal writer; `party_made_known_trail` names that write and is STRUCK as a deed kind; a town learns a party's find only by the DM's `TRAIL_KNOWN` to it (`by_dm`), no party deed (REFINED R5-1) | §3.1, §2.1 shape 1, §2.3, §2.4, §3.3, §4, §12, §15, §16, §19b, OD-PT-4, OD-PT-33, P54 |
| PT-X1 | MAJOR (new) | CURED — the hunt is a THRESHOLD clock (no patience) on the body's state and the bounty's life, its place each week the body's own `where` (`needPlaceOf`, truth, as §9.2 reads it); `earliestArrivalTick` and `reachedTick` read that place; judged by §8.6's one rule, so a reachable miss falls short and counts; MODELLED (`huntFault.out` A–E); presence where the body worked counts as `made_good` (REFINED R5-2) | §2.2, §2.3, PT10, §8.2, §8.4, §8.6, §15, P53, OD-PT-33 |
| m1 | minor | CURED — §7.3's `party_request` `need` list gains `{ bodyId }` | §7.3 |
| m2 | minor | CURED — with PT-X1: no patience on a hunt; PT10 lists the bounty's quarry among the clocked needs | PT10, §8.2 |
| m3 | minor | CURED — "the posting court lifts its bounty" → BD §9.9's own ends: drops at a claim or a lost name, lapses unclaimed after DRAFT 52 weeks | §8.2, P53 |
| m4 | minor | NOTED — BD §9.9 now names the call's source `{ kind: 'body_bounty', courtId, bodyId }` (BD r5); CH §14's own text still owes it — ROUTED to CH | §7.2 (cite) |
| m5 | minor | CURED (PT's text) — the "one sense" is the key's; the field set is one once CH takes `untilTick` (SEAMS-r4-6, CH's half, ROUTED again) | §2.1 shape 1 |
| m6 | minor | NOTED — PT §4 (6)'s trigger (the site `made_known`) is right; the other word lived only in `cure/D-RN-r4.md`'s route text — RN's volume defers to PT (RN §2.1 `target` row: "whether the deed's LINE names the site is PT's line rule"), so nothing is owed | §4 (6) |
| m7 | minor | NOTED — `party_gate`'s two verdict sets (the gate's and the body half's) under one kind: the fold's §3.4 row registers both — ROUTED (FOLD, P4) | §13 |
| SEAMS-r4-5 | MAJOR (BD's; PT as cite) | CURED (PT's cite) — BD §11 now carries `END_BODY`'s `party` dial (BD r5, RU-13); PT cites it as applied | §3.1 |
| SEAMS-r4-6 | MAJOR (CH's) | NOTED — PT's executed case F stands on PT's side; CH's `banKeys` `untilTick` is CH's half, ROUTED again | §2.1 |
| SEAMS-r4-7 · B.5 | MAJOR | CURED (PT's cite) — the party's bounty claim IS its `body_ended` deed (no `hunt_won` beside it; the party takes no `hunt_taken`); `body_ended` reads CH's `hunt_won` rows (one value) | §3.1, P53, OD-PT-33 |
| B.15 | ruling | CURED — as L-BD 33 | §7.2 |
| B.22 (PT 1) | ruling | CURED — as L-BD 36 | §3.1 … |
| `skeptic/BD-r4.md` ROUTES "PT: agrees … Nothing owed" | — | NOTED — its `TRAIL_KNOWN` half did not agree (the verifier); resolved by the L-BD 36 cure; the mirror and the road arm's default hold | — |
| `D-BD-r4` route (3) (`party_hunted`'s mirror) | routed | NOTED — held by the verifier; the hunt's clock re-cured under PT-X1 | §7.2 |
| `D-CH-r4` PT (1) (P49 names `atOpenWar`; A.8's read) | routed | NOTED — held (the verifier re-ran the probe byte-identical) | §9.2, P49 |
| `D-CH-r4` PT (2) (the body road arm is PT's; CH's narrowing binds CH's kind) | routed | NOTED — held | §9.2 |
| `D-RN-r4` PT (the veil on a kept-secret site) | routed | NOTED — held; its trigger word is m6 | §4 (6), P56 |
| `D-CH-r5` ROUTE to PT (late: CH's r5 lane closed after this lane's first close) | routed | CURED — §7.2's presence clause carries CH §14's exception: a DEN is known to its court only through ST's `believedDenOf`, never by presence | §7.2 |
| RULINGS-ROUND5 §A | ruling | NOTED — no row names PT | — |

REFINED in round 5a (marked in place, vetoable): R5-1 a way revealed to the party is PT's own `waysKnown` record, never a deed, offered to the host's one reveal writer · R5-2 presence where the hunted body worked after the answer counts as `made_good`.

### Round P5 (the completeness critic, 2026-10-20; lane D-PT-p5, Opus 5.5; chair 6eb7b5b6, Fable 5.1; inputs: `assessments/P5-COMPLETENESS-2026-10-20.md`'s PT findings — P5C-6 · P5C-7 · P5C-8 · P5C-22 (PT's items; RN l.413 is RN's) · P5C-13 (WC-PT-95) — with their receipts in `assessments/WIRING-CENSUS-2026-10-20.md` (the WC-PT lane notes, its TOKEN RESIDUE and its three notes), under `briefs/RULINGS-P5.md` ADDENDUM §C.6 · C.7 · C.8 · C.12 · C.13 · C.22; the log is `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-p5.md`, probes `cure/D-PT-p5-probe/`) — 12 ids: 11 CURED · 0 REFUTED · 0 ⛔ STOP · 1 NOTED

| Finding | Sev | Disposition | Where |
|---|---|---|---|
| P5C-6 (WC-PT-49) | MAJOR | CURED per C.6 — `needPlaceOf` gains the DEADLINE arm: the summoning, inviting or offering court's own town (a crisis need beside a term keeps its own place); §8.4/§8.6 unchanged in form; a yes-then-absent summons ⇒ `fell_short` and MISS_FALL (P57, C.6's one pin); MODELLED `p5Probe.out` A1–A6 (before: every case `came_to_nothing`); a summons whose yes fell short escalates (REFINED R-P5-5) | §2.3, §8.2, §8.6, §7.3, §12, §13, OD-PT-9, P57 |
| P5C-7 (WC-PT-33) | MAJOR | CURED per C.7 — a yes on `party_offer` mints `offer_accepted` (target the offering court; `heard_deed` + DRAFT 0.1 at that court, lens two elsewhere; AMBIGUOUS on its face; NOT a placing deed; subject `deed_acceptance`); for `employment` the pledged engagement IS the employment for its term of service (REFINED R-P5-7), read by `partyEmployerOf`: PT2's pre-selected backer inside the employer's reach and the party's backer of record at a town's gate (REFINED R-P5-8); the fold §3.4 row's default unchanged | PT2, §2.2, §2.3, §2.4, §3.1, §3.2, §3.3, §4, §7.3, §8.5, §12, §14, §15, §16, §19, §19b, OD-PT-23, OD-PT-34, P14, P58 |
| P5C-8 (WC-PT-42) | MAJOR | CURED per C.8 — `backing_voided`'s court arm reads the landed pair label THROUGH BELIEF (`readBeliefRelationship` over `relationshipTypeBetween`, the stage's `regionalGraph`) ∈ master's hostile set `rival · cold_war · hostile` (REFINED R-P5-9: `cold_war` included); the body roles keep RN's regard (no refused pair); the party arm stays; EXECUTED on master's readers (`p5Probe.out` B) | §10.3, §13, §15, OD-PT-11, P34 |
| P5C-8 (WC-PT-43) | MINOR (merged) | CURED per C.8 — `backing_repudiated` reads `seatChangedSince`'s `via` (`transfer` repudiates, `seat` upholds) plus the party arm; no predecessor's regard; PL's `via` quoted as PL defines it (a ladder coup is `seat` — §20 (10)) | §10.3, OD-PT-11, P59 |
| P5C-22 (WC-PT-36) | MINOR | CURED per C.22 — `Engagement.bounty?: { band }` set once at mint from the court's `settlementFundingBand`, read by the hunted draw (`unfunded` draws none); a declared sub-field, VISIBLE (OD-PT-4); no treasury row (REFINED R-P5-6, OD-PT-35) | §2.2, §7.3, §16, OD-PT-4, OD-PT-16, OD-PT-35, P60 |
| P5C-22 (WC-PT-54) | MINOR | CURED per C.22 — `closedRecent`'s `party_gate` rows keep the posture HEARD as `how` (REFINED R-P5-3), the input of the re-hearing rule; MODELLED `p5Probe.out` C1–C7 | §2.1, §9.2, §15, §16, OD-PT-4, P61 |
| P5C-22 (WC-PT-60) | MINOR | CURED (PT's half) per C.22 — "or IN's exposure (C1)" struck in §10.2; RN l.413's twin is RN's lane (ROUTED, `cure/D-PT-p5.md` §5) | §10.2 |
| P5C-13 (WC-PT-95) | MINOR | CURED per C.13 — `name` read by the DM's surfaces: the window's title, the cards and deed lines on the DM's side, the dossier's party lines (CHAIR-NOTES 20), the H17 piece's label; never by the engine or a telling | §2.1, §4, §12, §19, §19b, OD-PT-36, P62 |
| the PT token residue (P5C-12's PT part; the census's WC-PT TOKEN RESIDUE) | MINOR | CURED (PT's side) — gathered into §2.4's ONE register row, censused (`census-p5.out`: all FREE as code tokens) with P5's new tokens (`offer_accepted` · `deed_acceptance` · `partyEmployerOf` · the party `bounty`); the fold §5 rows ROUTED to D-FOLD-p5's register pass (REFINED R-P5-1) | §2.4 |
| WC-PT note (RN's credibility path and the source-scan pin) | note | CURED — `partyOf`'s pin names RN's two credibility reads as reading through it | §2.3 |
| WC-PT note (the H17 piece's "caravan-piece precedent") | note | CURED — re-pointed to master's `components/map/TravelersLayer.jsx` (read at `81f1cd963`) and mounted in C.21's owned FP MAP LAYERS unit (REFINED R-P5-4) | §4 |
| WC-PT note (BD l.1070 "`TRAIL_KNOWN` `to: party`") | note | NOTED — BD's one-word drift beside its own dial form; BD's lane (D-BD-p5) | — |

REFINED in P5 (marked in place, vetoable): R-P5-1 the register row · R-P5-2 the acceptance's link on `heard_deed` · R-P5-3 the posture heard, never the answer · R-P5-4 the map precedent and the owned unit · R-P5-5 a fallen-short summons escalates · R-P5-6 no treasury row for a party bounty · R-P5-7 the employment is its pledged offer · R-P5-8 the backer of record named · R-P5-9 the void's hostile set, the body roles, the party arm, PL's `via` as defined · the `partyOf` pin naming RN's reads.

**P6c (2026-10-20, lane BRACKETS-A2-program-volumes — INSERTIONS-ONLY):** ONE route — `party_request` never reads `captive_held` (OP-r1-13; `cure/D-OP-r2.md` / `D-OP-r3.md` ROUTED PT; RULINGS-P6 §B.1) — APPLIED as a confirming bracket at §7.2 and a ↳ row at §7.3; `cure/L-CH-PD.md` §4 route 7 ("PT's `party_gate` takes no step 5b — a party swears no oath") NOTED, no edit; nothing else routed to PT this round.
