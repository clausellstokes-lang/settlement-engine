p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
s=open(p,encoding='utf-8').read()
anchor="\nEND OF VOLUME."
assert s.count(anchor)==1
block = r"""
### Round 5a (2026-10-19; `cure/D-PR-r5.md`; inputs `skeptic/PR-r4-verify.md` (its STOP row, seven ROUTED-UNAPPLIED fails, PR-X1–X5), `skeptic/SEAMS-r4.md`'s and `skeptic/BD-r4.md`'s PR routes, every PR route in the ten `cure/D-*-r4.md`, and every RULINGS-ROUND5 §A/§B row naming PR)

| Id | Sev | Disposition | Where |
|---|---|---|---|
| STOP-PR-r4-1 (RE-RULED, RULINGS-ROUND4 §E; the verifier's six sites + A.8's three) | M | CURED — both arms: rung by rung below `unbroken`, DIRECT under it, NEVER SKIPPING A LORD'S ROW (the mid-lord's credit or precedence friction, PL §4.1 (ii)); every summons row on the answering member's own edge; the sweep and the ride past PL's `riders_quartered` ROW with its one patch | status · §10.3 (b) (h) · §7.6 · §15.1 PL · §17 OD-PR-26 · STOP row · §18 (21) · §19 · R21 · R42 |
| CH→PR 1 (`hunt` → `hunt_body`) | m (RU) | CURED — CH's purpose `hunt_body` at every live site | §5.5 · §15.1 CH · R46 |
| CH→PR 2 (a warden paragon RETAINED counts) | m (RU) | REFUTED — RULINGS-ROUND5 B.13: "the office knowledge belongs to the person HOLDING the public-security office with the warden archetype (L-BD 41), never to any retained warden (CH's widening struck)"; PR now says so | §5.5 · §10.5 · §15.1 CH · R47 (third run) |
| CH→PR 3 (a paragon on a trail met by `trailWatchOf`) | m (RU) | CURED — any traveller on a way (a paragon, a covert envoy, a smuggler's run) met ONLY by the trail arm | PR8 · §8.1 · §8.2 · R54 · OD-PR-48 |
| RN→PR (§7.2: doer the body, `ledBy` its paragon, never also a `body_act`) | m (RU) | CURED — one doer per deed; a led hunt's clashes mint none (B.5) | §7.2 · §9.3 · §15.1 RN · R53 |
| BD→PR (8) (the commons' support +0.2 cover) | m (RU) | CURED — on the encounter's body cover, beside `ROAD_COVER_BY_MIGHT` | §8.1 · OD-PR-48 |
| BD→PR (9) (`informer` sightings, `believedBodyOf`) | m (RU) | CURED — §5.1, the prediction and the cold trail read the one belief record (its might band, its informer rows) | §2.6 · §5.1 · §5.5 · OD-PR-46 |
| BD→PR (11) (the gang's `bribe` on PR's unpaid-wages slot) | m (RU) | CURED — the slot named (pay below `funded`); the effect BD's stance fork, never a second notice cut | §6.4 |
| PR-X1 (the net lends zero at a strong hold) | M | CURED (B.8) — `lend(m) = max(1, ⌊n × s × hold01⌋)` at the band share toward the IMMEDIATE liege while the home keeps `NET_HOME_MIN`, a sub-vassal through its liege's line, a ceiling filled on need; re-run on the convicting arithmetic: EXECUTED `cure/D-PR-r5-probe/net-r5.out` — 0 zero-lend rows at a strong hold for n ≥ 2 (r4: every sub-vassal and every town below `strong`), R39's Ashford 1 (r4: 0), ten town vassals 10 (r4: 0) | PR11 · §4.1 · §10.3 (c) (d) · §12 pin (16) · R39 · R51 · OD-PR-26 · OD-PR-40 |
| PR-X2 (`bannerCoverOf` on the one-week `lived` rows) | M | CURED (B.9) — THE SEASON LEDGER `weeksCovered` `{ seasonStartTick, weeks }` on the member's placement row (⭐ OD-PR-50, the owner's shape, declared), counted by the stage, replaced at the season's turn, read at the season's last tick after PR's stage (kernel l.2527 < l.2752, CONFIRMED); EXECUTED `season-r5.out`: the verifier's case r4 `protection_failed` → r5 10 weeks `protection_kept` | §2.6 · §2.7 · §4.1 · §10.3 (f) (h) · §16.1 · §12 pin (17) · R50 · OD-PR-26 · OD-PR-50 |
| PR-X3 (the net rider's witness had no formula) | m | CURED — `holderEyesOf` (own riders ∪ net rows on the half), read by the witness and the trail arm, never the gate | PR10 · §2.6 · §6.5 · OD-PR-13 |
| PR-X4 (three feeders; first-to-land-owns; C16's place) | m | CURED — FOUR feeders (OD-MN-40); MN's OWNED composer unit (CHAIR-NOTES 18 (d)); C16 behind M-W2 and the war layer's lighting (18 (c), the fold's at P4) | §0.2 · §6.1 · §14 head · §14 PR-1 · §14.1 · §15.1 MN · OD-PR-43 |
| PR-X5 (no stamp where riders are kept from a zero offensive) | m | CURED — the stamp whenever riders are kept, `points` 0 where nothing could be drawn; EXECUTED `drawshare-r5.out` | §2.7 · §6.6 · §12 pin (9) · §16.1 · R38 (a) · OD-PR-5 |
| SEAMS-r4-3 | M | CURED (= STOP-PR-r4-1) | as above |
| SEAMS-r4-10 | m | CURED (= CH→PR 1) | as above |
| SEAMS-r4-16 (the rung words) | m | CURED — the way's words (the map's rungs; `trail:<a\|b>` BD's key; DM prose "way"/"path"); `junction:<id>` a key under `road (a, b)` | §2.2 · §11.2 · §15.2 · §18 (16) |
| BD-r4 ROUTES → PR: `cover01` re-points with BD-r4-3 | M | CURED (= B.4) | §8.1 |
| BD-r4 ROUTES → PR: `tolerated` gangs unpursued (BD-r4-5) | M | CURED — PR's quarry rule reads BD §7.1's cured default (`hunted` save `tol ≥ 0.3` or the underworld's rule) | §5.5 |
| BD-r4-23 (`trailWatchOf` reads the union unnamed) | m | CURED (= B.13) | §2.2 · §2.6 |
| BD-r4-24 (the map's rung words) | m | CURED (= SEAMS-r4-16) | §2.2 |
| D-BD-r4 §5 → PR: commons +0.2 · informer · cadence · bribe | — | CURED (= BD (8), (9), (11)); the cadence half NOTED — holds (the verifier) | — |
| D-CH-r4 §6 → PR: three halves | — | = CH→PR 1 (CURED), 2 (REFUTED), 3 (CURED) | — |
| D-PL-r4 §5 → PR (THE BANNER per PL §4.7) | — | NOTED — held in r4; re-aligned this round to PL's round-5 text (B.8 · B.9 · A.8) | §10.3 |
| D-PS-r4 §5 → PR: jurisdiction · witness trail arm · `believedWatch` planner | — | NOTED ×3 — hold (the verifier); the trail arm re-cut under B.13 / PR-X3 | PR10 · §6.5 · §8.3 |
| D-RN-r4 §5 → PR | — | CURED (= RN→PR) | — |
| RULINGS-ROUND5 A.8 | — | CURED (= STOP-PR-r4-1's friction arm) | §7.6 · §10.3 (h) · R21 |
| RULINGS-ROUND5 B.4 | — | CURED — the ways master's hidden rung through `hiddenWayEdges`; the riders' franchise (the declared `patrol` token, OD-PR-51) at the landed ×2; no border crossed by a way | §0.2 · §2.2 · §2.6 · §5.5 · §8.1 · §8.3 · §14 PR-2 · R52 · OD-PR-47 · OD-PR-51 |
| RULINGS-ROUND5 B.5 | — | CURED — ONE HUNT, ONE DEED on PR's side | §5.5 · §7.2 · §9.3 · R46 · R53 · OD-PR-46 · pin (19) |
| RULINGS-ROUND5 B.8 · B.9 | — | CURED (= PR-X1 · PR-X2) | as above |
| RULINGS-ROUND5 B.13 | — | CURED — `knownTrailsOf` by name; the office-holder's ways only | §2.2 · §2.6 · §5.5 · §10.5 · R47 · OD-PR-47 |
| RULINGS-ROUND5 B.22 (PR 7) | — | CURED (= the seven RU rows) | — |
| concurrent: D-BD-r5's PR routes (c) gleaning · (d) `watched` · (e) `ROAD_COVER_BY_MIGHT` | — | CURED — the gleaning roll is PR's text (BD's write); the stage writes the `watched` fact and never reads it as priority (no loop); BD's road cover cited | §2.2 · §4.1 · §5.5 · §8.1 · R43 · R55 |
| concurrent: D-PS-r5's PR route (the enemy patrol) · D-PL-r5's PR route (all its sites) | — | CURED | §10.1 (c) · §7.6 · §10.3 · R21 · §14 PR-4 |
| non-naming rows reaching PR's text: A.4 · A.5 (the den's belief; sightings into the holder's own record) · B.6 · B.12 · B.16 | — | CURED on PR's side (cited where PR's text echoed the struck form) | §5.1 · §9.2 (b) · §2.5 · §5.5 · §12 |

**Disposed 39 of 39: cured 32 · refuted 2 · stop 0 · noted 5** (the row count above folds duplicates under their first id; the 39 are the 13 verifier rows, three SEAMS-r4 ids, four BD-r4 route items, twelve halves of the ten r4 lanes' ROUTES, and seven RULINGS-ROUND5 rows), plus the concurrent and non-naming rows applied so none is left unapplied at round 5b. REFINED beyond the inputs (each marked where it sits): the root's home minimum (§10.3 (c)); the commons-support hunt arm on the one grievance input (§7.5); a way's cover added to a person's (§8.1); B.12's one leader record kept apart from the hunt's `leaderRef` (§2.5, §15.2); the hunt's coin measured — never the `deployments` upkeep (§5.5); the gleaning constants (§5.5); the DM line without the rung word, and two new felt sentences (§18 16, 20, 21); the declared riders' token `patrol` (OD-PR-51, by delegation, vetoable).
"""
s=s.replace(anchor, block+anchor)
open(p,'w',encoding='utf-8').write(s)
print('ok')
