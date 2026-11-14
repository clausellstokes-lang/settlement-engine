# Cold reader brief (REVIEW-BAR-0) — adapted from REVIEW-R2-STAGES' READER-BRIEF to ONE version

You are one of several cold readers for an independent reviewer of a fantasy-settlement generator (settlement-engine).
You fix nothing and change nothing in any repository. You only read files and write ONE output file.

## What you read
- Reading files: `/tmp/claude-0/-home-user-settlement-engine/548943c2-67f6-5faa-b0e5-db75a45dcb74/scratchpad/r/join-bar0/dumps/<seed>.txt`, one per town. Each holds the owner's whole view of one generated
  town (every group, sub-tab and disclosure opened), ONE version of the program. A line `== Group/Tab ==` opens each
  view; every line after it, until the next `== ... ==`, prints in that view. Lines starting `[STYLE]` are style text,
  never visible: skip them. The last view, `== Table/Tonight sheet ==`, is the printable session sheet.
- The town's record (the generated data the page is drawn from): `/tmp/claude-0/-home-user-settlement-engine/548943c2-67f6-5faa-b0e5-db75a45dcb74/scratchpad/r/join-bar0/records/<seed>.json`
  (large: query it by script, e.g. `node -e` or `jq`, never print it whole). Useful paths: `tier`, `population`,
  `name`, `stress` (the crisis in force, or null), `config` (`nearbyResources`, `nearbyResourcesDepleted`,
  `tradeRouteAccess`, `terrainType`), `institutions[]` (name, category, `status`), `economicState` (`prosperity`,
  `primaryImports`, `primaryExports`, `compound.inst.*` flags, `activeChains[]` with `status`, `foodSecurity` with
  `foodRecord`), `resourceAnalysis` (`gaps[]`, `imports`), `powerStructure` (`factions[]`, government), `npcs[]`,
  `defenseProfile`, `history`, `relationships`. Grep the record for any key word you need.
- The source tree (read-only): `/tmp/claude-0/-home-user-settlement-engine/548943c2-67f6-5faa-b0e5-db75a45dcb74/scratchpad/wt/join`. `git -C /tmp/claude-0/-home-user-settlement-engine/548943c2-67f6-5faa-b0e5-db75a45dcb74/scratchpad/wt/join grep -n -F "<a fixed run of the sentence>"`
  finds a line's source.
- DO NOT open any file under `docs/chair/` (in any tree) or anything else in the scratch directory than the files
  named here, and do not run `git log`, `git show` of commits, or read any commit message: this read is cold. Do not
  read the repository's other review lists.

The towns were born the way the app births them: `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false,
selectedStresses:[...]})` (the configuration panel's shape), every other dial random as the app ships it.
Seed `bar0-<size>-<crisis or calm>-<route>-1`: `calm` = no crisis forced; a crisis name = that crisis forced;
`under_siege+famine` = both; `<route>` `rand` = the trade route left on Random.

## What you do
Read EVERY line of each of your towns' page, end to end, as the town's owner (a game master) reads it. For each
sentence ask: is it true of THIS town, by its record and by the rest of its own page? List every sentence that is
false or broken. Kinds:
- (a) names a house, a role, a force, a good or a place the town LACKS (a priest where there is no church; a market,
  guild, garrison, walls, gates, harbour, docks, smithy, river, coast, mine... the record does not have);
- (b) DENIES something the town HAS (e.g. "no tannery finishes it" beside Tanners; "No one here works the timber"
  beside a timber chain that runs);
- (c) presumes a STATE that is not so (normal trade, plenty or calm under a siege/famine/occupation in force; food
  brought in by trade under a siege that cuts every road; a crisis the town does not have; a chain "running" that the
  record says is impaired; a resource worked that is depleted or absent; a prosperity, ruler or power that is not the
  record's; a holder of the reserves who is not the one the record names);
- (d) a SIZE that is not so (districts, streets, quarters, crowds, a council of many in a thorp of 12);
- (e) a COUNT that is not so;
- (f) a FIGURE against the record's (days, weeks or months of food, a population, a percentage, a rating);
- (g) TWO PLACES ON THE PAGE THAT DISAGREE;
- (h) BROKEN or INTERNAL text: `undefined`, `NaN`, `[object`, a `{slot}`, a slot filled with the wrong kind of word
  (e.g. "its days of legal", "reeds reserves"), a catalogue name with a count range such as "(10-30)" or a gate such as
  "(high magic)", an identifier, a debug or chip row (e.g. "2-order chain", "covers X, Y"), a provenance tag printed as
  a line ("(smuggling)"), a badge that is not so ("YOU" on a house the user did not add), a sentence cut off or
  ungrammatical to the point of misreading, the machinery of a rating (points, sums, pay shares, limits, slider names:
  the owner's rule "show the ratings, not the machinery").
Verify each candidate against the record (query it) before listing it. If the record cannot settle it, say so in `fact`
and give it LOW. A sentence that is merely dull, repetitive or awkward but true is NOT listed.
NOT faults (the owner's recorded designs; do not list): burials and rites shown under Healing; a style-rule text in the
Daily Life capture (never visible). Income lines that name a working the roster lacks ARE listed, with `"section7": true`.

Severity: HIGH = a plain false statement a GM would read out and be wrong about the town at a glance (a house, force,
ruler, crisis, size or count that is not so; normal times stated under a crisis; broken text). MED = false when checked
against the record or another part of the same page. LOW = a stretch, a doubtful case, or a nuance only a careful
reader would catch.

## What you write
ONE file, `/tmp/claude-0/-home-user-settlement-engine/548943c2-67f6-5faa-b0e5-db75a45dcb74/scratchpad/cold/reader-<N>.json` (your number is in your task): a JSON array, one object per false sentence:
`{"town":"<seed>","version":"V1","tab":"<Group/Tab from the == line ==>",
"sentence":"<verbatim page text, the whole sentence, copied exactly>","kind":"a|b|c|d|e|f|g|h (may combine)",
"mechanism":"<one of: names a house, a role or a force the town lacks | presumes normal times under a crisis in force |
a figure against the record's | names a resource, a good or a chain state that is not so | a size | two homes that
disagree | internal text | a count | denies a house, force or crossing the town has | a ruler, a power, a threat or a
history state that is not so | broken text | other: <say>>",
"fact":"<the record path and value it contradicts, quoted; and/or the other page line it contradicts>",
"source":"<file:line or corpus pool id of the sentence, if you can find it; else ''>",
"severity":"HIGH|MED|LOW","section7":false}`
List a sentence once per town and tab where it prints. Copy the sentence exactly (the reviewer matches it by script
against the page). Be complete: a false sentence missed is the costly error. Write the file as you go (rewrite it after
each town, and at least every few hundred lines read) so nothing is lost.
Your final message: the count by severity per town, and the three you are least sure of. Nothing else.
