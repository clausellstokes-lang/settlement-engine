# PROBE_ALL — REFUTATION RECEIPT (fold of four Opus refuters, 2026-09-06)

**Folder: Fable 5.1 (chair seat), 2026-09-06.** This document folds the salvaged structured returns
of four Opus refuter agents (PROBE-ALL-REFUTE, run 05:35–05:49 in the read-only dock
`scratchpad/laneOSR18`) into one receipt. Nothing here was re-measured by the folder; every figure is
copied from an input below. Verdict labels are the refuters' own.

## Inputs (byte count · mtime, from `ls -l` / `stat` at fold time — if these moved, this fold is stale)

| file | bytes | mtime |
|---|---:|---|
| `sweep/probe-all-refute-results.json` (the four structured returns, salvaged from the workflow journal) | 60,703 | 2026-09-06 07:38:08 |
| `sweep/refute-probe-all-extractors.md` | 15,026 | 2026-09-06 05:47:15 |
| `sweep/refute-probe-all-table.md` | 14,787 | 2026-09-06 05:44:02 |
| `sweep/refute-probe-all-tics.md` | 16,723 | 2026-09-06 05:46:16 |
| `sweep/refute-probe-all-bible.md` | 16,815 | 2026-09-06 05:48:27 |
| `PROBE_ALL.md` (the document under refutation) | 83,083 | 2026-09-05 19:10:06 |

All paths relative to `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/`.
The JSON's mtime (07:38) post-dates the four notes files (05:44–05:48): it is the salvage, not a
refuter write.

**Tip:** dock `laneOSR18` HEAD = `fd36f0298b1ead15f2a80eff83dafb92114a7ea4` (§902 product tip; re-read
by the folder with `git rev-parse HEAD`). **PROBE_ALL.md states it read `6b80d1e8e`**, 77 commits
earlier; `src/` differs by 18 files between the two. Two refuters (table, extractors) farmed
`6b80d1e8e` via `git archive` and measured at both shas; two (tics, bible) measured at HEAD only,
after proving the corpora their verdicts rest on (R1/R2/R6/R8, `docs/content/`, `VOICE_AND_TONE.md`)
byte-identical across the two shas. Every refuter reported `git status --porcelain` empty and HEAD
unmoved before and after its run.

Line numbers below are lines of `PROBE_ALL.md` at the mtime above.

---

## 1. Verdicts by family

### 1a. Family `table` — §3 metrics table, §6 outliers (16 verdicts)

| # | finding | published | measured | verdict | refuter's note |
|---|---|---|---|---|---|
| T1 | §3 table re-derivable by §7's commands | 48 rows × 21 cols | 1,008 / 1,008 cells identical | CONFIRMED | re-run at a `git archive 6b80d1e8e` extraction, diffed cell by cell |
| T2 | §3 survives an independent re-implementation | 48 rows | 560 / 560 cells over 28 re-derived rows, 0 diffs | CONFIRMED | `indep.mjs` does not import `metrics.mjs` |
| T3 | §6 full HIGH / LOW lists | 137 high · 147 low | 284 / 284 rows exact; 0 missing, 0 unpublished | CONFIRMED | median rule (A-W excluded, size counts excluded) holds at `run.mjs:99` |
| T4 | §6 "the ten that carry meaning" | 98.2x R2 … 8.4x R6 | all ten exact on value, median, ratio | CONFIRMED | R1 `rather than` 255 of 2,262 recounted exact |
| T5 | §3/§7 extractor + corpus headlines | X1 2,734/786 · X2 45,260/1,621/145 · X3 19,329 · X4 12,809 · X5 9,327→9,115→4,289 · 34,508/41,369 · 53,662/153/0 | every headline identical at 6b80d1e8e | CONFIRMED | all eight X1 angles and all six X2 shape tags |
| T6 | §3 mechanical rows | em R8 4 · R11 1 · R14 1 · R15 71 · R18 44; excl 0; the PCs 1 | identical, enumerated from corpus.json | CONFIRMED | exemplar files printed per register |
| T7 | §6 structural low #1 — R6 share < 8 words (line 719) | 0.005 · median 0.381 · 0.02x | 0.005 · **0.46** · **0.01x** | **REFUTED** | 0.381 is R12's own value; §6's LOW list (line 945) already prints 0.46 |
| T8 | §6 structural low #2 — R16 pools uniform (line 720) | 0.254 · 0.729 · 0.25x | **0.242 · 0.672 · 0.36x** | **REFUTED** | §3 and §6's LOW list (line 987) print the measured triple; 0.729 reproduces under no column set |
| T9 | §1 annex table — DOSSIER_STATE wired (line 120) | 2024 (99.3%) | **2030 (99.6%)** | **REFUTED** | published column sums to 4,283 against its own TOTAL 4,289 |
| T10 | §0 trap-2 receipt — terminal-stop share (line 25) | R8 0.469 · R15 0.585 · R16 0.604 · R10 0.634 | 0.469 · **0.588** · **0.615** · 0.634 | PARTLY | §3's own table prints 0.588 / 0.615; 0.585 unreachable at either sha |
| T11 | §0 trap-3 receipt — "9,700 through a function" (line 26) | 9,700 (8,021 + 1,701) | **9,722**; 9,903 with fn-plain 181 | **REFUTED** | components exact, sum off by 22 |
| T12 | §2 roster — R16 files (line 196) | 361 | **354** | **REFUTED** | §3's `files` row prints 354 |
| T13 | §6 methodology — null pool metrics enter the median as 0 | (implicit) | `Number(null)`=0 admits R10/R11: 8 phantom LOW rows; medians 0.672→0.714 and 0.112→0.126 with nulls dropped | PARTLY | no outlier changes side; ratios inflated (R12 5.96x→5.29x, R18 5.21x→4.63x, R16 4.27x→3.79x) |
| T14 | §6 gloss — "184 of 1,659" (line 706) | 184 / 1,659 variants | cell 0.110 = 185 / 1,689 **segments**; 184 is first-segment-only | PARTLY | 184/1,659 = 0.1109 rounds to 0.111, not 0.110 |
| T15 | §8 self-verification | 16 rows | all 16 land on the published values | CONFIRMED | `crosscheck.mjs` prints 294 occurrences beside the 288-variant label |
| T16 | sha-sensitivity | figures at 6b80d1e8e | at fd36f0298: 34,527 / 41,482; 26 of 1,008 cells and 5 of 284 rows drift, all R15/R16/R18 | PARTLY | not a defect of the report; the sha is load-bearing for any re-runner |

### 1b. Family `tics` — §4 house tics, R6 openers, the PCs, the reader em dashes (10 verdicts)

| # | finding | published | measured | verdict | refuter's note |
|---|---|---|---|---|---|
| K1 | §4 tic tables, 196 rows over 20 columns | 196 (count \| gram) rows | 196 / 196 identical (`diff` empty) | CONFIRMED | R6's ten reproduce to the row, lift to 3 s.f. |
| K2 | §6 "184 of 1,659 open `It is public / It is known`" (line 706) | 184 | 184 There/It-is openers; **147** open with the two named formulas (It is public 143, It is known 4); `It is out` 34 unnamed | PARTLY | per-segment rate paired with a per-variant count |
| K3 | §5 "the ladder has no short sentence at all" (line 682) | none | **9 segments < 8 words**, min 1 word ("Yet."); 21 under 12 | **REFUTED** | p10 = 19 itself CONFIRMED; §6 prints share<8 = 0.005 |
| K4 | §5 one bible violation — `historyData.js:1326` "the PCs" | 1 | 1 in 53,688 strings; render path traced | CONFIRMED | surface is the History tab and PDF Plot Hooks/History, not "the Timeline" |
| K5 | §5 "6 strings of genuine reader prose" (line 625) | 6 (4 + 1 + 1) | **57 distinct reader-facing strings in 13 files** (58 occurrences) | **REFUTED** | `governanceNarrative.js` alone holds 9 reader labels; the sixth of the six is a dev note |
| K6 | §5 R15/R18 "mostly AI-layer prompts, design-token descriptions and dev notes" (line 629) | 146 mostly dev | R18: **38 of 57 reader-facing**, 14 dev, 3 AI prompts, 2 ambiguous; R15: 60 of 83 dev, 23 reader | **REFUTED** | inverts R18's composition |
| K7 | §4 "Overlapping grams are collapsed to one row per phrase family" (line 272) | one row per family | **28 of 196 rows are row-set subsets of a sibling**; R6 `it is public` 146 ⊇ `public that` 126 | **REFUTED** | substring collapse at `metrics.mjs:216`; R6's ten sum to 1,000 against a union of 744 |
| K8 | §4 tic column prints the register's actual phrase | implied by framing | **12 of 196 grams never occur literally**; 17 of 196 examples lack their gram | PARTLY | tokenizer erases punctuation (`destroyed but` = `destroyed, but`, `is out the` = `is out: the`) |
| K9 | hand-read false-positive check, 3 rows × 19 registers | — | 0 false positives in R6; genuine tics confirmed in 9 registers; R6 union 744/1,659 = 44.8% | CONFIRMED | R4/R18/R15 mine stopwords, throw vocabulary, dev labels — composition, not bugs |
| K10 | §8 reproduces the house rates | 16 rows | table exact; `rather than` 288 variants vs the script's 294 occurrences | CONFIRMED | script/table label disagreement will read as a failed repro |

### 1c. Family `extractors` — §1 six extractors, §2 register roster, §0 traps (17 verdicts)

| # | finding | published | measured | verdict | refuter's note |
|---|---|---|---|---|---|
| E1 | X1 JSON leaves | 2,734 / 786 pools / 8 angles | identical | CONFIRMED | identical at HEAD too |
| E2 | X2 walk | 45,260 / 1,621 / 145 failures / six shape tags | identical | CONFIRMED | 133 `VITE_SUPABASE_*`, 0 in the five prose dirs |
| E3 | X3 inline | 19,329 / 1,660 files / 0 failures | identical | CONFIRMED | `find src -name '*.js'` = 1,660 |
| E4 | X4 JSX | 12,809 / 525 of 527 / 0 failures | identical | CONFIRMED | — |
| E5 | X5 per-annex table (line 118–132) | 9,327/106/106/9,115/4,289; DOSSIER_STATE 2,024 (99.3) | totals exact on 12 of 13 rows; DOSSIER_STATE **2,030 (99.6)** | PARTLY | rows sum to 4,283 vs TOTAL 4,289; docs/content identical at both shas |
| E6 | §2 roster n | 34,508 / 41,369; 30,232 + 4,276; every column n | identical | CONFIRMED | at HEAD +19, all in R15/R16/R18 |
| E7 | §2 roster — R16 files (line 196) | 361 | **354** | **REFUTED** | §3 prints 354; every other file count exact |
| E8 | §0 trap 2 (line 25) | R15 0.585 · R16 0.604 | **0.588 · 0.615** | PARTLY | §3 agrees with the measurement |
| E9 | §0 trap 3 (line 26) | 9,700 | **9,722** raw; 2,511 admitted fn-* rows | **REFUTED** | neither reading of "rows" gives 9,700 |
| E10 | §0 trap 4 "only `sovereigntyNews.js` is in R3" (line 27) | one News file; R3 = 12 files | 12 files exact; **`generosityNews.js` is in R3 too** | PARTLY | §2's own roster names both; R3's roster also names two ReceiptPools files carrying 0 rows (credited to `eventProse.js` by barrel order); R9 lists six copy files, four carry rows |
| E11 | §0 traps 1, 5, 6 | R17 1,293 / 0.000; exclusions | identical; 0 rows from any excluded path | CONFIRMED | set-membership over 1,103 distinct files |
| E12 | §3 table + §8 cross-check | — | regenerated table byte-identical; every §8 row | CONFIRMED | 288 is the variant count, 294 the occurrence count |
| E13 | §1 X2 "X5 covers them anyway" (line 84) | 145 failed imports hold no missed prose | **71 admitted module-level strings in no register** (emailTemplates 38, dailyLifeLogic 18, foundersHall 5, emailPreferences 3, 7 elsewhere) | **REFUTED** | X3 takes only function-scoped literals, so a module-level table in an unimportable module is seen by neither |
| E14 | title "every reader-facing prose home in the estate" (line 1) | every home | **364 admitted rows in 18 shipped files outside scope**; 47 house-authored in 10 files, incl. `index.html` og:title em dash and `mcp-server/src/tools.js:185` | **REFUTED** | §0's narrower "every home the inventory named" survives |
| E15 | *refuter's own hypothesis*: `.jsx` in-function literals escape every register | — | 0 rows | REFUTED (negative control) | strengthens PROBE_ALL: `jsxLiteralWalk` already covers them |
| E16 | *refuter's own hypothesis*: `src/**/*.js` leaves matching no register are dropped | — | 0 leaves; R15's regex is `/./` | REFUTED (negative control) | nothing in `src/**/*.js` escapes assignment |
| E17 | sha provenance | 6b80d1e8e | HEAD is 18 src files ahead; 34,527 admitted, drift confined to R15 +11 / R16 +3 / R18 +5 | PARTLY | published figures are sha-bound and correct at their stated sha |

### 1d. Family `bible` — §5 bible-distance axes, the wired-annex figure (12 verdicts)

| # | finding | published | measured | verdict | refuter's note |
|---|---|---|---|---|---|
| B1 | §5 exemplar corpus fingerprint | 67 / 42; wps 8.1 sd 6.9; p50 6; p90 17; 64.2% < 8w; zeros; colon 0.119; paren 0.090 | every value exact; source split 8/17/35/7 | CONFIRMED | `VOICE_AND_TONE.md` byte-identical at both shas |
| B2 | §5 Axis B distances | R16 0.512 · R15 0.650 · R9 0.684 … R6 1.421 · R1 1.581 · R2 2.263 | R16 0.510 · R15 0.648 · R9 0.684; all others exact | CONFIRMED | ±0.002 is sha drift; driver table exact |
| B3 | §5 heading "67 sentences the bible SPEAKS rather than describes" (line 579) + anti-corpus "never mixed in" (line 588) | 67 spoken exemplars | **8 are third-person meta-description (B1); 2 are banned terms** (`"live engine,"`, `"feature flag,"`); 8 lack a terminal stop; 3 placeholder/truncated | **REFUTED** | B1 rows lift the headline wps from 6.5 to 8.1 |
| B4 | §5 "the bible's exemplar set is chrome" (lane-labelled PLAUSIBLE) | reasoned | **48/67 (71.6%) chrome**; diegetic-only exemplars push R1 1.581→1.880, R2 2.263→2.498; ρ = 0.567 | PARTLY | explains the top of Axis B, nothing about the bottom |
| B5 | §5 headline top-3 / bottom-3 | R16/R15/R9 · R2/R1/R6 | top 3 not robust (only R9 in all six variants); bootstrap P(top3) R15 80.8 · R16 64.3 · R9 43.5 · R17 38.3; P(bottom3) R2 100 · R1 95.3 · R6 41.5 · R5 38.5 | PARTLY | R2 and R1 certain; both third slots undetermined |
| B6 | §5 "seventeen comparable metrics" (line 651) | 17 independent axes | **5 are one length construct** (ρ 0.796 vs length-only order); **5 rest on ≤ 1 observation** in n=67 | **REFUTED** | effective dimensionality nearer 13 |
| B7 | Axis B comparable across units | R4/R17 (phrase) ranked with sentence registers | removing R4/R17 shifts R16 0.510→0.530, R15 →0.666, R9 →0.707, R2 →2.305 | **REFUTED** | rank order survives; the numbers do not |
| B8 | §5 Axis A = "mechanical compliance with §3's hard rules" (line 597); "hold perfectly (breach 0.000)" (line 688) | §3's hard rules | `breachRate` sums **four** rules; the en-dash rule is computed (`enDashConnector`) and printed nowhere: **65** (R15 53, R16 7, R18 4, R8 1) | PARTLY | R1/R2/R6 still 0 on en dash; R16 carries 7 unreported |
| B9 | §3 terminology / verb registry held (implied) | implied | **none of the 13 rows measured**; DM-private 5, publicly visible/public-safe 4, profit enormously 3 — all registry "Not this" hits | **REFUTED** | `AI-generated` 7 and `supports/enables/attracts` 72 are NOT breaches |
| B10 | §5 zero exclamation points | 0 of 53,662 | 0 of 53,688; 8 `!` in ~86,000 strings, all regex sources | CONFIRMED | NOISE blind spot tested and empty |
| B11 | wired-annex 4,289 / 9,115 = 47.1% | 47.1% | exact; independent raw-byte scan 4,451 ⊇ 4,289; defensible range 47.1–48.1% | CONFIRMED | the brief's 46.4% is PROSE_INVENTORY's figure, not PROBE_ALL's |
| B12 | §1 X5 per-annex rows — DOSSIER_STATE 2024, CAUSAL 8 (1.1%) (lines 120, 124) | 2024 · 8 | DOSSIER_STATE **2030**; CAUSAL raw scan **129 (17.2%)** — 101 rows carry an un-stripped `— dir·SLOT` tail, 13 rows are line-wrapped and truncated | **REFUTED** | CAUSAL is not a 1.1%-wired orphan; its grammar is live in `heraldCausalGrammar.js` / `heraldIntegrity.js` |

---

## 2. What PROBE_ALL.md must change — every REFUTED and PARTLY finding, deduplicated by sentence

Each row names the section, quotes the wrong sentence (under twelve words), and gives the
corrected figure or wording from the refuter's measurement. "Concur" lists every refuter whose
verdict lands on the same sentence. "Cited" is the command the refuter's `commandsRun` names for
the measurement; every REFUTED row below has one, so every REFUTED row is CONFIRMED-as-executed
(see §7 for the two whose one-liner body is paraphrased).

### 2a. REFUTED (15 distinct defects; 2 further REFUTED verdicts are the extractors refuter's own negative controls, E15/E16, which change nothing)

| # | section · line | wrong sentence (quoted) | correction | concur | cited |
|---|---|---|---|---|---|
| R-1 | title · line 1 | "every reader-facing prose home in the estate" | narrow to §0's "every reader-facing home the inventory named", or add a scope line: 364 admitted rows in 18 shipped files outside `src/**/*.{js,jsx}` and `docs/content/` are unmeasured (47 house-authored in 10 files: `mcp-server/src/tools.js` 17, `public/status.html` 12, `api/*` 8, `index.html` 2 …); `index.html` og:title carries an em dash | extractors E14 | `node miss-probe.mjs $W/tree-6b80d1e8e` |
| R-2 | §0 trap 3 · line 26 | "**9,700** rows arrived through a function" | 9,722 raw walk leaves (8,021 + 1,701; 9,903 with fn-plain 181), of which 2,511 admitted rows carry an fn-* shape | table T11 · extractors E9 | `node x2-walk.mjs` (shape line); `node -e 'corpus.json shape histogram'` |
| R-3 | §1 X2 · line 84 | "and X5 covers them anyway" | strike; replace with: 71 admitted module-level strings inside the 145 unimportable modules belong to no register — `src/lib/emailTemplates.js` 38 (the transactional email the reader receives), `src/components/new/dailyLifeLogic.js` 18, `foundersHall.js` 5, `emailPreferences.js` 3, 7 elsewhere | extractors E13 | `node failed-import-miss.mjs $W/tree-6b80d1e8e` |
| R-4 | §1 X5 table · line 120 | "RECEIPT_POOLS_DOSSIER_STATE.md … \| 2024 \| 99.3" | `2030 \| 99.6` (the column then sums to its own TOTAL 4,289; 2024 is PROSE_INVENTORY's figure re-based onto the new denominator) | table T9 · extractors E5 · bible B12 | `node x6-annex.mjs …` (all three); `python3 -c 'sum([…])'` → 4283 |
| R-5 | §1 X5 table · line 124 | "RECEIPT_POOLS_CAUSAL.md … \| 8 \| 1.1" | keep 8 as the numbered-line join's figure but caveat it: an independent raw-byte scan finds 129 wired (17.2%); the join's `noteRe` leaves the un-italicised `— back·N` tail on 101 rows (`RECEIPT_POOLS_CAUSAL.md:3712` vs `heraldCausalGrammar.js:244`) and the `^(\d+)\. (.+)$` grammar truncates 13 line-wrapped rows (11 CAUSAL, 2 DOSSIER_STATE; `:4057` vs `heraldIntegrity.js:69`). Wave consequence: CAUSAL is not an unwired orphan; the 13 truncated rows are the text every A-U/A-W metric in §3–§6 was computed on | bible B12 | `node refute-annex.mjs <tree> <work> src`; `node wrapcount.mjs`; the two `grep -n` pairs |
| R-6 | §2 roster R16 · line 196 | "\| sentence \| 2685 \| 361 \|" | `354` | table T12 · extractors E7 | `node registers.mjs . corpus.json` (both) |
| R-7 | §4 preamble · line 272 | "Overlapping grams are collapsed to one row per phrase family." | "Overlapping grams are collapsed only where one gram is a substring of another (`metrics.mjs:216`); 28 of 196 rows remain row-set subsets of a sibling — R6's `it is public` (146) contains every `public that` row (126). Do not sum a column: R6's ten sum to 1,000 against a union of 744 (44.8%)" | tics K7 | `node tic-audit.mjs`; `node fp2.mjs` |
| R-8 | §5 heading · line 579 (+ line 588) | "67 sentences the bible SPEAKS rather than describes" | the set holds 8 third-person meta-description rows (all of B1), 2 banned terms scraped from doctrine line 2 (`"live engine,"`, `"feature flag,"`), 8 rows without a terminal stop and 3 placeholder/truncated rows; "never mixed in" (line 588) is false via B4b's quoted-span scrape. Either purge (V1/V3 variants) or relabel; the fingerprint "8.1" words/segment is 6.5 without the B1 rows | bible B3 | `node bible.mjs` (B1:8 split); `node refute-bible.mjs` |
| R-9 | §5 Axis A · line 625 | "**6 strings of genuine reader prose**" | 57 distinct reader-facing em-dash strings in 13 files (58 occurrences): `customContentSchema.js` 15, `crossSettlementConflicts.js` 11, `governanceNarrative.js` **9** (not 1), `labelBands.js` 5, `settlementOriginProse.js` 4, `economicState.js` 3, `safetyProfile.js` 3, `searchIndex.js` 2, one each in `dossierViewModel`, `galleryUtils`, `foundry/moduleBuilder`, `foodGenerator`, `settlementGenerateAction`; the sixth of the published six (`decisionTier.js`) is a dev note. Hazard for the cure: `safetyLabel` is a persisted `economyInputFingerprint` input | tics K5 | `grep -n "—" src/generators/power/governanceNarrative.js` (9); `node readerem.mjs` (57) |
| R-10 | §5 Axis A · line 629 | "mostly AI-layer prompts, design-token descriptions and dev notes" | R18's 57: 38 reader-facing generated prose / UI labels, 14 dev throw/guard messages, 3 AI-layer prompts, 2 ambiguous. R15's 83: 60 dev/design-token/ledger, 23 reader-facing (`customContentSchema` 15, `labelBands` 5, `searchIndex` 2, `dossierViewModel` 1) | tics K6 | `node enum-em.mjs R18`; `node enum-em.mjs R15` |
| R-11 | §5 Axis B · line 651 | "seventeen comparable metrics" | note that 5 of the 17 are one length construct (words/segment mean, sd, share<8, share>30, segments/variant; Spearman ρ 0.796 against a length-only order, 0.977 against the 12 non-length metrics) and 5 rest on ≤ 1 observation in n=67 (gloss tail, 2nd-sentence summary, semicolon, AI-tells are exact zeros; share>30w is 1/67); effective dimensionality ~13 | bible B6 | `node refute-bible.mjs` (ρ); `node boot.mjs` |
| R-12 | §5 Axis B · lines 651–665 | (the axis ranks R4/R17 `unit: phrase` on sentence-length metrics) | state that the z-pool mixes units: R4 and R17 are scored on five sentence-length metrics plus segments/variant; removing them shifts R16 0.510→0.530, R15 0.648→0.666, R9 0.684→0.707, R2 2.263→2.305 (rank order unchanged) | bible B7 | `node refute-bible.mjs` (R4/R17 removed) |
| R-13 | §5 Axis A · line 688 (with B8 below) | "The bible's *hard rules* they hold perfectly (breach 0.000)." | "four of the bible's hard rules" — the 13-row terminology & verb registry is unmeasured by Axis A; an independent count finds `DM-private` 5 (all R16, `ShareToGallery.jsx` / `GalleryDetail.jsx`), `publicly visible` / `public-safe` 4 (all R16), `profit enormously` 3 (R8 + R15). Not breaches: `AI-generated` 7 (sanctioned by §5.2), `supports/enables/attracts` 72 (a preference) | bible B9 | `node refute-mech.mjs <work>` |
| R-14 | §5 · line 682 | "the ladder has **no short sentence at all**" | "no sentence under 19 words at the tenth percentile; 9 of 1,689 segments (0.5%) are under 8 words, the shortest one word (`Yet.`); 21 under 12" | tics K3 | `node r6.mjs` |
| R-15 | §6 structural lows · lines 719–720 | "\| 0.02x \| R6 \| … \| 0.005 \| 0.381 \|" and "\| 0.25x \| R16 \| … \| 0.254 \| 0.729 \|" | `0.01x · 0.005 · 0.46` and `0.36x · 0.242 · 0.672` — the figures §6's own LOW list already prints at lines 945 and 987 | table T7, T8 | `node cmp6.mjs …` (284 rows); `node -e '<recompute 19-col medians …>'` |

### 2b. PARTLY (9 distinct defects not already covered above)

| # | section · line | sentence / figure | correction | concur | cited |
|---|---|---|---|---|---|
| P-1 | §0 trap 2 · line 25 | "R8 0.469, R15 0.585, R16 0.604, R10 0.634" | `R8 0.469, R15 0.588, R16 0.615, R10 0.634` (§3's own table already prints 0.588 / 0.615) | table T10 · extractors E8 | `node -e 'report.json metrics terminalStopShare …'` |
| P-2 | §0 trap 4 · line 27 | "only `sovereigntyNews.js` is in R3" | "two `*News.js` files are in R3, `sovereigntyNews.js` and `generosityNews.js`" (R3 = 12 files stands). Also annotate §2's homes: R3 names `warReceiptPools.js` / `sovereigntyReceiptPools.js`, which carry 0 rows (470 of 477 admissible leaves credited to `eventProse.js` by barrel order); R9 names six `src/copy/*.js`, only four carry rows (§1 X6's "4 files" is right) | extractors E10 | `node -e 'R3 distinct corpus files + warReceiptPools trace'` |
| P-3 | §6 header · lines 694–696 | (the median treats a register with no multi-variant pools as scoring 0) | add: R10 and R11 have no multi-variant pools; `run.mjs:104` `Number.isFinite(Number(null))` admits their nulls as 0, producing 8 phantom LOW rows (R10/R11 × pools-uniform, repeated-opener, within-pool sd, mean pool size) and depressing two medians (pools-uniform 0.672 vs 0.714 nulls-dropped; repeated-opener 0.112 vs 0.126); dependent ratios R12 5.96x→5.29x, R18 5.21x→4.63x, R16 4.27x→3.79x. No outlier changes side | table T13 | `node -e '<recompute 19-col medians … with and without null-drop>'` |
| P-4 | §6 ten-that-carry-meaning · line 706 | "**184 of 1,659** ladder lines open `It is public / It is known`" | "185 of 1,689 segments (0.110) open `There/It is/was/are`; 147 open with `It is public` (143) or `It is known` (4), and 34 open `It is out`" — 184 is a third quantity (first-segment-only openers) and 184/1,659 rounds to 0.111 | table T14 · tics K2 | `node r6.mjs`; `node pub184.mjs`; table's `node --input-type=module -e '<recount R6 There/It-is …>'` |
| P-5 | §4 tic column · line 274 and rows | (the `tic` column reads as a literal phrase) | add: n-grams are formed after every non-`[a-z0-9{}']` character is replaced by a space, so 12 of 196 printed grams never occur literally (R6 `destroyed but` n=75 = `destroyed, but`; R6 `is out the` n=64 = `is out: the`; R10 `machinery with`; R15 `candidate owner` / `owner unsigned` / `band surplus`; R11 `name e`; R12 `by calm`; R14 `is open the`; R9 `seconds then`; R4b `{} and`; R18 `{} 100`) and 17 of 196 printed examples do not contain their printed gram | tics K8 | `node ctx.mjs`; `node fp3.mjs` |
| P-6 | §5 Axis A heading · line 597 | "mechanical compliance with §3's hard rules" | "compliance with four of §3's hard rules (em dash, exclamation, emphasis caps, digits) plus `the PCs`"; add the en-dash-connector column that `mechanical.mjs` already computes: 65 (R15 53, R16 7, R18 4, R8 1). R16 — §5's #1 register, headlined "ZERO em dashes in JSX" — carries 7 unreported en-dash breaches (`A–Z index`, `migrations 036–040`, `scored 0–1`, `I–XXX`); R1/R2/R6 remain 0 | bible B8 | `node mechanical.mjs` (`enDashConnector`); `node refute-mech.mjs` |
| P-7 | §5 · line 668 | "The three most bible-like: R16 …, R15 …, R9 …" | "R2 and R1 are the two least bible-like registers (bootstrap P(bottom3) 100% / 95.3%); R16, R15 and R9 are among the most, the third slot undetermined (P(top3) R15 80.8%, R16 64.3%, R9 43.5%, R17 38.3%, R18 30.0%, R11 29.8%); R6's third-from-last place is a coin flip against R5 (41.5% vs 38.5%)". Only R9 survives in the top 3 of all six construction variants | bible B5 | `node refute-bible.mjs` (V1–V6); `node boot.mjs` (400 resamples) |
| P-8 | §5 · lines 672–675 | "The bible's exemplar set is chrome …" | upgrade from PLAUSIBLE to measured for the top of the axis: 48 of 67 exemplars (71.6%) come from chrome surfaces, 9 from diegetic ones. Withdraw it as an explanation of the bottom: a diegetic-only exemplar set moves R1 1.581→1.880 and R2 2.263→2.498 (further away); Spearman ρ(published, diegetic-only) = 0.567 | bible B4 | `node refute-bible.mjs` (surfaces, V5) |
| P-9 | header · lines 3–8 | "every figure below holds at both shas" (6b80d1e8e / 460a63bca) | true as written; add for later re-runners that at the §902 tip `fd36f0298` the corpus is 34,527 admitted / 41,482 rejected, 26 of 1,008 §3 cells and 5 of 284 §6 rows drift, all inside R15/R16/R18 (R15 +11, R16 +3, R18 +5, from `warRemembrance.js` + `HeraldRemembrance.jsx`), no named register moves, outlier membership unchanged | table T16 · extractors E17 | `node cmp3.mjs … runHEAD/report.table.md` (26 diffs); `git diff --diff-filter=A --name-only 6b80d1e8e HEAD` |

### 2c. Wording notes attached to CONFIRMED verdicts (no figure changes)

- §5 line 635 "read on the Timeline" → the surfaces are the History tab (`HistoryTab.jsx:241`) and the PDF Plot Hooks / History sections (`HistoryFounding.jsx:250-255`, `PlotHooks.jsx`) — tics K4.
- §8 line 1117 "rather than, variants in R1+R2 · 288" is correct; the shipped `crosscheck.mjs:10` prints the occurrence count 294 beside the same label, and the next re-runner will read it as a failed reproduction — tics K10, extractors E12, table T15. The fix is in the script, not the document.
- The brief's "46.4%" is `PROSE_INVENTORY.md` §3 (4,280 / 9,221); PROBE_ALL's 47.1% (4,289 / 9,115) is a different measurement and both reproduce — bible B11.

---

## 3. What SURVIVES — CONFIRMED, by family

**table (7):** the whole §3 table, 1,008 / 1,008 cells at `6b80d1e8e` (T1) and 560 / 560 cells under an independent re-implementation of 28 rows (T2); the §6 HIGH/LOW lists, 284 / 284 rows with membership exact (T3); the ten highlighted outliers, every value/median/ratio (T4); every extractor and corpus headline including the eight X1 angles and six X2 shape tags (T5); the mechanical rows enumerated from the corpus, em dashes 4/1/1/71/44, exclamations 0, `the PCs` 1 (T6); the sixteen §8 self-verification rows (T15).

**tics (4):** all 196 tic rows across 20 columns, identical to the regenerated tables, R6's ten to the row (K1); the single `the PCs` breach at `historyData.js:1326`, 1 in 53,688 strings, render path traced (K4); the hand-read of three tic-triggering rows in every register — zero false positives in R6, genuine tics confirmed in nine registers, R6's habit concentration 44.8% the estate's highest sentence register (K9); the §8 house rates from an independent extraction path (K10).

**extractors (7):** X1 2,734 / 786 / eight angles (E1); X2 45,260 / 1,621 / 145 failures with 133 `VITE_SUPABASE_*` and none in the five prose dirs, all six shape tags (E2); X3 19,329 / 1,660 / 0 (E3); X4 12,809 / 525 of 527 / 0 (E4); the roster's 34,508 admitted / 41,369 rejected and every one of the twenty column counts (E6); §0 traps 1, 5, 6 — R17 = 1,293 phrases at terminal-stop 0.000, zero rows from any excluded path or certification file (E11); the §3 table byte-identical and every §8 row (E12). Two negative controls strengthen the probe: `.jsx` in-function literals and `src/**/*.js` leaves outside every register regex both yield 0 rows (E15, E16).

**bible (4):** the exemplar corpus fingerprint, every published value exact including the 8/17/35/7 source split (B1); the Axis B distances, R16 0.510 · R15 0.648 · R9 0.684 · R2 2.263 · R1 1.581 · R6 1.421 and the R2/R1/R6 driver tables exact (B2); zero exclamation points, 0 of 53,688 prose-shaped strings, with the NOISE blind spot tested and empty (B10); the wired-annex headline 4,289 / 9,115 = 47.1%, held as a strict subset of an independent raw-byte scan (4,451; defensible range 47.1–48.1%) (B11).

Cross-family, the load-bearing claims that survived every attack: the 34,508-row corpus and every register n; the §3 table to the cell; the 284-row outlier census; R2 at 98.2x on over-30-word segments; R6's `There/It is` formula at 18.3x; the R1 / A-U / R14 gloss-tail cluster; R1 `rather than` at 255 of 2,262; 153 em dashes and 0 exclamations corpus-wide; R2 and R1 as the two least bible-like registers under every construction variant and 400 bootstrap resamples.

---

## 4. Counts

| family | verdicts | CONFIRMED | REFUTED | PARTLY | UNMEASURABLE |
|---|---:|---:|---:|---:|---:|
| table | 16 | 7 | 5 | 4 | 0 |
| tics | 10 | 4 | 4 | 2 | 0 |
| extractors | 17 | 7 | 6 | 4 | 0 |
| bible | 12 | 4 | 5 | 3 | 0 |
| **total** | **55** | **22** | **20** | **13** | **0** |

Raw counts are per verdict as recorded in the JSON. Two of the extractors' six REFUTED are the
refuter's own hypotheses (E15, E16 — negative controls that strengthen PROBE_ALL), so the
PROBE_ALL-directed REFUTED count is 18. After deduplicating verdicts that land on the same sentence
(R16 files ×2, "9,700" ×2, DOSSIER_STATE ×3, trap-2 ×2, "184 of 1,659" ×2, sha drift ×2, the X5 table
row split across E5/T9/B12): **15 distinct REFUTED defects and 9 distinct PARTLY defects**, §2 above.

---

## 5. UNMEASURABLE — what the refuters could not re-execute

No verdict in any family carries UNMEASURABLE. The refuters recorded these limits instead, one line each:

- The original PROBE-ALL run's `.json` artefacts are gone from `prose-research/probe-all/` (only the `.mjs` survive), so no refuter could diff against the author's own outputs; every figure is a fresh re-execution (extractors §0).
- The `tics` and `bible` refuters measured at HEAD `fd36f0298` only, so their R15/R16/R18 figures carry the +11/+3/+5 drift and Axis B carries ±0.002; they proved R1/R2/R6/R8, `docs/content/` and `VOICE_AND_TONE.md` byte-identical across the shas, so every named-register verdict is like-for-like.
- The `table` refuter could construct no column set that yields the published 0.729 (19 cols 0.672; nulls dropped 0.714; with A-W 0.693; 17 non-null + A-W 0.7205) — the provenance of that figure is unrecovered, not unmeasured.
- `PROSE_INVENTORY.md`'s 46.4% appears in the brief, not in PROBE_ALL; no verdict was issued against PROBE_ALL for it.
- Four of the `table` family's `commandsRun` entries paraphrase a `node -e` one-liner in angle brackets (`<recompute 19-col medians …>`, `<recount R6 There/It-is …>`, `<enumerate em-dash … rows>`, `<check the twelve highlighted §6 rows>`); the printed outputs are in `refute-probe-all-table.md`, but a re-runner must rewrite the bodies.

---

## 6. Closing

This is a fold of four Opus refuters' verdicts (families `table`, `tics`, `extractors`, `bible`),
salvaged from the workflow journal after the session died before the fold ran. Nothing was
re-measured by the folder; every figure above is copied from the refuters' structured returns and
notes. Every REFUTED row is CONFIRMED only to the extent the refuter cited the command it ran: all
20 REFUTED verdicts have a named command in their family's `commandsRun` (§2a "cited" column), so
none is downgraded to PLAUSIBLE — with the caveat that T7 and T8 (the two §6 structural-low
refutations) rest on a `node -e` one-liner whose body is paraphrased, not printed, in the JSON; their
printed outputs (`median 19-col: 0.46`; the four-way 0.729 search) are in `refute-probe-all-table.md`
§3, and §6's own LOW list (lines 945, 987) independently carries the corrected figures.
