# REVIEW-UPKEEP-CAPACITY — step 1: every new or reworded line of the stage, read where it prints (COLD)

The reader: REVIEW-UPKEEP-CAPACITY (2026-11-14). The stage: lane/upkeep-capacity-2026-11-13, 8ef42a051..9354d792a, the 16 first-parent
own commits (the three merges, f6e1ad283, e22308d24 and 722dcf408, all merge the DEFENCE lane, and their remerge diffs are empty). This list was
written BEFORE any of the lane's statement files or commit messages were opened.

## Method
- **The stage's own change.** `git diff 6e61d042a 9354d792a` is exactly the stage's own 17 files. 6e61d042a is the defence lane's tip and the second
  parent of 722dcf408, called **DEF** below. So DEF is the tip without the stage, and DEF->tip isolates the stage's own lines. 8ef42a051->tip also
  carries the defence lane's own rewordings (economics and viability), which are another reader's.
- **The diff writes no sentence.** No new or reworded string in any pool, writer or label. `DEFENCE_WEIGHT_REASONS.houseScale` is read by no
  file in src (it NEVER PRINTS). The stage moves defence SCORES (C0 hired-will hold, C1 house scale) and CLASSIFICATIONS: C2 Professional city watch =
  watch only (the defence buckets and `hasGarrison`); C3 Household levy = militia (`hasMilitia`); C4a fabric rows and C4b wayside shrine open no
  clergy; C5 druid ladder (catalogue `successor`); C6 alchemist is not arcane, with `mage` and `scroll scribe` added to the arcane names. So the
  stage's "lines" are every EXISTING line that now prints in a town where it did not, because a band, a flag or a bucket moved.
- **Births.** 972 in all (`probes/.../all.seeds`): the SECOND-WAVE-CENSUS 720 (its own births.mjs shape) plus 252 of our own in the app's shape
  (`selectedStresses`, `selectedStressesRandom:false`). Ours are calm, under_siege, famine, occupied, wartime, monster_pressure and under_siege+famine,
  6 of each at each of the six sizes. Each birth is born at DEF and at the tip, and every surface is rendered by `render5.mjs`: the tabs, Tonight, the
  PDF text, the Foundry journal, the AI prompt and grounding, the register and the world export.
- **The lines.** `plus.py` takes every page line printed at the tip that the same birth's DEF page does not print (a multiset diff). The JSON
  surfaces go to step 3's field diff. 782 of the 972 births move; there are 8,040 added page rows in 7 families.
- **The reading.** Four helper readers took the four large families, each with the readers' scale, the record and the rows, and nothing else
  (`probes/.../CONTEXT.md`, `SCALE.md`). They checked every town by script and at least three by eye; their full tables are under
  `probes/REVIEW-UPKEEP-CAPACITY/`. I checked a sample of each by hand: A on rv5-famine-town-1 and r2s-occupied-town-2, B on r2r-hamlet-21 and
  r2s-under_siege-thorp-2, C on r2r-town-10, D on r2r-city-55. I read F3 and F4 myself, by script.

## The families, and their verdicts
| family | rows / towns | verdict |
|---|---|---|
| F1 readiness label, its why-clause, "Defense posture: X, military score N/100" (overview, defence tab, PDF, Foundry, AI prompt) | 1942 / 604 | label = record in 1942/1942; military score = record; agrees on every surface in all 972 births at tip (agree.py). 14 templates: 7 TRUE, 7 FALSE (below) |
| F2 bands and chips (score bands, "Monster Defense X", substrate rows, power "Defense ±N", legitimacy) + F0 bare figures | 2560 / 705 | every figure = record, 0 cross-surface disagreements; 52 templates: 33 TRUE, 19 FALSE (6 MED, 13 LOW) |
| F3 count chip "Armed Forces & Fortifications N walls N forces ..." | 345 / 345 | TRUE 345/345 = the record's buckets. At DEF the Professional city watch sat in BOTH garrison and watch in 324 births (forces over-counted): the tip CURES it |
| F4 Tonight "Defence ..." force list | 324 / 324 | TRUE: the same houses, reordered (garrison before watch) |
| F5 band-keyed and flag-keyed prose (defence tab, PDF, Foundry, AI prompt, Tonight) | 2299 / 482 (1389 templates) | 14 templates FALSE (3 HIGH, 6 MED, 5 LOW), all others TRUE |
| F6 lines of 22 re-drawn power structures (power, relationships, NPCs, plot hooks, institutions, magic tab) | 570 / 22 | 26 templates: 20 TRUE, 6 FALSE (all carried) |

Why a town's power structure was re-drawn: the roster is identical at DEF and tip in all 22 towns. In each, the readiness label moved one step, and that
step moved legitimacy's defence share (Fortress +10, Well-Defended +7, Defensible 0, Lightly Defended −2, Undefended −8), which moved the bands and the
factions' power. In r2r-city-55 the Thieves' Guild left the powers and Military/Guard came in.

## FALSE lines — THE STAGE'S OWN (false at the tip in towns where DEF printed something true)
1. **HIGH — "Undefended: town walls, held by the town watch."** in r2s-occupied-town-2 and rv5-famine-town-1, and **"Undefended: palisade or
   earthworks, held by the citizen militia."** in rv5-famine-hamlet-1 and rv5-famine-hamlet-5. Kinds c, g: the label denies the walls and force that
   the same sentence names. At DEF all four read "Vulnerable"; the house scale took readiness from 12 to 10 or 11, under the Vulnerable cut at 12.
   The same label prints on four more surfaces in each of these towns (MED twins): "- **Readiness:** Undefended", the bare label on the overview and
   defence tab, "Defense: Undefended", and "Defense posture: Undefended, military score 71/100" (rv5-famine-hamlet-1, whose own Invasion & War bar
   reads Strong). The writer is carried: src/pdf/lib/headlines.js with src/data/bandLadders.js, and the same false label is in 19 other towns at DEF.
   The chair was told at once.
2. **HIGH — PDF beasts line "No perimeter, but the charter hall provides specialist response…"** in 4 towns new at the tip, all with Town walls; in
   r2r-town-27 the same page says "Walls, and a watch to keep them." Kinds b, g. Carried writer: it is false in 7/7 of its towns at DEF.
3. **HIGH — "You can walk into the centre of <T> without being stopped…"** in r2s-politically_fractured-town-0, which is walled, and whose own tab says
   "Everyone comes and goes by the gates." Kind g. 1 of its 10 new towns. Carried: 5 DEF towns.
4. **MED — "Monster Defense Critical" / defence tab "Critical ▼" / PDF "Critical"** where the page says the beasts are answered:
   - in 11 towns (all new) beside the charter hall "Effective for monster incursions", e.g. r2r-hamlet-21 (monster 41→19; its only house is the
     Adventurers' charter hall);
   - in 9 new towns beside "there is a wall to hold and there are people to hold it", e.g. r2r-hamlet-6 (33→17);
   - in r2r-town-38, Barracks and a Town watch in quiet heartland (39→16).

   Kind g. 13 such towns carried at DEF.
5. **MED — "Invasion & War: Strong"** in 3 besieged thorps of 6–9 people whose only force is a Household levy: r2s-under_siege-thorp-2 (population
   6, Palisade + Household levy; military 49→71), the Household levy counting as a militia (C3). Kind d.
6. **MED — "…the town keeps no wards or seers that would notice if it had" / "conventional throughout"** in 10 of 55 new towns. Their own PDF
   Arcane Support says "Detection, wards, counterspell". In r2r-town-10 the record has a Scroll scribe and `hasArcane: true`; at DEF the same
   paragraph said "The town keeps arcane provision in its defenses". Kind g. A C6 consequence (2 carried at DEF). The headline suffix "It leans on
   magic to hold" prints in 32 of these 55 towns and is false where Arcane Support is None (LOW).
7. **LOW — r2r-city-55: Military/Guard "A slow war with the guild: arrests are made, the gangs rebuild"** (power tab, PDF, Foundry) where the tip
   has no Thieves' Guild power (re-drawn out).
8. **LOW — "only a palisade and a citizen militia"** in r2r-hamlet-27 (1 of 25). Band-keyed LOWs in towns new at the tip: Monster Critical beside
   "barely keeping up" (15 towns); Internal Critical despite a watch or garrison (10); Internal Strong beside "cannot enforce" (12); Invasion & War
   Strong in small levy thorps (9); Economic Resilience Weak where Prosperity is Prosperous (2); Law & order Critical in calm hamlets (9; 62 carried).

## FALSE lines — CARRIED (the template is false at DEF too; the stage moved which towns print it)
- MED "no walls; the barracks is all that stands guard" beside a Town watch (r2r-town-19, r2r-town-38, r2s-politically_fractured-town-2,
  rv5-famine-town-0, rv5-under_siege+famine-town-2); "the town watch is all that stands guard" beside a Free company hall
  (r2s-monster_pressure-town-2). Identical at DEF.
- MED "…could not hold off a raid" beside its own "credible against raiders" (r2r-thorp-25, r2s-plague_onset-thorp-1, r2s-wartime-town-0; 8 at DEF).
- MED "…would take real effort to threaten" while occupied or besieged (rv5-occupied-city-1, rv5-occupied-metropolis-0,
  rv5-under_siege+famine-metropolis-5; 19 at DEF).
- MED "Wild country all round and nobody organised to meet it" beside an adventurers' charter hall (10/10; 15 at DEF).
- MED money lines in Prosperous towns: "defenders already paid late", "already owed", "short of money for years" (r2r-hamlet-59,
  r2s-succession_void-village-1; 15 at DEF).
- MED "Internal Security Strong" beside "Desperate/Dangerous/Critical" in the same row, e.g. r2r-metropolis-14 under siege (12 of 13 carried).
- MED "Governance fractured." beside "Stability: Stable" (r2r-town-19; 10 DEF towns).
- MED/HIGH catalogue count ranges printed: "Merchant guilds (50-100+) · … fronts for Thieves' Guild" (r2s-slave_revolt-metropolis-3; 98 DEF towns),
  and "Butchers (3-8)" on the NPC tab (r2r-city-55).
- LOW "all but undefended" while besieged with a watch (2), "reads as a defended place from the road in" while besieged (2), "decisions… made by
  Religious Authorities" under occupation (r2s-occupied-town-2), and 3 power LOWs (D-power.result.md). The legitimacy breakdown printing "# Defense"
  points (kind h, the machinery) is in every town at DEF; the stage changed only the digit.

## TRUE, and NEVER PRINTS
- TRUE: every readiness label and figure against the record; every count chip; every Tonight list; "no walls and no one under arms" (40/40); the
  levy-as-militia lines in all 37 levy towns; 83 of the 87 readiness drops (hamlets and villages that lost the clergy points of a church they walk
  to, or of a shrine); "strong/weak defences" cause words in all 22 re-drawn towns; all 179 re-drawn relationship pairs.
- NEVER PRINTS: `DEFENCE_WEIGHT_REASONS.houseScale` (no reader in src). C2's watch-only garrison prose: no town of the 972 has a Professional city
  watch without another garrison house, so `hasGarrison` moved in none (the field diff agrees: `economicState.compound.inst.hasGarrison` moved in
  0 births). C5: no roster moved in 972 births (the druid ladder changes scores only here).

## Totals of step 1
Rows read: 8,040 (F0–F6) in 782 moved births. FALSE at HIGH or MEDIUM where the stage is the cause (the stage's own instances): rows 1–6 above:
6 templates, 43 town-instances (4+4+1+21+3+10). FALSE at HIGH or MEDIUM carried (false at DEF too): 9 templates.
