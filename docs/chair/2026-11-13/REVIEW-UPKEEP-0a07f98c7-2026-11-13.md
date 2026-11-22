# REVIEW-UPKEEP-3 — the derived defence and its page, `lane/coherence-upkeep-2026-11-12` at 0a07f98c7 (base 65cb03ef1)

> Read cold. §1 was written, committed and pushed before the lane's hand-back
> (`docs/chair/2026-11-12/UPKEEP-HANDBACK.md`) or any commit body after 65cb03ef1 was opened.
>
> **One disclosure.** Fetching the lane printed three commit subject lines in my context, one line each, no
> bodies: `0a07f98c7 docs(COHERENCE-UPKEEP-6): hand back by file — rulings A to E, the alchemist measure, every new
> sentence for the owner's veto`, `13782cf82 fix(COHERENCE-UPKEEP-6): count once, every magic house — reading A, a
> declared move (ruling 4; the chair's ruling E)`, `c72917251 fix(COHERENCE-UPKEEP-6): the two-label sentence in
> its own home (ruling D)`. I also read the source diff 65cb03ef1..0a07f98c7 (code, not prose of the builder's) to
> build my probes. Nothing else of the builder's was read before this section was pushed.

## VERDICT (written after §1 was pushed at 141151b38)

| Cure | Verdict | Worst finding |
|---|---|---|
| **A** one home for pay on every surface | **CLEAR** for what it cures | Residue, MEDIUM (C-M2, carried, for the chair): the crisis's own spending line still disagrees with the band on 201 births |
| **B** hired swords only where a company is contracted | **CLEAR** | — |
| **C** the two-label sentence leaves the realm register | **CLEAR** | Residue, MEDIUM (C-M3, listed by the ruling, not cured): the row says "at peace" of a besieged town |
| **D** the sentence in its own home | **CLEAR** | LOW (C-L1): "before the war and the betrayal; Poor while they last." |
| **E** count once, the first half | **NOT CLEAR** | HIGH (C-H1): the town's Magical Capability rating falls on 206 births; it now contradicts the Magic tab and the PDF, and plants a "Magical instability" threat in the AI prompt |
| the martial will is not a paid part | **NOT CLEAR** | MEDIUM (E-M1): pay still reaches the will on 11 births; MEDIUM (C-M1): 6 births made to say "Strong" beside "an attacker walks in" |
| the earthwork's row leaves the table | **CLEAR** | — (births byte-identical, 1,440/1,440) |
| the PDF's money line reads its row's score again | **CLEAR** | — |

**Findings by rank:**
- HIGH 1: C-H1.
- MEDIUM 7, each EXECUTED:
  - new at the tip: C-M1, E-M1, E-M2;
  - carried from the base: C-M2, C-M3, C-M4, C-M5.
- LOW 9:
  - from §1: C-L1 to C-L6, EXECUTED, and C-L7, PLAUSIBLE;
  - from §2: E-L1 and W-L1, EXECUTED.

**THE ONE THING THE CHAIR MUST RULE.** Count-once is a rule about the readiness *sum*. The cure applies it to the
magic *presence*, and the magic presence is also the whole of the town's Magical Capability score: no named
house's own part feeds that score.

Either:
- **(a)** the named houses leave the presence for the readiness sum only, and the magical score keeps them. The
  Magical Capability band, the PDF's "Magical n/100", "It leans on magic to hold", the Magic tab and the AI
  threat then go back to agreeing;
- **(b)** the falls stand, and then the Magic tab, the PDF's readiness strip and the AI threat each need a ruling
  of their own.

## §1 — COLD: every false or contradicting sentence, and every machinery sentence

### The births

- **The earlier reader's 1,200.** These are the `rv2-<crisis>-<size>-<i>` seeds: five crises (calm, famine,
  siege, wartime, succession void) × six sizes × 40.
- **The earlier reader's 210 fresh ones.** These are the `rv3-…` seeds in `fresh.seeds`: all fifteen crises ×
  village, town, city and metropolis × 3, plus five pairs.
- **Thirty of my own.** These are the `rv4-…` seeds in `own.seeds`: five of each size, a siege and a famine
  in every size. They include two events at once (betrayal + conversion), an event with a war, a siege with a
  famine and a famine with a war.
- **The app's own shape, for every birth.** `birthConfig({...DEFAULT_CONFIG, settType, selectedStresses,
  selectedStressesRandom:false})`, then `generateSettlementPipeline(cfg, null, {seed, customContent:{}})`.
- **1,440 births, each rendered at 65cb03ef1 and at 0a07f98c7**, in detached scratch worktrees (`render4.mjs`).
  The surfaces:
  - the twenty dossier tabs, the Tonight sheet, the PDF's text and the Foundry journal, through the repo's own
    soak harness;
  - the AI layer prompt and the grounding payload;
  - the realm register's row, player and owner (`heraldRegister.js :: gazetteerRows`, a campaign with no war on
    its map);
  - the WHOLE world-export dossier, player and DM. The earlier reader rendered only its `defenseProfile`.
- 2,880 dumps; 0 render errors.

### What moved, base → tip, on my 1,440

- **The readiness score moved on 456 births:** 322 down, 134 up; min −5, max +3, mean −1.57.
- **60 births changed band:** Fortress → Well-Defended 47; Undefended → Vulnerable 5; Vulnerable → Lightly
  Defended 4; Well-Defended → Defensible 3; Lightly Defended → Defensible 1.
- The parts sum exactly to the score at both trees (1,440/1,440 each).
- **The magical score moved on 396 births, and the "Magical Capability" band on the Overview on 206:**
  Adequate → Weak 129, Strong → Adequate 75, one each Weak ↔ Critical.
- **Surfaces that moved (births):** PDF 1,253; world export (DM) 589 and (player) 589; realm register 920;
  AI grounding 330; Overview 262; AI layer prompt 238; Substrate 187; Defense 155; Foundry 91; Power 60;
  Economics 33; Relationships 11; Plot hooks 9; Tonight 7; NPCs 4; Institutions, Faith and Magic 1 each.

### How they were read

- **By eye:** all thirty of my own births, through `eye.py`. That covers the Defense tab to its forces, the
  Overview's health strip, the Economics glance, the Tonight sheet's defence lines, the PDF's money, invasion
  and beast rows and its readiness strip, and the register row, each line marked where the base printed
  otherwise.
- **Also by eye:** the births the classes below threw up: `rv2-calm-city-37`, `rv2-calm-town-4`,
  `rv2-calm-town-20`, `rv2-famine-city-0`, `rv2-under_siege-village-30`, `rv2-calm-city-0`.
- **By class over all 1,440 at both trees:**
  - the earlier reader's `classes3.py`, unchanged, so the counts compare like for like;
  - my `payclasses.py`: every pay sentence on every surface against the Economic Survival band;
  - `pairdiff.py`: every line moved, per birth;
  - `newlines.py`: every line no base page prints, masked for the town's name and numbers;
  - the one-off counters quoted with each finding.

### The cold list

The marks:
- **AT TIP ONLY** means the town prints it at 0a07f98c7 and not at 65cb03ef1.
- **BOTH** means it prints at both trees.
- Every count is births of my 1,440.

#### HIGH

**C-H1 — a town's magic houses no longer count toward its Magical Capability rating. AT TIP ONLY, 206 births,
EXECUTED.** The magical score is fed by the magic presence alone, and the named houses have left the presence.
The houses are the wizard's tower, mages' guild, alchemists, apothecary, grove, hedge wizard and divine healer.
So the shown "Magical Capability" falls on towns whose magic is those houses. It fell into Weak on 97 births
that have a Wizard's tower or a Mages' guild. The four sentence classes it makes:

- **The Overview against the Magic tab: 82 made at tip** (20 at base, 102 at tip).
  - `rv2-calm-city-0`: the Overview reads **"Magical Capability Weak"** (Adequate at base; the score went from
    57 to 39).
  - Its Magic tab reads **"Magic · Common"** and **"Reliance on magic: Integral"**. Its roster lists a Wizard's
    tower and an Alchemist quarter under Arcane defense.
- **"It leans on magic to hold." beside Magical Capability Weak: 113 made at tip** (145 at base, 258 at tip).
  - The sentence is on the PDF's readiness strip and the Foundry journal.
  - Example, `rv2-calm-city-0`: PDF *"Fortress: city walls and gates, held by the professional city watch. It
    leans on magic to hold."* beside the Overview's "Magical Capability Weak".
- **The PDF prints the fallen figure itself:** `rv2-calm-town-4` *"Magical / 33/100"* (40/100 at base).
- **The AI prompt gains a threat the town does not have: 129 births made at tip** (278 → 407 births carry
  "magical instability"). All 129 are the Adequate → Weak births.
  - `rv2-calm-town-4` (calm, a wizard's tower, Well-Defended) gains `{"type": "arcane_instability", "label":
    "Magical instability", "description": "Magical effects in or around the settlement are unreliable or
    dangerous.", "source": "defenseProfile", "visibility": "rumored"}`.
  - It also gains *"Children are warned about the road past sundown; shimmering air and unfamiliar lights."*
    and *"Locals will not openly discuss magical instability; or the matter referenced as "the wound"."*
  - A weaker magical *defence* reading is turned into wild magic in the world, and the AI layer writes from
    this payload.

#### MEDIUM

**C-M1 — "Invasion & War: Strong" beside a line that says an attacker walks in. AT TIP ONLY on 6 births
(classes A1 and F); the classes are BOTH. EXECUTED.**
- `rv2-under_siege-village-30` (Penleigh, Undefended, a palisade and a village watch, under siege): **"Invasion &
  War — Strong"** (Adequate at base) above *"Penleigh has walls and nobody to put on them. A determined attacker
  takes this village with ladders and patience, and requires nothing else."* The posture above both reads
  *"Penleigh is all but undefended."*
- Also `rv2-under_siege-village-39` and `rv2-wartime-hamlet-5` ("nobody on them" beside Strong).
- And `rv2-calm-village-18`, `rv2-wartime-hamlet-23` and `rv2-wartime-hamlet-5` (*"could not hold off a raid"*
  beside Strong).
- On each, only the martial will's part moved (e.g. 4.1 → 5.1, 3.1 → 4.0). The military score crossed 65.
- Class totals: A1 56 → 59, F 14 → 16.

**C-M2 — two pay sentences on one page still disagree: the crisis's own spending line against the Economic
Survival band. BOTH (224 → 201), EXECUTED.**
- `rv2-famine-city-0` (Inverford), Defense tab, three sentences:
  - *"No one can earn a normal living while the famine lasts, and every coin goes on food."*
  - *"The city may not come through this crisis, and what it spends on defence now only buys time."*
  - *"Trouble at Inverford has not turned into a collapse, because the city can pay its way through it."*
  - The PDF adds *"Money enough to ride out a long crisis."*
- `rv4-wartime+recently_betrayed-metropolis-0` (Rajithal, "Prosperity: Poor"): *"The war takes most of the
  money"* above *"Rajithal's accounts have money in hand"*.
- `rv4-occupied-town-0` (Kilwell): *"The occupiers take the revenue"* above *"Kilwell can pay for a crisis of
  the ordinary length"*.
- The two-label line beside these explains the label. It does not reconcile "every coin goes on food" with
  "can pay its way through it". This is the earlier reader's 1b-M3, carried.

**C-M3 — the realm register says "at peace" of a town at war or under siege. BOTH (525 of the siege and war
births), EXECUTED.**
- `rv4-under_siege-city-0` (Eldby, "Active siege", "Safety: Desperate") → *"A struggling city, at peace."*
- `rv4-wartime+recently_betrayed-metropolis-0` (Rajithal, "War footing") → *"A poor metropolis, at peace."*
- The war word reads the campaign's map (no war on it here). The town's own pages say siege or war.
- At base the row went on *"Prosperous before the siege; Struggling while it lasts."*. That clash inside the
  row is gone at tip. The clash with the town's own pages is not.

**C-M4 — the machinery on the page and in the player's export. BOTH, EXECUTED.**
- **The PDF, 1,440/1,440:** prints every defence score as a figure (*"Monster 74/100 · Economic 78/100 · Magical
  33/100 · Disaster 56/100"*) and *"Readiness / Well-defended / Score avg / 67"*, an average of five scores.
- **The Power tab (DM), 1,313 births:** prints *"Public legitimacy / 72 Approved / Breakdown / Prosperity +15 /
  Defense +7"*, the defence rating as the points it adds to a sum.
- **The PLAYER world export:** carries `publicLegitimacy.breakdown {prosperity, safety, defense, food}`,
  `govMultiplier`, `crimMultiplier`, per-power `weight` (e.g. 42.0967…), `readiness.score` and the five scores.
- None of it is new at tip; the figures move with the ratings. The defence lane's own parts appear nowhere
  (§4).

**C-M5 — the earlier classes, carried. BOTH, EXECUTED** (`classes3.py`, base → tip):

| Class | Base → tip |
|---|---|
| A — "nobody on the walls" with a force present | 151 → 151 |
| B — "no line and no force" with a force present | 36 → 36 |
| D — an untroubled posture under siege or war | 80 → 77 |
| E — "all but undefended" beside walls and a force | 64 → 63 |
| K — Defensible beside a cannot-hold line | 8 → 8 (`rv2-calm-town-38` new at tip, one gone) |

Read by eye on my own births:
- `rv4-calm-village-0`: *"You will see the local watch on the rounds"* and *"Tikalek has no line and no
  force"* under "Invasion & War — Adequate".
- `rv4-under_siege-thorp-0`: *"Vallefossae's defences are sound, but fewer people turn out each season to man
  the palisade"* beside *"Vallefossae is all but undefended."* "Defences are sound" beside undefended or no
  force: 125 → 123 births.
- `rv4-occupied-town-0`: *"the town could not hold off a raid"* (tab) beside the PDF's *"Professional garrison
  without perimeter walls. Effective against raiders"*.

#### LOW

- **C-L1 (BOTH, EXECUTED): an event read as a spell of time where it is named beside a crisis that lasts.**
  `rv4-wartime+recently_betrayed-metropolis-0`: *"Prosperous before the war and the betrayal; Poor while they
  last."* (7 lines, 1 birth). The betrayal does not last.
- **C-L2 (BOTH): a crisis that lowers nothing is named.** *"Poor before the succession crisis; Struggling while
  it lasts."* (3 births); *"…before the debt crisis and the succession crisis…"* (6).
- **C-L3 (BOTH): the Foundry journal prints raw category keys as a power's name.** *"Member of: magic"*,
  *"criminal"*, *"other"*, *"religious"*, *"economy"* (107 births), and the people table's *"| Grettir
  Ulfsson | the guild archmage | magic | 9 |"*.
- **C-L4 (BOTH; new instances at tip): the AI grounding's own grammar.**
  - *"Religious Authorities's mark"*;
  - *"Recent changes: Recent changes: …"*;
  - *"Children are warned about the road past sundown; the road past sundown; …"*;
  - *"wandering off: bread is short"*.
- **C-L5 (BOTH): the Economic Survival row with no sentence under its band** (6 births; the next line is
  "Disasters & Famine").
- **C-L6 (BOTH): a band beside a sentence of another band.** PDF *"Beasts & Monsters / Weak / Safe heartland
  with minimal creature activity. Existing defenses are appropriate."* (`rv4-recently_betrayed-town-0`). PDF
  *"Beasts & Monsters / Critical / Palisade and citizen militia provide a viable but demanding posture"* on a
  thorp with a household levy (`rv4-under_siege-thorp-0`).
- **C-L7 (PLAUSIBLE, from the source, not an image): the PDF's Economic Survival row is coloured on its own
  60/35 ladder.** The band reads 65/40. A score of 60–64 prints "Adequate" in the "Strong" green; 35–39 prints
  "Weak" in amber.

#### Not a false sentence, but a move the cures do not name (AT TIP ONLY, EXECUTED)

- **The 60 births whose readiness band moved are exactly the 60 whose Power tab moved.** The band feeds public
  legitimacy (*"Defense +10"* → *"+7"*) and the power reconcile.
- **On ten cities the powers themselves change.** `rv2-calm-city-37` (Stormfjord, Fortress → Well-Defended):
  - the "Arcane Orders" and "The Arcane Circle" powers are gone;
  - "Religious Authorities" and "The Faithful Assembly" take their places;
  - the guild archmage is "In no power";
  - relationships, NPC goals and plot tensions are re-drawn: 310 masked lines new on this one birth.
- The same on `rv3-religious_conversion-city-2`, `rv2-calm-city-39`, `rv3-occupied-city-1`, `-2`,
  `rv2-calm-city-11`, `-19`, `-10`, `-4` and `-6`.

### Every line no base page prints (masked for the town's name and numbers): 3,249 distinct, each read

- **Register (10):** the bare rows *"A struggling village, at peace."* and so on. The two-label sentence has
  left (C-M3).
- **Pages (2,051):**
  - **The two-label sentence's new forms.**
    - The PDF's led form, *"Prosperity: Prosperous before the siege; Struggling while it lasts."*
    - The event form *"… before the betrayal; Comfortable since."*, *"… before the conversion; Moderate
      since."* and *"… before the betrayal and the conversion; Poor since."*.
    - All are plain and true but C-L1.
  - **Guard-line recombinations.** Existing clauses, without the "Hired swords" clause on towns with no
    contracted company.
  - **The PDF's "late" rung where a garrison stands:** *"The defenders are already paid late; a long crisis
    would empty the reserves and wear out the garrison's patience."* (4 births). This is an existing sentence
    newly reached.
  - **The readiness strip at its new band:** *"Lightly defended: no walls; the citizen militia is all that stands
    guard. It leans on magic to hold."*
  - **The power, relationship and NPC re-draw** on the ten cities above.
  - **The AI grounding's magic-instability lines** (C-H1).
- **World export (1,188):** the same re-drawn relationships and tensions, and the moved scores.
- **No new line names a part, a point, a share, a weight, a limit or a slider** (the full search is §4).

### Probes (`docs/chair/2026-11-13/probes/REVIEW-UPKEEP-3/`)

`render4.mjs` (every surface, with the register and the whole export), `scan4.mjs` (per-birth record with the
computed parts), `payclasses.py`, `pairdiff.py`, `newlines.py`, `eye.py`, `digest.py`, `machinery.py`,
`countonce.mjs` (for §2E), `own.seeds`.

---

## §2 — THE CURES, each apart, by my own execution on the same births

The hand-back was opened only after §1 was pushed.

### Method: one scratch tree per changed commit

I built a scratch worktree at each changed commit and hashed every birth's whole stored record at each
(`hashscan.mjs`). Every move is then charged to the commit that made it. A "record" is the whole
`generateSettlementPipeline` output.

| Step (commit) | Records differ | Readiness moves | Band moves | Other |
|---|---|---|---|---|
| d585d51f5, the earthwork row leaves | 0 | 0 | 0 | births byte-identical |
| d398faebe to c893b4998, the PDF money line | 0 | 0 | 0 | display only |
| 008fc3328, the will unpaid | 190 | 137, all up (mean +1.07, max +3) | 11 up | military 182, internal 55, economic 31, magical 17 (through limit 1); power 11; a crisis's severity band 4 |
| b79970bec, A | 28 | 0 | 0 | the guard line only |
| 22a8a956b, B | 9 | 0 | 0 | the guard line only |
| 6c8501fcc and c72917251, C and D | 0 | 0 | 0 | display only |
| 13782cf82, E | 402 | 325, all down | 51 down (Fortress → Well-Defended 47, Well-Defended → Defensible 4) | magical 381, economic 27, military 7, monster 5; guard line 23; power 51 |

### A — one home for pay: CLEAR for its cure (EXECUTED, `payclasses.py`, 1,440 births)

| Class | Base | Tip |
|---|---|---|
| The PDF's band word against its own money sentence (A2) | 670 | 0 |
| The PDF's band word against the tab's (A1) | 0 | 0 |
| The tab's band against the stored score (A0) | 0 | 0 |
| A guard purse clause beside a band it is not true under (A4) | 26 | 0 |
| A short-purse guard line beside a can-pay line (the third read's J) | 5 | 0 |
| "When the purse allows" beside "money in hand" (L1) | 2 | 0 |
| The export's stored guard line against the page's | — | 0 |

- **The A2 row at base** is the third read's 83 in its widest form: the 83 were the births where the two said
  opposite things.
- **The A4 row at base:** "when the purse allows" under a Strong band 5; "Hired swords back the garrison."
  under Adequate 5; the charter hall's "as far as the purse runs" under Weak 16.
- **The tab's own sentences:** every Economic Survival sentence on the tab sits under one band only, so the
  pools agree with the PDF's rungs. Only C-L5's empty row prints under two bands.
- **A saved town** (§5) moves only onto its own badge.
- **The brief's wider question, "do any two pay sentences on one town's pages still disagree?" Yes, on 201
  births (224 at base): C-M2.** The crisis's own spending lines read the crisis, not the band:
  - "every coin goes on food";
  - "The war takes most of the money";
  - "The occupiers take the revenue".
  The hand-back routes this residue (1b-M3) to ruling 8's declaration at the final tip. I hold A CLEAR on the
  cure it was given and leave that residue to the chair.

### B — hired swords only where a company is contracted: CLEAR (EXECUTED)

- **The third read's seven:**
  - `rv2-under_siege-town-1`, `rv2-wartime-town-9`, `rv2-wartime-town-10`, `rv2-under_siege-town-4`,
    `rv2-under_siege-town-15`, `rv2-succession_void-town-2` and `rv2-famine-town-8`;
  - 4 "Hired swords" lines each at base, 0 at tip;
  - every one holds a Free company hall, five of them also a charter hall, and none a contracted company.
- **Over all 1,440:** "Hired swords" prints on 376 births at tip, every one with a contracted company in the
  defence home (385 at base, 9 without).
- No birth with a company lost the line (376 → 376).

### C — the two-label sentence leaves the realm register: CLEAR (EXECUTED)

| Surface | Labels differ (920 births) | Labels equal (520 births) |
|---|---|---|
| Overview | 920 | 0 |
| Economics glance | 920 | 0 |
| PDF | 920 | 0 |
| Foundry | 920 | 0 |
| Realm register (player and owner) | 0 | 0 |
| Tonight, Defense tab, both exports, both AI payloads | 0 | 0 |

- **The register row:** the sentence is on 0 of 2,880 rows at tip (1,840 of 2,880 at base).
- **The Summary tab and the public and player Overview** print it (`player.mjs`, four births, including the
  "since" form).
- **The register's "at peace" beside the town's own siege or war** was listed by the ruling, not cured: C-M3.

### D — the sentence in its own home: CLEAR (EXECUTED)

- **Every form on every surface** at tip, 24 distinct forms, was read:
  - **fourteen crisis nouns:** siege, famine, war, split between the powers, revolt, raids (plural), migration,
    insurgency, conversion, betrayal, debt crisis, outbreak, occupation, succession crisis;
  - **pairs:** famine and war, siege and outbreak, migration and insurgency, debt crisis and succession crisis,
    succession crisis and famine, siege and famine, war and famine, war and betrayal, outbreak and debt crisis,
    betrayal and conversion.
- **"since"** prints where every named crisis is an event (betrayal 91 lines, conversion 91, the two together
  49).
- **The PDF leads it with its word** on the cover, the Overview chapter and the Economics chapter
  (*"Prosperity: Prosperous before the siege; Struggling while it lasts."*, directly under the cover's "SAFETY /
  Desperate — Active Siege / Defense: Well-Defended").
- The screen and the Foundry keep the bare sentence, beneath their own Prosperity row.
- Plain, true, no machinery. Two LOWs:
  - C-L1: an event beside a lasting crisis still reads "while they last";
  - C-L2: a crisis that lowers nothing is named. The builder left D(ii) and said why.

### E — count once, the first half: NOT CLEAR (EXECUTED)

**The rating equals the sum of its parts exactly:** 1,440/1,440 at tip (`scan4.mjs`), and 330/330 in the
count-once probe.

**The readiness move is as the builder states.**

| | Births | Moved | Mean | Band down |
|---|---|---|---|---|
| Builder | 3,756 | 899 (24%) | −2.43 | 104 (2.8%) |
| Mine | 1,440 | 325 (22.6%), all down | −2.66 over movers (min −5) | 51 (3.5%) |

The military and monster moves of ±1 (12 births) are limit 1's apportionment: `sustainsHeld` shrinks as the
magic part does. Explained.

**The count-once test** (the earlier reader's: drop each house alone and recompute; `countonce.mjs`, 300 claims
seeds and my 30): births where one house moves two parts fall from 55 to 14.

| House | Parts it moves | Births | Status |
|---|---|---|---|
| Alchemist shop | arcane + alchemists | 10 | known, ruled to a later seat |
| Druid Circle | druids + magic | 1 | **not on the eight-house list**: it is its own named part (druids) and stays in the magic presence. `rv2-under_siege-village-6`: magic part full 7.0 with it, 6.6 without (E-L1, EXECUTED) |
| Hedge wizard | arcane + magic | 2 | **left the presence**, yet in a village it is the house that opens the small-place gate. Dropping it removes the whole magic part (7.4 → none) |
| Healer (divine, 1st level) | hospital + magic | 1 | same gate; dropping it removes the magic part (6.6 → none) |

The gate cases are `rv2-famine-village-6`, `rv2-under_siege-village-3` and `rv2-famine-village-7`. The house
still counts twice: once as its part, once as the switch on a magic part that the dial alone fills.

**What E moves that the hand-back does not name (EXECUTED):**

- **E-H1, the same finding as C-H1.** The magical score moves on 381 births at this commit, and the Magical
  Capability band on 206 of my 1,440 at this commit alone: Adequate → Weak 129, Strong → Adequate 75, Weak →
    Critical 2. The will commit moved 2 others, Critical → Weak, which is why §1's base-to-tip net shows one each
    way. Its four classes are in §1 (82, 113, 129 births, and the PDF's figure).
  - The magical score is fed by the magic part alone (`defenseGenerator.js`: `add('SUSTAINS', 'magic', { mag:
    presence })`). The arcane part feeds military, monster and internal; alchemists and the hospital feed the
    economic score; druids feed monster.
  - So no named house was ever counted twice *in the magical score*. The cure takes the houses out of the one
    rating that measured them.
  - The hand-back says "the magic part's mean 11.7 → 10.3" and reports the readiness moves. It says nothing of
    the Magical Capability rating, the Magic tab, the PDF's readiness strip or the AI threat.
- **E-M2, the power re-draw, 51 births here (60 with the will).** The births whose readiness band moves are
  exactly the births whose power structure moves (51 of 51), through public legitimacy and the power reconcile.
  - On ten cities whole powers appear or vanish, and the NPCs' factions, relationships, goals and plot tensions
    are re-drawn.
  - `rv2-calm-city-37`: Arcane Orders and The Arcane Circle gone; Religious Authorities and The Faithful
    Assembly in; the guild archmage "In no power".
  - This is the estate's coupling, not a sentence made false. But "a declared move" here declares the readiness
    move only. The chair should know a band move re-draws the town's politics.
- **The guard line changes on 23 births and the economic score on 27.** Both come through limit 1's hold (the
  builder's "88 rise ... 8 births" on its own count). Explained.

## The smaller changes since 65cb03ef1

**The martial will is no longer a paid part: NOT CLEAR (EXECUTED).**

What it does:
- 137 births rise, none falls; every mover stands Moderate (49), Poor (87) or Struggling (1).
- Comfortable and above: 0 move. Band moves: 11, all up.

What stops it:
- **E-M1 — pay still reaches the will outside its hold.** The ruling: "pay reaches it only through that hold".
  - On 11 of 1,440 births the will's points still move with pay, with no hold binding and no crisis touching
    it (`willpay.mjs`).
  - Example: `rv2-calm-hamlet-14`, Poor: the will reads 2.6 at its pay and 4.0 at full pay. The others are
    calm hamlets and villages with a charter hall.
  - The commit changed only the branch with a standing body. The other branch,
    `rate = hired ? D.none + D.hiredExtra * keep.bought : D.none`, still scales the will by `keep.bought`.
  - Its red-first test (`defenceParts.test.js`, "the martial will is not paid …") passes at the tip because
    its corpus never meets that branch.
- **C-M1 — the rise makes 6 contradictions at the tip.** The military score crosses 65, so "Invasion & War:
  Strong" stands beside "an attacker takes this village with ladders" or "could not hold off a raid".
  `rv2-under_siege-village-30`, `rv2-calm-village-18`, and four more.
- **W-L1 — a crisis's severity band moves** on 4 births (`activeConditions[0].severityBand` high → medium):
  `rv2-under_siege-village-12`, `rv2-succession_void-town-18`, `-36`, `rv3-famine-town-2`. The severity reads
  defence. Explained, not named.

**The earthwork's row leaves the tuning table: CLEAR (EXECUTED).**
- Births byte-identical across the commit: 1,440/1,440 whole-record hashes equal.
- The table holds `{ stone: 1, palisade: 0.6 }`; the roster's "Palisade or earthworks" reads as a palisade, as
  before.

**The PDF's money line reads its row's score again: CLEAR (EXECUTED).**
- Births byte-identical across d398faebe.
- At the tip, the PDF's band word and its money sentence agree on 1,440/1,440 (A2: 670 → 0).
- On a master-stored town it moves onto its own badge (§5).

## §3 — THE GUARDS (EXECUTED; refs and local config snapshotted before and after each suite: unchanged)

**The earlier reader's plants, at 0a07f98c7** (`plant4.sh`, `tests/lint/defenceDerived.walker.test.js`): clean
13/13 green. Each plant reds exactly one test, on its arm:

| Plant | What it adds | Arm that reds |
|---|---|---|
| (i) | a stored read | stored |
| (ii) | `getActiveRng()` | random |
| (ii′) | `createPRNG(seed)()` | random |
| (iii) | a name test `/wizard/i` | name |
| (iv) | a literal 0.37 | number |
| (v) | `defenseProfile.parts` in the Defense tab | (v) surface |
| (v′) | `JSON.stringify(s.defenseProfile)` in `worldExport.js` | (v) surface |

**My plants, one per guard added since 65cb03ef1** (`plant5.sh`; the six test files clean 66/66 green). Each is
reverted after its run.

| Plant | One-line change | Result |
|---|---|---|
| A, money line | `moneyRungOf` reads `"STRONG"` | red, 1 (payOneHome) |
| A, purse word | `purseWordOfBand` returns the standing label | red, 2 (upkeepHired, payOneHome) |
| B | `contracted = true` | red, 2 (payOneHome: the rule and `rv2-under_siege-town-1`) |
| C | the register row re-gains a two-label sentence | red, 2 (prosperityInCrisisSurfaces) |
| D(i) | no crisis is an event | red, 1 ("since") |
| D(iii), all | the lead word dropped | red, 1 |
| D(iii), cover only | `Cover.jsx` alone loses the lead | red, 1, through the saved-record byte test, not the lead test |
| E | the presence reads the whole roster | red, 1 (magicCountOnce) |
| Will | the standing-body branch paid again | red, 1 |
| Earthwork | the earthwork row restored | red, 1 |

**One gap.** No guard covers the will's hired branch: E-M1 passes the will's red-first test.

## §4 — THE MACHINERY (EXECUTED, `machinery.py` over every section of all 2,880 dumps)

**Nothing of the defence lane's.** Not one of the defence words' labels or sources prints on any surface,
export, prompt or journal. The search covered:
- "Martial will", "Walls with no one to man them", "Stores and supply can carry no more than the force can
  use", "Rounded to the whole point the page prints", "rule (limit 1)", "magic presence (roster, magic dial)",
  "standing label";
- no part, no part's points, no limit, no share.

**Pre-existing figures, at both trees** (C-M4):
- **PDF, 1,440/1,440:** "Monster 74/100 · Economic 78/100 · Magical 33/100 · Disaster 56/100", "Score avg 67"
  and "Output 20.1".
- **Economics tab, 1,440/1,440:** "Output 50/100".
- **Power tab (DM), 1,313:** "Public legitimacy 72 Approved · Breakdown · Prosperity +15 · Defense +7".
- **The PLAYER world export:**
  - the sliders by name, `"priorityEconomy": 50` and its siblings (1,440/1,440);
  - `publicLegitimacy.breakdown`, `govMultiplier`, `crimMultiplier`, per-power `weight`;
  - `readiness.score` and the five scores.
- **The AI prompt:** "Economic score: 47/100" and "commands religious influence at 46/100".

None of these is the defence lane's, and none is new. Under the owner's "no points, sums, pay shares, limits,
slider names … on any page, PDF or export", each is the chair's to route.

## §5 — A TOWN SAVED BY THE DEPLOYED CLIENT (EXECUTED)

The earlier reader's ten towns were born at master db832c892 (`saved-birth.mjs`) and stored as JSON. Each was
rendered on every surface at 65cb03ef1 and at 0a07f98c7 (`saved-render.mjs`).
- **Eight render byte-identical.**
- **Two move, on one line of the PDF only:** `rv2-famine-village-19` (stored economic 23) and
  `rv2-under_siege-town-39` (22).
  - At base: *"There is no money to meet a crisis; any lasting trouble would find nothing to spend."*
  - At tip: *"The defenders are already paid late; a long crisis would empty the reserves and wear down the
    people who defend the place."*
- **Each move is right.** Both rows print the band "Weak" on the PDF and on the tab. The tab's sentence is
  "pay book is always behind: its defenders are paid late". At base the PDF's sentence for a record with no
  standing label cut at 25, not the band's 20, so the PDF disagreed with its own badge. It now agrees.
- **Nothing else moves.** Neither the stored guard line, nor the Defense tab, nor the Magic tab.

## Not measured

- The whole suite, the goldens, the census and the edge bundles: the seventh seat's.
- The PDF as an image: C-L7 is read from the source.
- The TableView header.
- A user-edited town.
- A record stored at 65cb03ef1 (the lane's own shape, never deployed) and rendered at the tip.
- The alchemist measure: the builder's, for the chair.
- The AI layer's live output: only its prompt and grounding payload.
- The thirty-town read the builder filed: not mine.

## Probes (`docs/chair/2026-11-13/probes/REVIEW-UPKEEP-3/`)

- §1: `render4.mjs`, `scan4.mjs`, `payclasses.py`, `pairdiff.py`, `newlines.py`, `eye.py`, `digest.py`.
- §2: `hashscan.mjs` (the per-commit attribution), `countonce.mjs`, `willpay.mjs`.
- §3: `plant4.sh` and `plant5.sh`.
- §4: `machinery.py`.
- The seeds and logs: `own.seeds`, and the result files `attrib.txt`, `countonce.tip.ndjson`,
  `countonce.base.ndjson`, `willpay.tip.ndjson`, `plants.txt`.
