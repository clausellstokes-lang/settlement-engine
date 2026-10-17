# LANE D worklog — TRADE · ARCH_TR · ARCH_EC (amendment lane, 2026-10-16)

## Setup
- EC backup: amend/EC.before.md (= destination at start; byte-identical to kit volumes/EC).
- TRADE: volumes == volumes-master (identical); destination was deleted in the worktree (" D"); restored by cp of base.
- TR: volumes (ledger, 629) and volumes-master (604) DIVERGE both ways: master has FIX-C2c 84bd63f8b re-addresses (S17 :185, S36 :191, S37 :24-60); the ledger has the 08-15 stale-site sitting 51ec5a103 (§106, the TL-F round: S38 door STRUCK, S41 778, preconditions SATISFIED, the WR-10 discharge re-chartered, C-TLF-3, Q1). Brief says base = master; the ledger-only hunks are CARRIED as ADDED brackets (insertions only) so no truth is lost. FLAG for the chair.

## Refinements
(Session resumed after a limit reset: re-measured first — EC == EC.before.md, ARCH_TR == ledger copy, TRADE absent: nothing had landed. All work below is one pass.)

Method: amend/D-scripts/ (engine.py + data_*.py). Every anchor asserted count==1 in the BASE; insertions applied back-to-front; `[see the bracket at :N]` resolved to final line numbers; strip-back of every inserted text == base (asserted); base is a char-subsequence of dest (asserted). Master doc pins (tradeConvergenceContract.walker dependency clauses / endings bullets / TRADE_ENDING_KEYS / honest-permanent-zero / out-of-order sentence; sovereigntyBundleWr10 "bundle composes"; ARCH_TR "**SP-n landed**" strings; CLAIM_RE phrases) EMULATED on the amended text: green (pincheck.py) — emulated, not executed.

Counts (grep -o '2026-10-16 (coherence fold'): TRADE 39 · ARCH_TR 52 · EC 91. See-refs: 13 · 11 · 59. Insertion items: TRADE 39 · ARCH_TR 38 · EC 137.

| Refinement / obligation | File | Where (base text) | Status |
|---|---|---|---|
| status headers (findings §2) | all three | first status sentence | applied |
| FIRST-VISIBLE/TIER lines | TRADE TR-1..9+TR-2b; TR TR-1..9; EC EC-0..18 (EC-11..15 inline) | wave heads | applied |
| ABSORBED-by-EC line (§3.2.10) | TRADE + TR, every TR wave | under wave head | applied |
| R1 ONE TR flag | EC §4 EC-11 row; #55 ref | :573 | applied |
| R2 declared-pending STRUCK §3.2.14 | EC §4 + EC-1 files + EC-10; TR S38/§2/TR-1/TR-9/Q4 | :550 etc | applied |
| R3 second truth door | EC EC-1 belief posture | :811-821 | applied |
| R4 arm 2 → RULED §3.2.12 (gate, no whitelist) | EC EC-17 | :1955-1958 | applied (reader's alt superseded) |
| R5 arm 3 → RULED §3.2.13 + OD-FC-10 + §3.2.10b J-TR-2 | EC EC-17; TRADE J-TR-2 | :1963-1974; TRADE §6 | applied |
| R6 generosityKernel ceiling §3.3.8 | EC EC-17 + §1c | :2061, :2067, :99 | applied |
| R7 founding arm not aspatial | EC §4 | :571 | applied |
| R8 foresight → RULED §3.2.11 + OD-FC-11 | EC EC-16, M59, §10b, E13 | :1773, :1811, :2301, :2519 | applied |
| R9 EC-4 carve-out | EC EC-16 arm 1 (+ref EC-4) | :1768 | applied |
| R10 phantom TR-1 reasons | EC (primary EC-3; refs EC-2/3/4/6/17, M1/M21/M22/M42/M58) | :1042 | applied |
| R11 monopoly → RULED §3.2.10a | EC EC-8 (+refs); TRADE TR-6 | :1589; TRADE MONOPOLY ARM | applied |
| R12 TR-5 handoff → RULED §3.1.1 + OD-FC-2 | EC EC-6; TRADE TR-5; TR TR-5 | :1318; TRADE:858-870 | applied |
| R13 EC-11..15 header slots | EC | :1715 | applied |
| R14 TR-4 after WY-3 §3.2.10f | EC J-EC-15 (+EC-12 ref) | :2641 | applied |
| R15 Phase F envelope vacuous | EC §17 | :2925 | applied |
| R16 R3 provisions | EC §18 | :2969 | applied |
| R17 newsLog | EC §5 (+§8c, §9a, R2) | :653 | applied |
| R18 count 27/29/32 | EC §5 (+5 refs) | :618 | applied |
| R19 sinceTick not lossy (reader's pick, PLAUSIBLE) + dear+ streak | EC | :864, :614, :848, :2561 | applied |
| R20 MOVEMENTS five | EC §8a | :2345 | applied |
| R21 matrix stale cells | EC M1/M6/M7/M16/M19/M20/M21/M28/M37/M39/M45/M48 | §7 | applied |
| R22 E4 grain exception | EC E4 | :170 | applied |
| R23 "they say" → SP-B ladder | EC E2 (+EC-1); TRADE TR-3 (+refs) | :161, :868 | applied |
| R24 merchantAppetite per-origin | EC EC-18 (+E15, J-EC-21) | :2087 | applied |
| R25 SPINE operationRegistry | — | SPINE:91-93 | NOT MINE (manifest) |
| R26 TR/TRADE headers | TRADE, TR | :13 | applied |
| R27 FP-ORDER pair 2 | — | FP-ORDER:5 | NOT MINE; TRADE §9 bracketed instead |
| R28 beliefMap 771 | EC EC-16; TR S41/TR-3/seam 6/Q3 | | applied |
| R29 war seams +1 | EC EC-17 | :2058 | applied |
| R30 house position | EC EC-16 arm 3 (+:1901) | :1781 | applied (§3.2.10c, OD-FC-11) |
| §3.1.3 commons registry row | EC EC-6 (+EC-7); TRADE TR-6 | | applied |
| §3.1.4 HIDE toll | EC EC-6 (+S43) | | applied |
| §3.1.5 tithe STRUCK | TRADE TR-2; TR TR-2 + seam 9 | TRADE:610, TR:288 | applied |
| §3.2.10c holder | EC EC-13; TRADE TR-6/§4/J-TR-5; TR §3 | | applied |
| §3.2.10d T1 self-read | TRADE T1; EC EC-17 | | applied |
| §3.2.10e TR-9 instruments | EC EC-10; TR TR-9c | | applied |
| §3.3.1 exclusivity | TRADE §2 VA list (+TR-5); TR S18 (+seam 7) | TRADE:234, :857 | applied |
| §3.3.3 posture names | TRADE §2; TR S46; EC M16 | | applied |
| §3.3.5 settlementAlignment | EC EC-3 (+M16) | :1093 | applied |
| §3.3.7 SCARCITY_BANDS | TRADE T1 | :56-62 | applied |
| §3.3.8 sizes | EC §1c; TR S20/S40/S41; TRADE TR-5 | | applied |
| §4 SP-7 walker | EC §9c (+#24); TRADE T10 | | applied |
| §5 MARKET_CONDITION_BANDS / tenth / memory voice | EC E1, §5, R2 | | applied |
| §5A/§5B extras (5,6,8,15,18,20,21,24,26,27,41,42; E5; severance) | EC | | applied |
| TRADE §6 premises: T2, T3 :322, M6a presets | TRADE | | applied |
| ledger-only TL-F hunks (S17,S20,S38,S40,S41,believedMarkets row,TR-3/5/6/7/8 heads,WR-10 discharge,TR-6 census,Q1) | TR | | CARRIED as ADDED |
| code comment tradeConvergenceContract.js:334 "five"; commercialReasonTaxonomy.js:23 | — | code | NOT MINE (named in the EC-6 bracket) |
| Seam One / CR-WR10-B twin sentence ("those terms DO NOT EXIST") | TRADE §3 | | DELIBERATELY NOT BRACKETED — PIN-6 + uniqueness guard read that sentence; §3's flag table and dependency ruling likewise untouched (the TR-9c walker parses them) |
