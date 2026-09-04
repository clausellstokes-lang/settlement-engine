# CHARSET3 — repair plan (A PLAN. NOT EXECUTED. No file in the dock was touched.)

Written against dock HEAD `1223489c9`. Paths are repo-relative.

## ⛔ READ THIS BEFORE PLANNING THE CAR

The repair this plan describes is **already declared owner-gated in two places in the
shipped tree**, in the same words, by whoever built the wall:

- `src/utils/jsPdfText.js:14-16` — *"Deriving the class FROM that table is a separate,
  owner-gated act because it changes what a paid PDF prints."*
- `tests/data/namingDataCharset.test.js:25-27` — *"The cure that would move it
  (re-deriving the jsPDF text pass from the table, so the books stop erasing codepoints
  their own encoder can draw) is owner-gated and NOT this file's to take."*

The brief frames this as a repair rather than a change to what a customer is sold. That
framing is defensible on the merits — the customer is sold a name the engine generated,
and the book prints a mutilated version of it — but it is **not the standing ruling in the
tree**, and a lane cannot amend a ruling by disagreeing with it. Take this to the owner
queue before the edit, not after. Everything below assumes that clearance.

## Step 1 — widen the one sanitiser

**File:** `src/utils/jsPdfText.js`, line 27 (the only line that changes).

Today:

```js
return String(v||'').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g,' ').replace(/\s+/g,' ').trim();
```

The 27 additions, in codepoint order, as a class tail (measured, not typed —
`repair-sim.mjs` in this directory emitted it from jsPDF's own map):

```
ŒœŠšŸŽžƒˆ˜–—‘’‚“”„†‡•…‰‹›€™
```

⚠ **Do not hand-type that tail into the regex.** The module's whole design claim is that
the charset table is a MEASUREMENT of the renderer; a hand-typed literal here re-creates
the second hand-typed authority the header says it refuses, and it silently rots on the
next jsPDF bump. Two admissible shapes:

- **(a) preferred** — build the class once at module scope from jsPDF's runtime
  `WinAnsiEncoding` map, the same access path `deriveCharsetTable` uses
  (`new jsPDF().getFont().metadata?.Unicode?.encoding?.WinAnsiEncoding`). Cost: the text
  pass gains a jsPDF import. Both call sites already import jsPDF, but
  `scripts/generate-custom-content-manifest.mjs:22` imports the pass and would then import
  jsPDF transitively (it already does at line ~420, so no new dependency) — check
  `tests/build/customContentCharsetLazy.test.js` still holds, since it pins that the
  charset leaf pays no first-paint bytes.
- **(b) fallback** — keep the literal, and add a walker test asserting the class equals
  the runtime WinAnsi key set exactly, so a jsPDF bump reds instead of drifting.

Whichever shape, keep U+00A0 out: it is a declared `invisible` ban and the `\s+` collapse
removes it regardless.

## Step 2 — regenerate the derived table (do NOT hand-edit either artifact)

```
npm run gen:custom-content-manifest
```

Expected movement, precomputed:

| artifact | field | before | after |
|---|---|---|---|
| `src/domain/content/customContentCharset.generated.js` | `surfaces['campaign-pdf'].count` | 190 | **217** |
| same | `.ranges` | `20-7E A1-FF` | `20-7E A1-FF 152-153 160-161 178 17D-17E 192 2C6 2DC 2013-2014 2018-201A 201C-201E 2020-2022 2026 2030 2039-203A 20AC 2122` |
| same | `.inputsSha256` | `a031bd2f…f21a4e` | moves (the pass source is hashed) |
| same | `surfaces['world-book']` | mirror of campaign-pdf | mirror, same movement |
| `supabase/functions/_shared/customContentCharset.generated.ts` | same three fields | same | same |

`tests/domain/customContentManifest.contract.test.js:120-127` runs the generator with
`--check`, so a forgotten regeneration reds there rather than shipping a stale table.

## Step 3 — re-record the debt register WITH ITS CAUSE

**File:** `tests/data/namingDataCharset.test.js`.

- Line 101-107, the exact-equality census, becomes `instances: 36`, codepoints
  `['U+0101','U+0107','U+010C','U+010D','U+0110','U+0111']` (U+0161 and U+017E leave).
- Lines 12-19 of the docblock, which state the census in prose, must move with it.
- The docblock's own instruction at lines 21-32 demands the re-record carry its cause.
  Write the cause in: *the jsPDF text pass was widened to the encoder's own WinAnsi
  repertoire; 5 of 41 instances cured; the remaining 36 need an embedded font, not a
  wider class.*

⚠ This is a **legitimate behaviour shift on a paid surface** and must be stated as one,
not slipped in. Same-seed generation is unaffected — pool lengths and order do not move,
so `namingDecontamination.test.js`'s size pins hold — but the painted bytes of every
campaign PDF and World Book containing an affected name change.

## Step 4 — the honest ceiling, stated in the commit

After this repair the two jsPDF books still cannot print `Hadžić`, `Ilić`, `Kovačević`,
`Đorđević`, `Khān` or 26 other shipped surnames: **31 of 35 mangled tokens survive the
repair**, because U+0107 ć (30 instances), U+0101 ā, U+010C Č, U+010D č, U+0110 Đ and
U+0111 đ are outside WinAnsi entirely. Curing those requires the `charsetPolicy.embeddedFont`
door (`schema/custom-content.manifest.json:30-34`, today `null`) — embedding a Unicode
subset font in jsPDF, or retiring jsPDF for those two books. That is a separate,
larger, and also owner-gated car. Do not let this repair be reported as "names now print".

## The round-trip that would prove it

Run in this order; each step's receipt quoted verbatim in the car's report.

1. **Author** — with the charset wall still dark, drive the custom-content authoring
   surface (`src/components/compendium/CustomContent.jsx` /
   `src/components/contentStudio/ContentDraftEntry.jsx`) with an institution named
   `Uroš Hadžić — "Čupić" Œuvre €5 †` — a string carrying repaired codepoints, an
   unrepaired one (ć, č, Č), and four bucket-1 punctuation members.
2. **Persist** — save, reload the app, and assert the stored string is byte-identical to
   what was typed. The wall is `report`-only and unwired, so nothing should refuse; the
   test is that nothing silently rewrites either.
3. **Export** — take the account export (`src/lib/accountData.js`) and the JSON/foundry
   export. Both surfaces are `unbounded`; assert byte-identity again.
4. **Import** — re-import that export through `src/lib/accountImport.js`. This is the
   **RESTORE path**, which must hydrate and never refuse: assert the string survives and
   that no charset finding is raised. `importScrub.js` is orthogonal (dormancy keys) and
   must not be touched.
5. **Render, all four surfaces:**
   - `web-display` — unbounded; assert the full string in the DOM.
   - `dossier-pdf` — assert the string reaches the react-pdf tree unmodified (`safe()` is
     identity) and that all its codepoints are in the 759-set.
   - `campaign-pdf` and `world-book` — the load-bearing arm. **Render a real jsPDF buffer
     and extract its text**, do not assert on `sanitizeJsPdfText`'s return value alone:
     that would be the fallacy of proving the encoder by asking the sanitiser. Assert the
     27 appear in the extracted text, and assert `ć`/`č`/`Č` are *still* replaced by a
     space, with the surviving-defect count pinned at 36.
6. **Negative control** — run step 5's jsPDF arm against the tree *before* the widening
   and confirm it FAILS. A round-trip that passes both before and after is proving nothing.
7. **Glyph-level confirmation** (closes the one gap this lane could not) — open the
   emitted PDF and confirm the 27 paint as glyphs rather than as blanks or notdefs.
   WinAnsi *encodability* is exact and measured; *paintedness* under the viewer's
   standard-14 Helvetica is inference until someone looks at the page.

## Files a later car will touch (complete list)

| file | change |
|---|---|
| `src/utils/jsPdfText.js` | line 27 — the one edit |
| `src/domain/content/customContentCharset.generated.js` | regenerated, never hand-edited |
| `supabase/functions/_shared/customContentCharset.generated.ts` | regenerated |
| `tests/data/namingDataCharset.test.js` | census re-record + docblock prose + cause |
| `tests/pdf/exoticUnicodeRender.test.js` | docblock only — lines 15-18 cite `s()` at "generateCampaignPDF.js:83-89", which is **stale**: the pass was hoisted to `src/utils/jsPdfText.js`. Fix while in the area. |
| new test (recommended) | the jsPDF render round-trip of step 5, and the walker of Step 1(b) if shape (b) is chosen |
