# Helper brief (REVIEW-R2-CODE-B step 2): every row the stage says it CURED, checked in towns

You are a reader for an independent review of a settlement generator. You fix nothing.

## Hard rules
- NEVER modify, stage, commit, push, stash, checkout or reset anything in any git tree (/home/user/settlement-engine and every worktree under /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/{tip,base,q,own}). Read-only. No npm install/ci, no vitest, no test suite. Run node only from /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/step2/<you>/ (create it) and write only there.
- Do not open files under docs/ in any tree. Your inputs are listed here. Keep your context lean: query by script; quote only the lines you need.

## The scale
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

## Inputs
- THE STAGE'S CLAIMS: /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/step2/ITEMS.md (the item tables of the lane's statement; each row: item, the rows it cures (ids), commit, what it measured). You are given the items of one family (below).
- THE ROWS' OWN TOWNS AND SENTENCES, by id:
  - "#NNN" with no prefix in PART 1 (the first table): /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/lists/w2a3.json (array, field n = the id; town, tab, sentence, fact).
  - "cut #NNN": /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/lists/cut.json (.lines[], field n).
  - "inc #NNN" / "#pf-NNN" / "#ww-NNN": /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/lists/inc.json (.lines[], fields list ('pf'|'ww') and i).
  - PART 2's ids "#11 #13 ..." for item (c) are the cut's unless the row says otherwise; "W2-C #195 #196" are not in these lists (read the sentence's class on the births).
- THE TOWNS AT THE TIP (ac8168c8c, code tree /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip): /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/births-tip.ndjson.gz (1536 {seed,s}); renders /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps/<seed>.txt (every tab), /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-tip/<seed>.{pdf-canon_dossier,pdf-draft_brief,pdf-timeline_packet,foundry-*,tonight}.txt.
- THE SAME TOWNS AT Q (the stage's base merged with the integration line, i.e. the tip WITHOUT the stage's own commits; code tree /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/q): /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/births-q.ndjson.gz; renders /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-q/dumps/ and /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-q/ (being written as you start: wait for `grep -q DONE /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-q.log` before relying on them; poll with sleep 30, up to 60 min).
- Births at another tree / of the row's own town: `TREE=<tree> OUT=/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/step2/<you>/x.ndjson.gz SEEDS=<file> node /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tools/births.mjs`. The seed shapes births.mjs knows: r2r-<size>-<i>, r2s-<crisis>-<size>-<i>, rw3-<size>-<calm|s1+s2>-<i>, rr2s-/rr3-<size>-<calm|s1+s2>-<route>-<i>, rr3p-... A row town named rww-<size>-<x>-<i> or rpf-<size>-<x>-<i> is not a shape births.mjs knows: read births.mjs's cfgFor, and if the row's town cannot be reproduced say so and read the sentence's class on the 1536 instead. To SEE the page of a newly born town you would need a render; instead call the writer's src function directly on the record, or find the same sentence class in the 1536 renders.
- Instruments: /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tools/find.mjs, facts.mjs, tonight-at.mjs, tonight-count.mjs, scope-at.mjs (read their header comments).

## Your task, for EVERY row of your items
1. THE FALSE SENTENCE GONE: on the row's own town at the tip (born at /tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip where the seed is reproducible), AND across the 1536 tip towns (the same sentence class: count where it still prints). 
2. WHAT PRINTS IN ITS PLACE: read it in the row's town (or in 3+ towns of the class: smallest and largest size, a siege/famine/occupation among them), against the record. Verdict: CURED AND TRUE / CURED BY SILENCE (nothing prints in its place) / STILL FALSE (with seed, sentence, fact; severity by the scale).
3. A COUNT FALLING IS NOT A CURE: for every item that REMOVES lines (a count going down, a line "left out", a label taken off), find the removed lines (Q renders vs tip renders, or Q records vs tip records), read thirty of them (or all if fewer), spread across sizes and crises, and say how many of the thirty were TRUE where they printed (a true line removed is a loss: list them).
4. The item's headline count by your own run where it is countable on these towns (say if your count differs and why; their 800/720 are a different set, so compare rates, or the 720 subset r2r-/r2s- of yours).

## Output
/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/step2/<you>/cures.md : one table row per item (item, rows, commit, the row's town read (seed), gone at the tip? (row town / count over 1536), what prints in its place (quoted) and verdict, removals read (n true of n read), headline by my run). Then "Method" and "Not read".
Final reply to me: ONLY counts (items; cured-and-true; cured-by-silence; still-false by severity; true lines removed) and one line per STILL FALSE row and per true line removed (seed, sentence fragment, fact). Max 400 words.
