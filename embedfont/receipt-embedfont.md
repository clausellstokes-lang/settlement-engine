# RECEIPT — lane EMBEDFONT (Opus 5)

STATUS: **COMPLETE.** Measurement and design only.

READ TREE: `/private/tmp/claude-502/…/58f0a8e2…/scratchpad/laneKERNELMARK-tree`
HEAD **at lane start** `1223489c939667c5bfde083ae60b4431b9f05b20`.

⚠ **SHARED-TREE NOTE — HEAD MOVED UNDER ME MID-LANE.** At lane close
`git rev-parse HEAD` reads **`c2f80ffc957a15ab18e756e0aae2b56ceb78fc9c`**; a sibling
landed `§891 cure: the capsule battery's runtime-tests fixture stops being a green
with an expiry date` while I was measuring. I re-checked rather than assuming:
`git diff --stat 1223489c9..HEAD` is **one file, `tests/scripts/baseStateCapsule.test.js`
(+20/−4)**, and `git diff --name-only` over **every path this lane measured** — the
sanitiser, both painters, `theme.js`, all of `public/fonts`, both generated charset
artifacts, the schema, the generator script, `.size-baseline.json`, and the nine test
files named in §4 — returns **empty**. Working tree porcelain: **0 lines**. Every
figure below is byte-valid at the new HEAD as well as the old.
WROTE ONLY: this scratch directory. **No dock file touched, staged or committed. No
test command run. No subagent spawned. No `node_modules` symlink materialised** —
`node_modules/eslint`, `node_modules/fontkit` and `node_modules/jspdf` were *read
through* their symlinks by absolute path, which leaves the link form unchanged.

Companion deliverables: `byte-cost.md`, `design.md`. Scripts that produced every
figure: `cmap.mjs`, `tabledump.mjs`, `diff-manifest.mjs`, `census.mjs`, `predict.mjs`,
`lines.mjs`, `emit.mjs`, `emit2.mjs`, `verify.mjs`. Emitted sample PDFs and subsetted
fonts are in this directory (`sample-*.pdf`, `today-8p.pdf`, `subsets/`).

---

## 1. The PDF pipeline as it stands — CONFIRMED

**Three PDF surfaces, two engines.**

- **react-pdf (dossier)** — `src/pdf/theme.js:90-121` calls `Font.register` twice,
  registering **8 TTFs** by Vite public URL (`/fonts/Lora-Regular.ttf?v=2` …). The
  render happens in a worker; `src/utils/pdfRender.worker.js:23` records *"Font TTFs
  are fetched INSIDE the worker."* **This path already embeds fonts.**
- **jsPDF (campaign book)** — `src/utils/generateCampaignPDF.js:889`,
  `new jsPDF({ unit: 'mm', format: 'a4', compress: true })`. Standard-14 only:
  **50** `setFont('helvetica', …)` calls (bold ×29, normal ×13, italic ×8).
- **jsPDF (World Book)** — `src/utils/generateWorldBook.js:480`, same constructor.
  **26** `setFont('helvetica', …)` calls (bold ×9, normal ×10, italic ×7).

**No bold-italic is used by either painter** — `grep -n "bolditalic\|'bold','italic'"`
over both files returns nothing. A 3-face roster suffices.

**Does any code path already embed a font into a jsPDF document? NO.** `grep -rn
'addFileToVFS\|addFont'` over `src`, `scripts`, `tests` returns **zero** hits; the
only registration sites in the repo are the two `Font.register` calls in
`src/pdf/theme.js`, which belong to react-pdf. The two jsPDF books have never
embedded anything.

**What `addFont`/`addFileToVFS` would require** — CONFIRMED against jspdf 4.2.1 in
this dock (`node_modules/jspdf/package.json` → `4.2.1`):

- `doc.addFileToVFS(name, base64)` (`jspdf.es.js:22183`) then
  `doc.addFont(name, family, style)` (`jspdf.es.js:4989`).
- The 5th argument, `encoding`, **defaults to `Identity-H`** — `jspdf.es.js:4997`:
  `encoding = encoding || "Identity-H";`
- Identity-H triggers `identityHFunction`, which writes a **per-document glyph
  subset**: `jspdf.es.js:21896`,
  `var data = font.metadata.subset.encode(font.metadata.glyIdsUsed, 1);`
  `glyIdsUsed` is initialised `[0]` (line 21232) and appended per painted glyph
  (line 21847).
- The font must be **TrueType with `glyf`/`loca`**. I dumped all eight sfnt table
  directories (`tabledump.mjs`): every face is `sfnt=0x00010000` with `glyf` +
  `loca` and **no `CFF `** table. jsPDF can consume them.
- WOFF2 is **not** an option (brotli-compressed tables) — the same constraint
  `tests/build/fontsAndMeta.test.js:112-115` already records for fontkit.
- ⚠ Both painters are **synchronous** `export function`s. A fetch makes them async.

**The sanitiser** — `src/utils/jsPdfText.js:27`, one line, admits
`\x09\x0A\x0D`, `\x20-\x7E`, `\xA0-\xFF`. Reproduced the sibling's finding.

## 2. Byte cost — CONFIRMED (full tables in `byte-cost.md`)

**First paint: 0 B, if and only if the TTFs are fetched on the export path.**

The eight TTFs (**1,033,344 B** total, measured) already ship in `public/fonts` and
already cost nothing at first paint: `index.html:43-44` preloads only two **woff2**
faces, `src/index.css` references only `.woff2`, and the `.ttf` files are reached
solely by the react-pdf worker. Reusing them adds no asset, no eager edge, no
preload, no stylesheet byte. `CLOSURE_BUDGET_BYTES = 1_048_000`
(`vendorPdfLazy.test.js:565`), `HTML 8_600` / `CSS 19_800` / `FONT_PRELOAD 90_000`
(`firstPaintNonJs.test.js:36-38`), `PRELOAD 92_000` / `ALL_WOFF2 380_000`
(`fontsAndMeta.test.js:135-136`) — **none moves.**

The honest alternative numbers, so the "it depends" is answered rather than dodged:
base64-inlining the 3-face Lora roster into the (already lazy) PDF module costs
**+524,267 B** on the export chunk and still 0 B at first paint; an *eager* import
of the same bytes costs **+524,267 B** against a 1,048,000 B ceiling — a 50%
overrun, fatal.

**The emitted PDF grows ~41 KB and then ~250 B/page** — measured by emitting real
jsPDF documents (`emit2.mjs`), baseline painted through the shipped
`sanitizeJsPdfText`:

| pages | today | embed full TTF | embed subset | Δ full | Δ subset |
|---:|---:|---:|---:|---:|---:|
| 1 | 4,066 | 45,647 | 28,191 | +41,581 | +24,125 |
| 8 | 12,950 | 56,287 | 38,257 | +43,337 | +25,307 |
| 40 | 53,559 | 104,959 | 84,304 | +51,400 | +30,745 |

Near-constant because jsPDF subsets on emit. **Three 129 KB faces cost ~41 KB, not
393 KB.**

**Subsetting: I could price it, so I did.** fontTools 4.60.2 is present, so this did
not have to be deferred to a build. Real `fontTools.subset` runs (output in
`./subsets/`): the 3-face Lora roster drops **393,200 → 77,524 B** for the
book repertoire (223 codepoints). It saves ~18 KB per emitted PDF and costs three
new `public/` binaries plus a licence row plus a charter row. **Priced, and
recommended deferred** — not "unmeasurable".

## 3. Coverage — CONFIRMED from the cmaps, not assumed

I wrote my own sfnt/cmap reader (`cmap.mjs`, formats 4/6/12) rather than trusting
fontkit, then cross-checked against fontkit (`predict.mjs`). They agree.

**All 8 pinned codepoints are covered by all 8 shipped faces — 64/64 YES:**

| | Lora-B | Lora-BI | Lora-I | Lora-R | Nun-B | Nun-XB | Nun-I | Nun-R |
|---|---|---|---|---|---|---|---|---|
| U+0101 ā, U+0107 ć, U+010C Č, U+010D č, U+0110 Đ, U+0111 đ, U+0161 š, U+017E ž | YES | YES | YES | YES | YES | YES | YES | YES |

Cross-check of my reader against the shipped manifest: my 8-face intersection is
**758**; the manifest's `dossier-pdf.count` is **759**; the sole difference is
`U+FFFF`, a format-4 sentinel fontkit reports and my reader does not. Re-running the
intersection *through fontkit* returns exactly **759**. The instruments agree.

**Candidate rosters, measured:**

| roster | codepoints | covers all 8 pinned | of today's 190-set, missing | TTF bytes |
|---|---:|---|---|---:|
| Lora-3 (R/B/I) | **779** | ✅ | 1 — `U+00AD` | 393,200 |
| Lora-4 (+BI) | 779 | ✅ | 1 — `U+00AD` | 528,808 |
| Nunito-3 (R/B/I) | **939** | ✅ | 0 | 379,188 |
| Nunito-4 | 939 | ✅ | 0 | 504,536 |

**The font I would choose: Lora, Regular + Bold + Italic.**

- Lora is the **serif the dossier already renders** (`theme.js` body/section/cover
  type is `fontFamily: 'Lora'`), and the two books are the *bound-book* surfaces.
  Nunito is the app's UI sans. Choosing Nunito would make the campaign book look
  like the web app; choosing Lora makes the three PDF surfaces one product.
- 779 codepoints is 4.1× today's 190 and a superset of the 759-codepoint dossier
  set, so the two paid PDF engines finally agree about what they can print — the
  exact asymmetry `namingDataCharset.test.js:19-20` calls *"the defect."*
- Three faces, not four: no painter uses bold-italic.
- Nunito's extra 160 codepoints are real but buy nothing the pools or the charset
  wall need, and cost a 897-char range string instead of 587.

Its one cost, declared rather than discovered: **`U+00AD` SOFT HYPHEN leaves the
book set.** It is already on the manifest's `invisible` ban list and the `\s+`
collapse strips it regardless, so the loss is nominal — but the new surface set is
*not* a strict superset of today's, and that must be said out loud.

**What each candidate actually buys** (re-derived independently, `census.mjs`,
3,878 pooled strings — the sibling's figures reproduced exactly):

| | instances cured | tokens cured |
|---|---|---|
| 27-codepoint WinAnsi widening | **5 / 41 (12.2%)** | **4 / 35** (`Uroš`, `Uglješa`, `Nataša`, `Snežana`) |
| embedded Lora-3 or Nunito-3 | **41 / 41 (100%)** | **35 / 35** |

And all **27** widening codepoints are inside both the Lora-4 and Nunito-4
intersections (27/27, measured) — so the widening is **strictly subsumed** by the
embed.

**Proved at the render, not at the sanitiser.** I emitted Identity-H documents and
read the text back through the `ToUnicode` CMap (`verify.mjs`). Every probe token
round-trips: `Babić Đorđević Kovačević Uroš Snežana Čupić Khān Hadžić € † — ’` all
**YES**. Negative control, the same probes through the shipped sanitiser:

```
Babić -> "Babi"      Đorđević -> "or evi"     Kovačević -> "Kova evi"
Čupić -> "upi"       Khān     -> "Kh n"       Hadžić    -> "Had i"
```

`Đorđević → "or evi"` is not truncation. It is a name the reader cannot recognise.

## 4. Blast radius — PREDICTED IN WRITING, no instrument run

Full table in `byte-cost.md` §5. The load-bearing figures:

| register | before | after (predicted) |
|---|---|---|
| `customContentCharset.generated.js` `campaign-pdf.count` | 190 | **779** |
| `.ranges` | `"20-7E A1-FF"` (11 chars) | the 587-char Lora-3 string (spelled out in `byte-cost.md`) |
| `.method` | `winansi-and-textpass` | a new spelling |
| `.inputsSha256` | `a031bd2f…f21a4e` | **`6098764c12511c422c986a75110869b174e870057f7ba44473e7a080b04b0e1a`** if the new derivation is `sha256Of(faceBytes)` over Lora R/B/I |
| `world-book` | mirror | mirror (generator spreads at line 462) |
| `policy.embeddedFont` | `null` | `"Lora"` |
| generated `.js` / `.ts` size | 11,641 / 11,620 B | **+~1,152 B each** |
| `namingDataCharset.test.js:101-107` | `instances: 41`, 8 codepoints | **`instances: 0`, `[]`** |
| `customContentCharset.test.js:129` | `expect(intersection.length).toBe(189)` | **`759`** |
| `customContentCharset.test.js:160` | `expect(TABLE.policy.embeddedFont).toBe(null)` | the font name; the test's **title** becomes a lie |
| `sizeBaseline` | 8 keys, none a PDF file | **no movement** — headroom measured: `generateCampaignPDF.js` 672/800, `generateWorldBook.js` 367/800, `jsPdfText.js` 3/800 |
| the four byte budgets | — | **no movement** |

**Four blast-radius items I found that were not in the brief, and that a car would
otherwise walk into:**

1. ⛔ **`tests/helpers/jsPdfPaintedText.js` goes BLIND under Identity-H.** It
   returns inflated content streams as **latin1**; Identity-H `Tj` operands are
   2-byte glyph IDs. Measured on my own artifacts: `identityTj = 27,456 B`,
   `plainTj = 0 B`. **11 call sites** across `tests/pdf/exportDateSeam.test.js` and
   `tests/pdf/realmExportFaithSeam.test.js` depend on it. They red — correctly — and
   the tempting repair is to loosen them into vacuity.
2. ⛔ **`tests/lint/writerReach.walker.test.js:382-389` forbids the font module from
   living under `src/pdf/`**: *"campaign-pdf is a jsPDF surface and must not pull in
   the @react-pdf tree"*, asserted `toEqual([])` over every `src/pdf/` file in those
   two closures.
3. ⚠ **`tests/build/customContentCharsetLazy.test.js:~185` finds the text pass by
   the literal `'x09\\x0A\\x0D'`.** A respelled regex makes it red with the *false*
   message *"the one jsPDF text pass was tree-shaken out of every chunk."* The embed
   design leaves the regex intact; the widening design does not.
4. ⚠ **There is no negative control in the tree today.**
   `tests/pdf/exoticUnicodeRender.test.js:15-17` records it explicitly: *"there is NO
   campaignPdfSanitize.test.js — no test asserts that fold."* Nothing would go red
   when the behaviour changes, so the car must build the failing-before arm first.

Also predicted: the two painters become `async` (test call sites need `await`), and
`exoticUnicodeRender.test.js`'s docblock citation of `generateCampaignPDF.js:83-89`
is **already stale** (the pass was hoisted to `src/utils/jsPdfText.js`).

## 5. Two candidates and the judgment

Set out in full in `design.md`. In one line each:

- **A (chosen): embed Lora R/B/I in the jsPDF path, from the already-shipped TTFs,
  fetched on the export path** — 0 B at first paint, 0 new assets, +43 KB per
  emitted book, cures 41/41.
- **B (rejected): widen the sanitiser to WinAnsi now, defer embedding** — rejected
  because *all 27 of its codepoints are already inside the font the product ships*,
  so it is not a stepping stone the embed builds on but a step the embed deletes, at
  the price of a second owner-gated paid-surface shift and a second re-record of the
  one number that measures the defect.

**The judgment the chair asked for: NO — the 27-codepoint widening is not worth
doing on its own, and it is exactly the cheap partial the owner's standing law
warns about.** It cures 12.2% of the instances and 11.4% of the tokens for 100% of
the approval cost, it moves the debt register from 41 to 36 in a way that reads as
progress while `Đorđević` still prints `or evi`, and its supposed advantage —
safety — is answered by the measurement that the real cure costs **zero first-paint
bytes and zero new shipped assets**.

The one thing B is right about must be inherited by A: **the sanitiser has to widen
too**, or an embedded 779-codepoint face sits behind a pass that still erases
everything above U+00FF. Same line, derived from the font instead of from WinAnsi.

---

## RETROVALIDATION ROW

| # | claim | grade | how it was established | how it could still be wrong |
|---|---|---|---|---|
| 1 | No jsPDF code path embeds a font today | **CONFIRMED** | `grep -rn 'addFileToVFS\|addFont'` over `src`/`scripts`/`tests` → 0 hits | a dynamically-built method name would evade the grep; I judge this remote in a hand-painted imperative painter |
| 2 | All 8 faces are `glyf` TrueType, no `CFF ` | **CONFIRMED** | own sfnt table-directory reader, all 8 files | none — the table directory is unambiguous |
| 3 | All 8 pinned codepoints covered by all 8 faces | **CONFIRMED** | own cmap reader **and** fontkit, agreeing | cmap presence ≠ a *drawn* glyph; I did not inspect outlines. Mitigated by #6, which painted them and read them back |
| 4 | The pool debt is 41 instances / 35 tokens; widening cures 5 / 4 | **CONFIRMED** | `census.mjs` over 3,878 pooled strings, independent of the sibling; reproduces the shipped pin exactly | none |
| 5 | jsPDF subsets on emit | **CONFIRMED** | source read at `jspdf.es.js:21232/21847/21896` **and** the measured near-constant delta across 1→40 pages | none |
| 6 | An embedded-Lora jsPDF book paints and round-trips all 8 codepoints | **CONFIRMED** | emitted real PDFs, decoded `Tj` via the `ToUnicode` CMap; all 12 probes YES; helvetica control all NO | a PDF *viewer* could still render differently from the ToUnicode round-trip. Glyph-level visual confirmation was **not** performed — same open gap the sibling flagged. Reduced, not closed, by #3 |
| 7 | First-paint delta is 0 B for the fetch-the-shipped-TTF design | **CONFIRMED** for the *inputs*; **PLAUSIBLE** for the built artifact | every budget's source constant read; no new asset, no eager edge, no preload, no CSS byte | I did not run a build (forbidden, and rightly). A car must re-prove under `VERIFY_DIST=1`. ⚠ The dock's `node_modules` are symlinks, and materialising them has moved first paint by 8,551 B before — so any build must be run in the sanctioned form |
| 8 | Subset sizes (393,200 → 77,524 B for Lora-3) | **CONFIRMED** | real `fontTools.subset` runs, files on disk in `./subsets/`, sizes `stat`ed | my subset flags (dropped `GSUB`/`GPOS`/hinting) are a *choice*; a car keeping layout tables gets larger files |
| 9 | Predicted register figures (779 / 587 chars / 189→759 / 41→0 / +1,152 B) | **PLAUSIBLE — deliberately not executed** | computed by replicating the generator's own `toRangeString` and `sha256Of` semantics against fontkit sets | they assume the new derivation reuses `fontkit-intersection` over the jsPDF roster. A different derivation (e.g. font ∩ text-pass) yields a smaller set. `inputsSha256` additionally assumes the input list is *exactly* the three face bytes in R/B/I order |
| 10 | `paintedText` goes blind under Identity-H | **CONFIRMED** | the helper's own latin1 read at `jsPdfPaintedText.js:37-39`, plus my measurement `identityTj=27,456 / plainTj=0` | the car could avoid Identity-H via `WinAnsiEncoding` on an embedded font — but that re-imposes the 190-codepoint ceiling and defeats the cure |
| 11 | The 27-widening is strictly subsumed by the embed | **CONFIRMED** | all 27 derived from jsPDF's **runtime** `WinAnsiEncoding` map (not typed), then tested against both font intersections: 27/27 present | none |
| 12 | `sizeBaseline` does not move | **CONFIRMED** for today's counts; **conditional** going forward | eslint `Linter` run with the instrument's own rule and options; 8 baseline keys listed | it becomes false if the car writes >128 effective lines into `generateCampaignPDF.js`. The design places the loader in its own leaf precisely to keep this true |
| 13 | The brief's premise that `sizeBaseline` is a byte instrument | **CORRECTED** | the file is a `max-lines` ratchet; the byte budgets live in three other files | none — the correction is the finding |
