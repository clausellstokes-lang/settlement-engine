# TOOL-9 — evidence, recorded BEFORE the first edit (2026-09-20 05:14 EDT)

Worktree `$SP/lane-tool-9`, branch `tooling-9-2026-09-20`, base `5a3380e8d`
(`REGISTER: the lighting census re-derived before run 19 …`). `git status --short` EMPTY at start.

## The hashes at the base (all EXECUTED, `shasum -a 256`)

| path | sha256 |
| --- | --- |
| tests/fixtures/generator-golden-master.json | 7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e |
| tests/fixtures/dossier-prose-manifest-golden.json | 921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41 |
| tests/lint/.lighting-census-baseline.json (THE REGISTER — not my path) | 3fb7a7e8c406046ee6fb960f45e07ae362b3ead221d68c0e34ff4cb077a6013b |
| tests/lint/sovereigntyLightingContract.walker.test.js (the one file I edit) | ecd5c5de782a188ebee52200453dbeeec17194dd4a4679f8bc9281d4ec5d2124 |

The FROZEN tuple in the register: `files 2652 · parked 383 · credited 2269 · titles 25043 · suiteTitles 6679`,
`measuredAtSha 902580c712998022cf815c067bf004863d54009f`, `measuredBy chair-fable-a9df403c`.
⛔ NEVER REFROZEN BY THIS LANE.

## The walker as it stands (read whole, 7,803 lines / 614,717 bytes)

- `measureCensus()` (line 601) is ALREADY the one spelling of the measurement: the refreeze
  door calls it (line 726) and the census arm calls it (line 7412). Ruling 2 therefore needs
  NO new extraction for the figures — the print is handed the measurement the arm already
  computed, so the estate is measured ONCE per run, not twice.
- The census arm `THE CENSUS IS AN ASSERTION, NOT A SENTENCE` runs 3071→7542. Its executed
  statements are: the refreeze door (3079) → `CENSUS = Object.freeze({…loadCensusBaseline()})`
  (3143/7410) → `measureCensus()` (7412) → the walker-invisibility assertion (7416) → the
  merge-hunk adjacency guard (7441-7458) → the five figure assertions IN ORDER
  (files 7459, parked 7461, credited 7464, titles 7466, suiteTitles 7474) → closure (7481) →
  the T1 disposition → the reason-kind arms. THE SHORT-CIRCUIT IS AT 7459: `files` first.
- The refreeze door writes via temp-file + `renameSync` and throws BY DESIGN (755).

## The instruments that read THIS walker's source — checked before drafting

| instrument | what it pins | verdict for this edit |
| --- | --- | --- |
| `tests/lint/proseFamilyContract.walker.test.js:329` | `.toContain('files: 2412, parked: 365, credited: 2047, titles: 19984, suiteTitles: 5638')` — a HISTORICAL row deep in the derivation history | SAFE: that comment block is not touched |
| `tests/lint/newsHeadlineContract.walker.test.js:216` | the same historical string | SAFE: untouched |
| `tests/lint/testRatchet.test.js:773` | the file must still classify as an enforcement walker (`isEnforcementWalker`) | SAFE: still a walker |
| `scripts/.test-ratchet-baseline.json` | `totalTests: 33558` is a SCOPE FLOOR (`SCOPE_FLOOR_RATIO`), not an exact pin; `entries`/`uncollectedSuites` are EMPTY (a FAILURE census) | SAFE: +3 PASSING tests raise a floor-bounded total; `skippedCeiling 1` untouched |
| `tests/lint/goldenFreeze.walker.test.js` | `envSpellingsIn` enrolls only `/^UPDATE_[A-Z_]+$/` (AST, not text) | SAFE: `LIGHTING_CENSUS_PRINT` does not match the pattern, so arm 2 cannot call it unclaimed. `LIGHTING_CENSUS_REFREEZE` stays in `excludedEnvSpellings` and stays spelled in the file, so the stale-exclusion arm stays green |
| `tests/lint/negativeAssertionAnchor.walker.test.js` | per-file EXACT count of un-anchored `not.toContain|not.toMatch|not.toHaveProperty` | THE WALKER IS AT EXACT ZERO TODAY (grep: no such site, no frozen row). My self-tests use EXACT structural equality instead of a negative, so the file stays at zero |
| `eslint.config.js` | no `max-lines` rule reaches `tests/**`; `scripts/.size-baseline.json` has NO entry for this file; `no-console` is `'off'` (line 190) | SAFE: `console.log` is lawful here and the file has no line ceiling |
| `tests/copy/voiceMechanics.test.js` | em dash / exclamation point in a `src/` string literal | SAFE: this file is under `tests/` |

## The premise, checked and NOT refuted — with one measured sub-clause I could not honour as written

Ruling 1 asks the print to show "the parked-roster delta by file if `parked` moved".
MEASURED: the register stores `parked` as an INTEGER COUNT and carries NO roster
(`CENSUS_FIGURE_KEYS = ['files','parked','credited','titles','suiteTitles']`; the file's other
keys are the four provenance strings and `_doc`). There is therefore NO stored roster to
subtract from, and a "delta" printed against nothing would be a fabricated figure — exactly
the stale-numeral class this walker exists to refuse.

NOT A STOP: the lane's premise (the whole five-figure tuple, read-only) is fully supported.
The sub-clause is honoured in the only form the register can support and the form a lane
actually needs — see the ruling recorded in `TOOL-9.receipt.md` and in the commit body.
