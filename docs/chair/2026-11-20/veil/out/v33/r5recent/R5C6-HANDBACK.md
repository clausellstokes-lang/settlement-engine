# R5C6: hand-back (second half of R5-RECENT's cure, seated by VEIL-33)

## Summary (read this section; the rest is receipts)
Worktree `/home/user/wt/r5c`, branch `v33-r5cure`: RED commit 8784dd91f (tests only), then the CURE commit (this file's). Nothing pushed, no PR. Written 19:22 UTC 2026-11-22 (`date -u`).
CONFIRMED (executed):
- Reader B `pageRederive.js :: rederiveRecentConflict(doc, {authoritative})` (generatePowerStructure over copies of the served tier, economy, neighbour, config, houses, stress entries). Wired in `rederiveForPage` and in `importRederive.js :: rederiveInPlace` (authoritative). It never names `pressureSentence` (E97 (1)).
- FIDELITY, full pool (480 births, 287 nothing-hidden): 286/287 places reproduce on every read, server and twin, page and import, Reveal off and dm (2288/2296 engine-door reads). LISTED: `r5c2-m3-hamlet-8`, cause witnessed: removing the `coherence_repair` house "Citizen militia" restores the sentence (8 reads). 0 misses of any other cause.
- DIFFERENTIAL, full pool: 193 hiding places, 385 hiding reads, 1540/1540 equal (server and twin, both doors, Reveal off and dm). On those reads, 0 page sentences name a withheld power or house. Server = twin.
- THE COUNT, SERVER beside twin, full pool: a=326, b=90, b on places that hide=57, 2508 engine-reads (11 settings x Reveal off/dm x 2 engines). **c server 0, c twin 0**. Server = twin read for read.
- Plant `galleryVeilRecent.pglite`, standing run: 12/12 green. The arms: 6 plants, 3 teeth (re-stated to absence), fidelity, differential, count. Absence is judged at any depth and in both stored shapes: no `recentConflict` key, no string holding the sentence, no copied `pressureSentence`.
- Walkers: `recentConflictReaders` (new; 4/4; manifest row added) green. `crimeTypesReaders` and `rosterChoiceRegistry` green. `rosterChoiceComposedHosts`: `power.recentConflict` is walked by name as the row that LEFT the composed form (green); the pin re-taken as ORDERED[0] = `history.founding.overcoming`. RED 26, exactly R5-DESC's.
- RED FIRST: 30 red at 8784dd91f over bbad923a5's src (R5C6-red.txt).
- `tests/lint` whole: 48 red = the 26 above plus 22 in the 16 standing files. I checked each: none is in a file of mine or names my code. typecheck OK (167, ceiling 167). eslint clean on the touched files.
- First paint +0: every chunk of the entry closure has the same bytes as the baseline build at bbad923a5 (raw 1,175,552), and the entry differs only in chunk-hash names. VERIFY_DIST still reds 4 budgets, each already over at bbad923a5 by the same bytes (worker 2,579,751; closure raw 1,175,552; Brotli 314,122 against 314,071 at baseline, the difference from hash names only; lazy engine chunk 910,255 against 910,247).
- 212 sha256 `ff20ed89e3e67240…` (unchanged). 211 and 210 not touched.
FINDING FOR THE SEAT (not fixed, outside my manifest): `tests/security/galleryWithholdAlways.pglite.test.js` MAIN reds 42 reads. It treats the copy row `power.recentConflict.pressureSentence` as unconditional, and so flags a served `pressureSentence` that is not the sentence. That serving is correct under E97 (1). The fault comes from R5C5's registry row, not from this half.
PLAUSIBLE: master's records hold the sentence only at `powerStructure.recentConflict` (origin/master's writers, by grep). The plant's master shape is green by absence at any depth, but no born record of master's shape was scanned. So seat note (1) is no STOP.
Files: `src/domain/veil/pageRederive.js`, `src/domain/veil/importRederive.js`, `tests/security/galleryVeilRecent.pglite.test.js`, `tests/lint/recentConflictReaders.walker.test.js`, `tests/lint/rosterChoiceComposedHosts.walker.test.js`, `scripts/mutation-coverage-manifest.json`, this folder's R5C6-* receipts.

## Receipts
- Full-pool fidelity: `R5C6-pool.measures.txt` (line "R5C6 fidelity (full pool)"). That single run was stopped at the shell's 1 h limit during its differential arm. The differential and the count were then re-run in 4 shards side by side under one gate hold (`R5C6-shards.sh 4 "DIFFERENTIAL|THE COUNT"`, exit 0, 17:24 to 18:08 UTC). Each shard's line is in the same file, and the figures above are their sums.
- The pool can be re-run with `R5C6_POOL=full` (optionally `R5C6_SHARD=i/k`). The standing run walks prefix `r5c2-m3`, 6 per size, plus the listed place (37 births).
- Standing figures (`R5C6-green.measures.txt`): fidelity 168/176 reads (the misses are the listed place's 8); differential 120/120; count c 0/0.
- Reader B is exactly R5C2's variant B. The only differences are cloned inputs and a string guard on the neighbour's relation type (the type check needs it; strings behave the same). The full-pool runs used the code before the guard; the standing run after it is identical.
- Lint fixes on my own tests: the composed walker's `.not.toContain` was anchored, its `if (!r) return` was removed, and the new walker's root now comes from `import.meta.url`.
