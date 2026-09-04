# DESIGN — the embedded-font car (lane EMBEDFONT)

A DESIGN. NOT EXECUTED. No file in the dock was touched, no test was run.
Dock `1223489c9`. Paths repo-relative.

## The gate that stands above both candidates

Both designs change what a paid PDF prints, and the tree already declares that
owner-gated, twice, in the same words:

- `src/utils/jsPdfText.js:14-16` — *"Deriving the class FROM that table is a
  separate, owner-gated act because it changes what a paid PDF prints."*
- `tests/data/namingDataCharset.test.js:25-27` — *"The cure that would move it …
  is owner-gated and NOT this file's to take."*

Neither candidate may be built before that clearance. What this lane can settle is
**which of the two the owner is asked to clear**, and that is the whole point of the
lane.

---

## Candidate A — EMBED (recommended)

**Shape.** The two jsPDF painters stop drawing with standard-14 Helvetica and draw
with an embedded Lora, loaded from the TTFs the product already ships.

```
src/utils/jsPdfBookFont.js          NEW leaf, ~40–60 effective lines
  export const BOOK_FACES = [
    ['/fonts/Lora-Regular.ttf?v=2', 'BookFace', 'normal'],
    ['/fonts/Lora-Bold.ttf?v=2',    'BookFace', 'bold'],
    ['/fonts/Lora-Italic.ttf?v=2',  'BookFace', 'italic'],
  ];
  export async function registerBookFont(doc, load = defaultLoad) { … }
```

`registerBookFont` fetches each URL, base64s it, calls `doc.addFileToVFS(name, b64)`
then `doc.addFont(name, 'BookFace', style)` — jsPDF defaults the encoding to
`Identity-H` (`jspdf.es.js:4997`, `encoding = encoding || "Identity-H"`). The
painters replace `setFont('helvetica', style)` with `setFont('BookFace', style)`
and become `async`.

The `load` parameter is not decoration — it is the seam the Node harnesses need,
exactly as `tests/pdf/renderedFontEmbedding.test.js:62-63` and
`exoticUnicodeRender.test.js:27-29` already re-register the react-pdf faces from
`public/fonts` because *"fontkit can't open the Vite `/fonts/…?v=2` URLs in Node"*.
The same problem, the same shape of answer.

**Where it may NOT live.** `tests/lint/writerReach.walker.test.js:382-389` asserts:

```js
expect(files, `${cls} is a jsPDF surface and must not pull in the @react-pdf tree`).toEqual([]);
```

for `cls` in `['campaign-pdf', 'world-book']`, over every file starting `src/pdf/`.
So the new leaf **must not** live under `src/pdf/`, and must not import `theme.js`.
`src/utils/` is the correct home. The *build script* may still read `theme.js` — it
is not in a runtime closure.

**Why it works, measured, not assumed:**

- All 8 shipped faces carry `glyf`/`loca` TrueType outlines (`tabledump.mjs`), so
  jsPDF's `TTFFont`/`Subset` can consume them.
- jsPDF subsets on emit (`jspdf.es.js:21896`), so the PDF grows ~41 KB, not ~393 KB.
- I emitted real documents and read their text back through the `ToUnicode` CMap
  (`emit2.mjs` + `verify.mjs`). Every probe token round-trips:
  `Babić Đorđević Kovačević Uroš Snežana Čupić Khān Hadžić € † — ’` all **YES**.
- Cures **41 of 41** instances and **35 of 35** mangled tokens.

**What it costs:** 0 B at first paint, 0 B of new shipped assets, ~+43 KB on each
emitted book. Full accounting in `byte-cost.md`.

### Candidate A′ — A plus a build-time subset

Same design, plus three subsetted TTFs in `public/fonts`. Measured: drops the
emitted-PDF delta from +43,337 B to +25,307 B at 8 pages. Costs three new binaries,
a `shippedAssetLicence` row, probably a `sovereigntyLightingContract` charter row,
and a build step — for ~18 KB on a file downloaded once. **Priced and deferred**, not
dismissed: bank it as a later shrink once the cure is in.

---

## Candidate B — WIDEN-TO-WINANSI NOW, DEFER EMBEDDING (rejected)

**Shape.** One line at `src/utils/jsPdfText.js:27` grows to admit jsPDF's 27
remaining `WinAnsiEncoding` codepoints; regenerate; re-record the debt 41 → 36.

**Why I reject it.** *Every one of its 27 codepoints is already covered by the font
the product already ships* — measured: 27/27 present in both the Lora-4 and the
Nunito-4 intersections — so B is not a foundation the embed builds on, it is a step
the embed **deletes**, at the price of a second owner-gated paid-surface shift and a
second re-record of the one number that measures the defect.

The arithmetic, re-derived independently of the sibling lane (`census.mjs`):

| | instances | tokens |
|---|---:|---:|
| defect today | 41 | 35 |
| cured by the 27-widening | **5 (12.2%)** | **4 (11.4%)** — `Uroš`, `Uglješa`, `Nataša`, `Snežana` |
| surviving | 36 | 31 |
| cured by the embed | **41 (100%)** | **35 (100%)** |

And the survivors are not cosmetically imperfect. Running the *shipped* sanitiser
over them (negative control, `emit2.mjs`):

```
Babić        -> "Babi"
Đorđević     -> "or evi"
Kovačević    -> "Kova evi"
Čupić        -> "upi"
Khān         -> "Kh n"
Hadžić       -> "Had i"
```

`Đorđević → "or evi"` is not a truncation, it is a word the reader cannot recognise
as a name. B leaves 31 of those on a paid page.

---

## THE JUDGMENT: is the 27-widening worth doing on its own?

**No. Recommend Candidate A, and recommend that the widening never be proposed as a
standalone car.** Five reasons, in order of force:

1. **It is strictly subsumed.** All 27 of its codepoints are inside the font the
   embed installs. There is no residue, no stepping-stone value, nothing the embed
   inherits from having done it first.
2. **It buys 12% of the defect for 100% of the approval.** Same owner gate, same
   generated-artifact regeneration, same paid-surface behaviour-shift declaration,
   same debt re-record — for one eighth of the cure.
3. **It spends the register's one honest movement on the cheap option.** The
   exact-equality idiom at `namingDataCharset.test.js:99-108` exists so the number
   *cannot* move without a stated cause. Re-recording 41 → 36 puts "the debt shrank"
   into the tree for a change that leaves `Đorđević` printing `or evi`. The next
   reader sees a moved register and infers progress. That is precisely the shape the
   owner's standing law forbids: **a cheaper option presented as the best available.**
4. **The one honest argument for B — "it's cheap and low-risk" — is answered by
   measurement.** The embed's first-paint cost is **zero bytes**; it adds **no new
   shipped asset**; and its correctness rests on two facts I executed rather than
   assumed (the faces are `glyf`-flavoured; jsPDF subsets on emit). B's advantage was
   supposed to be that it is safe. It is not meaningfully safer.
5. **B moves an instrument the embed leaves alone.** Rewriting the sanitiser's regex
   risks the literal detector at `customContentCharsetLazy.test.js:~185`
   (`.includes('x09\\x0A\\x0D')`), which would red with a *false finding* — "the one
   jsPDF text pass was tree-shaken out of every chunk" — when the pass was merely
   respelled. A leaves the regex untouched.

**One thing B is genuinely right about, and A must inherit:** if the sanitiser stays
as-is under A, the embedded font can draw 779 codepoints while the pass still erases
everything above U+00FF. **A must widen the pass to the embedded face's own set, or
the embed cures nothing.** That is the same edit B proposes — it just has to be
derived from the *font*, not from WinAnsi. Same line, different authority.

---

## Files a later car touches — complete list

| file | change |
|---|---|
| `src/utils/jsPdfBookFont.js` | **NEW** — the roster + `registerBookFont(doc, load)`; must NOT live under `src/pdf/` (writerReach) |
| `src/utils/jsPdfText.js` | line 27 — the admitted class is derived from the embedded face's set, not hand-typed; module gains an async or injected shape |
| `src/utils/generateCampaignPDF.js` | `async`; `registerBookFont` after `new jsPDF(...)` (line 889); 50 × `setFont('helvetica', …)` → `'BookFace'` |
| `src/utils/generateWorldBook.js` | same, at line 480; 26 call sites |
| `src/components/settlements/CampaignFolder.jsx` | verify only — lines 8/12 already `.then(...)`, and the handler at 131-132 already awaits |
| `scripts/generate-custom-content-manifest.mjs` | the book surfaces derive from a fontkit intersection over the jsPDF roster; new `method` spelling; new `inputs` |
| `schema/custom-content.manifest.json` | `charsetPolicy.embeddedFont` `null → "Lora"`; optionally `nonLatin → "embed"`. ⭐ Both doors are pre-built: the generator already accepts a string (lines 395-396) and `'embed'` is already in `NON_LATIN_POLICIES` |
| `src/domain/content/customContentCharset.generated.js` | REGENERATED, never hand-edited |
| `supabase/functions/_shared/customContentCharset.generated.ts` | REGENERATED |
| `tests/helpers/jsPdfPaintedText.js` | ⛔ **must gain a `ToUnicode` decode** — see the risk below |
| `tests/data/namingDataCharset.test.js` | census 41 → 0; docblock prose; the vacuity guard |
| `tests/domain/customContentCharset.test.js` | the derivation twin rewritten; `189 → 759`; the `embeddedFont` pin and its test title |
| `tests/pdf/exportDateSeam.test.js` | `await` the painters; 11 shared `paintedText` call sites re-read |
| `tests/pdf/realmExportFaithSeam.test.js` | same |
| `tests/pdf/worldBook.test.js` | `await` the painter |
| `tests/pdf/exoticUnicodeRender.test.js` | docblock lines 14-17 — already STALE (they cite `generateCampaignPDF.js:83-89` for a pass hoisted to `src/utils/jsPdfText.js`) and become doubly wrong. Fix while in the area. |

## Which EXISTING test file the car extends

⛔ **A new test file reds three censuses and the known-failure census is FULL at
10/10.** So the car mints none. It extends two files that already own the claim:

1. **`tests/pdf/renderedFontEmbedding.test.js`** — THE home. Its stated job is
   *"Every text run in a real rendered dossier is drawn with an EMBEDDED font"*, and
   its instrument (resolve the `FontDescriptor` indirect object, look for
   `FontFile`) transfers verbatim to a jsPDF artifact. Add a jsPDF arm asserting no
   show-operator runs under a non-embedded font in a real campaign book. Its
   docblock already carries the warning the jsPDF arm needs — that testing the Font
   object rather than the resolved descriptor *"'found' 2,998 violations in a clean
   render."*
2. **`tests/pdf/fontRegistrationParity.test.js`** — the roster-parity arm. It already
   proves *"the font FILES are identical across production, both byte-render
   harnesses, and the on-disk assets"*; extend `prod`/`harnesses` with the jsPDF
   roster so the two rosters cannot drift.

The negative control belongs in `tests/data/namingDataCharset.test.js`, which already
owns the before-number.

## The proof the car owes

1. **Negative control FIRST.** ⚠ `exoticUnicodeRender.test.js:15-17` records that
   **no test in the tree asserts the jsPDF fold at all** — *"there is NO
   campaignPdfSanitize.test.js"*. So there is nothing today that would go red when
   the behaviour changes. The car must add the failing-before arm before the edit, or
   it cannot prove a shift happened.
2. **Render, then read back.** Emit a real campaign book containing `Đorđević`,
   `Hadžić`, `Khān`, and assert the text extracts as those exact strings — through
   the `ToUnicode` CMap, never by asking `sanitizeJsPdfText` what it returned. Asking
   the sanitiser proves the sanitiser, not the encoder.
3. **Embedding, at the descriptor.** Every show operator runs under a font whose
   resolved `FontDescriptor` carries a `FontFile2`.
4. **Byte receipts.** Post-build `VERIFY_DIST=1` re-run quoting the first-paint
   closure total and the three `firstPaintNonJs` figures, to show all four held.
5. **The one-time paid-surface shift, stated.** Every campaign PDF and World Book
   containing an affected name changes its painted bytes. Same-seed generation does
   NOT move — pool lengths and order are untouched, so
   `namingDecontamination.test.js`'s size pins hold. Say both halves out loud.

## The risks, ranked

1. ⛔ **`tests/helpers/jsPdfPaintedText.js` GOES BLIND under Identity-H, and its
   failure mode is a tempting vacuity.** The helper inflates content streams and
   returns them as **latin1**. Under Identity-H the `Tj` operands are 2-byte glyph
   IDs, so every `toContain('Grimhold besieges Ashford.')` stops matching. I proved
   the mechanism: my Identity-H documents yield `identityTj=27,456 B / plainTj=0 B`,
   and the text is only recoverable through the `ToUnicode` CMap. **11 call sites
   across `exportDateSeam.test.js` and `realmExportFaithSeam.test.js`** depend on it.
   They will red — which is correct — and the tempting "fix" is to loosen the
   assertions until they pass, at which point two content-seam tests are vacuous and
   nobody knows. The helper must gain a `ToUnicode` decode **in the same act**, and
   the car must prove the decoded reader still convicts (feed it a document missing
   the string and watch it fail).
2. ⚠ **The painters are synchronous today.** `generateCampaignPDF` and
   `generateWorldBook` are plain `export function`s. Embedding needs an async fetch.
   The product call sites already await (`CampaignFolder.jsx:8,12` + the handler note
   at 131-132), but every test call site needs `await` — and a forgotten one yields a
   pending promise that passes silently rather than failing.
3. ⚠ **The sanitiser must move with the font, or the cure is inert.** An embedded
   779-codepoint face behind a pass that still erases above U+00FF cures nothing.
   The two edits are one act.
4. ⚠ **`U+00AD` SOFT HYPHEN is the single codepoint the switch LOSES** (the only
   member of today's 190-set outside the Lora intersection). It is already on the
   manifest's `invisible` ban list and the `\s+` collapse removes it anyway, so the
   loss is nominal — but it must be *declared*, not discovered, because the surface
   set is not a strict superset of today's.
5. ⚠ **The `189` arithmetic pin is easy to miss.**
   `customContentCharset.test.js:129` computes it from the table rather than typing
   it, so it moves silently in derivation and loudly in assertion: `189 → 759`.
