# REVIEW-UPKEEP-2 — the derived defence, `lane/coherence-upkeep-2026-11-12` at 73b1304de (base 69b53decd)

> The second independent review of the upkeep lane, on the derived form only. The reviewer changes
> nothing on the lane and cures nothing. §1 is the cold list, committed and pushed before the builder's
> hand-back, measure file, build report or commit bodies were opened.
>
> One disclosure: fetching the lane printed `git log --oneline` subjects of its last fifteen commits in
> my context before §1 was written (one line each, no bodies). Nothing else of the builder's was read.

## VERDICT: NOT CLEAR (written after §1 was pushed at cd963f26b)

**The arithmetic is the design.** On my 1,200 births the parts sum exactly to the score (1,200/1,200),
a record stripped of its profile recomputes equal (300/300), the band is read from the score as stored
(0 disagreements), each score is full at 100 in one line, prosperity scales each paid part once from the
standing label (0 misses), limit 1 bites only where what sustains exceeds the force (23/23) and limit 2
bites on a plant and only on one (54 of 82 planted records; the 28 others are small places whose armed
households man the wall). A saved town as master stored it does not move on any defence surface.

**What stops it.**
- **HIGH — the pages contradict the new ratings about money (H1, H2): 246 of my 960 crisis births**
  (every one a crisis birth; mostly cities and metropolises) say on one page that the place is Struggling,
  or that its hired swords are paid "from what the hunger leaves", and that it "can pay its way" or has
  "money enough to ride out a long crisis". The score pays at a standing label that no page prints, while
  the guard lines, the magic tab and the services read the printed one. R3's "the page says both labels
  where they differ" is not built.
- **MEDIUM — a crisis acts twice on order, and wartime acts at all (§2, C6):** every famine, siege and
  wartime birth's Crime part grows through the crisis multipliers inside `getInstFlags`'s criminal reading
  (famine ×1.35, siege ×1.25, wartime ×1.2), outside the crisis table: 120/120 measured, mean −0.6 to −1.2
  readiness points. R4 says wartime takes from no part in this release.
- **MEDIUM — count once fails for every magic house (§2, C5):** a wizard's tower, mages' guild, alchemist,
  grove or divine healer is counted under its own part AND under the magic part (51 of 300 births; an
  alchemist shop under three).
- **MEDIUM — the machinery is in the export (§3):** the world export, player and DM, carries
  `defenseProfile.parts` (labels such as "Martial will", "Walls with no one to man them", and every
  part's points) on 1,200/1,200 births. The walker's fifth arm cannot see it (a planted whole-profile
  serialisation stays green); its second arm misses the codebase's own random sources (`getActiveRng()`,
  `createPRNG(seed)()` planted in the generator stay green).
- **MEDIUM — M1 to M5 of §1:** an untroubled posture under an active siege (41 made at tip), "nobody on
  the walls" under a Strong bar (19 made at tip), "no line and no force" under Adequate (8), "hired swords"
  with none hired (7), "all but undefended" beside kept walls and a watch (8 made at tip).

**Counts by rank (findings, not births):** HIGH 2 · MEDIUM 9 · LOW 7. Executed vs plausible: every finding
below is EXECUTED on my births or by a plant, except the one marked PLAUSIBLE (§2, C7's reading of the will).

**The one thing the chair must rule:** which label the PAGE speaks for in a crisis. Either the page prints
the standing label beside the printed one (R3, as ruled, and then the guard lines, the magic tab and the
services read the one label too), or the defence lines that read the paid score are keyed to the printed
label. Until one label speaks, every besieged or starving city reads both rich and poor.

**Not measured:** F3 (the held granary; the sixth seat's), the census, the whole suite, the goldens, the
edge bundles; the kind of wall and wartime (not in this tree); a user's edited town (only births and
master-stored records); the Foundry module beyond its journal pages; the AI layer's live output (only
its prompt and grounding payload were read).

## §1 — COLD: every false or contradictory sentence, on births the builder did not measure on

**The births (mine).** Seeds `rv2-<crisis>-<size>-<i>`, crisis ∈ {calm, famine, under_siege, wartime,
succession_void}, size ∈ the six, i = 0..39: **1,200 births**, each born in the app's own shape:
`birthConfig({ ...DEFAULT_CONFIG, settType, selectedStresses: crisis === 'calm' ? [] : [crisis],
selectedStressesRandom: false })`, `generateSettlementPipeline(config, null, { seed, customContent: {} })`.
Every forced crisis took (240/240 each); 4 calm births carry a derived stress.

**How they were read.** Every birth born at both trees (detached scratch worktrees at 69b53decd and
73b1304de). Every surface rendered by the repo's own soak harness
(`scripts/audit/soak-review/renderHarness.mjs :: renderSurfaces`: the twenty dossier tabs, the Tonight
sheet, the PDF's text, the Foundry journal) plus the AI layer prompt
(`aiLayer.js :: buildAiLayerPrompt(extractFullContext(s))`), the grounding payload
(`aiGrounding.js :: assemblePromptSections`) and the world export, player and DM
(`worldExport.js :: buildWorldExport`). 2,400 dumps, no render errors.
- **42 towns read by eye**, base beside tip (`cold.seeds.txt`): the largest rise and fall of each crisis,
  every two-band move, each size walled and open, with and without a garrison, and the calm of every
  size. Their rating, band and parts are in the table at the end of §1.
- **Each sentence class found by eye was then counted over all 1,200** with `classes.py`, base and tip,
  and split into *made at tip* (the town prints it at tip and not at base) and *already at base*.

**The movement (my 1,200).** Mean change of the readiness score, tip − base: calm +1.4, famine +8.7,
siege +10.7, wartime +2.8, succession void +0.7. Band moves of two: 17, all up, every one a crisis birth
(1 famine, 16 sieges). Biggest: `rv2-under_siege-metropolis-25` Defensible 53 → Fortress 81.4 (+28.4);
`rv2-succession_void-town-33` Vulnerable 23 → Undefended 4.3 (−18.7).

### The root of the two HIGH classes (stated here because both rest on it)

The score now pays every part at the STANDING label (`economicState.prosperityStanding`, the label with no
crisis in force). **No surface prints the standing label.** In every siege and famine birth I read the
page says the place is **Struggling** (Overview, Economics, PDF, Foundry, the Viability verdict), and
the defence lines that read the score now say it can pay. Meanwhile the guard lines, written earlier in
this lane, read the PRINTED label and say the purse is short. So the same page tells the reader both.
(The chair's R3 asked that "the page says both labels where they differ"; ruling 328 kept that line. It is
not on any page: `grep prosperityStanding src` finds no reader outside the generator.)

### HIGH

**H1 — "can pay" beside the page's only prosperity label, "Struggling" (177 births at tip; 43 at base; 136 made at tip).**
Famine 83, siege 80, wartime 14; cities 77, metropolises 80, towns 20.
- `rv2-famine-city-39` (Jayakund; Defensible 49 → Well-Defended 72.2): Economic Survival **Strong**,
  *"Trouble at Jayakund has not turned into a collapse, because the city can pay its way through it."*;
  PDF *"Money enough to ride out a long crisis: emergency measures can be paid for, and the garrison kept
  paid while it lasts."* — beside **"Prosperity: Struggling"** and, in the same tab, *"No one can earn a
  normal living while the famine lasts, and every coin goes on food."* At base the PDF said *"Money
  enough for a short crisis; a long siege would start eating the reserves within months."*
- `rv2-under_siege-metropolis-25` (Izambalam; Defensible 53 → **Fortress** 81.4): Economic Survival
  Weak → **Strong**, the same "can pay its way" line, PDF "Money enough to ride out a long crisis" —
  beside *"Struggling. In Izambalam … the talk is all of the siege … It may not survive as it stands."*
- `rv2-under_siege-city-27`, `-city-1`, `-metropolis-10`, `-metropolis-26`, `rv2-famine-metropolis-13`:
  *"Serrafossae's accounts have money in hand: the city can keep its defenders paid and buy what a bad
  season needs without going begging"* / *"The metropolis could go through a bad season with its
  arrangements intact"* — each beside "Struggling".

**H2 — the guard line says the purse is short, the score's lines say it is full, on one page (192 births at tip; 0 at base).**
Wartime 71, famine 59, siege 61; metropolises 110, cities 79. Every one on BOTH the tab and the PDF.
- `rv2-famine-city-39`: Guard assessment *"Hired swords back the garrison, paid from what the hunger
  leaves."* → three lines below, *"the city can pay its way through it"*; PDF *"the garrison kept paid
  while it lasts."*
- `rv2-under_siege-metropolis-10` (Jayavaram, Fortress 77.8): *"Hired swords back the garrison, paid
  from what the hunger leaves."* beside PDF *"Money enough to ride out a long crisis … the garrison kept
  paid while it lasts."*
- Wartime (72 of the 192): *"Hired swords back the garrison when the purse allows."* (printed label
  ≤ Comfortable) beside *"The city could go through a bad season with its arrangements intact"* (standing
  Prosperous).

### MEDIUM

**M1 — an untroubled posture under an active siege (73 at tip, 32 at base; 41 made at tip, 33 of them sieges).**
The posture line reads the score's band and is now the STRONG pool in besieged cities.
- `rv2-under_siege-metropolis-25`, `-metropolis-10`, `-metropolis-26`, `rv2-under_siege-city-4`,
  `-city-27`: *"What Izambalam can field and what Izambalam has built are both in good order; the
  metropolis would take real effort to threaten and knows it."* — under **"Military status: Active
  siege"** and *"The crisis could end Izambalam"* / *"The metropolis may not come through this crisis."*
  It is being threatened: an army is outside.
- Already at base for wartime cities (*"The city does not spend much time thinking about being
  attacked"* during a war): 32.

**M2 — "nobody on the walls" beside an Invasion & War bar of Strong (58 at tip, 39 at base; 19 made at tip).**
The sentence is false wherever a watch stands (113 births, at base and tip alike: pre-existing), but the
lane raised the bar under it.
- `rv2-under_siege-town-26` (Chernovich; Lightly Defended 35 → Defensible 54.4): Invasion & War **Strong**,
  *"People at Chernovich admit it when asked: the town has walls and nobody to stand on them."* —
  the same card lists *"Town watch — Part-time guards who walk the night and hold the gates."*
- `rv2-under_siege-town-33` (Torrifundus; Vulnerable 23 → Defensible 38.5): Invasion & War **Strong**,
  the same sentence; and its posture line *"Torrifundus could deal with a brawl or a thief, but the town
  could not hold off a raid."* (see M5).
- `rv2-calm-town-23` (Tzulhuacan; Defensible 53 → Well-Defended 59.3, calm, Prosperous): Invasion &
  War **Strong**, *"You can walk the length of Tzulhuacan's walls and meet nobody on them."*

**M3 — "no line and no force" beside an Invasion & War bar of Adequate (9 at tip, 2 at base; 8 made at tip, 6 sieges).**
- `rv2-under_siege-village-20` (Teotiitza; Vulnerable 17 → Lightly Defended 26.6; no walls, no force):
  Invasion & War **Adequate**, *"Teotiitza has no line and no force, and the threat now at hand has
  noticed both."*
- `rv2-under_siege-town-25` (Nishixian; Lightly Defended 32 → Defensible 49.8): Adequate and the same
  sentence — with a Town watch on the card (the "no force" half is false at base too: 26 births).
- `rv2-under_siege-town-39` (Bergland; Vulnerable 23 → **Defensible** 40.8, open, a part-time watch
  only, under siege): the same sentence beside Adequate; the posture *"Bergland has enough for the usual
  trouble"*; *"The crisis could end Bergland."*

**M4 — "hired swords" where no one is hired (7 at tip, 0 at base).**
- `rv2-under_siege-town-1` (Krasnonick): *"Hired swords back the garrison, paid from what the hunger
  leaves."* The card lists Barracks, a Town watch and a charter hall; no contracted force. (Also F4's
  "hunger" in a siege.) Others: `rv2-famine-town-8`, `rv2-succession_void-town-2`.

**M5 — "all but undefended" beside walls kept in repair and a watch (41 at tip, 42 at base; 8 made at tip).**
- `rv2-succession_void-town-33` (Shanyuan; Vulnerable 23 → Undefended 4.3): *"Shanyuan is all but
  undefended. Nothing in the town would stop a serious attack for long."* beside *"There is a line around
  Shanyuan and it is kept: the gates shut, the works are repaired"* and *"Shanyuan's defences are sound"*,
  town walls and a town watch on the card.
- The two ladders (see §4): `rv2-under_siege-town-33` reads **Defensible** (38.5) and its posture line
  is the WEAK pool, *"could not hold off a raid"* (7 such at tip, 6 at base).

### LOW

**L1 — "hunger" in a siege: the first review's F4, not yet cured (75 births at tip).** e.g.
`rv2-under_siege-city-1`: *"Hired swords back the garrison, paid from what the hunger leaves."*;
`rv2-under_siege-village-20`: *"The adventurers' charter hall takes bounty work against threats, paid
from what the hunger leaves."*
**L2 — agreement (19 at tip, 0 at base):** `rv2-under_siege-city-4`: *"Xinling kept its city walls and
gates through the quiet years, and the city walls and gates is earning its keep now."*
**L3 — the Magic tab's availability reads the printed label, not the standing one.** 568 of 1,200 tip
pages print *"Availability limited"*, a word no base page prints; 53 of them are places paid in full at
a Prosperous standing (e.g. besieged cities whose Overview reads *Magical Capability Strong*).
**L4 — pre-existing, for the record:** the conditional *"Food endurance: Under siege the outlying fields
are lost; …"* prints in famine and calm towns (it reads as a hypothetical, so not counted); *"The tally of
preserved food … if the metropolis were cut off, it would run short quickly"* beside *"the granary
carries the metropolis for more than a year"* in besieged metropolises (base and tip).

### What reads TRUE beside the new rating (checked, no finding)
- The bars' x/100 numbers on the PDF, the bar labels and the Overview badges agree for every aspect on
  every page (one integer, one ladder).
- The Tonight sheet prints no rating; its stores line moves with the food record only ("a granary, six
  months" → "five months"), and the Economics tab, PDF and Foundry move with it.
- The power tab's legitimacy row reads the new rating downstream ("Defense −4" → "+10"), as designed.
- Small places: thorps, hamlets and villages read their unpaid defence plainly; the 19 births that fall
  to Undefended keep matching lines ("no walls and no one under arms").

### The 42 by eye: rating, band and parts at 73b1304de (base rating beside)

| seed | base | tip | printed / standing | roster | five scores | the parts (record) |
|---|---|---|---|---|---|---|
| rv2-calm-town-25 | 35 Lightly Defended | 25 Lightly Defended | Poor / Poor | walled; no garrison; watch | mil 53 mon 32 ord 23 sup 59 mag 23 | walls+10 watch+3.9 court+3.2 will+4.8 charter+5.5 stores+8.2 market+1.3 purse+2.2 unprovisioned-1 magic+4.7 folk+1.6 plaguedCountry-3 crime-4 terrain+0.6 size+2 danger-15 |
| rv2-calm-city-19 | 72 Well-Defended | 79 Fortress | Prosperous / Prosperous | walled; garrison; watch; hired | mil 100 mon 93 ord 51 sup 87 mag 64 | walls+10 unmended-0.8 garrison+12.6 watch+5 court+4 will+6.2 company+2.8 charter+10 arcane+6.4 stores+11.4 alchemists+1.6 market+2 purse+4 foodBroken-1.6 unprovisioned-1 magic+12.8 crime-4 full:military-2.4 |
| rv2-famine-village-19 | 14 Vulnerable | 7.4 Undefended | Struggling / Comfortable | open; no garrison | mil 13 mon 12 ord 0 sup 17 mag 10 | will+0.4 households+1.4 parish+0.4 close+0 druids+1.6 stores+2.8 market+1.4 purse+2.6 magic+7.2 remoteness+0.4 crossroads+1.6 folk+0.8 crime-3 size+4 danger-7 sustainsHeld-10.2 floor:internal+3 |
| rv2-famine-city-39 | 49 Defensible | 72.2 Well-Defended | Struggling / Prosperous | walled; garrison; watch; hired | mil 100 mon 94 ord 39 sup 99 mag 64 | walls+10 garrison+10.8 watch+4 court+3.1 prison+2.3 will+5.2 company+2.5 charter+8.8 arcane+5.7 stores+10.6 alchemists+1.2 hospital+2.5 market+1.5 purse+3 unprovisioned-1 magic+12.8 sea+2 folk+0.8 crime-5.4 terrain+0.5 danger-7 full:military-1.7 |
| rv2-under_siege-hamlet-9 | 16 Vulnerable | 13.1 Vulnerable | Struggling / Poor | open; no garrison | mil 33 mon 23 ord 4 sup 1 mag 0 | will+2.4 charter+5.2 households+1.6 parish+1.5 elders+1.3 close+1.5 stores+0.1 purse+0.1 remoteness+0.4 folk+0.8 crime-2.8 size+8 danger-7 |
| rv2-under_siege-metropolis-25 | 53 Defensible | 81.4 Fortress | Struggling / Prosperous | walled; garrison; watch | mil 100 mon 98 ord 46 sup 93 mag 70 | walls+10 unmended-0.8 garrison+12.1 watch+4.4 court+3.3 prison+2.5 will+5.7 charter+9.8 arcane+6.4 stores+11 alchemists+1.3 hospital+2.6 market+1.6 purse+3.2 foodBroken-1.6 unprovisioned-1 magic+14 crossroads+1.6 crime-5 terrain+3.8 full:military-3.5 |
| rv2-wartime-town-11 | 37 Lightly Defended | 27.9 Lightly Defended | Struggling / Poor | walled; no garrison; watch | mil 56 mon 24 ord 25 sup 44 mag 14 | walls+10 watch+3.9 court+3.2 will+3.9 stores+8.2 market+1.3 purse+2.2 unprovisioned-1 magic+3.8 folk+0.8 crime-2.6 terrain+2.7 size+2 danger-7 sustainsHeld-3.5 |
| rv2-wartime-metropolis-6 | 61 Well-Defended | 72.4 Well-Defended | Comfortable / Prosperous | walled; garrison; watch; hired | mil 100 mon 100 ord 62 sup 100 mag 75 | walls+10 unmended-0.8 garrison+12.6 watch+5 court+4 prison+3 will+6.2 company+2.8 charter+10 arcane+6.4 druids+2.4 stores+14 alchemists+1.6 hospital+3 market+2 purse+4 foodBroken-1.6 unprovisioned-1 magic+15 folk+1.6 plaguedCountry-3 crime-4.8 terrain+4.4 danger-15 full:military-6.8 full:monster-0.6 full:economic-2 |
| rv2-succession_void-town-33 | 23 Vulnerable | 4.3 Undefended | Poor / Poor | walled; no garrison; watch | mil 38 mon 14 ord 9 sup 18 mag 6 | walls+10 watch+1.7 court+1.6 will+1.6 stores+8.2 hospital+2.2 market+1.3 purse+2.2 unprovisioned-1 magic+4.4 folk+1.6 plaguedCountry-3 crime-2.2 terrain+1.2 size+2 danger-15 sustainsHeld-12.5 |
| rv2-succession_void-metropolis-22 | 58 Well-Defended | 68.8 Well-Defended | Prosperous / Prosperous | walled; garrison; watch; hired | mil 100 mon 100 ord 46 sup 100 mag 73 | walls+10 unmended-0.8 garrison+11 watch+3.9 court+3.1 prison+2.3 will+5 company+2.3 charter+9.4 arcane+5.9 druids+2.4 stores+14 alchemists+1.6 hospital+3 market+2 purse+4 foodBroken-1.6 unprovisioned-1 magic+14.6 folk+1.6 plaguedCountry-3 crime-4 terrain+4.4 danger-15 full:military-3.7 full:monster-0.6 full:economic-2 |
| rv2-famine-city-38 | 37 Lightly Defended | 59 Well-Defended | Struggling / Prosperous | walled; garrison; watch; hired | mil 100 mon 99 ord 39 sup 85 mag 47 | walls+10 unmended-0.8 garrison+11.4 watch+4.1 court+3.1 prison+2.3 will+5.4 company+2.6 charter+9.3 arcane+6.1 druids+2.3 stores+10.6 hospital+2.6 market+1.6 purse+3.2 unprovisioned-1 magic+9.4 folk+1.6 plaguedCountry-3 crime-5.4 terrain+6.8 danger-15 full:military-8.2 |
| rv2-under_siege-town-33 | 23 Vulnerable | 38.5 Defensible | Struggling / Comfortable | walled; no garrison; watch | mil 72 mon 57 ord 42 sup 49 mag 39 | walls+10 watch+4.2 court+3.2 prison+2.4 wardens+2.4 will+5.6 company+2.5 charter+8.8 stores+6.1 market+1.3 purse+2.4 unprovisioned-1 magic+7.8 folk+1.6 plaguedCountry-3 crime-2.8 size+2 danger-15 |
| rv2-under_siege-town-39 | 23 Vulnerable | 40.8 Defensible | Struggling / Prosperous | open; no garrison; watch | mil 40 mon 40 ord 16 sup 61 mag 37 | watch+4.1 court+2.9 will+5.5 charter+9.7 stores+6.5 hospital+2.4 market+1.4 purse+2.9 unprovisioned-1 magic+7.4 crime-5 terrain+2 size+2 |
| rv2-under_siege-city-1 | 34 Lightly Defended | 58.4 Well-Defended | Struggling / Prosperous | walled; garrison; watch; hired | mil 100 mon 91 ord 46 sup 79 mag 51 | walls+10 garrison+12.1 watch+4.4 court+3.3 prison+2.5 will+5.8 company+2.8 charter+9.8 arcane+6.4 stores+8.5 alchemists+1.2 hospital+2.5 market+1.5 purse+3 unprovisioned-1 magic+10.2 folk+1.6 plaguedCountry-3 crime-5 terrain+6.8 danger-15 full:military-10 |
| rv2-under_siege-city-27 | 53 Defensible | 76.6 Fortress | Struggling / Prosperous | walled; garrison; watch | mil 100 mon 98 ord 46 sup 71 mag 68 | walls+10 unmended-0.8 garrison+12.1 watch+4.4 court+3.3 prison+2.5 will+5.8 charter+9.8 arcane+7.4 stores+8.5 alchemists+1.2 hospital+2.5 market+1.5 purse+3 foodBroken-1.6 provisioned+1 magic+13.6 crime-5 terrain+4 full:military-6.6 |
| rv2-under_siege-metropolis-10 | 54 Defensible | 77.8 Fortress | Struggling / Prosperous | walled; garrison; watch; hired | mil 100 mon 98 ord 46 sup 85 mag 60 | walls+10 masons+1.2 garrison+12.1 watch+4.4 court+3.3 prison+2.5 will+5.7 company+2.8 charter+9.8 arcane+6.4 stores+11 alchemists+1.3 hospital+2.6 market+1.6 purse+3.1 foodBroken-1.6 unprovisioned-1 magic+12 crime-5 terrain+0.5 full:military-4.9 |
| rv2-under_siege-thorp-32 | 8 Undefended | 14.2 Vulnerable | Struggling / Comfortable | walled; no garrison; militia | mil 51 mon 13 ord 4 sup 18 mag 0 | walls+10 will+1.2 households+1.2 parish+1.5 elders+1.3 close+2 stores+0.7 purse+0.9 remoteness+0.4 sea+2 folk+1.6 plaguedCountry-3 crime-2.8 terrain+0.2 size+12 danger-15 |
| rv2-wartime-thorp-39 | 21 Vulnerable | 24.5 Lightly Defended | Moderate / Comfortable | open; no garrison | mil 15 mon 0 ord 15 sup 33 mag 0 | will+1 households+1.2 parish+2.2 close+3.6 stores+3 purse+3.6 remoteness+0.4 crime-2.6 terrain+0.1 size+12 |
| rv2-under_siege-hamlet-31 | 19 Vulnerable | 24.1 Lightly Defended | Struggling / Moderate | walled; no garrison; militia | mil 80 mon 50 ord 12 sup 14 mag 0 | walls+10 militia+4.8 will+3.4 charter+7.2 households+1.6 parish+1.6 elders+1.4 close+1.8 stores+0.4 purse+0.4 remoteness+0.4 sea+2 folk+1.6 plaguedCountry-3 crime-2.8 terrain+0.3 size+8 danger-15 |
| rv2-famine-hamlet-23 | 9 Undefended | 13.9 Vulnerable | Struggling / Moderate | open; no garrison | mil 9 mon 0 ord 0 sup 20 mag 0 | will+0.4 households+0.7 parish+0.8 elders+0.6 close+0.9 stores+2 purse+0 remoteness+0.4 sea+2 crime-3 terrain+0.1 size+8 floor:internal+1 |
| rv2-under_siege-village-36 | 7 Undefended | 15.6 Vulnerable | Struggling / Comfortable | walled; no garrison; militia | mil 79 mon 25 ord 0 sup 29 mag 0 | walls+10 masons+1.2 militia+5.1 will+3.8 households+2 parish+1.3 close+0.9 stores+1.7 market+0.9 purse+1.7 remoteness+0.4 crossroads+1.6 folk+1.6 plaguedCountry-3 crime-2.8 size+4 danger-15 floor:internal+0.2 |
| rv2-under_siege-village-20 | 17 Vulnerable | 26.6 Lightly Defended | Struggling / Prosperous | open; no garrison | mil 47 mon 35 ord 0 sup 31 mag 0 | will+3.8 charter+8.7 households+2 parish+1.2 close+0.8 stores+1.7 market+1 purse+1.9 remoteness+0.4 crossroads+1.6 crime-2.8 terrain+1.5 size+4 floor:internal+0.8 |
| rv2-famine-town-29 | 30 Lightly Defended | 49.8 Defensible | Struggling / Comfortable | walled; garrison; watch | mil 100 mon 87 ord 23 sup 57 mag 47 | walls+10 garrison+10.7 watch+3.8 court+2.9 wardens+2.1 will+5 charter+7.9 arcane+6.6 stores+6.6 alchemists+1.1 market+1.3 purse+2.4 unprovisioned-1 magic+9.4 folk+1.6 plaguedCountry-3 crime-5.4 terrain+1.3 size+2 danger-15 full:military-0.5 |
| rv2-under_siege-town-26 | 35 Lightly Defended | 54.4 Defensible | Struggling / Prosperous | walled; no garrison; watch | mil 92 mon 55 ord 11 sup 61 mag 43 | walls+10 watch+3.9 court+2.8 wardens+2.4 will+5.4 company+3.6 arcane+6.4 stores+6.8 alchemists+1.2 hospital+2.5 market+1.5 purse+2.9 foodBroken-1.6 provisioned+1 magic+8.6 crime-5 size+2 |
| rv2-under_siege-town-1 | 32 Lightly Defended | 49.3 Defensible | Struggling / Prosperous | open; garrison; watch | mil 74 mon 59 ord 42 sup 62 mag 35 | garrison+12 watch+4.2 court+3.2 will+5.7 company+2.8 charter+9.8 stores+6.3 market+1.3 purse+2.7 unprovisioned-1 magic+7 sea+2 folk+0.8 crime-2.8 terrain+0.3 size+2 danger-7 |
| rv2-under_siege-town-25 | 32 Lightly Defended | 49.8 Defensible | Struggling / Prosperous | open; no garrison; watch | mil 44 mon 58 ord 27 sup 69 mag 41 | watch+4 court+2.9 will+5.5 charter+9.7 arcane+6.4 stores+6.8 alchemists+1.2 hospital+2.5 market+1.5 purse+2.9 unprovisioned-1 magic+8.2 crime-2.8 size+2 |
| rv2-under_siege-city-4 | 56 Well-Defended | 82 Fortress | Struggling / Prosperous | walled; garrison; watch; hired | mil 100 mon 98 ord 46 sup 88 mag 78 | walls+10 unmended-0.8 garrison+12.1 watch+4.4 court+3.3 prison+2.5 will+5.7 company+2.8 charter+9.8 arcane+7.4 stores+8.7 alchemists+1.2 hospital+2.5 market+1.5 purse+3.1 unprovisioned-1 magic+15.6 crossroads+1.6 crime-5 full:military-3.4 |
| rv2-under_siege-metropolis-26 | 55 Well-Defended | 82.4 Fortress | Struggling / Prosperous | walled; garrison; watch | mil 98 mon 98 ord 46 sup 100 mag 70 | walls+10 unmended-0.8 garrison+12.1 watch+4.4 court+3.3 prison+2.5 will+5.7 charter+9.8 arcane+6.4 stores+11 alchemists+1.3 hospital+2.6 market+1.6 purse+3.1 unprovisioned-1 magic+14 crossroads+1.6 crime-5 full:economic-0.2 |
| rv2-calm-thorp-39 | 29 Lightly Defended | 32.8 Lightly Defended | Comfortable / Comfortable | walled; no garrison | mil 51 mon 24 ord 22 sup 43 mag 0 | walls+10 will+1.2 households+1.2 parish+2.2 elders+1.8 close+3.6 stores+3 purse+3.6 remoteness+0.4 sea+2 folk+0.8 crime-2.2 terrain+0.2 size+12 danger-7 |
| rv2-calm-thorp-26 | 25 Lightly Defended | 29 Lightly Defended | Prosperous / Prosperous | open; no garrison | mil 18 mon 0 ord 23 sup 44 mag 0 | will+1 households+1.2 parish+2.2 elders+1.8 close+3.6 stores+3.2 purse+4 remoteness+0.4 crossroads+1.6 crime-2.2 terrain+0.2 size+12 |
| rv2-calm-hamlet-7 | 25 Lightly Defended | 20.7 Vulnerable | Poor / Poor | walled; no garrison; militia | mil 64 mon 23 ord 19 sup 33 mag 0 | walls+10 militia+4.7 will+3.1 households+1.6 parish+2.2 close+2.8 stores+3 market+1.3 purse+2.2 remoteness+0.4 folk+1.6 plaguedCountry-3 crime-2.2 size+8 danger-15 |
| rv2-calm-hamlet-14 | 25 Lightly Defended | 20.8 Vulnerable | Poor / Poor | open; no garrison | mil 35 mon 23 ord 16 sup 25 mag 0 | will+2.6 charter+5.5 households+1.6 parish+2.2 close+2.8 stores+2.8 purse+2.2 remoteness+0.8 folk+0.8 crime-2.2 terrain+0.7 size+8 danger-7 |
| rv2-calm-village-19 | 35 Lightly Defended | 26 Lightly Defended | Poor / Poor | walled; no garrison; militia | mil 86 mon 42 ord 24 sup 34 mag 0 | walls+10 militia+4.8 will+3.1 charter+5.5 households+2 parish+2.2 elders+1.8 close+2 stores+3.2 market+1.3 purse+2.2 remoteness+0.8 folk+1.6 plaguedCountry-3 crime-2.2 terrain+1.7 size+4 danger-15 |
| rv2-calm-village-5 | 22 Vulnerable | 17.2 Vulnerable | Poor / Poor | open; no garrison | mil 41 mon 23 ord 12 sup 25 mag 0 | will+2.6 charter+5.5 households+2 parish+2.2 close+2 stores+2.8 purse+2.2 remoteness+1.6 folk+0.8 crime-2.2 terrain+0.7 size+4 danger-7 |
| rv2-calm-town-23 | 53 Defensible | 59.3 Well-Defended | Prosperous / Prosperous | walled; no garrison; watch | mil 79 mon 38 ord 43 sup 82 mag 44 | walls+10 watch+5 court+4 prison+3 will+5 arcane+7.4 stores+9.4 market+2 purse+4 foodWorking+1 unprovisioned-1 magic+8.8 crime-4 terrain+2.7 size+2 |
| rv2-calm-town-12 | 32 Lightly Defended | 26 Lightly Defended | Moderate / Moderate | open; no garrison; watch | mil 22 mon 0 ord 32 sup 45 mag 21 | watch+4.4 court+3.6 will+4.5 stores+8.8 market+1.7 purse+3 unprovisioned-1 magic+6.2 crime-2.2 terrain+1.2 size+2 sustainsHeld-6.2 |
| rv2-calm-city-33 | 80 Fortress | 86 Fortress | Prosperous / Prosperous | walled; garrison; watch; hired | mil 100 mon 98 ord 66 sup 100 mag 66 | walls+10 garrison+12.6 watch+5 court+4 prison+3 will+6.2 company+2.8 charter+10 arcane+7.4 stores+11.4 alchemists+1.6 hospital+3 market+2 purse+4 unprovisioned-1 magic+13.2 crime-4 terrain+3 full:military-7.2 full:economic-1 |
| rv2-calm-metropolis-35 | 65 Well-Defended | 71.8 Well-Defended | Prosperous / Prosperous | walled; garrison; watch; hired | mil 100 mon 100 ord 66 sup 100 mag 68 | walls+10 unmended-0.8 garrison+12.6 watch+5 court+4 prison+3 will+6.2 company+2.8 charter+10 arcane+6.4 druids+2.4 stores+14 alchemists+1.6 hospital+3 market+2 purse+4 foodBroken-1.6 unprovisioned-1 magic+13.6 crossroads+1.6 folk+1.6 plaguedCountry-3 crime-4 danger-15 full:military-2.4 full:monster-0.6 full:economic-3.6 |
| rv2-succession_void-city-20 | 59 Well-Defended | 69.2 Well-Defended | Prosperous / Prosperous | walled; garrison; watch; hired | mil 100 mon 100 ord 46 sup 100 mag 75 | walls+10 garrison+11 watch+3.9 court+3.1 prison+2.3 will+5 company+2.3 charter+9.4 arcane+5.9 druids+2.4 stores+11.2 alchemists+1.6 hospital+3 market+2 purse+4 unprovisioned-1 magic+15 folk+1.6 plaguedCountry-3 crime-4 terrain+4.4 danger-15 full:military-4.5 full:monster-0.6 full:economic-0.8 |
| rv2-wartime-city-6 | 67 Well-Defended | 77.2 Fortress | Moderate / Prosperous | walled; garrison; watch | mil 100 mon 93 ord 62 sup 87 mag 44 | walls+10 garrison+12.6 watch+5 court+4 prison+3 will+6.2 charter+10 arcane+7.4 stores+11.4 market+2 purse+4 unprovisioned-1 magic+8.8 crime-4.8 terrain+6.3 full:military-7.7 |
| rv2-famine-metropolis-13 | 51 Defensible | 73.8 Well-Defended | Struggling / Prosperous | walled; garrison; watch; hired | mil 100 mon 94 ord 39 sup 100 mag 71 | walls+10 garrison+10.8 watch+4 court+3.1 prison+2.3 will+5.2 company+2.5 charter+8.8 arcane+5.7 stores+14 alchemists+1.2 hospital+2.5 market+1.5 purse+3 unprovisioned-1 magic+14.2 sea+2 folk+0.8 crime-5.4 terrain+0.5 danger-7 full:military-1.7 full:economic-3.2 |
| rv2-succession_void-village-16 | 19 Vulnerable | 9.7 Undefended | Poor / Poor | open; no garrison | mil 3 mon 12 ord 0 sup 7 mag 6 | will+0.1 households+0.1 parish+0 close+0 druids+2.4 stores+3.6 purse+2.2 magic+4.7 remoteness+0.4 crime-2.2 terrain+0.1 size+4 sustainsHeld-7.9 floor:internal+2.2 |

### Probes, seeds, recipes
All in `docs/chair/2026-11-13/probes/REVIEW-UPKEEP-2/`. `scan.mjs <seedfile> <out.ndjson>` (one line per
birth: rating, band, five scores, roster, parts); `render.mjs <seedfile> <outdir>` (every surface);
`vdiff.py <base dir> <tip dir> <seeds>`; `block.py`, `plus.py` (the reading views); `classes.py <dir>
<scan> <out.json>` (the classes above); `classes.{base,tip}.json` (every seed in every class). Run each as
`TREE=<checkout> node <probe> …` from the probe directory, with the tree's `node_modules`.

## §2 — THE CLAIMS, each by my own execution (after §1 was pushed)

Probes: `claims.mjs` (300 births, `seeds.claims.txt`: i = 0..9 of every cell), `crime3.mjs`, `crime4.mjs`,
`limits.mjs`, `plant.sh`, `saved-birth.mjs` + `saved-render.mjs`; receipts `claims.tip.ndjson`.

| # | Claim | Result | How |
|---|---|---|---|
| C1 | the parts sum exactly to the rating | **holds** 1,200/1,200 | `scan.mjs`: Σ points in tenths = `readiness.score` |
| C2 | a record stripped of its profile recomputes equal | **holds** 300/300 | JSON round trip, delete `defenseProfile`, `generateDefenseProfile(s, keepOfRecord(...))`, byte-equal |
| C3 | one direction: nothing a part reads is written from defence | **holds** (static) | no `defenseProfile` read in the economy, food, stress, institution, priority or helper modules; the late `settleCrimeLinesToSignal` rewrites lines only; legitimacy and faction power read the label AFTER |
| C4 | the score reads no fact of the powers | **holds** (static) | no `powerStructure`/`factions`/`publicLegitimacy` in the generator, `helpers.js`, `keep.js` or the roster home; the neighbour factor reads `config.neighborRelationship` (R14) |
| C5 | count once: a house under one part only | **FAILS — MEDIUM** | drop each roster house alone and recompute: in 51 of 300 births one house moves two parts: Apothecary district → alchemists+magic (16), Elder Grove Council → druids+magic (14), Wizard's tower → arcane+magic (12), **Alchemist shop → arcane+alchemists+magic (9)**, Mages' guild, Alchemist quarter, Hedge wizard → arcane+magic, Healer (divine) → hospital+magic. `computeEffectiveMagicPresence` still counts the houses that stand as their own parts. |
| C6 | a crisis acts once, on the parts it touches | **FAILS — MEDIUM** | the crisis table acts once (the parts' `crisis` lines are exact); but `getInstFlags`'s criminal reading multiplies crime by the stress (`crimeStressMult`), and the Crime part reads it: with the stress removed from that reading only, the Crime part moves in 120/120 famine, siege and wartime births (40 each), readiness −1.20, −0.87, −0.62 on average; famine and siege so act twice on order, and **wartime, which R4 says takes from no part, acts through it** (40/40). Succession void: 0/40. |
| C7 | prosperity scales each paid part once, from the standing label | **holds** for every paid part (0 misses: points = full × `fundedGate(floor, standing keep)` where no crisis or limit acts) — **PLAUSIBLE, LOW:** the martial will is itself `paid()` and then held to the armed bodies (R13), which are paid; where R13 binds the will carries the pay twice over its own share. Not a finding until the chair says whether the will is a paid part. |
| C8 | the two limits bite where the design says and nowhere else | **holds** | limit 1 on 23 of 160, each with SUSTAINS listed above STANDS (0 exceptions); limit 2 on 0 natural births (none is walled with no armed body), and on a plant (a walled record with every armed house removed) on 54 of 82 — the 28 that do not bite are small places whose armed households stand (an armed body by the design's list) |
| C9 | each of the five scores is full at 100, in one place in code | **holds** | `computeDefenseScores`: one `Math.min(100, Math.max(0, v))` per score; readiness held to its scale on its own line (the scale's ends) |
| C10 | every number lives in `DEFENCE_TUNING` | **holds for the generator file** (walker arm iv green; a planted 0.37 reds) — **LOW:** numbers that reach the score from outside the table: the crime multipliers and the criminal formula (`priorityHelpers.js`), the magic presence's own weights (`computeEffectiveMagicPresence`), the keep table (`keep.js :: KEEP_TUNING`, prosperity's home, acceptable) |
| C11 | a saved town does not move (as the DEPLOYED client stored it, master's shape, no standing label) | **holds for defence; LOW elsewhere** | 10 births on `origin/master` (db832c892), stored as JSON, rendered unchanged at base and at tip: every defence surface identical; **the Magic tab moves on 9 of 10** ("Availability common" → "moderate", "moderate" → "limited"): `magicProfile.js :: buyable` reads the stored printed label at render time. (Recomputing that record with no standing label falls back to the printed label: 149 of 300 births would read lower, but nothing recomputes a saved profile; one caller, at birth.) |
| C12 | each of the walker's five arms reds on a plant of my own | **FAILS on two — MEDIUM** | on the REAL tree (scratch worktree, reverted): (i) `s.defenseProfile.readiness` in the generator → red; (iii) `/wizard/i.test(n)` → red; (iv) `x * 0.37` → red; (v) `s.defenseProfile.parts.map(...)` in `DefenseTab.jsx` → red. **(ii) `getActiveRng()` (the codebase's active stream, imported from `kernel/rngContext.js`) → GREEN; `createPRNG(seed)()` → GREEN**; a lower-case `rng()` control → red. **(v′) `JSON.stringify(s.defenseProfile)` in `worldExport.js` → GREEN**, and that is how the export carries the parts today (§3). Logs: `plant.*.log`. |

## §3 — SHOW THE RATINGS, NOT THE MACHINERY

- **Pages, Tonight, PDF, Foundry, AI prompt and grounding: no machinery.** Every line of the 1,200 tip
  dumps that no base dump prints (masked for names and numbers: 624 distinct lines) was searched for a
  part's points, a sum, a pay share, a weight, a limit, a slider's name, "martial will", "held in
  reserve", "more than enough": 0 hits that are machinery (3 benign: "a share of the debt", "a share in the
  supply", "held to ransom"). The searched phrases appear on 0 of 1,200 pages, PDFs, journals, prompts.
- **The export: MEDIUM.** `buildWorldExport` passes the whole record through `toPublicSafe`, so the
  player variant and the DM variant both carry `defenseProfile.parts` on 1,200/1,200: each part's
  `label` ("Martial will", "Walls with no one to man them", "Stores and supply can carry no more than the
  force can use", "Military: more than enough, held in reserve"), `source` ("military dial (config) and
  neighbour", "rule (limit 2)") and `points`. Ruling 328 names "an export". (The gates and chain
  modifiers rode the export at base too; the parts are new.)
- **The builder's "no string added or changed"**: true of V3's own code, as far as I can see (the tab's
  code is unchanged, and no new template appears whose words are V3's). Not true of the lane's form as a
  page reads it: the Magic tab prints **"Availability limited"** on 568 of 1,200 tip pages, a word no
  base page prints (the lane's ruling 5, `magicProfile.js :: buyable`, not V3's commit), and the pools
  now print lines the base never reached (e.g. "What X can field and what X has built are both in good
  order", in besieged cities).

## §4 — THE BAND AND ITS NUMBER

- **The badge and the stored score never disagree:** `readinessBandOf(score)` on the tenths; 0 of 1,200.
- **No live surface prints the readiness number.** Its readers: the world export (score and label from
  the one record: agree); the causal contributor sentence in `EngineSections.jsx :: DefenseWarFrontSection`
  ("Defense readiness score: N.", whole points), which nothing mounts (dark); the AI prompt prints the
  MILITARY score ("military score 100/100"), not readiness. 40 of my births sit within half a point
  below a cut (e.g. `rv2-calm-city-3`, 54.9 Defensible): if the causal section is ever mounted it will
  print "55" beside "Defensible".
- **Two ladders read one number — LOW, pre-existing:** the posture line bands `readiness.score` on the
  aspects' ladder (`SCORE_BAND_CUTS` 65/40/20) while the badge uses the readiness ladder
  (76/55/38/24/12). So 38.0–39.9 reads **Defensible** beside the WEAK pool ("could not hold off a raid":
  `rv2-under_siege-town-33`, 7 at tip, 6 at base), and 55–64.9 reads **Well-defended** beside the ADEQUATE
  pool ("they claim no more than that": 57 at tip, 109 at base).
- The PDF strip prints "Readiness: <band>" beside "Score avg: <mean of the five>", a different quantity
  (no size, no threat); unchanged form.

## §5 — THE FIRST REVIEW'S FINDINGS

- **F2 (cured):** on my 1,200, every rite row stands at tip as at base (Religious services 400/400, Life
  ceremonies 400/400, Weekly rite 379/379, Last rites 104/104); no burial house without a Burial row at
  either tree; no market loses its Weekly market to the lane. The cure reads clean.
- **F5 (cured):** the merchant-army lead with "back the garrison": 0 at base, 0 at tip.
- **F4 (not cured; the sixth seat's):** 75 sieges print "paid from what the hunger leaves" (L1).
- **F7 (not cured):** H2 is its sharper form under standing pay: the purse lines now sit beside lines
  that read a full purse.
- **F3:** not measured by me (the sixth seat's).
