# SEAT-MEASURE — deliverable 1: THE COUNT (re-measured 2026-11-20T04:58Z under the birth law; base `85fccf898` = origin/lane/join-2026-11-14)

The owner, 2026-11-20: *"power groups like nobles, craftsmen, etc are never able to compete for leadership? Why is that? Every power group should be able to compete for leadership or the seat given the right circumstances."*

> **⚠ CORRECTION (2026-11-20 04:58Z; my error, found by me).** The first version of this file (`d411d1806`) called the pipeline with a bare config. Every town the app creates goes through `densityCreateBoundary.js :: birthConfig`, which today mints `_densityLawVersion: 2` and `_livingContentLawVersion: 2` (executed). That is because Register VII is signed and live: `densityBands.js :: REGISTER_VII_SIGNATURE`, landed with `daed2bf56`. The first count therefore measured **v1** worlds, the law of towns stored **before** that landing, not today's births.
> - The table below is now **today's births (v2)**. The v1 files are kept as `*-v1.*` as the **already-stored** population.
> - The **seats** (who rules, every ruling body, label against priority) are **byte-identical** under the two laws (diffed).
> - What differs is the **roster beside the seat**: the density law removes powers no house stands behind (`rulerKin.js :: settleHouselessPowers`). Craft Guilds stands in 161 towns instead of 504, nobles in 252 instead of 517, criminals in 26 instead of 288. Towns with **no contender at all** rise from 80 to 240 of 900.
> - The `--law v1` switch reproduces the committed v1 output with an identical body (diffed).

**Executed** (every figure is in a file beside this one):
- `node docs/chair/2026-11-20/content/seat/measure-seat.mjs --arm default` (900 towns: 150 per tier, seeds `seat-measure-<tier>-<i>`, config `birthConfig({ settType })`, sliders at the store's default 50) → `count-default.{md,json}`;
- `… --arm presets` (960 towns: the 16 non-neutral Character presets × 10 seeds per tier, config `birthConfig({ settType, ...archetypePatch(preset) })`) → `count-presets.{md,json}`;
- `… --law v1` → `count-*-v1.*`.

0 generation errors in any run. "Contender" is `rulingPowerCoup.js :: coupContenders` on the born record; "kind" is `factionArchetypes.js :: factionArchetype` unless the table says otherwise. **Read, not executed**: every "why".

## THE TABLE (today's births)

Present / rules at birth / one of the three contenders, in towns. Left = default sliders (900); right = the Character presets (960). The last column is the already-stored v1 population at default, present / contends.

| power group (the name it is born under) | present | rules | contends | present | rules | contends | v1 (stored), default |
|---|---|---|---|---|---|---|---|
| **Nobles** (Noble Houses / Families, Landed Gentry, Manor Household) | 252 | 15 read noble; 103 noble-named ¹ | 98 (39%) | 260 | 12; 154 noble-named ¹ | 220 (85%) | 517 / 145 |
| **Craftsmen** (Craft Guilds) ² | 161 | **0** | **2 (1%)** | 247 | **0** | 147 (60%) | 504 / 35 |
| **Labourers** | **0** | 0 | 0 | **0** | 0 | 0 | 0 |
| **Outsiders** (as a class) | **0** | 0 | 0 | **0** | 0 | 0 | 0 |
| Merchants | 485 | 148 | 450 (93%) | 438 | 179 | 345 (79%) | 518 / 454 |
| Military | 452 | **0** | 446 (99%) | 414 | 61 | 356 (86%) | 770 / 710 |
| Clergy | 545 | **0** | 472 (87%) | 413 | 85 | 290 (70%) | 665 / 585 |
| Mages | 207 | **0** | 29 (14%) | 207 | 20 | 74 (36%) | 300 / 31 |
| Criminals | 26 | 0 | 0, excluded by rule | 90 | 22 | 0, excluded | 288 / 0 |
| The civic seat (councils, elders, mayor, reeve) | 682 | 680 | 7 | 584 | 579 | 6 | 682 / 25 |

¹ Royal Authority, Noble / Ducal Governorship and Feudal Stewardship are born only from a noble house's label (`rulingStructure.js :: generatePowerStructure`, `governanceLabelMap`). Every archetype reader reads them as **government**: `factionCategories.js :: inferFactionCategory` files them on *Authority*, *Governor*, *Steward*, and the category wins. `rulerKin.js :: rulingKindOf` is null for them (executed). Only Feudal Appointee reads noble.
² Craft Guilds is born with category `economy`, so the coup weighs it as a **merchant** (0.95). The 0.85 craft and labour factors reach **no** born power. It is counted here by `powerSupport.js :: backingArchetypeOf`.

## THE THREE PLAINEST TRUE SENTENCES (today's births)

1. **Labourers and outsiders are never born as powers, and craftsmen never rule.** Craftsmen stand in 18% of towns at default sliders and contend in 2 of those 161. Nobles stand in 28% of towns and contend in 39% of theirs. Under the presets the contest opens (craft 60%, nobles 85% of where they stand), but neither ever rules.
2. **Raw power and the density law keep them out, not the coercion factor.** The median noble left out sits 1.05 weight below the third contender, and the median craft guild 3.8 below. The factor alone decides 1 of 201 noble cases and 0 of 159 craft cases at default. The density law removes powers no house backs: Craft Guilds falls from 504 towns under v1 to 161, and 240 of 900 towns are born with no contender at all.
3. **No seat is ever won at birth.** It is read off an institution's label in 60% of towns and set by size in the rest. With untouched sliders (all 50), none of the 14 priority councils is ever born, because each needs a top priority above 55. No birth path names a body for craft, labour or outsiders, though the coup's transfer table already does (`rulingPower.js :: GOVERNMENT_PREFERENCES`: Guildhall Council, Workers' Assembly, Foreign Administration).

## The other figures (in the `.md` files)

- **Against the cut** (default; left-out powers in full fields, power ≥ 5; gap = the third contender's weight minus theirs, p10 / p50 / p90):
  - nobles: power 6 / 10 / 23, gap 0.89 / 1.05 / 5.4 (median third 12);
  - craft: median power 9, gap 2.98 / 3.8 / 5.45;
  - presets, nobles: gap 0.5 / 3.42 / 5.5; craft: gap 0.68 / 2.8 / 5.6, and the factor alone keeps craft out in 27 of 100 cases.
- **Institution label against priority** (identical under both laws): label 537 / size-or-priority 363 at default; 582 / 378 under the presets.
- **Ruling bodies born** (identical under both laws): 21 names at default and 33 under the presets, listed in `count-*.md`.
  - **Never reached at default**: every priority council (Military / Church / Merchant / Corrupt / Arcane Council and their city and metropolis forms, Shadow Senate, Arcane Senate, Grand Merchant Senate, High Theocratic Council), Priestly Guidance, Elder Consensus, Grand Guild Council, Guild Authority.
  - **Never reached under the presets**: Elder Consensus, Grand Guild Council, Guild Authority, Town / City / Grand Council.
  - **Named in tables, emitted by no chooser**: Theocratic Council, Corrupt Oligarchy, Shadowed Council, Mixed Council.
- **The field** (default, v2): towns, contenders per town 0:240 1:156 2:94 3:410. Thorps hold 0 or 1 contender, hamlets 0 or 1, villages 1 or 2; towns hold 2–3, and cities and metropolises always 3.
- **By culture**: no culture changes the pattern (per-culture rows in `count-*.md`).

## Where the chair's first reading needs correcting (read; the kind readings executed)

- *"No ruling body exists for nobles as a class, for craftsmen"* — **partly wrong.**
  - `governanceLabelMap` holds noble bodies (`noble governor`, `royal seat`, `lord's steward`, `lord's reeve`, `lord's appointee`) and guild bodies (`guild governance` → Guild Council / Guild Authority / Grand Guild Council; `guild consortium` → Merchant Guild Council / Grand Guild Consortium).
  - They are born only on that institution and never won. All but Feudal Appointee read as government, and the guild bodies as merchant.
  - **True:** no *priority* category exists for nobles or craft, no seat ever reads *craft*, and nothing exists at all for labourers or outsiders.
- *"chosen by tier from the town's TOP PRIORITY"* — **incomplete.** The chooser runs through `rulerKin.js :: drawCouncilOfAKind`, which draws a council of a kind only where an open house of that kind stands. And at default sliders the priority path never fires.
- *"craft and labour 0.85"* — **the table is right, and no born power reaches it** (see ²).
- *"densityAscension.js also sets a governing power"* — **not at birth.** `planSeatAscension` has no importer (unwired). ⚠ My SEAT-MAP said it returns `dormant_law` "under the shipped dial". **That was wrong:** the dial is lit. For a v2 world it would plan, but nothing calls it.
