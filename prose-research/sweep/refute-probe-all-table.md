# REFUTE — PROBE_ALL family `table` (§3 metrics table + §6 outliers)

Adversarial re-execution, not re-reading. Every number below was printed by a command in this
session. Read-only throughout: `laneOSR18` was `git status --porcelain` **empty before and after**
every run, and its HEAD never moved (`fd36f0298b1ead15f2a80eff83dafb92114a7ea4`).

## 0. Setup — and the one thing the brief got wrong about the tree

The report states it was **read at `6b80d1e8e`**. The tree I was pointed at, `laneOSR18`, is at
`fd36f0298`, which is **77 commits of drift away and touches 18 `src/` files** (`warRemembrance.js`
+435, `HeraldRemembrance.jsx` +110, `simulationRules.js` +185, `densityCreateBoundary.js` +122, …).
Re-running §7 against `laneOSR18` HEAD alone would therefore have produced 26 false refutations.

So I measured **both**:

- `run6b80/` — a pristine `git archive 6b80d1e8e | tar -x` extraction into
  `scratchpad/dock6b80` (never a checkout in the lane; `node_modules` symlinked from `laneOSR18`).
  This is the apples-to-apples reproduction.
- `runHEAD/` — the same pipeline against `laneOSR18` at `fd36f0298`, to quantify drift.

Scripts were copied out of `prose-research/probe-all/` into private run dirs so a sibling refuter
sharing that directory could not race my artefacts. Same code, byte-identical (`cp`).

---

## 1. THE HEADLINE: §3 reproduces EXACTLY — 1,008 / 1,008 cells

```
$ node cmp3.mjs PROBE_ALL.md run6b80/report.table.md
published rows: 49  mine rows: 49
published cols: 22  mine cols: 22
cells compared: 1008   diffs: 0
```

48 metric rows x 21 columns (R1…A-W + BIBLE). **Zero** discrepancies. Every column header `n`
matches (`R1 (n=2262) … A-W (n=4276) BIBLE (n=67)`).

Because re-running the author's own `run.mjs` only proves determinism, I also **re-implemented 28
of the 48 rows from scratch** (`sweep-table-run/indep.mjs`, which does not import `metrics.mjs`)
and compared against the published markdown directly:

```
$ node indep.mjs run6b80/corpus.json PROBE_ALL.md
INDEPENDENT check: 560 cells over 48 published rows; diffs: 0
```

The 28 independently re-derived rows: N variants, files, segments, segments/variant, terminal-stop
share, slot-bearing share, 1-/2-/3+-segment share, words/segment mean·sd·p10·p50·p90,
share<8, share>30, "rather than", gloss tail, "There/It is" opener, semicolon, colon, question,
parenthesis, em dashes, exclamations, digits-in-prose, contraction, "the PCs".

### The pipeline behind it, each stage re-executed (§7 verbatim)

| stage | published | measured at `6b80d1e8e` |
|---|---|---|
| X1 `x1-json-leaves.mjs` | 2,734 leaves / 786 pools; ledger 763 street 690 visitor 481 unfolding 303 counterforce 254 elder 140 threshold 96 canonical 7 | **identical, all eight angles** |
| X2 `x2-walk.mjs` | 45,260 leaves, 1,621 modules, 145 import failures; fn-array 8,021 · fn-template 1,701 · fn-plain 181 · slot-string 2,530 · array-string 16,943 · object-string 15,884 | **identical, all six shape tags** |
| X3 `x5-inline.mjs` | 19,329 literals, 1,660 files, 0 parse failures | **identical** |
| X4 `x7-jsx.mjs` | 12,809 segments, 525 of 527 files, 0 parse failures | **identical** |
| X5 `x6-annex.mjs` | 9,327 rows → 106 law, 106 short, 9,115 prose, 4,289 wired (47.1%) | **identical totals** (one per-annex cell differs — §3 below) |
| `registers.mjs` | 34,508 admitted / 41,369 rejected | **identical**, and every per-register n |
| `mechanical.mjs` | 53,662 prose strings, 153 em, 0 excl | **identical** |
| `crosscheck.mjs` (§8) | all 16 rows | **identical** (see §5) |

Direct inspection of the mechanical rows, not just the aggregate:

```
$ node -e '…corpus.json…'
R8 em-dash variants: 4      (settlementOriginProse.js x2, …)
R11 em-dash variants: 1     (decisionTier.js)
R14 em-dash variants: 1     (governanceNarrative.js)
R15 em-dash variants: 71    (entitlementLadder.js, design/organic/index.js, …)
R18 em-dash variants: 44    (aiGrounding.js, aiOverlayVerifier.js, …)
exclamation-bearing admitted rows, whole corpus: 0
the-PCs rows: 1  (R8 src/data/historyData.js)
```
Matches §3's `em dashes (count)` and `exclamations (count)` rows exactly.

---

## 2. §6 OUTLIERS: the two full lists reproduce EXACTLY — 284 / 284 rows

```
$ node cmp6.mjs PROBE_ALL.md run6b80/report.json
published HIGH rows: 137  LOW rows: 147
measured outliers total: 284  high: 116  inf: 21  low: 147
rows in measured NOT in published lists: 0
published outlier rows checked: 284  diffs: 0
```

Every row's **register, metric, value, median and `x median` ratio** matched, in both directions,
with no unpublished outlier suppressed and no published outlier unmeasured. The §6 header's
"**137 high** … and **147 low**" is exact, and "the median is taken across the nineteen register
columns (A-W … excluded; so are size-scaled counts)" is confirmed against
`run.mjs:99 const MEDIAN_COLS = ORDER.filter((id) => M[id] && id !== 'A-W')` and the `SIZE` set.

The **ten that carry meaning** table: all ten rows exact.

```
OK   R2   share segments > 30 words        pub v=0.491 med=0.005 x=98.2   | measured 0.491 / 0.005 / 98.2
OK   R10  digits-in-prose rate             pub 0.111 / 0.003 / 37         | measured 0.111 / 0.003 / 37
OK   R6   "There/It is" opener rate        pub 0.11  / 0.006 / 18.3       | measured 0.11 / 0.006 / 18.33
OK   R1   gloss tail ", which" rate        pub 0.066 / 0.004 / 16.5       | measured identical
OK   R1   "rather than" rate               pub 0.113 / 0.007 / 16.1       | measured 0.113 / 0.007 / 16.14
OK   A-U  gloss tail ", which" rate        pub 0.062 / 0.004 / 15.5       | measured identical
OK   R11  parenthesis rate                 pub 0.222 / 0.016 / 13.9       | measured 0.222 / 0.016 / 13.88
OK   R14  gloss tail ", which" rate        pub 0.052 / 0.004 / 13         | measured identical
OK   R14  3+-segment share                 pub 0.221 / 0.019 / 11.6       | measured 0.221 / 0.019 / 11.63
OK   R6   share segments > 30 words        pub 0.042 / 0.005 / 8.4        | measured identical
```

Its prose gloss "255 of 2,262" for R1 `rather than` is exact:

```
$ node …  R1 rather-than variants: 255 of 2262 rate= 0.1127
          R1 gloss-tail variants: 149 rate= 0.0659
```

---

## 3. WHAT DOES NOT REPRODUCE — six refutations

### R-1 (§6, "two structural lows" #1) — R6 `share of segments under 8 words`, median and ratio
| | published | measured |
|---|---|---|
| value | 0.005 | 0.005 (confirmed) |
| **median** | **0.381** | **0.46** |
| **x median** | **0.02x** | **0.01x** |

```
$ node -e 'median over the 19 MEDIAN_COLS'
share<8 values (19 cols): 0.13 0.017 0.204 0.947 0.383 0.078 0.005 0.472 0.289 0.616 0.555 0.502 0.381 0.46 0.507 0.599 0.512 0.464 0.114
median 19-col: 0.46
```
0.381 is **R12's own value**, not the median. The document's own HIGH/LOW list, twenty lines below,
prints the correct pair: `| 0.01x | R6 | share segments < 8 words | 0.005 | 0.46 |`. The highlight
table contradicts the full list it is drawn from. The *finding* (R6 is the estate's one register
with no short relief) survives; the two numbers attached to it do not.

### R-2 (§6, "two structural lows" #2) — R16 `pools uniform in segment count`, all three numbers
| | published | measured |
|---|---|---|
| **value** | **0.254** | **0.242** |
| **median** | **0.729** | **0.672** |
| **x median** | **0.25x** | **0.36x** |

0.242 is what §3's own table prints for R16, what §6's own LOW list prints
(`| 0.36x | R16 | pools uniform in segment count | 0.242 | 0.672 |`), and what both my runs
measure — at `6b80d1e8e` **and** at HEAD. 0.729 reproduces under no column set I could construct
(19 cols → 0.672; 19 cols with nulls dropped → 0.714; 20 cols incl. A-W → 0.693; 17 non-null +
A-W → 0.7205). The prose beside it ("R3 0.843, R8 0.892, R6 0.955, R17 1.000") **is** exact.

### R-3 (§1 annex table) — `RECEIPT_POOLS_DOSSIER_STATE.md` wired count
| | published | measured |
|---|---|---|
| wired | 2024 (99.3%) | **2030 (99.6%)** |

Every other cell of that 13-row table matched. **The published column does not sum to its own
total**: 2024+1214+151+306+8+5+0+2+9+86+462+0+16 = **4,283**, against the printed TOTAL of
**4,289**. With the measured 2030 it sums to exactly 4,289. So the single wrong cell is provably
the DOSSIER_STATE one, and the report's headline "4,289 wired (47.1%)" is right.

### R-4 (§0, trap-2 receipt) — R15 and R16 terminal-stop share
| | published (§0) | published (§3) | measured |
|---|---|---|---|
| R15 | 0.585 | 0.588 | **0.588** |
| R16 | 0.604 | 0.615 | **0.615** |
| R8 | 0.469 | 0.469 | 0.469 (confirmed) |
| R10 | 0.634 | 0.634 | 0.634 (confirmed) |

§0's receipt line disagrees with the report's own §3 table on two of its four figures. §3 is
right (independently re-derived, `indep.mjs`, 0 diffs). At HEAD R15 reads 0.589 — 0.585 is not
reachable at either sha.

### R-5 (§0, trap-3 receipt) — "9,700 rows arrived through a function"
```
# shapes: {"object-string":15884,"fn-array":8021,"fn-template":1701,"array-string":16943,"fn-plain":181,"slot-string":2530}
```
The two components it names are exact, and they sum to **9,722**, not 9,700 (with `fn-plain`,
9,903). Off by 22.

### R-6 (§2 roster) — R16 file count
| | published (§2) | published (§3 `files` row) | measured |
|---|---|---|---|
| R16 files | **361** | 354 | **354** |

`registers.mjs` prints `R16  sentence  2685  1512  354  354`; `report.json` `metrics.R16.files` =
354; my independent recount of distinct `file` values in R16 = 354; at HEAD also 354. Every other
register's §2 file count agrees with §3.

---

## 4. ONE METHODOLOGICAL DEFECT AND ONE MIS-STATED RATIO

### M-1 — `Number(null) === 0`: eight §6 LOW rows are coercion artefacts, and two medians are wrong
`run.mjs:104` keeps a column when `Number.isFinite(Number(f(M[c],c)))`. For R10 and R11 —
registers with **zero** multi-variant pools — three pool metrics are `null`:

```
R10 pools obj: {"poolsWith2Plus":0,"meanPoolSize":0,"sameSegmentCountShare":null,"repeatedTwoWordOpenerShare":null,"meanWithinPoolWordSd":null}
R11 pools obj: {  ... identical ... }
Number(null) finite? true = 0
```

§3 honestly prints those three cells **blank**. §6 turns the same absence into six outlier rows
asserting a measured value of `0`:

`0x R10/R11 · pools uniform in segment count` · `0x R10/R11 · pools w/ repeated 2-word opener` ·
`0x R10/R11 · mean within-pool word sd` (plus `0x R10/R11 · mean pool size`, defined-0 but meaning
"no multi-variant pools", not "tiny pools").

The coercion also moves the **published medians**:

```
sameSegmentCountShare        median(null->0): 0.672   median(null dropped): 0.714
repeatedTwoWordOpenerShare   median(null->0): 0.112   median(null dropped): 0.126
meanWithinPoolWordSd         median(null->0): 1.5     median(null dropped): 1.5
meanPoolSize                 median(null->0): 3.6     median(null dropped): 3.6
```

So every `x median` keyed on the first two is inflated: R12 `pools w/ repeated 2-word opener`
5.96x → 5.29x; R18 5.21x → 4.63x; R16 4.27x → 3.79x; R16 `pools uniform` 0.36x → 0.34x. No
outlier changes side, so no §6 conclusion flips — but the ratios as printed are not the ratios
against a defensible median.

### M-2 — §6's "**184 of 1,659**" is not the ratio behind R6's 0.110
The metric is per **segment** (`metrics.mjs:135  thereIsOpener: srate(...)`), so its denominator is
R6's 1,689 segments, not its 1,659 variants.

```
R6 variants 1659 segments 1689
R6 There/It-is opener segments: 185 rate= 0.1095      -> 0.110, the published cell
R6 VARIANTS containing a There/It-is opener segment: 185
R6 variants whose FIRST segment opens There/It-is:    184
```
184 is a *third* quantity (first-segment-only). 184/1,659 = 0.1109, which rounds to 0.111, not the
0.110 published. The cell is right; the gloss beside it pairs the wrong numerator with the wrong
denominator. The qualitative claim ("the single strongest formula in the estate") is unaffected.

---

## 5. §8's SELF-VERIFICATION REPRODUCES

`node crosscheck.mjs` at `6b80d1e8e`:

```
my n: 2729  (X1 raw 2734, admission dropped 5)
1-seg: 2030 (refuter 2030)  2-seg: 688 (691)  3+: 11 (11)
R1 wps: {"mean":16.8,"sd":7.2,"p10":7,"p50":17,"p90":26,"under8":0.13,"over30":0.021}
R1 semicolon count: 385 (386)   R2 semicolon: 168 (169)
R2 share segments >30w: 0.491 (dossier causal: 0.49)
pools uniform in seg count: 0.57 of 786 pools    pools repeated 2-word opener: 0.123
already: 26   kind/sort of: 29
```
All sixteen §8 rows land on the published values, including the two it flags as deliberate
differences (`quiet` 59, `nobody/no one/nothing` 512). "rather than, variants in R1+R2 = 288" is
confirmed by my own recount: 255 (R1) + 33 (R2) = 288 — the 294 crosscheck prints is occurrences.

---

## 6. TREE DRIFT — what a re-runner at `laneOSR18` HEAD will see

Same pipeline, `fd36f0298`: **34,527 admitted / 41,482 rejected** (vs 34,508 / 41,369).

```
$ node cmp3.mjs PROBE_ALL.md runHEAD/report.table.md
cells compared: 1008   diffs: 26
```

All 26 fall in **R15 / R16 / R18 only** — the three heterogeneous catch-alls — and are third-decimal:
R15 n 3883→3894 (files 233→234), R16 2685→2688, R18 5673→5678 (files 546→547); the largest rate
move is 0.003 (`R16 pools w/ repeated 2-word opener` 0.478→0.481). **No named register moves at
all.** §6 is even steadier: identical 284-row roster, membership unchanged, 5 rows drifting in the
third decimal (`R16 parenthesis` 0.091→0.090, `R16 mean pool size` 8.8→8.9, `R16 3+-segment`
0.085→0.084, `R16`/`R18 repeated opener`).

This is not a defect in the report — it read at `6b80d1e8e` and said so. It does mean **the sha is
load-bearing**: anyone re-deriving these figures must archive `6b80d1e8e`, not run against a
current lane.

---

## 7. VERDICT

The `table` family is **overwhelmingly sound**. The 1,008-cell §3 table and the 284-row §6 outlier
census reproduce to the digit at the sha the report names, once by re-executing §7's own commands
and once by a from-scratch re-implementation of 28 rows. Every load-bearing claim I attacked — the
98.2x R2 long-register outlier, R6's "It is" formula, the R1/A-U/R14 gloss-tail cluster, R1's
`rather than` at 255/2,262, the zero exclamations, the 153 em dashes, the 34,508-row corpus —
survived.

Six figures do not reproduce, five of them contradicted by the report's **own other sections**
(§3, §6's full list, §1's own column total), i.e. transcription slips into summary tables rather
than instrument error. The one substantive methodological finding is M-1: `Number(null) === 0`
silently converts "this register has no pools" into "this register scores 0", producing eight
phantom LOW rows and two depressed medians.

