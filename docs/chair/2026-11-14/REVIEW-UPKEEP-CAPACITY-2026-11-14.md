# REVIEW-UPKEEP-CAPACITY — the capacity branch read as its own stage (2026-11-14)

The reader: REVIEW-UPKEEP-CAPACITY (session_01ACmDYWmiYNcoehQuRbX7vV). The lane: lane/upkeep-capacity-2026-11-13, read at **9354d792a**; the
tip did not move. The stage: 8ef42a051..9354d792a, the 16 first-parent own commits. **DEF** = 6e61d042a (the defence lane's tip, merged at 722dcf408)
is the tip without the stage: `git diff 6e61d042a 9354d792a` is exactly the stage's 17 files. Probes: `probes/REVIEW-UPKEEP-CAPACITY/` (README).
Step 1, the cold list: `REVIEW-UPKEEP-CAPACITY-LINES-READ.md` (pushed at d35305020, before any statement was opened).

## VERDICT: **NOT CLEAR** for lane/upkeep-capacity-2026-11-13 at 9354d792a. Three HIGH findings are the stage's own instances on carried
writers (H1–H3, 9 towns). Seven MEDIUM findings are the stage's own (M1–M7). The cures themselves mostly hold (step 2), the gates are green, the
plants red, no kind of census2 rises, and no new key enters the record.
**The one thing the chair must rule:** the house scale, as built, can LOWER a town for holding the very house the owner named (M4: adding an
Alchemist shop lowers economic in 125 of 972 births, and a quarter can read below a shop, M6). A house off any ladder counts more than the least rung
of its part's ladder (a first-level healer above a small hospital). Is anchor B (ruling 3) with off-ladder houses at 1.0, and G5 (ruling 11) under
limit 1, what the owner asked for?

## Findings, ranked (EXECUTED unless marked PLAUSIBLE; OWN = the stage's own, CARRIED = false at DEF/base too)
### HIGH
H1 OWN instances, CARRIED writer (src/pdf/lib/headlines.js + src/data/bandLadders.js). "Undefended: town walls, held by the town watch." prints in
   r2s-occupied-town-2 and rv5-famine-town-1, and "Undefended: palisade or earthworks, held by the citizen militia." in rv5-famine-hamlet-1 and
   rv5-famine-hamlet-5. Each roster holds those walls and that force. At DEF all four read "Vulnerable"; readiness fell 12→10/11 under the house
   scale. The same label prints on four more surfaces in each town; one twin is "Defense posture: Undefended, military score 71/100". The same writer
   prints it falsely in 19 other towns at DEF.
H2 OWN instances, CARRIED writer: the PDF line "No perimeter, but the charter hall provides specialist response…" prints in 4 towns with Town walls.
   In r2r-town-27 the same page says "Walls, and a watch to keep them." It is false in 7/7 of its towns at DEF.
H3 OWN instance, CARRIED writer: "You can walk into the centre of <T> without being stopped…" prints in r2s-politically_fractured-town-0, which is
   walled ("Everyone comes and goes by the gates").
### MEDIUM
M1 OWN: "Monster Defense Critical" beside the charter hall "Effective for monster incursions" in 11 towns, e.g. r2r-hamlet-21 (monster 41→19), and
   beside "there is a wall to hold and there are people to hold it" in 9, e.g. r2r-hamlet-6 (33→17). r2r-town-38, with Barracks and a Town watch,
   falls 39→16.
M2 OWN: "Invasion & War: Strong" in besieged thorps of 6–9 people holding only a Household levy (r2s-under_siege-thorp-2: population 6; military
   49→71; C3).
M3 OWN: "…the town keeps no wards or seers" / "conventional throughout" in 10 towns whose own PDF Arcane Support says "Detection, wards,
   counterspell" (r2r-town-10: a Scroll scribe, `hasArcane: true`). At DEF: "The town keeps arcane provision in its defenses" (C6).
M4 OWN, the stage's law refuted: **"adding a house never lowers a score it feeds" is FALSE**, and for the owner's own example.
   - Adding an Alchemist shop lowers ECONOMIC (a score the alchemists part feeds) in 125 of 972 births at the tip, against 37 at DEF. r2r-village-0
     falls 38→21; at DEF the same shop left it at 38. The mechanism: after C6 the shop opens only SUSTAINS parts (magic), so limit 1 ("Stores and
     supply can carry no more than the force can use") binds and cuts economic.
   - Enlarging an Alchemist shop to an Alchemist quarter lowers economic in 5 births (r2r-town-38: 75→74).
   - Enlarging a Small hospital to a Major hospital lowers economic in r2s-infiltrated-town-2 (58→57).

   **"A larger house never counts for less than a smaller one of its kind"** holds on its own ladder by construction, but across the houses of one
   part it fails by the ladders' design (`ladders.tip.txt`): a house on no ladder counts 1.00 and a ladder's least rung 0.80. So a village's "Healer
   (divine, 1st level)" (1.00) outweighs a town's "Small hospital" (0.80); a "Fish market" (1.00) outweighs a "Market square" (0.80); a "Hireling
   hall" (1.00) outweighs an "Adventurers' charter hall" (0.80); and a "Monastery or friary" (1.00) outweighs "Parish churches (2-5)" (0.93). The
   carried limit-1 falls (adding a Healer, a Monastery or a Small hospital lowers economic) stand at DEF too: 178, 89 and 53 births.
M5 OWN (C6's replacement): "Arcane Support: Present" beside an EMPTY "Arcane defense" list. 23 births at DEF, 33 at the tip, e.g. r2r-city-0,
   r2r-city-19, r2r-city-41. The statement counts 4, "all Teleportation circles"; ours include a Scroll scribe, an Enchanter's shop and a dragon,
   and 3 still carry the arcane tradition. Kind g. The chair's ruling 12 sends G5's display line to the display lane; I would not clear the stage
   with it open (M3 is the same cause).
M6 OWN, a statement claim not borne out: C1 on the owner's own example. In Ioannoakra the shop and the quarter both read 28 on readiness, and the
   quarter reads LOWER on Economic (30 against 31). Across 158 alchemist holders, size shows on readiness in 76 and in no rating at all in 82. The
   eight-towns file explains Ioannoakra's 31 against 30 truly, but the owner's request ("a single alchemist should not have the same influence as
   an alchemist district") is met in fewer than half of the towns that hold one.
M7 OWN, undeclared draw moves: the NPCs are re-drawn whole in 8 births, the relationships in 8 and the conflicts in 5, following the power re-draws
   (ruling 13 declares the politics, not these). The statement also names no surface of tests/fixtures/.golden-freeze-register.json as moved or
   unmoved ("no golden's door opened").

### LOW
L1 OWN: the house scale's behaviour is guarded only by the literal pin of the tuning row (plant P1: least = greatest = 1 reds one test). The
   "1.2 against 0.8" and "1.5 times" guards compute their ratio from the same table.
L2 OWN: r2r-city-55's re-drawn Military/Guard says "A slow war with the guild: arrests are made, the gangs rebuild", but the tip has no Thieves'
   Guild power.
L3 OWN: band-keyed LOWs in towns new at the tip (LINES-READ row 8).
L4 CARRIED: Monastery → Multiple monasteries loses the clergy part, because 'monastery' is not a substring of 'monasteries' (DEF too).

## What the stage cures (cold, before its statement)
- The Professional city watch was counted in both garrison and watch at DEF in 324 births (the forces chip over-counted); the tip lists it once.
- The levy reads as the thorp's militia on every home (37 levy towns: true).
- 83 of 87 readiness drops read true (hamlets that walk to another's church, or keep a wayside shrine, lose the clergy points).

## Steps 3–8 (measured)
- **2 THE STATEMENT** (read after step 1 was pushed; `probes/.../S.result.md`; 38 of its towns born at base, DEF and tip).
  - Cures: C0 cured and true (military above its watch counterfactual in 13/25 hired-only births → 0). C2 cured and true (chip 324 → 0; removed
    lines: chip 0/30 true, "held by the professional city watch" 30/30 true). C3 cured (37/37), but M2 is still false. C4a and C4b cured and true
    (296 walk/shrine places, clergy 0). C5 cured by silence (no roster moves). C6 cured (alchemist in the list 158 → 0; removed lines 0/30 true),
    but its replacement is false (M3, M5). C1 is cured in part (M6).
  - Headline counts as rates on our 720 (base→tip) agree: readiness 78.2% / 77.6%, bands 14.4 / 14.3, power re-drawn 12.8 / 12.2, gain/lose a
    power 0.19 / 0.14, AI threats 8.2 / 8.9. Three disagree: supply moved 35.7% (ours 26.5%) and supply bands 3.0% (ours 4.7%); arcane closes in
    quarter cities 25/525 (ours 0/137); and one birth loses "Economic fragility", which the statement does not mention.
  - EIGHT TOWNS: every before/after figure and every "why" reproduces (0 false). Doubtful (LOW): Hongshan, 13 people, "would see off raiders".
  - The stage's claims: "higher readiness in 299, never lower" for the alchemist swap is true on readiness, but military is lower in one. "A
    barracks counts for less than a garrison" holds on the part, but our renames lower a score in 68 (M4). It makes no "adding never lowers"
    claim; the brief's monotonicity claims are refuted at M4.
  - Rulings (15, in the statement): I would rule differently on 3 (anchor B: place off-ladder houses by their size, not at 1.0), 11 (G5 under
    limit 1: a trade's SUSTAINS part should not crowd out economic, M4), 12 (the C6 display lines are false now, M3/M5: land them with the
    stage) and 13 (declare the NPC, relationship and conflict re-draws, M7). I agree with the other eleven.
- **6 the reds' classing:** proseWiringCensus.walker (4 red) and negativeAssertionAnchor.walker (2 red) are red at the tip and at DEF with the same
  titles, and green at the base 8ef42a051: CARRIED from the defence lane, as the statement says. defenceDerived.walker is green at all three.
- **7 CENSUS-2** (census2.sh, 720 births, --files the stage's 7 src files). Base → tip by towns: a 712→704, b 70→70, c 291→283, d to g unchanged.
  NO kind rises. The stage's files show the same hits at both (the catalogue's 134/3/1, the defence lane's descriptions).
- **3 THE LAWS (field diff, fielddiff.mjs).** DEF→tip over 972 births moves: defenseProfile 782, powerStructure 126, simulationTrace 122,
  economicState 42 (compound.inst.hasMilitia 37 = C3; safetyProfile.guardEffectivenessDesc 5), activeConditions[].severity 29, npcs 12 (8 re-drawn
  whole), relationships 8, conflicts 5, stress/stressors cast 6. No roster moves. **No new key** (keysOnlyTip 0). One key gone,
  `defenseProfile.institutions.magicDef[].factionSource` (the alchemist rows, C6). Base→tip over the census 720: economicState 620 (the defence
  lane's own), defenseProfile 581, powerStructure 88; no new key. No vocabulary file is touched; the stage writes no stored sentence of its own.
  The NPC, relationship and conflict re-draws are DRAW MOVES: they follow the power re-draws (see step 2 for whether they are declared).
- **4 PLANTS (plant.sh, plants/P*.log; 7 guard files, 80 tests, P0 80/80 green).** Every plant reds on its own fault: P2 (Professional city watch
  back in garrison) 6 red; P3 (levy) 3; P4 (fabric) 6; P5 (shrine) 4; P6 (druid successor off) 2; P7 (alchemist arcane again) 6; P8 (will cut
  off) 5; P9 (alchemist back in the bucket only) 4. P1 (scale off) reds only the pin (L1). No guard covers the prose consequences of C2/C3/C6:
  the guards read flags, buckets and parts, not the lines of M1–M3.
- **5 THE MERGES.** f6e1ad283, e22308d24 and 722dcf408 all merge the defence lane, never the integration line, and their remerge diffs are EMPTY
  (no hand resolution). The stage's register files re-derive through their own doors at the tip: tuningRegister.walker,
  wiringCensusDeclared.walker and recordRegisterTotality.walker all exit 0.
- **6 GATES at the tip, my own run** (`sh scripts/gate-tail.sh`): typecheck:ratchet 0 (167/167); typecheck:domain:strict 0 (1113/1113); eslint on
  the 14 touched files 0; the 7 governing test files 80/80.
- **8(a) THE WALKER 1dac1ca25.** The one loosening is the named candidate magicDef. The list is pinned at one name, and P9 reds A7 the moment
  the evidence returns. For every other case an old red is still a red: distinct sums over member sets are a subset of the sums over samples.
  Not loosened beyond its declared row.
- **8(b) MONOTONICITY (mono.mjs, 972 births per tree, the record otherwise untouched):** refuted, M4.

## What I did not measure
- The whole suite in shards (only the governing files, the named walkers and the plants' 7 files, at tip, DEF and base).
- Births beyond 972 (the statement's 3,756 checked as rates on our 720).
- The golden-freeze register's surfaces one by one: the statement names none, and I sampled none (M7).
- The world-export and grounding JSON surfaces, beyond the field diff (step 3).
- Contexts the census shapes do not reach: user-added custom houses (the arcane keyword 'mage' matches by substring, so a custom
  "Pilgrimage …" house would open arcane: PLAUSIBLE, not tested).

**Lines I would strike, for the owner's veto:** the readiness label "Undefended" where the roster holds walls and a force (H1: hold the label at
Vulnerable while the why-clause names a force); "No perimeter, but the charter hall…" beside walls (H2); "no wards or seers" and "Arcane Support:
Present" beside the opposite (M3, M5).

**Counts:** HIGH 3 (all the stage's own instances, carried writers); MEDIUM 7 own + 9 carried templates (LINES-READ); LOW 4 own + carried LOWs.
EXECUTED: all of them except the custom-house note (PLAUSIBLE).
