# FRAME-3 · B11 — a person in the crisis cast takes their own pronoun, never "it": results

Builder B11 of FRAME-3, on `frame3-b11` from `4421fbf6c` (the worktree opened at `e877d30a2`; the branch was made from
`4421fbf6c` as the brief says). Brief: `B11-PERSON-NOT-IT.md` (this folder). Lead: FRAME-2 · B10, `d8a1b1657` on
`origin/lane/frame-2-2026-11-20-b10`, its source change applied by hand. `crisisCast.js` at this base is byte-identical to
B10's base (`8df635b61`), so the lead applied as written; every claim below was re-measured on this tree.

## The fix (one source file: `src/domain/crisis/crisisCast.js`)

- `HOLDER_ITS_REASONS`, the closed form: `waverer`, `instigatorGains`, every `bruntBase` sentence but `public_legitimacy`
  (its "its" is the house's, named first). Built from the vocabulary's own values; no new sentence.
- `personReason(reason, n, key)`: on a PERSON's row (`npcRow`) the holder's "its" becomes the person's own possessive:
  "her" for `gender` female, "his" for male, else "their". A possessive, so no verb moves. A power's row (`factionRow`) and
  the institution rows keep "its". The brunt's member row passes the sentence it resolved from as `key`, so a declared twin
  ("its people stand guard", "the strain falls first on its people", "its houses are where the crisis is felt first") is
  read by its original. `CastNpc` gains `gender` (typedef only).
- **`castReasonSentence(reason)`, exported: THE ONE FOLD BACK**, the inverse of the person form. The first "her" / "his" /
  "their" goes back to "its" only where the sentence it makes is of the closed form or a declared sibling of one (a
  membership read of `BRUNT_SIBLINGS`; no line is unwrapped, so the strip ban is untouched); a `; next in line …` tail is
  kept; every other reason, and every power's reason, comes back unchanged.
- The file's effective size (eslint `max-lines`, blank lines and comments skipped) is 796 against the domain ceiling of 800
  (776 at the base); a first draft read 802 and reddened `tests/lint/sizeBaseline.test.js`, cured by compacting the new
  code, not by a baseline entry.

`src/` grep: no reader in `src/` keys a cast row by the text of the three families (`crisisCastFindings.js` reads `dm` and
`collaboratorAmbition`; `crisisHooks.js` reads its predicate set and `instigatorRival`), so no `src/` reader is re-routed.

## Red first: the walker

`tests/domain/frame2NamesRule.test.js`, a new case: "crisisCast: no stored reason on a person's row calls that person
"it"; the pronoun is the person's own", over the file's born pool (120 towns, 60 in crisis). It masks the three "it"s the
sentence itself names (the seat, the house, the occupation) and fails on any "it"/"its" left, or a "her"/"his" against the
person's `gender`.

- At `4421fbf6c` (the walker alone): **red, 36** (waverer 18, instigator 10, brunt 8). The file's other 13 green, 1
  expected fail.
- At the fix: **green, 0**. 14 passed, 1 expected fail.
- After, on the test pool: waverer "her" 12, "his" 6; instigator "her" 6, "his" 4; brunt "his" 6, "her" 2.

## Before and after, by family (B10's pool, re-born on this tree)

408 towns, each `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`: 48 calm (8 a tier, `{ settType }`,
seeds `b10-calm-<tier>-<i>`, a birth with a crisis set aside) and 360 in crisis (`{ settType, stressTypes: [kind] }`, every
kind × tier × 4, seeds `b10-<kind>-<tier>-<i>`, kept where the birth holds a crisis; B10 counted 348 on its base).

| family | before | after | by kind (before) | after, pronoun : gender |
|---|---|---|---|---|
| waverer | 66 | 0 | recently_betrayed 13, succession_void 12, insurgency 11, religious_conversion 11, slave_revolt 10, politically_fractured 9 | her : female 29, his : male 37 |
| instigator | 20 | 0 | succession_void 20 | her : female 9, his : male 11 |
| brunt | 13 | 0 | plague_onset 6 "tend the sick", monster_pressure 4 "stand on the walls" (one with a next-in-line tail), mass_migration 3 "stop trusting" | her : female 8, his : male 5 |
| **all** | **99** | **0** | | |

Every cast holder in the pool carries a `gender`; "their" is reached only by a person given none (the hand-built Ren Hale).

## Confinement (base `4421fbf6c` and tip, the whole stored record per town, sha256 and every leaf diffed)

| towns | count | byte-identical |
|---|---|---|
| calm | 48 | **48** |
| in crisis, no person row saying "it" | 270 | **270** |
| in crisis, with one | 90 | 0 (every one moves) |

The 90 differ in **198 leaves, every one a `stress[.i].cast.roles[j].reason` or `stressors[.i].cast.roles[j].reason` on a
person's row** that said "its" and now says that person's own possessive, nothing else in the sentence changed (99 rows,
each stored twice). 0 leaves of any other kind.

## The five reds, each cured by its cause (no assertion loosened, no floor lowered)

1. `tests/domain/crisisCast.test.js` · "rule 1: the one who bears the brunt is the least powerful whose role touches the
   base the crisis hits": Ren Hale (no `gender`) is re-pinned to the person form, "the hunger falls first on their people",
   and the fold back reads it as `CAST_REASONS.bruntBase.food_security`. The fact guarded is unchanged (said in the test).
2. `tests/domain/crisisCastSeatAndAccess.test.js` · "the readers' two empty seats: …": on `rpf-town-succession_void-13` and
   `rpf-village-succession_void-13` the instigator is a man; re-pinned to "his power gains from the crisis", and the fold
   back reads it as `CAST_REASONS.instigatorGains`. The guard (no role, stake or hook says the rival outweighs whoever
   holds the seat; the rival claim's stake) is still asserted, unchanged.
3. `tests/generators/people/castDerived.test.js` · "every person a cast names is on the roster; a power-drawn person holds
   a membership in a power of that relation": `relationFor` reads `castReasonSentence(row.reason)`. The figure "the
   corpus draws people from powers", measured on its own 845 births: **base 512; tip read raw 444 (the red); tip read
   through the fold 512**. Floor 500 kept; every assertion kept.
4. & 5. The stored figures, below.

## The stored figures this unit moves (NAMED; re-recorded by nobody)

**All four suites are already red at the base `4421fbf6c`, identically:** the golden master 521 of 525 rows, the promise
50 of 60 seeds, and each pinned-mode A-arm 40 of its 41-row slice (the vitest output at base and tip, timings aside, is
byte-identical). Their committed figures predate this lane's generator work; that is the seat's, not this unit's. What
THIS unit moves was measured base against tip by the suites' own births, every leaf diffed:

1. `tests/property/generatorGoldenMaster.test.js` · "every config produces byte-identical output to the golden master"
   (seed `golden-master-v3`): **5 of 525 rows**: `metropolis|germanic|coastal|port|civilized`,
   `metropolis|arabic|mountain|road|civilized`, `metropolis|mesoamerican|mountain|road|civilized`,
   `metropolis|south_asian|coastal|port|civilized`, `metropolis|south_asian|mountain|road|civilized`. Each moves ONE leaf
   stored twice (`stress.cast.roles.0.reason`, `stressors.cast.roles.0.reason`): the instigator, "its power gains from the
   crisis" → "her power gains from the crisis". 10 leaves in all.
2. `tests/generators/institutionBudgetPromise.test.js` · "every one of sixty seeds is byte-identical with the density
   factor forced to 1.0": **6 of 60** (`x46-promise-` 21, 39, 51, 52, 53, 57), each only these reasons (×2 copies):
   waverer "its" → "his" (21, 52, 53), "her" (51); instigator "its" → "his" (51); brunt "its people tend the sick" →
   "his" (39), "its people stop trusting their neighbours" → "her" (57). 14 leaves. (Harness control: at the base it
   reproduces the 10 committed hashes the suite holds green, 0 12 13 18 24 30 42 48 49 54.)
3. The pinned-mode A-arms, each over the golden's 41-row slice, which holds ONE of item 1's rows,
   `metropolis|south_asian|mountain|road|civilized|golden-master-v3` (the same leaf):
   `tests/generators/pipelinePinnedChoosers.test.js` · "A1 — the null change: an unpinned run and pins {} leave the golden
   corpus byte-identical"; `tests/generators/pipelinePinnedMode.test.js` · "A1 — the null change: no pins and pins {} leave
   the golden corpus byte-identical", "A2 — the lift moves nothing: the golden corpus, the draw count and the one-stream
   shape", "A5 — EM-R1b: a supplied transient chooser is still handed back, and the unpinned path is inert".

## Gates (each to a file under the builder's scratchpad `B11/`, read by `scripts/gate-tail.sh`)

- The walker: red 36 at the base, green at the fix (above).
- `tests/domain/crisis` (as a vitest filter: the folder and every `tests/domain/crisis*` file) and every test file that
  imports `crisisCast.js` (23), 34 files: **all green**, 338 passed, 1 expected fail. By file (passed): crisisTab 7,
  tonightSheetOnce 4, crisis/crisisSummaryVantage 17, crisis/plagueVantageQuarantine 2, crisisBlindDossierProse 5,
  crisisBlindWidened 10, crisisCast 31, crisisCastDefenceHome 5, crisisCastEdit 6, crisisCastFindings 5,
  crisisCastReaderRows 7, crisisCastSeatAndAccess 7, crisisConversion 3, crisisFactFindings 9, crisisFactFindings.wants 2,
  crisisHooks 24, crisisLeverNotBrunt 1, crisisOnsetContainerSync 1, crisisPage 9, crisisPageTierNoun 3,
  crisisRenameCascade 9, crisisStandInWords 5, dmEditKeysFollowRename 10, facts/census2dTables 11, frame2NamesRule 14
  (+1 expected fail), people/dualHatReaders 5, tailCrisisBatch7 5, tailCrisisBatch8 58, tonightSheetCast 4,
  bar2Places2Rows 5, defenceTwinLines 7, people/castDerived 6, resolveCrisisCast 10, pdf/restoredSubsections 31.
  Before the cures (the fix alone): 3 red, exactly items 1 to 3 above.
- The four stored-figure suites, run in the same pass: 6 red (golden master 1, promise 1, pinned choosers 1, pinned mode
  3), each on the same rows at base and tip (above); this unit's own moves are the named ones.
- `tests/lint` whole at the landed form: 220 files, 3264 passed, **7 failed, every one red at the base too, with the same
  message** (run with the base's five files swapped in): `sovereigntyLightingContract` (file count 3711 against 3705),
  `tuningRegister` (`sideArchetypes.js#FRAME_TUNING` not in the inventory; `crisisCast.js#CRISIS_CAST_TUNING`
  dependents moved: its `src/` importers, which this unit does not change), `proseWiringCensus` ×2 (the committed census
  stale), `seedLoopTotality` (`tests/security/frameShareVeil.test.jsx`, 4 bare loops), `proseNumerics` (the baseline's
  185-row diff), `readerShapeResolver` (259 against 256). `sizeBaseline`: green at the base, red at the first draft
  (802 > 800), green at the landed form (796).
- The pool re-born at the landed form: 408 of 408 stored records byte-identical to the first draft's, so the proof above
  holds unchanged.
- `npm run typecheck:ratchet`: OK (167, ceiling 167). `npm run typecheck:domain:strict`: OK (1113, ceiling 1113).
  `npm run lint`: 0 errors (38 warnings, none in these files).
