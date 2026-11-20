# PEOPLE-1 measuring seats: the common part (written 2026-11-20T15:59Z)

You are a measuring seat of PEOPLE-1 (the people's lane of the seventh chair's sameness program). You MEASURE AND PROPOSE; you change NO file under `src/`, `tests/`, `scripts/`, `supabase/`, and neither `package.json` nor `package-lock.json`. Your brief names your field(s) and your output files; this file is what every measuring seat shares.

## Why
The owner, 2026-11-20, verbatim: "So do what you can to comprehensively fix the sameness fault as much as you can". His standing rules bind every line you propose, verbatim: "Don't invent drama capitalize on what's already there if it's there. Sometimes a calm place is precisely what's needed… We are not creating the campaign."; "culture only shifts the weight of RNG, never determines it by itself."; "a king does not wear a dual hat." The governing principle of his style law (2026-11-08): plausibility with confidence, not predictability. Read the style law's sections before you write a wording: `docs/chair/2026-11-07/STYLE-RULINGS-2026-11-07.md` §2 and `docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md` §5–§8 (read those sections only).

## The cure's one pattern (the chair's ruling; every proposal you make must fit it)
1. SAY SOMETHING THE RECORD HOLDS. A default sentence that says nothing is replaced by one composed from this place's own facts, each fact read from its home under `src/domain/facts/` (`factsOf.js` names the homes; `docs/DESIGN_POOL_CENSUS.md` §1 is the vocabulary), each wording declaring the facts it NEEDS. Never a new trouble; never a fact the record lacks; a calm place stays calm; the sentence keeps the WEIGHT it has today (a plain remark stays a plain remark).
2. THEN SEVERAL WORDINGS A BRANCH, CHOSEN BY KEYED HASH WITH NO NEW DRAW (`src/kernel/proseHash.js :: pickVariant`, keyed on the birth's seed and the field, and for a per-person field the person's own stable key): the random stream's order is untouched, so nothing else in a born town moves. Index 0 of every pool is today's exact string (canonical-at-zero).
3. THE BAR: no sentence in more than about 15% of a size's places (the place's own names masked; goods and houses NOT masked), by size, on 100 places.
4. Every new pool in its own new data file (a proposal names the file it would be).
5. A saved town keeps its stored sentence: nothing changes at render.

## How to measure
- Base: the commit your worktree starts on (read it back with `git rev-parse --short=9 HEAD`; it is the working line `43ab0f5eb` unless your brief says otherwise). If your worktree has no `node_modules`, link the main checkout's: `ln -s /home/user/settlement-engine/node_modules node_modules`.
- The chair's instrument: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs` (fetch the branch first). Read it whole: it births `hxd-<size>-<i>` for i < n through `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })` after `loadGenerationLawPayloads()`, masks the place's own names to `#` and digits to `0`. Your measure births the SAME way, n = 100 per size, the six sizes (thorp, hamlet, village, town, city, metropolis). Write your own script(s) under `docs/chair/2026-11-20/content/people/measures/`; run every run to a file and read its count lines (never dump a log; never read a run through a pipe for its exit status).
- "Share" is the number of PLACES of a size whose record prints the sentence at the field, over the places of that size holding the field at all; report both counts.
- THE PROJECTION: your proposal's wordings are applied IN YOUR MEASURE SCRIPT, not in `src/`: the script re-derives, for each born place and each entry, which branch it took and which wording the proposed selection would print (with the place's own facts filled), then counts the projected top share by size. Say plainly where the projection had to approximate the real code path.
- A question of the code is answered by reading it: the function that writes your field is read WHOLE, once.

## What each proposal file holds (one file a field), in this order
1. The function: its branches, quoted by `path :: symbol` (never by line number), each branch's condition in a sentence.
2. Each branch's share by size on 100 places (a table: size × branch, places and entries), and the top sentence's share by size today.
3. THE READERS: every reader of the field in `src/` and `tests/` (and `docs/` tools that print it): who PRINTS it (page, PDF, export, any surface), who MATCHES ITS WORDS (a test or a guard keyed on its text, a census declaration, a presumption walker row), who COMPOSES FROM IT (another sentence built from it). A table: path :: symbol · kind · what breaks if the words change.
4. The candidate wordings, by branch: each wording, the facts it NEEDS (each by its home under `src/domain/facts/` or the record field it reads), and why it is said of THIS person in THIS place. Index 0 stays today's line. Write each line as the style law asks; no drama the record does not hold.
5. The projected top share by size after the change, beside today's, and the commonest projected sentence of each size.
6. What you could not settle, and what the integrator or the chair must rule.

## Hand-back
Commit your files ONLY (by explicit path, `git add <path>`; never `git add -A`) on your worktree's branch with a message that names the field and your base; do not push (the integrator pushes). Your final message: at most 200 words: the commit, the top share today and projected by size, the rulings you need. Nothing else.
