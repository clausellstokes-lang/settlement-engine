# REVIEW-UPKEEP — `lane/coherence-upkeep-2026-11-12` at 419de26cb (base: the agreement lane at faa20bc6c)

> The first independent review of the upkeep lane. The reviewer changes nothing on the lane and cures nothing.
> Written in the brief's order. §1 was committed before the hand-back, the record or any ruling was read.

## §1 — Cold, as the owner reads it (committed before §2)

**How it was read.**
- **The forty seeds:** births as the census corpus births them (`birthConfig({...DEFAULT_CONFIG, ...dials, settType})`, the census dials, `customContent: {}`), named `cold-<size>-<i>` (calm) and `cold-<crisis>-<size>-<i>` (forced crisis).
  - **Picked from a scan of 1,288 tip births** (`cold-<size>-0..239` for five sizes, `-0..39` for the metropolis, and 4 forced births per size for `famine` and `under_siege`). The picks cover all six sizes; poor and prosperous places of each; a charter hall standing with no standing guard that can pay for it and one that cannot; 4 sieges and 4 famines.
  - **thorp:** 0 (Struggling), 5 (Poor), 22 (Comfortable), famine-thorp-0, under_siege-thorp-0.
  - **hamlet:** 56 (Comfortable, charter, no standing guard: *can pay*), 91 (Poor, charter, no standing guard: *cannot*), 32 (Prosperous), 122 (famine, charter), 29 (siege, militia, charter), under_siege-hamlet-2, 182 (Struggling, charter, no standing guard).
  - **village:** 98 and 220 (Comfortable, charter, no standing guard), 46 (Poor, charter, no standing guard), 19 (Poor, militia, charter), 193 (siege, charter, no standing guard), famine-village-1, 61 (Moderate).
  - **town:** 1 (Prosperous), 9 (Comfortable, watch and mercenary), 32 (Struggling, garrison and mercenary), 21 (Struggling), 11 (Poor), 5 (Wealthy), famine-town-1, under_siege-town-0.
  - **city:** 0 (Prosperous), 39 (Poor), 8 (Poor, occupied), 2 (Moderate), 16 (Wealthy), famine-city-2, under_siege-city-0.
  - **metropolis:** 0 (Prosperous), 11 (Poor), 38 (Moderate), 28 (Wealthy), famine-metropolis-1, under_siege-metropolis-2.
  - **Two more were rendered after the 1,288-birth band count:** famine-city-0 and famine-city-1.
- **The render:** every dossier through each tree's own `OutputContainer`, as the owner sees it. It uses the census's `render.census.jsx`, unchanged except for the seed parser: owner's view, premium, public prose stamped, every group, sub-tab and disclosure opened.
- **The diff:** line by line per view, base against tip. Defense, Services, Economics (stores and food), Magic, Power, Overview, Crisis and Foundations were read in full for all forty.
- **The page moved in 36 of the 40.** Unchanged: thorp-22, hamlet-32, town-1 and town-5 (Comfortable, Prosperous, Prosperous, Wealthy). Views moved: Defense 35, Magic 25, Overview 22, Services 20, Institutions 20, Economics 19, Crisis 14, Foundations 12, Power 11.

**What the tip's page gets wrong, in order of how badly it reads.**

1. **Readiness falls two bands.** *Bound broken.*
   - **cold-famine-city-0:** Fortress (77) on the base, Defensible (54) on the tip.
   - **Defense tab:** "What Temürbash can field and what Temürbash has built are both in good order" becomes "enough for the usual trouble and nothing spare".
   - **Power tab:** legitimacy goes from 10 to 0, and the "Defense +10" term is gone.
   - **This is 1 of the 1,288 scanned births.** The bound "never more than one band down" holds on the sample it was measured on, not by construction.
2. **A cemetery that does not bury.** *Reads broken.*
   - **cold-famine-metropolis-1, Institutions tab:** the "Cemetery network" card ("Burial has left the walls entirely: grounds beyond every gate…") now lists one service, *Central register*.
   - **The cause:** the upkeep roll took its *Burial* row; the floor kept the register.
   - **Services tab, Healing:** loses Burial and Emergency treatment.
3. **A famine granary that the hall held shut is now open.**
   - **cold-famine-town-1:**
     - *base:* "Active Famine. Stores: a granary of six months that the hall will not open"
     - *tip:* "a granary, five months of grain"
     - *Food endurance, base:* "…but the hall will not open it"
     - *Food endurance, tip:* "the granary carries the town for about six months"
   - **cold-famine-city-1:** 6 months held on the base, 4 months open on the tip.
   - **Why:** the stores' share takes the months under the six-month held window, so the clause that explained a famine beside a full granary is lost.
   - **The direction:** the months fall, but what the reader learns crosses the other way: food the town could not eat becomes food it can.
4. **Rites dropped as if bought.** Healing is a bought category, and it carries church rites.
   - **What the upkeep roll removes:**
     - *Life ceremonies* ("Births, marriages, and funerals. Essential community functions"): village-98 (Comfortable), village-46, town-11, town-21, town-32, under_siege-town-0.
     - *Last rites* ("The priest manages the graveyard"): hamlet-182.
     - *Religious services:* famine-village-1.
     - *High religious ceremony:* under_siege-metropolis-2.
     - *Poor relief:* town-11, Poor.
   - **What the same pages still say:**
     - The church card still has a graveyard and *Burial*.
     - The Economics tab's tithe row still collects "fees for burial and sacramental services".
     - town-11's Faith chain still lists *Poor relief*.
5. **The "hunger" line where the page shows none.**
   - **cold-under_siege-metropolis-2:** the guard assessment ends "Hired swords back the garrison, paid from what the hunger leaves."
   - **The same page says:** "Food: Import-Dependent. Stores: a granary, 13 months of grain." It reports no deficit.
   - **The line reads the crisis kind (siege), not hunger.**
   - **It prints in 14 siege cities and metropolises of the 1,288**, with 7 to 12.5 months in store. On this page no hunger is stated.
6. **Hired swords beside private guards.**
   - **cold-metropolis-28 (Wealthy):** "Public law enforcement is largely a formality. The merchant guilds maintain their own mercenary companies: real protection exists, but only for those with the right associations. … Hired swords back the garrison."
   - **The clash:** the paragraph says the hired companies serve the guilds' friends, and the new sentence puts them behind the public garrison.
7. **The purse line beside a pay line that reads another home.** Each new hired line reads the label. The force's own pay sentence beside it reads the economy slider (`safetyProfile.js:378`, `:404`).
   - **In the 420 hired-force births:**
     - Prosperous: 8 read "inadequate equipment and irregular pay" and 3 read "exists on paper. Chronically underpaid", each followed by "Hired swords back the garrison." (the full-purse form).
     - Struggling: 4 read "well paid, well equipped" and then "paid from what the hunger leaves".
   - **The pay sentence is older.** The lane's sentence now sits beside it in the same paragraph.

**Says less than the base, where the base was true.**
- **The "held" clause** (item 3).
- **Rows lost from the Services tab:**
  - *Burial* at the cemetery, and the rites (item 4).
  - town-11 (Poor) loses *Poor relief* while its Faith chain lists it.
- **Every other lost row (20 of the 40 towns lose rows)** is a commercial or trade row: Wool shearing, Pack animal hire, Cask repair, Window glass. No other page line names those rows.
- **No town gains a row**, and no criminal row is added: under_siege-city-0 loses one, *No-questions sales*.

**Do a poor place and a prosperous one now read differently, believably?**
- **Readiness, stores and services: yes, and further apart than the base.** In the 1,288 births:
  - *Town and larger, mean readiness:* Poor 35.0 → 32.0, Struggling 35.9 → 32.4, Prosperous 66.2 → 69.8. Wealthy is unmoved.
  - *Town and larger, mean stores:* Poor 7.1 → 6.1 months, Prosperous unmoved.
  - *Band moves:* Poor −1 in 56 and +1 in 7; Comfortable +1 in 46 and −1 in 5.
- **The guard sentence for hired force: no.**
  - **The charter hall:** one line, "takes bounty work against threats, as far as the purse runs", for every label up to Comfortable. Comfortable hamlet-56 and village-98 read word for word as Poor village-46 and Struggling hamlet-182. Only Prosperous and above would differ, and no charter-only Prosperous place was born.
  - **The mercenary pair** (the paid and short lines): these speak to the owner's case of a place with no guard that can hire if it has the cash. Their branch needs a mercenary and no garrison, watch or militia. It fired in **0 of 1,288 births**: every born mercenary stands beside a watch.
  - **So the owner's case is told by the readiness number, not by a sentence.**
- **A smaller oddity: some places read better than the base.**
  - **Examples:**
    - cold-famine-metropolis-1: economic resilience Weak → Adequate, "can pay for a crisis of the ordinary length".
    - cold-city-39 (Poor): Weak → Adequate, military 67 → 90.
    - cold-city-2 (Moderate): Lightly defended → Defensible.
  - **Why:** the label reads kinder than the old output score.
  - **Verdict:** not false (it is the lane's one home), but where the base said "already owed" it was arguably the truer line.
