# D-PR-r5 — the round-5a disposition of THE PATROLS (`docs/DESIGN_FP_ARCH_PR.md`)

Lane D-PR-r5 (Opus 5.5), chair 0a2e8bd9 (Fable 5.1) continuing a73343ed, 2026-10-19 from 03:59 EDT (by `date`). Read WHOLE: the kit README (RESUME BLOCK 2), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES (1–18, incl. 17), ROUND1 (+addendum), ROUND2, ROUND2b (+addendum), ROUND3 (§A–§G), ROUND4 (§A–§E), ROUND5 (§A–§C), the BOARD (105 lines, every owner word), `skeptic/PR-r4-verify.md`, `skeptic/SEAMS-r4.md`, `skeptic/BD-r4.md`, the ROUTES of all ten `cure/D-*-r4.md`, and the volume (1012 lines, sha256 `97162fe5…`, kept byte-for-byte at `D-PR-r5-probe/PR.pre-r5.md`). Siblings read at the cited rows as they stand at 04:0x (PL, PS, ST and BD had closed or were closing their round-5a lanes; CH, RN, MN, PT, FOLD still at their round-4a text): PL §4.1 · §4.7 F.1–F.7 · §4.9 (4) · `cure/D-PL-r5.md`; BD §2.3 · §2.4 · §2.5 · §5.2–§5.5 · §7.1 · §7.6 · §9.1 · §9.3 · §9.11 · §19.0's PR rows · `cure/D-BD-r5.md`; PS §5.5 · `cure/D-PS-r5.md`; ST §2.1 · §2.4 · §6.1 (A.5); MN §3.3 · OD-MN-40; CH §2.2 · §2.2b · §5 trail arm · OD-CH-42; RN §2.1 · §3.1. Code of record: master `81f1cd963` (HEAD `81f1cd963553f226b222714914ff34584e9911b8`, verified), read-only. Never git; never the suite.

**RESUMED SEAT (07:31–07:4x EDT).** The first seat died on the 5h limit at 04:38 with every volume edit applied (scripts `D-PR-r5-probe/work/r5_b.py` … `r5_x.py`; the volume 1099 lines, its §20 round-5a block written) and this file a header. The resumed seat (same lane, fresh context, the owner's "please continue" via the chair) re-read the inputs whole (`PR-r4-verify`, `SEAMS-r4`, `BD-r4`, every ROUTES section of the ten r4 lanes, RULINGS-ROUND5 §A–§C, the README, COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, the BOARD's tail), the round-5 siblings' PR routes (`D-BD-r5` · `D-PS-r5` · `D-PL-r5` · `D-CH-r5` · `D-RN-r5` · `D-ST-r5` · `D-PT-r5`), and EVERY volume line carrying a round-5 bracket (95 lines, 162 KB) against its receipt and its sibling; it did NOT re-read the earlier rulings files whole (the first seat had; nothing below rests on them beyond what RULINGS-ROUND5 and the r4 inputs quote). Snapshot before its edits: `D-PR-r5-probe/PR.pre-resume.md` (sha256 `59d124ef…`); after: 1102 lines, sha256 `a25ec224…`.

## §1 What was measured first (the measurements that could refute the brief)
- **PR-X1 / B.8 the lend** — EXECUTED `D-PR-r5-probe/net-r5.mjs` → `net-r5.out` (every tier × band at the hold's four ends, at the peace count and at `max`): "members with n ≥ 2 lending 0 = 0", "rows where the lender keeps fewer than NET_HOME_MIN = 0", R39's Ashford 1 at any band (r4: 0), ten town vassals 10 (r4: 0; PL's r4 Σ-then-floor 9). Re-run by the resumed seat: byte-identical.
- **PR-X2 / B.9 the season ledger** — EXECUTED `season-r5.mjs` → `season-r5.out`: the verifier's case (net rides weeks 1–10 then slips) r4 `protection_failed` → r5 10 weeks `protection_kept`; a stale pair of another season reads 0. Re-run: byte-identical. The read order CONFIRMED at master: `pulseKernel.js` l.2527 "`const calamity = advanceCalamity({`" precedes l.2752 "`const treatyAdvance = advanceTreatiesWithDisposition({`", so PL's row at a season's last tick sees the tally PR's stage counted that tick; `intervalWeeks.js :: INTERVAL_WEEKS` "`one_season: 13,`".
- **PR-X5 the stamp** — EXECUTED `drawshare-r5.mjs` → `drawshare-r5.out`: "offensive 0 · draw 6 · kept 3 → … stamp r4 absent · stamp r5 {riders: 3, points: 0} · the kept bound has a carrier: true". Re-run: byte-identical.
- **B.4 the one rung** — CONFIRMED at master: `routeNetworkLedger.js :: ROUTE_GRADES` "`Object.freeze(['highway', 'road', 'track', 'hidden'])`"; `routeNetworkConsumers.js :: HIDDEN_PATH_KINDS` (l.97) "`Object.freeze(['covert_envoy', 'smuggler', 'wanderer'])`" behind `mayUseHiddenPaths` (fails closed); `routeNetworkConsumersTransit.js` "`hidden: 2,`"; `npcConsequencesTuning.js` "`HIDDEN_PATH_SLOWDOWN: 2,`". ⭐ The resumed seat measured what the first did not: the franchise rests on TWO pinned arrays — `routeNetworkConsumers.js :: TRAVELLER_KINDS` (l.76) "`Object.freeze(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer'])`" and `tests/domain/routeNetworkConsumers.test.js` pins "`for (const kind of HIDDEN_PATH_KINDS) expect(TRAVELLER_KINDS).toContain(kind);`", "`expect([...HIDDEN_PATH_KINDS].sort()).toEqual([...HIDDEN_PATH_KINDS]);`" and the exact vocabulary "`expect([...TRAVELLER_KINDS]).toEqual(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer']);`"; no src module but the declaration names `TRAVELLER_KINDS` (grep). So a declared `patrol` (and BD's `body`) must enter both arrays codepoint-sorted and the exact pin is re-recorded at the unit — REFINED at OD-PR-51, routed to BD.
- **The hunt's coin** — CONFIRMED: `treasury.js :: UPKEEP_LEDGERS` (l.498) "`Object.freeze(['deployments'])`"; l.1034 "today the writer passes exactly one, the" `deployments` ledger — a detachment is no deployment record.
- **Tokens** — `tokens-r5.out`: `weeksCovered` · `holderEyesOf` · `NET_HOME_MIN` · `seasonStartTick` · `GLEAN_BASE` · `GLEAN_CAP` 0 src · 0 tests; `'patrol'` two quoted src literals on other surfaces (`serviceAvailability.js`, `wiringCensus.js`), the minted PR token a registered homonym (§15.2).
- **Tables** — `tablecheck.py` over the volume after the resumed edits: "tables 23; bad rows 0".

## §2 THE RECORD (every input id; the volume's §20 round-5a block carries the same)
| id | sev | disposition | where | receipt |
|---|---|---|---|---|
| STOP-PR-r4-1 (RE-RULED, ROUND4 §E; the verifier's six sites + A.8's three) | M | CURED — rung by rung below `unbroken`, DIRECT under it, never skipping a lord's ROW (credit or precedence friction); the friction is PL's `riders_quartered` ROW with one patch | status · §10.3 (b)(h) · §7.6 · §15.1 PL · OD-PR-26 · STOP row · §18 (21) · §19 · R21 · R42 | PL §4.1 (i)–(ii), F.1, F.6 (b) as cured 04:00 (read) |
| CH→PR 1 (`hunt` → `hunt_body`) | m (RU) | CURED | §5.5 · §15.1 CH · R46 | CH §4.2 "`hunt_body` (not `hunt` …)" |
| CH→PR 2 (a RETAINED warden counts) | m (RU) | REFUTED — B.13: "never to any retained warden (CH's widening struck)" | §5.5 · §10.5 · §15.1 CH · R47 (third run) | RULINGS-ROUND5 B.13 |
| CH→PR 3 (a paragon on a way met by `trailWatchOf`) | m (RU) | CURED — any traveller on a way met only by the trail arm | PR8 · §8.1 · §8.2 · R54 · OD-PR-48 | CH OD-CH-42 (quoted) |
| RN→PR (one doer; never also a `body_act`) | m (RU) | CURED | §7.2 · §9.3 · §15.1 RN · R53 | `D-RN-r4` §5 (quoted) |
| BD→PR (8) commons +0.2 cover | m (RU) | CURED | §8.1 · OD-PR-48 | BD §7.6 (quoted) |
| BD→PR (9) informer sightings via `believedBodyOf` | m (RU) | CURED (+ the resumed seat's §15.1 BD residue) | §2.6 · §5.1 · §5.5 · §15.1 BD · OD-PR-46 | BD §2.4 signature (read 07:3x) |
| BD→PR (11) the gang's `bribe` on the unpaid-wages slot | m (RU) | CURED — BD's effect; never a second notice cut | §6.4 | BD §4.2 (quoted) |
| PR-X1 the net lends zero at a strong hold | M | CURED (B.8) — `max(1, ⌊n × s × hold01⌋)` above `NET_HOME_MIN`; a sub-vassal through its liege's line (+ the resumed seat's §15.1 PL residue) | PR11 · §4.1 · §10.3 (c)(d) · §12 (16) · §15.1 PL · R39 · R51 · OD-PR-26 · OD-PR-40 | EXECUTED `net-r5.out` |
| PR-X2 cover read on one-week `lived` | M | CURED (B.9) — `weeksCovered` `{ seasonStartTick, weeks }`, ⭐ OD-PR-50 the owner's shape | §2.6 · §2.7 · §4.1 · §10.3 (f)(h) · §16.1 · §12 (17) · R50 · OD-PR-50 | EXECUTED `season-r5.out`; kernel order l.2527 < l.2752 |
| PR-X3 net rider's witness had no formula | m | CURED — `holderEyesOf` | PR10 · §2.6 · §6.5 · OD-PR-13 | PR10's law (volume) |
| PR-X4 three feeders · first-to-land · C16's place | m | CURED — four feeders; MN's owned unit; C16 behind M-W2 (18 (c), P4's) | §0.2 · §6.1 · §14 · §15.1 MN · OD-PR-43 | MN §3.3 / OD-MN-40; CHAIR-NOTES 18 (c)(d) |
| PR-X5 no stamp at zero offensive | m | CURED | §2.7 · §6.6 · §12 (9) · §16.1 · R38 (a) | EXECUTED `drawshare-r5.out` |
| SEAMS-r4-3 | M | CURED (= STOP-PR-r4-1) | as above | — |
| SEAMS-r4-10 | m | CURED (= CH→PR 1) | as above | — |
| SEAMS-r4-16 (rung words; PR §2.2 named) | m | CURED — the way's words; `junction:<id>` a key under `road (a, b)` | §2.2 · §11.2 · §15.2 · §18 (16) | map contract (RULINGS-ROUND4 §E) |
| BD-r4 ROUTES → PR: `cover01` re-points (BD-r4-3) | M | CURED (= B.4) | §8.1 | BD §2.5 `hiddenWayEdges` (r5, read) |
| BD-r4 ROUTES → PR: `tolerated` gangs unpursued (BD-r4-5) | M | CURED — PR's quarry rule reads BD §7.1's cured default | §5.5 | BD §7.1 (quoted) |
| BD-r4-23 (`knownTrailsOf` unnamed) | m | CURED (= B.13) | §2.2 · §2.6 | BD §2.3 signature |
| BD-r4-24 (rung words) | m | CURED (= SEAMS-r4-16) | §2.2 | — |
| D-BD-r4 §5 → PR (four halves) | — | CURED (8)(9)(11); the cadence half NOTED — held (verifier) | — | PR-r4-verify |
| D-CH-r4 §6 → PR (three halves) | — | = CH→PR 1 CURED · 2 REFUTED · 3 CURED | — | — |
| D-PL-r4 §5 → PR (THE BANNER per PL §4.7) | — | NOTED — held in r4; re-aligned to PL r5 (B.8 · B.9 · A.8) | §10.3 | PR-r4-verify |
| D-PS-r4 §5 → PR (three halves) | — | NOTED ×3 — held; the trail arm re-cut under B.13 / PR-X3 | PR10 · §6.5 · §8.3 | PR-r4-verify |
| D-RN-r4 §5 → PR | — | CURED (= RN→PR) | — | — |
| RULINGS-ROUND5 A.8 | — | CURED | §7.6 · §10.3 (h) · R21 | PL F.6 (b) r5 |
| RULINGS-ROUND5 B.4 | — | CURED — master's rung through `hiddenWayEdges`; the declared `patrol` token (now in BOTH pinned arrays, ⭐ visible) at the landed ×2; no border crossed by a way | §0.1 · §0.2 · §2.2 · §2.6 · §5.5 · §8.1 · §8.3 · §14 PR-2 · PR16 · R52 · OD-PR-47 · OD-PR-51 | master (read, §1) |
| RULINGS-ROUND5 B.5 | — | CURED — ONE HUNT, ONE DEED on PR's side | §5.5 · §7.2 · §9.3 · R46 · R53 · OD-PR-46 · pin (19) | — |
| RULINGS-ROUND5 B.8 · B.9 | — | CURED (= PR-X1 · PR-X2) | as above | — |
| RULINGS-ROUND5 B.13 | — | CURED — `knownTrailsOf` by name; the office-holder's ways only | §2.2 · §2.6 · §5.5 · §10.5 · R47 · OD-PR-47 | — |
| RULINGS-ROUND5 B.22 (PR 7) | — | CURED (= the seven RU rows) | — | — |

**Counts: disposed 39 of 39 — cured 32 · refuted 2 · stop 0 · noted 5** (13 verifier rows · 3 SEAMS-r4 ids · 4 BD-r4 route items · 12 halves of the ten r4 lanes' ROUTES · 7 RULINGS-ROUND5 rows; duplicates across sources are counted in each, so the two refutations are the one CH→PR 2 claim seen from the verifier and from `D-CH-r4`). Beyond the 39, applied so none is left unapplied at round 5b: D-BD-r5's PR routes (a)–(g) (gleaning, the `watched` mark written never read, `ROAD_COVER_BY_MIGHT`); D-PS-r5's (the enemy patrol → `armed_incursion`); D-PL-r5's (every site it named); D-ST-r5's two (R11's holder after `cleared` — Kell's garrison, no reclaim; a look at an id-less authored gang writes nothing — the resumed seat); and the non-naming rows A.4 · A.5 · B.6 · B.12 · B.16 where PR's text echoed a struck form.

## §3 STOPs
None. STOP-PR-r4-1 is closed (applied as RE-RULED).

## §4 REFINED (each bracketed where it sits; vetoable)
1. The root's home minimum — the crown keeps `NET_HOME_MIN` of its own riders (§10.3 (c)); else `hold01` 1.0 lends them all.
2. The hunt among a body's friends — BD §7.6's claim on `W_HARASS` carried as a second arm of PR's ONE grievance input, the greater of the two (§7.5).
3. A way's `cover01` ADDED to a person's own cover on a way (§8.1).
4. B.12 kept apart from the hunt's `leaderRef` — two units, two leaders, one word (§2.5, §15.2 homonym row).
5. The hunt's coin measured — never the `deployments` upkeep (§5.5; BD §9.11 routed).
6. The gleaning constants `GLEAN_BASE` 0.3 · `GLEAN_CAP` 0.8 and the eight factors (§5.5; DRAFT, UNMEASURED).
7. DM prose without the rung word ("lost the Tolle gang in the forest"); two new felt sentences (§18 20, 21).
8. The declared riders' token `patrol` (OD-PR-51) — ⭐ NOW VISIBLE: the resumed seat measured that it must enter `TRAVELLER_KINDS` as well as `HIDDEN_PATH_KINDS` and that master's exact-vocabulary pin is re-recorded at PR-2's unit (a landed access law widened is the owner's to see, as OD-BD-49).
9. §18 (21)'s lord ridden past is Kell (R42's chain), not Tolle (the resumed seat).

## §5 ROUTED (other volumes' halves; this lane wrote none — the volume's ROUTES (round 5a) paragraph carries the same)
- **PL:** F.4 and F.6 (b) (i) read the tally through `bannerCoverOf(worldState, memberId, tick).weeks` (the field is a pair; "`weeksCovered > 0`" reads its `weeks`) — wording only.
- **BD:** (1) §2.3's `watched?` carries the tick of the last junction week; (2) §9.11 COUNTERFORCES' "the TREASURY pays the detachment (the landed DEPLOYMENT upkeep)" → the unridden round and the riders' pay (a column alone pays deployment upkeep); (3) §9.3's THE HUNT bullet → `believedBodyOf`; (4) §5.2 (a)'s "nothing else is added" beside PR's `patrol` (or the chair's contrary ruling); (5) §2.3's gleaning factors cite PR §5.5; (6) ⭐ §5.2 (a)'s `body` enters `TRAVELLER_KINDS` too (codepoint-sorted) and BD-5's unit re-records master's exact-vocabulary pin (`tests/domain/routeNetworkConsumers.test.js`).
- **CH:** §5's trail arm and OD-CH-42's "a WARDEN (`isWardenParagon`) RETAINED by a court, every hidden way of that court's lands" struck by B.13 (0 live hits at 07:3x — CH's r5 lane appears to have struck it; the route stands until its verifier confirms); §4.4's "ride with the watch" row (owed since round 3).
- **RN:** §3.1's `patrol_clash` row and R65 to B.5 as PR §9.3 states (RN's r5 lane reports PR's text already matches).
- **PS:** §5.5's "a patrol … never takes a hidden way" (PS l.328, live at 07:3x) → "never CROSSES a border by a hidden way" (inside its own land a pursuing detachment within capacity may ride a known way, PR §5.5, OD-PR-51) — or the chair rules OD-PR-51's alternative.
- **EC:** the gauntlet's way-run (L-BD 11b) is EC's path choice; PR's trail arm watches it (§6.4).
- **FOLD (P4):** §5 rows `weeksCovered` (⭐ OD-PR-50), `holderEyesOf`, `NET_HOME_MIN`, `GLEAN_BASE`, `GLEAN_CAP`, `TRAVELLER_KINDS`/`HIDDEN_PATH_KINDS` + `patrol` (⭐ OD-PR-51, beside BD's `body`); §3.3 THE BANNER row (lord's ROW, B.8, B.9, A.8); §6 C16 behind M-W2 and the war layer's lighting (18 (c)); `junction:<id>` a key under `road (a, b)`.
- **ST · MN · PT · WC:** nothing new from PR.

## §6 OPEN QUESTIONS FOR THE CHAIR (none blocking; the volume's §19 round-5a list)
1. ⭐ OD-PR-51 the riders' hidden franchise (`patrol` in both pinned arrays; a `pursue` detachment ≤ `modest` on a known way inside its own land) — or no patrol rides a way (PS §5.5 then stands as written).
2. The sweep counts a threat need too (PL's one tally cannot tell help from sweep; the alternative needs a second field).
3. The tally counts the whole season (weeks before the levy count; the alternative a first-covered sub-field).
4. The root's home minimum (REFINED 1).
5. The hunt among a body's friends (REFINED 2) — or BD strikes its clause.
6. PL's own F.6 (c) peacetime-lend question (not PR's).

## §7 Proof of shape
`tablecheck.out`: tables 23, bad rows 0. The first seat's edits: `work/r5_b.py` … `r5_x.py` (each asserts a unique anchor); the resumed seat's: `work/r5_y.py` (11 replacements), `work/r5_z.py` (5). Pre-round `PR.pre-r5.md` (`97162fe5…`, 1012 lines) → pre-resume `PR.pre-resume.md` (`59d124ef…`, 1099) → now (`a25ec224…`, 1102).

**CONFIRMED vs PLAUSIBLE:** PR-X1, PR-X2 and PR-X5 are CONFIRMED by execution (three probes, re-run byte-identical); the master symbols (the rung, the franchise's two arrays and their pins, the upkeep ledger, the kernel order, `one_season`) are CONFIRMED by reading at `81f1cd963`; every sibling agreement is CONFIRMED by quoting the sibling's text at 07:3x; PLAUSIBLE: that PR's leg leaf can pass the hidden kind (PR-2's car-0 measures it, ⛔ STOP at build otherwise), EC's way-run seam, and the grievance input's host line.
