# Cold reader brief (REVIEW-W2A-3)

You are one of seven cold readers for an independent reviewer of a fantasy-settlement generator (settlement-engine).
You fix nothing and change nothing in any repository. You only read files and write ONE output file.

## What you read
- Rendered dossiers: `/home/user/wt/r-tip/dumps/<seed>.txt`. Each is the whole owner's view of one generated town
  (every group, sub-tab and disclosure opened). Lines `== Group/Tab ==` start a view; every other line is one block of
  visible page text. A line may repeat across views (it is kept once per view).
- The town's record (the generated data the page is drawn from): `/home/user/wt/r-tip/records/<seed>.json`
  (large: query it by script, e.g. `node -e` or `jq`, never print it whole). Useful paths: `tier`, `population`, `name`,
  `stress` (the crisis in force, or null), `config` (the generation inputs: `nearbyResources`, `nearbyResourcesDepleted`,
  `tradeRouteAccess`, `monsterThreat`, `contentBoundaries`), `institutions[]` (name, category), `economicState`
  (`prosperity`, `primaryImports`, `primaryExports`, `compound.inst.*` flags, `activeChains[]` with `status`),
  `resourceAnalysis` (`gaps[]`, `imports`), `powerStructure` (`factions[]`, `criminalCaptureState`, government),
  `npcs[]`, `defenseProfile`/defence fields, `foodSecurity`, `history`, `relationships`, `faith`/religion fields.
  Grep the record for any key word you need (e.g. `grep -o '"[a-zA-Z]*[Gg]ranary[^"]*"' file | sort | uniq -c`).
- The source tree at the reviewed commit: `/home/user/wt/tip` (read-only). Prose pools live in `src/data/**`
  (`src/data/dossierStateProse/*.generated.js`, `institutionalCatalog.js`, `institutionDescColour.js`, `historyData.js`...)
  and `docs/content/RECEIPT_POOLS_*.md`; page code in `src/components/**` and `src/domain/display/**`.
  `git -C /home/user/wt/tip grep -n -F "<a fixed run of the sentence>"` finds a line's source.
- DO NOT open any hand-back, review, charter or commit message of the lane (`docs/chair/**` files): this read is cold.

The towns were born the way the app births them: `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false,
selectedStresses:[...]})` (the configuration panel's shape), every other dial random as the app ships it.
`rw3-<size>-<crisis or calm>-1`: `calm` = the stress panel set to None (no crisis forced); a crisis name = that crisis
forced; `under_siege+famine` = both forced.

## What you do
Read EVERY line of each of your dossiers, end to end, as the town's owner (a game master) reads it. For each sentence,
ask: is it true of THIS town, by its record and by the rest of its own page? List every sentence that is false or
broken. Kinds:
- (a) names a house, a role, a force, a good or a place the town LACKS (a priest where there is no church; a market,
  guild, garrison, walls, smithy, river, coast, mine... the record does not have);
- (b) DENIES something the town HAS;
- (c) presumes a STATE that is not so (normal trade, plenty or calm under a siege/famine/occupation in force; a crisis
  the town does not have; a chain "running" that the record says is impaired; a resource worked that is depleted or absent;
  prosperity or a ruler or a power that is not the record's);
- (d) a SIZE that is not so (districts, streets, quarters, crowds, a council of many in a thorp of 12);
- (e) a COUNT that is not so ("the ruling three" of a council of two; "two temples" with one);
- (f) a FIGURE against the record's (months of food, a population, a percentage, a rating);
- (g) TWO PLACES ON THE PAGE THAT DISAGREE (one tab says X, another says not-X);
- (h) BROKEN or INTERNAL text: `undefined`, `NaN`, `[object`, a `{slot}`, a catalogue name with a count range such as
  "(10-30)" or "(10,000+ only)", an identifier, a debug or chip row, a sentence cut off or ungrammatical to the point
  of misreading, the machinery of a rating (points, sums, pay shares, limits, slider names: the owner's rule "show the
  ratings, not the machinery").
Verify each candidate against the record (query it) before listing it. If the record cannot settle it, say so in `fact`
and give it LOW. A sentence that is merely dull, repetitive or awkward but true is NOT listed.

NOT faults (the owner's recorded designs; do not list): burials and rites shown under Healing; a style-rule text
in the Daily Life capture (never visible). The income lines that name a working the roster lacks ARE listed, but add
`"section7": true` (they are ruled to another lane).

Severity: HIGH = a plain false statement a GM would read out and be wrong about the town at a glance (a house, force,
ruler, crisis, size or count that is not so; normal times stated under a crisis; broken text). MED = false when
checked against the record or another part of the same page. LOW = a stretch, a doubtful case, or a nuance only a
careful reader would catch.

## What you write
ONE file, `/home/user/wt/cold/reader-<N>.json` (your number is in your task): a JSON array, one object per false
sentence:
`{"town":"<seed>","tab":"<Group/Tab from the == line ==>","sentence":"<verbatim page text, the whole sentence>",
"kind":"a|b|c|d|e|f|g|h (may combine, e.g. a/d)","mechanism":"<one of: names a house, a role or a force the town lacks |
presumes normal times under a crisis in force | a figure against the record's | names a resource, a good or a chain
state that is not so | a size | two homes that disagree | internal text | a count | denies a house, force or crossing
the town has | a ruler, a power, a threat or a history state that is not so | broken text | other: <say>>",
"fact":"<the record path and value it contradicts, quoted; and/or the other page line it contradicts>",
"source":"<file:line or corpus pool id of the sentence in /home/user/wt/tip, if you can find it; else ''>",
"severity":"HIGH|MED|LOW","section7":false}`
List a sentence once per town and tab where it prints. Be complete: a false sentence missed is the costly error.
Your final message: the count by severity per town, and the three you are least sure of. Nothing else.
