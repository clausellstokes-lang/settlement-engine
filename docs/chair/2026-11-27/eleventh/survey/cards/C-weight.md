# (C) WEIGHT: HOW MUCH THE PIECE MATTERS, AND WHO WOULD SPEAK UNDER THE OWNER'S STARTING NUMBERS

Tree 777733a2a; C and V as in (A). Counts are a script's (CONFIRMED: `extract.mjs` reads each card's weight fields with
the tree's own readers; `analyze.mjs` holds the table and the simulation). The thresholds are PROPOSED. **Every number in
the table below is a tuning value for the owner to sign.** Nothing here is built.

## What the record holds that says how much a piece matters

| kind | the field (reader) | its values |
|---|---|---|
| crisis | the stress entry in force (`settlement.stress`, `composeCrisisPage`) | present or not. Every crisis card is a crisis in force |
| tension | `history.currentTensions[].severity` (an array; the card shows the worst) | minor / major / catastrophic |
| power | `derivePowerStrata(..).roster[].powerRole` (ruler / contender / none); `faction.powerLabel`; a stake in the crisis (`composeCrisisPage(..).stakes[].factionId`) | ruler, contender, none; Dominant / Strong / Significant / Minor / Suppressed |
| institution | a role in a crisis (a cast row or a lever of `composeCrisisPage`); the house's mark (`crisisStoppedRow.js :: rowMarkText`: stopped / short); its one status tag (`InstitutionsTab.jsx :: houseStatus`: Impaired / Reduced / Vulnerable) | as listed. There is no "standing" field of its own |
| tradition | `rec.coreMotif.element` (the rite's kind; `founding` is the town's own founding rite); `rec.scaleBand` (0 to 5) | thirteen elements; the scale band follows the TIER (0 in every thorp, 5 in most metropolises), so it does not rank rites within a town |
| person | `npc.influence` (high / moderate / low); a place in the crisis cast | as listed |

Corpora: C (each cell gives C).

### The weight field's values, every size together

**tension:** major 1023 (66%); catastrophic 475 (31%); minor 44 (3%).

**power:** contender 1035 (30%); none 889 (26%); ruler 632 (18%); contender+crisis 401 (12%); ruler+crisis 268 (8%); none+crisis 245 (7%).

**power (powerLabel):** Minor 1932 (56%); Significant 628 (18%); Dominant 368 (11%); Strong 312 (9%); Suppressed 230 (7%).

**institution:** plain 28393 (83%); Vulnerable 5047 (15%); marked 452 (1%); crisis 356 (1%); crisis+Vulnerable 65 (0%); marked+Impaired 57 (0%); crisis+Impaired 14 (0%); Impaired 14 (0%); crisis+marked 6 (0%); crisis+marked+Impaired 3 (0%).

**institution (institutionStatus):** standing 29207 (85%); Vulnerable 5112 (15%); Impaired 88 (0%).

**tradition:** founding 700 (25%); greening 334 (12%); harvest 303 (11%); field 272 (10%); charter 241 (9%); market 189 (7%); forge 157 (6%); the-dead 129 (5%); stars 125 (5%); hunt 97 (4%); long-sun 86 (3%); stone 71 (3%); hearth 63 (2%).

**tradition (traditionScale):** 4 621 (22%); 3 603 (22%); 2 486 (18%); 5 485 (18%); 1 352 (13%); 0 220 (8%).

**person:** low 22903 (84%); high 2601 (9%); moderate 1477 (5%); low+crisis 189 (1%); high+crisis 148 (1%); moderate+crisis 73 (0%).

**crisis:** in force 297 (100%).

### Weighty under the proposed table, by size (share of the kind's cards)

| kind | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| crisis | 100% | 100% | 100% | 100% | 100% | 100% |
| institution | 2% | 4% | 4% | 4% | 3% | 2% |
| power | 100% | 91% | 63% | 49% | 34% | 30% |
| person | 22% | 15% | 18% | 16% | 9% | 10% |
| tradition | 52% | 47% | 36% | 25% | 19% | 14% |
| tension | 45% | 37% | 37% | 27% | 28% | 24% |

### THE SIMULATION AS RULED (3 in 4 weighty, 1 in 4 lesser, size factor; ONE QUOTE A PERSON a page; before the cap of three)

| quotes (mean/max) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| Summary/Crisis | 0.05/1 | 0.07/1 | 0.19/1 | 0.21/1 | 0.25/1 | 0.23/1 |
| Systems/Institutions | 0.18/1 | 0.51/4 | 1.64/7 | 6.36/17 | 15.1/33 | 20.17/31 |
| Systems/Power | 0.35/2 | 0.43/2 | 0.85/3 | 1.81/5 | 2.69/7 | 3.24/8 |
| World/NPCs | 0.07/2 | 0.34/3 | 1.25/6 | 5.04/13 | 11.29/24 | 16.17/25 |
| World/Traditions | 0.11/1 | 0.23/1 | 0.31/2 | 0.7/3 | 0.94/3 | 0.95/3 |
| World/History | 0/0 | 0.01/1 | 0.03/1 | 0.05/1 | 0.1/1 | 0.17/2 |
| **a page (the whole dossier), before the cap** | 0.77/2 | 1.59/5 | 4.28/10 | 14.17/25 | 30.38/50 | 40.93/58 |
| **a page, after the cap of three a tab** | 0.77/2 | 1.59/5 | 4.12/7 | 8.35/13 | 9.56/13 | 9.78/13 |
| tabs over three (towns of 150) | 0 | 1 | 17 | 247 | 335 | 359 |
| towns with a tab over three | 0 | 1 | 16 | 140 | 150 | 150 |
| ... of which Systems/Institutions over three | 0 | 1 | 12 | 125 | 150 | 150 |
| ... of which World/NPCs over three | 0 | 0 | 5 | 110 | 147 | 150 |
| ... of which Systems/Power over three | 0 | 0 | 0 | 12 | 38 | 59 |
| cards that would speak but have NO lawful speaker (mean/max a town) | 1.33/5 | 1.55/7 | 1.88/7 | 2.73/9 | 4.95/12 | 6.85/13 |
| cards that would speak (mean/max) | 2.51/8 | 3.51/11 | 7.35/15 | 20.48/37 | 41.68/70 | 55.84/74 |
| ... silent because every lawful speaker already spoke on the page | 0.41/2 | 0.37/3 | 1.19/5 | 3.58/11 | 6.35/16 | 8.06/16 |

### THE SAME WITH A TAB BUDGET (each tab expects at most 2 weighty and 1 lesser quote: p = min(the ruled p, budget / cards of that weight on the tab))

| quotes (mean/max) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| Summary/Crisis | 0.05/1 | 0.07/1 | 0.19/1 | 0.21/1 | 0.25/1 | 0.23/1 |
| Systems/Institutions | 0.15/1 | 0.39/3 | 0.73/4 | 1.08/4 | 1.39/5 | 1.55/9 |
| Systems/Power | 0.37/2 | 0.43/2 | 0.87/3 | 1.59/5 | 1.99/5 | 2.03/5 |
| World/NPCs | 0.08/2 | 0.35/3 | 1.11/4 | 2.35/7 | 2.64/6 | 2.4/6 |
| World/Traditions | 0.11/1 | 0.23/1 | 0.35/2 | 0.97/3 | 1.3/3 | 1.35/4 |
| World/History | 0/0 | 0.01/1 | 0.03/1 | 0.07/1 | 0.1/1 | 0.17/2 |
| **a page (the whole dossier), before the cap** | 0.76/2 | 1.49/5 | 3.29/8 | 6.27/13 | 7.67/15 | 7.73/15 |
| **a page, after the cap of three a tab** | 0.76/2 | 1.49/5 | 3.27/8 | 5.98/11 | 7.06/13 | 7.12/12 |
| tabs over three (towns of 150) | 0 | 0 | 3 | 32 | 64 | 58 |
| towns with a tab over three | 0 | 0 | 3 | 30 | 55 | 53 |
| ... of which Systems/Institutions over three | 0 | 0 | 2 | 3 | 13 | 6 |
| ... of which World/NPCs over three | 0 | 0 | 1 | 25 | 37 | 33 |
| ... of which Systems/Power over three | 0 | 0 | 0 | 4 | 14 | 17 |
| cards that would speak but have NO lawful speaker (mean/max a town) | 1.27/5 | 1.28/6 | 1.11/4 | 0.91/4 | 1.31/4 | 1.53/5 |


## The proposed table (WEIGHTY; everything else LESSER)

| kind | WEIGHTY | LESSER | why |
|---|---|---|---|
| crisis | every crisis card | - | a crisis in force (the owner's word) |
| tension | severity **catastrophic** | major, minor | "a severe tension". Two in three tensions are "major", so "major or worse" marks 97% weighty and ranks nothing. Catastrophic is about a third |
| power | the **ruler** (holds the seat), and any power with a **stake in the crisis** | contenders and the rest | "the ruling power against a minor one" |
| institution | a **role in the crisis** (cast or lever), a **mark** (stopped or short), or **Impaired** | everything else ("Vulnerable" is 15% of houses, mostly in towns and up: left lesser) | "an institution's standing or its role in a crisis" |
| tradition | the **founding rite** (`coreMotif.element === 'founding'`) | the other twelve elements | "a tradition's core rite". The founding rite is the one the record singles out. About one a town |
| person | **influence high**, or **in the crisis cast** | moderate, low | the person's own standing |

The odds: weighty **0.75**, lesser **0.25**. The size factor ("small places quieter still"): thorp and hamlet **0.5**,
village **0.75**, town and up **1**. The choice is plain and seeded: a card speaks when
`mix32(fnv1a32('<seed>::speaks::<kind>:<card id>')) / 2^32 < odds × factor` (`kernel/proseHash.js`). WHO speaks comes
next: the first lawful candidate of (D), in rendezvous rank on `'<seed>::<kind>:<id>'`, not already quoted on the page.
Cards are taken in tab order: Crisis, Institutions, Power, NPCs, Traditions, History. A card whose lawful candidates are
all spent stays silent.

## What the simulation says (CONFIRMED counts; the reading PLAUSIBLE)

1. **The ruled odds give a roll-call on the two long tabs.** One in four of the lesser is about 1 in 4 of 33 to 93 houses
   and 25 to 84 people. Before the cap, Institutions carries 6 to 20 quotes a town in towns and up, and NPCs 5 to 16. The
   cap of three binds on a tab in 140 of 150 towns and in every city and metropolis. **The cap, not the odds, would then
   decide which cards speak.** That makes the choice order-dependent: weightiest first, then rank.
2. **A tab budget makes the odds mean what they say.** Take each card's odds no higher than (2 weighty, 1 lesser) ÷ the
   cards of that weight on the tab. The page falls to 6 to 8 quotes in towns and up, and a tab exceeds three in 30 to 55
   towns of 150 (mostly NPCs, where weighty people are many). The thorp and hamlet numbers do not move. I would put the
   budget to the owner beside the odds, as a fourth tuning value.
3. **Small places are quiet without help.** A thorp averages 0.8 quotes a page (at most 2) and a hamlet 1.5. That is
   because there is nobody to speak: one named person (1.3 a thorp), and **one quote a person a page**. The size factor
   barely matters below the village. The rule that binds there is "one quote a person".
4. **Cards that would speak but have no lawful speaker:** 1.4 to 7 a town. They are mostly institutions without a face
   (the fabric of the place: 2,087 of 34,407 rows on C, and most thorp rows) and tensions (see D). They stay silent,
   which the design allows.
5. **History (tensions) almost never speaks** (at most 0.5 a town): 73 to 90% of tensions (C) have no lawful speaker (D).
   **Traditions** speak about once a town from the town size up. **The crisis** speaks in about one town in five to seven,
   because only a third of towns have one, and a crisis cast often leads with a veiled face (D).
