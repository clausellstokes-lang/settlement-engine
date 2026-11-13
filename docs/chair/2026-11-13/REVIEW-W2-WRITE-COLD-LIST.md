# REVIEW-W2-WRITE: the cold list (thirty fresh towns at a041a7bc5, against deb1544eb)

Committed before the reviewer read any claim of the lane: its hand-backs, its lists of new lines, its commit messages. The data is `REVIEW-W2-WRITE-COLD-LIST.json` beside this file (1,551 entries; query it by script). The instruments are in `probes/REVIEW-W2-WRITE/`.

## How the towns were born and rendered
- **Seeds** (`probes/REVIEW-W2-WRITE/seeds30.txt`): `rww-<size>-<calm|crisis>-1`, five of each size, none the census's, the fixture's or an earlier reviewer's.
  - Calm (the stress panel at None): one of each size. The thorp `rww-thorp-calm-1` was born with a famine in force all the same (the generator's own; the record carries `famine`), so the thirty hold 7 famines.
  - Sieges: one of each size (6). Famines: one of each size (6, plus the one above).
  - Other crises (12): thorp plague_onset, monster_pressure; hamlet succession_void, mass_migration; village religious_conversion, indebted; town occupied, slave_revolt; city recently_betrayed, insurgency; metropolis wartime, infiltrated.
- **Configuration: the app's own shape.** `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false, selectedStresses:[…], _randomizePriorities:true})`, as the configuration panel writes it with Random off; every other dial the store's default.
- **Birth and render:** `render.rww.jsx` (REVIEW-W2A-3's `render.rw3.jsx`, prefix changed), through each tree's own `OutputContainer`, as the owner sees it: every group, sub-tab and disclosure opened; public prose stamped. `render.sh <tree> <out> seeds30.txt 3`.
- **Two trees:** the tip a041a7bc5 and the base deb1544eb. **All 30 records are identical at the two trees** (public prose aside): the lane re-deals no town. 37,771 dump lines at the tip.
- **What differs on the page** (`sentdiff.mjs`, `probes/REVIEW-W2-WRITE/sentdiff-base-tip.json`): 218 sentences print at the tip and not at the base (125 of them a rewording of a base sentence in the same view), and 168 base sentences are gone with no near form at the tip. The lane merged two other lanes into itself (the W2-A leaves lane at 96d698de7 and the W2-B declare lane at 9d5d6e091), so "at the tip and not at the base" includes their changes; who wrote each line is settled in the review, after the claims are read.

## How the towns were read
- **Nine readers** (`READER-BRIEF.md`; REVIEW-W2A-3's brief, paths changed), each a whole dossier end to end, every candidate checked against the record by script. Raw files: `probes/REVIEW-W2-WRITE/readers/` (1,675 entries; every sentence verbatim on its page, two after whitespace folding).
- **Merged** (`merge.mjs`) to 1,549 distinct town-and-sentence entries; the reviewer added 2 (below): **1,551**.
- **Severity** normalised as REVIEW-W2A-3 did: a bare catalogue name with a count range is LOW, class `catalogue-range-name` (273); a range inside prose capped at MED; a slider value printed is MED.
- **Columns added by script:** `atBase` (the sentence prints anywhere on the town's base page), `partsNew` and `bornOnLane` (a sentence of it prints at the tip and nowhere on the base page), `corpusTip`/`corpusOwn` (its words match a prose-corpus variant of `src/data/dossierStateProse/*.generated.js` at the tip, slots and tier nouns folded; an undercount, since a block whose variant is woven may not match).
- **The reviewer's own read** (`annotate.mjs`): every MEDIUM or HIGH line born at the tip was read against its base form and marked NEW (the false claim is new) or OLD (the base printed the same false claim in other words); two chip rows the merge mis-marked were corrected; and from the 218 tip-only sentences the reviewer added two the readers missed.

## The count
| | HIGH | MED | LOW | catalogue-range names (LOW) | total |
|---|---|---|---|---|---|
| thirty towns at a041a7bc5 | **86** | **552** | 640 | 273 | 1,551 |
| of which the words are the corpus's own (matched) | 8 | 82 | 91 | 0 | 181 |
| of which print at the tip and NOT at the base | **0** | **18** | 28 | 0 | 46 |
| born at the tip, MED, the false claim NEW | 0 | **14** | | | |

Section 7 (income lines naming a working the roster lacks): 42 entries, marked `section7`.

By mechanism (the bare catalogue names excluded):

| Mechanism | Lines | HIGH | MED |
|---|---|---|---|
| internal text | 273 | 0 | 142 |
| two homes that disagree | 272 | 4 | 141 |
| names a house, role or force the town lacks | 230 | 18 | 92 |
| a resource, good or chain state not so | 106 | 2 | 51 |
| normal times under a crisis in force | 98 | 16 | 31 |
| a ruler, power, threat or history state | 94 | 10 | 34 |
| a count | 43 | 9 | 9 |
| broken text | 39 | 18 | 7 |
| a figure against the record | 37 | 0 | 14 |
| a size | 34 | 4 | 12 |
| denies a house or force the town has | 16 | 3 | 11 |
| other | 36 | 2 | 8 |

No town reads clean: every one of the thirty carries at least one MEDIUM line, and 28 carry a HIGH. Of the 86 HIGH, none is new at the tip; all print at deb1544eb.

## The eighteen MEDIUM lines that print at the tip and not at the base
| Town | Tab | Sentence | Fault | Corpus words | Against |
|---|---|---|---|---|---|
| thorp-calm-1 | Defense | Nothing threatens Cnocholme now, and nothing about the thorp would stop it if something did. Its safety rests on nobody wanting it. | NEW | yes | `config.monsterThreat` frontier; same tab "Beasts & Monsters Critical", "The thorp knows it needs specialists against the creatures"; a famine in force. Base: "Nothing has come for Cnocholme and nothing about the thorp would stop it." |
| hamlet-famine-1 | Defense | Nothing threatens Ulfset now, … Its safety rests on nobody wanting it. | NEW | yes | the same (frontier; "needs specialists against the creatures"; famine) |
| village-calm-1 | Defense | Nothing threatens Maghleigh now, … | NEW | yes | frontier; same tab "The village knows it needs specialists against the creatures" |
| village-famine-1 | Defense | Nothing threatens Naranjopeten now, … | NEW | yes | famine in force; frontier; "Its hungriest are turning to banditry" |
| hamlet-famine-1 | Defense | Nobody ever thought Ulfset worth a wall, and nothing has yet given it cause to want one. | NEW | yes | `history.founding.reason` "established as a defensive stronghold"; frontier threat; a defended pass |
| city-under_siege-1 | Overview | Visitors find Panteakra's market without asking. *(reviewer)* | NEW | yes | under siege, nothing comes in by road; the markets "critically impaired by siege". Base: "Panteakra's market lives off through-traffic." |
| metropolis-under_siege-1 | Overview | Visitors find Naranjotepec's market without asking. *(reviewer)* | NEW | yes | the same |
| city-under_siege-1 | Resources | The city used to send its wool out half-worked; with the roads cut by the siege it piles up instead, and nobody here can finish it. | NEW | yes | Weavers/Textile workers, Dyer and Fuller on the roster; "Cloth Finishing & Clothing ✓ Running" |
| metropolis-under_siege-1 | Defense | The metropolis's soldiers are paid by the season and drilled by the week, whether or not anything comes. | NEW | yes | same tab, Economic Survival: "Naranjotepec's pay book is always behind: its defenders are paid late or not at all" |
| hamlet-calm-1 | Economics | Ormaker cannot produce its own salt, so it buys it in. | NEW | yes | the roster has Salt works ("Salt production"); only the raw desert salt is bought |
| village-religious_conversion-1 | Magic | Reliance on magic: Relied upon · supplied by Parish church and Priest (resident) | NEW | no | same tab: every role of magic "absent", magic "forbidden", acceptance "hostile" |
| metropolis-calm-1 | Magic | Reliance on magic: Integral · supplied by Academy of magic, Scroll scribe, Parish churches (50-100+) and Great cathedral | NEW | no | a catalogue name with a count range inside a sentence |
| metropolis-famine-1 | Magic | Reliance on magic: Integral · supplied by …, Parish churches (50-100+) and Great cathedral | NEW | no | the same |
| metropolis-infiltrated-1 | Magic | Reliance on magic: Integral · supplied by …, Parish churches (50-100+) and Great cathedral | NEW | no | the same |
| thorp-plague_onset-1 | Economics | Benglen cannot produce its own medicinal herbs, so it buys it in. | OLD | yes | "Produced locally" lists medicinal herbs. Base: "Benglen works medicinal herbs it cannot produce; it buys the raw stuff in" |
| village-calm-1 | Economics | Maghleigh's Cartographer's guild is short of what it needs from upstream, … | OLD | yes | the roster has a Cartographer's workshop, not a guild; the base printed the guild name too |
| village-religious_conversion-1 | Defense | Food endurance: … household stores would carry the village for about four months at full rations, more than a year on half. | OLD | no | `storageMonths` 2.4; "two months in household stores" on two tabs; the base printed the same figures |
| village-calm-1 | Defense | Food endurance: … about three months at full rations, more than a year on half. | OLD | no | `storageMonths` 2.1; the same |

The 28 LOW lines born at the tip are in the JSON (`bornOnLane:true`).

## The corpus's own HIGH lines (all print at the base too)
| Town | Tab | Sentence (abridged) | Against |
|---|---|---|---|
| metropolis-wartime-1 | History | Jalaliin came through the siege, older than its bearers; its legacy is … | `{timeband_age}` filled with a grudge's phrase |
| town-under_siege-1 | Economics | Sanctavallis has goods to sell, but the way out is unreliable, and a trader never knows whether a load will get through. | under siege, nothing comes in or out |
| city-under_siege-1 | Defense | Defense at Panteakra is not an emergency arrangement, it is the week's work: … nobody treats any of it as unusual. | under siege |
| city-insurgency-1 | Power | Noble Families now has more people behind it than Noble Governorship … | power 16 vs 20; members 4 vs 26 |
| city-famine-1 | Magic | Megaousa runs on arcane work. … | same tab: every role of magic absent |
| metropolis-infiltrated-1 | Resources | There is timber out there and nobody has ever thought it worth the trouble … | the timber chain runs; timber income on the page |
| village-famine-1 | Economics | Naranjopeten lives on a subsistence living that feeds it and no more, … | a famine: it does not feed itself |
| thorp-famine-1 | Defense | Kolbø is comfortably over-provided against beasts. … | the bar above: "Beasts & Monsters Critical" |

## What the cold list does not settle
- Who wrote each line born at the tip (this lane, or one of the two lanes it merged): settled in the review.
- The corpus attribution is a regex match on variant templates; woven blocks and lines with many slots may be missed, so 181 is a floor.
- The readers' severity was normalised by rule, not re-read line by line; the reviewer re-read every MEDIUM line born at the tip and every HIGH line's mechanism.
