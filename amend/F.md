# AMEND LANE F — worklog (ARCH_WY · ARCH_HB · ARCH_EP), 2026-10-16

Setup: WY base = kit volumes-master (identical to the ledger copy, cmp silent), cp over destination done. HB and EP delegated to two sub-seats (worklogs amend/F-HB.md, amend/F-EP.md); this file collects all three.

## WY — DESIGN_FP_ARCH_WY.md (this seat)

Script: `<scratchpad>/laneF/amend_WY.py` (53 insertions, every anchor asserted count==1 in the BASE before applying, zero misses; `{REF:key}` see-refs resolved to destination lines, zero unresolved). Insertion-only proof: `python3 <scratchpad>/laneF/verify_ins.py volumes-master/DESIGN_FP_ARCH_WY.md docs/DESIGN_FP_ARCH_WY.md` → `non-insertion ops: 0 | added lines: 12 | modified-line blocks checked char-level: 37 | lines 1722 -> 1737`; 0 NUL. Counts: 45 dated brackets (`grep -o '2026-10-16 (coherence fold'`), 10 OWNER ROW mentions (OD-FC-9 ×1, 13 ×1, 15 ×1, 21 ×5, 22 ×2), 12 Tier lines, 18 see-refs. Destination lines below are post-amendment.

| Item | Dest line | Result |
|---|---|---|
| status header (findings §2 + fold §2 WY row) | 6 | applied |
| R6 / C3 sign-off state (J-EM-9) | 99 | applied |
| C3-live (populationFlows no spatial check) | 165 | applied |
| §5 `pin` | 178 | applied (first prose "pin"; the header's "VERIFY-THEN-PIN" is the same test sense) |
| S5 (zero-hits grep, history) | 221 | applied |
| R7 / C4 / X5 gradeMultiplier socket (+ see-refs 280, 1609) | 225 | applied |
| §5 `kmScale` vs the FABRIC scale bar | 242 | applied |
| R9 / S6 creation flow (+ see-ref 1155; the WY-1 charter bracket 1157) | 255 | applied |
| R10 / S7 / X20 modes and news | 282 | applied |
| R15 / C8 spectrum surface + census | 295 | applied |
| fold §4 CLOCK census (Class A/B/C) + OWNER ROW OD-FC-15 | 298 | applied (WY's clock section = §1a.3, the per-map week-band law; X8/X9 folded in) |
| R11 / X20 news rescaling | 307 | applied |
| §5 `grave` (multipliers key on SEVERITY only) | 379 | applied (at the collision sentence; the first literal use is the SEVERITY_LADDER code quote at :335) |
| R1 / X1 "ES amendment I" (+ OD-FC-9 mention) | 391 | applied |
| C5 conserved vs BLEND | 419 | applied |
| R14 / S1 scalar army supply (F9 row cell) | 574 | applied |
| S8 mapSlice drift + persistence contradiction (PLAUSIBLE) | 703 | applied |
| WY-9 covert hole LIVE (six sites, re-measured) + see-ref at the WY-9 charter 1459 | 805 | applied |
| R13 / S3 / §3.3.9 WarFaithTab (+ 4 see-refs 1363, 1371, 1436, 1540) | 1124 | applied |
| §3.1.11 table/walker + WY-1 as-built + OWNER ROW OD-FC-22 | 1157 | applied |
| R4 / C2 sixteenth-arm (WY-6) + see-ref WY-8a | 1300, 1401 | applied |
| OD-FC-13 / §3.2.16 size-scaled speed as a WY-4 band | 1251 | applied |
| R16 / C7 WY-0 "first commit" | 1332 | applied |
| OWNER ROW OD-FC-21 at WY-8a | 1382 | applied |
| R12 / S2 hasMartialRecord | 1425 | applied |
| §5 CONDITION_BANDS reuse + S4 | 1431 | applied |
| R5 / C1 / fold §6 chain 7 WY-10 on WY-3 (+ see-ref §5b item 4 at 1539) | 1467 | applied |
| R2 / X2 §5b item 8 | 1565 | applied |
| X10 TR-4 → EC-12 (seam 2) | 1605 | applied |
| R8 / X6 seam 6 tripwire | 1609 | applied |
| R3 / C2 seam 7 (contract + tripwire) | 1610 | applied |
| R21 §9 evidence-law lines | 1715 | applied |
| Tier lines WY-1,2,3,4,5,6,11,0,7,8,9,10 | 1130…1468 | applied (12) |
| R17 SPINE:469-470, R18 SP:129 | — | NOT IN MANIFEST (lane A; applied there) |
| R19 WC:6806 / MF:190 | — | NOT IN MANIFEST (WC = lane G; MF another lane) |
| R20 ARCH:3209 | — | NOT IN MANIFEST (lane H) |

Deliberate non-applications: S9 (not re-measured by the reader; no claim to correct); S10 (not WY's text); X19 (a PLAUSIBLE tension, no contradiction); §8's FOLD/CUT judgments (reader judgments, not fold rulings — the fold §6 CUT list names no WY item); `reachBandOf` (zero hits in WY's text — nothing to bracket); `telling` (WY uses "movement telling" and the popup sentence "the column's strength telling"; no WY row in the lane obligations — left for the fold).

For the fold to rule (WY): (1) OD-FC-22's recommendation ("the map's implied scale") meets the reader's C6: at the implied scale the absolute read equals the legacy read to the bit (distanceRead.js:607-612), so the recommended default makes a scaled world indistinguishable from a legacy one. (2) §5 rules that WY-8b REUSES armyStrength's CONDITION_BANDS, but that ladder derives from `supplyIntegrity` (armyStrength.js:148) while WY-8b's condition band derives from `accumulatedAttrition`; the reuse needs a sentence on which quantity the band reads (bracketed as riding OD-FC-21). (3) The covert hole is six sites at 00b648c9d, not three (TimelapseLayer.jsx:46, TravelersLayer.jsx:51, HeraldRemembrance.jsx:217 added).
