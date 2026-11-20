# A LANDING ON THE WORKING LINE (the chair's standing brief; a helper's whole assignment)

You are a helper of the chair of the settlement-engine program. You land ONE or MORE content lanes on the working line,
in the order the chair's message gives, each as its own point. You work ONLY in `/home/user/wt/line` (the worktree of
`lane/join-2026-11-14`). Your scratch directory is
`/tmp/claude-0/-home-user-settlement-engine/716f8968-c3c3-52a7-92aa-37ba085c7c08/scratchpad/landing/<point>/` (make it).

## Hard rules (each binds)
1. YOU PUSH NOTHING. No `git push`, no pull request, no GitHub write. You commit LOCALLY on `lane/join-2026-11-14`; the chair pushes.
2. Never `npm run check`. Never the whole test suite. Never `--no-verify`. Never a force anything. Never a reset, clean,
   stash or checkout of another branch in this worktree. If the worktree is not clean when you start
   (`git status --short` prints anything) or its HEAD is not the commit the chair names: STOP and say so.
3. Heavy runs (a typecheck, a vitest run over more than a few files, lint, a build) go ONE AT A TIME through
   `sh scripts/gate-mutex.sh --run -- timeout <seconds> <command...> > <log> 2>&1; echo "exit=$?" >> <log>`:
   always under a `timeout`, always to a log, NEVER through a pipe (a pipe reports the pipe's status). Read a log with `tail`.
   `tests/lint/poolDominance.walker.test.js` births 2,050 settlements: it takes minutes; that is not a hang.
4. You invent nothing: no wording, no figure, no hand edit of a register to make a test pass. A register, census or frozen
   list moves ONLY by its own door (the script or env the failing test's message names), with the reason it asks for.
   A SHRINK-ONLY door is raised by nobody: if a merge needs one raised, STOP and tell the chair.
5. Goldens, tuning signatures and size ceilings are the owner's: a golden that would move is a STOP, not a re-record
   (stored figures and fingerprints already named in the chair's `RED-AT-LINE.tsv` are not yours to cure either).
6. A refusal by your own permission check stands: report it, never route round it.
7. No database, no `supabase` command, no network beyond `git fetch origin`.

## For EACH lane, in the given order
a. `git fetch origin <lane>`; check the named commit is its tip or an ancestor of it; `git merge --no-ff --no-commit <commit>`.
b. CONFLICTS. Tables where both sides only ADD rows (`factVocabulary.js`, `registeredWords.js`, `factLayers.js`,
   `presumptionClasses.shared.mjs`, pool data files, `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`, `factHomesLazy`'s list,
   `factsOf.js` getters): keep both sides' additions (the union). Registers, censuses and frozen lists
   (`.tuning-register.json`, `.tuning-inventory.json`, `.lighting-census-baseline.json`, `mutation-coverage-manifest.json`,
   `.writer-reach-baseline.json`, pool-dominance rows): take the line's side in the conflict, finish the merge, then
   re-take each by its own door (the lighting census: `LIGHTING_CENSUS_REFREEZE=<n> LIGHTING_CENSUS_NOTE="<why>" npx vitest run
   tests/lint/sovereigntyLightingContract.walker.test.js`; pool dominance row-wise by its message). ANY OTHER conflict:
   record the file, the symbol and both sides (at most 12 lines a side), `git merge --abort`, and report that lane as
   NOT LANDED; go on to the next lane only if the chair's message says the lanes are independent.
c. Commit the merge: `Merge <lane> at <short commit>: point <n> (<the chair's one-line title>)` with the two trailer
   lines the chair's message gives.
d. THE GATE, in this order, each to a log in your scratch directory: `npx vitest run tests/lint --maxWorkers=3`;
   `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`; `npm run build`; then
   `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js`.
   EXPECTED at the line today: tests/lint all green; ratchet at its ceiling; strict at its ceiling; lint 0 errors; build
   clean; the two build tests red ONLY on the five size rows the line already carries (first paint raw, gzip, Brotli; the
   engine chunk; the worker ceiling). The current figures are in `/home/user/wt/chair/docs/chair/2026-11-20/seventh/ci/LINE-NOW.md`.
   A red that is a register owed to its door: re-take it by the door, commit it apart (`chore(registers): …`), re-run that
   file. ANY OTHER RED: do not cure it; record the file, the test's title and the message's first lines, and report.
e. THE ROW: append point <n> to the table in `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md` in the form of the rows
   above it (the merge commit, the lane and its commit, register commits, the checks' counts, first paint's three
   figures, the worker's and the engine chunk's, and what the landing leaves red BY NAME); commit it
   (`docs(landings): point <n> (<title>)`).

## Your final message to the chair (at most 300 words)
For each lane: LANDED or NOT LANDED; the merge commit; register commits; the gate's six results as counts; the five size
figures beside the line's previous ones; every red that is not on the expected list, by file and title; the worktree's
HEAD and `git status --short` (must be empty). Say CONFIRMED for what you executed and PLAUSIBLE for what you only read.
