# LANE C worklog — INFO / ARCH_IN / ARCH_ES (amendment seat, 2026-10-16)

Base: kit volumes-master/ (DESIGN_FP_INFORMATION 1509, DESIGN_FP_ARCH_IN 712, DESIGN_FP_ARCH_ES 2108 lines).
Destination: ledger checkout docs/ (the three files were absent in the working tree — `D` in git status; cp created them).
NOTE: findings IN-ES.md line numbers are LEDGER-copy lines (volumes/, 1455/640/1949), not master lines; every anchor below is by exact text in master, asserted found once.

Script: <kit>/amend/C_apply.py (anchors exact-string, asserted unique; verification removes every inserted chunk and asserts byte-equality with base).

## Pre-checks
- base copied over destination: done
- C_apply.py run once from base (all 121 anchors found exactly once; script asserts dest minus every inserted chunk == base byte-for-byte). Re-run after the session reset: same result; no edit was outstanding.

## Verification
- Brackets (`grep -o '2026-10-16 (coherence fold'`): INFORMATION 63 · ARCH_IN 35 · ARCH_ES 30.
- Insertions-only: independent difflib check (each changed base line = dest line with ONE contiguous bracket insertion; every added line is a bracket) → 0 violations in INFO/AIN; ES flagged 1 = seam row 9, which carries TWO inline insertions (§3.1.12 + OD-FC-9); stripping both exactly reproduces the base line (verified).
- FIRST-VISIBLE lines: INFO 11 (IN-0, 0a-0d, IN-1..6) · AIN 11 · AES 9 (ES-0..7 + ES-Da inside the wave-count bracket).

## Already corrected in the master base (no bracket added)
- AIN refinement 16 (IN-0c BLOCKED): master header already says ALL FOUR LANDED; the status bracket restates it.
- AES refinement 26 (row 44 = ES-1): master §6 item 1 already reads ES-0.
- INFO refinement 10 (C14): master already carries CR-IN1-7; the added bracket covers only what it omits (IN-1c-b counterforce, the two 'unknown' axes, no engine consumer).

## Placement notes
- `lure` first use in AIN is a token (`lure_sprung`, S32 row); the register bracket sits at the IN-2 heading.
- `rooted` first use in AES is in the ## header block; the bracket is a ## line after the header's first paragraph (line 17).
- AES has no bare `lure`/`spent` register use (:1357 "spent" is plain English). No bracket.
- Wave lines on bold run-in charters (IN-0a..d, ES-0..7) are inserted on the line BEFORE the charter so they open it; ### headings get the line after.

## Applied (refinement id → file:line in destination order)

### DESIGN_FP_INFORMATION
- R1 status header → base line 12: APPLIED
- R2/S1 thesis plant (C1) → base line 24: APPLIED
- vocab lure (§5) → base line 27: APPLIED
- OD-FC-12 M9b row (§3.2.15) → base line 169: APPLIED
- §2 HIDE row (§3.1.4 pointer) → base line 170: APPLIED
- S20 §2 disclosure row (IN-0c landed) → base line 171: APPLIED
- S1 §2 PLANT_WIRING row → base line 167: APPLIED
- R8/S2 §2 race row → base line 174: APPLIED
- S5 §2 Herald row → base line 176: APPLIED
- S7 §2 sightPostures row → base line 178: APPLIED
- S8/S10 §2 projections row → base line 179: APPLIED
- S3 §2 gate-stack row → base line 180: APPLIED
- S2 §2 absent-list race → base line 185: APPLIED
- R9/S4 WAR_REASON_TYPES → base line 190: APPLIED
- R3/C2 SEND-TWO first site → base line 196: APPLIED
- R4/C3/S9/S13 believed axes first site → base line 201: APPLIED
- R4 §3 lit-preconditions → base line 256: APPLIED
- R3 §3 SEND-TWO → base line 266: APPLIED
- S2/T10 §3 refugee degraded arm → base line 270: APPLIED
- C1 seam contract one → base line 285: APPLIED
- C14 seam contract three → base line 303: APPLIED
- R5/C4 devotion two axes (code block) → base line 337: APPLIED
- R4 §4 hard-blocked (code block) → base line 342: APPLIED
- wave IN-0 → base line 376: APPLIED
- wave IN-0a → base line 381: APPLIED
- C1 IN-0a model superseded → base line 386: APPLIED
- vocab spent (§5) → base line 423: APPLIED
- wave IN-0b → base line 461: APPLIED
- wave IN-0c → base line 526: APPLIED
- wave IN-0d → base line 591: APPLIED
- §3.1.4 HIDE toll home → base line 597: APPLIED
- wave IN-1 → base line 635: APPLIED
- R10/C14/S17 mirror inputs → base line 648: APPLIED
- R15 IN-1 receipt pointer → base line 716: APPLIED
- wave IN-2 → base line 777: APPLIED
- R4 IN-2 baits blocked → base line 794: APPLIED
- S15 IN-2 restraint pointer → base line 802: APPLIED
- lure flagship pointer (receipts) → base line 858: APPLIED
- wave IN-3 → base line 931: APPLIED
- vocab measured/zeal (§5) → base line 945: APPLIED
- R3 IN-3 SEND-TWO → base line 953: APPLIED
- IN-3 verbs unmounted + §3.1.12 → base line 964: APPLIED
- §3.1.4 HIDE-as-answer pointer → base line 972: APPLIED
- R6/C5/S6 PLANT_REFUSALS → base line 1003: APPLIED
- R11 sweep endings → base line 1018: APPLIED
- §3.1.3 witch-hunt grievance → base line 1021: APPLIED
- wave IN-4 → base line 1061: APPLIED
- R12/C6 §3.2.7 double agent → base line 1077: APPLIED
- S2/T10 IN-4 race half → base line 1080: APPLIED
- wave IN-5 → base line 1153: APPLIED
- R7/S5 HERALD_SECTIONS → base line 1163: APPLIED
- R13/T12 desk kinds → base line 1168: APPLIED
- court_sat_still unbuilt → base line 1205: APPLIED
- wave IN-6 → base line 1262: APPLIED
- R11 IN-6 sweep envelope pointer → base line 1302: APPLIED
- R14/S15 J-INF-14 → base line 1392: APPLIED
- R3 J-INF-15 → base line 1406: APPLIED
- lure flagship §8 → base line 1464: APPLIED
- R15 §8 mirror sentence → base line 1470: APPLIED
- court_sat_still §8 → base line 1482: APPLIED
- R3 §9 SEND-TWO → base line 1495: APPLIED

### DESIGN_FP_ARCH_IN
- status header + tier → base line 43: APPLIED
- OD-FC-12 S2 M9b row → base line 58: APPLIED
- R19 §1a history (S8/S11-S14/S16/S32) → base line 93: APPLIED
- R19 §1b history (R1/R3/R5) → base line 106: APPLIED
- R19 verified-absent paragraph → base line 114: APPLIED
- R4 §2 lure flag row → base line 142: APPLIED
- wave IN-0 → base line 269: APPLIED
- wave IN-0a → base line 282: APPLIED
- R17/S12 pulseKernel size → base line 295: APPLIED
- wave IN-0b → base line 334: APPLIED
- wave IN-0c → base line 349: APPLIED
- wave IN-0d → base line 369: APPLIED
- §3.1.4 HIDE toll home (AIN) → base line 375: APPLIED
- wave IN-1 → base line 382: APPLIED
- IN-1 as built (two axes unknown) → base line 468: APPLIED
- wave IN-2 → base line 470: APPLIED
- R4/C3/C4 J-INA-3 → base line 485: APPLIED
- lure flagship (AIN) → base line 509: APPLIED
- wave IN-3 → base line 511: APPLIED
- vocab measured/zeal (AIN) → base line 533: APPLIED
- IN-3 verbs unmounted + §3.1.12 (AIN) → base line 534: APPLIED
- wave IN-4 → base line 536: APPLIED
- S2/T10/T12 race as built + OD-FC-9 → base line 546: APPLIED
- wave IN-5 → base line 561: APPLIED
- R7/S5 HERALD six (AIN) → base line 563: APPLIED
- court_sat_still (AIN) → base line 572: APPLIED
- wave IN-6 → base line 579: APPLIED
- §3.1.4 collision-map pointer → base line 607: APPLIED
- §3.1.4 pre-pin 1 pointer → base line 643: APPLIED
- R4 pre-pin 2 re-opened → base line 649: APPLIED
- R4 Q4 pointer → base line 694: APPLIED
- R18/C7 J-INA-1 → base line 705: APPLIED

### DESIGN_FP_ARCH_ES
- vocab rooted (§5) → base line 17: APPLIED
- R20 status header + tier → base line 41: APPLIED
- §3.1.8 W-OPS (OD-FC-4) → base line 87: APPLIED
- R21/C11/S19 legRefs (code block) → base line 203: APPLIED
- C13 §1 zero sub-keys pointer → base line 154: APPLIED
- R29/S11 §2 names clear → base line 300: APPLIED
- R22/C15/S18 ACQUIRE as built + exports → base line 746: APPLIED
- R22 first-hand cap pointer (code block) → base line 817: APPLIED
- §3.1.12 suspicion one derivation → base line 897: APPLIED
- R23/C10 §3.11 no further code → base line 1148: APPLIED
- R24/S16 §3.2.9 J-ES-13 release → base line 1196: APPLIED
- §3.2.7 double agent (ES) → base line 1230: APPLIED
- R28/C13 ES-5d carrier vs §1 → base line 1431: APPLIED
- wave ES-0 → base line 1448: APPLIED
- wave ES-1 → base line 1494: APPLIED
- wave ES-2 → base line 1523: APPLIED
- wave ES-3 → base line 1569: APPLIED
- wave ES-4 → base line 1606: APPLIED
- wave ES-5 → base line 1652: APPLIED
- ES-5a handshake + dispatch PLAUSIBLE → base line 1658: APPLIED
- ES-5d stale → base line 1670: APPLIED
- wave ES-6 → base line 1714: APPLIED
- wave ES-7 → base line 1758: APPLIED
- R25/C9 ES-Da wave count → base line 1787: APPLIED
- §3.1.12 seam row 9 → base line 1819: APPLIED
- §3.2.7 seam row 9 → base line 1819: APPLIED
- §3.2.9 CR-ES-4 → base line 2046: APPLIED
- R25 colophon → base line 2106: APPLIED

## NOT FOUND
- none (every anchor asserted unique; a miss aborts the script).

## For the fold to rule
- ES-5d's `missionCreditEvents` is a NEW spatialLedgers sub-key (CONFIRMED by read, espionageCareerCredit.js:16/:200-209, spatialUsage.js:307), against AES §1's "ZERO new spatialLedgers sub-keys". Recorded, not ruled.
- AES §2 degraded-arm list and seam rows 5/6 (deliberation into GR `answerDueTick`, the sovereignty buyer arm) are unbuilt and GR/WAR-silent (findings T16/T17). Those are §4 rows, not §10, so they were not bracketed.
