# FRAME-1 — the measure and the proposal, before the build

Written 2026-11-20T04:25Z (`date -u`) by FRAME-1 on `lane/frame-2026-11-20`, base `origin/lane/join-2026-11-14` at `85fccf898`; assignment read at `lane/chair-2026-11-08` `d3981afb2`. Vetoable throughout. The rules below are drafted as code (`src/domain/tension/`, uncommitted until the chair answers) so the preview is executed, not imagined.

## 1. Where a calm sheet's lead comes from today (measured)

Pool: 330 calm born towns, 55 per tier (thorp to metropolis), seeds `frame-calm-<tier>-<i>`, 484 births tried (154 had a crisis and were set aside). Executed at the base.

- The opening line is `pressureSentence` in 330 of 330. It names two people (a tie beat: "Jong Kobayashi and Yuna Hayashi are tied by a debt not yet paid…") in 173, one person in 3, and no one in 154.
- The first person to voice is the seat-holder in 330 of 330; the senior cleric is the second in 220; no calm sheet voices a third person.
- Every calm town holds at least one standing tension: one in 169, two in 97, three in 64.

## 2. The tension record and "sharpest"

`history.currentTensions[]`: `{ type, description, factions[3], plotHooks[], lastingEffects[], severity }`. `severity` is stored as the TEMPLATE's list of grades (e.g. `["minor","major"]`), not one grade. Of the 1,665 side words in the pool, 274 are a power's name or fallback words the generator wrote over the template label at birth ("Military/Guard" for "Official guards"); the rest are the template's words.

RANK: the highest grade the record's `severity` admits (catastrophic > major > minor), the record's order breaking a tie (the generator writes the town's own pressures first: crime signal, neighbour, stress; then the fill). On the pool: catastrophic at position 0 in 68, major at 0 in 197, minor at 0 in 10; the rank moves the trouble off position 0 in 55 towns (catastrophic at 1 in 38, at 2 in 15; major at 1 in 2).

## 3. The labels and the archetypes (CF5)

The chair's 48/144 is the `factions:` line count; measured: 29 types, 49 side lists (each type's own and its memory forms `dated`/`unanchored`), 147 positions, 130 distinct labels. All 130 classed into 13 archetypes in `src/domain/tension/sideArchetypes.js :: SIDE_ARCHETYPE` (historyData.js untouched). The walker will red on an unclassed label and on two forms of one position classed apart.

| archetype | labels | the labels | ladder (rate) |
| --- | --- | --- | --- |
| authority | 10 | Legitimate heir; Corrupt officials; Debtors who took the loans; Those who took the loans; Authorities exploiting the rift; Those in authority who would exploit the rift; The restored order; Those in charge, who will not give way; The sitting authority; Authorities caught between them | office 0.5 → tie 0.8 → trade 0.5 |
| establishment | 13 | Established guilds; Guild members; Anti-magic; Traditionalists; Original claimants; Old families; Landowners on the high ground; Old loyalists; Loyalist families; Those who want a strong hand; Established residents; Merchants tied to the old partner; Merchants who trade with the partner | office 0.4 → trade 0.6 → tie 0.8 |
| challenger | 16 | Popular candidate; Reformists; Upstart guilds; Those who would trade outside the guild; Vigilantes; Those who would take the law into their own hands; Pro-magic; Progressives; Former resistance; Resistance families; Multiple weak claimants; Rival claimants, none strong enough to win; Former rebels; Those pressing their demands; Those who deny its mandate; Those who want new partners | tie 0.7 → trade 0.5 → office 0.5 |
| reformer | 14 | Moderate reformers; Seek diplomacy; Price regulators; Those who would fix a fair price; Regulation advocates; Reformers; New generation wanting to move on; Those who want it forgotten; Civil libertarians; Pragmatists who want stability; Those who want timber and thatch forbidden; Scholars studying the residue; Those who would study the flares; Pragmatists who want any stable answer | tie 0.6 → trade 0.5 → office 0.4 |
| payer | 24 | Poor workers; Non-guild workers; Desperate poor; Those who cannot pay the prices; Those who will bear the cost; Current occupants; Ruined speculators; Those buying as if prices can only rise; Displaced traders; Workers left without wages; Traders who fear the buyers are going elsewhere; Workers afraid for their wages; Survivors seeking someone to blame; Families still seeking someone to blame; Households who cannot afford to build in anything else; The bereaved and the blamed; Families who refuse to be shut in; Displaced families; Households on the low ground; Overwhelmed old residents; Residents who want no crowds of strangers; Those who suffered under the regime; Families the regime wronged; Those who fear a tyrant in the making | tie 0.8 → trade 0.7 |
| blamed | 6 | Former collaborators; Collaborator families; Those accused of setting it; The accused and their sympathizers; The changed and their descendants; Those touched by the flares | tie 0.7 → trade 0.6 |
| profiteer | 24 | Power behind throne; Wealthy merchants; Hoarders; Those hoarding what they can; Complicit beneficiaries; Those who profited and escaped; Those who profited and want no questions asked; Legal class profiting from ambiguity; Merchants who benefit from cheap newcomer labour; Those who prefer the vacuum; Those who prefer things unsettled; Those who sold in time; Those who have sold and are waiting; Rivals who profited from the diversion; Rivals who would gain if the trade moved; Rebuilders and profiteers; Landowners pressing newly-convenient claims; Those who profited from the redrawing; Temple beneficiaries; Those who changed sides at the right moment; Beneficiaries who kept their gains; Families who kept the regime's gains; Those who will serve whoever wins; Those profiting from the churn | criminal 0.4 → tie 0.7 → trade 0.6 → office 0.5 |
| creditor | 1 | Creditors calling in debts | outsider 0.6 → criminal 0.5 → tie 0.8 |
| enforcer | 5 | Prepare for war; Official guards; Security hardliners; Quarantine hardliners; Those who would shut the sick away | office 0.4 → tie 0.7 → trade 0.5 |
| faithful | 4 | Orthodox believers; Those who trust to prayer and old remedies; The accusers; Those who would proclaim the miracle | office 0.4 → trade 0.6 → tie 0.7 |
| outsider | 3 | Actual agents exploiting the confusion; Newcomers; The newly arrived or departing | outsider 0.7 → criminal 0.4 → tie 0.7 |
| criminal | 1 | Criminal organisations | criminal 1 → outsider 1 |
| middle | 9 | Secular camp; Flee/hide; Pragmatic middle; Those who say the danger is overblown; Healers and charlatans alike; Those who say the water will never come; Sceptics who doubt the miracle; Those waiting to see which side wins; Those who fear them | tie 0.6 → trade 0.6 |

Types 29; side lists 49 (each type's own and its memory forms); positions 147; distinct labels 130; classed 130.

## 4. The ladders, the rates, the caps (CF4)

Kinds: **office** (the seat-holder for authority; for another archetype the head of the power its kind names: military → enforcer "commands", religious → faithful, merchant → profiteer, the trouble's own office kinds → establishment; a side the record writes as a power's NAME is filled by office only by that power's head); **tie** (a tie on the record whose kind speaks of the matter: debt ties for a debt, crooked ties for crime and corruption, heir ties for succession, rivalry for trade and guilds; a debt's debtor stands with those who pay, its creditor with those who profit; or, for payer/blamed/middle/challenger/reformer, a person whose OWN hook or secret uses the matter's words); **trade** (a person whose role, title or house is one the trouble touches: the granary and mill for a shortage, the moneylender and factor for a debt, healers for plague, masons for fire…); **outsider** (never named: "not named here; X keeps the coaching inn, where strangers lodge, and would know of them"); **criminal** (the criminal power at roster power ≥ 5, by its head, else the house by name).

FIRING: facts first (who CAN stand at each rung; a criminal side takes the criminal power where one stands); then `castHash(seed, type, side:kind) < rate`, rung by rung; then the first rung the town can fill; else ABSENT ("No one here is named for it."). Office takes the first by rank; a tie, a trade or a keeper is chosen among the eligible by the hash. CAPS (`FRAME_TUNING`): one side by office per trouble; the seat-holder fronts one side; nobody holds two sides; a crisis-cast person is never put on a side. All numbers in the one frozen table.

## 5. The preview: the same 330 towns under these rules

Absent is high (a third) because a tie counts only where its kind speaks of the trouble and a trade only where the trouble touches it; a fire, a flood, an uprising have no tie of their own. That is the truthful floor of CF6; the rungs and rates are the dials if the chair wants fewer empty sides.

| face of a side | sides of 990 |
| --- | --- |
| absent | 326 (33%) |
| a person by a tie | 173 (17%) |
| a trade's master | 137 (14%) |
| a person by a tie (own hook) | 98 (10%) |
| a power's head | 69 (7%) |
| a force's commander | 61 (6%) |
| seat-holder | 53 (5%) |
| the criminal power | 47 (5%) |
| an outsider (reached) | 26 (3%) |

Towns with all three sides named: 146 of 330.

| archetype | sides | faces |
| --- | --- | --- |
| establishment | 84 | a power's head 41; a trade's master 19; absent 16; a person by a tie 5; a force's commander 3 |
| payer | 144 | absent 49; a person by a tie 39; a person by a tie (own hook) 38; a trade's master 18 |
| profiteer | 88 | absent 39; a person by a tie 24; the criminal power 18; a trade's master 5; a power's head 2 |
| challenger | 155 | a person by a tie 56; absent 38; a person by a tie (own hook) 33; a trade's master 17; a power's head 11 |
| authority | 66 | seat-holder 53; a person by a tie 9; a trade's master 4 |
| middle | 104 | absent 71; a trade's master 17; a person by a tie 8; a person by a tie (own hook) 8 |
| reformer | 94 | absent 40; a trade's master 18; a person by a tie (own hook) 15; a power's head 11; a person by a tie 10 |
| enforcer | 113 | a force's commander 58; a trade's master 21; absent 19; a person by a tie 15 |
| outsider | 14 | an outsider (reached) 8; absent 5; the criminal power 1 |
| faithful | 41 | absent 18; a trade's master 16; a power's head 4; a person by a tie 3 |
| blamed | 25 | absent 17; a person by a tie (own hook) 4; a person by a tie 2; a trade's master 2 |
| criminal | 59 | the criminal power 28; an outsider (reached) 17; absent 14 |
| creditor | 3 | a person by a tie 2; an outsider (reached) 1 |

Most frequent roles on a side: the garrison commander 42; the network's head 39; Elder 36; the priest 26; the innkeeper 21; the scroll scribe 18; the miller 16; the apothecary 13; the bowyer 13; the lord 12; the watch captain 12; the dean 12; the midwife 10; Mayor 10; the charter master 8.

## 6. Which surfaces draw the sheet (CF3), and a finding

`composeTonightSheet` is read by: the Table View (`TableView.jsx`, an overlay `OutputContainer` mounts), Session Mode, the PDF chapter `tonightAtTheTable` (variants draft_brief, canon_dossier, campaign_state; not timeline_packet), the Foundry journal's Tonight page (same variant gate), `crisisPage.js` (the facts only) and `crisisFactFindings.js` (crisis towns only). No PDF or Foundry variant is a player variant; the world export's `player` variant ships the `toPublicSafe` record (data, no sheet).

**FINDING (pre-existing, not in my manifest):** `OutputContainer.jsx` mounts `<TableView>` on `flag('tableView') && tableViewOpen` with NO `readOnly`/`publicDossier`/`playerView` gate, and passes the Overview's "Open Tonight" button (`onOpenTableView`) on every surface. `PublicDossierView` (the gallery) and `PartyLinkView` (lazy `PublicDossierView`) both render `OutputContainer readOnly`, so a viewer of a shared town can open the Tonight sheet of the shared projection today, and a persisted `tableViewOpen` pref opens it unasked. MY GATE (in my files, fail closed): the frame needs the record's `_seed`, which `toPublicSafe` strips on every shared projection, so no frame is cast from a shared record; the CF3 born test will prove it on the gallery read, the party link and the import. I recommend the security lane also gate the mount and the button on `!readOnly || saveId` (its call).

## 7. Three sheets, before and after (plain text, executed)

### Before (base 85fccf898)
```
=== Baiwan (town, seed frame-calm-town-0) ===
[What is urgent] Jong Kobayashi and Yuna Hayashi are tied by a debt not yet paid. Jong Kobayashi has begun to act like someone who considers the debt paid. Yuna Hayashi does not.
[People to voice]
  Kai Luo (Mayor · seat): Wants to answer the next move by Religious Authorities against Merchant Guilds, quickly and in public.
  Yuki Li (the dean · cleric): Wants to make sure Lang Li is not left behind by the changes in the work.
[What the players test first]
  Food: Secure. Stores: a granary, about six months of grain.
  Defence: Town walls, Town watch.
[Hooks]
  - A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find. (Kai Luo)
  - A spy they turned is now being turned back, and feeding information in both directions. (Yuna Hayashi)
  - Both sides have changed the locks on the building, and a third party has been living in it all winter. (Town Council vs Military/Guard)

=== Oxteche (village, seed frame-calm-village-0) ===
[What is urgent] A dispute over field rotation and grazing rights has divided the village for most of this season.
[People to voice]
  Chan Koh (Headman · seat): Wants to find out which members of Merchant Guilds are still friendly with Craft Guilds, and why.
  Acna Ixim (the priest · cleric): Wants to show Ixquil Caan how far they have both come since the lessons ended.
[What the players test first]
  Food: Secure. No granary; about two months in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - Someone has been selling cheaper and worse goods under their mark, and customers are blaming them. (Chan Koh)
  - The debt is due at the end of the month, and the man who signed for it has gone away. (Headman's Authority vs Craft Guilds)
  - What survives from that time says: the newcomers fled something, and that something has sent agents after them. (Demographic Event)

=== Dongdao (thorp, seed frame-calm-thorp-2) ===
[Active crisis] Religious Conversion. Each faith in Dongdao watches the other for an insult, and the next feast day could end in a fight. It is aimed at Chang Liu.
[People to voice]
  Chang Liu (Elder · seat): Wants to pay every hand at the shepherd collective in full and on time this season.
[What the players test first]
  Food: Secure. No granary; about a month and a half in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - In the conversion, it is aimed at Chang Liu of Elder Council, who holds the seat, and the right to it is already in dispute. (Religious Conversion)
  - A regular customer has stopped coming. The reason they've been given doesn't make sense. (The High Priestess)
  - Three members crossed over in a single week, and the side they left wants to know what they were offered. (Elder Council vs Reform Congregation)
```
### After (the draft rules)
```
=== Baiwan (town, seed frame-calm-town-0) ===
[The trouble] The common people are pressing those in charge over guild recognition and fair wages, and each dispute grows louder than the last.
  - Someone is keeping a list of who speaks loudest for the demands, and passing it to those in charge.
  - An outside hand is quietly paying for the agitation, and will want something for it.
  - A concession has been promised to the common people, and someone in authority means to break the promise.
[Its three sides]
  Those pressing their demands: No one here is named for it.
  Those in charge, who will not give way: Kai Luo (Mayor), because he holds the seat. Wants to answer the next move by Religious Authorities against Merchant Guilds, quickly and in public.
  Those waiting to see which side wins: No one here is named for it.
[What the players test first]
  Food: Secure. Stores: a granary, about six months of grain.
  Defence: Town walls, Town watch.
[Hooks]
  - A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find. (Kai Luo)
  - A spy they turned is now being turned back, and feeding information in both directions. (Yuna Hayashi)
  - Both sides have changed the locks on the building, and a third party has been living in it all winter. (Town Council vs Military/Guard)

=== Oxteche (village, seed frame-calm-village-0) ===
[The trouble] Whether one person is taking more power than anyone granted is the quarrel of the day, and every new rule is read as a step toward tyranny.
  - Someone close to authority is gathering powers no one granted, and keeps the papers that show it locked away.
  - A household that spoke out against the new rules has had its goods seized on a pretext, and wants them back.
  - Someone is paying for praise of a strong hand in the street, and stands to profit if it comes.
[Its three sides]
  Those who want a strong hand: Chan Koh (Headman), because he heads the Headman's Authority. Wants to find out which members of Merchant Guilds are still friendly with Craft Guilds, and why.
  Those who fear a tyrant in the making: No one here is named for it.
  Those who will serve whoever wins: No one here is named for it.
[What the players test first]
  Food: Secure. No granary; about two months in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - Someone has been selling cheaper and worse goods under their mark, and customers are blaming them. (Chan Koh)
  - The debt is due at the end of the month, and the man who signed for it has gone away. (Headman's Authority vs Craft Guilds)
  - What survives from that time says: the newcomers fled something, and that something has sent agents after them. (Demographic Event)

=== Dongdao (thorp, seed frame-calm-thorp-2) ===
[Active crisis] Religious Conversion. Each faith in Dongdao watches the other for an insult, and the next feast day could end in a fight. It is aimed at Chang Liu.
[People to voice]
  Chang Liu (Elder · seat): Wants to pay every hand at the shepherd collective in full and on time this season.
[What the players test first]
  Food: Secure. No granary; about a month and a half in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - In the conversion, it is aimed at Chang Liu of Elder Council, who holds the seat, and the right to it is already in dispute. (Religious Conversion)
  - A regular customer has stopped coming. The reason they've been given doesn't make sense. (The High Priestess)
  - Three members crossed over in a single week, and the side they left wants to know what they were offered. (Elder Council vs Reform Congregation)

```
The town in crisis is byte-identical (diffed).
