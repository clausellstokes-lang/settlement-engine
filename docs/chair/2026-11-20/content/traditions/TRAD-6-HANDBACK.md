# TRAD-6 — THE HAND-BACK (kept current at every push)

Seated 2026-11-22 08:17 UTC by the eighth chair (session_01ACmDYY29VRchM87v1yhL9Q). Prompt:
`docs/chair/2026-11-21/eighth/prompts/TRAD-6.txt` on `origin/lane/chair-2026-11-08` (at or after 9d7a3c1dd). A successor needs THIS
FILE, that prompt and the briefs under `briefs/` only. Every ruling in force is TRAD-5-HANDBACK §1 (1 to 23), restated by
reference, plus §2 below.

## 1. WHERE THE LANE STANDS
- Branch `lane/trad-6-2026-11-22`; started at `b97fd16f7` (= `lane/trad-5-2026-11-20`; code `cd6989657`).
- LANDED: "TRAD cf5b24079" (units 5 to 12) = point 88.
- MERGED ON THE LANE, NOT LANDED: unit 13 (`f6cb2d68d`; census `cd6989657`).
- IN FLIGHT: unit 1 (unit 13's failures named), its gate batch at `cd6989657`.
- NEXT: name the reds; cure the presumption walker's one hit by a builder; unit 2 (the 292 bytes); unit 3 (rule 8, "TRAD <commit>").

## 2. RULINGS ADDED SINCE TRAD-5 (the eighth chair's)
24. E54: the lane merges nothing of the line for unit 13; rule 8 runs on the lane's own base; the chair's landing helper merges the tip.
25. E30: the lane does not hold the first deploy.
26. COMMON-EIGHTH 11: `tests/lint` WHOLE after any change to a test file, its count in every report.

## 3. UNIT 1 — UNIT 13's FAILURES BY NAME (EXECUTED by TRAD-6 at `cd6989657`, 08:23–08:52 UTC)
The directories (tests/lint, components, pdf, data, domain/dossier, kernel) and the 12 test files elsewhere that name a module the
lane changed: 857 files, 8,394 tests, 4 red. `tests/lint` whole inside it: 221 files, 3,313 tests, 1 red.
| test | on `RED-AT-LINE.tsv`? | cause |
|---|---|---|
| `tests/lint/presumptionClasses.walker.test.js` "no NEW undeclared line…" | NO: the lane's | ONE hit, `ELEMENT_GLOSS_ALSO.forge` "also honours the forge" (goods:none): the line declares `institution: smith` (which answers goods) inside `Object.freeze([...])`, a form the scanner (`presumptionClasses.shared.mjs :: scanSource`) does not read; the plain forge glosses are 3 words, so never scanned. CURE: the declaration written as a literal array, no wording moved (brief `briefs/TRAD-6-U1-ALSO-FORGE-DECLARED.md`, builder on `-u1-wip`) |
| `tests/components/phoneChromeFloor.census.test.js` (TRAD-5's unnamed second) | NO (it left the list at points 92/93) | `/create` 621→622, `/settlements` 864→865, `/gallery` 666→667: the +1 of point 88's description line, already re-recorded on the LINE by its door at `6d581ce5b`; unit 13 touches no component. Not re-recorded on the lane (the merge takes the line's side) |
| `tests/generators/generationForkCensus.test.js` A1 | YES (row 13) | stored fingerprint |
| `tests/property/generatorGoldenMaster.test.js` "every config…" | YES (row 31) | golden master |
`VERIFY_DIST=1 tests/build` whole after a fresh build: 612 tests, 13 red, ALL ON THE LIST by title: the eight edge-bundle tests
(`engineBundleReplay` ×3, `engineServiceCore` ×1, `engineServiceStoreParity` ×4) and the five size rows. Build exit 0.
First paint at `cd6989657` (`fp.mjs`, the test's reading): 1,177,013 / 374,555 / 314,617 (TRAD-5's figures reproduced). RAW IS
IDENTICAL to `a89c29f74`'s (= cf5b24079's code), so the Brotli +173 is content, not bytes: being located by chunk (cf5b24079 built).

## Updated (append at each later commit, with `date -u`)
