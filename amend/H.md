# AMEND LANE H — worklog (DESIGN_FP_ARCHITECTURE · ARCH_CN · ARCH_LG · ARCH_PG · ARCH_MF), 2026-10-16

**Bases.** ARCHITECTURE = kit `volumes-master/` (3318 lines); LG = kit `volumes-master/` (byte-equal to `volumes/`, cmp); CN, PG, MF = kit `volumes/`. All five were PRESENT in the ledger working tree (tracked, clean, byte-equal to the ledger copies) — none was missing. `cp` base → `docs/` first, then the applier.
**Method.** `<scratchpad>/laneH/amend_H.py` — every anchor asserted count==1 in the BASE (two LG anchors missed on the dry run because §C/§D are not indented; re-anchored, no other miss); destination = base + insertions, reconstruction (remove each inserted chunk once) asserted byte-equal to base. Proof: `<scratchpad>/laneH/verify_H.py` (difflib, line then char level).
**Verify output (`python3 verify_H.py`):**
- ARCHITECTURE: line-insert hunks 5 · inline-insert hunks 82 · NON-INSERTION ops 0 · pipes 1359→1359 · NUL 0 · 3318→3323 lines
- CN: 7 · 8 · 0 · 263→263 · 0 · 491→504
- LG: 3 · 13 · 0 · 0→0 · 0 · 205→208
- PG: 7 · 5 · 0 · 284→284 · 0 · 418→431
- MF: 2 · 4 · 0 · 320→320 · 0 · 480→486
**Bracket counts** (occurrences of `2026-10-16 (coherence fold`): ARCH 70 · CN 17 · LG 16 · PG 12 · MF 12 (insert ops: 95 / 15 / 16 / 12 / 12; the remainder are one-line see-refs).
No git command other than read-only `git status` was run.

## Applied (destination line, post-amendment; from H_applied.json)

### DESIGN_FP_ARCHITECTURE.md
| item | line | result |
|---|---|---|
| R5 see-ref (header §10 verbatim) | 16 | applied |
| §2a row 3 (sealing header) | 38 | applied |
| R2 see-ref (EM fold banner 28·10·73) | 40 | applied |
| STATUS + R1 (§5.1, X2) | 44 | applied |
| R3 + S1/S2 (L1 kernel "ever") | 89 | applied |
| §5 register: pin/seal, doctrine sheet, tithe, phantom policy | 218 | applied |
| S6 (L10 provenance 6 of 86) | 220 | applied |
| S5 (TERM_CATALOG 12/8) | 241 | applied |
| §3.1.7 + §5 returning→column_return (first use) | 369 | applied |
| S3 (§2b item 5 five members) | 421 | applied |
| S9 + S1/S2 (§2c sizes) | 451 | applied |
| INT-7 see-ref (§3 lane file) | 476 | applied |
| §5 register embattled (first use, flag row 60) | 542 | applied |
| §6 overturned: lighting owner-held | 632 | applied |
| §5 register kmScale (first use) | 688 | applied |
| OD-FC-20 CR-WC-9 (§4) | 704 | applied |
| §3.1.9 calamityArcs row | 722 | applied |
| returning see-ref (§4 POP fields) | 757 | applied |
| §3.2.21 INVENTORY (§5 heading) | 859 | applied |
| EP-18 (EP placement) | 925 | applied |
| §6 overturned: CQ2 early motion | 946 | applied |
| R2 + R12 + §3.3.11 (09-23 progress block) | 948 | applied |
| §3.3.11 see-ref (08-09 block) | 950 | applied |
| §6 overturned: Edit-verb clauses (first site) | 987 | applied |
| S10 + SP-CW R-24 + §3.3.11 (SP-C BLOCKED ON Q1) | 1064 | applied |
| R8 WF-2 religious (SP-D charter) | 1080 | applied |
| §3.1.1 see-ref (GR-3 TR-5 producers) | 1168 | applied |
| S9 see-ref (IN-4 812) | 1495 | applied |
| R8 HB-2 first coupling row | 1558 | applied |
| R8 TR-5 five + §3.1.1 + §3.1.2/OD-FC-2 + §3.3.11 | 1734 | applied |
| §3.1.7 WC-0 column union | 1818 | applied |
| R8 WC-2 warStanceOf + §3.2.19 | 1829 | applied |
| §5 register crossing (first use) | 1834 | applied |
| §5 register bond (first bare use) | 1841 | applied |
| §5 register partial (WC-9) | 1908 | applied |
| embattled see-ref (WC-12) | 1934 | applied |
| R8 WF-2 religious (WF-2 charter) | 2010 | applied |
| §3.1.5 one tithe (WF-7) | 2052 | applied |
| §5 register sack lure | 2077 | applied |
| returning see-ref (POP-1) | 2089 | applied |
| §3.1.9 POP-4 folds into PG | 2145 | applied |
| R8 INT-7 subsystemRowsInterior | 2280 | applied |
| returning see-ref (§6 POP J) | 2454 | applied |
| OD-FC-40 see-ref (§6 POP Q6) | 2458 | applied |
| see-ref subsystemRowsInterior (§6 INT) | 2464 | applied |
| §5 register ERA-PRESET-ELIGIBLE (§7 heading) | 2484 | applied |
| S16 knowledge desk | 2571 | applied |
| R4 + S8 seam row 32 | 2705 | applied |
| EP-19 dormancy counts | 2723 | applied |
| R4 see-ref (twelfth prefix) | 2761 | applied |
| R5 + S11 §10 verbatim | 2771 | applied |
| R6 §10.6 operationRegistry | 2832 | applied |
| lighting see-ref (§10.10) | 2858 | applied |
| OD-FC-20 see-ref (§11 CR-WC-9) | 2891 | applied |
| App. A Q1 CR-FP-3 | 2985 | applied |
| App. A Q3 CR-FP-4 | 2992 | applied |
| App. A Q4 CR-FP-5 | 2997 | applied |
| App. A Q6 CR-FP-6 / OD-FC-40 | 3001 | applied |
| App. A Q8 CR-FP-8 dangling | 3011 | applied |
| App. A Q10 CR-FP-10 | 3021 | applied |
| App. A CR-FP-12 moot | 3037 | applied |
| CQ2 see-ref (STANDING) | 3047 | applied |
| R9 + §5.4 parked list | 3077 | applied |
| S7 envoyArrived | 3091 | applied |
| S6 see-ref (§12.0 item 4) | 3093 | applied |
| S17 + LG (§12.0 census) | 3098 | applied |
| dark-layer law see-ref | 3111 | applied |
| R7 home-only (§12.2 row 4) | 3120 | applied |
| R7 see-ref (row 5) | 3121 | applied |
| R7 see-ref (row 7) | 3123 | applied |
| S7 see-ref (seal 8) | 3124 | applied |
| §3.2.19 + §3.1.1 + §3.1.9 beside J-EM-6 | 3143 | applied |
| OD-FC-20 + HB Q1 beside J-EM-9 | 3146 | applied |
| R10 + X1 J-EM-12 | 3149 | applied |
| R3 see-ref (J-EM-13) | 3150 | applied |
| J-EM-14 superseded | 3151 | applied |
| R12 HB-3 row | 3221 | applied |
| R12 see-ref (HB-5 row) | 3223 | applied |
| §3.2.19 WC-2 row | 3229 | applied |
| §5 addendum REINFORCE (WC-4 row) | 3231 | applied |
| R10 see-ref (§12.5) | 3255 | applied |
| OD-FC-20 see-ref (§12.5) | 3255 | applied |
| R12 see-ref (§12.5) | 3255 | applied |
| App. A §12.7.1 launch line | 3267 | applied |
| App. A §12.7.2 HB Q1 | 3268 | applied |
| S3/S4 + §3.2.20 (§12.8 35 keys) | 3276 | applied |
| §2a colophon | 3304 | applied |
| §5 register SEAM-n (§13 heading) | 3307 | applied |
| FV SEAM-0 (§13, no program-volume home) | 3313 | applied |
| FV SEAM-1 | 3315 | applied |
| OD-FC-37 SEAM-2 (X13/X14) | 3317 | applied |
| FV SEAM-2 | 3317 | applied |
| FV SEAM-3 | 3319 | applied |
| bond see-ref (court bonds) | 3321 | applied |
| R11 §13 order clause | 3323 | applied |

### DESIGN_FP_ARCH_CN.md
| item | line | result |
|---|---|---|
| STATUS + R13 (§5.8) | 10 | applied |
| OD-FC-38 see-ref (slotting) | 50 | applied |
| S14 SIEGE_MAX_AGE address | 107 | applied |
| §3.3.9 WarFaithTab | 113 | applied |
| §5 register CONDITION_BANDS | 117 | applied |
| X15 law 2 beside | 134 | applied |
| §5.9 flag count | 181 | applied |
| FV cn-1 | 214 | applied |
| FV cn-2 | 238 | applied |
| FV cn-3 | 261 | applied |
| X15 cn-3 RULED | 264 | applied |
| FV cn-4 + R16 + X16 | 289 | applied |
| FV cn-5 + X17 | 332 | applied |
| FV cn-6 | 367 | applied |
| OQ-1 inside OD-FC-38 | 433 | applied |

### DESIGN_FP_ARCH_LG.md
| item | line | result |
|---|---|---|
| STATUS (LG) | 5 | applied |
| OD-FC-38 (LG) | 7 | applied |
| FV LG-0 | 111 | applied |
| FV LG-1 | 114 | applied |
| FV LG-2 | 117 | applied |
| FV LG-3 | 120 | applied |
| FV LG-4 | 122 | applied |
| FV LG-5 | 124 | applied |
| FV LG-6 | 129 | applied |
| FV LG-7 | 132 | applied |
| FV LG-8 | 134 | applied |
| FV LG-9..12 | 136 | applied |
| FV LG-13+ | 145 | applied |
| §3.2.16 size-scaled speed | 164 | applied |
| R17 + §3.1.7 (§C) | 179 | applied |
| §D vs J-EM-12 | 189 | applied |

### DESIGN_FP_ARCH_PG.md
| item | line | result |
|---|---|---|
| STATUS + R13 + OD-FC-38 (PG) | 10 | applied |
| §3.1.9 one plague truth names POP-4 | 27 | applied |
| OD-FC-38 see-ref (slot) | 54 | applied |
| §5 register pin (first use) | 75 | applied |
| FV pg-0 | 112 | applied |
| FV pg-1 | 135 | applied |
| §3.1.7 column union (pg-1 ruling 2) | 162 | applied |
| FV pg-2 | 200 | applied |
| FV pg-3 | 252 | applied |
| §3.1.21 afflictionBand | 276 | applied |
| FV pg-4 | 316 | applied |
| §3.3.2 PG prefix | 364 | applied |

### DESIGN_FP_ARCH_MF.md
| item | line | result |
|---|---|---|
| R15 + §5 FABRIC rename | 3 | applied |
| STATUS + R13 + OD-FC-38 (MF) | 9 | applied |
| §5.9 August count | 165 | applied |
| R14 + X22 + S13 + §5 kmScale | 196 | applied |
| FV MF-1 | 210 | applied |
| FV MF-2 | 211 | applied |
| FV MF-3 | 212 | applied |
| FV MF-4 | 213 | applied |
| FV MF-5 | 214 | applied |
| FV MF-6 | 215 | applied |
| FV MF-7 | 216 | applied |
| kmScale see-ref (§11.12 a) | 433 | applied |

(Lines for identical see-ref texts on one physical line, e.g. §12.5's three, share a line number.)

## Mapping of the findings' ids (FOLD-SMALL + EP + SP-CW)
- §10 R1 status · R2 progress (+ledger: the ledger copy now carries master's 09-23 block, so the bracket lands there) · R3 kernel · R4 row 32 · R5 §10 (+ branch-gate note, S11) · R6 §10.6 · R7 home-only (row 4; see-refs rows 5, 7) · R8 ×6 pointers (SP-D WF-2b, WF-2, TR-5, INT-7, WC-2, HB-2) · R9 parked list · R10 J-EM-12 · R11 §13 order · R12 HB-3 row (+ in the R2 bracket, + see-refs HB-5 row, §12.5, §12.7.2) · R13 CN/PG/MF headers · R14 MF kmScale · R15 MF:1 · R16 cn-4 · R17 LG §C — ALL APPLIED. R18 (ODQ §934.84) NOT this lane's file — recorded for the chair; its content also lands in ARCH §12.8 per fold §3.2.20.
- §5 contradictions 1–9: all bracketed (1 status; 2 L1; 3 HB-3; 4 parked; 5 row 4; 6 the J-EM-6 pointers + RULED beside J-EM-6; 7 J-EM-12; 8 three headers; 9 CN §3 count + MF Door-A count).
- §6 S1–S17: S1/S2 at L1 + §2c · S3 §2b item 5 + §12.8 · S4 §12.8 · S5 §2a · S6 L10 provenance + §12.0 see-ref · S7 §12.0 item 2 + seal 8 see-ref · S8 row 32 · S9 §2c + IN-4 see-ref · S10 SP-C · S11 §10 · S12 STILL TRUE (no bracket) · S13 MF · S14 CN C7 · S15 STILL TRUE (no bracket) · S16 §8 · S17 §12.0. "Overturned" list: Edit-verb (first site SP-A), lighting at soak redo (§3 lighting contract + §10.10 + dark-layer law see-refs), CQ2 (§5 fold paragraph + STANDING see-ref), pair cadence (R11).
- §4 X1–X24: X1 R10 · X2/X19/X23/X24 AGREE (no bracket) · X3 → ARCH §12.8 (fold §3.2.20) + chair note · X4 R4 · X5–X12 R8 · X13/X14 OD-FC-37 at SEAM-2 + R11 · X15 CN law 2 + cn-3 · X16 cn-4 · X17 cn-5 · X18 PG pg-3 (§3.1.21) · X20 PG first law + ARCH POP-4/calamityArcs (§3.1.9) · X21 LG §C · X22 MF.
- Appendix A: CR-FP-3/4/5/6/8/10/12 · CQ2 · §12.7.1/2 · SEAM-0..3 + order clause — all bracketed; §12.7.3/4 OPEN (no bracket needed).
- EP §10 18 (ARCH:917 → dest 925) and 19 (ARCH:2720 → dest 2723): applied. SP-CW §10 R-24 (fold 1013-1019 ledger = master 1059): applied with S10.
- Fold obligations: §3.1.9 (PG first law, ARCH POP-4 + §4 row, J-EM-6 bracket) · §3.1.19 OD-FC-37 · §3.1.20 OD-FC-38 at the top of CN/LG/PG/MF · §3.1.21 PG pg-3 · §3.2.19 J-EM-6 + WC-2 charter + WC-2 row · §3.2.20 §12.8 · §3.2.21 INVENTORY bracket at §5 heading · §3.3.2 row 32 + PG §5.5 + LG OD-FC-38 · §3.3.11 progress blocks, SP-C, TR-5, INT-7 · §5 SEAM-n / MF (FABRIC) / phantom / bond / pin rows · §5 also kmScale, returning, embattled, crossing, partial, sack lure, tithe, doctrine sheet, ERA-PRESET-ELIGIBLE, CONDITION_BANDS (CN), REINFORCE addendum (WC-4 row) · §7 OD-FC-17/20/22/37/38/39/40 cited.
- FIRST-VISIBLE/TIER: CN 6/6 · LG 11/11 (LG-9..12 is one charter) · PG 5 (pg-0..pg-4) · MF 7/7 · ARCH §13 SEAM-0..3 (4; see below). ARCH §5 charters: none, by instruction (INVENTORY bracket says so).

## Judgment calls (vetoable)
1. ARCH §13's SEAM-0..3 got FIRST-VISIBLE/TIER lines although the instruction exempted only §5: they are wave charters with no program-volume home (grep: ARCH_SP has no SEAM charter). SEAM-2/3 written UNMEASURED.
2. OD-FC rows are headed `[OWNER ROW OD-FC-n — RULED BY DELEGATION …; vetoable]` because the fold §7 records the owner's 2026-10-16 delegation word.
3. Where J-EM-9 (CR-WC-9 SIGNED) and the fold's OD-FC-20 (PARKED) disagree, the fold wins (brief authority 1); bracketed beside J-EM-9, at §4 and at the header.
4. pg-2's DEGRADED ARM names only the birth-gate arm as aspatial (findings); the counterforce-decay arm's tier is written UNMEASURED.
5. cn-2, cn-5, cn-6, LG-0/2/6/9..12/13+, SEAM-2/3, pg-4 FIRST-VISIBLE = UNMEASURED (no clock in findings §7).

## For the chair (not resolvable in this lane)
- R18: ODQ §934.84 "errandSpine and merchantHouses light at LIT-2" (ODQ:32952) needs its bracket in the ODQ (not this lane's file).
- CR-FP-8's harmonization trigger has fired (GR-2 complete) with no slot — owes a slot or CLOSED-with-reason.
- CN cn-5's conversion valve is pin-conditional; with cn-4's pin not minted, its trigger needs a ruling against seal 6 at the Edit Mode fold.
- SEAM-0 is owed and unslotted under FP-40.
- CN OQ-1 (command-power tier gating) stays open inside OD-FC-38.
