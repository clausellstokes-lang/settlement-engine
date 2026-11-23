# R5C3 hand-back: R5-RECENT's cure under E93 (VEIL-33's V33-R5C3, 2026-11-22)

Worktree `/home/user/wt/r5c`, branch `v33-r5cure`, cut at 8d6643a10. The only commit is this file and its two probes with
their outputs (this folder). Nothing pushed, no pull request. Not one line of 212, the rollback, the twin, the registry,
`src/` or `tests/` is written. 210 and 211 are untouched.

## STOP
**THE UNIT'S OWN CHECK FAILS: A SECOND COPY OF THE SENTENCE IS STORED AND SERVED. The path is `pressureSentence`.**

The brief says: the history and narrative steps receive the sentence; prove on the pool that no second copy is stored or
served, or STOP with the path. Measured on R5C2's own pool (480 births, seeds `r5c2-m3-*` and `r5c2-m3b-*`):

- **154 of 480 births store `pressureSentence` EQUAL to `powerStructure.recentConflict`** (thorp 47, hamlet 27, village 21,
  town 23, city 21, metropolis 15).
- **The twin serves it so on every one of the 154**, Reveal DM off and on alike (an unmarked share's projection). **43** of
  them are places that hide something (a hideable house or an owner-hidden power).
- The writer: `narrativeGenerator.js :: generatePressureSentence`. Its generic fallback returns the sentence itself:
  `if (detail.recentConflict) return detail.recentConflict;` (`detail` from `genPressureDetail`, which copies
  `powerStructure?.recentConflict`). `assembleSettlement.js` stores it as `settlement.pressureSentence`. It fires wherever
  the stress line, the succession line and a tie's phrasing all give nothing.
- The history step does NOT keep a copy. `historyGenerator.js :: buildHistoryContext` puts the sentence in its context,
  and no code in `src/` reads that context key (a census of every code line naming `recentConflict`).

So withholding `powerStructure.recentConflict` alone, as the unit is written, still serves the same sentence at
`pressureSentence` on about a third of births. On a hiding read where the sentence names a withheld power, it would be
the same fault on a second path. Neither engine's pressure-sentence rule withholds it there: 212's
`_gallery_veil_second_homes` and `gallerySecondHomes.js :: withholdSecondHomes` (line 891) treat a sentence EQUAL to
`recentConflict` as accounted for, and keep it. The fix needs a ruling on `pressureSentence`, which the unit does not
name, so I stopped before the first edit. I did not build half a cure.

**Options, for the chair (designed, not written; nothing measured beyond the counts above):**
| | Option | What a shared page shows | Cost |
|---|---|---|---|
| P1 | The always-pass also withholds `pressureSentence` wherever it EQUALS the stored `recentConflict`, every place (decided by the stored value, so its absence tells nothing). The page puts back the re-derived sentence there only if it can tell why the key is gone. | No pressure line on about 32% of shared pages, or B's sentence there | The page cannot tell this absence from the covert-tie rule's absence (212 (24)) or the swept tie's (212 (30)). Re-filling it blind could print a line where a tie rule took one. |
| P2 | The same, plus a served marker that the line was the vignette (a new served key) | B's sentence in both places | A new key on the served payload: a persisted shape, which is the owner's. |
| P3 | Withhold `pressureSentence` where it equals the stored `recentConflict` AND the stored sentence names a power the read withholds (R3's `wn`) | The line as stored, except on hiding places | That is a per-place withheld form, which E92 (1) forbids ("NEVER a per-place withheld form"). |
| P4 | A generator change: the fallback stops copying the vignette | Unchanged on old records | Outside this lane, and it moves generated towns. Old records still need P1 or P3. |

My read, for the chair to take or leave: P1 without the page re-fill (the line leaves on every place whose pressure line
is the vignette, nothing hidden or not). It is the same always-law as E92 (1), on the copy. The cost is a missing line on
about a third of shared pages.

## WHAT WAS DONE BEFORE THE STOP
- Read whole, in order: CLAUDE.md, `docs/OPERATING_STANDARD.md`, the brief (E92 and E93), R5C2's hand-back and addendum.
- Read whole, before any edit: **212** (all 3,180 lines, the generated character tables included), **the registry**
  (all 662 lines), the twin `src/domain/display/galleryWithholdAlways.js`, `src/domain/veil/pageRederive.js`,
  `src/domain/veil/importRederive.js`, the plant `tests/security/galleryVeilRecent.pglite.test.js`, both walkers
  (`crimeTypesReaders`, `rosterChoiceComposedHosts`) and ARMS C to E of `rosterChoiceRegistry.walker`.
- The reader census of `\brecentConflict\b` in `src/`: 24 code sites. Recorded for the walker the unit owes (designed, not
  written).
- The two copy probes: `R5C3-copies.probe.mjs` (every string leaf holding a 24-code-point run of the sentence, stored and
  served) and `R5C3-copies2.probe.mjs` (exact equality at `pressureSentence`). Outputs are in `R5C3-copies.out` and
  `R5C3-copies2.out`. Each ran under `gate-mutex.sh --run` and through `gate-tail.sh`, GIT_* unset; both exited 0
  (15:37 and 15:39 UTC).

## NOTES FOR THE BUILD, once the chair rules (designed under E93, unchanged from R5C2's design except as noted)
- The twin's always-pass lives at `src/domain/display/galleryWithholdAlways.js`, not `src/domain/veil/` as this unit's
  prompt says. It is the same symbol, so this is not a mismatch of substance.
- **The composed-hosts walker cannot "go green on the row" as it is written.** Once the row leaves the composed form
  (`inputs` emptied, as `safety.crimeTypes`), it leaves `COMPOSED`. Its test then no longer exists, and the census test
  (`ORDERED[0]?.id` is `power.recentConflict`) goes red. The walker needs a re-statement that walks the row by name as one
  that LEFT the composed form, on hosts that exist. The rest would stay red: 26.
- `REGISTRY_SITES['src/generators/power/conflicts.js :: generateConflicts']` lists `power.recentConflict`. That site does
  not write the sentence. The correction moves the row to the `generatePowerStructure` site (and a
  `rulingPower.js :: transferRulingPower` site, if ARM A requires one). After that, regenerate `registry.json` with
  `scripts/veil/rosterChoiceRegistry.mjs`, because ARM E checks it.
- The other 24-run overlaps the first probe found are not copies of the sentence. They are power names and phrase
  fragments the sentence shares with `factions[].desc` (21), `conflicts[].desc` (14), memberships and pairs. Exact
  equality was measured only at `pressureSentence`.

## RED AND GREEN
Not re-run. Nothing changed: `git diff cbaa8d540..HEAD -- src tests supabase scripts` is empty, so R5C's figures stand
(the plant red 6 of 6 plants, the composed-hosts walker red 27 rows). No RED or CURE commit, because of the STOP.
Also not run, for the same reason: `tests/lint` whole, typecheck, eslint, the build, VERIFY_DIST.

## 212 AND THE ROLLBACK (unchanged, sha256 read 15:39 UTC)
- 212 before = after: `0352a5028544cce06c7bd9f610c23c60bc6fda5413528467fb4e478792bbb278`
- rollback: `8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0` (untouched)
- 211: `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (byte-frozen)
- 210: `9118c235c15d4ed434e192fb60e49dacd2040d52b7b8c28b3acc262494358a60`

## CONFIRMED vs PLAUSIBLE
**CONFIRMED** (executed):
- 154 of 480 births store `pressureSentence === powerStructure.recentConflict`, and the twin serves it equal on all 154,
  Reveal DM off and on. 43 of them hide something.
- The path in code: `narrativeGenerator.js :: generatePressureSentence`'s fallback, stored by `assembleSettlement.js`.
- The history context's copy is read by no code in `src/`.
- 212, the rollback, 211 and 210 are unchanged.

**PLAUSIBLE:**
- That 212 serves the same copy. Its pressure rules keep a sentence equal to `recentConflict`, read in 212's text. The
  server was not run.
- That on a hiding place whose sentence names a withheld power, the copy names that power. Not planted.

R5C3 STOP (this commit): a second copy of the sentence is stored and served at `pressureSentence` (154 of 480 births: narrativeGenerator.js :: generatePressureSentence's fallback)
