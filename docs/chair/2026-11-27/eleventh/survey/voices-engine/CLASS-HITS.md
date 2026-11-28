# The presumption-classes hits on the voices data, answered (the chair's ruling G1-3 (2); for the chair's read)

CONFIRMED by the walker's own scanner (`scanSource` + `hitsOf`) on 40f23248b's `src/data/voices/`: 14 SPEAKER hits and
**20** THING hits (not 23: said goods 9, office 2, outside 3; liar goods 3, outside 3). Each row gives the line, its version
(W welcoming · T transactional · C cautious · D dismissive · N the line's `inTruth` note), the class, the card it prints on,
and THE ANSWER. Answers marked PROPOSED wait on your read and are not yet in the data.

## The 14 speaker hits, read by hand (exempt unless the version states a MATERIAL fact)

| line · version | class | card | text | read | answer |
|---|---|---|---|---|---|
| SAID.inst.learning-ordinary.1 D | ease | house (learning) | People call it idle work. | a judgment | exempt |
| SAID.inst.any-crisismarked.2 W | ease | house (crisis-marked) | There's talk of a celebration when the {crisisNoun} ends. | a hope, under the crisis | exempt |
| SAID.trad.feast.4 W | ease | tradition (feast) | The children run wild at the feast, and nobody minds. | the card's own feast; no food named | exempt |
| SAID.inst.show-ordinary.5 W | ease | house (show) | The late crowd walks home together, singing. | no "no danger" claim ("together") | exempt (PLAUSIBLE: your read) |
| SAID.inst.inn-ordinary.1 C | plenty | house (inn) | Plenty gets said here that shouldn't be repeated. | talk, not food | exempt |
| SAID.trad.feast.3 T | plenty | tradition (feast) | The cooking takes days, and the fuel costs plenty. | a price | exempt |
| SAID.inst.market-ordinary.3 W | plenty | house (market) | Plenty of people buy on trust here, and most pay it back. | people, not food | exempt |
| **SAID.trad.feast.2 T** | plenty | tradition (feast) | Plenty of drink goes round, and someone always pays for it after. | **MATERIAL: drink in plenty** | **excludes `crisis: hunger`** (famine, under_siege) |
| SAID.power.seat-contested.2 W | plenty | power (seat) | Plenty of people still stand by us. | your "no" | exempt |
| LIE.secrets.1 W | ease | liar's house | People here gossip, but kindly, and nothing comes of it. | a lie | exempt |
| LIE.secrets.1 T | ease | liar's house | Gossip is free here. Nobody would pay for it. | a lie | exempt |
| LIE.front.trade.1 W | plenty | liar's house | Anyone may look at the books, and plenty have. | a lie | exempt (its goods hit below) |
| LIE.front.other.2 W | threat | liar's house | The house is quiet at night, and everyone goes home. | a lie | exempt |
| LIE.extortion.1 W | threat | liar's house | The traders here look out for each other, and nobody bothers them. | a lie | exempt |

The speaker exemption reaches a SPOKEN text only (a version's `text`), never a liar line's `inTruth`: that note is the
surveyor's own voice to the DM (no `inTruth` holds a speaker hit today).

## The 20 thing hits

| line · version | class | card | text | answer |
|---|---|---|---|---|
| SAID.inst.care-ordinary.4 T | goods | house (care) | Clean cloths and herbs cost more every season. | CARD `medicine` (a healer, an apothecary, a hospital; never an almshouse) |
| SAID.trad.vigil.3 T | goods | tradition (vigil) | Candles for the vigil cost more each year. | INELIGIBLE (candles: answered nowhere) |
| SAID.trad.vigil.3 W | goods | tradition (vigil) | Families take turns keeping the candles lit. | INELIGIBLE (candles) |
| SAID.inst.inn-ordinary.2 T | goods | house (inn) | Late nights burn a lot of candles. | INELIGIBLE (candles; already) |
| SAID.inst.hall-ordinary.5 T | goods | house (hall) | Candles burn here long after dark, and someone pays for them. | INELIGIBLE (candles; already) |
| SAID.inst.watch-ordinary.5 T | goods | house (watch) | Rust ruins more weapons than fighting does. | CARD `weapons kept` (a force; already bound) |
| SAID.inst.watch-ordinary.5 W | goods | house (watch) | The weapons get cleaned and oiled with care. | CARD `weapons kept` (already bound) |
| SAID.inst.grain-ordinary.4 W | goods | house (grain) | The first carts of the day get a friendly wave. | ATOM needs `grain`, excludes `crisis: under_siege` |
| SAID.trad.feast.3 W | goods | tradition (feast) | Neighbours lend each other pots and pans for the feast. | PROPOSED: a false hit (a household's pots): the text becomes "…pans and dishes…" (your veto list); until then INELIGIBLE |
| SAID.inst.workshop-ordinary.4 C | office | house (workshop) | Prices are hard to judge these days. | TEXT "…hard to guess…" (your (3)) |
| SAID.person.powerface.1 W | office | person (a power's face) | People come with favours to ask, and most get a hearing. | ATOM `court sits` (the writer's own "a hearing" atom); PROPOSED instead: a false hit (the face hears them, no court): "…and most are heard." |
| SAID.inst.inn-ordinary.4 W | outside | house (inn) | Wet travellers get a warm spot first. | ATOM needs `route open`, excludes `crisis: under_siege` |
| SAID.inst.inn-ordinary.3 W | outside | house (inn) | Travellers always bring a story, and someone's always glad to hear it. | ATOM as above |
| SAID.inst.inn-ordinary.4 C | outside | house (inn) | Some travellers leave before dawn, without a word. | ATOM as above |
| LIE.front.trade.1 W | goods | liar's house (trade) | Anyone may look at the books, and plenty have. | PROPOSED: a false hit (a ledger's books): "books" becomes "accounts" in W, C and N (your veto list); until then the LINE is INELIGIBLE (its N prints with every version) |
| LIE.front.trade.1 C | goods | liar's house (trade) | The books here have never had a question asked of them. | as above |
| LIE.front.trade.1 N | goods | (DM note) | the books hide the criminal house's money passing through | as above |
| LIE.smuggling.4 W | outside | liar's house | Outside goods come in the proper way, like everything else. | ATOM needs `imports` |
| LIE.front.trade.2 W | outside | liar's house | The carts come in daylight, where everyone can wave. | ATOM needs `route open` (keeps excludes `crisis: under_siege`) |
| LIE.smuggling.1 N | outside | (DM note) | smuggled goods come in untaxed | ATOM needs `house: smuggling`, on the LINE (its N prints with every version) |

## The chair's ruling G1-4 (09:00 UTC): the changed words, for the owner's veto list

Every new text below is CONFIRMED to hold no class word (`classesOf`). The one exception is the liar's W, which keeps
a `plenty`: a speaker's word, exempt.

| line · version | old | new |
|---|---|---|
| SAID.inst.workshop-ordinary.4 C | Prices are hard to judge these days. | Prices are hard to guess these days. |
| SAID.trad.feast.3 W | Neighbours lend each other pots and pans for the feast. | Neighbours lend each other pans and dishes for the feast. |
| SAID.person.powerface.1 W | People come with favours to ask, and most get a hearing. | People come with favours to ask, and most are heard. (no `court sits`) |
| LIE.front.trade.1 W | Anyone may look at the books, and plenty have. | Anyone may look at the accounts, and plenty have. |
| LIE.front.trade.1 C | The books here have never had a question asked of them. | The accounts here have never had a question asked of them. |
| LIE.front.trade.1 N | the books hide the criminal house's money passing through | the accounts hide the criminal house's money passing through |

THE FOUR CANDLE VERSIONS: "candles" is taken out and the late light kept, each a different remark (L-4). ACCEPTED by the chair at 09:05 UTC, with the hall's line changed as below:

| line · version | old | new |
|---|---|---|
| SAID.inst.hall-ordinary.5 T | Candles burn here long after dark, and someone pays for them. | The lights burn here long after dark, and someone pays for them. (the chair's, 09:05 UTC: the remark kept, only the word moved) |
| SAID.inst.inn-ordinary.2 T | Late nights burn a lot of candles. | Keeping the lamps lit late costs a fair bit. |
| SAID.trad.vigil.3 T | Candles for the vigil cost more each year. | Lighting the vigil costs more each year. |
| SAID.trad.vigil.3 W | Families take turns keeping the candles lit. | Families take turns tending the lights all night. |

With these, NO version is ineligible: the count pinned in the leaf's test is 0.
