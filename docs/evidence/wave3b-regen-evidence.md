# Wave 3 — Step 3b evidence bundle (the fix stack; regen PENDING, not performed)

Base: 3a commit `88220fb0`. All changes UNSTAGED in the working tree; ZERO commits; UPDATE_GOLDEN never run.
Method: fixes landed in dossier order as sequential stages; after every stage the full 187-row v3 corpus was
re-rendered (full JSON + sha256) and diffed against the previous stage — per-fix row-impact census, aggregated
field-path diffs (3 samples/path), NPC-roster PRNG sentinel, and a CHECKED boundedness claim per fix.
Machine artifacts: `fixes/<ID>-census.json` (18 files), `stages/*/hashes.json`, `per-fix-summary.json`,
`golden-drift-keys.json`, `golden-expected-red.log`, `final-vitest-full.log`, `final-gate.log`, red→green logs
(`fixes/<ID>-red.log` / `<ID>-green.log`).

## Per-fix census (chronological stages; boundedness CHECKED in each census json)

| Fix | Landed | Rows changed | Field-path scope | Boundedness (checked) | RNG | red→green |
|---|---|---|---|---|---|---|
| B2 zero-power guard + E4 rng save/restore | rulingStructure (exported normalizeAndAnnotateFactions), kernel/rngContext stack + pipeline/regen callers | **0/187** | — | golden-neutral PROVEN | none | 3 suites green (guard cases red pre-fix via B1 run) |
| B1 faction-power renorm | factionDynamics renormTo100 + labels-from-final-share; power/rulingStructure exports renormalizeFactionPower; neighbourFactions renorm+relabel | **148/187** | powerStructure.* + derived (NPC order, ratios, traces) | changed rows == EXACTLY the 148 rows whose faction sums ≠100 pre-fix; post-fix all 187 sum to 100 | none | 10 red → 14 green |
| C1/C2/C3 defense | famine cap Math.min; magic health-gate ÷ ungated presence; garrison chainHealthy import credit | **102/187** | all defenseProfile.* + verified consumers (publicLegitimacy, 8 NPC goal strings) | magical×98=C2, military×35=C3, C1=0 corpus rows (no famine∧divine co-occurrence; proven by test) | none | 3 red → 20 green |
| A1+D1 economy | tier-connectivity pool selection + stage-5 export re-seat | **41/187** | ONLY primaryExports[]/transit[] | A1=8 (all resolved-major-route incl. 3 random_trade rolls), D1=33 (re-seated slave/military), neither=0 | none | 11 red → 12 green |
| A2 timber/clay keys | economicState gate needles + DEPLETED_IMPORT_MAP + registry pin test | **51/187** | incomeSources[] + 4 primaryImports | coastal 24 / mountain 26 / plains 1; ZERO forest/hills/desert (terrain-exact, matches their 31-row shape + our new mountain coverage) | none | 3 red → 25 green |
| A3 terrain founding hooks | narrativeGenerator resolveTerrain-first lookup; dead `_routeHooks` local deleted | **85/187** | exactly ONE path: history.founding.reason | forest 24 / mountain 27 / plains 34 — the three hooked terrains only (theirs: 86 rows, same three) | pool swap, same draw count | 3 red → 5 green |
| D2 pressure compound | genPressureDetail forwards economicState.compound | **0/187** | — | corpus-neutral; production-changing (test proves the winning branch unreachable pre-fix) | none | 1 red → 3 green |
| D3 history 'undefined' | .message→.description fallback + omit-empty | **0/187** | — | corpus-neutral; the RED broad sweep (192 pipeline generations) FAILED pre-fix — leak was real off-corpus | none | 2 red → 2 green |
| A4 services tier sentinel | tier-before-sentinel at both criminal gates | **0/187** | — | corpus-neutral exactly as dossier predicted (corpus pins explicit tiers); production-changing (settType:'random') | none | 2 red → 3 green |
| D4 terrain-vocab join | synonym matcher (terrain side) + nearby synonym bridge + geographyData flax/hides/grapes | **59/187** | 44 paths resourceAnalysis.*, 5 paths economicViability.suggestions (verified consumer) | desert 24 / hills 8 / mountain 12 / plains 15; ZERO forest/coastal/riverside | none | 8 red → 19 green |
| E2 tuning batch (7 items) | descriptors, VS16, conditionPromotion severity, provisioning deps, legitimacyDefScale, factionRoles bands (+C3 already landed) | **186/187** | per-item attribution in census (influence ×229, severity ×153, dependencies ×152, legitimacy ×101, factions[].name ×24) | broad by design; NPC churn = 12 rows GAIN 2 deterministic structural NPCs (crafts faction now nameable) — additive, 0 identity/order | none | 8 red → 8 green |
| B3/B4 power | War Council dedup; canonical hostile/rival tokens (ours kept) | **0/187** | — | no siege∧wartime co-occurrence, no bound neighbours in corpus | none | 3 red → 6 green |
| E3 NPC trait distribution | generateReligionType draws presence bucket from TRAIT_PRESENCE_DISTRIBUTION (exported) | **187/187** | NPC personality slots + full downstream draw shift | THE one RNG-consuming fix (+1 seeded draw/NPC by design) — 187-row churn is the expected signature, dossier-exempt from the sentinel; determinism re-proven by deep-determinism suites in the final run | +1 draw/NPC | 2 red → 14 green |
| D5 tradeCommodity | new module + 4 sites re-wired BY HAND (Wave-E collision re-derived) | **0/187** | — | corpus-neutral (six first-export labels don't distinguish the drifted copies); pinned by unit test | none | 5 green (pin) |
| D6/D7 unifications | stressPriority (5 sites) + roleCategory (npcGenerator flags/ladder) | **6/187** | secret.what/stakes + 1 secondaryAffiliation | D6 = 0 by PROOF (all 5 copies byte-identical to canonical pre-unification); 6 rows = D7 metadata-first flag deltas | none | 34+3 green (pins) |
| B5/E1/E5 tail | party-pair dedup (4 templates); validator override dedup + metropolis forced-catalog + magical_controversy no-magic gate; criminal_network/vassal conflict slice + covert backlink template | **0/187** | — | golden-neutral as dossier predicted; all covered by direct tests | none | B5 8 green; E1 3 red → 10 green; E5 2 red → 5 green |
| DEFERRED domain re-ports | regenerationMode derived-id lookup; reconciliation at:null; migrations forward-warn; normalizeSettlement structural fingerprint | **0/187** | — | all OFF-pipeline (regen planning / save / load / import) — golden-neutral PROVEN | none | 8 red → 22 green |
| FGD foraging key | economicData 'foraging'→'foraging_areas' (finishedGoodsDemand join fix) | **4/187** | ONE path: primaryExports[] | exactly the 4 city\|forest\|isolated rows (foraging_areas is a forest resource) | none | 1 red → 3 green |

**Interaction census:** Σ per-fix changed-row events = 869 over 187 distinct rows (every row changed at least once —
E3 alone touches all 187). Interactions the dossier predicted (R6) were handled by construction: B1 landed FIRST
so no later census is polluted by the renorm; A1×D1 share one stage/commit-unit; D4×A2 overlap on mountain/coastal
rows is visible in their separate stage censuses (A2 stage precedes D4 stage; both bounded independently).

## PRNG-desync sentinel (dossier §3.3)
Per stage, every changed row's NPC (id,name) roster was compared before/after:
- All no-RNG fixes: **0 identity changes anywhere**. Two flagged cases fully explained and taxonomized:
  B1 = 45 rows ORDER-ONLY (same ids+names permuted — NPC display order derives from faction power);
  E2 = 12 rows ADDITIVE-ONLY (2 deterministic structural NPCs gained; slug ids, template names).
- E3 (the documented exception): full churn on all 187 rows — the designed +1 draw/NPC signature.
- Deep same-seed determinism (byte-identical double-generation, 100 fuzz cases) passes in the final run.

## The golden — EXPECTED RED, recorded, not regenerated
- `tests/property/generatorGoldenMaster.test.js`: **187/187 keys drift** (`golden-drift-keys.json`, `golden-expected-red.log`).
- `tests/pdf/goldenViewModel.test.js`: 1 snapshot (SHARED_FIELDS canon values, fixed seed) — the second
  hash-pin lane over generation output; same regen family. The architect's regen = `UPDATE_GOLDEN=1 vitest run
  tests/property/generatorGoldenMaster.test.js` + `vitest run tests/pdf/goldenViewModel.test.js -u`.
- `tests/generation.test.js` inline structural snapshot SURVIVED the whole stack (counts unchanged at the pinned seed) — no update needed.

## Final gate state (stop-state, by design)
- vitest: **565/567 files green — 6593 passed, 2 failed (the two regen-pending lanes above), 2 skipped**
  (both pre-existing non-wave3 skips: promoteDemoteMerge authoring-menu, advanceIntervalProgressYield lazy-chunk contract).
  All 6 generators-wave DEFERRED tests are un-skipped and green (b07 #4/#5/#6, factionPowerSum,
  normalizeSettlementContentId, corruptionTraitGate).
- typecheck (full tsc): **0 errors** · domain strict: **0 / ceiling 0** · any-cast ratchet: **2213 ≤ 2291**
  (frozen per-file baseline untouched — a transient +1 in conditionPromotion was re-typed structurally, not widened)
- eslint: **0 errors, 16 warnings — byte-identical warning set to HEAD** (verified by stash A/B)
- layer-boundary cycle baseline: **2** (test green in final run)
- servicesGenerator entry ceiling (≤400) green; edge aiGrounding bundle rebuilt (mechanical, see deviations).

## Deviations & fence notes (for the architect's review)
1. **D4 fusion beyond the dossier line** ("port only the terrain-side matcher"): their `nearbyHasResource` consulted
   synonyms via EXACT membership; our `tokensReconcile` cannot bridge `gemstone_deposits`→`gemstones`, so
   terrain-side-only left gemstones/preciousMetals dormant on mountain (verified empirically). Landed: OUR
   reconcile rule + the synonym bridge on the nearby side — strict superset, bounded to the synonym chains.
2. **stressorWhatIf.test.js NOT re-ported (documented drop):** it pins their store what-if engine
   (`proposeChange`/`applyChange` on settlementSlice) — machinery our tree DELETED as dead architecture (F34)
   and replaced with the stressorEdits path, which our own `tests/joins/stressorEdits.test.js` already pins
   (green). Porting it would resurrect store code outside this wave's fence. Architect/wave-4 call.
3. **Fence extensions used, all coordinator-sanctioned or mechanically required:**
   (a) the 4 domain deferral files (regenerationMode, settlementReconciliation, settlementMigrations,
   normalizeSettlement) — required by the coordinator's un-skip instruction; all off-pipeline, golden-neutral
   proven; (b) `src/domain/relationships/neighbourBackLink.js` — named by dossier E5; (c)
   `src/domain/activeConditions.js` — one export (CONDITION_ARCHETYPE_TEMPLATES) for conditionPromotion (R4
   fence exception); (d) `src/data/economicData.js` foraging key — the fix finishedGoodsDemand.test.js exists to
   pin; (e) `supabase/functions/_shared/aiGroundingBundle.*` — MECHANICAL rebuild via `npm run build:edge-shared`
   (domain inputs changed; freshness gate requires it; precedent commit c4a5c384).
4. **Their tests adapted to our kernel/coordinates** (imports re-pointed to src/kernel/*, power/* modules; D2/E3
   tests wrapped in seeded scopes for our fail-closed rngContext; D3 broad sweep migrated to live terrainOverride
   vocabulary; A1/D1 military-export regex matched to our em-dash labels).
5. **institutionIdentity.test.js migrated** (coordinator ruling): dead `terrain:'river'` + local
   'golden-master-v1' seed → live `terrainOverride:'forest'` (isolated's honest terrain) at verified seed
   `inst-id-v3-1`; BOTH pinned behaviors (timber chain w/o false Mill join; garrison→'Town watch' dependency)
   reproduce; 27/27 green. Before/after probe in this bundle's session log.
6. **R7 held:** kernel rngContext kept fail-closed (stack mechanics only; no fallback reintroduced); nothing
   imports their customCategories/customContentSchema; new prose is clean under the F24 lint (eslint 0 errors).
