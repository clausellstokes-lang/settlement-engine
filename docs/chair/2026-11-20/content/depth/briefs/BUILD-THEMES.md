# Brief: BUILD-THEMES (DEPTH-3's builder; the theme of a hook in ONE home, no second copy of its text; written 2026-11-20T19:29Z by `date -u`; the chair's order of 19:28 UTC)

THE FINDING (the chair's helper, 19:28 UTC): `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES` is keyed by each hook's FULL TEXT, so every
`NPC_FACTION_LOYALTY` line ships twice, once in `src/data/npcData.js` (worker + a lazy data chunk) and once in `hookThemes.js`, which lands in
the EAGER engine-core chunk (FIRST PAINT): about 12,400 bytes minified of this round's first-paint rise, and tranche 3 would add 8,000-9,000.
THE RULE: no unit of this round may raise the first-paint closure unless a surface first paint renders needs it and the chair has ruled it.

THE SHAPE (DEPTH-3's choice, and why). Two readers classify a hook by its TEXT alone, on a STORED town, at render: `src/domain/dossier/
plotHooks.js` and `src/domain/hookEscalation.js` (`themeOf: (hook) => themeOfText(hook.text)`); they hold no pool index and must not load
`npcData.js`. So the classifier stays text-in, theme-out on first paint, and the text leaves it:
1. THE ONE AUTHORED HOME: `src/data/npcData.js :: NPC_FACTION_LOYALTY_THEMES` (new, exported, frozen): per pool key, an array of HOOK_THEMES
   members INDEX-ALIGNED with `NPC_FACTION_LOYALTY[pool]` (pool key + index -> theme), in the lazy data module beside the lines it tags, each
   value moved from today's table (no theme changes). A tranche appends a theme where it appends a line.
2. FIRST PAINT HOLDS A DIGEST, NOT TEXT: `hookThemes.js` replaces `AUTHORED_HOOK_THEMES` with `THEME_DIGEST`: theme -> the base-36
   `fnv1a32(hookThemeKey(text))` of each tagged line (`src/kernel/proseHash.js :: fnv1a32`, the estate's prose hash), GENERATED from (1) by a
   door script `scripts/hook-theme-digest.mjs` (`--check` exits non-zero on drift; no flag writes), never hand-edited. `themeOfText(text)`
   answers the digest's theme for `fnv1a32(hookThemeKey(text))`, else `untyped`: same signature, same fold, same answers.
   `hookThemes.js` imports nothing from `src/data/` (a walker says so). `HOOK_THEMES`, `UNTYPED`, `isHookTheme`, `hookThemeKey`,
   `THEME_OF_REL_ARCHETYPE`, `themeOfRelArchetype` unchanged. `taggedTemplates` (walker-only today) is retired or answers from (1) in tests only.
3. Every reader's contract kept: `hookVariety.js :: drawUnique`'s theme preference and `npcGenerator.js :: drawLoyalty`/`ownPoolHook` call
   `themeOfText` unchanged; the `*_HOOKS_TRUE_OF_ANY_HOLDER` sets (text matchers inside npcData.js) untouched; a collision is impossible among
   the live pools (a walker proves it) and about 1 in 15 million for a DM's free text (300 tagged lines over 2^32) (it would only reorder that hook's retention, never drop it).

THE TESTS. RED FIRST (record titles and counts): (i) NEW walker `tests/lint/hookTextOneHome.walker.test.js`: no `NPC_FACTION_LOYALTY` line's text
(and no fold of it) occurs in more than one module under `src/`: RED at your base (every line is in two), green after. (ii) `hookThemeTotality.
walker` re-pointed, at full strength: EXACT SET EQUALITY both ways between the live pools and `NPC_FACTION_LOYALTY_THEMES` (every array
index-aligned, every value a HOOK_THEMES member, no row untagged), the digest equal to the one recomputed from the pools (the door's `--check`
in-test), NO TWO DISTINCT LIVE POOL TEXTS SHARE A HASH, `hookThemes.js` imports nothing from `src/data/`; plant an untagged line and an
edited line (scratch, restored): both red. (iii) THE ANSWERS DO NOT MOVE: a fixture written AT YOUR BASE (`tests/fixtures/`: for every live
pool line, `fnv1a32(text)` -> `themeOfText(text)`; plus the same for 50 stored hook texts of births `hxd-<size>-0..4`, typed and untyped),
equal after. Re-point `depthHooksAppended`, `hookThemeDraws`, `hookRetention` where they read `taggedTemplates`, computing, at full strength.
Registers that keyed on hookThemes.js lines (`presumptionClasses.register.json`, `presumedThings.widened.register.json`): rows SHRINK only, by
their own doors; name each row removed.

FILES YOU OWN: `src/domain/hookThemes.js`, `src/data/npcData.js` (ONLY the new themes export), `scripts/hook-theme-digest.mjs` (new), the tests
named above, the two registers by their doors. Branch `lane/depth-3-2026-11-20-themes` cut from the commit DEPTH-3 names at dispatch, in your
own worktree under the scratchpad (symlink node_modules from /home/user/settlement-engine). Commit by explicit paths with receipts; never
push, never `--no-verify`, never `git stash`, no census, never the whole suite, no GIT_* variable in a test run's environment, runs to files
read by count lines via `sh scripts/gate-tail.sh`, one test process at a time. DO NOT run `npm run build` or the tests under `tests/build/`:
DEPTH-3 takes the size proof itself, before and after.
GREEN AT YOUR TIP: the tests above; every test file under tests/ naming `hookThemes`, `themeOfText`, `NPC_FACTION_LOYALTY` or `drawUnique`;
`tests/lint/poolDominance.walker.test.js`; `npx eslint` on touched files; `npm run typecheck:ratchet` and `npm run typecheck:domain:strict`
(to files). ANSWER (at most 200 words): shas; red-first receipts; count lines; register rows removed; the digest's size in bytes.

THE CHAIR'S APPROVAL (19:35 UTC) AND THREE CONDITIONS, binding (DEPTH-3, 19:37 UTC by `date -u`). YOUR BASE: `2582075ed` (the lane with DEPTH-2's
final tip 461272505 merged: hooks tranches 1 and 2 and the recent conflict in). Pools at base: other 100, government 32, military 24,
religious 18, economy 44, criminal 26, magic 8, small_settlement 18 (re-read; STOP on a difference).
(C1) THE DIGEST'S FRESHNESS IS A TEST: red when a pool line is added, moved or reworded without the door being run (plant each, scratch,
restored, record the red), so no later tranche can forget it.
(C2) THE COLLISION WALKER RUNS OVER EVERY TEXT `themeOfText` IS EVER ASKED ABOUT IN THE CORPUS: the live pools AND the stored hooks (every
`npcs[].plotHooks[]` text and every other hook text a reader of `themeOfText` is handed: find them by `plotHooks.js` and `hookEscalation.js`)
of the golden master's towns (`tests/property/generatorGoldenMaster.test.js`'s own births), the census towns (the 720 births of
origin/lane/names-3-2026-11-20 `docs/chair/2026-11-20/content/tools/confinement/born.census.js`; copy it out, do not commit it) and the
stored saves under `tests/fixtures/legacy-saves/`. No two distinct folded texts share a hash, and no text outside the pools hashes to a tagged
line. A stored hook whose text is in NO pool is COUNTED and NAMED (by source and count, a few examples), with the answer it gets today
(`untyped`: the text table equals the live pools by the totality walker) and after (must be the same). Write the corpus scan as a script under
`docs/chair/2026-11-20/content/depth/themes/` with its output beside it; the walker in tests runs over what is cheap in a test (the pools, the
golden's births or a fixture of their folded texts' hashes, the legacy saves), and says so.
(C3) THE BASE FIXTURE OF EVERY ANSWER is taken BEFORE ANY EDIT at `2582075ed` and is equal after for EVERY text in (C2)'s corpus, including the
texts with no theme (fold -> answer; stored as hash -> answer so the fixture quotes no sentence).
HAZARD (DEPTH-2's): run EVERY walker under `tests/lint` that reads a pool or a register you touch (`presumptionClasses`, `presumedThings`,
`poolDominance`, `hookThemeTotality`, the mutation manifest if you add a test file: a new test's basename must avoid its pattern words unless it IS
a walker owing a row; `hookTextOneHome.walker` is a walker: give it its row).
