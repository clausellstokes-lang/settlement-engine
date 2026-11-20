# PROPOSAL — `powerStructure.factionRelationships[].narrative` (PEOPLE-1, measuring seat M4, 2026-11-20)

Base `01351d72d` (a docs-only child of the working line `43ab0f5eb`: `git diff 43ab0f5eb 01351d72d -- src` is empty). Measured on 100 places a size, the six sizes, born exactly as the chair's instrument births them (`hxd-<size>-<i>`, the same name mask). Scripts and their count lines: `measures/m4-births.mjs` (+ `.out.txt`), `measures/m4-measure.mjs` (+ `.out.txt`), the shared classifier and atom reader `measures/m4-common.mjs`, the proposed pools as data `measures/m4-pools.mjs` (`RELATION_POOLS`). Nothing under `src/`, `tests/`, `scripts/` was changed.

**The answer first.** The field breaks the bar at every size that holds it, from 66% of villages to 90% of metropolises. The fault is not one line. Twelve branches each print in more than 15% of some size. Under the proposal, 15 pools of 3 to 11 wordings are read from the pair's own facts and picked by keyed hash with no draw. That brings the commonest sentence to **13% (village), 14% (town), 12% (city), 14% (metropolis)**. Every atom a wording needs is already in the vocabulary: **no ATOM is asked**. The build is one new data file and one call line (§6, item 1, answers the chair's 16:30 note).

**Where it prints.** The Power tab: `src/components/new/tabs/power/PowerStrata.jsx` prints `e.narrative` under each tie, and the rows are read through `src/domain/dossier/powerStrata.js`. SAME-1's render of 300 places shows it printed from village up. A thorp holds a relation row in 3 places of 100 and a hamlet in 19.

## 1. The function

`src/generators/factionDynamics.js :: computeFactionRelationships` writes every row once, at the power step. It is called from `src/generators/power/rulingStructure.js :: generatePowerStructure` with the roster after `applyLegitimacyMultipliers`. **No row is drawn.** The pair is found by name and category keywords (`find`, `findNonGov`). The kind and the line are chosen by the ratio of the two powers' final shares, so both follow the power figures and consume no random number. A keyed-hash pool therefore changes no draw, and nothing else in a born town moves.

The branches, each by its condition:

- **Seat and force** (`gov && mil`; ratio = force / seat):
  - **GM.sub**, ratio ≤ 0.5: "{force} carries out what {seat} decides." The writer adds " The soldiers enforce the law; they do not make it." where a garrison or a hired company stands (`soldiersStand`); that form is **GM.sub+soldiers**.
  - **GM.sym**, ≤ 0.85: "… gives the orders and … carries them out; each needs the other to stay strong."
  - **GM.tense**, ≤ 1.2: "… is now about as strong as …"
  - **GM.comp**, above 1.2: "… no longer takes orders from …". It adds "keeps the title …" only where the force is the strongest power.
  - **GM.occ**: an occupation's appointed power (`STRESS_POWER_FACES`): "{seat} carries out what {occupier} decides."
- **Seat and merchants** (ratio = merchants / seat):
  - **GE.comp**, ≥ 1.2: "Day-to-day trade here is run by …". The taxes clause is dropped under an occupation.
  - **GE.dep**, ≥ 0.6: "… needs the taxes and loans of …"
  - **GE.sub**, otherwise: "… work under the rules … sets, and pay for a hearing in the hall …"
- **Seat and faith**:
  - **GR.theo**: the seat is the church itself.
  - **GR.tense**, ratio ≥ 1.1: "People take their marriages, inheritances and hard times to …"
  - **GR.dep**, ≥ 0.5: "… holds the seat and collects the taxes; … tell people that …'s rule is right and ordained. Each props up the other." The taxes clause is dropped under an occupation.
  - The subordinate line is computed but **not drawn** (R3-CODE-C-9).
- **Seat and underworld**, **underworld and force**: `govCriminalRelation` and `criminalMilitaryRelation`, by the capture rung. These rows are **rebuilt** from the hall-capture state by `withCaptureRelations` (narrativeGenerator.js). They are not pooled here; they print in at most 5 places of a size.
- **Merchants and craft** (ratio = merchants / craft):
  - **MC.comp**, ≥ 1.8.
  - **MC.vote-against** and **MC.vote**, ≥ 0.7: the `MERCHANT_CRAFT_VOTE` pair, "against {landholders}" where a noble power stands, else "whenever trade is at stake".
  - **MC.masters**, otherwise.
- **Merchants and faith**, town and above:
  - **MR.tense**: merchants ≥ 20 and faith ≥ 15.
  - **MR.comp**: merchants > 1.5 × faith.
  - **MR.dep**, otherwise: "The money of … pays for the charity of …"
- **Old families and seat**: tense, dependent or subordinate by ratio and by whether the old families stand at Suppressed.
  - **NG.dep** says "(land, courts, levies)", with courts only where a court sits.
  - **NG.sub** says "merchant money and" only where a merchant power outranks the old families.
  - The subordinate line is not drawn of the indebted crisis's creditor.

**The later writers of the field**, all of them at birth:

- `power/rosterText.js :: settleNarrativesToRoster` (assembly) takes the vote's sibling where the density law trimmed the landholders.
- `narrativeGenerator.js :: withCaptureRelations` rebuilds the capture rows.
- `factionDynamics.js :: withConflictRelations`, the last call in `generateSettlementPipeline`, gives a pair the conflicts name its **twin**:
  - a symbiotic or dependent row gains "Even so, the two are now at odds over {issue}.";
  - the ordained-seat line takes its own twin;
  - the vote takes `atOdds`.

  The section regen (`generateSettlementPipeline.js`, the cast regen) calls it again with the newly drawn quarrels.
- `domain/rulingPower.js` writes two new rows on a transfer of power, at play time.

## 2. Today's branches and top share (100 places a size; places · entries)

Every branch on more than 10 places at some size. Full table: `measures/m4-measure.out.txt`, `branch … narrative` lines. "(+twin)" is the conflict twin, which is not pooled.

| branch | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| MR.dep | – | – | – | 41·41 | 71·71 | 90·90 |
| GE.sub | – | – | – | 2·2 | 48·48 | 78·78 |
| GR.dep | – | – | 20·20 | 61·61 | 39·39 | 19·19 |
| GM.sub+soldiers | – | – | – | 4·4 | 37·37 | 59·59 |
| NG.sub | – | – | – | – | 26·26 | 49·49 |
| GE.dep | – | 1·1 | 10·10 | 48·48 | 11·11 | 4·4 |
| GE.dep (+twin) | – | 1·1 | 3·3 | 30·30 | 31·31 | 10·10 |
| GR.tense | – | – | 64·64 | 20·20 | 5·5 | 9·9 |
| MR.tense | – | – | – | 35·35 | – | – |
| GM.sym | – | 2·2 | 2·2 | 25·25 | 26·26 | 18·18 |
| GM.sym (+twin) | – | – | 1·1 | 8·8 | 20·20 | 8·8 |
| MC.vote-against | – | – | – | 1·1 | 7·7 | 30·30 |
| MC.vote | – | – | – | 19·19 | 2·2 | 11·11 |
| MC.atOdds (twin) | – | – | – | 16·16 | 8·8 | 17·17 |
| NG.dep | – | – | – | – | 13·13 | 20·20 |
| GM.sub | – | 3·3 | 1·1 | 15·15 | – | – |
| GM.tense | – | 4·4 | 2·2 | 5·5 | 3·3 | 3·3 |
| GM.occ | 2·2 | 3·3 | 1·1 | 1·1 | 1·1 | – |
| places holding the field | 3 | 19 | 97 | 100 | 100 | 100 |

**Top sentence today** (places printing it / places holding the field):

| size | top | sentence |
|---|---|---|
| thorp | 2/3 (67%) | The # carries out what the # decides. (GM.occ, the occupation's line) |
| hamlet | 5/19 (26%) | The # carries out what the # decides. (GM.occ and GM.sub) |
| village | 64/97 (66%) | People take their marriages, inheritances and hard times to the #, not to the #, and the two do not agree on who decides what. |
| town | 61/100 (61%) | The # holds the seat and collects the taxes; the # tell people that the #'s rule is right and ordained. Each props up the other. |
| city | 71/100 (71%) | The money of the # pays for the charity of the #, and the charity keeps the poor quiet. Each needs the other, and neither likes it. |
| metropolis | 90/100 (90%) | (the same) |

These agree with the chair's 50-place figures (36/50 cities, 46/50 metropolises, 29/50 towns, 33/50 villages) and with SAME-1's 300 (66/76/76/98%).

## 3. The readers

| path :: symbol | kind | what breaks if the words change |
|---|---|---|
| `src/components/new/tabs/power/PowerStrata.jsx` (`e.narrative` under each tie) through `src/domain/dossier/powerStrata.js` (the edges' read-model: `narrative` kept as a string) | PRINTS (web, the Power tab) | nothing: the words are printed as they stand |
| `scripts/.writer-reach-baseline.json` ("narrative on factionRelationships": every surface N) | records reach | nothing. The baseline's scanner does not see the read-model reduction; SAME-1's render shows the tab printing it. The integrator may ask whether the baseline should read R for web-display |
| `src/domain/dossier/powerStrata.js :: relationNamesDecider` | reads the pair, not the words | nothing |
| `src/domain/display/governanceAccount.js`, `src/domain/display/publicSafe.js`, `src/domain/display/galleryVeil.js` | read the rows' type, captureState and pair | nothing (capture rows are not pooled) |
| `src/domain/factionRename.js` (`${PAIRWISE}.narrative`, kind prose: whole-word name rewrite) | COMPOSES (rewrites the names inside any text) | nothing: every wording names the powers by their article forms, as today |
| `src/domain/rulingPower.js` (re-keys pairs; writes its own two rows on a transfer) | composes its own rows | nothing |
| `src/generators/factionDynamics.js :: withConflictRelations` (`MERCHANT_CRAFT_VOTE.sibling` by equality, the `… vote together against ` opening, `ORDAINED_SEAT` regex) | MATCHES ITS WORDS | **at birth nothing**: the proposed pass runs after it (§6.1), and a row it twinned is never varied. **On the cast regen** (`generateSettlementPipeline.js`, the `withConflictRelations(hallStructure, drawnQuarrels)` line), a stored vote variant is not recognised and would keep "vote together" beside a new quarrel. That is false. A stored ordained-seat variant falls to the generic "Even so" twin, which is true. **The cure:** the vote matcher reads the pool (membership of `MC.vote` / `MC.vote-against`). That is one more line in `factionDynamics.js`, which §6.1 asks the chair to grant |
| `src/generators/power/rosterText.js :: settleNarrativesToRoster` (equality with `MERCHANT_CRAFT_VOTE.against`) | MATCHES | nothing: it runs at assembly, before the pass |
| `src/generators/factionDynamics.js :: boycottReadsRelation` | reads type, direction and pair | nothing |
| `src/generators/factionDynamics.js :: withCaptureRelations` | rebuilds capture rows | nothing (not pooled) |
| `tests/generators/relationLinesSayTheRecord.test.js` (seeded `r2r-hamlet-3`, `r2r-hamlet-5`, `r2r-metropolis-39`; unit rows on `computeFactionRelationships`) | MATCHES ITS WORDS | the unit rows: nothing (no seed, index 0). The seeded rows go red where the pick leaves index 0. **Re-key by identity** (the house practice) |
| `tests/generators/powersReadTheRosterP31.test.js` (`r2r-town-29`, `r2r-town-34`, `r2r-metropolis-15`, `r2r-village-0`: the vote and the ordained twin) | MATCHES | the KEEP row on `r2r-village-0` ("vote together whenever trade is at stake") goes red if its pick moves: re-key. The twin rows: nothing (twins are not varied) |
| `tests/generators/bar3PowersLines.test.js` (`r2r-town-1`, `r2r-village-7`: "Each props up the other.") | MATCHES | `r2r-village-7` KEEP goes red if its GR.dep pick moves: re-key. Every GR.dep wording keeps "Each props up the other." |
| `tests/generators/conflictRelationsTwin.test.js` (KEEP `/gives the orders and the Guard carries them out/`, seeded) | MATCHES | red if that row's GM.sym pick moves: re-key |
| `tests/generators/placeNotTierDefence.test.js` (`LINE` the soldiers sentence absent where no soldiers; one seeded `toBe('The Guard carries out what the Town Council decides.')`) | MATCHES (presence and absence) | absence: nothing, since every wording naming soldiers declares `soldiers`. The seeded `toBe`: re-key if its pick moves |
| `tests/generators/occupierRelationLine.test.js`, `tests/generators/power/bar2PeoplePowers.test.js`, `tests/helpers/pageLaws/law7x.mjs`, `tests/domain/bar7DesksLines.test.js` ("carries out what … decides" of the occupier) | MATCHES | nothing: GM.occ is not pooled |
| `tests/generators/faultsWatch.test.js` ("keeps enough rights of its own (land, courts, levies)", seeded) | MATCHES | red if its NG.dep pick moves: re-key. The courts-twin law holds: the one wording naming courts declares `court sits` |
| `tests/domain/r3c8ReaderLinesTrue.test.js`, `tests/generators/bar3PeoplePowers.test.js` | MATCHES (number agreement, decider) | number agreement: every wording takes `{X\|one\|many}` from the writer's own `verb`. Re-key a seeded row if its pick moves |
| `tests/lint/presumptionClasses.register.json`, `tests/lint/presumedThings.register.json` (`factionDynamics.js` rows: "office", "temple" on the money and tithe lines) | MATCHES (the presumption walkers, keyed on the source text) | the new data file's literals are walked: each wording carries its `needs` in the drawDeclared shape (`{ text, needs, excludes }`) so the walker reads them. The registers gain the new file's rows, or shrink where a declared need answers the class. The integrator re-records them |
| `tests/property/generatorGoldenMaster.test.js` | hashes every text leaf | rows move on every born town whose pick leaves index 0. The owner's signed door |
| `supabase/functions/_shared/engineBundle.js` | a built copy | rebuilt with the engine; the deploy's, the owner's hand |

Nothing COMPOSES a further sentence from the narrative. The dossier's notes read the pair, not the words.

## 4. The candidate wordings, by branch

**The rules for every pool below:**
- Index 0 is today's exact line.
- The pick is `pickVariant([today, ...eligible], '<record _seed>::powerStructure.factionRelationships.narrative::<pair, sorted, joined by ||>')`. It is a keyed hash with no draw. A wording is eligible only where its `needs` hold and its `excludes` do not, read by `factVocabulary.js`'s own atoms over `factsOf` on the final record.
- **Every wording keeps its branch's kind and claim.** A dependent row still says each needs the other; a subordinate one, who decides; a tense one, that the two do not agree. Each changes only the vantage (the style law §8: the official, the local, the trade, the traveller, the newcomer, the watch) or names a house the record holds.
- **No wording adds a quarrel, a custom, a count or a season.**
- **The goods are never named.** The export lists hold "Transit trade", "Ship passage" and "Water rights", which no good-slot reads cleanly, so the trade is said as "what the place sends out" and needs only the `exports` atom.
- **A pair the conflicts name is never varied**: its twin stands.
- **The guards each wording passed** (run by the measure, 0 misses): no season or climate word; no machinery word ("faction", "ratio", "power share", a per cent); at most 45 words; no "soldiers" without `soldiers`; no "courts" without `court sits`.
- **The proposed data file is `src/data/powerLineVariants.js`** (`RELATION_POOLS`, keyed by branch, the `NG.sub` pool split by the writer's own merchant clause).

**`MR.dep`** (11 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {R} could not keep up the faith's charity without the gifts of {M}, and {M} would have more trouble from the poor without it. Each needs the other, and neither likes it. | — | — | the official; the branch's own bargain, from the faith's side |
| 2 | {R} {R\|feeds\|feed} the poor here, and {M} {M\|pays\|pay} for it; the poor stay quiet. Each needs the other, and neither likes it. | — | — | the local; the branch's own bargain, said as who does what |
| 3 | {M} {M\|gives\|give} to the church, {R} {R\|gives\|give} to the poor, and the poor stay quiet. Each needs the other, and neither likes it. | `church` | — | the local; the place has a church (the faith reading's hasChurch): the charity named by its house |
| 4 | {M} {M\|gives\|give} to the hospital and to the alms of {R}; the sick and the poor are looked after, and the streets stay quiet. Each needs the other, and neither likes it. | `hospital` | — | the official; a hospital stands (defence.js hospital): the charity read from its house, as the brief directs |
| 5 | What {M} {M\|earns\|earn} at the market pays for the charity of {R}, and the charity keeps the poor off the merchants' doorsteps. Each needs the other, and neither likes it. | `market` | — | the trade; the place keeps a market (market.js): the merchants' money read from it |
| 6 | {M} {M\|makes\|make} {M\|its\|their} money on what the place sends out and brings in, and part of it goes to {R} for the poor. Each needs the other, and neither likes it. | `exports`, `imports` | — | the trade; the place has an export and an import list (canonExports, canonImports): the merchants' trade, unnamed |
| 7 | The poor fed at the monastery and the church are fed on merchant money, and {R} and {M} both know it. Each needs the other, and neither likes it. | `institution: monastery`, `church` | — | the local; a monastery or friary and a church stand: the faith's charity read from its houses |
| 8 | In a place this well off, {M} can spare coin for the charity of {R}, and {M\|does\|do}, because the charity keeps the poor quiet. Each needs the other, and neither likes it. | `prosperity: ≥ comfortable` | — | the trade; Comfortable or better (prosperityRank.js): the purse can spare it |
| 9 | There is little coin to spare here, and what {R} {R\|gives\|give} the poor comes mostly from {M}. Each needs the other, and neither likes it. | `prosperity: ≤ moderate` | — | the official; Moderate or below: little to spare |
| 10 | {M} {M\|pays\|pay}, {R} {R\|gives\|give}, and the poor take what is given and keep the peace. Each needs the other, and neither likes it. | — | — | the local; the branch's own bargain, said as who does what |
| 11 | In a place this large the faith's charity costs more than the faith has, and {M} {M\|makes\|make} up the rest; the poor stay quiet. Each needs the other, and neither likes it. | `population: large` | — | the official; a large place |

**`GE.sub`** (7 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {M} {M\|makes\|make} the money, but {G} {G\|makes\|make} the rules, and a hearing in the hall costs {M} something every time. | — | — | the trade; the branch's own claim (the rules are the seat's; a hearing is paid for) |
| 2 | {M} {M\|trades\|trade} on the terms {G} {G\|sets\|set}, and when {M\|it wants\|they want} them changed, {M\|it\|they} must pay to be heard in the hall. | — | — | the official; the branch's own claim, from the seat's side |
| 3 | What {M} {M\|sends\|send} out of the place goes out under the rules {G} {G\|sets\|set}; {M} can ask for better terms, not set {M\|its\|their} own. | `exports` | — | the trade; the place has an export list: the merchants' trade, unnamed |
| 4 | When merchants quarrel over a contract here, the court settles it, not {M}; {M} {M\|works\|work} under the rules {G} {G\|sets\|set}. | `court sits` | — | the official; a court sits on the roster (courtHoldersOf): the judging is not the merchants' |
| 5 | {M} {M\|does\|do} well here, but on the hall's terms: {G} {G\|sets\|set} the rules, and {M} {M\|pays\|pay} to be heard. | `prosperity: ≥ comfortable` | — | the local; Comfortable or better: the merchants do well |
| 6 | Every cargo that comes over the docks is landed under the rules {G} {G\|sets\|set}; {M} {M\|pays\|pay} for a hearing when {M\|it wants\|they want} them changed. | `docks` | — | the traveller; docks stand (institutions.js docks): the trade read from them |
| 7 | Loans and debts here are written under the law {G} {G\|sets\|set}, and {M} {M\|pays\|pay} for a hearing in the hall when {M\|it wants\|they want} that law changed. | `institution: bank` | — | the trade; a bank stands (institutions.js bank): the merchants' lending read from it |

**`GM.sub+soldiers`** (6 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {Mil} answers to {G} for what it does; the soldiers enforce what the hall decides, and do not decide it. | `soldiers` | — | the official; the branch's own claim; soldiers stand (the writer's own soldiersStand gate is this atom) |
| 2 | Ask who gives the orders here and the answer is {G}; {Mil} carries them out, and the soldiers do not make the law. | `soldiers` | — | the traveller; the branch's own claim, as a visitor hears it |
| 3 | {G} {G\|decides\|decide}, and {Mil} carries it out; the garrison's officers take their orders from the hall, not the other way round. | `garrison` | — | the watch; a garrison stands, and with it its command (the commander atom's own reading) |
| 4 | {Mil} keeps the walls on {G's} orders and has no say in what those orders are; the soldiers enforce the law, they do not make it. | `walls`, `soldiers` | — | the watch; the place has walls (the perimeter, defence.js): the force's ground named |
| 5 | {Mil} makes the arrests, and the court and {G} decide what comes of them; the soldiers enforce the law, they do not make it. | `court sits`, `soldiers` | — | the official; a court sits: the judging is the court's, the law the seat's |
| 6 | In a place this size {Mil} has many streets to keep, and keeps them on {G's} orders, not its own; the soldiers enforce the law, they do not make it. | `population: large`, `soldiers` | — | the local; a large place (populationBand.js) |

**`GM.sub`** (3 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {Mil} answers to {G} for what it does; it enforces what the hall decides, and does not decide it. | — | — | the official; the branch's own claim |
| 2 | Ask who gives the orders here and the answer is {G}; {Mil} carries them out. | — | — | the traveller; the branch's own claim, as a visitor hears it |
| 3 | {Mil} keeps the walls on {G's} orders and has no say in what those orders are. | `walls` | — | the watch; the place has walls |

**`GM.sym`** (7 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {G} cannot keep order without {Mil}, and {Mil} has its standing from {G}; each needs the other to stay strong. | — | — | the official; the branch's own claim |
| 2 | Orders come from {G}, and {Mil} is who people see carrying them out; each needs the other to stay strong. | — | — | the local; the branch's own claim, as people see it |
| 3 | {Mil} keeps the walls and {G} keeps {Mil}; each needs the other to stay strong. | `walls` | — | the watch; the place has walls |
| 4 | {G} makes the law, the court judges by it, and {Mil} sees it kept; each needs the other to stay strong. | `court sits` | — | the official; a court sits on the roster |
| 5 | A place this size needs both: {G} to give the orders and {Mil} to carry them out across it; each needs the other to stay strong. | `population: large` | — | the local; a large place |
| 6 | The garrison takes its orders from {G}, and {G} leans on the garrison; each needs the other to stay strong. | `garrison` | — | the watch; a garrison stands |
| 7 | {G} calls out {Mil} when it is needed, and {Mil} answers; each needs the other to stay strong. | `militia` | `paid watch` | the watch; the force is neighbours called out (militia), none paid |

**`GM.tense`** (4 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {G} no longer simply gives {Mil} orders: the two are about as strong as each other, and little is decided without {Mil's} agreement. | — | — | the official; the branch's own claim |
| 2 | Neither {G} nor {Mil} is clearly the stronger now, so {G} asks where it once ordered, and less and less is decided without {Mil}. | — | — | the local; the branch's own claim |
| 3 | {G} and {Mil} now stand about level, and {G} asks {Mil's} agreement before it decides anything of weight. | — | — | the official; the branch's own claim |
| 4 | {Mil} has grown about as strong as {G}; the elders now ask where they once told, and little is settled without {Mil}. | `ruler: elder` | — | the local; an elder rules (rulerKind.js): the seat is the elders |

**`GR.dep`** (6 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | People pay their taxes to {G} and hear from {R} that they should. Each props up the other. | — | — | the local; the branch's own claim (the seat collects the taxes; the faith says its rule is right) |
| 2 | {G} holds the seat and the purse; {R} {R\|holds\|hold} people's faith, and {R\|uses\|use} it to say the seat is rightly held. Each props up the other. | — | — | the official; the branch's own claim |
| 3 | {G} makes the law, and {R} {R\|tells\|tell} people it is right to keep it. Each props up the other. | — | — | the official; the branch's own claim |
| 4 | A newcomer soon learns two things: {G} collects the taxes, and {R} will tell them it has the right to. Each props up the other. | — | — | the newcomer; the branch's own claim, as a newcomer meets it |
| 5 | {G} governs, and {R} {R\|tells\|tell} the faithful at the church that its rule is rightful. Each props up the other. | `church` | — | the local; the place has a church |
| 6 | In a place this small, the priest's word that {G} {G\|rules\|rule} rightly counts for as much as the taxes {G} {G\|collects\|collect}. Each props up the other. | `priest`, `population: small` | — | the local; a senior cleric is on the roster (the priest atom) and the place is small |

**`GR.tense`** (7 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {R} {R\|settles\|settle} more of people's affairs here than {G} {G\|does\|do}: marriages, inheritances, hard times. The two do not agree on who decides what. | — | — | the local; the branch's own claim |
| 2 | Ask about a marriage or an inheritance and you are sent to {R}, not to {G}; the two do not agree on who decides what. | — | — | the traveller; the branch's own claim, as a visitor meets it |
| 3 | Weddings, wills and help in hard times are all sought at the church, not from {G}, and the two do not agree on who decides what. | `church` | — | the local; the place has a church |
| 4 | The priest, not {G}, is who people go to over a marriage, an inheritance or hard times, and the two do not agree on who decides what. | `priest` | — | the local; a senior cleric is on the roster |
| 5 | {G} meets and decides, but people bring their marriages, inheritances and troubles to {R}; the two do not agree on who decides what. | `ruling body` | — | the official; the seat is a body of more than one (rulingBody.js) |
| 6 | In a place this small everyone knows to see {R}, not {G}, about a marriage or a will, and the two do not agree on who decides what. | `population: small` | — | the newcomer; a small place |
| 7 | When times are hard, people here go to {R} for help, not to {G}; the two do not agree on who decides what. | `prosperity: ≤ poor` | — | the local; Poor or below (prosperityRank.js) |

**`GE.dep`** (7 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Without the taxes and loans of {M}, {G} could not pay its way, and without {G}, {M} would have no one to make debtors pay. Neither can afford to ruin the other. | — | — | the official; the branch's own claim |
| 2 | A merchant here pays {G} its taxes and expects {G's} law to stand behind every bargain. Neither {G} nor {M} can afford to ruin the other. | — | — | the trade; the branch's own claim, from the counter |
| 3 | {M} {M\|pays\|pay} taxes to {G} and {M\|lends\|lend} it money, and the court holds {M's} debtors to their contracts. Neither can afford to ruin the other. | `court sits` | — | the official; a court sits on the roster |
| 4 | {G} lives on what the market pays in dues, and {M} {M\|lives\|live} on the market {G} keeps in order. Neither can afford to ruin the other. | `market` | — | the trade; the place keeps a market |
| 5 | What the place sends out pays {M} and, through the taxes, {G}; neither can afford to ruin the other. | `exports` | — | the trade; the place has an export list |
| 6 | Coin is not plentiful here: {G} borrows from {M}, and {M} {M\|needs\|need} {G} to see that debts are paid. Neither can afford to ruin the other. | `prosperity: ≤ moderate` | — | the local; Moderate or below |
| 7 | The place does well, and {G} and {M} both take their share: {G} the taxes, {M} the profits the law protects. Neither can afford to ruin the other. | `prosperity: ≥ comfortable` | — | the local; Comfortable or better |

**`MR.tense`** (4 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {M} and {R} pull at the same purses: the church for its tithes, the merchants for their debts. The church's rules on lending are a standing grievance with the merchants. | `church` | — | the trade; the branch's own claim; the place has a church |
| 2 | A household here owes tithes to {R} and debts to {M}, and each side would rather be paid first. Church land exemptions and the church's rules on lending are a standing grievance with the merchants. | `church` | — | the local; the branch's own claim, from the household |
| 3 | The church asks the households for tithes and {M} {M\|asks\|ask} them for what they owe, and both want to be paid first. The church's rules on lending are a standing grievance with the merchants. | `church` | — | the official; the branch's own claim |
| 4 | Money that goes to {R} as tithe does not come back to the market, and {M} resent it; the church's rules on lending are a standing grievance with the merchants. | `church`, `market` | — | the trade; the place keeps a market and a church |

**`MC.vote`** (5 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | On trade, {M} and {C} vote together; on who keeps the profit, they fight. | — | — | the official; the branch's own claim |
| 2 | {M} and {C} vote together on anything that touches the market, then fight over who keeps the profit. | `market` | — | the trade; the place keeps a market |
| 3 | {M} and {C} vote together on what the place sends out, then fight over who keeps the profit of it. | `exports` | — | the trade; the place has an export list |
| 4 | In council, {M} and {C} vote together whenever trade is at stake; outside it, they fight over who keeps the profit. | `ruling body` | — | the official; the seat is a body of more than one |
| 5 | There is money enough in trade here for {M} and {C} to vote together whenever it is at stake, and to fight over who keeps the profit. | `prosperity: ≥ comfortable` | — | the local; Comfortable or better |

**`MC.vote-against`** (6 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | Against {L}, {M} and {C} vote as one; once the vote is cast, they fight over who keeps the profit. | — | — | the official; the branch's own claim |
| 2 | {M} and {C} vote together against {L} whenever trade is at stake, then fight over who keeps the profit. | — | — | the trade; the branch's own claim with the sibling's scope |
| 3 | {M} and {C} side together against {L} on anything touching the market, then fight over who keeps the profit. | `market` | — | the trade; the place keeps a market |
| 4 | {M} and {C} vote together against {L} on what the place sends out, then fight over who keeps the profit of it. | `exports` | — | the trade; the place has an export list |
| 5 | In council, {M} and {C} vote together against {L}; outside it, they fight over who keeps the profit. | `ruling body` | — | the official; the seat is a body of more than one |
| 6 | {M} and {C} stand together against {L} whenever the guilds' business is at stake, then fight over who keeps the profit. | `guild` | — | the trade; a guild stands (guild.js) |

**`NG.sub+merchant`** (5 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {N} {N\|keeps\|keep} {N\|its\|their} titles and {N\|its\|their} precedence, but the say {N\|it\|they} once had now sits with {G} and with merchant money. | — | — | the official; the branch's own claim |
| 2 | People still give {N} {N\|its\|their} titles, but they take their business to {G}, and the money is with the merchants. | — | — | the local; the branch's own claim, as people act on it |
| 3 | {G} fills the offices that once went to {N} by right, and merchant money does the rest. | — | — | the official; the branch's own claim (the offices have taken the power) |
| 4 | In a place this large, titles count for less than offices and money; {N} {N\|has\|have} the titles, {G} the offices, the merchants the money. | `population: large` | — | the newcomer; a large place |
| 5 | The market is the merchants' and the offices are {G's}; {N} {N\|keeps\|keep} {N\|its\|their} titles and little else. | `market` | — | the trade; the place keeps a market |

**`NG.sub`** (3 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {N} {N\|keeps\|keep} {N\|its\|their} titles and {N\|its\|their} precedence, but the say {N\|it\|they} once had now sits with {G}. | — | — | the official; the branch's own claim |
| 2 | People still give {N} {N\|its\|their} titles, but they take their business to {G}. | — | — | the local; the branch's own claim |
| 3 | {G} fills the offices that once went to {N} by right. | — | — | the official; the branch's own claim |

**`NG.dep`** (4 new; index 0 is today's line)

| # | wording | needs | excludes | vantage; why of this pair, here |
|---|---|---|---|---|
| 0 | today's exact line | — | — | canonical-at-zero |
| 1 | {G} rules, but it must bargain with {N} over land and levies rather than simply give orders. | — | — | the official; the branch's own claim (land and levies are in both of the writer's forms) |
| 2 | {N} {N\|answers\|answer} to {G}, but {N\|its\|their} land and levies give {N\|it\|them} something to bargain with, and {N\|it does\|they do}. | — | — | the local; the branch's own claim |
| 3 | {N} {N\|holds\|hold} land, courts and levies of {N\|its\|their} own under {G}, enough to bargain rather than simply obey. | `court sits` | — | the official; a court sits (the writer's own gate for "courts", FR25 (c)) |
| 4 | In a place this large, {N} still {N\|keeps\|keep} enough land and levies of {N\|its\|their} own to bargain with {G}, not simply obey it. | `population: large` | — | the newcomer; a large place |

## 5. Projected top share by size (100 places a size; `measures/m4-measure.out.txt`, SUMMARY)

| | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| **today** | 2/3 67% | 5/19 26% | 64/97 66% | 61/100 61% | 71/100 71% | 90/100 90% |
| **the pools of §4** | 2/3 67% | 3/19 16% | 13/97 13% | 14/100 14% | 12/100 12% | 14/100 14% |
| the pools with only their no-atom wordings | 2/3 67% | 3/19 16% | 22/97 23% | 35/100 35% | 37/100 37% | 59/100 59% |

The last row shows that the facts carry the cure. Without the wordings that name the place's own houses and state, the vantages alone leave 23–59%. Every atom they need is the vocabulary's own.

**The commonest projected sentence:**

| size | share | sentence |
|---|---|---|
| thorp | 2/3 | The # carries out what the # decides. (GM.occ, not pooled: §6.4) |
| hamlet | 3/19 | (the same) |
| village | 13% | Weddings, wills and help in hard times are all sought at the church, not from the #, and the two do not agree on who decides what. |
| town | 14% | A newcomer soon learns two things: the # collects the taxes, and the # will tell them it has the right to. Each props up the other. |
| city | 12% | The # make their money on what the place sends out and brings in, and part of it goes to the # for the poor. Each needs the other, and neither likes it. |
| metropolis | 14% | Ask who gives the orders here and the answer is the #; the Guard carries them out, and the soldiers do not make the law. |

How many rows the projection moves (rows on a pooled branch):

| | varied | kept index 0 | conflict twins left as they are |
|---|---|---|---|
| village | 86 | 13 | 4 |
| town | 226 | 50 | 44 |
| city | 247 | 41 | 57 |
| metropolis | 329 | 61 | 24 |

**Where the projection approximates the code path** (also at the foot of the `.out.txt`):
1. It reads the facts on the FINAL record. That is exact for the pass §6.1 proposes, which runs on the final record. A pick placed at the writer instead (the power step) would read a partial record.
2. The atoms are read by `m4-common.mjs :: atomHolds` over cached facts, a stand-in for `factVocabulary.js`'s readers: the same homes (`faithReadingOf`, `defenceOf`, `courtHoldersOf`, `marketOf`, `guildOf`, `rulingBodyOf`, `rulerKindOf`, `populationBandOf`, `prosperityLabelOf`, `hasInstitution`, `canonExports`/`canonImports`, `paidWatchOf`, `legalHouseOf`).
3. The branch is read off the row's sentence shape, not by re-running the writer. A row the classifier does not know is OTHER and is never varied (none at this base).
4. At 100 places a size, a swing of about 3 places is noise. 14% sits at the bar, not under it by a margin.

## 6. What I could not settle, and what the integrator or the chair must rule

1. **WHERE THE ONE CALL LINE GOES (the chair's note of 16:30).**
   - **The build:** one new data file, `src/data/powerLineVariants.js`. It holds `RELATION_POOLS`, `DESC_POOLS` (and `CODA_POOLS`, see the companion proposal) and one function, `voicePowerLines(record)`. Data files already import the kernel and the domain (`src/data/npcData.js`, `src/data/historyData.js`).
   - `voicePowerLines` reads `record._seed`, picks with `kernel/proseHash.js :: pickVariant`, and admits a wording through `domain/facts/drawDeclared.js` against `factsOf(record)`, so the presumption ledger records the line printed. It writes `record.powerStructure.factionRelationships[i].narrative` (and the descriptions).
   - **The line I recommend** is in `src/generators/generateSettlementPipeline.js`, directly after `if (finalCtx.settlement?.powerStructure) finalCtx.settlement.powerStructure = withConflictRelations(…)`: `voicePowerLines(finalCtx.settlement); // PEOPLE-1 M4`. That is the one point where every writer of both fields has run, `_seed` is on the record, and the facts are final. The projection above is exact for it.
   - **If the chair holds the line to the three files his note names, none of them can carry it alone:**
     - `factionDynamics.js :: withConflictRelations`, the last writer, is handed the power structure without the record, so it has no seed and no facts.
     - The narratives' writer `computeFactionRelationships` runs at the power step. The seed is not threaded there, the facts are the partial record's, and four later writers match the words (§3).
     - `claimStanding.js :: settleArcaneToPractitioners` is handed the final record, but it returns early wherever practitioners work, and it runs before `withConflictRelations`.
   - **The least of the alternatives:** the line as the last statement of `settleArcaneToPractitioners`, its early `return` turned into a guarded block (two lines in `claimStanding.js`). The pass must then skip every pair the conflicts name, so `withConflictRelations` still meets index 0. That skip is a rule inside the new file, and with it the birth is exact.
   - **Either way,** the cast regen's vote matcher needs one line in `factionDynamics.js` (§3, `withConflictRelations`) so a stored variant is known. **The chair rules the placement.**
2. **No ATOM is asked.** Every wording's `needs` and `excludes` are vocabulary atoms: `church`, `priest`, `hospital`, `institution: monastery`, `institution: bank`, `docks`, `market`, `guild`, `exports`, `imports`, `prosperity`, `population`, `ruling body`, `ruler: elder`, `court sits`, `walls`, `garrison`, `militia`, `paid watch`, `soldiers`. The goods are not named (§4), so the "export good" slot M1 asked for is not needed here.
3. **The pool's identity in the registers.** The pool-dominance register (`scripts/census/pool-dominance.register.json`) holds no row for these lines today (they are not a ledger pool). The new pool would be a new id, `powerLineVariants:RELATION_POOLS.<branch>`, so its rows are a re-base, which is the chair's ruling. The census declaration (`docs/census/declarations/`) needs a file for the new pools, one row per wording with its `needs` as written in §4.
4. **Not pooled, and why:**
   - **GM.occ** ("{seat} carries out what {occupier} decides"): a crisis line that page laws key on (`law7x.mjs :: OCC_DECIDES`) and that `powerStrata.js` reads as the decider. It is 2 of 3 thorps and 3 of 19 hamlets, places that hold one relation row each. At n = 3 and n = 19 the bar cannot be read honestly. The integrator may give it a crisis pool with the who-rules lane.
   - **The capture rows** (GC.*, CM.*): rebuilt from the hall-capture state by `withCaptureRelations`. A pool there belongs in the builders `govCriminalRelation` and `criminalMilitaryRelation`, which is ALLEGIANCE's seam. They are at most 5 places a size.
   - **The conflict twins** carry the quarrel's own issue, so they already differ by place.
5. **What a change by the holding lanes could move.** Every branch is chosen by the ratio of two powers' final shares (`applyLegitimacyMultipliers`, `renormTo100`):
   - **The fortune lane:** a change to the power figures, the multipliers or the prosperity contribution moves the branch shares in §2, and with them which pool a pair draws from. The pools themselves are keyed by branch, so they stay valid.
   - **The who-rules lane:** a change to the seat's name or kind moves `ruler:` and `ruling body` (`ruler: elder` gates one GM.tense wording; `ruling body` gates one wording each in GR.tense, MC.vote and MC.vote-against).
   - **Neither lane's change** can make a wording false, because each wording needs only what its branch and its atoms hold. The re-measure after their commits is one run of `m4-measure.mjs`.
6. **The golden master moves** on every born town whose pick leaves index 0 (the owner's signed door). The seeded text tests named in §3 are re-keyed by identity in the same change.
