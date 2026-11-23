# V39-P2 ADDENDUM 2: THE CLASS, 2026-11-23 05:36 UTC

The list: `git grep -l -E 'galleryPayloadFor|applyVeil|projectShareVeil|get_gallery_dossier|get_unlisted_dossier' -- tests ':!tests/security'` gives 34 files (`class/class-files.txt`), the same count as VEIL-38's. The chair's later order (02:43 UTC) added the one security file `tests/security/galleryVeilSignalCopies.pglite.test.js`.

How the runs were made: the 34 in one vitest run (`--maxWorkers=2`, through `sh scripts/gate-mutex.sh --run --`, in the detached scratch /home/user/wt/p2), GIT_* unset. The run started 02:39 UTC; attempts 1-3 gave up (exit 3) and attempt 4 ran 03:42-04:03 UTC. The security file ran alone the same way at 2d7ed483f, 04:03-04:18 UTC. Logs: `class/*.txt`.

## BEFORE: at 2d7ed483f (the tip, S2 not applied). 34 files: 2 red of 867. Security file: 2 red of 5.
| red (file > title) | class | how classed |
|---|---|---|
| tests/lib/gallery.test.js > "a share marked with a veil renders through it: the defaults hide, a delta shows" | (A) rule (e) | CONFIRMED: P2-MEASURE.md's bisection (green d6d8644b2, red 369331d72) |
| tests/security/galleryVeilSignalCopies.pglite.test.js > "server-veil-city-2 (current's stored shape): every family grouping shut alone, every copying surface, no derived block; the control draws it" | (A) rule (e) | CONFIRMED: the one test green at d6d8644b2, red at 369331d72 (`class/signal-city2-current-*.txt`) |
| same file > "server-veil-city-2 (master's stored shape): ..." | (A) rule (e) | PLAUSIBLE, not run alone: the same assertion at the same line (305), and the town and the code path are the same |
| tests/domain/display/criminalVeilSwitch.test.js > "VS1 acceptance on the projection, over twelve births" > "(a)-(e) hold on every birth, plain and DM-revealing" | (B) OTHER | by excerpt; not run at the two commits |

The (B) red, its first two lines: `AssertionError: some copy carries the crime types, or the other teeth prove nothing: expected 0 to be greater than 0` / `❯ tests/domain/display/criminalVeilSwitch.test.js:410:102`. By excerpt (lines 359-361, 410): `teeth.other` counts only the copies where `servedAs['safety crimeTypes']` (after `minusWithheldAlways`) is defined. The registry now withholds `crimeTypes` always, so that count is 0. That is unit (viii)'s withhold-always (c2625fb1f), PLAUSIBLE. It is not rule (e): rule (e) touches `availableServices.criminal` only. NOT cured, not touched.

## THE RESTATEMENT: commit 23bb8b8ae on lane/veil-39-2026-11-23-tip (test-only, 2 files; not pushed)
- gallery.test.js (S2): (1) 'Black market' is a criminal house the deltas show (card + services field + block), so its row STAYS (toEqual the row). (2) The same block delta with no such house: the criminal services are served as `[]`, and the row's words ('Contraband goods', 'Restricted goods', 'Black market') are absent from the served dossier. That absence is anchored by face (1) through `expectPresentThenAbsent`, because the anchor walker refused a bare `not.toContain`.
- galleryVeilSignalCopies: `SERVICES_ACCOUNT` pins one half per town.
  - city-2 'unlisted': served `[]`, the town was born with rows, and every born row's name and desc are absent from the open page (anchored).
  - town-2 'accounted': every served row is accounted for and stays, and shutting the block still removes lines.
  - Measured on the way: town-2's surviving rows are accounted for by a crime-type TAG, not by a listed house. The house-listed face is therefore said in gallery.test.js only.

## AFTER: at 23bb8b8ae. 34 files + the security file, one mutex run, 05:05-05:22 UTC: 1 red of 872
- The one red is criminalVeilSwitch VS1 "(a)-(e) hold on every birth, plain and DM-revealing", class (B), unchanged.
- The gallery test is green (and 50/50 alone). The security file is 5/5 (also 5/5 alone, 04:49-05:04 UTC).

## tests/lint whole at 23bb8b8ae (through the mutex, 05:22-05:35 UTC)
- 48 failed of 3,304 (17 files), the same as the tip's 48. The same 17 failing files as at 2d7ed483f (`class/tip-lint-*failfiles.txt`).
- In the anchor walker, gallery.test.js's entry is gone (it was 5 negatives over a ceiling of 4 while the first draft was bare). galleryVeilSignalCopies' one pre-existing entry stays (`civPage ... not.toContain(FLAGGED)`, which moved from line 253 to 261).
