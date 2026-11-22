# PLACE-3 CURE brief — the trade note's spread test: two un-anchored negatives (for a FRESH builder)

Written by PLACE-3, 2026-11-22 08:16 UTC. Base: `lane/place-3-2026-11-21` at the commit that carries this file (the trade note's cure merged at cbbe8aed7 on the line's f5295e425).

## The red (measured at cbbe8aed7)
`tests/lint/negativeAssertionAnchor.walker.test.js` › "the generation-facing quarantine is EXACT (a new, grown or unbanked offender reds)": the live population gains `"tests/generators/entrepotNoteSpread.test.js": 2`. A second test of that walker file also reds; name it and its cause.

## The cure (the one file you may edit: `tests/generators/entrepotNoteSpread.test.js`)
1. Read `tests/lint/negativeAssertionAnchor.walker.test.js` WHOLE (its doc header and `scanUnanchoredNegatives`) to find exactly which TWO sites it counts.
2. Anchor each one by the walker's own rule: `// anchored: <why this assertion cannot go vacuous>` ON the assertion's line or on the ONE line directly above it, never wrapped over two comment lines. The why must be true: name the positive arm or the planted control in the same file that proves the population is non-empty (e.g. arm (d), the one-wording pool that reds the bar; arm (e), the planted crime-fact row). Do NOT go through `tests/helpers/anchoredNegatives.js` unless the walker leaves you no other way. Do NOT edit the walker, its frozen list or `READMITTED_GENERATION_FACING`. No assertion's meaning changes.
3. Nothing else in the file moves.

## Green (all through `sh scripts/gate-mutex.sh --run -- …`, each to a log; never through a pipe; another run may hold the mutex for up to an hour: wait for it)
- `npx vitest run tests/lint` WHOLE (COMMON-EIGHTH 11). Expected reds that are NOT yours and stay: `sovereigntyLightingContract.walker` (1), `proseWiringCensus.walker` (2), `proseComposed.walker` (1; on the line's list), and `proseCorpusBytes` (2; on the line's list). Every other lint file green, the anchor walker 9 of 9.
- `npx vitest run tests/generators/entrepotNoteSpread.test.js`: green (it takes several minutes).

## Commit and report
Commit on your own branch by explicit path (`git add tests/generators/entrepotNoteSpread.test.js`), message `place-3: anchor the trade note's spread test's two negatives (negativeAssertionAnchor walker)` with the receipts (the two lines anchored, by test title; tests/lint whole's count; the spread test's count). Never push, never `--no-verify`. Final message at most 150 words: the commit; the two sites by test title and the anchor text; the second walker test's name and cause; tests/lint whole's counts with every red by file and title.
