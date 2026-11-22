# A STACKED LANDING ON THE WORKING LINE (the eighth chair's standing brief; a helper's whole assignment)

You are a helper of the chair of the settlement-engine program. You land SEVERAL content lanes on the working line in
the order the chair's message gives: each lane is its own merge commit and its own point, and THE GATE RUNS ONCE, at the
top of the stack (the operating standard's rule 8: batches are stacked and land with one refreeze and one full check).
Read first, WHOLE, the seventh chair's brief beside the old record:
`/home/user/wt/chair/docs/chair/2026-11-20/seventh/landing/BRIEF-LANDING.md`. Its seven HARD RULES bind you word for
word (YOU PUSH NOTHING; never `npm run check`; never the whole suite; never `--no-verify`; no reset, clean, stash or
checkout of another branch; you invent nothing; a register moves only by its own door, and a shrink-only door is
raised by nobody; a golden that would move is a STOP). Where this file differs from it, this file governs.

## Where you work
- ONLY in `/home/user/wt/line` (the worktree of `lane/join-2026-11-14`). Before you start: `git rev-parse HEAD` must
  begin with the commit the chair's message names and `git status --short` must print nothing; else STOP and say so.
- Scratch: `/tmp/claude-0/-home-user-settlement-engine/8cf8a422-746a-5d9a-aaf1-7aea4ebc1089/scratchpad/landing/<name the chair gives>/`
  (make it). Every log goes there; never print a whole log into your context: `tail`, and grep the count lines.
- The line's figures: `/home/user/wt/chair/docs/chair/2026-11-20/seventh/ci/LINE-NOW.md`. The line's known failing
  tests BY NAME: `/home/user/wt/chair/docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv` (tab-separated: job, file,
  title, class).
- Heavy runs ONE AT A TIME: `sh scripts/gate-mutex.sh --run -- timeout <seconds> <command...> > <log> 2>&1; echo "exit=$?" >> <log>`,
  never through a pipe. Every vitest run also writes names: `--reporter=default --reporter=json --outputFile=<scratch>/<name>.json`;
  list failing tests (file and full title) from the JSON with a small node one-liner.
- The cloud machine always sets some `GIT_*` variables (certificates, credentials, config keys): leave them. Only
  git's REPOSITORY variables (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and the rest of the list `.husky/pre-push`
  unsets) must be absent when a test runs.
- The last two lines of EVERY commit message you write, after a blank line, are the two trailer lines the chair's
  message gives. Every hour you write in a file is read from `date -u` in the command that writes it.

## STEP 1, for EACH lane in the given order: the merge
a. `git fetch origin <lane>`; the named commit is its tip or an ancestor of it (`git merge-base --is-ancestor`);
   `git merge --no-ff --no-commit <commit>`.
b. CONFLICTS, three classes you may resolve:
   - TABLES WHERE BOTH SIDES ONLY ADD ROWS (`factVocabulary.js`, `registeredWords.js`, `factLayers.js`,
     `presumptionClasses.shared.mjs`, pool data files, `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`, `factHomesLazy`'s
     list, `factsOf.js` getters, `scripts/mutation-coverage-manifest.json`): the union, the line's rows first; a JSON
     file must parse after it.
   - REGISTERS, CENSUSES AND FROZEN LISTS (`.tuning-register.json`, `.tuning-inventory.json`,
     `.lighting-census-baseline.json`, `.writer-reach-baseline.json`, `docs/content/wiring-census.json`, pool-dominance
     rows, size baselines): the line's side; they are re-taken in step 2.
   - A TEST'S OWN DATED NOTES WHERE BOTH SIDES ONLY ADD COMMENT LINES at one spot (ruled by the chair on
     `tests/components/dossierPhoneFloorAllViews.test.jsx`, 2026-11-21): keep both notes, the line's first, then the
     lane's. This covers comment lines only: a conflict that touches a figure or a line of code is not this class.
   - ANY OTHER CONFLICT: record the file, the symbol and both sides (at most 12 lines a side) in your scratch
     directory, `git merge --abort`, mark that lane NOT LANDED, and GO ON to the next lane (the chair's message says
     whether the lanes are independent; if it does not say so, stop).
c. Commit the merge: `Merge <lane> at <short commit>: point <n> (<the chair's title>)`, the body naming each conflict
   and how it was resolved, then the trailers. A lane that did not land takes no point number: the next lane that
   lands takes the next number.

c2. WHAT ROSE (added 2026-11-22 04:24 UTC, after a seat showed how a merge can raise a shrink-only row with no gate reading
   it: a lane that took its own side of a register, a door that only tightens, and at the landing no conflict left
   to send the row back to the line's side). Once every merge of the stack is committed:
   `python3 -I /home/user/wt/chair/docs/chair/2026-11-21/eighth/landing/raised.py <the commit the chair's message names> HEAD > <scratch>/raised-merges.txt`
   and once more after step d's doors (`raised-top.txt`). It reads git objects only. It lists every register leaf
   that rose and every named ceiling or budget that moved. YOU JUDGE NOTHING AND CURE NOTHING BY IT: in your final
   message give the file lines of `raised-top.txt` (the lines that do not begin with a space) and, in full, every
   `ROSE` or `moved` line that names a ceiling, a budget, a ratchet, or a row of `scripts/.writer-reach-baseline.json`
   outside `scanStats`, `scripts/census/pool-dominance.register.json` outside `lines` and `census`, or any
   `*baseline*.json` under `scripts/` or `tests/copy/`, with the landed lane whose merge brought it
   (`git log --oneline <base>..HEAD -- <file>`). The chair reads them before it pushes.

## STEP 2, ONCE, at the top of the stack: registers, then the gate
d. `npx vitest run tests/lint --maxWorkers=3` whole. Each red that is a register OWED TO ITS DOOR (its own message
   names the door: the lighting census `LIGHTING_CENSUS_REFREEZE=<n> LIGHTING_CENSUS_NOTE="<why>" npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`;
   the wiring census `node scripts/wiring-census.mjs`; writer-reach `node scripts/check-writer-reach.mjs --write`
   ONLY IF its own report shows no identity new and nothing raised, else leave it red and report; pool dominance
   row-wise by its message, never raised; the tuning inventory by its door where no value moved) is re-taken by that
   door on the clean committed tree, each door its own commit (`chore(registers): points <a> to <b>: <which>, by its own door`
   with the before and after figures), and its file re-run plainly. Then `tests/lint` whole AGAIN if any door ran.
e. Then, each to a log: `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`;
   `npm run build`; `VERIFY_DIST=1 npx vitest run tests/build --maxWorkers=3` (the whole directory).
f. Then ONE run of the lanes' own test directories, the UNION over every landed lane: for each landed merge take
   `git diff --name-only <merge>^1...<merge>^2 -- src` and collect: `tests/generators` and `tests/data` for
   `src/generators/**` or `src/data/**`; `tests/components` and `tests/pdf` for `src/components/**` or `src/pdf/**`;
   `tests/domain/<dir>` for each `src/domain/<dir>/`; `tests/kernel` for `src/kernel/**`; `tests/store`, `tests/lib`
   for those. ALSO (added 2026-11-21 after the first stack showed the hole): EVERY TEST FILE A LANDED LANE ITSELF
   CHANGED OR ADDED, wherever it lives (`git diff --name-only <merge>^1...<merge>^2 -- tests`: each `*.test.js` or
   `*.test.jsx` not already inside a directory run whole), and, for a `src` file directly under `src/domain/` (no
   sub-directory), the `tests/domain/*.test.js` files that name its module. AND THE GOVERNING SUITES OF EVERY
   CHANGED MODULE (added 2026-11-22 after CI found 26 reds no gate had run; the standard's rule 40 addendum (b)):
   for every `src` file a landed lane changed or added, every test file ANYWHERE under `tests/` (outside the
   directories already run whole) that names that module's basename or imports from its directory's generated
   leaves: `grep -rlE "<basename without extension>" tests --include='*.test.js' --include='*.test.jsx'`; for a
   lane that touches `src/data/dossierStateProse/` that is every `tests/domain/*StateProse*.test.js`,
   `tests/domain/corpus*Guards*.test.js` and their kin. List the files you added by this rule in your scratch
   directory (`governing-files.txt`). `--maxWorkers=3`, `timeout 7200`.
g. CLASSIFY EVERY FAILING TEST of d, e and f BY NAME: (1) on `RED-AT-LINE.tsv` (file and title); (2) on the chair's
   message's list of reds it has already ruled; (3) a register cured by its door above; (4) ANYTHING ELSE: do not
   cure it; record the file, the full title, the first two lines of its message, and WHICH LANDED LANE touches the
   file or the module it names (`git log --oneline <base>..HEAD -- <path>` tells you).

## STEP 3: the rows
h. Append one row a landed point to the table in `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md`, in the form of the
   rows above it: the merge commit, the lane and its commit, the conflicts and their resolution; then ONE shared
   sentence for the stack's gate (the register commits, the checks' counts, first paint's three figures, the
   worker's and the engine chunk's at the top of the stack beside the line's previous ones, and what the stack
   leaves red BY NAME that the list did not hold). Commit: `docs(landings): points <a> to <b> (<the stack's title>)`.

## Your final message to the chair (at most 350 words and one table)
The table: one row a lane: LANDED or NOT LANDED, its point, its merge commit, its conflicts. Then: the register
commits; the gate's results as counts (d, e, f); the five size figures beside the line's previous ones; EVERY red of
class (4) by file and full title with the lane you attribute it to; the worktree's HEAD and `git status --short`
(must be empty). Say CONFIRMED for what you executed and PLAUSIBLE for what you only read. If your own permission
check refuses a command, the refusal stands: say which command, and stop there.
