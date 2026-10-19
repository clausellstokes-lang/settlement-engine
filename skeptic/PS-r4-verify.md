# PS-r4-verify — the refuting verifier for THE PASSAGE, P3 round 4b (V-PS-r4, Opus 5.5; chair 0a2e8bd9 continuing a73343ed), 2026-10-19 02:4x EDT

**COUNTS: 41 holds · 4 fails · 0 stop · 2 new (0 BLOCKING · 2 MAJOR) · 2 of the fails are ROUTED-UNAPPLIED.**
- The 4 FAIL rows are: minor 1 (P7, EXECUTED), L-BD route (2) (one defect with PS-X1, logged on two rows), RU-PL-1 and RU-PL-2.
- The 2 new MAJOR are PS-X1 and PS-X2.

**What I judged.**
- The 43 rows of `cure/D-PS-r4.md` (CURED 26, NOTED 17).
- RULINGS-ROUND4 §A–§E. §E arrived after the lane closed, and the volume is judged against it as §E itself directs.
- The ROUTES of all ten `cure/D-*-r4.md` files (RULINGS-ROUND3 §E.4), plus BD §19.0, which BD's own §5 names as its full route list.
- The volume read whole as it stands: 862 lines, timestamped 21:49.
- Sibling text where a cure depends on it: PL §2, §3.1, §4.3 (2)/(3), §4.7, §5.3; BD §2.3, §2.5, §5.2, §19.0; PR §2.6, §6.5; the map contract.
- The code of record is master `81f1cd963`, read-only. My probes are under `skeptic/PS-r4-verify-probe/`. I did not run git or the suite, and I edited no file but this one.

**The 41 rows that hold:**
- PL-V5 / §E.2: the parenthetical is gone. The only "polity before passage" hits are inside cure brackets.
- R-CH: 0 bare "CH's gate".
- R-PL / A.2: `liegeAnswer` is declared, with its L2 lifecycle, the liege line on the card and the three choices. The mint waits for the resolution, and undo restores the line and the row together.
- R-ST-a, R-ST-b, SEAMS-r3-7, A.11: the struck phrases survive only in brackets.
- PS-W1 / A.1: `passageDefenceOf` is read by the threshold, the battle, §9, P14 and OD-PS-42. "Sent, but too few" is written only after a fought and lost contest.
- SEAMS-r3-6 / A.7: strong, weak and broken arms; the holder's belief, as PL §3.1 (f) rules; the crown's riders are a foreign unit across a break.
- Minors (a)–(f).
- L-BD route (1).
- A.12.
- The 15 NOTED rulings: the greps show 0 hits outside the cure record.
- The D-*-r3 route rows.

**Receipts I checked:**
- At master:
  - `armyTransitKernel.js` l.840 `resolveFieldBattle({ a: battleInputs(a), b: battleInputs(b), rng, tick: nowTick })`
  - `armyTransit.js :: resolveFieldBattle`'s `const ida = String(a.armyId)`
  - `ArmyTransitRecord.armyId`, "the owning settlement id"
  - `candidateRoutes`' edge-removal construction and its sort
  - `supplyShipments.js :: routeWeeks`
  - `chooseRoute`'s re-score
  - `allyDefenseEnabled`
- The lane's `p7-minimality.out` re-ran byte-identical (`p7-minimality.rerun.out`).
- `tablecheck.py` finds 0 mismatches.
- The round-4 tokens are FREE: `liegeAnswer`, `in_hearing`, `hidden_way`, `trailNodes`, `hidden_approach`, `passageDefenceOf`, `hiddenWayFor`, each 0 src · 0 tests.

**ROUTED to PS in the ten r4 files:** only D-PL-r4 sends anything (3 routes). D-PR-r4 says "none owed"; MN, ST, CH, RN, PT and FOLD route none; BD §19.0 says "PS: — (nothing new …)".
- D-PL-r4 route 3 (the jurisdiction read) is carried in substance. `polityHoldOf(…, rootId, holderId)`, the holder's belief, and `swornLinkSuspended` as a broken rung are all at §5.5. Only the citation is off: "PL §2" where the route asks for "PL §3.1 (f)" and "GUARDED, PL §5.3". This is minor note (a).

## FAILS

| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| minor 1 (P7) | CURED: the MINIMALITY pin, with the pick made by `chooseRoute`'s own scoring | **FAILS (EXECUTED)** | P7 (l.557) says "so a detour is never chosen when a more direct B-avoiding route's seasonal cost is lower", and §5.1 (l.305) says "a detour around a holder is never chosen when the direct route's seasonal cost plus its believed passage cost is lower". But the pick the cure prescribes minimizes `scoreRoute`'s `effectiveCost: round4(base + dangerCost + tollCost)` (`embattlement.js`), which is not the seasonal cost.<br>`p7-danger.out` runs the lane's own fixture plus an embattlement ledger (level 0.6 on C and B, summer):<br>• Candidates: O>C>D at seasonal 110 / effective 155; O>E>D at 130 / 130.<br>• The scoring picks O>E>D, so the P7 clause is VIOLATED.<br>• For the planner, the direct route is seasonal 100 / effective 145, and the pick is O>E>D, so the §5.1 clause is VIOLATED.<br>So the pin reds on a correct world, the same class as round 3's fail. The lane's probe tested seasonal minimality with `worldState = {}`, so danger was 0.<br>The chair's own B-row wording ("the cheapest SEASONAL path; a detour is never chosen when the direct route's seasonal cost is lower") is the source of the bad clause.<br>**Cure:** assert minimality by the landed effective cost (seasonal + danger + toll), or restrict the seasonal clause to candidates with equal danger and toll. The chair's B-row wording needs correcting with it. |
| L-BD route (2) (= PS-X1) | CURED: THE HIDDEN WAY | **FAILS (a new cross-volume contradiction)** | The mechanism is carried, but its knowledge read disagrees with BD's and PR's round-4 text. See PS-X1. |
| RU-PL-1 (ROUTED-UNAPPLIED; = SEAMS-r4-2) | D-PL-r4 → PS: "PS §7.5 … add that a crossing ending at the member's own walls writes NO incursion outcome … if the chair takes STOP PL-r4-S1's re-ruling, PS cites PL §4.3 (3)/OD-PL-54 instead of restating the `kept` arm" | **FAILS** | The chair took it. RULINGS-ROUND4 §E says: "A.6's 'passed-through after `kept` = `protection_failed`' is WITHDRAWN … PS §7.5 cites PL §4.3 (3) instead of restating; a crossing that ends at the member's own walls writes no incursion outcome".<br>The volume still restates the withdrawn arm in two places:<br>• PS14 (l.127): "after `kept`, turned back or beaten → `protection_kept`, passed through → `protection_failed` (A.6 stands)".<br>• §7.5 (l.375): "after `kept` … passed through → failed".<br>"Own walls" has 0 hits. |
| RU-PL-2 (ROUTED-UNAPPLIED, partial) | D-PL-r4 → PS: "`liegeAnswer` is ONE line per liege per unit — mirror the value onto every crossing row of that unit whose holder is a member of the same liege in the same week … at a relighting PS's leaf takes the default" | **FAILS (the mirror half)** | The relight half is carried at L2 (l.508). The mirror half is not:<br>• §4.1 step 2 (l.269) and L2 create (l.501) give every first sight its own `reliefAnswerOf` default, or a COPY of a row PL has already minted.<br>• Only the DM's hand is "written to every live crossing".<br>• PL mints at the resolution (PL §4.3 (2): "PS mirrors the value onto each crossing row of that unit under that liege"). So a unit that sweeps two members of one liege in one tick (hops > weeks) gets two defaults (two `memberId`s) before any mint.<br>• The second member's threshold and battle then read a line that PL's fallback ("mints from the row of the FIRST crossed member") overrides. |

## NEW FINDINGS

| Id | Sev | Site | Claim / receipt | Cure |
|---|---|---|---|---|
| PS-X1 | MAJOR (a cross-volume read mismatch; owner word L-BD 41) | §2.7 l.194; §5.6 l.334; §14 BD l.607; P32 l.582 | PS reads what a court knows of the hidden ways from the STORED ledger only:<br>• `hiddenWayFor` reads `spatialLedgers.hiddenWays.known[moverId][trailKey]`.<br>• The witness test reads "`known[B][trailKey].watched`".<br>The other volumes say otherwise:<br>• BD §2.3 (l.223–224): "THE KNOWN SET IS A UNION, ONE READ. `knownTrailsOf(…)` = the town's STORED learned set ∪ its OFFICE'S WAYS … DERIVED, never stored", and "Its readers, each reading the union and nothing else: … THE PASSAGE's `hiddenWayFor`".<br>• PR §2.6 (l.198): `trailWatchOf`'s known set is "∪ the warden office's ways, which are known AND watched by the office's trade, L-BD 41".<br>• The owner, 18:33: "a warden … has access to hidden routes network as part of their job".<br>So PS's own P32 premise ("Kell's warden knows the drovers' path") cannot be met by PS's own read, and PS's witness statement misses the ways a warden's office knows. The cause is parallel-cure drift (BD r4 22:47, PR r4 22:12, PS 21:49), but the owner's word was on the BOARD before the lane opened. | `hiddenWayFor` and §5.6's witness clause read `knownTrailsOf(worldState, snapshot, id, tick)` (BD §2.3), and P32 and pin (20) follow. |
| PS-X2 | MAJOR (a PL law not carried; surfaced by the A.7 cure) | PS4 l.99; §2.2 l.154; §5.5 l.325 | §5.5 says "armies are untouched (members' armies stand as allies by PL §4.5, the banner is the riders' only)". The army rung reads a believed `vassal`/`patron`, or "members of one polity by PL's walk", as `ally`, with no polity-contest arm.<br>PL says otherwise:<br>• PL §5.3 (l.285): "while [`swornLinkSuspended` is] true, the sworn edge READS AS `rival` to every war and peace decider".<br>• PL's walker (l.304) "REDS unless it is in GUARDED ∪ EXEMPT", and GUARDED lists only PS's riders' read (l.302).<br>So in a polity war a claimant's army crossing a crown-side member is welcomed as an ally with tolerance, and PS-0's leaf, which reads the vassal type, would red PL's walker. | PS4's rung reads the sworn edge through the guard: a suspended edge is `stranger`, and members on opposite sides of a standing contest are not "one polity" for the ally test. PS's ladder is also added to PL §5.3's GUARDED row (route to PL). |

**Minor notes (not counted):**
- **(a)** Route 3: cite PL §3.1 (f) and the GUARDED set.
- **(b)** §E: the trail factor is the landed `HIDDEN_PATH_SLOWDOWN` (2). PS inherits BD's `TRAIL_WEEKS_MULT` 1.5 through `weeksMult`. This is SEAMS-r4-15; cite the landed symbol.
- **(c)** The map contract: `trail` is a visible rung (`wild · way · trail …`; hidden = {wild, way}), and a junction's WHERE is `junction:<id>`. This is the late-arrival MINOR class (§E).
- **(d)** A DM change of the liege line AFTER PL's mint (week 2 or later of the STANDING card) re-derives the threshold and the battle, while PL "REUSE[s] the minted row". The line and the record can then disagree. Freeze the line at the mint, or make the change a correction that re-mints.
- **(e)** An `in_hearing` crossing that the same tick's sweep exits (hops > weeks at a bound) has no named archive row, and its card seals on a closed crossing.
- **(f)** The `permits` row lists `leaveBy` as required, but a `banner` permit has none. Mark it `leaveBy?`.
- **(g)** P33 says an enemy patrol is "refused or barred", but an enemy is never `refused`. Also, §7.5's one battle for a patrol, which has no transit record, is unspecified.
- **(h)** §17 #14's scrutiny says "outnumbered Tolle's guard", but after A.1 it is Tolle's DEFENCE. §17 #20 blames the crown's hold for a feud, but PL F.5 leaves the stack unchanged by a feud.
- **(i)** CHAIR-NOTES 18 (d): `passageDefenceOf` serves a decision (the threshold) and the physics (the battle) without naming its read class.

**CONFIRMED vs PLAUSIBLE.**
- **CONFIRMED by execution:** the P7 fail (`p7-danger.out`, landed `seasonalPathCost` · `buildSeasonalOverlay` · `scoreRoute`), and the lane's `p7-minimality.out` re-run byte-identical.
- **CONFIRMED by code read at `81f1cd963`:** the lane's receipts listed above.
- **CONFIRMED from both volumes' current lines:** RU-PL-1, RU-PL-2, PS-X1 and PS-X2.
- **PLAUSIBLE:** how often PS-X2 and RU-PL-2's branches occur, and minor notes (d)–(i).
