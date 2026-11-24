# HOOKS-BUILD: a trouble's hooks from a pool by need, three kept. PAGE-7's brief, 17:01 UTC 2026-11-20 (dispatched AFTER the causes merge)

THE OWNER: "So do what you can to comprehensively fix the sameness fault as much as you can". THE CHAIR ruled the lines
(16:35, 17:00): the pools are `lines/TROUBLE-LINES-2.md` (78 hooks: today's 24 behind their needs + 54 new) and
`lines/TROUBLE-LINES-3.md` (8 more; guild 15 as the chair reworded it): crime_wave 16, guild_conflict 16, resource_scarcity,
external_threat, succession_crisis, outside_debt, legitimacy_crisis, corruption_scandal 9 each. Each line's `needs` is
the atom(s) in its row (all existing vocabulary atoms). Read first: `briefs/BUILDER-RULES.md`, `TROUBLE-LINES-1.md`'s
sections "Where today's lines come from" and "How the lines are chosen" (the mechanism; its effects parts do NOT apply).

THE MECHANISM (no new draw): where `buildHistoricalEvent` / `tensionByMemory` store a current tension's `plotHooks` for
these eight kinds, the hooks come from the kind's pool: a line is admitted where its needs hold through
`drawDeclared.js` (the declared door the presumedThings walker credits; read only), ranked by
`fnv1a32(`${seed}::trouble::${kind}::hook::${text}`)` highest first, the top THREE kept; the stored array keeps its
length (3). The pool belongs to the KIND: `byMemory.unanchored.plotHooks` for these kinds goes. Find how
`LEGITIMACY_HELD_TWINS` / `legitimacyHeldTensions` (also run in `rosterText.js :: settleTensionsToRoster`) swap hooks for an
approved seat, and keep that swap true (report how). Lasting effects are NOT touched (a later unit). Other kinds untouched.

FILES: NEW `src/data/troubleHooks.js` (data only: `TROUBLE_HOOKS[kind] = [{ text, needs }]`); `src/data/historyData.js`
(the eight kinds' hook arrays and byMemory hook copies only); `src/generators/historyGenerator.js` (the one call site);
tests; the mutation manifest row if a new src file needs one. One builder at a time in historyGenerator.js/historyData.js.

ARMS (red first; compute, never quote, per `tests/helpers/drawnProse.js`): totality (eight kinds, the ruled counts, ≥4
need-free a pool, every need a known atom); three hooks every tension of these kinds on 150 towns a size, 0 short lists;
no hook whose need fails is ever stored; same seed, same hooks; `toPublicSafe` default mode carries 0 `plotHooks` (the
chair's arm: keep or add). MEASURE (150 a size, script under `measures/page-7/hooks/`, through the BUILT generator): the
bar, top share of one hook ≤ ~15% and second-place share < 30%, by size. Report the stored fingerprints moved (goldens),
before and after, signing none.

GREEN: your tests; every test file of a module you changed; `tests/lint` whole (reds not yours: ledgerCitationIntegrity;
the two censuses are PAGE-7's); `typecheck:ratchet`, `typecheck:domain:strict`, `lint`; every run to a file through
`sh scripts/gate-tail.sh`. Work in your own worktree on `lane/page-7-2026-11-20-hooks` cut from the commit PAGE-7 gives;
commit by explicit paths with receipts; never push or merge. Reply ≤250 words.
