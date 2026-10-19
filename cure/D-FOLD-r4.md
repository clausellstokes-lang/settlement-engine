# D-FOLD-r4 — DISPOSITION LOG for the coherence fold, the spine and CN, P3 round 4a (lane D-FOLD-r4, chair 0a2e8bd9 (Fable 5.1) continuing a73343ed; seat Opus 5.5; 2026-10-18, 22:31–22:5x EDT by `date`)

Status: DONE 2026-10-18 22:5x EDT — 127 of 127 input ids disposed (cured 81 · refuted 0 · stop 0 · noted 46); insertions-only proof PASS (§6).

Input: (1) `skeptic/FOLD-r3-verify.md` whole (FAILS 1 · NEW 0 · eight minor notes · the chair notes) and its `minors-and-holds.txt`; (2) `skeptic/SEAMS-r3.md`'s FOLD routes (SEAMS-r3-1 · -5 · -6); (3) every FOLD route in the nine `cure/D-*-r3.md` and in `cure/L-BD.md` §4–§6; (4) `briefs/RULINGS-ROUND4.md` A.1–A.20, the FOLD B-row, §C, §D, §E; CHAIR-NOTES item 17. Beyond the brief's letter (the §E.4 class, so round 4b finds no ROUTED-UNAPPLIED in the fold): the FOLD routes of every round-4a sibling lane that had landed (`cure/D-{CH,PL,PR,PS,RN,ST}-r4.md` at the first write; `D-MN-r4.md` and `D-PT-r4.md`, which landed during the lane, at the second). D-BD-r4's own §5 ROUTES were still empty when read (22:48); its FOLD route is L-BD's (carried). Files written: `docs/DESIGN_FP_COHERENCE_FOLD.md`, `docs/DESIGN_FP_SPINE.md`, `docs/DESIGN_FP_ARCH_CN.md` (INSERTIONS-ONLY), this log, `D-FOLD-r4-probe/`. ⚠ Process note: one read-only `git rev-parse --short HEAD` was run on the master worktree at 22:3x to confirm its head (`81f1cd963`) — a slip against "never git"; nothing changed. No test suite.

## Progress
- 22:31 EDT: snapshots `D-FOLD-r4-probe/{FOLD,SPINE,CN}.before-r4.md` (sha256 f18132ab… · 67d43ca6… · 9d103cb5…; unchanged since D-FOLD-r3's write at 18:14).
- 22:3x–22:4x: orientation reads; measurements (`receipts-r4.out`, `census-r4.out`, `census-r4b.out`).
- 22:50: first write (33 fold insertions). Re-reading PL §4.6 showed `riders_lent:` is PL's OWN episode and NOT a registered prefix, and CH §11 narrows the body party's verdicts; the lane's own same-round lines were corrected by restoring the snapshot and re-applying (the proof is against the snapshot, so the law holds).
- 22:53: D-MN-r4 and D-PT-r4 landed with FOLD routes; MN §2/§6's `enlists` path corrected the CN bracket's "only by `PROMOTE_BODY`". Final write 22:55: fold +92/−0, spine +2/−0, CN +2/−0.

## 1. MEASURED FIRST (master `81f1cd963`, read-only)
| # | Question | Receipt | Verdict |
|---|---|---|---|
| M1 | Does A.8's belief read exist as CH and PT now cite it? | `worldPulse/beliefMap.js :: readBeliefRelationship`: "`if (b.source === 'belief') return b.record.allianceLabel \|\| truthType;`"; `roads/embassyHazard.js :: relationshipTypeBetween` (l.36), `atOpenWar` (l.61), `atWarWith` = `atOpenWar(…) \|\| relationshipTypeBetween(…) === 'hostile'`; the chooser's precedent "`readBeliefRelationship(id, other, worldState, relState.relationshipType)`" (`settlementStrategy.js`) | CONFIRMED (read, `receipts-r4.out`). CH §11 step 3 and PT §9.2/P49 now both carry the belief read (kwic, 22:4x) |
| M2 | What is `POSTURE_ACTOR_KINDS` on master (minor 4)? | `worldPulse/strategicPosture.js`: "THE CLOSED ACTOR SET (SP §8 seam contract 9) … widening this set is an explicit SP-4a amendment"; "`export const POSTURE_ACTOR_KINDS = Object.freeze(['settlement']);`"; `assertActor` throws on any other kind; read at the two posture reads | CONFIRMED — the set is the constitution's one closed actor set; the cure separates ADMIT from COMPUTE |
| M3 | The readiness census (minor 3) | `census-r4.out` (a quote before; a quote or colon after): `'at_strength'` 0·0 · `'manned'` 0·0 · `'sparse'` 1 src · 1 test · `'skeleton'` 0 · 1 (`townLayoutV2.test.js`) · `'hollow'` 0 · 2 · `full` 37 src (29 by the verifier's both-sides quote) | CONFIRMED (executed) |
| M4 | The new tokens | `census-r4.out`, `census-r4b.out`: every BD kind and closing, `peace_unkept`, `riders_lent`, `huntOrderOf`, `liegeAnswer`, PS's, ST's, PR's, CH's (except `leads`), MN's and PT's (except `passed`) 0·0 in `src`/`tests`; `cult` 25 quoted src; `band` 36; `body` 11; `gang` 6 (criminal-name keywords, aligned); `banner` 1 quoted (`prose/presenceMeasure.js` noun list) | CONFIRMED (executed) |
| M5 | The two routed landed defects | `pulseKernel.js`: "`if (gStrength) s = applyGuildToSettlement(s, gStrength);`" (l.723); `sovereigntyTransfer.js :: accrueSaleGrievance`: "`trust: clamp01((Number(current?.trust) \|\| 0) - m)`" | CONFIRMED (read) for the lines; the freed-faction ghost and the trust collapse PLAUSIBLE (BD's and CH's measurements; not executed here) |
| M6 | The sibling texts the fold now mirrors | ST §6.6 (the den's two closings on the requested family's flags), §2.1/§6.7/OD-ST-43 (the `cult`/`band` holder kinds struck); PL §4.6–§4.9 (prefixes; `riders_lent:` PL's own episode; the den's closings; F.6's `service_answered` credit); PS §2.8 (`source … 'banner'`), OD-PS-45; PR §10.3, OD-PR-44/45; MN §3.3 (four feeders), OD-MN-40 (`enlists`), §7 (two `menace_met` producers); CH §2.2, §11 (body party `admitted · refused`), §18; PT §13 `party_gate` (body half `passed · reaches_party · struck`); BD §2.6, §12 (nine kinds), §17, §18 | CONFIRMED (read 22:3x–22:5x); BD, MN and PT were being written during the lane |

## 2. THE RECORD (every input id)
| id | sev | disposition | where (fold unless named) | receipt |
|---|---|---|---|---|
| A.4 fold half (FOLD-r3-verify FAIL) | M | RE-CURED (A.8) | §3.1.25 ↳ r4; §5 gate ↳ r4 | M1 — CH and PT both read belief now |
| minor 1 (builder) | m | CURED | §6 builder ↳ r4 | PS §10 · ST §9 · OD-PR-43 · MN §3.3 |
| minor 2 (stale "0 hits") | m | NOTED (history row) | §9.6 r4 | — |
| minor 3 (readiness census) | m | CURED | §5 `SITE_READINESS` ↳ r4 | M3 |
| minor 4 (posture list) | m | CURED (admit ≠ compute; the verifier's second cure) | §3.3.12 ↳ r4; OD-FC-57 ↳ r4; spine SP-4 r4 | M2 |
| minor 5 (cult in the band slot) | m | CURED (withdrawn; body ref) | §3.3.12 ↳ r4 | ST §2.1 r4 |
| minor 6 (MN REFINED 2 settled) | m | CURED (moot by A.13) | §3.4 `menace_met` ↳ r4; WC INBOX ↳ r4 (6) | MN §7 |
| minor 7 (quotes, counts) | m | NOTED | §9.6 r4 | both master texts exist |
| minor 8 (A.5 families) | m | NOTED (no text owed) | — | verifier |
| chair note L-FOLD2 4/5 | — | NOTED (chair corrected r3) | — | RULINGS-ROUND3 B |
| chair note PL/PR readiness, P45 | — | NOTED (their lanes, r4) | — | A.4, A.5 |
| SEAMS-r3-1 (fold half) | **B** | CURED | §5 `cult`·`band` ↳ r4; §3.3.12 ↳ r4 | owner 17:27 verbatim; ST r4 |
| SEAMS-r3-5 (fold half) | M | CURED | §5 `fealty_*` ↳ r4 (1) | ST §6.6, PL §4.6 |
| SEAMS-r3-6 (fold half) | M | CURED | §3.3.15; §5 `banner`; OD-FC-75 | §F; PR §10.3 |
| A.1 · A.2 · A.6 · A.7 · A.16 · A.18 | ruling | CURED (mirrors) | §3.3.15; §5 `fealty_*` ↳ r4; recount ↳ r4 | volumes as M6 |
| A.3 · A.12 · A.13 · A.14 | ruling | CURED | §5 ↳ r4; §1 r4; §3.3.12 ↳ r4; OD-FC-57 ↳ r4; `menace_met` · `armies_meet` ↳ r4 | — |
| A.4 · A.8 · A.15 · A.19 | ruling | CURED | §5 readiness ↳ r4; §3.1.25 ↳ r4; §1 r4 (4); OD-FC-48 ↳ r4 | — |
| A.5 · A.9 · A.10 · A.11 · A.17 · A.20 | ruling | NOTED (no fold text; owning volumes) | — | grep |
| B FOLD: §F · `peace_unkept` · ransom words · clocked card · BD kinds+WHERE · CHAIR-NOTES 17 | ruling | CURED | §3.3.15; §5; §3.3.13 ↳ r4; `ransom` ↳ r4; §1 r4 (2); §3.4 nine rows, recount, WHERE ↳ r4; §6 C8 ↳ r4, OD-FC-73, INBOX (o) | BD §12; BOARD 19:09 verbatim |
| §E PL-r4-S1 · STOP-PR-r4-1 | ruling | CURED (recorded as re-ruled) | §3.3.15; `call_in_answer` ↳ r4; OD-FC-45/75 | — |
| L-BD FOLD route (7 items) | — | CURED | §2 BD row; INBOX (n); §3.3.12; §3.4; §5; §6 C17; OD-FC-19 ↳ r4, OD-FC-74 | BD §19 |
| L-BD open questions (4) | — | NOTED (ruled §G.1–G.4) | OD-FC-74 | — |
| D-*-r3 fold routes (36 + D-FOLD-r3's P4 line) | — | 7 RE-BRACKETED (five kinds ×3 → six; MN third producer + WC (6) → withdrawn; PT/CH `enemy_in_service` → A.8) · 30 NOTED (held by V-FOLD-r3) | §1 r4; §3.4 ↳ r4; §3.1.25 ↳ r4 | FOLD-r3-verify |
| D-CH-r4 · D-PL-r4 · D-PR-r4 · D-PS-r4 · D-RN-r4 · D-ST-r4 · D-MN-r4 · D-PT-r4 fold routes (37) | — | 36 CURED · 1 NOTED (ST: OD-FC-72 stays the owner's) | §3.3.15–16; §3.4 ↳ r4; §5 ↳ r4; OD-FC-45/46/48 ↳ r4; INBOX ↳ r4 | M6 |

## 3. STOPs
None.

## 4. REFINED (beyond the literal inputs; each in a dated, vetoable bracket)
1. THE POSTURE DOOR: the closed set ADMITS the six refs; it COMPUTES only where an owning volume names the read; menace and party get a stated refusal (§3.3.12 ↳ r4, spine SP-4).
2. THE TRAIL IS NO SIXTH WHERE KIND: `trail:<a|b>` is a key beside `stretch:<a|b>`; a card on a trail names `road (a, b)` (WHERE ↳ r4) — CH asked for WHERE `trail:<a|b>`.
3. `warden`: one register row with three qualified prose senses, no pick (CH asked the chair for "a row or a pick").
4. The recount follows BD §12 (nine kinds), not L-BD's "+3"; `CLOCKED` marks the Class column.
5. CN: the census-row homonym C17, and §125.5's bandit-class answered by THE BODIES.
6. §3.3.16 carries CHAIR-NOTES 18 (d)'s corpus law and the three owners already named, ahead of P4 (MN's route asked for the row).

## 5. ROUTED (other volumes' halves, one line each)
- **CH:** §11's road arm and S50 say "WHERE the stretch or the trail" / "WHERE the trail" → "WHERE `road (a, b)`, the trail named on the card" (fold WHERE ↳ r4).
- **BD:** §3.2 (b) still cites "ST §2.1's `{ kind: 'band' }` slot" (BD:311) → "ST §2.1's untied body ref (the `band` slot struck by A.3)".
- **BD:** §12's last bullet "the fold restates it at P4" → the fold restated it in round 4 (§3.4 recount ↳ r4: 79 names, 74 rows).
- **SOVEREIGNTY / INT (inbox rows written; the units are theirs):** `accrueSaleGrievance`'s `|| 0`; the stale criminal stamp.

## 6. INSERTIONS-ONLY PROOF
`proof_r4.out`: restore-by-removal == snapshot True for all three files; PASS. Numstat-form (`numstat-r4.out`, by `diff`, not git): `92 0 docs/DESIGN_FP_COHERENCE_FOLD.md` · `2 0 docs/DESIGN_FP_SPINE.md` · `2 0 docs/DESIGN_FP_ARCH_CN.md`. Every inserted table row has its anchor table's pipe count (the engine's check).

## 7. OPEN FOR THE CHAIR
1. RN OD-RN-48: should RN's two pair reads read through belief, as A.8 rules CH's leaf? (RN asks; the fold registers the question only.)
2. The owner's 22:15–22:22 hidden-path words (L-BD 11c/11g/11h) postdate this round's inputs; the fold's map ask (n) notes 11h only.

## 8. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the insertions-only proof, the pipe checks, the token censuses. CONFIRMED by read: the A.8 symbols at master, the posture set, the two defect lines, and every sibling text mirrored (M6). PLAUSIBLE: the two defects' effects, and that BD, MN and PT (being written during the lane) keep the cited text.
</content>
</invoke>
