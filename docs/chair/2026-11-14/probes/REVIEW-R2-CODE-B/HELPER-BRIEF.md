# Helper brief (REVIEW-R2-CODE-B step 1): read new lines WHERE THEY PRINT

You are a cold reader for an independent review of a settlement generator (a fantasy-town generator; each "town" is a JSON record plus rendered pages). You read lines; you fix nothing.

## Hard rules
- NEVER modify, stage, commit, push, stash, checkout or reset anything in any git tree (/home/user/settlement-engine and every worktree under /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/{tip,base,q,own}). Read-only on those trees. Do not run npm install / npm ci / vitest / the test suite. Run node scripts only from /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/helpers/<your-name>/ (create it) and write only there.
- Do not open any file under docs/ in any tree, nor any git commit message. You read code (src/) and the town data only.
- Keep your own context lean: query big files by script (node, grep -c, awk); never cat whole rendered pages or records. Quote only the lines you need.

## The scale (verbatim from the readers' brief)
## What you do
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

## The towns
- Records (the generator's output at the tip under review, code tree /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip): /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/births-tip.ndjson.gz : 1536 lines, each {seed, s} (s = the settlement record). Seeds: r2r-<size>-<i> (random stresses), r2s-<crisis>-<size>-<i> (one crisis), rr3-<size>-<calm|crisis1[+crisis2]>-<route>-<i> (the app's own configuration shape). Sizes: thorp < hamlet < village < town < city < metropolis. s.tier, s.population, s.stress / s.stressors (crises), s.institutions, s.npcs, s.economicState, s.powerStructure, etc.
- The same towns rendered at the tip (being written as you start; wait for the marker before relying on them: `grep -q DONE /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-tip.log`, poll with sleep 30 in a loop, up to ~60 min):
  - /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps/<seed>.txt : every tab of the app's dossier, one line per block, sections headed "== Group/Tab ==".
  - /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/records/<seed>.json : the record as rendered (with publicProse stamped).
  - /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-tip/<seed>.pdf-{canon_dossier,draft_brief,timeline_packet}.txt (PDF text), <seed>.foundry-<variant>.txt (Foundry journal), <seed>.tonight.txt (the Tonight sheet as composed JSON).
- Instruments (/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tools/): find.mjs <ndjson.gz> <regex> [max] (every string leaf in records matching; prints seed/tier/pop/stresses/path), facts.mjs <ndjson.gz> <regex> <js expr over s,v,seed> (tally a record fact over towns where a leaf matches). For text that is NOT stored in the record (composed at render time), grep the dumps/surfaces: e.g. `grep -l -F "phrase" /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps/*.txt | wc -l`.
- To call a src function directly over the records: `node --input-type=module -e "import('/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/....js').then(...)"` reading births-tip.ndjson.gz (zlib + readline). Some modules need `await (await import('/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/domain/density/densityCreateBoundary.js')).loadGenerationLawPayloads()` first.
- MORE TOWNS if a line never prints in these: birth more with `TREE=/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip OUT=/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/helpers/<you>/more.ndjson.gz SEEDS=<file of new seeds> node /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tools/births.mjs` (seed shapes above; use new i values, e.g. rr3-town-under_siege-rand-100; app's shape = rr3-). Say how many births you tried for a line that never prints.

## Your task
You are given a file family: every line the stage under review ADDED at the tip (file `<tipline>\t<commit>\t<text>`, the line number in the tip's file). From these and the tip files themselves (read the touched functions WHOLE in /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/...):
1. LIST every user-facing sentence, clause, label, chip, title form or pool variant these added lines create or reword (one row each; a template with slots is one row, with its pool variants as separate rows where the pool is new). Give file, function, and the conditions it is declared under (the guards in code). Ignore comments/JSDoc, pure refactors that print nothing new; but a changed CONDITION on an old sentence (a line now printing in more or fewer towns) IS a row: say which.
2. For each row: find where it prints at the tip (tab dumps, PDF, Foundry, Tonight sheet; say which surfaces), count the towns it prints in, and READ IT against each town's own record: by script over EVERY town it prints in where you can (state the check you scripted), and by eye in AT LEAST THREE towns: the smallest and largest size it reaches, and a siege, a famine or an occupation among them where it can print under one. Also check: a twin line lacking a condition its siblings carry; a slot that prints a catalogue label (e.g. "(10-30)", "(high magic)") or breaks agreement (singular/plural, a/an, "their house" for a person with none); a line that says how the model works (machinery: points, sums, slider names, rules).
3. Verdict per row: TRUE (in every town read), FALSE (HIGH/MEDIUM/LOW by the scale, with town seed, the exact sentence as printed, and the fact of the record against it), or NEVER PRINTS (with how many births tried).

## Output
Write /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/helpers/<you>/rows.md : a markdown table, one row per line: id (your prefix + number), file::function, the line (template with slots), conditions, surfaces, towns printed (count), towns read (seeds; mark which by script / by eye), verdict, evidence (for FALSE: seed, printed sentence, fact). Then a short section "Method" (scripts used; put the scripts in your folder) and "Not read" (anything you could not settle).
Your final reply to me: ONLY the counts (rows, TRUE, FALSE by severity, NEVER PRINTS) and every FALSE row in one line each (id, seed, sentence fragment, fact). Max 400 words. No other narrative.
