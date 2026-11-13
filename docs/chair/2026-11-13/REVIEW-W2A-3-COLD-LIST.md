# REVIEW-W2A-3: the cold list (twenty fresh towns at 817980b33)

This list was committed before the reviewer read any claim of the lane: its hand-back, its commit messages and its diff. The data is in `REVIEW-W2A-3-COLD-LIST.json` beside this file. The reviewer's instruments are in `probes/REVIEW-W2A-3/`.

## How the towns were born and rendered
- **Seeds.** `rw3-<size>-<calm|crisis>-1` (`probes/REVIEW-W2A-3/seeds20.txt`). None is the census's, the fixture's or an earlier reviewer's.
  - Calm: thorp ×2, hamlet, village, town, city, metropolis.
  - Sieges: hamlet, town, metropolis.
  - Famines: thorp, village, city.
  - Both siege and famine: town.
  - Other crises: hamlet plague, village insurgency, town occupied, city infiltrated, city wartime, metropolis politically fractured.
- **Configuration: the app's own shape.** `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false, selectedStresses:[…], _randomizePriorities:true})`, as the stress panel writes it with Random off. "Calm" is the panel's "None". Every other dial is the store's default random.
- **Birth.** `generateSettlementPipeline(cfg, null, {seed, customContent:{}})`, then the public prose is stamped.
- **Render.** Through the tree's own `OutputContainer`, as the owner sees it: every group, sub-tab and disclosure opened. The renderer is `render.rw3.jsx`, run by `render.sh`. It is the census renderer with this config arm, and it also writes each record.
- **Base as well.** The same twenty were rendered at deb1544eb. All 20 records are identical at the two trees, the public prose aside.

## How the towns were read
- **Seven readers**, working for the reviewer to `probes/REVIEW-W2A-3/READER-BRIEF.md`, read every line of the twenty dumps: 24,606 lines.
- **Rubric.** Each reader verified every candidate against the town's record JSON. The kinds were: a house the town lacks; a denial of a house it has; a state; a size; a count; a figure; two places that disagree; broken or internal text.
- **Checks.** A script confirmed that every quoted sentence is verbatim on its tab. The reviewer re-checked a sample against the records:
  - the city-famine "no apothecary" line beside an Apothecary district;
  - the siege town's "Its Potter" with only a Brickmaker;
  - "controls … the gates" in a town without walls or gates;
  - the famine city's reserves held by the Arcane Council, not "Military/Guard";
  - twelve drawn at random: all listed for a reason the record supports, with three of them mild (a chip, an upsell line, a legitimacy point).
- **Merging.** The readers' raw files are in `probes/REVIEW-W2A-3/readers/`. They hold 1,172 entries, which merge to **1,075 distinct town-and-sentence entries** (`merge.mjs`).
- **Severity.** The readers rated it to the brief's rubric. The reviewer then normalised it (`norm.mjs`):
  - A bare catalogue name with a count range ("Dwellings (1-8)", "Craft guilds (100-150+)", "Mills (2-5) · member of …") is set LOW, as class `catalogue-range-name`. There are 138 such entries. Round one's list did not count these at all, and they print in every town.
  - A range inside prose is capped at MED.
  - A slider value printed on the page ("Military priority is 36/100") is MED.
  - Two lines added at the tip are raised from LOW to MED (see below).

## The count
| | HIGH | MED | LOW | catalogue-range names (LOW) | total |
|---|---|---|---|---|---|
| twenty towns | **55** | **426** | 456 | 138 | 1,075 |

Section 7 (the income lines naming a working the roster lacks, ruled to the agreement lane): 30 entries, marked `section7`.

By mechanism (excluding the bare catalogue names):

| Mechanism | Lines | HIGH | MED |
|---|---|---|---|
| names a house, role or force the town lacks | 187 | 19 | 80 |
| two homes that disagree | 178 | 0 | 87 |
| internal text | 142 | 1 | 83 |
| a resource, good or chain state not so | 107 | 4 | 52 |
| normal times under a crisis in force | 87 | 9 | 42 |
| a ruler, power, threat or history state | 50 | 1 | 21 |
| broken text | 35 | 10 | 11 |
| a count | 33 | 4 | 8 |
| a size | 32 | 3 | 12 |
| a figure against the record | 26 | 0 | 13 |
| denies a house or force the town has | 16 | 2 | 12 |
| the rest (hooks that do not fit the person and similar) | 44 | 2 | 3 |

## Of the 1,075, ten print at the tip and NOT at the base
Every other entry prints identically at deb1544eb. These ten are the only false or doubtful lines on these twenty pages that the lane's tree prints and the base does not:

| Town | Tab | Sentence (abridged) | Severity | Against |
|---|---|---|---|---|
| town-under_siege | Power | "Each season it gets easier to buy an official at Lagomagnum: the town stays poor, **the streets stay badly guarded**…" | **MED** (raised) | safety: "The military command has taken charge of the streets" |
| town-occupied | Power | "Each season it gets easier to buy an official at Polano: … the streets stay badly guarded…" | **MED** (raised) | safety: "Occupation authorities enforce the curfew at the checkpoints" |
| metropolis-politically_fractured | Defense | "Shopkeepers here pay **one ring** for protection, and the ring pays any official who will take its money." | MED | institutions: "Rival gangs: Several gangs at odds"; services: "Multiple gangs running protection" |
| metropolis-calm | Magic | "Reliance on magic: Relied upon · supplied by Houses of worship and Great cathedral" | MED | the same tab gives every role of magic as "absent"; `traditions.hasDivine` false |
| thorp-famine | Power | "Each season it gets easier to buy an official at Chichek: … the streets stay badly guarded…" | LOW | a thorp of 26: no streets, no watch |
| hamlet-plague_onset | Power | the same line at Caergarth | LOW | a hamlet of 53 with one headman |
| thorp-calm-1 | Defense | Food endurance: "household stores would carry the thorp for about three months at full rations…" | LOW | economics: "two months in household stores" (the figure counts the harvest) |
| village-insurgency | Defense | Food endurance: "…about three months…" | LOW | the same |
| city-famine | Defense | Food endurance: "…about six months…" | LOW | crisis: "five months of grain"; overview: "two bad weeks from … starvation" |
| city-infiltrated | Defense | Food endurance: "Under siege the outlying fields would be lost…" | LOW | `grain_fields` depleted: no outlying fields to lose |

What these ten mean for the lane's claims is judged in the review, after this list.

## Mechanisms worth naming (all print at the base too)
- **"The ruling three of X" where X has one member.** Four towns.
- **A food or crisis slot filled with an export.** "days of legal", "legal reserves", "reeds reserves", "days of crafts". Three towns.
- **Normal trade under a siege.** "Plenty passes through…", "market lives off through-traffic", "carts bring in a little of the rest": the siege hamlet, town and metropolis. Through-traffic stated where none is recorded: three more towns, LOW.
- **"Controls the rationing and the gates" with no walls or gates.** Two towns.
- **The gap and resource lines:**
  - "Its Potter cannot work without clay" in a town with a Brickmaker only;
  - "no apothecary or alchemist shop finishes it" beside an Apothecary district;
  - "no tannery or leatherworkers' guild finishes it" beside Tanners.
- **"stands idle: its supply has failed upstream"** printed for a house whose chain is `vulnerable` and working (a garrison, a watch): eight towns.
- **Cut-off sentences ending in "…".** Five towns (the smuggling and gates lines).
- **The auction house selling "persons"** where the content boundaries forbid it. Two towns.
- **Wrong-tier catalogue names.** "Merchant guilds (3-8) · Merchant guilds (15-40)" in a metropolis.
