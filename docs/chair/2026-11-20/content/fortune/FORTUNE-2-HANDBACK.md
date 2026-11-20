# FORTUNE-2 hand-back (kept current; last written 2026-11-20 13:37:50 UTC by `date -u`)

For a successor (FORTUNE-3): this file and the briefs (`briefs/COMMON.md`, `U2.md` to `U4.md`) are all you need.
Lane branch `lane/fortune-2-2026-11-20` (taken at 57a79cc2d, FORTUNE-1's hand-over). The chair is
session_019yED1SUxGVHyjQnoqoFvQ8 (send_message, Claude Code Remote MCP server); one line at each unit landed green,
at most 300 words, with your count (the chair reads the true one; your own runs about a third low).

## 1. Rulings in force (each vetoable by the owner; every figure DRAFT, signed by none)

1. Everything in `FORTUNE-1-HANDBACK.md` section 1 (items 1 to 10) stands.
2. The chair, 12:01 UTC: the Power tab's reason clause is cured UNDER LAW 2 ONLY. Under law 1 the sentence tells the
   truth about the score beside it; rewording it would make words and number disagree. U4 LISTS the law-1 readings
   (each clause, its trigger term, how many of twenty towns a size print it). Recorded in `briefs/U4.md`.
3. FORTUNE-2's addition to U4 (accepted 12:01): FS5's dark rule binds every cure (law 1 picks today's line).
4. The chair, 13:17 UTC: `readerShapeResolver` (tests/lint) is NOT a flake on one run: before U2 or U3 merges, find
   WHICH token was 260 long in the whole run and whether U1's files hold it; U1's -> cured on the lane; reproduced at the
   base in a whole run -> the line's, the chair takes it. The lane's last commit needs `tests/lint` whole green by its
   count line.
5. The chair, 13:17 UTC: `tests/lint/.tuning-inventory.json`'s `measuredAtSha` (acf2c2180, U1's builder's pre-amend
   commit, not on the lane) is re-taken by its own door at the NEXT merge, with the cause in the commit; not before.
6. The chair, 13:17 UTC: the working line moved to 43ab0f5eb (point 82). Merge it into the lane BEFORE THE LAST UNIT
   (U4), not before.

## 2. The units

| unit | state | branch | commit |
|---|---|---|---|
| briefs corrected for FORTUNE-2 | DONE | lane/fortune-2-2026-11-20 | 1b050c590, b079b6a89 |
| U1 law leaf, dark | MERGED, GREEN (chair accepted 13:17) | merge 2daa80771 of bc3c5cc8e; censuses re-taken 4822cff0b | pushed |
| U2 fortune | BUILDER OUT (seated ~12:15); WIP = its red test only, prosperity.js not yet changed | local lane/fortune-2-u2-2026-11-20, PUSHED as lane/fortune-2-2026-11-20-u2-wip | d0b3fc4ea (wip) |
| U3 standing + play-time guard | BUILDER OUT (seated ~12:15); WIP = source edits and both tests, its gates running | local lane/fortune-2-u3-2026-11-20, PUSHED as lane/fortune-2-2026-11-20-u3-wip | 383903a85 (wip) |
| readerShapeResolver 260>256 | OPEN (ruling 4) | — | — |
| U4 FS7 | after U2+U3 and the line's merge | lane/fortune-2-u4-2026-11-20 | — |
| re-measure forced on; owner's page re-check; confinement; final hand-back; "FORTUNE <commit>" | after U4 | — | — |

The chair, 13:31 UTC (usage warning): nothing stays only in a container. Every builder branch is pushed as
`lane/fortune-2-2026-11-20-uN-wip` now and after every return; a successor fetches those. No new measuring helpers; one
builder at a time unless a second is already running.

## 3. The integrator's routine at a merge (as done for U1)

`git merge --no-ff --no-commit <builder commit>`; drop any census change (`git checkout HEAD -- docs/content/wiring-census.json tests/lint/.lighting-census-baseline.json`);
commit the merge; then on the CLEAN tree re-take by their doors and commit "chore(registers): …":
`LIGHTING_CENSUS_REFREEZE='<seat>' LIGHTING_CENSUS_NOTE='<why>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`
(exits non-zero by design) and `node scripts/wiring-census.mjs`. Red re-run: the builder's test files alone on the
pre-unit tree. Gates (one script, each line `sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh …` to a file):
`tests/lint` whole; every test file naming a changed module; `validate:tuning-bands`, `typecheck:ratchet`,
`typecheck:domain:strict`, `lint`, `node scripts/wiring-census.mjs --check`. A red is the unit's only if it is green at
the pre-unit tree.

KNOWN REDS AT THE BASE (b079b6a89), not ours: tests/build/engineBundleReplay (3), engineServiceCore (1),
engineServiceStoreParity (4), tests/domain/editWorldFactResources (A2, A6), tests/generators/institutionBudgetPromise (1),
tests/property/dmLayerGoldenIsolation (A7). tests/lint whole was 220/220 green at the base (3271 tests).

## 4. Instruments

- Prototype measure: `sh docs/chair/2026-11-20/content/fortune/instruments/run.sh <checkout> <scratch>`; re-run by
  FORTUNE-2 at 3c48af25c from a scratch copy: all seven outputs byte-identical to the committed `measures/`.
- Confinement: `node <confinement>/trees.mjs 0c9069489 <tip> <workdir> --words=none` (the tool from
  `origin/lane/names-3-2026-11-20:docs/chair/2026-11-20/content/tools/confinement/`, copied out; run from the repo root),
  then sha256 of `born-*/golden.jsonl` and `census.jsonl`. At 4822cff0b: 525/525 and 720/720 identical; golden
  663fe111…, census 882694dc… both sides.
- After the build, the forced-on arm on the REAL law: `measure.mjs` must set `_fortuneLawVersion: 2` AFTER `birthConfig`
  (owed with the re-measure); then re-check every figure on `FOR-THE-OWNER.md`: if one moves, tell the chair FIRST.

## 5. Executed vs plausible

EXECUTED: U1's red and green, the merge, the censuses, the confinement, every gate count above. OPEN: readerShapeResolver.
