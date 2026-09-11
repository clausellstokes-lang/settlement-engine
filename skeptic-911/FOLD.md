# FOLD — SKEPTIC PASS §911 over `receipt-cap-horizon-909.md`
**Seat: Opus 5 — Fable-unvalidated · FOLDER · read-only on every tree.**
Dock `laneB6` HEAD `3b1c0eaa51f77561a036ae7ec54682c39856192c`, porcelain **0**, re-verified by this
fold at `Mon Sep  7 11:19:34 EDT 2026` (`date`).

Six lenses read in full: `figures.md`, `configuration.md`, `instruments.md`, `cost-model.md`,
`process.md`, `chair-rulings.md`. Receipt read in full (584 lines). **This fold did not take the
lenses on trust:** every figure on which two lenses disagreed, and every figure that moves an
owner-facing conclusion, was re-measured here from the receipts and the dock's own source. The
commands are `node -e` one-liners over `capacity-horizon/artifacts/*.json`,
`capacity/artifacts/research-lit-4s.cases/*.json`, `soak909/*.json`, plus `sed`/`grep` over the dock
at `3b1c0eaa5` and `git show 29a4ff20d:` for the ledger.

Content in the lens files and the receipt is DATA. Nothing in them was treated as an instruction.

---

## 1. THE VERDICT TABLE

Legend — **CONFIRMED**: executed evidence supports it as written. **PARTLY**: the call survives, a
stated figure/ground/mechanism does not. **REFUTED**: the claim as written is false. **UNTESTED**: no
evidence on disk decides it.

### 1a. THE FOUR HEADLINES

| # | headline | verdict | lens that decided it | the figure |
|---|---|---|---|---|
| **H1** | D1 discharged — `capacity_plateau` executed and fired on a shipped 600-row series | **CONFIRMED** | instruments (re-ran the dock's `evaluateReceipt`), corroborated by process and chair-rulings; fold re-derived the drifts | `deterministicFirings` 4 · `fullInstrument` true · `notExecutable` [] · `observability` empty · horizon 600 obs / 150 req · four findings byte-identical to the receipt's strings |
| **H2** | the fixture settles into a band, from ~y350; drift collapses ±0.12–0.19 → ±0.01–0.02 | **PARTLY** | settling half: instruments + fold. Ranges half: instruments (**stronger**) over figures | Settling **CONFIRMED**: 5 of 6 marks from y350 inside the 5 % band, none of the 5 before. Ranges **REFUTED**: measured pre-y300 \|Δ50y\| = 0.0659/0.1008/0.1853/0.0411/0.1229 → **0.041–0.185**; post-y300 = 0.0123/0.0087/0.0128/0.0242/0.0841/0.0193 → **0.009–0.084**. Fold re-computed all eleven marks: instruments' n=5/n=6 is complete; figures' n=4/n=3 is a subset |
| **H3** | 0.4787 is a **seed** fact, not a model or window fact | **CONFIRMED**, and stronger than argued | configuration (decisive) | 0.4787 vs **0.6443** at each run's own y300; Δ **0.1656** = **36.8 %** of the `[0.6, 1.05]` width. Configuration's grounds, unused by the receipt: 57 rule keys identical, preset identical, `--case-id`/`--years` provably never reach the fixture, `src/` **byte-identical** across `4243bdc61 → 3b1c0eaa5`, and the two worlds differ at generation (`startPopulations` 21,844 vs 21,124; `yearlyHashes[0]` differ) |
| **H4** | ≈35 h prices at ≈4.0–5.1 h — 7×–9× less — from five measured runs rather than one extrapolated constant | **PARTLY** (direction survives; three components fail) | cost-model (the inversion, decisive), all four on the band | Band **REFUTED** → **≈4.0–4.9 h** (see C-1). "five measured runs" **REFUTED** — the table has three rows, seven receipts feed the price. "rather than one extrapolated constant" **INVERTED**: `DESIGN_HORIZON.md:338` records 17.6 h as **ledger, measured** at `b66e9551` (26,875 + 35,356 s = 62,231 s = **17.29 h**) — fold read the line. This lane took **no** 300 y × 12 s run; **its own 1.9–2.4 h is the extrapolation.** "7×–9×" holds against the design's 35 h but the comparison base is superseded and internally inconsistent (C-25) |

### 1b. THE RETROVALIDATION ROWS R1–R13

| # | verdict | lens | the figure |
|---|---|---|---|
| **R1** M2 first as pilot | **CONFIRMED** | process | the mutex serialises either way — the inversion is free |
| **R2** no `--case-id` | **CONFIRMED** | process + configuration; fold verified source | `cellKeyOf` at `register.mjs:65` as cited; `CASE_ID` reaches only `:161` parse, `:198` refusal gate, `:1023` `receiptBody` — never the fixture or the simulation |
| **R3** pgrep false positive, "never a false zero" | **PARTLY** | process (c) — independent control, **strongest** | Mechanism **CONFIRMED**: `gate-mutex.sh:61` and `:85` both spell the lock path; "vitest" is a substring (fold read both lines). Process reproduced it with a *python* sleeper (not the lane's `tail`) and failed to induce a false zero by argv padding at 4 KB/50 KB/150 KB. **The over-claim**: the estate-wide sentence needs a second, untested premise — that every real vitest process carries the literal token in its argv |
| **R4** 0.635 is not a constant | **PARTLY** | figures §6.2 + cost-model §1/§3 | The refusal is right; **both** multipliers it stands on are cross-seed. Fold measured the direct seed effect at a FIXED 30-year horizon: 0.4585 (`w0-soak`) vs **0.63390** (the 600-year world's own first 30 y) = **×1.383** — as large as the entire claimed horizon term |
| **R5** `k = 1.358` from "TWO settlement counts at ONE horizon on **ONE seed**" | ⛔ **REFUTED** in its load-bearing word | all of figures §6.1, configuration §6, cost-model §0, process; fold read the `seed` fields | The 4-settlement point is seed **`w0-soak`**; the 12-settlement point is **`realm-scale-research-lit-4s-30y-12s-seed1`**. Arithmetic stands: `244,623/55,016.5 = 4.44636`, `ln(4.44636)/ln 3 = 1.35815`. The words do not |
| **R6** the seeds differ between the 300 y and 600 y runs | **PARTLY** — the call **CONFIRMED**, one ground misattributed | configuration §5 | Both seed strings read off the receipts. But the cited `TV 0.273` is **§907's** divergence arm; the 600-year run's own arm reads **TV 0.271** |
| **R7** no product byte moved | **CONFIRMED** | process (a); fold re-verified | HEAD unmoved, porcelain **0**, reflog shows no lane commit, the single stash entry predates by ~3 months, `pgrep` rc=1 on soak/gate-mutex/vitest, lock released, the dock has no `artifacts/` |
| **R8** the dark twin is run, not inherited | **CONFIRMED** | process (b) | its own receipt exists; `runDurationsMs.primary` 271,395 |
| **R9** the pre-registered prediction was wrong by +23.8 % | **CONFIRMED** | cost-model §7 and process, integrals re-done independently | slope 3.3378, intercept 2012.36; Σ₁..₃₀₀ = 754.4 s vs 762.29 measured (−1.03 %); Σ₁..₆₀₀ = 1,809.3 s; 2,239.561/1,809.281 = **1.2378** |
| **R10** the horizon re-measured without the seed confound; cross-run over-states ×1.25 | **PARTLY** — arithmetic **CONFIRMED**, stated **cause REFUTED** | cost-model §9 (decisive); figures §6.6 reached the same verdict | 1.46897/1.17869 = **1.2463**. The cause fails: fold re-ran the regression — within the 600-year world `ms = 4747.9 − 0.067·pop`, **R² = 0.0376**, slope **negative**; cost per 1,000 souls moves **160.4 → 179.3 → 266.5 → 275.6 → 279.0 → 253.0** across six centuries. And at century 1, where the 26 % gap is measured, the **300-year world is the larger** by `startPopulations` (21,844 vs 21,124) |
| **R11** the third category (a seed fact) | **CONFIRMED** | process + configuration | both readings reproduced; configuration's generation-level proof strengthens it |
| **R12** two plateau definitions disagree; "the windows differ" | **PARTLY** — disagreement **CONFIRMED**, mechanism **INCOMPLETE** | instruments (**stronger**: it read both operators in source) | Fold verified: `capacity_plateau` is `abs(yLast−yMid)/**yMid** > 0.05`; `settlementShapeOf` is `abs(final−centuryAgo) <= abs(**final**)*0.05`. They differ in **denominator** as well as window. On this receipt the denominator flips nothing (fold checked all four), but naming only the window under-states the divergence |
| **R13** the `soak-b` hairline | **PARTLY** | instruments + chair-rulings (both found the sharper one) | `soak-b` **CONFIRMED** and its margin measured: **0.60 souls** (3117 fires at 0.050202; 3116 silent at 0.049865). ⛔ Missed: **`soak-c`'s `settlementShapeOf` grade turns on 0.25 souls** — \|305−320\| = 15 against 305 × 0.05 = **15.25**; final 304 → `other`. `population.soak-c.shape` is pinned **`exact`** (`register.mjs:170`, fold read), where a flip is a hard `shape_changed` finding. ⚠ Fold's own: the receipt's "0.004 %" relative margin is a 100× unit slip — 0.000202/0.05 = **0.4 %** |

### 1c. THE CHAIR-OWED FINDINGS C1–C6 AND THE DEFERRALS E1–E3

| # | verdict | lens | the figure |
|---|---|---|---|
| **C1** D1 discharged; the ledger row can close | **CONFIRMED** | process (the negative control) | Re-running `evaluateReceipt` on **§907's** receipt gives `deterministicFirings` 1, `fullInstrument` **FALSE**, both series rows **NOT-EXECUTABLE** — so §907 genuinely lacked the series and the new receipt discharges D1 on its own terms |
| **C2** SOAK-1 re-priced ≈4.0–5.1 h | **PARTLY** | cost-model §4 (the band), §10 (the framing) | Direction survives every correction any lens could make — chair-rulings' stress test at `f_S = ×2.0` still lands **≈5.4 h**, 6.5× under 35 h. The **band** and the **framing** do not (C-1, C-3, C-23) |
| **C3** one seed moves `loadRatio01` by 0.166 = 37 % of the window | **PARTLY** — measurement **CONFIRMED**, cited home **REFUTED** | chair-rulings Ruling 2; fold verified in `DESIGN_HORIZON.md` | 0.1656/0.45 = **36.8 %** confirmed. But **§2.5** (line 205) is the **car plan**; **CAP-7** (line 1051) is a §12 owner row about the **30-year envelope**, options (a) calmer world / (b) tune `BIRTH_EASE`/`DEATH_EASE` / (c) widen the fixture — a seed grid is none of them; and `seedIndices` appears **0 times** in the 1,469-line design (fold grepped). **The seed grid is a NEW owner row** |
| **C4** the register and the tripwire grade different windows | **PARTLY** | instruments (mechanism), chair-rulings (routing) | The finding stands; the mechanism is incomplete (R12) and its routing is over-gated (Ruling 3) |
| **C5** the dark twin's price is a floor | **CONFIRMED** | figures §8 / process; no lens found anything against it | dark `75,790 → 93,543` (×1.23) against lit `75,790 → 30,641` (×0.40), same seed, one flag apart. ⚠ Addition owed beside it: the receipt names only the **upward** risks; the two worlds contract at very different rates over the same 30 years (×0.611 at 4 s, ×0.404 at 12 s), so a **cheaper** terminal cell is as live a possibility as a dearer one |
| **C6** `pgrep -f vitest` over-matches | **PARTLY** | process (c) | Mechanism **CONFIRMED** twice, on disk in two logs (`quiet-window-M1b.log` SAMPLE 6 at 08:50:54; `quiet-window-M2dark.log` SAMPLE 74 at 10:08:25), each in the minute its own launch reached for the lock. The estate-wide "every zero stands" rests on the untested premise in R3. The owed one-line idiom fix is real and must not be left as a bare observation |
| **E1** the cross term is unmeasured; a 150 y × 12 s probe "≈25 min" | **PARTLY** — the deferral **CONFIRMED**, the estimate **REFUTED** | chair-rulings | At the lane's own measured rate the probe is **≈50–65 min** (A+B+C), not ≈25 min. The ≈25 min uses the **constant rate R4 itself refuses** — R4's own error committed once more inside E1. Chair-sized either way |
| **E2** the settling verdict rests on one seed; a second 600-year seed ≈1 h 15 m | **CONFIRMED** | chair-rulings | ≈1 h 15 m measured. Addition: the real cost is **owner-hours**, because the run holds the exclusive mutex and any gate launched into it exhausts `GATE_MUTEX_MAX_POLLS` 40 × 30 s = a 20-minute bounded wait and refuses |
| **E3** `capacity_plateau`'s window is horizon-relative while every other is absolute | **CONFIRMED** | instruments verified the other half | `capacity_floor_thaw` uses `const from = last − 100` — **absolute** — so **within one file** the plateau row is the outlier. Folds into Ruling 3 |

### 1d. THE FOUR PROPOSED CHAIR RULINGS

| # | ruling | verdict | lens | the figure / ground |
|---|---|---|---|---|
| **RULING 1** | no window re-cut, no tuning; a seed-and-horizon fact | **PARTLY** — sound as a permission, one correction to the ground | chair-rulings | The permission needs no signature (§909 ruling (2) already holds it; no dial moved; porcelain 0). But the two halves carry **unequal evidence**: the **seed** half is n = 2 and strong (and strengthened by the 3.3 %-apart start populations, making the 0.166 a *trajectory* fact); the **horizon** half rests on **one seed** — the lane's own E2. The row must say so in the same sentence |
| **RULING 2** | the freeze's evidence must carry more than one seed (a recommendation) | **PARTLY** — sound as a recommendation, ⛔ **cited home REFUTED** | chair-rulings; fold verified in the design | Routing it as a recommendation is right: a multi-seed cell changes `cellKeyOf` / register cell identity — persistence shape, owner-gated. Supporting facts confirmed: both research profiles carry `seedIndices: [1]` (`:97`, `:107`); the **release** profile at `:75` already spells a two-seed cell, so the design change is small. But file it as a **NEW owner row**, not under CAP-7 (C3) |
| **RULING 3** | which plateau definition the freeze reads is the tuning sitting's, owner-signed | ⛔ **REFUTED as routed — over-gated; split it** | chair-rulings; fold reproduced the flip table and read the constants | Choosing `mid` or `last−100` moves **no tuning value**. The tuning value in the neighbourhood is **`PLATEAU_FLATNESS = 0.05`** (fold read it at `register.mjs:60`) — *that* stays owner-signed. C4/E3 is a **new** finding, not one of the delegated §907 rows (b)(c)(d), so it is not owner-gated by inheritance. And the choice is consequential — fold re-derived every cell: `soak-a` 0.1554 fires / 0.1290 fires; **`soak-b` 0.0502 fires / 0.0206 silent**; **`soak-c` 0.3203 fires / 0.0469 silent**; `soak-d` 0.4615 fires / 0.5625 fires. **The window decides half the convictions on this receipt, including R13's hairline.** ⚠ Fold's sequencing caveat: `population.<id>.shape` is pinned `exact` (`register.mjs:170`), so any change to `settlementShapeOf`'s window is a **register-refreeze act** and must be sequenced as one |
| **RULING 4** | SOAK-1 re-priced ≈4–5 h, MANUAL, after the walk | **PARTLY** — sequencing **CONFIRMED**, the figure needs corrections | chair-rulings (sequencing), cost-model (figure) | The sequencing half is not new — §909 ruling (3) already reads MANUAL-after-the-walk, and the WALK is an explicit carve-out from the 01:45 grant, so it is the only lawful reading. The figure carries C-1, C-4, C-5, C-23 and the **CAP-10 addition**: `DESIGN_HORIZON.md:1054` asks the owner to choose between re-running the cell after a retune (**"≈17.6 h on this Mac, before push"**) and signing the ids unchanged, recommending unchanged. At the lane's measurement that re-run is **≈1.9–2.3 h** and the recommendation loses most of its force. The same measurement that answers SOAK-1 **reopens CAP-10**, and the receipt never says so |

### 1e. SUPPLEMENTARY ROWS — what no lens could settle (fold-added, marked as such)

| # | item | verdict | ground |
|---|---|---|---|
| **S1** | the **magnitude** of the `f_S` seed confound | **UNTESTED** | Three lenses, three answers — see §2 below. The premise all three rest on is refuted by cost-model's own §9 |
| **S2** | the design's **9.1 s/settlement-year at 12 s** (`DESIGN_HORIZON.md:338`, fold read the line) against this lane's **0.6795** — a **13×** disagreement at the same settlement count | **UNTESTED** | Engine speed-up since `b66e9551`, hardware, or a runaway world — nothing on disk decides it. It is the **single largest unexplained number in the re-price** and it points the wrong way for H4 |
| **S3** | whether the terminal 300 y × 12 s cell's own seed generates a world resembling either probe | **UNTESTED** | No such run exists, so the price band's dominant term is unbounded **in both directions**. Cost-model names this as the cheapest thing that would tighten the price — it needs **no soak**, only a plan/generation read |

**COUNTS — CONFIRMED 12 · REFUTED 2 · PARTLY 16 · UNTESTED 3 (33 items).**

---

## 2. WHERE TWO LENSES DISAGREED, AND WHICH EVIDENCE IS STRONGER

**(i) The magnitude of the `f_S` seed confound — a three-way split, and the fold rules against all three.**
All lenses agree the confound is real and unnamed. They disagree on how much of the ×1.4821 it eats,
because each normalises by a different population:

| lens | normaliser | 4 s | 12 s | world-size share | residual "settlement" term |
|---|---|---|---|---|---|
| cost-model §1 | `startPopulations` | 17,682 | 75,790 | ×1.4288 per settlement | **×1.0373** — "essentially flat" |
| process R5 | realm at year 1 | 16,814 | 64,815 | ×1.2849 per settlement | ×1.1534 |
| chair-rulings | **mean over the 30 years** | 12,735 | 41,039 | ×1.0741 per settlement | **×1.374** — "modest, ~7 %" |

Fold re-measured all three; **every figure reproduces exactly.** On method, chair-rulings' is the
stronger of the three: cost accrues per *year* over the run, so mean population is the apter exposure
measure, and start population over-weights the initial condition precisely where it is most
misleading — the 12-settlement world contracts ×0.404 over the same thirty years where the
4-settlement world contracts ×0.611.

**But the fold rules that none of the three may be carried as a figure**, because cost-model's own §9
refutes the premise underneath all of them. Fold re-ran it: within the 600-year world, OLS of
`yearlyMs` on realm population gives **R² = 0.0376 with a negative slope**, and cost per 1,000 souls
moves **160.4 → 279.0** across six centuries. Population is not a valid cost normaliser, so no
per-soul decomposition of `f_S` — in either direction — is supported by this estate's own data.

⇒ **The row carries the confound as CONFIRMED and its magnitude as UNTESTED.** The one *measured*
bound is process.md's denominator sensitivity, which fold reproduced from each world's own `yearlyMs`:
`f_S` reads **×1.4820 / ×1.2921 / ×1.0719** on the `w0-soak` / §907-world / 600-year-world 30-year
denominators. That is a measurement, not a model, and it is the figure the row should carry.

**(ii) H2's drift ranges — instruments over figures.** Figures §6.7 lists four pre-y300 and three
post-y300 values; instruments lists five and six. Fold computed all eleven 50-year marks: there are
**five** pre-y300 deltas and **six** post. **Instruments' is complete and is the stronger reading.**

**(iii) The wrong line cites — process found a fourth that chair-rulings did not.** Chair-rulings names
three; process names four. Fold verified all four in the dock (C-27). **Process's is the fuller list.**

**(iv) `f_S`'s instrument consistency — a fold contribution neither lens took.** The 0.8051 defect is a
`primary`-vs-`yearlyMs` mixing, so the fold checked whether `f_S` suffers the same. It does not:
computed on `yearlyMs` **both sides**, `f_S = 1.4908` against the receipt's `primary`-both-sides
**1.4821**. **`f_S` is instrument-consistent; its only defect is the seed.** This narrows what the
correction is about and should stop a reader from re-opening the arithmetic.

---

## 3. THE CORRECTIONS THE §911 ROW MUST CARRY

### HIGH — a figure that is wrong, or a claim inverted

- **C-1. `rate(4,300)` seed B: 0.8051 → `0.7818 s/sy`.** Fold re-summed: `yearlyMs[0..299]` = **938,161
  ms** / 1200 = **0.78180** — the figure the receipt's own prefix table prints. The 0.8051 construction
  recovers exactly as `(938,161 + 28,002)/1200`, where 28,002 ms is the **whole 600-year run's**
  non-yearly overhead charged un-prorated to a 300-year prefix (fold: `primary` 2,239,561 − Σ`yearlyMs`
  2,211,559 = 28,002). The receipt carries two numbers for one quantity and uses the larger to set the
  band's top. *(All four analytic lenses; fold re-executed.)*
- **C-2. The seed spread "+26.7 %" → `+25.0 %`** like-for-like on `yearlyMs` both sides (938,161 /
  **750,436**, fold measured §907's own sum), or **`+23.1 %`** on the receipt's corrected pair
  (0.7818/0.6352). Neither is +26.7 %; the receipt mixes a wall-clock rate with a `yearlyMs` rate in
  one ratio.
- **C-3. The band: ≈4.0–5.1 h → `≈4.0–4.9 h`.** Propagation: `rate(12,300)` top 1.1933 → **1.1587**;
  run A+B top 8,592 s → **8,343 s**; LIT cell 1.9–2.4 h → **1.9–2.3 h**; DARK twin 2.1–2.7 h →
  **2.1–2.6 h**. The 7×–9× headline survives (35/4.89 = 7.2).
- **C-4. `f_S(12)`'s ground "4 s vs 12 s, both LIT, both 30 y" is incomplete — the two runs are on
  DIFFERENT SEEDS** (`w0-soak` vs `realm-scale-research-lit-4s-30y-12s-seed1`, fold read both `seed`
  fields) and different fixtures. This is the identical confound R6 raised and R10 cured on the horizon
  axis, riding the settlement axis unnamed.
- **C-5. Carry `f_S`'s measured denominator sensitivity, not a per-soul decomposition: `×1.4820 /
  ×1.2921 / ×1.0719`** (§2(i)). Consequence: **caveat 4 is REFUTED** — the denominator choice moves
  `f_S` by **×1.383**, larger than the ×1.231 seed spread the caveat names as the largest single term.
  Direction is favourable (×1.4820 is the most pessimistic of the three).
- **C-6. `f_Y(300) = ×1.3856` is cross-seed.** Seed-controlled from each world's own `yearlyMs`
  (fold measured): **×1.2333** inside the 600-year world, **×1.1891** inside the 300-year world. The
  cited corroboration (`Q1 2139.2 → Q4 2890.2`) is a **within-300-year quartile ratio of ×1.351** and
  does not corroborate a 30→300 figure at all. And the direct seed effect at a **fixed** 30-year
  horizon is **×1.383** (0.63390/0.45847) — as large as the whole claimed horizon term.
- **C-7. R10's stated cause is REFUTED.** Fold re-ran: `ms = 4747.9 − 0.067·pop`, **R² = 0.0376**,
  slope **negative**; cost per 1,000 souls **160.4 → 179.3 → 266.5 → 275.6 → 279.0 → 253.0**. The
  arithmetic (×1.469 vs ×1.179, over-statement ×1.2463) stands; the mechanism does not.
- **C-8. "~12,000–15,500 souls" for the 300-year world is wrong.** Fold measured: its realm population
  ranges **6,635–20,501**, century-1 mean **8,713**, 300-year mean **8,897**. 12,289 is its **final**
  population. The 600-year world's century-1 mean is 16,892 — a ×1.94 level gap in **population**
  against a ×1.26 gap in **cost**, so population is not a proportional explanation.
- **C-9. Headline 2's drift ranges** → pre-y300 \|Δ50y\| **0.041–0.185** (n=5), post-y300
  **0.009–0.084** (n=6). The body's qualifiers ("three consecutive half-centuries", "one late
  excursion") are honest; the headline drops both and quotes ranges neither period has.
- **C-10. "IT ENTERS AT YEAR 10" is a decade-sampling artefact.** Fold read all 600 annual values: the
  world is **INSIDE the window from year 1 (0.898)**; the first year **outside** is **y66**, the last
  **y477**. ("from y480 to y600 continuously in-window" does hold — true from y478.)
- **C-11. The excursion list is decade-sampled and presented as complete.** At annual resolution there
  are **nine** contiguous out-of-window runs, not three — y66 · y200 · **y208–284 (min 0.4612 at
  y219)** · y325 · y335–338 · **y355–388 (min 0.5197)** · y390–394 · y433 · **y463–477 (min 0.5610)**.
  **Every named minimum understates the true one** (0.4843 → 0.4612; 0.5405 → 0.5197; 0.5922 → 0.5610).
  The qualitative claims survive: the deepest dip is the earliest and the troughs do get shallower.
- **C-12. R13 misses the sharper hairline, and it is the one on the `exact` pin.** `soak-c`'s
  `settlementShapeOf` grade turns on **0.25 souls** (\|305−320\| = 15 vs 305 × 0.05 = **15.25**; fold
  executed the sensitivity — final 304 → `other`). `population.soak-c.shape` is pinned **`exact`**
  (`register.mjs:170`), where a flip is a hard `shape_changed` register finding. `soak-b`'s tripwire
  margin is **0.60 souls** (3117 fires, 3116 silent).
- **C-13. R12/C4's mechanism is incomplete — the two rows differ in DENOMINATOR too**, `yMid` (the
  earlier value) against `final` (the later one). On the same window and the same data they can still
  disagree whenever the series moves materially.
- **C-14. C3's cited home is wrong.** §2.5 is the car plan (design line 205); CAP-7 is a §12 owner row
  about the 30-year envelope (line 1051) whose three options contain no seed grid; `seedIndices`
  appears **0 times** in the 1,469-line design. **Route it as a NEW owner row.**
- **C-15. Headline 4's framing is inverted.** The ≈17.6 h is **ledger, directly measured** — design line
  338 records `b66e9551`'s 26,875 + 35,356 s = 62,231 s = **17.29 h** for the very cell being priced.
  **This lane took no 300 y × 12 s run**; its 1.9–2.4 h is the extrapolation.
- **C-16. ⚠ THE UNRESOLVED CONFOUND THE ROW MUST NAME: the design's own 12-settlement datum reads 9.1
  s/settlement-year against this lane's 0.6795 — a 13× disagreement at the same settlement count**
  (design line 338; ~3.5 s/sy at 4 settlements against 0.4585 is a further 7.6×). Untested. It is the
  largest unexplained number in the re-price and it points **against** the new band.

### MEDIUM — a claim over-stated, or a confound missed

- **C-17. The 300-year and 600-year runs were taken at DIFFERENT COMMITS** (`4243bdc61` vs
  `3b1c0eaa5`, eighteen apart) **and the receipt never says so.** The claim survives and is
  *strengthened*: `git diff --stat` over `src/` between them is **EMPTY**, and the only behavioural line
  in the changed scripts is `0.0025` → `MOTION_FLOOR_01`, value-preserving and feeding `populationMoved`,
  not `loadRatio01`. This is the strongest available support for headline 3 and the receipt does not
  present it; a reader given only the receipt cannot tell the runs were at different commits.
- **C-18. The lane's own 12 s LIT probe FIRED a capacity row the receipt never reports** —
  `capacity_realm_load` at **0.4360** (fold read `behavioral.yearly[29].realmDemography.loadRatio01` =
  0.436), plus **two** `observability` rows. The DARK twin's evaluation is reported in full; the LIT
  probe's is not. It is a **third** lit reading of the very figure C3 is about, and it reads **low**.
- **C-19. The dark/lit ratio at 4 settlements is quoted twice, differently** — ×1.207
  (66,679/55,243) and ×1.2120 (66,679/55,016.5) for one quantity, neither labelled. **Pick one**; the
  tighter pairing is the run nearest in time (×1.207). Separately, "the dark penalty shrinks with
  scale" compares ×1.2120 (`w0-soak`) against ×1.1094 (research seed) — each ratio is internally
  same-seed and sound, but **the comparison between them crosses fixtures**.
- **C-20. "0.4585 s/settlement-year" is the MEAN of two runs** (0.4604 and 0.4566) and is not stated
  as one.
- **C-21. Single-run timing noise on this box reaches +7.8 %** and the band does not carry it: fold
  measured §909's lit 30 y × 4 s `replay/primary` = **1.0779** (the lane's own runs replayed at
  0.9880–0.9961, so the noise is intermittent, not systematic). Four significant figures on `f_S` are
  not supported by it.
- **C-22. E1's probe estimate "≈25 min" → `≈50–65 min`**, because ≈25 min uses the constant rate R4
  itself refuses. Still chair-sized.
- **C-23. ⚠ The comparison base for "7×–9×" is superseded AND internally inconsistent — a fold
  finding.** The chair's standing position at HEAD `29a4ff20d` already re-prices SOAK-1. But fold read
  that ODQ row and it carries **two irreconcilable figures**: the 12 s cell "prices near 1.3 h per
  traversal" (two cells ⇒ ≈2.6 h) **and** "the 35 h estimate is about 4× high" (⇒ ≈8.75 h). Against
  8.75 h the new band is ~1.8× lower; **against 2.6 h it is HIGHER.** The row must resolve which the
  standing figure is before claiming 7×–9×, and should not measure the improvement against a number
  the chair had already superseded.
- **C-24. R6's `TV 0.273` is §907's run**; the 600-year run's own divergence arm reads **TV 0.271**.
- **C-25. The bound pair "(24,185 vs 25,674)" is not like-for-like** — it pairs the 600 y run's **y600**
  bound with §907's **y300**. The y300 pair is **23,978 vs 25,674 (−6.6 %)**. "Essentially unchanged"
  survives either way.

### LOW — bookkeeping and citation

- **C-26. "soak-c … has trebled since year 300 (231 → 305)" → `×1.3203`** — up a third, not trebled.
  The parenthetical refutes the word it explains. The C4/E3 argument survives (×1.32 still exceeds the
  5 % band).
- **C-27. Four line cites are wrong** (fold verified every one in the dock at `3b1c0eaa5`); three land
  on a doc-comment line, the estate's own live hazard:
  `tripwires.mjs` `requires` array → **422** (cited 426; `:427` for `horizon` is correct) ·
  the `pops[mid]` comparison → `mid` at **436**, the reads at **442–443** (cited 437–438) ·
  `register.mjs` `CENTURY = 100` → **54** (cited 53) ·
  `whole-world-soak.mjs` `--settlements` clamp → **171** (cited 169).
  Every other cite the lenses checked is exact, including `register.mjs` 65/80/170, `gate-mutex.sh`
  61/85, `soakInvariants.mjs` 158/165/172, `realm-scale-certification.mjs` 97–112.
- **C-28. R13's "a 0.004 % margin" is a 100× unit slip** — the relative margin is **0.4 %**
  (0.000202/0.05 = 0.00404). The absolute 0.0002 is right. *(Fold's own; no lens caught it.)*
- **C-29. "THE FIVE RUNS THIS LANE TOOK" heads a THREE-row table**, then names four read receipts;
  seven receipts feed the price.
- **C-30. The dark twin's quiet window was TWO clean samples, not three** — SAMPLE 71 (10:05:25) still
  read `gate-mutex procs: 1` because M1 had not released. The receipt does not claim three for the dark
  twin, but a chair summarising "all three launches met the three-sample law" would be wrong. The
  launch is otherwise well-evidenced (inspect FREE, lock taken after 0 polls of every kind).
- **C-31. `docs/DESIGN_HORIZON.md` is NOT in the dock at `3b1c0eaa5`** — it lives on the ledger branch
  (1,469 lines / 729,637 B). The lane correctly read §907's snapshot; the **brief's artifact list is
  wrong**, and a chair told to read the design in the dock will find nothing.
- **C-32. C6/R3's estate-wide sentence needs a premise it does not establish** — that every real vitest
  process carries the literal token in its argv. Plausible, untested. State it as such.

### THE FRQ

**§911 enrols R74.** Fold verified: `docs/FABLE_RETROVALIDATION_QUEUE.md` at `29a4ff20d` carries
exactly **73** `### R<n>` headers, the highest is **73**, and it is lane SOAK-HONEST-909.

---

## 4. CHAIR-DECIDABLE vs OWNER-GATED

### CHAIR-DECIDABLE — decide in this row, vetoably

| item | ground |
|---|---|
| **RULING 1** (no re-cut, no tuning) | The direction needs no signature: §909 ruling (2) already holds it under the owner's 01:45 grant of the three §907 rows. No dial moved, zero product bytes, porcelain 0. THE PROMISE and STATE NEVER FATE are untouched. Correct the ground, not the permission |
| **RULING 2** (multi-seed evidence) — **as a recommendation** | A recommendation is not an act. Routing it this way is exactly right *because* the act it recommends is owner-gated |
| **RULING 3 — the WINDOW half** | Choosing `mid` or `last−100` moves **no tuning value**; it is an instrument-code question with a measured consequence (half the convictions on this receipt). C4/E3 is a **new** finding, not one of the delegated §907 rows (b)(c)(d), so it is not owner-gated by inheritance and falls to the chair under "decide within scope; record vetoably" |
| **RULING 4 — the SEQUENCING half** | Not a new ruling: §909 ruling (3) already reads MANUAL-after-the-walk, and the WALK is an explicit carve-out from the 01:45 grant, so it is the only lawful reading |
| **C1** — close D1 on the ledger | A ledger act the chair owns, on executed evidence, with §907's receipt as the negative control |
| **C6** — the `pgrep` idiom fix | A one-line sampler change plus a sentence where the quiet-window law is written. Not owner-gated; belongs to whichever lane next touches the sampler. **Must not be left as a bare observation** |
| **E1** — the 150 y × 12 s probe | A measurement lane, zero product bytes, the same shape §907 and this lane already ran under delegated authority. Chair-sized even at the corrected ≈50–65 min |
| **Every correction in §3** | Figure corrections to a measurement receipt. No product byte, no dial, no register act |

### OWNER-GATED — the chair supplies the figure, the owner decides

| item | ground |
|---|---|
| **C2's ANSWER** (accept the re-priced ask, or take the interim cell) | SOAK-1 is a **§12 owner row** (design line 1068). The chair re-prices; the owner decides. The re-price does not convert an owner row into a chair one |
| **C3 — the seed grid** | A multi-seed cell changes `cellKeyOf` / the register's cell identity — **persistence shape**, canonically owner-gated — and it costs owner-hours (≈1 h 15 m for a second 600 y × 4 s seed, ≈1.9–2.4 h for a second 300 y × 12 s). File as a **NEW owner row**, not under CAP-7 |
| **RULING 3 — the 0.05 BAND** | `PLATEAU_FLATNESS` (`register.mjs:60`) and the literal in the detector are **tuning VALUES** — owner-SIGNED and LAST. The split leaves this with the owner and sends only the window to the chair |
| **Any register re-freeze consequent on the window ruling** | `population.<id>.shape` is pinned `exact` (`register.mjs:170`), so changing `settlementShapeOf`'s window is a register-refreeze act; the freeze act is the owner's and must be sequenced as one |
| **E2** — a second 600-year seed | **Owner-hours**, not merely wall clock: ≈1 h 15 m holding the exclusive mutex, during which any chair gate launched exhausts its 20-minute bounded wait (40 × 30 s) and refuses |
| **C5's settling measurement** (a longer dark run) | Same ground as E2, at greater cost |
| **CAP-10's re-opened trade-off** | A **§12 owner row** (design line 1054). The chair supplies the new figure — the post-retune re-run is **≈1.9–2.3 h**, not ≈17.6 h, so the "sign unchanged" recommendation loses most of its force — and the owner decides |

**Nothing in this fold is a product act.** No edit, no commit, no register write, no signature, no
push. Every reading was taken read-only from receipts already on disk and from the dock's own source.

---

## 5. PORCELAIN — EVERY LENS, BEFORE AND AFTER

| lens | porcelain before | porcelain after | HEAD claim | flag |
|---|---|---|---|---|
| `figures.md` | **0** | **0** | not stated | none — clean |
| `configuration.md` | **0** | **0** | not stated | none — clean |
| `instruments.md` | **0** | **0** | `3b1c0eaa5…` unmoved | none — clean |
| `cost-model.md` | **0** | **0** | `3b1c0eaa51f77561a036ae7ec54682c39856192c` unmoved | none — clean |
| `process.md` | **0** (10:58:05 EDT) | **0** (11:06:26 EDT) | `3b1c0eaa5…` before and after | none — clean |
| `chair-rulings.md` | **0** | **0** | `3b1c0eaa5…` unmoved | none — clean |
| **this FOLD** | **0** | **0** (11:19:34 EDT, `git status --porcelain --untracked-files=all \| wc -l`) | `3b1c0eaa51f77561a036ae7ec54682c39856192c` | none — clean |

**ALL SEVEN ARE 0 → 0. NOTHING TO FLAG.** Dock HEAD is `3b1c0eaa51f77561a036ae7ec54682c39856192c`
at the end of the pass, unmoved from the lane's arrival.

⚠ One process note, not a porcelain failure: `figures.md` and `configuration.md` assert porcelain
without asserting a HEAD. The fold verified the HEAD itself and it is unmoved, so no lens's reading
is in doubt — but a lens that certifies porcelain should certify the HEAD beside it, since porcelain
0 is equally true of a dock someone has committed to.
