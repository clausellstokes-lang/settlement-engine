# PL-r5-verify — the refuting verifier for THE POLITY, P3 round 5b (V-PL-r5, Opus 5.5; chair 0a2e8bd9; 2026-10-19 08:33 EDT by `date`)

**COUNTS: 34 holds · 2 fails (both ROUTED-UNAPPLIED, from round-5 lanes that closed after PL) · 0 stop · 3 new (0 BLOCKING · 3 MAJOR) · routedUnapplied 2.**

**What I read.** I read the kit README (RESUME BLOCK 2), `briefs/VERIFY.md`, `SKEPTIC.md` and `RESEARCH-COMMON.md`. I read every rulings file through `RULINGS-ROUND5.md` §A–§D, and CHAIR-NOTES 1–19. I read the BOARD's owner lines, including l.55–56 and the tail to 08:01.

The round's inputs were `skeptic/PL-r4-verify.md`, `skeptic/SEAMS-r4.md` (whole), `skeptic/BD-r4.md` (its PL routes), `cure/D-PL-r5.md` and its probe directory.

The volume is `docs/DESIGN_FP_ARCH_PL.md`, read whole: 922 lines, sha256 `f6e16f16…`, last changed 03:58:38. I also read the ROUTES sections of all ten `cure/D-*-r5.md` files. To check each seam, I read the sibling text it cites: PS l.130/220/379, the PR §2.6/§2.7/§10.3 (f)/R21 rows, ST l.386/457/665, BD §10.2 and §10.5, and the fold's `raid` and `supply_raid` rows (l.504 and l.530).

The code of record is master `81f1cd963`, read-only. There I re-read `lastTransitionTick`'s writers, `travelTicks = Math.max(1, …)`, `INTERVAL_WEEKS` and the normalizer's `relationshipType`.

**Probes** (`skeptic/PL-r5-verify-probe/`):
- `age_r5v.py` / `.out` is an INDEPENDENT executor of §3.5 `A`, written from the volume's text and not from the lane's script. It reproduces P52 (a)–(e) exactly: 1.0 · 1.0 · 0.2 · 1.0 · dark. A protective crown reads 0.039.
- `receipts.sh` / `.out` holds the grep receipts for every row below.

## THE TABLE (every disposition of `cure/D-PL-r5.md`)
| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| PL-V5 partial + D-PS-r4 route 2 | CURED (A.6) | HOLDS | §4.3 (3)(b), P47 (b)/(e), OD-PL-54 and §13 now read "a `raid` … UPON the member … `succeeds` or `bought_off`, or a `supply_raid` on the member's supply … `succeeds`". This matches the fold's l.504 row (`repelled · succeeds · bought_off`, WHERE `settlement`). |
| D-ST-r4 §5 → PL | CURED (A.8) | HOLDS | The den closings are repelled = failed, a self-ending den writes no row, and the episode's tick is the opening tick. These sit at §3.5 `P`, §4 bracket (2), P43, OD-PL-49 and OD-PL-53. They agree with ST l.386. |
| D-BD-r4 §5 → PL (L-BD 23b ×4) | CURED (A.8) | HOLDS (+ PL-Y3) | §4.8 (4) and (5) exist and use no new kind or prefix. BD §10.2 (b′) and §10.5 still carry their r4 text, so BD has not applied PL's routes back to it (that is BD's half). |
| STOP-PR-r4-1 PL half = SEAMS-r4-3 | CURED (§E · A.8) | HOLDS (+ PL-Y1) | F.1 now reads "NEVER SKIPPING A LORD'S ROW". §4.1 (i)/(ii) give the mid-lord's credit or friction, and P53 pins it. |
| PL-r4-S1 = SEAMS-r4-2 | three flips | HOLDS | §4.3 (3)(b), P47 (c) and OD-PL-54 each carry a `[RE-RULED]` bracket. No live "carried as ruled" remains (0 hits). |
| PL-X1 | CURED (A.7, `oathSince`) | HOLDS | My own executor reproduces the lane's numbers. `lastTransitionTick` has three writers; I re-read it at canonRelationshipImpact.js:167 and relationshipHierarchy.js:106. |
| minors 1–7 | CURED | HOLD | The PS quotation matches PS l.379 word for word. PS §5.5 carries the banner arm. |
| B.8 · B.9 · B.11 (siege) · MN m6 · B.14 | CURED | HOLD (B.9: see F2; B.11's incursion half is PL-Y2) | PS's §5.3 route holds in substance: the l.306 ladder row and the §4.5 bracket are present, though `passageStandingOf` is unnamed (0 hits). |
| NOTED / "=" rows (BD-r4 · D-PS-r4 1·3 · D-PR-r4 (1)(2) · D-MN-r4 · A.6/A.7/A.8/B.22) | NOTED / = | HOLD | None of them owes PL any text. |

## FAILS
| Id | Class | Verdict | Receipt |
|---|---|---|---|
| F1 · D-ST-r5 §5 → PL | ROUTED-UNAPPLIED | **FAILS** | **The route:** "`protection_kept` when the den is cleared AND no force the member holds hostile keeps the site after". ST carries this clause 4 times (l.386, 457, 665). **PL still reads** "or by anyone, the member standing unharmed being the fact" (l.251), and P43's MIRROR says "(or by anyone)". PL has 0 hits for the clause. **The consequence:** under ST's A.3 the clearer holds the site, so a hostile gang that takes the den is still a den, yet `P` rises. This is PL-V5's false-receipt class again. |
| F2 · D-PR-r5 §5 → PL | ROUTED-UNAPPLIED | **FAILS** (wording) | **The route:** "read the tally through `bannerCoverOf(worldState, memberId, tick).weeks` (the field is a pair)". **PL still reads** "`protection_kept` when `weeksCovered > 0`" (F.4), and F.6 (b)(i) reads "(`> 0`)". **PR's shape** is `{ seasonStartTick, weeks }`, with "`weeks` 0 when the pair is … of another season", and PR fixes the read at "its last tick, after PR's stage has counted that week". PL says only "at the SEASON'S END". |

## NEW FINDINGS
| Id | Sev | Site | Claim / receipt | Cure |
|---|---|---|---|---|
| PL-Y1 | MAJOR | §4.7 F.6 (b)(i), P49 (f), §13 l.623, §15.12 | **The sweep counts the crown's protection as a grievance.** The trigger is "riders of the banner not the lord's own PLACED … in a season in which no cover occasion stood". PR's tally counts "a rider of ANY OTHER power", and PR R21 includes "a threat Kell's riders could not reach". Under the crown's `staunch`+ read in peace, the net (F.3: "by right of the banner") and its threat cover therefore charge EVERY covered member a resentment patch each season, with no protection row. That cuts against the owner's word: "This si also how we can express protection from the crown". It also cuts against §F.6's "an overlord who sweeps his roads unasked". §13's line names "the crown's riders" even when the riders are a fellow member's (the Evidence Law). It also drains the strong hold every season. PR's open question 2 states the same gap. | Count only the crown's OWN riders placed by its quartering or order (§15.12, §4.8 (2)) on a lord whose riders stayed home. A fellow member's riders riding by right write nothing, and neither does a threat cover. PR's tally then needs the riders' power and need. |
| PL-Y2 | MAJOR | §4.3 (2) REFINED (B.11 incursion) vs PS l.130/l.220; RULINGS-ROUND3 §E.2 | PL says: "only once the LIEGE BELIEVES … the card carries no liege line, no share enters the threshold or the contest". PS says: "PS's incursion leaf takes the answer at first sight … it stands as an input line on the incursion card" (0 B.11 hits in PS). §E.2 says the call is "the week the incursion is first seen". The first-week contest therefore differs by volume, and a lane's REFINED re-rules §E.2. PS's open question 3 asks the chair the same thing, and no PS verifier sits in round 5b. | The chair rules (PS open question 3), and then PS §7.5/§2.8/L2 or PL §4.3 (2) aligns. |
| PL-Y3 | MAJOR (PLAUSIBLE) | §4.8 (4)(a), (1) | "(a flock of the liege's own creed is SERVICE, never a default)" has no stance guard. A member that `curbed`/`outlawed` the crown's flock pays (4)(c)'s `fealty_defied`, yet earns (a)'s `service_answered` credit each dwell as the persecuted flock spreads. Under B.2 the flock may even be raiding a fellow member, and that raid is "never a default". This works against the owner's "keep their own peace or be held responsible". | Give the credit only where the member's court stands `permitted`/`endowed` toward the flock. A hostile flock's spill is `peace_unkept` whatever its creed. |

**Minor notes (not counted).**
- The patch lists are stale since `riders_quartered` became a patched row: §4.3 ("elsewhere in the record only `renew`'s … and every `fealty_defied`"), OD-PL-59, and OD-PL-52's OBLIGATION list.
- §4.1 (ii) extends §E's "rode past it unasked" to a lord that `refused` (P53 (b)) without a REFINED mark.
- A directly summoned sub-vassal's cover outcome moves only the bypassed mid-lord's `P`, while P10's idiom writes the paramount's duty on both edges (PLAUSIBLE).
- On an imported edge with no `oathSince`, the first eviction baseline SETS the field, so `A` reads 0.693, not 1.0 (`age_r5v.out`). §3.5 omits §10's "oldest row" fallback.
- §3.5's "A turns on no other family's flag" overstates: `protection_kept` is written by OBLIGATION.
- §4.8 (1) says "one of (4)'s three rows", but (4)(b) routes a non-endowed rival flock to (1)'s `peace_unkept`.
- r4 REFINED (iii)'s "a row a season would crowd the 24-row record" now stands beside a seasonal row.
- (5)'s casus has no writer while BD l.680 still says "ROUTE PL" (BD's half).

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by quoting both texts: F1, F2, PL-Y1's text chain and PL-Y2. CONFIRMED by execution: the age term (`age_r5v.out`). CONFIRMED by read at `81f1cd963`: the master receipts. PLAUSIBLE, never upgraded: PL-Y1's size, PL-Y3's reachable state (BD's spill law for a hostile flock), and the mid-lord attribution note. No git, no suite; nothing written but this file and the probe directory.
