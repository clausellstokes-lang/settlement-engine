# MEASURE-WORDING — three wording faults the battery found, measured BY THE SENTENCE (PROSE-2's helper brief; MEASURE ONLY)

Written by PROSE-2, 2026-11-20, on the chair's ruling of 18:19 UTC (item 2). You change NO source and NO test. You work in your own worktree on branch `lane/prose-2-2026-11-20-wording`, cut from `lane/prose-2-2026-11-20` at the commit named in your prompt; run `npm ci` first. You commit ONLY under `docs/chair/2026-11-20/content/prose/map/wording/`, by explicit paths, with the hooks; never push; never the whole suite. Read `CLAUDE.md` first, then `docs/chair/2026-11-20/content/prose/map/gen11-fields/GEN11-FIELDS.md` WHOLE (its census script sits beside it: reuse it, same birth, same 300 places `hxd-<size>-0..49`).

## THE THREE FAULTS
1. THE SIZE NOUN: "…and the town can pay" (and any other singular "town" the `tier-noun` check flags) at a place that is NOT a town (`culturalIdentity.defensePattern`, and any other field the check finds).
2. "May operate hospital/school." where no hospital stands (`institutions[].desc`; text from `src/data/institutionalCatalog.js`).
3. "…remain walled apart" (`history.historicalEvents[].lastingEffects[]`, `history.currentTensions[].lastingEffects[]`, `history.legacyAnnotations[].annotation`).

## FOR EACH FAULT, BY THE SENTENCE (not by an example column)
- every DISTINCT sentence that carries it, with the field path, the number of places and the sizes (place names masked as `#`);
- the WRITER: the module and symbol that composes the text, and the data row that holds the words (`path :: symbol`; a data row by its file and its key or first words, never a bare line number);
- PRINTED: the page or PDF surface that prints the field (search by containment, name the component; "none found" is a finding);
- WHO HOLDS THE FILE: run `git fetch -q origin '+refs/heads/lane/*:refs/remotes/origin/lane/*'`, then for the writer's file and the data file, every `origin/lane/*` branch whose diff from its merge-base with your HEAD touches that file (name the branch and its last commit subject). None is a finding;
- for 2: does the institution that says it EXISTS where the place has no hospital (which institution kinds carry the line; does `defenseFactsOf` read a hospital from the same record)?
- for 3: is "walled apart" a claim about the place's defence (town walls) or about walls inside it (quarters divided)? Say what the sentence's own event is, and quote it.

## OUTPUT
`docs/chair/2026-11-20/content/prose/map/wording/WORDING-FAULTS.md`: a section per fault with the above, then one line per fault: "the cure I would propose" in plain words (a reworded data row, a gate on the writer, or nothing because it is not a fault), marked as your proposal. Then EXECUTED vs INFERRED. Commit any script beside it. Final message at most 150 words: the commit; per fault: sentences, places, writer, holder.
