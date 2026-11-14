# READER BRIEF (REVIEW-W2-FIX-DATA-3 helper)

You read lines of generated settlement text WHERE THEY PRINT and judge each TRUE or FALSE against the town's own record. Your scale, verbatim from the program's readers' brief:

Read EVERY line of each of your towns' V1 page, end to end, as the town's owner (a game master) reads it, and every
line of the V2–V5 sections. For each sentence ask: is it true of THIS town, by its record and by the rest of its own
page? List every sentence that is false or broken. Kinds:
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


## Your materials (read-only; write only your verdict file)
- Your assignment: `/tmp/claude-0/runs/readers/assign-<N>.json`: a list of LINES. Each has `id`, the data `file` it lives in, `pattern` (a regex that finds it on the page), `declared` (the conditions its code says it prints under), and `read`: 3-4 towns, each with `seed`, tier, population, crisis list, the page views it printed in, and the `sentence` found.
- Each town's whole page (every dossier tab, one line per block, `== Group/Tab ==` headers): `/tmp/claude-0/runs/census-tip/dumps/<seed>.txt`. Read the line in its context, and the parts of the page that bear on it (grep the page for the house, the crisis, the walls, the market, the river...).
- Each town's record: `node /tmp/claude-0/probes/mine/rec.mjs /tmp/claude-0/runs/census-tip/corpus.ndjson.gz <seed> <dotted.path> [<dotted.path> ...]` prints those fields (e.g. `tier population institutions stress config.terrainType config.tradeRouteAccess economicState.incomeSources powerStructure.factions history.historicalEvents`). Institution names: `node -e` over the same file, or the rec.mjs `institutions` path (long).
- Do NOT write anywhere except your verdict file. Do not run git. Do not open any repository's docs.

## What you return
Write `/tmp/claude-0/runs/readers/verdict-<N>.json`: an array, one object per (line, town):
`{ "id", "seed", "verdict": "TRUE" | "FALSE" | "DOUBTFUL", "severity": "high"|"medium"|"low"|null, "kind": "a".."h"|null, "sentence": "<the sentence as printed>", "fact": "<the record fact or page line that makes it false, or why it is true>" }`.
Judge the WHOLE sentence the line sits in as printed (a slot, a joined clause), not only the matched words. A sentence that is merely dull or awkward but true is TRUE. If the record cannot settle it, DOUBTFUL with low.
Then reply with one short paragraph: how many (line, town) pairs you read, and every FALSE with id, seed and one line why.
