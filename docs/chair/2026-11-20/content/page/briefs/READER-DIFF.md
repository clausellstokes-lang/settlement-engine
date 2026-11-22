# PAGE-13's brief: READER-DIFF (the safety pages' test re-made as a differential in one tree)

Written by PAGE-13 on 2026-11-22 (the hour is in the commit). ONE builder, render only, red first. The chair's ruling (b)
of 2026-11-22 01:39 UTC (decision E11): `tests/ui/safetyReaderBytes.test.jsx` stores sha256 hashes of 11 reader surfaces
for 300 towns (`tests/ui/safetyReaderBytes.base.json`). It is red on the line since point 86 with STALE PINS, NOT A LEAK
(the PDF cover prints today's date; point 85's arrival prose moved the rest for every audience). A stored hash of whole
pages is a golden and a lane adds none: IT IS NOT RE-RECORDED, ANYWHERE. It is re-made with NO STORED HASH and THE
CLOCK PASSED IN.

## What the old pin proved (read its header whole)
On every surface that prints the Safety label on a path that is not the owner's (Overview and Defense tabs as the
gallery, the reveal share and the player share mount them; the print view model with no DM view, its Cover, Overview and
Defense chapters' text; the Foundry journal's pages), the owner's line (`src/domain/display/safetyShown.js`) adds no
byte; the records are NOT veiled first, so a reader path that read capture or the crime wave would show.

## The unit (one sound form; better it if you can, and say how)
1. ONE TREE, TWO RENDERS, NO STORED HASH. In the same file, mock `src/domain/display/safetyShown.js` through
   `vi.mock(path, async (importOriginal) => …)` with a module-level switch: OFF, every export is the original; ON, the
   owner's line is a SENTINEL string (e.g. `'⁣SAFETY-SENTINEL⁣'`) wherever the original module would give the
   owner a line at all (`safetyShownOf(r, 'owner')` with a label: qualifier = SENTINEL; `safetyQualifierOf` = SENTINEL)
   and the original elsewhere. The audience gate stays the ORIGINAL's: do not restate `safetyAudienceOf` in the test.
2. THE CLOCK PASSED IN: the Cover is called with a fixed `now` (it takes one: `Cover.jsx`), or `Date` is faked for both
   renders; say which. No surface may differ between the two renders for any reason but the sentinel.
3. THE ARMS, over the same 300 towns (`hxd-<size>-0..49`, the old recipe) and the same 11 reader surfaces:
   (a) every reader surface renders the SAME BYTES with the sentinel ON as OFF (compare the strings, or their hashes made
   in the run; nothing written to disk);
   (b) no reader surface ever holds the sentinel;
   (c) THE ARM IS NOT EMPTY: the owner's own surfaces (both tabs with `publicDossier={false} playerView={false}`; the view
   model with `dmView` and its Cover, Overview and Defense text) DO hold the sentinel, in every town with a Safety label;
   count them and assert the count is above zero and equals the towns with a label.
4. RED FIRST, by plant and restore in the working tree (never committed): plant the owner's line on ONE shared surface
   (e.g. `OverviewTab.jsx` handing `'owner'` to `safetyShownOf` regardless of the props) and SEE arms (a)/(b) red with the
   surface named; restore; green. Keep both outputs under `docs/chair/2026-11-20/content/page/build/READER-DIFF/`.
5. DELETE `tests/ui/safetyReaderBytes.base.json` and the record door (`SAFETY_READER_BYTES_RECORD`). Keep the file name
   `tests/ui/safetyReaderBytes.test.jsx` and rewrite its header to say what it proves now and why no hash is stored.
   `docs/chair/2026-11-20/content/page/build/SIDES/pinCause.mjs` (a docs tool) may read the deleted file: name it, do not
   edit it.

## Files you OWN
`tests/ui/safetyReaderBytes.test.jsx` (rewrite), `tests/ui/safetyReaderBytes.base.json` (delete), and new files under
`docs/chair/2026-11-20/content/page/build/READER-DIFF/`. Nothing under `src/` changes (a plant is restored before commit).

## Gates (each to a file, through `sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh …`)
The new test (red with the plant, green without; its runtime); `npx vitest run tests/lint` WHOLE (the lighting census will
move: REPORT its figures, do not refreeze); `npm run lint`; `npm run typecheck:ratchet`. Never the whole suite.

Common law: `briefs/BUILDER-RULES.md` beside this file (its rule 2's list is read with this brief's OWN list).
