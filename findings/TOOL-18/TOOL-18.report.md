# TOOL-18 — quoted prose inside CODE modules: the population by source, the reach today, the sixty-day growth, and three shapes priced

**Lane:** TOOL-18 (Opus RECON, READ-ONLY — edited nothing, built nothing, ran no gate).
**Chair:** Fable 5.1, session a9df403c. **Charter slot:** ODQ §934.47 addendum 83, TOOL-12's item 12.
**Stamp (read from `date` in the same call as the last measurement):** `Sun Sep 20 09:10:04 EDT 2026`.
**Read tip:** `$SP/read-tip-tool18` detached at **`6a3e8089f`** ("PACKETS: EM-B1f's one retiredSymbols row withdrawn…"). `git status --short` EMPTY at start and at end (both quoted below in §7).
**Dist read (no build run by this lane):** `$SP/lane-tool-12-scratch/dist-ec0a30da2/`, READ-ONLY — 726 emitted `.js` assets, 26,213,702 B. Its tip `ec0a30da2` differs from my read tip by **13 files / 25 insertions / 25 deletions** across the two roots (quoted in §1.4), so it is representative; `src/generators/npcStructure.js` is **byte-identical** between the two tips, which is what makes TOOL-12's figure reproducible here.
**Instruments (all plain `node`, in `$SP/lane-tool-18-scratch/tools/`):** `prosepop.mjs`, `report.mjs`, `groups.mjs`, `sample.mjs`, `distreach.mjs`, `distreach2.mjs`, `growth.mjs`, `lines.mjs`, `headroom.mjs`, `final.mjs`. TOOL-12's eight tools were copied in unmodified as instructed and `literals.mjs`'s rule was transcribed for the reproduction in §1.5.

---

## 0. Headline

**CONFIRMED.** The estate holds **1,770,386 bytes** of authored prose across `src/data/**`, `src/generators/**` and `src/domain/**`. The prose-byte ratchet reaches **366,240** of them — **20.7 %**. The other **1,404,146 B** is bounded by nothing that measures bytes.

And the population is not where TOOL-12's item 12 pointed. **`src/generators/**` is the stable part**: its prose grew **+6,819 B (+5.1 %)** in sixty days. The growth is in `src/domain/**` — `worldPulse` **+139 %**, and an engineering register (`src/domain/certification/**`) that went from **495 B to 416,965 B** and **ships 0.0 % of it**. Product-side shipping prose in code modules grew **+150,364 B (+25.0 %)** in sixty days.

Two facts decide the proposal:

1. **A declaration costs the engine chunk's 365 B margin exactly ZERO bytes.** `scripts/.prose-byte-baseline.json` and `tests/lint/**` reach no emitted chunk. Shapes (a) and (b) are both free against TOOL-12's ledger; only (c) is a placement question.
2. **The one instrument that does reach these 1,172 files still permits ~102 MB of further prose.** eslint's `max-lines` 800 (`eslint.config.js:687`) leaves **712,098 unused effective lines** across the two roots, at a measured **143.3 B per prose segment**. That is not a bound; it is a rounding error.

**I recommend shape (b), in a synthesised form** — a shrink-only ceiling on TOTAL prose bytes per root, three rows not forty, with the declared-row door the estate already machine-checks and a NON-ASSERTED per-file diagnostic map printed on the red. Not (a): its RAW-EXACT idiom does not survive contact with files that change on every fix. Not (c) as an accounting cure: `src/data` already holds **234,998 B** of prose the ratchet does not name, so a move there buys no bound at all. §4 argues it.

---

## 1. The population, by SOURCE

### 1.1 The rule, stated exactly, and why there are three of them

Not a regex over the file: a real parse — **acorn 8.16.0 with `acorn-walk`** (both already `devDependencies` of this tree, alongside `espree ^11.2.0`, and at least twelve `tests/` and `scripts/` files already parse this way). A parse means comments, regex literals and module specifiers cannot be mistaken for authored text, and a literal's bytes are its **cooked content**, not its quoted span.

A **segment** is one string `Literal` or one template `quasi`. Import/export sources and directive prologues are excluded.

- **M1 — the brief's rule, verbatim.** `s.length >= 40 && s.includes(' ') && /[.!?,]$/.test(s)`.
- **M2 — M1 with the segment's trailing whitespace trimmed before the ending test.**
- **M3 — authored text.** M2 for plain literals; for a template, the template is judged **whole** (quasis joined with an `X` standing for each interpolation, trailing placeholders trimmed) and, when the whole reads as prose, **all** its quasi bytes count.

**M1 is the reported population** because it is the rule the chair set. M2 and M3 are carried beside it because **M1 structurally under-counts interpolated prose** — a quasi that stops at `${` usually ends in a space, and TOOL-12 already observed that `narrativeData.js`'s "prose is mostly interpolated templates". Measured, that gap is small at estate scale and concentrated in a few files:

| measure | bytes | vs M1 | segments/units |
|---|---|---|---|
| M1 (the brief's rule) | **1,169,148** | — | 8,156 |
| M2 (trimmed) | 1,179,352 | +10,204 (+0.9 %) | 8,277 |
| M3 (authored text) | 1,244,221 | **+75,073 (+6.4 %)** | 8,962 |

Where M3 − M1 lands, the six largest carriers: `src/domain/worldPulse/commercialReceiptPools.js` **+5,466**, `worldPulse/warReceiptPools.js` **+5,243**, `src/generators/narrativeText.js` **+4,956**, `worldPulse/eventProse.js` **+4,102**, `src/generators/power/settlementNarrative.js` **+2,822**, `src/generators/safetyProfile.js` **+2,738** (and `generators/power/governanceNarrative.js` +1,817). **Any instrument built on M1 will under-report the template-heavy modules — the receipt pools and the narrative generators — by roughly a third of their own prose.** That belongs in the instrument's docblock, not in a footnote.

### 1.2 The false-positive check on twenty sampled literals

Sampling is deterministic — the 8,156 M1 segments in file+offset order, every 407th, twenty of them. No RNG, no clock. Verdicts are mine, by reading each one:

| # | verdict | file |
|---|---|---|
| 1 | product prose | `src/domain/activeConditions.js` — "A virulent illness spreads through the settlement." |
| **2** | **NOT product prose** — a 3,250-character design directive | `src/domain/certification/subsystemRowsOps.js` |
| **3** | **NOT product prose** — a 7,218-character engineering finding | `src/domain/certification/subsystemRowsWaves.js` |
| 4 | product prose (UI copy) | `src/domain/compendium/generated/compendiumData.generated.js` |
| 5–13 | product prose (9 items) | `causeConjunctionClassContent`, `causeConjunctionRole/{criminal,healer,military}`, `display/defenseDisplay`, `display/newsVoice`, `display/treatyDocument`, `factionRelationshipUpdate`, `rulingPower` |
| **14** | **NOT product prose** — a `note:` field in a tunable register | `src/domain/worldPulse/demographicsRates.js` |
| 15–20 | product prose (6 items) | `worldPulse/operations/operationGrammar`, `worldPulse/sovereigntyReceiptPools`, `worldPulse/warReceiptPools`, `generators/crossSettlementConflicts`, `generators/narrativeText`, `generators/power/rulingStructure` |

**Measured false-positive rate: 3 of 20 by segment count (15 %).** All three are the same shape — authored English inside an **engineering register**, not product-facing text. That is not noise to wave away: by BYTES the register family is **35.7 % of M1**, so it is split out everywhere below rather than averaged in. Outside that family the sampled rate is **0 of 17**.

The split is not a judgment call. It is measured (§2.4): the certification register **ships 162 of 416,965 bytes — 0.0 %**, and sample 14's literal is absent from the dist too.

### 1.3 The population table

Estate: **1,172 `.js` files, 0 parse failures** (a silent skip would have been a false green, so failures are counted and printed; there were none). **21,794,714 B of source**, of which **11,150,178 B (51.2 %) is comments** and **2,244,757 B (10.3 %) is literal content**.

| group | files | source B | literal B | **M1 prose B** | % of M1 | M3 prose B |
|---|---|---|---|---|---|---|
| `src/domain/certification/**` (the engineering register) | 35 | 1,074,813 | 491,263 | **416,965** | 35.7 % | 418,839 |
| `src/domain/display/causeConjunctionRole/**` | 12 | 259,299 | 203,036 | **203,036** | 17.4 % | 203,036 |
| `src/domain/worldPulse/**` | 443 | 9,544,000 | 468,666 | **147,436** | 12.6 % | 187,590 |
| **`src/generators/**`** (TOOL-12's roots) | 114 | 1,723,075 | 316,106 | **140,768** | 12.0 % | 162,221 |
| `src/domain/display/**` (rest) | 116 | 1,995,642 | 236,097 | **107,861** | 9.2 % | 109,720 |
| `src/domain/**` `*.generated.js` | 4 | 196,376 | 100,618 | **53,622** | 4.6 % | 53,622 |
| `src/domain/**` (all other) | 448 | 7,001,509 | 428,971 | **99,460** | 8.5 % | 109,193 |
| **ESTATE TOTAL** | **1,172** | **21,794,714** | **2,244,757** | **1,169,148** | 100 % | **1,244,221** |

Groups cover 1,172/1,172 files and 1,169,148/1,169,148 M1 bytes — asserted exact by the instrument, so nothing is double-counted or dropped.

**Product-side M1 (estate minus the certification register) = 752,183 B over 353 files.**

**Top forty by M1 prose bytes.** `ships` is §2.4's measurement (the share of that file's prose found verbatim in the emitted JS).

| # | M1 prose B | % of file | literal B | source B | segs | ships | module |
|---|---|---|---|---|---|---|---|
| 1 | 62,016 | 60.7 % | 66,584 | 102,117 | 88 | **0 %** | `src/domain/certification/subsystemRowsWaves.js` |
| 2 | 52,939 | 70.8 % | 55,746 | 74,811 | 70 | **0 %** | `src/domain/certification/subsystemRowsGrowth.js` |
| 3 | 44,135 | 56.9 % | 51,480 | 77,549 | 127 | **0 %** | `src/domain/certification/subsystemRowsWar.js` |
| 4 | 40,177 | 62.0 % | 43,360 | 64,755 | 60 | **0 %** | `src/domain/certification/subsystemRowsBelief.js` |
| 5 | 39,800 | 78.3 % | 41,099 | 50,820 | 23 | **0 %** | `src/domain/certification/subsystemRowsSeat.js` |
| 6 | 36,412 | 38.5 % | 60,424 | 94,584 | 355 | 100 % | `src/domain/compendium/generated/compendiumData.generated.js` |
| 7 | 34,526 | 57.1 % | 38,960 | 60,504 | 73 | **0 %** | `src/domain/certification/subsystemRowsPeople.js` |
| 8 | 34,463 | 64.2 % | 35,001 | 53,661 | 342 | 100 % | `src/domain/display/newsVoice.js` |
| 9 | 32,375 | 54.1 % | 34,969 | 59,877 | 54 | **0 %** | `src/domain/certification/subsystemRowsCompact.js` |
| 10 | 31,543 | 58.1 % | 37,166 | 54,251 | 405 | 100 % | `src/domain/worldPulse/warReceiptPools.js` |
| 11 | 30,068 | 54.6 % | 32,459 | 55,039 | 285 | 100 % | `src/domain/display/institutionVocabulary.js` |
| **12** | **28,145** | **68.4 %** | 29,523 | 41,135 | 228 | 100 % | **`src/generators/npcStructure.js`** |
| 13 | 27,914 | 45.7 % | 30,880 | 61,105 | 59 | **0 %** | `src/domain/certification/subsystemRowsVirtual.js` |
| 14 | 20,393 | 60.8 % | 21,821 | 33,548 | 36 | **0 %** | `src/domain/certification/subsystemRowsOps.js` |
| 15 | 17,584 | 78.8 % | 17,584 | 22,315 | 126 | 100 % | `src/domain/display/causeConjunctionRole/dissident.js` |
| 16 | 17,490 | 78.6 % | 17,490 | 22,242 | 126 | 100 % | `src/domain/display/causeConjunctionRole/diplomatOutsider.js` |
| 17 | 17,210 | 23.9 % | 31,442 | 71,997 | 84 | 100 % | `src/domain/content/customContentManifest.generated.js` |
| 18 | 17,163 | 78.4 % | 17,163 | 21,881 | 126 | 100 % | `src/domain/display/causeConjunctionRole/laborResource.js` |
| 19 | 17,020 | 78.4 % | 17,020 | 21,720 | 126 | 100 % | `src/domain/display/causeConjunctionRole/healer.js` |
| 20 | 16,961 | 78.4 % | 16,961 | 21,630 | 126 | 100 % | `src/domain/display/causeConjunctionRole/civic.js` |
| 21 | 16,909 | 78.4 % | 16,909 | 21,576 | 126 | 100 % | `src/domain/display/causeConjunctionRole/merchant.js` |
| 22 | 16,857 | 78.3 % | 16,857 | 21,516 | 126 | 100 % | `src/domain/display/causeConjunctionRole/heir.js` |
| 23 | 16,832 | 78.2 % | 16,832 | 21,524 | 126 | 100 % | `src/domain/display/causeConjunctionRole/arcane.js` |
| 24 | 16,747 | 78.2 % | 16,747 | 21,408 | 126 | 100 % | `src/domain/display/causeConjunctionRole/military.js` |
| 25 | 16,617 | 78.0 % | 16,617 | 21,309 | 126 | 100 % | `src/domain/display/causeConjunctionRole/criminal.js` |
| 26 | 16,597 | 78.0 % | 16,597 | 21,275 | 126 | 100 % | `src/domain/display/causeConjunctionRole/religious.js` |
| 27 | 16,259 | 77.8 % | 16,259 | 20,903 | 126 | 100 % | `src/domain/display/causeConjunctionRole/ruler.js` |
| 28 | 15,409 | 73.8 % | 15,409 | 20,867 | 126 | 100 % | `src/domain/display/causeConjunctionClassContent.js` |
| 29 | 14,123 | 37.8 % | 17,189 | 37,319 | 39 | **0 %** | `src/domain/certification/subsystemRowsBaseline.js` |
| 30 | 12,619 | 43.0 % | 13,946 | 29,318 | 36 | **0 %** | `src/domain/certification/subsystemRowsPlace.js` |
| **31** | 12,462 | 29.1 % | 19,179 | 42,767 | 117 | 100 % | **`src/generators/safetyProfile.js`** |
| **32** | 12,326 | 27.9 % | 30,017 | 44,144 | 84 | 100 % | **`src/generators/narrativeText.js`** |
| **33** | 11,899 | 27.1 % | 15,567 | 43,953 | 102 | 100 % | **`src/generators/power/rulingStructure.js`** |
| 34 | 10,461 | 21.9 % | 12,627 | 47,830 | 176 | 100 % | `src/domain/factionRelationshipUpdate.js` |
| 35 | 9,851 | 62.0 % | 10,110 | 15,894 | 9 | **0 %** | `src/domain/certification/subsystemRowsCoin.js` |
| 36 | 9,628 | 44.6 % | 10,585 | 21,581 | 28 | **0 %** | `src/domain/certification/subsystemRowsRegen.js` |
| **37** | 8,686 | 25.3 % | 13,439 | 34,338 | 61 | 100 % | **`src/generators/power/governanceNarrative.js`** |
| 38 | 8,310 | 42.4 % | 9,726 | 19,584 | 80 | 100 % | `src/domain/hookThemes.js` |
| 39 | 7,588 | 56.1 % | 8,039 | 13,517 | 13 | **0 %** | `src/domain/certification/subsystemRowsEncounters.js` |
| 40 | 6,990 | 29.7 % | 8,402 | 23,574 | 29 | **0 %** | `src/domain/worldPulse/changeAuthorityPolicy.js` |

**TOP 40 = 875,504 B (74.9 %). LONG TAIL (1,132 files) = 293,644 B (25.1 %).** 375 files hold any M1 prose at all; 797 hold none.

The coverage curve, product-side (certification excluded), which prices shape (a) directly:

| top N files | prose B | share of the 752,183 |
|---|---|---|
| 5 | 160,631 | 21.4 % |
| 10 | 247,098 | 32.9 % |
| 20 | 408,748 | 54.3 % |
| **40** | **543,083** | **72.2 %** |
| 80 | 646,237 | 85.9 % |
| 200 | 729,402 | 97.0 % |

### 1.4 The dist's staleness against my read tip, stated exactly

```
$ git -C <read-tip> diff --stat ec0a30da2 6a3e8089f -- src/generators src/domain
 src/domain/certification/subsystemRowsBaseline.js  |  4 ++--
 src/domain/certification/subsystemRowsGrowth.js    |  2 +-
 src/domain/certification/subsystemRowsWar.js       | 18 +++++++++---------
 src/domain/display/stateProse/dossierMounts.js     |  6 +++---
 src/domain/display/stateProse/generalStateProse.js |  2 +-
 src/domain/display/stateProse/printProse.js        |  4 ++--
 src/domain/display/viabilityVerdict.js             |  2 +-
 src/domain/institutions/institutionTable.js        |  2 +-
 src/domain/prose/holderTable.js                    |  2 +-
 src/domain/prose/wiringCensus.js                   |  2 +-
 src/domain/undercity/colonization.js               |  2 +-
 src/domain/undercity/monotoneComponents.js         |  2 +-
 src/domain/worldPulse/seatIntervention.js          |  2 +-
 13 files changed, 25 insertions(+), 25 deletions(-)
```

All population figures are measured **at the read tip**. Only the `ships` column reads the dist, and no file in the list above carries a `ships` figure that the 25-line drift could plausibly move.

### 1.5 `npcStructure.js` — TOOL-12's 26,939 reproduced, and the rendered-vs-source difference explained

**CONFIRMED, exactly.** TOOL-12's `literals.mjs` rule transcribed verbatim and run against the same dist chunk, over `npcStructure.js` at my read tip:

```
TOOL-12 rule: literals 231 found 231 bytes 26939
source bytes 41135
```

231 of 231 literals found — the module's authored text is in the chunk in full. The file's measured row:

| figure | bytes | what it is |
|---|---|---|
| source on disk | **41,135** | `statSync().size` at `6a3e8089f` |
| comments | 3,122 | acorn comment ranges |
| literal content (all segments) | 29,523 | 359 segments, cooked values |
| **M1 prose (this lane)** | **28,145** | 228 segments, ≥ 40 ch + space + terminal punctuation |
| TOOL-12's literal bytes | 26,939 | 231 literals, ≥ 16 ch, SAFE charset, **found in the chunk** |
| Rollup `renderedLength` | 39,921 | TOOL-12 §2.2, pre-minification |

**The difference between rendered and source is not a prose figure at all.** `renderedLength` (39,921) is Rollup's pre-minification rendering of the module — source less its 3,122 comment bytes, plus ~1,908 B of import rewriting and export-binding emission. TOOL-12's **67.5 %** is `26,939 / 39,921` — literal bytes proven present in the emitted chunk, over the module's rendered length. My **68.4 %** is `28,145 / 41,135` — parsed prose bytes over source bytes. **The two rules agree to within 4.5 %** on the same file, which is the cross-check worth having: the regex instrument and the parser instrument do not disagree about this module.

The 1,206 B gap is the two rules' definitions, not an error in either: mine admits any parsed literal of ≥ 40 characters with a terminal `. ! ? ,` and needs no dist hit; TOOL-12's admits any literal of ≥ 16 characters restricted to `[A-Za-z0-9 ,.:;()?!'-]` and requires one.

---

## 2. The reach today, and the gap

### 2.1 `scripts/.prose-byte-baseline.json` — reaches ZERO of the 1,172

**CONFIRMED by set intersection:** the baseline names **10 leaves**; **0** of them lie under `src/generators/` or `src/domain/`. That is by construction and the instrument says so — `proseLeavesOnDisk()` (`tests/lint/proseCorpusBytes.test.js:103-109`) is `readdirSync('src/data/dossierStateProse')` filtered to `.generated.js`, plus `CAUSAL_LEAF`, plus the three named `COMPOSER_LEAVES`. No code module can enter that set by any path.

The bounded corpus, for scale: the ten leaves' committed raw is **1,145,178 B**; the six state leaves are **884,698** against a ceiling of **2,800,000** (ARCH §10's arithmetic, re-derived by the test rather than trusted).

### 2.2 The reach is smaller than the baseline's own directory — `src/data` itself leaks

**CONFIRMED, and this is the sharpest finding in §2.** `src/data/**` holds **601,238 B** of M1 prose. Only **366,240 B** of it sits inside the ten baselined leaves. **234,998 B of prose lives in `src/data` and is named by nothing:**

| M1 prose B | baselined? | file |
|---|---|---|
| 66,835 | **no** | `src/data/institutionDescVariants.js` |
| 47,868 | **no** | `src/data/institutionServices.js` |
| 31,072 | **no** | `src/data/institutionalCatalog.js` |
| 28,680 | **no** | `src/data/narrativeData.js` |
| 20,447 | **no** | `src/data/npcData.js` |

This matters far beyond bookkeeping: it is the **direct refutation of shape (c)**. Moving prose out of code into `src/data` does not put it under the ratchet, because the ratchet's roster is a walk of one sub-directory plus four names.

### 2.3 What the other instruments actually bound

| instrument | reaches these files? | what it bounds |
|---|---|---|
| `scripts/.prose-byte-baseline.json` + `proseCorpusBytes.test.js` | **no** — 0 of 1,172 | RAW bytes exactly, GZIP ±1 %, per leaf, with a machine-checked declared chain |
| **`eslint` `max-lines` 800** (`eslint.config.js:687`; layer rule `sizeBaseline.test.js` `ceilingFor()` returns 800 for `^src/generators/.*\.js$` and `^src/domain/.*\.js$`) | **yes — all of them** | **effective LINES**, skipping blanks *and comments*. See §2.5: it permits ~102 MB more prose |
| `scripts/.size-baseline.json` | 6 of 1,172 (7 rows total, 1 under `src/generators`, 5 under `src/domain`) | per-file frozen line overrides for files above their layer ceiling |
| `docs/content/wiring-census.json` + `proseWiringCensus.walker.test.js` | **no** — it names 13 `src/domain/display/stateProse/*` paths and nothing else | pools and variant COUNTS, not bytes. Its only four mentions of `src/generators` are fact-provenance strings for `defenseGenerator.js` (`economicGates literal, two alias hops`), never prose |
| `tests/property/dossierProseManifest.test.js` + `dossier-prose-manifest-golden.json` | **no** | 1,050 rows of **SHA-256 hashes** over composed dossier prose |
| `tests/fixtures/generator-golden-master.json` | **indirectly** | 525 seeds × 64 **SHA-256 hashes**. It makes a *change* to shipped generator prose visible; it bounds no byte. Prose added on a branch no pinned seed reaches moves nothing |
| `tests/lint/proseNumerics.test.js` | **yes** — walks all of `src/` | numeric leaks inside prose; a reviewed-row ceiling of 218. Shape, not size |
| `tests/copy/voiceMechanics.test.js` | **yes** — Tier 2 (`src/data`+`src/domain`, 55 rows), Tier 5 (`src/generators`, 7 rows) | per-file `{em, bang}` counts, shrink-only. Punctuation, not size |
| `tests/fixtures/.golden-freeze-register.json` | **no** — 0 `src/generators`/`src/domain` paths named | — |

**The gap: every one of the 1,169,148 M1 prose bytes in code modules is outside every byte instrument in the estate.** Three instruments reach the files and bound punctuation, numeric leaks and line counts; none bounds size.

### 2.4 Does it ship? — the measurement that splits the population

Method: for each of the 8,156 M1 segments, look for it verbatim in the 726 emitted `.js` assets. String literals survive minification character-for-character; a segment containing a quote or backslash is tested by its longest quote-free run of ≥ 30 characters, so **8,140 of 8,156 segments (1,168,423 of 1,169,148 B, 99.94 %) are testable** and only 725 B is unresolved.

```
  testable (direct or via a >=30-char quote-free run)  8140 segs / 1168423 B
  FOUND in emitted JS                                  7048 segs / 708772 B => 60.7% SHIPS
  not found                                            1092 segs / 459651 B
  still untestable                                       16 segs /    725 B

BY GROUP                                   testableB     shipsB   ship%   untestableB
src/domain/certification/                   416965        162     0.0%           0
src/generators/                             140684     139782    99.4%          84
src/domain/ (non-certification)             610774     568828    93.1%         641
```

**Prose that does not ship — 20 files, 434,097 B, 416,803 of it the certification register:**

`subsystemRows{Waves 62,016 · Growth 52,939 · War 44,135 · Belief 40,177 · Seat 39,800 · People 34,526 · Compact 32,375 · Virtual 27,914 · Ops 20,393 · Baseline 14,123 · Place 12,619 · Coin 9,851 · Regen 9,628 · Encounters 7,588 · Memory 5,538}`, plus `worldPulse/changeAuthorityPolicy.js` 6,990, `aiCharter.js` 5,845, `tuning/proposedSoakBands.js` 3,452, `worldPulse/faithTuningSurface.js` 2,135, `worldPulse/demographicsRates.js` 2,053.

**A corroboration worth recording.** The same instrument over `src/data` reports **85.3 % ships**, and names the two files that do not: `src/data/dossierCausalProse.generated.js` (**85,931 B**) and `src/data/foundingSeeds.js` (2,224 B). The causal leaf reaching no emitted chunk is exactly what `.prose-byte-baseline.json`'s `_causalLeafGround` records ("the leaf reaches NO EMITTED CHUNK at all at this tip"). **That claim is independently CONFIRMED at `6a3e8089f` by a different instrument, one tip and twelve days after it was written.**

### 2.5 How much the one reaching instrument still permits

Approximated — **this lane ran no eslint**; a line holding at least one character that is neither whitespace nor inside a comment, computed from acorn's comment ranges. Labelled an approximation; the claim needs no precision.

```
files 1172   total approx effective lines 228255   mean 195
files already OVER 800: 7   largest: src/domain/content/customContentManifest.generated.js 2037
UNUSED line headroom under the 800 ceiling: 712098 lines
mean M1 prose bytes per segment: 143.3
=> prose bytes the 800-line ceiling still permits, estate-wide: ~102,077,974 B
```

Per file, on the heaviest carriers — `ceiling − approxEffLines`, and the file's own bytes per effective line:

| M1 prose | approx eff lines | headroom (lines) | B / eff line | module |
|---|---|---|---|---|
| 39,800 | 97 | **703** | 524 | `subsystemRowsSeat.js` → ~368 kB more before eslint reds |
| 28,145 | 385 | **415** | 107 | `src/generators/npcStructure.js` → ~44 kB more |
| 31,543 | 687 | 113 | 79 | `worldPulse/warReceiptPools.js` → ~9 kB more |
| 34,463 | 530 | 270 | 101 | `display/newsVoice.js` → ~27 kB more |

**`npcStructure.js` — the file TOOL-12 named — may take on another ~44 kB of prose, roughly 2.5× its current prose mass, without reddening anything in the estate.**

---

## 3. Growth over sixty days

Two tips, both measured with the same instrument:

- tip: **`6a3e8089f`**
- sixty days earlier: `git rev-list -1 --before='60 days ago' 6a3e8089f` → **`128af63c4fc6e12df29e7bf8d31fa907e7e0f92b`**, `2026-07-22 08:12:58 -0400`, "Fold K-5: the adaptive fidelity governor — THE KERNEL BUILD PROGRAM CLOSES". Extracted with `git archive` into scratch; no checkout, no git mutation.

```
OLD 578 files / 602314 M1 B     TIP 1172 files / 1169148 M1 B     DELTA 566834 (+94.1%)
files: NEW 164, GONE 1, changed-in-place 137
gross growth +783428; gross shrink -216594; net 566834
growth arriving in NEW files: 763705 (97.5% of gross growth)
```

### 3.1 ⚠ One entry in the top-ten is a FILE SPLIT, not growth — say so before the table is read

`src/domain/display/causeConjunctionRoleContent.js` lost **−203,036 B** and the twelve new `src/domain/display/causeConjunctionRole/*.js` files hold **exactly 203,036 B**. Identical to the byte. That is a re-home; it contributes **0** to the estate's prose. Left unstated it would put four files in a "fastest-growing" table that grew nothing. This is why the table below is reported **by group**, where the split nets to zero on its own row, rather than only by file.

### 3.2 The growth, by group

| group | old (2026-07-22) | tip (2026-09-20) | delta | % |
|---|---|---|---|---|
| `src/domain/certification/**` — **ships 0.0 %** | 495 | 416,965 | **+416,470** | ×842 |
| `src/domain/worldPulse/**` | 61,581 | 147,436 | **+85,855** | **+139 %** |
| `src/domain/**` (other) | 103,747 | 153,082 | **+49,335** | +48 % |
| `src/domain/display/**` (rest) | 99,506 | 107,861 | +8,355 | +8 % |
| **`src/generators/**`** | **133,949** | **140,768** | **+6,819** | **+5 %** |
| `causeConjunctionRole*` (the split — net zero) | 203,036 | 203,036 | 0 | 0 % |
| **TOTAL** | **602,314** | **1,169,148** | **+566,834** | **+94 %** |

**Product-side (certification excluded): 601,819 → 752,183 = +150,364 B, +25.0 % in sixty days** — about **+2,500 B per day** of shipping authored prose entering code modules, none of it through any declared row.

### 3.3 The ten files whose prose grew most

Every one is a NEW file; **growth inside pre-existing files was only +19,723 B (2.5 % of gross growth)**. The corpus is not swelling inside existing modules — it arrives as new modules.

| # | delta | state | module |
|---|---|---|---|
| 1 | +62,016 | NEW | `src/domain/certification/subsystemRowsWaves.js` |
| 2 | +52,939 | NEW | `src/domain/certification/subsystemRowsGrowth.js` |
| 3 | +44,135 | NEW | `src/domain/certification/subsystemRowsWar.js` |
| 4 | +40,177 | NEW | `src/domain/certification/subsystemRowsBelief.js` |
| 5 | +39,800 | NEW | `src/domain/certification/subsystemRowsSeat.js` |
| 6 | +34,526 | NEW | `src/domain/certification/subsystemRowsPeople.js` |
| 7 | +32,375 | NEW | `src/domain/certification/subsystemRowsCompact.js` |
| 8 | +31,543 | NEW | `src/domain/worldPulse/warReceiptPools.js` |
| 9 | +27,914 | NEW | `src/domain/certification/subsystemRowsVirtual.js` |
| 10 | +20,393 | NEW | `src/domain/certification/subsystemRowsOps.js` |

Shrinks, for completeness: `causeConjunctionRoleContent.js` −203,036 (the split), `worldPulse/eventProse.js` −8,208, `src/generators/data/deityPool.js` −1,094 (file gone), `generators/narrativeGenerator.js` −634, `generators/power/governanceNarrative.js` −620, `generators/npcStructure.js` −171.

### 3.4 The answer to the chair's actual question

> *"so the chair sees whether the corpus is growing inside code modules or merely sitting there."*

**It is growing — but not where TOOL-12's item 12 pointed.** `src/generators/**`, the root that raised the question, is the estate's **most stable** prose (+5.1 % in sixty days; `npcStructure.js` itself *shrank* by 171 B). The growth is entirely `src/domain/**`, and the largest single contributor is an **engineering register that ships none of its 416,965 bytes** — which is a governance question of a completely different kind from the corpus-accounting one.

---

## 4. The three shapes, priced, and the recommendation

**Ledger cost first, because it is the same for two of the three.** TOOL-12's engine-chunk margin is **365 B**. A declaration costs **ZERO bytes**: `scripts/.prose-byte-baseline.json` has exactly one consumer and it is a test (asserted by `proseCorpusBytes.test.js:393-402`), and nothing under `scripts/` or `tests/` reaches an emitted chunk. **(a) and (b) are both free against the 365 B.** Only (c) touches it.

### Shape (a) — extend the row-by-row declaration to the top-N code modules

**Price.** N × a `genesis` row and a `leaves` row (4 committed numbers each), plus a new `_ceilingArithmetic` for a code-module leaf-set. At **N = 40: 72.2 %** of product-side prose; at N = 20, 54.3 %; to reach the 97 % the state leaves enjoy you need **N = 200**.

**Three costs the brief's sketch does not price, all measured:**

1. **RAW-EXACT does not transfer to a code module.** The ten leaves are `.generated.js` artefacts that move only when a projector runs. A generator module moves on **every fix**. A RAW-exact row on `npcStructure.js` reds on any commit touching it — including a pure-code change with no prose in it — and forces a row edit, and a `declared` row for any growth. Forty such rows turn **every** generator and domain lane into a declared-row author, and the idiom's honesty arm ("below fails, LOWER the row and bank the shrink") becomes pure noise. The only escape is to make the row measure **prose bytes, not file bytes**, which means the `RAW is EXACT` arm stops measuring the artefact and starts measuring a derived quantity — a real change to the idiom, and an owner's call because `_instrument` states the exactness as the instrument's whole basis.
2. **The roster cannot be a hand-list.** The instrument's own header says the leaves are "DERIVED from the directory, never a hand-list". A top-N list of code modules is exactly a hand-list, and a file that falls off it grows unwatched.
3. **A ceiling would have to be invented.** ARCH §10's arithmetic prices *faces* and *semantic pieces*. It says nothing that prices a generator's variant table, so the apportionment that makes the existing ceiling re-derivable has no analogue. A hand-set number here is the "headroom given by arithmetic" the baseline's `_newLeafCeilingArithmetic` explicitly refuses to do.

**Engine-chunk ledger: 0 B.**

### Shape (b) — a shrink-only per-root ceiling on TOTAL prose bytes

**Price.** One figure per root; the same parse; the same `declared` door, already machine-checked. Immune to (a)'s cost 1: a code edit that touches no prose moves nothing, so only a lane that actually writes prose meets the instrument.

The brief's stated weakness — *"coarse, cannot say which file grew"* — **is removable, and that is the synthesis I would put to the chair.** Assert the **total** (shrink-only, declared rows for a raise). Carry a **`_diagnostic` per-file map that is NOT asserted** and is refreshed freely; on a red, print the per-file deltas against it with `process.stdout.write` (per the chair's report-only ruling of 2026-09-20 — vitest 4.1.8's default reporter drops a passing test's `console.log`). The lane that raises the total is then handed the file that grew, without forty ratcheted rows.

**Three rows, not one**, because §3 says the roots behave differently and one number would have hidden all of it:

| row | today | what it watches |
|---|---|---|
| `src/generators/**` | 140,768 | the engine chunk's authored text — **stable, +5 % / 60 d** |
| `src/domain/**` product (certification excluded) | 752,183 − 140,768 = **611,415** | where the growth is — **+139 % / 60 d** in `worldPulse` |
| `src/domain/certification/**` | 416,965 | the non-shipping register — **×842 / 60 d**, and the chair may want it on a different law entirely |

**Engine-chunk ledger: 0 B.** **Reach: 100 % of the population, by construction** — a new file is inside the root the day it lands, which is exactly the property (a) cannot have and the property that would have caught all 164 new files of §3.

### Shape (c) — move the prose out of code into `src/data` leaves

**Price: a `src/` refactor per module — and, measured, it buys NO BOUND on its own.** §2.2: `src/data` already holds **234,998 B** of prose in five modules that the ratchet does not name, because `proseLeavesOnDisk()` is a walk of `src/data/dossierStateProse/` plus four names. A module moved there joins them, unwatched. **(c) without (a) or (b) is a relocation, not an accounting cure.**

It also has a real ledger cost, unlike the other two, and it is FIX-B2's question not this lane's: `vite.config.js:866-879` **force-routes `src/data/narrativeData.js` into the engine chunk**, so prose moved to `src/data` does not leave the chunk by moving; and TOOL-12's refusal #1 measured the alternative — letting it fall through to `data-lazy` charges **106 emitted chunks** the full payload. Goldens are byte-identical by construction **only if the rendered text is unchanged**, which is a build-and-golden question this read-only lane cannot answer.

**Where (c) is genuinely right** is the narrow case TOOL-12 already priced: a **zero-import pure data module** whose prose is a table, where the move is a placement win (cache granularity) as well as a tidiness one. That is `narrativeData.js`, and it is already in FIX-B2's family.

### The recommendation, in one paragraph

**Take (b), in the synthesised form — three shrink-only prose-byte totals with the existing declared-row door and a non-asserted per-file diagnostic printed on the red — and decline (a); treat (c) purely as a placement question inside FIX-B2's family and never as an accounting cure.** The decisive facts are measured, not argued: (a)'s RAW-EXACT idiom is built for generated artefacts that move when a projector runs, and forty rows on files that move on every fix would convert every lane into a declared-row author while still covering only 72.2 % of the population and missing, by construction, the 164 new files that carried **97.5 % of the last sixty days' growth**; (b) covers 100 % of the population on three numbers, is immune to code-only churn, and — with the diagnostic map — loses only the *ratcheting* of per-file rows, not the *diagnosis*; (c) is refuted as an accounting cure by `src/data`'s own 234,998 unwatched bytes and carries the only nonzero ledger cost of the three. Both (a) and (b) cost the engine chunk's 365 B margin **exactly zero**, so the ledger does not choose between them — the churn cost and the coverage do, and both point the same way. And the chair should note what the measurement changed about the question itself: TOOL-12's item 12 asked whether the baseline should extend to `src/generators/**` literal mass, and the answer is that `src/generators/**` is the one root that does **not** need watching yet (+5 % in sixty days) while `src/domain/**` grew **+139 %** in `worldPulse` and spawned a 416,965-byte register that ships nothing — so an instrument aimed where the item pointed would have watched the stable part and missed all of it.

---

## 5. Claims ledger

**CONFIRMED (executed; command and output quoted above):** the 1,172-file population and every figure in §1.3 and the top-40 table; 0 parse failures; the three measures M1/M2/M3 and their deltas; the twenty sampled literals and the 3/20 false-positive rate; TOOL-12's `npcStructure.js` 26,939 reproduced exactly (231/231); the ship measurement in §2.4 (60.7 % estate, 99.4 % `src/generators`, 0.0 % certification) and its `src/data` corroboration of `_causalLeafGround`; the baseline's zero intersection with the two roots; `src/data`'s 234,998 unbaselined prose bytes; the two-tip growth measurement in §3 and the `causeConjunctionRole` split identity (−203,036 / +203,036); `acorn`/`acorn-walk`/`espree` as declared devDependencies; the goldens being SHA-256 hash registers (525×64 and 1,050 rows); `.golden-freeze-register.json` naming zero paths under the two roots; the wiring census naming only `src/domain/display/stateProse` paths plus four `defenseGenerator.js` fact-provenance strings.

**PLAUSIBLE (reasoned, labelled):** the effective-line figures in §2.5 are **my approximation**, not eslint's — this lane ran no eslint, and the ~102 MB figure is an order-of-magnitude claim, not a byte claim; the ~1,908 B attribution of `npcStructure.js`'s rendered-minus-source-minus-comments to Rollup's import rewriting and export emission is inference from the arithmetic, not from a build; the per-file "how much more this file may take" figures multiply line headroom by the file's own current rate and assume the added prose resembles the existing prose; shape (b)'s claim that a code-only edit never moves a prose total holds for the M1 rule as specified but would need a mutant test in the packet that builds it.

**Not measured (out of this lane's scope, flagged rather than guessed):** whether a (c) move leaves the goldens byte-identical (needs a build and a golden run); whether the 51.2 % comment mass is itself worth an instrument; the emitted-byte cost of the non-`src/generators` prose (TOOL-12 measured the engine chunk only, and `causeConjunctionRole/**`'s 203,036 shipping bytes land in chunks nobody has attributed).

---

## 6. ⛔ Noticed and not touched

Each item is specific enough to slot.

1. **⛔ `src/data` leaks 234,998 B of prose past its own ratchet.** `proseLeavesOnDisk()` (`tests/lint/proseCorpusBytes.test.js:103-109`) derives the roster from `readdirSync('src/data/dossierStateProse')` + `CAUSAL_LEAF` + three `COMPOSER_LEAVES`, so `src/data/institutionDescVariants.js` (66,835 B of prose), `institutionServices.js` (47,868), `institutionalCatalog.js` (31,072), `narrativeData.js` (28,680) and `npcData.js` (20,447) are invisible to it. The file's own header warns about precisely this shape ("A prose leaf projected to some OTHER directory escapes this walk and must be named here in the same commit") — but the warning is scoped to *projected* leaves, and these five are hand-authored. **Slot:** whichever shape the chair picks in §4; it is the cheapest possible first row, since these five are `src/data` files exactly like the ten already baselined. This is the item I would slot first even if §4 is declined wholesale.

2. **⛔ The ceiling's own citation names a document that is not in the repo.** `scripts/.prose-byte-baseline.json`, `tests/lint/proseCorpusBytes.test.js`, `tests/build/vendorPdfLazy.test.js`, `scripts/mutation-sweep.sh` and `scripts/mutation-coverage-manifest.json` all cite **ARCH-COMPOSED-PROSE §10, §11, §12, §13** as the authority for the 2,800,000 ceiling, the apportionment, the `_declaredRowIdiom` and the owner-gated rows. **CONFIRMED: no file of that name is tracked at `6a3e8089f`, no such path exists anywhere in `git log --all --diff-filter=A`, and the search of `/Users/cstokes/Desktop/settlement-engine-kits` and the scratch kit copy returned nothing.** The figures `160.8` (B per added face) and `2.8 MB` appear **only inside the instrument's own docblock and the baseline's `_ceilingArithmetic`**. The law is real and the test re-derives it, so nothing is broken — but a reader sent to §10 to check the arithmetic cannot get there, and an amendment to §10 (which the instrument names as the owner's row, §13 row 17) has no document to amend. **Slot:** an owner's decision point — either the document is restored/located and cited by path, or the citation is re-pointed at the two files that actually hold the law.

3. **⛔ An engineering register grew from 495 B to 416,965 B of prose in sixty days and ships 0.0 % of it.** `src/domain/certification/**` — 35 files, 1,074,813 B of source, 416,965 B of authored English, **162 B of it found in the emitted JS**. It lives under `src/domain/`, so it is governed by the domain layer's 800-line ceiling and by `voiceMechanics`'s Tier-2 baseline, and it is counted in every `src/domain` census. It is not product content and it is not documentation; it is a third thing. **Slot:** the chair's call on whether this register belongs under `src/` at all (where it pays `src/domain`'s governance and is scanned by every `src/` walker) or under `docs/`/`scripts/` with the rest of the estate's self-audit apparatus. Note the tree-shaking is what keeps it out of the bundle — a single future import from a shipping module would put 416 kB of engineering prose on the wire.

4. **⛔ The M1 rule under-counts template-heavy modules by up to ~40 % of their own prose, and any instrument built on it inherits that.** M3 − M1 = **75,073 B** estate-wide, concentrated in `worldPulse/commercialReceiptPools.js` (+5,466), `worldPulse/warReceiptPools.js` (+5,243), `src/generators/narrativeText.js` (+4,956), `worldPulse/eventProse.js` (+4,102), `generators/power/settlementNarrative.js` (+2,822), `generators/safetyProfile.js` (+2,738) — a quasi that stops at `${` ends in a space and fails the terminal-punctuation test, so interpolated prose is invisible to the rule as written. **Slot:** if the chair takes shape (a) or (b), the instrument judges a template WHOLE (§1.1's M3), and its docblock states why, with the measured delta as the reason.

5. **⛔ `src/generators/data/deityPool.js` was deleted within the sixty-day window** (−1,094 B of prose, state `GONE`). Named because DEITY DOCTRINE is constitutional in this estate ("faith = culture, NEVER theological"; a creed's people may be shown behaving per recorded axes) and a deleted pool file is the kind of thing that should have a recorded reason. This lane did not look for one. **Slot:** one `git log` check in whichever lane next touches the faith surface — confirm the deletion was a move (to `src/data` or to a typed pool) and not a loss.

6. **⛔ Seven files already exceed the 800-effective-line layer ceiling but `scripts/.size-baseline.json` holds only 7 rows in total, of which 6 are under the two roots.** My approximation puts `src/domain/content/customContentManifest.generated.js` at ~2,037 effective lines. The arithmetic is consistent (the overrides exist for exactly these files) — but the approximation and the baseline agreeing at 7 is a coincidence I did not verify file-by-file, and I ran no eslint to check. **Slot:** one measured line in whichever lane next runs the lint gate — confirm the 7 over-ceiling files are the 7 baselined ones, and that no file is over its ceiling without a row.

7. **⛔ 51.2 % of the two roots' 21.79 MB is comments** — 11,150,178 B. That is 9.5× the entire declared prose corpus, it is invisible to `max-lines` (which skips comments) and to every byte instrument, and it is the single largest body of authored English in the estate. It does not ship (minifiers strip it) so it is not a bundle question. Recorded as a scale fact, not a defect — this estate's docblocks are load-bearing and several instruments read them. **Slot:** none proposed; the chair may want it in the repo-scale memory, which the index already flags as STALE at ~1.23M.

8. **⛔ `causeConjunctionRole*`'s 203,036 shipping bytes of prose have never been attributed to a chunk.** TOOL-12 attributed the *engine* chunk; these twelve files ship 100 % of their prose (measured) and are not among the engine's 114 members. Nobody has measured which chunk carries them or what that chunk's budget is. At 203 kB of raw authored text it is larger than `narrativeData.js`'s whole engine-chunk span (35,858 B) by 5.7×. **Slot:** one attribution pass in whichever lane next has a build, or TOOL-12's item 11 (the metafile-beside-the-log proposal) if the chair takes it.

9. **⛔ The generator golden master makes prose *changes* visible but cannot see prose *additions* on unreached branches.** 525 seeds × 64 SHA-256 facets. A variant added to a `rollFrom` pool changes the modulus and moves a hash; a literal added to a branch no pinned seed reaches moves nothing, and no instrument in the estate would notice it. This is the exact hole that makes §4's shapes worth building rather than relying on the goldens. **Slot:** a sentence in whichever instrument the chair charters, so a future reader does not conclude the goldens already cover this.

10. **⛔ The report-only hazard is live in the instrument this lane would build.** Shape (b)'s per-file diagnostic prints on a red, but if the chair ever wants it printed on a **pass** (to watch the trend), vitest 4.1.8's default reporter drops a passing test's `console.log` (the chair's ruling of 2026-09-20 after FIX-C2). **Slot:** `process.stdout.write`, and a proof that it prints, in the packet that builds it.

---

## 7. Hygiene

```
$ git -C <read-tip> log -1 --oneline
6a3e8089f PACKETS: EM-B1f's one retiredSymbols row withdrawn …

$ git -C <read-tip> status --short      # at start
(empty)

$ git -C <read-tip> status --short      # at end
(empty)
```

- **Edited nothing** under `src/`, `tests/`, `scripts/`, `docs/` or any tracked path. No build, no gate, no vitest, no eslint, no git mutation beyond the chair-directed `worktree add --detach` and its `node_modules` symlink.
- The foreign stash was never listed, applied, dropped or touched; no `git stash` in any form.
- TOOL-12's `tools/` were copied into this lane's scratch and read; its `dist-ec0a30da2/` was read; neither was written. `$SP/consist`, `$SP/slot-2`'s working tree, every other `$SP/lane-*` and the ledger checkout were not entered.
- Goldens were **read** (to determine their shape) and not written; `UPDATE_GOLDEN`, `GOLDEN_SHIFT_SIGNED` and `UPDATE_VOICE_BASELINE` were never set.
- No rate limit was hit; every command in this report ran to completion.

**Report path:** `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-18-scratch/TOOL-18.report.md`
