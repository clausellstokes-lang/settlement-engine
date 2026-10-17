# LANE G worklog — DESIGN_FP_ARCH_WC (amendment seat, 2026-10-16)

Base: kit volumes-master/DESIGN_FP_ARCH_WC.md (7,009 lines). Destination: ledger docs/DESIGN_FP_ARCH_WC.md (was the plain 6,979-line ledger copy, byte-identical to kit volumes/; backup amend/WC.before.md). cp base -> destination done.
Note: master differs from plain by the 30-line banner AND one in-body cure (master :6813 settlementStrategy.js:1294 vs plain :1360).

## Refinements
Script: amend/G_apply.py (exact-string anchors, each asserted found exactly once; strip-check asserts removing every inserted chunk reproduces the base byte-for-byte). Run 1: 3 anchors NOT FOUND (K2, O4, Y7: line-wrap mismatch), fixed to the real text, re-run: 151 applied, 0 missing.

| id | master line | status |
|---|---|---|
| A1-banner0814 | 18 | applied |
| A2-hdr-CRWC9 | 62 | applied |
| A3-STATUS | 94 | applied |
| B0-CRWC21-0.1 | 223 | applied |
| B1-ref20-pools | 253 | applied |
| B2-vocab-settled | 267 | applied |
| B3-vocab-brigand | 516 | applied |
| B4-faith-3.1.6 | 697 | applied |
| C0-newroad | 820 | applied |
| C1-S5-391 | 827 | applied |
| C2-S5-115 | 834 | applied |
| C3-ref17 | 844 | applied |
| C4-S5-80 | 853 | applied |
| C5-S7-117 | 887 | applied |
| C6-ref3-shape | 953 | applied |
| C7-supplies-3.1.14 | 963 | applied |
| C8-alignline-first | 991 | applied |
| C9-S8-relstate | 1018 | applied |
| C10-ref4-flagship | 1112 | applied |
| C11-S6-1263 | 1129 | applied |
| C12-3.2.18 | 1216 | applied |
| D1-vocab-stance | 1223 | applied |
| D2-3.2.19 | 1264 | applied |
| D3-generals | 1321 | applied |
| D4-four-scalars | 1380 | applied |
| D5-vocab-crossing | 1381 | applied |
| D6-ref6-banners | 1395 | applied |
| D7-perepisode | 1404 | applied |
| D8-ref11 | 1407 | applied |
| E1-3.1.15 | 1447 | applied |
| E2-skimstores | 1499 | applied |
| E3-ref7-3.1.13 | 1569 | applied |
| E4-bucket | 1582 | applied |
| F1-S5-1624 | 1632 | applied |
| F2-S10 | 1661 | applied |
| F3-3.2.17-arm | 1704 | applied |
| F4-ref9 | 1736 | applied |
| G1-taint | 1764 | applied |
| H0-vocab-bond | 1869 | applied |
| H1-S9 | 1903 | applied |
| I1-vocab-raiding | 2095 | applied |
| I2-S12 | 2173 | applied |
| I3-S11 | 2175 | applied |
| J1-ref8-3.1.16 | 2199 | applied |
| J2-vocab-worn | 2203 | applied |
| J3-crime-3.1.16 | 2223 | applied |
| K1-vocab-half | 2268 | applied |
| K2-S19-coin | 2388 | applied |
| K3-reliability | 2399 | applied |
| L1-ref19 | 2589 | applied |
| L2-ref12 | 2706 | applied |
| L3-bothvariants | 2733 | applied |
| L4-unruled | 2751 | applied |
| M1-S7-1171 | 2881 | applied |
| M2-S7-1172 | 2926 | applied |
| N1-ref18 | 2999 | applied |
| O1-ref15b | 3045 | applied |
| O2-ref14 | 3145 | applied |
| O3-ref15 | 3170 | applied |
| O4-C9 | 3269 | applied |
| P1-attach | 3414 | applied |
| Q1-ref13 | 3449 | applied |
| Q2-ref21-22 | 3499 | applied |
| R0-FV-WC0 | 3503 | applied |
| R1-WC0-landed | 3504 | applied |
| R2-S7-mig | 3556 | applied |
| R3-ref16 | 3578 | applied |
| R4-tracked | 3582 | applied |
| R5-S8-termfam | 3641 | applied |
| R6-ref8-3663 | 3663 | applied |
| R7-ref13a | 3668 | applied |
| R8-ref13b | 3690 | applied |
| R9-S18 | 3715 | applied |
| S0-FV-WC1 | 3722 | applied |
| S1-S10-corpus | 3732 | applied |
| S2-3.2.18-wc1 | 3744 | applied |
| T0-FV-WC2 | 3785 | applied |
| U0-FV-WC3 | 3829 | applied |
| U1-ref14 | 3838 | applied |
| V0-FV-WC4 | 3880 | applied |
| V1-REINFORCE | 3889 | applied |
| V2-S11 | 3900 | applied |
| W0-FV-WC5 | 3949 | applied |
| X6 | 4016 | applied |
| X7 | 4104 | applied |
| X7a-ESrow | 4115 | applied |
| X7b-four | 4122 | applied |
| X8 | 4151 | applied |
| X8a-taint | 4164 | applied |
| X9 | 4201 | applied |
| X9a-S14 | 4261 | applied |
| X10 | 4296 | applied |
| X10a-ref11 | 4300 | applied |
| X11 | 4326 | applied |
| X11a-ref18 | 4337 | applied |
| X12 | 4391 | applied |
| X12a | 4399 | applied |
| X13 | 4437 | applied |
| X14 | 4498 | applied |
| X15 | 4534 | applied |
| X15a-ref2 | 4540 | applied |
| X15b | 4547 | applied |
| X15c-ref5 | 4578 | applied |
| X16 | 4596 | applied |
| X16a-ref20 | 4600 | applied |
| Y1-4.1.1 | 4670 | applied |
| Y2-4.1.2 | 4710 | applied |
| Y3-4.2-F9 | 4763 | applied |
| Y4-4.2-carrier | 4770 | applied |
| Y5-ref10 | 4781 | applied |
| Y6-4.3-tap | 4807 | applied |
| Y7-4.4-levied | 4830 | applied |
| Y8-4.4-occ | 4848 | applied |
| Y9-ref17 | 4876 | applied |
| Y10-S15 | 4887 | applied |
| Z1-CRWC1 | 5061 | applied |
| Z2-CRWC7 | 5097 | applied |
| Z3-CRWC9 | 5153 | applied |
| Z4-CRWC11 | 5176 | applied |
| Z5-CRWC13 | 5188 | applied |
| Z6-CRWC14 | 5194 | applied |
| Z7-CRWC16 | 5213 | applied |
| Z8-ref3 | 5274 | applied |
| Z8a-C2 | 5292 | applied |
| Z8b | 5295 | applied |
| Z9-CRWC22 | 5304 | applied |
| AA1-half | 5421 | applied |
| AA2-raiding | 5611 | applied |
| AA3-worn | 5619 | applied |
| AA4-3.1.7 | 5629 | applied |
| AA5-S7b | 5686 | applied |
| AA6-ref4 | 5694 | applied |
| AA7-7B-time | 5761 | applied |
| AA8-ref5 | 6021 | applied |
| AA9-ref24 | 6040 | applied |
| AA10-ref23 | 6048 | applied |
| AA11-7F | 6528 | applied |
| AA12-ref19 | 6576 | applied |
| AB1-row1 | 6682 | applied |
| AB1b-row1 | 6682 | applied |
| AB2-row5 | 6686 | applied |
| AB3-row8 | 6689 | applied |
| AB4-row14 | 6695 | applied |
| AB5-row18 | 6699 | applied |
| AB6-row20 | 6701 | applied |
| AB7-row21 | 6702 | applied |
| AB8-ref8-6813 | 6814 | applied |
| AB9-ref9 | 6833 | applied |
| AB10-row5p | 6835 | applied |
| AB11-ref10 | 6836 | applied |
| AC-closing | 7000 | applied |

## Verification
- `python3 difflib` line opcodes base→dest: equal 148 · replace 103 · insert 44 · delete 0; every replace block's base text is a character-subsequence of the new text → INSERTIONS ONLY (0 violations).
- `git diff --no-index --word-diff=porcelain` shows 6 "-" tokens; each is a punctuation-adjacent token split by an inline insertion (e.g. `(:266),` → `(:266) [..],`), no byte removed (strip-check confirms).
- Counts: `grep -o '2026-10-16 (coherence fold'` = 148; `[OWNER ROW OD-FC-n` = 9 (OD-FC-20 ×3, OD-FC-21 ×5, OD-FC-30 ×1; OD-FC-19/35/36 cited inside RULED/SUPERSEDED brackets); FIRST-VISIBLE lines = 17 (WC-0..WC-16).
- Seam table §8.1 still 23 rows × 4 cells; header `Neighbour` untouched.
- Destination 7,053 lines (base 7,009 + 44 inserted lines).

## Refinement → entry map (all applied)
WC-1 §10: 1→A3 · 2→A2+Z3 (superseded by OD-FC-20 per lane) · 3→C6 · 4→C10 · 5→E1 (+E2,E4) · 6→D6+K3 · 7→E3+Y2 · 8→J1 (+J3,X12a,Z4) · 9→F4 · 10→D2+D7 · 11→D8 (+D4,X7b) · 12→L2 (+L3,L4) · 13→Q1+C12+S2 · 14→O2 · 15→O3+O1 · 16→R3+F3 · 17→C3 · 18→N1 · 19→L1+B2 · 20→B1.
WC-2 §10: 1→A3 · 2→X15a+X15b · 3→Z8 · 4→AA6 · 5→AA8+X15c (+Z8a) · 6→AB7 · 7→AC · 8→R6+Y1+AB1+AB8 · 9→AB9+Y1+Z1 · 10→Y5+AB3+AB11 · 11→X10a · 12→V1 · 13→R7+R8+AB1b · 14→U1+AA11 · 15→Z3 · 16→R4 · 17→Y9+AB6 · 18→X11a+I2 · 19→AA12 · 20→X16a · 21→Q2+C8 · 22→Q2 · 23→AA10 · 24→AA9.
§5 contradictions not in §10: WC-1 C-9→O4; C-11→B1/Y7/AB4; C-12→B2. WC-2 C8 (crossing)→D5.
§6 stale premises not in §10: S-5→C1,C2,C4,F1 · S-6→C11 · S-7→C5,M1,M2 · S-8→C9 · S-9→H1 · S-10→F2 · S-11→I3 · S-12→I2 · S-18→R9 · S-19→K2 · WC-2 S7→R2,AA5 · S8→R5 · S10→S1 · S11→V2 · S13→Y8,AB5 · S14→X9a · S15→Y10 · X16→Z9. Holds (no bracket): S-20, WC-2 S16-S20.
Fold rows: §3.1.6→B4 · §3.1.7→AA4 · §3.1.13→E3,Y2 · §3.1.14/OD-FC-35→C7,C10,Y4 · §3.1.15→E1,U1,AA11,P1 · §3.1.16→J1,J3,X12a,Z4 · §3.1.17→D6,K3,Y6,X7a · §3.1.18/OD-FC-36→D3 · §3.2.17→C6,F3,R3 · §3.2.18→C12,Q1,S2 · §3.2.19→D2,D7 · §3.3.8→N1 · §3.3.10→AA7 · §4 planting line→X9,X14,X15,X16,V0 · §5 vocab→B2,B3,I1,J2,K1,G1,X8a,Q2,C8,D1,D5,H0 · §5 addendum REINFORCE→V1,C0 · §6 chain 2→A3,Q1,Z7,AC · OD-FC-19→Z7 · OD-FC-20→A2,A3,Z3 · OD-FC-21→X10a,Y3,AB2,AB10,Z6 · OD-FC-30→Z2.

## For the fold to rule (not resolved here)
- `column_return` (§3.1.7) vs WC's landed `veteran_return`: bracketed as "POP-1's return class is column_return; veteran_return stands (landed)". If the fold meant WC's class too, that is a landed-token rename it forbids.
- habitCurve.js `LEARN_RATES` is at :101 (findings and fold say :102); the bracket cites :101.
- spatialUsage.js:184 (findings) for the embattlement ledger row is unverified at 00b648c9d (the row is at :63/:122); the bracket cites the file without a line.
