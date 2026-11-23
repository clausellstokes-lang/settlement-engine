READS WHOLE: this file, `close-6/briefs/CLOSE-6-ADDENDUM.md`, `close-5/briefs/FLIP-COMMON.md` (its "Where you work" and "What may never happen"), `tests/generators/bar8Powers.test.js`, and each src function you name as a writer (by symbol, the function whole, once). WINDOW: 1,000,000 tokens (the middle tier).

# LIT-13G — A MEASURE FIRST, NO CURE (CLOSE-6 unit (1b); the ninth chair's N75 (5); written 2026-11-23 09:24 UTC, read from `date -u`)

YOU CHANGE NO FILE UNDER `src/` OR `tests/` AND MAKE NO COMMIT. You measure and read; CLOSE-6 sends one line to the chair, who rules.

## The finding (CLOSE-5's F-SEAT probe, one birth)
Lit, `r2r-city-5`'s relation rows say the guild bought the hall (`type: 'corrupted'` with a `captureState`), yet the Thieves' Guild
card prints "the garrison can arrest their people, and the guild can make every investigation costly" and the Military/Guard
card "A slow war with the guild". BAR8-K's rule 13g (`tests/generators/bar8Powers.test.js`, its `it('13g: …')`): where the guild
has bought the seat, no card calls the tie a war of arrests; asserted on three seeds only. Use THAT FILE's own `WAR_OF_ARRESTS`
and `tieBought` (copy them verbatim into your script, citing the file) so your count is the test's rule.

## The measure
THE BIRTHS: the census's 900: seeds `dp-<size>-<i>`, i 0..149, sizes thorp hamlet village town city metropolis, born as the product
births them: `generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} })` after
`await loadGenerationLawPayloads()` (the pattern of `docs/chair/2026-11-21/eighth/close/close-3/births-sha.mjs`, imported by
`TREE`). Also `r2r-city-5` born as `bar8Powers.test.js` births it (its `configOf`), on every tree, as the control: it must count.
THE TREES, the same script on each:
- LIT: the flip branch, `/home/user/wt/flip` (READ ONLY for you: another builder may hold it; if its HEAD moves while you run,
  say so and which HEAD each run read). Lit there by default (`birthConfig` mints `_seatLawVersion: 2`, `_fortuneLawVersion: 2`).
- DARK: the working line's tip 9b0ffaa97 in a worktree of your own: `git -C /home/user/settlement-engine worktree add --detach
  /home/user/wt/line 9b0ffaa97` (node_modules linked as the addendum says; you never commit there). Remove it at the end
  (`git worktree remove /home/user/wt/line`).
- THE CAUSE'S SPLIT, on the flip tree: the same births with ONE law forced to 1 in the config you pass (seat lit + fortune 1;
  seat 1 + fortune lit), read from the code how the config's law keys are spelled (`densityCreateBoundary.js :: birthConfig`).
COUNT PER BIRTH, PER TREE: (A) the test's rule: `tieBought(town)` and any power card whose `desc` matches `WAR_OF_ARRESTS`;
(B) the chair's narrower rule: a relation row BETWEEN THE GUILD (the criminal power) AND THE GUARD (the military/watch power)
reads bought, and a card OF EITHER of those two powers matches `WAR_OF_ARRESTS` (say how you identify the two powers: by the
record's own category field, not by display name). Also count births with a bought tie (A's first half) and births with a war
line (its second) on their own, so the reader sees the base rates.
TABLE: per size and tree: births, bought, war, (A), (B); the seeds of every (A) and (B) birth (a file, not your message).

## The cause, READ NOT GUESSED
Name by `file :: symbol`: the step that writes the power card's war-family lines (and what it reads to choose them: the tie's type,
its capture state, the guild's standing…); the step that writes the relation row's `type`/`captureState` 'corrupted' lit; the step
that the lit laws add or change that moves either; and their ORDER in `generateSettlementPipeline` (which runs first). Confirm the
order on `r2r-city-5` by reading the record (e.g. the row's value at the point the card is written: a breakpoint-free way is a
temporary copy of the tree in your scratchpad with a log line, never the flip worktree). State CONFIRMED (run) or PLAUSIBLE (read).

## Where things go
Scripts and outputs under `docs/chair/2026-11-21/eighth/close/close-6/lit13g/` in the main checkout (CLOSE-6 commits the scripts:
N8); logs under the addendum's scratchpad. Every run through the mutex:
`GATE_MUTEX_MAX_POLLS=400 sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- node <script> … > <log> 2>&1; echo "exit=$?" >> <log>`.
REPORT: `close-6/reports/LIT-13G.md` (the table, the cause with symbols and order, CONFIRMED/PLAUSIBLE per claim). Final message at
most 200 words: (A) and (B) lit and dark by size in one line each, the cause in two sentences, whether a rule over every birth of
the 900 would be red dark (if dark is not 0, say so first: 13g would then be a promise already broken before the flip).
