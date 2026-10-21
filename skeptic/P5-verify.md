# V-ALL-p5 (pass 2, after P5d): the refuting verifier over every P5 disposition (chair 6eb7b5b6; seat Opus 5.5; 2026-10-20 16:2x CDT)

**COUNTS: holds 18 · fails 1 · stop 0 · new 0 BLOCKING · 0 MAJOR** (five new MINOR notes, all already routed).

This pass covers RULINGS-P5 §D.8: it re-judges the P5d dispositions of D.1–D.4 and re-checks the 15 holds from pass 1 against the volumes as they stand now. The pass-1 report (15:57) is preserved byte-for-byte at `P5-verify-probe/P5-verify-pass1-1557.md`. My receipts are in `P5-verify-probe/pass2/receipts.txt`. Master `81f1cd963` was read only.

The one fail is **P5-V1's ES half**. BD now states master's real custody behaviour and declares the keep as ES-2b's build step. But **ES l.1585, the row the finding cites, still says** "dark ⇒ `normalizeForeignGuestHold` byte-identical — the six-field refusal stands" **and** "dark-after-lit: rows kept, inert". Master still re-normalizes the whole ledger on every read and write (`foreignGuestHold.js` l.350 and l.384 `.map(normalizeForeignGuestHold)`), and its dedupe (l.367 `counts.errandId.get(String(row.errandId)) === 1`) erases errand-less captives. The fix is routed to P6c only through BD §19.0e and the cure file. The BOARD's P6c input list (16:00) names RULINGS-P6 §C and RULINGS-P5 D.7, not this item. **Cure:** add BD §19.0e's ES line to P6c's arguments, along with a `captiveId` row in the ODQ P5 addendum.

## Verdicts
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| **P5-V1** (pass-1 new) | CURED (BD half) + ROUTED (ES) | **FAILS (ES half)** | BD27, §9.10 and §15.1 are correct, with `custody.out` executed on master's module. ES l.1585 is unchanged and false, and the route is missing from P6c's listed inputs. |
| P5W-2 (pass-1 fail, PR/PS halves) | CURED | holds | PR l.389/390/490/727/728 and PS §6.5 are re-worded and each carries `[OPENED …]`. Placing the envoy outside ES's three shapes agrees with ES's "nothing wider". |
| P5C-9 (pass-1 fail) | CURED (walls rung only) | holds | `wallsRung.out` shows 0 of 18 rows move with readiness. Master's ladder reaches idx 4 only on `hasWalls && defense >= 55`. The `ruined` drop is a visible institution state. |
| MN · RN halves (pass-1 fail) | CURED 13/13 + 9/9 | holds | MN has `WC-car-0` ×13 and `press01` (the fold §5 l.947 matches). It has one week per hop (`UNPRICED_LEG_WEEKS: 1`), COMMIT THE FORCE DARK pending WC's row, and the sighting callers aligned with BD §2.4. RN has its l.414 IN clause struck, `seat_change`/`war_concluded` doors cited (PL-8, GENERALS U4), `deedRingAt`, `fought`, and the quarter receipt. |
| D.2 residue (PR §9.1(e) seven claimants, PS14, ST §6.5 (j), ST §4.4 garrison, SP l.15) | CURED | holds | Fold l.1154 lists "SEVEN". ST l.320 cites PL F.6(b)(iii) "never a weave incident". SP l.15 is an insertion only. |
| D.4 (`riders_quartered`) | CONFIRMED | holds | ST12 and §4.4 match PL. |
| The 15 pass-1 holds (P5W-1 · P5W-3 · P5C-1..8 · P5C-10 · P5C-11 · `arriveAt` · two REFUTED) | as pass 1 | holds | Each was re-checked where P5d touched it. P5C-1 now has MN's cite. P5C-10 now reads `arrivalTick` (master `planBlockade` l.594). For P5C-11, CH has 23 "(14)" cites (L-CH-PD, D.5). |

## New findings
None at BLOCKING or MAJOR. Five MINOR notes, each already routed:
1. GENERALS l.346 U4 still makes the general a "second doer `p:<npcId>`", while RN l.243 gives him his own `<warId>:general` deed (routed to P6c).
2. The fold l.820 `REGARD_CAUSES` mirror still lists `served_with`, `gift` and the stale `abandoned_by` (routed to P7).
3. RN's new cause `sheltered` names the act PL and BD call `harboured` (RULINGS-ROUND2 A.14), and it is a homonym of the defence band. It is registered, but it is one act with two words.
4. BD27's body text still says "the owner's slot" beneath its OPENED bracket.
5. WC's retire row must name the debited pool, because `dm_removed` debits only `block` or `free_unit` (`peopleLedger.js`).

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by reading master and the ledger volumes at 16:2x: the ES l.1585 text, master's normalizer and dedupe lines, the ladder's idx-4 condition, `planBlockade`, `dm_removed`'s signature, and every bracket count. CONFIRMED by the lanes' executed probes (outputs re-read): `wallsRung.out` and `custody.out`. PLAUSIBLE: runtime behaviour of every cure (the design is unbuilt) and the readiness-free extract's byte-identity (BD-4's car-0 STOP covers it). No git, no test suite; I wrote only this report and the probe directory.
