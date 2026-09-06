# REFUTE — PROBE_ALL family "tics" (§4 house tics, R6 openers, the PCs, the six reader em dashes)

Adversarial re-execution, 2026-09-06. Read-only tree
`scratchpad/laneOSR18` at **fd36f0298** (`fd36f0298b1ead15f2a80eff83dafb92114a7ea4`).
The published probe read `laneDESKINT` at **6b80d1e8e**. Both shas are present in laneOSR18;
`git diff --name-only 6b80d1e8e HEAD` = **78 files**, of which **19** are `src/` or `docs/`.
None of them is an R6 file, `historyData.js`, `settlementOriginProse.js`, `governanceNarrative.js`
or `decisionTier.js`; `git diff --stat 6b80d1e8e HEAD -- src/data/dossierStateProse
src/data/dossierCausalProse.generated.js` is **empty**, so R1/R2/R6/R8 are byte-identical corpora
at the two shas. Every count below is therefore comparable to the published one.

Tools copied (not run in place) to `scratchpad/refute-tics/`; **nothing was written into laneOSR18**
(`git status --porcelain` before and after: empty).

## 0. Pipeline re-execution (the whole instrument, not a re-read)

```sh
D=.../scratchpad/laneOSR18 ; cd .../scratchpad/refute-tics
node x1-json-leaves.mjs "$D" json-leaves.json     # 2734 leaves / 786 pools  (published 2,734 / 786) EXACT
node x2-walk.mjs        "$D" walk.json            # 45,371 leaves / 1,622 modules / 145 import fails (pub 45,260 / 1,621 / 145)
node x5-inline.mjs      "$D" inline.json          # 19,342 literals, 0 parse failures (pub 19,329 / 0)
node x7-jsx.mjs         "$D" jsx.json             # 12,819 segments, 527 files, 525 with prose, 0 fails (pub 12,809 / 527 / 525 / 0)
node x6-annex.mjs       "$D" annex.json walk.json inline.json jsx.json   # 9327 -> 9115 -> 4289 wired  EXACT
node registers.mjs      .    corpus.json          # 34,527 admitted / 41,482 rejected (pub 34,508 / 41,369)
node bible.mjs          "$D" bible.json
node mechanical.mjs     .    mechanical.json      # 53,688 prose strings, 153 em, 0 excl (pub 53,662 / 153 / 0)
node run.mjs            .    report
node crosscheck.mjs
node emit-tics.mjs                                # -> /tmp/s4.md
```

Register n reproduces **exactly** where the corpus is unchanged:
`R1 2262 · R2 467 · R6 1659 · R8 1738 · R3 1212 · R5 373 · R7 2169 · R9 619 · R17 1293 · A-U 4626 · A-W 4276`.
Drift (+19 admitted overall) is confined to R15/R16/R18, the columns fed by the 19 changed src files.

## 1. §4 — the tic tables themselves: **CONFIRMED, exactly**

Extracted `(count | gram)` from published §4 (lines 267–575 of PROBE_ALL.md) and from my regenerated
`/tmp/s4.md`, 196 rows each:

```
diff /tmp/pub.txt /tmp/mine.txt   ->  IDENTICAL: all 196 (count|gram) rows reproduce exactly
```

R6's ten reproduce to the row, with lift agreeing to three significant figures
(`146/4230.3 it is public` vs published `146/4227`; drift is the rest-of-corpus denominator).
R6 metrics reproduce exactly against §3: mean 22.6, sd 4, p10 19, p50 22, p90 28,
There/It-is 0.110, semicolon 0.540.

## 2. §6 "**184 of 1,659** ladder lines open `It is public / It is known`" — **PARTLY**

`node r6.mjs` (segmenting with the instrument's own `segments()`):

```
VARIANT-level There/It-is openers        : 184 of 1659     <- the 184 is real
segment-level (the 0.110 denominator)    : 185 of 1689
opener first-3-words tally:
   143  It is public
    34  It is out          <- NOT one of the two named formulas
     4  It is known
     2  There is nothing
     1  It was the
     1  There is an
=> rows OPENING "It is public" or "It is known": 147
rows containing "it is known" ANYWHERE           :   5
```

184 is the count of `^(There|It) (is|was|were|are)` openers — the metric `thereIsOpener` is defined
at metrics.mjs:73 as exactly that regex, per segment. The **label** is wrong: the two named formulas
account for **147**, not 184. The remaining 37 are `It is out …` (34) and three `There is/was` lines.
No reading makes the two named strings reach 184 (`it is known` occurs in only 5 rows anywhere).
Also note the row pairs a per-**segment** rate (0.110 = 185/1689) with a per-**variant** count (184/1659).

## 3. §5 "p10 19 words — the ladder has **no short sentence at all**" — **REFUTED**

```
segments under 8 words: 9  share 0.0053
   (6w) causeConjunctionContent.js          :: No one has noticed the pattern.
   (2w) causeConjunctionContent.js          :: Someone will.
   (1w) causeConjunctionContent.js          :: Yet.
   (7w) causeConjunctionContent.js          :: This X's compromise (X) roots in X.
   (7w) causeConjunctionRole/criminal.js    :: Even thieves had a catechism here once.
   (6w) causeConjunctionRole/military.js    :: The captain's second paymaster is public.
   (5w) causeConjunctionRole/military.js    :: The suppliers collect in favors.
   (4w) causeConjunctionRole/military.js    :: Replenished stores ended it.
   (6w) causeConjunctionRole/military.js    :: The silence is paid for monthly.
min: 1  p10: 19  p50: 22  p90: 28  max: 39   |  under 12 words: 21   under 15: 29
```

p10 = 19 is CONFIRMED. "No short sentence at all" is false: the minimum is a **one-word** sentence
and 21 segments sit under twelve words. The report contradicts itself — §6's own structural-low row
publishes `share of segments under 8 words | 0.005`, i.e. not zero. §6's other phrasing ("no sentence
under 19 words **at the tenth percentile**") is sound; §5's unqualified gloss is the false one.

## 4. §5 "One outright bible violation, exactly one" (`the PCs`, historyData.js:1326) — **CONFIRMED**

```
awk 'NR==1326' src/data/historyData.js
  "The agents' handler is someone in a position of trust, and the PCs have already met them",
grep -rn "the PCs" src/ | wc -l      -> 1     (whole-word \bPCs\b in src/: 2)
mechanical.json: R8 thePCs = 1, every other register 0, TOTAL 1
```

Enclosing template `type: 'infiltration_fear'` (historyData.js:1311), `severity: ['major']`; hooks are
selected by `historyGenerator.js:261` (`eventTemplate.plotHooks`, events ≤80 years) into
`plotHooks:` at :295, and rendered by `src/pdf/sections/HistoryFounding.jsx:250-255`,
`src/pdf/sections/PlotHooks.jsx` and `src/components/new/tabs/HistoryTab.jsx:241`.
One address correction: the probe says "read on the **Timeline**"; the rendering surfaces are the
History tab and the PDF Plot Hooks / History sections. Verdict unaffected.

Also CONFIRMED from the same run: **zero exclamation points** across all 53,688 prose-shaped strings.

## 5. §5 "the em-dash debt that remains is **6 strings of genuine reader prose**" — **REFUTED**

The **instrument figure** reproduces exactly (`mechanical.json` examples):
4 strings in `generators/narrative/settlementOriginProse.js` (one carrying two dashes),
1 in `generators/power/governanceNarrative.js` (`Critical (active siege — survival priority)`),
1 in `worldPulse/decisionTier.js` — 6 strings, **7 occurrences**, and the sixth is explicitly a dev
note, so "6 strings of genuine reader prose" over-claims its own evidence by one.

The finding is refuted by what the number leaves out. `registers.mjs` sends **every** X3 inline
literal to R18 regardless of file, so a reader-facing label written as an in-function `return` lands
in the bucket §5 dismisses. Raw source, same file the report cites for "1":

```
grep -n "—" src/generators/power/governanceNarrative.js
 250: 'Unstable — criminal governance'          295: 'Fractured — no stable governing authority'
 289: 'Critical (active siege — survival priority)'   298: 'Shaken — institutional trust collapsed'
 301: 'Desperate — hunger is eroding order'     304: 'Anxious — disease is overriding normal authority'
 307: 'Volatile — power is available to whoever moves first'
 313: 'Strained — debt obligations constrain every decision'   337: 'Tense — regional monster threat'
```

Nine, not one. `buildGovernanceLabels` → `rulingStructure.js:702` → `powerStructure.stability` →
`src/pdf/sections/Overview.jsx:90` ("STABILITY"), `src/pdf/sections/PowerStructure.jsx:85`,
`src/components/new/SummaryTab.jsx:160`.

`node enum-em.mjs R18` — 57 em-dash strings in 22 files, by kind:

| kind | strings |
|---|---:|
| reader-facing generated prose / UI labels | **38** |
| dev throw + guard messages | 14 |
| AI-layer prompts | **3** |
| ambiguous (highWater, lifecycle, stripe local-mode) | 2 |

`crossSettlementConflicts.js` alone carries 11 reader sentences
(`… are locked in a {x} — both claim the right to set terms for the shared corridor.`), and it is
imported by `components/new/tabs/RelationshipsTab.jsx:4` and read by `pdf/lib/viewModel.js:790`.
`prosperity.js` 5, `safetyProfile.js` 5 (`safetyLabel` → `SummaryTab.jsx:29`), `economicState.js` 3,
`foodGenerator.js` 1. So the published characterisation of R18 — "mostly AI-layer prompts,
design-token descriptions and dev notes rather than reader surfaces" — inverts the composition:
**3 of 57 are AI prompts; 38 of 57 are reader surfaces.**

For R15 the characterisation is fairer (60 of 83 are habitForkRegistry / design-token / ledger notes)
but still misses `customContentSchema.js` (15 option labels rendered by
`components/compendium/CustomContentEditor.jsx`), `display/labelBands.js` (5),
`compendium/searchIndex.js` (2), `display/dossierViewModel.js` (1).

Counting distinct strings over the demonstrably reader-facing files (`node readerem.mjs`, dedup by
text so prosperity/labelBands' shared five count once):

```
DISTINCT reader-facing em-dash prose strings: 57   (em-dash occurrences: 58)
  15 domain/customContentSchema.js      11 generators/crossSettlementConflicts.js
   9 generators/power/governanceNarrative.js   5 domain/display/labelBands.js
   4 generators/narrative/settlementOriginProse.js   3 economy/economicState.js   3 safetyProfile.js
   2 compendium/searchIndex.js   1 each: dossierViewModel, galleryUtils, foundry/moduleBuilder,
     foodGenerator, store/settlementGenerateAction
```

**57, not 6** — 9.5x the published debt, and every file above has a named render path.
⚠ Hazard for whoever cures them: `safetyLabel` is a persisted `economyInputFingerprint` input
(existing memory row), so rewording those five is a same-seed shift, not a text-only edit.

## 6. Tic-detector false positives — **the "collapsed to one row per phrase family" claim is REFUTED**

`emit-tics`' preamble: *"Overlapping grams are collapsed to one row per phrase family."* The collapse
at metrics.mjs:216 is a **substring** test on the joined gram (`o.gram.includes(s.gram)`), which
cannot see two non-overlapping fragments of one habit. Measured over all 196 published rows
(`node fp2.mjs`, row-set containment — no regex involved):

**28 of 196 tic rows have a row-set that is a subset of another row in the same top-ten.**
R6's own case is the largest in the estate:

```
rows with "it is public" : 146
rows with "public that"  : 126
rows with BOTH           : 126        rows with "public that" but NOT "it is public": 0
rows with "it is public that": 126
```

Two of R6's ten slots are one habit; a reader summing the R6 column double-counts 126 lines.
Others: R10 has four rows for one "…can be undone with the map undo" sentence
(`be undone with` 19 ⊃ `undone with the` 11 = `with the map` 11 = `the map undo` 11);
R12 has five rows for `The week slipped by, calm and uneventful.` (n=4 each);
R15 pairs `candidate owner`/`owner unsigned` and `surplus adequate`/`adequate strained`.

**12 of 196 grams never occur literally in their own register** (`node fp3.mjs`, slot-tolerant regex,
whitespace-only between tokens). The tokenizer replaces every non-`[a-z0-9{}']` character with a
space before forming n-grams, so a printed "tic" can be an artifact of a comma, colon or semicolon:

| register | printed gram | n | literal occurrences | what it really is |
|---|---|---:|---:|---|
| **R6** | `destroyed but` | **75** | **0** | `… is destroyed, but the …` (comma pivot) |
| **R6** | `is out the` | **64** | **0** | `… is out: the …` / `… is out; the …` (colon reveal) |
| R10 | `machinery with` | 14 | 0 | `… machinery, with options …` |
| R15 | `candidate owner` / `owner unsigned` | 18 / 18 | 0 | the dev label `CANDIDATE, OWNER-UNSIGNED` |
| R15 | `band surplus` | 16 | 0 | `(surplus/adequate/strained/…)` slash list |
| R11 | `name e` | 5 | 0 | `Institution name (e.g. …)` — not a prose habit at all |
| R12 | `by calm` | 4 | 0 | `slipped by, calm and uneventful` |
| R14 | `is open the` | 4 | 0 | `The market is open, the streets are swept` |
| R9 | `seconds then` | 4 | 0 | `in seconds. Then run the region` (sentence boundary) |
| R4b | `{} and` · R18 `{} 100` | 6 / 11 | 0 | slot-adjacent punctuation |

The **habits** behind R6's two are real (75 lines pivot on `, but`; 64 reveal on `: the`) — this is a
presentation defect, not a fabrication. But the §4 "tic" column is read as a literal phrase, and for
these rows no such phrase exists in the prose. **17 of 196 printed examples do not contain their own
printed gram**, which is the same defect surfacing in the example column.

### Hand-read, three tic-triggering rows per register (`node handread.mjs`)

All 19 register columns sampled at first / middle / last tic-triggering row. **No false positive in
R6**: all three samples carry the credited habit verbatim (`It is public now: …`,
`The occupier is gone, but the agitator still leads …`, `The syndicate is broken, but …`).
Genuine tics also confirmed by hand in R1 (`the town does`, `very little`), R2 (`for all that`,
`older hands`), R5 (`came to nothing`), R7 (`only where`, `viable only`), R12 (`passed quietly`),
R17 (`travellers passing`), A-W (`at {}`, `rather than`).

Three registers where the hand-read shows the detector is mining something that is not a *voice* tic:
- **R4** (n=133, phrase unit): `on the`, `and the`, `it is` are stopword bigrams; in a 133-row
  phrase column any function word clears `minCount 4` / `minPools 3`.
- **R18**: `{} must be` (41), `must be an` (35), `must contain` (12) — R18's "tics" are the estate's
  validation-throw vocabulary, not reader prose.
- **R15**: `candidate owner` / `owner unsigned` (18) are one hyphenated dev label.

Register habit concentration, measured as the union of rows triggering any of the register's ten
(the number a reader would wrongly get by summing the column):

```
R6   744 / 1659 = 44.8%   (summing R6's ten gives 1000 — 34% inflation)
A-W 1610 / 4276 = 37.7%   R4b 54.0%   R4 35.3%   R12 22.2%   R5 21.2%   R11 16.2%
R1   6.5%   R7 2.7%   R8 3.4%   R15 3.0%   R16 3.5%   R18 2.6%
```

R6 is genuinely the estate's most formula-bound register — **44.8% of its lines carry one of its own
ten habits**, first by a wide margin among the sentence registers. That headline survives intact.

## 7. §8 verification table — **CONFIRMED**, with one re-runner trap

`node crosscheck.mjs` reproduces the published table: `1-seg 2030` (exact), `2-seg 688` (−3),
`3+ 11` (exact), R1 wps mean 16.8 / sd 7.2 / p10 7 / p50 17 / p90 26 / under8 0.130,
semicolons 385 and 168, R2 over-30 share 0.491, pools uniform 0.575, repeated opener 0.123
(combined 786-pool figure, as the doc's footnote says), `already` 26, `kind/sort of` 29.

Trap: §8 publishes `"rather than", variants in R1+R2 | 288 | 288 | exact`, but the shipped
`crosscheck.mjs:10` prints **294**. Both are right — 288 is variants, 294 is occurrences:

```
R1+R2 rows containing "rather than": 288      occurrences: 294
R1 rows: 255  (§6 publishes "255 of 2,262" — exact)
```

The published table is correct; the script beside it prints a different number under the same label,
which will read as a failed reproduction to the next re-runner.

## Verdict summary

| # | published finding | verdict | measured |
|---|---|---|---|
| 1 | §4 tic tables (196 rows, 20 registers) | **CONFIRMED** | all 196 (count\|gram) rows identical |
| 2 | "184 of 1,659 open It is public / It is known" | **PARTLY** | 184 There/It-is openers; 147 with the two named formulas |
| 3 | "the ladder has no short sentence at all" | **REFUTED** | 9 segments < 8 words, min 1 word ("Yet.") |
| 4 | one `the PCs` violation, historyData.js:1326 | **CONFIRMED** | 1 in 53,688 strings; render path traced |
| 5 | "6 strings of genuine reader prose" (em dashes) | **REFUTED** | 57 distinct reader-facing strings, 13 files |
| 6 | R15/R18's 146 "mostly prompts/dev notes" | **REFUTED (R18)** | 38/57 reader-facing, 3 AI prompts |
| 7 | "overlapping grams collapsed to one family" | **REFUTED** | 28/196 rows are subsets of a sibling row |
| 8 | §4 grams are the register's phrases | **PARTLY** | 12/196 never occur literally; 17/196 examples lack their gram |
| 9 | §8 crosscheck reproduces the house rates | **CONFIRMED** | table exact; script prints 294 vs table's 288 (occ vs variants) |
