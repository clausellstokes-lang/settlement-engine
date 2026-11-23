# PIN3-BRIEF (VEIL-41's builder "V41-PIN3"): READS WHOLE ONLY `tests/domain/display/criminalVeilSwitch.test.js` (the one file it changes). WINDOW 1,000,000; BUDGET ABOUT 120,000.

THE UNIT: "PIN-3", the chair's N68 (2026-11-23 07:18 UTC): VS1's "other" tooth, TEST-ONLY, ONE COMMIT on the lane's tip 23bb8b8ae.

THE CAUSE (CONFIRMED by the seat's bisect: green fb320eded, red c2625fb1f, unit (viii)): `safety.crimeTypes` became a built withhold/always row
of the registry, so in "VS1 acceptance on the projection, over twelve births > (a)-(e) hold on every birth, plain and DM-revealing",
`servedAs = familyContent(minusWithheldAlways(pub), defaults)` never holds "safety crimeTypes", the "other" tooth is tried 0 times of 24 copies and the
liveness anchor `expect(teeth.other.tried, ...).toBeGreaterThan(0)` reds. A tooth that is never tried checks nothing.

## YOUR TREE AND YOUR LAW
Worktree `/home/user/wt/pin3`, branch `lane/veil-41-2026-11-23-pin3-wip` at 23bb8b8ae; hooks linked; `node_modules` is a SYMLINK (never stage it).
Commit by the explicit path only; NEVER push, never `--no-verify`, never another branch. ONE file: never 212, the registry, or anything under src/.
Tests with `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE`; every run to a log under `/var/tmp/v18/out/v41/pin3/`, never through a pipe; heavy runs
(the 34-file set, `tests/lint` whole) through `sh scripts/gate-mutex.sh --run -- <command>` (exit 3 = gave up: run again). Cite by symbol, not line.
Negative-assertion anchors: `// anchored:` on the assertion's own line or the ONE line above it. A permission refusal: stop and report.

## THE CHANGE (the chair's four points, exactly)
1. THE "OTHER" TOOTH MOVES TO `safety criminalInstitutions` (the same safety profile; served on 24 of 24 copies at the tip by the seat's tally): it is
   tried where `servedAs['safety criminalInstitutions'] !== undefined` and the show copy `S` is a record with a safety profile; the copy `less` is `S`
   with `economicState.safetyProfile.criminalInstitutions` deleted; caught where `missingIn(less)` includes 'safety criminalInstitutions'; its failure
   line names criminalInstitutions.
2. THE LIVENESS ANCHOR's message says its true premise: some copy serves the criminal institutions, or the other tooth proves nothing.
3. ONE NEW ASSERTION beside it: the tooth's path (`economicState.safetyProfile.criminalInstitutions`, the differ-normalised path the registry's
   rows match) is matched by NO regex of `WITHHELD_ALWAYS`; its message: "the other tooth's key is withheld always by the registry: move the tooth
   to a family value the show copy serves". (So the next unit that withholds the tooth's key gets its cause, not "tried 0".)
4. The tooth's comment re-worded to match (why criminalInstitutions; that crimeTypes left by unit (viii), R3-TELL-8b).
Nothing else in the file moves.

## PROOFS (the seat re-runs them)
- RED FIRST at 23bb8b8ae before your edit: the file, the one red (tried 0), its log.
- GREEN after: the file whole green; the tally `teeth.other` tried 24, caught 24 (write it: run with `VS_TALLY=/var/tmp/v18/out/v41/pin3/tally.json`).
- ONE MUTATION RUN, NOT COMMITTED: take the tooth's deletion out (so `less` equals `S`) and show the file red on the caught count; restore; prove the
  file byte-identical to your commit by `git diff --exit-code`.
- THE 34-FILE SET (N33): every test file outside `tests/security` that names `galleryPayloadFor`, `applyVeil`, `projectShareVeil`,
  `get_gallery_dossier` or `get_unlisted_dossier` (`grep -rlE '...' tests | grep -v '^tests/security/'`), ONE run through the mutex: the count of files
  and of reds (the chair expects 0 red after the cure).
- `tests/lint` WHOLE through the mutex: its count beside the tip's 48 of 3,304 (17 files); any new red named.

## COMMIT AND REPORT
ONE commit: `test(veil, VEIL-41 PIN-3): VS1's other tooth on criminalInstitutions (N68)` with the receipts in its body (red first; green 24/24; the
mutation; the 34-file count; lint). Report `docs/chair/2026-11-20/veil/out/v41/pin3/PIN3-REPORT.md` is NOT committed on your branch (one file only):
write it to `/var/tmp/v18/out/v41/pin3/PIN3-REPORT.md`, at most 40 lines. Final message: at most 200 words, the commit, each receipt.
