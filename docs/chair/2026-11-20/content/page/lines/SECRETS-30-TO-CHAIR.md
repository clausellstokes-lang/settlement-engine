# SECRETS-30, to the chair: the secrets on 30% of a size's places, outside the four frames (PAGE-8; written 2026-11-20 20:14 UTC by `date -u`)

DRAFT LINES ONLY. Nothing under `src/` or `tests/` was written. Measured on the lane tip 575936eac, 150 places a size (seeds
`hxd-<size>-<i>`, untouched settings; the first 50 a size are the chair's 300). The forge is SECRET-LINES' own cache of the
900 (forged on a614d7664; `git diff a614d7664 575936eac -- src` is empty, so the places are the tip's). Script:
`docs/chair/2026-11-20/content/page/measures/page-8/secrets30/secrets30.mjs` (the measure, the cost, the tranche as data,
its lint and the projection). From the tree's root: `node <script> measure "$PWD" <cache.json>` (reads the cache only).
The bar is SECRET-LINES' bar: by the SENTENCE, over all places of a size, names masked to `#`. The four frames are left out.

## 1. The ranked table

Every sentence at or above 30% of some size's places, outside the frames: **what 114, stakes 113** (town 1/1, city 17/17,
metropolis 112/111; thorp, hamlet and village none). They come from **113 rows**, and every one was found in a pool:
89 rows of `titleSecretsPresentations.js TITLE_SECRETS` (three a title) and 24 rows of
`npcData.js NPC_CRIMINAL_SECRETS_BY_HOLDER` (the catch-all, written `CRIMINAL` below). One row is one row's `what` with its
`stakes`. A row is dealt **at most once a place** (measured: 0 places deal a row twice), so its stakes stand at the same
share as its `what`. No sentence is shared by two rows. One exception: rank 66 (`CRIMINAL.any.criminal[3]`, "On the payroll
of the thieves' guild…"). The guild carry rewrites its `what`, so only its stakes ("Exposure would cost them their post…")
stand at 32.0%.

Columns: the row's share of a size's places (town / city / metropolis, %); its pool and row; its rows today; the new lines it
needs for its commonest wording to fall under 30% and under 15% (k − 1, the median of ten keys at the row's worst size);
venal = on F5's venal list (`f5.mjs :: venalRe`), +S9 = also S9's incorruptible words. **T1** = in the tranche (§4).
HIDEABLE = the title's house is criminal (`poolMap.js :: POOL_BY_TITLE`; `cardVeil.js :: isHideableHouse` reads that
category first): no line is drafted for it (§4).

**ONE-ROW POOLS FIRST: there is one.** `CRIMINAL.any.religious` holds a single row for every holder but a clergy one
(`criminalSecretsForHolder('religious', class)` leaves the five clergy rows out). It is rank 1 anyway. No other pool behind
these sentences has fewer than three rows. `any.military` holds two rows for a non-military holder, but none of them is on
30%.

| # | town / city / metro | pool [row] | rows | <30% | <15% | venal | the secret (its stakes stand at the same share) |
|---|---|---|---|---|---|---|---|
| 1 **T1** | 42.0 / 64.0 / 70.7 | `CRIMINAL.any.religious[0]` | **1** (6 to a clergy holder) | 2 | 6 | - | Secretly receives what they believe are genuine divine visions, which terrifies them |
| 2 **T1** | 17.3 / 51.3 / 64.7 | `TITLE_SECRETS["the master carpenter"][0]` | 3 | 2 | 5 | - | Built a roof with green timber to save the cost, and the beams have started to split |
| 3 **T1** | 8.7 / 36.0 / 59.3 | `TITLE_SECRETS["the chandler"][2]` | 3 | 2 | 4 | - | Lit the fire that burned out a rival's shop three years ago, and told everyone it was an acc... |
| 4 **T1** | 16.0 / 41.3 / 53.3 | `CRIMINAL.any.criminal[0]` | 8 | 1 | 4 | F5+S9 | Has been embezzling from the organisation they oversee for three years |
| 5 **T1** | 17.3 / 30.0 / 48.7 | `CRIMINAL.any.political[2]` | 6 | 1 | 4 | - | Knows the settlement's most important legal document was fraudulently created |
| 6 **T1** | 3.3 / 10.7 / 44.7 | `TITLE_SECRETS["the lanista"][2]` | 3 | 1 | 3 | - | Has been drugging fighters before bouts so they lose on the day the money says they should |
| 7 **T1** | 10.7 / 35.3 / 40.7 | `CRIMINAL.any.criminal[1]` | 8 | 1 | 3 | F5 | Secretly directs a fencing operation through a trusted intermediary |
| 8 **T1** | 8.0 / 18.0 / 40.0 | `CRIMINAL.any.personal[4]` | 8 | 1 | 3 | - | Was directly responsible for a death that was ruled an accident |
| 9 | 6.7 / 22.0 / 40.0 | `TITLE_SECRETS["the front man"][2]` HIDEABLE | 3 | 1 | 3 | - | Does not know who the real owners are, only the messenger who brings the instructions |
| 10 **T1** | 14.0 / 28.7 / 39.3 | `CRIMINAL.any.political[0]` | 6 | 1 | 2 | F5 | Has been feeding strategic intelligence to outsiders who pay for it |
| 11 **T1** | 8.7 / 19.3 / 38.7 | `TITLE_SECRETS["the cobbler"][2]` | 3 | 1 | 3 | F5 | Ran up gambling debts and has been quietly selling the tools of the shop one by one to pay them |
| 12 **T1** | 6.7 / 25.3 / 38.0 | `CRIMINAL.any.criminal[2]` | 8 | 1 | 2 | - | Ordered what was officially ruled an accident, and sleeps fine about it |
| 13 **T1** | 6.0 / 28.7 / 37.3 | `TITLE_SECRETS["the customs collector"][1]` | 3 | 1 | 2 | -+S9 | Has been recording lower duties than were paid and keeping the difference |
| 14 **T1** | 8.7 / 28.0 / 37.3 | `TITLE_SECRETS["the master weaver"][2]` | 3 | 1 | 3 | - | Copied a rival's pattern stitch for stitch and sold it for years as their own design |
| 15 **T1** | - / 23.3 / 37.3 | `TITLE_SECRETS["the prison warden"][2]` | 3 | 1 | 2 | F5 | Keeps a prisoner in the cells long after their sentence ended, at the request of someone who... |
| 16 | 2.0 / 18.0 / 37.3 | `TITLE_SECRETS["the house boss"][2]` HIDEABLE | 3 | 1 | 2 | F5+S9 | Skims from the house's takings before the money reaches the people who really own the den |
| 17 **T1** | 11.3 / 28.0 / 36.7 | `CRIMINAL.any.political[3]` | 6 | 1 | 3 | - | Has been delaying vital information from reaching the decision-makers |
| 18 | 2.7 / 15.3 / 36.7 | `TITLE_SECRETS["the house boss"][0]` HIDEABLE | 3 | 1 | 2 | F5 | Has the dice and the cards fixed on the high tables, and the people who win big are paid to ... |
| 19 **T1** | 11.3 / 19.3 / 36.7 | `TITLE_SECRETS["the smelt master"][1]` | 3 | 1 | 2 | - | Lets the furnace smoke and run-off poison the stream below the smelter, and pays a man to ke... |
| 20 **T1** | 3.3 / 21.3 / 36.7 | `TITLE_SECRETS["the sawyer"][1]` | 3 | 1 | 2 | F5 | Sells green planks as seasoned and the buildings made from them warp within a year |
| 21 **T1** | - / 36.7 / 36.0 | `TITLE_SECRETS["the watch commander"][0]` | 3 | 1 | 2 | F5+S9 | Takes a monthly payment to keep patrols away from certain streets on certain nights |
| 22 **T1** | - / 16.0 / 36.0 | `TITLE_SECRETS["the hospital's master"][1]` | 3 | 1 | 2 | F5 | Lets families who give generously jump the line for beds while the poor wait in the hall |
| 23 **T1** | 4.0 / 23.3 / 36.0 | `TITLE_SECRETS["the dyer"][1]` | 3 | 1 | 2 | F5 | Sells cheap colours as costly ones, and they wash out at the first rain |
| 24 | 9.3 / 32.0 / 36.0 | `CRIMINAL.any.magical[3]` | 6 | 1 | 2 | - | Knows the location of a sealed magical site that others have been searching for |
| 25 | 10.7 / 22.7 / 36.0 | `TITLE_SECRETS["the potter"][1]` | 3 | 1 | 2 | F5 | Has been selling pots bought in from another workshop as their own throwing, at their own pr... |
| 26 | 10.7 / 28.0 / 36.0 | `TITLE_SECRETS["the brickmaker"][1]` | 3 | 1 | 2 | - | Has taken children to tread the clay for a few coppers a day, when there was clay to tread, ... |
| 27 | 14.0 / 34.0 / 36.0 | `TITLE_SECRETS["the master fishmonger"][0]` | 3 | 1 | 2 | F5 | Sells yesterday's fish as this morning's, washed and packed in fresh ice, and has made peopl... |
| 28 | 12.0 / 18.0 / 36.0 | `CRIMINAL.any.personal[6]` | 8 | 1 | 2 | - | Their celebrated achievement was stolen. They took credit for another's work |
| 29 | 6.7 / 24.0 / 35.3 | `CRIMINAL.any.criminal[4]` | 8 | 1 | 2 | F5 | Has been systematically bribing multiple officials for preferential treatment |
| 30 | 12.0 / 20.7 / 35.3 | `CRIMINAL.any.political[4]` | 6 | 1 | 2 | - | Is the illegitimate heir to a title currently held by someone who doesn't know they exist |
| 31 | 15.3 / 28.0 / 35.3 | `TITLE_SECRETS["the master butcher"][2]` | 3 | 1 | 2 | - | Has had a thumb on the scale for years, and the weights in the shop are not the weights they... |
| 32 | 6.0 / 30.0 / 35.3 | `CRIMINAL.any.magical[0]` | 6 | 1 | 2 | - | Possesses a magical ability they've hidden for their entire career |
| 33 | - / - / 35.3 | `TITLE_SECRETS["the librarian"][1]` | 3 | 1 | 2 | - | Keeps a locked room of books that were ordered burned, and lets a few chosen readers see them |
| 34 | 4.0 / 21.3 / 35.3 | `TITLE_SECRETS["the ropemaker"][2]` | 3 | 1 | 3 | - | Owes rent on the rope walk for two years, and has been paying the landlord's steward instead... |
| 35 | 11.3 / 21.3 / 35.3 | `TITLE_SECRETS["the brickmaker"][2]` | 3 | 1 | 2 | - | Owes so much to a lender that the yard and everything in it already belongs to someone else ... |
| 36 | - / 16.0 / 35.3 | `TITLE_SECRETS["the college master"][0]` | 3 | 1 | 2 | F5 | Sells the college's places to the children of rich families who cannot sing a note |
| 37 | - / 26.7 / 35.3 | `TITLE_SECRETS["the senior charter master"][2]` | 3 | 1 | 2 | - | Sold the details of a company's next job to the people the company was hired to stop |
| 38 | - / 22.7 / 34.7 | `TITLE_SECRETS["the prison warden"][0]` | 3 | 1 | 2 | F5 | Sells better food, letters and visits to the prisoners whose families can pay, and lets the ... |
| 39 | 12.7 / 24.0 / 34.7 | `CRIMINAL.any.personal[0]` | 8 | 1 | 2 | - | Has a second family elsewhere that neither family knows about |
| 40 | 4.0 / 20.7 / 34.7 | `TITLE_SECRETS["the brewer"][1]` | 3 | 1 | 2 | - | Buys up grain that was meant for bread in the lean months, at a price no household can match |
| 41 | 3.3 / 22.0 / 34.7 | `TITLE_SECRETS["the cartographer"][0]` | 3 | 1 | 2 | - | Draws two maps of the same country, the true one for those who pay well and a wrong one for ... |
| 42 | 8.7 / 30.7 / 34.7 | `TITLE_SECRETS["the tailor"][1]` | 3 | 1 | 2 | - | Hears everything said in the fitting room and has been passing the best of it to someone who... |
| 43 | 14.0 / 26.7 / 34.7 | `TITLE_SECRETS["the master weaver"][0]` | 3 | 1 | 2 | F5 | Sells cloth woven with short thread as full measure, and the bolts come up an arm short |
| 44 | - / 14.0 / 34.7 | `TITLE_SECRETS["the theatre manager"][0]` | 3 | 1 | 2 | F5 | Has been putting on plays that mock powerful people by name, and sells the best seats to the... |
| 45 | 2.7 / 16.7 / 34.7 | `TITLE_SECRETS["the dyer"][0]` | 3 | 1 | 2 | - | Pours the dye vats into the stream at night, and the water downstream runs red and blue |
| 46 | - / 15.3 / 34.0 | `TITLE_SECRETS["the outfitter"][2]` | 3 | 1 | 2 | F5 | Sells rope, lamps and rations that are cheaper than they look, and some of them fail undergr... |
| 47 | 15.3 / 32.0 / 34.0 | `TITLE_SECRETS["the bowyer"][1]` | 3 | 1 | 3 | - | Used poor wood for a large order of bows and sold them as seasoned yew |
| 48 | - / 14.0 / 33.3 | `TITLE_SECRETS["the scroll scribe"][0]` | 3 | 1 | 2 | F5 | Sells scrolls with the last line of the spell copied wrong, so they fail when read |
| 49 | 2.0 / 20.7 / 33.3 | `TITLE_SECRETS["the scroll scribe"][1]` | 3 | 1 | 2 | - | Has been copying spells from a spellbook that was stolen from the wizard who wrote it |
| 50 | - / 25.3 / 33.3 | `TITLE_SECRETS["the senior charter master"][1]` | 3 | 1 | 2 | - | Has been sending the companies they dislike to the contracts most likely to kill them |
| 51 | 3.3 / 26.0 / 33.3 | `TITLE_SECRETS["the cartographer"][2]` | 3 | 1 | 2 | - | Has never walked half the country on the maps, and filled the gaps from rumour and guesswork |
| 52 | 10.0 / 20.0 / 33.3 | `TITLE_SECRETS["the apothecary"][2]` | 3 | 1 | 2 | - | Knows exactly which household has been buying the poison sold as a cure for rats, and who it... |
| 53 | - / 24.7 / 33.3 | `TITLE_SECRETS["the master of granaries"][1]` | 3 | 1 | 2 | - | Lets the rats in one store go untreated, so the losses can be blamed on them |
| 54 | 10.0 / 24.0 / 33.3 | `CRIMINAL.any.personal[1]` | 8 | 1 | 2 | - | Their identity is fabricated. They fled a different life entirely |
| 55 | 0.7 / 16.0 / 32.7 | `TITLE_SECRETS["the vintner"][2]` | 3 | 1 | 2 | - | Came by the business by lending its old owner money at a rate that could never be paid back |
| 56 | - / 32.7 / 20.0 | `TITLE_SECRETS["the black marketeer"][1]` HIDEABLE | 3 | 1 | 2 | F5 | Has been selling poisons to a buyer who uses them on people |
| 57 | - / - / 32.7 | `TITLE_SECRETS["the arena master"][1]` | 3 | 1 | 2 | F5 | Has been selling the arena's best seats twice and keeping the second payment |
| 58 | 9.3 / 20.0 / 32.7 | `CRIMINAL.any.magical[4]` | 6 | 1 | 2 | - | Is under a compulsion placed by someone who is now dead, and it's getting harder to resist |
| 59 | 1.3 / 15.3 / 32.7 | `TITLE_SECRETS["the theatre manager"][2]` | 3 | 1 | 2 | - | Lets the theatre's cellar be used at night by people whose business it does not ask about |
| 60 | - / 15.3 / 32.7 | `TITLE_SECRETS["the enchanter"][2]` | 3 | 1 | 2 | - | Made a love charm for a customer, and the person it was used on is still not free of it |
| 61 | 10.7 / 22.0 / 32.7 | `TITLE_SECRETS["the tailor"][2]` | 3 | 1 | 2 | - | Made a wedding coat for a man who never paid, then told the bride's family about his other d... |
| 62 | - / 12.0 / 32.7 | `TITLE_SECRETS["the enchanter"][0]` | 3 | 1 | 2 | F5 | Sells charms that do nothing, to buyers who cannot tell the difference |
| 63 | - / - / 32.7 | `TITLE_SECRETS["the chancellor"][0]` | 3 | 1 | 2 | F5 | Sells places at the academy to rich families whose children have no talent |
| 64 | 12.7 / 12.0 / 32.0 | `CRIMINAL.any.family[4]` | 5 | 1 | 2 | - | Has been protecting a sibling's crime for years (a serious one) |
| 65 | 10.0 / 24.7 / 32.0 | `TITLE_SECRETS["the warehouse factor"][1]` | 3 | 1 | 2 | F5 | Has been reporting goods as spoiled or lost and selling them on through a buyer in another m... |
| 66 | 5.3 / 23.3 / 32.0 | `CRIMINAL.any.criminal[3]` | 8 | 1 | 2 | F5+S9 | On the payroll of the thieves' guild as a silent informant |
| 67 | - / 11.3 / 32.0 | `TITLE_SECRETS["the whisper broker"][1]` HIDEABLE | 3 | 1 | 2 | - | Has a file on every important person in the market, and keeps it hidden where only they can ... |
| 68 | - / 32.0 / 32.0 | `TITLE_SECRETS["the watch commander"][1]` | 3 | 1 | 2 | - | Has been arresting the people who complain the loudest about the watch, on charges that do n... |
| 69 | 13.3 / 23.3 / 32.0 | `CRIMINAL.any.magical[2]` | 6 | 1 | 2 | - | Has been using magic to alter memories of specific events |
| 70 | 4.7 / 20.7 / 32.0 | `TITLE_SECRETS["the fuller"][2]` | 3 | 1 | 2 | - | Lent money to a weaver at a rate that has taken half of everything the weaver earns for years |
| 71 | - / - / 32.0 | `TITLE_SECRETS["the chancellor"][2]` | 3 | 1 | 2 | F5+S9 | Lets forbidden research continue in the academy's lower rooms, for a share of what it earns |
| 72 | - / 23.3 / 32.0 | `TITLE_SECRETS["the master metalworker"][2]` | 3 | 1 | 2 | - | Makes fine tools for a buyer who uses them to break into strongboxes |
| 73 | 7.3 / 21.3 / 32.0 | `TITLE_SECRETS["the master smith"][1]` | 3 | 1 | 2 | - | Makes weapons at night for buyers who give no names, and leaves the maker's mark off them |
| 74 | 22.0 / 26.0 / 32.0 | `TITLE_SECRETS["the miller"][2]` | 3 | 1 | 2 | - | Mixes ground chalk and bean meal into the flour in the lean months to make it go further |
| 75 | 6.7 / 20.0 / 32.0 | `CRIMINAL.any.criminal[7]` (tag) | 8 | 1 | 2 | F5 | Their legitimate business is a front for moving contraband |
| 76 | 7.3 / 21.3 / 31.3 | `TITLE_SECRETS["the potter"][2]` | 3 | 1 | 2 | - | Sold a set of plates as old work worth far more than they were, and the buyer has started to... |
| 77 | 2.7 / 16.0 / 31.3 | `TITLE_SECRETS["the fuller"][0]` | 3 | 1 | 2 | - | Collects urine for the vats from houses that are paid for it, and some of them are not the h... |
| 78 | 9.3 / 22.7 / 31.3 | `TITLE_SECRETS["the cooper"][1]` | 3 | 1 | 2 | - | Used poor oak for a large order of casks and the wine and ale in them has been spoiling |
| 79 | 8.7 / 18.7 / 31.3 | `TITLE_SECRETS["the cooper"][2]` | 3 | 1 | 2 | - | Has been sleeping with the wife of the man who buys most of the shop's barrels |
| 80 | 0.7 / 11.3 / 31.3 | `TITLE_SECRETS["the lodge master"][1]` | 3 | 1 | 2 | - | Hides a deserter in the lodge's back rooms, an old comrade who could not face another war |
| 81 | 6.0 / 13.3 / 31.3 | `TITLE_SECRETS["the midwife"][2]` | 3 | 1 | 2 | - | Lost a mother and child through a mistake never admitted to anyone, and blamed it on a fever |
| 82 | 9.3 / 18.7 / 31.3 | `TITLE_SECRETS["the cooper"][0]` | 3 | 1 | 2 | - | Makes barrels with a hidden false floor for a buyer who never says what goes beneath it |
| 83 | 10.7 / 25.3 / 31.3 | `TITLE_SECRETS["the master baker"][1]` | 3 | 1 | 2 | - | Mixes sawdust and chalk into the cheapest loaves when flour is dear |
| 84 | 11.3 / 27.3 / 31.3 | `TITLE_SECRETS["the apothecary"][0]` | 3 | 1 | 2 | F5 | Sells a few drops of something stronger to anyone who asks quietly and pays in silver |
| 85 | - / 12.7 / 31.3 | `TITLE_SECRETS["the outfitter"][0]` | 3 | 1 | 2 | F5 | Sells used gear taken from the bodies of dead delvers as new, after a scrub and a polish |
| 86 | 4.0 / 24.0 / 31.3 | `TITLE_SECRETS["the cobbler"][0]` | 3 | 1 | 2 | - | Uses cheap leather for the soles and good leather where it shows, and charges for good leath... |
| 87 | - / - / 30.7 | `TITLE_SECRETS["the librarian"][0]` | 3 | 1 | 2 | F5 | Has been selling rare books from the library's stacks and replacing them with copies |
| 88 | - / 30.7 / 27.3 | `TITLE_SECRETS["the master metalworker"][0]` | 3 | 1 | 2 | F5 | Has been making locks and selling copies of their keys to someone who pays for each one |
| 89 | 3.3 / 14.0 / 30.7 | `TITLE_SECRETS["the glassmaker"][1]` | 3 | 1 | 2 | F5 | Has been copying a famous workshop's mark and selling ordinary glass as theirs |
| 90 | 4.7 / 20.0 / 30.7 | `TITLE_SECRETS["the smelt master"][0]` | 3 | 1 | 2 | F5 | Has been mixing cheap metal into the bars and selling them as pure |
| 91 | 12.7 / 27.3 / 30.7 | `TITLE_SECRETS["the bowyer"][0]` | 3 | 1 | 2 | F5 | Has been selling bows and arrows to people who have no right to hunt and every reason to wan... |
| 92 | 12.7 / 27.3 / 30.7 | `TITLE_SECRETS["the apothecary"][1]` | 3 | 1 | 2 | - | Has been stretching the costly remedies with cheap fillers and charging full price |
| 93 | 6.0 / 20.0 / 30.7 | `CRIMINAL.any.magical[5]` | 6 | 1 | 2 | - | Has been studying a forbidden school of magic under a false research pretext |
| 94 | 6.0 / 16.7 / 30.7 | `TITLE_SECRETS["the bath-keeper"][2]` | 3 | 1 | 2 | - | Lets a man listen through the wall of the steam room and pays him a share of what he hears |
| 95 | 12.0 / 30.7 / 30.7 | `TITLE_SECRETS["the master baker"][2]` | 3 | 1 | 2 | - | Pays the miller to send the best flour to the bakery and the poorer flour to every other oven |
| 96 | 7.3 / 21.3 / 30.7 | `TITLE_SECRETS["the bath-keeper"][0]` | 3 | 1 | 2 | - | Rents the back rooms of the baths by the hour, and has seen most of the important people in ... |
| 97 | 3.3 / 22.7 / 30.7 | `TITLE_SECRETS["the front man"][1]` HIDEABLE | 3 | 1 | 2 | F5+S9 | Skims a little from the money that passes through the shop before it reaches its real owners |
| 98 | 11.3 / 24.0 / 30.0 | `CRIMINAL.any.personal[7]` | 8 | 1 | 2 | - | Has been slowly poisoning a rival with something that looks like natural illness |
| 99 | 7.3 / 22.7 / 30.0 | `TITLE_SECRETS["the master carpenter"][1]` | 3 | 1 | 2 | F5 | Charges every job for more wood than it used and sells the difference on the side |
| 100 | 3.3 / 21.3 / 30.0 | `TITLE_SECRETS["the cartographer"][1]` | 3 | 1 | 2 | F5 | Copied a survey that was meant to stay secret and has been selling copies to anyone with the... |
| 101 | - / 30.0 / 30.0 | `TITLE_SECRETS["the senior charter master"][0]` | 3 | 1 | 2 | - | Takes a cut from every reward and tells the adventurers the fee is the hall's |
| 102 | 2.0 / 18.7 / 30.0 | `TITLE_SECRETS["the brewer"][0]` | 3 | 1 | 2 | - | Thins the ale with water after it is sold by the barrel and charges the taverns for full str... |
| 103 | 6.7 / 17.3 / 30.0 | `TITLE_SECRETS["the sawyer"][0]` | 3 | 1 | 2 | - | Has been cutting timber from woods that belong to someone else and floating it down at night |
| 104 | 2.7 / 18.0 / 30.0 | `TITLE_SECRETS["the midwife"][0]` | 3 | 1 | 2 | - | Has been ending pregnancies for women who come to the back door at night, and has never told... |
| 105 | - / 18.0 / 30.0 | `TITLE_SECRETS["the hospital's master"][0]` | 3 | 1 | 2 | F5 | Has been selling the hospital's medicines to an apothecary and treating the poor with cheape... |
| 106 | - / - / 30.0 | `TITLE_SECRETS["the chancellor"][1]` | 3 | 1 | 2 | - | Has been taking credit for a student's discovery and publishing it as their own |
| 107 | 2.7 / 9.3 / 30.0 | `TITLE_SECRETS["the fortune teller"][2]` | 3 | 1 | 2 | - | Told a young man his death was near, and he did something desperate because of it |
| 108 | 8.7 / 19.3 / 30.0 | `CRIMINAL.any.magical[1]` | 6 | 1 | 2 | - | Made a binding pact with an entity they now cannot name without consequence |
| 109 | 2.7 / 15.3 / 30.0 | `TITLE_SECRETS["the glassmaker"][0]` | 3 | 1 | 2 | F5 | Sells cheap coloured glass as cut gems to buyers who never think to test it |
| 110 | 8.7 / 22.0 / 30.0 | `CRIMINAL.any.personal[2]` | 8 | 1 | 2 | - | Suffering from an illness they expect to kill them within two years |
| 111 | 12.0 / 26.7 / 30.0 | `TITLE_SECRETS["the master butcher"][0]` | 3 | 1 | 2 | F5 | Sells the meat of animals that died of sickness, cut so the signs do not show |
| 112 | - / 14.7 / 30.0 | `TITLE_SECRETS["the hospital's master"][2]` | 3 | 1 | 2 | - | Signed a death as fever that was poison, at the request of the dead man's heir |
| 113 | 1.3 / 14.0 / 30.0 | `TITLE_SECRETS["the crier"][0]` | 3 | 1 | 2 | - | Takes coin to leave certain notices unread, or to read them so quietly that no one hears |

**To bring every row under 30%: 116 lines** (TITLE_SECRETS 91, CRIMINAL 25). **Under 15%: 248** (TITLE_SECRETS 189,
CRIMINAL 59).

## 2. How a row is chosen, and why a row of three stands on a third of the metropolises

- **CRIMINAL** (`factionLeaderSecret.js :: generateFactionLeaderSecret`, called by `npcGenerator.js :: generateSingleNPC` for
  every face whose title the title table does not write, or whose three title rows are all held). Two DRAWS: the TYPE roll
  (its weights read the place's houses, settings and stresses), then ONE roll in `hookVariety.js :: drawRefusingHeldThrough`
  over `criminalSecretsForHolder(type, class)`, with the personal bucket behind it. The world law filters the rows first
  (`generationContext.js :: allowsSecret`: working magic, the content boundaries). The roll refuses a row the roster already
  holds and falls through in row order. S9's post-pass (`settleMisfitSecrets`) then moves a tagged misfit, and a venal row
  dealt to a principled card, to its next admitted row. The holders here are the senior guild masters, the banker, the
  merchants, the dean and the commanders.
- **TITLE_SECRETS** (the same function, line 126): `pickFromArray` is ONE roll (`rngContext.pick`) over the title's
  unheld rows. Only that title's face draws them. `poolMap.js :: settleTitleLines` gives the next admitted row where a
  declaration refuses one.
- **WHY 30–36%.** A held row is never dealt twice in a place. So once a place has as many faces of a title as the title has
  rows, all three rows stand. A metropolis has a mean of 83.9 cards. The commonest titles of a large place are there more
  than once, and each of their three rows stands on about a third of the metropolises or more. The catch-all's
  rows saturate the same way, over its 20-odd draws a metropolis.

## 3. What a new line costs in stored-field movement

**AN APPENDED ROW WILL NOT DO.** Both draws index by `floor(u × n)`. A fourth row in a title, or a ninth in `criminal`,
re-maps the winner of EVERY draw on that list, in every place. The moved text then moves everything that reads the text:

- The held sets: the next card's refusal, then its draw.
- `getStressHistory`'s presentation class: a word like "knows" adds a roll, and the rest of the place's stream moves.
- `castPowers.js :: rankPowers`' temperament yield.
- S9's and `settleTitleLines`' row lookups.
- The rare deal.

For CRIMINAL it also breaks `CRIMINAL_SECRET_LEGACY_ORDER` (religious, military) and the census export
`NPC_CRIMINAL_SECRETS`. Nor does it reach the bar cheaply. Under the held refusal, a place with as many draws as rows
carries them all (the frames' W/F law), so a joined row's share falls only once the rows outnumber the place's draws.

**THE KEYED SIBLING (the precedent the chair approved for the frames).** The row is drawn exactly as today. Its WORDING is
then chosen draw-free among k wordings, the base being wording 0: a sibling table through `drawDeclared.js ::
resolveSibling`, the pick `pickVariantMixed([base, …siblings], key)` (origin `lane/kernel-mix-2026-11-20` bd42d63c7).
Projected key: `` `${seed}::<pool>:<row>::${cardIndex}` ``. Only `secret.what` and `secret.stakes` move, on the cards whose
wording is not the base. Projected for this tranche:

| thorp | hamlet | village | town | city | metropolis | all |
|---|---|---|---|---|---|---|
| 1 | 10 | 42 | 225 | 624 | 940 | 1,842 cards |

That holds ONLY IF the builder keeps these conditions; each is a stored field that moves otherwise. The script's lint
checks the ones a script can read (3 to 7).

1. **THE HELD KEY READS THE BASE.** `hookRegistry.secrets`, S9's and `settleTitleLines`' held sets and the mints'
   `CarriedSecrets` must count a sibling as its base row. Otherwise a second holder can draw the row, and later draws move.
2. **EVERY LOOKUP BY ROW TEXT READS THE BASE.** These look a row up by its text: `settleMisfitSecrets`'
   `rows.findIndex(…)`, `settleTitleLines`' `lines.secrets.findIndex(…)`, F5-NARROW's pass and the noted source
   (`noteSecretSource`). Each must find the base row. Otherwise a misfit or a refused declaration is missed.
3. **THE STRESS-HISTORY CLASS IS KEPT** (`npcGenerator.js :: getStressHistory`, read on `what`). Dangerous, compromised and
   significant must each be equal to the base's.
4. **THE TEMPERAMENT CLASSES ARE KEPT.** `SECRETS_DENIED_BY_TEMPERAMENT`, the yield's reader, must give an equal answer
   for each temperament. F5's venal answer must be equal too. So a sibling of a row a principled holder may draw is never
   venal, and a venal row's siblings stay venal.
5. **ADMITTED WHEREVER ITS BASE IS** (`generationContext.js :: allowsSecret`). No content topic the base lacks
   (`generatedContentTopicsOf`), no working magic where the base asserts none, and not `binding pact` / `placed compulsion`.
6. **NO WORD A CARRY REWRITES** (merchant, thieves, guild, criminal: `mergeNPCLists`, `withoutMarketWords`,
   `withTownsOwnUnderworld`) **AND NO NAME** (`rareSecrets.js :: exclusionOf` reads names in a secret).
7. **NOTHING THE BASE DOES NOT PRESUME.** The base row's declaration (`TITLE_LINE_DECLARATIONS`) covers the sibling, so a
   sibling needs no house, feature or trade beyond its holder's own (listed per row).

**Measures need the wordings.** `f5.mjs :: sourceOf` and the census tools recognise a row by its text. They will need the
sibling table exported, as the frames' build does.

## 4. The first tranche: 59 lines, 20 rows (ranks 1–23, in rank order, less the three hideable)

- **POOLS.** The one-row pool `CRIMINAL.any.religious` (6 lines). Seven more CRIMINAL rows (21). Twelve TITLE_SECRETS rows,
  three a title (32). Each row is taken to its <15% count.
- **LEFT OUT.** Rank 9 (`the front man`[2]) and ranks 16 and 18 (`the house boss`[2], [0]). Their house is criminal, a
  hideable kind, so every line of theirs needs a house the law forbids a line to need. Their bases need it already. They
  wait for the chair's word.
- **THE NEXT ROW.** Rank 24 (`CRIMINAL.any.magical[3]`, 2 lines) would make 61.

**DECLARATIONS for every line below: NONE beyond its base row's**, and the HOUSES each lists. A title's line presumes
only its holder's own house and trade. A catch-all line presumes no house at all. The script's lint checks every line for
the following. Result: **59 lines, 0 failing, 0 shared sentences.** No drafted line (what or stakes) is found anywhere under
`src/`, or among the frames' 40.

- the base's stress-history class;
- the base's temperament and F5 venal classes;
- a content topic or working magic its base lacks;
- the carries' words;
- a house, feature or trade word it does not list;
- a crime word its base lacks;
- an age or household word;
- a season or climate word;
- an echo (a word, or its stem, twice in one line, what and stakes read together);
- a name slot;
- a closing stop.

### `CRIMINAL.any.religious[0]`: beside "Secretly receives what they believe are genuine divine visions, which terrifies them" / "Acting on the visions would be seen as madness; ignoring them may be worse"

Rank 1: THE ONE-ROW POOL (a clergy holder draws it among six). Held by: any card dealt by role (here guild masters, the banker, merchants, commanders). 6 lines (k = 7).

| # | what | stakes |
|---|---|---|
| 1 | Hears a voice at prayer that answers back, and has told no one what it asks of them | If it came out, some would call them touched and others would start to follow them |
| 2 | Has begun to see the same stranger in every crowd, and is certain the figure was sent as a warning | Speaking of it would end their standing, and silence is costing them sleep |
| 3 | Wakes most nights from one recurring dream of fire, and has come to believe it means something | Anyone who relies on their judgement would think twice if word of it got out |
| 4 | Has felt a presence at their shoulder ever since a night they refuse to describe, and fears it | Talk of it would make them a curiosity at best, and their rivals would see that it went worse |
| 5 | Believes a sign was given to them alone, and has been quietly arranging their affairs around it | Those whose dealings have been bent to suit it will want an account when they find out |
| 6 | Has been given words in a vision that they write down each morning and destroy each night | Someone has found a scrap that was missed, and has been trying to read it |

### `TITLE_SECRETS["the master carpenter"][0]`: beside "Built a roof with green timber to save the cost, and the beams have started to split" / "When that roof comes down, the people under it and the people who paid for it will know who built it"

Rank 2. Held by: the master carpenter. 5 lines (k = 6).

| # | what | stakes |
|---|---|---|
| 1 | Put up a floor on joists set too far apart, and it has begun to bow under a heavy table | If it gives way with a room full of people on it, everyone will remember who laid it |
| 2 | Fitted a staircase with a tread cut short, and has said nothing though two people have fallen on it | Someone will break a bone on it before long, and the owner has started asking questions |
| 3 | Skipped half the bracing on a big job to finish by the promised day, and the frame has started to lean | Anyone passing can see it now, and the customer has begun to ask why |
| 4 | Glued and painted over a cracked beam rather than replace it, and told the owner the work was sound | A coat of colour does not carry weight, and the room above is used more every year |
| 5 | Has been using nails where the trade calls for pegs, to finish faster, and the joints are coming loose | Every piece made that way will fail together, and all of it can be traced back to one bench |

### `TITLE_SECRETS["the chandler"][2]`: beside "Lit the fire that burned out a rival's shop three years ago, and told everyone it was an accident with a lamp" / "The rival's family never believed it, and a witness has turned up"

Rank 3. Held by: the chandler. HOUSES: its own shop. 4 lines (k = 5).

| # | what | stakes |
|---|---|---|
| 1 | Left a lamp burning in the storeroom one night, and the fire that followed was laid at the next-door hearth | The one who was blamed paid for the damage and has never stopped wondering how it started |
| 2 | Mixes something into the tallow to make it burn brighter, and the fumes have been making customers ill | Someone has begun asking what the sick have in common, and the answer is on the shelves |
| 3 | Let a lamp they knew was faulty go out to a buyer, and the blaze it started was put down to bad luck | The burnt fitting was kept, and someone has just recognised the maker's mark on it |
| 4 | Has been pouring spent lye into the gutter behind the shop, and the ground there has turned foul | Those who live nearby have noticed the stink, and are asking where it comes from |

### `CRIMINAL.any.criminal[0]`: beside "Has been embezzling from the organisation they oversee for three years" / "Exposure means disgrace, legal prosecution, and enemies who feel personally betrayed"

Rank 4; venal by F5 and S9 words, and the compromised stress class: siblings keep all three. Held by: any card dealt by role. 4 lines (k = 5).

| # | what | stakes |
|---|---|---|
| 1 | Has been privately skimming what passes through their hands, a little at a time, for longer than anyone would guess | When the accounts are finally checked, the shortfall will lead straight to them |
| 2 | Has been embezzling from the funds placed in their keeping, and covering each loss with the next | One honest audit would bring the whole chain down, and they have run out of ways to delay it |
| 3 | Has been skimming the common purse to settle their own debts, and privately calls it a loan | Those who trusted them with the money would see it very differently |
| 4 | Has been embezzling small sums through an assistant who believes the gaps are honest mistakes | The one who made the entries has begun to see a pattern, and is deciding whom to tell |

### `CRIMINAL.any.political[2]`: beside "Knows the settlement's most important legal document was fraudulently created" / "Revealing it destabilises everything; not revealing it makes them complicit"

Rank 5; "knows" (the significant stress class) and the honest-temperament words ("fraudulent"): siblings keep both. Held by: any card dealt by role. 4 lines (k = 5).

| # | what | stakes |
|---|---|---|
| 1 | Knows the boundary everyone accepts was falsified when it was first drawn, and by whom | Saying so would unsettle every claim that rests on it; staying silent makes them part of it |
| 2 | Knows the oldest grant the place holds was falsified by the very hand that witnessed it | Every right that hangs on it would be open to challenge, beginning with theirs |
| 3 | Knows the tally of who owes what to whom was fabricated long ago to settle a quarrel | Putting it right would reopen old wounds and show who did the work |
| 4 | Knows the agreement everyone cites was made up after the fact, and that nobody ever put their hand to it | Whoever raises it will be asked how long they have kept quiet |

### `TITLE_SECRETS["the lanista"][2]`: beside "Has been drugging fighters before bouts so they lose on the day the money says they should" / "A fighter who died after a bout had something in his blood, and his friends saw it"

Rank 6. Held by: the lanista. HOUSES: its own school. 3 lines (k = 4).

| # | what | stakes |
|---|---|---|
| 1 | Sends fighters back out on wounds that have not closed, and tells the crowd they are fit | One of them collapsed in the middle of a bout last time, and the others have begun to talk |
| 2 | Has been matching a favoured fighter only against those who are carrying hidden injuries | The ones who lost have compared notes, and the pattern is plain to them |
| 3 | Lets the practice weapons go unchecked, and one that should have been blunted laid open a trainee's arm | That fighter has kept the scar, and the edge that made it, and is waiting for the right listener |

### `CRIMINAL.any.criminal[1]`: beside "Secretly directs a fencing operation through a trusted intermediary" / "Criminal liability and the end of any political or social standing"

Rank 7; venal by F5 words only: siblings likewise. Held by: any card dealt by role. 3 lines (k = 4).

| # | what | stakes |
|---|---|---|
| 1 | Quietly sells on goods that arrive without papers, through a go-between who carries the risk | If that middleman is ever caught, the trail runs straight back to them |
| 2 | Holds a hidden stake in a back-room trade selling goods no one asks the origin of | Exposure would end their standing, and the partners would not take the loss kindly |
| 3 | Arranges the selling of goods no honest owner would part with, and never touches any of it themselves | One careless buyer could tie them to all of it |

### `CRIMINAL.any.personal[4]`: beside "Was directly responsible for a death that was ruled an accident" / "Criminal liability and the complete destruction of their reputation"

Rank 8. Held by: any card dealt by role. 3 lines (k = 4).

| # | what | stakes |
|---|---|---|
| 1 | Caused the fall that lamed a neighbour, and let everyone believe the ladder simply gave way | The one who was hurt has never walked well since, and would not forgive being deceived |
| 2 | Gave the order that sent someone into a danger they never came back from, and let it be called misfortune | If the truth were known, the friends of the one who was lost would want more than an apology |
| 3 | Struck a stranger in a quarrel that ended badly, and let it be put down to a stumble in the dark | Someone saw more than they have said, and has begun to hint at it |

### `CRIMINAL.any.political[0]`: beside "Has been feeding strategic intelligence to outsiders who pay for it" / "Treason charges; execution or exile in most jurisdictions"

Rank 10; the dangerous stress class ("feeding"): siblings carry "selling information" / "passed information"; venal by F5 words only. Held by: any card dealt by role. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Has been selling information on the place's weak points to a buyer from outside | If it is ever acted on, the charge would be treason, and few would speak for them |
| 2 | Has passed information from every important gathering to outsiders, for coin | Those buyers keep records too, and one bad day for them would be a far worse one here |

### `TITLE_SECRETS["the cobbler"][2]`: beside "Ran up gambling debts and has been quietly selling the tools of the shop one by one to pay them" / "The shop cannot fill its orders much longer, and the people owed the shoes have already paid"

Rank 11; venal by F5 words only. Held by: the cobbler. HOUSES: its own shop. 3 lines (k = 4).

| # | what | stakes |
|---|---|---|
| 1 | Has been selling the leather set aside for orders already taken, to cover a debt kept hidden from everyone at the bench | Customers who paid in advance are still waiting, and their patience is running short |
| 2 | Sold the shop's best lasts for coin to cover a loan that went wrong, and works now with borrowed ones | Their owner wants them back within the month, and there is nothing left to buy them with |
| 3 | Has been selling shoes made to one person's order to anyone who offers more, and telling the first the work was spoiled | That buyer has since seen the pair walking past on someone else |

### `CRIMINAL.any.criminal[2]`: beside "Ordered what was officially ruled an accident, and sleeps fine about it" / "Murder charge, loss of everything, and the victim's family who suspects the truth"

Rank 12. Held by: any card dealt by role. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Arranged the mishap that everyone calls bad luck, and has never lost a night's sleep over it | Someone who was there that day has started to remember it differently |
| 2 | Had a rival ruined by a rumour of their own making, and watched them leave without a word of regret | That old opponent has come back, and is asking where the story began |

### `TITLE_SECRETS["the customs collector"][1]`: beside "Has been recording lower duties than were paid and keeping the difference" / "Anyone who checks the receipts against the books would find years of missing coin"

Rank 13; S9's words without F5's: siblings likewise. Held by: the customs collector. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Has been weighing loads short on the scales and keeps the extra duty for themselves | One trader has started checking every cargo before it arrives, and the figures do not agree |
| 2 | Lets favoured carts through at a lower rate because someone paid them to look away | The drivers charged in full have noticed which wagons never wait |

### `TITLE_SECRETS["the master weaver"][2]`: beside "Copied a rival's pattern stitch for stitch and sold it for years as their own design" / "The rival has the original drawings and has been waiting for the right moment to show them"

Rank 14. Held by: the master weaver. 3 lines (k = 4).

| # | what | stakes |
|---|---|---|
| 1 | Takes the credit for a weave an apprentice worked out, and has never once said whose it was | The true inventor has moved on, and tells the story to anyone who will listen |
| 2 | Wove a commissioned piece with a mistake near its heart and covered it with the border | The buyer displays it to every visitor, and the fault is beginning to come through |
| 3 | Has been passing off a cheaper yarn in the finest work and charging for the best | Anyone at a loom who handles the cloth could tell, and one already has |

### `TITLE_SECRETS["the prison warden"][2]`: beside "Keeps a prisoner in the cells long after their sentence ended, at the request of someone who pays for it" / "The prisoner's family thinks they are dead; if they learn otherwise, they will want to know why"

Rank 15; the dangerous stress class ("cell" in "cells"): siblings keep "cell"; venal by F5 words only. Held by: the prison warden. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Hands out the better cells for coin, and puts anyone who cannot find it on bare stone | One inmate who fell ill down there has friends outside, and they have heard how it happened |
| 2 | Has been selling word of who sits in which cell to anyone who asks | A prisoner found that way has had unwelcome visitors since, and their friends want to know who talked |

### `CRIMINAL.any.political[3]`: beside "Has been delaying vital information from reaching the decision-makers" / "When the consequences emerge, the delay will be investigated and traced"

Rank 17. Held by: any card dealt by role. 3 lines (k = 4).

| # | what | stakes |
|---|---|---|
| 1 | Has been holding back warnings that should have gone up the line, until it was too late to act on them | Sooner or later someone will ask why the news always reached the top a day behind |
| 2 | Has been sitting on reports that would change minds at the head of things, and letting the old course run on | When it goes wrong, those papers will be found with the day of their arrival on them |
| 3 | Has been steering what is put to those in charge so that the awkward matters never come up | Someone whose question was struck off has noticed, and wants to know who did it |

### `TITLE_SECRETS["the smelt master"][1]`: beside "Lets the furnace smoke and run-off poison the stream below the smelter, and pays a man to keep quiet" / "The families downstream whose animals died would want someone to blame, and it would not be the man who was paid"

Rank 19; not venal (the payment is in its stakes): siblings pay no one. Held by: the smelt master. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Has been tipping slag into an old pit behind the works, and nothing will grow for a long way round | The ground is spreading the damage, and the neighbours have begun to ask why |
| 2 | Keeps the furnace running harder than its walls were built for, and the cracks have been patched rather than mended | When it gives, those working beside it will be the first to learn of it |

### `TITLE_SECRETS["the sawyer"][1]`: beside "Sells green planks as seasoned and the buildings made from them warp within a year" / "The builders who used the wood would want their losses back, and their customers would want them first"

Rank 20; venal by F5 words only; its declaration (`trade at work: building`) rides the row and covers the siblings. Held by: the sawyer. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Sells boards with the rot cut out and the gaps filled, and they give way under load | Whoever built with them will want their losses made good, and soon |
| 2 | Has been selling short lengths as full ones, using a measuring rod that was cut down | One customer has checked a load at home and found what is missing |

### `TITLE_SECRETS["the watch commander"][0]`: beside "Takes a monthly payment to keep patrols away from certain streets on certain nights" / "The streets that were left alone have seen crimes, and the payments are written down somewhere"

Rank 21; venal by F5 and S9 words: siblings likewise. Held by: the watch commander. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Has been paid to look the other way when certain carts come in after dark | What came in on those nights has started turning up where it should not, and questions are being asked |
| 2 | Has debtors picked up on small charges for a moneylender, for a share of whatever is recovered | Those taken in have begun comparing notes, and the same creditor stands behind every one |

### `TITLE_SECRETS["the hospital's master"][1]`: beside "Lets families who give generously jump the line for beds while the poor wait in the hall" / "A patient died in the hall last winter while a bed stood empty for a patron's servant"

Rank 22; venal by F5 words only ("give generously"). Held by: the hospital's master. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Keeps the quiet rooms for patients whose patrons give generously, and puts the rest on pallets in the corridor | One of those left outside did not recover, and the people who brought them have started asking why |
| 2 | Sells the best care in the place to whoever offers most, and leaves everyone else to the novices | A mistake by one of the untrained cost a life lately, and the master signed the roster that day |

### `TITLE_SECRETS["the dyer"][1]`: beside "Sells cheap colours as costly ones, and they wash out at the first rain" / "Every tailor who bought the cloth would want the difference back, and so would their customers"

Rank 23; venal by F5 words only. Held by: the dyer. 2 lines (k = 3).

| # | what | stakes |
|---|---|---|
| 1 | Sells a single dipping as a double one, and the colour fades within weeks of wear | Buyers have begun holding old pieces up against new ones, and seeing the difference |
| 2 | Has been selling a cheap blue as the costly kind that comes from far away, and few can tell until it runs | One customer who noticed has kept quiet until now, and has been collecting samples |

**Judgment calls for the chair's eye:**

- **THE BAR.** Each row goes to <15% (the frames' bar) rather than many rows to <30%. §6 prices the other choice.
- **THE ONE-ROW POOL'S SIBLINGS ASSERT NO WORKING MAGIC** (the base does: "divine visions" is `MAGIC_ASSERTION_PATTERN`).
  They ride the base, so they print only where the base is admitted, a world where magic works. Each keeps a private,
  unsought religious experience; none names a temple, a priest or a god. Their holders are guild masters, bankers,
  merchants and commanders.
- **THE CATCH-ALL'S LINES ARE TRUE OF ANY HOLDER.** Embezzlement 1 says "what passes through their hands", not dues, and 4
  says "an assistant", not a clerk. Personal[4] 2 ("Gave the order…") presumes the holder gives orders. Its holders on the
  900 head houses and powers: the senior craft-guild master, the company captain, the lord, the garrison commander.
- **TWO LINES STAND ON A WORKS' OWN GROUND.** Chandler 4 (lye in the gutter behind the shop) and smelt master 1 (slag in
  an old pit behind the works). Neither names a stream: the smelt master's base does, and the siblings drop it.
- **FOUR CHOICES OF WORDS:**
  - The watch commander's siblings keep S9's words. "Paid to look" and "for a share" are needed so that a principled
    commander is refused them as he is refused the base.
  - The customs collector's keep S9's words without F5's: "keeps the extra", "because someone paid".
  - The prison warden's keep "cell", the base's dangerous-class word.
  - The weaver's 3 ("charging for the best") is not on F5's list, as the base is not.

## 5. Projected share per row and per size, after

These figures assume the 59 lines, each row at its k, and the key above. They are projected on the same 900, with the
drafted sentences in place. For each row, the commonest wording's share of the places is given before and after (%). Its
stakes are the same cards.

| row | k | town | city | metropolis | ten keys: median / worst |
|---|---|---|---|---|---|
| `CRIMINAL.any.religious[0]` | 7 | 42.0 -> 8.7 | 64.0 -> 11.3 | 70.7 -> 12.7 | 14.0 / 16.7 |
| `TITLE_SECRETS["the master carpenter"][0]` | 6 | 17.3 -> 6.0 | 51.3 -> 10.0 | 64.7 -> 12.7 | 14.7 / 17.3 |
| `TITLE_SECRETS["the chandler"][2]` | 5 | 8.7 -> 3.3 | 36.0 -> 9.3 | 59.3 -> 14.0 | 14.7 / 16.7 |
| `CRIMINAL.any.criminal[0]` | 5 | 16.0 -> 6.0 | 41.3 -> 12.7 | 53.3 -> 14.0 | 14.0 / 15.3 |
| `CRIMINAL.any.political[2]` | 5 | 17.3 -> 5.3 | 30.0 -> 10.7 | 48.7 -> 12.7 | 12.7 / 15.3 |
| `TITLE_SECRETS["the lanista"][2]` | 4 | 3.3 -> 1.3 | 10.7 -> 4.0 | 44.7 -> 14.7 | 13.3 / 14.7 |
| `CRIMINAL.any.criminal[1]` | 4 | 10.7 -> 4.0 | 35.3 -> 10.7 | 40.7 -> 15.3 | 12.7 / 15.3 |
| `CRIMINAL.any.personal[4]` | 4 | 8.0 -> 3.3 | 18.0 -> 7.3 | 40.0 -> 12.7 | 12.7 / 15.3 |
| `CRIMINAL.any.political[0]` | 3 | 14.0 -> 6.7 | 28.7 -> 11.3 | 39.3 -> 16.0 | 14.7 / 19.3 |
| `TITLE_SECRETS["the cobbler"][2]` | 4 | 8.7 -> 4.0 | 19.3 -> 8.7 | 38.7 -> 11.3 | 12.0 / 14.7 |
| `CRIMINAL.any.criminal[2]` | 3 | 6.7 -> 2.7 | 25.3 -> 10.0 | 38.0 -> 14.7 | 14.7 / 16.7 |
| `TITLE_SECRETS["the customs collector"][1]` | 3 | 6.0 -> 2.7 | 28.7 -> 10.7 | 37.3 -> 15.3 | 14.7 / 18.0 |
| `TITLE_SECRETS["the master weaver"][2]` | 4 | 8.7 -> 4.0 | 28.0 -> 10.7 | 37.3 -> 10.0 | 11.3 / 14.0 |
| `TITLE_SECRETS["the prison warden"][2]` | 3 | - | 23.3 -> 10.0 | 37.3 -> 18.0 | 14.7 / 18.0 |
| `CRIMINAL.any.political[3]` | 4 | 11.3 -> 4.0 | 28.0 -> 8.7 | 36.7 -> 10.7 | 11.3 / 13.3 |
| `TITLE_SECRETS["the smelt master"][1]` | 3 | 11.3 -> 4.7 | 19.3 -> 7.3 | 36.7 -> 16.0 | 14.7 / 16.0 |
| `TITLE_SECRETS["the sawyer"][1]` | 3 | 3.3 -> 1.3 | 21.3 -> 9.3 | 36.7 -> 12.7 | 14.0 / 17.3 |
| `TITLE_SECRETS["the watch commander"][0]` | 3 | - | 36.7 -> 14.7 | 36.0 -> 14.0 | 14.7 / 16.0 |
| `TITLE_SECRETS["the hospital's master"][1]` | 3 | - | 16.0 -> 7.3 | 36.0 -> 14.0 | 14.0 / 16.0 |
| `TITLE_SECRETS["the dyer"][1]` | 3 | 4.0 -> 2.7 | 23.3 -> 10.0 | 36.0 -> 15.3 | 14.0 / 16.0 |

On the projected key, six rows land at 15.3–18.0% of metropolises: criminal[1], political[0], the customs collector, the
prison warden, the smelt master and the dyer. The median of ten keys is under 15% for every row (worst 13.3–19.3%). The
builder's exact key moves these within that band, as the frames' k did.

**Sentences on 30%+ outside the frames, by size (what / stakes):**

| size | before | after |
|---|---|---|
| town | 1 / 1 | 0 / 0 |
| city | 17 / 17 | 10 / 10 |
| metropolis | 112 / 111 | 92 / 91 |

At 15%+: city 169 → 150, metropolis 259 → 245. The commonest sentence outside the frames after the tranche:

- town: 25.3%, "Sets the mill's toll by who is asking…" (the miller).
- city: 34.0%, "Sells yesterday's fish as this morning's…" (the fishmonger, rank 27).
- metropolis: 40.0%, "Does not know who the real owners are…" (the front man, hideable).

## 6. The other budget, for the chair's choice

The same 60 lines could be spent at <30% instead: rank order, each row its <30% count, the hideable rows left out. That
covers 57 rows. Projected sentences on 30%+: city 17 → 5, metropolis 112 → 53 (what; stakes 111 → 54). The cost: no row
goes under 15%, and the lines spent at k = 2 must be added to later. At k = 2 a row is about half its share; at <15% it
needs k = 3–7. Either way the whole cure is 116 lines (<30%) or 248 (<15%) over the 113 rows.

## 7. Noticed, not this brief's

- **THE HIDEABLE HOUSES' SIX ROWS** stand on 30%+ of a size's places (five of them in metropolises, the black marketeer's in cities): the front man [2], [1]; the house boss [2], [0]; the
  black marketeer [1]; the whisper broker [1]. Their siblings would need a house of a hideable kind, as their bases do.
  They need a ruling before anyone drafts.
- **THE GUILD CARRY SPLITS A ROW.** `CRIMINAL.any.criminal[3]`'s `what` is rewritten per place (15.3% as dealt), while its
  stakes stand at 32.0%. A stakes-only sibling would cure it, which no other row needs.
- **THE CATCH-ALL'S HOLDERS INCLUDE "the network's head"** (a criminal network, a hideable house) for the political rows.
  The rows presume no house, so the lines are unaffected.
- **VILLAGES:** nothing reaches 30%. The miller's "Mixes ground chalk…" stands at 26.0% of villages and 32.0% of
  metropolises (rank 74).
