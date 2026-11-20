# PROPOSAL — `powerStructure.factions[].desc` (PEOPLE-1, measuring seat M4, 2026-11-20)

Base `01351d72d` (a docs-only child of the working line `43ab0f5eb`; `src/` identical). Measured on 100 places a size, the six sizes, born exactly as the chair's instrument births them (`hxd-<size>-<i>`, the same mask). Scripts and count lines: `measures/m4-births.mjs` (+ `.out.txt`), `measures/m4-measure.mjs` (+ `.out.txt`), `measures/m4-common.mjs`, the pools as data `measures/m4-pools.mjs` (`DESC_POOLS`, `CODA_POOLS`). Nothing under `src/`, `tests/`, `scripts/` was changed.

**The answer first.** Each power's description is one stored leaf: an **opening** (the line its ladder chose) and, from village up, **standing codas** appended after it.

- **The openings are the fault the instrument sees.** 41% of thorps and 35% of hamlets print the elders' line. 41% of villages print the priest's line, and it opens 74% of them. At metropolis, 86% print the advisory arcane line with its clergy coda.
- **Step A** pools the 26 heaviest openings, small and large (2 to 9 wordings each, read from the place's own facts, picked by keyed hash with no draw). It brings the leaf's commonest sentence to **10% thorp, 10% hamlet, 12% village, 10% town, 14% city, 14% metropolis**.
- **Step B** is separate: it pools the ten heaviest codas. Read by the sentence instead of the leaf, the codas still repeat after step A (town 52%, city 71%, metropolis 98%). Step B brings them to **10 / 10 / 14 / 17 / 24 / 25%**.
- **The unit is the chair's ruling** (§6.3).
- **No ATOM is asked.**

**Where it prints:**
- the Power tab (`src/components/new/tabs/power/PowerStrata.jsx`, `f.desc` on each power's card);
- the PDF (`src/pdf/lib/viewModel.js`, `description: f?.desc`, into `src/pdf/sections/PowerStructure.jsx`);
- the writer-reach baseline also marks campaign-pdf, dossier-pdf, foundry and world-book ("desc on factions");
- it is searchable (`src/domain/dossier/dossierSearch.js`).

SAME-1's render of 300 places: its commonest sentence prints in 54/34/82/80/82/100% of places, thorp to metropolis.

## 1. The functions

The description is written at the power step and re-written by six later passes. **None of them draws.** Each line is chosen by the tier, the priorities, the power figures, the seat's name and the roster. A keyed-hash pool therefore changes no draw.

**1. `src/generators/power/rulingStructure.js :: generatePowerStructure`: the openings.**
- **The seat.** `govDesc` is chosen from `govDescByLabel` / `govDescByFaction` / `GOV_DESC_OF_UNNAMED_SEAT` (`src/data/powerSiblings.js`) by the seat's name, and resolved through `said` (`FACTION_DESC_SIBLINGS`). At the small sizes:
  - an Elder Council with no govBody house takes "The oldest heads of the community decide things together; …";
  - a Household Council (the "head-of-household consensus" house) takes "Settlement governed by heads of household; …";
  - a Headman's Authority and a Free Elder Council take their `GOV_DESC_OF_UNNAMED_SEAT` lines;
  - an Elected Reeve with no noble takes `REEVE_ANSWERS_TO_ELECTORS`;
  - a Feudal Stewardship takes the steward's line, and an elder label house takes "Respected elders guide …".
  Larger:
  - the town's Mayor, Council and Guild Council;
  - the city's full council and Merchant Guild Council;
  - the metropolis's grand council and consortium.
- **The other powers.** Each kind has a ladder keyed by its raw power and tier:
  - merchants: "Established merchant community; …" at 18–25;
  - the faith: "The village priest is …" at 18–24 in a hamlet or village, "Church institutions are well-embedded …" at 18–24 in a town;
  - craft: "Craft guilds regulating production …" at 11–16;
  - arcane: the advisory line at ≤ 10;
  - the force: "Town watch; …" and the two "City watch; …" lines, through `militaryForceLine.js :: forceLineOf`.

**2. `power/stressFactions.js :: applyStressEventFactions` and `governingStressVignettes.js :: occupiedSeatLine`**: the crisis powers and the occupied seat's twin. These are crisis lines and are not pooled.

**3. `src/generators/power/claimStanding.js :: settleClaimsToLabel`**, after the multipliers:
- the seat's respect line takes its crisis twin under a legitimacy crisis (`SEAT_UNDER_CRISIS`: "The oldest heads of the community still decide things together, but fewer and fewer people accept their word.");
- a claim its final label denies takes its ladder's lower rung (`CLAIM_RUNGS`). This is how most of the large places' heaviest openings arrive: `CLERGY_AT_MARGINS`, `ARCANE_ADVISORY`, `CRAFT_AT_MARGINS`, `LESSER_LANDED`, `LOCAL_MERCHANTS`;
- `SEAT_WORDS` swaps "council" for "the hall" where no council sits ("… expect access to the hall in return.").

**4. `src/generators/power/factionStanding.js :: annotateFactionStanding`: the standing codas.**
- by rank and gap: "They are always at the table, but cannot set their own terms.", "They operate in the shadow of …", "The gap between them and … is narrow. …", "Close enough to the two above …";
- by pairs on the roster: merchants and craft, guard and underworld, nobles and merchants, the clergy and the arcane orders, the guard and the clergy.

The codas are re-settled to the final roster by `power/rosterText.js :: settleStandingToRoster` (assembly).

**5. `src/generators/density/applyDensityLaw.js`**:
- `rivalDescOf` gives a minted rival of a watch or an army "A second armed company that wants a share of keeping order here, …";
- `reeveToRoster` re-reads the reeve.

**6. `claimStanding.js :: settleClergyToFinalRoster` and `settleArcaneToPractitioners`**, on the final record (`generateSettlementPipeline.js`): the margins line becomes `CLERGY_WITH_WEIGHT` where the faith weighs; the advisory lines become their no-practitioner twins.

## 2. Today's openings and top share (100 places a size; places · entries)

The pooled openings, and how many places a size open a description with each. Full lines: `measures/m4-measure.out.txt`, `opening …` lines.

| opening (its writer) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| "The oldest heads … not law." (seat, govDescByFaction) | 41·41 | 35·35 | 44·44 | – | – | – |
| "… still decide things together, but fewer …" (SEAT_UNDER_CRISIS) | 13·13 | 17·17 | 18·18 | – | – | – |
| "Settlement governed by heads of household; …" | 22·22 | – | – | – | – | – |
| "A headman settles disputes …" | – | 21·21 | 8·8 | – | – | – |
| "The elders of the hamlet decide …" | – | 14·14 | – | – | – | – |
| "One of the peasantry, elected …" (reeve twin) | – | – | 18·18 | – | – | – |
| "The village priest is the most educated …" | – | – | 74·74 | – | – | – |
| "Church institutions are well-embedded …" | – | – | – | 80·80 | – | – |
| "Town watch; …" | – | – | – | 66·66 | – | – |
| "Craft guilds regulating production …" | – | – | – | 37·37 | 3·4 | 3·6 |
| "A mayor runs the town's …" | – | – | – | 34·34 | – | – |
| "Established merchant community; … council access …" | – | – | 5·5 | 29·29 | 23·35 | 26·33 |
| "Established merchant community; … the hall …" | – | 1·1 | 5·5 | 31·31 | 12·17 | 47·62 |
| "An elected or appointed council governs; …" | – | – | – | 25·25 | – | – |
| "The guilds govern together; …" | – | – | – | 20·20 | – | – |
| "Clergy are present but operate at the margins …" | – | – | – | 2·2 | 79·101 | 90·115 |
| "City watch; it answers for keeping order …" | – | – | – | – | 67·67 | 64·64 |
| "Magical practitioners are consulted …" | – | – | – | – | 42·52 | 98·120 |
| "A full council governs the city: …" | – | – | – | – | 35·35 | – |
| "A second armed company …" (density rival) | – | – | – | – | 34·34 | 25·25 |
| "City watch; law enforcement and external defence, …" | – | – | – | – | 25·25 | 30·30 |
| "A consortium of guild masters holds power; …" | – | – | – | – | 22·22 | – |
| "The trades regulate their own production …, but carry little weight …" | – | – | – | – | 22·24 | 56·64 |
| "Minor landed families …" | – | – | – | – | – | 43·57 |
| "A grand council of senior officials, …" | – | – | – | – | – | 29·29 |
| "A formal consortium of the metropolis's …" | – | – | – | – | – | 21·21 |
| places holding the field | 100 | 100 | 100 | 100 | 100 | 100 |

**Top sentence today** (the stored leaf, the instrument's unit):

| size | top | sentence |
|---|---|---|
| thorp | 41/100 (41%) | The oldest heads of the community decide things together; people follow them out of respect and custom, not law. |
| hamlet | 35/100 (35%) | (the same) |
| village | 41/100 (41%) | The village priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale. |
| town | 34/100 (34%) | Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life. The merchants consistently outvote them … |
| city | 38/100 (38%) | Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited. |
| metropolis | 86/100 (86%) | Magical practitioners are consulted but not formally empowered. … The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly. |

By the **sentence** (each sentence of a leaf counted apart), the commonest prints in **41 / 35 / 74 / 80 / 79 / 98%** of places, thorp to metropolis. At town and above the codas carry that figure: "They and the religious authorities both keep people in line." (52% of towns, 71% of cities, 91% of metropolises) and "The arcane orders are present but operate in the clergy's shadow." (98% of metropolises). These agree with SAME-1's 54/34/82/80/82/100%, the small differences being the sample.

## 3. The readers

| path :: symbol | kind | what breaks if the words change |
|---|---|---|
| `src/components/new/tabs/power/PowerStrata.jsx` (`f.desc`) | PRINTS (web, Power tab) | nothing |
| `src/pdf/lib/viewModel.js` (`description: f?.desc`) → `src/pdf/sections/PowerStructure.jsx` | PRINTS (PDF) | nothing |
| foundry / world-book / campaign-pdf (writer-reach baseline, "desc on factions": R) | PRINTS | nothing |
| `src/domain/dossier/dossierSearch.js` (`faction.desc` in the search text) | search | nothing; new words become searchable |
| `src/domain/factionRename.js` (`${ROSTER}.desc`, whole-word rewrite) | COMPOSES (rewrites names) | nothing: the pooled wordings name no power (the codas' `$1`/`$2` keep the names they carried) |
| `src/domain/crisis/crisisCast.js :: raisedReasonOf`, `src/domain/display/governanceAccount.js` (regexes on crisis-raised descriptions) | MATCHES | nothing: no crisis line is pooled |
| `claimStanding.js :: settleClaimsToLabel` (`SEAT_UNDER_CRISIS`, `CLAIM_RUNGS`, `SEAT_WORDS`), `settleClergyToFinalRoster`, `settleArcaneToPractitioners` | MATCH the openings | **at birth nothing**: the proposed pass runs after them all (§6.1), so they meet index 0 and the pass varies only what they leave. Every arcane wording is pooled under the line `settleArcaneToPractitioners` keeps only where practitioners work; its no-practitioner twin is not pooled |
| `density/applyDensityLaw.js :: rivalDescOf` (`/^(City\|Town) watch; /`), `reeveToRoster` | MATCH | nothing: assembly, before the pass. A stored variant is never re-read by them (no post-birth caller) |
| `power/rosterText.js :: settleStandingToRoster` (a coda at a description's end) | MATCHES the codas | nothing: assembly, before the pass |
| `docs/census/…` · `scripts/census/pool-dominance.register.json` (`ledger:rulingStructure:FACTION_DESC_SIBLINGS`: the watch and market-day lines declare `watch` / `market`) | MATCHES (the dominance ceiling, a declared set) | the ledger pool's index 0 is unchanged and every watch wording also `needs: watch`; its ceiling only falls (shrink-only allows it). The new pools are a new id: a re-base, the chair's ruling |
| `tests/lint/presumedThings.register.json`, `presumedThings.widened.register.json`, `presumptionClasses.register.json` (rows on `rulingStructure.js`, `claimStanding.js`) | MATCHES (presumption walkers) | the new file's literals are walked; each wording carries its `needs` in the drawDeclared shape so the walker reads them; the integrator re-records the registers |
| `tests/helpers/pageLaws/law14K.mjs` (14a: a minted rival whose description copies its host's) | MATCHES | a host and its rival are keyed by their own names, so a pooled opening may now differ between them: the law counts fewer copies, never a false one. Read once by the integrator |
| `tests/generators/bar8Powers.test.js` (NEGATIVE row: the clergy line "is the rival's as the host's"; line 112 filters hosts opening `/^Clergy are present/`) | MATCHES (seeded) | red where the seeded host's pick leaves index 0: re-key by identity (the row asks that the rival's description is not a one-body copy; a varied generic line keeps that true) |
| `tests/generators/power/standingReadsTheNamedPower.test.js`, `powerDescClaimLabel.test.js`, `claimRungsCommanding.test.js`, `claimRungReadsRoster.test.js`, `seatNamedAsItSits.test.js`, `arcaneAdvisoryReadsTheSeat.test.js`, `power/arcanePractitioners.test.js`, `factionDescSiblings.test.js`, `census5dGarrisonReword.test.js` | MATCH (mostly unit calls on `generatePowerStructure` / `settleClaimsToLabel` / `annotateFactionStanding`, no seed) | the unit rows: nothing (the pass is not in those functions). Their seeded rows: re-key where the pick leaves index 0 |
| `tests/generators/power/occupiedSeatReads.test.js`, `tailTies2Batch1.test.js`, `bar5PowersStanding.test.js`, `powersReadTheRosterP31.test.js` (`CLERGY`), `bar2PeopleTies.test.js` ("City watch; it answers …"), `tests/domain/bar6PowersCards.test.js` (grand council) | MATCH (seeded births) | red where the seeded place's pick leaves index 0: re-key by identity |
| `tests/property/generatorGoldenMaster.test.js` | hashes every text leaf | rows move on every born town whose pick leaves index 0: the owner's signed door |

Nothing COMPOSES a further sentence from a description.

## 4. The candidate wordings

**The rules for every pool below:**
- Index 0 is today's exact line.
- The opening's pick is `pickVariant([today, ...eligible], '<record _seed>::powerStructure.factions.desc::<the power's name>')`. A coda's pick adds `::<coda id>`.
- A description is varied only where it **opens** with a pooled line; the rest of it is kept. A coda is varied where it stands.
- **Each wording keeps its line's own claim and weight.** It changes the vantage or names a house the record holds. A seat's line keeps the seat's one office ("a king does not wear a dual hat"): the mayor runs the business, and "the hard cases go to the court"; the headman settles and speaks, nothing more.
- **A crisis twin stays a crisis line, and a calm line claims no calm.** The elders' respect line is pooled only where it stands; under a legitimacy crisis it has already become its twin, which has its own pool.
- **No new trouble, custom, count, season or good.**
- **The elders are said "from who the elders are" only as far as the record holds it.** The record holds no count of households and no family number (`population` is people, not families), so no wording counts them. The place's trade is said as "what the place sends out" (`exports`). The `trade at work: fish` atom reads true in nearly every place of the sample, so it cannot say who the elders are, and is not used.
- **The guards each wording passed** (the measure, 0 misses): no season or machinery word; at most 45 words.
- **The proposed data file is `src/data/powerLineVariants.js`** (`DESC_POOLS` keyed by the opening's text; `CODA_POOLS`).

**"The oldest heads of the community decide things together; people follow them out of respect and custom, not law."** (5 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Disputes here go to the oldest heads of the households, who settle them together; people abide by what they decide out of respect, not because any law says so. | — | — | the local; the seat's own claim: the elders decide, by respect and custom |
| 2 | There is no written law here; the oldest heads of the community decide things together, and people go along with them out of respect and custom. | — | `court sits`, `legal house` | the newcomer; no court sits and no house of the law stands (courtHoldersOf, legalHouse.js): nothing written to rule by |
| 3 | In a place this small, the oldest heads of the community decide things together, and everyone knows them well enough to follow them out of respect and custom. | `population: small` | — | the local; a small place, where everyone knows the elders |
| 4 | The oldest heads of the community decide things together, down to who does which work; people follow them by custom and out of respect, not by law. | — | — | the official; the seat's own claim (the elders decide), said of the everyday |
| 5 | The oldest heads of the community decide things together, from what the place sends out to how a quarrel is settled; people follow them out of respect and custom, not law. | `exports` | — | the trade; the place has an export list: what the elders decide includes its trade |

**"The oldest heads of the community still decide things together, but fewer and fewer people accept their word."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The elders still meet and decide, but more and more households go their own way regardless. | — | — | the local; the crisis twin's own claim (the legitimacy crisis) |
| 2 | The oldest heads of the community still speak for it, but their word no longer settles things the way it did. | — | — | the official; the crisis twin's own claim |
| 3 | In a place this small, everyone can see that fewer people now heed the elders, though the elders still decide things together. | `population: small` | — | the newcomer; a small place |
| 4 | Decisions are still made by the oldest heads of the community together; fewer people than before accept them. | — | — | the official; the crisis twin's own claim |

**"Settlement governed by heads of household; decisions by informal consensus among property owners."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The heads of the households decide things between them, and nothing is settled until they agree. | — | — | the local; the seat's own claim (consensus of the heads of household) |
| 2 | Each household with property here has its head at the table, and decisions are made when they all agree. | — | — | the official; the seat's own claim (property owners, by consensus) |
| 3 | In a place this small the heads of the households simply talk things through until they agree; that is all the government there is. | `population: small` | — | the newcomer; a small place; the Household Council is the seat |
| 4 | No one rules alone here: the heads of the households decide together, by agreement among those who own property. | — | — | the official; the seat's own claim |

**"A headman settles disputes and speaks for the community."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Disputes are brought to the headman, and when the community must speak to outsiders, the headman speaks for it. | — | — | the official; the seat's own claim (one office: settle and speak) |
| 2 | People here take their quarrels to the headman, who also speaks for the community beyond it. | — | — | the local; the seat's own claim |
| 3 | The headman's word settles disputes here, and it is the headman who answers for the community to anyone from outside. | — | — | the traveller; the seat's own claim |
| 4 | In a place this small one person, the headman, settles the quarrels and speaks for everyone. | `population: small` | — | the newcomer; a small place |

**"The elders of the hamlet decide things together, and none of them rules alone."** (2 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | No single elder rules here; the elders of the hamlet decide things together. | — | — | the official; the seat's own claim |
| 2 | The hamlet's elders decide together, and none of them can settle anything alone. | — | — | the local; the seat's own claim |

**"One of the peasantry, elected by the rest, manages labour and mediates disputes, and answers to the people who chose them."** (2 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The reeve is one of the villagers, chosen by the rest; the reeve sees the work done and settles disputes, and answers to those who chose them. | — | — | the local; the twin's own claim (an elected reeve) |
| 2 | The villagers elect one of their own as reeve, to manage the common work and mediate quarrels; the reeve answers to them. | — | — | the official; the twin's own claim |

**"The village priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale."** (6 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | People here look to the church for guidance on worldly matters as well as faith; at this scale its moral authority is practical influence too. | `church` | — | the local; a church stands (faithReading hasChurch); the line's own claim |
| 2 | The church is where the most learned people in the place are found, and at this scale what it says carries into everything else. | `church` | — | the newcomer; a church stands; the line's own claim (the most educated) |
| 3 | In a place this small the faith's moral authority and its practical influence are one and the same. | `population: small` | — | the official; a small place; the line's own claim |
| 4 | The faith's moral authority here is practical influence too; people ask its advice on far more than prayer. | — | — | the local; the line's own claim |
| 5 | A newcomer soon finds that the faith's word counts here in practical matters as much as in prayer. | — | — | the newcomer; the line's own claim |
| 6 | Where there is little to go round, the faith's help and counsel count for a great deal, and its moral authority is practical influence too. | `prosperity: ≤ poor` | — | the local; Poor or below |

**"Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented."** (8 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Those who work magic here are hired and consulted, never given office; their say comes through their fees, and it is quietly resented. | — | — | the official; the line's own claim (the line prints only where practitioners work: settleArcaneToPractitioners) |
| 2 | No office here belongs to a mage; the practitioners are consulted when needed and paid for it, and their influence is quietly resented. | — | — | the official; the line's own claim |
| 3 | Magical practitioners sell their services here and are asked their opinion, but hold no office; what influence they have is advisory, transactional, and quietly resented. | — | — | the trade; the line's own claim |
| 4 | People go to the practitioners for what only magic can do and pay their price, but give them no say beyond it; the price is quietly resented. | — | — | the local; the line's own claim |
| 5 | Magic is bought here like any skilled work, and the practitioners' influence goes no further than their customers allow; it is quietly resented. | — | — | the trade; the line's own claim (transactional) |
| 6 | The council consults the mages when it needs them but gives them no seat; their influence is advisory and paid for, and quietly resented. | `ruling body` | — | the official; the seat is a body of more than one |
| 7 | In a place this large there is steady work for magical practitioners, but no office; their influence is advisory, paid for, and quietly resented. | `population: large` | — | the newcomer; a large place |
| 8 | There is money enough here to keep magical practitioners in work, though not in office; their influence is advisory, transactional, and quietly resented. | `prosperity: ≥ comfortable` | — | the trade; Comfortable or better |

**"Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited."** (9 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The priests are respected in their own sphere, but in the business of governing they count for little. | — | — | the official; the line's own claim |
| 2 | People go to the clergy for their souls and to others for everything else; their moral authority is real, but their political leverage is limited. | — | — | the local; the line's own claim |
| 3 | The clergy keep the church and the people's faith, but have little say in how the place is run. | `church` | — | the local; the place has a church |
| 4 | The clergy's word counts for more in church than in council; their moral authority is real, but their political leverage is limited. | `church`, `ruling body` | — | the official; a church; the seat is a body of more than one |
| 5 | Clergy and monks are part of daily life here, but stand at the edge of its politics; their moral authority is real, their leverage limited. | `institution: monastery` | — | the traveller; a monastery or friary stands |
| 6 | In a place this large the clergy are one voice among many, respected but seldom decisive. | `population: large` | — | the newcomer; a large place |
| 7 | The courts, not the clergy, settle the place's disputes; the clergy's authority is moral, and their political leverage limited. | `court sits` | — | the official; a court sits on the roster |
| 8 | The clergy have the people's respect but little of the hall's ear; their political leverage is limited. | — | — | the local; the line's own claim |
| 9 | The clergy are heard on matters of conscience, not on matters of trade or tax; their political leverage is limited. | — | — | the trade; the line's own claim |

**"The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops."** (5 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The craft masters set their own standards and take on their own apprentices, but outside the workshops few listen to them. | — | — | the local; the line's own claim |
| 2 | Each trade here looks after its own work and its own apprentices, and little beyond it. | — | — | the official; the line's own claim |
| 3 | The trades govern their own workshops and apprenticeships and little else; on wider matters they are seldom heard. | — | — | the official; the line's own claim |
| 4 | The guilds of the trades keep their own rules on work and apprentices; beyond that, their say is small. | `guild` | — | the trade; a guild stands |
| 5 | What the trades make is sold at the market on others' terms; inside the workshops they set the standards, outside them they carry little weight. | `market` | — | the trade; the place keeps a market |

**"Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The craft guilds set the rules for their own work and apprentices, and are a steady second voice in the place's affairs. | — | — | the official; the line's own claim |
| 2 | Craft masters regulate their own trades and train their own apprentices, and are reliably heard, if seldom first, in civic life. | — | — | the official; the line's own claim |
| 3 | Anyone who wants to learn a trade here goes through the craft guilds, which also hold a steady, secondary place in civic life. | — | — | the newcomer; the line's own claim (apprenticeships) |
| 4 | The craft guilds control what is made for the market and who may learn to make it; in civic matters they are a reliable second voice. | `market` | — | the trade; the place keeps a market |

**"Church institutions are well-embedded in civic life; their opinion on appointments, taxation, and law is sought and usually influential."** (6 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Few appointments, taxes or laws are settled here without first hearing the church, and its view usually carries. | `church` | — | the official; the line's own claim; a church stands |
| 2 | The church is woven into civic life here; on appointments, taxes and the law its opinion is asked for and usually heeded. | `church` | — | the local; the line's own claim; a church stands |
| 3 | The council asks the church's view on appointments, taxes and law, and usually follows it. | `church`, `ruling body` | — | the official; a church; the seat is a body of more than one |
| 4 | Anyone seeking an office or a change in the law here soon learns to ask the church first; its opinion is usually influential. | `church` | — | the newcomer; the line's own claim; a church stands |
| 5 | The faith's opinion is sought on appointments, taxes and the law here, and it is usually heeded. | — | — | the official; the line's own claim |
| 6 | In a place this size the church is part of civic life, and its opinion on appointments, taxes and law is sought and usually followed. | `church`, `population: middling` | — | the local; a church; a middling place (populationBand.js) |

**"Town watch; it enforces ordinances, manages disorder, and reports to the council."** (7 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The town watch keeps the ordinances and the peace, and answers to the council. | `watch`, `ruling body` | — | the official; the line's declared watch; the seat is a council |
| 2 | The watch keeps the streets and the walls, enforces the ordinances and answers to those who govern. | `watch`, `walls` | — | the watch; the watch; the place has walls |
| 3 | The watch makes the arrests and brings them before the court, and answers to those who govern. | `watch`, `court sits` | — | the official; the watch; a court sits |
| 4 | A paid watch enforces the ordinances and handles disorder, and answers to those who govern. | `watch`, `paid watch` | — | the watch; the watch; someone is paid to keep order (guardPay.js) |
| 5 | The watch keeps order in the streets and at the market, enforces the ordinances, and answers to those who govern. | `watch`, `market` | — | the local; the watch; the place keeps a market |
| 6 | The watch enforces the ordinances and deals with disorder, and answers to those who govern. | `watch` | — | the official; the line's declared watch |
| 7 | In a place this size the watch is the law most people meet: it enforces the ordinances, handles disorder and answers to those who govern. | `watch`, `population: middling` | — | the local; a middling place |

**"City watch; it answers for keeping order and is growing more sure of its own authority."** (6 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The city watch keeps order and knows it is needed, and it is growing more sure of its own authority. | `watch` | — | the official; the line's declared watch |
| 2 | The watch that keeps the streets and the walls is growing more sure of its own authority. | `watch`, `walls` | — | the watch; the place has walls |
| 3 | The watch brings lawbreakers in and the court deals with them; the watch is growing more sure of its own authority. | `watch`, `court sits` | — | the official; a court sits |
| 4 | Keeping order in a place this large falls to the watch, and it is growing more sure of its own authority. | `watch`, `population: large` | — | the local; a large place |
| 5 | The watch answers for order in the streets, and is more sure of its own authority than it used to be. | `watch` | — | the local; the line's own claim |
| 6 | Order inside the walls is the watch's to keep and the defence is the garrison's; the watch is growing more sure of its own authority. | `watch`, `walls`, `garrison` | — | the watch; walls and a garrison stand |

**"City watch; law enforcement and external defence, stretched between multiple responsibilities."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The city watch keeps the law in the streets and helps hold the walls, and is stretched between the two. | `watch`, `walls` | — | the watch; the place has walls |
| 2 | The watch keeps the law and shares the defence with the garrison, and is stretched between the two. | `watch`, `garrison` | — | the watch; a garrison stands |
| 3 | In a place this large the watch has the streets to police and the defence to see to, and is stretched between them. | `watch`, `population: large` | — | the local; a large place |
| 4 | The watch arrests for the court and stands to the defence when needed, stretched between the two. | `watch`, `court sits` | — | the official; a court sits |

**"A second armed company that wants a share of keeping order here, and of the say that goes with it."** (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | A second armed company; it wants a share of the policing here, and a voice to match. | — | — | the watch; the density law's own line (a second claimant on the niche) |
| 2 | A rival armed company that contests the established force's hold on keeping order here, and wants the say that goes with it. | — | — | the official; the density law's own line (contestsNiche) |
| 3 | In a place this large there is room for more than one armed company, and this one wants a share of keeping order and of the say that goes with it. | `population: large` | — | the local; a large place |

**"A mayor runs the town's day-to-day business."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The town's daily business is the mayor's to run. | — | — | the official; the seat's own claim (one office) |
| 2 | Anything that needs doing in the town goes to the mayor, who runs its day-to-day business. | — | — | the local; the seat's own claim |
| 3 | The mayor runs the town's day-to-day business, from the market to the streets. | `market` | — | the trade; the place keeps a market |
| 4 | The mayor sees to the town's day-to-day business; the hard cases go to the court. | `court sits` | — | the official; a court sits: the judging is not the mayor's (one hat) |

**"An elected or appointed council governs; merchants, guilds, and prominent families compete for seats."** (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The place is governed by its council, and its seats are sought by merchants, guild masters and the leading families. | — | — | the official; the seat's own claim |
| 2 | Seats on the council that governs here are prized, and merchants, guildsmen and the old families all compete for them. | — | — | the local; the seat's own claim |
| 3 | The council governs, and the guilds and the leading families both work to fill its seats. | `guild` | — | the trade; a guild stands |

**"The guilds govern together; the richer the guild, the more say it has."** (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The guilds govern together, and the richest of them have the most say. | — | — | the official; the seat's own claim |
| 2 | Government here is the guilds' together; a guild's say rises with its wealth. | — | — | the trade; the seat's own claim |
| 3 | The guilds that trade at the market also govern the place together, and the richer guilds speak loudest. | `market` | — | the local; the place keeps a market |

**"A full council governs the city: aldermen, guild masters and appointed officials see to its taxes, its laws and its streets."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Taxes, laws and street repairs all come from the city council, a body of aldermen, guild masters and appointed officials. | — | — | the local; the seat's own claim |
| 2 | A full council of aldermen, guild masters and appointed officials governs the city; it sets the taxes and the laws, and the courts judge by them. | `court sits` | — | the official; a court sits |
| 3 | The city council, aldermen, guild masters and officials together, keeps the taxes, the laws, the streets and the walls. | `walls` | — | the watch; the place has walls |
| 4 | The council of aldermen, guild masters and officials governs the city, from the taxes and laws down to the streets and the market. | `market` | — | the trade; the place keeps a market |

**"A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; the council is always split into camps, and real power shifts between blocs."** (2 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The metropolis is governed by a grand council of officials, guild masters and appointed magnates, divided into camps; power moves between them. | — | — | the official; the seat's own claim |
| 2 | Senior officials, guild masters and appointed magnates sit together on the grand council that governs; its camps rarely agree, and the balance between them keeps shifting. | — | — | the local; the seat's own claim |

**"A formal consortium of the metropolis's most powerful guild masters holds civic authority; membership in the consortium is itself a prize."** (2 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The most powerful guild masters govern together as a formal consortium, and a place in it is much sought after. | — | — | the official; the seat's own claim |
| 2 | Civic authority belongs to a consortium of the leading guild masters; to join it is the ambition of many a lesser guild. | `guild` | — | the trade; a guild stands |

**"Minor landed families with limited political reach; present in civic life but rarely decisive."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The landed families here are part of civic life, but their reach is limited and their voice rarely decides anything. | — | — | the local; the line's own claim |
| 2 | Old landed families with modest holdings; they take part in civic affairs, but are seldom the ones who settle them. | — | — | the official; the line's own claim |
| 3 | Landed families of no great weight: present in civic life, rarely decisive in it. | — | — | the official; the line's own claim |
| 4 | In a place this large the old landed families are a minor voice; they take part in civic life but rarely decide it. | `population: large` | — | the newcomer; a large place |

**"Established merchant community; fund civic works and expect council access in return."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The established merchants pay toward civic works and expect a hearing at the council in return. | — | — | the official; the line's own claim (claimStanding.js keeps the council's word only where a council sits) |
| 2 | A settled merchant community that helps pay for civic works and, in return, expects the council to listen. | — | — | the local; the line's own claim |
| 3 | The merchants who keep the market are well established; they fund civic works and expect the council's ear in return. | `market` | — | the trade; the place keeps a market |
| 4 | Merchants long established in what the place sends out; they help pay for civic works and expect access to the council in return. | `exports` | — | the trade; the place has an export list |

**"Established merchant community; fund civic works and expect access to the hall in return."** (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | The established merchants pay toward civic works and expect a hearing in the hall in return. | — | — | the official; the line's own claim (the hall: no council sits, SEAT_WORDS) |
| 2 | A settled merchant community that helps pay for civic works and, in return, expects the hall to listen. | — | — | the local; the line's own claim |
| 3 | The merchants who keep the market are well established; they fund civic works and expect the hall's ear in return. | `market` | — | the trade; the place keeps a market |
| 4 | Merchants long established in what the place sends out; they help pay for civic works and expect access to the hall in return. | `exports` | — | the trade; the place has an export list |

**"A consortium of guild masters holds power; policy is shaped by trade interests and inter-guild bargaining."** (2 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Guild masters govern together here; policy follows trade, and is settled by bargaining between the guilds. | — | — | the official; the seat's own claim |
| 2 | The guild masters who govern decide policy by the needs of trade and by what the guilds can agree among themselves. | — | — | the trade; the seat's own claim |

#### The standing codas (the second, separable step)

**coda `atTable`**: `They are always at the table, but cannot set their own terms\.` (4 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | They are part of every bargain, but never the ones who set its terms. | — | — | the official; the coda's own claim (rank 2, gaps as the writer reads them) |
| 2 | Nothing is settled without them in the room, and nothing on their terms alone. | — | — | the local; the coda's own claim |
| 3 | They are always consulted, and seldom get their own way. | — | — | the newcomer; the coda's own claim |
| 4 | They always have a voice when the council bargains, but never the deciding one. | `ruling body` | — | the official; the seat is a body of more than one |

**coda `bodiesMinds`**: `They and the religious authorities both keep people in line\. The ([a-z ]+?) deals with bodies and the clergy with minds, and each wishes the other would keep quieter\.` (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | They and the clergy both keep order, one in the streets and one in people's heads, and each would like the other to say less. | — | — | the local; the coda's own claim |
| 2 | The $1 keeps order with its hands and the clergy with their sermons; each finds the other too loud. | — | — | the watch; the coda's own claim; the force word it already carries |
| 3 | Between them, the $1 and the religious authorities keep people in line, the one by force and the other by conscience, and neither enjoys sharing the work. | — | — | the official; the coda's own claim |

**coda `arcaneInShadow`**: `The arcane orders are present but operate in the clergy's shadow\. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved\.` (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | The arcane orders work in the clergy's shadow here, and no one has settled which magic the faith allows and which it does not. | — | — | the local; the coda's own claim |
| 2 | The clergy stand above the arcane orders here; what counts as permitted magic and what as heresy is left, on purpose, unsaid. | — | — | the official; the coda's own claim |
| 3 | The church outweighs the arcane orders here, and leaves the line between sanctioned magic and heresy undrawn, by choice. | `church` | — | the newcomer; a church stands |

**coda `clergyAhead`**: `The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly\.` (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | With the clergy ahead of them in public affairs, the arcane orders keep out of their way and never cross them openly. | — | — | the official; the coda's own claim |
| 2 | The arcane orders defer to the clergy in public and pursue their own business quietly. | — | — | the local; the coda's own claim |
| 3 | Where the church speaks on public matters, the arcane orders keep silent and go their own way around it. | `church` | — | the newcomer; a church stands |

**coda `outvoted`**: `The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal\.` (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | On prices and labour the merchants outvote them every time, so the craft masters bargain for what they can, deal by deal. | — | — | the trade; the coda's own claim |
| 2 | Outvoted on prices and on the terms of work, the craft masters fight their corner in the small print of each deal. | — | — | the official; the coda's own claim |
| 3 | The merchants decide the prices at the market and the terms of work; the craft masters win what they can by adding conditions to each deal. | `market` | — | the trade; the place keeps a market |

**coda `outpaced`**: `The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not\.` (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | The craft guilds have a voice, but a smaller one: the merchants set prices, the craft masters object, and the merchants usually prevail. | — | — | the official; the coda's own claim |
| 2 | Merchants set the prices and the craft guilds argue; more often than not, the merchants win. | — | — | the local; the coda's own claim |
| 3 | At the market the merchants set the prices, the craft masters object, and the merchants win more often than not. | `market` | — | the trade; the place keeps a market |

**coda `worthBuying`**: `Close enough to the two above that their support is worth buying; they play (.+?) and (.+?) against each other when they can\.` (2 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | Third in weight, they sell their support dearly, and play $1 and $2 against each other whenever they can. | — | — | the official; the coda's own claim (the third power, as the writer ranks it) |
| 2 | Their support is worth buying, and both $1 and $2 know it; they play one against the other when they can. | — | — | the local; the coda's own claim |

**coda `inShadow`**: `They operate in the shadow of (.+?), close enough to matter and too far behind to lead\.` (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | Second to $1, they matter, but they are too far behind to lead. | — | — | the official; the coda's own claim (rank 1) |
| 2 | They count for something here, but $1 counts for more, and the gap is too wide to close. | — | — | the local; the coda's own claim |
| 3 | Close enough to $1 to matter, not close enough to lead. | — | — | the newcomer; the coda's own claim |

**coda `narrowGap`**: `The gap between them and (.+?) is narrow\. A single shift in patronage, scandal, or armed muscle could swap their positions\.` (3 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | Only a little separates them from $1; one change of patron, one scandal or one show of force could reverse the order. | — | — | the official; the coda's own claim |
| 2 | They stand just behind $1, near enough that a single scandal or a lost patron could put them ahead. | — | — | the local; the coda's own claim |
| 3 | $1 leads them, but narrowly; the order of the two could turn on one scandal or one change of allegiance. | — | — | the newcomer; the coda's own claim |

**coda `closingGap`**: `The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down\.` (2 new)

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 0 | the coda as it stands | — | — | canonical-at-zero |
| 1 | Merchant money is catching up with them, and the noble families use every law and every connection they have to hold it back. | — | — | the official; the coda's own claim |
| 2 | The noble families feel the merchants closing on them, and use law and connection alike to slow them. | — | — | the local; the coda's own claim |

## 5. Projected top share by size (100 places a size; `measures/m4-measure.out.txt`, SUMMARY)

| | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| **today**: the leaf (the instrument's unit) | 41% | 35% | 41% | 34% | 38% | 86% |
| **A: the openings pooled**: the leaf | 10% | 10% | 12% | 10% | 14% | 14% |
| A: the commonest opening wording | 8% | 7% | 14% | 15% | 16% | 18% |
| A+B: openings and codas pooled: the leaf | 10% | 10% | 12% | 9% | 14% | 11% |
| today: by the sentence | 41% | 35% | 74% | 80% | 79% | 98% |
| A: by the sentence | 10% | 10% | 22% | 52% | 71% | 98% |
| **A+B: by the sentence** | 10% | 10% | 14% | 17% | 24% | 25% |

**The commonest projected sentence, step A (the leaf):**

| size | share | sentence |
|---|---|---|
| thorp | 10% | Respected elders guide the community; authority is moral and traditional rather than formal. (unpooled: the elder label house's line) |
| hamlet | 10% | A lord's steward administers the settlement; authority flows downward from the noble, not upward from residents. (unpooled) |
| village | 12% | The oldest heads of the community decide things together, from what the place sends out to how a quarrel is settled; people follow them out of respect and custom, not law. |
| town | 10% | The craft guilds control what is made for the market and who may learn to make it; in civic matters they are a reliable second voice. The merchants consistently outvote them … |
| city | 14% | Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice. (unpooled: `claimStanding.js :: LOCAL_MERCHANTS`) |
| metropolis | 14% | In a place this large there is steady work for magical practitioners, but no office; their influence is advisory, paid for, and quietly resented. The clergy have more say in public affairs, … |

**What is left over the bar by the sentence after A+B** (the measure's `sentence over the bar` lines):

| size | the commonest sentences left over 15% |
|---|---|
| town | 17%: one coda variant ("Their support is worth buying …") and the clergy-and-force coda's first variant |
| city | 24%: `LOCAL_MERCHANTS` (unpooled); 17–19%: the nobles' lines "Landed families increasingly outpaced …" and "Noble families with hereditary land rights …" (unpooled); the four-way codas at 16–19% |
| metropolis | 25%: the arcane, clergy-ahead and clergy-and-force codas, each split four ways over 90–98% of places; 22%: "Still ahead of merchant interests in real influence, for now." and the nobles' "Noble families with hereditary land rights …" (unpooled) |

**Under the sentence unit, the larger sizes need more:**
- **seven or more wordings for each of the six heaviest codas.** Each prints in 90–98% of metropolises, so four ways cannot go below about 24%;
- **pools for five more lines:** `LOCAL_MERCHANTS`, the two noble ladder lines, the nobles-ahead coda, and the Grand Merchant Oligarchy's seat line (19%).

That is authoring, not a new mechanism. I did not write it, because the unit is the chair's ruling (§6.3), and under the instrument's leaf the bar is already met.

**Where the projection approximates the code path:**
1. It reads the facts and the descriptions on the FINAL record. That is exact for the pass §6.1 proposes. The codas are matched by their own words, which carry the names and the force word they already printed.
2. The atoms are read by `m4-common.mjs :: atomHolds` over cached facts (the vocabulary's homes).
3. A power whose description opens with an unpooled line is never varied.
4. At 100 places a size, about 3 places is noise. 14–15% sits at the bar.

## 6. What I could not settle, and what the integrator or the chair must rule

1. **WHERE THE ONE CALL LINE GOES (the chair's note of 16:30).**
   - **The same file and the same function as the narratives:** `src/data/powerLineVariants.js :: voicePowerLines(record)` voices the openings, then the codas, then the relation rows.
   - **The line I recommend** is in `src/generators/generateSettlementPipeline.js`, directly after the `withConflictRelations` line: `voicePowerLines(finalCtx.settlement);`.
   - **It must run after `settleClergyToFinalRoster` and `settleArcaneToPractitioners`.** Both match the openings by their text, and the arcane twin names no practitioner. A variant written before them would escape the twin and name practitioners where none work. That is false.
   - **In `claimStanding.js`, the only host is the end of `settleArcaneToPractitioners`**, with its early `return` turned into a guarded block: two lines in that file, not one. **The chair rules.**
2. **A presumption today's line already makes (reported, not mine to fix).** "The village priest is the most educated person for miles; …" prints in 74 of 100 villages. The vocabulary's `priest` atom (`faithReadingOf(record).seniorCleric`) is **false in all 74**: the record holds a church in every one, and no cleric on the roster. No proposed wording names a priest; they say "the church" or "the faith". Whether index 0 itself takes a twin is the faith lane's and the chair's question.
3. **THE UNIT OF THE BAR.**
   - The instrument counts the stored leaf, and step A meets the bar at every size (≤ 14%).
   - Read by the sentence, the codas keep town, city and metropolis at 17–25% even with step B, and at 52–98% without it.
   - **The chair rules whether step B ships with A** (it is in the same file and the same pass), and whether the larger sizes' codas take seven wordings each.
4. **No ATOM is asked.** The wordings need only vocabulary atoms: `population`, `exports`, `court sits`, `legal house`, `church`, `prosperity`, `ruling body`, `institution: monastery`, `market`, `guild`, `watch`, `walls`, `garrison`, `paid watch`. The record holds no count of a hamlet's households, so none is asked.
5. **The scope at the larger sizes.** The brief named the small sizes. On the chair's note of 16:30, every size is proposed.
   - The town-and-up pools (from "Church institutions are well-embedded …" on) are separable.
   - Dropping them puts town back at 34%, city at 38% and metropolis at 86% on the leaf.
6. **What a change by the holding lanes could move:**
   - **The who-rules lane:** every seat line follows the seat's name (`governanceLabelMap`, `GOV_DESC_OF_UNNAMED_SEAT`, the occupied twin). A change there moves which seat pool a place draws from, and could add seat lines §2 does not hold.
   - **The fortune lane:** the other powers' openings follow their raw power and their final label (`CLAIM_RUNGS`), and the codas follow the ranks and gaps. A change to the power figures or the multipliers moves the shares in §2 and which codas print.
   - **No pool is made false by either.** Each wording needs only what its own line and its atoms hold. The re-measure is one run of `m4-measure.mjs`.
7. **The golden master moves** on every born town whose pick leaves index 0 (the owner's signed door). The seeded tests named in §3 are re-keyed by identity in the same change. `law14K` (14a) is read once by the integrator.
