# ROUND-3-CUT step 2 — what prints in the gone line's place (cold read)

You are a cold reader for an independent measurer of a fantasy-settlement generator. You fix nothing and change
nothing in any repository. You read files and write ONE output file. Do not open anything under `docs/chair/` in any
tree, do not run `git log` or `git show` of commits, and do not read any commit message, hand-back or branch name's
claims: this read is cold.

Root: /tmp/claude-0/-home-user-settlement-engine/6c6c6e69-60a7-52f0-855a-5c3f87189806/scratchpad (paths below are
relative to it). The SCALE you judge by (the kinds a–h of a false sentence, and HIGH / MED / LOW) is `step2/KINDS.md`,
sections "What you do" and its severity paragraph; ignore its "What you read" and "What you write" sections.

## Each case (your packet: `step2/packet-<N>.json`)
A sentence (`goneSentence`) printed on one tab (`tab`) of one town's page at the tree `treeBefore` and was judged FALSE
by an earlier cold reader (`readerFact` is that reader's reason, `severity` their rank). At the tree `treeAfter` the
same town (same roster and cast) no longer prints that sentence. Your question: WHAT PRINTS IN ITS PLACE at
`treeAfter`, and is it true of the town by `treeAfter`'s OWN record?
- The two pages: `r20/<tree>/dumps/<town>.txt` (one line per block element; `== Group/Tab ==` starts a view). Read the
  case's tab at both trees (only that view unless you need another to settle a fact). `addedInTab` lists lines the tab
  prints at `treeAfter` and not at `treeBefore`; `mostSimilarAdded` is a guess by word overlap only — check it.
- The records: `recordAfter` (and `recordBefore`); large JSON, query by script (`node -e`, `jq`), never print whole.
  Useful paths: tier, population, stress, config (nearbyResources, nearbyResourcesDepleted, tradeRouteAccess,
  terrainType), institutions[] (name, category, status), economicState (prosperity, primaryImports, primaryExports,
  activeChains[] with status, foodSecurity), resourceAnalysis, powerStructure.factions[], npcs[], defenseProfile.

## Verdict per case (one of)
- `TRUE` — a line takes the gone line's place (the same job: the same row, card, pill, tile or paragraph slot) and it is
  true of the town by treeAfter's record and the rest of its page.
- `STILL FALSE` — a line takes its place and it is still false (reworded), by the KINDS scale; say which kind and why,
  and give the severity you would give it.
- `NOTHING` — nothing takes its place (the row, chip or clause is simply gone), and the lines added in the tab do not
  carry a false claim of the same sort. If a chip or range is stripped from a line that otherwise stays (e.g. a house
  name loses "(5-15)"), the stripped line IS what prints in its place: judge it (TRUE or STILL FALSE).
- `NOTHING, BUT A NEW FALSE LINE` — the gone line's slot is empty, but another added line in that tab is false.
- `CANNOT TELL` — the record cannot settle it (say what is missing).
Judge every case on its own town's record; identical cases in different towns may differ.

## What you write
`step2/verdict-<N>.json`: a JSON array, one object per case, in packet order:
`{"case":"<case>","n":<n>,"verdict":"TRUE|STILL FALSE|NOTHING|NOTHING, BUT A NEW FALSE LINE|CANNOT TELL",
"inPlace":"<the verbatim line that now prints in its place, or ''>","why":"<the record path and value, or the page line,
that makes it true or false; one or two sentences>","kind":"<a–h for STILL FALSE / NEW FALSE, else ''>",
"severity":"HIGH|MED|LOW|''"}`. Rewrite the file after every ten cases so nothing is lost.
Your final message: the count of each verdict, and the three cases you are least sure of. Nothing else.
