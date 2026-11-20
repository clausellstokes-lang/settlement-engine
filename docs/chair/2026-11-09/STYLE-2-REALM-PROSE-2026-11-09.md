# STYLE-2-REALM-PROSE — NEWS, CHRONICLE, THE REALM; ARRIVAL, ROADS AND TRADITIONS (2026-11-09)

Seat SW-3 · REALM-PROSE (Opus 5.5), a child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`), on `lane/style-2-realm-prose-2026-11-09`, cut at `a7bc2e4ce` (= `origin/lane/integration-2026-11-07` HEAD, of which `5b267578c` is an ancestor). The brief is `BRIEF-STYLE-2-WAVE-2026-11-09.md` §1 SW-3 on `lane/chair-2026-11-08`; the ruling is A6 of `STYLE-RULINGS-2-2026-11-09.md` (A0, A10 and A12 bind). The worklist is `STYLE-AUDIT-2-SOURCES-2026-11-09.md` §2.2 and §2.3 on `lane/style-2-sources-2026-11-09`. Time labels from `date -u`. **This seat signs nothing**: the golden master moves and is left for STYLE-2-MERGE (§7).

## §0 What was done, in one paragraph

All **169 rows** were taken (newsVoice 59, decreeProsePools 49, traditionProse 11, heraldIntegrity 10, warRemembrance 8, arrivalProse 7, roadsProse 6, chroniclersLetter 5, treatyDocument 4, causeWalk 2, newsBody 2, and warResolve, neighbourMirror, giftsAndDebtsRead, decreeTracker, warStatus and CharterRoadCard 1 each). Every OLD was found at the tip. **All 169 are rewritten.** `chroniclersLetter.js:446` was first left by a STOP, because its JSX twin sits outside the manifest. The chair then widened the manifest to that one twin line, `src/components/map/ChroniclersLetterPanel.jsx:118`, and both halves of the letter moved together as their own cause (§11). **14 more lines** in the same files were cured under A6's tic cure where the audit had passed them (§4b). **Variants by vantage** were added to the tradition summaries (both pools now four variants: the plain line, the traveller, the local, the newcomer) and to the decree chronicle's repeated skeleton (a fourth §8 vantage appended to each of the seven event families, vids 97–103) (§4c). The walker's phrases in these 17 files fell **44 → 1** (§8).

## §1 The cure, by A6's clauses

| A6 clause | done |
|---|---|
| the machinery ("the record", "the ledger", "receipt", "provenance") leaves the herald and remembrance lines | heraldIntegrity 10/10, warRemembrance 8/8 plus its two "a court the record no longer names" fallbacks, causeWalk 2/2 plus its `REDACTED_HOP`, chroniclersLetter 4/5 plus the letter's span header; the decree pool's "the register / the record / the order" bookkeeping in the printed hand, standing and form blocks |
| the "breath" tic leaves the crier pools | 7 of 7 in `newsVoice.js` (128, 266, 297 from the rows; 199, 200, 366, 372 added) |
| the decree chronicle's one skeleton gains variants by vantage | the skeleton is DEC-EVENT's ("What was set down for the coming turn falls on… / The order names a change… / …already spoken for, and waits only on the day"), seven families. Swapped in place and a fourth vantage appended per family (vids 97–103). DEC-EVENT prints on no page today (pinned by `census2gDecreeConnectives`), so the variants wait for the page. The PRINTED blocks cannot take new variants: `census2gDecreeConnectives` pins them to exactly vids 1–51 (§2) |
| the tradition summaries lose their aphorism closers and gain variants by vantage | 7 of 7 closers struck; held and cancelled pools rewritten to four variants each |
| the five remaining "stranger(s)" go | arrivalProse 306, 360, 387, 389, 462; also newsVoice 223 and 328 (rows) and treatyDocument's four "strangers' / any stranger" (added). The migration crier lines whose strangers ARE the evidence (newsVoice 307, 313, 319, 330, 339, 567) are left, as the audit passed them (the §4 model of STYLE-0) |
| "faction" becomes "power" | 10 of 10: newsVoice 355, 360, 370, 385 (rows), 571 (added); decreeProsePools 317, 318, 357, 358; traditionProse 81 ("sides") |

## §2 The INSTRUMENT words — measured first, left where they are (for the walker's allow-list)

Measured by reading every test that imports `decreeProsePools.js` (`decreeCause.walker`, `decreeProse`, `census2gDecreeConnectives`, `positionDeclarationChannel`, `advanceReportDecrees`, `registryMount`, `proseLeak`) for a text read.

| word / shape | where | read by | what this seat did |
|---|---|---|---|
| **"by the party's hand"** | every DEC-PARTY pool's ledger variant; the DEC-HAND party variants (and "party" in every party hand line) | `tests/lint/decreeCause.walker.test.js:328`, `:503`; `tests/domain/decreeProse.test.js:483-490` | kept verbatim in every line that had it |
| **the five guard kinds** "connection", "contention", "contradiction", "prerequisite", "totality", each inside its own override clause | DEC-OVERRIDE, vids 34–48 | `tests/domain/decreeProse.test.js:152` (`clause.text.includes(kind)`) | kept. The audit's NEW for vids 46–48 ("the totals") would have dropped "totality" and is struck; vid 37's NEW ("contends") would have dropped "contention" and is struck |
| **`{prerequisite}`** in every follows-from variant | DEC-FOLLOWS, vids 49–51 | `tests/domain/decreeProse.test.js:200` | kept (vid 49's NEW "It follows from {prerequisite}." keeps the slot) |
| **"market's arrangement"** | DEC-EVENT vid 54 | `tests/domain/facts/census2gDecreeConnectives.test.js:55` | vid 54 untouched |
| **the printed vid set 1–51** | DEC-HAND, -STANDING, -FORM, -OVERRIDE, -FOLLOWS | `census2gDecreeConnectives.test.js:65` | no variant added to a printed block |
| "the table" | DEC-HAND, DEC-OVERRIDE | not read by a test; design §16's word for the DM's hand, and `cascadeBraid.js:282` quotes "set down by the table's hand" (vid 1) | kept as the chronicle's subject: it is the actor, not machinery |

Instrument words honoured OUTSIDE the decree pool (a test reads the phrase as the line's key; the line was rewritten around it):

- `heraldIntegrity.js:77` keeps "its planter never wrote", one of the four authorless phrases `tests/domain/heraldIntegrity.test.js:148` requires of every planted-then-worn line (the audit's NEW dropped "wear has no author" and named none).
- `warRemembrance.js:166` keeps "seat" (`tests/ui/warRemembranceReader.test.jsx:245`, "STATE, NEVER FATE").
- `warResolve.js:141` keeps "drains slowly" (`tests/domain/display/warResolve.test.js:69`).
- `giftsAndDebtsRead.js:120` keeps "a kindness misremembered" (`tests/domain/giftsAndDebtsRead.test.js:66`, the irony pin).

The walker's one remaining hit in these files is `warRemembrance.js:365`, the receipts label `'In the ledger'` on the DM-only receipts list (redacted for players). No test reads it. It is the DM's provenance layer by design, so it is LEFT and named here for the allow-list.

## §3 The clauses struck under the census law (the audit's NEW re-read against what the writer reads)

The crier pools (`newsVoice.js`) read only the entry's category and beat. The tradition summaries read `{town, name, phrase, ownerBit}`. No line may state more.

| row | the audit's NEW | struck clause, and why | written |
|---|---|---|---|
| newsVoice 128 | …and the levy goes home. | a levy raised: not held by a war `fade` beat | …and the fear along the border has passed. |
| newsVoice 266 | …folk lay in stores against some misfortune… | the stores: an act the beat does not hold | The country is uneasy, and no one can say what misfortune they are waiting for. |
| newsVoice 277 | …the survivors count who is missing. | deaths and missing: not held by a calamity `impact` beat | …homes are lost, and nothing stands where it stood. |
| newsVoice 328 | The flood of strangers… | kept the struck tic | The flood of newcomers… |
| newsVoice 334 | …the newcomers have roofs and work now… | housing and work: not held | …the newcomers are neighbours now… |
| newsVoice 360 | …rival powers in the streets, rival banners… | not a fact; a doubled "rival" | …rival powers in the streets, their banners at the gates… |
| warRemembrance 164 | …a sack that answered no earlier burning; the sack was the first blow. | the meaning was right; a doubled "sack" | It ended in a sack, and that burning was the first blow, not an answer to one. |
| warRemembrance 391 | The terms of its peace are still being settled. | "terms" and "peace": a staged record's facts "may still be arriving" (the writer's own comment), whatever they are | Its peace is not yet fully settled, so this account may still change. |
| traditionProse 87 | …some would pay adventurers to find out what it means. | a reward on offer: not held | …and people are uneasy about what it means. |
| decreeProsePools 37, 46–48 | (the two instrument strikes of §2) | | |
| traditionProse (the official vantage) | — | the tradition record names no council or keeper beyond `ownerBit`, which every variant already prints | not written: three vantages plus the plain line |

## §4 Every line, old → new, for the owner's veto

### §4a The 169 rows (and six of the added lines, in file order as applied)

`note` says where the line came from: the audit's NEW as drafted; seat-corrected (§2 or §3); or added (A6's tic cure in a line the audit had passed). Line numbers are the audit's, at the base.

| # | file:line | OLD | NEW | note |
|---|---|---|---|---|
| 1 | `domain/display/causeWalk.js:33` | The ledger holds no deeper memory of this. | Nothing earlier is known to have caused this. | the audit's NEW |
| 2 | `domain/display/causeWalk.js:35` | This world keeps no recorded ledger of causes. | This world does not keep track of what caused what. | the audit's NEW |
| 3 | `domain/display/chroniclersLetter.js:174` | Herewith the record of what has stirred since you last read my hand. | Herewith what has stirred since you last read my hand. | the audit's NEW |
| 4 | `domain/display/chroniclersLetter.js:177` | And so the ledger stands. Your faithful chronicler. | And so things stand. Your faithful chronicler. | the audit's NEW |
| 5 | `domain/display/chroniclersLetter.js:187` | The world itself has deepened since last we spoke. New currents now run beneath it: | Since last I wrote, the realm has more to tell; these now come into my letters: | the audit's NEW |
| 6 | `domain/display/chroniclersLetter.js:192` | Some older matters outran my pages before this letter was writ; the record here begins where my keeping does. | Some older matters outran my pages before this letter was writ; what follows begins where my keeping does. | the audit's NEW |
| 7 | `domain/display/chroniclersLetter.js:446` | In this my earlier record returns, from ${l.recalls.when}: ${l.recalls.headline}. | This echoes what I wrote of ${l.recalls.when}: ${l.recalls.headline}. | the audit's NEW, with its twin `ChroniclersLetterPanel.jsx:118` (§11) |
| 8 | `domain/display/decreeTracker.js:237` | This decree produced no measurable downstream effect this span. | Nothing that happened this time can be traced to this decree. | the audit's NEW |
| 9 | `domain/display/giftsAndDebtsRead.js:120` | a debt believed, but the aid was freely given. A war brews over a kindness misremembered | a debt believed, but the aid was freely given: a kindness misremembered, and resented for it | seat-corrected: an instrument word kept (see §2) |
| 10 | `domain/display/heraldIntegrity.js:57` | The record carries this as it happened. | This news arrived as it happened, unchanged on the road. | the audit's NEW |
| 11 | `domain/display/heraldIntegrity.js:64` | What left as a report arrived as a story; the road charges no one. | What left as a report arrived as a story, and no one changed it on purpose. | the audit's NEW |
| 12 | `domain/display/heraldIntegrity.js:68` | Planted by {house}, to {purpose}. The record holds the sowing. | Planted by {house}, to {purpose}. | the audit's NEW |
| 13 | `domain/display/heraldIntegrity.js:69` | This did not spring up; it was set. {house}'s hand, {timeband_since}, and the purpose is entered: {purpose}. | This did not spring up; it was set. {house} set it going, {timeband_since}, to {purpose}. | the audit's NEW |
| 14 | `domain/display/heraldIntegrity.js:70` | A bought tale: {npc} carried it, {house} paid for it, and what it was for is on the record, {purpose}. | A bought tale: {npc} carried it, {house} paid for it, and it was meant to {purpose}. | the audit's NEW |
| 15 | `domain/display/heraldIntegrity.js:71` | The seed is signed. {house} planted this at {settlement} to {purpose}, and the ledger has held the receipt since. | The seed is {house}'s: it was planted at {settlement} to {purpose}. | the audit's NEW |
| 16 | `domain/display/heraldIntegrity.js:74` | Planted by {house} to {purpose}, and grown in the carrying into something its planter never wrote. The record charges the sowing; the rest is the road’s. | Planted by {house} to {purpose}, and grown in the carrying into something its planter never wrote. The planting was deliberate; the rest grew on the road. | the audit's NEW |
| 17 | `domain/display/heraldIntegrity.js:77` | The intent is on the record: {house}, to {purpose}. What the tale became after is wear, and wear has no author. | {house} set this going, to {purpose}. What the tale became after is something its planter never wrote. | seat-corrected: an instrument word kept (see §2) |
| 18 | `domain/display/heraldIntegrity.js:80` | The record cannot say where this began; it is old, and its first carrier is not entered. | No one can say where this began; it is old, and who first carried it is not known. | the audit's NEW |
| 19 | `domain/display/heraldIntegrity.js:81` | Provenance ends here. What stands before this link was never receipted, and the paper will not invent it. | The trail ends here. Where this came from before was never written down, and we will not guess. | the audit's NEW |
| 20 | `domain/display/neighbourMirror.js:169` | Nothing has left our hand since. | We have told them nothing since. | the audit's NEW |
| 21 | `domain/display/newsBody.js:115` | The mark of it is on things {scope} now. | The effects of it show {scope} now. | the audit's NEW |
| 22 | `domain/display/newsBody.js:228` | The court held to the war too long; reversing course carried a real political price. | The court held to the war too long, and backing out of it now has cost its rulers dearly. | the audit's NEW |
| 23 | `domain/display/newsVoice.js:96` | Grievance has hardened into muster, and the drums along the front will not be quieted. | The quarrel along the border has come to a muster, and the drums at the front beat day and night. | the audit's NEW |
| 24 | `domain/display/newsVoice.js:100` | A quarrel between neighbours has grown teeth, and the country readies its pikes for the worst. | A quarrel between neighbours has come to arms, and the country readies its pikes for the worst. | the audit's NEW |
| 25 | `domain/display/newsVoice.js:105` | The clash is joined, and the town counts its dead before it counts the cost. | The armies have met at the front, and the town is already burying its dead. | the audit's NEW |
| 26 | `domain/display/newsVoice.js:106` | Steel has met steel at the front; what was feared is now simply true. | Steel has met steel at the front, and the fighting the town feared has begun. | the audit's NEW |
| 27 | `domain/display/newsVoice.js:107` | The fields are trampled and the barns emptied to feed the muster; the war eats everything it touches. | The fields are trampled and the barns emptied to feed the muster. | the audit's NEW |
| 28 | `domain/display/newsVoice.js:120` | The last of the wounded mend by the hearth, and the marches learn the taste of quiet again. | The last of the wounded mend by the hearth, and the marches are quiet again. | the audit's NEW |
| 29 | `domain/display/newsVoice.js:128` | The feared army melted from the marches before a blow fell, and the country lets out its breath. | The feared army melted from the marches before a blow fell, and the fear along the border has passed. | seat-corrected under the census law (§3) |
| 30 | `domain/display/newsVoice.js:135` | The temples stir: a fervor is rising that the priests did not summon and cannot yet name. | The temples are crowded past their hours, and the priests cannot say what has brought the people in. | the audit's NEW |
| 31 | `domain/display/newsVoice.js:137` | A holy wind is gathering; the pilgrims are on the roads and the prayers grow loud. | Pilgrims are on the roads and the prayers grow loud; a great devotion is gathering. | the audit's NEW |
| 32 | `domain/display/newsVoice.js:142` | Something has kindled in the congregation; the priests hurry to shape a fire they did not light. | Something has stirred the congregation, and the priests are hurrying to lead what they did not start. | the audit's NEW |
| 33 | `domain/display/newsVoice.js:147` | What stirred in the temples now rules the streets; the devout carry their conviction like a torch. | What began in the temples has spilled into the streets, and the devout preach on every corner. | the audit's NEW |
| 34 | `domain/display/newsVoice.js:148` | The revival is upon us in full. The priests scarcely lead it, so hard does it pull. | The revival is in full flood, and the priests can scarcely keep up with it. | the audit's NEW |
| 35 | `domain/display/newsVoice.js:161` | The holy fire banks down to a steady warmth, and faith becomes a household thing again. | The crowds at the altars thin, and the people keep their faith at home again. | the audit's NEW |
| 36 | `domain/display/newsVoice.js:169` | The wandering preacher drew a crowd and then a shrug; the tithe-box is as light as it ever was. | The wandering preacher drew a crowd for a day and then moved on; the tithe-box is as light as it ever was. | the audit's NEW |
| 37 | `domain/display/newsVoice.js:201` | The wharves are busy from dawn, and the weigh-house scales sing under honest weight once more. | The wharves are busy from dawn, and the weigh-house scales are in use all day once more. | the audit's NEW |
| 38 | `domain/display/newsVoice.js:210` | Whatever threatened the trade roads came to naught; the ledgers close as black as before. | Whatever threatened the trade roads came to naught, and the merchants' books show no loss. | the audit's NEW |
| 39 | `domain/display/newsVoice.js:223` | They speak of fever on the trade roads, and every stranger is met now with a wary eye. | They speak of fever on the trade roads, and every traveller at the gate is met with a wary eye. | the audit's NEW |
| 40 | `domain/display/newsVoice.js:242` | The worst has passed, the dying has stopped, and the town begins to bury its grief. | The worst has passed, the dying has stopped, and the town buries its dead. | the audit's NEW |
| 41 | `domain/display/newsVoice.js:254` | The feared contagion spared the country entirely, and the watch stands down from the gates unbloodied. | The feared contagion spared the country entirely, and the watch stands down from the gates. | the audit's NEW |
| 42 | `domain/display/newsVoice.js:266` | The land itself seems to hold its breath, as though some great misfortune waits just over the horizon. | The country is uneasy, and no one can say what misfortune they are waiting for. | seat-corrected under the census law (§3) |
| 43 | `domain/display/newsVoice.js:269` | A weight settles over the country that no one can account for, and the elders eye the horizon uneasily. | The elders eye the horizon and folk grow uneasy, though no one can say why. | the audit's NEW |
| 44 | `domain/display/newsVoice.js:277` | What the elders feared has come to pass, and the land is remade in an hour with nothing quite where it stood. | What the elders feared has come to pass; homes are lost, and nothing stands where it stood. | seat-corrected under the census law (§3) |
| 45 | `domain/display/newsVoice.js:280` | Whatever the omens warned of has broken over the land, and the almoners open the stores to a ruin no store can meet. | Whatever the omens warned of has struck, and the almoners open the stores to the homeless and the hungry. | the audit's NEW |
| 46 | `domain/display/newsVoice.js:291` | The reckoning is spent, and out of the rubble the country begins the patient business of becoming whole. | The disaster is behind them, and out of the rubble the country slowly rebuilds. | the audit's NEW |
| 47 | `domain/display/newsVoice.js:297` | The nameless dread lifted as quietly as it came, and the country lets out a long-held breath. | The nameless dread lifted as quietly as it came, and the country goes back to its work. | the audit's NEW |
| 48 | `domain/display/newsVoice.js:299` | The horizon kept its promise of ruin unfulfilled, and the wise who prepared feel foolish and glad at once. | The ruin the omens promised never came, and those who prepared for it feel foolish and glad at once. | the audit's NEW |
| 49 | `domain/display/newsVoice.js:300` | The weight over the country lifted overnight, and the cattle graze easy where dread lately walked. | The weight over the country lifted overnight, and the cattle graze easy again. | the audit's NEW |
| 50 | `domain/display/newsVoice.js:324` | The great moving has washed a whole people up at the gates, and the country learns their names one wary day at a time. | A whole people has come to the gates, and the country must find them room, work and bread. | the audit's NEW |
| 51 | `domain/display/newsVoice.js:328` | The flood of strangers has ebbed at last, and the country eases into the shape it must now keep. | The flood of newcomers has ebbed at last, and the country settles down with its new neighbours. | seat-corrected under the census law (§3) |
| 52 | `domain/display/newsVoice.js:333` | The great tide has settled into the low country like water finding its level, and the grumbling fades to habit. | The newcomers have settled across the low country, and the grumbling has faded to habit. | the audit's NEW |
| 53 | `domain/display/newsVoice.js:334` | The moving is over; the strangers are strangers no longer, and the country is larger and stranger than before. | The moving is over; the newcomers are neighbours now, and the country is the larger for them. | seat-corrected under the census law (§3) |
| 54 | `domain/display/newsVoice.js:341` | Whatever set the distant villages walking led them another way, and the country's braced gates go unbesieged. | Whatever set the distant villages walking led them another way, and the gates are left open again. | the audit's NEW |
| 55 | `domain/display/newsVoice.js:355` | The seat of power sits a little less easy, and factions that slept are stirring behind closed doors. | The seat of power sits a little less easy, and powers that slept are stirring behind closed doors. | the audit's NEW |
| 56 | `domain/display/newsVoice.js:360` | The rule has cracked open, with factions in the streets, rival banners at the gates, and no clear hand on the reins. | The rule has cracked open, with rival powers in the streets, their banners at the gates, and no clear hand on the reins. | seat-corrected under the census law (§3) |
| 57 | `domain/display/newsVoice.js:370` | A firm hand has closed over the country again; the factions are quieted and the writs once more run true. | A firm hand has closed over the country again; the rival powers are quieted and the writs once more run true. | the audit's NEW |
| 58 | `domain/display/newsVoice.js:377` | The seat of power sits steady again, and the ambitious who reached too far learn the quiet virtue of patience. | The seat of power sits steady again, and those who reached too far keep their heads down. | the audit's NEW |
| 59 | `domain/display/newsVoice.js:385` | The factions that stirred behind closed doors settled back to sleep, and the seat of rule is unshaken. | The powers that stirred behind closed doors settled back to sleep, and the seat of rule is unshaken. | the audit's NEW |
| 60 | `domain/display/newsVoice.js:412` | Every stall turns a profit and every barn is full, and the guilds coin new members faster than they can name them. | Every stall turns a profit and every barn is full, and the guilds take on new members by the week. | the audit's NEW |
| 61 | `domain/display/newsVoice.js:419` | The fat years mellow into a long ease; the ledgers close black, and prosperity becomes an ordinary thing. | The fat years mellow into a long ease; the merchants' books stay in profit, and prosperity becomes an ordinary thing. | the audit's NEW |
| 62 | `domain/display/newsVoice.js:450` | The grain-wagons are rolling to the stricken country. The mercy was weighed, and found affordable. | The grain-wagons are rolling to the stricken country; the council judged the town could spare it. | the audit's NEW |
| 63 | `domain/display/newsVoice.js:452` | The granaries have opened for the hungry beyond the walls; the wagons run heavy with charity and calculation both. | The granaries have opened for the hungry beyond the walls, and the council will not forget what it gave. | the audit's NEW |
| 64 | `domain/display/newsVoice.js:453` | Aid is on the road to the famined country, sent with one hand while the other keeps its careful accounts. | Aid is on the road to the famined country, and the almoners write down every sack. | the audit's NEW |
| 65 | `domain/display/newsVoice.js:455` | Sack after sack of grain goes to the stricken country, mercy and ledger travelling in the same cart. | Sack after sack of grain goes to the stricken country, and every sack is counted against a future favour. | the audit's NEW |
| 66 | `domain/display/newsVoice.js:457` | Relief rolls out from the granaries to the hungry country, and the givers watch it go with pride and calculation both. | Relief rolls out from the granaries to the hungry country, and the givers watch it go with pride. | the audit's NEW |
| 67 | `domain/display/newsVoice.js:461` | The relief held; a neighbour is pulled back from the brink, and a bond is deepened by the giving. | The relief held; a neighbour is pulled back from the brink, and the two countries are closer for it. | the audit's NEW |
| 68 | `domain/display/newsVoice.js:464` | The famine breaks on the strength of the sent stores, and gratitude takes root where hunger lately grew. | The famine breaks on the strength of the sent stores, and the neighbour is grateful for them. | the audit's NEW |
| 69 | `domain/display/newsVoice.js:471` | The plea for relief went unanswered, and a grudge takes root where grain did not. | The plea for relief went unanswered, and the hungry country holds a grudge for it. | the audit's NEW |
| 70 | `domain/display/newsVoice.js:474` | The council counted the cost and kept its stores, and the hungry country marks the refusal down in a colder ledger. | The council counted the cost and kept its stores, and the hungry country will remember the refusal. | the audit's NEW |
| 71 | `domain/display/newsVoice.js:477` | Relief was pleaded and relief was denied, and the road between the two countries grows longer for the denying. | Relief was pleaded and relief was denied, and the two countries are colder to each other for it. | the audit's NEW |
| 72 | `domain/display/newsVoice.js:500` | The tale of who owes whom is being retold in the market, and the ledger of old favours no longer reads as it did. | The tale of who owes whom is being retold in the market, and old favours are not remembered as they were. | the audit's NEW |
| 73 | `domain/display/newsVoice.js:501` | A quiet reappraisal moves through the country, and deeds long settled in memory begin to change their colour. | Folk are talking again about old deeds they had long thought settled. | the audit's NEW |
| 74 | `domain/display/newsVoice.js:502` | The meaning of an old alliance wavers; what was gratitude cools toward suspicion, or what was spite thaws toward thanks. | Talk turns to an old alliance; some who were grateful are suspicious now, and some who were bitter begin to give thanks. | the audit's NEW |
| 75 | `domain/display/newsVoice.js:509` | Kinship is reread as leverage, and the bonds that bound two houses in love are now weighed as a hold and a hostage. | Old ties of kinship are spoken of now as a hold one house keeps over the other. | the audit's NEW |
| 76 | `domain/display/newsVoice.js:510` | The shared candor of old is called espionage now, and every past confidence is turned over for the knife it might have hidden. | The open talk of old is called spying now, and every past confidence is suspected. | the audit's NEW |
| 77 | `domain/display/newsVoice.js:515` | The reappraisal has run its course; old friends make their peace with the past, and the ledger of favours is squared at last. | The second thoughts have run their course; old friends make their peace with the past, and old favours are settled at last. | the audit's NEW |
| 78 | `domain/display/newsVoice.js:519` | The bitter reading loses its hold; what curdled into grievance mellows, and the past is allowed to mean well again. | The bitter talk loses its hold, and the old grievance is let go. | the audit's NEW |
| 79 | `domain/display/newsVoice.js:522` | The long re-reading of the past comes to a gentle end, and the meaning of old favours settles, warm, into place. | The long retelling of the past comes to an end, and old favours are remembered kindly again. | the audit's NEW |
| 80 | `domain/display/newsVoice.js:527` | The reappraisal guttered out before it caught, and the ledger of old favours reads exactly as it always has. | The second thoughts guttered out before they caught, and old favours are remembered exactly as they always were. | the audit's NEW |
| 81 | `domain/display/newsVoice.js:532` | The shifting of old meanings settled back to stillness, and yesterday's deeds keep yesterday's names. | The talk of old meanings died down, and nobody speaks of the past differently now. | the audit's NEW |
| 82 | `domain/display/stateProse/decreeProsePools.js:113` | The table wrote this one into the record itself. | The table decided this one itself. | the audit's NEW |
| 83 | `domain/display/stateProse/decreeProsePools.js:116` | The party's hand moved first here, and the table kept the record. | The party's hand moved first here, and the table only noted it. | the audit's NEW |
| 84 | `domain/display/stateProse/decreeProsePools.js:119` | The register offered this one, and the table took the offer. | It was offered as a suggestion, and the table took it. | the audit's NEW |
| 85 | `domain/display/stateProse/decreeProsePools.js:120` | It stands here because the register proposed it and nobody refused. | It stands here because it was suggested and nobody refused. | the audit's NEW |
| 86 | `domain/display/stateProse/decreeProsePools.js:121` | The register raised it, and the table let it into the order. | It was suggested, and the table let it stand. | the audit's NEW |
| 87 | `domain/display/stateProse/decreeProsePools.js:122` | The register offered it, and the party's hand carried it through. | It was suggested, and the party's hand carried it through. | the audit's NEW |
| 88 | `domain/display/stateProse/decreeProsePools.js:123` | It reached the order through the register, with the party acting on it. | It began as a suggestion, and the party acted on it. | the audit's NEW |
| 89 | `domain/display/stateProse/decreeProsePools.js:127` | It arrived as a Surveyor's proposal, with its credit already spent. | It arrived as a Surveyor's proposal, and the table accepted it. | the audit's NEW |
| 90 | `domain/display/stateProse/decreeProsePools.js:144` | The advance carried it out, and what followed followed from it. | It has been carried out, and the town has felt what followed. | the audit's NEW |
| 91 | `domain/display/stateProse/decreeProsePools.js:145` | It is done, and the record keeps it where the doing put it. | It is done, and the town carries the mark of it. | the audit's NEW |
| 92 | `domain/display/stateProse/decreeProsePools.js:148` | It waits for the next advance, and nothing of it has happened yet. | It waits for time to move on, and nothing of it has happened yet. | the audit's NEW |
| 93 | `domain/display/stateProse/decreeProsePools.js:149` | Nothing has come of it yet; it sits in the order, waiting its turn. | Nothing has come of it yet; it waits its turn. | the audit's NEW |
| 94 | `domain/display/stateProse/decreeProsePools.js:150` | The order holds it, unspent, until the town moves again. | It is held back, unspent, until time moves on in the town. | the audit's NEW |
| 95 | `domain/display/stateProse/decreeProsePools.js:154` | Nothing came of it; the order let it go and kept what it said. | Nothing came of it; it was let go, though what it said is kept. | the audit's NEW |
| 96 | `domain/display/stateProse/decreeProsePools.js:155` | It was withdrawn, and the register still carries the sentence it would have been. | It was withdrawn, and what it would have said is still written here. | the audit's NEW |
| 97 | `domain/display/stateProse/decreeProsePools.js:175` | Whatever answers out there answers off the record; what returns is the town's own, and nothing else comes home. | What happens out there is not seen from here; only what the town sent comes back, and nothing else comes home. | the audit's NEW |
| 98 | `domain/display/stateProse/decreeProsePools.js:180` | The far side of this is a place with its own record, and it will keep one. | The far side of this is a place with its own history, and it will remember. | the audit's NEW |
| 99 | `domain/display/stateProse/decreeProsePools.js:195` | The register had asked for a connection to be made first, and the table went on without it. | The table was warned that a connection should be made first, and went on without it. | the audit's NEW |
| 100 | `domain/display/stateProse/decreeProsePools.js:196` | A connection the register wanted was never made, and the table proceeded anyway. | A connection the table was warned about was never made, and it proceeded anyway. | the audit's NEW |
| 101 | `domain/display/stateProse/decreeProsePools.js:197` | The register named a missing connection; the table heard it and moved on. | The table was warned of a missing connection, heard it, and moved on. | the audit's NEW |
| 102 | `domain/display/stateProse/decreeProsePools.js:200` | The register called it a contention with an earlier decree, and the table let this one stand. | The table was warned this one is in contention with an earlier decree, and let it stand. | seat-corrected: an instrument word kept (see §2) |
| 103 | `domain/display/stateProse/decreeProsePools.js:202` | The register raised the contention, and the table answered by proceeding. | The table was warned of the contention and answered by proceeding. | the audit's NEW |
| 104 | `domain/display/stateProse/decreeProsePools.js:205` | The register named the contradiction, and the table set the warning aside. | The table was warned of the contradiction and set the warning aside. | the audit's NEW |
| 105 | `domain/display/stateProse/decreeProsePools.js:207` | The register saw a contradiction here, and the table proceeded regardless. | The table was warned of a contradiction here, and proceeded regardless. | the audit's NEW |
| 106 | `domain/display/stateProse/decreeProsePools.js:210` | The register named a prerequisite still wanting, and the table did not wait for it. | The table was warned a prerequisite was still wanting, and did not wait for it. | the audit's NEW |
| 107 | `domain/display/stateProse/decreeProsePools.js:212` | The register asked for a prerequisite first, and the table went ahead. | The table was asked for a prerequisite first, and went ahead. | the audit's NEW |
| 108 | `domain/display/stateProse/decreeProsePools.js:215` | The register warned that the totality would not balance, and the table let it ride. | The table was warned that the totality would not balance, and let it ride. | seat-corrected under the census law (§3) |
| 109 | `domain/display/stateProse/decreeProsePools.js:216` | A totality the register keeps was left short, and the table proceeded. | A totality that should have balanced was left short, and the table proceeded. | seat-corrected under the census law (§3) |
| 110 | `domain/display/stateProse/decreeProsePools.js:217` | The register raised the totality, and the table accepted the imbalance. | The table was warned the totality was out of balance, and accepted it. | seat-corrected under the census law (§3) |
| 111 | `domain/display/stateProse/decreeProsePools.js:230` | It follows from the decree recorded as {prerequisite}. | It follows from {prerequisite}. | the audit's NEW |
| 112 | `domain/display/stateProse/decreeProsePools.js:257` | What was set down for the coming turn falls on the town's trade and its keeping. | What is planned for the coming turn falls on the town's trade and its stores. | the audit's NEW |
| 113 | `domain/display/stateProse/decreeProsePools.js:258` | The order names a change in what the town makes, holds and sells, due when the turn comes round. | A change in what the town makes, holds and sells is due when the turn comes round. | the audit's NEW |
| 114 | `domain/display/stateProse/decreeProsePools.js:262` | What was set down for the coming turn falls on what the town keeps faith with. | What is planned for the coming turn falls on what the town keeps faith with. | the audit's NEW |
| 115 | `domain/display/stateProse/decreeProsePools.js:263` | The order names a change in the town's observances, due when the turn comes round. | A change in the town's observances is due when the turn comes round. | the audit's NEW |
| 116 | `domain/display/stateProse/decreeProsePools.js:267` | What was set down for the coming turn falls on the people who live here by name. | What is planned for the coming turn falls on particular people of the town. | the audit's NEW |
| 117 | `domain/display/stateProse/decreeProsePools.js:268` | The order names a change among the town's own folk, due when the turn comes round. | A change among the town's own folk is due when the turn comes round. | the audit's NEW |
| 118 | `domain/display/stateProse/decreeProsePools.js:272` | What was set down for the coming turn falls on who holds authority here. | What is planned for the coming turn falls on who holds authority here. | the audit's NEW |
| 119 | `domain/display/stateProse/decreeProsePools.js:273` | The order names a change in who answers for the town, due when the turn comes round. | A change in who answers for the town is due when the turn comes round. | the audit's NEW |
| 120 | `domain/display/stateProse/decreeProsePools.js:277` | What was set down for the coming turn falls on the town's whole standing in the wider realm. | What is planned for the coming turn falls on the town's whole standing in the wider realm. | the audit's NEW |
| 121 | `domain/display/stateProse/decreeProsePools.js:278` | The order names a change to what {settlement} itself is, due when the turn comes round. | {settlement} itself is due to change when the turn comes round. | the audit's NEW |
| 122 | `domain/display/stateProse/decreeProsePools.js:282` | What was set down for the coming turn falls on the town's dealings with its neighbours. | What is planned for the coming turn falls on the town's dealings with its neighbours. | the audit's NEW |
| 123 | `domain/display/stateProse/decreeProsePools.js:283` | The order names a change between the town and those it lives beside, due when the turn comes round. | A change between the town and those it lives beside is due when the turn comes round. | the audit's NEW |
| 124 | `domain/display/stateProse/decreeProsePools.js:287` | What was set down for the coming turn falls on the town as a trouble it must carry. | What is planned for the coming turn is a trouble the town must carry. | the audit's NEW |
| 125 | `domain/display/stateProse/decreeProsePools.js:288` | The order names a hardship the town will meet, due when the turn comes round. | A hardship the town must meet is due when the turn comes round. | the audit's NEW |
| 126 | `domain/display/stateProse/decreeProsePools.js:317` | A faction's standing here was raised by the party's hand. | A power's standing here was raised by the party's hand. | the audit's NEW |
| 127 | `domain/display/stateProse/decreeProsePools.js:318` | One of the town's factions walks taller since the party took its side. | One of the town's powers walks taller since the party took its side. | the audit's NEW |
| 128 | `domain/display/stateProse/decreeProsePools.js:350` | One of the town's own is not in the reckoning any more, and the party is the reason. | One of the town's own has no say in its affairs any more, and the party is the reason. | the audit's NEW |
| 129 | `domain/display/stateProse/decreeProsePools.js:357` | A faction's standing here was cut down by the party's hand. | A power's standing here was cut down by the party's hand. | the audit's NEW |
| 130 | `domain/display/stateProse/decreeProsePools.js:358` | One of the town's factions lost ground, and the party is why. | One of the town's powers lost ground, and the party is why. | the audit's NEW |
| 131 | `domain/display/treatyDocument.js:136` | The old lists are read out again, and the pardon is kept as though it had never been written. | The old lists are read out again, and the pardon counts for nothing. | the audit's NEW |
| 132 | `domain/display/treatyDocument.js:156` | The term is kept only barely; the strain of it shows, and grows. | The term is kept only barely, and the strain on it is growing. | the audit's NEW |
| 133 | `domain/display/treatyDocument.js:356` | Brokered by ${doc.mediator.name}, torn between the courts. The terms came the lighter for it. | Brokered by ${doc.mediator.name}, who had ties to both courts; the terms were gentler for it. | the audit's NEW |
| 134 | `domain/display/treatyDocument.js:359` | A separate peace: ${doc.victorName} peeled from a coalition of ${doc.fracture.coalitionSize}, its co-besiegers abandoned at the walls. | A separate peace: ${doc.victorName} left a coalition of ${doc.fracture.coalitionSize} and made terms alone, leaving its fellow besiegers at the walls. | the audit's NEW |
| 135 | `domain/display/warRemembrance.js:133` | The record does not set down when it ended. | When it ended is not known. | the audit's NEW |
| 136 | `domain/display/warRemembrance.js:164` | It ended in a sack, and that burning was the opening of the reckoning, not its answer. | It ended in a sack, and that burning was the first blow, not an answer to one. | seat-corrected under the census law (§3) |
| 137 | `domain/display/warRemembrance.js:166` | It ended with a seat that did not outlast the war. | It ended with one side's seat destroyed outright. | seat-corrected: an instrument word kept (see §2) |
| 138 | `domain/display/warRemembrance.js:171` | The record does not yet call this war closed. | This war is not yet over. | the audit's NEW |
| 139 | `domain/display/warRemembrance.js:172` | How it ended is not set down in the record. | How it ended is not known. | the audit's NEW |
| 140 | `domain/display/warRemembrance.js:173` | It ended with a burning the record cannot attribute, so the manner is left unsaid. | It ended with a burning no one can put a name to, so how it ended is left unsaid. | the audit's NEW |
| 141 | `domain/display/warRemembrance.js:177` | How it ended is not set down in the record. | How it ended is not known. | the audit's NEW |
| 142 | `domain/display/warRemembrance.js:391` | The account of it is still being written down. | Its peace is not yet fully settled, so this account may still change. | seat-corrected under the census law (§3) |
| 143 | `domain/display/warResolve.js:141` | Airships run the blockade at reduced throughput; the granary drains slowly rather than sharply. | Airships run the blockade with what they can carry, so the granary drains slowly. | seat-corrected: an instrument word kept (see §2) |
| 144 | `domain/display/warStatus.js:39` | Resolved siege, defense, conquest, and primary-supplier-flip outcomes; not time at war or casualties. | Counts sieges given up, defences held, towns conquered and markets taken from a rival supplier; not time at war or the dead. | the audit's NEW |
| 145 | `components/settlementDetail/CharterRoadCard.jsx:32` | A run of ships rather than a road: the water already carries this route. | This route goes by ship: the water already carries it. | the audit's NEW |
| 146 | `data/arrivalProse.js:68` | ${n} works iron the way other places breathe: the clang of it is in every lane. | ${n} lives by its forges: the clang of iron is in every lane. | the audit's NEW |
| 147 | `data/arrivalProse.js:306` | A household feeds strangers at its door, and makes sure everyone sees it doing so. | A household feeds passing travellers at its door, and makes sure everyone sees it doing so. | the audit's NEW |
| 148 | `data/arrivalProse.js:360` | People here greet strangers with open curiosity, and ask where you have come from before your name. | People here greet newcomers with open curiosity, and ask where you have come from before your name. | the audit's NEW |
| 149 | `data/arrivalProse.js:387` | People keep their purses close and their eyes on strangers. | People keep their purses close and watch anyone they do not know. | the audit's NEW |
| 150 | `data/arrivalProse.js:389` | People walk quickly and do not stop to talk to strangers. | People walk quickly and do not stop to talk to anyone they do not know. | the audit's NEW |
| 151 | `data/arrivalProse.js:393` | People mend what they have rather than buy anything new. | People mend what they have, and nobody seems to buy anything new. | the audit's NEW |
| 152 | `data/arrivalProse.js:462` | Older folk stop talking when a stranger asks about the bad years, and change the subject. | Older folk stop talking when you ask about the bad years, and change the subject. | the audit's NEW |
| 153 | `data/roadsProse.js:35` | ${x.npc} has left ${x.home} for ${x.dest} on ${x.purpose} business. It is a journey of the middle ranks. | ${x.npc} has left ${x.home} for ${x.dest} on ${x.purpose} business. | the audit's NEW |
| 154 | `data/roadsProse.js:67` | ${x.captor} has seized ${x.npc} of ${x.home} en route to ${x.dest}; the price of return is being reckoned. | ${x.captor} has seized ${x.npc} of ${x.home} on the way to ${x.dest}, and a ransom is being set. | the audit's NEW |
| 155 | `data/roadsProse.js:96` | The road to ${x.dest} used ${x.npc} of ${x.home} roughly, though the journey goes on. | ${x.npc} of ${x.home} was robbed on the road to ${x.dest}, but the journey goes on. | the audit's NEW |
| 156 | `data/roadsProse.js:98` | Waylaid short of ${x.dest}, ${x.npc} of ${x.home} lost baggage but not the road. | Waylaid short of ${x.dest}, ${x.npc} of ${x.home} lost baggage but kept going. | the audit's NEW |
| 157 | `data/roadsProse.js:233` | ${x.payer} met ${x.captor}'s price for ${x.npc} of ${x.home} out of friendship. The gift of freedom binds ${x.home} in gratitude, not debt. | ${x.payer} met ${x.captor}'s price for ${x.npc} of ${x.home} out of friendship, and ${x.home} owes nothing for it. | the audit's NEW |
| 158 | `data/roadsProse.js:262` | A rival purse in ${x.payer} met ${x.captor}'s price for ${x.npc} of ${x.home}; the envoy is home, but the favour is a leash in ${x.payer}'s hand. | A rival purse in ${x.payer} met ${x.captor}'s price for ${x.npc} of ${x.home}; the envoy is home, but owes ${x.payer} a favour that will be called in. | the audit's NEW |
| 159 | `data/traditionProse.js:54` | In ${x.town}, ${x.name} ${x.phrase} this year. A settlement's traditions carry its identity forward; each holding or failing is a mark on the year.${x.ownerBit} | In ${x.town}, ${x.name} ${x.phrase} this year.${x.ownerBit} | the audit's NEW |
| 160 | `data/traditionProse.js:55` | ${x.name} ${x.phrase} this year in ${x.town}. A town's observances carry its identity forward, and every year they hold or fail leaves its mark.${x.ownerBit} | ${x.name} ${x.phrase} this year in ${x.town}.${x.ownerBit} | the audit's NEW |
| 161 | `data/traditionProse.js:56` | This year in ${x.town}, ${x.name} ${x.phrase}. What a people keeps, and how well, is written into the record of the year.${x.ownerBit} | This year in ${x.town}, ${x.name} ${x.phrase}.${x.ownerBit} | the audit's NEW |
| 162 | `data/traditionProse.js:57` | In ${x.town}, ${x.name} ${x.phrase}. A settlement is known by the customs it keeps; each year's keeping, or failing, is a mark upon it.${x.ownerBit} | In ${x.town}, ${x.name} ${x.phrase}.${x.ownerBit} | the audit's NEW |
| 163 | `data/traditionProse.js:65` | In ${x.town}, ${x.name} was set aside this year: hardship left no room for the observance, and a people that keeps its restraint is remembered for it too.${x.ownerBit} | In ${x.town}, ${x.name} was set aside this year: times were too hard to hold it.${x.ownerBit} | the audit's NEW |
| 164 | `data/traditionProse.js:66` | ${x.name} was set aside in ${x.town} this year; hardship left no room for it, and a people that shows restraint in a hard season is remembered for that too.${x.ownerBit} | ${x.name} was set aside in ${x.town} this year; it was too hard a year to hold it.${x.ownerBit} | the audit's NEW |
| 165 | `data/traditionProse.js:67` | In ${x.town} this year, ${x.name} went unheld: the season left no room for it, and there is a quiet credit in a town that knows when to keep its restraint.${x.ownerBit} | In ${x.town} this year, ${x.name} went unheld: the season left no room for it.${x.ownerBit} | the audit's NEW |
| 166 | `data/traditionProse.js:80` | ${x.name} failed badly this year, and the townsfolk are looking for someone to blame: a rich seam of grievance for a party to work. | ${x.name} failed badly this year, and the townsfolk are looking for someone to blame; a party could point that anger somewhere, or calm it. | the audit's NEW |
| 167 | `data/traditionProse.js:81` | The failure of ${x.name} has soured the mood in ${x.town}; muttered blame is hardening into factions, and a clever party could tip it either way. | The failure of ${x.name} has soured the mood in ${x.town}; muttered blame is hardening into sides, and a clever party could tip it either way. | the audit's NEW |
| 168 | `data/traditionProse.js:87` | For the first time in memory, ${x.name} went unheld in ${x.town}; the quiet has left people uneasy, and uneasy towns hire adventurers. | For the first time in memory, ${x.name} went unheld in ${x.town}, and people are uneasy about what it means. | seat-corrected under the census law (§3) |
| 169 | `data/traditionProse.js:106` | The restored rite of ${x.name} draws home exiles and grudges alike; ${x.town} has not decided whether it is a reconciliation or a reckoning. | The restored rite of ${x.name} brings home exiles, and old grudges with them; in ${x.town} some want to forgive and some want to settle scores. | the audit's NEW |
| 170 | `domain/display/newsVoice.js:199` | The shortage has broken. The caravans are through and the market breathes again. | The shortage has broken. The caravans are through and the stalls are full again. | added: the tic cure of A6 in a line the audit passed |
| 171 | `domain/display/newsVoice.js:200` | Plenty returns to the market roads, and the guilds breathe easy at last. | Plenty returns to the market roads, and the guilds are at ease again. | added: the tic cure of A6 in a line the audit passed |
| 172 | `domain/display/newsVoice.js:366` | Power lies in the street for the taking, and the ambitious fall on it like dogs while the country holds its breath. | Power lies in the street for the taking, and the ambitious fall on it like dogs while the country waits to see who wins. | added: the tic cure of A6 in a line the audit passed |
| 173 | `domain/display/newsVoice.js:372` | The contest for power has settled, and the country breathes easier under a rule that no longer trembles. | The contest for power has settled, and the country rests easier under a steady rule. | added: the tic cure of A6 in a line the audit passed |
| 174 | `domain/display/newsVoice.js:571` | Word of the struggle for power moves through the country, and every faction listens for its moment. | Word of the struggle for power moves through the country, and every power listens for its moment. | added: the tic cure of A6 in a line the audit passed |
| 175 | `domain/display/newsVoice.js:584` | The matter of who owes whom and who was wronged stirs every hearth, and the ledger of old favours is weighed again. | The matter of who owes whom and who was wronged stirs every hearth, and old favours are weighed again. | added: the tic cure of A6 in a line the audit passed |

### §4b The other eight added lines (A6's tic cure in lines the audit had passed)

| file | OLD | NEW |
|---|---|---|
| `domain/display/warRemembrance.js` `REMEMBERED_LEAD` | A court the record no longer names | A court whose name has been lost |
| `domain/display/warRemembrance.js` `rememberedName` fallback | a court the record no longer names | a court whose name has been lost |
| `domain/display/chroniclersLetter.js` `letterToPlainText` span header | (the record from {from} through {through}) | (what passed from {from} through {through}) |
| `domain/display/causeWalk.js` `REDACTED_HOP` | a cause the ledger keeps hidden | a cause kept hidden |
| `domain/display/treatyDocument.js` rites `honored` | The strangers' priests walk the roads and speak in the squares, and no hand is raised against them. | The foreign priests walk the roads and speak in the squares, and no hand is raised against them. |
| `domain/display/treatyDocument.js` rites `strained` | The strangers' priests find the roads longer than they were, and the squares oddly empty when they arrive. | The foreign priests find the roads longer than they were, and the squares oddly empty when they arrive. |
| `domain/display/treatyDocument.js` rites `defaulted` | The doors are shut to the strangers' priests, and what was written about the rites is no longer kept. | The doors are shut to the foreign priests, and what was written about the rites is no longer kept. |
| `domain/display/treatyDocument.js` trade `defaulted` | …the named house pays what any stranger pays, or is turned away. | …the named house pays what any outsider pays, or is turned away. |

### §4c The variants by vantage (new lines)

**`src/data/traditionProse.js` `TRAD_HELD_SUMMARY`** (interp `{town, name, phrase, ownerBit}`; index 0 stays canonical for a seedless caller):

| # | vantage | line |
|---|---|---|
| 0 | the plain line (canonical) | In ${town}, ${name} ${phrase} this year.${ownerBit} |
| 1 | the traveller | Ask in ${town} about ${name} and you will hear that it ${phrase} this year.${ownerBit} |
| 2 | the local | The talk in ${town} is of ${name}, which ${phrase} this year.${ownerBit} |
| 3 | the newcomer | Anyone new to ${town} soon hears that ${name} ${phrase} this year.${ownerBit} |

**`TRAD_CANCELLED_SUMMARY`** (interp `{town, name, ownerBit}`):

| # | vantage | line |
|---|---|---|
| 0 | the plain line (canonical) | In ${town}, ${name} was set aside this year: times were too hard to hold it.${ownerBit} |
| 1 | the traveller | Ask after ${name} in ${town} and you will hear it was set aside this year; the times were too hard to hold it.${ownerBit} |
| 2 | the local | In ${town} this year, ${name} went unheld: the season left no room for it.${ownerBit} |
| 3 | the newcomer | Anyone new to ${town} this year will not have seen ${name}: it was set aside, the times too hard to hold it.${ownerBit} |

**`src/domain/display/stateProse/decreeProsePools.js` `DECREE_EVENT_POOLS`**, the fourth vantage per family (appended under the vid law; causes `EITHER`, as their siblings):

| vid | family | angle | line |
|---|---|---|---|
| 97 | Economy | trade | The traders will feel it first: what the town buys and sells is due to change when the turn comes round. |
| 98 | Faith | local | Folk at the shrines will notice it soonest, for the town's observances are due to change when the turn comes round. |
| 99 | People | local | It falls on particular households here, and it is due when the turn comes round. |
| 100 | Power | official | Whoever answers for the town has cause to watch the day: who holds authority here is due to change when the turn comes round. |
| 101 | Realm | traveller | A traveller who comes back to {settlement} after the turn will find it changed in what it is. |
| 102 | Relations | official | Those who treat with the neighbours have cause to watch the day, for how the town stands with them is due to change. |
| 103 | War | watch | The watch has a hardship to brace for, and it is due to fall on the town when the turn comes round. |

## §5 The pins re-keyed (by identity and cause; none loosened)

Each pin quoted the old line verbatim, or read its count. It now quotes the new line at the same strictness: `toBe` stays `toBe`, and a regex stays anchored on the line's own words.

- `tests/domain/traditionProse.test.js:58-62`: the canonical held summary, and the cancelled summary's clause.
- `tests/components/causeWalkPanel.test.jsx:41,95` and `tests/components/causeWalkPanelTranslation.test.jsx:16`: the grace line and `REDACTED_HOP`.
- `tests/lint/proseRegisterLoaders.walker.test.js:170`: the register row from `causeWalk.js` (its counts are unchanged: R4b still reads 53).
- `tests/components/wizardNewsChronicle.test.jsx:116`, `tests/domain/newsBody.test.js:101`, `tests/domain/chroniclersLetter.test.js:70` and `tests/components/chronicleScrollback.test.jsx:103`: the climb-down summary (`newsBody.js:228`).
- `tests/domain/neighbourMirror.test.js:263`: the sealed-silence clause.
- `tests/domain/sentenceOpeningFallbacks.test.js:195-198`: the nameless-court fallback.
- `tests/domain/decreeTracker.test.js:53`: the honest-null finding, `/no measurable downstream/` → `/can be traced to this decree/`.
- `tests/lint/decreeCause.walker.test.js:283,355`: the authored-variant count 96 → 103 (the seven new event vids), with the reason in the comment.

## §6 THE PROOF — two advanced towns read in one voice

**How.** The harness is a scratch script, never committed (`advance.mjs`):
1. It births the soak's twelve with `scripts/audit/soak-review/corpus.mjs :: birth(i)` after `ensureLaws()`.
2. It wires a realm the way `scripts/audit/simulate-world.mjs :: buildWorld` does: six hostile, rival or cold-war pairs with durable hostility in the edge, `relationshipStates` and both `neighbourNetwork`s; three alliance or trade edges; a trade-dependency chain; two military-protection channels; a famine stressor and a disease stressor.
3. It sets `simulationRules: { traditionsEnabled: true }` (the traditions kernel is dark without it) and runs `advanceCampaignWorld` **60 times at `one_week`**, carrying `worldState`, `regionalGraph`, `wizardNews` and `settlementUpdates` forward.
4. For Copanucan (`soak1k-2`, village) and Portaminus (`soak1k-4`, city) it reads each entry naming the town (`settlementIds`) through `newsVoiceLine` (the crier), `newsReaderSummary` (the Chronicle tab's summary) and `composeChroniclersLetter` with `letterToPlainText`. The tradition beats come from the kernel's own entries.
5. Three decrees per town are drawn through `decreeChronicleLine`: dm/applied/table, guard/pending/party and surveyor/withdrawn/table, each an `add-npc` op on the town.

The same script ran at the parent and at the tip: **0 throws, 571 entries both sides; Copanucan 67 entries, Portaminus 64**.

**Eight lines at the tip, quoted** (the parent's line in brackets):

1. Copanucan, the crier (war): "The fields are trampled and the barns emptied to feed the muster." [… ; the war eats everything it touches.]
2. Copanucan, the crier (war, fade): "The feared army melted from the marches before a blow fell, and the fear along the border has passed." [… and the country lets out its breath.]
3. Copanucan, a tradition beat: "In Copanucan this year, The Lesser Landfall Feast went unheld: the season left no room for it." [The Lesser Landfall Feast was set aside in Copanucan this year; hardship left no room for it, and a people that shows restraint in a hard season is remembered for that too.]
4. Copanucan, a tradition beat: "Anyone new to Copanucan this year will not have seen The Fair of the River: it was set aside, the times too hard to hold it. It is kept by Common grazing land, who answer for its fortune." [… and there is a quiet credit in a town that knows when to keep its restraint. …]
5. Portaminus, a tradition beat: "In Portaminus, The High Feast went uneasily this year." [… A settlement's traditions carry its identity forward; each holding or failing is a mark on the year.]
6. Portaminus, a tradition beat: "Ask in Portaminus about The Vigil of the Stars and you will hear that it went well this year. It is kept by The Faithful Assembly, who answer for its fortune."
7. Both towns, the letter's span line: "(what passed from the spring of year 1 through the spring of year 2)" [(the record from …)]
8. Copanucan, the decree chronicle: "The table decided this one itself. The act falls on the town's own ground. It has been carried out, and the town has felt what followed." [The table wrote this one into the record itself. … The advance carried it out, and what followed followed from it.]

And Portaminus's party decree: "It began as a suggestion, and the party acted on it. It is the town's own business, and the town's own cost. Nothing has come of it yet; it waits its turn."

**The reading.** The crier, the Chronicle summaries, the letter and the decree lines now share one register: plain past or present events, no bookkeeping nouns, no aphorism closers. Two faults print beside them that are NOT this manifest's. (a) The kernel's `ownerBit` ("It is kept by Common grazing land, who answer for its fortune.", `src/domain/worldPulse/traditionsKernel.js:513`) names a pasture as a keeper. (b) The Chronicle's relief row ("A far settlement has word of relief on the road from …", `wizardNews.js`) is STYLE-2-SURFACES' E4. Both are under What stays. Portaminus's three set-aside feasts all drew the traveller variant: the draw is seeded on each outcome id, as the kernel requires. At the parent the same three shared one frame ("…went unheld: the season left no room for it, and there is a quiet credit…"), so this is a re-draw, not a rise. In this realm the crier classifies only a few of Portaminus's entries (its 64 are mostly interregnum, reform and seat news, which the crier's categories do not cover); Copanucan's war beats carry the crier sample.

## §7 The deltas over the parent, for STYLE-2-MERGE's signing (measured in a clean worktree at `a7bc2e4ce`; nothing re-recorded, nothing signed)

The parent is a scratch `git worktree` at `a7bc2e4ce`. Each surface's own measuring door was run on that tree and on this lane's working tree: `scripts/audit/golden-master-stage.mjs`, `refence.mjs`, `herald-stage.mjs` and `witness-stage.mjs`, and `scripts/prose-manifest-cells.mjs` with `prose-manifest-diff.mjs`.

| surface | moved | cells | cause |
|---|---|---|---|
| **golden master** | **34 / 525** | all 34 are the **celtic** culture: thorp 1, hamlet 6, village 6, town 7, city 7, metropolis 7 (`{tier}\|celtic\|{terrain}\|{route}\|civilized\|golden-master-v3` for coastal-port, desert-road, forest-isolated, hills-road, mountain-road, plains-road and riverside-river, as each tier's corpus holds them); parent sha `b35d56c0…`, tip `89987bcf…` | the arrival lines (`arrivalProse.js`), the one generation-time file of this manifest. PLAUSIBLE which of the seven lines: the celtic-only pattern points to a culture-keyed arrival draw |
| **espionage dormancy fence** | **35 / 360** | thorp isolated 003, 007, 010, 011; hamlet road 007, isolated 005, 009, port 011; village road 011, 012, isolated 000, 001, 003, 007; town isolated 002, 007, 013, crossroads 012; city road 001, 005, 007, 010, isolated 007, port 006, 008, 011, crossroads 000, 004, 008, 012, 014; metropolis road 009, isolated 006, 007, crossroads 003 (`SUBw4-fence1-{tier}-{route}-{nnn}`); corpus `fe0dde0e…` → `63e9c665…` | the same generation-time arrival lines (PLAUSIBLE, as above) |
| **herald knowledge desk** | **1 / 475** | `rr-fresh-full\|1\|contentSha256` only; every section and item count unchanged | this family's register: a herald line's words (heraldIntegrity, newsVoice or newsBody) inside the hashed content, no structure moved |
| **composed-prose manifest** | **0 / 1,050** | 74,482 cells unchanged, 0 replaced, re-indexed, added or removed | — |
| **witness** | **4 / 8** | `realistic_regional`, `dramatic_campaign`, `living_realm`, `full_simulation`: `wizardNewsSha256` only (the four presets that light the traditions and roads kernels) | the tradition summaries and the roads lines printed into the news |
| **PDF snapshot** | **0** | `tests/pdf/__snapshots__/goldenViewModel.test.js.snap` holds none of the 175 old lines (grepped by each line's longest fixed fragment); its test passes at the tip | — |

The reds these moves raise, all left UNSIGNED for the merge: `tests/property/generatorGoldenMaster.test.js`, `tests/generators/nameHeldThroughAssembly.test.js` (A1 reads the golden corpus: "a golden row moved with no pin bag"), `tests/property/chroniclersLetterGolden.test.js` (the letter's bytes hash: the span header and four letter lines are this lane's), `tests/property/espionageDormancyFence.test.js` (THE DRIVEN GOLDEN), `tests/property/heraldKnowledgeDeskGolden.test.js` (the refile's content bytes) and `tests/simulation/presetLightingWitness.test.js` (the four `wizardNewsSha256` rows). Each was run at the tip and is red exactly where the table above says, and nowhere else.

## §8 The referee — the 1,000, before and after

`node scripts/audit/soak-review.mjs --count 1000 --workers 4`, at the parent (scratch worktree) and at this lane's tree:

| figure | before | after |
|---|---|---|
| settlements · errors · findings | 1,000 · 0 · 702 | 1,000 · 0 · 702 (the findings file is byte-identical when sorted) |
| `repetition-prose.json` top 40 frames (the twenty most-repeated within them) | — | identical, frame for frame and count for count |
| story / skeleton / exact / hooks repeat rate (all) | 0.035 / 0.108 / 0.047 / 0.299 | 0.035 / 0.108 / 0.047 / 0.299 |
| distinct skeletons · in 10% of towns | 4,048 · 104 | 4,048 · 104 |
| `coh:tier-noun` | 273 | 273, none on this lane's lines |

The soak births towns and does not advance them, so of this family only the arrival lines print in it. One of them is lit in the 60 sample dossiers: "lives by its forges", 0 → 1, with "the way other places breathe" 1 → 0.

**The walker's phrases** (the SW-0 scanner, `scripts/lib/style-law-scan.mjs` at `ba99f9124` on `lane/style-2-walker-2026-11-09`, run over this lane's 17 files at the parent and at the tip; the scanner is not committed here):

| phrase | before | after |
|---|---|---|
| `the-record` | 21 | 0 |
| `faction` | 10 | 0 |
| `the-ledger` | 9 | 1 (`warRemembrance.js:365`, the DM receipts label, §2) |
| `rather-than` | 3 | 0 |
| `a-stranger` | 1 | 0 |
| **total** | **44** | **1** |

Beyond the walker's list: "breath(e)" 7 → 0 in the crier pools, and "stranger(s)" 21 → 7 in this manifest's string literals. The seven left are the migration crier's own evidence (newsVoice 307, 313, 319, 330, 339 and 567, §1) and heraldIntegrity 76's adjective "stranger".

## §9 Reds at this tip that are not this lane's (measured at the parent by the same command)

- `tests/lint/sourceCitationIntegrity.walker.test.js`, the roster's `tree` arm: MERGE-WAVE's `9288badee`, untouched. In this clone it reads 147 against 139 frozen, at the parent and at the tip alike (the audit's clone read 140). Every other arm of the three record walkers is green at the tip, `ledgerCitationIntegrity` included, with `review-fixes-2026-07-08` as a local ref.
- `tests/lint/negativeAssertionAnchor.walker.test.js` ×2, `tests/property/editCorpusRatchet.test.js` ×4, `tests/lint/domainAnyCastBaseline.test.js` ×4, `tests/lint/mutationCoverageManifest.test.js` ×1 and `tests/lint/proseWiringCensus.walker.test.js` ×2: all red at the parent, all in files this lane does not touch.
- `domainAnyCastBaseline` showed a fifth red at the tip: "introducedAt d7ea69a4… resolves to NO commit" for `src/domain/worldPulse/commercialReasons.js`. That is this clone's missing history, not a file of this lane's.

## §10 CONFIRMED against PLAUSIBLE

- **CONFIRMED** (executed here, receipts above):
  - 169 rows found and taken, all rewritten (446 with its twin, §11), plus 14 added lines and 15 new variant lines;
  - every instrument word of §2 kept, each read by the named test;
  - the pins re-keyed, each at its old strictness;
  - every test importing or quoting the 17 files is green, apart from the reds of §7 and §9 (184 files at the first run; the widened run took in `tests/lint` and `tests/copy`, 361 files);
  - the deltas of §7, each measured against the parent;
  - the referee's figures of §8; the walker's 44 → 1;
  - the two-town proof: 0 throws both sides, and the eight lines quoted from the tip's output.
- **PLAUSIBLE:**
  - which arrival line carries the golden master's 34 and the fence's 35 (not bisected);
  - that the herald's one hash move is a herald line and not a crier line (the stage hashes the desk whole);
  - that the decree chronicle reads the same in the app as through `decreeChronicleLine` (the proof drew it directly; the soak's advance stages no decree);
  - every NEW line's voice: the owner's veto is the measure, and this seat's reading is not.

## §11 The chair's two additions (rulings received 01:17 and 01:36 UTC)

**The letter's twin (one cause, `git log` names it).** The plain-text letter (`chroniclersLetter.js:446`) and the map panel (`ChroniclersLetterPanel.jsx:118`, the only line touched under `src/components/map`) both now read: "This echoes what I wrote of {when}: {headline}." The pin `tests/domain/chroniclersLetter.test.js:248` is re-keyed to that line. `chroniclersLetterGolden` was already red from §4 (unsigned) and remains so.

**"Amerchant" (a defect row from OWNER-WORDS-DOSSIER's intake) — FOUND, NOT CURED HERE: a STOP to the chair.**
- **The text is whole at the source.** The line is `src/data/narrativeData.js:73`, "A merchant argues with a carter…". `speakTierNoun` keeps the space in all six tiers (measured).
- **Where the space is lost: the Overview's drop-cap.** `src/components/new/tabs/OverviewTab.jsx:347` renders the arrival scene in `<p className="oc-dropcap-prose">`, and `src/styles/organic.css:149-163` raises the first letter (`initial-letter: 2`, with a float fallback). When the first word is one letter long, the space after the raised initial collapses at the start of the line.
- **CONFIRMED in Chromium** with the repo's `organic.css` and a range measurement:
  - "A merchant…": the space is 0.0px wide, and the "m" begins 1.8px after the A.
  - "The road…": the space is 5.0px wide.
  - The screenshot reads "Amerchant".
- **Reach.** Every arrival line opening on "A " prints this way on the Overview. The Summary tab and the PDF have no drop-cap.
- **The cure** lives in two files outside this manifest. The default put to the chair:
  - a `--lone` class on the paragraph when the scene matches `/^[A-Za-z]\s/`;
  - a word-space margin on that class's `::first-letter`;
  - red-first: a jsdom class test plus the Chromium gap measure.
- Rewording the lines is not the cure.

## What stays

- **The "Amerchant" drop-cap cure → SW-9, after the train** (the chair, 02:18 UTC). `OverviewTab.jsx:347` sits in the region OWNER-WORDS-DOSSIER rewrote, which is final at `af2d80d62`.
  - **Diagnosis:** §11.
  - **Scope:** any arrival line opening on "A " (any one-letter first word), on the Overview only. The Summary tab and the PDF have no drop-cap and are unaffected.
  - **The cure, in three steps:**
    1. `OverviewTab.jsx:347` adds `oc-dropcap-prose--lone` to the drop-cap paragraph when the scene matches `/^[A-Za-z]\s/`.
    2. `src/styles/organic.css` gives `.oc-dropcap-prose--lone::first-letter` a word-space margin, about 0.3em on the `initial-letter` path and 0.25em under the float fallback.
    3. Red-first: a jsdom pin shows the class on a planted "A merchant…" scene and absent on "The road…". The Chromium range measure takes the gap after the initial from 0 px to more than 4 px.
  - The arrival lines are NOT reworded.
- **Placed by the chair (02:17 UTC):**
  - the census ledgers' verbatim copies (DECREE_PROSE and the four ARRIVAL_*) → SW-9's hand re-key batch;
  - the kernel's `ownerBit` naming an institution as a "who" → SW-9, as a grammar defect;
  - `warRemembrance.js:365` "In the ledger" is a LABEL and goes to the walker's allow-list by name.

- **The DEC-EVENT and DEC-PARTY pages:** both blocks print on no page today. Their fourth vantages (§4c) wait for the page that reaches them, and that page must declare vid 54 `market` (the census2g pin says so).
- **The tradition hooks** (`TRAD_HOOKS`, six pools of three): these are plot-hook seeds, not intro pools, so they were not given vantages; their rows of the audit were taken.
