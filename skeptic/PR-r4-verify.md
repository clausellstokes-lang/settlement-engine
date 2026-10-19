# PR-r4-verify — the refuting verifier on THE PATROLS' round-4a cures

Seat V-PR-r4 (Opus 5.5), chair 0a2e8bd9 continuing a73343ed, 2026-10-19 02:49 EDT (by `date`). Read whole: the README (RESUME BLOCK 2), VERIFY, RESEARCH-COMMON, CHAIR-NOTES 1–18, RULINGS-ROUND3 (§A–§G), RULINGS-ROUND4 (§A–§E), RULINGS-ROUND5 (as begun), `PR-r3-verify.md`, `SEAMS-r3.md`, `cure/D-PR-r4.md` and its probe, the volume (1012 lines, sha256 `97162fe5…`, mtime 22:12), and the ROUTES of all ten `cure/D-*-r4.md` files (§E.4). Siblings were read at the cited rows: PL §2/§3.1/§3.5/§4.7/P49, PS PS8/§2.5/P33/OD-PS-45, ST §2.3/§2.4/§7.4, MN MN5/§3.3/OD-MN-40, CH §2.2/§4.2/§5, RN §3.1, and BD §2.3–§2.5/§7.1/§7.6/§19. The code is master `81f1cd963`, read-only. Probes: `PR-r4-verify-probe/net.mjs` → `net.out`; `drawshare.rerun.out` (byte-identical to the lane's). No other file was edited, and no git or tests were run.

## Counts
**holds 51 · fails 7 (all ROUTED-UNAPPLIED) · stop 1 · new 2 MAJOR (0 BLOCKING) + 3 minor.** The four r3 ROUTED-UNAPPLIED rows and A.10 now hold. So do PR-W1–W6 (PR-W3 re-run: identical), SEAMS-r3-2/-6/-9/-10, BD (1)–(7), L-BD 20/39/40/41, the PS and PL routes, and every NOTED row I checked (A.8 and A.11 have 0 live hits; MN keeps the detachment as its second producer).

## STOP
| id | state | what round 5 must write |
|---|---|---|
| STOP-PR-r4-1 | RE-RULED in RULINGS-ROUND4 §E after the lane closed: "never skipping a lord's ROW". | Six sites still say rung-by-rung only: §10.3 (b) l.439, R42 l.723 ("never Merewick's directly"), OD-PR-26, §15.1 PL, the §17 STOP row and §19 Q1. They gain the `unbroken` direct arm and the mid-lord's credit/resentment row. Under ROUND5 A.8, F.6 (b)'s sweep becomes PL's resentment patch, so PR §7.6, §10.3 (h)(b) and R21 must follow PL. |

## Fails (ROUTED-UNAPPLIED)
| route | the route | the volume now |
|---|---|---|
| CH→PR 1 | "'CH's aim `hunt`' → `hunt_body`" (`hunt` is LANDED in 22 src files; CH §4.2) | l.294, l.594, R46: "CH's aim `hunt`" |
| CH→PR 2 | the warden archetype also counts "a warden paragon RETAINED by the court (`isWardenParagon`)" | l.295: "held by CH's WARDEN archetype" only |
| CH→PR 3 | "a PARAGON on a trail is met by `trailWatchOf` exactly as a body is" | §8.1 gives only bodies a trail arm |
| RN→PR | "doer the body …, its leading paragon riding as `ledBy` … never also a `body_act`" | l.341: "or the villain, where RN admits the source (BD's `body_act`)" |
| BD→PR (8) | "the commons' SUPPORT raises a body's cover … (+0.2 DRAFT)" | §8.1's cover is `cover01` or the body's size visibility only |
| BD→PR (9) | "an `informer` sighting … read by `predictedPlaceOf`" (`believedBodyOf`) | it reads `believedBodies`, whose return carries no might, yet §5.1 takes "its band the believed might" from it |
| BD→PR (11) | "the warden's `bribe` target is PR's unpaid-wages slot" | there is no gang `bribe` cite (§6.4 and §10.5 cover goods and runners only) |

## New findings
| id | sev | site | receipt and cure |
|---|---|---|---|
| PR-X1 | MAJOR | §10.3 (c) l.440; R39 l.720 | **The problem:** each member's lent riders are `floor(n × share01 × hold01)`. At the crown's `staunch` read (hold < 0.70; reach 0.2), no sub-vassal of any tier ever lends, and a town-sized direct vassal lends 1 only at band `strong`+ (EXECUTED `net.out`). So R39's "Ashford's lent … riders", its lender's credit and its `riders_lent` can never occur. PL F.2's Σ yields 9 riders for ten town vassals; PR's per-member floor yields 0. **Cure:** floor the kingdom's Σ and apportion it by largest remainder (codepoint tie-break), and re-cut R39. |
| PR-X2 | MAJOR | §2.6 l.200; §10.3 (f); §2.7 `lived`; §16.1 horizon | **The problem:** `bannerCoverOf(…, fromTick, toTick) → { placed, weeks, powers }` is read "from the placement digest's `lived` rows". But `lived` is ONE week (`{ forTick, on }`; horizon "one week ahead and one week behind"). PL writes `protection_kept`/`failed` "at that season's end" (F.4, P49). Example: the net rides weeks 1–10, then the hold slips. At the season's end the read sees no rider and PL writes `protection_failed`. `weeks` is unreadable. **Cure:** declare a bounded cover latch with its lifecycle (PR's or PL's, an owner's-shape row), or re-time PL's row to first sight. |
| PR-X3 | m | PR10 l.127; §10.3 (d); §6.5 l.325; §2.6 `trailWatchOf` | The law says "a net rider … sees for that member". Both formulas read `watchOf(…, holderId)`, which counts only the holder's own riders. |
| PR-X4 | m | §0.2 l.81; §6.1; §14 PR-1; OD-PR-43; §14 | Drift after PR's lane closed. §0.2 says "THREE feeders" where MN5/OD-MN-40 now say FOUR. PR calls the composer "first-to-land-owns" where MN's r4 has it as MN's owned unit (CHAIR-NOTES 18 (d)). C16's place predates 18 (c), which is P4's. |
| PR-X5 | m | §2.7; §6.6; R38 (a) vs R36/§3.2 | The PR-W3 cure writes no stamp when an army with zero offensive keeps riders. The "fielded never exceeds the kept" bound then has no carrier. Before r4, a stamp was written whenever riders were kept. |

**CONFIRMED vs PLAUSIBLE:** PR-X1 and the PR-W3 hold are CONFIRMED by execution. PR-X2–X5, every RU row and the STOP sites are CONFIRMED by quoting both texts. It is PLAUSIBLE that a builder would not silently add the latch PR-X2 needs.
