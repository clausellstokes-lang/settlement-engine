# DAILY-3 · U4b — WHAT NO LONGER PRINTS LEAVES (the chair's word of 2026-11-22 05:59 UTC)

The chair: "`buildLocalDailyLifeNarrative` with `DAILY_LIFE_LOCAL_CRISIS_SCOPED` and its helpers (dead since point 95),
`dailyLifeLogic.js :: dailyLifeOfferLine` with its test, their rows in `docs/census/declarations/DAILY_LIFE_TAB.json`,
and every census or register that counted them, each by its own door with every row that leaves named (about fifteen
files and eight registers by the page builder's count); the sameness census's stale row 'Generate Daily Life: Narrative
refinement' by that census's door."

Read whole, once: this file; `CLAUDE.md`; `src/components/new/dailyLifeLogic.js`; `src/components/new/tabs/DailyLifeTab.jsx`;
the files that name a removed symbol (`grep -rn` for each; at the lane's tip they include `tests/components/dailyLifeOffer.test.js`,
`tests/domain/facts/census2eTables.test.js`, `docs/census/declarations/DAILY_LIFE_TAB.json`,
`docs/census/declarations/CULTURE_PROFILES_DAILY.json`, `scripts/census/sameness-census.register.json`). Nothing wider
than these, the doors you run, and the tests you run.

## Where you work
Worktree and branch named by DAILY-3 at dispatch (`lane/daily-3-2026-11-22-4b-wip`), cut from the lane after the line's
merge. Trailer `Claude-Session: https://claude.ai/code/session_01ACmDYYZpEdm9Ag2ikDGTf9`. You commit; you do NOT push or merge.

## The unit
1. FIRST PROVE IT DEAD: for each symbol you remove, the grep of its callers in `src/` (and `supabase/`) at the tip, in the
   commit message. A symbol with a live caller is NOT removed: STOP and report it.
2. Remove `buildLocalDailyLifeNarrative`, `DAILY_LIFE_LOCAL_CRISIS_SCOPED`, the helpers only they use, and
   `dailyLifeOfferLine` with its test (`tests/components/dailyLifeOffer.test.js`); the imports that named them.
3. The registers the page's builder counted (DAILY-3.txt 4b): the presumed-things and presumption-classes registers, the
   defence fact readers, the fact layers, the style-law baseline, the tuning inventory, the observed-shape baseline
   (`node scripts/check-observed-shape-readers.mjs --write`; the checkout's history is deep), the mutation manifest; a
   SHRINK-ONLY door is raised by nobody; ONE builder, ONE commit. Every census, declaration and register that counted them, EACH BY ITS OWN DOOR (find each door: the file's `_doc`, its
   walker's header, or `scripts/`), never by hand where a door exists; every row that leaves NAMED in the commit message,
   by file. The sameness census's stale row "Generate Daily Life: Narrative refinement" by that census's door.
4. NOT YOURS (report, do not touch): `src/lib/emailTemplates.js`, `src/copy/en.js`, `supabase/**` (the AI path, the
   e-mail and pricing copy are the owner's); `src/pdf/**` (unit 4c); `src/domain/**`, `src/data/**` (other units). A copy
   key read only by removed code: NAME it in your report; leave it.
5. RED / GREEN: a removal's red is the walker or census that would count a stale row; say which went red before the doors
   and green after. GREEN: `tests/components` WHOLE; every test that named a removed symbol; `tests/lint` WHOLE; eslint on
   touched files; both typechecks; `node scripts/wiring-census.mjs --check` if it exists. Every heavy run through
   `sh scripts/gate-mutex.sh --run -- <cmd>` to a file (shared machine). Known reds not yours: those on the line's list
   (`/home/user/settlement-engine/docs/chair/2026-11-20/content/daily/RED-AT-LINE.96.tsv`, written by DAILY-3).
6. BYTES: removing code may LOWER first paint; DAILY-3 builds and measures it.

## Files you may touch
`src/components/new/dailyLifeLogic.js`, `src/components/new/tabs/DailyLifeTab.jsx` (imports and dead code only; NOT its
`ENGINE_SLOTS` or its print), `tests/components/dailyLifeOffer.test.js` (deleted), the tests that name a removed symbol
(their arms for it only), the census / declaration / register files by their doors. Nothing else; on a mismatch STOP.

Final message: at most 200 words plus one table (file, rows removed, door): commit shas; the dead-proof greps' counts;
red and green with `tests/lint` whole's failing titles by name; the copy keys left; anything not removed and why.
