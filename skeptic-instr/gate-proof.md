# SKEPTIC PASS — LANE INSTR-912, LENS: THE GATE REPAIR, THE PROOF AND THE FENCES

Seat: Opus 5 — Fable-unvalidated (the verifier). Date 2026-09-07/08.
Dock read: `$SC/skepINSTR` @ `74a1aa0e865c260d2c890166b1b853d000631551`.
Base control: `3b1c0eaa5` (same dock, via `git show`/`git diff`).
Porcelain BEFORE: **0**. Porcelain AFTER: **0** (one plant applied and restored under the
lens's own protocol; `md5` and `cmp` verified, see §A3).
Scope: receipt sections CAR 7 / 7.1–7.3, 8, 8.1, 9, 10, 11 and the seven commits.
Every figure below comes from a command run in this session whose output I saw.

---

## HEADLINE

Nine claims tested. **Six CONFIRMED, two PARTLY, one REFUTED**, plus **two findings the
receipt does not carry at all** (one defect in car 3's R4b loader, one undeclared
whole-file re-serialization of the mutation manifest).

The car-7 gate repair is real: the five plants are genuine, the anchors exist verbatim, the
labels join one-to-one, and the one I reproduced end to end reds exactly as claimed. The
weak points are (1) §8.1's timing evidence, which does not reproduce, (2) an undeclared
5,286-line formatting churn in the manifest that will decide how §913 rebases, and (3) a
loader that silently harvests nothing from three of its declared exports.

---

## A. THE FIVE PLANTED MUTATIONS (receipt §7.1)

### A1 — anchors exist verbatim: **CONFIRMED**

The five `perl -0pi` lines were extracted from `scripts/mutation-sweep.sh` at the tip
(absolute lines 1031, 1039, 1046, 1053, 1061) and applied to COPIES of the five target
files under `$SC/skeptic-instr/plantcheck/` (files taken by `git show 74a1aa0e8:<path>`).
All five applied; every one produced **exactly one diff hunk** doing exactly what its
label says:

| # | file | the change measured |
|---|---|---|
| 74 | `src/domain/prose/entryWalker.js:607` | `} else if (!col.closed) {` → `} else if (false) {` |
| 75 | `src/domain/prose/grammarWalker.js:174` | the sentence split regex → a `[.?!;]` clause split |
| 76 | `src/domain/display/heraldIntegrity.js:59` | one `clean` disclosure line deleted |
| 77 | `src/domain/institutions/institutionTable.js:277` | `whoIsCounted.closed: false` → `true` |
| 78 | `src/domain/prose/presenceMeasure.js:54` | `smell:` bucket renamed `smellRemoved:` |

One nuance worth the chair's eye, not a defect: `} else if (!col.closed) {` occurs **twice**
in `entryWalker.js` (line 607, arm C4; line 810, arm X — the exhaustivity arm). `perl` without
`/g` replaces only the first, so plant #74 covers C4's closed-flag read and leaves arm X's
uncovered. The label says "the totality arm", which is accurate.

### A2 — label uniqueness and the manifest join: **CONFIRMED**

Measured over the tip's sweep and manifest (python):

- `check_caught` labels in the sweep: **89**, distinct **89**, zero duplicates.
- Manifest entries with `kind: "mutation"`: **79**, distinct labels **79**, zero label
  claimed by two entries.
- Each of the five new labels appears **exactly once** in the sweep text and is claimed by
  **exactly one** manifest entry.
- Join asymmetry at the tip: 1 manifest label absent from the sweep, 11 sweep labels with
  no manifest entry. **Identical at the base (1 and 11)** — pre-existing, not this lane's.

### A3 — one plant reproduced end to end: **CONFIRMED**

Gate checked immediately before each run: `HOLD-VITEST` absent; split-pattern runner count
`0`.

```
baseline   npx vitest run tests/lint/proseEntryContradiction.walker.test.js
           Tests  19 passed (19)      Duration 1.44s      porcelain 0
plant #74  perl -0pi ... src/domain/prose/entryWalker.js     porcelain 1 (1 file, 1 line)
planted    npx vitest run tests/lint/proseEntryContradiction.walker.test.js
           Tests  6 failed | 13 passed (19)
restore    cp backup -> dock;  md5 7760c480790ae5e801734e3350efdf8a (== before);
           cmp identical;  porcelain 0
```

The receipt's **"6 of 19"** is exact. Its gloss ("all four Brackwater tables and the
anti-vacuity guard") is loose by one: the six reds are tables **(a)**, **(b)**, **(d)**, the
fixture-discrimination test, and the two anti-vacuity tests. Table **(c)** stays green —
correctly, since (c) is the fixture whose persons column is CLOSED and whose expected result
is already zero quantifier fails. LOW.

---

## B. THE MANIFEST: WHAT ACTUALLY MOVED (the §913 rebase question)

**The exact answer.** Semantically, car 7 changed almost nothing:

| | base `3b1c0eaa5` | tip `74a1aa0e8` |
|---|---|---|
| `_doc` | 16 entries | identical |
| `rationales` | 41 | identical |
| `uncoveredBaseline` | 186 | 186 |
| `meta` | 12 keys | identical |
| `invariants` | 661 keys | 666 keys |

- **Added: exactly 5 keys** — `tests/lint/{institutionTable, proseEntryContradiction,
  proseMeasures, proseMoveGrammar, proseRegisterLoaders}.walker.test.js`, each
  `{"kind": "mutation", "label": …}`.
- **Removed: 0. Changed: 0.**

**The other 5,286 lines are a pure re-serialization**, in two dimensions:

1. **Indent 2 spaces → 1 space.** Every other JSON under `scripts/` (`hazard-registry.json`,
   `premortem-retro.json`, `ai-media-provenance.json`, `voice-overhaul-state.json`) is
   2-space. The manifest is now the only one that is not.
2. **`invariants` key order: insertion order → alphabetical.** Base began
   `tests/lint/customContentCharsetWiring.test.js`; the tip begins
   `tests/application/commands/commandRegistry.walker.test.js` and is fully sorted.

File length moved 2,646 → 2,666 lines (+20 = the five new four-line entries); the diff moved
5,306 lines. So ~0.4 % of the churn is content.

**None of this is declared** — the receipt's car 7 item 6 and the commit body describe only
the five added entries. And it is not a tool's doing: I found **no writer** for this file
(`grep -rln mutation-coverage-manifest` over `scripts/`, `tests/`, `src/`, `package.json`
returns readers only; `tests/lint/mutationCoverageManifest.test.js` only parses it). The three
preceding commits that touched it moved **4, 5 and 142 lines**; this one moved 5,306.

**What this means for §913** (which appends its own plant and one manifest entry to the same
two files):

- `scripts/mutation-sweep.sh` rebases cleanly — the lane appended at the end of the file, and
  §913 will too. **But the comment numbering collides:** INSTR-912 consumed `# 74` through
  `# 78`. A §913 block also numbered `# 74` must be renumbered to `# 79` or later. Sweep
  labels are the joined key and are unique (89/89), so the contract itself is safe.
- `scripts/mutation-coverage-manifest.json` **will conflict across essentially the whole
  file** if §913 was cut from `3b1c0eaa5`. Do not attempt a textual merge. Take the tip's
  file and re-insert §913's single entry in sorted position with the tip's 1-space indent —
  or, better and cheaply, have the lane that lands first normalize the file back to the house
  2-space + insertion-order form and declare it, so the estate stops carrying an
  undeclared formatting fork on a signed-surface-adjacent file.

---

## C. THE LIGHTING CENSUS REFREEZE (receipt §7.2) — **CONFIRMED**

`git diff` of `tests/lint/.lighting-census-baseline.json` moves exactly the five figures the
receipt prints, plus provenance:

```
files 2543 -> 2548 · parked 373 -> 375 · credited 2170 -> 2173
titles 23665 -> 23696 · suiteTitles 6335 -> 6346
measuredAtSha 864e76be9… -> e3e56f94a5b294a17df10e72f614236a9da9fa17   (= car 7's tip)
measuredBy "INSTR-912 (Opus 5 — Fable-unvalidated)"
```

Internally consistent: `parked +2` and `credited +3` sum to the `files +5`. The refreeze mode
writes `JSON.stringify(next, null, 2)` — 2-space — and the diff confirms the indent is
preserved, so the census baseline did NOT suffer the manifest's re-serialization.

I ran the walker read-only in the pinned dock (no `LIGHTING_CENSUS_REFREEZE` set, so no
write path): **`Tests 34 passed (34)`**, twice. Green here is the proof the frozen tuple
equals the tool's own measure at this tip. `git status --porcelain` = 0 after.

One cosmetic note: `"date": "2026-09-08"` while every commit and the receipt say 2026-09-07
EDT. Consistent with a UTC stamp at ~20:00 EDT. LOW, not a defect.

---

## D. THE ONE RED LEFT (receipt §8.1)

### D1 — `testTimeout: 20000`: **PARTLY**

The value and the line number are exact — **but the file the receipt names does not exist**:

```
$ git show 74a1aa0e8:vitest.config.js
fatal: path 'vitest.config.js' does not exist in '74a1aa0e8'
$ git show 74a1aa0e8:vite.config.js | grep -n testTimeout
904:    testTimeout: 20000,
```

It is `vite.config.js:904`, not `vitest.config.js:904`. The repo has no file matching
`*vitest*config*`. Substance holds; the citation is wrong.

### D2 — "the arm is 17.76 s in isolation … 89 % of its own ceiling": **REFUTED**

Two isolation runs in the pinned dock at the same tip, gate clean (runner count 0,
`HOLD-VITEST` absent):

```
run 1   Duration 3.80s   (tests 2.58s)   Tests 34 passed (34)   real 4.92
run 2   Duration 3.79s   (tests 3.02s)   Tests 34 passed (34)
        > DOOR 3 PARSER DOOR: a file this walker cannot parse parks WHOLE   2928ms
```

The DOOR 3 arm — the one that timed out — costs **2,928 ms**, i.e. **≈ 14.6 % of its 20,000 ms
ceiling**, not 89 %. The whole FILE is 3.8 s.

There are two errors compounded here. First, `testTimeout` is a **per-test** budget, so
comparing a whole-file duration to it is a category error; the receipt's own quoted failure
(`Test timed out in 20000ms` on one test) is per-test. Second, even the file figure does not
reproduce: 3.8 s against a claimed 17.76 s "in isolation".

**What survives.** The receipt's *conclusion* — the red is not this lane's — does survive, on
the attribution arithmetic, which I checked and which is right as arithmetic:
`5 / 2548 = 0.196 %`; `0.196 % × 21,558 ms = 42.3 ms`; `21,558 − 42 = 21,516 ms`, still over
20,000. Five new files out of 2,548 cannot plausibly be the cause of a 7× blow-out. But the
evidence the receipt offers for "pre-existing fragility" (an arm already at 89 % of ceiling)
is not reproducible: on an unloaded machine the arm has ~17 s of headroom, so the observed
21.5 s implies roughly **7× contention**, not a hair-trigger arm. The disposition stands; its
stated ground does not.

### D3 — the 0.2 % attribution arithmetic: **CONFIRMED** (see D2).

---

## E. THE SEVEN COMMITS (lens e)

`git log --format="%H %s%n%b" 3b1c0eaa5..74a1aa0e8` — seven commits, in the receipt's order,
with the receipt's shas.

- **Seat trailer: CONFIRMED.** Every one of the seven ends `Seat: Opus 5 — Fable-unvalidated`
  followed by `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Lane trailer: PARTLY.** There is no `Lane:` trailer on any commit. The lane id appears in
  each SUBJECT line (`INSTR-912 car N: …`). The brief asks for "the seat line on every file
  and receipt", which is satisfied; a lane trailer was never specified. LOW.
- **Per-car file lists: CONFIRMED.** `git show --stat` matches the receipt exactly, including
  the two line counts the receipt states: car 1 = **7 files, 2,671 insertions**; car 2 =
  **5 files, 1,944 insertions**; car 7's manifest = **5,306** lines.

---

## F. ZERO PRODUCT BYTES MOVED (lens f) — **CONFIRMED**

**Definition used.** A product byte moves if a file reachable from a shipped entry (the vite
bundle, `api/`, the edge functions, `foundry-module/`, `mcp-server/`) is added or modified, or
if any shipped string, pool, key, order or index changes.

**Measurement.** `git diff --name-status 3b1c0eaa5..9d257ca7d` (cars 1–6) lists **18 files,
all additions, zero modifications**: nine new `src/` modules, four new `tests/`
helpers/fixtures, five new `tests/lint` walkers. No pre-existing file of any kind is touched
by cars 1–6.

**Reachability of the nine new `src/` modules.** For each of
`entryGround · entryLexicons · entryWalker · grammarWalker · moveGrammar · plantLedger ·
presenceMeasure · proseFingerprint · institutionTable`, I grepped every importer across
`src api e2e foundry-module mcp-server tools supabase`. **Every reference found is one of the
nine modules referring to another of the nine** (`grammarWalker` imports `moveGrammar`,
`proseFingerprint`, `entryLexicons`, `entryWalker`; `entryWalker` imports `entryLexicons`;
`entryGround` names `institutionTable` in a comment only). Zero importers outside the island.

Corroborating fences: `src/domain/prose/` is a **new directory containing only these eight
files**; `src/domain/institutions/institutionTable.js` sits beside three pre-existing modules
and is imported by none of them; there is **no `import.meta.glob` anywhere in `src`** and no
barrel/index in either directory; nothing outside `src/domain/prose/` mentions
`domain/prose`. The island is therefore unreferenced by the graph and cannot enter the bundle
or run at the draw.

`bailiff` appears 5 times in `src` — all five inside the lane's own new files (two comments in
`institutionTable.js`, one in `entryGround.js`, one comment and one detector-list entry in
`entryLexicons.js`). Zero in the pre-existing product. The car-4 fence ("the string appears
nowhere in the code") is asserted through the estate's `codeOnly` blanker, so the two comments
are consistent with it.

Cars 7 and 7b modify only `scripts/` and a `tests/` baseline, plus the lane's own new src
files. **Zero product bytes across all seven commits.**

---

## G. RECOUNTS (receipt §9)

Four figures re-measured in the pinned dock. All reproduce:

| figure | receipt | my measurement | method |
|---|---|---|---|
| blocks with no composer bag = `UNMOUNTED_BLOCKS` | 15 of 68 | **15** unmounted, **53** mounted, union **68** | `node` import of `dossierMounts.js` — an **orthogonal** source, not the lane's resolver |
| R1 · R2 · R5 · generator entries | 2,266 · 468 · 374 · 24 = 3,132 | **identical**; R1+R2 pools **786**; R1 blocks **68**; annex rows **2,030** | the lane's loaders, run directly |
| R6 rows / pools / singletons / mean | 1,662 / 1,104 / 546 / 1.51 | **1,662 / 1,104 / 546 / 1.5054** | the lane's `loadNpcLadder` |
| R4b rows | 50 | **50** | the lane's `loadHeraldDisclosure` — but see §I2 |

Derived arithmetic in §9 and §2.2 that I checked and that is right: `ceiling(n)` at
n = 3/4/5/6/8 (0.4333, 0.35, 0.30, 0.25, 0.1875); ≤ 1.6× uniform at every n in
{3,4,5,6,8,12,20} while a fixed 0.35 gives 2.1× at n = 6; `ceiling(14) = 0.1071` and
`0.784 / 0.1071 = 7.3×`; `1104/1786 = 0.6181` against `1/14 + 0.05 = 0.1214` = `5.1×`;
`1986/200 = 9.9`; `254/3132 = 8.1 %`; `72 − 13 = 59` and `59/72 = 82 %`;
`33 + 20 + 15 = 68`; `20/24 = 0.83`, `18/24 = 0.75`, `22/24 = 0.92`; manifest mutation
entries `74 → 79 = +5`.

---

## H. THE REFUSALS (receipt §10) — audit

I read `CLERK-LAWS.md` §2.3–§2.6 and §5 against the twenty-four.

**Legitimate (20 of 24).** Refusals 1–2, 4–22 are refusals of the right kind: each names the
measurement that grounds it, and each is a case where the spec's figure or wording is a
hypothesis the code contradicts. Two I re-measured directly:

- **#16** (`settlement.services` empty; the duty column reads `availableServices`). The
  schema field is real and is where the receipt says it is: `settlement.schema.js:273` reads
  `@property {Service[]} [services]`. **CONFIRMED.**
- **#5** (the annex pool-grammar mis-address). Annex line **5233** is the "the same trades
  exempt" row; the nearest preceding bold pool header is **`occupation_legacy`** (line 5230)
  and the one before it is **`magical_controversy`** (5223). The naive one-regex reading
  would indeed have keyed :5233 to `magical_controversy`. **CONFIRMED, precisely.**

**Declared deviations (3).** #1 (fixture (b)'s "ONLY" refused — the spec's own C1 arm makes
the figure fail, so §2.4's "ONLY" was internally inconsistent), #3 (C5's office and status
limbs downgraded to WITHHELD — §2.3 requires every class to carry a FAILing limb, and C5
keeps its band FAIL, so the law is honoured while the scope narrows), and #23 (two plants
replaced rather than banked). All three are declared with measurement and all three are the
right call.

**An undeclared GAP (1) — see §I1.**

**#24** (the timeout is not cured by raising an estate-wide config ceiling) is a correct
refusal; its supporting arithmetic is the one refuted in §D2.

---

## I. TWO FINDINGS THE RECEIPT DOES NOT CARRY

### I1 — the anti-vacuity guard covers a different four than CLERK-LAWS §2.4 names

`CLERK-LAWS` §2.4's anti-vacuity guard names four anchors the walker must red on:
`RECEIPT_POOLS_DOSSIER_STATE.md:5233` (C2), **`:2247` (C3-lexical)**, `newsVoice.js:97`
(C4 totality), and **the gendered R6 lines (C3 arm a)**.

The sitting's amendment table (`CLERK-LAWS` §5) revises **§1.3's** "two LIVE BREACHES" to
four — `newsVoice.js:97`, `:5233` + its leaf twin, `factionDynamics.js:466`. It amends §2.4
only on the **fixtures** ("a FOURTH is owed"). §2.4's guard list is not amended.

The lane built its guard on the §1.3 four. So two spec-named guard anchors are absent:
`:2247` and the shipped gendered R6 lines. The gender arm is exercised only by a synthetic
two-bearer FIXTURE (NL-4), and R6 had no loader until car 3, after car 1's corpus walk. This
is consistent with the receipt's own class census, which reports **zero C3 findings of any
kind** over 3,132 entries (128 C4-future, 114 D, 13 C4-totality, 3 C2-exemption, 3 C2-office).

The guard is not vacuous — I proved four live breaches red by planting #74 — but two of the
spec's four named anchors are unasserted and the difference appears nowhere among the
twenty-four refusals. **MEDIUM: an undeclared gap in the one guard whose job is to stop the
instrument passing vacuously.**

### I2 — car 3's R4b loader silently harvests nothing from three declared exports

`loadHeraldDisclosure()` declares a roster of three exports from `causeWalk.js`:
`NO_DEEPER_MEMORY`, `LEDGER_DARK_LINE`, `REDACTED_HOP`. Measured:

```
$ node  (the loader, run directly)
R4b rows: 50
{ 'src/domain/display/heraldIntegrity.js': 18,
  'src/domain/display/causeLifecycleVocabulary.js': 32 }
any row from causeWalk.js: false
```

All three are **bare strings**, and `harvestExports`'s `walk` returns early on a non-object
node (`if (!node || typeof node !== 'object') return;`). Applying the loader's own published
`isProse` predicate to the raw leaves gives **53 admitted, 0 refused** — so three admissible
prose lines are dropped, not filtered.

`refuseEmpty` is checked at the REGISTER level, and the other two files supply 50 rows, so
nothing complains. This is exactly the false-green shape §3.4 claims to have driven ("a loader
that returns `[]` turns an honest OWED into a false green") — one level down, at the export
rather than the register.

It also touches a headline claim: **"R4b = 50, PROBE_ALL's number to the unit"** is one of the
lane's "TWO EXACT REPRODUCTIONS, asserted as integers". The 50 is `53 − 3`, and the 3 are lost
to a silent drop rather than to a declared predicate. Whether PROBE_ALL excludes the same
three is not established by anything in the receipt.

I scanned every loader roster in `dossierCorpus.js` for the same shape: **R4b is the only one
affected** — no other declared export is a bare string or missing.

**MEDIUM.** No product byte, no PROMISE surface; but an integer assertion presented as
independent validation rests on an undetected under-read, and the cure is three lines in
`harvestExports` (treat a bare-string export as a pool of one, which the object branch already
does).

---

## J. FENCES OBSERVED

Read-only on `laneB6` and the main tree (I read neither for a code fact; every code fact came
from `skepINSTR` at `74a1aa0e8`). Never entered `laneLMAT` or `laneINSTR`. No build, no
`npm install`, no whole-suite run, no `--write`/`--update`. Three focused vitest invocations,
one at a time, each preceded by the split-pattern gate (`0`) and the `HOLD-VITEST` check
(absent). One plant applied to the dock and restored per the lens's protocol; `md5` and `cmp`
verified identical; **porcelain 0 before and after**. All my own files are under
`$SC/skeptic-instr/`.
