# RN-r2-verify — refuting verifier V-RN-r2, P3 round 2b: THE RENOWN (`docs/DESIGN_FP_ARCH_RN.md`, 834 lines, read whole)

Seat: V-RN-r2 (Opus 5.5), chair a73343ed, 2026-10-18. I read these whole: the kit README, `briefs/VERIFY.md`, `SKEPTIC.md`, `DISPOSE.md`, every rulings file (RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 with its ADDENDUM, RULINGS-ROUND2, RULINGS-ROUND2b with its ADDENDUM), the BOARD, `skeptic/SEAMS-r2.md`, the header, re-check table and routes of `skeptic/HOST-r2.md` (it routes nothing to RN), `skeptic/RN-r1-verify.md`, `cure/D-RN-r2.md`, `cure/D-RN-r2b.md` with its probe output, and the routed sections of `cure/D-CH-r2.md` §5.2, `cure/D-PT-r2.md` §5.1 and `cure/D-MN-r2.md` (whose ROUTE notes name the fold and PR, never RN). I cross-read by grep: PS13 and PS §14, CH §2.2/§2.2b/§8/§9/§16b, PT §2.1/§7.3/§9/§15, PL §2 (`crownReachAt`), ST §2.1/§7.3, PR (`courtRegardOf`, 0 hits).

I checked code at master `81f1cd963` in the detached worktree, read-only. I executed one probe: `<scratchpad>/vr/supersede.mjs` → `supersede.out`, written to my session scratchpad because this seat may write only this report. It imports master read-only. I touched no git and no tests.

## COUNTS
**23 BLOCKING/MAJOR/routed dispositions verified: 22 HOLD · 1 FAIL · 0 STOP · 2 NEW MAJOR · 0 NEW BLOCKING.** These rows cover both lanes this round. D-RN-r2 contributed the 12 rows that round 2a re-cured, which no verifier had seen. D-RN-r2b contributed 3 SEAMS-r2 MAJORs, the HOST-r2-5 correction, 7 routed sibling rows and 1 REFUTED. The two NOTED rows (HOST-r2 routes nothing; the fold's parenthetical) are confirmed. MINOR rows were spot-checked and are not counted.

**Outcome.** The two big cures hold. The first is the person stage's three rebindings (`envoyPulse.js` confirmed: the early return hands back `regionalGraph, wizardNews, settlementUpdates` as given, and the full path reads `let feed = wizardNews; let updates = settlementUpdates;`). The second is the corps key `u:`, now carried the same way by CH, PS and PT. One cure fails. RN-V2 stores the heard magnitude, but the heard pass re-reads only when the parts mask changes, so a better telling never refreshes it.

There are two new MAJORs:
- The two SEAMS-r2-13 cures diverged. PS still says "a court's fame moves", while RN says no court has fame.
- The round-2 verdict deed inflates the notoriety it projects. A `whispered` stamp reads `notorious` or `infamous` in towns up to four hops away, and that flips the landed gate.

## THE TABLE (the FAIL in full; HOLDs one line each)

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| **RN-V2** | CURED (the term's `mag`; the heard doer) | **FAILS** | The trigger was not widened with the field. §5.1 (l.317): the pass "scans each settlement's rumor ledger for `deed:` tellings whose visible-parts digest `ver` differs from the holder's stored term (an arrival, a better telling superseding … or a correction)". `ver` is the parts MASK (§2.1 l.148), which changes only at the 0.75/0.5/0.3 thresholds. `rumorNetwork.js :: pickBetterTelling` supersedes on CONTINUOUS completeness first: `if (a.completeness01 !== b.completeness01) return a.completeness01 > b.completeness01 ? a : b;`. **EXECUTED** (`supersede.out`): a stored telling at completeness 0.765 and magnitude 2, merged with one at 0.9 and magnitude 3, gives `mergedMagnitude: 3`, `sameVisiblePartsBand: true` (`detail`) and `mergedArrivalTick: 5`. The town's ledger now holds band 3, but the term keeps band 2, and §5.3's body re-reads the term's `mag`. So "exactly the version a body re-reads" is false again in `full_simulation`, and R41's "a later, better telling at band 3 replaces the term" cannot fire. The same gap applies to a corrected `doerRef` (PT-4's swap). Cure: the re-read key is the triple (`ver`, `mag`, `doerRef`), and a changed doer moves the deed's one term to the new subject. |
| SEAMS-r1-8 | CURED | HOLDS | `deedId` = FNV(`eventRef · tick · ordinal`). The tick comes from `applyPartyImpact`'s `const tick = worldState.tick;`, and the feed entry carries `tick: normalizedTick` from the same tick, so the `(feedRef, tick)` guard matches. The cross-door refusal applies only against a different source. R39 is pinned. |
| RN-r1-6 | CURED | HOLDS | The verdict news id survives `wizardNews.js :: normalizeEntry` (`id: String(entry.id)`). It is appended through `newsToAppend = [… npcVerdictNewsEntries …]` before `advanceEnvoyDiplomacyPulse({ … snapshot: postTimeSnapshot, regionalGraph … })`. The stage has the snapshot and graph, so no kernel line is needed. (The scope it now projects is RN-V7.) |
| RN-r1-11 | CURED (restated) | HOLDS | RN3, R27, R40 and §17 now state honestly that the two facts can part. |
| RN-r1-12 | CURED | HOLDS | PL §2 l.121 gives `crownReachAt(worldState, snapshot, rootId, memberId, observerId)`, with the liege share for a direct vassal and × reach for a sub-vassal. RN passes observer = member. |
| HOST-r1-7 | CURED | HOLDS | `lawWord.js :: lawWordFor` and `conquestDoctrineStage.js :: natureWordFor` are both exported. There is no town aggression read, H30 is named, and the lighting gate is struck in RN and in PT §15. |
| SEAMS-r1-6 | CURED | HOLDS | §5.5 matches A.5, and PT §7.3's producer row agrees ("the voice itself (a person; persons lit)"). |
| RN-V1 | CURED | HOLDS | `heardAt` uses the undecayed reach, and the ring shrink is fame's alone (R40). |
| RN-V3 | CURED | HOLDS | `npcVerdictTable.js` stamps `scandalClass: SCANDAL_BY_SOURCE[source] \|\| 'venality'`, and the rows key on it. (The over-reach is RN-V7.) |
| RN-V4 | CURED | HOLDS | The rule is narrowed to town and court holders, and R43 agrees with CH §11. |
| RN-V5 | CURED (a–e) | HOLDS | PT l.49 and §2.1 say PERSISTED `spatialLedgers.party.credibility` with the refold. PT's deed fields (`backing`, `moralWeight`, `proof`, `reasonGiven`, `actAt`, `witnessIds`, `partySeq`) are all named in RN's normalizer. |
| D-RN-r2-N1 | CURED | HOLDS | `moveNpcRecord({ worldState, wnpcId, hostSettlementId, patch = {}, sinceTick })` merges `{ ...current, ...patch }` through `normalizeRecord`, and `applyNpcVerdict` holds `holding` and the existing id from `graduateNpc`'s one-way door. |
| SEAMS-r2-6 | CURED | HOLDS | `u:<unitKey>` is consistent in CH (l.216, 646, 728, 1005), PS (l.132, 299) and PT (l.46, 131). `paragonCorpsEnabled`, `freeCompaniesEnabled` and `unit.<rootOriginId>.<fissionTick>` exist in CH and WC. |
| SEAMS-r2-11 | CURED + REFINED | HOLDS | PR has 0 `courtRegardOf` hits. Its joins read the pair state. The `null`/`pair_state` read is pinned (R51). |
| SEAMS-r2-13 | CURED (RN's half) | HOLDS | The slot row and kinds are present (l.239, R50, OD-RN-37). The residual left in PS is RN-V6. |
| HOST-r2-5 | CURED | HOLDS | §3.1 says "the window (H9) … H16 is the map's INBOUND door". |
| D-CH-r2 §5.2(a) | CURED | HOLDS | The rebinding comes before `dropStaleMeetingLedgers`, so `meetingLedgers` is computed from the rebound world. `snapshotWithUpdates(snapshot, settlementUpdates, …)` (l.261) and l.321–322 read the rebound values. The probe output was re-read. |
| D-CH-r2 §5.2(b) | REFUTED | HOLDS | RULINGS-ROUND2b: "the `c:` prefix stays the court body", and CH now carries `u:`. |
| D-CH-r2 §5.2(c) | CURED | HOLDS | `mergeArrival` keeps `arrivalTick: Math.min(…)`. CH l.209 and l.445 cite `heardAt(…).heardTick`. |
| D-CH-r2 §5.2(d) | CURED | HOLDS | CH l.463, 482 and 722 register the two rows at zero host lines. |
| D-PT-r2 §5.1(a)/(b)/(c) | CURED | HOLD | `partySeq` is named, the non-rippling scope matches PT l.34, and the reader is struck (PT l.309 `later` reads `partyCredibilityAt`). |

## NEW FINDINGS (introduced by this round's cures)

| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| RN-V6 | MAJOR | RN1 (l.78), R50, OD-RN-37 against PS13 (PS l.113) and PS §14's RN row (PS l.556) | The two SEAMS-r2-13 cures contradict each other on court fame | RN: "A SETTLEMENT doer's deed … adds no fame to anyone: it travels as a TALE" and R50 "no fame for A's court". PS (08:30, unchanged since): "so the tale travels and a court's fame moves", and §14: "so a crossing travels as a TALE and a court's fame moves". `fameOf` takes only a person, a corps or the party, so a PS builder has no API to call. RN routed the clause (D-RN-r2b §5), but it is still in PS. RN's side is coherent: no other volume claims court fame (ST, PR, CH, PL, MN and PT have 0 hits). | PS strikes "and a court's fame moves" at both sites. RN needs no edit. |
| RN-V7 | MAJOR | §3.1 `npc_verdict` (l.226) × §3.2 significance (l.251) × §4.4 (l.293–298) × RN4 ONE FADE | Since round 2, the verdict deed's projected fame ignores the stamp's breadth, so the projection inflates notoriety and flips the landed gate | The verdict's target is "the sentencing court". §3.2 makes a deed `major` when "its target is a ruler, a court", so every verdict is major. `maxHopsFor` returns `return Number(record.score) >= 95 ? 5 : 4;`, and the scope is `regional` once the walk passes the witnesses, or `realm` at ≥60%. A `whispered` stamp (magnitude 1) therefore projects `notorious`, and `infamous` at realm, wherever the town is not warm (venality reads `shameful`). That replaces the landed read for every sentenced person (RN4: "`believedReputation` returns the projection's band"). In `npcCirculationTable.js :: rejectionFor`, `strict = loudness >= REJECTION_NOTORIETY_RANK` (`2`, i.e. `known`) arms scandal refusals, and `loudness >= notorietyRank('infamous')` refuses outright. Both now fire four hops out for a petty jailing that the table scored as whispered at home. RN's `a_decade` pace keeps a regional verdict notorious for roughly four years, against the landed fade of one step per `BELIEF_FADE_TICKS: 40`. Round 1 hid this, because its deed could walk no graph. | Cap an `npc_verdict` deed's `projectedScope` at the stamp's breadth: `whispered` → `settlement`, `known` → `regional`, `notorious`/`infamous` → the walk. Alternatively, exempt the verdict's court target from §3.2's major rule. Then add an R-row for a `whispered` exile. |

**MINOR, not counted:**
- §3.1's sites bracket says "ST's actor convention gains `site`", which the RULINGS-ROUND2b ADDENDUM (ST-r2-14) withdrew.
- §2.4 says the findings' prefix is "CH's to name", but CH has named it `rendezvous:<wnpcId>:<aim.sinceTick>`.
- `believedWhereabouts` uses "the newest deed about it" in CH l.209 but "whose doer is the paragon" in RN §2.3.
- A corps holder's lens two has no fallback for a settlement actor: §6.2 names a residency town for persons only.
- PT §7.3's voice is "a person", yet RN §5.5's famous holder may be a `u:` corps.
- Carried from earlier rounds: §4.3 says the omniscient presets have "no delay" while the same paragraph applies `hopDelayTicks`, and the fold's `party_voiced` trigger says "a court" (RN's open question 4, for the chair).

## CONFIRMED vs PLAUSIBLE
RN-V2's fail is CONFIRMED BY EXECUTION for the supersede (`supersede.out`) and by quoted volume text for the trigger. RN-V6 is CONFIRMED by quoting both volumes. RN-V7's rule chain is CONFIRMED from the volume's own text and the code thresholds (`maxHopsFor`, `REJECTION_NOTORIETY_RANK: 2`, the infamous bar), but how often it fires (how many towns four trade hops reach, and the 60% realm share) is PLAUSIBLE. No PLAUSIBLE item has been upgraded.
