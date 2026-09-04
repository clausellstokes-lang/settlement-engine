# CHARSET3 — receipt: what the sanitiser strips versus what the renderer can draw

**STATUS: COMPLETE.** Measurement-only lane. **No file in the dock was edited, staged,
committed or deleted. No test command was run.** Everything below came from reading the
tree plus four read-only `node` scripts in this scratch directory, none of which spawns a
test worker.

- Dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree`
- HEAD **CONFIRMED** `1223489c9` — *"§891 register 10/10: the known-failure census re-freezes on a corpus four files larger…"*
- Raw receipts in this directory: `measure-output.txt`, `names-output.txt`,
  `repair-sim-output.txt`; scripts `measure.mjs`, `scan-names.mjs`, `repair-sim.mjs`,
  `bucket3.mjs`.

---

## Headline

**The claimed 27 is exactly right, and it is also the least important number here.**

The repair set is **27 codepoints** — CONFIRMED, and not by coincidence: it is precisely
the size of jsPDF's runtime `WinAnsiEncoding` map, which has 27 entries. But widening the
sanitiser to those 27 repairs only **4 of the 35 shipped name tokens** the product mangles
today, and only **5 of the 41 character instances** in the debt census already pinned in
the tree. `Uroš` is fully repaired. `Hadžić` is not — it becomes `Hadži`.

---

## 1. The sanitiser — CONFIRMED

There is exactly **one** character-class sanitiser over rendered prose in `src/`.

**`src/utils/jsPdfText.js:22-28`**, the whole body:

```js
export function sanitizeJsPdfText(v) {
  return String(v||'').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g,' ').replace(/\s+/g,' ').trim();
}
```

**The exact predicate:** admit TAB/LF/CR, printable ASCII `\x20-\x7E`, and Latin-1
`\xA0-\xFF`; replace everything else with a space; collapse whitespace runs; trim. The
whitespace collapse is a second, separately-acting strip — it is what removes U+00A0 and
U+0009/000A/000D, which the negated class nominally admits. Measured:
`sanitizeJsPdfText("a a") === "a a"` and `sanitizeJsPdfText("a\ta") === "a a"`.

**Call sites — CONFIRMED, three, all on the AUTHORING/RENDER side, none on restore:**

| caller | what flows through it |
|---|---|
| `src/utils/generateCampaignPDF.js:34` (as `s`) | NPC names (`:645`), save names (`:697`) |
| `src/utils/generateWorldBook.js:27` (as `s`) | NPC name+role (`:349`), settlement names (`:401`), region names (`:412`) |
| `scripts/generate-custom-content-manifest.mjs:22` | the compiler EXECUTES it to derive the table |

**Everything else that looks like a sanitiser is not one.** Every other negated-class
`replace()` in `src/` (39 of them, all inspected) builds a slug, an id, a storage key or a
filename — `institution.<slug>`, `deity:<scope>:<slug>`, localStorage keys — never
displayed prose.

### Authoring path vs restore path — CONFIRMED, and the wall is DARK

`src/domain/content/customContentCharset.js` is the charset **wall**, and it is a
validator that by construction never strips: its own header, law 1, *"NEVER SILENTLY
STRIP… this module rewrites nothing."* Law 2 is the chokepoint law — it runs where content
is authored, never where it is reloaded, *"Refusing it would delete a user's content."*

`validateCustomContentCharset` has **zero call sites in `src/`** — grepped across the whole
tree; the only references outside its own definition are in
`tests/domain/customContentCharset.test.js`. `tests/build/customContentCharsetLazy.test.js`
states the same thing from the build side: *"At this car the leaf has NO importer at all."*
So the authoring wall is built, tested and unwired.

The consequence for this car's scope: **the restore-path ruling is not at risk from
anything measured here.** `src/lib/accountImport.js` hydrates (`meta.restoreLifecycle`,
per-field admission, `restoreNotices` rather than refusals) and never touches the charset
wall or the jsPDF pass. `src/lib/importScrub.js` is orthogonal — it strips dormancy keys
(deity snapshots, `_seed`, treasury), not characters. **PLAUSIBLE** (read, not executed):
widening `sanitizeJsPdfText` cannot reach the restore path at all, because that path never
calls it — the pass runs only at PDF generation.

## 2. The renderer and its font stack — CONFIRMED, with one honest gap

There are **two** PDF renderers, and only one of them is bounded by the sanitiser.

**Dossier PDF — `@react-pdf/renderer` with eight embedded TTFs.** Registered in
`src/pdf/theme.js:98-116`: Lora Regular/Bold/Italic/BoldItalic and Nunito
Regular/Bold/ExtraBold/Italic. I read the eight shipped `.ttf` binaries with fontkit and
intersected their `characterSet`s: **759 codepoints** — byte-identical to the
`dossier-pdf` figure in the generated table. This path applies **no** sanitiser: `safe()`
in `src/pdf/lib/format.js` is identity, pinned at
`tests/pdf/exoticUnicodeRender.test.js:96` (`expect(safe(SMART)).toBe(SMART)`).

**Campaign PDF and World Book — jsPDF 4.2.1, standard-14 Helvetica, no embedded font.**
Drawable set measured through jsPDF's own runtime map, the same access path the shipped
compiler uses:
`new jsPDF().getFont().metadata?.Unicode?.encoding?.WinAnsiEncoding`. Map size **27**,
spanning U+0152…U+2122. Encodable = ASCII (95) + Latin-1 A0–FF (96) + those 27 = **218**.
The sanitiser admits **190** of the 218.

**Method honesty — what is measured and what is inferred.**
- The 218 and the 759 are **exact measurements**, not bounds: both come from the shipped
  artifacts themselves (the library's own encoding table; the font binaries' own cmaps).
- **The gap:** encodable is not the same as *painted*. I did not render a PDF and look at
  the glyphs, because rendering means running the PDF test suite and this lane is barred
  from test commands. Standard-14 Helvetica covers the full WinAnsi repertoire in every
  conformant viewer, so encodable ⇒ drawn is **PLAUSIBLE**, not CONFIRMED, for the 27.
  **What would settle it:** render a one-page jsPDF containing all 27 and inspect the
  emitted glyphs — step 7 of the round-trip in `repair-plan.md`.
- The dossier side is stronger: fontkit `characterSet` is cmap coverage, i.e. the font
  genuinely has a glyph, and `tests/data/namingDataCharset.test.js:90-97` already pins
  that the dossier misses nothing in the shipped pools.

## 3. The diff — see `codepoint-diff.md`

| bucket | size | note |
|---|---|---|
| stripped but drawable (**the repair set**) | **27** | the claim CONFIRMED; every member is in the WinAnsi map AND in the 759 dossier set |
| stripped, genuinely undrawable by jsPDF | complement of 218 in Unicode | the members that bite: 6 codepoints, 36 instances, in the shipped name pools |
| drawable but not stripped | **1** — U+00AD SOFT HYPHEN | admitted by the pass, encodable, yet named `invisible` in the product's own ban table |

A 28th codepoint, U+00A0, is stripped-yet-encodable but is **deliberately excluded** from
the repair set: the charset table names it in the `invisible` ban class with a written
reason, and the sanitiser removes it via `\s+` rather than via the class, so widening the
class would not save it. Raw set difference 28; repair set 27.

Measured in the other direction: **zero** codepoints pass the sanitiser that the encoder
cannot encode. The sanitiser is a strict subset of the encoder — only ever too narrow.

## 4. The user-visible consequence — CONFIRMED, and worse than the brief states

`Uroš` and `Hadžić` are not hypothetical customer input. **They are shipped estate data**:
`src/data/namingData.js:2053` and `:2256`. The engine generates them
(`src/generators/npcGenerator.js:26`, `src/domain/npc/npcOps.js:222`,
`src/domain/worldPulse/settlementLifecycleKernel.js:68`), the web app shows them
correctly, the dossier PDF prints them correctly, and the two paid jsPDF books print them
mutilated.

35 distinct name tokens are mangled today. A representative sample, measured:

| name | jsPDF books today | after the 27-widening | dossier |
|---|---|---|---|
| `Uroš` | `"Uro"` | `"Uroš"` **fixed** | intact |
| `Hadžić` | `"Had i"` | `"Hadži"` **still mangled** | intact |
| `Nataša` | `"Nata a"` | `"Nataša"` **fixed** | intact |
| `Snežana` | `"Sne ana"` | `"Snežana"` **fixed** | intact |
| `Uglješa` | `"Uglje a"` | `"Uglješa"` **fixed** | intact |
| `Kovačević` | `"Kova evi"` | `"Kova evi"` unchanged | intact |
| `Đorđević` | `"or evi"` | `"or evi"` unchanged | intact |
| `Jovanović` | `"Jovanovi"` | `"Jovanovi"` unchanged | intact |
| `Čupić` | `"upi"` | `"upi"` unchanged | intact |
| `Khān` | `"Kh n"` | `"Kh n"` unchanged | intact |

Note the two distinct failure shapes: a **trailing** diacritic is deleted outright (the
substituted space is then trimmed — `Uroš`→`Uro`, `Ilić`→`Ili`), while a **medial** one
leaves a word-splitting gap (`Kovačević`→`Kova evi`). A **leading** one loses the capital
entirely (`Čupić`→`upi`, `Đurić`→`uri`). All three are worse than a substitute glyph
would have been, because none of them looks like an error to a reader.

**Repair yield: 4 of 35 tokens; 5 of 41 character instances; 12% of the pinned debt.**

## 5. The finding this lane did not expect

Two things were already true in the tree before this car opened, and both change how the
car should be run.

**(a) The debt is already measured and pinned.** `tests/data/namingDataCharset.test.js`
is "THE TRANSLITERATION-DEBT REGISTER", and its exact-equality census at lines 101-107
reads `instances: 41` across exactly the eight codepoints I independently derived. My
measurement reproduces the pinned figure to the instance. Its docblock calls the situation
*"a real, shipped, paid-surface defect and the number is its size"*. This is not a new
discovery; it is a known, recorded, deliberately-deferred debt.

**(b) The repair is already declared owner-gated, twice, in the shipped source.**
`src/utils/jsPdfText.js:14-16`: *"Deriving the class FROM that table is a separate,
owner-gated act because it changes what a paid PDF prints."*
`tests/data/namingDataCharset.test.js:25-27`: *"The cure that would move it… is
owner-gated and NOT this file's to take."*

The brief's framing — repair, not a change to what a customer is sold — is defensible on
the merits. But it is **not the standing ruling in the tree**, and reclassifying an
owner-gated act is itself owner-gated. I am not deciding it. **This belongs in the owner
queue before any edit lands**, and it should go up with the honest yield attached: the
widening is a 12% repair whose headline benefit is punctuation, not names.

---

## RETROVALIDATION ROW

**What I judged.**
1. That the "sanitiser" in the claim is `sanitizeJsPdfText` at `src/utils/jsPdfText.js:27`
   and nothing else — judged after inspecting all 39 negated-class `replace()` calls in
   `src/` and finding every other one to be a slug/id/key builder.
2. That U+00A0 belongs OUT of the repair set despite being stripped-yet-encodable, because
   the product's own ban table names it `invisible` with a stated reason and the `\s+`
   collapse removes it regardless of the class. This is the whole difference between the
   raw set-difference (28) and the answer (27).
3. That "drawable" for the two jsPDF books means "in jsPDF's runtime WinAnsiEncoding map",
   the same authority the shipped compiler already trusts — rather than a wider notion
   like "Helvetica has the glyph".
4. That the material consequence is the shipped `NAMING_DATA` pools rather than
   hypothetical customer input — which is what makes this a defect the estate inflicts on
   itself, not one a user provokes.
5. That the owner-gating conflict must be reported and not resolved by this lane.

**What a reviewer re-derives.**
- Run `measure.mjs` → WinAnsi map size 27, encodable 218, textPass 190, stripped-but-encodable 28 (27 + U+00A0), dossier intersection 759.
- Run `repair-sim.mjs` → 35 mangled name tokens, 4 fixed, 31 still mangled; the six survivor codepoints; `Uroš`→`Uroš`, `Hadžić`→`Hadži`.
- Compare the eight-codepoint / 41-instance census against `tests/data/namingDataCharset.test.js:101-107` — they must match exactly.
- Recompute the widened range string: 217 codepoints, `20-7E A1-FF 152-153 160-161 178 17D-17E 192 2C6 2DC 2013-2014 2018-201A 201C-201E 2020-2022 2026 2030 2039-203A 20AC 2122`.
- The only claim NOT re-derivable without running a test: that the 27 paint as glyphs rather than merely encode. Step 7 of the round-trip settles it.

**Receipts by path.**
| claim | path |
|---|---|
| the strip predicate | `src/utils/jsPdfText.js:22-28` |
| the three call sites | `src/utils/generateCampaignPDF.js:34`, `src/utils/generateWorldBook.js:27`, `scripts/generate-custom-content-manifest.mjs:22` |
| names flow through it | `generateWorldBook.js:349,401,412`; `generateCampaignPDF.js:645,697` |
| the derived table | `src/domain/content/customContentCharset.generated.js` (campaign-pdf `count: 190`, `ranges: "20-7E A1-FF"`) |
| how the table is derived | `scripts/generate-custom-content-manifest.mjs:383-455` |
| the wall never strips; chokepoint law | `src/domain/content/customContentCharset.js:18-28` |
| the wall is unwired | grep for `validateCustomContentCharset`: only its definition + `tests/domain/customContentCharset.test.js`; corroborated at `tests/build/customContentCharsetLazy.test.js:22-24` |
| dossier applies no strip | `src/pdf/lib/format.js` `safe()`, pinned `tests/pdf/exoticUnicodeRender.test.js:96` |
| the font roster | `src/pdf/theme.js:98-116` |
| the two names are shipped data | `src/data/namingData.js:2053` (`Uroš`), `:2256` (`Hadžić`) |
| the debt already pinned at 41/8 | `tests/data/namingDataCharset.test.js:99-108` |
| owner-gating, statement 1 | `src/utils/jsPdfText.js:14-16` |
| owner-gating, statement 2 | `tests/data/namingDataCharset.test.js:25-27` |
| the policy door for the real cure | `schema/custom-content.manifest.json:30-34` (`embeddedFont: null`) |

**Priority.**
- **P1 — owner queue, before any code moves.** The reclassification of an owner-gated act, carried up with the measured 12% yield rather than the 27-codepoint headline. Nothing else can start until this is answered.
- **P2 — the widening itself** (`repair-plan.md` steps 1-4), if cleared. One line, two regenerated artifacts, one census re-record with its cause. Small, bounded, fully specified.
- **P2 — a stale citation, free to fix in the same car.** `tests/pdf/exoticUnicodeRender.test.js:15-18` cites `s()` at "generateCampaignPDF.js:83-89"; the pass was hoisted to `src/utils/jsPdfText.js` and no longer lives there.
- **P3 — U+00AD.** The one codepoint the sanitiser admits that the product's own ban table forbids. Tiny, real, and unrelated to the 27; worth its own line rather than a silent ride-along.
- **P2, separate car — the embedded-font door.** 31 of 35 mangled names, including `Hadžić` and every `-ić` surname, are unreachable by any sanitiser change. `charsetPolicy.embeddedFont` is the only door that opens them. Larger, also owner-gated, and the one that would let the car be reported as "names now print".
