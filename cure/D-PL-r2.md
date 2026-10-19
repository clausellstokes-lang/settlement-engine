# D-PL-r2 — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_PL.md`, P3 round 2 (lane D-PL-r2, chair a73343ed; seat Opus 5.5; 2026-10-18, 06:37–06:58 EDT by `date`)

## OUTCOME
Every item routed to PL is disposed: the 4 FAILS and 3 NEW findings of `skeptic/PL-r1-verify.md`, its 2 unnumbered minors, and the RULINGS-ROUND2 items A.7, A.8, A.14, B, C.Q3, C.Q4 and E. All 7 counted findings and both minors are CURED. Three of the cures (PL-r1-11, PL-r1-15 and A.14's harbouring) are PL's half only; the other halves sit in files this lane does not own (§5). A.8 is NOTED with no change, and C.Q1, C.Q2 and D touch no PL passage. Nothing was refuted and no STOP was raised. The volume grew from 690 lines (173,324 bytes) to 734 lines (206,288 bytes); the diff is `D-PL-r2-probe/volume.diff` and the pre-round copy is `D-PL-r2-probe/PL.before-r2.md`. Git and the test suite were not touched, and the code of record (master `81f1cd963`) was only read.

## 1. FIRST ACT — the measurements that could refute the round's directions (master `81f1cd963`, read-only; CONFIRMED unless marked)
- **The interval keys (PL-r1-4).** `intervalWeeks.js :: INTERVAL_WEEKS` is `{ one_week: 1, one_month: 4, one_season: 13, one_year: 52 }`. The volume had `INTERVAL_WEEKS.year` in §3.5 and `.season`/`.year` in §5.5.
- **The two-cycle (PL-r1-6).** I re-ran the verifier's probe as `D-PL-r2-probe/cycle.rerun.mjs`, and `cycle.rerun.out` is identical to the verifier's: `foreignSeatOf(H)` gives `{ patron: 'M', basis: 'occupation_rung_vassalized' }` and `foreignSeatOf(M)` gives `{ patron: 'H', basis: 'vassal_edge' }`. I then executed the proposed walk rule over the real `foreignSeatOf` in five worlds (`walk.mjs` → `walk.out`). W1 and W1b, the contest case with H held by M at the rung (plus M's vassal L in W1b), give root H with no receipt from every start. W2, an all-edge A←B←C←A, gives `polity_circle`. W3, where L holds H at the rung with an L–H edge re-stamped L-overlord, has `foreignSeatOf(H)` report `vassal_edge`, and the walk gives `polity_circle`. W4, the same with no L–H edge, gives root H in chains. `occupation.js :: vassalizationOutcomes` emits once on arrival and skips when no edge exists (`if (!found) continue;`).
- **The verdict channel's host gate (PL-V1).** `pulseKernel.js` has `const coupOutcomes = simulationRules.stressorsEnabled ? coupVerdictOutcomes({`. In `simulationRules.js` the defaults are `stressorsEnabled: true` and `relationshipDynamicsEnabled: true`, and `static_campaign` sets both `false`.
- **The majors pause (PL-V2).** `decisionTier.js :: CAMPAIGN_ALTERING_CANDIDATE_TYPES` holds `occupation_vassalized`, `sovereignty_conveyed` and others, and `deriveDecisionTier` reads only the candidateType, an authority `power_transfer` (conquest or coup) and a `government_change` payload. `pulseOutcomePartition.js :: partitionPulseOutcomeLanes` withholds public majors under `deferMajors`. In `advanceInterval.js`, autoResolve OFF runs every tick with `deferMajors: !autoResolve && !isResumeTick` and pauses at the first tick that surfaces majors; a resume re-runs that tick from its pre-tick inputs with the dismissals folded in. The policy row `occupation_vassalized` carries `campaignAltering: true`, and `tests/domain/changeAuthorityPolicy.contract.test.js` pins exactly the marked set against `deriveDecisionTier`. The polity stage's host receives the post-fold graph (`pulseKernel.js`: `advanceTreatiesWithDisposition({ … graph: applied.regionalGraph, … })`).
- **The seat-change read (PL-V3).** `rulingPower.js :: authorityTransferEpochFor` is a JSON identity of the transfer tail and the ascendancy lineage, not a counter. `mutateWorld.js :: changeRulingPower` calls `transferRulingPower(s, event.targetId, { cause })`, and `transferRulingPower` stamps `tick: null` when no tick is given: the DM's change is the one tick-less row. `seatTransitions` rows carry `id`, `tick` and `authorityEpoch`. The organic ladder append runs only under `warRulingsLit = warLayerEnabled === true && warTerminationEnabled === true`, and `applyWorldPulse.js` also appends `applied:<outcome id>` rows for applied government changes. Zero PL hits for `seatChangedSince` before this round.
- **Tokens** (`D-PL-r2-probe/tokens.out`). `seatChangedSince`, `seatEpisodeKeyOf`, `polity_verdict_default`, `requestFealtyRow` and `FEALTY_EPISODE_PREFIXES` have 0 hits in src and 0 in tests. `seatChangedSince` already appears in the ledger's fold and PT, and `polity_ban` and `den_unanswered` appear in CH and ST.

## 2. THE RECORD
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| PL-r1-4 (FAIL) | B | CURED | §3.5 `P`, §5.5 verdicts, P33, OD-PL-40 | `INTERVAL_WEEKS` keys quoted |
| PL-r1-6 (FAIL) | M | CURED (RULINGS-ROUND2 B) | PL2, PL12, §5.1, §5.5 CONQUEST, P2b, P33, OD-PL-47 | probe re-run; walk rule executed in five worlds |
| PL-r1-11 (FAIL) | M | CURED (PL's half; A.7) | §4.3 bracket; §16 r2 | MN §4.7 :275's clause and the fold's §5 token row :619 routed (§5) |
| PL-r1-15 (FAIL) | M | CURED (PL's half; B) | §8 contest row and pins line, OD-PL-41, P41 | §5.2 occasion (2) reads the hold; CH :635 and :660 routed |
| PL-V1 | M | CURED | §8 channel row, §9 PL-9, OD-PL-35/41, P41 | `stressorsEnabled` gate quoted; presets quoted |
| PL-V2 | M | CURED (the verifier's first cure) | §0 row, §5.5 AUTHORITY/SOURCES/STATE, §9 PL-9, P20, P35, OD-PL-35 | `decisionTier.js`, the partition and the contract test read |
| PL-V3 | M | CURED | §2 two reads, §5.6, §2 token row, P39, OD-PL-45 | both tails read; the tick-less DM row measured |
| verifier minor 1 | m | CURED | PL7 | the `vassal_rebellion_quashed` roll vs the hearing verdict |
| verifier minor 2 | m | CURED | §2 `crownReachAt` | the observer reads the hold; signature kept |
| A.7 | — | = PL-r1-11 | §4.3 | — |
| A.8 | — | NOTED | OD-PL-44 | RN cites `crownReachAt` |
| A.14 · C.Q3 | — | CURED | PL7, §4.6 door, P40, OD-PL-46 | the detector reads treaties and coalition joins only |
| B (PL) | — | = PL-r1-4 / -6 / -15 | — | — |
| C.Q4 | — | CURED | §4.3 incursion arm, P42, OD-PL-48 | PS §7.5, PS14 |
| C.Q1 · C.Q2 · D | — | NOT PL's | — | no PL passage reads them |
| E | — | APPLIED | §4 sites bracket, §15.12 patrols line, the doctrines bracket, OD-PL-49 | ST §10 row, ST §6.3/§6.6; L-PR items 5/7/12/13/15/18 |

## 3. STOPS
None. Every cure follows a chair direction (RULINGS-ROUND2 A.7, A.14, B, C.Q4, E) or the verifier's own offered cure (PL-V1, PL-V2's first option, PL-V3). No cure needs a kernel line, and no cure contradicts an owner word.

## 4. REFINED (each bracketed in the volume, vetoable)
1. **Two authority rows instead of one.** RULINGS-ROUND1 PL-r1-2 said "ONE cause row making `polity_verdict` auto-apply". PL now has two `auto` rows: `polity_verdict` (sealed, minor) and `polity_verdict_default` (`campaignAltering: true`). They keep the ruling's substance and differ only in the majors marker.
2. **The ladder's organic seat rows need the war presets.** They need the war layer and war termination lit (§8 `politySuccessionEnabled`, §9 PL-8, §2).
3. **The 10-18 doctrines bracket** sits under the status line. No passage needed changing.
4. **Sites considered** is one bracket after §4.6.
5. **Patrols considered** is §15.12.

## 5. OTHER FILES' HALVES — routed to the chair and the owning lanes (this lane wrote none of them)
1. **MN §4.7 :275 (MN's lane, A.7).** Strike "PL's `relief_answer` CLIMAX hearing stays the hearing of an ARMY's siege, and PL §4.3's clause that also takes 'a menace at its walls' is routed to D-PL". PL's `relief_answer` is the one decision for every siege, never a registry kind.
2. **The fold (P4 or D-FOLD-r2).**
   - §5 :619: move `relief_answer` out of PL's "kinds" into its decision vocabulary.
   - Add the round-2 tokens `polity_verdict_default`, `seatEpisodeKeyOf`, `requestFealtyRow` and `FEALTY_EPISODE_PREFIXES`.
   - §3.4 `polity_war` ↳ (:471) and OD-FC-45 ↳ (:819) say "ONE cause row"; they need a bracket for the two rows and the default-as-major rule.
   - OD-FC-45 also needs the channel's shared row.
3. **CH (CH's lane, B).**
   - :635 `paragonGateEnabled` and CH-5's TIER line :660 still say "the crown's ban `polityEnabled`". Both should cite `polityHoldEnabled`.
   - :500 says "the hold's protection term and the fealty question read the defiance". The hold reads a defiance only through the deference patch, inside `D̄`; its `P` counts protection rows alone.
   - CH's `polity_ban:` prefix is registered (OD-PL-46).
4. **PT and CH, seat change.** With a tick, `seatChangedSince` cannot catch the DM's own tick-less `CHANGE_RULING_POWER` made after the deed or ban. To catch it, either volume stores `seatEpisodeKeyOf(seat)` at mint (its own persisted sub-field) or keeps its DM-card option (STOP-2's precedent). That is each lane's call.
5. **PR (the L-PR compile or its disposition).** Items 7 and 12(c) say members' patrols cross "by the polity-wide passage charter". PL §4.5's charter carries tolls only (SPL-M13), and PS has members pass on the ladder as allies. PR should cite the ladder. The brief's "firm+" is `staunch`+ in PL's hold words.
6. **PS's OD-PS-18 ("PL to confirm")** is CONFIRMED: harbouring writes `fealty_defied` with the deference patch and never a break (PL7, OD-PL-46). PS's episode prefixes `army:` and `column:` are registered.
7. **ST.** `den_unanswered:<siteId>:<tick>` is registered as a `protection_failed` occasion (§4, OD-PL-46).
8. **The `passage_of_arms` class row in §3** stays the chair's at P4, as round 1 recorded. This lane did not add it.

## 6. OPEN FOR THE CHAIR
1. **REFINED 1, the two authority rows.** Veto it to return to one row, and then record the default-majors carve-out as an owner-visible row beside S5-B3 (the verifier's second option).
2. **A default set aside at the DM's pause.** Under the DM's majors pause, a default he sets aside is offered again every week while its condition holds, so a month advance may stop on each tick until he seals a verdict on the card. This follows from the weekly standing default (fold 24(a)) and is PLAUSIBLE end to end; no probe executed the orchestrator.
3. **The user's question on weather and the sea.** The user asked whether weather and sea routes are already in the books. PL has no weather and no sea passage, so nothing in this lane bears on it.

## CONFIRMED vs PLAUSIBLE
CONFIRMED by code read at `81f1cd963`: the interval keys, the `stressorsEnabled` gate and the presets, the majors classifier, partition and contract test, the tails and the tick-less DM row, and the ladder's war-preset gate. CONFIRMED by execution: the two-cycle (re-run) and the walk rule's five worlds. PLAUSIBLE: the end-to-end behaviour of a withheld or set-aside default under the orchestrator (no orchestrator probe), the incursion arm's aggregation (a design under the chair's C.Q4 ruling), and the sites bracket's "by construction" claim until PL-4's car-0 names each relief input's read.
