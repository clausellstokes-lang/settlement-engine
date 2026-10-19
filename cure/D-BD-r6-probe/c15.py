from edit import apply
R6 = '[CURED 2026-10-19 (fp-final r6) — '
REC = """
### 20.4 ROUND 6a (lane D-BD-r6, 2026-10-19; `cure/D-BD-r6.md` holds the receipts; probes `cure/D-BD-r6-probe/`) — every input id, none missing
| Id | Sev | Disposition | Where |
|---|---|---|---|
| RULINGS-ROUND6 A.1 · BD-r5-1 (the ransom on the owner's 18:54 word) | BLOCKING | CURED | the answer · BD27 · §9.10 · §12 `ransom` · §15.1 · S29 · OD-BD-40 · §18 #23 |
| A.2 · BD-r5-2 · SEAMS-r5-1 · V-BD B.4 · PS-2 · PS-4 (the way is a route-ledger MODE) | BLOCKING | CURED — EXECUTED (`waymode.out`) | §0.1 · BD19 · BD20 · §2.5 · §2.6 · §5.2 (a)(c)(i)(ii) · §13 · BD-5 · §15.2 · S47 · S55 · ⭐ OD-BD-56 · OD-BD-49 |
| A.3 · V-BD B.16 (the byte-identical pin binds the dark state) | MAJOR | CURED | BD22 · §8.5 · §13 · B2 · OD-BD-2 |
| A.4 · BD-r5-3 · BD-r5-4 · V-BD B.18 (the guild war's weight, no crime term) | MAJOR | CURED — EXECUTED (`guildwar-r6.out`) | §0.1 · BD19 · §6.8 (d) · §12 `guild_war` · §13 · BD-2 · BD-8 · §22 A2 · A7 · C4 · S45 · OD-BD-52 · OD-BD-57 |
| B.1 · SEAMS-r5-4 · ST-6 (a permitted flock presses nothing) | MAJOR | CURED | §8.2 · §22 A2 · S53 |
| B.2 · A.5's BD half · SEAMS-r5-3 · ST-1 (one sighting store) | MAJOR | CURED | BD12 · §2.4 · §9.3 · §15.2 · S56 · OD-BD-58 |
| BD-r5-5 · BD-Y1 (the condition's lifecycle) | MAJOR | CURED | §6.8 (d) · §2.7 step 6 · §8.5 · §15.2 · S45 |
| BD-r5-6 · PR-6 (`body` in BOTH arrays) | MAJOR | CURED | §0.1 · BD19 · §5.2 (a) · BD-5 · S47 · OD-BD-49 |
| BD-r5-7 · PR-4 · PS-1 · SEAMS-r5-2 (the access law; `patrol` struck by A.2) | MAJOR | CURED | §5.2 (a) · §9.11 · OD-BD-49 |
| BD-r5-8 · V-BD B.2 partial (hostility per court) | MAJOR | CURED | BD14 · §4.2 · §6.1 · §6.6 · §9.2 · S54 |
| BD-r5-9 (shared faith from the two towns' patrons) | MAJOR | CURED | §10.2 (a) · OD-BD-44 |
| BD-r5-10 · SEAMS-r5-10 · SEAMS-r5-23 (three halves with no carrier) | MAJOR | CURED — HB: BD-10's own host edit; ST: the RESIDUE lane (B.7); WC: REFUTED in that half (its carrier exists, the fold §3.1.16 ↳ r5 · WC inbox (10)) | §0.1 · §0.2 · BD24 · §4.4 · §2.7 · §9.9 · BD-10 · S61 · OD-BD-62 |
| SEAMS-r5-5 · PR-2 (no deployment upkeep) | MAJOR | CURED | §0.1 · §8.5 · §9.11 · §13 |
| SEAMS-r5-7 · ST-8 · BD-r5-18 (the keep on the site scale) | MAJOR | CURED | BD14 · §2.5 `bodyDefenceOf` · §9.2 |
| SEAMS-r5-8 · ST-5 (the seizure is step 6c) | MAJOR | CURED | §7.1 · §9.4 |
| SEAMS-r5-9 · PL-1 (PL §4.8 (4)–(5)) | MAJOR | CURED | §7.1 · §10.2 (b′) · §10.5 · §13 · §19.0 PL |
| RN-1a · SEAMS-r5-20 (the quarter acts' producer) | MAJOR-weight | CURED (REFINED: an act receipt) | §7.2 · §7.6 · §2.7 · S59 · OD-BD-59 |
| BD-Y4 (beasts exempt from capacity) | MINOR | CURED | BD11 · §5.2 capacity |
| BD-Y2 · SEAMS-r5-24 · PS-3 (the bypass key, hops and WHERE) | MINOR | CURED | §5.2 (ii) · §2.6 · S48 · S55 |
| BD-Y3 (the stage's settlement channel) | MINOR | CURED | §2.7 |
| V-BD BD-r4-9 partial (a row's `confront`) | MINOR | CURED | §4.2 · S13 |
| V-BD residues (by stance ×3 · `exposed?` · OD-BD-44 · §19 RN (1) · §19 ST (4) · `ledBy` · A26) | MINOR | CURED | §2.5 · §5 · §6.8 (e) · §10.4 · §17 · §19 · §9.11 · §10.3 |
| BD-r5-11 · BD-r5-12 · ST-4 · SEAMS-r5-21 · BD-r5-13 · BD-r5-14 · BD-r5-15 · BD-r5-16 | MINOR | CURED | §2.5 · §15 · §4.2 · S32 · §10.4 · §19.0 INT · §8.3 · §22 A1 |
| BD-r5-17 · BD-r5-19 · BD-r5-20 · BD-r5-21 · BD-r5-22 · BD-r5-23 · BD-r5-24 | MINOR | CURED | BD14 · §2.3 · §4.4 · S57 · S58 · §9.11 · OD-BD-61 |
| CH-1 · SEAMS-r5-11 (`securityOfficeOf`) · CH-2 · SEAMS-r5-12 (the attempt card) · CH-3 (`mercenaryMarket.js`) · CH-4 (`tieKind`) · CH-5 · SEAMS-r5-13 (the DM's removal) | ROUTED | CURED | §2.3 · §9.11 · §9.5 · §12 · §6.8 (b) · §10.4 · §2.2 · §6.10 |
| FOLD-1 · SEAMS-r5-18 (`dispersed`) · FOLD-2 · SEAMS-r5-17 (decide) | ROUTED | CURED | §2.6 · BD13 · §9.10 · §12 |
| MN-1 · SEAMS-r5-15 (the staging; `a␟b`) · MN-2 · SEAMS-r5-16 (the guard and the sink) | ROUTED | CURED — MN-1's key half REFUTED by RULINGS-ROUND3 A.14 (the landed `a\\|b`; routed back to MN) | §11 · §9.8 (d) · §2.7 |
| PR-1 (`watched` a tick) · PR-3 (`believedBodyOf`) · PR-5 (PR §5.5) | ROUTED | CURED | §2.3 · §9.3 |
| PT-1 · SEAMS-r5-19 (`body_ended`) | ROUTED | CURED | §9.9 |
| RN-1b (`beaten`) · RN-1c (the value rows) · RN (d) · SEAMS-r5-14 (the leak key) | ROUTED | CURED (RN-1b ruled by delegation, OD-BD-60) | §7.2 · §9.11 · §7.1 · §10.4 · §19 · S60 |
| ST-2 (a nameless body's sightings) · ST-3 (adoption from tellings) · ST-7 · SEAMS-r5-22 (one side at a time) | ROUTED | CURED | BD23 · §2.1 · §2.4 · §9.4 |
"""
pairs = [
("\n\n## §21 THE CROSS-VOLUME CHECKS", "\n" + REC + "\n## §21 THE CROSS-VOLUME CHECKS"),
("Every remaining difference is a routed half the ruling itself assigns to the sibling; BD opened none of its own.",
 "Every remaining difference is a routed half the ruling itself assigns to the sibling; BD opened none of its own.\n- **ROUND 6a (read 2026-10-19 08:5x–09:1x, the siblings' current text while the RESIDUE lane writes)** " + R6 + "]: MN §3.1 now carries the generalized store (`sightings[courtId][subjectKey] = { subject: { kind, id }, name?, mightBand, tick, whereId, siteId? }`, `recordSighting`) — BD §2.4 cites its shape verbatim; PR r6 STRIKES its `patrol` token (\"the r5 `patrol` token in `TRAVELLER_KINDS` · `HIDDEN_PATH_KINDS` and its re-recorded pin are STRUCK — RULINGS-ROUND6 A.2\") — BD §5.2 (a) agrees; CH §12.4 keeps `pay · hunt · wait` as the choices and CH r6 carries A.1 — BD §9.10 names them as the choices beside the landed line; ST l.464 (\"a NAMELESS body's too (BD23's one exception)\") — BD23 now holds that exception; RN's leak key (`<courtId>`) and \"never a `ledBy` rider\" — BD §7.1, §10.4, §9.11 now agree; PL §4.8 (4)–(5) — BD §10.2 (b′), §10.5 cite them; PS's `hiddenWayFor` (mode `way`, the bypass's hops) and §5.5 l.328 — ROUTED (§19.0c PS); MN's `a␟b` — ROUTED back under A.14; WY's skip of mode `way` and the fold's register — ROUTED (§19.0c). No new contradiction is opened by this round's text."),
("— the mode needs", "— the mode needs"),
]
pairs = pairs[:2]
pairs.append(("`withRouteEdges` refuses the second edge on the road's id, and `gradeLegMultiplier` prices an unknown rung word at the road's ×1].",
 "`withRouteEdges` refuses the second edge on the road's id, and `gradeLegMultiplier` prices an unknown rung word at the road's ×1; EXECUTED `cure/D-BD-r6-probe/waymode.out`: master's own `withRouteEdges` admits `route.ashford.kell.way` beside `route.ashford.kell.land`, `livedAdjacency` reads it `[\"hidden\",\"way\",true]`, an army is refused and a smuggler admitted on it, and `gradeLegMultiplier('trail')` is 1 — so the rung is never the grade, and the mode needs no ledger code beyond its pinned word]."))
apply(pairs, 'c15')
