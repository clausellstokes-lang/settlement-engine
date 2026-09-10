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

### C-2 · §5 Axis A, the R-10 sentence (line 741-743)

CURRENT:

> "And the 146 in R15/R18 are **not** "mostly dev" **[R-10]**: R18's 57 are 38 reader-facing generated prose / UI labels, 14 dev throw and guard messages, 3 AI-layer prompts and 2 ambiguous; R15's 83 are 60 dev, design-token or ledger strings and **23 reader-facing** (`customContentSchema` 15, `labelBands` 5, `searchIndex` 2, `dossierViewModel` 1)."

REPLACEMENT (append after the existing sentence, which stays true of what it measured):

> "⚠ Both counts are of the **em-dash-bearing subset**, which is not representative of either register. Classified per file by consumer over the WHOLE of R15 at `fd36f0298` (3,894 rows), the register is **70.8% reader-facing** — 2,758 reader, 225 DM-private (NPC secrets and plot hooks, stripped by `publicSafe.js:101`), 695 dev, 59 AI-prompt, 157 untraceable. Within R15 the em-dash subset is 31.8% reader against 71.5% for every other string, so the breach list understates R15's reader share by a factor of 2.2 **[R15-TAIL]**."

### C-3 · §5 Axis A, the register characterisation the ask quotes (line 629 of v1, now folded into 741)

The phrase **"mostly AI-layer prompts, design-token descriptions and dev notes"** is wrong for R15
by every measure taken here and should not survive anywhere in the document. AI-layer prompts are
**1.5%** of R15 (59 rows, 47 of them one export); design tokens and dev notes together are
**17.8%**. Proposed replacement wording wherever that phrase appears:

> "R15 is reader-dominated (70.8%); its non-reader remainder is 17.8% dev notes and provenance
> ledgers, 5.8% DM-private prose and 1.5% AI-layer prompt text **[R15-TAIL]**."

### C-4 · a sha line the register table does not carry

Add to the §4 heading or the R15 row: **"R15 is sha-bound: 3,883 at `6b80d1e8e`, 3,894 at
`fd36f0298` (+11, P-9)."** Anyone re-running the classification at HEAD will otherwise read the
+11 as a defect.

---

## Per-file table (234 files, sorted by row count)

