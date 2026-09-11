# PROBE-ALL — every reader-facing prose home in the estate, measured by register

**Lane PROBE-ALL (Opus 5) · read-only · six extractors, twenty register columns.**
Dock `laneDESKINT`, **read at `6b80d1e8e`**; the dock advanced to `460a63bca` mid-run (a sibling's
register car 4). The diff between them is `tests/copy/.voice-mechanics-jsx-baseline.json` **only** —
no `src/`, no `docs/content/`, no `VOICE_AND_TONE.md` — so every figure below holds at both shas.
Dock verified clean after the run (`git status --porcelain` empty, zero untracked). No repo file was
written, no test was run, no vitest was started.

*(That sibling commit is independent confirmation of §5's headline: it banks the JSX voice baseline
to `{}` at the same tip where this probe measures zero em dashes and zero exclamation points in JSX.)*

---

## 0. WHAT THIS MEASURES, AND THE SIX TRAPS IT AVOIDS

The chair's first probe read **3,431** variants from three homes. This one reads **34,508 admitted
prose rows across twenty columns — 30,232 across the nineteen registers, plus a 4,276-row control** — every reader-facing home the inventory named, the Herald
proper end to end, the NPC ladder, the `src/data` gazetteer, the copy registry, and the annex rows
that are authored but wired nowhere, measured as their own column.

| the inventory's trap | how this probe avoids it | receipt |
|---|---|---|
| 1. a sentence-shape filter scores the subject-phrase register **zero** | registers carry a `unit` (`sentence` \| `phrase`); R4 and R17 are admitted at ≥ 8 chars / ≥ 2 words and every rhythm figure is **per segment**, never per sentence | R17 = **1,293** phrases (a sentence filter scores it 0: `terminal-stop share` 0.000) |
| 2. it misses the unpunctuated registers | terminal stop is **never** required for admission; `terminal-stop share` is published as its own row so a column's kind is visible | R8 0.469, R15 0.585, R16 0.604, R10 0.634 |
| 3. a regex probe misses every function variant | X2 materialises functions with a dual-mode slot Proxy and walks array/object returns | **9,700** rows arrived through a function (`fn-array` 8,021 + `fn-template` 1,701) |
| 4. `*News.js` is a router glob, not a corpus glob | registers are assigned by **named file**, never by glob; only `sovereigntyNews.js` is in R3 | R3 = 12 files, named individually |
| 5. build artifacts double-count | `compendium/generated/**`, `copy/index.js`, `copy/pseudo.js`, `sampleDossier*` excluded by path; R10 reads the **sources** | see §1 exclusions |
| 6. certification rows are not reader prose | `src/domain/certification/**` excluded entirely | 17 files, ~676 rows, never entered |

Two further contaminations were found **by audit during this run** and cured, both worth recording:

- **`heraldJoinMolds.UNSUPPLIED_ARGS` is a dev contract-note table** living inside a reader-facing
  module. It supplied **the only two em dashes in R4**. Excluded by export path (`DEV_PATHS`).
- **My own annex stripper missed the `*— canonical-at-zero*` trailer.** Unstripped it produced
  **all four** of the unwired annex's apparent em dashes. With it stripped the annexes carry
  **zero**. The published inventory figure of 9,221 annex "prose" rows likewise includes **106
  numbered LAW rows** (`1. **PER-LINK ENTAILMENT.** …`); this probe excludes them, giving **9,115**.

---

## 1. THE SIX EXTRACTORS — one per extraction shape, with the parser printed

All six live in `scratchpad/prose-research/probe-all/`. Every one writes only to the scratchpad.

### X1 — PROJECTED JSON LEAVES (`x1-json-leaves.mjs`) → **2,734 leaves, 786 pools**
The two machine-projected homes are imported and walked **structurally**, not by line regex, so the
pool key and the angle come out exact:

```js
blockId -> { title, slots, pools: { poolKey: [ { angle, text, slots, audience } ] } }
// only the "text" leaf is prose; the row carries pool = `${blockId} :: ${poolKey}`
```

Homes: `src/data/dossierStateProse/{general,warFaith,defense,economy,power,stressors}.generated.js`,
`src/data/dossierCausalProse.generated.js`.
Angles measured: ledger 763 · street 690 · visitor 481 · unfolding 303 · counterforce 254 ·
elder 140 · threshold 96 · canonical 7.
*(The chair's line-regex probe found 2,732 of these 2,734.)*

### X2 — ARROW-FUNCTION POOLS, `(r) => string[]`, TEMPLATE LITERALS, ARRAYS (`x2-walk.mjs`) → **45,260 string leaves in 1,621 modules**
One import-and-walk covers four of the six shapes, because at runtime they are one traversal. Each
leaf is **tagged with the shape it arrived in**, so the shapes stay separately countable:

```js
// the dual-mode slot stand-in: answers `(x) => `…${x.settlement}…`` AND `(r) => `…${r}…``
const slotProxy = (name) => new Proxy(function () {}, {
  get: (_t, k) => (k === Symbol.toPrimitive || k === 'toString' || k === 'valueOf')
    ? () => `{${name}}` : (typeof k === 'symbol' ? undefined : slotProxy(String(k))),
  has: () => true, apply: () => `{${name}}`,
});
// shape tags
fn-array     r = v(slotProxy…) returned an array/object, walked in turn   → 8,021   the `(r) => string[]` shape
fn-template  r is a string containing a materialised {slot}               → 1,701   `(x) => `…${x.settlement}…``
fn-plain     r is a string with no slot                                   →   181
slot-string  a plain string leaf carrying literal {slot} braces           → 2,530
array-string a plain string leaf at an array index                        → 16,943
object-string a plain string leaf at an object key (`desc`, `reading`, …) → 15,884
```
A function is called only if `v.length <= 3`, source `< 4000` chars, not a class, not `async`, and
free of an I/O denylist (`writeFile|fs\.|localStorage|fetch\(|document\.|window\.|Math\.random|new Date|…`)
— the dock came out byte-identical, verified.
**145 import failures**, 133 of them `VITE_SUPABASE_*` at module load; **no prose home among them**
(none in `data/`, `copy/`, `display/`, `worldPulse/`, `generators/`), and X5 covers them anyway.

### X3 — INLINE IN-FUNCTION PROSE (`x5-inline.mjs`, espree) → **19,329 in-function literals**
The estate's own parser dependency, over all 1,660 `src/**/*.js`, **0 parse failures**. A literal
counts only when its nearest enclosing scope is a function (a module-level table belongs to X2):

```js
FN = {FunctionDeclaration, FunctionExpression, ArrowFunctionExpression}   // scope stack non-empty
Literal(typeof value === 'string')            // minus ImportDeclaration and non-computed Property KEYS
TemplateLiteral                               // quasis joined with the interpolation hole as {x}
```
Deduped against X2 by normalised key, **5,673 survive as R18** — prose with no export to walk.

### X4 — JSX SEGMENTS (`x7-jsx.mjs`) → **12,809 segments in 525 of 527 files, 0 parse failures**
Routed through the **estate's own** extractor, not a private one:
`tests/helpers/jsxLiteralWalk.js` → `walkJsxFiles` + `extractJsxProseSegments` +
`extractJsxProseStrings`, with `INTERPOLATION_HOLE` normalised to `{x}`.

### X5 — ANNEX ROWS BY THE NUMBERED-LINE GRAMMAR (`x6-annex.mjs`) → **9,327 rows → 9,115 prose**
```
row     ^(\d+)\. (.+)$
LAW     ^\*\*                                          EXCLUDED — a numbered law, not a variant (106)
angle   ^`\[([^`]*)\]`\s*                              captured into an `angle` field
meta    (?:\s*·)?\s*`(?:\[[^`]*\]|requiredSlots:[^`]*)`\s*$      stripped, repeatedly
note    \s*\*(?:\([^)]*\)|—[^*]*)\*\s*$                stripped — BOTH forms; the second carries the em dash
head    ^(#{1,6})\s+(.+?)\s*$                          h2 -> section, h3+ -> kind (the pool key)
fence   ^```                                           skipped
floor   body.length >= 20                              (106 rows below it)
```
Wired/unwired is stamped by joining the normalised key
(`lowercase · {slot}→{} · curly apostrophes→' · whitespace collapsed`) against an index built from
**X2 ∪ X3 ∪ X4** — a strict superset of the inventory's export-only `srcindex`.
**4,289 wired (47.1%), 4,826 authored-unwired.**

| annex | rows | law | short | prose | wired | % |
|---|---:|---:|---:|---:|---:|---:|
| RECEIPT_POOLS_DOSSIER_STATE.md | 2050 | 11 | 0 | 2039 | 2024 | 99.3 |
| RECEIPT_POOLS_LEGACY.md | 1498 | 24 | 98 | 1376 | 1214 | 88.2 |
| RECEIPT_POOLS_TRADE.md | 798 | 8 | 0 | 790 | 151 | 19.1 |
| RECEIPT_POOLS_WAR.md | 780 | 7 | 2 | 771 | 306 | 39.7 |
| RECEIPT_POOLS_CAUSAL.md | 769 | 14 | 6 | 749 | 8 | 1.1 |
| RECEIPT_POOLS_FAITH.md | 744 | 8 | 0 | 736 | 5 | 0.7 |
| RECEIPT_POOLS_POPULATIONS.md | 508 | 0 | 0 | 508 | 0 | 0.0 |
| RECEIPT_POOLS_INTERIOR.md | 506 | 8 | 0 | 498 | 2 | 0.4 |
| RECEIPT_POOLS_INFORMATION.md | 490 | 7 | 0 | 483 | 9 | 1.9 |
| RECEIPT_POOLS_GRAMMAR.md | 477 | 14 | 0 | 463 | 86 | 18.6 |
| RECEIPT_POOLS_CAUSAL_DOSSIER.md | 473 | 5 | 0 | 468 | 462 | 98.7 |
| RECEIPT_POOLS_COUPLINGS.md | 202 | 0 | 0 | 202 | 0 | 0.0 |
| RECEIPT_POOLS_CHANCE_MEETING.md | 32 | 0 | 0 | 32 | 16 | 50.0 |
| **TOTAL** | **9327** | **106** | **106** | **9115** | **4289** | **47.1** |

### X6 — COPY REGISTRIES
Not a separate instrument: `src/copy/{en,landing,pricingPage,footer,deityAuthoring,support}.js` are
plain module exports, so X2 reads them, and `index.js` (a re-export of `en`) and `pseudo.js` (the
pseudo-localisation harness) are excluded by path. R9 = **619** admitted rows over 4 files.

### THE ADMISSION PREDICATE (printed, because every N depends on it)

```js
const mask = (s) => s.replace(/\{[^}]*\}/g, '{}');   // slots masked FIRST: {timeband_since} is not snake_case
admit(text, unit) =
  unit === 'phrase' ? (len >= 8  && words >= 2)      // R4, R17 — their own unit is a sub-sentence phrase
                    : (len >= 20 && words >= 4)      // the annexes' own >= 20 floor
  && /[a-z]/.test(m)                                 // rejects SCREAMING_KEYS
  && !NOISE.some(r => r.test(m));

NOISE = [ /::/,  /\s[·×→|]\s/,  /^[A-Z]{2,}-[A-Z]{2,}-\d/,  /\b[a-z][a-z0-9]*[A-Z]/,  /[_<>]/,
          /https?:\/\//,  /\.(js|jsx|mjs|json|md|css|svg|png)\b/,
          /\b(function|const|return|typeof|undefined|null|NaN|Infinity)\b/,
          /^[^A-Za-z"“'({]/,
          /\b(repeat|minmax|calc|linear-gradient|radial-gradient|translate[XYZ]?|scale|rgba?|hsla?|var|url|clamp)\s*\(/,
          /\d\s*(px|rem|em|vh|vw|fr|ms|deg)\b/ ];
```
**34,508 admitted, 41,369 rejected**, then deduplicated within each register on the normalised key.
A stratified 60-row-per-register reject sample is kept at `corpus.rejected.json` so every column's
screen is auditable. The floor is a real limit and is stated as one: a two-word reader fragment
("Sealed. Filed.") is below it, which is why §5's mechanical audit is run **without** the floor.

### EXCLUDED, AND WHY

| excluded | why |
|---|---|
| `src/domain/certification/subsystemRows*.js` (17 files, ~676 rows) | dev-only audit evidence in an engineering register, all-caps included; the inventory's R13. Skews every voice metric. |
| `src/domain/compendium/generated/compendiumData.generated.js` (395) | build artifact that re-emits `operationRegistry` + `glossary` + `bandLadders`; R10 reads the **sources** instead |
| `supabase/functions/_shared/ai{Grounding,Charter,OutputSchema}Bundle.js` (801 + 659 + 642) | `scripts/build-edge-shared.mjs` bundles of `src/` modules — **2,102 duplicate sentences**. The walk never leaves `src/`, so they cannot enter. |
| `src/copy/index.js` · `src/copy/pseudo.js` | a re-export of `en`; and the pseudo-localisation harness |
| `src/data/sampleDossier*` | fixture payloads, not authored corpus |
| `**/*.test.js`, `__mocks__` | test scaffolding |
| `heraldJoinMolds.UNSUPPLIED_ARGS`, `MOLD_NOTES` | dev contract notes inside a reader-facing module (found by audit; see §0) |
| **code comments everywhere** | the bible scopes its own rules to "text the reader sees": `src/` holds 26,170 em dashes, essentially all of them in comments, and no extractor here reads a comment |

---

## 2. THE REGISTER ROSTER (the columns of §3's table)

| id | register | unit | n | files | homes |
|---|---|---|---:|---:|---|
| R1 | dossier-native STATE (7 angle tags) | sentence | 2262 | 6 | `data/dossierStateProse/*.generated.js` |
| R2 | dossier-native CAUSAL JOIN | sentence | 467 | 1 | `data/dossierCausalProse.generated.js` |
| R3 | Herald receipt pools (engine-side, **golden-bound**) | sentence | 1212 | 12 | `worldPulse/{war,commercial,sovereignty,grammar,information,faith,envoyChanceMeeting}ReceiptPools.js`, `sovereigntyNews.js`, `eventProse.js`, `generosityNews.js`, `data/{roadsProse,traditionProse,traditionCorpus}.js` |
| R4 | Herald causal grammar + join molds | **phrase** | 133 | 2 | `display/heraldCausalGrammar.js`, `display/heraldJoinMolds.js` |
| R4b | Herald disclosure + cause-lifecycle sentences | sentence | 50 | 3 | `display/{heraldIntegrity,heraldCausalVoice,causeWalk,causeLifecycleVocabulary}.js` |
| R5 | Herald crier voice | sentence | 373 | 2 | `display/newsVoice.js`, `display/newsBody.js` |
| R6 | NPC cause-conjunction ladder (read aloud) | sentence | 1659 | 14 | `display/causeConjunctionRole/*` (12) + `causeConjunctionClassContent.js` + `causeConjunctionContent.js` |
| R7 | institution + service gazetteer | sentence | 2169 | 6 | `data/{institutionServices,institutionDescVariants,institutionalCatalog,institutionLadders}.js`, `display/institutionVocabulary.js`, `domain/institutions/institutionCatalog.js` |
| R8 | world-data prose (culture, NPC, arrival, history, stress, spatial) | sentence | 1738 | 17 | `data/{cultureProfiles,npcData,narrativeData,spatialData,stressTypes,historyData,historyDescVariants,supplyChainData,foundingSeeds,biomeTexture,geographyData,powerData,resourceData,…}.js`, `domain/hookThemes.js`, `generators/narrative/settlementOriginProse.js` |
| R9 | chrome copy registry | sentence | 619 | 4 | `src/copy/{en,landing,pricingPage,deityAuthoring,footer,support}.js` |
| R10 | compendium docent + glossary + operations | sentence | 505 | 4 | `store/operationRegistry.js`, `display/glossary.js`, `compendium/{catalogData,bandLadders}.js` |
| R11 | event composer / realm verbs (DM authoring) | sentence | 216 | 10 | `domain/events/*`, `worldPulse/{changeAuthorityPolicy,decisionTier,partyImpact*,realmManifest,affordanceManifest}.js` |
| R12 | treaty / war-status / letter documents | sentence | 108 | 7 | `display/{treatyDocument,chronicleReadModel,chroniclersLetter,threatAssessment,defenseDisplay,demographicReading,marketPrices,regionWakeReplay,…}.js` |
| R14 | generators' runtime prose tables | sentence | 561 | 11 | `src/generators/**` |
| R15 | long tail elsewhere in `src/**/*.js` | sentence | 3883 | 233 | catch-all; **heterogeneous** — real reader prose (`tradeGoodsData`, `worldPulse/index`) mixed with design-token and dev strings |
| R16 | JSX component + PDF-section chrome | sentence | 2685 | 361 | `src/**/*.jsx` incl. `src/pdf/sections/*` |
| R17 | legacy rumor **SUBJECT PHRASES** | **phrase** | 1293 | 3 | `display/{rumorPhrasePools,rumorFallbackPhrasePools,rumorFallbackPhrasePoolsEvents,settlementRumors}.js` |
| R18 | inline in-function prose (no export to walk) | sentence | 5673 | 546 | 546 files; densest `generators/power/*`, `factionRelationshipUpdate`, `hookEscalation`, `stressorGates`, `capacityModel` — **heterogeneous** |
| **A-U** | **annex rows UNWIRED** (authored, wired nowhere) | sentence | **4626** | 11 | `docs/content/RECEIPT_POOLS_*.md` |
| A-W | annex rows wired (control column) | sentence | 4276 | 11 | the same annexes, rows that DO reach `src/` |

`R13` (certification) is absent by design. `A-W` is a control, not a register: its content is
R1/R2/R3's content seen from the source side, and it is excluded from every median in §6.

---

## 3. (a) THE TABLE — rows are metrics, columns are registers

Rates are **per variant** unless the name says `/ segment`. `segments / variant` and
`terminal-stop share` tell you what kind of column you are reading: a value of `1.000` and `0.000`
respectively (R4, R17) is a **phrase** register, and its "words/segment" is words per phrase.
`BIBLE` is the voice bible's own exemplar corpus (§5), n=67.

| metric | R1 (n=2262) | R2 (n=467) | R3 (n=1212) | R4 (n=133) | R4b (n=50) | R5 (n=373) | R6 (n=1659) | R7 (n=2169) | R8 (n=1738) | R9 (n=619) | R10 (n=505) | R11 (n=216) | R12 (n=108) | R14 (n=561) | R15 (n=3883) | R16 (n=2685) | R17 (n=1293) | R18 (n=5673) | A-U (n=4626) | A-W (n=4276) | BIBLE (n=67) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N variants (deduped) | 2262 | 467 | 1212 | 133 | 50 | 373 | 1659 | 2169 | 1738 | 619 | 505 | 216 | 108 | 561 | 3883 | 2685 | 1293 | 5673 | 4626 | 4276 | 67 |
| files | 6 | 1 | 12 | 2 | 3 | 2 | 14 | 6 | 17 | 4 | 4 | 10 | 7 | 11 | 233 | 354 | 3 | 546 | 11 | 11 | 1 |
| unit | sentence | sentence | sentence | phrase | sentence | sentence | sentence | sentence | sentence | sentence | sentence | sentence | sentence | sentence | sentence | sentence | phrase | sentence | sentence | sentence | sentence |
| segments | 2909 | 530 | 1418 | 133 | 60 | 396 | 1689 | 3245 | 2226 | 972 | 665 | 271 | 126 | 1038 | 4889 | 3944 | 1293 | 6817 | 5274 | 5033 | 67 |
| segments / variant | 1.286 | 1.135 | 1.17 | 1 | 1.2 | 1.062 | 1.018 | 1.496 | 1.281 | 1.57 | 1.317 | 1.255 | 1.167 | 1.85 | 1.259 | 1.469 | 1 | 1.202 | 1.14 | 1.177 | 1 |
| terminal-stop share | 1 | 1 | 0.847 | 0 | 0.78 | 1 | 1 | 0.935 | 0.469 | 0.819 | 0.634 | 0.819 | 0.852 | 0.872 | 0.588 | 0.615 | 0 | 0.66 | 0.993 | 0.748 | 0.881 |
| slot-bearing share | 0.777 | 0.953 | 0.578 | 0.135 | 0.5 | 0.032 | 0.058 | 0 | 0.109 | 0.071 | 0 | 0.194 | 0.083 | 0.289 | 0.083 | 0.171 | 0.012 | 0.441 | 0.754 | 0.556 | 0 |
| 1-segment share | 0.718 | 0.872 | 0.832 | 1 | 0.8 | 0.938 | 0.983 | 0.58 | 0.783 | 0.538 | 0.739 | 0.787 | 0.852 | 0.431 | 0.783 | 0.651 | 1 | 0.839 | 0.878 | 0.826 | 1 |
| 2-segment share | 0.279 | 0.122 | 0.167 | 0 | 0.2 | 0.062 | 0.016 | 0.35 | 0.166 | 0.37 | 0.214 | 0.171 | 0.13 | 0.348 | 0.182 | 0.264 | 0 | 0.131 | 0.107 | 0.172 | 0 |
| 3+-segment share | 0.004 | 0.006 | 0.002 | 0 | 0 | 0 | 0.001 | 0.069 | 0.052 | 0.092 | 0.048 | 0.042 | 0.019 | 0.221 | 0.036 | 0.085 | 0 | 0.031 | 0.015 | 0.003 | 0 |
| words/segment mean | 16.8 | 28.6 | 12.2 | 4.8 | 9.6 | 16.4 | 22.6 | 8.8 | 10.7 | 7.7 | 8.5 | 9.3 | 10.6 | 10.9 | 9.1 | 8.1 | 7.5 | 9 | 15 | 15.7 | 8.1 |
| words/segment sd | 7.2 | 9.4 | 5 | 1.6 | 4.4 | 4.7 | 4 | 4.9 | 5.5 | 4.7 | 5.8 | 6.5 | 5.3 | 8.1 | 6.4 | 5.9 | 2.1 | 4.6 | 6.8 | 8.6 | 6.9 |
| words/segment p10 | 7 | 14 | 6 | 3 | 4 | 8 | 19 | 4 | 5 | 3 | 4 | 4 | 4 | 3 | 4 | 4 | 5 | 4 | 7 | 6 | 2 |
| words/segment p50 | 17 | 30 | 12 | 5 | 9 | 18 | 22 | 8 | 10 | 6 | 7 | 7 | 10 | 8 | 7 | 6 | 7 | 8 | 15 | 14 | 6 |
| words/segment p90 | 26 | 40 | 19 | 7 | 15 | 21 | 28 | 16 | 17 | 14 | 17 | 17 | 18 | 23 | 17 | 15 | 10 | 15 | 21 | 27 | 17 |
| share segments < 8 words | 0.13 | 0.017 | 0.204 | 0.947 | 0.383 | 0.078 | 0.005 | 0.472 | 0.289 | 0.616 | 0.555 | 0.502 | 0.381 | 0.46 | 0.507 | 0.599 | 0.512 | 0.464 | 0.114 | 0.179 | 0.642 |
| share segments > 30 words | 0.021 | 0.491 | 0.001 | 0 | 0 | 0 | 0.042 | 0.001 | 0.008 | 0.001 | 0.005 | 0.015 | 0 | 0.039 | 0.009 | 0.007 | 0 | 0.003 | 0.027 | 0.063 | 0.015 |
| antithesis SHAPE rate | 0.139 | 0.077 | 0.012 | 0 | 0 | 0.005 | 0.007 | 0.019 | 0.025 | 0.024 | 0.018 | 0.042 | 0.009 | 0.052 | 0.024 | 0.023 | 0.016 | 0.025 | 0.019 | 0.082 | 0.045 |
| "rather than" rate | 0.113 | 0.071 | 0.002 | 0 | 0 | 0 | 0 | 0.008 | 0.007 | 0 | 0.004 | 0.009 | 0 | 0.011 | 0.008 | 0.004 | 0.015 | 0.011 | 0.009 | 0.067 | 0.015 |
| gloss tail ", which" rate | 0.066 | 0.054 | 0.034 | 0 | 0 | 0 | 0.007 | 0.003 | 0.01 | 0.003 | 0 | 0 | 0 | 0.052 | 0.011 | 0.004 | 0.001 | 0.006 | 0.062 | 0.048 | 0 |
| 2nd-sentence summary rate | 0.035 | 0.021 | 0.016 | 0 | 0 | 0.003 | 0.001 | 0.031 | 0.017 | 0.019 | 0.063 | 0 | 0 | 0.02 | 0.008 | 0.024 | 0 | 0.007 | 0.022 | 0.023 | 0 |
| triad-list rate | 0.011 | 0.056 | 0.012 | 0 | 0.04 | 0.011 | 0.055 | 0.075 | 0.066 | 0.027 | 0.028 | 0.009 | 0.009 | 0.077 | 0.047 | 0.032 | 0 | 0.006 | 0.009 | 0.014 | 0.03 |
| doubled-adjective rate | 0.009 | 0.011 | 0.002 | 0 | 0 | 0.003 | 0.007 | 0.023 | 0.009 | 0.002 | 0.008 | 0 | 0.019 | 0.018 | 0.011 | 0.003 | 0.009 | 0.007 | 0.008 | 0.01 | 0 |
| participial-opener rate | 0.012 | 0.002 | 0.008 | 0.008 | 0 | 0 | 0 | 0.021 | 0.018 | 0.014 | 0.006 | 0.011 | 0.016 | 0.014 | 0.017 | 0.028 | 0.009 | 0.015 | 0.006 | 0.009 | 0.03 |
| "There/It is" opener rate | 0.051 | 0.019 | 0.02 | 0 | 0 | 0.008 | 0.11 | 0.004 | 0.013 | 0 | 0.002 | 0 | 0.032 | 0.02 | 0.004 | 0.006 | 0.002 | 0.005 | 0.038 | 0.033 | 0 |
| semicolon rate | 0.17 | 0.36 | 0.136 | 0 | 0.26 | 0.198 | 0.54 | 0.015 | 0.055 | 0.053 | 0.133 | 0.13 | 0.176 | 0.102 | 0.074 | 0.053 | 0 | 0.079 | 0.187 | 0.151 | 0 |
| colon rate | 0.072 | 0.364 | 0.066 | 0 | 0.28 | 0.029 | 0.138 | 0.051 | 0.071 | 0.057 | 0.036 | 0.116 | 0.102 | 0.178 | 0.079 | 0.101 | 0 | 0.119 | 0.102 | 0.083 | 0.119 |
| question rate | 0 | 0 | 0 | 0 | 0 | 0.005 | 0 | 0 | 0.001 | 0.034 | 0 | 0 | 0 | 0 | 0.005 | 0.021 | 0 | 0.003 | 0 | 0 | 0.015 |
| parenthesis rate | 0.006 | 0.011 | 0.001 | 0 | 0.02 | 0 | 0.001 | 0.016 | 0.047 | 0.036 | 0.03 | 0.222 | 0.009 | 0.061 | 0.062 | 0.091 | 0 | 0.064 | 0.006 | 0.004 | 0.09 |
| abstract-noun closer rate | 0.044 | 0.028 | 0.038 | 0.008 | 0.033 | 0.02 | 0.078 | 0.086 | 0.084 | 0.057 | 0.114 | 0.122 | 0.04 | 0.091 | 0.095 | 0.068 | 0.029 | 0.092 | 0.029 | 0.038 | 0.06 |
| pronoun closer rate | 0.133 | 0.125 | 0.077 | 0.128 | 0.067 | 0.045 | 0.059 | 0.028 | 0.05 | 0.038 | 0.024 | 0.026 | 0.056 | 0.022 | 0.025 | 0.035 | 0.053 | 0.037 | 0.123 | 0.114 | 0.015 |
| adverbs / segment | 0.163 | 0.13 | 0.044 | 0.008 | 0 | 0.109 | 0.09 | 0.05 | 0.148 | 0.037 | 0.048 | 0.048 | 0.127 | 0.113 | 0.057 | 0.058 | 0.036 | 0.082 | 0.054 | 0.12 | 0.03 |
| em dashes (count) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 1 | 0 | 1 | 71 | 0 | 0 | 44 | 0 | 0 | 0 |
| exclamations (count) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| emphasis-caps rate | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.001 | 0.016 | 0 | 0.042 | 0 | 0.002 | 0.049 | 0.009 | 0 | 0.02 | 0 | 0 | 0 |
| digits-in-prose rate | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.03 | 0.003 | 0.032 | 0.111 | 0.014 | 0.009 | 0.039 | 0.054 | 0.019 | 0 | 0.012 | 0 | 0 | 0 |
| contraction rate | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.004 | 0.048 | 0.05 | 0 | 0 | 0.019 | 0.029 | 0.012 | 0.022 | 0 | 0.009 | 0 | 0 | 0 |
| "the PCs" (count) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| AI lexical tells / variant (raw) | 0.008 | 0.015 | 0.006 | 0 | 0.02 | 0.024 | 0.006 | 0.009 | 0.013 | 0.102 | 0.057 | 0.019 | 0.009 | 0.014 | 0.022 | 0.084 | 0.008 | 0.026 | 0.015 | 0.007 | 0.015 |
| AI tells / variant EXOGENOUS | 0.004 | 0.013 | 0.004 | 0 | 0.02 | 0.024 | 0.006 | 0.009 | 0.013 | 0.003 | 0.002 | 0.009 | 0.009 | 0.014 | 0.008 | 0.007 | 0.002 | 0.011 | 0.004 | 0.003 | 0 |
| Juzek&Ward forms (count, raw) | 7 | 1 | 2 | 0 | 0 | 0 | 0 | 2 | 1 | 34 | 22 | 2 | 0 | 1 | 40 | 164 | 7 | 72 | 51 | 16 | 0 |
| Juzek&Ward forms EXOGENOUS (count) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| rationed pet words / variant | 0.536 | 0.713 | 0.176 | 0.06 | 0.08 | 0.174 | 0.291 | 0.069 | 0.128 | 0.094 | 0.03 | 0.079 | 0.176 | 0.246 | 0.08 | 0.106 | 0.101 | 0.095 | 0.287 | 0.411 | 0.06 |
| pools with 2+ variants | 708 | 78 | 127 | 8 | 11 | 58 | 554 | 315 | 231 | 4 | 0 | 0 | 6 | 15 | 193 | 297 | 174 | 444 | 668 | 436 | 4 |
| mean pool size | 3.2 | 6 | 3.6 | 3.3 | 3.3 | 6.4 | 2 | 2 | 3.3 | 4.5 | 0 | 0 | 4 | 5 | 2.9 | 8.8 | 6 | 12.5 | 6.9 | 9.8 | 16.8 |
| pools uniform in segment count | 0.576 | 0.513 | 0.843 | 1 | 0.455 | 0.672 | 0.955 | 0.714 | 0.892 | 1 |  |  | 1 | 0.4 | 0.907 | 0.242 | 1 | 0.653 | 0.479 | 0.727 | 1 |
| pools w/ repeated 2-word opener | 0.112 | 0.231 | 0.126 | 0 | 0 | 0.224 | 0.002 | 0.003 | 0.048 | 0 |  |  | 0.667 | 0.133 | 0.13 | 0.478 | 0.006 | 0.583 | 0.183 | 0.218 | 0.25 |
| mean within-pool word sd | 2.9 | 5.1 | 2.1 | 0.6 | 2.1 | 1.3 | 1.5 | 1.2 | 1.5 | 0.9 |  |  | 1.1 | 4.8 | 1.2 | 5.8 | 1.5 | 2.9 | 4 | 2.9 | 6.5 |

---

## 4. (b) THE TOP TEN HOUSE TICS PER REGISTER

Mined, not assumed: every 2-to-4-gram in a register is scored by **lift** against its rate in
the rest of the src-side corpus, and a gram qualifies only if it recurs in **three or more
distinct pools** — a phrase living in one pool is that pool's subject, not the register's habit.
Overlapping grams are collapsed to one row per phrase family. Read the lift as "this register
says it N times more often than the rest of the estate does"; a high lift on a setting noun
("market roads") is vocabulary, on a frame ("it is public that") it is a tic.

### R1 — dossier-native STATE (n=2262)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 23 | 1.0% | 484.8 | `combination at` | No combination at {settlement} holds enough of the hall to govern it; every decision must be assembled separately, and… |
| 18 | 0.8% | 381.7 | `is arranged` | A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place… |
| 15 | 0.7% | 319.8 | `very little` | Very little reaches {settlement} out of the wild country, and the reason is that the arrangements are visible from a l… |
| 14 | 0.6% | 299.2 | `town at {}` | A stranger sees an ordinary defended town at {settlement}: enough on the walls to be serious, not enough to be reassur… |
| 13 | 0.6% | 278.5 | `{} and the town` | Nothing threatens {settlement} and the town is at full strength anyway, which is a choice somebody made and is still p… |
| 12 | 0.5% | 257.9 | `at {} is not` | Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on … |
| 12 | 0.5% | 257.9 | `the town has stopped` | The town has stopped being able to pay for its own defense and has not yet stopped having one, and the gap between tho… |
| 27 | 1.2% | 189.1 | `the town does` | The town does not spend much time thinking about being attacked, and the reason is not complacency. The arrangements a… |
| 27 | 1.2% | 189.1 | `the combination` | The town is carrying several pressures together at {settlement}, and it is the combination rather than any single one … |
| 11 | 0.5% | 237.3 | `and finds` | A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country… |

### R2 — dossier-native CAUSAL JOIN (n=467)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 16 | 3.4% | 1772.7 | `old hands` | The old hands at {settlement} measure a full granary against a year none of them chose: the tribute has gone out throu… |
| 10 | 2.1% | 1128.1 | `hands at {}` | The old hands at {settlement} measure a full granary against a year none of them chose: the tribute has gone out throu… |
| 6 | 1.3% | 698.3 | `older hands` | The rite at {settlement} and the rite at {counterpart} have been one rite through {timeband_span}; nothing sacred has … |
| 5 | 1.1% | 590.9 | `for all that` | {settlement}'s own altars stand as they stood, for all that the town took the field and took {counterpart}: no banner … |
| 5 | 1.1% | 590.9 | `the picture` | The lean years turned {settlement}'s court toward {counterpart}'s valley and have not turned it back; what carries the… |
| 5 | 1.1% | 590.9 | `the column that` | {settlement} has {band} more mouths than its last count and the {good} carts come oftener than the road was built for;… |
| 5 | 1.1% | 590.9 | `no clerk` | The war {settlement} fought over a creek nobody at its court had seen is closed, and its own opening receipt names a m… |
| 4 | 0.9% | 483.5 | `all that the` | {settlement}'s own altars stand as they stood, for all that the town took the field and took {counterpart}: no banner … |
| 4 | 0.9% | 483.5 | `a term and` | {settlement} owes the {good} under a term and has never once been short of it: what the clause takes sits well above t… |
| 4 | 0.9% | 483.5 | `{} remember` | The old hands at {settlement} remember when a shared rite was only a shared rite; it has been the working part of the … |

### R3 — Herald receipt pools (n=1212)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 9 | 0.7% | 382.1 | `free of` | {npc} is free of {captor} at last, and turns for {home}. |
| 9 | 0.7% | 382.1 | `settlers have` | {debit} settlers have raised the steading of {name} on the new {resource} workings. |
| 8 | 0.7% | 341.9 | `{} rides` | {npc} rides out of {home}, bound for {dest} |
| 8 | 0.7% | 341.9 | `{} near` | Brigands waylay {npc} near {dest} |
| 8 | 0.7% | 341.9 | `the sheet` | The sheet was read aloud in council, and the council heard one man's account of another court. |
| 6 | 0.5% | 261.4 | `{}'s ransom` | Adventurers settle {npc}'s ransom to {captor} |
| 6 | 0.5% | 261.4 | `{}'s envoy` | {dest} hears out {home}'s envoy |
| 6 | 0.5% | 261.4 | `now leans` | {settlement}'s martial temper now leans {lean}; resolved contests changed the lesson. |
| 6 | 0.5% | 261.4 | `and its allies'` | {name} has finished rebuilding in the year {year}, its wounds closed by its own hands and its allies'.{built}{graft} |
| 5 | 0.4% | 221.2 | `envoy of` | An envoy of {home}, {npc}, is abroad toward {dest} on {purpose} business. |

### R4 — Herald causal grammar + molds (n=133)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 4 | 3.0% | 114.1 | `and it was` | and it was paid for when |
| 4 | 3.0% | 114.1 | `when {}` | the turning when {clause} |
| 5 | 3.8% | 53.6 | `it came` | and it came after |
| 5 | 3.8% | 32.2 | `that {}` | the truth that {clause} |
| 6 | 4.5% | 7 | `on a` | on a grudge as old as |
| 4 | 3.0% | 3.6 | `out of` | out of a memory of |
| 5 | 3.8% | 1.6 | `on the` | on the heels of |
| 14 | 10.5% | 0.9 | `and the` | and the town has not let go of |
| 4 | 3.0% | 1.2 | `it is` | and it is remembered still that |

### R4b — Herald disclosure + lifecycle (n=50)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 8 | 16.0% | 448.4 | `the compromise` | The compromise here traces back to one thing: {cause}. |
| 4 | 8.0% | 237.4 | `now {}` | The old pressure eased, but the habit found a new home: now {cause}, and it sustains the arrangement. |
| 4 | 8.0% | 49.6 | `the ledger` | What began when {cause} endures out of habit; the ledger never closed. |
| 6 | 12.0% | 34.5 | `the record` | The record carries this as it happened. |
| 4 | 8.0% | 12.2 | `the arrangement` | The old pressure eased, but the habit found a new home: now {cause}, and it sustains the arrangement. |
| 6 | 12.0% | 5.4 | `{} and` | The old pressure eased, but the habit found a new home: now {cause}, and it sustains the arrangement. |
| 8 | 16.0% | 1.3 | `and the` | This {role} is compromised, and the root of it is that {cause}. |

### R5 — Herald crier voice (n=373)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 26 | 7.0% | 1192 | `and the country` | Word of the disaster passes from mouth to mouth, and the country reckons what it has lost. |
| 10 | 2.7% | 1416.9 | `the matter of` | The matter of arms stands unsettled, and every ear is turned toward the marches. |
| 10 | 2.7% | 1416.9 | `market roads` | Word of the trade moves along the market roads, and the guilds take note. |
| 8 | 2.1% | 1147 | `came to nothing` | In the end it came to nothing. |
| 8 | 2.1% | 1147 | `the halls of` | A restlessness moves through the halls of rule; the loyal grow uneasy and the ambitious grow bold. |
| 7 | 1.9% | 1012.1 | `over the country` | The matter of the plague hangs over the country, and every household marks it well. |
| 7 | 1.9% | 1012.1 | `halls of rule` | A restlessness moves through the halls of rule; the loyal grow uneasy and the ambitious grow bold. |
| 6 | 1.6% | 877.1 | `fat years` | The matter of the fat years stirs every hearth, and the careful weigh how long the plenty will hold. |
| 6 | 1.6% | 877.1 | `the careful` | The matter of the fat years stirs every hearth, and the careful weigh how long the plenty will hold. |
| 6 | 1.6% | 877.1 | `is upon` | War has come in earnest. The fighting is upon the front, and the wounded are already carried back. |

### R6 — NPC cause-conjunction ladder (n=1659)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 146 | 8.8% | 4227 | `it is public` | It is public now: the shortfall was covered with bought coin, and the town is learning what the {role} sold to cover i… |
| 126 | 7.6% | 3649.9 | `the syndicate` | The syndicate that held the arrangement is gone, but the stores are still empty, and control of what remains has taken… |
| 126 | 7.6% | 3649.9 | `public that` | It is public that the {role} took the occupier's protection and paid for it in the town's secrets; the word for that i… |
| 95 | 5.7% | 2755.5 | `the boss` | The crews call the boss the power in this town, and the boss lets them; the truth sits in a ledger audited quarterly f… |
| 75 | 4.5% | 2178.4 | `destroyed but` | The old patron is destroyed, but the supply lines are still cut, and whoever can move goods along them holds the {role… |
| 73 | 4.4% | 2120.7 | `the adept` | An unfunded tower is an available one: the adept works for whoever pays, and the work has drifted from what the town w… |
| 164 | 9.9% | 1582.1 | `came clean` | Full stores ended it: with nothing left to ration, the {role} gave up the trade in favors and came clean. |
| 66 | 4.0% | 1918.7 | `the foreman` | The wages come up short every count, so the foreman grew the count; names on the crew tally that swing no hammer, and … |
| 65 | 3.9% | 1889.9 | `the agitator` | It is public, and the movement is breaking on it: the agitator sold every serious plan to the occupier before it ripen… |
| 64 | 3.9% | 1861 | `is out the` | What the {role} did inside the scandal's economy is out; the town learned one disgrace and found another folded inside… |

### R7 — institution/service gazetteer (n=2169)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 10 | 0.5% | 226.8 | `only where` | A wholly hidden operation that moves persons across borders outside any legal channel. It arises only where no lawful … |
| 9 | 0.4% | 205.2 | `and mends` | Puts up buildings and mends them, and makes tools besides. |
| 7 | 0.3% | 162 | `given over` | Several inn districts, given over to merchants, travellers, and those who stay long. |
| 7 | 0.3% | 162 | `over to` | Several inn districts, given over to merchants, travellers, and those who stay long. |
| 7 | 0.3% | 162 | `and fountains` | A built water supply: conduits, cisterns, and fountains. |
| 7 | 0.3% | 162 | `a city's` | Several aqueducts feed cisterns and fountains spread across the districts, a water system built for a city's size. |
| 7 | 0.3% | 162 | `viable only` | Evaporates naturally saline brine into the raw salt used for preservation. Viable only where salt flats, springs, or o… |
| 6 | 0.3% | 140.4 | `000 people` | A chapter of organised crime, workable only past 10,000 people. Thirty to a hundred members. |
| 5 | 0.2% | 118.8 | `criminals and` | Holds debtors, criminals, and political prisoners alike. |
| 5 | 0.2% | 118.8 | `worked in` | Strips worked in the open fields. |

### R8 — world-data prose (n=1738)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 9 | 0.5% | 260.8 | `the accessible` | The accessible salt beds are exhausted or no longer workable. |
| 7 | 0.4% | 205.9 | `by someone who` | The threat is being exaggerated by someone who profits from wartime contracts |
| 6 | 0.3% | 178.4 | `of someone who` | Professionally cordial: the manner of someone who deals with strangers all day and has a system for it. |
| 6 | 0.3% | 178.4 | `are exhausted` | The accessible salt beds are exhausted or no longer workable. |
| 5 | 0.3% | 151 | `settlement was founded` | The original settlement was founded with a degree of independence that no longer exists. The current administration an… |
| 5 | 0.3% | 151 | `major trade routes` | grew at the intersection of two major trade routes |
| 5 | 0.3% | 151 | `one of their` | One of their children is not theirs biologically, and they know it |
| 5 | 0.3% | 151 | `who has been` | Determine who has been bribing their warehouse staff |
| 5 | 0.3% | 151 | `require established` | Hundreds of professional guards require established military infrastructure. |
| 10 | 0.6% | 96.1 | `they haven't` | The terms may mean they owe something to an enemy that they haven't paid yet |

### R9 — chrome copy registry (n=619)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 12 | 1.9% | 1007.6 | `try once` | The code could not be checked. Try once more. |
| 6 | 1.0% | 523.9 | `part of your` | Marks this town as part of your campaign world. Future changes become events on a timeline. |
| 6 | 1.0% | 523.9 | `of your campaign` | Marks this town as part of your campaign world. Future changes become events on a timeline. |
| 5 | 0.8% | 443.3 | `writes canon` | Settlements are simulated from constraints, not generated by AI. Every optional AI feature reads and proposes; only th… |
| 5 | 0.8% | 443.3 | `free tier` | You’ve hit the {limit}-save cap on the free tier. |
| 9 | 1.5% | 255.3 | `we could` | We could not find an account for that email address. Check the spelling, or create a new account. |
| 4 | 0.6% | 362.7 | `neighbourhood system` | Saves, larger settlements, and the Neighbourhood System. |
| 4 | 0.6% | 362.7 | `a new password` | We will email you a secure link to set a new password. |
| 4 | 0.6% | 362.7 | `your recovery` | Choose a new password for your account. You are signed in through your recovery link. |
| 4 | 0.6% | 362.7 | `seconds then` | Generate a town in seconds. Then run the region for years. |

### R10 — compendium docent (n=505)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 19 | 3.8% | 1934.7 | `be undone with` | Applies a chosen event to the active save, writing the change into canon and recording it in the event log. It can be … |
| 14 | 2.8% | 1438.7 | `with options` | A War verb the DM can apply to the settlement, with options Severity, Instigating neighbour and Souring to. |
| 14 | 2.8% | 1438.7 | `machinery with` | A War order the DM stages as a proposal; approval applies through the world's own machinery, with options The aggrieve… |
| 13 | 2.6% | 1339.4 | `war order` | A War order the DM stages as a proposal; approval applies through the world's own machinery, with options The aggrieve… |
| 12 | 2.4% | 1240.2 | `options the` | A War order the DM stages as a proposal; approval applies through the world's own machinery, with options The aggrieve… |
| 11 | 2.2% | 1141 | `with the option` | A Relations verb the DM can apply to the settlement, with the option New relationship. |
| 11 | 2.2% | 1141 | `undone with the` | Places a marker or feature on the campaign map. It can be undone with the map undo. |
| 11 | 2.2% | 1141 | `with the map` | Places a marker or feature on the campaign map. It can be undone with the map undo. |
| 11 | 2.2% | 1141 | `the map undo` | Places a marker or feature on the campaign map. It can be undone with the map undo. |
| 9 | 1.8% | 942.6 | `the settlement with` | A Relations verb the DM can apply to the settlement, with the option New relationship. |

### R11 — event composer / realm verbs (n=216)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 6 | 2.8% | 1521.1 | `authored as` | A leader's death is authored as Kill / remove NPC. The consequences derive from the NPC's own pillar standing. |
| 5 | 2.3% | 1287.1 | `apply stressor` | A refugee wave arrives via Apply stressor (migration pressure). |
| 5 | 2.3% | 1287.1 | `name e` | Institution name (e.g. "Granary", "Temple of Mercy") |
| 4 | 1.9% | 1053.1 | `their faction` | {targetId} rises within their faction, displacing a rival on the way up. |
| 4 | 1.9% | 1053.1 | `institution name` | Institution name (e.g. "Granary", "Temple of Mercy") |
| 4 | 1.9% | 1053.1 | `qualifying neighbour` | Decree a gift of grain to a qualifying neighbour: an ally, trade partner, or vassal/patron. Only grain above the hard … |
| 4 | 1.9% | 1053.1 | `to proposal` | Faction power shifts escalate to proposal on severity thresholds, independent of the flag. |
| 6 | 2.8% | 507 | `is authored` | A leader's death is authored as Kill / remove NPC. The consequences derive from the NPC's own pillar standing. |
| 6 | 2.8% | 507 | `folded into` | Folded into Kill / remove NPC. |
| 4 | 1.9% | 210.6 | `the flag` | A major population swing is a premise about the settlement’s scale; gated when the flag is on. |

### R12 — treaty / war-status documents (n=108)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 4 | 3.7% | 2105.4 | `passed quietly` | The week passed quietly. |
| 4 | 3.7% | 2105.4 | `without event` | The week passed without event. |
| 4 | 3.7% | 2105.4 | `with little to` | A quiet week, with little to note. |
| 4 | 3.7% | 2105.4 | `little to note` | A quiet week, with little to note. |
| 4 | 3.7% | 2105.4 | `slipped by` | The week slipped by, calm and uneventful. |
| 4 | 3.7% | 2105.4 | `by calm` | The week slipped by, calm and uneventful. |
| 4 | 3.7% | 2105.4 | `and uneventful` | The week slipped by, calm and uneventful. |
| 4 | 3.7% | 2105.4 | `growing into` | growing into its limit |
| 4 | 3.7% | 2105.4 | `usual price` | nearly double its usual price |
| 4 | 3.7% | 701.8 | `calm and` | The week slipped by, calm and uneventful. |

### R14 — generators prose tables (n=561)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 5 | 0.9% | 54.5 | `you cannot` | Something happened in {a} recently. You cannot immediately say what, but the settlement has the quality of a place tha… |
| 4 | 0.7% | 44.6 | `is open the` | {a} is functional. The market is open, the streets are swept, the guards are at their posts. Something is wrong anyway… |
| 6 | 1.1% | 34.1 | `approach to {}` | The approach to {a} is quieter than it should be for a settlement this size. The outlying farms are empty. The road ha… |
| 4 | 0.7% | 36.5 | `is the point` | {a} is going about its business. The market is open, the streets are busy, the gates are attended by soldiers whose ar… |
| 5 | 0.9% | 32.7 | `it is only` | From the road, {a} looks ordinary. Smoke from cookfires, the sound of a market. It is only at the gate that the weight… |
| 6 | 1.1% | 27.6 | `the approach to` | The approach to {a} is quieter than it should be for a settlement this size. The outlying farms are empty. The road ha… |
| 4 | 0.7% | 30.9 | `the guards` | {a}'s gates are open but attended: every person entering is noted, every cart searched. The guards are professional ab… |
| 7 | 1.2% | 23.1 | `{}'s gate` | At {a}'s gate the queue divides in two: residents with papers, and everyone else. The residents' line is longer and mo… |
| 9 | 1.6% | 18.8 | `essential for` | A flat-bottomed ferry crossing the river. The ferryman's family has held the crossing rights for generations. Essentia… |
| 4 | 0.7% | 26.7 | `going about` | The gates of {a} are closed. There are people on the walls. This is not the relaxed watch of a settlement going about … |

### R15 — src long tail (n=3883)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 34 | 0.9% | 385.9 | `war of the` | the War of the Old Grievance |
| 18 | 0.5% | 206.9 | `free alliance` | A neutral figure is being pressured by both The Free Alliance and The Establishment to take a side before the next cou… |
| 18 | 0.5% | 206.9 | `candidate owner` | CANDIDATE, OWNER-UNSIGNED (this leaf authors no magnitude; every number it returns is the register's) |
| 18 | 0.5% | 206.9 | `owner unsigned` | CANDIDATE, OWNER-UNSIGNED (this leaf authors no magnitude; every number it returns is the register's) |
| 17 | 0.4% | 195.8 | `surplus adequate` | The food security causal band (surplus/adequate/strained/critical/collapsed). |
| 17 | 0.4% | 195.8 | `adequate strained` | The food security causal band (surplus/adequate/strained/critical/collapsed). |
| 16 | 0.4% | 184.6 | `band surplus` | The food security causal band (surplus/adequate/strained/critical/collapsed). |
| 15 | 0.4% | 173.4 | `grade a` | grade a chosen response against the overflow band it was meant to relieve, over the horizon the band takes to move |
| 13 | 0.3% | 151 | `a keyed` | a keyed race inside the migration advance; the acting settlement and the action it is choosing between have not been r… |
| 12 | 0.3% | 139.8 | `keyed race` | a keyed race inside the migration advance; the acting settlement and the action it is choosing between have not been r… |

### R16 — JSX + PDF chrome (n=2685)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 13 | 0.5% | 230.4 | `once a campaign` | Once a campaign advances, {x} live causal variables sit under every settlement (food security, public legitimacy, defe… |
| 11 | 0.4% | 196.3 | `on desktop` | Building institutions, deities, trade goods, and content packs takes the full authoring workspace, which has room to w… |
| 10 | 0.4% | 179.2 | `simulator output` | Clear the narrative refinement and daily-life prose on this save, returning it to the raw simulator output. Chronicle … |
| 9 | 0.3% | 162.1 | `your saved` | Toggle "Chains" to draw supply-chain routes between exporters and importers across your saved settlements. |
| 9 | 0.3% | 162.1 | `the product` | Because the brief the AI works from is coherent, the fiction it produces stays consistent across many queries. Everyth… |
| 9 | 0.3% | 162.1 | `engine can` | Because the brief the AI works from is coherent, the fiction it produces stays consistent across many queries. Everyth… |
| 9 | 0.3% | 162.1 | `a campaign to` | Select a campaign to share its map. |
| 9 | 0.3% | 162.1 | `to apply` | instead of the raw simulation. Viewers see your refined prose; DM-private content is stripped unless you enable the op… |
| 8 | 0.3% | 145.1 | `new roll` | What a new roll keeps |
| 8 | 0.3% | 145.1 | `opening the` | Opening the narrative archive… |

### R17 — legacy rumor SUBJECT PHRASES (n=1293)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 29 | 2.2% | 1108.6 | `travellers finding` | travellers finding this town's soldiers billeted elsewhere |
| 14 | 1.1% | 544.9 | `travellers told` | travellers told whose word carries here |
| 11 | 0.9% | 432.2 | `travellers passing` | travellers passing this town's grain on somebody else's road |
| 10 | 0.8% | 394.6 | `travellers advised` | travellers advised not to mention where they came from |
| 10 | 0.8% | 394.6 | `entered against the` | garrisons entered against the occupier's own strength |
| 9 | 0.7% | 357 | `entered against a` | a raid entered against a named neighbour |
| 8 | 0.6% | 319.4 | `finding a` | travellers finding a crossing closed that was open last season |
| 7 | 0.5% | 281.8 | `in which the` | a season in which the pinch was arranged, not suffered |
| 16 | 1.2% | 206.7 | `entered in` | sabotage entered in the garrison's own record |
| 6 | 0.5% | 244.3 | `that has to` | trade that has to go the long way or not at all |

### R18 — inline in-function prose (n=5673)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 41 | 0.7% | 291.6 | `{} must be` | {x} must be a plain object |
| 16 | 0.3% | 115.9 | `does not match` | does not match its declared content hash. |
| 15 | 0.3% | 108.9 | `population {}` | Population {x} sustains a deep labor pool. |
| 35 | 0.6% | 83.1 | `must be an` | command spec must be an object |
| 12 | 0.2% | 87.8 | `must contain` | {x} must contain finite numbers |
| 12 | 0.2% | 87.8 | `{} requires` | {x} requires arcane response. |
| 12 | 0.2% | 87.8 | `an array` | entries must be an array of at most {x} items. |
| 11 | 0.2% | 80.8 | `{} contains` | Refined {x} contains an entity not present in the original. |
| 11 | 0.2% | 80.8 | `pack manifest` | pack.manifest is invalid: {x} |
| 11 | 0.2% | 80.8 | `{} 100` | {x} commands {x} influence at {x}/100, yet no {x} appears on the settlement roster. Power is sustained by traveling cl… |

### A-U — annex rows UNWIRED (n=4626)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 41 | 0.9% | 459.3 | `the hall of` | {npc} put the question to the hall of {settlement} and got back the answer already written on the granary door. |
| 25 | 0.5% | 282.2 | `factor {}` | {house}: {band}; the {route}, the {good} trade; Factor {npc}, abroad at {counterpart}. |
| 16 | 0.3% | 182.6 | `spring and` | {settlement} sent {band} down the {route} in the spring and fed them through the winter regardless. |
| 15 | 0.3% | 171.6 | `is entered in` | {settlement}'s legitimacy deficit fed the crowd's ledger through {timeband_span}; the rungs came in the order the reco… |
| 15 | 0.3% | 171.6 | `clerks of` | It was signed by hands the market can no longer name, and it kept its word as long as anybody was watching. The parchm… |
| 14 | 0.3% | 160.5 | `{} venture` | The {house} venture is lost on the {route}, and the books that carried it stand at {band} by the end of the same seaso… |
| 14 | 0.3% | 160.5 | `tribute of` | {settlement}'s hall has charged the tribute of {counterpart} to its own seat; the book records both and joins neither. |
| 13 | 0.3% | 149.4 | `grudge with` | {settlement} buried its grudge with {counterpart}; {counterpart} has buried nothing, and a decree binds only the hall … |
| 44 | 1.0% | 98.5 | `seat of {}` | {house} lent to the seat of {settlement} and asked for the {route} in the terms; the debt is a grievance now, and the … |
| 12 | 0.3% | 138.4 | `column out` | A column out of {settlement} took the {good} on the {route} and carried it home entire; the loss stands in {house}'s b… |

### A-W — annex rows wired (control) (n=4276)

| n | % of variants | lift | tic | one real example |
|---:|---:|---:|---|---|
| 703 | 16.4% | 5.1 | `at {}` | The market at {settlement} runs thin; the routes turned elsewhere when the {route} closed with the war, and they have … |
| 178 | 4.2% | 5.5 | `a stranger` | A stranger at {settlement} finds {creed}'s house on the main street and {rival_creed}'s feasts on a narrower one; the … |
| 146 | 3.4% | 5.6 | `the hall` | {settlement}'s embargo against {counterpart} stands and has cost the town {band} of its own custom; the hall is still … |
| 736 | 17.2% | 4.1 | `the town` | {settlement}'s embargo against {counterpart} stands and has cost the town {band} of its own custom; the hall is still … |
| 53 | 1.2% | 6 | `stranger at` | A stranger at {settlement} finds {creed}'s house on the main street and {rival_creed}'s feasts on a narrower one; the … |
| 159 | 3.7% | 4.7 | `town has` | {settlement}'s register names no patron, and {counterpart}'s names none either; the claim that turns a rite into a mus… |
| 43 | 1.0% | 5.7 | `the {} at` | The quarter nearest the {route} at {settlement} stands empty and is not being rebuilt; what left it went out in column… |
| 287 | 6.7% | 3.8 | `rather than` | {settlement} counts {counterpart} heretic rather than merely foreign and the muster is called on the counting; the qua… |
| 83 | 1.9% | 4.8 | `and nothing` | {settlement}'s own altars stand as they stood, for all that the town took the field and took {counterpart}: no banner … |
| 78 | 1.8% | 4.8 | `{} keeps` | {settlement} keeps the {route} shut against {counterpart} for {reason}, and the closing is {timeband_age}; the clerks … |

---

## 5. (c) THE THREE REGISTERS MOST AND LEAST LIKE THE ARCHIVIST VOICE BIBLE

`docs/VOICE_AND_TONE.md` is a prescriptive document, so "like the bible" has to be split into two
measurable things, and they **disagree**, which is itself the finding.

### The exemplar corpus (`bible.mjs`) — 67 sentences the bible SPEAKS rather than describes

| source | n |
|---|---:|
| B1 §1 "The Voice, in One Paragraph", sentence by sentence | 8 |
| B2 every `- Do: "…"` exemplar in the nine pillars | 17 |
| B3/B4 the §4 tone matrix and §6 playbook **AFTER** halves (text right of the last `→`) | 35 |
| B4b §5 immersion-doctrine quoted positives | 7 |
| **exemplar total** | **67** |
| the `Don't:` / BEFORE halves, kept separately as an anti-corpus, never mixed in | 42 |

Its fingerprint: words/segment mean **8.1**, sd 6.9, p50 6, p90 17, **64.2% of segments under eight
words**, segments/variant **1.00**, semicolons **0**, em dashes **0**, exclamations **0**, gloss
tails **0**, summarising second sentences **0**, colons 0.119, parentheses 0.090.
⚠ **n=67 and slogan-skewed** (it is a rulebook quoting its own best lines), so a rate below ~0.03
there is one-or-two-sentence noise. The comparison below is therefore reported on two axes and
never collapsed into one score.

### AXIS A — mechanical compliance with §3's hard rules

Counted over **prose-shaped strings at any length** (`mechanical.mjs`): the admission floor is
deliberately dropped, because the bible's rule governs "any user-facing string", not any sentence.
The screen keeps `Email confirmed!` and drops `(?<![.\w])blockadeBypass\s*,`.

| register | prose strings | em dashes | exclamations | all-caps tokens | "the PCs" |
|---|---:|---:|---:|---:|---:|
| R1, R2, R3, R4, R4b, R5, R6, R7, R10, R12, R16, R17, A-U, A-W | 28,700 combined | **0** | **0** | 33 (31 R16 + 2 A-U) | 0 |
| R9 chrome copy | 866 | **0** | **0** | 12 | 0 |
| R8 world data | 3,222 | **5** (4 strings) | 0 | 1 | **1** |
| R11 event composer | 554 | 1 | 0 | 11 | 0 |
| R14 generators | 1,185 | 1 | 0 | 1 | 0 |
| R15 long tail | 9,155 | 89 (83 strings) | 0 | 216 | 0 |
| R18 inline | 9,980 | 57 | 0 | 147 | 0 |
| **TOTAL** | **53,662** | **153** | **0** | | **1** |

Three results here are worth the chair's eye:

1. **ZERO exclamation points in the entire reader-facing corpus** — all 53,662 prose-shaped strings.
   The bible's second hard rule is fully held. (The one `"Email confirmed!"` in the tree is inside a
   *code comment* in `VerifyEmailPage.jsx`; the copy string in `en.js` is `'Email confirmed'`.)
2. **ZERO em dashes in JSX** (R16, 5,439 prose strings). This contradicts the figure the inventory
   quotes — "396 em dashes and 10 exclamation points already live in components" — and the
   contradiction resolves in the estate's favour: that is the test file's **historical** header note,
   and `tests/copy/.voice-mechanics-jsx-baseline.json` at this HEAD is **3 bytes, `{}`**. The debt is
   burned down. The sibling commit that landed mid-run (`460a63bca`) is the estate banking exactly
   this win.
3. The em-dash debt that remains is **6 strings of genuine reader prose** — 4 in
   `generators/narrative/settlementOriginProse.js` (*"what the land does not give arrives
   expensively — through {channels}"*), 1 in `generators/power/governanceNarrative.js`
   (*"Critical (active siege — survival priority)"*), 1 dev note in `worldPulse/decisionTier.js` —
   plus 146 in the two heterogeneous buckets R15/R18, which are mostly AI-layer prompts, design-token
   descriptions and dev notes rather than reader surfaces.

**One outright bible violation, exactly one, and it is unambiguous:**
`src/data/historyData.js:1326` — *"The agents' handler is someone in a position of trust, and **the
PCs** have already met them"*. §5.3 of the bible: *"'The PCs' is a dev-side term and must never reach
a user surface."* `historyData.HISTORICAL_EVENTS_DATA` is a generation input read on the Timeline.

**Breach rank on the admitted corpus** (summed em-dash + exclamation + all-caps + digits-in-prose
rate). Note the all-caps and digit columns are *indicators, not verdicts*: R9's caps are the deity
axis labels (`a LAWFUL creed`), R16's are acronyms (PII, GDPR, VTT), and the bible expressly permits
digits "in mechanical, scannable UI" — R10's 0.111 is band-ladder specs (`All sliders 40-65`) and
R9's 0.032 is prices and timings, all legitimate.

```
0.000  R1 R2 R3 R4 R4b R5 R6 R17 A-U      0.030 R7     0.048 R9
0.006  R8      0.009 R12     0.028 R16    0.040 R18    0.061 R11
0.043  R14     0.111 R10     0.121 R15
```

### AXIS B — style distance to the exemplar fingerprint

Mean |z| over seventeen comparable metrics, each z-scored against the spread of the register columns
themselves, then differenced against the bible's own z. Low = most like the bible.

| rank | register | distance | rank | register | distance |
|---:|---|---:|---:|---|---:|
| 1 | **R16 JSX + PDF chrome** | **0.512** | 13 | R4b Herald disclosure | 1.164 |
| 2 | **R15 src long tail** | **0.650** | 14 | A-U annex UNWIRED | 1.176 |
| 3 | **R9 chrome copy registry** | **0.684** | 15 | R14 generators | 1.304 |
| 4 | R18 inline prose | 0.754 | 16 | **R5 Herald crier voice** | **1.390** |
| 5 | R17 rumor subject phrases | 0.776 | 17 | **R6 NPC ladder** | **1.421** |
| 6 | R11 event composer | 0.777 | 18 | **R1 dossier STATE** | **1.581** |
| 7–12 | R12 · R7 · R4 · R10 · R8 · R3 | 0.898 – 1.028 | 19 | **R2 dossier CAUSAL** | **2.263** |

**The three most bible-like: R16 (JSX chrome), R15 (src long tail), R9 (the copy registry).**
**The three least: R2 (dossier causal join), R1 (dossier state), R6 (the NPC ladder).**

The result is not a paradox and should not be read as a verdict on quality. The bible's exemplar set
is chrome — landing lines, button labels, error copy, the tone matrix's AFTERs — so the registers
that *are* chrome match it, and the deep diegetic registers, which the bible governs through §4's
per-surface tuning rather than through its own examples, diverge on exactly the axes §4 licenses:

| what drives R2 to 2.263 | value | field mean | bible |
|---|---:|---:|---:|
| share of segments over 30 words | **0.491** | 0.035 | 0.015 |
| words/segment mean | **28.6** | 11.9 | 8.1 |
| segments per variant | 1.135 | 1.256 | 1.000 |
| semicolon rate | **0.360** | 0.143 | 0.000 |
| rationed pet words / variant | **0.713** | 0.185 | 0.060 |

and R1's, separately: gloss tail 0.066 (field 0.016, bible 0.000), "rather than" 0.113 (field 0.007),
antithesis shape 0.139 (field 0.028). R6's: "There/It is" openers 0.110 (field 0.006), semicolons
0.540 (field 0.143), p10 **19 words** — the ladder has **no short sentence at all**.

**The honest reading:** the registers furthest from the bible's exemplars are furthest on precisely
the four items the dossier §3 already named as the house's own failure mode — the gloss, the
reflexive contrast, the semicolon-stapled second idea, and the pet-word set — and they are the
registers where the reconstruction wave was already aimed. The bible's *hard rules* they hold
perfectly (breach 0.000). The chrome registers that top Axis B are compliant on style precisely
because they are short and plain, and they are where the residual **digit** and **caps** indicators
live.

---

## 6. (d) EVERY METRIC WHERE A REGISTER IS AN OUTLIER BY MORE THAN DOUBLE THE CORPUS MEDIAN

The median is taken across the nineteen register columns (A-W, the control, is excluded;
so are size-scaled counts, which say only that a register is large). Both directions are
reported: **137 high** (> 2x median) and **147 low** (< 0.5x median).

**The ten that carry meaning**, ahead of the full list:

| x median | register | metric | value | median | what it is |
|---:|---|---|---:|---:|---|
| 98.2x | **R2** | share of segments over 30 words | 0.491 | 0.005 | the causal join is the estate's one long register, and it has **no short relief**: p10 is 14 words, p50 is 30 |
| 37x | R10 | digits-in-prose rate | 0.111 | 0.003 | band-ladder specs (`All sliders 40-65`) — the bible's "digits in scannable UI" permission, not a breach |
| 18.3x | **R6** | "There/It is" opener rate | 0.110 | 0.006 | **184 of 1,659** ladder lines open `It is public / It is known` — the single strongest formula in the estate |
| 16.5x | **R1** | gloss tail `, which` rate | 0.066 | 0.004 | the over-explaining tail the dossier §3 ranked first among house tics, and it is R1's outlier |
| 16.1x | **R1** | "rather than" rate | 0.113 | 0.007 | 255 of 2,262; with R2's 0.071 this is the reflexive-antithesis debt, concentrated in exactly two columns |
| 15.5x | **A-U** | gloss tail `, which` rate | 0.062 | 0.004 | the **unwired** annex rows carry the same tic at the same rate — wiring them imports it |
| 13.9x | R11 | parenthesis rate | 0.222 | 0.016 | the DM-authoring surface annotates; consistent with the bible's parenthesis permission |
| 13x | R14 | gloss tail `, which` rate | 0.052 | 0.004 | the generators' tables are the third gloss home |
| 11.6x | R14 | 3+-segment share | 0.221 | 0.019 | R14 breaks the two-sentence ceiling far more than any other register |
| 8.4x | **R6** | share of segments over 30 words | 0.042 | 0.005 | with p10 = 19 words, the ladder has **no sentence under 19 words at the tenth percentile** |

And two structural lows worth as much as any high:

| x median | register | metric | value | median | what it is |
|---:|---|---|---:|---:|---|
| 0.02x | R6 | share of segments under 8 words | 0.005 | 0.381 | R5's rule 10 ("never three of a length in a row") has no purchase here: the ladder is monotonically long |
| 0.25x | R16 | pools uniform in segment count | 0.254 | 0.729 | the chrome is the **only** register with real shape spread inside a pool; R3 0.843, R8 0.892, R6 0.955, R17 1.000 |


### HIGH — above double the median

| x median | register | metric | value | median |
|---:|---|---|---:|---:|
| ∞ (median 0) | R5 | question rate | 0.005 | 0 |
| ∞ (median 0) | R8 | question rate | 0.001 | 0 |
| ∞ (median 0) | R9 | question rate | 0.034 | 0 |
| ∞ (median 0) | R15 | question rate | 0.005 | 0 |
| ∞ (median 0) | R16 | question rate | 0.021 | 0 |
| ∞ (median 0) | R18 | question rate | 0.003 | 0 |
| ∞ (median 0) | R8 | emphasis-caps rate | 0.001 | 0 |
| ∞ (median 0) | R9 | emphasis-caps rate | 0.016 | 0 |
| ∞ (median 0) | R11 | emphasis-caps rate | 0.042 | 0 |
| ∞ (median 0) | R14 | emphasis-caps rate | 0.002 | 0 |
| ∞ (median 0) | R15 | emphasis-caps rate | 0.049 | 0 |
| ∞ (median 0) | R16 | emphasis-caps rate | 0.009 | 0 |
| ∞ (median 0) | R18 | emphasis-caps rate | 0.02 | 0 |
| ∞ (median 0) | R7 | contraction rate | 0.004 | 0 |
| ∞ (median 0) | R8 | contraction rate | 0.048 | 0 |
| ∞ (median 0) | R9 | contraction rate | 0.05 | 0 |
| ∞ (median 0) | R12 | contraction rate | 0.019 | 0 |
| ∞ (median 0) | R14 | contraction rate | 0.029 | 0 |
| ∞ (median 0) | R15 | contraction rate | 0.012 | 0 |
| ∞ (median 0) | R16 | contraction rate | 0.022 | 0 |
| ∞ (median 0) | R18 | contraction rate | 0.009 | 0 |
| 98.2x | R2 | share segments > 30 words | 0.491 | 0.005 |
| 37x | R10 | digits-in-prose rate | 0.111 | 0.003 |
| 18.33x | R6 | "There/It is" opener rate | 0.11 | 0.006 |
| 18x | R15 | digits-in-prose rate | 0.054 | 0.003 |
| 16.5x | R1 | gloss tail ", which" rate | 0.066 | 0.004 |
| 16.14x | R1 | "rather than" rate | 0.113 | 0.007 |
| 15.5x | A-U | gloss tail ", which" rate | 0.062 | 0.004 |
| 13.88x | R11 | parenthesis rate | 0.222 | 0.016 |
| 13.5x | R2 | gloss tail ", which" rate | 0.054 | 0.004 |
| 13x | R14 | gloss tail ", which" rate | 0.052 | 0.004 |
| 13x | R14 | digits-in-prose rate | 0.039 | 0.003 |
| 11.63x | R14 | 3+-segment share | 0.221 | 0.019 |
| 10.67x | R9 | digits-in-prose rate | 0.032 | 0.003 |
| 10.14x | R2 | "rather than" rate | 0.071 | 0.007 |
| 10x | R7 | digits-in-prose rate | 0.03 | 0.003 |
| 8.5x | R3 | gloss tail ", which" rate | 0.034 | 0.004 |
| 8.5x | R1 | "There/It is" opener rate | 0.051 | 0.006 |
| 8.4x | R6 | share segments > 30 words | 0.042 | 0.005 |
| 7.8x | R14 | share segments > 30 words | 0.039 | 0.005 |
| 7.32x | R1 | antithesis SHAPE rate | 0.139 | 0.019 |
| 7.06x | R2 | slot-bearing share | 0.953 | 0.135 |
| 6.8x | R9 | AI lexical tells / variant (raw) | 0.102 | 0.015 |
| 6.73x | R2 | rationed pet words / variant | 0.713 | 0.106 |
| 6.33x | A-U | "There/It is" opener rate | 0.038 | 0.006 |
| 6.33x | R16 | digits-in-prose rate | 0.019 | 0.003 |
| 5.96x | R12 | pools w/ repeated 2-word opener | 0.667 | 0.112 |
| 5.76x | R1 | slot-bearing share | 0.777 | 0.135 |
| 5.69x | R16 | parenthesis rate | 0.091 | 0.016 |
| 5.6x | R16 | AI lexical tells / variant (raw) | 0.084 | 0.015 |
| 5.59x | A-U | slot-bearing share | 0.754 | 0.135 |
| 5.4x | A-U | share segments > 30 words | 0.027 | 0.005 |
| 5.33x | R12 | "There/It is" opener rate | 0.032 | 0.006 |
| 5.21x | R18 | pools w/ repeated 2-word opener | 0.583 | 0.112 |
| 5.06x | R1 | rationed pet words / variant | 0.536 | 0.106 |
| 4.84x | R9 | 3+-segment share | 0.092 | 0.019 |
| 4.75x | R6 | words/segment p10 | 19 | 4 |
| 4.67x | R11 | digits-in-prose rate | 0.014 | 0.003 |
| 4.61x | R2 | colon rate | 0.364 | 0.079 |
| 4.47x | R16 | 3+-segment share | 0.085 | 0.019 |
| 4.28x | R3 | slot-bearing share | 0.578 | 0.135 |
| 4.27x | R16 | pools w/ repeated 2-word opener | 0.478 | 0.112 |
| 4.2x | R1 | share segments > 30 words | 0.021 | 0.005 |
| 4.15x | R6 | semicolon rate | 0.54 | 0.13 |
| 4.05x | R2 | antithesis SHAPE rate | 0.077 | 0.019 |
| 4x | R18 | parenthesis rate | 0.064 | 0.016 |
| 4x | R18 | digits-in-prose rate | 0.012 | 0.003 |
| 3.94x | R10 | 2nd-sentence summary rate | 0.063 | 0.016 |
| 3.88x | R15 | parenthesis rate | 0.062 | 0.016 |
| 3.87x | R16 | mean within-pool word sd | 5.8 | 1.5 |
| 3.81x | R14 | parenthesis rate | 0.061 | 0.016 |
| 3.8x | R10 | AI lexical tells / variant (raw) | 0.057 | 0.015 |
| 3.75x | R2 | words/segment p50 | 30 | 8 |
| 3.7x | R4b | slot-bearing share | 0.5 | 0.135 |
| 3.63x | R7 | 3+-segment share | 0.069 | 0.019 |
| 3.54x | R4b | colon rate | 0.28 | 0.079 |
| 3.5x | R2 | words/segment p10 | 14 | 4 |
| 3.47x | R18 | mean pool size | 12.5 | 3.6 |
| 3.4x | R2 | mean within-pool word sd | 5.1 | 1.5 |
| 3.33x | R3 | "There/It is" opener rate | 0.02 | 0.006 |
| 3.33x | R14 | "There/It is" opener rate | 0.02 | 0.006 |
| 3.27x | R18 | slot-bearing share | 0.441 | 0.135 |
| 3.2x | R14 | mean within-pool word sd | 4.8 | 1.5 |
| 3.17x | R2 | "There/It is" opener rate | 0.019 | 0.006 |
| 3x | R11 | share segments > 30 words | 0.015 | 0.005 |
| 3x | R12 | digits-in-prose rate | 0.009 | 0.003 |
| 3x | R5 | AI tells / variant EXOGENOUS | 0.024 | 0.008 |
| 2.98x | R2 | words/segment mean | 28.6 | 9.6 |
| 2.94x | R8 | parenthesis rate | 0.047 | 0.016 |
| 2.88x | R7 | doubled-adjective rate | 0.023 | 0.008 |
| 2.86x | R1 | adverbs / segment | 0.163 | 0.057 |
| 2.85x | R14 | triad-list rate | 0.077 | 0.027 |
| 2.78x | R7 | triad-list rate | 0.075 | 0.027 |
| 2.77x | R2 | semicolon rate | 0.36 | 0.13 |
| 2.75x | R6 | words/segment p50 | 22 | 8 |
| 2.75x | R15 | gloss tail ", which" rate | 0.011 | 0.004 |
| 2.75x | R6 | rationed pet words / variant | 0.291 | 0.106 |
| 2.74x | R8 | 3+-segment share | 0.052 | 0.019 |
| 2.74x | R14 | antithesis SHAPE rate | 0.052 | 0.019 |
| 2.71x | A-U | rationed pet words / variant | 0.287 | 0.106 |
| 2.67x | A-U | mean within-pool word sd | 4 | 1.5 |
| 2.66x | R1 | pronoun closer rate | 0.133 | 0.05 |
| 2.6x | R8 | adverbs / segment | 0.148 | 0.057 |
| 2.56x | R4 | pronoun closer rate | 0.128 | 0.05 |
| 2.55x | R16 | participial-opener rate | 0.028 | 0.011 |
| 2.53x | R10 | 3+-segment share | 0.048 | 0.019 |
| 2.5x | R8 | gloss tail ", which" rate | 0.01 | 0.004 |
| 2.5x | R2 | pronoun closer rate | 0.125 | 0.05 |
| 2.5x | R4b | AI tells / variant EXOGENOUS | 0.02 | 0.008 |
| 2.46x | A-U | pronoun closer rate | 0.123 | 0.05 |
| 2.44x | R8 | triad-list rate | 0.066 | 0.027 |
| 2.44x | R16 | mean pool size | 8.8 | 3.6 |
| 2.38x | R12 | doubled-adjective rate | 0.019 | 0.008 |
| 2.35x | R6 | words/segment mean | 22.6 | 9.6 |
| 2.35x | R2 | words/segment p90 | 40 | 17 |
| 2.32x | R14 | rationed pet words / variant | 0.246 | 0.106 |
| 2.28x | R2 | adverbs / segment | 0.13 | 0.057 |
| 2.25x | R5 | words/segment p50 | 18 | 8 |
| 2.25x | R14 | doubled-adjective rate | 0.018 | 0.008 |
| 2.25x | R14 | colon rate | 0.178 | 0.079 |
| 2.25x | R9 | parenthesis rate | 0.036 | 0.016 |
| 2.23x | R12 | adverbs / segment | 0.127 | 0.057 |
| 2.22x | R9 | 2-segment share | 0.37 | 0.167 |
| 2.21x | R11 | 3+-segment share | 0.042 | 0.019 |
| 2.21x | R11 | antithesis SHAPE rate | 0.042 | 0.019 |
| 2.19x | R1 | 2nd-sentence summary rate | 0.035 | 0.016 |
| 2.17x | R8 | "There/It is" opener rate | 0.013 | 0.006 |
| 2.14x | R14 | slot-bearing share | 0.289 | 0.135 |
| 2.14x | R17 | "rather than" rate | 0.015 | 0.007 |
| 2.14x | R11 | abstract-noun closer rate | 0.122 | 0.057 |
| 2.13x | R1 | words/segment p50 | 17 | 8 |
| 2.1x | R7 | 2-segment share | 0.35 | 0.167 |
| 2.08x | R14 | 2-segment share | 0.348 | 0.167 |
| 2.07x | R2 | triad-list rate | 0.056 | 0.027 |
| 2.06x | R4 | share segments < 8 words | 0.947 | 0.46 |
| 2.06x | R2 | pools w/ repeated 2-word opener | 0.231 | 0.112 |
| 2.04x | R6 | triad-list rate | 0.055 | 0.027 |

### LOW — below half the median

| x median | register | metric | value | median |
|---:|---|---|---:|---:|
| 0x | R4 | terminal-stop share | 0 | 0.819 |
| 0x | R17 | terminal-stop share | 0 | 0.819 |
| 0x | R7 | slot-bearing share | 0 | 0.135 |
| 0x | R10 | slot-bearing share | 0 | 0.135 |
| 0x | R4 | 2-segment share | 0 | 0.167 |
| 0x | R17 | 2-segment share | 0 | 0.167 |
| 0x | R4 | 3+-segment share | 0 | 0.019 |
| 0x | R4b | 3+-segment share | 0 | 0.019 |
| 0x | R5 | 3+-segment share | 0 | 0.019 |
| 0x | R17 | 3+-segment share | 0 | 0.019 |
| 0x | R4 | share segments > 30 words | 0 | 0.005 |
| 0x | R4b | share segments > 30 words | 0 | 0.005 |
| 0x | R5 | share segments > 30 words | 0 | 0.005 |
| 0x | R12 | share segments > 30 words | 0 | 0.005 |
| 0x | R17 | share segments > 30 words | 0 | 0.005 |
| 0x | R4 | antithesis SHAPE rate | 0 | 0.019 |
| 0x | R4b | antithesis SHAPE rate | 0 | 0.019 |
| 0x | R4 | "rather than" rate | 0 | 0.007 |
| 0x | R4b | "rather than" rate | 0 | 0.007 |
| 0x | R5 | "rather than" rate | 0 | 0.007 |
| 0x | R6 | "rather than" rate | 0 | 0.007 |
| 0x | R9 | "rather than" rate | 0 | 0.007 |
| 0x | R12 | "rather than" rate | 0 | 0.007 |
| 0x | R4 | gloss tail ", which" rate | 0 | 0.004 |
| 0x | R4b | gloss tail ", which" rate | 0 | 0.004 |
| 0x | R5 | gloss tail ", which" rate | 0 | 0.004 |
| 0x | R10 | gloss tail ", which" rate | 0 | 0.004 |
| 0x | R11 | gloss tail ", which" rate | 0 | 0.004 |
| 0x | R12 | gloss tail ", which" rate | 0 | 0.004 |
| 0x | R4 | 2nd-sentence summary rate | 0 | 0.016 |
| 0x | R4b | 2nd-sentence summary rate | 0 | 0.016 |
| 0x | R11 | 2nd-sentence summary rate | 0 | 0.016 |
| 0x | R12 | 2nd-sentence summary rate | 0 | 0.016 |
| 0x | R17 | 2nd-sentence summary rate | 0 | 0.016 |
| 0x | R4 | triad-list rate | 0 | 0.027 |
| 0x | R17 | triad-list rate | 0 | 0.027 |
| 0x | R4 | doubled-adjective rate | 0 | 0.008 |
| 0x | R4b | doubled-adjective rate | 0 | 0.008 |
| 0x | R11 | doubled-adjective rate | 0 | 0.008 |
| 0x | R4b | participial-opener rate | 0 | 0.011 |
| 0x | R5 | participial-opener rate | 0 | 0.011 |
| 0x | R6 | participial-opener rate | 0 | 0.011 |
| 0x | R4 | "There/It is" opener rate | 0 | 0.006 |
| 0x | R4b | "There/It is" opener rate | 0 | 0.006 |
| 0x | R9 | "There/It is" opener rate | 0 | 0.006 |
| 0x | R11 | "There/It is" opener rate | 0 | 0.006 |
| 0x | R4 | semicolon rate | 0 | 0.13 |
| 0x | R17 | semicolon rate | 0 | 0.13 |
| 0x | R4 | colon rate | 0 | 0.079 |
| 0x | R17 | colon rate | 0 | 0.079 |
| 0x | R4 | parenthesis rate | 0 | 0.016 |
| 0x | R5 | parenthesis rate | 0 | 0.016 |
| 0x | R17 | parenthesis rate | 0 | 0.016 |
| 0x | R4b | adverbs / segment | 0 | 0.057 |
| 0x | R1 | digits-in-prose rate | 0 | 0.003 |
| 0x | R2 | digits-in-prose rate | 0 | 0.003 |
| 0x | R3 | digits-in-prose rate | 0 | 0.003 |
| 0x | R4 | digits-in-prose rate | 0 | 0.003 |
| 0x | R4b | digits-in-prose rate | 0 | 0.003 |
| 0x | R5 | digits-in-prose rate | 0 | 0.003 |
| 0x | R6 | digits-in-prose rate | 0 | 0.003 |
| 0x | R17 | digits-in-prose rate | 0 | 0.003 |
| 0x | A-U | digits-in-prose rate | 0 | 0.003 |
| 0x | R4 | AI lexical tells / variant (raw) | 0 | 0.015 |
| 0x | R4 | AI tells / variant EXOGENOUS | 0 | 0.008 |
| 0x | R10 | mean pool size | 0 | 3.6 |
| 0x | R11 | mean pool size | 0 | 3.6 |
| 0x | R10 | pools uniform in segment count | 0 | 0.672 |
| 0x | R11 | pools uniform in segment count | 0 | 0.672 |
| 0x | R4 | pools w/ repeated 2-word opener | 0 | 0.112 |
| 0x | R4b | pools w/ repeated 2-word opener | 0 | 0.112 |
| 0x | R9 | pools w/ repeated 2-word opener | 0 | 0.112 |
| 0x | R10 | pools w/ repeated 2-word opener | 0 | 0.112 |
| 0x | R11 | pools w/ repeated 2-word opener | 0 | 0.112 |
| 0x | R10 | mean within-pool word sd | 0 | 1.5 |
| 0x | R11 | mean within-pool word sd | 0 | 1.5 |
| 0.01x | R6 | share segments < 8 words | 0.005 | 0.46 |
| 0.02x | R6 | pools w/ repeated 2-word opener | 0.002 | 0.112 |
| 0.03x | R7 | pools w/ repeated 2-word opener | 0.003 | 0.112 |
| 0.04x | R2 | share segments < 8 words | 0.017 | 0.46 |
| 0.05x | R6 | 3+-segment share | 0.001 | 0.019 |
| 0.05x | R17 | pools w/ repeated 2-word opener | 0.006 | 0.112 |
| 0.06x | R6 | 2nd-sentence summary rate | 0.001 | 0.016 |
| 0.06x | R3 | parenthesis rate | 0.001 | 0.016 |
| 0.06x | R6 | parenthesis rate | 0.001 | 0.016 |
| 0.09x | R17 | slot-bearing share | 0.012 | 0.135 |
| 0.1x | R6 | 2-segment share | 0.016 | 0.167 |
| 0.11x | R3 | 3+-segment share | 0.002 | 0.019 |
| 0.12x | R7 | semicolon rate | 0.015 | 0.13 |
| 0.14x | R4 | abstract-noun closer rate | 0.008 | 0.057 |
| 0.14x | R4 | adverbs / segment | 0.008 | 0.057 |
| 0.17x | R5 | share segments < 8 words | 0.078 | 0.46 |
| 0.18x | R2 | participial-opener rate | 0.002 | 0.011 |
| 0.19x | R5 | 2nd-sentence summary rate | 0.003 | 0.016 |
| 0.2x | R3 | share segments > 30 words | 0.001 | 0.005 |
| 0.2x | R7 | share segments > 30 words | 0.001 | 0.005 |
| 0.2x | R9 | share segments > 30 words | 0.001 | 0.005 |
| 0.21x | R1 | 3+-segment share | 0.004 | 0.019 |
| 0.22x | R18 | triad-list rate | 0.006 | 0.027 |
| 0.24x | R5 | slot-bearing share | 0.032 | 0.135 |
| 0.25x | A-U | share segments < 8 words | 0.114 | 0.46 |
| 0.25x | R17 | gloss tail ", which" rate | 0.001 | 0.004 |
| 0.25x | R3 | doubled-adjective rate | 0.002 | 0.008 |
| 0.25x | R9 | doubled-adjective rate | 0.002 | 0.008 |
| 0.25x | R10 | AI tells / variant EXOGENOUS | 0.002 | 0.008 |
| 0.25x | R17 | AI tells / variant EXOGENOUS | 0.002 | 0.008 |
| 0.26x | R5 | antithesis SHAPE rate | 0.005 | 0.019 |
| 0.28x | R1 | share segments < 8 words | 0.13 | 0.46 |
| 0.28x | R10 | rationed pet words / variant | 0.03 | 0.106 |
| 0.29x | R3 | "rather than" rate | 0.002 | 0.007 |
| 0.3x | R4 | words/segment sd | 1.6 | 5.3 |
| 0.32x | R2 | 3+-segment share | 0.006 | 0.019 |
| 0.33x | R11 | triad-list rate | 0.009 | 0.027 |
| 0.33x | R12 | triad-list rate | 0.009 | 0.027 |
| 0.33x | A-U | triad-list rate | 0.009 | 0.027 |
| 0.33x | R10 | "There/It is" opener rate | 0.002 | 0.006 |
| 0.33x | R17 | "There/It is" opener rate | 0.002 | 0.006 |
| 0.35x | R5 | abstract-noun closer rate | 0.02 | 0.057 |
| 0.36x | R16 | pools uniform in segment count | 0.242 | 0.672 |
| 0.37x | R5 | 2-segment share | 0.062 | 0.167 |
| 0.37x | R6 | antithesis SHAPE rate | 0.007 | 0.019 |
| 0.37x | R5 | colon rate | 0.029 | 0.079 |
| 0.38x | R5 | doubled-adjective rate | 0.003 | 0.008 |
| 0.38x | R16 | doubled-adjective rate | 0.003 | 0.008 |
| 0.38x | R1 | parenthesis rate | 0.006 | 0.016 |
| 0.38x | A-U | parenthesis rate | 0.006 | 0.016 |
| 0.38x | R9 | AI tells / variant EXOGENOUS | 0.003 | 0.008 |
| 0.4x | R17 | words/segment sd | 2.1 | 5.3 |
| 0.4x | R3 | AI lexical tells / variant (raw) | 0.006 | 0.015 |
| 0.4x | R6 | AI lexical tells / variant (raw) | 0.006 | 0.015 |
| 0.4x | R4 | mean within-pool word sd | 0.6 | 1.5 |
| 0.41x | R4 | words/segment p90 | 7 | 17 |
| 0.41x | R1 | triad-list rate | 0.011 | 0.027 |
| 0.41x | R5 | triad-list rate | 0.011 | 0.027 |
| 0.41x | R9 | semicolon rate | 0.053 | 0.13 |
| 0.41x | R16 | semicolon rate | 0.053 | 0.13 |
| 0.42x | R8 | semicolon rate | 0.055 | 0.13 |
| 0.43x | R6 | slot-bearing share | 0.058 | 0.135 |
| 0.43x | R8 | pools w/ repeated 2-word opener | 0.048 | 0.112 |
| 0.44x | R3 | share segments < 8 words | 0.204 | 0.46 |
| 0.44x | R18 | 2nd-sentence summary rate | 0.007 | 0.016 |
| 0.44x | R3 | triad-list rate | 0.012 | 0.027 |
| 0.44x | R14 | pronoun closer rate | 0.022 | 0.05 |
| 0.46x | R10 | colon rate | 0.036 | 0.079 |
| 0.47x | R12 | antithesis SHAPE rate | 0.009 | 0.019 |
| 0.48x | R10 | pronoun closer rate | 0.024 | 0.05 |
| 0.49x | R2 | abstract-noun closer rate | 0.028 | 0.057 |

---

## 7. (e) THE EXACT COMMANDS — every figure above is re-derivable

```sh
DOCK=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/\
d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/laneDESKINT
P=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/\
d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/prose-research/probe-all
cd "$P"

# X1  projected JSON leaves          -> json-leaves.json   (2,734 leaves / 786 pools)
node x1-json-leaves.mjs "$DOCK" json-leaves.json

# X2  import-and-walk: arrow pools, (r)=>string[], ${x.slot} templates, string arrays
#                                    -> walk.json          (45,260 leaves, 1,621 modules, 145 import fails)
node x2-walk.mjs "$DOCK" walk.json

# X3  inline in-function prose (espree)
#                                    -> inline.json        (19,329 literals, 0 parse failures)
node x5-inline.mjs "$DOCK" inline.json

# X4  JSX, through the estate's own tests/helpers/jsxLiteralWalk.js
#                                    -> jsx.json           (12,809 segments, 525/527 files)
node x7-jsx.mjs "$DOCK" jsx.json

# X5  annex rows by the numbered-line grammar + the wiring join (needs the three above)
#                                    -> annex.json         (9,327 rows -> 9,115 prose, 4,289 wired)
node x6-annex.mjs "$DOCK" annex.json walk.json inline.json jsx.json

# register assignment + admission + dedup
#                                    -> corpus.json        (34,508 admitted / 41,369 rejected)
node registers.mjs . corpus.json

# the voice bible's own exemplar corpus, scored by the same instrument
#                                    -> bible.json         (67 exemplars / 42 anti-corpus)
node bible.mjs "$DOCK" bible.json

# the bible's HARD RULES, counted with NO length floor
#                                    -> mechanical.json    (53,662 prose strings, 153 em, 0 excl)
node mechanical.mjs . mechanical.json

# every table, tic, distance and outlier
#                                    -> report.json + report.table.md
node run.mjs . report

# the cross-check against the published house rates (dossier §3 / taste-sample-refutation §2)
node crosscheck.mjs

# report sections regenerated from report.json
node emit-tics.mjs && node emit-outliers.mjs
```

Single metric lookups:

```sh
node -e 'const R=require("./report.json"); console.log(JSON.stringify(R.metrics.R6,null,1))'
node -e 'const R=require("./report.json"); R.tics.R6.forEach(t=>console.log(t.count,t.lift,t.gram))'
node -e 'const R=require("./report.json"); console.log(R.bible.styleRank)'
node -e 'const M=require("./mechanical.json"); console.log(M.examples.R8.em)'
```

Artefacts, all under `scratchpad/prose-research/probe-all/`:

| file | what |
|---|---|
| `x1-json-leaves.mjs` · `json-leaves.json` | the projected corpus with block id, pool key, angle, audience |
| `x2-walk.mjs` · `walk.json` · `walk.failures.json` | 45,260 leaves, each with its export path and shape tag |
| `x5-inline.mjs` · `inline.json` | 19,329 in-function literals with file and line |
| `x7-jsx.mjs` · `jsx.json` | the JSX census through the estate's own walker |
| `x6-annex.mjs` · `annex.json` · `annex.perannex.json` | annex rows, wired stamp, per-annex tally |
| `registers.mjs` · `corpus.json` · `corpus.rejected.json` | the register map, admission, dedup, stratified reject sample |
| `metrics.mjs` | the measures and the tic miner, shared by corpus and bible |
| `bible.mjs` · `bible.json` | the voice bible's exemplar and anti-corpus, scored |
| `mechanical.mjs` · `mechanical.json` | hard rules with no length floor, plus examples |
| `run.mjs` · `report.json` · `report.table.md` | every deliverable |
| `crosscheck.mjs` | the verification in §8 |

---

## 8. VERIFICATION — this instrument reproduces the published house rates

Run `node crosscheck.mjs`. Over R1+R2 (n=2,729 admitted of the 2,734 the projection holds), against
the figures the chair's dossier §3 and the refuter's §2 published from a **different** extractor:

| figure | this probe | published | |
|---|---:|---:|---|
| one-sentence variants | **2030** | 2030 | exact |
| two-sentence variants | 688 | 691 | −3 |
| three-sentence variants | **11** | 11 | exact |
| words/segment mean (state) | 16.8 | 16.7 | +0.1 |
| words/segment sd (state) | **7.2** | 7.2 | exact |
| p10 / p50 / p90 (state) | **7** / 17 / **26** | 7 / – / 26 | exact |
| share under 8 words (state) | **0.130** | 0.13 | exact |
| semicolons, state | 385 | 386 | −1 |
| semicolons, causal | 168 | 169 | −1 |
| causal segments over 30 words | **0.491** | 0.49 | exact |
| pools measured (R1) | **708** | 708 | exact |
| pools uniform in sentence count (R1) | **408** (0.576) | 407 (0.575) | +1 |
| pools with a repeated two-word opener (R1) | **79** (0.112) | 79 (0.112) | exact |
| "rather than", variants in R1+R2 | **288** | 288 | exact |
| "already" | **26** | 26 | exact |
| "kind of / sort of" | **29** | 29 | exact |

The pool rows are R1's own (the dossier measured the state corpus, whose pool count is 708); the
combined R1+R2 figures over 786 pools are 0.570 and 0.123.

Two deliberate differences remain: the pet-word table counts **occurrences**, not variants, so
`nobody/no one/nothing` reads 512 here against the dossier's 333 variants; and this probe's
`quiet(ly)` pattern has no trailing space, so it catches `quiet.` and `quiet,` (59 against 37).
Everything else agrees to within one or two rows, from a wholly independent extraction path.

**Labelling.** Every figure in this report is **CONFIRMED** — executed, from artefacts on disk that
the commands above regenerate. The two interpretive claims are labelled where they appear: that the
chrome registers top Axis B *because the bible's exemplar set is itself chrome* is **PLAUSIBLE**
(reasoning over the measured composition in §5), and that R7's `10,000 people` digits are or are not
a breach is **not ruled on** — the bible's numeral rule is contextual and that call is the chair's.
