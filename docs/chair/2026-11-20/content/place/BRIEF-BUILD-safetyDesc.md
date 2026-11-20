# PLACE-1 BUILD brief 1 — `economicState.safetyProfile.safetyDesc` (the Defense tab's safety line)

Written by PLACE-1, `date -u` at writing: 2026-11-20T16:38Z. Read `BRIEF-BUILD-COMMON.md` beside this file FIRST and WHOLE (the how, the rules, the green), then `safetyDesc-MEASURE.md` WHOLE (your design: every row, every reader, every proof owed), then `src/generators/safetyProfile.js` and `src/generators/safetyLineTruth.js` WHOLE.

## What the chair has ruled (16:30 UTC: "THIS IS YOUR FIRST UNIT"; the lines READ AND APPROVED by the chair at 16:47 UTC: all 78 rows of §D, with the four calls below and one rewording)
Build `safetyDesc-MEASURE.md` §D and §F exactly, with these amendments:
1. **Drop the watch row 4** ("The watch walks the main streets by night; …", `excludes: ['force walks by day']`): a night claim from a negation is not a declared fact.
2. **No new atom**: the `citadel` and `force walks by night` rows stay out; `src/domain/facts/factVocabulary.js` is untouched.
3. **The city's Unsafe line is IN** (its four slots, §D 7).
4. **The rewording (the chair's)**: walls row 4 loses a material the record does not hold; it reads exactly "The walls keep the outside out; the trouble there is starts within." (its needs and excludes unchanged).
5. **The key**: the active stream's step-qualified seed, as `safetyProfile.js :: voiceOf` already keys in the same file (`config._seed` is absent at the writer): `` `${seed}::safetyProfile:safetyDesc:<slot>` ``; a falsy seed prints today's sentence in every slot (canonical at zero).

## Files you own (and no other)
- NEW `src/data/safetyDescLines.js`: the pools of §D as frozen declared rows, index 0 today's sentence; nothing else in it but the rows and their pool names.
- `src/generators/safetyProfile.js`: the Moderate assignment (small place and village-and-up) and the Unsafe branch's garrison clause, advice and wall note become calls of ONE composer (`drawDeclared` + `pickVariant` per slot), facts `factsOf({ institutions, tier, config })`; today's literals leave the file; the file's imports-at-the-end rule holds. NOT `safetyLineTruth.js` unless a measured reader there requires it (then STOP and report first).
- `scripts/lib/table-pools.mjs :: TABLE_POOLS` (one row per pool), `tests/lint/factLayers.poolTable.json` (one row per pool).
- The readers §F names: `tests/helpers/pageLaws/law9.mjs` (`9a.watch` reads the pool's watch rows, never a copied literal); `tests/lint/presumedThings.register.json` and `tests/lint/presumptionClasses.register.json` (the stale rows REMOVED: these registers only shrink; a row never added).
- Your red-first test, NEW, `tests/generators/safetyDescSpread.test.js`.

## Red first (commit it ALONE, before the build; record its failing titles and counts in the commit body)
(a) on 100 places a size (`hxd-<size>-0..99`, born as `docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs` births them, masked as it masks), no SENTENCE of `safetyDesc` in more than 15 of a size's places: red today (thorp 67, town 73); (b) every composed row's `needs` hold on the FINAL record (0 refused); (c) a seedless `generateSafetyProfile` prints today's line in every branch; (d) the planted control: a one-row pool reds (a). If 600 births are too slow for one test, use a pinned subset that still reds today and say which.

## Green, then hand back
`BRIEF-BUILD-COMMON.md`'s green, plus these named in §F.5: `safetyLinesSayTheRecord`, `projectionAgreement`, `safetyModerateSmallPlace`, `safetyForceLines`, `safetyLineSiblings`, `tailDefeconSafetyLines`, `coherenceAgreeCures`, `declaredMoves`, `narrativeQualityCorpus`, `defenseTabFlow`, and every test that imports `law9.mjs`. Name every pinned test that moved, by file and title, before and after. The confinement run between the two trees and the lighting, wiring and page censuses are PLACE-1's, at the merge: do not take them.
