# REVIEW-AGREE-3 — the agreement lane at faa20bc6c, a third independent review (2026-11-13)

Lane read: `lane/coherence-agree-2026-11-11` at `faa20bc6c` ("the tip"). Its base: `lane/integration-2026-11-07`
at `3575cf061` ("the line"; the merge base, 129 commits behind the tip). The reviewer changed nothing on either.

(The verdict is at the end, under STEP 9. Step 1 below was written and committed before any review, hand-back or
record of this lane was read.)

---

## STEP 1 — COLD, AS THE OWNER READS IT (written before any review was read)

### How the pages were made

Both trees birthed and rendered by the second-wave census machinery (`origin/lane/second-wave-census-2026-11-12`,
`census.sh`, unmodified): every dossier through the tree's own `OutputContainer` as the owner (premium, not
read-only, public prose stamped), every group and sub-tab clicked and every disclosure opened. 720 births per tree
(`seeds.txt`: 6 sizes x 60 with every dial random, plus 15 forced crises x 6 sizes x 4), 0 birth errors, 720 dumps
each, both runs exit 0. From those I READ forty towns side by side, line against tip: the Economy tab (income,
trade profile, produced locally, food security, the flow cards), Resources, Defense, Services (healing),
Overview/Crisis and Outlook. The forty seeds, chosen from the corpus table for coverage:

- by access, one of each size: river `r2r-thorp-0 r2r-hamlet-18 r2r-village-35 r2r-town-3 r2r-city-8 r2r-metropolis-8`;
  port `r2r-thorp-24 r2r-hamlet-1 r2r-village-2 r2r-town-4 r2r-city-2 r2r-metropolis-10`;
  crossroads `r2r-thorp-2 r2r-hamlet-0 r2r-village-6 r2r-town-13 r2r-city-4 r2r-metropolis-3`
- on the mountains, keeping a pass: `r2r-thorp-16 r2r-thorp-32 r2r-hamlet-42`; gaining one: `r2r-village-17`;
  mountain, no pass: `r2r-city-46`, `r2r-village-0` (isolated)
- off the mountains, the pass taken away: `r2r-hamlet-9 r2r-village-1 r2r-town-2 r2r-city-0 r2r-metropolis-1 r2r-thorp-6 r2r-thorp-17`
- crises: siege `r2s-under_siege-village-0 r2s-under_siege-town-0 r2s-under_siege-city-0`; famine
  `r2s-famine-hamlet-0 r2s-famine-town-0 r2s-famine-metropolis-0`; `r2s-plague_onset-town-0`, `r2s-wartime-city-0`
- isolated: `r2r-thorp-9`

### What the tip's page gets right that the line got wrong (read, and then counted on all 720)

- **The toll's name on the Economy tab.** The line's river and port towns carry a flow card "Strategic Crossroads
  Toll — From Strategic Crossroads" (village-35, village-2, town-3, city-8, city-2, metropolis-8/10). The tip prints
  "River Toll — River traffic" and "Harbour Dues — Harbour traffic". On the tip the toll chain stands only on
  crossroads (54), port (33) and river (54) towns; it is gone from road towns (city-0 and others).
- **The pass.** The line put a Defended Pass (and with it "Mountain Pass Control", "controls mountain passes") in
  132 of 720 towns off the mountains (hills 57, forest 27, plains 26, desert 13, riverside 9). The tip: 0 of 720
  pages off the mountains name a pass; all 29 tip pass-holders are mountain towns. The replacement resource is drawn
  from the pool (an Ancient Grove most often, iron, a managed forest), and the town's exports and produced-locally
  follow it (hamlet-9, village-1, thorp-6: "Sacred wood, Ritual components").
- **"Crossroads Position" off a crossroads.** The line named it in road towns (city-0, village-17, the siege village,
  the famine metropolis); the tip drops it with the toll that stood on it.
- **Income lines that said a surplus or local ore the town lacked** are re-worded where the record contradicts them
  ("Grain Sales … it eats more than it grows, so none is left to sell" in metropolis-3, city-0; "Iron imported" where
  there is no ore).

### What the tip's page still gets wrong — the list

T1. **The catalogue's toll name still prints off a crossroads — on the NPCs tab.** In 12 of 720 tip pages (all river
or port towns) an NPC's "Wants" line reads, for example (r2r-city-8, World/NPCs, the innkeeper Sükhbaatar Yorqin):
"Wants Take on more hands for Strategic Crossroads Toll at the coaching inn, and keep them busy all season."
Others: metropolis-8/16/46/49, town-29, famine-metropolis-3, insurgency-city-0, monster_pressure-city-0/3,
politically_fractured-city-1, slave_revolt-city-1. The stored record carries it in `npcs[].goal.short` (12 towns)
and `npcs[].goal.long` (17 towns), and `goal.short` also prints on the Summary tab, the tonight sheet, the session
view and the PDF's NPC section. Source: `src/generators/people/goals.js:431,433` fills `{chain}` from `ch.label`.
The line had it too (and everywhere else); the tip cured every other surface but this one.

T2. **A timber income line that says the timber is worked, beside "No one here works the timber" — made by the
tip in towns whose resources did not change.** r2r-thorp-32 (mountain, keeps its pass, same resources on both
trees): line "Timber Trade — Timber sourced from more distant forests …" (true: nobody works the timber); tip
"Timber Trade — Local forest provides sustainable timber revenue; managed felling and sawmilling keep production
consistent." beside, on the Resources tab, "Unexploited Mountain timber" and "No one here works the timber near
Hochsee." Cause: `src/generators/economy/economicState.js` (the Timber Trade desc) now gates on
`hasNearbyResource('managed_forest', 'timber')`, and the substring `timber` takes `mountain_timber`, worked or not.
Over 720: the pair "managed felling" + "No one here works the timber" stands in 51 tip pages and 51 line pages, but
9 towns enter and 9 leave; 6 of the 9 entrants (city-20, city-46, metropolis-38, thorp-32, town-12,
religious_conversion-thorp-1) have the same resources on both trees.

T3. **The coal line in towns with no forge.** "Iron & Metalwork — Local coal fires the forges, but the iron is bought
in" (a sentence the lane wrote, `LOCAL_COAL_LINE`) prints where the roster has no smith, forge, smelter or
metalworker (thorp-2, village-6, thorp-16 among the forty). On the line the same towns said "Local ore feeds the
smithy directly" — also false (no ore), and also with no smithy. The tip's sentence is truer about the ore and as
false about the forge. 52 towns enter this pattern, 51 of them leaving the "local ore" one.

T4. **Two store durations, newly disagreeing, in towns whose resources did not change.** r2r-thorp-37: "No granary;
two months in household stores." beside, on Defense, "household stores carry the thorp for about three months at
full rations" (line: two and two). r2s-famine-city-3: "a granary of eight months" beside "the granary would carry
the city for about nine months" (line: seven and seven). The cause is the tip's food record: a herd now counts as a
food source (thorp-37 `foodSecurity.activeChains` [] → ["Pastoral & livestock"], `storageMonths` 1.5 → 1.8), and
the two sentences round the one number differently. The mechanism stood on the line (561 of 720 line pages show
two durations); the tip moves the number and 10 more towns show it.

T5. **The gate tally beside the tip's no-gate sentence.** r2r-village-6 and r2r-hamlet-18 (palisade or earthworks):
the tip now says (Services) "The walls leave few ways in, so smugglers have to get past the citizen militia" — a
twin the lane wrote for walls with no gate of record — and drops "You come into X by a gate" from Defense, yet
Defense still prints "X is walled, and every arrival goes through a gate and into the gate tally". The kept
sentence is pool `walls PRESENT` vid 2, `src/data/dossierStateProse/defense.generated.js:3653`, marked `colour`,
not `gate`, so the gate filter does not see it. Over 720: "gate tally" and "few ways in" on one page, line 0, tip
22. The gate-tally sentence stood on the line; the no-gate sentence beside it is the tip's.

T6. **"What the land offers" says less.** The tip filters the terrain's strengths by the town's own resources
(`STRENGTH_SUPPORT`). 80 of 720 tip pages lose "✓ Agriculture" that the line printed; 38 of those 80 earn
Agricultural Rents ("Payments in kind or coin from tenant farmers") — village-35 earns 92% from it, feeds itself
(389 lbs/day against 360) and the tip's land "offers" only River trade. In town-3, siege-town-0 and city-0 the
"What the land offers" heading disappears entirely. A thorp in a forest no longer "offers" timber (true: it holds
none). Mostly truer; where the town lives by tenant farming, less.

T7. **Labels that move toward danger, read on the forty.** Only r2r-city-46 moves a label (Well-Defended →
Fortress, Approved → Endorsed: toward safety). On all 720 there are 8 danger-ward moves in 7 towns: readiness
Vulnerable → Undefended (village-22, wartime-village-3), Defensible → Lightly Defended (town-42, insurgency-town-1),
Well-Defended → Defensible (politically_fractured-town-1); legitimacy Tolerated → Contested (village-22);
prosperity Comfortable → Moderate (hamlet-20); food Import-Dependent → Deficit (under_siege-city-3). Six of the
seven are towns whose pass or crossroads position the tip took away (the refill re-draws what follows). The
seventh, politically_fractured-town-1 (a port, same resources), loses "a mercenary company provides enforcement"
because its roster holds a Hireling hall and no company: military 79 → 65, readiness 55 → 53. A reader can give
that reason; it is the defence home's answer.

T8. **Crisis tension re-drawn.** In r2s-under_siege-village-0 the Overview's food tension ("Settlement cannot cover
~230 lbs of food per day (41% of needs)") gives way to a sickness tension; the food deficit still prints on the
Economy tab and in the Outlook. A re-draw from the resource change (the pass and crossroads position became iron
and marshland), not a fault.

What I did not find on the forty: no flow card, export or produced-locally line on the tip names a pass or a
crossroads position the town lacks; no healing line changed; no "Strategic Crossroads" on the Economy tab of any
non-crossroads town.
