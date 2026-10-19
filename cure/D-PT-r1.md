# D-PT-r1 — DISPOSITION LOG for THE PARTY (`docs/DESIGN_FP_ARCH_PT.md`), P3 round 1 (lane D-PT-r1, chair a73343ed; seat Opus 5.5; started 2026-10-18 05:15 EDT by `date`)

Status: DONE 2026-10-18 by `date` (see §2). Saved as I went. Findings in scope: `skeptic/PT-r1.md` (PT-r1-1 … PT-r1-37), `skeptic/SEAMS-r1.md` ids 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 15, 18, 20, 22 and `skeptic/HOST-r1.md` ids 2, 3, 5, 6, 9, 10 — **57 ids**. Files owned: the volume and this log (+ `cure/D-PT-r1-probe/`). The volume is a NEW draft, rewritten in place; every changed passage carries `[CURED 2026-10-18 (fp-final r1) — <id>: …]`, every refinement beyond a finding `[REFINED 2026-10-18 (fp-final r1) — …]`. No git, no test suite. A previous D-PT seat died before writing (its probe outputs `census*.out`, `effLines.out`, `weathering.out.json` were left in the probe dir; the volume was untouched — `PT-before-r1.md` is byte-identical to the volume at 05:15, `cmp` CONFIRMED). Every load-bearing measurement below was re-run by this seat.

Read whole, in order: kit README, COMPILE-COMMON, DISPOSE, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (incl. the 05:1x ADDENDUM), cure/L-FOLD (incl. its unplaced list), the L-PT brief and cure/L-PT, the volume, skeptic PT-r1, SEAMS-r1, HOST-r1. Read by section (current, round-1-cured text): RN §2–§13; CH §11, §14, §16, §18; PL §2, §5.6, PL5; MN §2–§3 (verbs, release); fold §1 req. 24 and §3.4's party rows; the host document's cited rows (HR:69/79/81/83/84/88/513/600/646/655/666/872/898).

## 1. MEASURED FIRST (code of record: the detached master worktree `master-81f1cd963`, read-only)

| # | Question | Receipt | Verdict / bears on |
|---|---|---|---|
| M1 | Does the composer mint through both party doors? | `store/settlementLifecycleHelpers.js`: `if (event?.partyCaused && campaign) { … const action = mapEventToPartyImpact(event, activeSaveId); … record(campaign.id, action)`; `events/drainQueuedEvents.js`: `if (event?.partyCaused) { const action = mapEventToPartyImpact(event, saveId); if (action) partyImpacts.push(...)`; `events/partyEventLinkage.js :: EVENT_TO_PARTY_KIND` = KILL_NPC · KILL_LEADER · IMPAIR_FACTION · RESTORE_FACTION · BROKERED_ALLIANCE · SETTLEMENT_DISPUTE; the action it returns is `{ kind, settlementId, [targetField], magnitude, label, note }` — NO event id | CONFIRMED (read). PT-r1-3, SEAMS-r1-8: the action must carry the event id for the cross-door lookup |
| M2 | Is the drain able to mint? | `drainQueuedEvents({ queue = [], saves = [], now = wallClockNow(), tick = null } = {})` — no `worldState`; `campaignPulseHelpers.js :: drainCampaignQueueIntoState` holds `ws` (`const ws = applyTwinDirectivesToWorld(worldState, twinDirectives, { tick, now });`) and returns `partyImpacts`; replayed in `campaignAdvanceSession.js` (`await get().recordPartyImpact(campaignId, pi.action, { sessionFence })`) | CONFIRMED. PT-r1-23: return `partyEvents` from the drain; mint in `drainCampaignQueueIntoState` |
| M3 | The undo of an authored event | `store/settlementSlice.js :: undoLastEvent` reverses the crisis twin (`crisisWithdraw(undoneEntry)` → `undoCampaignStressorBridge`) and "the NON-party relationship ripple" (`const relRippleUndo = undoneEntry?.undo?.relationshipRipple;`); no party arm; the popped event keeps its id (`const eventId = popped.event?.id;`); host 816 eff. = its baseline 816 (EXECUTED, `effLines-r1.out`) | CONFIRMED. PT-r1-7: the arm must go to a leaf through a leaf-first car that SHRINKS the slice |
| M4 | The orphanage's category | `display/institutionVocabulary.js :: INSTITUTION_MORAL_LEAN` ("MORAL PLANE LEAN {cruelty, disorder} … charity the mercy pole … Absent = neutral"): `Orphanage: { cruelty: -0.7, disorder: -0.2 }`, `Hospice -0.8`, `Almshouse -0.7`, hospitals `-0.6`, `Foundling home -0.6`, monasteries `-0.3`; `'Slave market': { cruelty: 0.9 … }`, `'Kidnapping ring' 0.85`, `"Assassins' guild" 0.7`; the engine leaf it is pinned equal to: `worldPulse/moralMartialLean.js :: MORAL_INSTITUTION_LEANS` ("cruelty +1 embodies cruelty (evil) · −1 embodies mercy (good)"); the event registry's own classifier `events/registry.js :: classifyInstitution(name)` → `food_storage · religious · law_enforcement · trade · hospitality · civic · finance · production · other` (temple/cathedral/shrine/monastery/church → `religious`) | CONFIRMED. PT-r1-2 (RULINGS-ROUND1 PT-r1-2): the target's category is the institution's MORAL LEAN plus the registry's kind |
| M5 | Can `EVENT_TO_PARTY_KIND` take institution rows? | `mapEventToPartyImpact`: `const spec = … (PARTY_IMPACT_KINDS)[mapping.kind]; if (!spec) return null;` — every row needs a party-impact KIND; `PARTY_IMPACT_KINDS` has no institution target; the module's header: "add/remove an institution … have no campaign-scale party-impact kind" | CONFIRMED. The re-ruling's literal "`EVENT_TO_PARTY_KIND` gains the institution rows" cannot be built without minting a thirteenth party-impact kind (new capability in the pulse pipeline); its operative effect is built through PT's registration rows instead (REFINED, below) |
| M6 | The pardon and the party key | `npcDmVerbs.js :: pardonNpc`: `if (!found) return refuse(worldState, settlement, 'pardon', 'unknown_identity');`; `npcDmVerbAuthority.js :: findIdentity`: `if (!placed && !roaming) return null;`; but the ONE edge writer takes any string key: `npcLedger.js :: addExclusionEdge(worldState, wnpcId, edge)` → `const id = String(wnpcId == null ? '' : wnpcId);` … `exclusions: sortedRecords({ ...ledger.exclusions, [id]: merged })`, and `liftExclusionEdges` the same; the normalizer keeps any key (`for (const id of Object.keys(exclusionsRaw).sort(compareCodepoint))`); every reader looks edges up BY KEY (`exclusionsOf`, `npcLedgerProjection.js` `ledger.exclusions[id]`) | CONFIRMED. PT-r1-9: PT's own pair `BAN_PARTY` / `PARDON_PARTY` on the key `party`, zero lines in `npcLedger.js` (the compile's "+≈6 normalizer arm" is struck) |
| M7 | The rumor subject voice | `settlementRumors.js :: whatPhrase` — "ANY OTHER TOKEN IS REFUSED" → `export const UNREGISTERED_SUBJECT = 'a matter of some moment';`; the only party row `party_stressor_residual: 'lingering troubles'`; `heraldRouting.js` `['party_', 'events']` | CONFIRMED. PT-r1-18: PT owes the deed subjects as registered `what` rows |
| M8 | The weathering, re-run | `cure/D-PT-r1-probe/weathering.mjs` imports the LANDED `rumorNetwork.js :: degradeTelling` (200k tellings/row) → `weathering-r1.out.json`: completeness ≥ 0.85 survives 67.4% at 1 hop · 15.5% at 2 · 2.4% at 3 · 0.3% at 4; ≥ 0.75 survives 97.1 · 62.5 · 19.6 · 4.3%; magnitude from band 2: 14.8% up · 14.7% down; from band 3: 0% up · 15.0% down | CONFIRMED (EXECUTED; identical to the skeptic's file). PT-r1-12, -22, -32 |
| M9 | The degrade signature | `rumorNetwork.js :: degradeTelling(record, fork, digest)` | CONFIRMED. PT-r1-35 |
| M10 | The war-layer siege | `display/warStatus.js :: liveSieges({ worldState, regionalGraph })` → `{ targetId, coalition, frontCount, visibility }` (no stressor id; no since-tick) | CONFIRMED. PT-r1-5: a `siege` need keyed by `targetId`; its threshold is the row leaving `liveSieges` |
| M11 | The credibility law | `npcCredibility.js` `SCORE_MAX: 12`, `TRUE_RISE: 0.6`, `LIE_FALL: 6.5`, `HALF_LIFE_TICKS: 52`, `MAX_LOOKBACK_TICKS: 260`; `decayedNpcCredibilityScore(entry, tick)` | CONFIRMED. PT-r1-8: the law is a deterministic fold over dated charges, so it can be derived on read from the pledge deeds exactly |
| M12 | Hosts (eslint's own `max-lines` count, EXECUTED, `effLines-r1.out`) | `settlementSlice.js` 816 (baseline 816) · `settlementLifecycleHelpers.js` 139 · `campaignPulseHelpers.js` 244 · `drainQueuedEvents.js` 168 · `partyEventLinkage.js` 27 · `npcLedger.js` 429 · `envoyPulse.js` 332 · `partyImpact.js` 327 · `settlementRumors.js` 567 · `rumorNetwork.js` 364 · `realmVerbExecution.js` 663 · `heraldRouting.js` 284 · `npcDmVerbs.js` 711 | CONFIRMED |
| M13 | Tokens (`census-r1.sh`, quoted-literal files in `src` · word files `src`/`tests`/ledger docs; `census-r1a/b/c.out`) | FREE (0 · 0 · 0 · 0): `made_good` `fell_short` `came_to_nothing` `party_voiced` `met_in_person` `to_meet` `to_warn` `to_challenge` `visitPurpose` `voidsRef` `BACKER_ROLES` `town_court` `town_power` `liege_court` `paramount_court` `creed_clergy` `actAt` `reachedTick` `lastHeardOf` `recordPartyDeed` `partyEvents` `BAN_PARTY` `PARDON_PARTY` `reconcileWorldOnUndo` `PARTY_EVENT_VALUE_ROWS` `seatChangedSince` and the fourteen `deed_*` subject tokens. LANDED: `kept` (2 files, comments) · `broken` (10 files; a `REMAINING_BANDS` key, `DAMAGE_STATES`) · `void` (3) · `honored` (18; `pactRenewal.js`) · `struck` (1: `tableEvents.js` verb label) · `withheld` (1: a herald phrase) · `refused` (34; CH's gate verdict, same meaning) · `spoken` (a boolean KEY in `espionage/operationsVoice.js`: `spoken: true`) · `presentAt` (a key in `suspicion.js`: `presentAt: 0.15`) | CONFIRMED |
| M14 | The menace's party dial and the release | MN §2 `MENACE_MIGHT` / `MENACE_STATE` gain a fourth dial `party` "calls THE PARTY's `party_event` door" (OD-MN-36); the release keeps the driven record's id (OD-MN-28; M46 "the record keeps its id through the release; the pledge's threshold fires only when the record leaves `active`") | CONFIRMED (volume read). PT-r1-17, SEAMS-r1-18 |
| M15 | RN's cured surfaces PT cites | RN §2.1 `sourceEventRef` + `deedIndex(...).bySourceEventRef`; RN §2.2 the backer table and the kingdom key `c:<rootId>`; RN §5.3 the court derivation (ruler weight `1 + factionPowerShare01(governing faction)`; the crown's reach added inside the member's court); RN §6.1 the pledge reading and the `party_event` registration door; RN §7 `MISS_FALL` 2.0 and `partyCredibilityAt`; RN §13 the head unit RN-0 + PT-0 | CONFIRMED (volume read) |
| M16 | CH's and PL's cured surfaces PT cites | CH §11 `paragon/gateDefault.js :: gateDefault({ worldState, snapshot, actorRef, settlementId, tick })` with the party arm, the WATCH, `polity_ban` thresholds (`staunch`/`unbroken` refused · `shaky` watch · `frayed` no weight), ONE `enemy_in_service`; CH §14 "never CLOSED by the answer"; CH §16 `whereaboutsOf`; PL §2 `crownReachAt(worldState, snapshot, rootId, memberId, observerId) → { share01, liegeId, tier }`; PL §5.6 the two tails (`previousGovernments` + `seatTransitions`); RULINGS-ROUND1 ADDENDUM names the one read `seatChangedSince(settlementId, tick)` | CONFIRMED (volume read; `seatChangedSince` is not yet written into PL — PL's half, listed) |

## 2. THE RECORD (id · severity · disposition · where in the volume · receipt) — 57 of 57: CURED 57 · REFUTED 0 · STOP 0 · NOTED 0

The volume grew 79,679 → ≈168,200 bytes (457 → 637 lines): 117 `[CURED 2026-10-18 (fp-final r1) — …]` brackets, 6 `[REFINED 2026-10-18 (fp-final r1) — …]` (plus REFINED clauses inside CURED brackets), a new §3.3 (the value rows), §3.4 (the undo car), §11.3 (the reason's term), §19b (THE VOICES) and §21 THE CURE RECORD (round r1). Every id is in §21 and carries at least one body bracket (CHECKED by script: 0 missing in either; every table's column count consistent; no raw `|` inside a code span in a table row).

| Finding | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| PT-r1-1 | B | CURED (RULINGS-ROUND1 PT-r1-1) | PT3, §2.1, §2.3, §3.2, §4, §8.3–8.4, §12, P21 | `whereaboutsOf` = later of `presentAt.sinceTick` and the derived `lastHeard`; witnesses add the toggle only when it is the later word |
| PT-r1-2 | B | CURED (RULINGS-ROUND1 PT-r1-2, built through registration rows — REFINED) | §3.3, §2.4, §0, OD-PT-18, P4/P4b | M4 (`INSTITUTION_MORAL_LEAN` `Orphanage: { cruelty: -0.7 …}`; `classifyInstitution`), M5 (`if (!spec) return null;`) |
| PT-r1-3 | B | CURED (RULINGS-ROUND1 PT-r1-3 + the static skip — REFINED) | §3.1, OD-PT-19, P22 | M1 (the action carries no event id; async `recordPartyImpact`), RN §2.1 `sourceEventRef` |
| PT-r1-4 | M | CURED | §8.6, §2.2, PT2, PT10, P26 | evidence order: `KEEP_PLEDGE` · `reachedTick ≤ T` · a deed that resolved the need |
| PT-r1-5 | M | CURED | §2.2, §8.2, §7.3, P27–P28 | M10 (`liveSieges` rows carry no stressor id); CH §14 call sources |
| PT-r1-6 | M | CURED | §8.2, §8.5, §19 | R-PT-5's own "a computed end date would be a forecast" |
| PT-r1-7 | M | CURED | §3.4, §6, §16, §14, OD-PT-24, P23 | M3 (no party arm; 816 = baseline, EXECUTED; the two blocks are 26 non-blank non-comment lines, counted) |
| PT-r1-8 | M | CURED (PT's side) | §2.1, §4, §6, §16, P18, P24 | M11 (clamped decayed running score) |
| PT-r1-9 | M | CURED | §2.1, §6, §9.3, §14, P25 | M6 (`pardonNpc` refuses; `addExclusionEdge` keys by any string) |
| PT-r1-10 | M | CURED (PT's side) | §11.3, PT13, PT2, OD-PT-20, P3–P4b | RN §6.2 (no reason term in the lens formulas) |
| PT-r1-11 | M | CURED (REFINED against chair notes item 3) | PT2, §3.2, OD-PT-2, P14 | the owner: "the user authors and events and click sanctions in according to the event of the night" |
| PT-r1-12 | M | CURED | §11.2, §10.2, §6, P6 | M8 (reason survives 67.4% / 15.5% / 2.4% at 1/2/3 hops) |
| PT-r1-13 | M | CURED | §9.2, §7.3, §13, §2.4, P33 | CH §11/§18 `person_at_the_gate` CLIMAX, heard only when not admitted |
| PT-r1-14 | M | CURED | §7.3, §10.3, §2.1, §2.4, §3.3, P34 | `correctsRef` means correction (RN §2.1); `voidsRef` minted (FREE, M13) |
| PT-r1-15 | M | CURED | PT7, §6, §13, §2.4, P12 | fold §1 req. 24(b) "keyed by ENGAGEMENT id … read by the resolver FIRST" |
| PT-r1-16 | M | CURED | §2.4, §8.6, §13, OD-PT-21, P7–P8 | PL §4.3 `relief_answer: sent · kept`; M13 (`broken` 10 quoted files) |
| PT-r1-17 | M | CURED | §3.1, §14, P19 | M14 (MN OD-MN-36's `party` dial); `realmVerbExecution.js` 663 (EXECUTED) |
| PT-r1-18 | M | CURED | §19b, §0, §2.4, OD-PT-23, P32 | M7 (`UNREGISTERED_SUBJECT = 'a matter of some moment'`) |
| PT-r1-19 | M | CURED | §7.3, §6, §3.3, P13 | CH §2.1 `marks.metParty`; RN §2.1 (c) "a person's first-hand meeting recorded at the table (PT's deed)" |
| PT-r1-20 | M | CURED | PT4, §5 | RN §2.2 `c:<rootId>` read as THE KINGDOM (RN-r1-12) |
| PT-r1-21 | M | CURED | §9.1, P29 | RN §5.3 (ruler weight `1 + factionPowerShare01(governing faction)`; the crown's reach inside the member's court; the dark arms) |
| PT-r1-22 | M | CURED (REFINED against L-PT ruling 10) | PT13, §11.1, OD-PT-12 | M8 (from band 2: 14.8% up · 14.7% down; band 3: 0% up · 15.0% down — EXECUTED) |
| PT-r1-23 | m | CURED | §3.1, §0, §14 | M2 |
| PT-r1-24 | m | CURED | §7.1, §14, OD-PT-15 | RULINGS-AFTER-COMPILE RN-S1 |
| PT-r1-25 | m | CURED | §8.4, §8.6, §13 | RULINGS-AFTER-COMPILE PT-S1 "(the card says so)" |
| PT-r1-26 | m | CURED | PT3, §2.1 `actAt`, §4 | — |
| PT-r1-27 | m | CURED | PT1, PT6, OD-PT-1 | RULINGS-AFTER-RESEARCH §4 (the ban widened to actor refs) |
| PT-r1-28 | m | CURED | PT9, §7.3, §13 | — |
| PT-r1-29 | m | CURED | §16, §2.3, §4, §8.3 | `events/registry.js` `DESTROY_SETTLEMENT` |
| PT-r1-30 | m | CURED | §13 TILT column | fold §1 req. 24(b) "each kind declares which" |
| PT-r1-31 | m | CURED (IN's half listed) | §13, §20 | — |
| PT-r1-32 | m | CURED | §17 P5, §11.1 | M8 (97.6% of single-path three-hop tellings carry no reason) |
| PT-r1-33 | m | CURED | §10.1 | PL §2 `crownReachAt(…) → { share01, liegeId, tier }`; PL §3.1 "every lord is the head of its own sub-tree for this read" |
| PT-r1-34 | m | CURED | §7.3, §2.2, §2.4 | RN §5.4 "ordinary NPCs never travel on their own" |
| PT-r1-35 | m | CURED | §11.1, §14 | M9 |
| PT-r1-36 | m | CURED | §14 | RN §8 "no free-tier arm"; req. 24(e) |
| PT-r1-37 | m | CURED | §7.2, §7.3 | CH §14 call `{ settlementId, domain, side, band, source }` |
| SEAMS-r1-3 | M | CURED (PT's half; PL to name the read) | §7.3, §9.3 | RN M14 / `treatySuccession.js` header "write NO row"; RULINGS-ROUND1 ADDENDUM `seatChangedSince` |
| SEAMS-r1-4 | M | CURED | §7.3, §9.2, §9.3 | RN §5.2 `ACT_OFFICE`; CH §11 (cured the same way) |
| SEAMS-r1-5 | M | CURED | §9.2, §7.3 | CH §11 `gateDefault` (the party arm) |
| SEAMS-r1-6 | M | CURED (the chair's ruling executed) | PT5, PT6, PT12, §7.3, §10.3, §13, OD-PT-22, P31 | RULINGS-ROUND1 ADDENDUM |
| SEAMS-r1-7 | M | CURED | PT10, §8.6, P8 | RN §6.1 pledge reading; RN §7 `MISS_FALL` |
| SEAMS-r1-8 | M | CURED | §3.1, §0 | RN §2.1 `sourceEventRef`; M1 |
| SEAMS-r1-10 | M | CURED | §10.2, PT12 | RN §6.1 `remove_npc` row (the shift struck, RN-side) |
| SEAMS-r1-11 | M | CURED | §2.1, §2.4, §10.1 | RN §2.2 backer table; M13 (`BACKER_ROLES` FREE) |
| SEAMS-r1-12 | M | CURED | §10.1, §9.1, §9.2 | PL OD-PL-44 "One crown-reach read" |
| SEAMS-r1-14 | M | CURED | PT11, §7.2, §19 | CH §14 "never CLOSED by the answer" |
| SEAMS-r1-15 | M | CURED (PT's half) | §15, OD-PT-17 | RN §13 head unit |
| SEAMS-r1-18 | M | CURED | §8.2, P30 | M14 (MN OD-MN-28; MN M46) |
| SEAMS-r1-20 | m | CURED | §13, §7.3 | — |
| SEAMS-r1-22 | m | CURED | §2.4, §10.3, §13 | M13 (`honored` 18 quoted files; `upheld` 0) |
| HOST-r1-2 | B | CURED (PT's half) | §0, §8.3, §14 | RULINGS-ROUND1 ADDENDUM "canonized ≠ premium"; HR:84, HR:88 |
| HOST-r1-3 | M | CURED | §4, §12, PT17 | HR:83 (H17), HR:666 (law 6) |
| HOST-r1-5 | M | CURED | PT18, PT8, §2.4, §9.2, §19 | HR:513 |
| HOST-r1-6 | M | CURED | §13, §2.2 | HR:655 (ENC-HL-13) |
| HOST-r1-9 | M | CURED | §4, PT17, §2.4 | HR:600 (ENC-HS-01), HR:646 (ENC-HL-04), HR:872 (Q10) |
| HOST-r1-10 | M | CURED | §8.4, §20, PT17 | HR:79 (H12), HR:81 (H15) |

The L-FOLD "unplaced" list names no PT item; its census's two PT homonyms (`presentAt` a key in `suspicion.js`; `spoken`/`unspoken` keys in `espionage/operationsVoice.js`) are applied in PT §2.4's register.

## 3. STOPS

None raised in round 1. The compile's PT-S1 and PT-S2 were ruled (RULINGS-AFTER-COMPILE) and are carried as RULED in §20 with their producers named. RULINGS-ROUND1 narrows a STOP to "a cure [that] would contradict an owner word or needs a kernel line"; no cure here does either. Three cures depart from a CHAIR ruling's letter and are therefore marked REFINED and vetoable (§4: R1-1, R1-2, R1-3) rather than silently re-ruled.

## 4. REFINED (round 1; each marked in the volume)

- **R1-1 — the backing default keeps only the accepted-request arm** (PT2, §3.2; against chair notes item 3's "a warm regard or an open accepted request"). Why: fondness is not authorization; the regard arm would back every deed in a friendly town, softening villainy and handing the seat's enemies grudges no one sanctioned, with no touch from the DM (PT-r1-11). The accepted-request arm is narrowed to an act AT the pledged need's settlement inside the requester's reach.
- **R1-2 — the size drift stays symmetric as landed; "usually swelling" struck** (PT13, §11.1; against L-PT ruling 10's wording; RULINGS-AFTER-RESEARCH §5 already said "no new draw is needed"). The alternative for the chair, if swelling is wanted: a bounded upward bias on a DEED-ONLY fork key (e.g. a 60/40 up/down split on deed tellings below band 3, band 3 held), a new draw for deed events only, same-seed neutral for every non-deed telling — not built.
- **R1-3 — RULINGS-ROUND1 PT-r1-2 is built through PT's registration rows, not the landed `EVENT_TO_PARTY_KIND`** (§3.3): every row of that ripple map needs a party-impact KIND (`if (!spec) return null;`) and none has an institution target; adding one is new capability. The ruled effect is built exactly.
- **R1-4 — the static skip beside the ruled `sourceEventRef` lookup** (§3.1): with the async `recordPartyImpact`, the lookup alone lets call order decide which door's shape the one deed takes.
- **R1-5 — the verbs' hats** (§6): table records ride the party door's named exemption; acts upon the world's actors (`DIRECT_TO_PARTY`, `BAN_PARTY`, `PARDON_PARTY`) take the landed AUTHOR shape — aligning PT with RN-r1-23.
- **R1-6 — `actAt` on the party's deeds** (§2.1): the act's own place, needed by the derived `lastHeard`, the pledge evidence and the voices; witnesses could not recover it.
- **R1-7 — the reason's term carries the DM's marked weight only** (§11.3): the design that makes the chair's `spoken` default harmless and the owner's "without telling anybody" villainous; DRAFT band centres and proof factors on the roster.
- **R1-8 — `deed_refusal`** joins the subject list (seventeen subjects, not sixteen).

## 5. THE OTHER HALVES (for the chair and the sibling lanes; PT's side is cured, the other volume or the fold still says otherwise)

1. **RN** (`DESIGN_FP_ARCH_RN.md`): (a) §2.1 "THE PARTY'S CREDIBILITY — a holder `{ score, lastUpdateTick }`" and §7 "ONE holder … **The writer** is the PARTY DOOR" → the DM-view read `partyCredibilityOf` folds the landed law over the party's unstruck `party_pledge` deeds and exposures, like `partyCredibilityAt` already does per town (PT-r1-8); (b) §6.1 "PT's `moralWeight` mark, when present, REPLACES the derived band for every reader" → "for every reader whose version shows the reason, as far as it believes the teller (PT §11.3)" (PT-r1-10); (c) §2.1 kind list "for `party_pledge` `kept · broken` (PT's)" and §6.1's pledge reading → `made_good · fell_short` (PT-r1-16); (d) RN's one deed normalizer names PT's three new fields `actAt`, `voidsRef`, `backerRole` (shape 2); (e) §5.5's `[STOP SEAMS-r1-6]` and §11 → the crossing whose subject is the party is handed to PT's pass through the person stage; `voiced_regard` mints at `party_voiced`'s `spoken` resolution; (f) §3.1's `party_event` row "for EVERY party-caused settlement event" → "for every party-caused event that does not ripple (the six mint through `party_impact`)".
2. **The fold** (chair): §3.4's party rows — `party_gate` CLIMAX with `admitted · refused · admitted_under_watch · struck`; `party_pledge_due` `made_good · fell_short · came_to_nothing · struck`; `struck` on every STANDING party row; the new `party_voiced` row (CLIMAX, `spoken · withheld`, default `spoken`); `backing_repudiated` `repudiated · upheld`; a WHERE column; the count fourteen → fifteen kinds (OD-FC-50's bracket); §5 rows for every token minted in PT §2.4 (incl. `made_good · fell_short · came_to_nothing`, `BACKER_ROLES`, `visitPurpose`, the seventeen `deed_*` subjects, `actAt`, `voidsRef`, `reachedTick`, `met_in_person`, `refused_request`) and the homonyms (`spoken`, `withheld`, `struck`, `refused`, `gate`, "known"); §6's C11/C13 rows — the head unit RN-0 + PT-0 and RN-2 before PT-1/PT-2; the spine's requirement 17 bracket "canonized ≠ premium" (HOST-r1-2).
3. **PL**: name `seatChangedSince(settlementId, tick)` in §2/§5.6 as the one two-tail read CH and PT consume (RULINGS-ROUND1 ADDENDUM; SEAMS-r1-3).
4. **IN** (the fold's inbox, the chair's): `plant_taken` skips a plant whose subject is the party — heard only as `party_slander` (PT-r1-31).
5. **CH**: its paragon stage reads PT's `met_in_person` deed to set `marks.metParty`; a bound paragon carrying its employer's request, offer, summons or threat presses PT's family (CH §16's "warning, challenge" are `party_visit` purposes) — CH §16 already reads this way; a sentence naming `met_in_person` is owed.
6. **MN**: none (the `party` dial and the kept id are MN's round-1 cures, cited).

## 6. OPEN QUESTIONS (only what measurement cannot settle)

1. R1-2's alternative: does the chair want tales of the party's deeds to swell (a deed-only bounded bias) despite the landed symmetric roll?
2. RN §7 mentions "a miss the DM marks a lie" (charged `LIE_FALL`); PT offers no such mark on the pledge. Whether `AMEND` on `party_pledge_due` gains a `{ lie: true }` option.
3. The two polity backer roles read `crownReachAt` with a liege as "the head of its own sub-tree" (PL §3.1's words); PL's signature names the parameter `rootId`. PLAUSIBLE that the read accepts any lord as the head (PL §3.1 says so); PL-2's car should pin it.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED by code read at `81f1cd963`: M1–M7, M9–M11, M13's literal census. CONFIRMED by execution: M8 (the weathering rates and the symmetric drift, `weathering-r1.out.json`), M12 (eslint's own counts, `effLines-r1.out`), M13 (`census-r1.sh` → `census-r1a/b/c.out`), the 57-id record check and the table check (scripted). CONFIRMED by reading the cured sibling volumes: M14–M16. PLAUSIBLE, not executed: the undo car's net shrink (≈ −25, counted lines, not eslint), every host delta marked "+≈", the band centres, proof factors, thresholds and draw rates (DRAFT, UNMEASURED, on the FP-46 roster), and that `crownReachAt` accepts a liege as head (open question 3). None is upgraded.

## 8. PROBES (`cure/D-PT-r1-probe/`)

`PT-before-r1.md` (the volume before this lane; byte-identical to the compile) · `census-r1.sh` + `census-r1a.out`, `census-r1b.out`, `census-r1c.out` · `effLines.mjs` (R2's eslint reproducer) + `effLines-r1.out` · `weathering.mjs` (imports the LANDED `degradeTelling`; run with the master path) + `weathering-r1.out.json` · `stage/00…17-*.md` (the section texts the volume was assembled from, in order) · the dead seat's leftovers `census*.out`, `effLines.out`, `weathering.out.json` (superseded by the `-r1` files; identical where they overlap).
