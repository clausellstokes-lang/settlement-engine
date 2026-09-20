# COMPILE-TOOL-13a — the schema-23 rung, compiled: FOUR OF ITS SEVEN MEMBERS CANNOT BE MINTED, and the door the chair was told to use is the door that refuses them

**Lane:** COMPILE-TOOL-13a, Opus COMPILE, read-only. **Chair:** Fable 5.1, session a9df403c.
**Stamps (from `date`, in the same call as every run):** 2026-09-20 12:39 → 12:53 EDT.
**Read tip:** `$SP/read-tip-tool13a`, detached at `578272a99e93425f33a3578affc7a62cad66c937` (the seventh refreeze; TOOL-13b's erasure guard composed at `d279d13eb`, confirmed an ancestor). `git status --short` → **0 lines at start and at end** (CONFIRMED). Nothing under `src/`, `tests/` or `scripts/` was written. All apparatus in `$SP/lane-tool-13a-scratch/`. No gated run, no `--write`, no `git` mutation.

**Standing hashes — identical at start and end (CONFIRMED):**
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
dbd67ac549c081eaff0e937c448a2f53a763b2cf5a4a329a1aa5f7d6fa21441e  scripts/.observed-shape-readers-baseline.json   ← THE FROZEN INVENTORY
16aa3a58eb76a07aa2b0b84750478c3fcf0e1cc95588441d4cc9900b307ffda1  scripts/.writer-reach-baseline.json            ← see §6
ce516004a5d8e680f4160b03ce660c66d78261988b78a82239664c596600af4b  docs/implementation/preambles/EM-PREAMBLE.md   (MEASURED, never quoted)
```

---

## 0. THE VERDICT, FIRST

**The rung as briefed is not mintable, and the reason is not a lane's opinion — it is an executed refusal against every member's exact bytes.**

1. ⛔ **Four of the seven briefed members edit `scripts/lib/legacy-reader-shape-scan.mjs`** — the root widening (member 1), P1a (member 3), M3 the header correction (member 4), and the `minRows` default (member 5). That file is byte-frozen by `assertGovernedLegacyDetectorSource`, which **reconstructs a HISTORICAL GIT BLOB** (`0310fa9f…`, which I confirmed is `scripts/lib/reader-shape-scan.mjs` at commit `6e7acc4d`) and admits **exactly one** pre-declared delta. I compiled all four members as real files and ran the predicate on each: **all four REFUSED, the untouched control ACCEPTED.** (CONFIRMED, §1)
2. ⛔ **The migration-bundle door does not relax that freeze — it re-asserts it.** `validateMigrationReceipt` (`observed-shape-baseline.mjs:529` and `:1028`, both copies) calls `governedLegacyAlgorithmOf(baseline.manifests.detectorTree)` → `governedLegacyDetectorSha256()` → the same disk read and the same predicate, and it pins `receipt.legacyAlgorithmBaseSha === LEGACY_ALGORITHM_BASE_SHA`. The bundle is validated at `check-observed-shape-readers.mjs:3015`, **before** the schema admission that lets a rung move the other scanner files. So the door the STOP note nominated is the door that refuses these four. (CONFIRMED by source trace, §1.3; the executed half is TOOL-13b's PROBE-B stack, reproduced here on the compiled bytes)
3. ⭐ **Two members ARE mintable and I compile them as a real rung:** **M1** (the denominator field) and **M2** (the M12 docblock), both in `check-observed-shape-readers.mjs`, which a schema bump *does* move — proven by the schema-22 precedent, whose rung `51d59d00b` changed that exact file by 73 lines. Plus **the `scanStats` re-freeze**, which is that rung's write. (§3)
4. ⚠ **NEW INFORMATION neither predecessor found: the widening RAISES A CEILING.** `src/components/map/WorldPulseData.js / institutionName on proposalPayload` goes **1 → 2**. TOOL-13 §6.6 recorded "Existing rows never *grew*"; at this tip, under the root arm, one does. A raised ceiling is a harder refusal than an erasure — `predecessorIncreased` is one of the two figures the migration report **raises an issue for**, and **no rung in this register's twenty-two-rung history has ever reported it non-zero**. (CONFIRMED, §4.2)
5. ⭐ **The thirteen erased rows are re-triaged BY EXACT SOURCE ADDRESS, not by name**, and the sharper answer holds TOOL-13b's verdict while removing its remaining doubt: **0 re-attributed, 0 mixed, 13 LOST**, across 97 dropped raw addresses. (CONFIRMED, §4.1)
6. **`minRows`: RECOMMEND EXCLUDE**, and not only because it is refused — **it is measured behaviour-neutral.** Every `scanReaders` call site in the estate passes `minRows` explicitly; the `= 8` default has **zero** consumers. (CONFIRMED, §5)

**What I recommend the chair do** is in §7: mint a two-member schema-23 rung that is expressible today, and put the detector re-governing in front of the owner as its own act rather than smuggling it into a bundle that cannot carry it.

---

## 1. THE REFUSAL, PROVEN MEMBER BY MEMBER

### 1.1 The instrument

`$S/govern-probe.mjs` reads the tip's detector source, constructs each member's **exact** edited text in memory, and calls `assertGovernedLegacyDetectorSource`. `$S/diffs/make-diffs.mjs` then writes each member as a real file under `$S/diffs/`, and the predicate is re-run on **those bytes** — so the verdict is about the compiled member, not about a synthetic probe.

### 1.2 The result (CONFIRMED — `$S/govern-probe.out.txt`, and re-run on the compiled files)

```
CONTROL (untouched detector): ACCEPTED, sha256=79c08bb74c31bcffd75407822536ec509cad746898bd5fbe067481b273547bed

  control ACCEPTED  sha256=79c08bb74c31bcff…
  W    REFUSED   legacy observed-shape detector does not reconstruct governed Git blob 0310fa9fdda873c1b382cf18c3936707e8e4addf
  M3   REFUSED   legacy observed-shape detector does not reconstruct governed Git blob 0310fa9fdda873c1b382cf18c3936707e8e4addf
  MR   REFUSED   legacy observed-shape detector does not reconstruct governed Git blob 0310fa9fdda873c1b382cf18c3936707e8e4addf
  P1a  REFUSED   legacy observed-shape detector does not reconstruct governed Git blob 0310fa9fdda873c1b382cf18c3936707e8e4addf
```

The null control — one comment byte — is refused identically (`BYTE`, +20 bytes), which reproduces TOOL-13b's PROBE-B at this tip. **The control accepting is what makes the four refusals mean something**: this is not a predicate that refuses everything.

| member | file | bytes | verdict |
|---|---|---|---|
| **W** the root widening | `legacy-reader-shape-scan.mjs` | **+450** | ⛔ REFUSED |
| **M3** the header correction (prose only) | `legacy-reader-shape-scan.mjs` | **+536** | ⛔ REFUSED |
| **MR** the `minRows` default (ONE character) | `legacy-reader-shape-scan.mjs` | **+1** | ⛔ REFUSED |
| **P1a** destructuring bindings | `legacy-reader-shape-scan.mjs` | **+1,452** | ⛔ REFUSED |
| **M1** the denominator field | `check-observed-shape-readers.mjs` | (§3.1) | ✅ mintable under a schema bump |
| **M2** the M12 docblock | `check-observed-shape-readers.mjs` | **+1,531** | ✅ mintable under a schema bump |

All five compiled member files pass `node --check` (CONFIRMED).

⭐ **AND THE COMPILED FILES ARE THE MEASURED BEHAVIOUR, not a re-description of the prototype.** The arms in §2.3 were priced with TOOL-13's env-gated `proto-detector.mjs`; a bundle member is a plain edited file. I ran the **compiled member files themselves** through the same harness, and they reproduce their arms on every figure (CONFIRMED):

```
[compiled-W]    5816 ms  files=2235 reads=128269 resolved=12370 (9.644%)
[compiled-W]    RAW findings=2124; rows live=1491 frozen=1390; ERASED=13 SHRUNK=0; NEW rows=114 (190 reads); GROWN rows=1
[compiled-P1a]  5868 ms  files=2235 reads=128269 resolved=9989 (7.788%)
[compiled-P1a]  RAW findings=2121; rows live=1468 frozen=1390; ERASED=0 SHRUNK=0; NEW rows=78 (157 reads); GROWN rows=0
```

So the chair is handed bytes whose price is executed, not inferred — and the refusal in the table above is a refusal of **those** bytes.

### 1.3 ⛔ WHY THE MIGRATION DOOR IS NOT THE ANSWER — the trace

The brief's premise is that the migration-bundle door carries a detector change. It does not. Three findings, all read at the tip:

- **The freeze is schema-independent.** `assertGovernedLegacyDetectorSource` (`observed-shape-governance.mjs:112–130`) takes the source, substitutes the one admitted enrichment back to `LEGACY_ORIGINAL_EMISSION`, computes the Git blob SHA-1 and compares it to a **hardcoded constant**. Nothing in it reads the baseline, the schema, or a bundle. A schema bump cannot reach it.
- **The door validates it before anything else.** `run()` reads the bundle and calls `runtime.validateMigrationBundle(bundle)` at `:3015`. That path reaches `validateMigrationReceipt`, which calls `governedLegacyAlgorithmOf(baseline.manifests.detectorTree)` → `governedLegacyDetectorSha256()` → `readFileSync(LEGACY_DETECTOR_FILE)` → the predicate. It also pins `receipt.legacyAlgorithmBaseSha !== LEGACY_ALGORITHM_BASE_SHA → 'names an ungoverned legacy algorithm'`.
- **The anchor is HISTORICAL, so it cannot simply be recomputed.** `git cat-file -t 0310fa9f…` → `blob`, 25,836 bytes; `git rev-parse 6e7acc4d…:scripts/lib/reader-shape-scan.mjs` → **`0310fa9f…`**. The constant is not a self-consistent checksum a rung may re-derive; it is the claim *"this file IS the historical detector from commit `6e7acc4d`, verbatim, plus one declared enrichment."* Re-pointing it at a freshly computed blob would keep the code green and make `LEGACY_ALGORITHM_BASE_SHA` a lie. (CONFIRMED)
- **And the file has never moved.** `git log --oneline -- scripts/lib/legacy-reader-shape-scan.mjs` → **one commit**, `0ea7ff1206 govern observed-shape scanner migration`. `git diff --stat 0ea7ff1206 HEAD --` on it → empty. **Twenty-two rungs have landed without one byte of it changing**, and the schema-22 rung says so in its own voice: *"the byte-frozen legacy detector is untouched."* (CONFIRMED)

**What re-governing would actually cost** (compiled, not built): `LEGACY_ALGORITHM_BASE_SHA` and `LEGACY_ALGORITHM_BLOB_SHA` in `observed-shape-governance.mjs`; the same two literals in `tests/lint/legacyReaderShapeScan.test.js:16`, `tests/lint/observedShapeMigration.test.js:74`, `tests/lint/observedShapeSentinel.test.js:1856`; and the meaning of the freeze itself, which stops being *"the historical detector"* and becomes *"whatever the last rung wrote."* ⛔ **That is a change of governance posture over a mechanism the estate built deliberately, and it is the OWNER'S, not the chair's.** It is reported here as a proposal and nothing more.

---

## 2. THE FIGURES, RE-EXECUTED AT THIS TIP

Every number below was measured at `578272a99`. **No figure is carried from TOOL-13 (`141a1d775`) or TOOL-13b (`c33446830`)**; where they differ I say why.

### 2.1 The live gate (CONFIRMED — `$S/osr-report.txt`, EXIT=0, stderr 0 lines, 40 s)

```
1964 finding(s); scan reached 9782/128269 reads across 2235 files
scan scope: the WHOLE scanned tree (no declared exclusion).
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
CR-OSR-SCHEMA-6 M12 language-surface filter (toLocaleString): cleared 0 read(s) across 0 identit(ies)…
```

**9,782 / 128,269 across 2,235 files = 7.626 %.**

### 2.2 The corpus and the dark root prior (CONFIRMED — `$S/corpus.json`, built once, 23,469 ms)

`shapes=1299 arrayShapes=117 singleHome=1031 rootShapes=6 files=2235`

| walk root | rows | keys | in `known` (`rows >= 40`)? |
|---|---|---|---|
| `campaign` | **1** | 6 | ⛔ no |
| `pulseResult` | **12** | 17 | ⛔ no |
| `save` | 208 | 5 | ✅ yes |
| `settlement` | 420 | 46 | ✅ yes |
| `wizardNews` | **13** | 4 | ⛔ no |
| `worldState` | **25** | 28 | ⛔ no |

`known` = **337 of 1,299**. Roots that bind: **2 of 6**. The defect reproduces exactly.

⚠ **A CORRECTION TO THE BRIEF, AND IT SHARPENS M3.** The launch message says "the six roots **the header names**". **The header names four, not six.** Verbatim at `:309–316`:

> `// follow whose identifier IS one of the corpus walk's ROOTS (`settlement`,`
> `// `worldState`, `save`, `campaign`). Deliberately EXACT and deliberately`

`pulseResult` and `wizardNews` appear nowhere in it. So the header is wrong **twice**: it names four of six roots, and of those four only two bind. M3's compiled text (`$S/diffs/member-M3.diff`) states both, and states the mechanism.

### 2.3 The priced arms (CONFIRMED — `$S/arm-*.json`, one process per arm)

| arm | wall-clock | resolved | rate | RAW findings | live rows | **ERASED** | SHRUNK | NEW rows (reads) | **GROWN** |
|---|---|---|---|---|---|---|---|---|---|
| **shipped** (the real detector) | 8,602 ms | 9,782 | 7.626 % | 2,105 | 1,459 | **0** | 0 | 69 (141) | **0** |
| **control-copy** (the scratch copy, no arm) | 7,664 ms | 9,782 | 7.626 % | 2,105 | 1,459 | 0 | 0 | 69 (141) | 0 |
| **W** — six roots | 7,235 ms | **12,370** | **9.644 %** | 2,124 | 1,491 | **13** | 0 | 114 (190) | **1** |
| **P1a** — destructuring | 9,602 ms | 9,989 | 7.788 % | 2,121 | 1,468 | **0** | 0 | 78 (157) | 0 |
| **W + P1a** | 8,645 ms | 12,577 | 9.805 % | 2,140 | 1,500 | 13 | 0 | 123 (206) | 1 |
| **minRows = 8** | 7,298 ms | 14,206 | 11.075 % | 3,802 | 2,536 | **15** | 0 | **1,161 (1,870)** | 1 |
| **minRows = 8 + W** | 6,747 ms | 14,992 | 11.688 % | 3,826 | 2,552 | 15 | 0 | 1,177 (1,894) | 1 |

⭐ **FAITHFULNESS: CONFIRMED.** `shipped` and `control-copy` agree on every figure, so every delta is measured against a copy that is provably the shipped instrument. Frozen rows = 1,390 throughout.

**Reconciliation with the predecessors** — the arms reproduce, and the drift is the composition:

| figure | TOOL-13 (`141a1d775`) | TOOL-13b (`c33446830`) | **this tip (`578272a99`)** |
|---|---|---|---|
| files | 2,231 | 2,232 | **2,235** |
| reads | 128,203 | 128,225 | **128,269** |
| resolved (shipped) | 9,780 | 9,780 | **9,782** |
| resolved (six roots) | 12,368 | 12,368 | **12,370** |
| RAW findings (shipped) | 2,105 | 2,105 | **2,105** |
| erased under W | 13 | 13 | **13** |

⚠ **No arm costs measurable wall-clock** — 6.7–9.6 s across every configuration, and the ordering of the timings does not track the arms (the widest arm is the fastest run). **The variance is cache warmth, not the arms; the cost of this rung is triage, never compute.** (CONFIRMED, and it reproduces TOOL-13's §6.2 conclusion at a different tip.)

---

## 3. THE MINTABLE RUNG — the two members a schema-23 bump CAN carry

The precedent is `51d59d00b` (the schema-22 rung) + `6304ba83a` (its re-freeze), read whole. The rung's seven files were `check-observed-shape-readers.mjs`, `lib/observed-shape-baseline.mjs`, `migrate-observed-shape-readers.mjs` and four `tests/lint/` files; the re-freeze was **one** file, the baseline JSON. **`check-observed-shape-readers.mjs` moved by 73 lines in that rung**, which is the executed precedent that M1 and M2 are expressible. The drift branch does not fire during a bump, because it is guarded by `baseline?.schema === BASELINE_SCHEMA` (`:3044`) and a bump makes that false.

### 3.1 M1 — the denominator field

**Home:** `check-observed-shape-readers.mjs`, the `--report` block at `:3333–3345`; the line to extend is `:3339`.

⛔ **The pin M1 must not break, restated because it decides the spelling.** `assertHealthyScanProvenance` (`observed-shape-governance.mjs:456–459`) throws unless `stats.reads === stats.resolved + stats.unresolved`. **So `stats.reads` may never be narrowed.** M1 is an **additional printed derivation** over the detector's own findings and corpus, computed in the `--report` branch and written into no artifact — it therefore moves no digest and forces no re-freeze of its own.

**The figures, RE-MEASURED at this tip** (`$S/anatomy2.json`, `$S/anatomy2.out.txt` — CONFIRMED; TOOL-13's were taken where `src/` differs by 17+ files):

| measure | value at `578272a99` |
|---|---|
| reads | **128,269** |
| resolved | **9,782 — 7.63 %** |
| rooted at a host/runtime global | **20,131** (15.7 %); 20,095 unresolved |
| receiver with no identifier root at all | 866 |
| key present in the corpus vocabulary (1,492 keys) | **51,106** |
| resolved among those | **8,564 — 16.76 %** |
| rate excluding host-global-rooted reads | **9.05 %** |
| `src/domain/` | 5,744 / 72,358 — **7.94 %** |
| `src/components/` | 1,354 / 26,131 — **5.18 %** |
| everything else | 2,684 / 29,780 — **9.01 %** |
| breakpoint tokens `.sm/.xs/.md/.xxs` | 1,808 + 1,481 + 733 + 697 = **4,719** |
| `.freeze` / `.isArray` / `.isFinite` | **7,489** / **3,709** / **1,400** |
| "reads that matter" | **38,850** — ⚠ **A CEILING**, 22,465 of them under `src/domain/` |

⚠ **The ceiling caveat travels with the number, in the printed line.** `Float32Array.from` and `CONTROL_CHARACTERS.test` score as "mattering" because `from` and `test` are usable-shape keys; separating them needs exactly the resolution the instrument lacks. **Print it as an upper bound or do not print it.**

⛔ **One figure I did NOT re-measure:** the uninitialised-`let` split (TOOL-13 measured 265 at its tip). Its instrument is `$SP/lane-tool-13-scratch/deep.mjs` (read-only; copy it). If M1 prints that split, **the chair must re-run that instrument at the mint tip** — a figure quoted from TOOL-13 is stale by the 09-20 law. (PLAUSIBLE that it has barely moved; not measured, and not to be asserted.)

**Price: 0 findings minted, 0 rows erased, 0 digests moved — by construction.**

### 3.2 M2 — the M12 docblock correction

**Home:** `check-observed-shape-readers.mjs:777–803`. **Exact bytes: `$S/diffs/member-M2.diff`, +1,531 bytes, prose only.**

The stale sentence, verbatim at the tip:

> `* HEAD: `popFirst.toLocaleString()` and `popLast.toLocaleString()` on population`
> `* NUMBERS drawn out of a history array, reported as reads of a key the history`
> `* container never writes. 2 reads, 1 identity, 1 file, and a pure artefact.`

DA-B2 cured that population. The block still asserts it as live, and the `--report` line beside it says `cleared 0` — which is precisely how TOOL-13 reached "dead machinery: retire, or grow its roster" (§8.4), **and both options are wrong**. TOOL-13b measured the real answer (receipt §2): 0 raw findings of 2,105; 22 reads across 21 files, **every receiver unresolved**; not in `BUILTIN_MEMBERS`; M11 clears 0; still capable on a seeded fixture (clears 1, `toType` clears 0); and the walker pins `cleared === 0` EXACTLY as a re-emergence watch. My compiled text records all of it, states **KEPT**, and names the fail-closed pair that bounds the roster.

**Price: 0 findings minted, 0 rows erased. Prose only.**

### 3.3 The `scanStats` re-freeze — the rung's write

Frozen vs live at this tip (CONFIRMED):

```
frozen   scanStats: {"files":2228,"reads":128176,"resolved":9766,"unresolved":118410}
         sentinel:  {"resolvedReads":9766,"totalKeys":6537,"usableShapes":337}
live                 files 2235   reads 128269   resolved 9782   unresolved 118487
```

**Drift: +7 files / +93 reads / +16 resolved** since the schema-22 freeze — grown again since TOOL-13b measured `2232/128225/9780`. Not a gate failure: the sentinel is a **90 % floor only** (`sentinelFailures`, `['resolvedReads', 0.9]`), so it reds on collapse and never on growth. **The rung's `--write` IS the next re-freeze, so this self-corrects there** — and it needs one line in the re-freeze note so nobody reads the delta as a defect. This discharges TOOL-13 §8.6 and TOOL-13b §4.5.

---

## 4. THE THIRTEEN, AND THE FOURTEENTH THING NOBODY COUNTED

### 4.1 ⭐ THE TRIAGE, SHARPENED: joined BY EXACT SOURCE ADDRESS

TOOL-13b named the thirteen and classified each as "the read is still written → instrument erosion" using a **textual** probe. That is right but it leaves one question open: *did the read move to another identity, or is it gone?* A re-attributed row is not a loss — the debt survives under another name — and it would need no carry. So I joined the base and widened scans on the detector's own exact address (`file#pos`), which is not a name-matching guess (`$S/reattribute.mjs` → `$S/reattribution.json`):

```
BASE raw findings=2105  WIDE raw findings=2124
addresses the WIDE run RE-ATTRIBUTED to another shape: 0
addresses the WIDE run DROPPED entirely: 97

SUMMARY: 0 RE-ATTRIBUTED, 0 MIXED, 13 LOST, of 13
```

**All thirteen are pure suppression at their exact source positions.** TOOL-13b's verdict stands and is now address-exact.

| file | identities erased | n | reads still written? | **disposition** |
|---|---|---|---|---|
| `src/components/map/WorldPulseData.js` | `institutionName`, `outcome`, `settlementIds` **on stressors** | 3 | yes (`:88`, `:43/:62/:76`, `:49`) | **KEEP — explicit carry** |
| `src/components/map/heraldFeed.js` | `covert`, `impactKind`, `outcome`, `significance` **on stressors** | 4 | yes (`:94`, `:120`, `:92/:100/:112`, `:115`) | **KEEP — explicit carry** |
| `src/domain/display/chronicleGraph.js` | `applyMode`, `proposalPayload` **on raw** | 2 | yes (both `:280`) | **KEEP — explicit carry** |
| `src/domain/realm/heraldRouting.js` | `impactKind`, `outcome`, `section`, `sectionAuthority` **on stressors** | 4 | yes (`:556`, `:550`, `:632`, `:633–641`) | **KEEP — explicit carry** |

**The disposition I recommend for all thirteen is KEPT BY EXPLICIT CARRY, not RELEASED.** The reason is measured, not aesthetic: every one of them still has its read written in source, so none is a repair; releasing them would bank a loss the ratchet was built to prevent, and it would do so under a **STALE ROW** red that reads like a successful fix. ⚠ If the chair cannot express a carry through the migration ledger, **that is itself the STOP** — not a reason to absorb them.

⚠ **`assertClassADebtPreserved` would not have caught one.** 0 of 13 are class-(a) (CONFIRMED — the probe joined the erasures against `CLASS_A_PROTECTED_IDENTITIES`, 20 entries). But the neighbourhood is exactly as close as TOOL-13b warned:

```
shapes carrying an erasure: raw, stressors
⚠ class-(a) on an ERASING shape: __adjudicationPending on stressors
⚠ class-(a) on an ERASING shape: __forecast on stressors
⚠ class-(a) on an ERASING shape: __resolution on stressors
⚠ class-(a) on an ERASING shape: decreed on stressors
```

**Eleven of thirteen erasures and four protected rows share one shape.** The widening did not take a protected row; it took eleven of its neighbours. TOOL-13b §4.3's re-cut of TOOL-13 §8.2 is right: the guard must be the row-survival arm that landed at `d279d13eb`, never a widened class-(a) check.

### 4.2 ⚠ THE GROWN ROW — new, and it is the harder refusal

```
[W-roots] GROWN rows: 1
   src/components/map/WorldPulseData.js / institutionName on proposalPayload
      frozen ceiling 1 -> live 2  (+1)
      · src/components/map/WorldPulseData.js:88 `payload.institutionName`
      · src/components/map/WorldPulseData.js:124 `payload.institutionName`
```

Both sites are the same spelling; under the shipped detector only one resolves, under the widening both do. It is **genuine new resolution, not a re-attribution** (the address join found zero moves). Two things follow:

- **A raised ceiling is refused by the shrink-only `--write` outright**, and it is one of the two figures the migration report **raises an issue for**: *"The report raises issues for `new` and `increased` only; `gone` is a lawful shrink and needs no discharge"* (`migrate-observed-shape-readers.mjs:106–110`).
- **No rung has ever done it.** The schema-22 chain reported `{predecessorDecreased: 0, predecessorGone: 4, predecessorIncreased: 0, predecessorNew: 2, predecessorSame: 1388}`, and I found no committed re-freeze reporting `predecessorIncreased` non-zero. **The widening would be the first rung in the register's history to raise a ceiling.** (CONFIRMED for `6304ba83a`; PLAUSIBLE-complete for the rest — I read the committed figures, not every bundle.)

⚠ **A measurement caveat I state rather than bury:** my ERASED/GROWN/NEW figures compare **RAW detector rows** against the **post-filter** frozen inventory — the convention TOOL-13, TOOL-13b and the walker's own guard all use (`live.raw.findings`). The post-filter reconciliation the migration report would compute is therefore **lower** and is **NOT MEASURED** here. The instrument that would measure it exactly is `run()`'s `runtime.scanLegacyReaders` override (`check-observed-shape-readers.mjs:2954`), which lets an armed copy be driven through the real M6/M11/M12/M8-M9 chain. **If the widening is ever chartered, that measurement is the first act, before any bundle.** (PLAUSIBLE that `predecessorNew` lands well under the raw 114; not measured.)

---

## 5. `minRows` — MEASURED, AND THE RECOMMENDATION IS **EXCLUDE**

The candidate is `scanReaders`'s `minRows = 8` default (`:532`) against the gate's `MIN_ROWS = 40` (`observed-shape-baseline.mjs:342`). TOOL-13b §4.4 offered it "beside M3, so it costs no extra rung" while warning it is BEHAVIOUR.

**What the default is worth if anyone ever takes it** (CONFIRMED, §2.3): resolution 7.626 % → **11.075 %**, raw findings 2,105 → **3,802**, **1,161 unbanked new rows**, **15 erased**, 1 grown. A caller who forgets the argument silently gets a different instrument, and one that erases two rows more than the widening does.

**But the population of such callers is ZERO, and that is measured, not assumed.** Every call site in the estate passes it explicitly:

| call site | passes |
|---|---|
| `scripts/check-observed-shape-readers.mjs:3133` (the gate) | `minRows: MIN_ROWS` |
| `scripts/lib/writer-reach-scan.mjs:356–358` | its own `minRows = MIN_ROWS` default, forwarded to `makeResolver` |
| `scripts/check-writer-reach.mjs:252` | `minRows: MIN_ROWS` |
| `tests/lint/observedShapeReaders.walker.test.js:332` | `minRows: MIN_ROWS` |
| `tests/lint/writerReach.walker.test.js:151` | `minRows: MIN_ROWS` |
| `tests/lint/legacyReaderShapeScan.test.js:61` | `minRows: 8`, **explicitly**, against a 16-row fixture |

`makeResolver` has **no** default at all — `minRows` is positional and required (`:257`).

**RECOMMEND: EXCLUDE from the rung.** Three reasons, in order of force: it is **refused** by the byte-freeze like every other detector edit (+1 byte is refused exactly as +1,452 is); it is **behaviour-neutral today**, so it buys no measured safety; and `tests/lint/legacyReaderShapeScan.test.js:61` would keep passing either way, so the change would not even be pinned by the suite that exists. ⭐ **The hazard is real but its cure is not in the frozen file** — §8.3 names the cure that is.

---

## 6. ⭐ A SECOND REGISTER THE BRIEF DOES NOT NAME

`scripts/lib/writer-reach-scan.mjs:63` imports **`buildIndex, makeResolver` from the byte-frozen detector** and drives them at `:356–358`. So the OSR register is not the only consumer of this resolver, and the widening (or P1a, or `minRows`) would move the **writer-reach** verdicts too. That register defends itself against exactly this and says so:

> `/** The DETECTOR digest — this module plus the OSR libs it borrows. R9's cure: a`
> ` *  future OSR schema migration changing `buildIndex`/`makeResolver`/`foldCorpus``
> ` *  signatures is NAMED as drift rather than silently changing the verdicts. */`

`DETECTOR_SOURCES` (`:600–606`) lists `scripts/lib/legacy-reader-shape-scan.mjs`, and `scripts/.writer-reach-baseline.json` pins `detectorDigest: a416334292deb…` plus `verdictDigest`, `registerDigest`, `reviewableDarkCount: 495` and a 1,290-entry `darkUnregistered` roster. **Any detector change therefore owes a writer-reach re-freeze as well as an OSR one**, and the rung's "every pin that moves" list is one register longer than the brief states. (CONFIRMED by source; the writer-reach delta itself is **NOT MEASURED** — pricing it means running `check-writer-reach.mjs` under an armed detector, which the byte-freeze also refuses.)

---

## 7. THE MINT SEQUENCE FOR THE CHAIR

⛔ **Do not attempt a bundle that carries W, M3, MR or P1a. It will be refused at `validateMigrationBundle`, before the corpus is built, and the refusal will not name the reason clearly** — it arrives as `does not reconstruct governed Git blob 0310fa9f…` from a stack four frames deep in baseline validation.

### 7.1 The rung that IS mintable, in the schema-22 two-commit form

**Commit 1 — THE RUNG** (from a branch cut at the integration tip; the tip at compile time is `578272a99`):

```
git -C "$SP/slot-2" worktree add -b osr-schema-23-rung "$SP/<dock>" <INTEGRATION TIP>
```
Files, following `51d59d00b` exactly:
- `scripts/lib/observed-shape-baseline.mjs` — `BASELINE_SCHEMA` 22 → 23; `validateSchema23Baseline` live; `validateSchema22Baseline` re-bound to its own literal beside a new `RETIRED_<name>_BASELINE_SCHEMA = 22`.
- `scripts/migrate-observed-shape-readers.mjs` — target constant, delta paths, policy string, predecessor pairing (23 → 22), predecessor validator, transition-table entry, CLI default.
- `scripts/check-observed-shape-readers.mjs` — the live-validator binding, its `_doc`, its schema index, **plus M1 (§3.1) and M2 (§3.2)**.
- Tests ride **outside** the delta, as at 20/21/22: rung-number pins, a retired-22 fixture and its inverse probes, the pairing table, the CLI default message, both out-of-table probes moved up a rung (23 → 24), the declared-bank pins at 23.

⚠ **The delta paths are the same three bookkeeping files every rung moves**, and M1/M2 live inside one of them, so **the delta list does not grow** — which is what keeps this rung the cheap shape rather than the expensive one.

**Commit 2 — THE RE-FREEZE**, run from the clean committed rung (`$RUNG` = commit 1's sha), the CR-OSR-FREEZE-4 shape:

```
node scripts/check-observed-shape-readers.mjs --scan-only --scan-mode=legacy-leaf --json=<ext>/legacy.json
node scripts/migrate-observed-shape-readers.mjs --predecessor=<ext>/predecessor.json --legacy=<ext>/legacy.json \
     --target-schema=23 --json=<ext>/report.json --review-template=<ext>/review.template.json
#   … complete the ledger …
node scripts/migrate-observed-shape-readers.mjs --predecessor=… --legacy=… --target-schema=23 \
     --review=<ext>/review.completed.json --bundle=<ext>/bundle.json
node scripts/check-observed-shape-readers.mjs --write --migrate-schema=23 --migration-review=<ext>/bundle.json
```
Touching **one** file: `scripts/.observed-shape-readers-baseline.json`.

**Expected reconciliation for THIS rung: `predecessorGone: 0, predecessorNew: 0, predecessorIncreased: 0, predecessorDecreased: 0`** — it is verdict-only, like rungs 13–16 and 18. **Any non-zero is a STOP**: M1 and M2 change no verdict, so movement would mean the rung's own bookkeeping moved one.

⚠ **The genesis rule:** `validateBaselineHistory` requires `migrationReview.subjectSha` to be a **committed ancestor of HEAD** and reconstructs the whole receipt from that commit's tree. So the chain runs from the rung commit **on the lineage that will carry the register** — never cherry-picked (`check-observed-shape-readers.mjs:2366`, *"observed-shape migration genesis is not a committed ancestor of current HEAD"*).

⚠ **The tip stays ratchet-red for one commit, by construction**, exactly as at 21 and 22: the migration chain refuses a dirty tree, so the rung lands first and its re-freeze lands next.

### 7.2 The tests that must run after

- `tests/lint/observedShapeBaseline.test.js`, `observedShapeMigration.test.js`, `observedShapeSentinel.test.js` (the schema-22 rung ran these three as one batch → 120 passed).
- `tests/lint/observedShapeReaders.walker.test.js` **whole** — it carries TOOL-13b's erasure guard, which must be **GREEN with ERASED=0** under the shipped config (it is; §2.3).
- `tests/lint/legacyReaderShapeScan.test.js` — the byte-freeze itself, **unchanged and green**, which is the rung's proof that it did not touch the detector.
- `tests/lint` **whole** (LANE-PARALLEL §5; the lighting census is the one permitted red).
- `node scripts/check-observed-shape-readers.mjs` plain → `exactly matching the frozen inventory`.
- `npx eslint <the touched files>` **BARE**, never through the mutex.

### 7.3 Pins that move

| pin | moves? |
|---|---|
| `BASELINE_SCHEMA` | 22 → 23 |
| `scanStats` / `sentinel` in the baseline | **yes** — §3.3, the drift self-corrects here |
| `frozenAtSha`, `manifests.*`, `scannerProvenance.detectorDigest` | yes (the scanner file changed under the bump) |
| the frozen **inventory** and **identities** | **no** — verdict-only |
| `assertClassADebtPreserved`, `CLASS_A_PROTECTED_IDENTITIES` | **no** |
| `EXPLAINED_WRITER_EXEMPTIONS`, the bank literal, `rowTags` | **no** — nothing here is a declaration change |
| `scripts/.writer-reach-baseline.json` | **no** for this rung (the detector does not move); **yes** for any rung that moves it (§6) |
| the two goldens | **no** |

---

## 8. ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⛔⛔ **The rung's centrepiece is not expressible and the owner's word is what it needs.** Re-governing `legacy-reader-shape-scan.mjs` means re-pointing `LEGACY_ALGORITHM_BASE_SHA` / `LEGACY_ALGORITHM_BLOB_SHA` and three test literals, and it converts a historical-provenance claim into a self-referential one. → **OWNER'S DECISION POINT, with two named options: (a) re-govern the detector at a new blob, accepting that the freeze's meaning changes; (b) close the widening, P1a and MR with reason and keep the detector frozen.** Not a chair act. ODQ slot needed the same turn.
2. ⭐ **The header names FOUR roots, not six, and the brief says six.** `legacy-reader-shape-scan.mjs:309–316` omits `pulseResult` and `wizardNews` entirely. → **the launch template is the chair's to correct** so the next lane is not seeded with it (the same class as TOOL-13b §4.7's stale lighting tuple).
3. ⚠ **The widening RAISES a ceiling** (`institutionName on proposalPayload`, 1 → 2) and **no rung has ever reported `predecessorIncreased > 0`**. → **carry into any future widening charter as a declared, pre-measured consequence**, beside the thirteen.
4. ⭐ **`writer-reach-scan.mjs` is a second consumer of the frozen resolver** and pins it in `DETECTOR_SOURCES` + `scripts/.writer-reach-baseline.json`. → **any detector-change charter owes a writer-reach re-freeze**; its delta is unmeasured because the same freeze refuses the measurement.
5. **The raw-vs-post-filter convention is not stated anywhere it is used.** TOOL-13, TOOL-13b, the walker's guard and this compile all compare RAW detector rows against the POST-FILTER frozen inventory, which is why `ERASED=0 / NEW=69` at a green gate. → **one line in the walker's guard docblock**, so the next lane does not read 69 "new rows" as a ratchet failure.
6. **`minRows = 8` is a live hazard with zero victims** (§5). → **cure it OUTSIDE the frozen file**: a caller-side assertion in `check-observed-shape-readers.mjs` (`SCAN_CONFIG.minRows === MIN_ROWS`), or a `tests/lint` arm pinning that every `scanReaders`/`makeResolver` call site passes `MIN_ROWS`. Both are expressible today and neither touches the detector. ⚠ **Not built — this is a proposal.**
7. **M1's uninitialised-`let` split was NOT re-measured at this tip** (TOOL-13's 265 was taken at `141a1d775`). → **re-run `$SP/lane-tool-13-scratch/deep.mjs` at the mint tip before printing it**, or drop that split from M1.
8. **`src/components/` is still the worst-resolved slice, 5.18 % vs 7.94 % domain**, and it is exactly the CR-OSR-FREEZE-7 UNREVIEWED-UI cohort under full gate enforcement. → **owner/chair note beside CR-OSR-FREEZE-7**; unchanged from TOOL-13 §8.5 and re-measured here.
9. **97 raw addresses are dropped by the widening but only 13 rows reach zero** — the other 84 sit in rows whose post-filter ceiling is still met. → **relevant to any widening charter**: the row-level count understates how much the detector stops seeing.
10. **`scripts/lib/reader-shape-scan.mjs` (the EXACT instrument) is untouched and unexercised here**, reachable only via `--scan-only --scan-mode=exact-origin`. It remains the escape hatch for any single ambiguous read. → **noted as available, not evaluated** (unchanged from TOOL-13 §8.12).
11. ⚠ **`assertHealthyScanProvenance` is stricter for `exact-origin` than for `legacy-leaf`** (`:464` returns early for the leaf, skipping every traversal-loss check). Nothing here depends on it, but a future rung that promotes the exact leg inherits those checks unannounced. → **record beside `BASELINE_SCAN_MODE`.**

---

## 9. PROVENANCE

All apparatus in `$SP/lane-tool-13a-scratch/`, all read-only against `578272a99`:

| file | what it is |
|---|---|
| `govern-probe.mjs` → `govern-probe.out.txt` | the governance predicate run on every member's exact bytes, with the accepting control |
| `govern-compiled.out.txt` | the same predicate re-run on the COMPILED member FILES, single invocation, standing alone |
| `dump-corpus.mjs` → `corpus.json`, `corpus-build.out.txt` | the executed corpus at this tip (23,469 ms; 1,299 shapes, 6 roots) |
| `osr-report.txt` / `.err.txt` | the shipped `--report` at this tip (EXIT=0, stderr 0 lines) |
| `arms.mjs` → `arm-*.json` | the seven priced arms, each naming its erased rows |
| `grown.mjs` → `grown-W-roots.json`, `grown-W.out.txt` | the grown row, named, with its two sites and the class-(a) join |
| `reattribute.mjs` → `reattribution.json`, `reattribution.out.txt` | the address-exact re-triage of the thirteen |
| `anatomy2.mjs` → `anatomy2.json`, `anatomy2.out.txt` | M1's denominator figures, re-measured here |
| `diffs/member-{W,M3,MR,P1a,M2}.diff` | **each member's exact bytes**, as unified diffs against the tip |
| `diffs/legacy.{W,M3,MR,P1a}.mjs`, `diffs/checker.M2.mjs` | the compiled member files (all pass `node --check`) |
| `proto-detector.mjs`, `proto-run.mjs`, `erasure-measure.mjs`, `m12-measure.mjs` | COPIED from TOOL-13's and TOOL-13b's scratch (both left untouched) |

`git -C "$SP/read-tip-tool13a" status --short` → **0 lines**, before and after. `node_modules` in both the read tip and the scratch are symlinks to `$SP/slot-2/node_modules`. No gated run, no vitest, no eslint, no build, no `--write`, no `git` mutation, no write outside this scratch directory.
