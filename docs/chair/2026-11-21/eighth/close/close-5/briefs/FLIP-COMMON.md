READS WHOLE: this file, your unit's brief beside it, and every test file you change (each once, before its first edit). YOUR WINDOW: 1,000,000 tokens (the middle tier). NOTHING ELSE WHOLE: logs by `tail`, tables by `grep`/`awk`.

# THE FLIP'S BUILDERS: THE COMMON LAW (CLOSE-5's briefs; the ninth chair's rulings in `close/FLIP-PLAN.md` section 5)

You build ONE unit of THE FLIP (switching the two new birth laws, WHO RULES and FORTUNE, on for new places) for CLOSE-5,
who integrates: it reads your diff once and re-runs your reds and greens. You do not message the chair.

## Where you work
- The worktree `/home/user/wt/flip`, branch `lane/close-5-2026-11-23-flip`, at the tip CLOSE-5 names in your prompt. Its
  `node_modules` and `.husky/_` are links to the main checkout's: leave them.
- Commit ONLY your unit's paths, by explicit pathspec (`git add <path>…`, never `-A`, never `.`), ONE commit unless your brief
  says more, with the receipts in its message (what moved, why, the runs and their counts). Never `--no-verify`, never amend,
  never rebase, never push, never merge, never touch another branch or worktree. No `supabase`, no network database.
- One heavy run at a time, always through the mutex: `GATE_MUTEX_MAX_POLLS=400 sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- npx vitest run <files> --maxWorkers=3 > <log> 2>&1; echo "exit=$?" >> <log>`. Logs in
  `/tmp/claude-0/-home-user-settlement-engine/c4c5e7a5-54f3-5364-a337-92ee45f01117/scratchpad/flip/<unit>/`. Read a log by `tail`.
  Never read a gate through a pipe. Never run a test with `GIT_DIR`, `GIT_WORK_TREE` or `GIT_INDEX_FILE` set.

## What may never happen
- No golden, reference snapshot, tuning signature or size figure is recorded or signed (`goldenRecordDoor.js :: recordGolden`
  refuses without the owner's signed record; never set `UPDATE_GOLDEN`, never write a shift record).
- No assertion is weakened, deleted, skipped (`.skip`, `.todo`, `it.fails`) or loosened (a `toBe` to a `toContain`, a count
  to a `>=`); no sample size or seed corpus is shrunk; no test is moved to another file.
- No `src/` file is touched unless your brief names it.

## How a value is re-pinned (the census's classes; every value READ FROM THE FLIPPED TREE BY RUNNING THE TEST, never copied)
- BORN ANCHOR (a value pinned on a born town): re-pin to what the flipped tree prints, and say in a comment on the line
  above, in the file's own style, that it is the lit birth's value (the flip, <date from `date -u`>).
- PREMISE (a seed chosen to meet a case that it no longer meets): RE-PICK the seed by the PREMISE'S OWN PREDICATE, never by
  the outcome the test asserts (FORTUNE-C's idiom in `tests/generators/people/dualHatPoliticalMass.test.js`: the lowest seed of
  the same family that meets the premise lit). A corpus pool row that names its door is re-keyed by that door.
- STORED PIN, an in-test count: re-measured in the test (the count the flipped tree gives), the old figure in the comment.
- A NEGATIVE ASSERTION keeps its anchor: `// anchored:` on the assertion's own line or the ONE line above it (never wrapped).
- A STOP: a red whose new value no cause explains (the census row's cause, the lanes' paper flip lists), a red that is not on
  your brief's list, a green that turns red, an assertion you could only keep by weakening it. STOP means: no commit; write
  the case (file, full title, the first two lines of its failure, what you read) in your report and end.

## After your edits, before the commit
1. Your files, lit, through the mutex: every row of your list GREEN, nothing else red.
2. `tests/lint` whole through the mutex (several walkers read the test corpus): only the line's three listed rows red
   (`proseComposed` A0b; `proseCorpusBytes` RAW and GZIP). A register red because titles changed (the lighting census:
   `tests/lint/sovereigntyLightingContract.walker.test.js`) is NOT yours to re-take: name it in the report; CLOSE-5 re-takes it
   by its door in its own commit.
3. `npx eslint <your files>`: exit 0.

## Your report
`docs/chair/2026-11-21/eighth/close/close-5/reports/<UNIT>.md` (in the main checkout `/home/user/settlement-engine`, NOT committed by you): the
commit sha; per file the rows moved, old value, new value, its cause in one line; the runs with their counts; every STOP.
Your final message: at most 200 words, the commit and the counts, CONFIRMED vs PLAUSIBLE in one sentence.
