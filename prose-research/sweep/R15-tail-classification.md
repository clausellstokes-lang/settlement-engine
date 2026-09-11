# R15 — the src long tail, classified per file by CONSUMER

⟦lane R15-TAIL · Opus 5 under a Fable 5.1 chair · read-only · 2026-09-06⟧

**Sha:** every figure below is measured at **`fd36f0298`** (the §902 tip), the sha the tree
`scratchpad/laneOSR18` stands at (`git rev-parse HEAD` = `fd36f0298b1ead15f2a80eff83dafb92114a7ea4`,
porcelain empty). **R15 carries 3,894 rows at this sha, not the 3,883 PROBE_ALL publishes at
`6b80d1e8e`** — the +11 is exactly the drift the refutation's P-9 records, re-derived here rather
than taken on the brief's word (34,527 admitted rows at fd36f0298 against 34,508 at 6b80d1e8e).

**Corpus file:** `scratchpad/runHEAD/corpus.json`, md5 `223df7caaeb79c43d10467c72898ec9f`.
⚠ The path the brief names — `prose-research/probe-all/corpus.json` — **does not exist**; that
directory holds only the ten `*.mjs` extractors. Four byte-identical copies of the fd36f0298 corpus
do exist (`runHEAD/`, `refute-tics/`, `sweep/bible-work/`, `sweep/refute-extractors-work/`); the
fifth, `run6b80/corpus.json`, is the 6b80d1e8e run and was used only as the control.

**Field names, read from the rows and not assumed:** `register, file, p, pool, shape, viaFn, angle,
audience, slots, text, from, unit, sentenceShaped`. **No R15 row carries a `line` field**
(`hasLine: 0` over all 3,894), so the `line` in the JSON is derived by locating each string in the
tree: 3,472 of 3,894 located (1,981 of them in the module the attributed file re-exports from,
recorded as `lineFile`); the remaining 422 are composed at runtime inside template/function pools
and have `line: null`.

## The five classes, as the tree defines them

| class | definition, anchored on a site in the tree |
|---|---|
| `reader` | rendered to the player/DM on a product surface — a JSX component or a `src/pdf/` section |
| `dm-only` | rendered ONLY behind the DM-private gate: the keys `PRIVATE_KEY_RE` strips at `src/domain/display/publicSafe.js:101` (`secret`, `\bdm`, `guidance`, `plotHook`, `hook`, `compass`, `chronicle`, `notes`…) plus the NPC `goal / secret / plotHooks / relationships` strip at `:170`. The owner may expose them with the `shareDm` opt-in (`src/components/ShareToGallery.jsx:452`). |
| `dev` | comments, validator/console strings, dev notes, provenance / coverage / law ledgers, design tokens, script- and test-only text |
| `ai-prompt` | assembled into a model prompt and never rendered |
| `ambiguous` | consumer not traceable in the tree at this sha — never guessed |

## Totals

| class | rows | share of 3,894 |
|---|---:|---:|
| **reader** | **2,758** | **70.8%** |
| dm-only | 225 | 5.8% |
| dev | 695 | 17.8% |
| ai-prompt | 59 | 1.5% |
| ambiguous | 157 | 4.0% |

**Reader-facing share: 70.8% (2,758 / 3,894).**
**Human-facing share (reader + dm-only): 76.6% (2,983 / 3,894).**
Non-human text (dev + ai-prompt) is **19.4%**.

### How much of that rests on a render site actually opened

| evidence grade | rows |
|---|---:|
| `render-site-read` — the render/prompt line was opened and read | 2,540 (65.2%) |
| `family-trace` — the module's own consumer chain was read to a named render site shared by the export family | 344 (8.8%) |
| `family-inference` — module traced to a JSX/PDF ancestor, leaf key is a display field, individual render line not read | 509 (13.1%) |
| `declaration` — classified from the declaration site (provenance / coverage / law / validator row) | 353 (9.1%) |
| `reachability` — the module is reachable from NO product surface at this sha | 48 (1.2%) |
| `untraced` — no consumer found; these are ambiguous rows | 100 (2.6%) |

**The strict floor.** If every `family-inference` row (509, all of them `reader`) were demoted to
`ambiguous`, the reader-facing share would fall from 70.8% to **57.8%** (2,249 / 3,894). The
reader-dominance finding — and the refutation of "mostly AI-layer prompts, design-token descriptions
and dev notes" — survives at either bound. Pick the bound the corrected sentences should carry.

## The three files with the most reader-facing strings

| file | reader | total |
|---|---:|---:|
| `src/data/tradeGoodsData.js` (`INSTITUTION_SERVICES[*].desc`) | 934 | 934 |
| `src/store/selectors.js` (`selectCurrentCatalog().*.desc`) | 274 | 274 |
| `src/domain/cultureProfiles.js` (`CULTURE_PROFILES`) | 207 | 207 |

Rendered respectively at `src/components/ServicesTogglePanel.jsx:58` (`{def.desc}`),
`src/components/InstitutionalGrid.jsx:143` (`truncateAtWord(instDef.desc, 80)`, full text at `:271`),
and `src/pdf/sections/IdentityDailyLife.jsx:278-279` (`['Built form', culture.builtForm]`).
Those three files alone are **1,415 rows — 36.3% of the whole register and 51.3% of everything
reader-facing in it.**

## How the R-10 sample compares with the whole

R-10 did not sample R15 at random. Its 83 strings are **the em-dash-bearing subset** — the
Axis A breach list (`89 occurrences / 83 strings`). That subset is a strongly dev-biased slice,
and measuring the two populations separately shows exactly how biased:

| population | n | reader | reader share |
|---|---:|---:|---:|
| R-10's slice — R15 strings containing an em dash (my table, 80-char text field) | 66 | 21 | **31.8%** |
| every other R15 string | 3,828 | 2,737 | **71.5%** |
| the whole register | 3,894 | 2,758 | **70.8%** |

**R-10 is right about what it measured and wrong as a description of R15.** Its 23/83 = 27.7%
reader-facing reproduces here as 21/66 = 31.8% on the em-dash subset — the two agree within the
difference in what each population admits (my `text` field is truncated at 80 characters, so an em
dash past character 80 is invisible to this cut, and PROBE_ALL's Axis A screen deliberately drops
the admission floor and counts prose-shaped strings *at any length*, which the sentence-unit R15
corpus does not admit). Generalised to the register, the sample understates the reader-facing share
by a factor of **2.2**.

The four files R-10 named as R15's reader-facing content are confirmed as reader-facing, but they
are a rounding error in the register: `customContentSchema.js` 18 reader of 22, `searchIndex.js` 99
of 199, `dossierViewModel.js` 3 of 5, `labelBands.js` 9 of 9 — **129 rows of the 2,758.**

## Three findings the per-file pass turns up that the sample could not

1. **The largest non-reader block in R15 is not dev — it is DM-private reader prose.**
   `src/data/stressInstitutionEffects.js` (189 rows: 95 `secret`, 94 `stakes`) is authored NPC
   secret prose. `npcGenerator.js:779-780` makes it `npc.secret = {what, stakes}`, rendered at
   `src/components/new/npcComponents.jsx:458-463`, and `PRIVATE_KEY_RE` strips it from every public
   projection. With `VARIANT_HOOKS` (35, `stressorDynamics.js:738`, stamped as `originContext.hooks`
   — `hook` is a private key) and one NPC `goal.short`, that is the whole `dm-only` class: 225 rows.
2. **R15's `ai-prompt` content is 59 rows, and 47 of them are one export nobody would guess.**
   `signalRegistryEntries()[].description` (`src/domain/autonomy/index.js`) reads like panel copy
   and is not: `AutonomyPanel.jsx` renders no `description`, while `src/domain/aiCharter.js:278`
   pushes each one into the AI CHARTER teaching block "destined for the static prompt prefixes".
   The other 12 are `src/domain/aiGrounding.js` (`assemblePromptSections()`, `forbiddenChanges()`).
3. **The `keywords` half of `COMPENDIUM_INDEX` is a non-rendered token bag — and its twin is not.**
   `searchIndex.js` splits exactly 100 `keywords` / 99 `term`. `.term` is the rendered result label
   (`CompendiumGlobalSearch.jsx:179`); `.keywords` is folded into the match haystack at
   `searchIndex.js:264` and is **not** in the SEO description either (`seoCompendium.js:51-53` builds
   that from `term` + `category` only). One export, two consumers, two classes.

## What stayed ambiguous, and why (157 rows)

- **100 rows, untraced consumer.** `TRADE_DEPENDENCY_NEEDS[*].detail` (60) lands as `need.detail`
  on `economicState.tradeDependencies` (`economicState.js:716`), but the PDF prints only `label(d)`
  (`EconomicsTrade.jsx:183`) and `EconomicsTab.jsx:288` reads only `d.severity` — no reader of
  `.detail` was found. `RESOURCE_DATA[*].desc` (33) and `.warning` (7): every traced read of
  `RESOURCE_DATA` takes `.label`, `.terrain` or `.commodities`.
- **48 rows, DARK — authored prose in modules no product surface reaches at this sha.**
  `characterReadModel.js` `EXPERIENCE_CLAUSES` (21), `engagementNarrative.js` `ENGAGEMENT_PHASES`
  (25), and two more. These are reader-register sentences that render to nobody today. That is a
  finding for the estate, not a classification failure — and it is the honest reason they are not
  counted in the 70.8%.
- **9 further rows** in files where the leaf key is neither a display field nor a dev note.

---

## PROPOSED corrections for `PROBE_ALL.md` — REPORT ONLY, the chair applies

### C-1 · §4 register roster, the R15 row (line 271)

CURRENT:

> `| R15 | long tail elsewhere in `src/**/*.js` | sentence | 3883 | 233 | catch-all; **heterogeneous** — real reader prose (`tradeGoodsData`, `worldPulse/index`) mixed with design-token and dev strings |`

REPLACEMENT:

> `| R15 | long tail elsewhere in `src/**/*.js` | sentence | 3883 | 233 | catch-all; **heterogeneous, but reader-dominated** — a per-file classification by consumer finds **70.8% reader-facing** (2,758 of 3,894 at `fd36f0298`), 5.8% DM-private, 17.8% dev, 1.5% AI-prompt, 4.0% untraceable; `tradeGoodsData` alone is 934 rendered institution-service descriptions [R15-TAIL] |`

⚠ `worldPulse/index.js` should be struck from the "real reader prose" example pair: the barrel is
deliberately NOT imported by any product module (the worker takes the leaf —
`src/workers/advanceInterval.worker.js:23`), and all 37 of its R15 rows are dev classification
text. `src/store/selectors.js` (274, all reader) is the honest second example.

### C-2 · §5 Axis A, the R-10 sentence (lines 741–744, verified verbatim)

CURRENT:

> "And the 146 in R15/R18 are **not** "mostly dev" **[R-10]**: R18's 57 are 38 reader-facing generated prose / UI labels, 14 dev throw and guard messages, 3 AI-layer prompts and 2 ambiguous; R15's 83 are 60 dev, design-token or ledger strings and **23 reader-facing** (`customContentSchema` 15, `labelBands` 5, `searchIndex` 2, `dossierViewModel` 1)."

REPLACEMENT (append after the existing sentence, which stays true of what it measured):

> "⚠ Both counts are of the **em-dash-bearing subset**, which is not representative of either register. Classified per file by consumer over the WHOLE of R15 at `fd36f0298` (3,894 rows), the register is **70.8% reader-facing** — 2,758 reader, 225 DM-private (NPC secrets and plot hooks, stripped by `publicSafe.js:101`), 695 dev, 59 AI-prompt, 157 untraceable. Within R15 the em-dash subset is 31.8% reader against 71.5% for every other string, so the breach list understates R15's reader share by a factor of 2.2 **[R15-TAIL]**."

### C-3 · ⚠ the brief's premise, corrected by measurement

The lane's brief asks for corrections to the sentence *"mostly AI-layer prompts, design-token
descriptions and dev notes"* in §R15 and Axis A. **That sentence is no longer in `PROBE_ALL.md` as
an assertion.** `grep -n "mostly AI-layer prompts"` returns exactly one hit — **line 20**, inside
the §0 corrections table, where it is quoted as the CLAIM that R-10 refuted, and the corrections
receipt's R-10 row shows the edit already landed (`629 → 741`, 1 change). There is nothing to
strike: the owed work is to widen the replacement that already stands, which is what C-1, C-2 and
C-5 do.

For the record the retired phrase is wrong for R15 by every measure taken here: AI-layer prompts
are **1.5%** of R15 (59 rows, 47 of them a single export), design tokens and dev notes together
**17.8%**, and the register is **70.8% reader-facing**.

### C-4 · a sha line the register table does not carry

Add to the §4 heading or the R15 row: **"R15 is sha-bound: 3,883 at `6b80d1e8e`, 3,894 at
`fd36f0298` (+11, P-9)."** Anyone re-running the classification at HEAD will otherwise read the
+11 as a defect.

### C-5 · §0 corrections table, the R-10 row (line 20, verified verbatim)

CURRENT:

> `| R-10 | §5 Axis A · 629 | R15/R18's 146 are "mostly AI-layer prompts, design-token descriptions and dev notes" | R18's 57: **38 reader-facing**, 14 dev, 3 AI prompts, 2 ambiguous. R15's 83: 60 dev, **23 reader-facing** | CONFIRMED |`

REPLACEMENT:

> `| R-10 | §5 Axis A · 629 | R15/R18's 146 are "mostly AI-layer prompts, design-token descriptions and dev notes" | R18's 57: **38 reader-facing**, 14 dev, 3 AI prompts, 2 ambiguous. R15's 83: 60 dev, **23 reader-facing**. ⚠ both are the em-dash subset: the WHOLE of R15 (3,894 rows at `fd36f0298`) is **70.8% reader-facing** — 2,758 reader, 225 DM-private, 695 dev, 59 AI-prompt, 157 untraceable **[R15-TAIL]** | CONFIRMED, WIDENED |`

---

## Per-file table (234 files, sorted by row count)

| # | file | total | reader | dm-only | dev | ai-prompt | ambiguous |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | `src/data/tradeGoodsData.js` | 934 | 934 | 0 | 0 | 0 | 0 |
| 2 | `src/store/selectors.js` | 274 | 274 | 0 | 0 | 0 | 0 |
| 3 | `src/domain/cultureProfiles.js` | 207 | 207 | 0 | 0 | 0 | 0 |
| 4 | `src/domain/compendium/searchIndex.js` | 199 | 99 | 0 | 100 | 0 | 0 |
| 5 | `src/data/stressInstitutionEffects.js` | 189 | 0 | 189 | 0 | 0 | 0 |
| 6 | `src/domain/worldPulse/commercialReasonsNews.js` | 151 | 151 | 0 | 0 | 0 | 0 |
| 7 | `src/data/goods/chains.js` | 115 | 115 | 0 | 0 | 0 | 0 |
| 8 | `src/domain/worldPulse/grammarNews.js` | 86 | 86 | 0 | 0 | 0 | 0 |
| 9 | `src/data/economicData.js` | 84 | 22 | 0 | 2 | 0 | 60 |
| 10 | `src/domain/worldPulse/habitForkRegistry.js` | 68 | 0 | 0 | 68 | 0 | 0 |
| 11 | `src/lib/instantWorld/factionDedup.js` | 65 | 65 | 0 | 0 | 0 | 0 |
| 12 | `src/domain/display/warAndRoadNames.js` | 64 | 64 | 0 | 0 | 0 | 0 |
| 13 | `src/domain/worldPulse/stressorDynamics.js` | 57 | 0 | 35 | 22 | 0 | 0 |
| 14 | `src/domain/autonomy/index.js` | 48 | 0 | 0 | 1 | 47 | 0 |
| 15 | `src/components/organic/samples/fixtures.js` | 47 | 47 | 0 | 0 | 0 | 0 |
| 16 | `src/domain/factionRename.js` | 47 | 0 | 0 | 47 | 0 | 0 |
| 17 | `src/data/goods/identity.js` | 46 | 6 | 0 | 0 | 0 | 40 |
| 18 | `src/domain/display/stateProse/defenseStateProse.js` | 37 | 5 | 0 | 32 | 0 | 0 |
| 19 | `src/domain/worldPulse/index.js` | 37 | 0 | 0 | 37 | 0 | 0 |
| 20 | `src/lib/flags.js` | 31 | 0 | 0 | 31 | 0 | 0 |
| 21 | `src/components/compendium/customContentEditorCopy.js` | 28 | 28 | 0 | 0 | 0 | 0 |
| 22 | `src/domain/npc/characterReadModel.js` | 27 | 0 | 0 | 5 | 0 | 22 |
| 23 | `src/domain/worldPulse/demographicsRates.js` | 26 | 0 | 0 | 26 | 0 | 0 |
| 24 | `src/domain/display/engagementNarrative.js` | 25 | 0 | 0 | 0 | 0 | 25 |
| 25 | `src/domain/worldPulse/envoyChanceMeetingNews.js` | 23 | 18 | 0 | 5 | 0 | 0 |
| 26 | `src/domain/customContentSchema.js` | 22 | 18 | 0 | 4 | 0 | 0 |
| 27 | `src/domain/stressorPicker.js` | 22 | 22 | 0 | 0 | 0 | 0 |
| 28 | `src/domain/supplyChainState.js` | 22 | 22 | 0 | 0 | 0 | 0 |
| 29 | `src/domain/tuning/proposedSoakBands.js` | 22 | 0 | 0 | 22 | 0 | 0 |
| 30 | `src/domain/content/contentVocabulary.js` | 21 | 0 | 0 | 21 | 0 | 0 |
| 31 | `src/design/organic/index.js` | 17 | 0 | 0 | 17 | 0 | 0 |
| 32 | `src/domain/worldPulse/espionage/infiltrationDepth.js` | 16 | 0 | 0 | 14 | 0 | 2 |
| 33 | `src/lib/galleryHubs.js` | 16 | 16 | 0 | 0 | 0 | 0 |
| 34 | `src/lib/seo.js` | 16 | 16 | 0 | 0 | 0 | 0 |
| 35 | `src/components/compendium/customCategories.js` | 15 | 15 | 0 | 0 | 0 | 0 |
| 36 | `src/domain/worldPulse/envoyTaskCatalog.js` | 15 | 0 | 0 | 15 | 0 | 0 |
| 37 | `src/domain/display/deityEffects.js` | 14 | 14 | 0 | 0 | 0 | 0 |
| 38 | `src/domain/worldPulse/faithTuningSurface.js` | 14 | 0 | 0 | 14 | 0 | 0 |
| 39 | `src/data/roadmapLedger.js` | 13 | 13 | 0 | 0 | 0 | 0 |
| 40 | `src/domain/display/armyStrength.js` | 13 | 13 | 0 | 0 | 0 | 0 |
| 41 | `src/domain/dossier/powerSupport.js` | 13 | 13 | 0 | 0 | 0 | 0 |
| 42 | `src/domain/worldPulse/espionage/infiltrationDrift.js` | 13 | 0 | 0 | 13 | 0 | 0 |
| 43 | `src/domain/worldPulse/npcVerdictApply.js` | 13 | 5 | 0 | 8 | 0 | 0 |
| 44 | `src/components/generate/characterPresets.js` | 12 | 12 | 0 | 0 | 0 | 0 |
| 45 | `src/domain/aiGrounding.js` | 12 | 0 | 0 | 0 | 12 | 0 |
| 46 | `src/domain/region/goodsCatalog.js` | 12 | 12 | 0 | 0 | 0 | 0 |
| 47 | `src/domain/townMap/arch/cathedralSection.js` | 12 | 0 | 0 | 12 | 0 | 0 |
| 48 | `src/components/map/WorldMapTourSteps.js` | 11 | 11 | 0 | 0 | 0 | 0 |
| 49 | `src/data/institutionServiceKeys.generated.js` | 11 | 11 | 0 | 0 | 0 | 0 |
| 50 | `src/domain/display/warRemembrance.js` | 11 | 11 | 0 | 0 | 0 | 0 |
| 51 | `src/components/home/landingFixture.js` | 10 | 10 | 0 | 0 | 0 | 0 |
| 52 | `src/data/securityQuestions.js` | 10 | 10 | 0 | 0 | 0 | 0 |
| 53 | `src/domain/display/mobilizationStatus.js` | 10 | 10 | 0 | 0 | 0 | 0 |
| 54 | `src/domain/display/neighbourMirror.js` | 10 | 10 | 0 | 0 | 0 | 0 |
| 55 | `src/domain/worldPulse/envoyChanceMeeting.js` | 10 | 0 | 0 | 10 | 0 | 0 |
| 56 | `src/domain/worldPulse/factionCompetition.js` | 10 | 10 | 0 | 0 | 0 | 0 |
| 57 | `src/domain/display/labelBands.js` | 9 | 9 | 0 | 0 | 0 | 0 |
| 58 | `src/domain/fieldManifest.js` | 9 | 0 | 0 | 9 | 0 | 0 |
| 59 | `src/domain/worldPulse/deityFlaws.js` | 9 | 0 | 0 | 9 | 0 | 0 |
| 60 | `src/domain/worldPulse/espionage/operationsVoice.js` | 9 | 0 | 0 | 9 | 0 | 0 |
| 61 | `src/domain/worldPulse/informationNews.js` | 9 | 9 | 0 | 0 | 0 | 0 |
| 62 | `src/domain/worldPulse/npcCirculation.js` | 9 | 9 | 0 | 0 | 0 | 0 |
| 63 | `src/domain/worldPulse/pulseStageManifest.js` | 9 | 0 | 0 | 9 | 0 | 0 |
| 64 | `src/domain/instantWorld/worldPlan.js` | 8 | 8 | 0 | 0 | 0 | 0 |
| 65 | `src/components/generate/nextSteps.js` | 7 | 7 | 0 | 0 | 0 | 0 |
| 66 | `src/components/settlement/eventComposer/EventComposerConstants.js` | 7 | 0 | 0 | 7 | 0 | 0 |
| 67 | `src/data/namingData.js` | 7 | 7 | 0 | 0 | 0 | 0 |
| 68 | `src/domain/worldPulse/convergence.js` | 7 | 7 | 0 | 0 | 0 | 0 |
| 69 | `src/domain/worldPulse/razing.js` | 7 | 7 | 0 | 0 | 0 | 0 |
| 70 | `src/lib/instantWorld/composerPipeline.js` | 7 | 0 | 0 | 7 | 0 | 0 |
| 71 | `src/lib/spatialUsage.js` | 7 | 0 | 0 | 7 | 0 | 0 |
| 72 | `src/domain/display/occupationStatus.js` | 6 | 6 | 0 | 0 | 0 | 0 |
| 73 | `src/domain/npc/characterConsumers.js` | 6 | 1 | 0 | 5 | 0 | 0 |
| 74 | `src/domain/npc/characterDrift.js` | 6 | 0 | 0 | 6 | 0 | 0 |
| 75 | `src/domain/realm/realmItemAttention.js` | 6 | 6 | 0 | 0 | 0 | 0 |
| 76 | `src/domain/summary/settlementQuickGuide.js` | 6 | 6 | 0 | 0 | 0 | 0 |
| 77 | `src/domain/worldPulse/faithNews.js` | 6 | 6 | 0 | 0 | 0 | 0 |
| 78 | `src/domain/worldPulse/foundingCatalog.js` | 6 | 6 | 0 | 0 | 0 | 0 |
| 79 | `src/lib/supplyChains.js` | 6 | 6 | 0 | 0 | 0 | 0 |
| 80 | `src/application/commands/adapters/customContentApply.js` | 5 | 0 | 0 | 5 | 0 | 0 |
| 81 | `src/components/settlements/useCampaignAdvance.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 82 | `src/domain/content/customSupplyChainPresentation.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 83 | `src/domain/display/dossierViewModel.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 84 | `src/domain/display/parityContract.js` | 5 | 0 | 0 | 5 | 0 | 0 |
| 85 | `src/domain/npc/knownCharacter.js` | 5 | 0 | 0 | 5 | 0 | 0 |
| 86 | `src/domain/npc/npcFacets.js` | 5 | 0 | 0 | 5 | 0 | 0 |
| 87 | `src/domain/resourceTerrainCompatibility.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 88 | `src/domain/worldPulse/causeVocabulary.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 89 | `src/domain/worldPulse/conquestFeasibility.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 90 | `src/domain/worldPulse/institutionStatusModel.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 91 | `src/domain/worldPulse/operations/operationGrammar.js` | 5 | 0 | 0 | 5 | 0 | 0 |
| 92 | `src/domain/worldPulse/pactTriggers.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 93 | `src/domain/worldPulse/peaceReasons.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 94 | `src/domain/worldPulse/simulationProfile.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 95 | `src/domain/worldPulse/temperamentPresets.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 96 | `src/domain/worldPulse/warReasons.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 97 | `src/pdf/variants.js` | 5 | 5 | 0 | 0 | 0 | 0 |
| 98 | `src/components/dossier/proseFieldLabels.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 99 | `src/components/settlement/faithPanelModel.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 100 | `src/design/boundBook.js` | 4 | 0 | 0 | 4 | 0 | 0 |
| 101 | `src/domain/ai/suggestedQuestions.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 102 | `src/domain/density/densityCreateBoundary.js` | 4 | 0 | 0 | 4 | 0 | 0 |
| 103 | `src/domain/display/visibilityAudit.js` | 4 | 0 | 0 | 4 | 0 | 0 |
| 104 | `src/domain/instantWorld/genesisDiplomacy.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 105 | `src/domain/npc/characterEdit.js` | 4 | 0 | 0 | 4 | 0 | 0 |
| 106 | `src/domain/relationships/canonicalRelationship.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 107 | `src/domain/state/bands.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 108 | `src/domain/state/compareSystemState.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 109 | `src/domain/worldPulse/brokerageServicesRules.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 110 | `src/domain/worldPulse/demographicsPushPull.js` | 4 | 0 | 0 | 4 | 0 | 0 |
| 111 | `src/domain/worldPulse/magicRegimeModel.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 112 | `src/domain/worldPulse/pactFormation.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 113 | `src/domain/worldPulse/razingExecution.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 114 | `src/domain/worldPulse/routeNetworkCharterEvents.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 115 | `src/domain/worldPulse/routeNetworkDecay.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 116 | `src/domain/worldPulse/supplyWebWarfare.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 117 | `src/domain/worldPulse/warCoalitionRefusal.js` | 4 | 4 | 0 | 0 | 0 | 0 |
| 118 | `src/components/new/economyDeskRead.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 119 | `src/data/sampleSettlements.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 120 | `src/domain/autonomy/accelerationOps.js` | 3 | 1 | 0 | 2 | 0 | 0 |
| 121 | `src/domain/display/forceComposition.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 122 | `src/domain/display/hegemonyRead.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 123 | `src/domain/display/stateProse/economyStateProse.js` | 3 | 2 | 0 | 1 | 0 | 0 |
| 124 | `src/domain/display/stateProse/generalStateProse.js` | 3 | 0 | 0 | 3 | 0 | 0 |
| 125 | `src/domain/generationContentProfile.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 126 | `src/domain/historyBeats.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 127 | `src/domain/npc/acceptanceCharacterReads.js` | 3 | 0 | 0 | 3 | 0 | 0 |
| 128 | `src/domain/npc/livedExperienceCatalog.js` | 3 | 0 | 0 | 2 | 0 | 1 |
| 129 | `src/domain/npc/livedExperienceFunnel.js` | 3 | 0 | 0 | 3 | 0 | 0 |
| 130 | `src/domain/npc/livedExperienceSources.js` | 3 | 0 | 0 | 3 | 0 | 0 |
| 131 | `src/domain/npc/paradigmAxisCatalog.js` | 3 | 0 | 0 | 3 | 0 | 0 |
| 132 | `src/domain/regenerationMode.js` | 3 | 0 | 0 | 0 | 0 | 3 |
| 133 | `src/domain/simulationSpine.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 134 | `src/domain/spatial/cohesionWeave.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 135 | `src/domain/traditions/politics.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 136 | `src/domain/tuning/autoTunableRegistry.js` | 3 | 0 | 0 | 3 | 0 | 0 |
| 137 | `src/domain/worldPulse/brokerageServices.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 138 | `src/domain/worldPulse/calamityKernel.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 139 | `src/domain/worldPulse/espionage/espionageTap.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 140 | `src/domain/worldPulse/feasibilityGate.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 141 | `src/domain/worldPulse/magicBufferModel.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 142 | `src/domain/worldPulse/npcDmVerbRecords.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 143 | `src/domain/worldPulse/pulseKernel.js` | 3 | 0 | 0 | 3 | 0 | 0 |
| 144 | `src/domain/worldPulse/reinforcement.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 145 | `src/domain/worldPulse/sovereigntyIntent.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 146 | `src/lib/aboutMapping.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 147 | `src/lib/importReconciliation.js` | 3 | 2 | 0 | 1 | 0 | 0 |
| 148 | `src/store/aiRequestLifecycle.js` | 3 | 3 | 0 | 0 | 0 | 0 |
| 149 | `src/application/commands/adapters/importReconciliationApply.js` | 2 | 0 | 0 | 2 | 0 | 0 |
| 150 | `src/components/gallery/galleryMapsUtils.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 151 | `src/components/map/heraldCommandSourceParity.js` | 2 | 0 | 0 | 2 | 0 | 0 |
| 152 | `src/components/map/heraldRegister.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 153 | `src/data/galleryReactionVocab.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 154 | `src/domain/content/customContentVersioning.js` | 2 | 0 | 0 | 2 | 0 | 0 |
| 155 | `src/domain/display/economyFreshness.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 156 | `src/domain/display/humanizeEngineTokens.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 157 | `src/domain/display/stateProse/powerStateProse.js` | 2 | 0 | 0 | 2 | 0 | 0 |
| 158 | `src/domain/display/tradePressure.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 159 | `src/domain/region/wizardNews.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 160 | `src/domain/regionalGraph.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 161 | `src/domain/spatial/generosityEV.js` | 2 | 1 | 0 | 1 | 0 | 0 |
| 162 | `src/domain/townMap/asymmetrySources.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 163 | `src/domain/worldPulse/applyWorldPulseOccupationAuthority.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 164 | `src/domain/worldPulse/applyWorldPulseRelationshipGraph.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 165 | `src/domain/worldPulse/conquestExecution.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 166 | `src/domain/worldPulse/deityStanceLane.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 167 | `src/domain/worldPulse/envoyChanceMeetingStage.js` | 2 | 0 | 0 | 2 | 0 | 0 |
| 168 | `src/domain/worldPulse/espionage/espionageDoctrine.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 169 | `src/domain/worldPulse/npcGoalBranches.js` | 2 | 0 | 0 | 2 | 0 | 0 |
| 170 | `src/domain/worldPulse/routeNetworkConsumersInterdiction.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 171 | `src/domain/worldPulse/settlementLifecycleKernel.js` | 2 | 1 | 0 | 1 | 0 | 0 |
| 172 | `src/store/settlementDeityHelpers.js` | 2 | 2 | 0 | 0 | 0 | 0 |
| 173 | `src/application/commands/adapters/partyImpactRecord.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 174 | `src/application/commands/adapters/pendingEditCommit.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 175 | `src/application/commands/commandEnvelope.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 176 | `src/components/founders/hallRegister.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 177 | `src/components/map/gatheredDocket.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 178 | `src/components/map/lifecycleGlyphStyle.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 179 | `src/components/new/tabConstants.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 180 | `src/components/theme.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 181 | `src/config/entitlementLadder.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 182 | `src/design/tokens.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 183 | `src/domain/briefs/citations.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 184 | `src/domain/content/contentEffectProjection.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 185 | `src/domain/customContent.js` | 1 | 0 | 0 | 0 | 0 | 1 |
| 186 | `src/domain/display/discourseKernel.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 187 | `src/domain/display/stateProse/stressorsStateProse.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 188 | `src/domain/npc/npcBank.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 189 | `src/domain/roads/migrationReason.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 190 | `src/domain/roads/ops.js` | 1 | 0 | 0 | 0 | 0 | 1 |
| 191 | `src/domain/rulingPowerCoup.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 192 | `src/domain/spatial/calamity.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 193 | `src/domain/spatial/dispatchEV.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 194 | `src/domain/spatial/index.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 195 | `src/domain/spatial/supplyShipments.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 196 | `src/domain/state/deriveSystemState.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 197 | `src/domain/tableEvents.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 198 | `src/domain/tableLedger.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 199 | `src/domain/threatProfile.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 200 | `src/domain/townMap/siteGenesis.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 201 | `src/domain/townScene/index.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 202 | `src/domain/traditions/genesis.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 203 | `src/domain/traditions/prose.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 204 | `src/domain/worldPulse/attrition.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 205 | `src/domain/worldPulse/brokerageServicesPlant.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 206 | `src/domain/worldPulse/conquestIntent.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 207 | `src/domain/worldPulse/demographicsLand.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 208 | `src/domain/worldPulse/demographicsPlans.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 209 | `src/domain/worldPulse/demographicsResponses.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 210 | `src/domain/worldPulse/demographicsRisk.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 211 | `src/domain/worldPulse/demographicsWar.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 212 | `src/domain/worldPulse/dispositionProfile.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 213 | `src/domain/worldPulse/espionage/espionageGauntlet.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 214 | `src/domain/worldPulse/espionage/espionageProductStage.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 215 | `src/domain/worldPulse/faithField.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 216 | `src/domain/worldPulse/ledgerOwnershipManifest.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 217 | `src/domain/worldPulse/lineageClaim.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 218 | `src/domain/worldPulse/magicFormsPractitioner.js` | 1 | 0 | 0 | 0 | 0 | 1 |
| 219 | `src/domain/worldPulse/magicSubstitution.js` | 1 | 0 | 0 | 0 | 0 | 1 |
| 220 | `src/domain/worldPulse/opportunism.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 221 | `src/domain/worldPulse/pactProposals.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 222 | `src/domain/worldPulse/peaceTermsDrafting.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 223 | `src/domain/worldPulse/relationshipCompatibility.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 224 | `src/domain/worldPulse/settlementLifecycleFirstClass.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 225 | `src/domain/worldPulse/sovereigntyAppraisal.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 226 | `src/domain/worldPulse/sovereigntyAssets.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 227 | `src/domain/worldPulse/sovereigntyBundle.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 228 | `src/domain/worldPulse/sovereigntyReach.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 229 | `src/domain/worldPulse/stressorGates.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 230 | `src/domain/worldPulse/successorNpc.js` | 1 | 0 | 1 | 0 | 0 | 0 |
| 231 | `src/lib/accountSettlementContentPortability.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 232 | `src/lib/customContentArchive.js` | 1 | 0 | 0 | 1 | 0 | 0 |
| 233 | `src/lib/seoCompendium.js` | 1 | 1 | 0 | 0 | 0 | 0 |
| 234 | `src/pdf/lib/headlines.js` | 1 | 1 | 0 | 0 | 0 | 0 |
---

## Examples per file, per class (with the consumer site and its evidence grade)

- `src/data/tradeGoodsData.js` (n=934)
  - **reader** (934) — "Settles quarrels between households by custom" · "Calls and chairs the gathering of families" · "Keeps the memory of boundaries, debts, and old agreements"
    · consumer: `src/components/ServicesTogglePanel.jsx:58` (render-site-read)
- `src/store/selectors.js` (n=274)
  - **reader** (274) — "A free hamlet with no lord's representative. Communal elder consensus go" · "All family heads hold equal voice on shared concerns. Slower but more eg" · "A steward appointed by a distant lord to oversee the settlement. Authori"
    · consumer: `src/components/InstitutionalGrid.jsx:143` (render-site-read)
- `src/domain/cultureProfiles.js` (n=207)
  - **reader** (207) — "A timber-and-stone, guild-and-estate design grammar." · "Timber-framed street houses cluster around a market green, with stone re" · "Farmsteads and craft yards form compact wards around a hall, church, or "
    · consumer: `src/pdf/sections/IdentityDailyLife.jsx:278` (render-site-read)
- `src/domain/compendium/searchIndex.js` (n=199)
  - **reader** (99) — "Magic as Economic Buffer" · "Magic & Faith Unified" · "Doctrine — supply-web warfare"
    · consumer: `src/components/compendium/CompendiumGlobalSearch.jsx:179` (render-site-read)
  - **dev** (100) — "smallest single institution subsistence 8-60" · "local subsistence minimal trade 61-400" · "surplus weekly market guilds begin 401-900"
    · consumer: `src/domain/compendium/searchIndex.js:264` (render-site-read)
- `src/data/stressInstitutionEffects.js` (n=189)
  - **dm-only** (189) — "Secretly negotiating surrender terms with the besieging force, without t" · "Treason. The garrison would execute them on the spot if they found out" · "Has been rationing their own private food stores while publicly enforcin"
    · consumer: `src/generators/npcGenerator.js:779 -> src/components/new/npcComponents.jsx:458` (render-site-read)
- `src/domain/worldPulse/commercialReasonsNews.js` (n=151)
  - **reader** (151) — "{counterpart} took the wagons and sent nothing back; the compact is brok" · "The wharf at {settlement} waited for a cargo that never came, and stoppe" · "The factors' book at {settlement} carries {counterpart} in the column of"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/data/goods/chains.js` (n=115)
  - **reader** (115) — "Fresh eggs from household chickens" · "Rabbits, fowl from local hunting" · "Wheat, barley, oats beyond subsistence needs"
    · consumer: `src/components/TradeDynamicsPanel.jsx:67` (render-site-read)
- `src/domain/worldPulse/grammarNews.js` (n=86)
  - **reader** (86) — "The peace of {settlement} and {counterpart} has run its course: {band} y" · "The {term} {settlement} and {counterpart} kept between them came to its " · "In {settlement} the market kept its hours as always; the pact with {coun"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/data/economicData.js` (n=84)
  - **reader** (22) — "Replacement arms and basic equipment" · "Quality weapons and armour" · "Advanced weapons and armour (bulk contract)"
    · consumer: `src/components/new/SupplyChainsPanel.jsx` (family-inference)
  - **dev** (2) — "Quality tools and weapons" · "Alchemical trade (potions, reagents)"
    · consumer: `(declaration)` (declaration)
  - **ambiguous** (60) — "grain and mill sites for water-powered milling" · "grain reserves for storage" · "grain reserves at scale"
    · consumer: `src/generators/economy/economicState.js:716` (untraced)
- `src/domain/worldPulse/habitForkRegistry.js` (n=68)
  - **dev** (68) — "identify what a migration draw is graded against — arrival versus attrit" · "a keyed race inside the migration advance; the acting settlement and the" · "identify the graded outcome of a demographic plan, and whether the fork "
    · consumer: `tests/lint/chooserTotality.walker.test.js:53` (render-site-read)
- `src/lib/instantWorld/factionDedup.js` (n=65)
  - **reader** (65) — "The Guild of Artificers" · "The Greater Independent Bloc" · "The Greater Free Alliance"
    · consumer: `src/components/WorldPage.jsx` (family-inference)
- `src/domain/display/warAndRoadNames.js` (n=64)
  - **reader** (64) — "the carters' road to {dest}" · "the road between {a} and {b}" · "the water road to {dest}"
    · consumer: `src/domain/display/warAndRoadNames.js:275 -> src/components/new/tabs/WarTab.jsx` (render-site-read)
- `src/domain/worldPulse/stressorDynamics.js` (n=57)
  - **dm-only** (35) — "A courier carries coin that traces back across the border." · "Exposing the sponsor would be a casus belli, if anyone dares name them a" · "Someone local is living slightly too well for their station."
    · consumer: `src/domain/worldPulse/stressorDynamics.js:738` (render-site-read)
  - **dev** (22) — "the sick cannot work the fields" · "the blockade stands. No relief can arrive" · "the wider war keeps the besiegers supplied"
    · consumer: `src/domain/worldPulse/stressorDynamics.js:548` (render-site-read)
- `src/domain/autonomy/index.js` (n=48)
  - **dev** (1) — "a StopCondition carries version: 1"
    · consumer: `(validator)` (declaration)
  - **ai-prompt** (47) — "The food security causal score (0–100)." · "The food security causal band (surplus/adequate/strained/critical/collap" · "The labor capacity causal score (0–100)."
    · consumer: `src/domain/aiCharter.js:278` (render-site-read)
- `src/components/organic/samples/fixtures.js` (n=47)
  - **reader** (47) — "The twelve deities of the core pantheon, as a surveyor records them: the" · "The sea, safe harbour, and the toll of drowning" · "Smithing, honest weights, and the guild oath"
    · consumer: `src/components/organic/samples/DossierSample.jsx` (render-site-read)
- `src/domain/factionRename.js` (n=47)
  - **dev** (47) — "the canonical display name" · "the legacy alias every tolerant reader falls back to" · "the exact name of the faction holding the governing seat"
    · consumer: `(declaration site)` (declaration)
- `src/data/goods/identity.js` (n=46)
  - **reader** (6) — "Hot Springs / Healing Waters" · "Remnants of a previous civilization" · "Intersection of magical energy"
    · consumer: `src/generators/computeActiveChains.js:235` (render-site-read)
  - **ambiguous** (40) — "Deep-water or reef fishing close to shore; reliable fish and seafood sup" · "Fishing grounds require water access." · "Coastal evaporation pans or inland salt deposits; the settlement produce"
    · consumer: `src/generators/computeActiveChains.js:235` (untraced)
- `src/domain/display/stateProse/defenseStateProse.js` (n=37)
  - **reader** (5) — "The town would defend itself as a crowd defends itself, which is to say " · "The town has no answer to anything it cannot see, and is unprepared rath" · "The town's plan for an army is to not be interesting to one, and everybo"
    · consumer: `src/components/new/tabs/DefenseTab.jsx` (family-inference)
  - **dev** (32) — "badge STRONG (any arm)" · "badge ADEQUATE (any arm)" · "badge WEAK (any arm)"
    · consumer: `src/domain/display/stateProse/dossierMounts.js` (declaration)
- `src/domain/worldPulse/index.js` (n=37)
  - **dev** (37) — "A besieging force is an independent war-arc birth." · "Wartime pressure spawns a spontaneous war arc." · "A disease outbreak is the plague class."
    · consumer: `(test/scripts barrel)` (reachability)
- `src/lib/flags.js` (n=31)
  - **dev** (31) — "Discord OAuth sign-in button. Safe flag-on: an unconfigured provider deg" · "Google OAuth sign-in button. Safe flag-on: an unconfigured provider degr" · "P102 / D-1: consolidate 14 dossier tabs into 5 thematic groups. PROMOTED"
    · consumer: `src/components/dev/DevFlagPanel.jsx` (render-site-read)
- `src/components/compendium/customContentEditorCopy.js` (n=28)
  - **reader** (28) — "Which part of settlement life this belongs to and where it appears in th" · "Describes the kind of power associated with this content. It is currentl" · "Describes a defensive role for presentation and future registered operat"
    · consumer: `src/components/compendium/CustomContentEditor.jsx:43` (render-site-read)
- `src/domain/npc/characterReadModel.js` (n=27)
  - **dev** (5) — "CANDIDATE, OWNER-UNSIGNED (two vocabularies and four frames; nothing her" · "THE THIRTY REASON CLAUSES: one per teaching kind. They are the reader-fa" · "THE THREE LEVEL PHRASES (a little / notably / above all): the only adver"
    · consumer: `(declaration site)` (declaration)
  - **ambiguous** (22) — "the slow work of years" · "a captivity nobody paid to end" · "a death close to home"
    · consumer: `(no product surface)` (reachability)
- `src/domain/worldPulse/demographicsRates.js` (n=26)
  - **dev** (26) — "What the ground does to the density ceiling, per terrain." · "The unsuppressed birth rate per tick, per tier." · "The natural mortality floor per tick, per tier. It exists at zero pressu"
    · consumer: `(declaration site)` (declaration)
- `src/domain/display/engagementNarrative.js` (n=25)
  - **ambiguous** (25) — "the lines close around the walls" · "the fields outside are eaten bare" · "the gate gives, and the town changes hands"
    · consumer: `src/domain/display/engagementNarrative.js:341` (render-site-read)
- `src/domain/worldPulse/envoyChanceMeetingNews.js` (n=23)
  - **reader** (18) — "a refusal that did not stay private." · "{npc} of {home}, passing through {settlement}, {outcome_phrase} in {coun" · "Word from {settlement}: {npc} and {counterpart} {outcome_phrase}, and ne"
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
  - **dev** (5) — "CANDIDATE, OWNER-UNSIGNED (ROAD B; enrolled in the tuning register at th" · "the recorded meeting's Herald severity, the notable band's own weight" · "the recorded meeting's Herald score, an integer the feed sorts by"
    · consumer: `(declaration site)` (declaration)
- `src/domain/customContentSchema.js` (n=22)
  - **reader** (18) — "Critical — food, water, timber" · "Discretionary — luxury / comfort" · "Does not contribute to defense"
    · consumer: `src/components/compendium/CustomContentEditor.jsx` (family-inference)
  - **dev** (4) — "Lawful — upholds order and oaths" · "Chaotic — erodes order, tolerates corruption" · "portfolio must be free text (a string)."
    · consumer: `(declaration site)` (declaration)
- `src/domain/stressorPicker.js` (n=22)
  - **reader** (22) — "Beast & Raider Threat" · "The attacks are following a pattern that suggests coordination, not desp" · "Campaign crisis: pressures public legitimacy, faction stability, social "
    · consumer: `src/components/settlement/eventComposer/EventComposerTargetField.jsx:70` (family-trace)
- `src/domain/supplyChainState.js` (n=22)
  - **reader** (22) — "bread prices climb; relief queues lengthen; legitimacy strains." · "miners and quarry workers" · "raw inputs run short; downstream chains feel the squeeze first."
    · consumer: `src/domain/summary/tonightAtTheTable.js:155` (render-site-read)
- `src/domain/tuning/proposedSoakBands.js` (n=22)
  - **dev** (22) — "Court successions per faction, per sim-decade" · "successions per faction per decade" · "The cadence dial targets 'a succession per faction every few sim-years, "
    · consumer: `scripts/check-tuning-bands.mjs` (render-site-read)
- `src/domain/content/contentVocabulary.js` (n=21)
  - **dev** (21) — "The icon-free, category-aware authority for custom-content authoring, co" · "When a settlement is generated." · "Only while the institution is present in a settlement."
    · consumer: `(declaration site)` (declaration)
- `src/design/organic/index.js` (n=17)
  - **dev** (17) — "paper tooth — an alpha overlay on grounds, never under body text at more" · "plate edge weighting — the pressed line breathes; frames read printed, n" · "cubic-bezier(0.33, 0, 0.2, 1)"
    · consumer: `src/design/organic/motion.js` (render-site-read)
- `src/domain/worldPulse/espionage/infiltrationDepth.js` (n=16)
  - **dev** (14) — "one live asset per (patron, target) pair. The web enforces it as a candi" · "the realm-wide per-patron live-asset cap, verbatim: F8's named clause" · "the rising-upkeep affordability floor, verbatim: F8's named degradation"
    · consumer: `(declaration site)` (declaration)
  - **ambiguous** (2) — "a persisted cover schema, owner-admitted" · "an undo/restore round-trip for the new key space"
    · consumer: `(no product surface)` (reachability)
- `src/lib/galleryHubs.js` (n=16)
  - **reader** (16) — "Public D&D settlements raised on plains terrain: browse, react, and impo" · "Public D&D settlements raised on hills terrain: browse, react, and impor" · "Public D&D settlements raised on forest terrain: browse, react, and impo"
    · consumer: `src/components/gallery/GalleryHubPage.jsx` (render-site-read)
- `src/lib/seo.js` (n=16)
  - **reader** (16) — "SettlementForge generates living tabletop-RPG settlements with economies" · "SettlementForge: living settlements for game masters" · "Generate a living tabletop-RPG settlement in seconds: economy, factions,"
    · consumer: `src/lib/seo.js:242` (render-site-read)
- `src/components/compendium/customCategories.js` (n=15)
  - **reader** (15) — "Institutions, services, resources, trade goods, and the supply chains th" · "Deities, traditions, and factions. Deities gain mechanics after assignme" · "Trade goods or services this institution generates when present."
    · consumer: `src/components/compendium/CustomContent.jsx` (family-inference)
- `src/domain/worldPulse/envoyTaskCatalog.js` (n=15)
  - **dev** (15) — "the menu reads what the ENVOY'S COURT KNOWS, never the true chart and ne" · "WR-7d mints a real claim against a real custody hold, and the hold close" · "the four admitted rows are receipt-verified, not taste, but WHICH of the"
    · consumer: `(declaration site)` (declaration)
- `src/domain/display/deityEffects.js` (n=14)
  - **reader** (14) — "Evil-aligned worship lets corruption take root even without organized cr" · "Good-aligned worship exposes corruption and favors incorruptible success" · "A warlike creed raises the realm's aggression"
    · consumer: `scripts/generate-compendium-data.mjs -> src/components/compendium/CatalogTabs.jsx` (family-trace)
- `src/domain/worldPulse/faithTuningSurface.js` (n=14)
  - **dev** (14) — "How much louder the patron is than a co-resident cult." · "The kernel reading of the three authored strength bands." · "The channel backstop; the reachable band uses 63 percent of it (pack row"
    · consumer: `(declaration site)` (declaration)
- `src/data/roadmapLedger.js` (n=13)
  - **reader** (13) — "Same seed, same world, forever" · "A world is stable and reproducible. The same seed always builds the same" · "A settlement that explains itself"
    · consumer: `src/components/howto/RoadmapPage.jsx` (render-site-read)
- `src/domain/display/armyStrength.js` (n=13)
  - **reader** (13) — "a formidable host, few in the region could match it in the field" · "a strong army, ready to take the field with confidence" · "a capable militia, enough to defend its own and raid a neighbour"
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx:219` (render-site-read)
- `src/domain/dossier/powerSupport.js` (n=13)
  - **reader** (13) — "Raised by this power" · "A commercial house of this power" · "An armed body under this command"
    · consumer: `src/components/new/tabs/power/PowerStrata.jsx` (family-inference)
- `src/domain/worldPulse/espionage/infiltrationDrift.js` (n=13)
  - **dev** (13) — "depth prices BREADTH (how many of the host chart's axes an embedding exp" · "the registers pack drafts the five depth words as a MILIEU MULTIPLIER; a" · "CANDIDATE, OWNER-UNSIGNED (breadth is derived from the rung index; no ra"
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/npcVerdictApply.js` (n=13)
  - **reader** (5) — "{npcName} is imprisoned in {settlementName}." · "The office is forfeit and the seat at {factionName} stands open." · "The corruption was proven and the office was forfeit."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
  - **dev** (8) — "the influence stock itself; a jailed or roaming person contributes none" · "the numeric power score the faction and ladder reads consume" · "the propagation weight a named figure carries into other reads"
    · consumer: `(declaration site)` (declaration)
- `src/components/generate/characterPresets.js` (n=12)
  - **reader** (12) — "Trade hub; guild security" · "Major overland hub; active guilds" · "Resource extraction; high military"
    · consumer: `src/components/generate/CharacterPresetCard.jsx:202` (render-site-read)
- `src/domain/aiGrounding.js` (n=12)
  - **ai-prompt** (12) — "You are a structural narrator. The dossier below is a single source of t" · "Voice: confident, unhurried. Specific over generic. Tie every descriptiv" · "Output MUST preserve every proper noun from the dossier and every numeri"
    · consumer: `src/store/settlementSlice.js` (render-site-read)
- `src/domain/region/goodsCatalog.js` (n=12)
  - **reader** (12) — "bulk grain and foodstuffs" · "raw hides and animal products" · "cut stone and masonry"
    · consumer: `src/components/new/SupplyChainsPanel.jsx` (family-inference)
- `src/domain/townMap/arch/cathedralSection.js` (n=12)
  - **dev** (12) — "pierced nave wall (thickness + reveals)" · "pointed archivolt (voussoir ring)" · "central mullion + jamb shafts"
    · consumer: `scripts/generate-k0b.mjs` (render-site-read)
- `src/components/map/WorldMapTourSteps.js` (n=11)
  - **reader** (11) — "Switch between View, Terrain, Annotate, and Routes. Each mode swaps the " · "Place & select settlements" · "Drag a saved canon settlement from the palette onto the map to place it,"
    · consumer: `src/components/map/WorldMapOverlays.jsx` (family-inference)
- `src/data/institutionServiceKeys.generated.js` (n=11)
  - **reader** (11) — "Airship docking (high magic)" · "Aqueduct or water system" · "Bowyers & fletchers (guild)"
    · consumer: `src/App.jsx` (family-inference)
- `src/domain/display/warRemembrance.js` (n=11)
  - **reader** (11) — "It ended in a sack, taken as the answer to a burning of its own." · "It ended in a sack, and that burning was the opening of the reckoning, n" · "It ended in conquest: {victor} held what it had taken."
    · consumer: `src/components/map/HeraldRemembrance.jsx` (family-inference)
- `src/components/home/landingFixture.js` (n=10)
  - **reader** (10) — "The road into Cnocby becomes a street at a point you can't precisely ide" · "Rónnat Sullivan is about to call it in." · "A neutral figure is being pressured by both The Free Alliance and The Es"
    · consumer: `src/components/home/LandingArtifacts.jsx:231` (render-site-read)
- `src/data/securityQuestions.js` (n=10)
  - **reader** (10) — "What was the name of the first street you lived on?" · "What was the first name of your oldest childhood friend?" · "What was the name of your first pet?"
    · consumer: `src/components/auth/SecurityQuestionsFields.jsx` (render-site-read)
- `src/domain/display/mobilizationStatus.js` (n=10)
  - **reader** (10) — "gearing for war, the economy shifting to a war footing" · "fully mobilized, a war economy ready to march" · "war-weary, its army spent"
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (family-inference)
- `src/domain/display/neighbourMirror.js` (n=10)
  - **reader** (10) — "nothing we can account for" · "an errand of ours they took off the road" · "a story we seeded in their court"
    · consumer: `src/components/new/tabs/RelationshipsTab.jsx` (family-inference)
- `src/domain/worldPulse/envoyChanceMeeting.js` (n=10)
  - **dev** (10) — "CANDIDATE, OWNER-UNSIGNED (§12 row 7; enrolled in TUNEREG at its landing" · "the three base rungs 3 / 4 / 2 and the plus-or-minus-one modifiers" · "the approach die: base 2, plus 2 at an at-odds target, plus 1 covert"
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/factionCompetition.js` (n=10)
  - **reader** (10) — "press a challenge to the government" · "presses a challenge to the government" · "move to suppress an institution"
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/display/labelBands.js` (n=9)
  - **reader** (9) — "Highly diversified — multiple major revenue streams" · "Diversified — broad institutional economic base" · "Concentrated — fewer revenue streams than scale suggests"
    · consumer: `src/components/new/SummaryTab.jsx` (family-inference)
- `src/domain/fieldManifest.js` (n=9)
  - **dev** (9) — "Generation verdicts with NO live sibling — display-as-generated is hones" · "Displays read the tick-advanced stock, never a cached generation value." · "Zeroed while an effective deficit holds; restored from the structural ba"
    · consumer: `src/domain/fieldManifest.js` (render-site-read)
- `src/domain/worldPulse/deityFlaws.js` (n=9)
  - **dev** (9) — "The packet-anchored modulation: the boon weakens as pantheon share is co" · "The packet-anchored modulation: the temper pull sharpens while faith for" · "D2 chartered variance, not mean: the boon and bane magnitude band widens"
    · consumer: `(declaration)` (declaration)
- `src/domain/worldPulse/espionage/operationsVoice.js` (n=9)
  - **dev** (9) — "the voice speaks strain and never a turning: no line states or presuppos" · "ambient dwelling rests at a whisper (one floor quantum per axis at every" · "CANDIDATE, OWNER-UNSIGNED (every sentence in this file is voice-taste aw"
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/informationNews.js` (n=9)
  - **reader** (9) — "Less than we fear, and the reckoning is a season stale." · "{counterpart} has been shown {band}; nothing since {season}." · "Given {band} to see, and given it late."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/npcCirculation.js` (n=9)
  - **reader** (9) — "A stranger takes up residence in {settlementName}." · "They enter {factionName} at its lowest rung." · "{factionName} had a seat open at the bottom."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/pulseStageManifest.js` (n=9)
  - **dev** (9) — "Normalize the incoming world and mint deterministic pulse identity." · "Age and update slow actor state before conditions and movers read it." · "Advance existing pressures and convert resolved conditions into conseque"
    · consumer: `src/domain/worldPulse/pulseStageManifest.js` (render-site-read)
- `src/domain/instantWorld/worldPlan.js` (n=8)
  - **reader** (8) — "Mages, arcane orders, enchanted trade, and magical events all belong her" · "No working magic anywhere in the realm. Gods and temples remain." · "A compact frontier: one market town and its hamlets."
    · consumer: `src/components/instant/InstantWorldEntry.jsx` (family-inference)
- `src/components/generate/nextSteps.js` (n=7)
  - **reader** (7) — "Save it to your library" · "Keep it for campaigns, inline editing, and export." · "A print-ready dossier for the table."
    · consumer: `src/components/PostGenCoach.jsx` (family-inference)
- `src/components/settlement/eventComposer/EventComposerConstants.js` (n=7)
  - **dev** (7) — "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" · "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" · "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6"
    · consumer: `src/components/settlement/eventComposer/EventComposerConstants.js` (render-site-read)
- `src/data/namingData.js` (n=7)
  - **reader** (7) — "Northern European, medieval German/Austrian style" · "Middle Eastern/North African influenced" · "Chinese, Japanese and Korean medieval influenced - Song Dynasty, Heian P"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/convergence.js` (n=7)
  - **reader** (7) — "Committed to the field. The prize is worth the blood." · "An army sent to raise up rebels. Every neighbor now reads a ring tighten" · "{patronId}'s banners march on {targetId}'s succession"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/razing.js` (n=7)
  - **reader** (7) — "burning yields 0 once against 0 from holding. This was a place worth mor" · "the settlement cannot be counted, and an uncounted place cannot be sacke" · "They burned the settlement and rode home. The victor took no ground, lef"
    · consumer: `src/components/map/HeraldRemembrance.jsx` (family-inference)
- `src/lib/instantWorld/composerPipeline.js` (n=7)
  - **dev** (7) — "the shared id counter" · "Any step that mints an id must keep its position relative to every other" · "the placements ⇄ members join"
    · consumer: `(declaration site)` (declaration)
- `src/lib/spatialUsage.js` (n=7)
  - **dev** (7) — "supply-web economic pressure STOCK, not a distinct exercised mover" · "E1 generosity reserve-discipline STOCK (give-side motive substrate), not" · "E1 generosity give-side WILLINGNESS STOCK (motive substrate feeding the "
    · consumer: `(declaration site)` (declaration)
- `src/domain/display/occupationStatus.js` (n=6)
  - **reader** (6) — "a contested occupation; the occupier has not yet taken hold" · "an unstable occupation; control is precarious" · "an extractive occupation; the occupier bleeds it for everything it holds"
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (family-inference)
- `src/domain/npc/characterConsumers.js` (n=6)
  - **reader** (1) — "the reach: a drifted vice opens a door on 7 of 17 axes, because ten axes"
    · consumer: `src/pdf/lib/liveWorld.js` (family-inference)
  - **dev** (5) — "CANDIDATE, OWNER-UNSIGNED (every magnitude below is derived from the spe" · "R6's centre gives its three terms an EQUAL derived share. A signed weigh" · "R8's breadth runs from one band's share of the window to half of it. The"
    · consumer: `(declaration site)` (declaration)
- `src/domain/npc/characterDrift.js` (n=6)
  - **dev** (6) — "CANDIDATE, OWNER-UNSIGNED (the magnitudes are derived, not authored)" · "a TIGHTER per-axis offset clamp than the full spectrum span (F11 fixes t" · "the materialization floor: F9 offers a quarter-band as a CANDIDATE"
    · consumer: `(declaration site)` (declaration)
- `src/domain/realm/realmItemAttention.js` (n=6)
  - **reader** (6) — "A realm decision is unresolved and awaits the GM." · "A staged order no longer passes its current legal preconditions." · "A significant condition is active in the current realm state."
    · consumer: `src/components/map/HeraldCommandBody.jsx` (family-inference)
- `src/domain/summary/settlementQuickGuide.js` (n=6)
  - **reader** (6) — "This settlement is a settlement." · "Its founding purpose is not recorded." · "No governing authority is recorded."
    · consumer: `src/components/TableView.jsx` (family-inference)
- `src/domain/worldPulse/faithNews.js` (n=6)
  - **reader** (6) — "The last altar of {creed} in {settlement} went dark; none there now keep" · "The undercroft at {temple} was cleared for grain, and the word is that n" · "{settlement}'s roster carries {creed} no longer: not suppressed, not sle"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/foundingCatalog.js` (n=6)
  - **reader** (6) — "A house of care for the dying and the incurably ill poor, kept by the fa" · "A charitable house feeding and sheltering the destitute poor, the aged, " · "A house that takes in parentless children and raises them until they can"
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/lib/supplyChains.js` (n=6)
  - **reader** (6) — "Ore extraction to metalworking institutions" · "Agricultural production to food processing" · "Forestry to construction and shipbuilding"
    · consumer: `src/components/map/ChainEdges.jsx` (family-inference)
- `src/application/commands/adapters/customContentApply.js` (n=5)
  - **dev** (5) — "Archive a custom-content definition without deleting its revisions." · "Create a definition or append one immutable content revision." · "Restore an archived custom-content definition."
    · consumer: `src/application/commands/standardCommandRegistry.js` (declaration)
- `src/components/settlements/useCampaignAdvance.js` (n=5)
  - **reader** (5) — "The realm advances only after you canonize this campaign world." · "Add at least one settlement to this campaign before advancing." · "The realm is already advancing. Give it a moment."
    · consumer: `src/components/SettlementsPanel.jsx` (family-inference)
- `src/domain/content/customSupplyChainPresentation.js` (n=5)
  - **reader** (5) — "Every reviewed component materialized; trade endpoints are live." · "This settlement is eligible, but one or more components are unavailable." · "One or more reviewed components fall outside this settlement tier."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/display/dossierViewModel.js` (n=5)
  - **reader** (5) — "The blockade is biting: no magical channel runs it, and the import share" · "Entrepôt: re-exports transit goods" · "the granary is nearly empty (0.0 of 0.0 months)"
    · consumer: `src/components/dossier/EngineSections.jsx` (family-inference)
- `src/domain/display/parityContract.js` (n=5)
  - **dev** (5) — "The PDF reads this prose from the AI overlay only. The settlement's own " · "AI-narrative path only; absent from the data dossier." · "tone color hex / bar widths"
    · consumer: `(declaration site)` (declaration)
- `src/domain/npc/knownCharacter.js` (n=5)
  - **dev** (5) — "CANDIDATE, OWNER-UNSIGNED (the belief weight is derived from two existin" · "the observer TRUST mapping: carried as a linear read across the spectrum" · "whether a DISPLACEMENT should move belief at all — it is on record and n"
    · consumer: `(declaration site)` (declaration)
- `src/domain/npc/npcFacets.js` (n=5)
  - **dev** (5) — "the NPC card renders the normalized trait chips (temperament included)" · "the role/category mix is weighted by institution presence + stressors" · "the NPC card reads the declared role archetype while preserving the auth"
    · consumer: `(declaration site)` (declaration)
- `src/domain/resourceTerrainCompatibility.js` (n=5)
  - **reader** (5) — "Only available in coastal terrain" · "Only available in coastal or desert terrain" · "Only available in riverside terrain"
    · consumer: `src/components/ConfigurationPanel.jsx` (family-inference)
- `src/domain/worldPulse/causeVocabulary.js` (n=5)
  - **reader** (5) — "a broken supply chain" · "the strength levied away" · "the pressure of the war"
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/worldPulse/conquestFeasibility.js` (n=5)
  - **reader** (5) — "the seat keeps its own books: the war is not yet its own survival." · "the court has no bargaining range: it cannot judge the war." · "the court held no judgement to be wrong about."
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (family-inference)
- `src/domain/worldPulse/institutionStatusModel.js` (n=5)
  - **reader** (5) — "the road reopens or the stores refill" · "the house is cleaned out and the scandal closes" · "the repairs are finished"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-inference)
- `src/domain/worldPulse/operations/operationGrammar.js` (n=5)
  - **dev** (5) — "ODQ §806 ⟨F8⟩ — one vetting home, importance-DESCENDING; neither program" · "ODQ §802 R2 + §802.1 — CHOOSE ON KNOWN, RESOLVE ON TRUE; mortals read re" · "W-LIVES L5 — the chokepoint every consumer re-routes through; core + dri"
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/pactTriggers.js` (n=5)
  - **reader** (5) — "This court can carry what the bargain would cost it in reliance." · "One of these courts holds no belief about the other's observance." · "One of these courts holds no belief about where people are going."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/peaceReasons.js` (n=5)
  - **reader** (5) — "That court has no army in the field against that foe. There is no war of" · "The recall order is already given; the army marches home." · "Both courts have been schooled to the same truth by the fighting. No off"
    · consumer: `src/components/map/WarCausalBrief.jsx` (family-inference)
- `src/domain/worldPulse/simulationProfile.js` (n=5)
  - **reader** (5) — "That world-progression setting isn’t recognized: defaulting to advancing" · "That autonomy setting is not recognised; the realm keeps its current app" · "The realm does not yet reckon distance. Every settlement is a neighbour."
    · consumer: `src/components/map/SimulationRulesAxes.jsx` (family-inference)
- `src/domain/worldPulse/temperamentPresets.js` (n=5)
  - **reader** (5) — "A gentle age. The world keeps its own counsel and turns slowly; change w" · "The measured middle. Settlements rise and fall at a believable pace, tra" · "A steady realm that must reckon with the year. The seasons turn, the gra"
    · consumer: `src/components/temperament/TemperamentPicker.jsx` (family-inference)
- `src/domain/worldPulse/warReasons.js` (n=5)
  - **reader** (5) — "That is not a typed reason for war this engine tracks." · "That cause must arise from the world’s own record. A lineage claim requi" · "A court cannot hold a casus belli against itself."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/pdf/variants.js` (n=5)
  - **reader** (5) — "Quick prep doc: no timeline, no canon-only sections." · "Full campaign-ready document with current state and timeline." · "Lean recap: cover, current state, timeline only. For reviewing what chan"
    · consumer: `src/components/settlement/ExportSheet.jsx` (family-inference)
- `src/components/dossier/proseFieldLabels.js` (n=4)
  - **reader** (4) — "How the challenge was overcome" · "Safety, as first surveyed" · "Guard effectiveness, as first surveyed"
    · consumer: `src/components/dossier/WorkbenchProseEditor.jsx` (family-inference)
- `src/components/settlement/faithPanelModel.js` (n=4)
  - **reader** (4) — "The patron fell. Discredited: the creed lost its rightful claim, and the" · "The patron fell. Displaced: the town’s devotion drifted to another creed" · "The patron fell. Imposed: the seat changed hands by decree of those who "
    · consumer: `src/components/new/tabs/FaithTab.jsx` (family-inference)
- `src/design/boundBook.js` (n=4)
  - **dev** (4) — "art held between hard chrome rails" · "art resolves into page through a tokenized scrim" · "art is hard-framed inside the house border ring"
    · consumer: `scripts/audit/bound-book-report.mjs` (render-site-read)
- `src/domain/ai/suggestedQuestions.js` (n=4)
  - **reader** (4) — "What is happening in my world right now?" · "Which settlements are under the most pressure?" · "What can I share with my players?"
    · consumer: `src/components/AiAnalystPanel.jsx` (render-site-read)
- `src/domain/density/densityCreateBoundary.js` (n=4)
  - **dev** (4) — "the generation core runs a request whose density law was already minted " · "generates a dossier only to compare it against the surveyor's construct " · "renders a preview of what homebrew content would do to a generation; the"
    · consumer: `(declaration site)` (declaration)
- `src/domain/display/visibilityAudit.js` (n=4)
  - **dev** (4) — "Covert mobilizer omitted from player standings" · "A covert-only world reports no live mobilization to players" · "No covert smuggling tie in a player trade-pressure read"
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (render-site-read)
- `src/domain/instantWorld/genesisDiplomacy.js` (n=4)
  - **reader** (4) — "the older seat has long overshadowed the younger" · "both seats agreed to stand together from the first" · "goods have moved between the two since the founding"
    · consumer: `src/components/instant/InstantWorldEntry.jsx` (family-inference)
- `src/domain/npc/characterEdit.js` (n=4)
  - **dev** (4) — "STRUCTURE DECIDED; the axis roster itself is owner-taste and UNSIGNED" · "whether clearing a chart back to all-neutral should un-canon the NPC. Th" · "NONE by design; the mount is a later car"
    · consumer: `(declaration site)` (declaration)
- `src/domain/relationships/canonicalRelationship.js` (n=4)
  - **reader** (4) — "Current settlement is patron" · "Current settlement is client" · "Current settlement is overlord"
    · consumer: `src/components/SettlementsPanel.jsx` (family-inference)
- `src/domain/state/bands.js` (n=4)
  - **reader** (4) — "Healthy. Shocks are absorbed without crisis." · "Functional but stretched. A bad season would hurt." · "One real shock away from failure."
    · consumer: `src/components/settlement/SystemStateBar.jsx` (family-inference)
- `src/domain/state/compareSystemState.js` (n=4)
  - **reader** (4) — "Resilience fell slightly; pressure increased" · "Volatility fell slightly; pressure increased" · "External Threat fell slightly; pressure increased"
    · consumer: `src/components/settlement/eventComposer/BatchCart.jsx` (family-inference)
- `src/domain/worldPulse/brokerageServicesRules.js` (n=4)
  - **reader** (4) — "The town keeps no secrets worth the name, so the whole of the traffic re" · "Gates half-raised cost the watcher the subtlest of it, and left the rest" · "Behind closed gates only the bare shape survived: that a contract exists"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-inference)
- `src/domain/worldPulse/demographicsPushPull.js` (n=4)
  - **dev** (4) — "the walls are the wall" · "a threat stands at the gate" · "the fields can be counted"
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/magicRegimeModel.js` (n=4)
  - **reader** (4) — "what the practitioners can do unpaid" · "what the town itself pays for" · "what a patron underwrites"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/pactFormation.js` (n=4)
  - **reader** (4) — "This court's posture reads settled: nothing was heard from its remembere" · "This court's posture reads settled: nothing was heard from its remembere" · "Agreed in peace between {from} and {to}, and extracted from nobody."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/razingExecution.js` (n=4)
  - **reader** (4) — "the conquest doctrine is not lit in this world; no town burns by it." · "{razerId} is not at the extreme with {victimId}: the border is not hosti" · "nobody would inherit the right to answer the burning"
    · consumer: `src/components/map/WarResolveSection.jsx` (family-inference)
- `src/domain/worldPulse/routeNetworkCharterEvents.js` (n=4)
  - **reader** (4) — "A road is chartered between {a} and {b}" · "The way opens as a track, and it will be as good a road as it is walked." · "The realm cannot close this material loop by any other road."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/routeNetworkDecay.js` (n=4)
  - **reader** (4) — "The road between {a} and {b} is abandoned" · "The way is not struck from the map. It is only overgrown, and it remembe" · "Nothing has walked the way in {quietTicks} weeks."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/supplyWebWarfare.js` (n=4)
  - **reader** (4) — "A court cannot open a supply-war campaign against itself." · "That target has no readable supply web to strangle (no reachable outside" · "That court already runs a live indirect campaign; one plan per aggressor"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/warCoalitionRefusal.js` (n=4)
  - **reader** (4) — "{coalitionNameFor} refuses {coalitionNameFor}'s call" · "{coalitionNameFor} will not send its army against {coalitionNameFor}; th" · "The court weighed the wider retaliation that a march against {coalitionN"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/components/new/economyDeskRead.js` (n=3)
  - **reader** (3) — "The town is meant to be shut and the market is not empty. Nobody local w" · "The town's living is the road. Goods come, goods go, and the town takes " · "The town can answer what a town this size ought to answer, and does not "
    · consumer: `src/components/new/tabs/DailyLifeTab.jsx` (family-inference)
- `src/data/sampleSettlements.js` (n=3)
  - **reader** (3) — "A rain-grey harbour town where the council and the temple have stopped s" · "A mountain city built on iron, ruled by its guild-masters, whose mines n" · "A forest village a week from the nearest road, where every cottage bars "
    · consumer: `src/components/SettlementsPanel.jsx` (family-inference)
- `src/domain/autonomy/accelerationOps.js` (n=3)
  - **reader** (1) — "{type} at {originSettlementId} (severity 0%)"
    · consumer: `src/components/surveyor/AutonomyPanel.jsx` (family-inference)
  - **dev** (2) — "unknown stressor type '(empty)': a nudge may only raise a catalogued pre" · "severity must sit in [0.05, 0.85]"
    · consumer: `(validator)` (declaration)
- `src/domain/display/forceComposition.js` (n=3)
  - **reader** (3) — "troop of heavy horse" · "troops of heavy horse" · "circles of war mages"
    · consumer: `src/components/new/tabs/WarTab.jsx` (family-inference)
- `src/domain/display/hegemonyRead.js` (n=3)
  - **reader** (3) — "commands the lion’s share of the realm’s strength" · "holds a great part of the realm’s strength" · "holds a regional preponderance"
    · consumer: `src/components/map/RealmDashboard.jsx` (family-inference)
- `src/domain/display/stateProse/economyStateProse.js` (n=3)
  - **reader** (2) — "broad base of trades" · "mix of field and market"
    · consumer: `src/components/new/tabs/DailyLifeTab.jsx` (family-inference)
  - **dev** (1) — "COMBINATION C3: the middle rungs"
    · consumer: `src/domain/display/stateProse/*` (declaration)
- `src/domain/display/stateProse/generalStateProse.js` (n=3)
  - **dev** (3) — "tier overlay: other tiers" · "ordinary (route road and the default)" · "the MARGINAL arm: neither verdict returned"
    · consumer: `src/domain/display/stateProse/*` (declaration)
- `src/domain/generationContentProfile.js` (n=3)
  - **reader** (3) — "Adventure, danger, and political conflict without generated trafficking," · "Serious conflict and social pressure without generated trafficking, slav" · "The complete governed dark-theme vocabulary, including systems of coerci"
    · consumer: `src/components/surveyor/ConstructionPanel.jsx` (family-inference)
- `src/domain/historyBeats.js` (n=3)
  - **reader** (3) — "A crisis is imminent if no one intervenes." · "The next year will test whoever holds the chair." · "Continuity, with the usual slow erosion of any settlement."
    · consumer: `src/components/settlement/VersionDiffView.jsx` (family-inference)
- `src/domain/npc/acceptanceCharacterReads.js` (n=3)
  - **dev** (3) — "CANDIDATE, OWNER-UNSIGNED (this leaf authors no magnitude; every number " · "whether a court that holds NO known chart should vet as though the man w" · "the §802 R1 willingness door is NOT wired here and its symbol is deliber"
    · consumer: `(declaration site)` (declaration)
- `src/domain/npc/livedExperienceCatalog.js` (n=3)
  - **dev** (2) — "CANDIDATE, OWNER-UNSIGNED (pack Register III, first draft)" · "the whole kind roster, every plane assignment, every family assignment a"
    · consumer: `(declaration site)` (declaration)
  - **ambiguous** (1) — "n/a - teaches nothing"
    · consumer: `(no product surface)` (reachability)
- `src/domain/npc/livedExperienceFunnel.js` (n=3)
  - **dev** (3) — "CANDIDATE, OWNER-UNSIGNED (every figure DERIVED from the floor or from t" · "the three pull magnitudes (derived: faint = the floor, heavy = one full " · "the per-family learn ladder: carried as a mechanical tercile over the pa"
    · consumer: `(tuning declaration)` (declaration)
- `src/domain/npc/livedExperienceSources.js` (n=3)
  - **dev** (3) — "CANDIDATE, OWNER-UNSIGNED (the registry is measurement; the blocks are a" · "whether an affiliation-plane realm event should teach EVERY roster membe" · "NONE in production by design; the pulse call site is car L5's"
    · consumer: `(declaration site)` (declaration)
- `src/domain/npc/paradigmAxisCatalog.js` (n=3)
  - **dev** (3) — "CANDIDATE, OWNER-UNSIGNED (words and leans are drafts; legacy columns ar" · "ODQ 806 F1/F2: consolidation, not derivation; corruptibility is per-word" · "NONE by design; car L1 lands dark, car L5 re-points consumers"
    · consumer: `(declaration site)` (declaration)
- `src/domain/regenerationMode.js` (n=3)
  - **ambiguous** (3) — "Preserve most. Minor cosmetic / narrative variation only." · "Preserve user canon + locked entities. Recalculate affected subsystems." · "Keep only hard anchors (seed, name, tier). Reroll almost everything."
    · consumer: `(no product surface)` (reachability)
- `src/domain/simulationSpine.js` (n=3)
  - **reader** (3) — "Its real power lies with" · "It is currently strained by" · "Its likely future is"
    · consumer: `src/components/PipelineRail.jsx` (family-inference)
- `src/domain/spatial/cohesionWeave.js` (n=3)
  - **reader** (3) — "seasonal army (the harvest imperative bites)" · "route wars; folds to embargoes" · "limited; guards its supply"
    · consumer: `src/components/new/tabs/PowerTab.jsx` (family-inference)
- `src/domain/traditions/politics.js` (n=3)
  - **reader** (3) — "a whole ox turned on the spit" · "the guild ovens working through the night" · "older than any charter the town can show"
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/tuning/autoTunableRegistry.js` (n=3)
  - **dev** (3) — "SQL k-floor; monotone UP only (§4). Owner-ratify if auto-tightening is w" · "SQL k-floor; monotone UP only (§4)." · "surface must be one of display/rollup/analytics (never sim/generation)"
    · consumer: `(tuning declaration)` (declaration)
- `src/domain/worldPulse/brokerageServices.js` (n=3)
  - **reader** (3) — "No house in this world keeps a register worth paying for." · "The house wants real coin for this, and will want it before it speaks." · "Nothing legible left that house this week."
    · consumer: `src/components/map/BeliefDivergenceBand.jsx` (family-inference)
- `src/domain/worldPulse/calamityKernel.js` (n=3)
  - **reader** (3) — "Killed in the calamity." · "{name}'s Great Calamity, year {year}" · "The calamity has overwhelmed the seat of power; the response is conteste"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/espionage/espionageTap.js` (n=3)
  - **reader** (3) — "as X itself believes" · "X speaks one thing and believes another" · "as told in X's markets"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-inference)
- `src/domain/worldPulse/feasibilityGate.js` (n=3)
  - **reader** (3) — "Weighed against the walls, the attacker is no contest: the defender's ho" · "Utterly outmatched, a thorpe against a fortified city; the siege cannot " · "the matchup alone made a storm worth trying"
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (family-inference)
- `src/domain/worldPulse/magicBufferModel.js` (n=3)
  - **reader** (3) — "no regime is known, so nothing can be exploited and the magic term is ze" · "The wards blunted the worst of it, and it cost nothing anyone can name." · "The wards reached further than the stores could pay for, and stopped whe"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-inference)
- `src/domain/worldPulse/npcDmVerbRecords.js` (n=3)
  - **reader** (3) — "The realm strikes their name from the register of the living. {where} wa" · "{who} is recorded among the dead at {where}." · "Any order standing against them dies with them."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/pulseKernel.js` (n=3)
  - **dev** (3) — "occupation seed + conquest disposition ratchet" · "vassal promotion + advance-win disposition residue" · "the concluded-war record (W-MEM): staged or sealed out of band"
    · consumer: `(declaration)` (declaration)
- `src/domain/worldPulse/reinforcement.js` (n=3)
  - **reader** (3) — "A thin trickle of men and materiel" · "Everything the home could send" · "Origin is itself besieged/occupied. It cannot spare reinforcements."
    · consumer: `src/components/map/WarResolveSection.jsx` (family-inference)
- `src/domain/worldPulse/sovereigntyIntent.js` (n=3)
  - **reader** (3) — "No verdict is recorded on this sale: no buyer is named." · "weighs selling to . No court is named as the seller, so no appetite is r" · "No court is named as the seller, so no appetite is recorded."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/lib/aboutMapping.js` (n=3)
  - **reader** (3) — "What if the town remembered?" · "One tick, in dependency order" · "Caged by mechanism, not by promise"
    · consumer: `src/components/HowToUse.jsx` (family-inference)
- `src/lib/importReconciliation.js` (n=3)
  - **reader** (2) — "This export is too large to reconcile safely." · "The reconciliation session was rejected."
    · consumer: `src/components/settlements/StructuredCampaignReconciliation.jsx` (family-inference)
  - **dev** (1) — "This reconciliation session is malformed or unsupported."
    · consumer: `(declaration)` (declaration)
- `src/store/aiRequestLifecycle.js` (n=3)
  - **reader** (3) — "Walking the night watch" · "Writing the settlement’s identity" · "Mapping the political web"
    · consumer: `src/App.jsx` (family-inference)
- `src/application/commands/adapters/importReconciliationApply.js` (n=2)
  - **dev** (2) — "Rehome one existing settlement into the reviewed target campaign." · "Create one dormant imported settlement and attach it atomically."
    · consumer: `src/application/commands/standardCommandRegistry.js` (declaration)
- `src/components/gallery/galleryMapsUtils.js` (n=2)
  - **reader** (2) — "Bare terrain and geography. No settlements, no world state." · "The map populated with its settlements, plus the living world you choose"
    · consumer: `src/components/gallery/MapShareEditor.jsx` (family-inference)
- `src/components/map/heraldCommandSourceParity.js` (n=2)
  - **dev** (2) — "LiveWarStatus, RealmIntrigue, BeliefDivergenceBand, WarResolveSection" · "RealmItem archive and HeraldHeadline"
    · consumer: `(parity manifest)` (declaration)
- `src/components/map/heraldRegister.js` (n=2)
  - **reader** (2) — "A great city that dwindled to a final thorp and died. Its stones stand a" · "It dwindled and was abandoned. A quiet site marks where it stood."
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/data/galleryReactionVocab.js` (n=2)
  - **reader** (2) — "A world worth walking" · "I'd run a campaign here"
    · consumer: `src/components/gallery/GalleryReactionChips.jsx` (family-inference)
- `src/domain/content/customContentVersioning.js` (n=2)
  - **dev** (2) — "Unsupported custom-content category '{a}'." · "Custom content must be a plain object."
    · consumer: `(validator)` (declaration)
- `src/domain/display/economyFreshness.js` (n=2)
  - **reader** (2) — "Events recorded after this settlement's last survey may not be fully cou" · "Events recorded after this settlement's last survey may not be fully cou"
    · consumer: `src/components/new/EconomyFreshnessNote.jsx` (family-inference)
- `src/domain/display/humanizeEngineTokens.js` (n=2)
  - **reader** (2) — "week 1 of spring, year 1" · "the spring of year 1"
    · consumer: `src/components/dossier/DossierHeaderRow.jsx` (family-inference)
- `src/domain/display/stateProse/powerStateProse.js` (n=2)
  - **dev** (2) — "neutral baseline (nothing pulling either way)" · "layer DORMANT (no ledger materialized)"
    · consumer: `src/domain/display/stateProse/*` (declaration)
- `src/domain/display/tradePressure.js` (n=2)
  - **reader** (2) — "a vital, hard-to-replace tie" · "a valuable trade tie"
    · consumer: `src/pdf/lib/liveWorld.js` (family-inference)
- `src/domain/region/wizardNews.js` (n=2)
  - **reader** (2) — "a rise in lawlessness" · "a stir among the faithful"
    · consumer: `src/components/map/ChroniclersLetterPanel.jsx` (family-inference)
- `src/domain/regionalGraph.js` (n=2)
  - **reader** (2) — "Neighbour '{name}' classified as other." · "No structured regional neighbours."
    · consumer: `src/components/interior/InteriorView.jsx` (family-inference)
- `src/domain/spatial/generosityEV.js` (n=2)
  - **reader** (1) — "Grain went to {receiverName}: their ground shields {giverName}'s flank: "
    · consumer: `src/components/map/RealmIntrigue.jsx` (family-inference)
  - **dev** (1) — "Statecraft §2.4 GIVE lane: warning an ally, priced by the SACRIFICE of t"
    · consumer: `(declaration)` (declaration)
- `src/domain/townMap/asymmetrySources.js` (n=2)
  - **reader** (2) — "waterfront (the town meets the water)" · "market accretion (stalls crowd the trade gate)"
    · consumer: `src/components/interior/InteriorView.jsx` (family-inference)
- `src/domain/worldPulse/applyWorldPulseOccupationAuthority.js` (n=2)
  - **reader** (2) — "{toPowerName} extracts wealth, troops, and authority from the conquered " · "A foreign occupation authority installed by conquest."
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (family-inference)
- `src/domain/worldPulse/applyWorldPulseRelationshipGraph.js` (n=2)
  - **reader** (2) — "{nameFor} and {nameFor}: {fromType} becomes {toType}" · "An allied court answered a live call and opened its own bilateral war ed"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/conquestExecution.js` (n=2)
  - **reader** (2) — "the margin between the victor and the held settlement cannot be measured" · "nothing the victor holds can be weighed for hunger."
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (family-inference)
- `src/domain/worldPulse/deityStanceLane.js` (n=2)
  - **reader** (2) — "{rivalName} finds an ear in {cityName}" · "{npcName}, whose temper leans to {rivalName} and away from {patronName},"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/envoyChanceMeetingStage.js` (n=2)
  - **dev** (2) — "the doubling of that grievance when the approacher wore a covert face" · "the residents floor, which is the estate's own notable line rather than "
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/espionage/espionageDoctrine.js` (n=2)
  - **reader** (2) — "No espionage doctrine can be read for this court: no court was named." · "No espionage doctrine can be read for this court: {a}."
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/worldPulse/npcGoalBranches.js` (n=2)
  - **dev** (2) — "CANDIDATE, OWNER-UNSIGNED (the nerve column is the conversion's one auth" · "the `nerve` column: thirteen ordinal values saying how bold each branch "
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/routeNetworkConsumersInterdiction.js` (n=2)
  - **reader** (2) — "The road from {b} carried {join} into {b}." · "Traffic on that way stood at {band}."
    · consumer: `src/components/library/LibraryToolbar.jsx` (family-inference)
- `src/domain/worldPulse/settlementLifecycleKernel.js` (n=2)
  - **reader** (1) — "Resource key (optional: the vein the camp exists for)"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
  - **dev** (1) — "only town-or-higher parents seed steadings"
    · consumer: `(declaration)` (declaration)
- `src/store/settlementDeityHelpers.js` (n=2)
  - **reader** (2) — "Deities come from your custom Compendium." · "Requires premium custom content."
    · consumer: `src/App.jsx` (family-inference)
- `src/application/commands/adapters/partyImpactRecord.js` (n=1)
  - **dev** (1) — "Record one reviewed party impact through the World Pulse input lane."
    · consumer: `src/application/commands/standardCommandRegistry.js` (declaration)
- `src/application/commands/adapters/pendingEditCommit.js` (n=1)
  - **dev** (1) — "Commit one exact owner-scoped set of reviewed settlement edits."
    · consumer: `src/application/commands/standardCommandRegistry.js` (declaration)
- `src/application/commands/commandEnvelope.js` (n=1)
  - **dev** (1) — "command must be a plain object"
    · consumer: `(validator)` (declaration)
- `src/components/founders/hallRegister.js` (n=1)
  - **dev** (1) — "'Crimson Text', Georgia, serif"
    · consumer: `(style token)` (declaration)
- `src/components/map/gatheredDocket.js` (n=1)
  - **reader** (1) — "Every matter is settled."
    · consumer: `src/components/map/GatheredAdjudication.jsx` (family-inference)
- `src/components/map/lifecycleGlyphStyle.js` (n=1)
  - **reader** (1) — "Relic ruin / abandoned"
    · consumer: `src/components/map/MapLegend.jsx` (family-inference)
- `src/components/new/tabConstants.js` (n=1)
  - **dev** (1) — "Available if you know where to look"
    · consumer: `(declaration)` (declaration)
- `src/components/theme.js` (n=1)
  - **reader** (1) — "drop-shadow(NaNpx NaNpx {b}px {c})"
    · consumer: `src/App.jsx` (family-inference)
- `src/config/entitlementLadder.js` (n=1)
  - **reader** (1) — "InteriorView has no product importer and no per-settlement sample allowa"
    · consumer: `src/components/howto/AboutManifesto.jsx` (family-inference)
- `src/design/tokens.js` (n=1)
  - **dev** (1) — "'JetBrains Mono', 'Fira Code', Consolas, monospace"
    · consumer: `(declaration)` (declaration)
- `src/domain/briefs/citations.js` (n=1)
  - **reader** (1) — "the engine does not record this"
    · consumer: `src/components/map/RoadScenePanel.jsx` (family-inference)
- `src/domain/content/contentEffectProjection.js` (n=1)
  - **reader** (1) — "This field is outside the registered content vocabulary."
    · consumer: `src/components/compendium/CustomContent.jsx` (family-inference)
- `src/domain/customContent.js` (n=1)
  - **ambiguous** (1) — "'{name}' classified as other institution."
    · consumer: `(no product surface)` (reachability)
- `src/domain/display/discourseKernel.js` (n=1)
  - **reader** (1) — "Against what was coming:"
    · consumer: `src/components/map/CauseWalkPanel.jsx` (family-inference)
- `src/domain/display/stateProse/stressorsStateProse.js` (n=1)
  - **dev** (1) — "DIRECTION: stable, and the FLAT case (no valid directional status)"
    · consumer: `src/domain/display/stateProse/*` (declaration)
- `src/domain/npc/npcBank.js` (n=1)
  - **dev** (1) — "unknown facet kind '{a}'"
    · consumer: `(validator)` (declaration)
- `src/domain/roads/migrationReason.js` (n=1)
  - **reader** (1) — "A column of folk leaving a shed settlement"
    · consumer: `src/components/map/RoadScenePanel.jsx` (family-inference)
- `src/domain/roads/ops.js` (n=1)
  - **ambiguous** (1) — "unknown roads op '{c}'"
    · consumer: `(no product surface)` (reachability)
- `src/domain/rulingPowerCoup.js` (n=1)
  - **reader** (1) — "Critical. The seat could fall"
    · consumer: `src/components/dossier/EngineSections.jsx` (family-inference)
- `src/domain/spatial/calamity.js` (n=1)
  - **reader** (1) — "The Great Calamity of {a}, year {b}"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/spatial/dispatchEV.js` (n=1)
  - **reader** (1) — "The merchants are emboldened by the {a} run. A risky delivery paid off."
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/spatial/index.js` (n=1)
  - **reader** (1) — "a harbour with no counterpart across the water"
    · consumer: `src/components/WorldMap.jsx` (family-inference)
- `src/domain/spatial/supplyShipments.js` (n=1)
  - **reader** (1) — "{institutionName} starves: the {input} road is cut (every supplier sever"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/state/deriveSystemState.js` (n=1)
  - **reader** (1) — "Few factions: concentrated power"
    · consumer: `src/components/settlement/ReadSystemStateBar.jsx` (family-inference)
- `src/domain/tableEvents.js` (n=1)
  - **reader** (1) — "{kind} at the table ({band})"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/tableLedger.js` (n=1)
  - **dev** (1) — "kind must be one of: incident, stressor-relief, obligation, exposure, st"
    · consumer: `(validator)` (declaration)
- `src/domain/threatProfile.js` (n=1)
  - **reader** (1) — "No threats currently pressing the settlement."
    · consumer: `src/components/primitives/BandPill.jsx` (family-inference)
- `src/domain/townMap/siteGenesis.js` (n=1)
  - **dev** (1) — "the coast (sea trade)"
    · consumer: `(declaration)` (declaration)
- `src/domain/townScene/index.js` (n=1)
  - **dev** (1) — "input must be a plain object"
    · consumer: `(validator)` (declaration)
- `src/domain/traditions/genesis.js` (n=1)
  - **reader** (1) — "Seedtime, the first week"
    · consumer: `src/components/new/tabs/TraditionsTab.jsx` (family-inference)
- `src/domain/traditions/prose.js` (n=1)
  - **reader** (1) — "{name} went well this year in {town}. A town's observances carry its ide"
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-trace)
- `src/domain/worldPulse/attrition.js` (n=1)
  - **reader** (1) — "The attacking host bled lightly this turn in a {band} engagement, though"
    · consumer: `src/components/map/WarResolveSection.jsx` (family-inference)
- `src/domain/worldPulse/brokerageServicesPlant.js` (n=1)
  - **reader** (1) — "No market in this world sells that."
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/worldPulse/conquestIntent.js` (n=1)
  - **reader** (1) — "no conquest intent can be read: the court has no martial disposition on "
    · consumer: `src/components/admin/AdminSimTuningPanel.jsx` (family-inference)
- `src/domain/worldPulse/demographicsLand.js` (n=1)
  - **reader** (1) — "Every opening left to {b} lies out beyond the reach of any road."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/demographicsPlans.js` (n=1)
  - **reader** (1) — "{b} does nothing in particular. The work stands at 100 percent and 0 of "
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/demographicsResponses.js` (n=1)
  - **reader** (1) — "{b} does nothing in particular."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/demographicsRisk.js` (n=1)
  - **reader** (1) — "and the holding is scattered over open ground"
    · consumer: `src/components/surveyor/AutonomyPanel.jsx` (family-inference)
- `src/domain/worldPulse/demographicsWar.js` (n=1)
  - **reader** (1) — "The court believes their granaries are bare and the court is wrong about"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/dispositionProfile.js` (n=1)
  - **reader** (1) — "No supported disposition channel changes this court's action bar."
    · consumer: `src/components/map/PantheonPanel.jsx` (family-inference)
- `src/domain/worldPulse/espionage/espionageGauntlet.js` (n=1)
  - **reader** (1) — "The captor court has no readable doctrine, so its caught guest is treate"
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/worldPulse/espionage/espionageProductStage.js` (n=1)
  - **reader** (1) — "Pride carried him through the gate: the approach read no worse than his "
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/worldPulse/faithField.js` (n=1)
  - **reader** (1) — "No fertility or household causal variable exists. The word appears only "
    · consumer: `src/components/map/HeraldBody.jsx:121` (family-inference)
- `src/domain/worldPulse/ledgerOwnershipManifest.js` (n=1)
  - **dev** (1) — "no global writer order; every writer owns its local deterministic orderi"
    · consumer: `(declaration site)` (declaration)
- `src/domain/worldPulse/lineageClaim.js` (n=1)
  - **reader** (1) — "The lineage was cited by both sides to opposite ends, and the quieter re"
    · consumer: `src/components/map/WarCausalBrief.jsx` (family-inference)
- `src/domain/worldPulse/magicFormsPractitioner.js` (n=1)
  - **ambiguous** (1) — "The Hedge wizard of a"
    · consumer: `(no product surface)` (reachability)
- `src/domain/worldPulse/magicSubstitution.js` (n=1)
  - **ambiguous** (1) — "The settlement takes a little of its bread from the arcane houses: about"
    · consumer: `(no product surface)` (reachability)
- `src/domain/worldPulse/opportunism.js` (n=1)
  - **reader** (1) — "The court believes their walls are thinly held and the court is wrong ab"
    · consumer: `src/components/map/WarCausalBrief.jsx` (family-inference)
- `src/domain/worldPulse/pactProposals.js` (n=1)
  - **reader** (1) — "There was nothing here that could be written into an instrument."
    · consumer: `src/components/map/PerspectiveStandings.jsx` (family-inference)
- `src/domain/worldPulse/peaceTermsDrafting.js` (n=1)
  - **reader** (1) — "{c} accepts the {type} demanded by {b}."
    · consumer: `src/components/map/PerspectiveStandings.jsx` (family-inference)
- `src/domain/worldPulse/relationshipCompatibility.js` (n=1)
  - **dev** (1) — "'{a}' is not a canonical relationship type."
    · consumer: `(validator)` (declaration)
- `src/domain/worldPulse/settlementLifecycleFirstClass.js` (n=1)
  - **reader** (1) — "New settlement name (optional)"
    · consumer: `src/components/library/LibraryToolbar.jsx` (family-inference)
- `src/domain/worldPulse/sovereigntyAppraisal.js` (n=1)
  - **reader** (1) — "the court cannot price the holding: the pair is not an asset and a court"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/sovereigntyAssets.js` (n=1)
  - **reader** (1) — "no holding was named, so none can be judged."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/sovereigntyBundle.js` (n=1)
  - **reader** (1) — "no court was named, so the bundle has no valuer and no value."
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/sovereigntyReach.js` (n=1)
  - **reader** (1) — "a reach question needs a buyer and a holding that are two different plac"
    · consumer: `src/components/map/RealmVerbComposer.jsx` (family-inference)
- `src/domain/worldPulse/stressorGates.js` (n=1)
  - **reader** (1) — "Few congregations here to fracture."
    · consumer: `src/components/map/ChronicleScrollback.jsx` (family-inference)
- `src/domain/worldPulse/successorNpc.js` (n=1)
  - **dm-only** (1) — "Newly installed after a corruption scandal. Determined to stay above sus"
    · consumer: `src/domain/display/publicSafe.js:170` (render-site-read)
- `src/lib/accountSettlementContentPortability.js` (n=1)
  - **dev** (1) — "Settlement content provenance has an invalid shape."
    · consumer: `(declaration)` (declaration)
- `src/lib/customContentArchive.js` (n=1)
  - **dev** (1) — "archive must be an object."
    · consumer: `(validator)` (declaration)
- `src/lib/seoCompendium.js` (n=1)
  - **reader** (1) — "{term}, a {category} in the SettlementForge Compendium. Every entry rend"
    · consumer: `src/components/CompendiumPanel.jsx` (family-inference)
- `src/pdf/lib/headlines.js` (n=1)
  - **reader** (1) — "A {toLowerCase}, {toLowerCase} {toLowerCase} under active strain (1 cris"
    · consumer: `src/pdf/sections/DefenseSecurity.jsx` (family-inference)