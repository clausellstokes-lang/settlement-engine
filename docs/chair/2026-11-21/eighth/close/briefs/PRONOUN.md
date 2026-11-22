# BRIEF PRONOUN: A LATER MENTION THAT IS A CLAUSE'S SUBJECT TAKES THE SUBJECT PRONOUN (CLOSE-2 unit 3c; the chair's E117)

STATUS: dispatched by CLOSE-2. ONE builder, worktree `/home/user/wt/pronoun`, branch `lane/close-2-2026-11-22-pronoun-wip`,
cut from the working line's tip c1144ba18 (point 102). Nothing of the close's on it. YOU COMMIT ON THAT BRANCH BY
EXPLICIT PATHS (never `git add -A`), NEVER PUSH (CLOSE-2 pushes the -wip by name), never `--no-verify`.
EVERY TEST OR NODE RUN of more than one file goes through the gate mutex, to a log, never through a pipe:
`GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- npx vitest run <files> --maxWorkers=3 > <log> 2>&1; echo exit=$? >> <log>`.
THE MUTEX IS SHARED WITH CLOSE-2's FINAL CENSUS, which comes FIRST: if CLOSE-2 tells you to pause, finish the line you
are on and run nothing more until told. Logs by `tail`, never whole. Your scratch: `/tmp/claude-0/-home-user-settlement-engine/42f6469f-2193-55ee-b1bb-cd23b1d653f1/scratchpad/pronoun/`.

## THE FAULT (CONFIRMED on the line)
`src/data/people/personMention.js` (NEW IN THIS RELEASE, not on master; point 77 NAMES) turns a person's later mention into
a pronoun. A later mention that is the SUBJECT of a clause with no opener takes the OBJECT pronoun:
`src/data/npcData.js` ties template `` `${s.name} has asked ${r.name} to back a candidate ${r.name} distrusts.` `` prints
"Haruto Chen has asked Akemi Yang to back a candidate **her** distrusts." THE CHAIR'S READ OF THE CAUSE: `opensClause`
gives the subject only at a sentence's head, after a stop mark or after a listed opener; a later mention that is the
subject of a clause with NO opener ("a candidate NAME distrusts", "the debt NAME owes") takes the object. A crude scan of
the 525 golden configurations found "him/her" + a verb in up to 237 rows (tie tension, tie description,
prominentRelationship), 0 before point 77.

## THE FILES YOU OWN
`src/data/people/personMention.js`; `tests/domain/personMention.test.js`; ONE NEW walker test (a basename that avoids the
mutation manifest's pattern unless it IS an invariant walker owing a row: then its row by the manifest's door); the
registers `tests/lint` reds after your change, each by its own door, each its own commit. READ (do not edit unless the
measure proves a template must change, then STOP and report): `src/data/npcData.js`, `src/generators/people/goals.js`
(the two callers of `secondMentions`), `tests/lint/namesInSentences.walker.test.js`. Read `personMention.js` WHOLE first.

## THE UNIT (in this order)
1. MEASURE FIRST (a script in your scratch): every DISTINCT (template, later mention) pair that prints a pronoun, over
   both callers of `secondMentions` (the ties in `npcData.js`, the wants in `goals.js`), with the word before and the
   word after the mention: the count of pairs, and how many are WRONG today, read one by one (a table in your report
   file). If the measure refutes the chair's read of the cause, STOP and report before any cure.
2. THE CURE IN THE LEAF, BY THE FOLLOWER: the words that follow a person's slot in the templates are a CLOSED set,
   classed by hand: a finite verb (the mention is a subject: "she distrusts", "he owes") versus object contexts that
   stay object ("saw her leave", "had her arrested", "asked her to"). A per-template table ONLY if the classes cannot
   separate the census. The leaf's veil rule (a FIRST mention keeps the full name) is untouched.
3. THE TOOTH: a walker over EVERY template with a person's slot, both genders: a follower in neither class is RED
   ("class it: <template> <follower>"), so no new template can print the fault. Read the existing
   `namesInSentences.walker.test.js` for the estate's walker form; plain tests, not `it.each`.
4. RED FIRST: the found sentences (at least "a candidate her distrusts" and one from `goals.js` if the measure finds one)
   pinned red on the line's tip, then green by the cure. `tests/domain/personMention.test.js` and
   `tests/lint/namesInSentences.walker.test.js` green.

## THE GATE (narrowed by cause: births move in WORDS only, dark and lit)
`tests/lint` whole; `tests/generators/people` whole; every test that names the leaf, its callers' tables, or a sentence
the cure changes (grep `tests/` for each OLD wrong form your measure found; say the count named and kept); the three
walkers (`namesInSentences`, your new one, `personMention`); one `npm run build` then `VERIFY_DIST=1 npx vitest run
tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js` with the five figures (first paint raw / gzip
/ Brotli, the worker, the engine chunk; the line's at point 102: 1,184,741 / 376,987 / 316,646; 2,709,263; 932,369): a
rise is NAMED, signed by nobody. Typecheck: `npm run typecheck:ratchet` and `npm run typecheck:domain:strict`; eslint on
your touched files. Reds are read BY NAME against the chair's red list (`git show
origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv`, 61 rows): a red not on it is yours to
cure or to NAME with its cause (a stored sentence that the cure corrects: name the file and title).

## KEPT LAWS
No golden re-recorded, no stored digest of whole births (the goldens are the owner's: name what moves). No new draw, no
change to which pool line is chosen: only the pronoun's case changes. Cite by symbol. The `ledger` ref
`review-fixes-2026-07-08` is already local (needed by `tests/lint`).

## YOUR REPORT
A file `scratchpad/pronoun/PRONOUN-REPORT.md` (the measure's table, the classes, the commits, the gate's counts by
name). Your final message to CLOSE-2: AT MOST 15 LINES: commits, the measure's counts (pairs, wrong), red-first, the
gate's counts, the five figures, CONFIRMED or PLAUSIBLE on each.
