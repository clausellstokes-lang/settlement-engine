from edit import apply, DOC
R6 = '[CURED 2026-10-19 (fp-final r6) — '
# move the new OD rows after OD-BD-55
text = open(DOC, encoding='utf-8').read()
start = text.index("| ⭐ OD-BD-56 [r6] |")
end = text.index("| OD-BD-55 [r5] |")
block = text[start:end]
text = text[:start] + text[end:]
i55 = text.index("| OD-BD-55 [r5] |")
eol = text.index("\n", i55) + 1
text = text[:eol] + block + text[eol:]
open(DOC, 'w', encoding='utf-8').write(text)
print('moved OD-BD-56..62 after OD-BD-55')
ROUTES6 = ("\n### 19.0c THE ROUND-6 ROUTES (the halves this lane cannot write; one line per volume; `cure/D-BD-r6.md` §5 carries the same list) " + R6 + "the other-lane halves of A.1–A.4, B.1, B.2 and the round's cures]\n"
"- **PS:** (a) A.2 — `hiddenWayFor` keys a way by its mode `way` (`routeEdgeId(a, b, 'way')`); a BYPASS runs junction to junction and reads as the primary hops `a|b` and `b|c`, `b`'s LAND crossed, `b`'s gate and toll never entered (BD §5.2 (ii); PS-3); (b) the military unit's way admission `travellerMayWalk(kind, hop, { might })` is PS's ONE declared change (PS-4), its peace/war scope PS's text; with PR's `patrol` token struck (A.2), §5.5's \"a patrol … never takes a hidden way\" reads \"never CROSSES a border by a hidden way; on its holder's known way it passes by the holder's knowledge read\" (SEAMS-r5-2).\n"
"- **PR:** nothing new — PR r6 already strikes the `patrol` token (A.2); §9.2 (b)'s look writes a body's sighting through MN's generalized `recordSighting` (subject `{ kind: 'body', id }`, B.2); `hiddenWayEdges` rows carry the way-mode edge's id where lit.\n"
"- **ST:** `believedDenOf` reads a body holder's might through `believedBodyOf` from MN's generalized store (B.2); ST's returns feed `recordSighting`; S40 lights (BD §8.2 now EXCLUDES a `permitted`/`endowed` flock, B.1); the bounty input row is the RESIDUE lane's (B.7).\n"
"- **MN:** the generalized store as MN r6 writes it (`sightings[courtId][subjectKey]`, `subjectKey` `<kind>:<id>`; `recordSighting`) — its caller list gains BD's informer and the at-hand witness of an arrival (BD §2.4 (iii)–(iv)); the verb-dial road key `a␟b` → the landed `a|b` (RULINGS-ROUND3 A.14), or the chair rules the dial an exception (MN-1's second half).\n"
"- **CH:** §12.4's `pay · hunt · wait` STANDS as the court's choices (A.1); the race's closings per A.1 (`ransom_granted` on survival whatever the court chose; `captive_released` only the body's own early release or the DM's decision) — CH r6 already carries A.1 (CH §21 r6).\n"
"- **RN:** (a) BD's DRAFT value rows for its `body_act` kinds (BD §7.2's table) under RN's walker — RN may move every value; (b) `fought` widened to a led hunt's `beaten` close, target the hunting court (OD-BD-60, vetoable); (c) the quarter acts' producer is BD's act receipt `quarter:<bodyId>:<tick>` (RN's path (b)).\n"
"- **WY / the route lifecycle (A.2):** own the way-mode edge — `ROUTE_MODES` + `way` (its exact pin re-recorded), `wayRung` (`wild · way · trail`), `useCount` (decayed on the lifecycle's clock), the desire-path lighting of a candidate; `routeNetworkDecay.js` and `routeNetworkCharterBypass.js` SKIP mode `way` (the decay's `gradeRank` promotion; the bypass's \"`if (edge.mode === 'water') continue;`\" would read a way as a land road); a road demoting to `hidden` stays the road ladder's own bottom, read as a way for travel.\n"
"- **HB:** nothing owed by BD (the `ends` change form is BD-10's own host edit); HB's own bracket is the fold's P4 slot.\n"
"- **INT:** (4) the guild war's commons' grievance reads the town's ORDER through the `guild_war` condition (A.4), never the corridor or infiltration stressors.\n"
"- **WC · PL · PT · EC · ES · IN:** nothing new (WC's one-term carrier is the fold's §3.1.16 ↳ r5 and its WC inbox (10); PL §4.8 (4)–(5) and PT's `body_ended` are cited as written).\n"
"- **FOLD (P4):** §5 registers the route mode `way` · `wayRung` · `useCount` (⭐ OD-BD-56 visible in §7), MN's `sightings` / `recordSighting` (B.2), `guild_war` in `DEFENSE_ARCHETYPES`, `GUILD_WAR_LEASE`, `BODY_KEEP_POINTS`, the bypass's derived junction key `junction:<a|b>@<b>` (a key under `road (a, b)`); `TRAVELLER_KINDS` + `body` in BOTH arrays and PR's `patrol` STRUCK (l.855's ladder row aligned, BD-r5-6); the `ransom` row per A.1; ⭐ OD-BD-56 and OD-BD-57's visible crime reading.\n"
"- **HOST-asks:** ENC-HL-12's hidden class row names the franchise — the landed three and `body` (SEAMS-r5-30); a junction is a point on ONE primary hop and the map's own junction ids replace `junction:<a|b>@<b>`.\n")
pairs = [
("ONE row per (court, subject), the newest replacing the older, pruned at the long rumor TTL as MN's rows are; its ONE writer `recordSighting(worldState, { courtId, subject: { kind, id }, mightBand, tick, whereId, siteId })`",
 "ONE row per (court, subject), the newest replacing the older, pruned at the long rumor TTL as MN's rows are; its ONE writer `recordSighting(worldState, { courtId, subject: { kind: 'menace' | 'body', id }, mightBand, tick, whereId, siteId })`"),
("`spatialLedgers.sightings[courtId][subjectKey] = { mightBand, tick, whereId, siteId?, name? }`, `subjectKey` `menace:<id>` or `body:<id>`,",
 "`spatialLedgers.sightings[courtId][subjectKey] = { subject: { kind, id }, name?, mightBand, tick, whereId, siteId? }`, `subjectKey` `<kind>:<id>` (`menace` or `body`) as MN r6 writes it,"),
("(1) a `g:<bodyId>` key (holder and subject; the refused-pair rule does not bind it);",
 "(1) a `g:<bodyId>` key (holder and subject; the refused-pair rule's FIRST class does not bind it, its SECOND does — body↔body feeling is BD's `pairs`, §2.1 " + R6 + "V-BD residue]);"),
("(3) the `leak:body:<bodyId>:<employerId>:<sinceTick>` telling row (an employed gang's leak).",
 "(3) the `leak:body:<bodyId>:<courtId>:<sinceTick>` telling row (one per tie — RN's spelling " + R6 + "SEAMS-r5-14])."),
("(4) BD-0's adoption of every untied band holder into a body record (ST's writer re-points the ref);",
 "(4) BD-0's adoption of every id-less authored gang into a body record (ST's writer re-points the ref " + R6 + "V-BD residue]);"),
("the prediction by `believedBodies` and `BODY_HABITS`,",
 "the prediction by `believedBodyOf` (PR's `predictedPlaceOf`) and `BODY_HABITS` " + R6 + "PR-3 · SEAMS-r5 note 3],"),
("(4) the guild war's commons' grievance reads the corridor and infiltration stressors (no BD write; §6.8 (d));",
 "(4) the guild war's commons' grievance reads the town's ORDER — the `guild_war` condition's lowered defence readiness (A.4; no BD write; §6.8 (d)) " + R6 + "BD-r5-15];"),
("(7) the leak row widened to a sponsorship tie (`leak:body:<bodyId>:<sponsorId>:<sinceTick>`);",
 "(7) the leak row widened to a sponsorship tie (`leak:body:<bodyId>:<courtId>:<sinceTick>`, one per tie " + R6 + "SEAMS-r5-14]);"),
("- **The map (HOST-asks):** confirm a junction is a point on ONE primary hop (its `a|b`), so the card's WHERE stays `road (a, b)` (SEAMS-r4-16); the bypass corridors' geometry is the map's to draw.\n",
 "- **The map (HOST-asks):** confirm a junction is a point on ONE primary hop (its `a|b`), so the card's WHERE stays `road (a, b)` (SEAMS-r4-16); the bypass corridors' geometry is the map's to draw.\n" + ROUTES6),
("(11) the conclave's `raid` weight for a GOOD god's starving, hunted flock is DRAFT ×0.25 (\"rarely and in extremity, never never\") — the owner's to tune.",
 "(11) the conclave's `raid` weight for a GOOD god's starving, hunted flock is DRAFT ×0.25 (\"rarely and in extremity, never never\") — the owner's to tune.\n- OPEN (round 6) " + R6 + "]: (12) ⭐ OD-BD-56 — the route MODE `way` and its two fields are a persisted-shape change on the landed route ledger, the owner's (A.2); (13) OD-BD-57 — A.4 carries the owner's \"drastically increases crime\" by the war's own bodies and two criminal powers, never by a raised crime pressure (the chair's reading, visible); (14) OD-BD-60 — a led hunt's `beaten` close as the body's `fought` deed (RN's open question, ruled here by delegation)."),
# §22
("| A1 | a gang's `raid` or a pack's `prowl` on a settlement's country (§9.2, §6.3) | `monster_raider_pressure` (its births) | ONE row per body in `monsterRaiderGate` (×1.4, DRAFT), the den row of ST yielding to it (§8.3) |",
 "| A1 | a gang's `raid`, a HOSTILE flock's `raid` (upon a court that curbs or outlaws it, B.2) or a pack's `prowl` on a settlement's country (§9.2, §6.3) " + R6 + "BD-r5-16] | `monster_raider_pressure` (its births) | ONE row per body in `monsterRaiderGate` (×1.4, DRAFT; its reasons name the gang, the pack and the hostile flock, §8.3), the den row of ST yielding to it |"),
("a DEFENSE archetype, adding +0.16 ONCE to the defence pressure (`pressureModel.js`), which LOWERS the kernel's `security01`",
 "a DEFENSE archetype whose landed condition moves FIVE pressures — measured at severity 0.5 (`skeptic/BD-r5-probe/warpressure.out`): defence +0.23 (its archetype step \"`defense += 0.16;`\" once, deduped, plus the readiness and labour terms), conflict +0.27, trade +0.13, legitimacy +0.11, economy +0.07 " + R6 + "BD-r5-4: \"+0.16 ONCE\" understated the channel] — its defence arm LOWERS the kernel's `security01`"),
("It is DECLARED and BOUNDED, not hidden: the +0.16 is once per archetype however many bodies press (\"deduped\"),",
 "It is DECLARED and BOUNDED, not hidden: the archetype step is once per town however many bodies press (\"deduped\"); the conflict, trade, legitimacy and economy arms are the landed `war_pressure` condition's own life (a raided country is at war-pressure on master, its births by their own gates) — BD drives the stressor once (A1), never a second channel;"),
("| the town's CRIMINAL OPPORTUNITY (→ the crime pressure the gauge's `crime01` reads) and its DEFENCE READINESS (→ the defence pressure → the kernel's `security01` and BD's `bodySecurity`) — the owner's \"drastically increases crime and lowers internal security\" | ONE active condition `guild_war` (`affectedSystems: ['criminal_opportunity', 'defense_readiness', 'social_trust']`) through the landed condition writer, ONE template row (B.18)",
 "| the town's DEFENCE READINESS and the defence pressure's archetype step (→ the kernel's `security01` and BD's `bodySecurity`) — the owner's \"lowers internal security\"; his \"drastically increases crime\" is the war's own bodies and two criminal powers in the quarter (A.4, OD-BD-57) | ONE active condition `guild_war` (`affectedSystems: ['defense_readiness', 'social_trust']`, a member of `DEFENSE_ARCHETYPES` — A.4) through the landed condition writer, ONE template row and ONE Set token (B.18 · A.4)"),
("| ONE condition through THE ONE affectedSystems join (`causalState.js :: applyConditions`), so crime and order each move ONCE; no stressor birth is touched (the spawn gates did nothing in a town already holding a corridor, and both stressors collapse to one archetype that never reaches defence); the war's close lifts the condition |",
 "| ONE condition through THE ONE affectedSystems join and the ONE archetype step, so ORDER moves once; the CRIME pressure is untouched (measured 0), so no crime-reading birth is touched; the CONFLICT pressure rises through the same readiness (≤ +0.171 at severity 1 — `guild_war` is not in `CONFLICT_ARCHETYPES`), below every conflict-reading birth threshold at the measured worst (0.537 < `monster_raider_pressure`'s 0.60), so a conflict birth comes only in a town already near one, by that stressor's own gate — DECLARED, bounded by the severity; a regenerate keeps it, the war's close lifts it, a dark lease expires it (§15.2) " + R6 + "A.4 · BD-r5-4 (EXECUTED, `cure/D-BD-r6-probe/guildwar-r6.out`): the round-5 \"no stressor birth is touched\" was false of the crime term] |"),
("| C4 | the corridor's own counterforce (after a guild war) |",
 "| C4 | the corridor's own counterforce (where a corridor stands; a guild war no longer drives one — A.4) |"),
]
apply(pairs, 'c13')
