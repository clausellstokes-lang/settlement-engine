# RECEIPT — LANE INSTR-912 (the instrument cars) — **ALL SIX CARS LANDED**
Seat: Opus 5 — Fable-unvalidated
Lane: INSTR-912 · dock `$SC/laneINSTR` (detached at the product tip) · opened 2026-09-07 18:43 EDT (`date`)
Brief: `$SC/briefs/brief-INSTR-912.md`
Status: **COMPLETE for this dispatch.** All six cars landed, plus a seventh (the gate repair
the estate's own ratchets demanded). Dock tip `74a1aa0e8`, porcelain 0.

| # | car | sha | proof |
|---|-----|-----|-------|
| 1 | the entry walker (CLERK-LAWS §2) | `950c0c204` | 19 assertions green |
| 2 | the B-GRAMMAR walker (MOVE-GRAMMAR §4) | `d63f80207` | 42 green |
| 3 | the register loaders | `eb2c330dd` | 10 green |
| 4 | the derived institution table | `37833b22e` | 12 green |
| 5+6 | the measures and D8's ledger walker | `9d257ca7d` | 9 green |
| 7 | the gate repair (six ratchets cured, five mutations planted and proved) | `e3e56f94a` | 205 green over nine walkers |
| 7b | the lighting census refrozen by its own ritual | `74a1aa0e8` | 34 green |

## 0. ARRIVAL CHECK — CONFIRMED
```
$ git -C $SC/laneINSTR rev-parse HEAD
3b1c0eaa51f77561a036ae7ec54682c39856192c        # == the required product tip
$ git -C $SC/laneINSTR status --porcelain | wc -l
0
$ ls -A $SC/laneINSTR/node_modules | wc -l
453
$ date
Mon Sep  7 18:43:23 EDT 2026
```
All three arrival conditions met. No deviation.

### 0.1 HAZARD FOUND AT ARRIVAL (new; worth the index)
The brief's pre-vitest gate command **self-matches**. Run literally:
```
$ pgrep -fl vitest | grep -v gate-mutex | wc -l
7          # <-- FALSE. Zero runners were live.
```
`pgrep -f` matches full command lines, and the shell running *my own* check has the literal
string `vitest` in its cmdline (the Bash tool evals the command string), so the check counts
itself and its pipeline members. The honest form splits the pattern so it cannot appear
literally in the caller's cmdline:
```
$ V=vit; V2=est; pgrep -fl "$V$V2" | wc -l
0          # CONFIRMED: zero vitest runners
```
This lane uses the split-pattern form before **every** vitest run, together with
`ls $SC/HOLD-VITEST` (absent at arrival). CONFIRMED.

## 0.2 CAR PLAN (the brief's order; each with focused proofs green before the next)
| # | Car | Gates? | Planned landing |
|---|-----|--------|-----------------|
| 1 | The entry walker (CLERK-LAWS §2): C1–C6, FAIL/WITHHELD/NOTE, composed-fill licence, 4 Brackwater fixtures, anti-vacuity guard on the 4 live breaches | yes (lint suite) | pending |
| 2 | The B-GRAMMAR walker (MOVE-GRAMMAR §4 as amended): arms A–J, the owner's three numbers, the ten §J gaps, a negative control per arm, per-paragraph re-measurement (report only) | yes | pending |
| 3 | The loaders in the wave's order (chronicle, R5, R4b, R6, R7, D-d, chrome pools) | no | pending |
| 4 | The derived, unpersisted institution table (CLERK-LAWS §1/§1.5) | no | pending |
| 5 | The presence measure + the unrendered-facts census (report only) | no | pending |
| 6 | D8's ledger walker (report only) | no | pending |

---

## CAR 1 — THE ENTRY WALKER (CLERK-LAWS §2) — **LANDED** · sha `950c0c204` · 2026-09-07 19:18 EDT

### 1.1 What was built (7 files, 2,671 lines, zero product bytes moved)
| file | what it is |
|---|---|
| `src/domain/prose/entryLexicons.js` | every detector word list, exported and countable (FINITE SEMANTICS: the regex detects, the TABLE judges — a detector nobody can read is a detector nobody can argue with) |
| `src/domain/prose/entryWalker.js` | `walkEntry(entry, ground)` — C1–C6 plus arms **D** (licence against the composed fill), **Q** (QUALIFY's second typed field), **X** (exhaustivity of a specificational copula), **F25** (a citation's content) |
| `src/domain/prose/entryGround.js` | the ESTATE ground (what holds on every settlement) and the SETTLEMENT ground |
| `tests/helpers/dossierCorpus.js` | loaders: R1 leaves · R2 causal · the annex by RAW BYTES · R5 (both homes, three tables) · a generator in-function home |
| `tests/helpers/dossierComposedFill.js` | the composer's bag per (block, pool), resolved from source through helper parameters |
| `tests/fixtures/brackwaterTables.js` | the four tables, the positive controls, the NL-4 gender fixture |
| `tests/lint/proseEntryContradiction.walker.test.js` | the gate — 19 assertions |

**Four channels, not three.** FAIL · WITHHELD · NOTE, plus **NOT-EXECUTABLE** — the §908 law
made executable: a limb keyed on a field the ground does not carry says which field it
wanted instead of answering `[]` and reading as a pass. 1,399 not-executable limbs on the
corpus run, every one named.

**Two scopes.** A pool VARIANT is not bound to a settlement, so a corpus-wide run cannot
consult a per-town row. `scope: 'estate'` runs the limbs whose facts hold everywhere
(persons never closed; `whoIsExempt` null everywhere; an office noun absent from the whole
estate); `scope: 'settlement'` runs every limb. Anything else declares itself not-executable.

### 1.2 THE FOUR BRACKWATER FIXTURES — every one measured (`node probe-brackwater.mjs`)
| fixture | FAIL set measured | matches the spec? |
|---|---|---|
| (a) no rows — the product today | C1 figure · C2 exemption-on-null · C2 office ×2 (`bailiff`, `priest`) · C2 duty · **C4 totality ×2** | **YES** — §2.4(a) exactly; "goes upriver salted" WITHHELD on a route claim and a processing claim, as §2.4 requires |
| (b) bailiff + count duty + exemption, persons open | C1 figure · **C4 totality ×2**; zero C2 | **REFUSED IN ONE WORD** — see 1.6 |
| (c) as (b), persons CLOSED (synthetic) | C1 figure only; **zero C4 quantifier fails** | **YES** — the arm keys on the FLAG, not the noun |
| (d) rows `closed: true`, COLUMN open (the sitting's fourth) | identical to (b): **C4 totality ×2** | **YES** — the only fixture that discriminates per-column from per-row |

A fifth assertion pins that the four tables do not all produce one answer, so the fixture set
cannot silently collapse into one case.

### 1.3 THE CONTROLS — every one MUST fire, and every one does
| control | command | result |
|---|---|---|
| the four Brackwater tables | `npx vitest run tests/lint/proseEntryContradiction.walker.test.js` | (a) 7 fails · (b) 3 · (c) 1 · (d) 3 — a walker that could not fail would return the same set four times |
| POSITIVE control ×3 (banded count · `PRE_SEED` "since the founding" · the roster LACK "there is no watch") | same | **PASS, zero fails** — a walker that reds on a licensed sentence has the detector doing the judging |
| NL-4 GENDER fixture — ONE line, two bearers | same | `male → PASS`, `female → FAIL`. The test also pins that the two texts are byte-identical, so the arm is reading the FIELD |
| **ANTI-VACUITY**: the four live breaches | same | all four RED, each in its assigned class (table 1.4) |
| **MUTATION control** per breach — the offending word removed | same | every one stops failing on that arm. A detector that reds on everything measures as little as one that reds on nothing |
| the composed-fill resolver against an orthogonal witness | same | the "no bag" set **equals** `dossierMounts.UNMOUNTED_BLOCKS`, 15 blocks |

### 1.4 THE ANTI-VACUITY GUARD — the four live breaches, measured at 3b1c0eaa5
| breach | address | class fired | mutation control |
|---|---|---|---|
| "every household is counted for the levy" | `src/domain/display/newsVoice.js:97` (loaded as `VOICE_LINES::war::onset#4`, line recovered = **97**) | **C4 · a totality over an open column** | cured text stops failing |
| "the same trades exempt" (annex) | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5233` → joined to `DS-GEN-1 :: occupation_legacy` | **C2 · exemption on a null column** | cured text stops failing |
| the leaf twin | `src/data/dossierStateProse/general.generated.js:855` (`DS-GEN-1::occupation_legacy#2`) | **C2 · exemption on a null column** | cured text stops failing |
| "Church land exemptions…" | `src/generators/factionDynamics.js:466` | **C2 · exemption on a null column** | cured text stops failing |

**THREE BREACHES THE SITTING DID NOT NAME** (new, CONFIRMED by the same run):
- `causal::*::311#0` — "…are in {settlement}'s book and are **not counted** when the hall counts…" — a second exemption assertion on the null column, in the CAUSAL register.
- `VOICE_LINES::authority::onset#3`, `::relief#3`, `::fade#3` — three crier lines asserting **"the reeve's writs"**. `reeve` is an office noun the estate holds ONLY as part of an institution NAME (`institutionalCatalog.js`, "Lord's reeve"); no NPC role catalogue carries it. This is precisely the class CLERK-LAWS §1.2 predicted and nobody had walked.

### 1.5 THE CORPUS CENSUS (report-only; the walker gates the instrument, never the corpus)
`3,132 entries walked` — 2,266 R1 · 468 R2 · 374 R5 · 24 generator.
```
  entries with a FAIL: 254 (8.1%)
  WITHHELD findings: 1311
  NOT-EXECUTABLE limbs: 1399
 128  C4 · a bare future indicative
 114  D  · a slot the composer never fills
  13  C4 · a totality over an open column
   3  C2 · exemption on a null column
   3  C2 · an office the world does not hold
```
Two of those rows are large enough to be findings in their own right:
- **128 bare future indicatives.** This is the SPEC'S OWN literal reading (CLERK-LAWS §2.6: "a bare future on ANY variant fails — STATE never FATE — not only one added by a rewrite"). `check-pair.mjs:123` only fails a future a rewrite ADDS; at the entry the rule is absolute. The 128 are reported, not asserted as defects: the chair rules whether the entry-level arm is the intended reading before the wave prices it.
- **114 unreachable variants.** A variant naming a slot the composer's bag never offers is dropped by anchored liveness at every draw — authored prose no seed can reach. Concentrated in `DS-DEF-4` ({seat}), `DS-DEF-6` ({institution}, {route}), `DS-DEF-9` ({good}).

### 1.6 REFUSALS (each with its measurement)
1. **§2.4 fixture (b)'s word "ONLY" is REFUSED.** The spec says (b) fails "on the two
   quantifiers ONLY". MEASURED: it also fails the FIGURE. Ground: CLERK-LAWS §1.4 walks the
   same clause and answers *"'three hundred' is a digit-class count outside `QUANTITY_BANDS`
   — REFUSED as a figure … nothing more: the band word"*. The figure arm keys on the closed
   vocabulary, not on a table row, so **no row the owner could add reaches it**. Fixture (c)
   is therefore not a bare "PASS" either: it is zero C4-quantifier fails, which is what the
   fixture exists to prove. Both readings are written into the test beside the assertion.
2. **§2.4's "WITHHELD on 'goes upriver salted' (C3 semantic)" is honoured on a different
   ground than "semantic".** MEASURED: the licence CLERK-LAWS §1.4 names is `resources[].flow`
   plus a `supplyChainState` chain row plus a route field — a per-settlement read no
   corpus-wide ground carries. So the limb is WITHHELD because its column is out of scope,
   not because a model could not judge it. Two findings, one per claim kind (route,
   processing), each naming the field it wanted.
3. **C5's office and status limbs are DOWNGRADED to WITHHELD.** MEASURED: a bag comparison
   reported 4 status "contradictions" over the dossier corpus and every one was two variants
   speaking about DIFFERENT SUBJECTS ("the ground it has given up" beside "the fields
   furthest out are standing untended"). Without a subject a status word is not a structural
   fact. The BAND limb keeps its FAIL because it HAS a subject — the governed count noun.
4. **The R5 count disagrees with PROBE_ALL's and is reported, not reconciled.** MEASURED:
   374 authored LINES across the three tables in the two files PROBE_ALL's roster names
   (`VOICE_LINES` + `VOICE_FLOOR` + `BODY_POOLS`), carrying 397 sentences and 374 distinct
   texts. PROBE_ALL prints **373** with `unit: sentence` and dedup by normalised text. The
   two are different measures; the walker prints both.
5. **The annex's POOL GRAMMAR is not re-parsed, and that is a refusal of the obvious route.**
   MEASURED: this lane's first cut implemented the bold-line pool rule with one regex and
   mis-keyed the row at `:5233` to the PREVIOUS pool (`magical_controversy` instead of
   `occupation_legacy`) — a silent mis-address on the exact row the guard cites. The shipped
   projection carries SEVEN regexes for that grammar. The raw-byte reader now takes only the
   LINE ADDRESS and joins to the projected twin by text: **2,030 of 2,030 rows join, zero
   unjoined**, and the walker test asserts the zero.

### 1.7 THE COUNTS, each from a command whose output was seen — CONFIRMED
| figure | measured | against |
|---|---|---|
| R1 + R2 variants | **2,734** in **786** pools | PROBE_ALL X1's 2,734 / 786 — exact |
| R1 blocks | **68** | the leaves' own block ids |
| annex rows (raw bytes, wired) | **2,030** | PROBE_ALL R-4's corrected 2,030 — exact |
| annex rows joined to a leaf twin | **2,030 / 2,030**; 236 leaf variants carry no annex line (the compact-row grammar's 225 + the canonical rows) | declared as the ADDRESS reader's gap |
| R5 lines / sentences / distinct | **374 / 397 / 374** | PROBE_ALL's 373 (a different unit) |
| `readStateProse` call sites resolved | **96** (31 raw sites, expanded through their helpers), **0 unresolved** | — |
| blocks with a composer bag | **53 of 68**; the 15 without = `UNMOUNTED_BLOCKS` exactly | `dossierMounts.js`'s shrink-only registry |
| the three hand-measured bags | `DS-POW-5 = [seat, settlement]` · `DS-GEN-18 = [good, institution, resource, settlement]` (resource conditional) · `DS-ECO-11 = [access, complexity, good, institution, resource, season, settlement]` | each composer's own source comment — agreement in all three |
| derived office roster | **35 roles**; `bailiff` in none | CLERK-LAWS §1.2's "no `bailiff` exists anywhere" |

### 1.8 THE PROOFS (commands run in-shell; exit codes captured)
```
$ npx vitest run tests/lint/proseEntryContradiction.walker.test.js --reporter=verbose ; echo EXIT=$?
  Test Files  1 passed (1)
       Tests  19 passed (19)
EXIT=0
$ npx eslint src/domain/prose tests/lint/proseEntryContradiction.walker.test.js \
      tests/helpers/dossierCorpus.js tests/helpers/dossierComposedFill.js \
      tests/fixtures/brackwaterTables.js ; echo EXIT=$?
EXIT=0                                   # clean, after two fixes (a sparse array, a stale disable)
$ npx tsc --noEmit -p tsconfig.json 2>&1 | grep 'domain/prose'
                                         # (no output — zero errors in the new domain files)
$ node scripts/check-full-typecheck.mjs ; echo EXIT=$?
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
EXIT=0                                   # the ceiling did not move
$ npx vitest run tests/lint/contractTestAntiVacuity.walker.test.js \
      tests/lint/domainStrictBaseline.test.js tests/lint/domainStrictFailClosed.test.js ; echo EXIT=$?
  Test Files  3 passed (3)
       Tests  33 passed (33)
EXIT=0                                   # the estate's own anti-vacuity guard accepts the new lint file
```
Pre-run gate, before every vitest invocation: `ls $SC/HOLD-VITEST` absent; split-pattern
runner count 0 (§0.1).

### 1.9 THE PROMISE — held
`stateProseKernel.drawVariant` is byte-unchanged and imports nothing from this car; nothing
built here runs at the draw; no pool length, key, order or index moved; no corpus byte moved
(no annex row, no leaf text, no pool, no string a reader meets). The three new `src/` files
are display-side, imported today only by a test, and therefore byte-inert to every golden
and absent from the bundle.

### 1.10 What a successor continues from
Dock tip `950c0c204`, porcelain 0. Car 2 (the B-GRAMMAR walker) begins next and REUSES:
`tests/helpers/dossierCorpus.js` (its loaders), `tests/helpers/dossierComposedFill.js`
(arm D's judge) and `entryWalker.typedFactsOf` (arm C-sibling). The institution table
(car 4) will replace `entryGround.estateGround`'s hand-supplied office roster with the
table's own `office` column; the seam is `estateGround({officeRoster})` and nothing else
needs to change.

---

## CAR 2 — THE B-GRAMMAR WALKER (MOVE-GRAMMAR §4 as amended) — **LANDED** · sha `d63f80207` · 2026-09-07 19:38 EDT

### 2.1 What was built (5 files, 1,944 lines)
| file | what it is |
|---|---|
| `src/domain/prose/moveGrammar.js` | the eleven typed moves + the two positional ones · the eight non-moves with a detector each · V1–V8 · E1–E6 · the ten walls **SCOPED** as SITTING B.4.1 ruled · the `grammar:` tag CONTRACT · the classifier |
| `src/domain/prose/proseFingerprint.js` | the 21 rate metrics, in the estate, over any unit of prose |
| `src/domain/prose/grammarWalker.js` | arms **A · B1 · B2 · B3 · C-sibling · D · E · F · G · H · I · J**, the three numbers, the ten gaps |
| `tests/fixtures/grammarControls.js` | 4 negative controls + 1 positive + one per owed arm + the hand-tagged sample |
| `tests/lint/proseMoveGrammar.walker.test.js` | the gate — 42 assertions |

### 2.2 THE CEILINGS, as the sitting corrected them — asserted, not assumed
`ceiling(n) = min(1/n + 0.10, 1.5/n)` for n ≥ 3; **NOT-EXECUTABLE at n ≤ 2**. Asserted at
n = 3 (0.4333), 4 (0.35), 5 (0.30), 6 (0.25), 8 (0.1875), and asserted to hold ≤ 1.6× uniform
at every n in {3,4,5,6,8,12,20} — the 13:22 bar, which the old fixed 0.35 breaches at n = 6.
Arm B1's slack is `1/n + 2 SE` floored at `1/n + 0.05`, asserted to be SE-dominated on a
40-line sample and floor-dominated on a large one — never a fixed 0.05.

### 2.3 THE CONTROLS — every one fires, and the ones built to stay silent stay silent
| control | what it must do | measured |
|---|---|---|
| **1 · the owner's own template** (40 units, one order) | RED on arm A (share 1.0) and arm B1 (run 1.0) | both red, share exactly 1, run exactly 1 |
| **2 · the rota** (E1→E2→E3→E4…) | PASS A and B1, **RED on B3** | passes A and B1; B3 reds; every transition row at share 1.0 and **0 bits** of entropy |
| **3 · Brackwater** | red on the claim arm twice, not on the nouns alone | car 1's four tables (§1.2) — the grammar face of the same arm |
| **4 · today's R1 leaves** | reproduce PROBE_ALL's two figures **exactly** | **407 / 708** uniform in segment count · **79 / 708** repeated opener · 708 pools. The SEGMENT is pinned in writing in `segmentCount`'s doc: a SENTENCE, by `check-pair.mjs:43`'s rule |
| **5 · the positive control** (a fair draw, n = 6, 600 units) | PASS every arm | zero fails on A and B; top share below the ceiling; run rate below the run ceiling |
| **B2** | adjacency judged at the CHANCE FLOOR, so a fair draw is not called a loop | zero B2 notes on a fair draw; chance floor exactly 1/n |
| **H** | n ≤ 2 → NOT-EXECUTABLE, never a pass | arm A returns zero fails and one not-executable row; a pool of one likewise |
| **F1 F2 F3 F6(×2)** | one control each, each firing | all five fire; and a 3-sentence CHROME unit does **not** fire F6 while a dossier one does — the scoping is live |
| **G × 6** (FORECAST · MEANING · VERDICT · FEELING · FIGURE · SAYING) | one control each | all six fire; arm G stays silent on a licensed record sentence |
| **D** | fail a slot the bag does not offer, pass one it does | the pair discriminates; with no bag supplied the arm is NOT-EXECUTABLE, never a pass |
| **C-sibling** | red on two variants banding ONE noun differently; pass an honest difference | the conflicting pair reds; the lawful pair (a difference by OMISSION) passes |
| **BUDGET · DEPTH · PERFECTION · SPREAD** | fire on a unit built to trip each; exempt a DECLARED defining feature | all four; the defining-feature exemption moves a DEPTH fail to a note; with no bands every one is NOT-EXECUTABLE |

### 2.4 THE CLASSIFIER, MEASURED BEFORE IT GATES — and it does not gate
MOVE-GRAMMAR §4.1 item 3: *its precision is measured on a hand-tagged sample before it gates
anything.* Twenty-four variants, drawn deterministically (every 97th entry of the loaded
corpus, so the selection carries no taste), hand-tagged with a written GROUND per line:
```
  exact sequence:      20/24 = 0.83
  conservative:        18/24 = 0.75   (the two tags this lane revised AFTER seeing the
                                       classifier's output counted as disagreements)
  first move agrees:   22/24 = 0.92
```
**RULING (this lane's, vetoable): arm A REPORTS and does not gate.** At 0.75–0.83 the
classifier is good enough to read a distribution and not good enough to fail a pool on one
reading. The four disagreements are printed by the test, each with the hand tag beside the
machine tag. The two revised tags are marked `revisedAfterSeeing` in the fixture, so the bias
is visible rather than buried — a hand tag changed after seeing the answer is not evidence.

**One improvement round, measured before and after.** The first classifier scored 13/24. Three
defects were named and cured: a bare `was`/`were` read as HISTORY inside a present clause; a
fronted subordinate clause ("After the fire came, …") swallowed the state that followed it, so
wall 1 could not fire on the plainest breach of itself; and a clause carrying two assertions
reported only the second, INVERTING an order — which is fatal in an instrument whose whole
subject is order. After: 20/24.

### 2.5 THE SIMULATED READING SEQUENCE — 200 towns, composed through the SHIPPED composers
`$SC/instr-912/reading-sequence.mjs`, `gen-probe2.mjs`'s method with REAL readings (never
`{}` — a composer called with empty readings selects its ABSENCE pools for every seed and
manufactures a finding).
```
towns 200 of 200 (composer throws 0) | lines 1,986 | mean 9.9 lines/town
realised orders n = 14 | ceiling(14) = 0.1071
ARM A  FAIL: order V1 holds 78.4% of 1,986 (ceiling 10.7% at n = 14)   — 7.3x the ceiling
ARM B1 FAIL: same-order-as-previous 1,104/1,786 = 0.6181 (ceiling 0.1214)  — 5.1x
ARM B3: 10 of 14 transition rows concentrate above 0.50
```
**This is the walker's first-run finding and it is the wave's whole case in three numbers.**
MOVE-GRAMMAR §4.4 predicted "one grammar above 0.35"; the measured share is 0.784. CAVEAT,
stated: the reading is bounded by the classifier's 0.75–0.83 precision and V1 is the
classifier's fallback, so the figure is an UPPER bound on uniformity. It is a finding for the
chair, not a verdict.

### 2.6 THE OWNER'S THREE NUMBERS — the OWED per-paragraph refinement, measured
**The register level reproduces the sitting exactly** (leave-one-out over the ten leaf
registers, 21 rate metrics): exceeded per record **min 1 · median 4 · max 7 of 21**; records at
ZERO **0 of 10**; max depth **median 0.52, max 1.68** (martin-narrative's dialogue share — the
sitting's own declared defining feature).

**The per-PARAGRAPH refinement says something materially different**, and SITTING §I asked for
exactly this before the walker bakes the numbers in:
```
 113 paragraphs, each scored against the band formed by the other NINE registers
   exceeded share: median 57% · p90 67%     [the chair's BUDGET is 33%, expected 17%]
   depth:          median 0.25 · p90 1.75   [the chair's DEPTH is 0.5]
   paragraphs at ZERO: 0 of 113             [consistent with the PERFECTION CEILING]
```
**REPORTED, AND NOTHING CHANGED — the chair re-rules.** Read literally, the chair's BUDGET
(one third) and DEPTH (0.5 band-widths) applied PER ENTRY would fail essentially every human
paragraph in the exemplar corpus — the unsatisfiable-ceiling error the herald refuter caught
once already. The mechanism this lane offers, as a hypothesis to test and not to trust: a rate
over a 3–10 sentence paragraph is a far noisier estimate than the same rate over a 200–600
sentence register, so scoring an ENTRY against a REGISTER-level band compares a high-variance
estimate to a low-variance band. If that is right, the cure is to re-derive the bands at the
ENTRY's own grain rather than to move the numbers. **The PERFECTION CEILING survives the
refinement unchanged and is the one of the three that the per-entry data supports directly.**

**A REFUSAL, with its measurement.** The refinement covers **3 of the 10** leaf registers.
The seven others' raw texts do not exist anywhere on this machine: the fingerprints' own
`files` arrays point into scratchpad `d5b9a39f-…`, which is gone (`find` over
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine` returns nothing for
`dnd_flavor_basic.txt`, `dnd_rules_srd.txt`, `martin_chronicle.txt`, `tolkien_plain.txt`).
The three that survive are all Le Guin. A three-register, one-author reading is not a
ten-register one and this receipt does not pretend otherwise.

**A SECOND REFUSAL, and it is a fence not a shortfall.** The real exemplar bands are NOT
copied into the repo. They are derived from the fourteen exemplar records; the repo instrument
takes bands as an ARGUMENT and the test proves the arms on a SYNTHETIC band set. The estate
has a standing hazard about exemplar-derived material in the repo, and a lane does not resolve
that by shipping. The bands are supplied by the caller; this receipt carries the measurement.

### 2.7 THE FINGERPRINT IS BYTE-PARITY WITH THE KIT'S OWN TOOL — CONFIRMED
```
$ node probe-fp-parity.mjs $K/primary/raw/leguin_fiction.txt
sentences mine=162 kit=162 | paragraphs mine=16 kit=16
PARITY: all 21 rate metrics identical
$ node probe-fp-parity.mjs $K/primary/raw/leguin_nonfiction_spoken.txt
sentences mine=351 kit=351 | paragraphs mine=72 kit=72
PARITY: all 21 rate metrics identical
```
Two texts, 42 metric comparisons, zero differences. This is the guard against the
second-spelling drift the module's own header warns about: without it the estate would be
measured on one ruler and the exemplars on another and every depth figure would be wrong.

### 2.8 THE WALK OVER THE SHIPPED CORPUS (report-only)
```
B-GRAMMAR · level 1 over 2,734 variants
  realised orders n = 180; top: V1 60.6% · GEOGRAPHY→PRESENT 4.9% · V5 2.5% · V3|V8 2.2%
  index-0 orders: V1 455 · GEOGRAPHY→PRESENT 46 · V5 24 · V3|V8 22
  untagged variants: 2,734 of 2,734
  pools 786 — uniform grammar 37.9%, uniform segments 56.9%, repeated opener 12.6%
  fails by arm: A, D, F1, F2, F3, F6, G/FEELING, G/FIGURE, G/FORECAST, G/MEANING
B-GRAMMAR GAPS · first 400 R1 variants
  opening shapes: article=183 settlement-token=103 other=37 free-relative=26 expletive=22
                  participial=17 negative=10 other-slot=2
  close kinds:    other=323 pronoun=57 abstraction=11 civicNoun=9
  tenses:         present=294 subjunctive=56 past=38 future=12
  settlement-token openers 103 · contrast shapes 65 · bare relatives 1 · appositives 4
```
The index-0 histogram is the one to read twice: **455 of the 708 canonical lines are V1**. A
default that is one order everywhere is fault 9 by the back door, and §3.2 names that risk in
its own words.

### 2.9 REFUSALS AND DECLARED LIMITS (car 2)
1. **Arm A does not gate** — measured ground in §2.4.
2. **The per-entry three numbers are reported, not applied** — §2.6.
3. **The exemplar bands stay out of the repo** — §2.6.
4. **The `grammar:` tag is DECLARED and applied to nothing.** `GRAMMAR_TAG_CONTRACT` names its
   shape, its annex form (it rides the projection's EXISTING optional second bracketed tag, so
   no new row grammar is needed), its leaf form, and the TWO files that must move with it:
   the generator's `parseTag` (or a `grammar:`-prefixed tag lands in `marks` and the
   `STATE_MARK_DIMENSIONS` contract test reds on eight new mark words) and the projection
   contract test's `--check` byte-compare. THE PROMISE holds: `variantIsAnchored` reads
   `slots`, `variantIsAudible` reads `marks`, and neither reads `grammar` — no pool length, key,
   index or eligibility moves. **The test asserts that zero shipped variants carry the tag.**
5. **Arm I is NOT-EXECUTABLE** and says so on every run: the unwritten-slot arm needs a
   rank-form manifest naming which slots a place of a given rank carries, and none is typed
   (Part B §0.1 ruling 4; chair C-6).
6. **Arm J ships as a DIRECTION with a first arm** (sentence count against licensed
   move/field units), reported as a NOTE — the spec deferred the rest and this lane does not
   invent it.
7. **V3 and V8 are reported as `V3|V8`, never picked between.** They share a move list and
   differ only in the ABSENCE CLASS (a world LACK against a record GAP), which no lexical read
   settles. A classifier that picked would be inventing a licence.

### 2.10 THE PROOFS
```
$ npx vitest run tests/lint/proseMoveGrammar.walker.test.js ; echo EXIT=$?
  Test Files  1 passed (1)
       Tests  42 passed (42)
EXIT=0
$ npx vitest run tests/lint/proseMoveGrammar.walker.test.js tests/lint/proseEntryContradiction.walker.test.js
  Test Files  2 passed (2)
       Tests  61 passed (61)
$ npx eslint src/domain/prose tests/lint/proseMoveGrammar.walker.test.js tests/fixtures/grammarControls.js ; echo EXIT=$?
EXIT=0     # after the determinism ban caught Math.log2 — see below
$ npx tsc --noEmit -p tsconfig.json 2>&1 | grep 'domain/prose'
           # (no output)
$ node scripts/check-full-typecheck.mjs
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
```
**THE ESTATE'S OWN LINT CAUGHT A REAL DEFECT IN THIS CAR.** `entropyOf` used `Math.log2`,
which ECMAScript leaves implementation-approximated; `src/domain/**` bans the transcendentals
outright because one feeding a threshold can fork same-seed worlds across devices. The figure
is report-only and feeds no seed — and the ban is fail-closed for exactly the case where
someone believes that and is wrong later. It now uses the kernel's `log2Det`.

### 2.11 What a successor continues from
Dock tip `d63f80207`, porcelain 0. Cars 3–6 remain. Car 3's loaders extend
`tests/helpers/dossierCorpus.js`; car 5's presence measure extends
`src/domain/prose/proseFingerprint.js` with three keys and re-runs the fourteen (the raw-text
absence in §2.6 bounds what that re-run can cover, and the same refusal applies).

---

## CAR 3 — THE REGISTER LOADERS (chair G; MOVE-GRAMMAR §4.1) — **LANDED** · sha `eb2c330dd` · 2026-09-07 19:44 EDT

### 3.1 What was built
Seven loaders on ONE harvester, appended to `tests/helpers/dossierCorpus.js`, plus
`tests/lint/proseRegisterLoaders.walker.test.js` (10 assertions). The registers differ in
NESTING, not in kind — every one is a frozen table whose leaves are string arrays — so a
loader per register would have been seven copies of one tree-walk. What differs per register
is the export ROSTER and it is declared per call.

### 3.2 THE CENSUS, printed against PROBE_ALL's (executed; the walker prints this every run)
```
  chronicle (R12)          rows    85 · pools   22 · distinct    81 · singleton pools   15   [R12 n=108 over 7 files; this loader reads 5]
  R4b herald disclosure    rows    50 · pools   12 · distinct    50 · singleton pools    1   [R4b n=50 over 4 files]
  R5 crier voice           rows   374 · pools   58 · distinct   374 · singleton pools    0   [R5 n=373, deduplicated SENTENCES]
  R6 npc ladder            rows  1662 · pools 1104 · distinct  1662 · singleton pools    0   [R6 n=1659; the seat's own 1,662 / 1,104]
  R7 gazetteer             rows  2254 · pools 1645 · distinct  2234 · singleton pools 1296   [R7 n=2169 over 6 files; this loader reads 5]
  D-d dm hooks             rows   278 · pools  125 · distinct   278 · singleton pools  123   [no PROBE_ALL column]
  R9 chrome copy           rows   805 · pools  196 · distinct   770 · singleton pools    -   [R9 n=619 over 6 files]
```
**TWO EXACT REPRODUCTIONS, asserted as integers:**
- **R6 = 1,662 rows in 1,104 pools.** The seat's own figures. The sitting recorded the
  disagreement with PROBE_ALL's 1,659 rather than erasing it (B.4.4: "546 + 558 = 1,104
  supports 558; the 554 is recorded, not erased"). This loader lands on the seat's numbers to
  the unit, which is independent support for 558 over 554.
- **R4b = 50.** PROBE_ALL's number exactly.

**THE DISAGREEMENTS, reported and NOT reconciled by hand** (the brief's own instruction):
| register | mine | PROBE_ALL | why they differ |
|---|---|---|---|
| R5 | 374 lines / 397 sentences | 373 | unit: PROBE_ALL counts DEDUPLICATED SENTENCES, this counts authored LINES |
| R7 | 2,254 | 2,169 | roster (5 of 6 files — the sixth exports a builder, no table) **and** predicate: this admission predicate is looser and admits fragments a sentence regex drops |
| R9 | 805 | 619 | the same looser predicate over the same registry |
| chronicle | 85 | R12 n=108 over 7 files | roster: this loader reads the FIVE files the brief named, not PROBE_ALL's seven |

### 3.3 THE FINDING R6's LOADER EXISTS TO PRODUCE
```
R6 POOL FLOOR · 1,104 pools, mean size 1.51, 546 singletons (49%)
  [Part B §10 item 9: a register whose mean pool size is under its derived floor reports
   NOT-EXECUTABLE; the derived floors are 8 / 6 / 4]
```
Half the ladder's pools hold ONE line. NL-8b's "a pool of one is not a pool" is not a
theoretical worry in R6 — it is half the register.

### 3.4 FAIL-CLOSED, AND DRIVEN (each control MUST fire; each does)
| control | command | result |
|---|---|---|
| a roster naming a vanished export | `npx vitest run tests/lint/proseRegisterLoaders.walker.test.js` | THROWS `exports no \`GONE\`` |
| a module-private array that cannot be found | same | THROWS ``no `const GREETINGS` `` |
| an empty read on any loader | same | THROWS (`refuseEmpty`) — a loader that returns `[]` turns an honest OWED into a false green |
| the admission predicate | same | admits two prose forms, refuses SCREAMING_SNAKE, a kebab slug, a two-word fragment, a number and the empty string |
| a POOL vs a POOL OF ONE | same | an array of prose becomes one pool; a lone string under an object becomes a `::single` pool, which is itself the NL-8b finding |

### 3.5 REFUSALS (car 3)
1. **`threatAssessment.js` carries NO table.** Executed: `Object.keys(module)` →
   `['buildThreatAssessment']`, a function. Its branches compose their sentences inline, so
   "the assessment branches are loaded" is NOT claimed by a loader that harvested nothing.
   Reaching them needs the builder run or its source read; neither is this car's.
2. **R16 (JSX + PDF chrome, 2,685 rows over 354 files) is NOT loaded.** It is a JSX SEGMENT
   walk — PROBE_ALL's own X4 extractor — not a pool table, and the estate already has
   `tests/helpers/jsxLiteralWalk.js`. A second, weaker extractor beside it would fork a solved
   problem. A future car that needs R16 routes through that helper.
3. **The chronicle's register label is CORRECTED to R12.** The first cut labelled
   `QUIET_FALLBACK` and the demographic table R11. PROBE_ALL's R11 is the EVENT COMPOSER /
   realm verbs (10 files); `chronicleReadModel`, `chroniclersLetter`, `demographicReading`,
   `threatAssessment` and `treatyDocument` are all R12. R11 is not loaded, and CL-11 puts the
   composer's explainer out of the wave in any case.

### 3.6 THE PROOFS
```
$ npx vitest run tests/lint/proseRegisterLoaders.walker.test.js ; echo EXIT=$?
  Test Files  1 passed (1)
       Tests  10 passed (10)
EXIT=0
$ npx vitest run tests/lint/proseRegisterLoaders.walker.test.js \
      tests/lint/proseEntryContradiction.walker.test.js tests/lint/proseMoveGrammar.walker.test.js
  Test Files  3 passed (3)
       Tests  71 passed (71)
$ npx eslint tests/helpers/dossierCorpus.js tests/lint/proseRegisterLoaders.walker.test.js ; echo EXIT=$?
EXIT=0
$ node scripts/check-full-typecheck.mjs
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
```

---

## CAR 4 — THE DERIVED INSTITUTION TABLE (CLERK-LAWS §1, §1.5) — **LANDED** · sha `37833b22e` · 2026-09-07 19:50 EDT

### 4.1 What was built
`src/domain/institutions/institutionTable.js` — a headless, derived, UNPERSISTED read-time
projection beside `institutionRoster.js` — and `tests/lint/institutionTable.walker.test.js`
(12 assertions). Eleven columns, each carrying its `closed` flag **and the BASIS it was filled
from**, so a reader argues with the column rather than with the table.

### 4.2 THE MEASUREMENT THAT CHANGED THE BUILD — and it is a spec correction
CLERK-LAWS §1.2 sources `whatItCounts` from *"the settlement's INSTANTIATED services"*. The
schema's field for that is `settlement.services` (`settlement.schema.js:273`).
**MEASURED: `settlement.services` is EMPTY on every settlement this pipeline generates** — 0
rows over 20 settlements across four tiers, and 0 institutions carrying their own `.services`.
The rows the generator actually writes land on **`availableServices`**, an object keyed by
category whose rows each name the INSTITUTION they belong to: **702 rows over twelve
settlements, 697 of them naming a live roster row, 19 of duty kind.**

A table built on the schema's declared field would have reported EVERY duty column empty and
been believed — and the Brackwater refusal would have rested on a false ground. The module
carries the measurement beside the read.

### 4.3 THE ESTATE SCAN — asserted in the test, not assumed
```
INSTITUTION TABLE · estate scan over 30 settlements (six tiers × five seeds)
  whoIsExempt non-empty on: 0
  distinct offices held:    146
  a bailiff anywhere:       false
```
- `whoIsExempt` is empty on all thirty, and every table sets `nullEverywhere: true`.
- **No bailiff among 146 distinct offices** — the Brackwater noun, re-measured at this tip
  rather than carried from the spec.
- `whoIsCounted.closed` is FALSE on every tier and holds at most ONE value, a band word.
- The scan asserts `offices.size > 50` so "no bailiff" cannot pass vacuously.

### 4.4 THE COLUMN CENSUS at 3b1c0eaa5, beside CLERK-LAWS §1.2's own table
```
  hamlet — 17 live institutions
     institution      closed=true  held=  17   Carpenter (part-time) · Hunter's lodge · …
     office           closed=false held=   8   Elder · Feudal Stewardship · Lord Mayor
     holderRole       closed=false held=   0
     whatItCounts     closed=true  held=   0
     whoIsCounted     closed=false held=   1   a hundred or so
     whoIsExempt      closed=false held=   0
     whatItDoes       closed=true  held=  18
     whatItDoesNotDo  closed=true  held=   0
     provenance       closed=true  held=   1   PRE_SEED
     sustainer        closed=false held=   0
  town  — 55 live institutions:  whatItCounts held 3  (Custom commission · Register of the
                                 dead · Tax collection);  whoIsCounted "thousands"
  city  — 42 live institutions:  whatItCounts held 1  (Customs bypass)
```
**Two rows worth the chair's eye.** A HAMLET's `whatItCounts` is EMPTY — no duty row at all —
so on a small settlement no count-duty sentence is licensed by anything. And `provenance` holds
exactly ONE value, `PRE_SEED`, on every tier sampled: a freshly generated town has no
`FOUNDED{year}` institution at all, so "founded in the year…" is refused everywhere and
"has stood since the founding" is the only licensed provenance form.

### 4.5 ONE DETECTOR NARROWED BY MEASUREMENT
`Custom enchanting` — an arcane SERVICE — entered the duty column through a bare `custom` in
`DUTY_SERVICE_KINDS`. A duty column that admits a craft service licenses a clerk's sentence
about a duty the town does not have, which is the whole fault this table exists to make
impossible. The stem was removed; `customs` and `custom commission(s)` stay. Distinct duty
rows across the estate fell from 10 to **9**: Central register · Custom commissions · Customs
bypass · Record keeping · Register of the dead · Road register · Tax collection · Tax payment ·
Toll collection.

### 4.6 THE FENCES — asserted against the module's own BYTES
| fence | how it is asserted |
|---|---|
| **no writer** | no `settlement.<field> =` assignment in the code |
| **no persistence** | no store/persist/saves/localStorage import; no `localStorage`/`indexedDB` |
| **no `exempt` field** | no `exempt:` key in the code |
| **no `bailiff` role** | the string appears nowhere in the code |
| **no product surface** | `grep -rl institutionTable src/components src/generators src/pdf` returns EMPTY — D10 is the owner's to sign. A CONTROL grep proves the grep can find something |
| **the ruin filter routed, not re-spelled** | the module imports `liveInstitutions` from `institutionRoster.js`; the estate's ruin-filter ratchet reads it as COMPLIANT rather than exempt (run: green) |

**The fence scan reads CODE-ONLY, and that cost a red to learn.** The module's own
documentation QUOTES the estate's one live typed `exempt: true|false`
(`demographicsLand.js:347/:351` — a SITE-LEGALITY flag: a user-provenance site is exempt from
the legality refusal) in order to explain why it does not belong in this column. A raw-byte
fence read that sentence as the writer it forbids. The test now routes through the estate's own
`codeOnly` blanker AND asserts the blanker is doing that work — the same two-scan asymmetry
`ruinFilterRoster.walker.test.js` records in its own header.

**This also confirms the sitting's correction (B.4.8) and its limit:** the live typed `exempt`
exists, and it is not an exemption from a duty. The column conclusion — no exemption FAMILY —
stands, now on a measurement rather than a grep of comments.

### 4.7 THE PROOFS
```
$ npx vitest run tests/lint/institutionTable.walker.test.js ; echo EXIT=$?
  Test Files  1 passed (1)
       Tests  12 passed (12)
EXIT=0
$ npx vitest run tests/lint/ruinFilterRoster.walker.test.js \
      tests/lint/institutionTable.walker.test.js tests/lint/contractTestAntiVacuity.walker.test.js
  Test Files  3 passed (3)
       Tests  39 passed (39)
$ npx eslint src/domain/institutions/institutionTable.js tests/lint/institutionTable.walker.test.js ; echo EXIT=$?
EXIT=0
$ node scripts/check-full-typecheck.mjs
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
```

### 4.8 The seam car 1 leaves open
`entryGround.estateGround({officeRoster})` still takes its roster as an argument. The
table's `office` column is now the per-settlement answer, and
`entryGround.settlementGround(table)` accepts the table directly. Wiring the corpus walk to a
per-settlement table is the WAVE's act, not this lane's: a corpus variant is not bound to a
settlement (§1.1's two scopes), so the estate ground stays the corpus-wide read.

---

## CAR 5 — THE MEASURES (report-only) — **LANDED** · sha `9d257ca7d` · 2026-09-07 19:56 EDT

### 5.1 (a) THE PRESENCE MEASURE (Part B §13.2) — `src/domain/prose/presenceMeasure.js`
Three lines over a PUBLISHED, sense-partitioned lexicon (177 nouns in five buckets, each noun
in exactly one). A proper-noun SLOT is refused as texture — `{settlement}` is a name, not a
thing seen — and a simile is a non-move and is not among the devices.
```
PRESENCE MEASURE · the estate, per register (reported, NEVER a gate)
  R1 dossier state   sensory/100w  1.198 · textured  24% · spread 0.79 bits  [sight 86% hearing 4% smell 0% touch 2% taste 8%]
  R2 causal join     sensory/100w  1.478 · textured  36% · spread 0.65 bits  [sight 88% …]
  R4b disclosure     sensory/100w  1.495 · textured  16% · spread 1.06 bits
  R5 crier voice     sensory/100w  3.437 · textured  46% · spread 1.31 bits
  R6 npc ladder      sensory/100w  1.046 · textured  21% · spread 1.52 bits
  R7 gazetteer       sensory/100w  3.358 · textured  31% · spread 1.57 bits  [taste 25%]
  chronicle R12      sensory/100w  2.276 · textured  32% · spread 0.66 bits
  D-d dm hooks       sensory/100w  0.577 · textured   8% · spread 1.49 bits
  R9 chrome copy     sensory/100w  0.663 · textured   7% · spread 0.86 bits
THE EXEMPLARS the re-run can reach (5 of 14):
  leguin-fiction             sensory/100w  1.130 · textured  56% · spread 1.80 bits
  leguin-nonfiction-spoken   sensory/100w  0.429 · textured  21% · spread 0.70 bits
  leguin-nonfiction-written  sensory/100w  0.306 · textured  16% · spread 1.53 bits
```
**THE FINDING IS NOT THE ONE THE MEASURE WAS EXPECTED TO PRODUCE.** The estate is not LESS
concrete than the exemplars it can reach — R1's 1.20 sensory nouns per hundred words sits
ABOVE leguin-fiction's 1.13 and well above leguin-nonfiction-written's 0.31. What it is, is
concrete IN ONE SENSE: R1's spread is **0.79 bits at 86% sight**, against leguin-fiction's
**1.80 bits**. Line 3 exists precisely to make that visible, and it is a different problem
from flatness — and a different cure. The textured-paragraph share tells the same story from
the other side: R1 24% against leguin-fiction's 56%.

**REFUSAL, with its measurement.** The §13.2 instruction is to add the three keys to the
fingerprint tool and RE-RUN THE FOURTEEN. Executed on **5 of 14**. Nine are NOT-EXECUTABLE:
their raw texts do not exist anywhere on this machine (§2.6's measurement — the fingerprints'
own `files` point into a scratchpad that is gone). The five that ran are all Le Guin, one
author. A five-of-fourteen, one-author band is not the fourteen and this receipt does not
present it as one.

### 5.2 (b) THE UNRENDERED-FACTS CENSUS (§912.1's condition one)
```
  generalStateProse.js     holds  34 · renders as a word  6 · KEY-ONLY  28
  powerStateProse.js       holds   7 · renders as a word  1 · KEY-ONLY   6
  economyStateProse.js     holds  12 · renders as a word  2 · KEY-ONLY  10
  defenseStateProse.js     holds   9 · renders as a word  1 · KEY-ONLY   8
  stressorsStateProse.js   holds   4 · renders as a word  1 · KEY-ONLY   3
  warFaithStateProse.js    holds   6 · renders as a word  2 · KEY-ONLY   4
  TOTAL: holds 72 · renders as a word 13 · key-only 59 (82%)
```
**A CORRECTION TO A NAIVE READING OF §912.1, stated on every row and in the print.** A
KEY-ONLY fact is NOT DARK. It chooses which authored sentence the reader meets, so it reaches
them as a CHOICE and never as a WORD. **59 is therefore an UPPER bound on the authoring
wave's opportunity, not a count of facts nobody can see.** The census also measures REACH from
source and not interest: whether a fact could license a sentence is the wave's judgment and
the owner's, and the instrument says so.

### 5.3 (c) THE LICENSED LEVEL-1 MEMBERS on the composed fill
```
  blocks 68 · settlement-ONLY bag 22 · no bag at all 15
  licensing ONE member (the bare PRESENT): 33
  licensing two or more:                   20
  NOT-EXECUTABLE on every block today: V2 (no structural-consequence field) · V3 / V8 (no
    typed none-exists or not-held field) · V6 (no typed unresolved / contested / pending
    STATE field — SITTING A12)
```
**⚠ A CORRECTION TO THE SITTING'S A12, OFFERED WITH ITS METHOD AND ITS LIST.** A12 reads
"20 of 68 settlement-only". This lane measures **22**, by resolving every composer bag from
source and asking which blocks are offered `settlement` and nothing else. The full list is
printed by the test so the chair can diff it rather than take either number on trust:
DS-CND-1 · DS-DEF-1 · DS-DEF-11 · DS-DEF-2 · DS-DEF-3 · DS-DEF-4 · DS-DEF-5 · DS-DEF-6 ·
DS-DEF-8 · DS-DEF-9 · DS-GEN-11 · DS-GEN-12 · DS-GEN-13 · DS-GEN-14 · DS-GEN-17 · DS-GEN-3 ·
DS-GEN-5 · DS-GEN-6 · DS-POP-3 · DS-REL-2 · DS-STR-1 · DS-STR-2.

**And the sharper figure beside it: 33 of 68 blocks license exactly ONE level-1 member.** At
n = 1 arm A is not-executable by construction — no grammar variation is possible on those
blocks at all without new fields. That, not the ceiling, is what bounds the wave.

---

## CAR 6 — D8's LEDGER WALKER (report-only) — **LANDED** · sha `9d257ca7d`

### 6.1 Three measurements decide the verdict
1. **THE PLANTS EXIST.** `domain/dossier/plotHooks.js` produces ~38 per town over seven
   categories, each with `text`, `source`, `role`, `category`, `priority`, `links`.
2. **NO PLANT CARRIES AN ID.** D8 says "every answerable PLANT ID has exactly one [answer]".
   There are no plant ids; `links[].id` is the NPC's. The module DERIVES a content id
   (`category:source:fnv(text)`), report-only and never persisted, so a ledger has something
   to reconcile against.
3. **NO ANSWER CHANNEL EXISTS.** No `[answer]`, no `[gap-reason]`, no `answerable` flag
   anywhere in `src` — the word appears only as ordinary English inside authored prose and
   comments.

### 6.2 The verdict, and why it REPORTS rather than fails
```
D8 PLANT LEDGER · nine settlements over three tiers
  plants enumerated:            368
  plants carrying `answerable`: 0
  open share:                   NOT MEASURABLE — no plant is marked answerable, so the share
                                is a fact about the missing class, not about a town
```
A constant open share of 1.00 is exactly the condition D8's walker is designed to fail on —
and it must NOT fail on it yet, because **D8's own clause says the walker fails on a zero or
constant open share ONLY ONCE THE CLASS EXISTS.** The arm returns NOT-EXECUTABLE naming the
three fields it wants. Both breach shapes (an answer AND a gap-reason; NEITHER) fire on a
control built to make them fire, so the arm is proved LIVE before it is parked — a parked arm
nobody proved is the false green one level up.

**⛔ THE SEEDED SHARE IS A SEED INPUT and is not implemented.** Making a share of plants open
per seed changes what an installed world renders: owner-gated under THE PROMISE, parked at
dossier item 30(e). This module measures; it plants nothing and persists nothing.

---

## CAR 7 — THE GATE REPAIR: the estate's own ratchets caught six real debts, and every one is CURED — shas `e3e56f94a` + `74a1aa0e8`

A full `npx vitest run tests/lint` after car 6 came back **11 red across five walkers, every
one of them mine**. None is baselined. The ledgers that could have absorbed them are
monotone-down by design and say so in their own words, and a lane does not raise a ceiling.

| # | ratchet | what it caught | the cure |
|---|---|---|---|
| 1 | **domain any-cast** (new files get ZERO; *fix the types, do not widen*) | 11 casts in `institutionTable.js`, 2 in `grammarWalker.js` | the types WRITTEN OUT — `TableSettlement` and `InstitutionRow` name the whole input surface the projection reads, which documents its reach better than the casts did; one CONCRETE cast to the ruling-power reader's own declared shape |
| 2 | **tuning register P3** (bare decimals, shrink-only, new files at 0) | 5 decimals in `grammarWalker.js`: 0.10 · 1.5 · 0.05 · 0.50 ×2 | every ceiling became an INPUT. `ceilingFor`, `runCeilingFor`, `armA`, `armsB` and `walkGrammar` take a `CeilingShape`; there is NO DEFAULT; a caller with no shape gets NOT-EXECUTABLE. The chair's values moved to the fixture. **The module's own header already said every number is the owner's — the register is what made it honour that.** |
| 3 | **tuning register P2** (unregistered named constants) | `FIRST_BAND_CEILING` (entryWalker), `HEAD_WINDOW` (moveGrammar) | written at their use sites with the derivation beside them; neither is a tuning value (one is `QUANTITY_BANDS`' lowest ceiling, one is a parser's reach) |
| 4 | **tuning register** (a FROZEN table's dependents moved) | `institutionTable` imported `quantityWords`, moving `HERALD_TUNING`'s dependent list — a signed-digest surface no lane refreezes — for seven strings | the band vocabulary is now the CALLER'S (`world.bandOf`). Also the better architecture: the band belongs to the Herald, and the table asks for it |
| 5 | **negative-assertion anchor** | 10 bare negatives across three of my test files | the anti-vacuity mutation control became a real `expectPresentThenAbsent` PAIR (the arm must FIRE on the shipped sentence and fall silent on the cured one); the fence tests gained two live anchors proving the blanked source is still the module; the rest carry one-line `// anchored:` markers naming the positive on the adjacent line |
| 6 | **mutation-coverage manifest** | 5 new invariant files with no coverage entry | covered the PREFERRED way — five regressions PLANTED, RUN and RESTORED |

### 7.1 THE FIVE PLANTED MUTATIONS — executed, not claimed
Each planted by `perl -0pi`, run focused, restored from a backup taken BEFORE the plant and
**`cmp`-verified byte-identical**, with the dock's porcelain re-checked after every one.
| the plant | red |
|---|---|
| the totality arm stops reading `col.closed` (`entryWalker.js`) | **6 of 19** — all four Brackwater tables and the anti-vacuity guard |
| the segment definition drifts sentence → clause (`grammarWalker.js`) | **1 of 42** — control 4's 407/708 calibration |
| a disclosure line leaves R4b (`heraldIntegrity.js`) | **1 of 10** — the exact 50 |
| the persons column closes (`institutionTable.js`) | **1 of 12** |
| a sense leaves the published lexicon (`presenceMeasure.js`) | **1 of 9** |

**TWO FIRST ATTEMPTS DID NOT RED, AND WERE REPLACED RATHER THAN RECORDED.** A slot placeholder
widened from one character to two, and a slot-stripping line removed where no lexicon noun
followed: both are edits that change no behaviour, so a green there proves nothing about the
test. Banking either as coverage would have been the exact false green this manifest exists to
forbid. All five files joined the sweep's dirty guard.

### 7.2 THE LIGHTING CENSUS, refrozen by its own ritual
Its file forbids a hand-composed figure in as many words, so it was REGENERATED — the ritual
refuses a dirty tree and exits non-zero by design:
```
files 2543 -> 2548 · parked 373 -> 375 · credited 2170 -> 2173
titles 23665 -> 23696 · suiteTitles 6335 -> 6346   (measuredAtSha e3e56f94a, tree clean)
$ npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
  Tests  34 passed (34)        # the plain green the ritual's docblock asks for
```
**`parked` rose by TWO, not five** — PLAUSIBLE, from the shapes rather than from the walker's
own report: two of the five register their `it()`s inside a `for` loop over a control roster,
which is run-control the classifier parks rather than credits. Parking reds nothing (a parked
file's titles are simply not credited to the census), and reshaping a control-driven loop into
`.each` to chase a bookkeeping credit would be changing a test's shape for a number. Recorded,
not chased.

### 7.3 THE PROOFS
```
$ npx eslint <every file this lane touched> ; echo EXIT=$?
EXIT=0
$ node scripts/check-full-typecheck.mjs
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
$ npx vitest run <the five lane walkers + tuningRegister + domainAnyCastBaseline
                  + negativeAssertionAnchor + mutationCoverageManifest>
  Test Files  9 passed (9)
       Tests  205 passed (205)
```

