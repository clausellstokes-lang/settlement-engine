# REVIEW-UPKEEP-2 — the derived defence, `lane/coherence-upkeep-2026-11-12` at 73b1304de (base 69b53decd)

> The second independent review of the upkeep lane, on the derived form only. The reviewer changes
> nothing on the lane and cures nothing. §1 is the cold list, committed and pushed before the builder's
> hand-back, measure file, build report or commit bodies were opened.
>
> One disclosure: fetching the lane printed `git log --oneline` subjects of its last fifteen commits in
> my context before §1 was written (one line each, no bodies). Nothing else of the builder's was read.

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
