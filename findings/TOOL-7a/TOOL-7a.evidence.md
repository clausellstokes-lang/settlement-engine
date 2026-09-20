# TOOL-7a — the measurement, written BEFORE the first edit

Lane: Opus TOOLING. Chair: Fable 5.1, session a9df403c. Base `5a3380e8d`,
branch `tooling-7a-2026-09-20`, worktree `$SP/lane-tool-7a`. Stamped 2026-09-20 04:34 EDT.

Goldens at start (identical to the brief's):
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

---

## 1. THE INSTRUMENT, AND WHY IT IS NOT TOOL-7's

`$SP/lane-tool-7a-scratch/scanB3.mjs`. Two declared corrections to `scanB2.mjs`:

1. **The argument splitter runs on the STRIPPED source** and balances `()[]{}` there, so a
   bracket inside an anchor LITERAL is not read as structure (TOOL-7's own false-positive
   class 9, which it declared).
2. **The strip is `codeSkeleton`, not `codeOnly`** — it blanks regex literals too (class 2),
   and it is the strip Rule 5 will actually ship with, so the measurement and the rule agree.

⛔ `codeSkeleton` is **extracted from its own declaration** in the walker source and evaluated,
never transcribed — CURE-E's lesson applied to the instrument. The loader carries three
liveness probes (code preserved, string contents blanked, length preserved) and THROWS if the
declaration is gone.

**The bootstrap itself produced a finding.** The loader's first cut brace-matched
`codeSkeleton`'s body on RAW text and threw `unbalanced codeSkeleton body`, because that body
contains the string literal `'(,=:[!&|?{;}>'` — braces inside a string. **A naive brace matcher
failed on the very first real target it was pointed at.** That is arm C1's class, demonstrated,
and it is the executed argument for R2's "count braces on the skeleton, never raw text".

## 2. THE B1 POPULATION AT THIS BASE — **20**, all live

```
files scanned      5142
.slice/.substring/.substr call sites (on the skeleton)   2175
  …carrying an INLINE finder call in their arguments     110
--- SHAPES ---     B1 20 · B2 7 · B3 45 · B4 38
--- B1 BY TREE --- scripts 1 · tests 19 · src 0
```

**Found 20 / to re-route 20 / exempt-with-reason 0.**

| verdict | count | note |
|---|---:|---|
| the brief's §3.3 list | 18 | every one confirmed still B1 at this base |
| **found by the re-measure, NOT in the list** | **2** | see below |
| CURE-E's three (humanize ×1, faithPanel ×2) | 0 | **gone** — cured, no longer inline. The instrument reproduces a known cure. |

**The two the inherited splitter missed, and exactly why:**

| site | anchors | why scanB2 missed it |
|---|---|---|
| `tests/lint/engineTelemetryWall.walker.test.js:119` | `'('` → `'\n);'` | the START anchor literal **is** `'('`; splitArgs counted it as depth and never saw the top-level comma ⇒ read as B3 |
| `tests/pdf/supplyChainFlowStatusParity.test.js:22` | `'const STATUS = {'` → `'const getStatus'` | the START anchor literal contains `{` ⇒ same miscount ⇒ read as B3 |

`git log 63e40fe57..HEAD` touches neither file, so both were **missed, not added** — TOOL-7's
declared instrument limit cost exactly two B1 sites, one of them inside the walker's own
`inScope`.

`tests/domain/peaceTermsGrantTerms.test.js:510` is now correctly B1 (scanB2 read it B3) — the
class-9 fix reproduces TOOL-7's own stated expectation.

## 3. ⛔⛔ A LIVE VACUOUS GREEN, EXECUTED — a SECURITY pin proving nothing

`tests/security/byokNeverLogged.test.js:89`, "migration 138: the aiOperationLog table carries
NO key column":

```
indexOf("create table") = 1441
indexOf(");")           = 1321          <- 6 occurrences; the FIRST is on line 23:
    "-- @rollback: drop function public.write_ai_operation_log(...); drop table public.ai_operation_log;"
table.length = 0   table = ""

the two shipped assertions, evaluated on THIS value:
  /\bkey\b/i.test(table.replace(/primary key/gi, "")) => false   .toBe(false) => PASSES: true
  /api_key|secret|token|ciphertext/i.test(table)      => false   .toBe(false) => PASSES: true
```

The span is **inverted today** — the header comment's `...);` precedes the DDL — so the pin has
been asserting against the empty string. **The product is sound**: the honest span (1366 chars,
`create table …` → `\n);`) contains no key-ish column. The defect is the ANCHOR, and per R1 the
anchor is what gets fixed.

This is CURE-E's class found LIVE for the second time, on a security surface, and it is Act 1's
whole argument.

Every other B1 span probed `ordered` at this base (`anchors.probe.txt`): habitat, not instance.

## 4. TWO BEHAVIOUR CHANGES, MEASURED BEFORE THEY ARE WRITTEN

**(a) `statementWindowAt` counts brackets on the skeleton and returns RAW text at those offsets.**
Verdict-identical on every live consumer:

```
ai-analyst/index.ts        raw=0 skeleton=0  IDENTICAL=true
surveyor-byok/index.ts     raw=0 skeleton=0  IDENTICAL=true
mapFork CLOUD_CODE         raw=0 skeleton=0  IDENTICAL=true
MULTILINE_OFFENDER         raw=1 skeleton=1  SAME=true
SINGLE_LINE_OFFENDER       raw=1 skeleton=1  SAME=true
CLEAN_SOURCE               raw=0 skeleton=0  SAME=true
split / oneLine fixtures   raw=1 skeleton=1  (both)
```
The window boundary itself **does** move — 15 of 224 sampled offsets in `ai-analyst`, 9 of 155
in `surveyor-byok` — so the change is real; it moves no verdict on today's corpus. Named, not
hidden.

**(b) the two `saves.*` `fnBody`s become the brace-matched shared one.** They are NOT brace
matchers today (TOOL-7 conflated them): they span `async function NAME(` → the next
`\nasync function `, or to EOF. Measured equivalence on `src/lib/saves.js`:

```
supabaseList     legacy len=2174  braced len=755   .select found both  SAME COLUMNS=true
supabaseListMeta legacy len=2510  braced len=1921  .select found both  SAME COLUMNS=true
```
Same answer, and the braced body is **strictly tighter** — `supabaseList`'s legacy span was
over-capturing ~1.4 KB past its own function.

## 5. THE DUPLICATION CENSUS, CORRECTED

- `fnBody` ×3 — but only `vocabularyTotality:75` brace-matches; `saves.metaProjection:30` and
  `saves.galleryOptIns:33` are the `functionBody` SPAN shape with a different terminator.
  Collapsed to the brace-matched family by (b) above.
- `objectLiteralKeys` ×2 — `vocabularyTotality:88` (src + name ⇒ key list) and
  `tests/store/savedSettlementPatchKeysWalker.test.js:168` (**objText ⇒ `{keys, blockers}`**,
  spread-aware, string-aware via its own `skipString`). **These are different functions.**
  R2's "reconcile, or keep it with a written reason" ⇒ **KEPT, reason written in-file.**
- `declarationBody` ×1 (CURE-E's) ⇒ becomes `objectLiteralBody` in the family.
- `extractDecl` — a **seventh** spelling nobody counted:
  `tests/edgeFunctions/aiProviderAbstraction.test.js:36`, four call sites. Noticed; see §9 of
  the receipt.

## 6. EXPOSURE CHECKS DONE BEFORE TOUCHING ANYTHING

- `codeSkeleton` has **zero importers** outside the walker ⇒ the move is free.
- `vocabularyTotality`'s `fnBody`/`objectLiteralKeys` have **zero importers** (19 textual
  references, all doc-comments + 2 manifest rows + 1 register row; `grep "from '.*vocabularyTotality"`
  = 0) ⇒ dropping the `export` is free today, expensive after the first importer.
- `scripts/` already imports `tests/helpers/` (`prose-duplicate-units.mjs`,
  `wiring-census.mjs`, `prose-manifest-cells.mjs`) ⇒ the script re-route is an existing pattern.
- ⭐ `scripts/check-observed-shape-readers.mjs` is **NOT in the content-addressed detector tree**:
  `DETECTOR_INPUT_PATHS = Object.freeze(['tests/fixtures/spatialPackFixtures.js'])` (:2670).
  Editing it does not move the observed-shape provenance and does **not** need the migration
  bundle door.
- `.not.` register (`negativeAssertionAnchor.walker:670` and its roster): exact-equality BOTH
  ways — a row reds if a file GROWS an un-anchored `not.toContain|toMatch|toHaveProperty` and
  reds if it SHRINKS one without lowering the row. Rows owned by files this lane touches:
  aiAnalyst 14 · interview 9 · razingWitnessWr8 3 · simulationRulesPreset.stability 10 ·
  aiProviderAbstraction 6 · surveyorByok 15 · sourceContract.test 2 · vocabularyTotality 1 ·
  byokNeverLogged 8 · uiA11yWave5 1. **No `.not.` is added or removed by this lane's design.**
