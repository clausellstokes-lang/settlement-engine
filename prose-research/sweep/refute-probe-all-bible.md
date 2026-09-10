# REFUTE — PROBE-ALL family `bible`: the §5 bible-distance axis + the wired-annex figure

**Refuter lane, adversarial. Every number below was RE-EXECUTED, not re-read.**
Read-only tree: `scratchpad/laneOSR18` at **`fd36f0298`** (`git status --porcelain` empty before and
after; zero files written into the tree). PROBE-ALL measured at `6b80d1e8e`; that commit is an
ancestor here and `git diff --stat 6b80d1e8e HEAD -- docs/VOICE_AND_TONE.md docs/content/` is
**empty**, so the bible and the annexes are byte-identical at both shas. `src/` moved by 18 files
(+1,344/−45), which accounts for every +N drift noted below and touches **no** annex-wiring source.

Work dir: `scratchpad/prose-research/sweep/bible-work/` (all artefacts + my three refutation scripts).

---

## A. REPRODUCTION — the published figures hold

| figure | published | re-executed | |
|---|---:|---:|---|
| bible exemplars / anti-corpus | 67 / 42 | **67 / 42** | exact |
| exemplar source split | 8 / 17 / 35 / 7 | **8 / 17 / 35 / 7** | exact |
| bible words/segment mean · sd | 8.1 · 6.9 | **8.1 · 6.9** | exact |
| bible p50 / p90 / under-8 share | 6 / 17 / 0.642 | **6 / 17 / 0.642** | exact |
| bible semicolons / em / excl / gloss / 2nd-sent | all 0 | **all 0** | exact |
| bible colon / parenthesis | 0.119 / 0.090 | **0.119 / 0.090** | exact |
| Axis B — R16 / R15 / R9 | 0.512 / 0.650 / 0.684 | **0.510 / 0.648 / 0.684** | ±0.002 (sha drift) |
| Axis B — R2 / R1 / R6 | 2.263 / 1.581 / 1.421 | **2.263 / 1.581 / 1.421** | exact |
| Axis B — R17 / R11 / A-U / R14 / R4b | 0.776 / 0.777 / 1.176 / 1.304 / 1.164 | **identical** | exact |
| R2 driver table (over30 · wps · spv · semi · pet) | 0.491 · 28.6 · 1.135 · 0.360 · 0.713 | **identical** | exact |
| field means (over30 · wps · semi · pet) | 0.035 · 11.9 · 0.143 · 0.185 | **identical** | exact |
| R1 gloss / rather-than / antithesis | 0.066 / 0.113 / 0.139 | **identical** | exact |
| R6 There-It openers / semicolons / p10 | 0.110 / 0.540 / 19 | **identical** | exact |
| Axis A — total prose strings / em / excl | 53,662 / 153 / 0 | **53,688 / 153 / 0** | +26 strings (sha) |
| Axis A — R16 em dashes | 0 | **0** (over 5,445 strings) | exact |
| Axis A — all-caps 31 R16 + 2 A-U | 33 | **31 + 2 = 33** | exact |
| Axis A — "the PCs" | 1 (`historyData.js`) | **1** | exact |
| x6-annex TOTAL rows/law/short/prose/wired | 9327/106/106/9115/4289 (47.1%) | **identical** | exact |
| registers A-U / A-W | 4626 / 4276 | **4626 / 4276** | exact |

**The instrument is honest and it re-runs.** Nothing in §5 or §1-X5 failed to reproduce.
The findings below are about **construction and scope**, not about arithmetic — with one exception (F1).

Commands: see §F.

---

## F1. REFUTED — §1's annex table does not add up; one cell is stale by 6

`node x6-annex.mjs <tree> annex.json walk.json inline.json jsx.json` prints
`RECEIPT_POOLS_DOSSIER_STATE.md … prose 2039 wired **2030** 99.6`.
PROBE_ALL §1 X5 prints **2024 / 99.3** for that cell.

The published **column sums to 4,283**; the published **TOTAL row says 4,289**
(`python3`: `sum([2024,1214,151,306,8,5,0,2,9,462,86,0,16]) = 4283`).
My re-run's column sums to 4,289 and its TOTAL is 4,289 — self-consistent.

This is not sha drift: **no file under `src/data/dossierStateProse/` is in the 18-file diff**
(`git diff --name-only 6b80d1e8e HEAD | grep ^src/`), and my wholly independent raw-byte scan (§F4)
also returns **2030** for that annex. The 2024/99.3 pair is `PROSE_INVENTORY.md`'s figure
(2024, there over a 2050 denominator = 98.7%) re-based onto the new 2039 denominator and pasted in.
**One cell of §1's table was hand-carried from a superseded instrument; the TOTAL was not.**

## F2. The "46.4%" in the brief is not PROBE-ALL's figure

46.4% is `PROSE_INVENTORY.md` §3 (`wired.mjs`): **4,280 / 9,221 = 46.42%**, and that table *is*
internally consistent (its column sums to 4,280). PROBE-ALL supersedes it with a different
denominator (9,115, laws and sub-20-char rows removed) and a strictly larger src index
(X2 ∪ X3 ∪ X4 rather than export-only), giving **4,289 / 9,115 = 47.05% → 47.1%**.
Both reproduce; they are not the same measurement and 46.4% should not be quoted for PROBE-ALL.

## F3. REFUTED — "67 sentences the bible SPEAKS rather than describes"

`node refute-bible.mjs` rebuilds the corpus with a §4 **surface tag** per row.

- **8 of the 67 (B1) are third-person META-DESCRIPTION**, not the voice speaking:
  *"SettlementForge speaks as a calm campaign archivist…"*, *"The archivist teaches through concrete
  civic nouns…"*, *"The reader should never feel addressed by a product."* They are also the longest
  rows in the set. **They carry the published fingerprint's headline from 6.5 to 8.1 words/segment —
  the "8.1" is inflated ~25% by eight rows the corpus's own definition excludes.**
- **2 of the 67 are terms the bible EXPLICITLY BANS.** B4b scrapes every quoted span from §5's
  numbered doctrine lines, so doctrine line 2 — *No "live engine," "payload," "overlay," "feature
  flag," "placements."* — donates **`"live engine,"` and `"feature flag,"` as positive exemplars.**
  (Only those two because `add()`'s `length >= 12` floor admitted the two longest prohibitions and
  rejected `payload,` `overlay,` `placements.`) The exemplar/anti-corpus separation leaks.
- **8 rows have no terminal stop; 3 carry the document's own placeholder or a truncation:**
  `This destroys X.` · `X live sieges across X settlements.` · `Something important (a resource, a
  prisoner) falls...` Two rows are the same sentence, one truncated (48 and 56).

## F4. PARTLY — "the chrome registers top Axis B because the bible's exemplar set is itself chrome"

The lane labelled this **PLAUSIBLE**. It is now **measured**, and it is **half right**.

By the bible's *own* §4 surface names, **48 of 67 exemplars (71.6%) come from chrome surfaces**
(landing, pricing, gallery, account, compendium, admin, playbook, pillars, doctrine quotes, plus the
8 meta-description rows); only **9** come from `DATA:*` / dossier-content / settlement-detail.

But rebuilding the exemplar corpus from the **diegetic surfaces only** (V5, n=9) does **not** rescue
the diegetic registers: R1 goes 1.581 → **1.880** and R2 2.263 → **2.498** — *further* from the
bible, not nearer. What changes is the *top*: R16 leaves the podium and the phrase registers
R4 (0.398) and R17 (0.493) take it. Spearman ρ(published order, diegetic-only order) = **0.567**.

**So: chrome composition explains the TOP of Axis B, and explains nothing about the bottom.
R1/R2/R6's distance is a property of those registers, stable under every variant I ran.**

## F5. REFUTED — §5's headline top-3 is not robust to the corpus's own defects

`node refute-bible.mjs`, same 17 metrics, same 19-column pool, only the exemplar set varied:

| variant | n | wps | TOP 3 |
|---|---:|---:|---|
| V0 as published | 67 | 8.1 | **R16 0.510 · R15 0.648 · R9 0.684** |
| V1 drop the 8 B1 meta-description rows | 59 | 6.5 | R16 0.634 · **R9 0.702 · R17 0.707** |
| V3 drop the 8 no-terminal-stop fragments | 59 | 8.7 | **R15 0.642 · R17 0.642 · R9 0.662** — *R16 off the podium* |
| V5 diegetic surfaces only | 9 | 6.4 | **R4 0.398 · R17 0.493 · R9 0.870** |
| V6 the §2 pillar `Do:` set only | 17 | 7.1 | **R17 0.472 · R4 0.504 · R9 0.764** |
| V2 drop the 2 banned-term rows | 65 | 8.3 | R16 0.519 · R15 0.654 · R9 0.705 |

**R16's #1 rank depends on fragment rows; R15's podium place depends on the meta-description rows.**
Only **R9** survives in the top 3 of all six variants. The bottom is immovable: R2 last and R1
second-last in every single variant.

**Bootstrap** (`node boot.mjs`, 400 resamples of the 67 exemplars, seeded LCG):

- P(in published TOP 3): **R15 80.8% · R16 64.3% · R9 43.5%** — but R17 38.3%, R18 30.0%, R11 29.8%.
  The third slot is a four-way near-tie.
- P(in published BOTTOM 3): **R2 100.0% · R1 95.3% · R6 41.5%** — but R5 38.5%, R14 24.5%.
  **R6's third-from-last place is a coin flip against R5.**

**The honest statement §5 can support is: "R2 and R1 are the two least bible-like registers
(certain); R9 and R16/R15 are among the most (third slot undetermined)."**

## F6. Construction defects in Axis B itself

1. **5 of the "seventeen comparable metrics" are one construct — length.** words/segment mean, sd,
   share <8w, share >30w, segments/variant. Spearman ρ between the published 17-metric order and a
   **length-family-only** order is **0.796**; against the 12 non-length metrics it is **0.977**.
   Axis B is ~80% rank-explained by sentence length alone, and its effective dimensionality is
   13, not 17.
2. **5 of the 17 rest on ≤1 observation in n=67**: gloss tail, 2nd-sentence summary, semicolon and
   AI-tells are **exact zeros**; share >30 words is **1/67**. A 0/67 rate has a 95% upper bound near
   0.045, so these four axes encode *"n was too small to see one"* and are then treated as the
   bible's fixed pole for every register's distance. The report's own ⚠ ("a rate below ~0.03 there is
   one-or-two-sentence noise") applies to **4 of the 17 distance metrics** and is not carried into
   the ranking.
3. **Units are mixed in one z-pool. NOT comparable.** The same instrument declares R4 and R17
   `unit: 'phrase'` (admitted at ≥8 chars / ≥2 words, `terminal-stop share` **0.000** for R17) and
   then scores them against the bible on five sentence-length metrics and segments/variant.
   R17 ranks **5th** on the published axis and **1st–2nd** under the diegetic-exemplar variant — for
   no reason except that sub-sentence phrases are short, like slogans. Their presence also moves
   every other column: removing R4/R17 from the pool shifts R16 0.510 → **0.530**, R15 0.648 →
   **0.666**, R9 0.684 → **0.707**, R2 2.263 → **2.305**. The ranking survives; the numbers do not.

## F7. REFUTED (scope) — Axis A is not "compliance with §3's hard rules"; it is four of them

§3 of `docs/VOICE_AND_TONE.md` carries, at minimum: three punctuation prohibitions (em dash,
exclamation, **en dash as connector**), a capitalisation rule, a numerals rule, a contractions rule,
a **13-row terminology & verb registry**, a verb-agency rule and the "real/true" rule.
`breachRate` sums **four** things: em dash, exclamation, emphasis caps, digits (+ a `thePCs` column).

**The en-dash rule is computed by the same script and printed nowhere.** `mechanical.json` carries
`enDashConnector` per register; the §5 table has no such column and `breachRate` ignores it:

```
R15 53 · R16 7 · R18 4 · R8 1   — TOTAL 65
R16: "…migrations 036–040…", "A–Z index: SettlementForge Compendium", "scored 0–1:",
     "Browse the A–Z index.", "By invitation, I–XXX"
R8 : "…require institutional coordination and 250–10,000 in gold per station."
```

R16 is §5's **#1 most-bible-like** register and its Axis-A breach is reported as `0.028` (caps and
digits only) with the headline **"ZERO em dashes in JSX … the debt is burned down."** It carries
**7 unreported breaches of the third punctuation rule in the same section of the same document.**

The 13-row terminology registry is unmeasured entirely. `node refute-mech.mjs` over the same row set:

| §3 registry row | prose-shaped hits | note |
|---|---:|---|
| en dash as connector | **65** | hard rule, computed, unprinted |
| `unlock` / `push to` (a size) | 36 | R9 copy registry; §3 permits "unlock" for feature-gated things — needs a per-hit call |
| `AI overlay` / `AI-narrated` | 11 | mostly dev-facing modules; 1 in R16 `SettlementDetail.jsx` |
| `DM-private` as standalone jargon | 5 | **all R16, all `ShareToGallery.jsx` / `GalleryDetail.jsx`** |
| `publicly visible` / `public-safe` | 4 | **all R16** |
| `profit enormously` | 3 | R8 + R15, one sentence triplicated across three data files |
| `the PCs` | 1 | the one §5 already names |
| `AI-generated` | 7 | **not a breach** — all are the sanctioned anti-AI claim §5.2 exempts |
| `supports` / `enables` / `attracts` | 72 | a *preference* ("prefer concrete civic verbs"), not a hard rule |

**"The bible's hard rules they hold perfectly (breach 0.000)"** survives for R1, R2 and R6 — those
three are 0 on the en-dash test too — but it is a claim about four rules, not about §3.

**Not refuted, and worth saying:** the **zero-exclamation** headline is robust. Across all 86,000
extracted strings only **8** contain `!` and every one is a regex source (`(?<![.\w])blockadeBypass\s*,`);
prose-shaped exclamation strings = **0**. The screen's known blind spot — `NOISE` rejects any string
starting with a non-letter, so the bible's own alarm-prefix example `"! Missing: {name}"` would be
invisible — is real but empty here: no such string exists in the tree.

## F8. PARTLY — the wiring stamp under-counts; 47.1% is right, the per-annex rows are not

**Independent method** (`node refute-annex.mjs`): a **raw-byte scan** of all 2,191 `src/**` source
files (32.0 MB) with a punctuation-blind, slot-masked word-window index. No module import, no AST,
no JSX walker — deliberately disjoint from x6-annex's X2 ∪ X3 ∪ X4 join.

```
TOTAL   prose 9115   wired(raw) 4451 distinct texts (4457 row hits)   48.9%
x6-annex wired 4289 · WIRED BY x6 BUT NOT BY THE RAW SCAN: 0  (strict superset)
surplus 168 rows: 19 slot-only/≤2-real-word FALSE POSITIVES · 51 weak (3–5 real words)
                  98 SUBSTANTIVE (≥6 real words, present verbatim in src)
```

**Defensible independent range: 4,289 – 4,387 wired = 47.1% – 48.1%; authored-unwired 4,826 – 4,728.**
The published headline **47.1% survives as a lower bound.** The published per-annex rows do not:

| annex | x6-annex | raw scan | |
|---|---:|---:|---|
| CAUSAL | **8 (1.1%)** | **129 (17.2%)** | the join is structurally blind here |
| LEGACY | 1214 (88.2%) | 1241 (90.2%) | |
| DOSSIER_STATE | 2030 (99.6%) | 2030 (99.6%) | agrees — and refutes §1's printed 2024 |
| WAR | 306 | 307 | |
| CAUSAL_DOSSIER · TRADE · FAITH · GRAMMAR · INFORMATION · POPULATIONS · COUPLINGS | — | identical | |

**Two structural causes, both verified in the annex source:**

1. **An un-stripped metadata tail.** `RECEIPT_POOLS_CAUSAL.md:3712` is
   ``1. `after the breach of` — back·N``. `noteRe` only strips an *italicised* trailer
   (`\*(?:\([^)]*\)|—[^*]*)\*`), so `— back·N` survives into the join key, which is then compared
   against a src string that can only ever read `'after the breach of'`
   (`heraldCausalGrammar.js:244: c('after the breach of', 'back', 'N')`).
   **101 annex rows carry that tail — a guaranteed no-match for the whole connective family.**
2. **Line-wrapped rows are truncated by the row grammar.** `^(\d+)\. (.+)$` reads one line;
   `RECEIPT_POOLS_CAUSAL.md:4057` is `9. This did not spring up; it was set. {house}'s hand,
   {timeband_since},` and continues on the next line. The complete sentence is in
   `heraldIntegrity.js:69`. **13 rows are wrapped (11 CAUSAL, 2 DOSSIER_STATE)** — they can never
   join, *and their truncated text is what every A-U/A-W style metric in §3–§6 was computed on.*

Consequence for the wave: **`RECEIPT_POOLS_CAUSAL.md` is not the 1.1%-wired orphan §1 reports.**
Its connective grammar and its provenance sentences are live in `heraldCausalGrammar.js` and
`heraldIntegrity.js`. Rewriting it as unwired text would break wired reader surfaces.

---

## F. THE COMMANDS (every figure above)

```sh
T=…/scratchpad/laneOSR18                     # read-only, fd36f0298, porcelain empty before+after
P=…/scratchpad/prose-research/probe-all
W=…/scratchpad/prose-research/sweep/bible-work
cd "$P"
node bible.mjs          "$T" "$W/bible.json"
node x2-walk.mjs        "$T" "$W/walk.json"          # 1,622 modules, 145 import fails, 45,371 leaves
node x5-inline.mjs      "$T" "$W/inline.json"        # 19,342
node x7-jsx.mjs         "$T" "$W/jsx.json"           # 525 files, 12,819 segments
node x1-json-leaves.mjs "$T" "$W/json-leaves.json"   # 2,734 leaves / 786 pools  (exact)
node x6-annex.mjs       "$T" "$W/annex.json" "$W/walk.json" "$W/inline.json" "$W/jsx.json"
node registers.mjs      "$W" "$W/corpus.json"
node mechanical.mjs     "$W" "$W/mechanical.json"
node run.mjs            "$W" "$W/report"
cd "$W"
node refute-mech.mjs  "$W"                    # en-dash + terminology + exclamation blind spot
node refute-bible.mjs "$T" "$W"               # surface composition + 6 construction variants + ρ
node refute-annex.mjs "$T" "$W" src           # raw-byte independent wiring re-count + surplus audit
node wrapcount.mjs    "$T"                    # 13 wrapped rows, 101 metadata-tailed rows
node boot.mjs         "$W"                    # 400-resample bootstrap of the exemplar corpus
```
