# AMEND LANE A — worklog (SPINE · COUPLINGS · ARCH_SP · ARCH_CW), 2026-10-16

Base = kit `volumes-master/` (copied over the destination first; SPINE/COUPLINGS/ARCH_SP were deleted in the ledger working tree and are restored by that copy). Destination = `/Users/cstokes/Desktop/settlement-engine/docs/`. Script: `<scratchpad>/amend_A.py` (every anchor asserted count==1 in the BASE; 126 anchors applied, 0 missed after one fix — `W-CW1-X21`'s anchor spanned a line break and was re-anchored). Insertion-only proof: `<scratchpad>/verify_ins.py` (difflib, line then char level: 0 non-insertion ops in all four files); table pipes unchanged (136/147/181/191); 0 NUL bytes; 0 unresolved `{REF}` placeholders. No git command run.

Findings line numbers are KIT `volumes/` (ledger) lines; master SPINE = ledger +2 after line 81; the other three files have the same line counts. All destination lines below are post-amendment.

| Item | File | Dest line | Result |
|---|---|---|---|
| status header | SPINE / COUPLINGS / ARCH_SP / ARCH_CW | 10 / 22 / 13 / 16 | applied (R-8 folded into ARCH_SP's status bracket) |
| R-1 (alignment; master text kept, EC's old name bracketed) | SPINE | 84 | applied |
| R-2 + OD-FC-14 (errand ledger) | SPINE | 204 | applied |
| R-3 + §3.3.3 (posture names) + see-ref + X3 INT note | SPINE | 250, 253, 259 | applied |
| R-4 (Sol) | SPINE / COUPLINGS | 9 / 20 | applied (+ see-ref SPINE §5) |
| R-5 / requirement 15 binding scope | SPINE | 13 | applied |
| requirements 15–23 verbatim, wrapped | SPINE | 110–185 | applied |
| SP-3 OD-FC-5 (fold §3.2.1) + see-ref | SPINE / COUPLINGS | 224, 614 / 720 | applied |
| SP-7 mode table (fold §3.1.11) | SPINE / ARCH_SP V21 | 546 / 129 | applied (= R-13) |
| SP-8 OD-FC-17 | SPINE / ARCH_SP V22, SP-F | 568 / 130, 767 | applied |
| tithe crux (fold §3.1.5) | SPINE / COUPLINGS | 590 / 568 (+ matrix 234, ref 581) | applied |
| R-6 (declared empty) | SPINE | 639 | applied |
| lane H OD-FC-16 | SPINE | ~663 | applied |
| R-25 lane P stale (+ 2 see-refs) | SPINE | 911 | applied |
| §5 `telling` / `grave` | SPINE | 380, ~1068 | applied |
| S12 heraldFeed :95→:120 | SPINE / ARCH_SP R4 | ~1163 / 145 | applied |
| R-14 (COUPLINGS status) | COUPLINGS | 29 | applied |
| R-15 + §3.3.2 (CPL-22/23 re-anchor, CPL-X.<LAYER>_WITHIN) | COUPLINGS | 73 (+ ref at CW-0 scope) | applied |
| EC absorbs TR (§6 (c), §3.2.10) | COUPLINGS §0.4 | 82 | applied |
| S9 knowledge desk | COUPLINGS / ARCH_CW S13 | 158 / 63 | applied |
| R-16 + §3.3.3 | COUPLINGS | 195 | applied |
| R-17 + §3.3.6 (+ 2 see-refs, §5 item 11) | COUPLINGS | 194, 205, 469, 753 | applied |
| §5 item 6 (no EMPTY grade) + §0.2 see-ref | COUPLINGS | 224, 60 | applied |
| R-18 + §3.3.1 (`exclusivity`, war-volume pointer) + 2 see-refs | COUPLINGS | 283, 734, 1882 | applied |
| R-19 coin reversal (+ 2 see-refs) | COUPLINGS | 311, 608, 654 | applied |
| §3.3.9 WarFaithTab | COUPLINGS | 348, 496 | applied |
| §3.1.4 HIDE toll | COUPLINGS | 673 | applied |
| §5 SCARCITY/MARKET_CONDITION_BANDS; `lure` | COUPLINGS | 699; 595 | applied |
| R-20 + OD-FC-13 (§3.2.16) | COUPLINGS | 1109, 1112 | applied |
| §5 item 8 braided item | COUPLINGS | ~1660 | applied |
| R-21 / requirement 22c (ONE bracket at §9) | COUPLINGS | 1835 | applied (sentences untouched) |
| CW-0/1/3 LANDED/UNBUILT + CW-2 re-scope (both sides) | COUPLINGS / ARCH_CW | 1580, 1635, 1672, 1712 / 418 (+ Q1 ref) | applied |
| CW-1 window OD-FC-1 | COUPLINGS | ~1656 | applied |
| R-9 | ARCH_SP | 16 | applied |
| R-12 + §3.3.8 (L1 kernel; L8 rule; V1 ref) | ARCH_SP | 41, 91, 109 | applied |
| S10 + §3.2.14 (pending door struck) | ARCH_SP L2/L3 | 50, 63 | applied |
| S8 catalog 12/8 → 26/13 | ARCH_SP V11 | 119 | applied |
| R1/R2/R3 refuted rows | ARCH_SP | 142–144 | applied |
| SP flags now lit (FP_LIT_BELIEF) + §9 ref | ARCH_SP | 155, ~904 | applied |
| LANDED marks SP-A/SP-B/SP-C/SP-E, SP-D2 | ARCH_SP | 325, 376, 538, 624, 719 (base) | applied |
| R-10 ES-4 + ref | ARCH_SP | 526 | applied |
| J-SP-5 erratum applied + Q2 ref; J-SP-6 = R-11 | ARCH_SP | ~802, 805 | applied |
| R-7 CW-1 heading + SC-3 | ARCH_CW | 348, 532 | applied |
| R-22 SC-7 (+ S4 ref) | ARCH_CW | 565 | applied |
| R-23 S1 (+ S5 ref) | ARCH_CW | 41 | applied |
| S11/S18, S21, S23 (+§2 ref), S12 req 23 | ARCH_CW | 56, 76, 83, 57 | applied |
| SC-6 requirement 20 | ARCH_CW | 555 | applied |
| §3.3.8 realmItemReadModel "baseline-frozen" | ARCH_CW | 369 | applied |
| X21 braid's own layer table | ARCH_CW | ~357 | applied |
| FIRST-VISIBLE/TIER lines | ARCH_SP 6 (SP-A, B, B2, C, D, E) · ARCH_CW 4 · COUPLINGS 4 (CW-0..3) | — | applied |
| R-24 (DESIGN_FP_ARCHITECTURE.md:1013-1019) | — | — | NOT IN MANIFEST (another lane's file) |

Deliberate non-applications (recorded): SPINE's SP-1..SP-8 are constitution specs, not wave charters — the Tier lines sit on ARCH_SP's waves; SP-F is "declared NON-WAVE" and gets OD-FC-17, no Tier line; ARCH_CW's only `telling` use ("WORN IN THE TELLING") is register-compliant, no bracket; X17 (`sponsor_caravan`) left for the TR/EC lane (VERIFY in DESIGN_FP_TRADE).

For the fold to rule: (1) requirement 15's verbatim text says "bound by requirements 1–22" and §1's title says "15 through 22" while §1 adds requirement 23. (2) R-14 / ARCH_CW Q1: the compiled fold ratified CW-2x as wave #59 (DESIGN_FP_ARCHITECTURE.md:2316), while findings §5 item 8/9 says Q1/Q4 are "recorded nowhere as ruled" — Q1 is ratified there; Q4 (braid standing) still has no ruling row.

## Re-measure after the session-limit resume (2026-10-16)
All four destinations were re-diffed against the base: 0 non-insertion ops each (verify_ins.py). The full script re-run from the base into a scratch dir was `cmp`-identical to all four destinations. So every planned bracket had already landed before the stop, and nothing was left to apply or re-apply. Counts: SPINE 15 dated brackets + 7 owner-row brackets; COUPLINGS 30 + 4, with 4 Tier lines; ARCH_SP 29 + 6, with 6 Tier lines; ARCH_CW 19 + 1, with 4 Tier lines.
