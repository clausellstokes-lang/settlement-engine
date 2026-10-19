# D-PL-r3 — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_PL.md`, P3 round 3a (lane D-PL-r3, chair 0a2e8bd9 continuing a73343ed; seat Opus 5.5; 2026-10-18, 17:20–17:45 EDT by `date`)

## OUTCOME
All 25 input ids are disposed: 16 CURED (one of them REFINED), 9 NOTED, 0 refuted, 0 STOP.
- **From `skeptic/PL-r2-verify.md` (9).** The FAIL (PL-r1-15), the two NEW MAJORs (PL-V4 and PL-V5), and the six minor notes.
- **From other verify files (1).** The ban-grammar minor in `skeptic/CH-r2-verify.md`.
  - The other seven verify files route nothing else to PL. A grep for "PL", "polity", "fealty", "liege" and "vassal" found only holds.
  - `ST-r2-verify`'s ST-V3 touches PL's text only through A.10.
- **From `briefs/RULINGS-ROUND3.md` (15).** Rows A.1 to A.15. A.5, A.6 and A.8 are the same items as PL-r1-15, PL-V5 and the CH minor. The PL B-section maps one-to-one onto these ids.

**The volume.** It went from 753 lines (222,192 B) to 793 lines (255,201 B) and carries 39 `(fp-final r3)` brackets.
- `D-PL-r3-probe/volume.diff` is the diff, and `PL.before-r3.md` is the pre-round copy.
- Every table still has matching columns: `check-r3.out` reports 19 tables and 0 mismatches.
- Every hunk in the diff is this lane's. The diff was re-run twice to rule out a concurrent writer.

Git was not touched. The test suite was not run. Master `81f1cd963` was only read.

## 1. FIRST ACT — the measurements that could refute the cures
These were taken on master `81f1cd963`, read-only. The output is in `D-PL-r3-probe/measure.out` and `a-rows-grep.out`. All are CONFIRMED unless marked.

**The tick's stage order (`pulseKernel.js`).**
1. `coupVerdictOutcomes({`, l.525
2. `let war = evaluateWarLayer({`, l.994
3. `const applied = applyWorldPulseOutcomes({`, l.1578
4. `advanceEnvoyDiplomacyPulse({`, l.2194
5. `const armyTransit = advanceArmyTransit({`, l.2442
6. `advanceSettlementLifecycle({`, l.2630
7. `const treatyAdvance = advanceTreatiesWithDisposition({`, l.2752 — the POLITY STAGE's host

What this order means for the incursion arm:
- **The polity stage runs last.** PS's one border contest is fought inside army transit. PS §7.5 says so, and so does RULINGS-ROUND3's PS minor ("joins the kernel's `fought` set"; `armyTransitKernel.js`: `const fought = new Set();`).
- **With hearings dark, or in any week of a long advance**, a contest fought in the incursion's first week comes BEFORE a polity-stage answer.
- **With the hearing week lit at a one-week advance**, the answer from week t precedes the contest. The contest is fought at t+1, when the docket resolves.

**A.6's citation, for the chair.** A.6 says "Polity hearings resolve before passage hearings inside the week (SP-9's chain order; the registry's order)". That citation does not hold:
- SP-9 heads the CHAIN order, which is a BUILD order (fold §3.4, ruling 4).
- The fold defines no intra-week order between kinds.
- `relief_answer` is not a hearing. It is an input line on the card.

A.6's intent is still built, in two ways:
- **One card, one order.** The card's relief line resolves before its verdict, in MN §4.7's own words.
- **The answer is taken at first sight.** The one pure, draw-free decider is called where the incursion is first seen (PS's leaf), so the answer exists before the contest in every arm.

This is a cure, not a STOP: the intent is buildable, and only the citation is inexact.

**The relief share (`warCapacityReads.js :: computeAllyRelief`).**
- The fraction: `const ALLY_RELIEF_FRACTION = 0.4;` (module-private; MN §4.7 designs it as "exported once").
- The per-ally term: `relief += (Number(capacityFor(ally)?.homeDefense) || 0) * ALLY_RELIEF_FRACTION;`.
- The siege skip: `if (besiegedSet.has(ally)) continue;`.
- THE SITES (ST10) subtract a keep's `siteDefense` from relief. PL's formulas say "`computeAllyRelief`'s per-ally term" so that rule carries through.

**What the answer's patch moves.**
- `rulingPowerSeat.js :: vassalageSeat`: grip01 reads leverage, dependency, pact, fear and `− VASSAL_RESENTMENT × resentment × (1 − fear)`. **Trust is not a grip term.**
- Trust is read by the stable compact: `const stableVassalage = clamp01(relState.trust * 0.34 + …`.
- So PL-V5's PLAUSIBLE half ("through the trust patch, grip, and so deference") is false at master. This is REFUTED by receipt, and the cure does not change.

**The landed FNV.** `src/kernel/proseHash.js :: fnv1a32` (A.14).

**Token census.** These are FREE in `src` and `tests` (0 · 0): `reliefAnswerOf`, `patrol:`, `corps:`, `polity_ban`, `FEALTY_ROW_FAMILIES`.

**The A-rows read against PL** (`a-rows-grep.out`). PL contains 0 hits each for:
- `␟`, `hashInt`, `cut01`, `pairKey`
- `fundingBandOfSettlement`, `settlementFundingBand`
- `party_voiced`, `believedWhereabouts`, `paragonLean`
- `POSTURE_ACTOR_KINDS`, `holdBeforeNode`, `waypoint`

There is 1 hit for "garrison band" (OD-PL-33) and 2 for "FNV".

## 2. THE RECORD
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| PL-r1-15 (FAIL) | M | CURED (A.5) | §4.6 · §5.6 · §6 · §7 · §8 (three rows + THE FEALTY RECORD'S FAMILIES table) · §10 shape 3 · P41 · P46 · OD-PL-41 · OD-PL-52 | A.5's four families; the verifier's first cure form. With succession lit and obligations dark, the baseline, the rows and the dark-hearings carrier are now SUCCESSION's own. |
| PL-V4 | M | CURED | §4.6 ×3 · §2 census · P40 · OD-PL-46 | PS §2.1: `'patrol:' + detachmentId`, `'corps:' + unitKey`. The r2b bracket names all four prefixes. |
| PL-V5 | M | CURED (A.6; PS-and-PL joint row) | §3.5 · PL8 · §4.3 ×2 · §9 PL-4 · §10 · §13 · P9 · P10 · P42 · P45 · OD-PL-48 · OD-PL-53 | The share term; the measured stage order; the decider called at first sight; the two facts. Its PLAUSIBLE half is REFUTED by receipt (trust is not a grip term). |
| m1 §15.12 "like every other host fact" | m | CURED | §15.12 | The fold's INBOX (h) ↳: H9 · H23 · H13 |
| m2 stale singulars | m | CURED | §9 PL-9 · OD-PL-35 | §5.5: two rows |
| m3 sub-vassal `share01 > 0` | m | CURED (struck) | §15.12 | Under the root's own `staunch`+ read, reach ≥ 0.10 × 0.2 = 0.02 |
| m4 "§3.1 b" | m | CURED | §3.1 (e) · §15.12 | §3.1 (b) is the summons |
| m5 `den_unanswered` gets no patch | m | CURED | §4.3 | A.6's narrowing |
| m6 `claim` with the contest dark | m | CURED | §5.6 · §7 · §8 · P41 | A.5 |
| CH-r2-verify ban-grammar minor | m | CURED (A.8) | §4.6 · §2 · P40 · OD-PL-46 | `polity_ban:<subjectKey>:<banTick>`, with `p:` and `u:` (RN §2.2) |
| A.1 | — | CURED (one clause) | §4.1 | ST §4.1: "the keep neither marches nor is drawn" |
| A.10 | — | CURED (one clause) | OD-PL-33 | The readiness word, never `STRENGTH_BANDS` |
| A.14 | — | REFINED | §2 | `fnv1a32` named |
| A.5 · A.6 · A.8 | — | = PL-r1-15 · PL-V5 · CH minor | — | — |
| A.2 · A.3 · A.4 · A.7 · A.9 · A.11 · A.12 · A.13 · A.15 | — | NOTED | §16 r3 | `a-rows-grep.out`; PL has none of the texts these rows touch |

## 3. STOPS
None.

**One alignment the chair should check (not a STOP).** PS's round-3 lane writes concurrently, and its text at 17:39 disagrees with PL on who takes the incursion's answer:
- **PS's text** (§7.5 l.356, PS14 l.124): "PL's polity stage takes it the week the incursion first appears … inside one week polity resolutions come before passage ones (SP-9's chain order) … a `sent` taken AFTER the one contest was fought adds nothing to it".
- **PL's text** (§4.3 r3 (2)): PS's incursion leaf CALLS the decider at first sight, before the contest. The answer rides the crossing row, and the polity stage mints its row.
- **Why PL chose the first-sight call.** Under PS's wording the share can never enter a contest when hearings are dark or on any week of a long advance. In those cases the receipt "sent, but too few" would be false: the soldiers came too late, not too few.
- **What is left.** The PS half is routed. If PS's lane or the chair prefers PS's wording, PL's (2) becomes a stated degraded arm instead, and the receipt there reads "too late".

## 4. REFINED (each bracketed in the volume, vetoable)
1. **The siege arm takes A.6's two facts.** The OUTCOME is written at the siege's end (`falls` gives `protection_failed`; `relieved` or `lifted` gives `protection_kept`). This replaces the round-1 mapping, where `kept` gave `protection_failed` and `sent` gave `protection_kept`. The reason is that one record word should keep one meaning and `P` should read one quantity (§4.3).
2. **The incursion's answer is taken at first sight through `reliefAnswerOf`.** The decider gets its code name. This follows from the measured stage order (§4.3 r3 (2), §9 PL-4).
3. **Two occasions A.5 did not name are placed by the same rule.** A refused arbitration's `fealty_defied` goes to OBLIGATION (§6, §8). The `fealty_break` verdict's carrier row goes to BREAK (§8).
4. **The SUCCESSION family's freshness clause.** When the flag relights, a stale seat change is baselined and never asked; `polity_fallen` follows the same rule. The one residue is a tick-less DM change made while the flag was dark, which is still asked (§5.6, §10, P46).
5. **`fnv1a32` is named for PL's FNV hash** (§2, A.14).

## 5. ROUTED (the other halves; one line each, by volume)
- **PS:** In §7.5 l.356 and PS14 l.124, take the liege's answer AT FIRST SIGHT. That means calling PL's `reliefAnswerOf` in the incursion leaf before the contest and carrying the answer on the crossing row as the card's line, which is one declared sub-field. Strike "polity resolutions come before passage ones (SP-9's chain order)" and "a `sent` taken AFTER the one contest … adds nothing". Optionally, read the share in §4.3's `barred`/`unopposed` threshold too; that is PS's call.
- **MN:** M11's `protection_failed` holds only where the menace siege ends `falls` (otherwise `protection_kept`). In §4.9, "which moves the town's grip" should read: the ANSWER's resentment moves grip, and the OUTCOME moves the hold's `P` (A.6, PL §4.3, OD-PL-53).
- **CH:** The harbouring row's flag becomes CH's own flag ∧ `polityEnabled`, not `polityObligationsEnabled` (A.5). The lines are l.533, 539, 692, 718, 799, 849, 976 and 983. The episodes become `polity_ban:p:<wnpcId>:<banTick>` and `polity_ban:u:<unitKey>:<banTick>`, replacing `polity_ban:corps:…` (A.8; S12, §11, OD-CH-13).
- **PR:** In R21, OD-PR-26, PR11 (l.119) and §10.3 (l.409), the `crownReachAt(…).share01 > 0` condition is redundant. Under the crown's own `staunch`+ read the share is at least 0.02, so "shuts out a sub-vassal under a frayed link" cannot fire. Strike it or re-word it.
- **ST:** The `den_unanswered` request runs under ST's own flag ∧ `polityEnabled` (A.5). It moves the hold's `P` only, with no patch (A.6). §6.6 is otherwise consistent.
- **PT:** The ban grammar is A.8's one form wherever PT names a harbouring or ban episode. PT's `banKeys` hold seat episode keys, which are a different fact and are unchanged.
- **FOLD (P4):**
  - In the §3.4 `call_in_answer` ↳ row (l.466), the `FEALTY_EPISODE_PREFIXES` list gains `patrol:` · `corps:` and A.8's `polity_ban:<subjectKey>:<banTick>`.
  - The §5 `fealty_*` row records the families (OD-PL-52) and the two facts (OD-PL-53).
  - Register `reliefAnswerOf`.
  - OD-FC-45 ↳ for OD-PL-52 and OD-PL-53.

## 6. CONFIRMED vs PLAUSIBLE
- **CONFIRMED by code read at `81f1cd963`:** the stage order, the relief term, the grip and compact terms, and `fnv1a32`.
- **CONFIRMED by both texts:** PS's unit-key prefixes and the RN keys.
- **CONFIRMED by execution:** the table integrity (`tablecheck.py`).
- **PLAUSIBLE:** that the first-sight call and the polity stage's later mint agree. The decider is pure and draw-free, but its belief inputs are read at the transit stage.
- **PLAUSIBLE:** the share entering every crossed member's contest (one relief force, macro).
- **PLAUSIBLE:** the relight baseline's freshness window (`since = tick − 2`).
