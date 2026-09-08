# PROBE_ALL — CORRECTIONS APPLIED, RECEIPT (2026-09-06)

**Lane: Opus 5 implementer under the Fable 5.1 chair.** Scratch kit only — no product file was
touched, no git act was run. Input receipt: `sweep/PROBE_ALL_REFUTATION.md` (33,427 bytes,
2026-09-06 07:47). Document under correction: `PROBE_ALL.md`, **83,083 bytes / 1,133 lines** at read
time — exactly the size the receipt's line numbers were taken at.

| artefact | before | after |
|---|---:|---:|
| `PROBE_ALL.md` | 83,083 bytes · 1,133 lines | 99,624 bytes · 1,287 lines |
| `PROBE_ALL.v1-unrefuted.md` (original, preserved) | — | 83,083 bytes · 1,133 lines |

`PROBE_ALL.v1-unrefuted.md` did not exist before this run; it is a byte copy of the document as read.

**24 corrections applied: 15 REFUTED (R-1 … R-15) + 9 PARTLY (P-1 … P-9).** Every row of §2a and §2b
of the refutation landed. §2c (three wording notes attached to CONFIRMED verdicts) was **not** applied
— it is outside the brief's scope; see "Left for the chair" below.

---

## 1. Per-correction table

`line (v1)` is the line in `PROBE_ALL.v1-unrefuted.md`; `line (now)` is where the correction stands in
the corrected file. `grep old` counts the OLD wording in the document **body** (the corrections header
at the top of the document deliberately quotes the old wording, so the header is excluded from that
count); `grep new` counts the new figure in the body.

| id | line (v1) → (now) | old → new | label | grep old | grep new |
|---|---|---|---|---:|---:|
| R-1 | 1 → 1, 60 | title "every reader-facing prose home **in the estate**" → "…**the inventory named**", plus a scope caveat: 364 admitted rows in 18 shipped files outside `src/**/*.{js,jsx}` and `docs/content/` unmeasured, 47 house-authored in 10 files, `index.html` og:title carries an em dash | CONFIRMED (E14) | 1 (kept: the caveat quotes the old title verbatim) | 2 |
| R-2 | 26 → 84 | "**9,700** rows arrived through a function" → "**9,722** raw walk leaves (8,021 + 1,701; 9,903 with `fn-plain` 181), of which **2,511** admitted rows carry an `fn-*` shape" | CONFIRMED (T11, E9) | 0 | 1 |
| R-3 | 84 → 142 | "and X5 covers them anyway" → struck; **71 admitted module-level strings** in the 145 unimportable modules belong to no register (`emailTemplates.js` 38, `dailyLifeLogic.js` 18, `foundersHall.js` 5, `emailPreferences.js` 3, 7 elsewhere); X3 takes only function-scoped literals | CONFIRMED (E13) | 0 | 1 |
| R-4 | 120 → 183, 198 | DOSSIER_STATE wired **2024 / 99.3** → **2030 / 99.6**; the wired column now sums to its own TOTAL 4,289 (it summed to 4,283) | CONFIRMED (T9, E5, B12) | 0 | 1 |
| R-5 | 124 → 124 (row kept), 202 | CAUSAL wired **8 / 1.1** kept as the numbered-line join's figure, caveated: raw-byte scan finds **129 wired (17.2%)**; `noteRe` leaves the tail on 101 rows, the row grammar truncates 13 line-wrapped rows; CAUSAL is not an unwired orphan | CONFIRMED (B12) | 1 (figure kept deliberately) | 1 |
| R-6 | 196 → 272, 281 | roster R16 files **361** → **354** | CONFIRMED (T12, E7) | 0 | 1 |
| R-7 | 272 → 357 | "collapsed to one row per phrase family" → "collapsed **only where one gram is a substring of another**" (`metrics.mjs:216`); 28 of 196 rows are row-set subsets; do not sum a column — R6's ten sum to 1,000 against a union of 744 (44.8%) | CONFIRMED (K7) | 0 | 1 |
| R-8 | 579, 588 → 674, 683, 685 | "67 sentences the bible SPEAKS rather than describes" + anti-corpus "never mixed in" → both caveated: 8 third-person meta-description rows (all of B1), 2 banned terms, 8 with no terminal stop, 3 placeholder/truncated; fingerprint **8.1 → 6.5** without the B1 rows | CONFIRMED (B3) | 0 | 1 |
| R-9 | 625 → 732 | "**6 strings of genuine reader prose**" → **57 distinct reader-facing strings in 13 files (58 occurrences)**, `governanceNarrative.js` 9 not 1, the sixth of the six a dev note; ⚠ `safetyLabel` is a persisted `economyInputFingerprint` input | CONFIRMED (K5) | 0 | 1 |
| R-10 | 629 → 741 | R15/R18's 146 "mostly AI-layer prompts, design-token descriptions and dev notes" → R18's 57: **38 reader-facing**, 14 dev, 3 AI prompts, 2 ambiguous; R15's 83: 60 dev, **23 reader-facing** | CONFIRMED (K6) | 0 | 1 |
| R-11 | 651 → 651 (phrase kept), 768 | "seventeen comparable metrics" kept, caveated: 5 are one length construct (ρ **0.796** length-only, **0.977** against the 12 non-length), 5 rest on ≤ 1 observation in n=67; effective dimensionality ~**13** | CONFIRMED (B6) | 1 (phrase kept deliberately) | 1 |
| R-12 | 651–665 → 774 | (unstated) → stated: the z-pool mixes units; removing R4/R17 shifts R16 **0.510→0.530**, R15 **0.648→0.666**, R9 **0.684→0.707**, R2 **2.263→2.305**; rank order survives | CONFIRMED (B7) | n/a | 1 |
| R-13 | 687–688 → 824 | "The bible's *hard rules* they hold perfectly (breach 0.000)." → "**Four** of the bible's hard rules…"; the 13-row terminology/verb registry is unmeasured — `DM-private` 5, `publicly visible`/`public-safe` 4, `profit enormously` 3; not breaches: `AI-generated` 7, `supports/enables/attracts` 72 | CONFIRMED (B9) | 0 | 1 |
| R-14 | 682 → 811 | "the ladder has **no short sentence at all**" → "**no sentence under 19 words at the tenth percentile**; 9 of 1,689 segments (0.5%) under 8 words, the shortest one word (`Yet.`), 21 under 12" | CONFIRMED (K3) | 0 | 1 |
| R-15 | 719–720 → 869–870, 872 | R6 `0.02x · 0.005 · 0.381` → `0.01x · 0.005 · 0.46`; R16 `0.25x · 0.254 · 0.729` → `0.36x · 0.242 · 0.672` | **PLAUSIBLE** (T7, T8) | 0 / 0 | 1 / 2 |
| P-1 | 25 → 83 | trap-2 receipt R15 **0.585**, R16 **0.604** → **0.588**, **0.615** | CONFIRMED (T10, E8) | 0 | 1 |
| P-2 | 27 → 85, 284 | "only `sovereigntyNews.js` is in R3" → "two `*News.js` files are in R3, `sovereigntyNews.js` and `generosityNews.js`"; roster annotated: two ReceiptPools homes carry 0 rows (470 of 477 leaves credited to `eventProse.js` by barrel order), R9's six copy files are four | CONFIRMED (E10) | 0 | 1 |
| P-3 | 694–698 → 842 | (unstated) → stated: `run.mjs:104` admits R10/R11's nulls as 0 → **8 phantom LOW rows**; medians 0.672 vs 0.714 and 0.112 vs 0.126; ratios R12 5.96x→5.29x, R18 5.21x→4.63x, R16 4.27x→3.79x; no outlier changes side | **PLAUSIBLE** (T13) | n/a | 1 |
| P-4 | 706 → 856 | "**184 of 1,659** ladder lines open `It is public / It is known`" → "**185 of 1,689 segments (0.110)** open `There/It is/was/are`; **147** open with the two named formulas (143 + 4), 34 open `It is out`"; 184 is first-segment-only and rounds to 0.111 | **PLAUSIBLE** (T14, K2) | 0 | 1 |
| P-5 | 274 → 364 | (unstated) → stated: grams are formed after every non-`[a-z0-9{}']` character becomes a space, so **12 of 196** printed grams never occur literally and **17 of 196** examples lack their gram | CONFIRMED (K8) | n/a | 1 |
| P-6 | 597 → 699, 716 | Axis A heading "mechanical compliance with §3's hard rules" → "compliance with **four** of §3's hard rules (em dash, exclamation, emphasis caps, digits) plus `the PCs`"; `enDashConnector` **65** (R15 53, R16 7, R18 4, R8 1) printed for the first time; R16 carries 7 unreported | CONFIRMED (B8) | 0 | 1 |
| P-7 | 664–665 (receipt says 668) → 789 | "The three most bible-like … The three least …" → R2/R1 certain at the bottom (P 100% / 95.3%); both third slots undetermined (P(top3) R15 80.8, R16 64.3, R9 43.5, R17 38.3, R18 30.0, R11 29.8; R6 41.5 vs R5 38.5); only R9 holds a top-3 slot in all six variants | CONFIRMED (B5) | 0 | 1 |
| P-8 | 667–670 (receipt says 672–675) → 815 | "the bible's exemplar set is chrome" (lane-labelled PLAUSIBLE) → measured for the top (**48 of 67, 71.6%** chrome; 9 diegetic), **withdrawn** for the bottom (diegetic-only moves R1 1.581→1.880, R2 2.263→2.498; ρ = 0.567) | CONFIRMED (B4) | n/a | 1 |
| P-9 | 3–8 → 66 | "every figure below holds at both shas" true as written; added: at `fd36f0298` the corpus is **34,527 admitted / 41,482 rejected**, 26 of 1,008 §3 cells and 5 of 284 §6 rows drift, all in R15/R16/R18 | CONFIRMED (T16, E17) | n/a | 1 |

**All checks pass.** Every OLD wording is 0 in the body except three deliberate keeps, each named in
the table: R-1 (the scope caveat quotes the old title so the narrowing is legible), R-5 (the receipt
says *keep* 8 / 1.1 and caveat it), R-11 (the receipt says *note*, not replace, "seventeen comparable
metrics"). `grep new` for R-15's R16 row is **2**: the corrected row at line 870 and §6's own LOW list
row at line 1141, which already carried `0.36x · 0.242 · 0.672` in v1 — that is the receipt's own
argument for the correction, not a duplicate edit.

### Line-number drift found while verifying

Every quoted sentence was checked against the receipt's line number before editing. Two were off:

- **P-7** — receipt says line 668; the quoted sentences are at **664–665** (line 668 is the middle of
  the "not a paradox" paragraph). Located by quoted text.
- **P-8** — receipt says lines 672–675; the quoted claim is at **667–670** (672–675 is the R2 driver
  table). Located by quoted text.

Every other line reference in §2a/§2b was exact.

### PLAUSIBLE tagging

Three corrections carry the inline tag *(PLAUSIBLE — the refuter's command is paraphrased;
re-execute before citing)*, per §6 of the receipt and §5's fourth limit:

- **R-15** — the receipt's closing names T7 and T8 explicitly as resting on a `node -e` one-liner
  whose body is paraphrased, not printed.
- **P-3** — its only cited command is `node -e '<recompute 19-col medians … with and without
  null-drop>'`, a paraphrase.
- **P-4** — mixed: `node r6.mjs` and `node pub184.mjs` (tics K2) are named and executable, but the
  185/1,689-segment half comes from the table refuter's paraphrased `<recount R6 There/It-is …>`.
  Tagged for the half that needs re-execution. **Chair may downgrade this tag to CONFIRMED** if the
  tics commands are held sufficient.

Every other correction rests on a named, executable command in the receipt's "cited" column.

---

## 2. Diff accounting

```
diff PROBE_ALL.v1-unrefuted.md PROBE_ALL.md | grep -c '^[<>]'   →  204
   removed (<)  25
   added   (>) 179
   hunks        28
```

Every hunk maps to a listed correction or to the corrections header. Nothing else changed.

| # | hunk (v1 → now) | belongs to |
|---:|---|---|
| 1 | `1c1` | R-1 (title narrowed) |
| 2 | `2a3,49` | the CORRECTIONS APPLIED header block |
| 3 | `11a59,64` | R-1 (scope caveat) |
| 4 | `12a66,70` | P-9 (sha drift note) |
| 5 | `25,27c83,85` | P-1, R-2, P-2 (the three trap-receipt cells) |
| 6 | `84c142,147` | R-3 |
| 7 | `120c183` | R-4 (table cell) |
| 8 | `133a197,200` | R-4 (footnote) |
| 9 | `134a202,210` | R-5 (footnote) |
| 10 | `196c272` | R-6 (table cell) |
| 11 | `204a281,289` | R-6 + P-2 (footnotes) |
| 12 | `272c357,360` | R-7 |
| 13 | `274a363,369` | P-5 |
| 14 | `579c674` | R-8 (heading pointer) |
| 15 | `588c683` | R-8 (anti-corpus row) |
| 16 | `589a685,691` | R-8 (caveat) |
| 17 | `597c699` | P-6 (heading) |
| 18 | `612a715,719` | P-6 (en-dash-connector note) |
| 19 | `625,630c732,744` | R-9 + R-10 |
| 20 | `653a768,778` | R-11 + R-12 |
| 21 | `664,665c789,794` | P-7 |
| 22 | `682c811,813` | R-14 |
| 23 | `683a815,820` | P-8 |
| 24 | `687,688c824,830` | R-13 |
| 25 | `698a841,848` | P-3 |
| 26 | `706c856` | P-4 |
| 27 | `719,720c869,870` | R-15 (both rows) |
| 28 | `721a872,875` | R-15 (footnote) |

**No unaccounted changed line; nothing was reverted.** Table integrity re-measured after the edits: 36
markdown tables, **0 ragged** (v1: 35 tables, 0 ragged — the extra table is the corrections header's
own). Every touched table keeps its v1 column count; every caveat that would have added a column was
written as prose beneath the table instead (P-6's en-dash column, R-4/R-5's annex notes, R-6/P-2's
roster notes, R-15's footnote).

---

## 3. Citation report — REPORT ONLY, the chair edits these

### 3a. `RULES-V2-DRAFT.md`, PART A′ (lines 24–40)

| file · line | quoted phrase | receipt id | what the receipt now says |
|---|---|---|---|
| `RULES-V2-DRAFT.md:29` | "'It is public / It is known / It is public that' **opens 184 lines**" | **P-4** | 185 of 1,689 **segments** (0.110) open `There/It is/was/are`; only **147** open with the two named formulas (`It is public` 143, `It is known` 4); 34 open `It is out`. 184 is a third quantity (first-segment-only) and 184/1,659 rounds to 0.111. PLAUSIBLE. |
| `RULES-V2-DRAFT.md:29` | "**NO short sentence** (p10 = 19 words…)" | **R-14** | p10 = 19 stands, but 9 of 1,689 segments (0.5%) are under 8 words, the shortest one word (`Yet.`), and 21 are under 12. The rule "this register needs SHORT sentences" survives; the evidence sentence does not. |
| `RULES-V2-DRAFT.md:29` | "under-eight share 0.005 against a **0.381 median**" | **R-15** | the median is **0.46** (0.381 is R12's own share<8 value); the ratio is **0.01x**, not 0.02x. PLAUSIBLE. |
| `RULES-V2-DRAFT.md:40` | "the NPC ladder (R6) has … 'It is' openers 0.11 and **no short sentences**" | **R-14** | same refuted claim, restated from `npc-ladder.fingerprint.json`. Both instruments must lose it together. |
| `RULES-V2-DRAFT.md:32` | "A′-R16 JSX/PDF chrome (2,685): the bible's own exemplar register; **nearest the bible by every axis**" | **P-7 · R-12 · P-6** | P-7: R16 holds a top-3 slot in only 64.3% of bootstrap resamples and the third slot is undetermined — only R9 survives all six variants. R-12: removing the phrase-unit registers moves R16 0.510→0.530. P-6: R16 carries **7 unreported en-dash-connector breaches**, so "every axis" is false on the mechanical axis. "Rule: out of scope for the wave" rests on this sentence. |
| `RULES-V2-DRAFT.md:28` | "the **top ten tics are all frames of one mould**; 'and the country' in 7% of lines" | **R-7** | 28 of 196 tic rows are row-set subsets of a sibling (substring collapse at `metrics.mjs:216`); "all frames of one mould" may be the collapse artefact, and a tic column must never be summed (R6's ten sum to 1,000 against a union of 744). |
| `RULES-V2-DRAFT.md:33` | "'can be undone with', 'with options …', '**through the world's own machinery**' at 3–4% each" | **P-5 · R-7** | R10's gram `machinery with` is one of the 12 of 196 printed grams that never occur literally (the tokenizer erases punctuation); the 3–4% rates come from the same non-summable column. |
| `RULES-V2-DRAFT.md:38` | "A′-UNWIRED annex (**4,626 rows in docs only**) … wiring imports the debt" | **R-5** | the wired/unwired split is join-derived: CAUSAL reads 8 wired (1.1%) by the join but **129 (17.2%)** by a raw-byte scan, and 13 line-wrapped rows were **truncated** in the very text every A-U/A-W metric was computed on. The gloss rate 0.062 itself is CONFIRMED (T4). |
| `RULES-V2-DRAFT.md:24` (heading) | "`PROBE_ALL.md`, 20 registers × 47 metrics; **every figure re-derivable by its printed extractor**" | **R-1 · T16/E17** | re-derivability is CONFIRMED (T1: 1,008/1,008 cells; T2: 560/560 independently), but the scope word is narrowed to "every home the inventory named", and the figures are **sha-bound to `6b80d1e8e`** — at `fd36f0298` 26 of 1,008 cells drift. The heading should carry the sha. |
| `RULES-V2-DRAFT.md:37` | "Rule: PROBE-ALL-REFUTE **classifies the tail into reader-facing vs dev**" | **R-10** (answered, not refuted) | the classification has landed for the em-dash-bearing strings: R15's 83 are 60 dev / **23 reader-facing**; R18's 57 are **38 reader-facing** / 14 dev / 3 AI prompts / 2 ambiguous. The open item is narrower than the draft assumes. |

**Explicit negatives in `RULES-V2-DRAFT.md`** (checked, zero hits): `361`, `9,700`, `99.3`, `0.729`,
`0.254`, "seventeen", "6 strings", "breach 0.000", "X5 covers", "phrase family", `53,662`, `34,508`,
`4,289`, `47.1`. Part A (lines 4–22), Part B0 (42–50) and Part B (52–60) cite `probe.mjs`,
`receipt-primary-samples.md` and `estate-state.fingerprint.json`, not PROBE_ALL — no refuted figure
reaches them.

### 3b. `PROSE_STYLE_DOSSIER.md` §3 (lines 43–66)

§3 is measured over a **different** instrument and a different sha (`probe.mjs` at `6e8692b36`), so
almost nothing in it is a PROBE_ALL citation. Two rows are worth the chair's eye:

| file · line | quoted phrase | receipt id | what the receipt says |
|---|---|---|---|
| `PROSE_STYLE_DOSSIER.md:54` | `\| "rather than" \| **288** \| 10.5% of variants \|` | **§2c** (K10 · E12 · T15) | 288 is **correct** — it is the variant count, and PROBE_ALL §8 reproduces it exactly. The hazard is in the shipped script: `crosscheck.mjs:10` prints the **occurrence** count **294** beside the same label, so the next re-runner will read a correct figure as a failed reproduction. The fix is in the script, not in either document. |
| `PROSE_STYLE_DOSSIER.md:62` (and `:75`) | "pools where EVERY variant has the same sentence count \| **407 of 708** \| 57%" | T15 (CONFIRMED) | PROBE_ALL §8 measures **408 (0.576)** against the dossier's 407 (0.575) and publishes the +1 as a known difference between extraction paths. No change owed; noted so it is not "found" again. |

**Explicit negatives in `PROSE_STYLE_DOSSIER.md`**: none of `361`, `9,700`, `99.3`, `0.729`, `0.254`,
"seventeen", "6 strings", "breach 0.000", `53,662`, `4,289`, `47.1` appears anywhere in the file. The
one `2024` hit (line 40) is the publication year of Doshi & Hauser, not the wired-annex figure. §3's
"ZERO in 2,734 dossier variants" (line 47) is CONFIRMED by E1; the length figures at line 48 are the
ones §8's cross-check reproduces.

---

## 4. Left for the chair (not applied — outside the brief's §2a/§2b scope)

1. **§2c, three wording notes on CONFIRMED verdicts**, deliberately not applied:
   - `PROBE_ALL.md` v1 line 635 (now 749) "a generation input **read on the Timeline**" — the surfaces
     are the History tab (`HistoryTab.jsx:241`) and the PDF Plot Hooks / History sections
     (`HistoryFounding.jsx:250-255`, `PlotHooks.jsx`) — tics K4.
   - v1 line 1117 (now 1271) `"rather than", variants in R1+R2 | 288` is right; `crosscheck.mjs:10`
     prints 294 beside the same label — the fix is in the script.
   - the brief's "46.4%" is `PROSE_INVENTORY.md`'s figure (4,280 / 9,221), not PROBE_ALL's 47.1%
     (4,289 / 9,115); both reproduce — bible B11.
2. **`PROBE_ALL.md`'s own "Labelling" paragraph, now line 1283**, still reads *"that the chrome
   registers top Axis B because the bible's exemplar set is itself chrome is **PLAUSIBLE**"*. P-8
   upgrades half of that claim to measured and withdraws the other half, but the receipt does not name
   this sentence, so it was left untouched. It is now inconsistent with the P-8 note at line 815.
3. The receipt's **R-1 offered a choice** ("narrow the title **or** add a scope line"). Both were
   applied — the title narrowed and the scope line added in the header — because the 364-row figure is
   load-bearing for anyone re-running the probe. Revert the scope paragraph if the chair wanted the
   narrower reading only.
4. **R-8 offered a choice** ("either purge (V1/V3 variants) or relabel"). Neither the exemplar set nor
   the fingerprint was recomputed — a purge is a re-measurement, not a correction. The heading and the
   anti-corpus row were **relabelled** and the 6.5 alternative fingerprint recorded beside the 8.1.

---

## 5. Commands run

```sh
cp PROBE_ALL.md PROBE_ALL.v1-unrefuted.md          # v1 did not exist; verified first
python3 apply_corrections.py                        # 24 exact-string edits, each asserted count == 1
python3 verify.py                                   # old/new greps, PLAUSIBLE tag count, diff count
diff PROBE_ALL.v1-unrefuted.md PROBE_ALL.md | grep -c '^[<>]'
```

The edit script refuses to write unless **every** old string matches exactly once, so no edit landed
on a moved or duplicated sentence. Both scripts are in this session's scratchpad
(`.../c0ab83ac-.../scratchpad/apply_corrections.py`, `verify.py`), not in the kit.
