# PROSE INVENTORY — every home of authored, reader-facing prose in the estate

**Lane PROSE-INVENTORY (Opus 5) · read-only · dock `laneDESKINT` at `7ef501df9`, working tree clean.**
Every figure below is MEASURED by an instrument named in §1 and kept under
`scratchpad/prose-research/inventory/`. No repo file was read-modified, no test was run.

---

## 0. THE HEADLINE

| | variants | note |
|---|---|---|
| The chair's first probe (`probe.mjs`) | **3,431** | dossier-state 2,264 · dossier-causal 468 · news-pools 699 |
| Authored strings reachable from `src/` exports + JSX (distinct, after dedup) | **12,847** | §4 register table; **12,171** after removing the dev-only certification rows |
| …plus prose written INLINE inside functions (invisible to an import walk) | **+ 3,881** | §5 |
| …plus authored corpus that lives ONLY in `docs/content/` and is wired NOWHERE | **+ 4,941** | §3 |

**The chair's probe measured 3,431 of the ~16,730 authored strings in `src/` (20.5%), and of
the ~21,670 in the estate once the unwired annex corpus is counted, 15.8% — about a sixth.**
Its three misses, in order of size:

1. **The whole `src/data` gazetteer + world-data layer** — 2,014 institution/service sentences
   and 817 culture/NPC/arrival/history sentences. Untouched.
2. **The NPC cause-conjunction ladder** (`src/domain/display/causeConjunctionRole/*` + the class
   tier) — **1,663 authored sentences**, the third-largest body of prose in the estate, and
   read aloud at the table. Untouched.
3. **The Herald proper** — the probe's `*ReceiptPools.js|*News.js` glob caught 699 of the
   Herald's 1,030 distinct pool sentences and none of `newsVoice.js` (342), `newsBody.js` (28),
   `heraldCausalGrammar.js`/`heraldJoinMolds.js` (connectives + molds, sub-sentence), or the
   `*News.js` modules' own registries (`sovereigntyNews.js` carries 93 in a `KIND_REGISTRY`).

And one structural miss that changes the reconstruction problem: **more than half the authored
corpus in `docs/content/` has never been wired into `src/` at all** (§3).

---

## 1. THE INSTRUMENTS (state the regex, then the number)

All four live in `scratchpad/prose-research/inventory/`.

**`scan.mjs` — the raw file census.** Walks `src, scripts, api, e2e, foundry-module,
mcp-server, public, tools, supabase, schema` for `.js/.jsx/.mjs/.cjs/.ts/.tsx/.json` and counts
**sentence-shaped string literals** with three per-quote patterns:

```
/'([A-Z{][^'\n]{28,}?[.?!]["’')\]]?)'/g        // single-quoted
/"([A-Z{][^"\n]{28,}?[.?!]["’')\]]?)"/g        // double-quoted (also JSON "text" values)
/`([A-Z{$][^`]{28,}?[.?!]["’')\]]?)`/g         // template literal (may span lines)
```
…minus a code filter `\b(function|const |let |import |export |=>|require\(|console\.|process\.|typeof |return |\.map\(|\.test\()\b`.
**Result: 589 files with ≥3 hits, 19,064 literals** (src 15,835 · supabase 2,425 · scripts 628).
Output: `scan-src.json` / `scan-src.txt`.

**`harvest.mjs` — the export walk (the high-fidelity instrument).** Dynamically imports every
`src/**/*.js` candidate, deep-walks each export, and applies the **sentence-shaped predicate**

```js
s.length >= 30 && /^[A-Z{“"']/.test(s.trim()) && /[.?!]["’')\]]?$/.test(s.trim())
```

Function variants are MATERIALISED: any function of arity ≤ 3 is called with a slot Proxy that
answers both estate idioms — `` (x) => `…${x.settlement}…` `` (property access) and
`` (r) => `…${r}…` `` (the value IS the name) — and an array/object return is walked in turn
(`(r) => string[]`, the `PRESSURE_SENTENCES` shape). **Result: 204 homes, 12,861 sentences,
34 import failures** (all `VITE_SUPABASE_URL` at module load — Supabase-touching modules only,
no prose home among them). Output: `harvest.json`, `harvest.failures.json`.

**`jsxscan.mjs` — the JSX census, using the estate's own extractor**
(`tests/helpers/jsxLiteralWalk.js` → `extractJsxProseSegments` + `extractJsxProseStrings`,
espree, interpolation holes normalised to `{x}`), then the same sentence predicate.
**Result: 527 `.jsx` files scanned, 300 carry prose, 1,455 sentences.** Output: `jsx.json`.

**`srcindex.mjs` + `wired.mjs` — the annex↔src wiring measure.** Indexes EVERY string leaf ≥ 8
chars reachable from every `src/**/*.js` export (1,660 modules, 146 import failures, **28,769
distinct strings**), then matches each annex row against it on a normalised key
(`lowercase · {slot}→{} · curly apostrophes→' · whitespace collapsed`). Annex rows are parsed as
`^(\d+)\. (.+)$` with the angle-tag prefix ``^`\[[^`]*\]`\s*``, the metadata suffix
``(?:\s*·)?\s*`(?:\[[^`]*\]|requiredSlots:[^`]*)`\s*$`` and the trailing italic authoring note
`\s*\*\([^)]*\)\*\s*$` stripped. Output: `srcindex.json`, `wired.json`.

A **prose-shaped** variant of the predicate (`length ≥ 30 && /^[A-Z{]/`, **terminal stop
optional**) is used where a register does not punctuate — history events, plot hooks, service
descriptions. It is always labelled.

---

## 2. THE VOICE BIBLE AND WHAT IT GOVERNS

`docs/VOICE_AND_TONE.md` (239 lines) is the single voice: **"a calm campaign archivist."** Nine
pillars, hard mechanical rules (no em dash, no exclamation point, no emphasis caps, numerals
spelled in diegetic prose and digits in specs, contractions banned on trust surfaces), an
em-dash replacement playbook, and — the part this inventory keys off — **§4's per-surface tone
matrix, 17 surface groups**. Six of those seventeen are DATA registers:

> DATA: NPCs (steady, archival, oral — read aloud) · DATA: Institutions & services (plain
> declarative) · DATA: History & narrative (diegetic chronicle) · DATA: Stress / pressure
> (matter-of-fact spy report) · DATA: Supply chain & economy (documentary fact) · plus the
> Core copy registry, Dossier content tabs, Compendium, Map/Realm, Account/Auth, Admin.

The bible names its own enforcement (§7): `tests/copy/voiceMechanics.test.js` (three tiers —
registries HARD ZERO, `src/data`+`src/domain` string literals SHRINK-ONLY, `.jsx` AST walk
SHRINK-ONLY) and `tests/copy/proseLeak.test.js` (composer-output engine-token leak).

**The annexes name finer registers than the bible does**, and a corpus probe should use theirs:

- **The Herald's three registers** (`RECEIPT_POOLS_CAUSAL.md` §0a): **HEADLINE** (the event plus
  at most one causal gesture; one sentence; multi-link chains FORBIDDEN) · **SUBHEADER** (one
  plain unembellished statement; "the visible honesty anchor") · **TELLING** (the full composed
  chain, banded by CW-2's depth cap). A fourth tier, the cause-walk table, is not prose.
- **The dossier-native register** (`RECEIPT_POOLS_DOSSIER_STATE.md` §0b): present tense, the
  state first and the cause second, one flowing sentence or two short ones, **woven** — it must
  drop into the middle of its section without a seam. Not a headline, not a standfirst.
- **The seven angle tags** (§0b, six inherited + one minted): `[ledger]` the clerk's view ·
  `[street]` the town's own talk · `[visitor]` what a stranger notices · `[elder]` the memory
  frame · `[unfolding]` the movement still running · `[counterforce]` the thing that did NOT
  happen · `[threshold]` **(new)** the band's own edge. Measured distribution over
  `RECEIPT_POOLS_DOSSIER_STATE.md`
  (`grep -oE '^[0-9]+\. \`\[[^]]*\]\`'`, first token before ` · `):
  ledger 604 · street 546 · visitor 336 · unfolding 228 · counterforce 164 · threshold 88 ·
  elder 64. The causal-dossier sibling uses six (no `threshold`).
- **The causal grammar's own angle palette** (`RECEIPT_POOLS_CAUSAL.md`, keyed on typed edges
  not standpoints): gate 87 · plain 78 · charge 63 · succession 51 · origination 51 · answer 42
  · belief 37 · instrument 15 · carriage 13, plus 100+ composite `a → b → c` chain tags.

---

## 3. THE TWO SOURCES OF TRUTH — AND THE 4,941-ROW GAP

`docs/content/` holds **13 annexes, 25,051 lines, 9,327 numbered variant rows**. Only **two** are
machine-projected into `src/data`; the other eleven are hand-transcribed (or not transcribed at
all) into `src/domain`.

**The projection** is `scripts/generate-dossier-state-prose.mjs`:
`RECEIPT_POOLS_DOSSIER_STATE.md` → six desk leaves under `src/data/dossierStateProse/`, and
`RECEIPT_POOLS_CAUSAL_DOSSIER.md` → `src/data/dossierCausalProse.generated.js`. Strict parser:
every `[angle]`-tagged line inside a block region must be consumed or the run throws. Contract
test `tests/data/dossierStateProseProjection.contract.test.js` (`--check`). It also **BINDS
rather than inlines** live engine strings (e.g. `ECONOMY_FRESHNESS_SENTENCES`) so a
canonical-at-zero row does not mint a second home.

**Measured wiring** (`wired.mjs`; "prose" = numbered rows ≥ 20 chars after tag/metadata strip):

| annex | rows | prose | wired into `src/` | % | where it lands |
|---|---:|---:|---:|---:|---|
| RECEIPT_POOLS_DOSSIER_STATE.md | 2050 | 2050 | **2024** | 98.7 | `src/data/dossierStateProse/*` (projected) |
| RECEIPT_POOLS_LEGACY.md | 1498 | 1400 | **1214** | 86.7 | `rumorFallbackPhrasePools` 660, `rumorPhrasePools` 375, `eventProse` 142, `settlementRumors` 36 |
| RECEIPT_POOLS_TRADE.md | 798 | 798 | **151** | 18.9 | `commercialReceiptPools.js` |
| RECEIPT_POOLS_WAR.md | 780 | 778 | **305** | 39.2 | `warReceiptPools.js` (via `eventProse`), `sovereigntyNews.js` |
| RECEIPT_POOLS_CAUSAL.md | 769 | 763 | **8** | 1.0 | `heraldIntegrity.js` only |
| RECEIPT_POOLS_FAITH.md | 744 | 744 | **5** | 0.7 | `faithReceiptPools.js` (ONE kind of 103) |
| RECEIPT_POOLS_POPULATIONS.md | 508 | 508 | **0** | 0 | — |
| RECEIPT_POOLS_INTERIOR.md | 506 | 506 | **0** | 0 | — |
| RECEIPT_POOLS_INFORMATION.md | 490 | 490 | **9** | 1.8 | `informationReceiptPools.js` |
| RECEIPT_POOLS_GRAMMAR.md | 477 | 477 | **86** | 18.0 | `grammarReceiptPools.js` |
| RECEIPT_POOLS_CAUSAL_DOSSIER.md | 473 | 473 | **462** | 97.7 | `dossierCausalProse.generated.js` (projected) |
| RECEIPT_POOLS_COUPLINGS.md | 202 | 202 | **0** | 0 | — |
| RECEIPT_POOLS_CHANCE_MEETING.md | 32 | 32 | **16** | 50.0 | `envoyChanceMeetingReceiptPools.js` |
| **TOTAL** | **9327** | **9221** | **4280** | **46.4** | |

**4,941 authored rows exist only in `docs/content/`.** The estate's own walker says so in its
own words (`tests/lint/kindPoolFloors.walker.test.js`): *"274 tokens the Herald ROUTES have no
phrased pool at all… seven of the eight FP annexes are read by nothing today."* A corpus probe
that reads only `src/` measures the wired half; a probe that reads only `docs/content/` measures
authored intent. **Both are the estate's prose and both must be in scope**, tagged
`wired` / `authored-unwired`.

*(Wiring is matched on normalised text, so a row reworded on the way into `src/` reads as
unwired. Spot-checked in both directions; the two projected annexes' residual misses are the
`0. *(frozen, canonical)*` BOUND rows, which is the projection working as designed.)*

---

## 4. THE REGISTER TABLE (deduplicated by normalised text)

Computed by `registers.mjs`. "strings" is the raw per-home sum; "distinct" collapses re-exports
(e.g. `eventProse.js` re-exports `warReceiptPools.js`, `compendiumData.generated.js` bakes in
`operationRegistry` + `glossary` + `bandLadders`).

| # | register | files | strings | distinct |
|---|---|---:|---:|---:|
| R1 | dossier-native STATE (7 angle tags) | 6 | 2265 | **2265** |
| R2 | dossier-native CAUSAL JOIN | 1 | 468 | **468** |
| R3 | Herald receipt pools (engine-side, seeded, golden-bound) | 14 | 1661 | **1030** |
| R4 | Herald causal grammar + join molds + integrity | 1 | 18 | **17** |
| R5 | Herald crier voice (`newsVoice` + `newsBody`) | 2 | 370 | **370** |
| R6 | NPC cause-conjunction ladder (read-aloud causal receipts) | 14 | 1664 | **1663** |
| R7 | institution + service gazetteer | 4 | 2017 | **2014** |
| R8 | world-data prose (culture, NPC, arrival, history, hooks, stress, spatial) | 13 | 913 | **817** |
| R9 | chrome copy registry (`src/copy`) | 4 | 483 | **477** |
| R10 | compendium docent + glossary + operations | 5 | 829 | **427** |
| R11 | event composer / realm verbs (DM authoring) | 10 | 225 | **196** |
| R12 | treaty + war-status + letter/chronicle documents | 8 | 105 | **89** |
| R13 | certification / audit rows — **DEV-ONLY, not reader-facing** | 17 | 843 | **676** |
| R14 | generators' runtime prose tables | 10 | 323 | **272** |
| R15 | long tail in `src/*.js` | 96 | 718 | **636** |
| R16 | JSX component + PDF-section chrome | 300 | 1455 | **1430** |
| | **TOTAL** | **505** | **14357** | **12847** |

Reader-facing subtotal = total minus R13 = **12,171 distinct**.

**The three largest homes.** By home group: **R1 dossier-native state (2,265)**, **R7
institution gazetteer (2,014)**, **R6 cause-conjunction ladder (1,663)**. By single file:
`src/data/institutionServices.js` **802**, `src/data/dossierStateProse/general.generated.js`
**634**, `src/domain/worldPulse/eventProse.js` **632** (of which 471 are re-exported
`warReceiptPools.js`; net own ≈ 161).

### 4a. Per-home detail

**R1 — dossier-native STATE.** `src/data/dossierStateProse/{general,warFaith,defense,economy,power,stressors}.generated.js`
(634 / 418 / 383 / 328 / 256 / 246). Source of truth: `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`
(the doc IS the source; the JS is a checked-in projection). Shape: JSON-ish frozen object,
`BLOCK → pools → poolKey → [{ angle, text, requiredSlots, audience }]`; `"text"` values carry
`{slot}` braces. Reader-facing: **yes** — mounted via `src/domain/display/stateProse/dossierMounts.js`
into `OverviewTab, EconomicsTab, EconomicsGlance, PowerTab, DefenseTab, WarFaithDesk,
ViabilityTab`. ⚠ Mounted is not the same as SEEN — a mount inside a `collapsible
defaultOpen={false}` Section renders nothing while every mount walker stays green (the estate's
own DESK-VISIBILITY hazard); this inventory establishes the mount, not the sightline. Gates: projection contract test, `dossierMountRegistry.walker`,
`economyReadModelCoverage.walker`, six `*StateProseDesk.test.js`, `stateProseKernel.test.js`,
voiceMechanics tier 2.

**R2 — dossier-native CAUSAL JOIN.** `src/data/dossierCausalProse.generated.js` (468). Source:
`RECEIPT_POOLS_CAUSAL_DOSSIER.md`, 78 join families × 6 angles. Same projection, same shape.
Gates: `causalDossierProse.test.js`, `stateProseKernel.test.js`.

**R3 — Herald receipt pools (ENGINE-SIDE).** `worldPulse/warReceiptPools.js` 471 ·
`commercialReceiptPools.js` 151 · `sovereigntyReceiptPools.js`/`sovereigntyNews.js` 93 ·
`grammarReceiptPools.js` 86 · `data/roadsProse.js` 64 · `data/traditionProse.js` 18 ·
`envoyChanceMeetingReceiptPools.js` 16 · `informationReceiptPools.js` 9 ·
`faithReceiptPools.js` 5 — flattened by `worldPulse/eventProse.js` into `EVENT_PROSE_REGISTRY`.
Shape: **arrow-function variants** `` (x) => `…${x.settlement}…` `` inside per-kind arrays; a
regex probe must materialise them by calling, or template-parse them. Source of truth: the
annexes, hand-transcribed. Reader-facing: **yes** (Herald feed, wizard news, save data).
**This is the golden-bound half**: `eventProse.js`'s own docstring — *"every corpus here feeds a
GENERATION-TIME surface whose picked string PERSISTS into save / golden data… Growing these
pools shifts same-seed picks."* Gates: nine per-program `*KindPools.walker.test.js`, the
estate-wide `kindPoolFloors.walker.test.js`, `eventProse.test.js`, `phraseRepetitionEnvelope.walker`.

**R4 — Herald causal grammar.** `display/heraldCausalGrammar.js` (§0c eight typed edges, §3
sixteen connective pools + two terminals, §0d six time bands — **sub-sentence**, so the
sentence predicate sees only 17 of 159 strings) · `display/heraldJoinMolds.js` (argument-form
frames: `N` noun phrase / `F` finite clause / `V` bare verb / `A` absolute — the F/N split is
"the load-bearing rule of the whole section") · `display/heraldIntegrity.js` (`DISCLOSURE_LINES`).
Source: `RECEIPT_POOLS_CAUSAL.md` §0c/§0d/§3. Gates: `heraldCausalVoice.test.js`,
`heraldContaminationFence.test.js`, `ui/causalityPopup.test.jsx`.

**R5 — the crier's voice.** `display/newsVoice.js` (342: `VOICE_LINES` by
category × bucket, `VOICE_FLOOR` per category) and `display/newsBody.js` (28: `BODY_POOLS`).
Deliberately **settlement-agnostic** ("the town", "the front") — no place name. Pure FNV-1a
selection, lazy-chunk only, never imported by generation. **Not in the chair's probe glob.**
Gates: `domain/newsVoice.test.js`, `phrasedKindPools.walker`, `newsVoiceContract.walker`
(whose `NEWS_VOICE_ADDRESSES` registry lives in `scripts/lib/news-voice-contract.mjs`).

**R6 — the NPC cause-conjunction ladder.** Twelve role files
`display/causeConjunctionRole/{ruler,heir,military,merchant,religious,civic,criminal,arcane,
laborResource,healer,diplomatOutsider,dissident}.js` at 126 each, plus
`causeConjunctionClassContent.js` 126 (role-agnostic, `{role}` slot) and
`causeConjunctionContent.js` 26 (the selection ladder + floor). Register: **read-aloud causal
receipts, band-neutral** — no line may claim an age. Keyed `causeClass × lifecycleStage`.
Side-car law: generation never imports it; read by the lazy dossier NPC card
(`components/new/npcComponents.jsx`) through `causeConjunctionContent.js` /
`causeConjunctionRoleContent.js`, and by `display/discourseKernel.js`. Reader-facing: **yes**. Gates:
`domain/causeConjunctionContent.test.js`, `seedLoopTotality.walker`,
`negativeAssertionAnchor.walker`. **Entirely absent from the chair's probe.**

**R7 — the institution + service gazetteer.** `data/institutionServices.js` 802 (913 prose-shaped)
· `data/institutionDescVariants.js` 626 · `data/institutionalCatalog.js` 304 ·
`display/institutionVocabulary.js` 285. Voice-bible register: **DATA: Institutions & services —
plain declarative**. Shape: nested object records with `desc` fields (catalog/services) and
keyed arrays of variant strings (`INSTITUTION_DESC_VARIANTS['city|Adventuring|Mercenary quarter']`).
`institutionVocabulary.js` is a display side-car (byte-inert to goldens) and IS the source of
truth for itself. `institutionalCatalog.js` / `institutionServices.js` are generation inputs and
therefore **golden-bound**. Gates: `data/institutionVocabulary.test.js` (orphan keys, missing
identity, em dash / `!` / terminal period, moral-martial drift), `serviceCategoryRegistration.walker`,
`property/generatorGoldenMaster.test.js`, voiceMechanics tier 2.

**R8 — world-data prose.** `data/cultureProfiles.js` 165 · `data/npcData.js` 167 sentence-shaped
/ **420 prose-shaped** (traits, quirks, secrets, loyalty tells — many are fragments) ·
`data/narrativeData.js` 181 (`ARRIVAL_SCENES`, `ARRIVAL_ADDONS`, `TERRAIN_NARRATIVE_HOOKS`,
`STRESS_DESCS`, `STRESS_NOTES`; `(r) => …` and `(r, s) => …` closures) ·
`data/spatialData.js` 104/107 · `data/historyData.js` `HISTORICAL_EVENTS_DATA` **170
prose-shaped, 1 sentence-shaped** (no terminal stop — invisible to a sentence regex) ·
`data/historyDescVariants.js` 58 prose-shaped · `data/stressTypes.js` 30 (`crisisHook`,
`viabilityNote` — the bible's "matter-of-fact spy report") · `data/supplyChainData.js` 28 ·
`data/foundingSeeds.js` 17 · `domain/hookThemes.js` 80 (a **closed hook-theme classifier** that
holds authored hook templates as lookup keys — a MIRROR of the hook corpus, not a second author)
· `generators/narrative/settlementOriginProse.js` 41 (`ORIGIN_POOLS`). Reader-facing: **yes**
(dossier tabs, PDF sections, Timeline). Mostly generation inputs ⇒ **golden-bound**.

**R9 — the chrome copy registry.** `src/copy/en.js` 404 sentence-shaped of 851 strings ·
`landing.js` 26/131 · `pricingPage.js` 26/84 · `deityAuthoring.js` 27/57 · `footer.js` 1/12 ·
`support.js` 0/1. `index.js` re-exports `en` (do not double count). Register: the bible's Core
copy registry / Home / Pricing / Account rows. Gate: **voiceMechanics tier 1, HARD ZERO** —
no em dash, no `!` anywhere in these five objects.

**R10 — the compendium docent.** `domain/compendium/generated/compendiumData.generated.js` 395
is a **build artifact** (`scripts/generate-compendium-data.mjs`) that bakes in
`store/operationRegistry.js` 161, `display/glossary.js` 138, `compendium/bandLadders.js` 97
(computed by `buildBandLadders()`), `compendium/catalogData.js` 38 and `institutionalCatalog`.
Distinct after dedup: 427. Freshness-pinned by `tests/docs/compendiumDataFreshness.test.js`.
**A probe must read the sources, not the artifact, or count each sentence twice.**

**R11 — the event composer.** `domain/events/registryProse.js` 41 (per-event `description`),
`domain/events/registry.js` 34, `affordanceManifest.js` 23, `realmManifest.js` 38,
`worldPulse/changeAuthorityPolicy.js` 27, `decisionTier.js` 29. Register: the bible's
"Settlement detail & campaign-state — archival, fact-forward". Reader-facing: **yes** (Event
Composer, cascade preview).

**R12 — documents.** `display/treatyDocument.js` 43, `chronicleReadModel.js` 13,
`chroniclersLetter.js` 2, `defenseDisplay.js` 6, `threatAssessment.js` 5,
`demographicReading.js` 16, `marketPrices.js` 8, `regionWakeReplay.js` 12. Mostly floors and
band vocabularies; the LETTER and the WORLD BOOK compose at runtime (§6).

**R13 — certification rows (DEV-ONLY).** `src/domain/certification/subsystemRows*.js` (17 files,
676 distinct). Sentence-shaped, prose-dense, and **not reader-facing**: they are audit evidence
rows (`aliveness.other`, `invariants[].description`, `invariants[].check`) in an
engineering register, including all-caps emphasis the voice bible forbids on reader surfaces.
**Exclude from any voice corpus; a probe that does not exclude them will report a false
register.** (They ARE in the voiceMechanics tier-2 baseline, which is why they look prose-like.)

**R14 — generators.** `generators/narrativeGenerator.js` 91, `narrativeText.js` 74
(`PRESSURE_SENTENCES`, `POLITICAL_FLAVOR` — `(r) => string[]`, and the only tables that draw
rng at render), `generationReceiptJudgments.js` 61, `safetyProfile.js` 26,
`steps/stepMetadata.js` 22, `power/settlementNarrative.js` 5.

**R16 — JSX chrome.** 1,455 sentences across 300 components. Densest:
`components/HowToUse.jsx` 63, `map/SimulationRulesAxes.jsx` 55, `howto/AboutManifesto.jsx` 44,
`compendium/CatalogTabs.jsx` 39, `admin/AdminUsersPanel.jsx` 29, `legal/TermsPage.jsx` 24.
`src/pdf/sections/*` carries 48 (top: `FaithWar.jsx` 17). Gates: voiceMechanics **tier 3**
(shrink-only, `.voice-mechanics-jsx-baseline.json`; the initial baseline is itself a finding —
396 em dashes and 10 exclamation points already live in components) and proseLeak's JSX arm
(`.prose-leak-jsx-baseline.json`).

### 4b. The SUB-SENTENCE register a sentence regex cannot see

`RECEIPT_POOLS_LEGACY.md`'s R1 half is **subject phrases**, not sentences — "travellers upon the
roads", "a call to arms". Measured with an all-strings walk (≥ 8 chars):

| home | strings | sentence-shaped |
|---|---:|---:|
| `display/rumorFallbackPhrasePools.js` (§4a–d, 66 kinds) | 812 | 0 |
| `display/rumorPhrasePools.js` (§3, widened R1 pools) | 499 | 0 |
| `display/rumorFallbackPhrasePoolsEvents.js` (§4e, 41 kinds) | 266 | 0 |
| `display/settlementRumors.js` `WHAT_PHRASES` (the family head) | 246 | 0 |
| `display/heraldCausalGrammar.js` (connectives, bands) | 159 | 0 |
| **subtotal** | **1,982** | **0** |

This is the whole legacy retrofit — **170 of 170 kinds wired**, per the annex's own status
block — and a sentence-shape probe scores it **zero**. Gates: `rumorPhrasePools.test.js`,
`rumorFallbackPhrasePools.test.js`, `newsSubjectVocabulary.walker`, `heraldRouting.walker`,
`seedLoopTotality.walker`.

---

## 5. PROSE WRITTEN INLINE INSIDE FUNCTIONS — 3,881 strings, no export to walk

File-census count minus export-reachable count, per `src/*.js` file. These are authored,
reader-facing sentences that live as literals inside function bodies, so **only an AST walk
finds them**:

| inline | file | what it is |
|---:|---|---|
| 205 | `generators/npcStructure.js` | NPC `activeGoal` / `activeConstraint` (6 conditions × rank) |
| 168 | `domain/factionRelationshipUpdate.js` | faction-delta `reason` lines |
| 99 | `generators/power/rulingStructure.js` | ruling-structure narration |
| 86 | `worldPulse/stressorGates.js` | birth-gate reasons |
| 67 | `domain/events/factionResponses.js` | faction reaction hooks ("A young acolyte begs the party…") |
| 67 | `data/npcData.js` | (the fragment half of R8) |
| 60 | `generators/power/governanceNarrative.js` | governance narration |
| 60 | `domain/hookEscalation.js` | escalation-clock hook steps |
| 57 | `domain/capacityModel.js` | strain-band readings |
| 52 | `worldPulse/relationshipMemory.js` | relationship memory lines |
| 51 | `domain/causalState.js` · `domain/npcProfile.js` | variable readings · NPC profile lines |
| 47 | `worldPulse/relationshipRulesCore.js` · `generators/structuralValidator.js` | |
| 46 | `domain/explanation.js` · `worldPulse/stressors.js` | |
| 45 | `generators/economy/economicState.js` | |
| 43 | `components/map/heraldWanderers.js` | |
| 41 | `generators/economy/foodBalance.js` | |

(Full list: `inventory/scan-src.json` ∖ `inventory/harvest.json`. The subtraction is approximate
— the two instruments have slightly different reach — but every top row above is confirmed
zero-export by hand.)

---

## 6. HOMES WHOSE PROSE IS GENERATED AT RUNTIME (a different reconstruction problem)

These do not hold authored variants. They **compose** sentences from bands, tokens and typed
facts, so there is nothing to reword: the reconstruction problem is the composition rules, not
the corpus.

- `src/domain/display/stateProse/stateProseKernel.js` — the READER (`readStateProse`,
  `drawVariant`, `eligibleVariants`, `fillSlots`) over R1/R2. Composes nothing itself.
- `src/domain/display/chroniclersLetter.js` + `letterToPlainText` — the Chronicler's Letter:
  diffs the feed since `lastReadTick`, groups and prioritises, renders in house voice. FNV of
  stable ids; no RNG, no clock.
- `src/utils/generateWorldBook.js` (`collectWorldBook`) — the bound-book export, jsPDF
  imperative; two faces (`dm` / `player`).
- `src/domain/display/chronicleGraph.js` (`advanceEntries`), `chronicleReadModel.js`
  (`chronicleForAdvance`), `decreeTracker.js` (`decreesForAdvance`) — the advance report.
- `src/domain/display/humanizeEngineTokens.js` — the token→world-word chokepoint.
- `src/domain/display/causeWalk.js`, `heraldJoinMolds.js` — assemble a chain from receipts +
  connectives + molds at Herald composition time. Nothing is state.
- `src/generators/narrativeText.js` (`PRESSURE_SENTENCES`, `POLITICAL_FLAVOR`) and
  `src/generators/narrativeGenerator.js` — template closures that draw rng **at render**.
- `src/domain/display/settlementRumors.js` `whatPhrase()` — for the 107 unvoiced legacy tokens
  it used to COMPUTE a phrase by de-underscoring an engine token; `rumorFallbackPhrasePools.js`
  exists to replace that computation with authored prose.
- `src/domain/region/wizardNews.js` — the wizard-news record shape and desk vocabulary; carries
  no corpus (the pools live in `worldPulse/*ReceiptPools.js`).
- `src/domain/worldPulse/*News.js` (13 modules: `commercialReasonsNews`, `faithNews`,
  `grammarNews`, `informationNews`, `envoyChanceMeetingNews`, `warCostsNews`, `lineageNews`,
  `dispositionNews`, `treasuryNews`, `warCoalitionNews`, `warRulingsNews`, `distancePricedNews`,
  `envoyNews`) — **projection/routing modules, not corpora.** Verified: zero own variant lines.
  The chair's probe glob `*News.js` therefore hits mostly routers; `sovereigntyNews.js` is the
  exception (it carries `SOVEREIGNTY_KIND_REGISTRY` with pools inline).

---

## 7. THE SEED / POOL LAWS A RECONSTRUCTION MAY NOT BREAK

1. **A POOL'S LENGTH IS A SEED INPUT.** Selection is `hash(seed) % pool.length`. Appending,
   inserting or re-sorting a variant moves every later index and changes what an existing seed
   draws. `rumorPhrasePools.js`: *"ORDER IS LOAD-BEARING… APPEND ONLY — never insert, never
   re-sort."*
2. **CANONICAL-AT-ZERO.** Index 0 of every pool is the canonical phrasing and a falsy seed
   selects it (`eventProse.js` law 2, `roadsProse.js` law 1, `traditionProse.js` law 1). For R1
   subject phrases the canonical line is NOT copied into the pool — it stays in `WHAT_PHRASES`
   and `whatPhrase` prepends it, so the canonical cannot drift from the live line.
3. **THE POOL KEY IS HASHED.** `stateProseKernel.drawVariant` =
   `eligible[avalanche32(fnv1a32(\`${seed}::${blockId}::${poolKey}\`)) % eligible.length]`.
   **Renaming a block id or a pool key re-rolls every draw in it.** (VOICE-1b burned 299 pool-key
   em dashes as a DECLARED one-time shift, free only because the corpus then had zero product
   callers — it has callers now.)
4. **SELECTION IS AVALANCHE-MIXED.** `heraldCausalGrammar.js`: FNV-1a's low bit is a parity, so
   raw `fnv1a32 % pool.length` on a power-of-two pool leaves half the pool unreachable (measured:
   a `% 8` selection reached residues {1,3,5,7} only). Every draw runs
   `avalanche32(fnv1a32(seed))`.
5. **ENGINE-SIDE vs DISPLAY-SIDE.** R3 (`eventProse` + the receipt pools + `roadsProse` +
   `traditionProse`) and R7/R8's generation inputs PERSIST into save/golden data — growing them
   shifts same-seed picks and is a **park-red, goldens-regen-once** surface. R1/R2/R4/R5/R6/R9
   are display-side side-cars that generation never imports and are **byte-inert to every
   golden**. That line decides whether a rewording is free or owner-gated.
6. **FRAMING-NOT-SEMANTICS.** Variants vary phrasing only; interpolated names, counts, causes
   and provenance thread through unchanged.
7. **THE FLOOR.** `kindPoolWalker.js` derives it arithmetically from significance rank:
   routine → 8, notable → 6, major → 4 (`CHRONIC_FLOOR - rank * CADENCE_STEP`). *"A two-variant
   chronic kind is exactly as broken as an unregistered one."* 23 kinds sit on a frozen
   shrink-only backlog at depth exactly five.
8. **NO DIGITS IN DOSSIER-STATE AND CAUSAL PROSE.** Durations render through the six-band time
   vocabulary (`heraldCausalGrammar` §0d), counts through `QUANTITY_BANDS` words (`a few souls`,
   `a dozen or so`). Asserted annex-side and by the desk tests. `lint/proseNumerics.test.js` is a
   separate, estate-wide ban on the engine's float/scalar notation reaching reader prose.
9. **DISPLAY LABELS CAN BE PERSISTED HASH INPUTS.** (Recorded estate hazard: `safetyLabel` /
   `foodLabel` feed `economyInputFingerprint`.) Derive a fingerprint's inputs before declaring
   any wording change text-only.

---

## 8. PROPOSED PROBE PLAN — one probe, six extractors

Run all six, tag every row with `{ home, register, shape, wired|authored-unwired,
readerFacing|dm|dev, goldenBound }`, then dedup on the normalised key
(`lowercase · {slot}→{} · curly apostrophes→' · whitespace collapsed`) so re-exports and build
artifacts count once.

**E1 — GENERATED JSON LEAVES.**
Glob `src/data/dossierStateProse/*.generated.js`, `src/data/dossierCausalProse.generated.js`.
Extract `"text"` values; carry `angle`, `blockId`, `poolKey`, `requiredSlots`, `audience`.
Yield **2,733**. *(This is the chair's existing populations A + B, keep as-is.)*

**E2 — IMPORT-AND-WALK (the workhorse; replaces the regex globs).**
Dynamic-import every `src/**/*.js`, deep-walk exports, materialise function variants with the
dual-mode slot Proxy (property access AND value-as-name) and walk array/object returns. Apply
BOTH predicates and record which fired: `sentence-shaped` and `prose-shaped` (no terminal stop).
Yield **12,861 sentence-shaped** / ~15,400 prose-shaped. Excludes: `src/domain/certification/**`
(dev), `src/domain/compendium/generated/**` (build artifact — read its sources instead),
`src/copy/index.js` (re-export). Handles 34 Supabase-env import failures by falling through to E3.

**E3 — AST LITERAL WALK (inline prose).**
espree over `src/**/*.js` for `Literal` / `TemplateLiteral` nodes inside function bodies that E2
did not reach. Yield **≈ 3,881**. Required for `npcStructure.js`, `factionRelationshipUpdate.js`,
`hookEscalation.js`, `stressorGates.js`, `factionResponses.js`, `rulingStructure.js`.

**E4 — JSX SEGMENTS.**
`tests/helpers/jsxLiteralWalk.js` (`extractJsxProseSegments` + `extractJsxProseStrings`) over
`src/**/*.jsx`, interpolation holes → `{x}`. Yield **1,455**. Tag `register: chrome`; `src/pdf/sections/*`
tags `register: pdf`.

**E5 — ANNEX ROWS (the authored source of truth, wired or not).**
Glob `docs/content/RECEIPT_POOLS_*.md`. Row regex `^(\d+)\. (.+)$`; strip the leading
``` `[angle · tag]` ``` span into an `angle` field, strip trailing ``` `[live, verbatim]` ```,
``` `[merged ← …]` ```, ``` `requiredSlots: […]` ``` and the italic authoring note
`\s*\*\([^)]*\)\*\s*$`. Carry the enclosing `### <kind>` / `# <wave>` headings.
**Route every read through `tests/helpers/receiptAnnex.js`** — it is the estate's one annex
reader, its anchors are line-anchored and asserted to match exactly once, and it follows the
one-kind-one-pool forward into `RECEIPT_POOLS_LEGACY.md`. Yield **9,327 rows / 9,221 prose**.
Join against E2/E3's normalised index to stamp `wired` vs `authored-unwired`.

**E6 — COPY REGISTRIES.**
Import `src/copy/{en,landing,pricingPage,footer,deityAuthoring,support}.js`, walk string values.
Yield **484 sentence-shaped of 1,135 strings**. Tag `register: chrome`, `tier1-hard-zero`.

### What a naive probe gets wrong (all six observed here)

1. **A sentence-shape filter scores the entire subject-phrase register zero** — 1,982 strings in
   the rumor family and `heraldCausalGrammar` (§4b).
2. **A sentence-shape filter misses the unpunctuated registers** — `HISTORICAL_EVENTS_DATA`
   scores 1 of 170; `npcData` scores 167 of 420.
3. **A regex probe misses every function variant** — `warReceiptPools`, `commercialReceiptPools`,
   `roadsProse`, `faithReceiptPools`, `narrativeData` and `PRESSURE_SENTENCES` are all closures.
   (The `(r) => string[]` shape needs the return walked, not just stringified.)
4. **`*News.js` is a router glob, not a corpus glob** — 13 of 14 carry no variants.
5. **Build artifacts double-count** — `compendiumData.generated.js` (395) re-emits
   `operationRegistry` + `glossary` + `bandLadders`; `supabase/functions/_shared/aiGroundingBundle.js`
   (801), `aiCharterBundle.js` (659) and `aiOutputSchemaBundle.js` (642) are
   `scripts/build-edge-shared.mjs` bundles of `src/` modules, freshness-pinned, **2,102 duplicate
   sentences** waiting for an unwary glob. `src/copy/index.js` re-exports `en`.
6. **`src/domain/certification/subsystemRows*.js` is not reader prose** — 676 sentence-shaped
   engineering rows that will skew every voice metric if included.

---

## 9. GATE MAP (which walker already covers which home)

| home | gates |
|---|---|
| `dossierStateProse/*` + `dossierCausalProse` | `data/dossierStateProseProjection.contract`, `lint/dossierMountRegistry.walker`, `lint/economyReadModelCoverage.walker`, six `domain/*StateProseDesk`, `domain/stateProseKernel`, `domain/causalDossierProse` |
| `warReceiptPools` | `lint/warRulingKindPools.walker`, `lint/envoyKindPools.walker`, `lint/warCoalitionKindPools.walker`, `lint/warCostKindPools.walker`, `domain/eventProse` |
| `commercialReceiptPools` | `lint/commercialKindPools.walker` |
| `grammarReceiptPools` | `lint/grammarLifecycleKindPools.walker`, `domain/treatyLifecycleVoice` |
| `sovereigntyReceiptPools` | `lint/sovereigntyKindPools.walker` |
| `informationReceiptPools` | `lint/informationKindPools.walker` |
| `faithReceiptPools` | `lint/faithKindPools.walker` |
| `envoyChanceMeetingReceiptPools` | `lint/chanceMeetingKindPools.walker` |
| ALL registered kind pools | `lint/kindPoolFloors.walker` (estate-wide floor), `lint/phrasedKindPools.walker`, `lint/phraseRepetitionEnvelope.walker` |
| `rumorPhrasePools` / `rumorFallbackPhrasePools(+Events)` / `settlementRumors` | `domain/rumorPhrasePools`, `domain/rumorFallbackPhrasePools`, `domain/settlementRumors`, `lint/newsSubjectVocabulary.walker`, `lint/heraldRouting.walker`, `lint/seedLoopTotality.walker` |
| `newsVoice` | `domain/newsVoice`, `lint/phrasedKindPools.walker`, `lint/lineageKindPools.walker`, `domain/impactKindWalkers`. **NOT** `newsVoiceContract.walker` / `newsHeadlineContract.walker` / `wizardNewsAuthoring.walker` — measured: none of the three references `newsVoice.js`; they police the wizard-news ENTRY shape, not the crier's corpus |
| `heraldCausalGrammar` / `heraldJoinMolds` | `domain/heraldCausalVoice`, `lint/heraldContaminationFence`, `ui/causalityPopup` |
| `causeConjunction*` | `domain/causeConjunctionContent`, `lint/seedLoopTotality.walker`, `lint/negativeAssertionAnchor.walker` |
| `institutionVocabulary` | `data/institutionVocabulary`, `copy/voiceMechanics`, `property/generatorGoldenMaster` |
| `institutionServices` / `institutionalCatalog` | `lint/serviceCategoryRegistration.walker`, `joins/services`, `copy/voiceMechanics` |
| `roadsProse` / `traditionProse` | `copy/voiceMechanics`, `domain/traditionProse`, `domain/impactKindWalkers` |
| `narrativeData` | `joins/arrival`, `generators/narrativeArrival`, `generators/terrainFoundingHooks`, `copy/voiceMechanics` |
| `bandLadders` / compendium | `ui/compendiumBandLadders` (+5 sibling compendium ui tests), `docs/compendiumDataFreshness` |
| `hookEscalation` / `hookThemes` | `domain/hookEscalation`, `domain/hookRetention`, `lint/hookThemeTotality.walker`, `generators/hookThemeDraws` |
| every string in `src/copy` + `src/data` + `src/domain` + `**/*.jsx` | `copy/voiceMechanics` (3 tiers) |
| every reader-facing composer's OUTPUT | `copy/proseLeak` |
| numerals in prose | `lint/proseNumerics` — scans authored headline/summary/reason/receipt templates in `src/**/*.js` plus the full JSX corpus for the engine's float/scalar notation; five independently mutant-proven detector classes, shrink-only baseline `.prose-numerics-baseline.json`. (The annexes' stricter *no digit at all* rule — §0d, durations through the time-band vocabulary, counts through `QUANTITY_BANDS` — is asserted annex-side and by the desk tests, not here.) |

**Ungated by any dedicated walker** (voiceMechanics tier 2 is their only cover):
`causeConjunctionClassContent.js`, `causeConjunctionRole/*` (12 files, 1,512 sentences —
the ladder has a content test but no per-file pool walker), `newsVoice.js` VOICE_LINES depth,
`data/spatialData.js`, `data/stressTypes.js`, `store/operationRegistry.js`, and every inline
home in §5.

---

## 10. ARTEFACTS

| file | what |
|---|---|
| `inventory/scan.mjs` · `scan-src.json` · `scan-src.txt` | raw file census, 589 files |
| `inventory/harvest.mjs` · `harvest.json` · `harvest.txt` · `harvest.failures.json` | export walk, 204 homes / 12,861 sentences, every hit with its export path |
| `inventory/jsxscan.mjs` · `jsx.json` | JSX census, 1,455 sentences |
| `inventory/srcindex.mjs` · `srcindex.json` | 28,769 distinct src strings, the wiring index |
| `inventory/wired.mjs` · `wired.json` | annex ↔ src wiring, per annex |
| `inventory/registers.mjs` · `registers.json` | the deduplicated register table |
| `inventory/chair-probe-rerun.json` | the chair's own probe re-run at this HEAD (3,431 variants) |
