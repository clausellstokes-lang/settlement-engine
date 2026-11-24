READS WHOLE: this file; `docs/chair/2026-11-24/tenth/read/FINDINGS.md` on `origin/lane/chair-2026-11-08` (`git show origin/lane/chair-2026-11-08:<path>`); the header comment of `scripts/sameness-census.mjs` (its first 60 lines) and `scripts/census/sameness-census.render.census.jsx` :: `birthOf`; and each src function you name as a writer or a reader (by symbol, the function whole, once). WINDOW: 1,000,000 tokens (the middle tier).

# READ-24 — A MEASURE FIRST, NO CURE (CLOSE-7 unit (1); the tenth chair's START-CLOSE-7; written by CLOSE-7)

YOU CHANGE NO FILE UNDER `src/`, `tests/` OR `scripts/` OF ANY TREE AND MAKE NO COMMIT. You measure and read; CLOSE-7 sends
one message to the chair, who rules each finding (cure before the first deploy, or listed for the owner). NOTHING IS BUILT.

## The tree and the births
- THE LIT TREE: `/home/user/wt/lit`, a detached worktree at d447ee31e5b2836736d22778a91ce66721a6d00e (the flip, both laws lit
  by default: `birthConfig` mints `_seatLawVersion: 2`, `_fortuneLawVersion: 2`). READ AND RUN ONLY: never edit, commit or
  check out there. Confirm `git -C /home/user/wt/lit rev-parse HEAD` at the start and the end of every run, and that
  `git -C /home/user/wt/lit status --short` is empty (an output written inside the tree is a fault: write outside it).
- THE BIRTHS: the close's census of 900 (CLOSE-2's plan, used by every close since): seeds `dp-<size>-<i>`, i 0..149, sizes
  thorp hamlet village town city metropolis, born `generateSettlementPipeline(birthConfig({ settType }), null, { seed,
  customContent: {} })` after `await loadGenerationLawPayloads()` (the pattern of
  `docs/chair/2026-11-21/eighth/close/close-3/births-sha.mjs`, run with `TREE=/home/user/wt/lit`).
- THE PAGE TEXT: rendered by the sameness door's own renderer and nothing else, with a plan file of the 900 rows
  `{ seed, size, config: { settType: size } }`:
  `node scripts/sameness-census.mjs --measure --plan=<plan.json> --text --workers=4 --out=<dir>` run from `/home/user/wt/lit`
  (out in your scratchpad, never committed: the texts are large). Its `birthOf` passes a row's config through `birthConfig` with
  the store's content runtime at rest. CONTROL, said in the report: the renderer's birth is the same birth as the direct one
  (state how you proved it, e.g. the place's name and population per seed from the text against the direct record, over all 900).
- THE RECORD: born directly (the births-sha pattern) when you need a field; one script that births each place once and measures
  every item below is preferred to one per item.

## The items (FINDINGS.md's letters). For each: the count BY SIZE, the seeds of every hit in a file, CONFIRMED (run) or PLAUSIBLE (read)
A1 HEALER. Births whose page prints "Anyone who falls ill here is nursed by family, for there is no healer to send for." while
   `availableServices` holds a healing entry given by someone resident. Find the pool holding that sentence and the fact its
   selection reads (by `file :: symbol`); say WHICH `availableServices` entries count as healing and why (their category / key,
   read from the code that writes them, not guessed from display text), and what "resident" is in the record. Count: births with
   the line; births with a resident healing service; both. THE CAUSE READ: which fact the line reads, which fact the list reads,
   where each is written, and why they part (e.g. one reads institutions, the other services; one is computed before a step that
   adds the priest). Confirm on dm24-village-0's twin in the census if it has one, else on the lowest census hit.
A2 RICH AND HUNGRY. Births printing a line of plenty ("... is rich and behaves like it. What would be a crisis elsewhere is an
   expense here.") beside a line of short food ("Portions are small, ..." or "... less food to go round ..."). Count; and for each
   hit whether the record holds both truly (the wealth fact high AND the food fact short: name both fields and their values), so
   that only the joining is missing; or whether one line misreads its fact.
B1 THE LAND. (i) Births on Desert/Arid ground (name the record field and value you read) that hold a Fish market, a Sawmill or a
   Hunter's lodge (count each separately and any); for each kind, the step that places it (`file :: symbol`) and what it reads of
   the land (terrain, water, resources, nothing). (ii) Births whose tradition "blesses the furrows" while the page says the grain
   is bought in and not grown ("The grain is bought in, not grown here, ..."): count; the step that chooses the tradition and
   the step that writes the grain line, and what each reads. THE CAUSE READ for both.
C1 THE LABEL. Births whose government prints as "Corrupt Council" on the first screen ("Governed by Corrupt Council") and as
   the subject of a sentence (e.g. "The Corrupt Council has ...", "Corrupt Council vs ..."): count. Where the label is written
   (`file :: symbol`). Whether a player's page prints it too: the public projection (`withPublicProse` / the public-safe copy the
   renderer composes: read how the renderer builds the shared read and say which you checked) on the same births: count.
D  REPEATS ON A JOURNEY. NO NEW TOOL. From the sameness door's stored reading (`scripts/census/sameness-census.register.json`
   in the lit tree, and the door's last report: find it by `git log` on the register and a grep for `SAME-CENSUS.md`; say the
   commit and the tree each was written on, lit or dark), the TOP share at hamlet, village and town of the slots holding
   FINDINGS.md's D1 to D4 lines: the arrival paragraph ("The place"), the tensions' first line, the origin line, the Daily Life
   visitor lines (name each slot as the register keys it). Say plainly, per slot, whether the door's bar (its ceiling, and the
   15% bar of COMMON-RULES 3) already passes it. THE ONE COUNT YOU MAKE: the guild quarrel (D2's "Guild and non-guild traders
   are fighting over who may sell what ..." and "Rival guilds fought over who may sell what ...") as the share of towns and of
   cities among the 900 lit that print it (from your rendered texts).

## Where things go
- Scripts and small outputs (tables, seed lists): `docs/chair/2026-11-21/eighth/close/close-7/read24/` in the main checkout
  `/home/user/settlement-engine` (CLOSE-7 commits them: N8). Texts and logs: under
  `/tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad/READ-24/`.
- EVERY HEAVY RUN through the mutex, one at a time, to a log, never through a pipe:
  `GATE_MUTEX_MAX_POLLS=400 sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- <command> > <log> 2>&1; echo "exit=$?" >> <log>`.
  A run over five minutes goes in the background; read its log by `tail`.
- REPORT: `docs/chair/2026-11-21/eighth/close/close-7/reports/READ-24.md` (not committed by you): one table (rows A1, A2, B1(i)
  per kind, B1(ii), C1 owner page, C1 player page, D2 guild quarrel; columns the six sizes and the 900), then per item the cause
  with symbols, CONFIRMED/PLAUSIBLE per claim; then D's slots with their TOP shares and the bar's verdict.
- FINAL MESSAGE at most 200 words: each item's count of the 900 in one line, A1's and B1's cause in a sentence each, D's
  verdict in one line.
