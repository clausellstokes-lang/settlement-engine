# V53-FAILCLOSED: FAIL-CLOSED PAGES (the chair's RULING V6 (b) and (c), with V4; sized in `out/v53/pages/SIZING.md`)

ONE BUILDER, THREE COMMITS, on a NEW branch `lane/veil-53-2026-11-24-pages-wip` cut from the cures branch's tip 1ffb2328b
(`git -C /home/user/join53 worktree add -b lane/veil-53-2026-11-24-pages-wip /home/user/pages53 1ffb2328b`; `node_modules` and
`.husky/_` symlinked from `/home/user/join53`). Commit by explicit paths with the hooks; never push; no pull request; no network; no
hosted database; never the `supabase` command; `supabase/migrations/**` NOT touched (this unit is page-side only).

READ FIRST, WHOLE: `out/v53/pages/SIZING.md` and `slice-table.txt` (the pairs); `src/domain/display/galleryWithholdAlways.js ::
withholdAlways` (the always-withheld keys, each with its `// registry:` row); `src/domain/veil/rosterChoiceRegistry.js` (grep the rows
by id only); `src/domain/veil/pageRederive.js :: rederiveForPage`; `src/domain/display/governanceAccount.js :: wholeBreakdown` and
`BREAKDOWN_WITHHELD_TERMS` (cure A: the same family, already fail-closed). Find the page code by its printed words (grep
"Criminal opportunity", "Defense readiness", "Law & order", "Labor capacity", "Life goes on as usual", the Defense tab's safety
sentence, `criminalStructureOf` / the ring note's `withRingVantage`). Read whole every src file you change.

## THE LAW (V6 (b)): every page reader of an ALWAYS-WITHHELD key prints NOTHING where the key is absent
No band read from nothing, no default sentence, no "little has changed / life goes on as usual"; the OWNER'S OWN READ UNCHANGED,
ASSERTED (the owner's record still prints each line as before). A reader that can tell "absent because withheld" only by the key's
absence treats absence as "say nothing" on the shared path; where the same reader serves the owner, the owner's record carries the
key, so it prints as before (assert it).

## COMMIT 1: THE (C) CLASSES, RED FIRST PER CLASS (one new test file, e.g. `tests/components/failClosedSharedPage.test.jsx`, a
describe per class; each arm: the slice's birth(s) named in SIZING.md, P0 (the owner's public read) prints the line, P1 (the veiled
read, nothing hidden) prints NOTHING for it (not a different band, not a default); red against the old code, quoted)
- Foundations bands: "Criminal opportunity" (safety capture/ratio/crimeTypes), "Defense readiness" (defence.readiness.score;
  conditions.severity), "Law & order" (safety: the GAINED tile included: a tile the owner's read lacks must not appear), "Labor
  capacity" (conditions.severity): the tile is NOT PRINTED where its key is absent (or prints its label with no band, whichever the
  component's shape allows WITHOUT inventing a value: say which and why).
- Daily Life's legacy slot: where `history.legacyAnnotations` / `siegeNarrative` is absent, the slot prints no default sentence
  ("Life goes on as usual, and nobody can point to anything new." and its siblings): nothing.
- Defense's safety sentence (r2s-under_siege-town-0): nothing where its key is absent.
- THE RING NOTE (the chair's class of its own, 23:27): the shared Defense tab prints NO ring note where the page cannot decide the
  variant (`tests/components/defenseRingNoteProjection.test.jsx`, soak1k-11, -41: RED FIRST by executing the false original vantage
  "the ring keeps the streets quiet" on soak1k-11, then nothing; the owner's seeded variant unchanged, asserted).
- NOT IN THIS UNIT: the "Ruling authority", "Strength of the powers", "Social trust" tiles moved by VR31's re-derived shares (the
  lane's ruled design; listed); every LOST line (listed, V4).

## COMMIT 2: THE TOTALITY WALKER (V6 (c)), a lint arm (a walker file named as walkers are; its row in the mutation manifest)
For EACH always-withheld key of `withholdAlways` (read its `// registry:` rows and the paths they withhold, at run time, not a copied
list), every PAGE READER that reads that path (a static scan of `src/components/**` and the page-side `src/domain/display/**`,
`src/domain/dailyLife*`, as the hideable walker scans: by property path), and for each reader its FAIL-CLOSED ARM (a register:
reader `file :: symbol` -> the test title that proves it prints nothing on absence, or a reason it is not a page reader / owner-only).
A reader of an always-withheld key with NO ARM REDS; a register row naming no reader REDS (stale). Plant: a new reader of a withheld
key in a scratch copy reds the walker (a control `it`). IN IT: readiness and severity (V6: a wrong band is not a listed loss);
cure A's governance paragraph (its arm: fortuneLastingSentence); AND VEIL-55's item: `governanceAccount.js ::
BREAKDOWN_WITHHELD_TERMS` held EQUAL to the registry row `legitimacy.breakdown`'s withheld terms (a term added to the row later reds).

## COMMIT 3 (only if needed): any reader commit 2 finds that commit 1 did not cure: cured the same way, red first, in this commit.

## RUNS (through `sh scripts/gate-mutex.sh --run -- ...` from /home/user/pages53, never through a pipe, retry on exit 3; MEMORY
IS TIGHT: one vitest at a time, `--maxWorkers=2` for a directory, `--maxWorkers=1` for tests/lint whole)
After each commit: the new and changed test files; every test file naming a src file you changed (count it); after commit 2/3:
`tests/lint` WHOLE (expect 65, the trial join's 66 less recentConflictReaders; name any other); `tests/components` files that name a
changed component plus `dossierPhoneFloorAllViews`, `publicProseEquality`, `publicProseVeilInvariance` (COMMON-EIGHTH 14 (d)).
Partial notes to `out/v53/failclosed/NOTES.md` as you go; commit each commit as soon as green.

## FINAL MESSAGE (at most 200 words)
The commit hashes; per class: the red quoted and the green; the readers the walker found (count; how many with arms; any cured in
commit 3); the owner's-read arms; tests/lint whole and the components runs against the known reds.
