NOT CLEAR

# REVIEW-POWERS — the independent review of `lane/coherence-powers-2026-11-11` at 1a32c200a (2026-11-12)

`git rev-parse HEAD` read `1a32c200ad99a8c108cd897b578a049b2ae65f98` before anything ran; the branch had not moved. The
base is decc7bf15. The merged PRESUME lane (02c5f8fbd) is not under review: where a move is PRESUME's (the Fragile
stability wording, the culture profiles' defence prose), it is named and set aside.

**THE REVIEWER'S CORPUS (seeds the lane never saw), 1,845 births per tree, base and tip, every birth through
`birthConfig` with the browser's dials:**
- random dials: `rvw-<tier>-<i>`, 100 each of thorp, hamlet, village, town, city, metropolis (600);
- every one of the 15 stresses forced (`selectedStresses: [stress], selectedStressesRandom: false`) × six tiers × 8:
  `rvf-<stress>-<tier>-<i>` (720);
- the golden master's own 525 configurations (`tests/helpers/goldenMasterCorpus.js`, as the golden calls them).

The probes are in the reviewer's scratchpad, never committed. Every figure below is EXECUTED unless it is marked READ.

**Count: 13 findings. CONFIRMED 12, PLAUSIBLE 1.**

---

## THE FINDINGS, most serious first

### F1 — A small place loses a power, often the crisis's own, because the leader no longer has a second card. CONFIRMED.

**What the game master sees.** Ormbrekka (`rvf-occupied-thorp-6`) is a thorp "Under Occupation". At base its Power tab
had the Occupation Authority (60) over the Elder Council (40). At the tip the Power tab shows **Elder Council (100), and
nothing else**. There is no occupier on the page. The coup label reads **Stable** (it was Contested). The Elder Council's
own description still says "they play Grain Holders and Occupation Authority against each other". The occupied hamlet
`rvf-occupied-hamlet-5` is the same, and a card's secret there still reads "So would the occupation authority, to
suppress it".

**The mechanism (executed, with logging in a scratch tree).** The density law sizes the roster after the people step.
Its seat ceiling is the number of cards the cast holds: `steps/assembleSettlement.js:288`
`massOverride: (settlement.npcs || []).length`, and `density/densityRoll.js` takes
`factionCeiling = min(namedMass, …)`. The lane's cure (i), ONE PERSON ONE FACE (`people/representatives.js ::
generateRepresentatives`, `if (isSeat && hat) return;` and the `!hat` on the R-P2 mint), takes one card from every town
where a house leads. A thorp with two cards now has one, so its roster gets one seat. The input to the resize is the
same in both trees:

```
rvf-occupied-thorp-6, RESIZE input both trees: Occupation Authority:33, Grain Holders:32, Elder Council:22, Resistance Network:13
  base plan: factionCount 2, namedMass 2, bonusSeatTaken true  -> Occupation Authority:60, Elder Council:40
  tip  plan: factionCount 1, namedMass 1, bonusSeatTaken false -> Elder Council:100
```

**How often (660 thorps, hamlets and villages, base against tip, with the resize logged).** 72 births have fewer
powers. 49 of them are the fold or the not-built rule (by design). 4 are a different governing name before the resize
(the council of a kind). **19 are this cut, every one a seat ceiling 2 → 1 from a card count 2 → 1.** In 8 of the 19 the
power lost is the crisis's own, and usually the town's strongest:

| seed | the power that leaves | its figure at base |
|---|---|---|
| rvf-occupied-thorp-6 | Occupation Authority | 60 |
| rvf-occupied-hamlet-5 | Occupation Authority | 57 |
| rvf-slave_revolt-thorp-5 | Revolt Leadership | 59 |
| rvf-wartime-thorp-2 | War Council | 56 |
| rvf-famine-thorp-0 | Grain Holders | 56 |
| rvw-thorp-86 | The Highborn Circle | 54 |
| rvw-hamlet-66 | Monster Hunters / Adventurers | 25 |
| rvf-politically_fractured-hamlet-3 | The Independent Bloc | — |

The other 11 lose Religious Authorities (8), the Military Party, a Reform Movement, and one more. On the whole corpus,
59 small places (thorp 17, hamlet 28, village 14) go from two or more powers to one. The fold explains most of these;
these 19 are not the fold.

**Undeclared.** The draft record says 2B "moves no card". Of item 3 it says "leader · ruler · capture · any label · any
power figure moved: 0". The lane's 1,000-birth measure had no thorps or hamlets, and the second seat measured against
e071dc60e, where cure (i) had already landed, so neither could see this. `rosterDuplicateDraws` was re-measured twice
(899 → 834 → 823 births carrying two or more cards). That count is this mechanism; its consequence for the roster was
not read. It also breaks the chair's ruling "a power a crisis brings … stands" one layer below the table that implements
it. No guard checks that a crisis's power survives the birth.

### F2 — A power the lane removed is still named in the same town's text. CONFIRMED.

`removed.mjs` (base roster minus tip roster, same seed; the tip's every string searched) and `descs.mjs`:
- **The History tab's tension chips** (`history.currentTensions[].factions[]`, printed by `HistoryTab.jsx:89-90` as
  linked chips): **9 towns** name a power that is gone. rvw-village-80 (Priestly Guidance alone at 100) lists
  "Religious Authorities" as a party to its economic-disparity tension. Also rvw-thorp-86 ("The Highborn Circle"),
  rvf-politically_fractured-village-6, rvf-succession_void-thorp-1 / -thorp-3 / -village-0 / -village-4 / -town-1, and
  rvf-insurgency-village-0.
- **The surviving powers' own descriptions** (`powerStructure.factions[].desc`): **18 towns** name a removed power.
  - rvw-town-93: the Thieves' Guild "operate in the shadow of Religious Authorities", and the Church Council's line says
    "they play Thieves' Guild and Religious Authorities against each other"; the Religious Authorities were folded into
    the Church Council.
  - rvw-town-6 and rvw-town-12: the Military/Guard "play Religious Authorities and Church Council against each other".
  - rvw-town-26 and rvw-town-75: "they play Military/Guard and Military Council against each other", after the
    Military/Guard was folded.
- **A power left alone still ranks itself against others:** 4 towns. rvf-famine-hamlet-1's Feudal Stewardship, alone:
  "Three powers stand almost level here, and no one leads". rvw-hamlet-46's Household Council, alone: "Close enough to
  the two above".
- **A card's secret** (rvf-occupied-hamlet-5: "So would the occupation authority") and a crime line
  (rvf-slave_revolt-thorp-5: "the revolt leadership are pressing people") name F1's lost powers.

**Where.** `density/applyDensityLaw.js :: foldKin` prunes only `factionRelationships` (`pruneToRoster`). The tension
parties and the descriptions were written earlier, from the roster before the resize. The lane's "relationships left
naming a folded power: 0" measured `factionRelationships` alone. (The golden's 525 configurations run without the
density law and fold nothing: 0 there.)

### F3 — A declared leaderless line contradicts the seat row two lines above it. CONFIRMED.

Grudino (`rvf-succession_void-city-4`, a city, Royal Authority, succession_void), as the Power tab prints it:

```
The seat: Stands empty; 2 claimants circle: Noble Claimant (Senior Line), Noble Claimant (Reform Line).
  Noble Claimant (Senior Line) (11): No one claimant has stepped forward yet: the old families press the claim together.
  Noble Claimant (Reform Line) (9): No one claimant has stepped forward yet: the old families press the claim together.
```

A power named "Noble Claimant" says no claimant has stepped forward. The seat row calls it a claimant. Two claimants
print the same sentence. The same happens in rvf-succession_void-city-6. The cause is the table's
`{ stress: 'succession_void', archetype: 'noble', … leaderless: 'No one claimant has stepped forward yet…' }` row
(`data/stressPowerFaces.js`), matched by category to the claimant lines `stressFactions.js` pushes, while
`powerStrata.js :: rulingChainOf` names those same powers as the claimants. See step 4 for every line read.

### F4 — Three powers on the page have neither a card nor a declared line. CONFIRMED. (Equal at base; inside the lane's ruled class, and against its claim of 0.)

- **rvw-city-31, Kitajin** (Royal Authority, politically_fractured): **Loyalist Noble Bloc (14)**, no member, no line.
- **rvw-metropolis-81, Teotico** (Royal Authority, politically_fractured): **Reform Noble Bloc (6)**, the same.

  `stressFactions.js:97-118` pushes both under a Royal Authority. `data/stressPowerFaces.js` has no
  politically_fractured row at all. The lane's corpus forced that stress on six tiers but rarely drew a Royal
  Authority, so it never met them.
- **rvf-plague_onset-town-3, Skaldaker** (Corrupt Council, plague_onset): **Thieves' Guild (10)**, no member, no line.
  Its only backer is "Charlatan fortune tellers", a house with no face (dealt share 1, weight 0). So
  `castPowers.js :: landMemberships`'s `housed(name)` reads it as housed, and the lane's houseless-criminal mint
  (`mintsBySent`) never fires. `housed` asks whether any house holds a share, not whether a face-bearing house does.

The stress-powers guard's own first check ("no power on the page has neither a member nor a declared leaderless line")
reds on all three seeds.

### F5 — The clandestine Resistance Network prints its members unveiled. CONFIRMED.

The table marks the Resistance Network `veiled: true`; the chair's rule says "a clandestine power's face is veiled, not
absent". **16 memberships in 7 occupied towns are not veiled.** In rvf-occupied-city-1 the Garrison's commander is the
Resistance Network's open first, beside the Mercenary quarter's and the Hired blades' faces. Also rvw-town-63 (the
Veteran's lodge's face), and rvf-occupied-metropolis-0 / -1 / -2 / -4 / -7. The cause:
`castPowers.js :: landMemberships`'s `join` sets the veil bit from `veiledPowers`, which holds only hidden or criminal
powers. `seatStressPowers` veils only the face it seats itself; a member dealt by a house's share is never veiled. The
guard's fourth check ("a clandestine or criminal power's face is veiled") reds on these seeds; its 22 seeds hold none
of them.

### F6 — The town's leader heads the Grain Holders, whose description sets them against the formal authority. CONFIRMED (lane-caused).

12 of the 25 Grain Holders on the corpus have the town's leader as their first, all under famine. Waldburg
(`rvw-hamlet-23`):

```
Grain Holders (51): first Ortlieb Schulz, the caravanserai keeper and Headman · second Mathilde Meyer, the horse-coper · …
Headman's Authority (49): first Ortlieb Schulz, the caravanserai keeper and Headman · second Beatrix Schmidt, the militia captain · …
```

The Grain Holders' description: "Whoever controls the remaining food reserves holds more real power than any formal
authority". A reader sees one man named as the formal authority and as the power that outweighs it. This reads as a
fault, not design. The other 12 leaders who head a second, non-roster power head a density rival of a trade niche
("The Merchant Bloc", "The Commercial Circle"); those read as the dual hat (the merchant who is mayor keeps his
merchants' circle) and are accepted.

At base the same house face led the Grain Holders, but it was not the Headman. The dual hat joins it to the government
at share 0. `seatStressPowers` refuses a face that already leads, but a face dealt by share is never checked. See step 3.

### F7 — The empty seat has an office-holder. CONFIRMED (a pre-existing contradiction, now printed with the office's own title).

All 59 succession_void towns (59 of 59) show the seat row "Stands empty; the succession is unsettled" (or "…claimants
circle"). In each, the governing power's rank-1 card prints the office: rvw-town-14 reads
`Tserenpuntsag Barlas · Master of the Guild · Burgomaster, first of Merchant Council`, and the seat house's Connection
row reads "Burgomaster Tserenpuntsag Barlas, the senior guild master". 39 of the 59 cards print the office beside the
house's honorific. Base has the same three-way disagreement with the office's own face ("Head of Merchant Council Won
Ma"). The dual hat now names a house head as holding an office the page calls vacant. Where: `rulingChainOf` reads the
`vacant` modifier; `castPowers.js` FLOOR 1 writes `role = officeTitleFor(...)` regardless of it.

### F8 — The capture label moves toward danger in 24 towns, not as the record declares it. CONFIRMED.

Base against tip, `powerStructure.criminalCaptureState`: **47 of 1,320 move; 24 toward danger.** none → corrupted 8,
none → equilibrium 4, equilibrium → corrupted 6, adversarial → equilibrium 4, adversarial → corrupted 1, and **one
corrupted → capture: rvf-indebted-city-3** (City Council; a Thieves' Guild and The Underground stand). 13 of the 24
are towns with no criminal power at all, where the new leader, a house face dealt an allegiance (the office's face never
was), is an agent of a hidden house: rvw-village-15, rvw-city-34, rvw-metropolis-51, rvf-religious_conversion-town-0,
rvf-mass_migration-city-4 and others. The rule that moves them is `hallCapture.js :: hallCaptureOf` over the new ruling
three.

The draft record names capture only "where no criminal power stands", and the 2B note's capture table starts from the
2A tip, so the base → 2A population of capture moves is not stated anywhere I read. Golden 525: 1 move
(adversarial → equilibrium).

### F9 — The dual-hat guard does not catch an office-holder beside the house head, and four pins now check the code against itself. CONFIRMED.

- **Planted fault 1** (scratch tree: `if (isSeat && hat) return;` commented out, so the seat house keeps its own face
  beside the leader): `powersDualHat.test.js` **stays green**. Only `representatives.test.js` reds, through its
  expected-cast set.
- `powersDualHat.test.js` births without `birthConfig` (the density law off), so it guards a birth the browser never
  makes.
- `seatHolder.test.js` (M-1b), `terrainPoolsSeat.test.js`, `castPowers.test.js` and `representatives.test.js` were
  re-keyed by computing the expected role with the implementation's own `dualHatHouseOf` / `officeTitleFor`. A wrong
  `dualHatHouseOf` would move the expectation with the code. These are classed as a shrink of those pins' independence.
  The dedicated guards keep an independent `kindOf`.

### F10 — The leader's card prints two office titles. CONFIRMED (minor).

**39 leaders' cards** read like `Iovita Cicero · Headman · Elder, first of Elder Council` (rvw-thorp-3, Collemare) or
`Sakura Zhou · Headman · Household Elder` (rvw-thorp-2). The boat-headman's house honorific ("Headman") is itself a
government's office title, and it prints beside the office the person actually holds. The Power tab's seat row has it
right ("the boat-headman and Elder"); the card does not.

### F11 — The PDF golden and a DM-layer pin move at the tip and the draft record names neither. CONFIRMED.

The draft record's `surfaces` names four: generator-golden-master (519), dossier-prose-manifest (782),
herald-knowledge-desk-golden and espionage-dormancy-fence. It does not name the PDF golden or the preset-lighting
witness, as moved or as unmoved. Run at base and tip (`tests/simulation` and `tests/pdf`, each tree's own vitest):
- **the PDF golden MOVES.** `tests/pdf/goldenViewModel.test.js` "pdf.6 — golden snapshot of the SHARED_FIELDS canon
  values" is green at base and red at the tip (snapshot mismatched). Undeclared.
- **a DM-layer pin MOVES.** `tests/pdf/whoRunsThisTownDm.test.jsx` "the view model carries `dm` only on the DM layer"
  is green at base and red at the tip. Its worked town (`birth(785)`, Silberbach, a Grand Guild Consortium) no longer
  has a hidden boost. Base: 3 boosts, 1 hidden; the ruling three are Quirinus Zimmermann, Thomas Deutsch "answers to The
  Black Circle", and Philipp Meister. Tip: 2 boosts, 0 hidden; the three are Severin Koch, Folker Gärtner, and Waltrada
  Kern "answers to Thieves' Guild". This is the worked-example class the hand-back names for proseTasteInterested, in
  a directory the lane did not measure. Neither title is in the hand-back's list.
- **the preset-lighting witness does NOT move** (7 of 7 green at the tip; all of `tests/simulation` green at both
  trees). The re-dealt cast does not reach the two-settlement witness realm's hashes.

The two moved surfaces are findings: a surface moved and not named in the draft.

### F12 — `rulingStructure.js` stays at its line ceiling by packing statements onto shared lines. PLAUSIBLE (read).

The file stays at 799 lines (base 799). Line 16 holds two imports; line 166 opens the `chooseGoverning` closure with
its `let` on the same line; line 312 closes the closure, destructures its result and calls `drawCouncilOfAKind`. The
lane's own text says the ceiling "is cured by a split, never raised". This keeps the count by collapsing lines instead.
Not executed: no gate reds on it (eslint is clean on the file). It is named for the chair's reading of the ceiling law.

### F13 — A guard's red-on-corpus is wider than its seeds. CONFIRMED (the strength line of F4 and F5).

The stress-powers guard's checks 1 and 4 are sound when a fault is planted: fault 2, planted two ways, reds check 1.
But on a corpus they had not seen they red on 3 and 16 rows that their 22 seeds miss. No guard checks a crisis's power
surviving the birth (F1), or a removed power's name in text outside `factionRelationships` (F2).

---

## THE EIGHT STEPS

### Step 1 — Thirty towns read as a game master (EXECUTED; five of each size, ten under a forced crisis)

The seeds read:
- thorp: rvw-thorp-1, -2, -3, -4, and rvf-monster_pressure-thorp-0;
- hamlet: rvw-hamlet-1, -2, -3, -4, and rvf-famine-hamlet-0;
- village: rvw-village-1, -2, -3, rvf-occupied-village-0 and rvf-insurgency-village-0;
- town: rvw-town-1, -2, -3, rvf-wartime-town-0 and rvf-under_siege-town-0;
- city: rvw-city-1, -2, -3, rvf-plague_onset-city-0 and rvf-religious_conversion-city-0;
- metropolis: rvw-metropolis-1, -2, -3, rvf-succession_void-metropolis-0 and rvf-politically_fractured-metropolis-0.

Several random-dial towns also carry a random stress.

**Who leads, and from which house.** Every one of the 30 has a named leader:
- house heads with both hats, for example: a head shepherd (Elder), a boat-headman (Household Elder), a master
  fishmonger (Household Elder), a miller (Elder), a warehouse factor (Burgomaster), a castellan (Captain-Mayor), a
  pawnbroker (Alderman), a senior guild master (First Magnate), an exchange master (Doge, First Councillor);
- the sent-in ruler with one hat: the steward, the governor, the monarch;
- the criminal rulers with one hat, under the veil: the fixer, the mayor, the Shadow Senate's mayor;
- the exempt thorp's eldest (Ardburn's "Bronwyn Ryan, the eldest"; Hákonfjord's).

**The three places.** In all 30 the seat row, the card and the seat house's Connection row name the same person. Over
the whole corpus (1,845 births): the seat row names someone other than the leader 0 times; the Connection row names
someone other than the leader 0 times; an office face prints beside a house head 0 times; two cards share a name 0
times.

**The exceptions:**
- **In a vacuum:** none outside the exempt case. 0 of 1,845 are led by the office where the exemption does not apply.
  233 are exempt (thorp and hamlet mostly), and every one I read is the eldest of a place with no faced house.
- **Two contradictory titles:** F10 (Collemare, Haigang: "Headman · Elder"). F7: Palenqich
  (rvf-succession_void-metropolis-0) prints "Archmage of the Senate" on the card and on the Connection row under a seat
  row that says it stands empty.
- **A power named with no card:** none in the thirty. Three on the corpus (F4).
- **A line that reads false or strange:**
  - Sanctapolis (rvw-thorp-1) is under siege with no War Council (equal at base).
  - Lipopol's appointed governor is also "first of Noble Families" (equal at base: 69 appointed leaders lead a town
    power at both trees).
  - Four cities and metropolises print criminal faces unveiled among the Merchant Guilds' three: "the network's head",
    "the house boss" (Muulxochitl, Agiilathra, Weizhen, Waldgrund). 75 Merchant Guilds at base, 98 at the tip. This is
    the veil lane's class, named, not this lane's.
  - The pre-existing "Close enough to the two above" in a two-power thorp, made false by F1 and F2.

**Five towns as they read after the lane** (a thorp, an occupation, the rest):

```
Ormbrekka (rvf-occupied-thorp-6) — a thorp, ruled by Elder Council, under occupied + famine     ← F1: the occupier is gone
  seat row:   Drifa Haraldsson, the head shepherd and Elder
  card:       Drifa Haraldsson · Head Shepherd · Elder, first of Elder Council
  connection: (Household elder) Elder Drifa Haraldsson, the head shepherd
  Elder Council (100): first Drifa Haraldsson, the head shepherd and Elder
Umaagam (rvf-occupied-village-0) — a village, ruled by Elder Council, under occupied          ← reads right
  seat row:   Ratnakara Kapur, the miller and Elder
  card:       Ratnakara Kapur · Master Miller · Elder, first of Elder Council
  connection: (no seat house)
  Occupation Authority (63): first Gaurav Dutta, the occupying governor · second Ekalavya Basu, the bowyer
  Elder Council (37): first Ratnakara Kapur, the miller and Elder · second Ekaparnika Dubey, the cobbler · third Swati Bhatt, the cooper
Waldburg (rvw-hamlet-23) — a hamlet, ruled by Headman's Authority, under famine               ← F6
  seat row:   Ortlieb Schulz, the caravanserai keeper and Headman
  card:       Ortlieb Schulz · Host · Headman, first of Headman's Authority · first of Grain Holders
  connection: (Village headman) Headman Ortlieb Schulz, the caravanserai keeper
  Grain Holders (51): first Ortlieb Schulz, the caravanserai keeper and Headman · second Mathilde Meyer, the horse-coper · third Conrad Becker, the collier
  Headman's Authority (49): first Ortlieb Schulz, the caravanserai keeper and Headman · second Beatrix Schmidt, the militia captain · third Radbot Braun, the carpenter
Dunkelhof (rvw-town-2) — a town, ruled by Merchant Council                                    ← reads right
  seat row:   Devota Schneider, the warehouse factor and Burgomaster
  card:       Devota Schneider · Factor · Burgomaster, first of Merchant Council
  connection: (Mayor and council) Burgomaster Devota Schneider, the warehouse factor
  Merchant Council (44): first Devota Schneider, the warehouse factor and Burgomaster · second Arnold Steiner, the customs collector · third Tobias Bauer, the tavern keeper
  Merchant Guilds (35): first Zacharias Meyer, the senior guild master · second Kunizza Schwarz, the stable master · third Waltraud Gruber, the master fishmonger
  Craft Guilds (21): first Luitgard Moser, the senior craft-guild master · second Wolfger Eisenberg, the chandler · third Bertha Koch, the carriers' master
Grudino (rvf-succession_void-city-4) — a city, ruled by Royal Authority, under succession_void   ← F3, F7
  seat row:   Stands empty; 2 claimants circle: Noble Claimant (Senior Line), Noble Claimant (Reform Line).
  card:       Biljana Nikolić · Queen · first of Royal Authority · second of Noble Families
  connection: (Royal seat) Queen Biljana Nikolić
  Noble Families (29): first Yaroslav Korolev, the miller · second Biljana Nikolić, the monarch
  Religious Authorities (24): first Sonya Kovačević, the dean · second Wenceslas Loginov, the senior abbot · third Lyuben Volkov, the hospital's master
  Military/Guard (15): first Gordanka Sidorov, the garrison commander · second Dragomir Stepanov, the senior charter master · third Uljana Makarov, the watch commander
  Royal Authority (12): first Biljana Nikolić, the monarch · second Josip Gusev, the senior guild master · third Vira Romanov, the master weaver
  Noble Claimant (Senior Line) (11): No one claimant has stepped forward yet: the old families press the claim together.
  Noble Claimant (Reform Line) (9): No one claimant has stepped forward yet: the old families press the claim together.
```

### Step 2 — The guards on my corpus, and their strength

**EXECUTED: each guard's own checks, rewritten over the 1,845 tip births.**

| guard | check | rows that miss on my corpus |
|---|---|---|
| powersDualHat (the dual hat) | a leader has a house unless the government appoints (the exemption applied) | 0 |
| | a ruler of a kind has its kind among its first three | 0 |
| | a ruler of a kind has a house of its kind | 0 |
| powersOnThePage | a roster or rival power has a member | 0 |
| | the roster sums to 100 | 0 |
| | no relationship names a power off the roster | 0 |
| | a governing power of a kind has an open house of that kind | 0 |
| stressPowersFaced (the stress powers) | no power has neither a member nor a line | **3** (F4) |
| | a face the rule seats leads no other power | 0 (but 12 faces dealt by share do: F6) |
| | an appointed power is faced by a mint | 0 (39 of 39) |
| | a clandestine face is veiled | **16** (F5) |
| ladderTopRungLeader (the ladder's pin) | the governing top rung is the leader | 0 of 1,320 and 0 of 525 (base: 145) |
| | every power's top rung is its first | 0 of 4,773 (base: 87) |

The merged presume walker (`presumedThings.walker.test.js`) ran in the six-directory run: see step 8.

**EXECUTED: planted faults, one at a time, in a scratch worktree at 1a32c200a, reverted after each, never committed.
The six guard files were run each time; the clean run was green on all six.**

| fault planted | guard that reds |
|---|---|
| f1: an office-holder beside the house head (the seat house keeps its own face) | **powersDualHat stays green.** Only representatives.test.js reds (2 titles: "one card per face house"). F9 |
| f2a: the War Council's leaderless line deleted from the table | stressPowersFaced reds ("no power on the page has neither a member nor a declared leaderless line") |
| f2b: the houseless-criminal mint disabled | stressPowersFaced reds (the same check) |
| f3: the council of a kind bypassed (the top priority's choice always stands) | powersDualHat reds 2; powersOnThePage reds 2 ("a governing power of a kind has an open house of that kind", "no house is raised") |
| f4: the ladder sort without the power's own rank | ladderTopRungLeader reds 2 (the governing top rung; every power's top rung) |

### Step 3 — One person leading two powers (EXECUTED)

On the corpus, 276 cards lead two or more powers:
- 252 are the leader and the roster bloc its house deals to ("first of Elected Reeve · first of Merchant Guilds"). This
  is the dual hat, and it reads as design. At base 116 such cards existed (the office faces of royal seats and the
  like).
- 12 are the leader and a density rival (The Merchant Bloc, The Commercial Circle, The Trade Compact, The Guild
  Alliance). These read as design.
- **12 are the leader and the Grain Holders.** These read as a fault (F6).
- No other crisis power's first leads another power.

The lane's figure of 28 on its 2,460 is consistent in rate. Ten of them as they print, one line each with both powers:
- rvw-hamlet-23 Waldburg: Ortlieb Schulz, first of Grain Holders (51) and of Headman's Authority (49).
- rvf-famine-hamlet-2 Erdenhan: Dokuz Tayichi'ud, the alewife and Elder, first of Free Elder Council (57) and of Grain
  Holders (43).
- rvf-famine-village-0 Chernoka: Maxim Klimov, the boat-headman and Reeve, first of Elected Reeve (56) and of Grain
  Holders (44).
- rvf-famine-village-5 Yaxchahau: Moon Ek, the camp foreman and Household Elder, first of Household Council (53) and of
  Grain Holders (47), its only member.
- rvf-famine-town-1 Belovich: Gleb Borisov, the senior guild master and Alderman, first of Guild Council (27) and of
  Grain Holders (21).
- rvf-famine-town-2 Uaympan: Venus Woman Caan, the Alderman, first of Guild Council (25) and of Grain Holders (16), its
  only member.
- rvf-famine-city-3 Ögedeibulag: Zolzaya Uighur, the Lord Mayor, first of City Council (16) and of Grain Holders (13).
- rvf-famine-city-5 Caerwell: Aengus Sullivan, the Lord Mayor, first of City Council (26) and of Grain Holders (20).
- rvf-famine-metropolis-0 Altaiordu: Zulzaga Kereit, the First Councillor, first of City-State Council (27) and of
  Grain Holders (15).
- rvf-famine-metropolis-2 Easbridge: Padraig Johnston, the First Magnate, first of Grand Merchant Oligarchy (21) and of
  Grain Holders (15).

**Yes, a reader sees one person presented as the head of two bodies.** For the trade rivals it reads as design. For
the Grain Holders it reads as a fault: the description sets the hoarders above "any formal authority", and in Waldburg
and Yaxchahau the hoarders are the head of government by another name.

### Step 4 — The declared leaderless lines (EXECUTED; every one read beside its town)

The lines on the corpus number 32 (none on the golden's 525):

| power | lines |
|---|---|
| War Council | 8 |
| The Peerage | 5 |
| Quarantine Council | 5 |
| People's Council | 4 |
| Noble Claimant (Senior and Reform Line) | 4 |
| Monster Hunters / Adventurers | 2 |
| Grain Holders | 1 |
| The Highborn Circle | 1 |
| Conversion Enforcement Office | 1 |
| Reform Congregation | 1 |

**Read as true of the crisis:**
- The War Council's eight are all hamlets and villages with no military house of their own ("the able-bodied
  householders sit on it by turns"). One, rvf-under_siege-village-3, stands beside a Military Party led by the charter
  master, which is a little strange but true.
- The People's Council's four ("the commons speak for it in the street").
- Monster Hunters' two.
- The Conversion Enforcement Office's one ("its orders come from the faith's own seat").
- Reform Congregation's one.
- Grain Holders' one ("every household and dealer with a full bin").
- The Quarantine Council's five ("the households of each street"). In two of the five a priest stands beside it in
  Religious Authorities, refused because the priest already leads. The line is defensible; "each street" in a hamlet is
  loose.

**Not accepted:**
- **The claimants (the succession_void archetype row, 4 lines): a blank with words on it** (F3). "No one claimant has
  stepped forward yet" printed on a power named a claimant, under a seat row that names it a claimant.
- **The Peerage's line where the old families have a face on the page:** rvf-succession_void-metropolis-7. "the old
  families press the claim together" stands two rows below Noble Houses' first, a college master. The others are
  acceptable.

### Step 5 — A power removed and still named (EXECUTED)

185 towns on the corpus lose 202 powers base → tip. Of these, the fold and the not-built rule are by design, and F1's
19 are not. The text left behind is F2: 9 History-tab tension chips, 18 surviving descriptions, 4 lone powers that rank
themselves against others, and F1's secret and crime lines. Searched case-sensitively, then case-insensitively. The
case-insensitive hits that are generic prose were set aside ("religious authorities who wanted a centre", "the reform
movement" in a hook).

Two old government names were searched: Arcane Council and Priestly Guidance, where the council of a kind renamed the
seat. Neither is left anywhere in the same town's text.

### Step 6 — What moved that was not meant to (EXECUTED; whole-record field diff, base against tip)

The golden's 525: 519 differ (the draft's 519 holds), 6 identical. My corpus: 1,294 of 1,320 differ.

The leaf families that move are, outside the cast, the families the cast feeds:
- relationships, the prominent relationship, tensions, conflicts' parties, prose and hooks, the stress cast's roles,
  levers and stakes;
- the simulation trace, the coherence receipt's evidence;
- the roster where the fold, the not-built rule and F1 cut it: `powerStructure.factions[].faction`, `power`,
  `powerLabel`, `isGoverning`, `governingName` / `government` (60 towns: the council of a kind), `factionRelationships`;
- `availableServices` and `institutions` in 1–2 towns (the faction boost under a new government, as the 2B note says).

`culturalIdentity.*` and `culturalNotes` are PRESUME's culture profiles, not this lane's.

**Labels:**

| label | moved | direction | declared? |
|---|---|---|---|
| stability | 7 | — | PRESUME's Fragile wording (531953458), not this lane's |
| legitimacy (publicLegitimacy) | 0 | — | — |
| prosperity | 0 | — | — |
| defence (the safety profile's guard text) | 1 | — | the 2B note's institution moves |
| **capture** | **47** | **24 toward danger**, one to full capture | **F8: not as declared** |
| **coup label** (rulingPowerCoup.js, each tree's own reader) | **76** | every one toward safety: Contested → Stable 46, Holding → Stable 14, Contested → Holding 11, Critical → Contested 4, Critical → Holding 1 | the fold's safety is declared. **At least 7 are false safety from F1**: rvf-occupied-thorp-6 and rvf-occupied-hamlet-5 read Stable under an occupation with no occupier on the page; rvf-famine-thorp-0, rvf-wartime-thorp-2 and rvf-slave_revolt-thorp-5 read Stable with the crisis's power gone |
| powerLabel by power name | 10 | Minor → Significant 5, Significant → Strong 4, Strong → Dominant 1 | follows the roster's renormalisation after the fold and F1 |

### Step 7 — The simulation

**(a) The ladder (EXECUTED).** At first light the governing top rung is the leader in 1,320 of 1,320 corpus births and
525 of 525 golden births. At base it was not, in 145. Every other power's top rung is its own first in 4,773 of 4,773.

The lane's pin (ladderTopRungLeader's third check) is green in the six-directory run. **My own pin on a different saved
world:** 16 towns where base's top rung was not the leader, lit by the BASE code and saved (80 ladders), then stepped
four weeks by the TIP code. The tip's step equals base's step on 80 of 80 and keeps the lit rungs on 80 of 80. A world
lit before the lane does not move.

**(b) Ten realms of my own seeds (EXECUTED).** The recipe is statecraftExposureBand's seeded run (composeReaderRegion,
the deity case seated, head on, twenty years); only the seed changes, `rvr-1` … `rvr-10`; base and tip. Mobilizations
are counted the test's own way: `war_mobilization` raw wizard news (impactKind, else kind). NPC acts are the four
kinds' raw news (npc_sabotage, npc_bargain, npc_reform, npc_suppress) per realm-tick.

| | base | tip | change | the rule's line |
|---|---|---|---|---|
| realms that ever mobilize | 10 of 10 | 10 of 10 | 0 | a fall of more than a third: **not crossed** |
| total mobilizations | 1,288 | 409 | **−68%** | a fall of more than half: **CROSSED, by the letter** |
| the same, without rvr-7 | 234 | 266 | +14% | — |
| NPC acts per tick, the four kinds | 0.6778 | 0.6653 | −1.8% | a fall of more than a fifth: **not crossed** |
| every npc_* act per tick | 1.2051 | 1.1867 | −1.5% | — |

Per realm, base/tip: 1 18/38, 2 62/65, 3 25/25, 4 7/7, 5 27/27, 6 3/5, **7 1,054/143**, 8 64/71, 9 14/14, 10 14/14.
The whole fall is rvr-7. At base it stands mobilized every week for twenty years (66, then 52 every year). At the tip
its war ends by conquest in year 3 (70, 52, 21, then 0; conquest 1, war_drain 4). So **my ten do not agree with the
lane's twenty on the letter of the rule fixed in advance**: line 2 is crossed. By mechanism the cross is one war that
ends rather than wars prevented. Nine realms are equal or higher. I put it to the chair as crossed and do not wave it
off; the rule is the chair's to apply.

### Step 8 — The gates and the claims (EXECUTED)

- `sh scripts/gate-tail.sh node scripts/check-domain-strict.mjs`: exit 0 ("1113 errors, ceiling 1113").
- `sh scripts/gate-tail.sh npm run typecheck:ratchet`: exit 0 ("167 error(s), ceiling 167").
- eslint on the lane's 24 own `src` files (its first-parent, non-merge commits), through gate-tail: exit 0.

**The six directories at the tip** (one foreground-bounded vitest run of tests/generators, domain, property, lint,
build and architecture, JSON reporter): 24,636 pass, 55 fail, 146 skip, 7,779 suites.
- **58 failing titles.** 54 of them are exactly the hand-back's 54, matched title by title:
  - the 17 goldens and their null-change pins;
  - the 5 digests and fixtures (x46NpcBand, institutionBudgetPromise, intentAtlasSoakDistiller, landingFixtureFreshness 2);
  - the 7 measured figures (hookThemeDraws, generationForkCensus A1 A6, editCorpusRatchet A3 A5 A7, mergeLadderHeldKeys A3);
  - proseFamilyContract A1 A2 A3 A5;
  - the 3 worked-example towns (proseComposed A13, proseTasteInterested 2);
  - writerReach 9; observedShapeReaders 5; newsVoiceContract, newsHeadlineContract;
  - statecraftExposureBand; ledgerCitationIntegrity (base's own).
- **The other 4** are distribution.test.js ("cities average a higher population than towns"), magicBufferIntegration K3
  6, and urbanBandInstitutions G3 and G6. All four failed with STACK_TRACE_ERROR (timeouts) while my probes loaded the
  machine (load average about 10 on 4 cores). Re-run alone at the tip they are 60 of 60 green. They are load, not the
  lane. **The tip's set equals the hand-back's 54.** The base run of the six directories was not repeated; the
  hand-back's base figure of 1 (ledgerCitationIntegrity) is taken as read.
- presumedThings.walker (the merged presume walker) is green at the tip.

**The six golden surfaces** (the chair's addition; `tests/simulation` and `tests/pdf` run at base and tip):

| surface | the draft record | measured |
|---|---|---|
| generator golden master | re-record, 519 | moves: 519 of 525 differ (my whole-record diff; the test is red) |
| espionage dormancy fence | re-record | moves (red) |
| dossier prose manifest | re-record, 782 | moves (3 titles red) |
| Herald desk's golden | re-record | moves (red) |
| **PDF golden** (tests/pdf/goldenViewModel) | **not named** | **moves: green at base, red at tip. F11** |
| **preset-lighting witness** (tests/simulation) | **not named** | does not move: 7 of 7 green at the tip |

`tests/simulation` at base: 717 pass, 0 fail (with tests/pdf). At the tip: 715 pass, **2 fail**: the PDF golden and
`tests/pdf/whoRunsThisTownDm.test.jsx` (F11). Every simulation title is green at both trees.

**Every change under `tests/` and to a baseline or register (the lane's own first-parent commits):**

| file | class |
|---|---|
| ladderTopRungLeader, dualHatReaders, powersDualHat, powersOnThePage, stressPowersFaced (new); hallCapture, ties, presumeCorpusSeeds (a case added each) | new guards and pins |
| seatHolder.test (M-1b), terrainPoolsSeat, castPowers.test (FLOOR 1 and 2), representatives.test | a door's re-take with its cause, but the expectation is computed with the implementation's own functions: **a shrink of the pins' independence (F9)** |
| castPowers.test's fixture, the castellan now leads (00823a145) | a door's re-take with its cause |
| powerCardOrderReads (a row re-keyed, one row added) | a door's re-take with its cause |
| rosterDuplicateDraws 899 → 834 → 823 | a re-take with its cause; **its consequence is F1 (a finding)** |
| mundaneRealmAcceptance (factions 12 vs 11) | a re-take with its cause (the fold) |
| phoneChromeFloor (+2 floored, three routes); lighting census (re-frozen by its own command, several times); prose-numerics (line identities); retired-field-sites (line identity, twice); ruinFilterRoster (109 → 110, one EXEMPT row with its reason) | the instrument's own re-take |
| presumedThings.register (the stale bank "figure" row removed, fbbaa82e6) | a shrink, in the register's own direction |

Nothing was banked into the test ratchet's baseline; no skip was added (searched in the diff).

---

## WHAT I DID NOT DO

- No commit on the lane, no fix, no pull request.
- The planted faults and the logging lived in a scratch worktree and were reverted after each run.
- The NPC-act metric in step 7(b) is my own reading of "acts per court-tick" (raw news of the four kinds per tick), not
  the lane's `pop.mjs`, which is not in the repository.
