# TRAD-1 red arms and drafted leaf (held until the chair's BUILD)

Written while the proposal waits. Kept here as `.draft` so nothing executes them and the branch stays green; at BUILD they
move to their homes:

- `traditionDescription.test.js.draft` → `tests/domain/traditionDescription.test.js`
- `traditionDescriptionFrames.walker.test.js.draft` → `tests/lint/traditionDescriptionFrames.walker.test.js` (owes a row in `scripts/mutation-coverage-manifest.json`)
- `traditionDescriptionSharedPage.test.js.draft` → `tests/security/traditionDescriptionSharedPage.test.js` (this seat's own born test; no other security-lane file is touched)
- `src-data-traditionDescriptionTable.js.draft` → `src/data/traditionDescriptionTable.js`
- `src-domain-traditions-traditionDescription.js.draft` → `src/domain/traditions/traditionDescription.js`

RED FIRST, executed 2026-11-20 at their homes, before any leaf existed: `npx vitest run` on the three files → 3 files
failed, each on `Cannot find module '../../src/domain/traditions/traditionDescription.js'` (exit 1).
