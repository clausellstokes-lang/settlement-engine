# BYTE COST — the embedded-font car (lane EMBEDFONT)

Dock `1223489c9`. Every number below was executed, not reasoned. Scripts that
produced them live beside this file (`cmap.mjs`, `diff-manifest.mjs`, `predict.mjs`,
`emit.mjs`, `emit2.mjs`, `verify.mjs`, `tabledump.mjs`, `lines.mjs`).

## 0. The brief's premise needs one correction before the numbers make sense

The brief says the repo enforces "a first-paint byte budget and a `sizeBaseline`
with EXACT ceilings", as if those were one instrument. They are two, and only one
of them is about bytes.

- **`tests/lint/sizeBaseline.test.js` is a LINE-COUNT ratchet**, not a byte one. It
  freezes eslint `max-lines` effective counts. CONFIRMED — its own header:
  *"scripts/.size-baseline.json freezes the per-file max-lines ceiling"*, and its
  measurement is `linter.verify(code, { rules: { 'max-lines': … } })`.
- The **byte** budgets are elsewhere: `tests/build/vendorPdfLazy.test.js`
  (`CLOSURE_BUDGET_BYTES = 1_048_000`, line 565), `tests/build/firstPaintNonJs.test.js`
  (`HTML 8_600` / `CSS 19_800` / `FONT_PRELOAD 90_000`), and
  `tests/build/fontsAndMeta.test.js` (`PRELOAD 92_000` / `ALL_WOFF2 380_000`).

This matters because the two instruments move for completely different reasons, and
the embedded-font car moves **neither** if it is built the way §3 recommends.

## 1. The shipped fonts, measured

CONFIRMED — `ls`/`stat` plus my own sfnt table-directory reader (`tabledump.mjs`):

| face | bytes | woff2 sibling | sfnt | outlines | cmap fmt | codepoints | glyphs |
|---|---:|---:|---|---|---|---:|---:|
| Lora-Regular.ttf | 129,336 | 45,824 | 0x00010000 | `glyf`+`loca` | 4 | 778 | 844 |
| Lora-Bold.ttf | 129,280 | 46,036 | 0x00010000 | `glyf`+`loca` | 4 | 778 | 845 |
| Lora-Italic.ttf | 134,584 | 49,340 | 0x00010000 | `glyf`+`loca` | 4 | 778 | 838 |
| Lora-BoldItalic.ttf | 135,608 | 49,100 | 0x00010000 | `glyf`+`loca` | 4 | 778 | 839 |
| Nunito-Regular.ttf | 125,460 | 42,124 | 0x00010000 | `glyf`+`loca` | 4 | 938 | 1,050 |
| Nunito-Bold.ttf | 125,396 | 41,548 | 0x00010000 | `glyf`+`loca` | 4 | 938 | 1,050 |
| Nunito-ExtraBold.ttf | 125,348 | 42,860 | 0x00010000 | `glyf`+`loca` | 4 | 938 | 1,050 |
| Nunito-Italic.ttf | 128,332 | 44,904 | 0x00010000 | `glyf`+`loca` | 4 | 938 | 1,050 |
| **total** | **1,033,344** | 361,736 | | | | | |

Two facts that decide the car:

1. **Every face is real TrueType** — `glyf`/`loca`, no `CFF `. jsPDF's `TTFFont`
   + `Subset` can consume them. A CFF-flavoured OpenType would have killed the
   design outright; this is why I measured it rather than assumed it.
2. **These TTFs are already shipped, and already cost nothing at first paint.**
   `index.html` preloads only two **woff2** faces (`Nunito-Regular.woff2` +
   `Lora-Bold.woff2`, 88,160 B against a 90,000 B budget). `src/index.css`
   references only `.woff2`. The eight `.ttf` files are fetched by exactly one
   consumer today — `src/pdf/theme.js`'s `Font.register({ src: '/fonts/….ttf?v=2' })`
   on the react-pdf dossier path, and (per `src/utils/pdfRender.worker.js:23`)
   inside the render worker.

## 2. THE DECISION NUMBER: first-paint delta

**It depends entirely on how the bytes are delivered, so here are all three.**

| delivery | first-paint delta | export-chunk delta | verdict |
|---|---:|---:|---|
| **(a) `fetch('/fonts/Lora-*.ttf?v=2')` on the export path** | **0 B** | **0 B** | ✅ the design |
| (b) base64-inline the TTFs into the lazy PDF module | **0 B** | **+524,267 B** | ✗ pointless |
| (c) static/eager import of the font bytes | **+524,267 B** | — | ✗ fatal |

CONFIRMED bases:

- **(a) is zero, twice over.** No new file enters `public/`; the three TTFs are
  already there and already served. Nothing enters the entry's static closure, so
  `CLOSURE_BUDGET_BYTES = 1_048_000` does not move. Nothing enters `index.html`,
  the one stylesheet, or the preload pair, so all three `firstPaintNonJs` budgets
  and both `fontsAndMeta` woff2 ratchets are untouched. The two painters are
  *already* behind `import('../../utils/generateCampaignPDF.js')` in
  `src/components/settlements/CampaignFolder.jsx:8,12`, and `vendorPdfLazy.test.js`
  already asserts `vendor-pdf` is absent from the entry closure — the fetch lands
  strictly downstream of a boundary the tree already enforces.
- **(b)** base64 of the 3-face Lora roster = `⌈393,200 × 4/3⌉` = 524,267 B added to
  a chunk that is already lazy. First paint still 0, but the first export gets half a
  megabyte slower for no correctness gain over (a). Reject.
- **(c)** +524,267 B against a 1,048,000 B ceiling is a **50% overrun**. Fatal, and
  named here only so nobody proposes it.

⚠ The prose above `CLOSURE_BUDGET_BYTES` in `vendorPdfLazy.test.js` is a *history
trail* quoting older ceilings (1,377,000 / 1,382,000) and an older measured total
(1,368,015). The live constant is `1_048_000` at line 565. Read the constant, not
the narrative.

## 3. THE OTHER byte cost, which is the one a customer actually feels

The PDF the user downloads grows. I measured this by **emitting real jsPDF
documents** (`emit2.mjs`), baseline painted through the shipped
`sanitizeJsPdfText` so the comparison is against what ships today:

| pages | TODAY (helvetica + sanitiser) | embed FULL TTF | embed SUBSET TTF | Δ full | Δ subset |
|---:|---:|---:|---:|---:|---:|
| 1 | 4,066 | 45,647 | 28,191 | +41,581 | +24,125 |
| 4 | 7,873 | 50,207 | 32,505 | +42,334 | +24,632 |
| 8 | 12,950 | 56,287 | 38,257 | +43,337 | +25,307 |
| 16 | 23,103 | 68,448 | 49,762 | +45,345 | +26,659 |
| 24 | 33,255 | 80,608 | 61,266 | +47,353 | +28,011 |
| 40 | 53,559 | 104,959 | 84,304 | +51,400 | +30,745 |

**The delta is near-constant, and that is the headline.** Embedding three full
129 KB faces does NOT add 393 KB to the PDF; it adds ~41 KB and then ~250 B/page.

Why — CONFIRMED by reading jsPDF 4.2.1's own emitter,
`node_modules/jspdf/dist/jspdf.es.js:21896`:

```js
var data = font.metadata.subset.encode(font.metadata.glyIdsUsed, 1);
```

`glyIdsUsed` starts at `[0]` (line 21232) and is appended per drawn glyph (line
21847). **jsPDF already subsets to the glyphs the document actually paints.** The
per-page drift is Identity-H's 2-bytes-per-character content stream.

## 4. Subsetting, priced — I could measure it, so I did

fontTools 4.60.2 is available in this environment, so this did **not** have to be
left as "cannot measure without a build". Real `fontTools.subset` runs, output in
`./subsets/`:

- **Repertoire A** (223 codepoints — the campaign 190-set ∪ the 27 WinAnsi extras ∪
  the 8 pool codepoints): exactly what the two books need today.
- **Repertoire B** (863 codepoints — A ∪ Latin Ext-A/B ∪ modifiers ∪ combining ∪
  General Punctuation ∪ Currency): a door wide enough for author-typed content.

| face | full | subset A | subset B |
|---|---:|---:|---:|
| Lora-Regular.ttf | 129,336 | 25,560 | 35,556 |
| Lora-Bold.ttf | 129,280 | 25,436 | 35,412 |
| Lora-Italic.ttf | 134,584 | 26,528 | 35,476 |
| Nunito-Regular.ttf | 125,460 | 23,264 | 39,656 |
| Nunito-Bold.ttf | 125,396 | 23,196 | 39,584 |
| Nunito-Italic.ttf | 128,332 | 23,860 | 40,616 |
| **6-face total** | **772,388** | **147,844** | **226,300** |

**And subsetting is not worth doing yet.** It buys ~18 KB on each emitted PDF
(+43,337 → +25,307 at 8 pages) and costs three new binaries in `public/`, a licence
row, a charter row, and a build step — for a file the user downloads once. Bank it as
a later shrink, not as part of this car. Recorded here so the option is priced rather
than hand-waved.

## 5. PREDICTED REGISTER MOVEMENT — written before any instrument is run

Roster assumed: **Lora Regular + Bold + Italic** (the three styles the two painters
actually call — CONFIRMED by `grep -o "setFont('helvetica',\s*'[a-z]*'"`: campaign
uses bold ×29, normal ×13, italic ×8; World Book bold ×9, normal ×10, italic ×7;
**no bold-italic anywhere in either painter**).

### 5a. `src/domain/content/customContentCharset.generated.js` (and its `.ts` twin)

| field | before | after (predicted) |
|---|---|---|
| `surfaces['campaign-pdf'].count` | `190` | **`779`** |
| `.ranges` | `"20-7E A1-FF"` (11 chars) | the 587-char Lora-3 string (below) |
| `.method` | `"winansi-and-textpass"` | a new spelling, e.g. `"fontkit-intersection-embedded"` |
| `.inputs` | `["jspdf:WinAnsiEncoding","src/utils/jsPdfText.js"]` | the 3 face paths (+ the pass, if it still narrows) |
| `.inputsSha256` | `a031bd2f…f21a4e` | **`6098764c12511c422c986a75110869b174e870057f7ba44473e7a080b04b0e1a`** if the new derivation is `sha256Of(faceBytes)` over Lora-3 in R/B/I order |
| `surfaces['world-book']` | mirror | mirror (the generator spreads campaign-pdf at line 462) |
| `policy.embeddedFont` | `null` | `"Lora"` |
| `policy.nonLatin` | `"undecided"` | optionally `"embed"` — already in `NON_LATIN_POLICIES` |
| file size | `.js` 11,641 B / `.ts` 11,620 B | **+~1,152 B each** (2 × (587−11)), plus the method/inputs prose |

Predicted Lora-3 range string (measured through fontkit, byte-for-byte what
`toRangeString` will emit):

```
D 20-7E A0-AC AE-137 139-17F 18F 192 1A0-1A1 1AF-1B0 1B7 1CD-1CE 1D3-1D4 1E4-1E9 1EE-1EF
1FE-1FF 218-21B 21E-21F 237 259 292 2BB-2BC 2C6-2C7 2C9 2D8-2DD 300-304 306-30C 312 31B
323 326-328 335-336 393-394 3A0 3A9 3BC 3C0 400-45F 462-463 46A-46D 472-475 48A-4FF
510-513 51A-51D 524-529 52E-52F 1C81 1C85 1E80-1E85 1E9E 1EA0-1EF9 2010 2013-2014
2018-201A 201C-201E 2020-2022 2026 2030 2032-2033 2039-203A 2044 2052 2074 20AC 20AE
20B4 20B8 20BA 20BD 2113 2116 2122 2126 212A-212B 212E 2202 2206 220F 2211-2212 2215
2219-221A 221E 222B 2248 2260 2264-2265 25CA 27E8-27E9 EFFD FB01-FB02 FFFF
```

(⚠ the string is written here as one logical line; the generator emits it unwrapped.)

Alternative rosters, measured, if the chair prefers the sans:

| roster | count | ranges chars | ttf bytes | sha256 of face bytes |
|---|---:|---:|---:|---|
| Lora-3 (R/B/I) | 779 | 587 | 393,200 | `6098764c…b04b0e1a` |
| Lora-4 (+BoldItalic) | 779 | 587 | 528,808 | `64ba8ab6…dbec16ed` |
| Nunito-3 (R/B/I) | 939 | 897 | 379,188 | `48929e35…b55fda84` |

### 5b. `tests/data/namingDataCharset.test.js` — the debt register

| line | before | after (predicted) |
|---|---|---|
| 101–107 | `{ instances: 41, codepoints: ['U+0101','U+0107','U+010C','U+010D','U+0110','U+0111','U+0161','U+017E'] }` | **`{ instances: 0, codepoints: [] }`** |
| 10–20 (docblock prose) | *"campaign book / World Book 41 misses across 8 codepoints"* | must be rewritten with its cause |
| 123–136 (`'the debt is a property of the BOOK set'`) | iterates `result.codepoints` | **goes VACUOUS** — a `for` over an empty list passes forever. Must be re-pointed or given a non-vacuity guard. |

I re-derived the 41 myself rather than trusting the sibling (`census.mjs`, 3,878
pooled strings):

| codepoint | char | instances | example |
|---|---|---:|---|
| U+0101 | ā | 1 | `arabic.settlementPrefixes[26] = Khān` |
| U+0107 | ć | 30 | `slavic.surnames[60] = Babić` |
| U+010C | Č | 1 | `slavic.surnames[82] = Čupić` |
| U+010D | č | 1 | `slavic.surnames[68] = Kovačević` |
| U+0110 | Đ | 2 | `slavic.surnames[62] = Đorđević` |
| U+0111 | đ | 1 | `slavic.surnames[62] = Đorđević` |
| U+0161 | š | 3 | `slavic.maleNames[86] = Uroš` |
| U+017E | ž | 2 | `slavic.femaleNames[85] = Snežana` |
| | | **41** | |

**All eight are covered by every one of the eight shipped faces** (`cmap.mjs`,
per-face table: 8/8 YES on all 8 codepoints). So the embed takes 41 → 0, not 41 → 36.

### 5c. `tests/domain/customContentCharset.test.js`

| arm | movement |
|---|---|
| `'the campaign-book set equals the WinAnsi map narrowed by EXECUTING the one text pass'` (lines 86–103) | **must be rewritten** — it *is* the derivation twin, and the derivation changes |
| `'institutions.name is bounded by the ARITHMETIC of the two live sets'` (line 129) | `expect(intersection.length).toBe(189)` → **`759`** |
| `'the door ships dark, at report'` (line 158–161) | `expect(TABLE.policy.embeddedFont).toBe(null)` → `'Lora'`; the test's own **title becomes a lie** and must change |
| `'the World Book and the campaign book are bounded by the same derived set'` | **HOLDS** — the generator still spreads one into the other |
| `'the face roster theme.js registers equals the TTF set on disk'` | HOLDS if the jsPDF roster is a subset of theme.js's |

The `189 → 759` figure is arithmetic I executed: the campaign 190-set has exactly
**one** member outside the 8-face intersection — `U+00AD` SOFT HYPHEN — and the
dossier set (759) is wholly contained in Lora-3's 779.

### 5d. `tests/build/customContentCharsetLazy.test.js` — the one that bites quietly

Line ~185 finds the text pass in built chunks by a **literal string**:

```js
.filter((file) => readFileSync(join(assetsDir, file), 'utf-8').includes('x09\\x0A\\x0D'));
expect(carriers.length, 'the one jsPDF text pass was tree-shaken out of every chunk').toBeGreaterThan(0);
```

If a car rewrites `sanitizeJsPdfText`'s regex, that literal can vanish and this
reds with a **false finding** — it will say the pass was tree-shaken when it was
merely respelled. The embed design leaves the regex alone and does not move this;
the widening design does. Worth weighing.

### 5e. Instruments that DO NOT move (stated so the car does not go looking)

- `tests/lint/sizeBaseline.test.js` — its 8 keys are `App.jsx`, `explanation.js`,
  `applyWorldPulse.js`, `pulseKernel.js`, `roadsKernel.js`, `warTermination.js`,
  `npcGenerator.js`, `settlementSlice.js`. None is a PDF file. Measured headroom
  under the 800-line `src/utils/` ceiling: `generateCampaignPDF.js` **672 (128
  spare)**, `generateWorldBook.js` **367 (433 spare)**, `jsPdfText.js` **3**.
  ⚠ The exact-set arm (`baselineKeys == overCeiling`) means a NEW key is as much a
  red as a moved number — so the font loader must be its own leaf, not 130+ lines
  bolted into `generateCampaignPDF.js`.
- `tests/build/firstPaintNonJs.test.js`, `tests/build/fontsAndMeta.test.js`,
  `tests/build/vendorPdfLazy.test.js` — no new asset, no new eager edge, no new
  preload, no CSS change.
- `tests/lint/shippedAssetLicence.test.js` — unchanged **only** if no new binary
  lands in `public/`. It walks all of `public/`; the existing TTFs pass today, so a
  same-family subset would too, but that is PLAUSIBLE, not confirmed, and it is one
  more reason to skip subsetting in this car.
