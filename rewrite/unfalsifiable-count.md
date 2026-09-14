# THE COUNT THAT SETS THE RATIO (ruling 41) — DS-DEF-2, all 506 landed faces
*A measurement. Written outside the dock; nothing committed, anywhere. Dock read read-only at
`310893244` (`REWRITE 8b DS-DEF-2 cut 7, the re-refute answered`). Source of the faces:
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` § `### DS-DEF-2`, 506 `[face]` rows across 21 pools —
the extractor's count agrees with the brief's exactly.*

---

## ⭐ THE ANSWER TO ITEM 2, FIRST, IN ONE SENTENCE

**The pools the refuter judged GOOD carry FEWER unfalsifiable faces, not more: the nine pools that
took CRAFT PASS at their first sitting are 3.4% unfalsifiable-in-claim, the nine that took one DULL
are 6.4%, and the three that were DULL twice are 14.3% — a monotone gradient in the wrong direction
for the hope that the bank cures dullness.**

So the ruling is a cure for COST and not for DULLNESS, and on this block it is a small cure for cost
too (§3). The chair's instinct — "about half" — is wrong by an order of magnitude, and wrong in the
direction that matters: **33 of 506 faces (6.5%) are unfalsifiable in claim, and only 16 (3.2%) are
bankable without a tier tag.** 473 faces (93.5%) assert typed state and keep their card and their
refuter. ⚠ The one thing the measurement does NOT say is that unfalsifiable faces CAUSE dullness;
what it says is that the pools that had to be cured twice are the ones where the writers had least
typed state to write against, and reached for conduct instead. The bank would concentrate exactly
that material and draw it everywhere.

---

## 0. THE TEST APPLIED, AND HOW STRICT IT WAS

The list of what the engine types here is taken from each pool card's own **section (8) WHAT WOULD
BE FALSE** (and the mechanical sections (1), (2), (2b), (6), (7) it rests on). Nothing was invented.
A face is **COUPLED** if its CLAIM asserts or denies any of:

- `config.monsterThreat` — the country and what is in it (`plagued` / `frontier` / `settled`)
- the **walls bucket**: a wall, line, works, bank, ditch, palisade, perimeter — and the gate, the bar,
  the way through, the gap, the walk above it (`Gates (if walled)` lands in the walls bucket too)
- the **force buckets**: garrison / soldiers, militia / the muster / the turn, the watch and its round,
  a mercenary company, the charter hall
- a required `institutionalCatalog` **roster row** or a service the engine turns on at p ≥ 0.8:
  the mill and the grinding, the burial ground and the burying and the register of the dead, the
  market square / weekly market / the stalls, the granary and the store, the inn and the bed, the
  taverns, the craft guilds and the apprenticeship, the church / priest / rites, the water source,
  the farmland and the fields, the town hall, the dwellings
- a `compound.inst` **civic flag**: `hasCourtSystem` (the court, the hearing, the magistrate),
  `hasPrison` (the cells, the gaol, a room to keep a man in), `hasHospital` (the house for the sick),
  `hasChurch`, `hasGranary`, `hasPort`, `hasNavy`, `hasMagicInst`
- a **score or a BAND word** (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), `readiness`,
  `safetyLabel`, `guardEffectivenessDesc` asserted as fact
- **the purse and the gates**: the common purse, a wage, a toll, a levy, an upkeep or a mending
  charge (`milUpkeepMult`, `economicGates.*`, the four upkeep gates)
- a **tier word**, `structureKey`, `tradeRouteAccess`, `magicWorksAt`, `stress`, the war state
- ⭐ **the key's own reads** — a face saying "the houses simply stop", "nothing is built here",
  "nobody came out to him" asserts `perimeter=false` or `force=false`, which the key fixes. Ruling 35
  is the same test from the other side: a face that would sit as comfortably on the sibling rung is
  saying nothing this key fixes, and that is exactly the unfalsifiable face.

A face is **UNFALSIFIABLE IN CLAIM** when it asserts none of those: conduct, manners, attitude,
talk, an opinion, a household's own arrangement, timing by the light, a non-typed object.

**One operational rule decided most of the close calls, and it is worth stating because it is where
a different measurer would diverge:** *a claim about the SPEAKER'S OWN INSTITUTIONAL FUNCTION is
COUPLED* — what the watch is called to, what the court hears, what the market prices, what the
register buries — because that function is a roster row's service. A claim about what townspeople
DO, spoken by the same seated source, is not. This is why the count is so low: the block's writers
overwhelmingly wrote sources talking about their own work.

### SPEAKER-COUPLING is its own column
Only **`stranger`** and **`elders`** are universal (`faceSources.js:81`, `:133` — the traveller and
`ELDER_TIERS` seat on every town of every preimage), plus the bare **`archiver`**. Every other source
is seated: `hall` `tavern` `guild` `market` at TOWN (off `Town hall`, `Taverns (5-20)`,
`Craft guilds (5-15)`, `Market square`), `register` at VILLAGE and TOWN only (card correction (c):
`faceSources.js:91-93` excludes the `access to` prefix, so the hamlet register is a standing F1-11),
`court` on `hasCourtSystem`, and `watch` / `garrison` / `muster` / `gate` on their buckets. So:

- **U — UNFALSIFIABLE**: claim unfalsifiable AND speaker universal. Bankable with **no tier tag**.
- **S — SPEAKER-COUPLED ONLY**: claim unfalsifiable, speaker seated. Bankable **with** a tier/roster tag.
- **C — COUPLED**: the claim asserts typed state. Keeps its card and its refuter.

### The slot column, settled in one line
**No unfalsifiable face names a slot.** Ten faces in the whole block carry one — every templated row
of `Invasion & War: walls with NO force` (`{elders} {v:keep}`, `{hall} {v:put}`, …) — and all ten are
COUPLED on their claim anyway. `{settlement}`, `{band}`, `{route}` and `{defmaterial}` appear only in
spines, never in a face. So the fill-coupling question does not arise for the bank on this block.

---

## 1. THE RATIO

| pool | faces | U | S | C | U+S share | DULL verdicts before landing |
|---|---|---|---|---|---|---|
| Beasts & Monsters: `plagued`, perimeter AND organized force | 32 | 0 | 2 | 30 | 6.2% | 1 |
| Beasts & Monsters: `plagued`, perimeter but NO force to hold it | 28 | 0 | 1 | 27 | 3.6% | 1 |
| Beasts & Monsters: `plagued`, NO perimeter and NO force | 22 | 5 | 2 | 15 | 31.8% | 2 |
| Beasts & Monsters: `frontier`, credible deterrence | 32 | 1 | 1 | 30 | 6.2% | 0 |
| Beasts & Monsters: `frontier`, force without a perimeter | 33 | 2 | 1 | 30 | 9.1% | 1 |
| Beasts & Monsters: `settled`, defenses beyond the need | 35 | 0 | 2 | 33 | 5.7% | 2 |
| Beasts & Monsters: `settled`, nothing organized | 24 | 1 | 2 | 21 | 12.5% | 1 |
| Invasion & War: walls AND professional garrison | 15 | 0 | 0 | 15 | 0.0% | 0 |
| Invasion & War: walls with citizen militia | 20 | 0 | 0 | 20 | 0.0% | 1 |
| Invasion & War: walls with NO force | 11 | 0 | 0 | 11 | 0.0% | 1 |
| Invasion & War: force with NO walls | 15 | 0 | 0 | 15 | 0.0% | 0 |
| Invasion & War: militia only | 16 | 1 | 2 | 13 | 18.8% | 1 |
| Invasion & War: neither walls nor force | 26 | 1 | 1 | 24 | 7.7% | 1 |
| Internal Security: full legal chain (court AND prison) | 28 | 0 | 0 | 28 | 0.0% | 1 |
| Internal Security: court without detention | 25 | 0 | 0 | 25 | 0.0% | 0 |
| Internal Security: no legal infrastructure | 24 | 0 | 0 | 24 | 0.0% | 0 |
| Economic Survival: `STRONG` | 29 | 1 | 0 | 28 | 3.4% | 0 |
| Economic Survival: `WEAK` | 27 | 2 | 1 | 24 | 11.1% | 2 |
| Disasters & Famine: granary AND hospital | 27 | 0 | 0 | 27 | 0.0% | 0 |
| Disasters & Famine: granary AND parish care only | 22 | 0 | 1 | 21 | 4.5% | 0 |
| Disasters & Famine: NO reserves, NO medical provision | 15 | 2 | 1 | 12 | 20.0% | 0 |
| **ALL** | **506** | **16** | **17** | **473** | **6.5%** | |

| craft group | pools | faces | U | S | U+S | U+S share | U share |
|---|---|---|---|---|---|---|---|
| PASS at the first sitting (0 DULL) | 9 | 204 | 4 | 3 | 7 | 3.4% | 2.0% |
| one DULL, then PASS | 9 | 218 | 5 | 9 | 14 | 6.4% | 2.3% |
| DULL twice (repeatedly DULL) | 3 | 84 | 7 | 5 | 12 | 14.3% | 8.3% |

**THE HEADLINE: 16 UNFALSIFIABLE · 17 SPEAKER-COUPLED-ONLY · 473 COUPLED — 3.2% / 3.4% / 93.5%.**

---

## 2. ⭐ THE TEST OF THE OWNER'S HYPOTHESIS

### 2a. The craft history, read off the packets rather than off memory
The brief's summary of which pools the refuter liked does not match what the packets say, so the
count is run against the packets. Verdicts are the pool-grain CRAFT verdict in each
`refute.md` / `rerefute*.md`, plus the cut-7 commit body at `310893244` which records the last two
seats. The measure used is **how many DULL verdicts a pool took before it landed** — every pool is
CRAFT PASS at `310893244`, so the final verdict discriminates nothing.

| pool | refute.md | rerefute.md | later | DULL taken |
|---|---|---|---|---|
| frontier, credible deterrence | PASS | — | — | 0 |
| walls AND professional garrison | PASS | PASS | — | 0 |
| force with NO walls | PASS | PASS | — | 0 |
| court without detention | PASS | PASS | — | 0 |
| no legal infrastructure | PASS | PASS | — | 0 |
| Economic Survival `STRONG` | PASS | PASS | — | 0 |
| granary AND hospital | PASS | PASS | — | 0 |
| granary AND parish care only | PASS | PASS | — | 0 |
| NO reserves, NO medical provision | PASS | PASS | — | 0 |
| plagued, perimeter AND organized force | **DULL** | PASS | — | 1 |
| plagued, perimeter but NO force | **DULL** | PASS | — | 1 |
| frontier, force without a perimeter | **DULL** | PASS | — | 1 |
| settled, nothing organized | **DULL** (part A) | PASS (part B, post-cure) | — | 1 |
| walls with citizen militia | **DULL** | PASS ("the DULL verdict is lifted") | — | 1 |
| walls with NO force | **DULL** | PASS ("prior verdict: DULL") | — | 1 |
| militia only | **DULL** | PASS | — | 1 |
| neither walls nor force | **DULL** | PASS | — | 1 |
| full legal chain (court AND prison) | **DULL** | PASS | — | 1 |
| plagued, NO perimeter and NO force | **DULL** | **DULL** | PASS at cut 7 | 2 |
| settled, defenses beyond the need | **DULL** | **DULL** | PASS at cut 7 | 2 |
| Economic Survival `WEAK` | **DULL** | **DULL** | PASS at `rerefute-2` | 2 |

⚠ **Two of the three pools the brief names as having "come through with PASS" — `settled, nothing
organized` and `settled, defenses beyond the need` — took DULL verdicts in the packets, the second
of them twice, and were still being cured at cut 7 last night.** The third, `plagued, perimeter AND
organized force`, took one. The brief's characterisation is of the *final* state, which is PASS for
all twenty-one. The chair should know this before quoting the brief's pool names to the owner.

### 2b. The finding
| craft group | pools | faces | unfalsifiable-in-claim | share |
|---|---|---|---|---|
| PASS at the first sitting | 9 | 204 | 7 | **3.4%** |
| one DULL, then PASS | 9 | 218 | 14 | **6.4%** |
| DULL twice | 3 | 84 | 12 | **14.3%** |

Monotone, and the U-only column is monotone too (2.0% → 2.3% → 8.3%). Spearman ρ between a pool's
DULL count and its unfalsifiable share, over all 21 pools, is **+0.45**: a real tendency, not a law.

**And it survives being re-run on the brief's own naming**, which is the fairer test of the owner's
hypothesis since those are the pools the owner was told about:
- the three the brief calls PASS (`settled, nothing organized` · `settled, defenses beyond the need` ·
  `plagued, perimeter AND organized force`): **7 of 91 = 7.7%** unfalsifiable-in-claim (U alone 1.1%)
- the two the brief calls repeatedly DULL (`plagued, NO perimeter and NO force` ·
  `neither walls nor force`): **9 of 48 = 18.8%** (U alone 12.5%)

Either way the good pools carry fewer. **The bank is not a cure for dullness. On this evidence it is
a mild risk TO craft**, because it would take the material that correlates with a DULL verdict,
concentrate it in one place, and make it drawable everywhere.

### 2c. The three honest counter-examples, named rather than buried
- `Disasters & Famine: NO reserves, NO medical provision` — 20.0% unfalsifiable-in-claim and CRAFT
  PASS at the first sitting. The largest single break in the pattern, and it is the pool with the
  least typed state of any in the block (two absences and nothing else), which is the same reason
  the DULL pools are what they are. It says the relationship is a tendency of the material, not a
  rule about verdicts.
- `Invasion & War: walls with citizen militia` and `Internal Security: full legal chain` — 0.0%
  unfalsifiable and each took a DULL. A pool can be entirely coupled and still dull: both of those
  DULL verdicts were about SENTENCE SHAPE (the negated second beat, the repeated assembly), not
  about whether the faces said anything.
- `Beasts & Monsters: settled, defenses beyond the need` — 5.7% and DULL twice.

⇒ The honest statement to the owner is: **unfalsifiable faces are concentrated in the pools that
were hardest to make good, but the pools that were hardest to make good were hard for a second,
independent reason (clause shape), and the two are not the same defect.**

---

## 3. THE BANK'S FIRST DRAFT — and the saving, stated plainly

All 33 bankable faces (16 U + 17 S), grouped by the observation they make. `⛔` marks a face that
also appears on the hazard list in §4.


**T1 · THE STRANGER IS TAKEN IN BEFORE HE IS QUESTIONED** — 6 face(s)  ⟵ **5 redundant**
  - `66` **[U]** ⛔ `[stranger]` *`plagued`, NO perimeter and NO force* — By a traveller's account he came in by the road with his own lamp still lit. The first person to speak to him was the one who gave him a bed.
  - `74` **[U]** ⛔ `[stranger]` *`plagued`, NO perimeter and NO force* — By a traveller's account he is fed before he is asked his business, and the same house shows him the road out.
  - `127` **[U]** ⛔ `[elders]` *`frontier`, force without a perimeter* — The elders have it that the last house on the track keeps something on the fire for whoever comes up it, and that nobody has ever offered that house anything for it.
  - `206` **[U]** ⛔ `[elders]` *`settled`, nothing organized* — The elders say a stranger is given room where there is room. The household that gives it is the household short a bed that night.
  - `282` **[U]** ⛔ `[elders]` *militia only* — Whoever answers for the place says a stranger is fed before he is questioned.
  - `47` **[S]** ⛔ `[tavern]` *`plagued`, perimeter but NO force to hold it* — At the tavern a stranger is asked about the road before he is asked his business.

**T2 · THE STRANGER IS ASKED ABOUT THE ROAD, OR NOT ASKED** — 2 face(s)  ⟵ **1 redundant**
  - `82` **[U]** `[stranger]` *`plagued`, NO perimeter and NO force* — The first thing a traveller is asked here, by his own account, is whether he came by the road or off it.
  - `94` **[U]** ⛔ `[stranger]` *`frontier`, credible deterrence* — A pedlar says nobody here asked him what he had seen on the road, and that he had an answer ready.

**T3 · NOBODY CAN SAY WHO TO TELL** — 1 face(s)
  - `126` **[U]** ⛔ `[stranger]` *`frontier`, force without a perimeter* — A traveller says he asked who to tell if he saw something on the road, and was given a different name by everybody he asked.

**T4 · THE LAST HOUSE ON THE ROAD, AND THE HOUR IT KEEPS** — 2 face(s)  ⟵ **1 redundant**
  - `64` **[U]** `[elders]` *`plagued`, NO perimeter and NO force* — The house at the end of the road sends its children in first, one of the elders says. The houses behind it take that for the hour.
  - `71` **[U]** ⛔ `[elders]` *`plagued`, NO perimeter and NO force* — The door of the last house stays on the latch until everyone is in, one of the elders says. The one who comes in last drops the latch.

**T5 · WHAT IS LEANING BEHIND THE DOOR** — 1 face(s)
  - `285` **[U]** ⛔ `[stranger]` *neither walls nor force* — A pedlar has it that he is asked to step round the thing leaning behind every door he calls at here.

**T6 · THE STORE IS UNDER A HOUSEHOLD'S OWN FLOOR** — 1 face(s)
  - `435` **[U]** ⛔ `[stranger]` *`WEAK`* — A household's store is in its own cellar and under its own floor, a stranger says. The neighbours know which floor covers what and say as much to a visitor.

**T7 · THE ASK IS MADE ALOUD AND THE REFUSAL IS HEARD** — 1 face(s)
  - `427` **[U]** `[elders]` *`WEAK`* — The elders hold that an ask is made out loud here and in front of the neighbours. A refusal is heard by the same ears.

**T8 · A SICK HOUSE IS KNOWN BY A SIGN AT THE DOOR** — 2 face(s)  ⟵ **1 redundant**
  - `483` **[S]** ⛔ `[watch]` *granary AND parish care only* — On the round, one of the watch says, a house with somebody ill in it is known by the door left on the latch.
  - `499` **[U]** ⛔ `[stranger]` *NO reserves, NO medical provision* — The food left on a step is how a sick house is known from the lane, a traveller reports.

**T9 · THE SICK ARE SAT UP WITH, AND THE SITTING IS RECIPROCAL** — 2 face(s)  ⟵ **1 redundant**
  - `497` **[U]** ⛔ `[elders]` *NO reserves, NO medical provision* — The older households say a sick house here is never left to itself.
  - `498` **[S]** ⛔ `[tavern]` *NO reserves, NO medical provision* — At the tavern they say the houses that are sat up with are the houses that sit up with others.

**T10 · THE ARGUMENT IS NOT SETTLED ANYWHERE** — 1 face(s)
  - `389` **[U]** `[archiver]` *`STRONG`* — Which of the two is right is argued in the town and is not settled anywhere.

**T11 · THE TOWN IS ONE BAD NIGHT FROM FINDING OUT** — 1 face(s)
  - `30` **[S]** ⛔ `[tavern]` *`plagued`, perimeter AND organized force* — At the tavern they say the town is one bad night from finding out, and nobody there says what it would find out.

**T12 · THE TALK, THE STRANGER, AND WHAT HE BRINGS WORD OF** — 3 face(s)  ⟵ **2 redundant**
  - `78` **[S]** `[tavern]` *`plagued`, NO perimeter and NO force* — At the tavern they say the talk stops when a stranger sits down and starts again when he asks about the country.
  - `172` **[S]** ⛔ `[tavern]` *`settled`, defenses beyond the need* — At the tavern a carter says a stranger's report of the country is worth a drink.
  - `173` **[S]** ⛔ `[watch]` *`settled`, defenses beyond the need* — The watch says strangers bring the town its only news of the country.

**T13 · THE ROAD IS WALKED IN COMPANY, ARRANGED AMONG THEMSELVES** — 2 face(s)  ⟵ **1 redundant**
  - `110` **[S]** `[tavern]` *`frontier`, credible deterrence* — At the tavern a carter says the road in is walked in company. The company is paid for by whoever is carrying the most.
  - `122` **[S]** ⛔ `[market]` *`frontier`, force without a perimeter* — At the market the talk is that who walks out with whom is arranged between the carters and by nobody here.

**T14 · THE LATE DRINKER IS SEEN TO HIS DOOR** — 1 face(s)
  - `70` **[S]** ⛔ `[tavern]` *`plagued`, NO perimeter and NO force* — They say at the tavern that the last of the company sees the late drinker to his door.

**T15 · THE DAY'S WORK ENDS WITH THE LIGHT** — 1 face(s)
  - `20` **[S]** `[market]` *`plagued`, perimeter AND organized force* — Stallholders say the day's trade is finished while there is light, and that the buyers mean to be home before dusk.

**T16 · THE COIN IS LOOKED AT HARDER THAN THE MAN** — 1 face(s)
  - `202` **[S]** `[market]` *`settled`, nothing organized* — The stallholders say a stranger's coin is looked at harder than the stranger.

**T17 · NOBODY ASKS HIS BUSINESS UNTIL HE WANTS SOMETHING** — 2 face(s)  ⟵ **1 redundant**
  - `280` **[S]** `[muster]` *militia only* — The muster's view is that a stranger is asked after from one house to the next before he has spoken to anybody.
  - `281` **[S]** ⛔ `[market]` *militia only* — A stallholder puts it that nobody here asks a stranger his business until he wants something bought or sold.

**T18 · THE ONE WHO WORKS WHERE NOBODY ELSE DOES IS OWED SOMETHING** — 1 face(s)
  - `189` **[S]** `[tavern]` *`settled`, nothing organized* — At the tavern they say a man who works out where nobody else works is owed something for it, and that he has never been told what.

**T19 · THE LOUDEST AT THE TABLE WOULD BE ASKED LAST** — 1 face(s)
  - `428` **[S]** `[tavern]` *`WEAK`* — The loudest at the table is the household that would be asked last, they say at the tavern, and the ones asked first sit quiet over their cups.

**T20 · THE PEOPLE HERE ARE EASIER ABOUT IT THAN ANYBODY PASSING** — 1 face(s)
  - `307` **[S]** ⛔ `[register]` *neither walls nor force* — The sexton holds that the people here are easier about the place as it stands than anybody who comes through, and does not say which of them is right.

### THE SAVING, STATED PLAINLY
- **33 bankable faces collapse to 20 distinct observations.** 13 are redundant.
- Of those 13, **8 are CROSS-POOL** — the same observation written twice by two writers who could
  not see each other (T1 ×4, T2, T8, T12, T13). The other 5 are WITHIN a single pool, and three of
  those five are deliberate `pair · disagree` / `pair · view` constructions (280·281, 497·498,
  172·173) which the bank must NOT deduplicate: they are a pool's only live disagreement.
- ⇒ **The saving this ruling buys on DS-DEF-2 is 8 faces out of 506 — 1.6% of the block's writing.**
  Eight sentences a writer would not have had to write twice. Against that, the bank costs a tier tag
  on 17 of the 33 rows, a per-tab page check on at least 22 of them (§4), and a new deduplication
  surface the refuter does not currently have a seat over.
- ⚠ The cost saving the ruling was actually reaching for — *authored once into a shared bank and
  drawn by many pools* — is a saving on the MARK/REFUTE seats, not on the writing: 33 fewer rows to
  preimage-check per block. That is **6.5% of the refuter's per-face load on this block.** It is real
  and it is small. It is nothing like half.

---

## 4. THE HAZARD LIST — the per-tab page check the ruling names

**22 of the 33 bankable faces (67%) are things I would not want drawn on an arbitrary town of
another block.** All 22 are unfalsifiable against the ENGINE'S TYPED STATE and false or grotesque
beside a CIRCUMSTANCE the engine holds in a different field — and the engine prints that circumstance
on the same page. The card's own wiring row W-1 is the proof: `stressGenerator.js:113` fires
`monster_pressure` and `safetyProfile.js:197` then prints *"Outlying areas are avoided. Night
movement is restricted."* directly beside these faces, and `warStatus.besiegedBy` /
`DEFENSE_STRESS_STATUS` can do the same for a siege.

| # | face | wrong beside |
|---|---|---|
| 66 | the traveller walks in with his lamp still lit and is given a bed | a siege · an occupation · a curfew |
| 74 | fed before he is asked his business | a famine · an occupation |
| 282 | fed before he is questioned | a famine · an occupation |
| 47 | asked about the road before his business | a siege · an occupation |
| 127 | the last house keeps something on the fire for whoever comes up | a famine |
| 206 | a stranger is given room where there is room | a siege · a famine · a plague |
| 94 | nobody asked him what he had seen on the road | a war front · a siege |
| 126 | given a different name by everybody he asked | an occupation (there is one obvious answer) |
| 71 | the last house stays on the latch until everyone is in | a siege · an occupation · `Dangerous — Criminal Governance` |
| 285 | something leaning behind every door | a disarmed or occupied town |
| 435 | a household's store in its own cellar | a famine · a requisition |
| 483 | a sick house known by the door left on the latch | a plague (doors are marked, not latched) |
| 499 | food left on a step marks a sick house | a famine (there is none to leave) |
| 497 | a sick house is never left to itself | a plague |
| 498 | those sat up with sit up with others | a plague |
| 30 | the town is one bad night from finding out | a town that has ALREADY had it (a sack, a siege) |
| 172 | a stranger's report of the country is worth a drink | a besieged town (no strangers come) |
| 173 | strangers bring the town its only news of the country | a garrison town that patrols · a siege |
| 122 | who walks out with whom is arranged among the carters | an occupation (movement is controlled) |
| 70 | the last of the company sees the late drinker to his door | a curfew — and `safetyProfile.js:197` prints one ON THIS BLOCK |
| 281 | nobody asks a stranger his business until he trades | a siege · an occupation |
| 307 | the people here are easier about it than anybody passing | a besieged or occupied town |

**The shape of the hazard, and it is one shape:** every one of the 22 is about **HOSPITALITY, THE
NIGHT, OR THE SICK** — and those are exactly the three things a stress row overrides. ⇒ The per-tab
page check the ruling names cannot be a tier check. **It must read `stress`, `warStatus`,
`safetyLabel` and `guardEffectivenessDesc`** before a bank face is drawn. That is a third tag beyond
the tier tag, on two-thirds of the bank.

### Two structural notes the bank will hit on day one
- `389` ("Which of the two is right is argued in the town and is not settled anywhere") is an
  `archiver · weigh` row. It is unfalsifiable and universal, and it is **unbankable as written**:
  "the two" is a pointer into its own pool's `pair 1`. Any `weigh` row is in this class.
- `428` ("the loudest at the table is the household that would be asked last") presupposes an *ask* —
  a levy in progress. It is unfalsifiable but not context-free, and a bank with no notion of that
  will draw it on a town that asks nobody for anything.

---

## 5. LIMITS — where this is a judgment call and not a reading of the engine

Per the brief, these are named per face rather than buried.

**A. The 19 faces (14 shapes) where the classification turned on my judgment, and a second measurer
could flip them.** Each is named with the call made and the reason:

| face | called | the call, and what would flip it |
|---|---|---|
| 21 | C | "People go up in the clothes they were working in" — *go up* names no typed object but is meaningless without the wall-walk. Flipped to U, the perimeter pools gain one bank row each of this shape. |
| 27 | C | "goods come in **by leave**" — leave to enter entails a controlled gate. |
| 51 | C | "a stranger … is **let through**" — same shape as 27. |
| 76 | C | "the town's own **charge on the trade**" — read as a levy (typed). Read as an informal custom, U. |
| 78 | S | the country appears as a TOPIC of talk, not as an assertion about what is in it. Called unfalsifiable-in-claim. A stricter measurer calls it C and the DULL pool's share drops. |
| 99, 104 | C | "who **stands the nights**" — entails a standing turnout even where no body is named. |
| 110, 122 | S | a paid walking-company: read as a private arrangement between carters, not a mercenary row. If the bucket reaches it, both are C. |
| 116, 128, 140 | C | "the last houses **on the edge**" / "the road begins where the houses stop" / "never anything **built**" — all three assert `perimeter=false`, which is the key's own read. This is the single most consequential rule in the count: **without it, the no-perimeter pools would read as far more unfalsifiable than they are.** |
| 126 | U | "given a different name by everybody he asked" — called social conduct. Read as asserting there is no organised body to report to, it is C, and the second-DULL group loses a point. |
| 196, 199 | C | "the fields" / "the people at the fields" — `Farmland` and `Subsistence farming` are required rows, so naming the fields is naming a row. It is the WEAKEST coupling in the count: the row is required at every tier of every preimage, so the assertion can never be false here. Flipped to U, two more bank rows. |
| 285 | U | "the thing leaning behind every door" — household arms. No militia bucket reaches a billhook behind a door. Read as asserting an armed populace, C. |
| 301 | C | "asked what the place would do if an army came, and was answered about the price of salt" — the face's whole stake is the town's indifference to an army, which is the key's read. The only literal assertion is the townsman's reply, which is not typed. |
| 435 | U | "a household's store … in its own cellar" — private storage is not the `Town granary` row. Read as denying a town store, C. |
| 497 | U | "a sick house here is never left to itself" — it would sit unchanged on the hospital pool, so by ruling 35 it says nothing this key fixes. A measurer who reads informal care as the substitute the key implies calls it C. |

If **every one of the 19 flipped the other way at once** — the most adverse reading available — the
block ratio moves from **33/506 (6.5%) to 38/506 (7.5%)**, and the §2b gradient is
**3.4% → 9.2% → 13.1%: still monotone, still in the same direction.** It does not approach half under
any reading I can construct. Twelve of the nineteen are currently COUPLED and would only ADD to the
bank; seven are currently bankable and would only subtract. Nine of the twelve additions land in the
one-DULL group, which is why the middle band is where the gradient is softest and the extremes are
where it is firm.

**B. Two things this measurement does not establish.**
1. **Causation.** The gradient says the DULL pools contain more unfalsifiable faces. It does not say
   the unfalsifiable faces made them dull. Two of the three DULL-twice pools were DULL on CLAUSE
   SHAPE (the negated second beat in `Economic Survival: WEAK`, the opener collapse in `settled,
   defenses beyond the need`), which is orthogonal.
2. **Generalisation past DS-DEF-2.** This is one block, whose subject is defense — the most
   densely-typed tab in the product. A block over customs, faith or daily life would very plausibly
   run a much higher unfalsifiable share, and the ruling's economics would look different there.
   ⇒ **Before the ratio is set programme-wide, one non-defense block should be counted the same way.**

**C. The craft-history discrepancy** (§2a) is the one place where the brief and the packets disagree,
and the count is run against the packets. If the chair knows a later seat that re-verdicted the two
`settled` pools as first-sitting PASS, the group means shift and should be re-run; the brief's-own-
naming test in §2b is provided precisely so the finding does not depend on that.

**D. What the count does NOT cover.** The 3 spines per pool are excluded (the brief says faces), as
are the `[archiver · observed]` machine rows other than 389 and 395. Speaker-seating was read off the
cards' section (7) and correction (c), not re-derived from `faceSources.js` — the seat is fenced from
running the dock.

---

*Measured 2026-09-13 by an Opus measurer for the Opus chair. Dock untouched; no commit made.*

---

## APPENDIX — THE MEASUREMENT, RE-RUNNABLE FROM THIS FILE ALONE

Faces are numbered 1–506 in document order through `### DS-DEF-2` of
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` at `310893244`, counting only lines matching
`- \`[face]\` \`[<tag>]\` <text>` (spines excluded). The extractor:

```python
import re
lines = open(PATH, encoding='utf-8').read().split('\n')
start = next(i for i,l in enumerate(lines) if l.startswith('### DS-DEF-2:'))
end   = next(i for i,l in enumerate(lines) if i>start and l.startswith('### DS-DEF-3'))
pool = spine = None; rows = []
for l in lines[start:end]:
    m = re.match(r'^\*\*`([^`]+)`:\s*(.+?)\*\*\s*$', l)
    if m: pool = m.group(1)+': '+m.group(2); spine = None; continue
    m = re.match(r'^(\d+)\.\s+`\[(\w+)\]`\s*(.*)$', l)
    if m: spine = m.group(1)+'/'+m.group(2); continue
    m = re.match(r'^\s+-\s+`\[face\]`\s+`\[([^\]]+)\]`\s*(.*)$', l)
    if m: rows.append((pool, spine, m.group(1), m.group(2)))
assert len(rows) == 506
```

**THE VERDICT SET. Every face not listed here is COUPLED (473 of them).**

```
U  (unfalsifiable in claim, universal speaker — bank with NO tag, 16):
   64  66  71  74  82  94 126 127 206 282 285 389 427 435 497 499

S  (unfalsifiable in claim, seated speaker — bank WITH a tier/roster tag, 17):
   20  30  47  70  78 110 122 172 173 189 202 280 281 307 428 483 498

HAZARD (of the 33, do not draw beside a siege / famine / plague / occupation, 22):
   30  47  66  70  71  74  94 122 126 127 172 173 206 281 282 285 307 435 483 497 498 499

SLOT-BEARING anywhere in the block (10, all COUPLED, all in `walls with NO force`):
  242 243 244 245 246 247 249 250 251 252
```

DULL counts per pool, for the §2b groups, are in the table at §2a and are read off each packet's
`refute.md` / `rerefute*.md` pool-grain CRAFT verdict plus the cut-7 commit body at `310893244`.
