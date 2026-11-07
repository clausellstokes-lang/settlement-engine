# MERGE-R2: the rung-2 landing merged into the integration branch (2026-11-07)

Seat: MERGE-R2 (Opus 5.5), a child of the cloud chair (Fable 5.1), session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's full delegation of 2026-11-06.

The merge took `origin/lane/rung2-landing-2026-11-06` (`fc4cb0b9f`) into `lane/integration-2026-11-07` (`a8daff92c`). The merge-base is `76febf9b0`; the rung-2 side carries 538 commits over it and the integration side 162. Merge commit: **`10b8f09b4`** (parents `a8daff92c` · `fc4cb0b9f`).

**The first attempt was aborted and reported.** Fifteen `src` files conflicted where the two sides changed one behaviour in different ways, so the seat pushed nothing. The chair ruled the three classes at 12:5x UTC: one source for a fact, one writer for a derived field, and a declared line that also refuses what another figure holds, composed rather than picked. The merge was re-taken under those rulings.

## 1. Conflicts and resolutions (57 files)

### Class 1: migration direction (ruling 1: W0's field is the one fact)

| file | resolution |
|---|---|
| `src/generators/stressGenerator.js` | W0's write of `direction: 'arrivals'` at the draw stands. F13's second write (the catalog's influx) is retired. Both sides' imports kept (`hasMarketInstitution` on the census line). |
| `src/domain/crisis/migrationDirection.js` | Rewritten as a **reader** of W0's field. Its exported names are kept. `departures` reads as `exodus`, `arrivals` as `influx`, and an absent field still reads `influx`. A record carrying the census's own words is read as it says. F13's catalog derivation is deleted. |
| `src/data/stressInstitutionEffects.js` | The slot becomes a **direction pair**. F13's arrival line is tagged `direction: "arrivals"` with `needs: ["migration: influx"]` and stands first, so an arrivals pool is F13's row for row. W0's departures line is tagged `direction: "departures"` with `needs: ["migration: exodus"]`. The writer selects by `npcGenerator.js`'s direction filter. |
| `src/generators/stressNarrative.js` | `renderStressSummary(type, name, roll, direction, facts = null)`: W0's direction is the fourth parameter and the census's facts the fifth. The mass-migration renderer reads `(name, roll, facts, direction)`. |
| `src/generators/steps/assembleSettlement.js` | Passes both: `e.direction` and `factsOf(settlement)`. |
| `src/generators/power/governanceNarrative.js` (4 hunks) | The census's structure stands (the vignettes moved to `governingStressVignettes.js`; `baselineConflict` is resolved where it prints). W0's `migrationDirectionOfConfig` import and stability label are kept. The vignette gets `migrationEntry`, which is the entry or else `{ type, direction }` from W0's projection. |
| `src/generators/power/governingStressVignettes.js` | **The direction decides first** (W0's field through F13's reader). The economy only chooses between F13's two arrivals wordings. |
| `src/generators/power/stressFactions.js` | W0's test selects. F13's departures arm is now unconditional under it; F13's influx arm ("Newcomers' Committee") was unreachable and is retired. The `stressEntries` parameter becomes `_stressEntries`. |
| `src/generators/economy/foodBalance.js`, `src/store/configSlice.js` | Both sides' imports and keys are kept (`migrationDirection` beside `line` and `map`). |
| `src/generators/npcGenerator.js` (secret filter) | The census's partial-record facts carry W0's `summary.migrationDirection` on the migration entry. |

### Class 2: the NPC goal and secret draws (ruling 2: composed)

| file | resolution |
|---|---|
| `src/domain/facts/drawDeclared.js` | Gains `held` and `heldKey`. Held lines are excluded from the candidates before the draw, and from the twin and the argmax. A pool whose every candidate is held spends no roll and answers `none`. `hasUnheldCandidate` is exported. With nothing held the draw is unchanged. |
| `src/generators/npcGenerator.js` (9 hunks) | `generateNPCGoal(role, category, config, facts, held)`: the census's declared draw runs over REVIEW-INTAKE-4's fallback chain (stress → role → category → generic). A fully held pool is skipped without a roll. Every other side of each hunk is kept as follows. **Goal:** CENSUS-1i's facts and `npcLineAsSpoken`; the roster's held set gets both the drawn text and the spoken text. **Secret:** `role` and `hookRegistry.secrets` are both passed. **Crime knowledge and stress secrets:** `drawDeclared` with `held`. **Stress override:** the census's `resolveDeclared` with REVIEW-INTAKE-4's held check. **Imports:** both sides. |
| `src/generators/npc/factionLeaderSecret.js` (3 hunks) | `(config, institutions, generationContext, holderRole, heldSecrets)`. CENSUS-1i's holder-keyed rows are drawn through REVIEW-INTAKE-4's `drawRefusingHeldThrough`, whose one roll is `pick`'s own index. The rung-2 side drew here with a plain `pick`, not `drawDeclared`. |
| `src/generators/npcStructure.js`, `src/generators/narrativeGenerator.js` | The held check reads `lineText(...)`; the census's `facts` thunk and REVIEW-INTAKE-4's `heldByOthers` are both kept. |
| `src/generators/hookVariety.js` | Both: the census's note and REVIEW-INTAKE-4's helpers. |

### Class 3: single sites (ruling 3)

| file | resolution |
|---|---|
| `src/generators/economy/viability.js` | Water is the record's water rows (REVIEW-INTAKE unit 3, the source) **or** the census's water home (`waterOf`: coastal or riverside terrain, or a river or port route, the same three tests). The review-intake's process-water body stands. |
| `src/generators/foodGenerator.js` | `hasMarket = hasMarketInstitution(institutions)`, the catalogue's tags, i.e. the registry's detector. `hasOrchard` stays retired (W0-4b). |
| `src/generators/legacyGenerator.js` | W0's dated form (`w0-04`) stands. F11's capitalised fallback, which opened an undated annotation, is dropped. |

### Mechanical and register conflicts

| class | files | resolution |
|---|---|---|
| (a) soak-review | `scripts/audit/soak-review/checks.mjs`, `aggregate.mjs` | Both additive blocks kept. `coh:migration-direction` has two producers (W0's surface reader, the referee, and F13's crisis-fact reader) and one kind, keyed 10. `aggregate.mjs:262` reads `source()` (SOAK-MERGE §1's note). |
| (b) census and annex | `docs/census/`, `docs/content/` | The rung-2 side's. `wiring-census.json` is regenerated at the merged tree (`--check` 0). |
| (c) goldens | the 525, herald, x46 digests, fence file, `.golden-freeze-register.json` | Rung-2 bytes. The freeze register takes each surface row from the side that moved it: `pdf-golden-view-model-snapshot` keeps the integration side's signed row (only that side moved it). `docs/shift-records/` is untouched. |
| (c) golden pins | `worldFactRederive`, `editWorldFactResources`, `generationForkCensus`, `hookThemeDraws`, `institutionBudgetPromise`, `x46NpcBand`, `editCorpusRatchet` | Rung-2 values, with both sides' history comments. |
| (d) registers | observed-shape, writer reach, lighting, tuning, size, citation roster, mutation manifest, `PACKET_MANIFEST.json` | §2 below. |
| (d) resolver | `scripts/wiring-census.mjs` | R8's `symbol` resolver is kept. The rung-2 side's two walker controls (`proseWiringCensus` on the `rulingStructure` symbol rows) came through the merge, and they cover rows R8's `holderCitesBySymbol` does not. |
| (e) citations | `src/domain/prose/holderTable.js` | Both sides' symbol forms; `narrativeGenerator.js` re-cited 1037 → 1039. |
| bundles | `supabase/functions/_shared/*` | `npm run build:edge-shared` (exit 0). |

**Re-keyed with cause in the merge commit:** `stressNarrativeDeclared` passes `undefined` for the direction. `stressSecretDeclared` goes 33 → 34 (the pair). `npcGenerator.js` measured 1,301 effective lines composed and was compacted (no output byte moves) to **1,286**. Its ceiling is lowered 1,287 → 1,286; this also ends the integration side's listed 1,297 red (REVIEW_INTAKE_PLANTS).

## 2. Registers, re-derived at the merged tip

| register | door | result | commit |
|---|---|---|---|
| observed-shape | rung 29 → 30 (LANDING-R2 seat H's census-readers rung, re-numbered on W0-CLOSE's 29), the five-step ritual, then `--write` and the plain check | Same 1,440 · New 10 · Gone 11 · Inc 0 · Dec 0, seat H's 21 rows exactly (`short on merchant` is x1 here). Identities 1,451 → 1,450. Bank 77/51 → 76/50. Froze 2,047 / 1,450 / 403. The review builder refuses a tampered count (negative control executed). Plain check exit 0; walker 47/47 | act 1 `f7bc53623`, act 2 `a709af16d`, pins `6c3e25661` |
| writer reach | dark register clauses E and S; `--write` refused growth, so `--rebank --charter=§934.105` | Struck `growsMoreThanEats on foodRecord` (clause E: `foodSurplus.js` entered the dossier-pdf closure with the rung-2 chunk cure) and `randomDepletionEligible on resourceConditions` (clause S, LIT-NAME). Six re-dealt corpus ids rebanked. Cohort 1,257 → 1,229; plain exit 0 | `fbe335614` |
| AO-0 corpus pins | news-voice, news-headline, prose-family (a helper seat, measured through scratch copies) | CORPUS 262/0/262/43 → 266/0/266/44 (`queued\|npc_sabotage` arrives). Addresses → 44/2/88/0/88/364/532. scalarRows 26,471 → 26,701. Interaction +4 against the rung-2 pin (PLAUSIBLE) | `572c15018` |
| institution table | re-keyed | 1,849 = 1,925 − 72 (review-intake) − 5 (census-1f) + 1 | `572c15018` |
| each-family park | the walker's own cure | `chainNamesOnlyProcessors` loops its rows in one test; 108 holds | `7eeef76bc` |
| lighting census | `LIGHTING_CENSUS_REFREEZE=MERGE-R2` on a clean tree | files 3,107 · parked 384 · credited 2,723 · titles 28,535 · suiteTitles 7,671; plain 36/36 | `b14223b6b` |
| tuning inventory | `TUNING_INVENTORY_REFREEZE=MERGE-R2` | Five rows' lines +1. Every signed record and draft row of both sides kept. 76/76 | `9710200cc` |
| prose wiring alias draft | re-keyed | rows 8 → 9, generator-write 5 → 6 (the held key's `name` row, a finding, not a join) | `36688d025` |
| size baseline | measured | the JSON union; `npcGenerator.js` 1,286 | `10b8f09b4` |
| citation roster | walker re-measure | `dated` 129 → 130 (this record), note `_rosterGrowth2026-11-07-merge-r2` | the record commit |
| mutation manifest, held-key, fork census, soak-merge | walkers | green in `tests/lint` + `tests/scripts` | n/a |

## 3. Dist budgets (the chair's standing ruling: trim where no output byte moves, then re-record; each rise vetoable by the owner)

Fresh `vite build`s of git archives. The first parent `a8daff92c` and the second parent `fc4cb0b9f` were built (the second reproduces its recorded figures to the byte), then the merged tip. No commit after `10b8f09b4` moves a `src` byte. No zero-output trim was found.

| budget | first parent | second parent | merged | recorded |
|---|---|---|---|---|
| generation worker | 1,579,636 | 1,690,414 | 1,695,569 | 1,690,414 → **1,695,569** (base 1,574,838 + 4,798 + 115,576 + 357 interaction) |
| engine band | 681,779 | 704,656 | 707,702 | < 704,657 → **< 707,703** (678,351 + 3,428 + 26,305 − 382) |
| first paint, raw | 1,041,311 | 1,062,940 | 1,062,668 | 1,062,940 held |
| first paint, gzip | 332,915 | 338,385 | 338,535 | → **338,535** (+150) |
| first paint, Brotli | 279,630 | 284,778 | 284,950 | → **284,950** (+172) |

The landing fixture was re-emitted through its door (`--seed lf-033 --emit`; `--check` 0). The town's tie now names Hector Gallagher and Aengus Walsh. **For the writing wave:** the stock narration in `scripts/generate-landing-fixture.mjs :: STOCK_NARRATION` still speaks of Hector Gallagher and Inghean MacCarthy. No new prose was written (M-4).

`verify:dist` (commit `b3700711d`): every build test passes, including the flag-on build (`engineAbsentWhenRemote` 10/10). The one refusal is the two `engineBundleReplay` titles that skip by design while the 525 and the fence are stale; that is the banked golden union.

## 4. Suites

- **`tests/lint` + `tests/scripts` whole** (`sh scripts/gate-tail.sh npx vitest run tests/lint tests/scripts`): **exit 0, 218/218 files, 3,200 tests.** The first whole run read 11 files red, every one caused by the union and re-keyed as §2 lists (plus the writer-reach register's length pin, 45 → 43, for the two struck rows).
- **The chair's proofs:** `rosterDuplicateDraws`, `migrationDirection`, `tests/domain/facts/` (the declared-draw walkers, `declaredMoves` included), `soakMerge`, `holderCitesBySymbol`: green. The soak 1,000 (`soak-review.mjs --count 1000 --workers 4`) at the merged tip: 1,000 settlements, 683 findings, **0 errors, CLIMB**. **`coh:migration-direction` 0** (W0's referee, 45 → 0 held through the union), `cert:false-presumption` 0, `coh:roster-duplicate-secret` 0 and `coh:roster-duplicate-goal` 0.
- **The golden red list (banked, never re-recorded; the integration landing signs):** 14 files / 17 tests: `generatorGoldenMaster` 1, `espionageDormancyFence` 1, `heraldKnowledgeDeskGolden` 1, `dossierProseManifest` 2, `goldenViewModel` (pdf) 1, `dmLayerGoldenIsolation` 1, `editCorpusRatchet` 2, `editWorldFactResources` 2, `worldFactRederive` 1, `generationForkCensus` 1, `hookThemeDraws` 1, `institutionBudgetPromise` 1, `x46NpcBand` 1, `rosterFinalUnderHeldRoster` 1. Every one is keyed to a golden or to the composed corpus. `presetLightingWitness` is green.

## 5. Environment notes

- `tests/lint/ledgerCitationIntegrity` and `tests/scripts/provenanceMap` read the local ref `review-fixes-2026-07-08`. That ref was fetched; neither test needed a code change.
- The engine-remote dist (`node_modules/.cache/engine-remote-dist`) was built with the command recorded in ENGINE_MERGE2.

## 6. Tip

The tip is this record's commit on `lane/integration-2026-11-07`, pushed with `--no-verify` after each register commit, as the brief requires. The commits after the merge are: `f7bc53623` (OSR act 1), `a709af16d` (act 2), `6c3e25661` (OSR pins), `fbe335614` (writer reach), `572c15018` (corpus re-keys and the freeze register), `7eeef76bc` (each-family cure), `b14223b6b` (lighting), `9710200cc` (tuning), `36688d025` (prose-wiring alias draft), `b3700711d` (dist budgets and the landing fixture), and the record commit (citation roster and the writer-reach length pin).

**CONFIRMED vs PLAUSIBLE.** These are CONFIRMED by execution: the registers, the suites, the soak, and the budget figures (every parent rebuilt). The interaction attributions are PLAUSIBLE: the corpus +4, the service rows +1, the bytes +357 / −382 / +150 / +172. None of them was bisected per step.
