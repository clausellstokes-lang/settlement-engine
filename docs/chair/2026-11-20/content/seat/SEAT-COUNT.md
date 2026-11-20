# SEAT-MEASURE — deliverable 1: THE COUNT (written 2026-11-20T04:30Z, base `85fccf898` = origin/lane/join-2026-11-14)

The owner, 2026-11-20: *"power groups like nobles, craftsmen, etc are never able to compete for leadership? Why is that? Every power group should be able to compete for leadership or the seat given the right circumstances."*

**Executed** (every figure below is in a file beside this one): `node docs/chair/2026-11-20/content/seat/measure-seat.mjs --arm default --n 150` (900 towns: 150 per tier, seeds `seat-measure-<tier>-<i>`, config `{ settType }`, every slider at the store's default 50) → `count-default.{md,json}`; `node … --arm presets --n 10` (960 towns: the 16 non-neutral Character presets × 10 seeds per tier, seeds `seat-measure-<tier>-<preset>-<i>`, config `{ settType, ...archetypePatch(preset) }`) → `count-presets.{md,json}`. 0 generation errors in either. "Contender" is `rulingPowerCoup.js :: coupContenders` run on the born record; "kind" is the coup's own reading, `factionArchetypes.js :: factionArchetype`, except where the table says otherwise. **Read, not executed**: everything said about why (the code cited by symbol).

## THE TABLE

Present / rules at birth / one of the three contenders, in towns. Left = default sliders (900 towns); right = the Character presets (960).

| power group (the name it is born under) | present | rules at birth | contends | present | rules | contends |
|---|---|---|---|---|---|---|
| **Nobles** (Noble Houses / Noble Families / Landed Gentry / Manor Household) | 517 | 15 read as noble; 103 seats carry a noble name ¹ | 145 (28%) | 523 | 12; 154 noble-named ¹ | 349 (67%) |
| **Craftsmen** (Craft Guilds) ² | 504 | **0** | 35 (7%) | 496 | **0** | 184 (37%) |
| **Labourers** | **0** | 0 | 0 | **0** | 0 | 0 |
| **Outsiders** (as a class) | **0** | 0 | 0 | **0** | 0 | 0 |
| Merchants (Merchant Guilds; merchant / guild seats) | 518 | 148 | 454 (88%) | 551 | 179 | 395 (72%) |
| Military | 770 | **0** | 710 (92%) | 720 | 61 | 573 (80%) |
| Clergy | 665 | **0** | 585 (88%) | 714 | 85 | 481 (67%) |
| Mages | 300 | **0** | 31 (10%) | 303 | 20 | 90 (30%) |
| Criminals | 288 | 0 | 0 — excluded by rule | 180 | 22 | 0 — excluded by rule |
| The civic seat (councils, elders, mayor, reeve) | 682 | 680 | 25 | 586 | 579 | 19 |

¹ Royal Authority, Noble / Ducal Governorship and Feudal Stewardship are born only from a noble house's label (`rulingStructure.js :: generatePowerStructure`, `governanceLabelMap`), and the coup and every archetype reader read them as **government**, not noble: `factionCategories.js :: inferFactionCategory` files them under `government` on the words *Authority*, *Governor*, *Steward*, and `factionArchetype` takes the category first. Only Feudal Appointee reads noble.
² Craft Guilds is born with category `economy`, so the coup reads it as a **merchant** (factor 0.95), not craft (0.85). The craft factor 0.85 and the labour factor 0.85 apply to **no** power a town is born with. Counted here by the backing catalogue's name reading (`powerSupport.js :: backingArchetypeOf`).

## THE THREE PLAINEST TRUE SENTENCES

1. **Craftsmen are in more than half of all towns and rule in none. Labourers and outsiders are never born as powers at all. Nobles are present in 57% of towns and contend for the seat in only 28% of those.** Those figures are at default sliders; with the Character presets, craftsmen contend in 37% of their towns and nobles in 67%, but neither rules.
2. **What keeps them out is raw power at birth, not the coercion factor.** The median noble left out of the contest sits 2 weight below the third contender (median third: 13), and the median craft guild sits 4.45 below. The 0.85/0.95 factor alone decides it in 3 of 391 left-out noble instances and 5 of 469 craft instances. Nobles are cut on power because they are born only above a floor (`noblePower > 5`, or `> 10` in a town with no noble house) and are scaled down hard without a noble house (×1 instead of ×1.7–1.9, ×0.55 where the economy priority is above 70, ×0.85 in a town). Craft is born at 17 × a multiplier on (economy × 0.75 + 10), a median of 9.
3. **The seat at birth is never won.** In 60% of towns it is read off an institution's label, and otherwise it is set by size. With untouched sliders (all five at 50), none of the 14 priority councils is ever born, because each needs a top priority above 55 (`chooseGoverning`). Even with presets, 166 of the 258 small-town priority-path births are an Elder Council. Mostly that is the small table's own entry (military with no headman's house, criminal, magic), and in 33 of the 63 religion-led ones it is `rulerKin.js :: drawCouncilOfAKind` refusing Priestly Guidance where no church house stands (at town size: 4 arcane-led births fall to a Merchant Council or the Town Mayor). No birth path names a craft, labour or outsider body, though the coup's transfer table already does (`rulingPower.js :: GOVERNMENT_PREFERENCES`: Guildhall Council, Workers' Assembly, Foreign Administration).

## The other figures the brief asked for (all in the `.md` files)

- **Distribution against the cut** (default arm; left-out powers in full fields, power ≥ 5; gap = the third contender's weight minus theirs, p10 / p50 / p90): noble power 8 / 10 / 16, gap 1 / 2 / 7.6; merchant (incl. Craft Guilds) 8 / 13 / 20, gap 2.45 / 4.45 / 6.95; arcane 7 / 10 / 11, gap 0.5 / 1.85 / 6; religious 11 / 16 / 46, gap 0.25 / 1.35 / 3. **No** left-out power in the default arm is under the floor of 5. The factor *lets in* by itself 42 military and 1 noble contender instances (default arm) and 46 military and 28 noble (presets).
- **Institution label against priority** (default): label 537 / size-or-priority 363. By tier, the label rises from 61/150 (thorp) to 138/150 (metropolis). The label keys born: merchant oligarchy 69, informal elder consensus 59, mayor and council 59, guild consortium 54, village headman 48, noble governor 40, … royal seat 16, lord's appointee 15, lord's reeve 6.
- **Ruling bodies born** (default, 21 names): Elder Council 282, City Council 57, Town Mayor 57, Headman's Authority 48, Merchant oligarchy 44, Grand Council 40, … Feudal Appointee 15. **Never reached at default sliders** (18): every priority council (Military / Church / Merchant / Corrupt / Arcane Council and their city and metropolis forms, Shadow Senate, Arcane Senate, Grand Merchant Senate, High Theocratic Council), Priestly Guidance, Elder Consensus, Grand Guild Council, Guild Authority. **Never reached under the presets either**: Elder Consensus, Grand Guild Council, Guild Authority (and Town / City / Grand Council, which become their priority form there). **Named in the tables and emitted by no chooser**: Theocratic Council, Corrupt Oligarchy, Shadowed Council, Mixed Council.
- **The field**: towns, cities and metropolises always seat three contenders. Thorps mostly seat 0 or 1 (default: 80 with none, 46 with one), hamlets 1–2, and villages 2–3. The incumbent is gated in 798/900.
- **By culture** (11 cultures, 72–100 towns each): no culture changes the pattern. Nobles contend in 9–18 towns of each culture at default, and merchants rule in 8–19. Craft is counted by name only overall (the per-culture rows use the coup's reading, under which it is merchant).

## Where the chair's reading needs correcting (verified by reading the code)

- *"No ruling body exists for nobles as a class, for craftsmen"* — **partly wrong.** `governanceLabelMap` has noble bodies (`noble governor` → Noble / Ducal Governorship, `royal seat` → Royal Authority, `lord's steward` / `lord's reeve` → Feudal Stewardship, `lord's appointee` → Feudal Appointee) and guild bodies (`guild governance` → Guild Council / Guild Authority / Grand Guild Council). They are born only where the roster holds that institution, they are never won, and all but Feudal Appointee read as `government` kind. **What is right:** no **priority** category exists for nobles or craft, and no body of any kind exists for labourers or outsiders at birth.
- *"chosen by tier from the town's TOP PRIORITY"* — **incomplete.** The chooser runs through `rulerKin.js :: drawCouncilOfAKind` (COHERENCE-POWERS 2B): a council of a kind is drawn only where an open house of that kind exists, else the next priority's, else the size's civic seat. And at default sliders the priority path never fires (all are 50; the cut is above 55).
- *"weight = power × COUP_COERCION[archetype] … craft and labour 0.85"* — **the table is right but it never reaches craft at birth**: Craft Guilds' category is `economy`, so it is weighed as a merchant (0.95). Journeymen's League (2 towns) reads `other` (0.9).
- *"densityAscension.js also sets a governing power"* — **not at birth and not today.** `densityAscension.js :: planSeatAscension` is an unwired planner (no importer; dark until Register VII's signature) that returns `dormant_law` under the shipped dial. When it is lit, it would mint a house marked `isGoverning: true` for a power that has just taken the seat in play and holds no faction. It is a simulation path, R21's third caller.
