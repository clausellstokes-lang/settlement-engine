# RECEIPT — lane R15-TAIL (PARTIAL)
⟦Chair: Fable 5.1 · Lane: Opus 5 (R15-TAIL) · read-only on every tree · started 2026-09-06⟧

**STATUS: COMPLETE.** (This header was written as PARTIAL before any measurement, per the preamble, and is updated here at the landing.) This header is written before any measurement, per the preamble
("Write your receipt FIRST as a PARTIAL header"). Every figure below is added only after the
command that produced it exited in-shell with a captured code.

## Ask
Classify the WHOLE of PROBE_ALL register R15 ("src long tail") per source FILE by CONSUMER
(reader / dm-only / dev / ai-prompt / ambiguous), read from where each string is USED in the tree
at `$SC/laneOSR18` @ fd36f0298 — not from what the string looks like.

## Deliverables (paths)
- `$K/sweep/R15-tail-classification.json`
- `$K/sweep/R15-tail-classification.md`
- this receipt

## Log
- [x] read PROBE_ALL §R15 (line 577), the §4 R15 row (line 271) and §5 Axis A (697-760)
- [x] read REFUTATION R-10 (line 135), K6 (line 67) and P-9 (line 154)
- [x] read CORRECTIONS_RECEIPT — R-10 row (line 39), §3a line 156, §4 "left for the chair"
- [x] confirmed corpus field names by reading the rows (no `line` field exists)
- [x] extracted R15 at fd36f0298 — 3,894 rows, sha named and re-derived
- [x] classified all 3,894 rows over all 234 files
- [x] JSON written with 11 `complete:false` checkpoints + the final `complete:true`
- [x] MD written with the 234-row per-file table, per-class examples and five proposed corrections

---

## Measurements taken (all exits captured in-shell)

### M1 — the corpus file the brief names does not exist; four identical copies do
`$K/probe-all/corpus.json` (the brief's path) is ABSENT: `$K/probe-all/` holds only the ten
`*.mjs` extractors. `find` over `$SC` returns six `corpus*.json`. Four are byte-identical
(`md5 223df7caaeb79c43d10467c72898ec9f`, 14,632,339 B):
`$SC/runHEAD/corpus.json`, `$SC/refute-tics/corpus.json`,
`$K/sweep/bible-work/corpus.json`, `$K/sweep/refute-extractors-work/corpus.json`.
The fifth, `$SC/run6b80/corpus.json` (`e37e8f3d…`, 14,626,929 B), is the 6b80d1e8e run.
**I classified against `$SC/runHEAD/corpus.json`.**

### M2 — which sha that corpus is, re-derived rather than taken on the brief's word
`node count.mjs runHEAD/corpus.json` → total rows **34,527**; `R15` **3,894**.
`node count.mjs run6b80/corpus.json` → total rows **34,508**; `R15` **3,883**.
34,527 admitted and R15 3,883 → 3,894 (**+11**) is exactly P-9's published drift, so the
runHEAD corpus IS the `fd36f0298` corpus. Tree check: `git -C $SC/laneOSR18 rev-parse HEAD`
= `fd36f0298b1ead15f2a80eff83dafb92114a7ea4`, `git status --porcelain` empty (exit 0).
**The sha I classified against is `fd36f0298`, and R15 there is 3,894 rows, not 3,883.**

### M3 — corpus field names, read from the rows, not assumed
Every R15 row carries: `register, file, p, pool, shape, viaFn, angle, audience, slots,
text, from, unit, sentenceShaped`. Across the whole corpus a further five keys appear on
other registers (`line, annex, n, section, kind, wiredTo`). **No R15 row has a `line`
field** (`hasLine: 0` over all 3,894) — the brief's JSON shape asks for `line`, so line
numbers are derived by locating each string in the tree, and are null where the string is
composed at runtime (template/function pools).

### M4 — R15's shape at fd36f0298
3,894 rows · `from` = `X2` for all of them (the export walker) · `unit` = `sentence` for all
· 234 distinct files · 377 (file, top-level export) groups. Concentration: 6 files carry
50%, 36 carry 80%, 120 carry 95%.

### M5 — reachability instrument (the necessary condition for `reader`)
Static import graph over all 2,189 `src/**` modules (import / export-from / dynamic
`import()` / `require` / `new URL(..., import.meta.url)`), roots = every `.jsx` + `src/pdf/**`
+ `src/workers/**` + `src/foundry/**`. 1,990 of 2,189 modules are product-reachable.
**34 of R15's 234 files (359 rows) are reachable from no product surface at all** — they
cannot be reader-facing by construction.
⚠ METHOD HAZARD, found and cured mid-run: a first graph run without the worker roots called
`worldPulse/index.js` unreachable; the barrel is genuinely test-only, but the worker at
`src/workers/advanceInterval.worker.js:23` imports the LEAF, so worker roots are required
before any such claim.
⚠ SECOND METHOD HAZARD: "the only importers are tests" is NOT evidence of dev. Five exports
in `warAndRoadNames.js` have zero non-test importers yet are consumed by `deriveWarName()`
INSIDE their own file, which `WarTab.jsx` renders. Same-file consumption is now shown for
every group.

### M6 — ⚠ the brief's third premise, refused with measurement
The brief says the corrections receipt's owed item can be found by grepping it for `whole tail` or
`per-file`. **Neither string occurs in `PROBE_ALL_CORRECTIONS_RECEIPT.md`** (grep exit 1 on both).
The nearest owed item is §3a line 156, which records R-10 as "answered, not refuted" and says
"The open item is narrower than the draft assumes". The ask itself is sound; only the pointer was.

Related and larger: the brief (and the lane's own C-3 draft) assumed the sentence *"mostly AI-layer
prompts, design-token descriptions and dev notes"* still stands in `PROBE_ALL.md`. It does not.
`grep -n "mostly AI-layer prompts" PROBE_ALL.md` returns **one** hit — line 20, inside the §0
corrections table, where it is the QUOTED CLAIM that R-10 refuted; the replacement already landed at
line 741. So there is nothing to strike, and the proposed corrections widen the standing replacement
instead. This is written up as C-3 in the MD.

### M7 — the classification, and how much of it is a read render site
3,894 rows, 234 files, 377 (file, export) groups, all classified; zero rows left unassigned.

| class | rows | share |
|---|---:|---:|
| reader | 2,758 | 70.8% |
| dm-only | 225 | 5.8% |
| dev | 695 | 17.8% |
| ai-prompt | 59 | 1.5% |
| ambiguous | 157 | 4.0% |

Evidence grade is carried per row in the JSON: `render-site-read` 2,540 (65.2%), `family-trace` 344,
`family-inference` 509, `declaration` 353, `reachability` 48, `untraced` 100. The chair can re-derive
any row from its `consumerPath`.

`dm-only` is anchored on `src/domain/display/publicSafe.js:101` (`PRIVATE_KEY_RE`) and `:170`
(the NPC `goal|secret|plotHooks|relationships` strip), with the owner's `shareDm` opt-in at
`src/components/ShareToGallery.jsx:452`. It is 189 rows of `stressInstitutionEffects.js`
(secret/stakes) + 35 `VARIANT_HOOKS` + 1 NPC `goal.short`.

### M8 — line-number spot check (the derived `line` field)
94 rows sampled at stride 37 across the 3,472 rows that located a line: **93 exact, 1 near-miss**
(`commercialReceiptPools.js:96` landed on the adjacent variant of a template pool). Template/function
pools are approximate to within a line or two; 422 rows are composed at runtime and carry `line: null`.

### M9 — the comparison the ask turns on
R-10's 83 is **not a random sample of R15**; it is the em-dash breach list. Measured as two
populations at this sha: R15 strings containing an em dash are **31.8% reader** (21 of 66 visible in
the 80-char text field), every other R15 string is **71.5% reader** (2,737 of 3,828). R-10's own
27.7% (23/83) reproduces inside the difference in what each population admits. **The sample
understates R15's reader-facing share by a factor of 2.2.**

## Deliverables
- `prose-research/sweep/R15-tail-classification.json` — 1.8 MB, `complete: true`, 234 files,
  3,894 rows, `perFile` totals summing to 3,894 (reader 2,758).
- `prose-research/sweep/R15-tail-classification.md` — the 234-row per-file table, per-file per-class
  examples with consumer site + evidence grade, the totals, the reader share, the R-10 comparison,
  and five PROPOSED corrections (C-1…C-5). `PROBE_ALL.md` was **not** edited.
- this receipt.
Scratch: `scratchpad/r15-scratch/` (graph, worksheets, rules, intermediate JSON). No other writes.

## FENCES — held
Read-only on `laneOSR18` (HEAD `fd36f0298`, porcelain empty on arrival and unchanged). No vitest, no
npm, no git state change, no subagents, no register doors, no edit to `PROBE_ALL.md`. Writes confined
to the two deliverables, this receipt and `$SC/r15-scratch/`.

---

# RETROVALIDATION ROW

**What was judged (lane, Opus 5 — Fable-unvalidated):**
1. **The class boundary for `dm-only`.** The product's whole audience is the DM, so "rendered behind
   a DM-facing gate" was resolved to the estate's own gate — the `PRIVATE_KEY_RE` strip list — rather
   than to "shown to a GM". Everything else rendered in the app is `reader`. A different reading
   would move 225 rows.
2. **Evidence grading instead of a binary trace.** 1,206 rows (31%) are classified from a module-level
   trace or a declaration site rather than an individually-read render line. They are labelled
   `family-trace` / `family-inference` / `declaration` in the JSON rather than demoted to `ambiguous`,
   on the reading that a module-level trace IS a trace. A stricter chair would move some of the 509
   `family-inference` rows to `ambiguous`; that would take the reader share from 70.8% to **57.8%** as a
   floor, and the reader-dominance finding survives either way.
3. **`ambiguous` for authored-but-dark prose.** 48 rows are reader-register sentences in modules no
   product surface reaches at this sha (`EXPERIENCE_CLAUSES`, `ENGAGEMENT_PHASES`, …). They are
   `ambiguous`, not `dev` and not `reader`. That is a finding about the estate as much as a class.
4. **Two brief premises refused with measurement**: the corpus path (`probe-all/corpus.json`, absent)
   and the "whole tail / per-file" grep (no hit); plus the third, larger one in M6 — the sentence the
   ask asks to correct is already gone from PROBE_ALL and survives only as a quoted claim at line 20.

**What the Fable chair must re-derive:**
- **The 70.8% headline**, by re-running the reader/dev split under the stricter reading in (2) and
  deciding which floor the corrected PROBE_ALL sentences should carry — 70.8% or the 57.7% floor.
- **C-1's strike of `worldPulse/index.js`** from the R15 row's "real reader prose" example pair. The
  barrel has NO product importer (the worker takes the leaf, `advanceInterval.worker.js:23`) and all
  37 of its R15 rows are dev text. If the chair disagrees, the example pair stands as published.
- **The 100 untraced rows** — `TRADE_DEPENDENCY_NEEDS[*].detail` (60) and `RESOURCE_DATA[*].desc` /
  `.warning` (40). If any of these three has a render site the lane missed, the reader share rises.
- **C-5's edit to line 20**, which touches the §0 corrections table itself — a row the chair owns.

**Receipts by path (all absolute under the session scratchpad):**
- `prose-research/sweep/R15-tail-classification.json`
- `prose-research/sweep/R15-tail-classification.md`
- `receipt-r15-tail.md` (this file)
- `r15-scratch/{graph.json,worksheet3.txt,rules.mjs,rules2.mjs,final-rows.json,unmatched.txt}`

**Priority:** MEDIUM-HIGH for C-1/C-2/C-5 (three published sentences understate the register by 2.2x
and one names a dev-only barrel as reader prose); LOW for C-4 (a sha line); the 48 dark-prose rows are
a separate, higher-value thread for the estate — authored reader sentences that reach no reader.

**Seat:** Opus 5 — Fable-unvalidated · **Lane:** R15-TAIL
