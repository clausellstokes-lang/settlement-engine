# FRAME-3 · brief B11 — a person in the crisis cast is never "it" (one cause, three families)

Written by FRAME-3, the integrating seat, on `lane/frame-3-2026-11-20`. You are a builder of FRAME-3. You build one unit in one commit, red first.

Read these whole before you edit:
- `CLAUDE.md`
- `src/domain/crisis/crisisCast.js`
- `docs/chair/2026-11-20/content/frame2/B10-PERSON-NOT-IT-RESULTS.md` and the diff of `origin/lane/frame-2-2026-11-20-b10` (`d8a1b1657`) against its base `1fe37f10e`

## The lead

FRAME-2's builder B10 built this cause on its own branch. Its fix was sound, and the seat read every line of it. It came back RED on five tests, and the cause was never cured. Your work is that fix, landed on THIS lane with those reds cured by their cause.

You may take B10's source change as your starting point (`git diff 1fe37f10e d8a1b1657 -- src/domain/crisis/crisisCast.js`, applied by hand to your tree). Then re-verify every claim B10's results make on your own tree: this lane now carries the line's final names work (`e356c94f2`; base `993865a02`). B9 is built beside you in another worktree and touches no file of yours.

## The ruling

The chair's ruling of 2026-11-20 (verbatim in substance; the owner may veto it):

> EVERY `CAST_REASONS` STRING AN `npcRow` CAN CARRY THAT SAYS "it" OR "its" OF ITS HOLDER, one cause, three families: the waverer; `instigatorGains`; and the brunt's `bruntBase`, except `public_legitimacy`, together with their declared siblings.
>
> - A person takes the pronoun of their own `gender`, else "they".
> - A POWER holding the row keeps "it".
> - The fix is red first by a walker over the born crisis pool.
> - Confinement: only those strings move, and only in towns in crisis. A calm town is byte-identical.
> - The five reds are cured by their cause (a matcher or a pin that held the old word), NEVER loosened.
> - The golden rows are an EXPECTED, NAMED stored figure, signed by nobody.

## The reds, and the cure the seat expects for each

Prove each cure yourself; if the record says otherwise, report it instead.

1. **`tests/domain/crisisCast.test.js`, "rule 1".** The test pins a hand-built person with no `gender` to the vocabulary's "its" sentence. Re-pin it to the person form ("… their people"). The fact the test guards is unchanged, so say so in the test.
2. **`tests/domain/crisisCastSeatAndAccess.test.js`, "the readers' two empty seats".** Two `toBe(CAST_REASONS.instigatorGains)` checks fail on a man's row. Re-pin them to that man's person form. The test's guard ("no rival is said to outweigh an empty seat") must still hold, and still be asserted.
3. **`tests/generators/people/castDerived.test.js`.** `relationFor` keys a row by the vocabulary's exact text, so it now skips person rows, and its drawn count (444) falls under the floor of 500.
   - The cure is in the READER. Give `crisisCast.js` ONE exported function that maps a stored reason back to the vocabulary sentence it was drawn from (the inverse of the person form). Have `relationFor` read through it.
   - Keep the floor at 500 and keep every assertion. Grep `src/` for any other reader that matches a cast reason by text, and route it through the same function if it reads one of the three families.
4. **The generator golden master (5 rows), `institutionBudgetPromise` (6 of 60 committed hashes) and the four pinned-mode A-arms on the one golden row.** These are stored figures. NAME each one (file, title, the rows or seeds, the one leaf that moves). Re-record NONE.

## Gates

Every run goes to a file under `<scratchpad>/B11/`. Read the count lines. Never read a gate through a pipe.
- Your walker: red, then green.
- `tests/domain/crisis` whole.
- Every test file that imports `crisisCast.js` (list them with counts).
- The four named stored-figure suites, each red only on the leaves you name.
- `tests/lint` WHOLE: list each red, and say whether it is pre-existing at your base.
- `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`.

**Confinement:** use the shared two-tree tool if the seat has given you its commit, else the B10 method (a base and a tip on born towns, every stored leaf diffed). Report:
- calm towns identical;
- crisis towns without such a row identical;
- every moved leaf is one of these reasons.

No command may run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in its environment. Never edit `package.json`, `package-lock.json`, `supabase/`, `src/domain/veil/`, `tests/security/`, `src/domain/display/`, `src/domain/rulingPower*.js` or the generators.

## Commit

Make one commit in your own worktree, staged by explicit paths (this brief stays the seat's), hooks on, never `--no-verify`. No push, reset or stash, and no checkout outside your worktree.

Your results file is `docs/chair/2026-11-20/content/frame3/B11-PERSON-NOT-IT-RESULTS.md`. The message is `fix(FRAME-3 · B11): a person in the crisis cast takes their own pronoun, never "it"`, with the red and green counts in the body, ending with:

```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1ND6gHTMeBJ9Rqp2Gu
```

Final message, at most 200 words:
- the sha;
- before and after, by family;
- the confinement table;
- the cure of each of the five reds;
- the stored figures named.
