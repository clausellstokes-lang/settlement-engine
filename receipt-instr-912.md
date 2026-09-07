# RECEIPT — LANE INSTR-912 (the instrument cars) — **PARTIAL**
Seat: Opus 5 — Fable-unvalidated
Lane: INSTR-912 · dock `$SC/laneINSTR` (detached at the product tip) · opened 2026-09-07 18:43 EDT (`date`)
Brief: `$SC/briefs/brief-INSTR-912.md`
Status: **PARTIAL — in progress.** Sections are appended as each car lands. A successor resumes from the dock's tip + the last landed car below.

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

