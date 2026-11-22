# CURE-REWORD-LODGER — red 9, the chair's words (DEPTH-5, the eighth chair's E6 (c); written 2026-11-22T08:24Z by `date -u`)

You are a BUILDER for the DEPTH-5 seat. You build on your own branch `lane/depth-5-2026-11-22-reword-wip` in your own worktree
(the path your prompt names); you commit there by explicit paths; YOU DO NOT PUSH, never merge, never run `npm run build`,
`tests/build`, a census door, a register door (`scripts/hook-theme-digest.mjs` writing included: the integrator runs it) or the
whole suite. One vitest command at a time: `sh scripts/gate-mutex.sh --run -- npx vitest run <files>` (exclusive; a sibling
builder shares the box); output to a log, never through a pipe; no `GIT_DIR`/`GIT_WORK_TREE`/`GIT_INDEX_FILE` in a test's env.

## The red
`tests/lint/styleLaw.walker.test.js`: the struck phrase "a stranger" counts 2 in `src/data/npcData.js` against 1 banked: the hook
"A stranger has taken lodging nearby and is far too interested in their old stories." (`NPC_FACTION_LOYALTY`, hooks tranche 1).
THE CHAIR'S WORDS (E6 (c), ruled 2026-11-21 23:21 UTC), byte for byte: "A new lodger nearby is far too interested in their old stories."
Show the walker red at your base (its failing title and figure, quoted), then green.

## What the rewording moves, and how each is carried
1. `src/data/npcData.js`: that ONE line's text, in place (its index, its pool, its `needs` if any, unchanged). Its theme in
   `NPC_FACTION_LOYALTY_THEMES` stays index-aligned and unchanged (`outsider_suspicion`): confirm by reading.
2. `src/domain/hookThemes.js :: THEME_DIGEST` moves (the line's fold hash): DO NOT EDIT IT. The integrator runs the door after
   your merge. So at your tip `node scripts/hook-theme-digest.mjs --check` exits 1 and `tests/lint/hookThemeTotality.walker.test.js`
   may red on the digest's freshness ONLY: name that red; it is expected.
3. THE ANSWERS FIXTURE BY ITS OWN STEP. `tests/domain/hookThemeAnswersHeld.test.js`'s `pools` part holds the EXACT set of
   `tests/fixtures/hookThemeAnswers.base.json` (taken at 2582075ed, "never hand-edited"). The base file is NOT edited. Add ONE
   step: a committed fixture beside it (e.g. `tests/fixtures/hookThemeAnswers.steps.json`), an ordered list of steps, each
   `{ "cause": "...E6 (c)...", "part": "pools", "retire": [<old hash>], "add": { "<answer>": [<new hash>] } }`, with the hashes
   COMPUTED (base-36 `fnv1a32(hookThemeKey(text))`, the test's own `hashOf`) and quoting no sentence (the base's convention).
   The test composes base then steps for the `pools` part, and asserts: the step retires only hashes the base held, adds only
   hashes it did not, the composed set has 270 members, and every OTHER answer is equal to the base's. The `legacy` and `hxd`
   parts are untouched (a stored save does not hold this tranche-1 line; hxd births are matched, not frozen): confirm each stays
   green. Write it so a later tranche or rewording adds a step, never edits the base.
4. Read `tests/lint/hookTextOneHome.walker.test.js` and `tests/lint/hookThemeTotality.walker.test.js` for any list that holds the
   line's text or hash; DO NOT EDIT those two files (a sibling builder re-points their `process.cwd()` roots): if either needs a
   content change, STOP and report it.
5. Check the new words against `tests/lint/styleLaw.walker.test.js` (every struck phrase) and COMMON-RULES 4 (no "the town"/"a town";
   a hook is a lead a DM can use tonight). Nothing else in the tree is reworded; `docs/` history files are not edited.

## Laws
- Files you may EDIT: `src/data/npcData.js` (that one line), `tests/domain/hookThemeAnswersHeld.test.js`, a NEW
  `tests/fixtures/hookThemeAnswers.steps.json`. A new test FILE would need a mutation-manifest row: avoid one. If `package.json`
  or the lockfile would change: STOP.
- Files you may READ: the above; `tests/fixtures/hookThemeAnswers.base.json`; `src/domain/hookThemes.js`;
  `scripts/hook-theme-digest.mjs`; the two hook walkers and `styleLaw.walker`; `scripts/gate-mutex.sh`'s header. No wider.
- The test's existing claims are kept (no assertion weakened); a negative assertion carries its `// anchored:` comment on its own
  line or the one above (the anchors walker reads the test corpus).

## Proof you hand back (`docs/chair/2026-11-20/content/depth/cure/CURE-REWORD-REPORT.md`, committed; at most 200 words + one table)
- `styleLaw.walker` red at base (quoted) and green at tip; `tests/domain/hookThemeAnswersHeld.test.js` green at tip (all parts);
- `tests/lint` WHOLE at your last commit (COMMON-EIGHTH 11): its count line and every red BY NAME (expected and not yours:
  `hookThemeTotality` digest freshness; the sibling's reds 2-8 in `declaredLineShape`, `drawDeclaredKeys`, `moduleScopeCwdRatchet`,
  `mutationCoverageManifest`, `seedLoopTotality`; the line's `proseCorpusBytes`/`proseComposed` if present);
- the old and new hash; your commits (sha, one line each).

## ADDENDUM 1 (DEPTH-5's ruling, 2026-11-22T08:31Z by `date -u`, on the builder's stop report e467cd425)
(a) THE STEP RETIRES THE OLD HASH IN EVERY PART THAT HOLDS IT (`pools`, `golden`, `hxd`; `legacy` does not hold it: confirm), and adds
the new hash with the same answer in each part where the live corpus now yields it (`pools`; `golden`/`hxd` only if your step is
read as a set there: births are matched, so an ADD is not required where a part is matched, not frozen). Why this is safe: hooks
tranche 1 has never shipped (the depth lane has not landed), so no stored town holds the old text; the cause line says so.
(b) ONE HOME FOR THE COMPOSITION: a new helper `tests/helpers/hookThemeAnswers.js` (not a test file: no manifest row) reads the base
and the steps and returns the composed parts; BOTH `tests/domain/hookThemeAnswersHeld.test.js` AND
`tests/lint/hookThemeTotality.walker.test.js` read the fixture through it, and neither reads the base file directly any more. You
may now EDIT `tests/lint/hookThemeTotality.walker.test.js` for that one change; leave its module-scope `ROOT`/`process.cwd()` line
EXACTLY as it is (the sibling re-points it; the integrator resolves the merge). Every existing claim of both files is kept.
(c) YOU MAY RUN THE DIGEST DOOR: `node scripts/hook-theme-digest.mjs` (it writes only the block in `src/domain/hookThemes.js`), as its
OWN commit after the rewording, then `--check` exits 0. That file is added to your EDIT list for the door's block only.
(d) Then the rest of the brief stands: red/green, `tests/lint` whole, the report (amend it; at most 200 words + one table).
