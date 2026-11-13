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
