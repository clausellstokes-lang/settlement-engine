# FIX-C2 — RECEIPT

**Lane** Opus FIX-C2 · **Chair** Fable 5.1, session a9df403c · **2026-09-20** (stamped 06:43 EDT, `date` read in the same call)
**Worktree** `$SP/lane-fix-c2` · **Branch** `fix-citations-2026-09-20` cut at `63e40fe57`
**Ruling** ODQ §934.47 addendum 44. **Composition onto the integration branch is the chair's.**

## Outcome

Built as ruled, red-first, green at the end. Two pathspec commits; `git status --short` EMPTY.

| sha | subject | files |
|---|---|---|
| `9af544fe7` | FIX-C2: a cited line number becomes a checkable claim — the source-citation walker, RED on 38 | 5 |
| `36c6b5a5c` | FIX-C2: 58 stale citation addresses re-addressed to the symbols they name, and the gate goes green | 32 |

`git show --stat` on each names only my paths. Neither commit was amended. The pre-commit hook
rewrote nothing (both commits landed exactly the files staged).

The lane-resume note `FIX-C2.lane-resume.md` is SPENT — its batch 1 ran and is quoted below.

---

## 1. What shipped

**`tests/lint/sourceCitationIntegrity.walker.test.js`** (292 lines) + **`tests/lint/sourceCitationIntegrity.shared.mjs`** (405) + **`tests/lint/.source-citation-baseline.json`** (347).

- **ARM 1 — EOF over `src/`/`tests`/`scripts`, GATE-WIRED, NO BASELINE.** A cited line past the
  end of the file it addresses. Zero false positives; reaches 100% of *resolvable* citations.
- **ARM 2 — EOF over docs-LIVE, shrink-only baseline.** 47 rows / 25 documents. A new row reds;
  a cleared row reds with "delete its entry". Holds the SET, never counts.
- **ARM 3 — SYMBOL, REPORT-ONLY.** Prints via `process.stdout.write` (measured necessity, §4).
- Six negative controls + a guard-the-guard + an arm that reds if the archival roster moves.
- Mutation row `citations/past-EOF address planted in live code` + sweep plant #112
  (`check_caught_planted`, untracked plant, no `MUTATED_FILES` row needed).

**Engine kept in a `.shared.mjs`** so a future baseline refresh runs the SHIPPED detector rather
than a second copy — the exact drift that let the tuning inventory's own addresses rot.

**Walk cost, measured from plain node over the same engine:** 5,202 code files + 510 docs files
in **1.4–4.9 s**. The gate cost is the vitest boot, not the walk.

## 2. The archival exclusion — measured, listed, committed

29 documents carrying **377 past-EOF citations** are excluded as frozen records. Four checkable
rules; full roster committed in `.source-citation-baseline.json` → `archivalExclusionAtFreeze.files`.

| rule | files | what it selects |
|---|---:|---|
| `tree` | 16 | `docs/review-r2/**`, `docs/shift-records/**` |
| `banner` | 7 | a **blockquote** status banner naming HISTORICAL in the opening 10 lines |
| `dated` | 5 | an ISO date in the filename |
| `sha-pin` | 1 | a header pinning the tree it describes (`**Snapshot base:**`) |

⛔ **The chair's "header pins a sha" rule, taken literally as a hex scan, was REFUTED by
measurement: it swallowed 269 of 493 documents** including live design specs
(`DESIGN_TOWN_CARTOGRAPHY`, `DESIGN_REALM_DIRECTIVES`, `SETTLEMENT_CAPABILITY_ATLAS`). Replaced by
the estate's own marker (`docs/README.md` §"HISTORICAL — point-in-time audit / plan / status
exhaust (not maintained)"). The blockquote is load-bearing: `docs/README.md` names HISTORICAL in
body prose while being the most live document in the tree.

**Bias is one-directional and deliberate:** a live doc wrongly baselined costs one row; a frozen
one wrongly excluded costs a permanent blind spot. Anything not provably frozen is INCLUDED.

## 3. Red-first, then green — every count line quoted

**RED-FIRST** (`tests/lint/sourceCitationIntegrity.walker.test.js`, uncured tree):

```
 Test Files  1 failed (1)
      Tests  1 failed | 11 passed (12)
```
ARM 1 named all seven `subsystemRowsWar.js` rows; ARM 3 printed
`SYMBOL ARM (report-only): 31 citation(s) whose named symbol is not on the cited line.`
**7 + 31 = the 38 live-code rows the measurement found.**

**AFTER THE CURE** — ARM 1 `7 → 0`, ARM 3 `31 → 2` (both survivors proven false positives, §5).

| gate | result |
|---|---|
| `tests/lint` WHOLE (first run, mid-cure) | `Tests 3 failed | 2785 passed (2788)` |
| `tests/lint` WHOLE (after the census re-take) | `Tests 1 failed | 2787 passed (2788)` — the one red is the lighting census, expected, NOT refrozen |
| walker + proseWiringCensus + negativeAssertionAnchor + mutationCoverageManifest | `Tests 109 passed (109)` |
| `tests/copy/voiceMechanics.test.js` | `Tests 30 passed (30)` |
| `tests/components/handbookVoice + warFaithSurfacing` | `Tests 24 passed (24)` |
| `tests/domain/convergence.test.js` | `Tests 47 passed (47)` |
| `tests/ui/mountFirstPaint.test.jsx` | `Tests 5 passed (5)` |
| `tests/scripts/implementationSession.test.js` | `Tests 10 passed (10)` |
| `npx eslint` on all 33 touched JS files | exit 0, no output |
| `node scripts/wiring-census.mjs --check` | `verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files` |

Every vitest line ran through `gate-mutex.sh --run`, SHARED tier, `--maxWorkers=2`, both exports
spelled inline, one directory per invocation. Every line printed a count.

**GOLDENS UNMOVED** — identical before the first edit and after the last commit:
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

**LIGHTING CENSUS — MEASURED, NEVER REFROZEN.** Committed baseline at my base:
`2650·383·2267·25028·6677` (taken out of tree at `32602dc60`). Measured here: **files 2652**.
⚠ **ONE OF THAT +2 ALREADY DRIFTED AT MY BASE** — `git ls-tree -r HEAD -- tests` counts **2651**
`*.test.(js|jsx)` at `63e40fe57` *before any edit of mine*. **MY DELTA: +1 file, +12 test titles,
+2 suite titles, 0 lighting markers.** The walker halts on the first figure, so
parked/credited/titles/suiteTitles are unmeasured here. The chair's newly frozen tuple
`2652·383·2269·25043·6679` is on a newer base; my +1 file / +12 titles / +2 suites apply ON TOP.

## 4. Two defects found in my own instrument before it shipped

1. **A cited RANGE is an INTERVAL, not its endpoints.** `tuningRegister.walker.test.js:75-91`
   names a constant declared at `:84`; an endpoints-only reader called that true citation stale.
2. **PascalCase is a real symbol shape here.** Without it the `Collapsible` propagation —
   the sharpest case in the census — is invisible.
   With both corrected the walker convicts exactly **38**, matching the recon's count.

**And one in the reporting channel.** Under vitest 4.1.8's DEFAULT reporter a **passing** test's
`console.log` is **DROPPED**. Probed on this tree with both channels in one passing test:
`process.stdout.write` survived the default reporter AND `--reporter=verbose`; `console.log` only
the latter. A report-only arm whose report nobody can read is a false instrument — the class this
walker exists for. ARM 3 uses `process.stdout.write`, with the measurement recorded beside it.

## 5. ⛔ The symbol arm has a measured false-positive rate, and I acted on one

Of ARM 3's 31 first-run findings, **one was wrong**, in the way this arm is structurally able to
be wrong: **a neighbouring backtick wins the attribution.**

- `scripts/wiring-census.mjs:349` cites `defenseGenerator.js:189-191` for a `milUpkeepMult`
  derivation, with `economicGates.military` backticked beside it. The arm attributed
  `economicGates` (declared `:467`/`:647`) and convicted a citation that was **TRUE** —
  `:189-191` IS `const milUpkeepMult = Math.min(1, 0.6 + (econOutput / 50) * 0.4);` + 2 lines.
  **My automated cure had already broken it. Only reading the staged diff line by line caught it.**
  REVERTED.
- `tests/lint/dossierMountRegistry.walker.test.js:1287` cites `Primitives.jsx:120` (`Section`)
  with `Collapsible` backticked beside it. Both addresses on that line are now correct; the arm
  still reports it. Left as-is.

Two range citations audited in the same pass went the **other** way and were genuinely stale
(`EconomicsTab.jsx:251-257` is the component opening; `OverviewTab.jsx:120-134` is `StatusTag`).
**The lesson is not "ranges are safe": a span addresses what its sentence says it addresses, and
only a reader knows which name that is.** Recorded in the walker's header; the arm must never gate.

One further correction from that audit: `viabilityVerdict.js:66` names BOTH `verdict` and
`verdictTone`, so `:586-587` became **`:587-588`**, not a bare `:588`.

## 6. The cure — 58 addresses, 33 files, ZERO lines added or removed

Verified per file: `git show HEAD:<f> | wc -l` equals `wc -l <f>` for all 32 re-addressed files,
so **no line-addressed baseline in the estate can drift behind this commit.**

**The seven past-EOF certification rows** (`warDeployment.js` decomposed into `warHomeCosts.js` /
`warSiegeVerdict.js`; its evidence kept naming the old module at the old line, as far as `:2133`
in a 1,338-line file):

| at | was | now | the symbol on the new line |
|---|---|---|---|
| `:68` | `warDeployment.js:1539` | `:829` | `candidateType: 'conquest'` |
| `:69` | calls at `2000/2014/2033/2054/2101` | `warHomeCosts.js:486/500/519/540/587` | war_drain · army_deployed · reinforcement_cost · war_exhaustion ×2 |
| `:79` | `warDeployment.js:1492` | `:854` | `archetype: 'war_pressure'` |
| `:162` | `warDeployment.js:1877` | `warHomeCosts.js:365` | `candidateType: 'war_conscription'` |
| `:195` | `warDeployment.js:1970` | `warHomeCosts.js:458` | `candidateType: 'war_levy'` |
| `:229` | `warDeployment.js:1518` | `:810` | the `computeSackTransfer(...)` call site |
| `:230` | `computeSackFoodTransfer, 1526` | `816` | the `computeSackFoodTransfer({` call site |

⛔ **Two are shipped EXECUTABLE STRINGS** — the `other:` evidence prose of certification rows —
and their meaning moves **beyond the number**, so both are quoted whole in `36c6b5a5c`'s body:
`:171` `'…(read at warDeployment.js:1281, inside the gate at 1082)'` → `'…:470 … at 243'`, and in
the same string `'warDeployment.js:1877 stamps recordMode state_only'` → `'warHomeCosts.js:365
stamps'` — **a module name changes inside shipped certification evidence**, because the emitter
moved. `:292` `'…:1280 … a final prune at warDeployment.js:2133'` → `':469' … ':1334'`.
A third shipped string moves at `dossierMountRegistry.walker.test.js:2092` — an assertion MESSAGE
with no asserting consumer (grepped before editing).

**The propagation.** `Primitives.jsx`'s `{open && children}` moved six lines when six were
inserted above it: **12 addresses across 7 files** went stale together — `:114`→`:120`
(`Section`, declared `:96`) and `:83`→`:89` (`Collapsible`, declared `:67`).

**The instrument that could not keep its own addresses true** — `scripts/count-tuning-inventory.mjs`:
`populationDynamics.js:306`→`:307` (`:306` is the **DISEASE** arm; the WAR_CRISIS rate press is
`:307` — off by one INTO THE WRONG SEMANTIC ARM), `coup.js:134`→`:123` (the `/400` divisor, off by
11). `:327` was exact and is untouched. `realHome` does not reach the committed
`.tuning-inventory.json` (grep: 0 hits), so no census regeneration follows.

## 7. Judgment call — the wiring-census stamp

Comment edits to two **stamped** composers (`generalStateProse.js`, `dossierMounts.js`) staled the
census stamp. `scripts/wiring-census.mjs` named its own door. Re-taken: the diff is **exactly two
sha lines**; no pool, variant, relation row or section moved. *Alternative rejected:* reverting
those two re-addresses and reporting them blocked — which would leave six known-false addresses in
composers to satisfy a stamp. *Reverse by* reverting the composer comments and re-running
`node scripts/wiring-census.mjs`.

## 8. Registers this lane will move when composed (as DELTAS)

- **Lighting census:** +1 test file, +12 test titles, +2 suite titles, 0 lighting markers.
  ⛔ Not refrozen — the refreeze is the train's terminal act and the chair's.
- **Mutation-coverage manifest:** +1 `invariants` entry; `uncoveredBaseline` **unchanged** (186) —
  the row is `kind: "mutation"`, not `uncovered`.
- **Mutation sweep:** +1 plant (#112). Sweep-label floor `>= 121` still satisfied (now +1).
- **`docs/content/wiring-census.json`:** 2 sha lines. ⚠ A shared artifact — if another lane
  re-takes it the merge is trivial (re-run the script).
- **New shrink-only baseline** `tests/lint/.source-citation-baseline.json`: 47 rows, 25 documents.

---

# 9. COMPOSITION onto `fixes-2026-09-18-consist` (train EM-T4, first composition)

Composed in `$SP/slot-2` at the chair's direction, 2026-09-20. Pre-compose tip `fff247009`,
`git status --short` EMPTY before and after.

| slot sha | from | subject | files |
|---|---|---|---|
| `0976d664b` | `9af544fe7` | the source-citation walker, RED on 38 | 5 |
| `ee2406191` | `36c6b5a5c` | 58 addresses re-addressed, the gate goes green | 32 |

**⚠ THE CONFLICT WAS NOT THE ONE FORESEEN.** `docs/content/wiring-census.json` **auto-merged
cleanly** (my two composer shas and the chair's `producerIndexFiles` 1171→1172 sit in different
parts of the file) — no `--ours` + regenerate was needed. I did NOT trust the auto-merge of a
generated file: `node scripts/wiring-census.mjs --check` at the composed tip returns
`verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files`.

**The real conflict was `scripts/mutation-sweep.sh`:** EM-B1k2 had landed its own plant **also
numbered #112** (`irreversible-raw-roster/…`). Resolved by keeping BOTH — the branch's #112 first,
mine renumbered **#113** and appended. `sh -n` OK; both `check_caught` lines present; the manifest
auto-merged and carries both rows (712 invariants, `uncoveredBaseline` unchanged at 186; labels
remain unique, so the one-to-one label join holds).

`scripts/wiring-census.mjs` is correctly ABSENT from the 32: my edit there was reverted in the
same commit (the false positive of §5), so its net diff is zero.

## Re-proof at the composed tip — every count line

| gate | result |
|---|---|
| `tests/lint/sourceCitationIntegrity.walker.test.js` | `Tests 12 passed (12)` — ARM 1 **0 reds**, ARM 2 baseline still exact, ARM 3 prints 3 |
| `tests/copy/voiceMechanics.test.js` | `Tests 30 passed (30)` |
| `tests/components/handbookVoice + warFaithSurfacing` | `Tests 24 passed (24)` |
| `tests/domain/convergence.test.js` | `Tests 47 passed (47)` |
| `tests/ui/mountFirstPaint.test.jsx` | `Tests 5 passed (5)` |
| `tests/scripts/implementationSession.test.js` | `Tests 10 passed (10)` |
| **`tests/lint` WHOLE** | **`Tests 1 failed | 2790 passed (2791)`** — the ONE red is the lighting census |
| `npx eslint` (32 touched files) | exit 0, no output |
| `node scripts/wiring-census.mjs --check` | `verified 708 pools / 2266 variants / 165 relation rows` |

**LIGHTING — the printed tuple, and the delta accounted for exactly. NOT REFROZEN.**
Committed register at the tip: `2653·383·2270·25052·6680` (measured at `7c233db55`).
Printed assertion: `the estate's file count moved — re-measure, do not re-word: expected 2656 to be 2653`.
Decomposition by `git ls-tree -r <ref> -- tests`:
  · `fff247009` (pre-compose tip) already counts **2655** `*.test.(js|jsx)` — **+2 drift existed
    before I composed anything**
  · composed HEAD counts **2656** — **MY DELTA IS +1 FILE**, +12 test titles, +2 suite titles,
    0 lighting markers.

**ARM 3 at the composed tip prints 3** — my two documented false positives
(`dossierMountRegistry.walker.test.js:1287`, `wiring-census.mjs:349`) plus ONE NEW LEAD on branch
code I never touched: `tests/domain/roadsParticipation.test.js:415` cites `npcVerdictPulse.js:133`
for `replacementSource`, which is declared at `:99`. Report-only, and a LEAD not a verdict.
