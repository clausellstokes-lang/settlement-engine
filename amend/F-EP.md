# AMEND LANE F — EP sub-seat worklog (docs/DESIGN_FP_ARCH_EP.md), 2026-10-16

## Setup and method
- BASE `volumes-master/DESIGN_FP_ARCH_EP.md` (4117 lines; it is the ledger copy plus the 18-line banner at master L2-19, verified: `diff <(sed 2,19d master) volumes/…` is silent). `cp` base over destination done first (`cmp` silent before amending).
- One script, `<scratchpad>/fep/apply_ep.py`: 55 entries of (key, mode, exact anchor, text). Each anchor asserted `count == 1` in the BASE before any write (zero misses on the final run). Modes: inline / afterline / para. Pointers `[see the bracket at :N]` resolve to DESTINATION line numbers after insertion. Inserted text was asserted to carry no unescaped `|` (seven insertions sit inside table cells).
- Proof, `<scratchpad>/fep/check_ep.py` (python difflib, base vs destination, at line level and at char level inside each changed line): **violations 0**; 10 inserted lines, 43 lines changed by char-level insertion only. Per-line unescaped-pipe count unchanged on every changed line (no table cell split).
- Counts on the destination (4127 lines): `grep -o '2026-10-16 (coherence fold'` = **31** brackets (on 28 lines); `[OWNER ROW OD-FC-` heads = **4** (31, 32, 33, 34; 11 lines mention an OD-FC row); Tier lines (`req 16/17) — FIRST-VISIBLE`) = **6**; pointers = **24**.
- Code re-checks, read-only at `master-00b648c9d`: advanceEpochLedger.js:133-138, :160, :213 · pulseKernel.js:338, :568 · campaignWorldPulseSlice.js:16 · pulseUndoCap.js:32 · campaignWorldPulseDeferred.js:118-124 · forecastRun.js:111 · historyRingCollapse.test.js:150-159 · entropyRootCensus.walker.test.js:182-185, :346-350, :672-676 · subsystemRowsVirtual.js:405 (no subsystemRowsEpoch.js) · worldPulse/simulationRules.js:241 · .size-baseline.json:13 (1581) · prng.js:112 · applyWorldPulse.js:372 · configSlice.js:80 · the seven EP commits and 9f75594fc (dates and subjects). All reproduce.

## Refinements (findings EP §10) → destination line
| # | Target | Dest line | Result |
|---|---|---|---|
| 1 | banner "ARCHITECTED, NOT BUILT" | 5 | APPLIED, merged into the one STATUS bracket (see below) |
| 2 | "NOT SEALED … no attestation block" | 36 | APPLIED |
| 3 | "BANKED PERMANENTLY at 1580" | 1241 (+ pointer 1290 at "never inherit the 1580 figure") | APPLIED |
| 4 | `{ absent }` accessor signature | 1819 (after the spelled body, the first site the reader named); pointers 1272 (seam edit 7 call), 1384 (leaf export table), 2487 (THE RULE) | APPLIED. The reader's third site "L3002-3004" does not hold the `{ absent: undefined, yearBase: 1 }` text in master (it is slice A's budget line); the text lives at seam edit 7 (base 1270), which takes the pointer. The family-2 spec row (base 2246) is covered by the one-bracket rule, not pointed |
| 5 | "TWENTY-TWO read sites … SIXTEEN modules" | 341; pointers 354, 1978, 2401, 2897, 4063 | APPLIED. The reader's "L2001" does not hold the text in master (it is the RS-12 row); the frozen-denominator sentence of §3b.2a (base 1974-1975) takes the pointer |
| 6 | "REPLAY HORIZON IS BOUNDED AT 80 ADVANCES" | 2640 (paired with OD-FC-33); pointer 3739 (Q3) | APPLIED |
| 7 | "INHERIT, NEVER MINT … its entire job" | 2521 (paired with OD-FC-31); pointers 2522 (forecast row), 2532 (preview threading), 2958 (EP-2's agreement pin) | APPLIED; the reader's "ruling owed" is superseded by the fold's §7 ruling and the bracket says so |
| 8 | EP-0's "ONE mandatory negative control (personaSlicer)" | 2891 | APPLIED |
| 9 | J-EP-11 heading "SLICE B BUYS ONE LINE" | 3569 | APPLIED |
| 10 | J-EP-12 "The ledger is `{ byYear }` only." | 3608 | APPLIED |
| 11 | §5 item 2 `{byYear}` | 3348; pointer 2277 (Arm A's home quote) | APPLIED (EP half). The FOLD half (DESIGN_FP_ARCHITECTURE.md:729, :816-818) is LANE H's |
| 12 | "two of the others (mintRealmVerbProposal …)" | 1876 (doors table, the first site); pointers 3671 (J-EP-15), 3804 (§7b B2's refuted premise) | APPLIED. Deliberately NOT bracketed: §7b's "THIS TABLE'S OWN COUNT IS TWO" (base 3791) — it counts rows B1 and B2, not DM doors, and is true |
| 13 | "EP's row is 53 … survives" | 3306 | APPLIED |
| 14 | "re-counted at `%(head)s`" | 3261 | APPLIED |
| 15 | J-EP-1 `subsystemRowsEpoch.js` | 3460; pointers 813 (§2.2), 2921 (EP-1 charter) | APPLIED |
| 16 | EP-4 slice 1 "remove `seed` from CONFIG_PATCH_EXTRA_KEYS" | 3201; pointer 2724 (§3e H1 "EP-4 repairs it first") and inside EP-4's Tier line 3164 | APPLIED |
| 17 | `pulseUndoStack` SESSION-ONLY | 2511 (paired with OD-FC-32); pointer 3732 (Q2 note) | APPLIED; "still UNANSWERED" updated to "now ruled by delegation" per fold §7 |
| 18 | FOLD:917 | — | SKIPPED — targets DESIGN_FP_ARCHITECTURE.md, LANE H |
| 19 | FOLD:2720 | — | SKIPPED — targets DESIGN_FP_ARCHITECTURE.md, LANE H |
| 20 | closing CUT-TO-POINTER line | 4127 (own paragraph after the closing line) | APPLIED, widened with findings §8's fence/matrix CUT-TO-SENTENCE; recorded, nothing cut |

## Lane obligations → destination line
- STATUS header bracket: **line 5**, inline after "This volume is **ARCHITECTED, NOT BUILT**." Why there: the 18-line master banner (L3-19) is the volume's first status statement and its first status sentence is that one; the `## LANDED 2026-08-07` block and the "NOT SEALED" sentence below it are document-state lines (refinement 2 covers the latter). Refinement 1's content (the commit shas, the phantom `epochSegment.js`) is carried inside the one bracket, so the header has one status bracket, not two. Pointer at 791 (§2.1's "zero hits" measurement, the same stale-by-event fact).
- `[OWNER ROW OD-FC-31]`: 2521, beside the INHERIT-NEVER-MINT law in the consumer table (law text untouched).
- `[OWNER ROW OD-FC-32]`: 2511, at the undo ring (§3c row 1).
- `[OWNER ROW OD-FC-33]`: 2640, at the 80-advance horizon (§3d), requirement 23 cited.
- `[OWNER ROW OD-FC-34]`: 3865, at §8.3's flag-lighting gate; pointers at 310 (§0.1 owner marketing guard, quotation untouched) and 3790 (§7a row 4, E2 DEFER); E3 named in the bracket and at 3804.
- "epoch" homonym: ONE `[CLARIFIED … §5]` at line 2 (after the title, the first use).
- L1–L5 vs the fold's L1–L10: ONE `[CLARIFIED … §5, req 21d]` at line 64 (the first L-number site, where the fold's §1 laws are declared binding); pointer at 964 (the chain's introducing sentence).
- Tier lines (6, one per wave charter): EP-0 2881 · EP-1 2911 · EP-2 2948 · EP-3 2971 · EP-4 3164 · EP-5 3240. TIER everywhere is aspatial-safe (findings §7) with `advanceEpochEnabled` as host flag (EP-0 none; EP-4 slice 2 only). DEGRADED ARM: the legacy same-seed stream (EP-1..3), n/a (EP-0), today's generate behaviour (EP-4), the old copy (EP-5).
- Uncovered §6 stale premise bracketed: EP-1's dormancy estimate "32 property dormancy goldens, 27 golden fixtures, 8 dormancyOracle suites" (dest 2936), refuted by the volume's own §8.1 row 4 (findings X10/S10 named only the fold's copy).

## Deliberate non-applications
- §4 cross-program rows X15 (EP's three year derivations use literal 52s — a requirement-9 / fold §4 Class-B note, PLAUSIBLE-minor) and X16 (the census-walker obligation unknown to other families) are not §5/§6 items and are not bracketed here; X16 is other volumes' to carry.
- S11 (the memory file's "CHAIR-ATTESTED") is a memory correction; the volume side is in refinement 2's bracket. No memory written.
- S12 (premises verified to hold): nothing to bracket.
- Requirement-13 "*Req 13:*" lines in §4 untouched.

## Items the fold must rule
1. **EP-1's FIRST-VISIBLE.** The lane brief said "none — instrumentation" for every wave except EP-3A/B; findings EP §8 row 1 says EP-1's DM sign is "a re-advanced interval differs" (the pulse root re-draws every root-descended stream). I followed the findings (dest 2911, with §7's PLAUSIBLE one-week caveat). Confirm or overrule.
2. **EP-4's FIRST-VISIBLE** is written "none on any advance" with its per-click generator sign named, rather than "instrumentation" (slice 2 is user-visible). Confirm.
3. **OD-FC-31 (a) against J-EP-12.** Pre-minting and persisting the next epoch partly revives the `current` J-EP-12 struck, including its ground (c), "a fourth flag-dark leak surface". The bracket says the build owes J-EP-12's three grounds an answer; the fold may want to rule how (e.g. flag-keyed like M1–M3).
4. **OD-FC-32 has no wave.** Findings §8 calls the persisted ring "not chartered anywhere"; EP §4 has no wave for it. Under the never-deferred law it needs a named slot (EP-2 extension, or its own EP wave before lighting).
5. LANE H owes refinements 18 and 19 and the fold half of refinement 11; LANE F-HB owes HB's "80 advances" inheritance (findings X11).

CONFIRMED: the insertion-only proof, the anchor counts, the bracket counts and every code address above were executed or read at 00b648c9d. PLAUSIBLE: the felt-latency wording on the Tier lines (taken from findings §7/§8, not measured) and the markdown rendering of the inline brackets (not rendered).
