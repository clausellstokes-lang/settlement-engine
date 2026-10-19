# D-PS-r5 — THE PASSAGE, P3 round 5a disposition (lane D-PS-r5, Opus 5.5; chair 0a2e8bd9, Fable 5.1, the program of chair a73343ed), 2026-10-19 03:3x–04:0x EDT

**OUTCOME: 31 of 31 input ids disposed — CURED 27 · NOTED 4 · REFUTED 0 · STOP 0.** Every fail of `skeptic/PS-r4-verify.md` (P7 · the L-BD route (2) · RU-PL-1 · RU-PL-2), both new MAJORs (PS-X1 · PS-X2), all nine minor notes, the PS routes of SEAMS-r4 / BD-r4 / the ten `cure/D-*-r4.md`, and RULINGS-ROUND5 A.3 · A.6 · B.4 · B.13 · B.14 · B.22 are in the volume with `[CURED 2026-10-19 (fp-final r5) — …]` brackets; §18 carries the round-5 block. The volume: 862 → 909 lines, 302,583 → ~343 KB, 76 `fp-final r5` brackets (two late fixes: §11 PS-1's and OD-PS-46's "in season" minimality words); tables 0 mismatches (`tablecheck.py`). Never git; never the suite; master `81f1cd963` read-only.

## Inputs read whole
README (RESUME BLOCK 2) · COMPILE-COMMON · DISPOSE · RESEARCH-COMMON · RULINGS-PL-MN · -AFTER-RESEARCH · -AFTER-COMPILE · CHAIR-NOTES (1–18) · ROUND1 (+addendum) · ROUND2 · ROUND2b (+addendum) · ROUND3 (§A–§G) · ROUND4 (§A–§E) · ROUND5 (§A–§C) · the BOARD's owner lines (hidden ways, warden, 22:51) · `skeptic/PS-r4-verify.md` + its probe · `skeptic/SEAMS-r4.md` · `skeptic/BD-r4.md` (ROUTES) · the ROUTES of all ten `cure/D-*-r4.md` · `refs/MAP-REPLY-HIDDEN-WAYS-2026-10-18.md` · `briefs/L-BD.md` items 11, 11b–11i, 15b, 41 · the volume WHOLE (snapshot `D-PS-r5-probe/PS.pre-r5.md`, sha256 `a0fc61af…`). Sibling text read where a cure depends on it: PL §2 (`swornLinkSuspended`), §3.1 (f), §4.3 (2)/(3), §4.5, §4.7 F.3/F.5, §5.3 GUARDED (PL mid-lane at 03:52, its r5 RE-RULED brackets present); BD §2.3, §5.2–§5.3 (BD mid-lane at 03:52, re-pointing to master's ladder); PR §2.6, §10.1, §10.3 (g).

## §1 Measured first (CONFIRMED unless marked)
- **m1 P7 (the verifier's EXECUTED fail), re-run and cured by execution.** `p7-effective.mjs` → `p7-effective.out`: Part A replays the verifier's fixture verbatim — under embattlement 0.6 on C and B (summer) the pick is O>E>D (effective 130 vs 155); the struck seasonal clause is VIOLATED, the cured EFFECTIVE clause holds; the planner clause likewise. Part B: 20,000 seeded worlds (random terrain, season, embattlement, tolls, risk tolerance, believed passage cost): the effective clauses fail in **0**; the struck seasonal clauses fail in **2,627** (reroute) and **573** (planner) — the negative control. Master: `embattlement.js :: chooseRoute` minimizes `scoreRoute(...).effectiveCost` (`round4(base + dangerCost + tollCost)`), codepoint tie on `path.join('>')`.
- **m2 The one route ladder** (`master-reads.out`): `ROUTE_GRADES = ['highway','road','track','hidden']`; `HIDDEN_PATH_KINDS = ['covert_envoy','smuggler','wanderer']` (fail-closed `mayUseHiddenPaths`; `TRAVELLER_KINDS` includes `army`); `hiddenHopsFor` "Returning NULL for an army"; `GRADE_LEG_MULTIPLIER.hidden: 2` pinned equal to `HIDDEN_PATH_SLOWDOWN: 2` (`tests/domain/routeNetworkConsumers.test.js:474`); `routeLifecycleEnabled` virtual; **`routeEdgeId(a, b, mode)` = `route.<a>.<b>.<mode>` — ONE edge per pair per mode** (the hazard below).
- **m3 Belief law:** `beliefMap.js`: "marker absent OR omniscient OR a SELF-read ⇒ { source: 'truth' }" (minor (i)'s read class).
- **m4 Tokens** (`tokens-r5.out`): `legMult`, `knownTrailsOf` 0 src · 0 tests; `'trail'`, `'way'` 0 quoted src; `'wild'` quoted on three other surfaces (registered); `junction:` hits are "conjunction"/"disjunction" prose only.
- **m5 BD r5 (mid-lane, PLAUSIBLE that it lands as read):** `knownTrailsOf(worldState, snapshot, settlementId, tick)` names PS's `hiddenWayFor` among its readers; §5.2 now puts the ways on master's ladder, price `gradeLegMultiplier('hidden')`, access token `body`, and "With `routeLifecycleEnabled` dark the ways are the CANDIDATES alone at the hidden price" — PS aligned to that (the lifecycle flag gates nothing of PS's).

## §2 The record table
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| minor 1 (P7) | m FAIL (EXECUTED) | CURED — minimality by the landed EFFECTIVE cost, reroute and planner | §4.1 s6 · §5.1–§5.3 · P7 · OD-PS-46 · pin 19 | m1 |
| L-BD route (2) | M FAIL | CURED = PS-X1 | — | — |
| RU-PL-1 (= SEAMS-r4-2, D-PL-r4 r1) | M FAIL routed-unapplied | CURED — PS14 (3) and §7.5 cite PL §4.3 (3)/OD-PL-54 as RE-RULED (§E) and R5 A.6; the withdrawn `kept` arm struck; the own-walls clause added; P14, §14, OD-PS-42 | PS14 · §7.5 · §14 · P14 · OD-PS-42 | RULINGS-ROUND4 §E; PL §4.3 (3) (c) |
| RU-PL-2 (D-PL-r4 r2) | M FAIL routed-unapplied | CURED — ONE line per liege per unit: minted → standing → ONE default after the sweep for the first crossed member by PL's order, written to all | PS14 · §4.1 s2 · §7.5 · §9 · L2 · P37 · OD-PS-43 · pin 25 | PL §4.3 (2): "PS mirrors the value onto each crossing row" |
| PS-X1 (= B.13) | M new | CURED — `hiddenWayFor` and the witness call BD's union `knownTrailsOf`; P32's premise restated on the office arm | PS8 · §2.7 · §5.6 · P32 · OD-PS-44 · pin 26 | BD §2.3; PR §2.6 |
| PS-X2 (= B.14) | M new | CURED — ally rung reads sworn edge + walk THROUGH `swornLinkSuspended`, every mover; "armies untouched" struck; REFINED R1 | PS4 · §2.2 (+row) · §2.7 · §3 · §5.5 · §14 · P33 · P36 · OD-PS-5/45/48 · pin 24 | PL §2, §5.3, F.5 |
| minor (a) (= D-PL-r4 r3) | m | CURED — PL §3.1 (f) and the GUARDED set cited | §2.7 · §3 · §5.5 · OD-PS-45 | PL §3.1 (f) |
| minor (b) (= SEAMS-r4-15) | m | CURED — `gradeLegMultiplier('hidden')` 2 everywhere | PS8 · §2.7 · §5.6 · P32 · OD-PS-44 | m2 |
| minor (c) (= SEAMS-r4-16 PS half) | m | CURED — rung words registered, no PS rung list (BD's ways), WHERE `road (a, b)` keyed `junction:<id>` | PS8 · §5.6 · §9 · §15 · OD-PS-51 | the map contract |
| minor (d) | m | CURED — the line FROZEN after PL's mint (the given answer); correction = undo | §9 · L2 · P37 · OD-PS-43 | PL §4.3 (2): "sees it on its card as given" |
| minor (e) | m | CURED — exited `in_hearing` kept to the seal: `kept`/`refused`, no casus, no mover line, no `barred` | §4.1 s5 · §2.8 · L2 · P34 · OD-PS-49 · pin 27 | — |
| minor (f) | m | CURED — `leaveBy?` | §2.8 · L1 | — |
| minor (g) | m | CURED — enemy patrol never `refused`; no PS battle for a patrol; riders vs riders is PR's `patrol_engages` | §5.5 · §14 PR · P33 | PR §10.1 (a)/(f) |
| minor (h) | m | CURED — #14 reads the defence; #20 no longer blames the hold for a feud | §17 | PL F.5 |
| minor (i) | m | CURED — `passageDefenceOf` named TRUTH (self-read + men sent) | §2.7 · OD-PS-50 | m3 |
| SEAMS-r4-2 · SEAMS-r4-15 · SEAMS-r4-16 | routes | CURED = RU-PL-1 · minor (b) · minor (c) | — | — |
| BD-r4-3 (PS half) (= B.4) | B route | CURED — one network, one price, one access law with PS's ONE OWNED declared widening (`travellerMayWalk(kind, hop, { might })`, fail-closed callers byte-identical — PLAUSIBLE until PS-4's car-0 census), one known set; the edge-identity hazard routed | §0.1 (+row) · §0.2 · PS8 · §2.7 · §5.1 · §5.6 · §10 · §11 · §14 BD/WC · §15 · OD-PS-44 | m2 |
| D-PL-r4 routes 1 · 2 · 3 | routes | CURED = RU-PL-1 · RU-PL-2 · minor (a) | — | — |
| D-PR-r4 · D-ST-r4 · the other six | routes | NOTED — none owed | — | their ROUTES |
| R5 A.3 | ruling | CURED (cite) — the helper holds a transit record only (an army via ST's fort registrant, FREEZE); a body/menace by its own mover | §14 ST | PS9 |
| R5 A.6 · B.4 · B.13 · B.14 | rulings | CURED = RU-PL-1 · BD-r4-3 · PS-X1 · PS-X2 | — | — |
| R5 B.22 | ruling | NOTED — PS's two routed halves are RU-PL-1/-2 | — | — |

(The full 31-row table is the volume's §18 round-5 block.)

## §3 STOPs
None.

## §4 REFINED and judgment calls (each bracketed in the volume, vetoable)
- **R1 (PS4, OD-PS-48)** — on a SUSPENDED link with a live war front between the two, the rung is `enemy` (the incursion), else `rival` → `stranger` as B.14 rules. Without it a civil war's march through the other side's land is asked, refused (arms stance `closed`) and priced as `defiance`, never the war's incursion.
- **R2 (§5.6 WHEN)** — a UNIT's way is chosen by the planner's deterministic re-score, not by a body's seeded per-move roll (L-BD 15b's route "the same roll"); same weights.
- **R3 (§5.6)** — PS OWNS the access-law widening (CHAIR-NOTES 18 (d)); it serves the peacetime quiet crossing (L-BD 11 (i)) and the wartime risk read (11i, WC's chooser reads it).
- **J1 (minor (d))** — FREEZE the line after the mint (alternative: a correction that re-mints; rejected — PL's record is append-only and PL already says "as given").
- **J2 (minor (e))** — the exited in-hearing seal writes `refused` without a casus (alternative: price a `trespassed` — rejected: the bound, not A's will, carried the unit through).

## §5 ROUTED (other volumes' halves; one line each — volume · exact edit)
- **PL** §5.3 GUARDED row: "THE PASSAGE's jurisdiction read for same-kingdom riders" → "THE PASSAGE's ladder — `passageStandingOf`'s ally rung for every mover (army · column · patrol · corps), PS4"; §4.5's REFINED bracket: add "while no suspended link lies between them (PS4; RULINGS-ROUND5 B.14)".
- **BD** §5.2 (a): drop "in wartime" from "widened ONLY for a unit within the capacity band in wartime" (B.4 has no wartime clause; the peacetime quiet crossing is L-BD 11 (i)); name PS as the widening's ONE owner (PS-4), WC's chooser its reader.
- **BD** §5.2: master's `routeEdgeId(a, b, mode)` holds ONE land edge per pair — "a lit way is the route ledger's own edge" cannot hold a corridor `trail:<a|b>` beside a live road without a declared identity change at BD-5's car (or junction-keyed ways); name it.
- **BD** §5.2 (ii): say how a BYPASS `trail:<a|c>` maps onto a unit's hops (which territory's crossing, which junction) for PS's `hiddenWayFor`; until then PS takes no bypass.
- **BD** §5.2: say whether a way worn to the map's `trail` rung keeps the hidden price and access law (the chair's reconciliation keeps `hidden` = {wild, way}); PS follows BD.
- **PR** §10.1 (c): an ENEMY patrol beyond its land opens PS's `armed_incursion`; `barred` = the placement refused with no PS battle; a meeting with the holder's riders is PR's `patrol_engages` (PS §5.5).
- **ST** (A.3's text): "PS's hold helper, freeze mode" holds an ARMY challenger through ST's approach-fort registrant only; a body or menace challenger holds by its own mover.
- **WC** inbox: the hidden-way access widening is PS's (PS-4); WC's chooser reads it in wartime (L-BD 11i); the surprise lean rides WC's battle inputs (PS-V2's car).
- **FOLD (P4)** §5: `legMult` (PS), `knownTrailsOf` (BD, cited), OD-PS-48..51; §3.4: the `armed_incursion` liege line "mirrored before the mint, frozen after"; the hidden-way catch WHERE `road (a, b)` keyed `junction:<id>`.
- **THE CHAIR** RULINGS-ROUND4 B's PS row: "the cheapest SEASONAL path …" → "the cheapest by the landed effective cost (seasonal + danger + toll)" (the source of the P7 fail).

## §6 Open for the chair
1. **B.4's buildability on master** (m2): one land edge per pair per mode — a lit way beside a live road needs a declared ladder-identity change (a persisted-shape change; likely the owner's class). PS defers to BD's read and is not blocked.
2. **R1** (live front → `enemy`) vs B.14's letter.
3. **B.11's analogy to the incursion:** `reliefAnswerOf` reads the liege's BELIEF; E.2 calls it at FIRST SIGHT, before the liege may have heard. With minor (d)'s freeze, a liege that had not heard keeps a `kept` line (and its resentment) for good. B.11 rules "the first week that candidate believes" for sieges; whether the incursion line waits for the liege's belief re-rules E.2 — the chair's.

## §7 CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the P7 cure and its negative control (`p7-effective.out`), the table integrity (`tablecheck.py`: 0), the token census. CONFIRMED by reading at `81f1cd963`: m2, m3, `chooseRoute`'s minimand. CONFIRMED from the siblings' current text: BD §2.3/§5.2, PL §2/§3.1 (f)/§4.3/§5.3/F.5, PR §2.6/§10.1. PLAUSIBLE, not upgraded: the access-law widening's caller census (PS-4's car-0); that BD's and PL's mid-lane round-5 text lands as read; every DRAFT constant (none added).
