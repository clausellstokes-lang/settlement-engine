# COHERENCE-POWERS — phase 1: the measure and the proposal (2026-11-11)

Base: `lane/integration-2026-11-07` at decc7bf15. Nothing under `src/` is changed or pushed. The scratch rule
lived in a private worktree only (a 150-line diff to `powerSupport.js` and `castPowers.js`, kept in the
seat's scratchpad, never committed).

Corpus: the charter's §0.4 configuration (every dial on random, `magicExists`, `grounded`), seeds
`critique-<tier>-<i>`: 60 villages, 160 towns, 100 cities, 40 metropolises = 360. The ten towns add
`critique-hamlet-25` (the corpus has no Feudal Stewardship; that is where the owner's "Lord Reeve" sits).

## (a) Why a kind's houses land on the contender and not on the ruler

`src/domain/dossier/powerSupport.js :: powerIndex` builds each kind's "leader" from every power **except
the ruler** (`if (name === ruler) continue;`). `leaderOf(kind)` gives the ruler only the `government`
share, and gives it its own kind **only when no other power of that kind is seated**. So a Church Council
beside Religious Authorities gets none of the church's share: every church lands on Religious
Authorities. `dealDoubledNiches` then counts the ruler as a claimant of the government kind only, so the
snake deal never shares the churches either. The rule was deliberate ("so a merchant council does not
hoover up both halves of every market"). Then `castPowers.js :: rankPowers` FLOOR 1 makes the ruler's
first the seat's face (`representatives.js :: seatHouseOf`: the heaviest Government-shelf house, else the
hall, else the minted `npc_seat`). So the leader is always the office, and the second and third are drawn
from the office houses and whatever lapsed onto the ruler.

Measured (before): the leader is the office in **360 of 360** towns (37 of them the minted `npc_seat`).
Of 245 rulers of a kind (church, army, merchant, arcane, noble, criminal), **10** have their kind among
their first three. 235 have a same-kind contender. By kind: religious 0/41, military 5/25, merchant 3/105,
arcane 2/33, noble 0/13, criminal 0/28.

## (b) The smallest rule

**THE DUAL HAT (both alternatives):** FLOOR 1 changes, and nothing else in the roll does.
- A government that **appoints** (Feudal Appointee, Noble Governorship, Ducal Governorship, Royal
  Authority, Foreign Administration/Stewardship, Occupation Authority) keeps today's seat: the office's
  face, with no house in the town.
- A **ruler of a kind** (religious, military, merchant, arcane, noble, craft): the leader is the
  heaviest house of that kind among the ruler's members (by house weight, then share, then roster order).
- A **civic** ruler (Elder Council, Elected Reeve, Town Council, Feudal Stewardship…): the leader is the
  ruler's own heaviest trade or landed member (merchant, craft, noble houses), else the town's. This is
  the miller who is the reeve.
- A **criminal** ruler (Corrupt Council, Shadow Senate): unchanged. Naming the thieves' house as leader
  would break the veil; that is the owner's call.
- The leader's `title` stays the house's ("the miller"), and its `role` becomes the office ("Reeve"). Both
  fields already exist, so **no new key**. The office house's face stays in the ruler as its clerk (FLOOR 2
  picks it). Its title changes only for a council or hall office ("the town clerk"); a lord's steward
  keeps "steward". The scratch retitled the steward too, which was wrong, and town 1 below shows it.
  Where the dual hat finds a house, the minted `npc_seat` is not born.
- FLOOR 2 for the ruler: if the first is not of the ruler's kind (an appointee), the heaviest kind house
  comes second, so a Feudal Appointee has a noble house beside it.

**Then, what becomes of the same-kind contender. Two alternatives:**

- **A — the ruler leads its kind; the contender is a true rival.** In `powerIndex` the ruler is its own
  kind's leader. In `dealDoubledNiches` the ruler is a claimant of its kind too, and picks first, so the
  houses of the kind are snake-dealt between ruler and contender, as R-P3 already does for a doubled niche
  (the ruler keeps the cathedral, the contender gets the abbey). No share is counted twice. The reason the
  page can state: "the chapter outside the council". **Cost:** a contender with one house of its kind loses
  it. Contenders with nobody rise from 14 to **59** (45 lose every face), e.g. a village's Religious
  Authorities whose only priest now leads Priestly Guidance. Under R-P5 such a power has no one on the page,
  so phase 2 would have to retire it, merge it, or mint it a face.
- **B — the faces hold both memberships.** The landings stay as they are; the ruler also lists its kind's
  faces (share 0 in the ruler, so nothing is double-counted). **Cost:** no contender loses a face (14 stay
  14), but in **178** towns the ruler and its rival share a face in their first threes. That is the page's
  "the same people in practice", now true by construction, and it makes "contests the seat" read as a
  quarrel inside one body. The contest line would need rewording, and that is QUARREL's file and
  PRESUME's prose.

**The seat recommends A.** It is the R-P3 deal the estate already has, it keeps one person to one kind's
loyalty, and its cost (45 contenders left with no one) is a named, countable set that phase 2 can guard.

## (c) The title table (the leader's office title; for the owner's veto)

| Government (the generator's name) | Size | Leader | Hats |
|---|---|---|---|
| Household Council | thorp–village | Household Elder | house + office |
| Elder Council / Free Elder Council / Elder Consensus | thorp–village | Elder | house + office |
| Headman's Authority | thorp–village | Headman | house + office |
| Elected Reeve | village | Reeve | house + office (the peasants' choice) |
| **Feudal Stewardship** | thorp–village | **Lord Reeve** (the owner's word) | house + office: a local man the lord raises; the steward stays at his side |
| Priestly Guidance | thorp–village | Elder Priest | church + office |
| Town Mayor / Town Council | town | Mayor | house + office |
| City Council / Grand Council | city / metropolis | Lord Mayor | house + office |
| Democratic assembly | city+ | Speaker of the Assembly | house + office |
| City-State Council | city+ | First Councillor | house + office |
| Church Council | town | Warden of the Council | church + office |
| Ecclesiastical / Theocratic Council | city | Lord Warden | church + office |
| High Theocratic Council | metropolis | Lord Protector of the Faith | church + office |
| Militia Command / Military Council | village / town | Captain of the Muster / Captain-Mayor | watch or garrison + office |
| Military City / Grand Military Council | city / metropolis | Lord Marshal | garrison + office |
| Merchant Council | town | Burgomaster | house + office |
| Merchant City Council | city | Lord Burgomaster | house + office |
| Merchant oligarchy / Grand Merchant Oligarchy | town+ | First Magnate | house + office |
| Grand Merchant Senate | metropolis | Doge | house + office |
| Guild Council | town | Alderman | guild + office |
| Guild Authority / Grand Guild Council | city / metropolis | Lord Alderman | guild + office |
| Merchant Guild Council / Grand Guild Consortium | city / metropolis | Master of the Guilds | guild + office |
| Circle of Adepts / Arcane Council / Arcane Senate | village / town–city / metropolis | First Adept / Archmage of the Council / Archmage of the Senate | tower + office |
| Corrupt Council / Corrupt City Council / Shadow Senate | town / city / metropolis | Mayor / Lord Mayor / First Senator | office only (the veil) |
| Feudal Appointee | town | the Lord's Steward | **appointed**: office only |
| Noble Governorship / Ducal Governorship / Royal Authority | city–metropolis | Governor / Ducal Governor / Royal Governor | **appointed** |
| Foreign Administration / Occupation Authority | any | Foreign Administrator / Occupying Governor | **appointed** |

Where the owner's word could also sit: "Lord Reeve" fits the Feudal Stewardship, a reeve the lord raises
from the village. The Elected Reeve stays plain "Reeve", because the peasants elect him. The Feudal
Appointee is the lord's own man and gets "the Lord's Steward".

## (d) What must not break

- **The seat's card id and its readers:** `seatHolder.js` (rank 1 first, so it follows the new leader),
  `powerStrata.js`, `crisisCast.js`, `oathHolder.js`, `npcLadderFactionMembership.js`,
  `seatHolderFindings.js`, `ties.js` (an `other` mint's tie is forced to the seat), `poolMap.js`,
  `npcGenerator.js`. Each reads either rank 1 or `SEAT_CARD_ID`/`seatHouseOf`. Under the cure the seat is
  the rank-1 card wherever it lives, and the 37 minted `npc_seat` cards stop being born where a house leads.
  Every `SEAT_CARD_ID` reader must re-point to rank 1. That is the biggest risk.
- **FLOOR 1 and FLOOR 2:** FLOOR 1's meaning changes, for the governing power only. FLOOR 2 keeps its
  rule, plus the kind-house preference for an appointee. Floors still sort on raw weight, and the guild's
  push never reads them (J-11).
- **The capture arithmetic over the ruling three** (`hallCapture.js`): the label **moves in 17 towns**
  (A; 18 under B). A different three holds a different hidden allegiance: adversarial→equilibrium 5,
  corrupted→equilibrium 3, equilibrium→corrupted 2, none→corrupted 1, corrupted→none 1, and others. This is
  a **label outside the class's own members**, so under §0.9 it goes to the chair as a STOP before any cure.
- **The saved record's shape:** no new key. The office goes in `role`, which exists. The mint retirement
  removes a card, not a key.
- **The pulse's readers:** the memberships keep their shape. The importance band follows rank, so it moves
  in 288 towns, as R-P5 intends.

## (e) Ten towns, before and after (scratch rule A)

1. **Ulfsund**, a hamlet under Feudal Stewardship.
   - Before: the leader is Kjara Ragnarsson, steward. Second is Idun Bjarnarson, carpenter; there is no third.
   - After: **Idun Bjarnarson, carpenter, Lord Reeve**. Second is Kjara Ragnarsson, steward. (The scratch
     printed "reeve's clerk"; the proposal keeps "steward".)
   - No same-kind contender.
2. **Rotfeld**, a village under an Elected Reeve.
   - Before: Klara Schröder, reeve. Then Egilbert Neumann, miller, and Tobias Köhler, head shepherd.
   - After: **Egilbert Neumann, miller, Reeve**. Then Klara Schröder, the reeve's clerk, and Tobias Köhler,
     head shepherd.
3. **Quirigmul**, a village under Priestly Guidance.
   - Before: Dzuna Nah, elder priest (the minted seat). Then Reed Caan, salt master, and Yax Caan, miller.
     Contender: Religious Authorities, whose one face is Dzuna Coh, priest.
   - After: **Dzuna Coh, priest, Elder Priest**. Then Reed Caan, salt master, and Jaguar Claw Chi, bowyer.
     Religious Authorities: **no one** (alternative A's cost; under B the priest sits in both).
4. **Kamendvor**, a village under an Elder Council.
   - Before: Agata Sidorov, the eldest (the minted seat). Then Bozhidar Andreyev, innkeeper, and Olivera
     Novikov, thatcher.
   - After: **Bozhidar Andreyev, innkeeper, Elder**. Then Velko Andreyev, carpenter. (The scratch kept the
     mint as clerk third; the proposal does not mint her.)
5. **Muulatl**, a town under a Town Council.
   - Before: Zaachila Uoc, first councillor. Then Dzuna Ahau, granary reeve, and Axayacatl Ox, watch captain.
   - After: **Yaretzi Xiu, wharfinger, Mayor**. Then Zaachila Uoc, town clerk, and Uinal Ixim, miller.
6. **Dioncastron**, a town under a Church Council.
   - Before: Irene Gregoraios, head of Church Council. Then Chrysostomissa Drimys, granary reeve, and Charis
     Makrembolites, printer. Contender: Religious Authorities, with Barbara Limniotes, dean; Elias
     Botaneiates, abbot; Zournaras Attaleiates, hospitaller.
   - After: **Barbara Limniotes, dean, Warden of the Council**. Then Irene Gregoraios, town clerk, and Charis
     Makrembolites, printer. Religious Authorities: Elias Botaneiates, abbot; Zournaras Attaleiates,
     hospitaller; Georgia Komnenos, midwife.
7. **Loughworth**, a town under a Military Council.
   - Before: Fuamnach Murphy, head of Military Council. Then Eithne Reilly, granary reeve, and Aengus
     Sweetman, wharfinger. Contender: Military/Guard, with Bronwyn O'Neill, castellan; Seosamh Ward, gaoler;
     Eanán O'Riordan, bowyer.
   - After: **Bronwyn O'Neill, castellan, Captain-Mayor**. Then Fuamnach Murphy, town clerk, and Aengus
     Sweetman, wharfinger. Military/Guard: Eamon Power, watch captain.
8. **Tallganj**, a town under a Feudal Appointee (appointed).
   - Before: Safiya al-Jabbar, the lord's appointee. Then Sadeq al-Tabari, mint master, and Zubaida ibn
     Rushd, watch captain. Contender: Landed Gentry, with Safiya al-Jabbar and Zayd al-Mawsili, miller.
   - After: **Safiya al-Jabbar, the lord's appointee** (no house: the lord's own man). Then Zayd al-Mawsili,
     miller, and Zubaida ibn Rushd, watch captain. Landed Gentry: no one.
9. **Celoki**, a city under a Merchant Guild Council.
   - Before: Vasili Novikov, consortium speaker. Then Stanislav Saveliev, chief magistrate, and Ivana
     Fedorov, senior charter master. Contender: Merchant Guilds, with Alexei Davydov, senior guild master;
     Daria Kovačević, master fishmonger; Tanya Sokolov, warehouse factor.
   - After: **Alexei Davydov, senior guild master, Master of the Guilds**. Then Stanislav Saveliev, chief
     magistrate, and Tanya Horvat, front man. Merchant Guilds: Svetlana Vorobev, innkeeper; Marina Bykov,
     master furrier; Tanya Sokolov, warehouse factor.
10. **Langengasse**, a metropolis under a Ducal Governorship (appointed).
    - Unchanged: **Luise Zimmerer, governor** (the duke's man, also first of Noble Houses). Then Waltraud
      Ihle, master of granaries, and Ulrike Berger, ferryman.

## (f) The corpus, before and after (the same 360 seeds)

| Measure | Before | Rule A | Rule B |
|---|---|---|---|
| Leader has a house of the town | 0 | 275 | 275 |
| Leader is the office (appointed 30 + Feudal Appointee 13, criminal 28, arcane with no arcane house 14) | 360 | 85 | 85 |
| Ruler of a kind with its kind in its first three (of 245) | 10 | 203 | 203 |
| …where the town has a house of that kind (of 224) | 10 | 203 (the 21 left are all criminal, by the veil) | 203 |
| Towns whose ruling three changed | — | 288 | 288 |
| Count of powers | — | 0 changed | 0 changed |
| Power figures, legitimacy, stability, coup label | — | 0 changed | 0 changed |
| Generation coherence receipt checks not passing | 0 | 0 | 0 |
| Capture label (`criminalCaptureState`) | — | **17 moved** | 18 moved |
| A card's importance band moved | — | 288 towns | 288 towns |
| Same-kind contenders with no faces | 14 | **59** | 14 |
| Ruler and contender share a face in their threes | — | — | 178 |

## Found, not mine (to the chair)

- 14 of the 33 Arcane Councils rule a town with **no arcane house at all**: a ruler with no kind of its own
  (the presumption class; PRESUME's or the power roster's).
- Celoki: the roll seats a "front man" in the council's three. Phase 2 must confirm that the veil holds
  for a hideable house that lands in the ruler. This was not traced here.
