# D-PR-r4 — the round-4a disposition of THE PATROLS (`docs/DESIGN_FP_ARCH_PR.md`)

Seat: disposition lane D-PR-r4 (Opus 5.5), chair 0a2e8bd9 (Fable 5.1) continuing a73343ed, 2026-10-18 (start 21:22 EDT by `date`; volume work closed 22:1x). Read whole: the kit README (RESUME BLOCK 2), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD (items 1–17), RULINGS-ROUND1 (+ addendum), RULINGS-ROUND2, RULINGS-ROUND2b (+ addendum), RULINGS-ROUND3 (§A–§G), RULINGS-ROUND4 (§A–§D); `skeptic/PR-r3-verify.md`; `skeptic/SEAMS-r3.md`; the ROUTES of all ten `cure/D-*-r3.md` and of `cure/L-BD.md`; `briefs/L-BD.md` items 20 and 29–49; the volume (860 lines, mtime 17:42, sha256 `cad939f8…`, kept byte-for-byte at `D-PR-r4-probe/DESIGN_FP_ARCH_PR.pre-r4.md`). Siblings read at the cited rows: BD (owner words, §1, §2, §5, §9, §10, §19), PL (PL5, §2 incl. its round-4 BANNER STACK, §3.1, §4.1, §4.7 THE BANNER as written by D-PL-r4 at 22:0x, §15.12), PS (PS4, PS8, §2.5, §5.5 THE BANNER and OD-PS-45/P33 as written by D-PS-r4 at 21:5x, l.317), ST (§2.3, §2.4 tokens, §7.4 PR row), MN (§3.3 l.185, §4.2 l.263, `menace_met` rows), CH (§2.2 l.207), HB (§1.1, its title). The BOARD's owner lines for the banner (~19:2x) and the hunt, habit, mission and warden words. The concurrent round-4a cure files `D-PS-r4.md`, `D-PL-r4.md`, `D-ST-r4.md`, `D-CH-r4.md` (their routes to PR, read at 22:0x). Code of record: master `81f1cd963` (read-only). No git; no test suite.

## 1. What I measured first (each CONFIRMED by reading the cited symbol at master `81f1cd963`, or EXECUTED)

(a) **PR-W1 — no carrier for "held one season".** `worldPulse/commonsVoiceKernel.js :: commonsGrievance01(settlement, opts)`: "`return clamp01(CV.W_LEGIT * legitDeficit + CV.W_CORRUPT * (opts.corruptionSignal ? 1 : 0) + CV.W_UNREST * (unrest ? unrest.severity : 0),`" — a pure per-call blend. `worldPulse/strategicPosture.js :: courtRiskAppetiteOf` returns "`Object.freeze({ kind: actor.kind, id: actor.id, present, stock01: …, band: …, receipt: … })`" — no since-tick. `worldPulse/intervalWeeks.js :: INTERVAL_WEEKS` "`one_season: 13,`". CONFIRMED: the verifier was right; the cure declares `forkSince`.

(b) **PR-W2 — the stamp's write line.** `worldPulse/warDeployment.js :: evaluateWarLayer`: the seed "`const seededRecord = seedDeploymentState({ targetId: chosenTarget, cap: fromCap, … });`" is followed by the landed one-line stamp idiom "`if (coalitionDecision) seededRecord.joinLedger = [coalitionDecision.anchor];`" and "`if (casusList.length) seededRecord.casusReasons = casusList;`". CONFIRMED: the stamp is one more such line in the opener (+2 host lines in all); `seedDeploymentState` (`warArmyRecord.js`, 72 eff) is not edited.

(c) **PR-W3 — the 0/0 share.** EXECUTED `D-PR-r4-probe/drawshare.mjs` → `drawshare.out` against master's `feasibilityGate.js`: (1) `classifyFeasibility({ attackerCurrent: 0, … })` against a defender at legitimacy 10 returns `require_betrayal` (siege permitted) at defender 0, 5 and 40 — the collapse override precedes every floor — and `auto_fail` at legitimacy 80; (2) the prefilter with offensive 0 and riders kept: raw `NaN` never skips, a literal 0 always skips, 1 (identity) behaves as dark; (3) the cure's construction: offensive 0 · draw 6 → drawn 0, share 1, no stamp; offensive 5 · draw 12 → drawn 5, share 0, stamp points 5; offensive 40 · draw 6 → share 0.85. CONFIRMED by execution: a literal 0 at 0/0 would skip collapse targets the dark arm keeps although nothing was drawn, so the share is taken over points actually drawn and the chair's 0 guard is kept for the (now unreachable) 0/0 case — REFINED, with the literal alternative in the volume's §19 (2).

(d) **The landed habit substrate (L-BD 39).** `worldPulse/habit/habitVocabulary.js :: CIRCUMSTANCE_CLASSES` (twelve, `route_menaced` among them) and `HABIT_CLASS_CEILING = 12` ("A thirteenth class is an owner gate, not an edit"); `habit/habitCurve.js :: applyCredit` ("`const step = learnRateFor(lawWord) * severityWeightOf(outcomeRung);`"), `habitFactor` ("An ABSENT stock returns EXACTLY the number one"), `HABIT_TUNING.HABIT_ROWS_PER_ACTOR_CAP: 24`. CONFIRMED by read; whether a stretch-keyed action token is admitted is HB-0's (PLAUSIBLE, routed).

(e) **Sibling texts that bind the cures.** ST §2.3 `SITE_READINESS = at_strength · manned · sparse · skeleton · hollow` / `siteReadiness01`; ST §2.4's withdrawal of `hidden`/`revealed` for `keptSecret`; ST §7.4's current PR row; MN §3.3's composition (three feeders, one suppressor slot) and its neutral home `spatial/presenceComposer.js :: presenceTerms`; MN's `menace_met` row keeping the patrol detachment as its second producer; CH §2.2's `paragonLean(…, seam)` with `patrol_rider_quality` `d` 0.10; BD §2.3/§2.5/§5.2/§7.1/§9.1/§9.3 (the hidden ways, `believedBodies`, the quarry rule, the hunt). CONFIRMED by quoting.

(f) **The concurrent round-4a lanes (read 22:0x, re-read before closing).** PS §5.5 THE BANNER (OD-PS-45, P33): the crossing's right is the HOLDER's belief of the crown's hold, a `banner` permit with no spend and ONE card defaulting `granted`; PS8's trail arm and seat arm, routed to PR. PL §2's BANNER STACK ("NO NEW READ … CUT at the first rung whose link `swornLinkSuspended` reads true") and §4.7 THE BANNER (F.2's share at the crown's own read × `hold01`; F.3's weak arm "its own riders keep to the root's land"; F.4's occasion — the summons answered with riders under the crown's `staunch`+ read — and its placement test; F.6's yearly lender's credit `riders_lent:<rootId>:<yearStartTick>`, `riders_quartered`, and `riders_lent` in peace). PL §4.1 STILL says "under `unbroken` the crown may summon every member directly". ST's and CH's round-4a files route nothing to PR. CONFIRMED by quoting; PR aligned to all of it (§2 below).

(g) **Token census** (`D-PR-r4-probe/tokens-r4.out`, `tokens-r4b.out`, by the zsh `rg` function — a plain `sh` script lost it and returned zeros, discarded): `forkSince` · `pursuedRef` · `leaderRef` · `trailWatchOf` · `predictedPlaceOf` · `bannerCoverOf` · `COLD_TRAIL_WEEKS` · `LOOK_FIND_SECRET` · `patrol_quarry_let_be` FREE (0 src · 0 tests; `leaderRef` one ledger prose hit); `quarry` LANDED (34 src files, 8 quoted literals) and `leader` (42 src) avoided; `at_strength` and `siteReadiness01` 0 src; `readiness01` 14 src (the martial homonym); `route_menaced` 1 src (HB's class). `bannerStackOf`, `bannerRightOf` and `byRight` were drafted and then WITHDRAWN to PL's stack and PS's right (no read of PR's own for either).

(h) **Table integrity.** EXECUTED `D-PR-r4-probe/tablecheck.py` → `tablecheck.out`: 21 tables, 0 rows whose unescaped-pipe count differs from the header.

## 2. The record table (the volume's §20 round-4a block carries the same rows)

**Disposed 51 of 51: cured 39 · refuted 0 · stop 0 · noted 12 — and ONE STOP raised by the A.7 cure (⛔ STOP-PR-r4-1).** Every change is bracketed `[CURED 2026-10-18 (fp-final r4) — <id>: …]` or `[REFINED 2026-10-18 (fp-final r4) — …]` where it sits.

| Id | Sev | Disposition | Where (volume) | Receipt |
|---|---|---|---|---|
| A.10 (r3 verifier FAIL, §E.1) | M | CURED (= RULINGS-ROUND4 A.4) — ST's measured readiness words; `readiness01` named a homonym | §15.2 | ST §2.3 (quoted); `tokens-r4b.out` |
| ROUTED-UNAPPLIED PL→PR (`share01 > 0`) | M | CURED — struck at PR11 · §10.3 · R21 · OD-PR-26 | as listed | PL §15.12 / PL l.121: the sub-vassal reach under the crown's own `staunch`+ read is ≥ 0.02 |
| ROUTED-UNAPPLIED CH→PR (`paragonLean` seam word) | M | CURED (= A.10) — `'patrol_rider_quality'`, `d` 0.10, `quality × mult` | §10.5 · OD-PR-30 · §15.1 CH | CH §2.2 l.207 (quoted) |
| ROUTED-UNAPPLIED FOLD→PR (readiness words) | M | CURED (= A.4) | §15.2 | — |
| ROUTED-UNAPPLIED ST→PR (readiness words) | M | CURED (= A.4) | §15.2 | — |
| PS→PR route (verifier: holds) | — | NOTED — re-read, holds | PR12 · §9.1(b) · R18 · OD-PR-19 | — |
| **PR-W1** | **M** | CURED — `forkSince` DECLARED on the placement row with its lifecycle (⭐ OD-PR-44, the owner's shape); the hold read `tick − forkSince ≥ INTERVAL_WEEKS.one_season` | §2.7 · §3.2 · §4.1 · §7.5 · §12 pin (7) · §16.1 · R37 · OD-PR-33 · OD-PR-44 | §1(a) |
| PR-W2 | m | CURED — the stamp's line counted (+2 in the opener) | PR16 · §2.7 · §6.6 · §14 PR-1 · §14.1 · §16.1 · OD-PR-5 | §1(b) |
| PR-W3 | m | CURED + REFINED — share over points actually drawn; 0/0 guard 0; stamp points capped | §2.6 · §6.6 · §12 pin (8) · R38 · OD-PR-5 · §19 (2) | §1(c) EXECUTED |
| PR-W4 | m | CURED (= A.5) — relief reads the field force | §6.6 · §20 r3 A.6 row | RULINGS-ROUND3 §E.3 |
| PR-W5 | m | CURED — `spatial/presenceComposer.js` named; PR's subtraction a row of its list | §6.1 · §14 PR-1 · §14.1 | MN §3.3 l.185 |
| PR-W6 | m | CURED — ST §7.4's current row and MN's three feeders quoted | §0.2 | ST:436, MN:185 |
| SEAMS-r3-2 | M | CURED (= A.4) | §15.2 | — |
| **SEAMS-r3-6** | **M** | CURED (= A.7) | §10.3 and its sites | RULINGS-ROUND3 §F |
| SEAMS-r3-9 | m | CURED (= A.10) | §10.5 | — |
| SEAMS-r3-10 | m | CURED (= PR-W6) | §0.2 | — |
| D-*-r3 ROUTES to PR | — | the CH, PL, ST, FOLD routes are the four RU rows; PS's holds; MN, PT, RN name none | — | — |
| BD (1) BODY row + cover term | — | CURED | PR8 · §8.1 · §8.2 | BD §19 PR row |
| BD (2) encounter body × body | — | CURED — the law's second watcher | PR8 · §8.1 · R48 · OD-PR-48 | BD §9.1 |
| BD (3) THE HUNT | — | CURED — new §5.5; `pursuedRef` (⭐ OD-PR-45) | PR9 · §2.5 · §2.6 · §4.1 · §5.5 · §11.2 · R44 · OD-PR-46 | BD §9.3 |
| BD (4) trail coverage zero unless known; watched junction | — | CURED — `trailWatchOf` (known AND watched) | §2.2 · §2.6 · §8.1 · R43 · OD-PR-47 | BD §5.2 |
| BD (5) pursue only `hunted` · `outlawed` + beasts | — | CURED — the quarry rule; `patrol_quarry_let_be` | §5.5 · §8.1 · §11.1 · R45 | BD §7.1 |
| BD (6) §5.3's slot filled | — | CURED — WC-12's road vocabulary withdrawn | §5.1 · §5.3 · §9.1(e) · §11.2 · §15.1 WC | `cure/L-BD.md` §1(a) |
| BD (7) one banner for a body | — | CURED — `believedWatch` banner-blind | §8.3 · §10.3 (f) | RULINGS-ROUND3 F.4 |
| L-BD 20 | — | CURED (= BD (3)) | §5.5 | — |
| L-BD 39 | — | CURED + REFINED — HB's one curve, `route_menaced`; the learnable clock, never rolled | §2.2 · §2.3 · §8.3 · R49 · OD-PR-49 | §1(d) |
| L-BD 40 | — | CURED — `leaderRef` (⭐ OD-PR-45); band + 1; no person moved; no named fate | §2.5 · §5.5 · §7.2 · R46 · OD-PR-46 | — |
| L-BD 41 | — | CURED — the office's ways derived; ≤ `modest` on a trail; deterrence by belief | §2.2 · §5.5 · §8.3 · §10.5 · R47 · OD-PR-47 | — |
| A.1 | — | NOTED — PS's and PL's; PR §10.4 agrees | — | — |
| A.2 | — | NOTED — not PR's | — | — |
| A.3 | — | CURED on PR's side — the body ref; `band` holder ref withdrawn | §2.1 · §5.1 · §5.3 · §11.2 · §14 PR-2 | ST §2.1 / A.3 |
| A.4 | — | CURED | §15.2 | — |
| A.5 | — | CURED (= PR-W4) | §6.6 | — |
| A.6 | — | NOTED — PR writes no fealty row | — | — |
| **A.7 THE BANNER** | — | CURED — §10.3 rewritten (F.1 → (a)(b) · F.2 → (c) · F.3 → (d) · F.4 → (f) · F.5 → (g) · F.6 → (h) · F.7 → (i)); PR11 · §10.1 · §10.2; aligned to PL §4.7 and PS §5.5; ⛔ STOP-PR-r4-1 raised | PR11 · §2.6 · §4.1 · §7.6 · §10.1–10.3 · §12 · §13 · §14 PR-4 · §15.1 · §18 · R21 · R39–R42 · OD-PR-24/26 | RULINGS-ROUND3 §F; PL §4.7; PS §5.5 |
| A.8 · A.9 · A.14 · A.15 · A.19 · A.20 | — | NOTED — not PR's (0 hits / other owners) | — | — |
| A.10 | — | CURED | §10.5 · OD-PR-30 | — |
| A.11 | — | NOTED — PR carries no "as it holds at a refused border" | — | grep 0 |
| A.12 | — | CURED — six kinds; `{ kind: 'body', id }` | §2.5 · §11.1 · §11.2 | — |
| A.13 | — | NOTED — PR's detachment stays MN's second producer | §5.3 | MN l.394 |
| A.16 | — | CURED on PR's side — `keptSecret`; `LOOK_FIND_SECRET` | §5.1 · §9.2 (b) · §15.2 | ST §2.4 |
| A.17 | — | CURED on PR's side — a look's finding written once into the one belief | §9.2 (b) | ST's D-ST-r4 m10 confirms agreement |
| A.18 | — | CURED — one contest, the anchor first | §10.1 (f) | — |
| D-PS-r4 → PR (1) jurisdiction | — | CURED — PR reads PS's `passageStandingOf(…).banner`; no right of its own | PR11 · §2.6 · §10.1 (c) · §10.3 (d) · R39 · OD-PR-26 | PS §5.5 / OD-PS-45 |
| D-PS-r4 → PR (2) trail arm + seat arm | — | CURED | PR10 · §6.5 · §2.6 · §8.1 · R43 | PS8's round-4 bracket |
| D-PS-r4 → PR (3) planner consumer | — | CURED | §8.3 | — |
| D-PL-r4 → PR — the banner per PL §4.7 | — | CURED — aligned; no stack read of PR's; the composition in PL §5.3's GUARDED set | §2.6 · §10.3 · §14 PR-4 · R39–R41 · OD-PR-26 | PL §2, §4.7 |

(The table above lists A.8 · A.9 · A.14 · A.15 · A.19 · A.20 on one row for brevity; the volume's §20 lists them singly. 51 = 16 verifier/seams ids + 7 BD routes + 4 L-BD items + 20 A-rows + 4 concurrent-lane routes; the D-*-r3 summary row and the PS-holds row are bookkeeping inside those.)

## 3. STOPs
⛔ **STOP-PR-r4-1** — the ruling RULINGS-ROUND3 F.1 ("the OVERLORD's call reaches a patrol the same way, rung by rung, never skipping a lord"; PL §4.7 F.1 says the same) is contradicted by PL §4.1, still: "under `unbroken` the crown may summon every member directly". The riders are an input line INSIDE the summons (OD-PL-50, one fact one hearing), so a direct summons to a sub-vassal skips its lord for the riders. PR §10.3 (b) is written to F.1 and marked `[⛔ STOP-PR-r4-1]`; PR §17 carries the row. PROPOSED RE-RULING (one line): under `unbroken` the crown's direct summons travels THROUGH each mid-lord's banner — the mid-lord's own `call_in_answer` minted first and the sub-vassal's after it in the same week — so no lord is skipped and the `unbroken` arm still reaches every member in one call; the alternative gives F.1 an `unbroken` exception. Owner: PL (§4.1) with PR citing.

## 4. REFINED (each marked in the volume; vetoable)
1. `drawShare01` over the points ACTUALLY drawn (1 where nothing is drawn; the chair's 0/0 guard 0 kept; the stamp's `points` capped) — §6.6; receipt §1(c).
2. A net rider witnesses for the member whose half it stands on; the GATE's catch stays the holder's (J385) — PR10, §10.3 (d).
3. The net lends only on a NEED and only where the holder answers `right` (a lent rider never spends an ally's width) — §10.3 (d).
4. F.7's "the crown's wardens" kept as "the crown's riders" (`warden` is CH's archetype and the public-security office of L-BD 41; R-8) — §10.3 (i).
5. The round's habit on HB's ONE curve under the landed class `route_menaced`; the clock learnable by design and never rolled (PR4) — §2.2, §2.3.
6. `LOOK_FIND_SECRET` for ST's withdrawn `hidden` (also THE BODIES' `hiddenWays` homonym) — §9.2 (b).
7. A non-paragon hunt leader is a REFERENCE on the row, never moved; a paragon leader moves by its own mover on PR's one prediction — §5.5.
8. A lent rider keeps `command: 'own'` (no third command word) — §2.1.

## 5. ROUTED — the other volumes' halves (none edited by this lane; the volume's §19 carries the same lines)
- **PL** — §15.12's "A member's patrol on another member's road crosses on THE PASSAGE's ladder, where members stand as ALLIES" → §4.7 F.3's two arms; §4.7 F.4 may cite PR's `bannerCoverOf` as the placement test's read ("any rider not the member's own … PLACED" over PR's `lived` rows); ⛔ STOP-PR-r4-1 (§4.1's `unbroken` direct summons vs §4.7 F.1) — the chair's.
- **PS** — none owed: PS §5.5 / OD-PS-45 / P33 and PS8's trail and seat arms are what PR now cites (aligned).
- **CH** — the predicate "the town's public-security office is held by the warden archetype" (L-BD 41; PR §5.5 reads it); the aim `hunt` reads PR's `predictedPlaceOf` (one prediction, two movers) and its lean applies only in weeks the paragon stands with the riders; §4.4's "ride with the watch" row (owed since round 3).
- **BD** — ONE read of a town's KNOWN trails (the learned set with its `watched` mark ∪ the warden office's ways, the latter known AND watched) for PR's `trailWatchOf` and §2.2; WHO sets `watched` on `hiddenWays.known` (PR's round reads it as a first-priority term), and that the knowledge's ageing reads PR's placement `lived` rows (R30); the road-visibility cover values by might band; the owner of L-BD 40's `hunt_taken` card, and L-BD 40's "`suppressed`/`outlawed`" (read under §G.5 as `curbed`/`outlawed`) against BD §7.1's "`curbed` is watched, not hunted" — PR follows BD §7.1; BD's cites "PR §5.3 … a brigand body (WC-12, slot)" (BD §0.2 l.66, §9.3 l.432) now read PR §5.3's body row and §5.5.
- **HB** — the round's habit term: a stretch-keyed action token under the landed `route_menaced` class on the settlement actor (HB-0 admits it or the term stays dark; no thirteenth class).
- **ST** — A.17: list a patrol's look among `seenBy`'s sighting producers (ST's own m10 already reads PR §9.2 (b) as agreeing); §7.4's PR row may add that the net's riders change no keep row.
- **RN** — `patrol_clash`'s body side keyed `g:<bodyId>` (BD's route to RN).
- **The fold (P4)** — §3.3 a THE BANNER ruling row (one home with first call; PL's derived stack; PL's one share law × `hold01`; the net called on the crown's own read; each crossing's right the holder's own belief, PS's read; strong · weak · broken; no new registry kind); §3.4 `patrol_engages` ↳ (a body foe; WHERE `country (a)` for a hunt's catch; six actor kinds); §5 PR's round-4 tokens (PR §15.2's new row; `LOOK_FIND_SECRET` replaces `LOOK_FIND_HIDDEN`; ST's readiness words on PR's band row); §7 visible rows ⭐ OD-PR-44 · ⭐ OD-PR-45 (the owner's shapes) and STOP-PR-r4-1.
- MN, PT, WC — nothing new from PR.

## 6. OPEN QUESTIONS FOR THE CHAIR (also the volume's §19, round 4a; none blocking)
1. STOP-PR-r4-1 (above).
2. The drawn share's construction vs the literal "0/0 as 0" (REFINED 1): the literal form skips collapse targets the dark arm keeps for a court with no offensive to draw from.
3. (Withdrawn — the crown's own net share aligned to PL §4.7 F.2.)
4. The net lends only on a need (REFINED 3); the alternative composes every member's lent share over every unwatched shared half every week.
5. A net rider witnesses for the member (REFINED 2); the alternative keeps the witness the holder's own riders' only.
6. A non-paragon leader is a reference, never moved (REFINED 7).
7. L-BD 40's conclave quarry wording vs BD §7.1 (routed to BD).

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by reading master `81f1cd963`: `commonsGrievance01` (memoryless), `courtRiskAppetiteOf` (no since-tick), `INTERVAL_WEEKS.one_season`, the opener's seed and its one-line stamp idiom, `classifyFeasibility`'s override order, HB's `CIRCUMSTANCE_CLASSES` / `HABIT_CLASS_CEILING` / `applyCredit` / `habitFactor` / `HABIT_ROWS_PER_ACTOR_CAP`. CONFIRMED by execution: `drawshare.out` (the hard gate at zero offensive; the three guards; the points-drawn construction), `tablecheck.out` (0 bad rows), the token census. CONFIRMED by quoting: every sibling row cited (ST, MN, CH, BD, PL §2/§4.1/§4.7, PS §5.5/PS8). PLAUSIBLE, never upgraded: that HB-0 admits a stretch-keyed token; every round-4 DRAFT constant (`COLD_TRAIL_WEEKS` 3, the led hunt's band + 1, the leader's ±1 shifts, the floor rounding of the net, the body stance factors, the two-sighting phase rule); that PL's and PS's round-4 texts stay as read at 22:0x (their lanes may still be writing — the round-4b verifier re-reads); the hunt's prediction quality (unbuilt; PR-5 and BD-5 measure).

## 8. CLOSE
Volume at close: 1012 lines, sha256 `97162fe507b5…` (pre-r4 `cad939f8…`, 860 lines); `D-PR-r4-probe/tablecheck.out` 21 tables · 0 bad rows. Closed 22:12 EDT by `date`.
