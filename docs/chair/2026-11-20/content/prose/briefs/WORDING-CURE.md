# WORDING-CURE — two data rows the battery rightly flags, reworded as the chair ruled (PROSE-2's builder brief)

Written by PROSE-2, 2026-11-20, on the chair's ruling of 18:46 UTC (item A). The ground: `docs/chair/2026-11-20/content/prose/map/wording/WORDING-FAULTS.md` (813778b4f), read WHOLE. You build in YOUR OWN worktree on branch `lane/prose-2-2026-11-20-wording-cure`, cut from `lane/prose-2-2026-11-20` at the commit PROSE-2 names; `npm ci` first; commit by explicit paths with the hooks; never push, never `--no-verify`, never a pull request, never the whole suite; heavy runs through `sh scripts/gate-mutex.sh --run -- <command>`. Read `CLAUDE.md` first.

## THE CHANGE (the words are the chair's, exactly)
1. `src/data/cultureProfiles.js :: CULTURE_PROFILES.greek.defensePattern` becomes: "Civic musters come first; paid guards are added only when a threat lasts and there is coin to pay them."
2. The town tier's "Monastery or friary" claims the healer the record grants, never a hospital. The three rows stay three:
   - the catalog row (`src/data/institutionalCatalog.js`, the religious-centre entry's `at.town` desc): "Religious community. Its members nurse the sick and teach letters."
   - its two variants (`src/data/institutionDescVariants.js :: INSTITUTION_DESC_VARIANTS["town|Religious|Monastery or friary"]`): "A community of the religious. Its members tend the sick and teach a little reading." and "An order living in common. It cares for the sick and teaches letters to those who ask."
Nothing else. NOT `crisisCast.js` (FRAME's file), NOT `historyData.js` ("walled apart" is MATCHER's class). If a variants file pins its pairs, a count or a pick key in a test or register, update it by its own door with the cause stated; if a row's TEXT is a key elsewhere (a sibling map, a word-correction table, a tier-noun span list), find every reader (search the old words exactly) and say what you did.

## RED FIRST
A test (in the existing test file nearest to each writer: find it; or a new one under `tests/data/` named without the mutation manifest's words: census, scan, baseline, ratchet, walker, killlist, parity, coverage, governance, freshness, integrity, exhaustiveness, roundtrip, golden, contract, pin): (a) no town-tier "Monastery or friary" desc row names a hospital; (b) the greek defencePattern names no settlement size ("town", "city", "village", "hamlet", "thorp", "metropolis"). RED at the base, GREEN after. Then on the 300 places (`hxd-<size>-0..49`; the census in `docs/chair/2026-11-20/content/prose/map/wording/`): the battery's `tier-noun` findings on `culturalIdentity.defensePattern` and its `hospital` findings on `institutions[].desc`, before and after (expected 14 → 0 and 7 → 0).

## THE GATES (each through `sh scripts/gate-tail.sh`, to a file, by its count lines)
Every test file that names the changed files or their symbols (search; list them); `npx vitest run tests/lint` WHOLE (first `git fetch --no-tags --depth=1 origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08`); `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. A red not yours: shown red at the base by name, never cured.

## WHAT IT MOVES
Born text only. The two-tree tool (fetch `git show origin/lane/names-3-2026-11-20:docs/chair/2026-11-20/content/tools/confinement/<file>`, all its files, into a scratch folder; `node <tool>/trees.mjs <base> <your tip> <scratch>` with base = the commit you were cut from): 0 NON-STRING differences; string differences only in the changed fields (and the receipt's battery findings): name each path and count. Every stored fingerprint moved (the golden master, its manifest's tests) NAMED with before and after, signed by none.

## REPORT
`docs/chair/2026-11-20/content/prose/WORDING-CURE-REPORT.md`: the commit(s); the red and green; the battery counts before and after; every gate's count line and exit; the two-tree table; moved fingerprints; executed vs inferred. Final message at most 150 words.
