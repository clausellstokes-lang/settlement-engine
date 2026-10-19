import json
reps = [
(r"""| `migrationRumors` 83 (+≈6) · SP-9 · ST/MN/CH/BD commits (rows)""",
 r"""| `migrationRumors` 83 (+≈6) · `routeNetworkConsumers` 540 (+0: the declared token `patrol`, r5) · SP-9 · ST/MN/CH/BD commits (rows)"""),
(r"""the call reaches riders rung by rung through PL's summons (⛔ STOP-PR-r4-1 at PL §4.1's `unbroken` direct summons); PL's PROTECTION rows read `bannerCoverOf` (F.4) and its SERVICE row credits lent riders (F.6) — PL's writer, PR requests no row; the crown's riders' wear when they sweep unasked (§7.6)""",
 r"""the call reaches riders rung by rung through PL's summons under every hold below `unbroken` and DIRECTLY under `unbroken`, never skipping a lord's ROW (the mid-lord's credit or precedence friction, PL §4.1 (ii); §10.3 (b) — STOP-PR-r4-1 as RE-RULED); a member lends `max(1, ⌊n × s × hold01⌋)` above the home's minimum, a sub-vassal through its liege's line (F.2, B.8); PL's PROTECTION rows read `bannerCoverOf`'s SEASON TALLY (F.4, B.9) and its SERVICE row credits lent riders (F.6) — PL's writer, PR requests no row; the swept lord's grudge is PL's `riders_quartered` ROW with its one resentment patch (§7.6; F.6 (b), A.8) [CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 · B.8 · B.9 · A.8]"""),
(r"""a body's side by its RN key (`g:<bodyId>`; BD's route to RN), a hunt's success the leader's deed (L-BD 40)""",
 r"""ONE ACT, ONE DEED (B.5): an unled clash the riders' town's TALE, a patrol cut down by a named body the BODY's deed (its RN key `g:<bodyId>`, its creed's for a conclave; its leading paragon `ledBy`), a LED hunt's success CH's `hunt_won` at the mission's close and never a `patrol_clash` [CURED 2026-10-19 (fp-final r5) — B.5 · the RN→PR route]"""),
(r"""a warden HOLDING the public-security office knows the hidden ways of its land (L-BD 41, §5.5); a paragon may LEAD a hunt by CH's aim `hunt`, moving""",
 r"""a warden HOLDING the public-security office knows the hidden ways of its land (L-BD 41, §5.5; never a warden merely retained, B.13); a paragon on a known way is met only by the trail arm (§8.1); a paragon may LEAD a hunt by CH's purpose `hunt_body` [CURED 2026-10-19 (fp-final r5) — CH→PR routes 1–3 · B.13], moving"""),
(r"""PR's subtraction and BD's presence row sit in the one composer (§6.1)""",
 r"""PR's subtraction and BD's presence row sit in the one composer (§6.1); and from round 5 — the known set read BY NAME (`knownTrailsOf`, B.13), the ways on master's hidden rung through `hiddenWayEdges` (B.4), the prediction on `believedBodyOf` (its informer rows), BD's `ROAD_COVER_BY_MIGHT` and the commons' +0.2 on the encounter's cover, the riders' gleaning roll and the `watched` mark PR's stage writes through BD's one writer, the gang's `bribe` on PR's unpaid-wages slot, a LED hunt's card BD's (`hunt_taken`, lit with `bodyEffectsEnabled`) [CURED 2026-10-19 (fp-final r5) — BD's routes (8)–(11) · BD's round-5 routes (a)–(g)]"""),
(r"""a BODY is never a passage mover — its crossing is PR's encounter (PS1, BD's route to PS)""",
 r"""a BODY is never a passage mover — its crossing is PR's encounter (PS1, BD's route to PS); an ENEMY's patrol on a foreign stretch opens PS's `armed_incursion` with NO PS border battle (no transit record), riders meeting riders PR's `patrol_engages` (PS §5.5, minor (g)); a patrol never CROSSES a border by a hidden way (PS §5.5; PR §5.5's franchise rides ways only inside its own land) [CURED 2026-10-19 (fp-final r5) — PS's round-5 route · B.4]"""),
(r"""with Ilsa named, CH's aim `hunt` moves Ilsa""",
 r"""with Ilsa named, CH's purpose `hunt_body` moves Ilsa [CURED 2026-10-19 (fp-final r5) — CH→PR route 1 · SEAMS-r4-10]"""),
(r"""the aim `hunt` reads PR's `predictedPlaceOf`""",
 r"""the aim `hunt` (since r5, CH's purpose `hunt_body`) reads PR's `predictedPlaceOf`"""),
]
json.dump(reps, open('/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PR-r5-probe/work/r5_o.json','w',encoding='utf-8'), ensure_ascii=False)
