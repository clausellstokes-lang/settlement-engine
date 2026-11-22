# WHY PLACES SHARE THEIR TROUBLES — a read-only measure (brief; the chair, 2026-11-20)

You are a helper of the chair of the settlement-engine program. READ-ONLY: you change no file in any git worktree,
you push nothing, you run no gate (no vitest, no typecheck, no build, never `npm run check`). You may write only under
`/tmp/claude-0/-home-user-settlement-engine/716f8968-c3c3-52a7-92aa-37ba085c7c08/scratchpad/troublekinds/`.
Plain `node` scripts that READ are fine (one at a time; the box has four cores and other work is live).

THE TREE YOU READ: `/home/user/wt/rehearsal2` (a throwaway joined tree, never pushed: fourteen content lanes merged,
the who-rules and fortune rules switched on). THE POOL: 900 births cached as JSON under
`/tmp/claude-0/-home-user-settlement-engine/716f8968-c3c3-52a7-92aa-37ba085c7c08/scratchpad/rehearsal2/pool/`
(150 a size, six sizes, born as a visitor who touches no setting is born; file names like `city-0.json`, the seed inside is `visitor-<size>-<i>`; look at one
file's shape first). `REHEARSAL-2.md` beside that pool directory describes how they were born.

THE QUESTION. Measured on that pool: half of cities carry a `guild_conflict` trouble and nearly half a `crime_wave`
(metropolises 50% and 45%; towns 31% and 22%); the FIRST trouble of a city is `crime_wave` in 46%. The owner's rule for
any cure is fixed: a factor may SHIFT THE WEIGHT of a draw, never determine it by itself; and "a calm town should be as
it currently is… don't invent drama, capitalize on what's already there". The chair must tell the owner WHY places of a
size converge on two kinds before proposing anything. You find the why. You propose no wording and write no code for
the product.

WHAT TO FIND, in this order:
1. THE MECHANISM. Where a place's live troubles (`history.currentTensions`, and anything that feeds it or copies it:
   `stress`, `conflicts`, the "Tensions & Conflicts" block) are chosen at birth: file and symbol for the candidate
   table, the admission conditions of each kind (what facts of the place admit it), the weights, how many are drawn
   by size, and the order (what makes a trouble the FIRST). Cite by `path :: symbol`. Say plainly whether the draw is
   flat among admitted kinds or weighted, and by what.
2. THE DISTRIBUTION. From the pool, by size: places with 0, 1, 2, 3+ troubles; the share of places carrying each kind
   (any position) and the share whose first trouble is each kind; the number of distinct kinds seen at each size.
3. THE WHY. For `guild_conflict` and `crime_wave` (and whichever kind leads thorps, hamlets and villages): what share
   of places of each size are ADMITTED to the kind by its conditions (recompute the conditions over the pool's records
   if the facts are stored; say so where they are not), what the competing admitted kinds are, and the arithmetic that
   yields the measured share (for example: "a city admits four kinds on average, two of them these, each at weight
   3 of 8"). If the convergence comes from the candidate table being short for big places, say how short. If it comes
   from one condition every big place meets, name the condition.
4. WHAT ALREADY EXISTS IN THE RECORD THAT A WEIGHT COULD READ. List the place's own stored facts that plausibly bear on
   each kind (stress scores, the systems' ratings, safety, economy state, the powers present, culture fields, the
   crisis if any, history events) with their paths, and for the pool say how much each varies across places of one
   size (a fact that is the same in 90% of cities cannot spread them). No proposal: a table of candidate reads.
5. ONE WHAT-IF, ONLY IF CHEAP: if the selection is a pure function you can import from the tree and call with a
   changed weight table in a scratch script (no file in the tree edited), show the by-size distribution of kinds when
   each admitted kind's weight is multiplied by one stored fact of your choosing that varies; otherwise skip and say
   why. Do not spend more than a quarter of your effort here.

YOUR PRODUCT: `REPORT.md` in your scratch directory (tables, cited symbols; CONFIRMED = executed with the script's
path, PLAUSIBLE = read, not run), and a final message to the chair of AT MOST 300 words: the mechanism in three
sentences, the why in three, the two or three stored facts that vary enough to carry a weight, and the report's path.
If the tree or the pool is missing or a script crashes on the record's shape, say so in one short message rather than
working round it. A refusal by your own permission check stands: report it.
