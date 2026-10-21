# V-ALL-p5 — the refuting verifier over every P5c disposition (chair 6eb7b5b6; seat Opus 5.5; 2026-10-20)

**COUNTS: holds 15 · fails 3 · stop 0 · new 1 (0 BLOCKING · 1 MAJOR).**

Scope: all 14 MAJOR ids (P5W-1..3, P5C-1..11), BD's MAJOR-weight `arriveAt` route, D-FOLD-p5's two REFUTED rows, and whether every lane ran. Inputs read: `briefs/VERIFY.md`, `assessments/P5-COMPLETENESS-2026-10-20.md`, `briefs/RULINGS-P5.md` ADDENDUM, the seven `cure/D-*-p5.md`, and each cited section as it stands now. Master `81f1cd963` was read-only. Probes are in `skeptic/P5-verify-probe/`.

The biggest gap: **the MN and RN halves were never applied.** `cure/D-PL-MN-RN-p5.md` §0 says "MN and RN NOT STARTED", and both volumes have 0 `fp-final P5` lines. That lane's §6 list is the exact remaining work.

## Verdicts
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| P5W-1 | CURED (ST §6.3 · fold OD-FC-85 ↳ P5) | holds | ST l.383 states that lordship and attachment are honoured and that the map keeps the partition. ⚠ The ODQ visible row is the chair's to write: `OD-FC-85` has 0 hits in ODQ today. |
| **P5W-2** | CURED (ES-2b row · CH · BD · fold) | **FAILS (PR half)** | A.2 names PR as a bracket owner, but PR has 0 `OPENED` brackets and D-PS-ST-PR-p5 never took A.2. PR l.389 (§8.2, an opened shape) still says "SEIZED only when custody lands (ES-2b, the owner's slot …)". Stale "owner's slot" wording remains at PR l.388/489/726 and PS l.364–365. |
| P5W-3 | CURED (WC §1.1.5 · WY E1 · GENERALS G2) | holds | The four situations are written as one risk read. Minor: WY's first-choice seam will hit its own STOP. `retreatRoute(digest, worldState, from, homeId, null, season)` passes no strength, tick or snapshot (kernel l.901), and the kernel computes the retreat's `weeks` from `hopWeeks` regardless of the path. The PS car-0 fallback is the real seam. |
| P5C-1 | CURED (fold §3.1.23 ↳ · §3.3.16 ↳ (11) · OD-FC-59 ↳ · WC INBOX (16)) | holds | The owner, unit, wave and 7 claimants are named. PL, PS and PR cite `WC-car-0`. MN's one-line cite is still missing (MN lane). |
| P5C-2 | CURED (EP-N) | holds | Host at 296 effective lines (no car needed), leaf, flag, the writer `composeAgeReceipt`, one undo. The single-undo push stays PLAUSIBLE, as marked. |
| P5C-3 | CURED | holds | PL l.136 lists NINE classes and the §3.2 row exists. The fold's ↳ row lists nine. |
| P5C-4 | CURED (PS §7.4 · PR §9.1(a)) | holds | Two registered producers feed one composer with MAX taken once. The pin is restated as "no crossing live AND no report stands". |
| P5C-5 | CURED (BD §10.4 · ES-5a · fold ES (1)) | holds | The door sits in ES's stage, the draw is on ES's keyed stream, and BD is only the caller (m2 measured). The R1 refinement is marked. |
| P5C-6 | CURED | holds | PT l.170 has the DEADLINE arm. Behaviour is MODELLED A1–A6. |
| P5C-7 | CURED | holds | PT l.318 mints `offer_accepted`, and the employer becomes the backer. Minor: RN l.125/231 still list only "the answer `no`" (RN lane). |
| P5C-8 | CURED | holds | `readBeliefRelationship(observerId, subjectId, worldState, truthType)` matches master l.448. EXECUTED (PT probe B). |
| **P5C-9** | CURED (`bodyVisibleDefenceOf`) | **FAILS** | The "public" band reads the truth score. Master `mapProfile.js :: deriveDefensiveTerrain` reads `causal.scores?.defense_readiness` ("Walls plus high readiness yields fortified"). EXECUTED in `visibleBand.out`: walls at readiness 54 give `sheltered`, at 55 `fortified`. The choice therefore still decides on one bit of truth readiness. It also runs `deriveCausalState` per town, which nothing in the pulse calls today (PLAUSIBLE cost). Cure: use the walls rung only (`hasWalls`, the ruined-walls drop), or read readiness through the ties' belief. |
| P5C-10 | CURED (ST §6.1 step 8) | holds | Six reads, with stages present at master. A carrier for blockade (f)'s age exists: master `planBlockade` sets `departTick`/`arrivalTick`, so read `arrivalTick`. |
| P5C-11 | CURED (fold WC INBOX (14) · CH) | holds | CH cites "(13)" eight times. Fold l.386 marks this and routes a re-point to (14). |
| `arriveAt` (BD) | CURED | holds | BD l.327/437/606 match ST l.346: register, then commit on `arrived`. |
| REFUTED — map re-emit (P5C-17) | REFUTED as new | holds | Fold l.362 (j) already asks for the re-emit. |
| REFUTED — C.25 map row | REFUTED as unapplied | holds | Fold l.384 (p)(q) carries both. |
| **MN · RN halves** | — | **FAILS (undisposed)** | Still open: P5C-1's MN cite; C.12/C.14 (`press01`, the nine keys, the unpriced leg, `REGARD_CAUSES`); C.15 (MN composer, RN f:×f:); C.16; C.22 (RN l.413 still names IN's exposure, which PT struck); C.24 (RN `seat_change`); C.25 (`recordSighting` callers, `fought`, the quarter receipt). The fold says these are "pending". |

## New findings
| id | sev | finding | receipt |
|---|---|---|---|
| P5-V1 | MAJOR | ES-2b's custody row (D-BRACKETS-p5, ES l.1585) contradicts itself on persistence. It says "dark ⇒ `normalizeForeignGuestHold` byte-identical — the six-field refusal stands" and also "dark-after-lit: rows kept, inert". On master, every read and write re-normalizes the whole ledger (`writeHolds`: `.map(normalizeForeignGuestHold).filter(Boolean)`; `parsedHolds` likewise), so a body-held row written while lit is deleted by the next landed envoy-hold write while the flag is dark. The dedupe also drops every row whose `errandId` repeats (`counts.errandId.get(String(row.errandId)) === 1`), so any two errand-less captives erase each other. Cure: make the normalizer flag-blind for the relaxed shape (the flag gates writers only) and key uniqueness on `errandId` only when it is present. | `foreignGuestHold.js` l.308, l.346–391 (read) |

The chair still owes the ODQ P5 addendum's visible rows: OD-FC-85/OD-ST-54, OD-FC-60 ↳ P5, OD-BD-34, OD-PL-60, OD-PS-52/53, OD-ST-53, OD-PR-53, EP-N's `ageReceipt`, ES-2b's relaxed shape, PT's `bounty` sub-field, and B.2 superseding ODQ (b). The SP l.14 `envoy_hearing` line has no owner.

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by execution: P5C-9's truth bit (`visibleBand.out`, using master's function body). CONFIRMED by reading master or the volumes: every other receipt, including the P5-V1 code facts and the MN/RN bracket count of 0. PLAUSIBLE: P5-V1's data loss at runtime (the design is unbuilt), the WY seam's STOP, and P5C-9's pulse cost. No git and no test suite were run, and nothing except this report and the probe directory was written.
