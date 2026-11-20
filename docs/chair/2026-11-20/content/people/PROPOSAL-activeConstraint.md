# PROPOSAL — `npcs[].activeConstraint` (PEOPLE-1, measuring seat M1, 2026-11-20)

Base `b53a665e7` (the briefs commit; a docs-only child of the working line `43ab0f5eb`: `src/` identical). Measured on 100 places a size, the six sizes, born exactly as the chair's instrument births them (`hxd-<size>-<i>`, the same name mask). Scripts and their count lines: `measures/m1-births.mjs` (+ `.out.txt`), `measures/m1-npcStructure.mjs` (+ `.out.txt`), the proposed pools as data `measures/m1-pools.mjs`. Nothing under `src/`, `tests/`, `scripts/` was changed.

**The answer to the chair's question, first.** A calm place's card should keep a constraint, one read from the person's own office and the place's own state (**B**). Not printing one (**A**) costs nothing on any surface, but it does not meet the bar. When the holder's calm line goes, the next calm row takes the top: 65% of towns, 90% of cities, 87% of metropolises. When every calm constraint goes, the field disappears from 95 of 100 cities and the remaining crisis lines are still over half. **B** meets the bar at every size: at most 15% with all wordings, at most 19% with the vocabulary as it stands. The crux is in §6.

## 1. The function

`src/generators/npcStructure.js :: enrichNPCsWithStructure` writes the field once, on the template branch only:
`activeConstraint: lineText(tmpl.constraint)`, where `tmpl` is `T[looked]` resolved through `resolveDeclared` (`drawDeclared.js`) against `factsOf(settlement)`.

- **The cut.** A card is enriched only if it is within the cut (`cutOf`, 2 to 5 cards, minted lords counted apart, `isMintedLord`) or it is the seat's holder (`seatHolderAmong`: `seatCandidatesOf`, none while `isSeatVacant`). Every other card gets no constraint.
- **The key.** `cat__condition__rank`. `cat` is `government` for the holder, otherwise `npc.category`. `condition` is `getPrimaryCondition`'s first hit: governance_fractured, corruption, food_crisis, economic_stress, contested, or else stable. `rank` is `dominant` for the holder, `headsItsKind`, or `getRank`. `looked` falls back to `cat__stable__rank`, then to `other__stable__dominant`.
- **The refusals.** These cards get no constraint:
  - a non-holder whose first-rank power is not its row's body (`inItsBody`, POWERS-9);
  - a subordinate head of an UNDER kind (COHERENCE-POWERS-8);
  - a subordinate of a house kind the town lacks (`noHouseOfItsKind`, TAIL-TIES-3);
  - a non-holder whose row opens "Holds the seat" (`HOLDS_A_SEAT`, N3);
  - any card whose row `resolveDeclared` refuses. The stable rows are `CALM_ONLY`, so a crisis the condition does not name refuses them. The holder then gets `HOLDS_THE_SEAT` and no constraint.
- **The branch that prints.** It prints `T[looked].constraint`, verbatim. The rows are one table: `reg(cat, cond, dom, sub)`. `crafts` copies `economy`. `other__{corruption,food_crisis,economic_stress,contested}` are the `other__stable` rows, by the fill loop.

## 2. Today's branches and top share (100 places a size)

Places · entries, for every row on more than 10 places at some size. Full table: `measures/m1-npcStructure.out.txt`, `branch … activeConstraint` lines. "holder-row+house" is the holder whose card also carries a house. The constraint does not carry that house.

| row (T key) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| government__stable__dominant (holder, all) | 45·45 | 32·32 | 22·22 | 66·66 | 72·72 | 65·65 |
| religious__stable__dominant | – | – | 17·17 | 61·61 | 59·59 | 63·63 |
| military__stable__dominant | – | 2·2 | 1·1 | 46·46 | 69·69 | 65·65 |
| economy__stable__subordinate | – | 1·1 | 4·4 | 34·36 | 47·52 | 39·45 |
| government__governance_fractured__dominant (holder) | 25·25 | 34·34 | 28·28 | 7·7 | 1·1 | 4·4 |
| government__economic_stress__dominant (holder) | 21·21 | 26·26 | 39·39 | 3·3 | 1·1 | – |
| government__stable__subordinate | – | – | – | 41·44 | 5·5 | – |
| religious__economic_stress__dominant | – | – | 37·37 | 1·1 | 1·1 | – |
| religious__governance_fractured__dominant | – | – | 23·23 | 4·4 | 1·1 | 4·4 |
| economy__stable__dominant (all low-standing) | – | – | – | 13·13 | 16·16 | 22·22 |
| other__stable__dominant | – | – | – | 1·1 | 25·25 | 21·21 |
| magic__stable__dominant | – | – | – | – | 15·15 | 36·36 |
| religious__contested__dominant | – | – | 9·9 | 16·16 | – | – |
| government__contested__dominant (holder) | 6·6 | 2·2 | 8·8 | 15·15 | – | – |
| military__stable__subordinate | – | – | 2·2 | 13·14 | 10·10 | – |

**Top sentence today** (places printing it / places holding the field):

| size | top | sentence |
|---|---|---|
| thorp | 45/97 (46%) | With nothing pressing, it is hard to win support for mending the weak spots before they break. |
| hamlet | 34/96 (35%) | Cannot mend what is broken without bringing to light the quiet deals that keep the place running now. |
| village | 39/100 (39%) | Cannot pay for the repairs and relief people want without coin the place does not have. |
| town | 66/94 (70%) | With nothing pressing, it is hard to win support for mending the weak spots before they break. |
| city | 72/77 (94%) | (the same) |
| metropolis | 65/75 (87%) | (the same) |

The next calm rows are just as heavy:
- "It is hard to win the coin and the say that would be needed if worse trouble came." (military calm head): 49% of towns, 90% of cities, 87% of metropolises.
- "With nothing pressing, it is easy to grow comfortable and hard to argue for growing." (faith calm head): 65%, 77%, 84%.
- "Growing into the leading house's trade invites a reply; staying out of it means staying small." (36%, 61%, 51%).
- "Good work is expected and goes unnoticed; a mistake is remembered." (44% of towns).

**The fault is the whole calm table, not the holder's line alone.** These match the chair's 50-place figures: 33 of 48 towns and 35 of 37 cities, against 66/94 and 72/77 here.

## 3. The readers

| path :: symbol | kind | what breaks if the words change |
|---|---|---|
| `src/components/new/npcComponents.jsx` (NPC card, `npc.activeConstraint &&` → "Constraint: …") | PRINTS (web; the only surface: `scripts/.writer-reach-baseline.json` "activeConstraint on npcs": web-display only) | nothing. The label sits inside the guard, so an absent field shows no slot and no dangling "Constraint:" |
| `src/domain/display/galleryVeil.js` (`fields.constraint: ['activeConstraint']`) | veils the field in the gallery | nothing. It is keyed by field name, and an absent field has nothing to veil |
| `src/domain/dossier/dossierSearch.js` (searchable DM fields) | search text | nothing. New words become searchable |
| `src/domain/regenerationPreservation.js` (doc: a keeper is exempt; the cure re-runs `enrichNPCsWithStructure`) | re-derives on regen | nothing for the keyed pick: same `_seed` (the record keeps it, `settlement.schema.js`) and same card id give the same wording |
| `src/generators/generateSettlementPipeline.js` (doc comments), `settlement.schema.js` (typedef) | none | nothing |
| `supabase/functions/_shared/engineBundle.js` (bundled copy of the writer) | a built copy | rebuilt with the engine. The bundle is the deploy's, so the owner's hand |
| `docs/census/declarations/npcStructure.T.json` (`<key>.constraint` rows: text, `needs`, `excludes: crisis`) | MATCHES ITS WORDS (the census declaration) | the new pool needs its own declaration file, one row per wording, with its `needs` as written in §4. The T rows stay, since index 0 is unchanged |
| `tests/lint/presumedThings.shared.mjs` (file → pool map: `npcStructure.js` → NPC_STRUCTURE) | MATCHES (the presumption walker's pool map) | the new data file needs its row |
| `scripts/census/pool-dominance.register.json` (`ledger:NPC_STRUCTURE.<key>` top1/top5, shrink-only) | MATCHES (the dominance ceiling) | top1 falls: allowed (shrink-only). Whether a new pool id gets its own rows is a re-base, a chair's ruling (§6) |
| `tests/property/generatorGoldenMaster.test.js` | hashes every text leaf | rows move on every born town whose pick is off index 0. That is the signed door (ODQ §934.105), the owner's hand |
| `tests/generators/bar2PeopleTies.test.js` KEEP (`r2r-village-13`: "With nothing pressing, it is easy to grow comfortable …") | MATCHES (keyed on the text, seeded birth) | goes red if that card's pick leaves index 0. Re-key by identity (the house practice) |
| `tests/generators/tailTies3Batch1.test.js` (NOT rows: constraint substrings absent where no house of the kind stands) | MATCHES (absence) | none. The subordinate trade wordings print only where the kind stands, as today |
| `tests/generators/npcStructureSeatPlain.test.js` (MACHINERY, DEFENCE_WORDS over position+constraint) | MATCHES (word guard; synthetic, unseeded, so index 0) | none. The measure runs the same two regexes over every new wording: 0 misses |
| `tests/components/seatHolderOnThePage.test.jsx` (SUBORDINATE over the holder's constraint on the rendered page; seeded births) | MATCHES (word guard) | none. The measure runs SUBORDINATE over every `government__*__dominant` wording: 0 misses |
| `tests/generators/npcStructureDeclared.test.js`, `npcStructureGoalLookup.test.js` (undefined on refused cards; ledger pool id) | MATCHES (presence) | none, if the ledger keeps the pool id `NPC_STRUCTURE.<key>` |
| `tests/generators/people/mintedLordKeepsLines.test.js` (lines equal with and without minted lords) | compares | none. The pick is keyed by card id, not by place in the cut |

Nothing COMPOSES FROM `activeConstraint`: no other sentence is built from it.

**Option A's reader cost** (no constraint for a calm place). There is no empty slot or dangling label on any surface (above). What reds: the bar2PeopleTies KEEP row (under A-calm), and every golden row of a calm town. What goes: the census T `.constraint` rows of the calm keys, which must be re-recorded as not printing.

## 4. The candidate wordings, by branch

The rules for every pool below:
- Index 0 is today's exact line.
- The choice is `pickVariant([today, ...eligible], '<record _seed>::npcStructure.activeConstraint::<card id>')`. That is a keyed hash with no new draw, so the random stream is untouched.
- A wording is eligible only where its `needs` hold and its `excludes` do not.
- Every wording of a `stable` pool also carries the row's own `excludes: crisis` (CALM_ONLY). A calm place stays calm: each calm line is a plain limit of the post (what it cannot do, what it must ask of whom), never a looming trouble.
- The crisis pools (governance_fractured, economic_stress, contested) change the vantage, never the weight.
- The `other` pool serves the four crisis keys too, so it claims no calm. The measure guards this.
- The proposed data file is `src/data/npcStructureVariants.js` (`CONSTRAINT_VARIANTS`, keyed by the T key; `crafts__*` reads `economy__*` and `other__<crisis>__*` reads `other__stable__*`, as the writer's own table does).
- Atoms marked `ATOM?` are facts the record holds that no vocabulary atom answers. They are listed in §6. The projection is given with them (B) and without them (B-vocab).

**The guards each wording passed** (run by the measure; 0 misses):
- MACHINERY and DEFENCE_WORDS (`npcStructureSeatPlain.test.js`), "walls" only with the `walls` atom.
- SUBORDINATE on every holder pool (`seatHolderOnThePage.test.jsx`).
- UNDER on the heads' pools.
- No "office" on the old families' pool (`lordNotGovernment.test.js`).
- No calm word on the `other` pool.
- At most 30 words.
- Every pool key a real T row.

**The faith wordings never print where a priest rules.** "Has no say over the church", "Has no voice on the council" and "the council knows it" carry `excludes: ruler: priest`.


**`government__stable__dominant`** (14 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Cannot act alone: whatever the seat wants done, the council must agree to first. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | Does not set the prices or the wages of the trades; for anything touching them, the seat must deal with the guild. | `guild` · guild.js | — | a guild stands in the place, so the trade has its own rule-maker |
| 3 | Has no say over the church or its clergy; whatever the seat wants from the faith, it must ask for. | `church` · faith (dossier/faithReading.js, factsOf.faith) | `ruler: priest` | the place has its own church |
| 4 | There is coin for the everyday work and little over; any new building or hire means asking the households for more. | `prosperity: moderate` · factsOf.prosperity (prosperityRank.js) | — | Moderate: enough for the everyday work, little over |
| 5 | The coffers bear the everyday work and more, but every new cost must still be argued for before those who pay it. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |
| 6 | Has no paid hands to see its word kept; what the seat decides, the neighbours must be willing to carry out. | `militia` · defence.js | `paid watch` | the force is neighbours called out, not hands in pay |
| 7 | Its word is kept by the paid watch, and every extra round the watch walks comes out of the same purse. | `paid watch` · guardPay.js | — | someone is paid to keep order, out of the seat's purse |
| 8 | Rules by custom, with no written law behind it; a household that will not listen must be talked round, not made to. | `ruler: elder` · rulerKind.js; `population: small` · populationBand.js | — | an elder rules, by custom; a small place, where one person carries the post |
| 9 | Cannot push through anything the strongest power in the place sets itself against; here that power outweighs the seat. | `seat outranked` · seatOutranked.js | — | a power stands above the seat on the powers' ladder |
| 10 | Needs the other powers of the place on its side for anything large; the seat leads, but not alone. | `rival power` · rivalPower.js | `seat outranked` | another power stands at Significant or above |
| 11 | Does not judge the hard cases itself; those go to the court, and the seat abides by what is decided there. | `court sits` · defence.js :: courtHoldersOf | — | a court sits on the roster, so judging is not the seat's own |
| 12 | Can set the market days and the tolls, but cannot make buyers come or sellers stay. | `market` · market.js | — | the place keeps a market, the everyday ground of this post |
| 13 | In a place this large the seat sees little for itself; it must act on what its people bring it. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |
| 14 | Cannot please every quarter at once; whatever the seat gives one, another asks for next. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`military__stable__dominant`** (11 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Cannot raise more hands or more pay without the council, and in quiet years the council is careful with coin. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | Must keep {house} fed and paid out of what the seat allows, and the seat allows what quiet years seem to need. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 3 | The walls want upkeep every year; the coin for it has to be asked for, and in quiet years it comes slowly. | `walls` · defence.js | — | the place has walls, and walls are the post's standing upkeep |
| 4 | The place can afford its guard, but while nothing threatens, every extra hand must be argued for. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |
| 5 | There is pay for the hands already sworn and little over; a larger force would mean new dues. | `prosperity: moderate` · factsOf.prosperity (prosperityRank.js) | — | Moderate: enough for the everyday work, little over |
| 6 | Much of its strength is neighbours who turn out when called, and they have fields and trades to get back to. | `militia` · defence.js | `paid watch` | the force is neighbours called out, not hands in pay |
| 7 | Hired companies are paid by the season, and keeping them on when nothing threatens is hard to argue for. | `mercenary` · defence.js | — | a hired company stands on the roster |
| 8 | Answers to the seat for every hand and every coin; it cannot set its own numbers. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 9 | Must share the coin for keeping order with the paid watch, and it is the watch that people see every day. | `paid watch` · guardPay.js | — | someone is paid to keep order, out of the seat's purse |
| 10 | In a place this large, those under arms are spread thin across many streets. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |
| 11 | Drill keeps hands ready but not keen; quiet years wear on discipline. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`religious__stable__dominant`** (9 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Keeping {house} in repair takes alms, and alms come slowly when nothing troubles people. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Has no voice on the council; whatever the faith wants of the seat, it must ask for. | `ruling body` · rulingBody.js | `ruler: priest` | the seat is a council by its own label, so no one at it acts alone |
| 3 | Has few hands to help; in a place this small most of the faith's work falls to one person. | `population: small` · populationBand.js | — | a small place, where one person carries the post |
| 4 | Many houses of worship answer to it in name, but each priest keeps their own flock and their own ways. | `population: large` · populationBand.js; `church` · faith (dossier/faithReading.js, factsOf.faith) | — | a large place, where the post is spread over many; the place has its own church |
| 5 | The faithful give well in good years, but gifts come with the givers' wishes attached. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |
| 6 | Cannot command belief, only ask for it; people come to the services as habit and the year bring them. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 7 | The work is the same each week and each year, and doing it well earns thanks but little say. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 8 | Oaths and marriages are the faith's to bless, but quarrels over them go before the court. | `court sits` · defence.js :: courtHoldersOf | — | a court sits on the roster, so judging is not the seat's own |
| 9 | Must see to the faith's own people as well as its flock, and both expect the same patience. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`economy__stable__subordinate`** (8 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | What {house} can take on is limited to what the leading house leaves alone. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | The best of the {export} trade is already spoken for; the smaller houses take what is left. | `ATOM? export good` · factsOf.exports (no atom: §6) | — | the place's own export, named |
| 3 | Must keep to the guild's rules on prices and hands, rules the bigger houses had more say in writing. | `guild` · guild.js | — | a guild stands in the place, so the trade has its own rule-maker |
| 4 | Sells on the same market days as the leading house, and buyers go to the bigger name first. | `market` · market.js | — | the place keeps a market, the everyday ground of this post |
| 5 | Has less coin than the bigger houses to wait on a slow buyer, so it takes smaller, quicker deals. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 6 | In good years there is custom enough for all, but the best of it goes to the leading house first. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |
| 7 | In a place this large there are many small houses after the same custom. | `population: large` · populationBand.js | — | a large place, where the post is spread over many |
| 8 | Has little voice when the council sets the dues on trade; the leading house speaks first. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |

**`economy__stable__dominant`** (5 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Does not set the dues on trade; the council does, and the council hears every house. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | Lives on the {export} that goes out; whatever cuts that trade cuts this house first. | `ATOM? export good` · factsOf.exports (no atom: §6) | — | the place's own export, named |
| 3 | Must buy in {import} like everyone else, at prices set somewhere else. | `ATOM? import good` · factsOf.imports (no atom: §6) | — | the place's own import, named |
| 4 | Being first in the trade means being the one every complaint about prices is brought to. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 5 | Must keep the smaller houses of the guild content; the guild's rules bind the leading house too. | `guild` · guild.js | — | a guild stands in the place, so the trade has its own rule-maker |

**`government__stable__subordinate`** (5 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Runs {house} on what the seat allots it, and must ask before spending more. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Answers to the council for every coin and every choice; little is left to the post's own judgment. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 3 | Can do only what the seat has given the post to do; anything more must be asked for. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 4 | The purse is sound in good years, but every coin the post spends is counted by someone above it. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |
| 5 | Has enough to do the work and no more; there is nothing spare for doing it better. | `prosperity: moderate` · factsOf.prosperity (prosperityRank.js) | — | Moderate: enough for the everyday work, little over |

**`magic__stable__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Must keep {house} paid for out of fees and patrons, and patrons want a say in the work. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Must answer to the council for what is cast within the place. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 3 | A spell gone wrong is remembered longer than a hundred done right; the casters' good name is always at stake. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 4 | The faithful watch what the casters do, and some will not buy a spell at any price. | `church` · faith (dossier/faithReading.js, factsOf.faith) | — | the place has its own church |

**`other__stable__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Has no seat on the council by right; what the family wants, it must win through friends there. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | {house} keep their old honours, but the seat decides what those honours are worth. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 3 | Old rights count only as far as people still honour them, and fewer remember why they should. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 4 | The family's wealth is in land and name, and neither turns into coin quickly. | `prosperity: ≥ comfortable` · factsOf.prosperity (prosperityRank.js) | — | Comfortable or better: the purse can bear more |

**`government__governance_fractured__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Cannot get the council to agree on any remedy, and cannot act without it. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | Has no paid hands to make its word stick; it must win people back one household at a time. | `militia` · defence.js | `paid watch` | the force is neighbours called out, not hands in pay |
| 3 | In a place this small, every attempt to take charge again is watched and talked over by everyone. | `population: small` · populationBand.js | — | a small place, where one person carries the post |
| 4 | Every order that goes unanswered makes the next one easier to ignore. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`government__economic_stress__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Every coin spent on the walls is a coin not spent on relief, and both are wanted. | `walls` · defence.js | — | the place has walls, and walls are the post's standing upkeep |
| 2 | Cannot raise the dues without the council, and the council knows the households cannot pay more. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 3 | Must still buy in {import}, and that comes first, before any repair or relief. | `ATOM? import good` · factsOf.imports (no atom: §6) | — | the place's own import, named |
| 4 | Can promise little and pay for less, and every refusal is remembered. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |

**`religious__economic_stress__dominant`** (4 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Keeping {house} in repair and feeding the poor draw on the same thin purse. | `ATOM? own house` · the card's own `institution` (no atom: §6) | — | the person's OWN house, named |
| 2 | Can give only what it is given, and in lean years less is given. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 3 | In a place this small, everyone knows who the alms went to and who went without. | `population: small` · populationBand.js | — | a small place, where one person carries the post |
| 4 | The church's roof and the poor box both want coin, and there is not enough for both. | `church` · faith (dossier/faithReading.js, factsOf.faith) | — | the place has its own church |

**`religious__governance_fractured__dominant`** (2 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Has no hands to enforce anything it settles; its word holds only while people choose to keep it. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 2 | Every quarrel it settles is one the council failed to settle, and the council knows it. | `ruling body` · rulingBody.js | `ruler: priest` | the seat is a council by its own label, so no one at it acts alone |

**`religious__contested__dominant`** (2 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Whatever it says of the seat, part of the congregation will have hoped for the other answer. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |
| 2 | The council wants its word on the seat; giving it, or holding it back, both cost the faith friends. | `ruling body` · rulingBody.js | `ruler: priest` | the seat is a council by its own label, so no one at it acts alone |

**`government__contested__dominant`** (2 new; index 0 is today's line)

| # | wording | needs (atom · home) | excludes | why of this person, here |
|---|---|---|---|---|
| 0 | today's exact line | — | (the row's own) | canonical-at-zero |
| 1 | Cannot carry the council on anything hard while so many doubt the seat's right. | `ruling body` · rulingBody.js | — | the seat is a council by its own label, so no one at it acts alone |
| 2 | Must answer for every choice twice: once to those who back the seat, once to those who doubt it. | — | — | a plain limit (or the plain round) of the post itself; true of any holder of the row: a vantage variant |


## 5. Projected top share by size (100 places a size; `measures/m1-npcStructure.out.txt`, SUMMARY)

| | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| **today** | 45/97 46% | 34/96 35% | 39/100 39% | 66/94 70% | 72/77 94% | 65/75 87% |
| A-holder: no constraint for the calm holder | 25/52 48% | 34/67 51% | 39/98 40% | 61/94 65% | 69/77 90% | 65/75 87% |
| A-calm: no constraint on any calm row | 25/52 48% | 34/64 53% | 39/78 50% | 16/28 57% | 3/5 60% | 5/10 50% |
| **B: the pools of §4** | 10/97 10% | 12/96 13% | 11/100 11% | 14/94 15% | 11/77 14% | 10/75 13% |
| B-vocab: B without the `ATOM?` wordings | 10/97 10% | 12/96 13% | 14/100 14% | 15/94 16% | 15/77 19% | 12/75 16% |

What each option leaves on the cards:
- **A-holder.** The calm holder's card prints no constraint. The next calm row becomes the top.
- **A-calm.** The places holding any constraint fall from 94 to 28 towns, from 77 to 5 cities and from 75 to 10 metropolises. Among those few, the crisis lines run 50–60%.

**The commonest projected sentence under B:**

| size | top | sentence |
|---|---|---|
| thorp | 10% | Cannot please every quarter at once; whatever the seat gives one, another asks for next. |
| hamlet | 13% | In a place this small, every attempt to take charge again is watched and talked over by everyone. |
| village | 11% | Cannot pay for the repairs and relief people want without coin the place does not have. (today's index 0) |
| town | 15% | Good work is expected and goes unnoticed; a mistake is remembered. (`government__stable__subordinate` index 0) |
| city | 14% | The place can afford its guard, but while nothing threatens, every extra hand must be argued for. |
| metropolis | 13% | The walls want upkeep every year; the coin for it has to be asked for, and in quiet years it comes slowly. |

**Where the projection approximates the code path** (also printed at the foot of the `.out.txt`):
1. It reads the facts on the FINAL record. The writer reads `factsOf` on the record at the structural pass, so a fact a later step changes would differ.
2. It reads the atoms through `m1-pools.mjs :: atomHolds` over cached facts, a stand-in for the `factVocabulary.js` readers. These are the same homes: rulingBody, guild, market, defence, paidWatch, courtSits, rivalPower, seatOutranked, faith.hasChurch, populationBand, prosperity, rulerKind.
3. It keys the pick on `_seed` and `npc.id`, which the writer has in hand (`settlement._seed` is read by `landMemberships` in the same tail).
4. It takes the share at 100 places, so a swing of about 3 places is noise. The 15% figures sit at the bar, not under it by a margin.

## 6. What I could not settle, and what must be ruled

1. **THE CHAIR'S QUESTION.** I recommend **B**. The crux is that the bar's cure is variety, and absence is not variety. Under A the field's commonest sentence stays at 48–90% because the calm table is uniform across every office, not only the holder's. Under A-calm the card loses its one "what binds them" line on almost every calm city card, which turns the line into a tell: a card with a constraint would mean trouble. B keeps the calm (each line a plain limit of the post) and meets the bar. **Ruling needed:** A or B. If B, whether the faith, armed, trade, office, caster and family pools (beyond the holder's) are in scope. They have to be, or the bar holds at 49–90%.
2. **Weight.** A few constraints name a cost a calm place still carries: "The walls want upkeep every year …" (military #3), "Drill keeps hands ready but not keen; quiet years wear on discipline." (military #11), "Hired companies are paid by the season …" (military #7). I read them as plain limits, not troubles. The chair may strike any of them. Each strike raises the city/metropolis top by about 1–2 points.
3. **The atoms the vocabulary lacks** (the chair's rule of 16:10 UTC; `factVocabulary.js` untouched):
   - ATOM own house : none under src/domain/facts/ (the card's own record field `npcs[].institution`, kind 'house', filled by `src/generators/people/goals.js :: houseFill`) : "Keeping {house} in repair takes alms, and alms come slowly when nothing troubles people." (also military #2, trade-subordinate #1, office #1, casters #1, families #2, faith-in-lean-years #1)
   - ATOM export good : src/domain/facts/goodExported.js (the keyed home; the list is `factsOf.exports` via `canonicalAccessors.js :: canonExports`, a good through `goals.js :: resourceFill`) : "The best of the {export} trade is already spoken for; the smaller houses take what is left." (also leading-house #2)
   - ATOM import good : src/domain/facts/criticalImportBroughtIn.js (the nearest home; the list is `factsOf.imports` via `canonImports`) : "Must buy in {import} like everyone else, at prices set somewhere else." (also holder-in-lean-years #3)

   Without them (B-vocab), cities project at 19% and towns at 16%. Granting them is the chair's ruling. If they are refused, the pools need two or three more vocabulary-only wordings for the calm armed and faith heads in cities.
4. **The pool-dominance register and the census declaration.** If the variants are their own pool id, the register (`scripts/census/pool-dominance.register.json`, shrink-only) needs a re-base, on the chair's ruling. If they stay under `NPC_STRUCTURE.<key>`, the ceilings only fall, which the register allows. The integrator chooses; the chair rules the re-base.
5. **The golden master moves** on every town whose pick leaves index 0. That is the owner's signed door. One seeded text test (`bar2PeopleTies` KEEP, `r2r-village-13`) must be re-keyed by identity.
